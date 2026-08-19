# 人生副本（Quest Log）实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 Echo009 个人站新增「人生副本」模块——`/quests/` 列表页 + `/quests/[slug]/` 详情页（任务树 + 打卡时间线）+ 首页摘要 section + Git 工作流脚手架。

**Architecture:** Astro 5 Content Layer 两个 collection（`quests` 匹配 `**/index.md`、`quest-logs` 匹配 `**/logs/*.md`），zod schema 构建期校验；进度/排序/时间线系统条目均由 `src/lib/quests.ts` 纯函数派生；多图画廊由自定义 rehype 插件实现；赛博朋克 HUD 风格复用站点现有全局类（`hud-panel`/`hud-corner`/`glitch-text`/`section-label`）。

**Tech Stack:** Astro 5（已装 ^5.4.0）、Tailwind 3、GSAP（已装）、TypeScript。**不新增任何依赖。**

**设计文档:** `docs/superpowers/specs/2026-08-19-life-quests-design.md`（含视觉稿路径与全部决策）

## Global Constraints

- 本项目无 `.nvmrc`，直接用当前 Node（Astro 5 需 Node ≥ 18）
- 纯静态 `output: 'static'`，不引入后端/数据库/单测框架
- **不新增 npm 依赖**（含 `unist-util-visit` 等，全部手写）
- 配色只用 CSS 变量：`--cyber-black #050510`、`--cyber-cyan #00ffff`、`--cyber-pink #ff006e`、`--cyber-yellow #f5ff00`、`--cyber-purple #7b2fff`（定义于 `src/layouts/Layout.astro` `:root`）
- 字体：Orbitron（展示标题）、Share Tech Mono（mono）、Noto Sans SC（中文正文）
- 每个新增源文件顶部加注释 `@author Echo009 @since 2026-08-19`（Astro 组件加在 frontmatter 内）
- 提交信息格式 `<type>(quests): <中文描述>`，中文、祈使句、≤50 字符
- 视觉验证用 Chrome DevTools MCP（需 Edge 开启 `--remote-debugging-port=9222`，见项目 CLAUDE.md 验证工作流），截图存 `slides-source/.screenshots/`
- `docs/` 在 `.gitignore` 中；仅计划/规格文档用 `git add -f`，代码文件正常 add
- 构建验证命令统一为 `npm run build`（在项目根 `D:/Work/Personal/Echo009` 执行）

---

### Task 1: Content Collections 配置 + 示例副本数据

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/quests/swimming/index.md`
- Create: `src/content/quests/swimming/logs/2026-08-05-first-float.md`
- Create: `src/content/quests/swimming/logs/2026-08-12-breath.md`
- Create: `src/content/quests/swimming/logs/2026-08-17-kick.md`
- Create: `src/content/quests/swimming/images/`（2 张占位 PNG，命令生成）
- Create: `src/content/quests/japanese/index.md`
- Create: `src/content/quests/triathlon/index.md`
- Create: `src/content/quests/guitar/index.md`

**Interfaces:**
- Consumes: 无（首个任务）
- Produces: collection 名 `quests`、`quest-logs`；quest entry 的 `id` 形如 `swimming/index`（glob loader 相对 `src/content/quests` 去 `.md`）；log entry 的 `id` 形如 `swimming/logs/2026-08-05-first-float`。frontmatter 字段以 schema 为准（后续任务全部依赖）

- [ ] **Step 1: 写 `src/content.config.ts`**

```ts
/**
 * @author Echo009
 * @since 2026-08-19
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const stageSchema = z.object({
  id: z.string(),
  name: z.string(),
  tasks: z.array(z.object({
    id: z.string(),
    name: z.string(),
    done: z.boolean().default(false),
    doneAt: z.date().optional(),
  })).default([]),
});

const quests = defineCollection({
  loader: glob({ pattern: '**/index.md', base: './src/content/quests' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    status: z.enum(['active', 'dormant', 'cleared', 'abandoned']),
    difficulty: z.number().int().min(1).max(5),
    category: z.string().optional(),
    started: z.date(),
    cleared: z.date().optional(),
    stages: z.array(stageSchema).default([]),
  }),
});

const questLogs = defineCollection({
  loader: glob({ pattern: '**/logs/*.md', base: './src/content/quests' }),
  schema: z.object({
    date: z.date().optional(), // 缺失时回退文件名日期前缀（见 src/lib/quests.ts）
    task: z.string().optional(),
  }),
});

export const collections = { quests, questLogs };
```

注：封面 `cover` 不入库（列表卡片用 category 主题色 + 副本缩写兜底，spec 5.1）；YAML 日期字符串由 Astro 自动转 `Date`。

- [ ] **Step 2: 写示例副本 `swimming`（主验证数据，5/8 任务完成 = 63%）**

`src/content/quests/swimming/index.md`：

```markdown
---
title: 成为游泳高手
summary: 从旱鸭子到连续游 1km
status: active
difficulty: 3
category: FITNESS
started: 2026-08-01
stages:
  - id: basics
    name: 基础热身
    tasks:
      - id: float
        name: 水中漂浮 30s
        done: true
        doneAt: 2026-08-05
      - id: breath
        name: 憋气 45s
        done: true
        doneAt: 2026-08-12
  - id: strokes
    name: 泳姿解锁
    tasks:
      - id: breaststroke
        name: 蛙泳基础
        done: true
        doneAt: 2026-08-20
      - id: kick
        name: 自由泳打腿
        done: true
        doneAt: 2026-08-17
      - id: breathe-freestyle
        name: 自由泳换气
        done: false
  - id: advanced
    name: 进阶试炼
    tasks:
      - id: breast-50m
        name: 蛙泳 50m 达标
        done: true
        doneAt: 2026-08-16
      - id: swim-500m
        name: 连续游 500m
        done: false
      - id: swim-1km
        name: 连续游 1km
        done: false
---

久坐办公需要一项能坚持一生的运动。目标：年内从零基础到连续游 1km。

**通关标准**：泳池连续游完 1km，中途不扶边休息。
```

- [ ] **Step 3: 写 swimming 的 3 条记录**

`src/content/quests/swimming/logs/2026-08-05-first-float.md`：

```markdown
---
task: float
---

第一次下水，比想象中紧张。学会了水中站立和抱膝漂浮，30 秒漂浮达成！
```

`src/content/quests/swimming/logs/2026-08-12-breath.md`：

```markdown
---
task: breath
---

终于憋到 45 秒了！第一次下水时只能 15 秒，三周翻三倍。
```

`src/content/quests/swimming/logs/2026-08-17-kick.md`：

```markdown
---
task: kick
---

今天练自由泳打腿，教练说我髋发力对了。拍了视频对比教学片，还差一个脚背绷直的问题。

![打腿视频截图一](../images/pool-01.png)
![打腿视频截图二](../images/pool-02.png)
```

注：两张图写在**同一段落**（无空行分隔），画廊插件依赖此形态。

- [ ] **Step 4: 生成占位图片**

```bash
mkdir -p src/content/quests/swimming/images && node -e "const fs=require('fs');const b=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==','base64');fs.writeFileSync('src/content/quests/swimming/images/pool-01.png',b);fs.writeFileSync('src/content/quests/swimming/images/pool-02.png',b)"
```

Expected: 无输出，`ls src/content/quests/swimming/images/` 显示 2 个 png。

- [ ] **Step 5: 写另外 3 个轻量副本（验证列表页四状态分组）**

`src/content/quests/japanese/index.md`：

```markdown
---
title: 日语 N2
summary: 能力考合格，生肉追剧自由
status: cleared
difficulty: 2
category: LANGUAGE
started: 2025-03-01
cleared: 2025-12-01
stages:
  - id: exam
    name: 备考
    tasks:
      - id: vocab
        name: 核心词汇 3000
        done: true
        doneAt: 2025-08-10
      - id: mock
        name: 真题模考 130+ 分
        done: true
        doneAt: 2025-11-20
