import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  ChevronDown,
  FileText,
  Images,
  Link2,
  Loader2,
  Paperclip,
  Trash2,
  X,
} from "lucide-react";
import {
  isPowerParamOptionSelected,
  canvasPowerParamItems,
  normalizePowerParamValue,
  powerParamBooleanValue,
  powerParamOptionValue,
  resolvePowerParamOption,
} from "./space-power-param";
import {
  isPowerParamConditionController,
  normalizePowerParamPreviewType,
  PowerParamOptionDialog,
  SearchableOptionPicker,
} from "./space-power-param-runtime";
import { canvasTextParamLabel } from "./space-param-binding";
import { PowerIcon, PowerParamIcon } from "../shared/power-icon";
import {
  CanvasReferenceEditor,
  type CanvasReferencePickerRequest,
  type CanvasReferenceUsageField,
  type CanvasReferenceUsageOption,
} from "./space-reference-editor";
import {
  canvasImageReferenceParts,
  setCanvasFrameSelection,
  connectedMediaReferenceTargets,
  isCanvasReferenceModeParam,
  reconcileCanvasMediaUsages,
  selectedMediaReferenceAmount,
  type CanvasMultiImagePlan,
  type CanvasConnectedMediaReference,
  type MediaUsageOption,
} from "./space-media-references";
import { AssetKindIcon } from "../asset/asset-preview";
import { normalizeAssetRecord } from "../asset/asset-api";
import {
  useAssetReferenceProvider,
  type WorkbenchReferenceOption,
} from "../asset/asset-reference-provider";
import type { AssetKind as LibraryAssetKind } from "../asset/asset-types";
import type { AssetUploadOptions } from "../asset/asset-upload-progress";
import {
  acceptedAssetKinds,
  isToolbarPowerParam,
  isUploadPowerParam,
} from "./space-media-param";
import { reconcileConnectedCanvasReferences } from "./space-reference-content";
import { canvasReferenceBindingSignature } from "./space-model";
import { SpaceTooltip } from "./space-tooltip";
import { resolvePowerSourceDisplayName } from "../../shared/power-source-rule";
import type {
  CanvasParamBinding,
  CanvasParamBindings,
  CanvasMultiImageMode,
  CanvasReferenceContent,
  CanvasReferenceMediaItem,
  ComposerAssetItem,
  PowerOption,
  PowerParam,
  PowerParamSource,
} from "./types";

function sourceServiceLabel(source?: PowerParamSource): string {
  return resolvePowerSourceDisplayName(
    source?.service_name,
    source?.name,
    "来源",
  );
}
type PromptComposerProps = {
  value: string;
  placeholder: string;
  running?: boolean;
  disabled?: boolean;
  textInputEnabled?: boolean;
  showMediaParamButtons?: boolean;
  mediaParamPower?: PowerOption;
  submitDisabled?: boolean;
  submitDisabledReason?: string;
  sourceOptions?: PowerParamSource[];
  selectedSourceId?: number;
  params?: PowerParam[];
  primaryParam?: PowerParam;
  paramValues?: Record<string, unknown>;
  paramBindings?: CanvasParamBindings;
  paramBindingSources?: Record<string, CanvasParamBindingSourcePreview>;
  storyboardLyricsBindingSource?: CanvasParamBindingSourcePreview;
  assetLibrary?: {
    current: ComposerAssetItem[];
  };
  referenceContent?: CanvasReferenceContent;
  assetReference?: {
    teamID: number;
    projectID: number;
    assetCateID?: number;
  };
  connectedMediaReferences?: CanvasConnectedMediaReference[];
  mediaUsageOptions?: MediaUsageOption[];
  referenceUsageOptions?: CanvasReferenceUsageOption[];
  referenceUsageField?: CanvasReferenceUsageField;
  multiImagePlan?: CanvasMultiImagePlan;
  multiImageMode?: CanvasMultiImageMode;
  toolbarContent?: (menu: {
    openKey: string;
    onToggle: (key: string) => void;
  }) => ReactNode;
  onConnectedMediaEdgeRemove?: (edgeId: string) => void;
  onChange: (value: string, content?: CanvasReferenceContent) => void;
  onParamChange?: (key: string, value: unknown) => void;
  onParamBindingConnectionRemove?: (targetParamKey: string) => void;
  onStoryboardLyricsConnectionRemove?: () => void;
  onSourceChange?: (sourceId: number) => void;
  onMultiImageModeChange?: (mode: CanvasMultiImageMode) => void;
  onLocalUpload?: (
    files: File[],
    param: PowerParam,
    options?: AssetUploadOptions,
  ) => Promise<UploadPreview[]>;
  onSubmit: (
    value: string,
    content?: CanvasReferenceContent,
  ) => void | Promise<void>;
};

export type CanvasParamBindingSourcePreview = {
  title: string;
  text?: string;
};

const PROMPT_CHANGE_COMMIT_DELAY = 240;
const EMPTY_CONNECTED_MEDIA_REFERENCES: CanvasConnectedMediaReference[] = [];
const EMPTY_MEDIA_USAGE_OPTIONS: MediaUsageOption[] = [];
const EMPTY_PARAM_BINDINGS: CanvasParamBindings = {};
const EMPTY_PARAM_BINDING_SOURCES: Record<
  string,
  CanvasParamBindingSourcePreview
> = {};

export type UploadPreview = {
  name: string;
  type?: string;
  url?: string;
  alias?: string;
  kind?: string;
  source?: ComposerAssetItem["source"] | "upload";
  text?: string;
  output?: unknown;
  asset?: unknown;
};

