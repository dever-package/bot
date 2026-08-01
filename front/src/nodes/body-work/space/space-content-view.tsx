import { getCompatModule } from "@dever/front-plugin";
import { lazy, Suspense, type ComponentType } from "react";
import {
  parseStoryboardOutput,
  type StoryboardDocument,
} from "./space-storyboard";
import {
  contentOutputMediaCount,
  hasCanvasContent,
  normalizeContentOutputItems,
} from "./space-content-output";

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

type ContentViewModule = {
  ContentView?: ComponentType<SharedContentViewProps>;
  EnergonContentView?: ComponentType<SharedContentViewProps>;
};

const contentViewModule = getCompatModule(
  "@/components/energon/content-view",
) as ContentViewModule;
const SharedContentView =
  contentViewModule.ContentView || contentViewModule.EnergonContentView;

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
  const items = normalizeContentOutputItems(output);
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
