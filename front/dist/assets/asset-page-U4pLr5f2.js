import { j as P } from "./react-CDpwMNlY.js";
import { u as f } from "./file-kind-DFeonxO2.js";
import { l as M, m as v } from "./node-detail-content-DEcv8fc7.js";
import { a as S, n as h } from "./asset-api-nw012__Q.js";
import { u as w } from "./space-upload-CiyhICGY.js";
import { b as _, A as I } from "./asset-reference-provider-d_hsIG-H.js";
const K = /* @__PURE__ */ new Set(["image", "audio", "video", "file"]);
function q({
  teamID: e,
  open: n,
  param: t,
  files: o,
  resourceKind: r,
  multiple: a,
  maxSelection: l,
  onOpenChange: A,
  onConfirm: d
}) {
  const c = f(
    () => j(r, t.asset_kinds),
    [t.asset_kinds, r]
  ), p = f(() => B(o), [o]), g = f(
    () => o.filter((i) => !x(i.id)),
    [o]
  ), u = a ? Math.max(l - g.length, 0) : 1, F = Array.from(p.keys()).slice(
    0,
    u
  );
  return /* @__PURE__ */ P(
    _,
    {
      open: n,
      teamID: e,
      title: `${t.name}素材库`,
      description: `选择当前团队可用的${N(c)}素材`,
      allowedKinds: c,
      initialSelectedAssetKeys: F,
      multiple: a,
      maxSelection: Math.max(u, 1),
      confirmSelection: !0,
      uploadAccept: M(c),
      onUpload: (i, m) => z({
        teamID: e,
        ruleID: Number(t.upload_rule_id || 0),
        kind: r,
        files: i,
        onProgress: m?.onProgress
      }),
      validateAsset: (i) => u <= 0 ? `当前参数最多只能选择 ${l} 个文件。` : c.includes(i.kind) ? v(i.version?.content, i.kind) ? "" : "该素材没有可用文件，无法用于此参数。" : "该素材类型不适用于当前参数。",
      onClose: () => A(!1),
      onConfirm: (i, m) => {
        const $ = new Map(
          i.map((s) => [S(s), s])
        ), k = m.map((s) => {
          const y = $.get(s);
          return y ? L(y) : p.get(s);
        }).filter((s) => !!s), D = a ? [...g, ...k].slice(0, l) : k.slice(0, 1);
        d(D);
      }
    }
  );
}
function j(e, n) {
  const t = b(e);
  if (t) return [t];
  const o = Array.from(
    new Set(
      (n || []).map(b).filter((r) => !!r)
    )
  );
  return o.length > 0 ? o : ["image", "audio", "video", "file"];
}
function b(e) {
  const n = String(e || "");
  return K.has(n) ? n : void 0;
}
function B(e) {
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
function L(e) {
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
function N(e) {
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
async function z(e) {
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
function U({
  teamID: e,
  onContinue: n,
  canContinue: t,
  catalogOptions: o
}) {
  async function r(a, l) {
    return (await w({
      teamID: e,
      files: a,
      onProgress: l?.onProgress
    })).map(({ asset: d }) => h(d)).filter((d) => d.id > 0);
  }
  return /* @__PURE__ */ P(
    I,
    {
      teamID: e,
      onLocalUpload: r,
      onContinue: n,
      canContinue: t,
      catalogOptions: o
    }
  );
}
const G = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  WorkbenchAssetPage: U
}, Symbol.toStringTag, { value: "Module" }));
export {
  q as A,
  G as a
};
