import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  type EnergonMediaKind,
  type EnergonMediaPreviewHandler,
  type EnergonMediaPreviewRequest,
} from "@/components/energon/content-view";
import {
  Download,
  FileText,
  ImageIcon,
  Loader2,
  Maximize2,
  Minus,
  Music4,
  Plus,
  Video,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  findAgentChatMediaArtifact,
  readAgentChatMediaPreviewContext,
} from "./artifact-actions";
import { AgentChatTooltip } from "./tooltip";
import type { AgentChatArtifactActionRenderer } from "./types";
import { MediaInspectorGallery } from "../../shared/media-inspector-gallery";

const MediaPreviewContext = createContext<EnergonMediaPreviewHandler | null>(
  null,
);

export type AgentChatMediaInspectorController = ReturnType<
  typeof useAgentChatMediaInspector
>;

export function useAgentChatMediaInspector() {
  const [request, setRequest] = useState<EnergonMediaPreviewRequest | null>(
    null,
  );
  const [activeIndex, setActiveIndex] = useState(0);

  const openPreview = useCallback<EnergonMediaPreviewHandler>((nextRequest) => {
    const initialIndex = nextRequest.items.findIndex(
      (item) => String(item.id) === String(nextRequest.initialItemId),
    );
    setRequest(nextRequest);
    setActiveIndex(initialIndex >= 0 ? initialIndex : 0);
  }, []);

  const closePreview = useCallback(() => {
    setRequest(null);
    setActiveIndex(0);
  }, []);

  const selectIndex = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const move = useCallback(
    (direction: -1 | 1) => {
      const count = request?.items.length || 0;
      if (count <= 1) {
        return;
      }
      setActiveIndex((current) => (current + direction + count) % count);
    },
    [request?.items.length],
  );

  const activeItem = request?.items[activeIndex];

  return {
    request,
    activeIndex,
    activeItem,
    open: Boolean(request && activeItem),
    openPreview,
    closePreview,
    selectIndex,
    move,
  };
}

export function AgentChatMediaPreviewProvider({
  controller,
  children,
}: PropsWithChildren<{ controller: AgentChatMediaInspectorController }>) {
  return (
    <MediaPreviewContext.Provider value={controller.openPreview}>
      {children}
    </MediaPreviewContext.Provider>
  );
}

export function useAgentChatMediaPreview() {
  return useContext(MediaPreviewContext) || undefined;
}

