import { MessageSquare } from "lucide-react";
import { SpaceTooltip } from "./space-tooltip";
import "./space-assistant-launcher.css";

export function SpaceAssistantLauncher({
  assistantName,
  onIntent,
  onOpen,
}: {
  assistantName: string;
  onIntent: () => void;
  onOpen: () => void;
}) {
  const label = `打开${assistantName || "画布助手"}`;

  return (
    <div className="ws-assistant-launcher" data-assistant-layer="true">
      <SpaceTooltip label={label} side="left">
        <button
          type="button"
          className="ws-assistant-launcher-button"
          aria-label={label}
          aria-controls="workspace-canvas-assistant"
          aria-expanded={false}
          onPointerEnter={onIntent}
          onFocus={onIntent}
          onClick={onOpen}
        >
          <MessageSquare size={20} aria-hidden="true" />
        </button>
      </SpaceTooltip>
    </div>
  );
}
