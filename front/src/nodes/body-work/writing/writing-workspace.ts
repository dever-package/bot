import {
  writingChapterIndex,
  writingContinuationBatch,
  writingChapterPlanBatchLimit,
  writingPlanSyncRows,
  writingChapterRange,
} from "./writing-chapter-index";
import type { WritingAction, WritingCommand } from "./writing-api";
import {
  selectedWritingInspiration,
  writingEntitySection,
  isWritingOutlineSection,
  writingPlanningComplete,
  writingSections,
  type WritingDocument,
  type WritingSelection,
  type WritingSnapshot,
} from "./writing-document";

export function canOpenWritingWorkspace(document?: WritingDocument | null) {
  const inspiration = document && selectedWritingInspiration(document);
  return Boolean(inspiration?.title.trim() && inspiration.content.trim());
}

/** 只接受已保存文档；本地输入与流式投影不作为阶段解锁依据。 */
export function writingSelectionReason(
  document: WritingDocument,
  selection: WritingSelection,
): string {
  if (!canOpenWritingWorkspace(document)) return "请先在画布选用一个灵感";
  if (selection.kind === "section" && isWritingOutlineSection(selection.id))
    return "";
  if (writingEntitySection(selection)) return "";
  if (selection.kind === "unit") {
    const unit = writingChapterIndex(document.units).byId.get(
      selection.id,
    )?.unit;
    if (!unit) return "该章节已移出目录";
    if (selection.tab === "body" || !selection.tab) {
      if (unit.has_body || (unit.title.trim() && unit.plan.trim())) return "";
      return "请先保存本章标题与剧情";
    }
    if (unit.plan.trim() || unit.has_body || writingPlanningComplete(document))
      return "";
  } else if (document.units.length || writingPlanningComplete(document))
    return "";
  return "请先完成大纲规划";
}

export function writingActionReason(
  document: WritingDocument,
  action: WritingAction,
  extra: Partial<WritingCommand> = {},
): string {
  if (
    [
      "save_document",
      "save_unit",
      "create_version",
      "restore_document",
    ].includes(action)
  )
    return "";
  if (action === "generate_inspirations" || action === "select_inspiration")
    return document.selected_inspiration_id
      ? "选定灵感后不能更换或修改方向"
      : "";
  if (!canOpenWritingWorkspace(document)) return "请先选用一个灵感";
  if (action === "generate_outline" || action === "retry_planning") return "";
  if (action === "retry_continuity") {
    const unit = writingChapterIndex(document.units).byId.get(extra.unit_id || "")?.unit;
    return unit?.has_body ? "" : "请先保存本章正文";
  }
  if (
    (action === "generate_section" || action === "propose_edit") &&
    extra.section_id &&
    (isWritingOutlineSection(extra.section_id) ||
      ["characters", "locations", "props"].includes(extra.section_id))
  )
    return "";
  if (!writingPlanningComplete(document))
    return "请先保存完整大纲";
  if (action === "generate_chapters") {
    if (extra.unit_ids && !extra.unit_ids.length)
      return "当前页没有可更新的章节";
    if (extra.unit_ids?.length) {
      if (extra.unit_ids.length > writingChapterPlanBatchLimit) return `每批最多更新 ${writingChapterPlanBatchLimit} 章章纲`;
      if (
        extra.unit_ids.some(
          (id) => !writingChapterIndex(document.units).byId.has(id),
        )
      )
        return "部分章节已移出目录";
    } else if (document.units.length > writingChapterPlanBatchLimit)
      return `请选定最多 ${writingChapterPlanBatchLimit} 章章纲`;
    return "";
  }
  const pendingPlans = writingPlanSyncRows(document.units);
  if (action === "append" && pendingPlans.length)
    return "请先同步后续剧情，再继续创作";
  if (action === "append") {
    const plannedTotal = document.preferences.planned_chapters;
    if (plannedTotal > 0 && document.units.length >= plannedTotal)
      return "已规划到计划总章数，可在写作设定中调整";
    if (extra.count !== undefined) {
      if (!Number.isInteger(extra.count) || extra.count < 1 || extra.count > writingChapterPlanBatchLimit)
        return `本批剧情章数须为 1 到 ${writingChapterPlanBatchLimit} 的整数`;
      if (plannedTotal > 0 && document.units.length + extra.count > plannedTotal)
        return `本批最多规划剩余 ${plannedTotal - document.units.length} 章，请调整数量`;
    }
    return "";
  }
  if (action === "generate_units") {
    const units =
      extra.mode === "continue"
        ? writingContinuationBatch(document.units, extra.count || 10).map(
            (row) => row.unit,
          )
        : document.units.filter(
            (unit) =>
              extra.unit_ids?.includes(unit.id) || unit.id === extra.unit_id,
          );
    if (!units.length) return "请先完成章节剧情规划";
    if (units.some((unit) => !unit.has_body && unit.plan_stale))
      return "请先同步本批后续剧情，再生成正文";
    if (units.some((unit) => !unit.title.trim() || !unit.plan.trim()))
      return "请先保存章节标题与剧情";
    const next = units.find((unit) => !unit.has_body);
    if (!next) return "正文已完成，请使用修改建议";
    const index = document.units.indexOf(next);
    if (index > 0 && !document.units[index - 1].has_body)
      return `请先完成上一章「${document.units[index - 1].title}」正文，或继续未完成正文`;
  }
  return "";
}

