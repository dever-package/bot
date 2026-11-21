import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import path from "node:path";
import test from "node:test";
import { loader } from "./writing_test_loader.mjs";
import { completeOutline, emptyPreferences } from "./writing_fixture.mjs";

const root = new URL("../front/src/nodes/body-work/space/", import.meta.url).pathname;
const load = loader({ "@dever/front-plugin": { getCompatModule() { return {}; } }, __globals: { crypto: webcrypto, structuredClone, window: { appRuntime: {}, location: { host: "test.local", hostname: "test.local", protocol: "http:" }, localStorage: { getItem() { return null; } } } } });
const { normalizeCanvasState } = load(path.join(root, "space-model.ts"));
const { canvasConnectionPurpose } = load(path.join(root, "space-canvas-edge.ts"));
const { persistedCanvasState } = load(path.join(root, "space-canvas-state.ts"));
const { syncStorySettingGroup, syncSettingDerivedGroups } = load(path.join(root, "space-story-setting.ts"));
const { storyboardSettingNodes, storyboardSettingSource, storySettingUpdateReason } = load(path.join(root, "space-story-setting-reference.ts"));
const { createStoryboardShot } = load(path.join(root, "space-storyboard.ts"));
const { materializeCanvasStoryboardDerivedGroups, refreshCanvasStoryboardDerivedGroups, canvasStoryboardSourceRequiresMaterialization, restoredStoryboardDerivedPrompt } = load(path.join(root, "space-storyboard-derived-groups.ts"));
const { canvasReferenceTargetsFromContent } = load(path.join(root, "space-reference-content.ts"));
const { pullStoryChapters, storyChapterUpdateReason } = load(path.join(root, "space-story-chapters.ts"));
const { syncStoryComposition } = load(path.join(root, "space-story-composition.ts"));
const { storyboardFrameScopes, storyboardFrameRunSummary } = load(path.join(root, "space-storyboard-frame.ts"));
const { parseStoryboardOutput } = load(path.join(root, "space-storyboard.ts"));
const { invalidateStoryboardFrameResults } = load(path.join(root, "space-storyboard-result-invalidation.ts"));
const { storyboardValidationIssues } = load(path.join(root, "space-storyboard-validation.ts"));
const plain = (value) => JSON.parse(JSON.stringify(value));
const assetCate = { id: 1, name: "素材", kind: "mixed", cardinality: "multiple", team_id: 1 };
const powers = [{ id: 2, kind: "image", outputType: "general" }, { id: 8, kind: "text", outputType: "setting" }];
function assertInvalidated(node) {
  assert.equal(node.resultRef.status, "invalidated", node.id);
  assert.equal(Boolean(node.resultRef.asset_id), false, node.id);
  assert.equal(Boolean(node.resultRef.version_id), false, node.id);
  assert.equal(node.asset, undefined, node.id);
}

test("设定连分镜直接传结构，普通文本连线继续绑定参数", () => {
  const board = { type: "power", outputType: "storyboard" };
  assert.equal(canvasConnectionPurpose({ type: "power", outputType: "setting" }, board), "structure");
  assert.equal(canvasConnectionPurpose({ type: "power", outputType: "general" }, board), "media");
  assert.equal(canvasConnectionPurpose({ type: "power", outputType: "setting" }, { type: "power", outputType: "general" }), "media");
});

function resultDependencyFixture() {
  const item = (id, type, source, references = []) => ({
    id, storyboardItem: { sourceNodeId: source, itemType: type, itemId: id, referenceNodeIds: references },
    resultRef: { asset_id: 100 + id.length, version_id: 200, run_id: 1 },
  });
  return [
    item("actor", "character", "setting"),
    item("frame", "shot_image", "one", ["actor"]),
    item("video", "shot", "one", ["frame"]),
    item("compose", "video_compose", "one"),
    item("next-frame", "shot_image", "two", ["video"]),
    item("next-video", "shot", "two", ["next-frame"]),
    item("next-compose", "video_compose", "two"),
    item("unrelated", "shot", "three"),
  ];
}

test("重做首尾图解除相关视频、跨章接续与合成绑定，保留新图和无关结果", () => {
  const previous = resultDependencyFixture();
  const nodes = structuredClone(previous);
  nodes.find((node) => node.id === "frame").resultRef = { asset_id: 105, version_id: 201, run_id: 2 };
  assert.equal(invalidateStoryboardFrameResults(nodes, nodes, "one", previous), true);
  for (const id of ["video", "compose", "next-frame", "next-video", "next-compose"]) {
    assertInvalidated(nodes.find((node) => node.id === id));
    assert.equal(nodes.find((node) => node.id === id).resultRef.run_id, 1);
  }
  assert.equal(nodes.find((node) => node.id === "frame").resultRef.version_id, 201);
  assert.ok(nodes.find((node) => node.id === "unrelated").resultRef);
  assert.ok(previous.find((node) => node.id === "video").resultRef);
});

test("替换共用形象使实际引用它的首尾图和视频待重做", () => {
  const previous = resultDependencyFixture();
  const nodes = structuredClone(previous);
  nodes[0].resultRef = { asset_id: 105, version_id: 201, run_id: 2 };
  invalidateStoryboardFrameResults(nodes, nodes, "one", previous);
  assertInvalidated(nodes.find((node) => node.id === "frame"));
  assertInvalidated(nodes.find((node) => node.id === "next-video"));
  assert.equal(nodes[0].resultRef.version_id, 201);
});

