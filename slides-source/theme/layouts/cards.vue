<template>
  <div class="cards-root">
    <!-- 点阵背景 -->
    <div class="dot-grid"></div>

    <!-- 顶部 HUD 渐变线 -->
    <div class="hud-top-line"></div>

    <!-- 内容区 -->
    <div class="cards-content" :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }">
      <slot />
    </div>

    <!-- 底部 -->
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
const cols = Number($attrs.cols || 3)
</script>

<style scoped>
.cards-root {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #050510;
  padding: 3rem 4rem 4rem;
  display: flex;
  flex-direction: column;
}

.dot-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(0, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
}

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

.cards-content {
  flex: 1;
  position: relative;
  z-index: 5;
  display: grid;
  gap: 1.5rem;
  align-content: start;
}

/* 全局工具类在 cards 布局中的增强 */
.cards-content :deep(.card) {
  background: linear-gradient(135deg, rgba(0, 255, 255, 0.03) 0%, rgba(10, 10, 26, 0.9) 100%);
  border: 1px solid rgba(0, 255, 255, 0.12);
  border-radius: 6px;
  padding: 1.2rem 1.4rem;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.cards-content :deep(.card:hover) {
  border-color: rgba(0, 255, 255, 0.3);
  box-shadow: 0 0 16px rgba(0, 255, 255, 0.1);
}

.cards-content :deep(.card.accent-cyan) { border-top: 2px solid #00ffff; }
.cards-content :deep(.card.accent-pink) { border-top: 2px solid #ff006e; }
.cards-content :deep(.card.accent-purple) { border-top: 2px solid #7b2fff; }
.cards-content :deep(.card.accent-yellow) { border-top: 2px solid #f5ff00; }

.bottom-section {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 4rem 10px;
}

.progress-track {
  width: 100%;
  height: 1px;
  background: rgba(0, 255, 255, 0.06);
  margin-bottom: 8px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ffff, #7b2fff);
  box-shadow: 0 0 6px #00ffff44;
  transition: width 0.4s ease;
}

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
