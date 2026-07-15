import {
  ActionBarPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useAuiState,
} from "@assistant-ui/react";
import { ArrowDown, Bot, Check, Copy, Loader2 } from "lucide-react";
import type { ComponentType } from "react";
import { getCompatModule } from "@dever/front-plugin";
import { cn } from "@/lib/utils";
import { StreamingMarkdown } from "./markdown";
import { AgentChatActivityView } from "./activity-view";
import type { AgentChatActivity } from "./activity";
import { AgentChatMessageOutput } from "./message-output";
import { AgentChatDocumentView } from "./document-view";
import type { AgentChatDocument } from "./document";
import { MessageNavigator } from "./message-navigator";
import {
  findAgentChatInteractionResponse,
  readAgentChatInteraction,
  readAgentChatSuggestions,
} from "./interaction";
import {
  AgentChatInteractionView,
  AgentChatSuggestions,
} from "./interaction-view";
import { AGENT_CHAT_CHILD_LAYER_Z_INDEX } from "./layers";
import type { AgentChatController } from "./types";
import {
  interactionResponseInput,
  textReferenceInput,
  type ReferenceComposerProps,
  type ReferenceContent,
  type ReferencePreviewLoader,
} from "./reference";

const referenceComposerModule = getCompatModule(
  "@/components/reference-composer",
);
const ReferenceComposer =
  referenceComposerModule.ReferenceComposer as ComponentType<ReferenceComposerProps>;
const ReferenceContentView =
  referenceComposerModule.ReferenceContentView as ComponentType<{
    content?: ReferenceContent;
    fallback?: string;
    loadPreview?: ReferencePreviewLoader;
  }>;

const CHAT_COLUMN_CLASS = "agent-chat-column";

export function Thread({ controller }: { controller: AgentChatController }) {
  return (
    <ThreadPrimitive.Root className="relative flex min-h-0 flex-1 flex-col bg-background">
      <style>{threadStyles}</style>
      <ThreadPrimitive.ViewportProvider>
        <ThreadPrimitive.Viewport
          ref={controller.messageListRef}
          autoScroll
          turnAnchor="bottom"
          scrollToBottomOnInitialize
          scrollToBottomOnRunStart
          className="relative flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto"
          style={{ scrollbarGutter: "stable" }}
          onScroll={controller.handleMessageListScroll}
          onWheel={controller.handleMessageListWheel}
        >
          <div
            className={cn(
              CHAT_COLUMN_CLASS,
              "agent-chat-message-column flex min-h-full flex-col",
            )}
          >
            {controller.sessionLoading && controller.messages.length === 0 ? (
              <div className="agent-chat-empty-state text-muted-foreground">
                <Loader2 className="size-5 animate-spin" />
              </div>
            ) : controller.messages.length === 0 ? (
              <div className="agent-chat-empty-state">
                <span className="flex size-10 items-center justify-center rounded-md border bg-muted/30 text-muted-foreground">
                  <Bot className="size-5" />
                </span>
                <span className="text-sm text-muted-foreground">
                  开始一段新对话
                </span>
              </div>
            ) : (
              <div className="agent-chat-message-stack flex flex-col">
                <ThreadPrimitive.Messages>
                  {() => <Message controller={controller} />}
                </ThreadPrimitive.Messages>
              </div>
            )}
          </div>
        </ThreadPrimitive.Viewport>

        <MessageNavigator controller={controller} />

        <footer
          className="agent-chat-footer shrink-0"
          style={{
            paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom))",
          }}
        >
          <ThreadPrimitive.ScrollToBottom
            behavior="smooth"
            className="agent-chat-scroll-to-bottom"
            title="回到底部"
            aria-label="回到底部"
          >
            <ArrowDown />
          </ThreadPrimitive.ScrollToBottom>
          <div className={CHAT_COLUMN_CLASS}>
            {controller.error ? (
              <div className="mb-2 text-sm text-destructive">
                {controller.error}
              </div>
            ) : null}
            <Composer controller={controller} />
          </div>
        </footer>
      </ThreadPrimitive.ViewportProvider>
    </ThreadPrimitive.Root>
  );
}

