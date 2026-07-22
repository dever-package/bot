import { AlertCircle, Loader2 } from "lucide-react";
import { useCanvasNodeRunError } from "../space-run-error";
import type { SpaceCanvasNode } from "../types";

export function NodeDetailRunError({
  projectId,
  node,
}: {
  projectId: number;
  node: SpaceCanvasNode;
}) {
  const fallback = String(node.runError || "").trim();
  const { error, loading } = useCanvasNodeRunError(projectId, node);

  if (!fallback) {
    return null;
  }

  return (
    <div className="wb-detail-error-banner is-run-error" role="alert">
      <AlertCircle size={17} />
      <div>
        <strong>最近一次运行失败</strong>
        <p>{error || fallback}</p>
        {loading ? (
          <small>
            <Loader2 size={12} className="wb-detail-spin" />
            正在读取完整原因
          </small>
        ) : null}
      </div>
    </div>
  );
}
