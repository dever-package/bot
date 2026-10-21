import { j as w, a as V } from "./react-HSzdbxZ7.js";
import { S as W, b as X } from "./writing-run-labels-3Ti7hIo6.js";
import { a as G, u as S, h as a, b as x, d as K } from "./file-kind-D6bMOzYN.js";
import { u as J, A as Q } from "./index-AxznezI5.js";
import { A as j } from "./asset-page-mBQmMmXl.js";
import { u as C } from "./asset-reference-provider-BBrSFyI3.js";
import { s as ee, B as se, a as ne } from "./space-upload-1ncl2HCu.js";
import { l as te, b as ie } from "./workbench-api-DNwm1R5K.js";
if (!window.DeverFront?.ensureStyles)
  throw new Error("Dever front runtime does not support chunk styles");
await window.DeverFront.ensureStyles([new URL("./space-assistant-Degzp0bn.css", import.meta.url).href]);
await window.DeverFront?.ensureCompat?.(["@/lib/request"]);
const h = window.DeverFront?.sdk?.getCompatModule("@/lib/request");
if (!h || Object.keys(h).length === 0)
  throw new Error("[dever-front-plugin] 宿主未注册兼容模块 @/lib/request");
const oe = h.joinSiteApi;
function ge({
  assistant: e,
  project: t,
  team: s,
  activeAssetCateID: c,
  activeCanvas: n,
  selectedNodes: p,
  width: B,
  expanded: f,
  onWidthChange: D,
  onToggleExpanded: k,
  onClose: O,
  onFlushCanvas: b,
  onCanvasChanged: A,
  onUploadAssets: R
}) {
  const [U, $] = G(""), d = S(
    () => re(t.id, n.id),
    [n.id, t.id]
  ), M = a(async () => ({ ...await te({
    api: d.config,
    cacheKey: `canvas-assistant:${t.id}:${n.id}`
  }), categories: [] }), [n.id, d.config, t.id]), q = a(
    (i, r) => ie({
      api: d.powerForm,
      cacheKey: `canvas-assistant:${t.id}:${n.id}`,
      teamPowerID: i,
      sourceTargetID: r
    }),
    [n.id, d.powerForm, t.id]
  ), z = a(
    (i) => /* @__PURE__ */ w(j, { ...i, teamID: s.id, notificationMode: "inline" }),
    [s.id]
  ), o = J({
    enabled: e.available && !!e.agentKey,
    scopeKey: `canvas-assistant:${t.id}:${n.id}:${e.roleID}`,
    toolIDField: "team_power_id",
    loadConfig: M,
    loadToolForm: q,
    renderFileLibrary: z
  }), E = o.prepareInput, v = o.onConversationStateChange, I = C({
    notificationMode: "inline",
    teamID: s.id,
    scopeProjectID: t.id,
    initialFilters: {
      sourceType: "project",
      projectID: t.id,
      canvasID: n.id
    },
    onUpload: R
  }), N = S(
    () => [I],
    [I]
  ), P = S(
    () => p.slice(-12).map(ae),
    [p]
  ), T = a(
    async (i) => (await b(n), {
      ...E(i),
      canvas_context: {
        project_id: t.id,
        canvas_id: n.id,
        project_name: t.name,
        asset_cate_id: c,
        canvas_updated_at: n.updatedAt || "",
        selected_nodes: P
      }
    }),
    [
      c,
      n,
      b,
      E,
      t.id,
      t.name,
      P
    ]
  ), u = x(/* @__PURE__ */ new Set());
  K(() => {
    u.current.clear();
  }, [n.id, t.id]);
  const Y = a(
    (i) => {
      v(i);
      for (const r of i.messages)
        for (const l of r.activities || []) {
          const _ = de(l.output.canvas_change), g = Number(_.canvas_id || n.id || 0), F = String(_.revision || ""), y = `${g}:${F}`;
          !g || !F || u.current.has(y) || (u.current.add(y), Promise.resolve(A(g)).catch((L) => {
            u.current.delete(y), $(
              L instanceof Error ? L.message : "刷新画布失败，请重试"
            );
          }));
        }
    },
    [n.id, v, A]
  ), Z = a(
    async (i) => {
      await ee({
        teamID: s.id,
        projectID: t.id,
        canvasID: n.id,
        files: i
      });
    },
    [n.id, t.id, s.id]
  ), m = x(null);
  K(() => () => m.current?.(), []);
  const H = a(
    (i) => {
      i.preventDefault(), m.current?.();
      const r = (_) => {
        D(
          X(window.innerWidth - _.clientX)
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
      className: `ws-assistant-panel ${f ? "is-expanded" : ""}`,
      style: { "--ws-assistant-panel-width": `${B}px` },
      "aria-label": e.name || "画布助手",
      children: [
        f ? null : /* @__PURE__ */ w(
          "div",
          {
            className: "ws-assistant-resizer",
            role: "separator",
            "aria-orientation": "vertical",
            "aria-label": "调整对话面板宽度",
            onPointerDown: H
          }
        ),
        /* @__PURE__ */ w(
          W,
          {
            message: U,
            onDismiss: () => $("")
          }
        ),
        /* @__PURE__ */ w(
          Q,
          {
            agentKey: e.agentKey,
            agentName: e.name,
            contextKey: `project-canvas:${t.id}:canvas:${n.id}:team:${s.id}:role:${e.roleID}`,
            open: !0,
            appearance: "canvas",
            navigationMode: "internal",
            expanded: f,
            height: "100%",
            minHeight: "0",
            lazySession: !0,
            proactiveOpening: e.openingEnabled,
            uploadBizKey: ne,
            uploadBizName: se,
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
              project_id: t.id,
              canvas_id: n.id,
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
function re(e, t) {
  const s = (c) => {
    const n = oe(`workspace/${c}`), p = new URLSearchParams({
      project_id: String(e),
      canvas_id: String(t)
    });
    return `${n}${n.includes("?") ? "&" : "?"}${p.toString()}`;
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
  ge as SpaceAssistant
};
