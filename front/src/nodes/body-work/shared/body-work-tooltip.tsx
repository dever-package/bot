import type { ReactNode } from "react";
import { HoverTip } from "@/page/nodes/show/tooltip";

const BODY_WORK_TOOLTIP_LAYER_Z_INDEX = 12000;

export function BodyWorkTooltip({
  label,
  side = "top",
  sideOffset = 7,
  className = "",
  children,
}: {
  label?: string;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <HoverTip
      content={label}
      side={side}
      sideOffset={sideOffset}
      layerZIndex={BODY_WORK_TOOLTIP_LAYER_Z_INDEX}
      className={`max-w-80 whitespace-normal break-words ${className}`.trim()}
    >
      {children}
    </HoverTip>
  );
}
