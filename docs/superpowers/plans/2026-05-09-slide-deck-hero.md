# SLIDE DECK 标题区优化 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 slides 列表页的 SLIDE DECK 标题区从平淡的双行文字升级为全标题渐变 + glitch 故障偏移 + 扫描线的视觉冲击版本。

**Architecture:** 仅修改 `src/pages/slides/index.astro` 的 hero section。复用 `Layout.astro` 中已有的 `.glitch-text` 全局类和关键帧动画，新增扫描线、装饰分隔线、背景光晕的样式。

**Tech Stack:** Astro 组件 + scoped CSS + Tailwind utility classes

---

### Task 1: 重写 hero section HTML 结构

**Files:**
- Modify: `src/pages/slides/index.astro:70-93`（hero section）

当前代码（lines 70-93）：
```html
<section class="text-center mb-16 px-6">
  <p class="section-label mb-4">// TRANSMISSIONS //</p>
  <h1 class="font-display font-black text-5xl md:text-7xl text-white mb-6" style="...">
    SLIDE
    <span class="block" style="...">DECK</span>
  </h1>
  <p class="font-mono text-white/40 text-sm tracking-widest">
    PRESENTATIONS // TALKS // KNOWLEDGE_SHARES
  </p>
</section>
```

- [ ] **Step 1: 替换 hero section 为新结构**

将 `<section class="text-center mb-16 px-6">` 到对应的 `</section>` 替换为：

```html
<section class="slides-hero text-center mb-16 px-6">
  <!-- 背景光晕 -->
  <div class="hero-glow" aria-hidden="true"></div>

  <p class="section-label mb-4">// TRANSMISSIONS //</p>

  <!-- Glitch 标题 -->
  <div class="hero-title-wrapper">
    <!-- 扫描线 -->
    <div class="hero-scanline" aria-hidden="true"></div>

    <h1
      class="glitch-text hero-title"
      data-text="SLIDE DECK"
    >
      SLIDE DECK
    </h1>
  </div>

  <!-- 装饰分隔线 -->
  <div class="hero-divider">
    <div class="hero-divider-sweep" aria-hidden="true"></div>
  </div>

  <p class="font-mono text-white/40 text-sm tracking-widest">
    PRESENTATIONS // TALKS // KNOWLEDGE_SHARES
  </p>
</section>
```

- [ ] **Step 2: 构建项目验证 HTML 结构正确**

Run: `cd "D:/Work/Personal/Echo009" && npx astro build 2>&1 | tail -5`
Expected: 构建成功（标题此时还没有渐变效果，但结构不报错）

- [ ] **Step 3: Commit 结构变更**

```bash
git add src/pages/slides/index.astro
git commit -m "feat(slides): 重写 hero section 为 glitch 标题结构"
```

---

### Task 2: 添加标题渐变 + glitch + 扫描线 + 分隔线样式

**Files:**
- Modify: `src/pages/slides/index.astro`（`<style>` block，当前在 lines 118-137）

- [ ] **Step 1: 在 `<style>` 块末尾追加新样式**

在现有 `<style>` 的 `}` 关闭标签之前追加：

```css
/* ── Hero Title Gradient + Glitch ── */
.hero-title-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 1rem;
}

.hero-title {
  font-family: 'Orbitron', sans-serif;
  font-size: clamp(3rem, 10vw, 4.5rem);
  font-weight: 900;
  line-height: 1;
  letter-spacing: -0.02em;
  background: linear-gradient(90deg, #00ffff, #7b2fff 50%, #ff006e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 0 30px rgba(0, 255, 255, 0.15)) drop-shadow(0 0 20px rgba(255, 0, 110, 0.1));
  white-space: nowrap;
}

/* Glitch 伪元素覆盖渐变色（全局 .glitch-text 默认用纯色） */
.hero-title.glitch-text::before {
  color: #ff006e;
  opacity: 0.7;
  clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%);
}

.hero-title.glitch-text::after {
  color: #00ffff;
  opacity: 0.7;
  clip-path: polygon(0 60%, 100% 60%, 100% 75%, 0 75%);
}

/* ── Scanline ── */
.hero-scanline {
  position: absolute;
  left: -5%;
  width: 110%;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.25), rgba(255, 0, 110, 0.15), transparent);
  animation: heroScan 3s linear infinite;
  pointer-events: none;
  z-index: 3;
}

@keyframes heroScan {
  0% { top: -10%; }
  100% { top: 110%; }
}

/* ── Divider ── */
.hero-divider {
  position: relative;
  width: 120px;
  height: 2px;
  margin: 0 auto 1rem;
  background: linear-gradient(90deg, rgba(0, 255, 255, 0.15), rgba(255, 0, 110, 0.15));
  border-radius: 1px;
  overflow: hidden;
}

.hero-divider-sweep {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.7), rgba(255, 0, 110, 0.5), transparent);
  animation: dividerSweep 2s ease-in-out infinite;
}

@keyframes dividerSweep {
  0% { left: -100%; }
  100% { left: 100%; }
}

/* ── Background Glow ── */
.hero-glow {
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 250px;
  background: radial-gradient(ellipse, rgba(0, 255, 255, 0.04) 0%, rgba(255, 0, 110, 0.03) 40%, transparent 70%);
  pointer-events: none;
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .hero-glow {
    width: 100%;
    opacity: 0.6;
  }
}
```

- [ ] **Step 2: 构建并本地预览**

Run: `cd "D:/Work/Personal/Echo009" && npx astro build 2>&1 | tail -5`
Expected: 构建成功

然后用浏览器打开 `docs/index.html` 或 `npx astro dev` 查看 `/slides` 页面，验证：
- 标题为单行 "SLIDE DECK"
- 渐变从 cyan → purple → pink 覆盖整个标题
- pink 和 cyan 故障偏移层间歇性出现
- 扫描线从上到下循环扫过
- 分隔线有从左到右的扫光效果
- 标题后方有微弱光晕

- [ ] **Step 3: Commit 样式变更**

```bash
git add src/pages/slides/index.astro
git commit -m "feat(slides): 添加 hero 标题渐变、glitch、扫描线、分隔线样式"
```

---

### Task 3: 移动端验证 + 最终清理

**Files:**
- Modify: `src/pages/slides/index.astro`（如有调整）

- [ ] **Step 1: 用 dev server 在浏览器中验证移动端**

Run: `cd "D:/Work/Personal/Echo009" && npx astro dev`

在浏览器中：
1. 打开 `/slides` 页面，确认桌面端效果正常
2. 切换到移动端视口（375px 宽），确认标题不溢出、效果正常
3. 确认导航栏、卡片网格、分页器未受影响

- [ ] **Step 2: 如有问题则修复，否则直接 commit**

```bash
git add src/pages/slides/index.astro
git commit -m "feat(slides): 最终调整移动端响应式"  # 仅在有修改时执行
```

- [ ] **Step 3: 最终构建验证**

Run: `cd "D:/Work/Personal/Echo009" && npx astro build 2>&1 | tail -5`
Expected: 构建成功，无警告
