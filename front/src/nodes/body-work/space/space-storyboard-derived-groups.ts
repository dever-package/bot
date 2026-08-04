import { reconcileCanvasGroupEdges } from "./space-group-model";
import {
  createLocalNode,
  nextCanvasNodeNo,
  powerNodeDefaultSize,
} from "./space-model";
import { isStoryboardPowerType } from "../shared/power-presentation";
import {
  canvasReferenceContentFromTargets,
  canvasReferenceContentHasReferences,
  canvasReferenceContentText,
  canvasReferenceTargetsFromContent,
  normalizeCanvasReferenceLabel,
  type CanvasReferenceTarget,
} from "./space-reference-content";
import {
  nextStoryboardDerivedNodePosition,
  planStoryboardDerivedGroupLayout,
  storyboardDerivedGroupMemberLayout,
  type StoryboardDerivedGroupLayout,
} from "./space-storyboard-derived-layout";
import {
  STORYBOARD_DERIVED_GROUP_SPECS,
  type StoryboardDerivedGroupSpec,
  type StoryboardDerivedItem,
  type StoryboardPowerKind,
} from "./space-storyboard-derived-specs";
import {
  isStoryboardConfirmed,
  parseStoryboardOutput,
  storyboardProductionIncludesComposition,
  type StoryboardDocument,
} from "./space-storyboard";
import { storyboardVideoComposition } from "./space-storyboard-composition";
import type {
  AssetCate,
  CanvasComposerDraft,
  CanvasReferenceContent,
  CanvasStoryboardItemConfig,
  CanvasStoryboardItemType,
  PowerOption,
  SpaceCanvasEdge,
  SpaceCanvasNode,
  SpaceCanvasState,
} from "./types";

export function isStoryboardDerivedPromptOverridden(node: SpaceCanvasNode) {
  const generatedPrompt = String(
    node.storyboardItem?.generatedPrompt || "",
  ).trim();
  const currentPrompt = String(node.composerDraft?.prompt || "").trim();
  return Boolean(
    generatedPrompt && currentPrompt && currentPrompt !== generatedPrompt,
  );
}

export function restoredStoryboardDerivedPrompt(
  node: SpaceCanvasNode,
  canvasNodes: SpaceCanvasNode[],
): CanvasComposerDraft | null {
  const generatedPrompt = String(
    node.storyboardItem?.generatedPrompt || "",
  ).trim();
  const currentPrompt = String(node.composerDraft?.prompt || "");
  if (!generatedPrompt || currentPrompt.trim() === generatedPrompt) {
    return null;
  }
  const referenceNodeIds = new Set(
    node.storyboardItem?.referenceNodeIds || [],
  );
  const referenceTargets = canvasNodes
    .filter((candidate) => referenceNodeIds.has(candidate.id))
    .map((candidate) =>
      storyboardSourceReferenceTarget(
        candidate,
        node.storyboardItem?.itemType,
      ),
    )
    .filter((target): target is CanvasReferenceTarget => Boolean(target));
  const externalReferenceAssetIDs = new Set(
    node.storyboardItem?.externalReferenceAssetIds || [],
  );
  const externalReferenceTargets = canvasReferenceTargetsFromContent(
    node.composerDraft?.promptContent,
  ).filter((target) => externalReferenceAssetIDs.has(target.refId));
  const sourceStoryboardNode = canvasNodes.find(
    (candidate) => candidate.id === node.storyboardItem?.sourceNodeId,
  );
  const sourceStoryboard = sourceStoryboardNode
    ? parseStoryboardOutput([
        sourceStoryboardNode.asset?.version?.content,
        sourceStoryboardNode.resultOutput,
      ])
    : null;
  const sourceReferenceTargets = (sourceStoryboard?.references || [])
    .filter((reference) => externalReferenceAssetIDs.has(reference.asset_id))
    .map(storyboardExternalReferenceTarget);
  const generatedTargets = [
    ...referenceTargets,
    ...externalReferenceTargets,
    ...sourceReferenceTargets,
  ];
  return {
    ...(node.composerDraft || {}),
    prompt: generatedPrompt,
    promptContent: generatedTargets.length
      ? canvasReferenceContentFromTargets(generatedPrompt, generatedTargets)
      : undefined,
    paramValues: replaceGeneratedPromptParamValues(
      node.composerDraft?.paramValues,
      currentPrompt,
      generatedPrompt,
    ),
  };
}

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
    const materializedSignature = storyboardMaterializationSignature(
      currentSourceNode,
      storyboard,
    );
    const previousSignature = String(
      currentSourceNode.storyboardMaterializedSignature || "",
    );
    const hasDerivedStructure = hasStoryboardDerivedStructure(
      canvas.nodes,
      currentSourceNode.id,
    );
    const shouldMaterialize = previousSignature
      ? previousSignature !== materializedSignature
      : !hasDerivedStructure;
    canvas = shouldMaterialize
      ? syncStoryboardDerivedGroups({
          canvas,
          storyboardNode: currentSourceNode,
          storyboard,
          assetCate: input.assetCate,
          powers: input.powers,
        })
      : refreshStoryboardDerivedGroups({
          canvas,
          storyboardNode: currentSourceNode,
          storyboard,
          assetCate: input.assetCate,
          powers: input.powers,
        });
    canvas = markStoryboardMaterialized(
      canvas,
      currentSourceNode.id,
      materializedSignature,
    );
  }
  return canvas;
}

