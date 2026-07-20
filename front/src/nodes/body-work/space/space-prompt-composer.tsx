import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { getCompatModule } from "@dever/front-plugin";
import {
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  Download,
  FileText,
  Loader2,
  Plus,
  X,
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
import { normalizeAssetRecord } from "../asset/asset-api";
import { AssetPickerDialog } from "../asset/asset-picker-dialog";
import { useAssetReferenceProvider } from "../asset/asset-reference-provider";
import type {
  AssetKind as LibraryAssetKind,
  AssetRecord,
} from "../asset/asset-types";
import type {
  CanvasContentPreview,
  CanvasReferenceContent,
  AssetKind,
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
    allowedKinds?: AssetKind[];
  };
  onChange: (value: string, content?: CanvasReferenceContent) => void;
  onParamChange?: (key: string, value: unknown) => void;
  onSourceChange?: (sourceId: number) => void;
  onAssetReference?: (
    asset: ComposerAssetItem,
    param: PowerParam,
    alias: string,
  ) => void;
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

type UploadPreviewState = {
  groupName: string;
  file: UploadPreview;
};

export function PromptComposer({
  value,
  placeholder,
  running = false,
  disabled = false,
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
  onAssetReference,
  onLocalUpload,
  onSubmit,
}: PromptComposerProps) {
  const assetReferenceProvider = useAssetReferenceProvider({
    teamID: Number(assetReference?.teamID || 0),
    initialFilters: assetReference?.projectID
      ? {
          sourceType: "project",
          projectID: assetReference.projectID,
          assetCateID: Number(assetReference.assetCateID || 0),
        }
      : undefined,
    allowedKinds: assetReference?.allowedKinds,
  });
  const [openKey, setOpenKey] = useState("");
  const [uploadPreviews, setUploadPreviews] = useState<
    Record<string, UploadPreview[]>
  >({});
  const [activePreview, setActivePreview] = useState<UploadPreviewState | null>(
    null,
  );
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

  function setUploadValue(param: PowerParam, previews: UploadPreview[]) {
    setUploadPreviews((current) => ({
      ...current,
      [param.key]: previews,
    }));
    onParamChange?.(param.key, uploadParamValue(param, previews));
  }

  return (
    <div className={`ws-prompt-composer ${running ? "is-running" : ""}`}>
      <div className="ws-prompt-main">
        {uploadParams.length > 0 ? (
          <div className="ws-prompt-inline-uploads">
            {uploadParams.map((param) => (
              <UploadParamStrip
                key={param.key}
                param={param}
                previews={
                  uploadPreviews[param.key] ||
                  previewsFromValue(paramValues[param.key])
                }
                disabled={disabled || running}
                onChange={(nextPreviews) => setUploadValue(param, nextPreviews)}
                onPreview={(file) =>
                  setActivePreview({
                    groupName: param.name || "上传文件",
                    file,
                  })
                }
                onOpenAssetPicker={() => setAssetPickerParam(param)}
              />
            ))}
          </div>
        ) : null}

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
            onSubmit={!running ? onSubmit : undefined}
          />
        </div>
      </div>
      <div className="ws-prompt-toolbar">
        <div className="ws-prompt-tools">
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
          <button
            type="button"
            className="ws-prompt-submit"
            disabled={disabled || running}
            onClick={onSubmit}
            aria-label="发送"
          >
            {running ? (
              <Loader2 size={17} className="ws-spin" />
            ) : (
              <ArrowUp size={18} />
            )}
          </button>
        </div>
      </div>
      {activePreview && typeof document !== "undefined"
        ? createPortal(
            <UploadPreviewDialog
              title={activePreview.groupName}
              preview={activePreview.file}
              onClose={() => setActivePreview(null)}
            />,
            document.body,
          )
        : null}
      {assetPickerParam ? (
        <AssetPickerDialog
          open
          teamID={Number(assetReference?.teamID || 0)}
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
          initialSelectedAssetIDs={selectedAssetIDsFromPreviews(
            uploadPreviews[assetPickerParam.key] ||
              previewsFromValue(paramValues[assetPickerParam.key]),
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
            const current =
              uploadPreviews[assetPickerParam.key] ||
              previewsFromValue(paramValues[assetPickerParam.key]);
            const currentByAssetID = new Map(
              current
                .map(
                  (preview) => [assetIDFromPreview(preview), preview] as const,
                )
                .filter(([assetID]) => assetID > 0),
            );
            const selectedByID = new Map(
              assets.map((asset) => [asset.id, asset]),
            );
            let nextPrompt = value;
            const next = selectedAssetIDs
              .map((assetID, index) => {
                const existing = currentByAssetID.get(assetID);
                if (existing) return existing;
                const asset = selectedByID.get(assetID);
                if (!asset) return null;
                const alias = nextReferenceAlias(assetPickerParam, index + 1);
                const composerAsset = composerAssetFromRecord(asset);
                nextPrompt = appendReferenceMention(nextPrompt, alias);
                onAssetReference?.(composerAsset, assetPickerParam, alias);
                return uploadPreviewFromAsset(composerAsset, alias);
              })
              .filter((preview): preview is UploadPreview => Boolean(preview));
            setUploadValue(assetPickerParam, next);
            if (nextPrompt !== value) onChange(nextPrompt);
          }}
        />
      ) : null}
    </div>
  );
}

function UploadParamStrip({
  param,
  previews,
  disabled,
  onChange,
  onPreview,
  onOpenAssetPicker,
}: {
  param: PowerParam;
  previews: UploadPreview[];
  disabled?: boolean;
  onChange: (previews: UploadPreview[]) => void;
  onPreview: (preview: UploadPreview) => void;
  onOpenAssetPicker: () => void;
}) {
  function removeAt(index: number) {
    revokeUploadPreviewUrl(previews[index]);
    onChange(previews.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <div
      className={`ws-prompt-upload-group ${previews.length > 0 ? "has-previews" : "is-empty"}`}
    >
      {previews.map((preview, index) => (
        <span
          key={`${preview.name}-${index}`}
          className="ws-prompt-upload-card"
          style={{ zIndex: previews.length - index + 1 }}
          role="button"
          tabIndex={0}
          aria-label={`查看${preview.name}`}
          onClick={() => onPreview(preview)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              onPreview(preview);
            }
          }}
        >
          {isImagePreview(preview) ? (
            <img
              className="ws-prompt-upload-thumb"
              src={preview.url}
              alt={preview.name}
            />
          ) : (
            <span className="ws-prompt-upload-file">
              <FileText size={16} />
            </span>
          )}
          <span className="ws-prompt-upload-name">{preview.name}</span>
          <span className="ws-prompt-upload-hover">
            <strong>{preview.alias || preview.name}</strong>
            <small>
              {preview.text || preview.url || preview.type || "引用内容"}
            </small>
          </span>
          <button
            type="button"
            className="ws-prompt-upload-remove"
            disabled={disabled}
            aria-label="移除上传文件"
            onClick={(event) => {
              event.stopPropagation();
              removeAt(index);
            }}
          >
            <X size={12} />
          </button>
        </span>
      ))}
      <button
        type="button"
        className="ws-prompt-upload-add"
        disabled={disabled}
        aria-label={param.name || "添加"}
        onClick={onOpenAssetPicker}
      >
        <Plus size={16} />
        <span>添加</span>
      </button>
    </div>
  );
}

