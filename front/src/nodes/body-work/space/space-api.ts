import { joinSiteApi, request } from "@dever/front-plugin";
import {
  normalizeAssetVersion,
  normalizeAssetVersions,
  normalizeCanvasState,
  normalizePowerCatalog,
  normalizeProjectAsset,
  normalizeSpaceBootstrap,
} from "./space-model";
import { persistedCanvasState } from "./space-canvas-state";
import {
  successfulResponseData,
  successfulResponseValue,
} from "../shared/api-response";
import {
  parseStoryboardShotGeneration,
  type StoryboardDocument,
  type StoryboardProductionPlan,
  type StoryboardShotGeneration,
} from "./space-storyboard";
import { isStoryboardWorkTypeKey } from "./space-storyboard-work-type";
import type {
  AssetVersion,
  AssetVersionPage,
  CanvasResultSourceRef,
  OutputTypeOption,
  PowerCategoryOption,
  PowerForm,
  PowerKindOption,
  PowerOption,
  ProjectAsset,
  SpaceAssetDetail,
  SpaceBootstrap,
  SpaceCanvasState,
  StoryboardReferencePurposeScope,
  StoryboardReferencePurposeSpec,
  StoryboardWorkType,
  StoryboardWorkTypeSpec,
  TeamRole,
} from "./types";

export async function fetchSpaceBootstrap(
  projectId: number,
  assetCateId = 0,
): Promise<SpaceBootstrap> {
  const result = await request(joinSiteApi("workspace/bootstrap"), "get", {
    project_id: projectId,
    asset_cate_id: assetCateId,
  });
  return normalizeSpaceBootstrap(
    successfulResponseValue(result, "加载创作空间失败"),
  );
}

export async function fetchSpaceCanvas(input: {
  projectId: number;
  assetCateId: number;
}): Promise<{ canvas: SpaceCanvasState; assets: ProjectAsset[] }> {
  const result = await request(joinSiteApi("workspace/canvas"), "get", {
    project_id: input.projectId,
    asset_cate_id: input.assetCateId,
  });
  const data = successfulResponseData(result, "加载分类画布失败");
  const assets = data.assets || {};
  const assetRows = Array.isArray(assets.items)
    ? assets.items
    : Array.isArray(assets)
      ? assets
      : [];
  return {
    canvas: normalizeCanvasState(data.canvas, input.assetCateId),
    assets: assetRows.map(normalizeProjectAsset),
  };
}

export async function fetchSpacePowers(projectId: number): Promise<{
  roles: TeamRole[];
  powers: PowerOption[];
  powerCategories: PowerCategoryOption[];
  powerKinds: PowerKindOption[];
  outputTypes: OutputTypeOption[];
}> {
  const result = await request(joinSiteApi("project/canvas_config"), "get", {
    project_id: projectId,
  });
  return normalizePowerCatalog(
    successfulResponseValue(result, "加载能力列表失败"),
  );
}

export async function fetchSpacePowerForm(input: {
  projectId: number;
  flowId?: number;
  powerId: number;
  powerKey: string;
  targetId?: number;
}): Promise<PowerForm> {
  const result = await request(joinSiteApi("project/canvas_power_form"), "get", {
    project_id: input.projectId,
    flow_id: input.flowId || 0,
    power_id: input.powerId,
    power_key: input.powerKey,
    target_id: input.targetId || 0,
  });
  return normalizePowerForm(
    successfulResponseValue(result, "加载能力参数失败"),
  );
}

export async function runSpaceCanvas(input: {
  projectId: number;
  assetCateId: number;
  startNodeId: string;
  requestId?: string;
  singleNode?: boolean;
  executionScope?: "storyboard_frame";
  canvas: SpaceCanvasState;
  runInput?: Record<string, unknown>;
}) {
  const result = await request(joinSiteApi("workspace/canvas_execute"), "post", {
    project_id: input.projectId,
    asset_cate_id: input.assetCateId,
    start_node_id: input.startNodeId,
    request_id: input.requestId || "",
    single_node: Boolean(input.singleNode),
    execution_scope: input.executionScope || "",
    canvas: persistedCanvasState(input.canvas),
    input: input.runInput || {},
  });
  return successfulResponseData(result, "画布运行失败");
}