function Message({ controller }: { controller: AgentChatController }) {
  const role = useAuiState((state) => state.message.role);
  return role === "user" ? (
    <UserMessage controller={controller} />
  ) : (
    <AssistantMessage controller={controller} />
  );
}

function UserMessage({ controller }: { controller: AgentChatController }) {
  const content = useAuiState(
    (state) => state.message.metadata.custom?.content,
  ) as ReferenceContent | undefined;
  const sourceText = useAuiState(
    (state) => state.message.metadata.custom?.sourceText,
  );
  return (
    <MessagePrimitive.Root className="agent-chat-message agent-chat-user-message relative flex justify-end pl-6 md:pl-20">
      <div className="max-w-[88%] whitespace-pre-wrap break-words rounded-lg bg-muted px-3.5 py-2.5 text-base leading-7 text-foreground [overflow-wrap:anywhere] md:max-w-full">
        <ReferenceContentView
          content={content}
          fallback={typeof sourceText === "string" ? sourceText : ""}
          loadPreview={controller.loadReferencePreview}
        />
      </div>
      <MessageActions role="user" />
    </MessagePrimitive.Root>
  );
}

function AssistantMessage({ controller }: { controller: AgentChatController }) {
  const status = useAuiState((state) => state.message.status);
  const output = useAuiState((state) => state.message.metadata.custom?.output);
  const activities = useAuiState(
    (state) => state.message.metadata.custom?.activities,
  ) as AgentChatActivity[] | undefined;
  const sourceText = useAuiState(
    (state) => state.message.metadata.custom?.sourceText,
  );
  const document = useAuiState(
    (state) => state.message.metadata.custom?.document,
  ) as AgentChatDocument | undefined;
  const visibleActivities = Array.isArray(activities) ? activities : [];
  const interaction = readAgentChatInteraction(output);
  const interactionResponse = interaction?.id
    ? findAgentChatInteractionResponse(controller.messages, interaction.id)
    : undefined;
  const suggestions = readAgentChatSuggestions(output);
  const error = status?.type === "incomplete" && status.reason === "error";
  const waitingForNextStep = isWaitingAfterKnowledge(
    status?.type === "running",
    visibleActivities,
    sourceText,
  );
  return (
    <MessagePrimitive.Root
      className={cn(
        "agent-chat-message relative min-w-0 [contain-intrinsic-size:auto_180px] [content-visibility:auto]",
        error && "text-destructive",
      )}
    >
      {document ? (
        <AgentChatDocumentView
          document={document}
          sourceText={typeof sourceText === "string" ? sourceText : ""}
          running={status?.type === "running"}
          error={error}
        />
      ) : (
        <>
          <MessagePrimitive.Parts>
            {({ part }) => {
              if (part.type === "text") {
                const running = part.status.type === "running";
                if (running && !part.text && visibleActivities.length === 0) {
                  return <WaitingIndicator />;
                }
                if (!part.text) {
                  return null;
                }
                return <StreamingMarkdown error={error} />;
              }
              if (part.type === "tool-call") {
                const activity = visibleActivities.find(
                  (current) => current.id === part.toolCallId,
                );
                return <AgentChatActivityView activity={activity} />;
              }
              return null;
            }}
          </MessagePrimitive.Parts>
          {waitingForNextStep ? <NextStepIndicator /> : null}
          <AgentChatMessageOutput
            output={output}
            excludeOutputs={visibleActivities.map((activity) => activity.output)}
            excludeText={typeof sourceText === "string" ? sourceText : ""}
          />
        </>
      )}
      {interaction ? (
        <AgentChatInteractionView
          interaction={interaction}
          response={interactionResponse}
          disabled={controller.sendDisabled}
          onSubmit={(result) => {
            void controller.send(
              interactionResponseInput(
                interaction.id || "",
                result.text,
                result.data,
              ),
            );
          }}
        />
      ) : null}
      <AgentChatSuggestions
        suggestions={suggestions}
        disabled={controller.sendDisabled}
        onSelect={(suggestion) => {
          void controller.send(textReferenceInput(suggestion.prompt));
        }}
      />
      <MessageActions role="assistant" />
    </MessagePrimitive.Root>
  );
}

