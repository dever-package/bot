import { Check, FileText, Loader2, RotateCcw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  DetailDialogFrame,
  DetailDialogHeader,
  formatDetailVersionTime,
  type DetailDialogLayer,
} from "../shared/detail-dialog";
import { requestErrorMessage as errorText } from "../shared/api-response";
import { AssetKindIcon, AssetPreview } from "./asset-preview";
import { assetKindLabel } from "./asset-contract";
import { findAssetMediaURL } from "./asset-content";
import { loadOfficialMaterialDetail } from "./asset-api";
import type { AssetRecord } from "./asset-types";

export function OfficialMaterialDetailDialog({
  teamID,
  material,
  selectable = false,
  layer = "default",
  onClose,
  onSelect,
}: {
  teamID: number;
  material: AssetRecord;
  selectable?: boolean;
  layer?: DetailDialogLayer;
  onClose: () => void;
  onSelect?: (material: AssetRecord) => void;
}) {
  const [current, setCurrent] = useState(material);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setCurrent(await loadOfficialMaterialDetail(teamID, material.id));
    } catch (currentError) {
      setError(errorText(currentError, "加载官方素材详情失败"));
    } finally {
      setLoading(false);
    }
  }, [material.id, teamID]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      onClose();
    };
    window.addEventListener("keydown", closeOnEscape, true);
    return () => window.removeEventListener("keydown", closeOnEscape, true);
  }, [onClose]);

  const mediaURL = findAssetMediaURL(current.version?.content, current.kind);
  return (
    <DetailDialogFrame
      ariaLabel={`${current.name}详情`}
      onRequestClose={onClose}
      layer={layer}
      header={
        <DetailDialogHeader
          icon={
            current ? (
              <AssetKindIcon kind={current.kind} />
            ) : (
              <FileText size={16} />
            )
          }
          title={current.name || "官方素材详情"}
          subtitle={`官方参考 · ${assetKindLabel(current.kind)}${
            current.materialCateName ? ` · ${current.materialCateName}` : ""
          }`}
          state={<span className="wb-detail-state">官方只读</span>}
          updatedAt={formatDetailVersionTime(current.createdAt)}
          downloadUrl={mediaURL || undefined}
          actions={
            selectable && onSelect && !loading && !error ? (
              <button
                type="button"
                className="wb-detail-command is-primary"
                onClick={() => onSelect(current)}
              >
                <Check size={14} />
                <span>使用</span>
              </button>
            ) : undefined
          }
          onClose={onClose}
        />
      }
    >
      <main className="wb-detail-workspace">
        <div className="wb-detail-scroll">
          {loading ? (
            <div className="wb-detail-content-state">
              <Loader2 size={18} className="wb-detail-spin" />
              <span>正在读取官方素材</span>
            </div>
          ) : error ? (
            <div className="wb-detail-content-state is-error">
              <span>{error}</span>
              <button type="button" onClick={() => void load()}>
                <RotateCcw size={13} />
                重试
              </button>
            </div>
          ) : (
            <div className={`wb-detail-readonly-content is-${current.kind}`}>
              <AssetPreview
                kind={current.kind}
                content={current.version?.content}
                summary={current.summary}
              />
            </div>
          )}
        </div>
      </main>
    </DetailDialogFrame>
  );
}
