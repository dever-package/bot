import { useState } from "react";
import { writingChapterPageSize } from "./writing-chapter-index";

/** 自动翻页服从唯一滚动意图；手动翻页属于阅读操作，保持在用户选择的位置。 */
export function useWritingStreamPage(activeIndex: number | undefined, following: boolean, onReadPage?: () => void) {
  const [page, setPage] = useState(0);
  const nextPage = following && activeIndex !== undefined ? Math.floor(activeIndex / writingChapterPageSize) : page;
  if (nextPage !== page) setPage(nextPage);
  return [page, (next: number) => { onReadPage?.(); setPage(next); }] as const;
}
