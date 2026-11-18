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

test("仅制作图片仍使用规划图预览，视频未生成时不能展示虚假的实际首帧", () => {
  const shots = [
    { id: "s1", material_ids: ["owner", "shop"] },
    { id: "s2", material_ids: ["owner", "shop"], continue_previous: true },
  ];
  const preview = storyboard(shots, "shot_images");
  const items = shotImages(preview);
  assert.deepEqual(plain(items[1].dependencyItems), [{ type: "shot_image", id: "s1" }]);
  assert.ok(items.every((item) => !item.dependencyItems.some((source) => source.type === "shot")));
  const nodes = items.map((item, index) => ({
    id: item.id, storyboardItem: { sourceNodeId: "board", itemType: "shot_image", shotId: item.shotId, frameMediaItems: item.frameMediaItems },
    resultOutput: { images: index ? ["/planned-c.png"] : ["/planned-a.png", "/planned-b.png"] },
  }));
  assert.equal(storyboardFrames(preview, "board", nodes)[1].start.imageURL, "/planned-b.png");
  assert.equal(storyboardFrames(storyboard(shots), "board", nodes)[1].start.imageURL, "");
});

test("重做上游实际视频会解除连续段的尾图、视频和合成，保留独立镜头", () => {
  const item = (itemType, extra = {}) => ({ sourceNodeId: "board", itemType, ...extra });
  const node = (id, itemType, extra = {}) => ({ id, storyboardItem: item(itemType, extra), resultRef: { asset_id: 1, version_id: 1 } });
  const before = [
    node("v1", "shot"),
    node("i2", "shot_image", { dependencyNodeIds: ["v1"] }),
    node("v2", "shot", { dependencyNodeIds: ["v1"], referenceNodeIds: ["i2"] }),
    node("compose", "video_compose", { referenceNodeIds: ["v1", "v2"] }),
    node("independent", "shot"),
  ];
  const after = structuredClone(before);
  after[0].resultRef.version_id = 2;
  assert.equal(invalidateStoryboardFrameResults(before, after, "board", before), true);
  for (const id of ["i2", "v2", "compose"]) assert.equal(after.find((node) => node.id === id).resultRef.status, "invalidated");
  assert.equal(after[4].resultRef.version_id, 1);
});

test("续拍依赖真实视频边界，换机位只等规划图，空镜保持独立", () => {
  const document = storyboard([
    { id: "s1", material_ids: ["owner", "shop"] },
    { id: "s2", material_ids: ["owner", "shop"], continue_previous: true },
    { id: "s3", material_ids: ["owner", "shop"], match_previous: true, start_framing: "手部特写" },
    { id: "s4", material_ids: ["shop"], description: "无人环境空镜" },
    { id: "s5", material_ids: ["street"], description: "街道空镜" },
  ]);
  const images = shotImages(document);
  assert.deepEqual(plain(images.map((item) => item.shotId)), ["s1", "s2", "s3", "s4", "s5"]);
  assert.deepEqual(plain(images.map((item) => item.shotImageMode)), ["first_last", "last_frame", "first_last", "first_last", "first_last"]);
  assert.deepEqual(plain(images[1].frameMediaItems), [{ frameRole: "end", mediaIndex: 1 }]);
  assert.deepEqual(plain(images[1].dependencyItems), [{ type: "shot", id: "s1" }]);
  assert.deepEqual(plain(images[1].referenceItems), []);
  const cut = images.find((item) => item.shotId === "s3");
  assert.deepEqual(plain(cut.dependencyItems), [{ type: "shot_image", id: "s2" }]);
  assert.ok(cut.referenceItems.some((source) => source.type === "shot_image" && source.id === "s2"));
  assert.ok(!cut.referenceItems.some((source) => source.type === "shot"));
  for (const [id, scene] of [["s4", "shop"], ["s5", "street"]]) {
    const image = images.find((item) => item.shotId === id);
    assert.deepEqual(plain(image.dependencyItems), []);
    assert.deepEqual(plain(image.referenceItems), [{ type: "scene", id: scene }]);
  }
  const videos = STORYBOARD_DERIVED_GROUP_SPECS.find((spec) => spec.key === "shots")
    .items(document, { framePlanVersion: STORYBOARD_FRAME_PLAN_VERSION });
  assert.deepEqual(plain(videos[1].referenceItems), [{ type: "shot_image", id: "s2" }]);
  assert.deepEqual(plain(videos[1].dependencyItems), [{ type: "shot", id: "s1" }]);
  assert.equal(videos[1].sharedStartShotId, "s1");
  assert.equal(videos[2].sharedStartShotId, undefined, "换机位重新建立首帧");
  assert.ok([...images, ...videos].every((item) => item.referenceItems.every((source) => source.type !== "shot")));
  for (const index of [2, 3, 4]) {
    assert.deepEqual(plain(videos[index].referenceItems), [{ type: "shot_image", id: `s${index + 1}` }]);
  }
});

