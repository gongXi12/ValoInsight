<script setup lang="ts">
import { ref } from 'vue'

const autoConnect = ref(true)
const showOverlay = ref(true)
const startWithWindows = ref(false)
const useHenrikApi = ref(true)
const region = ref('auto')
</script>

<template>
  <div class="settings-view">
    <!-- General Settings -->
    <div class="card">
      <div class="card-header">
        <span class="card-icon">⚙</span>
        <span class="card-title">通用设置</span>
      </div>
      <div class="card-body">
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">自动连接</span>
            <span class="setting-desc">启动时自动检测并连接 Valorant 客户端</span>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="autoConnect" />
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">显示 Overlay</span>
            <span class="setting-desc">选人阶段自动显示队友信息覆盖窗口</span>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="showOverlay" />
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">开机自启</span>
            <span class="setting-desc">Windows 启动时自动运行 ValoInsight</span>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="startWithWindows" />
            <span class="slider"></span>
          </label>
        </div>
      </div>
    </div>

    <!-- Data Source Settings -->
    <div class="card">
      <div class="card-header">
        <span class="card-icon">📊</span>
        <span class="card-title">数据源</span>
      </div>
      <div class="card-body">
        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">HenrikDev API</span>
            <span class="setting-desc">使用社区 API 获取详细比赛历史数据</span>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="useHenrikApi" />
            <span class="slider"></span>
          </label>
        </div>

        <div class="setting-item">
          <div class="setting-info">
            <span class="setting-name">服务器区域</span>
            <span class="setting-desc">选择你的 Valorant 服务器区域</span>
          </div>
          <select v-model="region" class="select-input">
            <option value="auto">自动检测</option>
            <option value="cn">中国服 (CN)</option>
            <option value="ap">亚太 (AP)</option>
            <option value="kr">韩国 (KR)</option>
            <option value="na">北美 (NA)</option>
            <option value="eu">欧洲 (EU)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- About -->
    <div class="card">
      <div class="card-header">
        <span class="card-icon">ℹ</span>
        <span class="card-title">关于</span>
      </div>
      <div class="card-body">
        <div class="about-content">
          <div class="about-logo">
            <div class="logo-box">VI</div>
            <div class="about-text">
              <span class="about-name">ValoInsight</span>
              <span class="about-version">v0.1.0</span>
            </div>
          </div>
          <p class="about-desc">
            Valorant 队友战绩查看工具，灵感来源于 LeagueAkari。
            在选人阶段查看队友的段位、战绩和组队情况。
          </p>
          <div class="about-links">
            <span class="about-link">GitHub</span>
            <span class="separator">•</span>
            <span class="about-link">反馈问题</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
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
  padding: 4px 0;
}

.setting-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info {
  display: flex;
  flex-direction: column;
}

.setting-name {
  font-size: 13px;
  color: #ddd;
  font-weight: 500;
}

.setting-desc {
  font-size: 11px;
  color: #777;
  margin-top: 1px;
}

/* Toggle Switch */
.toggle {
  position: relative;
  width: 40px;
  height: 22px;
  flex-shrink: 0;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 22px;
  transition: 0.3s;
}

.slider::before {
  content: '';
  position: absolute;
  height: 16px;
  width: 16px;
  left: 3px;
  bottom: 3px;
  background: #888;
  border-radius: 50%;
  transition: 0.3s;
}

.toggle input:checked + .slider {
  background: rgba(255, 70, 85, 0.3);
}

.toggle input:checked + .slider::before {
  background: #ff4655;
  transform: translateX(18px);
}

/* Select Input */
.select-input {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 5px 8px;
  color: #ddd;
  font-size: 12px;
  outline: none;
  cursor: pointer;
}

.select-input option {
  background: #1a1a2e;
  color: #ddd;
}

/* About Section */
.about-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.about-logo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-box {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #ff4655 0%, #ff6b6b 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 16px;
  color: #fff;
}

.about-text {
  display: flex;
  flex-direction: column;
}

.about-name {
  font-size: 15px;
  font-weight: 700;
  color: #ff4655;
}

.about-version {
  font-size: 11px;
  color: #888;
}

.about-desc {
  font-size: 12px;
  color: #888;
  line-height: 1.5;
  margin: 0;
}

.about-links {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
}

.about-link {
  color: #ff4655;
  cursor: pointer;
}

.about-link:hover {
  text-decoration: underline;
}

.separator {
  color: #444;
}
</style>
