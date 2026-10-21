import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";

import { completeOutline, emptyPreferences } from "./writing_fixture.mjs";

const frontRequire = createRequire(
  new URL("../front/package.json", import.meta.url),
);
const ts = frontRequire("typescript");
const source = ts.transpileModule(
  readFileSync(
    new URL(
      "../front/src/nodes/body-work/writing/use-writing-preview.ts",
      import.meta.url,
    ),
    "utf8",
  ),
  {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
    },
  },
).outputText;

// 执行真实预览 hook 的命令路径，只替换 React 存储和网络/快照边界。
function previewFixture(submit) {
  const original = {
    work_asset_id: 11,
    work_version_id: 21,
    work_revision: 4,
    document: {
      type: "story",
      schema_version: 1,
      preferences: emptyPreferences(),
      title: "作品",
      inspirations: [
        { id: "first", title: "方向一", content: "第一个方向" },
        { id: "second", title: "方向二", content: "第二个方向" },
        { id: "third", title: "方向三", content: "第三个方向" },
      ],
      selected_inspiration_id: "",
      outline: completeOutline("保留的大纲"),
      units: [],
      archived_units: [],
      status: "ready",
      active_run_id: 0,
      active_request_id: "",
    },
    run_id: 0,
    request_id: "",
    status: "ready",
  };
  const commands = [];
  const errors = [];
  const work = {
    snapshotRef: { current: original },
    mounted: { current: true },
    command(action, extra = {}) {
      const current = this.snapshotRef.current;
      return {
        project_id: 7,
        canvas_id: 8,
        work_asset_id: current.work_asset_id,
        expected_work_version_id: current.work_version_id,
        expected_work_revision: current.work_revision,
        action,
        ...extra,
      };
    },
    acceptSnapshot(snapshot) {
      this.snapshotRef.current = snapshot;
    },
    clearPreview() {},
    clearGenerationError() {},
    setError() {},
    reportError(cause) {
      errors.push(cause);
    },
    async stopRun() {},
  };
  let cursor = 0;
  const hooks = [];
  const exports = {};
  runInNewContext(source, {
    exports,
    Error,
    require(specifier) {
      if (specifier === "react")
        return {
          useRef(value) {
            const slot = cursor++;
            return (hooks[slot] ||= { current: value });
          },
          useState(value) {
            const slot = cursor++;
            hooks[slot] ||= { current: value };
            return [
              hooks[slot].current,
              (next) => {
                hooks[slot].current = next;
              },
            ];
          },
        };
      if (specifier === "./use-writing-snapshot")
        return { useWritingSnapshot: () => work };
      if (specifier === "./writing-api")
        return {
          async submitWritingCommand(command) {
            commands.push(command);
            if (submit) return submit(command);
            return {
              ...original,
              document: command.document || original.document,
              work_revision: 5,
            };
          },
        };
      throw new Error(`Unexpected dependency ${specifier}`);
    },
  });
  return {
    original,
    work,
    commands,
    errors,
    render(extra = {}) {
      cursor = 0;
      return exports.useWritingPreview({
        projectId: 7,
        canvasId: 8,
        node: {},
        ...extra,
      });
    },
  };
}

test("editing the second inspiration saves only its fields in the existing root revision", async () => {
  const fixture = previewFixture();
  const preview = fixture.render();
  const edit = preview.beginInspirationEdit("second");
  await preview.saveInspiration(edit, {
    title: "新的标题",
    content: "新的内容",
  });
  assert.equal(fixture.commands.length, 1);
  const command = fixture.commands[0];
  assert.equal(command.action, "save_document");
  assert.equal(command.expected_work_version_id, 21);
  assert.equal(command.expected_work_revision, 4);
  assert.equal(command.document.inspirations[1].id, "second");
  assert.equal(command.document.inspirations[1].title, "新的标题");
  assert.equal(command.document.inspirations[1].content, "新的内容");
  assert.equal(
    command.document.inspirations[0],
    fixture.original.document.inspirations[0],
  );
  assert.equal(
    command.document.inspirations[2],
    fixture.original.document.inspirations[2],
  );
  assert.equal(command.document.units, fixture.original.document.units);
  assert.equal(command.document.outline, fixture.original.document.outline);
  assert.equal(command.document.selected_inspiration_id, "");
  assert.equal(fixture.original.document.inspirations[1].title, "方向二");
  assert.equal(fixture.work.snapshotRef.current.work_version_id, 21);
  assert.equal(fixture.work.snapshotRef.current.work_revision, 5);
});

