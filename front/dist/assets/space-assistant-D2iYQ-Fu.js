import { j as y, a as Z } from "./react-CDpwMNlY.js";
import { u as S, h as a, e as L, b as x } from "./file-kind-DFeonxO2.js";
import { t as H } from "./index-CVhTq79S.js";
import { u as V, A as W } from "./index-BDWS5dIw.js";
import { A as X } from "./asset-page-U4pLr5f2.js";
import { u as G } from "./asset-reference-provider-d_hsIG-H.js";
import { s as J, B as Q, a as j } from "./space-upload-CiyhICGY.js";
import { l as C, b as ee } from "./workbench-api-BklP9TYp.js";
import { b as se } from "./space-page-B7eY-TDj.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-assistant-Degzp0bn.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const h = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!h || Object.keys(h).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const te = h.joinSiteApi;
function we({
  assistant: e,
  project: n,
  team: s,
  activeAssetCateID: c,
  activeCanvas: t,
  selectedNodes: p,
  width: K,
  expanded: w,
  onWidthChange: D,
  onToggleExpanded: B,
  onClose: k,
  onFlushCanvas: b,
  onCanvasChanged: A,
  onUploadAssets: R
}) {
  const d = S(
    () => ne(n.id, t.id),
    [t.id, n.id]
  ), U = a(async () => ({ ...await C({
    api: d.config,
    cacheKey: `canvas-assistant:${n.id}:${t.id}`
  }), categories: [] }), [t.id, d.config, n.id]), q = a(
    (i, r) => ee({
      api: d.powerForm,
      cacheKey: `canvas-assistant:${n.id}:${t.id}`,
      teamPowerID: i,
      sourceTargetID: r
    }),
    [t.id, d.powerForm, n.id]
  ), z = a(
    (i) => /* @__PURE__ */ y(X, { ...i, teamID: s.id }),
    [s.id]
  ), o = V({
    enabled: e.available && !!e.agentKey,
    scopeKey: `canvas-assistant:${n.id}:${t.id}:${e.roleID}`,
    toolIDField: "team_power_id",
    loadConfig: U,
    loadToolForm: q,
    renderFileLibrary: z
  }), $ = o.prepareInput, v = o.onConversationStateChange, I = G({
    teamID: s.id,
    scopeProjectID: n.id,
    initialFilters: {
      sourceType: "project",
      projectID: n.id,
      canvasID: t.id
    },
    onUpload: R
  }), N = S(
    () => [I],
    [I]
  ), P = S(
    () => p.slice(-12).map(ie),
    [p]
  ), O = a(
    async (i) => (await b(t), {
      ...$(i),
      canvas_context: {
        project_id: n.id,
        canvas_id: t.id,
        project_name: n.name,
        asset_cate_id: c,
        canvas_updated_at: t.updatedAt || "",
        selected_nodes: P
      }
    }),
    [
      c,
      t,
      b,
      $,
      n.id,
      n.name,
      P
    ]
  ), u = L(/* @__PURE__ */ new Set());
  x(() => {
    u.current.clear();
  }, [t.id, n.id]);
  const M = a(
    (i) => {
      v(i);
      for (const r of i.messages)
        for (const l of r.activities || []) {
          const _ = oe(l.output.canvas_change), f = Number(_.canvas_id || t.id || 0), F = String(_.revision || ""), g = `${f}:${F}`;
          !f || !F || u.current.has(g) || (u.current.add(g), Promise.resolve(A(f)).catch((E) => {
            u.current.delete(g), H.error(
              E instanceof Error ? E.message : "刷新画布失败，请重试"
            );
          }));
        }
    },
    [t.id, v, A]
  ), T = a(
    async (i) => {
      await J({
        teamID: s.id,
        projectID: n.id,
        canvasID: t.id,
        files: i
      });
    },
    [t.id, n.id, s.id]
  ), m = L(null);
  x(() => () => m.current?.(), []);
  const Y = a(
    (i) => {
      i.preventDefault(), m.current?.();
      const r = (_) => {
        D(
          se(window.innerWidth - _.clientX)
        );
      }, l = () => {
        window.removeEventListener("pointermove", r), window.removeEventListener("pointerup", l), m.current = null;
      };
      m.current = l, window.addEventListener("pointermove", r), window.addEventListener("pointerup", l, { once: !0 });
    },
    [D]
  );
  return /* @__PURE__ */ Z(
    "aside",
    {
      id: "workspace-canvas-assistant",
      className: `ws-assistant-panel ${w ? "is-expanded" : ""}`,
      style: { "--ws-assistant-panel-width": `${K}px` },
      "aria-label": e.name || "画布助手",
      children: [
        w ? null : /* @__PURE__ */ y(
          "div",
          {
            className: "ws-assistant-resizer",
            role: "separator",
            "aria-orientation": "vertical",
            "aria-label": "调整对话面板宽度",
            onPointerDown: Y
          }
        ),
        /* @__PURE__ */ y(
          W,
          {
            agentKey: e.agentKey,
            agentName: e.name,
            contextKey: `project-canvas:${n.id}:canvas:${t.id}:team:${s.id}:role:${e.roleID}`,
            open: !0,
            appearance: "canvas",
            navigationMode: "internal",
            expanded: w,
            height: "100%",
            minHeight: "0",
            lazySession: !0,
            proactiveOpening: e.openingEnabled,
            uploadBizKey: j,
            uploadBizName: Q,
            allowResourceLibrary: !1,
            composerDisabled: o.disabled,
            composerToolbar: o.toolbar,
            composerParameters: o.parameters,
            composerParameterScopeKey: o.parameterScopeKey,
            renderFileLibrary: o.renderFileLibrary,
            prepareInput: O,
            onConversationStateChange: M,
            onUploadedFiles: T,
            assistantApi: d.assistant,
            runtimeApi: d.runtime,
            requestScope: {
              project_id: n.id,
              canvas_id: t.id,
              asset_cate_id: c,
              selected_node_ids: p.map((i) => i.id)
            },
            referenceProviders: N,
            onToggleExpanded: B,
            onClose: k
          }
        )
      ]
    }
  );
}
function ne(e, n) {
  const s = (c) => {
    const t = te(`workspace/${c}`), p = new URLSearchParams({
      project_id: String(e),
      canvas_id: String(n)
    });
    return `${t}${t.includes("?") ? "&" : "?"}${p.toString()}`;
  };
  return {
    config: s("assistant_config"),
    powerForm: s("assistant_power_form"),
    assistant: {
      session: s("assistant_session"),
      sessions: s("assistant_sessions"),
      newSession: s("assistant_new_session"),
      renameSession: s("assistant_rename_session"),
      archiveSession: s("assistant_archive_session")
    },
    runtime: {
      request: s("assistant_run"),
      opening: s("assistant_opening"),
      stream: s("assistant_stream"),
      stop: s("assistant_stop"),
      status: s("assistant_status"),
      referencePreview: s("assistant_reference_preview"),
      inputConfig: s("assistant_input_config"),
      document: s("assistant_document"),
      documentStream: s("assistant_document_stream")
    }
  };
}
function ie(e) {
  return {
    id: e.id,
    type: e.type,
    title: e.title,
    asset_cate_id: e.assetCateId || 0,
    role_id: e.role?.id || 0,
    power_id: e.power?.id || 0,
    flow_id: e.flow?.id || 0
  };
}
function oe(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
export {
  we as SpaceAssistant
};
