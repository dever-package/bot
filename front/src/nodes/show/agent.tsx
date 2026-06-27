import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { NodeItemProps } from "@/page/nodes";
import {
  Brain,
  ExternalLink,
  History,
  Loader2,
  MessageSquarePlus,
  Pencil,
  RefreshCw,
  RotateCcw,
  Save,
  Send,
  Square,
  Trash2,
  X,
} from "lucide-react";
import { useStore } from "zustand";
import { getCompatModule, request, useNavigate } from "@dever/front-plugin";
import { runAgentStream, stopAgentStream } from "@/lib/agent/runner";
import {
  assistantReferencePayload,
  buildAssistantReferenceMessage,
  type AssistantReferenceFile,
} from "@/lib/assistant/reference";
import { reloadStorePageSchema } from "@/lib/page-schema-reload";
import {
  isEmptyRuntimeOutput,
  isPlainRecord as isPlainObject,
  normalizeRuntimeFrameOutput,
  resolveRuntimeFrameCancelable,
  runtimeErrorMessage,
} from "@/lib/runtime-stream-output";
import { getStoreValueByPath } from "@/lib/store";
import {
  streamValueText as valueText,
  type RuntimeStreamFrame,
} from "@/lib/stream";
import { watchRuntimeStream } from "@/lib/runtime-stream-runner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AgentInteractionPanel,
  type AgentInteraction,
  type AgentInteractionSubmitResult,
} from "@/components/agent/interaction-panel";
import {
  AssistantReferenceList,
  AssistantReferencePicker,
} from "@/components/assistant/reference-picker";
import type { EnergonOutput } from "@/components/energon/content-view";
import {
  cancelStreamTiming,
  StreamTimingBadge,
  createRuntimeStreamTiming,
  createStreamTiming,
  finishStreamTiming,
  isStreamTimingStatusOutput,
  markStreamTimingStopping,
  updateStreamTimingFromOutput,
  useStreamClock,
  type StreamTiming,
} from "@/components/stream-timing";
import {
  AgentResultCard,
  AgentResultDrawer,
  applyResultTaskPlaceholders,
  type AgentResultDetail,
  type AgentResultOutput,
  type AgentResultTask,
} from "./agent-result";
import {
  AgentContentOutputView,
  readableAssistantText,
} from "./agent-content-output";

type AgentRole = "user" | "assistant";

const ASSISTANT_DIALOG_LAYER_CLASS = "z-[100]";
const ASSISTANT_DIALOG_LAYER_Z_INDEX = 1000;
const ASSISTANT_MESSAGE_STATUS_RUNNING = 3;
const AssistantSessionHistoryDialog = resolveCompatComponent(
  "@/components/assistant/session-history-dialog",
  "AssistantSessionHistoryDialog",
);
const compatReloadStoreDataContainer = getCompatModule(
  "@/lib/page-data-reload",
).reloadStoreDataContainer;

type AgentStreamOutput = {
  text: string;
  finalOutput: AgentOutput | null;
};

type AgentMessage = {
  id: string;
  role: AgentRole;
  text: string;
  output?: AgentStreamOutput;
  interaction?: AgentInteraction;
  interactionAnswered?: boolean;
  interactionData?: Record<string, unknown>;
  kind?: "chat" | "interaction_result";
  data?: Record<string, unknown>;
  running?: boolean;
  error?: string;
  requestID?: string;
  actionTiming?: StreamTiming;
  resultDetail?: AgentResultDetail;
};

type AgentOutput = AgentResultOutput & {
  interaction?: AgentInteraction;
  memory_review?: unknown;
};

type AgentSuggestion = {
  label: string;
  prompt: string;
};

type AgentMemoryReview = {
  status: string;
  type?: string;
  text?: string;
  source_message_id?: number;
  title?: string;
  content?: string;
  reason?: string;
  existing?: Record<string, unknown>;
  error?: string;
};

type AgentMemoryRecord = {
  id: number;
  kind: string;
  title: string;
  content: string;
  tags: string[];
  importance: number;
  scope: string;
  source: string;
  status: number;
  created_at: string;
};

type AgentMemoryPatch = {
  title?: string;
  content?: string;
  status?: number;
};

type SkillDraftPatchProgress = {
  status: "saving" | "saved" | "failed";
  draft_id?: number;
  message?: string;
};

type AgentFrame = RuntimeStreamFrame<AgentOutput>;

type AgentRunStatusRecovery = {
  run?: Record<string, unknown>;
};

type AgentRunStatusStreamEntry = {
  id?: string;
  payload?: Record<string, unknown>;
};

type AssistantSessionRecord = {
  id: number;
  title: string;
  context_key: string;
  agent_key: string;
  status: number;
  message_count: number;
  last_message_at: string;
};

type AssistantSessionListPayload = {
  sessions: AssistantSessionRecord[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
    total_pages: number;
  };
};

type AssistantSessionHistoryQuery = {
  page: number;
  pageSize: number;
  keyword: string;
  status: string;
};

const agentResultOutputKeys = [
  "title",
  "rich",
  "images",
  "videos",
  "audios",
  "files",
  "json",
] as const;

const EMPTY_OUTPUT: AgentStreamOutput = {
  text: "",
  finalOutput: null,
};
const AGENT_RUN_RECOVERY_TIMEOUT_MS = 15 * 1000;
const AGENT_RUN_RECOVERY_INTERVAL_MS = 1500;
const AGENT_RUN_RECOVERY_MAX_STATUS_CHECKS = 6;

