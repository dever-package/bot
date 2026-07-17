import { CircleAlert } from "lucide-react";
import { AgentChatActivityView } from "./activity-view";
import type { AgentChatActivity } from "./activity";
import {
  isAgentChatDocumentPending,
  isAgentChatDocumentMediaReady,
  normalizeAgentChatDocumentBlockText,
  type AgentChatDocument,
  type AgentChatDocumentBlock,
} from "./document";
import { AgentChatMarkdown } from "./markdown";
import { readAgentChatAspectRatio } from "./media";

export function AgentChatDocumentView({
  document,
  sourceText,
  running,
  error,
}: {
  document: AgentChatDocument;
  sourceText: string;
  running: boolean;
  error: boolean;
}) {
  const intro = documentIntro(document);
  const bodySource = stripDocumentIntro(sourceText, intro);
  const pendingText = running
    ? resolvePendingDocumentText(bodySource, document.blocks)
    : "";
  const waitingForBlock =
    running &&
    document.status === "writing" &&
    !pendingText &&
    document.blocks.length > 0;

  return (
    <div className="agent-chat-document min-w-0">
      {intro ? (
        <AgentChatMarkdown text={intro} error={error} className="mb-5" />
      ) : null}
      {document.title ? (
        <h1 className="mb-5 text-xl font-semibold leading-tight">
          {document.title}
        </h1>
      ) : null}
      {document.blocks.map((block) =>
        block.type === "media" ? (
          <DocumentMediaBlock key={block.id} block={block} />
        ) : (
          <DocumentTextBlock
            key={block.id}
            block={block}
            title={document.title}
            error={error}
          />
        ),
      )}
      {pendingText ? (
        <AgentChatMarkdown
          text={pendingText}
          streaming
          error={error}
          className="agent-chat-document-text"
        />
      ) : null}
      {document.blocks.length === 0 && !pendingText && running ? (
        <DocumentWaitingIndicator />
      ) : null}
      {waitingForBlock ? <DocumentTail /> : null}
      {!running && isAgentChatDocumentPending(document) ? (
        <DocumentTail />
      ) : null}
    </div>
  );
}

function documentIntro(document: AgentChatDocument) {
  return typeof document.meta.intro === "string"
    ? document.meta.intro.trim()
    : "";
}

function stripDocumentIntro(sourceText: string, intro: string) {
  const source = String(sourceText || "");
  if (!intro) {
    return source;
  }
  const position = source.indexOf(intro);
  if (position < 0) {
    return source;
  }
  return `${source.slice(0, position)}${source.slice(position + intro.length)}`.trimStart();
}

function DocumentTextBlock({
  block,
  title,
  error,
}: {
  block: AgentChatDocumentBlock;
  title: string;
  error: boolean;
}) {
  const text = normalizeAgentChatDocumentBlockText(block.text, title);
  if (!text) {
    return null;
  }
  return (
    <AgentChatMarkdown
      text={text}
      error={error}
      className="agent-chat-document-text"
    />
  );
}

function DocumentMediaBlock({ block }: { block: AgentChatDocumentBlock }) {
  if (block.status === "failed") {
    return (
      <div className="my-4 flex items-center gap-2 text-sm text-destructive">
        <CircleAlert className="size-4 shrink-0" />
        <span>{mediaLabel(block.mediaKind)}生成失败</span>
      </div>
    );
  }
  return <AgentChatActivityView activity={documentBlockActivity(block)} />;
}

function documentBlockActivity(
  block: AgentChatDocumentBlock,
): AgentChatActivity {
  const progress = Number(block.meta.progress);
  const ready = isAgentChatDocumentMediaReady(block);
  return {
    id: `document-block-${block.id}`,
    title: `${mediaLabel(block.mediaKind)}生成`,
    kind: block.mediaKind,
    status: ready ? "succeeded" : "running",
    text:
      typeof block.meta.progress_text === "string"
        ? block.meta.progress_text
        : `${mediaLabel(block.mediaKind)}生成中`,
    error: "",
    progress: Number.isFinite(progress)
      ? Math.max(0, Math.min(100, Math.round(progress)))
      : null,
    count: Math.max(1, block.artifacts.length),
    aspectRatio:
      readAgentChatAspectRatio(
        block.meta,
        block.artifacts.map((artifact) => artifact.meta),
      ) || (block.mediaKind === "video" ? "16 / 9" : "4 / 3"),
    anchorText: "",
    output: { artifacts: block.artifacts },
  };
}

function resolvePendingDocumentText(
  sourceText: string,
  blocks: AgentChatDocumentBlock[],
) {
  const source = String(sourceText || "");
  if (!source) {
    return "";
  }
  let cursor = 0;
  let foundTextBlock = false;
  for (const block of blocks) {
    if (block.type !== "text" || !block.text) {
      continue;
    }
    const position = source.indexOf(block.text, cursor);
    if (position < 0) {
      return "";
    }
    foundTextBlock = true;
    cursor = position + block.text.length;
  }
  return (foundTextBlock ? source.slice(cursor) : source).trimStart();
}

function mediaLabel(kind: AgentChatDocumentBlock["mediaKind"]) {
  if (kind === "image") return "图片";
  if (kind === "video") return "视频";
  if (kind === "audio") return "音频";
  return "文件";
}

function DocumentWaitingIndicator() {
  return (
    <div
      role="status"
      aria-label="正在组织图文内容"
      className="agent-chat-waiting-indicator"
    >
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="agent-chat-waiting-dot"
          style={{ animationDelay: `${index * 140}ms` }}
        />
      ))}
    </div>
  );
}

function DocumentTail() {
  return (
    <div
      role="status"
      aria-label="正在继续生成图文内容"
      className="agent-chat-next-step-indicator"
    >
      <span className="agent-chat-next-step-dot" />
    </div>
  );
}
