import { reconcileCanvasGroupEdges } from "./space-group-model";
import { createLocalNode, nextCanvasNodeNo } from "./space-model";
import { isStoryboardPowerType } from "./space-power-presentation";
import {
  canvasReferenceContentFromText,
  canvasReferenceContentHasReferences,
} from "./space-reference-content";
import {
  expandStoryboardDerivedGroup,
  nextStoryboardDerivedNodePosition,
  planStoryboardDerivedGroupLayout,
  type StoryboardDerivedGroupLayout,
} from "./space-storyboard-derived-layout";
import {
  STORYBOARD_DERIVED_GROUP_SPECS,
  type StoryboardDerivedGroupSpec,
  type StoryboardDerivedItem,
  type StoryboardPowerKind,
} from "./space-storyboard-derived-specs";
import {
  parseStoryboardOutput,
  storyboardMaterialReferenceNames,
  type StoryboardDocument,
} from "./space-storyboard";
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
) {
  return (
    powers.find(
      (power) =>
        Number(power.id || 0) > 0 &&
        String(power.kind || "")
          .trim()
          .toLowerCase() === kind,
    ) || null
  );
}

export function syncCanvasStoryboardDerivedGroups(input: {
  canvas: SpaceCanvasState;
  assetCate: AssetCate;
  imagePower?: PowerOption | null;
  videoPower?: PowerOption | null;
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
      sourceNode.resultOutput,
      sourceNode.asset?.version?.content,
    ]);
    if (!storyboard) {
      continue;
    }
    const currentSourceNode =
      canvas.nodes.find((node) => node.id === sourceNode.id) || sourceNode;
    canvas = syncStoryboardDerivedGroups({
      canvas,
      storyboardNode: currentSourceNode,
      storyboard,
      assetCate: input.assetCate,
      powers: {
        image: input.imagePower,
        video: input.videoPower,
      },
    });
  }
  return canvas;
}

