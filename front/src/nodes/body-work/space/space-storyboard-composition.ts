import {
  type StoryboardAspectRatio,
  type StoryboardDocument,
  type StoryboardShot,
  type StoryboardSpeech,
} from "./space-storyboard";
import { orderItemsByIds } from "./space-ordered-list";
import type { SpaceCanvasNode } from "./types";
import type {
  CanvasVideoComposition,
  VideoComposeAssetReference,
  VideoComposeClip,
  VideoComposeSpeechTrack,
  VideoComposeSubtitleTrack,
} from "./space-video-compose";

export function storyboardVideoComposition(input: {
  storyboard: StoryboardDocument;
  sourceNodeId: string;
  nodes: SpaceCanvasNode[];
  current?: CanvasVideoComposition;
}): CanvasVideoComposition {
  const currentClips = new Map(
    (input.current?.clips || []).map((clip) => [clip.id, clip]),
  );
  const clips = input.storyboard.shots.map((shot, index) =>
    storyboardVideoClip({
      ...input,
      shot,
      index,
      current: currentClips.get(shot.id),
    }),
  );
  return {
    version: 3,
    clips: orderItemsByIds(
      clips,
      (input.current?.clips || []).map((clip) => clip.id),
      (clip) => clip.id,
    ),
    settings: {
      resolution: storyboardCompositionResolution(
        input.storyboard.aspect_ratio,
      ),
      fps: input.current?.settings.fps || 25,
    },
  };
}

function storyboardCompositionResolution(aspectRatio: StoryboardAspectRatio) {
  const resolutions: Record<StoryboardAspectRatio, string> = {
    "16:9": "1920x1080",
    "9:16": "1080x1920",
    "1:1": "1080x1080",
    "4:3": "1440x1080",
    "3:4": "1080x1440",
    "21:9": "2520x1080",
  };
  return resolutions[aspectRatio];
}

function storyboardVideoClip(input: {
  storyboard: StoryboardDocument;
  sourceNodeId: string;
  nodes: SpaceCanvasNode[];
  shot: StoryboardShot;
  index: number;
  current?: VideoComposeClip;
}): VideoComposeClip {
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
  const lipSyncVideo = lipSyncNode?.storyboardItem?.stale
    ? undefined
    : assetReference(lipSyncNode);
  const useOriginalVideo = Boolean(input.current?.useOriginalVideo);
  const issues: string[] = [];

  if (!originalNode?.power) {
    issues.push("未配置镜头视频能力");
  } else if (!originalVideo) {
    issues.push("镜头视频尚未生成");
  }

  const currentTracks = new Map(
    (input.current?.speechTracks || []).map((track) => [track.id, track]),
  );
  const speechTracks = input.shot.speech
    .filter((speech) => speech.text.trim())
    .map((speech) =>
      storyboardSpeechTrack(
        input.nodes,
        input.sourceNodeId,
        speech,
        currentTracks.get(speech.id),
        issues,
      ),
    );
  const subtitleTracks = storyboardSubtitleTracks(
    input.nodes,
    input.sourceNodeId,
    input.shot.id,
  );
  const visualVideo =
    !useOriginalVideo && lipSyncVideo ? lipSyncVideo : originalVideo;

  return {
    id: input.shot.id,
    title: `镜头 ${input.shot.order || input.index + 1}`,
    ...(visualVideo ? { visualVideo } : {}),
    ...(originalVideo ? { originalAudioSource: originalVideo } : {}),
    duration: input.shot.duration,
    originalVolume:
      input.current?.originalVolume ?? (speechTracks.length ? 0.45 : 1),
    speechTracks,
    subtitleTracks,
    useOriginalVideo,
    blockingIssues: uniqueStrings(issues),
    transitionToNext: input.current?.transitionToNext || {
      type: "none",
      durationMs: 500,
    },
  };
}

function storyboardSubtitleTracks(
  nodes: SpaceCanvasNode[],
  sourceNodeId: string,
  shotId: string,
): VideoComposeSubtitleTrack[] {
  const node = findStoryboardItemNode(
    nodes,
    sourceNodeId,
    "subtitle",
    shotId,
  );
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
  current: VideoComposeSpeechTrack | undefined,
  issues: string[],
): VideoComposeSpeechTrack {
  const node = findStoryboardItemNode(nodes, sourceNodeId, "speech", speech.id);
  const audio = assetReference(node);
  if (!node?.power) {
    issues.push(`语音“${speech.text}”未配置语音合成能力`);
  } else if (!audio) {
    issues.push(`语音“${speech.text}”尚未生成`);
  }
  return {
    id: speech.id,
    ...(audio ? { audio } : {}),
    startTime: speech.start_time,
    kind: speech.kind,
    ...(speech.character_id ? { characterId: speech.character_id } : {}),
    text: speech.text,
    volume: current?.volume ?? 1,
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

function uniqueStrings(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function recordValue(value: unknown): Record<string, any> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, any>)
    : {};
}

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function numberValue(value: unknown) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}
