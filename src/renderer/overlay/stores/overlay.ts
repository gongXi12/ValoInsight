import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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
  mmr: {
    QueueSkills?: {
      competitive?: {
        SeasonalInfoBySeasonID?: Record<string, {
          RankedRating: number
          CompetitiveTier: number
        }>
      }
    }
    LatestCompetitiveUpdate?: {
      RankedRatingEarned: number
    }
  } | null
  recentMatches: {
    wins: number
    losses: number
    kills: number
    deaths: number
    assists: number
  } | null
}

export interface PartyGroup {
  partyId: string
  memberPuuids: string[]
  color: string
}

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

export const useOverlayStore = defineStore('overlay', () => {
  const pregameData = ref<PregameData | null>(null)

  const hasData = computed(() => pregameData.value !== null)

  function setPregameData(data: PregameData) {
    pregameData.value = data
  }

  function clearPregameData() {
    pregameData.value = null
  }

  return {
    pregameData,
    hasData,
    setPregameData,
    clearPregameData,
  }
})
