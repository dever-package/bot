import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import path from "node:path";
import test from "node:test";
import { loader } from "./writing_test_loader.mjs";

const root = new URL("../front/src/nodes/body-work/space/", import.meta.url).pathname;
const load = loader({ "@dever/front-plugin": { getCompatModule() { return {}; } }, __globals: { crypto: webcrypto, structuredClone, window: { appRuntime: {}, location: { host: "test.local", hostname: "test.local", protocol: "http:" }, localStorage: { getItem() { return null; } } } } });
const { createStoryboardShot, parseStoryboardOutput } = load(path.join(root, "space-storyboard.ts"));
const { STORYBOARD_DERIVED_GROUP_SPECS } = load(path.join(root, "space-storyboard-derived-specs.ts"));
const { STORYBOARD_FRAME_PLAN_VERSION } = load(path.join(root, "space-storyboard-frame-plan.ts"));
const { invalidateStoryboardFrameResults } = load(path.join(root, "space-storyboard-result-invalidation.ts"));

function storyboard(shots, outputTarget = "final_video") {
  const materials = [
    { id: "girl", type: "character", name: "女孩", prompt: "米色风衣", reference_keys: [], voice: "" },
    { id: "owner", type: "character", name: "老周", prompt: "深色毛衣", reference_keys: [], voice: "" },
    { id: "shop", type: "scene", name: "书店", prompt: "旧书店", reference_keys: [], voice: "" },
    { id: "street", type: "scene", name: "街道", prompt: "清晨街道", reference_keys: [], voice: "" },
  ];
  return parseStoryboardOutput({
    type: "storyboard", version: 9, title: "测试", summary: "测试", target_shot_count: shots.length,
    target_duration: shots.length * 4, narrator_voice: "", visual_mode: "photoreal", style_prompt: "写实",
    aspect_ratio: "16:9", storyline: { setup: "a", development: "b", payoff: "c" }, references: [],
    // 派生条目只读镜头结构，草稿状态免去与本测试无关的确认校验。
    workflow: { status: "draft" }, production_plan: { output_target: outputTarget },
    materials,
    shots: shots.map((shot, index) => ({
      ...createStoryboardShot(index), beat: "动作", description: "画面", duration: 4,
      continuity_state: { entry: "站着", exit: "站着" }, match_previous: false, continue_previous: false, ...shot,
    })),
  });
}

const plain = (value) => JSON.parse(JSON.stringify(value ?? null));
const shotImages = (document) =>
  STORYBOARD_DERIVED_GROUP_SPECS.find((spec) => spec.key === "shot_images")
    .items(document, { framePlanVersion: STORYBOARD_FRAME_PLAN_VERSION });

test("换场首帧沿用人物最近一次出镜的视频尾帧，只取共同人物", () => {
  const document = storyboard([
    { id: "s1", material_ids: ["girl", "owner", "shop"] },
    { id: "s2", material_ids: ["girl", "owner", "shop"], continue_previous: true },
    { id: "s3", material_ids: ["owner", "shop"], continue_previous: true },
    { id: "s4", material_ids: ["girl", "street"] },
  ]);
  const items = shotImages(document);
  const first = items.find((item) => item.id === "s1");
  assert.equal(first.continuityAnchor, undefined, "第一镜没有可沿用的画面");
  assert.deepEqual(plain(first.dependencyItems), []);
  const scene = items.find((item) => item.id === "s4");
  // s3 没有女孩，沿用的是女孩最近出镜的 s2。
  assert.deepEqual(plain(scene.dependencyItems), [{ type: "shot", id: "s2" }]);
  assert.equal(scene.continuityAnchor, "沿用人物外观：女孩");
  const refs = plain(scene.referenceItems);
  assert.ok(!refs.some((item) => item.type === "character" && item.id === "girl"), "沿用的人物只以真实画面为长相来源");
  assert.ok(refs.some((item) => item.type === "scene" && item.id === "street"), "新场景仍参考场景设定");
});

test("没有共同人物或不生成视频时，换场首帧不依赖之前的镜头", () => {
  const noShared = shotImages(storyboard([
    { id: "s1", material_ids: ["owner", "shop"] },
    { id: "s2", material_ids: ["girl", "street"] },
  ])).find((item) => item.id === "s2");
  assert.equal(noShared.continuityAnchor, undefined);
  assert.deepEqual(plain(noShared.dependencyItems), []);
  const imagesOnly = shotImages(storyboard([
    { id: "s1", material_ids: ["girl", "shop"] },
    { id: "s2", material_ids: ["girl", "street"] },
  ], "shot_images")).find((item) => item.id === "s2");
  assert.equal(imagesOnly.continuityAnchor, undefined);
  assert.deepEqual(plain(imagesOnly.dependencyItems), []);
});

test("页面恢复补齐上游镜头结果时，同批次已生成的换场首帧不失效", () => {
  const item = (type, id, extra = {}) => ({ sourceNodeId: "board", itemType: type, itemId: id, generatedPrompt: id, ...extra });
  const shot3 = (ref) => ({ id: "v3", type: "power", storyboardItem: item("shot", "s3"), resultRef: ref });
  const frame4 = { id: "i4", type: "power", storyboardItem: item("shot_image", "s4", { dependencyNodeIds: ["v3"], referenceNodeIds: ["v3"], continuityAnchor: "沿用人物外观：女孩" }), resultRef: { run_id: 7, asset_id: 41, version_id: 51 } };
  const previous = [shot3({ run_id: 7 }), frame4];
  const nodes = [shot3({ run_id: 7, asset_id: 31, version_id: 32 }), { ...frame4 }];
  assert.equal(invalidateStoryboardFrameResults(previous, nodes, "board", previous), false);
  assert.equal(nodes[1].resultRef.version_id, 51);
  // 上游真正换了新版本（另一批次之后重做），下游首帧仍要失效。
  const redone = [shot3({ run_id: 8, asset_id: 31, version_id: 33 }), { ...frame4 }];
  const before = [shot3({ run_id: 7, asset_id: 31, version_id: 32 }), frame4];
  assert.equal(invalidateStoryboardFrameResults(before, redone, "board", before), true);
  assert.equal(redone[1].resultRef.status, "invalidated");
});
