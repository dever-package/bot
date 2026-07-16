import type { PowerOption, SpaceCanvasNode } from "./types";

export type StoryboardGroupDirection = "upstream" | "downstream";

const GROUP_OFFSET_X = 160;
const GROUP_GAP_X = 72;
const GROUP_GAP_Y = 72;
const GROUP_HEADER_HEIGHT = 58;
const GROUP_PADDING = 24;
const NODE_GAP = 24;
const NODE_COLUMNS = 2;
const DEFAULT_NODE_SIZE = { width: 180, height: 180 };

export type StoryboardDerivedLayoutGroup = {
  key: string;
  layoutIndex: number;
  itemCount: number;
  power?: PowerOption | null;
  direction: StoryboardGroupDirection;
  currentSize?: { width: number; height: number };
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
  const upstreamGroups = groups
    .filter((group) => group.direction === "upstream")
    .sort(compareLayoutGroups);
  const upstreamLayoutKey = storyboardDerivedLayoutKey(
    "upstream",
    upstreamGroups,
  );
  const upstreamHeight = upstreamGroups.reduce(
    (height, group, index) =>
      height + group.size.height + (index > 0 ? GROUP_GAP_Y : 0),
    0,
  );
  const upstreamRight = input.sourceNode.x - GROUP_OFFSET_X;
  let upstreamY =
    input.sourceNode.y + input.sourceNode.height / 2 - upstreamHeight / 2;
  for (const group of upstreamGroups) {
    layouts.set(group.key, {
      bounds: {
        x: upstreamRight - group.size.width,
        y: upstreamY,
        width: group.size.width,
        height: group.size.height,
      },
      layoutKey: `${upstreamLayoutKey}:${group.key}`,
    });
    upstreamY += group.size.height + GROUP_GAP_Y;
  }

  const downstreamGroups = groups
    .filter((group) => group.direction === "downstream")
    .sort(compareLayoutGroups);
  const downstreamLayoutKey = storyboardDerivedLayoutKey(
    "downstream",
    downstreamGroups,
  );
  let downstreamX =
    input.sourceNode.x + input.sourceNode.width + GROUP_OFFSET_X;
  for (const group of downstreamGroups) {
    layouts.set(group.key, {
      bounds: {
        x: downstreamX,
        y: input.sourceNode.y,
        width: group.size.width,
        height: group.size.height,
      },
      layoutKey: `${downstreamLayoutKey}:${group.key}`,
    });
    downstreamX += group.size.width + GROUP_GAP_X;
  }
  return layouts;
}

export function nextStoryboardDerivedNodePosition(
  group: SpaceCanvasNode,
  nodes: SpaceCanvasNode[],
  node: SpaceCanvasNode,
) {
  const members = nodes.filter((candidate) => candidate.groupId === group.id);
  const cellWidth = Math.max(DEFAULT_NODE_SIZE.width, node.width);
  const cellHeight = Math.max(DEFAULT_NODE_SIZE.height, node.height);
  for (let slot = 0; slot < members.length + 100; slot += 1) {
    const column = slot % NODE_COLUMNS;
    const row = Math.floor(slot / NODE_COLUMNS);
    const position = {
      x: group.x + GROUP_PADDING + column * (cellWidth + NODE_GAP),
      y: group.y + GROUP_HEADER_HEIGHT + row * (cellHeight + NODE_GAP),
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
    y: group.y + GROUP_HEADER_HEIGHT,
  };
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

function derivedNodeSize(power?: PowerOption | null) {
  const width = Number(power?.output?.defaultWidth || 0);
  const height = Number(power?.output?.defaultHeight || 0);
  return {
    width: width > 0 ? width : DEFAULT_NODE_SIZE.width,
    height: height > 0 ? height : DEFAULT_NODE_SIZE.height,
  };
}

function storyboardDerivedGroupSize(group: StoryboardDerivedLayoutGroup) {
  const nodeSize = derivedNodeSize(group.power);
  const rows = Math.max(1, Math.ceil(group.itemCount / NODE_COLUMNS));
  const naturalWidth =
    GROUP_PADDING * 2 +
    nodeSize.width * NODE_COLUMNS +
    NODE_GAP * (NODE_COLUMNS - 1);
  const naturalHeight =
    GROUP_HEADER_HEIGHT +
    GROUP_PADDING +
    rows * nodeSize.height +
    (rows - 1) * NODE_GAP;
  return {
    width: Math.max(naturalWidth, group.currentSize?.width || 0),
    height: Math.max(naturalHeight, group.currentSize?.height || 0),
  };
}

function storyboardDerivedLayoutKey(
  direction: StoryboardGroupDirection,
  groups: Array<
    StoryboardDerivedLayoutGroup & {
      size: { width: number; height: number };
    }
  >,
) {
  return [
    "storyboard-derived-layout-v2",
    direction,
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
    left.x + left.width + NODE_GAP <= right.x ||
    right.x + right.width + NODE_GAP <= left.x ||
    left.y + left.height + NODE_GAP <= right.y ||
    right.y + right.height + NODE_GAP <= left.y
  );
}
