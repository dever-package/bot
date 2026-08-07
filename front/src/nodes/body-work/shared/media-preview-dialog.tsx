import { Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { EnergonMediaPreviewItem } from "@/components/energon/content-view";
import { MediaInspectorGallery } from "../../shared/media-inspector-gallery";
import { DetailDialogFrame, DetailDialogHeader } from "./detail-dialog";

export function BodyWorkImagePreviewDialog({
  items,
  initialItemID,
  onClose,
}: {
  items: EnergonMediaPreviewItem[];
  initialItemID: string | number;
  onClose: () => void;
}) {
  const initialIndex = imagePreviewItemIndex(items, initialItemID);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const itemIdentity = items
    .map((item) => `${String(item.id)}:${item.url}`)
    .join("\n");

  useEffect(() => {
    setActiveIndex(imagePreviewItemIndex(items, initialItemID));
  }, [initialItemID, itemIdentity]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const normalizedIndex = Math.min(
    Math.max(0, activeIndex),
    Math.max(0, items.length - 1),
  );
  const activeItem = items[normalizedIndex];
  if (!activeItem) return null;

  return (
    <DetailDialogFrame
      ariaLabel="图片预览"
      layer="nested"
      onRequestClose={onClose}
      header={
        <DetailDialogHeader
          icon={<ImageIcon size={16} />}
          title={activeItem.name || "图片预览"}
          subtitle={`图片 ${normalizedIndex + 1}/${items.length}`}
          downloadUrl={activeItem.url}
          onClose={onClose}
        />
      }
    >
      <main className="wb-detail-workspace">
        <MediaInspectorGallery
          kind="image"
          items={items}
          activeIndex={normalizedIndex}
          onSelect={setActiveIndex}
        />
      </main>
    </DetailDialogFrame>
  );
}

function imagePreviewItemIndex(
  items: EnergonMediaPreviewItem[],
  itemID: string | number,
) {
  const index = items.findIndex((item) => String(item.id) === String(itemID));
  return index >= 0 ? index : 0;
}