test("同批结果乱序恢复保留新视频，同版本补齐内容不当作换版", () => {
  for (const batchKey of ["run_id", "execution_id"]) {
    const previous = resultDependencyFixture();
    const nodes = structuredClone(previous);
    for (const id of ["frame", "video"]) {
      const node = nodes.find((item) => item.id === id);
      node.resultRef = { asset_id: 105, version_id: 201, [batchKey]: 2 };
    }
    invalidateStoryboardFrameResults(nodes, nodes, "one", previous);
    assert.equal(nodes.find((node) => node.id === "video").resultRef.version_id, 201);
    assertInvalidated(nodes.find((node) => node.id === "compose"));
  }
  const previous = resultDependencyFixture();
  const nodes = structuredClone(previous);
  nodes[1].resultOutput = { images: ["https://example.test/frame.png"] };
  assert.equal(invalidateStoryboardFrameResults(nodes, nodes, "one", previous), false);
  assert.ok(nodes.find((node) => node.id === "video").resultRef);
});

test("只修改视频动作也解除视频绑定，不要求参考图先改变", () => {
  const previous = resultDependencyFixture();
  const nodes = structuredClone(previous);
  nodes.find((node) => node.id === "video").storyboardItem.generatedPrompt = "新的动作";
  invalidateStoryboardFrameResults(previous, nodes, "one");
  assert.ok(nodes.find((node) => node.id === "frame").resultRef);
  assertInvalidated(nodes.find((node) => node.id === "video"));
});

test("设定是普通能力节点，从描述生成的文档派生形象，保存重开仍被两章共用", () => {
  let { canvas, group } = fixture();
  assert.equal(group.type, "power");
  assert.equal(group.outputType, "setting");
  assert.equal(group.group, undefined);
  const actor = canvas.nodes.find((node) => node.storyboardItem?.itemId === "outline-actor");
  actor.resultRef = { asset_id: 500, version_id: 600 };
  canvas = normalizeCanvasState(persistedCanvasState(canvas));
  group = canvas.nodes.find((node) => node.id === group.id);
  group.resultOutput.materials[0].prompt = "白色外套";
  canvas = syncSettingDerivedGroups({ canvas, settingNode: group, assetCate, powers });
  const changed = canvas.nodes.find((node) => node.id === actor.id);
  assert.equal(changed.resultRef.version_id, 600);
  assert.equal(changed.storyboardItem.generatedPrompt, "白色外套");
  for (const id of ["one", "two"]) assert.equal(storyboardSettingNodes(canvas.nodes, canvas.edges, id).get("character:outline-actor").id, actor.id);
});

test("独立分镜不连设定也能生成自己的素材，连线后共用不重复创建", () => {
  let { canvas, group } = fixture();
  canvas.edges = [];
  canvas = materializeCanvasStoryboardDerivedGroups({ canvas, sourceNodeId: "one", assetCate, powers });
  const actor = canvas.nodes.find((node) => node.storyboardItem?.sourceNodeId === "one" && node.storyboardItem.itemType === "character");
  assert.ok(actor);
  canvas.edges.push({ id: "shared", from: group.id, to: "two", purpose: "structure" });
  canvas = materializeCanvasStoryboardDerivedGroups({ canvas, sourceNodeId: "two", assetCate, powers });
  assert.equal(canvas.nodes.filter((node) => node.storyboardItem?.sourceNodeId === "two" && node.storyboardItem.itemType === "character").length, 0);
});

test("未配置设定能力时明确报错，不能偷偷借用其他文本能力", () => {
  const { canvas } = fixture();
  const empty = { ...canvas, nodes: canvas.nodes.filter((node) => node.id === "story"), edges: [] };
  assert.throws(() => syncStorySettingGroup({ canvas: empty, storyNodeId: "story", assetCate, powers: powers.filter((power) => power.outputType !== "setting") }), /配置设定能力/);
});

test("重新打开已有设定文档的画布会补建素材组，完成后不重复派生", () => {
  let { canvas, group } = fixture();
  canvas.nodes = canvas.nodes.filter((node) => node.id === group.id);
  canvas.edges = [];
  group = { ...group, asset: { id: 200, version: { id: 300, content: group.resultOutput } } };
  delete group.storyboardMaterializedSignature;
  delete group.resultOutput;
  canvas.nodes = [group];
  canvas = normalizeCanvasState(persistedCanvasState(canvas));
  // The asset is hydrated from the saved version after loading the canvas.
  canvas.nodes[0].asset = group.asset;
  assert.equal(canvasStoryboardSourceRequiresMaterialization(canvas.nodes[0], {}), true);
  canvas = materializeCanvasStoryboardDerivedGroups({ canvas, sourceNodeId: group.id, assetCate, powers });
  assert.ok(canvas.nodes.some((node) => node.storyboardItem?.sourceNodeId === group.id));
  assert.equal(canvasStoryboardSourceRequiresMaterialization(canvas.nodes.find((node) => node.id === group.id), {}), false);
  const next = materializeCanvasStoryboardDerivedGroups({ canvas, sourceNodeId: group.id, assetCate, powers });
  assert.equal(next.nodes.length, canvas.nodes.length);
});

