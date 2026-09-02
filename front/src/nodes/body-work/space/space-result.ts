import type {
  CanvasResultRef,
  CanvasResultSourceRef,
  SpaceCanvasNode,
} from "./types";
import type { CanvasNodeResultRef } from "./space-runner";

export type NodeResultSourceContext = {
  nodeId: string;
  type: SpaceCanvasNode["type"];
  resultRef?: CanvasResultRef;
};

type CanvasAssetVersionNode = {
  asset?: {
    id?: number;
    version_id?: number;
    version?: { id?: number };
  };
  resultRef?: {
    execution_id?: number;
    run_id?: number;
    request_id?: string;
    node_run_id?: number;
    asset_id?: number;
    version_id?: number;
  };
};

type CanvasRunIdentity = {
  execution_id?: number;
  run_id?: number;
  request_id?: string;
};

export function buildNodeResultRef(result: any): CanvasResultRef | undefined {
  const asset = result?.asset || result?.data?.asset;
  const version = result?.version || asset?.version || result?.data?.version;
  const ref: CanvasResultRef = {};
  assignResultRefNumber(ref, "execution_id", result?.execution_id);
  assignResultRefNumber(ref, "run_id", result?.run_id || version?.run_id);
  assignResultRefText(ref, "request_id", result?.request_id);
  assignResultRefNumber(ref, "flow_run_id", result?.flow_run_id);
  assignResultRefNumber(
    ref,
    "node_run_id",
    result?.node_run_id || version?.node_run_id,
  );
  assignResultRefNumber(ref, "asset_id", result?.asset_id || asset?.id);
  assignResultRefNumber(
    ref,
    "version_id",
    result?.version_id || version?.id || asset?.version_id,
  );
  assignResultRefNumber(
    ref,
    "release_id",
    result?.release_id || version?.release_id,
  );
  assignResultRefText(ref, "role", result?.role || asset?.role);
  assignResultRefText(ref, "status", result?.status);
  if (Object.keys(ref).length > 0) {
    ref.updated_at = new Date().toISOString();
  }
  return Object.keys(ref).length > 0 ? ref : undefined;
}

export function canvasNodeCoversRunResult(
  node: CanvasAssetVersionNode | undefined,
  run: CanvasRunIdentity,
  result?: CanvasNodeResultRef,
) {
  const resultRef = node?.resultRef;
  if (resultRef) {
    const executionId = Number(run.execution_id || 0);
    const currentExecutionId = Number(resultRef.execution_id || 0);
    if (
      executionId > 0 &&
      currentExecutionId > 0 &&
      currentExecutionId >= executionId
    ) {
      return true;
    }
    const runId = Number(run.run_id || 0);
    const currentRunId = Number(resultRef.run_id || 0);
    if (runId > 0 && currentRunId > 0 && currentRunId >= runId) {
      return true;
    }
    const nodeRunId = Number(result?.node_run_id || 0);
    const currentNodeRunId = Number(resultRef.node_run_id || 0);
    if (
      nodeRunId > 0 &&
      currentNodeRunId > 0 &&
      currentNodeRunId >= nodeRunId
    ) {
      return true;
    }
    const requestId = String(result?.request_id || run.request_id || "");
    if (requestId && resultRef.request_id === requestId) {
      return true;
    }
  }
  return canvasRunResultReplacedByCurrentAsset(node, result);
}

function canvasRunResultReplacedByCurrentAsset(
  node: CanvasAssetVersionNode | undefined,
  result?: CanvasNodeResultRef,
) {
  if (
    String(result?.status || "")
      .trim()
      .toLowerCase() !== "success"
  ) {
    return false;
  }
  const currentAssetId = Number(
    node?.asset?.id || node?.resultRef?.asset_id || 0,
  );
  const currentVersionId = Number(
    node?.asset?.version_id ||
      node?.asset?.version?.id ||
      node?.resultRef?.version_id ||
      0,
  );
  const resultAssetId = Number(result?.asset_id || 0);
  const resultVersionId = Number(result?.version_id || 0);
  return (
    currentAssetId > 0 &&
    currentAssetId === resultAssetId &&
    currentVersionId > 0 &&
    resultVersionId > 0 &&
    currentVersionId !== resultVersionId
  );
}

export function canvasResultSourceFromNode(
  source: NodeResultSourceContext | null | undefined,
): CanvasResultSourceRef | null {
  const ref = source?.resultRef;
  if (!source || !ref) {
    return null;
  }
  const sourceAssetId = Number(ref.asset_id || 0);
  const sourceNodeKey = String(ref.node_run_id ? source.nodeId : "").trim();
  return {
    sourceRunId: Number(ref.run_id || 0),
    sourceNodeRunId: Number(ref.node_run_id || 0),
    sourceAssetId,
    sourceVersionId: Number(ref.version_id || 0),
    sourceReleaseId: Number(ref.release_id || 0),
    sourceRequestId: String(ref.request_id || ""),
    sourceNodeKey,
    sourceNodeType: String(source.type || ""),
    sourceStatus: String(ref.status || ""),
    sourceKey:
      sourceNodeKey ||
      (sourceAssetId > 0 ? `asset:${sourceAssetId}` : "") ||
      "",
  };
}

function assignResultRefNumber(
  target: Record<string, unknown>,
  key: string,
  value: unknown,
) {
  const number = Number(value || 0);
  if (number > 0) {
    target[key] = number;
  }
}

function assignResultRefText(
  target: Record<string, unknown>,
  key: string,
  value: unknown,
) {
  if (typeof value === "string" && value.trim()) {
    target[key] = value.trim();
  }
}
