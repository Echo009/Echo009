# 人生副本（Quest Log）内容指南

本页说明如何为「人生副本」模块创建和更新内容：开一个副本、拆解任务、写打卡记录、管理图片与视频。

## 数据结构

每个副本是 `src/content/quests/` 下的一个目录，目录名即详情页 URL 的 slug：

```text
src/content/quests/
  swimming/                        # slug = swimming → /quests/swimming/
    index.md                       # 副本元数据 + 目标宣言
    logs/
      2026-08-05-first-float.md    # 打卡记录，一个文件一条
    images/                        # 图片
    media/                         # 视频（可选）
```

两个内容集合由 `src/content.config.ts` 定义并在构建期校验：`quests` 匹配 `**/index.md`，`quest-logs` 匹配 `**/logs/*.md`。frontmatter 写错时 `npm run build` 直接报错。

## 副本 frontmatter（index.md）

```yaml
---
title: 成为游泳高手          # 必填
summary: 从旱鸭子到连续游 1km   # 可选，列表卡片摘要
status: active              # 必填：active | dormant | cleared | abandoned
difficulty: 3               # 必填：1-5 整数，渲染为 ★
category: FITNESS           # 可选，展示标签，也决定卡片封面主题色
started: 2026-08-01         # 必填，开荒日期
cleared: 2025-12-01         # 可选，通关日期（status 为 cleared 时填写）
stages:                     # 可选，空或缺失 = 目标已立、尚未拆解
  - id: basics              # 阶段 id，副本内唯一
    name: 基础热身
    tasks:
      - id: float           # 任务 id，副本内唯一
        name: 水中漂浮 30s
        done: true
        doneAt: 2026-08-05  # 可选，完成日期
      - id: breath
        name: 憋气 45s
        done: false
---

正文是「目标宣言」：为什么开这个副本、通关标准是什么，自由书写 markdown。
```

## 记录 frontmatter 与正文（logs/*.md）

```markdown
---
task: kick          # 可选，关联任务 id，渲染为时间线锚点 chip
---

今天练自由泳打腿，教练说我髋发力对了。

![打腿视频截图一](../images/pool-01.png)
![打腿视频截图二](../images/pool-02.png)
```

写作规则：

- 文件名用 `YYYY-MM-DD-<名称>.md` 前缀——时间线排序依赖它（`date` 字段缺失时回退解析文件名前缀）
- **多图**：写在**同一段落**（图片之间无空行）自动聚合为网格画廊——1 图全宽、2 图两列、3+ 图三列
- **视频**：正文内联 HTML 标签，文件放 `media/`，单文件小于 50MB（GitHub 硬限制 100MB）

```html
<video src="../media/kick-review.mp4" controls></video>
```

## 日常记录工作流

```bash
npm run quest:new <slug>    # 开新副本：生成目录 + index.md 模板
npm run quest:log <slug>    # 写记录：生成 logs/<今日>-untitled.md
```

完整闭环：

1. `quest:new` 开副本，编辑 `index.md` 填元数据、拆解阶段与任务
2. `quest:log` 生成当日记录模板，写文字、放图片
3. 勾任务：把对应任务的 `done` 改为 `true` 并补 `doneAt`
4. `git push` —— CI 自动构建部署

## 派生规则（自动计算，勿手动维护）

| 项 | 规则 | 实现位置 |
|---|---|---|
| 进度百分比 | done 任务数 / 总任务数，跨阶段聚合 | `src/lib/quests.ts` `calcProgress` |
| 列表分组排序 | active → cleared → dormant → abandoned，组内按日期倒序 | `groupByStatus` |
| 时间线排序 | 记录与系统条目混合按日期倒序；同日手写在前、系统在后 | `buildTimeline` |
| 系统条目 | `◈ 副本开启`（started）与 `✓ 任务完成`（doneAt）由构建期合成，不写文件 | `buildTimeline` |

通关（`status: cleared`）**手动标记**——达成与否由你自己定义，不要求任务全部勾完。

## 边界行为

- 记录的 `task` 引用了不存在的任务 id：渲染时静默忽略关联 chip，不阻断构建
- 任务 `done: true` 但无 `doneAt`：该任务不生成时间线系统条目
- 副本无 `stages`：任务区显示「◈ 待拆解——目标已立，任务未定」空态
- 副本无任何记录：时间线显示「等待第一条记录」空态

## 相关文档

- 设计文档：[2026-08-19-life-quests-design.md](../superpowers/specs/2026-08-19-life-quests-design.md)（决策与视觉设计）
- 实现计划：[2026-08-19-life-quests.md](../superpowers/plans/2026-08-19-life-quests.md)（任务分解与验证记录）
