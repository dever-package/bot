import type { ReactElement } from "react";
import { HoverTip } from "@/page/nodes/show/tooltip";

export function AgentChatTooltip({
  label,
  children,
}: {
  label: string;
  children: ReactElement;
}) {
  return (
    <HoverTip
      content={label}
      sideOffset={8}
      className="z-[2100] max-w-64"
    >
      {children}
    </HoverTip>
  );
}
