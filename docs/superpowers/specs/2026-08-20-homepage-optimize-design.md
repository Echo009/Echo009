# 主页优化设计：性能 + Projects + 细节打磨

> 2026-08-20 · hands-free 模式产出 · 决策详见 `docs/superpowers/decisions/2026-08-20-homepage-optimize-decisions.md`

## 目标

对赛博朋克个人主页（Astro SSG）做三类优化：

1. **性能**：消除 Hero Three.js 粒子场的三个痛点——连线计算 O(n²) 阻塞主线程、滚出视口后渲染不停、WebGL 不可用无降级
2. **内容**：新增 Projects section，手工维护精选项目，静态渲染
3. **细节**：SEO 基础补全（og:image / canonical / sitemap / lang）、移动端汉堡菜单、Arsenal 图标升级为品牌 SVG、NetworkNode 第三方图兜底

## 验收标准

| # | 标准 | 验证方式 |
|---|------|---------|
| AC1 | `npm run build` 成功 | 命令退出码 0 |
| AC2 | Hero 连线计算仅对 ≤300 粒子采样（不再 1800 全量 O(n²)） | 代码审查 + 产物脚本含 `LINE_SAMPLE` 逻辑 |
| AC3 | hero 离开视口 / 标签页隐藏时 rAF 循环停止，恢复时平滑续播 | 代码审查（IntersectionObserver + visibilitychange + delta 累加时钟） |
| AC4 | WebGL 不可用时 hero 静态降级、页面其余部分正常 | 代码审查（try/catch + canvas 隐藏 + CSS 背景类） |
| AC5 | 构建产物含 `id="projects"` section，卡片 ≥4，nav（桌面+移动端）含 PROJECTS 链接 | verify 脚本断言 dist/index.html |
| AC6 | `dist/index.html` 含 `lang="zh-CN"`、canonical（`https://me.echo0.cn/`）、og:image 指向 `/og.png`、twitter card | verify 脚本断言 |
| AC7 | `dist/sitemap-index.xml` 存在且含站点页面；`dist/robots.txt` 指向 sitemap | verify 脚本断言 |
| AC8 | Arsenal 卡片渲染内联 SVG 图标，无 emoji 技术图标残留（分组 emoji 保留属设计内） | verify 脚本断言（arsenal 区块 `<svg` 计数 ≥ 18） |
| AC9 | 移动端汉堡菜单：`md:hidden` 按钮 + aria-expanded toggle + 抽屉含全部 nav 链接 | verify 脚本断言产物标记 |
| AC10 | streak/snake 图挂载 onerror 兜底 | 代码审查 |

验证统一由 `scripts/verify-homepage.mjs`（node 断言脚本）+ 人工代码审查执行。

## 设计

### 1. Hero 性能优化（`src/components/Hero.astro`）

**① 连线降采样**：新增常量 `LINE_SAMPLE_COUNT = 300`，`buildLines()` 只遍历前 300 个粒子（162 万次迭代 → 4.5 万次）。粒子云本体仍 1800 个，视觉无感（连线 opacity 0.08）。

**② 渲染按需启停**：
```ts
let rafId: number | null = null;
let elapsed = 0;                       // 自维护时钟，替代 getElapsedTime()
function animate() { rafId = requestAnimationFrame(tick); }
function tick() {
  elapsed += Math.min(clock.getDelta(), 0.1);  // 上限防跳变
  /* uniforms / rotation / render */
  rafId = requestAnimationFrame(tick);
}
function start() { if (rafId === null) { clock.getDelta(); animate(); } }  // 丢弃积累的 delta
function stop()  { if (rafId !== null) { cancelAnimationFrame(rafId); rafId = null; } }
```
- `IntersectionObserver` 观察 `#hero`：`isIntersecting` → start / stop
- `visibilitychange`：`document.hidden` → stop，否则若 hero 可见 → start

**③ WebGL 降级**：创建 renderer 前探测 `document.createElement('canvas').getContext('webgl')`；失败 → 不初始化 Three.js，隐藏 `#hero-canvas`，给 section 加 `hero-fallback` 类（CSS 网格装饰背景，样式同 profile 的 grid）。GSAP 入场与 typewriter 照常。

### 2. Projects Section

**数据**（新建 `src/data/projects.ts`）：
```ts
export interface Project {
  name: string;      // 项目名（保留仓库原名）
  tagline: string;   // 英文短语（HUD 标签风格）
  description: string; // 中文一两句
  tech: string[];    // 技术标签（英文）
  link: string;      // 仓库地址
  accent?: string;   // 可选强调色，默认 cyan/pink/purple/yellow 循环
}
```

**初始内容**（来自 GitHub 公开仓库，D6）：
1. **Echo009**（本站）— Astro/Three.js/GSAP 赛博朋克主页
2. **PowerJob-Docs** — PowerJob 分布式调度中间件文档参与
3. **Docker** — 容器化实践与 shell 笔记
4. **Algorithm-Practise** — Java 算法练习

