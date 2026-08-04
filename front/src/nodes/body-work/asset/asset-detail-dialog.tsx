import {
  Check,
  FileText,
  Loader2,
  MessageSquareMore,
  Pencil,
  RotateCcw,
} from "lucide-react";
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DetailDialogFrame,
  DetailDialogHeader,
  DetailVersionSelect,
  formatDetailVersionTime,
  type DetailDialogLayer,
} from "../shared/detail-dialog";
import {
  loadAssetDetail,
  loadAssetVersion,
  loadAssetVersions,
  setAssetCurrentVersion,
} from "./asset-api";
import { AssetKindIcon, AssetPreview } from "./asset-preview";
import { assetVersionPrompt } from "./asset-content";
import { AssetRenameDialog } from "./asset-rename-dialog";
import {
  assetKindLabel,
  assetRoleLabel,
  assetSourceLabel,
  type AssetSourceLabels,
} from "./asset-contract";
import type { AssetDetail, AssetRecord, AssetVersion } from "./asset-types";
import { useAssetSourceLabels } from "./asset-source-labels";
import { requestErrorMessage as errorText } from "../shared/api-response";
import {
  contentOutputHasType,
  parseStoryboardGridOutput,
} from "../shared/content-output";
import { StoryboardGridView } from "../shared/storyboard-grid-view";

const StoryboardAssetPreview = lazy(() =>
  import("../space/space-content-view").then((module) => ({
    default: module.CanvasNodeContentView,
  })),
);

