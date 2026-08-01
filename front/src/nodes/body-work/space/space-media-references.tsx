import type { ComposerAssetItem } from "./space-prompt-composer";
import {
  acceptedMediaKinds,
  mediaParamCapacity,
  normalizeCanvasMediaKind,
  type CanvasMediaKind,
} from "./space-media-param";
import type { CanvasReferenceTarget } from "./space-reference-content";
import type {
  CanvasReferenceContent,
  PowerParam,
  SpaceCanvasEdge,
  SpaceCanvasNode,
} from "./types";

export type MediaUsageOption = {
  key: string;
  label: string;
  maxFiles: number;
  acceptedKinds: CanvasMediaKind[];
};

export type CanvasConnectedMediaReference = {
  edge: SpaceCanvasEdge;
  source: SpaceCanvasNode;
};

export type CanvasMediaUsageAssignments = Record<string, string | undefined>;

export type CanvasMediaUsageReconciliation = {
  content: CanvasReferenceContent | undefined;
  assignments: CanvasMediaUsageAssignments;
};

export function connectedMediaReferenceTargets(
  connections: CanvasConnectedMediaReference[],
  items: ComposerAssetItem[],
): CanvasReferenceTarget[] {
  return connections.flatMap(({ edge, source }) => {
    const item = connectedReferenceItem(items, source);
    const refID = Number(
      item?.refId || source.asset?.id || source.resultRef?.asset_id || 0,
    );
    if (refID <= 0) {
      return [];
    }
    return [
      {
        refType: "asset" as const,
        refId: refID,
        versionId: Number(
          item?.versionID ||
            source.asset?.version?.id ||
            source.asset?.version_id ||
            source.resultRef?.version_id ||
            0,
        ),
        label: connectedMediaReferenceLabel(source, item),
        usage: String(edge.mediaUsage || ""),
        trigger: "@" as const,
        origin: "edge",
        originID: edge.id,
      },
    ];
  });
}

type MediaUsageValidationEntry = {
  referenceKey: string;
  label: string;
  kind: CanvasMediaKind;
  usage: string;
  required: boolean;
};

export function canvasMediaReferenceKind(
  node?: SpaceCanvasNode,
): CanvasMediaKind | undefined {
  if (!node) {
    return undefined;
  }
  for (const kind of [node.kind, node.asset?.kind, node.power?.kind]) {
    const normalized = normalizeCanvasMediaKind(kind);
    if (normalized) {
      return normalized;
    }
  }
  return undefined;
}

export function isCanvasMediaReferenceNode(node?: SpaceCanvasNode) {
  return Boolean(canvasMediaReferenceKind(node));
}

export function mediaUsageOptions(params: PowerParam[]): MediaUsageOption[] {
  const options = params.flatMap((param) => {
    if (param.type !== "file" && param.type !== "files") {
      return [];
    }
    const key = String(param.key || "").trim();
    const acceptedKinds = acceptedMediaKinds(param);
    if (!key || acceptedKinds.length === 0) {
      return [];
    }
    return [
      {
        key,
        label: String(param.name || key),
        maxFiles: mediaParamCapacity(param),
        acceptedKinds,
      },
    ];
  });
  return prioritizeMediaUsageOptions(
    options.map((option) =>
      isFrameMediaUsageOption(option) ? { ...option, maxFiles: 1 } : option,
    ),
  );
}

export function mediaUsageCandidates(
  options: MediaUsageOption[],
  source?: SpaceCanvasNode,
) {
  const kind = canvasMediaReferenceKind(source);
  return kind
    ? options.filter((option) => option.acceptedKinds.includes(kind))
    : [];
}

function resolvedMediaUsageOption(
  candidates: MediaUsageOption[],
  usage: string,
) {
  return candidates.find((option) => option.key === usage);
}

function isFirstFrameUsage(value: string) {
  const normalized = normalizeMediaUsageRole(value);
  return normalized === "firstframe" || normalized === "startframe";
}

function isLastFrameUsage(value: string) {
  const normalized = normalizeMediaUsageRole(value);
  return normalized === "lastframe" || normalized === "endframe";
}

function isFrameUsageOption(value: string) {
  const normalized = normalizeMediaUsageRole(value);
  return (
    normalized === "firstframe" ||
    normalized === "startframe" ||
    normalized === "lastframe" ||
    normalized === "endframe"
  );
}

