import type {
  AssetCardinality,
  AssetCate,
  AssetKind,
  AssetVersion,
  CanvasComposerDraft,
  CanvasFunctionOption,
  OutputTypeOption,
  PowerKindOption,
  PowerOption,
  ProjectAsset,
  SpaceBootstrap,
  SpaceCanvasEdge,
  SpaceCanvasNode,
  SpaceCanvasState,
  SpaceCanvasViewport,
  TeamFlow,
  TeamFlowNode,
  TeamRole,
  WorkProject,
  WorkRelease,
  WorkTeam,
} from "./types";
import { assetKindLabel } from "../asset/asset-contract";
import { DEFAULT_GROUP_NODE_SIZE } from "./space-group-model";
import {
  isAudioPowerType,
  isStoryboardPowerType,
  powerKindLabel,
  resolvePowerPresentation,
} from "./space-power-presentation";
import { normalizeVideoComposition } from "./space-video-compose";

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
const LEGACY_AUDIO_POWER_NODE_SIZES = [
  { width: 360, height: 64 },
  { width: 280, height: 210 },
] as const;
const DEFAULT_STORYBOARD_NODE_SIZE = { width: 620, height: 360 } as const;

export function normalizeSpaceBootstrap(value: unknown): SpaceBootstrap {
  const row = asRecord(value);
  const canvasConfig = asRecord(row.canvas_config);
  const powers = asRecords(firstDefined(row.powers, canvasConfig.powers)).map(
    normalizePower,
  );
  const canvases = hydrateCanvasPowers(
    normalizeCanvases(firstDefined(row.canvases, row.canvas)),
    powers,
  );
  return {
    project: normalizeProject(row.project),
    team: normalizeTeam(row.team || row.type),
    release: normalizeRelease(row.release),
    assetCates: asRecords(
      firstDefined(row.asset_cates, asRecord(row.team).asset_cates),
    ).map(normalizeAssetCate),
    roles: asRecords(
      firstDefined(row.roles, asRecord(row.team).roles, canvasConfig.roles),
    ).map(normalizeRole),
    flows: asRecords(firstDefined(row.flows, asRecord(row.team).flows)).map(
      normalizeFlow,
    ),
    nodesByFlow: normalizeNodesByFlow(
      firstDefined(row.nodes_by_flow, asRecord(row.team).nodes_by_flow),
    ),
    canvases,
    assets: asRecords(firstDefined(asRecord(row.assets).items, row.assets)).map(
      normalizeAsset,
    ),
    powers,
    powerKinds: asRecords(
      firstDefined(row.power_kinds, canvasConfig.power_kinds),
    ).map(normalizePowerKind),
    outputTypes: asRecords(
      firstDefined(row.output_types, canvasConfig.output_types),
    ).map(normalizeOutputType),
    initialAssetCateId: numberValue(row.active_asset_cate_id),
  };
}

export function emptyCanvasState(assetCateId: number): SpaceCanvasState {
  return {
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
    const presentation = resolvePowerPresentation(
      node.power,
      node.kind,
      node.outputType,
    );
    label =
      (presentation.outputType !== "general" && presentation.outputName) ||
      presentation.kindName ||
      "能力";
  } else if (node.type === "agent") {
    label = String(node.role?.name || "智能体").trim() || "智能体";
  } else if (node.type === "flow") {
    label = String(node.flow?.name || "流程").trim() || "流程";
  }
  return `${label}-${nodeNo}`;
}

