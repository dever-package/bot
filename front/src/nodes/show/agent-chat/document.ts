import { isPlainRecord } from "@/lib/runtime-stream-output";
import { resolveAssetUrl } from "@/lib/request";
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

export function normalizeAgentChatDocumentBlockText(
  text: string,
  title: string,
) {
  const comparableTitle = title.trim();
  const paragraphs = String(text || "")
    .trim()
    .split(/\n{2,}/)
    .map((paragraph) =>
      paragraph
        .split("\n")
        .filter((line) => !isDocumentTitleHeading(line, comparableTitle))
        .join("\n")
        .trim(),
    )
    .filter(Boolean);
  return paragraphs
    .filter((paragraph, index) => paragraph !== paragraphs[index - 1])
    .join("\n\n");
}

export function agentChatDocumentMarkdown(document: AgentChatDocument) {
  return agentChatDocumentText(document, false);
}

export function agentChatDocumentCopyText(document: AgentChatDocument) {
  return agentChatDocumentText(document, true);
}

function agentChatDocumentText(
  document: AgentChatDocument,
  includeArtifacts: boolean,
) {
  const content = document.blocks.flatMap((block) => {
    if (block.type === "text") {
      const text = normalizeAgentChatDocumentBlockText(
        block.text,
        document.title,
      );
      return text ? [text] : [];
    }
    if (!includeArtifacts) {
      return [];
    }
    return block.artifacts
      .map(agentChatArtifactMarkdown)
      .filter((value): value is string => Boolean(value));
  });
  if (document.title) {
    content.unshift(`# ${document.title}`);
  }
  return content.join("\n\n");
}

function agentChatArtifactMarkdown(artifact: AgentChatArtifact) {
  const url = resolveAssetUrl(
    String(artifact.url || artifact.previewUrl || "").trim(),
  );
  if (artifact.status !== "ready" || !url) {
    return "";
  }
  const label = markdownLabel(
    artifact.label || artifact.name || `素材 ${artifact.id}`,
  );
  const target = `<${url
    .replaceAll("<", "%3C")
    .replaceAll(">", "%3E")
    .replaceAll(" ", "%20")}>`;
  return artifact.kind === "image"
    ? `![${label}](${target})`
    : `[${label}](${target})`;
}

function markdownLabel(value: string) {
  return String(value || "").replace(/[\\[\]]/g, "\\$&");
}

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
  const status = mergeDocumentStatus(current.status, incoming.status);
  return {
    ...current,
    ...incoming,
    sessionID: incoming.sessionID || current.sessionID,
    messageID: incoming.messageID || current.messageID,
    runID: incoming.runID || current.runID,
    title: incoming.title || current.title,
    status,
    pendingJobCount:
      status === "ready" || status === "partial_failed"
        ? 0
        : incoming.pendingJobCount,
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
      status: mergeBlockStatus(
        currentBlock.status,
        eventBlockStatus(event, currentBlock.status),
      ),
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
      status: mergeDocumentStatus(
        document.status,
        documentStatus(status || "generating"),
      ),
    };
  } else if (event === "document_complete") {
    document = {
      ...document,
      status: mergeDocumentStatus(
        document.status,
        documentStatus(status || "ready"),
      ),
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
      (block) =>
        block.type === "media" &&
        block.status !== "failed" &&
        !isAgentChatDocumentMediaReady(block),
    )
  );
}

export function isAgentChatDocumentMediaReady(
  block: AgentChatDocumentBlock,
) {
  return (
    block.type === "media" &&
    block.artifacts.length > 0 &&
    block.artifacts.every(
      (artifact) =>
        artifact.status === "ready" &&
        Boolean(String(artifact.url || artifact.previewUrl || "").trim()),
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
            status: mergeBlockStatus(existing.status, block.status),
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
    const existing = artifacts.get(artifact.id);
    artifacts.set(
      artifact.id,
      existing
        ? {
            ...existing,
            ...artifact,
            fileID: artifact.fileID || existing.fileID,
            status: mergeArtifactStatus(existing.status, artifact.status),
            url: artifact.url || existing.url,
            previewUrl: artifact.previewUrl || existing.previewUrl,
            mime: artifact.mime || existing.mime,
            size: artifact.size || existing.size,
          }
        : artifact,
    );
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

function mergeDocumentStatus(
  current: AgentChatDocumentStatus,
  incoming: AgentChatDocumentStatus,
) {
  return documentStatusRank(incoming) >= documentStatusRank(current)
    ? incoming
    : current;
}

function documentStatusRank(status: AgentChatDocumentStatus) {
  if (status === "ready" || status === "partial_failed") return 2;
  if (status === "generating") return 1;
  return 0;
}

function mergeBlockStatus(
  current: AgentChatDocumentBlockStatus,
  incoming: AgentChatDocumentBlockStatus,
) {
  if (current !== "generating" && incoming === "generating") {
    return current;
  }
  return incoming;
}

function mergeArtifactStatus(
  current: AgentChatArtifact["status"],
  incoming: AgentChatArtifact["status"],
) {
  if (current !== "generating" && incoming === "generating") {
    return current;
  }
  return incoming;
}

function isDocumentTitleHeading(line: string, title: string) {
  if (!title) {
    return false;
  }
  const match = line.trim().match(/^#{1,6}\s+(.+)$/);
  return Boolean(match && match[1].trim() === title);
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
