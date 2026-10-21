import { useCallback, useEffect, useRef, useState } from "react";
import { fetchSpaceAssetVersions } from "../space/space-api";
import type { AssetVersion } from "../space/types";

/** 版本下拉只负责分页；选择与正文读取由作品控制器按同一根版本处理。 */
export function useWritingVersions(
  projectId: number,
  assetId: number,
  currentVersionId: number,
) {
  const [versions, setVersions] = useState<AssetVersion[]>([]);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const sequence = useRef(0);
  const pending = useRef(false);
  const load = useCallback(
    async (nextPage: number) => {
      if (!assetId) return;
      const ticket = ++sequence.current;
      pending.current = true;
      if (nextPage === 1) setLoading(true);
      else setLoadingMore(true);
      setError("");
      try {
        const result = await fetchSpaceAssetVersions({
          projectId,
          assetId,
          page: nextPage,
          reportError: false,
        });
        if (ticket !== sequence.current) return;
        setVersions((previous) =>
          nextPage === 1
            ? result.items
            : [
                ...previous,
                ...result.items.filter(
                  (item) => !previous.some((old) => old.id === item.id),
                ),
              ],
        );
        setPage(nextPage);
        setTotal(result.total);
        setHasMore(result.hasMore);
      } catch (cause) {
        if (ticket === sequence.current)
          setError(cause instanceof Error ? cause.message : "读取版本失败");
      } finally {
        if (ticket === sequence.current) {
          pending.current = false;
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [projectId, assetId],
  );
  useEffect(() => {
    void load(1);
    return () => {
      sequence.current += 1;
    };
  }, [load, currentVersionId]);
  return {
    versions,
    total,
    hasMore,
    loading,
    loadingMore,
    error,
    onLoadMore: () => {
      if (!pending.current && hasMore) void load(page + 1);
    },
    onRetry: () => {
      if (!pending.current) void load(page || 1);
    },
  };
}
