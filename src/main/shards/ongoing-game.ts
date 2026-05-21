import { EventEmitter } from 'events'
import axios from 'axios'
import { BaseShard } from './base'
import { ValorantClientShard } from './valorant-client'
import { PartyDetectorShard } from './party-detector'
import { HenrikApiShard } from './henrik-api'
import { PLAYER_CACHE_SIZE, TIER_NAMES, API_TIMEOUT } from '@shared/constants'
import type {
  GameFlowPhase,
  PregamePlayer,
  PregameMatch,
  PlayerMMR,
  PartyGroup,
} from '@shared/types'

/** Enriched player data sent to the renderer */
export interface EnrichedPlayer {
  puuid: string
  displayName: string
  tagLine: string
  teamId: string
  characterId: string
  characterSelectionState: string
  competitiveTier: number
  tierName: string
  accountLevel: number
  playerCardId: string
  partyId: string
  partyColor: string | null
  mmr: PlayerMMR | null
  recentMatches: {
    wins: number
    losses: number
    kills: number
    deaths: number
    assists: number
  } | null
}

/** Data emitted when pregame data is ready */
export interface PregameData {
  matchId: string
  mapId: string
  modeId: string
  state: string
  allyPlayers: EnrichedPlayer[]
  enemyPlayers: EnrichedPlayer[]
  parties: PartyGroup[]
  localPlayerPuuid: string
}

/**
 * Orchestrates data collection during the agent select (pregame) phase.
 * Collects player data, detects parties, fetches match history.
 */
export class OngoingGameShard extends BaseShard {
  readonly name = 'ongoing-game'

  private valorantClient: ValorantClientShard
  private partyDetector: PartyDetectorShard
  private henrikApi: HenrikApiShard
  private currentMatchId: string | null = null
  private region: string = 'ap'
  private cachedToken: { token: string; accessToken: string } | null = null

  readonly events = new EventEmitter()

  constructor(
    valorantClient: ValorantClientShard,
    partyDetector: PartyDetectorShard,
    henrikApi: HenrikApiShard
  ) {
    super()
    this.valorantClient = valorantClient
    this.partyDetector = partyDetector
    this.henrikApi = henrikApi
  }

  async onInit(): Promise<void> {
    this.valorantClient.events.on('gameflow-phase', (phase: GameFlowPhase) => {
      this.handleGameFlowPhase(phase)
    })
  }

  async onDispose(): Promise<void> {
    this.currentMatchId = null
  }

  /** Set the region for API calls. Resolves 'auto' to 'ap'. */
  setRegion(region: string): void {
    this.region = region === 'auto' ? 'ap' : region
    this.cachedToken = null
  }

  private async handleGameFlowPhase(phase: GameFlowPhase): Promise<void> {
    if (phase === 'CharacterSelectPersistent' || phase === 'PREGAME') {
      await this.collectPregameData()
    } else if (phase === 'InProgress') {
      this.currentMatchId = null
      this.events.emit('game-started')
    } else if (phase === 'EndOfGame' || phase === 'Lobby' || phase === 'None') {
      this.currentMatchId = null
      this.events.emit('pregame-ended')
    }
  }

  /** Collect all pregame data and emit to renderer */
  private async collectPregameData(): Promise<void> {
    try {
      // Get current player info
      const playerInfo = await this.valorantClient.get<{ Subject: string }>(
        '/pregame/v1/pregame-player'
      )
      if (!playerInfo?.Subject) return

      const localPlayerPuuid = playerInfo.Subject

      // Get full pregame match data
      const pregameMatch = await this.getMatchForPlayer(localPlayerPuuid)
      if (!pregameMatch) return

      // Skip if same match (avoid duplicate processing)
      if (pregameMatch.ID === this.currentMatchId) return
      this.currentMatchId = pregameMatch.ID

      // Detect parties
      const allPlayers = [
        ...pregameMatch.AllyTeam.Players,
        ...pregameMatch.EnemyTeam.Players,
      ]
      const parties = this.partyDetector.detectParties(allPlayers)

      // Enrich player data in parallel
      const [allyPlayers, enemyPlayers] = await Promise.all([
        this.enrichPlayers(pregameMatch.AllyTeam.Players, parties),
        this.enrichPlayers(pregameMatch.EnemyTeam.Players, parties),
      ])

      const pregameData: PregameData = {
        matchId: pregameMatch.ID,
        mapId: pregameMatch.pregameMatch?.MapID || '',
        modeId: pregameMatch.pregameMatch?.ModeID || '',
        state: pregameMatch.pregameMatch?.State || '',
        allyPlayers,
        enemyPlayers,
        parties,
        localPlayerPuuid,
      }

      this.events.emit('pregame-data', pregameData)
    } catch (error) {
      console.error('Failed to collect pregame data:', error)
    }
  }

