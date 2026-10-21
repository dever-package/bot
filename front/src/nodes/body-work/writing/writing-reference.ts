import {
  writingSelectionKey,
  writingSections,
  writingUnitLabel,
  parseWritingDocument,
  type WritingContentSelection,
} from "./writing-document";
import type {
  CanvasReferenceContent,
  ComposerAssetItem,
  CanvasLibraryReferenceType,
} from "../space/types";

export function writingReferenceItems(
  item: ComposerAssetItem,
): ComposerAssetItem[] {
  const document = parseWritingDocument(item.output);
  if (!document) return [item];
  const choices = [
    ...writingSections.map((section) => ({
      kind: "section" as const,
      id: section.id,
      title: section.label,
    })),
    ...document.units
      .filter((unit) => unit.has_body)
      .map((unit) => ({
        kind: "unit" as const,
        id: unit.id,
        title: `${writingUnitLabel(document.units, unit.id)} ${unit.title}`,
      })),
  ];
  return [
    item,
    ...choices.map((choice) => ({
      ...item,
      id: `${item.id}:${choice.kind}:${choice.id}`,
      title: `${item.title} · ${choice.title}`,
      contentSelection: { kind: choice.kind, ids: [choice.id] },
      preview: { ...item.preview, text: choice.title },
      output: undefined,
    })),
  ];
}

type ReferenceSelectionOption = {
  refType: CanvasLibraryReferenceType;
  refId: number;
  versionID?: number;
  label: string;
  originID?: string;
  contentSelection?: WritingContentSelection;
};

export function pinnedWritingReferenceOptions<
  T extends ReferenceSelectionOption & { key: string },
>(
  options: T[],
  content?: CanvasReferenceContent,
): Array<T | (ReferenceSelectionOption & { key: string; origin?: string })> {
  const pinned = (content?.parts || []).flatMap((part) =>
    part.type === "reference" &&
    part.ref_content_selection &&
    part.ref_version_id
      ? [
          {
            key: `writing-pinned:${part.ref_id}:${part.ref_version_id}:${writingSelectionKey(part.ref_content_selection)}`,
            refType: part.ref_type,
            refId: part.ref_id,
            label: part.label,
            versionID: part.ref_version_id,
            origin: part.ref_origin,
            originID: part.ref_origin_id,
            contentSelection: part.ref_content_selection,
          },
        ]
      : [],
  );
  // 宿主优先采用 option 的版本。为已有选择补确切版本项，不能让来源刷新升级它。
  return [...options, ...pinned];
}

// 宿主编辑器只认识通用引用属性；在组件适配边界恢复领域选择，避免修改宿主协议。
export function restoreWritingReferenceSelections(
  next: CanvasReferenceContent,
  previous: CanvasReferenceContent | undefined,
  options: ReferenceSelectionOption[],
): CanvasReferenceContent {
  return {
    ...next,
    parts: next.parts.map((part) => {
      if (part.type !== "reference" || part.ref_content_selection) return part;
      const existing = previous?.parts.find(
        (candidate) =>
          candidate.type === "reference" &&
          candidate.ref_type === part.ref_type &&
          candidate.ref_id === part.ref_id &&
          candidate.ref_version_id === part.ref_version_id &&
          candidate.ref_origin_id === part.ref_origin_id &&
          candidate.label === part.label,
      );
      const option = options.find(
        (candidate) =>
          candidate.refType === part.ref_type &&
          candidate.refId === part.ref_id &&
          candidate.versionID === part.ref_version_id &&
          candidate.label === part.label,
      );
      const selection =
        existing?.type === "reference"
          ? existing.ref_content_selection
          : option?.contentSelection;
      return selection ? { ...part, ref_content_selection: selection } : part;
    }),
  };
}

export function writingReferenceOrigin(selection: WritingContentSelection) {
  return `writing:${writingSelectionKey(selection)}`;
}