export function ShowAgent({ item, store }: NodeItemProps) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [input, setInput] = useState("");
  const [references, setReferences] = useState<AssistantReferenceFile[]>([]);
  const [referenceMessage, setReferenceMessage] = useState("");
  const [requestID, setRequestID] = useState("");
  const [sessionID, setSessionID] = useState(0);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false);
  const [memoryDialogOpen, setMemoryDialogOpen] = useState(false);
  const [memories, setMemories] = useState<AgentMemoryRecord[]>([]);
  const [memoryLoading, setMemoryLoading] = useState(false);
  const [memoryError, setMemoryError] = useState("");
  const [running, setRunning] = useState(false);
  const [cancelable, setCancelable] = useState(false);
  const [stopping, setStopping] = useState(false);
  const [error, setError] = useState("");
  const [lastStreamID, setLastStreamID] = useState("0-0");
  const [interactionDialogOpen, setInteractionDialogOpen] = useState(false);
  const [interactionDialogMessageID, setInteractionDialogMessageID] =
    useState("");
  const [resultDrawerMessageID, setResultDrawerMessageID] = useState("");
  const sessionIDRef = useRef(0);
  const messageListRef = useRef<HTMLDivElement>(null);
  const lastAutoScrollResultKeyRef = useRef("");
  const finalSideEffectKeyRef = useRef("");
  const draftPatchSideEffectKeyRef = useRef("");
  const runTokenRef = useRef(0);
  const recoveringRequestIDsRef = useRef<Set<string>>(new Set());
  const openWasTrackedRef = useRef(false);
  const scrollMessageListToBottom = useCallback(() => {
    const element = messageListRef.current;
    if (!element) {
      return;
    }
    scheduleAgentMessagesScrollToBottom(element);
  }, []);

  const agentKey = useStore(store, () =>
    valueText(getStoreValueByPath(store, String(item.meta?.agentPath || ""))),
  );
  const agentName = useStore(store, () =>
    valueText(
      getStoreValueByPath(store, String(item.meta?.agentNamePath || "")),
    ),
  );
  const openPath = String(item.meta?.openPath || "");
  const modalOpen = useStore(store, () =>
    openPath ? Boolean(getStoreValueByPath(store, openPath)) : true,
  );
  const requestApi = String(item.meta?.requestApi || "/bot/admin/agent/run");
  const streamApi = String(item.meta?.streamApi || "/bot/admin/agent/stream");
  const stopApi = String(item.meta?.stopApi || "/bot/admin/agent/stop");
  const runStatusApi = String(
    item.meta?.runStatusApi || "/bot/admin/agent/run_status",
  );
  const paramApi = String(
    item.meta?.paramApi || "/bot/admin/energon/power_params",
  );
  const sessionEnabled = Boolean(item.meta?.sessionEnabled);
  const historyEnabled = sessionEnabled && item.meta?.historyEnabled !== false;
  const newSessionEnabled = item.meta?.newSessionEnabled !== false;
  const memoryEnabled = Boolean(item.meta?.memoryEnabled);
  const memoryPanelEnabled = sessionEnabled && memoryEnabled;
  const sessionApi = String(
    item.meta?.sessionApi || "/bot/admin/assistant/session",
  );
  const sessionsApi = String(
    item.meta?.sessionsApi || "/bot/admin/assistant/sessions",
  );
  const archiveSessionApi = String(
    item.meta?.archiveSessionApi || "/bot/admin/assistant/archive_session",
  );
  const restoreSessionApi = String(
    item.meta?.restoreSessionApi || "/bot/admin/assistant/restore_session",
  );
  const renameSessionApi = String(
    item.meta?.renameSessionApi || "/bot/admin/assistant/rename_session",
  );
  const newSessionApi = String(
    item.meta?.newSessionApi || "/bot/admin/assistant/new_session",
  );
  const clearSessionApi = String(
    item.meta?.clearSessionApi || "/bot/admin/assistant/clear_session",
  );
  const messageApi = String(
    item.meta?.messageApi || "/bot/admin/assistant/message",
  );
  const memoriesApi = String(
    item.meta?.memoriesApi || "/bot/admin/assistant/memories",
  );
  const updateMemoryApi = String(
    item.meta?.updateMemoryApi || "/bot/admin/assistant/update_memory",
  );
  const forgetMemoryApi = String(
    item.meta?.forgetMemoryApi || "/bot/admin/assistant/forget_memory",
  );
  const skillDraftPatchApi = String(item.meta?.skillDraftPatchApi || "");
  const skillDraftPatchListPath = String(
    item.meta?.skillDraftPatchListPath || "/bot/agent/skill_draft/list",
  );
  const skillDraftPatchAutoApply =
    item.meta?.skillDraftPatchAutoApply !== false;
  const sessionContext = useStore(store, () =>
    resolveAssistantSessionContext(item.meta?.sessionContext, store, agentKey),
  );
  const blockMs = Number(item.meta?.blockMs || 1000);
  const initialInput = String(item.meta?.initialInput || "");
  const inputPlaceholder = String(
    item.meta?.placeholder || "输入本轮任务，当前弹窗内的上下文会一起发送。",
  );
  const emptyText = String(item.meta?.emptyText || "");
  const containerHeight =
    valueText(item.meta?.height || item.meta?.containerHeight).trim() ||
    "min(calc(85vh - 11rem), 620px)";
  const pendingInteractionMessage = useMemo(
    () =>
      [...messages]
        .reverse()
        .find(
          (message) =>
            message.role === "assistant" &&
            message.interaction &&
            !message.interactionAnswered,
        ),
    [messages],
  );
  const pendingInteractionMessageID = pendingInteractionMessage?.id || "";
  const interactionDialogMessage = useMemo(() => {
    if (!interactionDialogMessageID) {
      return pendingInteractionMessage;
    }
    return (
      messages.find(
        (message) =>
          message.id === interactionDialogMessageID &&
          message.role === "assistant" &&
          Boolean(message.interaction),
      ) || pendingInteractionMessage
    );
  }, [interactionDialogMessageID, messages, pendingInteractionMessage]);
  const resultDrawerMessage = useMemo(() => {
    if (!resultDrawerMessageID) {
      return undefined;
    }
    return messages.find(
      (message) =>
        message.id === resultDrawerMessageID && message.role === "assistant",
    );
  }, [messages, resultDrawerMessageID]);
  const resultDrawerDetail = useMemo(
    () =>
      resultDrawerMessage ? buildAgentResultDetail(resultDrawerMessage) : null,
    [resultDrawerMessage],
  );
  const resultDrawerRunning = Boolean(resultDrawerMessage?.running);
  const resultDrawerSuggestions = useMemo(
    () =>
      resultDrawerMessage
        ? buildMessageSuggestions(
            resultDrawerMessage,
            Boolean(resultDrawerDetail),
          )
        : [],
    [resultDrawerDetail, resultDrawerMessage],
  );

  const hasPendingAssistantMessage = useMemo(
    () =>
      messages.some(
        (message) => message.role === "assistant" && Boolean(message.running),
      ),
    [messages],
  );
  const canSend = useMemo(
    () =>
      (input.trim().length > 0 || references.length > 0) &&
      agentKey.length > 0 &&
      !sessionLoading &&
      !running &&
      !hasPendingAssistantMessage,
    [
      agentKey,
      hasPendingAssistantMessage,
      input,
      references.length,
      running,
      sessionLoading,
    ],
  );
  const hasRunningActionTiming = useMemo(
    () =>
      messages.some(
        (message) =>
          message.actionTiming && message.actionTiming.status === "running",
      ),
    [messages],
  );
  const nowMs = useStreamClock(hasRunningActionTiming);
  const latestVisibleResultKey = useMemo(
    () => buildLatestVisibleResultKey(messages),
    [messages],
  );
  const enabledMemoryCount = useMemo(
    () => memories.filter(isAgentMemoryEnabled).length,
    [memories],
  );

  useLayoutEffect(() => {
    if (
      !latestVisibleResultKey ||
      latestVisibleResultKey === lastAutoScrollResultKeyRef.current
    ) {
      return;
    }
    lastAutoScrollResultKeyRef.current = latestVisibleResultKey;

    const element = messageListRef.current;
    if (!element) {
      return;
    }

    return scheduleAgentMessagesScrollToBottom(element);
  }, [latestVisibleResultKey]);

  const resetSession = useCallback(() => {
    runTokenRef.current += 1;
    lastAutoScrollResultKeyRef.current = "";
    setMessages([]);
    setInput(initialInput);
    setReferences([]);
    setReferenceMessage("");
    setRequestID("");
    sessionIDRef.current = 0;
    setSessionID(0);
    setMemories([]);
    setMemoryError("");
    setRunning(false);
    setCancelable(false);
    setStopping(false);
    setError("");
    setLastStreamID("0-0");
    setInteractionDialogOpen(false);
    setInteractionDialogMessageID("");
    setResultDrawerMessageID("");
    setHistoryDialogOpen(false);
    setMemoryDialogOpen(false);
  }, [initialInput]);

  const applyAssistantSessionPayload = useCallback(
    (payload: unknown) => {
      const data = isPlainObject(payload) ? payload : {};
      const session = isPlainObject(data.session) ? data.session : {};
      const sessionId = Number(session.id || 0);
      const nextSessionID = Number.isFinite(sessionId) ? sessionId : 0;
      sessionIDRef.current = nextSessionID;
      setSessionID(nextSessionID);
      setMessages(normalizeAssistantSessionMessages(data.messages));
      setMemories(normalizeAgentMemories(data.memories));
      scrollMessageListToBottom();
    },
    [scrollMessageListToBottom],
  );

  const loadAssistantSession = useCallback(
    async (newSession = false) => {
      if (!sessionEnabled || !agentKey) {
        return;
      }
      setSessionLoading(true);
      try {
        const payload = await assistantApiRequest(
          newSession ? newSessionApi : sessionApi,
          {
            agent_key: agentKey,
            context_key: sessionContext,
            title: agentName ? `${agentName} 会话` : "新会话",
            limit: 80,
            memory_enabled: memoryEnabled,
          },
        );
        applyAssistantSessionPayload(payload);
        setError("");
      } catch (currentError: unknown) {
        setError(runtimeErrorMessage(currentError, "加载会话失败。"));
      } finally {
        setSessionLoading(false);
      }
    },
    [
      agentKey,
      agentName,
      applyAssistantSessionPayload,
      memoryEnabled,
      newSessionApi,
      sessionApi,
      sessionContext,
      sessionEnabled,
    ],
  );

  const clearPersistentSession = async () => {
    if (!sessionEnabled || !sessionID || running) {
      resetSession();
      return;
    }
    setSessionLoading(true);
    try {
      const payload = await assistantApiRequest(clearSessionApi, {
        session_id: sessionID,
        memory_enabled: memoryEnabled,
      });
      applyAssistantSessionPayload(payload);
    } catch (currentError: unknown) {
      setError(runtimeErrorMessage(currentError, "清空会话失败。"));
    } finally {
      setSessionLoading(false);
    }
  };

  const loadHistorySessions = useCallback(
    async (
      query: AssistantSessionHistoryQuery,
    ): Promise<AssistantSessionListPayload> => {
      if (!historyEnabled || !agentKey) {
        return emptyAssistantSessionList(query);
      }
      const payload = await assistantApiRequest(sessionsApi, {
        agent_key: agentKey,
        context_key: sessionContext,
        page: query.page,
        page_size: query.pageSize,
        keyword: query.keyword,
        status: query.status,
      });
      const data = isPlainObject(payload) ? payload : {};
      setError("");
      return {
        sessions: normalizeAssistantSessions(data.sessions),
        pagination: normalizeAssistantPagination(data.pagination, query),
      };
    },
    [agentKey, historyEnabled, sessionContext, sessionsApi],
  );

  const loadAssistantMemories = useCallback(async () => {
    if (!memoryPanelEnabled || !agentKey) {
      setMemories([]);
      return;
    }
    setMemoryLoading(true);
    try {
      const activeSessionID = sessionID || sessionIDRef.current;
      const payload = await assistantApiRequest(memoriesApi, {
        agent_key: agentKey,
        context_key: sessionContext,
        session_id: activeSessionID || undefined,
        scope: "current",
        status: "all",
        page: 1,
        page_size: 50,
      });
      const data = isPlainObject(payload) ? payload : {};
      setMemories(normalizeAgentMemories(data.memories));
      setMemoryError("");
      setError("");
    } catch (currentError: unknown) {
      setMemoryError(runtimeErrorMessage(currentError, "加载长期记忆失败。"));
    } finally {
      setMemoryLoading(false);
    }
  }, [
    agentKey,
    memoriesApi,
    memoryPanelEnabled,
    sessionContext,
    sessionID,
  ]);

  const openMemoryDialog = useCallback(() => {
    setMemoryDialogOpen(true);
  }, []);

  const updateAssistantMemory = useCallback(
    async (memoryID: number, patch: AgentMemoryPatch) => {
      if (!memoryPanelEnabled || memoryID <= 0) {
        return;
      }
      const activeSessionID = sessionID || sessionIDRef.current;
      const payload = await assistantApiRequest(updateMemoryApi, {
        id: memoryID,
        ...patch,
        agent_key: agentKey,
        context_key: sessionContext,
        session_id: activeSessionID || undefined,
      });
      const data = isPlainObject(payload) ? payload : {};
      const saved = normalizeAgentMemory(data.memory);
      if (saved) {
        setMemories((current) => replaceAgentMemory(current, saved));
      } else {
        await loadAssistantMemories();
      }
      setMemoryError("");
    },
    [
      agentKey,
      loadAssistantMemories,
      memoryPanelEnabled,
      sessionContext,
      sessionID,
      updateMemoryApi,
    ],
  );

  const forgetAssistantMemory = useCallback(
    async (memoryID: number) => {
      if (!memoryPanelEnabled || memoryID <= 0) {
        return;
      }
      await assistantApiRequest(forgetMemoryApi, { id: memoryID });
      setMemories((current) =>
        current.map((memory) =>
          memory.id === memoryID ? { ...memory, status: 2 } : memory,
        ),
      );
      setMemoryError("");
    },
    [forgetMemoryApi, memoryPanelEnabled],
  );

  const archiveHistorySession = useCallback(
    async (nextSessionID: number) => {
      await assistantApiRequest(archiveSessionApi, {
        session_id: nextSessionID,
      });
    },
    [archiveSessionApi],
  );

  const restoreHistorySession = useCallback(
    async (nextSessionID: number) => {
      await assistantApiRequest(restoreSessionApi, {
        session_id: nextSessionID,
      });
    },
    [restoreSessionApi],
  );

  const renameHistorySession = useCallback(
    async (nextSessionID: number, title: string) => {
      const payload = await assistantApiRequest(renameSessionApi, {
        session_id: nextSessionID,
        title,
      });
      return normalizeAssistantSession(
        isPlainObject(payload) ? payload.session : null,
      );
    },
    [renameSessionApi],
  );

  const openAssistantSession = async (nextSessionID: number) => {
    if (!nextSessionID || running) {
      return;
    }
    setSessionLoading(true);
    try {
      const payload = await assistantApiRequest(sessionApi, {
        session_id: nextSessionID,
        agent_key: agentKey,
        context_key: sessionContext,
        memory_enabled: memoryEnabled,
        limit: 80,
      });
      applyAssistantSessionPayload(payload);
      setHistoryDialogOpen(false);
      setError("");
    } catch (currentError: unknown) {
      setError(runtimeErrorMessage(currentError, "打开会话失败。"));
    } finally {
      setSessionLoading(false);
    }
  };

  const startPersistentSession = async () => {
    if (!sessionEnabled || running) {
      resetSession();
      return;
    }
    resetSession();
    await loadAssistantSession(true);
  };

  const ensureAssistantSession = async () => {
    if (!sessionEnabled) {
      return 0;
    }
    if (sessionID > 0) {
      return sessionID;
    }
    const payload = await assistantApiRequest(sessionApi, {
      agent_key: agentKey,
      context_key: sessionContext,
      title: agentName ? `${agentName} 会话` : "新会话",
      limit: 80,
      memory_enabled: memoryEnabled,
    });
    applyAssistantSessionPayload(payload);
    const session =
      isPlainObject(payload) && isPlainObject(payload.session)
        ? payload.session
        : {};
    const nextID = Number(session.id || 0);
    return Number.isFinite(nextID) ? nextID : 0;
  };

  const savePersistentMessage = async (
    activeSessionID: number,
    message: Omit<AgentMessage, "id">,
    options?: {
      requestID?: string;
      status?: number;
      output?: unknown;
    },
  ) => {
    if (!sessionEnabled || activeSessionID <= 0) {
      return;
    }
    return await assistantApiRequest(messageApi, {
      session_id: activeSessionID,
      agent_key: agentKey,
      context_key: sessionContext,
      role: message.role,
      kind: message.kind || "chat",
      text: message.text,
      content: {
        kind: message.kind,
        data: message.data,
        interaction: message.interaction,
        interaction_answered: message.interactionAnswered,
        interaction_data: message.interactionData,
      },
      output: options?.output || message.output || {},
      request_id: options?.requestID || message.requestID || "",
      status: options?.status || 1,
      memory_enabled: memoryEnabled,
    });
  };

  const recoverSavedAssistantErrorMessage = async (
    message: AgentMessage,
    activeSessionID: number,
  ) => {
    const recoverRequestID = shouldRecoverSavedAgentErrorMessage(message);
    if (!recoverRequestID) {
      return;
    }
    const statusPayload = await fetchAgentRunStatus(
      runStatusApi,
      recoverRequestID,
    ).catch(() => null);
    const frame = agentRunStatusResultFrame(statusPayload, recoverRequestID);
    if (!frame || Number(frame.status) === 2) {
      return;
    }

    const finalOutput = normalizeRuntimeFrameOutput(frame?.output, frame);
    const finalInteraction = normalizeOutputInteraction(finalOutput);
    const finalText =
      valueText(finalOutput.text) ||
      valueText(frame?.msg) ||
      "智能体已返回结果。";
    const finalMessage: AgentMessage = {
      ...message,
      text: finalText,
      output: {
        text: finalText,
        finalOutput: normalizeAgentDisplayOutput(finalOutput, finalText),
      },
      interaction: finalInteraction,
      interactionAnswered: finalInteraction ? false : undefined,
      running: false,
      error: undefined,
      requestID: recoverRequestID,
    };
    setMessages((current) =>
      current.map((currentMessage) =>
        currentMessage.id === message.id ? finalMessage : currentMessage,
      ),
    );
    await savePersistentMessage(activeSessionID, finalMessage, {
      requestID: recoverRequestID,
      output: finalOutput,
      status: 1,
    });
  };

  useEffect(() => {
    if (!sessionEnabled || sessionID <= 0) {
      return;
    }
    messages.forEach((message) => {
      const recoverRequestID = shouldRecoverSavedAgentErrorMessage(message);
      if (
        !recoverRequestID ||
        recoveringRequestIDsRef.current.has(recoverRequestID)
      ) {
        return;
      }
      recoveringRequestIDsRef.current.add(recoverRequestID);
      void recoverSavedAssistantErrorMessage(message, sessionID);
    });
  }, [messages, runStatusApi, sessionEnabled, sessionID]);

  useEffect(() => {
    if (!openPath) {
      return;
    }
    if (modalOpen && !openWasTrackedRef.current && !running) {
      resetSession();
    }
    openWasTrackedRef.current = modalOpen;
  }, [modalOpen, openPath, resetSession, running]);

  useEffect(() => {
    resetSession();
  }, [agentKey, resetSession]);

  useEffect(() => {
    if (!sessionEnabled || !agentKey) {
      return;
    }
    if (openPath && !modalOpen) {
      return;
    }
    if (running) {
      return;
    }
    if (pendingInteractionMessageID) {
      return;
    }
    void loadAssistantSession(false);
  }, [
    agentKey,
    loadAssistantSession,
    modalOpen,
    openPath,
    pendingInteractionMessageID,
    running,
    sessionEnabled,
  ]);

  useEffect(() => {
    if (!memoryDialogOpen) {
      return;
    }
    void loadAssistantMemories();
  }, [loadAssistantMemories, memoryDialogOpen]);

  useEffect(() => {
    if (
      !sessionEnabled ||
      !agentKey ||
      running ||
      sessionLoading ||
      (openPath && !modalOpen) ||
      !hasPendingAssistantMessage
    ) {
      return;
    }
    const timerID = window.setTimeout(() => {
      void loadAssistantSession(false);
    }, 2000);
    return () => {
      window.clearTimeout(timerID);
    };
  }, [
    agentKey,
    hasPendingAssistantMessage,
    loadAssistantSession,
    modalOpen,
    openPath,
    running,
    sessionEnabled,
    sessionLoading,
  ]);

  useEffect(() => {
    if (pendingInteractionMessageID) {
      setInteractionDialogMessageID(pendingInteractionMessageID);
      setInteractionDialogOpen(true);
    }
  }, [pendingInteractionMessageID]);

  const openInteractionDialog = (messageID: string) => {
    setInteractionDialogMessageID(messageID);
    setInteractionDialogOpen(true);
  };

  const changeInteractionDialogOpen = (open: boolean) => {
    setInteractionDialogOpen(open);
    if (!open) {
      setInteractionDialogMessageID("");
    }
  };

  const send = async () => {
    const runReferences = references;
    const text =
      input.trim() ||
      (runReferences.length > 0 ? "请根据参考资料和当前任务进行分析。" : "");
    if (!text || running || hasPendingAssistantMessage) {
      return;
    }
    const referencePayload = assistantReferencePayload(runReferences);
    if (runReferences.length > 0) {
      setReferences([]);
      setReferenceMessage("");
    }
    await runAgent(
      {
        text,
        ...(referencePayload ? { reference_files: referencePayload } : {}),
      },
      {
        role: "user",
        text: buildAssistantReferenceMessage(text, runReferences),
        kind: "chat",
        data: referencePayload
          ? { reference_files: referencePayload }
          : undefined,
      },
      messages,
    );
  };

  const sendSuggestion = async (suggestion: AgentSuggestion) => {
    const text = suggestion.prompt.trim();
    if (!text || running || hasPendingAssistantMessage) {
      return;
    }
    setResultDrawerMessageID("");
    await runAgent(
      { text },
      {
        role: "user",
        text,
        kind: "chat",
      },
      messages,
      "",
      undefined,
    );
  };

  const submitInteraction = async (result: AgentInteractionSubmitResult) => {
    const sourceMessage = interactionDialogMessage;
    if (
      !sourceMessage?.interaction ||
      sourceMessage.interactionAnswered ||
      running
    ) {
      return;
    }
    const answeredMessages = markInteractionMessageAnswered(
      messages,
      sourceMessage.id,
      result.data,
    );
    setInteractionDialogOpen(false);
    setInteractionDialogMessageID("");

    await runAgent(
      {
        type: "interaction_result",
        interaction_id: sourceMessage.interaction.id || "",
        interaction_type: sourceMessage.interaction.type || "",
        interaction: sourceMessage.interaction,
        data: result.data,
        user_feedback: result.data,
        feedback: result.data,
        text: result.text,
      },
      {
        role: "user",
        text: result.text,
        kind: "interaction_result",
        data: result.data,
      },
      answeredMessages,
      sourceMessage.id,
      result.data,
    );
  };

  const runAgent = async (
    inputPayload: Record<string, unknown>,
    userMessageBody: Omit<AgentMessage, "id">,
    historyMessages: AgentMessage[],
    answeredInteractionMessageID = "",
    answeredInteractionData?: Record<string, unknown>,
  ) => {
    if (!agentKey) {
      setError("未选择智能体。");
      return;
    }
    let activeSessionID = 0;
    if (sessionEnabled) {
      try {
        activeSessionID = await ensureAssistantSession();
      } catch (currentError: unknown) {
        setError(runtimeErrorMessage(currentError, "创建会话失败。"));
        return;
      }
    }

    const token = runTokenRef.current + 1;
    const userMessage: AgentMessage = {
      id: `${token}-user-${Date.now()}`,
      ...userMessageBody,
    };
    const assistantID = `${token}-assistant-${Date.now()}`;
    const assistantMessage: AgentMessage = {
      id: assistantID,
      role: "assistant",
      text: "",
      output: EMPTY_OUTPUT,
      running: true,
      actionTiming: createStreamTiming("等待智能体返回"),
    };
    const history = buildHistory(historyMessages);
    const requestInput = mergeAgentInputContext(
      inputPayload,
      resolveMetaPathMap(item.meta?.inputContext, store),
    );
    requestInput.memory_enabled = memoryEnabled;
    if (activeSessionID > 0) {
      requestInput.assistant_session_id = activeSessionID;
    }

    runTokenRef.current = token;
    finalSideEffectKeyRef.current = "";
    setMessages((current) => {
      const next = answeredInteractionMessageID
        ? current.map((message) =>
            message.id === answeredInteractionMessageID
              ? {
                  ...message,
                  interactionAnswered: true,
                  interactionData: answeredInteractionData,
                }
              : message,
          )
        : current;
      return [...next, userMessage, assistantMessage];
    });
    scrollMessageListToBottom();
    setInput("");
    setRunning(true);
    setCancelable(false);
    setStopping(false);
    setError("");
    setRequestID("");
    setLastStreamID("0-0");

    try {
      await savePersistentMessage(activeSessionID, userMessage);
    } catch (currentError: unknown) {
      setError(runtimeErrorMessage(currentError, "保存用户消息失败。"));
    }

    let assistantSaved = false;
    let activeRequestID = "";
    let activeLastStreamID = "0-0";
    let assistantRunningMessageSaved = false;
    let assistantRunningMessagePromise: Promise<unknown> | null = null;
    const saveAssistantRunningMessage = (nextRequestID: string) => {
      const normalizedRequestID = valueText(nextRequestID);
      if (
        !normalizedRequestID ||
        activeSessionID <= 0 ||
        assistantRunningMessageSaved
      ) {
        return;
      }
      assistantRunningMessageSaved = true;
      assistantRunningMessagePromise = savePersistentMessage(
        activeSessionID,
        {
          ...assistantMessage,
          text: "智能体正在处理...",
          requestID: normalizedRequestID,
        },
        {
          requestID: normalizedRequestID,
          output: {
            event: "running",
            text: "智能体正在处理...",
          },
          status: ASSISTANT_MESSAGE_STATUS_RUNNING,
        },
      );
    };
    const saveAssistantFinalMessage = (
      finalMessage: AgentMessage,
      finalOutput: unknown,
      finalStatus: number,
    ) => {
      void (async () => {
        if (assistantRunningMessagePromise) {
          await assistantRunningMessagePromise.catch(() => undefined);
        }
        return await savePersistentMessage(activeSessionID, finalMessage, {
          requestID: finalMessage.requestID || activeRequestID || requestID,
          output: finalOutput,
          status: finalStatus,
        });
      })().then((saved) => applySavedMemoryReview(assistantID, saved));
    };
    try {
      await runAgentStream<AgentOutput>({
        agent: agentKey,
        input: requestInput,
        history,
        requestApi,
        streamApi,
        stopApi,
        blockMs,
        onRequestID: (nextRequestID) => {
          activeRequestID = valueText(nextRequestID);
          setRequestID(activeRequestID);
          saveAssistantRunningMessage(activeRequestID);
        },
        onFrame: (frame) => {
          if (runTokenRef.current !== token) {
            return;
          }
          const streamID = valueText(frame?.stream_id);
          if (streamID) {
            activeLastStreamID = streamID;
            setLastStreamID(streamID);
          }
          applyFrameToMessage(assistantID, frame);
          handleFinalFrameSideEffects(frame, assistantID);
          if (
            activeSessionID > 0 &&
            frame?.type === "result" &&
            !assistantSaved
          ) {
            assistantSaved = true;
            const finalOutput = normalizeRuntimeFrameOutput(
              frame?.output,
              frame,
            );
            const finalInteraction = normalizeOutputInteraction(finalOutput);
            const finalRequestID =
              valueText(frame?.request_id) || activeRequestID || requestID;
            const finalText =
              valueText(finalOutput.text) ||
              valueText(frame?.msg) ||
              "智能体已返回结果。";
            saveAssistantFinalMessage(
              {
                ...assistantMessage,
                text: finalText,
                output: {
                  text: finalText,
                  finalOutput: normalizeAgentDisplayOutput(
                    finalOutput,
                    finalText,
                  ),
                },
                interaction: finalInteraction,
                interactionAnswered: finalInteraction ? false : undefined,
                running: false,
                requestID: finalRequestID,
              },
              finalOutput,
              Number(frame.status) === 2 ? 2 : 1,
            );
          }
        },
      });
    } catch (currentError: unknown) {
      if (runTokenRef.current === token) {
        const recovered = await recoverAssistantFinalAfterStreamError({
          assistantID,
          activeSessionID,
          assistantMessage,
          requestID: activeRequestID || requestID,
          lastID: activeLastStreamID,
          streamApi,
          runStatusApi,
          blockMs,
          token,
          isAlreadySaved: () => assistantSaved,
          markSaved: () => {
            assistantSaved = true;
          },
          applyFrame: (frame) => {
            const streamID = valueText(frame?.stream_id);
            if (streamID) {
              activeLastStreamID = streamID;
              setLastStreamID(streamID);
            }
            applyFrameToMessage(assistantID, frame);
            handleFinalFrameSideEffects(frame, assistantID);
          },
          saveFinal: saveAssistantFinalMessage,
        });
        if (recovered) {
          return;
        }
        const message = runtimeErrorMessage(currentError, "智能体测试失败。");
        setError(message);
        markAssistantError(assistantID, message);
        if (
          activeSessionID > 0 &&
          !assistantSaved &&
          !isRecoverableAgentStreamErrorMessage(message)
        ) {
          assistantSaved = true;
          saveAssistantFinalMessage(
            {
              ...assistantMessage,
              text: message,
              running: false,
              error: message,
              requestID: activeRequestID || requestID,
            },
            { error: message, text: message },
            2,
          );
        }
      }
    } finally {
      if (runTokenRef.current === token) {
        setRunning(false);
        setCancelable(false);
        setStopping(false);
        markAssistantDone(assistantID);
      }
    }
  };

  const recoverAssistantFinalAfterStreamError = async ({
    assistantID,
    activeSessionID,
    assistantMessage,
    requestID,
    lastID,
    streamApi,
    runStatusApi,
    blockMs,
    token,
    isAlreadySaved,
    markSaved,
    applyFrame,
    saveFinal,
  }: {
    assistantID: string;
    activeSessionID: number;
    assistantMessage: AgentMessage;
    requestID: string;
    lastID: string;
    streamApi: string;
    runStatusApi: string;
    blockMs: number;
    token: number;
    isAlreadySaved: () => boolean;
    markSaved: () => void;
    applyFrame: (frame: AgentFrame) => void;
    saveFinal: (
      finalMessage: AgentMessage,
      finalOutput: unknown,
      finalStatus: number,
    ) => void;
  }) => {
    if (!requestID || isAlreadySaved()) {
      return false;
    }
    const saveResultFrame = (frame: AgentFrame) => {
      applyFrame(frame);
      if (frame?.type !== "result") {
        return false;
      }
      if (activeSessionID > 0 && !isAlreadySaved()) {
        markSaved();
        const finalOutput = normalizeRuntimeFrameOutput(frame?.output, frame);
        const finalInteraction = normalizeOutputInteraction(finalOutput);
        const finalText =
          valueText(finalOutput.text) ||
          valueText(frame?.msg) ||
          "智能体已返回结果。";
        saveFinal(
          {
            ...assistantMessage,
            text: finalText,
            output: {
              text: finalText,
              finalOutput: normalizeAgentDisplayOutput(finalOutput, finalText),
            },
            interaction: finalInteraction,
            interactionAnswered: finalInteraction ? false : undefined,
            running: false,
            requestID: valueText(frame?.request_id) || requestID,
          },
          finalOutput,
          Number(frame.status) === 2 ? 2 : 1,
        );
      }
      return Number(frame.status) !== 2;
    };

    let recovered = false;
    try {
      await watchRuntimeStream<AgentOutput>({
        streamApi,
        requestID,
        lastID: lastID || "0-0",
        blockMs,
        transport: "poll",
        stopOnResult: true,
        recoverOnError: true,
        onFrame: (frame) => {
          if (runTokenRef.current !== token) {
            return false;
          }
          if (frame?.type !== "result" || Number(frame.status) === 2) {
            applyFrame(frame);
            return;
          }
          recovered = saveResultFrame(frame);
        },
      });
    } catch {
      recovered = false;
    }
    if (recovered) {
      return true;
    }

    return await recoverAssistantFinalFromRunStatus({
      runStatusApi,
      requestID,
      token,
      applyResultFrame: saveResultFrame,
    });
  };

  const recoverAssistantFinalFromRunStatus = async ({
    runStatusApi,
    requestID,
    token,
    applyResultFrame,
  }: {
    runStatusApi: string;
    requestID: string;
    token: number;
    applyResultFrame: (frame: AgentFrame) => boolean;
  }) => {
    const deadline = Date.now() + AGENT_RUN_RECOVERY_TIMEOUT_MS;
    let failedStatusChecks = 0;
    let statusChecks = 0;
    const recoveredStreamIDs = new Set<string>();
    while (
      runTokenRef.current === token &&
      Date.now() < deadline &&
      statusChecks < AGENT_RUN_RECOVERY_MAX_STATUS_CHECKS
    ) {
      statusChecks += 1;
      const statusPayload = await fetchAgentRunStatus(
        runStatusApi,
        requestID,
      ).catch(() => {
        failedStatusChecks += 1;
        return null;
      });
      if (failedStatusChecks >= 3) {
        return false;
      }
      if (statusPayload) {
        failedStatusChecks = 0;
      }
      for (const frame of agentRunStatusStreamFrames(
        statusPayload,
        requestID,
        recoveredStreamIDs,
      )) {
        const streamID = valueText(frame.stream_id);
        if (streamID) {
          recoveredStreamIDs.add(streamID);
        }
        if (applyResultFrame(frame)) {
          return true;
        }
      }
      const frame = agentRunStatusResultFrame(statusPayload, requestID);
      if (frame) {
        applyResultFrame(frame);
        return true;
      }
      await waitAgentRunRecoveryDelay(AGENT_RUN_RECOVERY_INTERVAL_MS);
    }
    return false;
  };

  const stop = async () => {
    if (!requestID || !cancelable || stopping) {
      return;
    }
    setStopping(true);
    markRunningAssistantStopping();
    try {
      await stopAgentStream(requestID, stopApi);
      runTokenRef.current += 1;
      setRunning(false);
      setCancelable(false);
      markRunningAssistantCanceled();
    } catch (currentError: unknown) {
      setError(runtimeErrorMessage(currentError, "停止智能体失败。"));
    } finally {
      setStopping(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      void send();
    }
  };

  const handleFinalFrameSideEffects = (
    frame: AgentFrame,
    messageID?: string,
  ) => {
    handleSkillDraftPatchSideEffect(frame, messageID);
    if (frame?.type !== "result" || item.meta?.reloadPageOnFinal !== true) {
      return;
    }
    if (Number(frame.status) === 2) {
      return;
    }

    const output = normalizeRuntimeFrameOutput(frame?.output, frame);
    const kind = valueText(output.kind || output.type || output.event)
      .trim()
      .toLowerCase();
    if (kind === "skill_draft_patch" && skillDraftPatchApi) {
      return;
    }
    if (!shouldRunFinalSideEffect(kind, item.meta?.reloadPageOnFinalKinds)) {
      return;
    }

    const key = [frame.request_id, frame.stream_id, kind]
      .map(valueText)
      .join(":");
    if (finalSideEffectKeyRef.current === key) {
      return;
    }
    finalSideEffectKeyRef.current = key;

    const delayMs = Math.max(
      0,
      Number(item.meta?.reloadPageOnFinalDelayMs || 0),
    );
    window.setTimeout(() => {
      void reloadStorePageSchema(store);
    }, delayMs);
  };

  const handleSkillDraftPatchSideEffect = (
    frame: AgentFrame,
    messageID?: string,
  ) => {
    if (
      frame?.type !== "result" ||
      !skillDraftPatchApi ||
      !skillDraftPatchAutoApply
    ) {
      return;
    }
    if (Number(frame.status) === 2) {
      return;
    }
    const output = normalizeRuntimeFrameOutput(frame?.output, frame);
    const payload = resolveSkillDraftPatchPayload(output);
    if (!payload) {
      return;
    }
    const key = [frame.request_id, frame.stream_id, "skill_draft_patch"]
      .map(valueText)
      .join(":");
    if (draftPatchSideEffectKeyRef.current === key) {
      return;
    }
    draftPatchSideEffectKeyRef.current = key;
    const context = resolveMetaPathMap(
      item.meta?.skillDraftPatchContext,
      store,
    );
    const requestPayload = {
      ...context,
      ...payload,
      ...buildSkillDraftPatchAssistantContext(
        sessionEnabled,
        sessionID || sessionIDRef.current,
        agentKey,
        sessionContext,
      ),
    };
    void applySkillDraftPatchRequest(messageID, requestPayload);
  };

  const applySkillDraftPatchRequest = (
    messageID: string | undefined,
    requestPayload: Record<string, unknown>,
  ) => {
    markSkillDraftPatchProgress(messageID, {
      status: "saving",
      draft_id: skillDraftPatchNumber(
        requestPayload,
        "id",
        "draft_id",
        "draftId",
      ),
      message: "正在保存技能...",
    });
    void assistantApiRequest(skillDraftPatchApi, requestPayload)
      .then(async (data) => {
        syncSkillDraftPatchStore(
          store,
          item.meta?.skillDraftPatchTargetPath,
          requestPayload,
          data,
        );
        await reloadSkillDraftPatchPageData(
          store,
          item.meta?.skillDraftPatchReloadDataKeys,
          item.meta?.skillDraftPatchReloadDataKey,
          item.meta?.skillDraftPatchReloadPageOnSave,
        );
        upsertSkillDraftPatchTableRow(
          store,
          item.meta?.skillDraftPatchTablePath,
          item.meta?.skillDraftPatchTargetPath,
          requestPayload,
          data,
        );
        markSkillDraftPatchProgress(messageID, {
          status: "saved",
          draft_id:
            skillDraftPatchNumber(data, "draft_id", "draftId", "id") ||
            skillDraftPatchNumber(requestPayload, "id", "draft_id", "draftId"),
          message: "技能已保存。",
        });
        if (item.meta?.skillDraftPatchCloseOnSave === true && openPath) {
          store.getState().setValueByPath(openPath, false);
        }
      })
      .catch((currentError: unknown) => {
        const message = runtimeErrorMessage(currentError, "保存技能失败。");
        markSkillDraftPatchProgress(messageID, {
          status: "failed",
          message,
        });
        setError(message);
      });
  };

  const applyMessageSkillDraftPatch = (
    messageID: string,
    output?: AgentOutput | null,
  ) => {
    if (!skillDraftPatchApi || !output) {
      return;
    }
    const payload = resolveSkillDraftPatchPayload(output);
    if (!payload) {
      markSkillDraftPatchProgress(messageID, {
        status: "failed",
        message: "没有找到可保存的技能内容。",
      });
      return;
    }
    const context = resolveMetaPathMap(
      item.meta?.skillDraftPatchContext,
      store,
    );
    const requestPayload = {
      ...context,
      ...payload,
      ...buildSkillDraftPatchAssistantContext(
        sessionEnabled,
        sessionID || sessionIDRef.current,
        agentKey,
        sessionContext,
      ),
    };
    applySkillDraftPatchRequest(messageID, requestPayload);
  };

  const applyFrameToMessage = (
    messageID: string,
    frame: AgentFrame,
    options?: {
      updateCancelable?: boolean;
    },
  ) => {
    const frameOutput = normalizeRuntimeFrameOutput(frame?.output, frame);
    if (isEmptyRuntimeOutput(frameOutput) && frame?.type !== "result") {
      return;
    }
    const frameCancelable = resolveRuntimeFrameCancelable(frame);
    if (options?.updateCancelable !== false && frameCancelable != null) {
      setCancelable(frameCancelable);
    }

    updateAssistant(messageID, (message) => {
      const currentOutput = message.output || EMPTY_OUTPUT;
      const nextOutput: AgentStreamOutput = {
        text: currentOutput.text,
        finalOutput: currentOutput.finalOutput,
      };

      const event = agentResultRuntimeEvent(frameOutput);
      const frameInteraction = normalizeOutputInteraction(frameOutput);
      if (frame?.type !== "result" && isAgentResultRuntimeEvent(event)) {
        return applyResultRuntimeEvent(message, frameOutput, frame);
      }
      let actionTiming = message.actionTiming;
      if (isStreamTimingStatusOutput(frameOutput)) {
        actionTiming = updateStreamTimingFromOutput(actionTiming, frameOutput);
      }
      const actionResultDetail = mergeActionResultDetail(
        message.resultDetail,
        frameOutput,
        frame,
      );
      if (frame?.type === "result") {
        let finalOutput = isEmptyRuntimeOutput(frameOutput)
          ? normalizeAgentDisplayOutput({
              text: nextOutput.text || valueText(frame?.msg),
            })
          : frameOutput;
        if (isNonResultOutput(finalOutput) && nextOutput.text.trim()) {
          finalOutput = normalizeAgentDisplayOutput({
            ...finalOutput,
            event: "final",
            text: nextOutput.text,
          });
        }
        nextOutput.finalOutput = finalOutput;
        const finalText = valueText(finalOutput.text) || nextOutput.text;
        const resultDetail = mergeMessageResultDetail(
          actionResultDetail,
          resultDetailFromFinalOutput(finalOutput),
        );
        return {
          ...message,
          text: finalText,
          interaction: frameInteraction || message.interaction,
          output: nextOutput,
          resultDetail,
          running: false,
          requestID: valueText(frame?.request_id) || message.requestID,
          actionTiming: finishStreamTiming(
            actionTiming,
            Number(frame.status) === 2 ? "failed" : "done",
          ),
        };
      }
      if (event === "interaction") {
        if (frameOutput.text) {
          nextOutput.text = valueText(frameOutput.text);
        }
        return {
          ...message,
          text: nextOutput.text,
          interaction: frameInteraction || message.interaction,
          output: nextOutput,
          resultDetail: actionResultDetail,
          requestID: valueText(frame?.request_id) || message.requestID,
          actionTiming,
        };
      }
      if (event === "delta" || (!event && frameOutput.text)) {
        nextOutput.text += valueText(frameOutput.text);
      }
      return {
        ...message,
        text: nextOutput.text,
        interaction: frameInteraction || message.interaction,
        output: nextOutput,
        resultDetail: actionResultDetail,
        requestID: valueText(frame?.request_id) || message.requestID,
        actionTiming,
      };
    });
  };

  const updateAssistant = (
    messageID: string,
    updater: (message: AgentMessage) => AgentMessage,
  ) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === messageID && message.role === "assistant"
          ? updater(message)
          : message,
      ),
    );
  };

  const markSkillDraftPatchProgress = (
    messageID: string | undefined,
    progress: SkillDraftPatchProgress,
  ) => {
    if (!messageID) {
      return;
    }
    updateAssistant(messageID, (current) => ({
      ...current,
      data: {
        ...(current.data || {}),
        skillDraftPatch: progress,
      },
    }));
  };

  const applySavedMemoryReview = (messageID: string, saved: unknown) => {
    const message =
      isPlainObject(saved) && isPlainObject(saved.message) ? saved.message : {};
    const output = isPlainObject(message.output) ? message.output : {};
    const review = normalizeAgentMemoryReview(output.memory_review);
    if (!review) {
      return;
    }
    if (!memoryEnabled) {
      return;
    }
    updateAssistant(messageID, (current) => ({
      ...current,
      output: {
        ...(current.output || EMPTY_OUTPUT),
        finalOutput: {
          ...(current.output?.finalOutput || {}),
          memory_review: review,
        },
      },
    }));
    void loadAssistantMemories();
  };

  const updateRunningAssistant = (
    updater: (message: AgentMessage) => AgentMessage,
  ) => {
    setMessages((current) =>
      current.map((message) =>
        message.role === "assistant" && message.running
          ? updater(message)
          : message,
      ),
    );
  };

  const markRunningAssistantStopping = () => {
    updateRunningAssistant((current) => ({
      ...current,
      actionTiming: markStreamTimingStopping(current.actionTiming),
    }));
  };

  const markRunningAssistantCanceled = () => {
    updateRunningAssistant((current) => ({
      ...current,
      running: false,
      actionTiming: cancelStreamTiming(current.actionTiming),
    }));
  };

  const markAssistantError = (messageID: string, message: string) => {
    updateAssistant(messageID, (current) => ({
      ...current,
      error: message,
      running: false,
      actionTiming: finishStreamTiming(current.actionTiming, "failed"),
    }));
  };

  const markAssistantDone = (messageID: string) => {
    updateAssistant(messageID, (current) => ({
      ...current,
      running: false,
      actionTiming: finishStreamTiming(current.actionTiming, "done"),
    }));
  };

  return (
    <div
      className="flex min-h-0 flex-col gap-3 overflow-hidden"
      style={{ height: containerHeight }}
    >
      <div
        ref={messageListRef}
        className="min-h-0 flex-1 space-y-3 overflow-y-auto rounded-md border bg-background p-3"
      >
        {messages.length === 0 ? (
          <div className="flex h-full min-h-48 items-center justify-center text-center text-sm text-muted-foreground">
            {emptyText ||
              `输入一次任务开始测试${agentName ? `「${agentName}」` : "智能体"}。`}
          </div>
        ) : null}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[86%] rounded-md border px-3 py-2 text-sm leading-6",
                message.role === "user"
                  ? "border-primary/20 bg-primary text-primary-foreground"
                  : "bg-muted/35 text-foreground",
              )}
            >
              {message.role === "user" ? (
                <div className="whitespace-pre-wrap break-all">
                  {message.text}
                </div>
              ) : (
                <AgentAssistantMessage
                  message={message}
                  now={nowMs}
                  running={running}
                  memoryEnabled={memoryEnabled}
                  onOpenInteraction={openInteractionDialog}
                  onOpenResult={() => setResultDrawerMessageID(message.id)}
                  onOpenDraftBox={() =>
                    navigate({ to: skillDraftPatchListPath })
                  }
                  onApplySkillDraftPatch={(output) =>
                    applyMessageSkillDraftPatch(message.id, output)
                  }
                  onSendSuggestion={(suggestion) =>
                    void sendSuggestion(suggestion)
                  }
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <AgentInteractionDialog
        open={
          Boolean(interactionDialogMessage?.interaction) &&
          interactionDialogOpen
        }
        interaction={interactionDialogMessage?.interaction}
        paramApi={paramApi}
        readonly={Boolean(interactionDialogMessage?.interactionAnswered)}
        initialData={interactionDialogMessage?.interactionData}
        disabled={running}
        onOpenChange={changeInteractionDialogOpen}
        onSubmit={(result) => void submitInteraction(result)}
      />

      <AgentResultDrawer
        open={Boolean(resultDrawerMessage)}
        detail={resultDrawerDetail}
        running={resultDrawerRunning}
        suggestions={
          resultDrawerSuggestions.length > 0 ? (
            <AgentSuggestionBar
              suggestions={resultDrawerSuggestions}
              disabled={running}
              onSelect={(suggestion) => void sendSuggestion(suggestion)}
            />
          ) : null
        }
        onOpenChange={(open) => {
          if (!open) {
            setResultDrawerMessageID("");
          }
        }}
      />

      {historyEnabled ? (
        <AssistantSessionHistoryDialog
          open={historyDialogOpen}
          onOpenChange={setHistoryDialogOpen}
          agentKey={agentKey}
          contextKey={sessionContext}
          activeSessionID={sessionID}
          disabled={running || sessionLoading}
          assistantLayer
          layerClassName={ASSISTANT_DIALOG_LAYER_CLASS}
          layerZIndex={ASSISTANT_DIALOG_LAYER_Z_INDEX}
          loadSessions={loadHistorySessions}
          onOpenSession={(id) => openAssistantSession(id)}
          onArchiveSession={archiveHistorySession}
          onRestoreSession={restoreHistorySession}
          onRenameSession={renameHistorySession}
        />
      ) : null}

      {memoryPanelEnabled ? (
        <AgentMemoryDialog
          open={memoryDialogOpen}
          memories={memories}
          loading={memoryLoading}
          error={memoryError}
          disabled={running || sessionLoading}
          onOpenChange={setMemoryDialogOpen}
          onRefresh={loadAssistantMemories}
          onUpdate={updateAssistantMemory}
          onForget={forgetAssistantMemory}
        />
      ) : null}

      {error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <div className="shrink-0 overflow-hidden rounded-md border bg-background shadow-xs transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20">
        {references.length > 0 ? (
          <div className="border-b px-3 py-2">
            <AssistantReferenceList
              references={references}
              disabled={running || hasPendingAssistantMessage}
              onRemove={(index) =>
                setReferences((current) =>
                  current.filter((_, currentIndex) => currentIndex !== index),
                )
              }
            />
          </div>
        ) : null}
        <Textarea
          value={input}
          disabled={running || hasPendingAssistantMessage}
          placeholder={inputPlaceholder}
          className="min-h-20 resize-none border-0 bg-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0"
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className="flex items-center justify-between gap-3 border-t px-3 py-2">
          <div className="min-w-0 truncate text-xs text-muted-foreground">
            {requestID
              ? `RequestID: ${requestID}${lastStreamID !== "0-0" ? ` / ${lastStreamID}` : ""}`
              : hasPendingAssistantMessage
                ? "智能体正在执行，结果会自动同步。"
                : referenceMessage ||
                  (sessionEnabled
                    ? sessionLoading
                      ? "正在加载历史会话。"
                      : sessionID
                        ? "会话已保存，刷新后可继续。"
                        : "本次会话会保存到后台。"
                    : "关闭弹窗后会清空本次测试上下文。")}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {memoryPanelEnabled ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={running || sessionLoading}
                onClick={openMemoryDialog}
              >
                <Brain className="size-3.5" />
                {enabledMemoryCount > 0 ? `记忆 ${enabledMemoryCount}` : "记忆"}
              </Button>
            ) : null}
            {historyEnabled ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={running || sessionLoading}
                onClick={() => setHistoryDialogOpen(true)}
              >
                <History className="size-3.5" />
                历史
              </Button>
            ) : null}
            <AssistantReferencePicker
              references={references}
              disabled={running || hasPendingAssistantMessage}
              buttonLabel="素材"
              onReferencesChange={setReferences}
              onMessage={setReferenceMessage}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={running || sessionLoading}
              onClick={() =>
                sessionEnabled ? void clearPersistentSession() : resetSession()
              }
            >
              <Trash2 className="size-3.5" />
              清空
            </Button>
            {newSessionEnabled ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={running || sessionLoading}
                onClick={() =>
                  sessionEnabled
                    ? void startPersistentSession()
                    : resetSession()
                }
              >
                <RotateCcw className="size-3.5" />
                {sessionEnabled ? "新会话" : "新对话"}
              </Button>
            ) : null}
            {running ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!cancelable || stopping}
                onClick={() => void stop()}
              >
                {stopping ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Square className="size-3.5" />
                )}
                停止
              </Button>
            ) : null}
            <Button
              type="button"
              size="sm"
              disabled={!canSend}
              onClick={() => void send()}
            >
              {running || hasPendingAssistantMessage ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              发送
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildLatestVisibleResultKey(messages: AgentMessage[]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (
      message.role !== "assistant" ||
      message.running ||
      message.error ||
      message.interaction
    ) {
      continue;
    }
    if (
      buildAgentResultDetail(message) ||
      hasContentViewOutput(buildContentViewOutput(message))
    ) {
      return message.id;
    }
  }
  return "";
}