export function AssetDetailDialog({
  teamID,
  assetID,
  selectable = false,
  onClose,
  onSelect,
  onContinue,
  canContinue,
  onAssetChanged,
  layer = "default",
}: {
  teamID: number;
  assetID: number;
  selectable?: boolean;
  onClose: () => void;
  onSelect?: (asset: AssetRecord) => void;
  onContinue?: (asset: AssetRecord) => void;
  canContinue?: (asset: AssetRecord) => boolean;
  onAssetChanged?: (asset: AssetRecord) => void;
  layer?: DetailDialogLayer;
}) {
  const sourceLabels = useAssetSourceLabels();
  const [detail, setDetail] = useState<AssetDetail | null>(null);
  const [previewVersion, setPreviewVersion] = useState<AssetVersion | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [versionLoading, setVersionLoading] = useState(0);
  const [savingCurrent, setSavingCurrent] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [error, setError] = useState("");
  const [versionsError, setVersionsError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    setVersionsError("");
    try {
      const next = withCurrentVersion(await loadAssetDetail(teamID, assetID));
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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || renaming) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      onClose();
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [onClose, renaming]);

  async function preview(version: AssetVersion) {
    if (versionLoading || version.id === previewVersion?.id) return;
    if (version.id === detail?.asset.versionID && detail.asset.version) {
      setError("");
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
    if (!detail || !detail.hasMore || versionLoading) return;
    const page = Math.floor(detail.versions.length / 20) + 1;
    setVersionLoading(-1);
    setVersionsError("");
    try {
      const result = await loadAssetVersions({
        teamID,
        assetID,
        page,
        pageSize: 20,
      });
      setDetail((current) =>
        current
          ? {
              ...current,
              versions: uniqueVersions([...current.versions, ...result.items]),
              versionTotal: result.total,
              hasMore: result.hasMore,
            }
          : current,
      );
    } catch (currentError) {
      setVersionsError(errorText(currentError, "加载资产版本失败"));
    } finally {
      setVersionLoading(0);
    }
  }

  async function makeCurrent() {
    if (!detail || !previewVersion || savingCurrent) return;
    setSavingCurrent(true);
    setError("");
    try {
      const asset = await setAssetCurrentVersion({
        teamID,
        assetID,
        versionID: previewVersion.id,
      });
      const nextDetail = withCurrentVersion({ ...detail, asset });
      setDetail(nextDetail);
      setPreviewVersion(asset.version);
      onAssetChanged?.(asset);
    } catch (currentError) {
      setError(errorText(currentError, "设置当前版本失败"));
    } finally {
      setSavingCurrent(false);
    }
  }

  const asset = detail?.asset;
  const isDeleted = asset?.status === "deleted";
  const isCurrent = Boolean(
    asset && previewVersion && asset.versionID === previewVersion.id,
  );
  const storyboardGrid = useMemo(
    () => parseStoryboardGridOutput(previewVersion?.content),
    [previewVersion?.content],
  );
  const hasStoryboard = useMemo(
    () => contentOutputHasType(previewVersion?.content, "storyboard"),
    [previewVersion?.content],
  );

  return (
    <DetailDialogFrame
      ariaLabel={`${asset?.name || "资产"}详情`}
      onRequestClose={onClose}
      layer={layer}
      header={
        <DetailDialogHeader
          icon={
            asset ? <AssetKindIcon kind={asset.kind} /> : <FileText size={16} />
          }
          title={asset?.name || "资产详情"}
          subtitle={
            asset
              ? `${sourceLabel(asset, sourceLabels)} · ${assetKindLabel(asset.kind)} · ${assetRoleLabel(asset.role)}`
              : ""
          }
          versionSelect={
            detail && asset && previewVersion ? (
              <DetailVersionSelect
                options={detail.versions.map((version) => ({
                  id: version.id,
                  version: version.version,
                  updatedAt: version.updatedAt || version.createdAt,
                  value: version,
                }))}
                currentVersionId={asset.versionID}
                selectedVersionId={previewVersion.id}
                total={detail.versionTotal}
                hasMore={detail.hasMore}
                loading={versionLoading > 0}
                loadingMore={versionLoading === -1}
                error={versionsError}
                disabled={savingCurrent}
                onSelect={(version) => void preview(version)}
                onLoadMore={() => void loadMoreVersions()}
                onRetry={() => void loadMoreVersions()}
              />
            ) : undefined
          }
          state={
            isDeleted ? (
              <span className="wb-detail-state">回收站</span>
            ) : versionLoading > 0 ? (
              <span className="wb-detail-state is-saving">
                <Loader2 size={12} className="wb-detail-spin" />
                读取中
              </span>
            ) : (
              <span className="wb-detail-state">只读预览</span>
            )
          }
          updatedAt={formatDetailVersionTime(
            previewVersion?.updatedAt || previewVersion?.createdAt,
          )}
          actions={
            asset && previewVersion && !isDeleted ? (
              <>
                <button
                  type="button"
                  className="wb-detail-command"
                  onClick={() => setRenaming(true)}
                >
                  <Pencil size={13} />
                  <span>修改标题</span>
                </button>
                {isCurrent ? (
                  <AssetDetailActions
                    asset={asset}
                    selectable={selectable}
                    onSelect={onSelect}
                    onContinue={onContinue}
                    canContinue={canContinue}
                  />
                ) : (
                  <AssetVersionActions
                    currentVersion={asset.version}
                    loading={Boolean(versionLoading)}
                    saving={savingCurrent}
                    onReturn={(version) => void preview(version)}
                    onMakeCurrent={() => void makeCurrent()}
                  />
                )}
              </>
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
              <span>正在读取资产</span>
            </div>
          ) : !asset || !previewVersion ? (
            <div className="wb-detail-content-state is-error">
              <span>{error || "资产不存在"}</span>
              <button type="button" onClick={() => void load()}>
                <RotateCcw size={13} />
                重试
              </button>
            </div>
          ) : (
            <div className={`wb-detail-readonly-content is-${asset.kind}`}>
              {error ? <p className="wb-detail-error-banner">{error}</p> : null}
              {storyboardGrid ? (
                <StoryboardGridView grid={storyboardGrid} variant="detail" />
              ) : hasStoryboard ? (
                <Suspense
                  fallback={
                    <div className="wb-detail-content-state" aria-busy="true">
                      <Loader2 size={18} className="wb-detail-spin" />
                      <span>正在准备分镜预览</span>
                    </div>
                  }
                >
                  <StoryboardAssetPreview
                    output={previewVersion.content}
                    fallback={previewVersion.summary || asset.summary}
                    emptyText="该版本暂无可预览内容"
                    className="wb-asset-preview-content"
                    markdownClassName="wb-asset-detail-prose"
                    richClassName="wb-asset-detail-prose"
                    mediaLayout="detail"
                  />
                </Suspense>
              ) : (
                <AssetPreview
                  key={previewVersion.id}
                  kind={asset.kind}
                  content={previewVersion.content}
                  summary={previewVersion.summary || asset.summary}
                  prompt={assetVersionPrompt(previewVersion)}
                />
              )}
            </div>
          )}
        </div>
      </main>
      <AssetRenameDialog
        teamID={teamID}
        asset={renaming ? asset || null : null}
        onClose={() => setRenaming(false)}
        onRenamed={(renamed) => {
          setDetail((current) =>
            current ? { ...current, asset: renamed } : current,
          );
          onAssetChanged?.(renamed);
        }}
      />
    </DetailDialogFrame>
  );
}

function AssetVersionActions({
  currentVersion,
  loading,
  saving,
  onReturn,
  onMakeCurrent,
}: {
  currentVersion: AssetVersion | null;
  loading: boolean;
  saving: boolean;
  onReturn: (version: AssetVersion) => void;
  onMakeCurrent: () => void;
}) {
  const disabled = loading || saving;
  return (
    <>
      {currentVersion ? (
        <button
          type="button"
          className="wb-detail-command"
          disabled={disabled}
          onClick={() => onReturn(currentVersion)}
        >
          <RotateCcw size={13} />
          <span>返回当前版本</span>
        </button>
      ) : null}
      <button
        type="button"
        className="wb-detail-command is-primary"
        disabled={disabled}
        onClick={onMakeCurrent}
      >
        {saving ? (
          <Loader2 size={13} className="wb-detail-spin" />
        ) : (
          <Check size={13} />
        )}
        <span>{saving ? "设置中" : "设为当前版本"}</span>
      </button>
    </>
  );
}

function AssetDetailActions({
  asset,
  selectable,
  onSelect,
  onContinue,
  canContinue,
}: {
  asset: AssetRecord;
  selectable: boolean;
  onSelect?: (asset: AssetRecord) => void;
  onContinue?: (asset: AssetRecord) => void;
  canContinue?: (asset: AssetRecord) => boolean;
}) {
  return (
    <>
      {onContinue && isContinuable(asset) && (canContinue?.(asset) ?? true) ? (
        <button
          type="button"
          className="wb-detail-command"
          onClick={() => onContinue(asset)}
        >
          {asset.sourceType === "dialogue" ? (
            <MessageSquareMore size={14} />
          ) : (
            <RotateCcw size={14} />
          )}
          <span>
            {asset.sourceType === "dialogue" ? "继续对话" : "重新生成"}
          </span>
        </button>
      ) : null}
      {selectable && onSelect ? (
        <button
          type="button"
          className="wb-detail-command is-primary"
          onClick={() => onSelect(asset)}
        >
          <Check size={14} />
          <span>使用</span>
        </button>
      ) : null}
    </>
  );
}

function withCurrentVersion(detail: AssetDetail): AssetDetail {
  const versions = uniqueVersions(
    detail.asset.version
      ? [detail.asset.version, ...detail.versions]
      : detail.versions,
  );
  return {
    ...detail,
    versions,
    versionTotal: Math.max(detail.versionTotal, versions.length),
  };
}

function uniqueVersions(versions: AssetVersion[]) {
  return Array.from(
    new Map(versions.map((version) => [version.id, version])).values(),
  );
}

function sourceLabel(
  asset: AssetRecord,
  labels: AssetSourceLabels,
) {
  const prefix = assetSourceLabel(asset.sourceType, labels);
  return asset.sourceName && asset.sourceName !== prefix
    ? `${prefix} / ${asset.sourceName}`
    : prefix;
}

function isContinuable(asset: AssetRecord) {
  return (
    asset.role === "material" &&
    (asset.sourceType === "tool" || asset.sourceType === "dialogue")
  );
}
