import { j as f, a as V } from "./preloadable-B6QZqbLd.js";
import { S as W } from "./space-node-runtime-DoeIrVE7.js";
import { a as X, u as S, h as a, b as x, d as K } from "./file-kind-Cq3pESGF.js";
import { u as G, A as J } from "./index-BgulInq6.js";
import { A as Q } from "./asset-page-BDdZTK0u.js";
import { u as j } from "./asset-reference-provider-DibP2rOu.js";
import { s as C, B as ee, a as se } from "./space-upload-B-1PIF2y.js";
import { l as te, b as ne } from "./workbench-api-BU1iyRUW.js";
import { e as ie } from "./space-assistant-layout-B9KyeCM0.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-assistant-Degzp0bn.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const h = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!h || Object.keys(h).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const oe = h.joinSiteApi;
function ye({
  assistant: e,
  project: n,
  team: s,
  activeAssetCateID: c,
  activeCanvas: t,
  selectedNodes: p,
  width: B,
  expanded: w,
  onWidthChange: D,
  onToggleExpanded: k,
  onClose: O,
  onFlushCanvas: b,
  onCanvasChanged: A,
  onUploadAssets: R
}) {
  const [U, $] = X(""), d = S(
    () => re(n.id, t.id),
    [t.id, n.id]
  ), M = a(async () => ({ ...await te({
    api: d.config,
    cacheKey: `canvas-assistant:${n.id}:${t.id}`
  }), categories: [] }), [t.id, d.config, n.id]), q = a(
    (i, r) => ne({
      api: d.powerForm,
      cacheKey: `canvas-assistant:${n.id}:${t.id}`,
      teamPowerID: i,
      sourceTargetID: r
    }),
    [t.id, d.powerForm, n.id]
  ), z = a(
    (i) => /* @__PURE__ */ f(Q, { ...i, teamID: s.id, notificationMode: "inline" }),
    [s.id]
  ), o = G({
    enabled: e.available && !!e.agentKey,
    scopeKey: `canvas-assistant:${n.id}:${t.id}:${e.roleID}`,
    toolIDField: "team_power_id",
    loadConfig: M,
    loadToolForm: q,
    renderFileLibrary: z
  }), E = o.prepareInput, v = o.onConversationStateChange, I = j({
    notificationMode: "inline",
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
    () => p.slice(-12).map(ae),
    [p]
  ), T = a(
    async (i) => (await b(t), {
      ...E(i),
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
      E,
      n.id,
      n.name,
      P
    ]
  ), u = x(/* @__PURE__ */ new Set());
  K(() => {
    u.current.clear();
  }, [t.id, n.id]);
  const Y = a(
    (i) => {
      v(i);
      for (const r of i.messages)
        for (const l of r.activities || []) {
          const _ = de(l.output.canvas_change), g = Number(_.canvas_id || t.id || 0), F = String(_.revision || ""), y = `${g}:${F}`;
          !g || !F || u.current.has(y) || (u.current.add(y), Promise.resolve(A(g)).catch((L) => {
            u.current.delete(y), $(
              L instanceof Error ? L.message : "刷新画布失败，请重试"
            );
          }));
        }
    },
    [t.id, v, A]
  ), Z = a(
    async (i) => {
      await C({
        teamID: s.id,
        projectID: n.id,
        canvasID: t.id,
        files: i
      });
    },
    [t.id, n.id, s.id]
  ), m = x(null);
  K(() => () => m.current?.(), []);
  const H = a(
    (i) => {
      i.preventDefault(), m.current?.();
      const r = (_) => {
        D(
          ie(window.innerWidth - _.clientX)
        );
      }, l = () => {
        window.removeEventListener("pointermove", r), window.removeEventListener("pointerup", l), m.current = null;
      };
      m.current = l, window.addEventListener("pointermove", r), window.addEventListener("pointerup", l, { once: !0 });
    },
    [D]
  );
  return /* @__PURE__ */ V(
    "aside",
    {
      id: "workspace-canvas-assistant",
      className: `ws-assistant-panel ${w ? "is-expanded" : ""}`,
      style: { "--ws-assistant-panel-width": `${B}px` },
      "aria-label": e.name || "画布助手",
      children: [
        w ? null : /* @__PURE__ */ f(
          "div",
          {
            className: "ws-assistant-resizer",
            role: "separator",
            "aria-orientation": "vertical",
            "aria-label": "调整对话面板宽度",
            onPointerDown: H
          }
        ),
        /* @__PURE__ */ f(
          W,
          {
            message: U,
            onDismiss: () => $("")
          }
        ),
        /* @__PURE__ */ f(
          J,
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
            uploadBizKey: se,
            uploadBizName: ee,
            allowResourceLibrary: !1,
            composerDisabled: o.disabled,
            composerToolbar: o.toolbar,
            composerParameters: o.parameters,
            composerParameterScopeKey: o.parameterScopeKey,
            renderFileLibrary: o.renderFileLibrary,
            prepareInput: T,
            onConversationStateChange: Y,
            onUploadedFiles: Z,
            assistantApi: d.assistant,
            runtimeApi: d.runtime,
            requestScope: {
              project_id: n.id,
              canvas_id: t.id,
              asset_cate_id: c,
              selected_node_ids: p.map((i) => i.id)
            },
            referenceProviders: N,
            onToggleExpanded: k,
            onClose: O
          }
        )
      ]
    }
  );
}
function re(e, n) {
  const s = (c) => {
    const t = oe(`workspace/${c}`), p = new URLSearchParams({
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
function ae(e) {
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
function de(e) {
  return e && typeof e == "object" && !Array.isArray(e) ? e : {};
}
export {
  ye as SpaceAssistant
};
