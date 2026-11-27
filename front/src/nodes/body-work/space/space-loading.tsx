import { Component, Suspense, useEffect, useState, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

export class NodeDetailLoadBoundary extends Component<{
  children: ReactNode;
  onError: () => void;
}, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onError();
  }

  render() {
    if (this.state.failed) return null;
    return (
      <Suspense fallback={<CanvasModuleLoading label="正在加载节点详情" overlay />}>
        {this.props.children}
      </Suspense>
    );
  }
}

export function CanvasModuleLoading({
  label,
  overlay = false,
  compact = false,
  delay = 160,
}: {
  label: string;
  overlay?: boolean;
  compact?: boolean;
  delay?: number;
}) {
  const [visible, setVisible] = useState(delay <= 0);

  useEffect(() => {
    if (delay <= 0) {
      setVisible(true);
      return;
    }
    const timer = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className={`ws-module-loading ${overlay ? "is-overlay" : ""} ${compact ? "is-compact" : ""}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 size={20} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
