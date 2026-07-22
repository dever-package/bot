import type { StoryboardEditorFocus } from "./space-storyboard";
import type { SpaceCanvasNode } from "./types";

const MATERIAL_GROUP_FOCUS: Record<string, StoryboardEditorFocus> = {
  characters: { section: "materials", materialType: "character" },
  scenes: { section: "materials", materialType: "scene" },
  props: { section: "materials", materialType: "prop" },
};

export function storyboardEditorFocusFromNode(
  node?: SpaceCanvasNode | null,
): StoryboardEditorFocus | undefined {
  if (!node) {
    return undefined;
  }
  if (node.type === "group") {
    const syncKey = String(node.group?.syncKey || "");
    return MATERIAL_GROUP_FOCUS[syncKey] || { section: "shots" };
  }

  const item = node.storyboardItem;
  if (!item) {
    return undefined;
  }
  if (
    item.itemType === "character" ||
    item.itemType === "scene" ||
    item.itemType === "prop"
  ) {
    return {
      section: "materials",
      materialType: item.itemType,
      materialId: item.itemId,
    };
  }
  if (item.itemType === "video_compose") {
    return { section: "shots" };
  }
  return {
    section: "shots",
    shotId: item.shotId || item.itemId,
  };
}
