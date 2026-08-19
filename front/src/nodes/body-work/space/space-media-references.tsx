import {
  parseStoryboardGridOutput,
  storyboardGridImageURLs,
} from "../shared/content-output";
import { findAssetMediaItems } from "../asset/asset-content";
import {
  acceptedMediaKinds,
  mediaParamCapacity,
  normalizeCanvasMediaKind,
  type CanvasMediaKind,
} from "./space-media-param";
import {
  powerParamOptionValue,
  resolvePowerParamOption,
} from "./space-power-param";
import { filterActivePowerParams } from "./space-power-param-runtime";
import type { CanvasReferenceTarget } from "./space-reference-content";
import type {
  CanvasMultiImageMode,
  CanvasReferenceContent,
  ComposerAssetItem,
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

export type CanvasMultiImagePlanOption = {
  value: CanvasMultiImageMode;
  label: string;
  enabled: boolean;
  reason?: string;
};

export type CanvasMultiImagePlan = {
  active: boolean;
  imageCount: number;
  structured: boolean;
  explicitFramePair: boolean;
  mode?: CanvasMultiImageMode;
  defaultMode?: CanvasMultiImageMode;
  options: CanvasMultiImagePlanOption[];
  error: string;
};

const REFERENCE_MODE_PARAM_KEY = "referencemode";
const REFERENCE_MODE_REFERENCES = "references";

export function resolveCanvasMultiImagePlan({
  node,
  content,
  items,
  connections,
  params,
  values,
  requestedMode,
  additionalSources = [],
}: {
  node: SpaceCanvasNode;
  content?: CanvasReferenceContent;
  items: ComposerAssetItem[];
  connections: CanvasConnectedMediaReference[];
  params: PowerParam[];
  values: Record<string, unknown>;
  requestedMode?: CanvasMultiImageMode;
  additionalSources?: SpaceCanvasNode[];
}) {
  // Reference mode selects provider inputs; multi-image mode only controls batching.
  const activeMediaOptions = mediaUsageOptions(
    filterActivePowerParams(params, values),
  );
  return canvasMultiImagePlan({
    targetKind: canvasMediaReferenceKind(node) || node.power?.kind || node.kind,
    content,
    items,
    connections,
    mediaOptions: activeMediaOptions,
    requestedMode,
    additionalSources,
  });
}

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
        mediaCount: canvasMediaReferenceAmount(source),
      },
    ];
  });
}

type MediaUsageValidationEntry = {
  referenceKey: string;
  label: string;
  kind: CanvasMediaKind;
  amount: number;
  mediaCount: number;
  mediaSelected: boolean;
  usage: string;
  required: boolean;
};

export function canvasMediaReferenceKind(
  node?: SpaceCanvasNode,
): CanvasMediaKind | undefined {
  if (!node) {
    return undefined;
  }

  const declaredKinds = [node.kind, node.asset?.kind, node.power?.kind];
  const content = [node.asset?.version?.content, node.resultOutput];
  const storyboardGrid = parseStoryboardGridOutput(content);
  if (storyboardGrid?.frames.some((frame) => Boolean(frame.image))) {
    return "image";
  }

  let hasFileKind = false;
  for (const kind of declaredKinds) {
    const normalized = normalizeCanvasMediaKind(kind);
    if (normalized === "file") {
      hasFileKind = true;
      continue;
    }
    if (normalized) {
      return normalized;
    }
  }
  return hasFileKind && hasCanvasFileReference(content) ? "file" : undefined;
}

export function isCanvasMediaReferenceNode(node?: SpaceCanvasNode) {
  return Boolean(canvasMediaReferenceKind(node));
}

function hasCanvasFileReference(values: unknown[]) {
  return values.some((value) =>
    findCanvasFileReference(value, new Set<object>(), 0),
  );
}

function findCanvasFileReference(
  value: unknown,
  seen: Set<object>,
  depth: number,
): boolean {
  if (value == null || depth > 10) {
    return false;
  }
  if (typeof value === "string") {
    return /^(?:https?:\/\/|\/|data:)/i.test(value.trim());
  }
  if (Array.isArray(value)) {
    return value.some((item) => findCanvasFileReference(item, seen, depth + 1));
  }
  if (typeof value !== "object" || seen.has(value)) {
    return false;
  }
  seen.add(value);
  const record = value as Record<string, unknown>;
  return [
    record.file,
    record.files,
    record.file_url,
    record.fileUrl,
    record.url,
    record.src,
    record.download,
    record.download_url,
    record.downloadUrl,
    record.open_url,
    record.path,
    record.output,
    record.result,
    record.data,
    record.content,
    record.body,
    record.value,
    record.json,
    record.media_files,
    record.mediaFiles,
  ].some((nested) => findCanvasFileReference(nested, seen, depth + 1));
}