function isReferenceImageUsageOption(option: MediaUsageOption) {
  if (!option.acceptedKinds.includes("image")) {
    return false;
  }
  const key = normalizeMediaUsageRole(option.key);
  const label = String(option.label || "").trim();
  return (
    ["images", "reference", "referenceimage", "referenceimages"].includes(
      key,
    ) ||
    label.includes("参考图") ||
    label.includes("参考图片")
  );
}

function prioritizeMediaUsageOptions(options: MediaUsageOption[]) {
  return options
    .map((option, index) => ({ option, index }))
    .sort(
      (left, right) =>
        mediaUsagePriority(left.option) - mediaUsagePriority(right.option) ||
        left.index - right.index,
    )
    .map(({ option }) => option);
}

function mediaUsagePriority(option: MediaUsageOption) {
  if (isReferenceImageUsageOption(option)) {
    return 0;
  }
  if (isFirstFrameUsage(option.key) || option.label.includes("首帧")) {
    return 1;
  }
  if (isLastFrameUsage(option.key) || option.label.includes("尾帧")) {
    return 2;
  }
  return 3;
}

function isFrameMediaUsageOption(option: MediaUsageOption) {
  return (
    isFrameUsageOption(option.key) ||
    option.label.includes("首帧") ||
    option.label.includes("尾帧")
  );
}

function normalizeMediaUsageRole(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "");
}

export function canvasMediaUsageError(
  connections: CanvasConnectedMediaReference[],
  content: CanvasReferenceContent | undefined,
  items: ComposerAssetItem[],
  options: MediaUsageOption[],
  assignments: CanvasMediaUsageAssignments = {},
  requireManualReferences = false,
) {
  const entries: MediaUsageValidationEntry[] = connections.flatMap(
    (connection) => {
      const kind = canvasMediaReferenceKind(connection.source);
      if (!kind) {
        return [];
      }
      return [
        {
          referenceKey: connectedMediaReferenceKey(connection),
          label: mediaReferenceLabel(connection),
          kind,
          usage: assignedMediaUsage(connection, assignments),
          required: true,
        },
      ];
    },
  );
  const itemByReferenceID = new Map(
    items.flatMap((item) => {
      const refID = Number(item.refId || 0);
      return refID > 0 ? [[refID, item] as const] : [];
    }),
  );
  for (const [partIndex, part] of (content?.parts || []).entries()) {
    if (
      part.type !== "reference" ||
      part.ref_type !== "asset" ||
      part.ref_origin === "edge"
    ) {
      continue;
    }
    const item = itemByReferenceID.get(Number(part.ref_id || 0));
    const kind = normalizeCanvasMediaKind(item?.kind);
    if (!kind) {
      continue;
    }
    entries.push({
      referenceKey: `asset:${part.ref_id}:${partIndex}`,
      label: String(part.label || item?.title || "引用素材"),
      kind,
      usage: String(part.usage || ""),
      required: requireManualReferences,
    });
  }

  const counts = new Map<string, number>();
  const visited = new Set<string>();
  for (const entry of entries) {
    const duplicateKey = `${entry.referenceKey}:${entry.usage}`;
    if (visited.has(duplicateKey)) {
      continue;
    }
    visited.add(duplicateKey);
    const candidates = options.filter((option) =>
      option.acceptedKinds.includes(entry.kind),
    );
    if (candidates.length === 0) {
      if (entry.required) {
        return `当前能力未配置可接收${mediaKindLabel(entry.kind)}素材的参数`;
      }
      // A manual reference unsupported by the capability remains prompt context.
      continue;
    }
    const configured = resolvedMediaUsageOption(candidates, entry.usage);
    if (entry.usage && !configured) {
      return `「${entry.label}」的素材用途与当前能力参数不兼容`;
    }
    const option =
      configured || (candidates.length === 1 ? candidates[0] : undefined);
    if (!option) {
      return `请为「${entry.label}」选择素材用途`;
    }
    if (!canAssignMediaUsage(option, counts)) {
      return `${option.label}参数最多接收 ${mediaUsageCapacity(option)} 个素材`;
    }
    incrementMediaUsage(counts, option.key);
  }
  return "";
}

