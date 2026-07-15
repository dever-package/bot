import * as LucideIcons from "lucide-react";
import {
  Brain,
  Clapperboard,
  FileText,
  Image as ImageIcon,
  Music,
  Settings2,
  Sparkles,
  Type,
  UserCheck,
  Video,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { getCompatModule } from "@dever/front-plugin";
import { resolvePowerPresentation } from "./space-power-presentation";
import type { PowerOption } from "./types";

export function PowerIcon({
  power,
  kind,
  outputType,
  size,
  className,
}: {
  power?: PowerOption;
  kind?: string;
  outputType?: string;
  size: number;
  className?: string;
}) {
  const presentation = resolvePowerPresentation(power, kind, outputType);
  const FallbackIcon =
    powerOutputIcon(presentation.outputType) ||
    powerKindIcon(power?.kind || kind || "");
  const Icon = resolveConfiguredIcon(power?.icon, FallbackIcon);

  return <Icon size={size} className={className} />;
}

function powerOutputIcon(outputType?: string): LucideIcon | null {
  const normalized = String(outputType || "").trim().toLowerCase();
  if (normalized === "storyboard") {
    return Clapperboard;
  }
  return null;
}

export function PowerParamIcon({
  name,
  size,
  className,
}: {
  name?: string;
  size: number;
  className?: string;
}) {
  const Icon = resolveConfiguredIcon(name, Settings2);

  return <Icon size={size} className={className} />;
}

function resolveConfiguredIcon(
  iconName: string | undefined,
  FallbackIcon: LucideIcon,
) {
  return (
    resolveSharedLucideIcon(normalizePowerIconName(iconName)) || FallbackIcon
  );
}

function resolveSharedLucideIcon(iconName?: string): LucideIcon | null {
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

function resolveLocalLucideIcon(iconName?: string): LucideIcon | null {
  if (!iconName) {
    return null;
  }
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

function normalizePowerIconName(icon?: string) {
  const text = String(icon || "").trim();
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

function powerKindIcon(kind: string): LucideIcon {
  const normalizedKind = String(kind || "").toLowerCase();
  if (normalizedKind === "text" || normalizedKind === "llm") return Type;
  if (normalizedKind === "image") return ImageIcon;
  if (normalizedKind === "video") return Video;
  if (normalizedKind === "audio" || normalizedKind === "music") return Music;
  if (normalizedKind === "file") return FileText;
  if (normalizedKind === "workflow") return Workflow;
  if (normalizedKind === "role" || normalizedKind === "agent") return UserCheck;
  if (normalizedKind === "multi") return Sparkles;
  return Brain;
}
