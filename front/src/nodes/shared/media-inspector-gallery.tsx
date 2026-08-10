import { useEffect, useRef, useState } from "react";
import { FileText, Image as ImageIcon, Music4, Video } from "lucide-react";
import {
  EnergonAudioPlayer,
  type EnergonMediaKind,
  type EnergonMediaPreviewItem,
} from "@/components/energon/content-view";
import { FirstFrameVideo } from "@/components/media/first-frame-video";
import { VideoThumbnail } from "./video-thumbnail";
import { ResourceDownloadButton } from "./resource-download-button";
import { resourceNameFromURL } from "./resource-file";
import "./media-inspector-gallery.css";

type MediaInspectorSupplementalText = {
  label: string;
  text: string;
};

export function MediaInspector({
  kind,
  urls = [],
  mediaItems,
  zoom = 1,
  compact = false,
  downloadable = false,
  className = "",
  supplementalText,
}: {
  kind: EnergonMediaKind;
  urls?: string[];
  mediaItems?: Array<{ url: string; thumbnail?: string }>;
  zoom?: number;
  compact?: boolean;
  downloadable?: boolean;
  className?: string;
  supplementalText?: MediaInspectorSupplementalText | null;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const resolvedMediaItems: Array<{ url: string; thumbnail?: string }> =
    mediaItems && mediaItems.length > 0
      ? mediaItems
      : urls.map((url) => ({ url }));
  const mediaIdentity = resolvedMediaItems
    .map((item) => `${item.url}\n${item.thumbnail || ""}`)
    .join("\n");

  useEffect(() => {
    setActiveIndex(0);
  }, [mediaIdentity]);

  const items = resolvedMediaItems.map((item, index) => ({
    id: item.url,
    name: resourceNameFromURL(
      item.url,
      `${mediaKindLabels[kind]} ${index + 1}`,
    ),
    url: item.url,
    thumbnail: item.thumbnail,
  }));
  if (items.length === 0) {
    return null;
  }

  return (
    <MediaInspectorGallery
      kind={kind}
      items={items}
      activeIndex={Math.min(activeIndex, items.length - 1)}
      zoom={zoom}
      compact={compact}
      downloadable={downloadable}
      className={className}
      supplementalText={supplementalText}
      onSelect={setActiveIndex}
    />
  );
}

export function MediaInspectorGallery({
  kind,
  items,
  activeIndex,
  zoom = 1,
  compact = false,
  downloadable = false,
  className = "",
  supplementalText,
  onSelect,
}: {
  kind: EnergonMediaKind;
  items: EnergonMediaPreviewItem[];
  activeIndex: number;
  zoom?: number;
  compact?: boolean;
  downloadable?: boolean;
  className?: string;
  supplementalText?: MediaInspectorSupplementalText | null;
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
      <MediaStage
        kind={kind}
        item={activeItem}
        zoom={zoom}
        downloadable={downloadable}
        supplementalText={supplementalText}
      />
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
  downloadable,
  supplementalText,
}: {
  kind: EnergonMediaKind;
  item: EnergonMediaPreviewItem;
  zoom: number;
  downloadable: boolean;
  supplementalText?: MediaInspectorSupplementalText | null;
}) {
  return (
    <div className="bot-media-inspector-stage">
      {downloadable && item.url ? (
        <ResourceDownloadButton
          className="bot-media-inspector-download"
          url={item.url}
          name={item.name}
          label="下载当前素材"
        />
      ) : null}
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
            preload={item.thumbnail ? "none" : "metadata"}
          />
        ) : (
          <EmptyPreview kind={kind} />
        )
      ) : null}
      {kind === "audio" ? (
        item.url ? (
          <div className="bot-media-inspector-audio-content">
            {item.thumbnail ? (
              <img
                key={item.thumbnail}
                className="bot-media-inspector-audio-cover"
                src={item.thumbnail}
                alt={item.name}
                draggable={false}
              />
            ) : null}
            <EnergonAudioPlayer
              key={item.url}
              src={item.url}
              detailed
              preload="none"
              className="bot-media-inspector-audio"
            />
            {supplementalText?.text ? (
              <section className="bot-media-inspector-audio-text">
                <strong>{supplementalText.label}</strong>
                <p>{supplementalText.text}</p>
              </section>
            ) : null}
          </div>
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
            {kind === "video" && item.url ? (
              <VideoThumbnail
                key={item.url}
                src={item.url}
                poster={item.thumbnail}
                draggable={false}
                ariaHidden
              />
            ) : (kind === "image" && item.url) || item.thumbnail ? (
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

const mediaKindLabels = {
  image: "图片",
  video: "视频",
  audio: "音频",
  file: "文件",
} satisfies Record<EnergonMediaKind, string>;

const mediaKindIcons = {
  image: ImageIcon,
  video: Video,
  audio: Music4,
  file: FileText,
} satisfies Record<EnergonMediaKind, typeof ImageIcon>;
