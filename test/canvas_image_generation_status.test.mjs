import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { runInNewContext } from "node:vm";

const frontRequire = createRequire(
  new URL("../front/package.json", import.meta.url),
);
const ts = frontRequire("typescript");
const space = new URL("../front/src/nodes/body-work/space/", import.meta.url)
  .pathname;
const modules = new Map();

// 运行真实状态与媒体解析代码，隔离宿主 UI，不调用网络或生成任务。
function sourceModule(path) {
  if (modules.has(path)) return modules.get(path);
  const exports = {};
  modules.set(path, exports);
  const compiled = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
    },
  }).outputText;
  runInNewContext(compiled, {
    exports,
    require(specifier) {
      if (specifier === "@dever/front-plugin")
        return { getCompatModule: () => ({}) };
      assert.ok(
        specifier.startsWith("."),
        `unexpected dependency: ${specifier}`,
      );
      return sourceModule(resolve(dirname(path), `${specifier}.ts`));
    },
  });
  return exports;
}

const { reduceCanvasPowerStream } = sourceModule(
  resolve(space, "space-power-stream.ts"),
);
const timing = sourceModule(resolve(space, "space-run-timing.ts"));
const runtime = sourceModule(resolve(space, "space-node-runtime.ts"));
const { contentOutputHasMedia } = sourceModule(
  resolve(space, "../shared/content-output.ts"),
);
const plain = (value) => JSON.parse(JSON.stringify(value));
const initial = () => ({
  nodeId: "image",
  title: "图片",
  startedAt: 100,
  status: "running",
  progress: 18,
});
const status = (text, meta) => ({
  event: "status",
  text,
  ...(meta ? { meta } : {}),
});

function pageStreamReducer() {
  const path = resolve(space, "space-page.tsx");
  const source = ts.createSourceFile(
    path,
    readFileSync(path, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const names = [
    "applyCanvasStreamNodeFrame",
    "canvasStreamNodeOutput",
    "markCanvasRunRecordRunningNodes",
  ];
  const selected = source.statements.filter(
    (statement) =>
      ts.isFunctionDeclaration(statement) &&
      names.includes(statement.name?.text),
  );
  assert.equal(selected.length, names.length);
  const compiled = ts.transpileModule(
    selected.map((statement) => statement.getText(source)).join("\n"),
    {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
      },
    },
  ).outputText;
  let optimisticUpdate;
  function visit(statement) {
    if (
      ts.isArrowFunction(statement) &&
      ts.isBlock(statement.body) &&
      statement.body.statements.some(
        (child) =>
          ts.isForOfStatement(child) &&
          child.expression.getText(source) === "optimisticNodes",
      )
    ) {
      optimisticUpdate = statement.getText(source);
    }
    ts.forEachChild(statement, visit);
  }
  visit(source);
  assert.ok(optimisticUpdate);
  const optimisticCompiled = ts.transpileModule(
    `const optimisticBegin = ${optimisticUpdate};`,
    {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
      },
    },
  ).outputText;
  return runInNewContext(
    `${compiled}\n${optimisticCompiled}\n({ applyCanvasStreamNodeFrame, markCanvasRunRecordRunningNodes, optimisticBegin });`,
    {
      ...timing,
      ...runtime,
      reduceCanvasPowerStream,
      optimisticNodes: [{ id: "image", title: "图片" }],
      targetNode: { id: "image" },
      options: undefined,
      canvasRunFinishedNodeIds: () => new Set(),
      canvasRunStoryboardFrameNodeId: () => "",
      reduceCanvasAgentRuntime: (_previous, output) => ({ text: output.text }),
      firstDefined: (...values) => values.find((value) => value != null),
    },
  );
}
const pageRuntime = pageStreamReducer();
const applyFrame = pageRuntime.applyCanvasStreamNodeFrame;
function apply(output, nodeType = "power", previous = initial()) {
  let nodes = { image: previous };
  applyFrame(
    {
      setRunningNode: (update) => {
        nodes = update(nodes);
      },
    },
    {
      output: {
        event: "node_output",
        node_key: "image",
        node_type: nodeType,
        output,
      },
    },
  );
  return nodes.image;
}

