import type { SpaceCanvasEdge } from "./types";

export type CanvasEdgePurpose = "media" | "structure" | "dependency";

export function canvasEdgePurpose(
  edge: Pick<SpaceCanvasEdge, "id" | "purpose">,
): CanvasEdgePurpose {
  if (edge.purpose) {
    return edge.purpose;
  }
  if (
    edge.id.startsWith("script-item-edge-") ||
    edge.id.startsWith("script-compose-edge-")
  ) {
    return "dependency";
  }
  if (edge.id.startsWith("script-edge-")) {
    return "structure";
  }
  return "media";
}

export function canvasEdgeCarriesMedia(
  edge: Pick<SpaceCanvasEdge, "id" | "purpose">,
) {
  return canvasEdgePurpose(edge) === "media";
}
