import assert from "node:assert/strict";
import test from "node:test";

import {
  STORYBOARD_FRAME_COLLAPSED_SIZE,
  STORYBOARD_FRAME_OVERVIEW_SIZE,
  storyboardFrameDisplayBounds,
  storyboardFrameDisplayModes,
  storyboardFrameHiddenNodeIds,
  type StoryboardFrameDisplayScope,
} from "../front/src/nodes/body-work/space/space-storyboard-frame-display.ts";

const sourceNode = {
  id: "storyboard-source",
  type: "power",
  title: "分镜脚本",
  x: 100,
  y: 200,
  width: 320,
  height: 240,
  storyboardMaterializedSignature: "storyboard-v1",
};
const groupNode = {
  id: "storyboard-group",
  type: "group",
  title: "镜头参考图组",
  x: 520,
  y: 200,
  width: 420,
  height: 260,
  group: {
    origin: "script",
    sourceNodeId: sourceNode.id,
  },
};
const workNode = {
  id: "storyboard-result",
  type: "power",
  title: "镜头 1 参考图",
  x: 560,
  y: 250,
  width: 180,
  height: 180,
  groupId: groupNode.id,
  storyboardItem: {
    sourceNodeId: sourceNode.id,
    itemType: "shot_image",
  },
};
const frame: StoryboardFrameDisplayScope = {
  id: "storyboard-frame:storyboard-source",
  sourceNodeId: sourceNode.id,
  memberNodeIds: [sourceNode.id, groupNode.id, workNode.id],
  sourceBounds: {
    x: sourceNode.x,
    y: sourceNode.y,
    width: sourceNode.width,
    height: sourceNode.height,
  },
  bounds: {
    x: 48,
    y: 128,
    width: 944,
    height: 380,
  },
};

test("storyboard production overview is anchored beside the visible script", () => {
  assert.deepEqual(storyboardFrameDisplayBounds(frame, "overview"), {
    x: sourceNode.x + sourceNode.width + 48,
    y: sourceNode.y,
    ...STORYBOARD_FRAME_OVERVIEW_SIZE,
  });
  assert.deepEqual(storyboardFrameDisplayBounds(frame, "minimized"), {
    x: sourceNode.x + sourceNode.width + 48,
    y: sourceNode.y,
    ...STORYBOARD_FRAME_COLLAPSED_SIZE,
  });
  assert.deepEqual(storyboardFrameDisplayBounds(frame, "expanded"), frame.bounds);
});

test("only the selected storyboard production frame is expanded", () => {
  const secondFrame: StoryboardFrameDisplayScope = {
    ...frame,
    id: "storyboard-frame:second-source",
    sourceNodeId: "second-source",
    memberNodeIds: ["second-source", "second-result"],
  };
  const modes = storyboardFrameDisplayModes(
    [frame, secondFrame],
    secondFrame.id,
    new Set([frame.id]),
  );

  assert.equal(modes.get(frame.id), "minimized");
  assert.equal(modes.get(secondFrame.id), "expanded");
  assert.equal(
    [...modes.values()].filter((mode) => mode === "expanded").length,
    1,
  );
});

test("overview and minimized modes only hide derived production nodes", () => {
  for (const mode of ["overview", "minimized"] as const) {
    const hidden = storyboardFrameHiddenNodeIds([frame], () => mode);
    assert.equal(hidden.has(sourceNode.id), false);
    assert.equal(hidden.has(groupNode.id), true);
    assert.equal(hidden.has(workNode.id), true);
  }

  assert.equal(
    storyboardFrameHiddenNodeIds([frame], () => "expanded").size,
    0,
  );
});