test("换场按本镜设定创建首帧，已出镜人物只继承自己的设定", () => {
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
  assert.deepEqual(plain(scene.dependencyItems), []);
  assert.deepEqual(plain(scene.referenceItems), [{ type: "character", id: "girl" }, { type: "scene", id: "street" }]);
});

test("没有共同人物的换场独立生成，仅制作参考图也能保持共同人物外观", () => {
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
  assert.deepEqual(plain(imagesOnly.dependencyItems), []);
  assert.deepEqual(plain(imagesOnly.referenceItems), [{ type: "character", id: "girl" }, { type: "scene", id: "street" }]);
});

test("三镜连续段只需四张图，后镜首帧显示视频实际末帧，改图解除相关旧视频绑定", () => {
  const document = storyboard([
    { id: "s1", material_ids: ["owner", "shop"] },
    { id: "s2", material_ids: ["owner", "shop"], continue_previous: true },
    { id: "s3", material_ids: ["owner", "shop"], continue_previous: true },
  ]);
  const images = shotImages(document);
  assert.equal(images.reduce((count, item) => count + item.frameMediaItems.length, 0), 4);
  const nodes = images.map((item, index) => ({
    id: `image-${item.id}`,
    storyboardItem: { sourceNodeId: "board", itemType: "shot_image", itemId: item.id, shotId: item.shotId, shotImageMode: item.shotImageMode, frameMediaItems: item.frameMediaItems },
    resultOutput: { meta: index > 0 ? { storyboard_boundary_frame: { url: index === 1 ? "/actual-b.png" : "/actual-c.png" } } : {}, images: index === 0 ? ["/a.png", "/b.png"] : [`/${index === 1 ? "c" : "d"}.png`] },
  }));
  const frames = storyboardFrames(document, "board", nodes);
  assert.deepEqual(plain(frames.map((frame) => [frame.start.imageURL, frame.end.imageURL])), [["/a.png", "/b.png"], ["/actual-b.png", "/c.png"], ["/actual-c.png", "/d.png"]]);
  const imageNode = { id: "image-s2", storyboardItem: { sourceNodeId: "board", itemType: "shot_image", generatedPrompt: "尾帧" }, resultRef: { asset_id: 1, version_id: 10 } };
  const videos = [1, 2, 3].map((index) => ({ id: `video-${index}`, storyboardItem: { sourceNodeId: "board", itemType: "shot", generatedPrompt: "动作", referenceNodeIds: index === 1 ? ["image-s1"] : index === 2 ? ["image-s1", "image-s2"] : ["image-s2", "image-s3"] }, resultRef: { asset_id: index + 1, version_id: index + 10 } }));
  const previous = [imageNode, ...videos];
  const changed = [{ ...imageNode, resultRef: { asset_id: 1, version_id: 20 } }, ...videos.map((node) => ({ ...node }))];
  assert.equal(invalidateStoryboardFrameResults(previous, changed, "board", previous), true);
  assert.equal(changed[1].resultRef.version_id, 11, "不引用新图片的第一镜保持有效");
  assert.ok(changed.slice(2).every((node) => node.resultRef.status === "invalidated"));
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
  const frame = shotImages(edited)[1];
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
  assert.deepEqual(plain(shotImages(document)[1].dependencyItems), [{ type: "shot_image", id: "s1" }]);
});

test("插入镜之后的换机位仍以人物最近一次出镜的尾帧为底图", () => {
  const document = storyboard([
    { id: "s1", material_ids: ["owner", "shop"] },
    { id: "s2", material_ids: ["shop"], description: "无人细节特写" },
    { id: "s3", material_ids: ["owner", "shop"], match_previous: true },
  ]);
  const cut = shotImages(document).find((item) => item.shotId === "s3");
  assert.deepEqual(plain(cut.dependencyItems[0]), { type: "shot_image", id: "s1" });
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
  assert.deepEqual(plain(images[1].dependencyItems[0]), { type: "shot_image", id: "s1" }, "无人道具特写可以匹配同一道具");
  assert.deepEqual(plain(images[2].dependencyItems[0]), { type: "shot_image", id: "s1" }, "返回人物使用该人物最近出镜的规划图");
});

test("匹配参考不跨越剧本场次，也不借用其他地点的道具状态", () => {
  const shots = [
    { id: "s1", scene_index: 1, material_ids: ["book", "shop"] },
    { id: "s2", scene_index: 2, material_ids: ["book", "street"] },
    { id: "s3", scene_index: 3, material_ids: ["book", "shop"], match_previous: true },
  ];
  const image = shotImages(storyboard(shots))[2];
  assert.deepEqual(plain(image.dependencyItems), []);
  assert.deepEqual(plain(image.referenceItems), [{ type: "prop", id: "book" }, { type: "scene", id: "shop" }]);
});

test("旁白逐句配音并保留各自入点，跨镜播放时原声默认静音", () => {
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
  assert.ok(composition.clips.every((clip) => clip.originalVolume === 0 && !clip.speechTracks.length && !clip.subtitleTracks.length));
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
