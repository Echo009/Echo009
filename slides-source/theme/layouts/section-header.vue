<!-- Author: @Echo009 -->
<!-- Date: 2026-05-12 -->
<!-- Description: Section-header layout with data rail, corner accents, and HUD framing -->

<template>
  <div class="section-root slidev-layout">
    <!-- 背景层 -->
    <div class="grid-bg"></div>
    <div class="radial-glow"></div>

    <!-- 顶部 HUD 渐变线 -->
    <div class="hud-top-line"></div>
    <div class="hud-top-glow"></div>

    <!-- 大号背景编号 -->
    <div v-if="$attrs.no" class="bg-number">{{ $attrs.no }}</div>

    <!-- 右侧数据轨道 -->
    <div class="data-rail">
      <div class="rail-line"></div>
      <div class="rail-tick" style="top: 12%"></div>
      <div class="rail-tick" style="top: 30%"></div>
      <div class="rail-tick" style="top: 50%"></div>
      <div class="rail-tick" style="top: 70%"></div>
      <div class="rail-tick" style="top: 88%"></div>
      <div class="rail-label">SEC::{{ $attrs.no || '00' }}</div>
    </div>

    <!-- 角标装饰 -->
    <div class="corner-mark top-left"></div>
    <div class="corner-mark top-right"></div>
    <div class="corner-mark bottom-left"></div>
    <div class="corner-mark bottom-right"></div>

    <!-- 扫描线 -->
    <div class="scan-line"></div>

    <!-- 内容 -->
    <div class="section-content">
      <div class="section-badge" v-if="$attrs.no">
        <div class="badge-bar"></div>
        <span class="badge-text">SECTION {{ $attrs.no }}</span>
      </div>
      <h2><slot /></h2>
      <div class="divider-line"></div>
      <p v-if="$attrs.subtitle" class="section-subtitle">{{ $attrs.subtitle }}</p>
    </div>

    <!-- 底部页码 -->
    <div class="bottom-section">
      <div class="bottom-bar">
        <span class="page-indicator">
          {{ String($slidev.nav.currentPage).padStart(2, '0') }}
          <span class="page-sep">/</span>
          {{ String($slidev.nav.total).padStart(2, '0') }}
        </span>
        <span class="sys-tag">SYS::SECTION</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.section-root {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  background-color: #050510;
  overflow: hidden;
}

/* 网格背景 */
.grid-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(0, 255, 255, 0.02) 1px, transparent 1px) 0 0 / 44px 44px,
    linear-gradient(rgba(0, 255, 255, 0.02) 1px, transparent 1px) 0 0 / 44px 44px;
  pointer-events: none;
}

/* 径向发光 — 聚焦在内容区 */
.radial-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 50% 45% at 25% 50%,
    rgba(0, 255, 255, 0.05) 0%,
    rgba(123, 47, 255, 0.03) 50%,
    transparent 75%
  );
  pointer-events: none;
}

/* 顶部 HUD 渐变线 */
.hud-top-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 5%, rgba(0, 255, 255, 0.6), rgba(123, 47, 255, 0.4), rgba(255, 0, 110, 0.3), transparent 95%);
  z-index: 10;
}

.hud-top-glow {
  position: absolute;
  top: 1px;
  left: 0;
  right: 0;
  height: 20px;
  background: linear-gradient(180deg, rgba(0, 255, 255, 0.04) 0%, transparent 100%);
  pointer-events: none;
  z-index: 9;
}

/* 大号背景编号 — 偏右，作为视觉锚点 */
.bg-number {
  position: absolute;
  font-family: 'Space Grotesk', sans-serif;
  font-size: 26rem;
  font-weight: 900;
  color: rgba(0, 255, 255, 0.06);
  letter-spacing: -0.04em;
  user-select: none;
  pointer-events: none;
  right: 8%;
  top: 50%;
  transform: translateY(-50%);
  line-height: 1;
}

/* ===== 右侧数据轨道 ===== */
.data-rail {
  position: absolute;
  right: 2.2rem;
  top: 10%;
  bottom: 10%;
  width: 20px;
  z-index: 3;
  pointer-events: none;
}

