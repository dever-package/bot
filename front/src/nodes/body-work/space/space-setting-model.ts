import { decodeStoryboardMaterial, parseCanvasDocument, type StoryboardMaterial, type StoryboardVisualMode } from "./space-storyboard";
import type { SpaceCanvasNode } from "./types";

export type SettingDocument = {
  type: "setting";
  version: 1;
  title: string;
  visual_mode: StoryboardVisualMode;
  style_prompt: string;
  aspect_ratio: string;
  materials: StoryboardMaterial[];
};

export function parseSettingOutput(value: unknown): SettingDocument | null {
  return parseCanvasDocument(value, (row) => {
    if (row.type !== "setting" || row.version !== 1 || !Array.isArray(row.materials)) return null;
    const materials = row.materials.map(decodeStoryboardMaterial);
    if (materials.some((item) => !item)) return null;
    return { ...row, materials } as SettingDocument;
  });
}

export function settingNodeDocument(node: SpaceCanvasNode) {
  return parseSettingOutput([node.asset?.version?.content, node.resultOutput]);
}
