import type {
  AssetCardinality,
  AssetCate,
  AssetKind,
  AssetVersion,
  CanvasAssistant,
  CanvasSummary,
  CanvasComposerDraft,
  CanvasFunctionOption,
  OutputTypeOption,
  PowerCategoryOption,
  PowerKindOption,
  PowerOption,
  ProjectAsset,
  SpaceBootstrap,
  SpaceCanvasEdge,
  SpaceCanvasNode,
  SpaceCanvasState,
  SpaceCanvasViewport,
  TeamFlow,
  TeamRole,
  WorkProject,
  WorkRelease,
  WorkTeam,
} from "./types";
import { normalizePowerCategory } from "../shared/power-menu";
import { documentPreview } from "../shared/rich-document";
import { normalizeStoryboardReferences } from "./space-storyboard-reference";
import { isStoryboardWorkTypeKey } from "./space-storyboard-work-type";
import { assetKindLabel } from "../asset/asset-contract";
import { DEFAULT_GROUP_NODE_SIZE } from "./space-group-model";
import {
  isAudioPowerType,
  isStoryboardPowerType,
  resolvePowerPresentation,
} from "../shared/power-presentation";
import {
  firstDefinedValue as firstDefined,
  finiteNumberOrUndefined as finiteNumber,
  finiteNumberOrZero as numberValue,
  isPlainRecord as isRecord,
} from "../shared/structured-json";
import { normalizeStoryboardGridLayout } from "../shared/storyboard-grid-layout";
import { normalizeVideoComposition } from "./space-video-compose";
import { isCanvasRunCanceledError } from "./space-runner";
import { normalizeCanvasNodeRunTiming } from "./space-run-timing";
import { normalizeCanvasParamBindings } from "./space-param-binding";
import { normalizeCanvasFunctionOption } from "./space-function";
import {
  normalizeStoryboardFrameMediaItems,
  normalizeStoryboardImageSequenceFrames,
  normalizeStoryboardFramePlanVersion,
  parseStoryboardShotImageMode,
  parseStoryboardFrameRole,
} from "./space-storyboard-frame-plan";
import {
  normalizeStoryboardRequiredDurationValues,
  parseStoryboardMinShotDuration,
} from "./space-storyboard-duration";

const freeAssetCate: AssetCate = {
  id: 0,
  team_id: 0,
  name: "自由",
  kind: "richtext",
  cardinality: "multiple",
  status: 1,
  sort: 0,
  virtual: true,
};

const DEFAULT_POWER_NODE_SIZE = { width: 180, height: 180 } as const;
const DEFAULT_AUDIO_POWER_NODE_SIZE = { width: 240, height: 160 } as const;
const LEGACY_STORYBOARD_NODE_SIZE = { width: 620, height: 360 } as const;
const DEFAULT_STORYBOARD_NODE_SIZE = { width: 800, height: 460 } as const;

export function normalizeSpaceBootstrap(value: unknown): SpaceBootstrap {
  const row = asRecord(value);
  return {
    project: normalizeProject(row.project),
    team: normalizeTeam(row.team),
    release: normalizeRelease(row.release),
    assetCates: asRecords(row.asset_cates).map(normalizeAssetCate),
    flows: asRecords(row.flows).map(normalizeFlow),
    canvasList: asRecords(row.canvas_list).map(normalizeCanvasSummary),
    canvases: normalizeCanvases(row.canvas),
    assets: asRecords(asRecord(row.assets).items).map(normalizeAsset),
    assistant: normalizeCanvasAssistant(row.assistant),
    initialCanvasId: numberValue(row.active_canvas_id),
    initialAssetCateId: numberValue(row.active_asset_cate_id),
  };
}

export function normalizeCanvasSummary(value: unknown): CanvasSummary {
  const row = asRecord(value);
  return {
    id: numberValue(row.id),
    projectId: numberValue(row.project_id),
    assetCateId: numberValue(row.asset_cate_id),
    name: stringValue(row.name) || "第一幕",
    sort: numberValue(row.sort),
    status: numberValue(row.status),
    updatedAt: stringValue(row.updated_at),
    deletedAt: stringValue(row.deleted_at),
  };
}

function normalizeCanvasAssistant(value: unknown): CanvasAssistant {
  const row = asRecord(value);
  return {
    available: Boolean(row.available),
    reason: stringValue(row.reason),
    releaseID: numberValue(row.release_id),
    roleID: numberValue(row.role_id),
    roleType: stringValue(row.role_type),
    name: stringValue(row.name) || "画布助手",
    assignment: stringValue(row.assignment),
    agentID: numberValue(row.agent_id),
    agentKey: stringValue(row.agent_key),
    contextKey: stringValue(row.context_key),
    openingEnabled: Boolean(row.opening_enabled),
  };
}

export function emptyCanvasState(
  assetCateId: number,
  id = 0,
  name = "第一幕",
): SpaceCanvasState {
  return {
    id,
    name,
    sort: 0,
    status: 1,
    assetCateId,
    nextNodeNo: 1,
    nodes: [],
    edges: [],
    viewport: {},
  };
}

