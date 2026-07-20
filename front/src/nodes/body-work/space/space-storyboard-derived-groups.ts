import { reconcileCanvasGroupEdges } from "./space-group-model";
import {
  audioPowerNodeSizeUpgrade,
  createLocalNode,
  nextCanvasNodeNo,
  powerNodeDefaultSize,
} from "./space-model";
import { isStoryboardPowerType } from "./space-power-presentation";
import {
  canvasReferenceContentFromText,
  canvasReferenceContentHasReferences,
} from "./space-reference-content";
import {
  expandStoryboardDerivedGroup,
  nextStoryboardDerivedNodePosition,
  planStoryboardDerivedGroupLayout,
  storyboardDerivedLayoutUpgradeMemberOffsets,
  type StoryboardDerivedGroupLayout,
} from "./space-storyboard-derived-layout";
import {
  STORYBOARD_DERIVED_GROUP_SPECS,
  type StoryboardDerivedGroupSpec,
  type StoryboardDerivedItem,
  type StoryboardDerivedOptions,
  type StoryboardPowerKind,
} from "./space-storyboard-derived-specs";
import {
  isStoryboardConfirmed,
  parseStoryboardOutput,
  storyboardMaterialReferenceNames,
  type StoryboardDocument,
} from "./space-storyboard";
import { storyboardVideoComposition } from "./space-storyboard-composition";
import type {
  AssetCate,
  CanvasStoryboardItemConfig,
  CanvasStoryboardItemType,
  PowerOption,
  SpaceCanvasEdge,
  SpaceCanvasNode,
  SpaceCanvasState,
} from "./types";

export function firstAvailablePower(
  powers: PowerOption[],
  kind: StoryboardPowerKind,
  outputType: string,
) {
  const normalizedOutputType = normalizeOutputType(outputType);
  return (
    powers.find(
      (power) =>
        Number(power.id || 0) > 0 &&
        String(power.kind || "")
          .trim()
          .toLowerCase() === kind &&
        normalizeOutputType(power.outputType) === normalizedOutputType,
    ) || null
  );
}

export function syncCanvasStoryboardDerivedGroups(input: {
  canvas: SpaceCanvasState;
  assetCate: AssetCate;
  powers: PowerOption[];
}) {
  let canvas = input.canvas;
  for (const sourceNode of input.canvas.nodes) {
    if (
      sourceNode.type !== "power" ||
      !isStoryboardPowerType(
        sourceNode.power,
        sourceNode.kind,
        sourceNode.outputType,
      )
    ) {
      continue;
    }
    const storyboard = parseStoryboardOutput([
      sourceNode.asset?.version?.content,
      sourceNode.resultOutput,
    ]);
    if (!storyboard) {
      continue;
    }
    if (!isStoryboardConfirmed(storyboard)) {
      continue;
    }
    const currentSourceNode =
      canvas.nodes.find((node) => node.id === sourceNode.id) || sourceNode;
    canvas = syncStoryboardDerivedGroups({
      canvas,
      storyboardNode: currentSourceNode,
      storyboard,
      assetCate: input.assetCate,
      powers: input.powers,
    });
  }
  return canvas;
}

