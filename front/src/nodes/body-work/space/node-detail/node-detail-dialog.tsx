import { SpaceOperationError } from "../space-operation-error";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrowLeft, Copy, History, Loader2, RotateCw } from "lucide-react";
import {
  DetailDialogFrame,
  type DetailDialogLayer,
} from "../../shared/detail-dialog";
import { requestErrorMessage as errorMessage } from "../../shared/api-response";
import { TextContentSaveActions } from "../../shared/text-content-save-actions";
import {
  createSpaceStoryboardRevision,
  fetchSpacePowerForm,
  fetchSpaceAssetDetail,
  fetchSpaceAssetVersionDetail,
  fetchSpaceAssetVersions,
  generateSpaceStoryboardShot,
  restoreSpaceAssetVersion,
  saveSpaceAssetEditVersion,
} from "../space-api";
import {
  mergeAssetVersions,
  mergeProjectAssetVersionHistory,
} from "../space-assets";
import type {
  AssetVersion,
  ComposerAssetItem,
  ProjectAsset,
  PowerForm,
  SpaceCanvasNode,
} from "../types";
import {
  nodeDetailContentFingerprint,
  resolveNodeDetailContent,
  resolveNodeDetailMediaOutput,
  serializeNodeDetailContent,
  type NodeDetailEditableContent,
} from "./node-detail-content";
import { NodeDetailHeader } from "./node-detail-header";
import { useNodeDetailDraft } from "./use-node-detail-draft";
import {
  formatNodeDetailVersionTime,
  NodeDetailVersionSelect,
} from "./version-select";
import { NodeDetailRunError } from "./node-detail-run-error";
import { useAssetReferenceProvider } from "../../asset/asset-reference-provider";
import { CanvasAssetReferenceProviderContext } from "../space-reference-provider-context";
import {
  isStoryboardPowerType,
  isWritingPowerType,
  isVideoComposePowerType,
} from "../../shared/power-presentation";
import type { CanvasConnectedMediaReference } from "../space-media-references";
import {
  emptyVideoComposition,
  type CanvasVideoComposition,
} from "../space-video-compose";
import {
  isStoryboardConfirmed,
  type StoryboardDocument,
  type StoryboardEditorFocus,
} from "../space-storyboard";
import {
  contentOutputMediaKinds,
  type ContentMediaKind,
} from "../../shared/content-output";
import { CanvasModuleLoading } from "../space-loading";
import type { StoryboardWorkspaceData } from "../space-node-runtime";
import {
  createPreloadableComponent,
  createPreloadableModule,
} from "../../../shared/preloadable";
import { writingSnapshotFromNode } from "../../writing/writing-document";
import { canOpenWritingWorkspace } from "../../writing/writing-workspace";
import "./node-detail.css";

const nodeDetailEditorModule = createPreloadableModule(
  () => import("./node-detail-editor"),
);
const nodeDetailEditor = createPreloadableComponent(
  nodeDetailEditorModule,
  (module) => module.NodeDetailEditor,
);
const NodeDetailEditor = nodeDetailEditor.Component;

const videoComposeViewModule = createPreloadableModule(
  () => import("../space-video-compose-view"),
);
const videoComposeView = createPreloadableComponent(
  videoComposeViewModule,
  (module) => module.VideoComposeView,
);
const VideoComposeView = videoComposeView.Component;

type NodeDetailDialogProps = Parameters<typeof StandardNodeDetailDialog>[0] & {
  readonly?: boolean;
};

export function NodeDetailDialog(props: NodeDetailDialogProps) {
  if (
    isWritingPowerType(
      props.node.power,
      props.node.kind,
      props.node.outputType,
    )
  ) {
    if (
      !canOpenWritingWorkspace(
        writingSnapshotFromNode(props.node, props.node.resultOutput)?.document,
      )
    )
      return null;
    return (
      <Suspense fallback={<CanvasModuleLoading label="正在加载创作工作区" />}>
        <WritingEditor
          key={props.node.id}
          projectId={props.projectId}
          canvasId={props.node.asset?.canvas_id || 0}
          node={props.node}
          output={props.node.resultOutput}
          onAssetUpdated={props.onAssetUpdated}
          readonly={props.readonly}
          onClose={props.onClose}
        />
      </Suspense>
    );
  }
  return <StandardNodeDetailDialog {...props} />;
}

const writingEditor = createPreloadableComponent(
  createPreloadableModule(() => import("../../writing/writing-editor")),
  (module) => module.WritingEditor,
);
const WritingEditor = writingEditor.Component;

