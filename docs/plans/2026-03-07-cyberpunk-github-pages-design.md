# GitHub Pages 赛博朋克风格主页设计

> 创建日期: 2026-03-07
> 状态: 已确认，待实现

## 概述

基于 README.md 中的个人信息，搭建一个赛博朋克风格的 GitHub Pages 个人主页。

## 技术选型

| 技术 | 用途 |
|------|------|
| React | 组件化开发框架 |
| TailwindCSS | 样式系统 |
| Vite | 构建工具 |
| Framer Motion | 动画效果 |
| Lucide React | 图标库 |
| gh-pages | 部署工具 |

## 项目结构

```
src/
├── components/
│   ├── layout/             # 布局组件
│   │   ├── Header.tsx      # 导航栏
│   │   └── Footer.tsx      # 页脚
│   ├── sections/           # 页面板块
│   │   ├── Hero.tsx        # 首屏
│   │   ├── About.tsx       # 关于我
│   │   ├── Skills.tsx      # 技能展示
│   │   ├── Projects.tsx    # 项目展示
│   │   └── Contact.tsx     # 联系方式
│   ├── common/             # 公共组件
│   │   ├── NeonButton.tsx  # 霓虹按钮
│   │   ├── NeonCard.tsx    # 霓虹卡片
│   │   └── GlitchText.tsx  # 故障文字
│   └── effects/            # 特效组件
│       ├── Scanlines.tsx   # 扫描线
│       └── GridBg.tsx      # 网格背景
├── hooks/
│   └── useGitHubRepos.ts   # GitHub API hook
├── styles/
│   └── globals.css         # 全局样式
├── App.tsx
└── main.tsx
```

## 视觉设计规范

### 配色方案

| 用途 | 色值 | CSS 变量 |
|------|------|----------|
| 背景主色 | `#0a0a0f` | `--bg-primary` |
| 霓虹粉 | `#ff2d95` | `--neon-pink` |
| 霓虹青 | `#00f0ff` | `--neon-cyan` |
| 霓虹紫 | `#b829dd` | `--neon-purple` |
| 霓虹蓝 | `#45b7d1` | `--neon-blue` |
| 文字主色 | `#e0e0e0` | `--text-primary` |
| 文字次要 | `#888888` | `--text-secondary` |

### 核心视觉效果

1. **霓虹发光** - 标题/按钮使用多层 `text-shadow`，卡片边框使用 `box-shadow`
2. **故障抖动** - Hero 区域名字间歇性故障抖动效果
3. **扫描线** - 全屏半透明水平线条，使用 `repeating-linear-gradient`
4. **背景网格** - 透视感的 3D 网格地面效果

## 页面板块设计

### 1. Hero 区域
- 大号霓虹标题 "ECHO"
- 打字机效果副标题
- 背景动态网格 + 扫描线
- 故障抖动动画（每 5 秒触发）
- 向下滚动指示器

### 2. 关于我
- 左侧：头像（圆形霓虹边框）
- 右侧：简介文字 + AI 开发哲学代码块
- 卡片悬浮光晕效果

### 3. 技能展示
- 分类标签页：AI工具 / 语言 / 前端 / 后端
- 技能卡片：霓虹边框 + 流光动画
- 悬浮效果：放大 + 发光增强

### 4. 项目展示
- GitHub API 获取 top 6 热门仓库
- 卡片信息：项目名、描述、语言、stars、forks
- 霓虹边框 + 悬浮故障效果
- 点击跳转 GitHub

### 5. 联系方式
- Email + GitHub 图标按钮
- 按钮霓虹边框 + 悬浮填充动画
- 简洁版权信息

## 动画效果

### 页面级
- 滚动触发动画（淡入 + 上滑）
- 平滑滚动导航
- 光标跟随霓虹光晕（可选）

### 组件级
| 组件 | 动画效果 |
|------|----------|
| 霓虹标题 | 故障抖动 + 颜色闪烁 |
| 技能卡片 | 边框流光 + 上浮 |
| 项目卡片 | 放大 1.02x + 边框增强 |
| 按钮 | 背景填充 + 发光扩散 |
| 扫描线 | 从上到下移动 |

## 响应式设计

| 断点 | 宽度 | 效果 |
|------|------|------|
| Desktop | ≥1024px | 完整效果 |
| Tablet | 768px-1023px | 简化动画 |
| Mobile | <768px | 核心效果，减少复杂动画 |

## 部署方案

1. 使用 `gh-pages` 包自动部署
2. 构建产物推送到 `gh-pages` 分支
3. GitHub Pages 从 `gh-pages` 分支读取
4. 主分支推送时触发自动构建部署

## 性能优化

- 使用 `will-change` 优化动画
- 图片懒加载
- 动画使用 `transform` 和 `opacity`
- 避免复杂动画导致重绘
