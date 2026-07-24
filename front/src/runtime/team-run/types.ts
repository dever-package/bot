import type { RuntimeStreamFrame } from "@/lib/stream";

export type RuntimeRunStatus =
  | "pending"
  | "running"
  | "waiting"
  | "success"
  | "fail"
  | "canceled";

export type RuntimeRunRef = {
  id: number;
  request_id: string;
  status: RuntimeRunStatus;
  error: string;
  output?: unknown;
  updated_at?: string;
  [key: string]: unknown;
};

export type RuntimeRunSnapshot = {
  view?: "state" | "summary" | "detail" | string;
  run: RuntimeRunRef;
  flow_runs?: Record<string, unknown>[];
  node_runs?: Record<string, unknown>[];
  interactions?: Record<string, unknown>[];
  approvals?: Record<string, unknown>[];
  agent_runs?: Record<string, unknown>[];
  blackboard?: Record<string, unknown>[];
  messages?: Record<string, unknown>[];
  [key: string]: unknown;
};

export type RuntimeRunControllerOptions<TState> = {
  streamApi: string;
  requestID: string;
  lastID?: string;
  initialState: TState;
  signal?: AbortSignal;
  blockMs?: number;
  acceptErrorResult?: boolean;
  reduceFrame: (
    state: TState,
    frame: RuntimeStreamFrame<any>,
  ) => TState;
  fetchSnapshot?: () => Promise<unknown>;
  mergeSnapshot?: (state: TState, snapshot: unknown) => TState;
  onUpdate?: (state: TState) => void;
};

export type RuntimeRunControllerResult<TState> = {
  state: TState;
  lastID: string;
  completed: boolean;
};
