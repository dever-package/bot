import { getCompatModule } from "@dever/front-plugin";
import { lazy, Suspense, type ComponentType } from "react";
import {
  parseStoryboardOutput,
  type StoryboardDocument,
} from "./space-storyboard";

const StoryboardView = lazy(() =>
  import("./space-storyboard-view").then((module) => ({
    default: module.StoryboardView,
  })),
);

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
        <Suspense
          fallback={<div className="min-h-24" aria-busy="true" />}
        >
          <StoryboardView
            storyboard={storyboard}
            editable={storyboardEditable}
            disabled={storyboardDisabled}
            onSave={onStoryboardSave}
          />
        </Suspense>
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
  if (items.length > 1 || contentOutputMediaCount(output) > 1) {
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
  const media = contentOutputMediaIndex(output);
  return CANVAS_CONTENT_MEDIA_KINDS.filter((kind) => media[kind].size > 0);
}

export function contentOutputMediaCount(output: unknown) {
  const media = contentOutputMediaIndex(output);
  return CANVAS_CONTENT_MEDIA_KINDS.reduce(
    (total, kind) => total + media[kind].size,
    0,
  );
}

export function contentOutputMediaURLs(
  output: unknown,
  kind: CanvasContentMediaKind,
) {
  return Array.from(contentOutputMediaIndex(output)[kind]);
}

export function preferRicherMediaOutput(...values: unknown[]) {
  let fallback: unknown;
  let selected: unknown;
  let selectedMediaCount = 0;
  for (const value of values) {
    if (!hasCanvasContent(value)) {
      continue;
    }
    if (fallback === undefined) {
      fallback = value;
    }
    const mediaCount = contentOutputMediaCount(value);
    if (mediaCount > selectedMediaCount) {
      selected = value;
      selectedMediaCount = mediaCount;
    }
  }
  return selectedMediaCount > 0 ? selected : fallback;
}

function contentOutputMediaIndex(output: unknown) {
  const media: Record<CanvasContentMediaKind, Set<string>> = {
    image: new Set<string>(),
    video: new Set<string>(),
    audio: new Set<string>(),
  };
  const seen = new Set<object>();
  for (const item of normalizedContentItems(output)) {
    collectContentMedia(item, media, seen, 0);
  }
  return media;
}

function normalizedContentItems(output: unknown): unknown[] {
  const normalized = normalizeEnergonOutput?.(output);
  if (Array.isArray(normalized)) {
    return normalized;
  }
  return Array.isArray(output) ? output : [output];
}

function collectContentMedia(
  value: unknown,
  media: Record<CanvasContentMediaKind, Set<string>>,
  seen: Set<object>,
  depth: number,
  fieldKind?: CanvasContentMediaKind,
): void {
  if (value == null || depth > 12) {
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item) =>
      collectContentMedia(item, media, seen, depth + 1, fieldKind),
    );
    return;
  }
  if (typeof value === "string") {
    const kind = fieldKind || contentMediaKindFromURL(value);
    if (kind) {
      const identity = value.trim();
      if (identity) {
        media[kind].add(identity);
      }
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
  if (fieldKind) {
    for (const direct of [
      record.url,
      record.src,
      record.thumbnail,
      record.download_url,
      record.downloadUrl,
    ]) {
      collectContentMedia(direct, media, seen, depth + 1, fieldKind);
    }
  }
  for (const kind of CANVAS_CONTENT_MEDIA_KINDS) {
    for (const fieldValue of contentMediaFieldValues(record, kind)) {
      collectContentMedia(fieldValue, media, seen, depth + 1, kind);
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
    for (const direct of [record.url, record.src, attrs?.src, attrs?.url]) {
      collectContentMedia(direct, media, seen, depth + 1, explicitKind);
    }
  }

  for (const nested of [
    record.rich,
    record.content,
    record.output,
    record.result,
    record.data,
    record.body,
    record.value,
    record.json,
    record.media_files,
    record.mediaFiles,
  ]) {
    collectContentMedia(nested, media, seen, depth + 1);
  }
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
