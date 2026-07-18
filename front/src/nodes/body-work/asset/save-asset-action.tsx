import { useEffect, useState, type MouseEvent } from "react";
import { Check, Loader2, Save } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { AgentChatTooltip } from "../../show/agent-chat/tooltip";
import { AssetDetailDialog } from "./asset-detail-dialog";

type SaveAssetActionAppearance =
  | "message"
  | "toolbar"
  | "media"
  | "inspector";

export function SaveAssetAction({
  teamID,
  resetKey,
  save,
  confirmDescription,
  onSaved,
  appearance = "message",
  disabled = false,
  disabledLabel = "当前内容暂时不能保存",
  className = "",
}: {
  teamID: number;
  resetKey: string | number;
  save: () => Promise<number>;
  confirmDescription: string;
  onSaved?: (assetID: number) => void;
  appearance?: SaveAssetActionAppearance;
  disabled?: boolean;
  disabledLabel?: string;
  className?: string;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAssetID, setSavedAssetID] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setConfirmOpen(false);
    setSaving(false);
    setSavedAssetID(0);
    setDetailOpen(false);
    setError("");
  }, [resetKey]);

  const label = disabled
    ? disabledLabel
    : error || (savedAssetID ? "查看已保存资产" : "保存到资产");

  function openSave(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (disabled || saving) return;
    if (savedAssetID) {
      setDetailOpen(true);
      return;
    }
    setError("");
    setConfirmOpen(true);
  }

  async function confirmSave() {
    setSaving(true);
    setError("");
    try {
      const assetID = await save();
      setSavedAssetID(assetID);
      setConfirmOpen(false);
      onSaved?.(assetID);
    } catch (currentError) {
      setError(
        currentError instanceof Error ? currentError.message : "保存资产失败",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <AgentChatTooltip label={label}>
        <button
          type="button"
          className={`${saveActionClassName(appearance)} ${className}`.trim()}
          disabled={disabled || saving}
          aria-label={label}
          onClick={openSave}
        >
          {saving ? (
            <Loader2 className="animate-spin" />
          ) : savedAssetID ? (
            <Check />
          ) : (
            <Save />
          )}
          {appearance === "toolbar" ? (
            <span>{saving ? "保存中" : savedAssetID ? "已保存" : "保存资产"}</span>
          ) : null}
        </button>
      </AgentChatTooltip>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={(open) => {
          if (!saving) setConfirmOpen(open);
        }}
        title="保存到资产"
        desc={
          <div className="space-y-2">
            <p className="m-0">{confirmDescription}</p>
            {error ? <p className="m-0 text-sm text-red-600">{error}</p> : null}
          </div>
        }
        confirmText="保存"
        handleConfirm={() => void confirmSave()}
        isLoading={saving}
      />

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

function saveActionClassName(appearance: SaveAssetActionAppearance) {
  if (appearance === "toolbar") {
    return "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-[#cfd8d3] bg-white px-2.5 text-xs font-medium text-[#365447] transition-colors hover:bg-[#eef3f0] disabled:opacity-60 [&>svg]:size-3.5";
  }
  if (appearance === "media") {
    return "inline-flex size-8 items-center justify-center rounded-md border border-white/70 bg-white/95 text-[#365447] shadow-sm transition hover:bg-white disabled:opacity-60 [&>svg]:size-4";
  }
  if (appearance === "inspector") {
    return "inline-flex size-9 items-center justify-center rounded-md border-0 bg-transparent text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-60 [&>svg]:size-4";
  }
  return "agent-chat-message-action";
}
