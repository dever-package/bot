import { canvasNodeRunsInBackend } from "./space-execution-plan";
import type { SpaceCanvasNode } from "./types";

export type CanvasGroupRunStatus = "idle" | "running" | "waiting" | "error";

export type CanvasGroupRuntimeSummary = {
  memberCount: number;
  runnableCount: number;
  completedCount: number;
  failedCount: number;
  status: CanvasGroupRunStatus;
};

type CanvasNodeRunState = {
  status: "running" | "waiting" | "success" | "error";
};

export function canvasGroupRunTargetNodeIds({
  members,
  hasResult,
}: {
  members: SpaceCanvasNode[];
  hasResult: (node: SpaceCanvasNode) => boolean;
}) {
  const runnableMembers = members.filter(canvasNodeRunsInBackend);
  const pendingMembers = runnableMembers.filter(
    (member) => !hasResult(member),
  );
  return (pendingMembers.length > 0 ? pendingMembers : runnableMembers).map(
    (member) => member.id,
  );
}

export function storyboardRunBlockedReason({
  targets,
  nodesByID,
  hasResult,
}: {
  targets: SpaceCanvasNode[];
  nodesByID: Map<string, SpaceCanvasNode>;
  hasResult: (node: SpaceCanvasNode) => boolean;
}) {
  const scheduledNodeIDs = new Set(targets.map((node) => node.id));
  for (const target of targets) {
    const metadata = target.storyboardItem;
    if (!metadata) {
      continue;
    }
    const sourceNodeIDs = new Set([
      ...(metadata.dependencyNodeIds || []),
      ...(metadata.referenceNodeIds || []),
    ]);
    for (const sourceNodeID of sourceNodeIDs) {
      if (scheduledNodeIDs.has(sourceNodeID)) {
        continue;
      }
      const sourceNode = nodesByID.get(sourceNodeID);
      if (!sourceNode) {
        return "前置素材节点不存在，请重新同步分镜脚本";
      }
      const sourceTitle = sourceNode.title || "未命名素材";
      if (hasResult(sourceNode)) {
        continue;
      }
      return `请先生成前置素材“${sourceTitle}”`;
    }
  }
  return "";
}

export function summarizeCanvasGroupRuntime({
  members,
  runningNodes,
  groupState,
  hasResult,
}: {
  members: SpaceCanvasNode[];
  runningNodes: Record<string, CanvasNodeRunState | undefined>;
  groupState?: CanvasNodeRunState | null;
  hasResult: (node: SpaceCanvasNode) => boolean;
}): CanvasGroupRuntimeSummary {
  const runnableMembers = members.filter(canvasNodeRunsInBackend);
  const memberStates = runnableMembers
    .map((member) => runningNodes[member.id])
    .filter((state): state is CanvasNodeRunState => Boolean(state));
  const groupActive =
    groupState?.status === "running" || groupState?.status === "waiting";
  const completedCount =
    groupActive
      ? runnableMembers.filter((member) => {
          const state = runningNodes[member.id];
          return state?.status === "success" || (!state && hasResult(member));
        }).length
      : runnableMembers.filter((member) => {
          const state = runningNodes[member.id];
          if (state?.status === "success") {
            return true;
          }
          if (state) {
            return false;
          }
          return hasResult(member);
        }).length;
  const failedCount = memberStates.filter(
    (state) => state.status === "error",
  ).length;

  return {
    memberCount: members.length,
    runnableCount: runnableMembers.length,
    completedCount,
    failedCount,
    status: canvasGroupRunStatus(groupState, memberStates, failedCount),
  };
}

function canvasGroupRunStatus(
  groupState: CanvasNodeRunState | null | undefined,
  memberStates: CanvasNodeRunState[],
  failedCount: number,
): CanvasGroupRunStatus {
  if (memberStates.some((state) => state.status === "running")) {
    return "running";
  }
  if (
    groupState?.status === "waiting" ||
    memberStates.some((state) => state.status === "waiting")
  ) {
    return "waiting";
  }
  if (groupState?.status === "error" || failedCount > 0) {
    return "error";
  }
  if (groupState?.status === "running") {
    return "running";
  }
  return "idle";
}
