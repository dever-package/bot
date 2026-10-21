import { useRef, useState, type ReactNode } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@dever/front-plugin";
import { X } from "lucide-react";
import { DETAIL_DIALOG_CHILD_LAYER_Z_INDEX } from "../shared/detail-dialog";
import type { WritingInspirationEdit } from "./use-writing-preview";
import type { WritingInspiration } from "./writing-document";
import "./writing-editor.css";

/** 只组合系统弹窗；焦点、遮罩、Escape 和嵌套层级交给宿主。 */
export function WritingDialog({
  title,
  titleStatus,
  children,
  onClose,
  closeDisabled = false,
  className = "",
  described = false,
}: {
  title: string;
  titleStatus?: ReactNode;
  children: ReactNode;
  onClose: () => void | Promise<void>;
  closeDisabled?: boolean;
  className?: string;
  described?: boolean;
}) {
  // 命令式打开没有 DialogTrigger，使用系统关闭钩子归还触发点焦点。
  const [returnFocus] = useState(() =>
    typeof document !== "undefined" &&
    document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null,
  );
  const closingRef = useRef(false);
  const [closing, setClosing] = useState(false);
  const requestClose = async () => {
    if (closeDisabled || closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    try {
      await onClose();
    } finally {
      closingRef.current = false;
      setClosing(false);
    }
  };
  return (
    <Dialog open onOpenChange={(open: boolean) => !open && void requestClose()}>
      <DialogContent
        className={`writing-editor writing-dialog nodrag nopan nowheel ${className}`}
        layerZIndex={DETAIL_DIALOG_CHILD_LAYER_Z_INDEX}
        showCloseButton={false}
        {...(described ? {} : { "aria-describedby": undefined })}
        onCloseAutoFocus={(event: Event) => {
          if (returnFocus?.isConnected) {
            event.preventDefault();
            returnFocus.focus({ preventScroll: true });
          }
        }}
      >
        <DialogHeader className="writing-dialog-header">
          <DialogTitle>{title}</DialogTitle>
          {titleStatus && <div className="writing-dialog-title-status">{titleStatus}</div>}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={`关闭${title}`}
            disabled={closeDisabled || closing}
            onClick={() => void requestClose()}
          >
            <X size={18} />
          </Button>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}

/** 更新和删除共用系统确认布局；命令失败时由调用方保留弹窗。 */
export function WritingConfirmDialog({
  title,
  description,
  confirmLabel,
  pending,
  disabled,
  error,
  onConfirm,
  onClose,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  pending: boolean;
  disabled?: boolean;
  error?: string;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}) {
  return (
    <WritingDialog
      title={title}
      closeDisabled={pending}
      onClose={onClose}
      className="writing-confirm-dialog"
      described
    >
      <div className="writing-dialog-scroll">
        <DialogDescription>{description}</DialogDescription>
        {error && (
          <p role="alert" className="writing-inspiration-form-error">
            {error}
          </p>
        )}
      </div>
      <DialogFooter className="writing-confirm-footer">
        <Button
          type="button"
          variant="outline"
          disabled={pending}
          onClick={onClose}
        >
          取消
        </Button>
        <Button
          type="button"
          disabled={pending || disabled}
          onClick={() => void onConfirm()}
        >
          {pending ? "正在提交…" : confirmLabel}
        </Button>
      </DialogFooter>
    </WritingDialog>
  );
}

/** 只操作当前候选；提交失败保留输入，取消不触发作品写入。 */
export function WritingInspirationDialog({
  edit,
  disabled,
  onSave,
  onRegenerate,
  onClose,
}: {
  edit: WritingInspirationEdit;
  disabled: boolean;
  onSave: (
    fields: Pick<WritingInspiration, "title" | "content">,
  ) => Promise<void>;
  onRegenerate: () => Promise<void>;
  onClose: () => void;
}) {
  const [fields, setFields] = useState(() => ({
    title: edit.inspiration.title,
    content: edit.inspiration.content,
  }));
  const [error, setError] = useState("");
  const [operation, setOperation] = useState<"save" | "regenerate" | null>(
    null,
  );
  const submitting = operation !== null;
  const submitBusy = useRef(false);
  const submit = async (nextOperation: "save" | "regenerate") => {
    if (disabled || submitBusy.current) return;
    submitBusy.current = true;
    setOperation(nextOperation);
    setError("");
    try {
      if (nextOperation === "save") await onSave(fields);
      else await onRegenerate();
      onClose();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : nextOperation === "save"
            ? "保存灵感失败"
            : "重新生成灵感失败",
      );
    } finally {
      submitBusy.current = false;
      setOperation(null);
    }
  };
  return (
    <WritingDialog
      title="编辑灵感"
      className="writing-inspiration-dialog"
      closeDisabled={submitting}
      onClose={onClose}
    >
      <form
        className="writing-dialog-scroll writing-inspiration-form"
        onSubmit={(event) => {
          event.preventDefault();
          void submit("save");
        }}
      >
        <label>
          标题
          <input
            aria-label="灵感标题"
            required
            disabled={submitting}
            value={fields.title}
            onChange={(event) =>
              setFields({ ...fields, title: event.target.value })
            }
          />
        </label>
        <label>
          内容
          <textarea
            aria-label="灵感内容"
            rows={7}
            required
            disabled={submitting}
            value={fields.content}
            onChange={(event) =>
              setFields({ ...fields, content: event.target.value })
            }
          />
        </label>
        {(error || (disabled && !submitting)) && (
          <p className="writing-inspiration-form-error" role="alert">
            {error || "当前暂不可保存，输入内容已保留。"}
          </p>
        )}
        <div className="writing-actions">
          <button type="button" disabled={submitting} onClick={onClose}>
            取消
          </button>
          <button
            type="button"
            disabled={disabled || submitting}
            onClick={() => void submit("regenerate")}
          >
            {operation === "regenerate" ? "重新生成中…" : "重新生成"}
          </button>
          <button
            className="is-primary"
            type="submit"
            disabled={
              disabled ||
              submitting ||
              !fields.title.trim() ||
              !fields.content.trim()
            }
          >
            {operation === "save" ? "保存中…" : "保存"}
          </button>
        </div>
      </form>
    </WritingDialog>
  );
}
