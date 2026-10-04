import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

test("storyboard run sends a confirmed source snapshot only in the execution canvas", () => {
  const source = readFileSync(
    new URL("../front/src/nodes/body-work/space/space-api.ts", import.meta.url),
    "utf8",
  );
  const run = source.slice(
    source.indexOf("export async function runSpaceCanvas("),
    source.indexOf("export async function generateSpaceCanvasNodeTitle("),
  );

  assert.match(run, /const canvas = persistedCanvasState\(storyboardExecutionCanvas\(input\.canvas\)\)/);
  assert.match(run, /input\.executionScope === "storyboard_frame"/);
  assert.match(run, /startNode\?\.storyboardItem\?\.sourceNodeId/);
  assert.match(run, /group\?\.origin === "script" \? group\.sourceNodeId/);
  assert.match(run, /sourceNode\?\.asset\?\.version\?\.content,[\s\S]*sourceNode\?\.resultOutput/);
  assert.match(run, /isStoryboardConfirmed\(storyboard\)/);
  assert.match(run, /serializedSource\.result_output = sourceContent/);
  assert.match(run, /canvas,\s*input: input\.runInput/);
  assert.doesNotMatch(run, /input\.canvas\.nodes\[[^\]]+\]\.resultOutput\s*=/);
});
