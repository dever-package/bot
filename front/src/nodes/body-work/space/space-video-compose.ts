export type VideoComposeTransitionType = "none" | "fade" | "crossfade";

export type VideoComposeAssetReference = {
  assetId: number;
  versionId: number;
  label: string;
};

export type VideoComposeSpeechTrack = {
  id: string;
  audio?: VideoComposeAssetReference;
  startTime: number;
  kind: "dialogue" | "narration";
  characterId?: string;
  text: string;
  volume: number;
};

export type VideoComposeSubtitleTrack = {
  id: string;
  text: string;
  startTime: number;
  endTime?: number;
  speechId?: string;
  source: "speech" | "caption";
};

export type VideoComposeClip = {
  id: string;
  title: string;
  visualVideo?: VideoComposeAssetReference;
  originalAudioSource?: VideoComposeAssetReference;
  duration: number;
  originalVolume: number;
  speechTracks: VideoComposeSpeechTrack[];
  subtitleTracks: VideoComposeSubtitleTrack[];
  useOriginalVideo: boolean;
  blockingIssues: string[];
  transitionToNext: {
    type: VideoComposeTransitionType;
    durationMs: number;
  };
};

export type CanvasVideoComposition = {
  version: 3;
  clips: VideoComposeClip[];
  settings: {
    resolution: string;
    fps: number;
  };
};

export const VIDEO_COMPOSE_TRANSITIONS: Array<{
  key: VideoComposeTransitionType;
  name: string;
}> = [
  { key: "none", name: "无转场" },
  { key: "fade", name: "淡化" },
  { key: "crossfade", name: "交叉溶解" },
];

export function emptyVideoComposition(): CanvasVideoComposition {
  return {
    version: 3,
    clips: [],
    settings: {
      resolution: "1920x1080",
      fps: 25,
    },
  };
}

export function normalizeVideoComposition(
  value: unknown,
): CanvasVideoComposition | undefined {
  const row = recordValue(value);
  if (Number(row.version || 0) !== 3) {
    return undefined;
  }
  const clips = Array.isArray(row.clips)
    ? row.clips.map(normalizeVideoComposeClip).filter(Boolean)
    : [];
  const settings = recordValue(row.settings);
  return {
    version: 3,
    clips: clips as VideoComposeClip[],
    settings: {
      resolution: stringValue(settings.resolution) || "1920x1080",
      fps: clampNumber(settings.fps, 1, 120, 25),
    },
  };
}

export function videoCompositionDuration(composition: CanvasVideoComposition) {
  const clipDuration = composition.clips.reduce(
    (total, clip) => total + Math.max(0, clip.duration),
    0,
  );
  const transitionDuration = composition.clips.reduce((total, clip, index) => {
    if (
      index >= composition.clips.length - 1 ||
      clip.transitionToNext.type === "none"
    ) {
      return total;
    }
    return total + clip.transitionToNext.durationMs / 1000;
  }, 0);
  return Math.max(0, clipDuration - transitionDuration);
}

export function videoCompositionBlockingIssues(
  composition: CanvasVideoComposition,
) {
  return composition.clips.flatMap((clip, index) =>
    clip.blockingIssues.map(
      (issue) => `${clip.title || `镜头 ${index + 1}`}：${issue}`,
    ),
  );
}

export function videoComposeReferenceKey(reference?: VideoComposeAssetReference) {
  return reference ? `${reference.assetId}:${reference.versionId}` : "";
}

