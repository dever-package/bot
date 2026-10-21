import { loader, ts, testReact as react } from "./writing_test_loader.mjs";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { runInNewContext } from "node:vm";

import { completeOutline, emptyPreferences } from "./writing_fixture.mjs";

const sourceRoot = new URL("../front/src/nodes/body-work/", import.meta.url)
  .pathname;
const load = loader();
const domain = load(path.join(sourceRoot, "writing/writing-document.ts"));
const directoryHook = load(
  path.join(sourceRoot, "writing/use-writing-chapter-directory.ts"),
);
const directoryFor = (document) =>
  directoryHook.useWritingChapterDirectory(document.units);
const workspace = load(path.join(sourceRoot, "writing/writing-workspace.ts"));
const ai = load(path.join(sourceRoot, "writing/writing-ai-command.ts"));
const stream = load(
  path.join(sourceRoot, "writing/writing-stream-projection.ts"),
);
const idleOrder = {
  pending: false,
  itemProps: () => ({}),
  handleProps: () => ({ disabled: false }),
};
const plain = (value) => JSON.parse(JSON.stringify(value));
const chapter = (id, plan = "已保存章纲", hasBody = false) => ({
  id,
  title: id,
  plan,
  has_body: hasBody,
  unit_type: "chapter",
  children: [],
  asset_id: hasBody ? 20 : 0,
  version_id: hasBody ? 30 : 0,
  continuity_valid: false,
  dependency_stale: false,
});
const document = () => ({
  type: "story",
  schema_version: 1,
  preferences: emptyPreferences(),
  title: "作品",
  inspirations: [1, 2, 3].map((id) => ({
    id: `idea-${id}`,
    title: `方向${id}`,
    content: `灵感${id}`,
  })),
  selected_inspiration_id: "",
  outline: completeOutline(""),
  units: [],
  archived_units: [],
  status: "ready",
  active_run_id: 1,
  active_request_id: "request",
});
const section = (id) => ({ kind: "section", id });
const selected = () => ({ ...document(), selected_inspiration_id: "idea-1" });
function nodes(tree) {
  if (!tree || typeof tree !== "object") return [];
  return [tree, ...[tree.props?.children].flat(Infinity).flatMap(nodes)];
}
const text = (tree) =>
  typeof tree === "string"
    ? tree
    : !tree || typeof tree !== "object"
      ? ""
      : [tree.props?.children].flat(Infinity).map(text).join("");

test("画布三候选只保留编辑弹窗、更换和选用，流式占位保持三条", () => {
  const { WritingInspirations } = load(
    path.join(sourceRoot, "writing/writing-inspirations.tsx"),
  );
  const calls = [];
  const render = (root, pending = false) =>
    WritingInspirations({
      document: root,
      disabled: false,
      pending,
      onEdit: (id) => calls.push(["edit", id]),
      onRegenerate: (id) => calls.push(["regenerate", id]),
      onSelect: (id) => calls.push(["select", id]),
    });
  const tree = render(document());
  assert.equal(tree.props.className, "writing-inspirations is-compact");
  assert.equal(nodes(tree).filter((node) => node.type === "article").length, 3);
  assert.equal(
    nodes(tree).some(
      (node) => node.type === "input" || node.type === "textarea",
    ),
    false,
  );
  for (const label of ["查看并编辑灵感 2：方向2", "更换灵感 2", "选用灵感 2"]) {
    nodes(tree)
      .find((node) => node.props?.["aria-label"] === label)
      .props.onClick({ stopPropagation() {} });
  }
  assert.deepEqual(calls, [
    ["edit", "idea-2"],
    ["regenerate", "idea-2"],
    ["select", "idea-2"],
  ]);
  assert.equal(
    nodes(
      render(
        { ...document(), inspirations: [document().inspirations[0]] },
        true,
      ),
    ).filter(
      (node) => node.type === "article" || typeof node.type === "function",
    ).length,
    3,
  );
});

test("未选候选不能进入工作区，明确选用后默认大纲，已有正文再次打开仍默认大纲", () => {
  const root = document();
  assert.equal(workspace.canOpenWritingWorkspace(root), false);
  root.selected_inspiration_id = "missing";
  assert.equal(workspace.canOpenWritingWorkspace(root), false);
  root.selected_inspiration_id = "idea-1";
  assert.equal(workspace.canOpenWritingWorkspace(root), true);
  assert.equal(domain.canSelectWritingInspiration(root, "idea-2"), false);
  assert.equal(domain.canSelectWritingInspiration(root, "idea-1"), false);
  root.outline = completeOutline("大纲");
  root.units = [chapter("第一章", "章纲", true)];
  assert.deepEqual(
    plain(domain.defaultWritingSelection(root)),
    section("overview"),
  );
});

test("完整大纲保存后开放章纲，人物归大纲随时维护，草稿与流式不提前解锁", () => {
  const saved = selected();
  assert.equal(
    workspace.writingSelectionReason(saved, section("overview")),
    "",
  );
  assert.match(
    workspace.writingSelectionReason(saved, section("chapters")),
    /大纲/,
  );
  const draft = { ...saved, outline: completeOutline("未保存大纲") };
  assert.equal(
    ai.writingAITarget({
      document: draft,
      savedDocument: saved,
      selection: section("chapters"),
      selectedCharacters: 0,
    }).available,
    false,
  );
  const projected = stream.projectWritingPreview(saved, {
    active_field: "outline.overview",
    fields: { "outline.overview": "流式大纲" },
  });
  assert.equal(projected.outline.overview, "流式大纲");
  assert.equal(saved.outline.overview, "");
  assert.match(
    workspace.writingActionReason(saved, "generate_chapters"),
    /大纲/,
  );
  saved.outline = completeOutline("手动保存大纲");
  assert.equal(workspace.writingActionReason(saved, "generate_chapters"), "");
  saved.units = [chapter("chapter", "")];
  assert.equal(
    workspace.writingSelectionReason(saved, section("characters")),
    "",
  );
  assert.match(
    workspace.writingSelectionReason(saved, {
      kind: "unit",
      id: "chapter",
      tab: "body",
    }),
    /保存本章/,
  );
  saved.units[0].plan = "手动保存章纲";
  assert.equal(
    workspace.writingSelectionReason(saved, section("characters")),
    "",
  );
  assert.equal(
    workspace.writingSelectionReason(saved, {
      kind: "unit",
      id: "chapter",
      tab: "body",
    }),
    "",
  );
  assert.equal(
    workspace.writingActionReason(saved, "generate_units", {
      mode: "single",
      unit_ids: ["chapter"],
    }),
    "",
  );
});

