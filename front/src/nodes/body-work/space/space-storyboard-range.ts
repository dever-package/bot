export type StoryboardRangeTimeSelection = {
  minutes: number;
  seconds: number;
};

export type StoryboardRangeSelection = {
  startMs: number;
  endMs: number;
  soundtrackDurationMs: number;
};

type StoryboardSoundtrackReference = {
  asset_id?: unknown;
  version_id?: unknown;
  purpose?: unknown;
};

type StoryboardSoundtrackAsset = {
  refId?: unknown;
  versionID?: unknown;
  output?: unknown;
  asset?: unknown;
  preview?: { audioUrl?: unknown };
};

const MILLISECONDS_PER_SECOND = 1000;
const SECONDS_PER_MINUTE = 60;
const MEDIA_DURATION_NESTED_KEYS = [
  "meta",
  "metadata",
  "attrs",
  "audio",
  "audios",
  "video",
  "videos",
  "media_files",
  "mediaFiles",
  "output",
  "result",
  "data",
  "content",
  "body",
  "value",
  "asset",
  "version",
  "versions",
] as const;

export function splitStoryboardRangeTime(
  milliseconds: number,
): StoryboardRangeTimeSelection {
  const totalSeconds = Math.max(
    0,
    Math.floor(Number(milliseconds || 0) / MILLISECONDS_PER_SECOND),
  );
  return {
    minutes: Math.floor(totalSeconds / SECONDS_PER_MINUTE),
    seconds: totalSeconds % SECONDS_PER_MINUTE,
  };
}

export function resolveStoryboardSoundtrackRangeSource(
  references: StoryboardSoundtrackReference[],
  assets: StoryboardSoundtrackAsset[],
) {
  const reference = references.find(
    (candidate) => String(candidate.purpose || "") === "soundtrack",
  );
  const assetID = positiveInteger(reference?.asset_id);
  const versionID = positiveInteger(reference?.version_id);
  const candidates = assets.filter(
    (candidate) => positiveInteger(candidate.refId) === assetID,
  );
  const asset =
    candidates.find(
      (candidate) =>
        !versionID || positiveInteger(candidate.versionID) === versionID,
    ) || candidates[0];
  return {
    durationMs:
      extractStoryboardMediaDurationMs(asset?.output) ||
      extractStoryboardMediaDurationMs(asset?.asset),
    audioUrl: String(asset?.preview?.audioUrl || "").trim(),
  };
}

export function extractStoryboardMediaDurationMs(value: unknown) {
  return extractMediaDurationMs(value, 0, new Set<object>());
}

export function normalizeStoryboardRangeSelection(
  startMs: number,
  endMs?: number,
  soundtrackDurationMs?: number,
) {
  const normalizedSoundtrackDurationMs =
    wholeSecondMilliseconds(soundtrackDurationMs);
  if (normalizedSoundtrackDurationMs < MILLISECONDS_PER_SECOND) {
    return undefined;
  }
  const normalizedStartMs = Math.min(
    wholeSecondMilliseconds(startMs),
    normalizedSoundtrackDurationMs - MILLISECONDS_PER_SECOND,
  );
  const normalizedEndMs = Math.min(
    normalizedSoundtrackDurationMs,
    Math.max(
      normalizedStartMs + MILLISECONDS_PER_SECOND,
      endMs == null
        ? normalizedSoundtrackDurationMs
        : wholeSecondMilliseconds(endMs),
    ),
  );
  return {
    startMs: normalizedStartMs,
    endMs: normalizedEndMs,
    soundtrackDurationMs: normalizedSoundtrackDurationMs,
  };
}

export function storyboardRangePositionBounds(
  selection: StoryboardRangeSelection,
) {
  return {
    start: {
      minMs: 0,
      maxMs: selection.endMs - MILLISECONDS_PER_SECOND,
    },
    end: {
      minMs: selection.startMs + MILLISECONDS_PER_SECOND,
      maxMs: selection.soundtrackDurationMs,
    },
  };
}

export function storyboardRangeTimeMilliseconds({
  minutes,
  seconds,
}: StoryboardRangeTimeSelection) {
  return (
    (Math.max(0, Math.floor(minutes)) * SECONDS_PER_MINUTE +
      Math.min(SECONDS_PER_MINUTE - 1, Math.max(0, Math.floor(seconds)))) *
    MILLISECONDS_PER_SECOND
  );
}

export function formatStoryboardRangeTime(milliseconds: number) {
  const { minutes, seconds } = splitStoryboardRangeTime(milliseconds);
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function extractMediaDurationMs(
  value: unknown,
  depth: number,
  seen: Set<object>,
): number {
  if (value == null || depth > 6) {
    return 0;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const durationMs = extractMediaDurationMs(item, depth + 1, seen);
      if (durationMs > 0) {
        return durationMs;
      }
    }
    return 0;
  }
  if (typeof value !== "object" || seen.has(value)) {
    return 0;
  }
  seen.add(value);
  const record = value as Record<string, unknown>;
  for (const key of ["duration_ms", "durationMs"] as const) {
    const durationMs = durationNumber(record[key], 1);
    if (durationMs > 0) {
      return durationMs;
    }
  }
  const durationMs = durationNumber(record.duration, MILLISECONDS_PER_SECOND);
  if (durationMs > 0) {
    return durationMs;
  }
  for (const key of MEDIA_DURATION_NESTED_KEYS) {
    const nestedDurationMs = extractMediaDurationMs(
      record[key],
      depth + 1,
      seen,
    );
    if (nestedDurationMs > 0) {
      return nestedDurationMs;
    }
  }
  return 0;
}

function durationNumber(value: unknown, multiplier: number) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0
    ? Math.round(number * multiplier)
    : 0;
}

function wholeSecondMilliseconds(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) && number > 0
    ? Math.floor(number / MILLISECONDS_PER_SECOND) * MILLISECONDS_PER_SECOND
    : 0;
}

function positiveInteger(value: unknown) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0 ? number : 0;
}
