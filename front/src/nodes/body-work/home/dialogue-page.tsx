import { useCallback, useEffect, useMemo, useState } from "react";
import { MessagesSquare } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AgentChatPanel,
  type AgentChatPanelProps,
} from "../../show/agent-chat/index";
import type { AgentChatMessageActionContext } from "../../show/agent-chat/types";
import type { AgentChatArtifact } from "../../show/agent-chat/artifact";
import type { AssetRecord } from "../asset/asset-types";
import { SaveAssetAction } from "../asset/save-asset-action";
import {
  BODY_UPLOAD_BIZ_KEY,
  BODY_UPLOAD_BIZ_NAME,
  saveBodyUploadedAssets,
  type BodyUploadedFile,
} from "../asset/upload-asset-api";
import { useAssetReferenceProvider } from "../asset/asset-reference-provider";
import { WorkbenchEmpty } from "./function-page";
import {
  saveWorkbenchDialogueAsset,
  scopedWorkbenchApi,
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
  const saveUploadedFiles = useCallback(
    async (files: BodyUploadedFile[]) => {
      await saveBodyUploadedAssets({ teamID, files });
    },
    [teamID],
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
      <WorkbenchEmpty
        icon={MessagesSquare}
        title="当前团队没有可对话的执行角色"
      />
    );
  }

  const selectRole = (nextID: number) => {
    setSelectedID(nextID);
    if (
      continuationAsset?.sourceType === "dialogue" &&
      continuationAsset.sourceID !== nextID
    ) {
      onClearContinuation();
    }
  };

  return (
    <div className="workbench-page workbench-dialogue-page flex h-full min-h-0 flex-col">
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
          appearance="body"
          sidebarTitle={
            <div className="workbench-role-picker">
              <Select
                value={String(selectedID)}
                onValueChange={(value) => selectRole(Number(value))}
              >
                <SelectTrigger
                  aria-label="选择执行角色"
                  className="workbench-role-select-trigger"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  align="start"
                  className="workbench-role-select-content"
                >
                  {roles.map((current) => (
                    <SelectItem
                      key={current.id}
                      className="workbench-role-select-item"
                      value={String(current.id)}
                    >
                      {current.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          }
          height="100%"
          minHeight="0"
          lazySession
          mobileSessionNavigation
          uploadBizKey={BODY_UPLOAD_BIZ_KEY}
          uploadBizName={BODY_UPLOAD_BIZ_NAME}
          allowResourceLibrary={false}
          onUploadedFiles={saveUploadedFiles}
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
          renderArtifactActions={({ messageID, artifact, placement }) => (
            <SaveAssetAction
              teamID={teamID}
              resetKey={`${messageID}:${artifact.id}`}
              appearance={placement === "preview" ? "inspector" : "media"}
              confirmDescription={`确认将“${artifactDisplayName(artifact)}”保存为独立${artifactKindLabel(artifact.kind)}素材吗？`}
              save={() =>
                saveWorkbenchDialogueAsset({
                  teamID,
                  roleID: role.id,
                  messageID,
                  artifactID: artifact.id,
                })
              }
            />
          )}
        />
      </div>
    </div>
  );
}

function artifactDisplayName(artifact: AgentChatArtifact) {
  return artifact.name || artifact.label || `素材 ${artifact.id}`;
}

function artifactKindLabel(kind: AgentChatArtifact["kind"]) {
  if (kind === "image") return "图片";
  if (kind === "video") return "视频";
  if (kind === "audio") return "音频";
  return "文件";
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
  return (
    <SaveAssetAction
      teamID={teamID}
      resetKey={`${message.recordID}:${targetAssetID}`}
      confirmDescription={
        targetAssetID
          ? "确认将这条智能体回复保存为当前素材的新版本吗？"
          : "确认将这条智能体回复保存为当前团队的素材吗？"
      }
      disabled={message.hasPendingArtifacts}
      disabledLabel="回复中的素材仍在生成，完成后才能保存整条回复"
      save={() =>
        saveWorkbenchDialogueAsset({
          teamID,
          roleID,
          messageID: message.recordID,
          targetAssetID,
        })
      }
      onSaved={() => {
        if (targetAssetID) onSaved();
      }}
    />
  );
}
