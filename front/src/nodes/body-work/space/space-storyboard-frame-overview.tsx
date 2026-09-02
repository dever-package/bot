import {
  CheckCircle2,
  FileText,
  ImageIcon,
  Loader2,
  Music2,
  Play,
  Square,
  Video,
} from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import { SpaceTooltip } from "./space-tooltip";

export type StoryboardFrameResultData = {
  nodeId: string;
  title: string;
  status:
    | "pending"
    | "running"
    | "waiting"
    | "complete"
    | "stale"
    | "error";
  statusLabel: string;
  imageUrl: string;
  videoUrl: string;
  videoPosterUrl: string;
  audioUrl: string;
  text: string;
  onOpen: () => void;
};

export type StoryboardFrameGroupData = {
  id: string;
  title: string;
  memberCount: number;
  runnableCount: number;
  completedCount: number;
  failedCount: number;
  staleCount: number;
  status: "idle" | "running" | "waiting" | "error";
  runBlockedReason: string;
  stopping: boolean;
  results: StoryboardFrameResultData[];
  onRun?: () => void;
  onStop?: () => void;
};

export function StoryboardFrameOverview({
  groups,
}: {
  groups: StoryboardFrameGroupData[];
}) {
  const [selectedGroupId, setSelectedGroupId] = useState(
    () => groups.find(storyboardFrameGroupActive)?.id || groups[0]?.id || "",
  );

  useEffect(() => {
    if (groups.some((group) => group.id === selectedGroupId)) {
      return;
    }
    setSelectedGroupId(
      groups.find(storyboardFrameGroupActive)?.id || groups[0]?.id || "",
    );
  }, [groups, selectedGroupId]);

  const selectedGroup =
    groups.find((group) => group.id === selectedGroupId) || groups[0];
  return (
    <div className="ws-storyboard-frame-overview nodrag nopan nowheel">
      <div className="ws-storyboard-frame-groups" aria-label="制作分组">
        {groups.map((group) => (
          <StoryboardFrameGroupRow
            key={group.id}
            group={group}
            selected={group.id === selectedGroup?.id}
            onSelect={() => setSelectedGroupId(group.id)}
          />
        ))}
      </div>
      <StoryboardFrameResultList group={selectedGroup} />
    </div>
  );
}

function StoryboardFrameGroupRow({
  group,
  selected,
  onSelect,
}: {
  group: StoryboardFrameGroupData;
  selected: boolean;
  onSelect: () => void;
}) {
  const active = storyboardFrameGroupActive(group);
  const status = storyboardFrameGroupStatus(group);
  const action = active ? group.onStop : group.onRun;
  const actionLabel = active
    ? group.stopping
      ? "正在停止"
      : group.onStop
        ? `停止${group.title}`
        : `${group.title}正在执行`
    : group.runBlockedReason || storyboardFrameGroupRunLabel(group);
  return (
    <div
      className={`ws-storyboard-frame-group ${selected ? "is-selected" : ""} ${
        active ? "is-running" : ""
      } ${group.status === "error" ? "is-error" : ""}`}
    >
      <button
        type="button"
        className="ws-storyboard-frame-group-select nodrag nopan"
        onClick={stopAnd(onSelect)}
      >
        <span>
          <strong>{group.title}</strong>
          <small>{status}</small>
        </span>
        <em>
          {group.completedCount}/{group.runnableCount || group.memberCount}
        </em>
      </button>
      <SpaceTooltip label={actionLabel}>
        <button
          type="button"
          className={`ws-storyboard-frame-group-action nodrag nopan ${
            active ? "is-stop" : ""
          }`}
          aria-label={actionLabel}
          disabled={
            group.stopping ||
            !action ||
            (!active && Boolean(group.runBlockedReason))
          }
          onClick={
            action
              ? stopAnd(() => {
                  onSelect();
                  action();
                })
              : undefined
          }
        >
          {group.stopping || (active && !group.onStop) ? (
            <Loader2 size={13} className="ws-spin" />
          ) : active ? (
            <Square size={12} fill="currentColor" />
          ) : (
            <Play size={13} fill="currentColor" />
          )}
        </button>
      </SpaceTooltip>
    </div>
  );
}