export function AgentChatMediaInspector({
  controller,
  renderArtifactActions,
}: {
  controller: AgentChatMediaInspectorController;
  renderArtifactActions?: AgentChatArtifactActionRenderer;
}) {
  const { request, activeIndex, activeItem, closePreview, move, selectIndex } =
    controller;
  const [zoom, setZoom] = useState(1);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  useEffect(() => {
    setZoom(1);
    setDownloadError("");
  }, [activeItem?.id]);

  useEffect(() => {
    if (!request) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        closePreview();
        return;
      }
      if (isInteractiveKeyTarget(event.target)) {
        return;
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        move(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        move(1);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [closePreview, move, request]);

  const downloadCurrent = useCallback(async () => {
    if (!request || !activeItem || downloading) {
      return;
    }
    setDownloading(true);
    setDownloadError("");
    try {
      await request.download(activeItem.id);
    } catch (error) {
      setDownloadError(error instanceof Error ? error.message : "下载素材失败");
    } finally {
      setDownloading(false);
    }
  }, [activeItem, downloading, request]);

  if (!request || !activeItem) {
    return null;
  }

  const multiple = request.items.length > 1;
  const title = mediaKindLabel(request.kind);
  const compact = request.kind === "audio" || request.kind === "file";
  const previewContext = readAgentChatMediaPreviewContext(request.context);
  const activeArtifact = previewContext
    ? findAgentChatMediaArtifact(
        previewContext.artifacts,
        request.kind,
        activeItem.url,
        activeIndex,
      )
    : null;

  const inspector = (
    <aside
      className={cn(
        "flex min-h-0 min-w-0 flex-col bg-background",
        compact
          ? "relative max-h-[min(80dvh,480px)] w-full max-w-2xl overflow-hidden rounded-lg border shadow-xl"
          : "absolute inset-0 z-30 md:static md:z-auto md:flex-1 md:border-l",
      )}
      role={compact ? "dialog" : undefined}
      aria-modal={compact ? "true" : undefined}
      aria-label={`${title}预览`}
    >
      <header className="flex h-14 shrink-0 items-center gap-3 border-b px-3 md:px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <MediaKindIcon kind={request.kind} className="size-4 shrink-0" />
          <span className="shrink-0 text-sm font-semibold text-foreground">
            {title}
            {multiple ? ` ${activeIndex + 1}/${request.items.length}` : ""}
          </span>
          {request.kind === "audio" || request.kind === "file" ? (
            <span className="truncate text-xs text-muted-foreground">
              {activeItem.name}
            </span>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {activeArtifact && previewContext && renderArtifactActions
            ? renderArtifactActions({
                messageID: previewContext.messageID,
                artifact: activeArtifact,
                placement: "preview",
              })
            : null}
          {request.kind === "image" ? (
            <>
              <InspectorButton
                label="缩小"
                disabled={zoom <= 0.5}
                onClick={() => setZoom((current) => clampZoom(current - 0.25))}
              >
                <Minus />
              </InspectorButton>
              <span className="hidden w-11 text-center text-xs tabular-nums text-muted-foreground sm:inline">
                {Math.round(zoom * 100)}%
              </span>
              <InspectorButton
                label="放大"
                disabled={zoom >= 3}
                onClick={() => setZoom((current) => clampZoom(current + 0.25))}
              >
                <Plus />
              </InspectorButton>
              <InspectorButton label="适应窗口" onClick={() => setZoom(1)}>
                <Maximize2 />
              </InspectorButton>
            </>
          ) : null}
          <InspectorButton
            label="下载"
            disabled={downloading}
            onClick={() => void downloadCurrent()}
          >
            {downloading ? <Loader2 className="animate-spin" /> : <Download />}
          </InspectorButton>
          <InspectorButton label="关闭预览" onClick={closePreview}>
            <X />
          </InspectorButton>
        </div>
      </header>

      <MediaInspectorGallery
        kind={request.kind}
        items={request.items}
        activeIndex={activeIndex}
        zoom={zoom}
        compact={compact}
        className={compact ? "flex-none" : "flex-1"}
        onSelect={selectIndex}
      />

      {downloadError ? (
        <div
          role="alert"
          className="absolute bottom-4 left-1/2 max-w-[80%] -translate-x-1/2 rounded-md bg-destructive px-3 py-2 text-xs text-white shadow-lg"
        >
          {downloadError}
        </div>
      ) : null}
    </aside>
  );

  if (!compact) {
    return inspector;
  }

  return (
    <div
      className="absolute inset-0 z-30 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-[1px]"
      role="presentation"
      onPointerDown={(event) => {
        if (event.target === event.currentTarget) {
          closePreview();
        }
      }}
    >
      {inspector}
    </div>
  );
}

function InspectorButton({
  label,
  children,
  disabled,
  onClick,
}: PropsWithChildren<{
  label: string;
  disabled?: boolean;
  onClick: () => void;
}>) {
  return (
    <AgentChatTooltip label={label}>
      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="size-9"
        aria-label={label}
        disabled={disabled}
        onClick={onClick}
      >
        <span className="[&>svg]:size-4">{children}</span>
      </Button>
    </AgentChatTooltip>
  );
}

function MediaKindIcon({
  kind,
  className,
}: {
  kind: EnergonMediaKind;
  className?: string;
}) {
  const Icon = mediaKindIcons[kind];
  return <Icon className={className} />;
}

const mediaKindIcons = {
  image: ImageIcon,
  video: Video,
  audio: Music4,
  file: FileText,
} satisfies Record<EnergonMediaKind, typeof ImageIcon>;

function mediaKindLabel(kind: EnergonMediaKind) {
  if (kind === "image") return "图片";
  if (kind === "video") return "视频";
  if (kind === "audio") return "音频";
  return "文件";
}

function clampZoom(value: number) {
  return Math.min(3, Math.max(0.5, value));
}

function isInteractiveKeyTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    Boolean(target.closest("button, input, textarea, select, video, audio"))
  );
}
