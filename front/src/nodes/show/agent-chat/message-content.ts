import type { ThreadMessageLike } from "@assistant-ui/react";
import type { AgentChatActivity } from "./activity";
import type { ChatMessage } from "./types";

type MessageContent = Exclude<ThreadMessageLike["content"], string>;

export function buildAgentChatAssistantContent(
  message: ChatMessage,
): MessageContent {
  const activities = message.activities || [];
  const text = withoutActivityMediaMarkdown(message.text, activities);
  if (activities.length === 0) {
    return text ? [{ type: "text", text }] : [];
  }

  const content: Array<MessageContent[number]> = [];
  let cursor = 0;
  for (const activity of activities) {
    const anchor = withoutActivityMediaMarkdown(
      activity.anchorText,
      activities,
    );
    const anchorEnd = resolveAnchorEnd(text, anchor, cursor);
    appendTextPart(content, text.slice(cursor, anchorEnd));
    content.push({
      type: "tool-call",
      toolCallId: activity.id,
      toolName: activity.title,
      args: {},
      argsText: "{}",
      result: activity.output,
      isError: activity.status === "failed",
    });
    cursor = anchorEnd;
  }
  appendTextPart(content, text.slice(cursor));
  return content;
}

function appendTextPart(content: Array<MessageContent[number]>, text: string) {
  if (text) {
    content.push({ type: "text", text });
  }
}

function resolveAnchorEnd(text: string, anchor: string, cursor: number) {
  if (!anchor) {
    return cursor;
  }
  if (text.startsWith(anchor)) {
    return Math.max(cursor, anchor.length);
  }
  const position = text.indexOf(anchor, cursor);
  return position < 0 ? cursor : position + anchor.length;
}

function withoutActivityMediaMarkdown(
  source: string,
  activities: AgentChatActivity[],
) {
  let text = String(source || "").replace(/\r\n/g, "\n");
  for (const url of activityMediaURLs(activities)) {
    const escapedURL = escapeRegExp(url);
    text = text
      .replace(
        new RegExp(
          `!\\[[^\\]]*\\]\\(\\s*<?${escapedURL}>?(?:\\s+["'][^"']*["'])?\\s*\\)`,
          "g",
        ),
        "",
      )
      .replace(
        new RegExp(
          `\\[[^\\]]*\\]\\(\\s*<?${escapedURL}>?(?:\\s+["'][^"']*["'])?\\s*\\)`,
          "g",
        ),
        "",
      );
  }
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

function activityMediaURLs(activities: AgentChatActivity[]) {
  const urls = new Set<string>();
  for (const activity of activities) {
    for (const key of ["images", "videos", "audios", "files"] as const) {
      const value = activity.output[key];
      for (const item of Array.isArray(value) ? value : [value]) {
        if (typeof item === "string" && item.trim()) {
          urls.add(item.trim());
        }
      }
    }
  }
  return urls;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
