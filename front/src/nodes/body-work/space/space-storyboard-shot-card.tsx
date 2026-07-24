import {
  BookOpenText,
  Copy,
  Edit3,
  Link2,
  MessageSquareText,
  Scissors,
  Trash2,
  UserRound,
} from "lucide-react";
import type { DragEvent, MouseEvent } from "react";
import { SequenceCard } from "./space-sequence-card";
import { SpaceTooltip } from "./space-tooltip";
import {
  STORYBOARD_MATERIAL_LABELS,
  storyboardHasVisibleDialogue,
  storyboardShotMaterials,
  storyboardShotSubtitleTracks,
  storyboardSpeechLabel,
  type StoryboardDocument,
  type StoryboardMaterialType,
  type StoryboardShot,
} from "./space-storyboard";

export function StoryboardShotCard({
  shot,
  index,
  storyboard,
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
  const speechCount = shot.speech.filter((item) => item.text.trim()).length;
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
      headerActions={
        <span className="ws-storyboard-card-count">
          {speechCount ? `${speechCount} 条语音` : "无语音"}
        </span>
      }
    >
      <StoryboardShotCardBody
        shot={shot}
        storyboard={storyboard}
      />
      <footer>
        <SpaceTooltip label={editable ? "编辑镜头" : "查看镜头"}>
          <button
            type="button"
            aria-label={editable ? "编辑镜头" : "查看镜头"}
            onClick={stopAnd(onOpen)}
          >
            <Edit3 size={13} />
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
  onOpen,
}: {
  shot: StoryboardShot;
  index: number;
  storyboard: StoryboardDocument;
  onOpen?: () => void;
}) {
  return (
    <button
      type="button"
      className="ws-storyboard-compact-card nodrag nopan"
      disabled={!onOpen}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onOpen?.();
      }}
    >
      <span className="ws-storyboard-compact-head">
        <strong>{String(index + 1).padStart(2, "0")}</strong>
        <span>{shot.duration}秒</span>
        <ContinuityBadge
          continues={shot.continue_previous}
          matches={shot.match_previous}
        />
      </span>
      <span className="ws-storyboard-compact-description">
        {shot.beat || shot.description || `镜头 ${index + 1}`}
      </span>
      <span className="ws-storyboard-compact-materials">
        <MaterialSummary shot={shot} storyboard={storyboard} />
      </span>
    </button>
  );
}

function StoryboardShotCardBody({ shot, storyboard }: {
  shot: StoryboardShot;
  storyboard: StoryboardDocument;
}) {
  const speech = shot.speech.filter((item) => item.text.trim());
  const primarySpeech = speech[0];
  const characters = new Map(
    storyboard.materials
      .filter((material) => material.type === "character")
      .map((material) => [material.id, material.name]),
  );
  const labels = [...new Set(speech.map(storyboardSpeechLabel))];
  const subtitleCount = storyboardShotSubtitleTracks(shot).length;
  const lipSyncCandidate = storyboardHasVisibleDialogue(shot);
  return (
    <>
      <div className="ws-storyboard-card-preview">
        <span>
          <ContinuityBadge
            continues={shot.continue_previous}
            matches={shot.match_previous}
          />
        </span>
        <strong>{shot.beat || `镜头 ${shot.order} 的叙事变化`}</strong>
        <p>{shot.description || "等待补充镜头内容"}</p>
      </div>
      <div className="ws-storyboard-card-body">
        <div className="ws-storyboard-card-tags">
          <MaterialSummary shot={shot} storyboard={storyboard} />
          {labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
          {subtitleCount ? <span>{subtitleCount} 条字幕</span> : null}
          {lipSyncCandidate ? (
            <span className="is-lip-sync">可选口型</span>
          ) : null}
        </div>
        <p className="ws-storyboard-card-camera">
          {shot.camera_instruction || "未设置镜头语言"}
        </p>
        {primarySpeech ? (
          <p className="ws-storyboard-card-speech">
            {primarySpeech.kind === "dialogue" ? (
              <UserRound size={12} />
            ) : (
              <BookOpenText size={12} />
            )}
            <strong>
              {primarySpeech.kind === "dialogue"
                ? characters.get(primarySpeech.character_id || "") || "待选角色"
                : "旁白"}
            </strong>
            <span>{primarySpeech.text}</span>
          </p>
        ) : (
          <p className="ws-storyboard-card-speech is-empty">
            <MessageSquareText size={12} />
            <span>当前镜头没有对白或旁白</span>
          </p>
        )}
      </div>
    </>
  );
}

function MaterialSummary({
  shot,
  storyboard,
}: {
  shot: StoryboardShot;
  storyboard: StoryboardDocument;
}) {
  const counts = new Map<StoryboardMaterialType, number>();
  for (const material of storyboardShotMaterials(storyboard, shot)) {
    counts.set(material.type, (counts.get(material.type) || 0) + 1);
  }
  if (!counts.size) {
    return <span className="is-empty">无关联素材</span>;
  }
  return (
    <>
      {(["character", "scene", "prop"] as const).map((type) =>
        counts.get(type) ? (
          <span key={type}>
            {STORYBOARD_MATERIAL_LABELS[type]} {counts.get(type)}
          </span>
        ) : null,
      )}
    </>
  );
}

function ContinuityBadge({
  continues,
  matches,
}: {
  continues: boolean;
  matches: boolean;
}) {
  const linked = continues || matches;
  return (
    <span
      className={`ws-storyboard-continuity ${linked ? "is-linked" : "is-cut"}`}
    >
      {linked ? <Link2 size={11} /> : <Scissors size={11} />}
      {continues ? "延续上镜" : matches ? "匹配上镜" : "切镜"}
    </span>
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
