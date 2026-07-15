import { isPlainRecord } from "@/lib/runtime-stream-output";

export function readAgentChatAspectRatio(...values: unknown[]) {
  for (const value of values) {
    const ratio = findAspectRatio(value);
    if (ratio) {
      return ratio;
    }
  }
  return "";
}

function findAspectRatio(value: unknown): string {
  if (typeof value === "string" || typeof value === "number") {
    const match = String(value)
      .trim()
      .match(/^(\d+(?:\.\d+)?)\s*[:/]\s*(\d+(?:\.\d+)?)$/);
    if (match && Number(match[1]) > 0 && Number(match[2]) > 0) {
      return `${match[1]} / ${match[2]}`;
    }
    return "";
  }
  if (Array.isArray(value)) {
    return readAgentChatAspectRatio(...value);
  }
  if (isPlainRecord(value)) {
    return readAgentChatAspectRatio(...Object.values(value));
  }
  return "";
}