export function writingCommandImpact(
  document: WritingDocument,
  action: WritingAction,
  extra: Partial<WritingCommand> = {},
): string {
  if (action === "generate_chapters" && document.units.length) {
    const index = writingChapterIndex(document.units);
    const rows = extra.unit_ids?.flatMap((id) => { const row = index.byId.get(id); return row ? [row] : []; });
    return extra.unit_ids?.length
      ? `将更新${writingChapterRange(rows || [])}的剧情，覆盖这些章纲的手动修改。人物、背景与已写正文保留。`
      : "将更新全部章纲，覆盖其中的手动修改。大纲资料和正文保留，后续章节需检查衔接。";
  }
  if (action === "generate_section" && extra.section_id) {
    const section = extra.section_id;
    if (
      (section === "characters" ||
        section === "locations" ||
        section === "props") &&
      document.outline[section].length
    ) {
      const label = writingSections.find(
        (entry) => entry.id === section,
      )!.label;
      return `将更新当前${label}，覆盖其中的手动描述。已有身份、其他设定、章纲和正文保留。`;
    }
  }
  return "";
}

export function writingProposalSelection(
  extra: Partial<WritingCommand>,
): WritingSelection {
  if (extra.unit_id)
    return {
      kind: "unit",
      id: extra.unit_id,
      tab: extra.section_id === "chapter_plan" ? "plan" : "body",
    };
  if (
    extra.entity_id &&
    (extra.section_id === "characters" ||
      extra.section_id === "locations" ||
      extra.section_id === "props")
  )
    return { kind: "entity", section: extra.section_id, id: extra.entity_id };
  return {
    kind: "section",
    id:
      extra.section_id && isWritingOutlineSection(extra.section_id)
        ? extra.section_id
        : "overview",
  };
}

/** 失败范围来自 checkpoint，和当前浏览页无关；已完成正文不重复生成。 */
export function writingRetryCommand(
  snapshot: WritingSnapshot | null,
): { action: WritingAction; extra: Partial<WritingCommand> } | null {
  if (!snapshot || !["failed", "stopped"].includes(snapshot.document.status))
    return null;
  const checkpoint = snapshot.checkpoint;
  if (!checkpoint) return null;
  const extra: Partial<WritingCommand> = {
    instruction: checkpoint.instruction,
  };
  if (checkpoint.count) extra.count = checkpoint.count;
  if (checkpoint.selected_text) extra.selected_text = checkpoint.selected_text;
  if (checkpoint.section_id)
    extra.section_id = checkpoint.section_id as WritingCommand["section_id"];
  if (checkpoint.entity_id) extra.entity_id = checkpoint.entity_id;
  if (checkpoint.inspiration_id)
    extra.inspiration_id = checkpoint.inspiration_id;
  if (checkpoint.unit_id) extra.unit_id = checkpoint.unit_id;
  if (checkpoint.action === "generate_chapters" && checkpoint.unit_ids.length)
    extra.unit_ids = checkpoint.unit_ids;
  if (checkpoint.action === "generate_outline") return { action: "retry_planning", extra: {} };
  const queuedUnit = checkpoint.unit_ids[checkpoint.completed];
  const rebuildingBeforeBody = checkpoint.action === "generate_units" && Boolean(queuedUnit) && !writingChapterIndex(snapshot.document.units).byId.get(queuedUnit)?.unit.has_body;
  if ((!rebuildingBeforeBody && checkpoint.phase === "continuity") || checkpoint.action === "retry_continuity") {
    const id = queuedUnit || checkpoint.unit_id || checkpoint.continuity_unit_id || "";
    const unit = writingChapterIndex(snapshot.document.units).byId.get(id)?.unit;
    return unit?.has_body ? { action: "retry_continuity", extra: { unit_id: id, expected_unit_version_id: unit.version_id } } : null;
  }
  if (checkpoint.action === "generate_units") {
    const remaining = checkpoint.unit_ids
      .slice(checkpoint.completed)
      .filter(
        (id) =>
          !writingChapterIndex(snapshot.document.units).byId.get(id)?.unit
            .has_body,
      );
    if (!remaining.length) return null;
    extra.mode = remaining.length === 1 ? "single" : "range";
    extra.unit_ids = remaining;
  }
  if (
    ![
      "generate_outline",
      "generate_chapters",
      "generate_section",
      "generate_units",
      "propose_edit",
      "append",
    ].includes(checkpoint.action)
  )
    return null;
  return { action: checkpoint.action as WritingAction, extra };
}