test("全片合成按正文章序连接，重复同步保留设置，章节更新解除旧成片绑定", () => {
  let { canvas } = fixture();
  const story = canvas.nodes.find((node) => node.id === "story");
  story.resultOutput.units = [1, 2].map((n) => ({ unit_type: "chapter", id: `u${n}`, title: `第${n}章`, plan: "计划", children: [], asset_id: 100 + n, version_id: 200 + n, has_body: true }));
  const catalog = [...powers, { id: 3, kind: "text", outputType: "storyboard" }, { id: 4, kind: "video", outputType: "video_compose" }];
  canvas = pullStoryChapters({ canvas, storyNodeId: "story", unitIds: ["u2", "u1"], assetCate, powers: catalog });
  const boards = canvas.nodes.filter((node) => node.id.startsWith("chapter-"));
  boards[0].resultOutput = plain(canvas.nodes.find((node) => node.id === "one").resultOutput);
  canvas.nodes.push(...boards.map((board, index) => ({ id: `video${index}`, type: "power", storyboardItem: { sourceNodeId: board.id, itemType: "video_compose" }, resultRef: { asset_id: 301 + index, version_id: 401 + index } })));
  canvas = syncStoryComposition({ canvas, assetCate, powers: catalog });
  let film = canvas.nodes.find((node) => node.id.startsWith("story-compose-"));
  assert.deepEqual(plain(film.composerDraft.videoComposition.clips.map((clip) => [clip.id, clip.visualVideo.assetId])), [["u1", 301], ["u2", 302]]);
  const hasResult = (node) => Boolean(node.resultRef?.asset_id);
  const frame = storyboardFrameScopes(canvas.nodes, hasResult).find((scope) => scope.sourceNodeId === boards[1].id);
  const pending = storyboardFrameRunSummary(frame, canvas.nodes, canvas.edges, hasResult);
  assert.deepEqual(plain(pending), { pendingNodeIds: [film.id], blockedReason: "" });
  film.composerDraft.videoComposition.clips[0].transitionToNext = { type: "fade", durationMs: 200 };
  const manual = film.composerDraft.videoComposition.clips[0];
  manual.speechTracks = [{ id: "voice", text: "新增旁白", startTime: 0, sourceStart: 0, fit: "trim", kind: "narration", volume: 0.6 }];
  manual.subtitleTracks = [{ id: "subtitle", text: "手动字幕", startTime: 0, endTime: 3, source: "caption" }];
  manual.originalVolume = 0.3;
  manual.useOriginalVideo = false;
  const expected = plain(manual);
  film.resultRef = { asset_id: 500, version_id: 600 };
  canvas = syncStoryComposition({ canvas, assetCate, powers: catalog });
  assert.equal(canvas.nodes.filter((node) => node.id.startsWith("story-compose-")).length, 1);
  film = canvas.nodes.find((node) => node.id === film.id);
  assert.equal(film.resultRef.asset_id, 500);
  assert.equal(film.composerDraft.videoComposition.clips[0].transitionToNext.durationMs, 200);
  assert.deepEqual(plain(film.composerDraft.videoComposition.clips[0]), expected);
  boards[0].resultOutput.target_duration = 6;
  boards[0].resultOutput.shots[0].duration = 6;
  canvas = syncStoryComposition({ canvas, assetCate, powers: catalog });
  film = canvas.nodes.find((node) => node.id === film.id);
  assert.equal(film.composerDraft.videoComposition.clips[0].duration, 6);
  assert.equal(film.resultRef, undefined);
  canvas.nodes.find((node) => node.id === "video1").resultRef.version_id = 999;
  canvas = syncStoryComposition({ canvas, assetCate, powers: catalog });
  film = canvas.nodes.find((node) => node.id === film.id);
  assert.equal(film.resultRef, undefined);
  assert.equal(film.composerDraft.videoComposition.clips[1].visualVideo.versionId, 999);
  assert.equal(canvas.edges.filter((edge) => edge.to === film.id).length, 2);
  story.resultOutput.units.reverse();
  canvas = pullStoryChapters({ canvas, storyNodeId: "story", unitIds: ["u1", "u2"], assetCate, powers: catalog });
  film = canvas.nodes.find((node) => node.id.startsWith("story-compose-"));
  assert.deepEqual(plain(film.composerDraft.videoComposition.clips.map((clip) => clip.id)), ["u2", "u1"]);
  const chapterEdges = canvas.edges.filter((edge) => edge.id.startsWith("chapter-next-"));
  assert.equal(chapterEdges.length, 1);
  assert.equal(chapterEdges[0].from, boards[1].id);
  assert.equal(chapterEdges[0].to, boards[0].id);
  film.resultRef = { asset_id: 501, version_id: 601 };
  canvas.nodes = canvas.nodes.filter((node) => node.id !== boards[1].id);
  canvas = syncStoryComposition({ canvas, assetCate, powers: catalog });
  film = canvas.nodes.find((node) => node.id === film.id);
  assert.deepEqual(plain(film.composerDraft.videoComposition.clips.map((clip) => clip.id)), ["u1"]);
  assert.equal(film.resultRef, undefined);
  assert.equal(canvas.edges.filter((edge) => edge.to === film.id).length, 1);
  canvas.nodes = canvas.nodes.filter((node) => node.id !== boards[0].id);
  canvas = syncStoryComposition({ canvas, assetCate, powers: catalog });
  film = canvas.nodes.find((node) => node.id === film.id);
  assert.equal(film.composerDraft.videoComposition.clips.length, 0);
  assert.equal(canvas.edges.filter((edge) => edge.to === film.id).length, 0);
});

