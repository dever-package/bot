export const SPACE_ASSISTANT_DEFAULT_WIDTH = 520;
export const SPACE_ASSISTANT_MIN_WIDTH = 440;
export const SPACE_ASSISTANT_MAX_WIDTH = 720;
export const SPACE_ASSISTANT_WIDTH_STORAGE_KEY = "bot.canvasAssistant.width";
export const SPACE_ASSISTANT_OPEN_STORAGE_KEY = "bot.canvasAssistant.open";

export type SpaceAssistantVisibility = {
  launcherVisible: boolean;
  panelVisible: boolean;
};

export function clampSpaceAssistantWidth(value: number) {
  if (!Number.isFinite(value)) {
    return SPACE_ASSISTANT_DEFAULT_WIDTH;
  }
  return Math.min(
    SPACE_ASSISTANT_MAX_WIDTH,
    Math.max(SPACE_ASSISTANT_MIN_WIDTH, Math.round(value)),
  );
}

export function resolveSpaceAssistantVisibility(
  available: boolean,
  open: boolean,
): SpaceAssistantVisibility {
  const panelVisible = available && open;
  return {
    launcherVisible: available && !panelVisible,
    panelVisible,
  };
}

export function storedSpaceAssistantOpen(value: string | null) {
  return value === "1";
}
