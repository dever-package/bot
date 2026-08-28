import {
  AudioLines,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileText,
  ImageIcon,
  ListChecks,
  Loader2,
  ShieldCheck,
  Video,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { isPlainRecord } from "@/lib/runtime-stream-output";
import { streamValueText as valueText } from "@/lib/stream";
import type { AgentChatActivity } from "../../shared/agent-output/activity";
import {
  AgentChatMessageOutput,
  hasAgentChatMessageOutput,
} from "./message-output";
import { artifactDisplayOutput, readAgentChatArtifacts } from "../../shared/agent-output/artifact";

const mediaKinds = new Set(["image", "video", "audio", "file"]);
const compactActivityKinds = new Set(["knowledge", "skill"]);
const activityStatusIcons: Record<AgentChatActivity["status"], LucideIcon> = {
  running: Loader2,
  succeeded: CheckCircle2,
  failed: CircleAlert,
};

export function AgentChatActivityView({
  activity,
}: {
  activity?: AgentChatActivity;
}) {
  if (!activity) {
    return null;
  }
  const task = isPlainRecord(activity.output.task)
    ? activity.output.task
    : null;
  if (task) {
    return <AgentChatTaskCard task={task} />;
  }
  const operation = isPlainRecord(activity.output.operation)
    ? activity.output.operation
    : null;
  if (operation) {
    return <AgentChatOperationCard operation={operation} />;
  }
  const artifacts = readAgentChatArtifacts(activity.output);
  const displayOutput = artifactDisplayOutput(activity.output);
  const hasOutput =
    Object.keys(displayOutput).length > 0 ||
    hasAgentChatMessageOutput(activity.output);
  if (hasOutput) {
    const aspectRatio =
      activity.aspectRatio || (activity.kind === "video" ? "16 / 9" : "4 / 3");
    return (
      <div
        className="agent-chat-media-result"
        data-kind={activity.kind}
        style={
          {
            "--agent-chat-media-aspect-ratio": aspectRatio,
          } as CSSProperties
        }
      >
        <AgentChatMessageOutput
          output={activity.output}
          className="agent-chat-activity-output"
        />
      </div>
    );
  }
  return <ActivityPlaceholder activity={activity} artifactCount={artifacts.length} />;
}

function AgentChatOperationCard({
  operation,
}: {
  operation: Record<string, unknown>;
}) {
  const title =
    valueText(operation.title) || operationKindTitle(valueText(operation.kind));
  const goal = valueText(operation.goal);
  const summary = isPlainRecord(operation.summary) ? operation.summary : null;
  const changes = summary
    ? [
        ["新增节点", summary.added_nodes],
        ["更新节点", summary.updated_nodes],
        ["删除节点", summary.removed_nodes],
        ["新增连线", summary.added_edges],
        ["更新连线", summary.updated_edges],
        ["删除连线", summary.removed_edges],
      ].filter(([, count]) => Number(count || 0) > 0)
    : [];
  return (
    <div className="mt-4 max-w-2xl rounded-lg border bg-muted/15 px-4 py-3.5">
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-foreground/5 text-foreground">
          <ShieldCheck className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-foreground">{title}</div>
          {goal ? (
            <p className="mt-1 break-words text-xs leading-5 text-muted-foreground">
              {goal}
            </p>
          ) : null}
          {changes.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              {changes.map(([label, count]) => (
                <span key={String(label)}>
                  {String(label)} {Number(count)}
                </span>
              ))}
            </div>
          ) : null}
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">操作预览</span>
      </div>
    </div>
  );
}

function AgentChatTaskCard({ task }: { task: Record<string, unknown> }) {
  const status = valueText(task.status).toLowerCase() || "running";
  const running = status === "running" || status === "pending";
  const failed = status === "fail" || status === "failed" || status === "error";
  const canceled = status === "canceled" || status === "cancelled";
  const Icon = running
    ? Loader2
    : failed
      ? CircleAlert
      : canceled
        ? Clock3
        : CheckCircle2;
  const runID = Number(task.run_id || 0);
  const requestID = valueText(task.request_id);
  return (
    <div
      className={cn(
        "mt-4 max-w-2xl rounded-lg border bg-muted/15 px-4 py-3.5",
        failed && "border-destructive/30 bg-destructive/5",
      )}
    >
      <div className="flex min-w-0 items-start gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-foreground/5 text-foreground">
          <ListChecks className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-foreground">
            {valueText(task.title) || "项目任务"}
          </div>
          {runID || requestID ? (
            <div className="mt-1 truncate text-xs text-muted-foreground">
              {runID ? `运行 #${runID}` : requestID}
            </div>
          ) : null}
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 text-xs text-muted-foreground",
            failed && "text-destructive",
          )}
        >
          <Icon className={cn("size-3.5", running && "animate-spin")} />
          {taskStatusLabel(status)}
        </span>
      </div>
    </div>
  );
}

