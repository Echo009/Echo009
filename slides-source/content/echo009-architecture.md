---
theme: ../theme
title: 赛博朋克个人主页架构解析
date: 2026-05-07
description: 基于 Astro + Slidev 的赛博朋克风格静态站点技术架构全景解析
transition: slide-left
routerMode: hash
layout: cover
info: Astro + Slidev + Tailwind + GSAP + Three.js
---

# 赛博朋克个人主页架构解析

---
section: 全景概览
---

# 项目定位

**Echo009** — 赛博朋克风格的静态个人主页，托管于 GitHub Pages

<div class="two-col">
  <div>
    <h3>核心特性</h3>
    <div class="flow">
      <div class="flow-step"><strong>纯静态</strong> — Astro SSG，零运行时开销</div>
      <div class="flow-step"><strong>赛博风格</strong> — 统一的 neon-glow 视觉语言</div>
      <div class="flow-step"><strong>幻灯片集成</strong> — Slidev 独立构建，嵌入主站</div>
      <div class="flow-step"><strong>自动部署</strong> — push 即发布，CI 全自动</div>
    </div>
  </div>
  <div>
    <h3>线上地址</h3>
    <div class="flow">
      <div class="flow-step"><strong>主页</strong> — echo009.github.io</div>
      <div class="flow-step"><strong>幻灯片列表</strong> — /slides</div>
      <div class="flow-step"><strong>单个幻灯片</strong> — /slides/{slug}/</div>
    </div>
  </div>
</div>

---
no: "01"
layout: section-header
subtitle: 技术选型与依赖关系
---

# 技术栈

---
section: 技术栈
---

# 技术全景

```mermaid
graph LR
  subgraph 主站框架
    Astro["Astro 5.x<br/>SSG 静态生成"]
    TW["Tailwind CSS 3.x<br/>原子化样式"]
    GSAP["GSAP 3.x<br/>滚动动画"]
    Three["Three.js<br/>3D 视觉"]
  end

  subgraph 幻灯片系统
    Slidev["Slidev 0.50<br/>Markdown 演示"]
    Vue["Vue 3<br/>布局组件"]
    Theme["自定义赛博主题<br/>layouts + styles"]
  end

  subgraph 部署
    GHA["GitHub Actions<br/>CI/CD"]
    GHP["GitHub Pages<br/>静态托管"]
  end

  Astro --> TW
  Astro --> GSAP
  Astro --> Three
  Slidev --> Vue
  Slidev --> Theme
  Astro -->|"public/slides/"| Slidev
  GHA -->|build + deploy| GHP
```

---
section: 技术栈
layout: two-col
left: 1
right: 1
---

::left::

# 主站依赖

| 包 | 版本 | 职责 |
|---|---|---|
| `astro` | ^5.4 | 静态站点生成 |
| `@astrojs/tailwind` | ^5.1 | Tailwind 集成 |
| `tailwindcss` | ^3.4 | 原子化 CSS |
| `gsap` | ^3.12 | 滚动触发动画 |
| `three` | ^0.173 | 3D 视觉效果 |

::right::

# 幻灯片依赖

| 包 | 版本 | 职责 |
|---|---|---|
| `@slidev/cli` | ^0.50 | Slidev 构建引擎 |
| `@slidev/types` | ^0.50 | TypeScript 类型 |

<div class="note" style="margin-top: 1.5rem;">
  两套依赖<strong>独立管理</strong>：<br/>
  主站 <code>package.json</code> 与 <code>slides-source/package.json</code> 各自独立安装，互不干扰。
</div>

---
no: "02"
layout: section-header
subtitle: 文件组织与模块划分
---

# 项目结构

---
section: 项目结构
---

# 整体目录

