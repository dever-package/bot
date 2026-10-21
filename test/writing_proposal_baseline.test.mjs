import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { loader, testReact } from "./writing_test_loader.mjs";
import { completeOutline, emptyPreferences } from "./writing_fixture.mjs";

const sourceRoot = new URL("../front/src/nodes/body-work/", import.meta.url)
  .pathname;
const plain = (value) => JSON.parse(JSON.stringify(value));
const bodySelection = { kind: "unit", id: "chapter", tab: "body" };
const range = { from: 2, to: 4, text: "原文", content: "原文" };
const request = { unit_id: "chapter", instruction: "润色" };
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => {
    resolve = yes;
    reject = no;
  });
  return { promise, resolve, reject };
};

/** 真正的 editor、共享 draft 和 proposal；只替换网络、时钟与 React 调度。 */
function proposalHarness() {
  let cursor = 0,
    dirty = false,
    current,
    rendered,
    error = "",
    flushes = 0;
  const slots = [],
    effects = [];
  const changed = (before, after) =>
    !before || !after || after.some((value, i) => !Object.is(value, before[i]));
  const slot = (create) => (slots[cursor++] ||= create());
  const react = {
    ...testReact,
    useState(initial) {
      const state = slot(() => ({
        value: typeof initial === "function" ? initial() : initial,
      }));
      return [
        state.value,
        (value) => {
          const next = typeof value === "function" ? value(state.value) : value;
          if (!Object.is(state.value, next)) {
            state.value = next;
            dirty = true;
          }
        },
      ];
    },
    useRef: (initial) => slot(() => ({ current: initial })),
    useMemo(compute, dependencies) {
      const state = slot(() => ({}));
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
      const state = slot(() => ({}));
      if (changed(state.dependencies, dependencies)) {
        effects.push(() => {
          state.cleanup?.();
          state.cleanup = effect();
        });
        state.dependencies = dependencies;
      }
    },
  };
  const document = {
    type: "story",
    schema_version: 1,
    title: "故事",
    preferences: emptyPreferences(),
    inspirations: [{ id: "idea", title: "故事", content: "灵感" }],
    selected_inspiration_id: "idea",
    outline: completeOutline("已保存大纲"),
    units: [
      {
        id: "chapter",
        title: "一章",
        unit_type: "chapter",
        plan: "章纲",
        asset_id: 2,
        version_id: 30,
        has_body: true,
        continuity_valid: false,
        dependency_stale: false,
      },
    ],
    archived_units: [],
    status: "ready",
    active_run_id: 10,
    active_request_id: "request-10",
  };
  const snapshotRef = {
    current: {
      document,
      work_asset_id: 1,
      work_version_id: 20,
      work_revision: 3,
      run_id: 10,
    },
  };
  const mounted = { current: true };
  const calls = [],
    saves = [],
    pendingSaves = [];
  let savedBody = "开始原文结束",
    holdSave = false;
  const unit = () => ({
    type: "writing_unit",
    schema_version: 1,
    profile: "story",
    unit_id: "chapter",
    title: "一章",
    body: savedBody,
    synopsis: "",
    end_state: "",
    open_threads: "",
    ending: "",
    continuity_valid: false,
    predecessor_version_id: 0,
  });
  const acceptSnapshot = (snapshot) => {
    snapshotRef.current = snapshot;
    dirty = true;
  };
  const options = {
    react,
    __globals: { window: { setTimeout: () => 1, clearTimeout() {} }, Error },
    "../space/space-api": {
      fetchSpaceAssetVersionDetail: async () => ({ content: unit() }),
    },
    "./use-writing-snapshot": {
      useWritingSnapshot: () => ({
        snapshot: snapshotRef.current,
        snapshotRef,
        mounted,
        acceptSnapshot,
        command: (
          action,
          extra = {},
          version = snapshotRef.current.work_version_id,
        ) => ({
          action,
          project_id: 1,
          canvas_id: 1,
          work_asset_id: 1,
          expected_work_version_id: version,
          expected_work_revision: snapshotRef.current.work_revision,
          ...extra,
        }),
        setError: (value) => {
          error = value;
          dirty = true;
        },
        reportError: (cause) => {
          error = cause.message;
          dirty = true;
        },
        error,
        clearPreview() {},
        clearGenerationError() {},
      }),
    },
    "./writing-api": {
      submitWritingCommand: async (command) => {
        calls.push(plain(command));
        if (command.action === "save_unit") {
          saves.push(command.body);
          if (holdSave) {
            const gate = deferred();
            pendingSaves.push(gate);
            await gate.promise;
          }
          savedBody = command.body;
          const snapshot = snapshotRef.current;
          return {
            ...snapshot,
            work_revision: snapshot.work_revision + 1,
            document: {
              ...snapshot.document,
              units: snapshot.document.units.map((entry) => ({
                ...entry,
                version_id: entry.version_id + 1,
              })),
            },
          };
        }
        assert.equal(command.action, "propose_edit");
        const snapshot = snapshotRef.current;
        assert.equal(
          command.expected_unit_version_id,
          snapshot.document.units[0].version_id,
        );
        assert.equal(command.expected_work_revision, snapshot.work_revision);
        return {
          ...snapshot,
          run_id: snapshot.run_id + 1,
          document: { ...snapshot.document, status: "running" },
        };
      },
    },
  };
  const loadDraft = loader(options);
  const { useContentDraft } = loadDraft(
    path.join(sourceRoot, "shared/use-content-draft.ts"),
  );
  options["../shared/use-content-draft"] = {
    useContentDraft: (input) => {
      const draft = useContentDraft(input);
      return {
        ...draft,
        flush: () => {
          flushes++;
          return draft.flush();
        },
      };
    },
  };
  const load = loader(options);
  const { useWritingEditor } = load(
    path.join(sourceRoot, "writing/use-writing-editor.ts"),
  );
  const { useWritingProposal } = load(
    path.join(sourceRoot, "writing/use-writing-proposal.ts"),
  );
  const render = () => {
    cursor = 0;
    dirty = false;
    const editor = useWritingEditor({
      projectId: 1,
      canvasId: 1,
      node: { id: "story" },
    });
    rendered = { editor, proposal: useWritingProposal(editor) };
    for (const effect of effects.splice(0)) effect();
    current = rendered;
    return rendered;
  };
  const settle = async () => {
    for (let i = 0; i < 12; i++) {
      await Promise.resolve();
      if (dirty) render();
    }
    return current;
  };
  return {
    render,
    settle,
    calls,
    saves,
    pendingSaves,
    snapshotRef,
    get current() {
      return current;
    },
    get flushes() {
      return flushes;
    },
    get savedBody() {
      return savedBody;
    },
    async init() {
      render();
      await settle();
      await current.editor.openSelection(bodySelection, false);
      render();
      await settle();
      assert.equal(current.editor.draft.draft.unit.body, savedBody);
      flushes = 0;
    },
    edit(body) {
      current.editor.draft.setDraft((value) => ({
        ...value,
        unit: { ...value.unit, body },
      }));
      render();
    },
    select(selection = range) {
      current.proposal.onTextSelectionChange(selection);
      render();
    },
    hold() {
      holdSave = true;
    },
    async releaseNext() {
      pendingSaves.shift().resolve();
      await settle();
    },
    failNext() {
      pendingSaves.shift().reject(new Error("保存失败"));
    },
    finish(replacement = "修改后的正文") {
      const command = calls
        .filter((entry) => entry.action === "propose_edit")
        .at(-1);
      const snapshot = snapshotRef.current;
      acceptSnapshot({
        ...snapshot,
        document: { ...snapshot.document, status: "ready" },
        proposal: {
          run_id: snapshot.run_id,
          work_asset_id: snapshot.work_asset_id,
          work_version_id: snapshot.work_version_id,
          work_revision: snapshot.work_revision,
          unit_id: command.unit_id,
          section_id: command.section_id,
          selected_text: command.selected_text,
          unit_version_id: command.expected_unit_version_id,
          replacement,
        },
      });
      render();
    },
    failRun() {
      const snapshot = snapshotRef.current;
      acceptSnapshot({
        ...snapshot,
        document: { ...snapshot.document, status: "failed" },
      });
      render();
    },
    unmount() {
      mounted.current = false;
      for (const state of slots) state.cleanup?.();
    },
  };
}