export function nextMediaUsageForSources(
  connections: CanvasConnectedMediaReference[],
  options: MediaUsageOption[],
  sources: SpaceCanvasNode[],
  content?: CanvasReferenceContent,
) {
  const mediaSources = sources.filter(isCanvasMediaReferenceNode);
  const kinds = mediaSources.flatMap((source) => {
    const kind = canvasMediaReferenceKind(source);
    return kind ? [kind] : [];
  });
  const candidates = options.filter((option) =>
    kinds.every((kind) => option.acceptedKinds.includes(kind)),
  );
  if (kinds.length === 0 || candidates.length === 0) {
    const kind = kinds[0];
    return {
      usage: undefined,
      error:
        kinds.length > 1
          ? "当前能力未配置可同时接收该分组媒体素材的参数"
          : `当前能力未配置可接收${mediaKindLabel(kind || "file")}素材的参数`,
    };
  }
  const counts = mediaUsageCounts(connections, options, content);
  const option = firstAvailableMediaUsageForAmount(
    candidates,
    counts,
    mediaSources.length,
  );
  if (!option) {
    return {
      usage: undefined,
      error: `${candidates[0].label}参数已达到素材数量上限`,
    };
  }
  return {
    usage: option.key,
    error: "",
  };
}

export function reconcileCanvasMediaUsages(
  previous: CanvasReferenceContent | undefined,
  next: CanvasReferenceContent | undefined,
  items: ComposerAssetItem[],
  options: MediaUsageOption[],
  connections: CanvasConnectedMediaReference[],
): CanvasMediaUsageReconciliation {
  if (!next || options.length === 0) {
    return { content: next, assignments: {} };
  }

  const previousByKey = new Map(
    indexedMediaReferenceParts(previous, items, connections).map((entry) => [
      entry.key,
      entry,
    ] as const),
  );
  const entries = indexedMediaReferenceParts(next, items, connections);
  const orderedEntries = [...entries].sort((left, right) => {
    const leftPriority = mediaReferenceAllocationPriority(
      left,
      previousByKey.get(left.key),
    );
    const rightPriority = mediaReferenceAllocationPriority(
      right,
      previousByKey.get(right.key),
    );
    return leftPriority - rightPriority || left.partIndex - right.partIndex;
  });
  const parts = next.parts.map((part) => ({ ...part }));
  const assignments: CanvasMediaUsageAssignments = {};
  const counts = new Map<string, number>();
  for (const entry of orderedEntries) {
    const previousEntry = previousByKey.get(entry.key);
    const candidates = prioritizeMediaUsageOptions(
      options.filter((option) => option.acceptedKinds.includes(entry.kind)),
    );
    const requestedUsage =
      entry.usage && entry.usage !== previousEntry?.usage ? entry.usage : "";
    const option = firstAvailableMediaUsage(
      candidates,
      counts,
      requestedUsage,
      previousEntry?.usage || entry.usage,
    );
    const usage = option?.key || "";
    if (usage) {
      incrementMediaUsage(counts, usage);
    }
    const part = parts[entry.partIndex];
    if (part?.type === "reference") {
      part.usage = usage || undefined;
    }
    if (
      entry.connection &&
      usage !== String(entry.connection.edge.mediaUsage || "")
    ) {
      assignments[entry.connection.edge.id] = usage || undefined;
    }
  }
  return { content: { ...next, parts }, assignments };
}

function mediaUsageCounts(
  connections: CanvasConnectedMediaReference[],
  options: MediaUsageOption[],
  content?: CanvasReferenceContent,
) {
  const counts = new Map<string, number>();
  for (const connection of connections) {
    const usage = String(connection.edge.mediaUsage || "");
    const option = mediaUsageCandidates(options, connection.source).find(
      (candidate) => candidate.key === usage,
    );
    if (option) {
      incrementMediaUsage(counts, option.key);
    }
  }
  for (const part of content?.parts || []) {
    if (
      part.type !== "reference" ||
      part.ref_origin === "edge" ||
      !part.usage
    ) {
      continue;
    }
    const option = options.find((candidate) => candidate.key === part.usage);
    if (option) {
      incrementMediaUsage(counts, option.key);
    }
  }
  return counts;
}

function assignedMediaUsage(
  connection: CanvasConnectedMediaReference,
  assignments: CanvasMediaUsageAssignments,
) {
  return String(
    Object.prototype.hasOwnProperty.call(assignments, connection.edge.id)
      ? assignments[connection.edge.id] || ""
      : connection.edge.mediaUsage || "",
  );
}

type IndexedMediaReferencePart = {
  key: string;
  partIndex: number;
  kind: CanvasMediaKind;
  usage: string;
  connection?: CanvasConnectedMediaReference;
};

