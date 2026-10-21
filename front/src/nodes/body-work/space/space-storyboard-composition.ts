import {
  parseStoryboardOutput,
  isStoryboardConfirmed,
  storyboardProductionIncludesLipSync,
  storyboardProductionIncludesSubtitles,
  storyboardProductionIncludesVoice,
  storyboardUsesSoundtrackOnlyAudio,
  type StoryboardDocument,
  type StoryboardShot,
  type StoryboardSpeech,
} from "./space-storyboard";
import { orderItemsByIds } from "./space-ordered-list";
import {
  asPlainRecord as recordValue,
  trimmedString as textValue,
} from "../shared/structured-json";
import type { SpaceCanvasNode } from "./types";
import {
  normalizeVideoComposition,
  videoComposeClipBlockingIssues,
  type CanvasVideoComposition,
  type VideoComposeAssetReference,
  type VideoComposeClip,
  type VideoComposeGlobalAudioTrack,
  type VideoComposeSpeechTrack,
  type VideoComposeSubtitleTrack,
} from "./space-video-compose";

const STORYBOARD_SOUNDTRACK_ID = "storyboard-soundtrack";

/** 资产水合后刷新已有合成草稿，不创建制作节点或覆盖手工剪辑。 */
export function refreshStoryboardVideoCompositionNodes(
  nodes: SpaceCanvasNode[],
) {
  let changed = false;
  const refreshed = nodes.map((node) => {
    if (
      node.storyboardItem?.itemType !== "video_compose" ||
      !node.composerDraft?.videoComposition?.storyboardBaseline
    ) {
      return node;
    }
    const sourceNodeId = node.storyboardItem.sourceNodeId;
    const source = nodes.find((candidate) => candidate.id === sourceNodeId);
    if (!source) return node;
    const storyboard = parseStoryboardOutput([
      source.asset?.version?.content,
      source.resultOutput,
    ]);
    if (!storyboard || !isStoryboardConfirmed(storyboard)) return node;
    const videoComposition = storyboardVideoComposition({
      storyboard,
      sourceNodeId,
      nodes,
      current: node.composerDraft.videoComposition,
    });
    if (
      JSON.stringify(videoComposition) ===
      JSON.stringify(node.composerDraft.videoComposition)
    ) {
      return node;
    }
    changed = true;
    return {
      ...node,
      composerDraft: { ...node.composerDraft, videoComposition },
    };
  });
  return changed ? refreshed : nodes;
}

export function storyboardVideoComposition(input: {
  storyboard: StoryboardDocument;
  sourceNodeId: string;
  nodes: SpaceCanvasNode[];
  current?: CanvasVideoComposition;
}): CanvasVideoComposition {
  const currentClips = new Map(
    (input.current?.clips || []).map((clip) => [clip.id, clip]),
  );
  const generatedClips = input.storyboard.shots.map((shot, index) =>
    storyboardVideoClip({
      ...input,
      shot,
      index,
      current: currentClips.get(shot.id),
    }),
  );
  // 自动结果和基线经过同一归一化，避免保存后的数值变化被误判成人工编辑。
  const generated = normalizeVideoComposition({
    version: 3,
    clips: fitStoryboardTimeline(
      generatedClips,
      input.storyboard.timeline_duration_ms,
    ),
    audioTracks: storyboardSoundtrackTracks(input.storyboard),
    settings: input.current?.settings || { resolution: "auto", fps: 0 },
  }) as CanvasVideoComposition;
  const baseline = input.current?.storyboardBaseline;
  const soundtrackOnly = storyboardUsesSoundtrackOnlyAudio(input.storyboard);
  const clips = mergeStoryboardCompositionItems(
    generated.clips,
    baseline?.clips || [],
    input.current?.clips || [],
    (next, previous, current) =>
      mergeStoryboardVideoClip(next, previous, current, soundtrackOnly),
  );
  const audioTracks = mergeStoryboardCompositionItems(
    generated.audioTracks,
    baseline?.audioTracks || [],
    input.current?.audioTracks || [],
    (next, previous, current) =>
      mergeStoryboardCompositionFields(next, previous, current, [
        "audio",
        "startTime",
        "sourceStart",
        "kind",
        "volume",
        "fit",
        "loop",
        "fadeOut",
      ]),
  );
  return {
    ...generated,
    clips: soundtrackOnly
      ? clips.map((clip) => ({
          ...clip,
          originalVolume: 0,
          speechTracks: [],
          subtitleTracks: [],
        }))
      : clips,
    audioTracks: soundtrackOnly
      ? audioTracks
          .filter((track) => track.id === STORYBOARD_SOUNDTRACK_ID)
          .map((track) => ({ ...track, volume: 1, kind: "music" as const }))
      : audioTracks,
    storyboardBaseline: {
      clips: generated.clips.map(finalizeStoryboardVideoClip),
      audioTracks: generated.audioTracks,
    },
  };
}

