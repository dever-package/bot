import { Copy, Edit3, Trash2 } from "lucide-react";
import type { DragEvent, MouseEvent } from "react";
import { SequenceCard } from "./space-sequence-card";
import { SpaceTooltip } from "./space-tooltip";
import {
  type StoryboardDocument,
  type StoryboardShot,
} from "./space-storyboard";
import {
  type StoryboardFrame,
  type StoryboardFrameMedia,
} from "./space-storyboard-media";
import type {
  StoryboardReadableShot,
  StoryboardReadingContext,
} from "./space-storyboard-preview";
import "./space-storyboard-shot-card.css";

export function StoryboardShotCard({
  shot,
  index,
  storyboard,
  frame,
  selected = false,
  editable = false,
  dragging = false,
  dropPlacement,
  onOpen,
  onDuplicate,
  onRemove,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: {
  shot: StoryboardShot;
  index: number;
  storyboard: StoryboardDocument;
  frame?: StoryboardFrame;
  selected?: boolean;
  editable?: boolean;
  dragging?: boolean;
  dropPlacement?: "before" | "after";
  onOpen: () => void;
  onDuplicate?: () => void;
  onRemove?: () => void;
  onDragStart?: () => void;
  onDragOver?: (event: DragEvent<HTMLElement>) => void;
  onDrop?: () => void;
  onDragEnd?: () => void;
}) {
  return (
    <SequenceCard
      itemId={shot.id}
      index={index}
      durationLabel={`${shot.duration}秒`}
      className="ws-storyboard-card"
      dragClassName="ws-storyboard-card-drag"
      selected={selected}
      readonly={!editable}
      wholeCardDraggable
      dragging={dragging}
      dropPlacement={dropPlacement}
      ariaLabel={`镜头 ${index + 1}`}
      onSelect={onOpen}
      onDragStart={onDragStart || noop}
      onDragOver={onDragOver || noopDrag}
      onDrop={onDrop || noop}
      onDragEnd={onDragEnd || noop}
    >
      <StoryboardShotReading
        shot={shot}
        storyboard={storyboard}
        frame={frame}
      />
      <footer>
        <SpaceTooltip label={editable ? "编辑镜头" : "查看镜头"}>
          <button
            type="button"
            aria-label={editable ? "编辑镜头" : "查看镜头"}
            onClick={stopAnd(onOpen)}
          >
            <Edit3 size={13} />
            <span>{editable ? "编辑镜头" : "查看镜头"}</span>
          </button>
        </SpaceTooltip>
        {editable && onDuplicate ? (
          <SpaceTooltip label="复制镜头">
            <button
              type="button"
              aria-label="复制镜头"
              onClick={stopAnd(onDuplicate)}
            >
              <Copy size={13} />
            </button>
          </SpaceTooltip>
        ) : null}
        {editable && onRemove ? (
          <SpaceTooltip label="删除镜头">
            <button
              type="button"
              className="is-danger"
              aria-label="删除镜头"
              onClick={stopAnd(onRemove)}
            >
              <Trash2 size={13} />
            </button>
          </SpaceTooltip>
        ) : null}
      </footer>
    </SequenceCard>
  );
}

export function StoryboardCompactShotCard({
  shot,
  index,
  storyboard,
  frame,
  onOpen,
}: {
  shot: StoryboardReadableShot;
  index: number;
  storyboard?: StoryboardReadingContext;
  frame?: StoryboardFrame;
  onOpen?: () => void;
}) {
  return (
    <button
      type="button"
      className="ws-storyboard-compact-card nodrag nopan"
      aria-label={`查看镜头 ${index + 1}`}
      disabled={!onOpen}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onOpen?.();
      }}
    >
      <span className="ws-storyboard-compact-head">
        <strong>镜头 {String(index + 1).padStart(2, "0")}</strong>
        <span>{shot.duration}秒</span>
      </span>
      <StoryboardShotReading
        shot={shot}
        storyboard={storyboard}
        frame={frame}
      />
    </button>
  );
}

function StoryboardShotReading({
  shot,
  storyboard,
  frame,
}: {
  shot: StoryboardReadableShot;
  storyboard?: StoryboardReadingContext;
  frame?: StoryboardFrame;
}) {
  const media =
    frame?.references?.filter((entry) => entry.imageURL) ||
    [frame?.start, frame?.end].filter((entry): entry is StoryboardFrameMedia =>
      Boolean(entry?.imageURL),
    );
  const speech = shot.speech.filter((entry) => entry.text.trim());
  return (
    <div className="ws-storyboard-card-reading">
      {shot.start_framing || shot.camera_instruction ? (
        <p className="ws-storyboard-card-camera">
          {shot.start_framing ? (
            <span title={shot.start_framing}>{shot.start_framing}</span>
          ) : null}
          {shot.camera_instruction ? (
            <span title={shot.camera_instruction}>
              {shot.camera_instruction}
            </span>
          ) : null}
        </p>
      ) : null}
      {media.length ? (
        <div
          className="ws-storyboard-card-images"
          style={{
            aspectRatio: storyboard?.aspect_ratio?.replace(":", " / "),
          }}
        >
          {media.slice(0, 1).map((entry, index) => (
            <img
              key={`${entry.imageURL}:${index}`}
              src={entry.imageURL}
              alt={`镜头 ${shot.order}画面`}
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      ) : null}
      <div className="ws-storyboard-card-description">
        {shot.beat ? <p>{shot.beat}</p> : null}
        {shot.description && shot.description.trim() !== shot.beat.trim() ? (
          <p>{shot.description}</p>
        ) : null}
        {!shot.beat && !shot.description ? <p>等待补充镜头内容</p> : null}
      </div>
      {speech.length ? (
        <div className="ws-storyboard-card-speech">
          {speech.map((entry) => (
            <p key={entry.id}>
              <strong>
                {entry.kind === "dialogue"
                  ? storyboard?.materials.find(
                      (material) => material.id === entry.character_id,
                    )?.name || "对白"
                  : "旁白"}
              </strong>
              <span>{entry.text}</span>
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function stopAnd(action: () => void) {
  return (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    action();
  };
}

function noop() {}

function noopDrag(_event: DragEvent<HTMLElement>) {}
