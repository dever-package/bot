import {
  createContext,
  useContext,
  useMemo,
  type ComponentType,
} from "react";
import { getCompatModule } from "@dever/front-plugin";
import type { ComposerAssetItem } from "./space-prompt-composer";
import { canvasReferenceContentFromText } from "./space-reference-content";
import type { CanvasReferenceContent } from "./types";
import type { WorkbenchReferenceProvider } from "../asset/asset-reference-provider";

type ReferenceScope = "current" | "history";
type ReferenceType = "asset";

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
  }>;
  content?: unknown;
};

type ReferenceEditorProps = {
  value: string;
  content?: CanvasReferenceContent;
  references: ReferenceOption[];
  placeholder?: string;
  disabled?: boolean;
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
    loadPreview?: (
      request: ReferencePreviewRequest,
    ) => Promise<ReferencePreview>;
  }>;
};

const ReferenceEditor = referenceComposerModule.ReferenceEditor;
const ReferenceContentView = referenceComposerModule.ReferenceContentView;

export const CanvasAssetReferenceProviderContext =
  createContext<WorkbenchReferenceProvider | undefined>(undefined);

export function CanvasReferenceEditor({
  value,
  content,
  items,
  placeholder,
  disabled,
  autoFocus,
  className,
  layerZIndex,
  onChange,
  onSubmit,
  assetReferenceProvider,
}: {
  value: string;
  content?: CanvasReferenceContent;
  items: ComposerAssetItem[];
  placeholder: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  layerZIndex?: number;
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
      autoFocus={autoFocus}
      className={className}
      layerZIndex={layerZIndex}
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
  autoFocus,
  className,
  layerZIndex,
  onChange,
  onSubmit,
  assetReferenceProvider,
}: {
  value: string;
  content?: CanvasReferenceContent;
  adapter: CanvasReferenceAdapter;
  placeholder: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
  layerZIndex?: number;
  onChange: (value: string, content?: CanvasReferenceContent) => void;
  onSubmit?: () => void;
  assetReferenceProvider?: WorkbenchReferenceProvider;
}) {
  const contextualAssetProvider = useContext(
    CanvasAssetReferenceProviderContext,
  );
  const activeAssetProvider =
    assetReferenceProvider || contextualAssetProvider;
  if (!ReferenceEditor) {
    return (
      <textarea
        className={className}
        value={value}
        disabled={disabled}
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
      value={value}
      content={content}
      references={activeAssetProvider ? [] : adapter.options}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      className={className}
      layerZIndex={layerZIndex}
      pickerScopes={["current"]}
      pickerSearchPlaceholder="搜索当前画布的内容或素材"
      loadReferences={adapter.loadReferences}
      loadPreview={adapter.loadPreview}
      providers={activeAssetProvider ? [activeAssetProvider] : undefined}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}

export function CanvasReferenceText({
  value,
  content,
  items,
  placeholder = "",
  className = "",
}: {
  value: string;
  content?: CanvasReferenceContent;
  items: ComposerAssetItem[];
  placeholder?: string;
  className?: string;
}) {
  const adapter = useCanvasReferenceAdapter(items);
  return (
    <CanvasReferenceTextWithAdapter
      value={value}
      content={content}
      adapter={adapter}
      placeholder={placeholder}
      className={className}
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
    : canvasReferenceContentFromText(value, adapter.options);
  if (!ReferenceContentView || !resolvedContent?.parts.length) {
    return <span className={className}>{value || placeholder}</span>;
  }
  return (
    <span className={`ws-canvas-reference-text ${className}`.trim()}>
      <ReferenceContentView
        content={resolvedContent}
        fallback={value || placeholder}
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
      referenceTargetKey(option.refType, option.refId, option.versionID),
      option.label,
    ]),
  );
  return {
    ...content,
    parts: content.parts.map((part) =>
      part.type === "reference"
        ? {
            ...part,
            label:
              labels.get(
                referenceTargetKey(
                  part.ref_type,
                  part.ref_id,
                  part.ref_version_id,
                ),
              ) ||
              part.label,
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
        referenceTargetKey(option.refType, option.refId, option.versionID),
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
            referenceTargetKey(
              request.refType,
              request.refId,
              request.versionId,
            ),
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
  return {
    key: `canvas:${item.source}:${item.id}`,
    refType: "asset",
    refId,
    versionID: Number(item.versionID || 0) || undefined,
    label: `@${referenceTitle(item.title)}`,
    description: referenceDescription(item),
    preview: {
      text: referenceDescription(item),
      kind: item.kind,
      url: primaryPreviewURL(item),
    },
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

function referenceTargetKey(
  refType: ReferenceType,
  refId: number,
  versionId = 0,
) {
  return `${refType}:${refId}:${versionId}`;
}

function referenceMedia(item: ComposerAssetItem) {
  const entries = [
    { kind: "image", url: item.preview.imageUrl },
    { kind: "video", url: item.preview.videoUrl },
    { kind: "audio", url: item.preview.audioUrl },
    { kind: "file", url: item.preview.fileUrl },
  ];
  return entries
    .filter((entry) => entry.url)
    .map((entry) => ({
      ...entry,
      label: referenceTitle(item.title),
    }));
}

function primaryPreviewURL(item: ComposerAssetItem) {
  return (
    item.preview.imageUrl ||
    item.preview.videoUrl ||
    item.preview.audioUrl ||
    item.preview.fileUrl ||
    ""
  );
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
