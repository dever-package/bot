import { Loader2, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SessionActions } from "./session-actions";
import type { AgentChatController } from "./types";

export function Sidebar({
  agentName,
  agentReady,
  controller,
  collapsed = false,
  mobile = false,
  onOpenSession,
  onStartNewSession,
}: {
  agentName: string;
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
        "h-full shrink-0 flex-col bg-muted/25",
        mobile ? "flex w-full md:hidden" : "hidden border-r",
        !mobile && !collapsed && "md:flex",
      )}
      style={
        mobile ? undefined : { width: 300, minWidth: 300, flexBasis: 300 }
      }
    >
      <div className="shrink-0 border-b p-3">
        <div className="mb-3 min-w-0 truncate px-2 py-1 text-left text-sm font-semibold text-foreground">
          {agentName || "智能体"}
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full justify-start gap-2 bg-background px-3"
          title="新对话"
          disabled={controller.sessionLoading || !agentReady}
          onClick={() =>
            void (onStartNewSession
              ? onStartNewSession()
              : controller.startNewSession())
          }
        >
          <Plus className="size-4" />
          <span>新对话</span>
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 px-4 pb-2 pt-4 text-xs font-medium text-muted-foreground">
          历史会话
        </div>
        <div
          ref={controller.sessionListRef}
          className="min-h-0 flex-1 overflow-y-auto px-2 pb-3"
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
                    "group flex min-h-10 w-full items-center rounded-md px-1 transition-colors",
                    session.id === controller.sessionID
                      ? "bg-background font-medium text-foreground shadow-sm ring-1 ring-border/60"
                      : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
                  )}
                >
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-2 px-2 py-2 text-left text-sm"
                    title={session.title}
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
