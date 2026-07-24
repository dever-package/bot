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
  running,
  error,
}: {
  document: AgentChatDocument;
  running: boolean;
  error: boolean;
}) {
  const waitingForBlock =
    running &&
    document.status === "writing" &&
    document.blocks.length > 0;

  return (
    <div className="agent-chat-document min-w-0">
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
      {document.blocks.length === 0 && running ? (
        <DocumentWaitingIndicator />
      ) : null}
      {document.blocks.length === 0 && document.status === "failed" ? (
        <DocumentFailure message={documentFailureMessage(document)} />
      ) : null}
      {waitingForBlock ? <DocumentTail /> : null}
      {!running && isAgentChatDocumentPending(document) ? (
        <DocumentTail />
      ) : null}
    </div>
  );
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
    <div data-agent-document-block-id={block.id}>
      <AgentChatMarkdown
        text={text}
        error={error}
        className="agent-chat-document-text"
      />
    </div>
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

function DocumentFailure({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-destructive">
      <CircleAlert className="size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

function documentFailureMessage(document: AgentChatDocument) {
  const message = document.meta.error;
  return typeof message === "string" && message.trim()
    ? message.trim()
    : "文档生成失败，请重新生成。";
}

function DocumentTail() {
  return (
    <div
      role="status"
      aria-label="正在继续生成图文内容"
      className="agent-chat-next-step-indicator"
    >
      <span className="agent-chat-pulse-dot" />
    </div>
  );
}
