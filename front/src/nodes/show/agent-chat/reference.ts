import { getCompatModule } from "@dever/front-plugin";
import type { AgentChatApi, AgentChatMessageRecord } from "./api";
import { listAgentChatSessions, loadAgentChatSession } from "./api";
import { readAgentChatArtifacts } from "./artifact";

export type ReferenceType = "message" | "artifact" | "upload_file" | "session";

export type ReferencePreviewHint = {
  text?: string;
  kind?: string;
  url?: string;
};

export type ReferencePreviewMedia = {
  refType?: ReferenceType;
  refId?: number;
  artifactId?: number;
  fileId?: number;
  seriesId?: number;
  kind: string;
  name?: string;
  label: string;
  url: string;
};

export type ReferencePreview = {
  refType: ReferenceType;
  refId: number;
  title: string;
  text: string;
  media: ReferencePreviewMedia[];
};

export type ReferencePreviewRequest = {
  refType: ReferenceType;
  refId: number;
  label: string;
};

export type ReferencePreviewLoader = (
  request: ReferencePreviewRequest,
) => Promise<ReferencePreview>;

export type ReferencePart =
  | { type: "text"; text: string }
  | {
      type: "reference";
      ref_type: ReferenceType;
      ref_id: number;
      label: string;
      usage?: string;
    };

export type ReferenceContent = {
  version: 1;
  parts: ReferencePart[];
  interaction_response?: InteractionResponseContent;
};

export type InteractionResponseContent = {
  interaction_id: string;
  data: Record<string, unknown>;
};

export type ReferenceInput = {
  text: string;
  content: ReferenceContent;
};

export type ReferenceScope = "current" | "history" | "resource";

export type ReferenceOption = {
  key: string;
  refType: ReferenceType;
  refId: number;
  label: string;
  description?: string;
  preview?: ReferencePreviewHint;
  parentKey?: string;
  selectable?: boolean;
  hasChildren?: boolean;
};

export type ReferenceLoadRequest = {
  scope: ReferenceScope;
  query: string;
  cursor?: string;
  parent?: ReferenceOption;
};

export type ReferenceLoadResult = {
  items: ReferenceOption[];
  nextCursor?: string;
};

export type ReferenceComposerProps = {
  placeholder?: string;
  disabled?: boolean;
  running?: boolean;
  stopping?: boolean;
  cancelable?: boolean;
  className?: string;
  loadReferences: (
    request: ReferenceLoadRequest,
  ) => Promise<ReferenceLoadResult>;
  loadPreview: ReferencePreviewLoader;
  onSubmit: (input: ReferenceInput) => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
};

export function textReferenceInput(text: string): ReferenceInput {
  return {
    text,
    content: {
      version: 1,
      parts: [{ type: "text", text }],
    },
  };
}

export function interactionResponseInput(
  interactionID: string,
  text: string,
  data: Record<string, unknown>,
): ReferenceInput {
  const input = textReferenceInput(text);
  input.content.interaction_response = {
    interaction_id: interactionID,
    data,
  };
  return input;
}

type ResourceItem = Record<string, unknown>;
type ResourceListResult = {
  list: ResourceItem[];
  page: number;
  pageSize: number;
  total: number;
};

const { listResources } = getCompatModule("@/lib/resource") as {
  listResources: (query: {
    page: number;
    pageSize: number;
    keyword?: string;
  }) => Promise<ResourceListResult>;
};

export async function loadAgentChatReferences(
  input: {
    api: AgentChatApi;
    agentKey: string;
    contextKey: string;
    sessionID: number;
  },
  request: ReferenceLoadRequest,
): Promise<ReferenceLoadResult> {
  if (request.scope === "resource") {
    return loadResourceReferences(request);
  }
  if (request.scope === "history" && !request.parent) {
    const page = await listAgentChatSessions(input.api, {
      agentKey: input.agentKey,
      contextKey: input.contextKey,
      limit: 20,
      lastSessionID: positiveNumber(request.cursor),
    });
    const sessions = page.sessions.filter(
      (session) => session.id !== input.sessionID,
    );
    return {
      items: filterOptions(
        sessions.map((session) => ({
          key: `session:${session.id}`,
          refType: "session" as const,
          refId: session.id,
          label: session.title,
          description: "查看此会话的消息和素材",
          selectable: false,
          hasChildren: true,
        })),
        request.query,
      ),
      nextCursor:
        page.sessions.length > 0
          ? String(page.sessions[page.sessions.length - 1]?.id || "")
          : undefined,
    };
  }
  const targetSessionID =
    request.scope === "history" ? request.parent?.refId || 0 : input.sessionID;
  if (!targetSessionID) {
    return { items: [] };
  }
  const payload = await loadAgentChatSession(input.api, {
    agentKey: input.agentKey,
    contextKey: input.contextKey,
    sessionID: targetSessionID,
    limit: 20,
    lastMessageID: positiveNumber(request.cursor),
  });
  return {
    items: filterOptions(
      messageReferenceOptions([...payload.messages].reverse()),
      request.query,
    ),
    nextCursor:
      payload.messages.length > 0
        ? String(payload.messages[0]?.id || "")
        : undefined,
  };
}