async function withHarness(run) {
  const harness = proposalHarness();
  try {
    await harness.init();
    await run(harness);
  } finally {
    harness.unmount();
  }
}
const proposals = (harness) =>
  harness.calls.filter((call) => call.action === "propose_edit");

test("建议提交只flush一次：保存期间继续输入使用最终原文和精确pin，生成后可应用", () =>
  withHarness(async (h) => {
    h.edit("第一次输入");
    h.hold();
    const pending = h.current.proposal.run("propose_edit", request);
    await h.settle();
    assert.equal(h.pendingSaves.length, 1);
    h.edit("保存期间继续输入");
    await h.releaseNext();
    assert.equal(h.pendingSaves.length, 1);
    await h.releaseNext();
    assert.equal(await pending, true);
    await h.settle();
    assert.deepEqual(h.saves, ["第一次输入", "保存期间继续输入"]);
    const submissionFlushes = h.flushes;
    assert.equal(proposals(h)[0].expected_unit_version_id, 32);
    assert.equal(h.savedBody, "保存期间继续输入");
    h.finish();
    assert.equal(h.current.proposal.ready, true);
    const applied = h.current.proposal.apply();
    await h.settle();
    if (h.pendingSaves.length) await h.releaseNext();
    await applied;
    await h.settle();
    assert.equal(h.current.proposal.error, "");
    assert.equal(h.savedBody, "修改后的正文");
    assert.equal(submissionFlushes, 1);
  }));