export function syncStoryboardDerivedGroups(input: {
  canvas: SpaceCanvasState;
  storyboardNode: SpaceCanvasNode;
  storyboard: StoryboardDocument;
  assetCate: AssetCate;
  powers: PowerOption[];
}) {
  const nodes = [...input.canvas.nodes];
  const options = storyboardDerivedOptions(input.storyboardNode);
  const activeItemKeys = new Set<string>();
  const syncedItemTypes = new Set<CanvasStoryboardItemType>(
    STORYBOARD_DERIVED_GROUP_SPECS.map((spec) => spec.itemType),
  );
  const enabledSpecs = STORYBOARD_DERIVED_GROUP_SPECS.filter((spec) =>
    spec.enabled(input.storyboard, options),
  );
  syncedItemTypes.add("video_compose");
  activeItemKeys.add(
    storyboardItemKey(
      input.storyboardNode.id,
      "video_compose",
      "composition",
    ),
  );
  const derivedGroups = enabledSpecs.map((spec) => ({
    spec,
    items: spec.items(input.storyboard, options),
    power: firstAvailablePower(
      input.powers,
      spec.powerKind,
      spec.outputType,
    ),
    existing: findDerivedGroup(nodes, input.storyboardNode.id, spec.key),
  }));
  const layouts = planStoryboardDerivedGroupLayout({
    sourceNode: input.storyboardNode,
    groups: derivedGroups.map(({ spec, items, power, existing }) => ({
      key: spec.key,
      layoutIndex: spec.layoutIndex,
      itemCount: items.length,
      power,
      powerKind: spec.powerKind,
      direction: spec.direction,
      currentSize: existing
        ? { width: existing.width, height: existing.height }
        : undefined,
      currentLayoutKey: existing?.group?.layoutKey,
    })),
  });
  const storyboardReferenceLabels = storyboardMaterialReferenceNames(
    input.storyboard,
  );
  let nextNodeNo = nextCanvasNodeNo(nodes, input.canvas.nextNodeNo);
  let changed = nextNodeNo !== input.canvas.nextNodeNo;

  for (const { spec, items, power } of derivedGroups) {
    const layout = layouts.get(spec.key);
    if (!layout) {
      continue;
    }
    const group = ensureDerivedGroup({
      nodes,
      storyboardNode: input.storyboardNode,
      spec,
      layout,
      assetCate: input.assetCate,
      power,
    });
    changed = changed || group.changed;

    for (const sourceItem of items) {
      const item = withStoryboardItemContext(
        sourceItem,
        nodes,
        input.storyboardNode.id,
      );
      activeItemKeys.add(
        storyboardItemKey(input.storyboardNode.id, item.type, item.id),
      );
      const existingIndex = nodes.findIndex((node) =>
        isMatchingDerivedNode(
          node,
          input.storyboardNode.id,
          item.type,
          item.id,
        ),
      );
      if (existingIndex >= 0) {
        const existing = nodes[existingIndex];
        const next = mergeExistingDerivedNode(
          existing,
          group.node.id,
          item,
          storyboardReferenceLabels,
          spec,
          power,
        );
        if (next !== existing) {
          nodes[existingIndex] = next;
          changed = true;
        }
        continue;
      }
      const created = createDerivedNode({
        nodes,
        group: group.node,
        storyboardNode: input.storyboardNode,
        item,
        assetCate: input.assetCate,
        spec,
        power,
      });
      created.nodeNo = nextNodeNo++;
      nodes.push(created);
      changed = true;
    }

    const resizedGroup = expandStoryboardDerivedGroup(group.node, nodes);
    if (resizedGroup !== group.node) {
      const groupNodeIndex = nodes.findIndex(
        (node) => node.id === group.node.id,
      );
      nodes[groupNodeIndex] = resizedGroup;
      changed = true;
    }
  }

  for (const [index, node] of nodes.entries()) {
    const metadata = node.storyboardItem;
    if (
      !metadata ||
      metadata.sourceNodeId !== input.storyboardNode.id ||
      !syncedItemTypes.has(metadata.itemType) ||
      activeItemKeys.has(
        storyboardItemKey(
          metadata.sourceNodeId,
          metadata.itemType,
          metadata.itemId,
        ),
      )
    ) {
      continue;
    }
    if (metadata.stale && !node.groupId) {
      continue;
    }
    nodes[index] = {
      ...node,
      groupId: undefined,
      storyboardItem: { ...metadata, stale: true },
    };
    changed = true;
  }

  const enabledGroupKeys = new Set(enabledSpecs.map((spec) => spec.key));
  for (let index = nodes.length - 1; index >= 0; index -= 1) {
    const node = nodes[index];
    if (
      node.type !== "group" ||
      node.group?.origin !== "script" ||
      node.group.sourceNodeId !== input.storyboardNode.id ||
      !node.group.syncKey ||
      enabledGroupKeys.has(
        node.group.syncKey as StoryboardDerivedGroupSpec["key"],
      )
    ) {
      continue;
    }
    nodes.splice(index, 1);
    changed = true;
  }

  const composition = syncStoryboardCompositionNode({
    nodes,
    storyboardNode: input.storyboardNode,
    storyboard: input.storyboard,
    options,
    assetCate: input.assetCate,
    power: firstAvailablePower(input.powers, "video", "video_compose"),
    nextNodeNo,
  });
  nextNodeNo = composition.nextNodeNo;
  changed = changed || composition.changed;

  let edges = ensureDerivedGroupEdges(
    input.canvas.edges,
    nodes,
    input.storyboardNode.id,
    enabledSpecs,
  );
  edges = ensureStoryboardCompositionEdges(
    edges,
    nodes,
    input.storyboardNode.id,
    composition.node.id,
    enabledSpecs,
  );
  if (edges !== input.canvas.edges) {
    changed = true;
  }
  return changed ? { ...input.canvas, nextNodeNo, nodes, edges } : input.canvas;
}

