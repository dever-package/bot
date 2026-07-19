import { useEffect, useId, useRef, useState, type MouseEvent } from "react";
import { Check, Loader2, Save } from "lucide-react";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Input } from "@/components/ui/input";
import { AgentChatTooltip } from "../../show/agent-chat/tooltip";
import { AssetDetailDialog } from "./asset-detail-dialog";

type SaveAssetActionAppearance =
  | "message"
  | "toolbar"
  | "media"
  | "inspector";

const MAX_ASSET_NAME_LENGTH = 128;

export function SaveAssetAction({
  teamID,
  resetKey,
  defaultName,
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
  defaultName: string;
  save: (name: string) => Promise<number>;
  confirmDescription: string;
  onSaved?: (assetID: number) => void;
  appearance?: SaveAssetActionAppearance;
  disabled?: boolean;
  disabledLabel?: string;
  className?: string;
}) {
  const nameInputID = useId();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedAssetID, setSavedAssetID] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [assetName, setAssetName] = useState(() =>
    normalizeAssetName(defaultName),
  );
  const [error, setError] = useState("");
  const defaultNameRef = useRef(defaultName);
  defaultNameRef.current = defaultName;

  useEffect(() => {
    setConfirmOpen(false);
    setSaving(false);
    setSavedAssetID(0);
    setDetailOpen(false);
    setAssetName(normalizeAssetName(defaultNameRef.current));
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
    setAssetName(normalizeAssetName(defaultNameRef.current));
    setError("");
    setConfirmOpen(true);
  }

  async function confirmSave() {
    const name = normalizeAssetName(assetName);
    if (!name) {
      setError("请输入资产标题");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const assetID = await save(name);
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
        desc={confirmDescription}
        confirmText="保存"
        disabled={!assetName.trim()}
        handleConfirm={() => void confirmSave()}
        isLoading={saving}
      >
        <div className="space-y-2">
          <label
            htmlFor={nameInputID}
            className="text-sm font-medium text-foreground"
          >
            资产标题
          </label>
          <Input
            id={nameInputID}
            value={assetName}
            maxLength={MAX_ASSET_NAME_LENGTH}
            placeholder="请输入资产标题"
            autoFocus
            onChange={(event) => {
              setAssetName(event.target.value);
              if (error) setError("");
            }}
          />
          {error ? <p className="m-0 text-sm text-red-600">{error}</p> : null}
        </div>
      </ConfirmDialog>

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

function normalizeAssetName(value: string) {
  return String(value || "").trim().slice(0, MAX_ASSET_NAME_LENGTH);
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