function mergeStoryboardVideoClip(
  next: VideoComposeClip,
  previous: VideoComposeClip | undefined,
  current: VideoComposeClip,
  soundtrackOnly: boolean,
): VideoComposeClip {
  const merged = mergeStoryboardCompositionFields(next, previous, current, [
    "title",
    "visualVideo",
    "originalAudioSource",
    "duration",
    "originalVolume",
    "useOriginalVideo",
    "transitionToNext",
  ]);
  merged.speechTracks = soundtrackOnly
    ? []
    : mergeStoryboardCompositionItems(
        next.speechTracks,
        previous?.speechTracks || [],
        current.speechTracks,
        (track, oldTrack, currentTrack) =>
          mergeStoryboardCompositionFields(track, oldTrack, currentTrack, [
            "audio",
            "startTime",
            "sourceStart",
            "fit",
            "kind",
            "characterId",
            "text",
            "volume",
          ]),
      );
  merged.subtitleTracks = next.subtitleTracks;
  if (!previous || current.originalVolume === previous.originalVolume) {
    merged.originalVolume = merged.speechTracks.length ? 0.45 : 1;
  }
  if (soundtrackOnly) merged.originalVolume = 0;
  return finalizeStoryboardVideoClip(merged);
}

/** 先完成时长适配和手工编辑合并，再为无配音字幕补齐最终时间。 */
function finalizeStoryboardVideoClip(clip: VideoComposeClip): VideoComposeClip {
  const finalized = {
    ...clip,
    subtitleTracks: storyboardCompositionSubtitles(
      clip.subtitleTracks,
      clip.speechTracks,
      clip.duration,
    ),
  };
  return {
    ...finalized,
    blockingIssues: videoComposeClipBlockingIssues(finalized),
  };
}

/** 只更新仍等于上次生成值的字段，用户清空引用也属于编辑。 */
function mergeStoryboardCompositionFields<T>(
  next: T,
  previous: T | undefined,
  current: T,
  fields: (keyof T)[],
): T {
  if (!previous) return next;
  const merged = { ...next };
  for (const field of fields) {
    if (JSON.stringify(current[field]) !== JSON.stringify(previous[field])) {
      merged[field] = current[field];
    }
  }
  return merged;
}

/** 生成 ID 的消失是删除；不属于生成基线的 ID 是手动新增。顺序由当前草稿保持。 */
function mergeStoryboardCompositionItems<T extends { id: string }>(
  next: T[],
  previous: T[],
  current: T[],
  merge: (next: T, previous: T | undefined, current: T) => T,
): T[] {
  const previousById = new Map(previous.map((item) => [item.id, item]));
  const currentById = new Map(current.map((item) => [item.id, item]));
  const nextIds = new Set(next.map((item) => item.id));
  const generated = next.flatMap((item) => {
    const old = previousById.get(item.id);
    const edited = currentById.get(item.id);
    if (old && !edited) return [];
    return [merge(item, old, edited || item)];
  });
  const manual = current.filter(
    (item) => !previousById.has(item.id) && !nextIds.has(item.id),
  );
  return orderItemsByIds(
    [...generated, ...manual],
    current.map((item) => item.id),
    (item) => item.id,
  );
}

function storyboardSoundtrackTracks(
  storyboard: StoryboardDocument,
): VideoComposeGlobalAudioTrack[] {
  const soundtrack = storyboard.references.find(
    (reference) => reference.purpose === "soundtrack",
  );
  if (!soundtrack) return [];
  const assetId = Number(soundtrack.asset_id || 0);
  const versionId = Number(soundtrack.version_id || 0);
  return [
    {
      id: STORYBOARD_SOUNDTRACK_ID,
      ...(assetId > 0 && versionId > 0
        ? {
            audio: { assetId, versionId, label: soundtrack.label || "主音轨" },
          }
        : {}),
      startTime: 0,
      sourceStart: (storyboard.storyboard_range_start_ms || 0) / 1000,
      kind: "music",
      volume: storyboardUsesSoundtrackOnlyAudio(storyboard) ? 1 : 0.35,
      fit: "trim",
      loop: false,
      fadeOut: isStoryboardSoundtrackSegment(storyboard) ? 0 : 1,
    },
  ];
}

