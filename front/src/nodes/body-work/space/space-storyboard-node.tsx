import { useState, type ReactNode } from "react";
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
  storyboardSpeechCount,
  storyboardTotalDuration,
  type StoryboardEditorFocus,
} from "./space-storyboard";
import type { ComposerAssetItem } from "./types";
import type { StoryboardWorkspaceData } from "./space-node-runtime";
import { StoryboardCompactShotCard } from "./space-storyboard-shot-card";
import {
  STORYBOARD_SCRIPT_SECTION_ID,
  StoryboardWorkspace,
} from "./space-storyboard-workspace";
import "./space-storyboard-node.css";

export type StoryboardNodeStatus = "empty" | "running" | "complete" | "error";

type StoryboardNodeContentProps = {
  output?: unknown;
  status: StoryboardNodeStatus;
  generatedShotCount?: number;
  targetShotCount?: number;
  referenceItems?: ComposerAssetItem[];
  workspace?: StoryboardWorkspaceData;
  onOpenDetail?: (sectionId?: string, focus?: StoryboardEditorFocus) => void;
  onConfirm?: () => void;
};

export function StoryboardNodeContent({
  output,
  status,
  generatedShotCount = 0,
  targetShotCount = 0,
  workspace,
  onOpenDetail,
  onConfirm,
}: StoryboardNodeContentProps) {
  const [activeSectionId, setActiveSectionId] = useState(
    STORYBOARD_SCRIPT_SECTION_ID,
  );

  if (status === "running") {
    return (
      <div className="ws-storyboard-node-state is-running" aria-live="polite">
        <div className="ws-storyboard-node-skeleton" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <strong>
          {storyboardProgressLabel(generatedShotCount, targetShotCount)}
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

  const storyboard = parseStoryboardOutput(output);
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

  const confirmed = isStoryboardConfirmed(storyboard);

  return (
    <section className="ws-storyboard-node is-complete">
      <header className="ws-storyboard-node-summary">
        <div className="ws-storyboard-node-summary-copy">
          <div>
            <strong>{storyboard.title || "分镜脚本"}</strong>
            <span className="ws-storyboard-node-complete">
              <CheckCircle2 size={14} />
              {confirmed ? "已确认" : "草稿"}
            </span>
          </div>
          <span>
            {storyboard.shots.length} 个镜头 ·{" "}
            {storyboardTotalDuration(storyboard)} 秒
            {storyboardSpeechCount(storyboard) > 0
              ? ` · ${storyboardSpeechCount(storyboard)} 条语音`
              : ""}
            {workspace?.running
              ? ` · ${workspace.executionStatus}${
                  workspace.currentNodeTitle
                    ? ` · ${workspace.currentNodeTitle}`
                    : ""
                }`
              : ""}
          </span>
        </div>
        <div className="ws-storyboard-node-summary-actions">
          {workspace ? <StoryboardWorkspaceRunAction data={workspace} /> : null}
          {onOpenDetail ? (
            <StoryboardDetailButton
              onOpenDetail={() => onOpenDetail(activeSectionId)}
            />
          ) : null}
          {!confirmed && onConfirm ? (
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
      <StoryboardWorkspace
        activeSectionId={activeSectionId}
        groups={workspace?.groups || []}
        scriptMeta={`${storyboard.shots.length} 个镜头`}
        scriptContent={
          <div className="ws-storyboard-node-body nowheel">
            <div className="ws-storyboard-node-cards">
              {storyboard.shots.map((shot, index) => (
                <StoryboardCompactShotCard
                  key={shot.id}
                  shot={shot}
                  index={index}
                  storyboard={storyboard}
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
  generatedShotCount: number,
  targetShotCount: number,
) {
  if (generatedShotCount > 0 && targetShotCount > 0) {
    return `正在生成第 ${generatedShotCount} / ${targetShotCount} 个分镜`;
  }
  if (generatedShotCount > 0) {
    return `正在生成第 ${generatedShotCount} 个分镜`;
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
