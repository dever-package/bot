import { useEffect } from "react";
import { readAgentChatArtifacts } from "./artifact";
import type { ChatMessage } from "./types";

const artifactSyncDelays = [800, 1500, 3000, 5000, 8000] as const;

type ArtifactSyncOptions = {
  modalOpen: boolean;
  sessionID: number;
  messages: ChatMessage[];
  refreshSession: (sessionID: number) => Promise<void>;
};

export function useAgentChatArtifactSync({
  modalOpen,
  sessionID,
  messages,
  refreshSession,
}: ArtifactSyncOptions) {
  const pendingKey = pendingArtifactKey(messages);

  useEffect(() => {
    if (!modalOpen || !sessionID || !pendingKey) {
      return;
    }
    const controller = new AbortController();
    void syncPendingArtifacts(sessionID, controller.signal, refreshSession);
    return () => controller.abort();
  }, [modalOpen, pendingKey, refreshSession, sessionID]);
}

async function syncPendingArtifacts(
  sessionID: number,
  signal: AbortSignal,
  refreshSession: ArtifactSyncOptions["refreshSession"],
) {
  let attempt = 0;
  while (!signal.aborted) {
    const delay =
      artifactSyncDelays[Math.min(attempt, artifactSyncDelays.length - 1)] ??
      artifactSyncDelays[artifactSyncDelays.length - 1];
    await waitForArtifactSync(signal, delay);
    if (signal.aborted) {
      return;
    }
    try {
      await refreshSession(sessionID);
    } catch {
      // 素材状态同步失败不影响当前会话，下一轮按退避节奏继续校准。
    }
    attempt += 1;
  }
}

function pendingArtifactKey(messages: ChatMessage[]) {
  return messages
    .filter((message) => !message.document)
    .flatMap((message) =>
      readAgentChatArtifacts(message.output)
        .filter((artifact) => artifact.status === "generating")
        .map((artifact) => artifact.id),
    )
    .sort((left, right) => left - right)
    .join(":");
}

function waitForArtifactSync(signal: AbortSignal, delay: number) {
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
