export type MediaGridLayout = "auto" | "2x2" | "3x2" | "3x3";

export type MediaGridLayoutOption = {
  value: MediaGridLayout;
  label: string;
  columns: number;
  rows: number;
  capacity: number;
};

export type MediaGridShape = Pick<
  MediaGridLayoutOption,
  "columns" | "rows" | "capacity"
>;

export const MEDIA_GRID_LAYOUT_OPTIONS: MediaGridLayoutOption[] = [
  { value: "auto", label: "自动", columns: 0, rows: 0, capacity: 9 },
  { value: "2x2", label: "2×2", columns: 2, rows: 2, capacity: 4 },
  { value: "3x2", label: "3×2", columns: 3, rows: 2, capacity: 6 },
  { value: "3x3", label: "3×3", columns: 3, rows: 3, capacity: 9 },
];

const MEDIA_GRID_LAYOUTS = new Set<MediaGridLayout>(
  MEDIA_GRID_LAYOUT_OPTIONS.map((option) => option.value),
);

export function normalizeMediaGridLayout(value: unknown): MediaGridLayout {
  const layout = String(value || "")
    .trim()
    .toLowerCase();
  return MEDIA_GRID_LAYOUTS.has(layout as MediaGridLayout)
    ? (layout as MediaGridLayout)
    : "auto";
}

export function mediaGridLayoutOption(value: unknown): MediaGridLayoutOption {
  const layout = normalizeMediaGridLayout(value);
  return (
    MEDIA_GRID_LAYOUT_OPTIONS.find((option) => option.value === layout) ||
    MEDIA_GRID_LAYOUT_OPTIONS[0]
  );
}

export function mediaGridShape(
  value: unknown,
  itemCount: number,
): MediaGridShape {
  const option = mediaGridLayoutOption(value);
  const count = Math.max(0, Math.trunc(Number(itemCount) || 0));
  if (option.value !== "auto") {
    return option;
  }
  if (count === 0 || count > 6) {
    return { columns: 3, rows: 3, capacity: 9 };
  }
  if (count > 4) {
    return { columns: 3, rows: 2, capacity: 6 };
  }
  if (count > 2) {
    return { columns: 2, rows: 2, capacity: 4 };
  }
  return { columns: 2, rows: 1, capacity: 2 };
}
