import type { AgentInteraction } from "@/components/agent/interaction-panel";
import { isPlainRecord } from "@/lib/runtime-stream-output";
import type { ChatMessage } from "./types";

export type AgentChatSuggestion = {
  label: string;
  prompt: string;
};

export type AgentChatInteractionResponse = {
  data: Record<string, unknown>;
};

export function readAgentChatInteraction(
  output: unknown,
): AgentInteraction | undefined {
  if (!isPlainRecord(output) || !isPlainRecord(output.interaction)) {
    return undefined;
  }
  const interaction = output.interaction;
  const id = textValue(interaction.id);
  const fields = Array.isArray(interaction.fields)
    ? interaction.fields
    : [];
  if (!id || fields.length === 0) {
    return undefined;
  }
  return {
    ...interaction,
    id,
    type: textValue(interaction.type) || "form",
    title: textValue(interaction.title) || "需要补充信息",
    description: textValue(interaction.description),
    fields,
  } as AgentInteraction;
}

export function readAgentChatSuggestions(
  output: unknown,
): AgentChatSuggestion[] {
  if (!isPlainRecord(output) || !Array.isArray(output.suggestions)) {
    return [];
  }
  const seen = new Set<string>();
  const suggestions: AgentChatSuggestion[] = [];
  for (const item of output.suggestions) {
    if (!isPlainRecord(item)) {
      continue;
    }
    const label = textValue(item.label);
    const prompt = textValue(item.prompt);
    if (!label || !prompt || seen.has(prompt)) {
      continue;
    }
    seen.add(prompt);
    suggestions.push({ label, prompt });
    if (suggestions.length === 3) {
      break;
    }
  }
  return suggestions;
}

export function findAgentChatInteractionResponse(
  messages: ChatMessage[],
  interactionID: string,
): AgentChatInteractionResponse | undefined {
  for (const message of messages) {
    if (message.role !== "user") {
      continue;
    }
    const response = message.content?.interaction_response;
    if (response?.interaction_id === interactionID) {
      return { data: response.data };
    }
  }
  return undefined;
}

function textValue(value: unknown) {
  return value == null ? "" : String(value).trim();
}