export function PromptComposer({
  value,
  placeholder,
  running = false,
  disabled = false,
  textInputEnabled = true,
  showMediaParamButtons = false,
  mediaParamPower,
  submitDisabled = false,
  submitDisabledReason = "",
  sourceOptions = [],
  selectedSourceId = 0,
  params = [],
  primaryParam,
  paramValues = {},
  paramBindings = EMPTY_PARAM_BINDINGS,
  paramBindingSources = EMPTY_PARAM_BINDING_SOURCES,
  storyboardLyricsBindingSource,
  assetLibrary = { current: [] },
  referenceContent,
  assetReference,
  connectedMediaReferences = EMPTY_CONNECTED_MEDIA_REFERENCES,
  mediaUsageOptions = EMPTY_MEDIA_USAGE_OPTIONS,
  referenceUsageOptions,
  referenceUsageField = "usage",
  multiImagePlan,
  multiImageMode,
  toolbarContent,
  onConnectedMediaEdgeRemove,
  onChange,
  onParamChange,
  onParamBindingConnectionRemove,
  onStoryboardLyricsConnectionRemove,
  onSourceChange,
  onMultiImageModeChange,
  onLocalUpload,
  onSubmit,
}: PromptComposerProps) {
  const uploadParams = useMemo(
    () => params.filter(isUploadPowerParam),
    [params],
  );
  const primaryBinding = primaryParam
    ? paramBindings[primaryParam.key]
    : undefined;
  const primaryBindingSource = primaryBinding
    ? paramBindingSources[primaryBinding.sourceNodeId]
    : undefined;
  const rememberSelectedReference = useCallback(
    (option: WorkbenchReferenceOption) => {
      const item = composerAssetItemFromReferenceOption(option);
      assetLibrary.current = [
        ...assetLibrary.current.filter(
          (current) =>
            current.refType !== option.refType ||
            Number(current.refId || 0) !== option.refId,
        ),
        item,
      ];
    },
    [assetLibrary],
  );
  const uploadReferenceAssets = useCallback(
    async (
      files: File[],
      context: {
        preferredUsage?: string;
        acceptedKinds?: LibraryAssetKind[];
        onProgress?: AssetUploadOptions["onProgress"];
      },
    ) => {
      if (!onLocalUpload) {
        throw new Error("当前节点未配置本地上传");
      }
      const param = resolveUploadParam(uploadParams, context);
      if (!param) {
        throw new Error("当前能力没有与所选素材类型匹配的上传参数");
      }
      const previews = await onLocalUpload(files, param, {
        onProgress: context.onProgress,
      });
      const assets = previews
        .map((preview) => normalizeAssetRecord(preview.asset))
        .filter((asset) => asset.id > 0);
      if (assets.length === 0) {
        throw new Error("上传成功，但没有生成可用资产");
      }
      return assets;
    },
    [onLocalUpload, uploadParams],
  );
  const assetReferenceProvider = useAssetReferenceProvider({
    notificationMode: "inline",
    teamID: Number(assetReference?.teamID || 0),
    scopeProjectID: Number(assetReference?.projectID || 0),
    initialFilters: assetReference?.projectID
      ? {
          sourceType: "project",
          projectID: assetReference.projectID,
          assetCateID: Number(assetReference.assetCateID || 0),
        }
      : undefined,
    onSelect: rememberSelectedReference,
    onUpload: onLocalUpload ? uploadReferenceAssets : undefined,
  });
  const [openKey, setOpenKey] = useState("");
  const [referencePickerRequest, setReferencePickerRequest] = useState<
    CanvasReferencePickerRequest | undefined
  >();
  const referencePickerRequestID = useRef(0);
  const openMediaPicker = useCallback((param: PowerParam) => {
    setOpenKey("");
    referencePickerRequestID.current += 1;
    setReferencePickerRequest({
      id: referencePickerRequestID.current,
      trigger: "@",
      preferredUsage: param.key,
      acceptedKinds: acceptedAssetKinds(param),
    });
  }, []);
  const consumeReferencePickerRequest = useCallback(
    (requestID: CanvasReferencePickerRequest["id"]) => {
      setReferencePickerRequest((current) =>
        current?.id === requestID ? undefined : current,
      );
    },
    [],
  );
  const toolbarParams = useMemo(
    () =>
      params.filter(
        (param) =>
          isUploadPowerParam(param) ||
          Boolean(param.group) ||
          isToolbarPowerParam(param) ||
          isPowerParamConditionController(param, params),
      ),
    [params],
  );
  const toolbarItems = useMemo(
    () => canvasPowerParamItems(toolbarParams),
    [toolbarParams],
  );
  const selectedSource = useMemo(
    () =>
      sourceOptions.find(
        (source) =>
          source.target_id === selectedSourceId ||
          source.id === selectedSourceId,
      ),
    [selectedSourceId, sourceOptions],
  );
  const sourceUnavailable = selectedSourceId > 0 && !selectedSource;
  const frameUsages =
    multiImagePlan?.active && multiImageMode === "shared_reference"
      ? multiImagePlan.frameUsages
      : [];
  const hasReferenceModeControl = toolbarParams.some(
    isCanvasReferenceModeParam,
  );
  const multiImageModeControl = (
    <MultiImageModeControl
      plan={multiImagePlan}
      openKey={openKey}
      disabled={disabled || running}
      onToggle={setOpenKey}
      onChange={onMultiImageModeChange}
    />
  );
  const referenceItems = assetLibrary.current;
  const resolvedReferences = useMemo(() => {
    if (sourceUnavailable || disabled) {
      return { value, content: referenceContent };
    }
    const connectedReferences = reconcileConnectedCanvasReferences(
      value,
      referenceContent,
      connectedMediaReferenceTargets(connectedMediaReferences, referenceItems),
    );
    return {
      ...connectedReferences,
      content: reconcileCanvasMediaUsages(
        referenceContent,
        connectedReferences.content,
        referenceItems,
        mediaUsageOptions,
        connectedMediaReferences,
        multiImageMode,
      ).content,
    };
  }, [
    connectedMediaReferences,
    disabled,
    mediaUsageOptions,
    multiImageMode,
    referenceContent,
    referenceItems,
    sourceUnavailable,
    value,
  ]);
  const resolvedMediaUsageOptions = useMemo(
    () =>
      mediaUsageOptions.map((option) => ({
        key: option.key,
        label: option.label,
        acceptedKinds: option.acceptedKinds,
        maxFiles: option.maxFiles,
      })),
    [mediaUsageOptions],
  );
  const resolvedReferenceUsageOptions = useMemo(
    () => referenceUsageOptions || resolvedMediaUsageOptions,
    [referenceUsageOptions, resolvedMediaUsageOptions],
  );
  const mediaParamCounts = useMemo(
    () => referenceUsageCounts(resolvedReferences.content),
    [resolvedReferences.content],
  );
  const currentReferenceSignature = useMemo(
    () => referenceStateSignature(value, referenceContent),
    [referenceContent, value],
  );
  const resolvedReferenceSignature = useMemo(
    () =>
      referenceStateSignature(
        resolvedReferences.value,
        resolvedReferences.content,
      ),
    [resolvedReferences.content, resolvedReferences.value],
  );
  const latestEditorDraftRef = useRef({
    value: resolvedReferences.value,
    content: resolvedReferences.content as CanvasReferenceContent | undefined,
  });
  const pendingEditorChangeRef = useRef(false);
  const editorChangeTimerRef = useRef<number | null>(null);
  const onChangeRef = useRef(onChange);
  const onSubmitRef = useRef(onSubmit);
  onChangeRef.current = onChange;
  onSubmitRef.current = onSubmit;

  const clearEditorChangeTimer = useCallback(() => {
    if (editorChangeTimerRef.current === null) {
      return;
    }
    window.clearTimeout(editorChangeTimerRef.current);
    editorChangeTimerRef.current = null;
  }, []);
  const commitLatestEditorDraft = useCallback(() => {
    clearEditorChangeTimer();
    if (!pendingEditorChangeRef.current) {
      return;
    }
    pendingEditorChangeRef.current = false;
    const draft = latestEditorDraftRef.current;
    onChangeRef.current(draft.value, draft.content);
  }, [clearEditorChangeTimer]);
  const updateEditorDraft = useCallback(
    (
      nextValue: string,
      nextContent?: CanvasReferenceContent,
      immediate = false,
    ) => {
      const previousContent = latestEditorDraftRef.current.content;
      latestEditorDraftRef.current = {
        value: nextValue,
        content: nextContent,
      };
      pendingEditorChangeRef.current = true;
      const referencesChanged =
        canvasReferenceBindingSignature(previousContent) !==
        canvasReferenceBindingSignature(nextContent);
      if (immediate || referencesChanged) {
        commitLatestEditorDraft();
        return;
      }
      clearEditorChangeTimer();
      editorChangeTimerRef.current = window.setTimeout(
        commitLatestEditorDraft,
        PROMPT_CHANGE_COMMIT_DELAY,
      );
    },
    [clearEditorChangeTimer, commitLatestEditorDraft],
  );
  const selectReferenceMediaUsage = useCallback((
    reference: Extract<CanvasReferenceContent["parts"][number], { type: "reference" }>,
    usage: string,
    media?: CanvasReferenceMediaItem,
  ) => {
    const draft = latestEditorDraftRef.current;
    if (!draft.content) return "请先添加参考图片";
    const parts = canvasImageReferenceParts(draft.content, referenceItems, connectedMediaReferences);
    const part = parts.find((part) =>
      part.ref_type === reference.ref_type && part.ref_id === reference.ref_id &&
      Number(part.ref_version_id || 0) === Number(reference.ref_version_id || 0),
    );
    if (!part) return "引用图片已变化，请重新选择";
    try {
      const content = setCanvasFrameSelection(draft.content, parts, usage,
        media ? { part, media, label: reference.label } : undefined);
      updateEditorDraft(draft.value, content, true);
    } catch (error) {
      return error instanceof Error ? error.message : String(error);
    }
  }, [connectedMediaReferences, referenceItems, updateEditorDraft]);
  const submitLatestEditorDraft = useCallback(() => {
    const draft = latestEditorDraftRef.current;
    commitLatestEditorDraft();
    return onSubmitRef.current(draft.value, draft.content);
  }, [commitLatestEditorDraft]);

  useEffect(() => {
    if (pendingEditorChangeRef.current) {
      return;
    }
    latestEditorDraftRef.current = {
      value: resolvedReferences.value,
      content: resolvedReferences.content,
    };
  }, [
    resolvedReferenceSignature,
    resolvedReferences.content,
    resolvedReferences.value,
  ]);

  useEffect(
    () => () => {
      commitLatestEditorDraft();
    },
    [commitLatestEditorDraft],
  );

  useEffect(() => {
    if (disabled || running) {
      setOpenKey("");
    }
  }, [disabled, running]);

  useEffect(() => {
    if (sourceUnavailable || disabled) {
      return;
    }
    if (currentReferenceSignature === resolvedReferenceSignature) {
      return;
    }
    if (pendingEditorChangeRef.current) {
      return;
    }
    updateEditorDraft(
      resolvedReferences.value,
      resolvedReferences.content,
      true,
    );
  }, [
    currentReferenceSignature,
    disabled,
    resolvedReferenceSignature,
    resolvedReferences.content,
    resolvedReferences.value,
    sourceUnavailable,
    updateEditorDraft,
  ]);

  return (
    <div
      className={`ws-prompt-composer nowheel ${running ? "is-running" : ""}`}
    >
      <div className="ws-prompt-main">
        <div className="ws-prompt-editor-shell">
          {primaryParam && primaryBinding ? (
            <TextBindingPreview
              label={canvasTextParamLabel(primaryParam)}
              source={primaryBindingSource}
              compact
              disabled={disabled || running}
              onRemove={() =>
                onParamBindingConnectionRemove?.(primaryParam.key)
              }
            />
          ) : null}
          {storyboardLyricsBindingSource ? (
            <TextBindingPreview
              label="歌词"
              source={storyboardLyricsBindingSource}
              compact
              disabled={disabled || running}
              onRemove={() => onStoryboardLyricsConnectionRemove?.()}
            />
          ) : null}
          <CanvasReferenceEditor
            className="ws-prompt-reference-editor nodrag nopan"
            value={resolvedReferences.value}
            content={resolvedReferences.content}
            disabled={disabled || running}
            textEditable={textInputEnabled}
            placeholder={placeholder}
            items={referenceItems}
            usageOptions={
              frameUsages.length > 0 ? [] : resolvedReferenceUsageOptions
            }
            usageField={referenceUsageField}
            mediaUsageOptions={resolvedMediaUsageOptions}
            mediaSelectionMaxFiles={
              multiImagePlan?.active && multiImageMode === "per_image"
                ? 0
                : undefined
            }
            mediaSelectionUsages={frameUsages.length ? frameUsages : undefined}
            onReferenceMediaUsageSelect={selectReferenceMediaUsage}
            autoAssignUsage={referenceUsageField !== "purpose"}
            pickerRequest={referencePickerRequest}
            onPickerRequestConsumed={consumeReferencePickerRequest}
            assetReferenceProvider={
              assetReference?.teamID ? assetReferenceProvider : undefined
            }
            onReferenceDelete={(reference) => {
              if (reference.ref_origin === "edge" && reference.ref_origin_id) {
                onConnectedMediaEdgeRemove?.(reference.ref_origin_id);
              }
            }}
            onChange={updateEditorDraft}
            onBlur={commitLatestEditorDraft}
            onSubmit={
              !running && !submitDisabled
                ? () => void submitLatestEditorDraft()
                : undefined
            }
          />
        </div>
      </div>
      <div className="ws-prompt-toolbar">
        <div className="ws-prompt-tools">
          {sourceOptions.length > 0 || selectedSourceId > 0 ? (
            <ComposerMenu
              id="source"
              openKey={openKey}
              label={
                sourceUnavailable
                  ? "来源不可用，请重新选择"
                  : sourceServiceLabel(selectedSource)
              }
              icon={<FileText size={15} />}
              disabled={disabled || running}
              onToggle={setOpenKey}
            >
              <div className="ws-prompt-menu-list">
                {sourceOptions.length === 0 ? (
                  <span className="ws-prompt-menu-item" role="status">
                    暂无可用来源
                  </span>
                ) : null}
                {sourceOptions.map((source) => {
                  const sourceId = source.target_id || source.id;
                  const active = sourceId === selectedSourceId;
                  return (
                    <button
                      key={sourceId}
                      type="button"
                      className={`ws-prompt-menu-item ${active ? "is-active" : ""}`}
                      disabled={disabled || running}
                      onClick={() => {
                        onSourceChange?.(sourceId);
                        setOpenKey("");
                      }}
                    >
                      <span>{sourceServiceLabel(source)}</span>
                      {active ? <CheckCircle2 size={14} /> : null}
                    </button>
                  );
                })}
              </div>
            </ComposerMenu>
          ) : null}

          {toolbarContent?.({ openKey, onToggle: setOpenKey })}

          {!hasReferenceModeControl ? multiImageModeControl : null}

          {!showMediaParamButtons && uploadParams.length > 0 ? (
            <ComposerMenu
              id="attachments"
              openKey={openKey}
              label="添加素材"
              icon={<Paperclip size={17} />}
              iconOnly
              variant="attachments"
              disabled={disabled || running}
              onToggle={setOpenKey}
            >
              <div className="ws-prompt-menu-list is-attachments" role="menu">
                {uploadParams.map((param) => (
                  <button
                    key={param.key}
                    type="button"
                    className="ws-prompt-menu-item"
                    role="menuitem"
                    onClick={() => openMediaPicker(param)}
                  >
                    <span className="ws-prompt-menu-kind-icon">
                      <AssetKindIcon kind={uploadParamKind(param)} />
                    </span>
                    <span>{uploadParamLabel(param)}</span>
                  </button>
                ))}
              </div>
            </ComposerMenu>
          ) : null}

          {toolbarItems.map((item) => {
            if ("group" in item) {
              return (
                <ParamGroupMenu
                  key={item.key}
                  group={item.group}
                  params={item.params}
                  values={paramValues}
                  bindings={paramBindings}
                  bindingSources={paramBindingSources}
                  mediaCounts={mediaParamCounts}
                  mediaPower={mediaParamPower}
                  openKey={openKey}
                  disabled={disabled || running}
                  onToggle={setOpenKey}
                  onChange={(param, value) => onParamChange?.(param.key, value)}
                  onMediaPick={openMediaPicker}
                  onBindingRemove={onParamBindingConnectionRemove}
                />
              );
            }
            const param = item.param;
            const binding = paramBindings[param.key];
            const paramControl = isUploadPowerParam(param) ? (
              showMediaParamButtons ? (
                <MediaParamButton
                  param={param}
                  power={mediaParamPower}
                  selectedCount={mediaParamCounts.get(param.key) || 0}
                  disabled={disabled || running}
                  onClick={() => openMediaPicker(param)}
                />
              ) : null
            ) : (
              <ParamMenu
                param={param}
                value={paramValues[param.key]}
                binding={binding}
                bindingSource={
                  binding
                    ? paramBindingSources[binding.sourceNodeId]
                    : undefined
                }
                openKey={openKey}
                disabled={disabled || running}
                onToggle={setOpenKey}
                onChange={(nextValue) => onParamChange?.(param.key, nextValue)}
                onBindingRemove={onParamBindingConnectionRemove}
              />
            );
            return (
              <Fragment key={param.key}>
                {paramControl}
                {isCanvasReferenceModeParam(param)
                  ? multiImageModeControl
                  : null}
              </Fragment>
            );
          })}
        </div>

        <div className="ws-prompt-submit-group">
          <SpaceTooltip label={submitDisabledReason || undefined}>
            <button
              type="button"
              className="ws-prompt-submit"
              disabled={disabled || running || submitDisabled}
              onClick={() => void submitLatestEditorDraft()}
              aria-label={submitDisabledReason || "发送"}
            >
              {running ? (
                <Loader2 size={17} className="ws-spin" />
              ) : (
                <ArrowUp size={18} />
              )}
            </button>
          </SpaceTooltip>
        </div>
      </div>
    </div>
  );
}

