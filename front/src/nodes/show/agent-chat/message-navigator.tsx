import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { AgentChatController, ChatMessage } from "./types";

const NAVIGATOR_WINDOW_SIZE = 10;

export function MessageNavigator({
  controller,
}: {
  controller: AgentChatController;
}) {
  const userMessages = useMemo(
    () => controller.messages.filter(isUserMessage),
    [controller.messages],
  );
  const messageIDsKey = JSON.stringify(
    userMessages.map((message) => message.id),
  );
  const [activeMessageID, setActiveMessageID] = useState("");
  const [windowStart, setWindowStart] = useState(0);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const viewport = controller.messageListRef.current;
    const userMessageIDs = JSON.parse(messageIDsKey) as string[];
    if (!viewport || userMessageIDs.length === 0) {
      setActiveMessageID("");
      return;
    }

    let animationFrame = 0;
    const updateActiveMessage = () => {
      animationFrame = 0;
      const nextID = resolveActiveMessageID(viewport, userMessageIDs);
      setActiveMessageID((currentID) =>
        currentID === nextID ? currentID : nextID,
      );
    };
    const scheduleUpdate = () => {
      if (animationFrame) {
        return;
      }
      animationFrame = window.requestAnimationFrame(updateActiveMessage);
    };

    viewport.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    scheduleUpdate();
    return () => {
      viewport.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, [controller.messageListRef, messageIDsKey]);

  useEffect(() => {
    const userMessageIDs = JSON.parse(messageIDsKey) as string[];
    const activeIndex = userMessageIDs.indexOf(activeMessageID);
    setWindowStart((current) => {
      if (activeIndex < 0) {
        return clampNavigatorWindowStart(current, userMessageIDs.length);
      }
      return navigatorWindowStartForIndex(activeIndex, userMessageIDs.length);
    });
  }, [activeMessageID, messageIDsKey]);

  useEffect(() => {
    if (panelRef.current && activeMessageID) {
      scrollPanelToMessage(panelRef.current, activeMessageID);
    }
  }, [activeMessageID, messageIDsKey]);

  const jumpToMessage = useCallback(
    (messageID: string) => {
      const viewport = controller.messageListRef.current;
      const messageElement = viewport
        ? findMessageElement(viewport, messageID)
        : null;
      if (!viewport || !messageElement) {
        return;
      }
      const viewportRect = viewport.getBoundingClientRect();
      const messageRect = messageElement.getBoundingClientRect();
      setActiveMessageID(messageID);
      viewport.scrollTo({
        top: Math.max(
          0,
          viewport.scrollTop + messageRect.top - viewportRect.top - 24,
        ),
        behavior: "smooth",
      });
    },
    [controller.messageListRef],
  );

  const shiftWindow = useCallback(
    (direction: -1 | 1) => {
      setWindowStart((current) =>
        clampNavigatorWindowStart(
          current + direction * NAVIGATOR_WINDOW_SIZE,
          userMessages.length,
        ),
      );
    },
    [userMessages.length],
  );

  if (userMessages.length < 2) {
    return null;
  }

  const visibleMessages = userMessages.slice(
    windowStart,
    windowStart + NAVIGATOR_WINDOW_SIZE,
  );
  const hasPreviousWindow = windowStart > 0;
  const hasNextWindow =
    windowStart + NAVIGATOR_WINDOW_SIZE < userMessages.length;

  return (
    <nav className="agent-chat-message-navigator" aria-label="用户消息快速跳转">
      <style>{navigatorStyles}</style>
      <div className="agent-chat-message-navigator-controls">
        <button
          type="button"
          className="agent-chat-message-navigator-page"
          title="显示上一组消息"
          aria-label="显示上一组用户消息"
          disabled={!hasPreviousWindow}
          onClick={() => shiftWindow(-1)}
        >
          <ChevronUp />
        </button>

        <div className="agent-chat-message-navigator-rail">
          {visibleMessages.map((message, index) => (
            <button
              key={message.id}
              type="button"
              className="agent-chat-message-navigator-mark"
              data-active={
                message.id === activeMessageID ? "true" : undefined
              }
              title={`跳转到：${messageSummary(message.text)}`}
              aria-label={`跳转到第 ${windowStart + index + 1} 条用户消息`}
              aria-current={
                message.id === activeMessageID ? "location" : undefined
              }
              onClick={() => jumpToMessage(message.id)}
            />
          ))}
        </div>

        <button
          type="button"
          className="agent-chat-message-navigator-page"
          title="显示下一组消息"
          aria-label="显示下一组用户消息"
          disabled={!hasNextWindow}
          onClick={() => shiftWindow(1)}
        >
          <ChevronDown />
        </button>
      </div>

      <div ref={panelRef} className="agent-chat-message-navigator-panel">
        {visibleMessages.map((message) => (
          <button
            key={message.id}
            type="button"
            className="agent-chat-message-navigator-item"
            data-navigator-message-id={message.id}
            data-active={message.id === activeMessageID ? "true" : undefined}
            onClick={() => jumpToMessage(message.id)}
          >
            {messageSummary(message.text)}
          </button>
        ))}
      </div>
    </nav>
  );
}

function isUserMessage(
  message: ChatMessage,
): message is ChatMessage & { role: "user" } {
  return message.role === "user";
}

function resolveActiveMessageID(
  viewport: HTMLDivElement,
  messageIDs: string[],
) {
  const viewportRect = viewport.getBoundingClientRect();
  const anchorY = viewportRect.top + Math.min(viewportRect.height * 0.28, 220);
  const messageElements = messageElementMap(viewport);
  let activeID = messageIDs[0] || "";

  for (const messageID of messageIDs) {
    const element = messageElements.get(messageID);
    if (!element) {
      continue;
    }
    if (element.getBoundingClientRect().top > anchorY) {
      break;
    }
    activeID = messageID;
  }
  return activeID;
}

