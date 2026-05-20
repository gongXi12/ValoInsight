<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { useOverlayStore } from './stores/overlay'
import PlayerCard from './components/PlayerCard.vue'
import { getAgentName } from '@shared/constants/agents'

const store = useOverlayStore()

let cleanupPregameData: (() => void) | undefined
let cleanupPregameEnded: (() => void) | undefined

onMounted(() => {
  cleanupPregameData = window.api.onPregameData((data: any) => {
    store.setPregameData(data)
  })
  cleanupPregameEnded = window.api.onPregameEnded(() => {
    store.clearPregameData()
  })
})

onUnmounted(() => {
  cleanupPregameData?.()
  cleanupPregameEnded?.()
})

const mapName = computed(() => {
  if (!store.pregameData?.mapId) return ''
  const mapId = store.pregameData.mapId
  const mapNames: Record<string, string> = {
    '/Game/Maps/Duality/Duality': 'Bind',
    '/Game/Maps/Bonsai/Bonsai': 'Split',
    '/Game/Maps/Ascent/Ascent': 'Ascent',
    '/Game/Maps/Port/Port': 'Icebox',
    '/Game/Maps/Foxtrot/Foxtrot': 'Breeze',
    '/Game/Maps/Canyon/Canyon': 'Fracture',
    '/Game/Maps/Pitt/Pitt': 'Pearl',
    '/Game/Maps/Jam/Jam': 'Lotus',
    '/Game/Maps/Juliett/Juliett': 'Sunset',
    '/Game/Maps/Hurm/Hurm': 'District',
  }
  return mapNames[mapId] || mapId.split('/').pop() || ''
})

const localPlayer = computed(() => {
  if (!store.pregameData) return null
  return store.pregameData.allyPlayers.find(
    (p) => p.puuid === store.pregameData!.localPlayerPuuid
  )
})

const teammates = computed(() => {
  if (!store.pregameData) return []
  return store.pregameData.allyPlayers.filter(
    (p) => p.puuid !== store.pregameData!.localPlayerPuuid
  )
})
</script>

<template>
  <div class="overlay-root" v-if="store.hasData">
    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <div class="logo">VI</div>
        <div class="header-text">
          <span class="app-name">ValoInsight</span>
          <span class="map-name" v-if="mapName">{{ mapName }}</span>
        </div>
      </div>
      <div class="header-right">
        <div v-if="store.pregameData?.parties.length" class="party-legend">
          <span
            v-for="party in store.pregameData.parties"
            :key="party.partyId"
            class="party-chip"
            :style="{ backgroundColor: party.color }"
          >
            {{ party.memberPuuids.length }}人组队
          </span>
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="divider"></div>

    <!-- Your Team Label -->
    <div class="section-label">
      <span class="label-icon">🛡</span>
      <span>我方队伍</span>
    </div>

    <!-- Local Player (You) -->
    <div class="player-section" v-if="localPlayer">
      <PlayerCard :player="localPlayer" />
      <div class="you-badge">YOU</div>
    </div>

    <!-- Teammates -->
    <div class="teammates-list">
      <PlayerCard
        v-for="player in teammates"
        :key="player.puuid"
        :player="player"
      />
    </div>
  </div>

  <!-- Empty State -->
  <div v-else class="empty-state">
    <div class="logo-large">VI</div>
    <div class="empty-text">等待选人阶段...</div>
  </div>
</template>

<style scoped>
.overlay-root {
  background: linear-gradient(180deg, rgba(15, 15, 25, 0.96) 0%, rgba(20, 20, 35, 0.94) 100%);
  border: 1px solid rgba(255, 70, 85, 0.2);
  border-radius: 12px;
  padding: 14px;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  color: #eee;
  width: 100%;
  box-sizing: border-box;
  backdrop-filter: blur(10px);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #ff4655 0%, #ff6b6b 100%);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
  color: #fff;
  letter-spacing: -1px;
}

.header-text {
  display: flex;
  flex-direction: column;
}

.app-name {
  font-size: 14px;
  font-weight: 700;
  color: #ff4655;
  letter-spacing: 0.5px;
}

.map-name {
  font-size: 10px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.header-right {
  display: flex;
  gap: 6px;
}

.party-legend {
  display: flex;
  gap: 4px;
}

.party-chip {
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 9px;
  font-weight: 600;
  color: #000;
}

.divider {
  height: 1px;
  background: linear-gradient(90deg, transparent 0%, rgba(255, 70, 85, 0.3) 50%, transparent 100%);
  margin-bottom: 10px;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 6px;
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: #666;
}

.label-icon {
  font-size: 12px;
}

.player-section {
  position: relative;
  margin-bottom: 4px;
}

.you-badge {
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  background: rgba(255, 70, 85, 0.15);
  color: #ff4655;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 3px;
  letter-spacing: 1px;
  pointer-events: none;
}

.teammates-list {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 12px;
}

.logo-large {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #ff4655 0%, #ff6b6b 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 20px;
  color: #fff;
  letter-spacing: -1px;
}

.empty-text {
  color: #555;
  font-size: 12px;
}
</style>
