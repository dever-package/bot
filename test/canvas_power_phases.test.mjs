import assert from "node:assert/strict";
import test from "node:test";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const require = createRequire(new URL("../front/package.json", import.meta.url));
const ts = require("typescript");
const root = new URL("../front/src/nodes/body-work/", import.meta.url);
const cache = new Map();
function load(url) {
  const key = String(url);
  if (cache.has(key)) return cache.get(key);
  const exports = {};
  cache.set(key, exports);
  runInNewContext(ts.transpileModule(readFileSync(url, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText, {
    exports,
    require: (name) => name === "@dever/front-plugin" ? { getCompatModule: () => ({}) } : load(new URL(`${name}.ts`, url)),
  });
  return exports;
}
const { reduceCanvasPowerStream } = load(new URL("space/space-power-stream.ts", root));

test("queue, generation, upload and recovery remain runtime status", () => {
  let state = { nodeId: "image", title: "图片", startedAt: 1, progress: 0, status: "running" };
  for (const [phase, text, position] of [
    ["queued", "等待执行，前方 2 个任务", 3],
    ["remote_queued", "排队中，前方 1 个任务", 2],
    ["generating", "正在生成第 3/9 张：右侧脸回眸", 0],
    ["uploading", "正在保存图片", 0],
    ["recovering", "结果保存暂未完成，正在恢复", 0],
  ]) {
    state = reduceCanvasPowerStream(state, { event: "status", text, meta: { execution_phase: phase, queue_position: position } });
    assert.equal(state.executionPhase, phase);
    assert.equal(state.queuePosition, position);
    assert.equal(state.statusText, text);
    assert.equal(state.streamText, undefined);
    assert.equal(state.streamOutput, undefined);
  }
});

test("status cannot erase an already generated preview", () => {
  const preview = { images: ["https://example.test/saved.png"] };
  const state = reduceCanvasPowerStream({ nodeId: "image", title: "图片", startedAt: 1, progress: 0, status: "running", streamOutput: preview }, { event: "status", text: "正在保存图片", meta: { execution_phase: "uploading" } });
  assert.equal(state.streamOutput, preview);
  assert.equal(state.statusText, "正在保存图片");
});
