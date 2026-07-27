import { getCompatModule } from "@dever/front-plugin";
import type { ComponentType } from "react";
import {
  parseStoryboardOutput,
  type StoryboardDocument,
} from "./space-storyboard";
import { StoryboardView } from "./space-storyboard-view";

type SharedContentViewProps = {
  output?: any;
  streaming?: boolean;
  emptyText?: string;
  className?: string;
  markdownClassName?: string;
  richClassName?: string;
  mediaLayout?: "default" | "chat" | "detail";
};

type CanvasContentMediaPreview = {
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  fileUrl?: string;
};

export type CanvasContentMediaKind = "image" | "video" | "audio";

const CANVAS_CONTENT_MEDIA_KINDS: CanvasContentMediaKind[] = [
  "image",
  "video",
  "audio",
];

const CANVAS_CONTENT_MEDIA_FIELDS: Record<
  CanvasContentMediaKind,
  readonly string[]
> = {
  image: ["image", "image_url", "imageUrl", "images", "imageUrls"],
  video: ["video", "video_url", "videoUrl", "videos", "videoUrls"],
  audio: ["audio", "audio_url", "audioUrl", "audios", "audioUrls"],
};

type ContentViewModule = {
  ContentView?: ComponentType<SharedContentViewProps>;
  EnergonContentView?: ComponentType<SharedContentViewProps>;
  normalizeEnergonOutput?: (output: any) => any[];
};

const contentViewModule = getCompatModule(
  "@/components/energon/content-view",
) as ContentViewModule;
const SharedContentView =
  contentViewModule.ContentView || contentViewModule.EnergonContentView;

export const normalizeEnergonOutput = contentViewModule.normalizeEnergonOutput;

type CanvasNodeContentViewProps = SharedContentViewProps & {
  fallback?: string;
  storyboardEditable?: boolean;
  storyboardDisabled?: boolean;
  onStoryboardSave?: (storyboard: StoryboardDocument) => Promise<void>;
};

export function CanvasNodeContentView({
  output,
  fallback = "",
  streaming = false,
  emptyText = "暂无内容",
  className,
  markdownClassName,
  richClassName,
  mediaLayout = "default",
  storyboardEditable = false,
  storyboardDisabled = false,
  onStoryboardSave,
}: CanvasNodeContentViewProps) {
  const resolvedOutput = hasCanvasContent(output)
    ? output
    : fallback
      ? { text: fallback }
      : output;
  const storyboard = parseStoryboardOutput(resolvedOutput);

  if (storyboard) {
    return (
      <div
        className={className}
        onPointerDown={(event) => {
          if (isInteractiveContentTarget(event.target)) {
            event.stopPropagation();
          }
        }}
        onClick={(event) => {
          if (isInteractiveContentTarget(event.target)) {
            event.stopPropagation();
          }
        }}
      >
        <StoryboardView
          storyboard={storyboard}
          editable={storyboardEditable}
          disabled={storyboardDisabled}
          onSave={onStoryboardSave}
        />
      </div>
    );
  }

  if (SharedContentView) {
    return (
      <div
        className={className}
        onPointerDown={(event) => {
          if (isInteractiveContentTarget(event.target)) {
            event.stopPropagation();
          }
        }}
        onClick={(event) => {
          if (isInteractiveContentTarget(event.target)) {
            event.stopPropagation();
          }
        }}
      >
        <SharedContentView
          output={resolvedOutput}
          streaming={streaming}
          emptyText={emptyText}
          markdownClassName={markdownClassName}
          richClassName={richClassName}
          mediaLayout={mediaLayout}
        />
      </div>
    );
  }

  return fallback ? (
    <div className={className}>
      <p>{fallback}</p>
    </div>
  ) : null;
}

export function contentOutputNeedsRenderer(
  output: unknown,
  preview?: CanvasContentMediaPreview,
) {
  if (isStandalonePreviewMediaOutput(output, preview)) {
    return false;
  }
  const items = normalizedContentItems(output);
  if (items.length > 1 || contentItemsHaveMultipleMedia(items)) {
    return true;
  }
  return items.some((item) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      return hasCanvasContent(item);
    }
    return [
      item.title,
      item.text,
      item.reasoning,
      item.rich,
      item.progress,
      item.error,
      item.json,
    ].some(hasCanvasContent);
  });
}

function isStandalonePreviewMediaOutput(
  output: unknown,
  preview?: CanvasContentMediaPreview,
) {
  const outputText = standaloneOutputText(output, new Set(), 0);
  if (!outputText || !preview) {
    return false;
  }
  return [
    preview.imageUrl,
    preview.videoUrl,
    preview.audioUrl,
    preview.fileUrl,
  ].some((url) => String(url || "").trim() === outputText);
}

function standaloneOutputText(
  value: unknown,
  seen: Set<object>,
  depth: number,
): string {
  if (value == null || depth > 12) {
    return "";
  }
  if (typeof value === "string") {
    return value.trim();
  }
  if (Array.isArray(value)) {
    return value.length === 1
      ? standaloneOutputText(value[0], seen, depth + 1)
      : "";
  }
  if (typeof value !== "object" || seen.has(value)) {
    return "";
  }
  seen.add(value);

  const record = value as Record<string, unknown>;
  const contentValues = Object.entries(record)
    .filter(
      ([key, item]) =>
        !["type", "kind", "format", "version"].includes(key) &&
        hasCanvasContent(item),
    )
    .map(([, item]) => item);
  return contentValues.length === 1
    ? standaloneOutputText(contentValues[0], seen, depth + 1)
    : "";
}

