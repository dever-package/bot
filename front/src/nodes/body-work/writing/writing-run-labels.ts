import {
  writingSections,
  writingEntitySections,
  writingOutlineSections,
  writingSelectionTitle,
  type WritingSnapshot,
} from "./writing-document";
import { writingChapterIndex, writingChapterPlanBatchLimit, writingChapterRange, writingNextPlanBatch } from "./writing-chapter-index";

const actionLabels: Record<string, string> = {
  generate_inspirations: "生成灵感",
  select_inspiration: "选定灵感",
  generate_outline: "生成大纲",
  generate_chapters: "规划剧情",
  retry_continuity: "整理剧情衔接",
  propose_edit: "生成修改建议",
  generate_section: "生成内容",
  generate_units: "生成正文",
  append: "追加规划",
};

export function writingRunActionLabel(action: string) {
  return actionLabels[action] || "创作任务";
}

export function generationTaskTitle(
  snapshot: WritingSnapshot | null,
) {
  const checkpoint = snapshot?.checkpoint;
  if (!snapshot) return "正在准备创作";
  if (!checkpoint) return "创作任务";
  const { document } = snapshot;
  if (checkpoint.phase) {
    const phases = { preferences: "生成写作设定", direction: "生成故事走向", characters: "生成人物", background: "生成背景", chapters: "规划章节剧情", body: "正在写正文", continuity: "正文已保存，整理剧情衔接" };
    const id = checkpoint.phase === "continuity" ? checkpoint.continuity_unit_id || checkpoint.unit_id : checkpoint.unit_id || checkpoint.unit_ids?.[checkpoint.completed];
    const row = id ? document.units.findIndex((unit) => unit.id === id) : -1;
    const phase = checkpoint.phase === "continuity" && checkpoint.history_total
      ? `正在整理前文 ${checkpoint.history_completed || 0}/${checkpoint.history_total}`
      : phases[checkpoint.phase];
    if (checkpoint.phase === "chapters") {
      const count = Math.min(writingChapterPlanBatchLimit, checkpoint.count || document.preferences.planned_chapters || (document.preferences.mode === "serial" ? 10 : 5));
      return `${phase} · 第 1—${count} 章`;
    }
    return `${phase}${row >= 0 ? ` · 第 ${row + 1} 章` : ""}`;
  }
  const label = writingRunActionLabel(checkpoint.action);
  if (checkpoint.action === "append") {
    const batch = writingNextPlanBatch(document.units, document.preferences.planned_chapters, checkpoint.count);
    return `${label} · 第 ${batch.start}—${batch.end} 章`;
  }
  if (checkpoint.action === "generate_chapters" && checkpoint.unit_ids.length) {
    const index = writingChapterIndex(document.units);
    const rows = checkpoint.unit_ids.flatMap((id) => { const row = index.byId.get(id); return row ? [row] : []; });
    return `${label} · ${writingChapterRange(rows)}`;
  }
  const unitId =
    checkpoint.unit_ids?.[checkpoint.completed] || checkpoint.unit_id;
  const unit = document.units.find((entry) => entry.id === unitId);
  if (unit)
    return `${label} · ${writingSelectionTitle(document, { kind: "unit", id: unit.id })}${checkpoint.section_id === "chapter_plan" ? " · 章纲" : ""}`;
  if (
    checkpoint.action === "generate_section" ||
    checkpoint.action === "propose_edit"
  ) {
    const section = [...writingSections, ...writingOutlineSections].find(
      (entry) => entry.id === checkpoint.section_id,
    );
    const entity = writingEntitySections
      .flatMap(({ id }) => document.outline[id])
      .find((entry) => entry.id === checkpoint.entity_id);
    return `${label}${section ? ` · ${section.label}` : ""}${entity ? ` · ${entity.name}` : ""}`;
  }
  return label;
}