function MessageActions({ role }: { role: "user" | "assistant" }) {
  return (
    <ActionBarPrimitive.Root
      className={cn(
        "agent-chat-message-actions",
        role === "user" ? "right-0 justify-end" : "left-0",
      )}
      data-message-role={role}
    >
      <ActionBarPrimitive.Copy
        copiedDuration={1800}
        className="agent-chat-message-action agent-chat-copy-action"
        title="复制"
        aria-label="复制消息"
      >
        <Copy className="agent-chat-copy-icon" aria-hidden="true" />
        <Check className="agent-chat-copied-icon" aria-hidden="true" />
      </ActionBarPrimitive.Copy>
    </ActionBarPrimitive.Root>
  );
}

function Composer({ controller }: { controller: AgentChatController }) {
  return (
    <ReferenceComposer
      placeholder="发消息"
      disabled={controller.sendDisabled && !controller.running}
      running={controller.running}
      stopping={controller.stopping}
      cancelable={controller.cancelable}
      layerZIndex={AGENT_CHAT_CHILD_LAYER_Z_INDEX}
      parameters={controller.inputParams}
      loadReferences={controller.loadReferences}
      loadPreview={controller.loadReferencePreview}
      onSubmit={controller.send}
      onCancel={controller.stop}
    />
  );
}

function WaitingIndicator() {
  return (
    <div
      role="status"
      aria-label="智能体正在生成"
      className="agent-chat-waiting-indicator"
    >
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="agent-chat-waiting-dot"
          style={{ animationDelay: `${index * 140}ms` }}
        />
      ))}
    </div>
  );
}

function NextStepIndicator() {
  return (
    <div
      role="status"
      aria-label="智能体正在执行下一步"
      className="agent-chat-next-step-indicator"
    >
      <span className="agent-chat-next-step-dot" />
    </div>
  );
}

function isWaitingAfterKnowledge(
  running: boolean,
  activities: AgentChatActivity[],
  sourceText: unknown,
) {
  if (!running) {
    return false;
  }
  const lastActivity = activities.at(-1);
  if (
    !lastActivity ||
    lastActivity.kind !== "knowledge" ||
    lastActivity.status === "running"
  ) {
    return false;
  }
  return (
    String(sourceText || "").trimEnd() === lastActivity.anchorText.trimEnd()
  );
}