function uploadPreviewFromAsset(
  asset: ComposerAssetItem,
  alias: string,
): UploadPreview {
  const preview = asset.preview || emptyComposerPreview();
  const url =
    preview.imageUrl ||
    preview.videoUrl ||
    preview.audioUrl ||
    preview.fileUrl ||
    "";
  return {
    name: alias,
    alias,
    kind: asset.kind,
    source: asset.source,
    type: preview.imageUrl
      ? "image/url"
      : preview.videoUrl
        ? "video/url"
        : preview.audioUrl
          ? "audio/url"
          : "asset/reference",
    url,
    text: preview.text || asset.title,
    output: asset.output,
    asset: asset.asset,
  };
}

function composerAssetFromRecord(asset: AssetRecord): ComposerAssetItem {
  const content = asset.version?.content;
  const mediaURL = findAssetMediaURL(content, asset.kind);
  const preview = emptyComposerPreview();
  preview.text = asset.summary || asset.name;
  if (asset.kind === "image") preview.imageUrl = mediaURL;
  if (asset.kind === "video") preview.videoUrl = mediaURL;
  if (asset.kind === "audio") preview.audioUrl = mediaURL;
  if (asset.kind === "file") preview.fileUrl = mediaURL;
  return {
    id: String(asset.id),
    title: asset.name,
    kind: asset.kind,
    role: asset.role,
    source: "asset",
    refType: "asset",
    refId: asset.id,
    versionID: asset.versionID,
    output: content,
    preview,
    asset,
  };
}

function selectedAssetIDsFromPreviews(previews: UploadPreview[]) {
  return Array.from(
    new Set(previews.map(assetIDFromPreview).filter((assetID) => assetID > 0)),
  );
}

function assetIDFromPreview(preview: UploadPreview) {
  if (!preview.asset || typeof preview.asset !== "object") return 0;
  return Number((preview.asset as Record<string, unknown>).id || 0);
}

function nextReferenceAlias(param: PowerParam, index: number) {
  const name =
    `${param.name || param.key || ""}${param.key || ""}`.toLowerCase();
  if (/video|视频/.test(name)) {
    return `视频${index}`;
  }
  if (/audio|music|音频|音乐/.test(name)) {
    return `音频${index}`;
  }
  if (/text|文本|提示词|文案/.test(name)) {
    return `文本${index}`;
  }
  if (/image|img|photo|picture|图片|图像|参考图/.test(name)) {
    return `图片${index}`;
  }
  return `引用${index}`;
}

function appendReferenceMention(value: string, alias: string) {
  const mention = `@${alias}`;
  if (value.includes(mention)) {
    return value;
  }
  const separator = value.trim() ? " " : "";
  return `${value}${separator}${mention}`;
}

