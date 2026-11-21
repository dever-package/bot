import { j as b } from "./preloadable-CnUP9jgB.js";
import { u as p } from "./file-kind-Cq3pESGF.js";
import { q as v } from "./asset-preview-DonyTaaN.js";
import { a as S } from "./asset-audio-preview-CsYcyVm8.js";
import { a as _, n as h } from "./text-content-save-actions-0xSf1irm.js";
import { u as w } from "./space-upload-B-1PIF2y.js";
import { AssetPickerDialog as I } from "./protected-5-nodes-body-work-asset-asset-picker-dialog-tsx-CbZHWi7r.js";
import { A as K } from "./asset-browser-Bk24-uq7.js";
const j = /* @__PURE__ */ new Set(["image", "audio", "video", "file"]);
function J({
  teamID: e,
  notificationMode: t,
  open: n,
  param: o,
  files: i,
  resourceKind: a,
  multiple: l,
  maxSelection: c,
  onOpenChange: d,
  onConfirm: F
}) {
  const u = p(
    () => B(a, o.asset_kinds),
    [o.asset_kinds, a]
  ), A = p(() => L(i), [i]), g = p(
    () => i.filter((r) => !x(r.id)),
    [i]
  ), m = l ? Math.max(c - g.length, 0) : 1, $ = Array.from(A.keys()).slice(
    0,
    m
  );
  return /* @__PURE__ */ b(
    I,
    {
      open: n,
      teamID: e,
      notificationMode: t,
      title: `${o.name}素材库`,
      description: `选择当前团队可用的${z(u)}素材`,
      allowedKinds: u,
      initialSelectedAssetKeys: $,
      multiple: l,
      maxSelection: Math.max(m, 1),
      confirmSelection: !0,
      uploadAccept: S(u),
      onUpload: (r, f) => U({
        teamID: e,
        ruleID: Number(o.upload_rule_id || 0),
        kind: a,
        files: r,
        onProgress: f?.onProgress
      }),
      validateAsset: (r) => m <= 0 ? `当前参数最多只能选择 ${c} 个文件。` : u.includes(r.kind) ? v(r.version?.content, r.kind) ? "" : "该素材没有可用文件，无法用于此参数。" : "该素材类型不适用于当前参数。",
      onClose: () => d(!1),
      onConfirm: (r, f) => {
        const D = new Map(
          r.map((s) => [_(s), s])
        ), k = f.map((s) => {
          const y = D.get(s);
          return y ? N(y) : A.get(s);
        }).filter((s) => !!s), M = l ? [...g, ...k].slice(0, c) : k.slice(0, 1);
        F(M);
      }
    }
  );
}
function B(e, t) {
  const n = P(e);
  if (n) return [n];
  const o = Array.from(
    new Set(
      (t || []).map(P).filter((i) => !!i)
    )
  );
  return o.length > 0 ? o : ["image", "audio", "video", "file"];
}
function P(e) {
  const t = String(e || "");
  return j.has(t) ? t : void 0;
}
function L(e) {
  const t = /* @__PURE__ */ new Map();
  return e.forEach((n) => {
    const o = x(n.id);
    o && t.set(o.key, n);
  }), t;
}
function x(e) {
  const t = String(e || ""), n = /^asset:(\d+):(\d+)$/.exec(t);
  if (n)
    return { key: `asset:${Number(n[1])}` };
  const o = /^material:(\d+)$/.exec(t);
  return o ? { key: `material:${Number(o[1])}` } : null;
}
function N(e) {
  const t = v(e.version?.content, e.kind);
  if (t)
    return {
      id: e.libraryType === "material" ? `material:${e.id}` : `asset:${e.id}:${e.versionID}`,
      name: e.name,
      kind: e.kind,
      url: t,
      thumbnail: e.kind === "image" ? t : void 0
    };
}
function z(e) {
  const t = {
    collection: "集合",
    text: "文本",
    image: "图片",
    audio: "音频",
    video: "视频",
    richtext: "富文本",
    file: "文件"
  };
  return e.map((n) => t[n]).join("、");
}
async function U(e) {
  if (!Number.isFinite(e.ruleID) || e.ruleID <= 0)
    throw new Error("当前参数未配置上传规则");
  return (await w({
    teamID: e.teamID,
    files: e.files,
    ruleID: e.ruleID,
    kind: e.kind,
    onProgress: e.onProgress
  })).map(({ asset: n }) => h(n)).filter((n) => n.id > 0);
}
function C({
  teamID: e,
  onContinue: t,
  canContinue: n,
  catalogOptions: o
}) {
  async function i(a, l) {
    return (await w({
      teamID: e,
      files: a,
      onProgress: l?.onProgress
    })).map(({ asset: d }) => h(d)).filter((d) => d.id > 0);
  }
  return /* @__PURE__ */ b(
    K,
    {
      teamID: e,
      onLocalUpload: i,
      onContinue: t,
      canContinue: n,
      catalogOptions: o
    }
  );
}
const Q = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkbenchAssetPage: C
}, Symbol.toStringTag, { value: "Module" }));
export {
  J as A,
  Q as a
};