function scrollAgentMessagesToBottom(element: HTMLElement) {
  element.scrollTop = element.scrollHeight;
}

function scheduleAgentMessagesScrollToBottom(element: HTMLElement) {
  scrollAgentMessagesToBottom(element);
  const frameID = window.requestAnimationFrame(() => {
    scrollAgentMessagesToBottom(element);
  });
  const timerID = window.setTimeout(() => {
    scrollAgentMessagesToBottom(element);
  }, 120);

  return () => {
    window.cancelAnimationFrame(frameID);
    window.clearTimeout(timerID);
  };
}

async function assistantApiRequest(
  api: string,
  payload: Record<string, unknown>,
) {
  const result = await request(api, "post", payload);
  if (!isPlainObject(result)) {
    return {};
  }
  const status = Number(result.status || 0);
  const code = Number(result.code || 0);
  if (status === 2 || code === 401) {
    throw new Error(valueText(result.msg || result.message) || "请求失败");
  }
  return isPlainObject(result.data) ? result.data : {};
}

async function fetchAgentRunStatus(
  api: string,
  requestID: string,
): Promise<AgentRunStatusRecovery> {
  const result = await request(api, "get", { request_id: requestID });
  if (!isPlainObject(result)) {
    return {};
  }
  const status = Number(result.status || 0);
  const code = Number(result.code || 0);
  if (status === 2 || code === 401) {
    throw new Error(valueText(result.msg || result.message) || "请求失败");
  }
  return isPlainObject(result.data) ? result.data : {};
}

