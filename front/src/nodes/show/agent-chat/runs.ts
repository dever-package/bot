import { useCallback, useEffect, useRef, useState } from "react";
import {
  runRuntimeStream,
  stopRuntimeStream,
  watchRuntimeStream,
} from "@/lib/runtime-stream-runner";
import { runtimeErrorMessage } from "@/lib/runtime-stream-output";
import {
  streamValueText as valueText,
  type RuntimeStreamFrame,
} from "@/lib/stream";
import {
  isFinishedAgentChatRunStatus,
  loadAgentChatRunStatus,
  readAgentChatRunFrame,
  type AgentChatRunStatus,
} from "./runtime";
import { createStreamTextBuffer, type StreamTextBuffer } from "./stream";
import type {
  AgentChatRuntimeApis,
  ChatMessage,
  ChatStreamOutput,
} from "./types";

type SessionRun = {
  sessionID: number;
  requestID: string;
  userMessageID: string;
  assistantMessageID: string;
  input: string;
  buffer: StreamTextBuffer;
  lastStreamID: string;
  cancelable: boolean;
  stopping: boolean;
  stopped: boolean;
  detached: boolean;
  replayPending: boolean;
  controller: AbortController;
};

type SessionRunSnapshot = {
  requestID: string;
  cancelable: boolean;
  stopping: boolean;
};

type SessionRunSnapshots = Record<number, SessionRunSnapshot>;

type RunManagerOptions = {
  agentKey: string;
  contextKey: string;
  modalOpen: boolean;
  sessionLoading: boolean;
  sessionID: number;
  messages: ChatMessage[];
  blockMs: number;
  runtimeApi: AgentChatRuntimeApis;
  getActiveSessionID: () => number;
  getSessionTitle: (sessionID: number) => string;
  updateSessionMessages: (
    sessionID: number,
    update: (messages: ChatMessage[]) => ChatMessage[],
  ) => void;
  updateSessionTitle: (sessionID: number, title: string) => void;
  syncSessionTitle: (sessionID: number) => Promise<void>;
  setSessionRunning: (sessionID: number, running: boolean) => void;
  setError: (message: string) => void;
};