function fixture() {
  const document = { type: "story", schema_version: 1, title: "故事", preferences: emptyPreferences(), inspirations: [], selected_inspiration_id: "", outline: completeOutline(), units: [], archived_units: [], status: "ready" };
  const board = {
    type: "storyboard", version: 9, title: "章节", target_shot_count: 1, target_duration: 4,
    narrator_voice: "", visual_mode: "stylized", style_prompt: "水彩动画", aspect_ratio: "9:16",
    storyline: { setup: "进门", development: "坐下", payoff: "等待" }, references: [],
    workflow: { status: "confirmed" }, production_plan: { output_target: "shot_images" },
    materials: [{ id: "outline-actor", type: "character", name: "人物", prompt: "动机与关系", reference_keys: [], voice: "" }],
    shots: [{ ...createStoryboardShot(0), beat: "坐下等待", description: "人物坐在桌边", continuity_state: { entry: "站在桌边", exit: "坐在桌边" }, material_ids: ["outline-actor"], duration: 4 }],
  };
  let canvas = normalizeCanvasState({ id: 1, asset_cate_id: 1, nodes: [
    { id: "story", type: "power", output_type: "story", power: { id: 1, kind: "text", output_type: "story" }, asset: { id: 11, version_id: 21 }, result_output: document },
    ...["one", "two"].map((id) => ({ id, type: "power", output_type: "storyboard", power: { id: 3, kind: "text", output_type: "storyboard" }, result_output: plain(board) })),
  ], edges: [] });
  canvas = syncStorySettingGroup({ canvas, storyNodeId: "story", assetCate, powers });
  const group = canvas.nodes.find((node) => node.outputType === "setting");
  group.resultOutput = { type: "setting", version: 1, title: "共用设定", visual_mode: "photoreal", style_prompt: "写实影像", aspect_ratio: "16:9",
    materials: [
      { id: "outline-actor", type: "character", name: "人物", prompt: "动机与关系", voice: "", reference_keys: [] },
      { id: "outline-place", type: "scene", name: "场景", prompt: "稳定环境", voice: "", reference_keys: [] },
    ] };
  canvas = syncSettingDerivedGroups({ canvas, settingNode: group, assetCate, powers });
  canvas.edges.push({ id: "chapter-one", from: group.id, to: "one" }, { id: "chapter-two", from: group.id, to: "two" });
  return { canvas, group };
}

test("分镜编辑不按主体组合判断连续性内容", () => {
  const cases = [
    { name: "保持原画面", ids: ["actor", "lighthouse", "harbor"], valid: true },
    { name: "远景移出", ids: ["actor", "lighthouse"], valid: true },
    { name: "人物移出", ids: ["lighthouse", "harbor"], valid: true },
    { name: "只保留原场景", ids: ["lighthouse"], valid: true },
    { name: "新增人物", ids: ["actor", "new-actor", "lighthouse"], valid: false },
    { name: "新增场景", ids: ["actor", "lighthouse", "lantern-room"], valid: false },
    { name: "更换场景", ids: ["actor", "lantern-room"], valid: false },
    { name: "没有场景", ids: ["actor"], valid: false },
  ];
  for (const { name, ids, valid } of cases) {
    const { canvas } = fixture();
    const board = canvas.nodes.find((node) => node.id === "one").resultOutput;
    board.summary = "从灯塔入口跟随人物，摄影机转向海面";
    board.production_plan = { output_target: "final_video", voice_mode: "off", subtitle_mode: "off", shot_visual_strategy: "auto" };
    board.materials = [["actor", "character"], ["new-actor", "character"], ["lighthouse", "scene"], ["harbor", "scene"], ["lantern-room", "scene"]].map(([id, type]) => ({ id, type, name: id, prompt: id, voice: "", reference_keys: [] }));
    const first = { ...board.shots[0], material_ids: ["actor", "lighthouse", "harbor"], video_prompt: "摄影机跟随人物", start_framing: "入口全景", end_framing: "入口中景" };
    const second = { ...plain(first), id: "continued", order: 2, transition: "从上一段尾帧继续平移", continue_previous: true, match_previous: false, continuity_anchor: "保持光线与位置", continuity_state: { entry: first.continuity_state.exit, exit: "摄影机转向海面" }, start_framing: first.end_framing, material_ids: ids };
    board.shots = [first, second];
    board.target_shot_count = 2;
    board.target_duration = first.duration + second.duration;
    const errors = storyboardValidationIssues(board).filter((issue) => issue.severity === "error");
    assert.deepEqual(plain(errors), [], name);
  }
});

test("设定能力连线让两章复用同一素材，保存重开不丢引用", () => {
  let { canvas } = fixture();
  const actor = canvas.nodes.find((node) => node.storyboardItem?.itemId === "outline-actor");
  for (const id of ["one", "two"]) {
    assert.equal(storyboardSettingNodes(canvas.nodes, canvas.edges, id).get("character:outline-actor")?.id, actor.id);
    canvas = materializeCanvasStoryboardDerivedGroups({ canvas, sourceNodeId: id, assetCate, powers });
  }
  const actors = canvas.nodes.filter((node) => node.storyboardItem?.itemType === "character");
  assert.equal(actors.length, 1);
  for (const id of ["one", "two"]) {
    const frame = canvas.nodes.find((node) => node.storyboardItem?.sourceNodeId === id && node.storyboardItem.itemType === "shot_image");
    assert.ok(frame);
    assert.ok(frame.storyboardItem.referenceNodeIds.includes(actor.id));
  }
  const restored = normalizeCanvasState(persistedCanvasState(canvas));
  assert.equal(storyboardSettingNodes(restored.nodes, restored.edges, "two").get("character:outline-actor")?.id, actor.id);
});

