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
  // 无法解析时回退 epoch，使该记录排在最前（时间线倒序末位）
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
    // 字典序：记录文件名建议以 YYYY-MM-DD 为前缀，确保与时间序一致
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
