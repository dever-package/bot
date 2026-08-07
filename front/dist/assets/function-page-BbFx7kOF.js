import { j as n, a as m } from "./createLucideIcon-fWv1XcFy.js";
import { i as k, b as y, c as b } from "./runtime-entry-ClkZDmNs.js";
import { Z as v } from "./zap-CEP3W7uy.js";
import { W as I, A as C, S as W } from "./asset-continuation-DwBnPLsC.js";
import { l as x, a as $, S as z } from "./stream-request-HZQ_bZ-N.js";
import { w, a as D, b as H } from "./home-shell-B1yhTnnn.js";
import { C as R } from "./check-B_RB4H2g.js";
import { C as j } from "./chevron-down-e5qsfp_F.js";
import { F as q } from "./music-DaWYUdzx.js";
import { m as h } from "./storyboard-grid-view-BldHSQpc.js";
import { b as F } from "./power-menu-DU0NNyd7.js";
import { P as S } from "./power-icon-B4F9A-tn.js";
function K(e) {
  return $(
    w("power_history"),
    {
      team_id: e.teamID,
      team_power_id: e.teamPowerID
    },
    e.beforeID,
    e.limit
  );
}
function E(e) {
  return x(
    w("power_history_detail"),
    { team_id: e.teamID },
    e.historyID
  );
}
const L = h.DropdownMenu, Z = h.DropdownMenuContent, B = h.DropdownMenuItem, V = h.DropdownMenuSub, G = h.DropdownMenuSubContent, J = h.DropdownMenuSubTrigger, O = h.DropdownMenuTrigger;
function Q({
  value: e,
  powers: c,
  categories: l,
  onValueChange: o
}) {
  const a = c.find((i) => i.id === e), s = k(
    () => F(c, l, (i) => i.cateID),
    [l, c]
  );
  return /* @__PURE__ */ n("div", { className: "workbench-picker workbench-power-picker", children: /* @__PURE__ */ m(L, { modal: !1, children: [
    /* @__PURE__ */ n(O, { asChild: !0, children: /* @__PURE__ */ m(
      "button",
      {
        type: "button",
        className: "workbench-picker-trigger workbench-power-picker-trigger",
        "aria-label": "选择工具",
        children: [
          /* @__PURE__ */ m("span", { className: "flex min-w-0 items-center gap-2", children: [
            a ? /* @__PURE__ */ n(
              S,
              {
                power: a,
                size: 15,
                className: "shrink-0"
              }
            ) : null,
            /* @__PURE__ */ n("span", { className: "truncate", children: a?.name || "选择工具" })
          ] }),
          /* @__PURE__ */ n(j, { className: "workbench-power-picker-chevron", size: 15 })
        ]
      }
    ) }),
    /* @__PURE__ */ m(
      Z,
      {
        align: "start",
        className: "workbench-picker-content workbench-power-picker-content",
        children: [
          s.basicPowers.map((i) => /* @__PURE__ */ n(
            P,
            {
              power: i,
              selected: i.id === e,
              onSelect: o
            },
            i.id
          )),
          s.groups.map((i) => /* @__PURE__ */ m(V, { children: [
            /* @__PURE__ */ m(J, { className: "workbench-picker-item workbench-power-group-trigger", children: [
              /* @__PURE__ */ n(q, { size: 15 }),
              /* @__PURE__ */ n("span", { className: "truncate", children: i.category.name }),
              /* @__PURE__ */ n("small", { children: i.powers.length })
            ] }),
            /* @__PURE__ */ n(G, { className: "workbench-picker-content workbench-power-picker-subcontent", children: i.powers.map((p) => /* @__PURE__ */ n(
              P,
              {
                power: p,
                selected: p.id === e,
                onSelect: o
              },
              p.id
            )) })
          ] }, i.category.id))
        ]
      }
    )
  ] }) });
}
function P({
  power: e,
  selected: c,
  onSelect: l
}) {
  return /* @__PURE__ */ m(
    B,
    {
      className: `workbench-picker-item workbench-power-picker-item${c ? " is-selected" : ""}`,
      onSelect: () => l(e.id),
      children: [
        /* @__PURE__ */ n(S, { power: e, size: 14, className: "shrink-0" }),
        /* @__PURE__ */ n("span", { className: "min-w-0 flex-1 truncate", children: e.name }),
        c ? /* @__PURE__ */ n(R, { size: 14 }) : null
      ]
    }
  );
}
function le({
  teamID: e,
  powers: c,
  powerCategories: l,
  continuationAsset: o,
  onClearContinuation: a
}) {
  const [s, i] = y(0), [p, g] = y([]);
  b(() => {
    i(
      (r) => c.some((t) => t.id === r) ? r : c[0]?.id || 0
    ), g(
      (r) => r.filter((t) => c.some((d) => d.id === t))
    );
  }, [c]), b(() => {
    o?.sourceType === "tool" && c.some((r) => r.id === o.sourceID) && i(o.sourceID);
  }, [o, c]), b(() => {
    s && g(
      (r) => r.includes(s) ? r : [...r, s]
    );
  }, [s]);
  const M = c.find((r) => r.id === s), N = k(
    () => new Map(
      c.map((r) => [
        r.id,
        {
          team_id: e,
          team_power_id: r.id,
          ...o?.sourceType === "tool" && o.sourceID === r.id ? { target_asset_id: o.id } : {}
        }
      ])
    ),
    [o, c, e]
  ), _ = k(
    () => new Map(
      c.map((r) => {
        const t = o?.sourceType === "tool" && o.sourceID === r.id ? o.id : 0;
        return [
          r.id,
          {
            scopeKey: `${e}:${r.id}:${t}`,
            selectLatest: t === 0,
            loadPage: (d) => K({
              teamID: e,
              teamPowerID: r.id,
              beforeID: d
            }),
            loadDetail: (d) => E({ teamID: e, historyID: d })
          }
        ];
      })
    ),
    [o, c, e]
  );
  if (!M)
    return /* @__PURE__ */ n(I, { icon: v, title: "当前团队没有可用工具" });
  const T = (r) => {
    i(r), o?.sourceType === "tool" && o.sourceID !== r && a();
  };
  return /* @__PURE__ */ m("div", { className: "workbench-page workbench-function-page flex h-full min-h-0 flex-col", children: [
    o?.sourceType === "tool" ? /* @__PURE__ */ n(
      C,
      {
        asset: o,
        action: "重新生成",
        onCancel: a
      }
    ) : null,
    /* @__PURE__ */ n("div", { className: "workbench-function-content min-h-0 flex-1 overflow-y-auto md:overflow-hidden", children: p.map((r) => {
      const t = c.find((u) => u.id === r);
      if (!t)
        return null;
      const d = N.get(r), f = o?.sourceType === "tool" && o.sourceID === t.id ? o : null;
      return /* @__PURE__ */ n(
        "div",
        {
          className: r === s ? "h-full min-h-0" : "hidden",
          children: /* @__PURE__ */ n(
            z,
            {
              powerKey: t.key,
              appearance: "body",
              requestApi: w("power_run"),
              paramApi: w("power_form"),
              streamApi: D("power_stream", { teamID: e }),
              stopApi: D("power_stop", { teamID: e }),
              requestScope: d,
              paramScope: d,
              height: "100%",
              resultTitle: "结果",
              formHeader: /* @__PURE__ */ n(
                Q,
                {
                  value: s,
                  powers: c,
                  categories: l,
                  onValueChange: T
                }
              ),
              assetReferenceTeamID: e,
              allowResourceLibrary: !1,
              history: _.get(t.id),
              renderResultActions: (u) => u.successful ? /* @__PURE__ */ n(
                U,
                {
                  teamID: e,
                  teamPowerID: t.id,
                  requestID: u.requestID,
                  defaultTitle: u.title,
                  targetAssetID: f && u.targetAssetID === f.id ? f.id : 0,
                  targetAssetName: f?.name || "",
                  onSaved: a
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
function U({
  teamID: e,
  teamPowerID: c,
  requestID: l,
  defaultTitle: o,
  targetAssetID: a,
  targetAssetName: s,
  onSaved: i
}) {
  return /* @__PURE__ */ n(
    W,
    {
      teamID: e,
      resetKey: `${l}:${a}`,
      defaultName: a ? s : o,
      appearance: "toolbar",
      confirmDescription: a ? "保存后将作为当前素材的新版本。" : "保存后将作为当前团队的素材。",
      save: (p) => H({
        teamID: e,
        teamPowerID: c,
        requestID: l,
        targetAssetID: a,
        name: p
      }),
      onSaved: () => {
        a && i();
      }
    }
  );
}
export {
  le as WorkbenchFunctionPage
};
