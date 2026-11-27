import { s as y } from "./asset-upload-progress-DID-32U3.js";
import { s as E, p as j, n as w, r as I, i as m, b as R } from "./asset-audio-preview-DlcU6JQ0.js";
import { f as q, c as O, s as h, a as C } from "./writing-reference-DgnCfuWu.js";
const D = [
  "description",
  "spatial_layout",
  "start_framing",
  "end_framing",
  "camera_instruction",
  "video_prompt"
];
function F(e, t, n, r) {
  const o = { ...e.reference_contents || {} };
  return delete o[t], {
    [t]: n,
    reference_contents: o
  };
}
function K(e, t, n) {
  const r = n.trim(), o = { ...e.prompt_overrides };
  return r && r !== E(e, t) ? o[t] = r : delete o[t], { ...e, prompt_overrides: Object.keys(o).length ? o : void 0 };
}
function V(e) {
  return {
    ...e,
    material_ids: [...e.material_ids],
    continuity_state: { ...e.continuity_state },
    speech: e.speech.map((t) => ({ ...t })),
    captions: e.captions.map((t) => ({ ...t })),
    reference_contents: { ...e.reference_contents || {} }
  };
}
function N(e, t) {
  const n = { ...t.reference_contents };
  for (const r of D)
    e[r] === t[r] && e.reference_contents?.[r] && (n[r] = e.reference_contents[r]);
  return { ...t, prompt_overrides: e.prompt_overrides, reference_contents: n };
}
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const _ = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!_ || Object.keys(_).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const l = _.joinSiteApi, b = _.request;
async function A(e, t, n) {
  const r = y(await b(l("project/preview_storyboard_video_prompt"), "post", {
    project_id: e.projectId,
    asset_id: e.assetId,
    version_id: e.versionId,
    shot_id: t,
    storyboard_prompt_override: n?.composerDraft?.storyboardPromptOverride
  }), "读取制作提示词失败");
  if (typeof r.prompt != "string" || !r.prompt) throw new Error("没有返回制作提示词");
  return r.prompt;
}
async function P(e) {
  const t = e.shotId ? e.storyboard.shots.findIndex((s) => s.id === e.shotId) : e.storyboard.shots.length;
  if (t < 0)
    throw new Error("目标镜头不存在");
  const n = async (s = 0) => y(await b(
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
  let r = await n();
  if (r.status === "running" || r.status === "pending") {
    const s = Number(r.run_id), i = String(r.request_id || "");
    if (!s || !i) throw new Error("镜头生成任务没有返回运行编号");
    for (; ; ) {
      const d = await C({ projectId: e.projectId, runId: s, requestId: i }), a = m(d) && m(d.run) ? d.run : null;
      if (!a) throw new Error("找不到镜头生成任务");
      if (a.status !== "running" && a.status !== "pending") break;
      await new Promise((c) => window.setTimeout(c, 2500));
    }
    r = await n(s);
  }
  const o = R(r, t);
  if (!o || (e.shotId ? o.shot.id !== e.shotId : e.storyboard.shots.some((s) => s.id === o.shot.id)))
    throw new Error("生成镜头结果格式无效");
  return o;
}
async function v(e) {
  const { projectId: t, canvasId: n, node: r, asset: o, storyboard: s, shotId: i, instruction: d } = e, a = o.version;
  if (!a?.id || a.id !== o.version_id)
    throw new Error("当前分镜尚未保存，不能生成镜头");
  const c = await P({
    projectId: t,
    canvasId: n,
    assetId: o.id,
    versionId: a.id,
    flowId: Number(r.flow?.id || o.flow_id || 0),
    assetCateId: Number(r.assetCateId || o.asset_cate_id || 0),
    requestId: "storyboard-shot-" + crypto.randomUUID(),
    nodeKey: r.id,
    nodeName: r.title,
    powerId: Number(r.power?.id || 0),
    powerKey: String(r.power?.key || "").trim(),
    sourceTargetId: Number(r.composerDraft?.selectedTargetId || 0),
    params: r.composerDraft?.paramValues || {},
    storyboard: s,
    shotId: i,
    instruction: d
  }), f = s.shots.find((p) => p.id === i), u = f ? N(f, c.shot) : c.shot, S = f ? s.shots.map((p) => p.id === i ? u : p) : [...s.shots, u], g = { ...s, materials: c.materials, shots: S };
  return h({
    projectId: t,
    assetId: o.id,
    versionId: a.id,
    expectedUpdatedAt: a.updated_at || a.created_at || "",
    content: w(I(s, g))
  });
}
async function k(e) {
  const { node: t, projectId: n, canvasId: r, edit: o } = e, s = t.resultRef?.asset_id || t.asset?.id, i = t.resultRef?.version_id || t.asset?.version_id;
  if (!s || !i) throw new Error("当前分镜尚未保存");
  const { asset: d } = await q({ projectId: n, assetId: s, currentOnly: !0 });
  if (d.version_id !== i) throw new Error("分镜版本已更新，请刷新画布后再试");
  if (o.mode === "revision")
    return O({
      projectId: n,
      assetId: s,
      versionId: i,
      nodeKey: t.id,
      expectedCurrentVersionId: d.version_id,
      requestId: "storyboard-revision-" + crypto.randomUUID()
    });
  const a = j(d.version?.content);
  if (!a) throw new Error("未找到已保存的分镜脚本");
  if (o.mode === "save") {
    if (JSON.stringify(a) !== JSON.stringify(o.previous))
      throw new Error("分镜已有新改动，请刷新后重新微调");
    return h({
      projectId: n,
      assetId: s,
      versionId: i,
      expectedUpdatedAt: d.version?.updated_at || d.version?.created_at || "",
      content: w(I(a, o.storyboard))
    });
  }
  return v({ projectId: n, canvasId: r, node: t, asset: d, storyboard: a, shotId: o.shotId, instruction: o.instruction });
}
const M = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  editCanvasStoryboardScript: k,
  editSpaceStoryboardShot: v,
  fetchStoryboardVideoPrompt: A
}, Symbol.toStringTag, { value: "Module" }));
export {
  D as S,
  M as a,
  V as c,
  A as f,
  F as s,
  K as w
};
