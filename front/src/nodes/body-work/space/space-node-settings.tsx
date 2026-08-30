import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { fetchSpacePowerForm } from "./space-api";
import { buildComposerReferenceLibrary } from "./space-composer-reference";
import {
  isPromptPowerParam,
  isToolbarPowerParam,
  isUploadPowerParam,
} from "./space-media-param";
import {
  canvasMediaReferenceKind,
  canvasMediaUsageError,
  filterMediaUsageOptionsForMultiImageMode,
  firstFrameMediaUsageKey,
  mediaUsageOptions,
  reconcileCanvasMediaUsages,
  reconcileReferenceModeForMediaSources,
  resolveCanvasMultiImagePlan,
} from "./space-media-references";
import {
  canvasComposerDraftSignature as composerDraftSyncSignature,
  canvasReferenceBindingSignature,
  normalizeCanvasComposerDraftOrDefault as normalizeComposerDraft,
  normalizeProjectAsset,
  readCanvasComposerDraft as readComposerDraft,
} from "./space-model";
import {
  mergeCanvasComposerParamValues as mergeSavedComposerParamValues,
  mergePowerParamValues,
} from "./space-power-param";
import {
  filterActivePowerParams,
  isPowerParamConditionController,
  shouldDisplayPowerParam,
} from "./space-power-param-runtime";
import {
  isActiveRunningNode,
  type NodeDraftUpdateOptions,
  type WorkspaceNodeData,
} from "./space-node-runtime";
import {
  PromptComposer,
  type CanvasParamBindingSourcePreview,
  type UploadPreview,
} from "./space-prompt-composer";
import {
  reconcileStoryboardReferenceState,
  storyboardReferenceUsageOptions,
  storyboardReferenceValidationError,
} from "./space-storyboard-reference";
import { StoryboardWorkTypeSelect } from "./space-storyboard-work-type-select";
import { StoryboardDurationSelect } from "./space-storyboard-duration-select";
import { StoryboardRangeSelect } from "./space-storyboard-range-select";
import { resolveStoryboardSoundtrackRangeSource } from "./space-storyboard-range";
import {
  STORYBOARD_DEFAULT_MIN_SHOT_DURATION,
  filterStoryboardDurationSources,
  resolveStoryboardMinShotDuration,
  storyboardDurationCompatibilityError,
} from "./space-storyboard-duration";
import { uploadSpaceFiles } from "./space-upload";
import type { AssetUploadOptions } from "../asset/asset-upload-progress";
import { resolvePowerPresentation } from "../shared/power-presentation";
import type {
  CanvasComposerDraft,
  CanvasMultiImageMode,
  CanvasReferenceContent,
  CanvasStoryboardReference,
  ComposerAssetItem,
  PowerForm,
  PowerParam,
  StoryboardWorkType,
} from "./types";
import { isManualPowerSourceRule } from "../../shared/power-source-rule";

const NODE_OVERLAY_STYLE: CSSProperties = { zIndex: 999 };
const IMMEDIATE_DRAFT_SAVE: NodeDraftUpdateOptions = { save: "immediate" };
const EMPTY_POWER_PARAMS: PowerParam[] = [];
const uploadComposerParam: PowerParam = {
  id: 0,
  name: "上传",
  key: "files",
  type: "files",
  usage: 2,
  max_files: 6,
};
const agentComposerParams: PowerParam[] = [uploadComposerParam];

type ComposerDraft = CanvasComposerDraft;

function powerFormAllowsSourceSelection(powerForm: PowerForm | null) {
  return isManualPowerSourceRule(powerForm?.source_rule);
}

function powerParamSaveOptions(param?: PowerParam) {
  return param &&
    ["option", "select", "multi_option", "switch"].includes(param.type)
    ? IMMEDIATE_DRAFT_SAVE
    : undefined;
}

function storyboardContinuationValidationContext(
  node: WorkspaceNodeData,
  content: CanvasReferenceContent | undefined,
  items: ComposerAssetItem[],
  usageOptions: ReturnType<typeof mediaUsageOptions>,
) {
  const storyboardItem = node.storyboardItem;
  const dependencyNodeIds = new Set(storyboardItem?.dependencyNodeIds || []);
  if (
    storyboardItem?.itemType !== "shot" ||
    !storyboardItem.continuityAnchor ||
    dependencyNodeIds.size !== 1
  ) {
    return { content, items };
  }
  const tailFrameItems = items.filter(
    (item) =>
      item.source === "current" && dependencyNodeIds.has(String(item.id || "")),
  );
  const tailFrameAssetIds = new Set(
    tailFrameItems
      .map((item) => Number(item.refId || 0))
      .filter((assetId) => assetId > 0),
  );
  if (tailFrameAssetIds.size === 0) {
    return { content, items };
  }
  const firstFrameUsage = firstFrameMediaUsageKey(usageOptions);
  return {
    content: content
      ? {
          ...content,
          parts: content.parts.map((part) =>
            part.type === "reference" &&
            part.ref_type === "asset" &&
            tailFrameAssetIds.has(Number(part.ref_id || 0))
              ? { ...part, usage: firstFrameUsage }
              : part,
          ),
        }
      : content,
    items: items.map((item) =>
      tailFrameItems.includes(item) ? { ...item, kind: "image" } : item,
    ),
  };
}

function restoreStoryboardReferenceState(
  draft: ComposerDraft,
  powerForm: PowerForm | null,
  referenceItems: ComposerAssetItem[],
  isStoryboardPower: boolean,
) {
  if (!isStoryboardPower || !powerForm) {
    return {
      content: draft.promptContent,
      references: draft.storyboardReferences || [],
    };
  }
  const workType = draft.storyboardWorkType || "short";
  return reconcileStoryboardReferenceState(
    draft.promptContent,
    draft.storyboardReferences,
    referenceItems,
    draft.prompt || "",
    workType,
    powerForm.storyboard_reference_purposes,
  );
}