test("画布收到新版首帧后刷新制作区，保存重开只保留新图并重新排入视频", () => {
  let { canvas } = fixture();
  const catalog = [...powers, { id: 4, kind: "video", outputType: "general" }, { id: 5, kind: "video", outputType: "video_compose" }];
  canvas.nodes.find((node) => node.id === "one").resultOutput.production_plan.output_target = "final_video";
  canvas = materializeCanvasStoryboardDerivedGroups({ canvas, sourceNodeId: "one", assetCate, powers: catalog });
  const derived = canvas.nodes.filter((node) => node.storyboardItem?.sourceNodeId === "one");
  for (const [index, node] of derived.entries()) node.resultRef = { asset_id: 700 + index, version_id: 800 + index, run_id: 1 };
  const previous = structuredClone(canvas.nodes);
  const image = derived.find((node) => node.storyboardItem.itemType === "shot_image");
  image.resultRef = { ...image.resultRef, version_id: 900, run_id: 2 };
  canvas = refreshCanvasStoryboardDerivedGroups({ canvas, previousNodes: previous, sourceNodeIds: ["one"], assetCate, powers: catalog });
  canvas = normalizeCanvasState(persistedCanvasState(canvas));
  assert.equal(canvas.nodes.find((node) => node.id === image.id).resultRef.version_id, 900);
  for (const type of ["shot", "video_compose"]) {
    assertInvalidated(canvas.nodes.find((node) => node.storyboardItem?.sourceNodeId === "one" && node.storyboardItem.itemType === type));
  }
  const frame = storyboardFrameScopes(canvas.nodes, (node) => Boolean(node.resultRef?.asset_id)).find((scope) => scope.sourceNodeId === "one");
  const pending = storyboardFrameRunSummary(frame, canvas.nodes, canvas.edges, (node) => Boolean(node.resultRef?.asset_id));
  assert.ok(pending.pendingNodeIds.some((id) => canvas.nodes.find((node) => node.id === id)?.storyboardItem?.itemType === "shot"));
});

test("保存重开补齐参考图媒体地址，不能清除已经使用同版本图片的视频", () => {
  let { canvas } = fixture();
  const catalog = [...powers, { id: 4, kind: "video", outputType: "general" }, { id: 5, kind: "video", outputType: "video_compose" }];
  canvas.nodes.find((node) => node.id === "one").resultOutput.production_plan.output_target = "final_video";
  canvas = materializeCanvasStoryboardDerivedGroups({ canvas, sourceNodeId: "one", assetCate, powers: catalog });
  for (const [index, node] of canvas.nodes.filter((node) => node.storyboardItem?.sourceNodeId === "one").entries()) {
    node.resultRef = { asset_id: 700 + index, version_id: 800 + index, run_id: 1 };
  }
  canvas = refreshCanvasStoryboardDerivedGroups({ canvas, sourceNodeIds: ["one"], assetCate, powers: catalog });
  canvas = normalizeCanvasState(persistedCanvasState(canvas));
  const image = canvas.nodes.find((node) => node.storyboardItem?.sourceNodeId === "one" && node.storyboardItem.itemType === "shot_image");
  image.asset = { id: image.resultRef.asset_id, version_id: image.resultRef.version_id, kind: "image", version: { id: image.resultRef.version_id, content: { images: ["https://example.test/start.png"] } } };
  canvas = refreshCanvasStoryboardDerivedGroups({ canvas, sourceNodeIds: ["one"], assetCate, powers: catalog });
  for (const type of ["shot", "video_compose"]) {
    assert.ok(canvas.nodes.find((node) => node.storyboardItem?.sourceNodeId === "one" && node.storyboardItem.itemType === type).resultRef, type);
  }
});

test("设定文档变化显示旧图提示，形象身份和结果保留", () => {
  let { canvas, group } = fixture();
  const actor = canvas.nodes.find((node) => node.storyboardItem?.itemId === "outline-actor");
  actor.asset = { id: 12, version_id: 22, version: { id: 22, source: { story_setting: { name: "人物", prompt: "动机与关系", visual_mode: "photoreal", aspect_ratio: "16:9", style_prompt_input: "写实影像" } } } };
  actor.resultRef = { asset_id: 12, version_id: 22 };
  actor.resultOutput = { images: ["https://example.test/actor.png"] };
  assert.equal(storySettingUpdateReason(actor, canvas.nodes), "");
  canvas.nodes.find((node) => node.id === "two").resultOutput.style_prompt = "油画";
  assert.equal(storySettingUpdateReason(actor, canvas.nodes), "");
  Object.assign(group.resultOutput, { visual_mode: "stylized", style_prompt: "水彩动画", aspect_ratio: "9:16" });
  assert.match(storySettingUpdateReason(actor, canvas.nodes), /画风或画幅已更新/);
  group.resultOutput.materials[0].prompt = "新的外观设定";
  canvas = syncSettingDerivedGroups({ canvas, settingNode: group, assetCate, powers });
  const refreshed = canvas.nodes.find((node) => node.id === actor.id);
  assert.deepEqual(plain(refreshed.resultRef), plain(actor.resultRef));
  assert.deepEqual(plain(refreshed.resultOutput), plain(actor.resultOutput));
  assert.equal(refreshed.storyboardItem.generatedPrompt, "新的外观设定");
  assert.match(storySettingUpdateReason(refreshed, canvas.nodes), /设定已更新/);
  const reopened = normalizeCanvasState(persistedCanvasState(canvas));
  const reopenedActor = reopened.nodes.find((node) => node.id === actor.id);
  assert.equal(reopenedActor.resultRef.version_id, 22);
  // Asset details are hydrated from the server after reopening, not duplicated in canvas JSON.
  reopenedActor.asset = actor.asset;
  assert.match(storySettingUpdateReason(reopenedActor, reopened.nodes), /设定已更新/);
});

test("手动连线和伪装成员不会变成可共用素材", () => {
  const { canvas, group } = fixture();
  canvas.nodes.push({ id: "foreign", groupId: group.id, storyboardItem: { sourceNodeId: "other", itemType: "character", itemId: "foreign" } });
  canvas.nodes.push({ id: "shot", groupId: group.id, storyboardItem: { sourceNodeId: "story", itemType: "shot_image", itemId: "shot" } });
  assert.equal(storyboardSettingNodes(canvas.nodes, canvas.edges, "two").size, 2);
  canvas.edges.find((edge) => edge.to === "two").executionMode = "manual";
  assert.equal(storyboardSettingNodes(canvas.nodes, canvas.edges, "two").size, 0);
});

