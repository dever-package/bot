import type { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import type {
  AgentCateOption,
  AgentOption,
  CanvasPoint,
  FlowItem,
  NodeEdge,
  PowerOption,
  RoleOption,
  Selection,
  TeamNode,
  TeamOption,
  ViewMode,
  WorkspaceData,
} from "./types";
import {
  CONDITION_OPERATORS,
  EDGE_CONDITIONS,
  NODE_TYPES,
  ROLE_TYPES,
  TEAM_PUBLISH_DRAFT,
  TEAM_PUBLISH_EDITING,
  TEAM_PUBLISH_PUBLISHED,
  VISIBLE_NODE_TYPE_IDS,
} from "./constants";

export function buildTeamBindingOptions({
  currentTeamID,
  currentTeamName,
  flows,
  roles,
  teams,
}: {
  currentTeamID: number;
  currentTeamName: string;
  flows: FlowItem[];
  roles: RoleOption[];
  teams: TeamOption[];
}) {
  const byID = new Map<number, TeamOption>();
  if (currentTeamID) {
    byID.set(currentTeamID, {
      id: currentTeamID,
      name: currentTeamName || "当前团队",
      flows,
      roles: roles.map((role) => ({
        ...role,
        team_id: Number(role.team_id || currentTeamID),
      })),
    });
  }
  teams.forEach((team) => {
    if (!team?.id) {
      return;
    }
    const existing = byID.get(team.id);
    const keepCurrentDraft = team.id === currentTeamID && Boolean(existing);
    const flowsSource = keepCurrentDraft
      ? existing?.flows
      : (team.flows ?? existing?.flows ?? []);
    const rolesSource = keepCurrentDraft
      ? existing?.roles
      : (team.roles ?? existing?.roles ?? []);
    byID.set(team.id, {
      ...existing,
      ...team,
      name: keepCurrentDraft
        ? existing?.name || team.name || ""
        : team.name || existing?.name || "",
      flows: (flowsSource ?? []).map(normalizeFlowItem),
      roles: (rolesSource ?? []).map((role) => ({
        ...role,
        team_id: Number(role.team_id || team.id),
      })),
    });
  });
  return Array.from(byID.values());
}

export function findTeamOption(teams: TeamOption[], teamID: number) {
  return teams.find((team) => Number(team.id) === Number(teamID));
}

export function findRoleInTeams(teams: TeamOption[], roleID: number) {
  if (!roleID) {
    return undefined;
  }
  for (const team of teams) {
    const role = (team.roles ?? []).find(
      (item) => Number(item.id) === Number(roleID),
    );
    if (role) {
      return role;
    }
  }
  return undefined;
}

export function deriveAgentCateOptions(agents: AgentOption[]) {
  const cateIDs = Array.from(
    new Set(
      sortAgentOptions(agents)
        .map((agent) => Number(agent.cate_id || 0))
        .filter(Boolean),
    ),
  );
  return cateIDs.map((id) => ({
    id,
    value: `分类${id}`,
  }));
}

export function derivePowerKindOptions(powers: PowerOption[]) {
  const labels: Record<string, string> = {
    text: "文本",
    image: "图片",
    video: "视频",
    audio: "音频",
    role: "角色",
    multi: "多模态",
    embeddings: "向量",
    workflow: "工作流",
  };
  const seen = Array.from(
    new Set(powers.map((power) => power.kind).filter(Boolean)),
  );
  return seen.map((kind) => ({ id: kind, value: labels[kind] || kind }));
}

export function normalizeConditionOperator(value: unknown) {
  const operator = String(value || "exists")
    .trim()
    .toLowerCase();
  return CONDITION_OPERATORS.some((item) => item.id === operator)
    ? operator
    : "exists";
}

export function resolveNodeEdgeConditionOptions(
  edge: Pick<NodeEdge, "from_key">,
  nodes: TeamNode[],
  edgeConditions: Array<{ id: string; value: string }>,
) {
  const fromNode = nodes.find((node) => node.node_key === edge.from_key);
  if (!fromNode) {
    return [];
  }
  if (fromNode.type === "condition") {
    return pickEdgeConditions(edgeConditions, ["passed", "failed"]);
  }
  if (fromNode.type === "human_approval") {
    return pickEdgeConditions(edgeConditions, ["approved", "rejected"]);
  }
  return [];
}

export function pickEdgeConditions(
  edgeConditions: Array<{ id: string; value: string }>,
  ids: string[],
) {
  const byID = new Map(edgeConditions.map((item) => [item.id, item]));
  return ids
    .map((id) => byID.get(id))
    .filter((item): item is { id: string; value: string } => !!item);
}

export function normalizeWorkspace(data: any): WorkspaceData {
  return {
    team: normalizeTeamData(data?.team),
    asset_cates: Array.isArray(data?.asset_cates) ? data.asset_cates : [],
    flows: Array.isArray(data?.flows) ? data.flows.map(normalizeFlowItem) : [],
    flow_edges: Array.isArray(data?.flow_edges) ? data.flow_edges : [],
    nodes_by_flow: data?.nodes_by_flow ?? {},
    edges_by_flow: data?.edges_by_flow ?? data?.node_edges_by_flow ?? {},
    roles: Array.isArray(data?.roles) ? data.roles : [],
    agents: Array.isArray(data?.agents) ? sortAgentOptions(data.agents) : [],
    agent_cates: Array.isArray(data?.agent_cates)
      ? sortAgentCateOptions(data.agent_cates)
      : [],
    teams: Array.isArray(data?.teams) ? data.teams : [],
    role_types: Array.isArray(data?.role_types) ? data.role_types : ROLE_TYPES,
    powers: Array.isArray(data?.powers) ? data.powers : [],
    power_kinds: Array.isArray(data?.power_kinds) ? data.power_kinds : [],
    node_types: Array.isArray(data?.node_types) ? data.node_types : NODE_TYPES,
    edge_conditions: Array.isArray(data?.edge_conditions)
      ? data.edge_conditions
      : EDGE_CONDITIONS,
  };
}

export function normalizeTeamData(team: any) {
  const normalized = team && typeof team === "object" ? { ...team } : {};
  normalized.publish_status = normalizeTeamPublishStatus(
    normalized.publish_status,
  );
  normalized.current_release_id = Number(normalized.current_release_id || 0);
  normalized.release_version = Number(normalized.release_version || 0);
  normalized.readonly =
    Boolean(normalized.readonly) || isTeamReadonly(normalized);
  return normalized;
}

export function normalizeFlowItem(flow: any): FlowItem {
  return { ...flow };
}

export function sortAgentOptions(agents: AgentOption[]) {
  return [...agents].sort(compareOptionSort);
}

export function sortAgentCateOptions(agentCates: AgentCateOption[]) {
  return [...agentCates].sort(compareOptionSort);
}

function compareOptionSort(
  left: { id?: number; sort?: number },
  right: { id?: number; sort?: number },
) {
  const leftSort = Number(left.sort || 0);
  const rightSort = Number(right.sort || 0);
  if (leftSort !== rightSort) {
    return leftSort - rightSort;
  }
  return Number(left.id || 0) - Number(right.id || 0);
}

export function normalizeTeamPublishStatus(value: unknown) {
  const status = String(value ?? "")
    .trim()
    .toLowerCase();
  if (
    status === TEAM_PUBLISH_PUBLISHED ||
    status === "已发布" ||
    status === "发布"
  ) {
    return TEAM_PUBLISH_PUBLISHED;
  }
  if (
    status === TEAM_PUBLISH_EDITING ||
    status === "编辑草稿" ||
    status === "editing_draft"
  ) {
    return TEAM_PUBLISH_EDITING;
  }
  return TEAM_PUBLISH_DRAFT;
}

export function isTeamReadonly(team: Record<string, any> | undefined) {
  return (
    Boolean(team?.readonly) ||
    normalizeTeamPublishStatus(team?.publish_status) === TEAM_PUBLISH_PUBLISHED
  );
}

export function teamPublishStatusLabel(status: string) {
  if (status === TEAM_PUBLISH_PUBLISHED) {
    return "已发布";
  }
  if (status === TEAM_PUBLISH_EDITING) {
    return "编辑草稿";
  }
  return "草稿";
}

export function isActiveFlowListItem(
  view: ViewMode,
  selectedFlowKey: string,
  flow: FlowItem,
) {
  if (view === "node") {
    return selectedFlowKey === flow.key;
  }
  return false;
}

export function workspaceNodeTypeLabel(
  type: unknown,
  nodeTypes: Array<{ id: string; value: string }>,
) {
  const id = String(type || "agent");
  if (id === "role") {
    return "团队角色";
  }
  if (id === "team") {
    return "团队工作流";
  }
  return (
    nodeTypes.find((item) => item.id === id)?.value ||
    NODE_TYPES.find((item) => item.id === id)?.value ||
    id
  );
}

export function visibleNodeTypes(types: Array<{ id: string; value: string }>) {
  return types.filter((type) => VISIBLE_NODE_TYPE_IDS.has(type.id));
}

export function normalizeNodesForSave(nodes: TeamNode[]) {
  return nodes.map((node) => ({
    ...node,
    role_id:
      node.type === "role"
        ? Number(node.role_id || node.config?.role_id || 0)
        : 0,
    role_key:
      node.type === "role"
        ? String(node.role_key || node.config?.role_key || "")
        : "",
    agent_id: node.type === "agent" ? node.agent_id : 0,
    power_id:
      node.type === "power"
        ? Number(node.power_id || node.config?.power_id || 0)
        : 0,
    sub_team_id:
      node.type === "team"
        ? Number(node.sub_team_id || node.config?.sub_team_id || 0)
        : 0,
    asset_cate_id:
      node.type === "context" || node.type === "save"
        ? Number(node.asset_cate_id || node.config?.asset_cate_id || 0)
        : 0,
    config: normalizeNodeConfigForSave(node),
  }));
}

export function normalizeNodeConfigForSave(node: TeamNode) {
  const config = omitConfigKeys(node.config, [
    "task",
    "input_keys",
    "output_key",
  ]);
  if (node.type === "agent") {
    return omitConfigKeys(config, [
      "role_id",
      "role_key",
      "role_team_id",
      "role_type",
      "power_id",
      "power_key",
      "power_kind",
      "sub_team_id",
      "sub_flow_id",
      "sub_flow_key",
      "release_id",
      "asset_cate_id",
      "operator",
      "source_key",
      "input_key",
      "value",
      "body_key",
      "content_key",
    ]);
  }
  if (node.type === "role") {
    return omitConfigKeys(config, [
      "agent_cate_id",
      "power_id",
      "power_key",
      "power_kind",
      "sub_team_id",
      "sub_flow_id",
      "sub_flow_key",
      "release_id",
      "asset_cate_id",
      "operator",
      "source_key",
      "input_key",
      "value",
      "body_key",
      "content_key",
    ]);
  }
  if (node.type === "power") {
    return omitConfigKeys(config, [
      "goal",
      "agent_cate_id",
      "role_id",
      "role_key",
      "role_team_id",
      "role_type",
      "sub_team_id",
      "sub_flow_id",
      "sub_flow_key",
      "release_id",
      "asset_cate_id",
      "operator",
      "source_key",
      "input_key",
      "value",
      "body_key",
      "content_key",
    ]);
  }
  if (node.type === "team") {
    return omitConfigKeys(config, [
      "goal",
      "agent_cate_id",
      "role_id",
      "role_key",
      "role_team_id",
      "role_type",
      "power_id",
      "power_key",
      "power_kind",
      "asset_cate_id",
      "operator",
      "source_key",
      "input_key",
      "value",
      "body_key",
      "content_key",
    ]);
  }
  if (node.type === "condition") {
    return {
      ...omitConfigKeys(config, [
        "goal",
        "agent_cate_id",
        "role_id",
        "role_key",
        "role_team_id",
        "role_type",
        "power_id",
        "power_key",
        "power_kind",
        "sub_team_id",
        "sub_flow_id",
        "sub_flow_key",
        "release_id",
        "asset_cate_id",
        "body_key",
        "content_key",
      ]),
      operator: normalizeConditionOperator(config.operator),
    };
  }
  if (node.type === "save") {
    return omitConfigKeys(config, [
      "goal",
      "agent_cate_id",
      "role_id",
      "role_key",
      "role_team_id",
      "role_type",
      "power_id",
      "power_key",
      "power_kind",
      "sub_team_id",
      "sub_flow_id",
      "sub_flow_key",
      "release_id",
      "operator",
      "source_key",
      "input_key",
      "value",
      "body_key",
      "content_key",
    ]);
  }
  if (node.type === "context") {
    return omitConfigKeys(config, [
      "goal",
      "agent_cate_id",
      "role_id",
      "role_key",
      "role_team_id",
      "role_type",
      "power_id",
      "power_key",
      "power_kind",
      "sub_team_id",
      "sub_flow_id",
      "sub_flow_key",
      "release_id",
      "operator",
      "source_key",
      "input_key",
      "value",
      "body_key",
      "content_key",
    ]);
  }
  return omitConfigKeys(config, [
    "goal",
    "agent_cate_id",
    "role_id",
    "role_key",
    "role_team_id",
    "role_type",
    "power_id",
    "power_key",
    "power_kind",
    "sub_team_id",
    "sub_flow_id",
    "sub_flow_key",
    "release_id",
    "asset_cate_id",
    "operator",
    "source_key",
    "input_key",
    "value",
    "body_key",
    "content_key",
  ]);
}

export function omitConfigKeys(
  config: Record<string, any> | undefined,
  keys: string[],
) {
  const next = { ...(config ?? {}) };
  keys.forEach((key) => {
    delete next[key];
  });
  return next;
}

export function addNode(
  flowKey: string,
  setWorkspace: Dispatch<SetStateAction<WorkspaceData>>,
) {
  if (!flowKey) {
    toast.error("请先选择一个工作流");
    return;
  }
  const key = `node_${Date.now()}`;
  setWorkspace((current) => {
    const nodes = current.nodes_by_flow?.[flowKey] ?? [];
    return {
      ...current,
      nodes_by_flow: {
        ...(current.nodes_by_flow ?? {}),
        [flowKey]: [
          ...nodes,
          createNodeItem(nodes, key, nextNodePosition(nodes)),
        ],
      },
    };
  });
}

export function createFlowItem(
  flows: FlowItem[],
  key: string,
  position?: CanvasPoint,
): FlowItem {
  return {
    key,
    name: nextIndexedName("工作流", flows, (flow) => flow.name),
    goal: "",
    position: position ?? defaultGraphPosition(flows.length),
    status: 1,
    sort: (flows.length + 1) * 10,
  };
}

export function createNodeItem(
  nodes: TeamNode[],
  key: string,
  position?: CanvasPoint,
): TeamNode {
  return {
    node_key: key,
    name: nextIndexedName("节点", nodes, (node) => node.name),
    type: "agent",
    role_id: 0,
    role_key: "",
    agent_id: 0,
    power_id: 0,
    sub_team_id: 0,
    asset_cate_id: 0,
    config: {},
    position: position ?? defaultGraphPosition(nodes.length),
    status: 1,
    sort: (nodes.length + 1) * 10,
  };
}

export function defaultGraphPosition(index: number) {
  return {
    x: 90 + (index % 4) * 180,
    y: 90 + Math.floor(index / 4) * 140,
  };
}

function nextNodePosition(nodes: TeamNode[]): CanvasPoint {
  const lastNode = [...nodes]
    .filter((node) => node.position)
    .sort((left, right) => Number(left.sort || 0) - Number(right.sort || 0))
    .at(-1);
  if (!lastNode?.position) {
    return defaultGraphPosition(nodes.length);
  }
  return {
    x: Number(lastNode.position.x || 0) + 160,
    y: Number(lastNode.position.y || 0),
  };
}

export function nextIndexedName<T>(
  prefix: string,
  rows: T[],
  getName: (row: T) => string,
) {
  const used = new Set<number>();
  const pattern = new RegExp(`^${escapeRegExp(prefix)}(\\d+)$`);
  rows.forEach((row) => {
    const match = String(getName(row) || "")
      .trim()
      .match(pattern);
    if (match) {
      used.add(Number(match[1]));
    }
  });

  let index = 1;
  while (used.has(index)) {
    index += 1;
  }
  return `${prefix}${index}`;
}

export function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function addFlowEdge(
  workspace: WorkspaceData,
  fromKey: string,
  toKey: string,
): WorkspaceData {
  if (
    fromKey === toKey ||
    (workspace.flow_edges ?? []).some(
      (edge) => edge.from_key === fromKey && edge.to_key === toKey,
    )
  ) {
    return workspace;
  }
  return {
    ...workspace,
    flow_edges: [
      ...(workspace.flow_edges ?? []),
      {
        from_key: fromKey,
        to_key: toKey,
        condition: "completed",
        status: 1,
        sort: ((workspace.flow_edges?.length ?? 0) + 1) * 10,
      },
    ],
  };
}

export function addConnectedFlow(
  workspace: WorkspaceData,
  fromKey: string,
  key: string,
  position: CanvasPoint,
) {
  const flows = workspace.flows ?? [];
  if (flows.some((flow) => flow.key === key)) {
    return workspace;
  }
  return addFlowEdge(
    {
      ...workspace,
      flows: [...flows, createFlowItem(flows, key, position)],
    },
    fromKey,
    key,
  );
}

export function addNodeEdge(
  workspace: WorkspaceData,
  flowKey: string,
  fromKey: string,
  toKey: string,
): WorkspaceData {
  const edges = workspace.edges_by_flow?.[flowKey] ?? [];
  if (
    fromKey === toKey ||
    edges.some((edge) => edge.from_key === fromKey && edge.to_key === toKey)
  ) {
    return workspace;
  }
  const nodes = workspace.nodes_by_flow?.[flowKey] ?? [];
  const fromNode = nodes.find((node) => node.node_key === fromKey);
  return {
    ...workspace,
    edges_by_flow: {
      ...(workspace.edges_by_flow ?? {}),
      [flowKey]: [
        ...edges,
        {
          from_key: fromKey,
          to_key: toKey,
          condition: defaultNodeEdgeCondition(fromNode?.type, edges, fromKey),
          status: 1,
          sort: (edges.length + 1) * 10,
        },
      ],
    },
  };
}

export function addConnectedNode(
  workspace: WorkspaceData,
  flowKey: string,
  fromKey: string,
  key: string,
  position: CanvasPoint,
) {
  const nodes = workspace.nodes_by_flow?.[flowKey] ?? [];
  if (nodes.some((node) => node.node_key === key)) {
    return workspace;
  }
  return addNodeEdge(
    {
      ...workspace,
      nodes_by_flow: {
        ...(workspace.nodes_by_flow ?? {}),
        [flowKey]: [...nodes, createNodeItem(nodes, key, position)],
      },
    },
    flowKey,
    fromKey,
    key,
  );
}

export function defaultNodeEdgeCondition(
  fromNodeType: string | undefined,
  edges: NodeEdge[],
  fromKey: string,
) {
  const outgoing = new Set(
    edges
      .filter((edge) => edge.from_key === fromKey)
      .map((edge) => String(edge.condition || "")),
  );
  if (fromNodeType === "condition") {
    return outgoing.has("passed") ? "failed" : "passed";
  }
  if (fromNodeType === "human_approval") {
    return outgoing.has("approved") ? "rejected" : "approved";
  }
  return "always";
}

export function updateFlow(
  workspace: WorkspaceData,
  key: string,
  patch: Partial<FlowItem>,
): WorkspaceData {
  return {
    ...workspace,
    flows: (workspace.flows ?? []).map((flow) =>
      flow.key === key ? { ...flow, ...patch } : flow,
    ),
  };
}

export function reorderFlows(
  workspace: WorkspaceData,
  fromKey: string,
  toKey: string,
): WorkspaceData {
  const flows = [...(workspace.flows ?? [])];
  const fromIndex = flows.findIndex((flow) => flow.key === fromKey);
  const toIndex = flows.findIndex((flow) => flow.key === toKey);
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) {
    return workspace;
  }
  const [moved] = flows.splice(fromIndex, 1);
  flows.splice(toIndex, 0, moved);
  return {
    ...workspace,
    flows: flows.map((flow, index) => ({
      ...flow,
      sort: (index + 1) * 10,
    })),
  };
}

