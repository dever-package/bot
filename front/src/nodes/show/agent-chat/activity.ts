import { isPlainRecord } from "@/lib/runtime-stream-output";
import { streamValueText as valueText } from "@/lib/stream";
import { normalizeAgentChatOutput, type AgentChatOutput } from "./output";

export type AgentChatActivity = {
  id: string;
  title: string;
  kind: string;
  status: "running" | "succeeded" | "failed";
  text: string;
  error: string;
  progress: number | null;
  count: number;
  aspectRatio: string;
  anchorText: string;
  output: AgentChatOutput;
};

export function readAgentChatActivity(
  value: unknown,
): AgentChatActivity | undefined {
  const output = normalizeAgentChatOutput(value);
  const event = valueText(output.event).toLowerCase();
  if (!isToolActivityEvent(event)) {
    return undefined;
  }
  const meta = isPlainRecord(output.meta) ? output.meta : {};
  const id = valueText(meta.tool_call_id || meta.tool_name);
  if (!id) {
    return undefined;
  }
  return {
    id,
    title: valueText(meta.tool_title || meta.tool_name) || "工具调用",
    kind: valueText(meta.tool_kind).toLowerCase(),
    status: activityStatus(event, meta.tool_status),
    text: valueText(output.text),
    error: valueText(output.error),
    progress: activityProgress(output.progress ?? meta.progress ?? meta.percent),
    count: activityCount(meta.tool_count),
    aspectRatio: activityAspectRatio(meta.tool_ratio),
    anchorText: valueText(output.anchor_text),
    output,
  };
}

export function readAgentChatActivities(value: unknown): AgentChatActivity[] {
  const output = normalizeAgentChatOutput(value);
  if (!Array.isArray(output.activities)) {
    return [];
  }
  return output.activities
    .map(readAgentChatActivity)
    .filter((activity): activity is AgentChatActivity => Boolean(activity));
}

export function mergeAgentChatActivities(
  current: AgentChatActivity[] | undefined,
  incoming: AgentChatActivity,
): AgentChatActivity[] {
  const activities = current ? [...current] : [];
  const index = activities.findIndex((activity) => activity.id === incoming.id);
  if (index < 0) {
    return [...activities, incoming];
  }
  activities[index] = mergeAgentChatActivity(activities[index], incoming);
  return activities;
}

export function mergeAgentChatActivityLists(
  current: AgentChatActivity[] | undefined,
  incoming: AgentChatActivity[],
) {
  return incoming.reduce(mergeAgentChatActivities, current || []);
}

function mergeAgentChatActivity(
  current: AgentChatActivity,
  incoming: AgentChatActivity,
): AgentChatActivity {
  return {
    ...current,
    ...incoming,
    text: incoming.text || current.text,
    error: incoming.error || current.error,
    count: incoming.count || current.count,
    aspectRatio: incoming.aspectRatio || current.aspectRatio,
    anchorText: incoming.anchorText || current.anchorText,
    progress: mergeProgress(current.progress, incoming.progress),
    output: {
      ...current.output,
      ...incoming.output,
      meta: mergeOutputMeta(current.output.meta, incoming.output.meta),
    },
  };
}

function isToolActivityEvent(event: string) {
  return ["tool_start", "tool_progress", "tool_result", "tool_error"].includes(
    event,
  );
}

function activityStatus(event: string, value: unknown) {
  const status = valueText(value).toLowerCase();
  if (event === "tool_error" || status === "failed") {
    return "failed" as const;
  }
  if (event === "tool_result" || status === "succeeded") {
    return "succeeded" as const;
  }
  return "running" as const;
}

function activityProgress(value: unknown) {
  if (value == null || value === "") {
    return null;
  }
  const progress = Number(value);
  if (!Number.isFinite(progress)) {
    return null;
  }
  return Math.max(0, Math.min(100, Math.round(progress)));
}

function activityCount(value: unknown) {
  const count = Number(value);
  if (!Number.isFinite(count) || count < 1) {
    return 1;
  }
  return Math.min(8, Math.floor(count));
}

function activityAspectRatio(value: unknown) {
  const text = valueText(value);
  const match = text.match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/);
  if (!match || Number(match[1]) <= 0 || Number(match[2]) <= 0) {
    return "";
  }
  return `${match[1]} / ${match[2]}`;
}

function mergeProgress(current: number | null, incoming: number | null) {
  if (current == null) {
    return incoming;
  }
  if (incoming == null) {
    return current;
  }
  return Math.max(current, incoming);
}

function mergeOutputMeta(current: unknown, incoming: unknown) {
  return {
    ...(isPlainRecord(current) ? current : {}),
    ...(isPlainRecord(incoming) ? incoming : {}),
  };
}
