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
const documents = loadSource(
  path.join(sourceRoot, "writing/writing-document.ts"),
);
const { writingStagePreview, writingPreviewState } = loadSource(
  path.join(sourceRoot, "writing/writing-preview-state.ts"),
);
const { projectWritingPreview } = loadSource(
  path.join(sourceRoot, "writing/writing-stream-projection.ts"),
);

function document() {
  return {
    type: "story",
    schema_version: 1,
    preferences: emptyPreferences(),
    title: "故事",
    inspirations: [{ id: "idea", title: "灵感", content: "已选灵感内容" }],
    selected_inspiration_id: "idea",
    outline: completeOutline(""),
    units: [],
    archived_units: [],
    status: "ready",
    active_run_id: 0,
    active_request_id: "",
  };
}
function chapter(index, hasBody = false) {
  return {
    id: `chapter-${index}`,
    title: `章节 ${index}`,
    plan: `章纲 ${index}`,
    unit_type: "chapter",
    children: [],
    asset_id: 0,
    version_id: 0,
    has_body: hasBody,
    continuity_valid: false,
    dependency_stale: false,
  };
}
function snapshot(root, version = 20, revision = 3) {
  return {
    work_asset_id: 10,
    work_version_id: version,
    work_revision: revision,
    document: root,
    run_id: 0,
    request_id: "",
    status: root.status,
  };
}

test("selected inspiration stays fixed through outline and prose previews", () => {
  const root = document();
  assert.equal(writingStagePreview(root).inspiration.content, "已选灵感内容");
  root.outline = completeOutline("真实大纲");
  const projected = projectWritingPreview(root, {
    active_field: "outline.overview",
    fields: { "outline.overview": "流式新大纲" },
  });
  const preview = writingStagePreview(projected);
  assert.equal(preview.inspiration.title, "灵感");
  assert.equal(preview.inspiration.content, "已选灵感内容");
  assert.equal(preview.label, "大纲完成");
  assert.equal(root.outline.overview, "真实大纲");
  root.selected_inspiration_id = "";
  assert.equal(writingStagePreview(root).inspiration, undefined);
});

test("chapter totals use every saved chapter and never expose plans or stage commands", () => {
  const root = {
    ...document(),
    outline: completeOutline("大纲"),
    units: Array.from({ length: 30 }, (_, index) => chapter(index, index < 12)),
  };
  const initial = writingStagePreview(root);
  assert.equal(initial.leaves, 30);
  assert.equal(initial.completed, 12);
  assert.equal(initial.label, "章纲完成");
  assert.deepEqual(Object.keys(initial).sort(), [
    "completed",
    "inspiration",
    "label",
    "leaves",
  ]);
  root.units.forEach((unit) => {
    unit.has_body = true;
  });
  assert.equal(writingStagePreview(root).label, "正文完成");
  assert.equal(writingStagePreview(root).completed, 30);
  assert.equal(root.units.length, 30);
});

test("only active prose checkpoints contribute task counts and errors do not replace the chosen inspiration", () => {
  const root = { ...document(), status: "running" };
  const current = {
    ...snapshot(root),
    run_id: 8,
    checkpoint: { action: "generate_units", target: 5, completed: 2 },
  };
  const input = {
    snapshot: current,
    running: false,
    loading: false,
    failure: "旧错误",
    stopping: false,
  };
  const active = writingPreviewState(input);
  assert.equal(active.target, 5);
  assert.equal(active.committed, 2);
  assert.equal(active.failure, "");
  current.checkpoint.action = "generate_outline";
  assert.equal(writingPreviewState(input).target, 0);
  root.status = "failed";
  assert.equal(writingPreviewState(input).label, "生成未完成");
  assert.equal(writingPreviewState(input).committed, 0);
  assert.equal(writingStagePreview(root).inspiration.content, "已选灵感内容");
});

test("pending commands are submission state and stop keeps its distinct state", () => {
  const input = {
    snapshot: snapshot(document()),
    running: true,
    loading: false,
    failure: "",
    stopping: false,
  };
  assert.equal(writingPreviewState(input).label, "提交中");
  assert.equal(
    writingPreviewState({ ...input, stopping: true }).label,
    "正在停止",
  );
  assert.equal(
    writingPreviewState({ ...input, running: false }).label,
    "准备大纲",
  );
});

test("the new saved root/revision wins over an old output or canvas result reference", () => {
  const old = snapshot(document());
  const saved = { ...document(), outline: completeOutline("新根大纲") };
  const node = {
    resultRef: { asset_id: 10, version_id: 20 },
    asset: {
      id: 10,
      version_id: 21,
      version: { id: 21, content: { json: saved, writing_revision: 1 } },
    },
  };
  assert.equal(
    documents.writingSnapshotFromNode(node, old).document.outline.overview,
    "新根大纲",
  );
  node.asset.version_id = 20;
  node.asset.version.id = 20;
  node.asset.version.content.writing_revision = 4;
  assert.equal(
    documents.writingSnapshotFromNode(node, old).document.outline.overview,
    "新根大纲",
  );
  assert.equal(documents.writingSnapshotFromNode(node, old).work_revision, 4);
});