function storyboardMaterializationSignature(
  node: SpaceCanvasNode,
  storyboard: StoryboardDocument,
) {
  return stableToken(
    JSON.stringify([
      node.id,
      Number(node.resultRef?.asset_id || node.asset?.id || 0),
      Number(
        node.resultRef?.version_id ||
          node.asset?.version_id ||
          node.asset?.version?.id ||
          0,
      ),
      storyboard.workflow.confirmed_at,
      storyboard.production_plan,
      storyboard.materials.map((item) => [item.type, item.id]),
      storyboard.shots.map((item) => item.id),
    ]),
  );
}

function hasStoryboardDerivedStructure(
  nodes: SpaceCanvasNode[],
  sourceNodeId: string,
) {
  return nodes.some(
    (node) =>
      node.storyboardItem?.sourceNodeId === sourceNodeId ||
      (node.type === "group" &&
        node.group?.origin === "script" &&
        node.group.sourceNodeId === sourceNodeId),
  );
}

function markStoryboardMaterialized(
  canvas: SpaceCanvasState,
  sourceNodeId: string,
  signature: string,
) {
  const sourceIndex = canvas.nodes.findIndex((node) => node.id === sourceNodeId);
  if (
    sourceIndex < 0 ||
    canvas.nodes[sourceIndex].storyboardMaterializedSignature === signature
  ) {
    return canvas;
  }
  const nodes = [...canvas.nodes];
  nodes[sourceIndex] = {
    ...nodes[sourceIndex],
    storyboardMaterializedSignature: signature,
  };
  return { ...canvas, nodes };
}

