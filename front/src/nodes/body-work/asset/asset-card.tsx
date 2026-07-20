import { Check, ExternalLink, Pencil } from "lucide-react";
import { AssetKindIcon, AssetPreview } from "./asset-preview";
import { assetKindLabel, assetSourceLabel } from "./asset-contract";
import type { AssetRecord } from "./asset-types";

export function AssetCard({
  asset,
  selectable = false,
  selected = false,
  onOpen,
  onRename,
  onSelect,
}: {
  asset: AssetRecord;
  selectable?: boolean;
  selected?: boolean;
  onOpen: (asset: AssetRecord) => void;
  onRename: (asset: AssetRecord) => void;
  onSelect?: (asset: AssetRecord) => void;
}) {
  const preview = (
    <AssetPreview
      kind={asset.kind}
      content={asset.version?.content}
      summary={asset.summary}
      compact
    />
  );

  return (
    <article
      className={`wb-asset-card ${selected ? "is-selected" : ""}`.trim()}
    >
      <div className="wb-asset-card-main">
        <div className="wb-asset-card-preview">
          {preview}
          {asset.kind !== "audio" ? (
            <button
              type="button"
              className="wb-asset-card-preview-open"
              onClick={() => onOpen(asset)}
              aria-label={`查看${asset.name}`}
            />
          ) : null}
        </div>
        <button
          type="button"
          className="wb-asset-card-copy"
          onClick={() => onOpen(asset)}
        >
          <strong title={asset.name}>{asset.name}</strong>
          <span>
            {assetSourceLabel(asset.sourceType)} · {assetKindLabel(asset.kind)}
          </span>
        </button>
      </div>
      <span className="wb-asset-card-kind-icon">
        <AssetKindIcon kind={asset.kind} />
      </span>
      <div className="wb-asset-card-actions">
        <button type="button" onClick={() => onRename(asset)} title="修改标题">
          <Pencil aria-hidden="true" />
          <span className="sr-only">修改标题</span>
        </button>
        <button type="button" onClick={() => onOpen(asset)} title="查看详情">
          <ExternalLink aria-hidden="true" />
          <span className="sr-only">查看详情</span>
        </button>
        {selectable && onSelect ? (
          <button
            type="button"
            className={`is-primary ${selected ? "is-selected" : ""}`.trim()}
            onClick={() => onSelect(asset)}
          >
            <Check aria-hidden="true" />
            {selected ? "已选" : "使用"}
          </button>
        ) : null}
      </div>
    </article>
  );
}
