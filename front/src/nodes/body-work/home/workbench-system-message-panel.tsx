import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
} from "react";
import {
  Bell,
  CircleAlert,
  ExternalLink,
  LoaderCircle,
  Pin,
  RefreshCw,
  X,
} from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  getCompatModule,
} from "@dever/front-plugin";
import { BodySiteBrand } from "../auth/site-brand";
import type { BodySiteConfig } from "../auth/site-config";
import { ConfiguredMenuIcon } from "../shared/configured-icon";
import {
  loadWorkbenchSystemMessages,
  type WorkbenchSystemMessage,
} from "./workbench-api";

type MessageContentViewProps = {
  output?: unknown;
  emptyText?: string;
  className?: string;
  markdownClassName?: string;
  richClassName?: string;
  mediaLayout?: "default" | "chat" | "detail";
};

const contentViewModule = getCompatModule(
  "@/components/energon/content-view",
) as {
  ContentView?: ComponentType<MessageContentViewProps>;
  EnergonContentView?: ComponentType<MessageContentViewProps>;
};
const MessageContentView =
  contentViewModule.ContentView || contentViewModule.EnergonContentView;

export function WorkbenchSystemMessagePanel({
  site,
}: {
  site: BodySiteConfig;
}) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] =
    useState<WorkbenchSystemMessage | null>(null);
  const messages = useSystemMessages(open);
  const messageMenu = site.homeMenu.messages;

  useEffect(() => {
    if (!open) {
      return;
    }
    const closeFromOutside = (event: PointerEvent) => {
      if (
        !selectedMessage &&
        !rootRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    const closeFromEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !selectedMessage) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeFromOutside);
    document.addEventListener("keydown", closeFromEscape);
    return () => {
      document.removeEventListener("pointerdown", closeFromOutside);
      document.removeEventListener("keydown", closeFromEscape);
    };
  }, [open, selectedMessage]);

  return (
    <>
      <div ref={rootRef} className="hb-system-message-root">
        <button
          type="button"
          className="hb-rail-action"
          title={messageMenu.name}
          aria-label={`打开${messageMenu.name}`}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
        >
          <ConfiguredMenuIcon
            iconName={messageMenu.icon}
            iconImage={messageMenu.iconImage}
            fallbackIcon={Bell}
            className="hb-configured-menu-icon"
            strokeWidth={1.8}
          />
          <span>{messageMenu.name}</span>
        </button>

        {open ? (
          <aside className="hb-system-message-panel" aria-label="消息中心">
            <header className="hb-system-message-header">
              <strong>消息中心</strong>
              <button
                type="button"
                className="hb-system-message-icon-button"
                title="关闭"
                aria-label="关闭消息中心"
                onClick={() => setOpen(false)}
              >
                <X />
              </button>
            </header>

            <div className="hb-system-message-filter" aria-label="消息类型">
              <span>官方消息</span>
            </div>

            <div className="hb-system-message-list" aria-live="polite">
              {messages.loading && messages.items.length === 0 ? (
                <SystemMessageLoading />
              ) : null}
              {!messages.loading && messages.error ? (
                <SystemMessageError
                  message={messages.error}
                  onRetry={messages.reload}
                />
              ) : null}
              {!messages.loading &&
              !messages.error &&
              messages.items.length === 0 ? (
                <SystemMessageEmpty />
              ) : null}
              {!messages.error
                ? messages.items.map((message) => (
                    <SystemMessageRow
                      key={message.id}
                      site={site}
                      message={message}
                      onOpen={() => setSelectedMessage(message)}
                      onNavigate={() => setOpen(false)}
                    />
                  ))
                : null}
            </div>
          </aside>
        ) : null}
      </div>

      <SystemMessageDetail
        message={selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />
    </>
  );
}