function MultiImageModeControl({
  plan,
  openKey,
  disabled,
  onToggle,
  onChange,
}: {
  plan?: CanvasMultiImagePlan;
  openKey: string;
  disabled: boolean;
  onToggle: (key: string) => void;
  onChange?: (mode: CanvasMultiImageMode) => void;
}) {
  if (!plan?.active || !plan.mode || (!plan.frameUsages.length && plan.imageCount <= 1 && !plan.structured)) {
    return null;
  }
  const enabledOptions = plan.options.filter((option) => option.enabled);
  const selectedOption = enabledOptions.find(
    (option) => option.value === plan.mode,
  );
  const selectedLabel =
    plan.mode === "shared_reference" &&
    plan.frameUsages.length > 0 &&
    plan.imageCount === 1
      ? "首帧生成"
      : selectedOption?.label ||
        (plan.mode === "per_image" ? "每图一条视频" : "多图共同参考");
  const outputCount = plan.mode === "per_image" ? plan.imageCount : 1;
  const label = `${selectedLabel} · 共${outputCount}条`;
  if (plan.options.length <= 1) {
    return (
      <span className="ws-prompt-tool-wrap">
        <span className="ws-prompt-tool is-static" aria-label={label}>
          <Images size={15} />
          <span>{label}</span>
        </span>
      </span>
    );
  }
  return (
    <ComposerMenu
      id="multi-image-mode"
      openKey={openKey}
      label={label}
      icon={<Images size={15} />}
      disabled={disabled}
      onToggle={onToggle}
    >
      <div className="ws-prompt-menu-list">
        {plan.options.map((option) => {
          const active = option.value === plan.mode;
          const optionOutputCount =
            option.value === "per_image" ? plan.imageCount : 1;
          return (
            <button
              key={option.value}
              type="button"
              className={`ws-prompt-menu-item ${active ? "is-active" : ""}`}
              disabled={disabled || !option.enabled}
              title={option.reason}
              onClick={() => {
                onChange?.(option.value);
                onToggle("");
              }}
            >
              <span>{`${option.label} · 共${optionOutputCount}条`}</span>
              {active ? <CheckCircle2 size={14} /> : null}
            </button>
          );
        })}
      </div>
    </ComposerMenu>
  );
}

