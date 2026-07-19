import {
  DetailVersionSelect,
  formatDetailVersionTime,
} from "../../shared/detail-dialog";
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
  return (
    <DetailVersionSelect
      options={versions.map((version) => ({
        id: Number(version.id || 0),
        version: Number(version.version || 0),
        updatedAt: String(version.updated_at || version.created_at || ""),
        value: version,
      }))}
      currentVersionId={currentVersionId}
      selectedVersionId={selectedVersionId}
      total={total}
      hasMore={hasMore}
      loading={loading}
      loadingMore={loadingMore}
      error={error}
      onSelect={onSelect}
      onLoadMore={onLoadMore}
      onRetry={onRetry}
    />
  );
}

export function formatNodeDetailVersionTime(value: unknown) {
  return formatDetailVersionTime(value);
}
