import { writingReferenceItems } from "../writing/writing-reference";
import {
  sameCanvasAssetPreview,
  type CanvasAssetEntry,
} from "./space-asset-index";
import type { NodeInputContext } from "./space-node-runtime";
import type { CanvasContentPreview, ComposerAssetItem } from "./types";

export function buildComposerReferenceLibrary(
  inputContext: NodeInputContext | null,
  canvasItems: ComposerAssetItem[] = [],
): { current: ComposerAssetItem[] } {
  return {
    current: mergeComposerAssetItems([
      ...canvasItems,
      ...(inputContext?.sources || []).map((source) => ({
        id: source.nodeId,
        title: source.title,
        kind: composerKindFromPreview(
          source.preview,
          String(source.kind || source.type || ""),
        ),
        source: "current" as const,
        output: source.output,
        preview: source.preview,
      })),
    ]),
  };
}

const canvasReferenceItemsByEntry = new WeakMap<
  CanvasAssetEntry,
  ComposerAssetItem[]
>();
const canvasReferenceItemsByBase = new WeakMap<
  ComposerAssetItem,
  ComposerAssetItem[]
>();

export function buildCanvasReferenceItems(
  entries: CanvasAssetEntry[],
  previousItems: ComposerAssetItem[] = [],
) {
  const previousByID = new Map(
    previousItems.map((item) => [`${item.source}:${item.id}`, item]),
  );
  const items = entries.flatMap((entry) => {
    const cached = canvasReferenceItemsByEntry.get(entry);
    if (cached) return cached;
    const item: ComposerAssetItem = {
      id:
        entry.role === "material"
          ? entry.nodeId || entry.key
          : String(entry.assetId || entry.key),
      title: entry.title,
      kind: composerKindFromPreview(entry.preview, entry.nodeType),
      role: entry.role,
      source: entry.role === "material" ? "current" : "asset",
      refType: "asset",
      refId: entry.assetId,
      versionID: entry.versionId,
      output: entry.output,
      preview: entry.preview,
      asset: entry.asset,
    };
    const previous = previousByID.get(`${item.source}:${item.id}`);
    // 节点位置/草稿改变会更新 entry.node，但不改变引用库的内容。
    const reusable =
      previous && sameCanvasReferenceItem(previous, item)
        ? canvasReferenceItemsByBase.get(previous)
        : undefined;
    const references =
      reusable ||
      writingReferenceItems(item).map((reference) => {
        const previous = previousByID.get(
          `${reference.source}:${reference.id}`,
        );
        return previous && sameCanvasReferenceItem(previous, reference)
          ? previous
          : reference;
      });
    canvasReferenceItemsByEntry.set(entry, references);
    canvasReferenceItemsByBase.set(references[0], references);
    return references;
  });
  return items.length === previousItems.length &&
    items.every((item, index) => item === previousItems[index])
    ? previousItems
    : items;
}

function sameCanvasReferenceItem(
  left: ComposerAssetItem,
  right: ComposerAssetItem,
) {
  return (
    left.id === right.id &&
    left.title === right.title &&
    left.kind === right.kind &&
    left.role === right.role &&
    left.source === right.source &&
    left.refType === right.refType &&
    left.refId === right.refId &&
    left.versionID === right.versionID &&
    left.output === right.output &&
    left.asset === right.asset &&
    sameCanvasAssetPreview(left.preview, right.preview) &&
    sameWritingContentSelection(left.contentSelection, right.contentSelection)
  );
}

function sameWritingContentSelection(
  left: ComposerAssetItem["contentSelection"],
  right: ComposerAssetItem["contentSelection"],
) {
  return (
    left === right ||
    Boolean(
      left &&
      right &&
      left.kind === right.kind &&
      left.ids.length === right.ids.length &&
      left.ids.every((id, index) => id === right.ids[index]),
    )
  );
}

function mergeComposerAssetItems(items: ComposerAssetItem[]) {
  const result: ComposerAssetItem[] = [];
  const keys = new Set<string>();
  for (const item of items) {
    const key = `${item.source}:${item.id}`;
    if (keys.has(key)) {
      continue;
    }
    keys.add(key);
    result.push(item);
  }
  return result;
}

function composerKindFromPreview(
  preview: CanvasContentPreview,
  fallback: string,
) {
  const declaredKind = String(fallback || "")
    .trim()
    .toLowerCase();
  if (["image", "video", "audio", "file"].includes(declaredKind)) {
    return declaredKind;
  }
  if (preview.imageUrl) return "image";
  if (preview.videoUrl) return "video";
  if (preview.audioUrl) return "audio";
  if (preview.fileUrl) return "file";
  if (preview.text) return "text";
  return declaredKind || "file";
}