function MediaParamButton({
  param,
  power,
  selectedCount,
  disabled,
  onClick,
}: {
  param: PowerParam;
  power?: PowerOption;
  selectedCount: number;
  disabled?: boolean;
  onClick: () => void;
}) {
  const selected = selectedCount > 0;
  return (
    <SpaceTooltip label={mediaParamTooltip(param, selectedCount)}>
      <button
        type="button"
        className={`ws-prompt-tool is-media-param ${selected ? "is-selected" : ""}`}
        disabled={disabled}
        aria-pressed={selected}
        onClick={onClick}
      >
        <PowerIcon power={power} size={15} />
        <span>{uploadParamLabel(param)}</span>
        {param.type === "files" && selected ? (
          <small className="ws-prompt-media-count">{selectedCount}</small>
        ) : null}
      </button>
    </SpaceTooltip>
  );
}

function composerAssetItemFromReferenceOption(
  option: WorkbenchReferenceOption,
): ComposerAssetItem {
  const kind = String(option.preview?.kind || "file");
  const url = String(option.preview?.url || "");
  return {
    id: `${option.refType}:${option.refId}`,
    title: option.label,
    kind,
    source: option.refType,
    refType: option.refType,
    refId: option.refId,
    versionID: option.versionID,
    output: option.output,
    asset: option.asset,
    preview: {
      text: option.description || "",
      imageUrl: kind === "image" ? url : "",
      videoUrl: kind === "video" ? url : "",
      audioUrl: kind === "audio" ? url : "",
      fileUrl: kind === "file" ? url : "",
    },
  };
}

