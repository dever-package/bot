import {
  ArrowDown,
  Check,
  ChevronRight,
  Copy,
  FileText,
  ListTree,
  LoaderCircle,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { copyTextToClipboard } from "../clipboard";
import { AgentChatArtifactActionsProvider } from "./artifact-actions";
import {
  agentChatDocumentCopyText,
  isAgentChatDocumentPending,
  type AgentChatDocument,
} from "./document";
import {
  AgentChatDocumentOutline,
  useAgentChatDocumentOutline,
} from "./document-outline";
import { useAgentChatDocumentAutoScroll } from "./document-scroll";
import { AgentChatDocumentView } from "./document-view";
import { AGENT_CHAT_CHILD_LAYER_Z_INDEX } from "./layers";
import { AgentChatTooltip } from "./tooltip";
import type {
  AgentChatArtifactActionRenderer,
  AgentChatDocumentActionRenderer,
} from "./types";

export function AgentChatDocumentEntry({
  document,
  onOpen,
}: {
  document: AgentChatDocument;
  onOpen: (document: AgentChatDocument) => void;
}) {
  const pending = isAgentChatDocumentPending(document);
  return (
    <button
      type="button"
      className="mt-3 flex items-center gap-3 rounded-md border bg-background px-3 py-2.5 text-left transition-colors hover:bg-muted/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{ width: "min(100%, 28rem)" }}
      aria-label={`打开文档：${document.title || "生成的文档"}`}
      onClick={() => onOpen(document)}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted/70 text-muted-foreground">
        <FileText className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-foreground">
          {document.title || "生成的文档"}
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {pending ? "正在生成" : documentStatusLabel(document.status)}
        </span>
      </span>
      {pending ? (
        <LoaderCircle className="size-4 shrink-0 animate-spin text-muted-foreground" />
      ) : (
        <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
      )}
    </button>
  );
}

export function AgentChatDocumentPane({
  open,
  portalContainer,
  document: agentDocument,
  messageID,
  renderArtifactActions,
  renderDocumentActions,
  onClose,
}: {
  open: boolean;
  portalContainer?: HTMLElement | null;
  document: AgentChatDocument;
  messageID: number;
  renderArtifactActions?: AgentChatArtifactActionRenderer;
  renderDocumentActions?: AgentChatDocumentActionRenderer;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [mobileOutlineOpen, setMobileOutlineOpen] = useState(false);
  const copyInProgressRef = useRef(false);
  const resetTimerRef = useRef<number | null>(null);
  const outlineTriggerRef = useRef<HTMLButtonElement>(null);
  const outlineMenuRef = useRef<HTMLDivElement>(null);
  const failed = agentDocument.status === "failed";
  const pending = isAgentChatDocumentPending(agentDocument);
  const documentScroll = useAgentChatDocumentAutoScroll({
    documentID: agentDocument.id,
    contentVersion: agentChatDocumentContentVersion(agentDocument),
    enabled: open,
    pending,
  });
  const outline = useAgentChatDocumentOutline({
    documentID: agentDocument.id,
    enabled: open,
    contentRef: documentScroll.contentRef,
    scrollRef: documentScroll.scrollRef,
  });
  const showOutline = outline.items.length >= 2;

  useEffect(() => {
    setMobileOutlineOpen(false);
  }, [agentDocument.id, open]);

  useEffect(() => {
    if (!mobileOutlineOpen) {
      return;
    }
    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target;
      if (
        !(target instanceof Node) ||
        outlineTriggerRef.current?.contains(target) ||
        outlineMenuRef.current?.contains(target)
      ) {
        return;
      }
      setMobileOutlineOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOutlineOpen(false);
      }
    };
    window.document.addEventListener(
      "pointerdown",
      closeOnOutsidePointer,
      true,
    );
    window.document.addEventListener("keydown", closeOnEscape);
    return () => {
      window.document.removeEventListener(
        "pointerdown",
        closeOnOutsidePointer,
        true,
      );
      window.document.removeEventListener("keydown", closeOnEscape);
    };
  }, [mobileOutlineOpen]);

  useEffect(
    () => () => {
      if (resetTimerRef.current != null) {
        window.clearTimeout(resetTimerRef.current);
      }
    },
    [],
  );

  const copyDocument = async () => {
    const text = agentChatDocumentCopyText(agentDocument);
    if (!text.trim()) {
      return;
    }
    copyInProgressRef.current = true;
    try {
      await copyTextToClipboard(text);
    } catch {
      return;
    } finally {
      copyInProgressRef.current = false;
    }
    setCopied(true);
    if (resetTimerRef.current != null) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => {
      setCopied(false);
      resetTimerRef.current = null;
    }, 1800);
  };

  return (
    <Sheet
      open={open}
      modal={false}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <SheetContent
        container={portalContainer}
        side="right"
        showCloseButton={false}
        showOverlay={false}
        data-assistant-layer="true"
        layerZIndex={AGENT_CHAT_CHILD_LAYER_Z_INDEX}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          documentScroll.scrollRef.current?.focus({ preventScroll: true });
        }}
        onFocusOutside={(event) => {
          if (copyInProgressRef.current) {
            event.preventDefault();
          }
        }}
        onInteractOutside={(event) => {
          if (copyInProgressRef.current) {
            event.preventDefault();
          }
        }}
        className="flex w-[94vw] max-w-none flex-col gap-0 overflow-hidden p-0 sm:max-w-none md:w-[72vw] xl:w-[64vw] 2xl:w-[1120px]"
      >
        <SheetHeader className="flex h-14 shrink-0 flex-row items-center gap-3 border-b px-5 py-0 text-start">
          <FileText className="size-4 shrink-0 text-muted-foreground" />
          <div className="min-w-0 flex-1">
            <SheetTitle className="truncate text-sm">
              {agentDocument.title || "生成的文档"}
            </SheetTitle>
            <SheetDescription
              className={cn(
                "mt-0.5 flex items-center gap-1.5 text-xs",
                failed ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {pending && !failed ? (
                <LoaderCircle className="size-3 animate-spin" />
              ) : null}
              <span>
                {failed
                  ? "生成失败"
                  : pending
                    ? agentDocument.status === "writing"
                      ? "正文生成中"
                      : "素材生成中"
                    : documentStatusLabel(agentDocument.status)}
              </span>
            </SheetDescription>
          </div>
          {showOutline ? (
            <AgentChatTooltip label="查看文档目录">
              <Button
                ref={outlineTriggerRef}
                type="button"
                size="sm"
                variant="ghost"
                className="h-8 shrink-0 gap-1.5 px-2 xl:hidden"
                aria-label="查看文档目录"
                aria-haspopup="dialog"
                aria-expanded={mobileOutlineOpen}
                onClick={() => setMobileOutlineOpen((current) => !current)}
              >
                <ListTree className="size-4" />
                <span className="hidden sm:inline">目录</span>
              </Button>
            </AgentChatTooltip>
          ) : null}
          {renderDocumentActions?.({
            messageID,
            document: agentDocument,
            running: pending,
            error: failed,
          })}
          <AgentChatTooltip label={copied ? "已复制" : "复制文档"}>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-8 shrink-0"
              aria-label={copied ? "文档已复制" : "复制文档"}
              disabled={!agentDocument.blocks.length}
              onClick={() => void copyDocument()}
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </AgentChatTooltip>
          <AgentChatTooltip label="关闭文档">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-8 shrink-0"
              aria-label="关闭文档"
              onClick={onClose}
            >
              <X className="size-4" />
            </Button>
          </AgentChatTooltip>
        </SheetHeader>
        {showOutline && mobileOutlineOpen ? (
          <div
            ref={outlineMenuRef}
            role="dialog"
            aria-label="文档目录"
            data-assistant-layer="true"
            className="absolute right-4 top-14 z-50 overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md xl:hidden"
            style={{ width: "min(20rem, calc(100% - 2rem))" }}
          >
            <div className="border-b px-4 py-3 text-sm font-medium">目录</div>
            <div className="max-h-[60vh] overflow-y-auto px-2 py-2 overscroll-contain">
              <AgentChatDocumentOutline
                items={outline.items}
                activeID={outline.activeID}
                onSelect={(id) => {
                  outline.selectItem(id);
                  setMobileOutlineOpen(false);
                }}
              />
            </div>
          </div>
        ) : null}
        <div
          className={cn(
            "min-h-0 flex-1",
            showOutline &&
              "xl:grid xl:grid-cols-[13rem_minmax(0,1fr)]",
          )}
        >
          <aside
            className={cn(
              "hidden min-h-0 flex-col border-r bg-muted/10",
              showOutline && "xl:flex",
            )}
          >
            {showOutline ? (
              <>
                <div className="shrink-0 px-5 pb-2 pt-8 text-xs font-medium text-muted-foreground">
                  目录
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-6 overscroll-contain">
                  <AgentChatDocumentOutline
                    items={outline.items}
                    activeID={outline.activeID}
                    onSelect={outline.selectItem}
                  />
                </div>
              </>
            ) : null}
          </aside>
          <div className="relative h-full min-h-0">
            <div
              ref={documentScroll.scrollRef}
              tabIndex={-1}
              className="h-full min-h-0 overflow-y-auto overscroll-contain focus:outline-none"
              style={{ scrollbarGutter: "stable" }}
              onScroll={documentScroll.handleScroll}
            >
              <div
                ref={documentScroll.contentRef}
                className="mx-auto w-full max-w-3xl px-6 py-8 md:px-9 md:py-10"
              >
                <AgentChatArtifactActionsProvider
                  messageID={messageID}
                  render={renderArtifactActions}
                >
                  <AgentChatDocumentView
                    document={agentDocument}
                    running={pending}
                    error={failed}
                  />
                </AgentChatArtifactActionsProvider>
              </div>
            </div>
            {!documentScroll.atBottom ? (
              <AgentChatTooltip label="回到底部">
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="absolute bottom-4 right-4 z-10 size-9 rounded-full bg-background shadow-sm"
                  aria-label="回到底部"
                  onClick={() => documentScroll.scrollToBottom("smooth")}
                >
                  <ArrowDown className="size-4" />
                </Button>
              </AgentChatTooltip>
            ) : null}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function agentChatDocumentContentVersion(document: AgentChatDocument) {
  const blocks = document.blocks.map((block) => {
    const artifacts = block.artifacts
      .map(
        (artifact) =>
          `${artifact.id}:${artifact.status}:${artifact.url}:${artifact.previewUrl}`,
      )
      .join(",");
    return [
      block.id,
      block.status,
      block.text.length,
      block.text.slice(-64),
      String(block.meta.stream_revision || ""),
      artifacts,
    ].join(":");
  });
  return [document.status, document.pendingJobCount, ...blocks].join("|");
}

function documentStatusLabel(status: AgentChatDocument["status"]) {
  if (status === "failed") return "生成失败";
  if (status === "partial_failed") return "部分素材生成失败";
  if (status === "ready") return "已生成";
  if (status === "generating") return "素材生成中";
  return "正文生成中";
}