test("已有设定与正文允许回看，新增正文仍遵守上一章顺序与继续范围", () => {
  const root = selected();
  root.units = [chapter("one", "", true), chapter("two"), chapter("three")];
  root.outline.locations = [
    { id: "location", name: "场景", description: "手写" },
  ];
  assert.equal(
    workspace.writingSelectionReason(root, section("locations")),
    "",
  );
  assert.equal(
    workspace.writingSelectionReason(root, {
      kind: "unit",
      id: "one",
      tab: "body",
    }),
    "",
  );
  assert.match(
    workspace.writingActionReason(root, "generate_units", {
      mode: "single",
      unit_ids: ["two"],
    }),
    /大纲/,
  );
  root.outline = completeOutline("大纲");
  root.units[0].plan = "已保存";
  assert.equal(
    workspace.writingActionReason(root, "generate_units", {
      mode: "single",
      unit_ids: ["two"],
    }),
    "",
  );
  assert.match(
    workspace.writingActionReason(root, "generate_units", {
      mode: "single",
      unit_ids: ["three"],
    }),
    /上一章/,
  );
  assert.equal(
    workspace.writingActionReason(root, "generate_units", { mode: "continue" }),
    "",
  );
});

test("大纲实体 AI 只生成当前类型，单实体仍为精确提案，更新提示真实范围", () => {
  const root = {
    ...selected(),
    outline: completeOutline("保存大纲"),
    units: [chapter("unit")],
  };
  for (const kind of ["characters", "locations", "props"]) {
    root.outline[kind] = [
      { id: `${kind}-id`, name: kind, description: "手动描述" },
    ];
    const input = {
      document: root,
      savedDocument: root,
      directory: directoryFor(root),
      onOpenChapters() {},
      selection: section(kind),
      selectedCharacters: 0,
    };
    const command = ai.writingAICommand(input, "更新当前类型", false);
    assert.equal(command.action, "generate_section");
    assert.equal(command.extra.section_id, kind);
    assert.equal(command.extra.document, undefined);
    assert.match(
      workspace.writingCommandImpact(root, command.action, command.extra),
      /手动描述/,
    );
    assert.match(
      workspace.writingCommandImpact(root, command.action, command.extra),
      /其他设定、章纲和正文保留/,
    );
    const proposal = ai.writingAICommand(
      {
        ...input,
        selection: { kind: "entity", section: kind, id: `${kind}-id` },
        selectedCharacters: 4,
      },
      "修改选区",
      false,
    );
    assert.equal(proposal.action, "propose_edit");
    assert.equal(proposal.extra.entity_id, `${kind}-id`);
    assert.equal(proposal.extra.section_id, kind);
  }
  assert.match(
    workspace.writingCommandImpact(root, "generate_chapters"),
    /全部章纲/,
  );
});

test("正文和修改建议流式仍逐步展示，投影不覆盖已保存文档或其他内容", () => {
  const root = {
    ...selected(),
    outline: completeOutline("保存大纲"),
    units: [chapter("unit")],
    outline: {
      ...completeOutline("保存大纲"),
      characters: [{ id: "actor", name: "人物", description: "原描述" }],
      locations: [],
      props: [],
    },
  };
  for (const outline of ["新", "新大纲", "新大纲逐步增长"]) {
    assert.equal(
      stream.projectWritingPreview(root, {
        active_field: "outline.overview",
        fields: { "outline.overview": outline },
      }).outline.overview,
      outline,
    );
    assert.equal(root.outline.overview, "保存大纲");
    assert.equal(root.outline.characters[0].description, "原描述");
  }
  const projected = stream.projectWritingPreview(
    root,
    {
      active_field: "replacement",
      fields: { replacement: "建议", body: "实时正文" },
      unit_id: "unit",
    },
    "propose_edit",
  );
  assert.deepEqual(plain(projected), root);
});

test("失败任务保留原 section/entity/选区/要求；正文仅重试失败范围中的缺失结果", () => {
  const root = {
    ...selected(),
    outline: completeOutline("大纲"),
    status: "failed",
    units: [chapter("one", "章纲", true), chapter("two"), chapter("three")],
  };
  const snapshot = {
    document: root,
    checkpoint: {
      action: "generate_section",
      section_id: "locations",
      entity_id: "place",
      instruction: "保留地点",
      unit_id: "",
      unit_ids: [],
      completed: 0,
      target: 1,
    },
  };
  let retry = workspace.writingRetryCommand(snapshot);
  assert.equal(retry.action, "generate_section");
  assert.deepEqual(plain(retry.extra), {
    section_id: "locations",
    entity_id: "place",
    instruction: "保留地点",
  });
  snapshot.checkpoint = {
    ...snapshot.checkpoint,
    action: "propose_edit",
    selected_text: "精确原选区",
  };
  retry = workspace.writingRetryCommand(snapshot);
  assert.equal(retry.extra.selected_text, "精确原选区");
  assert.deepEqual(plain(workspace.writingProposalSelection(retry.extra)), {
    kind: "entity",
    section: "locations",
    id: "place",
  });
  snapshot.checkpoint = {
    action: "generate_units",
    phase: "body",
    unit_ids: ["one", "two"],
    unit_id: "two",
    completed: 1,
    target: 2,
    instruction: "原任务要求",
  };
  retry = workspace.writingRetryCommand(snapshot);
  assert.equal(retry.extra.mode, "single");
  assert.deepEqual(plain(retry.extra.unit_ids), ["two"]);
  assert.equal(retry.extra.instruction, "原任务要求");
  assert.equal(retry.extra.unit_ids.includes("three"), false);
  // 停止后清空已完成章，也不能扩大原 checkpoint 的剩余范围。
  root.units[0].has_body = false;
  retry = workspace.writingRetryCommand(snapshot);
  assert.deepEqual(plain(retry.extra.unit_ids), ["two"]);
  root.units[1].has_body = true;
  assert.equal(workspace.writingRetryCommand(snapshot), null);
  snapshot.checkpoint = undefined;
  assert.equal(workspace.writingRetryCommand(snapshot), null);
});

function hookStorage(withEffects = false) {
  const slots = [];
  const effects = [];
  let cursor = 0;
  return {
    reset: () => {
      cursor = 0;
    },
    runEffects: () => {
      for (const effect of effects.splice(0)) effect();
    },
    replayEffects: () => {
      for (const slot of slots) slot?.cleanup?.();
      for (const slot of slots) if (slot?.effect) slot.cleanup = slot.effect();
    },
    unmount: () => {
      for (const slot of slots) slot?.cleanup?.();
    },
    react: {
      ...react,
      useEffect(effect, dependencies) {
        if (!withEffects) return;
        const index = cursor++;
        const previous = slots[index];
        if (
          previous &&
          dependencies?.every((value, i) =>
            Object.is(value, previous.dependencies?.[i]),
          )
        )
          return;
        effects.push(() => {
          previous?.cleanup?.();
          slots[index] = { dependencies, effect, cleanup: effect() };
        });
      },
      useRef(value) {
        const index = cursor++;
        slots[index] ||= { current: value };
        return slots[index];
      },
      useState(value) {
        const index = cursor++;
        if (!(index in slots))
          slots[index] = typeof value === "function" ? value() : value;
        return [
          slots[index],
          (next) => {
            slots[index] =
              typeof next === "function" ? next(slots[index]) : next;
          },
        ];
      },
    },
  };
}

