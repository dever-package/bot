import { isWritingPowerType } from "../shared/power-presentation";
import { writingSnapshotFromNode } from "../writing/writing-document";
import { createLocalNode, nextCanvasNodeNo } from "./space-model";
import { reconcileCanvasGroupEdges } from "./space-group-model";
import { createDerivedNode, ensureDerivedGroup, firstAvailablePower, isMatchingDerivedNode, mergeExistingDerivedNode, stableToken } from "./space-storyboard-derived-groups";
import { STORYBOARD_DERIVED_GROUP_SPECS } from "./space-storyboard-derived-specs";
import { planStoryboardDerivedGroupLayout, storyboardDerivedGroupMemberLayout } from "./space-storyboard-derived-layout";
import { settingNodeDocument } from "./space-setting-model";
import type { AssetCate, PowerOption, SpaceCanvasNode, SpaceCanvasState } from "./types";

export function storySettingDocument(node: SpaceCanvasNode) {
  return isWritingPowerType(node.power, node.kind, node.outputType)
    ? writingSnapshotFromNode(node, node.resultOutput)?.document || null : null;
}

export function settingForStory(canvas: SpaceCanvasState, storyId: string) {
  const edge = canvas.edges.find((edge) => (edge.logicalFrom || edge.from) === storyId &&
    canvas.nodes.some((node) => node.id === (edge.logicalTo || edge.to) && node.outputType === "setting"));
  return edge ? canvas.nodes.find((node) => node.id === (edge.logicalTo || edge.to)) : undefined;
}

// Story chapters create a regular setting power and reference the saved story.
export function syncStorySettingGroup(input: { canvas: SpaceCanvasState; storyNodeId: string; assetCate: AssetCate; powers: PowerOption[] }): SpaceCanvasState {
  if (settingForStory(input.canvas, input.storyNodeId)) return input.canvas;
  const story = input.canvas.nodes.find((node) => node.id === input.storyNodeId)!;
  const power = firstAvailablePower(input.powers, "text", "setting");
  if (!power) throw new Error("请先在后台配置设定能力");
  const node = createLocalNode("power", input.assetCate, input.canvas.nodes.length,
    { x: story.x, y: story.y + story.height + 96 }, { power });
  node.nodeNo = nextCanvasNodeNo(input.canvas.nodes, input.canvas.nextNodeNo);
  node.title = story.title + " · 设定";
  node.composerDraft = {
    prompt: "根据故事大纲的角色、场景和道具生成全片共用设定，保留原有实体名称与身份。",
    promptContent: { version: 1, parts: [
      { type: "text", text: "根据故事大纲的角色、场景和道具生成全片共用设定，保留原有实体名称与身份。" },
      { type: "reference", ref_type: "asset", ref_id: Number(story.resultRef?.asset_id || story.asset?.id), ref_version_id: Number(story.resultRef?.version_id || story.asset?.version_id), label: story.title },
    ] },
  };
  return { ...input.canvas, nextNodeNo: node.nodeNo + 1, nodes: [...input.canvas.nodes, node],
    edges: [...input.canvas.edges, { id: crypto.randomUUID(), from: story.id, to: node.id, purpose: "media" }] };
}

// Reuse the storyboard material nodes and image powers for generated settings.
export function syncSettingDerivedGroups(input: { canvas: SpaceCanvasState; settingNode: SpaceCanvasNode; assetCate: AssetCate; powers: PowerOption[] }): SpaceCanvasState {
  const document = settingNodeDocument(input.settingNode);
  if (!document) return input.canvas;
  const signature = stableToken(JSON.stringify(document));
  if (input.settingNode.storyboardMaterializedSignature === signature) return input.canvas;
  const source = input.settingNode;
  const nodes = input.canvas.nodes.filter((node) => !node.storyboardItem || node.storyboardItem.sourceNodeId !== source.id ||
    document.materials.some((material) => material.id === node.storyboardItem!.itemId && material.type === node.storyboardItem!.itemType));
  const specs = STORYBOARD_DERIVED_GROUP_SPECS.filter((spec) => ["character", "scene", "prop"].includes(spec.itemType));
  const power = firstAvailablePower(input.powers, "image", "general");
  const layouts = planStoryboardDerivedGroupLayout({ sourceNode: source, groups: specs.map((spec) => ({ key: spec.key, layoutIndex: spec.layoutIndex, direction: spec.direction, powerKind: spec.powerKind, power, itemCount: document.materials.filter((item) => item.type === spec.itemType).length })) });
  let nextNodeNo = nextCanvasNodeNo(nodes, input.canvas.nextNodeNo);
  for (const spec of specs) {
    const layout = layouts.get(spec.key)!;
    const group = ensureDerivedGroup({ nodes, storyboardNode: source, spec, layout, assetCate: input.assetCate, power }).node;
    for (const material of document.materials.filter((item) => item.type === spec.itemType)) {
      const item = { id: material.id, type: material.type, title: material.name, prompt: material.prompt };
      const index = nodes.findIndex((node) => isMatchingDerivedNode(node, source.id, item.type, item.id));
      const member = index >= 0 ? mergeExistingDerivedNode(nodes[index], group.id, item, spec, power, { nodes }) : createDerivedNode({ nodes, group, storyboardNode: source, item, assetCate: input.assetCate, spec, power });
      const next = { ...member, title: material.name, storyboardItem: { ...member.storyboardItem!, generatedInputs: { ...member.storyboardItem!.generatedInputs, voice: material.voice } } };
      if (index >= 0) nodes[index] = next;
      else { next.nodeNo = nextNodeNo++; nodes.push(next); }
    }
    const members = nodes.filter((node) => node.groupId === group.id);
    const positions = storyboardDerivedGroupMemberLayout(group, members);
    for (const member of members) nodes[nodes.indexOf(member)] = { ...member, ...positions.positions.get(member.id)! };
  }
  nodes[nodes.findIndex((node) => node.id === source.id)] = { ...source, storyboardMaterializedSignature: signature };
  const edges = input.canvas.edges.filter((edge) => nodes.some((node) => node.id === edge.from) && nodes.some((node) => node.id === edge.to));
  return { ...input.canvas, nextNodeNo, nodes, edges: reconcileCanvasGroupEdges(nodes, edges) };
}