function agentRunStatusResultFrame(
  payload: AgentRunStatusRecovery | null,
  requestID: string,
): AgentFrame | null {
  const run = isPlainObject(payload?.run) ? payload.run : {};
  const status = valueText(run.status).toLowerCase();
  if (!isFinishedAgentRunStatus(status)) {
    return null;
  }

  const output = isPlainObject(run.output) ? run.output : {};
  const errorMessage =
    valueText(run.error) ||
    valueText(output.error) ||
    valueText(output.text) ||
    "智能体运行失败。";
  const frameStatus = status === "success" ? 1 : 2;
  const finalOutput =
    frameStatus === 2 && !valueText(output.text)
      ? {
          ...output,
          event: "status",
          text: errorMessage,
          error: errorMessage,
        }
      : output;

  return {
    request_id: valueText(run.request_id) || requestID,
    type: "result",
    status: frameStatus,
    msg: frameStatus === 2 ? errorMessage : "",
    output: finalOutput as AgentOutput,
  };
}

function agentRunStatusStreamFrames(
  payload: AgentRunStatusRecovery | null,
  requestID: string,
  seenStreamIDs?: Set<string>,
): AgentFrame[] {
  const run = isPlainObject(payload?.run) ? payload.run : {};
  const entries = Array.isArray(run.stream) ? run.stream : [];
  const frames: AgentFrame[] = [];
  for (const entry of entries) {
    const frame = agentRunStatusStreamFrame(entry, requestID);
    if (!frame) {
      continue;
    }
    const streamID = valueText(frame.stream_id);
    if (streamID && seenStreamIDs?.has(streamID)) {
      continue;
    }
    frames.push(frame);
  }
  const snapshotFrame = agentRunStatusSnapshotFrame(run, requestID);
  if (snapshotFrame) {
    const streamID = valueText(snapshotFrame.stream_id);
    if (!streamID || !seenStreamIDs?.has(streamID)) {
      frames.push(snapshotFrame);
    }
  }
  return frames;
}

function agentRunStatusStreamFrame(
  entry: unknown,
  requestID: string,
): AgentFrame | null {
  const streamEntry: AgentRunStatusStreamEntry = isPlainObject(entry)
    ? (entry as AgentRunStatusStreamEntry)
    : {};
  const payload = isPlainObject(streamEntry.payload)
    ? streamEntry.payload
    : isPlainObject(entry)
      ? (entry as Record<string, unknown>)
      : {};
  const output = isPlainObject(payload.output)
    ? (payload.output as AgentOutput)
    : {};
  const event = agentResultRuntimeEvent(output);
  const frameType = valueText(payload.type || "stream").toLowerCase();
  if (frameType !== "result" && !isAgentResultRuntimeEvent(event)) {
    return null;
  }
  return {
    request_id: valueText(payload.request_id) || requestID,
    stream_id: valueText(payload.stream_id) || valueText(streamEntry.id),
    type: frameType || "stream",
    status: Number(payload.status || 0) || 1,
    msg: valueText(payload.msg),
    output,
  };
}

function agentRunStatusSnapshotFrame(
  run: Record<string, unknown>,
  requestID: string,
): AgentFrame | null {
  if (isFinishedAgentRunStatus(valueText(run.status).toLowerCase())) {
    return null;
  }
  const output = isPlainObject(run.output) ? (run.output as AgentOutput) : {};
  const detail = resultDetailFromFinalOutput(output);
  if (!detail || (!detail.result && detail.tasks.length === 0)) {
    return null;
  }
  const resultID = detail.id || valueText(output.result_id) || requestID;
  const snapshotVersion = agentResultSnapshotVersion(detail);
  return {
    request_id: valueText(run.request_id) || requestID,
    stream_id: `run-output:${resultID}:${snapshotVersion}`,
    type: "stream",
    status: 1,
    msg: "",
    output: {
      event: "result_detail",
      result_id: resultID,
      result_mode: detail.mode || "artifact",
      title: detail.title,
      result: detail.result,
      tasks: output.tasks || detail.result?.tasks || detail.tasks,
      progress: detail.progress,
      progress_text: detail.progressText,
    } as AgentOutput,
  };
}

function agentResultSnapshotVersion(detail: AgentResultDetail) {
  const taskVersion = detail.tasks
    .map((task) =>
      [
        task.id,
        task.placeholderID,
        task.status,
        task.progress ?? "",
        task.text,
        task.error,
        task.output ? "output" : "",
      ].join(","),
    )
    .join("|");
  return encodeURIComponent(
    [detail.progress ?? "", detail.progressText, taskVersion].join("|"),
  ).slice(0, 500);
}

function isFinishedAgentRunStatus(status: string) {
  return ["success", "fail", "canceled"].includes(status);
}

function isRecoverableAgentStreamErrorMessage(message: string) {
  return /network|failed to fetch|读取运行流失败\((408|425|429|500|502|503|504)\)|timeout|超时/i.test(
    message,
  );
}

function shouldRecoverSavedAgentErrorMessage(message: AgentMessage) {
  if (
    message.role !== "assistant" ||
    !message.requestID ||
    !message.error ||
    !isRecoverableAgentStreamErrorMessage(message.error)
  ) {
    return "";
  }
  return message.requestID;
}

