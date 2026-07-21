import {
  Check,
  ExternalLink,
  Loader2,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { AssetKindIcon, AssetPreview } from "./asset-preview";
import {
  assetKindLabel,
  assetSourceLabel,
  type AssetSourceLabels,
} from "./asset-contract";
import type { AssetRecord, AssetView } from "./asset-types";

export function AssetCard({
  asset,
  sourceLabels,
  view = "assets",
  selectable = false,
  selected = false,
  busy = false,
  onOpen,
  onRename,
  onDelete,
  onRestore,
  onSelect,
}: {
  asset: AssetRecord;
  sourceLabels?: AssetSourceLabels;
  view?: AssetView;
  selectable?: boolean;
  selected?: boolean;
  busy?: boolean;
  onOpen: (asset: AssetRecord) => void;
  onRename: (asset: AssetRecord) => void;
  onDelete?: (asset: AssetRecord) => void;
  onRestore?: (asset: AssetRecord) => void;
  onSelect?: (asset: AssetRecord) => void;
}) {
  const inTrash = view === "trash";
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
      className={`wb-asset-card ${selected ? "is-selected" : ""} ${inTrash ? "is-trash" : ""}`.trim()}
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
            {assetSourceLabel(asset.sourceType, sourceLabels)} ·{" "}
            {assetKindLabel(asset.kind)}
          </span>
        </button>
      </div>
      <span className="wb-asset-card-kind-icon">
        <AssetKindIcon kind={asset.kind} />
      </span>
      <div className="wb-asset-card-actions">
        {!inTrash ? (
          <button
            type="button"
            disabled={busy}
            onClick={() => onRename(asset)}
            title="修改标题"
          >
            <Pencil aria-hidden="true" />
            <span className="sr-only">修改标题</span>
          </button>
        ) : null}
        <button type="button" onClick={() => onOpen(asset)} title="查看详情">
          <ExternalLink aria-hidden="true" />
          <span className="sr-only">查看详情</span>
        </button>
        {inTrash && onRestore ? (
          <button
            type="button"
            className="is-restore"
            disabled={busy}
            onClick={() => onRestore(asset)}
            title="恢复资产"
          >
            {busy ? (
              <Loader2 className="is-spinning" aria-hidden="true" />
            ) : (
              <RotateCcw aria-hidden="true" />
            )}
            <span className="sr-only">恢复资产</span>
          </button>
        ) : onDelete ? (
          <button
            type="button"
            className="is-danger"
            disabled={busy}
            onClick={() => onDelete(asset)}
            title="移入回收站"
          >
            {busy ? (
              <Loader2 className="is-spinning" aria-hidden="true" />
            ) : (
              <Trash2 aria-hidden="true" />
            )}
            <span className="sr-only">移入回收站</span>
          </button>
        ) : null}
        {!inTrash && selectable && onSelect ? (
          <button
            type="button"
            className={`is-primary ${selected ? "is-selected" : ""}`.trim()}
            disabled={busy}
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
