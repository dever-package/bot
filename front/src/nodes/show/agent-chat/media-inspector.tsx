import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type {
  EnergonMediaKind,
  EnergonMediaPreviewHandler,
  EnergonMediaPreviewItem,
  EnergonMediaPreviewRequest,
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
}: {
  controller: AgentChatMediaInspectorController;
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

  return (
    <aside
      className={cn(
        "absolute inset-0 z-30 flex min-h-0 min-w-0 flex-col bg-background",
        "md:static md:z-auto md:flex-1 md:border-l",
      )}
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

      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <MediaStage kind={request.kind} item={activeItem} zoom={zoom} />
        {multiple ? (
          <MediaThumbnailRail
            kind={request.kind}
            items={request.items}
            activeIndex={activeIndex}
            onSelect={selectIndex}
          />
        ) : null}
      </div>

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
}

function MediaStage({
  kind,
  item,
  zoom,
}: {
  kind: EnergonMediaKind;
  item: EnergonMediaPreviewItem;
  zoom: number;
}) {
  return (
    <div className="relative flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-auto bg-muted/20 p-4 md:p-8">
      {kind === "image" ? (
        item.url ? (
          <img
            key={item.url}
            src={item.url}
            alt={item.name}
            draggable={false}
            className="block max-h-full max-w-full select-none object-contain transition-transform duration-150"
            style={{ transform: `scale(${zoom})` }}
          />
        ) : (
          <EmptyPreview kind={kind} />
        )
      ) : null}
      {kind === "video" ? (
        item.url ? (
          <video
            key={item.url}
            src={item.url}
            poster={item.thumbnail}
            controls
            playsInline
            preload="metadata"
            className="max-h-full max-w-full bg-black object-contain"
          />
        ) : (
          <EmptyPreview kind={kind} />
        )
      ) : null}
      {kind === "audio" ? (
        <div className="flex w-full max-w-xl flex-col items-center gap-6 px-4">
          <span className="flex size-16 items-center justify-center rounded-full bg-background text-muted-foreground shadow-sm">
            <Music4 className="size-7" />
          </span>
          <div className="max-w-full truncate text-sm font-medium text-foreground">
            {item.name}
          </div>
          {item.url ? (
            <audio
              key={item.url}
              src={item.url}
              controls
              preload="metadata"
              className="w-full"
            />
          ) : null}
        </div>
      ) : null}
      {kind === "file" ? (
        <div className="flex max-w-md flex-col items-center gap-4 text-center">
          <FileText className="size-12 text-muted-foreground" />
          <div className="break-all text-sm font-medium text-foreground">
            {item.name}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MediaThumbnailRail({
  kind,
  items,
  activeIndex,
  onSelect,
}: {
  kind: EnergonMediaKind;
  items: EnergonMediaPreviewItem[];
  activeIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <nav
      className={cn(
        "flex h-20 shrink-0 gap-2 overflow-x-auto border-t bg-background px-3 py-2",
        "md:h-auto md:w-20 md:flex-col md:overflow-x-hidden md:overflow-y-auto md:border-l md:border-t-0",
      )}
      aria-label="同批素材"
    >
      {items.map((item, index) => (
        <button
          key={`${String(item.id)}-${index}`}
          type="button"
          title={item.name}
          aria-label={`查看第 ${index + 1} 个素材`}
          aria-current={index === activeIndex ? "true" : undefined}
          className={cn(
            "flex aspect-square h-full shrink-0 items-center justify-center overflow-hidden rounded-md border bg-muted/30 transition",
            "md:h-auto md:w-full",
            index === activeIndex
              ? "border-foreground ring-1 ring-foreground"
              : "hover:border-foreground/40",
          )}
          onClick={() => onSelect(index)}
        >
          {(kind === "image" && item.url) || item.thumbnail ? (
            <img
              src={item.thumbnail || item.url}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <MediaKindIcon kind={kind} className="size-5 text-muted-foreground" />
          )}
        </button>
      ))}
    </nav>
  );
}

function EmptyPreview({ kind }: { kind: EnergonMediaKind }) {
  return (
    <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
      <MediaKindIcon kind={kind} className="size-10" />
      <span>当前素材无法在线预览</span>
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
    <Button
      type="button"
      size="icon"
      variant="ghost"
      className="size-9"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="[&>svg]:size-4">{children}</span>
    </Button>
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