export function normalizeCanvasState(
  value: unknown,
  fallbackAssetCateId = 0,
): SpaceCanvasState {
  const row = asRecord(value);
  const assetCateId = numberValue(
    firstDefined(row.asset_cate_id, fallbackAssetCateId),
  );
  return normalizeCanvasNodeIdentities({
    id: numberValue(row.id),
    name: stringValue(row.name) || "第一幕",
    sort: numberValue(row.sort),
    status: numberValue(row.status) || 1,
    assetCateId,
    nextNodeNo: Math.max(1, numberValue(row.next_node_no)),
    nodes: asRecords(row.nodes)
      .map(normalizeCanvasNode)
      .filter((node): node is SpaceCanvasNode => Boolean(node)),
    edges: asRecords(row.edges)
      .map(normalizeCanvasEdge)
      .filter((edge): edge is SpaceCanvasEdge => Boolean(edge)),
    viewport: normalizeCanvasViewport(row.viewport),
    updatedAt: stringValue(row.updated_at),
  });
}

export function normalizeCanvasNodeIdentities(
  canvas: SpaceCanvasState,
): SpaceCanvasState {
  let nextNodeNo = nextCanvasNodeNo(canvas.nodes, canvas.nextNodeNo);
  let changed = nextNodeNo !== canvas.nextNodeNo;
  const nodes = canvas.nodes.map((node) => {
    if (!canvasNodeHasMaterialSlot(node) || Number(node.nodeNo || 0) > 0) {
      return node;
    }
    const nodeNo = nextNodeNo++;
    const titleMode = node.titleMode || "manual";
    changed = true;
    return {
      ...node,
      nodeNo,
      titleMode,
      ...(titleMode === "auto" && !node.storyboardItem
        ? { title: defaultCanvasNodeTitle(node, nodeNo) }
        : {}),
    };
  });
  return changed ? { ...canvas, nextNodeNo, nodes } : canvas;
}

export function nextCanvasNodeNo(nodes: SpaceCanvasNode[], current = 1) {
  return Math.max(
    1,
    Number(current || 1),
    ...nodes.map((node) => Number(node.nodeNo || 0) + 1),
  );
}

export function canvasNodeHasMaterialSlot(node: SpaceCanvasNode) {
  return node.type === "power" || node.type === "agent" || node.type === "flow";
}

export function defaultCanvasNodeTitle(node: SpaceCanvasNode, nodeNo: number) {
  let label = "节点";
  if (node.type === "power") {
    label = node.power?.name.trim() || canvasPowerTypeName(node);
  } else if (node.type === "agent") {
    label = String(node.role?.name || "智能体").trim() || "智能体";
  } else if (node.type === "flow") {
    label = String(node.flow?.name || "流程").trim() || "流程";
  }
  return `${label}-${nodeNo}`;
}

export function isDefaultCanvasNodeTitle(node: SpaceCanvasNode) {
  const nodeNo = Number(node.nodeNo || 0);
  if (nodeNo <= 0) {
    return false;
  }
  const title = node.title.trim();
  if (title === defaultCanvasNodeTitle(node, nodeNo).trim()) {
    return true;
  }
  // 旧画布按输出类型命名，继续允许运行成功后生成内容标题。
  return (
    node.type === "power" &&
    title === `${canvasPowerTypeName(node)}-${nodeNo}`.trim()
  );
}

function canvasPowerTypeName(node: SpaceCanvasNode) {
  const presentation = resolvePowerPresentation(
    node.power,
    node.kind,
    node.outputType,
  );
  return (
    (presentation.outputType !== "general" && presentation.outputName) ||
    presentation.kindName ||
    "能力"
  );
}

export function normalizePowerCatalog(value: unknown): {
  roles: TeamRole[];
  powers: PowerOption[];
  powerCategories: PowerCategoryOption[];
  powerKinds: PowerKindOption[];
  outputTypes: OutputTypeOption[];
} {
  const row = asRecord(value);
  return {
    roles: asRecords(row.roles).map(normalizeRole),
    powers: asRecords(row.powers).map(normalizePower),
    powerCategories: asRecords(row.power_cates).map(normalizePowerCategory),
    powerKinds: asRecords(row.power_kinds).map(normalizePowerKind),
    outputTypes: asRecords(row.output_types).map(normalizeOutputType),
  };
}

export function normalizeProjectAsset(value: unknown): ProjectAsset {
  return normalizeAsset(asRecord(value));
}

export function visibleAssetCates(space: SpaceBootstrap) {
  return space.assetCates.length > 0 ? space.assetCates : [freeAssetCate];
}

export function defaultAssetCateId(space: SpaceBootstrap) {
  return visibleAssetCates(space)[0]?.id ?? 0;
}

export function assetCateFromList(
  assetCates: AssetCate[],
  assetCateId: number,
) {
  const visibleCates = assetCates.length > 0 ? assetCates : [freeAssetCate];
  return (
    visibleCates.find((item) => item.id === assetCateId) ||
    visibleCates[0] ||
    freeAssetCate
  );
}

