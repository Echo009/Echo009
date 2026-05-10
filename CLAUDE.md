# Echo009 项目指南

## 项目概述

赛博朋克风格个人主页，基于 Astro SSG + Slidev，部署在 GitHub Pages。

- **主站**：Astro 5.x + Tailwind + GSAP + Three.js，位于项目根目录
- **幻灯片**：Slidev 0.50 + 自定义赛博朋克主题，位于 `slides-source/`
- **构建脚本**：`scripts/build-slides.sh`，遍历 `slides-source/content/*.md` 构建到 `public/slides/`

## 开发环境

- Node.js 项目，开发前确认 Node 版本
- 幻灯片开发：`cd slides-source && npx slidev content/xxx.md`（默认端口 3030）
- 主站开发：`npm run dev`（默认端口 4321）

## 自定义赛博朋克主题

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

### 内容溢出检测

Slidev 布局组件（如 `two-col.vue`）内的内容区域（如 `.twocol-content`）设置 `overflow: auto`，当内容溢出时会显示滚动条。全局样式 `index.css` 中的滚动条规则会作用于这些元素。

### 作用域样式注意

布局组件使用 `<style scoped>`，但 `index.css` 中的全局规则（如 `::-webkit-scrollbar`、`.slidev-layout h1` 等）不受 scoped 影响，仍会正常生效。

## 验证工作流

使用 Chrome DevTools MCP 验证样式修改：

1. **导航到目标页面**：`navigate_page` → `url`
2. **截图查看**：`take_screenshot` → 保存到本地 → 用 `Read` 工具查看图片
3. **检查计算样式**：`evaluate_script` → 通过 `getComputedStyle()` 获取实际渲染值
4. **定位问题元素**：`evaluate_script` → 遍历 DOM 查找溢出/滚动元素
5. **确认 CSS 规则生效**：`evaluate_script` → 遍历 `document.styleSheets` 检查规则是否被加载

**注意**：不要用 MCP 图像分析工具查看截图，直接用 `Read` 工具读取本地图片文件即可。

## Git 工作流

- 主分支：`master`
- 部署分支：`gh-pages`（由 GitHub Actions 自动部署）
- 推送到 `master` 自动触发 CI/CD
