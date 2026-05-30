import type {
  AgentInteraction,
  AgentInteractionSubmitResult,
} from "@/components/agent/interaction-panel";

export type FlowItem = {
  id?: number;
  key: string;
  name: string;
  goal?: string;
  config?: Record<string, any>;
  position?: Record<string, any>;
  status?: number;
  sort?: number;
};

export type FlowEdge = {
  id?: number;
  from_key: string;
  to_key: string;
  condition?: string;
  status?: number;
  sort?: number;
};

export type TeamNode = {
  id?: number;
  node_key: string;
  name: string;
  type: string;
  role_id?: number;
  role_key?: string;
  agent_id?: number;
  power_id?: number;
  sub_team_id?: number;
  config?: Record<string, any>;
  position?: Record<string, any>;
  status?: number;
  sort?: number;
};

export type NodeEdge = {
  id?: number;
  from_key: string;
  to_key: string;
  condition?: string;
  status?: number;
  sort?: number;
};

export type AgentOption = {
  id: number;
  cate_id?: number;
  name: string;
  sort?: number;
};

export type RoleOption = {
  id: number;
  team_id?: number;
  role_type?: string;
  role_key?: string;
  name: string;
  agent_id?: number;
};

export type TeamOption = {
  id: number;
  cate_id?: number;
  release_id?: number;
  name: string;
  flows?: FlowItem[];
  roles?: RoleOption[];
};

export type RoleTypeOption = {
  id: string;
  value: string;
};

export type PowerOption = {
  id: number;
  cate_id?: number;
  name: string;
  key: string;
  kind: string;
};

export type PowerKindOption = {
  id: string;
  value: string;
};

export type AgentCateOption = {
  id: number;
  value?: string;
  name?: string;
  sort?: number;
};

export type WorkspaceData = {
  team?: Record<string, any>;
  flows?: FlowItem[];
  flow_edges?: FlowEdge[];
  nodes_by_flow?: Record<string, TeamNode[]>;
  edges_by_flow?: Record<string, NodeEdge[]>;
  roles?: RoleOption[];
  agents?: AgentOption[];
  agent_cates?: AgentCateOption[];
  teams?: TeamOption[];
  role_types?: RoleTypeOption[];
  powers?: PowerOption[];
  power_kinds?: PowerKindOption[];
  node_types?: Array<{ id: string; value: string }>;
  edge_conditions?: Array<{ id: string; value: string }>;
};

export type Selection =
  | { kind: "flow"; key: string }
  | { kind: "flow_edge"; index: number }
  | { kind: "node"; key: string }
  | { kind: "node_edge"; index: number }
  | null;

export type ConnectState = {
  kind: "flow" | "node";
  fromKey: string;
} | null;

export type GraphExecutionNodeState = {
  status: string;
  run?: any;
};

export type GraphExecutionState = {
  active: boolean;
  running: boolean;
  nodeRuns: any[];
  nodeRunsByKey: Record<string, GraphExecutionNodeState>;
  agentRunsByID: Record<string, any>;
  pendingApprovalsByNodeKey: Record<string, DebugPendingApproval>;
  activeEdgeKeys: Set<string>;
  completedEdgeKeys: Set<string>;
};

export type ContextMenuState = {
  x: number;
  y: number;
  target: Exclude<Selection, null>;
} | null;

export type CanvasPoint = {
  x: number;
  y: number;
};

export type ViewMode = "flow" | "node";
export type DebugTarget = "team" | "flow";
export type DebugPendingApproval = {
  id: string | number;
  title: string;
  nodeRunID?: string | number;
  nodeKey?: string;
  kind?: string;
  interaction: AgentInteraction;
};
export type DebugApprovalSubmit = (
  approval: DebugPendingApproval,
  result: AgentInteractionSubmitResult,
) => void;
export type DebugNodeTimingContext = {
  node?: TeamNode;
  nodeRuns?: any[];
};