function withStoryboardItemContext(
  item: StoryboardDerivedItem,
  nodes: SpaceCanvasNode[],
  sourceNodeId: string,
) {
  const sourceNodes = (item.sourceItems || [])
    .map((source) =>
      nodes.find(
        (node) =>
          !node.storyboardItem?.stale &&
          isMatchingDerivedNode(
            node,
            sourceNodeId,
            source.type,
            source.id,
          ),
      ),
    )
    .filter((node): node is SpaceCanvasNode => Boolean(node));
  const sourceNodeIds = sourceNodes.map((node) => node.id);
  const withSources = sourceNodeIds.length
    ? {
        ...item,
        sourceNodeIds,
        sourceSignatureParts: sourceNodes.map(storyboardSourceNodeSignature),
      }
    : item;
  if (item.type === "lip_sync") {
    const referenceNodes = sourceNodes.filter(
      (node) =>
        Number(node.asset?.id || 0) > 0 &&
        Number(node.asset?.version_id || node.asset?.version?.id || 0) > 0,
    );
    if (!referenceNodes.length) {
      return withSources;
    }
    const prompt = `${referenceNodes
      .map((node) => `@${node.title}`)
      .join(" ")} ${item.prompt}`.trim();
    const content = canvasReferenceContentFromText(
      prompt,
      referenceNodes.map((node) => ({
        refType: "asset" as const,
        refId: Number(node.asset?.id),
        versionId: Number(node.asset?.version_id || node.asset?.version?.id),
        label: node.title,
      })),
    );
    return canvasReferenceContentHasReferences(content)
      ? { ...withSources, prompt, promptContent: content }
      : { ...withSources, prompt };
  }
  if (item.type === "shot_frame") {
    const content = canvasReferenceContentFromText(
      item.prompt,
      sourceNodes
        .filter(
          (node) =>
            ["character", "scene", "prop"].includes(
              node.storyboardItem?.itemType || "",
            ) &&
            Number(node.asset?.id || 0) > 0 &&
            Number(node.asset?.version_id || node.asset?.version?.id || 0) > 0,
        )
        .map((node) => ({
          refType: "asset" as const,
          refId: Number(node.asset?.id),
          versionId: Number(node.asset?.version_id || node.asset?.version?.id),
          label: node.title,
        })),
    );
    return canvasReferenceContentHasReferences(content)
      ? { ...withSources, promptContent: content }
      : withSources;
  }
  if (item.type !== "shot") {
    return withSources;
  }
  const frameNodes = sourceNodes.filter(
    (node) =>
      node.storyboardItem?.itemType === "shot_frame" &&
      Number(node.asset?.id || 0) > 0 &&
      Number(node.asset?.version_id || node.asset?.version?.id || 0) > 0,
  );
  if (!frameNodes.length) {
    return withSources;
  }
  const prompt = `${frameNodes
    .map((node) => `@${node.title}`)
    .join(" ")} ${item.prompt}`.trim();
  const content = canvasReferenceContentFromText(
    prompt,
    frameNodes.map((node) => ({
      refType: "asset" as const,
      refId: Number(node.asset?.id),
      versionId: Number(node.asset?.version_id || node.asset?.version?.id),
      label: node.title,
    })),
  );
  return canvasReferenceContentHasReferences(content)
    ? { ...withSources, prompt, promptContent: content }
    : { ...withSources, prompt };
}

function ensureDerivedGroup(input: {
  nodes: SpaceCanvasNode[];
  storyboardNode: SpaceCanvasNode;
  spec: StoryboardDerivedGroupSpec;
  layout: StoryboardDerivedGroupLayout;
  assetCate: AssetCate;
  power?: PowerOption | null;
}) {
  const existing = findDerivedGroup(
    input.nodes,
    input.storyboardNode.id,
    input.spec.key,
  );
  if (existing) {
    const titleChanged = existing.title !== input.spec.title;
    if (existing.group?.layoutKey === input.layout.layoutKey && !titleChanged) {
      return { node: existing, changed: false };
    }
    if (existing.group?.layoutKey === input.layout.layoutKey) {
      const renamed = { ...existing, title: input.spec.title };
      input.nodes[input.nodes.indexOf(existing)] = renamed;
      return { node: renamed, changed: true };
    }
    const memberOffsets = storyboardDerivedLayoutUpgradeMemberOffsets({
      currentLayoutKey: existing.group?.layoutKey,
      nextLayoutKey: input.layout.layoutKey,
      group: existing,
      members: input.nodes.filter((node) => node.groupId === existing.id),
      nodeSize: powerNodeDefaultSize(
        input.power || {
          kind: input.spec.powerKind,
          outputType: input.spec.outputType,
        },
      ),
      powerKind: input.spec.powerKind,
    });
    const deltaX = input.layout.bounds.x - existing.x;
    const deltaY = input.layout.bounds.y - existing.y;
    let movedGroup = existing;
    for (const [index, node] of input.nodes.entries()) {
      if (node.id !== existing.id && node.groupId !== existing.id) {
        continue;
      }
      const moved = {
        ...node,
        ...(node.groupId === existing.id
          ? audioPowerNodeSizeUpgrade(node) || {}
          : {}),
        x:
          node.x +
          deltaX +
          (node.groupId === existing.id
            ? memberOffsets?.get(node.id)?.x || 0
            : 0),
        y:
          node.y +
          deltaY +
          (node.groupId === existing.id
            ? memberOffsets?.get(node.id)?.y || 0
            : 0),
        ...(node.id === existing.id
          ? {
              title: input.spec.title,
              width: input.layout.bounds.width,
              height: input.layout.bounds.height,
              group: {
                ...(node.group || {}),
                layoutKey: input.layout.layoutKey,
              },
            }
          : {}),
      };
      input.nodes[index] = moved;
      if (node.id === existing.id) {
        movedGroup = moved;
      }
    }
    return { node: movedGroup, changed: true };
  }

  const bounds = input.layout.bounds;
  const group = createLocalNode("group", input.assetCate, input.nodes.length, {
    x: bounds.x,
    y: bounds.y,
  });
  group.id = uniqueNodeId(
    input.nodes,
    `script-group-${stableToken(input.storyboardNode.id)}-${input.spec.key}`,
  );
  group.title = input.spec.title;
  group.width = bounds.width;
  group.height = bounds.height;
  group.group = {
    origin: "script",
    sourceNodeId: input.storyboardNode.id,
    syncKey: input.spec.key,
    layoutKey: input.layout.layoutKey,
  };
  input.nodes.push(group);
  return { node: group, changed: true };
}

