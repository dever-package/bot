import {
  mergeAgentChatActivities,
  readAgentChatActivities,
  type AgentChatActivity,
} from "../../show/agent-chat/activity";
import {
  readAgentChatInteraction,
  readAgentChatSuggestions,
  type AgentChatSuggestion,
} from "../../show/agent-chat/interaction";
import {
  mergeAgentChatDocument,
  mergeAgentChatDocumentEvent,
  normalizeAgentChatDocument,
  type AgentChatDocument,
} from "../../show/agent-chat/document";
import {
  normalizeAgentChatOutput,
  type AgentChatOutput,
} from "../../show/agent-chat/output";
import { readAgentChatRunFrame } from "../../show/agent-chat/runtime";
import { plainMarkdownTextFromRichOutput } from "../shared/content-output";

export type CanvasAgentInteraction = NonNullable<
  ReturnType<typeof readAgentChatInteraction>
>;

export type CanvasAgentRuntimeState = {
  started: boolean;
  text: string;
  output: AgentChatOutput;
  activities: AgentChatActivity[];
  document?: AgentChatDocument;
  interaction?: CanvasAgentInteraction;
  suggestions: AgentChatSuggestion[];
  error: string;
};

export function reduceCanvasAgentRuntime(
  current: CanvasAgentRuntimeState | undefined,
  output: Record<string, unknown>,
): CanvasAgentRuntimeState {
  const previous = current || emptyCanvasAgentRuntime();
  const frame = readAgentChatRunFrame({
    type: "stream",
    output,
  });
  const event = frame.event;
  const activity = frame.activity;
  const text = nextRuntimeText(previous.text, frame.delta, output, event);
  const mergedOutput = shouldMergeRootOutput(event, activity)
    ? {
        ...previous.output,
        ...frame.output,
        ...(text ? { text } : {}),
      }
    : previous.output;
  const anchoredActivity =
    activity && !activity.anchorText
      ? { ...activity, anchorText: text }
      : activity;
  const activities = anchoredActivity
    ? mergeAgentChatActivities(previous.activities, anchoredActivity)
    : previous.activities;
  const document = mergeAgentChatDocument(
    mergeAgentChatDocumentEvent(previous.document, frame.output),
    normalizeAgentChatDocument(frame.output.document),
  );
  const interaction =
    readAgentChatInteraction(mergedOutput) || previous.interaction;
  const suggestions = readAgentChatSuggestions(mergedOutput);

  return {
    started: true,
    text,
    output: mergedOutput,
    activities,
    document,
    interaction,
    suggestions:
      suggestions.length > 0 ? suggestions : previous.suggestions,
    error: frame.error || previous.error,
  };
}

export function readCanvasAgentResult(
  output: unknown,
): CanvasAgentRuntimeState {
  const normalized = normalizeCanvasAgentResultOutput(output);
  return {
    started: Object.keys(normalized).length > 0,
    text: textValue(normalized.text),
    output: normalized,
    activities: readAgentChatActivities(normalized),
    document: normalizeAgentChatDocument(normalized.document),
    interaction: readAgentChatInteraction(normalized),
    suggestions: readAgentChatSuggestions(normalized),
    error: textValue(normalized.error),
  };
}

function normalizeCanvasAgentResultOutput(output: unknown) {
  const normalized = normalizeAgentChatOutput(output);
  if (textValue(normalized.text)) {
    return normalized;
  }
  const markdownText = plainMarkdownTextFromRichOutput(output);
  if (!markdownText) {
    return normalized;
  }
  const result = { ...normalized, text: markdownText };
  delete result.rich;
  return result;
}

export function hasCanvasAgentRuntimeContent(
  state: CanvasAgentRuntimeState | undefined,
) {
  return Boolean(
    state &&
      (state.started ||
        state.text ||
        state.activities.length > 0 ||
        state.document ||
        state.interaction ||
        state.suggestions.length > 0 ||
        Object.keys(state.output).length > 0),
  );
}

export function emptyCanvasAgentRuntime(): CanvasAgentRuntimeState {
  return {
    started: false,
    text: "",
    output: {},
    activities: [],
    suggestions: [],
    error: "",
  };
}

function nextRuntimeText(
  current: string,
  delta: string,
  output: Record<string, unknown>,
  event: string,
) {
  if (delta) {
    return `${current}${delta}`;
  }
  if (event === "final") {
    return textValue(output.text) || current;
  }
  return current;
}

function shouldMergeRootOutput(
  event: string,
  activity: AgentChatActivity | undefined,
) {
  if (activity || event === "start" || event === "delta") {
    return false;
  }
  return true;
}

function textValue(value: unknown) {
  return value == null ? "" : String(value);
}
