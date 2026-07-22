import { canvasNodeRunsInBackend } from "./space-execution-plan";
import type { SpaceCanvasNode } from "./types";

export type CanvasGroupRunStatus = "idle" | "running" | "waiting" | "error";

type CanvasNodeRunState = {
  status: "running" | "waiting" | "success" | "error";
};

type CanvasNodeRunner = (node: SpaceCanvasNode) => Promise<void>;

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
      if (sourceNode.storyboardItem?.stale) {
        return `请先更新前置素材“${sourceTitle}”`;
      }
      if (!hasResult(sourceNode)) {
        return `请先生成前置素材“${sourceTitle}”`;
      }
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
}) {
  const runnableMembers = members.filter(canvasNodeRunsInBackend);
  const staleCount = runnableMembers.filter(
    (member) => member.storyboardItem?.stale,
  ).length;
  const memberStates = runnableMembers
    .map((member) => runningNodes[member.id])
    .filter((state): state is CanvasNodeRunState => Boolean(state));
  const groupActive =
    groupState?.status === "running" || groupState?.status === "waiting";
  const completedCount =
    groupActive || memberStates.length > 0
      ? memberStates.filter((state) => state.status === "success").length
      : runnableMembers.filter(
          (member) => !member.storyboardItem?.stale && hasResult(member),
        ).length;
  const failedCount = memberStates.filter(
    (state) => state.status === "error",
  ).length;

  return {
    memberCount: members.length,
    runnableCount: runnableMembers.length,
    completedCount,
    failedCount,
    staleCount,
    status: canvasGroupRunStatus(groupState, memberStates, failedCount),
  };
}

export async function runCanvasGroupMembers(
  members: SpaceCanvasNode[],
  runNode: CanvasNodeRunner,
) {
  const pending = new Map(
    members
      .filter(canvasNodeRunsInBackend)
      .map((member) => [member.id, member]),
  );
  const completed = new Set<string>();
  const failures = new Map<string, unknown>();

  while (pending.size > 0) {
    blockFailedDependents(pending, failures);
    if (pending.size === 0) {
      break;
    }

    const ready = [...pending.values()].filter((member) =>
      storyboardDependencies(member).every(
        (sourceID) => !pending.has(sourceID) || completed.has(sourceID),
      ),
    );
    if (ready.length === 0) {
      for (const member of pending.values()) {
        failures.set(member.id, new Error("节点依赖关系存在循环"));
      }
      pending.clear();
      break;
    }

    const results = await Promise.allSettled(
      ready.map(async (member) => {
        await runNode(member);
        return member.id;
      }),
    );
    results.forEach((result, index) => {
      const member = ready[index];
      pending.delete(member.id);
      if (result.status === "fulfilled") {
        completed.add(member.id);
        return;
      }
      failures.set(member.id, result.reason);
    });
  }

  if (failures.size > 0) {
    const firstError = failures.values().next().value;
    const message =
      firstError instanceof Error ? firstError.message : "节点更新失败";
    throw new Error(`${failures.size} 个节点更新失败：${message}`);
  }
}

function blockFailedDependents(
  pending: Map<string, SpaceCanvasNode>,
  failures: Map<string, unknown>,
) {
  let changed = true;
  while (changed) {
    changed = false;
    for (const member of pending.values()) {
      const failedSourceID = storyboardDependencies(member).find((sourceID) =>
        failures.has(sourceID),
      );
      if (!failedSourceID) {
        continue;
      }
      pending.delete(member.id);
      failures.set(member.id, new Error("上游节点更新失败"));
      changed = true;
    }
  }
}

function storyboardDependencies(node: SpaceCanvasNode) {
  return node.storyboardItem?.dependencyNodeIds || [];
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
