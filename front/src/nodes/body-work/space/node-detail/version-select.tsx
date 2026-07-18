import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Loader2, RotateCw } from "lucide-react";
import type { AssetVersion } from "../types";

export function NodeDetailVersionSelect({
  versions,
  currentVersionId,
  selectedVersionId,
  total,
  hasMore,
  loading,
  loadingMore,
  error,
  onSelect,
  onLoadMore,
  onRetry,
}: {
  versions: AssetVersion[];
  currentVersionId: number;
  selectedVersionId: number;
  total: number;
  hasMore: boolean;
  loading: boolean;
  loadingMore: boolean;
  error: string;
  onSelect: (version: AssetVersion) => void;
  onLoadMore: () => void;
  onRetry: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selectedVersion =
    versions.find((version) => Number(version.id) === selectedVersionId) ||
    versions.find((version) => Number(version.id) === currentVersionId);

  useEffect(() => {
    if (!open) {
      return;
    }
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  if (!selectedVersionId && !loading) {
    return null;
  }

  return (
    <div className="ws-node-detail-version-select" ref={rootRef}>
      <button
        type="button"
        className="ws-node-detail-version-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={loading && versions.length === 0}
        onClick={() => setOpen((current) => !current)}
      >
        {loading && versions.length === 0 ? (
          <Loader2 size={12} className="ws-spin" />
        ) : null}
        <span>{versionTitle(selectedVersion)}</span>
        {total > 0 ? <small>{total} 个版本</small> : null}
        <ChevronDown size={13} />
      </button>

      {open ? (
        <div className="ws-node-detail-version-menu" role="listbox">
          <div
            className="ws-node-detail-version-options"
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
            {error ? (
              <div className="ws-node-detail-version-message is-error">
                <span>{error}</span>
                <button type="button" onClick={onRetry}>
                  <RotateCw size={12} />
                  重试
                </button>
              </div>
            ) : versions.length === 0 ? (
              <div className="ws-node-detail-version-message">
                {loading ? <Loader2 size={14} className="ws-spin" /> : null}
                <span>{loading ? "正在读取版本" : "暂无版本"}</span>
              </div>
            ) : (
              versions.map((version) => {
                const versionId = Number(version.id || 0);
                const selected = versionId === selectedVersionId;
                const current = versionId === currentVersionId;
                return (
                  <button
                    key={versionId}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    className={selected ? "is-selected" : ""}
                    onClick={() => {
                      setOpen(false);
                      onSelect(version);
                    }}
                  >
                    <span>
                      <strong>{versionTitle(version)}</strong>
                      {current ? <small>当前</small> : null}
                    </span>
                    <time>
                      {formatNodeDetailVersionTime(
                        version.updated_at || version.created_at,
                      )}
                    </time>
                    {selected ? <Check size={13} /> : <i aria-hidden="true" />}
                  </button>
                );
              })
            )}
            {loadingMore ? (
              <div className="ws-node-detail-version-loading">
                <Loader2 size={13} className="ws-spin" />
                正在加载更多
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function versionTitle(version?: AssetVersion) {
  const number = Number(version?.version || 0);
  return number > 0 ? `第${number}版` : "版本";
}

export function formatNodeDetailVersionTime(value: unknown) {
  const text = String(value || "").trim();
  if (!text) {
    return "";
  }
  return text
    .replace("T", " ")
    .replace(/\.\d+(Z)?$/, "")
    .replace(/Z$/, "");
}