export function assetCateById(space: SpaceBootstrap, assetCateId: number) {
  return assetCateFromList(space.assetCates, assetCateId);
}

export function relatedFlows(space: SpaceBootstrap, assetCateId: number) {
  if (assetCateId === 0) {
    return space.flows.slice(0, 4);
  }
  return space.flows
    .filter((flow) => flowOutputAssetCateIds(flow).has(assetCateId))
    .slice(0, 4);
}

export function isCreationRole(role: TeamRole) {
  return role.create_status !== 2;
}

export function isCreationPower(power: PowerOption) {
  return power.createStatus !== 2;
}

export function createLocalNode(
  type: SpaceCanvasNode["type"],
  assetCate: AssetCate,
  index: number,
  position?: { x: number; y: number },
  options?: {
    asset?: ProjectAsset;
    flow?: TeamFlow;
    functionOption?: CanvasFunctionOption;
    power?: PowerOption;
    role?: TeamRole;
  },
): SpaceCanvasNode {
  const baseX = position?.x ?? 420 + (index % 3) * 190;
  const baseY = position?.y ?? 610 + Math.floor(index / 3) * 170;
  const selectedAsset = options?.asset;
  const selectedFlow = options?.flow;
  const selectedFunction = options?.functionOption;
  const selectedPower = options?.power;
  const selectedRole = options?.role;
  const selectedPowerPresentation = selectedPower
    ? resolvePowerPresentation(selectedPower)
    : null;
  const nodeAssetCateId = Number(selectedAsset?.asset_cate_id || assetCate.id);
  const labels: Record<SpaceCanvasNode["type"], [string, string, string]> = {
    asset: [
      selectedAsset?.name || "资产引用",
      selectedAsset
        ? assetKindLabel(selectedAsset.kind)
        : assetKindLabel(assetCate.kind),
      selectedAsset
        ? documentPreview(selectedAsset.version?.content) ||
          "引用已有资产，作为其他节点的上下文。"
        : "引用已有资产，作为其他节点的上下文。",
    ],
    power: [
      selectedPower?.name || defaultPowerName(assetCate.kind),
      selectedPowerPresentation?.outputName ||
        selectedPowerPresentation?.kindName ||
        "能力节点",
      selectedPower
        ? `调用 ${selectedPower.name} 能力，按参数生成内容。`
        : "输入提示词和参数，直接生成文本、图片、视频或音频。",
    ],
    agent: [
      selectedRole?.name || "智能体节点",
      selectedRole?.role_type || "角色执行",
      selectedRole?.assignment || "调用团队角色或指定智能体完成一段任务。",
    ],
    flow: [
      selectedFlow?.name || "流程节点",
      "团队流程",
      selectedFlow?.goal || "执行一组团队预设流程。",
    ],
    function: [
      selectedFunction?.label || "保存节点",
      "功能",
      selectedFunction?.description || "开始、引用、保存、展示等功能节点。",
    ],
    group: [
      "未命名分组",
      "分组",
      "拖入节点后，可统一接收上下文并执行组内节点。",
    ],
  };
  const [title, subtitle, description] = labels[type];
  const size = nodeDefaultSize(type, selectedPower);
  return {
    id: `local-${type}-${Date.now()}-${index}`,
    type,
    title,
    titleMode:
      type === "power" || type === "agent" || type === "flow"
        ? "auto"
        : undefined,
    subtitle,
    description,
    x: baseX,
    y: baseY,
    width: size.width,
    height: size.height,
    assetCateId: nodeAssetCateId,
    kind: selectedAsset?.kind || selectedPower?.kind || assetCate.kind,
    outputType: selectedPower?.outputType,
    cardinality: assetCate.cardinality,
    asset: selectedAsset,
    flow: selectedFlow,
    functionOption: selectedFunction,
    power: selectedPower,
    role: selectedRole,
    group: type === "group" ? { origin: "manual" } : undefined,
    local: true,
  };
}

function normalizeProject(value: unknown): WorkProject {
  const row = asRecord(value);
  const team = asRecord(row.team);
  return {
    id: numberValue(row.id),
    body_id: numberValue(row.body_id),
    team_id: numberValue(row.team_id),
    release_id: numberValue(row.release_id),
    name: stringValue(row.name) || "未命名作品",
    description: stringValue(row.description),
    mode: stringValue(row.mode) || "team",
    team: {
      id: numberValue(team.id),
      name: stringValue(team.name),
      version: numberValue(team.version),
    },
  };
}

function normalizeTeam(value: unknown): WorkTeam {
  const row = asRecord(value);
  return {
    id: numberValue(row.id),
    name: stringValue(row.name) || "自由团队",
    description: stringValue(row.description),
  };
}

function normalizeRelease(value: unknown): WorkRelease {
  const row = asRecord(value);
  return {
    id: numberValue(row.id),
    team_id: numberValue(row.team_id),
    version: numberValue(row.version),
    status: stringValue(row.status),
  };
}

