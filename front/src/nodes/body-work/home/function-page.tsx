import { useCallback, useEffect, useMemo, useState } from "react";
import { Zap } from "lucide-react";
import type { AssetRecord } from "../asset/asset-types";
import { SaveAssetAction } from "../asset/save-asset-action";
import {
  BODY_UPLOAD_BIZ_KEY,
  BODY_UPLOAD_BIZ_NAME,
  saveBodyUploadedAssets,
  type BodyUploadedFile,
} from "../asset/upload-asset-api";
import { StreamPowerRunner } from "../../show/stream-request";
import {
  saveWorkbenchPowerAsset,
  scopedWorkbenchApi,
  workbenchApi,
  type WorkbenchPower,
} from "./workbench-api";
import { AssetContinuationNotice } from "./asset-continuation";
import { WorkbenchPicker } from "./workbench-picker";

export function WorkbenchFunctionPage({
  teamID,
  powers,
  continuationAsset,
  onClearContinuation,
}: {
  teamID: number;
  powers: WorkbenchPower[];
  continuationAsset: AssetRecord | null;
  onClearContinuation: () => void;
}) {
  const [selectedID, setSelectedID] = useState(0);
  const [visitedIDs, setVisitedIDs] = useState<number[]>([]);
  const saveUploadedFiles = useCallback(
    async (files: BodyUploadedFile[]) => {
      await saveBodyUploadedAssets({ teamID, files });
    },
    [teamID],
  );
  useEffect(() => {
    setSelectedID((current) =>
      powers.some((power) => power.id === current)
        ? current
        : powers[0]?.id || 0,
    );
    setVisitedIDs((current) =>
      current.filter((id) => powers.some((power) => power.id === id)),
    );
  }, [powers]);

  useEffect(() => {
    if (
      continuationAsset?.sourceType === "tool" &&
      powers.some((power) => power.id === continuationAsset.sourceID)
    ) {
      setSelectedID(continuationAsset.sourceID);
    }
  }, [continuationAsset, powers]);

  useEffect(() => {
    if (selectedID) {
      setVisitedIDs((current) =>
        current.includes(selectedID) ? current : [...current, selectedID],
      );
    }
  }, [selectedID]);

  const selectedPower = powers.find((power) => power.id === selectedID);
  const scopes = useMemo(
    () =>
      new Map(
        powers.map((power) => [
          power.id,
          {
            team_id: teamID,
            team_power_id: power.id,
            ...(continuationAsset?.sourceType === "tool" &&
            continuationAsset.sourceID === power.id
              ? { target_asset_id: continuationAsset.id }
              : {}),
          },
        ]),
      ),
    [continuationAsset, powers, teamID],
  );

  if (!selectedPower) {
    return <WorkbenchEmpty icon={Zap} title="当前团队没有可用工具" />;
  }

  const selectPower = (nextID: number) => {
    setSelectedID(nextID);
    if (
      continuationAsset?.sourceType === "tool" &&
      continuationAsset.sourceID !== nextID
    ) {
      onClearContinuation();
    }
  };

  return (
    <div className="workbench-page workbench-function-page flex h-full min-h-0 flex-col">
      {continuationAsset?.sourceType === "tool" ? (
        <AssetContinuationNotice
          asset={continuationAsset}
          action="重新生成"
          onCancel={onClearContinuation}
        />
      ) : null}

      <div className="workbench-function-content min-h-0 flex-1 overflow-y-auto md:overflow-hidden">
        {visitedIDs.map((powerID) => {
          const power = powers.find((current) => current.id === powerID);
          if (!power) {
            return null;
          }
          const scope = scopes.get(powerID);
          const powerContinuation =
            continuationAsset?.sourceType === "tool" &&
            continuationAsset.sourceID === power.id
              ? continuationAsset
              : null;
          return (
            <div
              key={powerID}
              className={powerID === selectedID ? "h-full min-h-0" : "hidden"}
            >
              <StreamPowerRunner
                powerKey={power.key}
                appearance="body"
                requestApi={workbenchApi("power_run")}
                paramApi={workbenchApi("power_form")}
                streamApi={scopedWorkbenchApi("power_stream", { teamID })}
                stopApi={scopedWorkbenchApi("power_stop", { teamID })}
                requestScope={scope}
                paramScope={scope}
                height="100%"
                resultTitle="结果"
                formHeader={
                  <WorkbenchPicker
                    value={selectedID}
                    options={powers}
                    ariaLabel="选择工具"
                    onValueChange={selectPower}
                  />
                }
                assetReferenceTeamID={teamID}
                uploadBizKey={BODY_UPLOAD_BIZ_KEY}
                uploadBizName={BODY_UPLOAD_BIZ_NAME}
                allowResourceLibrary={false}
                onUploadedFiles={saveUploadedFiles}
                renderResultActions={({ requestID, successful }) =>
                  successful ? (
                    <SaveToolMaterialButton
                      teamID={teamID}
                      teamPowerID={power.id}
                      powerName={power.name}
                      requestID={requestID}
                      targetAssetID={powerContinuation?.id || 0}
                      targetAssetName={powerContinuation?.name || ""}
                      onSaved={onClearContinuation}
                    />
                  ) : null
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SaveToolMaterialButton({
  teamID,
  teamPowerID,
  powerName,
  requestID,
  targetAssetID,
  targetAssetName,
  onSaved,
}: {
  teamID: number;
  teamPowerID: number;
  powerName: string;
  requestID: string;
  targetAssetID: number;
  targetAssetName: string;
  onSaved: () => void;
}) {
  return (
    <SaveAssetAction
      teamID={teamID}
      resetKey={`${requestID}:${targetAssetID}`}
      defaultName={targetAssetName || `${powerName} 结果`}
      appearance="toolbar"
      confirmDescription={
        targetAssetID
          ? "保存后将作为当前素材的新版本。"
          : "保存后将作为当前团队的素材。"
      }
      save={(name) =>
        saveWorkbenchPowerAsset({
          teamID,
          teamPowerID,
          requestID,
          targetAssetID,
          name,
        })
      }
      onSaved={() => {
        if (targetAssetID) onSaved();
      }}
    />
  );
}

export function WorkbenchEmpty({
  icon: Icon,
  title,
}: {
  icon: typeof Zap;
  title: string;
}) {
  return (
    <div className="flex h-full min-h-[280px] items-center justify-center bg-white px-6 text-center">
      <div>
        <Icon className="mx-auto mb-3 size-6 text-[#8b9691]" />
        <p className="m-0 text-sm font-medium text-[#4f5a55]">{title}</p>
      </div>
    </div>
  );
}
