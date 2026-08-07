import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Play,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EnergonAudioPlayer } from "@/components/energon/content-view";
import { VideoThumbnail } from "../../shared/video-thumbnail";
import type { ContentMediaKind } from "./content-output";
import {
  MEDIA_GRID_LAYOUT_OPTIONS,
  mediaGridLayoutOption,
  mediaGridShape,
  normalizeMediaGridLayout,
  type MediaGridLayout,
} from "./media-grid-layout";
import "./media-grid-view.css";

type MediaGridKind = ContentMediaKind;

const MEDIA_GRID_KIND_LABELS: Record<MediaGridKind, string> = {
  image: "图片",
  video: "视频",
  audio: "音频",
};

const MEDIA_GRID_COUNT_UNITS: Record<MediaGridKind, string> = {
  image: "张",
  video: "个",
  audio: "个",
};

export function useMediaGridPagination(
  itemCount: number,
  layout: MediaGridLayout,
) {
  const shape = mediaGridShape(layout, itemCount);
  const pageCount = Math.max(1, Math.ceil(itemCount / shape.capacity));
  const [pageIndex, setPageIndex] = useState(0);

  useEffect(() => {
    setPageIndex((current) => Math.min(current, pageCount - 1));
  }, [pageCount]);

  const currentPageIndex = Math.min(pageIndex, pageCount - 1);
  return {
    shape,
    pageCount,
    pageIndex: currentPageIndex,
    pageOffset: currentPageIndex * shape.capacity,
    setPageIndex,
  };
}

export function MediaGridToolbar({
  layout,
  countLabel,
  pageIndex,
  pageCount,
  disabled = false,
  leading,
  actions,
  onLayoutChange,
  onPageChange,
}: {
  layout: MediaGridLayout;
  countLabel: string;
  pageIndex: number;
  pageCount: number;
  disabled?: boolean;
  leading?: ReactNode;
  actions?: ReactNode;
  onLayoutChange?: (layout: MediaGridLayout) => void;
  onPageChange: (pageIndex: number) => void;
}) {
  const normalizedLayout = normalizeMediaGridLayout(layout);
  const selectedLayout = mediaGridLayoutOption(normalizedLayout);

  return (
    <header className="ws-media-grid-toolbar">
      <div className="ws-media-grid-toolbar-main">
        {leading}
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="ws-media-grid-layout-trigger nodrag nopan"
              disabled={disabled || !onLayoutChange}
              aria-label="选择每页宫格布局"
              onClick={(event) => event.stopPropagation()}
            >
              <Grid3X3 size={14} />
              {selectedLayout.label}
              <ChevronDown size={12} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="ws-media-grid-layout-menu"
            onClick={(event) => event.stopPropagation()}
          >
            {MEDIA_GRID_LAYOUT_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option.value}
                className="ws-media-grid-layout-item"
                onSelect={() => {
                  onPageChange(0);
                  onLayoutChange?.(option.value);
                }}
              >
                <span>{option.label}</span>
                <small>
                  {option.value === "auto"
                    ? "按结果排版"
                    : `每页 ${option.capacity} 格`}
                </small>
                {option.value === normalizedLayout ? (
                  <Check size={13} />
                ) : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <span className="ws-media-grid-count">{countLabel}</span>
        {pageCount > 1 ? (
          <div className="ws-media-grid-page-controls" aria-label="宫格分页">
            <button
              type="button"
              className="nodrag nopan"
              disabled={pageIndex <= 0}
              title="上一页"
              aria-label="上一页"
              onClick={(event) => {
                event.stopPropagation();
                onPageChange(Math.max(0, pageIndex - 1));
              }}
            >
              <ChevronLeft size={14} />
            </button>
            <span>
              {pageIndex + 1}/{pageCount}
            </span>
            <button
              type="button"
              className="nodrag nopan"
              disabled={pageIndex >= pageCount - 1}
              title="下一页"
              aria-label="下一页"
              onClick={(event) => {
                event.stopPropagation();
                onPageChange(Math.min(pageCount - 1, pageIndex + 1));
              }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        ) : null}
      </div>
      {actions ? (
        <div className="ws-media-grid-toolbar-actions">{actions}</div>
      ) : null}
    </header>
  );
}

export function MediaGridView({
  kind,
  urls,
  label,
}: {
  kind: MediaGridKind;
  urls: string[];
  label?: string;
}) {
  const [layout, setLayout] = useState<MediaGridLayout>("auto");
  const pagination = useMediaGridPagination(urls.length, layout);
  const pageItems = urls.slice(
    pagination.pageOffset,
    pagination.pageOffset + pagination.shape.capacity,
  );
  const slots = Array.from(
    { length: pagination.shape.capacity },
    (_, index) => pageItems[index],
  );
  const kindLabel = MEDIA_GRID_KIND_LABELS[kind];

  return (
    <section className={`ws-media-grid-view is-${kind}`}>
      <MediaGridToolbar
        layout={layout}
        countLabel={`${urls.length} ${MEDIA_GRID_COUNT_UNITS[kind]}`}
        pageIndex={pagination.pageIndex}
        pageCount={pagination.pageCount}
        onLayoutChange={setLayout}
        onPageChange={pagination.setPageIndex}
      />
      <div className="ws-media-grid-body nowheel">
        <div
          className="ws-media-grid-list"
          style={{
            gridTemplateColumns: `repeat(${pagination.shape.columns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${pagination.shape.rows}, minmax(0, 1fr))`,
          }}
        >
          {slots.map((url, index) => {
            const itemIndex = pagination.pageOffset + index;
            const itemLabel = `${label || kindLabel} ${itemIndex + 1}`;
            return url ? (
              <figure
                key={`${url}-${itemIndex}`}
                className={kind === "audio" ? "is-audio" : undefined}
                aria-label={kind === "audio" ? itemLabel : undefined}
              >
                <MediaGridItem
                  kind={kind}
                  url={url}
                  label={itemLabel}
                />
                {kind === "video" ? (
                  <span className="ws-media-grid-play" aria-hidden="true">
                    <Play size={12} fill="currentColor" />
                  </span>
                ) : null}
              </figure>
            ) : (
              <figure key={`empty-${itemIndex}`} className="is-empty" />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function MediaGridItem({
  kind,
  url,
  label,
}: {
  kind: MediaGridKind;
  url: string;
  label: string;
}) {
  if (kind === "image") {
    return (
      <img
        src={url}
        alt={label}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    );
  }
  if (kind === "video") {
    return (
      <VideoThumbnail
        key={url}
        src={url}
        draggable={false}
        ariaLabel={label}
      />
    );
  }
  return (
    <EnergonAudioPlayer
      src={url}
      compact
      preload="none"
      className="ws-media-grid-audio-player nodrag nopan"
    />
  );
}
