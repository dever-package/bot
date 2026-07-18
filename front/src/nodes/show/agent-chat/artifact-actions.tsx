import {
  createContext,
  useContext,
  type PropsWithChildren,
} from "react";
import type {
  EnergonMediaKind,
  EnergonMediaPreviewRequest,
} from "@/components/energon/content-view";
import { resolveAssetUrl } from "@/lib/request";
import type { AgentChatArtifact } from "./artifact";
import type { AgentChatArtifactActionRenderer } from "./types";

type AgentChatArtifactActionsValue = {
  messageID: number;
  render?: AgentChatArtifactActionRenderer;
};

type AgentChatMediaPreviewContext = {
  source: "agent-chat";
  messageID: number;
  artifacts: AgentChatArtifact[];
};

const ArtifactActionsContext = createContext<AgentChatArtifactActionsValue>({
  messageID: 0,
});

export function AgentChatArtifactActionsProvider({
  messageID,
  render,
  children,
}: PropsWithChildren<AgentChatArtifactActionsValue>) {
  return (
    <ArtifactActionsContext.Provider value={{ messageID, render }}>
      {children}
    </ArtifactActionsContext.Provider>
  );
}

export function useAgentChatArtifactActions() {
  return useContext(ArtifactActionsContext);
}

export function agentChatMediaPreviewRequest(
  request: EnergonMediaPreviewRequest,
  messageID: number,
  artifacts: AgentChatArtifact[],
): EnergonMediaPreviewRequest {
  return {
    ...request,
    context: {
      source: "agent-chat",
      messageID,
      artifacts,
    } satisfies AgentChatMediaPreviewContext,
  };
}

export function readAgentChatMediaPreviewContext(
  value: unknown,
): AgentChatMediaPreviewContext | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  const context = value as Partial<AgentChatMediaPreviewContext>;
  if (
    context.source !== "agent-chat" ||
    !Number(context.messageID) ||
    !Array.isArray(context.artifacts)
  ) {
    return null;
  }
  return {
    source: "agent-chat",
    messageID: Number(context.messageID),
    artifacts: context.artifacts,
  };
}

export function findAgentChatMediaArtifact(
  artifacts: AgentChatArtifact[],
  kind: EnergonMediaKind,
  url: string,
  index = 0,
) {
  const candidates = artifacts.filter(
    (artifact) =>
      artifact.kind === kind && artifact.status === "ready" && artifact.url,
  );
  const normalizedURL = normalizeMediaURL(url);
  const exact = candidates.find(
    (artifact) =>
      normalizeMediaURL(artifact.url) === normalizedURL ||
      normalizeMediaURL(artifact.previewUrl) === normalizedURL,
  );
  return exact || candidates[index] || null;
}

function normalizeMediaURL(value: string) {
  return resolveAssetUrl(String(value || "").trim());
}