export async function generateSpaceCanvasNodeTitle(input: {
  projectId: number;
  nodeKey: string;
  versionId: number;
  prompt?: string;
}): Promise<{ nodeKey: string; versionId: number; title: string }> {
  const result = await request(
    joinSiteApi("workspace/canvas_node_title"),
    "post",
    {
      project_id: input.projectId,
      node_key: input.nodeKey,
      version_id: input.versionId,
      prompt: input.prompt || "",
    },
  );
  const data = successfulResponseData(result, "生成节点标题失败");
  return {
    nodeKey: String(data.node_key || input.nodeKey),
    versionId: Number(data.version_id || input.versionId || 0),
    title: String(data.title || "").trim(),
  };
}

function projectAssetFromResponse(
  result: unknown,
  fallbackMessage: string,
  emptyMessage: string,
) {
  const asset = successfulResponseData(result, fallbackMessage).asset;
  if (!asset) {
    throw new Error(emptyMessage);
  }
  return normalizeProjectAsset(asset);
}

export type SpaceCanvasExecutionScope = "recovery" | "active" | "history";

export async function fetchSpaceCanvasExecutions(input: {
  projectId: number;
  scope: SpaceCanvasExecutionScope;
  assetCateId?: number;
  runIds?: number[];
  beforeId?: number;
  limit?: number;
  summaryOnly?: boolean;
}) {
  const result = await request(
    joinSiteApi("workspace/canvas_execution_list"),
    "get",
    {
      project_id: input.projectId,
      scope: input.scope,
      asset_cate_id: input.assetCateId || 0,
      run_ids: (input.runIds || []).filter((runId) => runId > 0).join(","),
      before_id: input.beforeId || 0,
      limit: input.limit || 20,
      summary_only: input.summaryOnly ? 1 : 0,
    },
  );
  const data = successfulResponseData(result, "读取画布运行记录失败");
  return {
    count: Number(data.count || 0),
    items: Array.isArray(data.items) ? data.items : [],
    hasMore: Boolean(data.has_more),
    beforeId: Number(data.before_id || 0),
  };
}

export async function fetchSpaceCanvasExecution(input: {
  projectId: number;
  executionId?: number;
  runId?: number;
  requestId?: string;
}) {
  const executionId = Number(input.executionId || 0);
  const requestId = String(input.requestId || "").trim();
  const runId = Number(input.runId || 0);
  const result = await request(
    joinSiteApi("workspace/canvas_execution"),
    "get",
    {
      project_id: input.projectId,
      execution_id: executionId,
      request_id: executionId > 0 ? "" : requestId,
      run_id: executionId > 0 || requestId ? 0 : runId,
    },
  );
  return successfulResponseData(result, "读取画布运行详情失败");
}

export async function submitSpaceCanvasFeedback(input: {
  projectId: number;
  runId: number;
  requestId: string;
  nodeKey: string;
  approvalId?: number;
  feedback?: Record<string, unknown>;
  decision?: string;
  comment?: string;
}) {
  const result = await request(joinSiteApi("run/approval"), "post", {
    project_id: input.projectId,
    run_id: input.runId,
    request_id: input.requestId,
    node_key: input.nodeKey,
    approval_id: input.approvalId || 0,
    data: input.feedback || {},
    decision: input.decision || "approved",
    comment: input.comment || "",
  });
  return successfulResponseValue(result, "继续画布运行失败");
}

export async function fetchSpaceRunStatus(input: {
  projectId: number;
  runId?: number;
  requestId?: string;
}) {
  const result = await request(joinSiteApi("run/status"), "get", {
    project_id: input.projectId,
    run_id: input.runId || 0,
    request_id: input.requestId || "",
    view: "summary",
  });
  return successfulResponseValue(result, "读取流程状态失败");
}