function operationKindTitle(kind: string) {
  switch (kind) {
    case "canvas_patch":
      return "修改画布";
    case "canvas_run":
      return "运行画布";
    case "team_flow":
      return "启动团队流程";
    case "run_stop":
      return "停止项目任务";
    default:
      return "确认操作";
  }
}

function taskStatusLabel(status: string) {
  if (status === "success" || status === "succeeded") return "已完成";
  if (status === "fail" || status === "failed" || status === "error")
    return "失败";
  if (status === "canceled" || status === "cancelled") return "已取消";
  if (status === "waiting") return "等待中";
  return "运行中";
}

function ActivityPlaceholder({
  activity,
  artifactCount,
}: {
  activity: AgentChatActivity;
  artifactCount: number;
}) {
  const Icon = activityIcon(activity.kind);
  const media = mediaKinds.has(activity.kind);
  const failed = activity.status === "failed";
  if (compactActivityKinds.has(activity.kind)) {
    return (
      <div className="mt-2 max-w-2xl py-1 text-muted-foreground">
        <ActivityLabel activity={activity} />
      </div>
    );
  }
  if (failed || !media) {
    return (
      <div
        className={cn(
          "mt-4 max-w-2xl rounded-lg border bg-muted/20 px-3.5 py-3",
          failed && "border-destructive/30 bg-destructive/5",
        )}
      >
        <ActivityLabel activity={activity} />
      </div>
    );
  }
  const count = Math.min(8, Math.max(1, artifactCount || activity.count));
  const visualMedia = activity.kind === "image" || activity.kind === "video";
  const aspectRatio =
    activity.aspectRatio || (activity.kind === "video" ? "16 / 9" : "4 / 3");
  return (
    <div
      role="status"
      aria-label={activity.text || activity.title}
      className="agent-chat-media-grid mt-4"
      data-count={count}
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={`${activity.id}-${index}`}
          className={cn(
            "agent-chat-media-placeholder relative flex overflow-hidden rounded-lg border bg-muted/30",
            activity.kind === "audio" || activity.kind === "file"
              ? "h-24 items-center justify-start px-5"
              : "items-center justify-center",
          )}
          style={visualMedia ? { aspectRatio } : undefined}
        >
          <Icon className="agent-chat-media-placeholder-icon relative size-7 text-muted-foreground/35" />
          <Loader2 className="agent-chat-media-spinner absolute right-3 top-3 z-[2] size-4 text-muted-foreground/55" />
          {activity.progress != null ? (
            <span
              className="absolute bottom-0 left-0 z-[2] h-1 bg-foreground/15 transition-[width] duration-300"
              style={{ width: `${activity.progress}%` }}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ActivityLabel({ activity }: { activity: AgentChatActivity }) {
  const StatusIcon = activityStatusIcons[activity.status];
  const failed = activity.status === "failed";
  const message = activity.error || activity.text || activity.title;
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2 text-sm text-muted-foreground",
        failed && "text-destructive",
      )}
    >
      <StatusIcon
        className={cn(
          "size-4 shrink-0",
          activity.status === "running" && "animate-spin",
        )}
      />
      <span className="min-w-0 flex-1 truncate">{message}</span>
      {activity.progress != null && activity.status === "running" ? (
        <span className="shrink-0 tabular-nums">{activity.progress}%</span>
      ) : null}
    </div>
  );
}

function activityIcon(kind: string): LucideIcon {
  switch (kind) {
    case "image":
      return ImageIcon;
    case "video":
      return Video;
    case "audio":
      return AudioLines;
    case "file":
      return FileText;
    case "knowledge":
      return BookOpen;
    default:
      return Wrench;
  }
}
