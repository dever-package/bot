import type { CanvasResultViewState } from "./types";

export type CanvasResultViewDraft = {
  source: CanvasResultViewState;
  value: CanvasResultViewState;
};

export function resolveCanvasResultViewDraft(
  saved: CanvasResultViewState,
  draft: CanvasResultViewDraft | null,
) {
  return draft && sameCanvasResultViewState(draft.source, saved)
    ? draft.value
    : saved;
}

export function updateCanvasResultViewDraft(
  saved: CanvasResultViewState,
  current: CanvasResultViewDraft | null,
  value: CanvasResultViewState,
): CanvasResultViewDraft {
  return {
    source:
      current && sameCanvasResultViewState(current.source, saved)
        ? current.source
        : saved,
    value,
  };
}

export function sameCanvasResultViewState(
  current: CanvasResultViewState | undefined,
  next: CanvasResultViewState,
) {
  return (
    current?.width === next.width &&
    current?.height === next.height &&
    Number(current?.offsetX || 0) === Number(next.offsetX || 0) &&
    Number(current?.offsetY || 0) === Number(next.offsetY || 0)
  );
}