function refreshStoryboardDerivedGroups(input: {
  canvas: SpaceCanvasState;
  storyboardNode: SpaceCanvasNode;
  storyboard: StoryboardDocument;
  assetCate: AssetCate;
  powers: PowerOption[];
}) {
  const nodes = [...input.canvas.nodes];
  let changed = false;
  let compositionNodeId = "";
  const enabledSpecs = STORYBOARD_DERIVED_GROUP_SPECS.filter((spec) =>
    spec.enabled(input.storyboard),
  );
  for (const spec of enabledSpecs) {
    const power = spec.local
      ? null
      : firstAvailablePower(input.powers, spec.powerKind, spec.outputType);
    for (const sourceItem of spec.items(input.storyboard)) {
      const existingIndex = nodes.findIndex((node) =>
        isMatchingDerivedNode(
          node,
          input.storyboardNode.id,
          sourceItem.type,
          sourceItem.id,
        ),
      );
      if (existingIndex < 0) {
        continue;
      }
      const item = withStoryboardItemContext(
        sourceItem,
        nodes,
        input.storyboardNode.id,
      );
      const existing = nodes[existingIndex];
      const next = mergeExistingDerivedNode(
        existing,
        existing.groupId || "",
        item,
        spec,
        power,
        { preserveStructure: true },
      );
      if (next === existing) {
        continue;
      }
      nodes[existingIndex] = next;
      changed = true;
    }
  }
  if (storyboardProductionIncludesComposition(input.storyboard)) {
    const composition = syncStoryboardCompositionNode({
      nodes,
      storyboardNode: input.storyboardNode,
      storyboard: input.storyboard,
      assetCate: input.assetCate,
      power: firstAvailablePower(input.powers, "video", "video_compose"),
      nextNodeNo: input.canvas.nextNodeNo,
      createMissing: false,
      preservePosition: true,
    });
    changed = changed || Boolean(composition?.changed);
    compositionNodeId = composition?.node.id || "";
  }
  let edges = ensureDerivedGroupEdges(
    input.canvas.edges,
    nodes,
    input.storyboardNode.id,
    enabledSpecs,
  );
  edges = ensureStoryboardItemEdges(edges, nodes, input.storyboardNode.id);
  edges = compositionNodeId
    ? ensureStoryboardCompositionEdges(
        edges,
        nodes,
        input.storyboardNode.id,
        compositionNodeId,
        enabledSpecs,
      )
    : removeStoryboardCompositionEdges(edges, input.storyboardNode.id);
  const edgesChanged = edges !== input.canvas.edges;
  return changed || edgesChanged
    ? {
        ...input.canvas,
        nodes: changed ? nodes : input.canvas.nodes,
        edges,
      }
    : input.canvas;
}

export function canvasStoryboardReferenceSourceSignature(
  canvas: SpaceCanvasState,
) {
  return JSON.stringify(
    canvas.nodes
      .filter(
        (node) =>
          Boolean(node.storyboardItem) ||
          (node.type === "power" &&
            isStoryboardPowerType(
              node.power,
              node.kind,
              node.outputType,
            )),
      )
      .map((node) => [
        node.id,
        Number(node.resultRef?.asset_id || 0),
        Number(node.resultRef?.version_id || 0),
        Number(node.asset?.id || 0),
        Number(node.asset?.version_id || node.asset?.version?.id || 0),
      ]),
  );
}

