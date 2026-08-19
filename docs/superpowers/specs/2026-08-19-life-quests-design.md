# 人生副本（Quest Log）模块设计

- **日期**：2026-08-19
- **状态**：已与 Echo 确认定稿
- **视觉稿**：`.superpowers/brainstorm/6140-1787083548/content/quests-list.html`、`quest-detail.html`（会话本地留存）

## 1. 概述

在 Echo009 个人站新增「人生副本」模块：以游戏副本隐喻管理人生目标——**定目标 → 拆解任务 → 做任务并记录（文字/图片/视频）→ 更新进度，直到达成**。副本可以是任何事：成为游泳高手、学习一门新知识、精进烹饪技术。

定位为**公开展示的成长记录**（访客可见），非私密待办工具。

## 2. 已确认的关键决策

| 决策点 | 结论 |
|---|---|
| 记录写入方式 | Git 工作流：仓库写 md + 放媒体文件，push 后 CI 自动部署；配脚手架脚本降低摩擦 |
| 页面形态 | 独立页面 `/quests/`（列表）+ `/quests/[slug]/`（详情）；首页加摘要 section |
| 游戏化深度 | 轻量：难度★、状态、进度条、日期；**不做** XP/等级/成就徽章系统 |
| 任务层级 | 三层：副本 → 阶段 → 任务 |
| 记录归属 | 副本级时间线，可选关联任务 |
| 媒体 | 支持多图（自动聚合成网格画廊）与视频（内联 `<video>`） |

## 3. 架构

纯静态，Astro 5 Content Layer（glob loader）+ zod schema 构建期校验，零自定义构建管线、零后端。

```
src/content/quests/
  <slug>/                        # slug = 目录名，即详情页 URL
    index.md                     # 副本元数据 + 目标宣言（自由 markdown）
    logs/
      2026-08-05-first-swim.md   # 每条记录一个文件，文件名建议日期前缀
    images/                      # 图片（封面 + 记录图片）
    media/                       # 视频（可选）
```

两个 collection（定义于 `src/content.config.ts`）：

- **quests**：`pattern: '**/index.md'`
- **quest-logs**：`pattern: '**/logs/*.md'`；所属副本 slug 从文件路径提取

## 4. 数据模型

### 4.1 Quest `index.md` frontmatter

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `title` | string | ✅ | 副本标题 |
| `summary` | string | ❌ | 一句话摘要，列表卡片显示 |
| `status` | `active` \| `dormant` \| `cleared` \| `abandoned` | ✅ | 攻略中/休眠/已通关/弃坑 |
| `difficulty` | 1–5 整数 | ✅ | 渲染为 ★ |
| `category` | string | ❌ | 展示用标签（FITNESS/CULINARY/…） |
| `started` | date | ✅ | 开荒日期 |
| `cleared` | date | ❌ | 通关日期（cleared 时建议填写） |
| `cover` | image | ❌ | 封面图（缺省用主题色封面 + 缩写） |
| `stages` | Stage[] | ❌ | 空/缺失 = 目标已立、尚未拆解 |

**Stage**：`id`（副本内唯一）、`name`、`tasks: Task[]`
**Task**：`id`（副本内唯一）、`name`、`done: boolean`、`doneAt: date?`

正文为「目标宣言」：为什么开这个副本、通关标准，自由 markdown。

### 4.2 Log frontmatter

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `date` | date | ✅ | 记录日期（缺失时回退解析文件名日期前缀） |
| `task` | string | ❌ | 关联任务 id，渲染为时间线 chip |

正文自由 markdown；图片相对路径内联引用（`![](../images/a.jpg)`，走 Astro 资产管线，路径错误构建期报错）；视频内联 `<video src="../media/a.mp4" controls>`。**单文件 <50MB**（GitHub 硬限制 100MB），约定视频压缩、单个 ≤30s。

### 4.3 派生规则（构建期计算，不落盘）

- **进度** = done 任务数 / 总任务数（跨阶段聚合）；无任务时显示 0%
- **通关手动标记**：`status: cleared` 不自动判定（达成由自己定义）
- **列表排序**：active（started 倒序）→ cleared（cleared 倒序）→ dormant → abandoned
- **时间线排序**：手写记录与系统条目混合按日期倒序；同日条目中手写记录按文件名序排在系统条目之前

## 5. 页面设计

### 5.1 列表页 `/quests/`

复刻 slides 列表页模式（固定 nav + `QUEST LOG` 渐变 glitch 标题 + 扫描线 + GSAP 入场）。按状态分组：

1. **ACTIVE** — HUD 大卡片网格（`hud-panel` + `hud-corner` + hover borderFlow）：封面区（图片或主题色 + 缩写 + 状态 badge）、难度星 + category、标题、摘要、进度条、记录数 + 最近活动日期
2. **CLEARED** — 金色调（`--cyber-yellow`）卡片，100% 进度 + 通关日期
3. **ARCHIVED**（dormant + abandoned）— 弱化紧凑行卡片：状态 chip、标题、星、小进度条、日期

不做交互筛选，静态分组。卡片可无封面：以 category 主题色 + 副本缩写兜底。

