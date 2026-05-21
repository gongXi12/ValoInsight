import { app, BrowserWindow, ipcMain } from 'electron'
import { ValorantClientShard } from './shards/valorant-client'
import { PartyDetectorShard } from './shards/party-detector'
import { HenrikApiShard } from './shards/henrik-api'
import { OngoingGameShard } from './shards/ongoing-game'
import { WindowManagerShard } from './shards/window-manager'
import { TrayShard } from './shards/tray'
import type { ConnectionState, GameFlowPhase } from '@shared/types'

let currentRegion = 'auto'

// Initialize shards
const valorantClient = new ValorantClientShard()
const partyDetector = new PartyDetectorShard()
const henrikApi = new HenrikApiShard()
const ongoingGame = new OngoingGameShard(valorantClient, partyDetector, henrikApi)
const windowManager = new WindowManagerShard()
const tray = new TrayShard(valorantClient, windowManager)

app.whenReady().then(async () => {
  // Forward events to renderer via IPC
  valorantClient.events.on('state-change', (state: ConnectionState) => {
    windowManager.getMainWindow()?.webContents.send('valorant:state-change', state)
  })

  valorantClient.events.on('gameflow-phase', (phase: GameFlowPhase) => {
    windowManager.getMainWindow()?.webContents.send('valorant:gameflow-phase', phase)
    windowManager.getOverlayWindow()?.webContents.send('valorant:gameflow-phase', phase)
  })

  ongoingGame.events.on('pregame-data', (data) => {
    windowManager.showOverlay()
    windowManager.getOverlayWindow()?.webContents.send('game:pregame-data', data)
    windowManager.getMainWindow()?.webContents.send('game:pregame-data', data)
  })

  ongoingGame.events.on('pregame-ended', () => {
    windowManager.hideOverlay()
    windowManager.getMainWindow()?.webContents.send('game:pregame-ended')
  })

  ongoingGame.events.on('game-started', () => {
    windowManager.hideOverlay()
    windowManager.getMainWindow()?.webContents.send('game:started')
  })

  // IPC handlers for renderer to query state
  ipcMain.handle('valorant:get-connection-state', () => {
    return valorantClient.state
  })

  ipcMain.handle('valorant:get-gameflow-phase', () => {
    return valorantClient.gameFlowPhase
  })

  // Region settings IPC
  ipcMain.handle('settings:get-region', () => {
    return currentRegion
  })

  ipcMain.handle('settings:set-region', (_event, region: string) => {
    currentRegion = region
    ongoingGame.setRegion(region)
  })

  // Window control IPC handlers
  ipcMain.on('window:minimize', () => {
    const win = BrowserWindow.getFocusedWindow()
    win?.minimize()
  })

  ipcMain.on('window:maximize', () => {
    const win = BrowserWindow.getFocusedWindow()
    if (win?.isMaximized()) {
      win.unmaximize()
    } else {
      win?.maximize()
    }
  })

  ipcMain.on('window:close', () => {
    const win = BrowserWindow.getFocusedWindow()
    win?.close()
  })

  // Initialize all shards
  await valorantClient.onInit()
  await partyDetector.onInit()
  await henrikApi.onInit()
  await ongoingGame.onInit()
  await windowManager.onInit()
  await tray.onInit()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      windowManager.onInit()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', async () => {
  await tray.onDispose()
  await windowManager.onDispose()
  await ongoingGame.onDispose()
  await henrikApi.onDispose()
  await partyDetector.onDispose()
  await valorantClient.onDispose()
})
