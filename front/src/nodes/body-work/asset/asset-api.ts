import { joinSiteApi, request } from "@dever/front-plugin";
import { isSuccessResponse } from "../shared/api-response";
import { createInFlightRequestLoader } from "../shared/in-flight-request";
import type {
  AssetCatalogOptions,
  AssetCateOption,
  AssetContentMode,
  AssetDetail,
  AssetFilterOption,
  AssetFilterOptions,
  AssetFilters,
  AssetKind,
  AssetNodeOption,
  AssetPage,
  AssetRecord,
  AssetRole,
  AssetSourceType,
  AssetView,
  AssetVersion,
} from "./asset-types";

const loadFilterOptionsRequest =
  createInFlightRequestLoader<AssetFilterOptions>();
const loadAssetPageRequest = createInFlightRequestLoader<AssetPage>();

export function loadAssetFilterOptions(
  teamID: number,
  catalogOptions?: AssetCatalogOptions,
): Promise<AssetFilterOptions> {
  const key = JSON.stringify({ teamID, catalogOptions: catalogOptions || null });
  return loadFilterOptionsRequest(key, async () => {
    const filtersPromise = request(
      joinSiteApi("workbench/asset_filters"),
      "get",
      { team_id: teamID },
    );
    const [catalogResult, filtersResult] = catalogOptions
      ? [null, await filtersPromise]
      : await Promise.all([
          request(joinSiteApi("workbench/catalog"), "get", {
            team_id: teamID,
          }),
          filtersPromise,
        ]);
    const catalog = catalogOptions
      ? {
          powers: catalogOptions.tools,
          roles: catalogOptions.dialogues,
          asset_cates: catalogOptions.assetCates,
        }
      : responseData(catalogResult, "加载团队资产配置失败");
    const filters = responseData(filtersResult, "加载资产筛选项失败");
    return {
      projects: toRows(filters.projects)
        .map(normalizeSimpleOption)
        .filter(hasID),
      tools: mergeSimpleOptions(catalog.powers, filters.tools),
      dialogues: mergeSimpleOptions(catalog.roles, filters.dialogues),
      assetCates: toRows(catalog.asset_cates)
        .map(normalizeAssetCate)
        .filter(hasID),
      nodes: toRows(filters.nodes).map(normalizeNode).filter(hasNodeKey),
    };
  });
}

export function loadAssetPage(input: {
  teamID: number;
  filters: AssetFilters;
  page: number;
  pageSize?: number;
  view?: AssetView;
  contentMode?: AssetContentMode;
}): Promise<AssetPage> {
  const normalizedInput = {
    ...input,
    pageSize: input.pageSize || 24,
    view: input.view || ("assets" as const),
    contentMode: input.contentMode || ("preview" as const),
  };
  return loadAssetPageRequest(JSON.stringify(normalizedInput), async () => {
    const result = await request(joinSiteApi("workbench/assets"), "get", {
      team_id: normalizedInput.teamID,
      source_type: normalizedInput.filters.sourceType || undefined,
      source_id: normalizedInput.filters.sourceID || undefined,
      project_id: normalizedInput.filters.projectID || undefined,
      asset_cate_id: normalizedInput.filters.assetCateID || undefined,
      node_key: normalizedInput.filters.nodeKey || undefined,
      role: normalizedInput.filters.role || undefined,
      kind: normalizedInput.filters.kind || undefined,
      view: normalizedInput.view,
      content_mode: normalizedInput.contentMode,
      page: normalizedInput.page,
      page_size: normalizedInput.pageSize,
    });
    const data = responseData(result, "加载资产失败");
    return {
      items: toRows(data.items).map(normalizeAssetRecord).filter(hasID),
      page: positiveNumber(data.page, normalizedInput.page),
      pageSize: positiveNumber(data.page_size, normalizedInput.pageSize),
      total: nonNegativeNumber(data.total),
      hasMore: Boolean(data.has_more),
    };
  });
}

export async function loadAssetDetail(
  teamID: number,
  assetID: number,
): Promise<AssetDetail> {
  const result = await request(joinSiteApi("workbench/asset_detail"), "get", {
    team_id: teamID,
    asset_id: assetID,
  });
  return normalizeDetail(responseData(result, "加载资产详情失败"));
}

export async function loadAssetVersions(input: {
  teamID: number;
  assetID: number;
  page: number;
  pageSize?: number;
}) {
  const result = await request(joinSiteApi("workbench/asset_versions"), "get", {
    team_id: input.teamID,
    asset_id: input.assetID,
    page: input.page,
    page_size: input.pageSize || 20,
  });
  const data = responseData(result, "加载资产版本失败");
  return {
    items: toRows(data.items).map(normalizeVersion).filter(hasID),
    total: nonNegativeNumber(data.total),
    hasMore: Boolean(data.has_more),
  };
}

export async function loadAssetVersion(input: {
  teamID: number;
  assetID: number;
  versionID: number;
}) {
  const result = await request(joinSiteApi("workbench/asset_version"), "get", {
    team_id: input.teamID,
    asset_id: input.assetID,
    version_id: input.versionID,
  });
  const data = responseData(result, "加载资产版本失败");
  return normalizeVersion(data.version);
}

