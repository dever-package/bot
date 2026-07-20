import { CanvasNodeContentView } from "../space/space-content-view";
import { parseStoryboardOutput } from "../space/space-storyboard";
import { assetKindLabel } from "./asset-contract";
import { assetPreviewOutput, assetPreviewText } from "./asset-content";
import type { AssetKind } from "./asset-types";

type TextAssetKind = Extract<AssetKind, "text" | "richtext">;

export function AssetTextCardPreview({
  kind,
  content,
  summary,
}: {
  kind: TextAssetKind;
  content: unknown;
  summary?: string;
}) {
  const output = assetPreviewOutput(kind, content);
  const fallback =
    summary || assetPreviewText(content) || assetKindLabel(kind);
  const previewOutput = parseStoryboardOutput(output)
    ? { text: fallback }
    : output;

  return (
    <div className={`wb-asset-card-text-preview is-${kind}`}>
      <CanvasNodeContentView
        output={previewOutput}
        fallback={fallback}
        emptyText={fallback}
        className="wb-asset-card-text-content"
        markdownClassName="wb-asset-card-prose"
        richClassName="wb-asset-card-prose"
      />
    </div>
  );
}
