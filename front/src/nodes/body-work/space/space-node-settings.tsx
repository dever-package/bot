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
  isCanvasReferenceModeParam,
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
  type WorkspaceNodeData,
} from "./space-node-runtime";
import {
  PromptComposer,
  type UploadPreview,
} from "./space-prompt-composer";
import { reconcileStoryboardReferences } from "./space-storyboard-reference";
import { StoryboardInputReferenceEditor } from "./space-storyboard-reference-editor";
import { uploadSpaceFiles } from "./space-upload";
import { resolvePowerPresentation } from "../shared/power-presentation";
import type {
  CanvasComposerDraft,
  CanvasMultiImageMode,
  CanvasReferenceContent,
  CanvasStoryboardReference,
  PowerForm,
  PowerParam,
} from "./types";

const COMPOSER_DRAFT_SYNC_DELAY = 240;
const NODE_OVERLAY_STYLE: CSSProperties = { zIndex: 999 };
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
type ComposerDraftSyncMode = "immediate" | "deferred";

function powerFormAllowsSourceSelection(powerForm: PowerForm | null) {
  return Number(powerForm?.source_rule || 0) === 2;
}

export function CanvasNodeSettings({ node }: { node: WorkspaceNodeData }) {
  const {
    projectId,
    runningNode,
    onNodeDraftChange,
    onAssetCreated,
    onClearFeedbackRecords,
    onRunBackendNode,
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
  const pendingComposerDraftRef = useRef<ComposerDraft | null>(null);
  const composerDraftSyncTimerRef = useRef<number | null>(null);
  const [prompt, setPrompt] = useState(latestNodeDraft.prompt || "");
  const [promptContent, setPromptContent] = useState<
    CanvasReferenceContent | undefined
  >(latestNodeDraft.promptContent);
  const [storyboardReferences, setStoryboardReferences] = useState<
    CanvasStoryboardReference[]
  >(latestNodeDraft.storyboardReferences || []);
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
    if (pendingComposerDraftRef.current) {
      return;
    }
    nodeDraftRef.current = latestNodeDraft;
  }, [latestNodeDraft]);

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
          setPromptContent(savedDraft.promptContent);
          setStoryboardReferences(savedDraft.storyboardReferences || []);
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
      setRequestedMultiImageMode(undefined);
      setSelectedTargetId(0);
      return;
    }
    setParamValues({});
    setSelectedTargetId(0);
    setPrompt("");
    setPromptContent(undefined);
    setStoryboardReferences([]);
    setRequestedMultiImageMode(undefined);
  }, [
    catalogCache,
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
  const multiImagePlan = useMemo(
    () =>
      resolveCanvasMultiImagePlan({
        node,
        content: promptContent,
        items: assetLibrary.current,
        connections: connectedMediaReferences,
        params: powerParams,
        values: paramValues,
        requestedMode: requestedMultiImageMode,
      }),
    [
      assetLibrary,
      connectedMediaReferences,
      node,
      paramValues,
      powerParams,
      promptContent,
      requestedMultiImageMode,
    ],
  );
  const effectiveMultiImageMode = multiImagePlan.active
    ? multiImagePlan.mode
    : undefined;
  const mediaSourceParamValues = useMemo(
    () =>
      reconcileReferenceModeForMediaSources(
        powerParams,
        paramValues,
        connectedMediaReferences.map((reference) => reference.source),
        effectiveMultiImageMode,
      ),
    [
      connectedMediaReferences,
      paramValues,
      powerParams,
      effectiveMultiImageMode,
    ],
  );
  const activePowerParams = useMemo(
    () => filterActivePowerParams(powerParams, mediaSourceParamValues),
    [mediaSourceParamValues, powerParams],
  );
  const displayedPowerParams = useMemo(
    () =>
      activePowerParams.filter(
        (param) =>
          shouldDisplayPowerParam(param, powerParams) &&
          !(multiImagePlan.active && isCanvasReferenceModeParam(param)),
      ),
    [activePowerParams, multiImagePlan.active, powerParams],
  );
  const connectedMediaUsageOptions = useMemo(
    () =>
      selectedNodeType === "power" ? mediaUsageOptions(activePowerParams) : [],
    [activePowerParams, selectedNodeType],
  );
  const requireBoundMediaReferences =
    selectedNodeType === "power" &&
    ["image", "video"].includes(canvasMediaReferenceKind(node) || "");
  const configuredMediaError = useMemo(
    () =>
      selectedNodeType === "power" && !powerFormLoading
        ? canvasMediaUsageError(
            connectedMediaReferences,
            promptContent,
            assetLibrary.current,
            connectedMediaUsageOptions,
            {},
            requireBoundMediaReferences,
            effectiveMultiImageMode,
          )
        : "",
    [
      assetLibrary,
      connectedMediaReferences,
      connectedMediaUsageOptions,
      powerFormLoading,
      promptContent,
      requireBoundMediaReferences,
      selectedNodeType,
      effectiveMultiImageMode,
    ],
  );
  const effectiveRunBlockedReason =
    runBlockedReason || multiImagePlan.error || configuredMediaError;
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
    setPrompt(savedDraft.prompt || "");
    setPromptContent(savedDraft.promptContent);
    setStoryboardReferences(savedDraft.storyboardReferences || []);
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
  }, [latestNodeDraftSignature, selectedNodeType]);

  const clearComposerDraftSyncTimer = useCallback(() => {
    if (composerDraftSyncTimerRef.current === null) {
      return;
    }
    window.clearTimeout(composerDraftSyncTimerRef.current);
    composerDraftSyncTimerRef.current = null;
  }, []);

  const flushDeferredComposerDraft = useCallback(() => {
    clearComposerDraftSyncTimer();
    const pendingDraft = pendingComposerDraftRef.current;
    if (!pendingDraft) {
      return;
    }
    pendingComposerDraftRef.current = null;
    onNodeDraftChange(node.id, pendingDraft);
  }, [clearComposerDraftSyncTimer, node.id, onNodeDraftChange]);

  useEffect(
    () => () => {
      flushDeferredComposerDraft();
    },
    [flushDeferredComposerDraft],
  );

  const syncComposerDraft = useCallback(
    (draft: ComposerDraft, mode: ComposerDraftSyncMode) => {
      clearComposerDraftSyncTimer();
      if (mode === "deferred") {
        pendingComposerDraftRef.current = draft;
        composerDraftSyncTimerRef.current = window.setTimeout(
          flushDeferredComposerDraft,
          COMPOSER_DRAFT_SYNC_DELAY,
        );
        return;
      }
      pendingComposerDraftRef.current = null;
      onNodeDraftChange(node.id, draft);
    },
    [
      clearComposerDraftSyncTimer,
      flushDeferredComposerDraft,
      node.id,
      onNodeDraftChange,
    ],
  );

  const saveComposerDraft = useCallback(
    (
      draft: ComposerDraft,
      syncMode: ComposerDraftSyncMode = "immediate",
    ) => {
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
      });
      nodeDraftRef.current = normalized;
      setRequestedMultiImageMode(normalized.multiImageMode);
      syncComposerDraft(normalized, syncMode);
    },
    [promptContent, syncComposerDraft],
  );

  const saveComposerParamValues = useCallback(
    (
      nextValues: Record<string, unknown>,
      draft: Omit<ComposerDraft, "paramValues">,
      syncMode: ComposerDraftSyncMode = "immediate",
    ) => {
      setParamValues(nextValues);
      saveComposerDraft({ ...draft, paramValues: nextValues }, syncMode);
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
      multiImageMode: effectiveMultiImageMode,
    });
  }, [
    effectiveSelectedTargetId,
    mediaSourceParamValues,
    paramValues,
    powerPrompt,
    promptContent,
    saveComposerParamValues,
    effectiveMultiImageMode,
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
    setPromptContent(normalizedContent);
    const nextStoryboardReferences = isStoryboardPower && referencesChanged
      ? reconcileStoryboardReferences(
          normalizedContent,
          storyboardReferences,
          assetLibrary.current,
          nextPrompt,
        )
      : storyboardReferences;
    setStoryboardReferences(nextStoryboardReferences);
    const currentValues = nodeDraftRef.current.paramValues || paramValues;
    const nextValues = promptParam
      ? { ...currentValues, [promptParam.key]: nextPrompt }
      : currentValues;
    saveComposerParamValues(
      nextValues,
      {
        prompt: nextPrompt,
        promptContent: normalizedContent,
        selectedTargetId: effectiveSelectedTargetId,
        storyboardReferences: nextStoryboardReferences,
        multiImageMode: effectiveMultiImageMode,
      },
      referencesChanged ? "immediate" : "deferred",
    );
  }

  function updateStoryboardReferences(
    nextReferences: CanvasStoryboardReference[],
  ) {
    setStoryboardReferences(nextReferences);
    saveComposerDraft({
      prompt: powerPrompt,
      promptContent,
      paramValues,
      selectedTargetId: effectiveSelectedTargetId,
      storyboardReferences: nextReferences,
      multiImageMode: effectiveMultiImageMode,
    });
  }

  function setParamValue(key: string, value: unknown) {
    const nextValues = {
      ...(nodeDraftRef.current.paramValues || paramValues),
      [key]: value,
    };
    const changedParam = powerParams.find((param) => param.key === key);
    const nextMultiImageMode = effectiveMultiImageMode;
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
        nextMultiImageMode,
      );
      if (Object.keys(reconciliation.assignments).length > 0) {
        onConnectedMediaUsagesChange?.(reconciliation.assignments);
      }
      setPromptContent(reconciliation.content);
      saveComposerParamValues(nextValues, {
        prompt: powerPrompt,
        promptContent: reconciliation.content,
        selectedTargetId: effectiveSelectedTargetId,
        multiImageMode: nextMultiImageMode,
      });
      return;
    }
    saveComposerParamValues(nextValues, {
      prompt: powerPrompt,
      promptContent,
      selectedTargetId: effectiveSelectedTargetId,
      multiImageMode: nextMultiImageMode,
    });
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
      nextMode,
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
    saveComposerParamValues(nextValues, {
      prompt: powerPrompt,
      promptContent: reconciliation.content,
      selectedTargetId: effectiveSelectedTargetId,
      storyboardReferences,
      multiImageMode: nextMode,
    });
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
        paramValues,
        selectedTargetId: 0,
      },
      referencesChanged ? "immediate" : "deferred",
    );
  }

  function setAgentParamValue(key: string, value: unknown) {
    const nextValues = {
      ...(nodeDraftRef.current.paramValues || paramValues),
      [key]: value,
    };
    saveComposerParamValues(nextValues, {
      prompt,
      selectedTargetId: 0,
    });
  }

  async function handleLocalUpload(
    files: File[],
    param: PowerParam,
  ): Promise<UploadPreview[]> {
    const previews = await uploadSpaceFiles({
      projectID: projectId,
      teamID: Number(space?.project.team_id || 0),
      files,
      ruleID: param.upload_rule_id,
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
      const nextMultiImagePlan = resolveCanvasMultiImagePlan({
        node,
        content: promptContent,
        items: assetLibrary.current,
        connections: connectedMediaReferences,
        params: nextParams,
        values: mergedValues,
        requestedMode: requestedMultiImageMode || effectiveMultiImageMode,
      });
      const nextMultiImageMode = nextMultiImagePlan.active
        ? nextMultiImagePlan.mode
        : undefined;
      if (nextMultiImagePlan.error) {
        toast.error(`无法切换能力来源：${nextMultiImagePlan.error}`);
        return;
      }
      const nextValues = reconcileReferenceModeForMediaSources(
        nextParams,
        mergedValues,
        connectedMediaReferences.map((reference) => reference.source),
        nextMultiImageMode,
      );
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
      const mediaError = canvasMediaUsageError(
        connectedMediaReferences,
        reconciliation.content,
        assetLibrary.current,
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
      saveComposerParamValues(nextValues, {
        prompt: powerPrompt,
        promptContent: reconciliation.content,
        selectedTargetId: nextTargetId,
        multiImageMode: nextMultiImageMode,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "加载能力参数失败");
    }
  }

  const runNodeNow = async () => {
    onClearFeedbackRecords([node.id]);
    setRunning(true);
    try {
      if (node.type === "power" && node.power) {
        saveComposerDraft({
          prompt: powerPrompt,
          promptContent,
          paramValues: mediaSourceParamValues,
          selectedTargetId: effectiveSelectedTargetId,
          storyboardReferences,
          multiImageMode: effectiveMultiImageMode,
        });
        await onRunBackendNode({
          ...node,
          composerDraft: {
            ...nodeDraftRef.current,
            prompt: powerPrompt,
            promptContent,
            paramValues: mediaSourceParamValues,
            selectedTargetId: effectiveSelectedTargetId,
            storyboardReferences,
            multiImageMode: effectiveMultiImageMode,
          },
        });
        toast.success("能力节点执行成功");
        return;
      }
      if (node.type === "agent" && node.role) {
        saveComposerDraft({
          prompt,
          promptContent,
          paramValues,
          selectedTargetId: 0,
        });
        await onRunBackendNode({
          ...node,
          composerDraft: {
            prompt,
            promptContent,
            paramValues,
            selectedTargetId: 0,
          },
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

  const handleRun = async () => {
    if (nodeRunning) {
      return;
    }
    if (effectiveRunBlockedReason) {
      toast.error(effectiveRunBlockedReason);
      return;
    }
    await runNodeNow();
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
          <>
            <PromptComposer
              value={powerPrompt}
              referenceContent={promptContent}
              placeholder={powerInputPlaceholder}
              running={nodeRunning}
              textInputEnabled={Boolean(promptParam)}
              showMediaParamButtons
              mediaParamPower={powerForm?.power || node.power}
              sourceOptions={
                canSelectPowerSource ? powerForm?.sources || [] : []
              }
              selectedSourceId={effectiveSelectedTargetId}
              params={composerParams}
              paramValues={mediaSourceParamValues}
              assetLibrary={assetLibrary}
              assetReference={{
                teamID: Number(space?.project.team_id || 0),
                projectID: projectId,
                assetCateID: nodeAssetCateId,
              }}
              connectedMediaReferences={connectedMediaReferences}
              mediaUsageOptions={connectedMediaUsageOptions}
              multiImagePlan={multiImagePlan}
              multiImageMode={effectiveMultiImageMode}
              onConnectedMediaEdgeRemove={onConnectedMediaEdgeRemove}
              disabled={powerFormLoading}
              submitDisabled={Boolean(effectiveRunBlockedReason)}
              submitDisabledReason={effectiveRunBlockedReason}
              onChange={setPowerPrompt}
              onParamChange={setParamValue}
              onMultiImageModeChange={setMultiImageMode}
              onSourceChange={
                canSelectPowerSource
                  ? (targetId) => void selectPowerSource(targetId)
                  : undefined
              }
              onLocalUpload={handleLocalUpload}
              onSubmit={handleRun}
            />
            {isStoryboardPower ? (
              <StoryboardInputReferenceEditor
                references={storyboardReferences}
                disabled={powerFormLoading || nodeRunning}
                onChange={updateStoryboardReferences}
              />
            ) : null}
          </>
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