function acceptedAssetKinds(param: PowerParam): LibraryAssetKind[] {
  const configured = Array.from(
    new Set(
      (param.asset_kinds || [])
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

function UploadPreviewDialog({
  title,
  preview,
  onClose,
}: {
  title: string;
  preview: UploadPreview;
  onClose: () => void;
}) {
  const canDownload = Boolean(preview.url);

  return (
    <div
      className="ws-upload-preview-backdrop"
      role="dialog"
      aria-modal="true"
      onMouseDown={onClose}
    >
      <div
        className="ws-upload-preview-shell"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="ws-upload-preview-title">
          <span>{title}</span>
          <strong>{preview.name}</strong>
        </div>
        <div className="ws-upload-preview-body">
          {isImagePreview(preview) ? (
            <img src={preview.url} alt={preview.name} />
          ) : preview.text && !preview.url ? (
            <div className="ws-upload-preview-text">
              <FileText size={30} />
              <p>{preview.text}</p>
            </div>
          ) : (
            <div className="ws-upload-preview-file">
              <FileText size={44} />
              <span>{preview.name}</span>
              <small>{preview.type || "文件"}</small>
            </div>
          )}
        </div>
        <div className="ws-upload-preview-actions">
          <button type="button" aria-label="关闭预览" onClick={onClose}>
            <X size={20} />
          </button>
          {canDownload ? (
            <a href={preview.url} download={preview.name} aria-label="下载文件">
              <Download size={20} />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
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
  disabled,
  children,
  onToggle,
}: {
  id: string;
  openKey: string;
  label: string;
  icon: ReactNode;
  disabled?: boolean;
  children: ReactNode;
  onToggle: (key: string) => void;
}) {
  const open = !disabled && openKey === id;
  return (
    <span
      className={`ws-prompt-tool-wrap ${open ? "is-open" : ""}`}
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
        className={`ws-prompt-tool ${open ? "is-open" : ""}`}
        disabled={disabled}
        aria-label={label}
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
        <span>{label}</span>
        <ChevronDown size={14} />
      </button>
      {open ? <div className="ws-prompt-popover">{children}</div> : null}
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

function isImagePreview(preview: UploadPreview) {
  return Boolean(preview.url && preview.type?.startsWith("image/"));
}

function revokeUploadPreviewUrl(preview?: UploadPreview) {
  if (preview?.url?.startsWith("blob:")) {
    URL.revokeObjectURL(preview.url);
  }
}

function previewsFromValue(value: unknown): UploadPreview[] {
  if (Array.isArray(value)) {
    return value
      .map(storedUploadPreview)
      .filter((preview): preview is UploadPreview => Boolean(preview));
  }
  if (value && typeof value === "object") {
    const preview = storedUploadPreview(value);
    return preview ? [preview] : [];
  }
  return valueAsList(value)
    .map(storedUploadPreview)
    .filter((preview): preview is UploadPreview => Boolean(preview));
}

function uploadParamValue(param: PowerParam, previews: UploadPreview[]) {
  const values = previews.map((preview) => ({
    name: preview.alias || preview.name,
    alias: preview.alias || preview.name,
    type: preview.type || preview.kind || "",
    kind: preview.kind || "",
    url: preview.url || "",
    text: preview.text || "",
    source: preview.source || "upload",
    output: preview.output,
    asset: preview.asset,
  }));
  return param.type === "files" ? values : values[0] || "";
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

function storedUploadPreview(value: unknown): UploadPreview | null {
  if (value && typeof value === "object") {
    const row = value as Record<string, unknown>;
    const url = String(row.url || "");
    const text = String(row.text || "");
    return {
      name: String(
        row.name || row.alias || uploadNameFromUrl(url) || text || "引用内容",
      ),
      alias: String(row.alias || row.name || ""),
      kind: String(row.kind || ""),
      source: String(row.source || "upload") as UploadPreview["source"],
      type: String(row.type || imageTypeFromUrl(url) || ""),
      url,
      text,
      output: row.output,
      asset: row.asset,
    };
  }
  const text = String(value || "");
  if (!text) {
    return null;
  }
  if (!isUrlLike(text)) {
    return { name: text };
  }
  return {
    name: uploadNameFromUrl(text),
    type: imageTypeFromUrl(text),
    url: text,
  };
}

function isUrlLike(value: string) {
  return /^(blob:|data:|https?:\/\/)/i.test(value);
}

function uploadNameFromUrl(value: string) {
  if (value.startsWith("data:")) {
    return "上传文件";
  }
  try {
    const url = new URL(value);
    const name = url.pathname.split("/").filter(Boolean).pop();
    return name ? decodeURIComponent(name) : value;
  } catch {
    const name = value.split("/").filter(Boolean).pop();
    return name || value;
  }
}

function imageTypeFromUrl(value: string) {
  if (value.startsWith("data:image/")) {
    return value.slice(
      5,
      value.indexOf(";") > 0 ? value.indexOf(";") : undefined,
    );
  }
  return /\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/i.test(value)
    ? "image/url"
    : "";
}

function emptyComposerPreview(): ComposerAssetPreview {
  return {
    text: "",
    imageUrl: "",
    videoUrl: "",
    audioUrl: "",
    fileUrl: "",
  };
}
