import { isStoryboardPowerType } from "../shared/power-presentation";
import type { SpaceCanvasNode } from "./types";

export function storyboardSourceNodeIdsAffectedByNodeUpdate(
  nodes: readonly SpaceCanvasNode[],
  nodeId: string,
) {
  const sourceNodeIds = new Set<string>();
  const updatedNode = nodes.find((node) => node.id === nodeId);
  if (!updatedNode) {
    return [];
  }
  if (
    updatedNode.type === "power" &&
    isStoryboardPowerType(
      updatedNode.power,
      updatedNode.kind,
      updatedNode.outputType,
    )
  ) {
    sourceNodeIds.add(updatedNode.id);
  }
  if (updatedNode.storyboardItem?.sourceNodeId) {
    sourceNodeIds.add(updatedNode.storyboardItem.sourceNodeId);
  }
  const updatedAssetId = Number(
    updatedNode.resultRef?.asset_id || updatedNode.asset?.id || 0,
  );
  for (const node of nodes) {
    const item = node.storyboardItem;
    if (!item) {
      continue;
    }
    if (
      item.referenceNodeIds?.includes(nodeId) ||
      item.dependencyNodeIds?.includes(nodeId) ||
      (updatedAssetId > 0 &&
        item.externalReferenceAssetIds?.includes(updatedAssetId))
    ) {
      sourceNodeIds.add(item.sourceNodeId);
    }
  }
  return [...sourceNodeIds];
}
