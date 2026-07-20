import type { ReactNode } from "react";
import { CircleAlert, LoaderCircle, ReceiptText, RefreshCw } from "lucide-react";
import { Button } from "@dever/front-plugin";

export function AccountLoading({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`hb-account-state${compact ? " is-compact" : ""}`}>
      <LoaderCircle className="animate-spin" />
      <span>正在加载账户信息</span>
    </div>
  );
}

export function AccountError({
  message,
  onRetry,
  compact = false,
}: {
  message: string;
  onRetry: () => void;
  compact?: boolean;
}) {
  return (
    <div className={`hb-account-state is-error${compact ? " is-compact" : ""}`}>
      <CircleAlert />
      <strong>加载失败</strong>
      <span>{message}</span>
      <Button variant="outline" onClick={onRetry}>
        <RefreshCw />
        重试
      </Button>
    </div>
  );
}

export function AccountEmpty({ icon, text }: { icon?: ReactNode; text: string }) {
  return (
    <div className="hb-account-empty">
      {icon || <ReceiptText />}
      <span>{text}</span>
    </div>
  );
}