test("无新输入的普通建议可应用；首次提交只用原action保存边界", () =>
  withHarness(async (h) => {
    assert.equal(await h.current.proposal.run("propose_edit", request), true);
    await h.settle();
    assert.equal(h.flushes, 1);
    assert.equal(h.saves.length, 0);
    h.finish();
    await h.current.proposal.apply();
    await h.settle();
    assert.equal(h.savedBody, "修改后的正文");
    assert.equal(h.current.proposal.error, "");
  }));

test("精确选区保留offset/content，重复文本只替换原范围", () =>
  withHarness(async (h) => {
    h.edit("开始原文结束原文");
    await h.current.editor.draft.flush();
    await h.settle();
    h.select();
    assert.equal(await h.current.proposal.run("propose_edit", request), true);
    await h.settle();
    assert.equal(proposals(h)[0].selected_text, "原文");
    h.finish("建议");
    const replacements = [];
    h.current.proposal.selectionActionsRef.current = {
      clearSelection() {},
      replaceSelection(selection, replacement) {
        replacements.push(plain(selection));
        const body = h.current.editor.draft.draft.unit.body;
        h.current.editor.draft.setDraft((value) => ({
          ...value,
          unit: {
            ...value.unit,
            body:
              body.slice(0, selection.from) +
              replacement +
              body.slice(selection.to),
          },
        }));
        return true;
      },
    };
    await h.current.proposal.apply();
    await h.settle();
    assert.deepEqual(replacements, [range]);
    assert.equal(h.savedBody, "开始建议结束原文");
  }));

test("捕获选区后保存期间正文改变，在发AI请求前拒绝且保留最新草稿", () =>
  withHarness(async (h) => {
    h.edit("开始原文结束");
    h.select();
    h.edit("开始原文结束 ");
    h.hold();
    const pending = h.current.proposal.run("propose_edit", request);
    await h.settle();
    h.edit("开始原文已变化结束");
    await h.releaseNext();
    await h.releaseNext();
    assert.equal(await pending, false);
    await h.settle();
    assert.equal(proposals(h).length, 0);
    assert.match(h.current.proposal.error, /原文已变化/);
    assert.equal(h.current.editor.draft.draft.unit.body, "开始原文已变化结束");
  }));

