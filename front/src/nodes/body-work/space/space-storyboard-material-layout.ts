import type { PowerOption, SpaceCanvasNode } from "./types";

const GROUP_OFFSET_X = 160;
const GROUP_GAP_X = 72;
const GROUP_HEADER_HEIGHT = 58;
const GROUP_PADDING = 24;
const NODE_GAP = 24;
const NODE_COLUMNS = 2;
const DEFAULT_NODE_SIZE = { width: 180, height: 180 };

export function newStoryboardMaterialGroupBounds(input: {
  sourceNode: SpaceCanvasNode;
  groupIndex: number;
  materialCount: number;
  imagePower?: PowerOption | null;
}) {
  const nodeSize = materialNodeSize(input.imagePower);
  const rows = Math.max(1, Math.ceil(input.materialCount / NODE_COLUMNS));
  const width =
    GROUP_PADDING * 2 +
    nodeSize.width * NODE_COLUMNS +
    NODE_GAP * (NODE_COLUMNS - 1);
  const height =
    GROUP_HEADER_HEIGHT +
    GROUP_PADDING +
    rows * nodeSize.height +
    (rows - 1) * NODE_GAP;
  return {
    x:
      input.sourceNode.x +
      input.sourceNode.width +
      GROUP_OFFSET_X +
      input.groupIndex * (width + GROUP_GAP_X),
    y: input.sourceNode.y,
    width,
    height,
  };
}

export function nextStoryboardMaterialNodePosition(
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

export function expandStoryboardMaterialGroup(
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

function materialNodeSize(power?: PowerOption | null) {
  const width = Number(power?.output?.defaultWidth || 0);
  const height = Number(power?.output?.defaultHeight || 0);
  return {
    width: width > 0 ? width : DEFAULT_NODE_SIZE.width,
    height: height > 0 ? height : DEFAULT_NODE_SIZE.height,
  };
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
