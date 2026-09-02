import assert from "node:assert/strict";
import test from "node:test";

import {
  canvasExecutionFallbackRunningNodeId,
} from "../front/src/nodes/body-work/space/space-execution-plan.ts";

test("storyboard frame execution does not mark its source storyboard as running", () => {
  assert.equal(
    canvasExecutionFallbackRunningNodeId(
      "storyboard-source",
      "storyboard-frame:storyboard-source",
    ),
    "",
  );
});

test("ordinary canvas execution keeps its start-node fallback", () => {
  assert.equal(
    canvasExecutionFallbackRunningNodeId("start-node", ""),
    "start-node",
  );
});