export function CanvasNodeSettings({ node }: { node: WorkspaceNodeData }) {
  const {
    projectId,
    canvasId,
    runningNode,
    onNodeDraftChange,
    onAssetCreated,
    onClearFeedbackRecords,
    onRunBackendNode,
    onTextParamConnectionRemove,
    requestConfirm,
  } = node;
  const nodeComposerDraft = node.composerDraft;
  const latestNodeDraft = useMemo(
    () => readComposerDraft(nodeComposerDraft),
    [nodeComposerDraft],
  );
  const latestNodeDraftSignature = useMemo(
    () => composerDraftSyncSignature(latestNodeDraft),
    [latestNodeDraft],
  );
  const nodeDraftRef = useRef(latestNodeDraft);
  const pendingDraftSignatureRef = useRef("");
  const [prompt, setPrompt] = useState(latestNodeDraft.prompt || "");
  const [promptContent, setPromptContent] = useState<
    CanvasReferenceContent | undefined
  >(latestNodeDraft.promptContent);
  const [storyboardReferences, setStoryboardReferences] = useState<
    CanvasStoryboardReference[]
  >(latestNodeDraft.storyboardReferences || []);
  const [storyboardWorkType, setStoryboardWorkType] =
    useState<StoryboardWorkType>(latestNodeDraft.storyboardWorkType || "short");
  const [storyboardLyricsSourceNodeId, setStoryboardLyricsSourceNodeId] =
    useState(latestNodeDraft.storyboardLyricsSourceNodeId || "");
  const [storyboardMinShotDuration, setStoryboardMinShotDuration] = useState(
    () => resolveStoryboardMinShotDuration(latestNodeDraft.minShotDuration),
  );
  const [storyboardRangeStartMs, setStoryboardRangeStartMs] = useState(
    latestNodeDraft.storyboardRangeStartMs || 0,
  );
  const [storyboardRangeEndMs, setStoryboardRangeEndMs] = useState<
    number | undefined
  >(latestNodeDraft.storyboardRangeEndMs);
  const [running, setRunning] = useState(false);
  const [powerForm, setPowerForm] = useState<PowerForm | null>(null);
  const [powerFormLoading, setPowerFormLoading] = useState(false);
  const [selectedTargetId, setSelectedTargetId] = useState<number>(
    latestNodeDraft.selectedTargetId || 0,
  );
  const [paramValues, setParamValues] = useState<Record<string, unknown>>(
    latestNodeDraft.paramValues || {},
  );
  const [requestedMultiImageMode, setRequestedMultiImageMode] = useState<
    CanvasMultiImageMode | undefined
  >(latestNodeDraft.multiImageMode);
  const powerFormRef = useRef(powerForm);
  const inputContext = node.inputContext;
  const runBlockedReason = node.runBlockedReason;

  useEffect(() => {
    const pendingSignature = pendingDraftSignatureRef.current;
    if (pendingSignature && pendingSignature !== latestNodeDraftSignature) {
      return;
    }
    pendingDraftSignatureRef.current = "";
    nodeDraftRef.current = latestNodeDraft;
  }, [latestNodeDraft, latestNodeDraftSignature]);

  useEffect(() => {
    powerFormRef.current = powerForm;
  }, [powerForm]);

  const nodeRunning = running || isActiveRunningNode(runningNode);
  const selectedNodeType = node.type;
  const selectedNodeId = node.id;
  const selectedFlowId = node.flow?.id || 0;
  const selectedPowerId = node.type === "power" ? node.power?.id || 0 : 0;
  const selectedPowerKey = node.type === "power" ? node.power?.key || "" : "";
  const selectedAgentId =
    node.type === "agent" ? Number(node.role?.agent_id || 0) : 0;
  const space = node.space;
  const canvasReferenceItems = node.canvasReferenceItems;
  const connectedMediaReferences = node.connectedMediaReferences;
  const onConnectedMediaUsagesChange = node.onConnectedMediaUsagesChange;
  const onConnectedMediaEdgeRemove = node.onConnectedMediaEdgeRemove;
  const catalogCache = node.catalogCache;
  const releaseId = Number(
    space?.release?.id || space?.project.release_id || 0,
  );
  const nodeAssetCateId = Number(node.assetCateId || 0);
  const assetLibrary = useMemo(
    () =>
      buildComposerReferenceLibrary(
        inputContext,
        canvasReferenceItems.filter((item) => item.id !== node.id),
      ),
    [canvasReferenceItems, inputContext, node.id],
  );
  const storyboardSoundtrackRangeSource = useMemo(
    () =>
      resolveStoryboardSoundtrackRangeSource(
        storyboardReferences,
        assetLibrary.current,
      ),
    [assetLibrary, storyboardReferences],
  );
  const latestAssetLibraryRef = useRef(assetLibrary);
  useEffect(() => {
    latestAssetLibraryRef.current = assetLibrary;
  }, [assetLibrary]);
  const paramBindingSources = useMemo<
    Record<string, CanvasParamBindingSourcePreview>
  >(() => {
    const sources = new Map<string, CanvasParamBindingSourcePreview>();
    for (const source of inputContext?.sources || []) {
      sources.set(source.nodeId, {
        title: source.title || "上游节点",
        text:
          source.preview.text ||
          (typeof source.output === "string" ? source.output : ""),
      });
    }
    const sourceNodeIds = new Set(
      Object.values(latestNodeDraft.paramBindings || {}).map(
        (binding) => binding.sourceNodeId,
      ),
    );
    if (storyboardLyricsSourceNodeId) {
      sourceNodeIds.add(storyboardLyricsSourceNodeId);
    }
    for (const sourceNodeId of sourceNodeIds) {
      if (sources.has(sourceNodeId)) {
        continue;
      }
      const item = canvasReferenceItems.find(
        (candidate) => candidate.id === sourceNodeId,
      );
      sources.set(sourceNodeId, {
        title: item?.title || "上游节点",
        text: item?.preview.text || "",
      });
    }
    return Object.fromEntries(sources);
  }, [
    canvasReferenceItems,
    inputContext,
    latestNodeDraft.paramBindings,
    storyboardLyricsSourceNodeId,
  ]);
  const isStoryboardPower =
    node.type === "power" &&
    resolvePowerPresentation(node.power, node.kind, node.outputType)
      ?.viewMode === "storyboard";

  useEffect(() => {
    if (selectedNodeType === "power" && (selectedPowerId || selectedPowerKey)) {
      const draftTargetId = nodeDraftRef.current.selectedTargetId || 0;
      let canceled = false;
      setPowerFormLoading(true);
      catalogCache
        .loadPowerForm(
          {
            projectId,
            releaseId,
            flowId: selectedFlowId,
            powerId: selectedPowerId,
            powerKey: selectedPowerKey,
            targetId: draftTargetId,
          },
          () =>
            fetchSpacePowerForm({
              projectId,
              flowId: selectedFlowId,
              powerId: selectedPowerId,
              powerKey: selectedPowerKey,
              targetId: draftTargetId,
            }),
        )
        .then((form) => {
          if (canceled) {
            return;
          }
          const savedDraft = nodeDraftRef.current;
          const restoredStoryboard = restoreStoryboardReferenceState(
            savedDraft,
            form,
            latestAssetLibraryRef.current.current,
            isStoryboardPower,
          );
          setPowerForm(form);
          setSelectedTargetId(
            powerFormAllowsSourceSelection(form)
              ? form.selected_target_id || draftTargetId || 0
              : 0,
          );
          setParamValues(
            mergeSavedComposerParamValues(form.params || [], savedDraft),
          );
          setPrompt(savedDraft.prompt || "");
          setPromptContent(restoredStoryboard.content);
          setStoryboardReferences(restoredStoryboard.references);
          setStoryboardWorkType(savedDraft.storyboardWorkType || "short");
          setStoryboardLyricsSourceNodeId(
            savedDraft.storyboardLyricsSourceNodeId || "",
          );
          setStoryboardMinShotDuration(
            resolveStoryboardMinShotDuration(savedDraft.minShotDuration),
          );
          setStoryboardRangeStartMs(savedDraft.storyboardRangeStartMs || 0);
          setStoryboardRangeEndMs(savedDraft.storyboardRangeEndMs);
          setRequestedMultiImageMode(savedDraft.multiImageMode);
        })
        .catch((err) => {
          if (!canceled) {
            toast.error(
              err instanceof Error ? err.message : "加载能力参数失败",
            );
          }
        })
        .finally(() => {
          if (!canceled) {
            setPowerFormLoading(false);
          }
        });
      return () => {
        canceled = true;
      };
    }
    setPowerForm(null);
    if (selectedNodeType === "agent") {
      const savedDraft = nodeDraftRef.current;
      setParamValues(savedDraft.paramValues || {});
      setPrompt(savedDraft.prompt || "");
      setPromptContent(savedDraft.promptContent);
      setStoryboardReferences(savedDraft.storyboardReferences || []);
      setStoryboardWorkType(savedDraft.storyboardWorkType || "short");
      setStoryboardLyricsSourceNodeId("");
      setStoryboardMinShotDuration(STORYBOARD_DEFAULT_MIN_SHOT_DURATION);
      setStoryboardRangeStartMs(0);
      setStoryboardRangeEndMs(undefined);
      setRequestedMultiImageMode(undefined);
      setSelectedTargetId(0);
      return;
    }
    setParamValues({});
    setSelectedTargetId(0);
    setPrompt("");
    setPromptContent(undefined);
    setStoryboardReferences([]);
    setStoryboardWorkType("short");
    setStoryboardLyricsSourceNodeId("");
    setStoryboardMinShotDuration(STORYBOARD_DEFAULT_MIN_SHOT_DURATION);
    setStoryboardRangeStartMs(0);
    setStoryboardRangeEndMs(undefined);
    setRequestedMultiImageMode(undefined);
  }, [
    catalogCache,
    isStoryboardPower,
    projectId,
    releaseId,
    selectedFlowId,
    selectedAgentId,
    selectedNodeId,
    selectedNodeType,
    selectedPowerId,
    selectedPowerKey,
  ]);

  const powerParams = powerForm?.params || EMPTY_POWER_PARAMS;
  const mediaSourceParamValues = useMemo(
    () =>
      reconcileReferenceModeForMediaSources(
        powerParams,
        paramValues,
        connectedMediaReferences.map((reference) => reference.source),
      ),
    [connectedMediaReferences, paramValues, powerParams],
  );
  const multiImagePlan = useMemo(
    () =>
      resolveCanvasMultiImagePlan({
        node,
        content: promptContent,
        items: assetLibrary.current,
        connections: connectedMediaReferences,
        params: powerParams,
        values: mediaSourceParamValues,
        requestedMode: requestedMultiImageMode,
      }),
    [
      assetLibrary,
      connectedMediaReferences,
      mediaSourceParamValues,
      node,
      powerParams,
      promptContent,
      requestedMultiImageMode,
    ],
  );
  const effectiveMultiImageMode = multiImagePlan.active
    ? multiImagePlan.mode
    : undefined;
  const hasPendingLocalDraft =
    Boolean(pendingDraftSignatureRef.current) &&
    pendingDraftSignatureRef.current !== latestNodeDraftSignature;
  const savedMultiImageMode = hasPendingLocalDraft
    ? nodeDraftRef.current.multiImageMode ||
      requestedMultiImageMode ||
      effectiveMultiImageMode
    : latestNodeDraft.multiImageMode || effectiveMultiImageMode;
  const activePowerParams = useMemo(
    () => filterActivePowerParams(powerParams, mediaSourceParamValues),
    [mediaSourceParamValues, powerParams],
  );
  const activeMediaUsageOptions = useMemo(
    () => mediaUsageOptions(activePowerParams),
    [activePowerParams],
  );
  const connectedMediaUsageOptions = useMemo(
    () =>
      selectedNodeType === "power"
        ? filterMediaUsageOptionsForMultiImageMode(
            activeMediaUsageOptions,
            effectiveMultiImageMode,
          )
        : [],
    [activeMediaUsageOptions, effectiveMultiImageMode, selectedNodeType],
  );
  const displayedPowerParams = useMemo(() => {
    const activeMediaKeys = new Set(
      activeMediaUsageOptions.map((option) => option.key),
    );
    const visibleMediaKeys = new Set(
      connectedMediaUsageOptions.map((option) => option.key),
    );
    return activePowerParams.filter(
      (param) =>
        shouldDisplayPowerParam(param, powerParams) &&
        (!isUploadPowerParam(param) ||
          !activeMediaKeys.has(param.key) ||
          visibleMediaKeys.has(param.key)),
    );
  }, [
    activeMediaUsageOptions,
    activePowerParams,
    connectedMediaUsageOptions,
    powerParams,
  ]);
  const continuationValidationContext = useMemo(
    () =>
      storyboardContinuationValidationContext(
        node,
        promptContent,
        assetLibrary.current,
        connectedMediaUsageOptions,
      ),
    [assetLibrary, connectedMediaUsageOptions, node, promptContent],
  );
  const storyboardUsageOptions = useMemo(
    () =>
      isStoryboardPower
        ? storyboardReferenceUsageOptions(
            storyboardWorkType,
            powerForm?.storyboard_reference_purposes || [],
          )
        : [],
    [isStoryboardPower, powerForm, storyboardWorkType],
  );
  const requireBoundMediaReferences =
    selectedNodeType === "power" &&
    ["image", "video"].includes(canvasMediaReferenceKind(node) || "");
  const configuredMediaError = useMemo(
    () =>
      selectedNodeType === "power" && !powerFormLoading
        ? canvasMediaUsageError(
            connectedMediaReferences,
            continuationValidationContext.content,
            continuationValidationContext.items,
            connectedMediaUsageOptions,
            {},
            requireBoundMediaReferences,
            effectiveMultiImageMode,
          )
        : "",
    [
      connectedMediaReferences,
      connectedMediaUsageOptions,
      continuationValidationContext,
      powerFormLoading,
      requireBoundMediaReferences,
      selectedNodeType,
      effectiveMultiImageMode,
    ],
  );
  const storyboardReferenceError = useMemo(
    () =>
      isStoryboardPower && !powerFormLoading
        ? powerForm
          ? storyboardReferenceValidationError(
              storyboardReferences,
              storyboardWorkType,
              powerForm.storyboard_work_types,
              powerForm.storyboard_reference_purposes,
            )
          : "分镜作品类型与参考用途配置加载失败，请重新打开节点后重试"
        : "",
    [
      isStoryboardPower,
      powerForm,
      powerFormLoading,
      storyboardReferences,
      storyboardWorkType,
    ],
  );
  const requiredDurationValues =
    node.storyboardItem?.itemType === "shot"
      ? node.storyboardItem.requiredDurationValues
      : undefined;
  const compatiblePowerSources = useMemo(
    () =>
      filterStoryboardDurationSources(
        powerForm?.sources || [],
        requiredDurationValues,
      ),
    [powerForm?.sources, requiredDurationValues],
  );
  const durationSourceError = useMemo(() => {
    if (!requiredDurationValues?.length || powerFormLoading || !powerForm) {
      return "";
    }
    const compatibilityError = storyboardDurationCompatibilityError(
      requiredDurationValues,
    );
    if (compatiblePowerSources.length === 0) {
      return compatibilityError;
    }
    if (
      powerFormAllowsSourceSelection(powerForm) &&
      selectedTargetId > 0 &&
      !compatiblePowerSources.some(
        (source) =>
          source.target_id === selectedTargetId ||
          source.id === selectedTargetId,
      )
    ) {
      return `当前所选模型不满足时长要求；${compatibilityError}`;
    }
    return "";
  }, [
    compatiblePowerSources,
    powerForm,
    powerFormLoading,
    requiredDurationValues,
    selectedTargetId,
  ]);
  const effectiveRunBlockedReason =
    runBlockedReason ||
    multiImagePlan.error ||
    configuredMediaError ||
    storyboardReferenceError ||
    durationSourceError;
  const promptParam = useMemo(
    () => activePowerParams.find(isPromptPowerParam) || null,
    [activePowerParams],
  );
  const composerParams = useMemo(
    () =>
      displayedPowerParams.filter(
        (param) =>
          param.key !== promptParam?.key &&
          (isUploadPowerParam(param) ||
            isToolbarPowerParam(param) ||
            isPowerParamConditionController(param, powerParams)),
      ),
    [displayedPowerParams, powerParams, promptParam?.key],
  );
  const powerPrompt = promptParam
    ? String(mediaSourceParamValues[promptParam.key] ?? "")
    : prompt;
  const powerInputDescription = String(
    powerForm?.power?.description || node.power?.description || "",
  ).trim();
  const powerInputPlaceholder =
    powerInputDescription ||
    (promptParam
      ? "在此处为该能力输入生成提示词..."
      : "当前能力无需填写提示词");
  const canSelectPowerSource = powerFormAllowsSourceSelection(powerForm);
  const effectiveSelectedTargetId = canSelectPowerSource ? selectedTargetId : 0;

  useEffect(() => {
    if (selectedNodeType !== "power" && selectedNodeType !== "agent") {
      return;
    }
    const savedDraft = nodeDraftRef.current;
    const currentPowerForm = powerFormRef.current;
    const restoredStoryboard = restoreStoryboardReferenceState(
      savedDraft,
      currentPowerForm,
      latestAssetLibraryRef.current.current,
      isStoryboardPower,
    );
    setPrompt(savedDraft.prompt || "");
    setPromptContent(restoredStoryboard.content);
    setStoryboardReferences(restoredStoryboard.references);
    setStoryboardWorkType(savedDraft.storyboardWorkType || "short");
    setStoryboardLyricsSourceNodeId(
      savedDraft.storyboardLyricsSourceNodeId || "",
    );
    setStoryboardMinShotDuration(
      resolveStoryboardMinShotDuration(savedDraft.minShotDuration),
    );
    setStoryboardRangeStartMs(savedDraft.storyboardRangeStartMs || 0);
    setStoryboardRangeEndMs(savedDraft.storyboardRangeEndMs);
    setRequestedMultiImageMode(savedDraft.multiImageMode);
    setSelectedTargetId(
      selectedNodeType === "power" &&
        powerFormAllowsSourceSelection(currentPowerForm)
        ? savedDraft.selectedTargetId ||
            currentPowerForm?.selected_target_id ||
            0
        : 0,
    );
    setParamValues(
      selectedNodeType === "power" && currentPowerForm
        ? mergeSavedComposerParamValues(
            currentPowerForm.params || [],
            savedDraft,
          )
        : savedDraft.paramValues || {},
    );
  }, [isStoryboardPower, latestNodeDraftSignature, selectedNodeType]);

  const saveComposerDraft = useCallback(
    (draft: ComposerDraft, options?: NodeDraftUpdateOptions) => {
      const promptContentValue = Object.prototype.hasOwnProperty.call(
        draft,
        "promptContent",
      )
        ? draft.promptContent
        : promptContent;
      const normalized = normalizeComposerDraft({
        ...nodeDraftRef.current,
        ...draft,
        promptContent: promptContentValue,
        ...(!isStoryboardPower
          ? {
              storyboardReferences: [],
              storyboardWorkType: undefined,
              storyboardLyricsSourceNodeId: undefined,
              minShotDuration: undefined,
              storyboardRangeStartMs: undefined,
              storyboardRangeEndMs: undefined,
            }
          : {}),
      });
      nodeDraftRef.current = normalized;
      const normalizedSignature = composerDraftSyncSignature(
        readComposerDraft(normalized),
      );
      pendingDraftSignatureRef.current =
        normalizedSignature === latestNodeDraftSignature
          ? ""
          : normalizedSignature;
      setRequestedMultiImageMode(normalized.multiImageMode);
      onNodeDraftChange(node.id, normalized, options);
      return normalized;
    },
    [
      isStoryboardPower,
      latestNodeDraftSignature,
      node.id,
      onNodeDraftChange,
      promptContent,
    ],
  );

  const requestTextConnectionRemoval = useCallback(
    (sourceNodeId: string, description: string) => {
      if (!sourceNodeId) {
        return;
      }
      requestConfirm({
        title: "删除文本连接",
        description,
        confirmText: "删除",
        tone: "danger",
        onConfirm: () => onTextParamConnectionRemove(sourceNodeId, node.id),
      });
    },
    [node.id, onTextParamConnectionRemove, requestConfirm],
  );
  const removeParamBindingConnection = useCallback(
    (targetParamKey: string) => {
      const sourceNodeId =
        nodeDraftRef.current.paramBindings?.[targetParamKey]?.sourceNodeId ||
        "";
      requestTextConnectionRemoval(
        sourceNodeId,
        "删除后，上游文本将不再传入这个参数。",
      );
    },
    [requestTextConnectionRemoval],
  );
  const removeStoryboardLyricsConnection = useCallback(() => {
    requestTextConnectionRemoval(
      String(nodeDraftRef.current.storyboardLyricsSourceNodeId || "").trim(),
      "删除后，上游文本将不再作为 MV 歌词传入。",
    );
  }, [requestTextConnectionRemoval]);

  const saveComposerParamValues = useCallback(
    (
      nextValues: Record<string, unknown>,
      draft: Omit<ComposerDraft, "paramValues">,
      options?: NodeDraftUpdateOptions,
    ) => {
      setParamValues(nextValues);
      return saveComposerDraft({ ...draft, paramValues: nextValues }, options);
    },
    [saveComposerDraft],
  );

  useEffect(() => {
    if (mediaSourceParamValues === paramValues) {
      return;
    }
    saveComposerParamValues(mediaSourceParamValues, {
      prompt: powerPrompt,
      promptContent,
      selectedTargetId: effectiveSelectedTargetId,
      multiImageMode: savedMultiImageMode,
    });
  }, [
    effectiveSelectedTargetId,
    mediaSourceParamValues,
    paramValues,
    powerPrompt,
    promptContent,
    saveComposerParamValues,
    savedMultiImageMode,
  ]);

  function setPowerPrompt(
    nextPrompt: string,
    nextContent?: CanvasReferenceContent,
  ) {
    const referencesChanged =
      canvasReferenceBindingSignature(promptContent) !==
      canvasReferenceBindingSignature(nextContent);
    const reconciliation = referencesChanged
      ? reconcileCanvasMediaUsages(
          promptContent,
          nextContent,
          assetLibrary.current,
          connectedMediaUsageOptions,
          connectedMediaReferences,
          effectiveMultiImageMode,
        )
      : { content: nextContent, assignments: {} };
    const normalizedContent = reconciliation.content;
    if (Object.keys(reconciliation.assignments).length > 0) {
      onConnectedMediaUsagesChange?.(reconciliation.assignments);
    }
    setPrompt(nextPrompt);
    const nextStoryboardState =
      isStoryboardPower && referencesChanged
        ? reconcileStoryboardReferenceState(
            normalizedContent,
            storyboardReferences,
            assetLibrary.current,
            nextPrompt,
            storyboardWorkType,
            powerForm?.storyboard_reference_purposes || [],
          )
        : {
            content: normalizedContent,
            references: storyboardReferences,
          };
    setPromptContent(nextStoryboardState.content);
    setStoryboardReferences(nextStoryboardState.references);
    const currentValues = nodeDraftRef.current.paramValues || paramValues;
    const nextValues = promptParam
      ? { ...currentValues, [promptParam.key]: nextPrompt }
      : currentValues;
    saveComposerParamValues(
      nextValues,
      {
        prompt: nextPrompt,
        promptContent: nextStoryboardState.content,
        selectedTargetId: effectiveSelectedTargetId,
        storyboardReferences: nextStoryboardState.references,
        storyboardWorkType: isStoryboardPower ? storyboardWorkType : undefined,
        minShotDuration: isStoryboardPower
          ? storyboardMinShotDuration
          : undefined,
        multiImageMode: savedMultiImageMode,
      },
      referencesChanged ? IMMEDIATE_DRAFT_SAVE : undefined,
    );
  }

  function updateStoryboardWorkType(nextWorkType: StoryboardWorkType) {
    const nextStoryboardState = reconcileStoryboardReferenceState(
      promptContent,
      storyboardReferences,
      assetLibrary.current,
      powerPrompt,
      nextWorkType,
      powerForm?.storyboard_reference_purposes || [],
    );
    const nextLyricsSourceNodeId =
      nextWorkType === "mv" ? storyboardLyricsSourceNodeId : "";
    setStoryboardWorkType(nextWorkType);
    setStoryboardLyricsSourceNodeId(nextLyricsSourceNodeId);
    setPromptContent(nextStoryboardState.content);
    setStoryboardReferences(nextStoryboardState.references);
    saveComposerDraft(
      {
        prompt: powerPrompt,
        promptContent: nextStoryboardState.content,
        paramValues,
        selectedTargetId: effectiveSelectedTargetId,
        storyboardReferences: nextStoryboardState.references,
        storyboardWorkType: nextWorkType,
        storyboardLyricsSourceNodeId: nextLyricsSourceNodeId || undefined,
        minShotDuration: storyboardMinShotDuration,
        multiImageMode: savedMultiImageMode,
      },
      IMMEDIATE_DRAFT_SAVE,
    );
  }

  function updateStoryboardMinShotDuration(seconds: number) {
    const normalized = resolveStoryboardMinShotDuration(seconds);
    setStoryboardMinShotDuration(normalized);
    saveComposerDraft(
      {
        prompt: powerPrompt,
        promptContent,
        paramValues,
        selectedTargetId: effectiveSelectedTargetId,
        storyboardReferences,
        storyboardWorkType,
        minShotDuration: normalized,
        multiImageMode: savedMultiImageMode,
      },
      IMMEDIATE_DRAFT_SAVE,
    );
  }

  function updateStoryboardRange(startMs: number, endMs?: number) {
    setStoryboardRangeStartMs(startMs);
    setStoryboardRangeEndMs(endMs);
    saveComposerDraft(
      {
        prompt: powerPrompt,
        promptContent,
        paramValues,
        selectedTargetId: effectiveSelectedTargetId,
        storyboardReferences,
        storyboardWorkType,
        storyboardRangeStartMs: startMs,
        storyboardRangeEndMs: endMs,
        minShotDuration: storyboardMinShotDuration,
        multiImageMode: savedMultiImageMode,
      },
      IMMEDIATE_DRAFT_SAVE,
    );
  }

  function setParamValue(key: string, value: unknown) {
    const nextValues = {
      ...(nodeDraftRef.current.paramValues || paramValues),
      [key]: value,
    };
    const changedParam = powerParams.find((param) => param.key === key);
    const saveOptions = powerParamSaveOptions(changedParam);
    const activeMultiImageMode = effectiveMultiImageMode;
    if (
      changedParam &&
      isPowerParamConditionController(changedParam, powerParams)
    ) {
      const nextMediaUsageOptions = mediaUsageOptions(
        filterActivePowerParams(powerParams, nextValues),
      );
      const reconciliation = reconcileCanvasMediaUsages(
        promptContent,
        promptContent,
        assetLibrary.current,
        nextMediaUsageOptions,
        connectedMediaReferences,
        activeMultiImageMode,
      );
      if (Object.keys(reconciliation.assignments).length > 0) {
        onConnectedMediaUsagesChange?.(reconciliation.assignments);
      }
      setPromptContent(reconciliation.content);
      saveComposerParamValues(
        nextValues,
        {
          prompt: powerPrompt,
          promptContent: reconciliation.content,
          selectedTargetId: effectiveSelectedTargetId,
          multiImageMode: savedMultiImageMode,
        },
        saveOptions,
      );
      return;
    }
    saveComposerParamValues(
      nextValues,
      {
        prompt: powerPrompt,
        promptContent,
        selectedTargetId: effectiveSelectedTargetId,
        multiImageMode: savedMultiImageMode,
      },
      saveOptions,
    );
  }

  function setMultiImageMode(nextMode: CanvasMultiImageMode) {
    const option = multiImagePlan.options.find(
      (candidate) => candidate.value === nextMode,
    );
    if (!multiImagePlan.active || !option?.enabled) {
      toast.error(option?.reason || "当前能力不支持该多图生成方式");
      return;
    }
    const currentValues = nodeDraftRef.current.paramValues || paramValues;
    const nextValues = reconcileReferenceModeForMediaSources(
      powerParams,
      currentValues,
      connectedMediaReferences.map((reference) => reference.source),
    );
    const nextMediaUsageOptions = mediaUsageOptions(
      filterActivePowerParams(powerParams, nextValues),
    );
    const reconciliation = reconcileCanvasMediaUsages(
      promptContent,
      promptContent,
      assetLibrary.current,
      nextMediaUsageOptions,
      connectedMediaReferences,
      nextMode,
    );
    const mediaError = canvasMediaUsageError(
      connectedMediaReferences,
      reconciliation.content,
      assetLibrary.current,
      nextMediaUsageOptions,
      reconciliation.assignments,
      requireBoundMediaReferences,
      nextMode,
    );
    if (mediaError) {
      toast.error(mediaError);
    }
    if (Object.keys(reconciliation.assignments).length > 0) {
      onConnectedMediaUsagesChange?.(reconciliation.assignments);
    }
    setPromptContent(reconciliation.content);
    saveComposerParamValues(
      nextValues,
      {
        prompt: powerPrompt,
        promptContent: reconciliation.content,
        selectedTargetId: effectiveSelectedTargetId,
        storyboardReferences,
        multiImageMode: nextMode,
      },
      IMMEDIATE_DRAFT_SAVE,
    );
  }

  function setAgentPrompt(
    nextPrompt: string,
    nextContent?: CanvasReferenceContent,
  ) {
    const referencesChanged =
      canvasReferenceBindingSignature(promptContent) !==
      canvasReferenceBindingSignature(nextContent);
    setPrompt(nextPrompt);
    setPromptContent(nextContent);
    saveComposerDraft(
      {
        prompt: nextPrompt,
        promptContent: nextContent,
        paramValues: nodeDraftRef.current.paramValues || paramValues,
        selectedTargetId: 0,
      },
      referencesChanged ? IMMEDIATE_DRAFT_SAVE : undefined,
    );
  }

  function setAgentParamValue(key: string, value: unknown) {
    const nextValues = {
      ...(nodeDraftRef.current.paramValues || paramValues),
      [key]: value,
    };
    saveComposerParamValues(
      nextValues,
      {
        prompt,
        selectedTargetId: 0,
      },
      IMMEDIATE_DRAFT_SAVE,
    );
  }

  async function handleLocalUpload(
    files: File[],
    param: PowerParam,
    options?: AssetUploadOptions,
  ): Promise<UploadPreview[]> {
    const previews = await uploadSpaceFiles({
      projectID: projectId,
      canvasID: canvasId,
      teamID: Number(space?.project.team_id || 0),
      files,
      ruleID: param.upload_rule_id,
      onProgress: options?.onProgress,
    });
    for (const preview of previews) {
      const asset = normalizeProjectAsset(preview.asset);
      if (asset.id) {
        onAssetCreated?.(asset);
      }
    }
    return previews;
  }

  async function selectPowerSource(targetId: number) {
    if (nodeRunning || !canSelectPowerSource) {
      return;
    }
    if (node.type !== "power" || !node.power) {
      return;
    }
    try {
      const form = await catalogCache.loadPowerForm(
        {
          projectId,
          releaseId,
          flowId: node.flow?.id || 0,
          powerId: node.power.id,
          powerKey: node.power.key,
          targetId,
        },
        () =>
          fetchSpacePowerForm({
            projectId,
            flowId: node.flow?.id || 0,
            powerId: node.power?.id || 0,
            powerKey: node.power?.key || "",
            targetId,
          }),
      );
      const nextParams = form.params || [];
      const mergedValues = mergePowerParamValues(
        nextParams,
        nodeDraftRef.current.paramValues || paramValues,
        powerForm?.params || [],
      );
      const nextValues = reconcileReferenceModeForMediaSources(
        nextParams,
        mergedValues,
        connectedMediaReferences.map((reference) => reference.source),
      );
      const nextMultiImagePlan = resolveCanvasMultiImagePlan({
        node,
        content: promptContent,
        items: assetLibrary.current,
        connections: connectedMediaReferences,
        params: nextParams,
        values: nextValues,
        requestedMode: requestedMultiImageMode || effectiveMultiImageMode,
      });
      const nextMultiImageMode = nextMultiImagePlan.active
        ? nextMultiImagePlan.mode
        : undefined;
      if (nextMultiImagePlan.error) {
        toast.error(`无法切换能力来源：${nextMultiImagePlan.error}`);
        return;
      }
      const options = mediaUsageOptions(
        filterActivePowerParams(nextParams, nextValues),
      );
      const reconciliation = reconcileCanvasMediaUsages(
        promptContent,
        promptContent,
        assetLibrary.current,
        options,
        connectedMediaReferences,
        nextMultiImageMode,
      );
      const nextValidationContext = storyboardContinuationValidationContext(
        node,
        reconciliation.content,
        assetLibrary.current,
        options,
      );
      const mediaError = canvasMediaUsageError(
        connectedMediaReferences,
        nextValidationContext.content,
        nextValidationContext.items,
        options,
        reconciliation.assignments,
        requireBoundMediaReferences,
        nextMultiImageMode,
      );
      if (mediaError) {
        toast.error(`无法切换能力来源：${mediaError}`);
        return;
      }
      if (Object.keys(reconciliation.assignments).length > 0) {
        onConnectedMediaUsagesChange?.(reconciliation.assignments);
      }
      setPowerForm(form);
      const nextTargetId = powerFormAllowsSourceSelection(form)
        ? form.selected_target_id || targetId
        : 0;
      setSelectedTargetId(nextTargetId);
      setPromptContent(reconciliation.content);
      saveComposerParamValues(
        nextValues,
        {
          prompt: powerPrompt,
          promptContent: reconciliation.content,
          selectedTargetId: nextTargetId,
          multiImageMode: nextMultiImageMode,
        },
        IMMEDIATE_DRAFT_SAVE,
      );
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "加载能力参数失败");
    }
  }

  const runNodeNow = async (
    submittedPrompt: string,
    submittedContent?: CanvasReferenceContent,
  ) => {
    onClearFeedbackRecords([node.id]);
    setRunning(true);
    try {
      if (node.type === "power" && node.power) {
        const currentDraft = nodeDraftRef.current;
        const currentContent = Object.prototype.hasOwnProperty.call(
          currentDraft,
          "promptContent",
        )
          ? currentDraft.promptContent
          : submittedContent;
        const executionStoryboardWorkType =
          currentDraft.storyboardWorkType || storyboardWorkType;
        const executionMinShotDuration = resolveStoryboardMinShotDuration(
          currentDraft.minShotDuration ?? storyboardMinShotDuration,
        );
        const executionStoryboardState = isStoryboardPower
          ? reconcileStoryboardReferenceState(
              currentContent,
              currentDraft.storyboardReferences || storyboardReferences,
              assetLibrary.current,
              submittedPrompt,
              executionStoryboardWorkType,
              powerForm?.storyboard_reference_purposes || [],
            )
          : {
              content: currentContent,
              references: currentDraft.storyboardReferences || [],
            };
        const nextMultiImageMode = effectiveMultiImageMode;
        const currentValues = {
          ...reconcileReferenceModeForMediaSources(
            powerParams,
            currentDraft.paramValues || mediaSourceParamValues,
            connectedMediaReferences.map((reference) => reference.source),
          ),
        };
        if (promptParam) {
          currentValues[promptParam.key] = submittedPrompt;
        }
        const nextDraft = saveComposerDraft({
          ...currentDraft,
          prompt: submittedPrompt,
          promptContent: executionStoryboardState.content,
          paramValues: currentValues,
          selectedTargetId: effectiveSelectedTargetId,
          storyboardReferences: executionStoryboardState.references,
          storyboardWorkType: isStoryboardPower
            ? executionStoryboardWorkType
            : undefined,
          minShotDuration: isStoryboardPower
            ? executionMinShotDuration
            : undefined,
          multiImageMode: nextMultiImageMode,
        });
        await onRunBackendNode({
          ...node,
          composerDraft: nextDraft,
        });
        return;
      }
      if (node.type === "agent" && node.role) {
        const currentDraft = nodeDraftRef.current;
        const nextDraft = saveComposerDraft({
          ...currentDraft,
          prompt: submittedPrompt,
          promptContent: Object.prototype.hasOwnProperty.call(
            currentDraft,
            "promptContent",
          )
            ? currentDraft.promptContent
            : submittedContent,
          paramValues: currentDraft.paramValues || paramValues,
          selectedTargetId: 0,
        });
        await onRunBackendNode({
          ...node,
          composerDraft: nextDraft,
        });
        return;
      }
      throw new Error("当前节点缺少可运行配置");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "执行出错");
    } finally {
      setRunning(false);
    }
  };

  const handleRun = async (
    submittedPrompt: string,
    submittedContent?: CanvasReferenceContent,
  ) => {
    if (nodeRunning) {
      return;
    }
    if (effectiveRunBlockedReason) {
      toast.error(effectiveRunBlockedReason);
      return;
    }
    await runNodeNow(submittedPrompt, submittedContent);
  };
  if (node.type === "power") {
    return (
      <div
        className="ws-node-bottom-settings is-composer nodrag nowheel"
        onClick={(event) => event.stopPropagation()}
        style={NODE_OVERLAY_STYLE}
      >
        {powerFormLoading && !nodeRunning && !powerForm ? (
          <div className="ws-prompt-loading">
            <Loader2 size={16} className="ws-spin" />
            <span>正在加载能力参数...</span>
          </div>
        ) : (
          <PromptComposer
            value={powerPrompt}
            referenceContent={promptContent}
            placeholder={powerInputPlaceholder}
            running={nodeRunning}
            textInputEnabled={Boolean(promptParam)}
            showMediaParamButtons
            mediaParamPower={powerForm?.power || node.power}
            sourceOptions={canSelectPowerSource ? compatiblePowerSources : []}
            selectedSourceId={effectiveSelectedTargetId}
            params={composerParams}
            primaryParam={promptParam || undefined}
            paramValues={mediaSourceParamValues}
            paramBindings={latestNodeDraft.paramBindings}
            paramBindingSources={paramBindingSources}
            storyboardLyricsBindingSource={
              isStoryboardPower &&
              storyboardWorkType === "mv" &&
              storyboardLyricsSourceNodeId
                ? paramBindingSources[storyboardLyricsSourceNodeId] || {
                    title: "上游节点",
                  }
                : undefined
            }
            assetLibrary={assetLibrary}
            assetReference={{
              teamID: Number(space?.project.team_id || 0),
              projectID: projectId,
              assetCateID: nodeAssetCateId,
            }}
            connectedMediaReferences={connectedMediaReferences}
            mediaUsageOptions={connectedMediaUsageOptions}
            referenceUsageOptions={
              isStoryboardPower ? storyboardUsageOptions : undefined
            }
            referenceUsageField={isStoryboardPower ? "purpose" : "usage"}
            multiImagePlan={multiImagePlan}
            multiImageMode={effectiveMultiImageMode}
            toolbarContent={
              isStoryboardPower
                ? ({ openKey, onToggle }) => (
                    <>
                      <StoryboardWorkTypeSelect
                        value={storyboardWorkType}
                        options={powerForm?.storyboard_work_types || []}
                        disabled={powerFormLoading || nodeRunning}
                        openKey={openKey}
                        onToggle={onToggle}
                        onChange={updateStoryboardWorkType}
                      />
                      <StoryboardDurationSelect
                        value={storyboardMinShotDuration}
                        options={powerForm?.storyboard_min_shot_durations || []}
                        disabled={powerFormLoading || nodeRunning}
                        openKey={openKey}
                        onToggle={onToggle}
                        onChange={updateStoryboardMinShotDuration}
                      />
                      {storyboardWorkType === "mv" &&
                      storyboardReferences.some(
                        (reference) => reference.purpose === "soundtrack",
                      ) ? (
                        <StoryboardRangeSelect
                          startMs={storyboardRangeStartMs}
                          endMs={storyboardRangeEndMs}
                          soundtrackDurationMs={
                            storyboardSoundtrackRangeSource.durationMs
                          }
                          soundtrackUrl={
                            storyboardSoundtrackRangeSource.audioUrl
                          }
                          disabled={powerFormLoading || nodeRunning}
                          openKey={openKey}
                          onToggle={onToggle}
                          onChange={updateStoryboardRange}
                        />
                      ) : null}
                    </>
                  )
                : undefined
            }
            onConnectedMediaEdgeRemove={onConnectedMediaEdgeRemove}
            disabled={powerFormLoading}
            submitDisabled={Boolean(effectiveRunBlockedReason)}
            submitDisabledReason={effectiveRunBlockedReason}
            onChange={setPowerPrompt}
            onParamChange={setParamValue}
            onParamBindingConnectionRemove={removeParamBindingConnection}
            onStoryboardLyricsConnectionRemove={
              removeStoryboardLyricsConnection
            }
            onMultiImageModeChange={setMultiImageMode}
            onSourceChange={
              canSelectPowerSource
                ? (targetId) => void selectPowerSource(targetId)
                : undefined
            }
            onLocalUpload={handleLocalUpload}
            onSubmit={handleRun}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className="ws-node-bottom-settings is-composer nodrag nowheel"
      onClick={(event) => event.stopPropagation()}
      style={NODE_OVERLAY_STYLE}
    >
      <PromptComposer
        value={prompt}
        referenceContent={promptContent}
        placeholder="向智能体发送任务指令..."
        running={nodeRunning}
        params={agentComposerParams}
        paramValues={paramValues}
        assetLibrary={assetLibrary}
        assetReference={{
          teamID: Number(space?.project.team_id || 0),
          projectID: projectId,
          assetCateID: nodeAssetCateId,
        }}
        connectedMediaReferences={connectedMediaReferences}
        onConnectedMediaEdgeRemove={onConnectedMediaEdgeRemove}
        onChange={setAgentPrompt}
        onParamChange={setAgentParamValue}
        onLocalUpload={handleLocalUpload}
        onSubmit={handleRun}
      />
    </div>
  );
}
