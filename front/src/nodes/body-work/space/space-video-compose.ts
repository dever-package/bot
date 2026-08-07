import {
  asPlainRecord as recordValue,
  finiteNumberOrZero as numberValue,
} from "../shared/structured-json";
import type { CanvasReferenceMediaItem } from "./types";

export const VIDEO_COMPOSE_TRANSITION_GROUPS = [
  {
    name: "基础",
    options: [
      { key: "none", name: "无转场" },
      { key: "fade", name: "淡化" },
      { key: "crossfade", name: "交叉溶解" },
      { key: "fadeblack", name: "黑场淡化" },
      { key: "fadewhite", name: "白场淡化" },
    ],
  },
  {
    name: "擦除",
    options: [
      { key: "wipeleft", name: "向左擦除" },
      { key: "wiperight", name: "向右擦除" },
      { key: "wipeup", name: "向上擦除" },
      { key: "wipedown", name: "向下擦除" },
    ],
  },
  {
    name: "滑动",
    options: [
      { key: "slideleft", name: "向左滑动" },
      { key: "slideright", name: "向右滑动" },
      { key: "slideup", name: "向上滑动" },
      { key: "slidedown", name: "向下滑动" },
    ],
  },
  {
    name: "平滑",
    options: [
      { key: "smoothleft", name: "向左平滑" },
      { key: "smoothright", name: "向右平滑" },
      { key: "smoothup", name: "向上平滑" },
      { key: "smoothdown", name: "向下平滑" },
    ],
  },
  {
    name: "镜头",
    options: [
      { key: "zoomin", name: "放大切换" },
      { key: "circleopen", name: "圆形展开" },
      { key: "circleclose", name: "圆形收拢" },
    ],
  },
  {
    name: "覆盖",
    options: [
      { key: "coverleft", name: "向左覆盖" },
      { key: "coverright", name: "向右覆盖" },
      { key: "coverup", name: "向上覆盖" },
      { key: "coverdown", name: "向下覆盖" },
    ],
  },
  {
    name: "揭示",
    options: [
      { key: "revealleft", name: "向左揭示" },
      { key: "revealright", name: "向右揭示" },
      { key: "revealup", name: "向上揭示" },
      { key: "revealdown", name: "向下揭示" },
    ],
  },
] as const;

export function formatVideoComposeDuration(value: number) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? rounded.toString() : rounded.toFixed(1);
}

export type VideoComposeTransitionType =
  (typeof VIDEO_COMPOSE_TRANSITION_GROUPS)[number]["options"][number]["key"];

export type VideoComposeAssetReference = {
  assetId: number;
  versionId: number;
  label: string;
  mediaIndex?: number;
  mediaUrl?: string;
  mediaItems?: CanvasReferenceMediaItem[];
};

export type VideoComposeAudioFit = "trim" | "strict";

export type VideoComposeSpeechTrack = {
  id: string;
  audio?: VideoComposeAssetReference;
  startTime: number;
  sourceStart: number;
  fit: VideoComposeAudioFit;
  kind: "dialogue" | "narration";
  characterId?: string;
  text: string;
  volume: number;
};

export type VideoComposeGlobalAudioTrack = {
  id: string;
  audio?: VideoComposeAssetReference;
  startTime: number;
  sourceStart: number;
  kind: "music" | "narration";
  volume: number;
  fit: VideoComposeAudioFit;
  loop: boolean;
  fadeOut: number;
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
  sourceEdgeId?: string;
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
  storyboardTransitionToNext?: {
    type: VideoComposeTransitionType;
    durationMs: number;
  };
};

export type CanvasVideoComposition = {
  version: 3;
  clips: VideoComposeClip[];
  audioTracks: VideoComposeGlobalAudioTrack[];
  settings: {
    resolution: string;
    fps: number;
  };
};

