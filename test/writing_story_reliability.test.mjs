import assert from "node:assert/strict";
import { webcrypto } from "node:crypto";
import path from "node:path";
import test from "node:test";
import { loader, testReact } from "./writing_test_loader.mjs";
import { storyDocument } from "../../../../test/story-writing-fixture.mjs";

const root = new URL("../front/src/nodes/body-work/writing/", import.meta.url)
  .pathname;
const source = (name) => path.join(root, name);
const load = loader({ __globals: { crypto: webcrypto, Error } });
const plain = (value) => JSON.parse(JSON.stringify(value));
function story() {
 return { ...storyDocument(0), status: "running", active_run_id: 12, active_request_id: "story-run" };
}
function children(element) {
  if (!element || typeof element !== "object") return [];
  const nested = [element.props?.children].flat(Infinity).filter(Boolean);
  return [element, ...nested.flatMap(children)];
}
const find = (tree, predicate) => children(tree).find(predicate);

// 执行实际组件/Hook，只替换 React 存储；effect 具有真实依赖和卸载语义。
function reactHarness() {
  let current;
  const hook = (init) => {
    const slot = current.cursor++;
    return (current.slots[slot] ||= init());
  };
  const changed = (old, next) =>
    !old || !next || next.some((value, index) => !Object.is(value, old[index]));
  const react = {
    ...testReact,
    useState(initial) {
      const state = hook(() => ({
        value: typeof initial === "function" ? initial() : initial,
      }));
      return [
        state.value,
        (value) => {
          state.value =
            typeof value === "function" ? value(state.value) : value;
        },
      ];
    },
    useRef(initial) {
      return hook(() => ({ current: initial }));
    },
    useMemo(compute, dependencies) {
      const state = hook(() => ({}));
      if (changed(state.dependencies, dependencies)) {
        state.value = compute();
        state.dependencies = dependencies;
      }
      return state.value;
    },
    useCallback(callback, dependencies) {
      return react.useMemo(() => callback, dependencies);
    },
    useEffect(effect, dependencies) {
      const owner = current;
      const state = hook(() => ({}));
      if (changed(state.dependencies, dependencies)) {
        owner.effects.push(() => {
          state.cleanup?.();
          state.cleanup = effect();
        });
        state.dependencies = dependencies;
      }
    },
    useId: () => "field-error",
    forwardRef: (component) => component,
    useImperativeHandle() {},
    memo: (component) => component,
  };
  return {
    react,
    renderer(component) {
      const owner = { slots: [], effects: [], cursor: 0 };
      return {
        render(props) {
          current = owner;
          owner.cursor = 0;
          const result = component(props);
          for (const effect of owner.effects.splice(0)) effect();
          return result;
        },
        unmount() {
          for (const state of owner.slots) state.cleanup?.();
        },
      };
    },
  };
}

test("流式只复制被写入分支；五千章的偏好和正文更新复用目录身份", () => {
  const { projectWritingPreview } = load(
    source("writing-stream-projection.ts"),
  );
  const document = story();
  document.units = Array.from({ length: 5000 }, (_, index) => ({
    id: String(index),
    unit_type: "chapter",
    title: "章",
    plan: "章纲",
    children: [],
  }));
  const base = JSON.stringify(document);
  const prefix = (fields) =>
    projectWritingPreview(document, { fields, values: {} });
  for (const fields of [
    { "preferences.genre": "悬疑" },
    { body: "正文继续" },
    { "outline.world": "新的背景" },
  ]) {
    const result = prefix(fields);
    assert.equal(result.units, document.units);
    assert.equal(result.outline.characters, document.outline.characters);
    assert.equal(result.inspirations, document.inspirations);
  }
  const result = prefix({ "units.4.plan": "新章纲" });
  assert.notEqual(result.units, document.units);
  assert.equal(result.units[3], document.units[3]);
  assert.equal(result.units[4].plan, "新章纲");
  assert.equal(JSON.stringify(document), base);

});

