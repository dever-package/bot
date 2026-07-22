import {
  Check,
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
import { BodyWorkTooltip } from "../shared/body-work-tooltip";
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
        <BodyWorkTooltip label={asset.name}>
          <button
            type="button"
            className="wb-asset-card-copy"
            onClick={() => onOpen(asset)}
          >
            <strong>{asset.name}</strong>
            <span>
              {assetSourceLabel(asset.sourceType, sourceLabels)} ·{" "}
              {assetKindLabel(asset.kind)}
            </span>
          </button>
        </BodyWorkTooltip>
      </div>
      <span className="wb-asset-card-kind-icon">
        <AssetKindIcon kind={asset.kind} />
      </span>
      <div className="wb-asset-card-actions">
        {!inTrash ? (
          <BodyWorkTooltip label="修改标题">
            <button
              type="button"
              disabled={busy}
              onClick={() => onRename(asset)}
            >
              <Pencil aria-hidden="true" />
              <span className="sr-only">修改标题</span>
            </button>
          </BodyWorkTooltip>
        ) : null}
        {inTrash && onRestore ? (
          <BodyWorkTooltip label="恢复资产">
            <button
              type="button"
              className="is-restore"
              disabled={busy}
              onClick={() => onRestore(asset)}
            >
              {busy ? (
                <Loader2 className="is-spinning" aria-hidden="true" />
              ) : (
                <RotateCcw aria-hidden="true" />
              )}
              <span className="sr-only">恢复资产</span>
            </button>
          </BodyWorkTooltip>
        ) : onDelete ? (
          <BodyWorkTooltip label="移入回收站">
            <button
              type="button"
              className="is-danger"
              disabled={busy}
              onClick={() => onDelete(asset)}
            >
              {busy ? (
                <Loader2 className="is-spinning" aria-hidden="true" />
              ) : (
                <Trash2 aria-hidden="true" />
              )}
              <span className="sr-only">移入回收站</span>
            </button>
          </BodyWorkTooltip>
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