test("拉出两章绑定各自正文、共用设定并自动接续，重复操作不覆盖已编辑节点", () => {
  let { canvas } = fixture();
  const story = canvas.nodes.find((node) => node.id === "story");
  story.resultOutput.units = [1, 2].map((n) => ({ unit_type: "chapter", id: `u${n}`, title: `第${n}章`, plan: "计划", children: [], asset_id: 100 + n, version_id: 200 + n, has_body: true }));
  const catalog = [...powers, { id: 3, name: "分镜", kind: "text", outputType: "storyboard" }];
  canvas = pullStoryChapters({ canvas, storyNodeId: "story", unitIds: ["u2", "u1"], assetCate, powers: catalog });
  const boards = canvas.nodes.filter((node) => node.id.startsWith("chapter-"));
  assert.equal(boards.length, 2);
  assert.deepEqual(plain(boards.map((node) => node.title)), ["第1章", "第2章"]);
  for (const [index, board] of boards.entries()) {
    const selection = board.composerDraft.promptContent.parts.find((part) => part.type === "reference");
    assert.equal(selection.ref_version_id, 21);
    assert.deepEqual(plain(selection.ref_content_selection), { kind: "unit", ids: [`u${index + 1}`] });
    assert.ok(storyboardSettingNodes(canvas.nodes, canvas.edges, board.id).size);
  }
  assert.ok(canvas.edges.some((edge) => edge.from === boards[0].id && edge.to === boards[1].id));
  assert.ok(canvas.edges.filter((edge) => boards.some((board) => board.id === edge.to)).every((edge) => edge.purpose === "structure"));
  boards[0].title = "我编辑过的剧本";
  canvas = pullStoryChapters({ canvas, storyNodeId: "story", unitIds: ["u1", "u2"], assetCate, powers: catalog });
  assert.equal(canvas.nodes.filter((node) => node.id.startsWith("chapter-")).length, 2);
  assert.equal(canvas.nodes.find((node) => node.id === boards[0].id).title, "我编辑过的剧本");
  const restored = normalizeCanvasState(persistedCanvasState(canvas));
  assert.deepEqual(plain(restored.nodes.find((node) => node.id === boards[1].id).composerDraft.promptContent), plain(boards[1].composerDraft.promptContent));
});

test("剧本草稿零镜头也能保存重开，建议时长与原文追溯不丢", () => {
  const { canvas } = fixture();
  const doc = plain(canvas.nodes.find((node) => node.id === "one").resultOutput);
  doc.shots = []; doc.target_shot_count = 0; doc.target_duration = 18; doc.workflow.status = "draft";
  doc.screenplay = { status: "draft", source: { work_asset_id: 11, work_version_id: 21, unit_id: "u1", asset_id: 101, version_id: 201 }, source_passages: [{ id: "1", text: "她转头。" }], parts: [{ title: "窗前", description: "动作：她转头。", source_start: 1, source_end: 1, target_duration: 18, connection: "reset" }] };
  const parsed = parseStoryboardOutput(doc);
  assert.ok(parsed);
  assert.equal(parsed.shots.length, 0);
  assert.equal(parsed.target_duration, 18);
  assert.deepEqual(plain(parseStoryboardOutput(JSON.stringify(parsed)).screenplay), doc.screenplay);
});

test("跨章换机位和续拍引用前章尾图，保存重开不丢边界", () => {
  for (const connection of ["match", "continue"]) {
    let { canvas } = fixture();
    const one = canvas.nodes.find((node) => node.id === "one");
    const two = canvas.nodes.find((node) => node.id === "two");
    one.resultOutput.production_plan.output_target = "shot_images";
    two.resultOutput.production_plan.output_target = "shot_videos";
    two.resultOutput.chapter_boundary = { connection, node_id: "one", asset_id: 1, version_id: 2, shot_id: one.resultOutput.shots[0].id };
    const catalog = [...powers, { id: 4, kind: "video", outputType: "general" }];
    for (const sourceNodeId of ["one", "two"]) {
      canvas = materializeCanvasStoryboardDerivedGroups({ canvas, sourceNodeId, assetCate, powers: catalog });
    }
    const of = (owner, type, role) => canvas.nodes.find((node) => node.storyboardItem?.sourceNodeId === owner && node.storyboardItem.itemType === type && node.storyboardItem.frameRole === role);
    const tail = of("one", "shot_image", "end");
    const start = of("two", "shot_image", "start");
    const end = of("two", "shot_image", "end");
    const video = of("two", "shot");
    const anchor = connection === "continue" ? end : start;
    assert.ok(anchor.storyboardItem.dependencyNodeIds.includes(tail.id));
    assert.equal(anchor.storyboardItem.referenceNodeIds[0], tail.id);
    assert.deepEqual(plain(video.storyboardItem.referenceNodeIds), [connection === "continue" ? tail.id : start.id, end.id]);
    assert.equal(video.storyboardItem.sharedStartShotId, connection === "continue" ? tail.storyboardItem.shotId : undefined);
    assert.equal(video.storyboardItem.shotImageMode, "first_last");
    assert.equal(canvas.nodes.filter((node) => node.storyboardItem?.sourceNodeId === "two" && node.storyboardItem.itemType === "shot_image").length, connection === "continue" ? 1 : 2);
    const reopened = normalizeCanvasState(persistedCanvasState(canvas)).nodes.find((node) => node.id === video.id).storyboardItem;
    assert.deepEqual(plain(reopened.dependencyNodeIds), plain(video.storyboardItem.dependencyNodeIds));
    assert.equal(reopened.sharedStartShotId, video.storyboardItem.sharedStartShotId || "");
    assert.deepEqual(plain(reopened.referenceNodeIds), plain(video.storyboardItem.referenceNodeIds));
  }
});

