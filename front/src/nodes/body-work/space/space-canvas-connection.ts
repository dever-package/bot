import { isWritingPowerType } from "../shared/power-presentation";
import { canvasConnectionPurpose, canvasEdgeCarriesMedia } from "./space-canvas-edge";
import { fetchSpacePowerForm } from "./space-api";
import type { SpaceCatalogCache } from "./space-catalog-cache";
import { isCanvasFunctionNode } from "./space-function";
import { canConnectCanvasNodes, canvasConnectionSourceNodes } from "./space-group-model";
import {
  canvasMediaReferenceKind,
  isCanvasMediaReferenceNode,
  mediaUsageOptions,
  nextMediaUsageForSources,
  reconcileReferenceModeForMediaSources,
  resolveCanvasMultiImagePlan,
  type CanvasConnectedMediaReference,
} from "./space-media-references";
import {
  canvasComposerDraftSignature,
  readCanvasComposerDraft,
} from "./space-model";
import {
  availableCanvasTextBindingParams,
  canvasNodeSupportsStoryboardLyrics,
  canvasNodeSupportsTextBinding,
} from "./space-param-binding";
import { mergeCanvasComposerParamValues } from "./space-power-param";
import { filterActivePowerParams } from "./space-power-param-runtime";
import type { CanvasComposerDraft, ComposerAssetItem, PowerParam, SpaceCanvasEdge, SpaceCanvasNode } from "./types";

export type CanvasConnectionPlan =
  | { kind: "invalid"; reason: string }
  | { kind: "form" }
  | { kind: "direct"; description?: string }
  | { kind: "text"; params: PowerParam[]; lyricsAvailable: boolean }
  | { kind: "media"; options: { key: string; name: string }[]; draft?: CanvasComposerDraft };

export type CanvasConnectionChoice =
  | { kind: "text" | "media"; key: string }
  | { kind: "lyrics" };

export function automaticCanvasConnectionChoice(plan: CanvasConnectionPlan): CanvasConnectionChoice | undefined {
  if (plan.kind === "media" && plan.options.length === 1) {
    return { kind: "media", key: plan.options[0].key };
  }
  if (plan.kind === "text" && plan.params.length === 1 && !plan.lyricsAvailable) {
    return { kind: "text", key: plan.params[0].key };
  }
  if (plan.kind === "text" && plan.params.length === 0 && plan.lyricsAvailable) {
    return { kind: "lyrics" };
  }
}

export function loadCanvasTargetPowerForm(
  cache: SpaceCatalogCache,
  projectId: number,
  releaseId: number,
  target: SpaceCanvasNode,
) {
  const input = {
    projectId,
    releaseId,
    flowId: Number(target.flow?.id || 0),
    powerId: Number(target.power?.id || 0),
    powerKey: target.power?.key || "",
    targetId: Number(target.composerDraft?.selectedTargetId || 0),
  };
  return cache.loadPowerForm(input, () => fetchSpacePowerForm(input));
}

export function activeCanvasTextParams(target: SpaceCanvasNode, params: PowerParam[]) {
  return filterActivePowerParams(params, mergeCanvasComposerParamValues(params, readCanvasComposerDraft(target.composerDraft)));
}

export function activeCanvasTextBindingParams(target: SpaceCanvasNode, params: PowerParam[], sourceId: string) {
  return availableCanvasTextBindingParams(activeCanvasTextParams(target, params), target.composerDraft, sourceId);
}

export function canvasIncomingMediaConnections(
  nodes: SpaceCanvasNode[],
  edges: SpaceCanvasEdge[],
  targetId: string,
): CanvasConnectedMediaReference[] {
  return edges.flatMap((edge) => {
    if (!canvasEdgeCarriesMedia(edge) || (edge.logicalTo || edge.to) !== targetId) return [];
    return canvasConnectionSourceNodes(nodes, edge.logicalFrom || edge.from)
      .filter(isCanvasMediaReferenceNode)
      .map((source) => ({ edge, source }));
  });
}

