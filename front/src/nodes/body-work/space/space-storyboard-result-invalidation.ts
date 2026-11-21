import type { SpaceCanvasNode } from "./types";
import { CANVAS_RESULT_INVALIDATED_STATUS } from "./space-result";
import { storyboardManualPrompt } from "./space-storyboard-derived-prompt";

function frameInputs(node: SpaceCanvasNode) {
  const item = node.storyboardItem!;
  const { prompt: _prompt, ...params } = node.composerDraft?.paramValues || {};
  const boundary = [
    params,
    node.composerDraft?.selectedTargetId,
    item.shotImageMode,
    item.sharedEndShotId || "",
    item.sharedStartShotId || "",
    item.referenceNodeIds || [],
    item.dependencyNodeIds || [],
    item.externalReferenceAssetIds || [],
    item.generatedInputs?.visualContext || "",
    (node.composerDraft?.promptContent?.parts || []).flatMap((part) =>
      part.type === "reference" && !(part.ref_origin === "storyboard" && part.ref_origin_id)
        ? [[part.ref_type, part.ref_id, part.ref_version_id, part.usage, part.ref_media_index, part.ref_media_url, part.ref_media_items, part.ref_media_excluded]]
        : [],
    ),
    item.generatedPrompt,
    item.continuityAnchor || "",
    item.itemType === "shot" ? item.shotDuration || 0 : 0,
    // 只比较手动改写；打开参数面板把生成提示词写回草稿不算改动。
    storyboardManualPrompt(node.composerDraft?.prompt, item.generatedPrompt).trim(),
  ];
  if (item.itemType === "shot_image") {
    return [
      ...boundary,
      item.frameMediaItems || [],
      item.imageSequenceFrames || [],
    ];
  }
  return boundary;
}

function frameResult(node: SpaceCanvasNode) {
  const assetID = node.resultRef?.asset_id || node.asset?.id;
  const versionID =
    node.resultRef?.version_id || node.asset?.version_id || node.asset?.version?.id;
  // 补齐同一资产版本的内容不是换版，不能让已完成视频失效。
  if (assetID && versionID) return JSON.stringify([assetID, versionID]);
  return JSON.stringify([
    node.asset?.version?.content,
    node.resultOutput,
  ]);
}

function frameResultVersion(node: SpaceCanvasNode) {
  const assetID = node.resultRef?.asset_id || node.asset?.id;
  const versionID =
    node.resultRef?.version_id || node.asset?.version_id || node.asset?.version?.id;
  return assetID && versionID ? `${assetID}:${versionID}` : "";
}

function resultBatch(node: SpaceCanvasNode | undefined) {
  const ref = node?.resultRef;
  if (ref?.execution_id) return `execution:${ref.execution_id}`;
  return ref?.run_id ? `run:${ref.run_id}` : "";
}

/** 只解除当前画布结果绑定；资产库、运行历史和手工输入仍保留。 */
export function invalidateStoryboardFrameResults(
  previousNodes: readonly SpaceCanvasNode[],
  nodes: SpaceCanvasNode[],
  sourceNodeId: string,
  previousResultNodes?: readonly SpaceCanvasNode[],
) {
  const currentByID = new Map(nodes.map((node) => [node.id, node]));
  const invalid = new Set<string>();
  const owned = (node: SpaceCanvasNode) =>
    node.storyboardItem?.sourceNodeId === sourceNodeId;
  for (const previous of previousNodes) {
    if (!owned(previous)) continue;
    const kind = previous.storyboardItem!.itemType;
    if (!["character", "scene", "prop", "shot_image", "shot", "speech", "subtitle"].includes(kind)) continue;
    const current = currentByID.get(previous.id);
    if (
      !current ||
      JSON.stringify(frameInputs(previous)) !==
        JSON.stringify(frameInputs(current))
    ) {
      invalid.add(previous.id);
    }
  }
  const dependents = new Map<string, Set<string>>();
  for (const node of [...previousNodes, ...nodes]) {
    const item = node.storyboardItem;
    if (!item) continue;
    for (const sourceID of [
      ...(item.referenceNodeIds || []),
      ...(item.dependencyNodeIds || []),
    ]) {
      const targets = dependents.get(sourceID) || new Set<string>();
      targets.add(node.id);
      dependents.set(sourceID, targets);
    }
  }
  // 合成使用镜头、独立配音和字幕；重做声音只更新合成，不重做画面。
  const compositions = nodes.filter(
    (node) => node.storyboardItem?.itemType === "video_compose",
  );
  for (const node of [...previousNodes, ...nodes]) {
    if (!["shot", "speech", "subtitle"].includes(node.storyboardItem?.itemType || "")) continue;
    const targets = dependents.get(node.id) || new Set<string>();
    compositions
      .filter((composition) =>
        composition.storyboardItem!.sourceNodeId === node.storyboardItem!.sourceNodeId,
      )
      .forEach((composition) => targets.add(composition.id));
    dependents.set(node.id, targets);
  }
  const propagate = (roots: Iterable<string>, completedBatch = "") => {
    const queue = [...roots];
    const visited = new Set(queue);
    for (let index = 0; index < queue.length; index += 1) {
      for (const id of dependents.get(queue[index]) || []) {
        if (visited.has(id)) continue;
        // 参考图仅指导后续生图。已选定的其他关键帧不随参考图换版清空。
        if (currentByID.get(queue[index])?.storyboardItem?.itemType === "shot_image" &&
            currentByID.get(id)?.storyboardItem?.itemType === "shot_image") continue;
        visited.add(id);
        // 恢复结果可能乱序；同次执行已生成的视频已使用本批新图。
        if (
          completedBatch &&
          resultBatch(currentByID.get(id)) === completedBatch
        )
          continue;
        invalid.add(id);
        queue.push(id);
      }
    }
  };
  propagate(invalid);

  for (const previous of previousResultNodes || []) {
    if (!previous.storyboardItem) continue;
    const current = currentByID.get(previous.id);
    if (!current || frameResult(previous) === frameResult(current)) continue;
    const batch = resultBatch(current);
    // 之前没有可识别的版本时，这是结果首次到达（含页面恢复时补齐）；同批次下游已用它生成。
    const completedBatch =
      !frameResultVersion(previous) || batch !== resultBatch(previous)
        ? batch
        : "";
    // 新来源图本身保留；只让使用旧图的下游结果失效。
    propagate([current.id], completedBatch);
  }
  let changed = false;
  nodes.forEach((node, index) => {
    if (!invalid.has(node.id)) return;
    const next = clearStoryboardResult(node);
    if (next === node) return;
    nodes[index] = next;
    changed = true;
  });
  return changed;
}

export function clearStoryboardResult(node: SpaceCanvasNode): SpaceCanvasNode {
  if (!node.asset && !node.resultRef && node.resultOutput == null) return node;
  const next = { ...node };
  delete next.asset;
  if (node.resultRef) {
    const { asset_id, version_id, ...identity } = node.resultRef;
    next.resultRef = { ...identity, status: CANVAS_RESULT_INVALIDATED_STATUS };
  }
  delete next.resultOutput;
  delete next.resultView;
  return next;
}
