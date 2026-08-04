import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useTheme } from "@dever/front-plugin";
import "./space-entry.css";

export function CanvasStartupLoading() {
  const { resolvedTheme } = useTheme();

  return (
    <main
      className={`ws-startup-loading is-${resolvedTheme}`}
      role="status"
      aria-live="polite"
    >
      <div className="ws-startup-loading-content">
        <span className="ws-startup-loading-spinner" aria-hidden="true" />
        <strong>正在加载创作空间</strong>
        <span>正在准备画布与项目内容</span>
      </div>
    </main>
  );
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
