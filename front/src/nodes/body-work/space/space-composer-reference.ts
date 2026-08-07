import type { CanvasAssetEntry } from "./space-asset-index";
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
          String(source.type || ""),
        ),
        source: "current" as const,
        output: source.output,
        preview: source.preview,
      })),
    ]),
  };
}

export function buildCanvasReferenceItems(entries: CanvasAssetEntry[]) {
  return entries.map(
    (entry): ComposerAssetItem => ({
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
    }),
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
  if (preview.imageUrl) return "image";
  if (preview.videoUrl) return "video";
  if (preview.audioUrl) return "audio";
  if (preview.fileUrl) return "file";
  if (preview.text) return "text";
  return String(fallback || "file").toLowerCase();
}