function findDerivedGroup(
  nodes: SpaceCanvasNode[],
  storyboardNodeId: string,
  syncKey: string,
) {
  return nodes.find(
    (node) =>
      node.type === "group" &&
      node.group?.origin === "script" &&
      node.group.sourceNodeId === storyboardNodeId &&
      node.group.syncKey === syncKey,
  );
}

function createDerivedNode(input: {
  nodes: SpaceCanvasNode[];
  group: SpaceCanvasNode;
  storyboardNode: SpaceCanvasNode;
  item: StoryboardDerivedItem;
  assetCate: AssetCate;
  spec: StoryboardDerivedGroupSpec;
  power?: PowerOption | null;
}) {
  const node = createLocalNode(
    "power",
    input.assetCate,
    input.nodes.length,
    { x: input.group.x, y: input.group.y },
    input.power ? { power: input.power } : undefined,
  );
  node.id = uniqueNodeId(
    input.nodes,
    `script-item-${stableToken(
      storyboardItemKey(
        input.storyboardNode.id,
        input.item.type,
        input.item.id,
      ),
    )}`,
  );
  node.title = input.item.title;
  node.description = input.item.prompt;
  node.kind = input.spec.powerKind;
  node.outputType = input.spec.outputType;
  if (!input.power) {
    Object.assign(
      node,
      powerNodeDefaultSize({
        kind: input.spec.powerKind,
        outputType: input.spec.outputType,
      }),
    );
  }
  if (!input.power) {
    node.subtitle = `未配置${derivedPowerLabel(input.spec)}能力`;
    node.description = `${node.subtitle}。配置并启用能力后可运行此条目。`;
  }
  node.groupId = input.group.id;
  node.composerDraft = {
    prompt: input.item.prompt,
    promptContent: input.item.promptContent,
  };
  node.storyboardItem = storyboardItemMetadata(
    input.storyboardNode.id,
    input.item,
  );
  const position = nextStoryboardDerivedNodePosition(
    input.group,
    input.nodes,
    node,
  );
  node.x = position.x;
  node.y = position.y;
  return node;
}

