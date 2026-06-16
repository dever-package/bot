import { joinSiteApi, request } from "@dever/front-plugin";
import {
  normalizeCanvasState,
  normalizePowerCatalog,
  normalizeProjectAsset,
  normalizeSpaceBootstrap,
} from "./space-model";
import { persistedCanvasState } from "./space-canvas-state";
import { isSuccessResponse } from "../shared/api-response";
import type {
  CanvasResultSourceRef,
  PowerForm,
  PowerKindOption,
  PowerOption,
  ProjectAsset,
  SpaceBootstrap,
  SpaceCanvasState,
} from "./types";

export async function fetchSpaceBootstrap(
  projectId: number,
): Promise<SpaceBootstrap> {
  const result = await request(joinSiteApi("workspace/bootstrap"), "get", {
    project_id: projectId,
  });
  if (!isSuccessResponse(result)) {
    throw new Error(result.message || result.msg || "加载创作空间失败");
  }
  return normalizeSpaceBootstrap(result.data);
}

export async function sendSpaceMessage(
  projectId: number,
  assetCateId: number,
  message: string,
) {
  const result = await request(joinSiteApi("run/team"), "post", {
    project_id: projectId,
    mode: "conversation",
    input: {
      goal: message,
      prompt: message,
      asset_cate_id: assetCateId,
    },
  });
  if (!isSuccessResponse(result)) {
    throw new Error(result.message || result.msg || "发送失败");
  }
  return result.data;
}
export async function fetchSpacePowers(projectId: number): Promise<{
  powers: PowerOption[];
  powerKinds: PowerKindOption[];
}> {
  const result = await request(joinSiteApi("project/canvas_config"), "get", {
    project_id: projectId,
  });
  if (!isSuccessResponse(result)) {
    throw new Error(result.message || result.msg || "加载能力列表失败");
  }
  return normalizePowerCatalog(result.data);
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
  if (!isSuccessResponse(result)) {
    throw new Error(result.message || result.msg || "加载能力参数失败");
  }
  return normalizePowerForm(result.data);
}

export async function runSpaceCanvas(input: {
  projectId: number;
  assetCateId: number;
  startNodeId: string;
  requestId?: string;
  singleNode?: boolean;
  canvas: SpaceCanvasState;
  runInput?: Record<string, unknown>;
}) {
  const result = await request(joinSiteApi("workspace/canvas_execute"), "post", {
    project_id: input.projectId,
    asset_cate_id: input.assetCateId,
    start_node_id: input.startNodeId,
    request_id: input.requestId || "",
    single_node: Boolean(input.singleNode),
    canvas: persistedCanvasState(input.canvas),
    input: input.runInput || {},
  });
  return normalizeRunResponse(result, "画布运行失败");
}

function normalizeRunResponse(result: any, fallbackMessage: string) {
  if (!isSuccessResponse(result)) {
    throw new Error(result?.message || result?.msg || fallbackMessage);
  }
  return (
    result?.data && typeof result.data === "object" ? result.data : {}
  ) as Record<string, any>;
}

export async function fetchSpaceCanvasResults(input: {
  projectId: number;
  assetCateId?: number;
  runId?: number;
  nodeRunId?: number;
  assetId?: number;
  purpose?: "material_result" | "content_save";
}): Promise<{ items: ProjectAsset[]; total: number }> {
  const result = await request(joinSiteApi("project/asset_list"), "get", {
    project_id: input.projectId,
    kind: "",
  });
  if (!isSuccessResponse(result)) {
    throw new Error(result.message || result.msg || "读取画布结果失败");
  }
  const data = result.data || {};
  const items = Array.isArray(data.items)
    ? data.items.map(normalizeProjectAsset)
    : [];
  return {
    items,
    total: Number(data.total || items.length),
  };
}

export async function fetchSpaceCanvasExecutions(projectId: number) {
  const result = await request(joinSiteApi("workspace/canvas_execution_list"), "get", {
    project_id: projectId,
  });
  if (!isSuccessResponse(result)) {
    throw new Error(result.message || result.msg || "读取画布运行记录失败");
  }
  const data = result.data || {};
  return {
    count: Number(data.count || 0),
    items: Array.isArray(data.items) ? data.items : [],
  };
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
  if (!isSuccessResponse(result)) {
    throw new Error(result.message || result.msg || "继续画布运行失败");
  }
  return result.data;
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
  });
  if (!isSuccessResponse(result)) {
    throw new Error(result.message || result.msg || "读取流程状态失败");
  }
  return result.data;
}

export async function submitSpaceApproval(input: {
  projectId: number;
  approvalId: number;
  data: Record<string, unknown>;
  comment?: string;
  decision?: "approved" | "rejected";
}) {
  const result = await request(joinSiteApi("run/approval"), "post", {
    project_id: input.projectId,
    approval_id: input.approvalId,
    decision: input.decision || "approved",
    comment: input.comment || "",
    data: input.data,
  });
  if (!isSuccessResponse(result)) {
    throw new Error(result.message || result.msg || "提交反馈失败");
  }
  return result.data;
}

