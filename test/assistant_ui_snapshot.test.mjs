import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { test } from "node:test";
import { pathToFileURL } from "node:url";

const frontRequire = createRequire(new URL("../front/package.json", import.meta.url));
const reactRequire = createRequire(frontRequire.resolve("@assistant-ui/react"));
const coreEntry = pathToFileURL(reactRequire.resolve("@assistant-ui/core"));
const coreRequire = createRequire(coreEntry);
const { AssistantRuntimeImpl, ExternalStoreRuntimeCore } = await import(
  pathToFileURL(reactRequire.resolve("@assistant-ui/core/internal"))
);
const { createTapRoot, flushTapSync } = await import(
  pathToFileURL(coreRequire.resolve("@assistant-ui/tap"))
);
const { useSubscribable } = await import(
  new URL("./store/runtime-clients/useSubscribable.js", coreEntry)
);

function createRuntime() {
  const store = {
    messages: [],
    isRunning: false,
    convertMessage: (message) => message,
    onNew: async () => {},
    onCancel: async () => {},
  };
  const core = new ExternalStoreRuntimeCore(store);
  const runtime = new AssistantRuntimeImpl(core);
  return { core, store, thread: runtime.thread, threads: runtime.threads };
}

test("subscribed thread-list snapshots retain identity without changes", (context) => {
  const { core, store, threads } = createRuntime();
  let notifications = 0;
  context.after(threads.subscribe(() => notifications++));

  const snapshot = threads.getState();
  assert.strictEqual(threads.getState(), snapshot);
  core.setAdapter(store);
  assert.strictEqual(threads.getState(), snapshot);
  assert.equal(notifications, 0);
});

test("useSubscribable settles with an empty, stable external store", (context) => {
  const { core, store, threads } = createRuntime();
  let renders = 0;
  let notifications = 0;
  context.after(core.threads.subscribe(() => notifications++));
  const root = createTapRoot(() => {
    renders++;
    return useSubscribable(threads);
  }, { mountOnSubscribe: true });
  context.after(() => root.unmount());
  context.after(() => context.diagnostic(`renders=${renders}, notifications=${notifications}`));

  assert.doesNotThrow(() => {
    context.after(root.subscribe(() => {}));
  });
  const snapshot = root.getValue();
  const settledRenders = renders;
  flushTapSync(() => core.setAdapter(store));

  assert.ok(settledRenders > 0);
  assert.equal(renders, settledRenders);
  assert.equal(notifications, 0);
  assert.strictEqual(root.getValue(), snapshot);
  assert.strictEqual(snapshot, threads.getState());
});

test("thread-list changes notify, unsubscribe detaches, and resubscribe stays current", (context) => {
  const { core, store, threads } = createRuntime();
  const received = [];
  const unsubscribe = threads.subscribe(() => received.push(threads.getState()));
  context.after(unsubscribe);
  const initial = threads.getState();
  const firstThread = { id: "thread-one", title: "First thread" };
  const secondThread = { id: "thread-two", title: "Second thread" };

  core.setAdapter({ ...store, adapters: { threadList: { threads: [firstThread] } } });
  assert.equal(received.length, 1);
  const updated = received[0];
  assert.notStrictEqual(updated, initial);
  assert.deepEqual(updated.threadIds, [firstThread.id]);
  assert.equal(updated.threadItems[firstThread.id].title, firstThread.title);
  assert.strictEqual(threads.getState(), updated);

  unsubscribe();
  core.setAdapter({ ...store, adapters: { threadList: { threads: [secondThread] } } });
  assert.equal(received.length, 1);

  context.after(threads.subscribe(() => received.push(threads.getState())));
  const resubscribed = threads.getState();
  assert.notStrictEqual(resubscribed, updated);
  assert.deepEqual(resubscribed.threadIds, [secondThread.id]);
  assert.strictEqual(threads.getState(), resubscribed);

  const beforeChange = received.length;
  core.setAdapter({ ...store, adapters: { threadList: { threads: [firstThread, secondThread] } } });
  assert.equal(received.length, beforeChange + 1);
  assert.notStrictEqual(received.at(-1), resubscribed);
  assert.deepEqual(received.at(-1).threadIds, [firstThread.id, secondThread.id]);
  assert.strictEqual(threads.getState(), received.at(-1));
});

test("thread snapshots track streaming messages without looping on composer edits", (context) => {
  const { core, store, thread } = createRuntime();
  let renders = 0;
  const root = createTapRoot(() => {
    renders++;
    return useSubscribable(thread);
  }, { mountOnSubscribe: true });
  context.after(() => root.unmount());
  context.after(root.subscribe(() => {}));
  const initial = root.getValue();
  const runningStore = {
    ...store,
    isRunning: true,
    messages: [{ id: "reply", role: "assistant", content: [{ type: "text", text: "Hello" }] }],
  };

  flushTapSync(() => core.setAdapter(runningStore));
  const running = root.getValue();
  assert.notStrictEqual(running, initial);
  assert.equal(running.isRunning, true);
  assert.equal(running.messages[0].content[0].text, "Hello");
  assert.strictEqual(thread.getState(), running);

  const settledRenders = renders;
  flushTapSync(() => thread.composer.setText("Next message"));
  assert.equal(thread.composer.getState().text, "Next message");
  assert.equal(renders, settledRenders);
  assert.strictEqual(root.getValue(), running);

  const completedStore = {
    ...runningStore,
    isRunning: false,
    messages: [{ id: "reply", role: "assistant", content: [{ type: "text", text: "Hello world" }] }],
  };
  flushTapSync(() => core.setAdapter(completedStore));
  const completed = root.getValue();
  assert.notStrictEqual(completed, running);
  assert.equal(completed.isRunning, false);
  assert.equal(completed.messages[0].content[0].text, "Hello world");
  assert.strictEqual(thread.getState(), completed);

  const completedRenders = renders;
  flushTapSync(() => core.setAdapter(completedStore));
  assert.equal(renders, completedRenders);
  assert.strictEqual(root.getValue(), completed);
});
