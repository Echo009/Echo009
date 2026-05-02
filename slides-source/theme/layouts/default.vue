<template>
  <div class="default-root">
    <div class="hud-top-line"></div>
    <div class="side-label">
      <span v-if="$attrs.section">{{ $attrs.section }}</span>
    </div>
    <div class="content-area">
      <slot />
    </div>
    <div class="bottom-bar">
      <span class="page-indicator">{{ $slidev.nav.currentPage }} / {{ $slidev.nav.total }}</span>
      <span class="sys-tag">SYS::ACTIVE</span>
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
  padding: 2.5rem 3rem 3.5rem;
  display: flex;
  flex-direction: column;
}
.hud-top-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, #00ffff, #ff006e, #7b2fff, #00ffff);
  background-size: 200% 100%;
  animation: borderFlow 3s linear infinite;
}
.side-label {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%) rotate(-90deg);
  font-family: 'Orbitron', monospace;
  font-size: 0.55rem;
  letter-spacing: 0.4em;
  color: #00ffff44;
  white-space: nowrap;
}
.content-area {
  flex: 1;
  position: relative;
  z-index: 5;
  overflow: auto;
}
.bottom-bar {
  position: absolute;
  bottom: 12px;
  left: 3rem;
  right: 3rem;
  display: flex;
  justify-content: space-between;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  color: #00ffff44;
  letter-spacing: 0.1em;
}
@keyframes borderFlow {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
</style>
