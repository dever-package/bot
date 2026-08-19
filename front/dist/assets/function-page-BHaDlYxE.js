import { j as n, a as u } from "./preloadable-Bomi5PEU.js";
import { a as b, b as k, u as y } from "./_commonjsHelpers-61wyk6v6.js";
import { c as N, Z as S } from "./vendor-icons-B3DKX3la.js";
import { W as T, A as C, S as W } from "./asset-continuation-qJsDy2gO.js";
import { l as x, a as H, S as I } from "./stream-power-history-api-DpMWiLCd.js";
import { w, s as P, a as $ } from "./home-shell-BPM5Zt6P.js";
import { P as j } from "./power-icon-HeeWAKmZ.js";
import { P as R } from "./power-picker-menu-ac0E1ttz.js";
function q(r) {
  return H(
    w("power_history"),
    {
      team_id: r.teamID,
      team_power_id: r.teamPowerID
    },
    r.beforeID,
    r.limit
  );
}
function E(r) {
  return x(
    w("power_history_detail"),
    { team_id: r.teamID },
    r.historyID
  );
}
await window.DeverFront?.ensureCompat?.(["@/components/ui/dropdown-menu"]);
const h = window.DeverFront?.sdk?.getCompatModule("@/components/ui/dropdown-menu");
if (!h || Object.keys(h).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/components/ui/dropdown-menu");
const F = h.DropdownMenu, K = h.DropdownMenuContent, O = h.DropdownMenuTrigger;
function z({
  value: r,
  powers: a,
  categories: p,
  onValueChange: o
}) {
  const [c, s] = b(!1), t = a.find((m) => m.id === r);
  return /* @__PURE__ */ n("div", { className: "workbench-picker workbench-power-picker", children: /* @__PURE__ */ u(F, { modal: !1, open: c, onOpenChange: s, children: [
    /* @__PURE__ */ n(O, { asChild: !0, children: /* @__PURE__ */ u(
      "button",
      {
        type: "button",
        className: "workbench-picker-trigger workbench-power-picker-trigger",
        "aria-label": "选择工具",
        children: [
          /* @__PURE__ */ u("span", { className: "flex min-w-0 items-center gap-2", children: [
            t ? /* @__PURE__ */ n(
              j,
              {
                power: t,
                size: 15,
                className: "shrink-0"
              }
            ) : null,
            /* @__PURE__ */ n("span", { className: "truncate", children: t?.name || "选择工具" })
          ] }),
          /* @__PURE__ */ n(N, { className: "workbench-power-picker-chevron", size: 15 })
        ]
      }
    ) }),
    /* @__PURE__ */ n(
      K,
      {
        align: "start",
        className: "workbench-picker-content workbench-power-picker-content",
        children: /* @__PURE__ */ n(
          R,
          {
            open: c,
            value: r,
            powers: a,
            categories: p,
            appearance: "workbench",
            onValueChange: o
          }
        )
      }
    )
  ] }) });
}
function Y({
  teamID: r,
  powers: a,
  powerCategories: p,
  continuationAsset: o,
  onClearContinuation: c
}) {
  const [s, t] = b(0), [m, g] = b([]);
  k(() => {
    t(
      (e) => a.some((i) => i.id === e) ? e : a[0]?.id || 0
    ), g(
      (e) => e.filter((i) => a.some((l) => l.id === i))
    );
  }, [a]), k(() => {
    o?.sourceType === "tool" && a.some((e) => e.id === o.sourceID) && t(o.sourceID);
  }, [o, a]), k(() => {
    s && g(
      (e) => e.includes(s) ? e : [...e, s]
    );
  }, [s]);
  const v = a.find((e) => e.id === s), _ = y(
    () => new Map(
      a.map((e) => [
        e.id,
        {
          team_id: r,
          team_power_id: e.id,
          ...o?.sourceType === "tool" && o.sourceID === e.id ? { target_asset_id: o.id } : {}
        }
      ])
    ),
    [o, a, r]
  ), D = y(
    () => new Map(
      a.map((e) => {
        const i = o?.sourceType === "tool" && o.sourceID === e.id ? o.id : 0;
        return [
          e.id,
          {
            scopeKey: `${r}:${e.id}:${i}`,
            selectLatest: i === 0,
            loadPage: (l) => q({
              teamID: r,
              teamPowerID: e.id,
              beforeID: l
            }),
            loadDetail: (l) => E({ teamID: r, historyID: l })
          }
        ];
      })
    ),
    [o, a, r]
  );
  if (!v)
    return /* @__PURE__ */ n(T, { icon: S, title: "当前团队没有可用工具" });
  const M = (e) => {
    t(e), o?.sourceType === "tool" && o.sourceID !== e && c();
  };
  return /* @__PURE__ */ u("div", { className: "workbench-page workbench-function-page flex h-full min-h-0 flex-col", children: [
    o?.sourceType === "tool" ? /* @__PURE__ */ n(
      C,
      {
        asset: o,
        action: "重新生成",
        onCancel: c
      }
    ) : null,
    /* @__PURE__ */ n("div", { className: "workbench-function-content min-h-0 flex-1 overflow-y-auto md:overflow-hidden", children: m.map((e) => {
      const i = a.find((d) => d.id === e);
      if (!i)
        return null;
      const l = _.get(e), f = o?.sourceType === "tool" && o.sourceID === i.id ? o : null;
      return /* @__PURE__ */ n(
        "div",
        {
          className: e === s ? "h-full min-h-0" : "hidden",
          children: /* @__PURE__ */ n(
            I,
            {
              powerKey: i.key,
              appearance: "body",
              requestApi: w("power_run"),
              paramApi: w("power_form"),
              streamApi: P("power_stream", { teamID: r }),
              stopApi: P("power_stop", { teamID: r }),
              requestScope: l,
              paramScope: l,
              height: "100%",
              resultTitle: "结果",
              formHeader: /* @__PURE__ */ n(
                z,
                {
                  value: s,
                  powers: a,
                  categories: p,
                  onValueChange: (d) => {
                    typeof d == "number" && M(d);
                  }
                }
              ),
              assetReferenceTeamID: r,
              allowResourceLibrary: !1,
              history: D.get(i.id),
              renderResultActions: (d) => d.successful ? /* @__PURE__ */ n(
                L,
                {
                  teamID: r,
                  teamPowerID: i.id,
                  requestID: d.requestID,
                  defaultTitle: d.title,
                  targetAssetID: f && d.targetAssetID === f.id ? f.id : 0,
                  targetAssetName: f?.name || "",
                  onSaved: c
                }
              ) : null
            }
          )
        },
        e
      );
    }) })
  ] });
}
function L({
  teamID: r,
  teamPowerID: a,
  requestID: p,
  defaultTitle: o,
  targetAssetID: c,
  targetAssetName: s,
  onSaved: t
}) {
  return /* @__PURE__ */ n(
    W,
    {
      teamID: r,
      resetKey: `${p}:${c}`,
      defaultName: c ? s : o,
      appearance: "toolbar",
      confirmDescription: c ? "保存后将作为当前素材的新版本。" : "保存后将作为当前团队的素材。",
      save: (m) => $({
        teamID: r,
        teamPowerID: a,
        requestID: p,
        targetAssetID: c,
        name: m
      }),
      onSaved: () => {
        c && t();
      }
    }
  );
}
export {
  Y as WorkbenchFunctionPage
};
