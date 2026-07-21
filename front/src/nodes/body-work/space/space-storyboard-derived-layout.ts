import type { PowerOption, SpaceCanvasNode } from "./types";
import { powerNodeDefaultSize } from "./space-model";

export type StoryboardGroupDirection = "upstream" | "downstream";

const GROUP_OFFSET_X = 160;
const GROUP_GAP_X = 72;
const GROUP_GAP_Y = 72;
const GROUP_CONTENT_TOP = 72;
const LEGACY_GROUP_CONTENT_TOP = 58;
const GROUP_PADDING = 24;
const NODE_GAP_X = 24;
const NODE_GAP_Y = 40;
const LEGACY_NODE_GAP_Y = 24;
const NODE_COLUMNS = 2;
const DEFAULT_NODE_SIZE = { width: 180, height: 180 };
const LAYOUT_VERSION = "storyboard-derived-layout-v7";
const LEGACY_LAYOUT_VERSIONS = [
  "storyboard-derived-layout-v2",
  "storyboard-derived-layout-v3",
  "storyboard-derived-layout-v4",
  "storyboard-derived-layout-v5",
  "storyboard-derived-layout-v6",
] as const;

export type StoryboardDerivedLayoutGroup = {
  key: string;
  layoutIndex: number;
  itemCount: number;
  power?: PowerOption | null;
  powerKind: string;
  direction: StoryboardGroupDirection;
  currentSize?: { width: number; height: number };
  currentLayoutKey?: string;
};

export type StoryboardDerivedGroupLayout = {
  bounds: { x: number; y: number; width: number; height: number };
  layoutKey: string;
};

export function planStoryboardDerivedGroupLayout(input: {
  sourceNode: SpaceCanvasNode;
  groups: StoryboardDerivedLayoutGroup[];
}) {
  const groups = input.groups.map((group) => ({
    ...group,
    size: storyboardDerivedGroupSize(group),
  }));
  const layouts = new Map<string, StoryboardDerivedGroupLayout>();
  const sortedGroups = [...groups].sort(compareLayoutGroups);
  const workspaceLayoutKey = storyboardDerivedLayoutKey(
    "workspace",
    sortedGroups,
  );
  const upstreamGroups = groups
    .filter((group) => group.direction === "upstream")
    .sort(compareLayoutGroups);
  const productionGroups = groups
    .filter(
      (group) =>
        group.direction === "downstream" && group.powerKind !== "audio",
    )
    .sort(compareLayoutGroups);
  const audioGroups = groups
    .filter(
      (group) =>
        group.direction === "downstream" && group.powerKind === "audio",
    )
    .sort(compareLayoutGroups);
  const productionHeight = productionGroups.reduce(
    (height, group) => Math.max(height, group.size.height),
    0,
  );
  const productionY = productionGroups.length
    ? input.sourceNode.y - productionHeight - GROUP_GAP_Y
    : input.sourceNode.y;
  const upstreamRight = input.sourceNode.x - GROUP_OFFSET_X;
  let upstreamY = productionY;
  for (const group of upstreamGroups) {
    layouts.set(group.key, {
      bounds: {
        x: upstreamRight - group.size.width,
        y: upstreamY,
        width: group.size.width,
        height: group.size.height,
      },
      layoutKey: `${workspaceLayoutKey}:${group.key}`,
    });
    upstreamY += group.size.height + GROUP_GAP_Y;
  }

  let productionX = input.sourceNode.x;
  for (const group of productionGroups) {
    layouts.set(group.key, {
      bounds: {
        x: productionX,
        y: productionY,
        width: group.size.width,
        height: group.size.height,
      },
      layoutKey: `${workspaceLayoutKey}:${group.key}`,
    });
    productionX += group.size.width + GROUP_GAP_X;
  }

  let audioX = input.sourceNode.x + input.sourceNode.width + GROUP_OFFSET_X;
  for (const group of audioGroups) {
    layouts.set(group.key, {
      bounds: {
        x: audioX,
        y: input.sourceNode.y,
        width: group.size.width,
        height: group.size.height,
      },
      layoutKey: `${workspaceLayoutKey}:${group.key}`,
    });
    audioX += group.size.width + GROUP_GAP_X;
  }
  return layouts;
}

export function nextStoryboardDerivedNodePosition(
  group: SpaceCanvasNode,
  nodes: SpaceCanvasNode[],
  node: SpaceCanvasNode,
) {
  const members = nodes.filter((candidate) => candidate.groupId === group.id);
  const isAudioNode = node.kind === "audio";
  const cellWidth = isAudioNode
    ? node.width
    : Math.max(DEFAULT_NODE_SIZE.width, node.width);
  const cellHeight = isAudioNode
    ? node.height
    : Math.max(DEFAULT_NODE_SIZE.height, node.height);
  for (let slot = 0; slot < members.length + 100; slot += 1) {
    const column = slot % NODE_COLUMNS;
    const row = Math.floor(slot / NODE_COLUMNS);
    const position = {
      x: group.x + GROUP_PADDING + column * (cellWidth + NODE_GAP_X),
      y: group.y + GROUP_CONTENT_TOP + row * (cellHeight + NODE_GAP_Y),
    };
    if (
      members.every(
        (member) =>
          !rectanglesOverlap(
            { ...position, width: node.width, height: node.height },
            member,
          ),
      )
    ) {
      return position;
    }
  }
  return {
    x: group.x + GROUP_PADDING,
    y: group.y + GROUP_CONTENT_TOP,
  };
}

