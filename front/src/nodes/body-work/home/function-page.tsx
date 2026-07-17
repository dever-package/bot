import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Save, Zap } from "lucide-react";
import { request } from "@dever/front-plugin";
import { AssetDetailDialog } from "../asset/asset-detail-dialog";
import type { AssetRecord } from "../asset/asset-types";
import { StreamPowerRunner } from "../../show/stream-request";
import { isSuccessResponse } from "../shared/api-response";
import {
  scopedWorkbenchApi,
  workbenchApi,
  type WorkbenchPower,
} from "./workbench-api";
import { AssetContinuationNotice } from "./asset-continuation";

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

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#f7f8f8]">
      <div className="flex h-14 shrink-0 items-center border-b border-[#e2e6e4] bg-white px-4 md:px-6">
        <label className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 text-xs font-medium text-[#68716d]">
            工具
          </span>
          <select
            value={selectedID}
            onChange={(event) => {
              const nextID = Number(event.target.value);
              setSelectedID(nextID);
              if (
                continuationAsset?.sourceType === "tool" &&
                continuationAsset.sourceID !== nextID
              ) {
                onClearContinuation();
              }
            }}
            className="h-9 min-w-0 max-w-[320px] rounded-md border border-[#d8ddda] bg-white px-3 text-sm font-medium text-[#17201c] outline-none focus:border-[#799184]"
          >
            {powers.map((power) => (
              <option key={power.id} value={power.id}>
                {power.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      {continuationAsset?.sourceType === "tool" ? (
        <AssetContinuationNotice
          asset={continuationAsset}
          action="重新生成"
          onCancel={onClearContinuation}
        />
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto p-3 md:overflow-hidden md:p-5">
        {visitedIDs.map((powerID) => {
          const power = powers.find((current) => current.id === powerID);
          if (!power) {
            return null;
          }
          const scope = scopes.get(powerID);
          return (
            <div
              key={powerID}
              className={powerID === selectedID ? "h-full min-h-0" : "hidden"}
            >
              <StreamPowerRunner
                powerKey={power.key}
                requestApi={workbenchApi("power_run")}
                paramApi={workbenchApi("power_form")}
                streamApi={scopedWorkbenchApi("power_stream", { teamID })}
                stopApi={scopedWorkbenchApi("power_stop", { teamID })}
                requestScope={scope}
                paramScope={scope}
                height="100%"
                resultTitle="运行结果"
                assetReferenceTeamID={teamID}
                renderResultActions={({ requestID, successful }) =>
                  successful ? (
                    <SaveToolMaterialButton
                      teamID={teamID}
                      teamPowerID={power.id}
                      requestID={requestID}
                      targetAssetID={
                        continuationAsset?.sourceType === "tool" &&
                        continuationAsset.sourceID === power.id
                          ? continuationAsset.id
                          : 0
                      }
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
  requestID,
  targetAssetID,
  onSaved,
}: {
  teamID: number;
  teamPowerID: number;
  requestID: string;
  targetAssetID: number;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [savedAssetID, setSavedAssetID] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setSaving(false);
    setSavedAssetID(0);
    setDetailOpen(false);
    setError("");
  }, [requestID]);

  async function save() {
    if (savedAssetID) {
      setDetailOpen(true);
      return;
    }
    setSaving(true);
    setError("");
    try {
      const result = await request(workbenchApi("power_save_asset"), "post", {
        team_id: teamID,
        team_power_id: teamPowerID,
        request_id: requestID,
        target_asset_id: targetAssetID || undefined,
      });
      if (!isSuccessResponse(result)) {
        throw new Error(String(result?.message || result?.msg || "保存素材失败"));
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
      setError(currentError instanceof Error ? currentError.message : "保存素材失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-[#cfd8d3] bg-white px-2.5 text-xs font-medium text-[#365447] hover:bg-[#eef3f0] disabled:opacity-60"
        disabled={saving}
        title={error || (savedAssetID ? "查看已保存素材" : "保存为素材")}
        onClick={() => void save()}
      >
        {saving ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : savedAssetID ? (
          <Check className="size-3.5" />
        ) : (
          <Save className="size-3.5" />
        )}
        {saving ? "保存中" : savedAssetID ? "已保存" : "保存素材"}
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
