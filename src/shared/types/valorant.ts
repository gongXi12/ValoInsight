/** Lockfile data parsed from the Valorant client */
export interface LockfileData {
  name: string
  pid: number
  port: number
  password: string
  protocol: string
}

/** Connection state to the Valorant client */
export type ConnectionState = 'disconnected' | 'connecting' | 'connected'

/** Game flow phases from WebSocket events */
export type GameFlowPhase =
  | 'None'
  | 'Lobby'
  | 'Matchmaking'
  | 'ReadyCheck'
  | 'CharacterSelectPersistent'
  | 'PREGAME'
  | 'InProgress'
  | 'EndOfGame'
  | 'PreEndOfGame'

/** Player identity from pregame data */
export interface PlayerIdentity {
  Subject: string
  PlayerCardID: string
  PlayerTitleID: string
  AccountLevel: number
  PreferredLevelBorderID: string
  Incognito: boolean
  HideAccountLevel: boolean
}

/** A player in the pregame (agent select) screen */
export interface PregamePlayer {
  Subject: string
  TeamID: 'Blue' | 'Red'
  CharacterID: string
  CharacterSelectionState: 'selected' | 'locked' | '' | null
  PregamePlayerState: string
  PlayerIdentity: PlayerIdentity
  SeasonalBadgeInfo: {
    SeasonID: string
    NumberOfWins: number
    WinsByTier: Record<string, number> | null
    Rank: number
    LeaderboardRank: number
  }
  CompetitiveTier: number
  /** Party ID - players with the same PartyID are in the same group */
  PartyID: string
  IsCaptain: boolean
}

/** Full pregame match data */
export interface PregameMatch {
  ID: string
  Version: number
  Teams: Array<{
    TeamID: string
    Players: PregamePlayer[]
  }>
  AllyTeam: {
    TeamID: string
    Players: PregamePlayer[]
  }
  EnemyTeam: {
    TeamID: string
    Players: PregamePlayer[]
  }
  ObserverSubjects: string[]
  MatchCoaches: string[]
  EnemyTeamSize: number
  EnemyTeamLockCount: number
  /** Precomputed player map for quick lookups */
  pregameMatch?: {
    ID: string
    Version: number
    Teams: Array<{
      TeamID: string
      Players: PregamePlayer[]
    }>
    AllyTeam: {
      TeamID: string
      Players: PregamePlayer[]
    }
    EnemyTeam: {
      TeamID: string
      Players: PregamePlayer[]
    }
    ObserverSubjects: string[]
    MatchCoaches: string[]
    EnemyTeamSize: number
    EnemyTeamLockCount: number
    State: string
    MapID: string
    ModeID: string
    ProvisioningFlowID: string
    GamePodID: string
    AllMUCName: string
    TeamMUCName: string
    TeamVoiceToken: string
    TeamVoiceID: string
    IsReconnectable: boolean
    PostgameDetails: null
    TournamentData: null
    DurationOverrides: null
  }
}

/** MMR / competitive data for a player */
export interface PlayerMMR {
  Version: number
  Subject: string
  NewPlayerExperienceFinished: boolean
  QueueSkills: {
    competitive?: {
      TotalGamesNeededForRating: number
      TotalGamesNeededForLeaderboard: number
      CurrentSeasonGamesNeededForRating: number
      SeasonalInfoBySeasonID: Record<string, {
        SeasonID: string
        NumberOfWins: number
        NumberOfWinsWithPlacements: number
        NumberOfGames: number
        Rank: number
        CapstoneWins: number
        LeaderboardRank: number
        CompetitiveTier: number
        RankedRating: number
        WinsByTier: Record<string, number> | null
        GamesNeededForRating: number
        TotalWinsNeededForRank: number
      }>
    }
    deathmatch?: object
    ggteam?: object
    hurm?: object
    newmap?: object
    seeding?: object
    snowball?: object
    spikerush?: object
    standard?: object
    swiftplay?: object
  }
  LatestCompetitiveUpdate: {
    MatchID: string
    MapID: string
    SeasonID: string
    MatchStartTime: number
    TierAfterUpdate: number
    TierBeforeUpdate: number
    RankedRatingAfterUpdate: number
    RankedRatingBeforeUpdate: number
    RankedRatingEarned: number
    RankedRatingPerformanceBonus: number
    CompetitiveMovement: string
    AFKPenalty: number
  }
  IsLeaderboardAnonymized: boolean
  IsActRankBadgeHidden: boolean
}

/** Competitive tier info */
export interface CompetitiveTier {
  Tier: number
  TierName: string
  Division: string
  DivisionName: string
  Color: string
  BackgroundColor: string
  SmallIcon: string
  LargeIcon: string
  RankTriangleDownIcon: string
  RankTriangleUpIcon: string
}

/** Party member info */
export interface PartyMember {
  Subject: string
  CompetitiveTier: number
  PlayerIdentity: PlayerIdentity
  SeasonalBadgeInfo: object | null
  IsOwner: boolean
  QueueEligibleRemainingAccountLevels: number
  Pings: Array<{
    Ping: number
    GamePodID: string
  }>
  IsReady: boolean
  IsModerator: boolean
  UseBroadcastHUD: boolean
  PlatformType: string
}

/** Party info */
export interface PartyInfo {
  ID: string
  MUCName: string
  VoiceRoomID: string
  Version: number
  ClientVersion: string
  Members: PartyMember[]
  State: string
  PreviousState: string
  StateTransitionReason: string
  Accessibility: string
  CustomGameData: object
  MatchmakingData: object
  Invites: object[] | null
  Requests: object[]
  QueueEntryTime: string
  ErrorNotification: object
  RestrictedSeconds: number
  EligibleQueues: string[]
  PlatformType: string
  QueueIneligibilities: object[]
  XPBonuses: object[]
}

/** Match history entry */
export interface MatchHistoryEntry {
  MatchID: string
  GameStartTime: number
  TeamID: string
  QueueID: string
  MapID: string
  TierAfterUpdate: number
  TierBeforeUpdate: number
  RankedRatingAfterUpdate: number
  RankedRatingBeforeUpdate: number
  RankedRatingEarned: number
  CompetitiveMovement: string
}

/** Party detection result */
export interface PartyGroup {
  partyId: string
  memberPuuids: string[]
  color: string
}

/** Region info */
export interface RegionInfo {
  region: string
  locale: string
  webLanguage: string
  webRegion: string
}