function StoryboardFrameResultList({
  group,
}: {
  group?: StoryboardFrameGroupData;
}) {
  if (!group) {
    return (
      <div className="ws-storyboard-frame-results is-empty">
        暂无制作分组
      </div>
    );
  }
  return (
    <section className="ws-storyboard-frame-results">
      <header>
        <strong>{group.title}</strong>
        <span>{group.results.length} 项结果</span>
      </header>
      {group.results.length > 0 ? (
        <div className="ws-storyboard-frame-result-grid">
          {group.results.map((result) => (
            <button
              key={result.nodeId}
              type="button"
              className={`ws-storyboard-frame-result is-${result.status} nodrag nopan`}
              onClick={stopAnd(result.onOpen)}
              aria-label={`打开${result.title}详情`}
            >
              <StoryboardFrameResultPreview result={result} />
              <span className="ws-storyboard-frame-result-title">
                <strong>{result.title}</strong>
                <small>{result.statusLabel}</small>
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="ws-storyboard-frame-result-empty">
          <FileText size={18} />
          <span>当前分组暂无结果节点</span>
        </div>
      )}
    </section>
  );
}

function StoryboardFrameResultPreview({
  result,
}: {
  result: StoryboardFrameResultData;
}) {
  if (result.imageUrl) {
    return (
      <span className="ws-storyboard-frame-result-media">
        <img src={result.imageUrl} alt="" loading="lazy" decoding="async" />
      </span>
    );
  }
  if (result.videoUrl) {
    return (
      <span className="ws-storyboard-frame-result-media is-video">
        <video
          src={result.videoUrl}
          poster={result.videoPosterUrl || undefined}
          muted
          preload="metadata"
        />
        <Video size={16} aria-hidden="true" />
      </span>
    );
  }
  if (result.audioUrl) {
    return (
      <span className="ws-storyboard-frame-result-placeholder is-audio">
        <Music2 size={20} />
        <small>音频结果</small>
      </span>
    );
  }
  if (result.text) {
    return (
      <span className="ws-storyboard-frame-result-text">{result.text}</span>
    );
  }
  return (
    <span className="ws-storyboard-frame-result-placeholder">
      {result.status === "complete" ? (
        <CheckCircle2 size={20} />
      ) : result.status === "running" || result.status === "waiting" ? (
        <Loader2 size={20} className="ws-spin" />
      ) : (
        <ImageIcon size={20} />
      )}
      <small>{result.statusLabel}</small>
    </span>
  );
}

export function sameStoryboardFrameGroups(
  previous: StoryboardFrameGroupData[],
  next: StoryboardFrameGroupData[],
) {
  return (
    previous === next ||
    (previous.length === next.length &&
      previous.every((group, index) => {
        const candidate = next[index];
        return (
          group.id === candidate.id &&
          group.title === candidate.title &&
          group.memberCount === candidate.memberCount &&
          group.runnableCount === candidate.runnableCount &&
          group.completedCount === candidate.completedCount &&
          group.failedCount === candidate.failedCount &&
          group.staleCount === candidate.staleCount &&
          group.status === candidate.status &&
          group.runBlockedReason === candidate.runBlockedReason &&
          group.stopping === candidate.stopping &&
          group.onRun === candidate.onRun &&
          group.onStop === candidate.onStop &&
          sameStoryboardFrameResults(group.results, candidate.results)
        );
      }))
  );
}

function sameStoryboardFrameResults(
  previous: StoryboardFrameResultData[],
  next: StoryboardFrameResultData[],
) {
  return (
    previous === next ||
    (previous.length === next.length &&
      previous.every((result, index) => {
        const candidate = next[index];
        return (
          result.nodeId === candidate.nodeId &&
          result.title === candidate.title &&
          result.status === candidate.status &&
          result.statusLabel === candidate.statusLabel &&
          result.imageUrl === candidate.imageUrl &&
          result.videoUrl === candidate.videoUrl &&
          result.videoPosterUrl === candidate.videoPosterUrl &&
          result.audioUrl === candidate.audioUrl &&
          result.text === candidate.text &&
          result.onOpen === candidate.onOpen
        );
      }))
  );
}

function storyboardFrameGroupActive(group: StoryboardFrameGroupData) {
  return group.status === "running" || group.status === "waiting";
}

function storyboardFrameGroupRunLabel(group: StoryboardFrameGroupData) {
  if (
    group.runnableCount > 0 &&
    group.completedCount >= group.runnableCount &&
    group.staleCount === 0
  ) {
    return `重新执行${group.title}`;
  }
  return group.completedCount > 0
    ? `继续执行${group.title}`
    : `执行${group.title}`;
}

function storyboardFrameGroupStatus(group: StoryboardFrameGroupData) {
  if (group.stopping) return "停止中";
  if (group.status === "running") return "执行中";
  if (group.status === "waiting") return "等待反馈";
  if (group.status === "error") {
    return group.failedCount > 0 ? `失败 ${group.failedCount}` : "执行失败";
  }
  if (group.runBlockedReason) return "等待前置";
  if (group.staleCount > 0) return `${group.staleCount} 项待更新`;
  if (
    group.runnableCount > 0 &&
    group.completedCount >= group.runnableCount
  ) {
    return "已完成";
  }
  return group.completedCount > 0 ? "部分完成" : "待执行";
}

function stopAnd(action: () => void) {
  return (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    action();
  };
}
