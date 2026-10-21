import { AlertCircle, Loader2 } from "lucide-react";
import { useCanvasNodeRunError } from "../space-run-error";
import { canvasErrorDisplay } from "../space-error-display";
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
  const { summary, details } = canvasErrorDisplay(error || fallback);

  if (!fallback) {
    return null;
  }

  return (
    <div className="wb-detail-error-banner is-run-error" role="alert">
      <AlertCircle size={17} />
      <div style={{ minWidth: 0, flex: 1 }}>
        <strong>最近一次运行失败</strong>
        <p>{summary}</p>
        <details style={{ marginTop: 6, fontSize: 11 }}>
          <summary style={{ cursor: "pointer" }}>技术详情</summary>
          <pre
            style={{
              maxHeight: 240,
              overflow: "auto",
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              fontSize: "inherit",
              margin: "6px 0 0",
            }}
          >
            {details}
          </pre>
        </details>
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
