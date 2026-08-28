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
  parseStoryboardGridOutput,
  type ContentMediaKind,
} from "../shared/content-output";
import { MediaGridView } from "../shared/media-grid-view";
import { StoryboardGridView } from "../shared/storyboard-grid-view";
import { canvasMultiMediaGridOutput } from "./space-content-output";

const StoryboardView = lazy(() =>
  import("./space-storyboard-view").then((module) => ({
    default: module.StoryboardView,
  })),
);

type CanvasNodeContentViewProps = BodyContentViewProps & {
  mediaGridKind?: ContentMediaKind;
  compactMediaGrid?: boolean;
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
  mediaGridKind,
  compactMediaGrid = false,
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
        <Suspense fallback={<div className="min-h-24" aria-busy="true" />}>
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

  const mediaGrid = canvasMultiMediaGridOutput(resolvedOutput, mediaGridKind);
  if (mediaGrid) {
    return (
      <ContentViewBoundary
        className={[className, "ws-media-grid-content"]
          .filter(Boolean)
          .join(" ")}
      >
        <MediaGridView
          kind={mediaGrid.kind}
          items={mediaGrid.items}
          label={fallback}
          compact={compactMediaGrid}
        />
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
