import type { SpaceCanvasNode, SpaceCanvasState } from "./types";

export function storyboardExecutionCanvas(
  canvas: SpaceCanvasState,
): SpaceCanvasState {
  const nodesById = new Map(canvas.nodes.map((node) => [node.id, node]));
  let changed = false;
  const nodes = canvas.nodes.map((node) => {
    const dependencyNodeIds = node.storyboardItem?.dependencyNodeIds || [];
    if (
      node.storyboardItem?.itemType !== "shot" ||
      !node.storyboardItem.continuityAnchor ||
      dependencyNodeIds.length !== 1
    ) {
      return node;
    }
    const dependencyNodeId = dependencyNodeIds[0];
    const dependencyAssetId = canvasNodeAssetId(nodesById.get(dependencyNodeId));
    const referenceNodeIds = (node.storyboardItem.referenceNodeIds || []).filter(
      (nodeId) => nodeId !== dependencyNodeId,
    );
    const promptContent = node.composerDraft?.promptContent;
    const nextPromptContent = promptContent
      ? {
          ...promptContent,
          parts: promptContent.parts.filter(
            (part) =>
              part.type !== "reference" ||
              part.ref_type !== "asset" ||
              !dependencyAssetId ||
              Number(part.ref_id || 0) !== dependencyAssetId,
          ),
        }
      : promptContent;
    const referencesChanged =
      referenceNodeIds.length !==
      (node.storyboardItem.referenceNodeIds || []).length;
    const promptChanged =
      nextPromptContent?.parts.length !== promptContent?.parts.length;
    if (!referencesChanged && !promptChanged) {
      return node;
    }
    changed = true;
    return {
      ...node,
      storyboardItem: {
        ...node.storyboardItem,
        referenceNodeIds,
      },
      composerDraft: node.composerDraft
        ? { ...node.composerDraft, promptContent: nextPromptContent }
        : node.composerDraft,
    };
  });
  return changed ? { ...canvas, nodes } : canvas;
}

function canvasNodeAssetId(node?: SpaceCanvasNode) {
  return Number(node?.asset?.id || node?.resultRef?.asset_id || 0);
}
