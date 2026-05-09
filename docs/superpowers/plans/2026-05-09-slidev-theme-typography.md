# Slidev 主题排版与布局优化 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 精调 Slidev 赛博朋克主题的排版系统和布局间距，提升内容页可读性。

**Architecture:** 纯 CSS/间距调整，不改变组件结构。按文件分 5 个任务，每个任务独立可验证。

**Tech Stack:** Slidev 0.50 + Vue 3 + CSS

---

### Task 1: 全局排版系统（index.css）

**Files:**
- Modify: `slides-source/theme/styles/index.css`

- [ ] **Step 1: 调整 .slidev-layout 基础样式**

将第 26-29 行：
```css
  color: #d0d0d8;
  font-family: var(--font-body);
  padding: 2.5rem 3.5rem;
  position: relative;
  line-height: 1.8;
  letter-spacing: 0.01em;
```
改为：
```css
  color: #d8d8e0;
  font-family: var(--font-body);
  padding: 2.5rem 3.5rem;
  position: relative;
  line-height: 1.85;
  letter-spacing: 0.015em;
```

- [ ] **Step 2: 调整 h1 字号**

将第 53 行：
```css
  font-size: 2.8rem;
```
改为：
```css
  font-size: 2.6rem;
```

- [ ] **Step 3: 调整 h2 字号**

将第 69 行：
```css
  font-size: 1.8rem;
```
改为：
```css
  font-size: 1.5rem;
```

- [ ] **Step 4: 调整 h3 字号**

将第 85 行：
```css
  font-size: 1.3rem;
```
改为：
```css
  font-size: 1.15rem;
```

- [ ] **Step 5: 调整正文字号**

将第 96 行：
```css
  font-size: 1rem;
```
改为：
```css
  font-size: 1.05rem;
```

- [ ] **Step 6: 调整 .slide-desc 次要文字颜色**

将第 373 行：
```css
  color: rgba(224, 224, 224, 0.55);
```
改为：
```css
  color: rgba(224, 224, 224, 0.7);
```

- [ ] **Step 7: 调整内联代码字号**

将第 141 行：
```css
  font-size: 0.88em;
```
改为：
```css
  font-size: 0.92em;
```

- [ ] **Step 8: 调整代码块内边距**

将第 168 行：
```css
  padding: 1.2rem;
```
改为：
```css
  padding: 1.4rem;
```

- [ ] **Step 9: 增强代码块顶部渐变条**

将第 153-163 行：
```css
.slidev-layout pre::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--cyber-cyan), var(--cyber-purple), var(--cyber-pink));
  opacity: 0.8;
}
```
改为：
```css
.slidev-layout pre::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--cyber-cyan), var(--cyber-purple), var(--cyber-pink));
  opacity: 0.9;
}
```

- [ ] **Step 10: 增强列表项 hover 效果**

将第 196-199 行：
```css
.slidev-layout ul li:hover::before {
  text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff88;
  transform: scale(1.3);
}
```
改为：
```css
.slidev-layout ul li:hover::before {
  text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff88;
  transform: scale(1.2);
}
```

- [ ] **Step 11: 提交**

```bash
cd D:/Work/Personal/Echo009
git add slides-source/theme/styles/index.css
git commit -m "feat(slides): 优化全局排版系统 — 字号、行高、色彩对比度、代码块"
```

---

### Task 2: default.vue 布局间距

**Files:**
- Modify: `slides-source/theme/layouts/default.vue`

- [ ] **Step 1: 调整整体 padding**

将 `.default-root` 的第 59 行：
```css
  padding: 3rem 4rem 4rem;
```
改为：
```css
  padding: 2.5rem 3.5rem 4.5rem;
```

- [ ] **Step 2: 调整点阵背景间距**

将 `.dot-grid` 的第 70 行：
```css
  background-size: 24px 24px;
```
改为：
```css
  background-size: 28px 28px;
```

- [ ] **Step 3: 调整 HUD 顶部发光高度**

将 `.hud-top-glow` 的第 93 行：
```css
  height: 20px;
```
改为：
```css
  height: 12px;
```

- [ ] **Step 4: 缩窄侧边栏**

将 `.section-sidebar` 的第 104 行：
```css
  width: 180px;
```
改为：
```css
  width: 140px;
```

- [ ] **Step 5: 调整内容区侧边栏偏移**

将 `.content-area.with-sidebar` 的第 166 行：
```css
  margin-left: 180px;
```
改为：
```css
  margin-left: 140px;
```

- [ ] **Step 6: 调整底部区域侧边栏偏移**

