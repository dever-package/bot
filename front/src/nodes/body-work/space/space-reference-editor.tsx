import { createContext, useContext, useMemo, type ComponentType } from "react";
import { getCompatModule } from "@dever/front-plugin";
import {
  canvasReferenceContentFromUnambiguousText,
  normalizeCanvasReferenceLabel,
} from "./space-reference-content";
import { canvasPrimaryMediaURLs } from "./space-media-references";
import type {
  CanvasReferenceContent,
  CanvasReferenceMediaItem,
  ComposerAssetItem,
} from "./types";
import type { WorkbenchReferenceProvider } from "../asset/asset-reference-provider";

type ReferenceScope = "current" | "history";
type ReferenceType = "asset";

const CANVAS_REFERENCE_PICKER_SCOPES: ReferenceScope[] = ["current"];

type ReferenceOption = {
  key: string;
  refType: ReferenceType;
  refId: number;
  trigger?: "@" | "#";
  versionID?: number;
  label: string;
  description?: string;
  preview?: {
    text?: string;
    kind?: string;
    url?: string;
  };
  usage?: string;
  origin?: string;
  originID?: string;
  mediaURL?: string;
  mediaIndex?: number;
  mediaCount?: number;
  mediaItems?: CanvasReferenceMediaItem[];
};

export type CanvasReferencePickerRequest = {
  id: string | number;
  trigger?: string;
  preferredUsage?: string;
  acceptedKinds?: string[];
};

type ReferenceLoadRequest = {
  scope: ReferenceScope;
  query: string;
};

type ReferencePreviewRequest = {
  refType: ReferenceType;
  refId: number;
  label: string;
  trigger?: "@" | "#";
  versionId?: number;
};

type ReferencePreview = {
  refType: ReferenceType;
  refId: number;
  title: string;
  text: string;
  media: Array<{
    kind: string;
    label: string;
    url: string;
    index?: number;
  }>;
  content?: unknown;
};

export type CanvasReferenceUsageOption = {
  key: string;
  label: string;
  acceptedKinds?: string[];
  maxFiles?: number;
};

const EMPTY_CANVAS_REFERENCE_USAGE_OPTIONS: CanvasReferenceUsageOption[] = [];

type ReferenceEditorProps = {
  value: string;
  content?: CanvasReferenceContent;
  references: ReferenceOption[];
  placeholder?: string;
  disabled?: boolean;
  textEditable?: boolean;
  autoFocus?: boolean;
  className?: string;
  layerZIndex?: number;
  pickerScopes?: ReferenceScope[];
  pickerSearchPlaceholder?: string;
  loadReferences: (request: ReferenceLoadRequest) => Promise<{
    items: ReferenceOption[];
  }>;
  loadPreview: (request: ReferencePreviewRequest) => Promise<ReferencePreview>;
  providers?: WorkbenchReferenceProvider[];
  usageOptions?: CanvasReferenceUsageOption[];
  showMediaAliases?: boolean;
  allowMultiMediaSelection?: boolean;
  pickerRequest?: CanvasReferencePickerRequest;
  onPickerRequestConsumed?: (
    requestID: CanvasReferencePickerRequest["id"],
  ) => void;
  onReferenceDelete?: (
    reference: Extract<CanvasReferenceContent["parts"][number], { type: "reference" }>,
  ) => void;
  onReferenceUsageChange?: (
    reference: Extract<CanvasReferenceContent["parts"][number], { type: "reference" }>,
    usage: string,
  ) => void;
  onChange: (value: string, content: CanvasReferenceContent) => void;
  onSubmit?: () => void;
};

const referenceComposerModule = getCompatModule(
  "@/components/reference-composer",
) as {
  ReferenceEditor?: ComponentType<ReferenceEditorProps>;
  ReferenceContentView?: ComponentType<{
    content?: CanvasReferenceContent;
    fallback?: string;
    references?: ReferenceOption[];
    showMediaAliases?: boolean;
    loadPreview?: (
      request: ReferencePreviewRequest,
    ) => Promise<ReferencePreview>;
  }>;
};

const ReferenceEditor = referenceComposerModule.ReferenceEditor;
const ReferenceContentView = referenceComposerModule.ReferenceContentView;

export const CanvasAssetReferenceProviderContext = createContext<
  WorkbenchReferenceProvider | undefined
>(undefined);

