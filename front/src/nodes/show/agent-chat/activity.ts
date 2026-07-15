import { isPlainRecord } from "@/lib/runtime-stream-output";
import { streamValueText as valueText } from "@/lib/stream";
import { normalizeAgentChatOutput, type AgentChatOutput } from "./output";
import { readAgentChatAspectRatio } from "./media";

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

const legacySkillActivityTitles: Record<string, string> = {
  load_skill: "技能加载",
  list_skill_files: "技能目录读取",
  read_skill_file: "技能文件读取",
  read_temp_file: "技能文件读取",
  write_temp_file: "技能文件准备",
  run_skill_script: "技能执行",
  http_request: "技能请求",
  curl_request: "技能请求",
  mcp_call: "技能工具调用",
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
  const toolParams = isPlainRecord(meta.tool_params) ? meta.tool_params : {};
  const toolName = valueText(meta.tool_name);
  const id = valueText(meta.tool_call_id || toolName);
  if (!id) {
    return undefined;
  }
  const kind = activityKind(meta.tool_kind, toolName);
  const status = activityStatus(event, meta.tool_status);
  return {
    id,
    title:
      valueText(meta.tool_title) ||
      compactActivityTitle(kind) ||
      toolName ||
      "工具调用",
    kind,
    status,
    text: activityText(output.text, kind, status, toolName),
    error: valueText(output.error),
    progress: activityProgress(output.progress ?? meta.progress ?? meta.percent),
    count: activityCount(meta.tool_count),
    aspectRatio: readAgentChatAspectRatio(Object.values(toolParams)),
    anchorText: valueText(output.anchor_text),
    output,
  };
}

function activityKind(value: unknown, toolName: string) {
  const kind = valueText(value).toLowerCase();
  if (kind) {
    return kind;
  }
  const normalizedName = toolName.toLowerCase();
  if (normalizedName.includes("knowledge")) {
    return "knowledge";
  }
  return isLegacySkillTool(normalizedName) ? "skill" : "";
}

function activityText(
  value: unknown,
  kind: string,
  status: AgentChatActivity["status"],
  toolName: string,
) {
  const text = valueText(value);
  if (!isLegacyGenericActivityText(text)) {
    return text;
  }
  if (kind === "knowledge") {
    return status === "succeeded"
      ? legacyKnowledgeActivityText(toolName)
      : "正在读取知识库";
  }
  if (kind === "skill") {
    return legacySkillActivityText(toolName, status);
  }
  return text;
}

function isLegacyGenericActivityText(text: string) {
  return text === "内容生成完成" || text === "内容生成中，请稍后";
}

function compactActivityTitle(kind: string) {
  if (kind === "knowledge") {
    return "知识库";
  }
  if (kind === "skill") {
    return "技能调用";
  }
  return "";
}

function isLegacySkillTool(name: string) {
  return name.startsWith("skill_") || Boolean(legacySkillActivityTitles[name]);
}

function legacySkillActivityText(
  toolName: string,
  status: AgentChatActivity["status"],
) {
  const suffix = status === "succeeded" ? "完成" : "中";
  const title = legacySkillActivityTitles[toolName.toLowerCase()] || "技能调用";
  return `${title}${suffix}`;
}

function legacyKnowledgeActivityText(toolName: string) {
  switch (toolName.toLowerCase()) {
    case "open_knowledge_init":
      return "已读取知识库说明";
    case "list_knowledge_files":
    case "list_knowledge_tree":
    case "expand_knowledge_node":
      return "已读取知识库结构";
    case "search_knowledge_files":
    case "search_knowledge_nodes":
    case "find_related_knowledge":
    case "debug_knowledge_retrieval":
      return "已完成知识库搜索";
    case "read_knowledge_file":
    case "open_knowledge_node":
      return "已读取知识库文件";
    default:
      return "已参考知识库";
  }
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
