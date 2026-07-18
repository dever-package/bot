import {
  FileText,
  GripVertical,
  Shuffle,
  Trash2,
  Volume2,
} from "lucide-react";
import type { DragEvent, ReactNode } from "react";
import type { ComposerAssetItem } from "./space-prompt-composer";
import type { VideoComposeClip } from "./space-video-compose";

export type VideoComposeClipPanel = "subtitle" | "sound" | "transition";

export function VideoComposeClipCard({
  clip,
  index,
  last,
  item,
  selected,
  readonly,
  onSelect,
  onPanel,
  onRemove,
  onDuration,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: {
  clip: VideoComposeClip;
  index: number;
  last: boolean;
  item?: ComposerAssetItem;
  selected: boolean;
  readonly?: boolean;
  onSelect: () => void;
  onPanel: (panel: VideoComposeClipPanel) => void;
  onRemove: () => void;
  onDuration: (duration: number) => void;
  onDragStart: () => void;
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}) {
  const transitionActive =
    !last && clip.transitionToNext.type !== "none";
  const soundActive = Boolean(
    clip.sound.voice || !clip.sound.keepOriginal || clip.sound.originalVolume !== 1,
  );
  return (
    <article
      className={`ws-video-compose-card ${selected ? "is-selected" : ""}`}
      onClick={onSelect}
      onDragOver={readonly ? undefined : onDragOver}
      onDrop={readonly ? undefined : (event) => {
        event.preventDefault();
        onDrop();
      }}
    >
      <header>
        <button
          type="button"
          className="ws-video-compose-drag"
          draggable={!readonly}
          disabled={readonly}
          title="拖动排序"
          aria-label={`拖动镜头 ${index + 1} 排序`}
          onDragStart={(event) => {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", clip.id);
            onDragStart();
          }}
          onDragEnd={onDragEnd}
        >
          <GripVertical size={13} />
        </button>
        <strong>{String(index + 1).padStart(2, "0")}</strong>
        <span>{clip.duration > 0 ? `${formatDuration(clip.duration)}秒` : "待读取"}</span>
        {!readonly ? (
          <button
            type="button"
            className="ws-video-compose-remove"
            title="删除镜头"
            aria-label={`删除镜头 ${index + 1}`}
            onClick={(event) => {
              event.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 size={12} />
          </button>
        ) : null}
      </header>
      <div className="ws-video-compose-card-preview">
        {item?.preview.videoUrl ? (
          <video
            src={item.preview.videoUrl}
            muted
            playsInline
            preload="metadata"
            onLoadedMetadata={(event) => {
              const duration = event.currentTarget.duration;
              if (Number.isFinite(duration) && duration > 0) {
                onDuration(duration);
              }
            }}
          />
        ) : item?.preview.imageUrl ? (
          <img src={item.preview.imageUrl} alt="" />
        ) : (
          <div>
            <span>素材不可用</span>
          </div>
        )}
      </div>
      <strong className="ws-video-compose-card-title">
        {clip.title || item?.title || `镜头 ${index + 1}`}
      </strong>
      <footer>
        <CardAction
          active={Boolean(clip.subtitle)}
          label="字幕"
          icon={<FileText size={12} />}
          onClick={() => onPanel("subtitle")}
        />
        <CardAction
          active={soundActive}
          label="声音"
          icon={<Volume2 size={12} />}
          onClick={() => onPanel("sound")}
        />
        {!last ? (
          <CardAction
            active={transitionActive}
            label="转场"
            icon={<Shuffle size={12} />}
            onClick={() => onPanel("transition")}
          />
        ) : (
          <span />
        )}
      </footer>
    </article>
  );
}

function CardAction({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={active ? "is-active" : ""}
      onClick={(event) => {
        event.stopPropagation();
        onClick();
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function formatDuration(value: number) {
  return value >= 10 ? Math.round(value).toString() : value.toFixed(1);
}