export function useAgentChatRuns({
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
}: RunManagerOptions) {
  const [snapshots, setSnapshots] = useState<SessionRunSnapshots>({});
  const runsRef = useRef(new Map<number, SessionRun>());

  const publish = useCallback(
    (run: SessionRun) => {
      if (run.detached) {
        return;
      }
      setSnapshots((current) => ({
        ...current,
        [run.sessionID]: {
          requestID: run.requestID,
          cancelable: run.cancelable,
          stopping: run.stopping,
        },
      }));
      setSessionRunning(run.sessionID, true);
    },
    [setSessionRunning],
  );

  const register = useCallback(
    (run: SessionRun) => {
      const existing = runsRef.current.get(run.sessionID);
      if (existing && existing !== run) {
        return false;
      }
      runsRef.current.set(run.sessionID, run);
      publish(run);
      return true;
    },
    [publish],
  );

  const remove = useCallback(
    (run: SessionRun) => {
      if (runsRef.current.get(run.sessionID) !== run) {
        return;
      }
      run.buffer.dispose();
      runsRef.current.delete(run.sessionID);
      setSnapshots((current) => {
        const next = { ...current };
        delete next[run.sessionID];
        return next;
      });
      setSessionRunning(run.sessionID, false);
    },
    [setSessionRunning],
  );

  const updateRunMessage = useCallback(
    (run: SessionRun, patch: Partial<ChatMessage>) => {
      if (run.detached) {
        return;
      }
      updateSessionMessages(run.sessionID, (current) =>
        current.map((message) =>
          isRunMessage(message, run) ? { ...message, ...patch } : message,
        ),
      );
    },
    [updateSessionMessages],
  );

  const finish = useCallback(
    (
      run: SessionRun,
      result: { text: string; error?: boolean; requestID?: string },
    ) => {
      if (runsRef.current.get(run.sessionID) !== run) {
        return;
      }
      run.buffer.flush();
      updateRunMessage(run, {
        text: result.text,
        requestID: result.requestID || run.requestID || undefined,
        running: false,
        error: Boolean(result.error),
      });
      remove(run);
      void syncSessionTitle(run.sessionID);
    },
    [remove, syncSessionTitle, updateRunMessage],
  );

  const applyFrame = useCallback(
    (run: SessionRun, frame: RuntimeStreamFrame<ChatStreamOutput>) => {
      if (run.detached || runsRef.current.get(run.sessionID) !== run) {
        return false;
      }
      const next = readAgentChatRunFrame(frame);
      if (next.requestID && !run.requestID) {
        run.requestID = next.requestID;
      }
      if (next.streamID) {
        run.lastStreamID = next.streamID;
      }
      if (next.cancelable != null && next.cancelable !== run.cancelable) {
        run.cancelable = next.cancelable;
        publish(run);
      }
      if (next.delta) {
        if (run.replayPending) {
          run.replayPending = false;
          run.buffer.reset();
        }
        run.buffer.append(next.delta);
      }
      if (!next.finished) {
        return true;
      }
      finish(run, {
        text:
          next.finalText.trim() ||
          run.buffer.text.trim() ||
          next.error.trim() ||
          "智能体已返回结果。",
        error: next.failed,
        requestID: next.requestID,
      });
      return false;
    },
    [finish, publish],
  );

  const createRun = useCallback(
    (input: {
      sessionID: number;
      requestID?: string;
      userMessageID: string;
      assistantMessageID: string;
      text?: string;
      prompt?: string;
      replayPending?: boolean;
    }) => {
      let run: SessionRun;
      const buffer = createStreamTextBuffer(input.text || "", (text) => {
        updateRunMessage(run, {
          text,
          requestID: run.requestID || undefined,
          running: true,
          error: false,
        });
      });
      run = {
        sessionID: input.sessionID,
        requestID: input.requestID || "",
        userMessageID: input.userMessageID,
        assistantMessageID: input.assistantMessageID,
        input: input.prompt || "",
        buffer,
        lastStreamID: "0-0",
        cancelable: false,
        stopping: false,
        stopped: false,
        detached: false,
        replayPending: Boolean(input.replayPending),
        controller: new AbortController(),
      };
      return run;
    },
    [updateRunMessage],
  );

  const finishFromStatus = useCallback(
    (run: SessionRun, status: AgentChatRunStatus) => {
      if (!isFinishedAgentChatRunStatus(status.status)) {
        return false;
      }
      const failed = status.status === "fail";
      const canceled = status.status === "canceled";
      const fallbackText = canceled
        ? "已停止生成"
        : failed
          ? "智能体运行失败。"
          : "智能体已返回结果。";
      const finalText =
        status.text.trim() ||
        run.buffer.text.trim() ||
        status.error.trim() ||
        fallbackText;
      finish(run, {
        text: finalText,
        error: failed,
        requestID: status.requestID,
      });
      if (failed && getActiveSessionID() === run.sessionID) {
        setError(status.error.trim() || finalText);
      }
      return true;
    },
    [finish, getActiveSessionID, setError],
  );

  const recover = useCallback(
    async (activeSessionID: number, assistantMessage: ChatMessage) => {
      const requestID = assistantMessage.requestID || "";
      if (
        !requestID ||
        !activeSessionID ||
        runsRef.current.has(activeSessionID)
      ) {
        return;
      }
      const run = createRun({
        sessionID: activeSessionID,
        requestID,
        userMessageID: "",
        assistantMessageID: assistantMessage.id,
        text: assistantMessage.text,
        replayPending: Boolean(assistantMessage.text),
      });
      if (!register(run)) {
        run.buffer.dispose();
        return;
      }
      try {
        const status = await loadAgentChatRunStatus(
          runtimeApi.status,
          requestID,
        );
        if (run.detached || runsRef.current.get(activeSessionID) !== run) {
          return;
        }
        if (finishFromStatus(run, status)) {
          return;
        }
        await watchRuntimeStream<ChatStreamOutput>({
          streamApi: runtimeApi.stream,
          requestID,
          lastID: run.lastStreamID,
          blockMs,
          signal: run.controller.signal,
          stopOnResult: true,
          recoverOnError: true,
          fallbackToPoll: false,
          onFrame: (frame) => (applyFrame(run, frame) ? undefined : false),
        });
        if (
          run.detached ||
          run.controller.signal.aborted ||
          runsRef.current.get(activeSessionID) !== run
        ) {
          return;
        }
        const finalStatus = await loadAgentChatRunStatus(
          runtimeApi.status,
          requestID,
        );
        finishFromStatus(run, finalStatus);
      } catch (currentError: unknown) {
        if (
          run.detached ||
          run.controller.signal.aborted ||
          runsRef.current.get(activeSessionID) !== run
        ) {
          return;
        }
        const message = runtimeErrorMessage(
          currentError,
          "恢复智能体运行失败。",
        );
        finish(run, {
          text: run.buffer.text.trim() || message,
          error: true,
          requestID,
        });
        if (getActiveSessionID() === activeSessionID) {
          setError(message);
        }
      }
    },
    [
      applyFrame,
      blockMs,
      createRun,
      finish,
      finishFromStatus,
      getActiveSessionID,
      register,
      runtimeApi.status,
      runtimeApi.stream,
      setError,
    ],
  );

  useEffect(() => {
    if (!modalOpen || sessionLoading || !sessionID) {
      return;
    }
    const pendingMessage = messages.find(
      (message) =>
        message.role === "assistant" &&
        message.running &&
        Boolean(message.requestID),
    );
    if (pendingMessage) {
      void recover(sessionID, pendingMessage);
    }
  }, [messages, modalOpen, recover, sessionID, sessionLoading]);

  const send = useCallback(
    async (rawText: string) => {
      const text = rawText.trim();
      const activeSessionID = getActiveSessionID();
      if (
        !text ||
        !agentKey ||
        !activeSessionID ||
        runsRef.current.has(activeSessionID)
      ) {
        return;
      }
      const now = Date.now();
      const userMessage: ChatMessage = {
        id: `${activeSessionID}-user-${now}`,
        role: "user",
        text,
      };
      const assistantMessageID = `${activeSessionID}-assistant-${now}`;
      const run = createRun({
        sessionID: activeSessionID,
        userMessageID: userMessage.id,
        assistantMessageID,
        prompt: text,
      });
      if (!register(run)) {
        run.buffer.dispose();
        return;
      }
      updateSessionTitle(
        activeSessionID,
        resolveSessionTitle(getSessionTitle(activeSessionID), text),
      );
      updateSessionMessages(activeSessionID, (current) => [
        ...current,
        userMessage,
        {
          id: assistantMessageID,
          role: "assistant",
          text: "",
          running: true,
        },
      ]);
      setError("");
      try {
        const result = await runRuntimeStream<ChatStreamOutput>({
          requestApi: runtimeApi.request,
          streamApi: runtimeApi.stream,
          stopApi: runtimeApi.stop,
          stopOnAbort: false,
          fallbackToPoll: false,
          blockMs,
          signal: run.controller.signal,
          body: {
            agent: agentKey,
            session_id: activeSessionID,
            context_key: contextKey,
            input: text,
          },
          onRequestID: (requestID) => {
            if (run.detached) {
              return;
            }
            run.requestID = requestID;
            publish(run);
            updateRunMessage(run, { requestID });
          },
          onFrame: (frame) => {
            applyFrame(run, frame);
          },
        });
        if (
          run.detached ||
          run.stopped ||
          runsRef.current.get(activeSessionID) !== run
        ) {
          return;
        }
        const finalText = valueText(
          result.finalOutput?.text || result.textOutput || run.buffer.text,
        ).trim();
        if (!finalText) {
          throw new Error("模型未返回可展示内容。");
        }
        finish(run, { text: finalText, requestID: result.requestID });
      } catch (currentError: unknown) {
        if (
          run.detached ||
          run.stopped ||
          runsRef.current.get(activeSessionID) !== run
        ) {
          return;
        }
        const message = runtimeErrorMessage(currentError, "智能体运行失败。");
        finish(run, {
          text: run.buffer.text.trim() || message,
          error: true,
          requestID: run.requestID,
        });
        if (getActiveSessionID() === activeSessionID) {
          setError(message);
        }
      }
    },
    [
      agentKey,
      applyFrame,
      blockMs,
      contextKey,
      createRun,
      finish,
      getActiveSessionID,
      getSessionTitle,
      publish,
      register,
      runtimeApi.request,
      runtimeApi.stop,
      runtimeApi.stream,
      setError,
      updateRunMessage,
      updateSessionMessages,
      updateSessionTitle,
    ],
  );

  const stop = useCallback(async () => {
    const activeSessionID = getActiveSessionID();
    const run = runsRef.current.get(activeSessionID);
    if (!run?.requestID || !run.cancelable || run.stopping) {
      return;
    }
    run.stopping = true;
    publish(run);
    setError("");
    try {
      await stopRuntimeStream(run.requestID, runtimeApi.stop);
      if (runsRef.current.get(activeSessionID) !== run) {
        return;
      }
      run.stopped = true;
      run.controller.abort();
      finish(run, {
        text: run.buffer.text.trim() || "已停止生成",
        requestID: run.requestID,
      });
    } catch (currentError: unknown) {
      if (runsRef.current.get(activeSessionID) !== run) {
        return;
      }
      run.stopping = false;
      publish(run);
      if (getActiveSessionID() === activeSessionID) {
        setError(runtimeErrorMessage(currentError, "停止生成失败。"));
      }
    }
  }, [finish, getActiveSessionID, publish, runtimeApi.stop, setError]);

  const hasRun = useCallback(
    (targetSessionID: number) => runsRef.current.has(targetSessionID),
    [],
  );
  const mergeMessages = useCallback(
    (targetSessionID: number, targetMessages: ChatMessage[]) =>
      mergeRunMessages(targetMessages, runsRef.current.get(targetSessionID)),
    [],
  );
  const reset = useCallback(() => {
    for (const run of runsRef.current.values()) {
      run.detached = true;
      run.buffer.dispose();
      run.controller.abort();
      setSessionRunning(run.sessionID, false);
    }
    runsRef.current.clear();
    setSnapshots({});
  }, [setSessionRunning]);

  useEffect(() => {
    return () => {
      for (const run of runsRef.current.values()) {
        run.detached = true;
        run.buffer.dispose();
        run.controller.abort();
      }
      runsRef.current.clear();
    };
  }, []);

  const current = snapshots[sessionID];
  return {
    running: Boolean(
      current ||
      messages.some(
        (message) => message.role === "assistant" && message.running,
      ),
    ),
    stopping: Boolean(current?.stopping),
    cancelable: Boolean(current?.cancelable),
    hasRun,
    mergeMessages,
    reset,
    send,
    stop,
  };
}

