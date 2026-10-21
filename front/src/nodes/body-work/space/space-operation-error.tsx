import { X } from "lucide-react";

// 错误属于当前操作界面，离开画布后不保留，也不写入全局通知。
export function SpaceOperationError({
  message,
  onDismiss,
  floating = false,
}: {
  message: string;
  onDismiss: () => void;
  floating?: boolean;
}) {
  if (!message) return null;
  return (
    <div
      className={`ws-operation-error nodrag nowheel${floating ? " is-floating" : ""}`}
      role="alert"
      onPointerDown={(event) => event.stopPropagation()}
    >
      <span>{message}</span>
      <button type="button" aria-label="关闭错误提示" onClick={onDismiss}>
        <X size={14} />
      </button>
    </div>
  );
}