export function storyboardDerivedLayoutUpgradeMemberOffsets(input: {
  currentLayoutKey?: string;
  nextLayoutKey?: string;
  group: SpaceCanvasNode;
  members: SpaceCanvasNode[];
  nodeSize: { width: number; height: number };
  powerKind: string;
}) {
  const currentVersion = LEGACY_LAYOUT_VERSIONS.find((version) =>
    input.currentLayoutKey?.startsWith(`${version}|`),
  );
  if (
    !currentVersion ||
    !input.nextLayoutKey?.startsWith(`${LAYOUT_VERSION}|`)
  ) {
    return null;
  }
  const contentOffset = currentVersion.endsWith("v2")
    ? GROUP_CONTENT_TOP - LEGACY_GROUP_CONTENT_TOP
    : 0;
  const rowGapOffset =
    currentVersion.endsWith("v2") || currentVersion.endsWith("v3")
      ? NODE_GAP_Y - LEGACY_NODE_GAP_Y
      : 0;
  const sortedMembers = [...input.members].sort(
    (left, right) =>
      left.y - right.y || left.x - right.x || left.id.localeCompare(right.id),
  );
  if (sortedMembers.length === 0) {
    return new Map<string, { x: number; y: number }>();
  }
  const offsets = new Map<string, { x: number; y: number }>();
  if (input.powerKind === "audio") {
    sortedMembers.forEach((member, index) => {
      const column = index % NODE_COLUMNS;
      const row = Math.floor(index / NODE_COLUMNS);
      offsets.set(member.id, {
        x:
          input.group.x +
          GROUP_PADDING +
          column * (input.nodeSize.width + NODE_GAP_X) -
          member.x,
        y:
          input.group.y +
          GROUP_CONTENT_TOP +
          row * (input.nodeSize.height + NODE_GAP_Y) -
          member.y,
      });
    });
    return offsets;
  }
  sortedMembers.forEach((member, index) => {
    offsets.set(member.id, {
      x: 0,
      y: contentOffset + Math.floor(index / NODE_COLUMNS) * rowGapOffset,
    });
  });
  return offsets;
}

export function expandStoryboardDerivedGroup(
  group: SpaceCanvasNode,
  nodes: SpaceCanvasNode[],
) {
  const members = nodes.filter((node) => node.groupId === group.id);
  const requiredWidth = Math.max(
    group.width,
    ...members.map((node) => node.x + node.width - group.x + GROUP_PADDING),
  );
  const requiredHeight = Math.max(
    group.height,
    ...members.map((node) => node.y + node.height - group.y + GROUP_PADDING),
  );
  if (requiredWidth === group.width && requiredHeight === group.height) {
    return group;
  }
  return { ...group, width: requiredWidth, height: requiredHeight };
}

function derivedNodeSize(
  power?: Pick<PowerOption, "kind" | "outputType" | "output"> | null,
) {
  return powerNodeDefaultSize(power || undefined);
}

function storyboardDerivedGroupSize(group: StoryboardDerivedLayoutGroup) {
  const nodeSize = derivedNodeSize(
    group.power || { kind: group.powerKind, outputType: "" },
  );
  const rows = Math.max(1, Math.ceil(group.itemCount / NODE_COLUMNS));
  const naturalWidth =
    GROUP_PADDING * 2 +
    nodeSize.width * NODE_COLUMNS +
    NODE_GAP_X * (NODE_COLUMNS - 1);
  const naturalHeight =
    GROUP_CONTENT_TOP +
    GROUP_PADDING +
    rows * nodeSize.height +
    (rows - 1) * NODE_GAP_Y;
  const keepCurrentSize = !isLegacyAudioGroupLayout(group);
  return {
    width: Math.max(
      naturalWidth,
      keepCurrentSize ? group.currentSize?.width || 0 : 0,
    ),
    height: Math.max(
      naturalHeight,
      keepCurrentSize ? group.currentSize?.height || 0 : 0,
    ),
  };
}

function isLegacyAudioGroupLayout(group: StoryboardDerivedLayoutGroup) {
  return (
    group.powerKind === "audio" &&
    LEGACY_LAYOUT_VERSIONS.some((version) =>
      group.currentLayoutKey?.startsWith(`${version}|`),
    )
  );
}

function storyboardDerivedLayoutKey(
  scope: string,
  groups: Array<
    StoryboardDerivedLayoutGroup & {
      size: { width: number; height: number };
    }
  >,
) {
  return [
    LAYOUT_VERSION,
    scope,
    ...groups.map(
      (group) =>
        `${group.key}:${group.itemCount}:${group.size.width}x${group.size.height}`,
    ),
  ].join("|");
}

function compareLayoutGroups(
  left: StoryboardDerivedLayoutGroup,
  right: StoryboardDerivedLayoutGroup,
) {
  return (
    left.layoutIndex - right.layoutIndex || left.key.localeCompare(right.key)
  );
}

function rectanglesOverlap(
  left: { x: number; y: number; width: number; height: number },
  right: { x: number; y: number; width: number; height: number },
) {
  return !(
    left.x + left.width + NODE_GAP_X <= right.x ||
    right.x + right.width + NODE_GAP_X <= left.x ||
    left.y + left.height + NODE_GAP_Y <= right.y ||
    right.y + right.height + NODE_GAP_Y <= left.y
  );
}