function normalizeAssetCate(value: Record<string, unknown>): AssetCate {
  return {
    id: numberValue(value.id),
    team_id: numberValue(value.team_id),
    name: stringValue(value.name) || "未命名资产",
    kind: (stringValue(value.kind) || "text") as AssetKind,
    cardinality: (stringValue(value.cardinality) ||
      "single") as AssetCardinality,
    status: numberValue(value.status),
    sort: numberValue(value.sort),
  };
}

function normalizeRole(value: Record<string, unknown>): TeamRole {
  return {
    id: numberValue(value.id),
    team_id: numberValue(value.team_id),
    role_type: stringValue(value.role_type),
    role_key: stringValue(value.role_key),
    name: stringValue(value.name),
    agent_id: numberValue(value.agent_id),
    assignment: stringValue(value.assignment),
    create_status: statusValue(value.create_status),
  };
}

function normalizeFlow(value: Record<string, unknown>): TeamFlow {
  return {
    id: numberValue(value.id),
    name: stringValue(value.name),
    key: stringValue(value.key),
    goal: stringValue(value.goal),
    config: asRecord(value.config),
    status: numberValue(value.status),
    sort: numberValue(value.sort),
    output_asset_cate_ids: numberArray(value.output_asset_cate_ids),
  };
}

function normalizePower(value: Record<string, unknown>): PowerOption {
  const kind = stringValue(value.kind) || "text";
  const output = normalizeOutputType(asRecord(value.output));
  const outputType = stringValue(value.output_type) || "general";
  return {
    id: numberValue(value.id),
    cate_id: numberValue(value.cate_id),
    name: stringValue(value.name) || stringValue(value.key) || "未命名能力",
    key: stringValue(value.key),
    icon: stringValue(value.icon),
    description: stringValue(value.description),
    outputType,
    output: output.key ? output : undefined,
    kind,
    createStatus: statusValue(value.create_status),
  };
}

function statusValue(value: unknown) {
  return Number(value) === 2 ? 2 : 1;
}

function normalizeOutputType(value: Record<string, unknown>): OutputTypeOption {
  return {
    key: stringValue(value.key),
    name: stringValue(value.name),
    allowedKinds: stringArray(value.allowed_kinds),
    viewMode: stringValue(value.view_mode),
    defaultWidth: numberValue(value.default_width),
    defaultHeight: numberValue(value.default_height),
    structured: Boolean(value.structured),
    sort: numberValue(value.sort),
  };
}

function normalizePowerKind(value: Record<string, unknown>): PowerKindOption {
  return {
    id: stringValue(value.id),
    value:
      stringValue(value.value) ||
      stringValue(value.name) ||
      stringValue(value.id),
  };
}

function normalizeAsset(value: Record<string, unknown>): ProjectAsset {
  const version = normalizeAssetVersion(asRecord(value.version));
  const versions = normalizeAssetVersions(value.versions);
  return {
    id: numberValue(value.id),
    project_id: numberValue(firstDefined(value.project_id, value.projectID)),
    body_id: numberValue(firstDefined(value.body_id, value.bodyID)),
    team_id: numberValue(firstDefined(value.team_id, value.teamID)),
    flow_id: numberValue(firstDefined(value.flow_id, value.flowID)),
    canvas_id: numberValue(firstDefined(value.canvas_id, value.canvasID)),
    asset_cate_id: numberValue(
      firstDefined(value.asset_cate_id, value.assetCateID),
    ),
    node_key: stringValue(firstDefined(value.node_key, value.nodeKey)),
    name: stringValue(value.name),
    kind: (stringValue(value.kind) || "text") as AssetKind,
    role: stringValue(value.role),
    version_id: numberValue(firstDefined(value.version_id, value.versionID)),
    status: stringValue(value.status),
    sort: numberValue(value.sort),
    created_at: stringValue(firstDefined(value.created_at, value.createdAt)),
    version,
    versions: versions.length ? versions : undefined,
  };
}

export function normalizeAssetVersion(
  value: Record<string, unknown>,
): ProjectAsset["version"] {
  const id = numberValue(value.id);
  if (!id && value.content == null) {
    return undefined;
  }
  return {
    id,
    asset_id: numberValue(firstDefined(value.asset_id, value.assetID)),
    run_id: numberValue(firstDefined(value.run_id, value.runID)),
    node_run_id: numberValue(firstDefined(value.node_run_id, value.nodeRunID)),
    release_id: numberValue(firstDefined(value.release_id, value.releaseID)),
    request_id: stringValue(firstDefined(value.request_id, value.requestID)),
    node_key: stringValue(firstDefined(value.node_key, value.nodeKey)),
    source: asRecord(value.source),
    version: numberValue(value.version),
    summary: stringValue(value.summary),
    content: value.content,
    created_at: stringValue(firstDefined(value.created_at, value.createdAt)),
    updated_at: stringValue(firstDefined(value.updated_at, value.updatedAt)),
  };
}

