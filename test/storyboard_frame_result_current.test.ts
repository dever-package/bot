import assert from "node:assert/strict";
import test from "node:test";

import { markStoryboardFrameResultsCurrent } from "../front/src/nodes/body-work/space/space-storyboard-frame.ts";
import type { SpaceCanvasNode } from "../front/src/nodes/body-work/space/types.ts";

test("reapplying a recovered storyboard result preserves the node array", () => {
  const node = {
    id: "storyboard-result",
    storyboardItem: {
      sourceNodeId: "storyboard-source",
      sourceSignature: "source-v1",
      resultSourceSignature: "source-v0",
      stale: true,
    },
  } as SpaceCanvasNode;
  const successfulNodeIds = new Set([node.id]);

  const marked = markStoryboardFrameResultsCurrent(
    [node],
    "storyboard-source",
    successfulNodeIds,
  );
  const reapplied = markStoryboardFrameResultsCurrent(
    marked,
    "storyboard-source",
    successfulNodeIds,
  );

  assert.equal(marked[0]?.storyboardItem?.stale, false);
  assert.equal(marked[0]?.storyboardItem?.resultSourceSignature, "source-v1");
  assert.equal(reapplied, marked);
});
