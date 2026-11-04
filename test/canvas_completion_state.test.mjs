import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { runInNewContext } from "node:vm";

const ts = createRequire(new URL("../front/package.json", import.meta.url))("typescript");
const root = new URL("../front/src/nodes/body-work/space/", import.meta.url).pathname;
const modules = new Map();
function load(path) {
  if (modules.has(path)) return modules.get(path);
  const exports = {};
  modules.set(path, exports);
  const output = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  runInNewContext(output, { exports, require(specifier) {
    if (specifier === "@dever/front-plugin") return { getCompatModule: () => ({}) };
    assert.ok(specifier.startsWith("."));
    return load(resolve(dirname(path), `${specifier}.ts`));
  } });
  return exports;
}

function functions(path, names) {
  const source = ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, path.endsWith("tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const selected = new Map();
  function visit(node) {
    if (ts.isFunctionDeclaration(node) && names.includes(node.name?.text)) selected.set(node.name.text, node.getText(source));
    ts.forEachChild(node, visit);
  }
  visit(source);
  assert.equal(selected.size, names.length);
  return [...selected.values()].join("\n");
}

const names = [
  "publishWorkspaceCanvasRuntimeExecutions", "mergeWorkspaceCanvasRunRecords", "mergeCanvasRunRef",
  "compareWorkspaceCanvasRunRecency", "canvasRunRecordTimestamp", "canvasNodeResultApplyKey",
  "canvasRunNodeIds", "canvasRunFinishedNodeIds", "canvasRunStoryboardFrameNodeId", "canvasRunIdentities",
  "applyRecoveredCanvasStreamFrame", "applyCanvasStreamNodeFrame", "canvasStreamNodeOutput",
  "applyCanvasRunRecord", "canvasRunRecordStartNode", "canvasRunCanUpdateNode", "canvasRunOwnsNodeResult",
  "applyBackendCanvasRunResults", "markBackendCanvasNodeResultsDone", "markCanvasNodeResultsDoneState",
  "scheduleCanvasRunningNodeCleanup", "syncBackendCanvasRunRuntime", "syncBackendCanvasFeedbackRecord",
  "markCanvasRunRecordRunningNodes", "finishBackendCanvasRunningNodes", "backendCanvasRunActiveNodeIds",
  "backendCanvasRunNodeIds", "refreshRecoveredStoryboardDerivedGroups",
  "waitForCanvasRun", "normalizeSingleNodeCanvasRun", "setCanvasStreamReconnecting",
  "waitForCanvasRunStream", "isErrorStreamFrame", "canvasRunFromStreamFrame", "waitForCanvasConvergence",
  "canvasNodeHasRecoveredRunResult", "canvasRunAlreadyAppliedToCanvas", "canvasRecoveryRunAlreadyApplied",
  "applyCanvasRunRecordsToCanvas", "canvasRunRecordMatchesCanvas", "canvasRunRecordResultApplyKey",
  "nodeHasResultContent", "nodeHasResultRef", "nodeCanHaveExecutionResult", "nodePreviewKind",
  "buildBackendCanvasNodePatch", "buildGeneratedNodeResultPatch", "completedCanvasNodeRunTiming",
  "completedCanvasNodeResultTiming", "mergeNodeFeedbackRecordsIntoPatch", "generatedNodeSummaryText",
  "isUnknownRecord", "valueAtUnknownPath", "storyboardFrameOverviewGroup",
  "storyboardFrameOverviewResult", "storyboardFrameOverviewResultStatus",
];
const output = ts.transpileModule(functions(resolve(root, "space-page.tsx"), names) + "\n" + functions(resolve(root, "space-model.ts"), ["assetCateById", "assetCateFromList"]) + "\n" + functions(resolve(root, "space-feedback.ts"), ["currentNodeFeedbackRecords"]), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function fixture(status = "running", results = [{ node_key: "first", node_type: "power", status: "success" }], external = {}) {
  const run = { run_id: 10, execution_id: 1, request_id: "first-run", canvas_id: 5, asset_cate_id: 3,
    start_node_id: "group", single_node: true, status, node_results: results,
    target_node_ids: ["first", "second"],
    node_runs: [{ node_key: "first", status: "success" }, { node_key: "second", status: "running" }],
  };
  let state = Object.fromEntries(["first", "second"].map(nodeId => [nodeId, { nodeId, status: "running", startedAt: 1, progress: 72 }]));
  const canvas = { id: 5, assetCateId: 3, nodes: [{ id: "group", type: "group" }, { id: "first", type: "power" }, { id: "second", type: "power" }], edges: [] };
  const watcher = { controller: new AbortController(), managedNodeIds: new Set(["first", "second"]), finishedNodeIds: new Set() };
  const newer = { controller: new AbortController(), managedNodeIds: new Set(["first"]), finishedNodeIds: new Set() };
  const watchers = new Map([["7:first-run", watcher], ["7:newer-run", newer]]);
  const records = { current: [run] };
  const setRunningNode = update => { state = update(state); };
  const timers = [];
  const bindings = {
    exports: {},
    AbortController,
    canvasRunStatusPollIntervalMs: 3000,
    ...load(resolve(root, "space-runner.ts")),
    ...load(resolve(root, "space-run-timing.ts")),
    ...load(resolve(root, "space-node-runtime.ts")),
    ...load(resolve(root, "space-power-stream.ts")),
    ...load(resolve(root, "space-execution-plan.ts")),
    ...load(resolve(root, "space-result.ts")),
    ...load(resolve(root, "space-output-protocol.ts")),
    ...load(resolve(root, "space-assets.ts")),
    ...load(resolve(root, "space-group-runtime.ts")),
    ...load(resolve(root, "../shared/power-presentation.ts")),
    firstNonEmptyText: load(resolve(root, "../shared/content-output.ts")).firstNonEmptyText,
    EMPTY_CANVAS_NODES: [],
    firstDefined: load(resolve(root, "../shared/structured-json.ts")).firstDefinedValue,
    projectId: 7,
    window: { setTimeout: callback => timers.push(callback) },
    canvasRunRecordsRef: records,
    setCanvasRunRecords: value => { records.current = value; },
    recoveredCanvasStreamWatchersRef: { current: watchers },
    canvasRunObservationRef: { current: load(resolve(root, "space-run-observation.ts")).createCanvasRunObservation() },
    canvasConsumerControllerRef: { current: new AbortController() },
    appliedCanvasRunsRef: { current: new Set() },
    canvasRuntimeAccess: () => ({ setRunningNode }),
    updateCanvasNodeResult: () => assert.fail("an already applied image must not be rewritten"),
    upsertSpaceAsset: () => assert.fail("an already applied asset must not be rewritten"),
    requestStartFlowFeedback: () => assert.fail("unexpected feedback request"),
    requestGeneratedNodeTitle: () => assert.fail("unexpected title request"),
    ...external,
  };
  const api = runInNewContext(output + `\n({${names.join(",")}});`, bindings);
  return { api, run, canvas, watcher, newer, records, timers, setRunningNode, state: () => state };
}

test("a completed image clears runtime even when the result was already applied", () => {
  const f = fixture();
  // The canvas already owns the saved version, so there are no content patches.
  f.api.applyCanvasRunRecord(f.run, f.canvas, { assetCates: [{ id: 3 }] }, [], new Set(["first", "second"]));
  assert.equal(f.state().first.status, "success");
  assert.equal(f.state().first.progress, 100);
  assert.equal(f.state().second.status, "running");
});

test("confirmed node completion prevents late recovered progress from reviving its spinner", () => {
  const f = fixture();
  f.api.publishWorkspaceCanvasRuntimeExecutions(7, [f.run], {}, {});
  let updates = 0;
  f.api.applyRecoveredCanvasStreamFrame({ setRunningNode: () => updates++ }, {
    output: { event: "node_started", node_key: "first" },
  }, f.watcher.managedNodeIds, f.watcher.finishedNodeIds);
  assert.equal(updates, 0);
  assert.equal(f.watcher.controller.signal.aborted, false);
  assert.equal(f.newer.controller.signal.aborted, false);
});

test("terminal confirmation immediately stops the matching recovered stream", () => {
  for (const status of ["success", "fail", "canceled"]) {
    const f = fixture(status);
    f.api.publishWorkspaceCanvasRuntimeExecutions(7, [f.run], {}, {});
    assert.equal(f.watcher.controller.signal.aborted, true, status);
    assert.equal(f.newer.controller.signal.aborted, false, status);
  }
});

test("incomplete media previews continue to update while execution is active", () => {
  const f = fixture("running", []);
  f.api.publishWorkspaceCanvasRuntimeExecutions(7, [f.run], {}, {});
  f.api.applyRecoveredCanvasStreamFrame({ setRunningNode: f.setRunningNode }, {
    output: { event: "node_output", node_key: "first", node_type: "power", output: { images: ["https://fixture.invalid/new.png"] } },
  }, f.watcher.managedNodeIds, f.watcher.finishedNodeIds);
  assert.equal(f.state().first.status, "running");
  assert.equal(f.state().first.streamOutput.images[0], "https://fixture.invalid/new.png");
  assert.equal(f.watcher.controller.signal.aborted, false);
});

test("the current page ignores an earlier node start after snapshot-confirmed completion", async () => {
  let stream;
  let receive;
  const f = fixture("running", [], {
    watchSpaceCanvasStream: options => new Promise(resolve => {
      stream = options;
      options.signal.addEventListener("abort", resolve, { once: true });
    }),
  });
  const input = {
    projectId: 7, canvasId: 5, startNode: f.canvas.nodes[0], nodes: f.canvas.nodes,
    setRunningNode: f.setRunningNode,
    subscribeRun: (_id, listener) => { receive = listener; return () => {}; },
  };
  const waiting = f.api.waitForCanvasRun(input, f.run, "0-0", results => {
    f.api.markBackendCanvasNodeResultsDone(input, results);
  }, () => {});
  assert.ok(stream);
  receive({ ...f.run, node_results: [{ node_key: "first", status: "success" }] });
  assert.equal(f.state().first.status, "success");
  stream.onFrame({ output: { event: "node_started", node_key: "first" } });
  const afterReplay = f.state().first.status;
  receive({ ...f.run, status: "success" });
  await waiting;
  assert.equal(afterReplay, "success");
});

test("saved asset pointers recover image content and finish each node in a group", () => {
  let f;
  const restoredAssets = [];
  const results = ["first", "second"].map((node_key, index) => ({
    node_key, node_type: "power", status: "success", run_id: 10,
    asset_id: 40 + index, version_id: 60 + index,
    output: { images: [`https://fixture.invalid/${node_key}.png`] },
  }));
  f = fixture("success", results, {
    updateCanvasNodeResult: (_canvasId, nodeId, patch) => {
      Object.assign(f.canvas.nodes.find(node => node.id === nodeId), patch);
    },
    requestGeneratedNodeTitle: () => {},
    upsertSpaceAsset: asset => restoredAssets.push(asset.id),
  });
  // The group and its children have run references, but the persisted canvas
  // deliberately stores only asset/version pointers rather than media content.
  f.canvas.nodes[0].resultRef = { run_id: 10 };
  for (const [index, node] of f.canvas.nodes.slice(1).entries()) {
    node.kind = "image";
    node.resultRef = { run_id: 10, asset_id: 40 + index, version_id: 60 + index };
    node.asset = { id: 40 + index, version_id: 60 + index, kind: "image" };
    assert.equal(f.api.nodeHasResultContent(node), false);
  }
  assert.equal(f.api.canvasRunAlreadyAppliedToCanvas(f.run, f.canvas), false);
  f.api.applyCanvasRunRecordsToCanvas([f.run], f.canvas, { assets: [], assetCates: [{ id: 3 }] });
  for (const node of f.canvas.nodes.slice(1)) {
    assert.equal(f.api.nodeHasResultContent(node), true);
    assert.equal(node.resultOutput.images[0], `https://fixture.invalid/${node.id}.png`);
    assert.equal(f.state()[node.id].status, "success");
  }
  assert.equal(f.api.canvasRunAlreadyAppliedToCanvas(f.run, f.canvas), true);
  assert.deepEqual(restoredAssets, [40, 41]);
});

test("content recovery preserves a selected version and a newer in-flight run", () => {
  const f = fixture("success");
  const result = { node_key: "first", status: "success", asset_id: 40, version_id: 60 };
  const node = { id: "first", type: "power", kind: "image",
    resultRef: { run_id: 10 }, asset: { id: 40, version_id: 61 } };
  assert.equal(f.api.canvasNodeHasRecoveredRunResult(node, f.run, result), true);
  node.asset.version_id = 60;
  node.resultRef.run_id = 11;
  assert.equal(f.api.canvasNodeHasRecoveredRunResult(node, f.run, result), true);
  node.resultRef.run_id = 10;
  assert.equal(f.api.canvasNodeHasRecoveredRunResult(node, f.run, result), false);
  node.resultOutput = { images: ["https://fixture.invalid/first.png"] };
  assert.equal(f.api.canvasNodeHasRecoveredRunResult(node, f.run, result), true);
});

test("another group running in a storyboard does not block a ready group", () => {
  const f = fixture("running");
  let submitted = 0;
  const node = { id: "ready-group", type: "group", title: "镜头视频组" };
  const member = { id: "ready-video", type: "power", power: { id: 3, kind: "video" } };
  const input = {
    executionNode: node, members: [member],
    runBlockedReasonByNodeId: new Map(),
    runningNodes: { other: { status: "running" }, "storyboard-frame:script": { status: "running" } },
    activeRunByStartNodeId: new Map(), stoppingCanvasRunKeys: new Set(),
    hasResult: () => false, onRun: () => submitted++, onStopRun() {}, onOpenNode() {},
    projectNode: node => node, reuse: (_type, _id, _dependencies, compute) => compute(),
    projectionDependencies: () => [],
  };
  const ready = f.api.storyboardFrameOverviewGroup(input);
  assert.equal(ready.runBlockedReason, "");
  ready.onRun();
  assert.equal(submitted, 1);
  input.runBlockedReasonByNodeId.set(node.id, "请先生成前置素材“首帧”");
  const missingInput = f.api.storyboardFrameOverviewGroup(input);
  assert.equal(missingInput.onRun, undefined);
  input.runBlockedReasonByNodeId.clear();
  input.runningNodes[member.id] = { status: "running" };
  assert.equal(f.api.storyboardFrameOverviewGroup(input).onRun, undefined);
});