const flush = async () => {
  for (let index = 0; index < 10; index++) await Promise.resolve();
};
function fakeClock() {
  const timers = new Map();
  let next = 0,
    now = 0;
  return {
    setTimeout(callback, delay) {
      const id = ++next;
      timers.set(id, { callback, time: now + delay });
      return id;
    },
    clearTimeout(id) {
      timers.delete(id);
    },
    async tick(ms) {
      now += ms;
      for (const [id, entry] of [...timers])
        if (entry.time <= now) {
          timers.delete(id);
          entry.callback();
        }
      await flush();
    },
    get size() {
      return timers.size;
    },
  };
}
function runEnvironment({ status, readEvents }) {
  const clock = fakeClock();
  const globals = {
    crypto: webcrypto,
    URL,
    AbortController,
    DOMException,
    Error,
    TypeError,
    setTimeout: clock.setTimeout,
    clearTimeout: clock.clearTimeout,
    window: { location: { origin: "https://fixture.invalid" } },
  };
  const runtime = loader({
    __globals: globals,
    "@/lib/request": {
      requestRaw() {
        throw Error("must not submit");
      },
    },
    "@/lib/run-events": { RUN_EVENT: {} },
    "@/lib/runtime-stream-output": {
      normalizeRuntimeFrameOutput: (value) => value,
    },
    "@/lib/stream": {
      assertRuntimeStreamFrameSuccess() {},
      streamValueText: (value) => String(value || ""),
      readRuntimeStreamEvents: readEvents,
      readRuntimeStreamFrame() {
        throw Error("must not fall back to polling transport");
      },
    },
  })(
    new URL(
      "../../../../front/src/lib/runtime-stream-runner.ts",
      import.meta.url,
    ).pathname,
  );
  const teamLoad = loader({
    __globals: globals,
    "@/lib/runtime-stream-runner": runtime,
  });
  const team = {
    ...teamLoad(path.resolve(root, "../../../runtime/team-run/controller.ts")),
    ...teamLoad(path.resolve(root, "../../../runtime/team-run/normalize.ts")),
  };
  const harness = reactHarness();
  const environment = loader({
    react: harness.react,
    __globals: globals,
    "../../../runtime/team-run": team,
    "@dever/front-plugin": { joinSiteApi: (value) => `/api/${value}` },
    "@/lib/runtime-stream-runner": runtime,
    "../space/space-api": { fetchSpaceRunStatus: status },
  });
  return {
    clock,
    harness,
    environment,
    observer: environment(source("writing-run-observer.ts")),
    runHook: environment(source("use-writing-run.ts")).useWritingRun,
  };
}
const identity = {
  projectId: 1,
  workAssetId: 20,
  runId: 12,
  requestId: "story-run",
  running: true,
};
const statusRun = (status = "running", extra = {}) => ({
  run: { id: 12, request_id: "story-run", status, error: "", ...extra },
});
function waitingForAbort(signal) {
  return new Promise((resolve) =>
    signal.addEventListener("abort", resolve, { once: true }),
  );
}

test("卡片和详情共享实际 SDK 恢复同一游标；退订一个继续，末个退订取消流和计时器", async () => {
  let reads = 0,
    statuses = 0;
  const cursors = [],
    received = [[], []];
  let activeSignal;
  const env = runEnvironment({
    status: async () => {
      statuses++;
      return statusRun();
    },
    readEvents: async (_api, request, cursor, _block, consume, signal) => {
      reads++;
      cursors.push([request, cursor]);
      activeSignal = signal;
      if (reads === 1) {
        consume({ stream_id: "11-0", type: "progress" });
        throw new TypeError("Failed to fetch");
      }
      consume({ stream_id: "12-0", type: "progress" });
      await waitingForAbort(signal);
    },
  });
  const listener = (index) => ({
    onFrame: (frame) => received[index].push(frame.stream_id),
    onStatus() {},
    onEnd() {},
    onError(error) {
      throw error;
    },
  });
  const stopCard = env.observer.observeWritingRun(identity, listener(0));
  const stopDetail = env.observer.observeWritingRun(identity, listener(1));
  await flush();
  assert.equal(reads, 1);
  assert.equal(statuses, 1);
  await env.clock.tick(1000);
  assert.deepEqual(cursors, [
    ["story-run", "0-0"],
    ["story-run", "11-0"],
  ]);
  assert.deepEqual(received[1], ["11-0", "12-0"]);
  stopCard();
  assert.equal(activeSignal.aborted, false);
  await env.clock.tick(15_000);
  assert.equal(statuses, 2);
  stopDetail();
  assert.equal(activeSignal.aborted, true);
  assert.equal(env.clock.size, 0);
  await env.clock.tick(60_000);
  assert.equal(statuses, 2);
  assert.equal(reads, 2);
});