export async function stopSpaceCanvasRun(input: {
  projectId: number;
  runId?: number;
  requestId?: string;
}) {
  const result = await request(joinSiteApi("run/stop"), "post", {
    project_id: input.projectId,
    run_id: input.runId || 0,
    request_id: input.requestId || "",
  });
  return successfulResponseData(result, "停止画布运行失败");
}

export async function stopAllSpaceCanvasRuns(projectId: number) {
  const result = await request(
    joinSiteApi("workspace/canvas_stop_all"),
    "post",
    { project_id: projectId },
  );
  const data = successfulResponseData(result, "停止全部画布运行失败");
  return {
    count: Number(data.count || 0),
    stoppedCount: Number(data.stopped_count || 0),
    failedCount: Number(data.failed_count || 0),
    items: Array.isArray(data.items) ? data.items : [],
  };
}

export async function submitSpaceInteraction(input: {
  projectId: number;
  runId: number;
  nodeRunId?: number;
  interactionId: string;
  data: Record<string, unknown>;
}) {
  const result = await request(joinSiteApi("run/interaction"), "post", {
    project_id: input.projectId,
    run_id: input.runId,
    node_run_id: input.nodeRunId || 0,
    interaction_id: input.interactionId,
    data: input.data,
  });
  return successfulResponseValue(result, "提交信息失败");
}

export async function saveSpaceAssetEditVersion(input: {
  projectId: number;
  assetId: number;
  versionId: number;
  content: unknown;
}): Promise<ProjectAsset> {
  const result = await request(
    joinSiteApi("project/update_asset_version"),
    "post",
    {
      project_id: input.projectId,
      asset_id: input.assetId,
      version_id: input.versionId,
      content: input.content,
    },
  );
  return projectAssetFromResponse(
    result,
    "保存资产版本失败",
    "资产版本保存结果为空",
  );
}

export async function restoreSpaceAssetVersion(input: {
  projectId: number;
  assetId: number;
  versionId: number;
  requestId: string;
  nodeKey: string;
}): Promise<ProjectAsset> {
  const result = await request(
    joinSiteApi("project/restore_asset_version"),
    "post",
    {
      project_id: input.projectId,
      asset_id: input.assetId,
      version_id: input.versionId,
      request_id: input.requestId,
      node_key: input.nodeKey,
    },
  );
  return projectAssetFromResponse(
    result,
    "恢复资产版本失败",
    "资产版本恢复结果为空",
  );
}

export async function confirmSpaceStoryboard(input: {
  projectId: number;
  assetId: number;
  versionId: number;
  productionPlan: StoryboardProductionPlan;
}): Promise<ProjectAsset> {
  const result = await request(
    joinSiteApi("project/confirm_storyboard"),
    "post",
    {
      project_id: input.projectId,
      asset_id: input.assetId,
      version_id: input.versionId,
      production_plan: input.productionPlan,
    },
  );
  return projectAssetFromResponse(result, "确认分镜失败", "确认分镜结果为空");
}

export async function createSpaceStoryboardRevision(input: {
  projectId: number;
  assetId: number;
  versionId: number;
  requestId: string;
  nodeKey: string;
}): Promise<ProjectAsset> {
  const result = await request(
    joinSiteApi("project/create_storyboard_revision"),
    "post",
    {
      project_id: input.projectId,
      asset_id: input.assetId,
      version_id: input.versionId,
      request_id: input.requestId,
      node_key: input.nodeKey,
    },
  );
  return projectAssetFromResponse(
    result,
    "创建分镜修订稿失败",
    "创建分镜修订稿结果为空",
  );
}