function mergeExistingDerivedNode(
  node: SpaceCanvasNode,
  groupId: string,
  item: StoryboardDerivedItem,
  referenceLabels: string[],
  spec: StoryboardDerivedGroupSpec,
  power?: PowerOption | null,
) {
  const metadata = node.storyboardItem;
  if (!metadata) {
    return node;
  }
  const previousSourceSignature =
    metadata.sourceSignature ||
    storyboardDerivedSourceSignature({
      ...item,
      prompt: metadata.generatedPrompt,
      promptContent: node.composerDraft?.promptContent,
    });
  const currentPrompt = String(node.composerDraft?.prompt || "");
  const frameReference =
    item.type === "shot"
      ? item.promptContent?.parts.find((part) => part.type === "reference")
      : undefined;
  const hasFrameReference = Boolean(
    frameReference &&
    node.composerDraft?.promptContent?.parts.some(
      (part) =>
        part.type === "reference" &&
        part.ref_type === frameReference.ref_type &&
        part.ref_id === frameReference.ref_id,
    ),
  );
  const migrateFrameReference = Boolean(frameReference && !hasFrameReference);
  const lostGeneratedReferences =
    metadata.itemType === "shot" &&
    metadata.generatedPrompt.includes("@") &&
    currentPrompt ===
      promptWithoutMaterialReferences(
        metadata.generatedPrompt,
        referenceLabels,
      ) &&
    node.description === metadata.generatedPrompt;
  const shouldRefreshPrompt =
    !currentPrompt.trim() ||
    currentPrompt === metadata.generatedPrompt ||
    lostGeneratedReferences;
  const nextPrompt = shouldRefreshPrompt
    ? item.prompt
    : migrateFrameReference && frameReference
      ? promptWithFrameReference(
          currentPrompt,
          frameReference.label,
          referenceLabels,
        )
      : currentPrompt;
  const promptChanged = nextPrompt !== currentPrompt;
  const nextParamValues = promptChanged
    ? replaceGeneratedPromptParamValues(
        node.composerDraft?.paramValues,
        currentPrompt,
        nextPrompt,
      )
    : node.composerDraft?.paramValues;
  const paramValuesChanged =
    nextParamValues !== node.composerDraft?.paramValues;
  const nextPromptContent =
    shouldRefreshPrompt || !migrateFrameReference || !frameReference
      ? shouldRefreshPrompt
        ? item.promptContent
        : node.composerDraft?.promptContent
      : canvasReferenceContentFromText(nextPrompt, [
          {
            refType: frameReference.ref_type,
            refId: frameReference.ref_id,
            label: frameReference.label,
            trigger: "@",
            versionId: frameReference.ref_version_id,
          },
        ]);
  const promptContentChanged =
    JSON.stringify(node.composerDraft?.promptContent || null) !==
    JSON.stringify(nextPromptContent || null);
  const nextMetadata = storyboardItemMetadata(metadata.sourceNodeId, item);
  const hasGeneratedResult = derivedNodeHasGeneratedResult(node);
  const resultSourceSignature =
    metadata.resultSourceSignature ||
    (hasGeneratedResult ? previousSourceSignature : "");
  if (resultSourceSignature) {
    nextMetadata.resultSourceSignature = resultSourceSignature;
  }
  nextMetadata.stale = Boolean(
    hasGeneratedResult &&
      resultSourceSignature !== nextMetadata.sourceSignature,
  );
  const titleChanged = node.title !== item.title;
  const attachPower = !node.power && Boolean(power);
  const kindChanged = node.kind !== spec.powerKind;
  const outputTypeChanged = node.outputType !== spec.outputType;
  if (
    node.groupId === groupId &&
    !promptChanged &&
    !paramValuesChanged &&
    !promptContentChanged &&
    !titleChanged &&
    !attachPower &&
    !kindChanged &&
    !outputTypeChanged &&
    sameItemMetadata(metadata, nextMetadata)
  ) {
    return node;
  }
  return {
    ...node,
    title: item.title,
    kind: spec.powerKind,
    outputType: spec.outputType,
    ...(attachPower
      ? {
          power: power || undefined,
          subtitle:
            power?.output?.name || power?.name || node.subtitle,
        }
      : {}),
    description: promptChanged || attachPower ? nextPrompt : node.description,
    groupId,
    composerDraft:
      promptChanged || paramValuesChanged || promptContentChanged
        ? {
            ...(node.composerDraft || {}),
            prompt: nextPrompt,
            promptContent: nextPromptContent,
            paramValues: nextParamValues,
          }
        : node.composerDraft,
    storyboardItem: nextMetadata,
  };
}

function derivedNodeHasGeneratedResult(node: SpaceCanvasNode) {
  return Boolean(
    Number(node.resultRef?.version_id || 0) > 0 ||
      Number(node.asset?.version_id || node.asset?.version?.id || 0) > 0 ||
      node.resultOutput != null,
  );
}

function promptWithFrameReference(
  prompt: string,
  frameLabel: string,
  materialLabels: string[],
) {
  const label = frameLabel.trim().replace(/^@+/, "");
  const mention = label ? `@${label}` : "";
  const content = materialLabels.reduce(
    (current, materialLabel) =>
      current.split(`@${materialLabel}`).join(materialLabel),
    prompt,
  );
  if (!mention || content.includes(mention)) {
    return content;
  }
  return `${mention} ${content}`.trim();
}

function promptWithoutMaterialReferences(
  prompt: string,
  referenceLabels: string[],
) {
  return referenceLabels.reduce(
    (current, label) => current.split(`@${label}`).join(""),
    prompt,
  );
}

function replaceGeneratedPromptParamValues(
  values: Record<string, unknown> | undefined,
  currentPrompt: string,
  nextPrompt: string,
) {
  if (!values || !currentPrompt || currentPrompt === nextPrompt) {
    return values;
  }
  let next: Record<string, unknown> | undefined;
  for (const [key, value] of Object.entries(values)) {
    if (value !== currentPrompt) {
      continue;
    }
    next ||= { ...values };
    next[key] = nextPrompt;
  }
  return next || values;
}

