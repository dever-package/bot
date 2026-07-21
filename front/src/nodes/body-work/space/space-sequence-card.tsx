import { GripVertical } from "lucide-react";
import { useRef, type DragEvent, type ReactNode } from "react";

export function SequenceCard({
  itemId,
  index,
  durationLabel,
  className,
  dragClassName,
  selected = false,
  readonly = false,
  wholeCardDraggable = false,
  dragging = false,
  dropPlacement,
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
  wholeCardDraggable?: boolean;
  dragging?: boolean;
  dropPlacement?: "before" | "after";
  ariaLabel: string;
  headerActions?: ReactNode;
  children: ReactNode;
  onSelect: () => void;
  onDragStart: () => void;
  onDragOver: (event: DragEvent<HTMLElement>) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}) {
  const dragActiveRef = useRef(false);

  function startDrag(event: DragEvent<HTMLElement>) {
    const target = event.target;
    if (
      wholeCardDraggable &&
      target instanceof HTMLElement &&
      target.closest("button, a, input, textarea, select")
    ) {
      event.preventDefault();
      return;
    }
    dragActiveRef.current = true;
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", itemId);
    if (wholeCardDraggable) {
      event.dataTransfer.setDragImage(event.currentTarget, 28, 18);
    }
    onDragStart();
  }

  function finishDrag() {
    onDragEnd();
    window.setTimeout(() => {
      dragActiveRef.current = false;
    }, 0);
  }

  return (
    <article
      className={[
        "ws-sequence-card",
        className,
        selected ? "is-selected" : "",
        wholeCardDraggable && !readonly ? "is-drag-enabled" : "",
        dragging ? "is-dragging" : "",
        dropPlacement ? `is-drop-${dropPlacement}` : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-sequence-item-id={itemId}
      aria-label={ariaLabel}
      draggable={!readonly && wholeCardDraggable}
      onClick={() => {
        if (!dragActiveRef.current) {
          onSelect();
        }
      }}
      onDragStart={!readonly && wholeCardDraggable ? startDrag : undefined}
      onDragOver={
        readonly
          ? undefined
          : (event) => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
              onDragOver(event);
            }
      }
      onDrop={
        readonly
          ? undefined
          : (event) => {
              event.preventDefault();
              onDrop();
            }
      }
      onDragEnd={!readonly && wholeCardDraggable ? finishDrag : undefined}
    >
      <header>
        {wholeCardDraggable ? (
          <span
            className={dragClassName}
            title={readonly ? undefined : "拖动卡片排序"}
            aria-hidden="true"
          >
            <GripVertical size={13} />
          </span>
        ) : (
          <button
            type="button"
            className={dragClassName}
            draggable={!readonly}
            disabled={readonly}
            title="拖动排序"
            aria-label={`拖动${ariaLabel}排序`}
            onClick={(event) => event.stopPropagation()}
            onDragStart={startDrag}
            onDragEnd={finishDrag}
          >
            <GripVertical size={13} />
          </button>
        )}
        <strong>{String(index + 1).padStart(2, "0")}</strong>
        <span>{durationLabel}</span>
        {headerActions || <i aria-hidden="true" />}
      </header>
      {children}
    </article>
  );
}
