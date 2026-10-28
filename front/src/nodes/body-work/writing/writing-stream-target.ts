import { writingChapterIndex } from "./writing-chapter-index";
import {
  isWritingOutlineSection,
  type WritingCheckpoint,
  type WritingDocument,
  type WritingPreview,
  type WritingSelection,
  type WritingSnapshot,
} from "./writing-document";

const planningPhaseTargets: Partial<Record<NonNullable<WritingCheckpoint["phase"]>, string>> = {
  preferences: "phase:preferences",
  direction: "phase:direction",
  characters: "phase:characters",
  background: "phase:background",
  chapters: "phase:chapters",
};

/** 定位实际正在写的卡片；分页与滚动由同一 follow 意图决定。 */
export function writingStreamTarget(
  document: WritingDocument,
  selection: WritingSelection,
  preview: WritingPreview | null,
  checkpoint?: WritingSnapshot["checkpoint"],
): string | null {
  const phase = checkpoint?.action === "generate_outline" ? checkpoint.phase : undefined;
  const phaseTarget = selection.kind === "section" && selection.id !== "chapters"
    ? (phase && planningPhaseTargets[phase]) || null
    : null;
  if (!preview || (phase && preview.phase !== phase)) return phaseTarget;
  return writingFieldTarget(document, selection, preview, checkpoint) || phaseTarget;
}

function writingFieldTarget(
  document: WritingDocument,
  selection: WritingSelection,
  preview: WritingPreview,
  checkpoint?: WritingSnapshot["checkpoint"],
): string | null {
  const field = preview.active_field.replace(/\[(\d+)\]/g, ".$1");
  if (field.startsWith("preferences.")) return selection.kind === "section" ? "preferences" : null;
  if (!field || field === "replacement" || selection.kind === "entity")
    return null;
  if (selection.kind === "unit") {
    const plan = selection.tab === "plan";
    if (
      preview.unit_id === selection.id &&
      field === (plan ? "plan" : "body") &&
      (!plan || preview.section_id === "chapter_plan")
    )
      return `unit:${selection.id}:${plan ? "plan" : "body"}`;
  }
  const unit = /^units\.(\d+)\.(title|plan)$/.exec(field);
  if (unit) {
    const local = Number(unit[1]);
    const index =
      checkpoint?.action === "generate_chapters" && checkpoint.unit_ids.length
        ? writingChapterIndex(document.units).byId.get(
            checkpoint.unit_ids[local],
          )?.ordinal
        : local +
          (checkpoint?.action === "append" ? document.units.length : 0) +
          1;
    if (index === undefined) return null;
    if (selection.kind === "section") return `chapter:${index - 1}`;
    if (
      selection.kind === "unit" &&
      selection.tab === "plan" &&
      document.units[index - 1]?.id === selection.id
    )
      return `unit:${selection.id}:plan`;
    return null;
  }
  if (selection.kind !== "section" || selection.id === "chapters") return null;
  const outline = field.startsWith("outline.")
    ? field.slice(8)
    : field === "content"
      ? preview.section_id
      : undefined;
  if (outline && isWritingOutlineSection(outline)) return `outline:${outline}`;
  const entity = /^outline\.(characters|locations|props)\.(\d+)\./.exec(field);
  if (entity) return `outline:${entity[1]}:${entity[2]}`;
  const scopedEntity = /^entities\.(\d+)\./.exec(field);
  if (scopedEntity && preview.section_id)
    return `outline:${preview.section_id}:${scopedEntity[1]}`;
  return null;
}

