import type { WritingUnitEntry } from "./writing-document";

export const writingChapterPageSize = 30;
export const writingChapterPlanBatchLimit = 20;
export const writingChapterRowHeight = 74;

export type WritingChapterRow = {
  unit: WritingUnitEntry;
  ordinal: number;
  label: string;
  searchTitle: string;
};
const indexes = new WeakMap<
  WritingUnitEntry[],
  ReturnType<typeof buildIndex>
>();

function buildIndex(units: WritingUnitEntry[]) {
  const canonical = units.map((unit, index) => ({
    unit,
    ordinal: index + 1,
    label: `第 ${index + 1} 章`,
    searchTitle: unit.title.toLocaleLowerCase(),
  }));
  return {
    canonical,
    reversed: [...canonical].reverse(),
    byId: new Map(canonical.map((row) => [row.unit.id, row])),
    firstUnwritten: canonical.findIndex((row) => !row.unit.has_body),
    pendingPlans: canonical.filter(({ unit }) => !unit.has_body && unit.plan_stale),
  };
}

/** 章节身份不变时，正文输入与流式状态共用同一份目录索引。 */
export function writingChapterIndex(units: WritingUnitEntry[]) {
  let index = indexes.get(units);
  if (!index) {
    index = buildIndex(units);
    indexes.set(units, index);
  }
  return index;
}

export function writingChapterMatches(
  index: ReturnType<typeof writingChapterIndex>,
  query: string,
) {
  const normalized = query.trim().toLocaleLowerCase();
  return normalized
    ? index.reversed.filter((row) => row.searchTitle.includes(normalized))
    : index.reversed;
}

export function writingChapterPage(rows: WritingChapterRow[], page: number) {
  const pages = Math.max(1, Math.ceil(rows.length / writingChapterPageSize));
  const current = Math.max(0, Math.min(pages - 1, page));
  return {
    page: current,
    pages,
    rows: rows.slice(
      current * writingChapterPageSize,
      (current + 1) * writingChapterPageSize,
    ),
    start: rows.length ? current * writingChapterPageSize + 1 : 0,
    end: Math.min(rows.length, (current + 1) * writingChapterPageSize),
    total: rows.length,
  };
}

export function writingChapterWindow(
  total: number,
  scrollTop: number,
  height: number,
) {
  const start = Math.max(
    0,
    Math.floor(scrollTop / writingChapterRowHeight) - 3,
  );
  const end = Math.min(
    total,
    Math.ceil((scrollTop + height) / writingChapterRowHeight) + 3,
  );
  return {
    start: Math.min(start, total),
    end,
    height: total * writingChapterRowHeight,
  };
}

export function writingChapterRange(rows: WritingChapterRow[]) {
  if (!rows.length) return "";
  const ordinals = rows.map((row) => row.ordinal);
  return rows.length === 1
    ? `第 ${ordinals[0]} 章`
    : `第 ${Math.min(...ordinals)}—${Math.max(...ordinals)} 章 · ${rows.length} 章`;
}

export function writingContinuationBatch(
  units: WritingUnitEntry[],
  count = 10,
) {
  const index = writingChapterIndex(units);
  const start = index.firstUnwritten;
  if (start < 0) return [];
  const rows: WritingChapterRow[] = [];
  const limit = Math.min(10, Math.max(1, count));
  for (
    let offset = start;
    offset < index.canonical.length && rows.length < limit;
    offset += 1
  ) {
    const row = index.canonical[offset];
    if (row.unit.has_body) break;
    rows.push(row);
  }
  return rows;
}

/** 待同步来自保存后的服务端状态，刷新及分批完成后仍能准确继续。 */
export function writingPlanSyncRows(units: WritingUnitEntry[]) {
  return writingChapterIndex(units).pendingPlans;
}

export function writingNextPlanBatch(units: WritingUnitEntry[], plannedTotal: number, requested?: number) {
  const available = plannedTotal > 0 ? Math.max(0, plannedTotal - units.length) : writingChapterPlanBatchLimit;
  // 只有空输入采用自动末批；显式数量由命令校验，不能静默取整或截断。
  const count = requested === undefined ? Math.min(available, writingChapterPlanBatchLimit) : requested;
  return { start: units.length + 1, end: units.length + count, count };
}
