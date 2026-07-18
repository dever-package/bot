import { requestRaw } from "@dever/front-plugin";
import { isPlainRecord } from "@/lib/runtime-stream-output";
import { readAgentChatActivities } from "./activity";
import { buildAgentChatPreviewContent } from "./message-content";
import { normalizeAgentChatOutput, type AgentChatOutput } from "./output";
import {
  normalizeAgentChatDocument,
  type AgentChatDocument,
} from "./document";
import type {
  ReferenceComposerParam,
  ReferencePreview,
  ReferencePreviewMedia,
  ReferencePreviewRequest,
} from "./reference";

export type AgentChatRole = "user" | "assistant";

export type AgentChatSession = {
  id: number;
  title: string;
  titleSource?: string;
  running?: boolean;
};

export type AgentChatMessageRecord = {
  id: number;
  role: AgentChatRole;
  text: string;
  content?: import("./reference").ReferenceContent;
  output: AgentChatOutput;
  requestID: string;
  status: number;
  createdAt: string;
  document?: AgentChatDocument;
};

export type AgentChatSessionPayload = {
  session: AgentChatSession | null;
  messages: AgentChatMessageRecord[];
};

export type AgentChatSessionListPayload = {
  sessions: AgentChatSession[];
};

export type AgentChatApi = {
  session: string;
  sessions: string;
  newSession: string;
  renameSession: string;
  archiveSession: string;
};

export async function loadAgentInputConfig(
  api: string,
  agentKey: string,
): Promise<ReferenceComposerParam[]> {
  const data = await readRequestData(
    requestRaw(api, "get", { agent_key: agentKey }),
    "读取智能体输入参数失败",
  );
  return normalizeInputParams(data.params);
}

export async function loadAgentChatDocument(
  api: string,
  documentID: number,
): Promise<AgentChatDocument> {
  const data = await readRequestData(
    requestRaw(api, "get", { document_id: documentID }),
    "读取图文内容失败",
  );
  const document = normalizeAgentChatDocument(data);
  if (!document) {
    throw new Error("图文内容无效");
  }
  return document;
}

type SessionScope = {
  agentKey: string;
  contextKey: string;
};

export async function loadAgentChatSession(
  api: AgentChatApi,
  scope: SessionScope & {
    sessionID?: number;
    create?: boolean;
    title?: string;
    limit?: number;
    lastMessageID?: number;
  },
): Promise<AgentChatSessionPayload> {
  const data = await agentChatRequest(
    scope.create ? api.newSession : api.session,
    {
      session_id: scope.sessionID || undefined,
      agent_key: scope.agentKey,
      context_key: scope.contextKey,
      title: scope.title || "新会话",
      limit: scope.limit || 10,
      last_message_id: scope.lastMessageID || undefined,
    },
  );
  return {
    session: normalizeSession(data.session),
    messages: normalizeMessages(data.messages),
  };
}

export async function listAgentChatSessions(
  api: AgentChatApi,
  scope: SessionScope & { limit?: number; lastSessionID?: number },
): Promise<AgentChatSessionListPayload> {
  const data = await agentChatRequest(api.sessions, {
    agent_key: scope.agentKey,
    context_key: scope.contextKey,
    limit: scope.limit || 20,
    last_session_id: scope.lastSessionID || undefined,
    status: "active",
  });
  const rows = Array.isArray(data.sessions) ? data.sessions : [];
  const sessions = rows
    .map(normalizeSession)
    .filter((session): session is AgentChatSession => Boolean(session));
  return { sessions };
}

export async function loadAgentChatSessionState(
  api: AgentChatApi,
  scope: SessionScope & { sessionID: number },
): Promise<AgentChatSession | null> {
  const data = await agentChatRequest(api.session, {
    session_id: scope.sessionID,
    agent_key: scope.agentKey,
    context_key: scope.contextKey,
    session_only: true,
  });
  return normalizeSession(data.session);
}

