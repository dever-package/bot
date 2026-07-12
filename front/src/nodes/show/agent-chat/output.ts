import { isPlainRecord } from "@/lib/runtime-stream-output";

export type AgentChatOutput = Record<string, unknown>;

export function normalizeAgentChatOutput(value: unknown): AgentChatOutput {
  return isPlainRecord(value) ? { ...value } : {};
}

export function hasAgentChatOutput(value: unknown) {
  return isPlainRecord(value) && Object.keys(value).length > 0;
}
