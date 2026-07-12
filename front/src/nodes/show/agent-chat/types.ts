import type { RefObject, WheelEvent } from "react";
import type { AgentChatMessageRecord, AgentChatSession } from "./api";
import {
  readAgentChatActivities,
  type AgentChatActivity,
} from "./activity";
import type { AgentChatOutput } from "./output";
import type {
  ReferenceContent,
  ReferenceInput,
  ReferenceLoadRequest,
  ReferenceLoadResult,
} from "./reference";

export type ChatMessage = {
  id: string;
  recordID?: number;
  role: "user" | "assistant";
  text: string;
  content?: ReferenceContent;
  output?: AgentChatOutput;
  activities?: AgentChatActivity[];
  requestID?: string;
  running?: boolean;
  error?: boolean;
};

export type ChatStreamOutput = AgentChatOutput & {
  event?: string;
  text?: string;
  error?: string;
  meta?: Record<string, unknown>;
};

export type AgentChatRuntimeApis = {
  request: string;
  stream: string;
  stop: string;
  status: string;
};

export type AgentChatStoreOptions = {
  agentKey: string;
  modalOpen: boolean;
  blockMs: number;
  assistantApi: import("./api").AgentChatApi;
  runtimeApi: AgentChatRuntimeApis;
};

export type AgentChatController = {
  sessionID: number;
  sessionTitle: string;
  sessions: AgentChatSession[];
  messages: ChatMessage[];
  sessionsLoading: boolean;
  sessionsLoadingMore: boolean;
  sessionLoading: boolean;
  running: boolean;
  stopping: boolean;
  cancelable: boolean;
  sendDisabled: boolean;
  error: string;
  sessionListRef: RefObject<HTMLDivElement | null>;
  messageListRef: RefObject<HTMLDivElement | null>;
  openSession: (sessionID: number) => Promise<void>;
  startNewSession: () => Promise<void>;
  renameSession: (sessionID: number, title: string) => Promise<void>;
  deleteSession: (sessionID: number) => Promise<void>;
  loadMoreSessions: () => Promise<void>;
  loadOlderMessages: () => Promise<void>;
  handleSessionListScroll: () => void;
  handleMessageListScroll: () => void;
  handleMessageListWheel: (event: WheelEvent<HTMLDivElement>) => void;
  loadReferences: (
    request: ReferenceLoadRequest,
  ) => Promise<ReferenceLoadResult>;
  send: (input: ReferenceInput) => Promise<void>;
  stop: () => Promise<void>;
};

export function mapChatMessages(
  records: AgentChatMessageRecord[],
): ChatMessage[] {
  return records.map((message, index) => ({
    id: message.id ? `saved-${message.id}` : `saved-${index}`,
    recordID: message.id || undefined,
    role: message.role,
    text: message.text,
    content: message.content,
    output: message.output,
    activities: readAgentChatActivities(message.output),
    requestID: message.requestID || undefined,
    running: message.status === 3,
    error: message.status === 2,
  }));
}
