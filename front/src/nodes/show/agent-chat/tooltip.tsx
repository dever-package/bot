import type { ReactNode } from "react";
import { HoverTip } from "@/page/nodes/show/tooltip";
import { AGENT_CHAT_CHILD_LAYER_Z_INDEX } from "./layers";
import "./tooltip.css";

export function AgentChatTooltip({
  label,
  triggerClassName = "inline-flex shrink-0",
  children,
}: {
  label: string;
  triggerClassName?: string;
  children: ReactNode;
}) {
  return (
    <HoverTip
      content={label}
      side="top"
      sideOffset={7}
      layerZIndex={AGENT_CHAT_CHILD_LAYER_Z_INDEX}
      className="agent-chat-tooltip-content max-w-64"
    >
      <span className={triggerClassName}>{children}</span>
    </HoverTip>
  );
}
