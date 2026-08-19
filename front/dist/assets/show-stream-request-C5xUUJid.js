import { j as p } from "./preloadable-Bomi5PEU.js";
import { u as m } from "./_commonjsHelpers-61wyk6v6.js";
import { u as l } from "./react-DQWh0hYM.js";
import { c as u, S as d } from "./stream-power-history-api-DpMWiLCd.js";
await window.DeverFront?.ensureCompat?.(["@/lib/store", "@/lib/stream"]);
const a = window.DeverFront?.sdk?.getCompatModule("@/lib/store");
if (!a || Object.keys(a).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/store");
const g = a.getStoreValueByPath, s = window.DeverFront?.sdk?.getCompatModule("@/lib/stream");
if (!s || Object.keys(s).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/stream");
const w = s.streamValueText;
function h({ item: e, store: i }) {
  const t = l(
    i,
    () => w(g(i, String(e.meta?.powerPath || "")))
  ), r = String(e.meta?.historyApi || ""), o = String(e.meta?.historyDetailApi || ""), n = m(
    () => t ? u({
      scopeKey: `admin-power:${r}:${o}:${t}`,
      listApi: r,
      detailApi: o,
      scope: { power: t }
    }) : void 0,
    [r, o, t]
  );
  return /* @__PURE__ */ p(
    d,
    {
      powerKey: t,
      requestApi: String(e.meta?.requestApi || "/bot/admin/energon/request"),
      paramApi: String(e.meta?.paramApi || "/bot/admin/energon/power_params"),
      streamApi: String(e.meta?.streamApi || "/bot/admin/energon/stream"),
      stopApi: String(e.meta?.stopApi || "/bot/admin/energon/stream_stop"),
      blockMs: Number(e.meta?.blockMs || 1e3),
      history: n
    }
  );
}
export {
  h as ShowStreamRequest
};
