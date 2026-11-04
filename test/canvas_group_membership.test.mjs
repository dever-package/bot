import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { loader } from "./writing_test_loader.mjs";

const load = loader({
  "@dever/front-plugin": { getCompatModule: () => ({}) },
  __globals: { window: { appRuntime: {}, location: { host: "test.local", hostname: "test.local", protocol: "http:" } } },
});
const source = (name) => fileURLToPath(new URL(`../front/src/nodes/body-work/space/${name}.ts`, import.meta.url));
const { withMovedCanvasNode, withCanvasNodeGroupAtPosition, constrainScriptGroupMemberPosition, normalizeScriptGroupMembership } = load(source("space-group-model"));
const { buildStoryboardFrameIndex } = load(source("space-storyboard-frame"));

function fixture() {
  return [
    { id: "script", type: "power", title: "分镜脚本", x: 1000, y: 800, width: 800, height: 460, storyboardMaterializedSignature: "materialized" },
    { id: "script-group", type: "group", x: 100, y: 100, width: 432, height: 496, group: { origin: "script", sourceNodeId: "script" } },
    { id: "frame-image", type: "power", title: "首帧", x: 124, y: 172, width: 180, height: 180, groupId: "script-group", storyboardItem: { sourceNodeId: "script", itemType: "shot_image", itemId: "first" } },
    { id: "music", type: "power", title: "音乐", x: 700, y: 100, width: 240, height: 160, composerDraft: { prompt: "my music", paramValues: { duration: 30 } }, resultOutput: { audios: ["https://example.test/original.mp3"] } },
  ];
}

test("moving an ordinary node across a hidden script group keeps it on the canvas", () => {
  const nodes = fixture();
  const position = { x: 150, y: 130 };
  const moved = withCanvasNodeGroupAtPosition(withMovedCanvasNode(nodes, "music", position), "music", position);
  const music = moved.find((node) => node.id === "music");
  assert.equal(music.groupId, undefined);
  assert.equal(music.x, position.x);
  assert.equal(music.y, position.y);
  assert.equal(music.composerDraft, nodes[3].composerDraft);
  assert.equal(music.resultOutput, nodes[3].resultOutput);
  const frame = buildStoryboardFrameIndex(moved, () => false).frames[0];
  assert.equal(frame.memberNodeIds.includes("music"), false);
});

test("manual groups still accept and release ordinary nodes", () => {
  const nodes = [...fixture(), { id: "manual", type: "group", x: 100, y: 100, width: 432, height: 496, group: { origin: "manual" } }];
  const inside = { x: 150, y: 130 };
  const joined = withCanvasNodeGroupAtPosition(withMovedCanvasNode(nodes, "music", inside), "music", inside);
  assert.equal(joined.find((node) => node.id === "music").groupId, "manual");
  const outside = { x: 800, y: 650 };
  const left = withCanvasNodeGroupAtPosition(withMovedCanvasNode(joined, "music", outside), "music", outside);
  assert.equal(left.find((node) => node.id === "music").groupId, undefined);
});

test("real storyboard members stay owned by their script group", () => {
  const nodes = fixture();
  const position = constrainScriptGroupMemberPosition(nodes, "frame-image", { x: 900, y: 900 });
  const moved = withCanvasNodeGroupAtPosition(withMovedCanvasNode(nodes, "frame-image", position), "frame-image", position);
  assert.equal(moved.find((node) => node.id === "frame-image").groupId, "script-group");
  assert.equal(buildStoryboardFrameIndex(moved, () => false).frames[0].memberNodeIds.includes("frame-image"), true);
});

test("an accidentally absorbed node is detached without changing its content or position", () => {
  const nodes = fixture();
  const music = { ...nodes[3], groupId: "script-group" };
  nodes[3] = music;
  const repaired = normalizeScriptGroupMembership(nodes);
  const restored = repaired.find((node) => node.id === "music");
  assert.equal(restored.groupId, undefined);
  assert.equal(restored.x, music.x);
  assert.equal(restored.y, music.y);
  assert.equal(restored.resultOutput, music.resultOutput);
  assert.equal(restored.composerDraft, music.composerDraft);
  assert.equal(repaired[2], nodes[2]);
  assert.equal(normalizeScriptGroupMembership(repaired), repaired);
  assert.equal(buildStoryboardFrameIndex(repaired, () => false).frames[0].memberNodeIds.includes("music"), false);
});

test("loading and saving restores ordinary nodes and their external connections", () => {
  const { normalizeCanvasState } = load(source("space-model"));
  const { persistedCanvasState } = load(source("space-canvas-state"));
  const nodes = fixture();
  nodes[3] = { ...nodes[3], groupId: "script-group" };
  nodes.push({ id: "input", type: "asset", title: "参考音频", x: 800, y: 100, width: 180, height: 180 });
  const saved = persistedCanvasState({ assetCateId: 1, nextNodeNo: 1, nodes, viewport: {}, edges: [{ id: "music-ref", from: "input", to: "script-group", logicalFrom: "input", logicalTo: "music", purpose: "media" }] });
  const canvas = normalizeCanvasState(saved);
  const music = canvas.nodes.find((node) => node.id === "music");
  assert.equal(canvas.nodes.length, nodes.length);
  assert.equal(music.groupId, undefined);
  assert.equal(music.composerDraft.prompt, nodes[3].composerDraft.prompt);
  assert.equal(music.composerDraft.paramValues.duration, 30);
  assert.equal(music.resultOutput.audios[0], nodes[3].resultOutput.audios[0]);
  assert.equal(canvas.edges[0].from, "input");
  assert.equal(canvas.edges[0].to, "music");
  assert.equal(canvas.edges[0].purpose, "media");
  assert.equal(canvas.nodes.find((node) => node.id === "frame-image").groupId, "script-group");
  const roundTrip = normalizeCanvasState(persistedCanvasState(canvas));
  assert.equal(roundTrip.nodes.find((node) => node.id === "music").groupId, "");
  assert.equal(roundTrip.edges[0].to, "music");
});
