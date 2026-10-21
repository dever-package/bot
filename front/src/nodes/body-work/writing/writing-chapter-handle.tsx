import { GripVertical } from "lucide-react";
import type { WritingChapterOrder } from "./use-writing-chapter-order";

export function WritingChapterHandle({
  order,
  id,
  title,
}: {
  order: WritingChapterOrder;
  id: string;
  title: string;
}) {
  return (
    <button
      type="button"
      className="writing-chapter-handle"
      aria-label={`调整「${title}」顺序`}
      {...order.handleProps(id)}
    >
      <GripVertical size={14} />
    </button>
  );
}