// 执行真实尺寸拥有者，避免为测试导出画布私有函数或加载整个页面。
function sourceDeclarations(filename, names) {
  const source = ts.createSourceFile(
    filename,
    readFileSync(filename, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  return source.statements
    .filter((statement) =>
      names.some(
        (name) =>
          statement.name?.text === name ||
          (ts.isVariableStatement(statement) &&
            statement.declarationList.declarations.some(
              (entry) => entry.name.getText(source) === name,
            )),
      ),
    )
    .map((statement) => statement.getText(source))
    .join("\n");
}
const modelSource = sourceDeclarations(
  path.join(sourceRoot, "space/space-model.ts"),
  [
    "DEFAULT_WRITING_PREVIEW_SIZE",
    "writingNodeDefaultSize",
    "hasDefaultCanvasNodeSize",
    "nodeDefaultSize",
    "powerNodeDefaultSize",
  ],
);
const pageSource = sourceDeclarations(
  path.join(sourceRoot, "space/space-page.tsx"),
  [
    "canvasNodeStyleSize",
    "canvasWritingDocument",
    "stableFlowNodeSize",
    "defaultCanvasMediaGridSize",
    "nodeUsesComposerSettings",
  ],
);
const sizeExports = {};
const power = loadSource(path.join(sourceRoot, "shared/power-presentation.ts"));
runInNewContext(
  ts.transpileModule(
    `${modelSource}\n${pageSource}\nexports.canvasNodeStyleSize = canvasNodeStyleSize; exports.stableFlowNodeSize = stableFlowNodeSize; exports.nodeUsesComposerSettings = nodeUsesComposerSettings;`,
    {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
      },
    },
  ).outputText,
  { exports: sizeExports, ...documents, ...power },
);

test("real canvas owner projects stage height, preserves manual bounds and supplies stable edge dimensions", () => {
  const root = document();
  root.selected_inspiration_id = "";
  const node = {
    type: "power",
    power: { outputType: "story" },
    width: 560,
    height: 520,
    asset: {
      id: 10,
      version_id: 20,
      version: { id: 20, content: { json: root, writing_revision: 3 } },
    },
  };
  assert.equal(sizeExports.canvasNodeStyleSize(node).height, 520);
  root.selected_inspiration_id = "idea";
  const compact = sizeExports.canvasNodeStyleSize(node);
  assert.equal(compact.width, 560);
  assert.equal(compact.height, 210);
  root.outline = completeOutline("流式内容反复增长".repeat(500));
  assert.equal(sizeExports.canvasNodeStyleSize(node).height, 210);
  const projected = sizeExports.stableFlowNodeSize(compact);
  assert.equal(projected.initialHeight, 210);
  assert.equal(projected.measured.height, 210);
  const manual = sizeExports.canvasNodeStyleSize({
    ...node,
    width: 630,
    height: 380,
  });
  assert.equal(manual.width, 630);
  assert.equal(manual.height, 380);
  root.selected_inspiration_id = "";
  assert.equal(sizeExports.canvasNodeStyleSize(node).height, 520);
});

test("composer owner hides only selected stories using the latest saved revision", () => {
  const root = document();
  root.selected_inspiration_id = "";
  const node = {
    type: "power",
    outputType: "story",
    resultRef: { asset_id: 10, version_id: 20 },
    resultOutput: snapshot(root),
  };
  assert.equal(sizeExports.nodeUsesComposerSettings(node), true);
  const selected = { ...root, selected_inspiration_id: "idea" };
  const updated = {
    ...node,
    asset: {
      id: 10,
      version_id: 20,
      version: { id: 20, content: { json: selected, writing_revision: 4 } },
    },
  };
  assert.equal(sizeExports.nodeUsesComposerSettings(updated), false);
  assert.equal(
    sizeExports.nodeUsesComposerSettings({ ...updated, readonly: true }),
    false,
  );
  assert.equal(
    sizeExports.nodeUsesComposerSettings({ ...node, readonly: true }),
    true,
  );
  assert.equal(
    sizeExports.nodeUsesComposerSettings({ ...updated, outputType: "image" }),
    true,
  );
  assert.equal(
    sizeExports.nodeUsesComposerSettings({ ...updated, outputType: "video" }),
    true,
  );
  assert.equal(
    sizeExports.nodeUsesComposerSettings({
      ...updated,
      outputType: "storyboard",
    }),
    true,
  );
  assert.equal(
    sizeExports.nodeUsesComposerSettings({
      ...updated,
      outputType: "video_compose",
    }),
    false,
  );
  assert.equal(
    sizeExports.nodeUsesComposerSettings({ ...updated, type: "agent" }),
    true,
  );
  assert.equal(
    sizeExports.nodeUsesComposerSettings({ ...updated, type: "asset" }),
    false,
  );
  assert.equal(
    sizeExports.nodeUsesComposerSettings({ ...updated, type: "function" }),
    false,
  );
  const newerUnselected = { ...snapshot(root), work_revision: 5 };
  assert.equal(
    sizeExports.nodeUsesComposerSettings({
      ...updated,
      resultOutput: newerUnselected,
    }),
    true,
  );
});