export async function renameAgentChatSession(
  api: AgentChatApi,
  sessionID: number,
  title: string,
): Promise<AgentChatSession> {
  const data = await agentChatRequest(api.renameSession, {
    session_id: sessionID,
    title,
  });
  const session = normalizeSession(data.session);
  if (!session) {
    throw new Error("更新会话标题失败");
  }
  return session;
}

export async function archiveAgentChatSession(
  api: AgentChatApi,
  sessionID: number,
) {
  await agentChatRequest(api.archiveSession, { session_id: sessionID });
}

export async function loadAgentChatReferencePreview(
  api: string,
  scope: { agentKey: string; sessionID: number },
  reference: ReferencePreviewRequest,
): Promise<ReferencePreview> {
  const data = await agentChatRequest(api, {
    session_id: scope.sessionID,
    agent_key: scope.agentKey,
    ref_type: reference.refType,
    ref_id: reference.refId,
    label: reference.label,
  });
  const refType = textValue(data.ref_type);
  const refID = Number(data.ref_id || 0);
  if (!isReferenceType(refType) || !refID) {
    throw new Error("引用内容无效");
  }
  const text = data.text == null ? "" : String(data.text);
  const output = normalizeAgentChatOutput(data.output);
  const content = buildAgentChatPreviewContent(
    text,
    readAgentChatActivities(output),
  );
  return {
    refType,
    refId: refID,
    title: textValue(data.title) || reference.label,
    text,
    media: normalizeReferencePreviewMedia(data.media),
    content: content.length > 0 ? content : undefined,
  };
}

async function agentChatRequest(api: string, payload: Record<string, unknown>) {
  return readRequestData(requestRaw(api, "post", payload), "会话请求失败");
}

async function readRequestData(
  pending: Promise<unknown>,
  fallback: string,
) {
  const result = await pending;
  if (!isPlainRecord(result)) {
    throw new Error(fallback);
  }
  const code = Number(result.code || 0);
  const status = Number(result.status || 0);
  if (code !== 0 || status === 2) {
    throw new Error(textValue(result.message || result.msg) || fallback);
  }
  return isPlainRecord(result.data) ? result.data : {};
}

function normalizeSession(value: unknown): AgentChatSession | null {
  if (!isPlainRecord(value)) {
    return null;
  }
  const id = Number(value.id || 0);
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }
  return {
    id,
    title: textValue(value.title) || "新会话",
    titleSource: textValue(value.title_source),
    running: Boolean(value.running),
  };
}

function normalizeMessages(value: unknown): AgentChatMessageRecord[] {
  const rows = Array.isArray(value) ? value : [];
  return rows
    .map((row) => {
      if (!isPlainRecord(row)) {
        return null;
      }
      const role = textValue(row.role) === "user" ? "user" : "assistant";
      return {
        id: Number(row.id || 0),
        role,
        text: textValue(row.text),
        content: normalizeReferenceContent(row.content),
        output: normalizeAgentChatOutput(row.output),
        requestID: textValue(row.request_id),
        status: Number(row.status || 1),
        createdAt: textValue(row.created_at),
        document: normalizeAgentChatDocument(row.document),
      } satisfies AgentChatMessageRecord;
    })
    .filter((message): message is AgentChatMessageRecord => Boolean(message));
}

function normalizeReferenceContent(
  value: unknown,
): import("./reference").ReferenceContent | undefined {
  if (!isPlainRecord(value) || Number(value.version) !== 1) {
    return undefined;
  }
  const parts = Array.isArray(value.parts) ? value.parts : [];
  const normalized = parts
    .map((part) => {
      if (!isPlainRecord(part)) {
        return null;
      }
      if (part.type === "text") {
        return { type: "text" as const, text: String(part.text || "") };
      }
      const refID = Number(part.ref_id || 0);
      const refType = textValue(part.ref_type);
      if (part.type !== "reference" || !refID || !isReferenceType(refType)) {
        return null;
      }
      return {
        type: "reference" as const,
        ref_type: refType,
        ref_id: refID,
        label: textValue(part.label) || `${refType} ${refID}`,
        usage: textValue(part.usage) || undefined,
      };
    })
    .filter((part): part is NonNullable<typeof part> => Boolean(part));
  const interactionResponse = normalizeInteractionResponse(
    value.interaction_response,
  );
  return {
    version: 1,
    parts: normalized,
    params: isPlainRecord(value.params) ? value.params : undefined,
    interaction_response: interactionResponse,
  };
}