export function emptyVideoComposition(): CanvasVideoComposition {
  return {
    version: 3,
    clips: [],
    audioTracks: [],
    settings: {
      resolution: "auto",
      fps: 0,
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
  const audioTracks = Array.isArray(row.audioTracks ?? row.audio_tracks)
    ? (row.audioTracks ?? row.audio_tracks)
        .map(normalizeVideoComposeGlobalAudioTrack)
        .filter(Boolean)
    : [];
  return {
    version: 3,
    clips: clips as VideoComposeClip[],
    audioTracks: audioTracks as VideoComposeGlobalAudioTrack[],
    settings: {
      resolution: stringValue(settings.resolution) || "auto",
      fps: clampNumber(settings.fps, 0, 120, 0),
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
  const clipIssues = composition.clips.flatMap((clip, index) =>
    clip.blockingIssues.map(
      (issue) => `${clip.title || `镜头 ${index + 1}`}：${issue}`,
    ),
  );
  const audioIssues = composition.audioTracks.flatMap((track, index) =>
    track.audio ? [] : [`全片声音 ${index + 1}：缺少音频素材`],
  );
  return [...clipIssues, ...audioIssues];
}

export function videoComposeReferenceKey(reference?: VideoComposeAssetReference) {
  return reference ? `${reference.assetId}:${reference.versionId}` : "";
}

export function videoComposeMediaReferenceKey(
  reference?: VideoComposeAssetReference,
) {
  if (!reference) {
    return "";
  }
  return [
    videoComposeReferenceKey(reference),
    Number(reference.mediaIndex || 0),
    reference.mediaUrl || "",
  ].join(":");
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
  const storyboardTransition = recordValue(
    row.storyboardTransitionToNext ?? row.storyboard_transition_to_next,
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
  const normalizedStoryboardTransition = normalizeOptionalVideoTransition(
    storyboardTransition,
  );
  const transitionType = normalizeTransitionType(transition.type);
  const sourceEdgeId = stringValue(row.sourceEdgeId ?? row.source_edge_id);
  return {
    id,
    title: stringValue(row.title) || visualVideo?.label || "镜头",
    ...(sourceEdgeId ? { sourceEdgeId } : {}),
    ...(visualVideo ? { visualVideo } : {}),
    ...(originalAudioSource ? { originalAudioSource } : {}),
    duration: normalizeTargetDuration(row.duration),
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
      type: transitionType,
      durationMs:
        transitionType === "none"
          ? 0
          : clampNumber(
              transition.durationMs ?? transition.duration_ms,
              100,
              5000,
              500,
            ),
    },
    ...(normalizedStoryboardTransition
      ? { storyboardTransitionToNext: normalizedStoryboardTransition }
      : {}),
  };
}

function normalizeOptionalVideoTransition(value: Record<string, any>) {
  if (!Object.keys(value).length) {
    return undefined;
  }
  const type = normalizeTransitionType(value.type);
  return {
    type,
    durationMs:
      type === "none"
        ? 0
        : clampNumber(value.durationMs ?? value.duration_ms, 100, 5000, 500),
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
    sourceStart: Math.max(
      0,
      numberValue(row.sourceStart ?? row.source_start),
    ),
    fit: normalizeAudioFit(row.fit, "trim"),
    kind,
    ...(characterId ? { characterId } : {}),
    text: stringValue(row.text),
    volume: clampNumber(row.volume, 0, 1, 1),
  };
}

function normalizeVideoComposeGlobalAudioTrack(
  value: unknown,
): VideoComposeGlobalAudioTrack | null {
  const row = recordValue(value);
  const id = stringValue(row.id);
  if (!id) {
    return null;
  }
  const audio = normalizeVideoComposeReference(row.audio);
  const kind = stringValue(row.kind) === "narration" ? "narration" : "music";
  return {
    id,
    ...(audio ? { audio } : {}),
    startTime: Math.max(0, numberValue(row.startTime ?? row.start_time)),
    sourceStart: Math.max(
      0,
      numberValue(row.sourceStart ?? row.source_start),
    ),
    kind,
    volume: clampNumber(row.volume, 0, 1, kind === "music" ? 0.35 : 1),
    fit: normalizeAudioFit(row.fit, kind === "music" ? "trim" : "strict"),
    loop: kind === "music" && booleanValue(row.loop),
    fadeOut: clampNumber(
      row.fadeOut ?? row.fade_out,
      0,
      10,
      kind === "music" ? 1 : 0,
    ),
  };
}

function normalizeAudioFit(
  value: unknown,
  fallback: VideoComposeAudioFit,
): VideoComposeAudioFit {
  return stringValue(value) === "strict"
    ? "strict"
    : stringValue(value) === "trim"
      ? "trim"
      : fallback;
}

function normalizeTargetDuration(value: unknown) {
  const duration = numberValue(value);
  return duration > 0 ? Math.max(1, Math.floor(duration)) : 0;
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
  const mediaItems = normalizeVideoComposeMediaItems(
    row.mediaItems ??
      row.media_items ??
      row.refMediaItems ??
      row.ref_media_items,
  );
  return {
    assetId,
    versionId,
    label: stringValue(row.label),
    ...(numberValue(row.mediaIndex ?? row.media_index) > 0
      ? { mediaIndex: numberValue(row.mediaIndex ?? row.media_index) }
      : {}),
    ...(stringValue(row.mediaUrl ?? row.media_url)
      ? { mediaUrl: stringValue(row.mediaUrl ?? row.media_url) }
      : {}),
    ...(mediaItems.length ? { mediaItems } : {}),
  };
}

function normalizeVideoComposeMediaItems(
  value: unknown,
): CanvasReferenceMediaItem[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const result: CanvasReferenceMediaItem[] = [];
  const seen = new Set<string>();
  for (const valueItem of value) {
    const item = recordValue(valueItem);
    const url = stringValue(item.url);
    const index = numberValue(item.index);
    if (!url && index <= 0) {
      continue;
    }
    const key = index > 0 ? `index:${index}` : `url:${url}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    result.push({
      url,
      index: index > 0 ? index : 0,
      ...(stringValue(item.usage) ? { usage: stringValue(item.usage) } : {}),
    });
  }
  return result;
}

function normalizeTransitionType(value: unknown): VideoComposeTransitionType {
  const type = stringValue(value) as VideoComposeTransitionType;
  return VIDEO_COMPOSE_TRANSITION_GROUPS.some((group) =>
    group.options.some((option) => option.key === type),
  )
    ? type
    : "none";
}

function stringValue(value: unknown) {
  return String(value ?? "").trim();
}

function stringArray(value: unknown) {
  return Array.isArray(value)
    ? value.map(stringValue).filter(Boolean)
    : [];
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
