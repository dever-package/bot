import type { SpaceCanvasNode } from "./types";

function frameInputs(node: SpaceCanvasNode) {
  const item = node.storyboardItem!;
  const boundary = [
    item.shotImageMode,
    item.sharedEndShotId || "",
    item.referenceNodeIds,
    item.dependencyNodeIds,
  ];
  if (item.itemType === "shot_image") {
    return [
      ...boundary,
      item.generatedPrompt,
      node.composerDraft?.prompt?.trim(),
      item.frameMediaItems,
      item.imageSequenceFrames,
    ];
  }
  return boundary;
}

function frameResult(node: SpaceCanvasNode) {
  return JSON.stringify([
    node.asset?.id,
    node.asset?.version_id || node.asset?.version?.id,
    node.resultRef?.asset_id,
    node.resultRef?.version_id,
    node.asset?.version?.content,
    node.resultOutput,
  ]);
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
    if (kind !== "shot_image" && kind !== "shot") continue;
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
    if (!owned(node)) continue;
    const item = node.storyboardItem!;
    for (const sourceID of [
      ...(item.referenceNodeIds || []),
      ...(item.dependencyNodeIds || []),
    ]) {
      const targets = dependents.get(sourceID) || new Set<string>();
      targets.add(node.id);
      dependents.set(sourceID, targets);
    }
  }
  // 合成节点通过时间线引用全部镜头，不使用 referenceNodeIds。
  const compositions = nodes.filter(
    (node) => owned(node) && node.storyboardItem?.itemType === "video_compose",
  );
  for (const node of [...previousNodes, ...nodes]) {
    if (!owned(node) || node.storyboardItem?.itemType !== "shot") continue;
    const targets = dependents.get(node.id) || new Set<string>();
    compositions.forEach((composition) => targets.add(composition.id));
    dependents.set(node.id, targets);
  }
  const propagate = (roots: Iterable<string>, completedExecution = 0) => {
    const queue = [...roots];
    const visited = new Set(queue);
    for (let index = 0; index < queue.length; index += 1) {
      for (const id of dependents.get(queue[index]) || []) {
        if (visited.has(id)) continue;
        visited.add(id);
        // 恢复结果可能乱序；同次执行已生成的视频已使用本批新图。
        if (
          completedExecution > 0 &&
          currentByID.get(id)?.resultRef?.execution_id === completedExecution
        )
          continue;
        invalid.add(id);
        queue.push(id);
      }
    }
  };
  propagate(invalid);

  const sharedSourceIDs = new Set(
    nodes
      .filter(
        (node) =>
          owned(node) &&
          node.storyboardItem?.itemType === "shot" &&
          node.storyboardItem.shotImageMode === "next_first",
      )
      .map((node) => node.storyboardItem!.sharedEndShotId),
  );
  for (const previous of previousResultNodes || []) {
    if (
      !owned(previous) ||
      previous.storyboardItem?.itemType !== "shot_image" ||
      !sharedSourceIDs.has(previous.storyboardItem.itemId)
    )
      continue;
    const current = currentByID.get(previous.id);
    if (!current || frameResult(previous) === frameResult(current)) continue;
    const execution = Number(current.resultRef?.execution_id || 0);
    const completedExecution =
      execution !== Number(previous.resultRef?.execution_id || 0)
        ? execution
        : 0;
    // 新来源图本身保留；只让使用旧图的下游结果失效。
    propagate([current.id], completedExecution);
  }
  let changed = false;
  nodes.forEach((node, index) => {
    if (
      !owned(node) ||
      !invalid.has(node.id) ||
      (!node.asset && !node.resultRef && node.resultOutput == null)
    )
      return;
    const next = { ...node };
    delete next.asset;
    delete next.resultRef;
    delete next.resultOutput;
    delete next.resultView;
    nodes[index] = next;
    changed = true;
  });
  return changed;
}
