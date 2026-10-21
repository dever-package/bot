import { useMemo, useState, type ReactNode } from "react";
import {
  Check,
  CheckCircle2,
  CircleAlert,
  Clapperboard,
  Loader2,
  Maximize2,
  Play,
  Square,
} from "lucide-react";
import {
  isStoryboardConfirmed,
  parseStoryboardOutput,
  type StoryboardEditorFocus,
} from "./space-storyboard";
import type { ComposerAssetItem } from "./types";
import type { StoryboardWorkspaceData } from "./space-node-runtime";
import { StoryboardCompactShotCard } from "./space-storyboard-shot-card";
import {
  STORYBOARD_SCRIPT_SECTION_ID,
  StoryboardWorkspace,
} from "./space-storyboard-workspace";
import { storyboardStreamPreview } from "./space-storyboard-preview";
import { storyboardFrames } from "./space-storyboard-media";
import "./space-storyboard-node.css";

export type StoryboardNodeStatus = "empty" | "running" | "complete" | "error";

type StoryboardNodeContentProps = {
  output?: unknown;
  status: StoryboardNodeStatus;
  completedShotCount?: number;
  targetShotCount?: number;
  referenceItems?: ComposerAssetItem[];
  workspace?: StoryboardWorkspaceData;
  onOpenDetail?: (sectionId?: string, focus?: StoryboardEditorFocus) => void;
  onConfirm?: () => void;
};

export function StoryboardNodeContent({
  output,
  status,
  completedShotCount = 0,
  targetShotCount = 0,
  workspace,
  onOpenDetail,
  onConfirm,
}: StoryboardNodeContentProps) {
  const [activeSectionId, setActiveSectionId] = useState(
    STORYBOARD_SCRIPT_SECTION_ID,
  );

  const completedStoryboard = useMemo(
    () => (status !== "running" ? parseStoryboardOutput(output) : null),
    [output, status],
  );
  const storyboard = useMemo(
    () =>
      status === "running"
        ? storyboardStreamPreview(output)
        : completedStoryboard,
    [output, status, completedStoryboard],
  );
  const framesByShotId = useMemo(() => {
    if (!completedStoryboard || !workspace) return new Map();
    const nodes = workspace.groups.flatMap((group) =>
      group.results.map((result) => result.node.sourceNode),
    );
    return new Map(
      storyboardFrames(completedStoryboard, workspace.sourceNodeId, nodes).map(
        (frame) => [frame.shot.id, frame],
      ),
    );
  }, [completedStoryboard, workspace]);

  if (status === "running" && !storyboard?.shots.length) {
    return (
      <div className="ws-storyboard-node-state is-running" aria-live="polite">
        <Loader2 size={22} className="ws-spin" />
        <strong>
          {storyboardProgressLabel(
            storyboard?.shots.length || completedShotCount,
            targetShotCount,
          )}
        </strong>
      </div>
    );
  }

  if (status === "error") {
    return (
      <StoryboardNodeMessage
        icon={<CircleAlert size={28} />}
        title="分镜生成失败"
        description="请检查输入后重新生成"
        tone="error"
      />
    );
  }

  if (status === "empty") {
    return (
      <StoryboardNodeMessage
        icon={<Clapperboard size={28} />}
        title="分镜等待生成"
        description="运行后展示镜头卡片，详情中可以编辑"
      />
    );
  }

  if (!storyboard) {
    return (
      <StoryboardNodeMessage
        icon={<CircleAlert size={28} />}
        title="分镜格式异常"
        description="打开详情查看原始结果或重新生成"
        tone="error"
        onOpenDetail={onOpenDetail}
      />
    );
  }

  const confirmed = completedStoryboard
    ? isStoryboardConfirmed(completedStoryboard)
    : false;
  const speechCount = storyboard.shots.reduce(
    (count, shot) =>
      count + shot.speech.filter((entry) => entry.text.trim()).length,
    0,
  );

  return (
    <section className={`ws-storyboard-node is-${status}`}>
      <header className="ws-storyboard-node-summary">
        <div className="ws-storyboard-node-summary-copy">
          <div>
            <strong>{storyboard.title || "分镜脚本"}</strong>
            <span
              className={`ws-storyboard-node-complete${confirmed ? "" : " is-draft"}`}
            >
              {status === "running" ? (
                <Loader2 size={14} className="ws-spin" />
              ) : (
                <CheckCircle2 size={14} />
              )}
              {status === "running"
                ? "正在生成"
                : confirmed
                  ? "已确认"
                  : "草稿"}
            </span>
          </div>
          <span>
            {storyboard.shots.length} 个镜头 ·{" "}
            {storyboard.shots.reduce((total, shot) => total + shot.duration, 0)}{" "}
            秒{speechCount > 0 ? ` · ${speechCount} 条语音` : ""}
          </span>
        </div>
        <div className="ws-storyboard-node-summary-actions">
          {workspace && status !== "running" ? (
            <StoryboardWorkspaceRunAction data={workspace} />
          ) : null}
          {onOpenDetail ? (
            <StoryboardDetailButton
              onOpenDetail={() => onOpenDetail(activeSectionId)}
            />
          ) : null}
          {status !== "running" && !confirmed && onConfirm ? (
            <button
              type="button"
              className="ws-storyboard-detail-button is-primary nodrag nopan"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onConfirm();
              }}
            >
              <Check size={13} />
              <span>确认脚本</span>
            </button>
          ) : null}
        </div>
      </header>
      {status === "running" ? (
        <div className="ws-storyboard-node-production-status" role="status">
          <Loader2 size={13} className="ws-spin" />
          <span>
            {storyboardProgressLabel(
              storyboard?.shots.length || completedShotCount,
              targetShotCount,
            )}
          </span>
        </div>
      ) : null}
      {workspace?.running ? (
        <div className="ws-storyboard-node-production-status" role="status">
          <Loader2 size={13} className="ws-spin" />
          <span>
            {workspace.executionStatus}
            {workspace.currentNodeTitle
              ? ` · ${workspace.currentNodeTitle}`
              : ""}
          </span>
          <strong>
            {workspace.completedCount}/{workspace.workNodeCount} 已完成
          </strong>
        </div>
      ) : null}
      <StoryboardWorkspace
        activeSectionId={activeSectionId}
        groups={workspace?.groups || []}
        scriptMeta={`${storyboard.shots.length} 个镜头`}
        scriptContent={
          <div className="ws-storyboard-node-body nowheel">
            <div className="ws-storyboard-node-cards">
              {storyboard.shots.map((shot) => (
                <StoryboardCompactShotCard
                  key={shot.id}
                  shot={shot}
                  index={shot.order - 1}
                  storyboard={storyboard}
                  frame={framesByShotId.get(shot.id)}
                  onOpen={
                    onOpenDetail
                      ? () =>
                          onOpenDetail(STORYBOARD_SCRIPT_SECTION_ID, {
                            section: "shots",
                            shotId: shot.id,
                          })
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        }
        renderNode={workspace?.renderNode || renderEmptyWorkspaceNode}
        onActiveSectionChange={setActiveSectionId}
      />
    </section>
  );
}

function StoryboardWorkspaceRunAction({
  data,
}: {
  data: StoryboardWorkspaceData;
}) {
  if (data.running) {
    return (
      <button
        type="button"
        className="ws-storyboard-workspace-run is-stop nodrag nopan"
        aria-label="停止制作区执行"
        title="停止制作区执行"
        disabled={data.stopping || !data.onStop}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          data.onStop?.();
        }}
      >
        {data.stopping ? (
          <Loader2 size={13} className="ws-spin" />
        ) : (
          <Square size={12} fill="currentColor" />
        )}
        <span>{data.stopping ? "停止中" : "停止"}</span>
      </button>
    );
  }
  const completed =
    data.workNodeCount > 0 && data.completedCount >= data.workNodeCount;
  return (
    <button
      type="button"
      className="ws-storyboard-workspace-run nodrag nopan"
      aria-label={data.runBlockedReason || "执行制作区"}
      disabled={Boolean(data.runBlockedReason)}
      title={data.runBlockedReason || undefined}
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        data.onRun();
      }}
    >
      <Play size={13} fill="currentColor" />
      <span>{completed ? "重新制作" : "开始制作"}</span>
    </button>
  );
}

