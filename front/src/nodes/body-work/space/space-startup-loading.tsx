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
