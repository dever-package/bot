import { useEffect, useState } from "react";
import { joinSiteApi, useAuthStore } from "@dever/front-plugin";
import { useAuthUserScopeKey } from "../shared/auth-scope";
import { createInFlightRequestLoader } from "../shared/in-flight-request";
import { fetchSpaceCanvasExecution } from "./space-api";
import {
  canvasExecutionErrorMessage,
  canvasNodeResultRawError,
  canvasRunRawError,
  isGenericCanvasErrorMessage,
  normalizeCanvasRunRef,
} from "./space-runner";
import type { SpaceCanvasNode } from "./types";

const loadCanvasRunErrorRequest =
  createInFlightRequestLoader<ReturnType<typeof normalizeCanvasRunRef>>();

export function useCanvasNodeRunError(
  projectId: number,
  node: SpaceCanvasNode,
) {
  const userScopeKey = useAuthUserScopeKey();
  const accessToken = useAuthStore(
    (state: any) => state.auth?.accessToken || "",
  );
  const requestScopeKey = JSON.stringify([
    joinSiteApi("workspace/canvas_execution"),
    userScopeKey,
    accessToken,
  ]);
  const fallback = String(node.runError || "").trim();
  const nodeId = node.id;
  const executionId = Number(node.resultRef?.execution_id || 0);
  const requestId = String(node.resultRef?.request_id || "").trim();
  const runId = Number(node.resultRef?.run_id || 0);
  const referenceKey = canvasRunErrorReferenceKey(
    projectId,
    nodeId,
    executionId,
    requestId,
    runId,
  );
  const [error, setError] = useState(fallback);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError(fallback);
    if (!fallback || !referenceKey || !isGenericCanvasErrorMessage(fallback)) {
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);
    void loadCanvasNodeRunError({
      projectId,
      nodeId,
      executionId,
      requestId,
      runId,
      requestScopeKey,
      fallback,
    })
      .then((message) => {
        if (active && message) {
          setError(message);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [
    executionId,
    fallback,
    nodeId,
    projectId,
    referenceKey,
    requestScopeKey,
    requestId,
    runId,
  ]);

  return { error: error || fallback, loading };
}

function loadCanvasNodeRunError({
  projectId,
  nodeId,
  executionId,
  requestId,
  runId,
  requestScopeKey,
  fallback,
}: {
  projectId: number;
  nodeId: string;
  executionId: number;
  requestId: string;
  runId: number;
  requestScopeKey: string;
  fallback: string;
}) {
  const cacheKey = JSON.stringify([
    requestScopeKey,
    canvasRunErrorReferenceKey(projectId, "", executionId, requestId, runId),
  ]);
  // 只合并进行中请求；活动快照及失败都允许下一次重新读取。
  const request = loadCanvasRunErrorRequest(cacheKey, () =>
    fetchSpaceCanvasExecution({
      projectId,
      executionId,
      requestId,
      runId,
    }).then(normalizeCanvasRunRef),
  );
  return request.then((run) => {
    const nodeResult = [...(run.node_results || [])]
      .reverse()
      .find((result) => result.node_key === nodeId);
    const rawError =
      canvasNodeResultRawError(nodeResult) || canvasRunRawError(run);
    return canvasExecutionErrorMessage(rawError, fallback);
  });
}

function canvasRunErrorReferenceKey(
  projectId: number,
  nodeId: string,
  executionId: number,
  requestId: string,
  runId: number,
) {
  const reference = executionId
    ? `execution:${executionId}`
    : requestId
      ? `request:${requestId}`
      : runId
        ? `run:${runId}`
        : "";
  return projectId > 0 && reference
    ? `${projectId}:${reference}:${nodeId}`
    : "";
}