export async function generateSpaceStoryboardShot(input: {
  projectId: number;
  assetId: number;
  versionId: number;
  flowId: number;
  assetCateId: number;
  requestId: string;
  nodeKey: string;
  nodeName: string;
  powerId: number;
  powerKey: string;
  sourceTargetId: number;
  params: Record<string, unknown>;
  storyboard: StoryboardDocument;
  shotId: string;
  instruction: string;
}): Promise<StoryboardShotGeneration> {
  const shotIndex = input.storyboard.shots.findIndex(
    (shot) => shot.id === input.shotId,
  );
  if (shotIndex < 0) {
    throw new Error("目标镜头不存在");
  }
  const result = await request(
    joinSiteApi("project/generate_storyboard_shot"),
    "post",
    {
      project_id: input.projectId,
      asset_id: input.assetId,
      version_id: input.versionId,
      flow_id: input.flowId,
      asset_cate_id: input.assetCateId,
      request_id: input.requestId,
      node_key: input.nodeKey,
      node_name: input.nodeName,
      power_id: input.powerId,
      power_key: input.powerKey,
      source_target_id: input.sourceTargetId,
      params: input.params,
      storyboard: input.storyboard,
      shot_id: input.shotId,
      instruction: input.instruction,
    },
  );
  const data = successfulResponseData(result, "生成镜头失败");
  const generation = parseStoryboardShotGeneration(data, shotIndex);
  if (!generation || generation.shot.id !== input.shotId) {
    throw new Error("生成镜头结果格式无效");
  }
  return generation;
}

export async function fetchSpaceAssetDetail(input: {
  projectId: number;
  assetId: number;
  currentOnly?: boolean;
}): Promise<SpaceAssetDetail> {
  const result = await request(joinSiteApi("project/asset_detail"), "get", {
    project_id: input.projectId,
    asset_id: input.assetId,
    current_only: input.currentOnly ? 1 : 0,
  });
  const data = successfulResponseData(result, "读取资产详情失败");
  const asset = data.asset;
  if (!asset) {
    throw new Error("资产详情为空");
  }
  const versions = normalizeAssetVersions(data.versions);
  return {
    asset: normalizeProjectAsset(asset),
    versions,
    versionTotal: Number(data.version_total || versions.length),
    hasMore: Boolean(data.has_more),
  };
}

export async function fetchSpaceAssetVersions(input: {
  projectId: number;
  assetId: number;
  page: number;
  pageSize?: number;
}): Promise<AssetVersionPage> {
  const result = await request(joinSiteApi("project/asset_versions"), "get", {
    project_id: input.projectId,
    asset_id: input.assetId,
    page: input.page,
    page_size: input.pageSize || 20,
  });
  const data = successfulResponseData(result, "读取资产版本失败");
  const items = normalizeAssetVersions(data.items);
  return {
    items,
    page: Number(data.page || input.page || 1),
    pageSize: Number(data.page_size || input.pageSize || 20),
    total: Number(data.total || items.length),
    hasMore: Boolean(data.has_more),
  };
}

export async function fetchSpaceAssetVersionDetail(input: {
  projectId: number;
  assetId: number;
  versionId: number;
}): Promise<AssetVersion> {
  const result = await request(
    joinSiteApi("project/asset_version_detail"),
    "get",
    {
      project_id: input.projectId,
      asset_id: input.assetId,
      version_id: input.versionId,
    },
  );
  const raw = successfulResponseData(result, "读取历史版本失败").version;
  const version = normalizeAssetVersion(
    raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {},
  );
  if (!version?.id) {
    throw new Error("历史版本内容为空");
  }
  return version;
}

type SaveSpaceCanvasResultInput = {
  projectId: number;
  assetCateId: number;
  name: string;
  kind: string;
  content: unknown;
  runId?: number;
  nodeRunId?: number;
  releaseId?: number;
  nodeKey?: string;
  requestId?: string;
  source?: CanvasResultSourceRef | null;
};

