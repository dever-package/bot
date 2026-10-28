import { j as P } from "./react-5Z-wsVEn.js";
import { u as p } from "./file-kind-D6bMOzYN.js";
import { b as S, n as v } from "./asset-preview-BZxHU4Mm.js";
import { a as _, n as h } from "./text-content-save-actions-C7rwLAWt.js";
import { u as w } from "./space-upload-1ncl2HCu.js";
import { AssetPickerDialog as I } from "./protected-5-nodes-body-work-asset-asset-picker-dialog-tsx-Cu2icjCn.js";
import { A as K } from "./asset-browser-BWrwKwCY.js";
const j = /* @__PURE__ */ new Set(["image", "audio", "video", "file"]);
function H({
  teamID: e,
  notificationMode: n,
  open: t,
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
  return /* @__PURE__ */ P(
    I,
    {
      open: t,
      teamID: e,
      notificationMode: n,
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
function B(e, n) {
  const t = b(e);
  if (t) return [t];
  const o = Array.from(
    new Set(
      (n || []).map(b).filter((i) => !!i)
    )
  );
  return o.length > 0 ? o : ["image", "audio", "video", "file"];
}
function b(e) {
  const n = String(e || "");
  return j.has(n) ? n : void 0;
}
function L(e) {
  const n = /* @__PURE__ */ new Map();
  return e.forEach((t) => {
    const o = x(t.id);
    o && n.set(o.key, t);
  }), n;
}
function x(e) {
  const n = String(e || ""), t = /^asset:(\d+):(\d+)$/.exec(n);
  if (t)
    return { key: `asset:${Number(t[1])}` };
  const o = /^material:(\d+)$/.exec(n);
  return o ? { key: `material:${Number(o[1])}` } : null;
}
function N(e) {
  const n = v(e.version?.content, e.kind);
  if (n)
    return {
      id: e.libraryType === "material" ? `material:${e.id}` : `asset:${e.id}:${e.versionID}`,
      name: e.name,
      kind: e.kind,
      url: n,
      thumbnail: e.kind === "image" ? n : void 0
    };
}
function z(e) {
  const n = {
    collection: "集合",
    text: "文本",
    image: "图片",
    audio: "音频",
    video: "视频",
    richtext: "富文本",
    file: "文件"
  };
  return e.map((t) => n[t]).join("、");
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
  })).map(({ asset: t }) => h(t)).filter((t) => t.id > 0);
}
function C({
  teamID: e,
  onContinue: n,
  canContinue: t,
  catalogOptions: o
}) {
  async function i(a, l) {
    return (await w({
      teamID: e,
      files: a,
      onProgress: l?.onProgress
    })).map(({ asset: d }) => h(d)).filter((d) => d.id > 0);
  }
  return /* @__PURE__ */ P(
    K,
    {
      teamID: e,
      onLocalUpload: i,
      onContinue: n,
      canContinue: t,
      catalogOptions: o
    }
  );
}
const J = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkbenchAssetPage: C
}, Symbol.toStringTag, { value: "Module" }));
export {
  H as A,
  J as a
};
