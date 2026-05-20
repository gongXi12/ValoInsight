<script setup lang="ts">
import { computed } from 'vue'
import type { EnrichedPlayer } from '../stores/overlay'
import { getAgentByUuid, ROLE_ICONS } from '@shared/constants/agents'
import { getRankByTier } from '@shared/constants/ranks'

const props = defineProps<{
  player: EnrichedPlayer
}>()

const agent = computed(() => getAgentByUuid(props.player.characterId))
const rank = computed(() => getRankByTier(props.player.competitiveTier))

const kda = computed(() => {
  if (!props.player.recentMatches) return null
  const { kills, deaths, assists } = props.player.recentMatches
  const games = props.player.recentMatches.wins + props.player.recentMatches.losses
  if (games === 0) return null
  return {
    kills: (kills / games).toFixed(1),
    deaths: (deaths / games).toFixed(1),
    assists: (assists / games).toFixed(1),
    ratio: deaths === 0 ? 'Perfect' : ((kills + assists) / deaths).toFixed(2),
  }
})

const winRate = computed(() => {
  if (!props.player.recentMatches) return null
  const { wins, losses } = props.player.recentMatches
  const total = wins + losses
  if (total === 0) return null
  return Math.round((wins / total) * 100)
})

const rr = computed(() => {
  const seasons = props.player.mmr?.QueueSkills?.competitive?.SeasonalInfoBySeasonID
  if (!seasons) return null
  const latest = Object.values(seasons)[0]
  return latest?.RankedRating ?? null
})

const partyBorderStyle = computed(() => {
  if (!props.player.partyColor) return {}
  return { borderLeft: `3px solid ${props.player.partyColor}` }
})

const agentIconUrl = computed(() => agent.value?.icon || '')
const rankIconUrl = computed(() => rank.value?.smallIcon || '')
const agentName = computed(() => agent.value?.name || 'Unknown')
const roleName = computed(() => agent.value?.role || '')
const rankName = computed(() => rank.value?.name || 'Unranked')
const rankColor = computed(() => rank.value?.color || '#ffffff')
</script>

<template>
  <div class="player-card" :style="partyBorderStyle">
    <!-- Agent Icon -->
    <div class="agent-avatar">
      <img v-if="agentIconUrl" :src="agentIconUrl" :alt="agentName" class="agent-img" />
      <div v-else class="agent-img placeholder">?</div>
      <span class="agent-role" :title="roleName">{{ ROLE_ICONS[roleName] || '' }}</span>
    </div>

    <!-- Player Info -->
    <div class="info-section">
      <div class="top-row">
        <span class="player-name">{{ player.displayName || 'Unknown' }}</span>
        <span v-if="player.tagLine" class="tag">#{{ player.tagLine }}</span>
      </div>

      <div class="middle-row">
        <img v-if="rankIconUrl" :src="rankIconUrl" :alt="rankName" class="rank-icon" />
        <span class="rank-name" :style="{ color: `#${rankColor}` }">{{ rankName }}</span>
        <span v-if="rr !== null" class="rr">{{ rr }} RR</span>
      </div>

      <div class="bottom-row" v-if="kda">
        <span class="kda-label">KDA</span>
        <span class="kda-value">{{ kda.kills }} / {{ kda.deaths }} / {{ kda.assists }}</span>
        <span class="kda-ratio">({{ kda.ratio }})</span>
        <span class="separator">|</span>
        <span class="winrate" :class="{ positive: (winRate || 0) >= 50 }">
          {{ winRate }}% WR
        </span>
        <span class="games">({{ player.recentMatches!.wins }}W {{ player.recentMatches!.losses }}L)</span>
      </div>
    </div>

    <!-- Party Indicator -->
    <div v-if="player.partyColor" class="party-dot" :style="{ backgroundColor: player.partyColor }">
      P
    </div>
  </div>
</template>

<style scoped>
.player-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  transition: background 0.2s;
}

.player-card:hover {
  background: rgba(255, 255, 255, 0.08);
}

.agent-avatar {
  position: relative;
  flex-shrink: 0;
}

.agent-img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.agent-img.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.08);
  color: #666;
  font-size: 18px;
}

.agent-role {
  position: absolute;
  bottom: -2px;
  right: -2px;
  font-size: 10px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  padding: 1px 3px;
  line-height: 1;
}

.info-section {
  flex: 1;
  min-width: 0;
}

.top-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.player-name {
  font-size: 13px;
  font-weight: 600;
  color: #eee;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tag {
  color: #888;
  font-size: 11px;
  font-weight: 400;
}

.middle-row {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 2px;
}

.rank-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.rank-name {
  font-size: 11px;
  font-weight: 600;
}

.rr {
  font-size: 10px;
  color: #aaa;
  background: rgba(255, 255, 255, 0.06);
  padding: 1px 5px;
  border-radius: 3px;
}

.bottom-row {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 3px;
  font-size: 10px;
  color: #999;
}

.kda-label {
  color: #666;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 9px;
}

.kda-value {
  color: #ccc;
}

.kda-ratio {
  color: #888;
}

.separator {
  color: #444;
}

.winrate {
  color: #ff6b6b;
  font-weight: 600;
}

.winrate.positive {
  color: #4ecdc4;
}

.games {
  color: #777;
}

.party-dot {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 700;
  color: #000;
}
</style>
