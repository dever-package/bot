import type { StoryboardDocument } from "./space-storyboard";
import type { SpaceCanvasNode } from "./types";

export type CanvasStoryboardUpdateMode =
  | "refresh"
  | "materialize"
  | "defer-materialize";

export function canvasStoryboardUpdateMode(
  sourceChanged: boolean,
  powerCatalogLoaded: boolean,
): CanvasStoryboardUpdateMode {
  if (!sourceChanged) {
    return "refresh";
  }
  return powerCatalogLoaded ? "materialize" : "defer-materialize";
}

export function storyboardMaterializationSourceChanged(
  currentNode: SpaceCanvasNode,
  currentStoryboard: StoryboardDocument | null,
  nextNode: SpaceCanvasNode,
  nextStoryboard: StoryboardDocument,
) {
  return (
    !currentStoryboard ||
    storyboardMaterializationIdentity(currentNode, currentStoryboard) !==
      storyboardMaterializationIdentity(nextNode, nextStoryboard)
  );
}

export function storyboardMaterializationIdentity(
  node: SpaceCanvasNode,
  storyboard: StoryboardDocument,
) {
  return JSON.stringify([
    node.id,
    Number(node.resultRef?.asset_id || node.asset?.id || 0),
    Number(
      node.resultRef?.version_id ||
        node.asset?.version_id ||
        node.asset?.version?.id ||
        0,
    ),
    storyboard.workflow.status,
    storyboard.workflow.confirmed_at,
    storyboard.production_plan,
    storyboard.materials.map((item) => [item.type, item.id]),
    storyboard.shots.map((item) => item.id),
  ]);
}
