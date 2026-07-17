import { Check, ExternalLink } from "lucide-react";
import { AssetPreview } from "./asset-preview";
import { assetKindLabel, assetSourceLabel } from "./asset-contract";
import type { AssetRecord } from "./asset-types";

export function AssetCard({
  asset,
  selectable = false,
  onOpen,
  onSelect,
}: {
  asset: AssetRecord;
  selectable?: boolean;
  onOpen: (asset: AssetRecord) => void;
  onSelect?: (asset: AssetRecord) => void;
}) {
  return (
    <article className="wb-asset-card">
      <button
        type="button"
        className="wb-asset-card-main"
        onClick={() => onOpen(asset)}
      >
        <div className="wb-asset-card-preview">
          <AssetPreview
            kind={asset.kind}
            content={asset.version?.content}
            summary={asset.summary}
            compact
          />
        </div>
        <div className="wb-asset-card-copy">
          <strong title={asset.name}>{asset.name}</strong>
          <span>
            {assetSourceLabel(asset.sourceType)} · {assetKindLabel(asset.kind)} · v
            {asset.version?.version || 1}
          </span>
        </div>
      </button>
      <div className="wb-asset-card-actions">
        <button type="button" onClick={() => onOpen(asset)} title="查看详情">
          <ExternalLink aria-hidden="true" />
          <span className="sr-only">查看详情</span>
        </button>
        {selectable && onSelect ? (
          <button
            type="button"
            className="is-primary"
            onClick={() => onSelect(asset)}
          >
            <Check aria-hidden="true" />
            使用
          </button>
        ) : null}
      </div>
    </article>
  );
}