test("真实修改 hook 逐步展示 replacement，失败换页后重试仍保留原目标和精确选区", async () => {
  const storage = hookStorage();
  const { useWritingProposal } = loader({ react: storage.react })(
    path.join(sourceRoot, "writing/use-writing-proposal.ts"),
  );
  const root = {
    ...selected(),
    outline: completeOutline("大纲"),
    units: [chapter("unit", "计划", true)],
  };
  const value = {
    document: root,
    unit: { unit_id: "unit", body: "开始原文结束" },
  };
  const selection = { kind: "unit", id: "unit", tab: "body" };
  const commands = [];
  const editor = {
    selection,
    snapshot: { document: root, run_id: 10 },
    preview: null,
    draft: { draft: value, flush: async () => true },
    getSnapshot: () => editor.snapshot,
    action: async (action, extra, capture) => {
      if (!capture({ selection: editor.selection, value, unitVersion: 30 }))
        return false;
      commands.push({ action, extra });
      editor.snapshot = {
        document: { ...root, status: "running" },
        run_id: editor.snapshot.run_id + 1,
      };
      return true;
    },
    openSelection: async (next) => {
      editor.selection = next;
      return true;
    },
  };
  const render = () => {
    storage.reset();
    return useWritingProposal(editor);
  };
  let hook = render();
  const range = { from: 2, to: 4, text: "原文", content: "原文" };
  hook.onTextSelectionChange(range);
  hook = render();
  assert.equal(
    await hook.run("propose_edit", {
      unit_id: "unit",
      instruction: "润色原文",
    }),
    true,
  );
  for (const replacement of ["修", "修改", "修改建议逐步展示"]) {
    editor.preview = {
      run_id: editor.snapshot.run_id,
      active_field: "replacement",
      fields: { replacement },
    };
    assert.equal(render().preview, replacement);
    assert.equal(value.unit.body, "开始原文结束");
  }
  editor.snapshot.document.status = "failed";
  hook = render();
  hook.discard();
  editor.selection = section("locations");
  hook = render();
  await editor.openSelection(selection);
  assert.equal(
    await hook.retry(
      { unit_id: "unit", selected_text: "原文", instruction: "润色原文" },
      selection,
    ),
    true,
  );
  assert.equal(commands[1].action, "propose_edit");
  assert.equal(commands[1].extra.unit_id, "unit");
  assert.equal(commands[1].extra.selected_text, "原文");
  assert.equal(commands[1].extra.instruction, "润色原文");
  assert.equal(value.unit.body, "开始原文结束");
});

test("章节倒序投影不改canonical，ID落点换算保留正文pins和章号", () => {
  const { writingChapterView, reorderWritingChapters } = load(
    path.join(sourceRoot, "writing/use-writing-chapter-order.ts"),
  );
  const units = [
    chapter("one", "一", true),
    chapter("two", "二", true),
    chapter("three"),
  ];
  const original = plain(units);
  assert.deepEqual(plain(writingChapterView(units).map((unit) => unit.id)), [
    "three",
    "two",
    "one",
  ]);
  const reordered = reorderWritingChapters(units, "one", "three", "before");
  assert.deepEqual(plain(reordered.map((unit) => unit.id)), [
    "two",
    "three",
    "one",
  ]);
  assert.equal(reordered[2], units[0]);
  assert.equal(domain.writingUnitLabel(reordered, "one"), "第 3 章");
  assert.deepEqual(units, original);
  assert.equal(
    reorderWritingChapters(units, "missing", "three", "before"),
    units,
  );
  assert.equal(reorderWritingChapters(units, "one", "missing", "after"), units);
  assert.equal(reorderWritingChapters(units, "one", "one", "after"), units);
  assert.equal(reorderWritingChapters(units, "one", "two", "after"), units);
  assert.deepEqual(
    plain(
      reorderWritingChapters(units, "three", "one", "after").map(
        (unit) => unit.id,
      ),
    ),
    ["three", "one", "two"],
  );
});

test("共享排序控制器先flush后提交，拖动与键盘同序，失败/锁定/重复提交保原稿", async () => {
  const storage = hookStorage();
  const { useWritingChapterOrder } = loader({ react: storage.react })(
    path.join(sourceRoot, "writing/use-writing-chapter-order.ts"),
  );
  let saved = {
    ...selected(),
    units: [chapter("one", "一", true), chapter("two"), chapter("three")],
  };
  const original = plain(saved);
  const calls = [];
  let accept = false;
  let flushOK = true;
  let finish;
  const options = {
    disabled: false,
    reason: "只读或尚有草稿",
    getDocument: () => saved,
    flush: async () => {
      calls.push("flush");
      return flushOK;
    },
    onSave: async (next) => {
      calls.push(next);
      const ok = typeof accept === "function" ? await accept() : accept;
      if (ok) saved = next;
      return ok;
    },
  };
  const render = () => {
    storage.reset();
    return useWritingChapterOrder(options);
  };
  const key = (key) => ({ altKey: true, key, preventDefault() {} });
  await render().handleProps("one").onKeyDown(key("ArrowUp"));
  assert.equal(calls[0], "flush");
  assert.deepEqual(plain(calls[1].units.map((unit) => unit.id)), [
    "two",
    "one",
    "three",
  ]);
  assert.deepEqual(saved, original);
  flushOK = false;
  await render().handleProps("one").onKeyDown(key("ArrowUp"));
  assert.equal(calls.length, 3);
  flushOK = true;
  accept = () =>
    new Promise((resolve) => {
      finish = resolve;
    });
  const first = render().handleProps("one").onKeyDown(key("ArrowUp"));
  await new Promise(setImmediate);
  const locked = render();
  assert.equal(locked.pending, true);
  assert.equal(locked.handleProps("two").disabled, true);
  await locked.handleProps("two").onKeyDown(key("ArrowUp"));
  assert.equal(calls.length, 5);
  finish(true);
  await first;
  assert.deepEqual(plain(saved.units.map((unit) => unit.id)), [
    "two",
    "one",
    "three",
  ]);
  assert.deepEqual(plain(saved.units[1]), original.units[0]);
  accept = true;
  const drag = (y) => ({
    preventDefault() {},
    dataTransfer: { setData() {} },
    clientY: y,
    currentTarget: {
      getBoundingClientRect: () => ({ top: 0, height: 100 }),
      contains: () => false,
    },
  });
  const order = render();
  order.handleProps("two").onDragStart(drag());
  order.itemProps("three").onDragOver(drag(10));
  assert.equal(render().itemProps("three")["data-drop"], "before");
  await render().itemProps("three").onDrop(drag(10));
  assert.deepEqual(plain(saved.units.map((unit) => unit.id)), [
    "one",
    "three",
    "two",
  ]);
  const count = calls.length;
  options.disabled = true;
  const disabled = render();
  disabled.handleProps("one").onDragStart(drag());
  await disabled.itemProps("two").onDrop(drag(90));
  await disabled.handleProps("one").onKeyDown(key("ArrowUp"));
  assert.equal(calls.length, count);
  assert.deepEqual(plain(saved.units.map((unit) => unit.id)), [
    "one",
    "three",
    "two",
  ]);
});