export function CanvasReferenceEditor({
  value,
  content,
  items,
  placeholder,
  disabled,
  textEditable,
  autoFocus,
  className,
  layerZIndex,
  usageOptions = EMPTY_CANVAS_REFERENCE_USAGE_OPTIONS,
  pickerRequest,
  onPickerRequestConsumed,
  onReferenceDelete,
  onReferenceUsageChange,
  onChange,
  onSubmit,
  assetReferenceProvider,
}: {
  value: string;
  content?: CanvasReferenceContent;
  items: ComposerAssetItem[];
  placeholder: string;
  disabled?: boolean;
  textEditable?: boolean;
  autoFocus?: boolean;
  className?: string;
  layerZIndex?: number;
  usageOptions?: CanvasReferenceUsageOption[];
  pickerRequest?: CanvasReferencePickerRequest;
  onPickerRequestConsumed?: ReferenceEditorProps["onPickerRequestConsumed"];
  onReferenceDelete?: ReferenceEditorProps["onReferenceDelete"];
  onReferenceUsageChange?: ReferenceEditorProps["onReferenceUsageChange"];
  onChange: (value: string, content?: CanvasReferenceContent) => void;
  onSubmit?: () => void;
  assetReferenceProvider?: WorkbenchReferenceProvider;
}) {
  const adapter = useCanvasReferenceAdapter(items);
  return (
    <CanvasReferenceEditorWithAdapter
      value={value}
      content={content}
      adapter={adapter}
      placeholder={placeholder}
      disabled={disabled}
      textEditable={textEditable}
      autoFocus={autoFocus}
      className={className}
      layerZIndex={layerZIndex}
      usageOptions={usageOptions}
      pickerRequest={pickerRequest}
      onPickerRequestConsumed={onPickerRequestConsumed}
      onReferenceDelete={onReferenceDelete}
      onReferenceUsageChange={onReferenceUsageChange}
      onChange={onChange}
      onSubmit={onSubmit}
      assetReferenceProvider={assetReferenceProvider}
    />
  );
}

export function CanvasReferenceEditorWithAdapter({
  value,
  content,
  adapter,
  placeholder,
  disabled,
  textEditable = true,
  autoFocus,
  className,
  layerZIndex,
  usageOptions = EMPTY_CANVAS_REFERENCE_USAGE_OPTIONS,
  pickerRequest,
  onPickerRequestConsumed,
  onReferenceDelete,
  onReferenceUsageChange,
  onChange,
  onSubmit,
  assetReferenceProvider,
}: {
  value: string;
  content?: CanvasReferenceContent;
  adapter: CanvasReferenceAdapter;
  placeholder: string;
  disabled?: boolean;
  textEditable?: boolean;
  autoFocus?: boolean;
  className?: string;
  layerZIndex?: number;
  usageOptions?: CanvasReferenceUsageOption[];
  pickerRequest?: CanvasReferencePickerRequest;
  onPickerRequestConsumed?: ReferenceEditorProps["onPickerRequestConsumed"];
  onReferenceDelete?: ReferenceEditorProps["onReferenceDelete"];
  onReferenceUsageChange?: ReferenceEditorProps["onReferenceUsageChange"];
  onChange: (value: string, content?: CanvasReferenceContent) => void;
  onSubmit?: () => void;
  assetReferenceProvider?: WorkbenchReferenceProvider;
}) {
  const contextualAssetProvider = useContext(
    CanvasAssetReferenceProviderContext,
  );
  const activeAssetProvider = assetReferenceProvider || contextualAssetProvider;
  const activeProviders = useMemo(
    () => (activeAssetProvider ? [activeAssetProvider] : undefined),
    [activeAssetProvider],
  );
  const resolvedContent = useMemo(
    () =>
      content ||
      canvasReferenceContentFromUnambiguousText(value, adapter.options),
    [adapter.options, content, value],
  );
  const usageSignature = useMemo(
    () =>
      usageOptions
        .map((option) =>
          [
            option.key,
            option.label,
            option.maxFiles || 0,
            ...(option.acceptedKinds || []),
          ].join(":"),
        )
        .join("|"),
    [usageOptions],
  );
  if (!ReferenceEditor) {
    return (
      <textarea
        className={className}
        value={value}
        disabled={disabled}
        readOnly={!textEditable}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (
            onSubmit &&
            (event.metaKey || event.ctrlKey) &&
            event.key === "Enter"
          ) {
            event.preventDefault();
            onSubmit();
          }
        }}
      />
    );
  }
  return (
    <ReferenceEditor
      key={usageSignature}
      value={value}
      content={resolvedContent}
      references={adapter.options}
      placeholder={placeholder}
      disabled={disabled}
      textEditable={textEditable}
      autoFocus={autoFocus}
      className={className}
      layerZIndex={layerZIndex}
      pickerScopes={CANVAS_REFERENCE_PICKER_SCOPES}
      pickerSearchPlaceholder="搜索当前画布的内容或素材"
      loadReferences={adapter.loadReferences}
      loadPreview={adapter.loadPreview}
      providers={activeProviders}
      usageOptions={usageOptions}
      showMediaAliases
      allowMultiMediaSelection
      pickerRequest={pickerRequest}
      onPickerRequestConsumed={onPickerRequestConsumed}
      onReferenceDelete={onReferenceDelete}
      onReferenceUsageChange={onReferenceUsageChange}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}

