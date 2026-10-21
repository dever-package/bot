import assert from "node:assert/strict";
import test from "node:test";
import {
  storyboardFrameImageURL,
  storyboardFrames,
  storyboardNodeMediaOutput,
} from "../front/src/nodes/body-work/space/space-storyboard-media.ts";
import { contentOutputMediaURLs } from "../front/src/nodes/body-work/shared/content-output.ts";
import {
  createStoryboardShot,
  type StoryboardDocument,
  type StoryboardShot,
} from "../front/src/nodes/body-work/space/space-storyboard.ts";
import type {
  AssetVersion,
  SpaceCanvasNode,
} from "../front/src/nodes/body-work/space/types.ts";

const image = (url: string) => ({ image: url });
const current = {
  id: 20,
  asset_id: 2,
  version: 2,
  content: image("/current.png"),
};
const older = {
  id: 10,
  asset_id: 2,
  version: 1,
  content: [image("/old-1.png"), image("/old-2.png")],
};
function frameNode(version?: AssetVersion): SpaceCanvasNode {
  return {
    id: "frame",
    type: "power",
    title: "镜头参考图",
    subtitle: "",
    description: "",
    x: 0,
    y: 0,
    width: 320,
    height: 180,
    kind: "image",
    resultRef: { asset_id: 2, version_id: 20 },
    resultOutput: image("/inline.png"),
    result: { output: older.content },
    asset: {
      id: 2,
      project_id: 1,
      body_id: 1,
      team_id: 1,
      flow_id: 1,
      canvas_id: 1,
      asset_cate_id: 1,
      name: "镜头参考图",
      kind: "image",
      version_id: 20,
      sort: 0,
      version,
    },
    storyboardItem: {
      sourceNodeId: "script",
      itemType: "shot_image",
      itemId: "shot-1",
      generatedPrompt: "人物开门",
      shotId: "shot-1",
      frameRole: "start",
      shotImageMode: "first_frame",
    },
  };
}
const urls = (node: SpaceCanvasNode) =>
  contentOutputMediaURLs(storyboardNodeMediaOutput(node), "image");

test("frame media reads the exact cached result version despite a richer old snapshot", () => {
  const node = frameNode(older);
  node.asset!.versions = [current];
  assert.deepEqual(urls(node), ["/current.png"]);
  node.asset!.versions = [{ ...current, asset_id: 99 }];
  assert.deepEqual(urls(node), ["/inline.png"]);
});

test("an unbound node can display its inline media without an asset cache", () => {
  const node = frameNode();
  node.asset = undefined;
  node.resultRef = undefined;
  assert.deepEqual(urls(node), ["/inline.png"]);
});

test("an unloaded current version reads inline output only, never nested historic results", () => {
  const node = frameNode(older);
  assert.deepEqual(urls(node), ["/inline.png"]);
  node.resultOutput = undefined;
  assert.deepEqual(urls(node), []);
});

test("an explicitly loaded empty current version never falls back to stale or inline media", () => {
  const node = frameNode({ ...current, content: { text: "处理中" } });
  node.asset!.versions = [older];
  assert.deepEqual(urls(node), []);
});

test("missing reference identity uses the actual selected asset version", () => {
  const node = frameNode(older);
  node.resultRef = undefined;
  assert.deepEqual(urls(node), ["/old-1.png", "/old-2.png"]);
  node.resultRef = { asset_id: 2 };
  assert.deepEqual(urls(node), ["/old-1.png", "/old-2.png"]);
  node.asset!.version = current;
  node.resultRef = { version_id: 20 };
  assert.deepEqual(urls(node), ["/current.png"]);
});

test("paired frames and reference groups use current media and explicit frame ordering", () => {
  const shot: StoryboardShot = {
    ...createStoryboardShot(0),
    id: "shot-1",
    shot_image_mode: "first_last",
  };
  const storyboard = { shots: [shot] } as StoryboardDocument;
  const output = {
    images: ["/end.png", "/start.png"],
    meta: {
      items: [
        { order: 2, image: "/end.png" },
        { order: 1, image: "/start.png" },
      ],
    },
  };
  assert.equal(storyboardFrameImageURL(output, 1), "/start.png");
  const node = frameNode({ ...current, content: output });
  node.storyboardItem!.shotImageMode = "first_last";
  node.storyboardItem!.frameMediaItems = [
    { frameRole: "start", mediaIndex: 1 },
    { frameRole: "end", mediaIndex: 2 },
  ];
  const [frames] = storyboardFrames(storyboard, "script", [node]);
  assert.equal(frames.start.imageURL, "/start.png");
  assert.equal(frames.end?.imageURL, "/end.png");
  shot.shot_image_mode = "references";
  node.storyboardItem!.shotImageMode = "references";
  const [references] = storyboardFrames(storyboard, "script", [node]);
  assert.deepEqual(
    references.references?.map((frame) => frame.imageURL),
    ["/end.png", "/start.png"],
  );
});