function editorHarness() {
  const storage = hookStorage();
  const root = {
    ...selected(),
    outline: completeOutline("保存大纲"),
    units: [chapter("one", "一", true), chapter("two"), chapter("three")],
  };
  const state = {
    document: root,
    snapshot: { document: root, run_id: 1 },
    viewSnapshot: { document: root },
    selection: section("overview"),
    historical: false,
    busy: false,
    loading: false,
    conflicted: false,
    draft: {
      status: "saved",
      hasPendingChanges: false,
      draft: { document: root, unit: null },
      flush: async () => true,
      setDraft() {},
    },
    getSnapshot: () => state.snapshot,
    action: async (action, extra) => {
      state.commands.push({ action, extra });
      const accepted =
        typeof state.accept === "function"
          ? await state.accept()
          : state.accept;
      if (accepted) {
        state.snapshot = { ...state.snapshot, document: extra.document };
        state.document = extra.document;
        state.viewSnapshot = state.snapshot;
      }
      return accepted;
    },
    openSelection: async (next) => {
      state.selection = next;
      return true;
    },
    commands: [],
    accept: false,
  };
  const proposal = { pending: false, discard() {}, clearSelection() {} };
  const components = {
    WritingOutline: "Outline",
    WritingDialog: "Dialog",
    WritingContent: "Content",
    WritingFeedback: "Feedback",
    WritingControls: "Controls",
    WritingConfirmDialog: "ConfirmDialog",
    WritingEntryDialog: "EntryDialog",
    WritingRuns: "Runs",
    WritingEditorHeader: "Header",
  };
  const overrides = {
    react: storage.react,
    "./use-writing-editor": { useWritingEditor: () => state },
    "./use-writing-proposal": { useWritingProposal: () => proposal },
    "./use-writing-versions": { useWritingVersions: () => ({}) },
    "../shared/detail-dialog": { DetailDialogFrame: "Frame" },
  };
  for (const [module, component] of [
    ["writing-outline", "WritingOutline"],
    ["writing-content", "WritingContent"],
    ["writing-feedback", "WritingFeedback"],
    ["writing-controls", "WritingControls"],
    ["writing-dialog", "WritingConfirmDialog"],
    ["writing-entry-dialog", "WritingEntryDialog"],
    ["writing-runs", "WritingRuns"],
    ["writing-editor-header", "WritingEditorHeader"],
  ])
    overrides[`./${module}`] = { [component]: components[component] };
  overrides["./writing-dialog"].WritingDialog = "Dialog";
  const { WritingEditor } = loader(overrides)(
    path.join(sourceRoot, "writing/writing-editor.tsx"),
  );
  const props = { node: { title: "作品" }, readonly: false, onClose() {} };
  return {
    state,
    proposal,
    props,
    render: () => {
      storage.reset();
      return WritingEditor(props);
    },
  };
}

test("共用确认组合SDK描述、footer和系统按钮，pending禁止关闭与重复操作", () => {
  const sdk = Object.fromEntries(
    [
      "Button",
      "Dialog",
      "DialogContent",
      "DialogHeader",
      "DialogTitle",
      "DialogDescription",
      "DialogFooter",
    ].map((name) => [name, name]),
  );
  const { WritingConfirmDialog } = loader({ "@dever/front-plugin": sdk })(
    path.join(sourceRoot, "writing/writing-dialog.tsx"),
  );
  const tree = WritingConfirmDialog({
    title: "确认更新",
    description: "覆盖手动描述，正文保留。",
    confirmLabel: "确认",
    pending: true,
    onConfirm() {},
    onClose() {},
  });
  assert.equal(tree.props.closeDisabled, true);
  assert.equal(tree.props.described, true);
  assert.equal(
    nodes(tree).filter((node) => node.type === "DialogDescription").length,
    1,
  );
  const footer = nodes(tree).find((node) => node.type === "DialogFooter");
  assert.deepEqual(
    nodes(footer)
      .filter((node) => node.type === "Button")
      .map((node) => node.props.disabled),
    [true, true],
  );
});

test("当前大纲解析只有五字段单源，草稿可保存但缺任一必需区块不解锁章纲", () => {
  const root = { ...selected(), outline: completeOutline() };
  assert.ok(domain.parseWritingDocument(root));
  assert.equal(
    domain.parseWritingDocument({ ...root, outline: "旧大纲", entities: {} }),
    null,
  );
  assert.equal(domain.writingOutlineComplete(root.outline), true);
  for (const id of ["overview", "world"]) {
    const partial = { ...root, outline: { ...root.outline, [id]: "" } };
    assert.ok(domain.parseWritingDocument(partial));
    assert.match(
      workspace.writingActionReason(partial, "generate_chapters"),
      /完整大纲/,
    );
    assert.equal(
      workspace.writingActionReason(partial, "generate_section", {
        section_id: id,
      }),
      "",
    );
  }
  for (const id of ["characters", "locations"]) {
    const partial = { ...root, outline: { ...root.outline, [id]: [] } };
    assert.equal(domain.writingOutlineComplete(partial.outline), false);
    assert.match(workspace.writingActionReason(partial, "append"), /完整大纲/);
  }
  assert.equal(workspace.writingActionReason(root, "generate_chapters"), "");
  assert.equal(root.outline.props.length, 0);
  assert.match(
    workspace.writingCommandImpact(
      { ...root, units: [chapter("one")] },
      "generate_chapters",
    ),
    /大纲资料.*保留/,
  );
});

