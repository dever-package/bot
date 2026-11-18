import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loader } from "./writing_test_loader.mjs";

const load = loader();
const { invalidateStoryboardFrameResults } = load(fileURLToPath(new URL(
  "../front/src/nodes/body-work/space/space-storyboard-result-invalidation.ts", import.meta.url,
)));
const { canvasNodeCoversRunResult } = load(fileURLToPath(new URL(
  "../front/src/nodes/body-work/space/space-result.ts", import.meta.url,
)));

test("changed storyboard frames cannot be restored from the invalidated run", () => {
  const previous = {
    id: "frame",
    storyboardItem: { sourceNodeId: "board", itemType: "shot_image", generatedPrompt: "before" },
    resultRef: { execution_id: 10, run_id: 20, asset_id: 30, version_id: 40 },
    asset: { id: 30, version_id: 40 },
  };
  const nodes = [{ ...previous, storyboardItem: { ...previous.storyboardItem, generatedPrompt: "after" } }];
  assert.equal(invalidateStoryboardFrameResults([previous], nodes, "board"), true);
  assert.equal(nodes[0].asset, undefined);
  assert.equal(nodes[0].resultRef.asset_id, undefined);
  assert.equal(nodes[0].resultRef.version_id, undefined);
  assert.equal(canvasNodeCoversRunResult(nodes[0], { execution_id: 10, run_id: 20 }, undefined, false), true);
  assert.equal(canvasNodeCoversRunResult(nodes[0], { execution_id: 9, run_id: 19 }, undefined, false), true);
  assert.equal(canvasNodeCoversRunResult(nodes[0], { execution_id: 11, run_id: 21 }, undefined, false), false);
});

test("missing results from an unfinished run can still be recovered", () => {
  const node = { resultRef: { execution_id: 10, run_id: 20, status: "running" } };
  assert.equal(canvasNodeCoversRunResult(node, { execution_id: 10, run_id: 20 }, undefined, false), false);
});

test("更新同一参考图的版本会解除当前镜头绑定", () => {
  const previous = {
    id: "frame",
    storyboardItem: { sourceNodeId: "board", itemType: "shot_image", generatedPrompt: "柜台前", externalReferenceAssetIds: [10] },
    composerDraft: { promptContent: { version: 1, parts: [{ type: "reference", ref_type: "asset", ref_id: 10, label: "柜台", ref_version_id: 11 }] } },
    resultRef: { asset_id: 30, version_id: 40 },
  };
  const next = JSON.parse(JSON.stringify(previous));
  next.composerDraft.promptContent.parts[0].ref_version_id = 12;
  const nodes = [next];
  assert.equal(invalidateStoryboardFrameResults([previous], nodes, "board"), true);
  assert.equal(nodes[0].resultRef.status, "invalidated");
});

test("writing the generated prompt back into the draft keeps frame results", () => {
  const item = { sourceNodeId: "board", itemType: "shot_image", generatedPrompt: "首帧：柜台前两人" };
  const previous = {
    id: "frame",
    storyboardItem: item,
    composerDraft: { prompt: "" },
    resultRef: { run_id: 20, asset_id: 30, version_id: 40 },
    asset: { id: 30, version_id: 40 },
  };
  const nodes = [{ ...previous, composerDraft: { prompt: "首帧：柜台前两人" } }];
  assert.equal(invalidateStoryboardFrameResults([previous], nodes, "board"), false);
  assert.equal(nodes[0].resultRef.asset_id, 30);

  const edited = [{ ...previous, composerDraft: { prompt: "首帧：改成特写" } }];
  assert.equal(invalidateStoryboardFrameResults([previous], edited, "board"), true);
});
