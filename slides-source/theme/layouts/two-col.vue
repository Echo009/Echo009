<template>
  <div class="twocol-root">
    <!-- 点阵背景 -->
    <div class="dot-grid"></div>

    <!-- 顶部 HUD 渐变线 -->
    <div class="hud-top-line"></div>

    <!-- 左侧章节栏 -->
    <div class="section-sidebar" v-if="$attrs.section">
      <div class="sidebar-inner">
        <div class="sidebar-no" v-if="$attrs.no">{{ $attrs.no }}</div>
        <div class="sidebar-text">{{ $attrs.section }}</div>
      </div>
      <div class="sidebar-accent"></div>
    </div>

    <!-- 双栏内容 -->
    <div class="twocol-content" :class="{ 'with-sidebar': !!$attrs.section }" :style="gridStyle">
      <div class="col col-left">
        <slot name="left" />
      </div>
      <div class="divider-line"></div>
      <div class="col col-right">
        <slot name="right" />
      </div>
    </div>

    <!-- 底部 -->
    <div class="bottom-section" :class="{ 'with-sidebar': !!$attrs.section }">
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
const left = Number($attrs.left || 1)
const right = Number($attrs.right || 1)
const gridStyle = {
  gridTemplateColumns: `${left}fr auto ${right}fr`,
}
</script>

<style scoped>
.twocol-root {
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

/* ===== 左侧章节栏 ===== */
.section-sidebar {
  position: absolute;
  left: 0;
  top: 2rem;
  bottom: 3rem;
  width: 120px;
  z-index: 6;
  display: flex;
}

.sidebar-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.sidebar-no {
  font-family: 'Orbitron', monospace;
  font-size: 1.8rem;
  font-weight: 900;
  color: rgba(0, 255, 255, 0.06);
  line-height: 1;
}

.sidebar-text {
  font-family: 'Orbitron', monospace;
  font-size: 0.55rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  color: rgba(0, 255, 255, 0.4);
  text-shadow: 0 0 8px rgba(0, 255, 255, 0.15);
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  white-space: nowrap;
}

.sidebar-accent {
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(0, 255, 255, 0.35), rgba(123, 47, 255, 0.25), transparent);
  box-shadow: 0 0 6px rgba(0, 255, 255, 0.1);
}

/* ===== 双栏内容 ===== */
.twocol-content {
  flex: 1;
  position: relative;
  z-index: 5;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0 1.5rem;
  align-items: start;
  overflow: auto;
}

.twocol-content.with-sidebar {
  margin-left: 120px;
}

.col {
  min-width: 0;
}

.divider-line {
  width: 2px;
  align-self: stretch;
  background: linear-gradient(180deg, transparent, #00ffff, #7b2fff, transparent);
  opacity: 0.3;
}

/* ===== 底部 ===== */
.bottom-section {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 4rem 10px;
}

.bottom-section.with-sidebar {
  left: 120px;
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