export function updateNode(
  workspace: WorkspaceData,
  flowKey: string,
  key: string,
  patch: Partial<TeamNode>,
): WorkspaceData {
  const nodes = workspace.nodes_by_flow?.[flowKey] ?? [];
  return {
    ...workspace,
    nodes_by_flow: {
      ...(workspace.nodes_by_flow ?? {}),
      [flowKey]: nodes.map((node) =>
        node.node_key === key ? { ...node, ...patch } : node,
      ),
    },
  };
}

export function updateNodeEdge(
  workspace: WorkspaceData,
  flowKey: string,
  index: number,
  patch: Partial<NodeEdge>,
): WorkspaceData {
  const edges = workspace.edges_by_flow?.[flowKey] ?? [];
  return {
    ...workspace,
    edges_by_flow: {
      ...(workspace.edges_by_flow ?? {}),
      [flowKey]: edges.map((edge, currentIndex) =>
        currentIndex === index ? { ...edge, ...patch } : edge,
      ),
    },
  };
}

export function removeGraphSelection(
  workspace: WorkspaceData,
  selection: Exclude<Selection, null>,
  flowKey: string,
): WorkspaceData {
  if (selection.kind === "flow") {
    const nodesByFlow = { ...(workspace.nodes_by_flow ?? {}) };
    const edgesByFlow = { ...(workspace.edges_by_flow ?? {}) };
    delete nodesByFlow[selection.key];
    delete edgesByFlow[selection.key];
    return {
      ...workspace,
      flows: (workspace.flows ?? []).filter(
        (flow) => flow.key !== selection.key,
      ),
      flow_edges: (workspace.flow_edges ?? []).filter(
        (edge) =>
          edge.from_key !== selection.key && edge.to_key !== selection.key,
      ),
      nodes_by_flow: nodesByFlow,
      edges_by_flow: edgesByFlow,
    };
  }

  if (selection.kind === "flow_edge") {
    return {
      ...workspace,
      flow_edges: (workspace.flow_edges ?? []).filter(
        (_edge, index) => index !== selection.index,
      ),
    };
  }

  if (selection.kind === "node") {
    const nodes = workspace.nodes_by_flow?.[flowKey] ?? [];
    const edges = workspace.edges_by_flow?.[flowKey] ?? [];
    return {
      ...workspace,
      nodes_by_flow: {
        ...(workspace.nodes_by_flow ?? {}),
        [flowKey]: nodes.filter((node) => node.node_key !== selection.key),
      },
      edges_by_flow: {
        ...(workspace.edges_by_flow ?? {}),
        [flowKey]: edges.filter(
          (edge) =>
            edge.from_key !== selection.key && edge.to_key !== selection.key,
        ),
      },
    };
  }

  const edges = workspace.edges_by_flow?.[flowKey] ?? [];
  return {
    ...workspace,
    edges_by_flow: {
      ...(workspace.edges_by_flow ?? {}),
      [flowKey]: edges.filter((_edge, index) => index !== selection.index),
    },
  };
}
