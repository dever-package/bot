import { joinSiteApi, request } from "@dever/front-plugin";
import { isSuccessResponse } from "../shared/api-response";
import { createInFlightRequestLoader } from "../shared/in-flight-request";

export type WorkbenchTeam = {
  id: number;
  name: string;
  description: string;
  projectEnabled: boolean;
};

export type WorkbenchPower = {
  id: number;
  powerID: number;
  name: string;
  key: string;
  icon: string;
  kind: string;
  outputType: string;
};

export type WorkbenchRole = {
  id: number;
  name: string;
  roleType: string;
  assignment: string;
  agentID: number;
  agentKey: string;
  agentName: string;
  openingEnabled: boolean;
};

export type WorkbenchAssetCate = {
  id: number;
  name: string;
  kind: string;
  cardinality: string;
};

export type WorkbenchSystemMessage = {
  id: number;
  title: string;
  content: string;
  url: string;
  pinned: boolean;
  publishedAt: string;
};

export type WorkbenchCatalog = {
  teams: WorkbenchTeam[];
  team: WorkbenchTeam | null;
  releaseID: number;
  workspaceBodyID: number;
  projectEnabled: boolean;
  powers: WorkbenchPower[];
  roles: WorkbenchRole[];
  assetCates: WorkbenchAssetCate[];
};

const loadCatalogRequest = createInFlightRequestLoader<WorkbenchCatalog>();

export function loadWorkbenchCatalog(teamID = 0) {
  return loadCatalogRequest(String(teamID), async () => {
    const result = await request(joinSiteApi("workbench/catalog"), "get", {
      team_id: teamID || undefined,
    });
    const data = responseData(result, "加载团队工作区失败");
    const teams = toRows(data.teams).map(normalizeTeam).filter(hasID);
    const currentTeamValue = normalizeTeam(data.team);
    const currentTeam = currentTeamValue.id
      ? {
          ...currentTeamValue,
          projectEnabled: Boolean(data.project_enabled),
        }
      : null;
    return {
      teams,
      team: currentTeam,
      releaseID: numberValue(data.release?.id),
      workspaceBodyID: numberValue(data.workspace?.body_id),
      projectEnabled: Boolean(data.project_enabled),
      powers: toRows(data.powers).map(normalizePower).filter(hasID),
      roles: toRows(data.roles)
        .map(normalizeRole)
        .filter(hasID),
      assetCates: toRows(data.asset_cates)
        .map(normalizeAssetCate)
        .filter(hasID),
    } satisfies WorkbenchCatalog;
  });
}

export async function loadWorkbenchSystemMessages(limit = 20) {
  const result = await request(joinSiteApi("system_message/list"), "get", {
    limit,
  });
  const data = responseData(result, "加载系统消息失败");
  return toRows(data.items)
    .map(normalizeSystemMessage)
    .filter(hasID) satisfies WorkbenchSystemMessage[];
}

export function workbenchApi(path: string) {
  return joinSiteApi(`workbench/${path}`);
}

export function scopedWorkbenchApi(
  path: string,
  scope: { teamID: number; roleID?: number },
) {
  const query = new URLSearchParams({ team_id: String(scope.teamID) });
  if (scope.roleID) {
    query.set("role_id", String(scope.roleID));
  }
  const api = workbenchApi(path);
  return `${api}${api.includes("?") ? "&" : "?"}${query.toString()}`;
}

export async function saveWorkbenchDialogueAsset(input: {
  teamID: number;
  roleID: number;
  messageID: number;
  artifactID?: number;
  documentID?: number;
  targetAssetID?: number;
  name?: string;
}) {
  return saveWorkbenchAsset("chat_save_asset", {
    team_id: input.teamID,
    role_id: input.roleID,
    message_id: input.messageID,
    artifact_id: input.artifactID || undefined,
    document_id: input.documentID || undefined,
    target_asset_id: input.targetAssetID || undefined,
    name: input.name?.trim() || undefined,
  });
}

export async function saveWorkbenchPowerAsset(input: {
  teamID: number;
  teamPowerID: number;
  requestID: string;
  targetAssetID?: number;
  name?: string;
}) {
  return saveWorkbenchAsset("power_save_asset", {
    team_id: input.teamID,
    team_power_id: input.teamPowerID,
    request_id: input.requestID,
    target_asset_id: input.targetAssetID || undefined,
    name: input.name?.trim() || undefined,
  });
}

async function saveWorkbenchAsset(
  path: string,
  payload: Record<string, unknown>,
) {
  const result = await request(workbenchApi(path), "post", payload);
  const data = responseData(result, "保存资产失败");
  const assetID = numberValue(data.asset?.id);
  if (!assetID) {
    throw new Error("保存资产结果为空");
  }
  return assetID;
}

export function responseData(result: any, fallback: string): Record<string, any> {
  if (!isSuccessResponse(result)) {
    throw new Error(String(result?.message || result?.msg || fallback));
  }
  return isRecord(result?.data) ? result.data : {};
}

function normalizeTeam(value: any): WorkbenchTeam {
  return {
    id: numberValue(value?.id),
    name: textValue(value?.name) || "未命名团队",
    description: textValue(value?.description),
    projectEnabled: enabledValue(value?.project_enabled),
  };
}

function normalizePower(value: any): WorkbenchPower {
  return {
    id: numberValue(value?.id),
    powerID: numberValue(value?.power_id),
    name: textValue(value?.name || value?.key) || "未命名能力",
    key: textValue(value?.key),
    icon: textValue(value?.icon),
    kind: textValue(value?.kind),
    outputType: textValue(value?.output_type || value?.output),
  };
}

function normalizeRole(value: any): WorkbenchRole {
  return {
    id: numberValue(value?.id),
    name: textValue(value?.name) || "未命名角色",
    roleType: textValue(value?.role_type),
    assignment: textValue(value?.assignment),
    agentID: numberValue(value?.agent_id),
    agentKey: textValue(value?.agent_key),
    agentName: textValue(value?.agent_name),
    openingEnabled: Boolean(value?.opening_enabled),
  };
}

function normalizeAssetCate(value: any): WorkbenchAssetCate {
  return {
    id: numberValue(value?.id),
    name: textValue(value?.name) || "未命名分类",
    kind: textValue(value?.kind) || "text",
    cardinality: textValue(value?.cardinality) || "single",
  };
}

function normalizeSystemMessage(value: any): WorkbenchSystemMessage {
  return {
    id: numberValue(value?.id),
    title: textValue(value?.title) || "系统消息",
    content: textValue(value?.content),
    url: textValue(value?.url),
    pinned: Boolean(value?.pinned),
    publishedAt: textValue(value?.published_at),
  };
}

function hasID<T extends { id: number }>(value: T) {
  return value.id > 0;
}

export function toRows(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

export function isRecord(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function numberValue(value: unknown) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

export function textValue(value: unknown) {
  return value == null ? "" : String(value).trim();
}

function enabledValue(value: unknown) {
  return value !== false && Number(value || 1) !== 2;
}