function messageReferenceOptions(messages: AgentChatMessageRecord[]) {
  const result: ReferenceOption[] = [];
  for (const message of messages) {
    const messageKey = `message:${message.id}`;
    result.push({
      key: messageKey,
      refType: "message",
      refId: message.id,
      label: messageLabel(message),
      description: message.role === "user" ? "用户消息" : "智能体回复",
      preview: {
        text: message.text,
        kind: "message",
      },
    });
    for (const artifact of messageArtifacts(message)) {
      result.push({
        key: `artifact:${artifact.id}`,
        refType: "artifact",
        refId: artifact.id,
        label: artifact.label,
        description: artifact.name || artifact.status,
        preview: {
          text: artifact.name || artifact.status,
          kind: artifact.kind,
          url: artifact.previewUrl,
        },
        parentKey: messageKey,
        selectable: artifact.status === "已生成",
      });
    }
  }
  return result;
}

function messageArtifacts(message: AgentChatMessageRecord) {
  return readAgentChatArtifacts(message.output).map((artifact) => ({
    id: artifact.id,
    label: artifact.label,
    name: artifact.name,
    kind: artifact.kind,
    status:
      artifact.status === "generating"
        ? "生成中"
        : artifact.status === "failed"
          ? "生成失败"
          : "已生成",
    previewUrl: artifact.kind === "image" ? artifact.previewUrl : undefined,
  }));
}

async function loadResourceReferences(
  request: ReferenceLoadRequest,
): Promise<ReferenceLoadResult> {
  if (typeof listResources !== "function") {
    throw new Error("资源中心暂不可用");
  }
  const page = Math.max(1, positiveNumber(request.cursor) || 1);
  const result = await listResources({
    page,
    pageSize: 12,
    keyword: request.query,
  });
  return {
    items: result.list
      .map(resourceReferenceOption)
      .filter((item): item is ReferenceOption => Boolean(item)),
    nextCursor:
      result.page * result.pageSize < result.total
        ? String(result.page + 1)
        : undefined,
  };
}

function resourceReferenceOption(value: ResourceItem): ReferenceOption | null {
  const id = positiveNumber(value.id);
  if (!id) {
    return null;
  }
  const name =
    textValue(value.name || value.file_name || value.origin_name) ||
    `资源 ${id}`;
  const kind = resourceKind(value);
  return {
    key: `upload_file:${id}`,
    refType: "upload_file",
    refId: id,
    label: name,
    description: resourceKindLabel(kind),
    preview: {
      text: name,
      kind,
      url:
        kind === "image"
          ? textValue(value.thumbnail || value.thumb || value.url)
          : undefined,
    },
  };
}

function messageLabel(message: AgentChatMessageRecord) {
  const text = message.text.replace(/\s+/g, " ").trim();
  if (!text) {
    return message.role === "user" ? "用户消息" : "生成结果";
  }
  return Array.from(text).slice(0, 48).join("");
}

function filterOptions(options: ReferenceOption[], query: string) {
  const keyword = searchableText(query);
  if (!keyword) {
    return options;
  }
  return options.filter((option) =>
    searchableText(`${option.label} ${option.description || ""}`).includes(
      keyword,
    ),
  );
}

function searchableText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/(图|视频|音频|文件)\s+(\d+)/g, "$1$2");
}

function resourceKind(value: ResourceItem) {
  const kind = textValue(value.kind).toLowerCase();
  const mime = textValue(value.mime || value.type).toLowerCase();
  if (kind === "image" || mime.startsWith("image/")) return "image";
  if (kind === "video" || mime.startsWith("video/")) return "video";
  if (kind === "audio" || mime.startsWith("audio/")) return "audio";
  return "file";
}

function resourceKindLabel(kind: string) {
  if (kind === "image") return "图片";
  if (kind === "video") return "视频";
  if (kind === "audio") return "音频";
  return "文件";
}

function positiveNumber(value: unknown) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}

function textValue(value: unknown) {
  return value == null ? "" : String(value).trim();
}
