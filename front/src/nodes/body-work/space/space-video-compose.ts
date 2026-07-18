export type VideoComposeTransitionType = "none" | "fade" | "crossfade";

export type VideoComposeAssetReference = {
  assetId: number;
  versionId: number;
  label: string;
};

export type VideoComposeClip = {
  id: string;
  title: string;
  video: VideoComposeAssetReference;
  duration: number;
  subtitle: string;
  sound: {
    keepOriginal: boolean;
    originalVolume: number;
    voice?: VideoComposeAssetReference;
    voiceVolume: number;
  };
  transitionToNext: {
    type: VideoComposeTransitionType;
    durationMs: number;
  };
};

export type CanvasVideoComposition = {
  version: 1;
  clips: VideoComposeClip[];
  settings: {
    resolution: string;
    fps: number;
    backgroundMusic?: VideoComposeAssetReference;
    backgroundMusicVolume: number;
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
    version: 1,
    clips: [],
    settings: {
      resolution: "1920x1080",
      fps: 25,
      backgroundMusicVolume: 0.2,
    },
  };
}

export function normalizeVideoComposition(
  value: unknown,
): CanvasVideoComposition | undefined {
  const row = recordValue(value);
  if (Number(row.version || 0) !== 1) {
    return undefined;
  }
  const clips = Array.isArray(row.clips)
    ? row.clips.map(normalizeVideoComposeClip).filter(Boolean)
    : [];
  const settings = recordValue(row.settings);
  const backgroundMusic = normalizeVideoComposeReference(
    settings.backgroundMusic ?? settings.background_music,
  );
  return {
    version: 1,
    clips: clips as VideoComposeClip[],
    settings: {
      resolution: stringValue(settings.resolution) || "1920x1080",
      fps: clampNumber(settings.fps, 1, 120, 25),
      ...(backgroundMusic ? { backgroundMusic } : {}),
      backgroundMusicVolume: clampNumber(
        settings.backgroundMusicVolume ?? settings.background_music_volume,
        0,
        1,
        0.2,
      ),
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

export function videoComposeReferenceKey(reference: VideoComposeAssetReference) {
  return `${reference.assetId}:${reference.versionId}`;
}

function normalizeVideoComposeClip(value: unknown): VideoComposeClip | null {
  const row = recordValue(value);
  const video = normalizeVideoComposeReference(row.video);
  const id = stringValue(row.id);
  if (!id || !video) {
    return null;
  }
  const sound = recordValue(row.sound);
  const voice = normalizeVideoComposeReference(sound.voice);
  const transition = recordValue(
    row.transitionToNext ?? row.transition_to_next,
  );
  return {
    id,
    title: stringValue(row.title) || video.label || "镜头",
    video,
    duration: Math.max(0, numberValue(row.duration)),
    subtitle: stringValue(row.subtitle),
    sound: {
      keepOriginal: booleanValue(
        sound.keepOriginal ?? sound.keep_original,
        true,
      ),
      originalVolume: clampNumber(
        sound.originalVolume ?? sound.original_volume,
        0,
        1,
        1,
      ),
      ...(voice ? { voice } : {}),
      voiceVolume: clampNumber(
        sound.voiceVolume ?? sound.voice_volume,
        0,
        1,
        1,
      ),
    },
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

function booleanValue(value: unknown, fallback: boolean) {
  if (value == null || value === "") {
    return fallback;
  }
  return value === true || value === 1 || value === "1" || value === "true";
}