function canvasResultPayload(input: SaveSpaceCanvasResultInput) {
  const payload: Record<string, unknown> = {
    project_id: input.projectId,
    asset_cate_id: input.assetCateId,
    name: input.name,
    kind: input.kind,
    content: input.content,
    request_id: input.requestId || "",
  };
  if (input.runId) {
    payload.run_id = input.runId;
  }
  if (input.nodeRunId) {
    payload.node_run_id = input.nodeRunId;
  }
  if (input.releaseId) {
    payload.release_id = input.releaseId;
  }
  if (input.nodeKey) {
    payload.node_key = input.nodeKey;
  }
  if (input.source) {
    const source = input.source;
    if (source.sourceKey) payload.source_key = source.sourceKey;
    if (source.sourceRunId) payload.source_run_id = source.sourceRunId;
    if (source.sourceNodeRunId) payload.source_node_run_id = source.sourceNodeRunId;
    if (source.sourceAssetId) payload.source_asset_id = source.sourceAssetId;
    if (source.sourceVersionId) payload.source_version_id = source.sourceVersionId;
    if (source.sourceReleaseId) payload.source_release_id = source.sourceReleaseId;
    if (source.sourceRequestId) payload.source_request_id = source.sourceRequestId;
    if (source.sourceNodeKey) payload.source_node_key = source.sourceNodeKey;
    if (source.sourceNodeType) payload.source_node_type = source.sourceNodeType;
    if (source.sourceStatus) payload.source_status = source.sourceStatus;
  }
  return payload;
}

async function saveSpaceCanvasResult(
  role: "material" | "work",
  input: SaveSpaceCanvasResultInput,
): Promise<ProjectAsset> {
  const result = await request(joinSiteApi("project/save_asset"), "post", {
    ...canvasResultPayload(input),
    role,
  });
  return projectAssetFromResponse(result, "保存资产失败", "保存资产结果为空");
}

export function saveSpaceCanvasContent(
  input: SaveSpaceCanvasResultInput,
): Promise<ProjectAsset> {
  return saveSpaceCanvasResult("work", input);
}

export function saveSpaceCanvasMaterial(
  input: SaveSpaceCanvasResultInput,
): Promise<ProjectAsset> {
  return saveSpaceCanvasResult("material", input);
}

export async function saveSpaceCanvas(
  projectId: number,
  assetCateId: number,
  canvas: SpaceCanvasState,
): Promise<{ assetCateId: number; updatedAt: string }> {
  const result = await request(joinSiteApi("workspace/canvas"), "post", {
    project_id: projectId,
    asset_cate_id: assetCateId,
    base_revision: canvas.updatedAt || "",
    canvas: persistedCanvasState(canvas),
  });
  const data = successfulResponseData(result, "保存画布失败");
  return {
    assetCateId: Number(data.asset_cate_id || assetCateId || 0),
    updatedAt: String(data.updated_at || canvas.updatedAt || ""),
  };
}

function normalizePowerForm(value: any): PowerForm {
  const data = value && typeof value === "object" ? value : {};
  const storyboardWorkTypes = normalizeStoryboardWorkTypeSpecs(
    data.storyboard_work_types,
  );
  const storyboardReferencePurposes = normalizeStoryboardReferencePurposeSpecs(
    data.storyboard_reference_purposes,
    storyboardWorkTypes,
  );
  const outputType = String(
    data.power?.output_type || data.power?.outputType || "",
  ).trim();
  const outputViewMode = String(
    data.power?.output?.view_mode || data.power?.output?.viewMode || "",
  ).trim();
  if (
    (outputType === "storyboard" || outputViewMode === "storyboard") &&
    (storyboardWorkTypes.length === 0 || storyboardReferencePurposes.length === 0)
  ) {
    throw new Error("分镜作品类型或参考用途注册信息缺失");
  }
  const knownPurposes = new Set<string>(
    storyboardReferencePurposes.map((spec) => spec.key),
  );
  if (
    storyboardWorkTypes.some((spec) =>
      spec.required_reference_purposes.some(
        (purpose) => !knownPurposes.has(purpose),
      ),
    )
  ) {
    throw new Error("分镜作品类型引用了未知的参考用途");
  }
  return {
    ...data,
    sources: Array.isArray(data.sources) ? data.sources : [],
    params: Array.isArray(data.params) ? data.params : [],
    selected_target_id: Number(data.selected_target_id || 0),
    source_rule: Number(data.source_rule || 0),
    primary_param_key: String(data.primary_param_key || ""),
    storyboard_work_types: storyboardWorkTypes,
    storyboard_reference_purposes: storyboardReferencePurposes,
  };
}

