import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type WheelEvent,
} from "react";
import { runtimeErrorMessage } from "@/lib/runtime-stream-output";
import {
  archiveAgentChatSession,
  listAgentChatSessions,
  loadAgentInputConfig,
  loadAgentChatReferencePreview,
  loadAgentChatSession,
  loadAgentChatSessionState,
  renameAgentChatSession,
  type AgentChatSession,
  type AgentChatSessionPayload,
} from "./api";
import { useAgentChatRuns } from "./runs";
import { useAgentChatDocumentStreams } from "./document-stream";
import {
  mergeAgentChatDocument,
  type AgentChatDocument,
} from "./document";
import {
  loadAgentChatReferences,
  type ReferenceComposerParam,
  type ReferenceLoadRequest,
  type ReferencePreview,
  type ReferencePreviewRequest,
} from "./reference";
import {
  appendUniqueSessions,
  mergeLatestMessages,
  prependUniqueMessages,
  upsertSession,
  type SessionView,
} from "./state";
import {
  mapChatMessages,
  type AgentChatController,
  type AgentChatStoreOptions,
  type ChatMessage,
} from "./types";

const SESSION_PAGE_SIZE = 20;
const INITIAL_MESSAGE_PAGE_SIZE = 20;
const MESSAGE_PAGE_SIZE = 10;
const SCROLL_EDGE_SIZE = 48;
const SESSION_TITLE_SYNC_DELAYS = [500, 1000, 2000, 4000, 8000, 8000];