```mermaid
graph TD
  Root["Echo009/"] --> Src["src/<br/>Astro 源码"]
  Root --> SS["slides-source/<br/>Slidev 子项目"]
  Root --> Public["public/<br/>静态资源"]
  Root --> Scripts["scripts/<br/>构建脚本"]
  Root --> GH[".github/workflows/<br/>CI 配置"]
  Root --> Config["astro.config.mjs<br/>tailwind.config.mjs"]

  Src --> Pages["pages/<br/>路由"]
  Src --> Comps["components/<br/>组件"]
  Src --> Layouts["layouts/<br/>全局布局"]

  Pages --> Home["index.astro<br/>首页"]
  Pages --> SlidesPage["slides/index.astro<br/>幻灯片列表"]

  SS --> SContent["content/<br/>Markdown 源文件"]
  SS --> STheme["theme/<br/>自定义主题"]
  SS --> SPkg["package.json<br/>独立依赖"]

  Public --> PSlides["slides/<br/>构建产物"]
```

---
section: 项目结构
layout: two-col
left: 1
right: 1
---

::left::

# 主站结构

```
src/
├── pages/
│   ├── index.astro         # 单页滚动首页
│   └── slides/
│       └── index.astro     # 幻灯片列表页
├── components/
│   ├── Hero.astro          # 英雄区
│   ├── SystemProfile.astro # 个人简介
│   ├── TechArsenal.astro   # 技术栈
│   ├── CoreProtocol.astro  # 核心能力
│   ├── NetworkNode.astro   # 社交链接
│   ├── Signal.astro        # 联系方式
│   └── SlidesList.astro    # 幻灯片卡片列表
└── layouts/
    └── Layout.astro        # 全局布局 + CSS 变量
```

::right::

# 幻灯片结构

```
slides-source/
├── package.json            # 独立依赖
├── theme/
│   ├── index.ts            # 主题入口
│   ├── styles/
│   │   └── index.css       # 赛博朋克全局样式
│   └── layouts/
│       ├── cover.vue       # 封面页
│       ├── default.vue     # 默认内容页
│       ├── two-col.vue     # 双栏布局
│       ├── section-header.vue  # 章节标题
│       ├── intro.vue       # 章节分隔页
│       └── cards.vue       # 卡片行布局
└── content/
    └── *.md                # 幻灯片 Markdown
```

---
no: "03"
layout: section-header
subtitle: 从 Markdown 到 SPA 的构建链路
---

# 构建流水线

---
section: 构建流水线
---

# 构建全流程

```mermaid
flowchart LR
  A["content/*.md<br/>Markdown 源文件"] -->|"遍历每个 .md"| B["slidev build<br/>--out public/slides/slug<br/>--base /slides/slug/"]
  B --> C["SPA 产物<br/>index.html + assets/"]
  B --> D["提取 frontmatter<br/>生成 meta.json"]
  C --> E["public/slides/slug/"]
  D --> E
  E -->|"astro build"| F["dist/<br/>最终产物"]
  F -->|"gh-pages"| G["GitHub Pages<br/>线上访问"]
```

---
section: 构建流水线
layout: two-col
left: 1
right: 1
---

::left::

# build-slides.sh 流程

```mermaid
flowchart TD
  Start(["开始"]) --> Deps{"node_modules<br/>是否存在？"}
  Deps -->|否| Install["npm install"]
  Deps -->|是| Clean
  Install --> Clean["清理 public/slides/"]
  Clean --> Loop["遍历 content/*.md"]
  Loop --> Build["slidev build<br/>→ public/slides/{slug}/"]
  Build --> Meta["解析 frontmatter<br/>→ meta.json"]
  Meta --> Next{"还有文件？"}
  Next -->|是| Loop
  Next -->|否| Done(["构建完成"])
```

::right::

# meta.json 结构

每个幻灯片目录下生成的元数据文件：

```json
{
  "title": "幻灯片标题",
  "date": "2026-05-07",
  "description": "幻灯片描述",
  "cover": ""
}
```

<div class="note" style="margin-top: 1rem;">
  列表页通过扫描 <code>public/slides/</code> 子目录中的 <code>meta.json</code> 读取元信息，按日期<strong>倒序</strong>排列展示。
</div>

---
no: "04"
layout: section-header
subtitle: 主站与幻灯片的衔接机制
---

# 集成机制

---
section: 集成机制
---