export function contentOutputHasMedia(output: unknown) {
  return contentOutputMediaKinds(output).length > 0;
}

export function contentOutputMediaKinds(output: unknown) {
  const kinds = new Set<CanvasContentMediaKind>();
  const seen = new Set<object>();
  for (const item of normalizedContentItems(output)) {
    collectContentMediaKinds(item, kinds, seen, 0);
  }
  return CANVAS_CONTENT_MEDIA_KINDS.filter((kind) => kinds.has(kind));
}

function normalizedContentItems(output: unknown): unknown[] {
  const normalized = normalizeEnergonOutput?.(output);
  if (Array.isArray(normalized)) {
    return normalized;
  }
  return Array.isArray(output) ? output : [output];
}

function collectContentMediaKinds(
  value: unknown,
  kinds: Set<CanvasContentMediaKind>,
  seen: Set<object>,
  depth: number,
): void {
  if (value == null || depth > 12) {
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) =>
      collectContentMediaKinds(item, kinds, seen, depth + 1),
    );
    return;
  }
  if (typeof value === "string") {
    const kind = contentMediaKindFromURL(value);
    if (kind) {
      kinds.add(kind);
    }
    return;
  }
  if (typeof value !== "object") {
    return;
  }
  if (seen.has(value)) {
    return;
  }
  seen.add(value);

  const record = value as Record<string, unknown>;
  for (const kind of CANVAS_CONTENT_MEDIA_KINDS) {
    if (contentMediaFieldValues(record, kind).some(hasCanvasContent)) {
      kinds.add(kind);
    }
  }

  const explicitKind = contentMediaKindFromType(record.type);
  const attrs =
    record.attrs && typeof record.attrs === "object"
      ? (record.attrs as Record<string, unknown>)
      : undefined;
  if (
    explicitKind &&
    [record.url, record.src, attrs?.src, attrs?.url].some(hasCanvasContent)
  ) {
    kinds.add(explicitKind);
  }

  for (const nested of [
    record.rich,
    record.content,
    record.output,
    record.result,
    record.data,
    record.body,
    record.value,
  ]) {
    collectContentMediaKinds(nested, kinds, seen, depth + 1);
  }
}

function contentItemsHaveMultipleMedia(items: unknown[]) {
  const seen = new Set<object>();
  return items.some((item) => contentValueHasMultipleMedia(item, seen, 0));
}

function contentValueHasMultipleMedia(
  value: unknown,
  seen: Set<object>,
  depth: number,
): boolean {
  if (
    value == null ||
    depth > 12 ||
    typeof value !== "object" ||
    seen.has(value)
  ) {
    return false;
  }
  seen.add(value);

  if (Array.isArray(value)) {
    return value.some((item) =>
      contentValueHasMultipleMedia(item, seen, depth + 1),
    );
  }

  const record = value as Record<string, unknown>;
  for (const kind of CANVAS_CONTENT_MEDIA_KINDS) {
    if (
      contentMediaFieldValues(record, kind).some(
        (fieldValue) =>
          Array.isArray(fieldValue) &&
          fieldValue.filter(hasCanvasContent).length > 1,
      )
    ) {
      return true;
    }
  }

  return [
    record.rich,
    record.content,
    record.output,
    record.result,
    record.data,
    record.body,
    record.value,
  ].some((nested) => contentValueHasMultipleMedia(nested, seen, depth + 1));
}

function contentMediaFieldValues(
  record: Record<string, unknown>,
  kind: CanvasContentMediaKind,
) {
  return CANVAS_CONTENT_MEDIA_FIELDS[kind].map((field) => record[field]);
}

function contentMediaKindFromType(value: unknown) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
  if (["image", "mediaimage", "editormediaimage"].includes(normalized)) {
    return "image" as const;
  }
  if (["video", "mediavideo", "editormediavideo"].includes(normalized)) {
    return "video" as const;
  }
  if (
    ["audio", "music", "voice", "mediaaudio", "editormediaaudio"].includes(
      normalized,
    )
  ) {
    return "audio" as const;
  }
  return undefined;
}

function contentMediaKindFromURL(value: string) {
  const url = value.trim();
  if (/\.(png|jpe?g|gif|webp|avif|svg)(?:[?#].*)?$/i.test(url)) {
    return "image" as const;
  }
  if (/\.(mp4|webm|mov|m4v)(?:[?#].*)?$/i.test(url)) {
    return "video" as const;
  }
  if (/\.(mp3|wav|ogg|m4a|aac)(?:[?#].*)?$/i.test(url)) {
    return "audio" as const;
  }
  return undefined;
}

export function hasCanvasContent(value: unknown) {
  if (value == null || value === "") {
    return false;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === "object") {
    return Object.keys(value).length > 0;
  }
  return true;
}

function isInteractiveContentTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    Boolean(
      target.closest(
        "a, button, input, textarea, select, audio, video, [role='button']",
      ),
    )
  );
}
