import {
  Check,
  ChevronDown,
  Download,
  Loader2,
  RotateCw,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import "./detail-dialog.css";

export type DetailVersionOption<T> = {
  id: number;
  version: number;
  updatedAt: string;
  value: T;
};

export function DetailDialogFrame({
  ariaLabel,
  header,
  children,
  onRequestClose,
}: {
  ariaLabel: string;
  header: ReactNode;
  children: ReactNode;
  onRequestClose: () => void | Promise<void>;
}) {
  const dialog = (
    <div
      className="wb-detail-backdrop"
      role="presentation"
      onMouseDown={() => void onRequestClose()}
    >
      <section
        className="wb-detail-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onMouseDown={(event) => event.stopPropagation()}
      >
        {header}
        {children}
      </section>
    </div>
  );

  return typeof document === "undefined"
    ? null
    : createPortal(dialog, document.body);
}

export function DetailDialogHeader({
  icon,
  title,
  subtitle,
  versionSelect,
  state,
  updatedAt,
  actions,
  downloadUrl,
  onClose,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  versionSelect?: ReactNode;
  state?: ReactNode;
  updatedAt?: string;
  actions?: ReactNode;
  downloadUrl?: string;
  onClose: () => void;
}) {
  return (
    <header className="wb-detail-head">
      <div className="wb-detail-heading">
        <span className="wb-detail-kind-icon" aria-hidden="true">
          {icon}
        </span>
        <div>
          <strong>{title || "详情"}</strong>
          {subtitle ? <span>{subtitle}</span> : null}
        </div>
      </div>

      <div className="wb-detail-meta">
        {versionSelect}
        {state}
        {updatedAt ? <time>{updatedAt}</time> : null}
      </div>

      <div className="wb-detail-actions">
        {actions}
        {downloadUrl ? (
          <a
            href={downloadUrl}
            download
            className="wb-detail-icon-button"
            aria-label="下载内容"
            title="下载内容"
          >
            <Download size={17} />
          </a>
        ) : null}
        <button
          type="button"
          className="wb-detail-icon-button"
          onClick={onClose}
          aria-label="关闭详情"
          title="关闭"
        >
          <X size={18} />
        </button>
      </div>
    </header>
  );
}

export function DetailVersionSelect<T>({
  options,
  currentVersionId,
  selectedVersionId,
  total,
  hasMore,
  loading,
  loadingMore,
  error,
  disabled = false,
  onSelect,
  onLoadMore,
  onRetry,
}: {
  options: DetailVersionOption<T>[];
  currentVersionId: number;
  selectedVersionId: number;
  total: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string;
  disabled?: boolean;
  onSelect: (value: T) => void;
  onLoadMore: () => void;
  onRetry: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedOption =
    options.find((option) => option.id === selectedVersionId) ||
    options.find((option) => option.id === currentVersionId);

  useEffect(() => {
    if (!open) return;
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  if (!selectedVersionId && !loading) return null;

  return (
    <div className="wb-detail-version-select" ref={rootRef}>
      <button
        type="button"
        className="wb-detail-version-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled || (loading && options.length === 0)}
        onClick={() => setOpen((current) => !current)}
      >
        {loading && options.length === 0 ? (
          <Loader2 size={12} className="wb-detail-spin" />
        ) : null}
        <span>{detailVersionTitle(selectedOption?.version)}</span>
        {total > 0 ? <small>{total} 个版本</small> : null}
        <ChevronDown size={13} />
      </button>

      {open ? (
        <div className="wb-detail-version-menu" role="listbox">
          <div
            className="wb-detail-version-options"
            onScroll={(event) => {
              const element = event.currentTarget;
              if (
                hasMore &&
                !loadingMore &&
                element.scrollHeight - element.scrollTop - element.clientHeight <
                  36
              ) {
                onLoadMore();
              }
            }}
          >
            {options.length > 0 ? (
              options.map((option) => {
                const selected = option.id === selectedVersionId;
                const current = option.id === currentVersionId;
                return (
                  <button
                    key={option.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={selected ? "is-selected" : ""}
                    onClick={() => {
                      setOpen(false);
                      onSelect(option.value);
                    }}
                  >
                    <span>
                      <strong>{detailVersionTitle(option.version)}</strong>
                      {current ? <small>当前</small> : null}
                    </span>
                    <time>{formatDetailVersionTime(option.updatedAt)}</time>
                    {selected ? (
                      <Check size={13} />
                    ) : (
                      <i aria-hidden="true" />
                    )}
                  </button>
                );
              })
            ) : error ? (
              <VersionErrorMessage error={error} onRetry={onRetry} />
            ) : (
              <div className="wb-detail-version-message">
                {loading ? (
                  <Loader2 size={14} className="wb-detail-spin" />
                ) : null}
                <span>{loading ? "正在读取版本" : "暂无版本"}</span>
              </div>
            )}
            {error && options.length > 0 ? (
              <VersionErrorMessage error={error} onRetry={onRetry} />
            ) : null}
            {loadingMore ? (
              <div className="wb-detail-version-loading">
                <Loader2 size={13} className="wb-detail-spin" />
                正在加载更多
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function VersionErrorMessage({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="wb-detail-version-message is-error">
      <span>{error}</span>
      <button type="button" onClick={onRetry}>
        <RotateCw size={12} />
        重试
      </button>
    </div>
  );
}

function detailVersionTitle(version?: number) {
  const number = Number(version || 0);
  return number > 0 ? `第${number}版` : "版本";
}

export function formatDetailVersionTime(value: unknown) {
  const text = String(value || "").trim();
  if (!text) return "";
  return text
    .replace("T", " ")
    .replace(/\.\d+(Z)?$/, "")
    .replace(/Z$/, "");
}
