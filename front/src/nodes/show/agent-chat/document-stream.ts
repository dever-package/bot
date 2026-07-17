import { useEffect, useRef } from "react";
import { watchRuntimeStream } from "@/lib/runtime-stream-runner";
import { normalizeRuntimeFrameOutput } from "@/lib/runtime-stream-output";
import type { RuntimeStreamFrame } from "@/lib/stream";
import { loadAgentChatDocument } from "./api";
import {
  isAgentChatDocumentPending,
  mergeAgentChatDocument,
  mergeAgentChatDocumentEvent,
  needsAgentChatDocumentSync,
  type AgentChatDocument,
} from "./document";
import type { AgentChatRuntimeApis, ChatMessage } from "./types";

type DocumentWatch = {
  sessionID: number;
  controller: AbortController;
  document: AgentChatDocument;
};

type DocumentStreamOptions = {
  modalOpen: boolean;
  sessionID: number;
  messages: ChatMessage[];
  blockMs: number;
  runtimeApi: AgentChatRuntimeApis;
  updateDocument: (
    sessionID: number,
    documentID: number,
    document: AgentChatDocument,
  ) => void;
};

export function useAgentChatDocumentStreams({
  modalOpen,
  sessionID,
  messages,
  blockMs,
  runtimeApi,
  updateDocument,
}: DocumentStreamOptions) {
  const watchesRef = useRef(new Map<number, DocumentWatch>());

  useEffect(() => {
    const watches = watchesRef.current;
    if (!modalOpen || !sessionID) {
      abortDocumentWatches(watches);
      return;
    }

    const documents = new Map<number, AgentChatDocument>();
    const documentsToSync = new Map<number, AgentChatDocument>();
    for (const message of messages) {
      if (!message.document) {
        continue;
      }
      documents.set(message.document.id, message.document);
      if (needsAgentChatDocumentSync(message.document)) {
        documentsToSync.set(message.document.id, message.document);
      }
    }

    for (const [documentID, watch] of watches) {
      const document = documents.get(documentID);
      if (!document || watch.sessionID !== sessionID) {
        watch.controller.abort();
        watches.delete(documentID);
        continue;
      }
      watch.document = mergeAgentChatDocument(watch.document, document) || document;
    }

    for (const document of documentsToSync.values()) {
      if (watches.has(document.id)) {
        continue;
      }
      const watch: DocumentWatch = {
        sessionID,
        controller: new AbortController(),
        document,
      };
      watches.set(document.id, watch);
      void watchDocument({
        watch,
        watches,
        blockMs,
        runtimeApi,
        updateDocument,
      });
    }
  }, [blockMs, messages, modalOpen, runtimeApi, sessionID, updateDocument]);

  useEffect(() => {
    const watches = watchesRef.current;
    return () => abortDocumentWatches(watches);
  }, []);
}

async function watchDocument(input: {
  watch: DocumentWatch;
  watches: Map<number, DocumentWatch>;
  blockMs: number;
  runtimeApi: AgentChatRuntimeApis;
  updateDocument: DocumentStreamOptions["updateDocument"];
}) {
  const { watch, watches, blockMs, runtimeApi, updateDocument } = input;
  const documentID = watch.document.id;
  let streamController: AbortController | null = null;
  let lastStreamEventAt = 0;
  let snapshotAttempt = 0;
  const publish = (document: AgentChatDocument | undefined) => {
    if (!document || watch.controller.signal.aborted) {
      return;
    }
    watch.document = document;
    updateDocument(watch.sessionID, documentID, document);
  };
  const syncSnapshot = async () => {
    const snapshot = await loadAgentChatDocument(
      runtimeApi.document,
      documentID,
    );
    publish(mergeAgentChatDocument(watch.document, snapshot));
    return snapshot;
  };
  const startEventStream = () => {
    if (streamController || watch.controller.signal.aborted) {
      return;
    }
    const controller = new AbortController();
    const abort = () => controller.abort();
    streamController = controller;
    lastStreamEventAt = Date.now();
    watch.controller.signal.addEventListener("abort", abort, { once: true });
    void watchRuntimeStream<Record<string, unknown>>({
      streamApi: runtimeApi.documentStream,
      requestID: `document:${documentID}`,
      blockMs,
      signal: controller.signal,
      stopOnResult: false,
      recoverOnError: true,
      fallbackToPoll: false,
      onFrame: (frame) => {
        lastStreamEventAt = Date.now();
        const output = documentFrameOutput(frame);
        publish(mergeAgentChatDocumentEvent(watch.document, output));
        if (documentEventName(output) === "document_complete") {
          void syncSnapshot().catch(() => undefined);
        }
      },
    })
      .catch(() => undefined)
      .finally(() => {
        watch.controller.signal.removeEventListener("abort", abort);
        if (streamController === controller) {
          streamController = null;
        }
      });
  };

  try {
    try {
      const initial = await syncSnapshot();
      if (!isAgentChatDocumentPending(initial)) {
        return;
      }
    } catch {
      if (watch.controller.signal.aborted) {
        return;
      }
      snapshotAttempt = 1;
    }
    startEventStream();
    while (!watch.controller.signal.aborted) {
      await waitForDocumentRetry(
        watch.controller.signal,
        documentSnapshotDelay(snapshotAttempt),
      );
      if (watch.controller.signal.aborted) {
        return;
      }
      const streamFresh =
        streamController !== null &&
        Date.now() - lastStreamEventAt < Math.max(6000, blockMs * 3);
      if (streamFresh) {
        continue;
      }
      try {
        const snapshot = await syncSnapshot();
        // Stream events only carry incremental fields. A complete document
        // snapshot is the source of truth for terminal state and media URLs.
        if (!isAgentChatDocumentPending(snapshot)) {
          return;
        }
        snapshotAttempt = Math.min(snapshotAttempt + 1, 3);
        startEventStream();
      } catch {
        if (watch.controller.signal.aborted) {
          return;
        }
        snapshotAttempt = Math.min(snapshotAttempt + 1, 3);
      }
    }
  } finally {
    streamController?.abort();
    if (watches.get(documentID) === watch) {
      watches.delete(documentID);
    }
  }
}

function documentSnapshotDelay(attempt: number) {
  const delays = [2000, 4000, 8000, 12000] as const;
  return delays[Math.min(attempt, delays.length - 1)] ?? delays[delays.length - 1];
}

function waitForDocumentRetry(signal: AbortSignal, delay: number) {
  return new Promise<void>((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }
    const timer = window.setTimeout(done, delay);
    signal.addEventListener("abort", done, { once: true });
    function done() {
      window.clearTimeout(timer);
      signal.removeEventListener("abort", done);
      resolve();
    }
  });
}

function documentFrameOutput(
  frame: RuntimeStreamFrame<Record<string, unknown>>,
) {
  return normalizeRuntimeFrameOutput(frame.output, frame);
}

function documentEventName(output: Record<string, unknown>) {
  return String(output.event || output.semantic_event || "")
    .trim()
    .toLowerCase();
}

function abortDocumentWatches(watches: Map<number, DocumentWatch>) {
  for (const watch of watches.values()) {
    watch.controller.abort();
  }
  watches.clear();
}
