import { loader, ts } from "./writing_test_loader.mjs";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { runInNewContext } from "node:vm";

import { completeOutline, emptyPreferences } from "./writing_fixture.mjs";

const sourceRoot = new URL("../front/src/nodes/body-work/", import.meta.url)
  .pathname;
const loadSource = loader();
const writing = loadSource(
  path.join(sourceRoot, "writing/writing-document.ts"),
);
const pageSource = ts.createSourceFile(
  "space-page.tsx",
  readFileSync(path.join(sourceRoot, "space/space-page.tsx"), "utf8"),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
function declaration(name, source = pageSource) {
  let found;
  function visit(node) {
    if (
      (ts.isVariableDeclaration(node) || ts.isFunctionDeclaration(node)) &&
      node.name?.getText(source) === name
    )
      found = node;
    ts.forEachChild(node, visit);
  }
  visit(source);
  assert.ok(found, `Missing source declaration ${name}`);
  return found;
}
const callback = declaration(
  "runBackendSingleNode",
).initializer.arguments[0].getText(pageSource);
const merge = declaration("mergeBackendSingleNodeDraft").getText(pageSource);
const executable = ts.transpileModule(
  `${merge}\nexports.runner = ${callback};`,
  {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
    },
  },
).outputText;
function document() {
  return {
    type: "story",
    schema_version: 1,
    preferences: emptyPreferences(),
    title: "故事",
    inspirations: [1, 2, 3].map((number) => ({
      id: `idea-${number}`,
      title: `方向${number}`,
      content: `内容${number}`,
    })),
    selected_inspiration_id: "",
    outline: completeOutline(""),
    units: [],
    archived_units: [],
    status: "ready",
    active_run_id: 0,
    active_request_id: "",
  };
}
function fixture(submit) {
  const snapshot = {
    work_asset_id: 11,
    work_version_id: 21,
    work_revision: 4,
    run_id: 8,
    request_id: "old",
    status: "ready",
    document: document(),
  };
  const savedNode = {
    id: "story",
    type: "power",
    outputType: "story",
    resultOutput: snapshot,
    resultRef: { asset_id: 11, version_id: 21 },
    asset: {
      id: 11,
      version_id: 21,
      version: {
        id: 21,
        version: 2,
        content: { json: snapshot.document, writing_revision: 4 },
      },
    },
    composerDraft: {
      prompt: "旧输入",
      paramValues: { custom_prompt: "旧参数" },
    },
  };
  const canvas = { id: 31, nodes: [savedNode], edges: [] };
  const submitted = {
    ...savedNode,
    resultOutput: { ...snapshot, work_revision: 1 },
    composerDraft: {
      prompt: "最新输入",
      paramValues: { custom_prompt: "最新输入" },
    },
  };
  const commands = [],
    patches = [],
    opened = [],
    ordinary = [];
  const context = {
    exports: {},
    space: {},
    activeCate: {},
    activeCanvas: canvas,
    canvasStatesRef: { current: { 31: canvas } },
    projectId: 7,
    workMode: "create",
    writingComposerSubmissionsRef: { current: new Set() },
    runningNodesRef: { current: {} },
    ...writing,
    // 使用已由composer保存的草稿；只隔离归一化边界，不复制执行分流。
    readNodeComposerDraft: (node) => node.composerDraft,
    isActiveRunningNode: (node) =>
      ["running", "waiting"].includes(node?.status),
    showNodeDetail: (node) => opened.push(node),
    submitWritingCommand: async (command) => {
      commands.push(command);
      return submit
        ? submit(command)
        : {
            ...snapshot,
            run_id: 9,
            request_id: "new",
            document: {
              ...snapshot.document,
              status: "running",
              active_run_id: 9,
              active_request_id: "new",
            },
          };
    },
    updateCanvasNodeResult: (canvasId, nodeId, patch) => {
      patches.push({ canvasId, nodeId, patch });
      canvas.nodes = canvas.nodes.map((node) =>
        node.id === nodeId ? { ...node, ...patch } : node,
      );
    },
    canvasExecutionOptimisticNodeIds: (id) => [id],
    clearCanvasExecutionNodeErrors: (nodes) => nodes,
    buildNodeInputContext: () => null,
    createCanvasRunInput: (input) => input,
    updateNodeResult() {},
    runCanvasFromStartNode: async (input) => ordinary.push(input),
    persistCanvasRunSnapshot: async () => {},
    releaseLocallyManagedCanvasRun() {},
    recoverCanvasRunExecution: async () => {},
    rememberCanvasRunRecord() {},
  };
  runInNewContext(executable, context);
  return {
    context,
    snapshot,
    savedNode,
    submitted,
    canvas,
    commands,
    patches,
    opened,
    ordinary,
    run: context.exports.runner,
  };
}

test("inspiration composer sends latest input with current saved baseline, stays on canvas and starts existing snapshot lifecycle", async () => {
  const state = fixture();
  await state.run(state.submitted);
  assert.deepEqual(
    { ...state.commands[0] },
    {
      project_id: 7,
      canvas_id: 31,
      work_asset_id: 11,
      expected_work_version_id: 21,
      expected_work_revision: 4,
      action: "generate_inspirations",
      instruction: "最新输入",
    },
  );
  assert.equal(state.commands.length, 1);
  assert.equal(state.opened.length, 0);
  assert.equal(state.ordinary.length, 0);
  assert.equal(state.patches[0].canvasId, 31);
  const current = writing.writingSnapshotFromNode(
    state.canvas.nodes[0],
    state.canvas.nodes[0].resultOutput,
  );
  assert.equal(current.run_id, 9);
  assert.equal(current.document.status, "running");
  assert.equal(current.work_version_id, 21);
  assert.equal(current.document.inspirations.length, 3);
  assert.equal(state.canvas.nodes[0].composerDraft.prompt, "旧输入");
});

