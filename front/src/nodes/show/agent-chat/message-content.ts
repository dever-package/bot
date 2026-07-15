import type { ThreadMessageLike } from "@assistant-ui/react";
import type { AgentChatActivity } from "./activity";
import { artifactDisplayOutput } from "./artifact";
import { agentChatDisplayOutput } from "./message-output";
import type { ChatMessage } from "./types";

type MessageContent = Exclude<ThreadMessageLike["content"], string>;

export type AgentChatContentSegment =
  | { type: "text"; text: string }
  | { type: "activity"; activity: AgentChatActivity };

export function buildAgentChatAssistantContent(
  message: ChatMessage,
): MessageContent {
  const activities = message.activities || [];
  return buildAgentChatContentSegments(message.text, activities).map<
    MessageContent[number]
  >(
    (segment) =>
      segment.type === "text"
        ? { type: "text", text: segment.text }
        : {
            type: "tool-call",
            toolCallId: segment.activity.id,
            toolName: segment.activity.title,
            args: {},
            argsText: "{}",
            result: segment.activity.output,
            isError: segment.activity.status === "failed",
          },
  );
}

export function buildAgentChatContentSegments(
  sourceText: string,
  activities: AgentChatActivity[],
): AgentChatContentSegment[] {
  const text = withoutActivityMediaMarkdown(sourceText, activities);
  if (activities.length === 0) {
    return text ? [{ type: "text", text }] : [];
  }

  const content: AgentChatContentSegment[] = [];
  let cursor = 0;
  for (const activity of activities) {
    const anchor = withoutActivityMediaMarkdown(
      activity.anchorText,
      activities,
    );
    const anchorEnd = resolveAnchorEnd(text, anchor, cursor);
    appendTextSegment(content, text.slice(cursor, anchorEnd));
    content.push({ type: "activity", activity });
    cursor = anchorEnd;
  }
  appendTextSegment(content, text.slice(cursor));
  return content;
}

export function buildAgentChatPreviewContent(
  sourceText: string,
  activities: AgentChatActivity[],
) {
  const content: unknown[] = [];
  let hasActivityOutput = false;
  for (const segment of buildAgentChatContentSegments(sourceText, activities)) {
    if (segment.type === "text") {
      content.push(segment.text);
      continue;
    }
    const artifactOutput = artifactDisplayOutput(segment.activity.output);
    const output = agentChatDisplayOutput(
      Object.keys(artifactOutput).length > 0
        ? artifactOutput
        : segment.activity.output,
    );
    if (output.length === 0) {
      continue;
    }
    hasActivityOutput = true;
    content.push(...output);
  }
  return hasActivityOutput ? content : [];
}

function appendTextSegment(content: AgentChatContentSegment[], text: string) {
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