function isStoryboardSoundtrackSegment(storyboard: StoryboardDocument) {
  const startMs = storyboard.storyboard_range_start_ms;
  const endMs = storyboard.storyboard_range_end_ms;
  const durationMs = storyboard.storyboard_soundtrack_duration_ms;
  return (
    startMs != null &&
    endMs != null &&
    durationMs != null &&
    (startMs > 0 || endMs < durationMs)
  );
}

function fitStoryboardTimeline(
  clips: VideoComposeClip[],
  targetDurationMs?: number,
) {
  if (!targetDurationMs || targetDurationMs <= 0 || clips.length === 0) {
    return clips;
  }
  const rawDurationMs = Math.round(
    clips.reduce((total, clip) => total + clip.duration, 0) * 1000,
  );
  let remainingTransitionBudgetMs = Math.max(
    0,
    rawDurationMs - targetDurationMs,
  );
  let transitionDurationMs = 0;
  const normalized = clips.map((clip) => {
    const requestedDurationMs =
      clip.transitionToNext.type === "none"
        ? 0
        : Math.max(0, clip.transitionToNext.durationMs);
    const durationMs = Math.min(
      requestedDurationMs,
      remainingTransitionBudgetMs,
    );
    remainingTransitionBudgetMs -= durationMs;
    if (durationMs < 100) {
      return {
        ...clip,
        transitionToNext: { type: "none" as const, durationMs: 0 },
      };
    }
    transitionDurationMs += durationMs;
    return {
      ...clip,
      transitionToNext: { ...clip.transitionToNext, durationMs },
    };
  });
  const trimDurationMs =
    rawDurationMs - transitionDurationMs - targetDurationMs;
  if (trimDurationMs <= 0) {
    return normalized;
  }
  const lastIndex = normalized.length - 1;
  const lastClip = normalized[lastIndex];
  const duration = lastClip.duration - trimDurationMs / 1000;
  if (duration <= 0) {
    return normalized;
  }
  normalized[lastIndex] = { ...lastClip, duration };
  return normalized;
}

function storyboardVideoClip(input: {
  storyboard: StoryboardDocument;
  sourceNodeId: string;
  nodes: SpaceCanvasNode[];
  shot: StoryboardShot;
  index: number;
  current?: VideoComposeClip;
}): VideoComposeClip {
  const soundtrackOnly = storyboardUsesSoundtrackOnlyAudio(input.storyboard);
  const originalNode = findStoryboardItemNode(
    input.nodes,
    input.sourceNodeId,
    "shot",
    input.shot.id,
  );
  const lipSyncNode = findStoryboardItemNode(
    input.nodes,
    input.sourceNodeId,
    "lip_sync",
    input.shot.id,
  );
  const originalVideo = assetReference(originalNode);
  const lipSyncVideo = storyboardProductionIncludesLipSync(input.storyboard)
    ? assetReference(lipSyncNode)
    : undefined;
  const useOriginalVideo = Boolean(input.current?.useOriginalVideo);
  const speechTracks = storyboardProductionIncludesVoice(input.storyboard)
    ? input.shot.speech
        .filter((speech) => speech.text.trim())
        .map((speech) =>
          storyboardSpeechTrack(input.nodes, input.sourceNodeId, speech),
        )
    : [];
  const subtitleTracks = storyboardProductionIncludesSubtitles(input.storyboard)
    ? storyboardSubtitleTracks(input.nodes, input.sourceNodeId, input.shot.id)
    : [];
  const visualVideo =
    !useOriginalVideo && lipSyncVideo ? lipSyncVideo : originalVideo;
  const nextShot = input.storyboard.shots[input.index + 1];
  const storyboardTransition = nextShot
    ? {
        type: nextShot.transition_type,
        durationMs:
          nextShot.transition_type === "none"
            ? 0
            : nextShot.transition_duration_ms,
      }
    : { type: "none" as const, durationMs: 0 };

  const clip: VideoComposeClip = {
    id: input.shot.id,
    title: `镜头 ${input.shot.order || input.index + 1}`,
    ...(visualVideo ? { visualVideo } : {}),
    ...(originalVideo ? { originalAudioSource: originalVideo } : {}),
    duration: input.shot.duration,
    originalVolume: soundtrackOnly ? 0 : speechTracks.length ? 0.45 : 1,
    speechTracks,
    subtitleTracks,
    useOriginalVideo,
    blockingIssues: [],
    transitionToNext: storyboardTransition,
  };
  return {
    ...clip,
    blockingIssues: videoComposeClipBlockingIssues(clip),
  };
}