---

一年从 N4 到 N2 合格。达成「生肉追剧」成就。
```

`src/content/quests/triathlon/index.md`：

```markdown
---
title: 铁人三项
summary: 标铁完赛
status: dormant
difficulty: 4
category: FITNESS
started: 2026-01-15
stages:
  - id: base
    name: 基础体能
    tasks:
      - id: run-5k
        name: 跑步 5km
        done: true
        doneAt: 2026-02-20
      - id: bike-20k
        name: 骑行 20km
        done: false
---

等游泳副本通关后回来续写。
```

`src/content/quests/guitar/index.md`：

```markdown
---
title: 电吉他
summary: 弹唱一首完整曲目
status: abandoned
difficulty: 2
category: MUSIC
started: 2025-09-01
stages:
  - id: basic
    name: 入门
    tasks:
      - id: chords
        name: 基础和弦切换
        done: true
        doneAt: 2025-10-05
---

手指太疼，暂时弃坑。
```

- [ ] **Step 6: 构建验证 schema**

Run: `npm run build`
Expected: 构建成功，无 zod 报错。若报 `Invalid entry` 检查对应 frontmatter 字段拼写。

- [ ] **Step 7: Commit**

```bash
git add src/content.config.ts src/content/quests/
git commit -m "feat(quests): 配置内容集合并添加示例副本"
```

---

### Task 2: 派生工具函数 `src/lib/quests.ts`

**Files:**
- Create: `src/lib/quests.ts`

**Interfaces:**
- Consumes: Task 1 的 collection entry 结构（`CollectionEntry<'quests'>`、`CollectionEntry<'quest-logs'>`）
- Produces（后续所有页面任务依赖，签名不可变）:
  - `questSlug(quest: Quest): string`
  - `logQuestSlug(log: QuestLog): string`
  - `logFileStem(log: QuestLog): string`
  - `logDate(log: QuestLog): Date`
  - `calcProgress(quest: Quest): Progress`（`Progress = { done: number; total: number; pct: number }`）
  - `lastActivityDate(quest: Quest, logs: QuestLog[]): Date`
  - `logsOf(logs: QuestLog[], slug: string): QuestLog[]`（按文件名升序）
  - `groupByStatus(quests: Quest[]): Record<'active'|'cleared'|'dormant'|'abandoned', Quest[]>`（组内按 started/cleared 倒序）
  - `buildTimeline(quest: Quest, logs: QuestLog[]): TimelineEntry[]`（倒序；同日手写在前按文件名序、系统在后）
  - `fmtDate(d: Date): string`（本地 YYYY-MM-DD）
  - `fmtShort(d: Date): string`（MM-DD）

- [ ] **Step 1: 写完整实现**

```ts
/**
 * @author Echo009
 * @since 2026-08-19
 */
import type { CollectionEntry } from 'astro:content';

export type Quest = CollectionEntry<'quests'>;
export type QuestLog = CollectionEntry<'quest-logs'>;
export type QuestStatus = 'active' | 'cleared' | 'dormant' | 'abandoned';

export interface Progress { done: number; total: number; pct: number; }

export interface TimelineEntry {
  kind: 'log' | 'system';
  date: Date;
  dateKey: string; // YYYY-MM-DD，排序用
  order: number;   // 同日内升序：0 手写（按文件名序）、1 副本开启、2 任务完成
  log?: QuestLog;          // kind === 'log'
  sysType?: 'quest-start' | 'task-done'; // kind === 'system'
  taskName?: string;       // sysType === 'task-done'
}

export function questSlug(quest: Quest): string {
  return quest.id.replace(/\/index$/, '');
}

export function logQuestSlug(log: QuestLog): string {
  return log.id.split('/logs/')[0];
}

export function logFileStem(log: QuestLog): string {
  return log.id.split('/').pop() ?? '';
}

export function logDate(log: QuestLog): Date {
  if (log.data.date) return log.data.date;
  const m = logFileStem(log).match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? new Date(`${m[1]}T00:00:00`) : new Date(0);
}

