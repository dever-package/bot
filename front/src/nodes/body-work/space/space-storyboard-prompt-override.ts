import type { CanvasComposerDraft, CanvasStoryboardItemConfig } from "./types";

export function storyboardManualPrompt(
  currentPrompt: string | undefined,
  generatedPrompt: string | undefined,
) {
  const current = String(currentPrompt || "");
  return current.trim() &&
    current.trim() === String(generatedPrompt || "").trim()
    ? ""
    : current;
}

export function isStoryboardShotPrompt(
  item: CanvasStoryboardItemConfig | undefined,
): item is CanvasStoryboardItemConfig & { itemType: "shot" | "shot_image" } {
  return item?.itemType === "shot" || item?.itemType === "shot_image";
}

export function storyboardDerivedManualPrompt(
  draft: CanvasComposerDraft | undefined,
  item: CanvasStoryboardItemConfig | undefined,
) {
  return isStoryboardShotPrompt(item)
    ? draft?.storyboardPromptOverride || ""
    : storyboardManualPrompt(draft?.prompt, item?.generatedPrompt);
}
