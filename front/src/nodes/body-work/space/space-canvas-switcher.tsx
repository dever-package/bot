import { useEffect, useState, type DragEvent } from "react";
import { createPortal } from "react-dom";
import {
  Check,
  ChevronDown,
  ChevronUp,
  GripVertical,
  Layers3,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import type { CanvasSummary } from "./types";
import "./space-canvas-switcher.css";

type SpaceCanvasManagerDialogProps = {
  open: boolean;
  canvases: CanvasSummary[];
  deletedCanvases: CanvasSummary[];
  deletedLoading?: boolean;
  activeCanvasId: number;
  disabled?: boolean;
  onClose: () => void;
  onSelect: (canvasId: number) => boolean | Promise<boolean>;
  onCreate: (name: string) => void | Promise<void>;
  onRename: (canvasId: number, name: string) => void | Promise<void>;
  onReorder: (canvasIds: number[]) => void | Promise<void>;
  onDelete: (canvasId: number) => void | Promise<void>;
  onRestore: (canvasId: number) => void | Promise<void>;
};

export function SpaceCanvasManagerDialog({
  open,
  canvases,
  deletedCanvases,
  deletedLoading = false,
  activeCanvasId,
  disabled = false,
  onClose,
  onSelect,
  onCreate,
  onRename,
  onReorder,
  onDelete,
  onRestore,
}: SpaceCanvasManagerDialogProps) {
  const [editingId, setEditingId] = useState(0);
  const [draftName, setDraftName] = useState("");
  const [creating, setCreating] = useState(false);
  const [pendingAction, setPendingAction] = useState("");
  const [actionMenuId, setActionMenuId] = useState(0);
  const [deleteCandidateId, setDeleteCandidateId] = useState(0);
  const [trashOpen, setTrashOpen] = useState(false);
  const [draggedCanvasId, setDraggedCanvasId] = useState(0);
  const [dragTargetId, setDragTargetId] = useState(0);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (actionMenuId || editingId || creating) {
        setActionMenuId(0);
        setEditingId(0);
        setCreating(false);
        return;
      }
      onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [actionMenuId, creating, editingId, onClose, open]);

  useEffect(() => {
    if (open) return;
    setEditingId(0);
    setDraftName("");
    setCreating(false);
    setPendingAction("");
    setActionMenuId(0);
    setDeleteCandidateId(0);
    setTrashOpen(false);
    setDraggedCanvasId(0);
    setDragTargetId(0);
  }, [open]);

  function beginRename(canvas: CanvasSummary) {
    setCreating(false);
    setDeleteCandidateId(0);
    setActionMenuId(0);
    setEditingId(canvas.id);
    setDraftName(canvas.name || "第一幕");
  }

  function beginCreate() {
    setEditingId(0);
    setDeleteCandidateId(0);
    setActionMenuId(0);
    setDraftName("");
    setCreating(true);
  }

  async function submitName() {
    const name = draftName.trim();
    if ((!name && !creating) || pendingAction) return;
    const actionKey = creating ? "create" : `rename:${editingId}`;
    setPendingAction(actionKey);
    try {
      if (creating) await onCreate(name);
      else if (editingId) await onRename(editingId, name);
      setCreating(false);
      setEditingId(0);
      setDraftName("");
    } catch {
      // The page owns request errors; keep the editor open for retry.
    } finally {
      setPendingAction("");
    }
  }

  async function selectCanvas(canvasId: number) {
    if (canvasId === activeCanvasId) {
      onClose();
      return;
    }
    setPendingAction(`select:${canvasId}`);
    try {
      const selected = await onSelect(canvasId);
      if (selected !== false) onClose();
    } finally {
      setPendingAction("");
    }
  }

  async function moveCanvas(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= canvases.length || pendingAction) {
      return;
    }
    const next = canvases.map((canvas) => canvas.id);
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    await submitCanvasOrder(next);
  }

  function beginDrag(event: DragEvent<HTMLButtonElement>, canvasId: number) {
    if (pendingAction || disabled) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(canvasId));
    setDraggedCanvasId(canvasId);
  }

  async function dropCanvas(
    event: DragEvent<HTMLDivElement>,
    targetCanvasId: number,
  ) {
    event.preventDefault();
    const sourceCanvasId =
      draggedCanvasId || Number(event.dataTransfer.getData("text/plain"));
    setDraggedCanvasId(0);
    setDragTargetId(0);
    if (!sourceCanvasId || sourceCanvasId === targetCanvasId) return;
    const next = canvases.map((canvas) => canvas.id);
    const sourceIndex = next.indexOf(sourceCanvasId);
    const targetIndex = next.indexOf(targetCanvasId);
    if (sourceIndex < 0 || targetIndex < 0) return;
    next.splice(sourceIndex, 1);
    next.splice(targetIndex, 0, sourceCanvasId);
    await submitCanvasOrder(next);
  }

  async function submitCanvasOrder(canvasIds: number[]) {
    setPendingAction("reorder");
    setActionMenuId(0);
    try {
      await onReorder(canvasIds);
    } catch {
      // The page owns request errors and keeps the current order on failure.
    } finally {
      setPendingAction("");
    }
  }

  async function confirmDelete(canvasId: number) {
    if (pendingAction) return;
    if (deleteCandidateId !== canvasId) {
      setDeleteCandidateId(canvasId);
      return;
    }
    setPendingAction(`delete:${canvasId}`);
    try {
      await onDelete(canvasId);
      setDeleteCandidateId(0);
      setActionMenuId(0);
    } catch {
      // The page owns request errors; keep the confirmation state for retry.
    } finally {
      setPendingAction("");
    }
  }

  async function restoreCanvas(canvasId: number) {
    if (pendingAction) return;
    setPendingAction(`restore:${canvasId}`);
    try {
      await onRestore(canvasId);
      onClose();
    } catch {
      // The page owns request errors; keep the dialog open for retry.
    } finally {
      setPendingAction("");
    }
  }

  if (!open || typeof document === "undefined") return null;
  const busy = disabled || Boolean(pendingAction);

  return createPortal(
    <div
      className="ws-canvas-manager-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !pendingAction) onClose();
      }}
    >
      <section
        className="ws-canvas-manager-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ws-canvas-manager-title"
      >
        <header className="ws-canvas-manager-header">
          <div>
            <span className="ws-canvas-manager-icon" aria-hidden="true">
              <Layers3 size={18} />
            </span>
            <div>
              <h2 id="ws-canvas-manager-title">画布 {canvases.length}</h2>
            </div>
          </div>
          <div className="ws-canvas-manager-header-actions">
            <button
              type="button"
              className="is-primary"
              disabled={busy || creating}
              onClick={beginCreate}
            >
              <Plus size={15} />
              新建
            </button>
            <button
              type="button"
              aria-label="关闭画布管理"
              disabled={Boolean(pendingAction)}
              onClick={onClose}
            >
              <X size={17} />
            </button>
          </div>
        </header>

        <div className="ws-canvas-manager-body custom-scrollbar">
          {creating ? (
            <div className="ws-canvas-manager-create">
              <CanvasNameEditor
                value={draftName}
                busy={pendingAction === "create"}
                placeholder="留空自动命名"
                allowEmpty
                onChange={setDraftName}
                onSubmit={submitName}
                onCancel={() => setCreating(false)}
              />
            </div>
          ) : null}

          <div className="ws-canvas-manager-list" aria-label="画布列表">
            {canvases.map((canvas, index) => {
              const editing = editingId === canvas.id;
              const active = canvas.id === activeCanvasId;
              const menuOpen = actionMenuId === canvas.id;
              const deleting = deleteCandidateId === canvas.id;
              return (
                <div
                  key={canvas.id}
                  className={`ws-canvas-manager-row ${active ? "is-active" : ""} ${dragTargetId === canvas.id ? "is-drag-target" : ""}`}
                  onDragOver={(event) => {
                    if (!draggedCanvasId) return;
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                    setDragTargetId(canvas.id);
                  }}
                  onDragLeave={() => {
                    if (dragTargetId === canvas.id) setDragTargetId(0);
                  }}
                  onDrop={(event) => void dropCanvas(event, canvas.id)}
                >
                  <button
                    type="button"
                    className="ws-canvas-manager-drag"
                    draggable={!busy}
                    aria-label={`拖动${canvas.name || "画布"}调整顺序`}
                    disabled={busy || canvases.length < 2}
                    onDragStart={(event) => beginDrag(event, canvas.id)}
                    onDragEnd={() => {
                      setDraggedCanvasId(0);
                      setDragTargetId(0);
                    }}
                  >
                    <GripVertical size={15} />
                  </button>

                  {editing ? (
                    <CanvasNameEditor
                      value={draftName}
                      busy={pendingAction === `rename:${canvas.id}`}
                      onChange={setDraftName}
                      onSubmit={submitName}
                      onCancel={() => setEditingId(0)}
                    />
                  ) : (
                    <>
                      <button
                        type="button"
                        className="ws-canvas-manager-select"
                        disabled={busy}
                        onClick={() => void selectCanvas(canvas.id)}
                      >
                        <strong>{canvas.name || "第一幕"}</strong>
                        {active ? (
                          <span>
                            <Check size={13} />
                            当前
                          </span>
                        ) : null}
                      </button>
                      <div className="ws-canvas-manager-more">
                        <button
                          type="button"
                          aria-label={`${canvas.name || "画布"}操作`}
                          aria-expanded={menuOpen}
                          disabled={busy}
                          onClick={() => {
                            setDeleteCandidateId(0);
                            setActionMenuId(menuOpen ? 0 : canvas.id);
                          }}
                        >
                          <MoreHorizontal size={17} />
                        </button>
                        {menuOpen ? (
                          <div className="ws-canvas-manager-menu">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() => void moveCanvas(index, -1)}
                            >
                              <ChevronUp size={14} />
                              上移
                            </button>
                            <button
                              type="button"
                              disabled={index === canvases.length - 1}
                              onClick={() => void moveCanvas(index, 1)}
                            >
                              <ChevronDown size={14} />
                              下移
                            </button>
                            <button
                              type="button"
                              onClick={() => beginRename(canvas)}
                            >
                              <Pencil size={14} />
                              重命名
                            </button>
                            <button
                              type="button"
                              className={deleting ? "is-danger" : ""}
                              disabled={canvases.length <= 1}
                              onClick={() => void confirmDelete(canvas.id)}
                            >
                              {pendingAction === `delete:${canvas.id}` ? (
                                <Loader2 size={14} className="ws-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                              {deleting ? "确认删除" : "删除"}
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          <section className="ws-canvas-manager-trash">
            <button
              type="button"
              className="ws-canvas-manager-trash-toggle"
              aria-expanded={trashOpen}
              onClick={() => setTrashOpen((current) => !current)}
            >
              <span>
                <Trash2 size={15} />
                已删除画布
              </span>
              <span>
                {deletedLoading ? (
                  <Loader2 size={14} className="ws-spin" />
                ) : (
                  deletedCanvases.length
                )}
                <ChevronDown size={15} className={trashOpen ? "is-open" : ""} />
              </span>
            </button>
            {trashOpen ? (
              <div className="ws-canvas-manager-deleted-list">
                {deletedLoading ? (
                  <p>正在加载已删除画布</p>
                ) : deletedCanvases.length === 0 ? (
                  <p>暂无已删除画布</p>
                ) : (
                  deletedCanvases.map((canvas) => (
                    <div
                      key={canvas.id}
                      className="ws-canvas-manager-deleted-row"
                    >
                      <div>
                        <strong>{canvas.name || "未命名画布"}</strong>
                        <span>{formatDeletedAt(canvas)}</span>
                      </div>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void restoreCanvas(canvas.id)}
                      >
                        {pendingAction === `restore:${canvas.id}` ? (
                          <Loader2 size={14} className="ws-spin" />
                        ) : (
                          <RotateCcw size={14} />
                        )}
                        恢复
                      </button>
                    </div>
                  ))
                )}
              </div>
            ) : null}
          </section>
        </div>
      </section>
    </div>,
    document.body,
  );
}

function CanvasNameEditor({
  value,
  busy,
  placeholder,
  allowEmpty = false,
  onChange,
  onSubmit,
  onCancel,
}: {
  value: string;
  busy: boolean;
  placeholder?: string;
  allowEmpty?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void | Promise<void>;
  onCancel: () => void;
}) {
  return (
    <div className="ws-canvas-name-editor">
      <input
        autoFocus
        value={value}
        maxLength={128}
        placeholder={placeholder}
        disabled={busy}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") void onSubmit();
          if (event.key === "Escape") onCancel();
        }}
      />
      <button
        type="button"
        aria-label="保存名称"
        disabled={busy || (!allowEmpty && !value.trim())}
        onClick={() => void onSubmit()}
      >
        {busy ? <Loader2 size={14} className="ws-spin" /> : <Check size={14} />}
      </button>
      <button
        type="button"
        aria-label="取消"
        disabled={busy}
        onClick={onCancel}
      >
        <X size={14} />
      </button>
    </div>
  );
}

function formatDeletedAt(canvas: CanvasSummary) {
  const value = canvas.deletedAt || canvas.updatedAt;
  if (!value) return "删除时间未知";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "删除时间未知";
  return `删除于 ${new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)}`;
}
