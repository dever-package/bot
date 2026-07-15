import { isPlainRecord } from "@/lib/runtime-stream-output";
import {
  readAgentChatArtifacts,
  type AgentChatArtifact,
} from "./artifact";

export type AgentChatDocumentStatus =
  | "writing"
  | "generating"
  | "ready"
  | "partial_failed";

export type AgentChatDocumentBlockStatus =
  | "generating"
  | "ready"
  | "failed";

export type AgentChatDocumentBlock = {
  id: number;
  seq: number;
  type: "text" | "media";
  format: string;
  mediaKind: "image" | "video" | "audio" | "file";
  text: string;
  status: AgentChatDocumentBlockStatus;
  meta: Record<string, unknown>;
  artifacts: AgentChatArtifact[];
};

export type AgentChatDocument = {
  id: number;
  hydrated: boolean;
  sessionID: number;
  messageID: number;
  runID: number;
  title: string;
  status: AgentChatDocumentStatus;
  blockCount: number;
  pendingJobCount: number;
  meta: Record<string, unknown>;
  blocks: AgentChatDocumentBlock[];
  createdAt: string;
  updatedAt: string;
  completedAt: string;
};

export function normalizeAgentChatDocument(
  value: unknown,
): AgentChatDocument | undefined {
  if (!isPlainRecord(value)) {
    return undefined;
  }
  const id = positiveNumber(value.id);
  if (!id) {
    return undefined;
  }
  const hydrated = Array.isArray(value.blocks);
  const blocks = hydrated
    ? value.blocks
        .map(normalizeAgentChatDocumentBlock)
        .filter((block): block is AgentChatDocumentBlock => Boolean(block))
        .sort(compareBlocks)
    : [];
  return {
    id,
    hydrated,
    sessionID: positiveNumber(value.session_id),
    messageID: positiveNumber(value.message_id),
    runID: positiveNumber(value.run_id),
    title: textValue(value.title),
    status: documentStatus(value.status),
    blockCount: nonNegativeNumber(value.block_count) || blocks.length,
    pendingJobCount: nonNegativeNumber(value.pending_job_count),
    meta: isPlainRecord(value.meta) ? { ...value.meta } : {},
    blocks,
    createdAt: textValue(value.created_at),
    updatedAt: textValue(value.updated_at),
    completedAt: textValue(value.completed_at),
  };
}

export function mergeAgentChatDocument(
  current: AgentChatDocument | undefined,
  incoming: AgentChatDocument | undefined,
) {
  if (!incoming) {
    return current;
  }
  if (!current || current.id !== incoming.id) {
    return incoming;
  }
  return {
    ...current,
    ...incoming,
    sessionID: incoming.sessionID || current.sessionID,
    messageID: incoming.messageID || current.messageID,
    runID: incoming.runID || current.runID,
    title: incoming.title || current.title,
    hydrated: current.hydrated || incoming.hydrated,
    meta: { ...current.meta, ...incoming.meta },
    blocks: mergeDocumentBlocks(current.blocks, incoming.blocks),
  } satisfies AgentChatDocument;
}

export function mergeAgentChatDocumentEvent(
  current: AgentChatDocument | undefined,
  value: unknown,
) {
  if (!isPlainRecord(value)) {
    return current;
  }
  const incoming = normalizeAgentChatDocument(value.document);
  let document = mergeAgentChatDocument(current, incoming);
  const documentID = positiveNumber(value.document_id) || incoming?.id || 0;
  if (!document || (documentID && document.id !== documentID)) {
    return document;
  }

  const block = normalizeAgentChatDocumentBlock(value.block);
  if (block) {
    const blocks = mergeDocumentBlocks(document.blocks, [block]);
    document = {
      ...document,
      blocks,
      blockCount: Math.max(document.blockCount, blocks.length),
    };
  }

  const blockID = positiveNumber(value.block_id) || block?.id || 0;
  const artifacts = normalizeArtifacts(value.artifacts);
  const event = textValue(value.event).toLowerCase();
  if (blockID) {
    document = updateDocumentBlock(document, blockID, (currentBlock) => ({
      ...currentBlock,
      status: eventBlockStatus(event, currentBlock.status),
      artifacts:
        artifacts.length > 0
          ? mergeArtifacts(currentBlock.artifacts, artifacts)
          : currentBlock.artifacts,
      meta: {
        ...currentBlock.meta,
        ...(value.progress == null ? {} : { progress: value.progress }),
        ...(textValue(value.text) ? { progress_text: textValue(value.text) } : {}),
      },
    }));
  }

  const status = textValue(value.status);
  if (event === "document_content_complete") {
    document = {
      ...document,
      status: documentStatus(status || "generating"),
    };
  } else if (event === "document_complete") {
    document = {
      ...document,
      status: documentStatus(status || "ready"),
      pendingJobCount: 0,
    };
  }
  return document;
}