function waitAgentRunRecoveryDelay(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function resolveCompatComponent(path: string, exportName: string) {
  const component = getCompatModule(path)?.[exportName];
  return typeof component === "function" ? component : MissingCompatDialog;
}

function MissingCompatDialog() {
  return null;
}

async function reloadSkillDraftDataContainer(
  store: NodeItemProps["store"],
  key: string,
) {
  if (typeof compatReloadStoreDataContainer !== "function") {
    return false;
  }
  return Boolean(await compatReloadStoreDataContainer(store, key));
}

async function reloadSkillDraftPatchPageData(
  store: NodeItemProps["store"],
  keysValue: unknown,
  fallbackValue: unknown,
  reloadPageValue: unknown,
) {
  for (const reloadKey of resolveSkillDraftPatchReloadKeys(
    keysValue,
    fallbackValue,
  )) {
    try {
      await reloadSkillDraftDataContainer(store, reloadKey);
    } catch {
      // 保存已经成功，刷新失败时交给本地 upsert 兜底。
    }
  }
  if (reloadPageValue === false) {
    return;
  }
  try {
    await reloadStorePageSchema(store);
  } catch {
    // 保存已经成功，刷新失败时交给本地 upsert 兜底。
  }
}

function resolveSkillDraftPatchReloadKeys(
  keysValue: unknown,
  fallbackValue: unknown,
) {
  const keys: string[] = [];
  if (Array.isArray(keysValue)) {
    for (const value of keysValue) {
      const key = valueText(value).trim();
      if (key && !keys.includes(key)) {
        keys.push(key);
      }
    }
  } else {
    const raw = valueText(keysValue).trim();
    if (raw) {
      for (const item of raw.split(",")) {
        const key = item.trim();
        if (key && !keys.includes(key)) {
          keys.push(key);
        }
      }
    }
  }

  const fallback = valueText(fallbackValue).trim() || "table";
  if (keys.length === 0 && fallback) {
    keys.push(fallback);
  }
  return keys;
}

function resolveAssistantSessionContext(
  value: unknown,
  store: NodeItemProps["store"],
  agentKey: string,
) {
  if (isPlainObject(value)) {
    const prefixedContext = resolvePrefixedAssistantSessionContext(
      value,
      store,
    );
    if (prefixedContext) {
      return prefixedContext;
    }
    const resolved = resolveMetaPathMap(value, store);
    const entries = Object.entries(resolved)
      .filter(([, current]) => current != null && current !== "")
      .sort(([left], [right]) => left.localeCompare(right));
    if (entries.length > 0) {
      return entries
        .map(([key, current]) => `${key}:${valueText(current)}`)
        .join("|");
    }
  }
  const text = valueText(value).trim();
  if (text) {
    return text.replaceAll("{agent}", agentKey);
  }
  return agentKey ? `agent:${agentKey}` : "agent";
}

function resolvePrefixedAssistantSessionContext(
  value: Record<string, unknown>,
  store: NodeItemProps["store"],
) {
  const prefix = valueText(value.prefix).trim();
  const idPath = valueText(value.idPath || value.id_path).trim();
  if (!prefix || !idPath) {
    return "";
  }
  const id = skillDraftPatchNumber(
    { id: getStoreValueByPath(store, idPath) },
    "id",
  );
  if (id > 0) {
    return `${prefix}:${id}`;
  }
  return valueText(value.fallback).trim();
}

function resolveSkillDraftPatchPayload(output: Record<string, unknown>) {
  const source = skillDraftPatchSource(output);
  if (!source) {
    return null;
  }
  const patchSource = skillDraftPatchPayloadSource(source);
  if (!patchSource) {
    return null;
  }
  const patch = isPlainObject(patchSource.patch)
    ? patchSource.patch
    : isPlainObject(patchSource.draft)
      ? patchSource.draft
      : null;
  if (!patch) {
    return null;
  }
  const draftID =
    skillDraftPatchNumber(patchSource, "draft_id", "draftId", "id") ||
    skillDraftPatchNumber(source, "draft_id", "draftId", "id");
  const packID =
    skillDraftPatchNumber(patchSource, "pack_id", "packId") ||
    skillDraftPatchNumber(source, "pack_id", "packId");
  const cateID =
    skillDraftPatchNumber(patchSource, "cate_id", "cateId") ||
    skillDraftPatchNumber(source, "cate_id", "cateId");
  return {
    ...(draftID > 0 ? { id: draftID } : {}),
    ...(packID > 0 ? { pack_id: packID } : {}),
    ...(cateID > 0 ? { cate_id: cateID } : {}),
    patch,
  };
}

function buildSkillDraftPatchAssistantContext(
  sessionEnabled: boolean,
  sessionID: number,
  agentKey: string,
  sessionContext: string,
) {
  if (!sessionEnabled) {
    return {};
  }
  const payload: Record<string, unknown> = {};
  if (sessionID > 0) {
    payload.assistant_session_id = sessionID;
  }
  if (agentKey) {
    payload.assistant_agent_key = agentKey;
  }
  if (sessionContext) {
    payload.assistant_context_key = sessionContext;
  }
  return payload;
}

function skillDraftPatchPayloadSource(source: Record<string, unknown>) {
  const result = isPlainObject(source.result) ? source.result : null;
  const content = isPlainObject(source.content) ? source.content : null;
  const candidates = [
    source,
    isPlainObject(source.json) ? source.json : null,
    content && isPlainObject(content.json) ? content.json : null,
    result,
    result && isPlainObject(result.json) ? result.json : null,
  ];
  return (
    candidates.find(
      (candidate): candidate is Record<string, unknown> =>
        isPlainObject(candidate) &&
        (isPlainObject(candidate.patch) || isPlainObject(candidate.draft)),
    ) || null
  );
}

function syncSkillDraftPatchStore(
  store: NodeItemProps["store"],
  configuredPath: unknown,
  requestPayload: Record<string, unknown>,
  responseData: Record<string, unknown>,
) {
  const targetPath =
    valueText(configuredPath).trim() || "data.actionTarget.draftAgent";
  const patch = isPlainObject(requestPayload.patch)
    ? (requestPayload.patch as Record<string, unknown>)
    : {};
  const current = getStoreValueByPath(store, targetPath);
  const currentDraft = isPlainObject(current)
    ? (current as Record<string, unknown>)
    : {};
  const nextDraft = {
    ...currentDraft,
    ...skillDraftPatchStoreValues(patch),
  };

  const draftID =
    skillDraftPatchNumber(responseData, "draft_id", "draftId", "id") ||
    skillDraftPatchNumber(requestPayload, "id", "draft_id", "draftId") ||
    skillDraftPatchNumber(currentDraft, "id");
  if (draftID > 0) {
    nextDraft.id = draftID;
  }

  const packID =
    skillDraftPatchNumber(requestPayload, "pack_id", "packId") ||
    skillDraftPatchNumber(patch, "pack_id", "packId") ||
    skillDraftPatchNumber(currentDraft, "pack_id", "packId");
  if (packID > 0) {
    nextDraft.pack_id = packID;
  }

  const cateID =
    skillDraftPatchNumber(requestPayload, "cate_id", "cateId") ||
    skillDraftPatchNumber(patch, "cate_id", "cateId") ||
    skillDraftPatchNumber(currentDraft, "cate_id", "cateId");
  if (cateID > 0) {
    nextDraft.cate_id = cateID;
  }

  store.getState().setValueByPath(targetPath, nextDraft);
}

function upsertSkillDraftPatchTableRow(
  store: NodeItemProps["store"],
  configuredTablePath: unknown,
  configuredTargetPath: unknown,
  requestPayload: Record<string, unknown>,
  responseData: Record<string, unknown>,
) {
  const tablePath = valueText(configuredTablePath).trim() || "data.table.list";
  const currentRows = getStoreValueByPath(store, tablePath);
  if (!Array.isArray(currentRows)) {
    return;
  }
  const row = resolveSkillDraftPatchTableRow(
    store,
    configuredTargetPath,
    requestPayload,
    responseData,
  );
  const draftID = skillDraftPatchNumber(row, "id", "draft_id", "draftId");
  if (draftID <= 0) {
    return;
  }
  row.id = draftID;

  let replaced = false;
  const nextRows = currentRows.map((current) => {
    if (
      isPlainObject(current) &&
      skillDraftPatchNumber(current, "id") === draftID
    ) {
      replaced = true;
      return { ...current, ...row };
    }
    return current;
  });
  if (!replaced) {
    nextRows.unshift(row);
    incrementSkillDraftPatchTableTotal(store, tablePath);
  }
  store.getState().setValueByPath(tablePath, nextRows);
}

function resolveSkillDraftPatchTableRow(
  store: NodeItemProps["store"],
  configuredTargetPath: unknown,
  requestPayload: Record<string, unknown>,
  responseData: Record<string, unknown>,
) {
  const targetPath =
    valueText(configuredTargetPath).trim() || "data.actionTarget.draftAgent";
  const current = getStoreValueByPath(store, targetPath);
  const currentDraft = isPlainObject(current)
    ? (current as Record<string, unknown>)
    : {};
  const responseDraft = isPlainObject(responseData.draft)
    ? (responseData.draft as Record<string, unknown>)
    : {};
  const patch = isPlainObject(requestPayload.patch)
    ? (requestPayload.patch as Record<string, unknown>)
    : {};
  return {
    ...currentDraft,
    ...skillDraftPatchStoreValues(patch),
    ...responseDraft,
    id:
      skillDraftPatchNumber(responseData, "draft_id", "draftId", "id") ||
      skillDraftPatchNumber(responseDraft, "id", "draft_id", "draftId") ||
      skillDraftPatchNumber(requestPayload, "id", "draft_id", "draftId") ||
      skillDraftPatchNumber(currentDraft, "id"),
  };
}

function incrementSkillDraftPatchTableTotal(
  store: NodeItemProps["store"],
  tablePath: string,
) {
  const totalPath = tablePath.endsWith(".list")
    ? `${tablePath.slice(0, -".list".length)}.total`
    : "";
  if (!totalPath) {
    return;
  }
  const total = Number(getStoreValueByPath(store, totalPath));
  if (Number.isFinite(total)) {
    store.getState().setValueByPath(totalPath, total + 1);
  }
}

function skillDraftPatchStoreValues(patch: Record<string, unknown>) {
  const values: Record<string, unknown> = {};
  assignPatchText(values, patch, "key", "key");
  assignPatchText(values, patch, "name", "name");
  assignPatchText(values, patch, "description", "description", "desc");
  assignPatchText(
    values,
    patch,
    "skill_md",
    "skill_md",
    "skillMd",
    "skill",
    "content",
    "markdown",
  );
  assignPatchJSONText(
    values,
    patch,
    "files_json",
    "files_json",
    "filesJson",
    "files",
  );
  assignPatchJSONText(
    values,
    patch,
    "manifest",
    "manifest",
    "runtime_config",
    "runtimeConfig",
  );
  assignPatchNumber(values, patch, "pack_id", "pack_id", "packId");
  assignPatchNumber(values, patch, "cate_id", "cate_id", "cateId");
  return values;
}

function assignPatchText(
  values: Record<string, unknown>,
  patch: Record<string, unknown>,
  field: string,
  ...keys: string[]
) {
  const text = skillDraftPatchText(patch, ...keys);
  if (text) {
    values[field] = text;
  }
}

function assignPatchJSONText(
  values: Record<string, unknown>,
  patch: Record<string, unknown>,
  field: string,
  ...keys: string[]
) {
  const text = skillDraftPatchJSONText(patch, ...keys);
  if (text) {
    values[field] = text;
  }
}

function assignPatchNumber(
  values: Record<string, unknown>,
  patch: Record<string, unknown>,
  field: string,
  ...keys: string[]
) {
  const number = skillDraftPatchNumber(patch, ...keys);
  if (number > 0) {
    values[field] = number;
  }
}

function skillDraftPatchText(
  value: Record<string, unknown>,
  ...keys: string[]
) {
  const raw = firstSkillDraftPatchValue(value, keys);
  return valueText(raw).trim();
}

function skillDraftPatchJSONText(
  value: Record<string, unknown>,
  ...keys: string[]
) {
  const raw = firstSkillDraftPatchValue(value, keys);
  if (raw == null) {
    return "";
  }
  if (typeof raw === "string") {
    return raw.trim();
  }
  if (isPlainObject(raw) || Array.isArray(raw)) {
    try {
      return JSON.stringify(raw);
    } catch {
      return "";
    }
  }
  return "";
}

function skillDraftPatchNumber(
  value: Record<string, unknown>,
  ...keys: string[]
) {
  const raw = firstSkillDraftPatchValue(value, keys);
  const number = Number(raw || 0);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function firstSkillDraftPatchValue(
  value: Record<string, unknown>,
  keys: string[],
) {
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(value, key)) {
      return value[key];
    }
  }
  return undefined;
}

function skillDraftPatchSource(output: Record<string, unknown>) {
  const candidates = [
    output,
    isPlainObject(output.json) ? output.json : null,
    isPlainObject(output.content) && isPlainObject(output.content.json)
      ? output.content.json
      : null,
    isPlainObject(output.result) ? output.result : null,
    isPlainObject(output.result) && isPlainObject(output.result.json)
      ? output.result.json
      : null,
  ];
  for (const candidate of candidates) {
    if (!isPlainObject(candidate)) {
      continue;
    }
    if (isSkillDraftPatchObject(candidate)) {
      return candidate;
    }
  }
  return skillDraftPatchSourceFromText(output);
}

function isSkillDraftPatchObject(candidate: Record<string, unknown>) {
  const kind = valueText(candidate.kind || candidate.type || candidate.event)
    .trim()
    .toLowerCase();
  return (
    kind === "skill_draft_patch" ||
    isPlainObject(candidate.patch) ||
    isPlainObject(candidate.draft)
  );
}

function skillDraftPatchSourceFromText(output: Record<string, unknown>) {
  for (const text of skillDraftPatchTextCandidates(output)) {
    for (const block of extractJSONBlocks(text)) {
      const parsed = parseSkillDraftPatchJSON(block);
      if (parsed) {
        return parsed;
      }
    }
  }
  return null;
}

function skillDraftPatchTextCandidates(output: Record<string, unknown>) {
  const candidates: string[] = [];
  const pushText = (value: unknown) => {
    const text = valueText(value).trim();
    if (text && !candidates.includes(text)) {
      candidates.push(text);
    }
  };
  pushText(output.text);
  pushText(output.markdown);
  pushText(output.message);
  const content = isPlainObject(output.content) ? output.content : null;
  if (content) {
    pushText(content.text);
    pushText(content.markdown);
    pushText(content.message);
  }
  return candidates;
}

function extractJSONBlocks(text: string) {
  const blocks: string[] = [];
  for (const match of text.matchAll(/```(?:json)?\s*([\s\S]*?)```/gi)) {
    const block = match[1]?.trim();
    if (block) {
      blocks.push(block);
    }
  }
  blocks.push(...extractBalancedJSONObjects(text));
  if (blocks.length === 0) {
    blocks.push(text);
  }
  return [...new Set(blocks)];
}

function extractBalancedJSONObjects(text: string) {
  const results: string[] = [];
  for (let start = 0; start < text.length; start += 1) {
    if (text[start] !== "{") {
      continue;
    }
    const block = readBalancedJSONObject(text, start);
    if (block) {
      results.push(block);
      start += block.length - 1;
    }
  }
  return results;
}

function readBalancedJSONObject(text: string, start: number) {
  let depth = 0;
  let inString = false;
  let escaping = false;
  for (let index = start; index < text.length; index += 1) {
    const char = text[index];
    if (escaping) {
      escaping = false;
      continue;
    }
    if (char === "\\") {
      escaping = true;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      continue;
    }
    if (inString) {
      continue;
    }
    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;
      if (depth === 0) {
        return text.slice(start, index + 1);
      }
    }
  }
  return "";
}

function parseSkillDraftPatchJSON(text: string) {
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return (
        parsed.find(
          (item): item is Record<string, unknown> =>
            isPlainObject(item) && isSkillDraftPatchObject(item),
        ) || null
      );
    }
    if (isPlainObject(parsed) && isSkillDraftPatchObject(parsed)) {
      return parsed;
    }
  } catch {
    return null;
  }
  return null;
}

function normalizeAssistantSessionMessages(value: unknown): AgentMessage[] {
  const rows = Array.isArray(value) ? value : [];
  return reconcileInteractionResultMessages(
    rows
      .map((row, index) => normalizeAssistantSessionMessage(row, index))
      .filter((message): message is AgentMessage => Boolean(message)),
  );
}

function normalizeAssistantSessionMessage(value: unknown, index: number) {
  if (!isPlainObject(value)) {
    return null;
  }
  const role = valueText(value.role) === "user" ? "user" : "assistant";
  const isRunningMessage =
    Number(value.status || 0) === ASSISTANT_MESSAGE_STATUS_RUNNING;
  const text =
    valueText(value.text) || (isRunningMessage ? "智能体正在处理..." : "");
  const content = isPlainObject(value.content) ? value.content : {};
  const output = isPlainObject(value.output) ? value.output : {};
  const kind = valueText(content.kind || value.kind) as AgentMessage["kind"];
  const actionTiming = isRunningMessage
    ? createStreamTiming("等待智能体返回")
    : normalizeSavedAssistantActionTiming(value, output);
  const message: AgentMessage = {
    id: `saved-${valueText(value.id) || index}`,
    role,
    text,
    kind: kind || "chat",
    data: isPlainObject(content.data)
      ? (content.data as Record<string, unknown>)
      : undefined,
    requestID: valueText(value.request_id),
    running: isRunningMessage,
    actionTiming,
  };
  if (role === "assistant") {
    const finalOutput = isEmptyRuntimeOutput(output)
      ? normalizeAgentDisplayOutput({ text })
      : normalizeAgentDisplayOutput(output, text);
    message.output = {
      text,
      finalOutput,
    };
    if (Number(value.status) === 2) {
      message.error = text;
    }
  }
  const interaction =
    normalizeFrameInteraction(content.interaction) ||
    normalizeOutputInteraction(output);
  if (interaction) {
    message.interaction = interaction;
    message.interactionAnswered = Boolean(content.interaction_answered);
    if (isPlainObject(content.interaction_data)) {
      message.interactionData = content.interaction_data as Record<
        string,
        unknown
      >;
    }
  }
  return message;
}

function normalizeSavedAssistantActionTiming(
  message: Record<string, unknown>,
  output: Record<string, unknown>,
) {
  const source = savedAssistantTimingSource(output);
  const startedAt = firstSavedAssistantTimingValue(
    message,
    output,
    source,
    "started_at_ms",
    "started_at",
  );
  if (startedAt == null) {
    return undefined;
  }
  const finishedAt = firstSavedAssistantTimingValue(
    message,
    output,
    source,
    "finished_at_ms",
    "finished_at",
  );
  return createRuntimeStreamTiming({
    status: Number(message.status || 0) === 2 ? "failed" : "done",
    startedAt,
    finishedAt,
    label: "内容生成完成",
  });
}

function savedAssistantTimingSource(output: Record<string, unknown>) {
  const result = isPlainObject(output.result)
    ? (output.result as Record<string, unknown>)
    : {};
  const content = isPlainObject(output.content)
    ? (output.content as Record<string, unknown>)
    : {};
  const resultContent = isPlainObject(result.content)
    ? (result.content as Record<string, unknown>)
    : {};
  return {
    result,
    content,
    resultContent,
  };
}

function firstSavedAssistantTimingValue(
  message: Record<string, unknown>,
  output: Record<string, unknown>,
  source: ReturnType<typeof savedAssistantTimingSource>,
  primaryKey: string,
  fallbackKey: string,
) {
  for (const row of [
    message,
    output,
    source.result,
    source.content,
    source.resultContent,
  ]) {
    if (row[primaryKey] != null && row[primaryKey] !== "") {
      return row[primaryKey];
    }
    if (row[fallbackKey] != null && row[fallbackKey] !== "") {
      return row[fallbackKey];
    }
  }
  return undefined;
}

function markInteractionMessageAnswered(
  messages: AgentMessage[],
  messageID: string,
  data?: Record<string, unknown>,
) {
  return messages.map((message) =>
    message.id === messageID && message.interaction
      ? {
          ...message,
          interactionAnswered: true,
          interactionData: data,
        }
      : message,
  );
}

function reconcileInteractionResultMessages(messages: AgentMessage[]) {
  let nextMessages = messages;

  messages.forEach((message, index) => {
    if (message.role !== "user" || message.kind !== "interaction_result") {
      return;
    }
    const pendingIndex = findPendingInteractionMessageIndex(
      nextMessages,
      index,
      message,
    );
    if (pendingIndex < 0) {
      return;
    }
    const current = nextMessages[pendingIndex];
    if (!current) {
      return;
    }
    const interactionData = isPlainObject(message.data)
      ? message.data
      : undefined;
    nextMessages = nextMessages.map((item, itemIndex) =>
      itemIndex === pendingIndex
        ? {
            ...current,
            interactionAnswered: true,
            interactionData,
          }
        : item,
    );
  });

  return nextMessages;
}

function findPendingInteractionMessageIndex(
  messages: AgentMessage[],
  beforeIndex: number,
  resultMessage: AgentMessage,
) {
  const interactionID = valueText(
    resultMessage.data?.interaction_id || resultMessage.data?.interactionId,
  );
  for (let index = beforeIndex - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (!message) {
      continue;
    }
    if (
      message.role !== "assistant" ||
      !message.interaction ||
      message.interactionAnswered
    ) {
      continue;
    }
    if (
      interactionID &&
      valueText(message.interaction.id) &&
      valueText(message.interaction.id) !== interactionID
    ) {
      continue;
    }
    return index;
  }
  return -1;
}

function normalizeAssistantSessions(value: unknown) {
  const rows = Array.isArray(value) ? value : [];
  return rows
    .map(normalizeAssistantSession)
    .filter((session): session is AssistantSessionRecord => Boolean(session));
}

function normalizeAssistantSession(value: unknown) {
  if (!isPlainObject(value)) {
    return null;
  }
  const id = Number(value.id || 0);
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }
  return {
    id,
    title: valueText(value.title),
    context_key: valueText(value.context_key),
    agent_key: valueText(value.agent_key),
    status: Number(value.status || 0),
    message_count: Number(value.message_count || 0),
    last_message_at: valueText(value.last_message_at),
  };
}

function normalizeAssistantPagination(
  value: unknown,
  query: AssistantSessionHistoryQuery,
) {
  const data = isPlainObject(value) ? value : {};
  return {
    page: positiveNumber(data.page, query.page),
    page_size: positiveNumber(data.page_size ?? data.pageSize, query.pageSize),
    total: positiveNumber(data.total, 0),
    total_pages: positiveNumber(data.total_pages ?? data.totalPages, 0),
  };
}

function emptyAssistantSessionList(
  query: AssistantSessionHistoryQuery,
): AssistantSessionListPayload {
  return {
    sessions: [],
    pagination: {
      page: query.page,
      page_size: query.pageSize,
      total: 0,
      total_pages: 0,
    },
  };
}

function positiveNumber(value: unknown, fallback: number) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) {
    return fallback;
  }
  return number;
}

function resolveMetaPathMap(value: unknown, store: NodeItemProps["store"]) {
  if (!isPlainObject(value)) {
    return {};
  }

  const result: Record<string, unknown> = {};
  for (const [key, path] of Object.entries(value)) {
    const normalizedKey = String(key || "").trim();
    const normalizedPath = String(path || "").trim();
    if (!normalizedKey || !normalizedPath) {
      continue;
    }
    result[normalizedKey] = getStoreValueByPath(store, normalizedPath);
  }
  return result;
}

