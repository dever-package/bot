import assert from "node:assert/strict";
import test from "node:test";

import {
  buildStoryboardFrameIndex,
  storyboardFrameRunSummary,
  type StoryboardFrameScope,
} from "../front/src/nodes/body-work/space/space-storyboard-frame.ts";
import type { SpaceCanvasNode } from "../front/src/nodes/body-work/space/types.ts";

function trackNodeReads(nodes: SpaceCanvasNode[]) {
  let reads = 0;
  const tracked = nodes.map(
    (node) =>
      new Proxy(node, {
        get(target, property, receiver) {
          if (typeof property === "string") {
            reads += 1;
          }
          return Reflect.get(target, property, receiver);
        },
      }),
  );
  return {
    nodes: tracked,
    reads: () => reads,
  };
}

test("storyboard frame membership is indexed with linear node reads", () => {
  const nodes: SpaceCanvasNode[] = [];
  for (let index = 0; index < 40; index += 1) {
    const sourceNodeId = `source-${index}`;
    const groupId = `group-${index}`;
    nodes.push(
      {
        id: sourceNodeId,
        type: "power",
        title: `分镜 ${index}`,
        x: index * 20,
        y: index * 20,
        storyboardMaterializedSignature: `source-${index}`,
      } as SpaceCanvasNode,
      {
        id: groupId,
        type: "group",
        title: `制作组 ${index}`,
        x: index * 20 + 200,
        y: index * 20,
        group: { origin: "script", sourceNodeId },
      } as SpaceCanvasNode,
      {
        id: `work-${index}`,
        type: "power",
        title: `结果 ${index}`,
        x: index * 20 + 240,
        y: index * 20 + 40,
        groupId,
        storyboardItem: { sourceNodeId, itemType: "shot_image" },
      } as SpaceCanvasNode,
    );
  }
  const tracked = trackNodeReads(nodes);

  const result = buildStoryboardFrameIndex(tracked.nodes, () => false);

  assert.equal(result.frames.length, 40);
  assert.equal(result.frames[0]?.memberNodeIds.length, 3);
  assert.deepEqual(result.frames[0]?.memberNodeIds, [
    "source-0",
    "group-0",
    "work-0",
  ]);
  assert.ok(result.frames[0]!.bounds.x <= tracked.nodes[0].x);
  assert.ok(result.frames[0]!.bounds.y <= tracked.nodes[0].y);
  assert.equal(result.frames[0]?.groupCount, 1);
  assert.equal(result.frames[0]?.workNodeCount, 1);
  assert.equal(result.frames[0]?.completedCount, 0);
  assert.equal(
    result.sourceNodeIdByNodeId.get("work-0"),
    "source-0",
  );
  assert.ok(
    tracked.reads() < 12_000,
    `expected linear frame indexing, observed ${tracked.reads()} node reads`,
  );
});

test("storyboard pending dependencies propagate without repeated full scans", () => {
  const nodeCount = 120;
  const rawNodes = Array.from({ length: nodeCount }, (_, offset) => {
    const index = nodeCount - offset - 1;
    return ({
      id: `work-${index}`,
      type: "power",
      title: `结果 ${index}`,
      x: index * 10,
      y: 0,
      storyboardItem: {
        sourceNodeId: "source",
        itemType: "shot_image",
        stale: index === 0,
        dependencyNodeIds: index > 0 ? [`work-${index - 1}`] : [],
      },
      power: { id: 1, key: "image" },
    }) as SpaceCanvasNode;
  });
  const tracked = trackNodeReads(rawNodes);
  const nodesByID = new Map(tracked.nodes.map((node) => [node.id, node]));
  const frame = {
    id: "storyboard-frame:source",
    sourceNodeId: "source",
    title: "分镜",
    memberNodeIds: tracked.nodes.map((node) => node.id),
    workNodeIds: tracked.nodes.map((node) => node.id),
    groupCount: 0,
    workNodeCount: nodeCount,
    completedCount: nodeCount - 1,
    sourceBounds: { x: 0, y: 0, width: 180, height: 180 },
    bounds: { x: 0, y: 0, width: 1200, height: 180 },
  } satisfies StoryboardFrameScope;
  const baselineReads = tracked.reads();

  const result = storyboardFrameRunSummary(
    frame,
    tracked.nodes,
    (node) => !node.storyboardItem?.stale,
    nodesByID,
  );

  assert.equal(result.pendingNodeIds.length, nodeCount);
  const summaryReads = tracked.reads() - baselineReads;
  assert.ok(
    summaryReads < 5_000,
    `expected linear dependency propagation, observed ${summaryReads} node reads`,
  );
});
