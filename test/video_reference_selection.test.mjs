import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { loader, ts } from "./writing_test_loader.mjs";

const host = fileURLToPath(new URL("../../../..//front/src/components/agent/", import.meta.url));
function functions(path, names, globals = {}) {
  const source = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const selected = source.statements.filter((node) => ts.isFunctionDeclaration(node) && names.includes(node.name?.text));
  assert.equal(selected.length, names.length);
  const code = ts.transpileModule(selected.map((node) => node.getText(source)).join("\n"), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
  return runInNewContext(`${code}\n({${names.join(",")}})`, { exports: {}, ...globals });
}
const options = functions(host + "power-param-option-dialog.tsx", ["resolveParamOption", "paramOptionRequestValue"]);
const conditions = functions(host + "stream-request-params.tsx", ["filterActivePowerParams", "isPowerParamActive", "powerParamConditionValue", "normalizePowerParamConditionOption"], {
  ...options, optionRequestValue: options.paramOptionRequestValue,
});
const load = loader({
  "@dever/front-plugin": { getCompatModule: (key) => key === "@/components/agent/stream-request-params" ? conditions : {} },
  __globals: { window: { appRuntime: {}, location: { host: "test.local", hostname: "test.local", protocol: "http:" } } },
});
const space = fileURLToPath(new URL("../front/src/nodes/body-work/space/", import.meta.url));
const media = load(space + "space-media-references.tsx");
const { persistedCanvasState } = load(space + "space-canvas-state.ts");
const { normalizeCanvasComposerDraftOrDefault } = load(space + "space-model.ts");
const { referenceMediaAliasAtPosition } = load(fileURLToPath(new URL("../../../../front/src/components/reference-composer/reference-alias.ts", import.meta.url)));
const plain = (value) => value === undefined ? undefined : JSON.parse(JSON.stringify(value));
const urls = Array.from({ length: 9 }, (_, index) => `https://fixture.invalid/${index + 1}.png`);
const items = [{ id: "asset:1", refId: 1, refType: "asset", versionID: 2, title: "九张图", kind: "image", source: "current", output: { images: urls }, preview: {} }];
const basePart = { type: "reference", ref_type: "asset", ref_id: 1, ref_version_id: 2, label: "九张图", ref_media_count: 9, usage: "firstFrame" };
const original = { version: 1, parts: [{ type: "text", text: "保持提示词" }, basePart] };
const params = [
  { id: 20, key: "referenceMode", name: "参考方式", type: "option", default_value: "frames", options: [{ id: 1, value: "frames" }, { id: 2, value: "references" }] },
  { id: 2, key: "firstFrame", name: "首帧", type: "file", max_files: 1, accepted_kinds: ["image"], active_when_key: "referenceMode", active_when_value: "frames" },
  { id: 3, key: "lastFrame", name: "尾帧", type: "file", max_files: 1, accepted_kinds: ["image"], active_when_key: "referenceMode", active_when_value: "frames" },
  { id: 4, key: "images", name: "图片", type: "files", max_files: 9, accepted_kinds: ["image"], active_when_key: "referenceMode", active_when_value: "references" },
];
const values = { referenceMode: "frames", speed: "标准", resolution: "512", duration: "4" };
const node = { type: "power", kind: "video", outputType: "general", power: { kind: "video" } };
const plan = (content, requestedMode = "per_image", nextValues = values) => media.resolveCanvasMultiImagePlan({ node, content, items, connections: [], params, values: nextValues, requestedMode });
const transition = (content, previousMode, nextMode, selections, previousValues = values, nextValues = values) =>
  media.switchCanvasMediaSelection({ content, items, connections: [], params, previousValues, nextValues, previousMode, nextMode, selections });
const candidate = (index, content) => ({ part: media.canvasImageReferenceParts(content, items)[0], media: { url: urls[index - 1], index }, label: `图${index}` });

test("one selected image and empty selection keep both generation choices", () => {
  for (const part of [{ ...basePart, ref_media_url: urls[0], ref_media_index: 1 }, { ...basePart, ref_media_excluded: true }]) {
    const current = plan({ version: 1, parts: [part] });
    assert.equal(current.active, true);
    assert.equal(current.mode, "per_image");
    assert.deepEqual(Array.from(current.options, (option) => [option.label, option.enabled]), [["每图一条视频", true], ["首尾帧生成", true]]);
  }
  assert.equal(plan(original).imageCount, 9);
  assert.equal(plan(original, "shared_reference").options[1].enabled, true);
  assert.deepEqual(values, { referenceMode: "frames", speed: "标准", resolution: "512", duration: "4" });
});

test("same nine-image source binds separate first and last images and validates roles", () => {
  let state = transition(original, "per_image", "shared_reference");
  assert.equal(plan(state.content, "shared_reference").error, "请选择首帧图片");
  state.content = media.setCanvasFrameSelection(state.content, media.canvasImageReferenceParts(state.content, items), "firstFrame", candidate(1, state.content));
  state.content = media.setCanvasFrameSelection(state.content, media.canvasImageReferenceParts(state.content, items), "lastFrame", candidate(4, state.content));
  const current = plan(state.content, "shared_reference");
  assert.equal(current.explicitFramePair, true);
  assert.equal(current.imageCount, 2);
  assert.equal(current.error, "");
  assert.equal(media.canvasMediaUsageError([], state.content, items, media.mediaUsageOptions(params.slice(1, 3)), {}, true, "shared_reference"), "");
  assert.deepEqual(plain(state.content.parts[1].ref_media_items), [{ url: urls[0], index: 1, usage: "firstFrame" }, { url: urls[3], index: 4, usage: "lastFrame" }]);
  assert.equal(items[0].output.images.length, 9);
  assert.equal(original.parts[1].ref_media_items, undefined);
  assert.throws(() => media.setCanvasFrameSelection(state.content, media.canvasImageReferenceParts(state.content, items), "lastFrame", candidate(1, state.content)), /另一个位置/);
});

test("mode round trips restore all nine images and an ordered custom subset", () => {
  for (const content of [original, { version: 1, parts: [{ ...basePart, ref_media_items: [3, 1, 5].map((index) => ({ url: urls[index - 1], index })) }] }]) {
    let state = transition(content, "per_image", "shared_reference");
    state.content = media.setCanvasFrameSelection(state.content, media.canvasImageReferenceParts(state.content, items), "firstFrame", candidate(2, state.content));
    state.content = media.setCanvasFrameSelection(state.content, media.canvasImageReferenceParts(state.content, items), "lastFrame", candidate(8, state.content));
    const pair = plain(state.content.parts.filter((part) => part.type === "reference")[0].ref_media_items);
    const batch = transition(state.content, "shared_reference", "per_image", state.selections);
    assert.equal(plan(batch.content).imageCount, content === original ? 9 : 3);
    const restored = transition(batch.content, "per_image", "shared_reference", batch.selections);
    assert.deepEqual(plain(restored.content.parts.filter((part) => part.type === "reference")[0].ref_media_items), pair);
    assert.deepEqual(plain(batch.content.parts.filter((part) => part.type === "reference")[0].ref_media_items), content.parts.find((part) => part.type === "reference").ref_media_items || undefined);
  }
});

test("switching reference inputs keeps frame-pair and joint-reference selections independent", () => {
  let state = transition(original, "per_image", "shared_reference");
  state.content = media.setCanvasFrameSelection(state.content, media.canvasImageReferenceParts(state.content, items), "firstFrame", candidate(1, state.content));
  state.content = media.setCanvasFrameSelection(state.content, media.canvasImageReferenceParts(state.content, items), "lastFrame", candidate(4, state.content));
  const references = { ...values, referenceMode: "references" };
  const joint = transition(state.content, "shared_reference", "shared_reference", state.selections, values, references);
  assert.equal(plan(joint.content, "shared_reference", references).options[1].label, "多图共同参考");
  assert.equal(joint.content.parts[1].usage, "images");
  assert.ok(joint.content.parts[1].ref_media_items.every((entry) => !entry.usage));
  const restored = transition(joint.content, "shared_reference", "shared_reference", joint.selections, references, values);
  assert.deepEqual(plain(restored.content.parts[1].ref_media_items), plain(state.content.parts[1].ref_media_items));
});

test("replacing and clearing frames changes only frame assignments", () => {
  let content = transition(original, "per_image", "shared_reference").content;
  content = media.setCanvasFrameSelection(content, media.canvasImageReferenceParts(content, items), "firstFrame", candidate(1, content));
  content = media.setCanvasFrameSelection(content, media.canvasImageReferenceParts(content, items), "lastFrame", candidate(4, content));
  const replaced = media.setCanvasFrameSelection(content, media.canvasImageReferenceParts(content, items), "firstFrame", candidate(2, content));
  assert.equal(media.canvasFrameSelections(media.canvasImageReferenceParts(replaced, items)).find((entry) => entry.media.usage === "firstFrame").media.index, 2);
  const cleared = media.setCanvasFrameSelection(replaced, media.canvasImageReferenceParts(replaced, items), "lastFrame");
  assert.equal(plan(cleared, "shared_reference").imageCount, 1);
  assert.equal(plan(cleared, "shared_reference").error, "");
  const missingFirst = media.setCanvasFrameSelection(content, media.canvasImageReferenceParts(content, items), "firstFrame");
  assert.match(plan(missingFirst, "shared_reference").error, /同时选择首帧/);
  assert.equal(items[0].output.images.length, 9);
});

test("adding a candidate group preserves chosen frames and allows selection from a different source", () => {
  let content = transition(original, "per_image", "shared_reference").content;
  content = media.setCanvasFrameSelection(content, media.canvasImageReferenceParts(content, items), "firstFrame", candidate(1, content));
  const otherItem = { ...items[0], id: "asset:2", refId: 2, title: "另一组图" };
  const nextItems = [...items, otherItem];
  const addedPart = { ...basePart, ref_id: 2, label: "另一组图" };
  const next = media.reconcileCanvasMediaUsages(content, { ...content, parts: [...content.parts, addedPart] }, nextItems, media.mediaUsageOptions(params.slice(1, 3)), [], "shared_reference").content;
  assert.equal(next.parts.at(-1).ref_media_excluded, true);
  assert.equal(media.canvasFrameSelections(media.canvasImageReferenceParts(next, nextItems)).length, 1);
  const chosen = media.setCanvasFrameSelection(next, media.canvasImageReferenceParts(next, nextItems), "lastFrame", { part: next.parts.at(-1), media: { url: urls[3], index: 4 }, label: "另一组图4" });
  assert.equal(media.canvasFrameSelections(media.canvasImageReferenceParts(chosen, nextItems)).find((entry) => entry.media.usage === "lastFrame").part.ref_id, 2);
  const source = { id: "second", kind: "image", asset: { id: 2, version_id: 2, content: { images: urls } }, output: { images: urls } };
  assert.equal(media.nextMediaUsageForSources([], media.mediaUsageOptions(params.slice(1, 3)), [source], content, nextItems, "shared_reference").error, "");
  const saved = media.rememberCanvasMediaSelection(undefined, "frames:per_image", original, nextItems, []);
  const restored = media.switchCanvasMediaSelection({content:chosen,items:nextItems,connections:[],params,previousValues:values,nextValues:values,previousMode:"shared_reference",nextMode:"per_image",selections:saved});
  assert.equal(restored.content.parts.find((part)=>part.ref_id===2).ref_media_excluded,true);
  assert.equal(media.resolveCanvasMultiImagePlan({node,content:restored.content,items:nextItems,connections:[],params,values,requestedMode:"per_image"}).imageCount,9);
});

test("mode drafts persist through the real canvas serializer", () => {
  const state = transition(original, "per_image", "shared_reference");
  const draft = normalizeCanvasComposerDraftOrDefault({ prompt: "保持提示词", promptContent: state.content, paramValues: values, multiImageMode: "shared_reference", mediaSelections: state.selections });
  const persisted = persistedCanvasState({ assetCateId: 1, nextNodeNo: 2, viewport: {}, edges: [], nodes: [{ id: "video", type: "power", title: "视频", composerDraft: draft }] });
  const saved = plain(persisted.nodes[0].composer_draft);
  assert.equal(saved.multi_image_mode, "shared_reference");
  assert.equal(saved.media_selections["frames:per_image"].parts[0].ref_media_count, 9);
  assert.equal(saved.prompt_content.parts[1].ref_media_excluded, true);
  assert.deepEqual(saved.param_values, values);
});

test("image, audio and text capabilities keep their existing media controls", () => {
  for (const otherNode of [{kind:"image"},{kind:"audio"},{kind:"text"},{kind:"video",outputType:"lip_sync"}]) {
    const current = media.resolveCanvasMultiImagePlan({ node: otherNode, content: original, items, connections: [], params, values, requestedMode: "per_image" });
    assert.equal(current.active, false);
  }
});

test("unused candidate sources do not reserve media aliases", () => {
  const document = { descendants(visitor) {
    for (const [position, attrs] of [{refType:"asset",refId:1,previewKind:"image",mediaExcluded:true,mediaCount:9},{refType:"asset",refId:2,previewKind:"image",mediaItems:[{index:4,url:urls[3]}]}].entries()) visitor({type:{name:"reference"},attrs},position);
  }};
  assert.equal(referenceMediaAliasAtPosition(document, 0), "");
  assert.equal(referenceMediaAliasAtPosition(document, 1), "图1");
});
