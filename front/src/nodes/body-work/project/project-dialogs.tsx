import { type FormEvent, useEffect, useState } from "react";
import { Loader2, Trash2, X } from "lucide-react";
import type { ProjectItem, ProjectMetadataInput } from "./project-api";

export function ProjectMetadataDialog({
  mode,
  project,
  onClose,
  onSubmit,
}: {
  mode: "create" | "edit";
  project?: ProjectItem;
  onClose: () => void;
  onSubmit: (input: ProjectMetadataInput) => Promise<void>;
}) {
  const [name, setName] = useState(project?.name || "");
  const [description, setDescription] = useState(project?.description || "");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useDialogEscape(onClose, submitting);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) {
      return;
    }
    const normalizedName = name.trim();
    if (!normalizedName) {
      setMessage("请输入作品标题");
      return;
    }
    if (Array.from(normalizedName).length > 128) {
      setMessage("作品标题不能超过 128 个字符");
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      await onSubmit({
        name: normalizedName,
        description: description.trim(),
      });
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "保存作品失败");
    } finally {
      setSubmitting(false);
    }
  }

  const isEdit = mode === "edit";
  return (
    <div
      className="hb-script-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <form
        className="hb-script-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="hb-script-metadata-title"
        onSubmit={submit}
      >
        <button
          type="button"
          className="hb-script-modal-close"
          onClick={onClose}
          disabled={submitting}
          aria-label="关闭"
        >
          <X size={17} strokeWidth={2.1} />
        </button>

        <header className="hb-script-modal-head">
          <h2 id="hb-script-metadata-title">
            {isEdit ? "编辑作品" : "新建作品"}
          </h2>
          <p>{isEdit ? "修改作品标题与描述。" : "记录灵感，开始新的创作。"}</p>
        </header>

        <div className="hb-script-modal-body">
          <label className="hb-script-field">
            <span>标题</span>
            <input
              value={name}
              maxLength={128}
              onChange={(event) => setName(event.target.value)}
              placeholder="输入作品标题"
              autoFocus
            />
          </label>

          <label className="hb-script-field">
            <span>描述</span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="记录作品的灵感、目标或进展"
              rows={4}
            />
          </label>

          {message ? (
            <div className="hb-script-form-error">{message}</div>
          ) : null}
        </div>

        <footer className="hb-script-modal-actions">
          <button
            type="button"
            className="hb-script-secondary"
            onClick={onClose}
            disabled={submitting}
          >
            取消
          </button>
          <button
            type="submit"
            className="hb-script-primary"
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 size={15} className="hb-script-spin" />
            ) : null}
            {isEdit ? "保存" : "创建"}
          </button>
        </footer>
      </form>
    </div>
  );
}

export function DeleteProjectDialog({
  project,
  onClose,
  onConfirm,
}: {
  project: ProjectItem;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useDialogEscape(onClose, submitting);

  async function confirm() {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    setMessage("");
    try {
      await onConfirm();
    } catch (error: unknown) {
      setMessage(error instanceof Error ? error.message : "删除作品失败");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      className="hb-script-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) {
          onClose();
        }
      }}
    >
      <section
        className="hb-script-modal hb-script-confirm"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="hb-script-delete-title"
      >
        <button
          type="button"
          className="hb-script-modal-close"
          onClick={onClose}
          disabled={submitting}
          aria-label="关闭"
        >
          <X size={17} strokeWidth={2.1} />
        </button>

        <div className="hb-script-confirm-icon">
          <Trash2 size={20} />
        </div>
        <header className="hb-script-modal-head">
          <h2 id="hb-script-delete-title">移入回收站？</h2>
          <p>“{project.name}”将从作品列表移除，你可以稍后在回收站中恢复。</p>
        </header>

        {message ? (
          <div className="hb-script-confirm-error">{message}</div>
        ) : null}

        <footer className="hb-script-modal-actions">
          <button
            type="button"
            className="hb-script-secondary"
            onClick={onClose}
            disabled={submitting}
          >
            取消
          </button>
          <button
            type="button"
            className="hb-script-danger"
            onClick={() => void confirm()}
            disabled={submitting}
          >
            {submitting ? (
              <Loader2 size={15} className="hb-script-spin" />
            ) : null}
            移入回收站
          </button>
        </footer>
      </section>
    </div>
  );
}

function useDialogEscape(onClose: () => void, disabled: boolean) {
  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape" && !disabled) {
        onClose();
      }
    }
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [disabled, onClose]);
}
