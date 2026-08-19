import { isPlainRecord } from "@/lib/runtime-stream-output";
import type { AgentChatOutput } from "./output";

export type AgentChatArtifact = {
  id: number;
  fileID: number;
  displayNo: number;
  label: string;
  name: string;
  kind: "image" | "video" | "audio" | "file";
  status: "generating" | "ready" | "failed";
  error: string;
  url: string;
  previewUrl: string;
  mime: string;
  size: number;
  meta: Record<string, unknown>;
};

export function readAgentChatArtifacts(value: unknown): AgentChatArtifact[] {
  if (!isPlainRecord(value) || !Array.isArray(value.artifacts)) {
    return [];
  }
  return value.artifacts
    .map(readArtifact)
    .filter((artifact): artifact is AgentChatArtifact => Boolean(artifact));
}

export function artifactDisplayOutput(value: unknown): AgentChatOutput {
  const output: AgentChatOutput = {};
  for (const artifact of readAgentChatArtifacts(value)) {
    if (artifact.status !== "ready" || !artifact.url) {
      continue;
    }
    const key = artifactOutputKey(artifact.kind);
    const existing = output[key];
    const current = Array.isArray(existing) ? existing : [];
    output[key] = [
      ...current,
      {
        id: artifact.fileID,
        name: artifact.name || artifact.label,
        url: artifact.url,
        thumbnail: artifact.previewUrl,
        mime: artifact.mime,
        size: artifact.size,
      },
    ];
  }
  return output;
}

function readArtifact(value: unknown): AgentChatArtifact | null {
  if (!isPlainRecord(value)) {
    return null;
  }
  // Document blocks reuse this decoder after their artifacts are normalized.
  const id = positiveNumber(value.artifact_id ?? value.id);
  if (!id) {
    return null;
  }
  return {
    id,
    fileID: positiveNumber(value.file_id ?? value.fileID),
    displayNo: Math.floor(positiveNumber(value.display_no ?? value.displayNo)),
    label: textValue(value.label) || `素材 ${id}`,
    name: textValue(value.name),
    kind: artifactKind(value.kind),
    status: artifactStatus(value.status),
    error: textValue(value.error),
    url: textValue(value.url || value.open_url),
    previewUrl: textValue(value.preview_url || value.previewUrl || value.url),
    mime: textValue(value.mime),
    size: positiveNumber(value.size),
    meta: isPlainRecord(value.meta) ? { ...value.meta } : {},
  };
}

function artifactKind(value: unknown): AgentChatArtifact["kind"] {
  const kind = textValue(value).toLowerCase();
  if (kind === "image" || kind === "video" || kind === "audio") {
    return kind;
  }
  return "file";
}

function artifactStatus(value: unknown): AgentChatArtifact["status"] {
  const status = textValue(value).toLowerCase();
  if (status === "ready" || status === "failed") {
    return status;
  }
  return "generating";
}

function artifactOutputKey(kind: AgentChatArtifact["kind"]) {
  if (kind === "image") return "images";
  if (kind === "video") return "videos";
  if (kind === "audio") return "audios";
  return "files";
}

function positiveNumber(value: unknown) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function textValue(value: unknown) {
  return value == null ? "" : String(value).trim();
}