test("当前文字块的AI只生成或提案该块，结构化流式前缀不修改其他块或解锁持久文档", () => {
  const root = { ...selected(), outline: completeOutline() };
  for (const id of ["overview", "world"]) {
    const input = {
      document: root,
      selection: section(id),
      selectedCharacters: 3,
    };
    const command = ai.writingAICommand(input, "调整当前段", false);
    assert.equal(command.action, "propose_edit");
    assert.equal(command.extra.section_id, id);
    assert.equal(command.extra.document, undefined);
    const empty = { ...root, outline: { ...root.outline, [id]: "" } };
    const creation = ai.writingAICommand(
      { ...input, document: empty, selectedCharacters: 0 },
      "补全",
      false,
    );
    assert.equal(creation.action, "generate_section");
    assert.equal(creation.extra.section_id, id);
    const streamed = stream.projectWritingPreview(root, {
      section_id: id,
      active_field: "content",
      fields: { content: "新前缀" },
    });
    assert.equal(streamed.outline[id], "新前缀");
    assert.equal(root.outline[id], "大纲");
  }
  const empty = { ...selected(), outline: completeOutline("") };
  const preview = stream.projectWritingPreview(empty, {
    active_field: "outline.locations.0.description",
    fields: {
      "outline.overview": "前提",
      "outline.world": "规则",
      "outline.characters.0.name": "主角",
      "outline.characters.0.description": "动机",
      "outline.locations.0.name": "城市",
      "outline.locations.0.description": "环境",
    },
  });
  assert.equal(preview.outline.characters[0].description, "动机");
  assert.equal(preview.outline.locations[0].name, "城市");
  assert.equal(empty.outline.characters.length, 0);
  assert.match(
    workspace.writingActionReason(empty, "generate_chapters"),
    /完整大纲/,
  );
});

test("真实修改hook应用完整文字块只替换该块，人物身份与其他大纲资料不变", async () => {
  const storage = hookStorage();
  const { useWritingProposal } = loader({ react: storage.react })(
    path.join(sourceRoot, "writing/use-writing-proposal.ts"),
  );
  const root = { ...selected(), outline: completeOutline() };
  let value = { document: root, unit: null };
  let writes = 0;
  const editor = {
    selection: section("world"),
    snapshot: {
      document: root,
      run_id: 1,
      work_asset_id: 10,
      work_version_id: 20,
      work_revision: 3,
    },
    draft: {
      draft: value,
      flush: async () => true,
      setDraft: (next) => {
        value = next;
        writes++;
      },
    },
    getSnapshot: () => editor.snapshot,
    action: async (_action, _extra, capture) => {
      if (!capture({ selection: editor.selection, value, unitVersion: 0 }))
        return false;
      editor.snapshot = { ...editor.snapshot, run_id: 2 };
      return true;
    },
  };
  const render = () => {
    storage.reset();
    return useWritingProposal(editor);
  };
  assert.equal(
    await render().run("propose_edit", { section_id: "world" }),
    true,
  );
  editor.snapshot.proposal = {
    run_id: 2,
    work_asset_id: 10,
    work_version_id: 20,
    work_revision: 3,
    section_id: "world",
    replacement: "新世界规则",
  };
  await render().apply();
  assert.equal(writes, 1);
  assert.equal(value.document.outline.world, "新世界规则");
  assert.equal(value.document.outline.overview, "大纲");
  assert.deepEqual(
    plain(value.document.outline.characters),
    root.outline.characters,
  );
});

test("虚拟目录仅真实定位时滚动，元数据刷新不抢位置，跳章等待保存读取成功", () => {
  const storage = hookStorage();
  let scheduled = [];
  const reactive = {
    ...storage.react,
    useEffect(effect, dependencies) {
      const record = storage.react.useRef();
      if (
        !record.current ||
        dependencies.some((value, index) => value !== record.current[index])
      ) {
        record.current = dependencies;
        scheduled.push(effect);
      }
    },
  };
  const { WritingNavigation } = loader({
    react: reactive,
    __globals: {
      ResizeObserver: class {
        observe() {}
        disconnect() {}
      },
    },
  })(path.join(sourceRoot, "writing/writing-navigation.tsx"));
  const indexModule = load(
    path.join(sourceRoot, "writing/writing-chapter-index.ts"),
  );
  const root = {
    ...selected(),
    outline: completeOutline("大纲"),
    units: Array.from({ length: 1000 }, (_, index) =>
      chapter(`c-${index + 1}`),
    ),
  };
  const directory = directoryFor(root);
  directory.focus = { id: "c-500", revision: 1 };
  const locateCalls = [],
    selectionCalls = [];
  directory.locate = (id) => locateCalls.push(id);
  const props = {
    document: root,
    directory,
    selection: { kind: "unit", id: "c-500", tab: "plan" },
    disabled: false,
    mutationDisabled: false,
    chapterOrder: idleOrder,
    onAdd() {},
    onSelect: (next) => selectionCalls.push(next),
  };
  const viewport = { scrollTop: 0, clientHeight: 400 };
  const render = () => {
    storage.reset();
    scheduled = [];
    const tree = WritingNavigation(props);
    nodes(tree).find(
      (node) => node.props?.className === "writing-chapter-viewport",
    ).props.ref.current = viewport;
    for (const effect of scheduled) effect();
    return tree;
  };
  let tree = render();
  assert.equal(viewport.scrollTop, 500 * 74);
  viewport.scrollTop = 12000;
  nodes(tree)
    .find((node) => node.props?.className === "writing-chapter-viewport")
    .props.onScroll({ currentTarget: viewport });
  const refreshedUnits = root.units.map((unit, index) =>
    index === 40 ? { ...unit, has_body: true, version_id: 80 } : unit,
  );
  props.document = { ...root, units: refreshedUnits };
  props.directory = {
    ...directory,
    index: indexModule.writingChapterIndex(refreshedUnits),
  };
  tree = render();
  assert.equal(viewport.scrollTop, 12000);
  nodes(tree)
    .find((node) => node.props?.["aria-label"] === "跳转章号")
    .props.onChange({ target: { value: "750" } });
  tree = render();
  nodes(tree)
    .find((node) => node.type === "form")
    .props.onSubmit({ preventDefault() {} });
  assert.equal(selectionCalls[0].id, "c-750");
  assert.deepEqual(locateCalls, []);
  assert.equal(viewport.scrollTop, 12000);
  nodes(tree)
    .find((node) => node.props?.["aria-label"] === "跳转章号")
    .props.onChange({ target: { value: "500" } });
  tree = render();
  nodes(tree)
    .find((node) => node.type === "form")
    .props.onSubmit({ preventDefault() {} });
  assert.deepEqual(locateCalls, ["c-500"]);
  props.directory = { ...props.directory, focus: { id: "c-500", revision: 2 } };
  render();
  assert.equal(viewport.scrollTop, 500 * 74);
});

test("作品偏好按当前协议读取，未设置沿用需求，非法枚举和字数不被补成有效数据", () => {
  const preferences = load(
    path.join(sourceRoot, "writing/writing-preferences.ts"),
  );
  const root = document();
  const unset = { ...root };
  delete unset.preferences;
  assert.equal(domain.parseWritingDocument(unset), null);
  assert.equal(
    preferences.writingPreferencesSummary(root.preferences),
    "沿用创作要求",
  );
  const configured = {
    genre: "都市悬疑",
    style: "restrained",
    style_instructions: "少用比喻",
    pov: "third_limited",
    mode: "serial",
    chapter_words: 2400,
    planned_chapters: 1000,
  };
  assert.ok(domain.parseWritingDocument({ ...root, preferences: configured }));
  assert.match(
    preferences.writingPreferencesSummary(configured),
    /都市悬疑 · 冷峻克制 · 第三人称限定 · 连载小说/,
  );
  for (const patch of [
    { mode: "single" },
    { pov: "third" },
    { style: "custom" },
    { chapter_words: -1 },
    { planned_chapters: 1.5 },
    { chapter_words: Number.MAX_SAFE_INTEGER + 1 },
  ]) {
    assert.equal(
      domain.parseWritingDocument({
        ...root,
        preferences: { ...configured, ...patch },
      }),
      null,
    );
  }
  const projected = stream.projectWritingPreview(
    { ...root, preferences: configured },
    {
      active_field: "outline.overview",
      fields: { "outline.overview": "新前缀" },
    },
  );
  assert.equal(projected.preferences, configured);
  assert.equal(root.outline.overview, "");
});

