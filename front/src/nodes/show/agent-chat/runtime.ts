import { request } from "@dever/front-plugin";
import {
  isPlainRecord,
  normalizeRuntimeFrameOutput,
  resolveRuntimeFrameCancelable,
} from "@/lib/runtime-stream-output";
import {
  streamValueText as valueText,
  type RuntimeStreamFrame,
} from "@/lib/stream";
import {
  normalizeAgentChatOutput,
  type AgentChatOutput,
} from "./output";
import {
  readAgentChatActivity,
  type AgentChatActivity,
} from "./activity";

export type AgentChatRunStatus = {
  requestID: string;
  status: "running" | "success" | "fail" | "canceled" | string;
  text: string;
  output: AgentChatOutput;
  error: string;
};

export type AgentChatRunFrame = {
  requestID: string;
  streamID: string;
  event: string;
  delta: string;
  finalText: string;
  output: AgentChatOutput;
  activity?: AgentChatActivity;
  error: string;
  cancelable: boolean | null;
  finished: boolean;
  failed: boolean;
};

export async function loadAgentChatRunStatus(
  api: string,
  requestID: string,
): Promise<AgentChatRunStatus> {
  const result = await request(api, "get", { request_id: requestID });
  if (!isPlainRecord(result)) {
    throw new Error("读取智能体运行状态失败");
  }
  const code = Number(result.code || 0);
  const responseStatus = Number(result.status || 0);
  if (code !== 0 || responseStatus === 2) {
    throw new Error(
      valueText(result.message || result.msg) || "读取智能体运行状态失败",
    );
  }
  const data = isPlainRecord(result.data) ? result.data : {};
  const run = isPlainRecord(data.run) ? data.run : {};
  const output = normalizeAgentChatOutput(run.output);
  return {
    requestID: valueText(run.request_id) || requestID,
    status: valueText(run.status).toLowerCase(),
    text: valueText(output.text),
    output,
    error: valueText(run.error || output.error),
  };
}

export function readAgentChatRunFrame(
  frame: RuntimeStreamFrame<Record<string, unknown>>,
): AgentChatRunFrame {
  const outputValue = normalizeRuntimeFrameOutput(frame?.output, frame);
  const output = normalizeAgentChatOutput(outputValue);
  const event = valueText(output.semantic_event || output.event).toLowerCase();
  const text = valueText(output.text);
  const finished = frame?.type === "result";
  const failed = Number(frame?.status || 0) === 2;
  const isDelta = event === "delta" || (!event && Boolean(text) && !finished);
  return {
    requestID: valueText(frame?.request_id),
    streamID: valueText(frame?.stream_id),
    event,
    delta: isDelta ? text : "",
    finalText: finished ? text : "",
    output,
    activity: readAgentChatActivity(output),
    error: valueText(output.error || (failed ? frame?.msg : "")),
    cancelable: resolveRuntimeFrameCancelable(frame),
    finished,
    failed,
  };
}

export function isFinishedAgentChatRunStatus(status: string) {
  return ["success", "fail", "canceled"].includes(status);
}
