import { isPlainRecord } from "../shared/structured-json";

export const writingStyles = [
  { value: "natural", label: "自然流畅" },
  { value: "restrained", label: "冷峻克制" },
  { value: "vivid", label: "细腻沉浸" },
  { value: "humorous", label: "轻松诙谐" },
] as const;
export const writingViewpoints = [
  { value: "first", label: "第一人称" },
  { value: "third_limited", label: "第三人称限定" },
  { value: "omniscient", label: "全知视角" },
] as const;
export const writingModes = [
  { value: "complete", label: "完整故事" },
  { value: "serial", label: "连载小说" },
] as const;

export type WritingPreferences = {
  genre: string;
  style: "" | (typeof writingStyles)[number]["value"];
  style_instructions: string;
  pov: "" | (typeof writingViewpoints)[number]["value"];
  mode: "" | (typeof writingModes)[number]["value"];
  chapter_words: number;
  planned_chapters: number;
};

export function emptyWritingPreferences(): WritingPreferences {
  return {
    genre: "",
    style: "",
    style_instructions: "",
    pov: "",
    mode: "",
    chapter_words: 0,
    planned_chapters: 0,
  };
}

export function validWritingPreferences(
  value: unknown,
): value is WritingPreferences {
  if (!isPlainRecord(value)) return false;
  return (
    typeof value.genre === "string" &&
    typeof value.style_instructions === "string" &&
    (
      [
        ["style", writingStyles],
        ["pov", writingViewpoints],
        ["mode", writingModes],
      ] as const
    ).every(
      ([key, options]) =>
        value[key] === "" ||
        options.some((option) => option.value === value[key]),
    ) &&
    [value.chapter_words, value.planned_chapters].every(
      (count) =>
        typeof count === "number" && Number.isSafeInteger(count) && count >= 0,
    )
  );
}

export function writingPreferencesSummary(
  preferences: WritingPreferences,
): string {
  return (
    [
      preferences.genre.trim(),
      writingStyles.find((entry) => entry.value === preferences.style)?.label,
      !preferences.style && preferences.style_instructions.trim()
        ? "自定文风"
        : "",
      writingViewpoints.find((entry) => entry.value === preferences.pov)?.label,
      writingModes.find((entry) => entry.value === preferences.mode)?.label,
      preferences.chapter_words ? `每章约 ${preferences.chapter_words} 字` : "",
      preferences.planned_chapters
        ? `计划 ${preferences.planned_chapters} 章`
        : "",
    ]
      .filter(Boolean)
      .join(" · ") || "沿用创作要求"
  );
}
