import { joinSiteApi } from "@dever/front-plugin";
import { watchRuntimeRun } from "../../../runtime/team-run";

export type SpaceStreamFrame = {
  request_id?: string;
  type?: string;
  output?: Record<string, unknown>;
  msg?: string;
  status?: number;
  stream_id?: string;
};

export type WatchSpaceCanvasStreamInput = {
  projectId: number;
  requestId: string;
  lastId?: string;
  signal?: AbortSignal;
  onFrame: (frame: SpaceStreamFrame) => void;
};

export async function watchSpaceCanvasStream(input: WatchSpaceCanvasStreamInput) {
  const requestId = String(input.requestId || "").trim();
  if (!requestId) {
    throw new Error("request_id 不能为空");
  }
  return watchRuntimeRun<null>({
    streamApi: buildSpaceStreamApi(input.projectId),
    requestID: requestId,
    lastID: input.lastId || "0-0",
    blockMs: 15000,
    signal: input.signal,
    acceptErrorResult: true,
    initialState: null,
    reduceFrame: (state, frame) => {
      input.onFrame(frame as SpaceStreamFrame);
      return state;
    },
  });
}

function buildSpaceStreamApi(projectId: number) {
  const url = new URL(joinSiteApi("run/stream"), window.location.origin);
  url.searchParams.set("project_id", String(projectId || 0));
  return url.toString();
}
