import {
  reconcileCanvasReferenceContent,
  type CanvasReferenceTarget,
} from "./space-reference-content";
import type {
  CanvasReferenceContent,
  CanvasFunctionOption,
  CanvasResultViewState,
  PowerOption,
  ProjectAsset,
  SpaceCanvasEdge,
  SpaceCanvasNode,
  SpaceCanvasState,
  SpaceCanvasViewport,
  TeamFlow,
  TeamRole,
} from "./types";

export type PersistedCanvasState = {
  asset_cate_id: number;
  next_node_no: number;
  nodes: PersistedCanvasNode[];
  edges: PersistedCanvasEdge[];
  viewport: SpaceCanvasViewport;
};

type PersistedCanvasEdge = {
  id: string;
  from: string;
  to: string;
  logical_from?: string;
  logical_to?: string;
  execution_mode?: "manual";
};

type PersistedCanvasNode = {
  id: string;
  node_no?: number;
  type: SpaceCanvasNode["type"];
  title: string;
  title_mode?: "auto" | "manual";
  subtitle: string;
  description: string;
  x: number;
  y: number;
  width: number;
  height: number;
  group_id?: string;
  group?: {
    origin?: string;
    source_node_id?: string;
    sync_key?: string;
    layout_key?: string;
  };
  storyboard_item?: {
    source_node_id: string;
    item_type: string;
    item_id: string;
    generated_prompt?: string;
    stale?: boolean;
  };
  asset_cate_id?: number;
  kind?: string;
  output_type?: string;
  cardinality?: string;
  count?: number;
  flow?: Pick<TeamFlow, "id" | "key" | "name" | "goal">;
  role?: Pick<
    TeamRole,
    "id" | "name" | "role_type" | "agent_id" | "asset_cate_id"
  >;
  asset?: Pick<
    ProjectAsset,
    "id" | "name" | "kind" | "role" | "asset_cate_id" | "version_id"
  >;
  power?: Pick<
    PowerOption,
    "id" | "key" | "name" | "kind" | "icon" | "output"
  > & { output_type?: string };
  function_option?: Pick<CanvasFunctionOption, "key" | "label" | "description">;
  composer_draft?: Record<string, unknown>;
  result_ref?: Record<string, unknown>;
  result_output?: unknown;
  result_view?: PersistedCanvasResultView;
  local?: boolean;
};

type PersistedCanvasResultView = {
  width: number;
  height: number;
  offset_x?: number;
  offset_y?: number;
};

export function persistedCanvasState(
  canvas: SpaceCanvasState,
): PersistedCanvasState {
  const referenceTargets = canvas.nodes
    .filter((node) => Number(node.nodeNo || 0) > 0)
    .map(
      (node): CanvasReferenceTarget => ({
        refType: "canvas_node",
        refId: Number(node.nodeNo),
        label: node.title,
      }),
    );
  return {
    asset_cate_id: Number(canvas.assetCateId || 0),
    next_node_no: Math.max(1, Number(canvas.nextNodeNo || 1)),
    nodes: canvas.nodes.map((node) =>
      persistedCanvasNode(node, referenceTargets),
    ),
    edges: canvas.edges.map((edge) => ({
      id: edge.id,
      from: edge.from,
      to: edge.to,
      ...(edge.logicalFrom ? { logical_from: edge.logicalFrom } : {}),
      ...(edge.logicalTo ? { logical_to: edge.logicalTo } : {}),
      ...(edge.executionMode === "manual"
        ? { execution_mode: "manual" as const }
        : {}),
    })),
    viewport: {
      ...(canvas.viewport.x == null ? {} : { x: canvas.viewport.x }),
      ...(canvas.viewport.y == null ? {} : { y: canvas.viewport.y }),
      ...(canvas.viewport.zoom == null ? {} : { zoom: canvas.viewport.zoom }),
    },
  };
}

function persistedCanvasNode(
  node: SpaceCanvasNode,
  referenceTargets: CanvasReferenceTarget[],
): PersistedCanvasNode {
  const result: PersistedCanvasNode = {
    id: node.id,
    type: node.type,
    title: node.title,
    subtitle: node.subtitle,
    description: node.description,
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
  };
  assignNumber(result, "node_no", node.nodeNo);
  if (node.titleMode) {
    result.title_mode = node.titleMode;
  }
  assignText(result, "group_id", node.groupId);
  if (node.group) {
    const group: NonNullable<PersistedCanvasNode["group"]> = {};
    assignText(group, "origin", node.group.origin);
    assignText(group, "source_node_id", node.group.sourceNodeId);
    assignText(group, "sync_key", node.group.syncKey);
    assignText(group, "layout_key", node.group.layoutKey);
    if (Object.keys(group).length > 0) {
      result.group = group;
    }
  }
  if (node.storyboardItem) {
    const item = node.storyboardItem;
    result.storyboard_item = {
      source_node_id: item.sourceNodeId,
      item_type: item.itemType,
      item_id: item.itemId,
      ...(item.generatedPrompt
        ? { generated_prompt: item.generatedPrompt }
        : {}),
      ...(item.stale ? { stale: true } : {}),
    };
  }
  assignNumber(result, "asset_cate_id", node.assetCateId);
  assignText(result, "kind", node.kind);
  assignText(result, "output_type", node.outputType);
  assignText(result, "cardinality", node.cardinality);
  assignNumber(result, "count", node.count);
  if (node.flow) {
    result.flow = {
      id: node.flow.id,
      key: node.flow.key,
      name: node.flow.name,
      goal: node.flow.goal,
    };
  }
  if (node.role) {
    result.role = {
      id: node.role.id,
      name: node.role.name,
      role_type: node.role.role_type,
      agent_id: node.role.agent_id,
      asset_cate_id: node.role.asset_cate_id,
    };
  }
  if (node.asset) {
    result.asset = {
      id: node.asset.id,
      name: node.asset.name,
      kind: node.asset.kind,
      role: node.asset.role,
      asset_cate_id: node.asset.asset_cate_id,
      version_id: node.asset.version_id,
    };
  }
  if (node.power) {
    result.power = {
      id: node.power.id,
      key: node.power.key,
      name: node.power.name,
      kind: node.power.kind,
      icon: node.power.icon,
      output_type: node.power.outputType,
      output: node.power.output,
    };
  }
  if (node.functionOption) {
    result.function_option = {
      key: node.functionOption.key,
      label: node.functionOption.label,
      description: node.functionOption.description,
    };
  }
  const composerDraft = persistedComposerDraft(
    node.composerDraft,
    referenceTargets,
    Number(node.nodeNo || 0),
  );
  if (composerDraft) {
    result.composer_draft = composerDraft;
  }
  const resultRef = persistedResultRef((node as any).resultRef);
  if (resultRef) {
    result.result_ref = resultRef;
  }
  const hasStableResultAsset = Boolean(
    Number(resultRef?.asset_id || 0) > 0 &&
    Number(resultRef?.version_id || 0) > 0,
  );
  if (
    !hasStableResultAsset &&
    node.resultOutput != null &&
    isJSONValue(node.resultOutput)
  ) {
    result.result_output = node.resultOutput;
  }
  const resultView = persistedResultView(node.resultView);
  if (resultView) {
    result.result_view = resultView;
  }
  if (node.local != null) {
    result.local = node.local;
  }
  return result;
}

