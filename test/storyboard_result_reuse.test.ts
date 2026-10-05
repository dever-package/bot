import assert from "node:assert/strict";
import test, { before } from "node:test";

import {
  canvasGroupRunTargetNodeIds,
  storyboardRunBlockedReason,
  summarizeCanvasGroupRuntime,
} from "../front/src/nodes/body-work/space/space-group-runtime.ts";
import {
  storyboardFrameRunSummary,
  storyboardFrameScopes,
} from "../front/src/nodes/body-work/space/space-storyboard-frame.ts";
import type {
  AssetCate,
  PowerOption,
  SpaceCanvasNode,
} from "../front/src/nodes/body-work/space/types.ts";

let normalizeCanvasState: typeof import("../front/src/nodes/body-work/space/space-model.ts").normalizeCanvasState;
let persistedCanvasState: typeof import("../front/src/nodes/body-work/space/space-canvas-state.ts").persistedCanvasState;
let storyboardVideoComposition: typeof import("../front/src/nodes/body-work/space/space-storyboard-composition.ts").storyboardVideoComposition;
let parseStoryboardOutput: typeof import("../front/src/nodes/body-work/space/space-storyboard.ts").parseStoryboardOutput;
let createStoryboardShot: typeof import("../front/src/nodes/body-work/space/space-storyboard.ts").createStoryboardShot;
let materializeCanvasStoryboardDerivedGroups: typeof import("../front/src/nodes/body-work/space/space-storyboard-derived-groups.ts").materializeCanvasStoryboardDerivedGroups;
let refreshCanvasStoryboardDerivedGroups: typeof import("../front/src/nodes/body-work/space/space-storyboard-derived-groups.ts").refreshCanvasStoryboardDerivedGroups;

before(async () => {
  globalThis.window = {
    appRuntime: {},
    location: { host: "test.local", hostname: "test.local", protocol: "http:" },
    localStorage: {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    },
  } as unknown as Window & typeof globalThis;
  ({ normalizeCanvasState } =
    await import("../front/src/nodes/body-work/space/space-model.ts"));
  ({ persistedCanvasState } =
    await import("../front/src/nodes/body-work/space/space-canvas-state.ts"));
  ({ storyboardVideoComposition } =
    await import("../front/src/nodes/body-work/space/space-storyboard-composition.ts"));
  ({ parseStoryboardOutput, createStoryboardShot } =
    await import("../front/src/nodes/body-work/space/space-storyboard.ts"));
  ({
    materializeCanvasStoryboardDerivedGroups,
    refreshCanvasStoryboardDerivedGroups,
  } =
    await import("../front/src/nodes/body-work/space/space-storyboard-derived-groups.ts"));
});

const legacyMetadata = {
  stale: true,
  source_signature: "updated-prompt",
  result_source_signature: "old-prompt",
};
const hasResult = (node: SpaceCanvasNode) => node.resultOutput != null;

function savedCanvas() {
  return normalizeCanvasState({
    id: 1,
    asset_cate_id: 1,
    nodes: [
      {
        id: "source",
        type: "power",
        title: "分镜脚本",
        output_type: "storyboard",
        power: { id: 1, kind: "text", output_type: "storyboard" },
        result_output: {
          type: "storyboard",
          version: 9,
          title: "角色转身",
          target_duration: 4,
          target_shot_count: 1,
          narrator_voice: "",
          style_prompt: "写实",
          visual_mode: "photoreal",
          storyline: { setup: "站定", development: "转身", payoff: "回望" },
          references: [],
          materials: [],
          workflow: { status: "confirmed" },
          production_plan: { output_target: "reference_images" },
          shots: [
            {
              ...createStoryboardShot(0),
              duration: 4,
              beat: "角色转身",
              description: "中景",
              continuity_state: { entry: "站定", exit: "回望" },
            },
          ],
        },
      },
      {
        id: "image",
        type: "power",
        title: "镜头参考图",
        power: { id: 2, kind: "image", output_type: "general" },
        storyboard_item: {
          source_node_id: "source",
          item_type: "shot_image",
          item_id: "shot-1",
          generated_prompt: "中景",
          ...legacyMetadata,
        },
        result_output: { kind: "image", items: [{ url: "/frame.png" }] },
        result_ref: { asset_id: 21, version_id: 31 },
      },
    ],
  });
}

test("loading and saving an old canvas drops update markers and preserves its result", () => {
  const canvas = savedCanvas();
  const image = canvas.nodes[1];
  assert.ok(image.storyboardItem);
  assert.equal("stale" in image.storyboardItem, false);
  assert.equal("sourceSignature" in image.storyboardItem, false);
  assert.equal("resultSourceSignature" in image.storyboardItem, false);
  const saved = persistedCanvasState(canvas).nodes[1];
  for (const key of Object.keys(legacyMetadata)) {
    assert.equal(key in saved.storyboard_item!, false);
  }
  const restored = normalizeCanvasState(persistedCanvasState(canvas)).nodes[1];
  assert.deepEqual(restored.resultRef, image.resultRef);
  image.resultRef = undefined;
  const inlineResult = normalizeCanvasState(persistedCanvasState(canvas))
    .nodes[1];
  assert.deepEqual(inlineResult.resultOutput, image.resultOutput);
});

