import { useEffect, useRef } from "react";
import {
  FileText,
  Image as ImageIcon,
  Music4,
  Video,
} from "lucide-react";
import {
  EnergonAudioPlayer,
  type EnergonMediaKind,
  type EnergonMediaPreviewItem,
} from "@/components/energon/content-view";
import { FirstFrameVideo } from "./first-frame-video";

export function MediaInspectorGallery({
  kind,
  items,
  activeIndex,
  zoom = 1,
  compact = false,
  className = "",
  onSelect,
}: {
  kind: EnergonMediaKind;
  items: EnergonMediaPreviewItem[];
  activeIndex: number;
  zoom?: number;
  compact?: boolean;
  className?: string;
  onSelect: (index: number) => void;
}) {
  const activeItem = items[activeIndex] || items[0];
  if (!activeItem) {
    return null;
  }

  return (
    <div
      className={[
        "bot-media-inspector-gallery",
        compact ? "is-compact" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <style>{mediaInspectorGalleryStyles}</style>
      <MediaStage kind={kind} item={activeItem} zoom={zoom} />
      {items.length > 1 ? (
        <MediaThumbnailRail
          kind={kind}
          items={items}
          activeIndex={activeIndex}
          onSelect={onSelect}
        />
      ) : null}
    </div>
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
    <div className="bot-media-inspector-stage">
      {kind === "image" ? (
        item.url ? (
          <img
            key={item.url}
            src={item.url}
            alt={item.name}
            draggable={false}
            style={{ transform: `scale(${zoom})` }}
          />
        ) : (
          <EmptyPreview kind={kind} />
        )
      ) : null}
      {kind === "video" ? (
        item.url ? (
          <FirstFrameVideo
            key={item.url}
            src={item.url}
            poster={item.thumbnail}
            controls
            playsInline
            preload="metadata"
          />
        ) : (
          <EmptyPreview kind={kind} />
        )
      ) : null}
      {kind === "audio" ? (
        item.url ? (
          <EnergonAudioPlayer
            key={item.url}
            src={item.url}
            detailed
            className="bot-media-inspector-audio"
          />
        ) : (
          <EmptyPreview kind={kind} />
        )
      ) : null}
      {kind === "file" ? (
        <div className="bot-media-inspector-file">
          <FileText aria-hidden="true" />
          <strong>{item.name}</strong>
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
  const activeItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeItemRef.current?.scrollIntoView({
      block: "nearest",
      inline: "nearest",
    });
  }, [activeIndex]);

  return (
    <nav className="bot-media-inspector-rail" aria-label="同批素材">
      <div className="bot-media-inspector-list">
        {items.map((item, index) => (
          <button
            ref={index === activeIndex ? activeItemRef : undefined}
            key={`${String(item.id)}-${index}`}
            type="button"
            title={item.name}
            aria-label={`查看第 ${index + 1} 个素材`}
            aria-current={index === activeIndex ? "true" : undefined}
            onClick={() => onSelect(index)}
          >
            {(kind === "image" && item.url) || item.thumbnail ? (
              <img src={item.thumbnail || item.url} alt="" />
            ) : (
              <MediaKindIcon kind={kind} />
            )}
          </button>
        ))}
      </div>
    </nav>
  );
}

function EmptyPreview({ kind }: { kind: EnergonMediaKind }) {
  return (
    <div className="bot-media-inspector-empty">
      <MediaKindIcon kind={kind} />
      <span>当前素材无法在线预览</span>
    </div>
  );
}

function MediaKindIcon({ kind }: { kind: EnergonMediaKind }) {
  const Icon = mediaKindIcons[kind];
  return <Icon aria-hidden="true" />;
}

const mediaKindIcons = {
  image: ImageIcon,
  video: Video,
  audio: Music4,
  file: FileText,
} satisfies Record<EnergonMediaKind, typeof ImageIcon>;

const mediaInspectorGalleryStyles = `
.bot-media-inspector-gallery {
  display: flex;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  flex: 1 1 auto;
  flex-direction: column;
}

.bot-media-inspector-gallery.is-compact {
  height: auto;
  flex: 0 0 auto;
}

.bot-media-inspector-stage {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 0;
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
  overflow: auto;
  background: var(--wb-detail-surface-soft, hsl(var(--muted) / 0.2));
  padding: 16px;
}

.bot-media-inspector-gallery.is-compact .bot-media-inspector-stage {
  min-height: 224px;
  padding: 32px 24px;
}

.bot-media-inspector-stage > img,
.bot-media-inspector-stage > video {
  display: block;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.bot-media-inspector-stage > img {
  user-select: none;
  transition: transform 150ms ease;
}

.bot-media-inspector-stage > video {
  background: #000;
}

.bot-media-inspector-audio {
  width: min(768px, 100%);
}

.bot-media-inspector-file,
.bot-media-inspector-empty {
  display: flex;
  max-width: 420px;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--wb-detail-muted, hsl(var(--muted-foreground)));
  text-align: center;
}

.bot-media-inspector-file svg,
.bot-media-inspector-empty svg {
  width: 40px;
  height: 40px;
}

.bot-media-inspector-file strong {
  color: var(--wb-detail-text, hsl(var(--foreground)));
  font-size: 14px;
  overflow-wrap: anywhere;
}

.bot-media-inspector-rail {
  display: flex;
  height: 80px;
  flex: 0 0 80px;
  border-top: 1px solid var(--wb-detail-line, hsl(var(--border)));
  background: var(--wb-detail-surface, hsl(var(--background)));
  padding: 8px 12px;
}

.bot-media-inspector-list {
  display: flex;
  min-width: 0;
  flex: 1;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
}

.bot-media-inspector-list > button {
  display: flex;
  width: 64px;
  height: 64px;
  flex: 0 0 64px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid var(--wb-detail-line, hsl(var(--border)));
  border-radius: 5px;
  background: var(--wb-detail-surface-soft, hsl(var(--muted) / 0.3));
  color: var(--wb-detail-muted, hsl(var(--muted-foreground)));
  padding: 0;
  cursor: pointer;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.bot-media-inspector-list > button:hover {
  border-color: color-mix(
    in srgb,
    var(--wb-detail-text, hsl(var(--foreground))) 40%,
    var(--wb-detail-line, hsl(var(--border)))
  );
}

.bot-media-inspector-list > button[aria-current="true"] {
  border-color: var(--wb-detail-text, hsl(var(--foreground)));
  box-shadow: 0 0 0 1px var(--wb-detail-text, hsl(var(--foreground)));
}

.bot-media-inspector-list > button img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.bot-media-inspector-list > button svg {
  width: 20px;
  height: 20px;
}

@media (min-width: 768px) {
  .bot-media-inspector-gallery {
    flex-direction: row;
  }

  .bot-media-inspector-rail {
    width: 92px;
    height: 100%;
    flex: 0 0 92px;
    border-top: 0;
    border-left: 1px solid var(--wb-detail-line, hsl(var(--border)));
    padding: 12px 10px;
  }

  .bot-media-inspector-list {
    display: grid;
    width: 100%;
    max-height: 100%;
    flex: none;
    grid-template-columns: minmax(0, 1fr);
    grid-auto-rows: 70px;
    gap: 8px;
    overflow-x: hidden;
    overflow-y: auto;
    padding-right: 2px;
  }

  .bot-media-inspector-list > button {
    width: 100%;
    height: 70px;
    min-height: 70px;
    flex: none;
  }
}
`;
