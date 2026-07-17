import { Check, Loader2, MessageSquareMore, RotateCcw, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  loadAssetDetail,
  loadAssetVersion,
  loadAssetVersions,
  setAssetCurrentVersion,
} from "./asset-api";
import { AssetPreview } from "./asset-preview";
import {
  assetKindLabel,
  assetRoleLabel,
  assetSourceLabel,
} from "./asset-contract";
import type { AssetDetail, AssetRecord, AssetVersion } from "./asset-types";

export function AssetDetailDialog({
  teamID,
  assetID,
  selectable = false,
  onClose,
  onSelect,
  onContinue,
  canContinue,
  onAssetChanged,
}: {
  teamID: number;
  assetID: number;
  selectable?: boolean;
  onClose: () => void;
  onSelect?: (asset: AssetRecord) => void;
  onContinue?: (asset: AssetRecord) => void;
  canContinue?: (asset: AssetRecord) => boolean;
  onAssetChanged?: (asset: AssetRecord) => void;
}) {
  const [detail, setDetail] = useState<AssetDetail | null>(null);
  const [previewVersion, setPreviewVersion] = useState<AssetVersion | null>(null);
  const [loading, setLoading] = useState(true);
  const [versionLoading, setVersionLoading] = useState(0);
  const [savingCurrent, setSavingCurrent] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const next = await loadAssetDetail(teamID, assetID);
      setDetail(next);
      setPreviewVersion(next.asset.version);
    } catch (currentError) {
      setError(errorText(currentError, "加载资产详情失败"));
    } finally {
      setLoading(false);
    }
  }, [assetID, teamID]);

  useEffect(() => {
    void load();
  }, [load]);

  async function preview(version: AssetVersion) {
    if (version.id === detail?.asset.versionID && detail.asset.version) {
      setPreviewVersion(detail.asset.version);
      return;
    }
    setVersionLoading(version.id);
    setError("");
    try {
      setPreviewVersion(
        await loadAssetVersion({ teamID, assetID, versionID: version.id }),
      );
    } catch (currentError) {
      setError(errorText(currentError, "加载资产版本失败"));
    } finally {
      setVersionLoading(0);
    }
  }

  async function loadMoreVersions() {
    if (!detail) return;
    const page = Math.floor(detail.versions.length / 20) + 1;
    setVersionLoading(-1);
    try {
      const result = await loadAssetVersions({
        teamID,
        assetID,
        page,
        pageSize: 20,
      });
      setDetail({
        ...detail,
        versions: uniqueVersions([...detail.versions, ...result.items]),
        versionTotal: result.total,
        hasMore: result.hasMore,
      });
    } catch (currentError) {
      setError(errorText(currentError, "加载资产版本失败"));
    } finally {
      setVersionLoading(0);
    }
  }

  async function makeCurrent() {
    if (!detail || !previewVersion) return;
    setSavingCurrent(true);
    setError("");
    try {
      const asset = await setAssetCurrentVersion({
        teamID,
        assetID,
        versionID: previewVersion.id,
      });
      setDetail({ ...detail, asset });
      setPreviewVersion(asset.version);
      onAssetChanged?.(asset);
    } catch (currentError) {
      setError(errorText(currentError, "设置当前版本失败"));
    } finally {
      setSavingCurrent(false);
    }
  }

  const asset = detail?.asset;
  const isCurrent = Boolean(
    asset && previewVersion && asset.versionID === previewVersion.id,
  );

  return (
    <div
      className="wb-asset-dialog-backdrop"
      role="dialog"
      aria-modal="true"
      onMouseDown={onClose}
    >
      <section
        className="wb-asset-dialog"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="wb-asset-dialog-head">
          <div>
            <h2>{asset?.name || "资产详情"}</h2>
            {asset ? (
              <p>
                {sourceLabel(asset)} · {assetKindLabel(asset.kind)} ·{" "}
                {assetRoleLabel(asset.role)}
              </p>
            ) : null}
          </div>
          <button type="button" onClick={onClose} title="关闭">
            <X aria-hidden="true" />
            <span className="sr-only">关闭</span>
          </button>
        </header>

        {loading ? (
          <div className="wb-asset-dialog-state">
            <Loader2 className="is-spinning" />
          </div>
        ) : !asset || !previewVersion ? (
          <div className="wb-asset-dialog-state">{error || "资产不存在"}</div>
        ) : (
          <div className="wb-asset-dialog-body">
            <main className="wb-asset-dialog-preview">
              <div className="wb-asset-version-bar">
                <div>
                  <strong>版本 {previewVersion.version}</strong>
                  <span>{formatDate(previewVersion.updatedAt)}</span>
                </div>
                <div>
                  {!isCurrent ? (
                    <button
                      type="button"
                      className="wb-asset-current-button"
                      disabled={savingCurrent}
                      onClick={() => void makeCurrent()}
                    >
                      {savingCurrent ? (
                        <Loader2 className="is-spinning" />
                      ) : (
                        <Check />
                      )}
                      设为当前
                    </button>
                  ) : (
                    <span className="wb-asset-current-label">
                      <Check /> 当前版本
                    </span>
                  )}
                  {selectable && onSelect && isCurrent ? (
                    <button
                      type="button"
                      className="wb-asset-use-button"
                      onClick={() => onSelect(asset)}
                    >
                      使用
                    </button>
                  ) : null}
                  {onContinue &&
                  isCurrent &&
                  isContinuable(asset) &&
                  (canContinue?.(asset) ?? true) ? (
                    <button
                      type="button"
                      className="wb-asset-continue-button"
                      onClick={() => onContinue(asset)}
                    >
                      {asset.sourceType === "dialogue" ? (
                        <MessageSquareMore />
                      ) : (
                        <RotateCcw />
                      )}
                      {asset.sourceType === "dialogue" ? "继续对话" : "重新生成"}
                    </button>
                  ) : null}
                </div>
              </div>
              {error ? <p className="wb-asset-error">{error}</p> : null}
              <AssetPreview
                kind={asset.kind}
                content={previewVersion.content}
                summary={previewVersion.summary || asset.summary}
              />
            </main>

            <aside className="wb-asset-version-list" aria-label="资产版本">
              <div className="wb-asset-version-list-head">
                <strong>版本</strong>
                <span>{detail.versionTotal}</span>
              </div>
              <div className="wb-asset-version-items">
                {detail.versions.map((version) => (
                  <button
                    key={version.id}
                    type="button"
                    className={
                      previewVersion.id === version.id ? "is-active" : ""
                    }
                    onClick={() => void preview(version)}
                  >
                    <span>v{version.version}</span>
                    <small>
                      {version.id === asset.versionID ? "当前 · " : ""}
                      {formatDate(version.updatedAt)}
                    </small>
                    {versionLoading === version.id ? (
                      <Loader2 className="is-spinning" />
                    ) : null}
                  </button>
                ))}
              </div>
              {detail.hasMore ? (
                <button
                  type="button"
                  className="wb-asset-more"
                  disabled={versionLoading === -1}
                  onClick={() => void loadMoreVersions()}
                >
                  {versionLoading === -1 ? "加载中" : "加载更多"}
                </button>
              ) : null}
            </aside>
          </div>
        )}
      </section>
    </div>
  );
}

function uniqueVersions(versions: AssetVersion[]) {
  return Array.from(new Map(versions.map((version) => [version.id, version])).values());
}

function sourceLabel(asset: AssetRecord) {
  const prefix = assetSourceLabel(asset.sourceType);
  return asset.sourceName ? `${prefix} / ${asset.sourceName}` : prefix;
}

function isContinuable(asset: AssetRecord) {
  return (
    asset.role === "material" &&
    (asset.sourceType === "tool" || asset.sourceType === "dialogue")
  );
}

function formatDate(value: string) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function errorText(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