function normalizeInputParams(value: unknown): ReferenceComposerParam[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((row) => {
      if (!isPlainRecord(row)) {
        return null;
      }
      const id = Number(row.id || 0);
      const key = textValue(row.key);
      const type = textValue(row.type).toLowerCase();
      if (!id || !key || type === "prompt") {
        return null;
      }
      const options = Array.isArray(row.options)
        ? row.options
            .map((option) => {
              if (!isPlainRecord(option)) {
                return null;
              }
              return {
                id: Number(option.id || 0) || textValue(option.id),
                name: textValue(option.name) || undefined,
                value: textValue(option.value || option.name),
                native_value: textValue(option.native_value) || undefined,
                sort: Number(option.sort || 0),
              };
            })
            .filter((option): option is NonNullable<typeof option> =>
              Boolean(option),
            )
        : [];
      return {
        id,
        power_param_id: Number(row.power_param_id || 0) || undefined,
        name: textValue(row.name || row.key),
        key,
        icon: textValue(row.icon) || undefined,
        type: type || "input",
        usage: Number(row.usage || 1),
        value_type: textValue(row.value_type) || "string",
        default_value: textValue(row.default_value) || undefined,
        required: Boolean(row.required),
        upload_rule_id: Number(row.upload_rule_id || 0) || undefined,
        max_files: Number(row.max_files || 0) || undefined,
        sort: Number(row.sort || 0),
        options,
      } satisfies ReferenceComposerParam;
    })
    .filter((param): param is ReferenceComposerParam => Boolean(param));
}

function normalizeInteractionResponse(
  value: unknown,
): import("./reference").InteractionResponseContent | undefined {
  if (!isPlainRecord(value)) {
    return undefined;
  }
  const interactionID = textValue(value.interaction_id);
  if (!interactionID) {
    return undefined;
  }
  return {
    interaction_id: interactionID,
    data: isPlainRecord(value.data) ? value.data : {},
  };
}

function normalizeReferencePreviewMedia(
  value: unknown,
): ReferencePreviewMedia[] {
  const rows = Array.isArray(value) ? value : [];
  return rows
    .map((row) => {
      if (!isPlainRecord(row)) {
        return null;
      }
      const url = textValue(row.url);
      if (!url) {
        return null;
      }
      const mediaRefType = textValue(row.ref_type);
      return {
        refType: isReferenceType(mediaRefType) ? mediaRefType : undefined,
        refId: positiveNumber(row.ref_id) || undefined,
        artifactId: positiveNumber(row.artifact_id) || undefined,
        fileId: positiveNumber(row.file_id) || undefined,
        seriesId: positiveNumber(row.series_id) || undefined,
        kind: normalizeMediaKind(row.kind),
        name: textValue(row.name) || undefined,
        label: textValue(row.label || row.name) || "素材",
        url,
      } satisfies ReferencePreviewMedia;
    })
    .filter((media): media is ReferencePreviewMedia => Boolean(media));
}

function normalizeMediaKind(value: unknown) {
  const kind = textValue(value).toLowerCase();
  return ["image", "video", "audio"].includes(kind) ? kind : "file";
}

function isReferenceType(
  value: string,
): value is import("./reference").ReferenceType {
  return ["message", "artifact", "upload_file", "session"].includes(value);
}

function positiveNumber(value: unknown) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}

function textValue(value: unknown) {
  return value == null ? "" : String(value).trim();
}
