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
    storyboard.shots.map((item) => [
      item.id,
      item.shot_image_mode,
      item.shared_end_shot_id,
      item.material_ids,
      item.continue_previous,
      item.match_previous,
      item.continuity_state,
      item.start_framing,
      item.end_framing,
    ]),
  ]);
}
