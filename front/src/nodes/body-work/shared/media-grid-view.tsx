import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EnergonAudioPlayer } from "@/components/energon/content-view";
import { PlayableVideoPreview } from "../../shared/playable-video-preview";
import type { ContentMediaItem, ContentMediaKind } from "./content-output";
import {
  compactMediaGridShape,
  MEDIA_GRID_LAYOUT_OPTIONS,
  mediaGridLayoutOption,
  normalizeMediaGridLayout,
  type MediaGridLayout,
} from "./media-grid-layout";
import { useMediaGridPagination } from "./media-grid-pagination";
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
                {option.value === normalizedLayout ? <Check size={13} /> : null}
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
  items,
  label,
  compact = false,
}: {
  kind: MediaGridKind;
  items: ContentMediaItem[];
  label?: string;
  compact?: boolean;
}) {
  const [layout, setLayout] = useState<MediaGridLayout>("auto");
  const pagination = useMediaGridPagination(items.length, layout);
  const shape = compact
    ? compactMediaGridShape(items.length)
    : pagination.shape;
  const pageOffset = compact ? 0 : pagination.pageOffset;
  const pageItems = items.slice(pageOffset, pageOffset + shape.capacity);
  const slots = Array.from(
    { length: shape.capacity },
    (_, index) => pageItems[index],
  );
  const kindLabel = MEDIA_GRID_KIND_LABELS[kind];
  const countUnit = MEDIA_GRID_COUNT_UNITS[kind];

  return (
    <section
      className={`ws-media-grid-view is-${kind}${compact ? " is-compact" : ""}`}
    >
      {compact ? (
        <span
          className="ws-media-grid-compact-count"
          aria-label={`共 ${items.length} ${countUnit}`}
        >
          {items.length > shape.capacity
            ? `共${items.length}${countUnit}`
            : `${items.length}${countUnit}`}
        </span>
      ) : (
        <MediaGridToolbar
          layout={layout}
          countLabel={`${items.length} ${countUnit}`}
          pageIndex={pagination.pageIndex}
          pageCount={pagination.pageCount}
          onLayoutChange={setLayout}
          onPageChange={pagination.setPageIndex}
        />
      )}
      <div className="ws-media-grid-body nowheel">
        <div
          className="ws-media-grid-list"
          style={{
            gridTemplateColumns: `repeat(${shape.columns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${shape.rows}, minmax(0, 1fr))`,
          }}
        >
          {slots.map((item, index) => {
            const itemIndex = pageOffset + index;
            const itemLabel = `${label || kindLabel} ${itemIndex + 1}`;
            return item ? (
              <figure
                key={`${item.url}-${itemIndex}`}
                className={kind === "audio" ? "is-audio" : undefined}
                aria-label={kind === "audio" ? itemLabel : undefined}
              >
                <MediaGridItem kind={kind} item={item} label={itemLabel} />
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
  item,
  label,
}: {
  kind: MediaGridKind;
  item: ContentMediaItem;
  label: string;
}) {
  const { url } = item;
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
      <PlayableVideoPreview
        key={url}
        src={url}
        poster={item.thumbnail}
        draggable={false}
        ariaLabel={label}
        objectFit="cover"
      />
    );
  }
  return (
    <div
      className={`ws-media-grid-audio-card${item.thumbnail ? " has-cover" : ""}`}
    >
      {item.thumbnail ? (
        <img src={item.thumbnail} alt="" loading="lazy" decoding="async" />
      ) : null}
      <EnergonAudioPlayer
        src={url}
        preload="none"
        className="ws-media-grid-audio-player nodrag nopan"
      />
    </div>
  );
}