function ParamMenu({
  param,
  value,
  binding,
  bindingSource,
  openKey,
  disabled,
  onToggle,
  onChange,
  onBindingRemove,
}: {
  param: PowerParam;
  value: unknown;
  binding?: CanvasParamBinding;
  bindingSource?: CanvasParamBindingSourcePreview;
  openKey: string;
  disabled?: boolean;
  onToggle: (key: string) => void;
  onChange: (value: unknown) => void;
  onBindingRemove?: (targetParamKey: string) => void;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewContainer, setPreviewContainer] = useState<HTMLElement | null>(
    null,
  );
  const previewType = normalizePowerParamPreviewType(param.preview_type);

  useEffect(() => {
    if (disabled || previewType === "none") {
      setPreviewOpen(false);
    }
  }, [disabled, previewType]);

  if (
    (param.type === "option" || param.type === "select") &&
    previewType !== "none"
  ) {
    const label = paramControlLabel(param, value);
    return (
      <>
        <span className="ws-prompt-tool-wrap">
          <button
            type="button"
            className="ws-prompt-tool"
            disabled={disabled}
            aria-label={label}
            onClick={(event) => {
              onToggle("");
              setPreviewContainer(
                event.currentTarget.closest<HTMLElement>(
                  ".ws-storyboard-workspace-editor-anchor",
                ),
              );
              setPreviewOpen(true);
            }}
          >
            <PowerParamIcon name={param.icon} size={15} />
            <span>{label}</span>
            <ChevronDown size={14} />
          </button>
        </span>
        <PowerParamOptionDialog
          open={previewOpen}
          portalContainer={previewContainer}
          layerZIndex={previewContainer ? 1100 : undefined}
          title={param.name || param.key}
          previewType={previewType}
          options={param.options || []}
          value={value}
          disabled={disabled}
          onOpenChange={setPreviewOpen}
          onConfirm={(nextValue) =>
            onChange(normalizePowerParamValue(param, nextValue))
          }
        />
      </>
    );
  }

  return (
    <ComposerMenu
      id={param.key}
      openKey={openKey}
      label={
        binding
          ? `${canvasTextParamLabel(param)} · 已连接`
          : paramControlLabel(param, value)
      }
      icon={
        binding ? (
          <Link2 size={15} />
        ) : (
          <PowerParamIcon name={param.icon} size={15} />
        )
      }
      filled={Boolean(binding)}
      disabled={disabled}
      onToggle={onToggle}
    >
      {binding ? (
        <TextBindingPreview
          label={canvasTextParamLabel(param)}
          source={bindingSource}
          disabled={disabled}
          onRemove={() => onBindingRemove?.(param.key)}
        />
      ) : (
        <ParamEditor
          param={param}
          value={value}
          onChange={onChange}
          onClose={() => onToggle("")}
        />
      )}
    </ComposerMenu>
  );
}