test("opening/canceling or saving unchanged fields never sends a command", async () => {
  const fixture = previewFixture();
  const preview = fixture.render();
  assert.equal(preview.beginInspirationEdit("missing"), null);
  preview.beginInspirationEdit("first");
  const edit = preview.beginInspirationEdit("second");
  assert.equal(fixture.commands.length, 0);
  await preview.saveInspiration(edit, edit.inspiration);
  assert.equal(fixture.commands.length, 0);
});

test("a changed revision/version/work or canvas rejects the old draft without submitting", async () => {
  for (const change of [
    { work_revision: 5 },
    { work_version_id: 22 },
    { work_asset_id: 12 },
  ]) {
    const fixture = previewFixture();
    const preview = fixture.render();
    const edit = preview.beginInspirationEdit("second");
    fixture.work.snapshotRef.current = { ...fixture.original, ...change };
    await assert.rejects(
      preview.saveInspiration(edit, { title: "修改", content: "保留输入" }),
      /作品已更新/,
    );
    assert.equal(fixture.commands.length, 0);
  }
  const fixture = previewFixture();
  const edit = fixture.render().beginInspirationEdit("second");
  const changedScope = fixture.render({ canvasId: 9 });
  await assert.rejects(
    changedScope.saveInspiration(edit, { title: "修改", content: "保留输入" }),
    /作品已更新/,
  );
  assert.equal(fixture.commands.length, 0);
});

test("current readonly and active generation guards also protect an already opened edit", async () => {
  for (const mode of ["readonly", "running", "snapshotRunning"]) {
    const fixture = previewFixture();
    const edit = fixture.render().beginInspirationEdit("second");
    if (mode === "snapshotRunning")
      fixture.original.document.status = "running";
    const current = fixture.render(
      mode === "snapshotRunning" ? {} : { [mode]: true },
    );
    assert.equal(current.beginInspirationEdit("first"), null);
    await assert.rejects(
      current.saveInspiration(edit, { title: "修改", content: "保留输入" }),
      /只读或正在生成/,
    );
    assert.equal(fixture.commands.length, 0);
  }
});