const STORYBOARD_REFERENCE_MEDIA_KINDS = new Set(["image", "video", "audio"]);
const STORYBOARD_REFERENCE_SCOPES = new Set<StoryboardReferencePurposeScope>([
  "global",
  "material",
  "shot",
  "composition",
  "context",
]);

function normalizeStoryboardWorkTypeSpecs(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }
  const seen = new Set<string>();
  return value
    .map((raw): StoryboardWorkTypeSpec => {
      const row = raw && typeof raw === "object" ? (raw as any) : {};
      const key = String(row.key || "").trim().toLowerCase();
      if (!isStoryboardWorkTypeKey(key) || seen.has(key)) {
        throw new Error("分镜作品类型注册信息无效");
      }
      const sort = Number(row.sort || 0);
      if (!Number.isInteger(sort)) {
        throw new Error("分镜作品类型注册信息无效");
      }
      seen.add(key);
      return {
        key,
        name: String(row.name || "").trim() || key,
        sort,
        required_reference_purposes: stringArray(
          row.required_reference_purposes,
        ),
      };
    })
    .sort((left, right) => left.sort - right.sort);
}

function normalizeStoryboardReferencePurposeSpecs(
  value: unknown,
  workTypes: StoryboardWorkTypeSpec[],
) {
  if (!Array.isArray(value)) {
    return [];
  }
  const knownWorkTypes = new Set(workTypes.map((spec) => spec.key));
  const seen = new Set<string>();
  return value
    .map((raw): StoryboardReferencePurposeSpec => {
      const row = raw && typeof raw === "object" ? (raw as any) : {};
      const key = String(row.key || "").trim();
      const mediaKinds = stringArray(row.media_kinds);
      const scope = String(
        row.scope || "",
      ).trim() as StoryboardReferencePurposeScope;
      const purposeWorkTypes = stringArray(row.work_types) as StoryboardWorkType[];
      const defaultMediaKinds = stringArray(
        row.default_media_kinds,
      ) as StoryboardReferencePurposeSpec["default_media_kinds"];
      const materialType = String(row.material_type || "").trim();
      const maxCount = Number(row.max_count || 0);
      const sort = Number(row.sort || 0);
      if (
        !key ||
        seen.has(key) ||
        mediaKinds.length === 0 ||
        mediaKinds.some((kind) => !STORYBOARD_REFERENCE_MEDIA_KINDS.has(kind)) ||
        !STORYBOARD_REFERENCE_SCOPES.has(scope) ||
        purposeWorkTypes.some((workType) => !knownWorkTypes.has(workType)) ||
        defaultMediaKinds.some((kind) => !mediaKinds.includes(kind)) ||
        (scope === "material" &&
          materialType !== "character" &&
          materialType !== "scene" &&
          materialType !== "prop") ||
        (scope !== "material" && Boolean(materialType)) ||
        !Number.isInteger(maxCount) ||
        maxCount < 0 ||
        !Number.isInteger(sort)
      ) {
        throw new Error("分镜参考用途注册信息无效");
      }
      seen.add(key);
      return {
        key: key as StoryboardReferencePurposeSpec["key"],
        name: String(row.name || "").trim() || key,
        media_kinds: mediaKinds as StoryboardReferencePurposeSpec["media_kinds"],
        work_types: purposeWorkTypes,
        scope,
        material_type:
          materialType as StoryboardReferencePurposeSpec["material_type"],
        default_media_kinds: defaultMediaKinds,
        max_count: maxCount,
        sort,
      };
    })
    .sort((left, right) => left.sort - right.sort);
}

function stringArray(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => String(item || "").trim()).filter(Boolean)
    : [];
}
