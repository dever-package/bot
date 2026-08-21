import { j as d, a as K } from "./preloadable-Bomi5PEU.js";
import { e as g, a as T, u as S, b as P } from "./_commonjsHelpers-61wyk6v6.js";
import { w as x } from "./vendor-icons-B3DKX3la.js";
import { u as L, A as W } from "./index-Zz3lxS5s.js";
import { W as B, A as C, S as $ } from "./asset-continuation-B48GTGFC.js";
import { j as F, k as D, l as E } from "./upload-asset-api-CJCwVOwh.js";
import { a as M, u as j } from "./node-detail-content-CouIBoj-.js";
import { l as q, b as O, c as N, s as R } from "./home-shell-2nTx20OR.js";
import { W as U } from "./workbench-picker-pU70WuO4.js";
function z({
  teamID: o,
  roleID: i,
  powerCategories: a
}) {
  const r = g(async () => ({ ...await q({ teamID: o, roleID: i }), categories: a }), [a, i, o]), n = g(
    (c, m) => O({
      teamID: o,
      teamPowerID: c,
      sourceTargetID: m
    }),
    [o]
  ), t = g(
    (c) => /* @__PURE__ */ d(M, { ...c, teamID: o }),
    [o]
  );
  return { ...L({
    enabled: o > 0 && i > 0,
    scopeKey: `workbench:${o}:${i}`,
    toolIDField: "team_power_id",
    loadConfig: r,
    loadToolForm: n,
    renderFileLibrary: t
  }), renderFileLibrary: t };
}
function ne({
  teamID: o,
  roles: i,
  powerCategories: a,
  continuationAsset: r,
  onClearContinuation: n
}) {
  const [t, u] = T(0), c = j({ teamID: o }), m = S(
    () => [c],
    [c]
  ), v = g(
    async (e) => {
      await F({ teamID: o, files: e });
    },
    [o]
  ), y = S(
    () => r?.sourceType === "dialogue" ? { target_asset_id: r.id } : void 0,
    [r]
  );
  P(() => {
    u(
      (e) => i.some((l) => l.id === e) ? e : i[0]?.id || 0
    );
  }, [i]), P(() => {
    r?.sourceType === "dialogue" && i.some((e) => e.id === r.sourceID) && u(r.sourceID);
  }, [r, i]);
  const s = i.find((e) => e.id === t), p = z({
    teamID: o,
    roleID: s?.id || 0,
    powerCategories: a
  }), h = S(() => {
    if (!s)
      return null;
    const e = (l) => R(l, { teamID: o, roleID: s.id });
    return {
      contextKey: `body-team:${o}:role:${s.id}`,
      assistantApi: {
        session: e("chat_session"),
        sessions: e("chat_sessions"),
        newSession: e("chat_new_session"),
        renameSession: e("chat_rename_session"),
        archiveSession: e("chat_archive_session")
      },
      runtimeApi: {
        request: e("chat_run"),
        opening: e("chat_opening"),
        stream: e("chat_stream"),
        stop: e("chat_stop"),
        status: e("chat_status"),
        referencePreview: e("chat_reference_preview"),
        inputConfig: e("chat_input_config"),
        document: e("chat_document"),
        documentStream: e("chat_document_stream")
      }
    };
  }, [s, o]);
  if (!s || !h)
    return /* @__PURE__ */ d(
      B,
      {
        icon: x,
        title: "当前团队没有可对话的执行角色"
      }
    );
  const f = r?.sourceType === "dialogue" && r.sourceID === s.id ? r : null, A = (e) => {
    u(e), r?.sourceType === "dialogue" && r.sourceID !== e && n();
  };
  return /* @__PURE__ */ K("div", { className: "workbench-page workbench-dialogue-page flex h-full min-h-0 flex-col", children: [
    r?.sourceType === "dialogue" ? /* @__PURE__ */ d(
      C,
      {
        asset: r,
        action: "继续对话",
        onCancel: n
      }
    ) : null,
    /* @__PURE__ */ d("div", { className: "min-h-0 flex-1", children: /* @__PURE__ */ d(
      W,
      {
        agentKey: s.agentKey,
        agentName: s.name,
        contextKey: h.contextKey,
        open: !0,
        appearance: "body",
        sidebarTitle: /* @__PURE__ */ d(
          U,
          {
            value: t,
            options: i,
            ariaLabel: "选择执行角色",
            onValueChange: A
          }
        ),
        height: "100%",
        minHeight: "0",
        lazySession: !0,
        proactiveOpening: s.openingEnabled,
        mobileSessionNavigation: !0,
        uploadBizKey: E,
        uploadBizName: D,
        allowResourceLibrary: !1,
        composerDisabled: p.disabled,
        composerToolbar: p.toolbar,
        composerParameters: p.parameters,
        composerParameterScopeKey: p.parameterScopeKey,
        renderFileLibrary: p.renderFileLibrary,
        prepareInput: p.prepareInput,
        onConversationStateChange: p.onConversationStateChange,
        onUploadedFiles: v,
        assistantApi: h.assistantApi,
        runtimeApi: h.runtimeApi,
        requestScope: f ? y : void 0,
        referenceProviders: m,
        renderMessageActions: (e) => e.role === "assistant" && e.recordID > 0 && !e.running && !e.error ? /* @__PURE__ */ d(
          H,
          {
            teamID: o,
            roleID: s.id,
            roleName: s.name,
            message: e,
            targetAssetID: f?.id || 0,
            targetAssetName: f?.name || "",
            onSaved: n
          },
          e.recordID
        ) : null,
        renderDocumentActions: ({
          messageID: e,
          document: l,
          running: _,
          error: b
        }) => /* @__PURE__ */ d(
          w,
          {
            teamID: o,
            roleID: s.id,
            roleName: s.name,
            messageID: e,
            document: l,
            targetAssetID: f?.id || 0,
            targetAssetName: f?.name || "",
            appearance: "inspector",
            disabled: _ || b || e <= 0,
            disabledLabel: b ? "生成失败的文档不能保存" : "文档生成完成后才能保存",
            onSaved: n
          }
        ),
        renderArtifactActions: ({ messageID: e, artifact: l, placement: _ }) => /* @__PURE__ */ d(
          $,
          {
            teamID: o,
            resetKey: `${e}:${l.id}`,
            defaultName: Y(s.name, l),
            appearance: _ === "preview" ? "inspector" : "media",
            confirmDescription: `保存后将作为当前团队的独立${k(l.kind)}素材。`,
            save: (b) => N({
              teamID: o,
              roleID: s.id,
              messageID: e,
              artifactID: l.id,
              name: b
            })
          }
        )
      },
      `${o}:${s.id}`
    ) })
  ] });
}
function Y(o, i) {
  const a = i.name.trim();
  if (a)
    return a;
  const r = i.label.trim();
  if (r && r !== `素材 ${i.id}`)
    return r;
  const n = i.displayNo > 0 ? `-${i.displayNo}` : "";
  return `${o} ${k(i.kind)}${n}`.trim();
}
function k(o) {
  return o === "image" ? "图片" : o === "video" ? "视频" : o === "audio" ? "音频" : "文件";
}
function H({
  teamID: o,
  roleID: i,
  roleName: a,
  message: r,
  targetAssetID: n,
  targetAssetName: t,
  onSaved: u
}) {
  return r.document ? /* @__PURE__ */ d(
    w,
    {
      teamID: o,
      roleID: i,
      roleName: a,
      messageID: r.recordID,
      document: r.document,
      targetAssetID: n,
      targetAssetName: t,
      appearance: "message",
      disabled: r.hasPendingArtifacts,
      disabledLabel: "文档生成完成后才能保存",
      onSaved: u
    }
  ) : /* @__PURE__ */ d(
    $,
    {
      teamID: o,
      resetKey: `${r.recordID}:${n}`,
      defaultName: t || Z(a, r),
      confirmDescription: n ? "保存后将作为当前素材的新版本。" : "保存后将作为当前团队的素材。",
      disabled: r.hasPendingArtifacts,
      disabledLabel: "回复中的素材仍在生成，完成后才能保存整条回复",
      save: (c) => N({
        teamID: o,
        roleID: i,
        messageID: r.recordID,
        targetAssetID: n,
        name: c
      }),
      onSaved: () => {
        n && u();
      }
    }
  );
}
function w({
  teamID: o,
  roleID: i,
  roleName: a,
  messageID: r,
  document: n,
  targetAssetID: t,
  targetAssetName: u,
  appearance: c,
  disabled: m,
  disabledLabel: v,
  onSaved: y
}) {
  return /* @__PURE__ */ d(
    $,
    {
      teamID: o,
      resetKey: `${r}:document:${n.id}:${t}`,
      defaultName: u || n.title.trim() || `${a.trim() || "智能体"} 文档`,
      appearance: c,
      className: c === "inspector" ? "!size-8" : "",
      confirmDescription: t ? "保存后将作为当前素材的新版本。" : "保存后将作为当前团队的富文本文档资产。",
      disabled: m,
      disabledLabel: v,
      save: (s) => N({
        teamID: o,
        roleID: i,
        messageID: r,
        documentID: n.id,
        targetAssetID: t,
        name: s
      }),
      onSaved: () => {
        t && y();
      }
    }
  );
}
function Z(o, i) {
  const a = i.sessionTitle.trim() || "新会话", r = o.trim() || "智能体", n = V(i.createdAt);
  return [a, r, n].filter(Boolean).join(" · ");
}
function V(o) {
  const i = new Date(o);
  if (Number.isNaN(i.getTime()))
    return "";
  const a = (r) => String(r).padStart(2, "0");
  return `${a(i.getMonth() + 1)}-${a(i.getDate())} ${a(i.getHours())}:${a(i.getMinutes())}`;
}
export {
  ne as WorkbenchDialoguePage
};
