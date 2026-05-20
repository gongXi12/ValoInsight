<script setup lang="ts">
import { useValorantStore } from '../stores/valorant'
import { computed } from 'vue'

const store = useValorantStore()

const statusInfo = computed(() => {
  const map: Record<string, { color: string; icon: string; label: string }> = {
    connected: { color: '#4ecdc4', icon: '✓', label: '已连接到 Valorant 客户端' },
    connecting: { color: '#ffd700', icon: '↻', label: '正在连接...' },
    disconnected: { color: '#ff4655', icon: '✕', label: '未连接' },
  }
  return map[store.connectionState] || map.disconnected
})

const phaseInfo = computed(() => {
  const map: Record<string, { icon: string; label: string; desc: string }> = {
    Lobby: { icon: '🏠', label: '大厅', desc: '在主界面等待中' },
    Matchmaking: { icon: '🔍', label: '匹配中', desc: '正在寻找对局' },
    ReadyCheck: { icon: '✓', label: '准备确认', desc: '请确认准备就绪' },
    CharacterSelectPersistent: { icon: '🎯', label: '选人阶段', desc: 'Overlay 已显示，正在获取队友数据' },
    PREGAME: { icon: '🎯', label: '选人阶段', desc: 'Overlay 已显示，正在获取队友数据' },
    InProgress: { icon: '⚔', label: '游戏中', desc: '对局进行中' },
    EndOfGame: { icon: '🏁', label: '对局结束', desc: '对局已结束' },
  }
  return map[store.gameFlowPhase] || null
})
</script>

<template>
  <div class="home-view">
    <!-- Connection Status Card -->
    <div class="card status-card">
      <div class="card-header">
        <span class="card-icon">📡</span>
        <span class="card-title">连接状态</span>
      </div>
      <div class="card-body">
        <div class="status-row">
          <div class="status-indicator" :style="{ borderColor: statusInfo.color }">
            <span class="status-dot-lg" :style="{ backgroundColor: statusInfo.color }"></span>
            <span class="status-label" :style="{ color: statusInfo.color }">{{ statusInfo.label }}</span>
          </div>
        </div>

        <div v-if="phaseInfo" class="phase-row">
          <div class="phase-card">
            <span class="phase-icon">{{ phaseInfo.icon }}</span>
            <div class="phase-info">
              <span class="phase-name">{{ phaseInfo.label }}</span>
              <span class="phase-desc">{{ phaseInfo.desc }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Guide Card -->
    <div class="card guide-card">
      <div class="card-header">
        <span class="card-icon">📖</span>
        <span class="card-title">使用指南</span>
      </div>
      <div class="card-body">
        <div class="guide-steps">
          <div class="guide-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <div class="step-title">启动 Valorant</div>
              <div class="step-desc">工具会自动检测并连接到游戏客户端</div>
            </div>
          </div>
          <div class="guide-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <div class="step-title">进入选人阶段</div>
              <div class="step-desc">当匹配成功进入选人界面时，Overlay 自动弹出</div>
            </div>
          </div>
          <div class="guide-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <div class="step-title">查看队友信息</div>
              <div class="step-desc">队友的段位、近期战绩、组队情况一目了然</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Features Card -->
    <div class="card features-card">
      <div class="card-header">
        <span class="card-icon">✨</span>
        <span class="card-title">功能特性</span>
      </div>
      <div class="card-body">
        <div class="features-grid">
          <div class="feature-item">
            <span class="feature-icon">🏅</span>
            <span class="feature-name">段位显示</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">📊</span>
            <span class="feature-name">战绩统计</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">👥</span>
            <span class="feature-name">组队检测</span>
          </div>
          <div class="feature-item">
            <span class="feature-icon">🎯</span>
            <span class="feature-name">特工头像</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.card-icon {
  font-size: 14px;
}

.card-title {
  font-size: 12px;
  font-weight: 600;
  color: #ccc;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-body {
  padding: 14px;
}

/* Status Card */
.status-row {
  margin-bottom: 10px;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid;
  background: rgba(0, 0, 0, 0.2);
}

.status-dot-lg {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-label {
  font-size: 13px;
  font-weight: 600;
}

.phase-row {
  margin-top: 8px;
}

.phase-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: rgba(255, 70, 85, 0.08);
  border-radius: 6px;
  border: 1px solid rgba(255, 70, 85, 0.15);
}

.phase-icon {
  font-size: 20px;
}

.phase-info {
  display: flex;
  flex-direction: column;
}

.phase-name {
  font-size: 13px;
  font-weight: 600;
  color: #ff4655;
}

.phase-desc {
  font-size: 11px;
  color: #888;
  margin-top: 1px;
}

/* Guide Card */
.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.guide-step {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.step-number {
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, #ff4655 0%, #ff6b6b 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}

.step-content {
  display: flex;
  flex-direction: column;
}

.step-title {
  font-size: 13px;
  font-weight: 600;
  color: #ddd;
}

.step-desc {
  font-size: 11px;
  color: #888;
  margin-top: 1px;
}

/* Features Card */
.features-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.feature-icon {
  font-size: 16px;
}

.feature-name {
  font-size: 12px;
  color: #ccc;
}
</style>
