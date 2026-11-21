import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loader } from "./writing_test_loader.mjs";

const load = loader({ "./space-api": {}, "@dever/front-plugin": { getCompatModule: () => ({}) } });
const { automaticCanvasConnectionChoice, resolveCanvasConnection } = load(fileURLToPath(new URL(
  "../front/src/nodes/body-work/space/space-canvas-connection.ts", import.meta.url,
)));

function power(id, outputType, kind = "text", composerDraft) {
  return { id, type: "power", kind, outputType, power: { kind, outputType }, composerDraft };
}

function resolve(source, target, { nodes = [], edges = [], params } = {}) {
  return resolveCanvasConnection({ source, target, nodes: [source, target, ...nodes], edges, items: [], params, referenceOnly: true });
}

test("whole settings can only supply storyboard structure, never text or media", () => {
  const source = power("setting", "setting");
  const storyboard = power("storyboard", "storyboard");
  assert.equal(resolve(source, storyboard).description, "复用角色、场景、道具");
  assert.equal(resolve(source, power("video", "video_compose", "video")).kind, "invalid");
  assert.equal(resolve(source, power("speech", "speech", "audio"), { params: [{ key: "text", type: "textarea" }] }).kind, "invalid");
  const other = power("other-setting", "setting");
  assert.equal(resolve(source, storyboard, {
    nodes: [other], edges: [{ from: "stage", logicalFrom: other.id, to: storyboard.id, purpose: "structure" }],
  }).reason, "一个分镜只能引用一份共用设定");
});

test("text can only bind to a free writable parameter", () => {
  const source = power("text", "text");
  const prompt = { id: 1, name: "提示词", key: "prompt", type: "textarea" };
  const text = { id: 2, name: "台词", key: "text", type: "input" };
  const target = power("speech", "speech", "audio", { paramBindings: { prompt: { sourceNodeId: "existing", sourceOutput: "primary_text" } } });
  assert.equal(resolve(source, target).kind, "form");
  assert.equal(resolve(source, target, { params: [prompt] }).kind, "invalid");
  assert.equal(automaticCanvasConnectionChoice(resolve(source, target, { params: [prompt, text] })).key, "text");
  assert.equal(automaticCanvasConnectionChoice(resolve(source, power("new", "speech", "audio"), { params: [prompt, text] })), undefined);
});

test("media references use accepted kinds and available capacity, not the target output type", () => {
  const source = power("image", "image", "image");
  const target = power("image-edit", "image", "image");
  const params = [
    { id: 1, key: "subject", name: "主体图", type: "file", accepted_kinds: ["image"] },
    { id: 2, key: "style", name: "风格图", type: "file", accepted_kinds: ["image"] },
    { id: 3, key: "audio", name: "参考音频", type: "file", accepted_kinds: ["audio"] },
  ];
  const plan = resolve(source, target, { params });
  assert.equal(plan.kind, "media");
  assert.deepEqual(Array.from(plan.options, ({ key }) => key).sort(), ["style", "subject"]);
  assert.equal(automaticCanvasConnectionChoice(plan), undefined);
  const existing = power("existing", "image", "image");
  assert.equal(automaticCanvasConnectionChoice(resolve(source, target, {
    params, nodes: [existing], edges: [{ id: "existing-image", from: existing.id, to: target.id, mediaUsage: "subject" }],
  })).key, "style");
  assert.equal(resolve(source, target, { params: params.slice(2) }).kind, "invalid");
  assert.equal(resolve(source, power("compose", "video_compose", "video")).kind, "invalid");
  assert.equal(resolve(power("clip", "video", "video"), power("compose", "video_compose", "video")).kind, "direct");
});
