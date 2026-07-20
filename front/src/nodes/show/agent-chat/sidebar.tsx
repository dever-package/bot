import { Loader2, MessageSquare, Plus } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SessionActions } from "./session-actions";
import type { AgentChatController } from "./types";

export function Sidebar({
  agentName,
  title,
  agentReady,
  controller,
  collapsed = false,
  mobile = false,
  onOpenSession,
  onStartNewSession,
}: {
  agentName: string;
  title?: ReactNode;
  agentReady: boolean;
  controller: AgentChatController;
  collapsed?: boolean;
  mobile?: boolean;
  onOpenSession?: (sessionID: number) => Promise<void>;
  onStartNewSession?: () => Promise<void>;
}) {
  return (
    <aside
      className={cn(
        "agent-chat-sidebar h-full shrink-0 flex-col bg-muted/25",
        mobile ? "flex w-full md:hidden" : "hidden border-r",
        !mobile && !collapsed && "md:flex",
      )}
      style={
        mobile
          ? undefined
          : {
              width: "var(--agent-chat-sidebar-width, 300px)",
              minWidth: "var(--agent-chat-sidebar-width, 300px)",
              flexBasis: "var(--agent-chat-sidebar-width, 300px)",
            }
      }
    >
      <div className="agent-chat-sidebar-header shrink-0 border-b p-3">
        <div className="agent-chat-sidebar-controls flex min-w-0 items-center gap-2">
          <div className="agent-chat-sidebar-name min-w-0 flex-1 truncate px-2 py-1 text-left text-sm font-semibold text-foreground">
            {title ?? (agentName || "智能体")}
          </div>
          <Button
            type="button"
            variant="outline"
            className="agent-chat-new-session h-10 shrink-0 justify-start gap-2 bg-background px-3"
            disabled={controller.sessionLoading || !agentReady}
            onClick={() =>
              void (onStartNewSession
                ? onStartNewSession()
                : controller.startNewSession())
            }
          >
            <span className="agent-chat-new-session-icon contents">
              <Plus className="size-4" />
            </span>
            <span>新对话</span>
          </Button>
        </div>
      </div>

      <div className="agent-chat-session-section flex min-h-0 flex-1 flex-col">
        <div className="agent-chat-session-heading shrink-0 px-4 pb-2 pt-4 text-xs font-medium text-muted-foreground">
          历史会话
        </div>
        <div
          ref={controller.sessionListRef}
          className="agent-chat-session-list min-h-0 flex-1 overflow-y-auto px-2 pb-3"
          onScroll={(event) =>
            controller.handleSessionListScroll(event.currentTarget)
          }
        >
          {controller.sessionsLoading && controller.sessions.length === 0 ? (
            <div className="flex h-24 items-center justify-center text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
            </div>
          ) : controller.sessions.length === 0 ? (
            <div className="px-2 py-6 text-center text-xs leading-5 text-muted-foreground">
              暂无历史会话
            </div>
          ) : (
            <div className="space-y-1">
              {controller.sessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "agent-chat-session-item group flex min-h-10 w-full items-center rounded-md px-1 transition-colors",
                    session.id === controller.sessionID
                      ? "bg-background font-medium text-foreground shadow-sm ring-1 ring-border/60"
                      : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
                  )}
                >
                  <button
                    type="button"
                    className="agent-chat-session-trigger flex min-w-0 flex-1 items-center gap-2 px-2 py-2 text-left text-sm"
                    onClick={() =>
                      void (onOpenSession
                        ? onOpenSession(session.id)
                        : controller.openSession(session.id))
                    }
                  >
                    {session.running ? (
                      <Loader2 className="size-3.5 shrink-0 animate-spin" />
                    ) : (
                      <MessageSquare className="size-3.5 shrink-0" />
                    )}
                    <span className="min-w-0 flex-1 truncate">
                      {session.title}
                    </span>
                  </button>
                  <SessionActions
                    session={session}
                    active={session.id === controller.sessionID}
                    controller={controller}
                  />
                </div>
              ))}
              {controller.sessionsLoadingMore ? (
                <div className="flex h-10 items-center justify-center text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
