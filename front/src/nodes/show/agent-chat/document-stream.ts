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

    const documentsToSync = new Map<number, AgentChatDocument>();
    for (const message of messages) {
      if (message.document && needsAgentChatDocumentSync(message.document)) {
        documentsToSync.set(message.document.id, message.document);
      }
    }

    for (const [documentID, watch] of watches) {
      const document = documentsToSync.get(documentID);
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
  const publish = (document: AgentChatDocument | undefined) => {
    if (!document || watch.controller.signal.aborted) {
      return;
    }
    watch.document = document;
    updateDocument(watch.sessionID, documentID, document);
  };

  try {
    while (!watch.controller.signal.aborted) {
      try {
        const snapshot = await loadAgentChatDocument(
          runtimeApi.document,
          documentID,
        );
        publish(mergeAgentChatDocument(watch.document, snapshot));
        if (!isAgentChatDocumentPending(watch.document)) {
          return;
        }

        await watchRuntimeStream<Record<string, unknown>>({
          streamApi: runtimeApi.documentStream,
          requestID: `document:${documentID}`,
          blockMs,
          signal: watch.controller.signal,
          stopOnResult: false,
          recoverOnError: true,
          fallbackToPoll: false,
          onFrame: (frame) => {
            const output = documentFrameOutput(frame);
            publish(mergeAgentChatDocumentEvent(watch.document, output));
            return isAgentChatDocumentPending(watch.document)
              ? undefined
              : false;
          },
        });
        if (watch.controller.signal.aborted) {
          return;
        }
        publish(await loadAgentChatDocument(runtimeApi.document, documentID));
        if (!isAgentChatDocumentPending(watch.document)) {
          return;
        }
      } catch {
        if (watch.controller.signal.aborted) {
          return;
        }
      }
      await waitForDocumentRetry(watch.controller.signal);
    }
  } finally {
    if (watches.get(documentID) === watch) {
      watches.delete(documentID);
    }
  }
}

function waitForDocumentRetry(signal: AbortSignal) {
  return new Promise<void>((resolve) => {
    if (signal.aborted) {
      resolve();
      return;
    }
    const timer = window.setTimeout(done, 1000);
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

function abortDocumentWatches(watches: Map<number, DocumentWatch>) {
  for (const watch of watches.values()) {
    watch.controller.abort();
  }
  watches.clear();
}