function ParamGroupMenu({
  group,
  params,
  values,
  bindings,
  bindingSources,
  mediaCounts,
  mediaPower,
  openKey,
  disabled,
  onToggle,
  onChange,
  onMediaPick,
  onBindingRemove,
}: {
  group: NonNullable<PowerParam["group"]>;
  params: PowerParam[];
  values: Record<string, unknown>;
  bindings: CanvasParamBindings;
  bindingSources: Record<string, CanvasParamBindingSourcePreview>;
  mediaCounts: Map<string, number>;
  mediaPower?: PowerOption;
  openKey: string;
  disabled?: boolean;
  onToggle: (key: string) => void;
  onChange: (param: PowerParam, value: unknown) => void;
  onMediaPick: (param: PowerParam) => void;
  onBindingRemove?: (key: string) => void;
}) {
  const [preview, setPreview] = useState<{
    param: PowerParam;
    container: HTMLElement | null;
  } | null>(null);
  useEffect(() => {
    if (disabled) setPreview(null);
  }, [disabled]);
  return (
    <>
      <ComposerMenu
        id={`param-group:${group.id}`}
        openKey={openKey}
        label={group.name}
        icon={<PowerParamIcon name={group.icon} size={15} />}
        variant="group"
        disabled={disabled}
        onToggle={onToggle}
      >
        <div className="ws-prompt-param-group">
          {params.map((param) => {
            const binding = bindings[param.key];
            const richOption =
              param.type === "option" &&
              normalizePowerParamPreviewType(param.preview_type) !== "none";
            return (
              <div className="ws-prompt-param-group-field" key={param.key}>
                <label>
                  {param.name}
                  {param.required ? (
                    <span className="ws-prompt-param-required"> *</span>
                  ) : null}
                </label>
                {binding ? (
                  <TextBindingPreview
                    label={canvasTextParamLabel(param)}
                    source={bindingSources[binding.sourceNodeId]}
                    disabled={disabled}
                    onRemove={() => onBindingRemove?.(param.key)}
                  />
                ) : isUploadPowerParam(param) ? (
                  <MediaParamButton
                    param={param}
                    power={mediaPower}
                    selectedCount={mediaCounts.get(param.key) || 0}
                    disabled={disabled}
                    onClick={() => onMediaPick(param)}
                  />
                ) : richOption ? (
                  <button
                    type="button"
                    className="ws-prompt-group-option"
                    disabled={disabled}
                    onClick={(event) => {
                      setPreview({
                        param,
                        container: event.currentTarget.closest<HTMLElement>(
                          ".ws-storyboard-workspace-editor-anchor",
                        ),
                      });
                      onToggle("");
                    }}
                  >
                    <span>{paramControlLabel(param, values[param.key])}</span>
                    <ChevronDown size={14} />
                  </button>
                ) : (
                  <ParamEditor
                    param={param}
                    value={values[param.key]}
                    inline
                    onChange={(value) => onChange(param, value)}
                    onClose={() => {}}
                  />
                )}
              </div>
            );
          })}
        </div>
      </ComposerMenu>
      {preview ? (
        <PowerParamOptionDialog
          open
          portalContainer={preview.container}
          layerZIndex={preview.container ? 1100 : undefined}
          title={preview.param.name}
          previewType={normalizePowerParamPreviewType(
            preview.param.preview_type,
          )}
          options={preview.param.options || []}
          value={values[preview.param.key]}
          disabled={disabled}
          onOpenChange={(open) => {
            if (!open) setPreview(null);
          }}
          onConfirm={(value) =>
            onChange(
              preview.param,
              normalizePowerParamValue(preview.param, value),
            )
          }
        />
      ) : null}
    </>
  );
}

