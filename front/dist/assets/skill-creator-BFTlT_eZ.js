import { j as h } from "./createLucideIcon-CEtb6KSk.js";
import { u as S, a as C, b as E, c as T } from "./runtime-entry-CIrzyMsA.js";
import { u as D } from "./react-DlzYln-Z.js";
import { m as $ } from "./store-EYzASISC.js";
import { ShowAgent as B } from "./agent-oPmi7GuN.js";
import { a as F, i as g } from "./skill-draft-patch-butj1uQW.js";
const k = $.getStoreValueByPath, M = "data.actionTarget.draftAgent";
function q({ item: t, store: e }) {
  const u = String(t.meta?.draftPath || M), x = String(t.meta?.openPath || ""), n = D(
    e,
    () => x ? !!k(e, x) : !0
  ), o = D(e, () => {
    const r = k(e, u);
    if (!g(r))
      return 0;
    const s = Number(r.id || 0);
    return Number.isFinite(s) && s > 0 ? s : 0;
  }), l = D(e, () => {
    const r = k(e, u);
    return g(r) ? r : {};
  }), i = I(
    l.source_skill_id || l.sourceSkillId || 0
  ), d = I(
    l.pack_id || l.packId || 0
  ), m = String(
    t.meta?.ensureDraftApi || "/bot/admin/skill_draft/from_skill"
  ), [b, P] = S(""), [v, p] = S(!1), a = C(""), f = String(
    t.meta?.newDraftSessionContext || ""
  ).trim(), [y, w] = S(
    () => f || N()
  ), A = C(n);
  E(() => {
    if (f) {
      w(f);
      return;
    }
    !n && A.current && w(N()), A.current = n;
  }, [f, n]), E(() => {
    if (!n || o > 0 || i <= 0 || !m)
      return;
    const r = `${i}:${d || 0}`;
    if (a.current === r)
      return;
    a.current = r, p(!0), P("");
    let s = !1;
    return F(m, {
      skill_id: i,
      pack_id: d
    }).then((c) => {
      if (s || a.current !== r)
        return;
      const _ = g(c.draft) ? c.draft : null;
      _ && e.getState().setValueByPath(u, _);
    }).catch((c) => {
      s || a.current !== r || (a.current = "", P(
        c instanceof Error ? c.message : "创建未发布版本失败。"
      ));
    }).finally(() => {
      !s && a.current === r && p(!1);
    }), () => {
      s = !0, a.current === r && (a.current = "", p(!1));
    };
  }, [
    o,
    u,
    m,
    n,
    d,
    i,
    e
  ]);
  const R = T(
    () => ({
      ...t,
      meta: {
        ...t.meta || {},
        sessionEnabled: !0,
        historyEnabled: !1,
        newSessionEnabled: !1,
        skillDraftPatchAutoApply: !1,
        skillDraftPatchCloseOnSave: t.meta?.skillDraftPatchCloseOnSave !== !1,
        sessionContext: o > 0 ? `skill_draft:${o}` : y,
        placeholder: t.meta?.placeholder || "描述要创建或修改的 skill。需要脚本、配置项、MCP、依赖或引用代码时直接说明。",
        emptyText: t.meta?.emptyText || "描述你要创建的技能。AI 会先生成可保存内容，确认后点击“保存”。"
      }
    }),
    [o, t, y]
  );
  return n && v && o <= 0 && i > 0 ? /* @__PURE__ */ h("div", { className: "flex min-h-48 items-center justify-center text-sm text-muted-foreground", children: "正在准备未发布版本..." }) : n && b ? /* @__PURE__ */ h("div", { className: "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: b }) : /* @__PURE__ */ h(B, { item: R, store: e });
}
function I(t) {
  const e = Number(t || 0);
  return Number.isFinite(e) && e > 0 ? e : 0;
}
function N() {
  return `skill_draft:new:${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
}
export {
  q as ShowSkillCreator
};
