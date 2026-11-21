import { joinSiteApi, request } from "@dever/front-plugin";
import { successfulResponseData } from "../shared/api-response";
import { isPlainRecord as isRecord } from "../shared/structured-json";
import { createSpaceStoryboardRevision, fetchSpaceAssetDetail, fetchSpaceRunStatus, saveSpaceAssetEditVersion } from "./space-api";
import {
  normalizeStoryboardOrder,
  parseStoryboardOutput,
  parseStoryboardShotGeneration,
  reconcileStoryboardContinuity,
  type StoryboardDocument,
  type StoryboardShotGeneration,
} from "./space-storyboard";
import { preserveStoryboardShotReferences } from "./space-storyboard-shot-edit";
import type { ProjectAsset, SpaceCanvasNode } from "./types";

export type StoryboardPromptVersion = { projectId: number; assetId: number; versionId: number };

export async function fetchStoryboardVideoPrompt(
  version: StoryboardPromptVersion,
  shotId: string,
  node?: SpaceCanvasNode,
): Promise<string> {
  const data = successfulResponseData(await request(joinSiteApi("project/preview_storyboard_video_prompt"), "post", {
    project_id: version.projectId,
    asset_id: version.assetId,
    version_id: version.versionId,
    shot_id: shotId,
    generated_prompt: node?.storyboardItem?.generatedPrompt,
    composer_prompt: node?.composerDraft?.prompt,
    prompt_content: node?.composerDraft?.promptContent,
  }), "读取制作提示词失败");
  if (typeof data.prompt !== "string" || !data.prompt) throw new Error("没有返回制作提示词");
  return data.prompt;
}

async function generateSpaceStoryboardShot(input: {
  projectId: number;
  canvasId: number;
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
  const shotIndex = input.shotId
    ? input.storyboard.shots.findIndex((shot) => shot.id === input.shotId)
    : input.storyboard.shots.length;
  if (shotIndex < 0) {
    throw new Error("目标镜头不存在");
  }
  const readGeneration = async (runId = 0) => successfulResponseData(await request(
    joinSiteApi("project/generate_storyboard_shot"),
    "post",
    {
      project_id: input.projectId,
      run_id: runId,
      asset_id: input.assetId,
      version_id: input.versionId,
      flow_id: input.flowId,
      canvas_id: input.canvasId,
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
  ), "生成镜头失败");
  let data = await readGeneration();
  if (data.status === "running" || data.status === "pending") {
    const runId = Number(data.run_id);
    const requestId = String(data.request_id || "");
    if (!runId || !requestId) throw new Error("镜头生成任务没有返回运行编号");
    for (;;) {
      const status = await fetchSpaceRunStatus({ projectId: input.projectId, runId, requestId });
      const run = isRecord(status) && isRecord(status.run) ? status.run : null;
      if (!run) throw new Error("找不到镜头生成任务");
      if (run.status !== "running" && run.status !== "pending") break;
      await new Promise<void>((resolve) => window.setTimeout(resolve, 2500));
    }
    data = await readGeneration(runId);
  }
  const generation = parseStoryboardShotGeneration(data, shotIndex);
  if (!generation || (input.shotId
    ? generation.shot.id !== input.shotId
    : input.storyboard.shots.some((shot) => shot.id === generation.shot.id))) {
    throw new Error("生成镜头结果格式无效");
  }
  return generation;
}

export async function editSpaceStoryboardShot(input: {
  projectId: number;
  canvasId: number;
  node: SpaceCanvasNode;
  asset: ProjectAsset;
  storyboard: StoryboardDocument;
  shotId: string;
  instruction: string;
}): Promise<ProjectAsset> {
  const { projectId, canvasId, node, asset, storyboard, shotId, instruction } = input;
  const version = asset.version;
  if (!version?.id || version.id !== asset.version_id) {
    throw new Error("当前分镜尚未保存，不能生成镜头");
  }
  const generation = await generateSpaceStoryboardShot({
    projectId,
    canvasId,
    assetId: asset.id,
    versionId: version.id,
    flowId: Number(node.flow?.id || asset.flow_id || 0),
    assetCateId: Number(node.assetCateId || asset.asset_cate_id || 0),
    requestId: "storyboard-shot-" + crypto.randomUUID(),
    nodeKey: node.id,
    nodeName: node.title,
    powerId: Number(node.power?.id || 0),
    powerKey: String(node.power?.key || "").trim(),
    sourceTargetId: Number(node.composerDraft?.selectedTargetId || 0),
    params: node.composerDraft?.paramValues || {},
    storyboard,
    shotId,
    instruction,
  });
  const original = storyboard.shots.find((shot) => shot.id === shotId);
  const shot = original ? preserveStoryboardShotReferences(original, generation.shot) : generation.shot;
  const shots = original
    ? storyboard.shots.map((entry) => entry.id === shotId ? shot : entry)
    : [...storyboard.shots, shot];
  const edited = { ...storyboard, materials: generation.materials, shots };
  return saveSpaceAssetEditVersion({
    projectId,
    assetId: asset.id,
    versionId: version.id,
    expectedUpdatedAt: version.updated_at || version.created_at || "",
    content: normalizeStoryboardOrder(reconcileStoryboardContinuity(storyboard, edited)),
  });
}

export async function editCanvasStoryboardScript(input: {
  projectId: number;
  canvasId: number;
  node: SpaceCanvasNode;
  edit: { mode: "revision" }
    | { mode: "shot"; shotId: string; instruction: string }
    | { mode: "save"; previous: StoryboardDocument; storyboard: StoryboardDocument };
}): Promise<ProjectAsset> {
  const { node, projectId, canvasId, edit } = input;
  const assetId = node.resultRef?.asset_id || node.asset?.id;
  const versionId = node.resultRef?.version_id || node.asset?.version_id;
  if (!assetId || !versionId) throw new Error("当前分镜尚未保存");
  const { asset } = await fetchSpaceAssetDetail({ projectId, assetId, currentOnly: true });
  if (asset.version_id !== versionId) throw new Error("分镜版本已更新，请刷新画布后再试");
  if (edit.mode === "revision") {
    return createSpaceStoryboardRevision({
      projectId, assetId, versionId, nodeKey: node.id,
      expectedCurrentVersionId: asset.version_id,
      requestId: "storyboard-revision-" + crypto.randomUUID(),
    });
  }
  const storyboard = parseStoryboardOutput(asset.version?.content);
  if (!storyboard) throw new Error("未找到已保存的分镜脚本");
  if (edit.mode === "save") {
    if (JSON.stringify(storyboard) !== JSON.stringify(edit.previous)) {
      throw new Error("分镜已有新改动，请刷新后重新微调");
    }
    return saveSpaceAssetEditVersion({
      projectId,
      assetId,
      versionId,
      expectedUpdatedAt: asset.version?.updated_at || asset.version?.created_at || "",
      content: normalizeStoryboardOrder(reconcileStoryboardContinuity(storyboard, edit.storyboard)),
    });
  }
  return editSpaceStoryboardShot({ projectId, canvasId, node, asset, storyboard, shotId: edit.shotId, instruction: edit.instruction });
}