test("plain planning status remains visible without becoming generated content", () => {
  for (const output of [
    status("正在规划图片"),
    status("正在规划图片", {
      output_type: "general",
      generation_stage: "planning",
    }),
  ]) {
    const next = apply(output);
    assert.equal(next.statusText, "正在规划图片");
    assert.equal(next.streamText, undefined);
    assert.equal(next.streamOutput, undefined);
  }
});

test("planning switches to generation with status text and counts", () => {
  const planning = apply(
    status("正在规划图片", {
      output_type: "general",
      target_count: 6,
      generated_count: 0,
    }),
  );
  const generating = apply(
    status("正在生成第 1/6 张图片", {
      output_type: "general",
      target_count: 6,
      generated_count: 0,
    }),
    "power",
    planning,
  );
  assert.equal(generating.statusText, "正在生成第 1/6 张图片");
  assert.equal(generating.targetCount, 6);
  assert.equal(generating.streamText, undefined);
});

test("media increments display while later status retains the media and completed count", () => {
  const media = {
    event: "image_ready",
    images: ["https://fixture.invalid/frame-1.png"],
  };
  assert.equal(contentOutputHasMedia(media), true);
  const first = apply(media);
  assert.equal(first.streamOutput, media);
  const next = apply(
    status("正在生成第 2/6 张图片", {
      target_count: 6,
      generated_count: 1,
    }),
    "power",
    first,
  );
  assert.equal(next.streamOutput, media);
  assert.equal(next.generatedCount, 1);
  assert.equal(next.streamText, undefined);
});

test("image status snapshots keep progress out of content for one and multiple images", () => {
  let previous = initial();
  const images = [];
  for (let count = 1; count <= 2; count++) {
    images.push(`https://fixture.invalid/frame-${count}.png`);
    const text = `正在生成第 ${count + 1}/3 张：画面 ${count + 1}`;
    const output = {
      event: "status",
      text,
      image: images[0],
      images: [...images],
      meta: {
        output_type: "general",
        generation_stage: "generating",
        target_count: 3,
        generated_count: count,
        items: [{ title: "图片说明", image: images[0] }],
      },
    };
    const next = apply(output, "power", previous);
    const { text: _statusText, ...content } = output;
    assert.deepEqual(plain(next.streamOutput), content);
    assert.equal(contentOutputHasMedia(next.streamOutput), true);
    assert.equal(next.statusText, text);
    assert.equal(next.generatedCount, count);
    assert.equal(next.targetCount, 3);
    assert.equal(next.streamText, undefined);
    assert.equal(output.text, text);
    previous = next;
  }
  const result = {
    event: "final",
    images: [...images],
    text: "已生成 2/3 张图片，其余图片生成失败。",
  };
  assert.equal(apply(result, "power", previous).streamOutput, result);
});

test("semantic status strips only progress text and preserves structured content", () => {
  const output = {
    event: "node_output",
    semantic_event: "status",
    text: "正在整理分镜",
    json: { shots: [{ id: "shot-1", text: "实际镜头内容" }] },
    meta: { output_type: "storyboard" },
  };
  const next = apply(output);
  assert.equal(next.streamOutput.text, undefined);
  assert.equal(next.streamOutput.json, output.json);
  assert.equal(next.streamOutput.meta, output.meta);
  assert.equal(next.statusText, output.text);
  const media = {
    event: "image_ready",
    text: "实际图片说明",
    images: ["https://fixture.invalid/frame-1.png"],
  };
  assert.equal(apply(media).streamOutput, media);
});

test("unannotated status does not promote an empty skeleton to content", () => {
  const next = reduceCanvasPowerStream(initial(), status("正在规划图片"));
  assert.equal(
    Boolean(next.streamStarted && (next.streamText || next.streamOutput)),
    false,
  );
});

