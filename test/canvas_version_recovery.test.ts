import assert from "node:assert/strict";
import test from "node:test";

import { canvasNodeCoversRunResult } from "../front/src/nodes/body-work/space/space-result.ts";
import { normalizeCanvasNodeResultPayload } from "../front/src/nodes/body-work/space/space-runner.ts";

const currentAssetNode = {
  asset: {
    id: 938,
    version_id: 1505,
  },
  resultRef: {
    asset_id: 938,
    version_id: 1505,
  },
};

function successfulResult(assetID: number, versionID: number) {
  return {
    node_key: "power-node",
    status: "success",
    asset_id: assetID,
    version_id: versionID,
    asset: {
      id: assetID,
      version_id: versionID,
      version: { id: versionID },
    },
  };
}

test("node result normalization preserves canonical asset references", () => {
  const result = normalizeCanvasNodeResultPayload({
    node_key: "power-node",
    status: "success",
    asset_id: 938,
    version_id: 1505,
  });

  assert.equal(result?.asset_id, 938);
  assert.equal(result?.version_id, 1505);
});

test("current asset version replaces an older recovered run result", () => {
  assert.equal(
    canvasNodeCoversRunResult(
      currentAssetNode,
      { run_id: 2675 },
      successfulResult(938, 1506),
    ),
    true,
  );
});

test("a result for another asset must still be recovered", () => {
  assert.equal(
    canvasNodeCoversRunResult(
      currentAssetNode,
      { run_id: 2675 },
      successfulResult(939, 1506),
    ),
    false,
  );
});

test("a result for the selected version is not treated as replaced", () => {
  assert.equal(
    canvasNodeCoversRunResult(
      currentAssetNode,
      { run_id: 2675 },
      successfulResult(938, 1505),
    ),
    false,
  );
});

test("failed results still restore their error state", () => {
  assert.equal(
    canvasNodeCoversRunResult(
      currentAssetNode,
      { run_id: 2675 },
      {
        ...successfulResult(938, 1506),
        status: "fail",
      },
    ),
    false,
  );
});

test("an already applied run remains covered by its run identity", () => {
  assert.equal(
    canvasNodeCoversRunResult(
      {
        resultRef: {
          run_id: 2675,
          asset_id: 938,
          version_id: 1506,
        },
      },
      { run_id: 2675 },
      successfulResult(938, 1506),
    ),
    true,
  );
});
