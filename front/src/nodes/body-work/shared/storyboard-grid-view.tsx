import { ImagePlus, Pencil } from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import type {
  StoryboardGridDocument,
  StoryboardGridFrame,
} from "./content-output";
import {
  normalizeStoryboardGridLayout,
  type StoryboardGridLayout,
} from "./storyboard-grid-layout";
import {
  MediaGridToolbar,
  useMediaGridPagination,
} from "./media-grid-view";
import { BodyWorkImagePreviewDialog } from "./media-preview-dialog";
import "./storyboard-grid-view.css";

export function StoryboardGridView({
  grid,
  variant = "compact",
  readonly = true,
  renderFrameAction,
  onFrameChange,
  onFrameImport,
  onEmptyFrameImport,
  capacity,
  showHeader = true,
  showCaptions = true,
  columns,
  rows,
  frameOffset = 0,
  previewFrames,
}: {
  grid: StoryboardGridDocument;
  variant?: "compact" | "detail";
  readonly?: boolean;
  renderFrameAction?: (frame: StoryboardGridFrame, index: number) => ReactNode;
  onFrameChange?: (index: number, patch: Partial<StoryboardGridFrame>) => void;
  onFrameImport?: (frame: StoryboardGridFrame, index: number) => void;
  onEmptyFrameImport?: (index: number) => void;
  capacity?: number;
  showHeader?: boolean;
  showCaptions?: boolean;
  columns?: number;
  rows?: number;
  frameOffset?: number;
  previewFrames?: StoryboardGridFrame[];
}) {
  const [previewFrameID, setPreviewFrameID] = useState<string | number | null>(
    null,
  );
  const previewItems = useMemo(
    () =>
      (previewFrames || grid.frames)
        .filter((frame) => Boolean(frame.image))
        .map((frame) => ({
          id: frame.id || frame.order,
          name: frame.title || `画面 ${frame.order}`,
          url: frame.image,
          thumbnail: frame.image,
        })),
    [grid.frames, previewFrames],
  );
  const slotCount = Math.max(
    grid.frames.length,
    Math.trunc(Number(capacity) || 0),
  );
  const slots = Array.from(
    { length: slotCount },
    (_, index) => grid.frames[index],
  );
  const gridStyle: CSSProperties = {
    ...(columns
      ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }
      : {}),
    ...(rows ? { gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` } : {}),
  };
  return (
    <section className={`ws-storyboard-grid-output is-${variant}`}>
      {showHeader ? (
        <header>
          <strong>{grid.title}</strong>
          {grid.summary ? <p>{grid.summary}</p> : null}
        </header>
      ) : null}
      <div
        className="ws-storyboard-grid-output-list"
        data-count={slots.length}
        style={gridStyle}
      >
        {slots.map((frame, index) => {
          const frameIndex = frameOffset + index;
          return frame ? (
            <figure key={frame.id} className={frame.image ? "" : "is-empty"}>
              {frame.image ? (
                <StoryboardGridImage
                  frame={frame}
                  onPreview={() => setPreviewFrameID(frame.id || frame.order)}
                />
              ) : onFrameImport ? (
                <button
                  type="button"
                  className="ws-storyboard-grid-frame-empty nodrag nopan"
                  title="导入图片"
                  aria-label={`向第 ${frame.order} 格导入图片`}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onFrameImport(frame, frameIndex);
                  }}
                >
                  <ImagePlus size={18} />
                </button>
              ) : (
                <div className="ws-storyboard-grid-output-error">
                  {frame.error || "暂无图片"}
                </div>
              )}
              {frame.image && onFrameImport ? (
                <button
                  type="button"
                  className="ws-storyboard-grid-frame-import nodrag nopan"
                  title="替换图片"
                  aria-label={`替换第 ${frame.order} 格图片`}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onFrameImport(frame, frameIndex);
                  }}
                >
                  <ImagePlus size={14} />
                </button>
              ) : null}
              {showCaptions ? (
                <figcaption>
                  <span>{String(frame.order).padStart(2, "0")}</span>
                  {variant === "detail" && !readonly && onFrameChange ? (
                    <input
                      value={frame.title}
                      aria-label={`第 ${frame.order} 格标题`}
                      onChange={(event) =>
                        onFrameChange(frameIndex, { title: event.target.value })
                      }
                    />
                  ) : (
                    <strong>{frame.title}</strong>
                  )}
                </figcaption>
              ) : null}
              {variant === "detail" ? (
                <div className="ws-storyboard-grid-output-details">
                  {readonly || !onFrameChange ? (
                    <p>{frame.description || "暂无画面说明"}</p>
                  ) : (
                    <textarea
                      value={frame.description}
                      rows={3}
                      aria-label={`第 ${frame.order} 格说明`}
                      placeholder="画面说明"
                      onChange={(event) =>
                        onFrameChange(frameIndex, {
                          description: event.target.value,
                        })
                      }
                    />
                  )}
                  {renderFrameAction ? (
                    <div className="ws-storyboard-grid-output-actions">
                      {renderFrameAction(frame, frameIndex)}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </figure>
          ) : (
            <figure key={`empty-${frameIndex}`} className="is-empty">
              {onEmptyFrameImport ? (
                <button
                  type="button"
                  className="ws-storyboard-grid-frame-empty nodrag nopan"
                  title="导入图片"
                  aria-label={`向第 ${frameIndex + 1} 格导入图片`}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onEmptyFrameImport(frameIndex);
                  }}
                >
                  <ImagePlus size={18} />
                </button>
              ) : null}
            </figure>
          );
        })}
      </div>
      {previewFrameID != null && previewItems.length > 0 ? (
        <BodyWorkImagePreviewDialog
          items={previewItems}
          initialItemID={previewFrameID}
          onClose={() => setPreviewFrameID(null)}
        />
      ) : null}
    </section>
  );
}

function StoryboardGridImage({
  frame,
  onPreview,
}: {
  frame: StoryboardGridFrame;
  onPreview: () => void;
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [frame.image]);

  if (failed) {
    return (
      <div className="ws-storyboard-grid-output-error">
        {frame.error || "图片加载失败"}
      </div>
    );
  }

  return (
    <button
      type="button"
      className="ws-storyboard-grid-image nodrag nopan"
      title="预览图片"
      aria-label={`预览第 ${frame.order} 格图片`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onPreview();
      }}
    >
      <img
        src={frame.image}
        alt={frame.title}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </button>
  );
}

export function StoryboardGridCanvasView({
  grid,
  aspectRatio,
  running = false,
  onImport,
  onFrameImport,
  onSlotImport,
  onEdit,
  layout = "auto",
  onLayoutChange,
}: {
  grid?: StoryboardGridDocument | null;
  aspectRatio?: string;
  running?: boolean;
  onImport?: () => void;
  onFrameImport?: (frame: StoryboardGridFrame, index: number) => void;
  onSlotImport?: (index: number) => void;
  onEdit?: () => void;
  layout?: StoryboardGridLayout;
  onLayoutChange?: (layout: StoryboardGridLayout) => void;
}) {
  const normalizedLayout = normalizeStoryboardGridLayout(layout);
  const frameCount = grid?.frames.length || 0;
  const pagination = useMediaGridPagination(frameCount, normalizedLayout);
  const pageGrid = grid
    ? {
        ...grid,
        frames: grid.frames.slice(
          pagination.pageOffset,
          pagination.pageOffset + pagination.shape.capacity,
        ),
      }
    : null;
  const populatedFrames =
    grid?.frames.filter((frame) => frame.image).length || 0;
  const countLabel =
    frameCount > 0 && populatedFrames !== frameCount
      ? `${populatedFrames}/${frameCount} 张`
      : `${frameCount} 张`;
  return (
    <section
      className={`ws-storyboard-grid-canvas ${running ? "is-running" : ""}`}
    >
      <MediaGridToolbar
        layout={normalizedLayout}
        countLabel={countLabel}
        pageIndex={pagination.pageIndex}
        pageCount={pagination.pageCount}
        disabled={running || !onLayoutChange}
        leading={<span>比例 {aspectRatio || "自动"}</span>}
        actions={
          onImport || (grid && onEdit) ? (
            <>
              {onImport ? (
                <button
                  type="button"
                  className="nodrag nopan"
                  disabled={running}
                  onClick={(event) => {
                    event.stopPropagation();
                    onImport();
                  }}
                >
                  <ImagePlus size={14} />
                  <span>{grid ? "批量导入" : "导入图片"}</span>
                </button>
              ) : null}
              {grid && onEdit ? (
                <button
                  type="button"
                  className="nodrag nopan"
                  disabled={running}
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit();
                  }}
                >
                  <Pencil size={14} />
                  <span>编辑</span>
                </button>
              ) : null}
            </>
          ) : undefined
        }
        onLayoutChange={onLayoutChange}
        onPageChange={pagination.setPageIndex}
      />
      <div className="ws-storyboard-grid-canvas-body nowheel">
        {pageGrid ? (
          <StoryboardGridView
            grid={pageGrid}
            previewFrames={grid?.frames}
            capacity={pagination.shape.capacity}
            columns={pagination.shape.columns}
            rows={pagination.shape.rows}
            frameOffset={pagination.pageOffset}
            showHeader={false}
            showCaptions={false}
            onFrameImport={running ? undefined : onFrameImport}
            onEmptyFrameImport={running ? undefined : onSlotImport}
          />
        ) : (
          <div
            className="ws-storyboard-grid-placeholder"
            aria-busy={running}
            style={{
              gridTemplateColumns: `repeat(${pagination.shape.columns}, minmax(0, 1fr))`,
              gridTemplateRows: `repeat(${pagination.shape.rows}, minmax(0, 1fr))`,
            }}
          >
            {Array.from({ length: pagination.shape.capacity }, (_, index) => (
              <button
                key={index}
                type="button"
                className="nodrag nopan"
                disabled={running || !onSlotImport}
                title="导入图片"
                aria-label={`向宫格导入图片，第 ${index + 1} 格`}
                onClick={(event) => {
                  event.stopPropagation();
                  onSlotImport?.(index);
                }}
              >
                <ImagePlus size={18} />
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