# Astro ↔ Slidev 集成架构

```mermaid
flowchart TD
  subgraph Astro["Astro 主站"]
    Index["/slides/index.astro<br/>列表页"]
    Card["SlidesList.astro<br/>卡片组件"]
    Index --> Card
  end

  subgraph Static["public/slides/"]
    Meta1["slug-a/meta.json"]
    HTML1["slug-a/index.html"]
    Meta2["slug-b/meta.json"]
    HTML2["slug-b/index.html"]
  end

  subgraph Middleware["SPA 回退中间件"]
    M1["/slides/slug → 返回 index.html"]
    M2["/slides/slug/3 → 302 到 /#/3"]
  end

  Card -->|"读取 meta.json"| Meta1
  Card -->|"读取 meta.json"| Meta2
  Card -->|"链接跳转"| HTML1
  Card -->|"链接跳转"| HTML2
  Middleware -.->|"开发模式"| HTML1
  Middleware -.->|"开发模式"| HTML2
```

---
section: 集成机制
---

# SPA 回退中间件

开发模式下 `astro.config.mjs` 中的 Vite 插件处理 Slidev 路由：

<div class="two-col">
  <div>
    <h3>路径匹配</h3>
    <div class="flow">
      <div class="flow-step"><code>/slides/{slug}</code> → 直接返回对应 <code>index.html</code></div>
      <div class="flow-step"><code>/slides/{slug}/{n}</code> → 302 重定向到 <code>/#/{n}</code></div>
      <div class="flow-step">带扩展名的请求（.js/.css 等）直接放行</div>
    </div>
  </div>
  <div>
    <h3>为什么需要？</h3>
    <div class="flow">
      <div class="flow-step">Slidev 使用 <strong>hash 路由</strong>（routerMode: hash）</div>
      <div class="flow-step">Astro 开发服务器不认识 Slidev 的 SPA 路径</div>
      <div class="flow-step">中间件桥接了两个独立系统的路由差异</div>
    </div>
  </div>
</div>

<div class="note" style="margin-top: 1rem;">
  生产环境不需要此中间件 — Slidev 产物作为纯静态文件由 GitHub Pages 直接服务。
</div>

---
no: "05"
layout: section-header
subtitle: CI/CD 自动化部署
---

# 部署流程

---
section: 部署流程
---

# GitHub Actions 部署流水线

```mermaid
flowchart LR
  Push["git push master"] --> Checkout["actions/checkout@v4"]
  Checkout --> Node["setup-node@v4<br/>Node 22"]
  Node --> NPM["npm ci<br/>主站依赖"]
  NPM --> SlideDeps["cd slides-source<br/>npm install"]
  SlideDeps --> BuildSlides["bash build-slides.sh<br/>构建所有幻灯片"]
  BuildSlides --> BuildAstro["npm run build<br/>构建 Astro"]
  BuildAstro --> Deploy["peaceiris/actions-gh-pages<br/>→ gh-pages 分支"]
  Deploy --> Live["echo009.github.io<br/>上线"]
```

<div class="note" style="margin-top: 1.5rem;">
  <strong>触发条件</strong>：推送到 <code>master</code> 分支 或 手动 <code>workflow_dispatch</code>。<br/>
  部署分支为 <code>gh-pages</code>，使用 <code>force_orphan</code> 保持干净历史。
</div>

---
no: "06"
layout: section-header
subtitle: 赛博朋克视觉设计系统
---

# 主题设计

---
section: 主题设计
---

# 配色体系

复用主站 CSS 变量，保持风格统一：

<div class="chips">
  <span class="chip">--cyber-cyan: #00ffff</span>
  <span class="chip">--cyber-pink: #ff006e</span>
  <span class="chip">--cyber-yellow: #f5ff00</span>
  <span class="chip">--cyber-purple: #7b2fff</span>
</div>

背景使用 `--cyber-black: #050510` 深黑底色

