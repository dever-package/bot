import { loader } from "./writing_test_loader.mjs";
import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";

import { completeOutline, emptyPreferences } from "./writing_fixture.mjs";

const sourceRoot = new URL("../front/src/nodes/body-work/", import.meta.url)
  .pathname;
const load = loader();
const workspace = load(path.join(sourceRoot, "writing/writing-workspace.ts"));
const stream = load(
  path.join(sourceRoot, "writing/writing-stream-projection.ts"),
);
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
const selected = () => ({
  type: "story",
  schema_version: 1,
  preferences: emptyPreferences(),
  title: "作品",
  inspirations: [{ id: "idea-1", title: "方向", content: "灵感" }],
  selected_inspiration_id: "idea-1",
  outline: completeOutline(""),
  units: [],
  archived_units: [],
  status: "ready",
  active_run_id: 0,
  active_request_id: "",
});

const scale = load(path.join(sourceRoot, "writing/writing-chapter-index.ts"));
const draftState = load(
  path.join(sourceRoot, "writing/writing-draft-state.ts"),
);
for (const size of [1000, 5000]) {
  test(`${size} 章目录索引复用、倒序检索、章号定位与30张卡片边界`, () => {
    const units = Array.from({ length: size }, (_, index) =>
      chapter(`章-${index + 1}`),
    );
    const original = units.slice();
    const index = scale.writingChapterIndex(units);
    assert.equal(scale.writingChapterIndex(units), index);
    assert.equal(index.byId.get(`章-${size}`).ordinal, size);
    assert.equal(index.reversed[0].unit, units[size - 1]);
    assert.equal(index.reversed.at(-1).unit, units[0]);
    assert.equal(
      scale
        .writingChapterMatches(index, "  章-99  ")
        .every((row) => row.unit.title.includes("章-99")),
      true,
    );
    const first = scale.writingChapterPage(index.reversed, 0);
    const last = scale.writingChapterPage(index.reversed, 99999);
    assert.equal(first.rows.length, 30);
    assert.equal(first.rows[0].ordinal, size);
    assert.equal(last.rows.at(-1).ordinal, 1);
    assert.equal(last.rows.length <= 30, true);
    for (const scrollTop of [0, 740, size * 74 - 500]) {
      const window = scale.writingChapterWindow(size, scrollTop, 500);
      assert.equal(window.end - window.start <= 14, true);
      assert.equal(window.height, size * 74);
    }
    assert.deepEqual(units, original);
    const changed = units.map((unit, offset) =>
      offset === 20 ? { ...unit, title: "新标题" } : unit,
    );
    assert.notEqual(scale.writingChapterIndex(changed), index);
    assert.equal(
      scale.writingChapterIndex(changed).byId.get("章-21").unit.title,
      "新标题",
    );
  });
}

test("正文指纹按不可变文档身份缓存，仅序列化新文档；原文恢复与修改都可辨别", () => {
  const document = {
    ...selected(),
    units: Array.from({ length: 5000 }, (_, i) => chapter(`c-${i}`)),
  };
  let serializations = 0;
  Object.defineProperty(document, "toJSON", {
    value() {
      serializations += 1;
      return { ...this };
    },
  });
  const value = { document, unit: { body: "原文" } };
  const original = draftState.writingDraftFingerprint(value);
  const edited = draftState.writingDraftFingerprint({
    ...value,
    unit: { body: "修改" },
  });
  assert.notEqual(original, edited);
  assert.equal(draftState.writingDraftFingerprint(value), original);
  assert.equal(serializations, 1);
  const changed = { ...document, title: "标题已变" };
  assert.notEqual(
    draftState.writingDraftFingerprint({ ...value, document: changed }),
    original,
  );
});