function persistedResultView(
  value: CanvasResultViewState | undefined,
): PersistedCanvasResultView | undefined {
  if (!value) {
    return undefined;
  }
  const width = finiteNumber(value.width);
  const height = finiteNumber(value.height);
  if (width == null || height == null || width <= 0 || height <= 0) {
    return undefined;
  }
  const result: PersistedCanvasResultView = { width, height };
  const offsetX = finiteNumber(value.offsetX);
  const offsetY = finiteNumber(value.offsetY);
  if (offsetX != null) {
    result.offset_x = offsetX;
  }
  if (offsetY != null) {
    result.offset_y = offsetY;
  }
  return result;
}

function persistedComposerDraft(
  value: unknown,
  referenceTargets: CanvasReferenceTarget[],
  currentNodeNo: number,
) {
  if (!isRecord(value)) {
    return null;
  }
  const result: Record<string, unknown> = {};
  assignText(result, "prompt", value.prompt);
  const prompt = typeof value.prompt === "string" ? value.prompt : "";
  const savedPromptContent = normalizeReferenceContent(
    value.promptContent ?? value.prompt_content,
  );
  const promptContent = reconcileCanvasReferenceContent(
    prompt,
    savedPromptContent,
    referenceTargets.filter((target) => target.refId !== currentNodeNo),
  );
  if (promptContent && isJSONValue(promptContent)) {
    result.prompt_content = promptContent;
  }
  assignNumber(
    result,
    "selected_target_id",
    value.selectedTargetId ?? value.selected_target_id,
  );
  const paramValues = serializableParamValues(
    value.paramValues ?? value.param_values,
  );
  if (paramValues) {
    result.param_values = paramValues;
  }
  return Object.keys(result).length ? result : null;
}

function normalizeReferenceContent(value: unknown) {
  if (
    !isRecord(value) ||
    Number(value.version || 0) !== 1 ||
    !Array.isArray(value.parts)
  ) {
    return undefined;
  }
  return value as CanvasReferenceContent;
}

function serializableParamValues(value: unknown) {
  if (!isRecord(value)) {
    return null;
  }
  const result: Record<string, unknown> = {};
  for (const [key, current] of Object.entries(value)) {
    if (isTransientParamValue(current)) {
      continue;
    }
    if (isJSONValue(current)) {
      result[key] = current;
    }
  }
  return Object.keys(result).length ? result : null;
}

function isTransientParamValue(value: unknown) {
  if (!isRecord(value)) {
    return false;
  }
  return Boolean(
    value.file ||
    value.blob ||
    value.preview ||
    value.progress != null ||
    value.uploading != null,
  );
}

function persistedResultRef(value: unknown) {
  if (!isRecord(value)) {
    return null;
  }
  const result: Record<string, unknown> = {};
  for (const key of [
    "run_id",
    "request_id",
    "flow_run_id",
    "node_run_id",
    "asset_id",
    "version_id",
    "release_id",
    "role",
    "status",
    "updated_at",
  ]) {
    const current = value[key];
    if (current != null && isJSONValue(current)) {
      result[key] = current;
    }
  }
  return Object.keys(result).length ? result : null;
}

function assignText(
  target: Record<string, unknown>,
  key: string,
  value: unknown,
) {
  if (typeof value === "string" && value.trim()) {
    target[key] = value;
  }
}

function assignNumber(
  target: Record<string, unknown>,
  key: string,
  value: unknown,
) {
  const number = Number(value || 0);
  if (number > 0) {
    target[key] = number;
  }
}

function finiteNumber(value: unknown) {
  if (value == null || value === "") {
    return undefined;
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function isRecord(value: unknown): value is Record<string, any> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function isJSONValue(value: unknown): boolean {
  if (value == null) {
    return true;
  }
  if (["string", "number", "boolean"].includes(typeof value)) {
    return true;
  }
  if (Array.isArray(value)) {
    return value.every(isJSONValue);
  }
  if (isRecord(value)) {
    return Object.values(value).every(isJSONValue);
  }
  return false;
}
