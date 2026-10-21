import { RefreshCw, ArrowRight, Pencil } from "lucide-react";
import {
  canSelectWritingInspiration,
  type WritingDocument,
} from "./writing-document";
import "./writing-inspirations.css";

/** 画布候选卡；卡面保留画布事件，编辑、更换和选用独立触发。 */
export function WritingInspirations({
  document,
  disabled,
  onSelect,
  onRegenerate,
  onEdit,
  pending = false,
}: {
  document: WritingDocument;
  disabled: boolean;
  onSelect: (id: string) => void;
  onRegenerate: (id: string) => void;
  onEdit: (id: string) => void;
  pending?: boolean;
}) {
  const entries = pending
    ? Array.from(
        { length: Math.max(3, document.inspirations.length) },
        (_, index) => document.inspirations[index],
      )
    : document.inspirations;
  return (
    <div className="writing-inspirations is-compact">
      <div className="writing-inspiration-grid">
        {entries.map((entry, index) => {
          if (!entry)
            return <WritingInspirationSkeletonCard key={`pending-${index}`} />;
          const heading = (
            <span className="writing-inspiration-heading">
              <span className="writing-inspiration-number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <strong>{entry.title || "正在构思…"}</strong>
            </span>
          );
          const description = (
            <span className="writing-inspiration-description">
              {entry.content}
            </span>
          );
          return (
            <article
              className="writing-inspiration-card"
              key={entry.id || index}
            >
              <button
                type="button"
                className="writing-inspiration-open nodrag nopan"
                disabled={disabled || !entry.id}
                aria-label={`查看并编辑灵感 ${index + 1}：${entry.title || "正在构思"}`}
                onPointerDown={(event) => event.stopPropagation()}
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(entry.id);
                }}
              >
                {heading}
                {description}
              </button>
              <footer>
                <button
                  className="writing-inspiration-secondary nodrag nopan"
                  type="button"
                  disabled={disabled || !entry.id}
                  aria-label={`编辑灵感 ${index + 1}`}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(entry.id);
                  }}
                >
                  <Pencil size={12} /> 编辑
                </button>
                <button
                  className="writing-inspiration-secondary nodrag nopan"
                  type="button"
                  disabled={disabled || !entry.id}
                  aria-label={`更换灵感 ${index + 1}`}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    onRegenerate(entry.id);
                  }}
                >
                  <RefreshCw size={12} /> 换一条
                </button>
                <button
                  className="nodrag nopan is-primary"
                  type="button"
                  aria-label={`选用灵感 ${index + 1}`}
                  disabled={
                    disabled || !canSelectWritingInspiration(document, entry.id)
                  }
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={(event) => {
                    event.stopPropagation();
                    onSelect(entry.id);
                  }}
                >
                  选用
                  <ArrowRight size={13} />
                </button>
              </footer>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function WritingInspirationSkeletonCard() {
  return (
    <article
      className="writing-inspiration-card is-skeleton"
      aria-hidden="true"
    >
      <i className="writing-inspiration-skeleton-title" />
      <div>
        <i />
        <i />
        <i />
      </div>
      <i className="writing-inspiration-skeleton-action" />
    </article>
  );
}

export function WritingInspirationsSkeleton() {
  return (
    <div
      className="writing-inspirations is-compact"
      aria-label="正在构思三个灵感"
    >
      <div className="writing-inspiration-grid">
        {[0, 1, 2].map((index) => (
          <WritingInspirationSkeletonCard key={index} />
        ))}
      </div>
    </div>
  );
}
