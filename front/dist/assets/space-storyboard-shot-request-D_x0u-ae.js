import { s as w } from "./asset-upload-progress-BKzeQB8G.js";
import { e as u } from "./asset-audio-preview-CWf3Wq_n.js";
import { f as E, c as j, s as y, a as R } from "./writing-reference-Co5JVp43.js";
import { s as q, p as C, n as I, r as h, b as D } from "./asset-preview-CF7Cok8_.js";
const O = [
  "description",
  "spatial_layout",
  "start_framing",
  "end_framing",
  "camera_instruction",
  "video_prompt"
];
function K(e, r, n, t) {
  const o = { ...e.reference_contents || {} };
  return delete o[r], {
    [r]: n,
    reference_contents: o
  };
}
function V(e, r, n) {
  const t = n.trim(), o = { ...e.prompt_overrides };
  return t && t !== q(e, r) ? o[r] = t : delete o[r], { ...e, prompt_overrides: Object.keys(o).length ? o : void 0 };
}
function M(e) {
  return {
    ...e,
    material_ids: [...e.material_ids],
    continuity_state: { ...e.continuity_state },
    speech: e.speech.map((r) => ({ ...r })),
    captions: e.captions.map((r) => ({ ...r })),
    reference_contents: { ...e.reference_contents || {} }
  };
}
function N(e, r) {
  const n = { ...r.reference_contents };
  for (const t of O)
    e[t] === r[t] && e.reference_contents?.[t] && (n[t] = e.reference_contents[t]);
  return { ...r, prompt_overrides: e.prompt_overrides, reference_contents: n };
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const _ = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!_ || Object.keys(_).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const l = _.joinSiteApi, b = _.request;
async function A(e, r, n) {
  const t = w(await b(l("project/preview_storyboard_video_prompt"), "post", {
    project_id: e.projectId,
    asset_id: e.assetId,
    version_id: e.versionId,
    shot_id: r,
    generated_prompt: n?.storyboardItem?.generatedPrompt,
    composer_prompt: n?.composerDraft?.prompt,
    prompt_content: n?.composerDraft?.promptContent
  }), "读取制作提示词失败");
  if (typeof t.prompt != "string" || !t.prompt) throw new Error("没有返回制作提示词");
  return t.prompt;
}
async function P(e) {
  const r = e.shotId ? e.storyboard.shots.findIndex((s) => s.id === e.shotId) : e.storyboard.shots.length;
  if (r < 0)
    throw new Error("目标镜头不存在");
  const n = async (s = 0) => w(await b(
    l("project/generate_storyboard_shot"),
    "post",
    {
      project_id: e.projectId,
      run_id: s,
      asset_id: e.assetId,
      version_id: e.versionId,
      flow_id: e.flowId,
      canvas_id: e.canvasId,
      asset_cate_id: e.assetCateId,
      request_id: e.requestId,
      node_key: e.nodeKey,
      node_name: e.nodeName,
      power_id: e.powerId,
      power_key: e.powerKey,
      source_target_id: e.sourceTargetId,
      params: e.params,
      storyboard: e.storyboard,
      shot_id: e.shotId,
      instruction: e.instruction
    }
  ), "生成镜头失败");
  let t = await n();
  if (t.status === "running" || t.status === "pending") {
    const s = Number(t.run_id), i = String(t.request_id || "");
    if (!s || !i) throw new Error("镜头生成任务没有返回运行编号");
    for (; ; ) {
      const d = await R({ projectId: e.projectId, runId: s, requestId: i }), a = u(d) && u(d.run) ? d.run : null;
      if (!a) throw new Error("找不到镜头生成任务");
      if (a.status !== "running" && a.status !== "pending") break;
      await new Promise((c) => window.setTimeout(c, 2500));
    }
    t = await n(s);
  }
  const o = D(t, r);
  if (!o || (e.shotId ? o.shot.id !== e.shotId : e.storyboard.shots.some((s) => s.id === o.shot.id)))
    throw new Error("生成镜头结果格式无效");
  return o;
}
async function v(e) {
  const { projectId: r, canvasId: n, node: t, asset: o, storyboard: s, shotId: i, instruction: d } = e, a = o.version;
  if (!a?.id || a.id !== o.version_id)
    throw new Error("当前分镜尚未保存，不能生成镜头");
  const c = await P({
    projectId: r,
    canvasId: n,
    assetId: o.id,
    versionId: a.id,
    flowId: Number(t.flow?.id || o.flow_id || 0),
    assetCateId: Number(t.assetCateId || o.asset_cate_id || 0),
    requestId: "storyboard-shot-" + crypto.randomUUID(),
    nodeKey: t.id,
    nodeName: t.title,
    powerId: Number(t.power?.id || 0),
    powerKey: String(t.power?.key || "").trim(),
    sourceTargetId: Number(t.composerDraft?.selectedTargetId || 0),
    params: t.composerDraft?.paramValues || {},
    storyboard: s,
    shotId: i,
    instruction: d
  }), m = s.shots.find((p) => p.id === i), f = m ? N(m, c.shot) : c.shot, S = m ? s.shots.map((p) => p.id === i ? f : p) : [...s.shots, f], g = { ...s, materials: c.materials, shots: S };
  return y({
    projectId: r,
    assetId: o.id,
    versionId: a.id,
    expectedUpdatedAt: a.updated_at || a.created_at || "",
    content: I(h(s, g))
  });
}
async function k(e) {
  const { node: r, projectId: n, canvasId: t, edit: o } = e, s = r.resultRef?.asset_id || r.asset?.id, i = r.resultRef?.version_id || r.asset?.version_id;
  if (!s || !i) throw new Error("当前分镜尚未保存");
  const { asset: d } = await E({ projectId: n, assetId: s, currentOnly: !0 });
  if (d.version_id !== i) throw new Error("分镜版本已更新，请刷新画布后再试");
  if (o.mode === "revision")
    return j({
      projectId: n,
      assetId: s,
      versionId: i,
      nodeKey: r.id,
      expectedCurrentVersionId: d.version_id,
      requestId: "storyboard-revision-" + crypto.randomUUID()
    });
  const a = C(d.version?.content);
  if (!a) throw new Error("未找到已保存的分镜脚本");
  if (o.mode === "save") {
    if (JSON.stringify(a) !== JSON.stringify(o.previous))
      throw new Error("分镜已有新改动，请刷新后重新微调");
    return y({
      projectId: n,
      assetId: s,
      versionId: i,
      expectedUpdatedAt: d.version?.updated_at || d.version?.created_at || "",
      content: I(h(a, o.storyboard))
    });
  }
  return v({ projectId: n, canvasId: t, node: r, asset: d, storyboard: a, shotId: o.shotId, instruction: o.instruction });
}
const z = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  editCanvasStoryboardScript: k,
  editSpaceStoryboardShot: v,
  fetchStoryboardVideoPrompt: A
}, Symbol.toStringTag, { value: "Module" }));
export {
  O as S,
  z as a,
  M as c,
  A as f,
  K as s,
  V as w
};
