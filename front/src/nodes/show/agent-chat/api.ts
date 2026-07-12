import { request } from "@dever/front-plugin";
import { isPlainRecord } from "@/lib/runtime-stream-output";
import {
  normalizeAgentChatOutput,
  type AgentChatOutput,
} from "./output";

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
  const data = await assistantRequest(
    scope.create ? api.newSession : api.session,
    {
      session_id: scope.sessionID || undefined,
      agent_key: scope.agentKey,
      context_key: scope.contextKey,
      title: scope.title || "新会话",
      limit: scope.limit || 10,
      last_message_id: scope.lastMessageID || undefined,
      memory_enabled: false,
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
  const data = await assistantRequest(api.sessions, {
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
  const data = await assistantRequest(api.session, {
    session_id: scope.sessionID,
    agent_key: scope.agentKey,
    context_key: scope.contextKey,
    session_only: true,
    memory_enabled: false,
  });
  return normalizeSession(data.session);
}

export async function renameAgentChatSession(
  api: AgentChatApi,
  sessionID: number,
  title: string,
): Promise<AgentChatSession> {
  const data = await assistantRequest(api.renameSession, {
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
  await assistantRequest(api.archiveSession, { session_id: sessionID });
}

async function assistantRequest(api: string, payload: Record<string, unknown>) {
  const result = await request(api, "post", payload);
  if (!isPlainRecord(result)) {
    throw new Error("会话请求失败");
  }
  const code = Number(result.code || 0);
  const status = Number(result.status || 0);
  if (code !== 0 || status === 2) {
    throw new Error(textValue(result.message || result.msg) || "会话请求失败");
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
        preview: normalizeReferencePreview(part.preview),
      };
    })
    .filter((part): part is NonNullable<typeof part> => Boolean(part));
  return { version: 1, parts: normalized };
}

function normalizeReferencePreview(
  value: unknown,
): import("./reference").ReferencePreview | undefined {
  if (!isPlainRecord(value)) {
    return undefined;
  }
  const preview = {
    text: textValue(value.text) || undefined,
    kind: textValue(value.kind) || undefined,
    url: textValue(value.url) || undefined,
  };
  return preview.text || preview.kind || preview.url ? preview : undefined;
}

function isReferenceType(
  value: string,
): value is import("./reference").ReferenceType {
  return ["message", "artifact", "upload_file", "session"].includes(value);
}

function textValue(value: unknown) {
  return value == null ? "" : String(value).trim();
}