test("写作设置取消不写入，保存先flush并使用最新根，失败保留弹窗且不新建版本", async () => {
  const harness = editorHarness();
  let tree = harness.render();
  nodes(tree)
    .find((node) => node.type === "Outline")
    .props.onPreferences();
  tree = harness.render();
  const findDialog = (tree) =>
    nodes(tree).find((node) => node.type?.name === "WritingPreferencesDialog");
  let dialog = findDialog(tree);
  assert.ok(dialog);
  dialog.props.onClose();
  assert.equal(harness.state.commands.length, 0);
  tree = harness.render();
  assert.equal(findDialog(tree), undefined);
  nodes(tree)
    .find((node) => node.type === "Outline")
    .props.onPreferences();
  tree = harness.render();
  dialog = findDialog(tree);
  let flushCalls = 0;
  harness.state.draft.flush = async () => {
    flushCalls++;
    harness.state.snapshot = {
      ...harness.state.snapshot,
      document: { ...harness.state.snapshot.document, title: "刚保存的新标题" },
    };
    return true;
  };
  const preferences = {
    ...emptyPreferences(),
    mode: "serial",
    chapter_words: 2000,
  };
  assert.equal(await dialog.props.onSave(preferences), false);
  assert.equal(flushCalls, 1);
  assert.equal(harness.state.commands[0].action, "save_document");
  assert.equal(
    harness.state.commands[0].extra.document.title,
    "刚保存的新标题",
  );
  assert.deepEqual(
    plain(harness.state.commands[0].extra.document.preferences),
    preferences,
  );
  assert.ok(findDialog(harness.render()));
  harness.state.accept = true;
  assert.equal(
    await findDialog(harness.render()).props.onSave(preferences),
    true,
  );
  assert.equal(harness.state.commands.length, 2);
  assert.ok(
    harness.state.commands.every(
      (command) => command.action === "save_document",
    ),
  );
});

test("写作设置表单保留失败输入并同步防重，取消不提交，运行时禁用", async () => {
  const storage = hookStorage();
  const { WritingPreferencesDialog } = loader({
    react: storage.react,
    "./writing-dialog": { WritingDialog: "PreferencesDialog" },
  })(path.join(sourceRoot, "writing/writing-preferences-dialog.tsx"));
  let saves = 0,
    closed = 0,
    resolve;
  const props = {
    preferences: emptyPreferences(),
    disabled: false,
    onClose: () => closed++,
    onSave: async (fields) => {
      saves++;
      assert.equal(fields.genre, "悬疑");
      return new Promise((accept) => (resolve = accept));
    },
  };
  const render = () => {
    storage.reset();
    return WritingPreferencesDialog(props);
  };
  let tree = render();
  nodes(tree)
    .find((node) => node.props?.["aria-label"] === "题材")
    .props.onChange({ target: { value: "  悬疑  " } });
  tree = render();
  const submit = nodes(tree).find((node) => node.type === "form").props
    .onSubmit;
  const saving = submit({ preventDefault() {} });
  await submit({ preventDefault() {} });
  assert.equal(saves, 1);
  tree = render();
  assert.equal(tree.props.closeDisabled, true);
  assert.equal(
    nodes(tree).find((node) => node.props?.["aria-label"] === "题材").props
      .disabled,
    true,
  );
  resolve(false);
  await saving;
  tree = render();
  assert.equal(closed, 0);
  assert.equal(
    nodes(tree).find((node) => node.props?.["aria-label"] === "题材").props
      .value,
    "  悬疑  ",
  );
  assert.match(text(tree), /未能保存/);
  props.disabled = true;
  await nodes(render())
    .find((node) => node.type === "form")
    .props.onSubmit({ preventDefault() {} });
  assert.equal(saves, 1);
  nodes(render())
    .find((node) => node.type === "button" && text(node) === "取消")
    .props.onClick();
  assert.equal(closed, 1);
});

test("失败检查点的显式目标列表在共享边界解码，打开后可保留原要求重试初始章纲", () => {
  const failed = {
    work_asset_id: 10,
    work_version_id: 20,
    work_revision: 2,
    run_id: 30,
    request_id: "failed-request",
    status: "failed",
    error: "创作结果缺少标题",
    document: { ...selected(), status: "failed", outline: completeOutline() },
    checkpoint: {
      action: "generate_chapters",
      unit_id: "",
      unit_ids: [],
      completed: 0,
      target: 0,
      issued: true,
      instruction: "生成十章",
      count: 10,
    },
  };
  const decoded = domain.writingSnapshotFromOutput(
    JSON.stringify({ writing: failed }),
  );
  assert.ok(decoded);
  assert.equal(decoded.error, failed.error);
  assert.equal(decoded.document.status, "failed");
  assert.deepEqual(plain(decoded.checkpoint.unit_ids), []);
  assert.deepEqual(plain(workspace.writingRetryCommand(decoded)), {
    action: "generate_chapters",
    extra: { instruction: "生成十章", count: 10 },
  });
  for (const unit_ids of [
    null,
    [null],
    [""],
    [" "],
    ["one", "one"],
    { 0: "one" },
    undefined,
  ]) {
    const invalid = domain.parseWritingSnapshot({
      ...failed,
      checkpoint: { ...failed.checkpoint, unit_ids },
    });
    assert.ok(invalid, "无效检查点不妨碍查看已保存文档");
    assert.equal(invalid.checkpoint, undefined);
    assert.equal(
      workspace.writingRetryCommand(invalid),
      null,
      "无效范围不能变成全量生成",
    );
  }
  const scoped = domain.parseWritingSnapshot({
    ...failed,
    document: { ...failed.document, units: [chapter("one"), chapter("two")] },
    checkpoint: {
      ...failed.checkpoint,
      action: "generate_units",
    phase: "body",
      unit_ids: ["one", "two"],
      completed: 1,
      target: 2,
    },
  });
  assert.deepEqual(
    plain(workspace.writingRetryCommand(scoped).extra.unit_ids),
    ["two"],
  );
});