function TextBindingPreview({
  label,
  source,
  compact = false,
  disabled,
  onRemove,
}: {
  label: string;
  source?: CanvasParamBindingSourcePreview;
  compact?: boolean;
  disabled?: boolean;
  onRemove: () => void;
}) {
  const sourceTitle = String(source?.title || "上游节点").trim();
  const previewText = String(source?.text || "").trim();
  return (
    <div className={`ws-param-binding-preview ${compact ? "is-compact" : ""}`}>
      <div className="ws-param-binding-preview-heading">
        <Link2 size={15} aria-hidden="true" />
        <span>
          <strong>{label}</strong>
          <small title={sourceTitle}>来自 {sourceTitle}</small>
        </span>
        <SpaceTooltip label="删除连接">
          <button
            type="button"
            className="ws-param-binding-remove"
            disabled={disabled}
            aria-label="删除连接"
            onClick={onRemove}
          >
            <Trash2 size={14} />
          </button>
        </SpaceTooltip>
      </div>
      <p
        className={previewText ? "" : "is-empty"}
        title={previewText || undefined}
      >
        {previewText || "等待上游生成"}
      </p>
    </div>
  );
}

export function ComposerMenu({
  id,
  openKey,
  label,
  icon,
  iconOnly = false,
  variant = "default",
  filled = false,
  disabled,
  children,
  onToggle,
}: {
  id: string;
  openKey: string;
  label: string;
  icon: ReactNode;
  iconOnly?: boolean;
  variant?: "default" | "attachments" | "group";
  filled?: boolean;
  disabled?: boolean;
  children: ReactNode;
  onToggle: (key: string) => void;
}) {
  const open = !disabled && openKey === id;
  const variantClass =
    variant === "attachments"
      ? "is-attachments"
      : variant === "group"
        ? "is-parameter-group"
        : "";
  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const cancelClose = useCallback(() => {
    if (closeTimerRef.current == null) {
      return;
    }
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = null;
  }, []);
  const scheduleClose = useCallback(() => {
    cancelClose();
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      onToggle("");
    }, 240);
  }, [cancelClose, onToggle]);

  useEffect(() => {
    if (!open) {
      cancelClose();
    }
    return cancelClose;
  }, [cancelClose, open]);

  useEffect(() => {
    if (!open || variant !== "group") return;
    const closeOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !wrapperRef.current?.contains(event.target)
      )
        onToggle("");
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onToggle("");
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
    };
  }, [onToggle, open, variant]);

  return (
    <span
      ref={wrapperRef}
      className={`ws-prompt-tool-wrap ${variantClass} ${open ? "is-open" : ""}`}
      onMouseEnter={() => {
        cancelClose();
        if (!disabled && variant !== "group") {
          onToggle(id);
        }
      }}
      onMouseLeave={() => {
        if (open && variant !== "group") {
          scheduleClose();
        }
      }}
    >
      <button
        type="button"
        className={`ws-prompt-tool ${iconOnly ? "is-icon-only" : ""} ${open ? "is-open" : ""} ${filled ? "is-filled" : ""}`}
        disabled={disabled}
        aria-label={label}
        aria-expanded={open}
        aria-haspopup={variant === "attachments" ? "menu" : undefined}
        onClick={() => {
          if (!disabled) {
            cancelClose();
            onToggle(open ? "" : id);
          }
        }}
      >
        {icon}
        {!iconOnly ? <span>{label}</span> : null}
        {!iconOnly ? <ChevronDown size={14} /> : null}
      </button>
      {open ? (
        <div
          className={`ws-prompt-popover ${variantClass}`}
          onMouseEnter={cancelClose}
        >
          {children}
        </div>
      ) : null}
    </span>
  );
}

