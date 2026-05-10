<template>
  <div class="section-root slidev-layout">
    <!-- 网格背景 -->
    <div class="grid-bg"></div>
    <div class="radial-glow"></div>

    <!-- 大号水印 section 编号 -->
    <div v-if="$attrs.no" class="watermark-no">{{ $attrs.no }}</div>

    <!-- 旋转几何装饰 -->
    <div class="geo-deco circle-1"></div>
    <div class="geo-deco circle-2"></div>
    <div class="geo-deco triangle"></div>

    <!-- 内容 (左对齐) -->
    <div class="section-content">
      <p v-if="$attrs.no" class="section-label">PART {{ $attrs.no }}</p>
      <h2><slot /></h2>
      <div class="divider-line"></div>
      <p v-if="$attrs.subtitle" class="section-subtitle">{{ $attrs.subtitle }}</p>
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
    linear-gradient(90deg, rgba(0, 255, 255, 0.025) 1px, transparent 1px) 0 0 / 44px 44px,
    linear-gradient(rgba(0, 255, 255, 0.025) 1px, transparent 1px) 0 0 / 44px 44px;
  pointer-events: none;
}

/* 径向发光 */
.radial-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 50% 40% at 50% 50%,
    rgba(123, 47, 255, 0.08) 0%,
    rgba(0, 255, 255, 0.04) 50%,
    transparent 80%
  );
  pointer-events: none;
}

/* 大号水印编号 */
.watermark-no {
  position: absolute;
  font-family: 'Orbitron', monospace;
  font-size: 22rem;
  font-weight: 900;
  color: rgba(0, 255, 255, 0.025);
  letter-spacing: -0.02em;
  user-select: none;
  pointer-events: none;
  right: 3%;
  bottom: -5%;
  line-height: 1;
}

/* 几何装饰 */
.geo-deco {
  position: absolute;
  pointer-events: none;
  opacity: 0.12;
}

.circle-1 {
  width: 140px;
  height: 140px;
  border: 1px solid #00ffff;
  border-radius: 50%;
  top: 8%;
  right: 10%;
  animation: rotateSlow 25s linear infinite;
}

.circle-2 {
  width: 90px;
  height: 90px;
  border: 1px solid #7b2fff;
  border-radius: 50%;
  bottom: 12%;
  right: 18%;
  animation: rotateSlow 35s linear infinite reverse;
}

.triangle {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 40px 70px 40px;
  border-color: transparent transparent rgba(255, 0, 110, 0.15) transparent;
  top: 18%;
  right: 6%;
  animation: float 6s ease-in-out infinite;
}

/* 内容 — 左对齐 */
.section-content {
  position: relative;
  z-index: 10;
  text-align: left;
  padding-left: 10%;
  max-width: 65%;
}

.section-label {
  font-family: 'Orbitron', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.6em;
  color: #ff006eaa;
  margin-bottom: 1.2rem;
  text-shadow: 0 0 10px #ff006e44;
}

.section-content h2 {
  font-family: 'Orbitron', monospace;
  font-size: 2.8rem;
  font-weight: 900;
  background: linear-gradient(90deg, #00ffff, #7b2fff, #ff006e);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s ease-in-out infinite;
  filter: drop-shadow(0 0 24px rgba(0, 255, 255, 0.3));
  line-height: 1.3;
  margin: 0;
  letter-spacing: 0.04em;
}

/* 分割线 — 左对齐，渐变向右淡出 */
.divider-line {
  width: 180px;
  height: 2px;
  background: linear-gradient(90deg, #00ffff, #7b2fff, #ff006e, transparent);
  background-size: 200% 100%;
  margin: 1.4rem 0;
  box-shadow: 0 0 12px #00ffff44, 0 0 24px #7b2fff22;
  animation: shimmer 3s ease-in-out infinite;
}

.section-subtitle {
  font-family: 'Inter', 'Noto Sans SC', sans-serif;
  font-size: 1.1rem;
  font-weight: 400;
  color: #e0e0e088;
  letter-spacing: 0.06em;
  line-height: 1.6;
}

@keyframes rotateSlow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}
</style>