function StandardNodeDetailDialog({
  projectId,
  teamId,
  assetCateId,
  node,
  canvasReferenceItems,
  canvasNodes,
  connectedMediaReferences,
  storyboardFocus,
  storyboardInitialSectionId,
  storyboardWorkspace,
  onNodeDraftChange,
  onConnectedMediaEdgeRemove,
  onRunNode,
  onAssetUpdated,
  onConfirmStoryboard,
  onClose,
  layer,
}: {
  projectId: number;
  teamId: number;
  assetCateId: number;
  node: SpaceCanvasNode;
  canvasReferenceItems?: ComposerAssetItem[];
  canvasNodes?: SpaceCanvasNode[];
  connectedMediaReferences?: CanvasConnectedMediaReference[];
  storyboardFocus?: StoryboardEditorFocus;
  storyboardInitialSectionId?: string;
  storyboardWorkspace?: StoryboardWorkspaceData;
  onNodeDraftChange?: (draft: SpaceCanvasNode["composerDraft"]) => void;
  onConnectedMediaEdgeRemove?: (edgeId: string) => void;
  onRunNode?: (node: SpaceCanvasNode) => Promise<void>;
  onAssetUpdated?: (asset: ProjectAsset) => void;
  onConfirmStoryboard?: (onConfirmed: (asset: ProjectAsset) => void) => void;
  onClose: () => void;
  layer?: DetailDialogLayer;
}) {
  const [operationError, setOperationError] = useState("");
  const assetReferenceProvider = useAssetReferenceProvider({
    notificationMode: "inline",
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
  const isStoryboard = isStoryboardPowerType(
    node.power,
    node.kind,
    node.outputType,
  );
  const [storyboardPowerForm, setStoryboardPowerForm] =
    useState<PowerForm | null>(null);
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
    "" | "confirming" | "revising"
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
  const textVersionRequestRef = useRef<{
    versionId: number;
    fingerprint: string;
    requestId: string;
  } | null>(null);
  const closingRef = useRef(false);

  assetRef.current = asset;
  selectedVersionIdRef.current = selectedVersionId;
  onAssetUpdatedRef.current = onAssetUpdated;
  nodeRef.current = node;

  useEffect(() => {
    if (!isStoryboard || (!node.power?.id && !node.power?.key)) {
      setStoryboardPowerForm(null);
      return;
    }
    let canceled = false;
    setStoryboardPowerForm(null);
    void fetchSpacePowerForm({
      projectId,
      flowId: Number(node.flow?.id || 0),
      powerId: Number(node.power?.id || 0),
      powerKey: String(node.power?.key || ""),
      targetId: Number(node.composerDraft?.selectedTargetId || 0),
    })
      .then((form) => {
        if (!canceled) {
          setStoryboardPowerForm(form);
        }
      })
      .catch((error) => {
        if (!canceled) {
          setOperationError(errorMessage(error, "加载分镜用途配置失败"));
        }
      });
    return () => {
      canceled = true;
    };
  }, [
    isStoryboard,
    node.composerDraft?.selectedTargetId,
    node.flow?.id,
    node.id,
    node.power?.id,
    node.power?.key,
    projectId,
  ]);

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

  const applyMutatedAsset = useCallback(
    (nextAsset: ProjectAsset, notifyParent = true) => {
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
      if (notifyParent) onAssetUpdatedRef.current?.(mergedAsset);
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
    () => resolveNodeDetailContent(node, activeVersion, asset?.kind),
    [activeVersion, asset?.kind, node],
  );
  const explicitTextSave = Boolean(
    isCurrentVersion &&
    resolvedContent.mode === "rich" &&
    (asset?.kind === "text" || asset?.kind === "richtext"),
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
    async (
      content: NodeDetailEditableContent,
      options: {
        saveMode?: "overwrite_current" | "create_version";
        requestId?: string;
      } = {},
    ) => {
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
        expectedUpdatedAt:
          content.mode === "storyboard" || options.saveMode !== undefined
            ? currentVersion.updated_at || currentVersion.created_at || ""
            : undefined,
        requestId: options.requestId,
        saveMode: options.saveMode,
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
    save: (content) =>
      saveDraft(
        content,
        explicitTextSave ? { saveMode: "overwrite_current" } : undefined,
      ),
    onError: (error) => setOperationError(errorMessage(error, "保存失败")),
    autoSave: !explicitTextSave,
  });

  const saveTextContent = useCallback(async () => {
    const saved = await draft.flush();
    if (saved) {
      textVersionRequestRef.current = null;
    }
  }, [draft.flush]);

  const saveTextAsNewVersion = useCallback(async () => {
    const currentAsset = assetRef.current;
    const currentVersion = currentAsset?.version;
    if (!currentAsset?.id || !currentVersion?.id) {
      setOperationError("当前资产版本不可用");
      return;
    }
    const fingerprint = nodeDetailContentFingerprint(draft.draft);
    const request =
      textVersionRequestRef.current?.versionId === currentVersion.id &&
      textVersionRequestRef.current.fingerprint === fingerprint
        ? textVersionRequestRef.current
        : {
            versionId: currentVersion.id,
            fingerprint,
            requestId: createVersionRequestId("manual-edit", currentVersion.id),
          };
    textVersionRequestRef.current = request;
    const saved = await draft.flushWith((content) =>
      saveDraft(content, {
        saveMode: "create_version",
        requestId: request.requestId,
      }),
    );
    if (saved) {
      textVersionRequestRef.current = null;
    }
  }, [draft.draft, draft.flushWith, saveDraft]);

  const discardExplicitTextDraft = useCallback(() => {
    if (!explicitTextSave || !draft.hasPendingChanges) {
      return true;
    }
    if (!window.confirm("当前正文尚未保存，确定放弃修改吗？")) {
      return false;
    }
    textVersionRequestRef.current = null;
    draft.reset();
    return true;
  }, [draft.hasPendingChanges, draft.reset, explicitTextSave]);

  const openStoryboardConfirmation = useCallback(async () => {
    if (storyboardWorkflowAction || !onConfirmStoryboard) {
      return;
    }
    setStoryboardWorkflowAction("confirming");
    try {
      if (await draft.flush()) {
        const detailRequest = detailRequestRef.current;
        const historyRequest = historyRequestRef.current;
        const nodeId = nodeRef.current.id;
        const versionId = selectedVersionIdRef.current;
        onConfirmStoryboard((confirmedAsset) => {
          // 确认期间详情可能已关闭或切换，画布仍由父层同步。
          if (
            detailRequest !== detailRequestRef.current ||
            historyRequest !== historyRequestRef.current ||
            nodeId !== nodeRef.current.id ||
            versionId !== selectedVersionIdRef.current
          ) {
            return;
          }
          applyMutatedAsset(confirmedAsset, false);
        });
      }
    } finally {
      setStoryboardWorkflowAction("");
    }
  }, [
    applyMutatedAsset,
    draft.flush,
    onConfirmStoryboard,
    storyboardWorkflowAction,
  ]);

  const createStoryboardRevision = useCallback(async () => {
    if (storyboardWorkflowAction) {
      return;
    }
    const currentAsset = assetRef.current;
    const versionId = selectedVersionIdRef.current;
    if (!currentAsset?.id || !versionId) {
      setOperationError("当前分镜版本不可用");
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

      void loadDetail();
    } catch (error) {
      setOperationError(errorMessage(error, "创建分镜修订稿失败"));
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

  const generateStoryboardShot = useCallback(
    async (
      storyboard: StoryboardDocument,
      shotId: string,
      instruction: string,
    ) => {
      const currentAsset = assetRef.current;
      const currentNode = nodeRef.current;
      const versionId = currentAssetVersionId(currentAsset);
      const powerId = Number(currentNode.power?.id || 0);
      const powerKey = String(currentNode.power?.key || "").trim();
      if (!currentAsset?.id || !versionId) {
        throw new Error("当前分镜尚未保存，不能生成镜头");
      }
      if (!powerId && !powerKey) {
        throw new Error("当前分镜节点未配置生成能力");
      }
      return generateSpaceStoryboardShot({
        projectId,
        assetId: currentAsset.id,
        versionId,
        flowId: Number(currentNode.flow?.id || currentAsset.flow_id || 0),
        assetCateId: Number(
          currentNode.assetCateId || currentAsset.asset_cate_id || assetCateId,
        ),
        requestId: createVersionRequestId("shot", versionId),
        nodeKey: currentNode.id,
        nodeName: currentNode.title,
        powerId,
        powerKey,
        sourceTargetId: Number(
          currentNode.composerDraft?.selectedTargetId || 0,
        ),
        params: currentNode.composerDraft?.paramValues || {},
        storyboard,
        shotId,
        instruction,
      });
    },
    [assetCateId, projectId],
  );

  const retryDetail = useCallback(async () => {
    if (selectedVersionIdRef.current === currentVersionId) {
      if (explicitTextSave) {
        if (!discardExplicitTextDraft()) return;
      } else {
        const saved = await draft.flush();
        if (!saved) return;
      }
    }
    await loadDetail();
  }, [
    currentVersionId,
    discardExplicitTextDraft,
    draft.flush,
    explicitTextSave,
    loadDetail,
  ]);

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
        if (explicitTextSave) {
          if (!discardExplicitTextDraft()) return;
        } else {
          const saved = await draft.flush();
          if (!saved) return;
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
    [
      currentVersionId,
      discardExplicitTextDraft,
      draft.flush,
      explicitTextSave,
      loadHistoryVersion,
      restoring,
    ],
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
      setOperationError(errorMessage(error, "加载更多版本失败"));
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
    } catch (error) {
      setOperationError(errorMessage(error, "切换版本失败"));
    } finally {
      setRestoring(false);
    }
  }, [applyDetail, node.id, projectId, restoring]);

  const closeDialog = useCallback(async () => {
    if (closingRef.current) {
      return;
    }
    if (explicitTextSave && draft.hasPendingChanges) {
      setShowDiscardConfirm(true);
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
  }, [draft.flush, draft.hasPendingChanges, explicitTextSave, onClose]);

  const activeContent = draft.draft;
  const storyboardConfirmed =
    activeContent.mode === "storyboard" &&
    isStoryboardConfirmed(activeContent.value as StoryboardDocument);
  const readonly =
    !isCurrentVersion ||
    (!isVideoCompose && (!asset?.id || !asset?.version?.id)) ||
    storyboardConfirmed;
  const editorReadonly =
    readonly ||
    closing ||
    (assetId > 0 && versionsLoading) ||
    (isStoryboard && !storyboardPowerForm);
  const showHistoryState =
    !isCurrentVersion && (historyLoading || historyError);
  return (
    <DetailDialogFrame
      ariaLabel={`${node.title || "节点"}详情`}
      layer={layer}
      onRequestClose={closeDialog}
      onEscape={() => {
        if (showDiscardConfirm) setShowDiscardConfirm(false);
        else return closeDialog();
      }}
      header={
        <NodeDetailHeader
          node={node}
          contentLabel={detailContentLabel(
            activeContent,
            node,
            explicitTextSave ? undefined : mediaKind,
          )}
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
          actions={
            explicitTextSave && !readonly ? (
              <TextContentSaveActions
                status={draft.status}
                hasPendingChanges={draft.hasPendingChanges}
                onReset={() => {
                  textVersionRequestRef.current = null;
                  draft.reset();
                }}
                onSaveAsNewVersion={() => void saveTextAsNewVersion()}
                onSave={() => void saveTextContent()}
              />
            ) : undefined
          }
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
          <SpaceOperationError
            message={operationError}
            onDismiss={() => setOperationError("")}
          />
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
              <Suspense
                fallback={
                  <CanvasModuleLoading
                    label={
                      isVideoCompose ? "正在加载视频合成" : "正在加载节点内容"
                    }
                  />
                }
              >
                {isVideoCompose ? (
                  <VideoComposeView
                    composition={videoComposition}
                    referenceItems={canvasReferenceItems || []}
                    connectedMediaReferences={connectedMediaReferences}
                    readonly={
                      !isCurrentVersion || closing || videoComposeRunning
                    }
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
                    onConnectedMediaEdgeRemove={onConnectedMediaEdgeRemove}
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
                                setOperationError(
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
                    assetKind={asset?.kind || node.kind}
                    mediaOutput={explicitTextSave ? undefined : mediaOutput}
                    mediaKind={explicitTextSave ? undefined : mediaKind}
                    mediaPrompt={mediaPrompt}
                    readonly={editorReadonly}
                    referenceItems={canvasReferenceItems}
                    canvasNodes={canvasNodes}
                    storyboardSourceNodeId={node.id}
                    storyboardFocus={storyboardFocus}
                    storyboardInitialSectionId={storyboardInitialSectionId}
                    storyboardWorkspace={storyboardWorkspace}
                    storyboardWorkflowAction={storyboardWorkflowAction}
                    storyboardWorkTypes={
                      storyboardPowerForm?.storyboard_work_types
                    }
                    storyboardReferencePurposes={
                      storyboardPowerForm?.storyboard_reference_purposes
                    }
                    referenceProvider={assetReferenceProvider}
                    onConfirmStoryboard={openStoryboardConfirmation}
                    onCreateStoryboardRevision={createStoryboardRevision}
                    onGenerateStoryboardShot={generateStoryboardShot}
                    onChange={draft.setDraft}
                  />
                )}
              </Suspense>
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
            <p>
              {explicitTextSave
                ? "当前正文尚未保存。可以继续编辑，或放弃本次修改。"
                : "保存请求失败。可以继续编辑并重试，或放弃本次修改。"}
            </p>
            <div>
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(false)}
              >
                继续编辑
              </button>
              <button
                type="button"
                className="is-danger"
                onClick={() => {
                  textVersionRequestRef.current = null;
                  draft.reset();
                  onClose();
                }}
              >
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
  mediaKind?: ContentMediaKind,
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

function createVersionRequestId(action: string, versionId: number) {
  const random =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${action}-${versionId}-${random}`.slice(0, 64);
}
