import assert from "node:assert/strict";
import test from "node:test";

import { storyboardShotSaveMode } from "../front/src/nodes/body-work/space/space-storyboard-shot-edit.ts";
import { storyboardEditorPosition } from "../front/src/nodes/body-work/space/space-storyboard-editor-position.ts";

test("changed instruction cannot save the old preview through detailed edit", () => {
  assert.equal(storyboardShotSaveMode({
    hasPreview: true,
    previewMatchesInstruction: false,
    hasUnappliedInstruction: true,
    detailed: true,
    draftChangedManually: false,
  }), "blocked");
  assert.equal(storyboardShotSaveMode({
    hasPreview: true,
    previewMatchesInstruction: false,
    hasUnappliedInstruction: false,
    detailed: true,
    draftChangedManually: false,
  }), "blocked");
  assert.equal(storyboardShotSaveMode({
    hasPreview: true,
    previewMatchesInstruction: false,
    hasUnappliedInstruction: true,
    detailed: true,
    draftChangedManually: true,
  }), "blocked");
  assert.equal(storyboardShotSaveMode({
    hasPreview: true,
    previewMatchesInstruction: false,
    hasUnappliedInstruction: false,
    detailed: true,
    draftChangedManually: true,
  }), "blocked");
  assert.equal(storyboardShotSaveMode({
    hasPreview: true,
    previewMatchesInstruction: true,
    hasUnappliedInstruction: false,
    detailed: false,
    draftChangedManually: false,
  }), "preview");
  assert.equal(storyboardShotSaveMode({
    hasPreview: false,
    previewMatchesInstruction: false,
    hasUnappliedInstruction: false,
    detailed: true,
    draftChangedManually: true,
  }), "manual");
  assert.equal(storyboardShotSaveMode({
    hasPreview: false,
    previewMatchesInstruction: false,
    hasUnappliedInstruction: true,
    detailed: true,
    draftChangedManually: false,
  }), "blocked");
  assert.equal(storyboardShotSaveMode({
    hasPreview: false,
    previewMatchesInstruction: false,
    hasUnappliedInstruction: true,
    detailed: true,
    draftChangedManually: true,
  }), "manual");
});

test("editor stays within viewport near right and bottom edges", () => {
  const position = storyboardEditorPosition(
    { left: 970, top: 680, width: 160, height: 120 },
    { width: 640, height: 260 },
    { width: 1200, height: 800 },
  );
  assert.deepEqual(position, { left: 864, top: 404 });
  assert.ok(position.left - 320 >= 16);
  assert.ok(position.left + 320 <= 1184);
  assert.ok(position.top + 260 <= 784);
});

test("editor remains reachable on a narrow viewport", () => {
  const position = storyboardEditorPosition(
    { left: 300, top: 450, width: 180, height: 100 },
    { width: 640, height: 700 },
    { width: 360, height: 600 },
  );
  assert.deepEqual(position, { left: 180, top: 16 });
});
