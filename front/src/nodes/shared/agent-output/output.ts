import { isPlainRecord } from "@/lib/runtime-stream-output";

export type AgentChatOutput = Record<string, unknown>;

export function normalizeAgentChatOutput(value: unknown): AgentChatOutput {
  return isPlainRecord(value) ? { ...value } : {};
}

export function hasAgentChatOutput(value: unknown) {
  return isPlainRecord(value) && Object.keys(value).length > 0;
}

export function hasAgentChatDisplayOutput(value: unknown) {
  if (!isPlainRecord(value)) {
    return false;
  }
  return [
    "interaction",
    "document",
    "artifacts",
    "images",
    "videos",
    "audios",
    "files",
    "rich",
    "content",
    "activities",
  ].some((key) => hasDisplayValue(value[key]));
}

function hasDisplayValue(value: unknown): boolean {
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  return isPlainRecord(value) && Object.keys(value).length > 0;
}
