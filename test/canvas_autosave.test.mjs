import assert from "node:assert/strict";
import test from "node:test";
import { loader } from "./writing_test_loader.mjs";

test("canvas autosave uses the last saved baseline and stops on conflict", async () => {
  const baselines = [];
  const reported = [];
  const conflict = Object.assign(new Error("画布已在其他页面修改"), { code: 409 });
  const load = loader({
    "./space-api": {
      async saveSpaceCanvas({ baseline }) {
        baselines.push(baseline);
        if (baselines.length > 2) throw conflict;
        return { baseline: "saved-" + baselines.length, updatedAt: "saved" };
      },
    },
    __globals: { Error },
  });
  const { useCanvasAutosave } = load(new URL(
    "../front/src/nodes/body-work/space/space-autosave.ts", import.meta.url,
  ).pathname);
  const canvas = { id: 42, assetCateId: 2, loadedBaseline: "from-load" };
  const canvases = { [canvas.id]: canvas };
  const autosave = useCanvasAutosave({
    projectId: 7,
    enabled: true,
    canvases,
    setCanvases() {},
    onError: (error) => reported.push(error),
  });
  autosave.resetCanvasAutosave(canvases);
  await autosave.flushCanvasSave(canvas);
  await autosave.flushCanvasSave(canvas);
  assert.deepEqual(baselines, ["from-load", "saved-1"]);
  await assert.rejects(autosave.flushCanvasSave(canvas), conflict);
  await assert.rejects(autosave.flushCanvasSave(canvas), conflict);
  assert.deepEqual(baselines, ["from-load", "saved-1", "saved-2"]);
  assert.equal(reported[0], conflict);
  assert.equal(autosave.hasPendingCanvasSaves(canvas.id), true);
});
