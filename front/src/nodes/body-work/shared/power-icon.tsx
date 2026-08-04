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
import { resolveConfiguredLucideIcon } from "./configured-icon";
import {
  resolvePowerPresentation,
  type PowerPresentationSource,
} from "./power-presentation";

export type PowerIconSource = PowerPresentationSource & {
  icon?: string;
};

export function PowerIcon({
  power,
  kind,
  outputType,
  size,
  className,
}: {
  power?: PowerIconSource;
  kind?: string;
  outputType?: string;
  size: number;
  className?: string;
}) {
  const presentation = resolvePowerPresentation(power, kind, outputType);
  const FallbackIcon =
    powerOutputIcon(presentation.outputType) ||
    powerKindIcon(power?.kind || kind || "");
  const Icon = resolveConfiguredLucideIcon(power?.icon, FallbackIcon);

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
  const Icon = resolveConfiguredLucideIcon(name, Settings2);

  return <Icon size={size} className={className} />;
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
