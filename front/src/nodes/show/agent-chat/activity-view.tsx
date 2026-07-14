import {
  AudioLines,
  BookOpen,
  CheckCircle2,
  CircleAlert,
  FileText,
  ImageIcon,
  Loader2,
  Video,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { AgentChatActivity } from "./activity";
import {
  AgentChatMessageOutput,
  hasAgentChatMessageOutput,
} from "./message-output";
import { artifactDisplayOutput, readAgentChatArtifacts } from "./artifact";

const mediaKinds = new Set(["image", "video", "audio", "file"]);
const compactActivityKinds = new Set(["knowledge", "skill"]);

export function AgentChatActivityView({
  activity,
}: {
  activity?: AgentChatActivity;
}) {
  if (!activity) {
    return null;
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
          output={
            Object.keys(displayOutput).length > 0
              ? displayOutput
              : activity.output
          }
          className="agent-chat-activity-output"
        />
      </div>
    );
  }
  return <ActivityPlaceholder activity={activity} artifactCount={artifacts.length} />;
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
  const Icon = activityStatusIcon(activity.status);
  const failed = activity.status === "failed";
  const message = activity.error || activity.text || activity.title;
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2 text-sm text-muted-foreground",
        failed && "text-destructive",
      )}
    >
      <Icon
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

function activityStatusIcon(status: AgentChatActivity["status"]): LucideIcon {
  if (status === "succeeded") {
    return CheckCircle2;
  }
  if (status === "failed") {
    return CircleAlert;
  }
  return Loader2;
}
