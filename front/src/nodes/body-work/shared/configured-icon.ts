import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { createElement } from "react";
import { getCompatModule } from "@dever/front-plugin";

export function ConfiguredMenuIcon({
  iconName,
  iconImage,
  fallbackIcon,
  className,
  strokeWidth,
}: {
  iconName?: string;
  iconImage?: string;
  fallbackIcon: LucideIcon;
  className?: string;
  strokeWidth?: number;
}) {
  const uploadedIcon = String(iconImage || "").trim();
  if (uploadedIcon) {
    return createElement("img", {
      src: uploadedIcon,
      alt: "",
      "aria-hidden": true,
      draggable: false,
      className,
    });
  }

  const Icon = resolveConfiguredLucideIcon(iconName, fallbackIcon);
  return createElement(Icon, { className, strokeWidth });
}

export function resolveConfiguredLucideIcon(
  iconName: string | undefined,
  FallbackIcon: LucideIcon,
) {
  const normalizedName = normalizeLucideIconName(iconName);
  return resolveSharedLucideIcon(normalizedName) || FallbackIcon;
}

function resolveSharedLucideIcon(iconName: string): LucideIcon | null {
  if (!iconName) {
    return null;
  }
  try {
    const resolver = getCompatModule("@/lib/icon").resolveLucideIcon as
      | ((name?: string) => LucideIcon | null)
      | undefined;
    const Icon = resolver?.(iconName);
    if (Icon) {
      return Icon;
    }
  } catch {
    // Older host sessions may not expose the shared icon resolver.
  }
  return resolveLocalLucideIcon(iconName);
}

function resolveLocalLucideIcon(iconName: string): LucideIcon | null {
  const exportName = iconName
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  return (
    (LucideIcons as unknown as Record<string, LucideIcon | undefined>)[
      exportName
    ] || null
  );
}

function normalizeLucideIconName(iconName?: string) {
  const text = String(iconName || "").trim();
  if (!text || text === "-") {
    return "";
  }
  return text
    .replace(/^i-lucide-/i, "")
    .replace(/^lucide[:/\\-]/i, "")
    .replace(/Icon$/i, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "")
    .replace(/--+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}