export function isAgentChatDocumentPending(document?: AgentChatDocument) {
  if (!document) {
    return false;
  }
  return (
    document.status === "writing" ||
    document.status === "generating" ||
    document.pendingJobCount > 0 ||
    document.blocks.some(
      (block) => block.type === "media" && block.status === "generating",
    )
  );
}

export function needsAgentChatDocumentSync(document?: AgentChatDocument) {
  return Boolean(document && (!document.hydrated || isAgentChatDocumentPending(document)));
}

function normalizeAgentChatDocumentBlock(
  value: unknown,
): AgentChatDocumentBlock | null {
  if (!isPlainRecord(value)) {
    return null;
  }
  const id = positiveNumber(value.id);
  if (!id) {
    return null;
  }
  const type = textValue(value.type) === "media" ? "media" : "text";
  return {
    id,
    seq: nonNegativeNumber(value.seq),
    type,
    format: textValue(value.format) || (type === "media" ? "artifact" : "markdown"),
    mediaKind: mediaKind(value.media_kind),
    text: textValue(value.text, false),
    status: blockStatus(value.status, type),
    meta: isPlainRecord(value.meta) ? { ...value.meta } : {},
    artifacts: normalizeArtifacts(value.artifacts),
  };
}

function mergeDocumentBlocks(
  current: AgentChatDocumentBlock[],
  incoming: AgentChatDocumentBlock[],
) {
  const blocks = new Map(current.map((block) => [block.id, block]));
  for (const block of incoming) {
    const existing = blocks.get(block.id);
    blocks.set(
      block.id,
      existing
        ? {
            ...existing,
            ...block,
            text: block.text || existing.text,
            meta: { ...existing.meta, ...block.meta },
            artifacts: mergeArtifacts(existing.artifacts, block.artifacts),
          }
        : block,
    );
  }
  return Array.from(blocks.values()).sort(compareBlocks);
}

function updateDocumentBlock(
  document: AgentChatDocument,
  blockID: number,
  update: (block: AgentChatDocumentBlock) => AgentChatDocumentBlock,
) {
  return {
    ...document,
    blocks: document.blocks.map((block) =>
      block.id === blockID ? update(block) : block,
    ),
  };
}

function normalizeArtifacts(value: unknown) {
  return readAgentChatArtifacts({ artifacts: Array.isArray(value) ? value : [] });
}

function mergeArtifacts(
  current: AgentChatArtifact[],
  incoming: AgentChatArtifact[],
) {
  const artifacts = new Map(current.map((artifact) => [artifact.id, artifact]));
  for (const artifact of incoming) {
    artifacts.set(artifact.id, {
      ...artifacts.get(artifact.id),
      ...artifact,
    });
  }
  return Array.from(artifacts.values()).sort(
    (left, right) => left.displayNo - right.displayNo || left.id - right.id,
  );
}

function compareBlocks(
  left: AgentChatDocumentBlock,
  right: AgentChatDocumentBlock,
) {
  return left.seq - right.seq || left.id - right.id;
}

function eventBlockStatus(
  event: string,
  fallback: AgentChatDocumentBlockStatus,
) {
  if (event === "artifact_ready") return "ready";
  if (event === "artifact_failed") return "failed";
  if (event === "artifact_progress") return "generating";
  return fallback;
}

function documentStatus(value: unknown): AgentChatDocumentStatus {
  const status = textValue(value).toLowerCase();
  if (status === "generating" || status === "ready" || status === "partial_failed") {
    return status;
  }
  return "writing";
}

function blockStatus(
  value: unknown,
  type: AgentChatDocumentBlock["type"],
): AgentChatDocumentBlockStatus {
  const status = textValue(value).toLowerCase();
  if (status === "generating" || status === "failed") {
    return status;
  }
  return type === "media" && !status ? "generating" : "ready";
}

function mediaKind(value: unknown): AgentChatDocumentBlock["mediaKind"] {
  const kind = textValue(value).toLowerCase();
  if (kind === "image" || kind === "video" || kind === "audio") {
    return kind;
  }
  return "file";
}

function positiveNumber(value: unknown) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}

function nonNegativeNumber(value: unknown) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}

function textValue(value: unknown, trim = true) {
  const text = value == null ? "" : String(value);
  return trim ? text.trim() : text;
}