test("运行历史和快照共用检查点解码，非法队列不被修成空列表", async () => {
  const checkpoint = {
    action: "generate_chapters",
    unit_id: "",
    unit_ids: [],
    completed: 0,
    target: 0,
    issued: true,
    instruction: "原要求",
  };
  const records = [[], ["one", "two"], ["one", null]].map(
    (unit_ids, index) => ({
      id: index + 1,
      action: "generate_chapters",
      request_id: `request-${index}`,
      status: "failed",
      error: "保留的失败",
      checkpoint: { ...checkpoint, unit_ids },
    }),
  );
  const api = loader({
    "@dever/front-plugin": {
      joinSiteApi: (value) => value,
      request: async () => ({
        code: 0,
        data: { items: records, has_more: false, before_id: 1 },
      }),
    },
  })(path.join(sourceRoot, "writing/writing-api.ts"));
  const history = await api.fetchWritingRuns({
    projectId: 1,
    canvasId: 2,
    workAssetId: 10,
  });
  assert.deepEqual(plain(history.items[0].checkpoint.unit_ids), []);
  assert.deepEqual(plain(history.items[1].checkpoint.unit_ids), ["one", "two"]);
  assert.equal(history.items[2].checkpoint, undefined);
  assert.ok(history.items.every((run) => run.error === "保留的失败"));
  assert.deepEqual(records[0].checkpoint.unit_ids, [], "边界解析不改动原响应");
});

test("流式活动字段须属于当前可读前缀，不接受缺失活动路径或无关路径", () => {
  const writing_preview = {
    work_asset_id: 10,
    run_id: 20,
    request_id: "request",
    step_request_id: "step",
    active_field: "outline.overview",
    fields: { "outline.overview": "当前情节", "outline.world": "已完成背景" },
  };
  const decoded = domain.writingPreviewFromOutput({ writing_preview });
  assert.equal(decoded.active_field, "outline.overview");
  for (const active_field of [
    undefined,
    null,
    "",
    "outline.unknown",
    "toString",
  ])
    assert.equal(
      domain.writingPreviewFromOutput({
        writing_preview: { ...writing_preview, active_field },
      }),
      null,
    );
  assert.equal(
    domain.writingPreviewFromOutput({
      writing_preview: { ...writing_preview, active_field: "", fields: {} },
    }).active_field,
    "",
  );
  assert.equal(
    domain.writingPreviewFromOutput({
      writing_preview: { ...writing_preview, fields: {} },
    }),
    null,
  );
});

function writingReadHarness() {
  const storage = hookStorage(true);
  const unit = (body) => ({
    type: "writing_unit",
    schema_version: 1,
    profile: "story",
    unit_id: "chapter",
    body,
  });
  const root = (title, version) => ({
    ...selected(),
    title,
    outline: completeOutline(),
    units: [{ ...chapter("chapter", "章纲", true), version_id: version }],
  });
  const current = root("当前作品", 2002);
  const old = root("历史作品", 2001);
  const snapshotRef = {
    current: {
      document: current,
      work_asset_id: 1,
      work_version_id: 20,
      work_revision: 3,
    },
  };
  const mounted = { current: true };
  const responses = new Map([
    [10, { id: 10, version: 1, content: { json: old, writing_revision: 1 } }],
    [2001, { content: unit("历史正文") }],
    [2002, { content: unit("当前正文") }],
  ]);
  const reads = [];
  const errors = [];
  let flush = async () => true;
  let dirty = false;
  let dirtyValue;
  const reportError = (cause) => errors.push(cause.message);
  const setError = () => {};
  const { useWritingEditor } = loader({
    react: storage.react,
    "../space/space-api": {
      fetchSpaceAssetVersionDetail: async ({ versionId }) => {
        reads.push(versionId);
        const result = responses.get(versionId);
        if (result instanceof Error) throw result;
        return typeof result === "function" ? result() : result;
      },
    },
    "./use-writing-snapshot": {
      useWritingSnapshot: () => ({
        snapshot: snapshotRef.current,
        snapshotRef,
        mounted,
        setError,
        reportError,
        loadWork: async () => {},
      }),
    },
    "../shared/use-content-draft": {
      useContentDraft: (options) => ({
        draft: dirty ? dirtyValue : options.value,
        status: dirty ? "dirty" : "saved",
        hasPendingChanges: dirty,
        flush: () => flush(),
      }),
    },
  })(path.join(sourceRoot, "writing/use-writing-editor.ts"));
  const render = () => {
    storage.reset();
    return useWritingEditor({
      projectId: 1,
      canvasId: 1,
      node: { id: "story" },
    });
  };
  return {
    render,
    storage,
    snapshotRef,
    mounted,
    responses,
    reads,
    errors,
    current,
    old,
    setFlush: (next) => {
      flush = next;
    },
    setDirty: (value) => {
      dirty = true;
      dirtyValue = value;
    },
  };
}
const bodySelection = { kind: "unit", id: "chapter", tab: "body" };
const tick = () => new Promise((resolve) => setImmediate(resolve));

test("StrictMode effect 重放后大纲仍初始化，作废的章节读取不阻塞恢复或重复失败请求", async () => {
  const initial = writingReadHarness();
  initial.render();
  initial.storage.runEffects();
  initial.storage.replayEffects();
  await tick();
  assert.deepEqual(plain(initial.render().selection), section("overview"));
  assert.equal(initial.render().document.title, "当前作品");
  assert.equal(initial.render().loading, false);

  for (const fails of [false, true]) {
    const h = writingReadHarness();
    h.render();
    h.storage.runEffects();
    await tick();
    await h.render().openSelection(bodySelection, false);
    h.render();
    h.storage.runEffects();
    h.snapshotRef.current = {
      ...h.snapshotRef.current,
      work_revision: 4,
      document: {
        ...h.current,
        units: [{ ...h.current.units[0], version_id: 2003 }],
      },
    };
    const pending = [];
    h.responses.set(
      2003,
      () => new Promise((resolve, reject) => pending.push({ resolve, reject })),
    );
    h.render();
    h.storage.runEffects();
    h.storage.replayEffects();
    assert.equal(pending.length, 2);
    pending[0].resolve({
      content: { ...h.render().draft.draft.unit, body: "已作废正文" },
    });
    if (fails) pending[1].reject(new Error("正文读取失败"));
    else
      pending[1].resolve({
        content: { ...h.render().draft.draft.unit, body: "恢复正文" },
      });
    await tick();
    for (let i = 0; i < 3; i++) {
      h.render();
      h.storage.runEffects();
      await tick();
    }
    assert.equal(h.render().loading, false);
    assert.equal(
      h.render().draft.draft.unit.body,
      fails ? "当前正文" : "恢复正文",
    );
    assert.deepEqual(h.errors, fails ? ["正文读取失败"] : []);
    assert.equal(h.reads.filter((id) => id === 2003).length, 2);
  }
});