export function fmtDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function fmtShort(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function calcProgress(quest: Quest): Progress {
  const tasks = (quest.data.stages ?? []).flatMap((s) => s.tasks);
  const done = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  return { done, total, pct: total === 0 ? 0 : Math.round((done / total) * 100) };
}

export function lastActivityDate(quest: Quest, logs: QuestLog[]): Date {
  const start = new Date(quest.data.started);
  return logs
    .filter((l) => logQuestSlug(l) === questSlug(quest))
    .reduce((acc, l) => (logDate(l) > acc ? logDate(l) : acc), start);
}

export function logsOf(logs: QuestLog[], slug: string): QuestLog[] {
  return logs
    .filter((l) => logQuestSlug(l) === slug)
    .sort((a, b) => (logFileStem(a) < logFileStem(b) ? -1 : 1));
}

export function groupByStatus(quests: Quest[]): Record<QuestStatus, Quest[]> {
  const g: Record<QuestStatus, Quest[]> = { active: [], cleared: [], dormant: [], abandoned: [] };
  for (const q of quests) g[q.data.status].push(q);
  const byDateDesc = (key: 'started' | 'cleared') => (a: Quest, b: Quest) =>
    new Date(b.data[key] ?? b.data.started) > new Date(a.data[key] ?? a.data.started) ? 1 : -1;
  g.active.sort(byDateDesc('started'));
  g.cleared.sort(byDateDesc('cleared'));
  g.dormant.sort(byDateDesc('started'));
  g.abandoned.sort(byDateDesc('started'));
  return g;
}

export function buildTimeline(quest: Quest, logs: QuestLog[]): TimelineEntry[] {
  const entries: TimelineEntry[] = [];
  for (const log of logsOf(logs, questSlug(quest))) {
    const d = logDate(log);
    entries.push({ kind: 'log', date: d, dateKey: fmtDate(d), order: 0, log });
  }
  const started = new Date(quest.data.started);
  entries.push({ kind: 'system', date: started, dateKey: fmtDate(started), order: 1, sysType: 'quest-start' });
  for (const stage of quest.data.stages ?? []) {
    for (const task of stage.tasks) {
      if (task.done && task.doneAt) {
        entries.push({ kind: 'system', date: task.doneAt, dateKey: fmtDate(task.doneAt), order: 2, sysType: 'task-done', taskName: task.name });
      }
    }
  }
  return entries.sort((a, b) =>
    a.dateKey === b.dateKey ? a.order - b.order : a.dateKey < b.dateKey ? 1 : -1,
  );
}
```

注：`task.done` 但无 `doneAt` 时不生成系统条目（spec 4.3）。

- [ ] **Step 2: 类型检查**

Run: `npx astro check 2>&1 | tail -5`
Expected: 无与本文件相关的 error（`astro check` 可能因现有文件有既有提示，只关注新增错误）。

- [ ] **Step 3: Commit**

```bash
git add src/lib/quests.ts
git commit -m "feat(quests): 添加进度排序与时间线派生工具函数"
```

---

### Task 3: 多图画廊 rehype 插件

**Files:**
- Create: `src/plugins/rehype-log-gallery.ts`
- Modify: `astro.config.mjs`

**Interfaces:**
- Consumes: 无
- Produces: md 渲染产物中「仅含图片的段落」被改写为 `<div class="log-gallery log-gallery-{1|2|3}">`；1 图全宽、2 图两列、3+ 图三列（CSS 在 Task 5 详情页全局样式中定义）。作用域为全站 md 渲染（主站当前无其他 md 内容，安全）

- [ ] **Step 1: 写插件**

```ts
/**
 * @author Echo009
 * @since 2026-08-19
 * 将 md 中「仅由图片构成」的段落改写为 .log-gallery 容器，
 * 连续写在同一段落的多张图片聚合成网格画廊。
 */

type Node = { type: string; tagName?: string; value?: string; children?: Node[]; properties?: Record<string, unknown> };

export function rehypeLogGallery() {
  return (tree: Node) => {
    for (const p of tree.children ?? []) {
      if (p.type !== 'element' || p.tagName !== 'p') continue;
      const meaningful = (p.children ?? []).filter(
        (c) => !(c.type === 'text' && !(c.value ?? '').trim()),
      );
      if (meaningful.length === 0) continue;
      const allImages = meaningful.every(
        (c) => c.type === 'element' && c.tagName === 'img',
      );
      if (!allImages) continue;
      p.tagName = 'div';
      p.properties = {
        ...(p.properties ?? {}),
        className: ['log-gallery', `log-gallery-${Math.min(meaningful.length, 3)}`],
      };
      p.children = meaningful;
    }
  };
}
```

- [ ] **Step 2: 注册到 `astro.config.mjs`**

在文件顶部加：

```js
import { rehypeLogGallery } from './src/plugins/rehype-log-gallery.ts';
```

`defineConfig` 中在 `site` 一行后加：

```js
  markdown: {
    rehypePlugins: [rehypeLogGallery],
  },
```

- [ ] **Step 3: 构建验证（渲染产物包含画廊容器）**

Run: `npm run build && grep -o 'log-gallery-[0-9]' dist/quests/swimming/index.html 2>/dev/null | head -1`
Expected: 此时 `/quests/swimming/` 页面尚未创建，dist 无该文件——本步仅验证 `npm run build` 成功且 slides 构建不受影响（`public/slides` 由脚本独立构建，不经过本插件）。画廊 DOM 验证推迟到 Task 5 Step 8。

- [ ] **Step 4: Commit**

```bash
git add src/plugins/rehype-log-gallery.ts astro.config.mjs
git commit -m "feat(quests): 添加多图画廊 rehype 插件"
```

---

### Task 4: 列表页 `/quests/`

**Files:**
- Create: `src/pages/quests/index.astro`
- Create: `src/components/quests/QuestCard.astro`

**Interfaces:**
- Consumes: Task 1 collections、Task 2 全部导出函数
- Produces: 路由 `/quests/`；`QuestCard.astro` props 为 `{ quest: Quest; logs: QuestLog[] }`（Task 6 不复用此组件，摘要卡独立实现）

- [ ] **Step 1: 写 `QuestCard.astro`（三态：active 大卡 / cleared 金卡 / archived 行卡）**

```astro
---
/**
 * @author Echo009
 * @since 2026-08-19
 */
import type { Quest, QuestLog } from '../../lib/quests';
import { calcProgress, fmtDate, lastActivityDate, logsOf, questSlug } from '../../lib/quests';

interface Props { quest: Quest; logs: QuestLog[]; }
const { quest, logs } = Astro.props;

const d = quest.data;
const status = d.status;
const prog = calcProgress(quest);
const mine = logsOf(logs, questSlug(quest));
const lastAct = fmtDate(lastActivityDate(quest, logs));

const starFull = '★'.repeat(d.difficulty);
const starEmpty = '☆'.repeat(5 - d.difficulty);
const abbr = d.category ? d.category.slice(0, 3) : questSlug(quest).slice(0, 3).toUpperCase();

const statusLabel = { active: 'ACTIVE', dormant: 'DORMANT', cleared: 'CLEARED ✓', abandoned: 'ABANDONED' } as const;
const covTheme = { 0: 'cov-cyan', 1: 'cov-pink', 2: 'cov-purple' } as const;
const covClass = covTheme[(questSlug(quest).length % 3) as 0 | 1 | 2];

const isBig = status === 'active' || status === 'cleared';
const isGold = status === 'cleared';
---

{isBig ? (
  <a href={`/quests/${questSlug(quest)}/`} class:list={['card', 'hud-panel', 'hud-corner', { gold: isGold }]}>
    <div class:list={['cover', covClass]}>
      <span class:list={['badge', isGold ? 'b-cleared' : 'b-active']}>{statusLabel[status]}</span>
      <span class="abbr">{abbr}</span>
    </div>
    <div class="body">
      <div class="meta-top">
        <span class="stars">{starFull}<span class="stars-empty">{starEmpty}</span></span>
        {d.category && <span class="cat">{d.category}</span>}
      </div>
      <div class="title">{d.title}</div>
      {d.summary && <div class="summary">{d.summary}</div>}
      <div class="prog">
        <div class="track"><div class="fill" style={`width:${prog.pct}%`}></div></div>
        <span class="num">{prog.pct}%</span>
      </div>
      <div class="meta-bottom">
        <span>{mine.length} 条记录</span>
        <span>{isGold && d.cleared ? `通关 ${fmtDate(d.cleared)}` : `最近活动 ${lastAct}`}</span>
      </div>
    </div>
  </a>
) : (
  <a href={`/quests/${questSlug(quest)}/`} class="row">
    <span class:list={['r-status', status]}>{statusLabel[status]}</span>
    <span class="r-title">{d.title}</span>
    <span class="r-stars">{starFull}</span>
    <div class="r-prog">
      <div class="r-track"><div class="r-fill" style={`width:${prog.pct}%`}></div></div>
      <span class="r-num">{prog.pct}%</span>
    </div>
    <span class="r-date">{lastAct}</span>
  </a>
)}
```

`<style>` 部分（scoped，接在上面的 HTML 后）：

```astro
<style>
  .card { display: block; border-radius: 2px; text-decoration: none; transition: transform 0.3s ease; }
  .card:hover { transform: translateY(-4px); }
  .cover {
    height: 84px; position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    border-bottom: 1px solid rgba(0, 255, 255, 0.2);
    background-image: linear-gradient(rgba(0, 255, 255, 0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 255, 255, 0.06) 1px, transparent 1px);
    background-size: 16px 16px;
  }
  .cov-cyan { background-color: rgba(0, 255, 255, 0.05); }
  .cov-pink { background-color: rgba(255, 0, 110, 0.05); background-image: linear-gradient(rgba(255, 0, 110, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 0, 110, 0.06) 1px, transparent 1px); }
  .cov-purple { background-color: rgba(123, 47, 255, 0.06); background-image: linear-gradient(rgba(123, 47, 255, 0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(123, 47, 255, 0.07) 1px, transparent 1px); }
  .abbr { font-family: 'Orbitron', sans-serif; font-weight: 900; font-size: 1.6rem; letter-spacing: 0.2em; color: var(--cyber-cyan); text-shadow: 0 0 16px rgba(0, 255, 255, 0.67); }
  .cov-pink .abbr { color: var(--cyber-pink); text-shadow: 0 0 16px rgba(255, 0, 110, 0.67); }
  .cov-purple .abbr { color: var(--cyber-purple); text-shadow: 0 0 16px rgba(123, 47, 255, 0.67); }
  .badge { position: absolute; top: 8px; right: 8px; font-size: 0.56rem; letter-spacing: 0.18em; padding: 3px 8px; border: 1px solid rgba(0, 255, 255, 0.53); color: var(--cyber-cyan); border-radius: 1px; background: rgba(5, 5, 16, 0.8); }
  .b-cleared { color: var(--cyber-yellow); border-color: rgba(245, 255, 0, 0.53); }
  .body { padding: 12px 14px 14px; }
  .meta-top { display: flex; justify-content: space-between; font-size: 0.6rem; letter-spacing: 0.15em; color: rgba(255, 255, 255, 0.5); margin-bottom: 6px; }
  .stars { color: var(--cyber-yellow); text-shadow: 0 0 6px rgba(245, 255, 0, 0.27); letter-spacing: 0.1em; }
  .stars-empty { opacity: 0.3; }
  .title { font-weight: 700; font-size: 1rem; color: #fff; margin-bottom: 4px; font-family: 'Noto Sans SC', sans-serif; }
  .summary { font-size: 0.7rem; color: rgba(255, 255, 255, 0.45); margin-bottom: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .prog { display: flex; align-items: center; gap: 10px; }
  .track { flex: 1; height: 5px; border-radius: 2px; overflow: hidden; background: rgba(255, 255, 255, 0.08); box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.6); }
  .fill { height: 100%; background: linear-gradient(90deg, var(--cyber-cyan), var(--cyber-purple)); box-shadow: 0 0 10px rgba(0, 255, 255, 0.53); }
  .num { font-size: 0.7rem; color: var(--cyber-cyan); min-width: 34px; text-align: right; }
  .meta-bottom { display: flex; justify-content: space-between; font-size: 0.6rem; color: rgba(255, 255, 255, 0.35); margin-top: 10px; letter-spacing: 0.08em; }
  .card.gold { border-color: rgba(245, 255, 0, 0.45); background: linear-gradient(135deg, rgba(245, 255, 0, 0.04) 0%, rgba(30, 25, 0, 0.8) 100%); }
  .card.gold .fill { background: linear-gradient(90deg, var(--cyber-yellow), var(--cyber-pink)); }
  .card.gold .num { color: var(--cyber-yellow); }
  .card.gold .abbr { color: var(--cyber-yellow); text-shadow: 0 0 16px rgba(245, 255, 0, 0.6); }
  .row { display: flex; align-items: center; gap: 14px; border: 1px solid rgba(255, 255, 255, 0.12); background: rgba(255, 255, 255, 0.02); padding: 9px 14px; border-radius: 2px; opacity: 0.55; font-size: 0.7rem; text-decoration: none; color: inherit; }
  .row:hover { opacity: 0.85; }
  .r-status { font-size: 0.55rem; letter-spacing: 0.2em; padding: 2px 7px; border: 1px solid; border-radius: 1px; white-space: nowrap; }
  .row .r-status.dormant { color: var(--cyber-purple); border-color: rgba(123, 47, 255, 0.4); }
  .row .r-status.abandoned { color: #ff4466; border-color: rgba(255, 68, 102, 0.4); }
  .r-title { font-weight: 700; color: rgba(255, 255, 255, 0.8); white-space: nowrap; }
  .r-stars { color: rgba(245, 255, 0, 0.5); font-size: 0.6rem; }
  .r-prog { flex: 1; display: flex; align-items: center; gap: 8px; }
  .r-track { flex: 1; height: 3px; background: rgba(255, 255, 255, 0.08); border-radius: 2px; overflow: hidden; }
  .r-fill { height: 100%; background: rgba(123, 47, 255, 0.8); }
  .row .r-status.abandoned ~ .r-prog .r-fill { background: rgba(255, 68, 102, 0.7); }
  .r-date { color: rgba(255, 255, 255, 0.3); white-space: nowrap; }
</style>
```

- [ ] **Step 2: 写列表页 `src/pages/quests/index.astro`（复刻 slides 列表页骨架）**

结构 = slides/index.astro 的骨架（nav + glitch hero + footer + GSAP 入场），hero 文案与分组渲染替换为 quests。frontmatter：

```astro
---
/**
 * @author Echo009
 * @since 2026-08-19
 */
import Layout from '../../layouts/Layout.astro';
import QuestCard from '../../components/quests/QuestCard.astro';
import { getCollection } from 'astro:content';
import { groupByStatus } from '../../lib/quests';

const quests = await getCollection('quests');
const logs = await getCollection('quest-logs');
const groups = groupByStatus(quests);
---
```

`<Layout title="Quests // Echo009" description="Echo009 的人生副本：目标拆解与打卡记录">` 内：

1. nav：复制 slides/index.astro 的 nav，链接改为 `HOME / SLIDES / QUESTS`（QUESTS 加 `active` 类），logo href `/`
2. nav-backdrop div（opacity-100 版本，同 slides）
3. hero：`// LIFE_DUNGEONS //` label、`data-text="QUEST LOG"` 的 `glitch-text hero-title`（渐变标题，样式从 slides/index.astro 的 `.hero-*` 全套复制到本页 `<style>`）、副标题 `人生副本 // 目标拆解 // 打卡记录 // 通关成就`
4. main 分组渲染：

```astro
<main class="pt-20 pb-20 max-w-6xl mx-auto px-6">
  {quests.length === 0 ? (
    <div class="text-center py-20">
      <p class="font-mono text-white/30 text-sm tracking-widest">NO_QUEST_DETECTED</p>
      <p class="font-mono text-white/20 text-xs mt-2">尚未开启任何人生副本…</p>
    </div>
  ) : (
    <>
      {([['active', '── // ACTIVE // 攻略中 ──', 'g-active'], ['cleared', '── // CLEARED // 已通关 ──', 'g-cleared']] as const).map(([key, label, cls]) => (
        groups[key].length > 0 && (
          <section class="mb-12">
            <div class:list={['group-label', cls]}>
              <span class="g-text font-mono text-xs tracking-[0.35em]">{label}</span>
              <span class="g-line" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-5">
              {groups[key].map((q) => <QuestCard quest={q} logs={logs} />)}
            </div>
          </section>
        )
      ))}
      {(groups.dormant.length > 0 || groups.abandoned.length > 0) && (
        <section class="mb-12">
          <div class="group-label g-dim">
            <span class="g-text font-mono text-xs tracking-[0.35em]">── // ARCHIVED // 休眠 · 弃坑 ──</span>
            <span class="g-line" />
          </div>
          <div class="flex flex-col gap-2 mt-5">
            {[...groups.dormant, ...groups.abandoned].map((q) => <QuestCard quest={q} logs={logs} />)}
          </div>
        </section>
      )}
    </>
  )}
</main>
```

5. footer：复制 slides 页 footer
6. `<style>`：合并 slides 页的 `.nav-link*`、`.hero-*` 全套 + 本页新增：

```css
.group-label { display: flex; align-items: center; gap: 12px; }
.group-label .g-line { flex: 1; height: 1px; opacity: 0.35; }
.g-active .g-text { color: var(--cyber-cyan); }
.g-active .g-line { background: linear-gradient(90deg, rgba(0,255,255,0.4), transparent); }
.g-cleared .g-text { color: var(--cyber-yellow); }
.g-cleared .g-line { background: linear-gradient(90deg, rgba(245,255,0,0.4), transparent); }
.g-dim .g-text { color: rgba(255,255,255,0.4); }
.g-dim .g-line { background: linear-gradient(90deg, rgba(255,255,255,0.15), transparent); }
```

7. `<script>`：复制 slides 页的 GSAP 卡片入场（`.slide-card` 选择器改为 `.hud-panel, .row`，其余 stagger 参数不变，去掉分页逻辑）

- [ ] **Step 3: 构建验证**

Run: `npm run build`
Expected: 成功生成 `dist/quests/index.html`；`grep -c ' quests/' dist/quests/index.html` 输出 ≥ 4（4 张卡片的链接）。

- [ ] **Step 4: 视觉验证**

启动 `npm run dev`（端口 4321），用 Chrome DevTools MCP 导航 `http://localhost:4321/quests/` 截图（存 `slides-source/.screenshots/`）。
Expected: ACTIVE 组 1 张大卡（swimming，63%）、CLEARED 组 1 张金卡（japanese，100% + 通关 2025-12-01）、ARCHIVED 组 2 张行卡（triathlon/guitar）。与视觉稿 `quests-list.html` 一致。

- [ ] **Step 5: Commit**

```bash
git add src/pages/quests/index.astro src/components/quests/QuestCard.astro
git commit -m "feat(quests): 实现副本列表页"
```

---

### Task 5: 详情页 `/quests/[slug]/`

**Files:**
- Create: `src/pages/quests/[slug].astro`
- Create: `src/components/quests/StagePanel.astro`
- Create: `src/components/quests/LogTimeline.astro`

**Interfaces:**
- Consumes: Task 1 collections、Task 2 全部导出、`render` from `astro:content`
- Produces: 路由 `/quests/[slug]/`；`StagePanel` props `{ quest: Quest }`；`LogTimeline` props `{ quest: Quest; logs: QuestLog[] }`

- [ ] **Step 1: 写 `StagePanel.astro`（任务树）**

```astro
---
/**
 * @author Echo009
 * @since 2026-08-19
 */
import type { Quest } from '../../lib/quests';
import { fmtShort } from '../../lib/quests';

interface Props { quest: Quest; }
const { quest } = Astro.props;

const stages = quest.data.stages ?? [];
const stageStats = stages.map((s) => ({ done: s.tasks.filter((t) => t.done).length, total: s.tasks.length }));
---

{stages.length === 0 ? (
  <div class="empty hud-panel p-6 text-center font-mono text-xs text-white/40 tracking-widest">
    ◈ 待拆解——目标已立，任务未定
  </div>
) : (
  <div class="space-y-3">
    {stages.map((stage, i) => (
      <div class:list={['stage', 'hud-panel', { done: stageStats[i].done === stageStats[i].total && stageStats[i].total > 0 }]}>
        <div class="stage-head">
          <span class="stage-name">{String(i + 1).padStart(2, '0')} / {stage.name}</span>
          <span class:list={['stage-prog', { done: stageStats[i].done === stageStats[i].total }]}>{stageStats[i].done}/{stageStats[i].total}{stageStats[i].done === stageStats[i].total ? ' ✓' : ''}</span>
        </div>
        {stage.tasks.map((task) => (
          <div class:list={['task', { done: task.done }]}>
            <span class="check">{task.done ? '✓' : ''}</span>
            <span class="task-name" id={`task-${stage.id}-${task.id}`}>{task.name}</span>
            {task.done && task.doneAt && <span class="task-date">{fmtShort(task.doneAt)}</span>}
          </div>
        ))}
      </div>
    ))}
  </div>
)}
```

scoped style：

```astro
<style>
  .stage { border-radius: 2px; }
  .stage.done { border-color: rgba(0, 255, 255, 0.5); box-shadow: 0 0 12px rgba(0, 255, 255, 0.1); }
  .stage-head { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-bottom: 1px solid rgba(0, 255, 255, 0.15); font-size: 0.7rem; letter-spacing: 0.1em; }
  .stage-name { font-weight: 700; color: rgba(255, 255, 255, 0.9); }
  .stage-prog { font-size: 0.65rem; color: rgba(255, 255, 255, 0.5); }
  .stage-prog.done { color: var(--cyber-cyan); text-shadow: 0 0 6px rgba(0, 255, 255, 0.4); }
  .task { display: flex; align-items: center; gap: 10px; padding: 7px 12px; font-size: 0.75rem; }
  .task + .task { border-top: 1px dashed rgba(255, 255, 255, 0.07); }
  .check { width: 14px; height: 14px; border: 1px solid rgba(255, 255, 255, 0.35); display: inline-flex; align-items: center; justify-content: center; font-size: 0.6rem; border-radius: 1px; flex-shrink: 0; color: transparent; }
  .task.done .check { border-color: var(--cyber-cyan); color: var(--cyber-cyan); box-shadow: 0 0 8px rgba(0, 255, 255, 0.4); }
  .task-name { flex: 1; color: rgba(255, 255, 255, 0.45); }
  .task.done .task-name { color: rgba(255, 255, 255, 0.85); }
  .task-date { font-size: 0.6rem; color: rgba(0, 255, 255, 0.55); }
</style>
```

- [ ] **Step 2: 写 `LogTimeline.astro`（时间线，含系统条目）**

```astro
---
/**
 * @author Echo009
 * @since 2026-08-19
 */
import { render } from 'astro:content';
import type { Quest, QuestLog } from '../../lib/quests';
import { buildTimeline, fmtDate } from '../../lib/quests';

interface Props { quest: Quest; logs: QuestLog[]; }
const { quest, logs } = Astro.props;

const entries = buildTimeline(quest, logs);

// 渲染视图模型：把 log 正文预渲染为 Content 组件
const view = await Promise.all(entries.map(async (e) => ({
  ...e,
  Content: e.kind === 'log' && e.log ? (await render(e.log)).Content : null,
})));

// task 引用解析：无效时返回 null（渲染时静默忽略，spec 边界情况）
const resolveTask = (taskRef: string): { stageId: string; name: string } | null => {
  for (const stage of quest.data.stages ?? []) {
    const task = stage.tasks.find((t) => t.id === taskRef);
    if (task) return { stageId: stage.id, name: task.name };
  }
  return null;
};
---

{view.length === 0 ? (
  <div class="empty hud-panel p-6 text-center font-mono text-xs text-white/40 tracking-widest">
    等待第一条记录…
  </div>
) : (
  <div class="timeline">
    {view.map((e) => (
      <div class:list={['entry', 'qst-entry', { sys: e.kind === 'system' }]}>
        <div class="entry-head">
          <span class="entry-date">{fmtDate(e.date)}</span>
          {e.kind === 'log' && e.log?.data.task && resolveTask(e.log.data.task) && (
            <a class="chip" href={`#task-${resolveTask(e.log.data.task)!.stageId}-${e.log.data.task}`}>↗ {resolveTask(e.log.data.task)!.name}</a>
          )}
          {e.kind === 'system' && e.sysType === 'quest-start' && <span class="chip sys">◈ 副本开启</span>}
          {e.kind === 'system' && e.sysType === 'task-done' && <span class="chip sys">✓ 任务完成：{e.taskName}</span>}
        </div>
        {e.kind === 'log' && e.Content && (() => { const C = e.Content; return <div class="entry-body"><C /></div>; })()}
        {e.kind === 'system' && (
          <div class="entry-body sys-body">
            {e.sysType === 'quest-start'
              ? `「${quest.data.title}」副本加载完成。${(quest.data.stages ?? []).length} 个阶段 · ${(quest.data.stages ?? []).reduce((n, s) => n + s.tasks.length, 0)} 个任务。`
              : `系统记录：任务「${e.taskName}」标记完成。`}
          </div>
        )}
      </div>
    ))}
  </div>
)}
```

实现要点：
- 动态组件渲染用 `{(() => { const C = e.Content; return <C />; })()}`（Astro 要求组件变量以大写字母开头）。若当前 Astro 版本对 JSX 内联 IIFE 编译报错，退路：`view.map` 前把 Content 组件提取为独立数组 `contents: AstroComponent[]`，模板中按索引 `{contents[i] && <div class="entry-body"><contents[i] …/></div>}` 不可行——改为在 map 回调外定义局部组件变量。**验收标准不变：`npm run build` 通过且 log 正文（含画廊）出现在产物 HTML 中**
- 条目加了全局类 `qst-entry`（详情页 script 的 GSAP 选择器用它，避免 scoped 类跨组件不可选）

scoped style：

```astro
<style>
  .timeline { position: relative; padding-left: 20px; }
  .timeline::before { content: ''; position: absolute; left: 5px; top: 6px; bottom: 6px; width: 1px; background: linear-gradient(180deg, rgba(0,255,255,0.4), rgba(123,47,255,0.33), transparent); }
  .entry { position: relative; padding: 0 0 20px 10px; }
  .entry::before { content: ''; position: absolute; left: -19px; top: 5px; width: 9px; height: 9px; border-radius: 50%; background: var(--cyber-black); border: 1px solid var(--cyber-cyan); box-shadow: 0 0 8px rgba(0,255,255,0.6); }
  .entry.sys::before { border-color: var(--cyber-purple); box-shadow: 0 0 8px rgba(123,47,255,0.6); }
  .entry-head { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; flex-wrap: wrap; }
  .entry-date { font-size: 0.7rem; color: var(--cyber-cyan); letter-spacing: 0.15em; }
  .chip { font-size: 0.55rem; padding: 2px 8px; border-radius: 1px; letter-spacing: 0.1em; border: 1px solid rgba(0,255,255,0.4); color: rgba(0,255,255,0.8); text-decoration: none; }
  .chip.sys { border-color: rgba(123,47,255,0.5); color: #b38aff; }
  .entry-body { font-size: 0.75rem; color: rgba(255,255,255,0.65); line-height: 1.7; font-family: 'Noto Sans SC', sans-serif; }
  .entry-body :global(video) { max-width: 100%; margin-top: 10px; border: 1px solid rgba(0,255,255,0.25); border-radius: 2px; }
  .entry-body :global(.log-gallery) { display: grid; gap: 8px; margin: 10px 0; }
  .entry-body :global(.log-gallery-1) { grid-template-columns: 1fr; }
  .entry-body :global(.log-gallery-2) { grid-template-columns: 1fr 1fr; }
  .entry-body :global(.log-gallery-3) { grid-template-columns: repeat(3, 1fr); }
  .entry-body :global(.log-gallery img) { width: 100%; border: 1px solid rgba(0,255,255,0.25); border-radius: 2px; }
</style>
```

- [ ] **Step 3: 写详情页 `src/pages/quests/[slug].astro`**

```astro
---
/**
 * @author Echo009
 * @since 2026-08-19
 */
import Layout from '../../layouts/Layout.astro';
import StagePanel from '../../components/quests/StagePanel.astro';
import LogTimeline from '../../components/quests/LogTimeline.astro';
import { getCollection, render } from 'astro:content';
import { calcProgress, fmtDate, questSlug } from '../../lib/quests';

export async function getStaticPaths() {
  const quests = await getCollection('quests');
  return quests.map((quest) => ({ params: { slug: questSlug(quest) }, props: { quest } }));
}

const { quest } = Astro.props;
const logs = await getCollection('quest-logs');
const d = quest.data;
const prog = calcProgress(quest);
const starFull = '★'.repeat(d.difficulty);
const starEmpty = '☆'.repeat(5 - d.difficulty);
const { Content: Declaration } = await render(quest);
const statusLabel = { active: '● ACTIVE', dormant: '◌ DORMANT', cleared: '✓ CLEARED', abandoned: '✕ ABANDONED' } as const;
---

<Layout title={`${d.title} // Quests // Echo009`} description={d.summary ?? `${d.title} — 人生副本`}>
  <nav id="nav" class="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between">
    <a href="/quests/" class="font-mono text-xs tracking-widest text-white/50 hover:text-white transition-colors">← QUEST_LOG</a>
    <a href="/" class="font-display font-bold text-sm tracking-widest neon-cyan hover:opacity-80 transition-opacity">Echo009</a>
    <div class="flex items-center gap-8">
      <a href="/" class="font-mono text-xs tracking-widest text-white/50 hover:text-white transition-colors">HOME</a>
      <a href="/slides" class="font-mono text-xs tracking-widest text-white/50 hover:text-white transition-colors">SLIDES</a>
      <a href="/quests" class="font-mono text-xs tracking-widest neon-cyan">QUESTS</a>
    </div>
  </nav>
  <div id="nav-backdrop" class="fixed top-0 left-0 right-0 h-16 z-40 opacity-100 pointer-events-none" style="background: linear-gradient(180deg, rgba(5,5,16,0.9) 0%, transparent 100%); backdrop-filter: blur(8px);"></div>

  <main class="pt-24 pb-20 max-w-6xl mx-auto px-6">
    <article class="gsap-reveal">
      <header class="detail-header hud-panel hud-corner p-8 mb-8">
        <div class="flex items-center gap-4 mb-3">
          <span class="stars">{starFull}<span class="stars-empty">{starEmpty}</span></span>
          {d.category && <span class="cat font-mono text-xs tracking-[0.25em] text-white/50">{d.category}</span>}
          <span class="status-badge font-mono text-[0.6rem] px-2 py-1 border border-cyan-400/50 text-cyan-300 rounded-sm">{statusLabel[d.status]}</span>
        </div>
        <h1 class="text-3xl md:text-4xl font-bold mb-2" style="font-family: 'Noto Sans SC', sans-serif;">{d.title}</h1>
        <div class="declaration text-sm text-white/60 leading-relaxed mb-6"><Declaration /></div>
        <div class="flex items-center gap-4">
          <div class="prog-track flex-1"><div class="prog-fill" style={`width:${prog.pct}%`}></div></div>
          <span class="prog-num font-mono text-cyan-300">{prog.pct}%</span>
          <span class="dates font-mono text-xs text-white/40 whitespace-nowrap">{fmtDate(d.started)} → {d.cleared ? fmtDate(d.cleared) : (d.status === 'active' ? '攻略中' : statusLabel[d.status])}</span>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <aside class="lg:col-span-2 lg:sticky lg:top-20">
          <p class="section-label mb-4">// TASK_TREE 任务树</p>
          <StagePanel quest={quest} />
        </aside>
        <section class="lg:col-span-3">
          <p class="section-label mb-4">// QUEST_LOG 打卡记录</p>
          <LogTimeline quest={quest} logs={logs} />
        </section>
      </div>
    </article>
  </main>

  <footer class="py-8 px-6 border-t" style="border-color: rgba(0,255,255,0.1);">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <a href="/quests/" class="font-mono text-xs tracking-widest text-white/40 hover:text-cyan-300 transition-colors">← 返回 QUEST_LOG</a>
      <span class="font-mono text-xs opacity-30 tracking-widest">© 2024-2026 Echo009</span>
    </div>
  </footer>
</Layout>
```

页面级 `<style>`（scoped）：

```astro
<style>
  .detail-header { position: relative; }
  .detail-header::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px; background: linear-gradient(180deg, var(--cyber-cyan), var(--cyber-purple), var(--cyber-pink)); box-shadow: 0 0 12px rgba(0,255,255,0.5); }
  .stars { color: var(--cyber-yellow); text-shadow: 0 0 6px rgba(245,255,0,0.27); letter-spacing: 0.1em; }
  .stars-empty { opacity: 0.3; }
  .prog-track { height: 7px; border-radius: 3px; overflow: hidden; background: rgba(255,255,255,0.08); box-shadow: inset 0 0 4px rgba(0,0,0,0.6); }
  .prog-fill { height: 100%; background: linear-gradient(90deg, var(--cyber-cyan), var(--cyber-purple)); box-shadow: 0 0 12px rgba(0,255,255,0.53); }
  .prog-num { text-shadow: 0 0 8px rgba(0,255,255,0.4); }