export async function setAssetCurrentVersion(input: {
  teamID: number;
  assetID: number;
  versionID: number;
}) {
  const result = await request(
    joinSiteApi("workbench/asset_set_current"),
    "post",
    {
      team_id: input.teamID,
      asset_id: input.assetID,
      version_id: input.versionID,
    },
  );
  const data = responseData(result, "设置当前版本失败");
  return normalizeAssetRecord(data.asset);
}

export async function renameAsset(input: {
  teamID: number;
  assetID: number;
  name: string;
}) {
  const result = await request(joinSiteApi("workbench/asset_rename"), "post", {
    team_id: input.teamID,
    asset_id: input.assetID,
    name: input.name,
  });
  const data = responseData(result, "修改资产标题失败");
  return normalizeAssetRecord(data.asset);
}

export async function moveAssetToTrash(input: {
  teamID: number;
  assetID: number;
}) {
  const result = await request(joinSiteApi("workbench/asset_delete"), "post", {
    team_id: input.teamID,
    asset_id: input.assetID,
  });
  responseData(result, "删除资产失败");
}

export async function restoreAsset(input: { teamID: number; assetID: number }) {
  const result = await request(joinSiteApi("workbench/asset_restore"), "post", {
    team_id: input.teamID,
    asset_id: input.assetID,
  });
  const data = responseData(result, "恢复资产失败");
  return normalizeAssetRecord(data.asset);
}

function normalizeDetail(value: Record<string, any>): AssetDetail {
  return {
    asset: normalizeAssetRecord(value.asset),
    versions: toRows(value.versions).map(normalizeVersion).filter(hasID),
    versionTotal: nonNegativeNumber(value.version_total),
    hasMore: Boolean(value.has_more),
  };
}

export function normalizeAssetRecord(value: any): AssetRecord {
  const version = isRecord(value?.version)
    ? normalizeVersion(value.version)
    : null;
  return {
    id: numberValue(value?.id),
    projectID: numberValue(value?.project_id),
    bodyID: numberValue(value?.body_id),
    teamID: numberValue(value?.team_id),
    flowID: numberValue(value?.flow_id),
    assetCateID: numberValue(value?.asset_cate_id),
    nodeKey: textValue(value?.node_key),
    sourceType: textValue(value?.source_type) as AssetSourceType,
    sourceID: numberValue(value?.source_id),
    sourceName: textValue(value?.source_name),
    name: textValue(value?.name) || "未命名资产",
    nameMode: textValue(value?.name_mode) === "manual" ? "manual" : "auto",
    kind: (textValue(value?.kind) || "text") as AssetKind,
    role: (textValue(value?.role) || "material") as AssetRole,
    versionID: numberValue(value?.version_id),
    status: textValue(value?.status),
    summary: textValue(value?.summary || version?.summary),
    createdAt: textValue(value?.created_at),
    deletedAt: textValue(value?.deleted_at),
    version,
  };
}

function normalizeVersion(value: any): AssetVersion {
  return {
    id: numberValue(value?.id),
    assetID: numberValue(value?.asset_id),
    runID: numberValue(value?.run_id),
    nodeRunID: numberValue(value?.node_run_id),
    releaseID: numberValue(value?.release_id),
    requestID: textValue(value?.request_id),
    nodeKey: textValue(value?.node_key),
    source: isRecord(value?.source) ? value.source : {},
    version: positiveNumber(value?.version, 1),
    content: value?.content,
    summary: textValue(value?.summary),
    createdAt: textValue(value?.created_at),
    updatedAt: textValue(value?.updated_at || value?.created_at),
  };
}

function normalizeSimpleOption(value: any): AssetFilterOption {
  return {
    id: numberValue(value?.id),
    name: textValue(value?.name) || "未命名",
  };
}

function mergeSimpleOptions(...values: unknown[]): AssetFilterOption[] {
  const result: AssetFilterOption[] = [];
  const seen = new Set<number>();
  for (const value of values) {
    for (const row of toRows(value)) {
      const option = normalizeSimpleOption(row);
      if (option.id <= 0 || seen.has(option.id)) {
        continue;
      }
      seen.add(option.id);
      result.push(option);
    }
  }
  return result;
}

function normalizeAssetCate(value: any): AssetCateOption {
  return {
    ...normalizeSimpleOption(value),
    kind: (textValue(value?.kind) || "text") as AssetKind,
    cardinality: textValue(value?.cardinality) || "single",
  };
}

function normalizeNode(value: any): AssetNodeOption {
  return {
    projectID: numberValue(value?.project_id),
    assetCateID: numberValue(value?.asset_cate_id),
    nodeKey: textValue(value?.node_key),
    name: textValue(value?.name) || "未命名节点",
  };
}

function responseData(result: any, fallback: string): Record<string, any> {
  if (!isSuccessResponse(result)) {
    throw new Error(String(result?.message || result?.msg || fallback));
  }
  return isRecord(result?.data) ? result.data : {};
}

function hasID<T extends { id: number }>(value: T) {
  return value.id > 0;
}

function hasNodeKey(value: AssetNodeOption) {
  return value.projectID > 0 && Boolean(value.nodeKey);
}

function toRows(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

function isRecord(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function numberValue(value: unknown) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number > 0 ? number : 0;
}

function positiveNumber(value: unknown, fallback: number) {
  return numberValue(value) || fallback;
}

function nonNegativeNumber(value: unknown) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number >= 0 ? number : 0;
}

function textValue(value: unknown) {
  return value == null ? "" : String(value).trim();
}
