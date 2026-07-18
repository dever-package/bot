import { canvasNodeRunsInBackend } from "./space-execution-plan";
import type { SpaceCanvasNode } from "./types";

export type CanvasGroupRunStatus = "idle" | "running" | "waiting" | "error";

type CanvasNodeRunState = {
  status: "running" | "waiting" | "success" | "error";
};

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
