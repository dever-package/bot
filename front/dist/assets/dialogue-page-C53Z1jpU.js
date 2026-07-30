import { j as c, a as D } from "./createLucideIcon-Gw0gLVQ5.js";
import { u as w, c as v, e as K, b as $ } from "./runtime-entry-CkPHMDB1.js";
import { s as _, a as P, M as T } from "./home-shell-BrUTJHpe.js";
import { A as B } from "./agent-chat-BDGfUytj.js";
import { W as k, A as x, S as y } from "./asset-continuation-BJoQOC-x.js";
import { s as L, B as M, a as W } from "./upload-asset-api-JzPGB3fW.js";
import { u as q } from "./asset-reference-provider-B61UjrJy.js";
import { W as E } from "./workbench-picker-CVfWty7c.js";
function J({
  teamID: r,
  roles: o,
  continuationAsset: i,
  onClearContinuation: n
}) {
  const [s, t] = w(0), u = q({ teamID: r }), l = v(
    () => [u],
    [u]
  ), h = K(
    async (e) => {
      await L({ teamID: r, files: e });
    },
    [r]
  ), b = v(
    () => i?.sourceType === "dialogue" ? { target_asset_id: i.id } : void 0,
    [i]
  );
  $(() => {
    t(
      (e) => o.some((d) => d.id === e) ? e : o[0]?.id || 0
    );
  }, [o]), $(() => {
    i?.sourceType === "dialogue" && o.some((e) => e.id === i.sourceID) && t(i.sourceID);
  }, [i, o]);
  const a = o.find((e) => e.id === s), p = v(() => {
    if (!a)
      return null;
    const e = (d) => P(d, { teamID: r, roleID: a.id });
    return {
      contextKey: `body-team:${r}:role:${a.id}`,
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
  }, [a, r]);
  if (!a || !p)
    return /* @__PURE__ */ c(
      k,
      {
        icon: T,
        title: "当前团队没有可对话的执行角色"
      }
    );
  const m = i?.sourceType === "dialogue" && i.sourceID === a.id ? i : null, A = (e) => {
    t(e), i?.sourceType === "dialogue" && i.sourceID !== e && n();
  };
  return /* @__PURE__ */ D("div", { className: "workbench-page workbench-dialogue-page flex h-full min-h-0 flex-col", children: [
    i?.sourceType === "dialogue" ? /* @__PURE__ */ c(
      x,
      {
        asset: i,
        action: "继续对话",
        onCancel: n
      }
    ) : null,
    /* @__PURE__ */ c("div", { className: "min-h-0 flex-1", children: /* @__PURE__ */ c(
      B,
      {
        agentKey: a.agentKey,
        agentName: a.name,
        contextKey: p.contextKey,
        open: !0,
        appearance: "body",
        sidebarTitle: /* @__PURE__ */ c(
          E,
          {
            value: s,
            options: o,
            ariaLabel: "选择执行角色",
            onValueChange: A
          }
        ),
        height: "100%",
        minHeight: "0",
        lazySession: !0,
        proactiveOpening: a.openingEnabled,
        mobileSessionNavigation: !0,
        uploadBizKey: W,
        uploadBizName: M,
        allowResourceLibrary: !1,
        onUploadedFiles: h,
        assistantApi: p.assistantApi,
        runtimeApi: p.runtimeApi,
        requestScope: m ? b : void 0,
        referenceProviders: l,
        renderMessageActions: (e) => e.role === "assistant" && e.recordID > 0 && !e.running && !e.error ? /* @__PURE__ */ c(
          R,
          {
            teamID: r,
            roleID: a.id,
            roleName: a.name,
            message: e,
            targetAssetID: m?.id || 0,
            targetAssetName: m?.name || "",
            onSaved: n
          },
          e.recordID
        ) : null,
        renderDocumentActions: ({
          messageID: e,
          document: d,
          running: g,
          error: f
        }) => /* @__PURE__ */ c(
          S,
          {
            teamID: r,
            roleID: a.id,
            roleName: a.name,
            messageID: e,
            document: d,
            targetAssetID: m?.id || 0,
            targetAssetName: m?.name || "",
            appearance: "inspector",
            disabled: g || f || e <= 0,
            disabledLabel: f ? "生成失败的文档不能保存" : "文档生成完成后才能保存",
            onSaved: n
          }
        ),
        renderArtifactActions: ({ messageID: e, artifact: d, placement: g }) => /* @__PURE__ */ c(
          y,
          {
            teamID: r,
            resetKey: `${e}:${d.id}`,
            defaultName: O(a.name, d),
            appearance: g === "preview" ? "inspector" : "media",
            confirmDescription: `保存后将作为当前团队的独立${N(d.kind)}素材。`,
            save: (f) => _({
              teamID: r,
              roleID: a.id,
              messageID: e,
              artifactID: d.id,
              name: f
            })
          }
        )
      },
      `${r}:${a.id}`
    ) })
  ] });
}
function O(r, o) {
  const i = o.name.trim();
  if (i)
    return i;
  const n = o.label.trim();
  if (n && n !== `素材 ${o.id}`)
    return n;
  const s = o.displayNo > 0 ? `-${o.displayNo}` : "";
  return `${r} ${N(o.kind)}${s}`.trim();
}
function N(r) {
  return r === "image" ? "图片" : r === "video" ? "视频" : r === "audio" ? "音频" : "文件";
}
function R({
  teamID: r,
  roleID: o,
  roleName: i,
  message: n,
  targetAssetID: s,
  targetAssetName: t,
  onSaved: u
}) {
  return n.document ? /* @__PURE__ */ c(
    S,
    {
      teamID: r,
      roleID: o,
      roleName: i,
      messageID: n.recordID,
      document: n.document,
      targetAssetID: s,
      targetAssetName: t,
      appearance: "message",
      disabled: n.hasPendingArtifacts,
      disabledLabel: "文档生成完成后才能保存",
      onSaved: u
    }
  ) : /* @__PURE__ */ c(
    y,
    {
      teamID: r,
      resetKey: `${n.recordID}:${s}`,
      defaultName: t || U(i, n),
      confirmDescription: s ? "保存后将作为当前素材的新版本。" : "保存后将作为当前团队的素材。",
      disabled: n.hasPendingArtifacts,
      disabledLabel: "回复中的素材仍在生成，完成后才能保存整条回复",
      save: (l) => _({
        teamID: r,
        roleID: o,
        messageID: n.recordID,
        targetAssetID: s,
        name: l
      }),
      onSaved: () => {
        s && u();
      }
    }
  );
}
function S({
  teamID: r,
  roleID: o,
  roleName: i,
  messageID: n,
  document: s,
  targetAssetID: t,
  targetAssetName: u,
  appearance: l,
  disabled: h,
  disabledLabel: b,
  onSaved: a
}) {
  return /* @__PURE__ */ c(
    y,
    {
      teamID: r,
      resetKey: `${n}:document:${s.id}:${t}`,
      defaultName: u || s.title.trim() || `${i.trim() || "智能体"} 文档`,
      appearance: l,
      className: l === "inspector" ? "!size-8" : "",
      confirmDescription: t ? "保存后将作为当前素材的新版本。" : "保存后将作为当前团队的富文本文档资产。",
      disabled: h,
      disabledLabel: b,
      save: (p) => _({
        teamID: r,
        roleID: o,
        messageID: n,
        documentID: s.id,
        targetAssetID: t,
        name: p
      }),
      onSaved: () => {
        t && a();
      }
    }
  );
}
function U(r, o) {
  const i = o.sessionTitle.trim() || "新会话", n = r.trim() || "智能体", s = j(o.createdAt);
  return [i, n, s].filter(Boolean).join(" · ");
}
function j(r) {
  const o = new Date(r);
  if (Number.isNaN(o.getTime()))
    return "";
  const i = (n) => String(n).padStart(2, "0");
  return `${i(o.getMonth() + 1)}-${i(o.getDate())} ${i(o.getHours())}:${i(o.getMinutes())}`;
}
export {
  J as WorkbenchDialoguePage
};
