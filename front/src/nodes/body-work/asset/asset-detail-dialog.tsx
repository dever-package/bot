import {
  Check,
  FileText,
  Loader2,
  MessageSquareMore,
  Pencil,
  RotateCcw,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
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
import type {
  AssetContentSaveMode,
  AssetDetail,
  AssetRecord,
  AssetVersion,
} from "./asset-types";
import { useAssetSourceLabels } from "./asset-source-labels";
import { requestErrorMessage as errorText } from "../shared/api-response";
import {
  contentOutputHasType,
  parseStoryboardGridOutput,
} from "../shared/content-output";
import { StoryboardGridView } from "../shared/storyboard-grid-view";
import { CanvasNodeContentView as StoryboardAssetPreview } from "../space/space-content-view";
import { AssetTextContentEditor } from "../shared/asset-text-content-editor";
import { assetTextContentWithValue } from "../shared/asset-text-content";
import { useAssetTextContentEditing } from "./asset-text-content-editing";
import { TextContentSaveActions } from "../shared/text-content-save-actions";

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

  async function preview(version: AssetVersion) {
    if (versionLoading || version.id === previewVersion?.id) return;
    if (!discardPendingTextChanges()) return;
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
  const editableText = Boolean(
    asset &&
    previewVersion &&
    isCurrent &&
    !isDeleted &&
    (asset.kind === "text" || asset.kind === "richtext") &&
    !storyboardGrid &&
    !hasStoryboard,
  );
  const applySavedTextContent = useCallback(
    (saved: AssetRecord, mode: AssetContentSaveMode) => {
      setError("");
      setDetail((current) => {
        if (!current) return current;
        const savedVersion = saved.version;
        const existed = Boolean(
          savedVersion &&
          current.versions.some((version) => version.id === savedVersion.id),
        );
        const versions = uniqueVersions(
          savedVersion ? [savedVersion, ...current.versions] : current.versions,
        );
        return {
          ...current,
          asset: saved,
          versions,
          versionTotal: Math.max(
            versions.length,
            current.versionTotal + (savedVersion && !existed ? 1 : 0),
          ),
        };
      });
      setPreviewVersion(saved.version);
      onAssetChanged?.(saved);
      toast.success(
        mode === "create_version" ? "已保存为新版本" : "正文已保存",
      );
    },
    [onAssetChanged],
  );
  const contentEditing = useAssetTextContentEditing({
    teamID,
    asset,
    enabled: editableText,
    onSaved: applySavedTextContent,
    onError: (currentError) =>
      setError(errorText(currentError, "保存资产正文失败")),
  });
  const resetContentEditing = contentEditing.reset;
  const hasPendingTextChanges = contentEditing.hasPendingChanges;

  const discardPendingTextChanges = useCallback(() => {
    if (!editableText || !hasPendingTextChanges) return true;
    if (!window.confirm("当前正文尚未保存，确定放弃修改吗？")) return false;
    resetContentEditing();
    setError("");
    return true;
  }, [editableText, hasPendingTextChanges, resetContentEditing]);

  const requestClose = useCallback(() => {
    if (renaming || !discardPendingTextChanges()) return;
    onClose();
  }, [discardPendingTextChanges, onClose, renaming]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || renaming) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      requestClose();
    };
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [renaming, requestClose]);

  return (
    <DetailDialogFrame
      ariaLabel={`${asset?.name || "资产"}详情`}
      onRequestClose={requestClose}
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
                disabled={savingCurrent || contentEditing.status === "saving"}
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
            ) : editableText ? (
              contentEditing.status === "error" ? (
                <button
                  type="button"
                  className="wb-detail-state is-error"
                  onClick={() => void contentEditing.retry()}
                >
                  <RotateCcw size={12} />
                  保存失败
                </button>
              ) : (
                <span className={`wb-detail-state is-${contentEditing.status}`}>
                  {contentEditing.status === "saving" ? (
                    <Loader2 size={12} className="wb-detail-spin" />
                  ) : null}
                  {assetContentSaveStatusLabel(contentEditing.status)}
                </span>
              )
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
                {editableText ? (
                  <TextContentSaveActions
                    status={contentEditing.status}
                    hasPendingChanges={contentEditing.hasPendingChanges}
                    onReset={() => {
                      contentEditing.reset();
                      setError("");
                    }}
                    onSaveAsNewVersion={() =>
                      void contentEditing.saveAsNewVersion()
                    }
                    onSave={() => void contentEditing.flush()}
                  />
                ) : null}
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
          onClose={requestClose}
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
          ) : editableText ? (
            <div className={`wb-detail-editable-content is-${asset.kind}`}>
              {error ? <p className="wb-detail-error-banner">{error}</p> : null}
              <AssetTextContentEditor
                kind={contentEditing.draft.kind}
                value={contentEditing.draft.value}
                contentFormat={contentEditing.draft.contentFormat}
                onChange={(value) =>
                  contentEditing.setDraft((current) =>
                    assetTextContentWithValue(current, value),
                  )
                }
              />
            </div>
          ) : (
            <div className={`wb-detail-readonly-content is-${asset.kind}`}>
              {error ? <p className="wb-detail-error-banner">{error}</p> : null}
              {storyboardGrid ? (
                <StoryboardGridView grid={storyboardGrid} variant="detail" />
              ) : hasStoryboard ? (
                <StoryboardAssetPreview
                  output={previewVersion.content}
                  fallback={previewVersion.summary || asset.summary}
                  emptyText="该版本暂无可预览内容"
                  className="wb-asset-preview-content"
                  markdownClassName="wb-asset-detail-prose"
                  richClassName="wb-asset-detail-prose"
                  mediaLayout="detail"
                />
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
  const seen = new Set<number>();
  return versions.filter((version) => {
    if (seen.has(version.id)) return false;
    seen.add(version.id);
    return true;
  });
}

function assetContentSaveStatusLabel(
  status: "saved" | "dirty" | "saving" | "error",
) {
  if (status === "dirty") return "未保存";
  if (status === "saving") return "保存中";
  return status === "error" ? "保存失败" : "已保存";
}

function sourceLabel(asset: AssetRecord, labels: AssetSourceLabels) {
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
