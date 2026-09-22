import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import {
  STORYBOARD_FRAME_OVERVIEW_SIZE,
  storyboardFrameDisplayBounds,
  storyboardFrameDisplayModes,
  storyboardFrameHiddenNodeIds,
  type StoryboardFrameDisplayScope,
} from "../front/src/nodes/body-work/space/space-storyboard-frame-display.ts";
import {
  moveStoryboardFrameNodes,
  storyboardFrameMoveDelta,
  type StoryboardFrameScope,
} from "../front/src/nodes/body-work/space/space-storyboard-frame.ts";
import type { SpaceCanvasNode } from "../front/src/nodes/body-work/space/types.ts";

const sourceNode = {
  id: "storyboard-source",
  x: 100,
  y: 200,
  width: 320,
  height: 240,
};
const groupId = "storyboard-group";
const resultId = "storyboard-result";
const frame: StoryboardFrameDisplayScope = {
  id: "storyboard-frame:storyboard-source",
  sourceNodeId: sourceNode.id,
  memberNodeIds: [sourceNode.id, groupId, resultId],
  sourceBounds: {
    x: sourceNode.x,
    y: sourceNode.y,
    width: sourceNode.width,
    height: sourceNode.height,
  },
  bounds: { x: 48, y: 128, width: 944, height: 380 },
};

test("production overview stays beside its script; expanded mode uses real node bounds", () => {
  assert.deepEqual(storyboardFrameDisplayBounds(frame, "overview"), {
    x: sourceNode.x + sourceNode.width + 48,
    y: sourceNode.y,
    ...STORYBOARD_FRAME_OVERVIEW_SIZE,
  });
  assert.equal(storyboardFrameDisplayBounds(frame, "expanded"), frame.bounds);
});

test("production overview preserves its offset from the script", () => {
  const positioned = { ...frame, overviewPosition: { x: 870, y: 355 } };
  assert.deepEqual(storyboardFrameDisplayBounds(positioned, "overview"), {
    x: 870,
    y: 355,
    ...STORYBOARD_FRAME_OVERVIEW_SIZE,
  });
  assert.equal(
    storyboardFrameDisplayBounds(positioned, "expanded"),
    frame.bounds,
  );
});

test("dragging either the overview or the script moves the entire production frame", () => {
  const nodes = [
    {
      id: sourceNode.id,
      x: 100,
      y: 200,
      storyboardOverviewPosition: { x: 870, y: 355 },
    },
    { id: groupId, x: 510, y: 220 },
    { id: resultId, x: 580, y: 250 },
  ] as SpaceCanvasNode[];
  const scope = {
    ...frame,
    overviewPosition: nodes[0].storyboardOverviewPosition,
  } as StoryboardFrameScope;
  assert.equal(
    moveStoryboardFrameNodes(nodes, scope, { x: 870, y: 355 }, "overview"),
    nodes,
  );
  assert.deepEqual(
    storyboardFrameMoveDelta(scope, { x: 900, y: 370 }, "overview"),
    { x: 30, y: 15 },
  );
  const movedOverview = moveStoryboardFrameNodes(
    nodes,
    scope,
    { x: 900, y: 370 },
    "overview",
  );
  assert.deepEqual(movedOverview[0].storyboardOverviewPosition, {
    x: 900,
    y: 370,
  });
  assert.deepEqual([movedOverview[0].x, movedOverview[0].y], [130, 215]);
  assert.deepEqual([movedOverview[1].x, movedOverview[1].y], [540, 235]);
  assert.deepEqual([movedOverview[2].x, movedOverview[2].y], [610, 265]);

  const movedScript = moveStoryboardFrameNodes(
    nodes,
    scope,
    { x: 75, y: 240 },
    "source",
  );
  assert.deepEqual(movedScript[0].storyboardOverviewPosition, {
    x: 845,
    y: 395,
  });
  assert.deepEqual([movedScript[1].x, movedScript[1].y], [485, 260]);

  const movedExpanded = moveStoryboardFrameNodes(nodes, scope, {
    x: 68,
    y: 138,
  });
  assert.deepEqual(movedExpanded[0].storyboardOverviewPosition, {
    x: 890,
    y: 365,
  });
  assert.equal(movedExpanded[1].x, 530);
});

test("overview is the default and only one production frame expands", () => {
  const secondFrame: StoryboardFrameDisplayScope = {
    ...frame,
    id: "storyboard-frame:second-source",
    sourceNodeId: "second-source",
    memberNodeIds: ["second-source", "second-result"],
  };
  const frames = [frame, secondFrame];
  assert.deepEqual(
    [...storyboardFrameDisplayModes(frames, "").values()],
    ["overview", "overview"],
  );
  assert.deepEqual(
    [...storyboardFrameDisplayModes(frames, secondFrame.id).values()],
    ["overview", "expanded"],
  );
});

test("overview hides only derived production nodes; expanded mode reveals them", () => {
  const hidden = storyboardFrameHiddenNodeIds([frame], () => "overview");
  assert.equal(hidden.has(sourceNode.id), false);
  assert.equal(hidden.has(groupId), true);
  assert.equal(hidden.has(resultId), true);
  assert.equal(storyboardFrameHiddenNodeIds([frame], () => "expanded").size, 0);
});

test("production overview reuses canvas nodes and the existing settings editor", () => {
  const pageSource = readFileSync(
    new URL(
      "../front/src/nodes/body-work/space/space-page.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  const overviewSource = readFileSync(
    new URL(
      "../front/src/nodes/body-work/space/space-storyboard-frame-overview.tsx",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(
    pageSource,
    /<SpaceNodeView data=\{node\} selected=\{false\} \/>/,
  );
  assert.match(pageSource, /renderNode: renderStoryboardFrameNode/);
  assert.match(overviewSource, /\{renderNode\(result\.node\)\}/);
  assert.match(overviewSource, /createPortal\(/);
  assert.match(overviewSource, /<CanvasNodeSettings/);
  assert.doesNotMatch(overviewSource, /StoryboardFrameResultPreview/);
  assert.match(pageSource, /storyboardDisplayEdges/);
  assert.match(pageSource, /targetHandle: "storyboard-input"/);
  assert.match(
    pageSource,
    /moveStoryboardFrameNodes\(\s*nodes,\s*storyboardFrame,\s*draggedNode\.position,\s*anchor/,
  );
});