test("实际 Hook 在断网且丢失 result 时依据原 Run 终态恢复正文及错误，不重新发起生成", async () => {
  const document = story();
  let current = {
    work_asset_id: 20,
    work_version_id: 30,
    work_revision: 1,
    run_id: 12,
    request_id: "story-run",
    document,
  };
  let statuses = 0,
    loads = 0,
    readCalls = 0;
  const errors = [];
  const completed = {
    ...current,
    work_revision: 2,
    document: { ...document, status: "failed" },
  };
  const env = runEnvironment({
    status: async () => {
      statuses++;
      return statuses === 1
        ? statusRun("running", { started_at: "2026-10-19T10:00:00Z" })
        : statusRun("fail", {
            started_at: "2026-10-19T10:00:00Z",
            finished_at: "2026-10-19T10:01:00Z",
            error: "同一任务失败",
            output: { writing: completed },
          });
    },
    readEvents: async (_api, _request, _cursor, _block, _consume, signal) => {
      readCalls++;
      if (readCalls === 1) throw new TypeError("Failed to fetch");
      await waitingForAbort(signal);
    },
  });
  const ref = { current };
  const props = {
    projectId: 1,
    snapshot: current,
    snapshotRef: ref,
    workAssetIdRef: { current: 20 },
    scopeRef: { current: "work" },
    scope: "work",
    mounted: { current: true },
    acceptSnapshot(value) {
      ref.current = value;
      current = value;
      return value;
    },
    async loadWork() {
      loads++;
      ref.current = completed;
      current = completed;
    },
    reportError: (cause) => errors.push(cause),
  };
  const renderer = env.harness.renderer(env.runHook);
  let result = renderer.render(props);
  await flush();
  await env.clock.tick(1000);
  await env.clock.tick(15_000);
  result = renderer.render({ ...props, snapshot: current });
  assert.equal(statuses, 2);
  assert.equal(loads, 1);
  assert.equal(readCalls, 2);
  assert.equal(ref.current.document.status, "failed");
  assert.equal(result.generationError, "同一任务失败");
  assert.equal(result.generationTiming.source, "server");
  assert.equal(
    result.generationTiming.finishedAt - result.generationTiming.startedAt,
    60_000,
  );
  assert.deepEqual(errors, []);
  assert.equal(env.clock.size, 0);
  renderer.unmount();
});

test("401/403 不重连/不轮询；状态核对在慢请求时不重叠且卸载后不再通知", async () => {
  for (const code of [401, 403]) {
    let statuses = 0,
      streams = 0,
      errors = 0;
    const env = runEnvironment({
      status: async () => {
        statuses++;
        throw Object.assign(new Error("denied"), { code });
      },
      readEvents: async (_a, _r, _c, _b, _f, signal) => {
        streams++;
        await waitingForAbort(signal);
      },
    });
    const stop = env.observer.observeWritingRun(identity, {
      onFrame() {},
      onStatus() {},
      onEnd() {},
      onError() {
        errors++;
      },
    });
    await flush();
    await env.clock.tick(60_000);
    assert.equal(statuses, 1);
    assert.equal(streams, 1);
    assert.equal(errors, 1);
    assert.equal(env.clock.size, 0);
    stop();
  }
  let resolve,
    statuses = 0,
    notifications = 0;
  const env = runEnvironment({
    status: () => {
      statuses++;
      return new Promise((done) => {
        resolve = done;
      });
    },
    readEvents: async (_a, _r, _c, _b, _f, signal) => waitingForAbort(signal),
  });
  const stop = env.observer.observeWritingRun(identity, {
    onFrame() {},
    onStatus() {
      notifications++;
    },
    onEnd() {},
    onError() {},
  });
  await env.clock.tick(60_000);
  assert.equal(statuses, 1);
  stop();
  resolve(statusRun("success"));
  await flush();
  assert.equal(notifications, 0);
  assert.equal(env.clock.size, 0);
});

