import {
  Bot,
  Eye,
  FileText,
  Image as ImageIcon,
  Loader2,
  Music2,
  RotateCw,
  Video,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { DetailDialogHeader } from "../../shared/detail-dialog";
import { PowerIcon } from "../../shared/power-icon";
import { resolvePowerPresentation } from "../../shared/power-presentation";
import { SpaceTooltip } from "../space-tooltip";
import type { SpaceCanvasNode } from "../types";
import type { NodeDetailDraftStatus } from "./use-node-detail-draft";

export function NodeDetailHeader({
  node,
  contentLabel,
  versionSelect,
  updatedAt,
  status,
  readonly,
  downloadUrl,
  onRetry,
  onClose,
}: {
  node: SpaceCanvasNode;
  contentLabel: string;
  versionSelect?: ReactNode;
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
    <DetailDialogHeader
      icon={<DetailNodeIcon node={node} />}
      title={node.title || "节点详情"}
      subtitle={detailLabel}
      versionSelect={versionSelect}
      state={
        !readonly ? (
          status === "error" ? (
            <SpaceTooltip label="重试保存">
              <button
                type="button"
                className="wb-detail-state is-error"
                onClick={onRetry}
              >
                <RotateCw size={12} />
                保存失败
              </button>
            </SpaceTooltip>
          ) : (
            <span className={`wb-detail-state is-${status}`}>
              {status === "saving" ? (
                <Loader2 size={12} className="wb-detail-spin" />
              ) : null}
              {saveStatusLabel(status)}
            </span>
          )
        ) : (
          <span className="wb-detail-state">只读预览</span>
        )
      }
      updatedAt={updatedAt}
      downloadUrl={downloadUrl}
      onClose={onClose}
    />
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
