---
theme: ../theme
title: 示例幻灯片
date: 2026-05-03
description: 一份赛博朋克风格的示例演示文稿
transition: slide-left
---

# 示例幻灯片
info: 赛博朋克风格演示
date: 2026-05-03

---

# 目录

- 项目概述
- 技术架构
- 演示效果
- 总结

---

no: 01
layout: intro
subtitle: 了解项目的基本信息

# 项目概述

---

# 核心特性

- **霓虹配色** — 使用青色、粉色、黄色三色霓虹体系
- **HUD 面板** — 科幻界面风格的信息展示
- **扫描线效果** — 复古 CRT 显示器纹理
- **响应式布局** — 适配各种屏幕尺寸

---

# 技术栈

| 技术 | 用途 |
|------|------|
| Astro | 静态站点生成 |
| Slidev | 幻灯片框架 |
| Vue 3 | 主题组件 |
| Tailwind CSS | 样式工具 |

---

no: 02
layout: intro
subtitle: 系统架构与实现细节

# 技术架构

---

# 代码示例

```typescript
// 主题入口文件
import { defineAppSetup } from '@slidev/types'
import './styles'

export default defineAppSetup(({ app }) => {
  // 自定义逻辑
})
```

---

# 感谢观看

> 系统在线，信号稳定。
