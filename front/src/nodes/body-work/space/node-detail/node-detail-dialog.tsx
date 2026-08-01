import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Copy,
  History,
  Loader2,
  RotateCw,
} from "lucide-react";
import { toast } from "sonner";
import { DetailDialogFrame } from "../../shared/detail-dialog";
import {
  confirmSpaceStoryboard,
  createSpaceStoryboardRevision,
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
import {
  formatNodeDetailVersionTime,
  NodeDetailVersionSelect,
} from "./version-select";
import { NodeDetailRunError } from "./node-detail-run-error";
import { useAssetReferenceProvider } from "../../asset/asset-reference-provider";
import { CanvasAssetReferenceProviderContext } from "../space-reference-editor";
import {
  canvasReferenceContentFromTargets,
  canvasReferenceTargetsFromContent,
} from "../space-reference-content";
import { isVideoComposePowerType } from "../space-power-presentation";
import { VideoComposeView } from "../space-video-compose-view";
import {
  emptyVideoComposition,
  type CanvasVideoComposition,
} from "../space-video-compose";
import {
  isStoryboardConfirmed,
  type StoryboardDocument,
  type StoryboardEditorFocus,
  type StoryboardProductionPlan,
} from "../space-storyboard";
import {
  contentOutputMediaKinds,
  type CanvasContentMediaKind,
} from "../space-content-output";

export function NodeDetailDialog({
  projectId,
  teamId,
  assetCateId,
  node,
  canvasReferenceItems,
  canvasNodes,
  storyboardFocus,
  onNodeDraftChange,
  onRunNode,
  onAssetUpdated,
  onClose,
}: {
  projectId: number;
  teamId: number;
  assetCateId: number;
  node: SpaceCanvasNode;
  canvasReferenceItems?: ComposerAssetItem[];
  canvasNodes?: SpaceCanvasNode[];
  storyboardFocus?: StoryboardEditorFocus;
  onNodeDraftChange?: (draft: SpaceCanvasNode["composerDraft"]) => void;
  onRunNode?: (node: SpaceCanvasNode) => Promise<void>;
  onAssetUpdated?: (asset: ProjectAsset) => void;
  onClose: () => void;
}) {
  const assetReferenceProvider = useAssetReferenceProvider({
    teamID: teamId,
    scopeProjectID: projectId,
    initialFilters: {
      sourceType: "project",
      projectID: projectId,
      assetCateID: assetCateId,
    },
  });
  const assetId = Number(node.asset?.id || 0);
  const isVideoCompose = isVideoComposePowerType(
    node.power,
    node.kind,
    node.outputType,
  );
  const [videoComposition, setVideoComposition] =
    useState<CanvasVideoComposition>(
      () => node.composerDraft?.videoComposition || emptyVideoComposition(),
    );
  const [videoComposeRunning, setVideoComposeRunning] = useState(false);
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
  const [storyboardWorkflowAction, setStoryboardWorkflowAction] = useState<
    "" | "confirming" | "revising" | "reviewing"
  >("");
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
  const revisionRequestRef = useRef<{
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

  const applyMutatedAsset = useCallback((nextAsset: ProjectAsset) => {
    const mergedAsset = mergeProjectAssetVersionHistory(
      nextAsset,
      assetRef.current || nodeRef.current.asset,
    );
    const nextVersionId = currentAssetVersionId(mergedAsset);
    assetRef.current = mergedAsset;
    selectedVersionIdRef.current = nextVersionId;
    setAsset(mergedAsset);
    setSelectedVersionId(nextVersionId);
    setVersions((current) => {
      const merged = mergeAssetVersions(
        mergedAsset.version ? [mergedAsset.version] : [],
        current,
      );
      setVersionTotal((total) => Math.max(total, merged.length));
      return merged;
    });
    setHistoryVersion(null);
    setHistoryError("");
    setContentGeneration((generation) => generation + 1);
    onAssetUpdatedRef.current?.(mergedAsset);
  }, []);

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
    setStoryboardWorkflowAction("");
    revisionRequestRef.current = null;
    setContentGeneration((generation) => generation + 1);
    setVideoComposition(
      node.composerDraft?.videoComposition || emptyVideoComposition(),
    );
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
    () =>
      resolveNodeDetailMediaOutput(node, activeVersion, {
        includeNodeResult: isCurrentVersion,
      }),
    [activeVersion, isCurrentVersion, node],
  );
  const mediaKind = useMemo(() => {
    const kinds = contentOutputMediaKinds(mediaOutput);
    return kinds.length === 1 ? kinds[0] : undefined;
  }, [mediaOutput]);
  const mediaPrompt =
    typeof activeVersion?.source?.prompt === "string"
      ? activeVersion.source.prompt.trim()
      : String(node.composerDraft?.prompt || "").trim();

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
      const nextVersionId = currentAssetVersionId(mergedAsset);
      assetRef.current = mergedAsset;
      selectedVersionIdRef.current = nextVersionId;
      setAsset(mergedAsset);
      setSelectedVersionId(nextVersionId);
      setVersions((current) =>
        mergeAssetVersions(
          current,
          mergedAsset.version ? [mergedAsset.version] : [],
        ),
      );
      if (nextVersionId && nextVersionId !== activeVersionId) {
        setVersionTotal((total) => total + 1);
      }
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

  const confirmStoryboard = useCallback(
    async (
      _storyboard: StoryboardDocument,
      productionPlan: StoryboardProductionPlan,
    ) => {
      if (storyboardWorkflowAction) {
        return false;
      }
      const saved = await draft.flush();
      if (!saved) {
        return false;
      }
      const currentAsset = assetRef.current;
      const versionId = currentAssetVersionId(currentAsset);
      if (!currentAsset?.id || !versionId) {
        toast.error("当前分镜尚未保存，不能确认");
        return false;
      }
      setStoryboardWorkflowAction("confirming");
      try {
        const confirmedAsset = await confirmSpaceStoryboard({
          projectId,
          assetId: currentAsset.id,
          versionId,
          productionPlan,
        });
        applyMutatedAsset(confirmedAsset);
        toast.success("分镜已确认，制作组将按当前版本同步");
        return true;
      } catch (error) {
        toast.error(errorMessage(error, "确认分镜失败"));
        return false;
      } finally {
        setStoryboardWorkflowAction("");
      }
    },
    [applyMutatedAsset, draft.flush, projectId, storyboardWorkflowAction],
  );

  const createStoryboardRevision = useCallback(async () => {
    if (storyboardWorkflowAction) {
      return;
    }
    const currentAsset = assetRef.current;
    const versionId = selectedVersionIdRef.current;
    if (!currentAsset?.id || !versionId) {
      toast.error("当前分镜版本不可用");
      return;
    }
    setStoryboardWorkflowAction("revising");
    try {
      const request =
        revisionRequestRef.current?.versionId === versionId
          ? revisionRequestRef.current
          : {
              versionId,
              requestId: createVersionRequestId("revision", versionId),
            };
      revisionRequestRef.current = request;
      const revisedAsset = await createSpaceStoryboardRevision({
        projectId,
        assetId: currentAsset.id,
        versionId,
        requestId: request.requestId,
        nodeKey: node.id,
      });
      applyMutatedAsset(revisedAsset);
      revisionRequestRef.current = null;
      toast.success("已创建新的分镜修订稿");
      void loadDetail();
    } catch (error) {
      toast.error(errorMessage(error, "创建分镜修订稿失败"));
    } finally {
      setStoryboardWorkflowAction("");
    }
  }, [
    applyMutatedAsset,
    loadDetail,
    node.id,
    projectId,
    storyboardWorkflowAction,
  ]);

  const reviewStoryboard = useCallback(
    async (storyboard: StoryboardDocument) => {
      if (storyboardWorkflowAction || !onRunNode) {
        return;
      }
      const saved = await draft.flush();
      if (!saved) {
        return;
      }
      const prompt = storyboardReviewPrompt(storyboard);
      const referenceTargets = canvasReferenceTargetsFromContent(
        nodeRef.current.composerDraft?.promptContent,
      );
      setStoryboardWorkflowAction("reviewing");
      try {
        const reviewTask = onRunNode({
          ...nodeRef.current,
          composerDraft: {
            ...(nodeRef.current.composerDraft || {}),
            prompt,
            promptContent: referenceTargets.length
              ? canvasReferenceContentFromTargets(prompt, referenceTargets)
              : undefined,
          },
        });
        toast.info("已开始 AI 审查，正在重新生成分镜");
        onClose();
        void reviewTask
          .then(() => {
            toast.success("AI 审查完成，可重新打开分镜确认结果");
          })
          .catch((error) => {
            toast.error(errorMessage(error, "AI 审查分镜失败"));
          });
      } catch (error) {
        setStoryboardWorkflowAction("");
        toast.error(errorMessage(error, "AI 审查分镜失败"));
      }
    },
    [draft.flush, onClose, onRunNode, storyboardWorkflowAction],
  );

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
              requestId: createVersionRequestId("restore", versionId),
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
    const currentAsset = assetRef.current;
    if (
      draft.hasPendingChanges &&
      currentAsset?.id &&
      currentAsset?.version?.id &&
      selectedVersionIdRef.current === currentAssetVersionId(currentAsset)
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
  }, [draft.flush, draft.hasPendingChanges, onClose]);

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

  const activeContent = draft.draft;
  const storyboardConfirmed =
    activeContent.mode === "storyboard" &&
    isStoryboardConfirmed(activeContent.value as StoryboardDocument);
  const readonly =
    !isCurrentVersion ||
    (!isVideoCompose && (!asset?.id || !asset?.version?.id)) ||
    storyboardConfirmed;
  const editorReadonly =
    readonly || closing || (assetId > 0 && versionsLoading);
  const showHistoryState =
    !isCurrentVersion && (historyLoading || historyError);
  return (
    <DetailDialogFrame
      ariaLabel={`${node.title || "节点"}详情`}
      onRequestClose={closeDialog}
      header={
        <NodeDetailHeader
          node={node}
          contentLabel={detailContentLabel(activeContent, node, mediaKind)}
          versionSelect={
            assetId ? (
              <NodeDetailVersionSelect
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
            ) : undefined
          }
          updatedAt={formatNodeDetailVersionTime(
            activeVersion?.updated_at || activeVersion?.created_at,
          )}
          status={draft.status}
          readonly={readonly}
          downloadUrl={activeContent.downloadUrl}
          onRetry={() => void draft.retry()}
          onClose={() => void closeDialog()}
        />
      }
    >
      <main className="wb-detail-workspace">
        {!isCurrentVersion ? (
          <div className="wb-detail-history-bar">
            <span>
              <History size={14} />
              正在查看第 {historyVersion?.version || "-"} 版
            </span>
            <div>
              <button
                type="button"
                className="wb-detail-command"
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
                className="wb-detail-command is-primary"
                disabled={
                  restoring ||
                  Boolean(storyboardWorkflowAction) ||
                  historyLoading ||
                  Boolean(historyError)
                }
                onClick={() =>
                  activeContent.mode === "storyboard"
                    ? void createStoryboardRevision()
                    : void restoreVersion()
                }
              >
                {restoring || storyboardWorkflowAction === "revising" ? (
                  <Loader2 size={13} className="wb-detail-spin" />
                ) : activeContent.mode === "storyboard" ? (
                  <Copy size={13} />
                ) : (
                  <RotateCw size={13} />
                )}
                {activeContent.mode === "storyboard"
                  ? storyboardWorkflowAction === "revising"
                    ? "创建中"
                    : "基于此版本创建修订稿"
                  : restoring
                    ? "切换中"
                    : "切换到此版本"}
              </button>
            </div>
          </div>
        ) : null}

        <div className="wb-detail-scroll">
          <NodeDetailRunError projectId={projectId} node={node} />
          {showHistoryState ? (
            <div className="wb-detail-content-state">
              {historyLoading ? (
                <>
                  <Loader2 size={18} className="wb-detail-spin" />
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
              {isVideoCompose ? (
                <VideoComposeView
                  composition={videoComposition}
                  referenceItems={canvasReferenceItems || []}
                  readonly={!isCurrentVersion || closing || videoComposeRunning}
                  running={videoComposeRunning}
                  fullScreen
                  finalOutput={mediaOutput}
                  onChange={(next) => {
                    setVideoComposition(next);
                    onNodeDraftChange?.({
                      ...(node.composerDraft || {}),
                      videoComposition: next,
                    });
                  }}
                  onRun={
                    onRunNode
                      ? (nextComposition) => {
                          setVideoComposeRunning(true);
                          void onRunNode({
                            ...node,
                            composerDraft: {
                              ...(node.composerDraft || {}),
                              videoComposition: nextComposition,
                            },
                          })
                            .then(() => (assetId ? loadDetail() : undefined))
                            .catch((error) =>
                              toast.error(
                                error instanceof Error
                                  ? error.message
                                  : "视频合成失败",
                              ),
                            )
                            .finally(() => setVideoComposeRunning(false));
                        }
                      : undefined
                  }
                />
              ) : (
                <NodeDetailEditor
                  content={activeContent}
                  mediaOutput={mediaOutput}
                  mediaKind={mediaKind}
                  mediaPrompt={mediaPrompt}
                  readonly={editorReadonly}
                  referenceItems={canvasReferenceItems}
                  canvasNodes={canvasNodes}
                  storyboardSourceNodeId={node.id}
                  storyboardFocus={storyboardFocus}
                  storyboardWorkflowAction={storyboardWorkflowAction}
                  onConfirmStoryboard={confirmStoryboard}
                  onReviewStoryboard={reviewStoryboard}
                  onCreateStoryboardRevision={createStoryboardRevision}
                  onChange={draft.setDraft}
                />
              )}
            </CanvasAssetReferenceProviderContext.Provider>
          )}
        </div>
      </main>

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
    </DetailDialogFrame>
  );
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
  mediaKind?: CanvasContentMediaKind,
) {
  if (content.mode === "storyboard") {
    return "分镜脚本";
  }
  if (isVideoComposePowerType(node.power, node.kind, node.outputType)) {
    return "视频合成";
  }
  if (mediaKind === "image") {
    return "图片内容";
  }
  if (mediaKind === "video") {
    return "视频内容";
  }
  if (mediaKind === "audio") {
    return "音频内容";
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

function storyboardReviewPrompt(storyboard: StoryboardDocument) {
  return [
    "请审查并优化下面这份现有分镜脚本，直接通过 submit_output 返回完整的新分镜，不要输出解释。",
    "必须保持用户已经确定的标题、目标总时长、目标镜头数、画幅、画面类型、参考素材用途和明确剧情约束。",
    "必须保留所有仍代表同一实体的 material、shot、speech、caption 稳定 ID，并原样保留 narrator_voice 与每个角色的 voice。",
    "重点修复：镜头因果不连贯、重复 beat、动作过多或不可生成、人物道具凭空出现、错误的 match_previous/continue_previous、转场滥用、对白越界或重叠。",
    "逐镜检查 continuity_state.entry 与 continuity_state.exit：人物位置和姿态、服装、道具归属与状态、时间、光线、轴线及运动方向必须明确；匹配或延续上一镜时，当前 entry 必须与上一镜 exit 完全一致。",
    "普通新镜头不要引用上一镜；只有需要匹配上一镜结束画面时使用 match_previous，只有同一动作从上一段真实尾帧继续时使用 continue_previous，二者互斥。",
    "确认 target_shot_count 等于 shots 数量，target_duration 等于全部 duration 之和，镜头不超过 50 个。",
    `当前分镜 JSON：${JSON.stringify(storyboard)}`,
  ].join("\n");
}

function createVersionRequestId(action: string, versionId: number) {
  const random =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${action}-${versionId}-${random}`.slice(0, 64);
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}