export function normalizeAssetVersions(value: unknown) {
  return asRecords(value)
    .map(normalizeAssetVersion)
    .filter((item): item is AssetVersion => Boolean(item));
}

function normalizeCanvases(value: unknown) {
  const row = asRecord(value);
  const result: Record<string, SpaceCanvasState> = {};
  for (const [key, canvas] of Object.entries(row)) {
    const state = normalizeCanvasState(canvas);
    const canvasId = state.id || numberValue(key);
    if (canvasId > 0) {
      result[String(canvasId)] = { ...state, id: canvasId };
    }
  }
  return result;
}

function hydrateCanvasPowers(
  canvases: Record<string, SpaceCanvasState>,
  powers: PowerOption[],
) {
  const byID = new Map(
    powers.filter((power) => power.id > 0).map((power) => [power.id, power]),
  );
  const byKey = new Map(
    powers.filter((power) => power.key).map((power) => [power.key, power]),
  );
  for (const canvas of Object.values(canvases)) {
    canvas.nodes = canvas.nodes.map((node) => {
      if (node.type !== "power" || !node.power) {
        return node;
      }
      const current =
        byID.get(Number(node.power.id || 0)) || byKey.get(node.power.key);
      if (!current) {
        return node;
      }
      const outputType =
        node.outputType || node.power.outputType || current.outputType;
      return {
        ...node,
        outputType,
        power: {
          ...current,
          outputType,
          output:
            current.outputType === outputType
              ? current.output
              : node.power.output,
        },
      };
    });
  }
  return canvases;
}

export function hydrateCanvasPowerCatalog(
  canvas: SpaceCanvasState,
  powers: PowerOption[],
) {
  const key = String(canvas.id);
  return hydrateCanvasPowers({ [key]: canvas }, powers)[key];
}

function normalizeCanvasNode(
  value: Record<string, unknown>,
): SpaceCanvasNode | null {
  const id = stringValue(value.id);
  const type = stringValue(value.type) as SpaceCanvasNode["type"];
  if (!id || !type) {
    return null;
  }
  const persistedRunError = stringValue(value.run_error);
  const rawTitle = stringValue(value.title);
  const functionOption = normalizeCanvasFunctionOption(
    value.function_option,
    rawTitle,
  );
  const rawDescription = stringValue(value.description);
  const legacyImportNode = functionOption?.key === "import";
  const node: SpaceCanvasNode = {
    id,
    nodeNo: numberValue(value.node_no) || undefined,
    type,
    title: legacyImportNode && rawTitle === "导入" ? "引用" : rawTitle,
    titleMode:
      stringValue(value.title_mode) === "manual"
        ? "manual"
        : stringValue(value.title_mode) === "auto"
          ? "auto"
          : undefined,
    subtitle: stringValue(value.subtitle),
    description:
      legacyImportNode &&
      (!rawDescription || rawDescription === "导入资产并连接到当前节点。")
        ? "选择资产并引用到当前节点。"
        : rawDescription,
    x: numberValue(value.x),
    y: numberValue(value.y),
    width: numberValue(value.width),
    height: numberValue(value.height),
    groupId: stringValue(value.group_id),
    group: normalizeCanvasGroup(value.group),
    storyboardItem: normalizeCanvasStoryboardItem(value.storyboard_item),
    storyboardMaterializedSignature: stringValue(
      value.storyboard_materialized_signature,
    ),
    storyboardFramePlanVersion: normalizeStoryboardFramePlanVersion(
      value.storyboard_frame_plan_version,
    ),
    assetCateId: numberValue(value.asset_cate_id),
    outputType: stringValue(value.output_type),
    count: value.count == null ? undefined : numberValue(value.count),
    functionOption,
    composerDraft: normalizePersistedCanvasComposerDraft(value.composer_draft),
    resultRef: normalizeCanvasResultRef(value.result_ref),
    runTiming: normalizeCanvasNodeRunTiming(value.run_timing),
    resultOutput: value.result_output,
    resultView: normalizeCanvasResultView(value.result_view),
    runError: isCanvasRunCanceledError(persistedRunError)
      ? ""
      : persistedRunError,
    local: value.local !== false,
  };
  const kind = stringValue(value.kind) as SpaceCanvasNode["kind"];
  const cardinality = stringValue(
    value.cardinality,
  ) as SpaceCanvasNode["cardinality"];
  const flow = normalizeCanvasFlow(value.flow);
  const role = normalizeCanvasRole(value.role);
  const asset = normalizeCanvasAssetRef(value.asset);
  const power = normalizeCanvasPower(value.power);
  if (kind) {
    node.kind = kind;
  }
  if (cardinality) {
    node.cardinality = cardinality;
  }
  if (flow) {
    node.flow = flow;
  }
  if (role) {
    node.role = role;
  }
  if (asset) {
    node.asset = asset;
  }
  if (power) {
    node.power = power;
    node.outputType = node.outputType || power.outputType;
    if (
      isStoryboardPowerType(power) &&
      node.width === LEGACY_STORYBOARD_NODE_SIZE.width &&
      node.height === LEGACY_STORYBOARD_NODE_SIZE.height
    ) {
      node.width = DEFAULT_STORYBOARD_NODE_SIZE.width;
      node.height = DEFAULT_STORYBOARD_NODE_SIZE.height;
    }
  }
  return node;
}