export function resolveCanvasConnection({ source, target, nodes, edges, items, params, referenceOnly = false }: {
  source?: SpaceCanvasNode;
  target?: SpaceCanvasNode;
  nodes: SpaceCanvasNode[];
  edges: SpaceCanvasEdge[];
  items: ComposerAssetItem[];
  params?: PowerParam[];
  referenceOnly?: boolean;
}): CanvasConnectionPlan {
  if (!source || !target || !canConnectCanvasNodes(source, target)) {
    return { kind: "invalid", reason: "无法连接这两个节点，请检查节点和分组位置" };
  }
  const incoming = edges.filter((edge) => (edge.logicalTo || edge.to) === target.id);
  if (canvasConnectionPurpose(source, target) === "structure") {
    const previousStoryboard = source.outputType === "storyboard";
    if (incoming.some((edge) => {
      const from = edge.logicalFrom || edge.from;
      return from !== source.id && nodes.some((node) => node.id === from && node.outputType === source.outputType);
    })) {
      return { kind: "invalid", reason: previousStoryboard ? "一个分镜只能接续一个前章分镜" : "一个分镜只能引用一份共用设定" };
    }
    return { kind: "direct", description: previousStoryboard ? "接续前章分镜" : "复用角色、场景、道具" };
  }
  if (target.type === "group" || (isCanvasFunctionNode(source, "start") && (target.type === "power" || target.type === "agent" || target.type === "flow"))) {
    return { kind: "direct" };
  }
  if (source.outputType === "setting" || source.outputType === "storyboard") {
    return { kind: "invalid", reason: "此节点输出的是结构化内容，不能当作普通文本或媒体引用" };
  }

  const sources = source.type === "group" ? canvasConnectionSourceNodes(nodes, source.id) : [source];
  const mediaSources = sources.filter(isCanvasMediaReferenceNode);
  const providesText = canvasNodeSupportsTextBinding(source);
  const providesWriting = isWritingPowerType(source.power, source.kind, source.outputType);
  if (isCanvasFunctionNode(target, "display") || isCanvasFunctionNode(target, "save")) {
    if (incoming.some((edge) => (edge.logicalFrom || edge.from) !== source.id)) {
      return { kind: "invalid", reason: "此功能节点只能接收一个上游结果" };
    }
    if (providesText || providesWriting || mediaSources.length || source.type === "group") return { kind: "direct" };
  }
  if (target.type === "agent" && target.role?.agent_id && (providesText || providesWriting || (!referenceOnly && mediaSources.length))) {
    return { kind: "direct" };
  }
  if (!referenceOnly && target.type === "flow" && (providesText || providesWriting)) return { kind: "direct" };
  if (target.type === "power" && target.power) {
    if (target.outputType === "video_compose") {
      return mediaSources.length && mediaSources.every((node) => canvasMediaReferenceKind(node) === "video")
        ? { kind: "direct", description: "用作视频片段" }
        : { kind: "invalid", reason: "视频合成只接收连线导入的视频片段" };
    }
    if (target.outputType === "setting" && providesWriting) {
      return { kind: "direct", description: "提取作品中的设定" };
    }
    if (!referenceOnly && providesWriting) return { kind: "direct" };
    if (mediaSources.length) {
      if (!params) return { kind: "form" };
      const draft = readCanvasComposerDraft(target.composerDraft);
      const connections = canvasIncomingMediaConnections(nodes, edges, target.id);
      const savedValues = mergeCanvasComposerParamValues(params, draft);
      const values = reconcileReferenceModeForMediaSources(
        params,
        savedValues,
        [...connections.map((connection) => connection.source), ...mediaSources],
      );
      const multiImagePlan = resolveCanvasMultiImagePlan({
        node: target,
        content: draft.promptContent,
        items,
        connections,
        params,
        values,
        requestedMode: draft.multiImageMode,
        additionalSources: mediaSources,
      });
      if (multiImagePlan.error) return { kind: "invalid", reason: multiImagePlan.error };
      const multiImageMode = multiImagePlan.active ? multiImagePlan.mode : undefined;
      const assignment = nextMediaUsageForSources(
        connections,
        mediaUsageOptions(filterActivePowerParams(params, values)),
        mediaSources,
        draft.promptContent,
        items,
        multiImageMode,
      );
      if (assignment.error) return { kind: "invalid", reason: assignment.error };
      const nextDraft = { ...draft, paramValues: values, multiImageMode: multiImageMode ?? draft.multiImageMode };
      return {
        kind: "media",
        options: assignment.options.map((option) => ({ key: option.key, name: option.label })),
        draft: (values !== savedValues || multiImageMode) && canvasComposerDraftSignature(nextDraft) !== canvasComposerDraftSignature(draft) ? nextDraft : undefined,
      };
    }
    if (providesText) {
      if (!params) return { kind: "form" };
      const options = activeCanvasTextBindingParams(target, params, source.id);
      const lyricsAvailable = canvasNodeSupportsStoryboardLyrics(target);
      return options.length || lyricsAvailable
        ? { kind: "text", params: options, lyricsAvailable }
        : { kind: "invalid", reason: "下游没有空闲且生效的文本参数" };
    }
  }
  if (!referenceOnly && (source.type === "group" || isCanvasFunctionNode(source, "import"))) return { kind: "direct" };
  return { kind: "invalid", reason: "下游没有能接收该节点结果的输入" };
}