function useSystemMessages(open: boolean) {
  const [reloadKey, setReloadKey] = useState(0);
  const [items, setItems] = useState<WorkbenchSystemMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }
    let active = true;
    setError("");
    setLoading(true);
    loadWorkbenchSystemMessages()
      .then((messages) => {
        if (active) {
          setItems(messages);
        }
      })
      .catch((currentError) => {
        if (active) {
          setError(
            currentError instanceof Error
              ? currentError.message
              : "加载系统消息失败",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [open, reloadKey]);

  return {
    items,
    loading,
    error,
    reload: () => setReloadKey((current) => current + 1),
  };
}

function SystemMessageRow({
  site,
  message,
  onOpen,
  onNavigate,
}: {
  site: BodySiteConfig;
  message: WorkbenchSystemMessage;
  onOpen: () => void;
  onNavigate: () => void;
}) {
  const content = (
    <>
      <span className="hb-system-message-mark" aria-hidden="true">
        <BodySiteBrand
          site={site}
          className="hb-system-message-brand"
          logoClassName="hb-system-message-brand-logo"
          nameClassName="hb-system-message-brand-name"
        />
      </span>
      <span className="hb-system-message-copy">
        <span className="hb-system-message-title-row">
          <strong>{message.title}</strong>
          {message.pinned ? <Pin aria-label="置顶消息" /> : null}
          {message.url ? <ExternalLink aria-hidden="true" /> : null}
        </span>
        <span className="hb-system-message-content">{message.content}</span>
        <time dateTime={message.publishedAt}>
          {formatSystemMessageAge(message.publishedAt)}
        </time>
      </span>
    </>
  );

  if (message.url) {
    return (
      <a
        className="hb-system-message-row"
        href={message.url}
        target="_blank"
        rel="noreferrer noopener"
        onClick={onNavigate}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      type="button"
      className="hb-system-message-row"
      aria-haspopup="dialog"
      onClick={onOpen}
    >
      {content}
    </button>
  );
}

function SystemMessageDetail({
  message,
  onClose,
}: {
  message: WorkbenchSystemMessage | null;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={Boolean(message)}
      onOpenChange={(nextOpen: boolean) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="hb-system-message-detail sm:max-w-2xl">
        <DialogHeader className="hb-system-message-detail-header">
          <DialogTitle>系统消息</DialogTitle>
          <DialogDescription className="sr-only">
            查看官方消息详情
          </DialogDescription>
        </DialogHeader>

        <div className="hb-system-message-detail-body">
          <header className="hb-system-message-detail-article-header">
            <h2>{message?.title || "系统消息"}</h2>
            <time dateTime={message?.publishedAt || ""}>
              {formatSystemMessageDate(message?.publishedAt || "")}
            </time>
          </header>
          {message && MessageContentView ? (
            <MessageContentView
              output={{ text: message.content }}
              emptyText="暂无消息内容。"
              markdownClassName="hb-system-message-detail-content"
              richClassName="hb-system-message-detail-content"
              mediaLayout="detail"
            />
          ) : (
            <p className="hb-system-message-detail-content">
              {message?.content || "暂无消息内容。"}
            </p>
          )}
        </div>

        <DialogFooter className="hb-system-message-detail-footer">
          <Button onClick={onClose}>我知道了</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function SystemMessageLoading() {
  return (
    <div className="hb-system-message-state">
      <LoaderCircle className="is-spinning" />
      <span>正在加载官方消息</span>
    </div>
  );
}

function SystemMessageEmpty() {
  return (
    <div className="hb-system-message-state">
      <Bell />
      <span>暂无官方消息</span>
    </div>
  );
}

function SystemMessageError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="hb-system-message-state is-error">
      <CircleAlert />
      <span>{message}</span>
      <button
        type="button"
        className="hb-system-message-icon-button"
        title="重新加载"
        aria-label="重新加载官方消息"
        onClick={onRetry}
      >
        <RefreshCw />
      </button>
    </div>
  );
}

function formatSystemMessageAge(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  const elapsed = Math.max(0, Date.now() - parsed.getTime());
  const minutes = Math.floor(elapsed / 60_000);
  if (minutes < 1) {
    return "刚刚";
  }
  if (minutes < 60) {
    return `${minutes}分钟前`;
  }
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}小时前`;
  }
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days}天前`;
  }
  return formatSystemMessageDate(value, false);
}

function formatSystemMessageDate(value: string, includeTime = true) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  const now = new Date();
  const includeYear = parsed.getFullYear() !== now.getFullYear();
  return new Intl.DateTimeFormat("zh-CN", {
    ...(includeYear ? { year: "numeric" as const } : {}),
    month: "long",
    day: "numeric",
    ...(includeTime
      ? {
          hour: "2-digit" as const,
          minute: "2-digit" as const,
          hour12: false,
        }
      : {}),
  }).format(parsed);
}