function renderEmptyWorkspaceNode() {
  return null;
}

function storyboardProgressLabel(
  completedShotCount: number,
  targetShotCount: number,
) {
  if (targetShotCount > 0 && completedShotCount >= targetShotCount) {
    return `已完成 ${completedShotCount} / ${targetShotCount} 个镜头，正在整理脚本`;
  }
  if (completedShotCount > 0 && targetShotCount > 0) {
    return `已完成 ${completedShotCount} / ${targetShotCount} 个镜头，正在继续`;
  }
  if (completedShotCount > 0) {
    return `已完成 ${completedShotCount} 个镜头，正在继续`;
  }
  if (targetShotCount > 0) {
    return `分镜规划完成，共 ${targetShotCount} 个分镜`;
  }
  return "正在规划分镜";
}

function StoryboardNodeMessage({
  icon,
  title,
  description,
  tone = "default",
  onOpenDetail,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  tone?: "default" | "error";
  onOpenDetail?: () => void;
}) {
  return (
    <div
      className={`ws-storyboard-node-state is-${tone}`}
      role={tone === "error" ? "alert" : undefined}
    >
      <span className="ws-storyboard-node-state-icon">{icon}</span>
      <strong>{title}</strong>
      <span>{description}</span>
      {onOpenDetail ? (
        <StoryboardDetailButton label="打开详情" onOpenDetail={onOpenDetail} />
      ) : null}
    </div>
  );
}

function StoryboardDetailButton({
  label = "打开完整分镜",
  onOpenDetail,
}: {
  label?: string;
  onOpenDetail: () => void;
}) {
  return (
    <button
      type="button"
      className="ws-storyboard-detail-button nodrag nopan"
      onMouseDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onOpenDetail();
      }}
    >
      <Maximize2 size={13} />
      <span>{label}</span>
    </button>
  );
}
