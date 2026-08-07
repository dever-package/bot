import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  FileText,
  Images,
  Loader2,
  Paperclip,
} from "lucide-react";
import {
  isPowerParamOptionSelected,
  normalizePowerParamValue,
  powerParamBooleanValue,
  powerParamOptionValue,
  resolvePowerParamOption,
} from "./space-power-param";
import {
  isPowerParamConditionController,
  normalizePowerParamPreviewType,
  PowerParamOptionDialog,
} from "./space-power-param-runtime";
import { PowerIcon, PowerParamIcon } from "../shared/power-icon";
import {
  CanvasReferenceEditor,
  type CanvasReferencePickerRequest,
} from "./space-reference-editor";
import {
  connectedMediaReferenceTargets,
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
import {
  acceptedAssetKinds,
  isToolbarPowerParam,
  isUploadPowerParam,
} from "./space-media-param";
import { reconcileConnectedCanvasReferences } from "./space-reference-content";
import { SpaceTooltip } from "./space-tooltip";
import type {
  CanvasMultiImageMode,
  CanvasReferenceContent,
  ComposerAssetItem,
  PowerOption,
  PowerParam,
  PowerParamSource,
} from "./types";

function sourceServiceLabel(source?: PowerParamSource): string {
  return source?.service_name?.trim() || source?.name?.trim() || "来源";
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
  paramValues?: Record<string, unknown>;
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
  multiImagePlan?: CanvasMultiImagePlan;
  multiImageMode?: CanvasMultiImageMode;
  onConnectedMediaEdgeRemove?: (edgeId: string) => void;
  onChange: (value: string, content?: CanvasReferenceContent) => void;
  onParamChange?: (key: string, value: unknown) => void;
  onSourceChange?: (sourceId: number) => void;
  onMultiImageModeChange?: (mode: CanvasMultiImageMode) => void;
  onLocalUpload?: (
    files: File[],
    param: PowerParam,
  ) => Promise<UploadPreview[]>;
  onSubmit: () => void;
};

const EMPTY_CONNECTED_MEDIA_REFERENCES: CanvasConnectedMediaReference[] = [];
const EMPTY_MEDIA_USAGE_OPTIONS: MediaUsageOption[] = [];

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
  paramValues = {},
  assetLibrary = { current: [] },
  referenceContent,
  assetReference,
  connectedMediaReferences = EMPTY_CONNECTED_MEDIA_REFERENCES,
  mediaUsageOptions = EMPTY_MEDIA_USAGE_OPTIONS,
  multiImagePlan,
  multiImageMode,
  onConnectedMediaEdgeRemove,
  onChange,
  onParamChange,
  onSourceChange,
  onMultiImageModeChange,
  onLocalUpload,
  onSubmit,
}: PromptComposerProps) {
  const uploadParams = useMemo(
    () => params.filter(isUploadPowerParam),
    [params],
  );
  const rememberSelectedReference = useCallback(
    (option: WorkbenchReferenceOption) => {
      const item = composerAssetItemFromReferenceOption(option);
      assetLibrary.current = [
        ...assetLibrary.current.filter(
          (current) => Number(current.refId || 0) !== option.refId,
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
      },
    ) => {
      if (!onLocalUpload) {
        throw new Error("当前节点未配置本地上传");
      }
      const param = resolveUploadParam(uploadParams, context);
      if (!param) {
        throw new Error("当前能力没有与所选素材类型匹配的上传参数");
      }
      const previews = await onLocalUpload(files, param);
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
          isToolbarPowerParam(param) ||
          isPowerParamConditionController(param, params),
      ),
    [params],
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
  const enabledMultiImageOptions = useMemo(
    () => (multiImagePlan?.options || []).filter((option) => option.enabled),
    [multiImagePlan?.options],
  );
  const multiImageModeLabel = multiImagePlan?.mode
    ? `${multiImagePlan.mode === "per_image" ? "逐图生成" : "共同参考"} · ${multiImagePlan.imageCount} 张`
    : "";
  const referenceItems = assetLibrary.current;
  const resolvedReferences = useMemo(() => {
    const connectedReferences = reconcileConnectedCanvasReferences(
      value,
      referenceContent,
      connectedMediaReferenceTargets(
        connectedMediaReferences,
        referenceItems,
      ),
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
    mediaUsageOptions,
    multiImageMode,
    referenceContent,
    referenceItems,
    value,
  ]);
  const referenceUsageOptions = useMemo(
    () =>
      mediaUsageOptions.map((option) => ({
        key: option.key,
        label: option.label,
        acceptedKinds: option.acceptedKinds,
        maxFiles: option.maxFiles,
      })),
    [mediaUsageOptions],
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

  useEffect(() => {
    if (disabled || running) {
      setOpenKey("");
    }
  }, [disabled, running]);

  useEffect(() => {
    if (currentReferenceSignature === resolvedReferenceSignature) {
      return;
    }
    onChange(resolvedReferences.value, resolvedReferences.content);
  }, [
    currentReferenceSignature,
    onChange,
    resolvedReferenceSignature,
    resolvedReferences.content,
    resolvedReferences.value,
  ]);

  return (
    <div
      className={`ws-prompt-composer nowheel ${running ? "is-running" : ""}`}
    >
      <div className="ws-prompt-main">
        <div className="ws-prompt-editor-shell">
          <CanvasReferenceEditor
            className="ws-prompt-reference-editor nodrag nopan"
            value={resolvedReferences.value}
            content={resolvedReferences.content}
            disabled={disabled || running}
            textEditable={textInputEnabled}
            placeholder={placeholder}
            items={referenceItems}
            usageOptions={referenceUsageOptions}
            pickerRequest={referencePickerRequest}
            onPickerRequestConsumed={consumeReferencePickerRequest}
            assetReferenceProvider={
              assetReference?.teamID ? assetReferenceProvider : undefined
            }
            onReferenceDelete={(reference) => {
              if (
                reference.ref_origin === "edge" &&
                reference.ref_origin_id
              ) {
                onConnectedMediaEdgeRemove?.(reference.ref_origin_id);
              }
            }}
            onChange={onChange}
            onSubmit={!running && !submitDisabled ? onSubmit : undefined}
          />
        </div>
      </div>
      <div className="ws-prompt-toolbar">
        <div className="ws-prompt-tools">
          {sourceOptions.length > 0 ? (
            <ComposerMenu
              id="source"
              openKey={openKey}
              label={sourceServiceLabel(selectedSource)}
              icon={<FileText size={15} />}
              disabled={disabled || running}
              onToggle={setOpenKey}
            >
              <div className="ws-prompt-menu-list">
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

          {multiImagePlan?.active && multiImagePlan.mode ? (
            enabledMultiImageOptions.length > 1 ? (
              <ComposerMenu
                id="multi-image-mode"
                openKey={openKey}
                label={multiImageModeLabel}
                icon={<Images size={15} />}
                disabled={disabled || running}
                onToggle={setOpenKey}
              >
                <div className="ws-prompt-menu-list">
                  {enabledMultiImageOptions.map((option) => {
                    const active = option.value === multiImagePlan.mode;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={`ws-prompt-menu-item ${active ? "is-active" : ""}`}
                        disabled={disabled || running}
                        onClick={() => {
                          onMultiImageModeChange?.(option.value);
                          setOpenKey("");
                        }}
                      >
                        <span>{option.label}</span>
                        {active ? <CheckCircle2 size={14} /> : null}
                      </button>
                    );
                  })}
                </div>
              </ComposerMenu>
            ) : (
              <span className="ws-prompt-tool-wrap">
                <span
                  className="ws-prompt-tool is-static"
                  aria-label={multiImageModeLabel}
                >
                  <Images size={15} />
                  <span>{multiImageModeLabel}</span>
                </span>
              </span>
            )
          ) : null}

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

          {toolbarParams.map((param) => {
            if (isUploadPowerParam(param)) {
              if (!showMediaParamButtons) {
                return null;
              }
              return (
                <MediaParamButton
                  key={param.key}
                  param={param}
                  power={mediaParamPower}
                  selectedCount={mediaParamCounts.get(param.key) || 0}
                  disabled={disabled || running}
                  onClick={() => openMediaPicker(param)}
                />
              );
            }
            return (
              <ParamMenu
                key={param.key}
                param={param}
                value={paramValues[param.key]}
                openKey={openKey}
                disabled={disabled || running}
                onToggle={setOpenKey}
                onChange={(nextValue) =>
                  onParamChange?.(param.key, nextValue)
                }
              />
            );
          })}
        </div>

        <div className="ws-prompt-submit-group">
          <SpaceTooltip label={submitDisabledReason || undefined}>
            <button
              type="button"
              className="ws-prompt-submit"
              disabled={disabled || running || submitDisabled}
              onClick={onSubmit}
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
    id: `asset:${option.refId}`,
    title: option.label,
    kind,
    source: "asset",
    refType: "asset",
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
  openKey,
  disabled,
  onToggle,
  onChange,
}: {
  param: PowerParam;
  value: unknown;
  openKey: string;
  disabled?: boolean;
  onToggle: (key: string) => void;
  onChange: (value: unknown) => void;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
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
            onClick={() => {
              onToggle("");
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
      label={paramControlLabel(param, value)}
      icon={<PowerParamIcon name={param.icon} size={15} />}
      disabled={disabled}
      onToggle={onToggle}
    >
      <ParamEditor
        param={param}
        value={value}
        onChange={onChange}
        onClose={() => onToggle("")}
      />
    </ComposerMenu>
  );
}

function ComposerMenu({
  id,
  openKey,
  label,
  icon,
  iconOnly = false,
  variant = "default",
  disabled,
  children,
  onToggle,
}: {
  id: string;
  openKey: string;
  label: string;
  icon: ReactNode;
  iconOnly?: boolean;
  variant?: "default" | "attachments";
  disabled?: boolean;
  children: ReactNode;
  onToggle: (key: string) => void;
}) {
  const open = !disabled && openKey === id;
  const variantClass = variant === "attachments" ? "is-attachments" : "";
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

  return (
    <span
      className={`ws-prompt-tool-wrap ${variantClass} ${open ? "is-open" : ""}`}
      onMouseEnter={() => {
        cancelClose();
        if (!disabled) {
          onToggle(id);
        }
      }}
      onMouseLeave={() => {
        if (open) {
          scheduleClose();
        }
      }}
    >
      <button
        type="button"
        className={`ws-prompt-tool ${iconOnly ? "is-icon-only" : ""} ${open ? "is-open" : ""}`}
        disabled={disabled}
        aria-label={label}
        aria-expanded={variant === "attachments" ? open : undefined}
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

function ParamEditor({
  param,
  value,
  onChange,
  onClose,
}: {
  param: PowerParam;
  value: unknown;
  onChange: (value: unknown) => void;
  onClose: () => void;
}) {
  if (param.type === "option" || param.type === "select") {
    const options = param.options || [];
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
    const selected = valueAsList(value);
    const options = param.options || [];
    return (
      <div className="ws-prompt-menu-list">
        {options.map((option) => {
          const active = isPowerParamOptionSelected(option, selected, options);
          return (
            <button
              key={option.id || option.value}
              type="button"
              className={`ws-prompt-menu-item ${active ? "is-active" : ""}`}
              onClick={() => {
                let next = [...selected];
                if (active) {
                  next = next.filter(
                    (current) =>
                      !isPowerParamOptionSelected(option, [current], options),
                  );
                } else {
                  next.push(powerParamOptionValue(option));
                }
                onChange(normalizePowerParamValue(param, next));
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
        value={valueAsText(value)}
        placeholder={param.name}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  return (
    <input
      className="ws-prompt-param-input"
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
    if (part.type !== "reference" || !part.usage) {
      continue;
    }
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
