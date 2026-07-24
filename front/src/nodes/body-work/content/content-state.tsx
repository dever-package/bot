import { Loader2, RefreshCw } from "lucide-react";

export function BodyContentLoading() {
  return (
    <div className="body-content-state" aria-busy="true">
      <Loader2 className="body-content-spinner" />
    </div>
  );
}

export function BodyContentError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="body-content-state" role="alert">
      <p>{message}</p>
      <button type="button" onClick={onRetry}>
        <RefreshCw size={15} />
        <span>重试</span>
      </button>
    </div>
  );
}