function isRunMessage(message: ChatMessage, run: SessionRun) {
  return (
    message.id === run.assistantMessageID ||
    Boolean(run.requestID && message.requestID === run.requestID)
  );
}

function mergeRunMessages(messages: ChatMessage[], run?: SessionRun) {
  if (!run) {
    return messages;
  }
  let found = false;
  const merged = messages.map((message) => {
    if (!isRunMessage(message, run)) {
      return message;
    }
    found = true;
    return {
      ...message,
      requestID: run.requestID || message.requestID,
      text: run.buffer.text || message.text,
      running: true,
      error: false,
    };
  });
  if (found) {
    return merged;
  }
  return [
    ...merged,
    ...(run.input
      ? [
          {
            id: run.userMessageID,
            role: "user" as const,
            text: run.input,
          },
        ]
      : []),
    {
      id: run.assistantMessageID,
      role: "assistant" as const,
      text: run.buffer.text,
      requestID: run.requestID || undefined,
      running: true,
      error: false,
    },
  ];
}

function resolveSessionTitle(currentTitle: string, message: string) {
  if (currentTitle.trim() && currentTitle.trim() !== "新会话") {
    return currentTitle;
  }
  const title = Array.from(message.trim().replace(/\s+/g, " "))
    .slice(0, 40)
    .join("");
  return title || "新会话";
}
