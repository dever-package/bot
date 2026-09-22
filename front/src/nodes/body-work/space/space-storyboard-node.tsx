import type { ReactNode } from "react";
import {
  Check,
  CheckCircle2,
  CircleAlert,
  Clapperboard,
  Maximize2,
} from "lucide-react";
import {
  isStoryboardConfirmed,
  parseStoryboardOutput,
  storyboardSpeechCount,
  storyboardTotalDuration,
} from "./space-storyboard";
import type { ComposerAssetItem } from "./types";
import { StoryboardCompactShotCard } from "./space-storyboard-shot-card";
import "./space-storyboard-node.css";

export type StoryboardNodeStatus = "empty" | "running" | "complete" | "error";

type StoryboardNodeContentProps = {
  output?: unknown;
  status: StoryboardNodeStatus;
  generatedShotCount?: number;
  targetShotCount?: number;
  referenceItems?: ComposerAssetItem[];
  onOpenDetail?: () => void;
  onConfirm?: () => void;
};

export function StoryboardNodeContent({
  output,
  status,
  generatedShotCount = 0,
  targetShotCount = 0,
  onOpenDetail,
  onConfirm,
}: StoryboardNodeContentProps) {
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
        </span>
      </header>
      <div className="ws-storyboard-node-body nowheel">
        <div className="ws-storyboard-node-cards">
          {storyboard.shots.slice(0, 4).map((shot, index) => (
            <StoryboardCompactShotCard
              key={shot.id}
              shot={shot}
              index={index}
              storyboard={storyboard}
              onOpen={onOpenDetail}
            />
          ))}
        </div>
        {storyboard.shots.length > 4 ? (
          <span className="ws-storyboard-node-more">
            还有 {storyboard.shots.length - 4} 个镜头
          </span>
        ) : null}
      </div>
      {onOpenDetail || (!confirmed && onConfirm) ? (
        <footer className="ws-storyboard-node-actions">
          {onOpenDetail ? (
            <StoryboardDetailButton onOpenDetail={onOpenDetail} />
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
        </footer>
      ) : null}
    </section>
  );
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
