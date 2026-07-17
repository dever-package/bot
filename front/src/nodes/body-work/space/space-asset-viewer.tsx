import type { ReactNode } from "react";
import type { ProjectAsset } from "./types";

export function WorkspaceSurface({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`ws-workspace-overlay ${className || ""}`.trim()}>
      {children}
    </div>
  );
}
export function assetRoleForView(
  asset: ProjectAsset | null | undefined,
): "work" | "material" {
  const role = String(asset?.role || "").toLowerCase();
  return role === "work" ? "work" : "material";
}
