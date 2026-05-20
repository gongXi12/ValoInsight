import { EventEmitter } from 'events'
import axios, { AxiosInstance } from 'axios'
import WebSocket from 'ws'
import { BaseShard } from './base'
import { findLockfile } from '../utils/lockfile'
import { LOCKFILE_POLL_INTERVAL, API_TIMEOUT } from '@shared/constants'
import type { LockfileData, ConnectionState, GameFlowPhase } from '@shared/types'

/**
 * Manages connection to the Valorant local client API.
 * Handles lockfile detection, HTTP client creation, and WebSocket events.
 */
export class ValorantClientShard extends BaseShard {
  readonly name = 'valorant-client'

  private lockfile: LockfileData | null = null
  private httpClient: AxiosInstance | null = null
  private ws: WebSocket | null = null
  private pollTimer: ReturnType<typeof setInterval> | null = null
  private _state: ConnectionState = 'disconnected'
  private _gameFlowPhase: GameFlowPhase = 'None'

  readonly events = new EventEmitter()

  get state(): ConnectionState {
    return this._state
  }

  get gameFlowPhase(): GameFlowPhase {
    return this._gameFlowPhase
  }

  get isConnected(): boolean {
    return this._state === 'connected'
  }

  /** Get the authenticated Axios instance for making API calls */
  get api(): AxiosInstance | null {
    return this.httpClient
  }

  async onInit(): Promise<void> {
    this.startPolling()
  }

  async onDispose(): Promise<void> {
    this.stopPolling()
    this.disconnect()
  }

  /** Start polling for the lockfile */
  private startPolling(): void {
    if (this.pollTimer) return
    this.pollTimer = setInterval(() => this.checkLockfile(), LOCKFILE_POLL_INTERVAL)
    this.checkLockfile() // immediate first check
  }

  private stopPolling(): void {
    if (this.pollTimer) {
      clearInterval(this.pollTimer)
      this.pollTimer = null
    }
  }

  /** Check if lockfile exists and connect if needed */
  private async checkLockfile(): Promise<void> {
    const lockfile = await findLockfile()

    if (!lockfile) {
      if (this._state !== 'disconnected') {
        this.disconnect()
      }
      return
    }

    // Check if we need to reconnect (new client session)
    if (
      this._state === 'disconnected' ||
      this.lockfile?.port !== lockfile.port ||
      this.lockfile?.password !== lockfile.password
    ) {
      this.lockfile = lockfile
      await this.connect()
    }
  }

  /** Establish connection to the Valorant client API */
  private async connect(): Promise<void> {
    if (!this.lockfile) return

    this._state = 'connecting'
    this.events.emit('state-change', this._state)

    const baseURL = `https://127.0.0.1:${this.lockfile.port}`
    const auth = Buffer.from(`riot:${this.lockfile.password}`).toString('base64')

    this.httpClient = axios.create({
      baseURL,
      timeout: API_TIMEOUT,
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      // Valorant uses self-signed certificates
      httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false }),
    })

    // Verify connection
    try {
      await this.httpClient.get('/product-session/v1/external-sessions')
      this._state = 'connected'
      this.events.emit('state-change', this._state)
      this.connectWebSocket()
    } catch {
      this._state = 'disconnected'
      this.events.emit('state-change', this._state)
    }
  }

  /** Connect to the WebSocket for real-time events */
  private connectWebSocket(): void {
    if (!this.lockfile) return

    const wsUrl = `wss://127.0.0.1:${this.lockfile.port}/?auth=${this.lockfile.password}&encoding=json`

    this.ws = new WebSocket(wsUrl, {
      rejectUnauthorized: false,
    })

    this.ws.on('open', () => {
      // Subscribe to game flow events
      this.ws?.send(JSON.stringify([5, 'OnJsonApiEvent_lol-gameflow_v1_gameflow-phase']))
    })

    this.ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString())
        if (Array.isArray(message) && message.length >= 3) {
          const [, eventType, eventData] = message
          if (eventType === 'OnJsonApiEvent_lol-gameflow_v1_gameflow-phase') {
            const phase = eventData?.data as GameFlowPhase
            if (phase && phase !== this._gameFlowPhase) {
              this._gameFlowPhase = phase
              this.events.emit('gameflow-phase', phase)
            }
          }
        }
      } catch {
        // Ignore malformed messages
      }
    })

    this.ws.on('close', () => {
      this.events.emit('ws-close')
    })

    this.ws.on('error', () => {
      this.events.emit('ws-error')
    })
  }

  /** Disconnect from the Valorant client */
  private disconnect(): void {
    if (this.ws) {
      this.ws.removeAllListeners()
      this.ws.close()
      this.ws = null
    }
    this.httpClient = null
    this.lockfile = null
    this._state = 'disconnected'
    this._gameFlowPhase = 'None'
    this.events.emit('state-change', this._state)
  }

  /** Make an authenticated GET request to the local API */
  async get<T = unknown>(path: string): Promise<T> {
    if (!this.httpClient) {
      throw new Error('Not connected to Valorant client')
    }
    const response = await this.httpClient.get<T>(path)
    return response.data
  }

  /** Make an authenticated POST request to the local API */
  async post<T = unknown>(path: string, data?: unknown): Promise<T> {
    if (!this.httpClient) {
      throw new Error('Not connected to Valorant client')
    }
    const response = await this.httpClient.post<T>(path, data)
    return response.data
  }
}