function normalizeCanvasResultView(value: unknown) {
  const row = asRecord(value);
  const width = finiteNumber(row.width);
  const height = finiteNumber(row.height);
  if (width == null || height == null || width <= 0 || height <= 0) {
    return undefined;
  }
  const offsetX = finiteNumber(row.offset_x);
  const offsetY = finiteNumber(row.offset_y);
  return {
    width,
    height,
    ...(offsetX == null ? {} : { offsetX }),
    ...(offsetY == null ? {} : { offsetY }),
  };
}

function normalizeCanvasGroup(value: unknown) {
  const row = asRecord(value);
  if (!Object.keys(row).length) {
    return undefined;
  }
  return {
    origin: stringValue(row.origin),
    sourceNodeId: stringValue(row.source_node_id),
    syncKey: stringValue(row.sync_key),
    layoutKey: stringValue(row.layout_key),
  };
}

function normalizeCanvasStoryboardItem(value: unknown) {
  const row = asRecord(value);
  const sourceNodeId = stringValue(row.source_node_id);
  const itemType = stringValue(row.item_type);
  const itemId = stringValue(row.item_id);
  if (
    !sourceNodeId ||
    !itemId ||
    ![
      "character",
      "scene",
      "prop",
      "shot_image",
      "shot",
      "speech",
      "subtitle",
      "lip_sync",
      "video_compose",
    ].includes(itemType)
  ) {
    return undefined;
  }
  return {
    sourceNodeId,
    itemType: itemType as
      | "character"
      | "scene"
      | "prop"
      | "shot_image"
      | "shot"
      | "speech"
      | "subtitle"
      | "lip_sync"
      | "video_compose",
    itemId,
    generatedPrompt: stringValue(row.generated_prompt),
    dependencyNodeIds: stringArray(row.dependency_node_ids),
    referenceNodeIds: stringArray(row.reference_node_ids),
    externalReferenceAssetIds: numberArray(row.external_reference_asset_ids),
    shotId: stringValue(row.shot_id),
    shotImageMode: parseStoryboardShotImageMode(row.shot_image_mode),
    frameRole: parseStoryboardFrameRole(row.frame_role),
    frameMediaItems: normalizeStoryboardFrameMediaItems(row.frame_media_items),
    imageSequenceFrames: normalizeStoryboardImageSequenceFrames(
      row.image_sequence_frames,
    ),
    speechId: stringValue(row.speech_id),
    speechIds: stringArray(row.speech_ids),
    characterId: stringValue(row.character_id),
    speechKind: stringValue(row.speech_kind) as "dialogue" | "narration",
    speakerMode: stringValue(row.speaker_mode) as "visible" | "offscreen",
    startTime: finiteNumber(row.start_time),
    shotDuration: finiteNumber(row.shot_duration),
    requiredDurationValues: normalizeStoryboardRequiredDurationValues(
      row.required_duration_values,
    ),
    continuityAnchor: stringValue(row.continuity_anchor),
    optional:
      row.optional === true ||
      row.optional === 1 ||
      String(row.optional || "").toLowerCase() === "true",
    sourceSignature: stringValue(row.source_signature),
    resultSourceSignature: stringValue(row.result_source_signature),
    stale:
      row.stale === true ||
      row.stale === 1 ||
      String(row.stale || "").toLowerCase() === "true",
  };
}

function normalizeCanvasFlow(value: unknown) {
  const row = asRecord(value);
  const id = numberValue(row.id);
  const key = stringValue(row.key);
  const name = stringValue(row.name);
  if (!id && !key && !name) {
    return undefined;
  }
  return {
    id,
    key,
    name,
    goal: stringValue(row.goal),
  } as TeamFlow;
}

function normalizeCanvasRole(value: unknown) {
  const row = asRecord(value);
  const id = numberValue(row.id);
  const name = stringValue(row.name);
  if (!id && !name) {
    return undefined;
  }
  return {
    id,
    name,
    role_type: stringValue(row.role_type),
    agent_id: numberValue(row.agent_id),
  } as TeamRole;
}

function normalizeCanvasAssetRef(value: unknown) {
  const row = asRecord(value);
  const id = numberValue(row.id);
  if (!id) {
    return undefined;
  }
  return {
    id,
    project_id: 0,
    body_id: 0,
    team_id: 0,
    flow_id: 0,
    asset_cate_id: numberValue(row.asset_cate_id),
    name: stringValue(row.name),
    kind: stringValue(row.kind) as ProjectAsset["kind"],
    role: stringValue(row.role) as ProjectAsset["role"],
    version_id: numberValue(row.version_id),
    sort: 0,
  } as ProjectAsset;
}

