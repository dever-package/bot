export type RuntimeInteractionRef = {
  runId: number;
  nodeRunId: number;
  nodeKey: string;
  nodeName: string;
  interaction: Record<string, any>;
};

export function normalizeRuntimeInteraction(value: any): RuntimeInteractionRef {
  const interaction =
    value?.interaction &&
    typeof value.interaction === "object" &&
    !Array.isArray(value.interaction)
      ? value.interaction
      : {};
  return {
    runId: Number(value?.run_id || value?.runId || 0),
    nodeRunId: Number(value?.node_run_id || value?.nodeRunId || 0),
    nodeKey: String(value?.node_key || value?.nodeKey || ""),
    nodeName: String(value?.node_name || value?.nodeName || ""),
    interaction,
  };
}

export function isPendingRuntimeInteraction(value: RuntimeInteractionRef) {
  return Boolean(
    String(value.interaction?.id || "").trim() &&
      String(value.interaction?.type || "").trim(),
  );
}
