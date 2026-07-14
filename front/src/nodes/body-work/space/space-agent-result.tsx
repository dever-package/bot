import { useEffect, useMemo, useRef, useState } from "react";
import type { AgentInteractionSubmitResult } from "@/components/agent/interaction-panel";
import { AgentChatActivityView } from "../../show/agent-chat/activity-view";
import {
  AgentChatInteractionView,
  AgentChatSuggestions,
} from "../../show/agent-chat/interaction-view";
import type {
  AgentChatInteractionResponse,
  AgentChatSuggestion,
} from "../../show/agent-chat/interaction";
import { AgentChatMessageOutput } from "../../show/agent-chat/message-output";
import { buildAgentChatContentSegments } from "../../show/agent-chat/message-content";
import {
  interactionResponseInput,
  textReferenceInput,
  type ReferenceInput,
} from "../../show/agent-chat/reference";
import { CanvasNodeContentView } from "./space-content-view";
import {
  readCanvasAgentResult,
  type CanvasAgentRuntimeState,
} from "./space-agent-runtime";

export function CanvasAgentResultContent({
  output,
  runtime,
  fallback,
  running,
  onContinue,
}: {
  output: unknown;
  runtime?: CanvasAgentRuntimeState;
  fallback: string;
  running?: boolean;
  onContinue?: (input: ReferenceInput) => void | Promise<void>;
}) {
  const persisted = useMemo(() => readCanvasAgentResult(output), [output]);
  const runtimeHasPayload = Boolean(
    runtime &&
      (runtime.text ||
        runtime.activities.length > 0 ||
        runtime.interaction ||
        runtime.suggestions.length > 0 ||
        Object.keys(runtime.output).length > 0),
  );
  const active = runtimeHasPayload && runtime ? runtime : persisted;
  const text = active.text || (!running || persisted.started ? fallback : "");
  const contentSegments = useMemo(
    () => buildAgentChatContentSegments(text, active.activities),
    [active.activities, text],
  );
  const submittingRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);
  const [interactionResponse, setInteractionResponse] =
    useState<AgentChatInteractionResponse>();
  const interactionID = active.interaction?.id || "";

  useEffect(() => {
    submittingRef.current = false;
    setSubmitting(false);
    setInteractionResponse(undefined);
  }, [interactionID]);

  const disabled = Boolean(running || submitting || !onContinue);
  const continueWith = async (input: ReferenceInput) => {
    if (!onContinue || disabled || submittingRef.current) {
      return;
    }
    submittingRef.current = true;
    setSubmitting(true);
    try {
      await onContinue(input);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  };
  const submitInteraction = (result: AgentInteractionSubmitResult) => {
    if (!active.interaction) {
      return;
    }
    setInteractionResponse({ data: result.data });
    void continueWith(
      interactionResponseInput(
        active.interaction.id || "",
        result.text,
        result.data,
      ),
    );
  };
  const selectSuggestion = (suggestion: AgentChatSuggestion) => {
    void continueWith(textReferenceInput(suggestion.prompt));
  };

  return (
    <div className="ws-canvas-agent-result">
      {contentSegments.map((segment, index) =>
        segment.type === "text" ? (
          <CanvasNodeContentView
            key={`text-${index}`}
            output={{ text: segment.text }}
            fallback={segment.text}
            streaming={Boolean(
              running &&
                runtime?.started &&
                index === contentSegments.length - 1,
            )}
            className="ws-canvas-content-view ws-canvas-agent-text"
          />
        ) : (
          <AgentChatActivityView
            key={`activity-${segment.activity.id}`}
            activity={segment.activity}
          />
        ),
      )}

      {contentSegments.length === 0 && running ? (
        <div
          className="ws-canvas-agent-waiting"
          role="status"
          aria-label="智能体正在生成"
        >
          <span />
          <span />
          <span />
        </div>
      ) : null}

      <AgentChatMessageOutput
        output={active.output}
        excludeOutputs={active.activities.map((activity) => activity.output)}
        excludeText={text}
      />

      {active.interaction ? (
        <AgentChatInteractionView
          interaction={active.interaction}
          response={interactionResponse}
          disabled={disabled}
          onSubmit={submitInteraction}
        />
      ) : null}

      <AgentChatSuggestions
        suggestions={active.suggestions}
        disabled={disabled}
        onSelect={selectSuggestion}
      />
    </div>
  );
}