function storyboardItemMetadata(
  sourceNodeId: string,
  item: StoryboardDerivedItem,
): CanvasStoryboardItemConfig {
  return {
    sourceNodeId,
    itemType: item.type,
    itemId: item.id,
    generatedPrompt: item.prompt,
    sourceNodeIds: item.sourceNodeIds,
    shotId: item.shotId,
    frameRole: item.frameRole,
    speechId: item.speechId,
    speechIds: item.speechIds,
    characterId: item.characterId,
    speechKind: item.speechKind,
    speakerMode: item.speakerMode,
    startTime: item.startTime,
    shotDuration: item.shotDuration,
    sourceSignature: storyboardDerivedSourceSignature(item),
    stale: false,
  };
}

function storyboardDerivedSourceSignature(item: StoryboardDerivedItem) {
  return stableToken(
    JSON.stringify([
      item.prompt,
      item.promptContent || null,
      item.sourceSignatureParts || [],
      item.shotId || "",
      item.frameRole || "",
      item.speechId || "",
      item.speechIds || [],
      item.characterId || "",
      item.speechKind || "",
      item.speakerMode || "",
      item.startTime ?? null,
      item.shotDuration ?? null,
    ]),
  );
}

function sameItemMetadata(
  left: CanvasStoryboardItemConfig,
  right: CanvasStoryboardItemConfig,
) {
  return (
    left.sourceNodeId === right.sourceNodeId &&
    left.itemType === right.itemType &&
    left.itemId === right.itemId &&
    left.generatedPrompt === right.generatedPrompt &&
    sameStringList(left.sourceNodeIds, right.sourceNodeIds) &&
    left.shotId === right.shotId &&
    left.frameRole === right.frameRole &&
    left.speechId === right.speechId &&
    sameStringList(left.speechIds, right.speechIds) &&
    left.characterId === right.characterId &&
    left.speechKind === right.speechKind &&
    left.speakerMode === right.speakerMode &&
    left.startTime === right.startTime &&
    left.shotDuration === right.shotDuration &&
    left.sourceSignature === right.sourceSignature &&
    left.resultSourceSignature === right.resultSourceSignature &&
    Boolean(left.stale) === Boolean(right.stale)
  );
}

function isMatchingDerivedNode(
  node: SpaceCanvasNode,
  sourceNodeId: string,
  itemType: CanvasStoryboardItemType,
  itemId: string,
) {
  const metadata = node.storyboardItem;
  return Boolean(
    metadata &&
    metadata.sourceNodeId === sourceNodeId &&
    metadata.itemType === itemType &&
    metadata.itemId === itemId,
  );
}

function ensureDerivedGroupEdges(
  edges: SpaceCanvasEdge[],
  nodes: SpaceCanvasNode[],
  storyboardNodeId: string,
  specs: StoryboardDerivedGroupSpec[],
) {
  const groups = specs
    .map((spec) => ({
      spec,
      group: nodes.find(
        (node) =>
          node.type === "group" &&
          node.group?.origin === "script" &&
          node.group.sourceNodeId === storyboardNodeId &&
          node.group.syncKey === spec.key,
      ),
    }))
    .filter(
      (
        entry,
      ): entry is {
        spec: StoryboardDerivedGroupSpec;
        group: SpaceCanvasNode;
      } => Boolean(entry.group),
    );
  const groupIds = new Set(groups.map(({ group }) => group.id));
  const managedNodeIds = new Set([storyboardNodeId, ...groupIds]);
  const next = edges.filter((edge) => {
    const from = edge.logicalFrom || edge.from;
    const to = edge.logicalTo || edge.to;
    return !(managedNodeIds.has(from) && managedNodeIds.has(to));
  });
  for (const { spec, group } of groups) {
    const upstream = spec.direction === "upstream";
    const sourceGroups = (spec.sourceGroupKeys || [])
      .map((key) => findDerivedGroup(nodes, storyboardNodeId, key))
      .filter((node): node is SpaceCanvasNode => Boolean(node));
    const sources = upstream
      ? [group]
      : sourceGroups.length
        ? sourceGroups
        : [nodes.find((node) => node.id === storyboardNodeId)].filter(
            (node): node is SpaceCanvasNode => Boolean(node),
          );
    for (const source of sources) {
      const from = source.id;
      const to = upstream ? storyboardNodeId : group.id;
      next.push({
        id: uniqueEdgeId(
          next,
          `script-edge-${stableToken(storyboardNodeId)}-${spec.key}-${stableToken(from)}`,
        ),
        from,
        to,
        logicalFrom: from,
        logicalTo: to,
        executionMode: upstream ? undefined : "manual",
      });
    }
  }
  const reconciled = reconcileCanvasGroupEdges(nodes, next);
  return sameEdges(edges, reconciled) ? edges : reconciled;
}

