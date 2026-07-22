import type { AssetKind, AssetRole, AssetSourceType } from "./asset-types";

export type AssetSourceLabels = Partial<Record<AssetSourceType, string>> & {
  fallback?: string;
};

export const assetSourceSpecs: ReadonlyArray<{
  key: AssetSourceType;
  label: string;
}> = [
  { key: "project", label: "创作" },
  { key: "tool", label: "工具" },
  { key: "dialogue", label: "对话" },
  { key: "upload", label: "上传" },
];

export const assetRoleSpecs: ReadonlyArray<{
  key: AssetRole;
  label: string;
}> = [
  { key: "work", label: "作品" },
  { key: "material", label: "素材" },
];

export const assetKindSpecs: ReadonlyArray<{
  key: AssetKind;
  label: string;
}> = [
  { key: "collection", label: "集合" },
  { key: "text", label: "文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "richtext", label: "富文本" },
  { key: "file", label: "文件" },
];

export function assetSourceLabel(
  source: string,
  labels: AssetSourceLabels = {},
) {
  const fallback = labels.fallback || "资产";
  const defaultLabel = optionLabel(assetSourceSpecs, source, fallback);
  return labels[source as AssetSourceType] || defaultLabel;
}

export function assetRoleLabel(role: string) {
  return optionLabel(assetRoleSpecs, role, "素材");
}

export function assetKindLabel(kind: string) {
  return optionLabel(assetKindSpecs, kind, "资产");
}

export function assetKindsAccept(kinds: readonly AssetKind[]) {
  if (
    kinds.length === 0 ||
    kinds.some((kind) => ["text", "richtext", "file"].includes(kind))
  ) {
    return undefined;
  }
  const mimeByKind: Partial<Record<AssetKind, string>> = {
    image: "image/*",
    audio: "audio/*",
    video: "video/*",
  };
  const accepts = kinds
    .map((kind) => mimeByKind[kind])
    .filter((accept): accept is string => Boolean(accept));
  return accepts.length > 0
    ? Array.from(new Set(accepts)).join(",")
    : undefined;
}

function optionLabel(
  options: ReadonlyArray<{ key: string; label: string }>,
  key: string,
  fallback: string,
) {
  return options.find((option) => option.key === key)?.label || fallback;
}
