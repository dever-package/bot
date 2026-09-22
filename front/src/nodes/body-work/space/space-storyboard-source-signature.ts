import type { StoryboardDerivedItem } from "./space-storyboard-derived-specs";
import type { StoryboardDocument } from "./space-storyboard";

// 后端制作提示词还会读取这些设定，不能只用可编辑的镜头摘要判断结果是否过期。
export function storyboardProductionSourceSignatureParts(
  item: StoryboardDerivedItem,
  storyboard: StoryboardDocument,
): string[] {
  if (!["character", "scene", "prop", "shot_image", "shot"].includes(item.type)) {
    return [];
  }
  const materialIds =
    item.type === "shot_image" || item.type === "shot"
      ? storyboard.shots.find((shot) => shot.id === item.id)?.material_ids || []
      : [item.id];
  const materials = materialIds.map((id) => {
    const material = storyboard.materials.find((candidate) => candidate.id === id);
    return material
      ? [material.id, material.type, material.name, material.prompt]
      : null;
  });
  return [
    JSON.stringify([
      storyboard.visual_mode,
      storyboard.style_prompt,
      storyboard.aspect_ratio,
      materials,
    ]),
  ];
}

export function storyboardDerivedSourceSignatureTemplate(
  item: StoryboardDerivedItem,
) {
  return [
    item.prompt,
    null,
    item.paramValues || null,
    item.localOutput || null,
    item.sourceSignatureParts || [],
    item.shotId || "",
    item.shotImageMode || "",
    item.frameRole || "",
    item.frameMediaItems || [],
    item.imageSequenceFrames || [],
    item.speechId || "",
    item.speechIds || [],
    item.characterId || "",
    item.speechKind || "",
    item.speakerMode || "",
    item.startTime ?? null,
    item.shotDuration ?? null,
    item.continuityAnchor || "",
    Boolean(item.optional),
  ];
}
