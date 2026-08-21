# Echo009 项目指南

## 项目概述

赛博朋克风格个人主页，基于 Astro SSG + Slidev，部署在 GitHub Pages。

- **主站**：Astro 5.x + Tailwind + GSAP + Three.js，位于项目根目录
- **幻灯片**：Slidev 0.50 + 自定义赛博朋克主题，位于 `slides-source/`
- **构建脚本**：`scripts/build-slides.sh`，遍历 `slides-source/content/*.md` 构建到 `public/slides/`

## 人生副本模块（Quest Log）

- 内容源：`src/content/quests/<slug>/`（index.md 元数据+宣言；logs/*.md 打卡记录；images/、media/ 媒体）
- 派生逻辑：`src/lib/quests.ts`（进度/排序/时间线合成，进度自动计算勿手填）
- 页面：`/quests/` 列表、`/quests/[slug]/` 详情；首页 `#quests` 摘要 section
- 脚手架：`npm run quest:new <slug>` 开副本、`npm run quest:log <slug>` 写记录
- 日常记录：quest:log 生成模板 → 编辑放图 → push（CI 自动部署）；视频单文件 <50MB
- 多图画廊：同一段落内连续 `![]()` 自动聚合（rehype-log-gallery 插件）
- 内容指南：`docs/guide/quest-log.md`（frontmatter 字段表、记录工作流、媒体规则）

## 主页 Projects 区

- 数据源：`src/data/projects.ts`（手工维护精选项目，构建时静态渲染）
- 组件：`src/components/ProjectsShowcase.astro`（位于 ARSENAL 之后）；nav 链接与 section 编号在 `src/pages/index.astro` 及各 section 组件头部维护

## 开发环境

- Node.js 项目，开发前确认 Node 版本
- 幻灯片开发：`cd slides-source && npx slidev content/xxx.md`（默认端口 3030）
- 主站开发：`npm run dev`（默认端口 4321）
- og 分享图：`npm run og:generate` 重生成 `public/og.png`（改风格后重跑并提交产物）
- 主页验收断言：`npm run build && npm run verify:homepage`（20 项断言，改动主页后应全绿）

## 过程文档

hands-free/superpowers 工作流产出的设计、计划、决策与验证文档位于 `docs/superpowers/`（该目录整体在 .gitignore 中，入库需 `git add -f`）。

## 主站字号分级（Typography Scale）

全站字号统一为 9 级语义 token，定义在 `src/layouts/Layout.astro` 的 `:root`（单一来源，调字号只改这里）；Tailwind 侧在 `tailwind.config.mjs` 注册了同名语义类（`text-h2`、`text-body`、`text-meta` 等，值引用同一批 var，含默认 line-height）：

| token | 值 | 用途 | 对应类 |
|------|------|------|------|
| `--fs-display` | clamp(4rem, 14vw, 12rem) | Hero 主标题 | `text-display` |
| `--fs-h1` | clamp(3rem, 1.25rem + 7vw, 8rem) | 终章大标题 | `text-h1` |
| `--fs-h2` | clamp(2.25rem, 2rem + 1.8vw, 3.25rem) | section 大标题 | `text-h2` |
| `--fs-h3` | 1.5rem | 卡片/条目标题 | `text-h3` |
| `--fs-lead` | clamp(1.125rem, 1rem + 0.4vw, 1.5rem) | 副标题 | `text-lead` |
| `--fs-body` | 1rem | 正文 | `text-body` |
| `--fs-meta` | 0.875rem | 元信息/导航/按钮 | `text-meta` |
| `--fs-caption` | 0.75rem | chip/badge/标签 | `text-caption` |
| `--fs-decor` | 0.55rem | 纯装饰水印 | `text-decor` |

- **大屏放大旋钮**：`html { font-size: clamp(1rem, 12.5px + 0.3vw, 1.25rem) }`（Layout.astro）——大屏根字号 16→20px，全站 rem（文字/间距/容器）等比放大；双端 rem 保持用户浏览器字号偏好生效
- **规则**：新增样式禁止再写裸 `font-size: 0.xrem` 或 `text-xs/sm/base/...` 旧刻度类，一律用 token；展示级（display/h1/h2/lead）自带 clamp，不要加 `md:` 断点前缀
- **白名单**（刻意保留原值，勿"修复"）：TechArsenal emoji `text-2xl`（图标尺寸）、SlidesList 海报装饰小字、列表页大标题 clamp(2.8rem, 9vw, 4rem)、QuestCard `.abbr` 1.6rem
- 尺寸相关 padding/尺寸优先 rem（勿用 px），保证随根字号等比；og.png 由 satori 独立渲染，不受站内字号影响

## 自定义赛博朋克主题

注意：主题必须符合赛博朋克风格，可以微调配色和字体，但整体风格要保持一致。

主题文件位于 `slides-source/theme/`，核心配色变量定义在 `styles/index.css` 的 `:root` 中：

| 变量 | 值 | 用途 |
|------|------|------|
| `--cyber-black` | #050510 | 深黑背景 |
| `--cyber-cyan` | #00ffff | 主强调色 |
| `--cyber-pink` | #ff006e | 辅助强调色 |
| `--cyber-yellow` | #f5ff00 | 高亮色 |
| `--cyber-purple` | #7b2fff | 装饰色 |

字体：Orbitron（标题展示）、Inter + Noto Sans SC（正文）、Share Tech Mono（代码）

## 布局组件

位于 `slides-source/theme/layouts/`，均为 Vue SFC（`<style scoped>`）：

- `cover.vue` — 封面页
- `default.vue` — 默认内容页
- `two-col.vue` — 双栏布局（支持 `left`/`right` props 控制列宽比）
- `section-header.vue` — 章节标题页
- `intro.vue` — 章节分隔页
- `cards.vue` — 卡片行布局

## CSS 开发经验

### 滚动条样式

**关键陷阱**：现代 Chrome (121+) 支持 `scrollbar-width` 标准属性，当设置了 `scrollbar-width: thin` 时会**覆盖** `::-webkit-scrollbar` 的 width 设置，导致无论 `::-webkit-scrollbar` 设多小都无效。

**解决方案**：用 `@supports not selector(::-webkit-scrollbar)` 包裹 Firefox 专用的 `scrollbar-width` 规则：

```css
@supports not selector(::-webkit-scrollbar) {
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--cyber-cyan) transparent;
  }
}
```

这样 Chrome 走 `::-webkit-scrollbar`（可精确控制像素），Firefox 走标准属性。

### overflow 混合轴陷阱

**CSS 规范限制**：`overflow-x: visible` + `overflow-y: auto` 无法并存。当任一轴设为非 `visible` 值时，浏览器会自动将另一轴也改为 `auto`，导致两个轴都变成滚动容器。

**替代方案**：用 `padding` 给伪元素留出空间（如 `padding-left: 4px`），保持 `overflow: auto` 不变。伪元素在 padding 区域内可见，不会被裁剪，同时纵向滚动正常工作。

### `:has()` 选择器实现条件布局

当某些内容需要特殊布局时（如 mermaid 图表页需要纵向居中），用 `:has()` 按内容类型应用样式：

```css
.slidev-layout .content-area:has(.mermaid) {
  display: flex;
  flex-direction: column;
}
.slidev-layout .content-area:has(.mermaid) > .mermaid {
  margin-top: auto;
  margin-bottom: auto;
}
```

标题保持在顶部，mermaid 在剩余空间纵向居中。只影响 default 布局（`.content-area`），不影响 two-col 布局（`.twocol-content`）。

### 流程图组件架构

`.flow` + `.flow-step` 的装饰采用**容器级竖线 + 每步圆点**分离策略：

- **竖线**：`.flow::before` 画一条贯穿容器的连续渐变线，色彩从 h3 的 bar 自然过渡
- **圆点**：`.flow-step::before` 定位在每个步骤上，用 `translate(-50%, -50%)` 居中于竖线轴线
- **衔接**：`h3 + .flow::before { top: -0.6em }` 让竖线向上延伸接住 h3 的 bar

这条轴线（h3 bar + flow line + flow-step dots）统一对齐在 1.5px 中心。

### 内容溢出检测

Slidev 布局组件（如 `two-col.vue`）内的内容区域（如 `.twocol-content`）设置 `overflow: auto`，当内容溢出时会显示滚动条。全局样式 `index.css` 中的滚动条规则会作用于这些元素。

### 作用域样式注意

布局组件使用 `<style scoped>`，但 `index.css` 中的全局规则（如 `::-webkit-scrollbar`、`.slidev-layout h1` 等）不受 scoped 影响，仍会正常生效。

## 验证工作流

使用 Chrome DevTools MCP 验证样式修改：

1. **导航到目标页面**：`navigate_page` → `url`
2. **截图查看**：`take_screenshot` → 统一保存到 `slides-source/.screenshots/` 目录（已加入 .gitignore） → 用 `Read` 工具查看图片
3. **检查计算样式**：`evaluate_script` → 通过 `getComputedStyle()` 获取实际渲染值
4. **定位问题元素**：`evaluate_script` → 遍历 DOM 查找溢出/滚动元素
5. **确认 CSS 规则生效**：`evaluate_script` → 遍历 `document.styleSheets` 检查规则是否被加载

**注意**：不要用 MCP 图像分析工具查看截图，直接用 `Read` 工具读取本地图片文件即可。

## Git 工作流

- 主分支：`master`
- 部署分支：`gh-pages`（由 GitHub Actions 自动部署）
- 推送到 `master` 自动触发 CI/CD