.rail-line {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(
    180deg,
    transparent,
    rgba(0, 255, 255, 0.08) 15%,
    rgba(123, 47, 255, 0.06) 50%,
    rgba(0, 255, 255, 0.08) 85%,
    transparent
  );
}

.rail-tick {
  position: absolute;
  right: 0;
  width: 10px;
  height: 1px;
  background: rgba(0, 255, 255, 0.12);
}

.rail-tick:nth-child(odd) {
  width: 16px;
  background: rgba(0, 255, 255, 0.18);
}

.rail-label {
  position: absolute;
  bottom: -1.2rem;
  right: 0;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.45rem;
  color: rgba(0, 255, 255, 0.2);
  letter-spacing: 0.15em;
  white-space: nowrap;
}

/* ===== 角标装饰 ===== */
.corner-mark {
  position: absolute;
  width: 16px;
  height: 16px;
  pointer-events: none;
  z-index: 4;
}

.corner-mark.top-left {
  top: 0.8rem;
  left: 0.8rem;
  border-top: 1px solid rgba(0, 255, 255, 0.12);
  border-left: 1px solid rgba(0, 255, 255, 0.12);
}

.corner-mark.top-right {
  top: 0.8rem;
  right: 0.8rem;
  border-top: 1px solid rgba(0, 255, 255, 0.12);
  border-right: 1px solid rgba(0, 255, 255, 0.12);
}

.corner-mark.bottom-left {
  bottom: 2.8rem;
  left: 0.8rem;
  border-bottom: 1px solid rgba(0, 255, 255, 0.12);
  border-left: 1px solid rgba(0, 255, 255, 0.12);
}

.corner-mark.bottom-right {
  bottom: 2.8rem;
  right: 0.8rem;
  border-bottom: 1px solid rgba(0, 255, 255, 0.12);
  border-right: 1px solid rgba(0, 255, 255, 0.12);
}

/* 扫描线 */
.scan-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent 10%, rgba(0, 255, 255, 0.18) 50%, transparent 90%);
  z-index: 8;
  pointer-events: none;
  animation: scanMove 8s linear infinite;
  opacity: 0.7;
}

/* ===== 内容区 ===== */
.section-content {
  position: relative;
  z-index: 10;
  text-align: left;
  padding-left: 12%;
  max-width: 58%;
}

.section-badge {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  margin-bottom: 1.4rem;
}

.badge-bar {
  width: 24px;
  height: 2px;
  background: linear-gradient(90deg, #00ffff, #7b2fff);
  box-shadow: 0 0 8px rgba(0, 255, 255, 0.3);
}

.badge-text {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 0.65rem;
  letter-spacing: 0.5em;
  color: rgba(0, 255, 255, 0.45);
  text-shadow: 0 0 6px rgba(0, 255, 255, 0.15);
}

.section-content h2 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(90deg, #00ffff, #7b2fff, #ff006e);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s ease-in-out infinite;
  filter: drop-shadow(0 0 24px rgba(0, 255, 255, 0.2));
  line-height: 1.25;
  margin: 0;
  letter-spacing: 0.06em;
}

.divider-line {
  width: 200px;
  height: 2px;
  background: linear-gradient(90deg, #00ffff, #7b2fff, #ff006e, transparent);
  background-size: 200% 100%;
  margin: 1.4rem 0;
  box-shadow: 0 0 10px #00ffff33, 0 0 20px #7b2fff22;
  animation: shimmer 3s ease-in-out infinite;
}

.section-subtitle {
  font-family: 'Inter', 'Noto Sans SC', sans-serif;
  font-size: 1.1rem;
  font-weight: 400;
  color: #e0e0e077;
  letter-spacing: 0.06em;
  line-height: 1.6;
}

/* ===== 底部 ===== */
.bottom-section {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 3.5rem 10px;
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
  font-family: 'Space Grotesk', sans-serif;
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

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes scanMove {
  0% { top: -5%; opacity: 0; }
  10% { opacity: 0.4; }
  90% { opacity: 0.4; }
  100% { top: 105%; opacity: 0; }
}
</style>
