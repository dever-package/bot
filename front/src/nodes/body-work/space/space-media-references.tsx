import { X } from "lucide-react";

import type {
  PowerParam,
  SpaceCanvasEdge,
  SpaceCanvasNode,
} from "./types";

const VIDEO_MEDIA_USAGE_KEYS = ["firstFrame", "lastFrame", "images"] as const;
const CANVAS_MEDIA_KINDS = new Set(["image", "video", "audio", "file"]);
const EXCLUSIVE_VIDEO_MEDIA_USAGES = new Set<string>([
  "firstFrame",
  "lastFrame",
]);

export type VideoMediaUsageOption = {
  key: string;
  label: string;
  maxFiles: number;
};

export type CanvasConnectedMediaReference = {
  edge: SpaceCanvasEdge;
  source: SpaceCanvasNode;
};

export type CanvasMediaUsageAssignments = Record<string, string | undefined>;

export function isCanvasMediaReferenceNode(node?: SpaceCanvasNode) {
  if (!node) {
    return false;
  }
  return [node.kind, node.asset?.kind, node.power?.kind].some((kind) =>
    CANVAS_MEDIA_KINDS.has(String(kind || "").toLowerCase()),
  );
}

export function isCanvasImageReferenceNode(node?: SpaceCanvasNode) {
  if (!node) {
    return false;
  }
  return [node.kind, node.asset?.kind, node.power?.kind].some(
    (kind) => String(kind || "").toLowerCase() === "image",
  );
}

export function videoMediaUsageOptions(
  params: PowerParam[],
): VideoMediaUsageOption[] {
  const labels: Record<(typeof VIDEO_MEDIA_USAGE_KEYS)[number], string> = {
    firstFrame: "首帧",
    lastFrame: "尾帧",
    images: "参考图",
  };
  const byKey = new Map(
    params.map((param) => [String(param.key || "").toLowerCase(), param]),
  );
  return VIDEO_MEDIA_USAGE_KEYS.flatMap((key) => {
    const param = byKey.get(key.toLowerCase());
    if (!param) {
      return [];
    }
    return [
      {
        key,
        label: String(param.name || labels[key]),
        maxFiles: EXCLUSIVE_VIDEO_MEDIA_USAGES.has(key)
          ? 1
          : param.type === "files"
            ? Math.max(0, Number(param.max_files || 0))
            : 1,
      },
    ];
  });
}

export function videoMediaUsageError(
  connections: CanvasConnectedMediaReference[],
  options: VideoMediaUsageOption[],
  assignments: CanvasMediaUsageAssignments = {},
) {
  if (connections.length === 0) {
    return "";
  }
  if (options.length === 0) {
    return "当前视频来源未配置可接收图片素材的参数";
  }

  const optionByKey = new Map(options.map((option) => [option.key, option]));
  const counts = new Map<string, number>();
  for (const connection of connections) {
    const usage = Object.prototype.hasOwnProperty.call(
      assignments,
      connection.edge.id,
    )
      ? assignments[connection.edge.id]
      : connection.edge.mediaUsage;
    const option = optionByKey.get(String(usage || ""));
    if (!option) {
      return "存在未绑定用途的连线图片，请移除多余素材或切换视频来源";
    }
    if (!canAssignVideoMediaUsage(option, counts)) {
      return `${option.label}参数最多接收 ${option.maxFiles} 张连线图片`;
    }
    incrementVideoMediaUsage(counts, option.key);
  }
  return "";
}

export function nextVideoMediaUsage(
  connections: CanvasConnectedMediaReference[],
  options: VideoMediaUsageOption[],
) {
  if (options.length === 0) {
    return {
      usage: undefined,
      error: "当前视频来源未配置可接收图片素材的参数",
    };
  }
  const counts = videoMediaUsageCounts(connections);
  const preferred = options.find(
    (option) =>
      option.key === "images" && canAssignVideoMediaUsage(option, counts),
  );
  const available =
    preferred ||
    options.find((option) => canAssignVideoMediaUsage(option, counts));
  if (available) {
    return { usage: available.key };
  }
  const finiteCapacity = options.reduce(
    (total, option) => total + Math.max(0, option.maxFiles),
    0,
  );
  return {
    usage: undefined,
    error: `当前视频来源最多连接 ${finiteCapacity} 张图片`,
  };
}

export function reconcileVideoMediaUsages(
  connections: CanvasConnectedMediaReference[],
  options: VideoMediaUsageOption[],
): CanvasMediaUsageAssignments {
  const assignments: CanvasMediaUsageAssignments = {};
  if (options.length === 0) {
    return assignments;
  }

  const optionByKey = new Map(options.map((option) => [option.key, option]));
  const counts = new Map<string, number>();
  for (const connection of connections) {
    const current = String(connection.edge.mediaUsage || "");
    const currentOption = optionByKey.get(current);
    const preferred = optionByKey.get("images");
    const option =
      (currentOption && canAssignVideoMediaUsage(currentOption, counts)
        ? currentOption
        : undefined) ||
      (preferred && canAssignVideoMediaUsage(preferred, counts)
        ? preferred
        : undefined) ||
      options.find((candidate) =>
        canAssignVideoMediaUsage(candidate, counts),
      );
    const usage = option?.key || "";
    if (usage) {
      incrementVideoMediaUsage(counts, usage);
    }
    if (usage !== current) {
      assignments[connection.edge.id] = usage || undefined;
    }
  }
  return assignments;
}