function MultiOptionParamEditor({
  param,
  value,
  onChange,
}: {
  param: PowerParam;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const selected = valueAsList(value);
  const options = param.options || [];
  const full = !!param.max_items && selected.length >= param.max_items;
  const label = (value: string) => {
    const option = resolvePowerParamOption(options, value);
    return option?.name || option?.value || value;
  };
  const move = (index: number, offset: number) => {
    const next = [...selected];
    [next[index], next[index + offset]] = [next[index + offset], next[index]];
    onChange(next);
  };
  return (
    <div className="ws-prompt-multi-select" onPointerDown={(event) => event.stopPropagation()}>
      <SearchableOptionPicker
        multiple
        clearable={false}
        value={selected}
        options={options
          .filter((option) => !full || isPowerParamOptionSelected(option, selected, options))
          .map((option) => ({ id: powerParamOptionValue(option), value: option.name || option.value }))}
        placeholder="选择选项，可多选"
        className="border-0 bg-muted/30 shadow-none"
        onChange={(next) => onChange(normalizePowerParamValue(param, next))}
      />
      {selected.length > 0 ? (
        <div className="ws-prompt-selected-list">
          {selected.map((current, index) => (
            <div className="ws-prompt-selected-item" key={current}>
              <span className="ws-prompt-selected-order">{index + 1}</span>
              <span className="ws-prompt-selected-name">{label(current)}</span>
              <button type="button" aria-label={`前移${label(current)}`} disabled={index === 0} onClick={() => move(index, -1)}>
                <ArrowUp size={12} />
              </button>
              <button type="button" aria-label={`后移${label(current)}`} disabled={index === selected.length - 1} onClick={() => move(index, 1)}>
                <ArrowDown size={12} />
              </button>
              <button type="button" aria-label={`移除${label(current)}`} onClick={() => onChange(selected.filter((item) => item !== current))}>
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      ) : null}
      <small className="ws-prompt-selection-count">
        已选 {selected.length}{param.max_items ? ` / ${param.max_items}` : ""} 项{full ? " · 可先移除再添加" : ""}
      </small>
    </div>
  );
}

function ParamEditor({
  param,
  value,
  onChange,
  onClose,
  inline = false,
}: {
  param: PowerParam;
  value: unknown;
  onChange: (value: unknown) => void;
  onClose: () => void;
  inline?: boolean;
}) {
  if (param.type === "option" || param.type === "select") {
    const options = param.options || [];
    if (inline) {
      const selected = resolvePowerParamOption(options, value);
      return (
        <select
          className="ws-prompt-param-input"
          aria-label={param.name}
          value={selected ? powerParamOptionValue(selected) : ""}
          onChange={(event) =>
            onChange(normalizePowerParamValue(param, event.target.value))
          }
        >
          {!selected ? <option value="">请选择{param.name}</option> : null}
          {options.map((option) => (
            <option key={option.id} value={powerParamOptionValue(option)}>
              {option.name || option.value}
            </option>
          ))}
        </select>
      );
    }
    return (
      <div className="ws-prompt-menu-list">
        {options.map((option) => {
          const active = isPowerParamOptionSelected(
            option,
            [String(value ?? "")],
            options,
          );
          return (
            <button
              key={option.id || option.value}
              type="button"
              className={`ws-prompt-menu-item ${active ? "is-active" : ""}`}
              onClick={() => {
                onChange(
                  normalizePowerParamValue(
                    param,
                    powerParamOptionValue(option),
                  ),
                );
                onClose();
              }}
            >
              <span>{option.name || option.value}</span>
              {active ? <CheckCircle2 size={14} /> : null}
            </button>
          );
        })}
      </div>
    );
  }

  if (param.type === "multi_option") {
    return <MultiOptionParamEditor param={param} value={value} onChange={onChange} />;
  }
  if (param.type === "description") {
    return <p className="ws-prompt-param-description">{String(value || param.default_value || "")}</p>;
  }

  if (param.type === "switch") {
    const active = powerParamBooleanValue(value);
    return (
      <button
        type="button"
        className={`ws-prompt-switch ${active ? "is-on" : ""}`}
        onClick={() => onChange(!active)}
      >
        <span>{param.name}</span>
        <i />
      </button>
    );
  }

  if (param.type === "prompt" || param.type === "textarea") {
    return (
      <textarea
        className="ws-prompt-param-textarea"
        aria-label={param.name}
        value={valueAsText(value)}
        placeholder={param.name}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <input
      className="ws-prompt-param-input"
      aria-label={param.name}
      type={param.value_type === "number" ? "number" : "text"}
      value={valueAsText(value)}
      placeholder={param.name}
      onChange={(event) =>
        onChange(
          param.value_type === "number"
            ? Number(event.target.value)
            : event.target.value,
        )
      }
    />
  );
}

function paramControlLabel(param: PowerParam, value: unknown) {
  if (param.type === "switch") {
    return `${param.name}: ${powerParamBooleanValue(value) ? "开" : "关"}`;
  }
  if (param.type === "multi_option") {
    const count = valueAsList(value).length;
    return count > 0 ? `${param.name} ${count}` : param.name;
  }
  if (param.type === "option" || param.type === "select") {
    const option = resolvePowerParamOption(param.options || [], value);
    return option?.name || param.name;
  }
  const text = valueAsText(value);
  return text ? `${param.name}: ${text}` : param.name;
}

function resolveUploadParam(
  params: PowerParam[],
  context: {
    preferredUsage?: string;
    acceptedKinds?: LibraryAssetKind[];
  },
) {
  const preferredUsage = String(context.preferredUsage || "").trim();
  if (preferredUsage) {
    const preferred = params.find((param) => param.key === preferredUsage);
    if (preferred) {
      return preferred;
    }
  }
  const acceptedKinds = new Set(context.acceptedKinds || []);
  if (acceptedKinds.size > 0) {
    const compatible = params.find((param) =>
      acceptedAssetKinds(param).some((kind) => acceptedKinds.has(kind)),
    );
    if (compatible) {
      return compatible;
    }
  }
  return params.length === 1 ? params[0] : undefined;
}

function referenceStateSignature(
  value: string,
  content: CanvasReferenceContent | undefined,
) {
  return JSON.stringify([String(value || ""), content?.parts || []]);
}

function referenceUsageCounts(content?: CanvasReferenceContent) {
  const counts = new Map<string, number>();
  for (const part of content?.parts || []) {
    if (part.type !== "reference" || part.ref_media_excluded) {
      continue;
    }
    if (part.ref_media_items?.some((item) => item.usage)) {
      for (const item of part.ref_media_items) {
        const usage = item.usage || part.usage;
        if (usage) counts.set(usage, (counts.get(usage) || 0) + 1);
      }
      continue;
    }
    if (!part.usage) continue;
    const amount = selectedMediaReferenceAmount(
      part,
      Number(part.ref_media_count || 0),
    );
    counts.set(part.usage, (counts.get(part.usage) || 0) + amount);
  }
  return counts;
}

function mediaParamTooltip(param: PowerParam, selectedCount: number) {
  const label = uploadParamLabel(param);
  if (param.type !== "files") {
    return selectedCount > 0 ? `${label}：已选择素材` : `选择${label}素材`;
  }
  const maxFiles = Math.max(0, Number(param.max_files || 0));
  if (selectedCount <= 0) {
    return maxFiles > 0
      ? `选择${label}素材，最多 ${maxFiles} 个`
      : `选择${label}素材`;
  }
  return maxFiles > 0
    ? `${label}：已选择 ${selectedCount} 个，最多 ${maxFiles} 个`
    : `${label}：已选择 ${selectedCount} 个`;
}

function uploadParamLabel(param: PowerParam) {
  return String(param.name || param.key || "").trim() || "文件";
}

function uploadParamKind(param: PowerParam): LibraryAssetKind {
  const kinds = acceptedAssetKinds(param);
  return kinds.length === 1 ? kinds[0] : "file";
}

function valueAsText(value: unknown) {
  if (value == null) {
    return "";
  }
  if (Array.isArray(value)) {
    return value.join("、");
  }
  return String(value);
}

function valueAsList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }
  if (typeof value === "string") {
    const parsed = parseJSONValue(value);
    if (Array.isArray(parsed)) {
      return parsed.map((item) => String(item)).filter(Boolean);
    }
    return value ? [value] : [];
  }
  return value ? [String(value)] : [];
}

function parseJSONValue(value: string) {
  if (!value) {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
