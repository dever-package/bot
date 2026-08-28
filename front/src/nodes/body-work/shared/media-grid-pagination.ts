import { useState } from "react";
import {
  clampMediaGridPageIndex,
  mediaGridShape,
  type MediaGridLayout,
} from "./media-grid-layout";

export function useMediaGridPagination(
  itemCount: number,
  layout: MediaGridLayout,
) {
  const shape = mediaGridShape(layout, itemCount);
  const pageCount = Math.max(1, Math.ceil(itemCount / shape.capacity));
  const [pageIndex, setPageIndex] = useState(0);
  const currentPageIndex = clampMediaGridPageIndex(pageIndex, pageCount);
  return {
    shape,
    pageCount,
    pageIndex: currentPageIndex,
    pageOffset: currentPageIndex * shape.capacity,
    setPageIndex,
  };
}
