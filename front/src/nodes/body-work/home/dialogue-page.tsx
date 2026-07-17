import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, MessagesSquare, Save } from "lucide-react";
import { request } from "@dever/front-plugin";
import {
  AgentChatPanel,
  type AgentChatPanelProps,
} from "../../show/agent-chat/index";
import type { AgentChatMessageActionContext } from "../../show/agent-chat/types";
import { AssetDetailDialog } from "../asset/asset-detail-dialog";
import type { AssetRecord } from "../asset/asset-types";
import { useAssetReferenceProvider } from "../asset/asset-reference-provider";
import { isSuccessResponse } from "../shared/api-response";
import { WorkbenchEmpty } from "./function-page";
import {
  scopedWorkbenchApi,
  workbenchApi,
  type WorkbenchRole,
} from "./workbench-api";
import { AssetContinuationNotice } from "./asset-continuation";

export function WorkbenchDialoguePage({
  teamID,
  roles,
  continuationAsset,
  onClearContinuation,
}: {
  teamID: number;
  roles: WorkbenchRole[];
  continuationAsset: AssetRecord | null;
  onClearContinuation: () => void;
}) {
  const [selectedID, setSelectedID] = useState(0);
  const assetReferenceProvider = useAssetReferenceProvider({ teamID });
  const referenceProviders = useMemo(
    () => [assetReferenceProvider],
    [assetReferenceProvider],
  );
  const continuationRequestScope = useMemo(
    () =>
      continuationAsset?.sourceType === "dialogue"
        ? { target_asset_id: continuationAsset.id }
        : undefined,
    [continuationAsset],
  );

  useEffect(() => {
    setSelectedID((current) =>
      roles.some((role) => role.id === current) ? current : roles[0]?.id || 0,
    );
  }, [roles]);

  useEffect(() => {
    if (
      continuationAsset?.sourceType === "dialogue" &&
      roles.some((role) => role.id === continuationAsset.sourceID)
    ) {
      setSelectedID(continuationAsset.sourceID);
    }
  }, [continuationAsset, roles]);

  const role = roles.find((current) => current.id === selectedID);
  const chatConfig = useMemo(() => {
    if (!role) {
      return null;
    }
    const api = (path: string) =>
      scopedWorkbenchApi(path, { teamID, roleID: role.id });
    return {
      contextKey: `body-team:${teamID}:role:${role.id}`,
      assistantApi: {
        session: api("chat_session"),
        sessions: api("chat_sessions"),
        newSession: api("chat_new_session"),
        renameSession: api("chat_rename_session"),
        archiveSession: api("chat_archive_session"),
      },
      runtimeApi: {
        request: api("chat_run"),
        stream: api("chat_stream"),
        stop: api("chat_stop"),
        status: api("chat_status"),
        referencePreview: api("chat_reference_preview"),
        inputConfig: api("chat_input_config"),
        document: api("chat_document"),
        documentStream: api("chat_document_stream"),
      },
    } satisfies Pick<
      AgentChatPanelProps,
      "contextKey" | "assistantApi" | "runtimeApi"
    >;
  }, [role, teamID]);

  if (!role || !chatConfig) {
    return (
      <WorkbenchEmpty icon={MessagesSquare} title="当前团队没有可对话角色" />
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-white">
      <div className="flex h-14 shrink-0 items-center border-b border-[#e2e6e4] px-4 md:px-6">
        <label className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 text-xs font-medium text-[#68716d]">
            角色
          </span>
          <select
            value={selectedID}
            onChange={(event) => {
              const nextID = Number(event.target.value);
              setSelectedID(nextID);
              if (
                continuationAsset?.sourceType === "dialogue" &&
                continuationAsset.sourceID !== nextID
              ) {
                onClearContinuation();
              }
            }}
            className="h-9 min-w-0 max-w-[320px] rounded-md border border-[#d8ddda] bg-white px-3 text-sm font-medium text-[#17201c] outline-none focus:border-[#799184]"
          >
            {roles.map((current) => (
              <option key={current.id} value={current.id}>
                {roleOptionLabel(current)}
              </option>
            ))}
          </select>
        </label>
      </div>
      {continuationAsset?.sourceType === "dialogue" ? (
        <AssetContinuationNotice
          asset={continuationAsset}
          action="继续对话"
          onCancel={onClearContinuation}
        />
      ) : null}
      <div className="min-h-0 flex-1">
        <AgentChatPanel
          key={`${teamID}:${role.id}`}
          agentKey={role.agentKey}
          agentName={role.name}
          contextKey={chatConfig.contextKey}
          open
          height="100%"
          minHeight="0"
          lazySession
          mobileSessionNavigation
          assistantApi={chatConfig.assistantApi}
          runtimeApi={chatConfig.runtimeApi}
          requestScope={
            continuationAsset?.sourceType === "dialogue" &&
            continuationAsset.sourceID === role.id
              ? continuationRequestScope
              : undefined
          }
          referenceProviders={referenceProviders}
          renderMessageActions={(message) =>
            message.role === "assistant" &&
            message.recordID > 0 &&
            !message.running &&
            !message.error ? (
              <SaveDialogueMaterialButton
                key={message.recordID}
                teamID={teamID}
                roleID={role.id}
                message={message}
                targetAssetID={
                  continuationAsset?.sourceType === "dialogue" &&
                  continuationAsset.sourceID === role.id
                    ? continuationAsset.id
                    : 0
                }
                onSaved={onClearContinuation}
              />
            ) : null
          }
        />
      </div>
    </div>
  );
}

function SaveDialogueMaterialButton({
  teamID,
  roleID,
  message,
  targetAssetID,
  onSaved,
}: {
  teamID: number;
  roleID: number;
  message: AgentChatMessageActionContext;
  targetAssetID: number;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [savedAssetID, setSavedAssetID] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    if (savedAssetID) {
      setDetailOpen(true);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const result = await request(workbenchApi("chat_save_asset"), "post", {
        team_id: teamID,
        role_id: roleID,
        message_id: message.recordID,
        target_asset_id: targetAssetID || undefined,
      });
      if (!isSuccessResponse(result)) {
        throw new Error(
          String(result?.message || result?.msg || "保存素材失败"),
        );
      }
      const assetID = Number(result?.data?.asset?.id || 0);
      if (!assetID) {
        throw new Error("保存素材结果为空");
      }
      setSavedAssetID(assetID);
      if (targetAssetID) {
        onSaved();
      }
    } catch (currentError) {
      setError(
        currentError instanceof Error ? currentError.message : "保存素材失败",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="agent-chat-message-action"
        disabled={saving}
        title={error || (savedAssetID ? "查看已保存素材" : "保存为素材")}
        aria-label={savedAssetID ? "查看已保存素材" : "保存为素材"}
        onClick={() => void save()}
      >
        {saving ? (
          <Loader2 className="animate-spin" />
        ) : savedAssetID ? (
          <Check />
        ) : (
          <Save />
        )}
      </button>
      {detailOpen && savedAssetID ? (
        <AssetDetailDialog
          teamID={teamID}
          assetID={savedAssetID}
          onClose={() => setDetailOpen(false)}
        />
      ) : null}
    </>
  );
}

function roleOptionLabel(role: WorkbenchRole) {
  const typeLabel = roleTypeLabels[role.roleType];
  return typeLabel ? `${role.name} · ${typeLabel}` : role.name;
}

const roleTypeLabels: Record<string, string> = {
  chat: "沟通",
  planner: "规划",
  worker: "执行",
  reviewer: "审核",
};