function indexedMediaReferenceParts(
  content: CanvasReferenceContent | undefined,
  items: ComposerAssetItem[],
  connections: CanvasConnectedMediaReference[],
): IndexedMediaReferencePart[] {
  if (!content) {
    return [];
  }
  const connectionByEdgeID = new Map(
    connections.map((connection) => [connection.edge.id, connection]),
  );
  const occurrences = new Map<string, number>();
  return content.parts.flatMap((part, partIndex) => {
    if (part.type !== "reference" || part.ref_type !== "asset") {
      return [];
    }
    const connection = part.ref_origin_id
      ? connectionByEdgeID.get(part.ref_origin_id)
      : undefined;
    const item = items.find(
      (candidate) =>
        Number(candidate.refId || 0) === Number(part.ref_id || 0) &&
        (!part.ref_version_id ||
          Number(candidate.versionID || 0) === Number(part.ref_version_id)),
    );
    const kind = connection
      ? canvasMediaReferenceKind(connection.source)
      : normalizeCanvasMediaKind(item?.kind);
    if (!kind) {
      return [];
    }
    const identity = connection
      ? `edge:${connection.edge.id}`
      : `asset:${part.ref_id}:${part.ref_version_id || 0}`;
    const occurrence = occurrences.get(identity) || 0;
    occurrences.set(identity, occurrence + 1);
    return [
      {
        key: connection ? identity : `${identity}:${occurrence}`,
        partIndex,
        kind,
        usage: String(part.usage || ""),
        connection,
      },
    ];
  });
}

function mediaReferenceAllocationPriority(
  entry: IndexedMediaReferencePart,
  previous?: IndexedMediaReferencePart,
) {
  if (entry.usage && entry.usage !== previous?.usage) {
    return 0;
  }
  return previous ? 1 : 2;
}

function firstAvailableMediaUsage(
  candidates: MediaUsageOption[],
  counts: Map<string, number>,
  ...preferredUsages: string[]
) {
  return firstAvailableMediaUsageForAmount(
    candidates,
    counts,
    1,
    ...preferredUsages,
  );
}

function firstAvailableMediaUsageForAmount(
  candidates: MediaUsageOption[],
  counts: Map<string, number>,
  amount: number,
  ...preferredUsages: string[]
) {
  for (const usage of preferredUsages) {
    const option = candidates.find((candidate) => candidate.key === usage);
    if (option && canAssignMediaUsage(option, counts, amount)) {
      return option;
    }
  }
  return candidates.find((option) =>
    canAssignMediaUsage(option, counts, amount),
  );
}

function mediaUsageCapacity(option: MediaUsageOption) {
  return isFrameMediaUsageOption(option) ? 1 : option.maxFiles;
}

function canAssignMediaUsage(
  option: MediaUsageOption,
  counts: Map<string, number>,
  amount = 1,
) {
  const capacity = mediaUsageCapacity(option);
  return (
    capacity <= 0 || (counts.get(option.key) || 0) + amount <= capacity
  );
}

function incrementMediaUsage(counts: Map<string, number>, usage: string) {
  counts.set(usage, (counts.get(usage) || 0) + 1);
}

function mediaKindLabel(kind: CanvasMediaKind) {
  switch (kind) {
    case "image":
      return "图片";
    case "video":
      return "视频";
    case "audio":
      return "音频";
    default:
      return "文件";
  }
}

function mediaReferenceLabel(connection: CanvasConnectedMediaReference) {
  return connectedMediaReferenceLabel(connection.source);
}

function connectedMediaReferenceLabel(
  source: SpaceCanvasNode,
  item?: ComposerAssetItem,
) {
  for (const value of [source.asset?.name, item?.title, source.title]) {
    const label = String(value || "").trim();
    if (label) {
      return label;
    }
  }
  return "媒体素材";
}

function connectedMediaReferenceKey(
  connection: CanvasConnectedMediaReference,
) {
  const assetID = Number(
    connection.source.asset?.id ||
      connection.source.resultRef?.asset_id ||
      0,
  );
  return assetID > 0 ? `asset:${assetID}` : `node:${connection.source.id}`;
}

function connectedReferenceItem(
  items: ComposerAssetItem[],
  source: SpaceCanvasNode,
) {
  const assetID = Number(source.asset?.id || source.resultRef?.asset_id || 0);
  const versionID = Number(
    source.asset?.version?.id ||
      source.asset?.version_id ||
      source.resultRef?.version_id ||
      0,
  );
  return (
    items.find(
      (item) =>
        Number(item.refId || 0) === assetID &&
        (!versionID || Number(item.versionID || 0) === versionID),
    ) || items.find((item) => item.id === source.id)
  );
}
