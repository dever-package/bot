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
  firstFrameMediaUsageKey,
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
  type NodeDraftUpdateOptions,
  type WorkspaceNodeData,
} from "./space-node-runtime";
import { PromptComposer, type UploadPreview } from "./space-prompt-composer";
import {
  reconcileStoryboardReferenceState,
  storyboardReferenceUsageOptions,
  storyboardReferenceValidationError,
} from "./space-storyboard-reference";
import { StoryboardWorkTypeSelect } from "./space-storyboard-work-type-select";
import { uploadSpaceFiles } from "./space-upload";
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
  const pendingDraftSignatureRef = useRef("");
  const [prompt, setPrompt] = useState(latestNodeDraft.prompt || "");
  const [promptContent, setPromptContent] = useState<
    CanvasReferenceContent | undefined
  >(latestNodeDraft.promptContent);
  const [storyboardReferences, setStoryboardReferences] = useState<
    CanvasStoryboardReference[]
  >(latestNodeDraft.storyboardReferences || []);
  const [storyboardWorkType, setStoryboardWorkType] =
    useState<StoryboardWorkType>(
      latestNodeDraft.storyboardWorkType || "short",
    );
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
            assetLibrary.current,
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
  const hasPendingLocalDraft =
    Boolean(pendingDraftSignatureRef.current) &&
    pendingDraftSignatureRef.current !== latestNodeDraftSignature;
  const savedMultiImageMode = hasPendingLocalDraft
    ? nodeDraftRef.current.multiImageMode ||
      requestedMultiImageMode ||
      effectiveMultiImageMode
    : latestNodeDraft.multiImageMode || effectiveMultiImageMode;
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
  const effectiveRunBlockedReason =
    runBlockedReason ||
    multiImagePlan.error ||
    configuredMediaError ||
    storyboardReferenceError;
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
      assetLibrary.current,
      isStoryboardPower,
    );
    setPrompt(savedDraft.prompt || "");
    setPromptContent(restoredStoryboard.content);
    setStoryboardReferences(restoredStoryboard.references);
    setStoryboardWorkType(savedDraft.storyboardWorkType || "short");
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

  const saveComposerParamValues = useCallback(
    (
      nextValues: Record<string, unknown>,
      draft: Omit<ComposerDraft, "paramValues">,
      options?: NodeDraftUpdateOptions,
    ) => {
      setParamValues(nextValues);
      return saveComposerDraft(
        { ...draft, paramValues: nextValues },
        options,
      );
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
    setStoryboardWorkType(nextWorkType);
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
            nextMultiImageMode,
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
          multiImageMode: nextMultiImageMode,
        });
        await onRunBackendNode({
          ...node,
          composerDraft: nextDraft,
        });
        toast.success("能力节点执行成功");
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
            referenceUsageOptions={
              isStoryboardPower ? storyboardUsageOptions : undefined
            }
            referenceUsageField={
              isStoryboardPower ? "purpose" : "usage"
            }
            multiImagePlan={multiImagePlan}
            multiImageMode={effectiveMultiImageMode}
            toolbarContent={
              isStoryboardPower
                ? ({ openKey, onToggle }) => (
                    <StoryboardWorkTypeSelect
                      value={storyboardWorkType}
                      options={powerForm?.storyboard_work_types || []}
                      disabled={powerFormLoading || nodeRunning}
                      openKey={openKey}
                      onToggle={onToggle}
                      onChange={updateStoryboardWorkType}
                    />
                  )
                : undefined
            }
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
