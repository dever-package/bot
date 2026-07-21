import {
  storyboardHasVisibleDialogue,
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
} from "./space-video-compose";

export function storyboardVideoComposition(input: {
  storyboard: StoryboardDocument;
  sourceNodeId: string;
  nodes: SpaceCanvasNode[];
  enableLipSync: boolean;
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
    version: 2,
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
  enableLipSync: boolean;
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
  const lipSyncVideo = assetReference(lipSyncNode);
  const lipSyncRequired =
    input.enableLipSync && storyboardHasVisibleDialogue(input.shot);
  const useOriginalVideo = lipSyncRequired
    ? Boolean(input.current?.useOriginalVideo)
    : false;
  const issues: string[] = [];

  if (!originalNode?.power) {
    issues.push("未配置镜头视频能力");
  } else if (!originalVideo) {
    issues.push("镜头视频尚未生成");
  } else if (originalNode.storyboardItem?.stale) {
    issues.push("镜头视频需要更新");
  }

  if (lipSyncRequired && !useOriginalVideo) {
    if (!lipSyncNode?.power) {
      issues.push("未配置口型同步能力");
    } else if (!lipSyncVideo) {
      issues.push("口型同步尚未完成");
    } else if (lipSyncNode.storyboardItem?.stale) {
      issues.push("口型同步需要更新");
    }
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

  return {
    id: input.shot.id,
    title: `镜头 ${input.shot.order || input.index + 1}`,
    ...((lipSyncRequired && !useOriginalVideo ? lipSyncVideo : originalVideo)
      ? {
          visualVideo: (lipSyncRequired && !useOriginalVideo
            ? lipSyncVideo
            : originalVideo)!,
        }
      : {}),
    ...(originalVideo ? { originalAudioSource: originalVideo } : {}),
    duration: input.shot.duration,
    subtitle: input.current?.subtitle || "",
    originalVolume:
      input.current?.originalVolume ?? (speechTracks.length ? 0.45 : 1),
    speechTracks,
    lipSyncRequired,
    useOriginalVideo,
    blockingIssues: uniqueStrings(issues),
    transitionToNext: input.current?.transitionToNext || {
      type: "none",
      durationMs: 500,
    },
  };
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
  } else if (node.storyboardItem?.stale) {
    issues.push(`语音“${speech.text}”需要更新`);
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
  itemType: "shot" | "speech" | "lip_sync",
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
