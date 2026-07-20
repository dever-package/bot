import type { OutputTypeOption, PowerOption } from "./types";

type PowerLike = Partial<
  Pick<PowerOption, "kind" | "outputType" | "output">
>;

export type PowerPresentation = {
  outputType: string;
  outputName: string;
  kindName: string;
  viewMode: string;
};

const OUTPUT_TYPE_FALLBACKS: Record<
  string,
  Pick<OutputTypeOption, "name" | "viewMode">
> = {
  general: { name: "通用", viewMode: "content" },
  storyboard: { name: "分镜脚本", viewMode: "storyboard" },
  speech: { name: "语音合成", viewMode: "content" },
  lip_sync: { name: "口型同步", viewMode: "content" },
  video_compose: { name: "视频合成", viewMode: "video_compose" },
};

const POWER_KIND_LABELS: Record<string, string> = {
  text: "文本",
  llm: "文本",
  image: "图片",
  audio: "音频",
  music: "音频",
  video: "视频",
  file: "文件",
  mixed: "图文",
  role: "角色",
  multi: "多模态",
  embeddings: "向量",
  workflow: "工作流",
};

export function resolvePowerPresentation(
  power?: PowerLike,
  fallbackKind: unknown = "",
  fallbackOutputType: unknown = "",
): PowerPresentation {
  const kind = normalizedValue(power?.kind || fallbackKind) || "text";
  const outputType =
    normalizedValue(fallbackOutputType || power?.outputType) || "general";
  const fallback = OUTPUT_TYPE_FALLBACKS[outputType];
  const output =
    normalizedValue(power?.output?.key) === outputType
      ? power?.output
      : undefined;
  const showsOutputType =
    kind === "text" || kind === "llm" || outputType !== "general";

  return {
    outputType,
    outputName: showsOutputType
      ? String(output?.name || "").trim() || fallback?.name || outputType
      : "",
    kindName: powerKindLabel(kind),
    viewMode:
      normalizedValue(output?.viewMode) || fallback?.viewMode || "content",
  };
}

export function isStoryboardPowerType(
  power?: PowerLike,
  fallbackKind: unknown = "",
  fallbackOutputType: unknown = "",
) {
  return (
    resolvePowerPresentation(power, fallbackKind, fallbackOutputType)
      .viewMode === "storyboard"
  );
}

export function isVideoComposePowerType(
  power?: PowerLike,
  fallbackKind: unknown = "",
  fallbackOutputType: unknown = "",
) {
  return (
    resolvePowerPresentation(power, fallbackKind, fallbackOutputType)
      .viewMode === "video_compose"
  );
}

export function isAudioPowerType(
  power?: PowerLike,
  fallbackKind: unknown = "",
) {
  const kind = normalizedValue(power?.kind || fallbackKind);
  return kind === "audio" || kind === "music";
}

export function powerKindLabel(kind: unknown) {
  const normalizedKind = normalizedValue(kind) || "text";
  return POWER_KIND_LABELS[normalizedKind] || "文本";
}

function normalizedValue(value: unknown) {
  return String(value || "").trim().toLowerCase();
}
