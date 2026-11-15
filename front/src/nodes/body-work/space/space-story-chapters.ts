import { createLocalNode, nextCanvasNodeNo } from "./space-model";
import { isStoryboardPowerType } from "../shared/power-presentation";
import { parseStoryboardOutput } from "./space-storyboard";
import { syncStoryComposition } from "./space-story-composition";
import { settingNodeDocument } from "./space-setting-model";
import { storyboardSettingSource } from "./space-story-setting-reference";
import {
  syncStorySettingGroup,
  storySettingDocument,
  settingForStory,
} from "./space-story-setting";
import {
  firstAvailablePower,
  stableToken,
} from "./space-storyboard-derived-groups";
import type {
  AssetCate,
  PowerOption,
  SpaceCanvasNode,
  SpaceCanvasEdge,
  SpaceCanvasState,
} from "./types";

function chapterSelection(node: SpaceCanvasNode, workAssetId: number) {
  if (!isStoryboardPowerType(node.power, node.kind, node.outputType)) return;
  return node.composerDraft?.promptContent?.parts.find(
    (part) =>
      part.type === "reference" &&
      part.ref_type === "asset" &&
      part.ref_id === workAssetId &&
      part.ref_content_selection?.kind === "unit",
  );
}

// Pulling chapters creates references and wires only; it never starts paid generation.
export function pullStoryChapters(input: {
  canvas: SpaceCanvasState;
  storyNodeId: string;
  unitIds: string[];
  assetCate: AssetCate;
  powers: PowerOption[];
}): SpaceCanvasState {
  const story = input.canvas.nodes.find(
    (node) => node.id === input.storyNodeId,
  );
  const document = story && storySettingDocument(story);
  const assetId = Number(story?.asset?.id || story?.resultRef?.asset_id || 0);
  const versionId = Number(
    story?.asset?.version_id ||
      story?.asset?.version?.id ||
      story?.resultRef?.version_id ||
      0,
  );
  if (!story || !document || !assetId || !versionId)
    throw new Error("请先保存故事作品");
  const power = firstAvailablePower(input.powers, "text", "storyboard");
  if (!power) throw new Error("请先配置分镜脚本能力");
  const units = document.units.filter((unit) =>
    input.unitIds.includes(unit.id),
  );
  if (
    !units.length ||
    units.length !== new Set(input.unitIds).size ||
    units.some((unit) => !unit.asset_id || !unit.version_id || !unit.has_body)
  ) {
    throw new Error("请选择已生成正文的章节");
  }
  const canvas = settingForStory(input.canvas, story.id)
    ? input.canvas
    : syncStorySettingGroup(input);
  const nodes = [...canvas.nodes];
  const edges = [...canvas.edges];
  const setting = settingForStory(canvas, story.id);
  let nextNodeNo = nextCanvasNodeNo(nodes, canvas.nextNodeNo);
  for (const unit of units) {
    let node = nodes.find((candidate) => {
      const part = chapterSelection(candidate, assetId);
      return (
        part?.type === "reference" &&
        part.ref_content_selection?.ids.length === 1 &&
        part.ref_content_selection.ids[0] === unit.id
      );
    });
    if (!node) {
      node = createLocalNode(
        "power",
        input.assetCate,
        nextNodeNo,
        {
          x: story.x + (story.width || 420) + 360,
          y: story.y + document.units.indexOf(unit) * 460,
        },
        { power },
      );
      node.id = `chapter-${stableToken(story.id)}-${stableToken(unit.id)}`;
      node.nodeNo = nextNodeNo++;
      node.title = unit.title;
      node.titleMode = "manual";
      node.composerDraft = {
        prompt: "将本章正文改编为场景剧本，再按剧本生成分镜。",
        promptContent: {
          version: 1,
          parts: [
            {
              type: "text",
              text: "将本章正文改编为场景剧本，再按剧本生成分镜。",
            },
            {
              type: "reference",
              ref_type: "asset",
              ref_id: assetId,
              ref_version_id: versionId,
              label: unit.title,
              ref_content_selection: { kind: "unit", ids: [unit.id] },
            },
          ],
        },
      };
      nodes.push(node);
    }
    const current = nodes.indexOf(node);
    nodes[current] = {
      ...node,
      composerDraft: {
        ...node.composerDraft,
        promptContent: {
          version: 1,
          parts: node.composerDraft!.promptContent!.parts.map((part) =>
            part.type === "reference" &&
            part.ref_type === "asset" &&
            part.ref_id === assetId
              ? { ...part, ref_version_id: versionId }
              : part,
          ),
        },
      },
    };
    for (const sourceId of [story.id, ...(setting ? [setting.id] : [])]) {
      const id = `chapter-source-${stableToken(sourceId)}-${stableToken(node.id)}`;
      if (!edges.some((edge) => edge.id === id))
        edges.push({ id, from: sourceId, to: node.id, purpose: "structure" });
    }
  }
  const chapterIds = new Set(
    nodes
      .filter((node) => chapterSelection(node, assetId))
      .map((node) => node.id),
  );
  for (let index = edges.length - 1; index >= 0; index--) {
    const edge = edges[index];
    if (
      edge.id.startsWith("chapter-next-") &&
      chapterIds.has(edge.from) &&
      chapterIds.has(edge.to)
    ) {
      edges.splice(index, 1);
    }
  }
  for (let index = 1; index < document.units.length; index++) {
    const pair = document.units.slice(index - 1, index + 1).map((unit) =>
      nodes.find((candidate) => {
        const part = chapterSelection(candidate, assetId);
        return (
          part?.type === "reference" &&
          part.ref_content_selection?.ids[0] === unit.id
        );
      }),
    );
    if (!pair[0] || !pair[1]) continue;
    const id = `chapter-next-${stableToken(pair[0].id)}-${stableToken(pair[1].id)}`;
    if (!edges.some((edge) => edge.id === id))
      edges.push({
        id,
        from: pair[0].id,
        to: pair[1].id,
        purpose: "structure",
      });
  }
  return syncStoryComposition({
    ...input,
    canvas: { ...canvas, nodes, edges, nextNodeNo },
  });
}

// Compare chapter content versions, not the whole story revision: editing a
// different chapter must not invalidate this chapter's script.
export function storyChapterUpdateReason(
  node: SpaceCanvasNode,
  nodes: SpaceCanvasNode[],
  edges: SpaceCanvasEdge[],
) {
  if (!isStoryboardPowerType(node.power, node.kind, node.outputType)) return "";
  const board = parseStoryboardOutput([
    node.asset?.version?.content,
    node.resultOutput,
  ]);
  const source = board?.screenplay?.source;
  if (!board || !source) return "";
  const story = nodes.find(
    (entry) =>
      Number(entry.asset?.id || entry.resultRef?.asset_id) ===
      source.work_asset_id,
  );
  const document = story && storySettingDocument(story);
  if (!story || !document) return "";
  const unit = document.units.find((entry) => entry.id === source.unit_id);
  if (!unit) return "来源章节已移除，已有分镜和视频保留";
  if (
    unit.asset_id !== source.asset_id ||
    unit.version_id !== source.version_id
  ) {
    return "章节正文已更新，重做剧本后再制作；已有结果保留";
  }
  const setting = storyboardSettingSource(nodes, edges, node.id);
  const definition = setting && settingNodeDocument(setting);
  if (
    definition &&
    (board.visual_mode !== definition.visual_mode ||
      board.aspect_ratio !== definition.aspect_ratio ||
      board.style_prompt !== definition.style_prompt)
  ) {
    return "全片画风或画幅已更新，请重做剧本后再制作";
  }
  return "";
}