export function reconcileReferenceModeForMediaSources(
  params: PowerParam[],
  values: Record<string, unknown>,
  sources: SpaceCanvasNode[],
) {
  const requiresReferenceMaterials = sources.some((source) => {
    const kind = canvasMediaReferenceKind(source);
    return kind === "video" || kind === "audio";
  });
  if (!requiresReferenceMaterials) {
    return values;
  }
  return (
    powerParamValuesForReferenceMode(
      params,
      values,
      REFERENCE_MODE_REFERENCES,
    ) ||
    values
  );
}

export function isCanvasReferenceModeParam(param: PowerParam) {
  return normalizeMediaUsageRole(param.key) === REFERENCE_MODE_PARAM_KEY;
}

function powerParamValuesForReferenceMode(
  params: PowerParam[],
  values: Record<string, unknown>,
  desiredMode: string,
): Record<string, unknown> | undefined {
  const referenceModeParam = params.find(isCanvasReferenceModeParam);
  if (!referenceModeParam?.key) {
    return values;
  }
  const desiredOption = resolvePowerParamOption(
    referenceModeParam.options || [],
    desiredMode,
  );
  if (!desiredOption) {
    return undefined;
  }
  const currentOption = resolvePowerParamOption(
    referenceModeParam.options || [],
    values[referenceModeParam.key],
  );
  if (
    powerParamOptionValue(currentOption) ===
    powerParamOptionValue(desiredOption)
  ) {
    return values;
  }
  return {
    ...values,
    [referenceModeParam.key]: powerParamOptionValue(desiredOption),
  };
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

export function firstFrameMediaUsageKey(options: MediaUsageOption[]) {
  return (
    options.find(
      (option) =>
        isFirstFrameUsage(option.key) || option.label.includes("首帧"),
    )?.key || "firstFrame"
  );
}

export function mediaUsageCandidates(
  options: MediaUsageOption[],
  source?: SpaceCanvasNode,
  multiImageMode?: CanvasMultiImageMode,
) {
  const kind = canvasMediaReferenceKind(source);
  return kind ? mediaUsageCandidatesForKind(options, kind, multiImageMode) : [];
}

export function canvasMultiImagePlan({
  targetKind,
  content,
  items,
  connections,
  mediaOptions,
  requestedMode,
  additionalSources = [],
}: {
  targetKind?: string;
  content?: CanvasReferenceContent;
  items: ComposerAssetItem[];
  connections: CanvasConnectedMediaReference[];
  mediaOptions: MediaUsageOption[];
  requestedMode?: CanvasMultiImageMode;
  additionalSources?: SpaceCanvasNode[];
}): CanvasMultiImagePlan {
  const references = orderedImageReferences(
    content,
    items,
    connections,
    additionalSources,
  );
  const imageCount = references.reduce(
    (total, reference) => total + reference.amount,
    0,
  );
  const explicitFramePair =
    references.some((reference) => isFirstFrameUsage(reference.usage)) &&
    references.some((reference) => isLastFrameUsage(reference.usage));
  const active =
    normalizeCanvasMediaKind(targetKind) === "video" &&
    imageCount > 1;
  const perImageCandidates = mediaUsageCandidatesForKind(
    mediaOptions,
    "image",
    "per_image",
  );
  const combinedCandidates = mediaUsageCandidatesForKind(
    mediaOptions,
    "image",
    "shared_reference",
  );
  const perImageEnabled = perImageCandidates.length > 0;
  const combinedUsesFrames = combinedCandidates.some(
    isFrameMediaUsageOption,
  );
  const combinedEnabled =
    (!combinedUsesFrames ||
      references.every((reference) => reference.amount === 1)) &&
    canCombineImageReferences(combinedCandidates, imageCount);
  const options: CanvasMultiImagePlanOption[] = [
    {
      value: "per_image",
      label: "逐图生成",
      enabled: perImageEnabled,
      reason: perImageEnabled ? undefined : "当前能力没有可逐张接收图片的参数",
    },
    {
      value: "shared_reference",
      label: combinedUsesFrames ? "首尾帧生成" : "共同参考",
      enabled: combinedEnabled,
      reason: combinedEnabled
        ? undefined
        : combinedUsesFrames
          ? "当前能力不能将这些图片作为同一次首尾帧输入"
          : "当前能力不能在一次请求中接收这些参考图片",
    },
  ];
  if (!active) {
    return {
      active: false,
      imageCount,
      structured: references.some((reference) => reference.structured),
      explicitFramePair,
      options,
      error: "",
    };
  }

  const structured = references.some((reference) => reference.structured);
  const defaultMode: CanvasMultiImageMode =
    explicitFramePair && combinedEnabled
      ? "shared_reference"
      : structured && perImageEnabled
        ? "per_image"
        : combinedEnabled
          ? "shared_reference"
          : "per_image";
  const requestedOption = options.find(
    (option) => option.value === requestedMode && option.enabled,
  );
  const mode = requestedOption?.value || defaultMode;
  const enabled = options.some((option) => option.enabled);
  return {
    active,
    imageCount,
    structured,
    explicitFramePair,
    mode: enabled ? mode : undefined,
    defaultMode,
    options,
    error: enabled ? "" : "当前能力无法接收这组图片素材",
  };
}

type OrderedImageReference = {
  amount: number;
  usage: string;
  structured: boolean;
};

function orderedImageReferences(
  content: CanvasReferenceContent | undefined,
  items: ComposerAssetItem[],
  connections: CanvasConnectedMediaReference[],
  additionalSources: SpaceCanvasNode[],
) {
  const connectionByReference = new Map(
    connections.map(
      (connection) =>
        [
          connectedReferencePartKey(
            connection.edge.id,
            connectedMediaReferenceAssetID(connection),
          ),
          connection,
        ] as const,
    ),
  );
  const includedReferences = new Set<string>();
  const references: OrderedImageReference[] = [];
  for (const part of content?.parts || []) {
    if (part.type !== "reference" || part.ref_type !== "asset") {
      continue;
    }
    const connection = part.ref_origin_id
      ? connectionByReference.get(
          connectedReferencePartKey(part.ref_origin_id, part.ref_id),
        )
      : undefined;
    const item = connection
      ? connectedReferenceItem(items, connection.source)
      : items.find(
          (candidate) =>
            Number(candidate.refId || 0) === Number(part.ref_id || 0) &&
            (!part.ref_version_id ||
              Number(candidate.versionID || 0) === Number(part.ref_version_id)),
        );
    const kind = connection
      ? canvasMediaReferenceKind(connection.source)
      : normalizeCanvasMediaKind(item?.kind);
    if (kind !== "image") {
      continue;
    }
    if (connection) {
      includedReferences.add(
        connectedReferencePartKey(
          connection.edge.id,
          connectedMediaReferenceAssetID(connection),
        ),
      );
    }
    const mediaCount = connection
      ? canvasMediaReferenceAmount(connection.source)
      : composerMediaReferenceAmount(item, "image", part.ref_media_count);
    references.push({
      amount: selectedMediaReferenceAmount(part, mediaCount),
      usage: String(part.usage || connection?.edge.mediaUsage || ""),
      structured: isStructuredImageReference(connection?.source, item),
    });
  }
  for (const connection of connections) {
    const referenceKey = connectedReferencePartKey(
      connection.edge.id,
      connectedMediaReferenceAssetID(connection),
    );
    if (
      includedReferences.has(referenceKey) ||
      canvasMediaReferenceKind(connection.source) !== "image"
    ) {
      continue;
    }
    references.push({
      amount: canvasMediaReferenceAmount(connection.source),
      usage: String(connection.edge.mediaUsage || ""),
      structured: isStructuredImageReference(connection.source),
    });
  }
  const connectedSourceIDs = new Set(
    connections.map((connection) => connection.source.id),
  );
  for (const source of additionalSources) {
    if (
      connectedSourceIDs.has(source.id) ||
      canvasMediaReferenceKind(source) !== "image"
    ) {
      continue;
    }
    references.push({
      amount: canvasMediaReferenceAmount(source),
      usage: "",
      structured: isStructuredImageReference(source),
    });
  }
  return references;
}

function isStructuredImageReference(
  source?: SpaceCanvasNode,
  item?: ComposerAssetItem,
) {
  return Boolean(
    source?.storyboardItem?.itemType === "shot_image" ||
    parseStoryboardGridOutput([
      source?.asset?.version?.content,
      source?.resultOutput,
      item?.output,
      item?.asset,
    ]),
  );
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

function mediaUsageCandidatesForKind(
  options: MediaUsageOption[],
  kind: CanvasMediaKind,
  multiImageMode?: CanvasMultiImageMode,
) {
  const matching = options.filter((option) =>
    option.acceptedKinds.includes(kind),
  );
  if (kind !== "image" || !multiImageMode) {
    return matching;
  }
  const generic = matching.filter((option) => !isFrameMediaUsageOption(option));
  if (multiImageMode === "shared_reference") {
    return prioritizeMediaUsageOptions(generic.length > 0 ? generic : matching);
  }
  const firstFrame = matching.filter(
    (option) => isFirstFrameUsage(option.key) || option.label.includes("首帧"),
  );
  return firstFrame.length > 0
    ? prioritizeMediaUsageOptions(firstFrame)
    : prioritizeMediaUsageOptions(generic);
}

export function filterMediaUsageOptionsForMultiImageMode(
  options: MediaUsageOption[],
  multiImageMode?: CanvasMultiImageMode,
) {
  if (!multiImageMode) {
    return options;
  }
  const allowed = new Set<MediaUsageOption>();
  for (const kind of ["image", "video", "audio", "file"] as const) {
    for (const option of mediaUsageCandidatesForKind(
      options,
      kind,
      multiImageMode,
    )) {
      allowed.add(option);
    }
  }
  return options.filter((option) => allowed.has(option));
}

function canCombineImageReferences(
  candidates: MediaUsageOption[],
  imageCount: number,
) {
  let remaining = imageCount;
  for (const option of candidates) {
    const capacity = mediaUsageCapacity(option);
    if (capacity <= 0) {
      return true;
    }
    remaining -= capacity;
    if (remaining <= 0) {
      return true;
    }
  }
  return false;
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
  multiImageMode?: CanvasMultiImageMode,
) {
  const connectedPartByKey = new Map(
    (content?.parts || []).flatMap((part) =>
      part.type === "reference" &&
      part.ref_type === "asset" &&
      part.ref_origin === "edge" &&
      part.ref_origin_id
        ? [
            [
              connectedReferencePartKey(part.ref_origin_id, part.ref_id),
              part,
            ] as const,
          ]
        : [],
    ),
  );
  const entries: MediaUsageValidationEntry[] = connections.flatMap(
    (connection) => {
      const kind = canvasMediaReferenceKind(connection.source);
      if (!kind) {
        return [];
      }
      const mediaCount = canvasMediaReferenceAmount(connection.source);
      const part = connectedPartByKey.get(
        connectedReferencePartKey(
          connection.edge.id,
          connectedMediaReferenceAssetID(connection),
        ),
      );
      return [
        {
          referenceKey: connectedMediaReferenceKey(connection),
          label: mediaReferenceLabel(connection),
          kind,
          amount: selectedMediaReferenceAmount(part, mediaCount),
          mediaCount,
          mediaSelected: mediaReferencePartHasSelection(part),
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
      amount: selectedMediaReferenceAmount(
        part,
        composerMediaReferenceAmount(item, kind, part.ref_media_count),
      ),
      mediaCount: composerMediaReferenceAmount(
        item,
        kind,
        part.ref_media_count,
      ),
      mediaSelected: mediaReferencePartHasSelection(part),
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
    const candidates = mediaUsageCandidatesForKind(
      options,
      entry.kind,
      multiImageMode,
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
    const independentImageInvocation =
      entry.kind === "image" && multiImageMode === "per_image";
    const amount = independentImageInvocation ? 1 : entry.amount;
    const remainingCapacity =
      mediaUsageCapacity(option) > 0
        ? Math.max(
            mediaUsageCapacity(option) - (counts.get(option.key) || 0),
            0,
          )
        : 0;
    if (
      !independentImageInvocation &&
      !entry.mediaSelected &&
      entry.mediaCount > 1 &&
      mediaUsageCapacity(option) > 0 &&
      entry.mediaCount > remainingCapacity
    ) {
      return `「${entry.label}」包含 ${entry.mediaCount} 项素材，请从引用中选择具体素材`;
    }
    if (!canAssignMediaUsage(option, counts, amount)) {
      return `${option.label}参数最多接收 ${mediaUsageCapacity(option)} 个素材`;
    }
    if (!independentImageInvocation) {
      incrementMediaUsage(counts, option.key, amount);
    }
  }
  return "";
}

export function nextMediaUsageForSources(
  connections: CanvasConnectedMediaReference[],
  options: MediaUsageOption[],
  sources: SpaceCanvasNode[],
  content?: CanvasReferenceContent,
  items: ComposerAssetItem[] = [],
  multiImageMode?: CanvasMultiImageMode,
) {
  const mediaSources = sources.filter(isCanvasMediaReferenceNode);
  const kinds = mediaSources.flatMap((source) => {
    const kind = canvasMediaReferenceKind(source);
    return kind ? [kind] : [];
  });
  const candidates = prioritizeMediaUsageOptions(
    options.filter((option) =>
      kinds.every((kind) =>
        mediaUsageCandidatesForKind([option], kind, multiImageMode).includes(
          option,
        ),
      ),
    ),
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
  const counts = mediaUsageCounts(
    connections,
    options,
    content,
    items,
    multiImageMode,
  );
  const minimumSelectableAmount =
    multiImageMode === "per_image" && kinds.every((kind) => kind === "image")
      ? 1
      : mediaSources.reduce(
          (total, source) => total + canvasMediaReferenceAmount(source),
          0,
        );
  const option = firstAvailableMediaUsageForAmount(
    candidates,
    counts,
    minimumSelectableAmount,
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
  multiImageMode?: CanvasMultiImageMode,
): CanvasMediaUsageReconciliation {
  if (!next || options.length === 0) {
    return { content: next, assignments: {} };
  }

  const previousByKey = new Map(
    indexedMediaReferenceParts(
      previous,
      items,
      connections,
      multiImageMode,
    ).map((entry) => [entry.key, entry] as const),
  );
  const entries = indexedMediaReferenceParts(
    next,
    items,
    connections,
    multiImageMode,
  );
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
    const candidates = mediaUsageCandidatesForKind(
      options,
      entry.kind,
      multiImageMode,
    );
    const requestedUsage =
      entry.usage && entry.usage !== previousEntry?.usage ? entry.usage : "";
    const option = firstAvailableMediaUsageForAmount(
      candidates,
      counts,
      entry.kind === "image" && multiImageMode === "per_image"
        ? 1
        : entry.amount,
      requestedUsage,
      previousEntry?.usage || entry.usage,
    );
    const usage = option?.key || "";
    if (usage) {
      if (!(entry.kind === "image" && multiImageMode === "per_image")) {
        incrementMediaUsage(counts, usage, entry.amount);
      }
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
  items: ComposerAssetItem[] = [],
  multiImageMode?: CanvasMultiImageMode,
) {
  const counts = new Map<string, number>();
  const indexedEntries = indexedMediaReferenceParts(
    content,
    items,
    connections,
    multiImageMode,
  );
  const indexedConnections = new Set<string>();
  for (const entry of indexedEntries) {
    const option = options.find((candidate) => candidate.key === entry.usage);
    if (option && !(entry.kind === "image" && multiImageMode === "per_image")) {
      incrementMediaUsage(counts, option.key, entry.amount);
    }
    if (entry.connection) {
      indexedConnections.add(
        connectedReferencePartKey(
          entry.connection.edge.id,
          connectedMediaReferenceAssetID(entry.connection),
        ),
      );
    }
  }
  for (const connection of connections) {
    const connectionKey = connectedReferencePartKey(
      connection.edge.id,
      connectedMediaReferenceAssetID(connection),
    );
    if (indexedConnections.has(connectionKey)) {
      continue;
    }
    const usage = String(connection.edge.mediaUsage || "");
    const option = options.find((candidate) => candidate.key === usage);
    if (
      option &&
      !(
        canvasMediaReferenceKind(connection.source) === "image" &&
        multiImageMode === "per_image"
      )
    ) {
      incrementMediaUsage(
        counts,
        option.key,
        canvasMediaReferenceAmount(connection.source),
      );
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
  amount: number;
  usage: string;
  connection?: CanvasConnectedMediaReference;
};

function indexedMediaReferenceParts(
  content: CanvasReferenceContent | undefined,
  items: ComposerAssetItem[],
  connections: CanvasConnectedMediaReference[],
  multiImageMode?: CanvasMultiImageMode,
): IndexedMediaReferencePart[] {
  if (!content) {
    return [];
  }
  const connectionByReference = new Map(
    connections.map((connection) => [
      connectedReferencePartKey(
        connection.edge.id,
        connectedMediaReferenceAssetID(connection),
      ),
      connection,
    ]),
  );
  const occurrences = new Map<string, number>();
  return content.parts.flatMap((part, partIndex) => {
    if (part.type !== "reference" || part.ref_type !== "asset") {
      return [];
    }
    const connection = part.ref_origin_id
      ? connectionByReference.get(
          connectedReferencePartKey(part.ref_origin_id, part.ref_id),
        )
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
      ? `edge:${connectedReferencePartKey(
          connection.edge.id,
          connectedMediaReferenceAssetID(connection),
        )}`
      : `asset:${part.ref_id}:${part.ref_version_id || 0}`;
    const occurrence = occurrences.get(identity) || 0;
    occurrences.set(identity, occurrence + 1);
    return [
      {
        key: connection ? identity : `${identity}:${occurrence}`,
        partIndex,
        kind,
        amount:
          kind === "image" && multiImageMode === "per_image"
            ? 1
            : connection
              ? selectedMediaReferenceAmount(
                  part,
                  canvasMediaReferenceAmount(connection.source),
                )
              : selectedMediaReferenceAmount(
                  part,
                  composerMediaReferenceAmount(
                    item,
                    kind,
                    part.ref_media_count,
                  ),
                ),
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
  return capacity <= 0 || (counts.get(option.key) || 0) + amount <= capacity;
}

function incrementMediaUsage(
  counts: Map<string, number>,
  usage: string,
  amount = 1,
) {
  counts.set(usage, (counts.get(usage) || 0) + amount);
}

export function canvasPrimaryMediaURLs(value: unknown, kind: CanvasMediaKind) {
  return canvasPrimaryMediaItems(value, kind).map((item) => item.url);
}

export function canvasPrimaryMediaItems(value: unknown, kind: CanvasMediaKind) {
  if (kind === "image") {
    const storyboardImages = storyboardGridImageURLs(value);
    if (storyboardImages.length > 0) {
      return storyboardImages.map((url) => ({ url, thumbnail: url }));
    }
  }
  return findAssetMediaItems(value, kind);
}

function canvasMediaReferenceAmount(node?: SpaceCanvasNode) {
  const kind = canvasMediaReferenceKind(node);
  if (!node || !kind || kind === "file") {
    return 1;
  }
  return Math.max(
    1,
    canvasPrimaryMediaURLs(
      [node.asset?.version?.content, node.resultOutput],
      kind,
    ).length,
  );
}

function composerMediaReferenceAmount(
  item: ComposerAssetItem | undefined,
  kind: CanvasMediaKind,
  declaredCount = 0,
) {
  if (!item || kind === "file") {
    return Math.max(1, declaredCount);
  }
  return Math.max(
    1,
    declaredCount,
    canvasPrimaryMediaURLs(item.output, kind).length,
  );
}

function mediaReferencePartHasSelection(
  part:
    | Extract<CanvasReferenceContent["parts"][number], { type: "reference" }>
    | undefined,
) {
  return Boolean(
    (part?.ref_media_items?.length || 0) > 0 ||
    String(part?.ref_media_url || "").trim() ||
    Number(part?.ref_media_index || 0) > 0,
  );
}

export function selectedMediaReferenceAmount(
  part:
    | Extract<CanvasReferenceContent["parts"][number], { type: "reference" }>
    | undefined,
  mediaCount: number,
) {
  if ((part?.ref_media_items?.length || 0) > 0) {
    return part?.ref_media_items?.length || 0;
  }
  return mediaReferencePartHasSelection(part) ? 1 : Math.max(1, mediaCount);
}

function connectedReferencePartKey(edgeID: string, assetID: number) {
  return `${String(edgeID || "")}:${Number(assetID || 0)}`;
}

function connectedMediaReferenceAssetID(
  connection: CanvasConnectedMediaReference,
) {
  return Number(
    connection.source.asset?.id || connection.source.resultRef?.asset_id || 0,
  );
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

function connectedMediaReferenceKey(connection: CanvasConnectedMediaReference) {
  const assetID = Number(
    connection.source.asset?.id || connection.source.resultRef?.asset_id || 0,
  );
  return assetID > 0 ? `asset:${assetID}` : `node:${connection.source.id}`;
}

export function connectedReferenceItem(
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
