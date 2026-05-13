<template>
  <div class="cover-root slidev-layout">
    <!-- 背景层 -->
    <div class="grid-bg"></div>
    <div class="radial-glow"></div>
    <div class="scanline-overlay"></div>
    <div class="moving-scan"></div>

    <!-- 旋转圆环 -->
    <div class="orbit-ring"></div>
    <div class="orbit-ring outer"></div>

    <!-- 四角装饰 -->
    <div class="corner-deco top-left"></div>
    <div class="corner-deco top-right"></div>
    <div class="corner-deco bottom-left"></div>
    <div class="corner-deco bottom-right"></div>

    <!-- 标题内容 -->
    <div class="cover-content">
      <p class="cover-tag">// PRESENTATION //</p>
      <div class="title-line top-line"></div>
      <h1><slot /></h1>
      <div class="title-line bottom-line"></div>
      <p v-if="$attrs.info" class="cover-info">{{ $attrs.info }}</p>
      <p v-if="$attrs.date" class="cover-date">{{ $attrs.date }}</p>
    </div>

    <!-- 底部状态栏 -->
    <div class="status-bar">
      <div class="status-group">
        <span class="status-dot"></span>
        <span>STATUS::ONLINE</span>
      </div>
      <div class="status-divider"></div>
      <div class="status-group">
        <span>SIGNAL::STRONG</span>
      </div>
      <div class="status-divider"></div>
      <div class="status-group">
        <span>LINK::ACTIVE</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.cover-root {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #050510;
  overflow: hidden;
}

/* 网格背景 — 更密集 */
.grid-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(0, 255, 255, 0.035) 1px, transparent 1px) 0 0 / 32px 32px,
    linear-gradient(rgba(0, 255, 255, 0.035) 1px, transparent 1px) 0 0 / 32px 32px;
  pointer-events: none;
}

/* 中心径向发光 */
.radial-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 60% 50% at 50% 50%,
    rgba(0, 255, 255, 0.06) 0%,
    rgba(0, 255, 255, 0.02) 40%,
    transparent 70%
  );
  pointer-events: none;
}

/* 扫描线叠加 */
.scanline-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 998;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.04) 2px,
    rgba(0, 0, 0, 0.04) 4px
  );
}

/* 移动扫描线 */
.moving-scan {
  position: absolute;
  left: 0;
  right: 0;
  height: 60px;
  pointer-events: none;
  z-index: 997;
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(0, 255, 255, 0.03) 40%,
    rgba(0, 255, 255, 0.08) 50%,
    rgba(0, 255, 255, 0.03) 60%,
    transparent 100%
  );
  animation: scanMove 6s linear infinite;
}

/* 旋转圆环 — 视觉焦点 */
.orbit-ring {
  position: absolute;
  width: 280px;
  height: 280px;
  border: 1px dashed rgba(0, 255, 255, 0.08);
  border-radius: 50%;
  animation: rotateSlow 30s linear infinite;
  pointer-events: none;
}

.orbit-ring.outer {
  width: 360px;
  height: 360px;
  border: 1px solid rgba(0, 255, 255, 0.04);
  animation: rotateSlow 45s linear infinite reverse;
}

/* 四角装饰 — 带脉冲 */
.corner-deco {
  position: absolute;
  width: 18px;
  height: 18px;
  border-color: #00ffff;
  border-style: solid;
  z-index: 10;
  opacity: 0.6;
  animation: cornerPulse 3s ease-in-out infinite;
}

.top-left { top: 20px; left: 20px; border-width: 2px 0 0 2px; }
.top-right { top: 20px; right: 20px; border-width: 2px 2px 0 0; animation-delay: 0.75s; }
.bottom-left { bottom: 20px; left: 20px; border-width: 0 0 2px 2px; animation-delay: 1.5s; }
.bottom-right { bottom: 20px; right: 20px; border-width: 0 2px 2px 0; animation-delay: 2.25s; }

@keyframes cornerPulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}

/* 标题内容 */
.cover-content {
  position: relative;
  z-index: 10;
  text-align: center;
}

.cover-tag {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  letter-spacing: 0.4em;
  color: #00ffff66;
  margin-bottom: 1.2rem;
}

/* 标题装饰横线 */
.title-line {
  width: 240px;
  height: 1px;
  margin: 0 auto;
  background: linear-gradient(90deg, transparent, #00ffff88, transparent);
  box-shadow: 0 0 10px #00ffff33;
}

.title-line.top-line {
  margin-bottom: 1.2rem;
}

.title-line.bottom-line {
  margin-top: 1.2rem;
}

.cover-content h1 {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 3.2rem;
  font-weight: 900;
  color: #00ffff;
  text-shadow:
    0 0 8px #00ffffaa,
    0 0 24px #00ffff66,
    0 0 48px #00ffff44,
    0 0 80px #00ffff22;
  line-height: 1.2;
  margin: 0;
  letter-spacing: 0.04em;
}

.cover-info {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1rem;
  color: #ff006ecc;
  text-shadow: 0 0 10px #ff006e88, 0 0 30px #ff006e44;
  margin-top: 1.4rem;
  letter-spacing: 0.04em;
}

.cover-date {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
  color: #e0e0e066;
  margin-top: 0.6rem;
  letter-spacing: 0.15em;
}

/* 底部状态栏 */
.status-bar {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.5rem;
  color: #00ffff44;
  letter-spacing: 0.15em;
}

.status-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: #00ffff;
  box-shadow: 0 0 8px #00ffff, 0 0 16px #00ffff;
  animation: pulseNeon 2.5s ease-in-out infinite;
}

.status-divider {
  width: 1px;
  height: 10px;
  background: #00ffff33;
}

@keyframes pulseNeon {
  0%, 100% { opacity: 1; box-shadow: 0 0 8px #00ffff, 0 0 16px #00ffff; }
  50% { opacity: 0.3; box-shadow: 0 0 4px #00ffff; }
}

@keyframes rotateSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes scanMove {
  0% { top: -10%; }
  100% { top: 110%; }
}
</style>
