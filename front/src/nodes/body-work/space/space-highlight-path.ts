import type { SpaceCanvasEdge, SpaceCanvasNode } from "./types";
import { canvasNodeStopsExecution } from "./space-execution-plan";
import { isCanvasFunctionNode } from "./space-function";

type PathTopology = {
  semantics: Map<string, "start" | "stop" | "other">;
  edges: { id: string; from: string; to: string }[];
  outgoing: Map<string, { id: string; to: string }[]>;
};

/** 高亮仅依赖方向与执行边界，坐标、标题和结果不参与缓存失效。 */
export function createCanvasHighlightedPaths() {
  let topology: PathTopology | undefined;
  const paths = new Map<string, ReadonlySet<string>>();
  const empty: ReadonlySet<string> = new Set();
  return {
    update(nodes: SpaceCanvasNode[], edges: SpaceCanvasEdge[]) {
      const semantics: PathTopology["semantics"] = new Map(
        nodes.map((node) => [
          node.id,
          isCanvasFunctionNode(node, "start")
            ? "start"
            : canvasNodeStopsExecution(node)
              ? "stop"
              : "other",
        ]),
      );
      const previousTopology = topology;
      if (
        previousTopology &&
        semantics.size === previousTopology.semantics.size &&
        [...semantics].every(
          ([id, value]) => previousTopology.semantics.get(id) === value,
        ) &&
        edges.length === previousTopology.edges.length &&
        edges.every((edge, index) => {
          const previous = previousTopology.edges[index];
          return (
            edge.id === previous.id &&
            edge.from === previous.from &&
            edge.to === previous.to
          );
        })
      )
        return;
      const outgoing: PathTopology["outgoing"] = new Map();
      for (const edge of edges) {
        const sourceEdges = outgoing.get(edge.from) || [];
        sourceEdges.push({ id: edge.id, to: edge.to });
        outgoing.set(edge.from, sourceEdges);
      }
      topology = {
        semantics,
        edges: edges.map(({ id, from, to }) => ({ id, from, to })),
        outgoing,
      };
      paths.clear();
    },
    get(nodeId: string): ReadonlySet<string> {
      if (!topology || topology.semantics.get(nodeId) !== "start") return empty;
      const cached = paths.get(nodeId);
      if (cached) {
        paths.delete(nodeId);
        paths.set(nodeId, cached);
        return cached;
      }
      const highlighted = new Set<string>();
      const visited = new Set([nodeId]);
      const queue = [...(topology.outgoing.get(nodeId) || [])];
      for (let index = 0; index < queue.length; index += 1) {
        const edge = queue[index];
        if (highlighted.has(edge.id)) continue;
        highlighted.add(edge.id);
        if (visited.has(edge.to)) continue;
        visited.add(edge.to);
        if (topology.semantics.get(edge.to) === "stop") continue;
        queue.push(...(topology.outgoing.get(edge.to) || []));
      }
      // 页面只同时使用 selected / hovered 两个起点。
      if (paths.size >= 2) paths.delete(paths.keys().next().value!);
      paths.set(nodeId, highlighted);
      return highlighted;
    },
  };
}
