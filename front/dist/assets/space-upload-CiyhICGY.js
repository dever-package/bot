import { l as g, m as v } from "./site-config-cvPYHSmK.js";
import { c as D } from "./react-CDpwMNlY.js";
await window.DeverFront?.ensureCompat?.(["@/lib/request", "@/lib/upload"]);
const a = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!a || Object.keys(a).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const I = a.joinSiteApi, b = a.request, c = window.DeverFront?.sdk?.getCompatModule("@/lib/upload");
if (!c || Object.keys(c).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/upload");
const _ = "bot_work", x = "神创工作台", h = /* @__PURE__ */ new Set([
  "txt",
  "md",
  "markdown",
  "mdown",
  "mkd"
]), { uploadFileByRule: m } = c;
async function S(e) {
  if (!m)
    throw new Error("当前页面缺少上传能力");
  const t = [], r = D(
    e.files,
    e.onProgress
  );
  for (const [s, o] of e.files.entries()) {
    r.start(s);
    const n = F(e.kind) || y(o), i = Number(e.ruleID || 0) || await g(n), l = n === "text" ? await o.text() : void 0, d = await m(i, o, {
      kind: n,
      bizKey: _,
      bizName: x,
      reportError: !1,
      onProgress: (w, p) => r.report(s, w, p)
    });
    r.saving(s);
    const f = Number(d.id || 0), [u] = await k({
      teamID: e.teamID,
      projectID: e.projectID,
      canvasID: e.canvasID,
      files: [d],
      textContents: l === void 0 ? void 0 : /* @__PURE__ */ new Map([[f, l]])
    });
    if (!u)
      throw new Error(`${o.name} 保存到资产库失败`);
    t.push({ sourceFile: o, uploadedFile: d, asset: u }), r.complete(s);
  }
  return t;
}
async function k(e) {
  const t = [], r = /* @__PURE__ */ new Set();
  for (const s of e.files) {
    const o = Number(s.id || 0);
    if (!Number.isFinite(o) || o <= 0)
      throw new Error("上传文件标识无效");
    if (r.has(o))
      continue;
    const n = await b(
      I("workbench/upload_save_asset"),
      "post",
      {
        team_id: e.teamID,
        project_id: e.projectID || void 0,
        canvas_id: e.canvasID || void 0,
        file_id: o,
        text_content: e.textContents?.get(o)
      },
      { reportError: !1 }
    );
    if (!v(n))
      throw new Error(
        String(n?.message || n?.msg || "保存上传资产失败")
      );
    const i = n?.data?.asset;
    if (!i || typeof i != "object" || Array.isArray(i))
      throw new Error("保存上传资产结果为空");
    r.add(o), t.push(i);
  }
  return t;
}
function y(e) {
  const t = String(e.type || "").toLowerCase();
  return t.startsWith("image/") ? "image" : t.startsWith("video/") ? "video" : t.startsWith("audio/") ? "audio" : ["text/plain", "text/markdown", "text/x-markdown"].includes(t) || h.has(j(e.name)) ? "text" : "file";
}
function F(e) {
  const t = String(e || "").toLowerCase();
  return ["image", "video", "audio", "text", "file"].includes(t) ? t : "";
}
function j(e) {
  const t = String(e || "").trim().toLowerCase(), r = t.lastIndexOf(".");
  return r >= 0 ? t.slice(r + 1) : "";
}
async function E(e) {
  return (await S({
    teamID: e.teamID,
    projectID: e.projectID,
    canvasID: e.canvasID,
    files: e.files,
    ruleID: e.ruleID,
    onProgress: e.onProgress
  })).map(
    ({ sourceFile: r, uploadedFile: s, asset: o }) => A(s, r, o)
  );
}
function C(e) {
  const t = String(e.type || "").toLowerCase();
  return t.startsWith("image/") ? "image" : t.startsWith("video/") ? "video" : t.startsWith("audio/") ? "audio" : "file";
}
function A(e, t, r) {
  const s = String(
    e?.url || e?.open_url || e?.download || ""
  ), o = String(e?.kind || C(t));
  return {
    name: String(e?.name || t.name),
    alias: String(e?.name || t.name),
    kind: o,
    source: "upload",
    type: String(e?.mime || t.type || o),
    url: s,
    text: String(e?.name || t.name),
    output: e,
    asset: r
  };
}
const O = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  uploadSpaceFiles: E
}, Symbol.toStringTag, { value: "Module" }));
export {
  x as B,
  _ as a,
  E as b,
  O as c,
  k as s,
  S as u
};
