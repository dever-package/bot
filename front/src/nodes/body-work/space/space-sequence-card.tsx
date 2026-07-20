import { GripVertical } from "lucide-react";
import type { DragEvent, ReactNode } from "react";

export function SequenceCard({
  itemId,
  index,
  durationLabel,
  className,
  dragClassName,
  selected = false,
  readonly = false,
  ariaLabel,
  headerActions,
  children,
  onSelect,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: {
  itemId: string;
  index: number;
  durationLabel: string;
  className: string;
  dragClassName: string;
  selected?: boolean;
  readonly?: boolean;
  ariaLabel: string;
  headerActions?: ReactNode;
  children: ReactNode;
  onSelect: () => void;
  onDragStart: () => void;
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}) {
  return (
    <article
      className={`${className} ${selected ? "is-selected" : ""}`.trim()}
      aria-label={ariaLabel}
      onClick={onSelect}
      onDragOver={readonly ? undefined : onDragOver}
      onDrop={
        readonly
          ? undefined
          : (event) => {
              event.preventDefault();
              onDrop();
            }
      }
    >
      <header>
        <button
          type="button"
          className={dragClassName}
          draggable={!readonly}
          disabled={readonly}
          title="拖动排序"
          aria-label={`拖动${ariaLabel}排序`}
          onClick={(event) => event.stopPropagation()}
          onDragStart={(event) => {
            event.dataTransfer.effectAllowed = "move";
            event.dataTransfer.setData("text/plain", itemId);
            onDragStart();
          }}
          onDragEnd={onDragEnd}
        >
          <GripVertical size={13} />
        </button>
        <strong>{String(index + 1).padStart(2, "0")}</strong>
        <span>{durationLabel}</span>
        {headerActions || <i aria-hidden="true" />}
      </header>
      {children}
    </article>
  );
}
