import { j as c, a as p } from "./createLucideIcon-Gw0gLVQ5.js";
import { g as T, c as k, u as y, b } from "./runtime-entry-CkPHMDB1.js";
import { Z as C } from "./zap-rj1Ce1G-.js";
import { W as I, A as W, S as x } from "./asset-continuation-BJoQOC-x.js";
import { l as $, a as z, S as H } from "./stream-request-B_lm303h.js";
import { w as f, a as D, b as j } from "./home-shell-BrUTJHpe.js";
import { C as R } from "./check-_lGX5Mgn.js";
import { C as q } from "./chevron-down-DXFjwlDo.js";
import { F as E } from "./music-_wr5S4ag.js";
import { b as F } from "./power-menu-m-V-QDwl.js";
import { P as S } from "./space-power-icon-CjSuD6Zi.js";
function K(e) {
  return z(
    f("power_history"),
    {
      team_id: e.teamID,
      team_power_id: e.teamPowerID
    },
    e.beforeID,
    e.limit
  );
}
function L(e) {
  return $(
    f("power_history_detail"),
    { team_id: e.teamID },
    e.historyID
  );
}
const d = T("@/components/ui/dropdown-menu");
if (!d || Object.keys(d).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dropdown-menu");
const Z = d.DropdownMenu, B = d.DropdownMenuContent, O = d.DropdownMenuItem, V = d.DropdownMenuSub, G = d.DropdownMenuSubContent, J = d.DropdownMenuSubTrigger, Q = d.DropdownMenuTrigger;
function U({
  value: e,
  powers: n,
  categories: l,
  onValueChange: o
}) {
  const s = n.find((i) => i.id === e), a = k(
    () => F(n, l, (i) => i.cateID),
    [l, n]
  );
  return /* @__PURE__ */ c("div", { className: "workbench-picker workbench-power-picker", children: /* @__PURE__ */ p(Z, { modal: !1, children: [
    /* @__PURE__ */ c(Q, { asChild: !0, children: /* @__PURE__ */ p(
      "button",
      {
        type: "button",
        className: "workbench-picker-trigger workbench-power-picker-trigger",
        "aria-label": "选择工具",
        children: [
          /* @__PURE__ */ p("span", { className: "flex min-w-0 items-center gap-2", children: [
            s ? /* @__PURE__ */ c(
              S,
              {
                power: s,
                size: 15,
                className: "shrink-0"
              }
            ) : null,
            /* @__PURE__ */ c("span", { className: "truncate", children: s?.name || "选择工具" })
          ] }),
          /* @__PURE__ */ c(q, { className: "workbench-power-picker-chevron", size: 15 })
        ]
      }
    ) }),
    /* @__PURE__ */ p(
      B,
      {
        align: "start",
        className: "workbench-picker-content workbench-power-picker-content",
        children: [
          a.basicPowers.map((i) => /* @__PURE__ */ c(
            P,
            {
              power: i,
              selected: i.id === e,
              onSelect: o
            },
            i.id
          )),
          a.groups.map((i) => /* @__PURE__ */ p(V, { children: [
            /* @__PURE__ */ p(J, { className: "workbench-picker-item workbench-power-group-trigger", children: [
              /* @__PURE__ */ c(E, { size: 15 }),
              /* @__PURE__ */ c("span", { className: "truncate", children: i.category.name }),
              /* @__PURE__ */ c("small", { children: i.powers.length })
            ] }),
            /* @__PURE__ */ c(G, { className: "workbench-picker-content workbench-power-picker-subcontent", children: i.powers.map((h) => /* @__PURE__ */ c(
              P,
              {
                power: h,
                selected: h.id === e,
                onSelect: o
              },
              h.id
            )) })
          ] }, i.category.id))
        ]
      }
    )
  ] }) });
}
function P({
  power: e,
  selected: n,
  onSelect: l
}) {
  return /* @__PURE__ */ p(
    O,
    {
      className: `workbench-picker-item workbench-power-picker-item${n ? " is-selected" : ""}`,
      onSelect: () => l(e.id),
      children: [
        /* @__PURE__ */ c(S, { power: e, size: 14, className: "shrink-0" }),
        /* @__PURE__ */ c("span", { className: "min-w-0 flex-1 truncate", children: e.name }),
        n ? /* @__PURE__ */ c(R, { size: 14 }) : null
      ]
    }
  );
}
function le({
  teamID: e,
  powers: n,
  powerCategories: l,
  continuationAsset: o,
  onClearContinuation: s
}) {
  const [a, i] = y(0), [h, g] = y([]);
  b(() => {
    i(
      (r) => n.some((t) => t.id === r) ? r : n[0]?.id || 0
    ), g(
      (r) => r.filter((t) => n.some((m) => m.id === t))
    );
  }, [n]), b(() => {
    o?.sourceType === "tool" && n.some((r) => r.id === o.sourceID) && i(o.sourceID);
  }, [o, n]), b(() => {
    a && g(
      (r) => r.includes(a) ? r : [...r, a]
    );
  }, [a]);
  const M = n.find((r) => r.id === a), N = k(
    () => new Map(
      n.map((r) => [
        r.id,
        {
          team_id: e,
          team_power_id: r.id,
          ...o?.sourceType === "tool" && o.sourceID === r.id ? { target_asset_id: o.id } : {}
        }
      ])
    ),
    [o, n, e]
  ), _ = k(
    () => new Map(
      n.map((r) => {
        const t = o?.sourceType === "tool" && o.sourceID === r.id ? o.id : 0;
        return [
          r.id,
          {
            scopeKey: `${e}:${r.id}:${t}`,
            selectLatest: t === 0,
            loadPage: (m) => K({
              teamID: e,
              teamPowerID: r.id,
              beforeID: m
            }),
            loadDetail: (m) => L({ teamID: e, historyID: m })
          }
        ];
      })
    ),
    [o, n, e]
  );
  if (!M)
    return /* @__PURE__ */ c(I, { icon: C, title: "当前团队没有可用工具" });
  const v = (r) => {
    i(r), o?.sourceType === "tool" && o.sourceID !== r && s();
  };
  return /* @__PURE__ */ p("div", { className: "workbench-page workbench-function-page flex h-full min-h-0 flex-col", children: [
    o?.sourceType === "tool" ? /* @__PURE__ */ c(
      W,
      {
        asset: o,
        action: "重新生成",
        onCancel: s
      }
    ) : null,
    /* @__PURE__ */ c("div", { className: "workbench-function-content min-h-0 flex-1 overflow-y-auto md:overflow-hidden", children: h.map((r) => {
      const t = n.find((u) => u.id === r);
      if (!t)
        return null;
      const m = N.get(r), w = o?.sourceType === "tool" && o.sourceID === t.id ? o : null;
      return /* @__PURE__ */ c(
        "div",
        {
          className: r === a ? "h-full min-h-0" : "hidden",
          children: /* @__PURE__ */ c(
            H,
            {
              powerKey: t.key,
              appearance: "body",
              requestApi: f("power_run"),
              paramApi: f("power_form"),
              streamApi: D("power_stream", { teamID: e }),
              stopApi: D("power_stop", { teamID: e }),
              requestScope: m,
              paramScope: m,
              height: "100%",
              resultTitle: "结果",
              formHeader: /* @__PURE__ */ c(
                U,
                {
                  value: a,
                  powers: n,
                  categories: l,
                  onValueChange: v
                }
              ),
              assetReferenceTeamID: e,
              allowResourceLibrary: !1,
              history: _.get(t.id),
              renderResultActions: (u) => u.successful ? /* @__PURE__ */ c(
                X,
                {
                  teamID: e,
                  teamPowerID: t.id,
                  requestID: u.requestID,
                  defaultTitle: u.title,
                  targetAssetID: w && u.targetAssetID === w.id ? w.id : 0,
                  targetAssetName: w?.name || "",
                  onSaved: s
                }
              ) : null
            }
          )
        },
        r
      );
    }) })
  ] });
}
function X({
  teamID: e,
  teamPowerID: n,
  requestID: l,
  defaultTitle: o,
  targetAssetID: s,
  targetAssetName: a,
  onSaved: i
}) {
  return /* @__PURE__ */ c(
    x,
    {
      teamID: e,
      resetKey: `${l}:${s}`,
      defaultName: s ? a : o,
      appearance: "toolbar",
      confirmDescription: s ? "保存后将作为当前素材的新版本。" : "保存后将作为当前团队的素材。",
      save: (h) => j({
        teamID: e,
        teamPowerID: n,
        requestID: l,
        targetAssetID: s,
        name: h
      }),
      onSaved: () => {
        s && i();
      }
    }
  );
}
export {
  le as WorkbenchFunctionPage
};