export function syncStoryboardDerivedGroups(input: {
  canvas: SpaceCanvasState;
  storyboardNode: SpaceCanvasNode;
  storyboard: StoryboardDocument;
  assetCate: AssetCate;
  powers: PowerOption[];
}) {
  const nodes = [...input.canvas.nodes];
  const activeItemKeys = new Set<string>();
  const syncedItemTypes = new Set<CanvasStoryboardItemType>(
    STORYBOARD_DERIVED_GROUP_SPECS.map((spec) => spec.itemType),
  );
  const enabledSpecs = STORYBOARD_DERIVED_GROUP_SPECS.filter((spec) =>
    spec.enabled(input.storyboard),
  );
  const compositionEnabled = storyboardProductionIncludesComposition(
    input.storyboard,
  );
  syncedItemTypes.add("video_compose");
  if (compositionEnabled) {
    activeItemKeys.add(
      storyboardItemKey(
        input.storyboardNode.id,
        "video_compose",
        "composition",
      ),
    );
  }
  const derivedGroups = enabledSpecs.map((spec) => ({
    spec,
    items: spec.items(input.storyboard),
    power: spec.local
      ? null
      : firstAvailablePower(input.powers, spec.powerKind, spec.outputType),
  }));
  for (const { items } of derivedGroups) {
    for (const item of items) {
      activeItemKeys.add(
        storyboardItemKey(input.storyboardNode.id, item.type, item.id),
      );
    }
  }
  let changed = false;
  for (let index = nodes.length - 1; index >= 0; index -= 1) {
    const metadata = nodes[index].storyboardItem;
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
    nodes.splice(index, 1);
    changed = true;
  }
  const layouts = planStoryboardDerivedGroupLayout({
    sourceNode: input.storyboardNode,
    groups: derivedGroups.map(({ spec, items, power }) => ({
      key: spec.key,
      layoutIndex: spec.layoutIndex,
      itemCount: items.length,
      power,
      powerKind: spec.powerKind,
      direction: spec.direction,
    })),
  });
  let nextNodeNo = nextCanvasNodeNo(nodes, input.canvas.nextNodeNo);
  changed = changed || nextNodeNo !== input.canvas.nextNodeNo;

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

    const orderedMembers = items
      .map((item) =>
        nodes.find(
          (node) =>
            node.groupId === group.node.id &&
            isMatchingDerivedNode(
              node,
              input.storyboardNode.id,
              item.type,
              item.id,
            ),
        ),
      )
      .filter((node): node is SpaceCanvasNode => Boolean(node));
    const memberLayout = storyboardDerivedGroupMemberLayout(
      group.node,
      orderedMembers,
    );
    for (const member of orderedMembers) {
      const position = memberLayout.positions.get(member.id);
      if (!position || (member.x === position.x && member.y === position.y)) {
        continue;
      }
      const memberIndex = nodes.indexOf(member);
      nodes[memberIndex] = { ...member, ...position };
      changed = true;
    }
    const groupNodeIndex = nodes.findIndex((node) => node.id === group.node.id);
    const currentGroup = nodes[groupNodeIndex];
    if (
      currentGroup.width !== memberLayout.width ||
      currentGroup.height !== memberLayout.height
    ) {
      nodes[groupNodeIndex] = {
        ...currentGroup,
        width: memberLayout.width,
        height: memberLayout.height,
      };
      changed = true;
    }
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

  const composition = compositionEnabled
    ? syncStoryboardCompositionNode({
        nodes,
        storyboardNode: input.storyboardNode,
        storyboard: input.storyboard,
        assetCate: input.assetCate,
        power: firstAvailablePower(input.powers, "video", "video_compose"),
        nextNodeNo,
      })
    : null;
  if (composition) {
    nextNodeNo = composition.nextNodeNo;
    changed = changed || composition.changed;
  }

  let edges = ensureDerivedGroupEdges(
    input.canvas.edges,
    nodes,
    input.storyboardNode.id,
    enabledSpecs,
  );
  edges = ensureStoryboardItemEdges(edges, nodes, input.storyboardNode.id);
  edges = composition
    ? ensureStoryboardCompositionEdges(
        edges,
        nodes,
        input.storyboardNode.id,
        composition.node.id,
        enabledSpecs,
      )
    : removeStoryboardCompositionEdges(edges, input.storyboardNode.id);
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
  const resolveNodes = (sources: StoryboardDerivedItem["referenceItems"]) =>
    (sources || [])
      .map((source) =>
        nodes.find((node) =>
          isMatchingDerivedNode(node, sourceNodeId, source.type, source.id),
        ),
      )
      .filter((node): node is SpaceCanvasNode => Boolean(node));
  const dependencyNodes = resolveNodes(item.dependencyItems);
  const referenceNodes = resolveNodes(item.referenceItems);
  const signatureNodes = uniqueNodes([...dependencyNodes, ...referenceNodes]);
  const externalReferences = item.externalReferences || [];
  const withSources = {
    ...item,
    dependencyNodeIds: dependencyNodes.map((node) => node.id),
    referenceNodeIds: referenceNodes.map((node) => node.id),
    sourceSignatureParts: [
      ...(item.sourceSignatureParts || []),
      ...signatureNodes.map(storyboardSourceNodeSignature),
      ...externalReferences.map(storyboardExternalReferenceSignature),
    ],
  };
  if (
    !["character", "scene", "prop", "shot_image", "shot", "lip_sync"].includes(
      item.type,
    )
  ) {
    return withSources;
  }
  const promptWithMentions = storyboardPromptWithSourceMentions(
    item.prompt,
    referenceNodes,
    externalReferences,
  );
  const withMentions =
    promptWithMentions === item.prompt
      ? withSources
      : { ...withSources, prompt: promptWithMentions };
  const referenceTargets = externalReferences.map(
    storyboardExternalReferenceTarget,
  );
  referenceTargets.push(
    ...referenceNodes
      .map((node) => storyboardSourceReferenceTarget(node, item.type))
      .filter((target): target is CanvasReferenceTarget => Boolean(target)),
  );
  if (!referenceTargets.length) {
    return withMentions;
  }
  const content = canvasReferenceContentFromTargets(
    promptWithMentions,
    referenceTargets,
  );
  const prompt = canvasReferenceContentText(content);
  return canvasReferenceContentHasReferences(content)
    ? { ...withSources, prompt, promptContent: content }
    : { ...withMentions, prompt };
}

