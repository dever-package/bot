export type StoryboardMaterialType = "character" | "scene" | "prop";

export const STORYBOARD_MATERIAL_LABELS: Record<
  StoryboardMaterialType,
  string
> = {
  character: "角色",
  scene: "场景",
  prop: "道具",
};

export type StoryboardMaterial = Record<string, unknown> & {
  id: string;
  type: StoryboardMaterialType;
  name: string;
  prompt: string;
  voice: string;
  reference_keys: string[];
};
