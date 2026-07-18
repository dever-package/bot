import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";
import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { AgentChatSession } from "./api";
import { AGENT_CHAT_CHILD_LAYER_Z_INDEX } from "./layers";
import { AgentChatTooltip } from "./tooltip";
import type { AgentChatController } from "./types";

const SESSION_MENU_WIDTH = 152;
const SESSION_MENU_HEIGHT = 76;
const SESSION_MENU_GAP = 6;
const VIEWPORT_GAP = 8;

type MenuPosition = {
  top: number;
  left: number;
};

export function SessionActions({
  session,
  active,
  controller,
}: {
  session: AgentChatSession;
  active: boolean;
  controller: AgentChatController;
}) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [title, setTitle] = useState(session.title);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState<MenuPosition>({
    top: 0,
    left: 0,
  });
  const triggerRef = useRef<HTMLSpanElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const closeOnOutsidePointer = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (
        triggerRef.current?.contains(target) ||
        menuRef.current?.contains(target)
      ) {
        return;
      }
      setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };
    const closeOnLayoutChange = () => setMenuOpen(false);

    document.addEventListener("pointerdown", closeOnOutsidePointer, true);
    document.addEventListener("keydown", closeOnEscape);
    document.addEventListener("scroll", closeOnLayoutChange, true);
    window.addEventListener("resize", closeOnLayoutChange);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePointer, true);
      document.removeEventListener("keydown", closeOnEscape);
      document.removeEventListener("scroll", closeOnLayoutChange, true);
      window.removeEventListener("resize", closeOnLayoutChange);
    };
  }, [menuOpen]);

  const openRename = () => {
    setMenuOpen(false);
    setTitle(session.title);
    setError("");
    setRenameOpen(true);
  };

  const submitRename = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle) {
      setError("请输入会话标题");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await controller.renameSession(session.id, nextTitle);
      setRenameOpen(false);
    } catch (currentError: unknown) {
      setError(actionErrorMessage(currentError, "编辑标题失败"));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await controller.deleteSession(session.id);
      setDeleteOpen(false);
    } catch (currentError: unknown) {
      setError(actionErrorMessage(currentError, "删除会话失败"));
    } finally {
      setDeleting(false);
    }
  };

  const toggleMenu = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }
    if (!triggerRef.current) {
      return;
    }
    setMenuPosition(resolveMenuPosition(triggerRef.current));
    setMenuOpen(true);
  };

  const menu =
    menuOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={`管理会话：${session.title}`}
            data-assistant-layer="true"
            className="rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
            style={{
              position: "fixed",
              top: menuPosition.top,
              left: menuPosition.left,
              width: SESSION_MENU_WIDTH,
              zIndex: AGENT_CHAT_CHILD_LAYER_Z_INDEX,
              pointerEvents: "auto",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              role="menuitem"
              className="flex w-full items-center gap-2 rounded-sm border-0 bg-transparent px-2 py-1.5 text-left text-sm outline-none hover:bg-accent focus-visible:bg-accent"
              onClick={openRename}
            >
              <Pencil className="size-4 shrink-0" />
              编辑标题
            </button>
            <button
              type="button"
              role="menuitem"
              disabled={Boolean(session.running)}
              className="flex w-full items-center gap-2 rounded-sm border-0 bg-transparent px-2 py-1.5 text-left text-sm text-destructive outline-none hover:bg-destructive/10 focus-visible:bg-destructive/10 disabled:pointer-events-none disabled:opacity-50"
              onClick={() => {
                setMenuOpen(false);
                setError("");
                setDeleteOpen(true);
              }}
            >
              <Trash2 className="size-4 shrink-0" />
              删除
            </button>
          </div>,
          resolveMenuPortal(triggerRef.current),
        )
      : null;

  return (
    <>
      <span ref={triggerRef} className="flex shrink-0">
        <AgentChatTooltip label="会话操作">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className={cn(
              "size-7 shrink-0 text-muted-foreground transition-opacity hover:text-foreground",
              active
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100",
            )}
            aria-label={`管理会话：${session.title}`}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            onClick={toggleMenu}
          >
            <Ellipsis className="size-4" />
          </Button>
        </AgentChatTooltip>
      </span>
      {menu}

      <Dialog
        open={renameOpen}
        onOpenChange={(open) => {
          if (!saving) {
            setRenameOpen(open);
          }
        }}
      >
        <DialogContent
          data-assistant-layer="true"
          layerZIndex={AGENT_CHAT_CHILD_LAYER_Z_INDEX}
          showCloseButton={!saving}
          className="sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle>编辑标题</DialogTitle>
            <DialogDescription>修改左侧显示的会话标题。</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={submitRename}>
            <Input
              autoFocus
              value={title}
              maxLength={255}
              disabled={saving}
              aria-label="会话标题"
              onChange={(event) => setTitle(event.target.value)}
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={saving}
                onClick={() => setRenameOpen(false)}
              >
                取消
              </Button>
              <Button type="submit" disabled={saving || !title.trim()}>
                {saving ? "保存中..." : "保存"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onOpenChange={(open) => {
          if (!deleting) {
            setDeleteOpen(open);
          }
        }}
      >
        <DialogContent
          data-assistant-layer="true"
          layerZIndex={AGENT_CHAT_CHILD_LAYER_Z_INDEX}
          showCloseButton={!deleting}
          className="sm:max-w-md"
        >
          <DialogHeader>
            <DialogTitle>删除对话？</DialogTitle>
            <DialogDescription>
              删除后，“{session.title}”将从历史会话中移除。
            </DialogDescription>
          </DialogHeader>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={deleting}
              onClick={() => setDeleteOpen(false)}
            >
              取消
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={() => void confirmDelete()}
            >
              {deleting ? "删除中..." : "删除"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function actionErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.trim()) {
    return error.message.trim();
  }
  return fallback;
}

function resolveMenuPosition(trigger: HTMLElement): MenuPosition {
  const rect = trigger.getBoundingClientRect();
  const maximumLeft = Math.max(
    VIEWPORT_GAP,
    window.innerWidth - SESSION_MENU_WIDTH - VIEWPORT_GAP,
  );
  const left = Math.min(
    maximumLeft,
    Math.max(VIEWPORT_GAP, rect.right - SESSION_MENU_WIDTH),
  );
  const below = rect.bottom + SESSION_MENU_GAP;
  const fitsBelow =
    below + SESSION_MENU_HEIGHT <= window.innerHeight - VIEWPORT_GAP;
  const top = fitsBelow
    ? below
    : Math.max(VIEWPORT_GAP, rect.top - SESSION_MENU_HEIGHT - SESSION_MENU_GAP);

  return { top, left };
}

function resolveMenuPortal(trigger: HTMLElement | null): HTMLElement {
  return (
    trigger?.closest<HTMLElement>('[data-agent-chat-layer="true"]') ||
    document.body
  );
}
