import {
  Bot,
  Download,
  Eye,
  FileText,
  Image as ImageIcon,
  Loader2,
  Music2,
  RotateCw,
  Video,
  Workflow,
  X,
  type LucideIcon,
} from "lucide-react";
import { PowerIcon } from "../space-power-icon";
import { resolvePowerPresentation } from "../space-power-presentation";
import type { SpaceCanvasNode } from "../types";
import type { NodeDetailDraftStatus } from "./use-node-detail-draft";

export function NodeDetailHeader({
  node,
  contentLabel,
  updatedAt,
  status,
  readonly,
  downloadUrl,
  onRetry,
  onClose,
}: {
  node: SpaceCanvasNode;
  contentLabel: string;
  updatedAt: string;
  status: NodeDetailDraftStatus;
  readonly: boolean;
  downloadUrl?: string;
  onRetry: () => void;
  onClose: () => void;
}) {
  const powerPresentation =
    node.type === "power"
      ? resolvePowerPresentation(node.power, node.kind, node.outputType)
      : null;
  const detailLabel =
    powerPresentation && powerPresentation.outputName !== contentLabel
      ? `${powerPresentation.outputName} · ${contentLabel}`
      : powerPresentation?.outputName || contentLabel;
  return (
    <header className="ws-node-detail-head">
      <div className="ws-node-detail-heading">
        <span className="ws-node-detail-kind-icon" aria-hidden="true">
          <DetailNodeIcon node={node} />
        </span>
        <div>
          <strong>{node.title || "节点详情"}</strong>
          <span>{detailLabel}</span>
        </div>
      </div>

      <div className="ws-node-detail-meta">
        {!readonly ? (
          status === "error" ? (
            <button
              type="button"
              className="ws-node-detail-save-state is-error"
              onClick={onRetry}
              title="重试保存"
            >
              <RotateCw size={12} />
              保存失败
            </button>
          ) : (
            <span className={`ws-node-detail-save-state is-${status}`}>
              {status === "saving" ? (
                <Loader2 size={12} className="ws-spin" />
              ) : null}
              {saveStatusLabel(status)}
            </span>
          )
        ) : (
          <span className="ws-node-detail-save-state">只读预览</span>
        )}
        {updatedAt ? <time>{updatedAt}</time> : null}
      </div>

      <div className="ws-node-detail-actions">
        {downloadUrl ? (
          <a
            href={downloadUrl}
            download
            aria-label="下载内容"
            title="下载内容"
          >
            <Download size={17} />
          </a>
        ) : null}
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭详情"
          title="关闭"
        >
          <X size={18} />
        </button>
      </div>
    </header>
  );
}

function saveStatusLabel(status: NodeDetailDraftStatus) {
  if (status === "dirty") {
    return "未保存";
  }
  if (status === "saving") {
    return "保存中";
  }
  return "已保存";
}

function DetailNodeIcon({ node }: { node: SpaceCanvasNode }) {
  if (node.type === "power") {
    return (
      <PowerIcon
        power={node.power}
        kind={node.kind}
        outputType={node.outputType}
        size={16}
      />
    );
  }
  const Icon = detailNodeIcon(node);
  return <Icon size={16} />;
}

function detailNodeIcon(node: SpaceCanvasNode): LucideIcon {
  if (node.type === "agent") {
    return Bot;
  }
  if (node.type === "flow") {
    return Workflow;
  }
  if (node.type === "function") {
    return Eye;
  }
  if (node.kind === "image") {
    return ImageIcon;
  }
  if (node.kind === "video") {
    return Video;
  }
  if (node.kind === "audio") {
    return Music2;
  }
  return FileText;
}
