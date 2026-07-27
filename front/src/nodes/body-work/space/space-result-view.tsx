import {
  useEffect,
  useRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
} from "react";
import { FileText } from "lucide-react";
import {
  CanvasNodeContentView,
  contentOutputNeedsRenderer,
} from "./space-content-view";

type CanvasResultPreview = {
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  fileUrl?: string;
};

export function CanvasResultView({
  output,
  fallback,
  preview,
  mediaLabel,
  className = "",
  style,
  onOpen,
  resizeControls,
  children,
  customContentIsPureMedia = false,
  followContent = false,
  followKey,
}: {
  output: unknown;
  fallback: string;
  preview: CanvasResultPreview;
  mediaLabel?: string;
  className?: string;
  style?: CSSProperties;
  onOpen?: () => void;
  resizeControls?: ReactNode;
  children?: ReactNode;
  customContentIsPureMedia?: boolean;
  followContent?: boolean;
  followKey?: unknown;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const followsLatestRef = useRef(true);
  const useContentView = contentOutputNeedsRenderer(output, preview);
  const hasCustomContent = children != null;
  const hasPureMedia =
    customContentIsPureMedia ||
    (!hasCustomContent && !useContentView && hasResultPreviewMedia(preview));
  const canOpenFromKeyboard =
    Boolean(onOpen) && (!hasCustomContent || customContentIsPureMedia);
  const classes = [
    "ws-result-view",
    "nodrag",
    "nopan",
    "nowheel",
    hasPureMedia ? "has-pure-media" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  useEffect(() => {
    if (!followContent) {
      followsLatestRef.current = true;
      return;
    }
    const scrollView = scrollRef.current;
    if (scrollView && followsLatestRef.current) {
      scrollView.scrollTop = scrollView.scrollHeight;
    }
  }, [followContent, followKey]);

  const openFromClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (
      !onOpen ||
      isInteractiveResultTarget(event.target, event.currentTarget) ||
      isScrollbarInteraction(event)
    ) {
      return;
    }
    event.preventDefault();
    onOpen();
  };
  const openFromKeyboard = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    event.stopPropagation();
    if (
      !onOpen ||
      isInteractiveResultTarget(event.target, event.currentTarget) ||
      (event.key !== "Enter" && event.key !== " ")
    ) {
      return;
    }
    event.preventDefault();
    onOpen();
  };

  return (
    <div
      role={canOpenFromKeyboard ? "button" : undefined}
      tabIndex={canOpenFromKeyboard ? 0 : undefined}
      className={classes}
      style={style}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={openFromClick}
      onKeyDown={openFromKeyboard}
    >
      <div
        ref={scrollRef}
        className="ws-result-view-scroll ws-node-scroll-content nowheel"
        onScroll={(event) => {
          if (!followContent) {
            return;
          }
          const scrollView = event.currentTarget;
          followsLatestRef.current =
            scrollView.scrollHeight -
              scrollView.scrollTop -
              scrollView.clientHeight <
            16;
        }}
      >
        {hasCustomContent ? (
          children
        ) : useContentView ? (
          <CanvasNodeContentView
            output={output}
            fallback={fallback}
            className="ws-canvas-content-view ws-result-content-view"
          />
        ) : (
          <PureResultPreview preview={preview} label={mediaLabel ?? fallback} />
        )}
      </div>
      {resizeControls}
    </div>
  );
}

function PureResultPreview({
  preview,
  label,
}: {
  preview: CanvasResultPreview;
  label: string;
}) {
  if (preview.imageUrl) {
    return (
      <figure className="ws-result-view-media">
        <img
          src={preview.imageUrl}
          alt={label || "图片结果"}
          loading="lazy"
          decoding="async"
        />
        {label ? <figcaption>{label}</figcaption> : null}
      </figure>
    );
  }
  if (preview.videoUrl) {
    return (
      <figure className="ws-result-view-media">
        <video
          key={preview.videoUrl}
          src={preview.videoUrl}
          muted
          playsInline
          preload="metadata"
          controls
        />
        {label ? <figcaption>{label}</figcaption> : null}
      </figure>
    );
  }
  if (preview.audioUrl) {
    return (
      <div className="ws-result-view-audio">
        <audio src={preview.audioUrl} controls preload="metadata" />
        {label ? <span>{label}</span> : null}
      </div>
    );
  }
  if (preview.fileUrl) {
    return (
      <a
        className="ws-result-view-file"
        href={preview.fileUrl}
        target="_blank"
        rel="noreferrer"
      >
        <FileText size={16} />
        <span>{label || "查看文件"}</span>
      </a>
    );
  }
  return (
    <CanvasNodeContentView
      output={outputFromFallback(label)}
      fallback={label}
      className="ws-canvas-content-view ws-result-content-view"
    />
  );
}

function outputFromFallback(fallback: string) {
  return fallback ? { text: fallback } : undefined;
}

function hasResultPreviewMedia(preview: CanvasResultPreview) {
  return Boolean(
    preview.imageUrl || preview.videoUrl || preview.audioUrl || preview.fileUrl,
  );
}

function isInteractiveResultTarget(
  target: EventTarget | null,
  boundary: HTMLElement,
) {
  if (!(target instanceof Element)) {
    return false;
  }
  const interactive = target.closest(
    "a, button, input, textarea, select, audio, video[controls], [role='button'], .ws-resize-control",
  );
  return Boolean(interactive && interactive !== boundary);
}

function isScrollbarInteraction(event: ReactMouseEvent<HTMLDivElement>) {
  const scrollView = event.currentTarget.querySelector<HTMLElement>(
    ":scope > .ws-result-view-scroll",
  );
  if (!scrollView || scrollView.scrollHeight <= scrollView.clientHeight) {
    return false;
  }
  const bounds = scrollView.getBoundingClientRect();
  return event.clientX >= bounds.right - 10;
}
