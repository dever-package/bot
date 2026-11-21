import { contentOutputMediaURLs } from "../shared/content-output";
import type { StoryboardDocument, StoryboardShot } from "./space-storyboard";
import type { SpaceCanvasNode } from "./types";
import { resolveNodeDetailMediaOutput } from "./node-detail/node-detail-content";
import {
  normalizeStoryboardFrameMediaItems,
  parseStoryboardShotImageMode,
  type StoryboardFrameRole,
} from "./space-storyboard-frame-plan";

export type StoryboardFrameMedia = {
  node?: SpaceCanvasNode;
  imageURL: string;
};

type StoryboardFrameSource = {
  node: SpaceCanvasNode;
  mediaIndex: number;
};

export type StoryboardFrame = {
  shot: StoryboardShot;
  start: StoryboardFrameMedia;
  end?: StoryboardFrameMedia;
  references?: StoryboardFrameMedia[];
};

export function storyboardFrames(
  storyboard: StoryboardDocument,
  sourceNodeId: string,
  canvasNodes: SpaceCanvasNode[],
): StoryboardFrame[] {
  const nodesByShotId = new Map<string, Partial<Record<StoryboardFrameRole, StoryboardFrameSource>> & { referenceNode?: SpaceCanvasNode }>();
  const boundary = storyboard.chapter_boundary;
  let chapterTail: StoryboardFrameSource | undefined;
  for (const node of canvasNodes) {
    const item = node.storyboardItem;
    if (item?.itemType !== "shot_image" || !item.shotId) continue;
    const media = normalizeStoryboardFrameMediaItems(item.frameMediaItems);
    if (item.sourceNodeId === sourceNodeId) {
      const frames = nodesByShotId.get(item.shotId) || {};
      for (const frame of media) {
        frames[frame.frameRole] = { node, mediaIndex: frame.mediaIndex };
      }
      if (parseStoryboardShotImageMode(item.shotImageMode) === "references") frames.referenceNode = node;
      nodesByShotId.set(item.shotId, frames);
    } else if (boundary?.connection === "continue" && item.sourceNodeId === boundary.node_id &&
        item.shotId === boundary.shot_id) {
      const end = media.find((frame) => frame.frameRole === "end");
      if (end) chapterTail = { node, mediaIndex: end.mediaIndex };
    }
  }
  return storyboard.shots.map((shot, index) => {
    const nodes = nodesByShotId.get(shot.id);
    if (nodes?.referenceNode) {
      const images = contentOutputMediaURLs(storyboardNodeMediaOutput(nodes.referenceNode), "image");
      return { shot, start: storyboardFrameMedia(), references: images.slice(0, 4).map((imageURL) => ({ node: nodes.referenceNode, imageURL })) };
    }
    const start = index === 0 && boundary?.connection === "continue"
      ? chapterTail
      : index > 0 && shot.continue_previous
        ? nodesByShotId.get(storyboard.shots[index - 1].id)?.end
        : nodes?.start;
    return {
      shot,
      start: storyboardFrameMedia(start),
      ...(nodes?.end ? { end: storyboardFrameMedia(nodes.end) } : {}),
    };
  });
}

function storyboardFrameMedia(
  source?: StoryboardFrameSource,
): StoryboardFrameMedia {
  const output = source ? storyboardNodeMediaOutput(source.node) : undefined;
  return {
    node: source?.node,
    imageURL: output
      ? storyboardFrameImageURL(output, source?.mediaIndex || 1)
      : "",
  };
}

export function storyboardFrameImageURL(output: unknown, mediaIndex: number) {
  const row =
    output && typeof output === "object" && !Array.isArray(output)
      ? (output as Record<string, unknown>)
      : undefined;
  const meta =
    row?.meta && typeof row.meta === "object" && !Array.isArray(row.meta)
      ? (row.meta as Record<string, unknown>)
      : undefined;
  const items = Array.isArray(meta?.items) ? meta.items : [];
  const plannedItem = items.find((candidate) => {
    if (
      !candidate ||
      typeof candidate !== "object" ||
      Array.isArray(candidate)
    ) {
      return false;
    }
    return Number((candidate as Record<string, unknown>).order) === mediaIndex;
  }) as Record<string, unknown> | undefined;
  const plannedImage = String(plannedItem?.image || "").trim();
  return (
    plannedImage ||
    contentOutputMediaURLs(output, "image")[mediaIndex - 1] ||
    ""
  );
}

/** 当前选定版本决定帧内容；目标未载入时只读取本次节点结果。 */
export function storyboardNodeMediaOutput(node: SpaceCanvasNode) {
  const assetId = node.resultRef?.asset_id ?? node.asset?.id;
  const versionId =
    node.resultRef?.version_id ??
    node.asset?.version?.id ??
    node.asset?.version_id;
  const cachedVersions = [node.asset?.version, ...(node.asset?.versions || [])];
  const currentVersion = cachedVersions.find(
    (version) =>
      version && version.id === versionId && version.asset_id === assetId,
  );
  if (currentVersion)
    return resolveNodeDetailMediaOutput(node, currentVersion, {
      includeNodeResult: false,
    });
  return resolveNodeDetailMediaOutput({
    ...node,
    asset: undefined,
    result: undefined,
    resultOutput: node.resultOutput,
  });
}