test("历史版本章节读取失败保留当前身份、正文与只读状态，并返回失败", async () => {
  const h = writingReadHarness();
  await h.render().openSelection(bodySelection, false);
  h.responses.set(2001, new Error("历史正文不可用"));
  assert.equal(await h.render().selectVersion(10), false);
  const editor = h.render();
  assert.equal(editor.historical, false);
  assert.equal(editor.viewSnapshot.work_version_id, 20);
  assert.equal(editor.document.title, "当前作品");
  assert.equal(editor.draft.draft.unit.body, "当前正文");
  assert.equal(editor.loading, false);
  assert.equal(editor.busy, false);
  assert.deepEqual(h.errors, ["历史正文不可用"]);
});

test("历史与当前版本成功切换复用正文缓存，返回当前失败保留历史只读视图", async () => {
  const h = writingReadHarness();
  await h.render().openSelection(bodySelection, false);
  assert.equal(await h.render().selectVersion(10), true);
  let editor = h.render();
  assert.equal(editor.historical, true);
  assert.equal(editor.viewSnapshot.work_version_id, 10);
  assert.equal(editor.document.title, "历史作品");
  assert.equal(editor.draft.draft.unit.body, "历史正文");
  // 当前根更新为一个尚未缓存的正文，模拟从历史返回当前时读取失败。
  h.snapshotRef.current = {
    ...h.snapshotRef.current,
    work_revision: 4,
    document: {
      ...h.current,
      units: [{ ...h.current.units[0], version_id: 2003 }],
    },
  };
  h.responses.set(2003, new Error("当前正文不可用"));
  assert.equal(await h.render().selectVersion(20), false);
  editor = h.render();
  assert.equal(editor.historical, true);
  assert.equal(editor.viewSnapshot.work_version_id, 10);
  assert.equal(editor.draft.draft.unit.body, "历史正文");
  h.responses.set(2003, {
    content: { ...editor.draft.draft.unit, body: "新正文" },
  });
  assert.equal(await editor.selectVersion(20), true);
  assert.equal(h.render().draft.draft.unit.body, "新正文");
  const count = h.reads.filter((id) => id === 2001).length;
  assert.equal(await h.render().selectVersion(10), true);
  assert.equal(h.reads.filter((id) => id === 2001).length, count);
  assert.equal(await h.render().selectVersion(20), true);
  assert.equal(h.render().historical, false);
});

test("历史目标章节不存在或未解锁时回到大纲，不遗留当前正文", async () => {
  for (const unavailable of ["missing", "locked"]) {
    const h = writingReadHarness();
    await h.render().openSelection(bodySelection, false);
    h.old.units =
      unavailable === "missing" ? [] : [chapter("chapter", "", false)];
    assert.equal(await h.render().selectVersion(10), true);
    const editor = h.render();
    assert.equal(editor.historical, true);
    assert.deepEqual(plain(editor.selection), section("overview"));
    assert.equal(editor.document.title, "历史作品");
    assert.equal(editor.draft.draft.unit, null);
  }
});

test("当前根自动读取失败只尝试一次，人工重试和新的权威修订仍可恢复", async () => {
  const h = writingReadHarness();
  await h.render().openSelection(bodySelection, false);
  const root = {
    ...h.current,
    units: [{ ...h.current.units[0], version_id: 2003 }],
  };
  h.snapshotRef.current = {
    ...h.snapshotRef.current,
    document: root,
    work_revision: 4,
  };
  h.responses.set(2003, new Error("临时读取失败"));
  for (let i = 0; i < 5; i++) {
    h.render();
    h.storage.runEffects();
    await tick();
  }
  assert.equal(h.reads.filter((id) => id === 2003).length, 1);
  assert.equal(h.render().loading, false);
  assert.equal(h.render().draft.draft.unit.body, "当前正文");
  assert.equal(await h.render().openSelection(bodySelection), false);
  assert.equal(h.reads.filter((id) => id === 2003).length, 2);
  h.responses.set(2003, {
    content: { ...h.render().draft.draft.unit, body: "恢复正文" },
  });
  await h.render().reload();
  assert.equal(h.reads.filter((id) => id === 2003).length, 3);
  assert.equal(h.render().draft.draft.unit.body, "恢复正文");
  h.snapshotRef.current = {
    ...h.snapshotRef.current,
    work_revision: 5,
    document: {
      ...root,
      units: [{ ...root.units[0], version_id: 2004 }],
    },
  };
  h.responses.set(2004, new Error("下个修订读取失败"));
  h.render();
  h.storage.runEffects();
  await tick();
  assert.equal(h.reads.filter((id) => id === 2004).length, 1);
  h.responses.set(2004, {
    content: { ...h.render().draft.draft.unit, body: "新修订正文" },
  });
  h.snapshotRef.current = { ...h.snapshotRef.current, work_revision: 6 };
  h.render();
  h.storage.runEffects();
  await tick();
  assert.equal(h.reads.filter((id) => id === 2004).length, 2);
  assert.equal(h.render().draft.draft.unit.body, "新修订正文");
  h.render();
  h.storage.runEffects();
  await tick();
  assert.equal(h.reads.filter((id) => id === 2004).length, 2);
});

test("保存失败和脏草稿不被版本切换或自动读取覆盖", async () => {
  const h = writingReadHarness();
  await h.render().openSelection(bodySelection, false);
  h.setDirty({
    document: h.current,
    unit: { ...h.render().draft.draft.unit, body: "未保存修改" },
  });
  h.setFlush(async () => false);
  assert.equal(await h.render().selectVersion(10), false);
  h.snapshotRef.current = { ...h.snapshotRef.current, work_revision: 4 };
  h.render();
  h.storage.runEffects();
  await tick();
  assert.deepEqual(h.reads, [2002]);
  assert.equal(h.render().draft.draft.unit.body, "未保存修改");
  assert.equal(h.render().historical, false);
  assert.equal(h.render().busy, false);
});

test("较新的章节读取或卸载使未完成的版本切换失效", async () => {
  for (const interrupt of ["newer-selection", "unmount"]) {
    const h = writingReadHarness();
    await h.render().openSelection(bodySelection, false);
    let finish;
    h.responses.set(
      2001,
      () =>
        new Promise((resolve) => {
          finish = resolve;
        }),
    );
    const selecting = h.render().selectVersion(10);
    await tick();
    if (interrupt === "newer-selection")
      await h.render().openSelection(section("world"), false);
    else {
      h.render();
      h.storage.runEffects();
      h.mounted.current = false;
      h.storage.unmount();
    }
    finish({
      content: {
        type: "writing_unit",
        schema_version: 1,
        profile: "story",
        unit_id: "chapter",
        body: "过期正文",
      },
    });
    assert.equal(await selecting, false);
    assert.equal(h.render().historical, false);
    assert.equal(h.render().viewSnapshot.work_version_id, 20);
    assert.notEqual(h.render().draft.draft.unit?.body, "过期正文");
  }
});
