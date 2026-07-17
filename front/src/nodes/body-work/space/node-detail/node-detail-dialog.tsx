import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, History, Loader2, RotateCw } from "lucide-react";
import { toast } from "sonner";
import {
  fetchSpaceAssetDetail,
  fetchSpaceAssetVersionDetail,
  fetchSpaceAssetVersions,
  restoreSpaceAssetVersion,
  saveSpaceAssetEditVersion,
} from "../space-api";
import {
  mergeAssetVersions,
  mergeProjectAssetVersionHistory,
} from "../space-assets";
import type { AssetVersion, ProjectAsset, SpaceCanvasNode } from "../types";
import {
  nodeDetailContentFingerprint,
  resolveNodeDetailContent,
  resolveNodeDetailMediaOutput,
  serializeNodeDetailContent,
  type NodeDetailEditableContent,
} from "./node-detail-content";
import { NodeDetailEditor } from "./node-detail-editor";
import type { ComposerAssetItem } from "../space-prompt-composer";
import { NodeDetailHeader } from "./node-detail-header";
import { useNodeDetailDraft } from "./use-node-detail-draft";
import { formatNodeDetailVersionTime, VersionPanel } from "./version-panel";
import { useAssetReferenceProvider } from "../../asset/asset-reference-provider";
import { CanvasAssetReferenceProviderContext } from "../space-reference-editor";

