import axios, { AxiosInstance } from 'axios'
import { BaseShard } from './base'
import { API_TIMEOUT } from '@shared/constants'

const HENRIK_BASE_URL = 'https://api.henrikdev.xyz'

/**
 * Wrapper for the HenrikDev unofficial Valorant API.
 * Used for match history and detailed player stats.
 */
export class HenrikApiShard extends BaseShard {
  readonly name = 'henrik-api'

  private client: AxiosInstance

  constructor() {
    super()
    this.client = axios.create({
      baseURL: HENRIK_BASE_URL,
      timeout: API_TIMEOUT,
    })
  }

  async onInit(): Promise<void> {}
  async onDispose(): Promise<void> {}

  /**
   * Get match history for a player.
   * @param region - e.g., 'ap', 'na', 'eu', 'kr'
   * @param puuid - Player's PUUID
   * @param mode - Game mode filter (optional): 'competitive', 'unrated', etc.
   */
  async getMatchHistory(
    region: string,
    puuid: string,
    mode?: string
  ): Promise<HenrikMatchHistoryResponse | null> {
    try {
      const params = mode ? { mode } : undefined
      const response = await this.client.get<HenrikMatchHistoryResponse>(
        `/valorant/v3/by-puuid/matches/${region}/${puuid}`,
        { params }
      )
      return response.data
    } catch {
      return null
    }
  }

  /**
   * Get MMR (rank) data for a player.
   */
  async getMMR(region: string, puuid: string): Promise<HenrikMMRResponse | null> {
    try {
      const response = await this.client.get<HenrikMMRResponse>(
        `/valorant/v2/by-puuid/mmr/${region}/${puuid}`
      )
      return response.data
    } catch {
      return null
    }
  }

  /**
   * Get account info by PUUID.
   */
  async getAccountByPuuid(puuid: string): Promise<HenrikAccountResponse | null> {
    try {
      const response = await this.client.get<HenrikAccountResponse>(
        `/valorant/v1/by-puuid/account/${puuid}`
      )
      return response.data
    } catch {
      return null
    }
  }
}

/** HenrikDev API response types */
export interface HenrikMatchHistoryResponse {
  status: number
  data: HenrikMatch[]
}

export interface HenrikMatch {
  metadata: {
    map: string
    game_version: string
    game_length: number
    game_start: number
    game_start_patched: string
    rounds_played: number
    mode: string
    queue: string
    season_id: string
    platform: string
    matchid: string
    premier_info: object
    region: string
    cluster: string
  }
  players: {
    all_players: HenrikPlayer[]
    red: HenrikPlayer[]
    blue: HenrikPlayer[]
  }
  teams: {
    red: HenrikTeam
    blue: HenrikTeam
  }
  rounds: object[]
}

export interface HenrikPlayer {
  puuid: string
  name: string
  tag: string
  team: string
  level: number
  character: string
  currenttier: number
  currenttier_patched: string
  player_card: string
  player_title: string
  party_id: string
  session_playtime: {
    minutes: number
    seconds: number
    milliseconds: number
  }
  behavior: {
    afk_rounds: number
    friendly_fire: object
    rounds_in_spawn: number
  }
  platform: {
    type: string
    os: {
      name: string
      version: string
    }
  }
  ability_casts: {
    c_cast: number
    q_cast: number
    e_cast: number
    x_cast: number
  }
  stats: {
    score: number
    kills: number
    deaths: number
    assists: number
    bodyshots: number
    headshots: number
    legshots: number
  }
  economy: {
    spent: {
      overall: number
      average: number
    }
    loadout_value: {
      overall: number
      average: number
    }
  }
  damage_made: number
  damage_received: number
}

export interface HenrikTeam {
  has_won: boolean
  rounds_won: number
  rounds_lost: number
}

export interface HenrikMMRResponse {
  status: number
  data: {
    current_data: {
      currenttier: number
      currenttier_patched: string
      images: {
        small: string
        large: string
        triangle_down: string
      }
      ranking_in_tier: number
      mmr_change_to_last_game: number
      elo: number
      name: string
      tag: string
    }
    by_season: Record<string, {
      error: string | null
      current: number
      wins: number
      number_of_games: number
    }>
  }
}

export interface HenrikAccountResponse {
  status: number
  data: {
    puuid: string
    region: string
    account_level: number
    name: string
    tag: string
    card: {
      small: string
      large: string
      wide: string
      id: string
    }
    last_update: number
    last_update_raw: number
  }
}