test("状态失败边界保留鉴权 code 且不改变成功值和原错误文案", () => {
  const { successfulResponseValue } = load(
    path.resolve(root, "../shared/api-response.ts"),
  );
  assert.deepEqual(
    plain(successfulResponseValue({ code: 0, data: { id: 1 } }, "fallback")),
    { id: 1 },
  );
  assert.throws(
    () =>
      successfulResponseValue({ code: 403, message: "没有权限" }, "fallback"),
    (error) => error.code === 403 && error.message === "没有权限",
  );
});

test("先收到终态文档仍订阅读到同一 result 错误；新 Run/作用域隔离迟到帧与状态", async () => {
  const document = story();
  let current = {
    work_asset_id: 20,
    work_version_id: 30,
    work_revision: 1,
    run_id: 12,
    request_id: "story-run",
    document,
  };
  const ref = { current };
  const streams = [];
  let statuses = 0,
    loads = 0;
  const env = runEnvironment({
    status: async ({ runId, requestId }) => {
      statuses++;
      return {
        run: { id: runId, request_id: requestId, status: "running", error: "" },
      };
    },
    readEvents: async (_api, request, _cursor, _block, consume, signal) => {
      streams.push({ request, consume, signal });
      await waitingForAbort(signal);
    },
  });
  const props = {
    projectId: 1,
    snapshot: current,
    snapshotRef: ref,
    workAssetIdRef: { current: 20 },
    scopeRef: { current: "work" },
    scope: "work",
    mounted: { current: true },
    acceptSnapshot(value) {
      ref.current = value;
      current = value;
      return value;
    },
    async loadWork() {
      loads++;
    },
    reportError(error) {
      throw error;
    },
  };
  const renderer = env.harness.renderer(env.runHook);
  renderer.render(props);
  await flush();
  const old = streams[0];
  old.consume({
    type: "progress",
    output: {
      writing: {
        ...current,
        work_revision: 2,
        document: { ...document, status: "failed" },
      },
    },
  });
  renderer.render({ ...props, snapshot: ref.current });
  assert.equal(old.signal.aborted, false);
  old.consume({ type: "result", status: 2, msg: "流中的明确错误" });
  let result = renderer.render({ ...props, snapshot: ref.current });
  assert.equal(result.generationError, "流中的明确错误");
  current = {
    ...current,
    run_id: 13,
    request_id: "new-run",
    document: {
      ...document,
      active_run_id: 13,
      active_request_id: "new-run",
      status: "running",
    },
  };
  ref.current = current;
  props.scopeRef.current = "new-scope";
  result = renderer.render({ ...props, snapshot: current, scope: "new-scope" });
  await flush();
  assert.equal(old.signal.aborted, true);
  old.consume({
    type: "progress",
    output: {
      writing: {
        ...current,
        run_id: 12,
        request_id: "story-run",
        document: { ...document, title: "迟到的旧内容", status: "ready" },
      },
    },
  });
  assert.equal(ref.current.request_id, "new-run");
  assert.equal(ref.current.document.title, document.title);
  assert.equal(loads, 0);
  assert.equal(statuses, 2);
  renderer.unmount();
  assert.ok(streams.every((stream) => stream.signal.aborted));
  assert.equal(env.clock.size, 0);
});
