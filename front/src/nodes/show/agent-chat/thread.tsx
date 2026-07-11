import {
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useAuiState,
} from "@assistant-ui/react";
import { ArrowDown, ArrowUp, Bot, Loader2, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { StreamingMarkdown } from "./markdown";
import { MessageNavigator } from "./message-navigator";
import type { AgentChatController } from "./types";

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
  return (
    <MessagePrimitive.Root className="agent-chat-user-message flex justify-end pl-6 md:pl-20">
      <div className="max-w-[88%] whitespace-pre-wrap break-words rounded-lg bg-muted px-3.5 py-2.5 text-base leading-7 text-foreground [overflow-wrap:anywhere] md:max-w-full">
        <MessagePrimitive.Parts>
          {({ part }) => (part.type === "text" ? part.text : null)}
        </MessagePrimitive.Parts>
      </div>
    </MessagePrimitive.Root>
  );
}

function AssistantMessage() {
  const status = useAuiState((state) => state.message.status);
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
            if (running && !part.text) {
              return <WaitingIndicator />;
            }
            return <StreamingMarkdown running={running} error={error} />;
          }
          if (part.type === "tool-call") {
            return (
              <div className="my-2 rounded-md border bg-muted/25 px-3 py-2 text-xs text-muted-foreground">
                {part.toolName}
              </div>
            );
          }
          return null;
        }}
      </MessagePrimitive.Parts>
    </MessagePrimitive.Root>
  );
}

function Composer({ controller }: { controller: AgentChatController }) {
  return (
    <ComposerPrimitive.Root className="agent-chat-composer">
      <ComposerPrimitive.Input
        rows={1}
        submitMode="enter"
        placeholder="发消息"
        className="agent-chat-composer-input"
      />
      {controller.running ? (
        <ComposerPrimitive.Cancel
          type="button"
          title={controller.cancelable ? "停止生成" : "当前任务暂不可停止"}
          disabled={!controller.cancelable || controller.stopping}
          className="agent-chat-composer-action"
        >
          {controller.stopping ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Square className="size-3.5 fill-current" />
          )}
          <span className="sr-only">停止生成</span>
        </ComposerPrimitive.Cancel>
      ) : (
        <ComposerPrimitive.Send
          type="button"
          title="发送"
          className="agent-chat-composer-action"
        >
          <ArrowUp className="size-4" />
          <span className="sr-only">发送</span>
        </ComposerPrimitive.Send>
      )}
    </ComposerPrimitive.Root>
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

.agent-chat-composer {
  position: relative;
  min-height: 104px;
  overflow: visible;
  border: 1px solid var(--border);
  border-radius: 26px;
  background: var(--background);
  box-shadow:
    0 18px 48px rgba(15, 23, 42, 0.12),
    0 3px 12px rgba(15, 23, 42, 0.06);
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.agent-chat-composer:focus-within {
  border-color: color-mix(in oklab, var(--foreground) 24%, var(--border));
  box-shadow:
    0 20px 54px rgba(15, 23, 42, 0.15),
    0 4px 14px rgba(15, 23, 42, 0.08);
}

.agent-chat-composer-input {
  box-sizing: border-box;
  display: block;
  width: 100%;
  min-height: 104px;
  max-height: 208px;
  resize: none;
  border: 0;
  border-radius: 26px;
  outline: none;
  background: transparent;
  padding: 18px 68px 18px 20px;
  color: var(--foreground);
  font: inherit;
  font-size: 15px;
  line-height: 24px;
}

.agent-chat-composer-input::placeholder {
  color: var(--muted-foreground);
}

.agent-chat-composer-action {
  position: absolute;
  right: 14px;
  bottom: 14px;
  z-index: 2;
  display: flex !important;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 9999px;
  background: #18181b !important;
  color: #fff !important;
  opacity: 1 !important;
  box-shadow: 0 3px 10px rgba(15, 23, 42, 0.2);
  cursor: pointer;
  transition: background 150ms ease, transform 150ms ease, box-shadow 150ms ease;
}

.agent-chat-composer-action:hover:not(:disabled) {
  background: #27272a !important;
  box-shadow: 0 5px 14px rgba(15, 23, 42, 0.24);
  transform: translateY(-1px);
}

.agent-chat-composer-action:disabled {
  border: 1px solid #d4d4d8;
  background: #e4e4e7 !important;
  color: #52525b !important;
  box-shadow: none;
  cursor: not-allowed;
}

.agent-chat-composer-action svg {
  width: 16px;
  height: 16px;
}

@keyframes agent-chat-waiting-dot {
  0%, 60%, 100% { opacity: 0.22; transform: translateY(0); }
  30% { opacity: 0.82; transform: translateY(-2px); }
}

.agent-chat-waiting-indicator {
  display: flex;
  height: 18px;
  align-items: center;
  gap: 4px;
  color: hsl(var(--foreground));
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

.agent-chat-streaming-markdown > :last-child::after,
.agent-chat-streaming-markdown > :last-child > li:last-child::after {
  content: '';
  display: inline-block;
  width: 2.6em;
  height: 1.3em;
  margin-left: -2.6em;
  vertical-align: -0.3em;
  pointer-events: none;
  background: linear-gradient(
    90deg,
    transparent 0%,
    hsl(var(--background) / 0.34) 48%,
    hsl(var(--background) / 0.9) 88%,
    hsl(var(--background)) 100%
  );
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

  .agent-chat-composer,
  .agent-chat-composer-input {
    min-height: 88px;
    border-radius: 22px;
  }

  .agent-chat-composer-input {
    max-height: 176px;
    padding: 14px 60px 14px 16px;
    font-size: 16px;
  }

  .agent-chat-composer-action {
    right: 11px;
    bottom: 11px;
    width: 36px;
    height: 36px;
  }
}
`;