function normalizeCanvasPower(value: unknown) {
  const row = asRecord(value);
  const id = numberValue(row.id);
  const key = stringValue(row.key);
  if (!id && !key) {
    return undefined;
  }
  return normalizePower({
    ...row,
    id,
    key,
    name: stringValue(row.name),
  });
}

export function normalizeCanvasComposerDraft(value: unknown) {
  const row = asRecord(value);
  if (!Object.keys(row).length) {
    return undefined;
  }
  const storyboardGridLayout = stringValue(row.storyboardGridLayout);
  return {
    prompt: stringValue(row.prompt),
    promptContent: normalizeCanvasReferenceContent(row.promptContent),
    paramValues: asRecord(row.paramValues),
    paramBindings: normalizeCanvasParamBindings(row.paramBindings),
    selectedTargetId: numberValue(row.selectedTargetId),
    videoComposition: normalizeVideoComposition(row.videoComposition),
    storyboardReferences: normalizeStoryboardReferences(
      row.storyboardReferences,
    ),
    storyboardWorkType: normalizeStoryboardWorkType(row.storyboardWorkType),
    storyboardLyricsSourceNodeId: stringValue(row.storyboardLyricsSourceNodeId),
    minShotDuration: parseStoryboardMinShotDuration(row.minShotDuration),
    storyboardRangeStartMs: normalizeStoryboardRangeMS(
      row.storyboardRangeStartMs,
      true,
    ),
    storyboardRangeEndMs: normalizeStoryboardRangeMS(
      row.storyboardRangeEndMs,
      false,
    ),
    storyboardGridLayout: storyboardGridLayout
      ? normalizeStoryboardGridLayout(storyboardGridLayout)
      : undefined,
    multiImageMode: normalizeCanvasMultiImageMode(row.multiImageMode),
  };
}

export function normalizeCanvasComposerDraftOrDefault(
  value: unknown,
): CanvasComposerDraft {
  return (
    normalizeCanvasComposerDraft(value) || {
      prompt: "",
      paramValues: {},
      selectedTargetId: 0,
    }
  );
}

export function readCanvasComposerDraft(value: unknown): CanvasComposerDraft {
  const draft = normalizeCanvasComposerDraftOrDefault(value);
  const contentPrompt = composerPromptFromReferenceContent(draft.promptContent);
  return contentPrompt ? { ...draft, prompt: contentPrompt } : draft;
}

export function canvasComposerDraftSignature(draft: CanvasComposerDraft) {
  return JSON.stringify([
    draft.prompt,
    draft.promptContent || null,
    draft.paramValues || {},
    draft.paramBindings || {},
    draft.selectedTargetId || 0,
    draft.storyboardReferences || [],
    draft.storyboardWorkType || "",
    draft.storyboardLyricsSourceNodeId || "",
    draft.minShotDuration || "",
    draft.storyboardRangeStartMs ?? "",
    draft.storyboardRangeEndMs ?? "",
    draft.storyboardGridLayout || "",
    draft.multiImageMode || "",
  ]);
}

export function canvasReferenceBindingSignature(
  content: CanvasComposerDraft["promptContent"],
) {
  return JSON.stringify(
    (content?.parts || []).filter((part) => part.type === "reference"),
  );
}

function composerPromptFromReferenceContent(
  content: CanvasComposerDraft["promptContent"],
) {
  if (!content?.parts?.some((part) => part.type === "reference")) {
    return "";
  }
  return content.parts
    .map((part) => {
      if (part.type === "text") {
        return part.text;
      }
      const label = String(part.label || "").trim();
      return label.startsWith("@") ? label : `@${label}`;
    })
    .join("");
}

function normalizeCanvasMultiImageMode(value: unknown) {
  const mode = stringValue(value);
  return mode === "per_image" || mode === "shared_reference" ? mode : undefined;
}

function normalizePersistedCanvasComposerDraft(value: unknown) {
  const row = asRecord(value);
  if (!Object.keys(row).length) {
    return undefined;
  }
  return normalizeCanvasComposerDraft({
    prompt: row.prompt,
    promptContent: row.prompt_content,
    paramValues: row.param_values,
    paramBindings: row.param_bindings,
    selectedTargetId: row.selected_target_id,
    videoComposition: row.video_composition,
    storyboardReferences: row.storyboard_references,
    storyboardWorkType: row.storyboard_work_type,
    storyboardLyricsSourceNodeId: row.storyboard_lyrics_source_node_id,
    minShotDuration: row.min_shot_duration,
    storyboardRangeStartMs: row.storyboard_range_start_ms,
    storyboardRangeEndMs: row.storyboard_range_end_ms,
    storyboardGridLayout: row.storyboard_grid_layout,
    multiImageMode: row.multi_image_mode,
  });
}

function normalizeStoryboardWorkType(value: unknown) {
  const workType = stringValue(value);
  return isStoryboardWorkTypeKey(workType) ? workType : undefined;
}

function normalizeStoryboardRangeMS(value: unknown, allowZero: boolean) {
  const milliseconds = finiteNumber(value);
  if (
    milliseconds == null ||
    !Number.isInteger(milliseconds) ||
    milliseconds < (allowZero ? 0 : 1)
  ) {
    return undefined;
  }
  return milliseconds;
}

