import { writingChapterIndex } from "./writing-chapter-index";
import type { WritingAction, WritingCommand } from "./writing-api";
import { writingActionReason } from "./writing-workspace";
import {
  isWritingOutlineSection,
  writingEntitySection,
  writingSelectionTitle,
  writingSelectionText,
  type WritingDocument,
  type WritingSelection,
} from "./writing-document";

type WritingAIInput = {
  document: WritingDocument;
  savedDocument?: WritingDocument;
  selection: WritingSelection;
  body?: string;
  selectedCharacters: number;
};
export function writingAITarget({
  document,
  savedDocument = document,
  selection,
  body,
  selectedCharacters,
}: WritingAIInput) {
  const selected =
    selection.kind === "unit"
      ? writingChapterIndex(document.units).byId.get(selection.id)?.unit
      : undefined;
  const entitySection = writingEntitySection(selection);
  const directory = selection.kind === "section" && selection.id === "chapters";
  const entityList = selection.kind === "section" && Boolean(entitySection);
  const chapterPlan = selection.kind === "unit" && selection.tab === "plan";
  const text = writingSelectionText(document, selection, body);
  const hasContent = Boolean(text.trim());
  const label =
    writingSelectionTitle(document, selection) +
    (selected ? (chapterPlan ? " · 本章剧情" : " · 正文") : "");
  let primaryLabel = hasContent ? "重写当前内容" : "生成当前内容";
  if (selectedCharacters) primaryLabel = "修改选中文字";
  else if (directory)
    primaryLabel = document.units.length ? "添加章节" : "规划章节剧情";
  else if (entityList)
    primaryLabel = `${document.outline[entitySection!].length ? "更新" : "生成"}${label}`;
  else if (
    selection.kind === "section" &&
    isWritingOutlineSection(selection.id) &&
    !hasContent
  )
    primaryLabel = `生成${label}`;
  else if (selected && !chapterPlan && !hasContent)
    primaryLabel = "生成本章正文";
  const availabilityAction = directory
    ? document.units.length
      ? "append"
      : "generate_chapters"
    : selected && !chapterPlan && !hasContent
      ? "generate_units"
      : entityList || chapterPlan || !hasContent
        ? "generate_section"
        : "propose_edit";
  const reason = writingActionReason(savedDocument, availabilityAction, {
    section_id: chapterPlan
      ? "chapter_plan"
      : entitySection ||
        (selection.kind === "section" && isWritingOutlineSection(selection.id)
          ? selection.id
          : undefined),
    unit_id: selected?.id,
    unit_ids: selected ? [selected.id] : undefined,
    mode: "single",
  });
  return {
    selected,
    entitySection,
    entityList,
    directory,
    chapterPlan,
    hasContent,
    label,
    primaryLabel,
    available: !reason,
    reason,
    instruction: selectedCharacters
      ? "修改选中的文字，保留原意并使表达自然流畅。"
      : hasContent
        ? "重写当前内容，保持作品设定和上下文一致。"
        : `生成${label}，参考作品已有设定。`,
    remaining: writingChapterIndex(document.units).firstUnwritten >= 0,
  };
}
export function writingAICommand(
  input: WritingAIInput,
  instruction: string,
  continueWriting: boolean,
): { action: WritingAction; extra: Partial<WritingCommand> } {
  const { selection } = input;
  const target = writingAITarget(input);
  const extra: Partial<WritingCommand> = { instruction };
  if (continueWriting)
    return { action: "generate_units", extra: { ...extra, mode: "continue" } };
  if (target.directory)
    return input.document.units.length
      ? { action: "append", extra: { ...extra, count: 1 } }
      : { action: "generate_chapters", extra };
  if (target.entityList)
    return {
      action: "generate_section",
      extra: { ...extra, section_id: target.entitySection },
    };
  if (target.selected && target.chapterPlan && !target.hasContent)
    return {
      action: "generate_section",
      extra: {
        ...extra,
        section_id: "chapter_plan",
        unit_id: target.selected.id,
      },
    };
  if (target.selected && !target.chapterPlan && !target.hasContent)
    return {
      action: "generate_units",
      extra: { ...extra, mode: "single", unit_ids: [target.selected.id] },
    };
  if (
    selection.kind === "section" &&
    isWritingOutlineSection(selection.id) &&
    !target.hasContent
  )
    return {
      action: "generate_section",
      extra: { ...extra, section_id: selection.id },
    };
  if (target.selected) {
    extra.unit_id = target.selected.id;
    if (target.chapterPlan) extra.section_id = "chapter_plan";
  } else {
    extra.section_id =
      target.entitySection ||
      (selection.kind === "section" && isWritingOutlineSection(selection.id)
        ? selection.id
        : undefined);
    if (selection.kind === "entity") extra.entity_id = selection.id;
  }
  extra.instruction ||= target.instruction;
  return { action: "propose_edit", extra };
}
