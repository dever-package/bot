import type { SpaceCanvasEdge, SpaceCanvasNode } from "./types";

export type CanvasEdgePurpose = "media" | "structure" | "dependency";

// Shared settings are a storyboard input document, not a text parameter.
export function canvasConnectionPurpose(
  source: SpaceCanvasNode | undefined,
  target: SpaceCanvasNode | undefined,
): CanvasEdgePurpose {
  return (source?.outputType === "setting" || source?.outputType === "storyboard") && target?.outputType === "storyboard"
    ? "structure"
    : "media";
}

// 全片合成节点及其章节依赖连线的 id 前缀。
export const STORY_COMPOSE_NODE_PREFIX = "story-compose-";

export function canvasEdgePurpose(
  edge: Pick<SpaceCanvasEdge, "id" | "purpose">,
): CanvasEdgePurpose {
  if (edge.purpose) {
    return edge.purpose;
  }
  if (
    edge.id.startsWith("script-item-edge-") ||
    edge.id.startsWith("script-compose-edge-") ||
    edge.id.startsWith(STORY_COMPOSE_NODE_PREFIX)
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

export function replaceVisibleCanvasEdges(
  existing: SpaceCanvasEdge[],
  visibleIds: ReadonlySet<string>,
  updatedVisible: SpaceCanvasEdge[],
) {
  const updatedById = new Map(updatedVisible.map((edge) => [edge.id, edge]));
  const existingIds = new Set(existing.map((edge) => edge.id));
  return [
    ...existing.flatMap((edge) => {
      if (!visibleIds.has(edge.id)) {
        return [edge];
      }
      const updated = updatedById.get(edge.id);
      return updated ? [updated] : [];
    }),
    ...updatedVisible.filter((edge) => !existingIds.has(edge.id)),
  ];
}
