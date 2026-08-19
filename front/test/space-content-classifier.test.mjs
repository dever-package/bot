import assert from "node:assert/strict";
import test from "node:test";

import { canvasContentNeedsRenderer } from "../src/nodes/body-work/space/space-content-classifier.ts";

const VIDEO_URL = "https://cdn.example.com/result.mp4";

function richVideo(attrs = {}) {
  return {
    type: "editorMediaVideo",
    attrs: { src: VIDEO_URL, ...attrs },
  };
}

function richDocument(...content) {
  return { type: "doc", content };
}

function renderFacts(rich, overrides = {}) {
  return {
    items: [{ rich }],
    mediaCount: 1,
    previewMediaURL: VIDEO_URL,
    outputMediaURLs: [VIDEO_URL],
    ...overrides,
  };
}

test("uses the pure preview for a matching single rich-text video", () => {
  const rich = richDocument(
    { type: "paragraph" },
    richVideo(),
    { type: "paragraph" },
  );

  assert.equal(canvasContentNeedsRenderer(renderFacts(rich)), false);
});

test("uses the pure preview for a serialized single rich-text video", () => {
  const rich = JSON.stringify(richDocument(richVideo()));

  assert.equal(canvasContentNeedsRenderer(renderFacts(rich)), false);
});

test("keeps the content renderer when a video has visible rich text", () => {
  const rich = richDocument(
    richVideo(),
    { type: "paragraph", content: [{ type: "text", text: "视频说明" }] },
  );

  assert.equal(canvasContentNeedsRenderer(renderFacts(rich)), true);
});

test("keeps the content renderer when a video has a caption", () => {
  const rich = richDocument(richVideo({ caption: "成片预览" }));

  assert.equal(canvasContentNeedsRenderer(renderFacts(rich)), true);
});

test("ignores an empty rich-text media caption", () => {
  const rich = richDocument(richVideo({ caption: "   " }));

  assert.equal(canvasContentNeedsRenderer(renderFacts(rich)), false);
});

test("keeps the content renderer for multiple media items", () => {
  const rich = richDocument(richVideo());

  assert.equal(
    canvasContentNeedsRenderer(
      renderFacts(rich, {
        mediaCount: 2,
        outputMediaURLs: [VIDEO_URL, "https://cdn.example.com/second.mp4"],
      }),
    ),
    true,
  );
});

test("keeps the content renderer when the preview URL does not match", () => {
  const rich = richDocument(richVideo());

  assert.equal(
    canvasContentNeedsRenderer(
      renderFacts(rich, {
        previewMediaURL: "https://cdn.example.com/another.mp4",
      }),
    ),
    true,
  );
});
