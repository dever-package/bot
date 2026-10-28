import { useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { moveOrderedItemById } from "../space/space-ordered-list";
import type { WritingDocument, WritingUnitEntry } from "./writing-document";

type ChapterView = "canonical" | "reversed";
type Placement = "before" | "after";
type ChapterDrop = { id: string; placement: Placement };

/** 倒序仅用于视图，文档仍按阅读和生成顺序保存。 */
export function writingChapterView(units: WritingUnitEntry[]) {
  return [...units].reverse();
}

export function reorderWritingChapters(
  units: WritingUnitEntry[],
  sourceId: string,
  targetId: string,
  viewPlacement: Placement,
  view: ChapterView = "reversed",
) {
  const reordered = moveOrderedItemById(
    units,
    sourceId,
    targetId,
    view === "canonical" ? viewPlacement : viewPlacement === "before" ? "after" : "before",
    (unit) => unit.id,
  );
  return reordered.every((unit, index) => unit === units[index])
    ? units
    : reordered;
}

/** 目录和总览共享拖动、键盘排序及提交锁；失败不乐观改写文档。 */
export function useWritingChapterOrder({
  disabled,
  reason,
  getDocument,
  flush,
  onSave,
}: {
  disabled: boolean;
  reason: string;
  getDocument: () => WritingDocument | undefined;
  flush: () => Promise<boolean>;
  onSave: (document: WritingDocument) => Promise<boolean>;
}) {
  const [pending, setPending] = useState(false);
  const [drop, setDrop] = useState<ChapterDrop | null>(null);
  const source = useRef("");
  const [draggingId, setDraggingId] = useState("");
  const submitting = useRef(false);
  const reset = () => {
    source.current = "";
    setDraggingId("");
    setDrop(null);
  };
  const commit = async (
    sourceId: string,
    targetId: string,
    placement: Placement,
    view: ChapterView,
  ) => {
    if (disabled || submitting.current || sourceId === targetId) return false;
    submitting.current = true;
    setPending(true);
    reset();
    try {
      if (!(await flush())) return false;
      const document = getDocument();
      if (!document) return false;
      const units = reorderWritingChapters(
        document.units,
        sourceId,
        targetId,
        placement,
        view,
      );
      if (units === document.units) return false;
      return await onSave({ ...document, units });
    } finally {
      submitting.current = false;
      setPending(false);
    }
  };
  const locked = disabled || pending;
  return {
    pending,
    itemProps: (id: string, view: ChapterView = "reversed") => ({
      draggable: !locked && Boolean(id),
      "data-dragging": (Boolean(id) && draggingId === id) || undefined,
      onDragStart: (event: DragEvent<HTMLElement>) => {
        if (locked || !id || (event.target instanceof Element && event.target.closest("input,textarea,select,[contenteditable=true],[data-writing-drag-ignore]"))) {
          event.preventDefault();
          return;
        }
        source.current = id;
        setDraggingId(id);
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", id);
      },
      onDragEnd: reset,
      "data-drop": drop?.id === id ? drop.placement : undefined,
      onDragOver: (event: DragEvent<HTMLElement>) => {
        if (locked || !source.current || source.current === id) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        const bounds = event.currentTarget.getBoundingClientRect();
        setDrop({
          id,
          placement:
            event.clientY < bounds.top + bounds.height / 2 ? "before" : "after",
        });
      },
      onDragLeave: (event: DragEvent<HTMLElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null))
          setDrop(null);
      },
      onDrop: (event: DragEvent<HTMLElement>) => {
        if (locked || !source.current) return;
        event.preventDefault();
        const bounds = event.currentTarget.getBoundingClientRect();
        return commit(
          source.current,
          id,
          event.clientY < bounds.top + bounds.height / 2 ? "before" : "after",
          view,
        );
      },
    }),
    handleProps: (id: string, view: ChapterView = "reversed") => ({
      disabled: locked || !id,
      title: locked
        ? reason || "正在保存章节顺序"
        : "拖动排序，或按 Alt + ↑ / ↓ 调整位置",
      onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
        if (!event.altKey || !["ArrowUp", "ArrowDown"].includes(event.key))
          return;
        event.preventDefault();
        if (locked) return;
        const units = getDocument()?.units || [];
        const entries = view === "canonical" ? units : writingChapterView(units);
        const index = entries.findIndex((unit) => unit.id === id);
        const target = entries[index + (event.key === "ArrowUp" ? -1 : 1)];
        if (target)
          return commit(
            id,
            target.id,
            event.key === "ArrowUp" ? "before" : "after",
            view,
          );
      },
    }),
  };
}

export type WritingChapterOrder = ReturnType<typeof useWritingChapterOrder>;
