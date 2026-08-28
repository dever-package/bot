import { joinSiteApi, request } from "@dever/front-plugin";
import {
  asResponseRecord,
  asResponseRows,
  responseNonNegativeNumber,
  responsePositiveNumber,
  responseText,
  successfulResponseData,
} from "../shared/api-response";
import { normalizeAssetRecord } from "./asset-api";
import type { AssetRecord } from "./asset-types";

export type WebContentImportStatus =
  | "pending"
  | "discovering"
  | "running"
  | "success"
  | "partial"
  | "failed";

export type WebContentImportItem = {
  id: number;
  platform: string;
  sourceURL: string;
  title: string;
  status: string;
  stageMessage: string;
  errorMessage: string;
};

export type WebContentImportTask = {
  id: number;
  source: string;
  status: WebContentImportStatus;
  stageMessage: string;
  progress: number;
  itemTotal: number;
  successCount: number;
  skippedCount: number;
  failedCount: number;
  errorMessage: string;
  assets: AssetRecord[];
  warnings: string[];
  items: WebContentImportItem[];
};

export async function createWebContentImport(input: {
  teamID: number;
  projectID?: number;
  requestID: string;
  source: string;
}): Promise<WebContentImportTask> {
  const result = await request(
    joinSiteApi("workbench/web_content_import"),
    "post",
    {
      team_id: input.teamID,
      project_id: input.projectID || undefined,
      request_id: input.requestID,
      source: input.source,
    },
    { reportError: false },
  );
  return normalizeWebContentImportTask(
    successfulResponseData(result, "创建网页内容导入任务失败"),
  );
}

export async function loadWebContentImportTask(input: {
  teamID: number;
  projectID?: number;
  taskID: number;
}): Promise<WebContentImportTask> {
  const result = await request(
    joinSiteApi("workbench/web_content_import_task"),
    "get",
    {
      team_id: input.teamID,
      project_id: input.projectID || undefined,
      task_id: input.taskID,
    },
    { reportError: false },
  );
  return normalizeWebContentImportTask(
    successfulResponseData(result, "加载网页内容导入任务失败"),
  );
}

export async function loadActiveWebContentImports(input: {
  teamID: number;
  projectID?: number;
}): Promise<WebContentImportTask[]> {
  const result = await request(
    joinSiteApi("workbench/web_content_import_tasks"),
    "get",
    {
      team_id: input.teamID,
      project_id: input.projectID || undefined,
    },
    { reportError: false },
  );
  const data = successfulResponseData(result, "加载网页内容导入任务失败");
  return asResponseRows(data.items)
    .map(normalizeWebContentImportTask)
    .filter((task) => task.id > 0);
}

function normalizeWebContentImportTask(value: unknown): WebContentImportTask {
  const task = asResponseRecord(value);
  const assets = asResponseRows(task.assets)
    .map(normalizeAssetRecord)
    .filter((current) => current.id > 0);
  return {
    id: responsePositiveNumber(task.id),
    source: responseText(task.source),
    status: normalizeWebContentImportStatus(task.status),
    stageMessage: responseText(task.stage_message),
    progress: Math.min(100, responseNonNegativeNumber(task.progress)),
    itemTotal: responseNonNegativeNumber(task.item_total),
    successCount: responseNonNegativeNumber(task.success_count),
    skippedCount: responseNonNegativeNumber(task.skipped_count),
    failedCount: responseNonNegativeNumber(task.failed_count),
    errorMessage: responseText(task.error_message),
    assets,
    warnings: normalizeWarnings(task.warnings),
    items: asResponseRows(task.items)
      .map(normalizeWebContentImportItem)
      .filter((item) => item.id > 0),
  };
}

function normalizeWebContentImportItem(value: unknown): WebContentImportItem {
  const item = asResponseRecord(value);
  return {
    id: responsePositiveNumber(item.id),
    platform: responseText(item.platform),
    sourceURL: responseText(item.source_url),
    title: responseText(item.title),
    status: responseText(item.status),
    stageMessage: responseText(item.stage_message),
    errorMessage: responseText(item.error_message),
  };
}

function normalizeWarnings(value: unknown) {
  return asResponseRows(value).map(responseText).filter(Boolean);
}

function normalizeWebContentImportStatus(
  value: unknown,
): WebContentImportStatus {
  const status = responseText(value);
  switch (status) {
    case "discovering":
    case "running":
    case "success":
    case "partial":
    case "failed":
      return status;
    default:
      return "pending";
  }
}