test("same canvas and story guard duplicate sends synchronously and release after accepted command", async () => {
  let finish;
  const state = fixture(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const first = state.run(state.submitted);
  await assert.rejects(state.run(state.submitted), /正在生成/);
  assert.equal(state.commands.length, 1);
  finish(state.snapshot);
  await first;
  assert.equal(state.context.writingComposerSubmissionsRef.current.size, 0);
});

test("an accepted response updates the captured canvas after the user switches canvas", async () => {
  let finish;
  const state = fixture(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const pending = state.run(state.submitted);
  state.context.activeCanvas = { id: 32, nodes: [], edges: [] };
  state.context.canvasStatesRef.current[32] = state.context.activeCanvas;
  finish(state.snapshot);
  await pending;
  assert.equal(state.patches.length, 1);
  assert.equal(state.patches[0].canvasId, 31);
  assert.equal(state.patches[0].nodeId, "story");
  assert.equal(state.context.canvasStatesRef.current[32].nodes.length, 0);
  assert.equal(state.context.writingComposerSubmissionsRef.current.size, 0);
});

test("the actual settings expression blocks current writing runs while preserving ordinary-node behavior", () => {
  const settings = ts.createSourceFile(
    "space-node-settings.tsx",
    readFileSync(
      path.join(sourceRoot, "space/space-node-settings.tsx"),
      "utf8",
    ),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const expression = declaration("nodeRunning", settings).initializer.getText(
    settings,
  );
  const state = fixture();
  const presentation = loadSource(
    path.join(sourceRoot, "shared/power-presentation.ts"),
  );
  const evaluate = (node, running = false, runningNode) =>
    runInNewContext(expression, {
      node,
      running,
      runningNode,
      ...writing,
      ...presentation,
      isActiveRunningNode: state.context.isActiveRunningNode,
    });
  assert.equal(Boolean(evaluate(state.savedNode)), false);
  const current = {
    ...state.snapshot,
    work_revision: 5,
    document: { ...state.snapshot.document, status: "running" },
  };
  const active = { ...state.savedNode, resultOutput: current };
  assert.equal(Boolean(evaluate(active)), true);
  assert.equal(Boolean(evaluate({ ...active, outputType: "image" })), false);
  assert.equal(Boolean(evaluate(state.savedNode, true)), true);
  assert.equal(
    Boolean(evaluate(state.savedNode, false, { status: "waiting" })),
    true,
  );
  const latestSaved = {
    ...state.savedNode,
    asset: {
      ...state.savedNode.asset,
      version: {
        ...state.savedNode.asset.version,
        content: { json: state.snapshot.document, writing_revision: 6 },
      },
    },
    resultOutput: current,
  };
  assert.equal(Boolean(evaluate(latestSaved)), false);
});

test("failure retains current candidates and latest submitted draft and permits explicit retry", async () => {
  let attempts = 0;
  const state = fixture(() => {
    if (++attempts === 1) throw new Error("请求失败");
    return state.snapshot;
  });
  await assert.rejects(state.run(state.submitted), /请求失败/);
  assert.equal(state.patches.length, 0);
  assert.equal(state.savedNode.resultOutput, state.snapshot);
  assert.equal(state.submitted.composerDraft.prompt, "最新输入");
  assert.equal(state.context.writingComposerSubmissionsRef.current.size, 0);
  await state.run(state.submitted);
  assert.equal(state.commands.length, 2);
  assert.equal(state.opened.length, 0);
});

test("read-only, running writing and active canvas node reject without generating or opening detail", async () => {
  for (const mode of ["readonly", "writingRun", "canvasRun"]) {
    const state = fixture();
    if (mode === "readonly") state.context.workMode = "result";
    if (mode === "writingRun") state.snapshot.document.status = "running";
    if (mode === "canvasRun")
      state.context.runningNodesRef.current.story = { status: "waiting" };
    await assert.rejects(state.run(state.submitted), /只读|正在生成/);
    assert.equal(state.commands.length, 0);
    assert.equal(state.opened.length, 0);
  }
});

test("known writing identity without a loaded snapshot never falls through to initial creation", async () => {
  const state = fixture();
  state.savedNode.resultOutput = undefined;
  state.savedNode.asset.version.content = undefined;
  state.savedNode.power = { outputType: "story" };
  await assert.rejects(state.run(state.submitted), /加载完成/);
  assert.equal(state.commands.length, 0);
  assert.equal(state.ordinary.length, 0);
  assert.equal(state.opened.length, 0);
});

test("selected story still opens workspace while initial and ordinary nodes retain canvas execution", async () => {
  const selected = fixture();
  selected.snapshot.document.selected_inspiration_id = "idea-1";
  await selected.run(selected.submitted);
  assert.equal(selected.opened.length, 1);
  assert.equal(selected.commands.length, 0);
  for (const outputType of ["story", "image"]) {
    const state = fixture();
    Object.assign(state.savedNode, {
      resultOutput: undefined,
      resultRef: undefined,
      asset: undefined,
      outputType,
    });
    await state.run(state.submitted);
    assert.equal(state.ordinary.length, 1);
    assert.equal(state.commands.length, 0);
    assert.equal(state.opened.length, 0);
  }
});