test("double submit and competing regeneration issue exactly one save", async () => {
  let finish;
  const fixture = previewFixture(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  const preview = fixture.render();
  const edit = preview.beginInspirationEdit("second");
  const first = preview.saveInspiration(edit, {
    title: "修改",
    content: "新的内容",
  });
  await assert.rejects(
    preview.saveInspiration(edit, { title: "修改", content: "新的内容" }),
    /正在处理其他操作/,
  );
  assert.equal(await preview.action("generate_inspirations"), false);
  assert.equal(fixture.commands.length, 1);
  finish({
    ...fixture.original,
    work_revision: 5,
    document: fixture.commands[0].document,
  });
  await first;
});

test("save failure retains the baseline for explicit retry and does not leak a second card error", async () => {
  let attempts = 0;
  const fixture = previewFixture((command) => {
    if (++attempts === 1) throw new Error("修订冲突");
    return {
      ...fixture.original,
      document: command.document,
      work_revision: 5,
    };
  });
  const preview = fixture.render();
  const edit = preview.beginInspirationEdit("third");
  const fields = { title: "我的修改", content: "失败仍保留" };
  await assert.rejects(preview.saveInspiration(edit, fields), /修订冲突/);
  assert.equal(fixture.work.snapshotRef.current, fixture.original);
  assert.equal(fixture.errors.length, 0);
  await preview.saveInspiration(edit, fields);
  assert.equal(fixture.commands.length, 2);
  assert.equal(fixture.commands[1].expected_work_revision, 4);
});

test("selection remains an explicit single selection command, separate from editing", async () => {
  const fixture = previewFixture();
  const preview = fixture.render();
  assert.equal(
    await preview.action("select_inspiration", { inspiration_id: "second" }),
    true,
  );
  assert.equal(fixture.commands.length, 1);
  assert.equal(fixture.commands[0].action, "select_inspiration");
  assert.equal(fixture.commands[0].inspiration_id, "second");
});

test("dialog regeneration submits only its captured target and baseline without saving or selecting", async () => {
  const fixture = previewFixture();
  const preview = fixture.render();
  const edit = preview.beginInspirationEdit("second");
  await preview.regenerateInspiration(edit);
  assert.equal(fixture.commands.length, 1);
  assert.deepEqual(
    { ...fixture.commands[0] },
    {
      project_id: 7,
      canvas_id: 8,
      work_asset_id: 11,
      expected_work_version_id: 21,
      expected_work_revision: 4,
      action: "generate_inspirations",
      inspiration_id: "second",
    },
  );
  assert.equal(fixture.original.document.selected_inspiration_id, "");
  assert.equal(fixture.original.document.inspirations[1].title, "方向二");
});

test("dialog regeneration rejects every changed scope or root baseline without submitting", async () => {
  for (const change of [
    { snapshot: { work_revision: 5 } },
    { snapshot: { work_version_id: 22 } },
    { snapshot: { work_asset_id: 12 } },
    { props: { projectId: 8 } },
    { props: { canvasId: 9 } },
  ]) {
    const fixture = previewFixture();
    const edit = fixture.render().beginInspirationEdit("second");
    if (change.snapshot)
      fixture.work.snapshotRef.current = {
        ...fixture.original,
        ...change.snapshot,
      };
    await assert.rejects(
      fixture.render(change.props).regenerateInspiration(edit),
      /作品已更新/,
    );
    assert.equal(fixture.commands.length, 0);
  }
});

test("dialog regeneration respects current readonly and active generation guards", async () => {
  for (const mode of ["readonly", "running", "snapshotRunning"]) {
    const fixture = previewFixture();
    const edit = fixture.render().beginInspirationEdit("second");
    if (mode === "snapshotRunning")
      fixture.original.document.status = "running";
    const preview = fixture.render(
      mode === "snapshotRunning" ? {} : { [mode]: true },
    );
    await assert.rejects(preview.regenerateInspiration(edit), /只读或正在生成/);
    assert.equal(fixture.commands.length, 0);
  }
});

test("dialog regeneration never turns a missing candidate id into a batch command", async () => {
  const fixture = previewFixture();
  const preview = fixture.render();
  const edit = preview.beginInspirationEdit("second");
  await assert.rejects(
    preview.regenerateInspiration({
      ...edit,
      inspiration: { ...edit.inspiration, id: "" },
    }),
    /尚未保存/,
  );
  assert.equal(fixture.commands.length, 0);
});

test("dialog save and regeneration exclude each other and duplicate regeneration", async () => {
  for (const firstOperation of ["save", "regenerate"]) {
    let finish;
    const fixture = previewFixture(
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const preview = fixture.render();
    const edit = preview.beginInspirationEdit("second");
    const fields = { title: "我的修改", content: "保留输入" };
    const first =
      firstOperation === "save"
        ? preview.saveInspiration(edit, fields)
        : preview.regenerateInspiration(edit);
    await assert.rejects(
      preview.regenerateInspiration(edit),
      /正在处理其他操作/,
    );
    await assert.rejects(
      preview.saveInspiration(edit, fields),
      /正在处理其他操作/,
    );
    assert.equal(await preview.action("generate_inspirations"), false);
    assert.equal(fixture.commands.length, 1);
    finish({ ...fixture.original, work_revision: 5 });
    await first;
  }
});

test("dialog regeneration failure preserves the original baseline for explicit retry", async () => {
  let attempts = 0;
  const fixture = previewFixture(() => {
    if (++attempts === 1) throw new Error("模型暂不可用");
    return { ...fixture.original, work_revision: 5 };
  });
  const preview = fixture.render();
  const edit = preview.beginInspirationEdit("third");
  await assert.rejects(preview.regenerateInspiration(edit), /模型暂不可用/);
  assert.equal(fixture.work.snapshotRef.current, fixture.original);
  assert.equal(edit.inspiration.content, "第三个方向");
  assert.equal(edit.command.expected_work_revision, 4);
  assert.equal(fixture.errors.length, 0);
  await preview.regenerateInspiration(edit);
  assert.equal(fixture.commands.length, 2);
  assert.deepEqual(fixture.commands[1], fixture.commands[0]);
});

test("selected stories cannot submit inspiration commands from the canvas preview", async () => {
  const fixture = previewFixture();
  fixture.original.document.selected_inspiration_id = "first";
  for (const action of ["select_inspiration", "generate_inspirations"]) {
    assert.equal(
      await fixture.render().action(action, { inspiration_id: "second" }),
      false,
    );
  }
  assert.equal(fixture.commands.length, 0);
});
