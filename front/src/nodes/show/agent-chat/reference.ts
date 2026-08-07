import type { AgentChatApi, AgentChatMessageRecord } from "./api";
import { listAgentChatSessions, loadAgentChatSession } from "./api";
import {
  readAgentChatArtifacts,
  type AgentChatArtifact,
} from "./artifact";

export type ReferenceType =
  | "message"
  | "artifact"
  | "upload_file"
  | "session"
  | "canvas_node"
  | "asset";

export type ReferencePreviewHint = {
  text?: string;
  kind?: string;
  url?: string;
  sourceUrl?: string;
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
  trigger?: string;
  versionId?: number;
  url: string;
  index?: number;
};

export type ReferencePreview = {
  refType: ReferenceType;
  refId: number;
  title: string;
  text: string;
  media: ReferencePreviewMedia[];
  content?: unknown;
};

export type ReferenceMediaSelectionItem = {
  url?: string;
  index?: number;
  usage?: string;
};

export type ReferencePreviewRequest = {
  refType: ReferenceType;
  refId: number;
  label: string;
  trigger?: string;
  versionId?: number;
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
      ref_trigger?: string;
      ref_version_id?: number;
      ref_origin?: string;
      ref_origin_id?: string;
      ref_media_url?: string;
      ref_media_index?: number;
      ref_media_count?: number;
      ref_media_items?: ReferenceMediaSelectionItem[];
    };

export type ReferenceContent = {
  version: 1;
  parts: ReferencePart[];
  params?: Record<string, unknown>;
  interaction_response?: InteractionResponseContent;
};

export type InteractionResponseContent = {
  interaction_id: string;
  data: Record<string, unknown>;
};

export type ReferenceInput = {
  text: string;
  content: ReferenceContent;
  params?: Record<string, unknown>;
};

export type ReferenceComposerParam = {
  id: string | number;
  power_param_id?: string | number;
  name: string;
  key?: string;
  icon?: string;
  type: string;
  usage: number;
  value_type: string;
  default_value?: string;
  required?: boolean;
  upload_rule_id?: string | number;
  max_files?: number;
  sort?: number;
  options?: Array<{
    id: string | number;
    name?: string;
    value: string;
    native_value?: string;
    sort?: number;
  }>;
};

export type ReferenceScope = "current" | "history";

export type ReferenceOption = {
  key: string;
  refType: ReferenceType;
  refId: number;
  label: string;
  description?: string;
  messageRole?: "user" | "assistant";
  preview?: ReferencePreviewHint;
  materials?: ReferenceOption[];
  selectable?: boolean;
  hasChildren?: boolean;
  usage?: string;
  trigger?: string;
  versionID?: number;
  origin?: string;
  originID?: string;
  mediaURL?: string;
  mediaIndex?: number;
  mediaCount?: number;
  mediaItems?: ReferenceMediaSelectionItem[];
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

export type ReferenceProviderPickerProps = {
  open: boolean;
  acceptedKinds?: string[];
  preferredUsage?: string;
  maxSelection?: number;
  selectedReferences?: Extract<ReferencePart, { type: "reference" }>[];
  onSelect: (option: ReferenceOption) => void;
  onSelectMany?: (options: ReferenceOption[]) => void;
  onClose: () => void;
};

export type ReferenceProvider = {
  trigger: string;
  referenceTypes: ReferenceType[];
  loadReferences?: (
    request: ReferenceLoadRequest,
  ) => Promise<ReferenceLoadResult>;
  loadPreview?: ReferencePreviewLoader;
  availableScopes?: ReferenceScope[];
  searchPlaceholder?: string;
  renderPicker?: (
    props: ReferenceProviderPickerProps,
  ) => import("react").ReactNode;
};

export type ReferenceUploadedFile = {
  id: string | number;
  name?: string;
  kind?: string;
  mime?: string;
  url?: string;
};

export type ReferenceComposerProps = {
  placeholder?: string;
  disabled?: boolean;
  running?: boolean;
  stopping?: boolean;
  cancelable?: boolean;
  className?: string;
  layerZIndex?: number;
  clipboardImageUploadRuleId?: number;
  uploadBizKey?: string;
  uploadBizName?: string;
  allowResourceLibrary?: boolean;
  showMediaAliases?: boolean;
  allowMultiMediaSelection?: boolean;
  onUploadedFiles?: (
    files: ReferenceUploadedFile[],
  ) => void | Promise<void>;
  parameters?: ReferenceComposerParam[];
  providers?: ReferenceProvider[];
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

export async function loadAgentChatReferences(
  input: {
    api: AgentChatApi;
    agentKey: string;
    contextKey: string;
    sessionID: number;
  },
  request: ReferenceLoadRequest,
): Promise<ReferenceLoadResult> {
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
  return messages.map(
    (message): ReferenceOption => ({
      key: `message:${message.id}`,
      refType: "message",
      refId: message.id,
      label: messageLabel(message),
      description: message.role === "user" ? "用户消息" : "智能体回复",
      messageRole: message.role,
      preview: {
        text: message.text,
        kind: "message",
      },
      materials: messageMaterialOptions(message),
    }),
  );
}

function messageMaterialOptions(
  message: AgentChatMessageRecord,
): ReferenceOption[] {
  const fallbackNumbers: Record<AgentChatArtifact["kind"], number> = {
    image: 0,
    video: 0,
    audio: 0,
    file: 0,
  };
  return readAgentChatArtifacts(message.output)
    .filter(
      (artifact) =>
        artifact.status === "ready" &&
        Boolean(artifact.url || artifact.previewUrl),
    )
    .map((artifact): ReferenceOption => {
      fallbackNumbers[artifact.kind] =
        (fallbackNumbers[artifact.kind] || 0) + 1;
      const displayNo =
        artifact.displayNo || fallbackNumbers[artifact.kind] || 1;
      return {
        key: `artifact:${artifact.id}`,
        refType: "artifact",
        refId: artifact.id,
        label: `${artifactKindLabel(artifact.kind)}${displayNo}`,
        preview: {
          text: artifact.name || artifact.label,
          kind: artifact.kind,
          url: artifact.previewUrl || artifact.url,
          sourceUrl: artifact.url,
        },
      };
    });
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
  return options.filter((option) => {
    const ownText = searchableText(
      `${option.label} ${option.description || ""}`,
    );
    return (
      ownText.includes(keyword) ||
      (option.materials || []).some((material) =>
        searchableText(
          `${material.label} ${material.preview?.text || ""} ${material.preview?.kind || ""}`,
        ).includes(keyword),
      )
    );
  });
}

function searchableText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/(图|视频|音频|文件)\s+(\d+)/g, "$1$2");
}

function artifactKindLabel(kind: AgentChatArtifact["kind"]) {
  if (kind === "image") return "图";
  if (kind === "video") return "视频";
  if (kind === "audio") return "音频";
  return "文件";
}

function positiveNumber(value: unknown) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
}
