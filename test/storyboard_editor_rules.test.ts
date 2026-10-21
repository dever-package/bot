import assert from "node:assert/strict";
import test from "node:test";

import {
  applyGeneratedStoryboardShot,
  cloneStoryboardShot,
  storyboardShotDraftIssues,
} from "../front/src/nodes/body-work/space/space-storyboard-shot-edit.ts";
import {
  createStoryboardShot,
  DEFAULT_STORYBOARD_PRODUCTION_PLAN,
  STORYBOARD_VERSION,
  type StoryboardDocument,
  type StoryboardShot,
} from "../front/src/nodes/body-work/space/space-storyboard.ts";
import type { CanvasReferenceContent } from "../front/src/nodes/body-work/space/types.ts";
import { storyboardStreamPreview } from "../front/src/nodes/body-work/space/space-storyboard-preview.ts";
import { storyboardEditorPosition } from "../front/src/nodes/body-work/space/space-storyboard-editor-position.ts";

const shot = {
  ...createStoryboardShot(0),
  description: "人物在门口站定",
  beat: "人物推开门",
  spatial_layout: "人物位于门前",
  start_framing: "中景，正面，人物在门前",
  end_framing: "中景，正面，人物推门",
  camera_instruction: "中景，固定",
  continuity_state: { entry: "人物在门前", exit: "门打开" },
};
const storyboard: StoryboardDocument = {
  type: "storyboard",
  version: STORYBOARD_VERSION,
  work_type: "short",
  workflow: { status: "draft", confirmed_at: "" },
  production_plan: DEFAULT_STORYBOARD_PRODUCTION_PLAN,
  title: "开门",
  summary: "人物推开门",
  target_duration: shot.duration,
  target_shot_count: 1,
  narrator_voice: "",
  storyline: { setup: "门前", development: "推门", payoff: "门打开" },
  style_prompt: "自然光写实",
  visual_mode: "photoreal",
  aspect_ratio: "16:9",
  references: [],
  materials: [],
  shots: [shot],
};

test("a detached shot draft can change without mutating saved speech or continuity", () => {
  const original = {
    ...shot,
    speech: [
      {
        id: "speech-1",
        kind: "narration",
        text: "开门",
        start_time: 0,
        subtitle_enabled: false,
        subtitle_text: "",
      },
    ] as StoryboardShot["speech"],
  };
  const draft = cloneStoryboardShot(original);
  draft.continuity_state.exit = "门关闭";
  draft.speech[0].text = "关门";
  assert.equal(original.continuity_state.exit, "门打开");
  assert.equal(original.speech[0].text, "开门");
});
test("an invalid AI revision preserves the current draft", () => {
  const snapshot = JSON.stringify(shot);
  assert.throws(
    () =>
      applyGeneratedStoryboardShot(storyboard, shot, {
        shot: { ...shot, id: "wrong-shot" },
        materials: [],
      }),
    /标识/,
  );
  assert.throws(
    () =>
      applyGeneratedStoryboardShot(storyboard, shot, {
        shot: { ...shot, description: "" },
        materials: [],
      }),
    /镜头描述/,
  );
  assert.equal(JSON.stringify(shot), snapshot);
});
test("temporary invalid durations block saving before normalization", () => {
  for (const duration of [0, 1, NaN]) {
    assert.ok(
      storyboardShotDraftIssues(storyboard, { ...shot, duration }, []).some(
        (issue) => issue.message.includes("时长"),
      ),
    );
  }
  assert.deepEqual(
    storyboardShotDraftIssues(storyboard, { ...shot, duration: 10 }, []),
    [],
  );
});
test("AI revisions retain references only while their bound field text stays the same", () => {
  const content: CanvasReferenceContent = {
    version: 1,
    parts: [{ type: "text", text: shot.description }],
  };
  const draft = { ...shot, reference_contents: { description: content } };
  const unchanged = applyGeneratedStoryboardShot(storyboard, draft, {
    shot,
    materials: [],
  });
  assert.equal(unchanged.shot.reference_contents?.description, content);
  const changed = applyGeneratedStoryboardShot(storyboard, draft, {
    shot: { ...shot, description: "门已经打开，人物站在门前" },
    materials: [],
  });
  assert.equal(changed.shot.reference_contents?.description, undefined);
  assert.equal(draft.description, shot.description);
});

test("streamed shots are readable without manufacturing a final document", () => {
  const preview = storyboardStreamPreview({
    event: "status",
    meta: {
      storyboard_preview: {
        type: "storyboard",
        shots: [shot],
        aspect_ratio: "9:16",
      },
    },
  });
  assert.equal(preview?.shots[0].beat, shot.beat);
  assert.equal(preview?.aspect_ratio, "9:16");
  assert.equal("workflow" in preview!, false);
  assert.equal("production_plan" in preview!, false);
  assert.equal("continuity_state" in preview!.shots[0], false);
  assert.deepEqual(preview?.materials, []);
  assert.equal(
    storyboardStreamPreview({
      meta: {
        storyboard_preview: {
          type: "storyboard",
          shots: [{ id: "incomplete" }],
        },
      },
    })?.shots.length,
    0,
  );
});

test("editor keeps a reachable viewport inset without flipping on content resize", () => {
  const anchor = { left: 970, top: 680, width: 160, height: 120 };
  const viewport = { width: 1200, height: 800 };
  const position = storyboardEditorPosition(anchor, { width: 640, height: 260 }, viewport);
  assert.deepEqual(position, { left: 864, top: 544, maxHeight: 240 });
  assert.deepEqual(
    storyboardEditorPosition(anchor, { width: 640, height: 700 }, viewport),
    position,
  );
  assert.ok(position.left - 320 >= 16);
  assert.ok(position.left + 320 <= 1184);
  assert.ok(position.top + position.maxHeight <= 784);
});

test("editor remains reachable on a narrow viewport", () => {
  const position = storyboardEditorPosition(
    { left: 300, top: 450, width: 180, height: 100 },
    { width: 640, height: 700 },
    { width: 360, height: 600 },
  );
  assert.deepEqual(position, { left: 180, top: 344, maxHeight: 240 });
});