```mermaid
graph LR
  Base["#050510<br/>深黑底色"] --> Cyan["#00ffff<br/>主强调色"]
  Base --> Pink["#ff006e<br/>辅助强调色"]
  Base --> Purple["#7b2fff<br/>装饰色"]
  Base --> Yellow["#f5ff00<br/>高亮色"]
  Cyan --> Glow["neon-glow<br/>发光效果"]
  Pink --> Glow
  Purple --> Glow
```

---
section: 主题设计
---

# 布局组件

<div class="three-col">
  <div class="card accent-cyan">
    <h3>cover</h3>
    <p>封面页<br/>网格背景 + 角标 + 状态栏</p>
  </div>
  <div class="card accent-pink">
    <h3>default</h3>
    <p>内容页<br/>HUD 顶线 + 侧标签 + 页码</p>
  </div>
  <div class="card accent-purple">
    <h3>two-col</h3>
    <p>双栏布局<br/>左右分栏 + 竖线分割</p>
  </div>
</div>

<div class="three-col" style="margin-top: 1.2rem;">
  <div class="card accent-yellow">
    <h3>cards</h3>
    <p>卡片行<br/>多列卡片 + 强调色边框</p>
  </div>
  <div class="card accent-cyan">
    <h3>intro</h3>
    <p>章节分隔<br/>渐变文字 + 分割线</p>
  </div>
  <div class="card accent-pink">
    <h3>section-header</h3>
    <p>增强版章节头<br/>水印编号 + 渐变标题</p>
  </div>
</div>

---
section: 主题设计
---

# CSS 工具类

<div class="two-col">
  <div>
    <h3>布局工具</h3>
    <div class="flow">
      <div class="flow-step"><strong>.two-col</strong> — 双栏网格布局</div>
      <div class="flow-step"><strong>.three-col</strong> — 三栏网格布局</div>
      <div class="flow-step"><strong>.card</strong> — 通用卡片容器</div>
      <div class="flow-step"><strong>.note</strong> — 注释提示框</div>
    </div>
  </div>
  <div>
    <h3>样式工具</h3>
    <div class="flow">
      <div class="flow-step"><strong>.accent-cyan/pink/...</strong> — 卡片强调色</div>
      <div class="flow-step"><strong>.chips + .chip</strong> — 药丸标签</div>
      <div class="flow-step"><strong>.big-number</strong> — 大号装饰数字</div>
      <div class="flow-step"><strong>.flow + .flow-step</strong> — 流程图</div>
    </div>
  </div>
</div>

---
no: "07"
layout: section-header
subtitle: 从创建到发布的完整操作指南
---

# 使用指南

---
section: 使用指南
layout: two-col
left: 2
right: 1
---

::left::

# 添加新幻灯片

在 `slides-source/content/` 下新建 Markdown 文件：

```markdown
---
theme: ../theme
title: 我的分享
date: 2026-05-07
description: 一份关于 XX 的分享
layout: cover
info: 副标题
---

# 我的分享

---

# 第一页内容

这里是正文...
```

::right::

<div class="note">
  Frontmatter 中的 <strong>title</strong>、<strong>date</strong>、<strong>description</strong> 元数据会自动出现在列表页的卡片中。
</div>

<div class="note" style="margin-top: 1rem;">
  文件名即 <strong>slug</strong>，决定了最终访问路径：<br/>
  <code>my-talk.md</code> → <code>/slides/my-talk/</code>
</div>

---
section: 使用指南
layout: two-col
left: 1
right: 1
---

::left::

# 本地开发

```bash
cd slides-source
npx slidev content/my-slide.md
```

热重载开发，实时预览修改效果。

# 一键构建

```bash
bash scripts/build-slides.sh
npm run build
```

::right::

# 部署上线

**自动部署** — 推送到 master 即触发 GitHub Actions

```mermaid
flowchart TD
  Write["编写 .md"] --> Push["git push"]
  Push --> CI["CI 自动构建"]
  CI --> Online["上线"]
```

<div class="note" style="margin-top: 1rem;">
  构建脚本自动扫描所有 <code>.md</code> 文件，提取元数据并按日期排序。
</div>

---
layout: cover
---

# 感谢观看
