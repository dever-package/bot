import type { AssetKind, AssetRole, AssetSourceType } from "./asset-types";

export const assetSourceSpecs: ReadonlyArray<{
  key: AssetSourceType;
  label: string;
}> = [
  { key: "project", label: "项目" },
  { key: "tool", label: "工具" },
  { key: "dialogue", label: "对话" },
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
  { key: "text", label: "文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "richtext", label: "富文本" },
  { key: "file", label: "文件" },
];

export function assetSourceLabel(source: string) {
  return optionLabel(assetSourceSpecs, source, "资产");
}

export function assetRoleLabel(role: string) {
  return optionLabel(assetRoleSpecs, role, "素材");
}

export function assetKindLabel(kind: string) {
  return optionLabel(assetKindSpecs, kind, "资产");
}

function optionLabel(
  options: ReadonlyArray<{ key: string; label: string }>,
  key: string,
  fallback: string,
) {
  return options.find((option) => option.key === key)?.label || fallback;
}
