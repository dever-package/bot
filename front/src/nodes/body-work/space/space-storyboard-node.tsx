import type { ReactNode } from "react";
import {
  CheckCircle2,
  CircleAlert,
  Clapperboard,
  Maximize2,
} from "lucide-react";
import {
  parseStoryboardOutput,
  storyboardTotalDuration,
} from "./space-storyboard";
import { StoryboardView } from "./space-storyboard-view";
import type { ComposerAssetItem } from "./space-prompt-composer";

export type StoryboardNodeStatus = "empty" | "running" | "complete" | "error";

type StoryboardNodeContentProps = {
  output?: unknown;
  status: StoryboardNodeStatus;
  started?: boolean;
  generatedShotCount?: number;
  referenceItems?: ComposerAssetItem[];
  onOpenDetail?: () => void;
};

export function StoryboardNodeContent({
  output,
  status,
  started = false,
  generatedShotCount = 0,
  referenceItems,
  onOpenDetail,
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
          {!started
            ? "分镜等待生成"
            : generatedShotCount > 0
              ? `分镜正在生成，已生成 ${generatedShotCount} 个分镜`
              : "分镜正在生成"}
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
        description="运行后展示镜头表格，详情中可以编辑"
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

  return (
    <section className="ws-storyboard-node is-complete">
      <header className="ws-storyboard-node-summary">
        <span className="ws-storyboard-node-complete">
          <CheckCircle2 size={14} />
          分镜已生成
        </span>
        <span>
          {storyboard.shots.length} 个镜头 ·{" "}
          {storyboardTotalDuration(storyboard)} 秒
        </span>
      </header>
      <div className="ws-storyboard-node-body nowheel">
        <StoryboardView
          storyboard={storyboard}
          showMetrics={false}
          referenceItems={referenceItems}
        />
      </div>
      {onOpenDetail ? (
        <footer className="ws-storyboard-node-actions">
          <StoryboardDetailButton onOpenDetail={onOpenDetail} />
        </footer>
      ) : null}
    </section>
  );
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