function normalizeVideoComposeClip(value: unknown): VideoComposeClip | null {
  const row = recordValue(value);
  const id = stringValue(row.id);
  if (!id) {
    return null;
  }
  const visualVideo = normalizeVideoComposeReference(
    row.visualVideo ?? row.visual_video,
  );
  const originalAudioSource = normalizeVideoComposeReference(
    row.originalAudioSource ?? row.original_audio_source,
  );
  const transition = recordValue(
    row.transitionToNext ?? row.transition_to_next,
  );
  const speechTracks = Array.isArray(row.speechTracks ?? row.speech_tracks)
    ? (row.speechTracks ?? row.speech_tracks)
        .map(normalizeVideoComposeSpeechTrack)
        .filter(Boolean)
    : [];
  const subtitleTracks = Array.isArray(
    row.subtitleTracks ?? row.subtitle_tracks,
  )
    ? (row.subtitleTracks ?? row.subtitle_tracks)
        .map(normalizeVideoComposeSubtitleTrack)
        .filter(Boolean)
    : [];
  return {
    id,
    title: stringValue(row.title) || visualVideo?.label || "镜头",
    ...(visualVideo ? { visualVideo } : {}),
    ...(originalAudioSource ? { originalAudioSource } : {}),
    duration: Math.max(0, numberValue(row.duration)),
    originalVolume: clampNumber(
      row.originalVolume ?? row.original_volume,
      0,
      1,
      1,
    ),
    speechTracks: speechTracks as VideoComposeSpeechTrack[],
    subtitleTracks: subtitleTracks as VideoComposeSubtitleTrack[],
    useOriginalVideo: booleanValue(
      row.useOriginalVideo ?? row.use_original_video,
    ),
    blockingIssues: stringArray(
      row.blockingIssues ?? row.blocking_issues,
    ),
    transitionToNext: {
      type: normalizeTransitionType(transition.type),
      durationMs: clampNumber(
        transition.durationMs ?? transition.duration_ms,
        100,
        5000,
        500,
      ),
    },
  };
}

function normalizeVideoComposeSubtitleTrack(
  value: unknown,
): VideoComposeSubtitleTrack | null {
  const row = recordValue(value);
  const id = stringValue(row.id);
  const text = stringValue(row.text);
  if (!id || !text) {
    return null;
  }
  const source = stringValue(row.source) === "speech" ? "speech" : "caption";
  const speechId = stringValue(row.speechId ?? row.speech_id);
  const endTime = numberValue(row.endTime ?? row.end_time);
  return {
    id,
    text,
    startTime: Math.max(0, numberValue(row.startTime ?? row.start_time)),
    ...(endTime > 0 ? { endTime } : {}),
    ...(speechId ? { speechId } : {}),
    source,
  };
}

function normalizeVideoComposeSpeechTrack(
  value: unknown,
): VideoComposeSpeechTrack | null {
  const row = recordValue(value);
  const id = stringValue(row.id);
  if (!id) {
    return null;
  }
  const audio = normalizeVideoComposeReference(row.audio);
  const kind = stringValue(row.kind) === "narration" ? "narration" : "dialogue";
  const characterId = stringValue(row.characterId ?? row.character_id);
  return {
    id,
    ...(audio ? { audio } : {}),
    startTime: Math.max(0, numberValue(row.startTime ?? row.start_time)),
    kind,
    ...(characterId ? { characterId } : {}),
    text: stringValue(row.text),
    volume: clampNumber(row.volume, 0, 1, 1),
  };
}

function normalizeVideoComposeReference(
  value: unknown,
): VideoComposeAssetReference | undefined {
  const row = recordValue(value);
  const assetId = numberValue(row.assetId ?? row.asset_id);
  const versionId = numberValue(row.versionId ?? row.version_id);
  if (!assetId || !versionId) {
    return undefined;
  }
  return {
    assetId,
    versionId,
    label: stringValue(row.label),
  };
}

function normalizeTransitionType(value: unknown): VideoComposeTransitionType {
  const type = stringValue(value) as VideoComposeTransitionType;
  return VIDEO_COMPOSE_TRANSITIONS.some((option) => option.key === type)
    ? type
    : "none";
}

function recordValue(value: unknown): Record<string, any> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, any>)
    : {};
}

function stringValue(value: unknown) {
  return String(value ?? "").trim();
}

function stringArray(value: unknown) {
  return Array.isArray(value)
    ? value.map(stringValue).filter(Boolean)
    : [];
}

function numberValue(value: unknown) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function clampNumber(
  value: unknown,
  min: number,
  max: number,
  fallback: number,
) {
  const number = Number(value);
  if (!Number.isFinite(number)) {
    return fallback;
  }
  return Math.min(max, Math.max(min, number));
}

function booleanValue(value: unknown) {
  return value === true || value === 1 || value === "1" || value === "true";
}