</style>
```

页面级 `<script>`（GSAP 入场）：

```astro
<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);
  gsap.fromTo('article .gsap-reveal', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' });
  gsap.utils.toArray<HTMLElement>('.timeline .entry').forEach((el, i) => {
    gsap.fromTo(el, { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.4, delay: 0.3 + i * 0.08, ease: 'power1.out', scrollTrigger: { trigger: el, start: 'top 95%' } });
  });
</script>
```

注：`.timeline .entry` 类名来自 LogTimeline 的 scoped style，跨组件选择器需在 LogTimeline 中用 `:global()` 或给 entry 加全局类 `qst-entry`——实现时给 `.entry` 追加 `class="entry qst-entry"`，script 选择器用 `.qst-entry`。

- [ ] **Step 4: 构建验证**

Run: `npm run build`
Expected: 成功生成 `dist/quests/swimming/index.html` 等 4 个详情页。

- [ ] **Step 5: 验证画廊插件产物**

Run: `grep -o 'log-gallery-[0-9]' dist/quests/swimming/index.html | sort | uniq -c`
Expected: 输出 `1 log-gallery-2`（kick 记录的两张图聚合成两列画廊）。

- [ ] **Step 6: 验证时间线内容**

Run: `grep -c 'entry-date' dist/quests/swimming/index.html && grep -o '副本开启\|任务完成：[^<]*' dist/quests/swimming/index.html | head -6`
Expected: 7 个 entry-date（3 手写 + 1 开启 + 3 任务完成系统条目，swimming 有 4 个带 doneAt 的任务——实际 5 个 done 任务全部有 doneAt：float/breath/breaststroke/kick/breast-50m，共 3+1+5=9 个 entry）。以 `grep -c 'entry-date'` = 9 为准；系统条目文案含「副本开启」与 5 个「任务完成：…」。

- [ ] **Step 7: 视觉验证**

`npm run dev` + Chrome DevTools MCP 截图 `/quests/swimming/`（桌面 1280 宽 + 移动 375 宽各一张）。
Expected: 双栏布局（左 sticky 任务树 / 右时间线）、移动端纵向堆叠；与视觉稿 `quest-detail.html` 一致。

- [ ] **Step 8: Commit**

```bash
git add src/pages/quests/[slug].astro src/components/quests/StagePanel.astro src/components/quests/LogTimeline.astro
git commit -m "feat(quests): 实现副本详情页"
```

---

### Task 6: 首页摘要 section + 全站导航接入

**Files:**
- Create: `src/components/quests/QuestsSummary.astro`
- Modify: `src/pages/index.astro`
- Modify: `src/components/Signal.astro:19`（label 顺延）
- Modify: `src/pages/slides/index.astro:50-57`（navlinks 加 QUESTS）

**Interfaces:**
- Consumes: Task 1 collections、Task 2 的 `calcProgress`/`fmtDate`/`groupByStatus`/`lastActivityDate`/`questSlug`
- Produces: 首页 `#quests` 锚点 section

- [ ] **Step 1: 写 `QuestsSummary.astro`**

```astro
---
/**
 * @author Echo009
 * @since 2026-08-19
 */
import { getCollection } from 'astro:content';
import { calcProgress, fmtDate, groupByStatus, lastActivityDate, questSlug } from '../../lib/quests';

const quests = await getCollection('quests');
const logs = await getCollection('quest-logs');
const active = groupByStatus(quests).active.slice(0, 3);
---

<section id="quests" class="py-24 px-6 relative overflow-hidden">
  <div class="absolute left-0 top-0 bottom-0 w-px hidden lg:block" style="background: linear-gradient(180deg, transparent, var(--cyber-yellow), transparent); left: 8%;" aria-hidden="true"></div>

  <div class="max-w-6xl mx-auto">
    <div class="mb-12 gsap-reveal">
      <p class="section-label mb-2">// SECTION_06</p>
      <h2 class="font-display font-bold text-4xl md:text-5xl text-white">
        LIFE <span class="neon-yellow">QUESTS</span>
      </h2>
      <div class="mt-3 h-px w-48" style="background: linear-gradient(90deg, var(--cyber-yellow), transparent);"></div>
    </div>

    {active.length > 0 ? (
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        {active.map((q, i) => (
          <a href={`/quests/${questSlug(q)}/`} class:list={['q-card', 'hud-panel', 'hud-corner', 'p-6', 'gsap-reveal']} data-index={i}>
            <div class="flex items-center justify-between mb-3 font-mono text-xs tracking-[0.2em]">
              <span class="text-yellow-300">{'★'.repeat(q.data.difficulty)}<span class="opacity-30">{'☆'.repeat(5 - q.data.difficulty)}</span></span>
              {q.data.category && <span class="text-white/40">{q.data.category}</span>}
            </div>
            <div class="font-bold text-white mb-1" style="font-family: 'Noto Sans SC', sans-serif;">{q.data.title}</div>
            {q.data.summary && <div class="text-xs text-white/40 mb-4">{q.data.summary}</div>}
            <div class="flex items-center gap-3">
              <div class="flex-1 h-1 rounded-full bg-white/10 overflow-hidden">
                <div class="h-full" style={`width:${calcProgress(q).pct}%; background: linear-gradient(90deg, var(--cyber-cyan), var(--cyber-purple)); box-shadow: 0 0 8px rgba(0,255,255,0.5);`}></div>
              </div>
              <span class="font-mono text-xs text-cyan-300">{calcProgress(q).pct}%</span>
            </div>
            <div class="mt-3 font-mono text-[0.6rem] text-white/30 tracking-widest">最近活动 {fmtDate(lastActivityDate(q, logs))}</div>
          </a>
        ))}
      </div>
    ) : (
      <div class="gsap-reveal hud-panel p-10 text-center">
        <p class="font-mono text-white/30 text-sm tracking-widest">NO_ACTIVE_QUEST</p>
        <p class="font-mono text-white/20 text-xs mt-2">当前没有攻略中的副本</p>
      </div>
    )}

    <div class="mt-8 gsap-reveal">
      <a href="/quests/" class="font-mono text-xs tracking-widest text-white/50 hover:text-cyan-300 transition-colors">[ 进入 QUEST_LOG → ]</a>
    </div>
  </div>
</section>

<script>
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  gsap.registerPlugin(ScrollTrigger);
  gsap.fromTo('#quests .gsap-reveal', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power2.out', scrollTrigger: { trigger: '#quests', start: 'top 80%' } });
</script>
```

- [ ] **Step 2: 改 `src/pages/index.astro`（三处）**

1. import 区加：`import QuestsSummary from '../components/QuestsSummary.astro';`（放 Signal import 之后）——注意实际路径为 `'../components/quests/QuestsSummary.astro'`
2. nav links 数组 `{ href: '#network', label: 'NETWORK' },` 后加 `{ href: '#quests', label: 'QUESTS' },`
3. `<NetworkNode />` 与 `<Signal />` 之间插入 `<QuestsSummary />`
4. script 中 `const sections = ['hero', 'profile', 'arsenal', 'protocol', 'network', 'signal'];` 改为 `['hero', 'profile', 'arsenal', 'protocol', 'network', 'quests', 'signal'];`

- [ ] **Step 3: 改 `Signal.astro:19`**

`// SECTION_06` → `// SECTION_07`

- [ ] **Step 4: 改 `slides/index.astro` navlinks**

SLIDES 链接后加：

```astro
<a href="/quests" class="font-mono text-xs tracking-widest text-white/50 hover:text-white transition-colors relative nav-link">
  QUESTS
</a>
```

- [ ] **Step 5: 构建验证**

Run: `npm run build && grep -c 'id="quests"' dist/index.html && grep -o 'SECTION_0[67]' dist/index.html | sort | uniq -c`
Expected: `1`；`1 SECTION_06` + `1 SECTION_07`。

- [ ] **Step 6: 视觉验证**

`npm run dev` + Chrome DevTools MCP 截图首页 `#quests` 区域（含滚动到该区域的锚点高亮）。
Expected: 黄色主题 QUESTS section 出现在 NETWORK 与 SIGNAL 之间，1 张 swimming 卡（63%）；QUESTS 导航项滚动高亮正常。

- [ ] **Step 7: Commit**

```bash
git add src/components/quests/QuestsSummary.astro src/pages/index.astro src/components/Signal.astro src/pages/slides/index.astro
git commit -m "feat(quests): 首页接入人生副本摘要与全站导航"
```

---

### Task 7: 脚手架脚本 `scripts/quest.mjs`

**Files:**
- Create: `scripts/quest.mjs`
- Modify: `package.json`（scripts 加两项）

**Interfaces:**
- Consumes: Task 1 的目录约定（`src/content/quests/<slug>/index.md`、`logs/`）
- Produces: `npm run quest:new <slug>`、`npm run quest:log <slug>`

- [ ] **Step 1: 写 `scripts/quest.mjs`**

```js
#!/usr/bin/env node
/**
 * @author Echo009
 * @since 2026-08-19
 * 人生副本脚手架：npm run quest:new <slug> / npm run quest:log <slug>
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const QUESTS_DIR = fileURLToPath(new URL('../src/content/quests', import.meta.url));

const [cmd, slug] = process.argv.slice(2);

function fail(msg) {
  console.error(`[quest] ${msg}`);
  process.exit(1);
}

function today() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

if (cmd === 'new') {
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) fail('用法: npm run quest:new <slug>（小写字母/数字/连字符）');
  const dir = path.join(QUESTS_DIR, slug);
  if (fs.existsSync(dir)) fail(`副本已存在: ${dir}`);
  fs.mkdirSync(path.join(dir, 'logs'), { recursive: true });
  fs.mkdirSync(path.join(dir, 'images'), { recursive: true });
  const template = `---
title: （副本标题）
summary: （一句话简介）
status: active
difficulty: 3
category: FITNESS
started: ${today()}
stages:
  - id: stage-1
    name: 第一阶段
    tasks:
      - id: task-1
        name: 第一个任务
        done: false
---

（目标宣言：为什么开这个副本，通关标准是什么。）

<!-- 记录写法：在 logs/ 下新建 ${today()}-<名称>.md，frontmatter 可选 task: <任务id> -->
<!-- 图片放 images/，正文用 ![](../images/xxx.png) 引用；视频放 media/，单个 <50MB -->
`;
  fs.writeFileSync(path.join(dir, 'index.md'), template);
  console.log(`[quest] 副本已创建: ${dir}`);
} else if (cmd === 'log') {
  if (!slug) fail('用法: npm run quest:log <slug>');
  const dir = path.join(QUESTS_DIR, slug);
  if (!fs.existsSync(dir)) fail(`副本不存在: ${dir}（先 npm run quest:new ${slug}）`);
  const file = path.join(dir, 'logs', `${today()}-untitled.md`);
  fs.writeFileSync(file, `---\n---\n\n（今天的打卡记录…）\n`);
  console.log(`[quest] 记录已创建: ${file}`);
} else {
  fail('用法: npm run quest:new <slug> | npm run quest:log <slug>');
}
```

- [ ] **Step 2: `package.json` scripts 加两项**

```json
    "quest:new": "node scripts/quest.mjs new",
    "quest:log": "node scripts/quest.mjs log"
```

- [ ] **Step 3: 功能验证**

```bash
npm run quest:new demo-smoke
npm run quest:log swimming
npm run quest:new demo-smoke ; echo "exit=$?"
```

Expected: 前两条创建文件并打印路径；第三条 `exit=1` 并输出 `[quest] 副本已存在`。

- [ ] **Step 4: 构建回归**

Run: `npm run build`
Expected: 成功（模板 frontmatter 通过 schema 校验）。

- [ ] **Step 5: 清理冒烟数据并 Commit**

```bash
rm -rf src/content/quests/demo-smoke src/content/quests/swimming/logs/$(date +%Y-%m-%d)-untitled.md
git add scripts/quest.mjs package.json
git commit -m "feat(quests): 添加副本与记录脚手架脚本"
```

---

### Task 8: 全量验证与收尾

**Files:**
- Modify: `CLAUDE.md`（项目指南补 quests 模块一节）

**Interfaces:**
- Consumes: 全部前序任务
- Produces: 上线状态

- [ ] **Step 1: 全新构建**

```bash
npm run build
```

Expected: 成功；`ls dist/quests/` 含 `index.html` 与 4 个副本目录。

- [ ] **Step 2: 全页面视觉走查（Chrome DevTools MCP）**

`npm run preview`（端口 4321），逐页截图核对：

| 页面 | 检查点 |
|---|---|
| `/` | QUESTS section 位置/卡片/导航高亮 |
| `/quests/` | 四状态分组、卡片信息、GSAP 入场 |
| `/quests/swimming/` | 双栏、任务树、时间线（含系统条目/画廊/视频样式兜底）、移动端堆叠 |
| `/quests/japanese/` | CLEARED 金色头部、100% 进度 |

- [ ] **Step 3: 更新项目 `CLAUDE.md`**

「项目概述」后追加一节：

```markdown
## 人生副本模块（Quest Log）

- 内容源：`src/content/quests/<slug>/`（index.md 元数据+宣言；logs/*.md 打卡记录；images/、media/ 媒体）
- 派生逻辑：`src/lib/quests.ts`（进度/排序/时间线合成，进度自动计算勿手填）
- 页面：`/quests/` 列表、`/quests/[slug]/` 详情；首页 `#quests` 摘要 section
- 脚手架：`npm run quest:new <slug>` 开副本、`npm run quest:log <slug>` 写记录
- 日常记录：quest:log 生成模板 → 编辑放图 → push（CI 自动部署）；视频单文件 <50MB
- 多图画廊：同一段落内连续 `![]()` 自动聚合（rehype-log-gallery 插件）
```

- [ ] **Step 4: Commit 并推送**

```bash
git add CLAUDE.md
git commit -m "docs: 项目指南补充人生副本模块说明"
git push
```

若 push 报 DNS/网络错误，告知用户网络恢复后手动 `git push`（本地提交已完成）。

---

## 自检记录（写计划时已核对）

1. **Spec 覆盖**：schema（Task 1）、派生规则（Task 2）、画廊插件（Task 3）、列表页（Task 4）、详情页+空态+锚点 chip（Task 5）、首页入口+Signal 顺延（Task 6）、脚手架+<50MB 注释（Task 7）、CLAUDE.md 说明（Task 8）——spec 第 5/6/7/8 节文件清单全部落地；spec 第 10 节 YAGNI 项均未纳入。
2. **占位符**：无 TBD/TODO；Task 5 Step 2 的动态组件渲染给了首选写法与明确退路及验收标准（build 通过 + 正文渲染）。
3. **类型一致性**：`questSlug`/`logQuestSlug`/`buildTimeline`/`fmtDate` 等签名在 Task 2 定义，Task 4/5/6 消费处一致；`Progress.pct`、`TimelineEntry.order` 语义一致。