/** 没有配音的文本字幕沿用分镜起点，显示至下一条字幕或镜头结束。 */
function storyboardCompositionSubtitles(
  tracks: VideoComposeSubtitleTrack[],
  speechTracks: VideoComposeSpeechTrack[],
  duration: number,
): VideoComposeSubtitleTrack[] {
  return tracks.map((track) => {
    if (
      !track.speechId ||
      speechTracks.some((speech) => speech.id === track.speechId)
    ) {
      return track;
    }
    const { speechId: _, ...subtitle } = track;
    const nextStart = Math.min(
      duration,
      ...tracks
        .filter((next) => next.startTime > track.startTime)
        .map((next) => next.startTime),
    );
    return { ...subtitle, endTime: track.endTime ?? nextStart };
  });
}

function storyboardSubtitleTracks(
  nodes: SpaceCanvasNode[],
  sourceNodeId: string,
  shotId: string,
): VideoComposeSubtitleTrack[] {
  const node = findStoryboardItemNode(nodes, sourceNodeId, "subtitle", shotId);
  const output = recordValue(node?.resultOutput);
  const tracks = Array.isArray(output.tracks) ? output.tracks : [];
  return tracks.flatMap((value): VideoComposeSubtitleTrack[] => {
    const track = recordValue(value);
    const id = textValue(track.id);
    const text = textValue(track.text);
    if (!id || !text) {
      return [];
    }
    const endTime = numberValue(track.end_time ?? track.endTime);
    const speechId = textValue(track.speech_id ?? track.speechId);
    return [
      {
        id,
        text,
        startTime: Math.max(
          0,
          numberValue(track.start_time ?? track.startTime),
        ),
        ...(endTime > 0 ? { endTime } : {}),
        ...(speechId ? { speechId } : {}),
        source: textValue(track.source) === "speech" ? "speech" : "caption",
      },
    ];
  });
}

function storyboardSpeechTrack(
  nodes: SpaceCanvasNode[],
  sourceNodeId: string,
  speech: StoryboardSpeech,
): VideoComposeSpeechTrack {
  const node = findStoryboardItemNode(nodes, sourceNodeId, "speech", speech.id);
  const audio = assetReference(node);
  return {
    id: speech.id,
    ...(audio ? { audio } : {}),
    startTime: speech.start_time,
    sourceStart: 0,
    fit: "trim",
    kind: speech.kind,
    ...(speech.character_id ? { characterId: speech.character_id } : {}),
    text: speech.text,
    volume: 1,
  };
}

function findStoryboardItemNode(
  nodes: SpaceCanvasNode[],
  sourceNodeId: string,
  itemType: "shot" | "speech" | "subtitle" | "lip_sync",
  itemId: string,
) {
  return nodes.find(
    (node) =>
      node.storyboardItem?.sourceNodeId === sourceNodeId &&
      node.storyboardItem.itemType === itemType &&
      node.storyboardItem.itemId === itemId,
  );
}

function assetReference(
  node?: SpaceCanvasNode,
): VideoComposeAssetReference | undefined {
  const resultAssetId = Number(node?.resultRef?.asset_id || 0);
  const resultVersionId = Number(node?.resultRef?.version_id || 0);
  const assetId =
    resultAssetId && resultVersionId
      ? resultAssetId
      : Number(node?.asset?.id || 0);
  const versionId =
    resultAssetId && resultVersionId
      ? resultVersionId
      : Number(node?.asset?.version_id || node?.asset?.version?.id || 0);
  if (!assetId || !versionId) {
    return undefined;
  }
  return {
    assetId,
    versionId,
    label: node?.title || "素材",
  };
}

function numberValue(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}
