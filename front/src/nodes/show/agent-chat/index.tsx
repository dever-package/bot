import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useStore } from "zustand";
import { ArrowLeft, Plus, X } from "lucide-react";
import type { NodeItemProps } from "@/page/nodes";
import { getStoreValueByPath } from "@/lib/store";
import { streamValueText as valueText } from "@/lib/stream";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AgentChatApi } from "./api";
import { RuntimeProvider } from "./provider";
import { Sidebar } from "./sidebar";
import { useAgentChatStore } from "./store";
import { Thread } from "./thread";
import {
  AgentChatMediaInspector,
  AgentChatMediaPreviewProvider,
  useAgentChatMediaInspector,
} from "./media-inspector";
import type {
  AgentChatArtifactActionRenderer,
  AgentChatMessageActionContext,
  AgentChatRuntimeApis,
} from "./types";
import type {
  ReferenceProvider,
  ReferenceUploadedFile,
} from "./reference";
import { AGENT_CHAT_LAYER_CLASS, AGENT_CHAT_LAYER_Z_INDEX } from "./layers";

export type AgentChatPanelProps = {
  agentKey: string;
  agentName?: string;
  contextKey?: string;
  open?: boolean;
  height?: string;
  minHeight?: string;
  fullScreen?: boolean;
  lazySession?: boolean;
  mobileSessionNavigation?: boolean;
  appearance?: "default" | "body";
  sidebarTitle?: ReactNode;
  clipboardImageUploadRuleId?: number;
  uploadBizKey?: string;
  uploadBizName?: string;
  allowResourceLibrary?: boolean;
  onUploadedFiles?: (
    files: ReferenceUploadedFile[],
  ) => void | Promise<void>;
  blockMs?: number;
  assistantApi: AgentChatApi;
  runtimeApi: AgentChatRuntimeApis;
  requestScope?: Record<string, unknown>;
  referenceProviders?: ReferenceProvider[];
  renderMessageActions?: (
    message: AgentChatMessageActionContext,
  ) => ReactNode;
  renderArtifactActions?: AgentChatArtifactActionRenderer;
  onClose?: () => void;
};

export function ShowAgentChat({ item, store }: NodeItemProps) {
  const agentKey = useStore(store, () =>
    valueText(getStoreValueByPath(store, String(item.meta?.agentPath || ""))),
  );
  const agentName = useStore(store, () =>
    valueText(
      getStoreValueByPath(store, String(item.meta?.agentNamePath || "")),
    ),
  );
  const openPath = String(item.meta?.openPath || "");
  const open = useStore(store, () =>
    openPath ? Boolean(getStoreValueByPath(store, openPath)) : true,
  );
  const assistantApi = useMemo<AgentChatApi>(
    () => ({
      session: String(item.meta?.sessionApi || "/bot/admin/assistant/session"),
      sessions: String(
        item.meta?.sessionsApi || "/bot/admin/assistant/sessions",
      ),
      newSession: String(
        item.meta?.newSessionApi || "/bot/admin/assistant/new_session",
      ),
      renameSession: String(
        item.meta?.renameSessionApi || "/bot/admin/assistant/rename_session",
      ),
      archiveSession: String(
        item.meta?.archiveSessionApi || "/bot/admin/assistant/archive_session",
      ),
    }),
    [
      item.meta?.archiveSessionApi,
      item.meta?.newSessionApi,
      item.meta?.renameSessionApi,
      item.meta?.sessionApi,
      item.meta?.sessionsApi,
    ],
  );
  const runtimeApi = useMemo<AgentChatRuntimeApis>(
    () => ({
      request: String(item.meta?.requestApi || "/bot/admin/agent_runtime/run"),
      stream: String(item.meta?.streamApi || "/bot/admin/agent_runtime/stream"),
      stop: String(item.meta?.stopApi || "/bot/admin/agent_runtime/stop"),
      status: String(item.meta?.statusApi || "/bot/admin/agent_runtime/status"),
      referencePreview: String(
        item.meta?.referencePreviewApi ||
          "/bot/admin/agent_runtime/reference_preview",
      ),
      inputConfig: String(
        item.meta?.inputConfigApi || "/bot/admin/agent_runtime/input_config",
      ),
      document: String(
        item.meta?.documentApi || "/bot/admin/agent_runtime/document",
      ),
      documentStream: String(
        item.meta?.documentStreamApi ||
          "/bot/admin/agent_runtime/document_stream",
      ),
    }),
    [
      item.meta?.documentApi,
      item.meta?.documentStreamApi,
      item.meta?.inputConfigApi,
      item.meta?.referencePreviewApi,
      item.meta?.requestApi,
      item.meta?.statusApi,
      item.meta?.stopApi,
      item.meta?.streamApi,
    ],
  );
  const close = useCallback(() => {
    if (openPath) {
      store.getState().setValueByPath(openPath, false);
    }
  }, [openPath, store]);

  return (
    <AgentChatPanel
      agentKey={agentKey}
      agentName={agentName}
      open={open}
      fullScreen={Boolean(openPath)}
      height={
        valueText(item.meta?.height || item.meta?.containerHeight) ||
        "min(78dvh, 720px)"
      }
      clipboardImageUploadRuleId={Number(
        item.meta?.clipboardImageUploadRuleId || 0,
      )}
      blockMs={Number(item.meta?.blockMs || 1000)}
      assistantApi={assistantApi}
      runtimeApi={runtimeApi}
      onClose={close}
    />
  );
}

