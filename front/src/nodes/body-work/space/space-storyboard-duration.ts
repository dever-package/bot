import type { PowerParamSource, StoryboardShotDurationSpec } from "./types";
import type { StoryboardDocument } from "./space-storyboard";
import { isPlainRecord as isRecord } from "../shared/structured-json";

export const STORYBOARD_DEFAULT_MIN_SHOT_DURATION = 4;

const STORYBOARD_MIN_SHOT_DURATION_VALUES = new Set([2, 3, 4, 5]);

export function resolveStoryboardMinShotDuration(value: unknown): number {
  if (value == null || String(value).trim() === "") {
    return STORYBOARD_DEFAULT_MIN_SHOT_DURATION;
  }
  const seconds = Number(value);
  if (
    !Number.isInteger(seconds) ||
    !STORYBOARD_MIN_SHOT_DURATION_VALUES.has(seconds)
  ) {
    throw new Error("最短镜头时长必须是 2 到 5 秒");
  }
  return seconds;
}

export function parseStoryboardMinShotDuration(
  value: unknown,
): number | undefined {
  if (value == null || String(value).trim() === "") {
    return undefined;
  }
  try {
    return resolveStoryboardMinShotDuration(value);
  } catch {
    return undefined;
  }
}

export function normalizeStoryboardShotDurationSpecs(
  value: unknown,
): StoryboardShotDurationSpec[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const seen = new Set<number>();
  const specs = value.map((raw) => {
    const row = isRecord(raw) ? raw : {};
    const seconds = resolveStoryboardMinShotDuration(row.seconds);
    const sort = Number(row.sort);
    if (seen.has(seconds) || !Number.isInteger(sort)) {
      throw new Error("分镜最短时长注册信息无效");
    }
    seen.add(seconds);
    return {
      seconds,
      name: String(row.name || "").trim() || `${seconds} 秒`,
      sort,
    };
  });
  if (
    specs.length !== STORYBOARD_MIN_SHOT_DURATION_VALUES.size ||
    [...STORYBOARD_MIN_SHOT_DURATION_VALUES].some(
      (seconds) => !seen.has(seconds),
    )
  ) {
    throw new Error("分镜最短时长注册信息无效");
  }
  return specs.sort((left, right) => left.sort - right.sort);
}

export function storyboardRequiredDurationValues(
  storyboard: Pick<StoryboardDocument, "min_shot_duration" | "shots">,
): number[] {
  const values = [
    resolveStoryboardMinShotDuration(storyboard.min_shot_duration),
    ...storyboard.shots.map((shot) => Number(shot.duration)),
  ];
  return [...new Set(values.filter(isStoryboardDocumentDuration))].sort(
    (left, right) => left - right,
  );
}

export function filterStoryboardDurationSources<T extends PowerParamSource>(
  sources: T[],
  requiredDurationValues: number[] | undefined,
): T[] {
  const required = normalizeStoryboardRequiredDurationValues(
    requiredDurationValues,
  );
  if (required.length === 0) {
    return sources;
  }
  return sources.filter((source) => {
    const supported = new Set(
      (source.supported_options?.duration || []).map((value) =>
        String(value).trim(),
      ),
    );
    return required.every((value) => supported.has(String(value)));
  });
}

export function storyboardDurationCompatibilityError(
  requiredDurationValues: number[] | undefined,
): string {
  const required = normalizeStoryboardRequiredDurationValues(
    requiredDurationValues,
  );
  return required.length > 0
    ? `没有同时支持 ${required.join("、")} 秒的可用视频模型`
    : "";
}

export function normalizeStoryboardRequiredDurationValues(value: unknown) {
  const values = Array.isArray(value) ? value : [];
  return [
    ...new Set(values.map(Number).filter(isStoryboardDocumentDuration)),
  ].sort((left, right) => left - right);
}

function isStoryboardDocumentDuration(value: number) {
  return Number.isInteger(value) && value >= 2;
}