function findMessageElement(viewport: HTMLDivElement, messageID: string) {
  return messageElementMap(viewport).get(messageID);
}

function messageElementMap(viewport: HTMLDivElement) {
  return new Map(
    Array.from(
      viewport.querySelectorAll<HTMLElement>("[data-message-id]"),
    ).map((element) => [element.dataset.messageId || "", element] as const),
  );
}

function messageSummary(text: string) {
  const normalized = String(text || "")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) {
    return "空消息";
  }
  const characters = Array.from(normalized);
  return characters.length > 46
    ? `${characters.slice(0, 46).join("")}...`
    : normalized;
}

function navigatorWindowStartForIndex(activeIndex: number, total: number) {
  return clampNavigatorWindowStart(
    activeIndex - Math.floor(NAVIGATOR_WINDOW_SIZE / 2),
    total,
  );
}

function clampNavigatorWindowStart(start: number, total: number) {
  return Math.min(
    Math.max(0, total - NAVIGATOR_WINDOW_SIZE),
    Math.max(0, start),
  );
}

function scrollPanelToMessage(panel: HTMLDivElement, messageID: string) {
  const item = Array.from(
    panel.querySelectorAll<HTMLElement>("[data-navigator-message-id]"),
  ).find((element) => element.dataset.navigatorMessageId === messageID);
  if (!item) {
    return;
  }
  const top = item.offsetTop;
  const bottom = top + item.offsetHeight;
  const visibleTop = panel.scrollTop + 8;
  const visibleBottom = panel.scrollTop + panel.clientHeight - 8;
  if (top < visibleTop) {
    panel.scrollTop = Math.max(0, top - 8);
  } else if (bottom > visibleBottom) {
    panel.scrollTop = bottom - panel.clientHeight + 8;
  }
}

const navigatorStyles = `
.agent-chat-message-navigator {
  position: absolute;
  top: 45%;
  right: 16px;
  z-index: 9;
  width: 26px;
  transform: translateY(-50%);
}

.agent-chat-message-navigator-controls {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 3px;
}

.agent-chat-message-navigator-page {
  display: flex;
  width: 26px;
  height: 22px;
  flex: 0 0 22px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 9999px;
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: color 140ms ease, background 140ms ease;
}

.agent-chat-message-navigator-page:hover,
.agent-chat-message-navigator-page:focus-visible {
  outline: none;
  background: var(--muted);
  color: var(--foreground);
}

.agent-chat-message-navigator-page:disabled {
  visibility: hidden;
  pointer-events: none;
}

.agent-chat-message-navigator-page svg {
  width: 15px;
  height: 15px;
}

.agent-chat-message-navigator-rail {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 7px;
  padding: 5px 2px;
}

.agent-chat-message-navigator-mark {
  display: block;
  width: 22px;
  height: 2px;
  flex: 0 0 2px;
  border: 0;
  border-radius: 9999px;
  background: color-mix(in oklab, var(--muted-foreground) 52%, transparent);
  cursor: pointer;
  transition: width 140ms ease, height 140ms ease, background 140ms ease;
}

.agent-chat-message-navigator-mark:hover,
.agent-chat-message-navigator-mark:focus-visible {
  width: 24px;
  height: 3px;
  flex-basis: 3px;
  outline: none;
  background: var(--foreground);
}

.agent-chat-message-navigator-mark[data-active="true"] {
  height: 3px;
  flex-basis: 3px;
  background: var(--foreground);
}

.agent-chat-message-navigator-panel {
  position: absolute;
  top: 50%;
  right: 26px;
  box-sizing: border-box;
  display: flex;
  width: min(360px, calc(100vw - 96px));
  max-height: 54vh;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
  visibility: hidden;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: var(--background);
  box-shadow:
    0 18px 48px rgba(15, 23, 42, 0.14),
    0 4px 14px rgba(15, 23, 42, 0.08);
  opacity: 0;
  pointer-events: none;
  transform: translateY(-50%) translateX(8px) scale(0.98);
  transform-origin: right center;
  transition:
    opacity 140ms ease,
    transform 140ms ease,
    visibility 140ms ease;
  scrollbar-color: color-mix(in oklab, var(--muted-foreground) 42%, transparent) transparent;
  scrollbar-width: thin;
}

.agent-chat-message-navigator-panel::-webkit-scrollbar {
  width: 6px;
}

.agent-chat-message-navigator-panel::-webkit-scrollbar-thumb {
  border-radius: 9999px;
  background: color-mix(in oklab, var(--muted-foreground) 42%, transparent);
}

.agent-chat-message-navigator:hover .agent-chat-message-navigator-panel,
.agent-chat-message-navigator:focus-within .agent-chat-message-navigator-panel {
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
  transform: translateY(-50%) translateX(0) scale(1);
}

.agent-chat-message-navigator-item {
  display: block;
  width: 100%;
  overflow: hidden;
  border: 0;
  border-radius: 12px;
  background: transparent;
  padding: 9px 12px;
  color: var(--foreground);
  font: inherit;
  font-size: 14px;
  line-height: 22px;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.agent-chat-message-navigator-item:hover,
.agent-chat-message-navigator-item:focus-visible,
.agent-chat-message-navigator-item[data-active="true"] {
  outline: none;
  background: var(--muted);
}

@media (max-width: 767px) {
  .agent-chat-message-navigator {
    display: none;
  }
}
`;