export function AgentChatPanel({
  agentKey,
  agentName = "",
  contextKey,
  open = true,
  height = "min(78dvh, 720px)",
  minHeight = "min(420px, 78dvh)",
  fullScreen = false,
  lazySession = false,
  mobileSessionNavigation = false,
  appearance = "default",
  sidebarTitle,
  clipboardImageUploadRuleId = 0,
  uploadBizKey,
  uploadBizName,
  allowResourceLibrary = true,
  onUploadedFiles,
  blockMs = 1000,
  assistantApi,
  runtimeApi,
  requestScope,
  referenceProviders,
  renderMessageActions,
  renderArtifactActions,
  onClose,
}: AgentChatPanelProps) {
  const controller = useAgentChatStore({
    agentKey,
    contextKey,
    modalOpen: open,
    blockMs,
    lazySession,
    assistantApi,
    runtimeApi,
    requestScope,
  });
  const mediaInspector = useAgentChatMediaInspector();
  const dockedMediaInspector =
    mediaInspector.open &&
    mediaInspector.request?.kind !== "audio" &&
    mediaInspector.request?.kind !== "file";
  const [mobilePane, setMobilePane] = useState<"sessions" | "chat">("chat");

  useEffect(() => {
    mediaInspector.closePreview();
  }, [agentKey, controller.sessionID, mediaInspector.closePreview, open]);

  useEffect(() => {
    setMobilePane("chat");
  }, [agentKey, contextKey, mobileSessionNavigation]);

  const openMobileSession = useCallback(
    async (sessionID: number) => {
      await controller.openSession(sessionID);
      setMobilePane("chat");
    },
    [controller.openSession],
  );
  const startMobileSession = useCallback(async () => {
    await controller.startNewSession();
    setMobilePane("chat");
  }, [controller.startNewSession]);

  if (!open) {
    return null;
  }

  const chatContent = (
    <AgentChatMediaPreviewProvider controller={mediaInspector}>
      <div
        data-agent-chat-layer="true"
        data-agent-chat-appearance={appearance}
        data-media-inspector-open={dockedMediaInspector ? "true" : undefined}
        className={cn(
          "relative flex min-h-0 w-full flex-col overflow-hidden bg-background md:flex-row",
          fullScreen ? "h-full flex-1" : "border-y",
        )}
        style={
          fullScreen ? undefined : { height, minHeight }
        }
      >
        <Sidebar
          agentName={agentName}
          title={sidebarTitle}
          agentReady={Boolean(agentKey)}
          controller={controller}
          collapsed={dockedMediaInspector}
        />

        {mobileSessionNavigation && mobilePane === "sessions" ? (
          <Sidebar
            mobile
            agentName={agentName}
            title={sidebarTitle}
            agentReady={Boolean(agentKey)}
            controller={controller}
            onOpenSession={openMobileSession}
            onStartNewSession={startMobileSession}
          />
        ) : null}

        <section
          className={cn(
            "min-h-0 min-w-0 flex-1 flex-col bg-background",
            mobileSessionNavigation && mobilePane === "sessions"
              ? "hidden md:flex"
              : "flex",
            dockedMediaInspector &&
              "md:w-[38vw] md:min-w-[360px] md:max-w-[640px] md:flex-none",
          )}
        >
          <header className="agent-chat-header flex h-12 shrink-0 items-center gap-2 px-3 md:h-14 md:px-6">
            {mobileSessionNavigation ? (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-10 shrink-0 md:hidden"
                title="返回会话列表"
                onClick={() => setMobilePane("sessions")}
              >
                <ArrowLeft className="size-4" />
                <span className="sr-only">返回会话列表</span>
              </Button>
            ) : null}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-foreground">
                {controller.sessionTitle || "新会话"}
              </div>
            </div>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-10 shrink-0 md:hidden"
              title="新对话"
              disabled={controller.sessionLoading || !agentKey}
              onClick={() => void startMobileSession()}
            >
              <Plus className="size-4" />
              <span className="sr-only">新对话</span>
            </Button>
            {fullScreen && !mediaInspector.open ? (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="size-10 shrink-0 md:size-8"
                title="关闭运行智能体"
                onClick={onClose}
              >
                <X className="size-4" />
                <span className="sr-only">关闭运行智能体</span>
              </Button>
            ) : null}
          </header>

          <RuntimeProvider
            key={`${agentKey}:${contextKey || "default"}:${controller.sessionID || "draft"}`}
            controller={controller}
          >
            <Thread
              controller={controller}
              clipboardImageUploadRuleId={clipboardImageUploadRuleId}
              uploadBizKey={uploadBizKey}
              uploadBizName={uploadBizName}
              allowResourceLibrary={allowResourceLibrary}
              onUploadedFiles={onUploadedFiles}
              referenceProviders={referenceProviders}
              renderMessageActions={renderMessageActions}
              renderArtifactActions={renderArtifactActions}
            />
          </RuntimeProvider>
        </section>

        <AgentChatMediaInspector
          controller={mediaInspector}
          renderArtifactActions={renderArtifactActions}
        />
      </div>
    </AgentChatMediaPreviewProvider>
  );

  if (!fullScreen) {
    return chatContent;
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose?.();
        }
      }}
    >
      <DialogContent
        layerClassName={AGENT_CHAT_LAYER_CLASS}
        layerZIndex={AGENT_CHAT_LAYER_Z_INDEX}
        showCloseButton={false}
        className="!fixed !left-0 !top-0 !flex !h-[100dvh] !max-h-[100dvh] !w-screen !max-w-none !translate-x-0 !translate-y-0 !flex-col !gap-0 !overflow-hidden !rounded-none !border-0 bg-background !p-0 text-foreground shadow-none sm:!max-w-none"
        style={{
          position: "fixed",
          inset: 0,
          left: 0,
          top: 0,
          width: "100vw",
          maxWidth: "none",
          height: "100dvh",
          maxHeight: "100dvh",
          transform: "none",
          translate: "0 0",
          display: "flex",
          flexDirection: "column",
          gap: 0,
          padding: 0,
          border: 0,
          borderRadius: 0,
          boxSizing: "border-box",
          pointerEvents: "auto",
        }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>运行智能体</DialogTitle>
          <DialogDescription>
            {agentName || agentKey || "智能体对话"}
          </DialogDescription>
        </DialogHeader>
        {chatContent}
      </DialogContent>
    </Dialog>
  );
}
