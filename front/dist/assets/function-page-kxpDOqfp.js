import { a as n, j as m } from "./_commonjsHelpers-CTFd9u1x.js";
import { d as b, l as y, o as k } from "./react-C7Xtl8sB.js";
import { j as v, k as I, c as W, Z as x } from "./vendor-icons-Cc7Kl3It.js";
import { W as C, A as $, S as z } from "./asset-continuation-DJHZSvka.js";
import { l as H, a as j, S as R } from "./stream-request-CXgkvWCY.js";
import { w as f, a as D, b as q } from "./home-shell-CgpDp6ol.js";
import { m as h } from "./storyboard-grid-view-CJXm84yJ.js";
import { b as K, P as S } from "./space-add-node-menu-pcpVf0B3.js";
function E(e) {
  return j(
    f("power_history"),
    {
      team_id: e.teamID,
      team_power_id: e.teamPowerID
    },
    e.beforeID,
    e.limit
  );
}
function F(e) {
  return H(
    f("power_history_detail"),
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
  const a = c.find((i) => i.id === e), s = b(
    () => K(c, l, (i) => i.cateID),
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
          /* @__PURE__ */ n(v, { className: "workbench-power-picker-chevron", size: 15 })
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
              /* @__PURE__ */ n(I, { size: 15 }),
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
        c ? /* @__PURE__ */ n(W, { size: 14 }) : null
      ]
    }
  );
}
function ie({
  teamID: e,
  powers: c,
  powerCategories: l,
  continuationAsset: o,
  onClearContinuation: a
}) {
  const [s, i] = y(0), [p, g] = y([]);
  k(() => {
    i(
      (r) => c.some((t) => t.id === r) ? r : c[0]?.id || 0
    ), g(
      (r) => r.filter((t) => c.some((d) => d.id === t))
    );
  }, [c]), k(() => {
    o?.sourceType === "tool" && c.some((r) => r.id === o.sourceID) && i(o.sourceID);
  }, [o, c]), k(() => {
    s && g(
      (r) => r.includes(s) ? r : [...r, s]
    );
  }, [s]);
  const M = c.find((r) => r.id === s), N = b(
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
  ), _ = b(
    () => new Map(
      c.map((r) => {
        const t = o?.sourceType === "tool" && o.sourceID === r.id ? o.id : 0;
        return [
          r.id,
          {
            scopeKey: `${e}:${r.id}:${t}`,
            selectLatest: t === 0,
            loadPage: (d) => E({
              teamID: e,
              teamPowerID: r.id,
              beforeID: d
            }),
            loadDetail: (d) => F({ teamID: e, historyID: d })
          }
        ];
      })
    ),
    [o, c, e]
  );
  if (!M)
    return /* @__PURE__ */ n(C, { icon: x, title: "当前团队没有可用工具" });
  const T = (r) => {
    i(r), o?.sourceType === "tool" && o.sourceID !== r && a();
  };
  return /* @__PURE__ */ m("div", { className: "workbench-page workbench-function-page flex h-full min-h-0 flex-col", children: [
    o?.sourceType === "tool" ? /* @__PURE__ */ n(
      $,
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
      const d = N.get(r), w = o?.sourceType === "tool" && o.sourceID === t.id ? o : null;
      return /* @__PURE__ */ n(
        "div",
        {
          className: r === s ? "h-full min-h-0" : "hidden",
          children: /* @__PURE__ */ n(
            R,
            {
              powerKey: t.key,
              appearance: "body",
              requestApi: f("power_run"),
              paramApi: f("power_form"),
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
                  targetAssetID: w && u.targetAssetID === w.id ? w.id : 0,
                  targetAssetName: w?.name || "",
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
    z,
    {
      teamID: e,
      resetKey: `${l}:${a}`,
      defaultName: a ? s : o,
      appearance: "toolbar",
      confirmDescription: a ? "保存后将作为当前素材的新版本。" : "保存后将作为当前团队的素材。",
      save: (p) => q({
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
  ie as WorkbenchFunctionPage
};