将 `.bottom-section.with-sidebar` 的第 179 行：
```css
  left: 180px;
```
改为：
```css
  left: 140px;
```

- [ ] **Step 7: 增强进度条可见度**

将 `.progress-track` 的第 185 行：
```css
  height: 1px;
```
改为：
```css
  height: 2px;
```

- [ ] **Step 8: 降低竖线装饰透明度**

将 `.vline` 的第 150 行：
```css
  background: linear-gradient(180deg, rgba(0, 255, 255, 0.1), rgba(0, 255, 255, 0.02), rgba(0, 255, 255, 0.1));
```
改为：
```css
  background: linear-gradient(180deg, rgba(0, 255, 255, 0.06), rgba(0, 255, 255, 0.01), rgba(0, 255, 255, 0.06));
```

- [ ] **Step 9: 调整底部区域 padding**

将 `.bottom-section` 的第 176 行：
```css
  padding: 0 4rem 10px;
```
改为：
```css
  padding: 0 3.5rem 10px;
```

- [ ] **Step 10: 提交**

```bash
cd D:/Work/Personal/Echo009
git add slides-source/theme/layouts/default.vue
git commit -m "feat(slides): 优化 default 布局 — 侧边栏缩窄、间距精调、进度条增强"
```

---

### Task 3: two-col.vue 布局间距

**Files:**
- Modify: `slides-source/theme/layouts/two-col.vue`

- [ ] **Step 1: 调整整体 padding**

将 `.twocol-root` 的第 71 行：
```css
  padding: 3rem 4rem 4rem;
```
改为：
```css
  padding: 2.5rem 3.5rem 4.5rem;
```

- [ ] **Step 2: 缩窄侧边栏**

将 `.section-sidebar` 的第 99 行：
```css
  width: 180px;
```
改为：
```css
  width: 140px;
```

- [ ] **Step 3: 调整双栏内容区侧边栏偏移**

将 `.twocol-content.with-sidebar` 的第 151 行：
```css
  margin-left: 180px;
```
改为：
```css
  margin-left: 140px;
```

- [ ] **Step 4: 调整底部区域侧边栏偏移**

将 `.bottom-section.with-sidebar` 的第 175 行：
```css
  left: 180px;
```
改为：
```css
  left: 140px;
```

- [ ] **Step 5: 增大双栏间距**

将 `.twocol-content` 的第 148 行：
```css
  gap: 0 1.5rem;
```
改为：
```css
  gap: 0 2rem;
```

- [ ] **Step 6: 柔化分割线渐变**

将 `.divider-line` 的第 162 行：
```css
  background: linear-gradient(180deg, transparent, #00ffff, #7b2fff, transparent);
  opacity: 0.3;
```
改为：
```css
  background: linear-gradient(180deg, transparent, rgba(0, 255, 255, 0.6), rgba(123, 47, 255, 0.4), transparent);
  opacity: 0.25;
```

- [ ] **Step 7: 调整底部区域 padding**

将 `.bottom-section` 的第 172 行：
```css
  padding: 0 4rem 10px;
```
改为：
```css
  padding: 0 3.5rem 10px;
```

- [ ] **Step 8: 提交**

```bash
cd D:/Work/Personal/Echo009
git add slides-source/theme/layouts/two-col.vue
git commit -m "feat(slides): 优化 two-col 布局 — 侧边栏缩窄、间距精调、分割线柔化"
```

---

### Task 4: cards.vue 布局间距

**Files:**
- Modify: `slides-source/theme/layouts/cards.vue`

- [ ] **Step 1: 调整整体 padding**

将 `.cards-root` 的第 59 行：
```css
  padding: 3rem 4rem 4rem;
```
改为：
```css
  padding: 2.5rem 3.5rem 4.5rem;
```

- [ ] **Step 2: 缩窄侧边栏**

将 `.section-sidebar` 的第 93 行：
```css
  width: 180px;
```
改为：
```css
  width: 140px;
```

- [ ] **Step 3: 调整内容区侧边栏偏移**

将 `.cards-content.with-sidebar` 的第 139 行：
```css
  margin-left: 180px;
```
改为：
```css
  margin-left: 140px;
```

- [ ] **Step 4: 调整底部区域侧边栏偏移**

将 `.bottom-section.with-sidebar` 的第 173 行：
```css
  left: 180px;
```
改为：
```css
  left: 140px;
```

- [ ] **Step 5: 调整卡片间距**

将 `.cards-content` 的第 136 行：
```css
  gap: 1.5rem;
```
改为：
```css
  gap: 1.2rem;
```