export function CanvasReferenceTextWithAdapter({
  value,
  content,
  adapter,
  placeholder = "",
  className = "",
}: {
  value: string;
  content?: CanvasReferenceContent;
  adapter: CanvasReferenceAdapter;
  placeholder?: string;
  className?: string;
}) {
  const assetReferenceProvider = useContext(
    CanvasAssetReferenceProviderContext,
  );
  const resolvedContent = content
    ? hydrateReferenceLabels(content, adapter.options)
    : canvasReferenceContentFromUnambiguousText(value, adapter.options);
  if (!ReferenceContentView || !resolvedContent?.parts.length) {
    return <span className={className}>{value || placeholder}</span>;
  }
  return (
    <span className={`ws-canvas-reference-text ${className}`.trim()}>
      <ReferenceContentView
        content={resolvedContent}
        fallback={value || placeholder}
        references={adapter.options}
        showMediaAliases
        loadPreview={(request) =>
          request.refType === "asset" && assetReferenceProvider?.loadPreview
            ? assetReferenceProvider.loadPreview(request)
            : adapter.loadPreview(request)
        }
      />
    </span>
  );
}

function hydrateReferenceLabels(
  content: CanvasReferenceContent,
  options: ReferenceOption[],
): CanvasReferenceContent {
  const labels = new Map(
    options.map((option) => [
      referenceTargetKey(option.refType, option.refId),
      option.label,
    ]),
  );
  return {
    ...content,
    parts: content.parts.map((part) =>
      part.type === "reference"
        ? {
            ...part,
            label: normalizeCanvasReferenceLabel(
              labels.get(referenceTargetKey(part.ref_type, part.ref_id)) ||
                part.label,
            ),
          }
        : part,
    ),
  };
}

export type CanvasReferenceAdapter = {
  options: ReferenceOption[];
  loadReferences: (request: ReferenceLoadRequest) => Promise<{
    items: ReferenceOption[];
  }>;
  loadPreview: (request: ReferencePreviewRequest) => Promise<ReferencePreview>;
};

export function useCanvasReferenceAdapter(
  items: ComposerAssetItem[],
): CanvasReferenceAdapter {
  return useMemo(() => {
    const normalizedItems = uniqueReferenceItems(items);
    const itemByReference = new Map<string, ComposerAssetItem>();
    const options = normalizedItems.flatMap((item) => {
      const refId = Number(item.refId || 0);
      const versionID = Number(item.versionID || 0);
      if (refId <= 0 || versionID <= 0) {
        return [];
      }
      const option = referenceOption(item, refId);
      itemByReference.set(
        referenceTargetKey(option.refType, option.refId),
        item,
      );
      return [option];
    });
    return {
      options,
      loadReferences: async (request: ReferenceLoadRequest) => ({
        items:
          request.scope === "current"
            ? filterReferenceOptions(options, request.query)
            : [],
      }),
      loadPreview: async (request: ReferencePreviewRequest) =>
        referencePreview(
          itemByReference.get(
            referenceTargetKey(request.refType, request.refId),
          ),
          request,
        ),
    };
  }, [items]);
}

function uniqueReferenceItems(items: ComposerAssetItem[]) {
  const result: ComposerAssetItem[] = [];
  const keys = new Set<string>();
  for (const item of items) {
    const title = referenceTitle(item.title);
    if (!title) {
      continue;
    }
    const key = `${item.source}:${item.id}`;
    if (keys.has(key)) {
      continue;
    }
    keys.add(key);
    result.push({ ...item, title });
  }
  return result;
}

function referenceOption(
  item: ComposerAssetItem,
  refId: number,
): ReferenceOption {
  const media = referenceMedia(item);
  return {
    key: `canvas:${item.source}:${item.id}`,
    refType: "asset",
    refId,
    versionID: Number(item.versionID || 0) || undefined,
    label: referenceTitle(item.title),
    description: referenceDescription(item),
    preview: {
      text: referenceDescription(item),
      kind: media[0]?.kind || item.kind,
      url: media[0]?.url || "",
    },
    mediaCount: media.length,
  };
}