test("正文缓存最多20个已保存版本，读取提升优先级，淘汰后重新读取，不缓存草稿", () => {
  const cache = draftState.createWritingUnitCache();
  for (let id = 1; id <= 20; id++) cache.set(id, { body: `body-${id}` });
  assert.equal(cache.get(1).body, "body-1");
  cache.set(21, { body: "body-21" });
  assert.equal(cache.get(2), undefined);
  assert.equal(cache.get(1).body, "body-1");
  cache.delete(1);
  assert.equal(cache.get(1), undefined);
  for (let id = 22; id <= 5000; id++) cache.set(id, { body: `body-${id}` });
  let retained = 0;
  for (let id = 1; id <= 5000; id++) if (cache.get(id)) retained += 1;
  assert.equal(retained, 20);
});

test("正文批次是首个未写位置起连续块，数量最多10，遇已写中断且不取散列章节", () => {
  const units = Array.from({ length: 30 }, (_, i) =>
    chapter(`c-${i + 1}`, "章纲", i < 5 || i === 9),
  );
  assert.deepEqual(
    plain(scale.writingContinuationBatch(units).map((row) => row.ordinal)),
    [6, 7, 8, 9],
  );
  assert.deepEqual(
    plain(scale.writingContinuationBatch(units, 1).map((row) => row.ordinal)),
    [6],
  );
  const updated = units.map((unit, index) =>
    index === 9 ? { ...unit, has_body: false } : unit,
  );
  assert.equal(scale.writingContinuationBatch(updated).length, 10);
  const root = {
    ...selected(),
    outline: completeOutline("保存"),
    units: updated,
  };
  root.units[29].plan = "";
  assert.equal(
    workspace.writingActionReason(root, "generate_units", { mode: "continue" }),
    "",
  );
});

test("大目录章纲必须限定当前页IDs，失败重试保持原页，不随新浏览页扩大", () => {
  const root = {
    ...selected(),
    outline: completeOutline("保存"),
    units: Array.from({ length: 5000 }, (_, i) => chapter(`c-${i + 1}`)),
  };
  assert.match(
    workspace.writingActionReason(root, "generate_chapters", { unit_ids: [] }),
    /没有可更新/,
  );
  assert.match(
    workspace.writingActionReason(root, "generate_chapters"),
    /当前页/,
  );
  const ids = root.units.slice(90, 120).map((unit) => unit.id);
  assert.equal(
    workspace.writingActionReason(root, "generate_chapters", { unit_ids: ids }),
    "",
  );
  assert.match(
    workspace.writingCommandImpact(root, "generate_chapters", {
      unit_ids: ids,
    }),
    /30.*章纲.*衔接/,
  );
  const retry = workspace.writingRetryCommand({
    document: { ...root, status: "failed" },
    checkpoint: { action: "generate_chapters", unit_ids: ids, completed: 0 },
  });
  assert.deepEqual(plain(retry.extra.unit_ids), ids);
});

test("局部章纲流索引映射checkpoint IDs，不覆盖第1章/非目标章，错误ID和越界字段不扩容", () => {
  const root = {
    ...selected(),
    outline: completeOutline("保存"),
    units: Array.from({ length: 1000 }, (_, i) => chapter(`c-${i + 1}`)),
  };
  const preview = {
    active_field: "units.2.plan",
    fields: {
      "units.0.title": "第401章新标题",
      "units.1.plan": "新章纲",
      "units.2.plan": "不允许扩容",
    },
  };
  const projected = stream.projectWritingPreview(
    root,
    preview,
    "generate_chapters",
    ["c-401", "c-703"],
  );
  assert.equal(projected.units[400].title, "第401章新标题");
  assert.equal(projected.units[702].plan, "新章纲");
  assert.deepEqual(plain(projected.units[0]), plain(root.units[0]));
  assert.equal(projected.units.length, 1000);
  assert.equal(root.units[400].title, "c-401");
  const missing = stream.projectWritingPreview(
    root,
    preview,
    "generate_chapters",
    ["gone"],
  );
  assert.deepEqual(plain(missing), plain(root));
});
