export type StoryboardShotSaveMode = "blocked" | "preview" | "manual";

export function storyboardShotSaveMode({
  hasPreview,
  previewMatchesInstruction,
  hasUnappliedInstruction,
  detailed,
  draftChangedManually,
}: {
  hasPreview: boolean;
  previewMatchesInstruction: boolean;
  hasUnappliedInstruction: boolean;
  detailed: boolean;
  draftChangedManually: boolean;
}): StoryboardShotSaveMode {
  if (hasPreview) return previewMatchesInstruction ? "preview" : "blocked";
  if (detailed && (!hasUnappliedInstruction || draftChangedManually)) {
    return "manual";
  }
  return "blocked";
}
