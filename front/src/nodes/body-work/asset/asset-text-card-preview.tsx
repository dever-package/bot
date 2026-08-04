import { contentOutputHasType } from "../shared/content-output";
import { BodyContentView } from "../shared/content-view";
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
  const previewOutput = contentOutputHasType(output, "storyboard")
    ? { text: fallback }
    : output;

  return (
    <div className={`wb-asset-card-text-preview is-${kind}`}>
      <BodyContentView
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
