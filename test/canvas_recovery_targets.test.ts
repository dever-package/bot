import assert from "node:assert/strict";
import test from "node:test";

import {
  canvasRunTargetsDeleted,
  normalizeCanvasRunRef,
  type CanvasRunRef,
} from "../front/src/nodes/body-work/space/space-runner.ts";
import type { SpaceCanvasState } from "../front/src/nodes/body-work/space/types.ts";

function canvas(id: number, nodeIds: string[], assetCateId = 3) {
  return {
    id,
    assetCateId,
    nodes: nodeIds.map((id) => ({ id })),
  } as SpaceCanvasState;
}

const completedRun: CanvasRunRef = {
  run_id: 17,
  canvas_id: 9,
  start_node_id: "start",
  status: "success",
  target_node_ids: ["start", "member"],
};

test("completed deleted targets need no full recovery response", () => {
  for (const status of ["success", "fail", "error", "canceled"]) {
    assert.equal(
      canvasRunTargetsDeleted(
        { ...completedRun, status },
        { 9: canvas(9, ["other"]) },
      ),
      true,
    );
  }
});

test("deleting a batch start keeps surviving targets recoverable", () => {
  assert.equal(
    canvasRunTargetsDeleted(completedRun, { 9: canvas(9, ["member"]) }),
    false,
  );
  // A single-node request may itself be a group execution.
  assert.equal(
    canvasRunTargetsDeleted(
      { ...completedRun, single_node: true },
      { 9: canvas(9, ["member"]) },
    ),
    false,
  );
});

test("active and waiting tasks retain continuation even when targets are gone", () => {
  for (const status of ["pending", "running", "waiting"]) {
    assert.equal(
      canvasRunTargetsDeleted(
        { ...completedRun, status },
        { 9: canvas(9, []) },
      ),
      false,
    );
  }
});

test("surviving nodes with unsaved results retain full result recovery", () => {
  assert.equal(
    canvasRunTargetsDeleted(
      {
        ...completedRun,
        single_node: true,
        target_node_ids: ["start"],
        node_results: [],
      },
      { 9: canvas(9, ["start"]) },
    ),
    false,
  );
});

test("unknown canvas and incomplete target metadata are not proof of deletion", () => {
  assert.equal(
    canvasRunTargetsDeleted(completedRun, { 8: canvas(8, []) }),
    false,
  );
  for (const target_node_ids of [undefined, []]) {
    assert.equal(
      canvasRunTargetsDeleted(
        { ...completedRun, target_node_ids },
        { 9: canvas(9, []) },
      ),
      false,
    );
  }
});

test("explicit canvas and category scopes remain isolated", () => {
  const canvases = { 9: canvas(9, []), 8: canvas(8, ["member"], 4) };
  assert.equal(canvasRunTargetsDeleted(completedRun, canvases), true);
  assert.equal(
    canvasRunTargetsDeleted(
      { ...completedRun, canvas_id: 0, asset_cate_id: 3 },
      canvases,
    ),
    true,
  );
  assert.equal(
    canvasRunTargetsDeleted(
      { ...completedRun, canvas_id: 0, asset_cate_id: 4 },
      canvases,
    ),
    false,
  );
  assert.equal(
    canvasRunTargetsDeleted(
      { ...completedRun, canvas_id: 0, asset_cate_id: 5 },
      canvases,
    ),
    false,
  );
});

test("run normalization keeps only declared target IDs", () => {
  assert.deepEqual(
    normalizeCanvasRunRef({
      ...completedRun,
      target_node_ids: ["start", "member", "", null, 1],
    }).target_node_ids,
    ["start", "member"],
  );
});
