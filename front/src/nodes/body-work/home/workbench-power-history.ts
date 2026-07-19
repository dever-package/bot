import { request } from "@dever/front-plugin";
import type { EnergonOutput } from "@/components/energon/content-view";
import type {
  StreamPowerHistoryDetail,
  StreamPowerHistoryItem,
  StreamPowerHistoryPage,
} from "../../show/stream-power-history";
import { isSuccessResponse } from "../shared/api-response";
import { workbenchApi } from "./workbench-api";

export type WorkbenchPowerHistoryItem = StreamPowerHistoryItem & {
  titleSource: "auto" | "llm" | "manual";
};

export type WorkbenchPowerHistoryDetail = StreamPowerHistoryDetail & {
  titleSource: "auto" | "llm" | "manual";
};

export async function loadWorkbenchPowerHistory(input: {
  teamID: number;
  teamPowerID: number;
  beforeID?: number;
  limit?: number;
}): Promise<StreamPowerHistoryPage> {
  const result = await request(workbenchApi("power_history"), "get", {
    team_id: input.teamID,
    team_power_id: input.teamPowerID,
    before_id: input.beforeID || undefined,
    limit: input.limit || 20,
  });
  const data = responseData(result, "读取工具历史失败");
  return {
    items: rowsValue(data.items)
      .map(normalizeHistoryItem)
      .filter((item) => item.id > 0),
    total: nonNegativeNumber(data.total),
    hasMore: Boolean(data.has_more),
    beforeID: positiveNumber(data.before_id),
  };
}

export async function loadWorkbenchPowerHistoryDetail(input: {
  teamID: number;
  historyID: number;
}): Promise<WorkbenchPowerHistoryDetail> {
  const result = await request(
    workbenchApi("power_history_detail"),
    "get",
    {
      team_id: input.teamID,
      history_id: input.historyID,
    },
  );
  const data = responseData(result, "读取工具历史详情失败");
  const history = normalizeHistoryItem(data.history);
  if (!history.id) {
    throw new Error("工具历史详情为空");
  }
  const raw = recordValue(data.history);
  return {
    ...history,
    input: recordValue(raw.input),
    output: normalizeOutput(raw.output),
    targetAssetID: positiveNumber(raw.target_asset_id),
    sourceTargetID: positiveNumber(raw.source_target_id),
  };
}

function normalizeHistoryItem(value: unknown): WorkbenchPowerHistoryItem {
  const row = recordValue(value);
  return {
    id: positiveNumber(row.id),
    runID: positiveNumber(row.run_id),
    requestID: textValue(row.request_id),
    title: textValue(row.title) || "未命名运行",
    titleSource: normalizeTitleSource(row.title_source),
    inputSummary: textValue(row.input_summary),
    status: textValue(row.status) || "unavailable",
    error: textValue(row.error),
    createdAt: textValue(row.created_at),
    startedAt: textValue(row.started_at),
    finishedAt: textValue(row.finished_at),
  };
}

function normalizeOutput(value: unknown): EnergonOutput | null {
  return isRecord(value) ? (value as EnergonOutput) : null;
}

function normalizeTitleSource(value: unknown) {
  const source = textValue(value);
  if (source === "llm" || source === "manual") return source;
  return "auto";
}

function responseData(result: unknown, fallback: string) {
  if (!isSuccessResponse(result)) {
    const response = recordValue(result);
    throw new Error(textValue(response.message || response.msg) || fallback);
  }
  return recordValue(recordValue(result).data);
}

function rowsValue(value: unknown) {
  return Array.isArray(value) ? value : [];
}

function recordValue(value: unknown): Record<string, any> {
  return isRecord(value) ? value : {};
}

function isRecord(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function positiveNumber(value: unknown) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function nonNegativeNumber(value: unknown) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function textValue(value: unknown) {
  return value == null ? "" : String(value).trim();
}
