import { useMemo, type ComponentType } from "react";
import { getCompatModule } from "@dever/front-plugin";
import type { ComposerAssetItem } from "./space-prompt-composer";
import { canvasReferenceContentFromText } from "./space-reference-content";
import type { CanvasReferenceContent } from "./types";

type ReferenceScope = "current" | "history";
type ReferenceType = "artifact" | "canvas_node";

type ReferenceOption = {
  key: string;
  refType: ReferenceType;
  refId: number;
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
}) {
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
      references={adapter.options}
      placeholder={placeholder}
      disabled={disabled}
      autoFocus={autoFocus}
      className={className}
      layerZIndex={layerZIndex}
      pickerScopes={["current"]}
      pickerSearchPlaceholder="搜索当前画布的内容或素材"
      loadReferences={adapter.loadReferences}
      loadPreview={adapter.loadPreview}
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
        loadPreview={adapter.loadPreview}
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
            label:
              labels.get(referenceTargetKey(part.ref_type, part.ref_id)) ||
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
      if (refId <= 0) {
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
  return {
    key: `canvas:${item.source}:${item.id}`,
    refType:
      item.refType || (item.source === "current" ? "canvas_node" : "artifact"),
    refId,
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

function referenceTargetKey(refType: ReferenceType, refId: number) {
  return `${refType}:${refId}`;
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
