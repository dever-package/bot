import {
  MessagePrimitive,
  ThreadPrimitive,
  useAuiState,
} from "@assistant-ui/react";
import { ArrowDown, Bot, Loader2 } from "lucide-react";
import type { ComponentType } from "react";
import { getCompatModule } from "@dever/front-plugin";
import { cn } from "@/lib/utils";
import { StreamingMarkdown } from "./markdown";
import { AgentChatActivityView } from "./activity-view";
import type { AgentChatActivity } from "./activity";
import { AgentChatMessageOutput } from "./message-output";
import { MessageNavigator } from "./message-navigator";
import type { AgentChatController } from "./types";
import type {
  ReferenceComposerProps,
  ReferenceContent,
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
                  {() => <Message />}
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

function Message() {
  const role = useAuiState((state) => state.message.role);
  return role === "user" ? <UserMessage /> : <AssistantMessage />;
}

function UserMessage() {
  const content = useAuiState(
    (state) => state.message.metadata.custom?.content,
  ) as ReferenceContent | undefined;
  const sourceText = useAuiState(
    (state) => state.message.metadata.custom?.sourceText,
  );
  return (
    <MessagePrimitive.Root className="agent-chat-user-message flex justify-end pl-6 md:pl-20">
      <div className="max-w-[88%] whitespace-pre-wrap break-words rounded-lg bg-muted px-3.5 py-2.5 text-base leading-7 text-foreground [overflow-wrap:anywhere] md:max-w-full">
        <ReferenceContentView
          content={content}
          fallback={typeof sourceText === "string" ? sourceText : ""}
        />
      </div>
    </MessagePrimitive.Root>
  );
}

function AssistantMessage() {
  const status = useAuiState((state) => state.message.status);
  const output = useAuiState(
    (state) => state.message.metadata.custom?.output,
  );
  const activities = useAuiState(
    (state) => state.message.metadata.custom?.activities,
  ) as AgentChatActivity[] | undefined;
  const sourceText = useAuiState(
    (state) => state.message.metadata.custom?.sourceText,
  );
  const visibleActivities = Array.isArray(activities) ? activities : [];
  const error = status?.type === "incomplete" && status.reason === "error";
  return (
    <MessagePrimitive.Root
      className={cn(
        "relative min-w-0 [contain-intrinsic-size:auto_180px] [content-visibility:auto]",
        error && "text-destructive",
      )}
    >
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
      <AgentChatMessageOutput
        output={output}
        excludeOutputs={visibleActivities.map((activity) => activity.output)}
        excludeText={typeof sourceText === "string" ? sourceText : ""}
      />
    </MessagePrimitive.Root>
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
      loadReferences={controller.loadReferences}
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

`;
