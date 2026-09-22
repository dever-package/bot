import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { reuseEquivalentFlowNodes } from "../front/src/nodes/body-work/space/use-stable-flow-nodes.ts";
import {
  applyRunningNodeUpdateBatch,
  mergeRunningNodeUpdate,
} from "../front/src/nodes/body-work/space/space-running-node-batcher.ts";
import { createStableCallbackProxy } from "../front/src/nodes/body-work/space/space-stable-callback.ts";

type TestNode = {
  id: string;
  position: { x: number; y: number };
  data: { revision: number };
};

const equivalent = (previous: TestNode, next: TestNode) =>
  previous.data.revision === next.data.revision;

test("equivalent flow nodes keep node and array references", () => {
  const previous = [flowNode("first", 1), flowNode("second", 1)];
  const next = [flowNode("first", 1), flowNode("second", 1)];

  const stable = reuseEquivalentFlowNodes(next, previous, equivalent);

  assert.equal(stable, previous);
  assert.equal(stable[0], previous[0]);
  assert.equal(stable[1], previous[1]);
});

test("only changed flow nodes receive a new reference", () => {
  const previous = [flowNode("first", 1), flowNode("second", 1)];
  const next = [flowNode("first", 2), flowNode("second", 1)];

  const stable = reuseEquivalentFlowNodes(next, previous, equivalent);

  assert.notEqual(stable, previous);
  assert.equal(stable[0], next[0]);
  assert.equal(stable[1], previous[1]);
});

test("stable callbacks keep identity while dispatching the latest behavior", () => {
  const calls: string[] = [];
  const callbackRef = {
    current: (value: string) => calls.push(`first:${value}`),
  };
  const callback = createStableCallbackProxy(callbackRef);

  callback("before");
  callbackRef.current = (value: string) => calls.push(`latest:${value}`);
  callback("after");

  assert.deepEqual(calls, ["first:before", "latest:after"]);
});

test("running-node batches merge deltas per node without replacing untouched nodes", () => {
  const untouched = { status: "complete", output: "ready" } as any;
  const current = {
    active: { status: "running", output: "" },
    untouched,
  } as any;
  const pending = new Map();
  mergeRunningNodeUpdate(pending, "active", (node: any) => ({
    ...node,
    output: `${node?.output || ""}A`,
  }));
  mergeRunningNodeUpdate(pending, "active", (node: any) => ({
    ...node,
    output: `${node?.output || ""}B`,
  }));
  mergeRunningNodeUpdate(pending, "active", (node: any) => ({
    ...node,
    status: "complete",
  }));

  const next = applyRunningNodeUpdateBatch(current, pending);

  assert.notEqual(next, current);
  assert.deepEqual(next.active, { status: "complete", output: "AB" });
  assert.equal(next.untouched, untouched);
});

test("single-node runs release local stream ownership before recovery", () => {
  const source = readFileSync(
    new URL(
      "../front/src/nodes/body-work/space/space-page.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const start = source.indexOf("const runBackendSingleNode");
  const end = source.indexOf("const runFunctionNodeAction", start);
  assert.ok(start >= 0 && end > start, "single-node runner source is missing");

  const runner = source.slice(start, end);
  const release = runner.indexOf(
    "releaseLocallyManagedCanvasRun(runInput.canvasRun)",
  );
  const recover = runner.indexOf("await recoverCanvasRunExecution(runInput)");
  assert.ok(release >= 0, "single-node runner does not release local ownership");
  assert.ok(
    recover > release,
    "single-node runner must release local ownership before recovery",
  );
});

function flowNode(id: string, revision: number): TestNode {
  return {
    id,
    position: { x: 0, y: 0 },
    data: { revision },
  };
}
