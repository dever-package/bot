import type { CSSProperties } from "react";
import type { AssistantFieldContext } from "@/lib/assistant/context";
import type { RoleTypeOption } from "./types";

export const NODE_TYPES = [
  { id: "agent", value: "智能体" },
  { id: "role", value: "团队角色" },
  { id: "power", value: "能力" },
  { id: "team", value: "团队工作流" },
  { id: "context", value: "上下文" },
  { id: "condition", value: "条件" },
  { id: "merge", value: "合并" },
  { id: "human_approval", value: "人工确认" },
  { id: "save", value: "保存" },
];
export const VISIBLE_NODE_TYPE_IDS = new Set(NODE_TYPES.map((item) => item.id));

export const ROLE_TYPES: RoleTypeOption[] = [
  { id: "chat", value: "沟通" },
  { id: "planner", value: "规划" },
  { id: "worker", value: "执行" },
  { id: "reviewer", value: "审核" },
];

export const EDGE_CONDITIONS = [
  { id: "always", value: "总是" },
  { id: "completed", value: "完成" },
  { id: "passed", value: "通过" },
  { id: "failed", value: "不通过" },
  { id: "approved", value: "确认" },
  { id: "rejected", value: "驳回" },
];

export const CONDITION_OPERATORS = [
  { id: "exists", value: "有内容" },
  { id: "contains", value: "包含" },
  { id: "equals", value: "等于" },
  { id: "truthy", value: "为真" },
  { id: "falsy", value: "为假" },
];

export const CARD_WIDTH = 64;
export const CARD_HEIGHT = 64;
export const GRAPH_ACTION_BUTTON_STYLE = {
  width: 24,
  height: 24,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
  lineHeight: 0,
} satisfies CSSProperties;
export const GRAPH_ACTION_ICON_STYLE = {
  display: "block",
  flex: "0 0 auto",
} satisfies CSSProperties;
export const TEAM_PUBLISH_DRAFT = "draft";
export const TEAM_PUBLISH_PUBLISHED = "published";
export const TEAM_PUBLISH_EDITING = "editing";
export const RUN_STATUS_RUNNING = "running";
export const RUN_STATUS_WAITING = "waiting";
export const RUN_STATUS_SUCCESS = "success";
export const RUN_STATUS_FAIL = "fail";
export const RUN_STATUS_CANCELED = "canceled";
export const RUN_STATUS_PENDING = "pending";
export const DEBUG_STREAM_BLOCK_MS = 15000;
export const DEBUG_CLIENT_STARTED_AT = "_client_started_at";
export const DEBUG_STREAM_LAST_ID = "_stream_last_id";
export const THINK_ASSISTANT_FIELDS: AssistantFieldContext[] = [
  {
    path: "form.name",
    name: "名称",
    type: "form-input",
  },
  {
    path: "form.goal",
    name: "目标",
    type: "form-textarea",
  },
];