**组件**（新建 `src/components/ProjectsShowcase.astro`）：
- `section id="projects"`，标题 `PROJECT SHOWCASE`（SHOWCASE 上色），section-label `// SECTION_04`
- 卡片：`hud-panel hud-corner`，2 列网格（md 以下 1 列），accent 四色循环；含名称（font-display）、tagline（section-label 风格）、描述、tech 小标签（mono 小字边框 pill）、`VIEW_SOURCE ↗` 链接
- GSAP reveal 动画沿用现有 fromTo + stagger 模式

**接线**：
- `index.astro`：nav links 数组在 ARSENAL 后插入 `{ href: '#projects', label: 'PROJECTS' }` → 顺序 PROFILE/ARSENAL/PROJECTS/PROTOCOL/NETWORK/QUESTS/SIGNAL/SLIDES；`<ProjectsShowcase />` 插在 `<TechArsenal />` 后；sections 高亮数组在 `'arsenal'` 后插入 `'projects'`
- 编号顺延：CoreProtocol 04→05、NetworkNode 05→06、QuestsSummary 06→07、Signal 07→08

### 3. SEO 基础补全

**Layout.astro**：
- `lang="en"` → `lang="zh-CN"`
- `<link rel="canonical" href={canonical}>`（基于 `Astro.site` + `Astro.url.pathname` 归一化）
- og:image / og:url / twitter:card（summary_large_image）等 meta 补全
- 结构：`site` prop 传入或直接用 `Astro.site`

**astro.config.mjs**：`site: 'https://echo009.github.io'` → `'https://me.echo0.cn'`；integrations 加 `sitemap()`

**public/robots.txt**（新建）：
```
User-agent: *
Allow: /

Sitemap: https://me.echo0.cn/sitemap-index.xml
```

**og 图生成**（新建 `scripts/generate-og.mjs` + devDeps `satori` `@resvg/resvg-js` `@fontsource/orbitron` `@fontsource/share-tech-mono`）：
- 1200×630，赛博朋克风格：`#050510` 底 + 青色网格线 + "Echo009"（Orbitron 900，白+青 glow 近似）+ `// AI-AUGMENTED DEVELOPER`（Share Tech Mono，青）+ 四色 accent 条
- 字体读 `node_modules/@fontsource/*/files/*.woff`（satori 接受 woff buffer）
- 产物 `public/og.png` 入库；package.json 加 `"og:generate": "node scripts/generate-og.mjs"`

### 4. 移动端导航（`src/pages/index.astro`）

- 汉堡按钮 `md:hidden`：三线 SVG，点击 toggle `#mobile-menu` 的 `open` class 与自身 `aria-expanded`
- 抽屉 `#mobile-menu`：`fixed inset-0 z-[60]`，背景 `rgba(5,5,16,0.95)` + backdrop blur；链接列复用 nav-link 样式（加大触控区 py-4）；顶部保留 logo 与关闭按钮（同汉堡，切换为 ✕）
- 点击任意链接 / 按 Esc 关闭
- 初始 `hidden`（无 JS 也可用页面其余功能， Progressive Enhancement 从简：直接 class toggle）

### 5. Arsenal 图标升级（`src/components/TechArsenal.astro`）

- devDeps 加 `astro-icon` `@iconify-json/simple-icons`
- 按 astro-icon v1 约定使用：`import { Icon } from 'astro-icon/components'`，`<Icon name="si:react" />` 按包名自动解析 `@iconify-json/simple-icons`，零 integration 配置
- tech 项：`{ name: 'React', icon: 'logos:react' }` → `{ name: 'React', icon: 'si:react' }`，渲染 `<Icon name={item.icon} class="..." />`
- 图标尺寸 ~20px，颜色跟随分组 accent（CSS `color`，simple-icons 单色 `currentColor` 填充）
- 分组 emoji（🤖⌨️🎨⚙️）保留（D13）
- 图标名逐一验证：构建报错即替换近似品牌名（如 `si:claude` / `si:anthropic`、`si:cursor`、`si:openai`、`si:githubcopilot`）

### 6. NetworkNode 兜底（`src/components/NetworkNode.astro`）

- 两张外部图加内联 `onerror`：隐藏自身、显示同级预置 `[ SIGNAL_OFFLINE ]` 占位 span（mono 灰字）
- 占位默认 `hidden`

## 风险与回退

- **图标名不存在** → 构建期报错（fail-fast），替换最近似名即可，无运行时风险
- **satori 字体/版本兼容** → 脚本一次性运行，失败可改用系统字体回退（fontFamily 缺省），产物仍能生成
- **site 改域名影响 GH Pages 部署** → canonical/sitemap 只引用 URL 字符串，不影响部署管线；CNAME 已存在，无冲突

## 明确不做（YAGNI）

- prefers-reduced-motion（用户未选）
- 动效层次重设计（用户未选）
- Three.js 懒加载/重写（D1 排除）
- 测试框架引入（D14）
- og:image 构建时动态生成（D4）
