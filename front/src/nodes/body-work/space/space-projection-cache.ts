type ProjectionEntry = { dependencies: readonly unknown[]; value: unknown };

export type CanvasProjectionReuse = <T>(
  scope: string,
  nodeId: string,
  dependencies: readonly unknown[],
  project: () => T,
) => T;

/** 只复用派生展示值；输入仍由原画布与运行态拥有者提供。 */
export function createCanvasProjectionCache() {
  const entries = new Map<string, Map<string, ProjectionEntry>>();
  let retainedNodeIds: ReadonlySet<string> | undefined;
  function reuse<T>(
    scope: string,
    nodeId: string,
    dependencies: readonly unknown[],
    project: () => T,
  ): T {
    let scoped = entries.get(scope);
    if (!scoped) {
      scoped = new Map();
      entries.set(scope, scoped);
    }
    const previous = scoped.get(nodeId);
    if (
      previous &&
      previous.dependencies.length === dependencies.length &&
      dependencies.every((value, index) =>
        Object.is(value, previous.dependencies[index]),
      )
    ) {
      return previous.value as T;
    }
    const value = project();
    scoped.set(nodeId, { dependencies, value });
    return value;
  }
  return {
    reuse,
    retain(nodeIds: ReadonlySet<string>) {
      if (nodeIds === retainedNodeIds) return;
      retainedNodeIds = nodeIds;
      for (const scoped of entries.values()) {
        for (const nodeId of scoped.keys()) {
          if (!nodeIds.has(nodeId)) scoped.delete(nodeId);
        }
      }
    },
  };
}