- [ ] **Step 6: 调整卡片内 padding**

将 `.cards-content :deep(.card)` 的第 149 行：
```css
  padding: 1.2rem 1.4rem;
```
改为：
```css
  padding: 1rem 1.2rem;
```

- [ ] **Step 7: 调整底部区域 padding**

将 `.bottom-section` 的第 170 行：
```css
  padding: 0 4rem 10px;
```
改为：
```css
  padding: 0 3.5rem 10px;
```

- [ ] **Step 8: 提交**

```bash
cd D:/Work/Personal/Echo009
git add slides-source/theme/layouts/cards.vue
git commit -m "feat(slides): 优化 cards 布局 — 侧边栏缩窄、卡片间距精调"
```

---

### Task 5: cover.vue 封面页精调

**Files:**
- Modify: `slides-source/theme/layouts/cover.vue`

- [ ] **Step 1: 增大标题字号**

将 `.cover-content h1` 的第 193 行：
```css
  font-size: 2.8rem;
```
改为：
```css
  font-size: 3.2rem;
```

- [ ] **Step 2: 缩小 cover-tag 字号**

将 `.cover-tag` 的第 169 行：
```css
  font-size: 0.7rem;
```
改为：
```css
  font-size: 0.6rem;
```

- [ ] **Step 3: 缩小 cover-info 字号并调整颜色**

将 `.cover-info` 的第 208-209 行：
```css
  font-size: 1.15rem;
  color: #ff006e;
```
改为：
```css
  font-size: 1rem;
  color: #ff006ecc;
```

- [ ] **Step 4: 加宽装饰横线**

将 `.title-line` 的第 176 行：
```css
  width: 180px;
```
改为：
```css
  width: 240px;
```

- [ ] **Step 5: 缩小旋转圆环**

将 `.orbit-ring` 的第 123-124 行：
```css
  width: 340px;
  height: 340px;
```
改为：
```css
  width: 280px;
  height: 280px;
```

将 `.orbit-ring.outer` 的第 131-132 行：
```css
  width: 420px;
  height: 420px;
```
改为：
```css
  width: 360px;
  height: 360px;
```

- [ ] **Step 6: 降低圆环透明度**

将 `.orbit-ring` 的第 125 行：
```css
  border: 1px dashed rgba(0, 255, 255, 0.12);
```
改为：
```css
  border: 1px dashed rgba(0, 255, 255, 0.08);
```

将 `.orbit-ring.outer` 的第 133 行：
```css
  border: 1px solid rgba(0, 255, 255, 0.05);
```
改为：
```css
  border: 1px solid rgba(0, 255, 255, 0.04);
```

- [ ] **Step 7: 缩小四角装饰**

将 `.corner-deco` 的第 140-141 行：
```css
  width: 24px;
  height: 24px;
```
改为：
```css
  width: 18px;
  height: 18px;
```

- [ ] **Step 8: 调整状态栏字号**

将 `.status-bar` 的第 233 行：
```css
  font-size: 0.55rem;
```
改为：
```css
  font-size: 0.5rem;
```

- [ ] **Step 9: 降低状态文字透明度**

将 `.status-bar` 的第 235 行：
```css
  color: #00ffff55;
```
改为：
```css
  color: #00ffff44;
```

- [ ] **Step 10: 调整移动扫描线**

将 `.moving-scan` 的第 106 行：
```css
  height: 80px;
```
改为：
```css
  height: 60px;
```

将 `.moving-scan` 的 animation 行（第 117 行）：
```css
  animation: scanMove 8s linear infinite;
```
改为：
```css
  animation: scanMove 6s linear infinite;
```

- [ ] **Step 11: 提交**

```bash
cd D:/Work/Personal/Echo009
git add slides-source/theme/layouts/cover.vue
git commit -m "feat(slides): 优化封面页 — 标题放大、装饰收敛、视觉焦点增强"
```

---

### Task 6: 构建验证

- [ ] **Step 1: 构建 Slidev 幻灯片**

```bash
cd D:/Work/Personal/Echo009
bash scripts/build-slides.sh
```

Expected: 构建成功，无报错

- [ ] **Step 2: 本地预览验证**

```bash
cd D:/Work/Personal/Echo009
npm run dev
```

打开浏览器检查：
- 封面页标题大小和层次
- 内容页文字可读性
- 双栏布局间距
- 卡片布局间距
- 代码块显示效果

- [ ] **Step 3: 确认无问题后推送**

```bash
cd D:/Work/Personal/Echo009
git push origin master
```
