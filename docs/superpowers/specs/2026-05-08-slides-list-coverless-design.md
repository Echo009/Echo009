# Slides 列表页封面缺失兼容（Coverless Poster）设计稿

作者：Echo009  
日期：2026-05-08  
范围：`/slides` 列表页（`src/pages/slides/index.astro` + `src/components/SlidesList.astro`）

## 背景与目标

当前 Slides 列表页卡片存在“封面图负担”：当没有封面图时，列表页在视觉上容易显得“缺素材”，并且要求每个 deck 都准备 cover 会带来额外成本。

本设计的目标是：

- **兼容没有封面图的情况**，且视觉上依然“完整、精致、像封面”。
- **不要求新增任何图片资产**，不增加日常制作负担。
- 保持现有“杂志网格/赛博风”整体语言与动效，不引入大范围重构。

非目标：

- 不改变 Slidev 构建产物结构与 `meta.json` 字段（不新增强制字段）。
- 不重做分页/动画/网格布局。

## 现状（Relevant Code）

- 列表页：`src/pages/slides/index.astro` 从 `public/slides/*/meta.json` 聚合 slides
  - `cover` 为空时当前仍会渲染“封面区域”（组件内用渐变占位）。
- 卡片组件：`src/components/SlidesList.astro`
  - `.slide-cover` 固定存在；`slide.cover ? <img> : <div class="slide-cover-gradient" />`
  - featured 卡第一张横向布局（封面区宽 58%）

## 方案选择

### 选定方案（A）：保持卡片结构，升级无封面占位为“赛博海报”

约束与用户选择：

- 卡片封面区**永远保留**（保持现有布局与杂志网格感）。
- **有真实封面图**：继续展示真实封面图。
- **无封面图**：使用 B3 风格“赛博海报”占位（扫描线/警示光带/霓虹角标）。
- 海报排版选择：**T1（左下主标题）**。
- 进一步调整：**去掉左下“大字母/大字”主视觉**，以短标题为主，减少“抢戏”，更适配中文标题。

### 未选方案（记录）

- 统一所有卡片都使用海报（不展示真实封面）：不符合用户偏好。
- 将无封面卡折叠/缩小封面区：破坏“封面区永远保留”的一致性。
- 用 Canvas/SVG 生成真实图片：复杂度高、收益不如纯 CSS/DOM。

## 交互与渲染规则（核心）

### 三态规则

1) **封面存在**（`slide.cover` 非空）

- 渲染 `<img src={slide.cover}>`，继续保留：
  - `object-fit: cover`
  - hover 的轻微缩放/透明度变化
  - `cover-grid-overlay` 的 hover 叠加增强

2) **封面缺失**（`slide.cover` 为空）

- 将当前的 `.slide-cover-gradient` 替换为“海报占位层”（DOM + CSS），并保留 `cover-grid-overlay`：
  - 背景：深色渐变 + 少量霓虹光晕（cyan/pink）
  - 纹理：扫描线（repeating-linear-gradient）
  - 点缀：一条倾斜警示光带（半透明黄/粉系）
  - 角标：左上 cyan / 右上 pink（呼应整体赛博边角语言）
  - **左下标题块（T1）**：
    - `shortTitle`：短标题（单行截断）
    - `meta`：`AUTO POSTER • NO COVER`（弱化解释，不作为主视觉）
  - 右下弱状态：`SYS // COVERLESS`（极弱，氛围用）

3) **hover 行为**

- 有封面图：维持现状 hover。
- 无封面海报：hover 只做“轻微增强”，避免无封面比有封面更抢眼：
  - `cover-grid-overlay` 的出现可以保留，但整体亮度/对比需克制。

### 文案与数据规则

- `shortTitle`：
  - 基于 `slide.title.trim()`
  - 默认取前 **12** 字符（可配置为 8–14）
  - 超出截断加 `…`
  - 中文/英文都保持原始大小写（不强制全大写）
- `meta` 文案固定：`AUTO POSTER • NO COVER`
- `SYS // COVERLESS` 固定（可弱化到接近不可读，仅做氛围）

## 样式约束（视觉层级）

### 尺寸与布局

- 普通卡：封面区继续 `aspect-ratio: 16 / 9`
- featured 卡：继续现有 58% 封面区宽度 + 最小高 220px
- 移动端（<=768px）：保持现有 responsive，featured 回落纵向时仍按 16:9 表现

### “克制度”指标（避免抢戏）

- 无封面海报整体对比度、发光强度应**低于真实封面图**一档。
- 扫描线透明度低：仅提供质感，不产生噪音。
- 警示光带不遮挡左下标题块的可读性。
- 左下短标题可轻微发光，但不要盖过信息区 `.slide-title` 的阅读优先级。

## 可访问性与性能

- 无封面占位不引入额外图片请求（纯 CSS/DOM）。
- 占位中的状态文案与短标题为真实文本（可被复制/搜索）。
- 可选：对封面容器增加 `aria-label`（例如“无封面，自动海报占位”），避免状态只靠视觉表达。

## 实现边界与改动范围

- 不修改 `src/pages/slides/index.astro` 聚合逻辑。
- 主要改动在 `src/components/SlidesList.astro`：
  - 将无封面分支从 `.slide-cover-gradient` 替换为海报占位 DOM
  - 新增对应 CSS（背景/纹理/警示带/角标/标题块/hover）
- 不新增图片资产，不新增 `meta.json` 强制字段。

## 验收标准（Definition of Done）

- `slide.cover` 为空时，卡片仍保持“封面区存在且像封面”，并与整体风格一致。
- 列表页同时存在“有封面/无封面”卡片时，视觉层级自然，无封面不显突兀。
- featured 卡与普通卡都正确适配无封面占位。
- 移动端不溢出、不遮挡标题，短标题稳定单行截断。