test("恢复镜头提示词保留首尾图角色，连续性文字不丢首帧，跨章同名镜头不混淆", () => {
  const image = (id, owner, shot, roles) => ({
    id, title: id, resultRef: { asset_id: id === "previous" ? 1 : 2, version_id: 3 },
    storyboardItem: { sourceNodeId: owner, itemType: "shot_image", itemId: shot, shotId: shot, frameMediaItems: roles.map((frameRole, index) => ({ frameRole, mediaIndex: index + 1 })) },
  });
  const previous = image("previous", "one", "s1", ["start", "end"]);
  const current = image("current", "two", "s1", ["end"]);
  const shot = { id: "video", composerDraft: { prompt: "手动提示词" }, storyboardItem: { sourceNodeId: "two", itemType: "shot", shotId: "s1", sharedStartShotId: "s1", generatedPrompt: "原提示词", continuityAnchor: "保持光照", referenceNodeIds: [previous.id, current.id] } };
  const references = canvasReferenceTargetsFromContent(restoredStoryboardDerivedPrompt(shot, [previous, current]).promptContent);
  assert.deepEqual(plain(references.map((ref) => ref.mediaItems)), [[{ url: "", index: 2, usage: "firstFrame" }], [{ url: "", index: 1, usage: "lastFrame" }]]);
  const own = image("current", "two", "s1", ["start", "end"]);
  shot.storyboardItem.sharedStartShotId = undefined;
  shot.storyboardItem.referenceNodeIds = [own.id];
  const pair = canvasReferenceTargetsFromContent(restoredStoryboardDerivedPrompt(shot, [own]).promptContent);
  assert.deepEqual(plain(pair[0].mediaItems), [{ url: "", index: 1, usage: "firstFrame" }, { url: "", index: 2, usage: "lastFrame" }]);
});

test("三镜制作区只有四张图，两处共享图各自使用同一版本", () => {
  let { canvas } = fixture();
  const board = canvas.nodes.find((node) => node.id === "one");
  const doc = board.resultOutput;
  doc.production_plan.output_target = "shot_videos";
  const first = doc.shots[0];
  for (const id of ["continued", "finish"]) {
    doc.shots.push({ ...plain(first), id, order: doc.shots.length + 1, continue_previous: true, match_previous: false, continuity_anchor: "沿同一方向接拍" });
  }
  doc.target_shot_count = 3;
  doc.target_duration = doc.shots.reduce((sum, shot) => sum + shot.duration, 0);
  const catalog = [...powers, { id: 4, kind: "video", outputType: "general" }];
  const materialize = () => materializeCanvasStoryboardDerivedGroups({ canvas, sourceNodeId: "one", assetCate, powers: catalog });
  canvas = materialize();
  const of = (type) => canvas.nodes.filter((node) => node.storyboardItem?.sourceNodeId === "one" && node.storyboardItem.itemType === type);
  const images = of("shot_image");
  assert.deepEqual(plain(images.map((node) => node.storyboardItem.frameRole)), ["start", "end", "end", "end"]);
  const ids = Array.from(images, (node) => node.id);
  images.forEach((node, index) => { node.resultRef = { asset_id: index + 10, version_id: index + 20 }; });
  canvas = materialize();
  const shots = of("shot");
  assert.equal(shots.length, 3);
  for (const [index, shot] of shots.entries()) {
    assert.equal(shot.storyboardItem.dependencyNodeIds.length, 0);
    assert.deepEqual(plain(shot.storyboardItem.referenceNodeIds), ids.slice(index, index + 2));
    const refs = canvasReferenceTargetsFromContent(shot.composerDraft.promptContent);
    assert.deepEqual(plain(refs.map((ref) => [ref.refId, ref.versionId, ref.mediaItems[0].index, ref.mediaItems[0].usage])), [
      [index + 10, index + 20, 1, "firstFrame"], [index + 11, index + 21, 1, "lastFrame"],
    ]);
  }
});

test("同章换机位在各种制作目标都使用规划图，所有依赖无环", () => {
  for (const outputTarget of ["shot_images", "shot_videos", "final_video"]) {
    let { canvas } = fixture();
    const board = canvas.nodes.find((node) => node.id === "one");
    const first = board.resultOutput.shots[0];
    const second = { ...plain(first), id: "second", order: 2, transition: "承接上一镜状态，换机位", match_previous: true, continue_previous: false, continuity_state: { entry: first.continuity_state.exit, exit: "继续等待" } };
    board.resultOutput.shots.push(second);
    board.resultOutput.target_shot_count = 2;
    board.resultOutput.target_duration = 8;
    board.resultOutput.production_plan.output_target = outputTarget;
    const catalog = [...powers, { id: 4, kind: "video", outputType: "general" }, { id: 5, kind: "video", outputType: "video_compose" }];
    canvas = materializeCanvasStoryboardDerivedGroups({ canvas, sourceNodeId: "one", assetCate, powers: catalog });
    const find = (shotId, role) => canvas.nodes.find((node) => node.storyboardItem?.sourceNodeId === "one" && node.storyboardItem.itemType === "shot_image" && node.storyboardItem.shotId === shotId && node.storyboardItem.frameRole === role);
    const frame = find(second.id, "start");
    const anchor = find(first.id, "end");
    assert.ok(anchor, outputTarget);
    assert.deepEqual(plain(frame.storyboardItem.dependencyNodeIds), [anchor.id]);
    assert.equal(frame.storyboardItem.shotImageMode, "first_frame");
    const restored = normalizeCanvasState(persistedCanvasState(canvas)).nodes.find((node) => node.id === frame.id);
    assert.deepEqual(plain(restored.storyboardItem.dependencyNodeIds), [anchor.id]);
    assert.equal(restored.storyboardItem.continuityAnchor, frame.storyboardItem.continuityAnchor || "");
    const visiting = new Set(), visited = new Set();
    const visit = (node) => {
      assert.ok(!visiting.has(node.id), "生成依赖不能成环");
      if (visited.has(node.id)) return;
      visiting.add(node.id);
      for (const id of [...(node.storyboardItem?.dependencyNodeIds || []), ...(node.storyboardItem?.referenceNodeIds || [])]) {
        const upstream = canvas.nodes.find((item) => item.id === id);
        assert.ok(upstream); visit(upstream);
      }
      visiting.delete(node.id); visited.add(node.id);
    };
    canvas.nodes.filter((node) => node.storyboardItem).forEach(visit);
  }
});

