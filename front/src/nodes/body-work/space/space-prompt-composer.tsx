import {
  useCallback,
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { getCompatModule } from "@dever/front-plugin";
import {
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  FileText,
  Loader2,
  Paperclip,
} from "lucide-react";
import {
  defaultPowerParamValue,
  isPowerParamOptionSelected,
  normalizePowerParamValue,
  powerParamOptionValue,
} from "./space-power-param";
import { PowerParamIcon } from "./space-power-icon";
import { CanvasReferenceEditor } from "./space-reference-editor";
import { findAssetMediaURL } from "../asset/asset-content";
import { assetKindsAccept } from "../asset/asset-contract";
import { AssetKindIcon } from "../asset/asset-preview";
import { normalizeAssetRecord } from "../asset/asset-api";
import { AssetPickerDialog } from "../asset/asset-picker-dialog";
import {
  useAssetReferenceProvider,
  type WorkbenchReferenceOption,
} from "../asset/asset-reference-provider";
import type { AssetKind as LibraryAssetKind } from "../asset/asset-types";
import {
  canvasReferenceIDsForUsage,
  canvasReferenceTargetsForUsage,
  replaceCanvasReferenceUsage,
} from "./space-reference-content";
import { SpaceTooltip } from "./space-tooltip";
import type {
  CanvasContentPreview,
  CanvasReferenceContent,
  PowerParam,
  PowerParamSource,
} from "./types";

export { defaultPowerParamValue } from "./space-power-param";

export type ComposerAssetPreview = CanvasContentPreview;

type ParamPreviewType = "none" | "image" | "audio" | "video";

type ParamOptionDialogProps = {
  open: boolean;
  title: string;
  previewType: ParamPreviewType;
  options: NonNullable<PowerParam["options"]>;
  value: unknown;
  disabled?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (value: string) => void;
};

const streamRequestParamsModule = getCompatModule(
  "@/components/agent/stream-request-params",
);
const PowerParamOptionDialog =
  streamRequestParamsModule.PowerParamOptionDialog as ComponentType<ParamOptionDialogProps>;
const normalizeParamPreviewType =
  streamRequestParamsModule.normalizeParamPreviewType as (
    value: unknown,
  ) => ParamPreviewType;

export type ComposerAssetItem = {
  id: string;
  title: string;
  kind: string;
  role?: "work" | "material" | string;
  source: "current" | "asset";
  refType?: "asset";
  refId?: number;
  versionID?: number;
  output?: unknown;
  preview: ComposerAssetPreview;
  asset?: unknown;
};

type PromptComposerProps = {
  value: string;
  placeholder: string;
  running?: boolean;
  disabled?: boolean;
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
  onChange: (value: string, content?: CanvasReferenceContent) => void;
  onParamChange?: (key: string, value: unknown) => void;
  onSourceChange?: (sourceId: number) => void;
  onLocalUpload?: (
    files: File[],
    param: PowerParam,
  ) => Promise<UploadPreview[]>;
  onSubmit: () => void;
};

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
  submitDisabled = false,
  submitDisabledReason = "",
  sourceOptions = [],
  selectedSourceId = 0,
  params = [],
  paramValues = {},
  assetLibrary = { current: [] },
  referenceContent,
  assetReference,
  onChange,
  onParamChange,
  onSourceChange,
  onLocalUpload,
  onSubmit,
}: PromptComposerProps) {
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
  });
  const [openKey, setOpenKey] = useState("");
  const [assetPickerParam, setAssetPickerParam] = useState<PowerParam | null>(
    null,
  );
  const uploadParams = params.filter(isUploadPowerParam);
  const optionParams = params.filter(isToolbarPowerParam);
  const selectedSource = sourceOptions.find(
    (source) =>
      source.target_id === selectedSourceId || source.id === selectedSourceId,
  );
  const referenceItems = assetLibrary.current;

  useEffect(() => {
    if (disabled || running) {
      setOpenKey("");
    }
  }, [disabled, running]);

  return (
    <div
      className={`ws-prompt-composer nowheel ${running ? "is-running" : ""}`}
    >
      <div className="ws-prompt-main">
        <div className="ws-prompt-editor-shell">
          <CanvasReferenceEditor
            className="ws-prompt-reference-editor nodrag nopan"
            value={value}
            content={referenceContent}
            disabled={disabled || running}
            placeholder={placeholder}
            items={referenceItems}
            assetReferenceProvider={
              assetReference?.teamID ? assetReferenceProvider : undefined
            }
            onChange={onChange}
            onSubmit={!running && !submitDisabled ? onSubmit : undefined}
          />
        </div>
      </div>
      <div className="ws-prompt-toolbar">
        <div className="ws-prompt-tools">
          {uploadParams.length > 0 ? (
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
                    onClick={() => {
                      setOpenKey("");
                      setAssetPickerParam(param);
                    }}
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

          {sourceOptions.length > 0 ? (
            <ComposerMenu
              id="source"
              openKey={openKey}
              label={
                selectedSource?.name || selectedSource?.service_name || "来源"
              }
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
                      <span>{source.name || source.service_name}</span>
                      {active ? <CheckCircle2 size={14} /> : null}
                    </button>
                  );
                })}
              </div>
            </ComposerMenu>
          ) : null}

          {optionParams.map((param) => (
            <ParamMenu
              key={param.key}
              param={param}
              value={paramValues[param.key]}
              openKey={openKey}
              disabled={disabled || running}
              onToggle={setOpenKey}
              onChange={(nextValue) => onParamChange?.(param.key, nextValue)}
            />
          ))}
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
      {assetPickerParam ? (
        <AssetPickerDialog
          open
          teamID={Number(assetReference?.teamID || 0)}
          scopeProjectID={Number(assetReference?.projectID || 0)}
          title={`${assetPickerParam.name || "参数"}资产库`}
          description="选择已有资产或上传本地文件，确认后用于当前参数。"
          initialFilters={
            assetReference?.projectID
              ? {
                  sourceType: "project",
                  projectID: assetReference.projectID,
                }
              : undefined
          }
          allowedKinds={acceptedAssetKinds(assetPickerParam)}
          initialSelectedAssetIDs={canvasReferenceIDsForUsage(
            referenceContent,
            assetPickerParam.key,
          )}
          multiple={assetPickerParam.type === "files"}
          maxSelection={assetPickerParam.max_files || 8}
          confirmSelection
          validateAsset={(asset) =>
            findAssetMediaURL(asset.version?.content, asset.kind)
              ? ""
              : "该资产当前版本没有可用文件，无法用于此参数。"
          }
          uploadAccept={assetKindsAccept(acceptedAssetKinds(assetPickerParam))}
          onUpload={
            onLocalUpload
              ? async (files) => {
                  const previews = await onLocalUpload(files, assetPickerParam);
                  const assets = previews
                    .map((preview) => normalizeAssetRecord(preview.asset))
                    .filter((asset) => asset.id > 0);
                  if (assets.length === 0) {
                    throw new Error("上传成功，但没有生成可用资产");
                  }
                  return assets;
                }
              : undefined
          }
          onClose={() => setAssetPickerParam(null)}
          onConfirm={(assets, selectedAssetIDs) => {
            const selectedByID = new Map(
              assets.map((asset) => [asset.id, asset]),
            );
            for (const asset of assets) {
              rememberSelectedReference({
                key: `asset:${asset.id}:${asset.versionID}`,
                refType: "asset",
                refId: asset.id,
                versionID: asset.versionID,
                trigger: "@",
                label: asset.name,
                description: asset.summary,
                preview: {
                  text: asset.summary,
                  kind: asset.kind,
                  url: findAssetMediaURL(
                    asset.version?.content,
                    asset.kind,
                  ),
                },
              });
            }
            const currentByID = new Map(
              canvasReferenceTargetsForUsage(
                referenceContent,
                assetPickerParam.key,
              ).map((target) => [target.refId, target]),
            );
            const targets = selectedAssetIDs.flatMap((assetID) => {
              const asset = selectedByID.get(assetID);
              if (!asset) {
                const current = currentByID.get(assetID);
                return current ? [current] : [];
              }
              return [
                {
                  refType: "asset" as const,
                  refId: asset.id,
                  label: asset.name,
                  usage: assetPickerParam.key,
                  trigger: "@" as const,
                  versionId: asset.versionID,
                },
              ];
            });
            const next = replaceCanvasReferenceUsage(
              value,
              referenceContent,
              assetPickerParam.key,
              targets,
            );
            onChange(next.value, next.content);
            setAssetPickerParam(null);
          }}
        />
      ) : null}
    </div>
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
    preview: {
      text: option.description || "",
      imageUrl: kind === "image" ? url : "",
      videoUrl: kind === "video" ? url : "",
      audioUrl: kind === "audio" ? url : "",
      fileUrl: kind === "file" ? url : "",
    },
  };
}