const threadStyles = `
.agent-chat-column {
  box-sizing: border-box;
  width: 100%;
  max-width: 1040px;
  margin-inline: auto;
  padding-inline: 24px;
}

.agent-chat-message-column {
  padding-top: 24px;
}

.agent-chat-empty-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  text-align: center;
  pointer-events: none;
}

.agent-chat-message-stack {
  gap: 28px;
  padding-bottom: 88px;
}

.agent-chat-document {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.agent-chat-document .agent-chat-message-output,
.agent-chat-document .agent-chat-media-grid {
  margin-top: 0;
}

.agent-chat-interaction[data-presentation="stepper"] {
  width: min(52%, 560px);
  min-width: min(100%, 480px);
}

.agent-chat-media-grid {
  box-sizing: border-box;
  display: grid;
  width: 100%;
  max-width: 968px;
  gap: 8px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.agent-chat-media-placeholder {
  isolation: isolate;
  background-color: color-mix(in oklab, var(--muted) 34%, transparent);
  animation: agent-chat-media-surface 1.65s ease-in-out infinite;
}

.agent-chat-media-placeholder::before {
  position: absolute;
  inset: 0;
  z-index: 1;
  content: '';
  background: linear-gradient(
    105deg,
    transparent 20%,
    color-mix(in oklab, var(--foreground) 3.5%, transparent) 40%,
    color-mix(in oklab, var(--background) 90%, transparent) 50%,
    color-mix(in oklab, var(--foreground) 3.5%, transparent) 60%,
    transparent 80%
  );
  transform: translateX(-110%);
  animation: agent-chat-media-shimmer 1.65s ease-in-out infinite;
  pointer-events: none;
}

.agent-chat-media-placeholder-icon {
  z-index: 2;
  animation: agent-chat-media-icon 1.65s ease-in-out infinite;
}

.agent-chat-media-spinner {
  animation: agent-chat-media-spinner 0.95s linear infinite;
}

.agent-chat-media-result[data-kind="image"] .agent-chat-activity-output .grid {
  box-sizing: border-box;
  width: 100% !important;
  max-width: 968px !important;
  gap: 8px !important;
  grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
}

.agent-chat-media-result[data-kind="image"] .agent-chat-activity-output .grid > div {
  min-width: 0;
  overflow: visible !important;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
  padding: 0 !important;
}

.agent-chat-media-result[data-kind="image"] .agent-chat-activity-output .grid > div > button {
  width: 100% !important;
  aspect-ratio: var(--agent-chat-media-aspect-ratio, 4 / 3) !important;
  border-radius: 8px !important;
  background: transparent !important;
}

.agent-chat-media-result[data-kind="image"] .agent-chat-activity-output .grid > div > button > img {
  width: 100% !important;
  height: 100% !important;
  border-radius: 8px !important;
  object-fit: cover !important;
}

.agent-chat-user-message {
  scroll-margin-top: 24px;
}

.agent-chat-message-actions {
  position: absolute;
  top: 100%;
  z-index: 2;
  display: flex;
  height: 28px;
  align-items: center;
  gap: 2px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 120ms ease;
}

.agent-chat-message:hover .agent-chat-message-actions,
.agent-chat-message:focus-within .agent-chat-message-actions {
  opacity: 1;
  pointer-events: auto;
}

.agent-chat-message-action {
  display: inline-flex;
  width: 28px;
  height: 28px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  transition:
    color 120ms ease,
    background-color 120ms ease;
}

.agent-chat-message-action:hover:not(:disabled),
.agent-chat-message-action:focus-visible {
  background: var(--muted);
  color: var(--foreground);
  outline: none;
}

.agent-chat-message-action:disabled {
  opacity: 0.38;
  cursor: default;
}

.agent-chat-message-action svg {
  width: 16px;
  height: 16px;
  stroke-width: 1.8;
}

.agent-chat-copied-icon,
.agent-chat-copy-action[data-copied="true"] .agent-chat-copy-icon {
  display: none;
}

.agent-chat-copy-action[data-copied="true"] .agent-chat-copied-icon {
  display: block;
}

.agent-chat-footer {
  position: relative;
  z-index: 5;
  padding-top: 12px;
  background: linear-gradient(to bottom, transparent, var(--background) 24px);
}

.agent-chat-scroll-to-bottom {
  position: absolute;
  top: -50px;
  left: 50%;
  z-index: 6;
  display: flex !important;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--border);
  border-radius: 9999px;
  background: var(--background);
  color: var(--foreground);
  opacity: 1;
  box-shadow:
    0 8px 22px rgba(15, 23, 42, 0.12),
    0 2px 7px rgba(15, 23, 42, 0.08);
  cursor: pointer;
  transform: translateX(-50%);
  transition:
    opacity 140ms ease,
    transform 140ms ease,
    box-shadow 140ms ease;
}

.agent-chat-scroll-to-bottom:hover:not(:disabled) {
  box-shadow:
    0 10px 26px rgba(15, 23, 42, 0.16),
    0 3px 9px rgba(15, 23, 42, 0.1);
  transform: translateX(-50%) translateY(-1px);
}

.agent-chat-scroll-to-bottom:disabled {
  opacity: 0;
  pointer-events: none;
  transform: translateX(-50%) translateY(8px);
}

.agent-chat-scroll-to-bottom svg {
  width: 20px;
  height: 20px;
}

@keyframes agent-chat-waiting-dot {
  0%, 60%, 100% { opacity: 0.22; transform: translateY(0); }
  30% { opacity: 0.82; transform: translateY(-2px); }
}

@keyframes agent-chat-media-shimmer {
  0% { transform: translateX(-110%); }
  58%, 100% { transform: translateX(110%); }
}

@keyframes agent-chat-media-surface {
  0%, 100% {
    border-color: color-mix(in oklab, var(--border) 82%, transparent);
    background-color: color-mix(in oklab, var(--muted) 30%, transparent);
  }
  50% {
    border-color: color-mix(in oklab, var(--foreground) 14%, transparent);
    background-color: color-mix(in oklab, var(--muted) 50%, transparent);
  }
}

@keyframes agent-chat-media-icon {
  0%, 100% { opacity: 0.28; transform: scale(0.96); }
  50% { opacity: 0.58; transform: scale(1); }
}

@keyframes agent-chat-media-spinner {
  to { transform: rotate(360deg); }
}

@keyframes agent-chat-streaming-tail {
  0%, 100% { opacity: 0.24; transform: scale(0.78); }
  50% { opacity: 0.9; transform: scale(1); }
}

.agent-chat-waiting-indicator {
  display: flex;
  height: 18px;
  align-items: center;
  gap: 4px;
  color: var(--foreground);
}

.agent-chat-waiting-dot {
  display: block;
  width: 4px;
  height: 4px;
  flex: 0 0 4px;
  border-radius: 9999px;
  background-color: currentColor;
  animation: agent-chat-waiting-dot 1.05s ease-in-out infinite;
}

.agent-chat-next-step-indicator {
  display: flex;
  height: 18px;
  margin-top: 4px;
  align-items: center;
  color: var(--foreground);
}

.agent-chat-next-step-dot {
  display: block;
  width: 6px;
  height: 6px;
  flex: 0 0 6px;
  border-radius: 9999px;
  background-color: currentColor;
  animation: agent-chat-streaming-tail 0.9s ease-in-out infinite;
}

.agent-chat-markdown[data-status="running"] > :last-child:not(ul):not(ol)::after,
.agent-chat-markdown[data-status="running"] > :last-child:is(ul, ol) > li:last-child::after {
  content: '';
  display: inline-block;
  width: 6px;
  height: 6px;
  margin-left: 6px;
  border-radius: 9999px;
  vertical-align: 0.08em;
  pointer-events: none;
  background: currentColor;
  animation: agent-chat-streaming-tail 0.9s ease-in-out infinite;
}

[data-agent-chat-layer="true"][data-media-inspector-open="true"] .agent-chat-column {
  padding-inline: 20px;
}

[data-agent-chat-layer="true"][data-media-inspector-open="true"] .agent-chat-media-grid,
[data-agent-chat-layer="true"][data-media-inspector-open="true"]
  .agent-chat-media-result[data-kind="image"]
  .agent-chat-activity-output
  .grid {
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
}

[data-agent-chat-layer="true"][data-media-inspector-open="true"] .agent-chat-message-navigator {
  display: none;
}

@media (max-width: 767px) {
  .agent-chat-column {
    padding-inline: 14px;
  }

  .agent-chat-message-column {
    padding-top: 16px;
  }

  .agent-chat-message-stack {
    gap: 20px;
    padding-bottom: 56px;
  }

  .agent-chat-interaction[data-presentation="stepper"] {
    width: 100%;
    min-width: 0;
  }

  .agent-chat-media-grid {
    max-width: none;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .agent-chat-media-result[data-kind="image"] .agent-chat-activity-output .grid {
    max-width: none !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }

  .agent-chat-footer {
    padding-top: 8px;
  }

  .agent-chat-scroll-to-bottom {
    top: -44px;
    width: 36px;
    height: 36px;
  }

  .agent-chat-scroll-to-bottom svg {
    width: 18px;
    height: 18px;
  }

}

@media (hover: none) {
  .agent-chat-message-actions {
    opacity: 1;
    pointer-events: auto;
  }
}

`;