### 5.2 详情页 `/quests/[slug]/`

- **头部**：左侧三色渐变发光竖条、星级/分类/状态 badge、标题、目标宣言（渲染 md 正文）、全局进度条 + 日期区间（started → cleared/进行中）
- **宽屏双栏**（lg 断点）：左 `TASK_TREE` 任务面板（约 2/5 宽，sticky）+ 右 `QUEST_LOG` 时间线（约 3/5）；窄屏纵向堆叠（任务树在前）
- **任务面板**：阶段卡片（编号 + 名称 + n/m 小进度），完成任务 cyan 发光勾 ✓ + 完成日期，未完成灰化；全完成的阶段整卡发光；空态「◈ 待拆解——目标已立，任务未定」
- **时间线**：竖线 + 圆点（复用 slides 主题 `.flow` 的视觉语言）：
  - 手写记录：日期 + 可选任务关联 chip（`↗ 任务名`，锚点跳转任务面板；id 无效时静默忽略）+ md 正文 + 图库/视频
  - **系统条目**（渲染期从元数据合成，不存文件）：`◈ 副本开启`（started）、`✓ 任务完成：xxx`（doneAt），紫色系样式
  - 空态：「等待第一条记录」
- **多图画廊**：自定义 rehype 插件把「仅含图片的连续段落」包进 `.log-gallery`；CSS grid——1 图全宽、2 图两列、3+ 图三列

### 5.3 首页入口

- 全站 nav（首页 `index.astro` 与 slides 页）加 `QUESTS` 链接（首页锚点导航数组同步加 `#quests`）
- 首页在 NETWORK 与 SIGNAL 之间插入 **QuestsSummary section**：`// SECTION_06 // QUESTS` 标题 + 最多 3 个 active 副本紧凑卡（标题/难度/进度条/最近活动日期），点击进详情页；无 active 副本时显示引导语 + 进入列表按钮
- 连带修改：`Signal.astro` 的 section label 顺延为 `SECTION_07`
- 「最近活动日期」= max(该副本全部 log 的 `date`)；无记录时用 `started`

## 6. 新增/修改文件清单

| 文件 | 动作 | 说明 |
|---|---|---|
| `src/content.config.ts` | 新增 | quests + quest-logs 两个 collection 的 zod schema |
| `src/content/quests/<slug>/…` | 新增 | 内容目录（含一个示例副本作初始数据） |
| `src/pages/quests/index.astro` | 新增 | 列表页 |
| `src/pages/quests/[slug].astro` | 新增 | 详情页（getStaticPaths） |
| `src/components/quests/QuestCard.astro` | 新增 | 列表卡片（大卡/金卡/行卡三态） |
| `src/components/quests/StagePanel.astro` | 新增 | 任务树面板 |
| `src/components/quests/LogTimeline.astro` | 新增 | 时间线（含系统条目合成） |
| `src/components/quests/QuestsSummary.astro` | 新增 | 首页摘要 section |
| `src/pages/index.astro` | 修改 | nav 加 QUESTS、插入 QuestsSummary、滚动高亮数组加 quests |
| `src/components/Signal.astro` | 修改 | section label 顺延为 SECTION_07 |
| `src/pages/slides/index.astro` | 修改 | nav 加 QUESTS 链接 |
| `scripts/quest.mjs` | 新增 | 脚手架脚本 |
| `package.json` | 修改 | 加 `quest:new` / `quest:log` 脚本 |

## 7. 辅助脚本（脚手架）

```bash
npm run quest:new <slug>   # 生成 src/content/quests/<slug>/index.md 模板（含 stages 示例注释）
npm run quest:log <slug>   # 生成 logs/<今日>-untitled.md（自动日期前缀），并打印路径
```

Node 编写（Windows/GitBash 友好），仅生成模板，生成后随意编辑；slug 已存在时 `quest:new` 报错退出。

## 8. 边界情况

| 情况 | 行为 |
|---|---|
| `stages` 为空/缺失 | 任务区显示「◈ 待拆解」空态 |
| 无任何记录 | 时间线显示「等待第一条记录」空态 |
| log 的 `task` 引用不存在 id | 渲染时静默忽略关联 chip，不阻断构建 |
| `status: cleared` 缺 `cleared` 日期 | 只显示 badge，不显示日期 |
| 图片相对路径错误 | Astro 资产管线构建期报错（早暴露） |
| 视频过大 | 不做技术拦截，约定 <50MB 并在模块 README/模板注释注明 |
| 任务 id 重复 | zod 无法跨项校验；渲染期以先出现者为准（可接受的降级） |

## 9. 验证方式

- `npm run build` 通过 = schema 校验 + 图片管线 + 全路由生成
- Chrome DevTools MCP 截图目视（项目既有验证工作流，截图存 `slides-source/.screenshots/` 同级的临时目录）
- 纯展示模块不引入单测框架；`quest.mjs` 逻辑极简，人工验证

## 10. 明确不做（YAGNI）

- XP/等级/成就徽章系统
- 列表页交互筛选/搜索
- 网页端编辑（数据结构已为将来扩展留了结构化空间，但本期不做）
- 长视频外链托管方案
- 多语言副本内容
