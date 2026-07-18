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
import { AgentChatTooltip } from "./tooltip";

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
      {!response ? (
        <div
          role="status"
          aria-live="polite"
          className="mb-3 flex items-center gap-2 text-sm text-muted-foreground"
        >
          <span className="agent-chat-pulse-dot" />
          <span>等待补充信息</span>
        </div>
      ) : null}
      <AgentInteractionPanel
        interaction={interaction}
        disabled={disabled}
        readonly={Boolean(response)}
        allowCustomChoice={false}
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
        <AgentChatTooltip key={suggestion.prompt} label={suggestion.prompt}>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "group inline-flex min-h-9 max-w-full items-center gap-1.5 rounded-lg border bg-background px-3 py-2 text-left text-sm leading-5 text-foreground shadow-sm transition-colors",
              "hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-50",
            )}
            onClick={() => onSelect(suggestion)}
          >
            <span className="truncate">{suggestion.label}</span>
            <ArrowRight className="size-3.5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </button>
        </AgentChatTooltip>
      ))}
    </div>
  );
}