function storyboardPromptWithSourceMentions(
  prompt: string,
  sourceNodes: SpaceCanvasNode[],
  externalReferences: StoryboardDerivedItem["externalReferences"] = [],
) {
  const mentions: string[] = [];
  const seen = new Set<string>();
  for (const reference of externalReferences) {
    const label = normalizeCanvasReferenceLabel(reference.label);
    const mention = label ? `@${label}` : "";
    if (!mention || seen.has(mention) || prompt.includes(mention)) {
      continue;
    }
    seen.add(mention);
    mentions.push(mention);
  }
  for (const node of sourceNodes) {
    const label = normalizeCanvasReferenceLabel(node.title);
    const mention = label ? `@${label}` : "";
    if (!mention || seen.has(mention) || prompt.includes(mention)) {
      continue;
    }
    seen.add(mention);
    mentions.push(mention);
  }
  return [mentions.join(" "), prompt].filter(Boolean).join(" ").trim();
}

function storyboardSourceReferenceTarget(
  node: SpaceCanvasNode,
  targetItemType?: CanvasStoryboardItemType,
): CanvasReferenceTarget | null {
  const refId = Number(node.resultRef?.asset_id || node.asset?.id || 0);
  const versionId = Number(
    node.resultRef?.version_id ||
      node.asset?.version_id ||
      node.asset?.version?.id ||
      0,
  );
  if (!refId || !versionId) {
    return null;
  }
  return {
    refType: "asset",
    refId,
    versionId,
    label: node.title,
    usage:
      targetItemType === "shot" &&
      node.storyboardItem?.itemType === "shot_image"
        ? "firstFrame"
        : undefined,
  };
}

function storyboardExternalReferenceTarget(
  reference: NonNullable<StoryboardDerivedItem["externalReferences"]>[number],
): CanvasReferenceTarget {
  return {
    refType: "asset",
    refId: reference.asset_id,
    versionId: reference.version_id,
    label: reference.label,
  };
}

