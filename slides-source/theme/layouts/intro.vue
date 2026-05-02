<template>
  <div class="intro-root">
    <div class="grid-bg"></div>
    <div class="intro-content">
      <p v-if="$attrs.no" class="section-no">PART {{ $attrs.no }}</p>
      <h2><slot /></h2>
      <div class="divider-line"></div>
      <p v-if="$attrs.subtitle" class="section-subtitle">{{ $attrs.subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.intro-root {
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
    linear-gradient(90deg, rgba(0, 255, 255, 0.03) 1px, transparent 1px) 0 0 / 50px 50px,
    linear-gradient(rgba(0, 255, 255, 0.03) 1px, transparent 1px) 0 0 / 50px 50px;
  pointer-events: none;
}
.intro-content {
  position: relative;
  z-index: 10;
  text-align: center;
}
.section-no {
  font-family: 'Orbitron', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.5em;
  color: #ff006e88;
  margin-bottom: 1rem;
}
.intro-content h2 {
  font-family: 'Orbitron', monospace;
  font-size: 2.2rem;
  font-weight: 700;
  background: linear-gradient(90deg, #00ffff, #ff006e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 20px rgba(0, 255, 255, 0.3));
  line-height: 1.3;
  margin: 0;
}
.divider-line {
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, #00ffff, #ff006e);
  margin: 1.2rem auto;
  box-shadow: 0 0 10px #00ffff66;
}
.section-subtitle {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.9rem;
  color: #e0e0e088;
}
</style>