function syncStoryboardCompositionNode(input: {
  nodes: SpaceCanvasNode[];
  storyboardNode: SpaceCanvasNode;
  storyboard: StoryboardDocument;
  options: StoryboardDerivedOptions;
  assetCate: AssetCate;
  power?: PowerOption | null;
  nextNodeNo: number;
}) {
  const existing = input.nodes.find((node) =>
    isMatchingDerivedNode(
      node,
      input.storyboardNode.id,
      "video_compose",
      "composition",
    ),
  );
  const videoComposition = storyboardVideoComposition({
    storyboard: input.storyboard,
    sourceNodeId: input.storyboardNode.id,
    nodes: input.nodes,
    enableLipSync: input.options.enableLipSync,
    current: existing?.composerDraft?.videoComposition,
  });
  const sourceNodeIds = input.nodes
    .filter(
      (node) =>
        node.storyboardItem?.sourceNodeId === input.storyboardNode.id &&
        ["shot", "speech", "lip_sync"].includes(
          node.storyboardItem.itemType,
        ) &&
        !node.storyboardItem.stale,
    )
    .map((node) => node.id);
  const sourceSignature = stableToken(JSON.stringify(videoComposition));
  const metadata: CanvasStoryboardItemConfig = {
    sourceNodeId: input.storyboardNode.id,
    itemType: "video_compose",
    itemId: "composition",
    generatedPrompt: "",
    sourceNodeIds,
    sourceSignature,
    stale: false,
  };

  if (existing) {
    const position = storyboardCompositionPosition(
      input.nodes,
      input.storyboardNode,
    );
    const hasResult = derivedNodeHasGeneratedResult(existing);
    const resultSourceSignature =
      existing.storyboardItem?.resultSourceSignature ||
      (hasResult ? existing.storyboardItem?.sourceSignature : "");
    if (resultSourceSignature) {
      metadata.resultSourceSignature = resultSourceSignature;
    }
    metadata.stale = Boolean(
      hasResult && resultSourceSignature !== sourceSignature,
    );
    const attachPower = !existing.power && Boolean(input.power);
    const compositionChanged =
      JSON.stringify(existing.composerDraft?.videoComposition || null) !==
      JSON.stringify(videoComposition);
    const positionChanged =
      existing.x !== position.x || existing.y !== position.y;
    if (
      !attachPower &&
      !compositionChanged &&
      !positionChanged &&
      existing.kind === "video" &&
      existing.outputType === "video_compose" &&
      sameItemMetadata(existing.storyboardItem!, metadata)
    ) {
      return {
        node: existing,
        changed: false,
        nextNodeNo: input.nextNodeNo,
      };
    }
    const updated: SpaceCanvasNode = {
      ...existing,
      x: position.x,
      y: position.y,
      kind: "video",
      outputType: "video_compose",
      ...(attachPower
        ? {
            power: input.power || undefined,
            subtitle:
              input.power?.output?.name || input.power?.name || "视频合成",
            description: "按镜头顺序合成画面、原声和配音。",
          }
        : {}),
      composerDraft: {
        ...(existing.composerDraft || {}),
        videoComposition,
      },
      storyboardItem: metadata,
    };
    input.nodes[input.nodes.indexOf(existing)] = updated;
    return {
      node: updated,
      changed: true,
      nextNodeNo: input.nextNodeNo,
    };
  }

  const position = storyboardCompositionPosition(
    input.nodes,
    input.storyboardNode,
  );
  const created = createLocalNode(
    "power",
    input.assetCate,
    input.nodes.length,
    position,
    input.power ? { power: input.power } : undefined,
  );
  created.id = uniqueNodeId(
    input.nodes,
    `script-compose-${stableToken(input.storyboardNode.id)}`,
  );
  created.nodeNo = input.nextNodeNo;
  created.title = "视频合成";
  created.kind = "video";
  created.outputType = "video_compose";
  created.description = "按镜头顺序合成画面、原声和配音。";
  if (!input.power) {
    created.subtitle = "未配置视频合成能力";
    created.description = "未配置视频合成能力。配置并启用后可生成最终视频。";
  }
  created.composerDraft = { videoComposition };
  created.storyboardItem = metadata;
  input.nodes.push(created);
  return {
    node: created,
    changed: true,
    nextNodeNo: input.nextNodeNo + 1,
  };
}

function storyboardCompositionPosition(
  nodes: SpaceCanvasNode[],
  storyboardNode: SpaceCanvasNode,
) {
  const downstreamRight = nodes
    .filter(
      (node) =>
        node.type === "group" &&
        node.group?.origin === "script" &&
        node.group.sourceNodeId === storyboardNode.id,
    )
    .reduce(
      (right, group) => Math.max(right, group.x + group.width),
      storyboardNode.x + storyboardNode.width + 160,
    );
  return { x: downstreamRight + 72, y: storyboardNode.y };
}

