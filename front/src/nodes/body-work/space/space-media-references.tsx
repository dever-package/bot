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
        label: String(item?.title || source.title || "媒体素材"),
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
  return params.flatMap((param) => {
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

export function canvasMediaUsageError(
  connections: CanvasConnectedMediaReference[],
  content: CanvasReferenceContent | undefined,
  items: ComposerAssetItem[],
  options: MediaUsageOption[],
  assignments: CanvasMediaUsageAssignments = {},
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
  for (const part of content?.parts || []) {
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
      referenceKey: `asset:${part.ref_id}`,
      label: String(part.label || item?.title || "引用素材"),
      kind,
      usage: String(part.usage || ""),
      required: false,
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
    const configured = candidates.find(
      (option) => option.key === entry.usage,
    );
    if (entry.usage && !configured) {
      return `「${entry.label}」的素材用途与当前能力参数不兼容`;
    }
    const option =
      configured || (candidates.length === 1 ? candidates[0] : undefined);
    if (!option) {
      return `请为「${entry.label}」选择素材用途`;
    }
    if (!canAssignMediaUsage(option, counts)) {
      return `${option.label}参数最多接收 ${option.maxFiles} 个素材`;
    }
    incrementMediaUsage(counts, option.key);
  }
  return "";
}

export function nextMediaUsage(
  connections: CanvasConnectedMediaReference[],
  options: MediaUsageOption[],
  source: SpaceCanvasNode,
) {
  const kind = canvasMediaReferenceKind(source);
  const candidates = mediaUsageCandidates(options, source);
  if (!kind || candidates.length === 0) {
    return {
      usage: undefined,
      error: `当前能力未配置可接收${mediaKindLabel(kind || "file")}素材的参数`,
    };
  }
  const counts = mediaUsageCounts(connections, options);
  const available = candidates.filter((option) =>
    canAssignMediaUsage(option, counts),
  );
  if (available.length === 0) {
    return {
      usage: undefined,
      error: `${candidates[0].label}参数已达到素材数量上限`,
    };
  }
  return {
    usage: available[0]?.key,
    error: "",
  };
}

export function reconcileMediaUsages(
  connections: CanvasConnectedMediaReference[],
  options: MediaUsageOption[],
): CanvasMediaUsageAssignments {
  const assignments: CanvasMediaUsageAssignments = {};
  const counts = new Map<string, number>();
  for (const connection of connections) {
    const current = String(connection.edge.mediaUsage || "");
    const candidates = mediaUsageCandidates(options, connection.source);
    const currentOption = candidates.find((option) => option.key === current);
    const available = candidates.filter((option) =>
      canAssignMediaUsage(option, counts),
    );
    const option =
      (currentOption && canAssignMediaUsage(currentOption, counts)
        ? currentOption
        : undefined) || available[0];
    const usage = option?.key || "";
    if (usage) {
      incrementMediaUsage(counts, usage);
    }
    if (usage !== current) {
      assignments[connection.edge.id] = usage || undefined;
    }
  }
  return assignments;
}

export function reconcileReferenceMediaUsageChange(
  previous: CanvasReferenceContent | undefined,
  next: CanvasReferenceContent | undefined,
  items: ComposerAssetItem[],
  options: MediaUsageOption[],
) {
  if (!previous || !next || options.length === 0) {
    return next;
  }

  const previousEntries = indexedReferenceParts(previous);
  const nextEntries = indexedReferenceParts(next);
  const previousByKey = new Map(
    previousEntries.map((entry) => [entry.key, entry] as const),
  );
  const changed = nextEntries.filter((entry) => {
    const current = previousByKey.get(entry.key);
    return Boolean(
      entry.usage && (!current || current.usage !== entry.usage),
    );
  });
  if (changed.length !== 1 || !changed[0].usage) {
    return next;
  }

  const selected = changed[0];
  const targetOption = options.find(
    (option) => option.key === selected.usage,
  );
  if (!targetOption || targetOption.maxFiles !== 1) {
    return next;
  }

  const occupied = nextEntries.filter(
    (entry) => entry.key !== selected.key && entry.usage === selected.usage,
  );
  if (occupied.length === 0) {
    return next;
  }

  const previousUsage = previousByKey.get(selected.key)?.usage || "";
  const previousOption = options.find(
    (option) => option.key === previousUsage,
  );
  const parts = next.parts.map((part) => ({ ...part }));
  const swapTarget = occupied.find(
    (entry) =>
      previousOption &&
      referenceEntrySupportsOption(
        entry,
        previousOption,
        items,
        targetOption,
      ) &&
      referenceUsageHasCapacity(
        nextEntries,
        previousOption,
        new Set([selected.key, entry.key]),
      ),
  );

  for (const entry of occupied) {
    const part = parts[entry.partIndex];
    if (part.type !== "reference") {
      continue;
    }
    part.usage = entry.key === swapTarget?.key ? previousUsage : undefined;
  }
  return { ...next, parts };
}

export function changeMediaUsage(
  connections: CanvasConnectedMediaReference[],
  edgeId: string,
  usage: string,
  options: MediaUsageOption[],
): CanvasMediaUsageAssignments {
  const current = connections.find(
    (connection) => connection.edge.id === edgeId,
  );
  const targetOption = mediaUsageCandidates(options, current?.source).find(
    (option) => option.key === usage,
  );
  if (!current || !targetOption || current.edge.mediaUsage === usage) {
    return {};
  }

  const remaining = connections.filter(
    (connection) => connection.edge.id !== edgeId,
  );
  const counts = mediaUsageCounts(remaining, options);
  if (canAssignMediaUsage(targetOption, counts)) {
    return { [edgeId]: usage };
  }
  if (targetOption.maxFiles !== 1) {
    return {};
  }

  const occupied = remaining.find(
    (connection) => connection.edge.mediaUsage === usage,
  );
  if (!occupied) {
    return {};
  }
  const assignments: CanvasMediaUsageAssignments = {
    [edgeId]: usage,
    [occupied.edge.id]: undefined,
  };
  const previousUsage = String(current.edge.mediaUsage || "");
  const previousOption = mediaUsageCandidates(options, occupied.source).find(
    (option) => option.key === previousUsage,
  );
  if (!previousOption) {
    return assignments;
  }
  const swapCounts = mediaUsageCounts(
    connections.filter(
      (connection) =>
        connection.edge.id !== edgeId &&
        connection.edge.id !== occupied.edge.id,
    ),
    options,
  );
  if (canAssignMediaUsage(previousOption, swapCounts)) {
    assignments[occupied.edge.id] = previousUsage;
  }
  return assignments;
}

function mediaUsageCounts(
  connections: CanvasConnectedMediaReference[],
  options: MediaUsageOption[],
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

type IndexedReferencePart = {
  key: string;
  partIndex: number;
  refID: number;
  usage: string;
};

function indexedReferenceParts(
  content: CanvasReferenceContent,
): IndexedReferencePart[] {
  const occurrences = new Map<string, number>();
  return content.parts.flatMap((part, partIndex) => {
    if (
      part.type !== "reference" ||
      part.ref_type !== "asset" ||
      part.ref_origin === "edge"
    ) {
      return [];
    }
    const identity = `${part.ref_type}:${part.ref_id}:${part.ref_version_id || 0}`;
    const occurrence = occurrences.get(identity) || 0;
    occurrences.set(identity, occurrence + 1);
    return [
      {
        key: `${identity}:${occurrence}`,
        partIndex,
        refID: Number(part.ref_id || 0),
        usage: String(part.usage || ""),
      },
    ];
  });
}

function referenceEntrySupportsOption(
  entry: IndexedReferencePart,
  option: MediaUsageOption,
  items: ComposerAssetItem[],
  currentOption?: MediaUsageOption,
) {
  const item = items.find(
    (current) => Number(current.refId || 0) === entry.refID,
  );
  const kind = normalizeCanvasMediaKind(item?.kind);
  if (kind) {
    return option.acceptedKinds.includes(kind);
  }
  return Boolean(
    currentOption?.acceptedKinds.some((acceptedKind) =>
      option.acceptedKinds.includes(acceptedKind),
    ),
  );
}

function referenceUsageHasCapacity(
  entries: IndexedReferencePart[],
  option: MediaUsageOption,
  ignoredKeys: Set<string>,
) {
  if (option.maxFiles <= 0) {
    return true;
  }
  const count = entries.filter(
    (entry) => !ignoredKeys.has(entry.key) && entry.usage === option.key,
  ).length;
  return count < option.maxFiles;
}

function canAssignMediaUsage(
  option: MediaUsageOption,
  counts: Map<string, number>,
) {
  return option.maxFiles <= 0 || (counts.get(option.key) || 0) < option.maxFiles;
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
  return String(connection.source.title || "媒体素材").trim() || "媒体素材";
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
