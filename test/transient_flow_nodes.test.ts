import assert from "node:assert/strict";
import test from "node:test";

import { updateTransientFlowNodes } from "../front/src/nodes/body-work/space/space-flow-state.ts";

test("node measurements do not create transient state outside an interaction", () => {
  const derivedNodes = [
    {
      id: "storyboard-frame:source",
      position: { x: 80, y: 80 },
      data: {},
    },
  ];

  const nextState = updateTransientFlowNodes(
    null,
    derivedNodes,
    "",
    (nodes) => [...nodes],
  );

  assert.equal(nextState, null);
});

test("node updates remain transient during an active interaction", () => {
  const derivedNodes = [
    {
      id: "node-1",
      position: { x: 10, y: 20 },
      data: {},
    },
  ];

  const nextState = updateTransientFlowNodes(
    null,
    derivedNodes,
    "node-1",
    (nodes) =>
      nodes.map((node) => ({
        ...node,
        position: { x: 30, y: 40 },
      })),
  );

  assert.equal(nextState?.interactionId, "node-1");
  assert.deepEqual(nextState?.nodes[0]?.position, { x: 30, y: 40 });
});