function acceptedAssetKinds(param: PowerParam): LibraryAssetKind[] {
  const configured = Array.from(
    new Set(
      (param.accepted_kinds || param.asset_kinds || [])
        .map(normalizeAssetKind)
        .filter((kind): kind is LibraryAssetKind => Boolean(kind)),
    ),
  );
  if (configured.length > 0) return configured;

  const name = `${param.name || ""} ${param.key || ""}`.toLowerCase();
  if (/video|视频/.test(name)) {
    return ["video"];
  }
  if (/audio|music|音频|音乐/.test(name)) {
    return ["audio"];
  }
  if (/image|img|photo|picture|图片|图像|参考图/.test(name)) {
    return ["image"];
  }
  if (/text|文本|提示词|文案/.test(name)) {
    return ["file"];
  }
  return ["image", "audio", "video", "file"];
}

function normalizeAssetKind(value: unknown): LibraryAssetKind | undefined {
  const kind = String(value || "").toLowerCase();
  if (kind === "rich") return "richtext";
  if (kind === "music") return "audio";
  return ["text", "image", "audio", "video", "richtext", "file"].includes(kind)
    ? (kind as LibraryAssetKind)
    : undefined;
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
  const previewType = normalizeParamPreviewType(param.preview_type);

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
  return (
    <span
      className={`ws-prompt-tool-wrap ${variantClass} ${open ? "is-open" : ""}`}
      onMouseEnter={() => {
        if (!disabled) {
          onToggle(id);
        }
      }}
      onMouseLeave={() => {
        if (open) {
          onToggle("");
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
        onFocus={() => {
          if (!disabled) {
            onToggle(id);
          }
        }}
        onClick={() => {
          if (!disabled) {
            onToggle(open ? "" : id);
          }
        }}
      >
        {icon}
        {!iconOnly ? <span>{label}</span> : null}
        {!iconOnly ? <ChevronDown size={14} /> : null}
      </button>
      {open ? (
        <div className={`ws-prompt-popover ${variantClass}`}>{children}</div>
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
    return (
      <div className="ws-prompt-menu-list">
        {(param.options || []).map((option) => {
          const active = isPowerParamOptionSelected(option, [
            String(value ?? ""),
          ]);
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
    return (
      <div className="ws-prompt-menu-list">
        {(param.options || []).map((option) => {
          const active = isPowerParamOptionSelected(option, selected);
          return (
            <button
              key={option.id || option.value}
              type="button"
              className={`ws-prompt-menu-item ${active ? "is-active" : ""}`}
              onClick={() => {
                let next = [...selected];
                if (active) {
                  next = next.filter(
                    (current) => !isPowerParamOptionSelected(option, [current]),
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
    const active = truthy(value);
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

export function isUploadPowerParam(param: PowerParam) {
  return param.type === "file" || param.type === "files";
}

export function isPromptPowerParam(param: PowerParam) {
  return param.type === "prompt";
}

export function isToolbarPowerParam(param: PowerParam) {
  if (
    param.type === "hidden" ||
    param.type === "description" ||
    isPromptPowerParam(param) ||
    isUploadPowerParam(param)
  ) {
    return false;
  }
  return true;
}

function paramControlLabel(param: PowerParam, value: unknown) {
  if (param.type === "switch") {
    return `${param.name}: ${truthy(value) ? "开" : "关"}`;
  }
  if (param.type === "multi_option") {
    const count = valueAsList(value).length;
    return count > 0 ? `${param.name} ${count}` : param.name;
  }
  if (param.type === "option" || param.type === "select") {
    const option = param.options?.find((item) =>
      isPowerParamOptionSelected(item, [String(value ?? "")]),
    );
    return option?.name || param.name;
  }
  const text = valueAsText(value);
  return text ? `${param.name}: ${text}` : param.name;
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

function truthy(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }
  const text = String(value ?? "")
    .trim()
    .toLowerCase();
  return text === "1" || text === "true" || text === "yes" || text === "on";
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
