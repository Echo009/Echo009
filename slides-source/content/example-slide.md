---
theme: ../theme
title: Slides 方案介绍
date: 2026-05-05
description: 基于 Slidev + Astro 的赛博朋克风格幻灯片集成方案
transition: slide-left
---

layout: cover
info: Slidev + Astro 集成方案
date: 2026-05-05

# Slides 方案介绍

---

section: 概述

# 方案概述

将 **Slidev** 幻灯片系统集成到 Astro 个人主页中

- **独立子路径** — 幻灯片挂在 `/slides/` 路径下，不干扰主页
- **统一风格** — 自定义赛博朋克主题，与主页视觉语言一致
- **自动扫描** — 新增 `.md` 文件即可自动出现在列表页
- **一键构建** — `bash scripts/build-slides.sh` 完成全部构建

---

no: 01
layout: section-header
subtitle: 项目结构与文件组织

# 项目结构

---

section: 项目结构
layout: two-col
left: 1
right: 1

::left::

# 目录结构

```
slides-source/            # Slidev 源文件
├── package.json          # 依赖管理
├── theme/                # 自定义主题
│   ├── index.ts          # 入口
│   ├── styles/           # 全局样式
│   └── layouts/          # 布局组件
│       ├── cover.vue     # 封面页
│       ├── default.vue   # 默认内容
│       ├── intro.vue     # 章节分隔
│       ├── two-col.vue   # 双栏布局
│       ├── cards.vue     # 卡片行
│       └── section-header.vue
└── content/              # 幻灯片 Markdown
    └── example-slide.md
```

::right::

# Astro 集成

```
src/
├── components/
│   └── SlidesList.astro  # 卡片列表组件
└── pages/
    └── slides/
        └── index.astro   # 自动扫描列表页

public/slides/            # Slidev 构建产物
```

构建产物放入 `public/slides/`，Astro 直接作为静态资源服务

---

no: 02
layout: section-header
subtitle: 赛博朋克主题与视觉设计

# 主题设计

---

section: 主题设计

# 配色体系

复用主页 CSS 变量，保持风格统一：

<div class="chips">
  <span class="chip">--cyber-cyan: #00ffff</span>
  <span class="chip">--cyber-pink: #ff006e</span>
  <span class="chip">--cyber-yellow: #f5ff00</span>
  <span class="chip">--cyber-purple: #7b2fff</span>
</div>

背景使用 `--cyber-black: #050510` 深黑底色

---

section: 主题设计

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

no: 03
layout: section-header
subtitle: 从创建到部署的完整流程

# 使用流程

---

section: 使用流程
layout: two-col
left: 2
right: 1

::left::

# 添加新幻灯片

在 `slides-source/content/` 下新建 Markdown 文件：

```markdown
---
theme: ../theme
title: 我的分享
date: 2026-05-05
description: 一份关于 XX 的分享
---

layout: cover
info: 副标题
date: 2026-05-05

# 我的分享

---

# 第一页内容

这里是正文...
```

::right::

<div class="note">
  Frontmatter 中的 <strong>title</strong>、<strong>date</strong>、<strong>description</strong> 元数据会自动出现在列表页的卡片中。
</div>

---

section: 使用流程
layout: two-col
left: 1
right: 1

::left::

# 本地开发

```bash
cd slides-source
npx slidev content/my-slide.md    # 热重载开发
```

# 一键构建

```bash
bash scripts/build-slides.sh      # 构建所有幻灯片
npm run build                     # 构建 Astro 站点
```

::right::

# 部署

**自动部署** — 推送到 master 后 GitHub Actions 自动完成

<div class="note" style="margin-top: 1.5rem;">
  构建脚本会自动扫描所有 <code>.md</code> 文件，提取元数据并按日期排序。
</div>

---

layout: cover

# 感谢观看

> 系统在线，信号稳定。