test("existing results count as complete and remain available for manual group reruns", () => {
  const canvas = savedCanvas();
  const image = canvas.nodes[1];
  Object.assign(image.storyboardItem!, { stale: true });
  const frame = storyboardFrameScopes(canvas.nodes, hasResult)[0];
  assert.equal(frame.completedCount, 1);
  assert.deepEqual(storyboardFrameRunSummary(frame, canvas.nodes, hasResult), {
    pendingNodeIds: [],
    blockedReason: "制作区已完成",
  });
  assert.equal(
    summarizeCanvasGroupRuntime({
      members: [image],
      runningNodes: {},
      hasResult,
    }).completedCount,
    1,
  );
  assert.deepEqual(
    canvasGroupRunTargetNodeIds({ members: [image], hasResult }),
    [image.id],
  );

  const pending = { ...image, id: "pending", resultOutput: undefined };
  assert.deepEqual(
    canvasGroupRunTargetNodeIds({ members: [image, pending], hasResult }),
    [pending.id],
  );
  pending.storyboardItem = {
    ...image.storyboardItem!,
    dependencyNodeIds: [image.id],
  };
  assert.equal(
    storyboardRunBlockedReason({
      targets: [pending],
      nodesByID: new Map([[image.id, image]]),
      hasResult,
    }),
    "",
  );
});

test("changing storyboard settings and references keeps generated results usable", () => {
  const canvas = savedCanvas();
  const assetCate = {
    id: 1,
    name: "视频",
    kind: "video",
    cardinality: "multiple",
    status: 1,
    sort: 1,
    team_id: 1,
  } as AssetCate;
  const powers = [
    { id: 2, kind: "image", outputType: "general" },
  ] as PowerOption[];
  const materialized = materializeCanvasStoryboardDerivedGroups({
    canvas,
    assetCate,
    powers,
    sourceNodeId: "source",
  });
  const source = materialized.nodes.find((node) => node.id === "source")!;
  const storyboard = parseStoryboardOutput(source.resultOutput);
  assert.ok(storyboard);
  storyboard.style_prompt = "新的画面风格";
  storyboard.shots[0].description = "改成远景";
  storyboard.references = [
    {
      asset_id: 45,
      version_id: 55,
      kind: "image",
      purpose: "style",
      label: "新参考",
    },
  ];
  source.resultOutput = storyboard;
  const refreshed = refreshCanvasStoryboardDerivedGroups({
    canvas: materialized,
    assetCate,
    powers,
  });
  const image = refreshed.nodes.find((node) => node.id === "image")!;
  assert.notEqual(
    image.storyboardItem?.generatedPrompt,
    materialized.nodes.find((node) => node.id === "image")?.storyboardItem
      ?.generatedPrompt,
  );
  assert.deepEqual(image.resultOutput, canvas.nodes[1].resultOutput);
  assert.deepEqual(image.resultRef, canvas.nodes[1].resultRef);
  assert.ok(image.storyboardItem);
  assert.equal("stale" in image.storyboardItem, false);
  const frame = storyboardFrameScopes(refreshed.nodes, hasResult)[0];
  assert.deepEqual(
    storyboardFrameRunSummary(frame, refreshed.nodes, hasResult).pendingNodeIds,
    [],
  );
});

test("composition uses existing lip-sync video even with a historical update marker", () => {
  const canvas = savedCanvas();
  const storyboard = parseStoryboardOutput(canvas.nodes[0].resultOutput);
  assert.ok(storyboard);
  const original = {
    ...canvas.nodes[1],
    id: "video",
    resultRef: { asset_id: 22, version_id: 32 },
  };
  original.storyboardItem = { ...original.storyboardItem!, itemType: "shot" };
  const lipSync = {
    ...original,
    id: "lip-sync",
    resultRef: { asset_id: 23, version_id: 33 },
  };
  lipSync.storyboardItem = { ...original.storyboardItem, itemType: "lip_sync" };
  Object.assign(lipSync.storyboardItem, { stale: true });
  const input = {
    storyboard,
    sourceNodeId: "source",
    nodes: [original, lipSync],
  };
  const composition = storyboardVideoComposition(input);
  assert.equal(composition.clips[0].visualVideo?.assetId, 23);
  composition.clips[0].useOriginalVideo = true;
  assert.equal(
    storyboardVideoComposition({ ...input, current: composition }).clips[0]
      .visualVideo?.assetId,
    22,
  );
});
