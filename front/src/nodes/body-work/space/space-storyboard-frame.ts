import type { SpaceCanvasEdge, SpaceCanvasNode } from "./types";
import { canvasNodeRunsInBackend } from "./space-execution-plan";
import { storyboardRunBlockedReason } from "./space-group-runtime";

export type StoryboardFrameScope = {
  id: string;
  sourceNodeId: string;
  memberNodeIds: string[];
  title: string;
  workNodeIds: string[];
  groupCount: number;
  workNodeCount: number;
  completedCount: number;
};

export type StoryboardFrameIndex = {
  frames: StoryboardFrameScope[];
  sourceNodeIds: Set<string>;
  sourceNodeIdByNodeId: Map<string, string>;
};

export function buildStoryboardFrameIndex(
  nodes: SpaceCanvasNode[],
  hasResult: (node: SpaceCanvasNode) => boolean,
): StoryboardFrameIndex {
  const sourceNodeIds = storyboardSourceNodeIds(nodes);
  return {
    frames: storyboardFrameScopes(nodes, hasResult, sourceNodeIds),
    sourceNodeIds,
    sourceNodeIdByNodeId: storyboardSourceNodeIdIndex(nodes, sourceNodeIds),
  };
}

export function storyboardStructureLockedNodeIds(nodes: SpaceCanvasNode[]) {
  return storyboardSourceNodeIds(nodes);
}

export function storyboardSourceNodeIdForNode(
  nodes: SpaceCanvasNode[],
  node: SpaceCanvasNode,
) {
  return storyboardSourceNodeIdIndex(nodes).get(node.id) || "";
}

export function storyboardSourceNodeIdIndex(
  nodes: SpaceCanvasNode[],
  sourceNodeIds = storyboardSourceNodeIds(nodes),
) {
  const scriptedGroupSourceIds = scriptGroupOwnerIds(nodes);

  const sourceNodeIdByNodeId = new Map<string, string>();
  for (const node of nodes) {
    let sourceNodeId = "";
    if (node.storyboardItem?.sourceNodeId) {
      sourceNodeId = itemOwnerId(node, scriptedGroupSourceIds);
    } else if (node.type === "group" && node.group?.origin === "script") {
      sourceNodeId = scriptedGroupSourceIds.get(node.id) || "";
    } else if (sourceNodeIds.has(node.id)) {
      sourceNodeId = node.id;
    } else if (node.groupId) {
      sourceNodeId = scriptedGroupSourceIds.get(node.groupId) || "";
    }
    if (sourceNodeId) {
      sourceNodeIdByNodeId.set(node.id, sourceNodeId);
    }
  }
  return sourceNodeIdByNodeId;
}

export function storyboardFrameScopes(
  nodes: SpaceCanvasNode[],
  hasResult: (node: SpaceCanvasNode) => boolean,
  storyboardNodeIds = storyboardSourceNodeIds(nodes),
) {
  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const scriptedGroupSourceIdByGroupId = scriptGroupOwnerIds(nodes);
  const membersBySourceNodeId = new Map<string, SpaceCanvasNode[]>();
  const groupsBySourceNodeId = new Map<string, SpaceCanvasNode[]>();
  const workNodesBySourceNodeId = new Map<string, SpaceCanvasNode[]>();
  for (const node of nodes) {
    const sourceNodeIds = new Set<string>();
    if (storyboardNodeIds.has(node.id)) {
      sourceNodeIds.add(node.id);
    }
    const groupOwnerId = scriptedGroupSourceIdByGroupId.get(node.id);
    if (groupOwnerId) {
      sourceNodeIds.add(groupOwnerId);
    }
    const itemOwner = node.storyboardItem?.sourceNodeId
      ? itemOwnerId(node, scriptedGroupSourceIdByGroupId)
      : "";
    if (itemOwner) {
      sourceNodeIds.add(itemOwner);
    }
    if (node.groupId) {
      const sourceNodeId = scriptedGroupSourceIdByGroupId.get(node.groupId);
      if (sourceNodeId) {
        sourceNodeIds.add(sourceNodeId);
      }
    }
    for (const sourceNodeId of sourceNodeIds) {
      appendStoryboardFrameNode(membersBySourceNodeId, sourceNodeId, node);
    }
    if (groupOwnerId) {
      appendStoryboardFrameNode(groupsBySourceNodeId, groupOwnerId, node);
    }
    if (itemOwner && !node.storyboardItem?.optional) {
      appendStoryboardFrameNode(workNodesBySourceNodeId, itemOwner, node);
    }
  }

  const scopes: StoryboardFrameScope[] = [];
  for (const sourceNodeId of storyboardNodeIds) {
    const sourceNode = nodeById.get(sourceNodeId);
    if (!sourceNode) {
      continue;
    }
    const members = membersBySourceNodeId.get(sourceNodeId) || [];
    if (members.length <= 1) {
      continue;
    }
    const groups = groupsBySourceNodeId.get(sourceNodeId) || [];
    const workNodes = workNodesBySourceNodeId.get(sourceNodeId) || [];
    scopes.push({
      id: storyboardFrameId(sourceNodeId),
      sourceNodeId,
      title: sourceNode.title || "分镜脚本",
      memberNodeIds: members.map((node) => node.id),
      workNodeIds: workNodes.map((node) => node.id),
      groupCount: groups.length,
      workNodeCount: workNodes.length,
      completedCount: workNodes.filter(hasResult).length,
    });
  }
  return scopes;
}