test("无效剧本结构不会进入可编辑分镜界面", () => {
  const { canvas } = fixture();
  const doc = plain(canvas.nodes.find((node) => node.id === "one").resultOutput);
  for (const screenplay of [{}, { status: "draft", source: {}, parts: [null] }]) {
    assert.equal(parseStoryboardOutput({ ...doc, screenplay }), null);
  }
});

test("单帧结果保存重开后刷新保留，分镜状态改变才失效", () => {
  let { canvas } = fixture();
  canvas = materializeCanvasStoryboardDerivedGroups({ canvas, sourceNodeId: "one", assetCate, powers });
  const image = canvas.nodes.find((node) => node.storyboardItem?.sourceNodeId === "one" && node.storyboardItem.itemType === "shot_image");
  image.resultRef = { asset_id: 12, version_id: 22 };
  image.asset = { id: 12, version_id: 22, kind: "image" };
  image.resultOutput = { images: ["https://example.test/frame.png"] };
  canvas = normalizeCanvasState(persistedCanvasState(canvas));
  canvas = refreshCanvasStoryboardDerivedGroups({ canvas, sourceNodeIds: ["one"], assetCate, powers });
  const restored = canvas.nodes.find((node) => node.id === image.id);
  assert.equal(restored.asset.id, 12);
  assert.equal(restored.resultRef.version_id, 22);
  canvas.nodes.find((node) => node.id === "one").resultOutput.shots[0].continuity_state.entry = "已经坐下";
  canvas = refreshCanvasStoryboardDerivedGroups({ canvas, sourceNodeIds: ["one"], assetCate, powers });
  assert.equal(canvas.nodes.find((node) => node.id === image.id).asset, undefined);
  assertInvalidated(canvas.nodes.find((node) => node.id === image.id));
});

test("先创建后章再补前章仍会接续，重新拉出只更新正文版本", () => {
  let { canvas } = fixture();
  const story = canvas.nodes.find((node) => node.id === "story");
  story.resultOutput.units = [1, 2].map((n) => ({ unit_type: "chapter", id: 'u' + n, title: '章节' + n, plan: "计划", children: [], asset_id: 100 + n, version_id: 200 + n, has_body: true }));
  const catalog = [...powers, { id: 3, kind: "text", outputType: "storyboard" }];
  canvas = pullStoryChapters({ canvas, storyNodeId: "story", unitIds: ["u2"], assetCate, powers: catalog });
  canvas = pullStoryChapters({ canvas, storyNodeId: "story", unitIds: ["u1"], assetCate, powers: catalog });
  const boards = canvas.nodes.filter((node) => node.id.startsWith("chapter-"));
  assert.ok(canvas.edges.some((edge) => edge.from === boards[1].id && edge.to === boards[0].id));
  const document = plain(canvas.nodes.find((node) => node.id === "one").resultOutput);
  document.visual_mode = "photoreal"; document.aspect_ratio = "16:9"; document.style_prompt = "写实影像";
  document.screenplay = { source: { work_asset_id: 11, work_version_id: 21, unit_id: "u2", asset_id: 102, version_id: 202 }, source_passages: [{ id: "1", text: "正文。" }], parts: [{ title: "场景", description: "剧情", source_start: 1, source_end: 1, target_duration: 4, connection: "reset" }] };
  boards[0].resultOutput = document;
  boards[0].resultRef = { asset_id: 700, version_id: 800 };
  assert.equal(storyChapterUpdateReason(boards[0], canvas.nodes, canvas.edges), "");
  const setting = storyboardSettingSource(canvas.nodes, canvas.edges, boards[0].id);
  assert.equal(setting.outputType, "setting");
  setting.resultOutput.style_prompt = "水彩";
  assert.match(storyChapterUpdateReason(boards[0], canvas.nodes, canvas.edges), /画风或画幅已更新/);
  setting.resultOutput.style_prompt = "";
  assert.match(storyChapterUpdateReason(boards[0], canvas.nodes, canvas.edges), /画风或画幅已更新/);
  setting.resultOutput.style_prompt = "写实影像";
  story.asset.version_id = 22;
  assert.equal(storyChapterUpdateReason(boards[0], canvas.nodes, canvas.edges), "");
  story.resultOutput.units[1].version_id = 999;
  assert.match(storyChapterUpdateReason(boards[0], canvas.nodes, canvas.edges), /正文已更新/);
  canvas = pullStoryChapters({ canvas, storyNodeId: "story", unitIds: ["u2"], assetCate, powers: catalog });
  const updated = canvas.nodes.find((node) => node.id === boards[0].id);
  assert.equal(updated.composerDraft.promptContent.parts.find((part) => part.type === "reference").ref_version_id, 22);
  assert.equal(updated.resultRef.version_id, 800);
});