export async function saveSpaceAssetEditVersion(input: {
  projectId: number;
  assetId: number;
  versionId: number;
  content: unknown;
  requestId?: string;
}): Promise<ProjectAsset> {
  const result = await request(joinSiteApi("project/update_asset_version"), "post", {
    project_id: input.projectId,
    asset_id: input.assetId,
    version_id: input.versionId,
    content: input.content,
    request_id: input.requestId || "",
  });
  if (!isSuccessResponse(result)) {
    throw new Error(result.message || result.msg || "保存资产版本失败");
  }
  const asset = (result.data as any)?.asset;
  if (!asset) {
    throw new Error("资产版本保存结果为空");
  }
  return normalizeProjectAsset(asset);
}

export async function useSpaceAssetVersion(input: {
  projectId: number;
  assetId: number;
  versionId: number;
}): Promise<ProjectAsset> {
  const result = await request(joinSiteApi("project/use_asset_version"), "post", {
    project_id: input.projectId,
    asset_id: input.assetId,
    version_id: input.versionId,
  });
  if (!isSuccessResponse(result)) {
    throw new Error(result.message || result.msg || "切换资产版本失败");
  }
  const asset = (result.data as any)?.asset;
  if (!asset) {
    throw new Error("资产版本切换结果为空");
  }
  return normalizeProjectAsset(asset);
}

export async function fetchSpaceAssetDetail(input: {
  projectId: number;
  assetId: number;
}): Promise<ProjectAsset> {
  const result = await request(joinSiteApi("project/asset_detail"), "get", {
    project_id: input.projectId,
    asset_id: input.assetId,
  });
  if (!isSuccessResponse(result)) {
    throw new Error(result.message || result.msg || "读取资产详情失败");
  }
  const asset = (result.data as any)?.asset;
  if (!asset) {
    throw new Error("资产详情为空");
  }
  return normalizeProjectAsset(asset);
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
  role: "material" | "content",
  input: SaveSpaceCanvasResultInput,
): Promise<ProjectAsset> {
  const result = await request(joinSiteApi("project/save_asset"), "post", {
    ...canvasResultPayload(input),
    role,
  });
  if (!isSuccessResponse(result)) {
    throw new Error(result.message || result.msg || "保存资产失败");
  }
  const asset = (result.data as any)?.asset;
  if (!asset) {
    throw new Error("保存资产结果为空");
  }
  return normalizeProjectAsset(asset);
}

export function saveSpaceCanvasMaterial(
  input: SaveSpaceCanvasResultInput,
): Promise<ProjectAsset> {
  return saveSpaceCanvasResult("material", input);
}

export function saveSpaceCanvasContent(
  input: SaveSpaceCanvasResultInput,
): Promise<ProjectAsset> {
  return saveSpaceCanvasResult("content", input);
}

export async function saveSpaceCanvas(
  projectId: number,
  assetCateId: number,
  canvas: SpaceCanvasState,
): Promise<SpaceCanvasState> {
  const result = await request(joinSiteApi("workspace/canvas"), "post", {
    project_id: projectId,
    asset_cate_id: assetCateId,
    base_revision: canvas.updatedAt || "",
    canvas: persistedCanvasState(canvas),
  });
  if (!isSuccessResponse(result)) {
    throw new Error(result.message || result.msg || "保存画布失败");
  }
  return normalizeCanvasState(
    (result.data as any)?.canvas || canvas,
    assetCateId,
  );
}

export async function initSpaceUpload(input: {
  projectId: number;
  ruleId?: number;
  name: string;
  size: number;
  mime: string;
  hash?: string;
  kind?: string;
}) {
  const result = await request("/front/upload/init", "post", {
    rule_id: input.ruleId || 0,
    name: input.name,
    size: input.size,
    mime: input.mime,
    hash: input.hash || "",
    kind: input.kind || "",
    biz_key: "bot_work",
    biz_name: "作品工作台",
  });
  if (!isSuccessResponse(result)) {
    throw new Error(result.message || result.msg || "初始化上传失败");
  }
  return result.data;
}

export async function uploadSpacePart(input: {
  projectId: number;
  sessionId: number;
  partNumber: number;
  file: Blob;
}) {
  void input.projectId;
  const form = new FormData();
  form.append("file", input.file);
  const result = await request(
    `/front/upload/part?session_id=${input.sessionId}&part_number=${input.partNumber}`,
    "post",
    form,
  );
  if (!isSuccessResponse(result)) {
    throw new Error(result.message || result.msg || "上传分片失败");
  }
  return result.data;
}

export async function completeSpaceUpload(input: {
  projectId: number;
  sessionId: number;
}) {
  void input.projectId;
  const result = await request("/front/upload/complete", "post", {
    session_id: input.sessionId,
  });
  if (!isSuccessResponse(result)) {
    throw new Error(result.message || result.msg || "完成上传失败");
  }
  return result.data;
}

function normalizePowerForm(value: any): PowerForm {
  const data = value && typeof value === "object" ? value : {};
  return {
    ...data,
    sources: Array.isArray(data.sources) ? data.sources : [],
    params: Array.isArray(data.params) ? data.params : [],
    selected_target_id: Number(data.selected_target_id || 0),
    source_rule: Number(data.source_rule || 0),
    primary_param_key: String(data.primary_param_key || ""),
  };
}
