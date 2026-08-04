import { getCompatModule } from "@dever/front-plugin";
import type {
  ComponentType,
  ReactNode,
  SyntheticEvent,
} from "react";
import { hasContentOutput } from "./content-output";

export type BodyContentViewProps = {
  output?: unknown;
  fallback?: string;
  streaming?: boolean;
  emptyText?: string;
  className?: string;
  markdownClassName?: string;
  richClassName?: string;
  mediaLayout?: "default" | "chat" | "detail";
};

type HostContentViewProps = Omit<BodyContentViewProps, "fallback">;

type ContentViewModule = {
  ContentView?: ComponentType<HostContentViewProps>;
  EnergonContentView?: ComponentType<HostContentViewProps>;
};

const contentViewModule = getCompatModule(
  "@/components/energon/content-view",
) as ContentViewModule;
const HostContentView =
  contentViewModule.ContentView || contentViewModule.EnergonContentView;

export function BodyContentView({
  output,
  fallback = "",
  streaming = false,
  emptyText = "暂无内容",
  className,
  markdownClassName,
  richClassName,
  mediaLayout = "default",
}: BodyContentViewProps) {
  const resolvedOutput = resolveBodyContentOutput(output, fallback);
  if (!HostContentView) {
    return fallback ? <div className={className}>{fallback}</div> : null;
  }
  return (
    <ContentViewBoundary className={className}>
      <HostContentView
        output={resolvedOutput}
        streaming={streaming}
        emptyText={emptyText}
        markdownClassName={markdownClassName}
        richClassName={richClassName}
        mediaLayout={mediaLayout}
      />
    </ContentViewBoundary>
  );
}

export function resolveBodyContentOutput(output: unknown, fallback = "") {
  return hasContentOutput(output)
    ? output
    : fallback
      ? { text: fallback }
      : output;
}

export function ContentViewBoundary({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const stopInteractiveEvent = (event: SyntheticEvent) => {
    if (isInteractiveContentTarget(event.target)) {
      event.stopPropagation();
    }
  };
  return (
    <div
      className={className}
      onPointerDown={stopInteractiveEvent}
      onClick={stopInteractiveEvent}
    >
      {children}
    </div>
  );
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
