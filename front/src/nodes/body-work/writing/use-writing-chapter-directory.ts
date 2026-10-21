import { useCallback, useMemo, useState } from "react";
import type { WritingSelection, WritingUnitEntry } from "./writing-document";
import {
  writingChapterIndex,
  writingChapterMatches,
  writingChapterPage,
  writingChapterPageSize,
} from "./writing-chapter-index";

export function useWritingChapterDirectory(
  units: WritingUnitEntry[],
  selection?: WritingSelection,
) {
  const index = useMemo(() => writingChapterIndex(units), [units]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);
  const [focus, setFocus] = useState<{ id: string; revision: number }>({
    id: "",
    revision: 0,
  });
  const rows = useMemo(
    () => writingChapterMatches(index, query),
    [index, query],
  );
  const locate = useCallback(
    (id: string) => {
      const row = index.byId.get(id);
      if (!row) return false;
      setQuery("");
      setPage(
        Math.floor(
          (index.canonical.length - row.ordinal) / writingChapterPageSize,
        ),
      );
      setFocus((previous) => ({ id, revision: previous.revision + 1 }));
      return true;
    },
    [index],
  );
  const selectedId = selection?.kind === "unit" ? selection.id : "";
  const selectedOrdinal = index.byId.get(selectedId)?.ordinal || 0;
  const selectionKey = `${selectedId}:${selectedOrdinal}`;
  const [locatedSelection, setLocatedSelection] = useState("");
  const search = useCallback((value: string) => {
    setQuery(value);
    setPage(0);
  }, []);
  // 当前章节身份/章序改变时同步视图；正文状态或前缀不重置用户搜索。
  if (selectionKey !== locatedSelection) {
    setLocatedSelection(selectionKey);
    if (selectedId) locate(selectedId);
  }
  return {
    index,
    rows,
    query,
    search,
    locate,
    focus,
    page: writingChapterPage(rows, page),
    setPage,
    byNumber: (value: string) => {
      if (!/^\d+$/.test(value.trim())) return undefined;
      return index.canonical[Number(value) - 1];
    },
  };
}

export type WritingChapterDirectory = ReturnType<
  typeof useWritingChapterDirectory
>;
