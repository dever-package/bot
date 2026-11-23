import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import path from "node:path";
import test from "node:test";
import { loader } from "./writing_test_loader.mjs";

const root = new URL("../front/src/nodes/body-work/space/", import.meta.url).pathname;
const load = loader({ "@dever/front-plugin": { getCompatModule() { return {}; } }, __globals: { crypto: webcrypto, structuredClone, window: { appRuntime: {}, location: { host: "test.local", hostname: "test.local", protocol: "http:" }, localStorage: { getItem() { return null; } } } } });
const { createStoryboardShot, parseStoryboardOutput, normalizeStoryboardOrder, reconcileStoryboardContinuity } = load(path.join(root, "space-storyboard.ts"));
const { applyStoryboardShotEdit } = load(path.join(root, "space-storyboard-shot-edit.ts"));
const { storyboardVideoComposition } = load(path.join(root, "space-storyboard-composition.ts"));
const { STORYBOARD_DERIVED_GROUP_SPECS } = load(path.join(root, "space-storyboard-derived-specs.ts"));
const { STORYBOARD_FRAME_PLAN_VERSION } = load(path.join(root, "space-storyboard-frame-plan.ts"));
const { invalidateStoryboardFrameResults } = load(path.join(root, "space-storyboard-result-invalidation.ts"));
const { storyboardFrames } = load(path.join(root, "space-storyboard-media.ts"));