function normalizeCanvasReferenceContent(value: unknown) {
  const row = asRecord(value);
  const parts = Array.isArray(row.parts)
    ? row.parts.filter((part) => {
        const item = asRecord(part);
        return item.type === "text" || item.type === "reference";
      })
    : [];
  if (Number(row.version) !== 1 || parts.length === 0) {
    return undefined;
  }
  return { version: 1 as const, parts } as CanvasComposerDraft["promptContent"];
}

function normalizeCanvasResultRef(value: unknown) {
  const row = asRecord(value);
  if (!Object.keys(row).length) {
    return undefined;
  }
  return {
    run_id: numberValue(row.run_id),
    request_id: stringValue(row.request_id),
    flow_run_id: numberValue(row.flow_run_id),
    node_run_id: numberValue(row.node_run_id),
    asset_id: numberValue(row.asset_id),
    version_id: numberValue(row.version_id),
    release_id: numberValue(row.release_id),
    role: stringValue(row.role),
    status: stringValue(row.status),
    updated_at: stringValue(row.updated_at),
  };
}

function normalizeCanvasEdge(
  value: Record<string, unknown>,
): SpaceCanvasEdge | null {
  const from = stringValue(value.from);
  const to = stringValue(value.to);
  if (!from || !to) {
    return null;
  }
  const purpose = stringValue(value.purpose);
  return {
    id: stringValue(value.id) || `edge-${from}-${to}`,
    from,
    to,
    logicalFrom: stringValue(value.logical_from) || undefined,
    logicalTo: stringValue(value.logical_to) || undefined,
    purpose:
      purpose === "media" || purpose === "structure" || purpose === "dependency"
        ? purpose
        : undefined,
    executionMode:
      stringValue(value.execution_mode) === "manual" ? "manual" : undefined,
    mediaUsage: stringValue(value.media_usage) || undefined,
  };
}

function normalizeCanvasViewport(value: unknown): SpaceCanvasViewport {
  const row = asRecord(value);
  const viewport: SpaceCanvasViewport = {};
  if (row.x != null) {
    viewport.x = numberValue(row.x);
  }
  if (row.y != null) {
    viewport.y = numberValue(row.y);
  }
  if (row.zoom != null) {
    viewport.zoom = numberValue(row.zoom);
  }
  return viewport;
}

function flowOutputAssetCateIds(flow: TeamFlow) {
  return new Set(flow.output_asset_cate_ids);
}

function defaultPowerName(kind: AssetKind) {
  switch (kind) {
    case "image":
      return "生图能力";
    case "video":
      return "生视频能力";
    case "audio":
      return "生音频能力";
    default:
      return "文生文能力";
  }
}

function nodeDefaultSize(
  type: SpaceCanvasNode["type"],
  power?: Pick<PowerOption, "kind" | "outputType" | "output">,
) {
  switch (type) {
    case "agent":
      return { width: 154, height: 154 };
    case "flow":
      return { width: 210, height: 160 };
    case "function":
      return { width: 128, height: 46 };
    case "group":
      return { ...DEFAULT_GROUP_NODE_SIZE };
    case "power":
      return powerNodeDefaultSize(power);
    default:
      return { width: 250, height: 170 };
  }
}

export function powerNodeDefaultSize(
  power?: Pick<PowerOption, "kind" | "outputType" | "output">,
) {
  if (isAudioPowerType(power)) {
    return { ...DEFAULT_AUDIO_POWER_NODE_SIZE };
  }
  if (isStoryboardPowerType(power)) {
    return { ...DEFAULT_STORYBOARD_NODE_SIZE };
  }
  const configuredSize = configuredPowerNodeSize(power);
  if (configuredSize) {
    return configuredSize;
  }
  return { ...DEFAULT_POWER_NODE_SIZE };
}

function configuredPowerNodeSize(power?: Pick<PowerOption, "output">) {
  const width = Number(power?.output?.defaultWidth || 0);
  const height = Number(power?.output?.defaultHeight || 0);
  return width > 0 && height > 0 ? { width, height } : null;
}

export function hasDefaultCanvasNodeSize(
  node: Pick<
    SpaceCanvasNode,
    "type" | "width" | "height" | "kind" | "outputType" | "power"
  >,
) {
  const defaultSize = nodeDefaultSize(
    node.type,
    node.power || {
      kind: String(node.kind || ""),
      outputType: node.outputType || "",
    },
  );
  return node.width === defaultSize.width && node.height === defaultSize.height;
}

function stringArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.map(stringValue).filter(Boolean);
}

function numberArray(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }
  const result: number[] = [];
  const used = new Set<number>();
  for (const current of value) {
    const number = numberValue(current);
    if (!number || number <= 0 || used.has(number)) {
      continue;
    }
    used.add(number);
    result.push(number);
  }
  return result;
}

function asRecords(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function asRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function stringValue(value: unknown) {
  if (value == null) {
    return "";
  }
  return String(value).trim();
}
