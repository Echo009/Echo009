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