export function NodeDetailDialog({
  projectId,
  teamId,
  assetCateId,
  node,
  canvasReferenceItems,
  onAssetUpdated,
  onClose,
}: {
  projectId: number;
  teamId: number;
  assetCateId: number;
  node: SpaceCanvasNode;
  canvasReferenceItems?: ComposerAssetItem[];
  onAssetUpdated?: (asset: ProjectAsset) => void;
  onClose: () => void;
}) {
  const assetReferenceProvider = useAssetReferenceProvider({
    teamID: teamId,
    initialFilters: {
      sourceType: "project",
      projectID: projectId,
      assetCateID: assetCateId,
    },
  });
  const assetId = Number(node.asset?.id || 0);
  const [asset, setAsset] = useState<ProjectAsset | undefined>(node.asset);
  const [versions, setVersions] = useState<AssetVersion[]>(() =>
    initialVersionItems(node.asset),
  );
  const [versionTotal, setVersionTotal] = useState(versions.length);
  const [versionsPage, setVersionsPage] = useState(1);
  const [hasMoreVersions, setHasMoreVersions] = useState(false);
  const [versionsLoading, setVersionsLoading] = useState(assetId > 0);
  const [versionsLoadingMore, setVersionsLoadingMore] = useState(false);
  const [versionsError, setVersionsError] = useState("");
  const [selectedVersionId, setSelectedVersionId] = useState(() =>
    currentAssetVersionId(node.asset),
  );
  const [historyVersion, setHistoryVersion] = useState<AssetVersion | null>(
    null,
  );
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false);
  const [contentGeneration, setContentGeneration] = useState(0);
  const assetRef = useRef(asset);
  const selectedVersionIdRef = useRef(selectedVersionId);
  const onAssetUpdatedRef = useRef(onAssetUpdated);
  const nodeRef = useRef(node);
  const detailRequestRef = useRef(0);
  const historyRequestRef = useRef(0);
  const restoreRequestRef = useRef<{
    versionId: number;
    requestId: string;
  } | null>(null);
  const closingRef = useRef(false);

  assetRef.current = asset;
  selectedVersionIdRef.current = selectedVersionId;
  onAssetUpdatedRef.current = onAssetUpdated;
  nodeRef.current = node;

  const applyDetail = useCallback(
    (detail: Awaited<ReturnType<typeof fetchSpaceAssetDetail>>) => {
      const mergedAsset = mergeProjectAssetVersionHistory(
        { ...detail.asset, versions: detail.versions },
        assetRef.current || nodeRef.current.asset,
      );
      const currentVersion = mergedAsset.version;
      const nextVersions = mergeAssetVersions(
        currentVersion ? [currentVersion] : [],
        detail.versions,
      );
      const currentVersionId = currentAssetVersionId(mergedAsset);
      assetRef.current = mergedAsset;
      selectedVersionIdRef.current = currentVersionId;
      setAsset(mergedAsset);
      setVersions(nextVersions);
      setVersionTotal(Math.max(detail.versionTotal, nextVersions.length));
      setVersionsPage(1);
      setHasMoreVersions(detail.hasMore);
      setSelectedVersionId(currentVersionId);
      setHistoryVersion(null);
      setHistoryError("");
      setContentGeneration((generation) => generation + 1);
      onAssetUpdatedRef.current?.(mergedAsset);
    },
    [],
  );

  const loadDetail = useCallback(async () => {
    if (!assetId) {
      setVersionsLoading(false);
      setVersionsError("");
      return;
    }
    const request = detailRequestRef.current + 1;
    detailRequestRef.current = request;
    setVersionsLoading(true);
    setVersionsError("");
    try {
      const detail = await fetchSpaceAssetDetail({ projectId, assetId });
      if (request !== detailRequestRef.current) {
        return;
      }
      applyDetail(detail);
    } catch (error) {
      if (request !== detailRequestRef.current) {
        return;
      }
      setVersionsError(errorMessage(error, "读取版本记录失败"));
    } finally {
      if (request === detailRequestRef.current) {
        setVersionsLoading(false);
      }
    }
  }, [applyDetail, assetId, projectId]);

  useEffect(() => {
    assetRef.current = node.asset;
    setAsset(node.asset);
    setVersions(initialVersionItems(node.asset));
    setVersionTotal(initialVersionItems(node.asset).length);
    const currentVersionId = currentAssetVersionId(node.asset);
    selectedVersionIdRef.current = currentVersionId;
    setSelectedVersionId(currentVersionId);
    setHistoryVersion(null);
    setHistoryError("");
    setContentGeneration((generation) => generation + 1);
    void loadDetail();
    return () => {
      detailRequestRef.current += 1;
      historyRequestRef.current += 1;
    };
  }, [loadDetail, node.id]);

  const currentVersionId = currentAssetVersionId(asset);
  const isCurrentVersion =
    !selectedVersionId || selectedVersionId === currentVersionId;
  const activeVersion = isCurrentVersion ? asset?.version : historyVersion;
  const resolvedContent = useMemo(
    () => resolveNodeDetailContent(node, activeVersion),
    [activeVersion, node],
  );
  const mediaOutput = useMemo(
    () => resolveNodeDetailMediaOutput(node, activeVersion),
    [activeVersion, node],
  );

  const saveDraft = useCallback(
    async (content: NodeDetailEditableContent) => {
      const currentAsset = assetRef.current;
      const currentVersion = currentAsset?.version;
      const activeVersionId = currentAssetVersionId(currentAsset);
      if (
        !currentAsset?.id ||
        !currentVersion?.id ||
        selectedVersionIdRef.current !== activeVersionId
      ) {
        throw new Error("当前内容不可编辑");
      }
      const savedAsset = await saveSpaceAssetEditVersion({
        projectId,
        assetId: currentAsset.id,
        versionId: currentVersion.id,
        content: serializeNodeDetailContent(content),
      });
      const mergedAsset = mergeProjectAssetVersionHistory(
        savedAsset,
        currentAsset,
      );
      if (mergedAsset.version) {
        mergedAsset.version = {
          ...mergedAsset.version,
          summary: content.summary,
        };
      }
      assetRef.current = mergedAsset;
      setAsset(mergedAsset);
      setVersions((current) =>
        mergeAssetVersions(
          current,
          mergedAsset.version ? [mergedAsset.version] : [],
        ),
      );
      onAssetUpdatedRef.current?.(mergedAsset);
    },
    [projectId],
  );

  const draft = useNodeDetailDraft({
    value: resolvedContent,
    resetKey: `${node.id}:${selectedVersionId}:${contentGeneration}`,
    fingerprint: nodeDetailContentFingerprint,
    save: saveDraft,
    onError: (error) => toast.error(errorMessage(error, "保存失败")),
  });

  const retryDetail = useCallback(async () => {
    if (selectedVersionIdRef.current === currentVersionId) {
      const saved = await draft.flush();
      if (!saved) {
        return;
      }
    }
    await loadDetail();
  }, [currentVersionId, draft.flush, loadDetail]);

  const loadHistoryVersion = useCallback(
    async (versionId: number) => {
      if (!assetId || !versionId || versionId === currentVersionId) {
        return;
      }
      const request = historyRequestRef.current + 1;
      historyRequestRef.current = request;
      setHistoryLoading(true);
      setHistoryError("");
      setHistoryVersion(null);
      try {
        const version = await fetchSpaceAssetVersionDetail({
          projectId,
          assetId,
          versionId,
        });
        if (
          request !== historyRequestRef.current ||
          selectedVersionIdRef.current !== versionId
        ) {
          return;
        }
        setHistoryVersion(version);
        setContentGeneration((generation) => generation + 1);
      } catch (error) {
        if (request !== historyRequestRef.current) {
          return;
        }
        setHistoryError(errorMessage(error, "读取历史版本失败"));
      } finally {
        if (request === historyRequestRef.current) {
          setHistoryLoading(false);
        }
      }
    },
    [assetId, currentVersionId, projectId],
  );

  const selectVersion = useCallback(
    async (version: AssetVersion) => {
      if (restoring) {
        return;
      }
      const versionId = Number(version.id || 0);
      if (!versionId || versionId === selectedVersionIdRef.current) {
        return;
      }
      if (selectedVersionIdRef.current === currentVersionId) {
        const saved = await draft.flush();
        if (!saved) {
          return;
        }
      }

      selectedVersionIdRef.current = versionId;
      restoreRequestRef.current = null;
      setSelectedVersionId(versionId);
      if (versionId === currentVersionId) {
        historyRequestRef.current += 1;
        setHistoryVersion(null);
        setHistoryError("");
        setHistoryLoading(false);
        setContentGeneration((generation) => generation + 1);
        return;
      }
      await loadHistoryVersion(versionId);
    },
    [currentVersionId, draft.flush, loadHistoryVersion, restoring],
  );

  const loadMoreVersions = useCallback(async () => {
    if (!assetId || !hasMoreVersions || versionsLoadingMore) {
      return;
    }
    setVersionsLoadingMore(true);
    try {
      const result = await fetchSpaceAssetVersions({
        projectId,
        assetId,
        page: versionsPage + 1,
      });
      setVersions((current) => mergeAssetVersions(current, result.items));
      setVersionsPage(result.page);
      setVersionTotal(result.total);
      setHasMoreVersions(result.hasMore);
    } catch (error) {
      toast.error(errorMessage(error, "加载更多版本失败"));
    } finally {
      setVersionsLoadingMore(false);
    }
  }, [assetId, hasMoreVersions, projectId, versionsLoadingMore, versionsPage]);

  const restoreVersion = useCallback(async () => {
    const currentAsset = assetRef.current;
    const versionId = selectedVersionIdRef.current;
    if (
      restoring ||
      !currentAsset?.id ||
      !versionId ||
      versionId === currentAssetVersionId(currentAsset)
    ) {
      return;
    }
    setRestoring(true);
    try {
      const restoreRequest =
        restoreRequestRef.current?.versionId === versionId
          ? restoreRequestRef.current
          : {
              versionId,
              requestId: createRestoreRequestId(versionId),
            };
      restoreRequestRef.current = restoreRequest;
      const restoredAsset = await restoreSpaceAssetVersion({
        projectId,
        assetId: currentAsset.id,
        versionId,
        requestId: restoreRequest.requestId,
        nodeKey: node.id,
      });
      const mergedAsset = mergeProjectAssetVersionHistory(
        restoredAsset,
        currentAsset,
      );
      assetRef.current = mergedAsset;
      setAsset(mergedAsset);
      onAssetUpdatedRef.current?.(mergedAsset);

      try {
        const detail = await fetchSpaceAssetDetail({
          projectId,
          assetId: currentAsset.id,
        });
        applyDetail(detail);
      } catch {
        const restoredVersion = mergedAsset.version;
        setVersions((current) =>
          mergeAssetVersions(restoredVersion ? [restoredVersion] : [], current),
        );
        setVersionTotal((total) => total + 1);
        const nextVersionId = currentAssetVersionId(mergedAsset);
        selectedVersionIdRef.current = nextVersionId;
        setSelectedVersionId(nextVersionId);
        setHistoryVersion(null);
        setHistoryError("");
        setContentGeneration((generation) => generation + 1);
      }
      restoreRequestRef.current = null;
      toast.success("已切换到所选版本");
    } catch (error) {
      toast.error(errorMessage(error, "切换版本失败"));
    } finally {
      setRestoring(false);
    }
  }, [applyDetail, node.id, projectId, restoring]);

  const closeDialog = useCallback(async () => {
    if (closingRef.current) {
      return;
    }
    closingRef.current = true;
    setClosing(true);
    let saved = true;
    if (
      selectedVersionIdRef.current === currentAssetVersionId(assetRef.current)
    ) {
      saved = await draft.flush();
    }
    if (!saved) {
      closingRef.current = false;
      setClosing(false);
      setShowDiscardConfirm(true);
      return;
    }
    onClose();
  }, [draft.flush, onClose]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (showDiscardConfirm) {
          setShowDiscardConfirm(false);
          return;
        }
        void closeDialog();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeDialog, showDiscardConfirm]);

  const readonly = !isCurrentVersion || !asset?.id || !asset?.version?.id;
  const editorReadonly =
    readonly || closing || (assetId > 0 && versionsLoading);
  const activeContent = draft.draft;
  const showHistoryState =
    !isCurrentVersion && (historyLoading || historyError);
  const modal = (
    <div
      className="ws-node-detail-backdrop"
      role="presentation"
      onMouseDown={() => void closeDialog()}
    >
      <section
        className={`ws-node-detail-modal ${assetId ? "has-version-sidebar" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label={`${node.title || "节点"}详情`}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <NodeDetailHeader
          node={node}
          contentLabel={detailContentLabel(activeContent, node)}
          updatedAt={formatNodeDetailVersionTime(
            activeVersion?.updated_at || activeVersion?.created_at,
          )}
          status={draft.status}
          readonly={readonly}
          downloadUrl={activeContent.downloadUrl}
          onRetry={() => void draft.retry()}
          onClose={() => void closeDialog()}
        />

        <main className="ws-node-detail-workspace">
          {!isCurrentVersion ? (
            <div className="ws-node-detail-history-bar">
              <span>
                <History size={14} />
                正在查看第 {historyVersion?.version || "-"} 版
              </span>
              <div>
                <button
                  type="button"
                  onClick={() =>
                    void selectVersion(
                      asset?.version ||
                        ({ id: currentVersionId } as AssetVersion),
                    )
                  }
                >
                  <ArrowLeft size={13} />
                  返回当前版本
                </button>
                <button
                  type="button"
                  className="is-primary"
                  disabled={
                    restoring || historyLoading || Boolean(historyError)
                  }
                  onClick={() => void restoreVersion()}
                >
                  {restoring ? (
                    <Loader2 size={13} className="ws-spin" />
                  ) : (
                    <RotateCw size={13} />
                  )}
                  {restoring ? "切换中" : "切换到此版本"}
                </button>
              </div>
            </div>
          ) : null}

          <div className="ws-node-detail-editor-scroll">
            {showHistoryState ? (
              <div className="ws-node-detail-content-state">
                {historyLoading ? (
                  <>
                    <Loader2 size={18} className="ws-spin" />
                    <span>正在读取历史内容</span>
                  </>
                ) : (
                  <>
                    <span>{historyError}</span>
                    <button
                      type="button"
                      onClick={() => void loadHistoryVersion(selectedVersionId)}
                    >
                      <RotateCw size={13} />
                      重试
                    </button>
                  </>
                )}
              </div>
            ) : (
              <CanvasAssetReferenceProviderContext.Provider
                value={assetReferenceProvider}
              >
                <NodeDetailEditor
                  content={activeContent}
                  mediaOutput={mediaOutput}
                  readonly={editorReadonly}
                  referenceItems={canvasReferenceItems}
                  onChange={draft.setDraft}
                />
              </CanvasAssetReferenceProviderContext.Provider>
            )}
          </div>
        </main>

        {assetId ? (
          <VersionPanel
            versions={versions}
            currentVersionId={currentVersionId}
            selectedVersionId={selectedVersionId || currentVersionId}
            total={versionTotal}
            hasMore={hasMoreVersions}
            loading={versionsLoading}
            loadingMore={versionsLoadingMore}
            error={versionsError}
            onSelect={(version) => void selectVersion(version)}
            onLoadMore={() => void loadMoreVersions()}
            onRetry={() => void retryDetail()}
          />
        ) : null}

        {showDiscardConfirm ? (
          <div className="ws-node-detail-discard-backdrop">
            <div
              className="ws-node-detail-discard-dialog"
              role="alertdialog"
              aria-modal="true"
              aria-label="未保存内容"
            >
              <strong>当前修改尚未保存</strong>
              <p>保存请求失败。可以继续编辑并重试，或放弃本次修改。</p>
              <div>
                <button
                  type="button"
                  onClick={() => setShowDiscardConfirm(false)}
                >
                  继续编辑
                </button>
                <button type="button" className="is-danger" onClick={onClose}>
                  放弃修改
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );

  return typeof document === "undefined"
    ? null
    : createPortal(modal, document.body);
}

function initialVersionItems(asset?: ProjectAsset) {
  return mergeAssetVersions(
    asset?.version ? [asset.version] : [],
    asset?.versions || [],
  );
}

function currentAssetVersionId(asset?: ProjectAsset) {
  return Number(asset?.version_id || asset?.version?.id || 0);
}

function detailContentLabel(
  content: NodeDetailEditableContent,
  node: SpaceCanvasNode,
) {
  if (content.mode === "storyboard") {
    return "分镜脚本";
  }
  if (content.mode === "file") {
    return "文件";
  }
  if (node.kind === "image" || node.kind === "richtext") {
    return "图文内容";
  }
  if (node.kind === "video") {
    return "视频内容";
  }
  if (node.kind === "audio") {
    return "音频内容";
  }
  return content.format === "markdown" ? "Markdown" : "富文本";
}

function createRestoreRequestId(versionId: number) {
  const random =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `restore-${versionId}-${random}`.slice(0, 64);
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}
