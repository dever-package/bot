import assert from "node:assert/strict";
import test from "node:test";

import { createSequentialAssetUploadProgress } from "../src/nodes/body-work/asset/asset-upload-progress.ts";

test("aggregates sequential file progress by source byte size", () => {
  const events = [];
  const tracker = createSequentialAssetUploadProgress(
    [
      { name: "small.png", size: 100 },
      { name: "large.mp4", size: 300 },
    ],
    (progress) => events.push(progress),
  );

  tracker.start(0);
  tracker.report(0, 50, 100);
  tracker.saving(0);
  tracker.complete(0);
  tracker.start(1);
  tracker.report(1, 150, 300);
  tracker.complete(1);

  assert.deepEqual(
    events.map(({ phase, fileIndex, loaded, total, percent }) => ({
      phase,
      fileIndex,
      loaded,
      total,
      percent,
    })),
    [
      { phase: "preparing", fileIndex: 1, loaded: 0, total: 400, percent: 0 },
      { phase: "uploading", fileIndex: 1, loaded: 50, total: 400, percent: 13 },
      { phase: "saving", fileIndex: 1, loaded: 100, total: 400, percent: 25 },
      { phase: "complete", fileIndex: 1, loaded: 100, total: 400, percent: 25 },
      {
        phase: "preparing",
        fileIndex: 2,
        loaded: 100,
        total: 400,
        percent: 25,
      },
      {
        phase: "uploading",
        fileIndex: 2,
        loaded: 250,
        total: 400,
        percent: 63,
      },
      {
        phase: "complete",
        fileIndex: 2,
        loaded: 400,
        total: 400,
        percent: 100,
      },
    ],
  );
});

test("completes a zero-byte upload without dividing by zero", () => {
  const events = [];
  const tracker = createSequentialAssetUploadProgress(
    [{ name: "empty.txt", size: 0 }],
    (progress) => events.push(progress),
  );

  tracker.start(0);
  tracker.complete(0);

  assert.deepEqual(
    events.map(({ loaded, total, percent }) => ({ loaded, total, percent })),
    [
      { loaded: 0, total: 0, percent: 0 },
      { loaded: 0, total: 0, percent: 100 },
    ],
  );
});

test("clamps invalid transport progress without moving backward", () => {
  const events = [];
  const tracker = createSequentialAssetUploadProgress(
    [{ name: "image.png", size: 20 }],
    (progress) => events.push(progress),
  );

  tracker.report(0, -5, 0);
  tracker.report(0, 30, 20);
  tracker.report(0, 10, 20);

  assert.deepEqual(
    events.map(({ loaded, percent }) => ({ loaded, percent })),
    [
      { loaded: 0, percent: 0 },
      { loaded: 20, percent: 100 },
      { loaded: 20, percent: 100 },
    ],
  );
});
