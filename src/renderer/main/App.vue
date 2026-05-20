<script setup lang="ts">
import { onMounted, onUnmounted, computed, ref } from 'vue'
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { useValorantStore } from './stores/valorant'

const valorantStore = useValorantStore()
const route = useRoute()
const isMaximized = ref(false)

function winMinimize() { window.api.minimize() }
function winMaximize() { window.api.maximize() }
function winClose() { window.api.close() }

let cleanupStateChange: (() => void) | undefined
let cleanupGameFlowPhase: (() => void) | undefined

onMounted(async () => {
  const initialState = await window.api.getConnectionState()
  valorantStore.setConnectionState(initialState as any)

  cleanupStateChange = window.api.onStateChange((state) => {
    valorantStore.setConnectionState(state as any)
  })

  cleanupGameFlowPhase = window.api.onGameFlowPhase((phase) => {
    valorantStore.setGameFlowPhase(phase as any)
  })
})

onUnmounted(() => {
  cleanupStateChange?.()
  cleanupGameFlowPhase?.()
})

const statusColor = computed(() => {
  const map: Record<string, string> = {
    connected: '#4ecdc4',
    connecting: '#ffd700',
    disconnected: '#ff4655',
  }
  return map[valorantStore.connectionState] || '#ff4655'
})

const statusText = computed(() => {
  const map: Record<string, string> = {
    connected: '已连接',
    connecting: '连接中...',
    disconnected: '未连接',
  }
  return map[valorantStore.connectionState] || '未连接'
})
</script>

<template>
  <div class="app-root">
    <!-- Title Bar -->
    <div class="title-bar">
      <div class="title-left">
        <div class="logo-mark">
          <div class="logo-icon">VI</div>
          <div class="logo-text">ValoInsight</div>
        </div>
      </div>
      <div class="title-center">
        <div class="connection-badge" :style="{ borderColor: statusColor }">
          <span class="status-dot" :style="{ backgroundColor: statusColor }"></span>
          <span class="status-text">{{ statusText }}</span>
        </div>
        <div v-if="valorantStore.gameFlowPhase !== 'None'" class="phase-badge">
          {{ valorantStore.gameFlowPhase }}
        </div>
      </div>
      <div class="title-right">
        <button class="win-btn minimize" @click="winMinimize">─</button>
        <button class="win-btn maximize" @click="winMaximize">□</button>
        <button class="win-btn close" @click="winClose">✕</button>
      </div>
    </div>

    <!-- Navigation -->
    <div class="nav-bar">
      <RouterLink to="/" class="nav-item" :class="{ active: route.path === '/' }">
        <span class="nav-icon">🏠</span>
        <span class="nav-label">主页</span>
      </RouterLink>
      <RouterLink to="/settings" class="nav-item" :class="{ active: route.path === '/settings' }">
        <span class="nav-icon">⚙</span>
        <span class="nav-label">设置</span>
      </RouterLink>
    </div>

    <!-- Content -->
    <div class="content-area">
      <RouterView />
    </div>

    <!-- Status Bar -->
    <div class="status-bar">
      <span class="version">v0.1.0</span>
      <span class="separator">•</span>
      <span class="hint" v-if="valorantStore.connectionState === 'disconnected'">
        启动 Valorant 客户端以自动连接
      </span>
      <span class="hint" v-else-if="valorantStore.gameFlowPhase === 'Lobby'">
        在大厅中，等待进入选人阶段
      </span>
      <span class="hint" v-else-if="valorantStore.gameFlowPhase === 'CharacterSelectPersistent' || valorantStore.gameFlowPhase === 'PREGAME'">
        选人阶段中，Overlay 已显示
      </span>
    </div>
  </div>
</template>

<style scoped>
.app-root {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #0f0f18;
  color: #eee;
  font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid rgba(255, 70, 85, 0.15);
}

/* Title Bar */
.title-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  padding: 0 10px;
  background: linear-gradient(90deg, rgba(255, 70, 85, 0.08) 0%, rgba(15, 15, 24, 1) 100%);
  -webkit-app-region: drag;
  user-select: none;
}

.title-left {
  display: flex;
  align-items: center;
}

.logo-mark {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  width: 22px;
  height: 22px;
  background: linear-gradient(135deg, #ff4655 0%, #ff6b6b 100%);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 10px;
  color: #fff;
  letter-spacing: -0.5px;
}

.logo-text {
  font-size: 12px;
  font-weight: 700;
  color: #ff4655;
  letter-spacing: 0.5px;
}

.title-center {
  display: flex;
  align-items: center;
  gap: 8px;
}

.connection-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 10px;
  border: 1px solid;
  font-size: 10px;
  -webkit-app-region: no-drag;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.status-text {
  color: #ccc;
}

.phase-badge {
  background: rgba(255, 70, 85, 0.15);
  color: #ff4655;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: 600;
}

.title-right {
  display: flex;
  gap: 2px;
  -webkit-app-region: no-drag;
}

.win-btn {
  width: 28px;
  height: 22px;
  border: none;
  background: transparent;
  color: #888;
  font-size: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
}

.win-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.win-btn.close:hover {
  background: #ff4655;
  color: #fff;
}

/* Navigation */
.nav-bar {
  display: flex;
  gap: 0;
  padding: 0 10px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 14px;
  color: #888;
  text-decoration: none;
  font-size: 12px;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.nav-item:hover {
  color: #ccc;
  background: rgba(255, 255, 255, 0.03);
}

.nav-item.active {
  color: #ff4655;
  border-bottom-color: #ff4655;
}

.nav-icon {
  font-size: 14px;
}

.nav-label {
  font-weight: 500;
}

/* Content */
.content-area {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
}

.content-area::-webkit-scrollbar {
  width: 6px;
}

.content-area::-webkit-scrollbar-track {
  background: transparent;
}

.content-area::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
}

/* Status Bar */
.status-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 10px;
  color: #555;
}

.version {
  color: #666;
}

.separator {
  color: #333;
}

.hint {
  color: #555;
}
</style>