function referencePreview(
  item: ComposerAssetItem | undefined,
  request: ReferencePreviewRequest,
): ReferencePreview {
  if (!item) {
    return {
      refType: request.refType,
      refId: request.refId,
      title: request.label,
      text: "引用内容已不可用",
      media: [],
    };
  }
  const media = referenceMedia(item);
  return {
    refType: request.refType,
    refId: request.refId,
    title: referenceTitle(item.title),
    text: referenceDescription(item),
    media,
    content: media.length > 0 ? undefined : item.output,
  };
}

function referenceTargetKey(refType: ReferenceType, refId: number) {
  return `${refType}:${refId}`;
}

function referenceMedia(item: ComposerAssetItem) {
  const declaredKind = referenceMediaKind(item.kind);
  const outputEntries = referenceOutputMedia(item.output, declaredKind);
  const fallbackEntries = referencePreviewMedia(item);
  const entries = outputEntries.length > 0 ? outputEntries : fallbackEntries;

  const title = referenceTitle(item.title);
  const seen = new Set<string>();
  const uniqueEntries = entries.flatMap((entry) => {
    const url = entry.url.trim();
    const key = `${entry.kind}:${url}`;
    if (!url || seen.has(key)) {
      return [];
    }
    seen.add(key);
    return [{ ...entry, url }];
  });
  const totals = uniqueEntries.reduce((counts, entry) => {
    counts.set(entry.kind, (counts.get(entry.kind) || 0) + 1);
    return counts;
  }, new Map<string, number>());
  const indexes = new Map<string, number>();
  return uniqueEntries.map((entry) => {
    const index = (indexes.get(entry.kind) || 0) + 1;
    indexes.set(entry.kind, index);
    return {
      kind: entry.kind,
      url: entry.url,
      index,
      label:
        (totals.get(entry.kind) || 0) > 1
          ? `${title} · ${referenceMediaKindLabel(entry.kind)} ${index}`
          : title,
    };
  });
}

function referenceOutputMedia(
  output: unknown,
  declaredKind: ReturnType<typeof referenceMediaKind>,
) {
  const mediaKinds = ["image", "video", "audio"] as const;
  const entries = mediaKinds.flatMap((kind) =>
    canvasPrimaryMediaURLs(output, kind).map((url) => ({ kind, url })),
  );
  if (!declaredKind || declaredKind === "file") {
    return entries;
  }
  const declaredEntries = entries.filter(
    (entry) => entry.kind === declaredKind,
  );
  return declaredEntries.length > 0 ? declaredEntries : entries;
}

function referencePreviewMedia(item: ComposerAssetItem) {
  const entries = [
    { kind: "image" as const, url: item.preview.imageUrl },
    { kind: "video" as const, url: item.preview.videoUrl },
    { kind: "audio" as const, url: item.preview.audioUrl },
    { kind: "file" as const, url: item.preview.fileUrl },
  ];
  const declaredKind = referenceMediaKind(item.kind);
  const declaredEntries = declaredKind
    ? entries.filter((entry) => entry.kind === declaredKind && entry.url)
    : [];
  return declaredEntries.length > 0
    ? declaredEntries
    : entries.filter((entry) => entry.url);
}

function referenceMediaKind(value: string) {
  const kind = String(value || "").trim().toLowerCase();
  return ["image", "video", "audio", "file"].includes(kind)
    ? (kind as "image" | "video" | "audio" | "file")
    : "";
}

function referenceMediaKindLabel(kind: string) {
  switch (kind) {
    case "image":
      return "图片";
    case "video":
      return "视频";
    case "audio":
      return "音频";
    default:
      return "文件";
  }
}

function referenceDescription(item: ComposerAssetItem) {
  const text = String(item.preview.text || "").trim();
  if (!text || text === item.title) {
    return item.kind === "text" ? "画布文本内容" : "画布生成素材";
  }
  return text.length > 160 ? `${text.slice(0, 160)}...` : text;
}

function filterReferenceOptions(options: ReferenceOption[], query: string) {
  const keyword = query.trim().toLowerCase();
  if (!keyword) {
    return options;
  }
  return options.filter((option) =>
    [option.label, option.description, option.preview?.kind].some((value) =>
      String(value || "")
        .toLowerCase()
        .includes(keyword),
    ),
  );
}

function referenceTitle(value: string) {
  return String(value || "")
    .trim()
    .replace(/^@+/, "");
}