  /** Get the pregame match for a player */
  private async getMatchForPlayer(puuid: string): Promise<PregameMatch | null> {
    try {
      const playerData = await this.valorantClient.get<{ MatchID?: string }>(
        `/pregame/v1/players/${puuid}`
      )
      if (!playerData?.MatchID) return null

      const match = await this.valorantClient.get<PregameMatch>(
        `/pregame/v1/matches/${playerData.MatchID}`
      )
      return match
    } catch {
      return null
    }
  }

  /** Get entitlement token from local client, with caching */
  private async getEntitlementToken(): Promise<{ token: string; accessToken: string } | null> {
    if (this.cachedToken) return this.cachedToken
    const token = await this.valorantClient.getEntitlementToken()
    if (token) this.cachedToken = token
    return token
  }

  /** Fetch match history directly from Riot's backend API */
  private async fetchRiotMatchHistory(
    puuid: string
  ): Promise<{ wins: number; losses: number; kills: number; deaths: number; assists: number } | null> {
    try {
      const token = await this.getEntitlementToken()
      if (!token) return null

      const region = this.region
      const url = `https://pd.${region}.a.pvp.net/match-history/v1/users/${puuid}?startIndex=0&endIndex=25`

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          'X-Riot-Entitlements-JWT': token.token,
          'Content-Type': 'application/json',
        },
        timeout: API_TIMEOUT,
      })

      const history = response.data
      if (!history?.History) return null

      const recent = history.History.slice(0, 5)
      let wins = 0
      let losses = 0
      let kills = 0
      let deaths = 0
      let assists = 0

      for (const match of recent) {
        // Fetch match details for stats
        try {
          const detailUrl = `https://pd.${region}.a.pvp.net/match-details/v1/matches/${match.MatchID}`
          const detailRes = await axios.get(detailUrl, {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
              'X-Riot-Entitlements-JWT': token.token,
            },
            timeout: API_TIMEOUT,
          })
          const detail = detailRes.data
          const playerData = detail?.players?.find((p: { Subject: string }) => p.Subject === puuid)
          if (playerData?.stats) {
            kills += playerData.stats.kills || 0
            deaths += playerData.stats.deaths || 0
            assists += playerData.stats.assists || 0
            const playerTeam = playerData.teamId
            const teamResult = detail?.teams?.find((t: { teamId: string }) => t.teamId === playerTeam)
            if (teamResult?.won) {
              wins++
            } else {
              losses++
            }
          }
        } catch {
          // Individual match fetch failed, skip
        }
      }

      return { wins, losses, kills, deaths, assists }
    } catch {
      return null
    }
  }

  /** Enrich a list of players with MMR and match history data */
  private async enrichPlayers(
    players: PregamePlayer[],
    parties: PartyGroup[]
  ): Promise<EnrichedPlayer[]> {
    const enriched = await Promise.allSettled(
      players.map((player) => this.enrichPlayer(player, parties))
    )

    return enriched
      .filter(
        (result): result is PromiseFulfilledResult<EnrichedPlayer> =>
          result.status === 'fulfilled'
      )
      .map((result) => result.value)
  }

  /** Enrich a single player with MMR and match history */
  private async enrichPlayer(
    player: PregamePlayer,
    parties: PartyGroup[]
  ): Promise<EnrichedPlayer> {
    const partyColor = this.partyDetector.getPlayerPartyColor(player.Subject, parties)

    // Fetch MMR data
    let mmr: PlayerMMR | null = null
    try {
      mmr = await this.valorantClient.get<PlayerMMR>(
        `/mmr/v1/player/${player.Subject}`
      )
    } catch {
      // MMR fetch failed, continue without it
    }

    // Fetch recent match stats via Riot API (works for all regions including CN)
    let recentMatches: EnrichedPlayer['recentMatches'] = null
    try {
      recentMatches = await this.fetchRiotMatchHistory(player.Subject)
    } catch {
      // Match history fetch failed, continue without it
    }

    return {
      puuid: player.Subject,
      displayName: player.PlayerIdentity?.Subject || 'Unknown',
      tagLine: '',
      teamId: player.TeamID,
      characterId: player.CharacterID,
      characterSelectionState: player.CharacterSelectionState || '',
      competitiveTier: player.CompetitiveTier,
      tierName: TIER_NAMES[player.CompetitiveTier] || 'Unknown',
      accountLevel: player.PlayerIdentity?.AccountLevel || 0,
      playerCardId: player.PlayerIdentity?.PlayerCardID || '',
      partyId: player.PartyID,
      partyColor,
      mmr,
      recentMatches,
    }
  }
}
