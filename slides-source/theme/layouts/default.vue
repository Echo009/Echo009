<template>
  <div class="default-root">
    <!-- 点阵背景 -->
    <div class="dot-grid"></div>

    <!-- 顶部 HUD 渐变线 -->
    <div class="hud-top-line"></div>
    <div class="hud-top-glow"></div>

    <!-- 侧边 section 标签 -->
    <div class="side-label" v-if="$attrs.section">
      <span>{{ $attrs.section }}</span>
    </div>

    <!-- 左右竖线装饰 -->
    <div class="vline vline-left"></div>
    <div class="vline vline-right"></div>

    <!-- 内容区 -->
    <div class="content-area">
      <slot />
    </div>

    <!-- 底部进度条 + 页码 -->
    <div class="bottom-section">
      <div class="progress-track">
        <div
          class="progress-fill"
          :style="{ width: ($slidev.nav.currentPage / $slidev.nav.total * 100) + '%' }"
        ></div>
      </div>
      <div class="bottom-bar">
        <span class="page-indicator">
          {{ String($slidev.nav.currentPage).padStart(2, '0') }}
          <span class="page-sep">/</span>
          {{ String($slidev.nav.total).padStart(2, '0') }}
        </span>
        <span class="sys-tag">SYS::ACTIVE</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.default-root {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #050510;
  padding: 3rem 4rem 4rem;
  display: flex;
  flex-direction: column;
}

/* 点阵背景 */
.dot-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(0, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
}

/* 顶部 HUD 渐变线 */
.hud-top-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #00ffff, #ff006e, #7b2fff, #00ffff);
  background-size: 200% 100%;
  animation: borderFlow 4s linear infinite;
  z-index: 10;
}

/* 顶部线下方发光 */
.hud-top-glow {
  position: absolute;
  top: 2px;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(180deg, rgba(0, 255, 255, 0.08) 0%, transparent 100%);
  pointer-events: none;
  z-index: 9;
}

/* 侧边 section 标签 */
.side-label {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%) rotate(-90deg);
  font-family: 'Orbitron', monospace;
  font-size: 0.5rem;
  letter-spacing: 0.5em;
  color: #00ffff33;
  white-space: nowrap;
}

/* 竖线装饰 */
.vline {
  position: absolute;
  top: 40px;
  bottom: 50px;
  width: 1px;
  background: linear-gradient(180deg, rgba(0, 255, 255, 0.1), rgba(0, 255, 255, 0.02), rgba(0, 255, 255, 0.1));
  pointer-events: none;
}

.vline-left { left: 28px; }
.vline-right { right: 28px; }

/* 内容区 */
.content-area {
  flex: 1;
  position: relative;
  z-index: 5;
  overflow: auto;
}

/* 底部区域 */
.bottom-section {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 4rem 10px;
}

/* 进度条轨道 */
.progress-track {
  width: 100%;
  height: 1px;
  background: rgba(0, 255, 255, 0.06);
  border-radius: 1px;
  margin-bottom: 8px;
  overflow: hidden;
}

/* 进度条填充 */
.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ffff, #7b2fff);
  border-radius: 1px;
  box-shadow: 0 0 6px #00ffff44;
  transition: width 0.4s ease;
}

/* 底部信息栏 */
.bottom-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.55rem;
  color: #00ffff44;
  letter-spacing: 0.12em;
}

.page-indicator {
  font-family: 'Orbitron', monospace;
  font-size: 0.5rem;
  color: #00ffff55;
}

.page-sep {
  margin: 0 2px;
  opacity: 0.4;
}

.sys-tag {
  opacity: 0.4;
}

@keyframes borderFlow {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
</style>