function appendStoryboardFrameNode(
  index: Map<string, SpaceCanvasNode[]>,
  sourceNodeId: string,
  node: SpaceCanvasNode,
) {
  const entries = index.get(sourceNodeId);
  if (entries) {
    entries.push(node);
  } else {
    index.set(sourceNodeId, [node]);
  }
}

export function storyboardFrameRunSummary(
  scope: StoryboardFrameScope,
  nodes: SpaceCanvasNode[],
  edges: SpaceCanvasEdge[],
  hasResult: (node: SpaceCanvasNode) => boolean,
  nodesByID = new Map(nodes.map((node) => [node.id, node])),
) {
  const workNodes = scope.workNodeIds
    .map((nodeId) => nodesByID.get(nodeId))
    .filter((node): node is SpaceCanvasNode => Boolean(node));
  const chapter = workNodes.find((node) => node.storyboardItem?.itemType === "video_compose");
  if (chapter) {
    const edgeById = new Map(edges.map((edge) => [edge.id, edge]));
    for (const node of nodes) {
      if (node.outputType !== "video_compose" || node.storyboardItem || hasResult(node)) continue;
      const sources = (node.composerDraft?.videoComposition?.clips || []).map((clip) => {
        const edge = edgeById.get(clip.sourceEdgeId || "");
        return edge && (edge.logicalTo || edge.to) === node.id
          ? nodesByID.get(edge.logicalFrom || edge.from) : undefined;
      });
      if (sources.includes(chapter) && sources.every((source) => source && (source === chapter || hasResult(source)))) {
        workNodes.push(node);
      }
    }
  }
  const pendingNodes = workNodes.filter((node) => !hasResult(node));
  const scheduled = new Set(pendingNodes.map((node) => node.id));
  for (const target of [...pendingNodes]) {
    for (const id of [
      ...(target.storyboardItem?.referenceNodeIds || []),
      ...(target.storyboardItem?.dependencyNodeIds || []),
    ]) {
      const source = nodesByID.get(id);
      const group = source?.groupId && nodesByID.get(source.groupId);
      if (source && group && nodesByID.get(source.storyboardItem?.sourceNodeId || "")?.outputType === "setting" &&
          !hasResult(source) && !scheduled.has(id)) {
        scheduled.add(id);
        pendingNodes.push(source);
      }
    }
  }
  if (pendingNodes.length === 0) {
    return { pendingNodeIds: [] as string[], blockedReason: "制作区已完成" };
  }
  const unavailable = pendingNodes.find(
    (node) => !canvasNodeRunsInBackend(node),
  );
  if (unavailable) {
    return {
      pendingNodeIds: pendingNodes.map((node) => node.id),
      blockedReason: `“${unavailable.title || "未命名节点"}”未配置可用能力`,
    };
  }
  return {
    pendingNodeIds: pendingNodes.map((node) => node.id),
    blockedReason: storyboardRunBlockedReason({
      targets: pendingNodes,
      nodesByID,
      hasResult,
    }),
  };
}

export function storyboardFrameId(sourceNodeId: string) {
  return `storyboard-frame:${sourceNodeId}`;
}

function storyboardSourceNodeIds(nodes: SpaceCanvasNode[]) {
  const groupOwnerIds = scriptGroupOwnerIds(nodes);
  const sourceNodeIds = new Set<string>(groupOwnerIds.values());
  for (const node of nodes) {
    if (node.storyboardMaterializedSignature) {
      sourceNodeIds.add(node.id);
    }
    if (node.storyboardItem?.sourceNodeId) {
      sourceNodeIds.add(itemOwnerId(node, groupOwnerIds));
    }
  }
  return sourceNodeIds;
}

// 分镜的派生分组归分镜节点所有并收进它的制作区；故事的设定组是画布上独立可见的
// 节点，自己拥有成员。
function scriptGroupOwnerIds(nodes: SpaceCanvasNode[]) {
  const owners = new Map<string, string>();
  for (const node of nodes) {
    if (
      node.type !== "group" ||
      node.group?.origin !== "script" ||
      !node.group.sourceNodeId
    ) {
      continue;
    }
    owners.set(
      node.id,
      node.group.sourceNodeId,
    );
  }
  return owners;
}

function itemOwnerId(
  node: SpaceCanvasNode,
  groupOwnerIds: ReadonlyMap<string, string>,
) {
  const sourceNodeId = node.storyboardItem?.sourceNodeId || "";
  const groupOwnerId = groupOwnerIds.get(node.groupId || "");
  return groupOwnerId && groupOwnerId === node.groupId
    ? groupOwnerId
    : sourceNodeId;
}