export function normalizePowerCatalog(value: unknown): {
  powers: PowerOption[];
  powerKinds: PowerKindOption[];
  outputTypes: OutputTypeOption[];
} {
  const row = asRecord(value);
  return {
    powers: asRecords(row.powers).map(normalizePower),
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

export function assetsForCate(space: SpaceBootstrap, assetCateId: number) {
  if (assetCateId === 0 && space.assetCates.length === 0) {
    return space.assets;
  }
  return space.assets.filter((asset) => asset.asset_cate_id === assetCateId);
}

export function relatedFlows(space: SpaceBootstrap, assetCateId: number) {
  if (assetCateId === 0) {
    return space.flows.slice(0, 4);
  }
  return space.flows
    .filter((flow) => flowOutputAssetCateIds(space, flow).has(assetCateId))
    .slice(0, 4);
}

export function isExecutionRole(role: TeamRole) {
  return role.role_type === "worker" || role.role_type === "default_worker";
}

export function isCreationRole(role: TeamRole) {
  return role.create_status !== 2;
}

export function isCreationPower(power: PowerOption) {
  return power.createStatus !== 2;
}

export function executionRole(space: SpaceBootstrap) {
  return space.roles.find(isExecutionRole) || null;
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
      selectedFunction?.description || "开始、导入、保存、展示等功能节点。",
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

export function cardinalityLabel(cardinality: AssetCardinality) {
  switch (cardinality) {
    case "multiple":
      return "多个";
    case "ordered":
      return "有序多个";
    default:
      return "单个";
  }
}

export function documentPreview(content: unknown): string {
  const text = documentText(content);
  if (text) {
    return text.length > 120 ? `${text.slice(0, 120)}...` : text;
  }
  return "";
}

export function documentText(content: unknown): string {
  return collectDocumentText(content).replace(/\s+/g, " ").trim();
}

export function looseRichJSONText(content: unknown): string {
  if (typeof content !== "string") {
    return "";
  }
  const text = content.trim();
  if (!isLikelyRichJSONSnippet(text)) {
    return "";
  }
  const richStart = text.search(/"rich"\s*:/);
  const source = richStart >= 0 ? text.slice(richStart) : text;
  const pieces: string[] = [];
  const textField = /"text"\s*:\s*"((?:\\.|[^"\\])*)"/g;
  let match: RegExpExecArray | null = null;
  while ((match = textField.exec(source)) !== null) {
    const value = decodeJSONStringFragment(match[1]).trim();
    if (value) {
      pieces.push(value);
    }
  }
  return pieces.join(" ").replace(/\s+/g, " ").trim();
}

export function richDocument(content: unknown): RichDocumentNode | null {
  const doc = findRichDocument(content, new Set());
  return hasVisibleRichDocument(doc) ? doc : null;
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
  const nestedTeam = asRecord(row.team);
  const team =
    numberValue(nestedTeam.id) > 0 || stringValue(nestedTeam.name)
      ? nestedTeam
      : row;
  return {
    id: numberValue(team.id),
    name: stringValue(team.name) || "自由团队",
    description: stringValue(team.description),
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
  };
}

function normalizeFlowNode(value: Record<string, unknown>): TeamFlowNode {
  return {
    id: numberValue(value.id),
    node_key: stringValue(value.node_key),
    name: stringValue(value.name),
    type: stringValue(value.type),
    role_id: numberValue(value.role_id),
    role_key: stringValue(value.role_key),
    agent_id: numberValue(value.agent_id),
    power_id: numberValue(value.power_id),
    sub_team_id: numberValue(value.sub_team_id),
    asset_cate_id: numberValue(value.asset_cate_id),
    config: asRecord(value.config),
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
    key: stringValue(value.key || value.id),
    name: stringValue(value.name || value.value),
    allowedKinds: stringArray(value.allowed_kinds || value.allowedKinds),
    viewMode: stringValue(value.view_mode || value.viewMode),
    defaultWidth: numberValue(value.default_width || value.defaultWidth),
    defaultHeight: numberValue(value.default_height || value.defaultHeight),
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

function normalizeNodesByFlow(value: unknown) {
  const row = asRecord(value);
  const result: Record<string, TeamFlowNode[]> = {};
  for (const [key, items] of Object.entries(row)) {
    result[key] = asRecords(items).map(normalizeFlowNode);
  }
  return result;
}

function normalizeCanvases(value: unknown) {
  const row = asRecord(value);
  const result: Record<string, SpaceCanvasState> = {};
  for (const [key, canvas] of Object.entries(row)) {
    const state = normalizeCanvasState(canvas, numberValue(key));
    result[String(state.assetCateId)] = state;
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
      return normalizePowerNodeSize({
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
      });
    });
  }
  return canvases;
}

