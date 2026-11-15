import { settingNodeDocument } from "./space-setting-model";
import type { StoryboardMaterial } from "./space-storyboard";
import { storyboardSettingItemKey } from "./space-storyboard-derived-specs";
import type { SpaceCanvasEdge, SpaceCanvasNode } from "./types";

export function settingMaterials(source: SpaceCanvasNode): StoryboardMaterial[] {
  return settingNodeDocument(source)?.materials || [];
}

export function storySettingGroup(nodes: SpaceCanvasNode[], sourceId: string) {
  return nodes.find((node) => node.id === sourceId && node.type === "power" && node.outputType === "setting");
}

export function storyboardSettingSource(
  nodes: SpaceCanvasNode[],
  edges: SpaceCanvasEdge[],
  storyboardNodeId: string,
) {
  for (const edge of edges) {
    if ((edge.logicalTo || edge.to) !== storyboardNodeId || edge.executionMode === "manual") continue;
    const setting = storySettingGroup(nodes, edge.logicalFrom || edge.from);
    if (setting) return setting;
  }
}

export function storyboardSettingNodes(
  nodes: SpaceCanvasNode[],
  edges: SpaceCanvasEdge[],
  storyboardNodeId: string,
) {
  const result = new Map<string, SpaceCanvasNode>();
  for (const edge of edges) {
    if (
      (edge.logicalTo || edge.to) !== storyboardNodeId ||
      edge.executionMode === "manual"
    )
      continue;
    const group = storySettingGroup(nodes, edge.logicalFrom || edge.from);
    if (!group) continue;
    for (const node of nodes) {
      const item = node.storyboardItem;
      if (
        item?.sourceNodeId === group.id &&
        ["character", "scene", "prop"].includes(item.itemType)
      ) {
        result.set(storyboardSettingItemKey(item.itemType, item.itemId), node);
      }
    }
  }
  return result;
}

// The generated image retains its original definition in its asset version.
// Comparing that provenance preserves the old image while showing real changes.
export function storySettingUpdateReason(
  node: SpaceCanvasNode,
  nodes: SpaceCanvasNode[],
) {
  const item = node.storyboardItem;
  if (
    !item ||
    !["character", "scene", "prop"].includes(item.itemType) ||
    (!node.asset && !node.resultRef && node.resultOutput == null)
  )
    return "";
  const group = storySettingGroup(nodes, item.sourceNodeId);
  if (!group) return "";
  const entity = settingMaterials(group).find(
    (entry) => entry.id === item.itemId,
  );
  if (!entity) return "此设定已移除；旧形象仍保留，请更新分镜引用";
  const definition = node.asset?.version?.source?.story_setting as
    | Record<string, unknown>
    | undefined;
  if (!definition) return "此形象尚未绑定当前设定，请重新生成";
  if (definition.name !== entity.name || definition.prompt !== entity.prompt) {
    return "设定已更新；当前显示旧形象，重新生成后用于后续制作";
  }
  const document = settingNodeDocument(group)!;
  if (
    definition.visual_mode !== document.visual_mode ||
    definition.aspect_ratio !== document.aspect_ratio ||
    definition.style_prompt_input !== document.style_prompt
  ) {
    return "全片画风或画幅已更新；当前显示旧形象，请重新生成";
  }
  return "";
}
