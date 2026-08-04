import { Grid3X3, ImagePlus, Pencil } from "lucide-react";
import type { ReactNode } from "react";
import type {
  StoryboardGridDocument,
  StoryboardGridFrame,
} from "./content-output";
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
}: {
  grid: StoryboardGridDocument;
  variant?: "compact" | "detail";
  readonly?: boolean;
  renderFrameAction?: (
    frame: StoryboardGridFrame,
    index: number,
  ) => ReactNode;
  onFrameChange?: (
    index: number,
    patch: Partial<StoryboardGridFrame>,
  ) => void;
  onFrameImport?: (frame: StoryboardGridFrame, index: number) => void;
  onEmptyFrameImport?: (index: number) => void;
  capacity?: number;
  showHeader?: boolean;
  showCaptions?: boolean;
}) {
  const slotCount = Math.min(
    9,
    Math.max(grid.frames.length, Math.trunc(Number(capacity) || 0)),
  );
  const slots = Array.from(
    { length: slotCount },
    (_, index) => grid.frames[index],
  );
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
      >
        {slots.map((frame, index) =>
          frame ? (
            <figure
              key={frame.id}
              className={frame.image ? "" : "is-empty"}
            >
              {frame.image ? (
                <a href={frame.image} target="_blank" rel="noreferrer">
                  <img
                    src={frame.image}
                    alt={frame.title}
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              ) : onFrameImport ? (
                <button
                  type="button"
                  className="ws-storyboard-grid-frame-empty nodrag nopan"
                  title="导入图片"
                  aria-label={`向第 ${frame.order} 格导入图片`}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onFrameImport(frame, index);
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
                    onFrameImport(frame, index);
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
                        onFrameChange(index, { title: event.target.value })
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
                        onFrameChange(index, {
                          description: event.target.value,
                        })
                      }
                    />
                  )}
                  {renderFrameAction ? (
                    <div className="ws-storyboard-grid-output-actions">
                      {renderFrameAction(frame, index)}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </figure>
          ) : (
            <figure key={`empty-${index}`} className="is-empty">
              {onEmptyFrameImport ? (
                <button
                  type="button"
                  className="ws-storyboard-grid-frame-empty nodrag nopan"
                  title="导入图片"
                  aria-label={`向第 ${index + 1} 格导入图片`}
                  onClick={(event) => {
                    event.preventDefault();
                    event.stopPropagation();
                    onEmptyFrameImport(index);
                  }}
                >
                  <ImagePlus size={18} />
                </button>
              ) : null}
            </figure>
          ),
        )}
      </div>
    </section>
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
}: {
  grid?: StoryboardGridDocument | null;
  aspectRatio?: string;
  running?: boolean;
  onImport?: () => void;
  onFrameImport?: (frame: StoryboardGridFrame, index: number) => void;
  onSlotImport?: (index: number) => void;
  onEdit?: () => void;
}) {
  const populatedFrames =
    grid?.frames.filter((frame) => frame.image).length || 0;
  return (
    <section
      className={`ws-storyboard-grid-canvas ${running ? "is-running" : ""}`}
    >
      <header className="ws-storyboard-grid-canvas-toolbar">
        <div>
          <span>比例 {aspectRatio || "自动"}</span>
          <span>
            <Grid3X3 size={14} />
            3×3
          </span>
          <span>{populatedFrames}/9</span>
        </div>
        <div>
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
        </div>
      </header>
      <div className="ws-storyboard-grid-canvas-body nowheel">
        {grid ? (
          <StoryboardGridView
            grid={grid}
            capacity={9}
            showHeader={false}
            showCaptions={false}
            onFrameImport={running ? undefined : onFrameImport}
            onEmptyFrameImport={running ? undefined : onSlotImport}
          />
        ) : (
          <div className="ws-storyboard-grid-placeholder" aria-busy={running}>
            {Array.from({ length: 9 }, (_, index) => (
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