function storyboardExternalReferenceSignature(
  reference: NonNullable<StoryboardDerivedItem["externalReferences"]>[number],
) {
  return [
    "asset",
    reference.asset_id,
    reference.version_id || 0,
    reference.kind,
    reference.purpose,
    reference.instruction,
  ].join(":");
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
    const deltaX = input.layout.bounds.x - existing.x;
    const deltaY = input.layout.bounds.y - existing.y;
    let movedGroup = existing;
    for (const [index, node] of input.nodes.entries()) {
      if (node.id !== existing.id && node.groupId !== existing.id) {
        continue;
      }
      const moved = {
        ...node,
        x:
          node.x +
          deltaX,
        y:
          node.y +
          deltaY,
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
  if (!input.power && !input.spec.local) {
    node.subtitle = `未配置${derivedPowerLabel(input.spec)}能力`;
    node.description = `${node.subtitle}。配置并启用能力后可运行此条目。`;
  }
  if (input.spec.local) {
    node.subtitle = "本地字幕轨";
    node.description = input.item.prompt || "当前镜头字幕轨";
    node.resultOutput = input.item.localOutput;
  }
  node.groupId = input.group.id;
  node.composerDraft = {
    prompt: input.item.prompt,
    promptContent: input.item.promptContent,
    paramValues: input.item.paramValues,
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
  spec: StoryboardDerivedGroupSpec,
  power?: PowerOption | null,
  options: { preserveStructure?: boolean } = {},
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
  const shouldRefreshPrompt =
    !currentPrompt.trim() || currentPrompt === metadata.generatedPrompt;
  const nextPrompt = shouldRefreshPrompt ? item.prompt : currentPrompt;
  const promptChanged = nextPrompt !== currentPrompt;
  const nextParamValues = mergeGeneratedParamValues(
    node.composerDraft?.paramValues,
    currentPrompt,
    nextPrompt,
    item.paramValues,
  );
  const paramValuesChanged =
    nextParamValues !== node.composerDraft?.paramValues;
  const nextPromptContent = shouldRefreshPrompt
    ? item.promptContent
    : mergeManualPromptReferenceContent(
        currentPrompt,
        node.composerDraft?.promptContent,
        item.promptContent,
      );
  const promptContentChanged =
    JSON.stringify(node.composerDraft?.promptContent || null) !==
    JSON.stringify(nextPromptContent || null);
  const nextMetadata = storyboardItemMetadata(metadata.sourceNodeId, item);
  const hasGeneratedResult = derivedNodeHasGeneratedResult(node);
  const resultSourceSignature =
    metadata.resultSourceSignature ||
    (hasGeneratedResult ? previousSourceSignature : "");
  if (resultSourceSignature && !spec.local) {
    nextMetadata.resultSourceSignature = resultSourceSignature;
  }
  nextMetadata.stale = spec.local
    ? false
    : Boolean(
        hasGeneratedResult &&
          resultSourceSignature !== nextMetadata.sourceSignature,
      );
  const nextTitle =
    options.preserveStructure && node.titleMode === "manual"
      ? node.title
      : item.title;
  const titleChanged = node.title !== nextTitle;
  const nextGroupId = options.preserveStructure
    ? node.groupId || ""
    : groupId;
  const attachPower = !node.power && Boolean(power);
  const kindChanged = node.kind !== spec.powerKind;
  const outputTypeChanged = node.outputType !== spec.outputType;
  const localOutputChanged =
    spec.local &&
    JSON.stringify(node.resultOutput || null) !==
      JSON.stringify(item.localOutput || null);
  if (
    (node.groupId || "") === nextGroupId &&
    !promptChanged &&
    !paramValuesChanged &&
    !promptContentChanged &&
    !titleChanged &&
    !attachPower &&
    !kindChanged &&
    !outputTypeChanged &&
    !localOutputChanged &&
    sameItemMetadata(metadata, nextMetadata)
  ) {
    return node;
  }
  return {
    ...node,
    title: nextTitle,
    kind: spec.powerKind,
    outputType: spec.outputType,
    ...(attachPower
      ? {
          power: power || undefined,
          subtitle: power?.output?.name || power?.name || node.subtitle,
        }
      : {}),
    description: promptChanged || attachPower ? nextPrompt : node.description,
    ...(spec.local ? { resultOutput: item.localOutput } : {}),
    groupId: nextGroupId,
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

function mergeGeneratedParamValues(
  values: Record<string, unknown> | undefined,
  currentPrompt: string,
  nextPrompt: string,
  generatedValues: Record<string, unknown> | undefined,
) {
  let next = replaceGeneratedPromptParamValues(
    values,
    currentPrompt,
    nextPrompt,
  );
  for (const [key, value] of Object.entries(generatedValues || {})) {
    if (next?.[key] === value) {
      continue;
    }
    next = { ...(next || {}), [key]: value };
  }
  return next;
}

function mergeManualPromptReferenceContent(
  prompt: string,
  current: CanvasReferenceContent | undefined,
  generated: CanvasReferenceContent | undefined,
) {
  if (!generated || !canvasReferenceContentHasReferences(generated)) {
    return current;
  }
  return canvasReferenceContentFromTargets(
    prompt,
    canvasReferenceTargetsFromContent(generated),
  );
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
    dependencyNodeIds: item.dependencyNodeIds,
    referenceNodeIds: item.referenceNodeIds,
    externalReferenceAssetIds: (item.externalReferences || []).map(
      (reference) => reference.asset_id,
    ),
    shotId: item.shotId,
    speechId: item.speechId,
    speechIds: item.speechIds,
    characterId: item.characterId,
    speechKind: item.speechKind,
    speakerMode: item.speakerMode,
    startTime: item.startTime,
    shotDuration: item.shotDuration,
    continuityAnchor: item.continuityAnchor,
    optional: item.optional,
    sourceSignature: storyboardDerivedSourceSignature(item),
    stale: false,
  };
}

function storyboardDerivedSourceSignature(item: StoryboardDerivedItem) {
  return stableToken(
    JSON.stringify([
      item.prompt,
      item.promptContent || null,
      item.paramValues || null,
      item.localOutput || null,
      item.sourceSignatureParts || [],
      item.shotId || "",
      item.speechId || "",
      item.speechIds || [],
      item.characterId || "",
      item.speechKind || "",
      item.speakerMode || "",
      item.startTime ?? null,
      item.shotDuration ?? null,
      item.continuityAnchor || "",
      Boolean(item.optional),
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
    sameValueList(left.dependencyNodeIds, right.dependencyNodeIds) &&
    sameValueList(left.referenceNodeIds, right.referenceNodeIds) &&
    sameValueList(
      left.externalReferenceAssetIds,
      right.externalReferenceAssetIds,
    ) &&
    left.shotId === right.shotId &&
    left.speechId === right.speechId &&
    sameValueList(left.speechIds, right.speechIds) &&
    left.characterId === right.characterId &&
    left.speechKind === right.speechKind &&
    left.speakerMode === right.speakerMode &&
    left.startTime === right.startTime &&
    left.shotDuration === right.shotDuration &&
    left.continuityAnchor === right.continuityAnchor &&
    Boolean(left.optional) === Boolean(right.optional) &&
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
  const prefix = `script-edge-${stableToken(storyboardNodeId)}-`;
  const next = edges.filter((edge) => !edge.id.startsWith(prefix));
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
          `${prefix}${spec.key}-${stableToken(from)}`,
        ),
        from,
        to,
        logicalFrom: from,
        logicalTo: to,
        purpose: "structure",
        executionMode: upstream ? undefined : "manual",
      });
    }
  }
  const reconciled = reconcileCanvasGroupEdges(nodes, next);
  return sameEdges(edges, reconciled) ? edges : reconciled;
}

function ensureStoryboardItemEdges(
  edges: SpaceCanvasEdge[],
  nodes: SpaceCanvasNode[],
  storyboardNodeId: string,
) {
  const prefix = `script-item-edge-${stableToken(storyboardNodeId)}-`;
  const next = edges.filter((edge) => !edge.id.startsWith(prefix));
  const derivedNodes = nodes.filter(
    (node) =>
      node.storyboardItem?.sourceNodeId === storyboardNodeId &&
      (Boolean(node.groupId) ||
        node.storyboardItem.itemType === "video_compose"),
  );
  const byID = new Map(derivedNodes.map((node) => [node.id, node]));
  for (const target of derivedNodes) {
    for (const sourceID of target.storyboardItem?.dependencyNodeIds || []) {
      const source = byID.get(sourceID);
      if (!source || source.id === target.id) {
        continue;
      }
      next.push({
        id: uniqueEdgeId(
          next,
          `${prefix}${stableToken(source.id)}-${stableToken(target.id)}`,
        ),
        from: source.id,
        to: target.id,
        logicalFrom: source.id,
        logicalTo: target.id,
        purpose: "dependency",
        executionMode:
          source.groupId && source.groupId === target.groupId
            ? undefined
            : "manual",
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
  assetCate: AssetCate;
  power?: PowerOption | null;
  nextNodeNo: number;
  createMissing?: boolean;
  preservePosition?: boolean;
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
    current: existing?.composerDraft?.videoComposition,
  });
  const sourceSignature =
    storyboardCompositionSourceSignature(videoComposition);
  const metadata: CanvasStoryboardItemConfig = {
    sourceNodeId: input.storyboardNode.id,
    itemType: "video_compose",
    itemId: "composition",
    generatedPrompt: "",
    sourceSignature,
    stale: false,
  };

  if (existing) {
    const position = input.preservePosition
      ? { x: existing.x, y: existing.y }
      : storyboardCompositionPosition(input.nodes, input.storyboardNode);
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

  if (input.createMissing === false) {
    return null;
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

function storyboardCompositionSourceSignature(
  composition: ReturnType<typeof storyboardVideoComposition>,
) {
  const clips = composition.clips.map((clip) => {
    const current = { ...clip };
    delete current.storyboardTransitionToNext;
    return current;
  });
  return stableToken(JSON.stringify({ ...composition, clips }));
}

function storyboardCompositionPosition(
  nodes: SpaceCanvasNode[],
  storyboardNode: SpaceCanvasNode,
) {
  const derivedGroups = nodes.filter(
    (node) =>
      node.type === "group" &&
      node.group?.origin === "script" &&
      node.group.sourceNodeId === storyboardNode.id,
  );
  const downstreamRight = derivedGroups.reduce(
    (right, group) => Math.max(right, group.x + group.width),
    storyboardNode.x + storyboardNode.width + 160,
  );
  const productionTop = derivedGroups.reduce(
    (top, group) => Math.min(top, group.y),
    storyboardNode.y,
  );
  return { x: downstreamRight + 72, y: productionTop };
}

function ensureStoryboardCompositionEdges(
  edges: SpaceCanvasEdge[],
  nodes: SpaceCanvasNode[],
  storyboardNodeId: string,
  compositionNodeId: string,
  specs: StoryboardDerivedGroupSpec[],
) {
  const sourceKeys = ["shots", "speech", "subtitles", "lip_sync"].filter((key) =>
    specs.some((spec) => spec.key === key),
  );
  const sources = sourceKeys
    .map((key) => findDerivedGroup(nodes, storyboardNodeId, key))
    .filter((node): node is SpaceCanvasNode => Boolean(node));
  const prefix = `script-compose-edge-${stableToken(storyboardNodeId)}-`;
  const next = edges.filter((edge) => !edge.id.startsWith(prefix));
  for (const source of sources.length
    ? sources
    : nodes.filter((node) => node.id === storyboardNodeId)) {
    next.push({
      id: uniqueEdgeId(
        next,
        `${prefix}${stableToken(source.id)}`,
      ),
      from: source.id,
      to: compositionNodeId,
      logicalFrom: source.id,
      logicalTo: compositionNodeId,
      purpose: "dependency",
      executionMode: "manual",
    });
  }
  const reconciled = reconcileCanvasGroupEdges(nodes, next);
  return sameEdges(edges, reconciled) ? edges : reconciled;
}

function removeStoryboardCompositionEdges(
  edges: SpaceCanvasEdge[],
  storyboardNodeId: string,
) {
  const prefix = `script-compose-edge-${stableToken(storyboardNodeId)}-`;
  const next = edges.filter((edge) => !edge.id.startsWith(prefix));
  return next.length === edges.length ? edges : next;
}

function sameEdges(left: SpaceCanvasEdge[], right: SpaceCanvasEdge[]) {
  if (left.length !== right.length) {
    return false;
  }
  const rightByID = new Map(right.map((edge) => [edge.id, edge]));
  return left.every((edge) => {
    const candidate = rightByID.get(edge.id);
    return Boolean(
      candidate &&
        edge.from === candidate.from &&
        edge.to === candidate.to &&
        (edge.logicalFrom || "") === (candidate.logicalFrom || "") &&
        (edge.logicalTo || "") === (candidate.logicalTo || "") &&
        (edge.purpose || "") === (candidate.purpose || "") &&
        (edge.executionMode || "auto") ===
          (candidate.executionMode || "auto") &&
        (edge.mediaUsage || "") === (candidate.mediaUsage || ""),
    );
  });
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

function normalizeOutputType(value: unknown) {
  return (
    String(value || "general")
      .trim()
      .toLowerCase() || "general"
  );
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

function sameValueList<T>(left?: T[], right?: T[]) {
  return JSON.stringify(left || []) === JSON.stringify(right || []);
}

function uniqueNodes(nodes: SpaceCanvasNode[]) {
  const seen = new Set<string>();
  return nodes.filter((node) => {
    if (seen.has(node.id)) {
      return false;
    }
    seen.add(node.id);
    return true;
  });
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
