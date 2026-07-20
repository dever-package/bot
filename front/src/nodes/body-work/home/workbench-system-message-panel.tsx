import { useEffect, useRef, useState } from "react";
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
  loadWorkbenchSystemMessages,
  type WorkbenchSystemMessage,
} from "./workbench-api";

export function WorkbenchSystemMessagePanel() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [items, setItems] = useState<WorkbenchSystemMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }
    let active = true;
    setItems([]);
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

  useEffect(() => {
    if (!open) {
      return;
    }
    const closeFromOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const closeFromEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeFromOutside);
    document.addEventListener("keydown", closeFromEscape);
    return () => {
      document.removeEventListener("pointerdown", closeFromOutside);
      document.removeEventListener("keydown", closeFromEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="hb-system-message-root">
      <button
        type="button"
        className="hb-rail-action"
        title="消息"
        aria-label="打开系统消息"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <Bell strokeWidth={1.8} />
        <span>消息</span>
      </button>

      {open ? (
        <section className="hb-system-message-panel" aria-label="系统消息">
          <header className="hb-system-message-header">
            <div>
              <strong>系统消息</strong>
            </div>
            <button
              type="button"
              className="hb-system-message-icon-button"
              title="关闭"
              aria-label="关闭系统消息"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>
          </header>

          <div className="hb-system-message-list" aria-live="polite">
            {loading ? <SystemMessageLoading /> : null}
            {!loading && error ? (
              <SystemMessageError
                message={error}
                onRetry={() => setReloadKey((current) => current + 1)}
              />
            ) : null}
            {!loading && !error && items.length === 0 ? (
              <SystemMessageEmpty />
            ) : null}
            {!loading && !error
              ? items.map((message) => (
                  <SystemMessageRow
                    key={message.id}
                    message={message}
                    onNavigate={() => setOpen(false)}
                  />
                ))
              : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function SystemMessageRow({
  message,
  onNavigate,
}: {
  message: WorkbenchSystemMessage;
  onNavigate: () => void;
}) {
  const content = (
    <>
      <span className="hb-system-message-mark" aria-hidden="true">
        {message.pinned ? <Pin /> : <Bell />}
      </span>
      <span className="hb-system-message-copy">
        <span className="hb-system-message-title-row">
          <strong>{message.title}</strong>
          {message.url ? <ExternalLink aria-hidden="true" /> : null}
        </span>
        {message.content ? (
          <span className="hb-system-message-content" title={message.content}>
            {message.content}
          </span>
        ) : null}
        <time dateTime={message.publishedAt}>
          {formatSystemMessageTime(message.publishedAt)}
        </time>
      </span>
    </>
  );

  if (!message.url) {
    return <article className="hb-system-message-row">{content}</article>;
  }
  return (
    <a
      className="hb-system-message-row is-link"
      href={message.url}
      target="_blank"
      rel="noreferrer noopener"
      onClick={onNavigate}
    >
      {content}
    </a>
  );
}

function SystemMessageLoading() {
  return (
    <div className="hb-system-message-state">
      <LoaderCircle className="is-spinning" />
      <span>加载中</span>
    </div>
  );
}

function SystemMessageEmpty() {
  return (
    <div className="hb-system-message-state">
      <Bell />
      <span>暂无系统消息</span>
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
        aria-label="重新加载系统消息"
        onClick={onRetry}
      >
        <RefreshCw />
      </button>
    </div>
  );
}

function formatSystemMessageTime(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return "";
  }
  const now = new Date();
  const includeYear = parsed.getFullYear() !== now.getFullYear();
  return new Intl.DateTimeFormat("zh-CN", {
    ...(includeYear ? { year: "numeric" as const } : {}),
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(parsed);
}