function storyboard(shots, outputTarget = "final_video") {
  const materials = [
    { id: "girl", type: "character", name: "女孩", prompt: "米色风衣", reference_keys: [], voice: "" },
    { id: "owner", type: "character", name: "老周", prompt: "深色毛衣", reference_keys: [], voice: "" },
    { id: "shop", type: "scene", name: "书店", prompt: "旧书店", reference_keys: [], voice: "" },
    { id: "street", type: "scene", name: "街道", prompt: "清晨街道", reference_keys: [], voice: "" },
    { id: "book", type: "prop", name: "书", prompt: "蓝色封面", reference_keys: [], voice: "" },
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

test("分镜保存和普通编辑保留第一镜供下一镜承接的出点", () => {
  const document = storyboard([{
    handoff: {
      incoming: "无上游镜头",
      outgoing: "右手开始合书",
      sound_cue: "窗外细雨",
      sound_lead_ms: 500,
    },
  }, { continue_previous: true }]);
  const expected = {
    incoming: "",
    outgoing: "右手开始合书",
    sound_cue: "窗外细雨",
    sound_lead_ms: 0,
  };
  assert.deepEqual(plain(document.shots[0].handoff), expected);
  const edited = structuredClone(document);
  edited.shots[0].beat = "准备合上书本";
  const saved = normalizeStoryboardOrder(reconcileStoryboardContinuity(document, edited));
  assert.deepEqual(plain(saved.shots[0].handoff), expected);
});

test("三镜保留四张规划图；续拍视频从上一段成片接入", () => {
  const shots = ["s1", "s2", "s3"].map((id, index) => ({ id, duration: 5, material_ids: ["owner", "shop"], continue_previous: index > 0 }));
  for (const target of ["shot_images", "final_video"]) {
    const document = storyboard(shots, target);
    const images = shotImages(document);
    const ids = ["start:s1", "end:s1", "end:s2", "end:s3"];
    assert.deepEqual(plain(images.map((item) => item.id)), ids);
    assert.deepEqual(plain(images.map((item) => item.dependencyItems.map((source) => source.id))), [[], ids.slice(0,1), ids.slice(1,2), ids.slice(2,3)]);
    const nodes = images.map((item, index) => ({
      id: item.id, storyboardItem: { sourceNodeId: "board", itemType: item.type, shotId: item.shotId, frameMediaItems: item.frameMediaItems },
      resultOutput: { images: ["/" + "abcd"[index] + ".png"] },
    }));
    const frames = storyboardFrames(document, "board", nodes);
    assert.deepEqual(plain(frames.map((frame) => [frame.start.imageURL, frame.end.imageURL])), [["/a.png", "/b.png"], ["/b.png", "/c.png"], ["/c.png", "/d.png"]]);
    assert.equal(frames[0].end.node, frames[1].start.node);
    assert.equal(frames[1].end.node, frames[2].start.node);
    const videos = STORYBOARD_DERIVED_GROUP_SPECS.find((spec) => spec.key === "shots").items(document);
    assert.ok(videos.every((item) => item.shotImageMode === "first_last"));
    assert.deepEqual(plain(videos.map((item) => item.paramValues.duration)), [5, 5, 5]);
    assert.deepEqual(plain(videos.map((item) => item.dependencyItems || [])), [[], [{ type: "shot", id: "s1" }], [{ type: "shot", id: "s2" }]]);
    assert.deepEqual(plain(videos.map((item) => item.referenceItems.map((source) => source.id))), [ids.slice(0, 2), ["end:s2"], ["end:s3"]]);
  }
});

test("重做接点图或视频只失效续拍链和合成，不失效独立镜头", () => {
  const item = (itemType, referenceNodeIds = [], dependencyNodeIds = []) => ({ sourceNodeId: "board", itemType, referenceNodeIds, dependencyNodeIds });
  const node = (id, itemType, references, dependencies) => ({ id, storyboardItem: item(itemType, references, dependencies), resultRef: { asset_id: 1, version_id: 1 } });
  const before = [
    node("a", "shot_image"), node("b", "shot_image", ["a"], ["a"]), node("c", "shot_image", ["b"], ["b"]), node("d", "shot_image", ["c"], ["c"]),
    node("v1", "shot", ["a", "b"]), node("v2", "shot", ["c"], ["v1"]), node("v3", "shot", ["c", "d"]),
    node("compose", "video_compose", ["v1", "v2", "v3"]),
  ];
  const after = structuredClone(before);
  after[1].resultRef.version_id = 2;
  assert.equal(invalidateStoryboardFrameResults(before, after, "board", before), true);
  assert.deepEqual(after.filter((node) => node.resultRef.status === "invalidated").map((node) => node.id), ["v1", "v2", "compose"]);
  assert.equal(after[1].resultRef.version_id, 2);
  assert.equal(after[2].resultRef.version_id, 1);
  assert.equal(after[6].resultRef.version_id, 1);
  const redone = structuredClone(before);
  redone[4].resultRef.version_id = 2;
  assert.equal(invalidateStoryboardFrameResults(before, redone, "board", before), true);
  assert.deepEqual(redone.filter((node) => node.resultRef.status === "invalidated").map((node) => node.id), ["v2", "compose"]);
});

test("同场换机位取上一段规划图，独立空镜和换场另生首图", () => {
  const document = storyboard([
    { id: "s1", material_ids: ["owner", "shop"] },
    { id: "s2", material_ids: ["owner", "shop"], continue_previous: true },
    { id: "s3", material_ids: ["owner", "shop"], match_previous: true, start_framing: "手部特写" },
    { id: "s4", material_ids: ["shop"], description: "无人环境空镜" },
    { id: "s5", material_ids: ["street"], description: "街道空镜" },
  ]);
  const images = shotImages(document);
  const cut = images.find((item) => item.id === "start:s3");
  assert.deepEqual(plain(cut.dependencyItems), [{ type: "shot_image", id: "end:s2" }]);
  assert.deepEqual(plain(cut.referenceItems), [{ type: "shot_image", id: "end:s2" }, { type: "character", id: "owner" }, { type: "scene", id: "shop" }]);
  for (const [id, scene] of [["s4", "shop"], ["s5", "street"]]) {
    const image = images.find((item) => item.id === "start:" + id);
    assert.deepEqual(plain(image.dependencyItems), []);
    assert.deepEqual(plain(image.referenceItems), [{ type: "scene", id: scene }]);
  }
  const videos = STORYBOARD_DERIVED_GROUP_SPECS.find((spec) => spec.key === "shots").items(document);
  assert.equal(videos[1].sharedStartShotId, "s1");
  assert.equal(videos[2].sharedStartShotId, undefined);
  for (const index of [2, 3, 4]) {
    const id = "s" + (index + 1);
    assert.deepEqual(plain(videos[index].referenceItems), [{ type: "shot_image", id: "start:" + id }, { type: "shot_image", id: "end:" + id }]);
  }
});

test("同一摄影路线换景别或穿过门口时，保存后仍共用接点图", () => {
  const cameraPath = "跟着人物穿过店门，镜头继续向右移动，街道在门框外展开";
  const document = storyboard([
    { id: "room", material_ids: ["owner", "shop"], end_framing: "人物与门框的中景" },
    { id: "detail", material_ids: ["owner", "shop"], continue_previous: true, end_framing: "侧面近景，手打开门" },
    { id: "street", material_ids: ["owner", "street"], continue_previous: true, end_framing: "街上跟拍中景",
      handoff: { camera_path: cameraPath, incoming: "向右跟住开门并迈步的人", sound_lead_ms: 800, sound_cue: "从门外传来的车流" } },
  ]);
  const draft = structuredClone(document);
  draft.shots[1].camera_instruction = "保持运动方向，稍向人物手部靠近";
  draft.shots[2].beat = "跟着人物走到街上";
  const saved = normalizeStoryboardOrder(reconcileStoryboardContinuity(document, draft));
  assert.equal(saved.shots[2].handoff.camera_path, cameraPath);
  assert.equal(saved.shots[2].handoff.sound_lead_ms, 0);
  assert.equal(saved.shots[2].start_framing, "侧面近景，手打开门");
  assert.equal(saved.shots[2].end_framing, "街上跟拍中景");
  assert.deepEqual(plain(shotImages(saved).map((item) => item.id)), ["start:room", "end:room", "end:detail", "end:street"]);
  const videos = STORYBOARD_DERIVED_GROUP_SPECS.find((spec) => spec.key === "shots").items(saved);
  assert.deepEqual(plain(videos.slice(1).map((item) => item.referenceItems.map((ref) => ref.id))), [["end:detail"], ["end:street"]]);
  assert.deepEqual(plain(videos.slice(1).map((item) => item.dependencyItems)), [[{ type: "shot", id: "room" }], [{ type: "shot", id: "detail" }]]);
  const reordered = { ...saved, shots: [saved.shots[0], saved.shots[2], saved.shots[1]] };
  const moved = normalizeStoryboardOrder(reconcileStoryboardContinuity(saved, reordered));
  assert.equal(moved.shots[1].continue_previous, false);
  assert.equal(moved.shots[1].handoff?.camera_path, undefined);
});

test("动作接点的换机位首图使用紧邻尾图并保留新构图", () => {
  const sameScene = ["owner", "shop", "book"];
  const document = storyboard([
    { id: "s1", material_ids: sameScene },
    { id: "s2", material_ids: sameScene, continue_previous: true, continuity_state: { entry: "站着", exit: "右手压住书页" } },
    { id: "s3", material_ids: sameScene, match_previous: true, handoff: { match_action: true }, start_framing: "手部特写", camera_instruction: "沿书页推近" },
    { id: "s4", material_ids: ["street"], handoff: { match_action: true } },
  ]);
  const normalized = normalizeStoryboardOrder(document);
  const images = shotImages(normalized);
  const cutImage = images.find((item) => item.id === "start:s3");
  assert.deepEqual(plain(cutImage.dependencyItems), [{ type: "shot_image", id: "end:s2" }]);
  assert.match(cutImage.prompt, /右手压住书页/);
  assert.match(cutImage.prompt, /手部特写/);
  assert.doesNotMatch(cutImage.prompt, /沿书页推近/);
  assert.deepEqual(plain(images.find((item) => item.id === "start:s4").dependencyItems), []);
  const reordered = { ...document, shots: [document.shots[0], document.shots[2], document.shots[1], document.shots[3]] };
  const edited = normalizeStoryboardOrder(reconcileStoryboardContinuity(document, reordered));
  assert.equal(edited.shots[1].handoff?.match_action, undefined);
});

test("换场按本镜设定创建首帧，已出镜人物只继承自己的设定", () => {
  const document = storyboard([
    { id: "s1", material_ids: ["girl", "owner", "shop"] },
    { id: "s2", material_ids: ["girl", "owner", "shop"], continue_previous: true },
    { id: "s3", material_ids: ["owner", "shop"], continue_previous: true },
    { id: "s4", material_ids: ["girl", "street"] },
  ]);
  const items = shotImages(document);
  const first = items.find((item) => item.id === "start:s1");
  assert.equal(first.continuityAnchor, undefined, "第一镜没有可沿用的画面");
  assert.deepEqual(plain(first.dependencyItems), []);
  const scene = items.find((item) => item.id === "start:s4");
  assert.deepEqual(plain(scene.dependencyItems), []);
  assert.deepEqual(plain(scene.referenceItems), [{ type: "character", id: "girl" }, { type: "scene", id: "street" }]);
});

test("没有共同人物的换场独立生成，仅制作参考图也能保持共同人物外观", () => {
  const noShared = shotImages(storyboard([
    { id: "s1", material_ids: ["owner", "shop"] },
    { id: "s2", material_ids: ["girl", "street"] },
  ])).find((item) => item.id === "start:s2");
  assert.equal(noShared.continuityAnchor, undefined);
  assert.deepEqual(plain(noShared.dependencyItems), []);
  const imagesOnly = shotImages(storyboard([
    { id: "s1", material_ids: ["girl", "shop"] },
    { id: "s2", material_ids: ["girl", "street"] },
  ], "shot_images")).find((item) => item.id === "start:s2");
  assert.deepEqual(plain(imagesOnly.dependencyItems), []);
  assert.deepEqual(plain(imagesOnly.referenceItems), [{ type: "character", id: "girl" }, { type: "scene", id: "street" }]);
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

test("换场编辑重算当前与下一镜，不覆盖新写的起始状态", () => {
  const document = storyboard([
    { id: "s1", material_ids: ["owner", "shop"], end_framing: "书架中景" },
    { id: "s2", material_ids: ["owner", "shop"], continue_previous: true },
    { id: "s3", material_ids: ["owner", "shop"], continue_previous: true },
  ]);
  const next = plain(document);
  Object.assign(next.shots[1], { material_ids: ["owner", "street"], description: "老周在街上等车", continuity_state: { entry: "街边晨光中站立", exit: "公交车到站" }, start_framing: "站台全景" });
  const edited = normalizeStoryboardOrder(reconcileStoryboardContinuity(document, next));
  assert.equal(edited.shots[1].continuity_state.entry, "街边晨光中站立");
  assert.equal(edited.shots[1].start_framing, "站台全景");
  assert.ok(edited.shots.slice(1).every((shot) => !shot.continue_previous && !shot.match_previous));
  const frame = shotImages(edited).find((item) => item.id === "start:s2");
  assert.deepEqual(plain(frame.dependencyItems), []);
  assert.deepEqual(plain(frame.referenceItems), [{ type: "character", id: "owner" }, { type: "scene", id: "street" }]);
});

test("只替换场景时清除已断开的首帧继承，保留显式编辑和本镜结束状态", () => {
  const document = storyboard([
    { id: "s1", material_ids: ["owner", "shop"], end_framing: "书架中景", continuity_state: { entry: "站在书架旁", exit: "书店暖灯下靠着书架" } },
    { id: "s2", material_ids: ["owner", "shop"], continue_previous: true, continuity_state: { entry: "站着", exit: "低头打开书" } },
    { id: "s3", material_ids: ["owner", "shop"], continue_previous: true },
  ]);
  const reassign = (patch) => {
    const next = applyStoryboardShotEdit(document, {
      ...document.shots[1], material_ids: ["owner", "street"], ...patch,
    }, document.materials);
    return normalizeStoryboardOrder(reconcileStoryboardContinuity(document, next));
  };
  const moved = reassign({});
  assert.equal(moved.shots[1].continuity_state.entry, "");
  assert.equal(moved.shots[1].start_framing, "");
  assert.equal(moved.shots[1].continuity_state.exit, "低头打开书");
  assert.equal(moved.shots[2].continuity_state.entry, "");
  assert.ok(parseStoryboardOutput({ ...moved, workflow: { status: "confirmed", confirmed_at: "" } }));
  const edited = reassign({ start_framing: "街道路口中景", end_framing: "站台远景" });
  assert.equal(edited.shots[0].end_framing, "书架中景");
  assert.equal(edited.shots[1].start_framing, "街道路口中景");
  assert.notEqual(edited.shots[2].start_framing, "站台远景");
});

test("同场跨剧本片段换机位可以引用此前相同出镜主体", () => {
  const document = storyboard([
    { id: "s1", scene_index: 1, material_ids: ["owner", "shop"] },
    { id: "s2", scene_index: 2, material_ids: ["owner", "shop"], match_previous: true, start_framing: "脸部近景" },
  ]);
  assert.deepEqual(plain(shotImages(document).find((item) => item.id === "start:s2").dependencyItems), [{ type: "shot_image", id: "end:s1" }]);
});

test("插入镜之后的换机位仍以人物最近一次出镜的尾帧为底图", () => {
  const document = storyboard([
    { id: "s1", material_ids: ["owner", "shop"] },
    { id: "s2", material_ids: ["shop"], description: "无人细节特写" },
    { id: "s3", material_ids: ["owner", "shop"], match_previous: true },
  ]);
  const cut = shotImages(document).find((item) => item.id === "start:s3");
  assert.deepEqual(plain(cut.dependencyItems[0]), { type: "shot_image", id: "end:s1" });
});

test("换机位保留当前特写状态，插入镜不覆盖回到人物时的状态", () => {
  const document = storyboard([
    { id: "s1", material_ids: ["owner", "book", "shop"], continuity_state: { entry: "老周站立", exit: "老周右手压书页" } },
    { id: "s2", material_ids: ["book", "shop"], match_previous: true, start_framing: "书页特写", continuity_state: { entry: "书页边缘压住", exit: "书页翻开" } },
    { id: "s3", material_ids: ["owner", "shop"], match_previous: true, start_framing: "老周面部近景", continuity_state: { entry: "老周低头看书", exit: "老周抬眼" } },
  ]);
  assert.ok(document, "匹配镜头的起始状态无需逐字等于上一整段结束状态");
  const normalized = normalizeStoryboardOrder(document);
  assert.equal(normalized.shots[1].continuity_state.entry, "书页边缘压住");
  assert.equal(normalized.shots[2].continuity_state.entry, "老周低头看书");
  assert.equal(normalized.shots[1].continue_previous, false);
  assert.equal(normalized.shots[1].start_framing, "书页特写");
  const images = shotImages(normalized);
  assert.deepEqual(plain(images.find((item) => item.id === "start:s2").dependencyItems[0]), { type: "shot_image", id: "end:s1" }, "无人道具特写可以匹配同一道具");
  assert.deepEqual(plain(images.find((item) => item.id === "start:s3").dependencyItems[0]), { type: "shot_image", id: "end:s1" }, "返回人物使用该人物最近出镜的规划图");
});

test("匹配参考不跨越剧本场次，也不借用其他地点的道具状态", () => {
  const shots = [
    { id: "s1", scene_index: 1, material_ids: ["book", "shop"] },
    { id: "s2", scene_index: 2, material_ids: ["book", "street"] },
    { id: "s3", scene_index: 3, material_ids: ["book", "shop"], match_previous: true },
  ];
  const image = shotImages(storyboard(shots)).find((item) => item.id === "start:s3");
  assert.deepEqual(plain(image.dependencyItems), []);
  assert.deepEqual(plain(image.referenceItems), [{ type: "prop", id: "book" }, { type: "scene", id: "shop" }]);
});

test("旁白逐句配音并保留各自入点，原环境声低音量保留", () => {
  const document = storyboard([1, 2, 3].map((index) => ({
    id: "s" + index,
    material_ids: ["owner", "shop"],
    speech: [{ id: "n" + index, kind: "narration", text: "第" + index + "句。", start_time: index === 1 ? 0.5 : 0, subtitle_enabled: false, subtitle_text: "" }],
  })));
  document.narrator_voice = "固定女声";
  const spec = STORYBOARD_DERIVED_GROUP_SPECS.find((item) => item.key === "speech");
  const speech = spec.items(document);
  assert.deepEqual(plain(speech.map((item) => [item.id, item.prompt, item.paramValues.voice])), [
    ["n1", "第1句。", "固定女声"], ["n2", "第2句。", "固定女声"], ["n3", "第3句。", "固定女声"],
  ]);
  const nodes = speech.map((item, index) => ({ id: item.id, storyboardItem: { sourceNodeId: "board", itemType: "speech", itemId: item.id }, resultRef: { asset_id: 30 + index, version_id: 31 } }));
  const input = { storyboard: document, sourceNodeId: "board", nodes };
  const composition = storyboardVideoComposition(input);
  assert.ok(composition.clips.every((clip) => clip.originalVolume === 0.35 && !clip.speechTracks.length && !clip.subtitleTracks.length));
  assert.deepEqual(plain(composition.audioTracks.map((track) => [track.audio.assetId, track.startTime, track.fit])), [[30, 0.5, "strict"], [31, 4, "strict"], [32, 8, "strict"]]);
  composition.clips[1].originalVolume = 0.7;
  assert.equal(storyboardVideoComposition({ ...input, current: composition }).clips[1].originalVolume, 0.7);
  document.production_plan.voice_mode = "off";
  const muted = storyboardVideoComposition(input);
  assert.equal(muted.audioTracks.length, 0);
  assert.ok(muted.clips.every((clip) => clip.originalVolume === 0));
});

test("脚本原声模式保留两段各自原声并硬切，不再叠加独立配音", () => {
  const document = storyboard([
    { id: "s1", material_ids: ["owner", "shop"], start_framing: "全景", speech: [{ id: "d1", kind: "dialogue", character_id: "owner", speaker_mode: "visible", text: "这里保留着旧书。", start_time: 0.3, subtitle_enabled: false, subtitle_text: "" }] },
    { id: "s2", material_ids: ["owner", "shop"], match_previous: true, start_framing: "侧面中景", transition_type: "none", speech: [{ id: "d2", kind: "dialogue", character_id: "owner", speaker_mode: "visible", text: "每一本都有来历。", start_time: 0.2, subtitle_enabled: false, subtitle_text: "" }] },
  ]);
  document.production_plan.voice_mode = "native";
  document.production_plan.subtitle_mode = "off";
  const parsed = parseStoryboardOutput(plain(document));
  assert.equal(parsed.production_plan.voice_mode, "native");
  const voiceSpec = STORYBOARD_DERIVED_GROUP_SPECS.find((spec) => spec.key === "speech");
  assert.equal(voiceSpec.enabled(parsed), false);
  const videos = STORYBOARD_DERIVED_GROUP_SPECS.find((spec) => spec.key === "shots").items(parsed);
  assert.deepEqual(plain(videos.map((item) => item.id)), ["s1", "s2"]);
  assert.ok(videos[1].prompt.includes("侧面中景"));
  assert.ok(videos[1].prompt.includes("每一本都有来历。"));
  document.shots[1].speech[0].text = "这些书都来自读者。";
  const edited = STORYBOARD_DERIVED_GROUP_SPECS.find((spec) => spec.key === "shots").items(document);
  assert.equal(edited[0].prompt, videos[0].prompt);
  assert.notEqual(edited[1].prompt, videos[1].prompt);
  const nodes = [1, 2].map((i) => ({ id: "v" + i, storyboardItem: { sourceNodeId: "board", itemType: "shot", itemId: "s" + i }, resultRef: { asset_id: 20 + i, version_id: 30 + i } }));
  nodes.push({ id: "old-voice", storyboardItem: { sourceNodeId: "board", itemType: "speech", itemId: "d1" }, resultRef: { asset_id: 50, version_id: 51 } });
  const composition = storyboardVideoComposition({ storyboard: parsed, sourceNodeId: "board", nodes });
  assert.deepEqual(plain(composition.clips.map((clip) => clip.visualVideo.assetId)), [21, 22]);
  assert.ok(composition.clips.every((clip) => clip.originalVolume === 1 && !clip.speechTracks.length && !clip.subtitleTracks.length));
  assert.equal(composition.audioTracks.length, 0);
  assert.deepEqual(plain(composition.clips[0].transitionToNext), { type: "none", durationMs: 0 });
  composition.clips[0].transitionToNext = { type: "crossfade", durationMs: 700 };
  const refreshed = storyboardVideoComposition({ storyboard: parsed, sourceNodeId: "board", nodes, current: composition });
  assert.deepEqual(plain(refreshed.clips[0].transitionToNext), { type: "none", durationMs: 0 });
});

test("改服装或场景光线只让真正使用该素材的画面待更新", () => {
  const before = storyboard([
    { id: "s1", material_ids: ["owner", "shop"] },
    { id: "s2", material_ids: ["girl", "street"] },
  ]);
  const visuals = (document) => ["characters", "scenes", "shot_images", "shots"].flatMap((key) =>
    STORYBOARD_DERIVED_GROUP_SPECS.find((spec) => spec.key === key).items(document).map((item) => ({
      id: item.type + ":" + item.id,
      storyboardItem: { sourceNodeId: "board", itemType: item.type, itemId: item.id,
        generatedPrompt: item.prompt, generatedInputs: { visualContext: item.visualContext },
        referenceNodeIds: item.referenceItems?.map((source) => source.type + ":" + source.id) },
      resultRef: { asset_id: 10, version_id: 20 },
    })));
  for (const [materialId, prompt] of [["owner", "改穿蓝色外套"], ["shop", "清冷窗光的书店"]]) {
    const edited = plain(before);
    edited.materials.find((material) => material.id === materialId).prompt = prompt;
    const previous = visuals(before), next = visuals(edited);
    assert.equal(invalidateStoryboardFrameResults(previous, next, "board"), true);
    assert.ok(next.find((node) => node.id.endsWith(":" + materialId)).resultRef.status === "invalidated");
    assert.ok(next.filter((node) => node.id.endsWith(":s1")).every((node) => node.resultRef.status === "invalidated"));
    assert.ok(next.filter((node) => node.id.endsWith(":s2")).every((node) => node.resultRef.version_id === 20));
  }
});

test("重做旁白或调整声线只解除旧配音与合成绑定，保留所有镜头", () => {
  const item = (itemType) => ({ sourceNodeId: "board", itemType, itemId: itemType, generatedPrompt: "原文" });
  const previous = [
    { id: "voice", storyboardItem: item("speech"), composerDraft: { paramValues: { voice: "女声" } }, resultRef: { asset_id: 10, version_id: 11 } },
    { id: "video", storyboardItem: item("shot"), resultRef: { asset_id: 20, version_id: 21 } },
    { id: "compose", storyboardItem: item("video_compose"), resultRef: { asset_id: 30, version_id: 31 } },
  ];
  const changed = plain(previous);
  changed[0].composerDraft.paramValues.voice = "男声";
  assert.equal(invalidateStoryboardFrameResults(previous, changed, "board"), true);
  assert.equal(changed[0].resultRef.status, "invalidated");
  assert.equal(changed[1].resultRef.version_id, 21);
  assert.equal(changed[2].resultRef.status, "invalidated");
  const redone = plain(previous);
  redone[0].resultRef.version_id = 12;
  assert.equal(invalidateStoryboardFrameResults(previous, redone, "board", previous), true);
  assert.equal(redone[0].resultRef.version_id, 12);
  assert.equal(redone[1].resultRef.version_id, 21);
  assert.equal(redone[2].resultRef.status, "invalidated");
});

test("发送制作请求保留跨章共享首图引用，不在执行快照中移除规划端点", async () => {
  let sent;
  const api = loader({
    "@dever/front-plugin": {
      getCompatModule() { return {}; },
      joinSiteApi: (value) => value,
      async request(_url, _method, body) { sent = body; return { code: 0, data: {} }; },
    },
    __globals: { crypto: webcrypto, structuredClone, window: { appRuntime: {} } },
  })(path.join(root, "space-api.ts"));
  const video = {
    id: "video", type: "power", kind: "video", title: "镜头", power: { id: 3, key: "video", kind: "video" },
    position: { x: 0, y: 0 },
    storyboardItem: { sourceNodeId: "board", itemType: "shot", itemId: "s1", continuityAnchor: "继续动作", dependencyNodeIds: ["previous-image"], referenceNodeIds: ["previous-image", "current-image"], sharedStartShotId: "last" },
  };
  await api.runSpaceCanvas({ projectId: 4, canvasId: 1, assetCateId: 0, startNodeId: "video", canvas: { id: 1, name: "测试", nodes: [video], edges: [], viewport: { x: 0, y: 0, zoom: 1 } } });
  assert.deepEqual(plain(sent.canvas.nodes[0].storyboard_item.reference_node_ids), ["previous-image", "current-image"]);
  assert.deepEqual(plain(video.storyboardItem.referenceNodeIds), ["previous-image", "current-image"], "执行不得改写当前画布");
});
