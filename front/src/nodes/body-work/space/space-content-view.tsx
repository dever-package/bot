import { lazy, Suspense } from "react";
import {
  BodyContentView,
  ContentViewBoundary,
  resolveBodyContentOutput,
  type BodyContentViewProps,
} from "../shared/content-view";
import {
  parseStoryboardOutput,
  type StoryboardDocument,
} from "./space-storyboard";
import {
  contentOutputMediaCount,
  hasContentOutput,
  normalizeContentOutputItems,
  parseStoryboardGridOutput,
} from "../shared/content-output";
import { StoryboardGridView } from "../shared/storyboard-grid-view";

const StoryboardView = lazy(() =>
  import("./space-storyboard-view").then((module) => ({
    default: module.StoryboardView,
  })),
);

type CanvasContentMediaPreview = {
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  fileUrl?: string;
};

type CanvasNodeContentViewProps = BodyContentViewProps & {
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
  const resolvedOutput = resolveBodyContentOutput(output, fallback);
  const storyboard = parseStoryboardOutput(resolvedOutput);

  const storyboardGrid = parseStoryboardGridOutput(resolvedOutput);

  if (storyboardGrid) {
    return (
      <ContentViewBoundary className={className}>
        <StoryboardGridView grid={storyboardGrid} />
      </ContentViewBoundary>
    );
  }

  if (storyboard) {
    return (
      <ContentViewBoundary className={className}>
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
      </ContentViewBoundary>
    );
  }

  return (
    <BodyContentView
      output={resolvedOutput}
      fallback={fallback}
      streaming={streaming}
      emptyText={emptyText}
      className={className}
      markdownClassName={markdownClassName}
      richClassName={richClassName}
      mediaLayout={mediaLayout}
    />
  );
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
      return hasContentOutput(item);
    }
    return [
      item.title,
      item.text,
      item.reasoning,
      item.rich,
      item.progress,
      item.error,
      item.json,
    ].some(hasContentOutput);
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
        hasContentOutput(item),
    )
    .map(([, item]) => item);
  return contentValues.length === 1
    ? standaloneOutputText(contentValues[0], seen, depth + 1)
    : "";
}