function videoMediaUsageCounts(
  connections: CanvasConnectedMediaReference[],
) {
  const counts = new Map<string, number>();
  for (const connection of connections) {
    const usage = String(connection.edge.mediaUsage || "");
    if (usage) {
      incrementVideoMediaUsage(counts, usage);
    }
  }
  return counts;
}

function canAssignVideoMediaUsage(
  option: VideoMediaUsageOption,
  counts: Map<string, number>,
) {
  return (
    option.maxFiles <= 0 || (counts.get(option.key) || 0) < option.maxFiles
  );
}

function incrementVideoMediaUsage(counts: Map<string, number>, usage: string) {
  counts.set(usage, (counts.get(usage) || 0) + 1);
}

export function changeVideoMediaUsage(
  connections: CanvasConnectedMediaReference[],
  edgeId: string,
  usage: string,
  options: VideoMediaUsageOption[],
): CanvasMediaUsageAssignments {
  const optionByKey = new Map(options.map((option) => [option.key, option]));
  const targetOption = optionByKey.get(usage);
  if (!targetOption) {
    return {};
  }
  const current = connections.find(
    (connection) => connection.edge.id === edgeId,
  );
  if (!current || current.edge.mediaUsage === usage) {
    return {};
  }

  const occupied = connections.find(
    (connection) =>
      connection.edge.id !== edgeId && connection.edge.mediaUsage === usage,
  );
  const counts = videoMediaUsageCounts(
    connections.filter((connection) => connection.edge.id !== edgeId),
  );
  if (
    !canAssignVideoMediaUsage(targetOption, counts) &&
    (!EXCLUSIVE_VIDEO_MEDIA_USAGES.has(usage) || !occupied)
  ) {
    return {};
  }

  const assignments: CanvasMediaUsageAssignments = { [edgeId]: usage };
  if (!EXCLUSIVE_VIDEO_MEDIA_USAGES.has(usage)) {
    return assignments;
  }
  if (!occupied) {
    return assignments;
  }

  const previous = String(current.edge.mediaUsage || "");
  assignments[occupied.edge.id] = optionByKey.has(previous)
    ? previous
    : optionByKey.has("images")
      ? "images"
      : undefined;
  return videoMediaUsageError(connections, options, assignments)
    ? {}
    : assignments;
}

export function ConnectedMediaReferences({
  connections,
  options,
  showUsage,
  disabled,
  onAssignmentsChange,
  onRemove,
}: {
  connections: CanvasConnectedMediaReference[];
  options: VideoMediaUsageOption[];
  showUsage?: boolean;
  disabled?: boolean;
  onAssignmentsChange?: (assignments: CanvasMediaUsageAssignments) => void;
  onRemove: (edgeId: string) => void;
}) {
  if (connections.length === 0) {
    return null;
  }
  const usageConnections = connections.filter(({ source }) =>
    isCanvasImageReferenceNode(source),
  );
  return (
    <div className="ws-connected-media-references">
      <span className="ws-connected-media-references-label">连线素材</span>
      <div className="ws-connected-media-reference-list">
        {connections.map(({ edge, source }) => {
          const canAssignUsage = showUsage && isCanvasImageReferenceNode(source);
          const usageSupported = options.some(
            (option) => option.key === edge.mediaUsage,
          );
          return (
            <div className="ws-connected-media-reference" key={edge.id}>
              <span
                className="ws-connected-media-reference-name"
                title={source.title}
              >
                @{source.title || "媒体素材"}
              </span>
              {canAssignUsage ? (
                <select
                  aria-label={`设置${source.title || "图片素材"}用途`}
                  value={usageSupported ? edge.mediaUsage : ""}
                  disabled={
                    disabled || options.length === 0 || !onAssignmentsChange
                  }
                  onChange={(event) =>
                    onAssignmentsChange?.(
                      changeVideoMediaUsage(
                        usageConnections,
                        edge.id,
                        event.target.value,
                        options,
                      ),
                    )
                  }
                >
                  {!usageSupported ? (
                    <option value="">
                      {options.length > 0 ? "未绑定" : "当前来源不支持"}
                    </option>
                  ) : null}
                  {options.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : null}
              <button
                type="button"
                aria-label={`取消${source.title || "媒体素材"}连线`}
                disabled={disabled}
                onClick={() => onRemove(edge.id)}
              >
                <X size={13} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
