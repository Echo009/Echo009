# Slides 列表页 SLIDE DECK 标题区优化设计

> **日期**: 2026-05-09
> **作者**: Echo009
> **状态**: 已确认
> **涉及文件**: `src/pages/slides/index.astro`

## 背景

当前 slides 列表页的 SLIDE DECK 标题区视觉平淡——纯文字居中，缺乏冲击力。与主页 Hero 区的 glitch 粒子场风格形成落差。

## 设计目标

- 让标题区具备与主页 Hero 一致的视觉冲击力
- 复刻主页的 glitch 故障效果（cyan + pink 双色偏移层）
- 保持全站配色体系一致

非目标：

- 不改动卡片网格、分页器、导航栏等其余组件
- 不引入新依赖（Three.js 等）

## 选定方案

**全标题渐变 + 双色故障偏移 + 扫描线**

### 标题排版

- "SLIDE DECK" 单行显示，Orbitron 字体，`font-weight: 900`
- 字号：`clamp(3rem, 10vw, 4.5rem)`，响应式缩放
- 渐变：`linear-gradient(90deg, #00ffff, #7b2fff 50%, #ff006e)` 覆盖整个标题
- `letter-spacing: -0.02em`
- `drop-shadow` 外发光（cyan + pink），强度克制不影响可读性

### 故障效果

复刻 `Layout.astro` 中 `.glitch-text` 的实现模式：

- 主层：渐变文字（cyan → purple → pink）
- `::before` 伪元素：`color: #ff006e`，`clip-path: polygon(0 30%, 100% 30%, 100% 50%, 0 50%)`，间歇性水平偏移动画
- `::after` 伪元素：`color: #00ffff`，`clip-path: polygon(0 60%, 100% 60%, 100% 75%, 0 75%)`，间歇性水平偏移动画
- 整体微位移动画（`translate` 小幅偏移，4s 循环，89%-97% 区间触发）

关键帧时序（与主页一致）：
- `glitchMain`: 0%/89%/100% → 静止, 90% → (-2px,1px), 91% → (2px,-1px), 95% → (-1px,2px), 96% → (1px,-2px)
- `glitchBefore`: 90% → translate(3px,0), 91% → translate(-3px,0)
- `glitchAfter`: 90% → translate(-3px,0), 91% → translate(3px,0)

### 扫描线

- 一根 2px 高横向光条
- 渐变：`linear-gradient(90deg, transparent, rgba(0,255,255,0.25), rgba(255,0,110,0.15), transparent)`
- 从上到下循环扫过标题区域（3s linear infinite）
- 定位：标题容器内 `position: absolute`，宽度 110%（左右各溢出 5%）

### 装饰分隔线

- 标题下方 120px 宽，2px 高
- 底色：`linear-gradient(90deg, rgba(0,255,255,0.15), rgba(255,0,110,0.15))`
- 叠加从左到右的扫光动画：
  - 渐变光条：`linear-gradient(90deg, transparent, rgba(0,255,255,0.7), rgba(255,0,110,0.5), transparent)`
  - 动画：2s ease-in-out infinite，`left: -100% → 100%`

### 背景光晕

- 标题区域后方添加微弱径向渐变光晕
- `radial-gradient(ellipse, rgba(0,255,255,0.04) 0%, rgba(255,0,110,0.03) 40%, transparent 70%)`
- 居中定位，600px × 250px

### 保持不变的部分

- `// TRANSMISSIONS //` 标签：Orbitron，9px，cyan 色，`letter-spacing: 0.4em`
- 副标题：`PRESENTATIONS // TALKS // KNOWLEDGE_SHARES`，monospace，8px
- 导航栏、卡片网格、分页器、footer 均不改动

## 响应式

- 标题字号使用 `clamp(3rem, 10vw, 4.5rem)` 自适应
- 移动端（<768px）扫描线和故障效果保持，光晕可简化

## 实现边界

- 仅修改 `src/pages/slides/index.astro` 中的 hero section（`<section class="text-center mb-16 px-6">`）
- 故障效果可复用 `Layout.astro` 中已定义的全局 `.glitch-text` 类和关键帧
- 新增样式：扫描线动画、装饰分隔线扫光、背景光晕

## 验收标准

- SLIDE DECK 标题视觉冲击力明显强于当前版本
- 渐变从 cyan 到 purple 到 pink 自然过渡，覆盖整个标题
- 故障偏移效果与主页 Hero 的 Echo009 名称效果风格一致
- 扫描线流畅循环，不卡顿
- 移动端标题不溢出，效果正常
- 不影响卡片网格、分页器等其他组件的正常功能