test("保存失败不提交建议，原草稿保留且可重试保存", () =>
  withHarness(async (h) => {
    h.edit("未保存正文");
    h.hold();
    const pending = h.current.proposal.run("propose_edit", request);
    await h.settle();
    h.failNext();
    assert.equal(await pending, false);
    await h.settle();
    assert.equal(proposals(h).length, 0);
    assert.equal(h.current.editor.error, "保存失败");
    assert.equal(h.current.editor.draft.draft.unit.body, "未保存正文");
    assert.equal(h.current.editor.draft.status, "error");
    const retry = h.current.editor.draft.retry();
    await h.settle();
    await h.releaseNext();
    assert.equal(await retry, true);
    await h.settle();
    assert.equal(h.savedBody, "未保存正文");
    assert.equal(h.current.editor.draft.status, "saved");
  }));

test("失败后retry同样捕获最终保存原文和pin，建议可应用", () =>
  withHarness(async (h) => {
    assert.equal(await h.current.proposal.run("propose_edit", request), true);
    await h.settle();
    h.failRun();
    h.current.proposal.discard();
    h.render();
    h.edit("重试前正文");
    h.hold();
    const pending = h.current.proposal.retry(request, bodySelection);
    await h.settle();
    h.edit("重试保存期间输入");
    await h.releaseNext();
    await h.releaseNext();
    assert.equal(await pending, true);
    await h.settle();
    assert.equal(proposals(h).at(-1).expected_unit_version_id, 32);
    h.finish("重试建议");
    const applied = h.current.proposal.apply();
    await h.settle();
    await h.releaseNext();
    await applied;
    await h.settle();
    assert.equal(h.savedBody, "重试建议");
    assert.equal(h.current.proposal.error, "");
  }));

test("精确选区retry遇到已变化原文，发AI前拒绝且不扩大范围", () =>
  withHarness(async (h) => {
    h.select();
    assert.equal(await h.current.proposal.run("propose_edit", request), true);
    await h.settle();
    h.failRun();
    h.current.proposal.discard();
    h.render();
    h.edit("已变原文");
    assert.equal(
      await h.current.proposal.retry(
        { ...request, selected_text: "原文" },
        bodySelection,
      ),
      false,
    );
    await h.settle();
    assert.equal(proposals(h).length, 1);
    assert.match(h.current.proposal.error, /原文已变化/);
  }));

test("实际提交之后手改仍由原文保护拦截应用", () =>
  withHarness(async (h) => {
    assert.equal(await h.current.proposal.run("propose_edit", request), true);
    await h.settle();
    h.finish();
    h.edit("生成后手动修改");
    await h.current.proposal.apply();
    await h.settle();
    assert.match(h.current.proposal.error, /内容或版本已变化/);
    assert.equal(h.current.editor.draft.draft.unit.body, "生成后手动修改");
    assert.equal(h.saves.length, 0);
  }));

test("提交边界锁定原编辑目标；保存中不能切换章节或重复发起动作", () =>
  withHarness(async (h) => {
    h.edit("保存中的正文");
    h.hold();
    const pending = h.current.proposal.run("propose_edit", request);
    await h.settle();
    assert.equal(
      await h.current.editor.openSelection({ kind: "section", id: "world" }),
      false,
    );
    assert.equal(await h.current.editor.action("propose_edit", request), false);
    assert.equal(await h.current.proposal.run("propose_edit", request), false);
    await h.releaseNext();
    assert.equal(await pending, true);
    await h.settle();
    assert.deepEqual(plain(h.current.editor.selection), bodySelection);
    assert.equal(proposals(h).length, 1);
  }));

test("retry的捕获目标与当前保存基线不同，在发AI前拒绝", () =>
  withHarness(async (h) => {
    const otherSelection = { kind: "section", id: "world" };
    assert.equal(
      await h.current.proposal.retry({ section_id: "world" }, otherSelection),
      false,
    );
    await h.settle();
    assert.equal(proposals(h).length, 0);
    assert.match(h.current.proposal.error, /编辑目标已变化/);
  }));