export function hydrateCanvasPowerCatalog(
  canvas: SpaceCanvasState,
  powers: PowerOption[],
) {
  return hydrateCanvasPowers(
    { [String(canvas.assetCateId)]: canvas },
    powers,
  )[String(canvas.assetCateId)];
}

function normalizeCanvasNode(
  value: Record<string, unknown>,
): SpaceCanvasNode | null {
  const id = stringValue(value.id);
  const type = stringValue(value.type) as SpaceCanvasNode["type"];
  if (!id || !type) {
    return null;
  }
  const node: SpaceCanvasNode = {
    id,
    nodeNo: numberValue(firstDefined(value.node_no, value.nodeNo)) || undefined,
    type,
    title: stringValue(value.title),
    titleMode:
      stringValue(firstDefined(value.title_mode, value.titleMode)) === "manual"
        ? "manual"
        : stringValue(firstDefined(value.title_mode, value.titleMode)) ===
            "auto"
          ? "auto"
          : undefined,
    subtitle: stringValue(value.subtitle),
    description: stringValue(value.description),
    x: numberValue(value.x),
    y: numberValue(value.y),
    width: numberValue(value.width),
    height: numberValue(value.height),
    groupId: stringValue(firstDefined(value.group_id, value.groupId)),
    group: normalizeCanvasGroup(value.group),
    storyboardItem: normalizeCanvasStoryboardItem(
      firstDefined(
        value.storyboard_item,
        value.storyboardItem,
        value.storyboard_material,
        value.storyboardMaterial,
      ),
    ),
    assetCateId: numberValue(value.asset_cate_id),
    outputType: stringValue(value.output_type),
    count: value.count == null ? undefined : numberValue(value.count),
    functionOption: normalizeCanvasFunctionOption(value.function_option),
    composerDraft: normalizeCanvasComposerDraft(value.composer_draft),
    resultRef: normalizeCanvasResultRef(value.result_ref),
    resultOutput: firstDefined(value.result_output, value.resultOutput),
    resultView: normalizeCanvasResultView(
      firstDefined(value.result_view, value.resultView),
    ),
    runError: stringValue(firstDefined(value.run_error, value.runError)),
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
  }
  return normalizePowerNodeSize(node);
}

function normalizePowerNodeSize(node: SpaceCanvasNode) {
  const storyboardNode = normalizeStoryboardNodeSize(node);
  const sizeUpgrade = audioPowerNodeSizeUpgrade(storyboardNode);
  return sizeUpgrade ? { ...storyboardNode, ...sizeUpgrade } : storyboardNode;
}

function normalizeStoryboardNodeSize(node: SpaceCanvasNode) {
  if (
    node.type !== "power" ||
    !isStoryboardPowerType(node.power, node.kind, node.outputType) ||
    node.width !== DEFAULT_POWER_NODE_SIZE.width ||
    node.height !== DEFAULT_POWER_NODE_SIZE.height
  ) {
    return node;
  }
  return {
    ...node,
    ...DEFAULT_STORYBOARD_NODE_SIZE,
  };
}

function normalizeCanvasResultView(value: unknown) {
  const row = asRecord(value);
  const width = finiteNumber(row.width);
  const height = finiteNumber(row.height);
  if (width == null || height == null || width <= 0 || height <= 0) {
    return undefined;
  }
  const offsetX = finiteNumber(firstDefined(row.offset_x, row.offsetX));
  const offsetY = finiteNumber(firstDefined(row.offset_y, row.offsetY));
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
    sourceNodeId: stringValue(
      firstDefined(row.source_node_id, row.sourceNodeId),
    ),
    syncKey: stringValue(firstDefined(row.sync_key, row.syncKey)),
    layoutKey: stringValue(firstDefined(row.layout_key, row.layoutKey)),
  };
}

