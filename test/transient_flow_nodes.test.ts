import assert from "node:assert/strict";
import test from "node:test";

import {
  activeTransientFlowNodeState,
  resolveTransientFlowNodes,
  updateTransientFlowNodes,
} from "../front/src/nodes/body-work/space/space-flow-state.ts";

type TestFlowNode = {
  id: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
  width?: number;
  height?: number;
  measured?: { width: number; height: number };
  resizing?: boolean;
  draggable?: boolean;
};

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

test("dragging retains the latest generated results on every node", () => {
  const beforeGeneration: TestFlowNode[] = [
    { id: "first", position: { x: 10, y: 20 }, data: { output: null } },
    { id: "second", position: { x: 100, y: 20 }, data: { output: null } },
  ];
  const transient = updateTransientFlowNodes(
    null,
    beforeGeneration,
    "first",
    (nodes) => nodes.map((node) => node.id === "first"
      ? { ...node, position: { x: 30, y: 40 } }
      : node),
  );
  const generated: TestFlowNode[] = beforeGeneration.map((node) => ({
    ...node,
    data: { output: { imageUrl: `${node.id}.png` }, status: "success" },
  }));

  const displayed = resolveTransientFlowNodes(generated, "first", transient);

  assert.strictEqual(displayed[0].data, generated[0].data);
  assert.strictEqual(displayed[1].data, generated[1].data);
  assert.deepEqual(displayed[0].position, { x: 30, y: 40 });
});

test("drag updates rebase on current stream and source metadata", () => {
  const initial: TestFlowNode[] = [{
    id: "first",
    position: { x: 10, y: 20 },
    data: { output: "", status: "running" },
    draggable: true,
  }];
  const transient = updateTransientFlowNodes(null, initial, "first", (nodes) =>
    nodes.map((node) => ({ ...node, position: { x: 30, y: 40 } })),
  );
  const streaming: TestFlowNode[] = [{
    ...initial[0],
    data: { output: "partial result", status: "running" },
    draggable: false,
  }];

  const updated = updateTransientFlowNodes(transient, streaming, "first", (nodes) =>
    nodes.map((node) => ({ ...node, position: { x: 50, y: 60 } })),
  );

  assert.strictEqual(updated?.nodes[0].data, streaming[0].data);
  assert.equal(updated?.nodes[0].draggable, false);
  assert.deepEqual(updated?.nodes[0].position, { x: 50, y: 60 });
});

test("transient geometry never restores deleted nodes or hides new nodes", () => {
  const initial: TestFlowNode[] = [
    { id: "first", position: { x: 10, y: 20 }, data: {} },
    { id: "deleted", position: { x: 100, y: 20 }, data: {} },
  ];
  const transient = updateTransientFlowNodes(null, initial, "first", (nodes) =>
    nodes.map((node) => node.id === "first"
      ? { ...node, position: { x: 30, y: 40 } }
      : node),
  );
  const inserted = { id: "new", position: { x: 200, y: 20 }, data: {} };
  const current: TestFlowNode[] = [initial[0], inserted];

  const displayed = resolveTransientFlowNodes(current, "first", transient);

  assert.deepEqual(displayed.map((node) => node.id), ["first", "new"]);
  assert.strictEqual(displayed[1], inserted);
});

test("resize geometry survives result updates without stale node data", () => {
  const initial: TestFlowNode[] = [{
    id: "first",
    position: { x: 10, y: 20 },
    data: { output: null },
    width: 180,
    height: 180,
  }];
  const transient = updateTransientFlowNodes(null, initial, "first", (nodes) =>
    nodes.map((node) => ({
      ...node,
      position: { x: 5, y: 10 },
      width: 240,
      height: 300,
      measured: { width: 240, height: 300 },
      resizing: true,
    })),
  );
  const current: TestFlowNode[] = [{ ...initial[0], data: { output: "ready.png" } }];

  const displayed = resolveTransientFlowNodes(current, "first", transient);

  assert.strictEqual(displayed[0].data, current[0].data);
  assert.deepEqual(displayed[0].position, { x: 5, y: 10 });
  assert.equal(displayed[0].width, 240);
  assert.equal(displayed[0].height, 300);
  assert.deepEqual(displayed[0].measured, { width: 240, height: 300 });
  assert.equal(displayed[0].resizing, true);
});

test("ending a drag discards its snapshot before the same node is dragged again", () => {
  const initial: TestFlowNode[] = [{
    id: "first",
    position: { x: 10, y: 20 },
    data: { output: null },
  }];
  let transient = updateTransientFlowNodes(null, initial, "first", (nodes) =>
    nodes.map((node) => ({ ...node, position: { x: 30, y: 40 } })),
  );
  assert.strictEqual(activeTransientFlowNodeState("first", transient), transient);
  transient = activeTransientFlowNodeState("", transient);
  assert.equal(transient, null);

  const generated: TestFlowNode[] = [{
    ...initial[0],
    position: { x: 50, y: 60 },
    data: { output: "ready.png" },
  }];

  assert.strictEqual(
    resolveTransientFlowNodes(generated, "first", transient),
    generated,
  );
  const restarted = updateTransientFlowNodes(null, generated, "first", (nodes) =>
    nodes.map((node) => ({ ...node, position: { x: 70, y: 80 } })),
  );
  assert.strictEqual(restarted?.nodes[0].data, generated[0].data);
  assert.deepEqual(restarted?.nodes[0].position, { x: 70, y: 80 });
  assert.equal(activeTransientFlowNodeState("other", restarted), null);
});

test("unchanged projections retain their node and array identities", () => {
  const initial: TestFlowNode[] = [
    { id: "first", position: { x: 10, y: 20 }, data: {} },
    { id: "second", position: { x: 100, y: 20 }, data: {} },
  ];
  const transient = updateTransientFlowNodes(null, initial, "first", (nodes) =>
    nodes.map((node) => node.id === "first"
      ? { ...node, position: { x: 30, y: 40 } }
      : node),
  );

  assert.strictEqual(resolveTransientFlowNodes(initial, "first", transient), transient?.nodes);
  const current = [...initial];
  assert.strictEqual(resolveTransientFlowNodes(current, "first", transient), transient?.nodes);
  assert.strictEqual(transient?.nodes[1], initial[1]);
  assert.strictEqual(resolveTransientFlowNodes(current, "", transient), current);
  assert.strictEqual(
    updateTransientFlowNodes(transient, current, "", () => {
      assert.fail("measurement updates outside an interaction must not be applied");
    }),
    transient,
  );
});

test("a new authoritative position is not overwritten on an untouched node", () => {
  const initial: TestFlowNode[] = [
    { id: "first", position: { x: 10, y: 20 }, data: {} },
    { id: "second", position: { x: 100, y: 20 }, data: {} },
  ];
  const transient = updateTransientFlowNodes(null, initial, "first", (nodes) =>
    nodes.map((node) => node.id === "first"
      ? { ...node, position: { x: 30, y: 40 } }
      : node),
  );
  const current: TestFlowNode[] = [initial[0], { ...initial[1], position: { x: 200, y: 300 } }];

  const displayed = resolveTransientFlowNodes(current, "first", transient);

  assert.strictEqual(displayed[1], current[1]);
  assert.deepEqual(displayed[0].position, { x: 30, y: 40 });
});