export function syncStoryboardDerivedGroups(input: {
  canvas: SpaceCanvasState;
  storyboardNode: SpaceCanvasNode;
  storyboard: StoryboardDocument;
  assetCate: AssetCate;
  powers: Record<StoryboardPowerKind, PowerOption | null | undefined>;
}) {
  const nodes = [...input.canvas.nodes];
  const activeItemKeys = new Set<string>();
  const syncedItemTypes = new Set<CanvasStoryboardItemType>();
  const enabledSpecs = STORYBOARD_DERIVED_GROUP_SPECS.filter((spec) =>
    spec.enabled(input.storyboard),
  );
  const derivedGroups = enabledSpecs.map((spec) => ({
    spec,
    items: spec.items(input.storyboard),
    power: input.powers[spec.powerKind],
    existing: findDerivedGroup(nodes, input.storyboardNode.id, spec.key),
  }));
  const layouts = planStoryboardDerivedGroupLayout({
    sourceNode: input.storyboardNode,
    groups: derivedGroups.map(({ spec, items, power, existing }) => ({
      key: spec.key,
      layoutIndex: spec.layoutIndex,
      itemCount: items.length,
      power,
      direction: spec.direction,
      currentSize: existing
        ? { width: existing.width, height: existing.height }
        : undefined,
    })),
  });
  const storyboardReferenceLabels = storyboardMaterialReferenceNames(
    input.storyboard,
  );
  let nextNodeNo = nextCanvasNodeNo(nodes, input.canvas.nextNodeNo);
  let changed = nextNodeNo !== input.canvas.nextNodeNo;

  for (const { spec, items, power } of derivedGroups) {
    syncedItemTypes.add(spec.itemType);
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
    });
    changed = changed || group.changed;

    for (const sourceItem of items) {
      const item = withStoryboardItemReferences(
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
        );
        if (next !== existing) {
          nodes[existingIndex] = next;
          changed = true;
        }
        continue;
      }
      if (!power) {
        continue;
      }
      const created = createDerivedNode({
        nodes,
        group: group.node,
        storyboardNode: input.storyboardNode,
        item,
        assetCate: input.assetCate,
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

  const edges = ensureDerivedGroupEdges(
    input.canvas.edges,
    nodes,
    input.storyboardNode.id,
    enabledSpecs,
  );
  if (edges !== input.canvas.edges) {
    changed = true;
  }
  return changed ? { ...input.canvas, nextNodeNo, nodes, edges } : input.canvas;
}

function withStoryboardItemReferences(
  item: StoryboardDerivedItem,
  nodes: SpaceCanvasNode[],
  sourceNodeId: string,
) {
  if (item.type === "shot_frame") {
    const content = canvasReferenceContentFromText(
      item.prompt,
      nodes
        .filter(
          (node) =>
            node.storyboardItem?.sourceNodeId === sourceNodeId &&
            ["character", "scene", "prop"].includes(
              node.storyboardItem.itemType,
            ) &&
            !node.storyboardItem.stale &&
            Number(node.asset?.id || 0) > 0 &&
            Number(node.asset?.version_id || 0) > 0,
        )
        .map((node) => ({
          refType: "asset" as const,
          refId: Number(node.asset?.id),
          versionId: Number(node.asset?.version_id),
          label: node.title,
        })),
    );
    return canvasReferenceContentHasReferences(content)
      ? { ...item, promptContent: content }
      : item;
  }
  if (item.type !== "shot") {
    return item;
  }
  const frameNode = nodes.find(
    (node) =>
      node.storyboardItem?.sourceNodeId === sourceNodeId &&
      node.storyboardItem.itemType === "shot_frame" &&
      node.storyboardItem.itemId === item.id &&
      !node.storyboardItem.stale &&
      Number(node.asset?.id || 0) > 0 &&
      Number(node.asset?.version_id || 0) > 0,
  );
  if (!frameNode) {
    return item;
  }
  const prompt = `@${frameNode.title} ${item.prompt}`.trim();
  const content = canvasReferenceContentFromText(prompt, [
    {
      refType: "asset" as const,
      refId: Number(frameNode.asset?.id),
      versionId: Number(frameNode.asset?.version_id),
      label: frameNode.title,
    },
  ]);
  return canvasReferenceContentHasReferences(content)
    ? { ...item, prompt, promptContent: content }
    : { ...item, prompt };
}

function ensureDerivedGroup(input: {
  nodes: SpaceCanvasNode[];
  storyboardNode: SpaceCanvasNode;
  spec: StoryboardDerivedGroupSpec;
  layout: StoryboardDerivedGroupLayout;
  assetCate: AssetCate;
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
        x: node.x + deltaX,
        y: node.y + deltaY,
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
  power: PowerOption;
}) {
  const node = createLocalNode(
    "power",
    input.assetCate,
    input.nodes.length,
    { x: input.group.x, y: input.group.y },
    { power: input.power },
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
  if (
    node.groupId === groupId &&
    !promptChanged &&
    !paramValuesChanged &&
    !promptContentChanged &&
    !titleChanged &&
    sameItemMetadata(metadata, nextMetadata)
  ) {
    return node;
  }
  return {
    ...node,
    title: item.title,
    description: promptChanged ? nextPrompt : node.description,
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
    sourceSignature: storyboardDerivedSourceSignature(item),
    stale: false,
  };
}

function storyboardDerivedSourceSignature(item: StoryboardDerivedItem) {
  return stableToken(
    JSON.stringify([item.prompt, item.promptContent || null]),
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
    const sourceGroup = spec.sourceGroupKey
      ? findDerivedGroup(nodes, storyboardNodeId, spec.sourceGroupKey)
      : null;
    const from = upstream ? group.id : sourceGroup?.id || storyboardNodeId;
    const to = upstream ? storyboardNodeId : group.id;
    next.push({
      id: uniqueEdgeId(
        next,
        `script-edge-${stableToken(storyboardNodeId)}-${spec.key}`,
      ),
      from,
      to,
      logicalFrom: from,
      logicalTo: to,
      executionMode: upstream ? undefined : "manual",
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
