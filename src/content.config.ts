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

export const collections = { quests, 'quest-logs': questLogs };