export function useAgentChatStore({
  agentKey,
  modalOpen,
  blockMs,
  assistantApi,
  runtimeApi,
}: AgentChatStoreOptions): AgentChatController {
  const contextKey = agentKey ? `agent-runtime:${agentKey}` : "";
  const [sessions, setSessions] = useState<AgentChatSession[]>([]);
  const [sessionID, setSessionID] = useState(0);
  const [sessionTitle, setSessionTitle] = useState("新会话");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsLoadingMore, setSessionsLoadingMore] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [error, setError] = useState("");
  const [inputParams, setInputParams] = useState<ReferenceComposerParam[]>([]);

  const sessionIDRef = useRef(0);
  const sessionViewsRef = useRef(new Map<number, SessionView>());
  const referencePreviewCacheRef = useRef(
    new Map<string, Promise<ReferencePreview>>(),
  );
  const scopeKeyRef = useRef("");
  const loadTokenRef = useRef(0);
  const sessionListTokenRef = useRef(0);
  const lastSessionIDRef = useRef(0);
  const canLoadMoreSessionsRef = useRef(false);
  const sessionsLoadingRef = useRef(false);
  const olderMessagesLoadingRef = useRef(false);
  const lastScrollTopRef = useRef(0);
  const sessionListRef = useRef<HTMLDivElement | null>(null);
  const messageListRef = useRef<HTMLDivElement | null>(null);

  const syncVisibleView = useCallback(
    (nextSessionID: number, view: SessionView) => {
      sessionIDRef.current = nextSessionID;
      setSessionID(nextSessionID);
      setSessionTitle(view.title);
      setMessages(view.messages);
      lastScrollTopRef.current = 0;
    },
    [],
  );

  const saveSessionView = useCallback(
    (targetSessionID: number, view: SessionView) => {
      sessionViewsRef.current.set(targetSessionID, view);
      if (sessionIDRef.current === targetSessionID) {
        setSessionTitle(view.title);
        setMessages(view.messages);
      }
    },
    [],
  );

  const getActiveSessionID = useCallback(() => sessionIDRef.current, []);
  const getSessionTitle = useCallback((targetSessionID: number) => {
    return sessionViewsRef.current.get(targetSessionID)?.title || "新会话";
  }, []);

  const updateSessionMessages = useCallback(
    (
      targetSessionID: number,
      update: (messages: ChatMessage[]) => ChatMessage[],
    ) => {
      const current = sessionViewsRef.current.get(targetSessionID);
      if (!current) {
        return;
      }
      saveSessionView(targetSessionID, {
        ...current,
        messages: update(current.messages),
      });
    },
    [saveSessionView],
  );

  const updateMessageDocument = useCallback(
    (
      targetSessionID: number,
      documentID: number,
      document: AgentChatDocument,
    ) => {
      updateSessionMessages(targetSessionID, (current) =>
        current.map((message) =>
          message.document?.id === documentID ||
          (document.messageID > 0 && message.recordID === document.messageID)
            ? {
                ...message,
                document:
                  mergeAgentChatDocument(message.document, document) || document,
              }
            : message,
        ),
      );
    },
    [updateSessionMessages],
  );

  const updateSessionTitle = useCallback(
    (targetSessionID: number, title: string) => {
      const current = sessionViewsRef.current.get(targetSessionID);
      if (current) {
        saveSessionView(targetSessionID, { ...current, title });
      }
      setSessions((sessionList) =>
        sessionList.map((session) =>
          session.id === targetSessionID ? { ...session, title } : session,
        ),
      );
    },
    [saveSessionView],
  );

  const syncSessionTitle = useCallback(
    async (targetSessionID: number) => {
      const expectedScopeKey = `${agentKey}:${contextKey}`;
      for (const delay of SESSION_TITLE_SYNC_DELAYS) {
        await waitForSessionTitle(delay);
        if (scopeKeyRef.current !== expectedScopeKey) {
          return;
        }
        try {
          const session = await loadAgentChatSessionState(assistantApi, {
            agentKey,
            contextKey,
            sessionID: targetSessionID,
          });
          if (!session) {
            return;
          }
          if (
            session.titleSource === "llm" ||
            session.titleSource === "manual"
          ) {
            updateSessionTitle(targetSessionID, session.title);
            return;
          }
        } catch {
          // 标题同步失败不影响当前对话，下一轮继续尝试。
        }
      }
    },
    [agentKey, assistantApi, contextKey, updateSessionTitle],
  );

  const setSessionRunning = useCallback(
    (targetSessionID: number, running: boolean) => {
      setSessions((current) =>
        current.map((session) =>
          session.id === targetSessionID ? { ...session, running } : session,
        ),
      );
    },
    [],
  );

  const loadReferences = useCallback(
    (request: ReferenceLoadRequest) =>
      loadAgentChatReferences(
        {
          api: assistantApi,
          agentKey,
          contextKey,
          sessionID: sessionIDRef.current,
        },
        request,
      ),
    [agentKey, assistantApi, contextKey],
  );

  const loadReferencePreview = useCallback(
    (reference: ReferencePreviewRequest) => {
      const activeSessionID = sessionIDRef.current;
      if (!activeSessionID || !agentKey) {
        return Promise.reject(new Error("当前会话不可用"));
      }
      const key = `${activeSessionID}:${reference.refType}:${reference.refId}`;
      const cached = referencePreviewCacheRef.current.get(key);
      if (cached) {
        return cached;
      }
      const pending = loadAgentChatReferencePreview(
        runtimeApi.referencePreview,
        { agentKey, sessionID: activeSessionID },
        reference,
      );
      referencePreviewCacheRef.current.set(key, pending);
      void pending.catch(() => {
        if (referencePreviewCacheRef.current.get(key) === pending) {
          referencePreviewCacheRef.current.delete(key);
        }
      });
      return pending;
    },
    [agentKey, runtimeApi.referencePreview],
  );

  const runs = useAgentChatRuns({
    agentKey,
    contextKey,
    modalOpen,
    sessionLoading,
    sessionID,
    messages,
    blockMs,
    runtimeApi,
    getActiveSessionID,
    getSessionTitle,
    updateSessionMessages,
    updateSessionTitle,
    syncSessionTitle,
    setSessionRunning,
    setError,
  });

  useAgentChatDocumentStreams({
    modalOpen,
    sessionID,
    messages,
    blockMs,
    runtimeApi,
    updateDocument: updateMessageDocument,
  });

  const applySessionPayload = useCallback(
    (payload: AgentChatSessionPayload, moveSessionToFront = false) => {
      const nextSessionID = payload.session?.id || 0;
      if (!nextSessionID) {
        return;
      }
      const incomingMessages = runs.mergeMessages(
        nextSessionID,
        mapChatMessages(payload.messages),
      );
      const previousView = sessionViewsRef.current.get(nextSessionID);
      const nextMessages = previousView
        ? mergeLatestMessages(previousView.messages, incomingMessages)
        : incomingMessages;
      const view: SessionView = {
        title: payload.session?.title || "新会话",
        messages: nextMessages,
        oldestMessageID:
          previousView?.oldestMessageID || payload.messages[0]?.id || 0,
        canLoadOlder: previousView?.canLoadOlder ?? payload.messages.length > 0,
      };
      sessionViewsRef.current.set(nextSessionID, view);
      syncVisibleView(nextSessionID, view);
      if (payload.session) {
        const nextSession = {
          ...payload.session,
          running:
            runs.hasRun(nextSessionID) ||
            nextMessages.some((message) => message.running),
        };
        setSessions((current) =>
          upsertSession(current, nextSession, moveSessionToFront),
        );
      }
    },
    [runs.hasRun, runs.mergeMessages, syncVisibleView],
  );

  const initializeChat = useCallback(async () => {
    if (!agentKey || !contextKey) {
      return;
    }
    const token = ++loadTokenRef.current;
    const sessionListToken = ++sessionListTokenRef.current;
    sessionsLoadingRef.current = true;
    setSessionsLoading(true);
    if (!sessionIDRef.current) {
      setSessionLoading(true);
    }
    setError("");
    try {
      const sessionPage = await listAgentChatSessions(assistantApi, {
        agentKey,
        contextKey,
        limit: SESSION_PAGE_SIZE,
      });
      if (
        loadTokenRef.current !== token ||
        sessionListTokenRef.current !== sessionListToken
      ) {
        return;
      }
      setSessions(
        sessionPage.sessions.map((session) => ({
          ...session,
          running: Boolean(session.running) || runs.hasRun(session.id),
        })),
      );
      lastSessionIDRef.current =
        sessionPage.sessions[sessionPage.sessions.length - 1]?.id || 0;
      canLoadMoreSessionsRef.current = sessionPage.sessions.length > 0;
      setSessionsLoading(false);

      const currentSession = sessionPage.sessions[0];
      const cached = currentSession
        ? sessionViewsRef.current.get(currentSession.id)
        : undefined;
      if (currentSession && cached) {
        syncVisibleView(currentSession.id, cached);
        setSessionLoading(false);
      }
      const payload = await loadAgentChatSession(assistantApi, {
        agentKey,
        contextKey,
        sessionID: currentSession?.id,
        create: !currentSession,
        title: "新会话",
        limit: INITIAL_MESSAGE_PAGE_SIZE,
      });
      if (loadTokenRef.current === token) {
        applySessionPayload(payload, !currentSession);
      }
    } catch (currentError: unknown) {
      if (
        loadTokenRef.current === token &&
        sessionListTokenRef.current === sessionListToken
      ) {
        setError(runtimeErrorMessage(currentError, "加载会话失败。"));
      }
    } finally {
      if (
        loadTokenRef.current === token &&
        sessionListTokenRef.current === sessionListToken
      ) {
        sessionsLoadingRef.current = false;
        setSessionsLoading(false);
        setSessionLoading(false);
      }
    }
  }, [
    agentKey,
    applySessionPayload,
    assistantApi,
    contextKey,
    runs.hasRun,
    syncVisibleView,
  ]);

  const openSession = useCallback(
    async (nextSessionID: number, create = false) => {
      if (!agentKey || !contextKey) {
        return;
      }
      const token = ++loadTokenRef.current;
      olderMessagesLoadingRef.current = false;
      const cached = create
        ? undefined
        : sessionViewsRef.current.get(nextSessionID);
      if (cached) {
        syncVisibleView(nextSessionID, cached);
        setSessionLoading(false);
      } else {
        if (create) {
          sessionIDRef.current = 0;
          setSessionID(0);
          setSessionTitle("新会话");
          setMessages([]);
        }
        setSessionLoading(true);
      }
      setError("");
      try {
        const payload = await loadAgentChatSession(assistantApi, {
          agentKey,
          contextKey,
          sessionID: nextSessionID || undefined,
          create,
          title: "新会话",
          limit: create ? INITIAL_MESSAGE_PAGE_SIZE : MESSAGE_PAGE_SIZE,
        });
        if (loadTokenRef.current === token) {
          applySessionPayload(payload, create);
        }
      } catch (currentError: unknown) {
        if (loadTokenRef.current === token) {
          setError(runtimeErrorMessage(currentError, "加载会话失败。"));
        }
      } finally {
        if (loadTokenRef.current === token) {
          setSessionLoading(false);
        }
      }
    },
    [agentKey, applySessionPayload, assistantApi, contextKey, syncVisibleView],
  );

  const startNewSession = useCallback(
    () => openSession(0, true),
    [openSession],
  );

  const renameSession = useCallback(
    async (targetSessionID: number, title: string) => {
      try {
        const session = await renameAgentChatSession(
          assistantApi,
          targetSessionID,
          title,
        );
        updateSessionTitle(targetSessionID, session.title);
        setError("");
      } catch (currentError: unknown) {
        const message = runtimeErrorMessage(currentError, "编辑标题失败。");
        setError(message);
        throw new Error(message);
      }
    },
    [assistantApi, updateSessionTitle],
  );

  const deleteSession = useCallback(
    async (targetSessionID: number) => {
      if (runs.hasRun(targetSessionID)) {
        throw new Error("当前会话正在生成，暂时不能删除。");
      }
      const targetIndex = sessions.findIndex(
        (session) => session.id === targetSessionID,
      );
      const remainingSessions = sessions.filter(
        (session) => session.id !== targetSessionID,
      );
      try {
        await archiveAgentChatSession(assistantApi, targetSessionID);
        sessionViewsRef.current.delete(targetSessionID);
        setSessions(remainingSessions);
        setError("");
        if (sessionIDRef.current !== targetSessionID) {
          return;
        }
        const nextIndex = Math.min(
          Math.max(0, targetIndex),
          Math.max(0, remainingSessions.length - 1),
        );
        const nextSession = remainingSessions[nextIndex];
        if (nextSession) {
          await openSession(nextSession.id, false);
        } else {
          await openSession(0, true);
        }
      } catch (currentError: unknown) {
        const message = runtimeErrorMessage(currentError, "删除会话失败。");
        setError(message);
        throw new Error(message);
      }
    },
    [assistantApi, openSession, runs.hasRun, sessions],
  );

  const loadMoreSessions = useCallback(async () => {
    if (
      !agentKey ||
      !contextKey ||
      !canLoadMoreSessionsRef.current ||
      sessionsLoadingRef.current
    ) {
      return;
    }
    const token = sessionListTokenRef.current;
    sessionsLoadingRef.current = true;
    setSessionsLoadingMore(true);
    try {
      const page = await listAgentChatSessions(assistantApi, {
        agentKey,
        contextKey,
        limit: SESSION_PAGE_SIZE,
        lastSessionID: lastSessionIDRef.current,
      });
      if (sessionListTokenRef.current !== token) {
        return;
      }
      if (page.sessions.length === 0) {
        canLoadMoreSessionsRef.current = false;
        return;
      }
      setSessions((current) =>
        appendUniqueSessions(
          current,
          page.sessions.map((session) => ({
            ...session,
            running: Boolean(session.running) || runs.hasRun(session.id),
          })),
        ),
      );
      lastSessionIDRef.current =
        page.sessions[page.sessions.length - 1]?.id || 0;
    } catch (currentError: unknown) {
      if (sessionListTokenRef.current === token) {
        setError(runtimeErrorMessage(currentError, "加载更多会话失败。"));
      }
    } finally {
      if (sessionListTokenRef.current === token) {
        sessionsLoadingRef.current = false;
        setSessionsLoadingMore(false);
      }
    }
  }, [agentKey, assistantApi, contextKey, runs.hasRun]);

  const loadOlderMessages = useCallback(async () => {
    const activeSessionID = sessionIDRef.current;
    const activeView = sessionViewsRef.current.get(activeSessionID);
    if (
      !activeSessionID ||
      !activeView?.canLoadOlder ||
      !activeView.oldestMessageID ||
      !agentKey ||
      !contextKey ||
      olderMessagesLoadingRef.current
    ) {
      return;
    }
    const element = messageListRef.current;
    const previousHeight = element?.scrollHeight || 0;
    const previousTop = element?.scrollTop || 0;
    const token = loadTokenRef.current;
    olderMessagesLoadingRef.current = true;
    try {
      const payload = await loadAgentChatSession(assistantApi, {
        agentKey,
        contextKey,
        sessionID: activeSessionID,
        limit: MESSAGE_PAGE_SIZE,
        lastMessageID: activeView.oldestMessageID,
      });
      if (
        loadTokenRef.current !== token ||
        sessionIDRef.current !== activeSessionID
      ) {
        return;
      }
      const latestView = sessionViewsRef.current.get(activeSessionID);
      if (!latestView) {
        return;
      }
      if (payload.messages.length === 0) {
        saveSessionView(activeSessionID, {
          ...latestView,
          canLoadOlder: false,
        });
        return;
      }
      saveSessionView(activeSessionID, {
        ...latestView,
        messages: prependUniqueMessages(
          latestView.messages,
          mapChatMessages(payload.messages),
        ),
        oldestMessageID: payload.messages[0]?.id || latestView.oldestMessageID,
        canLoadOlder: true,
      });
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          const currentElement = messageListRef.current;
          if (!currentElement || sessionIDRef.current !== activeSessionID) {
            return;
          }
          currentElement.scrollTop =
            previousTop + currentElement.scrollHeight - previousHeight;
          lastScrollTopRef.current = currentElement.scrollTop;
        });
      });
    } catch (currentError: unknown) {
      if (
        loadTokenRef.current === token &&
        sessionIDRef.current === activeSessionID
      ) {
        setError(runtimeErrorMessage(currentError, "加载历史消息失败。"));
      }
    } finally {
      if (
        loadTokenRef.current === token &&
        sessionIDRef.current === activeSessionID
      ) {
        olderMessagesLoadingRef.current = false;
      }
    }
  }, [agentKey, assistantApi, contextKey, saveSessionView]);

  const handleSessionListScroll = useCallback(() => {
    const element = sessionListRef.current;
    if (
      element &&
      element.scrollHeight - element.scrollTop - element.clientHeight <=
        SCROLL_EDGE_SIZE
    ) {
      void loadMoreSessions();
    }
  }, [loadMoreSessions]);

  const handleMessageListScroll = useCallback(() => {
    const element = messageListRef.current;
    if (!element) {
      return;
    }
    const previousTop = lastScrollTopRef.current;
    const currentTop = element.scrollTop;
    lastScrollTopRef.current = currentTop;
    if (currentTop < previousTop && currentTop <= SCROLL_EDGE_SIZE) {
      void loadOlderMessages();
    }
  }, [loadOlderMessages]);

  const handleMessageListWheel = useCallback(
    (event: WheelEvent<HTMLDivElement>) => {
      if (
        event.deltaY < 0 &&
        event.currentTarget.scrollTop <= SCROLL_EDGE_SIZE
      ) {
        void loadOlderMessages();
      }
    },
    [loadOlderMessages],
  );

  useEffect(() => {
    if (!modalOpen || !agentKey) {
      return;
    }
    const scopeKey = `${agentKey}:${contextKey}`;
    if (scopeKeyRef.current !== scopeKey) {
      scopeKeyRef.current = scopeKey;
      runs.reset();
      sessionViewsRef.current.clear();
      referencePreviewCacheRef.current.clear();
      setSessions([]);
      sessionIDRef.current = 0;
      setSessionID(0);
      setSessionTitle("新会话");
      setMessages([]);
      lastSessionIDRef.current = 0;
      canLoadMoreSessionsRef.current = false;
      lastScrollTopRef.current = 0;
    }
    void initializeChat();
    return () => {
      loadTokenRef.current += 1;
      sessionListTokenRef.current += 1;
      sessionsLoadingRef.current = false;
      olderMessagesLoadingRef.current = false;
    };
  }, [agentKey, contextKey, initializeChat, modalOpen, runs.reset]);

  useEffect(() => {
    if (!modalOpen || !agentKey) {
      setInputParams([]);
      return;
    }
    setInputParams([]);
    let active = true;
    void loadAgentInputConfig(runtimeApi.inputConfig, agentKey)
      .then((params) => {
        if (active) {
          setInputParams(params);
        }
      })
      .catch(() => {
        if (active) {
          setInputParams([]);
        }
      });
    return () => {
      active = false;
    };
  }, [agentKey, modalOpen, runtimeApi.inputConfig]);

  return {
    sessionID,
    sessionTitle,
    sessions,
    messages,
    sessionsLoading,
    sessionsLoadingMore,
    sessionLoading,
    running: runs.running,
    stopping: runs.stopping,
    cancelable: runs.cancelable,
    sendDisabled: !agentKey || !sessionID || sessionLoading || runs.running,
    error,
    inputParams,
    sessionListRef,
    messageListRef,
    openSession: (nextSessionID) => openSession(nextSessionID, false),
    startNewSession,
    renameSession,
    deleteSession,
    loadMoreSessions,
    loadOlderMessages,
    handleSessionListScroll,
    handleMessageListScroll,
    handleMessageListWheel,
    loadReferences,
    loadReferencePreview,
    send: runs.send,
    stop: runs.stop,
  };
}

function waitForSessionTitle(delay: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, delay));
}