function ensureStoryboardCompositionEdges(
  edges: SpaceCanvasEdge[],
  nodes: SpaceCanvasNode[],
  storyboardNodeId: string,
  compositionNodeId: string,
  specs: StoryboardDerivedGroupSpec[],
) {
  const sourceKeys = ["shots", "speech", "lip_sync"].filter((key) =>
    specs.some((spec) => spec.key === key),
  );
  const sources = sourceKeys
    .map((key) => findDerivedGroup(nodes, storyboardNodeId, key))
    .filter((node): node is SpaceCanvasNode => Boolean(node));
  const managedSourceIDs = new Set([
    storyboardNodeId,
    ...nodes
      .filter(
        (node) =>
          node.type === "group" &&
          node.group?.origin === "script" &&
          node.group.sourceNodeId === storyboardNodeId,
      )
      .map((node) => node.id),
  ]);
  const next = edges.filter((edge) => {
    const from = edge.logicalFrom || edge.from;
    const to = edge.logicalTo || edge.to;
    return !(to === compositionNodeId && managedSourceIDs.has(from));
  });
  for (const source of sources.length
    ? sources
    : nodes.filter((node) => node.id === storyboardNodeId)) {
    next.push({
      id: uniqueEdgeId(
        next,
        `script-compose-edge-${stableToken(storyboardNodeId)}-${stableToken(source.id)}`,
      ),
      from: source.id,
      to: compositionNodeId,
      logicalFrom: source.id,
      logicalTo: compositionNodeId,
      executionMode: "manual",
    });
  }
  const reconciled = reconcileCanvasGroupEdges(nodes, next);
  return sameEdges(edges, reconciled) ? edges : reconciled;
}

function sameEdges(left: SpaceCanvasEdge[], right: SpaceCanvasEdge[]) {
  return (
    left.length === right.length &&
    left.every((edge, index) => {
      const candidate = right[index];
      return (
        edge.id === candidate.id &&
        edge.from === candidate.from &&
        edge.to === candidate.to &&
        (edge.logicalFrom || "") === (candidate.logicalFrom || "") &&
        (edge.logicalTo || "") === (candidate.logicalTo || "") &&
        (edge.executionMode || "auto") === (candidate.executionMode || "auto")
      );
    })
  );
}

function storyboardItemKey(
  sourceNodeId: string,
  itemType: CanvasStoryboardItemType,
  itemId: string,
) {
  return `${sourceNodeId}\u0000${itemType}\u0000${itemId}`;
}

function uniqueNodeId(nodes: SpaceCanvasNode[], requestedId: string) {
  return uniqueId(new Set(nodes.map((node) => node.id)), requestedId);
}

function uniqueEdgeId(edges: SpaceCanvasEdge[], requestedId: string) {
  return uniqueId(new Set(edges.map((edge) => edge.id)), requestedId);
}

function uniqueId(usedIds: Set<string>, requestedId: string) {
  if (!usedIds.has(requestedId)) {
    return requestedId;
  }
  let suffix = 2;
  while (usedIds.has(`${requestedId}-${suffix}`)) {
    suffix += 1;
  }
  return `${requestedId}-${suffix}`;
}

function stableToken(value: string) {
  let hash = 2166136261;
  for (const char of value) {
    hash ^= char.codePointAt(0) || 0;
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function storyboardDerivedOptions(
  storyboardNode: SpaceCanvasNode,
): StoryboardDerivedOptions {
  return {
    enableLipSync: booleanValue(
      storyboardNode.composerDraft?.paramValues?.enable_lip_sync,
    ),
  };
}

function normalizeOutputType(value: unknown) {
  return String(value || "general").trim().toLowerCase() || "general";
}

function derivedPowerLabel(spec: StoryboardDerivedGroupSpec) {
  if (spec.outputType === "speech") {
    return "语音合成";
  }
  if (spec.outputType === "lip_sync") {
    return "口型同步";
  }
  return spec.powerKind === "image" ? "图片" : "视频";
}

function booleanValue(value: unknown) {
  if (typeof value === "string") {
    return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
  }
  return value === true || value === 1;
}

function sameStringList(left?: string[], right?: string[]) {
  return JSON.stringify(left || []) === JSON.stringify(right || []);
}

function storyboardSourceNodeSignature(node: SpaceCanvasNode) {
  return [
    node.id,
    Number(node.resultRef?.version_id || 0),
    Number(node.asset?.version_id || node.asset?.version?.id || 0),
    node.storyboardItem?.sourceSignature || "",
    node.storyboardItem?.resultSourceSignature || "",
  ].join(":");
}