function mergeAgentInputContext(
  inputPayload: Record<string, unknown>,
  context: Record<string, unknown>,
) {
  const normalizedContext = Object.fromEntries(
    Object.entries(context).filter(
      ([, value]) => value != null && value !== "",
    ),
  );
  if (!Object.keys(normalizedContext).length) {
    return inputPayload;
  }

  const existingContext = isPlainObject(inputPayload.context)
    ? inputPayload.context
    : {};
  return {
    ...inputPayload,
    context: {
      ...existingContext,
      ...normalizedContext,
    },
  };
}

function AgentAssistantMessage({
  message,
  now,
  running,
  memoryEnabled,
  onOpenInteraction,
  onOpenResult,
  onOpenDraftBox,
  onApplySkillDraftPatch,
  onSendSuggestion,
}: {
  message: AgentMessage;
  now: number;
  running: boolean;
  memoryEnabled: boolean;
  onOpenInteraction: (messageID: string) => void;
  onOpenResult: () => void;
  onOpenDraftBox: () => void;
  onApplySkillDraftPatch: (output?: AgentOutput | null) => void;
  onSendSuggestion: (suggestion: AgentSuggestion) => void;
}) {
  const resultDetail = buildAgentResultDetail(message);
  const isResultCard = shouldDisplayResultCard(resultDetail);
  const contentOutput = buildContentViewOutput(message);
  const hasOutput = isResultCard || hasContentViewOutput(contentOutput);
  const suggestions = buildMessageSuggestions(message, hasOutput);
  const interactionTitle = message.interaction
    ? valueText(message.interaction.title) || "补充交互信息"
    : "";
  const interactionDescription = message.interaction
    ? valueText(message.interaction.description)
    : "";
  const draftProgress = agentMessageSkillDraftPatchProgress(message);
  const draftPatchPayload = message.output?.finalOutput
    ? resolveSkillDraftPatchPayload(message.output.finalOutput)
    : null;
  const showInlineTiming = Boolean(message.actionTiming && !isResultCard);

  return (
    <div className="space-y-2">
      {showInlineTiming ? (
        <div className="flex flex-wrap items-center gap-2">
          <AgentResultKindBadge message={message} hasOutput={hasOutput} />
          <StreamTimingBadge timing={message.actionTiming} now={now} />
        </div>
      ) : (
        <AgentResultKindBadge message={message} hasOutput={hasOutput} />
      )}
      {isResultCard && resultDetail ? (
        <AgentResultCard
          detail={resultDetail}
          running={Boolean(message.running)}
          timing={message.actionTiming}
          now={now}
          onOpen={onOpenResult}
        />
      ) : hasOutput ? (
        <AgentContentOutputView output={contentOutput} />
      ) : null}
      {resultDetail && !isResultCard ? (
        <AgentInlineResultActions onOpen={onOpenResult} />
      ) : null}
      <AgentSkillDraftPatchProgress
        progress={draftProgress}
        hasPendingPatch={Boolean(draftPatchPayload)}
        onApply={() => onApplySkillDraftPatch(message.output?.finalOutput)}
        onOpenDraftBox={onOpenDraftBox}
      />
      {message.error ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-2 py-1 text-destructive">
          {message.error}
        </div>
      ) : null}
      {message.interaction ? (
        <div className="flex items-center justify-between gap-2 rounded-md border bg-background/80 px-2 py-1.5 text-xs text-muted-foreground">
          <span className="min-w-0">
            <span className="block truncate text-foreground">
              {message.interactionAnswered ? "交互信息已提交。" : interactionTitle}
            </span>
            {interactionDescription ? (
              <span className="block truncate">{interactionDescription}</span>
            ) : null}
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="h-7 px-2 text-xs"
            disabled={running && !message.interactionAnswered}
            onClick={() => onOpenInteraction(message.id)}
          >
            {message.interactionAnswered ? "查看参数" : "填写参数"}
          </Button>
        </div>
      ) : null}
      {memoryEnabled ? (
        <AgentMemoryReviewCard review={agentMessageMemoryReview(message)} />
      ) : null}
      <AgentSuggestionBar
        suggestions={suggestions}
        disabled={running}
        onSelect={onSendSuggestion}
      />
      {message.requestID ? (
        <div className="truncate border-t pt-1 font-mono text-[11px] text-muted-foreground">
          {message.requestID}
        </div>
      ) : null}
    </div>
  );
}

function AgentInlineResultActions({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="flex justify-end">
      <Button
        type="button"
        size="sm"
        variant="outline"
        className="h-7 px-2 text-xs"
        onClick={onOpen}
      >
        查看详情
        <ExternalLink className="size-3.5" />
      </Button>
    </div>
  );
}

