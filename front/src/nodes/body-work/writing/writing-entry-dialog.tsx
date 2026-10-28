import { useRef, useState } from "react";
import { WritingDialog } from "./writing-dialog";
import {
  writingEntitySection,
  writingSections,
  type WritingDocument,
  type WritingSelection,
} from "./writing-document";
import type { WritingNewEntry } from "./use-writing-editor";

export function WritingEntryDialog({
  selection,
  disabled,
  closeDisabled,
  onSave,
  onClose,
}: {
  document: WritingDocument;
  selection: WritingSelection;
  disabled: boolean;
  closeDisabled: boolean;
  onSave: (fields: WritingNewEntry) => Promise<boolean>;
  onClose: () => void;
}) {
  const [fields, setFields] = useState<WritingNewEntry>({
    title: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const submitBusy = useRef(false);
  const entity = writingEntitySection(selection);
  const label = entity
    ? writingSections.find((section) => section.id === entity)!.label
    : "章节";
  return (
    <WritingDialog
      title={`添加${label}`}
      className="writing-entry-dialog"
      closeDisabled={closeDisabled || submitting}
      onClose={onClose}
    >
      <div className="writing-dialog-scroll">
        <form
          className="writing-new-form"
          onSubmit={async (event) => {
            event.preventDefault();
            if (disabled || submitBusy.current) return;
            submitBusy.current = true;
            setSubmitting(true);
            setError("");
            try {
              if (!(await onSave(fields)))
                setError("保存未成功，输入已保留，请重试。");
            } catch (cause) {
              setError(
                cause instanceof Error
                  ? cause.message
                  : "保存失败，输入已保留。",
              );
            } finally {
              submitBusy.current = false;
              setSubmitting(false);
            }
          }}
        >
          <label>
            {label}名称
            <input
              aria-label={`${label}名称`}
              required
              disabled={disabled || submitting}
              value={fields.title}
              onChange={(event) =>
                setFields({ ...fields, title: event.target.value })
              }
            />
          </label>
          <label>
            {entity ? "描述" : "章纲（可稍后填写）"}
            <textarea
              aria-label={`${label}${entity ? "描述" : "章纲"}`}
              rows={5}
              disabled={disabled || submitting}
              value={fields.description}
              onChange={(event) =>
                setFields({ ...fields, description: event.target.value })
              }
            />
          </label>
          <button
            className="is-primary"
            type="submit"
            disabled={disabled || submitting || !fields.title.trim()}
          >
            保存并打开
          </button>
        </form>
        {error && (
          <p className="writing-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </WritingDialog>
  );
}
