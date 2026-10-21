import { contentOutputMediaURLs } from "../shared/content-output";
import type { StoryboardDocument, StoryboardShot } from "./space-storyboard";
import type { SpaceCanvasNode } from "./types";
import { resolveNodeDetailMediaOutput } from "./node-detail/node-detail-content";
import {
  normalizeStoryboardFrameMediaItems,
  parseStoryboardShotImageMode,
  storyboardFrameRole,
  storyboardShotImagePlan,
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
  const nodesByShotId = new Map<
    string,
    Partial<Record<StoryboardFrameRole, StoryboardFrameSource>> & {
      referenceNode?: SpaceCanvasNode;
    }
  >();
  for (const node of canvasNodes) {
    const item = node.storyboardItem;
    if (
      item?.sourceNodeId === sourceNodeId &&
      item.itemType === "shot_image" &&
      item.shotId
    ) {
      const frames = nodesByShotId.get(item.shotId) || {};
      if (parseStoryboardShotImageMode(item.shotImageMode) === "references") {
        frames.referenceNode = node;
        nodesByShotId.set(item.shotId, frames);
        continue;
      }
      const frameMediaItems = normalizeStoryboardFrameMediaItems(
        item.frameMediaItems,
      );
      if (frameMediaItems.length) {
        for (const frame of frameMediaItems) {
          frames[frame.frameRole] = {
            node,
            mediaIndex: frame.mediaIndex,
          };
        }
      } else {
        frames[storyboardFrameRole(item.frameRole)] = {
          node,
          mediaIndex: 1,
        };
      }
      nodesByShotId.set(item.shotId, frames);
    }
  }
  return storyboard.shots.map((shot) => {
    const nodes = nodesByShotId.get(shot.id);
    const imagePlan = storyboardShotImagePlan(shot);
    if (imagePlan.nodeMode === "references") {
      return {
        shot,
        start: storyboardFrameMedia(),
        references: storyboardReferenceMedia(nodes?.referenceNode),
      };
    }
    if (imagePlan.nodeMode === "last_frame") {
      return {
        shot,
        start: storyboardFrameMedia(nodes?.end),
      };
    }
    if (imagePlan.nodeMode === "none") {
      return {
        shot,
        start: storyboardFrameMedia(),
      };
    }
    return {
      shot,
      start: storyboardFrameMedia(nodes?.start),
      ...(nodes?.end ? { end: storyboardFrameMedia(nodes.end) } : {}),
    };
  });
}

function storyboardReferenceMedia(
  node?: SpaceCanvasNode,
): StoryboardFrameMedia[] {
  const output = node ? storyboardNodeMediaOutput(node) : undefined;
  const imageURLs = output ? contentOutputMediaURLs(output, "image") : [];
  return imageURLs.slice(0, 4).map((imageURL) => ({ node, imageURL }));
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
