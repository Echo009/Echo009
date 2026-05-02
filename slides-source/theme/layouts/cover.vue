<template>
  <div class="cover-root">
    <div class="grid-bg"></div>
    <div class="scanline"></div>
    <div class="corner-deco top-left"></div>
    <div class="corner-deco top-right"></div>
    <div class="corner-deco bottom-left"></div>
    <div class="corner-deco bottom-right"></div>
    <div class="cover-content">
      <p class="cover-tag">// PRESENTATION //</p>
      <h1><slot /></h1>
      <p v-if="$attrs.info" class="cover-info">{{ $attrs.info }}</p>
      <p v-if="$attrs.date" class="cover-date">{{ $attrs.date }}</p>
    </div>
    <div class="status-bar">
      <span class="status-dot"></span>
      <span>SYS::READY</span>
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
.grid-bg {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(0, 255, 255, 0.04) 1px, transparent 1px) 0 0 / 40px 40px,
    linear-gradient(rgba(0, 255, 255, 0.04) 1px, transparent 1px) 0 0 / 40px 40px;
  pointer-events: none;
}
.scanline {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 998;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.06) 2px,
    rgba(0, 0, 0, 0.06) 4px
  );
}
.corner-deco {
  position: absolute;
  width: 20px;
  height: 20px;
  border-color: #00ffff;
  border-style: solid;
  z-index: 10;
}
.top-left { top: 24px; left: 24px; border-width: 2px 0 0 2px; }
.top-right { top: 24px; right: 24px; border-width: 2px 2px 0 0; }
.bottom-left { bottom: 24px; left: 24px; border-width: 0 0 2px 2px; }
.bottom-right { bottom: 24px; right: 24px; border-width: 0 2px 2px 0; }
.cover-content {
  position: relative;
  z-index: 10;
  text-align: center;
}
.cover-tag {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  color: #00ffff88;
  margin-bottom: 1rem;
}
.cover-content h1 {
  font-family: 'Orbitron', monospace;
  font-size: 3rem;
  font-weight: 900;
  color: #00ffff;
  text-shadow: 0 0 10px #00ffff, 0 0 30px #00ffff66, 0 0 60px #00ffff33;
  line-height: 1.2;
  margin: 0;
}
.cover-info {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1rem;
  color: #ff006e;
  text-shadow: 0 0 8px #ff006e88;
  margin-top: 1.2rem;
}
.cover-date {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.85rem;
  color: #e0e0e088;
  margin-top: 0.8rem;
}
.status-bar {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  color: #00ffff66;
  letter-spacing: 0.15em;
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00ffff;
  box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff;
  animation: pulseNeon 2s ease-in-out infinite;
}
@keyframes pulseNeon {
  0%, 100% { opacity: 1; box-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff; }
  50% { opacity: 0.5; box-shadow: 0 0 5px #00ffff; }
}
</style>
