import { RefreshCw } from "lucide-react";

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
