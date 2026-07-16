import { Loader2, RotateCw } from "lucide-react";
import type { ReactNode } from "react";
import type { AssetVersion } from "../types";

export function VersionPanel({
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
  return (
    <aside className="ws-node-detail-side" aria-label="版本记录">
      <div className="ws-node-detail-side-head">
        <strong>版本</strong>
        <span>{total}</span>
      </div>

      <div className="ws-node-detail-version-list">
        {loading ? (
          <VersionPanelState icon={<Loader2 className="ws-spin" size={16} />}>
            正在读取版本
          </VersionPanelState>
        ) : error ? (
          <VersionPanelState>
            <span>{error}</span>
            <button type="button" onClick={onRetry}>
              <RotateCw size={13} />
              重试
            </button>
          </VersionPanelState>
        ) : versions.length === 0 ? (
          <VersionPanelState>暂无版本记录</VersionPanelState>
        ) : (
          versions.map((version) => {
            const isCurrent = Number(version.id) === currentVersionId;
            const isSelected = Number(version.id) === selectedVersionId;
            return (
              <button
                key={version.id}
                type="button"
                className={`ws-node-detail-version-row ${
                  isSelected ? "is-active" : ""
                }`}
                onClick={() => onSelect(version)}
              >
                <span className="ws-node-detail-version-line">
                  <strong>{versionTitle(version)}</strong>
                  {isCurrent ? (
                    <small>
                      <i aria-hidden="true" />
                      当前版本
                    </small>
                  ) : null}
                </span>
                <span className="ws-node-detail-version-meta">
                  <time>
                    {formatNodeDetailVersionTime(
                      version.updated_at || version.created_at,
                    )}
                  </time>
                </span>
              </button>
            );
          })
        )}
      </div>

      {hasMore && !loading && !error ? (
        <div className="ws-node-detail-version-more">
          <button type="button" disabled={loadingMore} onClick={onLoadMore}>
            {loadingMore ? (
              <Loader2 size={13} className="ws-spin" />
            ) : null}
            {loadingMore ? "加载中" : "加载更多"}
          </button>
        </div>
      ) : null}
    </aside>
  );
}

function VersionPanelState({
  icon,
  children,
}: {
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="ws-node-detail-version-state">
      {icon}
      {children}
    </div>
  );
}

function versionTitle(version: AssetVersion) {
  const number = Number(version.version || 0);
  return number > 0 ? `第 ${number} 版` : "历史版本";
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
