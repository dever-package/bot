import { useCallback, useMemo } from "react";
import { useStore } from "zustand";
import { Plus, X } from "lucide-react";
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
import type { AgentChatRuntimeApis } from "./types";
import {
  AGENT_CHAT_LAYER_CLASS,
  AGENT_CHAT_LAYER_Z_INDEX,
} from "./layers";

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
  const modalOpen = useStore(store, () =>
    openPath ? Boolean(getStoreValueByPath(store, openPath)) : true,
  );
  const fullScreen = Boolean(openPath);
  const containerHeight =
    valueText(item.meta?.height || item.meta?.containerHeight) ||
    "min(78dvh, 720px)";
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
        item.meta?.archiveSessionApi ||
          "/bot/admin/assistant/archive_session",
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
    }),
    [
      item.meta?.requestApi,
      item.meta?.statusApi,
      item.meta?.stopApi,
      item.meta?.streamApi,
    ],
  );
  const controller = useAgentChatStore({
    agentKey,
    modalOpen,
    blockMs: Number(item.meta?.blockMs || 1000),
    assistantApi,
    runtimeApi,
  });
  const closeDialog = useCallback(() => {
    if (openPath) {
      store.getState().setValueByPath(openPath, false);
    }
  }, [openPath, store]);

  if (openPath && !modalOpen) {
    return null;
  }

  const chatContent = (
    <div
      data-agent-chat-layer="true"
      className={cn(
        "flex min-h-0 w-full flex-col overflow-hidden bg-background md:flex-row",
        fullScreen ? "h-full flex-1" : "border-y",
      )}
      style={
        fullScreen
          ? undefined
          : { height: containerHeight, minHeight: "min(420px, 78dvh)" }
      }
    >
      <Sidebar
        agentName={agentName}
        agentReady={Boolean(agentKey)}
        controller={controller}
      />

      <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-background">
        <header className="flex h-12 shrink-0 items-center gap-3 px-3 md:h-14 md:px-6">
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
            onClick={() => void controller.startNewSession()}
          >
            <Plus className="size-4" />
            <span className="sr-only">新对话</span>
          </Button>
          {fullScreen ? (
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="size-10 shrink-0 md:size-8"
              title="关闭运行智能体"
              onClick={closeDialog}
            >
              <X className="size-4" />
              <span className="sr-only">关闭运行智能体</span>
            </Button>
          ) : null}
        </header>

        <RuntimeProvider
          key={`${agentKey}:${controller.sessionID || "loading"}`}
          controller={controller}
        >
          <Thread controller={controller} />
        </RuntimeProvider>
      </section>
    </div>
  );

  if (!fullScreen) {
    return chatContent;
  }

  return (
    <Dialog
      open={modalOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeDialog();
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
