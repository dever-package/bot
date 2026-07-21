import { FileText, Shuffle, Trash2, Volume2 } from "lucide-react";
import type { DragEvent, ReactNode } from "react";
import type { ComposerAssetItem } from "./space-prompt-composer";
import type { VideoComposeClip } from "./space-video-compose";
import { SequenceCard } from "./space-sequence-card";

export type VideoComposeClipPanel = "subtitle" | "sound" | "transition";

export function VideoComposeClipCard({
  clip,
  index,
  last,
  item,
  selected,
  readonly,
  wholeCardDraggable,
  dragging,
  dropPlacement,
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
  wholeCardDraggable?: boolean;
  dragging?: boolean;
  dropPlacement?: "before" | "after";
  onSelect: () => void;
  onPanel: (panel: VideoComposeClipPanel) => void;
  onRemove: () => void;
  onDuration: (duration: number) => void;
  onDragStart: () => void;
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}) {
  const transitionActive = !last && clip.transitionToNext.type !== "none";
  const soundActive = Boolean(
    clip.originalAudioSource || clip.speechTracks.length > 0,
  );
  return (
    <SequenceCard
      itemId={clip.id}
      index={index}
      durationLabel={
        clip.duration > 0 ? `${formatDuration(clip.duration)}秒` : "待读取"
      }
      className="ws-video-compose-card"
      dragClassName="ws-video-compose-drag"
      selected={selected}
      readonly={readonly}
      wholeCardDraggable={wholeCardDraggable}
      dragging={dragging}
      dropPlacement={dropPlacement}
      ariaLabel={`镜头 ${index + 1}`}
      onSelect={onSelect}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      headerActions={
        !readonly ? (
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
        ) : undefined
      }
    >
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
      <div className="ws-video-compose-card-meta">
        <strong className="ws-video-compose-card-title">
          {clip.title || item?.title || `镜头 ${index + 1}`}
        </strong>
        {clip.blockingIssues.length ? (
          <small className="ws-video-compose-card-blocking">
            {clip.blockingIssues[0]}
          </small>
        ) : null}
      </div>
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
    </SequenceCard>
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
