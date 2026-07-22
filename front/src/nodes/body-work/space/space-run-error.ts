import { useEffect, useState } from "react";
import { fetchSpaceCanvasExecution } from "./space-api";
import {
  canvasExecutionErrorMessage,
  canvasNodeResultRawError,
  canvasRunRawError,
  isGenericCanvasErrorMessage,
  normalizeCanvasRunRef,
} from "./space-runner";
import type { SpaceCanvasNode } from "./types";

const canvasRunErrorCache = new Map<string, Promise<string>>();
const canvasRunErrorCacheLimit = 100;

export function useCanvasNodeRunError(
  projectId: number,
  node: SpaceCanvasNode,
) {
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
    if (
      !fallback ||
      !referenceKey ||
      !isGenericCanvasErrorMessage(fallback)
    ) {
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
      cacheKey: referenceKey,
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
  cacheKey,
  fallback,
}: {
  projectId: number;
  nodeId: string;
  executionId: number;
  requestId: string;
  runId: number;
  cacheKey: string;
  fallback: string;
}) {
  const cached = canvasRunErrorCache.get(cacheKey);
  if (cached) {
    return cached;
  }
  const request = fetchSpaceCanvasExecution({
    projectId,
    executionId,
    requestId,
    runId,
  }).then((raw) => {
    const run = normalizeCanvasRunRef(raw);
    const nodeResult = [...(run.node_results || [])]
      .reverse()
      .find((result) => result.node_key === nodeId);
    const rawError =
      canvasNodeResultRawError(nodeResult) || canvasRunRawError(run);
    return canvasExecutionErrorMessage(rawError, fallback);
  });
  canvasRunErrorCache.set(cacheKey, request);
  trimCanvasRunErrorCache();
  void request.catch(() => canvasRunErrorCache.delete(cacheKey));
  return request;
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

function trimCanvasRunErrorCache() {
  while (canvasRunErrorCache.size > canvasRunErrorCacheLimit) {
    const oldestKey = canvasRunErrorCache.keys().next().value;
    if (!oldestKey) {
      return;
    }
    canvasRunErrorCache.delete(oldestKey);
  }
}