function AgentMemoryDialog({
  open,
  memories,
  loading,
  error,
  disabled,
  onOpenChange,
  onRefresh,
  onUpdate,
  onForget,
}: {
  open: boolean;
  memories: AgentMemoryRecord[];
  loading: boolean;
  error: string;
  disabled?: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => Promise<void>;
  onUpdate: (memoryID: number, patch: AgentMemoryPatch) => Promise<void>;
  onForget: (memoryID: number) => Promise<void>;
}) {
  const [editingID, setEditingID] = useState(0);
  const [draft, setDraft] = useState({ title: "", content: "" });
  const [busyID, setBusyID] = useState(0);
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (!open) {
      setEditingID(0);
      setDraft({ title: "", content: "" });
      setBusyID(0);
      setActionError("");
    }
  }, [open]);

  const startEdit = (memory: AgentMemoryRecord) => {
    setEditingID(memory.id);
    setDraft({ title: memory.title, content: memory.content });
    setActionError("");
  };

  const saveEdit = async () => {
    if (editingID <= 0) {
      return;
    }
    const title = draft.title.trim();
    const content = draft.content.trim();
    if (!title || !content) {
      setActionError("标题和内容不能为空。");
      return;
    }
    setBusyID(editingID);
    try {
      await onUpdate(editingID, { title, content });
      setEditingID(0);
      setDraft({ title: "", content: "" });
      setActionError("");
    } catch (currentError: unknown) {
      setActionError(runtimeErrorMessage(currentError, "保存长期记忆失败。"));
    } finally {
      setBusyID(0);
    }
  };

  const updateStatus = async (memoryID: number, status: number) => {
    setBusyID(memoryID);
    try {
      await onUpdate(memoryID, { status });
      setActionError("");
    } catch (currentError: unknown) {
      setActionError(runtimeErrorMessage(currentError, "更新长期记忆失败。"));
    } finally {
      setBusyID(0);
    }
  };

  const forget = async (memoryID: number) => {
    setBusyID(memoryID);
    try {
      await onForget(memoryID);
      if (editingID === memoryID) {
        setEditingID(0);
      }
      setActionError("");
    } catch (currentError: unknown) {
      setActionError(runtimeErrorMessage(currentError, "停用长期记忆失败。"));
    } finally {
      setBusyID(0);
    }
  };

  const cancelEdit = () => {
    setEditingID(0);
    setDraft({ title: "", content: "" });
    setActionError("");
  };

  const enabledCount = memories.filter(isAgentMemoryEnabled).length;
  const disabledCount = memories.length - enabledCount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-assistant-layer="true"
        layerClassName={ASSISTANT_DIALOG_LAYER_CLASS}
        layerZIndex={ASSISTANT_DIALOG_LAYER_Z_INDEX}
        className="max-h-[86vh] max-w-3xl"
      >
        <DialogHeader>
          <DialogTitle>长期记忆</DialogTitle>
          <DialogDescription>
            当前智能体和上下文会带入已启用记忆；停用后不会再参与后续运行。
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/30 px-3 py-2 text-sm">
          <div className="min-w-0 text-muted-foreground">
            已启用 {enabledCount} 条
            {disabledCount > 0 ? `，已停用 ${disabledCount} 条` : ""}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={disabled || loading}
            onClick={() => void onRefresh()}
          >
            {loading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <RefreshCw className="size-3.5" />
            )}
            刷新
          </Button>
        </div>

        {error || actionError ? (
          <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {actionError || error}
          </div>
        ) : null}

        <div className="max-h-[56vh] space-y-2 overflow-y-auto pr-1">
          {loading && memories.length === 0 ? (
            <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
              <Loader2 className="mr-2 size-4 animate-spin" />
              正在加载长期记忆
            </div>
          ) : memories.length === 0 ? (
            <div className="flex min-h-32 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
              当前上下文还没有长期记忆。
            </div>
          ) : (
            memories.map((memory) => {
              const editing = editingID === memory.id;
              const busy = busyID === memory.id;
              const enabled = isAgentMemoryEnabled(memory);
              return (
                <div
                  key={memory.id}
                  className={cn(
                    "rounded-md border bg-background p-3 text-sm",
                    !enabled && "bg-muted/20 text-muted-foreground",
                  )}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground">
                          {agentMemoryKindLabel(memory.kind)}
                        </span>
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[11px]",
                            enabled
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-muted text-muted-foreground",
                          )}
                        >
                          {enabled ? "启用" : "停用"}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {agentMemorySourceLabel(memory.source)} / 重要度{" "}
                          {memory.importance}
                        </span>
                      </div>

                      {editing ? (
                        <div className="space-y-2">
                          <Input
                            value={draft.title}
                            disabled={busy}
                            placeholder="记忆标题"
                            onChange={(event) =>
                              setDraft((current) => ({
                                ...current,
                                title: event.target.value,
                              }))
                            }
                          />
                          <Textarea
                            value={draft.content}
                            disabled={busy}
                            placeholder="记忆内容"
                            className="min-h-24 resize-y"
                            onChange={(event) =>
                              setDraft((current) => ({
                                ...current,
                                content: event.target.value,
                              }))
                            }
                          />
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="break-words font-medium text-foreground">
                            {memory.title || "未命名记忆"}
                          </div>
                          <div className="whitespace-pre-wrap break-words leading-6">
                            {memory.content || "无内容"}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 text-[11px] text-muted-foreground">
                        {memory.scope ? (
                          <span>作用域：{agentMemoryScopeLabel(memory.scope)}</span>
                        ) : null}
                        {memory.created_at ? (
                          <span>创建：{memory.created_at}</span>
                        ) : null}
                        {memory.tags.length > 0 ? (
                          <span>标签：{memory.tags.join("、")}</span>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-1 sm:justify-end">
                      {editing ? (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            disabled={disabled || busy}
                            onClick={() => void saveEdit()}
                          >
                            {busy ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Save className="size-3.5" />
                            )}
                            保存
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            disabled={busy}
                            onClick={cancelEdit}
                          >
                            <X className="size-3.5" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            disabled={disabled || busy}
                            onClick={() => startEdit(memory)}
                          >
                            <Pencil className="size-3.5" />
                            编辑
                          </Button>
                          {enabled ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 px-2"
                              disabled={disabled || busy}
                              onClick={() => void forget(memory.id)}
                            >
                              {busy ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="size-3.5" />
                              )}
                              停用
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-8 px-2"
                              disabled={disabled || busy}
                              onClick={() => void updateStatus(memory.id, 1)}
                            >
                              {busy ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <RefreshCw className="size-3.5" />
                              )}
                              启用
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AgentSkillDraftPatchProgress({
  progress,
  hasPendingPatch,
  onApply,
  onOpenDraftBox,
}: {
  progress: SkillDraftPatchProgress | null;
  hasPendingPatch: boolean;
  onApply: () => void;
  onOpenDraftBox: () => void;
}) {
  if (!progress && !hasPendingPatch) {
    return null;
  }
  if (!progress && hasPendingPatch) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2 text-xs text-amber-900">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0 flex-1 leading-5">
            已生成技能内容，确认后保存为未发布版本。
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={onApply}
            >
              保存
            </Button>
          </div>
        </div>
      </div>
    );
  }
  const saving = progress.status === "saving";
  const failed = progress.status === "failed";
  const message =
    progress.message ||
    (failed ? "技能保存失败。" : saving ? "正在保存技能..." : "技能已保存。");
  return (
    <div
      className={cn(
        "rounded-md border px-2.5 py-2 text-xs",
        failed
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-emerald-200 bg-emerald-50 text-emerald-900",
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0 flex-1 leading-5">
          {saving ? (
            <span className="inline-flex items-center gap-1.5">
              <Loader2 className="size-3.5 animate-spin" />
              {message}
            </span>
          ) : failed ? (
            message
          ) : (
            <>
              {message}
              {progress.draft_id ? ` ID: ${progress.draft_id}` : ""}
              <span className="ml-1 text-emerald-700">
                下一步在技能草稿页校验、测试和发布。
              </span>
            </>
          )}
        </div>
        {failed && hasPendingPatch ? (
          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="h-7 px-2 text-xs"
              onClick={onApply}
            >
              重新保存
            </Button>
          </div>
        ) : !saving && !failed ? (
          <div className="flex shrink-0 items-center gap-2">
            <Button
              type="button"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={onOpenDraftBox}
            >
              查看技能草稿
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function AgentResultKindBadge({
  message,
  hasOutput,
}: {
  message: AgentMessage;
  hasOutput: boolean;
}) {
  const label = resolveMessageKindLabel(message, hasOutput);
  if (!label) {
    return null;
  }
  return (
    <div className="inline-flex rounded-full border bg-background/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
      {label}
    </div>
  );
}

function AgentSuggestionBar({
  suggestions,
  disabled,
  onSelect,
}: {
  suggestions: AgentSuggestion[];
  disabled?: boolean;
  onSelect: (suggestion: AgentSuggestion) => void;
}) {
  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-t pt-2">
      {suggestions.map((suggestion, index) => (
        <Button
          key={`${suggestion.label}-${index}`}
          type="button"
          size="sm"
          variant="outline"
          className="h-7 rounded-full px-2.5 text-xs"
          disabled={disabled}
          title={suggestion.prompt}
          onClick={() => onSelect(suggestion)}
        >
          <MessageSquarePlus className="size-3.5" />
          {suggestion.label}
        </Button>
      ))}
    </div>
  );
}

function AgentMemoryReviewCard({
  review,
}: {
  review: AgentMemoryReview | null;
}) {
  if (!review || review.status === "pending") {
    return null;
  }
  return (
    <div className="rounded-md border bg-background/80 px-2 py-2 text-xs text-muted-foreground">
      <div className="font-medium text-foreground">
        {review.text || agentMemoryReviewTitle(review.status)}
      </div>
      {review.content || review.title ? (
        <div className="mt-1 leading-5">
          {review.title ? (
            <div className="text-foreground">{review.title}</div>
          ) : null}
          {review.content ? <div>{review.content}</div> : null}
        </div>
      ) : null}
      {review.error ? (
        <div className="mt-1 text-destructive">{review.error}</div>
      ) : null}
    </div>
  );
}

function agentMemoryReviewTitle(status: string) {
  switch (status) {
    case "saved":
      return "已自动保存长期记忆";
    case "updated":
      return "已自动更新长期记忆";
    case "deduped":
      return "已更新长期记忆权重";
    case "forgot":
      return "已清理相关长期记忆";
    default:
      return "长期记忆已处理";
  }
}

function buildHistory(messages: AgentMessage[]) {
  return messages
    .map((message) => {
      const text = historyMessageText(message);
      const row: Record<string, unknown> = {
        role: message.role,
        text,
      };
      if (message.kind) {
        row.type = message.kind;
      }
      if (message.data) {
        row.data = message.data;
      }
      if (message.output?.finalOutput) {
        const output = historyResultOutput(message);
        if (!isNonResultOutput(output)) {
          row.output = output;
        }
      }
      if (message.interaction) {
        row.interaction = message.interaction;
        row.interaction_answered = Boolean(message.interactionAnswered);
        if (message.interactionData) {
          row.interaction_data = message.interactionData;
        }
      }
      return row;
    })
    .filter(
      (row) =>
        valueText(row.text).trim().length > 0 ||
        Boolean(row.interaction) ||
        Boolean(row.data) ||
        Boolean(row.output),
    );
}

function historyMessageText(message: AgentMessage) {
  if (isProtocolDraftText(message.text)) {
    return "";
  }
  return message.text;
}

function historyResultOutput(message: AgentMessage) {
  const detail = buildAgentResultDetail(message);
  if (detail?.result) {
    return normalizeAgentDisplayOutput(detail.result, message.text);
  }
  return normalizeAgentDisplayOutput(
    (message.output?.finalOutput || {}) as AgentOutput,
    message.text,
  );
}

function isAgentResultRuntimeEvent(event: string) {
  return (
    event === "result_detail" ||
    event === "result_task" ||
    event === "result_progress" ||
    event === "result_created" ||
    event === "task_progress" ||
    event === "task_done"
  );
}

function applyResultRuntimeEvent(
  message: AgentMessage,
  output: AgentOutput,
  frame: AgentFrame,
): AgentMessage {
  const event = agentResultRuntimeEvent(output);
  let detail = message.resultDetail;
  if (event === "result_detail" || event === "result_created") {
    detail = mergeMessageResultDetail(
      detail,
      resultDetailFromRuntimeOutput(output),
    );
  } else if (
    event === "result_task" ||
    event === "task_progress" ||
    event === "task_done"
  ) {
    detail = updateResultDetailTask(
      detail,
      normalizeAgentResultTask(output),
      valueText(output.result_id),
    );
  } else if (event === "result_progress") {
    detail = updateResultDetailProgress(
      detail,
      valueText(output.result_id),
      valueText(output.text),
      normalizeProgressValue(output.progress),
    );
  }
  return {
    ...message,
    text: message.text || "内容已生成，点击查看结果。",
    resultDetail: detail,
    requestID: valueText(frame?.request_id) || message.requestID,
  };
}

function agentResultRuntimeEvent(output: AgentOutput) {
  return valueText(output.semantic_event || output.event).toLowerCase();
}

function buildAgentResultDetail(
  message: AgentMessage,
): AgentResultDetail | null {
  const detail = mergeMessageResultDetail(
    message.resultDetail,
    resultDetailFromFinalOutput(message.output?.finalOutput),
  );
  if (!detail) {
    return null;
  }
  return detail.result || detail.tasks.length ? detail : null;
}

function resultDetailFromRuntimeOutput(
  output?: AgentOutput,
): AgentResultDetail | undefined {
  if (!output) {
    return undefined;
  }
  const result = isPlainObject(output.result)
    ? normalizeAgentDisplayOutput(output.result as AgentOutput)
    : undefined;
  const tasks = normalizeAgentResultTasks(output.tasks);
  return {
    id: valueText(output.result_id) || valueText(result?.result_id),
    title: valueText(output.title || result?.title) || "最终结果",
    mode: normalizeAgentResultMode(
      output.result_mode || output.display_mode || result?.result_mode,
    ),
    result,
    tasks,
    progress: normalizeProgressValue(output.progress),
    progressText: valueText(output.progress_text),
  };
}

function resultDetailFromFinalOutput(
  output?: AgentOutput | null,
): AgentResultDetail | undefined {
  if (!output) {
    return undefined;
  }
  const event = valueText(output.event).toLowerCase();
  const mode = normalizeAgentResultMode(
    output.result_mode || output.display_mode,
  );
  if (event !== "result_card" && mode === "inline") {
    return undefined;
  }
  if (
    event !== "result_card" &&
    !isPlainObject(output.result) &&
    !valueText(output.result_mode || output.display_mode)
  ) {
    return undefined;
  }
  const result = isPlainObject(output.result)
    ? normalizeAgentDisplayOutput(output.result as AgentOutput)
    : normalizeAgentDisplayOutput(output);
  return {
    id: valueText(output.result_id || result.result_id),
    title: valueText(output.title || result.title) || "最终结果",
    mode:
      event === "result_card"
        ? "artifact"
        : normalizeAgentResultMode(
            output.result_mode || output.display_mode || result.result_mode,
          ),
    result,
    tasks: normalizeAgentResultTasks(output.tasks || result.tasks),
    progress: normalizeProgressValue(output.progress),
    progressText: valueText(output.progress_text),
  };
}

function mergeActionResultDetail(
  current: AgentResultDetail | undefined,
  output: AgentOutput,
  frame: AgentFrame,
): AgentResultDetail | undefined {
  const task = actionResultTaskFromOutput(output, frame);
  if (!task) {
    return current;
  }
  const resultID = actionResultID(output, frame);
  const base = current || {
    ...emptyAgentResultDetail(resultID),
    title: "能力生成结果",
  };
  const next = updateResultDetailTask(base, task, resultID);
  return {
    ...next,
    title: base.title || "能力生成结果",
    progress: task.progress ?? next.progress,
    progressText: task.text || next.progressText,
  };
}

function actionResultTaskFromOutput(
  output: AgentOutput,
  frame: AgentFrame,
): AgentResultTask | null {
  const meta = isPlainObject(output.meta) ? output.meta : {};
  const action = valueText(meta.action).toLowerCase();
  if (action !== "call_power") {
    return null;
  }
  const power = valueText(meta.power || output.meta?.power).trim();
  const event = valueText(output.event).toLowerCase();
  const error = valueText(output.error).trim();
  const taskOutput = actionTaskOutput(output);
  const status = error
    ? "failed"
    : taskOutput || event === "final"
      ? "succeeded"
      : "running";
  return {
    id: actionResultID(output, frame),
    placeholderID: actionResultID(output, frame),
    title: power ? `生成 ${power}` : "能力生成",
    kind: valueText(power || output.kind).trim(),
    power,
    execution: "async",
    status,
    text: visibleAgentResultTaskText(output.text || output.progress_text),
    error,
    progress: normalizeProgressValue(
      output.progress ?? meta.progress ?? meta.percent,
    ),
    output: taskOutput,
    sort: 0,
  };
}

function actionTaskOutput(output: AgentOutput): AgentOutput | undefined {
  const event = valueText(output.event).toLowerCase();
  if (!hasAgentDisplayPayload(output) && event !== "final") {
    return undefined;
  }
  const normalized = normalizeAgentDisplayOutput({
    ...output,
    event: "final",
  });
  return isNonResultOutput(normalized) ? undefined : normalized;
}

function actionResultID(output: AgentOutput, frame: AgentFrame) {
  const meta = isPlainObject(output.meta) ? output.meta : {};
  const power = valueText(
    meta.power || (output as Record<string, unknown>).power,
  ).trim();
  const requestID = valueText(frame?.request_id).trim();
  return (
    [requestID, power || "power"].filter(Boolean).join(":") || "power-action"
  );
}

function mergeMessageResultDetail(
  current?: AgentResultDetail,
  incoming?: AgentResultDetail,
): AgentResultDetail | undefined {
  if (!incoming) {
    return current;
  }
  if (!current) {
    return {
      ...incoming,
      mode: incoming.mode || "artifact",
      tasks: sortAgentResultTasks(incoming.tasks),
    };
  }
  return {
    id: incoming.id || current.id,
    title: incoming.title || current.title,
    mode: incoming.mode || current.mode,
    result: incoming.result || current.result,
    tasks: mergeAgentResultTasks(current.tasks, incoming.tasks),
    progress: incoming.progress ?? current.progress,
    progressText: incoming.progressText || current.progressText,
  };
}

function updateResultDetailTask(
  current: AgentResultDetail | undefined,
  task: AgentResultTask | null,
  resultID: string,
): AgentResultDetail {
  const base = current || emptyAgentResultDetail(resultID);
  if (!task) {
    return base;
  }
  return {
    ...base,
    tasks: mergeAgentResultTasks(base.tasks, [task]),
  };
}

function updateResultDetailProgress(
  current: AgentResultDetail | undefined,
  resultID: string,
  text: string,
  progress: number | null,
): AgentResultDetail {
  const base = current || emptyAgentResultDetail(resultID);
  const nextProgress =
    base.progress == null
      ? progress
      : progress == null
        ? base.progress
        : Math.max(base.progress, progress);
  return {
    ...base,
    progress: nextProgress,
    progressText: text || base.progressText,
  };
}

function emptyAgentResultDetail(resultID: string): AgentResultDetail {
  return {
    id: resultID,
    title: "最终结果",
    mode: "artifact",
    tasks: [],
    progress: null,
    progressText: "",
  };
}

function mergeAgentResultTasks(
  current: AgentResultTask[],
  incoming: AgentResultTask[],
) {
  const byID = new Map<string, AgentResultTask>();
  current.forEach((task) => byID.set(task.id, task));
  incoming.forEach((task) => {
    const previous = byID.get(task.id);
    byID.set(task.id, previous ? mergeAgentResultTask(previous, task) : task);
  });
  return sortAgentResultTasks([...byID.values()]);
}

function mergeAgentResultTask(
  previous: AgentResultTask,
  incoming: AgentResultTask,
): AgentResultTask {
  const previousProgress = previous.progress;
  const incomingProgress = incoming.progress;
  const progress =
    previousProgress == null
      ? incomingProgress
      : incomingProgress == null
        ? previousProgress
        : Math.max(previousProgress, incomingProgress);
  const previousRank = agentResultTaskStatusRank(previous.status);
  const incomingRank = agentResultTaskStatusRank(incoming.status);
  const keepPreviousState = previousRank > incomingRank;
  return {
    ...previous,
    ...incoming,
    status: keepPreviousState ? previous.status : incoming.status,
    text: keepPreviousState ? previous.text : incoming.text,
    error: keepPreviousState ? previous.error : incoming.error,
    output: keepPreviousState ? previous.output : incoming.output,
    progress,
  };
}

function agentResultTaskStatusRank(status: string) {
  switch (status) {
    case "succeeded":
    case "failed":
      return 3;
    case "running":
      return 2;
    case "pending":
      return 1;
    default:
      return 0;
  }
}

function sortAgentResultTasks(tasks: AgentResultTask[]) {
  return [...tasks].sort((a, b) => a.sort - b.sort);
}

function normalizeAgentResultTasks(value: unknown): AgentResultTask[] {
  const values = Array.isArray(value) ? value : value == null ? [] : [value];
  return values
    .map(normalizeAgentResultTask)
    .filter((task): task is AgentResultTask => task != null)
    .sort((a, b) => a.sort - b.sort);
}

function normalizeAgentResultTask(value: unknown): AgentResultTask | null {
  if (!isPlainObject(value)) {
    return null;
  }
  const id = valueText(value.id || value.task_id || value.taskId).trim();
  const placeholderID = valueText(
    value.placeholder_id || value.placeholderId || id,
  ).trim();
  const normalizedID = id || placeholderID;
  if (!normalizedID) {
    return null;
  }
  const meta = isPlainObject(value.meta) ? value.meta : {};
  const outputSource = isPlainObject(value.output)
    ? value.output
    : isPlainObject(meta.output)
      ? meta.output
      : undefined;
  const output = outputSource
    ? normalizeAgentDisplayOutput(outputSource as AgentOutput)
    : undefined;
  return {
    id: normalizedID,
    placeholderID,
    title:
      valueText(
        value.title || value.name || value.label || value.power,
      ).trim() || "素材任务",
    kind: valueText(value.kind || value.media_type || value.mediaType).trim(),
    power: valueText(value.power).trim(),
    execution: valueText(value.execution || value.mode).trim() || "async",
    status: valueText(value.status || value.state).trim() || "pending",
    text: visibleAgentResultTaskText(value.text || value.message),
    error: valueText(value.error).trim(),
    progress: normalizeProgressValue(
      value.progress ?? meta.progress ?? meta.percent,
    ),
    output,
    sort: Number(value.sort || 0),
  };
}

function normalizeProgressValue(value: unknown) {
  const progress = Number(value);
  if (!Number.isFinite(progress)) {
    return null;
  }
  return Math.max(0, Math.min(100, Math.round(progress)));
}

function visibleAgentResultTaskText(value: unknown) {
  const text = valueText(value).trim();
  if (!text) {
    return "";
  }
  const hidden = [
    "等待生成结果",
    "等待智能体返回",
    "图片生成中，请稍后",
    "素材生成中，请稍后",
    "内容生成中，请稍后",
    "生成中，请稍后",
  ];
  return hidden.some((item) => text.includes(item)) ? "" : text;
}

function buildContentViewOutput(message: AgentMessage) {
  const detail = buildAgentResultDetail(message);
  if (detail) {
    if (!shouldDisplayInlineResult(detail)) {
      return undefined;
    }
    return detail.result
      ? applyResultTaskPlaceholders(detail.result, detail.tasks)
      : undefined;
  }
  if (message.running || message.interaction) {
    return undefined;
  }
  if (!message.output) {
    return message.text
      ? normalizeAssistantTextDisplayOutput(message.text)
      : undefined;
  }
  if (message.output.finalOutput) {
    const finalOutput = normalizeAgentDisplayOutput(
      message.output.finalOutput,
      message.text,
    );
    const event = valueText(finalOutput.event).toLowerCase();
    if (event === "interaction" || isNonResultOutput(finalOutput)) {
      return undefined;
    }
    return finalOutput;
  }

  const items: EnergonOutput[] = [];
  if (message.output.text && !isProtocolDraftText(message.output.text)) {
    items.push(normalizeAssistantTextDisplayOutput(message.output.text));
  }
  return items;
}

function normalizeAssistantTextDisplayOutput(text: string): AgentOutput {
  const readableText = readableAssistantText(text);
  return normalizeAgentDisplayOutput({
    text: readableText,
    content: {
      format: "markdown",
      text: readableText,
    },
  });
}

function shouldDisplayResultCard(detail?: AgentResultDetail | null) {
  return Boolean(detail && resultDisplayMode(detail) === "artifact");
}

function shouldDisplayInlineResult(detail?: AgentResultDetail | null) {
  return Boolean(detail && resultDisplayMode(detail) === "inline");
}

function resultDisplayMode(detail: AgentResultDetail) {
  return normalizeAgentResultMode(detail.mode);
}

function normalizeAgentResultMode(value: unknown) {
  const mode = valueText(value).trim().toLowerCase();
  return mode === "inline" ? "inline" : "artifact";
}

function buildMessageSuggestions(
  message: AgentMessage,
  hasOutput: boolean,
): AgentSuggestion[] {
  if (message.running || message.error || message.interaction || !hasOutput) {
    return [];
  }
  const output = message.output?.finalOutput
    ? normalizeAgentDisplayOutput(message.output.finalOutput, message.text)
    : normalizeAgentDisplayOutput({ text: message.text });
  const suggestions = normalizeAgentSuggestions(
    output.suggestions || output.meta?.suggestions,
  );
  if (suggestions.length > 0) {
    return suggestions;
  }
  return [];
}

function agentMessageMemoryReview(message: AgentMessage) {
  const output = (message.output?.finalOutput || {}) as Record<string, unknown>;
  return normalizeAgentMemoryReview(output.memory_review);
}

function agentMessageSkillDraftPatchProgress(
  message: AgentMessage,
): SkillDraftPatchProgress | null {
  const raw = message.data?.skillDraftPatch;
  if (!isPlainObject(raw)) {
    return null;
  }
  const status = valueText(raw.status).trim();
  if (status !== "saving" && status !== "saved" && status !== "failed") {
    return null;
  }
  return {
    status,
    draft_id:
      skillDraftPatchNumber(raw, "draft_id", "draftId", "id") || undefined,
    message: valueText(raw.message),
  };
}

function normalizeAgentMemories(value: unknown): AgentMemoryRecord[] {
  const values = Array.isArray(value) ? value : [];
  return values
    .map(normalizeAgentMemory)
    .filter((memory): memory is AgentMemoryRecord => memory != null);
}

function normalizeAgentMemory(value: unknown): AgentMemoryRecord | null {
  if (!isPlainObject(value)) {
    return null;
  }
  const id = Number(value.id || value.memory_id || value.memoryId || 0);
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }
  return {
    id,
    kind: valueText(value.kind || value.type),
    title: valueText(value.title || value.name),
    content: valueText(value.content || value.text),
    tags: normalizeAgentMemoryTags(value.tags),
    importance: normalizeAgentMemoryImportance(value.importance),
    scope: valueText(value.scope),
    source: valueText(value.source),
    status: normalizeAgentMemoryStatus(value.status),
    created_at: valueText(value.created_at || value.createdAt),
  };
}

function normalizeAgentMemoryTags(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(valueText).map((item) => item.trim()).filter(Boolean);
  }
  return valueText(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeAgentMemoryImportance(value: unknown) {
  const importance = Number(value || 0);
  if (!Number.isFinite(importance) || importance <= 0) {
    return 60;
  }
  return Math.round(Math.max(1, Math.min(100, importance)));
}

function normalizeAgentMemoryStatus(value: unknown) {
  const status = Number(value || 0);
  return status === 2 ? 2 : 1;
}

function isAgentMemoryEnabled(memory: AgentMemoryRecord) {
  return memory.status !== 2;
}

function replaceAgentMemory(
  memories: AgentMemoryRecord[],
  nextMemory: AgentMemoryRecord,
) {
  let replaced = false;
  const next = memories.map((memory) => {
    if (memory.id !== nextMemory.id) {
      return memory;
    }
    replaced = true;
    return nextMemory;
  });
  return replaced ? next : [nextMemory, ...next];
}

function agentMemoryKindLabel(kind: string) {
  const labels: Record<string, string> = {
    working: "工作记忆",
    episodic: "事件记忆",
    semantic: "语义记忆",
    procedural: "流程记忆",
    persona: "人格记忆",
    content: "内容记忆",
  };
  return labels[kind] || "长期记忆";
}

function agentMemoryScopeLabel(scope: string) {
  const labels: Record<string, string> = {
    global: "全局",
    agent: "智能体",
    context: "当前上下文",
    session: "当前会话",
  };
  return labels[scope] || scope;
}

function agentMemorySourceLabel(source: string) {
  const labels: Record<string, string> = {
    manual: "手动",
    auto: "自动",
    llm: "模型抽取",
  };
  return labels[source] || "自动";
}

function normalizeAgentMemoryReview(value: unknown): AgentMemoryReview | null {
  if (!isPlainObject(value)) {
    return null;
  }
  const status = valueText(value.status);
  if (!status) {
    return null;
  }
  const memory = isPlainObject(value.memory) ? value.memory : {};
  return {
    status,
    type: valueText(value.type),
    text: valueText(value.text),
    source_message_id: Number(value.source_message_id || 0) || undefined,
    title: valueText(value.title || memory.title),
    content: valueText(value.content || memory.content),
    reason: valueText(value.reason),
    existing: isPlainObject(value.existing) ? value.existing : undefined,
    error: valueText(value.error),
  };
}

function shouldRunFinalSideEffect(kind: string, allowedKinds: unknown) {
  const normalized = kind.trim().toLowerCase();
  const kinds = normalizeFinalSideEffectKinds(allowedKinds);
  if (kinds.length === 0) {
    return true;
  }
  return kinds.includes(normalized);
}

function normalizeFinalSideEffectKinds(value: unknown): string[] {
  const rawValues = Array.isArray(value) ? value : [value];
  return rawValues
    .map((item) => valueText(item).trim().toLowerCase())
    .filter(Boolean);
}

function resolveMessageKindLabel(message: AgentMessage, hasOutput: boolean) {
  if (message.interaction && !message.interactionAnswered) {
    return "需要用户参与";
  }
  const output = message.output?.finalOutput;
  const kind = valueText(output?.kind || output?.type).toLowerCase();
  const action = valueText(output?.meta?.action).toLowerCase();
  if (kind === "tool_result" || action === "call_power") {
    return "工具结果";
  }
  if (hasOutput) {
    return "最终结果";
  }
  return "";
}

function normalizeAgentDisplayOutput(
  output: AgentOutput,
  fallbackText = "",
): AgentOutput {
  const next: AgentOutput = { ...output };
  delete next.reasoning;

  const actionProtocol = extractAgentActionPayload(
    valueText(next.text) || fallbackText,
  );
  if (actionProtocol) {
    return normalizeAgentActionDisplayOutput(
      next,
      actionProtocol.payload,
      actionProtocol.cleanText,
    );
  }

  const protocol = extractAgentResultPayload(
    valueText(next.text) || fallbackText,
  );
  if (protocol) {
    clearAgentResultOutputFields(next);
    const content = normalizeAgentContentRecord(protocol.payload.content);
    if (content) {
      copyAgentResultOutputFields(next, content);
    }
    copyAgentResultOutputFields(next, protocol.payload);
    const text = agentResultText(protocol.payload) || protocol.cleanText;
    if (text) {
      next.text = text;
    } else {
      delete next.text;
    }
    next.kind = normalizeAgentOutputKind(
      valueText(
        protocol.payload.kind ||
          protocol.payload.type ||
          protocol.payload.event,
      ),
    );
    next.suggestions = protocol.payload.suggestions;
    next.content = content || protocol.payload.content;
    next.tasks = protocol.payload.tasks || content?.tasks;
    return next;
  }

  const normalizedContent = normalizeAgentContentRecord(next.content);
  if (normalizedContent) {
    next.content = normalizedContent;
  }
  if (isPlainObject(next.content)) {
    copyAgentResultOutputFields(next, next.content);
  }
  if (!valueText(next.text)) {
    const text = agentResultText(next);
    if (text) {
      next.text = text;
    }
  }
  if (isGoMapTextDump(next.text)) {
    const text = readableGoMapTextDump(next.text);
    if (text) {
      next.text = text;
    } else {
      delete next.text;
    }
  }
  return next;
}

function normalizeAgentActionDisplayOutput(
  target: AgentOutput,
  payload: Record<string, unknown>,
  cleanText: string,
): AgentOutput {
  clearAgentResultOutputFields(target);
  const action = normalizeAgentActionType(payload);
  const power = valueText(payload.power || payload.name).trim();
  const tool = valueText(payload.tool || payload.name).trim();
  const title =
    action === "call_power"
      ? `能力调用：${power || "未指定能力"}`
      : `工具调用：${tool || "未指定工具"}`;
  const text =
    cleanText ||
    "智能体返回了调用指令，但本轮没有收到执行结果。请重新发送或重试。";
  target.event = "result_card";
  target.kind = "tool_result";
  target.title = title;
  target.text = text;
  target.result_mode = "artifact";
  target.result = {
    title,
    text,
  };
  target.meta = {
    ...(isPlainObject(target.meta) ? target.meta : {}),
    action,
    power,
    tool,
    input: payload.input || payload.params || payload.arguments,
  };
  if (action === "call_power") {
    target.tasks = [
      {
        id: actionTaskID(payload),
        title,
        kind: valueText(payload.kind || power).trim(),
        power,
        status: "pending",
        text: "等待能力执行结果",
        input: payload.input || payload.params || payload.arguments,
      },
    ];
  }
  return target;
}

function actionTaskID(payload: Record<string, unknown>) {
  const raw = valueText(
    payload.id || payload.task_id || payload.power || payload.name,
  )
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return raw ? `action-${raw}` : "action-call-power";
}

function clearAgentResultOutputFields(target: AgentOutput) {
  const mutableTarget = target as Record<string, unknown>;
  agentResultOutputKeys.forEach((key) => {
    delete mutableTarget[key];
  });
  delete mutableTarget.content;
}

function isNonResultOutput(output: AgentOutput) {
  const event = valueText(output.event).toLowerCase();
  if (["start", "progress", "status", "reasoning", "warning"].includes(event)) {
    return true;
  }
  if (isProtocolDraftText(valueText(output.text))) {
    return !hasAgentDisplayPayload(output);
  }
  return false;
}

function isProtocolDraftText(value: unknown) {
  const text = valueText(value).trim();
  if (!text) {
    return false;
  }
  if (
    text.includes("```agent-interaction") ||
    text.includes("```agent-action") ||
    text.includes("```agent-result") ||
    text.includes("```agent-output")
  ) {
    return true;
  }
  return false;
}

function extractAgentResultPayload(text: string):
  | {
      cleanText: string;
      payload: Record<string, unknown>;
    }
  | undefined {
  for (const lang of ["agent-result", "agent-output", "json"]) {
    const result = extractAgentResultPayloadByLang(text, lang);
    if (result) {
      return result;
    }
  }
  const payload = parseAgentResultPayload(text);
  if (payload) {
    return {
      cleanText: "",
      payload,
    };
  }
  return undefined;
}

function extractAgentActionPayload(text: string):
  | {
      cleanText: string;
      payload: Record<string, unknown>;
    }
  | undefined {
  const result = extractAgentActionPayloadByLang(text, "agent-action");
  if (result) {
    return result;
  }
  const payload = parseAgentActionPayload(text);
  return payload ? { cleanText: "", payload } : undefined;
}

function extractAgentActionPayloadByLang(
  text: string,
  lang: string,
):
  | {
      cleanText: string;
      payload: Record<string, unknown>;
    }
  | undefined {
  const open = `\`\`\`${lang}`;
  const start = text.indexOf(open);
  if (start < 0) {
    return undefined;
  }

  let bodyStart = start + open.length;
  while (bodyStart < text.length && isFenceWhitespace(text[bodyStart])) {
    bodyStart += 1;
  }

  const end = text.indexOf("```", bodyStart);
  const body = end < 0 ? text.slice(bodyStart) : text.slice(bodyStart, end);
  const payload = parseAgentActionPayload(body);
  if (!payload) {
    return undefined;
  }
  const cleanText =
    end < 0
      ? text.slice(0, start).trim()
      : `${text.slice(0, start)}${text.slice(end + 3)}`.trim();
  return {
    cleanText,
    payload,
  };
}

function parseAgentActionPayload(value: string) {
  const text = value.trim();
  const repaired = repairJSONControlChars(text);
  const unescaped = unescapeEscapedProtocolJSONQuotes(repaired);
  const sources = [text, repaired, unescaped];
  for (const source of sources) {
    if (!source.trim()) {
      continue;
    }
    try {
      const parsed = JSON.parse(source);
      if (isAgentActionPayload(parsed)) {
        return parsed;
      }
    } catch {
      // Try the next repaired variant.
    }
  }
  return undefined;
}

function unescapeEscapedProtocolJSONQuotes(value: string) {
  const text = value.trim();
  if (!text.includes('\\"')) {
    return value;
  }
  if (!text.startsWith("{") && !text.startsWith("[")) {
    return value;
  }
  return value.replace(/\\"/g, '"');
}

function extractAgentResultPayloadByLang(
  text: string,
  lang: string,
):
  | {
      cleanText: string;
      payload: Record<string, unknown>;
    }
  | undefined {
  const open = `\`\`\`${lang}`;
  const start = text.indexOf(open);
  if (start < 0) {
    return undefined;
  }

  let bodyStart = start + open.length;
  while (bodyStart < text.length && isFenceWhitespace(text[bodyStart])) {
    bodyStart += 1;
  }

  let searchStart = bodyStart;
  while (searchStart < text.length) {
    const end = text.indexOf("```", searchStart);
    if (end < 0) {
      return undefined;
    }

    const payload = parseAgentResultPayload(text.slice(bodyStart, end));
    if (payload) {
      return {
        cleanText: `${text.slice(0, start)}${text.slice(end + 3)}`.trim(),
        payload,
      };
    }
    searchStart = end + 3;
  }

  return undefined;
}

function parseAgentResultPayload(value: string) {
  const text = value.trim();
  const repaired = repairJSONControlChars(text);
  const sources = repaired === text ? [text] : [text, repaired];
  for (const source of sources) {
    const payload = parseAgentResultJSON(source);
    if (payload) {
      return payload;
    }
  }
  return undefined;
}

function parseAgentResultJSON(value: string) {
  try {
    const parsed = JSON.parse(value);
    return isAgentResultPayload(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function repairJSONControlChars(value: string) {
  let result = "";
  let inString = false;
  let escaped = false;
  for (const char of value) {
    if (escaped) {
      result += char;
      escaped = false;
      continue;
    }
    if (char === "\\") {
      result += char;
      escaped = inString;
      continue;
    }
    if (char === '"') {
      inString = !inString;
      result += char;
      continue;
    }
    if (inString && isJSONControlChar(char)) {
      result += escapeJSONControlChar(char);
      continue;
    }
    result += char;
  }
  return result;
}

function isJSONControlChar(value: string) {
  return value.length > 0 && value.charCodeAt(0) < 32;
}

function escapeJSONControlChar(value: string) {
  switch (value) {
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "\t":
      return "\\t";
    default:
      return `\\u${value.charCodeAt(0).toString(16).padStart(4, "0")}`;
  }
}

function isFenceWhitespace(value: string) {
  return value === " " || value === "\t" || value === "\r" || value === "\n";
}

function isAgentResultPayload(
  value: unknown,
): value is Record<string, unknown> {
  if (!isPlainObject(value)) {
    return false;
  }
  if (isAgentActionPayload(value)) {
    return false;
  }
  const kind = normalizeAgentOutputKind(
    valueText(value.kind || value.type || value.event),
  );
  return (
    kind === "final_result" ||
    kind === "tool_result" ||
    "content" in value ||
    "tasks" in value ||
    "suggestions" in value ||
    hasAgentResultOutputField(value) ||
    (isPlainObject(value.content) && hasAgentResultOutputField(value.content))
  );
}

function isAgentActionPayload(
  value: unknown,
): value is Record<string, unknown> {
  if (!isPlainObject(value)) {
    return false;
  }
  const action = normalizeAgentActionType(value);
  if (!action) {
    return false;
  }
  if (action === "call_power") {
    return Boolean(valueText(value.power || value.name).trim());
  }
  return Boolean(valueText(value.tool || value.name).trim());
}

function normalizeAgentActionType(value: Record<string, unknown>) {
  const action = valueText(value.type || value.action)
    .toLowerCase()
    .trim();
  if (action === "power") {
    return "call_power";
  }
  if (action === "tool") {
    return "call_tool";
  }
  if (action === "call_power" || action === "call_tool") {
    return action;
  }
  return "";
}

function normalizeAgentOutputKind(value: string) {
  const kind = value.toLowerCase().trim();
  if (["tool", "tool_result", "call_power", "power_result"].includes(kind)) {
    return "tool_result";
  }
  if (["final", "result", "final_result", "answer"].includes(kind)) {
    return "final_result";
  }
  return kind || "final_result";
}

function agentResultText(value: unknown): string {
  if (!isPlainObject(value)) {
    return typeof value === "string" ? valueText(value) : "";
  }
  if (valueText(value.text)) {
    return valueText(value.text);
  }
  const content = value.content;
  if (!isPlainObject(content)) {
    return typeof content === "string" ? valueText(content) : "";
  }
  return valueText(content.text);
}

function normalizeAgentContentRecord(
  value: unknown,
): Record<string, unknown> | null {
  if (isPlainObject(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    return {
      format: "markdown",
      text: value.trim(),
    };
  }
  const text = agentContentMarkdown(value);
  if (!text) {
    return null;
  }
  return {
    format: "markdown",
    text,
  };
}

function agentContentMarkdown(value: unknown): string {
  const nodes = normalizeAgentContentNodes(value);
  if (nodes.length === 0) {
    return "";
  }
  return contentNodesText(nodes);
}

function normalizeAgentContentNodes(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.flatMap((item) => {
    if (typeof item === "string" && item.trim()) {
      return [paragraphNode(item.trim())];
    }
    if (!isPlainObject(item)) {
      return [];
    }
    const type = valueText(item.type);
    if (type === "text") {
      const text = valueText(item.text).trim();
      return text ? [paragraphNode(text)] : [];
    }
    return [item];
  });
}

function paragraphNode(text: string): Record<string, unknown> {
  return {
    type: "paragraph",
    content: [{ type: "text", text }],
  };
}

function contentNodesText(nodes: Record<string, unknown>[]) {
  const values: string[] = [];
  nodes.forEach((node) => collectContentNodeText(node, values));
  return values.join("\n\n").trim();
}

function collectContentNodeText(value: unknown, values: string[]) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectContentNodeText(item, values));
    return;
  }
  if (!isPlainObject(value)) {
    return;
  }
  if (valueText(value.type) === "text") {
    const text = valueText(value.text).trim();
    if (text) {
      values.push(text);
    }
    return;
  }
  collectContentNodeText(value.content, values);
}

function isGoMapTextDump(value: unknown) {
  const text = valueText(value).trim();
  return /^\[?map\[/.test(text) && text.includes("type:text");
}

function readableGoMapTextDump(value: unknown) {
  const text = valueText(value).trim();
  const matches = [
    ...text.matchAll(/map\[[^\]]*?text:([^\]]*?)(?:\s+type:text|\])/g),
  ];
  return matches
    .map((match) => match[1]?.trim() || "")
    .filter(Boolean)
    .join("\n\n");
}

function copyAgentResultOutputFields(
  target: AgentOutput,
  source: Record<string, unknown>,
) {
  const mutableTarget = target as Record<string, unknown>;
  agentResultOutputKeys.forEach((key) => {
    const value = source[key];
    if (!hasAgentResultValue(value)) {
      return;
    }
    mutableTarget[key] = value;
  });
  if (!hasAgentResultValue(target.rich) && isPlainObject(source.value)) {
    target.rich = source.value;
  }
}

function hasAgentResultOutputField(source: Record<string, unknown>) {
  return (
    agentResultOutputKeys.some((key) => hasAgentResultValue(source[key])) ||
    isPlainObject(source.value)
  );
}

function hasAgentDisplayPayload(output: AgentOutput) {
  const content = isPlainObject(output.content) ? output.content : null;
  return (
    hasAgentResultOutputField(output as Record<string, unknown>) ||
    hasAgentResultValue(output.error) ||
    (content != null &&
      (hasAgentResultOutputField(content) || hasAgentResultValue(content.text)))
  );
}

function hasAgentResultValue(value: unknown) {
  if (value == null) {
    return false;
  }
  if (typeof value === "string") {
    return value.trim().length > 0;
  }
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (isPlainObject(value)) {
    return Object.keys(value).length > 0;
  }
  return true;
}

function normalizeAgentSuggestions(value: unknown): AgentSuggestion[] {
  const values = Array.isArray(value) ? value : value == null ? [] : [value];
  return values
    .map(normalizeAgentSuggestion)
    .filter((suggestion): suggestion is AgentSuggestion => suggestion != null)
    .slice(0, 5);
}

function normalizeAgentSuggestion(value: unknown): AgentSuggestion | null {
  if (!isPlainObject(value)) {
    const text = valueText(value).trim();
    return text ? { label: text, prompt: text } : null;
  }
  const prompt = valueText(
    value.prompt || value.text || value.value || value.input,
  ).trim();
  const label = valueText(
    value.label || value.name || value.title || prompt,
  ).trim();
  if (!label || !prompt) {
    return null;
  }
  return { label, prompt };
}

function AgentInteractionDialog({
  open,
  interaction,
  paramApi,
  readonly,
  initialData,
  disabled,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  interaction?: AgentInteraction;
  paramApi: string;
  readonly?: boolean;
  initialData?: Record<string, unknown>;
  disabled?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (result: AgentInteractionSubmitResult) => void;
}) {
  if (!interaction) {
    return null;
  }
  const title = valueText(interaction.title) || "补充交互信息";
  const description =
    valueText(interaction.description) ||
    (readonly
      ? "已提交的交互信息，只读查看。"
      : "填写这些参数后，智能体会继续执行当前任务。");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-assistant-layer="true"
        layerClassName={ASSISTANT_DIALOG_LAYER_CLASS}
        layerZIndex={ASSISTANT_DIALOG_LAYER_Z_INDEX}
        className="flex max-h-[86vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl"
      >
        <DialogHeader className="border-b px-5 py-4 text-start">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="min-h-0 overflow-hidden">
          <AgentInteractionPanel
            interaction={interaction}
            paramApi={paramApi}
            readonly={readonly}
            initialData={initialData}
            disabled={disabled}
            layout="dialog"
            hideHeader
            onSubmit={readonly ? undefined : onSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}

function hasContentViewOutput(value: unknown): boolean {
  if (value == null || value === "") {
    return false;
  }
  if (Array.isArray(value)) {
    return value.some(hasContentViewOutput);
  }
  if (isPlainObject(value)) {
    return Object.keys(value).length > 0;
  }
  return true;
}

function normalizeFrameInteraction(
  value: unknown,
): AgentInteraction | undefined {
  if (!isPlainObject(value)) {
    return undefined;
  }
  const type = valueText(value.type);
  if (!type) {
    return undefined;
  }
  return value as AgentInteraction;
}

function normalizeOutputInteraction(
  output: unknown,
): AgentInteraction | undefined {
  if (!isPlainObject(output)) {
    return undefined;
  }
  return (
    normalizeFrameInteraction(output.interaction) ||
    (isPlainObject(output.content)
      ? normalizeFrameInteraction(output.content.interaction)
      : undefined)
  );
}
