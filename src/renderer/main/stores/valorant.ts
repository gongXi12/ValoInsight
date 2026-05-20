import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ConnectionState, GameFlowPhase } from '@shared/types'

export const useValorantStore = defineStore('valorant', () => {
  const connectionState = ref<ConnectionState>('disconnected')
  const gameFlowPhase = ref<GameFlowPhase>('None')

  function setConnectionState(state: ConnectionState) {
    connectionState.value = state
  }

  function setGameFlowPhase(phase: GameFlowPhase) {
    gameFlowPhase.value = phase
  }

  return {
    connectionState,
    gameFlowPhase,
    setConnectionState,
    setGameFlowPhase,
  }
})
