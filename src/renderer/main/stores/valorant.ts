import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ConnectionState, GameFlowPhase } from '@shared/types'

export const useValorantStore = defineStore('valorant', () => {
  const connectionState = ref<ConnectionState>('disconnected')
  const gameFlowPhase = ref<GameFlowPhase>('None')
  const region = ref('auto')

  function setConnectionState(state: ConnectionState) {
    connectionState.value = state
  }

  function setGameFlowPhase(phase: GameFlowPhase) {
    gameFlowPhase.value = phase
  }

  function setRegion(value: string) {
    region.value = value
  }

  async function initRegion() {
    try {
      const saved = await window.api.getRegion()
      if (saved) region.value = saved
    } catch {
      // ignore
    }
  }

  return {
    connectionState,
    gameFlowPhase,
    region,
    setConnectionState,
    setGameFlowPhase,
    setRegion,
    initRegion,
  }
})
