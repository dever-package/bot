import type { SpaceCanvasNode } from "./types";
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
  const scriptedGroupSourceIds = new Map<string, string>();
  for (const node of nodes) {
    if (node.type === "group" && node.group?.origin === "script") {
      scriptedGroupSourceIds.set(node.id, node.group.sourceNodeId || "");
    }
  }

  const sourceNodeIdByNodeId = new Map<string, string>();
  for (const node of nodes) {
    let sourceNodeId = "";
    if (node.storyboardItem?.sourceNodeId) {
      sourceNodeId = node.storyboardItem.sourceNodeId;
    } else if (node.type === "group" && node.group?.origin === "script") {
      sourceNodeId = node.group.sourceNodeId || "";
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
  const scriptedGroupSourceIdByGroupId = new Map<string, string>();
  for (const node of nodes) {
    if (
      node.type === "group" &&
      node.group?.origin === "script" &&
      node.group.sourceNodeId
    ) {
      scriptedGroupSourceIdByGroupId.set(node.id, node.group.sourceNodeId);
    }
  }
  const membersBySourceNodeId = new Map<string, SpaceCanvasNode[]>();
  const groupsBySourceNodeId = new Map<string, SpaceCanvasNode[]>();
  const workNodesBySourceNodeId = new Map<string, SpaceCanvasNode[]>();
  for (const node of nodes) {
    const sourceNodeIds = new Set<string>();
    if (storyboardNodeIds.has(node.id)) {
      sourceNodeIds.add(node.id);
    }
    if (node.group?.sourceNodeId) {
      sourceNodeIds.add(node.group.sourceNodeId);
    }
    if (node.storyboardItem?.sourceNodeId) {
      sourceNodeIds.add(node.storyboardItem.sourceNodeId);
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
    if (
      node.type === "group" &&
      node.group?.origin === "script" &&
      node.group.sourceNodeId
    ) {
      appendStoryboardFrameNode(
        groupsBySourceNodeId,
        node.group.sourceNodeId,
        node,
      );
    }
    if (node.storyboardItem?.sourceNodeId && !node.storyboardItem.optional) {
      appendStoryboardFrameNode(
        workNodesBySourceNodeId,
        node.storyboardItem.sourceNodeId,
        node,
      );
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
      completedCount: workNodes.filter(
        (node) => !node.storyboardItem?.stale && hasResult(node),
      ).length,
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
  hasResult: (node: SpaceCanvasNode) => boolean,
  nodesByID = new Map(nodes.map((node) => [node.id, node])),
) {
  const workNodes = scope.workNodeIds
    .map((nodeId) => nodesByID.get(nodeId))
    .filter((node): node is SpaceCanvasNode => Boolean(node));
  const pendingNodeIDs = new Set(
    workNodes
      .filter((node) => node.storyboardItem?.stale || !hasResult(node))
      .map((node) => node.id),
  );

  const dependentsByNodeID = new Map<string, SpaceCanvasNode[]>();
  for (const node of workNodes) {
    if (node.storyboardItem?.itemType === "video_compose") {
      continue;
    }
    for (const dependencyNodeID of storyboardDependencyNodeIds(node)) {
      const dependents = dependentsByNodeID.get(dependencyNodeID);
      if (dependents) {
        dependents.push(node);
      } else {
        dependentsByNodeID.set(dependencyNodeID, [node]);
      }
    }
  }
  const pendingQueue = [...pendingNodeIDs];
  for (let index = 0; index < pendingQueue.length; index += 1) {
    for (const dependent of dependentsByNodeID.get(pendingQueue[index]) || []) {
      if (pendingNodeIDs.has(dependent.id)) {
        continue;
      }
      pendingNodeIDs.add(dependent.id);
      pendingQueue.push(dependent.id);
    }
  }

  const composition = workNodes.find(
    (node) => node.storyboardItem?.itemType === "video_compose",
  );
  if (pendingNodeIDs.size > 0 && composition) {
    pendingNodeIDs.add(composition.id);
  }
  const pendingNodes = workNodes.filter((node) => pendingNodeIDs.has(node.id));
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

export function markStoryboardFrameResultsCurrent(
  nodes: SpaceCanvasNode[],
  sourceNodeId: string,
  successfulNodeIds: ReadonlySet<string>,
) {
  let changed = false;
  const next = nodes.map((node) => {
    const item = node.storyboardItem;
    if (
      !item ||
      item.sourceNodeId !== sourceNodeId ||
      !successfulNodeIds.has(node.id)
    ) {
      return node;
    }
    const resultSourceSignature =
      item.sourceSignature || item.resultSourceSignature;
    if (!item.stale && item.resultSourceSignature === resultSourceSignature) {
      return node;
    }
    changed = true;
    return {
      ...node,
      storyboardItem: {
        ...item,
        resultSourceSignature,
        stale: false,
      },
    };
  });
  return changed ? next : nodes;
}

export function storyboardFrameId(sourceNodeId: string) {
  return `storyboard-frame:${sourceNodeId}`;
}

function storyboardDependencyNodeIds(node: SpaceCanvasNode) {
  return [
    ...(node.storyboardItem?.dependencyNodeIds || []),
    ...(node.storyboardItem?.referenceNodeIds || []),
  ];
}

function storyboardSourceNodeIds(nodes: SpaceCanvasNode[]) {
  const sourceNodeIds = new Set<string>();
  for (const node of nodes) {
    if (node.storyboardMaterializedSignature) {
      sourceNodeIds.add(node.id);
    }
    if (node.group?.origin === "script" && node.group.sourceNodeId) {
      sourceNodeIds.add(node.group.sourceNodeId);
    }
    if (node.storyboardItem?.sourceNodeId) {
      sourceNodeIds.add(node.storyboardItem.sourceNodeId);
    }
  }
  return sourceNodeIds;
}
