import { ArrowRight } from "lucide-react";
import {
  AgentInteractionPanel,
  type AgentInteraction,
  type AgentInteractionSubmitResult,
} from "@/components/agent/interaction-panel";
import { cn } from "@/lib/utils";
import type {
  AgentChatInteractionResponse,
  AgentChatSuggestion,
} from "./interaction";

export function AgentChatInteractionView({
  interaction,
  response,
  disabled,
  onSubmit,
}: {
  interaction: AgentInteraction;
  response?: AgentChatInteractionResponse;
  disabled?: boolean;
  onSubmit: (result: AgentInteractionSubmitResult) => void;
}) {
  return (
    <div
      data-presentation={interaction.presentation || "form"}
      className={cn(
        "agent-chat-interaction mt-5",
        interaction.presentation === "stepper" ? "w-full" : "max-w-2xl",
      )}
    >
      <AgentInteractionPanel
        interaction={interaction}
        disabled={disabled}
        readonly={Boolean(response)}
        initialData={response?.data}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export function AgentChatSuggestions({
  suggestions,
  disabled,
  onSelect,
}: {
  suggestions: AgentChatSuggestion[];
  disabled?: boolean;
  onSelect: (suggestion: AgentChatSuggestion) => void;
}) {
  if (suggestions.length === 0) {
    return null;
  }
  return (
    <div className="agent-chat-suggestions mt-5 flex flex-wrap gap-2">
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.prompt}
          type="button"
          disabled={disabled}
          title={suggestion.prompt}
          className={cn(
            "group inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-lg border bg-background px-3 py-2 text-left text-sm leading-5 text-foreground shadow-sm transition-colors",
            "hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-50",
          )}
          onClick={() => onSelect(suggestion)}
        >
          <span className="truncate">{suggestion.label}</span>
          <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </button>
      ))}
    </div>
  );
}
