type PowerOutputLike = {
  key?: string;
  name?: string;
  viewMode?: string;
};

export type PowerPresentationSource = {
  kind?: string;
  outputType?: string;
  output?: PowerOutputLike;
};

export type PowerPresentation = {
  outputType: string;
  outputName: string;
  kindName: string;
  viewMode: string;
};

const OUTPUT_TYPE_FALLBACKS: Record<
  string,
  { name: string; viewMode: string }
> = {
  general: { name: "通用", viewMode: "content" },
  storyboard: { name: "分镜脚本", viewMode: "storyboard" },
  storyboard_grid: { name: "宫格", viewMode: "storyboard_grid" },
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
  power?: PowerPresentationSource,
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
  power?: PowerPresentationSource,
  fallbackKind: unknown = "",
  fallbackOutputType: unknown = "",
) {
  return (
    resolvePowerPresentation(power, fallbackKind, fallbackOutputType)
      .viewMode === "storyboard"
  );
}

export function isVideoComposePowerType(
  power?: PowerPresentationSource,
  fallbackKind: unknown = "",
  fallbackOutputType: unknown = "",
) {
  return (
    resolvePowerPresentation(power, fallbackKind, fallbackOutputType)
      .viewMode === "video_compose"
  );
}

export function isStoryboardGridPowerType(
  power?: PowerPresentationSource,
  fallbackKind: unknown = "",
  fallbackOutputType: unknown = "",
) {
  return (
    resolvePowerPresentation(power, fallbackKind, fallbackOutputType)
      .viewMode === "storyboard_grid"
  );
}

export function isAudioPowerType(
  power?: PowerPresentationSource,
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
