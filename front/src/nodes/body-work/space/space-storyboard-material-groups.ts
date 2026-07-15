import { reconcileCanvasGroupEdges } from "./space-group-model";
import { createLocalNode } from "./space-model";
import { isStoryboardPowerType } from "./space-power-presentation";
import {
  expandStoryboardMaterialGroup,
  newStoryboardMaterialGroupBounds,
  nextStoryboardMaterialNodePosition,
} from "./space-storyboard-material-layout";
import {
  parseStoryboardOutput,
  storyboardHasMaterialManifest,
  type StoryboardDocument,
  type StoryboardMaterial,
  type StoryboardMaterialType,
} from "./space-storyboard";
import type {
  AssetCate,
  CanvasStoryboardMaterialConfig,
  PowerOption,
  SpaceCanvasEdge,
  SpaceCanvasNode,
  SpaceCanvasState,
} from "./types";

type MaterialListKey = "characters" | "scenes" | "props";

type MaterialGroupSpec = {
  key: MaterialListKey;
  type: StoryboardMaterialType;
  title: string;
};

const MATERIAL_GROUP_SPECS: MaterialGroupSpec[] = [
  { key: "characters", type: "character", title: "角色组" },
  { key: "scenes", type: "scene", title: "场景组" },
  { key: "props", type: "prop", title: "道具组" },
];

export function firstAvailableImagePower(powers: PowerOption[]) {
  return (
    powers.find(
      (power) =>
        Number(power.id || 0) > 0 &&
        String(power.kind || "").trim().toLowerCase() === "image",
    ) || null
  );
}

export function syncCanvasStoryboardMaterialGroups(input: {
  canvas: SpaceCanvasState;
  assetCate: AssetCate;
  imagePower?: PowerOption | null;
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
    if (!storyboard || !storyboardHasMaterialManifest(storyboard)) {
      continue;
    }
    const currentSourceNode =
      canvas.nodes.find((node) => node.id === sourceNode.id) || sourceNode;
    canvas = syncStoryboardMaterialGroups({
      canvas,
      storyboardNode: currentSourceNode,
      storyboard,
      assetCate: input.assetCate,
      imagePower: input.imagePower,
    });
  }
  return canvas;
}