function normalizeCanvasStoryboardItem(value: unknown) {
  const row = asRecord(value);
  const sourceNodeId = stringValue(
    firstDefined(row.source_node_id, row.sourceNodeId),
  );
  const itemType = stringValue(
    firstDefined(
      row.item_type,
      row.itemType,
      row.material_type,
      row.materialType,
    ),
  );
  const itemId = stringValue(
    firstDefined(row.item_id, row.itemId, row.material_id, row.materialId),
  );
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
    generatedPrompt: stringValue(
      firstDefined(row.generated_prompt, row.generatedPrompt),
    ),
    dependencyNodeIds: stringArray(
      firstDefined(row.dependency_node_ids, row.dependencyNodeIds),
    ),
    referenceNodeIds: stringArray(
      firstDefined(row.reference_node_ids, row.referenceNodeIds),
    ),
    shotId: stringValue(firstDefined(row.shot_id, row.shotId)),
    speechId: stringValue(firstDefined(row.speech_id, row.speechId)),
    speechIds: stringArray(firstDefined(row.speech_ids, row.speechIds)),
    characterId: stringValue(
      firstDefined(row.character_id, row.characterId),
    ),
    speechKind: stringValue(
      firstDefined(row.speech_kind, row.speechKind),
    ) as "dialogue" | "narration",
    speakerMode: stringValue(
      firstDefined(row.speaker_mode, row.speakerMode),
    ) as "visible" | "offscreen",
    startTime: finiteNumber(firstDefined(row.start_time, row.startTime)),
    shotDuration: finiteNumber(
      firstDefined(row.shot_duration, row.shotDuration),
    ),
    continuityAnchor: stringValue(
      firstDefined(row.continuity_anchor, row.continuityAnchor),
    ),
    optional:
      row.optional === true ||
      row.optional === 1 ||
      String(row.optional || "").toLowerCase() === "true",
    sourceSignature: stringValue(
      firstDefined(row.source_signature, row.sourceSignature),
    ),
    resultSourceSignature: stringValue(
      firstDefined(row.result_source_signature, row.resultSourceSignature),
    ),
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

function normalizeCanvasFunctionOption(value: unknown) {
  const row = asRecord(value);
  const key = stringValue(row.key);
  if (!key) {
    return undefined;
  }
  return {
    key,
    label: stringValue(row.label),
    description: stringValue(row.description),
  };
}

export function normalizeCanvasComposerDraft(value: unknown) {
  const row = asRecord(value);
  if (!Object.keys(row).length) {
    return undefined;
  }
  return {
    prompt: stringValue(row.prompt),
    promptContent: normalizeCanvasReferenceContent(
      firstDefined(row.promptContent, row.prompt_content),
    ),
    paramValues: asRecord(firstDefined(row.paramValues, row.param_values)),
    selectedTargetId: numberValue(
      firstDefined(row.selectedTargetId, row.selected_target_id),
    ),
    videoComposition: normalizeVideoComposition(
      firstDefined(row.videoComposition, row.video_composition),
    ),
  };
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
    execution_id: numberValue(row.execution_id),
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
  return {
    id: stringValue(value.id) || `edge-${from}-${to}`,
    from,
    to,
    logicalFrom:
      stringValue(firstDefined(value.logical_from, value.logicalFrom)) ||
      undefined,
    logicalTo:
      stringValue(firstDefined(value.logical_to, value.logicalTo)) || undefined,
    executionMode:
      stringValue(firstDefined(value.execution_mode, value.executionMode)) ===
      "manual"
        ? "manual"
        : undefined,
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

function flowOutputAssetCateIds(space: SpaceBootstrap, flow: TeamFlow) {
  const ids = new Set<number>();
  for (const node of space.nodesByFlow[flow.key] || []) {
    if (String(node.type || "").toLowerCase() !== "save") {
      continue;
    }
    const id = numberValue(
      firstDefined(node.asset_cate_id, node.config?.asset_cate_id),
    );
    if (id > 0) {
      ids.add(id);
    }
  }
  return ids;
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
  const configuredSize = configuredPowerNodeSize(power);
  if (configuredSize) {
    return configuredSize;
  }
  return isStoryboardPowerType(power)
    ? { ...DEFAULT_STORYBOARD_NODE_SIZE }
    : { ...DEFAULT_POWER_NODE_SIZE };
}

export function audioPowerNodeSizeUpgrade(
  node: Pick<
    SpaceCanvasNode,
    "type" | "width" | "height" | "kind" | "power"
  >,
) {
  if (node.type !== "power" || !isAudioPowerType(node.power, node.kind)) {
    return null;
  }
  const legacySize =
    configuredPowerNodeSize(node.power) || DEFAULT_POWER_NODE_SIZE;
  const usesLegacySize =
    (node.width === legacySize.width && node.height === legacySize.height) ||
    LEGACY_AUDIO_POWER_NODE_SIZES.some(
      (size) => node.width === size.width && node.height === size.height,
    );
  return usesLegacySize
    ? { ...DEFAULT_AUDIO_POWER_NODE_SIZE }
    : null;
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

export type RichDocumentNode = {
  type: string;
  attrs?: Record<string, unknown>;
  content?: RichDocumentNode[];
  marks?: Array<{ type: string; attrs?: Record<string, unknown> }>;
  text?: string;
};

const richMediaAliases: Record<string, string> = {
  audio: "editorMediaAudio",
  image: "editorMediaImage",
  mediaAudio: "editorMediaAudio",
  mediaImage: "editorMediaImage",
  mediaVideo: "editorMediaVideo",
  video: "editorMediaVideo",
};

const richWrapperKeys = [
  "rich",
  "value",
  "doc",
  "document",
  "content",
  "data",
  "output",
  "result",
  "body",
] as const;

function collectDocumentText(value: unknown): string {
  if (typeof value === "string") {
    const text = value.trim();
    if (looksLikeJSON(text)) {
      const parsed = parseJSONValue(text);
      if (parsed !== undefined) {
        const parsedText = collectDocumentText(parsed).trim();
        if (parsedText) {
          return parsedText;
        }
        return "";
      }
    }
    const looseText = looseRichJSONText(text);
    if (looseText) {
      return looseText;
    }
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(collectDocumentText).filter(Boolean).join(" ");
  }
  if (!value || typeof value !== "object") {
    return "";
  }
  const row = value as Record<string, unknown>;
  const rich = richDocument(row);
  if (rich) {
    return collectRichDocumentText(rich);
  }
  const text = typeof row.text === "string" ? row.text : "";
  const pieces = [text, typeof row.markdown === "string" ? row.markdown : ""];
  for (const key of richWrapperKeys) {
    if (row[key] != null) {
      pieces.push(collectDocumentText(row[key]));
    }
  }
  return pieces.filter(Boolean).join(" ");
}

function findRichDocument(
  value: unknown,
  seen: Set<unknown>,
): RichDocumentNode | null {
  if (typeof value === "string") {
    const text = value.trim();
    if (!looksLikeJSON(text)) {
      return null;
    }
    const parsed = parseJSONValue(text);
    return parsed === undefined ? null : findRichDocument(parsed, seen);
  }
  if (Array.isArray(value)) {
    const doc = normalizeRichDocument({ type: "doc", content: value });
    if (hasVisibleRichDocument(doc)) {
      return doc;
    }
    for (const item of value) {
      const nested = findRichDocument(item, seen);
      if (nested) {
        return nested;
      }
    }
    return null;
  }
  if (!value || typeof value !== "object") {
    return null;
  }
  if (seen.has(value)) {
    return null;
  }
  seen.add(value);

  const row = value as Record<string, unknown>;
  const direct = normalizeRichDocument(row);
  if (direct) {
    return direct;
  }

  if (
    String(row.format || "").toLowerCase() === "rich_json" &&
    row.rich != null
  ) {
    const rich = findRichDocument(row.rich, seen);
    if (rich) {
      return rich;
    }
  }

  for (const key of richWrapperKeys) {
    if (row[key] == null) {
      continue;
    }
    const rich = findRichDocument(row[key], seen);
    if (rich) {
      return rich;
    }
  }
  return null;
}

function normalizeRichDocument(value: unknown): RichDocumentNode | null {
  if (!isRecord(value)) {
    return null;
  }
  const type = normalizeRichNodeType(value.type);
  if (type === "doc") {
    return {
      type: "doc",
      attrs: isRecord(value.attrs) ? value.attrs : undefined,
      content: normalizeRichContent(value.content),
    };
  }
  return null;
}

function normalizeRichContent(content: unknown): RichDocumentNode[] {
  if (!Array.isArray(content)) {
    return [];
  }
  return content
    .map(normalizeRichNode)
    .filter((node): node is RichDocumentNode => Boolean(node));
}

function normalizeRichNode(value: unknown): RichDocumentNode | null {
  if (!isRecord(value)) {
    return null;
  }
  const type = normalizeRichNodeType(value.type) || inferRichNodeType(value);
  if (!type) {
    return null;
  }
  const node: RichDocumentNode = { type };
  const attrs = isRecord(value.attrs) ? { ...value.attrs } : {};
  if (type === "heading" && numberValue(attrs.level) <= 0) {
    const level = numberValue(value.level);
    if (level > 0) {
      attrs.level = level;
    }
  }
  if (Object.keys(attrs).length > 0) {
    node.attrs = attrs;
  }
  const marks = normalizeRichMarks(value.marks);
  if (marks.length > 0) {
    node.marks = marks;
  }
  if (type === "text") {
    const text = stringValue(value.text);
    if (!text) {
      return null;
    }
    node.text = text;
    return node;
  }
  const children = normalizeRichContent(value.content);
  if (children.length > 0) {
    node.content = children;
  }
  return node;
}

function inferRichNodeType(value: Record<string, unknown>) {
  if (typeof value.text === "string") {
    return "text";
  }
  const attrs = isRecord(value.attrs) ? value.attrs : {};
  if (numberValue(attrs.level) > 0 || numberValue(value.level) > 0) {
    return "heading";
  }
  return "";
}

function normalizeRichMarks(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map((mark) => {
      if (!isRecord(mark)) {
        return null;
      }
      const type = stringValue(mark.type);
      if (!type) {
        return null;
      }
      return {
        type,
        attrs: isRecord(mark.attrs) ? mark.attrs : undefined,
      };
    })
    .filter((mark): mark is { type: string; attrs?: Record<string, unknown> } =>
      Boolean(mark),
    );
}

function normalizeRichNodeType(value: unknown) {
  const type = stringValue(value);
  return richMediaAliases[type] || type;
}

function collectRichDocumentText(node: RichDocumentNode | null): string {
  if (!node) {
    return "";
  }
  if (node.type === "text") {
    return node.text || "";
  }
  if (
    node.type === "editorMediaImage" ||
    node.type === "editorMediaVideo" ||
    node.type === "editorMediaAudio"
  ) {
    return stringValue(node.attrs?.alt || node.attrs?.title || node.attrs?.src);
  }
  return (node.content || [])
    .map(collectRichDocumentText)
    .filter(Boolean)
    .join(" ");
}

function hasVisibleRichDocument(node: RichDocumentNode | null): boolean {
  if (!node) {
    return false;
  }
  if (node.type === "text") {
    return Boolean(stringValue(node.text));
  }
  if (
    node.type === "editorMediaImage" ||
    node.type === "editorMediaVideo" ||
    node.type === "editorMediaAudio"
  ) {
    return Boolean(stringValue(node.attrs?.src));
  }
  return (node.content || []).some(hasVisibleRichDocument);
}

function looksLikeJSON(value: string) {
  return (
    (value.startsWith("{") && value.endsWith("}")) ||
    (value.startsWith("[") && value.endsWith("]"))
  );
}

function parseJSONValue(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

function isLikelyRichJSONSnippet(value: string) {
  return (
    value.includes("rich_json") ||
    value.includes('"rich"') ||
    value.includes("agent_run_id") ||
    value.includes("node_run_id")
  );
}

function decodeJSONStringFragment(value: string) {
  try {
    return JSON.parse(`"${value}"`);
  } catch {
    return value
      .replace(/\\"/g, '"')
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\\\/g, "\\");
  }
}

function asRecords(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter(isRecord) : [];
}

function asRecord(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value != null && typeof value === "object" && !Array.isArray(value);
}

function firstDefined(...values: unknown[]) {
  return values.find((value) => value !== undefined && value !== null);
}

function numberValue(value: unknown) {
  const number = Number(value || 0);
  return Number.isFinite(number) ? number : 0;
}

function finiteNumber(value: unknown) {
  if (value == null || value === "") {
    return undefined;
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function stringValue(value: unknown) {
  if (value == null) {
    return "";
  }
  return String(value).trim();
}
