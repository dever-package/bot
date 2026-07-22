import { Loader2, Pencil, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { createPortal } from "react-dom";
import { BodyWorkTooltip } from "../shared/body-work-tooltip";
import { renameAsset } from "./asset-api";
import type { AssetRecord } from "./asset-types";

export function AssetRenameDialog({
  teamID,
  asset,
  onClose,
  onRenamed,
}: {
  teamID: number;
  asset: AssetRecord | null;
  onClose: () => void;
  onRenamed: (asset: AssetRecord) => void;
}) {
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!asset) return;
    setName(asset.name);
    setSaving(false);
    setError("");
  }, [asset]);

  useEffect(() => {
    if (!asset) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (!saving) onClose();
    };
    window.addEventListener("keydown", closeOnEscape, true);
    return () => window.removeEventListener("keydown", closeOnEscape, true);
  }, [asset, onClose, saving]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const nextName = name.trim();
    if (!asset || !nextName || saving) return;
    setSaving(true);
    setError("");
    try {
      const renamed = await renameAsset({
        teamID,
        assetID: asset.id,
        name: nextName,
      });
      onRenamed(renamed);
      onClose();
    } catch (currentError) {
      setError(errorText(currentError, "修改资产标题失败"));
    } finally {
      setSaving(false);
    }
  }

  if (!asset || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="wb-asset-rename-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="修改资产标题"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !saving) onClose();
      }}
    >
      <form className="wb-asset-rename-dialog" onSubmit={submit}>
        <header>
          <div>
            <span className="wb-asset-rename-icon">
              <Pencil aria-hidden="true" />
            </span>
            <div>
              <h2>修改资产标题</h2>
              <p>只修改资产库中的显示名称。</p>
            </div>
          </div>
          <BodyWorkTooltip label="关闭">
            <button type="button" disabled={saving} onClick={onClose}>
              <X aria-hidden="true" />
            </button>
          </BodyWorkTooltip>
        </header>
        <label>
          <span>资产标题</span>
          <input
            autoFocus
            value={name}
            maxLength={128}
            disabled={saving}
            placeholder="请输入资产标题"
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        {error ? <p className="wb-asset-rename-error">{error}</p> : null}
        <footer>
          <button type="button" disabled={saving} onClick={onClose}>
            取消
          </button>
          <button
            type="submit"
            className="is-primary"
            disabled={saving || !name.trim()}
          >
            {saving ? <Loader2 className="is-spinning" /> : null}
            {saving ? "保存中" : "保存"}
          </button>
        </footer>
      </form>
    </div>,
    document.body,
  );
}

function errorText(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}