export function syncStoryboardMaterialGroups(input: {
  canvas: SpaceCanvasState;
  storyboardNode: SpaceCanvasNode;
  storyboard: StoryboardDocument;
  assetCate: AssetCate;
  imagePower?: PowerOption | null;
}) {
  if (!input.storyboard.materials) {
    return input.canvas;
  }

  const nodes = [...input.canvas.nodes];
  const activeMaterialKeys = new Set<string>();
  let changed = false;

  for (const [groupIndex, spec] of MATERIAL_GROUP_SPECS.entries()) {
    const materials = input.storyboard.materials[spec.key];
    const group = ensureMaterialGroup({
      nodes,
      storyboardNode: input.storyboardNode,
      spec,
      groupIndex,
      materialCount: materials.length,
      assetCate: input.assetCate,
      imagePower: input.imagePower,
    });
    changed = changed || group.created;

    for (const material of materials) {
      const materialKey = storyboardMaterialKey(
        input.storyboardNode.id,
        spec.type,
        material.id,
      );
      activeMaterialKeys.add(materialKey);
      const existingIndex = nodes.findIndex((node) =>
        isMatchingMaterialNode(
          node,
          input.storyboardNode.id,
          spec.type,
          material.id,
        ),
      );
      if (existingIndex >= 0) {
        const existing = nodes[existingIndex];
        const next = mergeExistingMaterialNode(existing, group.node.id, material);
        if (next !== existing) {
          nodes[existingIndex] = next;
          changed = true;
        }
        continue;
      }
      if (!input.imagePower) {
        continue;
      }
      const next = createMaterialNode({
        nodes,
        group: group.node,
        storyboardNode: input.storyboardNode,
        material,
        materialType: spec.type,
        assetCate: input.assetCate,
        imagePower: input.imagePower,
      });
      nodes.push(next);
      changed = true;
    }

    const resizedGroup = expandStoryboardMaterialGroup(group.node, nodes);
    if (resizedGroup !== group.node) {
      const groupNodeIndex = nodes.findIndex((node) => node.id === group.node.id);
      nodes[groupNodeIndex] = resizedGroup;
      changed = true;
    }
  }

  for (const [index, node] of nodes.entries()) {
    const metadata = node.storyboardMaterial;
    if (
      !metadata ||
      metadata.sourceNodeId !== input.storyboardNode.id ||
      activeMaterialKeys.has(
        storyboardMaterialKey(
          metadata.sourceNodeId,
          metadata.materialType,
          metadata.materialId,
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
      storyboardMaterial: { ...metadata, stale: true },
    };
    changed = true;
  }

  const edges = ensureMaterialGroupEdges(
    input.canvas.edges,
    nodes,
    input.storyboardNode.id,
  );
  if (edges !== input.canvas.edges) {
    changed = true;
  }
  return changed ? { ...input.canvas, nodes, edges } : input.canvas;
}

function ensureMaterialGroup(input: {
  nodes: SpaceCanvasNode[];
  storyboardNode: SpaceCanvasNode;
  spec: MaterialGroupSpec;
  groupIndex: number;
  materialCount: number;
  assetCate: AssetCate;
  imagePower?: PowerOption | null;
}) {
  const existing = input.nodes.find(
    (node) =>
      node.type === "group" &&
      node.group?.origin === "script" &&
      node.group.sourceNodeId === input.storyboardNode.id &&
      node.group.syncKey === input.spec.key,
  );
  if (existing) {
    return { node: existing, created: false };
  }

  const bounds = newStoryboardMaterialGroupBounds({
    sourceNode: input.storyboardNode,
    groupIndex: input.groupIndex,
    materialCount: input.materialCount,
    imagePower: input.imagePower,
  });
  const group = createLocalNode(
    "group",
    input.assetCate,
    input.nodes.length,
    { x: bounds.x, y: bounds.y },
  );
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
  };
  input.nodes.push(group);
  return { node: group, created: true };
}

function createMaterialNode(input: {
  nodes: SpaceCanvasNode[];
  group: SpaceCanvasNode;
  storyboardNode: SpaceCanvasNode;
  material: StoryboardMaterial;
  materialType: StoryboardMaterialType;
  assetCate: AssetCate;
  imagePower: PowerOption;
}) {
  const node = createLocalNode(
    "power",
    input.assetCate,
    input.nodes.length,
    { x: input.group.x, y: input.group.y },
    { power: input.imagePower },
  );
  node.id = uniqueNodeId(
    input.nodes,
    `script-material-${stableToken(
      storyboardMaterialKey(
        input.storyboardNode.id,
        input.materialType,
        input.material.id,
      ),
    )}`,
  );
  node.title = input.material.name;
  node.description =
    input.material.prompt || `${input.material.name}素材，运行前可编辑提示词。`;
  node.groupId = input.group.id;
  node.composerDraft = { prompt: input.material.prompt };
  node.storyboardMaterial = storyboardMaterialMetadata(
    input.storyboardNode.id,
    input.materialType,
    input.material,
  );
  const position = nextStoryboardMaterialNodePosition(
    input.group,
    input.nodes,
    node,
  );
  node.x = position.x;
  node.y = position.y;
  return node;
}

function mergeExistingMaterialNode(
  node: SpaceCanvasNode,
  groupId: string,
  material: StoryboardMaterial,
) {
  const metadata = node.storyboardMaterial;
  if (!metadata) {
    return node;
  }
  const currentPrompt = String(node.composerDraft?.prompt || "");
  const shouldRefreshPrompt =
    !currentPrompt.trim() || currentPrompt === metadata.generatedPrompt;
  const nextPrompt = shouldRefreshPrompt ? material.prompt : currentPrompt;
  const nextMetadata = storyboardMaterialMetadata(
    metadata.sourceNodeId,
    metadata.materialType,
    material,
  );
  const promptChanged = nextPrompt !== currentPrompt;
  if (
    node.groupId === groupId &&
    !metadata.stale &&
    !promptChanged &&
    sameMaterialMetadata(metadata, nextMetadata)
  ) {
    return node;
  }
  return {
    ...node,
    groupId,
    composerDraft: promptChanged
      ? { ...(node.composerDraft || {}), prompt: nextPrompt }
      : node.composerDraft,
    storyboardMaterial: nextMetadata,
  };
}

function storyboardMaterialMetadata(
  sourceNodeId: string,
  materialType: StoryboardMaterialType,
  material: StoryboardMaterial,
): CanvasStoryboardMaterialConfig {
  return {
    sourceNodeId,
    materialType,
    materialId: material.id,
    generatedPrompt: material.prompt,
    stale: false,
  };
}

function sameMaterialMetadata(
  left: CanvasStoryboardMaterialConfig,
  right: CanvasStoryboardMaterialConfig,
) {
  return (
    left.sourceNodeId === right.sourceNodeId &&
    left.materialType === right.materialType &&
    left.materialId === right.materialId &&
    left.generatedPrompt === right.generatedPrompt &&
    Boolean(left.stale) === Boolean(right.stale)
  );
}

function isMatchingMaterialNode(
  node: SpaceCanvasNode,
  sourceNodeId: string,
  materialType: StoryboardMaterialType,
  materialId: string,
) {
  const metadata = node.storyboardMaterial;
  return Boolean(
    metadata &&
      metadata.sourceNodeId === sourceNodeId &&
      metadata.materialType === materialType &&
      metadata.materialId === materialId,
  );
}

function ensureMaterialGroupEdges(
  edges: SpaceCanvasEdge[],
  nodes: SpaceCanvasNode[],
  storyboardNodeId: string,
) {
  let next = edges;
  for (const spec of MATERIAL_GROUP_SPECS) {
    const group = nodes.find(
      (node) =>
        node.type === "group" &&
        node.group?.origin === "script" &&
        node.group.sourceNodeId === storyboardNodeId &&
        node.group.syncKey === spec.key,
    );
    if (!group || hasLogicalEdge(next, storyboardNodeId, group.id)) {
      continue;
    }
    if (next === edges) {
      next = [...edges];
    }
    next.push({
      id: uniqueEdgeId(
        next,
        `script-edge-${stableToken(storyboardNodeId)}-${spec.key}`,
      ),
      from: storyboardNodeId,
      to: group.id,
      logicalFrom: storyboardNodeId,
      logicalTo: group.id,
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
        (edge.logicalTo || "") === (candidate.logicalTo || "")
      );
    })
  );
}

function hasLogicalEdge(
  edges: SpaceCanvasEdge[],
  from: string,
  to: string,
) {
  return edges.some(
    (edge) =>
      (edge.logicalFrom || edge.from) === from &&
      (edge.logicalTo || edge.to) === to,
  );
}

function storyboardMaterialKey(
  sourceNodeId: string,
  materialType: StoryboardMaterialType,
  materialId: string,
) {
  return `${sourceNodeId}\u0000${materialType}\u0000${materialId}`;
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