test("invalid or absent counts cannot erase known target or regress completed count", () => {
  const previous = { ...initial(), targetCount: 6, generatedCount: 2 };
  for (const meta of [
    {},
    { target_count: 0, generated_count: 1 },
    { target_count: "NaN", generated_count: -1 },
    { target_count: 2.5, generated_count: 3.5 },
  ]) {
    const next = reduceCanvasPowerStream(previous, status("正在生成", meta));
    assert.equal(next.targetCount, 6);
    assert.equal(next.generatedCount, 2);
  }
});

test("text deltas append normally and intervening status is never appended", () => {
  const first = apply({ event: "delta", text: "正文" });
  const waiting = apply(status("正在处理"), "power", first);
  const next = apply({ event: "delta", text: "继续" }, "power", waiting);
  assert.equal(next.streamText, "正文继续");
  assert.equal(next.streamStarted, true);
});

test("structured previews and audio_ready retain their original presentation", () => {
  for (const output of [
    {
      event: "status",
      json: { shots: [{ id: "shot-1" }] },
      meta: { output_type: "storyboard", target_count: 3 },
    },
    {
      event: "status",
      meta: {
        output_type: "storyboard",
        storyboard_preview: { shots: [{ id: "shot-1" }] },
      },
    },
    { event: "audio_ready", audio: "https://fixture.invalid/audio.mp3" },
  ]) {
    const next = apply(output);
    assert.equal(next.streamOutput, output);
    assert.equal(next.streamStarted, true);
  }
});

test("agent and non-power stream paths retain timing and their own runtime", () => {
  const output = {
    event: "delta",
    text: "agent content",
    meta: { estimated_duration_ms: 3500 },
  };
  const agent = apply(output, "agent");
  assert.equal(agent.agent.text, "agent content");
  assert.equal(agent.estimatedDurationMs, 3500);
  assert.equal(agent.streamText, undefined);
  const other = apply(output, "function");
  assert.equal(other.streamText, undefined);
  assert.equal(other.estimatedDurationMs, 3500);
});

test("stopped nodes ignore late stream frames", () => {
  const previous = { ...initial(), status: "success" };
  assert.equal(apply(status("late status"), "power", previous), previous);
});

function previousGeneration(status) {
  return {
    ...initial(),
    status,
    statusText: "正在生成第 6/6 张",
    generatedCount: 5,
    targetCount: 6,
  };
}
function assertGenerationCleared(next) {
  for (const key of [
    "statusText",
    "generatedCount",
    "targetCount",
  ])
    assert.equal(next[key], undefined, key);
}

test("optimistic rerun immediately clears previous completed or failed generation metadata", () => {
  for (const status of ["success", "error"]) {
    const next = pageRuntime.optimisticBegin({
      image: previousGeneration(status),
    }).image;
    assert.equal(next.status, "running");
    assertGenerationCleared(next);
  }
});

test("node_started clears terminal metadata and preserves same-run active metadata", () => {
  for (const status of ["success", "error", "running", "waiting"]) {
    const previous = previousGeneration(status);
    let nodes = { image: previous };
    applyFrame(
      {
        setRunningNode: (update) => {
          nodes = update(nodes);
        },
      },
      {
        output: { event: "node_started", node_key: "image", node_name: "图片" },
      },
    );
    assert.equal(nodes.image.status, "running");
    if (status === "success" || status === "error")
      assertGenerationCleared(nodes.image);
    else {
      assert.equal(nodes.image.statusText, previous.statusText);
      assert.equal(nodes.image.generatedCount, 5);
    }
  }
});

test("recovery resets terminal metadata when restoring active execution without clearing active status", () => {
  for (const status of ["success", "error", "running", "waiting"]) {
    const previous = previousGeneration(status);
    let nodes = { image: previous };
    pageRuntime.markCanvasRunRecordRunningNodes(
      {
        nodes: [{ id: "image", title: "图片" }],
        setRunningNode: (update) => {
          nodes = update(nodes);
        },
      },
      {
        status: "running",
        created_at: 100,
        node_runs: [{ node_key: "image", status: "running" }],
      },
    );
    assert.equal(nodes.image.status, "running");
    if (status === "success" || status === "error")
      assertGenerationCleared(nodes.image);
    else assert.equal(nodes.image.statusText, previous.statusText);
  }
});
