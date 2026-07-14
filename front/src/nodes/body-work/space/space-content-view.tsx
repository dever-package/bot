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
  mediaLayout?: "default" | "chat";
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

export const normalizeEnergonOutput =
  contentViewModule.normalizeEnergonOutput;

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

export function contentOutputNeedsRenderer(output: unknown) {
  const normalized = normalizeEnergonOutput?.(output);
  const items = Array.isArray(normalized)
    ? normalized
    : Array.isArray(output)
      ? output
      : [output];
  if (items.length > 1) {
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

function hasCanvasContent(value: unknown) {
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
