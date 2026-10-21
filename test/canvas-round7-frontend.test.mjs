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
const baseline = process.env.CANVAS_ROUND7_BASELINE_ROOT;
const plain = (value) => JSON.parse(JSON.stringify(value));

// 与既有几何测试一致，加载真实 owner，隔离 React/网络；不导出生产私有函数。
function sourceModule(path, bindings = {}, names, expose = []) {
  const source = ts.createSourceFile(
    path,
    readFileSync(path, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    path.endsWith("tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const selected = names
    ? source.statements.filter(
        (statement) =>
          ts.isFunctionDeclaration(statement) &&
          names.includes(statement.name?.text),
      )
    : source.statements.filter(
        (statement) => !ts.isImportDeclaration(statement),
      );
  if (names)
    assert.equal(selected.length, names.length, `missing functions in ${path}`);
  const output = ts.transpileModule(
    selected.map((statement) => statement.getText(source)).join("\n"),
    {
      compilerOptions: {
        target: ts.ScriptTarget.ES2022,
        module: ts.ModuleKind.CommonJS,
        jsx: ts.JsxEmit.ReactJSX,
      },
    },
  ).outputText;
  const exports = {};
  return runInNewContext(
    output +
      (names
        ? `\n({${names.join(",")}});`
        : `\nObject.assign(exports, {${expose.join(",")}});`),
    { exports, ...bindings },
  );
}

const dependencyModules = new Map();
function dependency(path) {
  if (dependencyModules.has(path)) return dependencyModules.get(path);
  const source = ts.transpileModule(readFileSync(path, "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
    },
  }).outputText;
  const exports = {};
  dependencyModules.set(path, exports);
  runInNewContext(source, {
    exports,
    require: (specifier) =>
      dependency(resolve(dirname(path), `${specifier}.ts`)),
  });
  return exports;
}
const { writingReferenceItems } = dependency(
  resolve(space, "../writing/writing-reference.ts"),
);
const runner = dependency(resolve(space, "space-runner.ts"));
const { canvasNodeHasMaterialSlot } = sourceModule(
  resolve(space, "space-model.ts"),
  {},
  ["canvasNodeHasMaterialSlot"],
);
const assets = sourceModule(resolve(space, "space-asset-index.ts"), {
  canvasNodeHasMaterialSlot,
});
let writingParses = 0;
const references = sourceModule(resolve(space, "space-composer-reference.ts"), {
  writingReferenceItems: (item) => {
    writingParses++;
    return writingReferenceItems(item);
  },
  sameCanvasAssetPreview: assets.sameCanvasAssetPreview,
});
const oldAssets =
  baseline &&
  sourceModule(resolve(baseline, "space-asset-index.ts"), {
    canvasNodeHasMaterialSlot,
  });
const oldReferences =
  baseline &&
  sourceModule(resolve(baseline, "space-composer-reference.ts"), {
    writingReferenceItems,
  });

const preview = (text = "", extra = {}) => ({
  text,
  imageUrl: "",
  videoUrl: "",
  audioUrl: "",
  fileUrl: "",
  ...extra,
});
function fixture() {
  const materialAsset = {
    id: 11,
    canvas_id: 1,
    asset_cate_id: 2,
    role: "material",
    node_key: "material",
    kind: "image",
    name: "素材",
    version: { id: 21, content: { image: "/old.png" } },
  };
  const work = {
    id: 12,
    canvas_id: 1,
    asset_cate_id: 2,
    role: "work",
    kind: "text",
    name: "故事",
    version: {
      id: 22,
      content: {
        type: "story",
        schema_version: 1,
        title: "故事",
        selected_inspiration_id: "",
        inspirations: [],
        outline: { overview: "", world: "", storylines: "", structure: "", characters: [], locations: [], props: [] },
        units: [
          {
            id: "chapter",
            unit_type: "chapter",
            plan: "",
            title: "第一章",
            has_body: true,
            children: [],
          },
        ],
      },
    },
  };
  const material = {
    id: "material",
    type: "power",
    title: "素材节点",
    kind: "image",
    groupId: "group",
    asset: materialAsset,
    resultOutput: materialAsset.version.content,
    x: 0,
    y: 0,
  };
  const group = {
    id: "group",
    type: "group",
    title: "分组",
    group: { sourceNodeId: "origin" },
  };
  const origin = { id: "origin", type: "asset", title: "来源" };
  const unrelated = {
    id: "draft",
    type: "power",
    title: "无结果草稿",
    composerDraft: { prompt: "old" },
  };
  return {
    materialAsset,
    work,
    material,
    group,
    origin,
    unrelated,
    nodes: [material, group, origin, unrelated],
    projectAssets: [work, materialAsset],
  };
}
function input(f, counters = { node: 0, asset: 0 }) {
  return {
    nodes: f.nodes,
    assets: f.projectAssets,
    canvasId: 1,
    assetCateId: 2,
    nodeOutput: (node) => node.resultOutput,
    nodePreview: (node) => {
      counters.node++;
      return preview("", { imageUrl: node.resultOutput?.image || "" });
    },
    assetPreview: (asset) => {
      counters.asset++;
      return preview(asset.name);
    },
    nodeHasResult: (node) => Boolean(node.resultOutput),
  };
}
function assertOldProjection(source, entries, items) {
  if (!oldAssets) return;
  const expected = oldAssets.buildCanvasAssetIndex(source);
  assert.deepEqual(plain(entries), plain(expected));
  assert.deepEqual(
    plain(items),
    plain(oldReferences.buildCanvasReferenceItems(expected)),
  );
}

test("unrelated drafts and positions retain asset/reference identity and skip existing preview parsing", () => {
  const f = fixture();
  const counters = { node: 0, asset: 0 };
  let entries = assets.buildCanvasAssetIndex(input(f, counters));
  let items = references.buildCanvasReferenceItems(entries);
  assert.ok(items.some((item) => item.id === "12:unit:chapter"));
  const oldEntries = entries,
    oldItems = items;
  const initialWritingParses = writingParses;
  counters.node = counters.asset = 0;
  f.nodes = f.nodes.map((node) =>
    node === f.unrelated
      ? { ...node, x: 50, composerDraft: { prompt: "new" } }
      : node,
  );
  entries = assets.buildCanvasAssetIndex(input(f, counters), entries);
  items = references.buildCanvasReferenceItems(entries, items);
  assert.equal(entries, oldEntries);
  assert.equal(items, oldItems);
  assert.equal(counters.asset, 0);
  assert.equal(
    counters.node,
    1,
    "only the unversioned edited draft needs parsing",
  );
  assertOldProjection(input(f), entries, items);
  f.nodes = f.nodes.map((node) =>
    node === f.material ? { ...node, x: 75 } : node,
  );
  entries = assets.buildCanvasAssetIndex(input(f), entries);
  assert.notEqual(entries, oldEntries, "entry.node stays current");
  assert.equal(entries[1].node.x, 75);
  assert.equal(references.buildCanvasReferenceItems(entries, items), oldItems);
  assert.equal(
    writingParses,
    initialWritingParses,
    "unchanged references do not reparse writing documents",
  );
  assertOldProjection(input(f), entries, oldItems);
});

test("error hook derives current SDK authentication scope and ignores results after unmount", async () => {
  const { createInFlightRequestLoader } = dependency(
    resolve(space, "../shared/in-flight-request.ts"),
  );
  let authentication = { user: { id: 1 }, accessToken: "first-session" };
  let userScope = "user:1",
    apiScope = "/site-one/workspace/canvas_execution";
  const pending = [],
    cleanups = [],
    stateUpdates = [];
  const owner = sourceModule(resolve(space, "space-run-error.ts"), {
    ...runner,
    createInFlightRequestLoader,
    useAuthStore: (selector) => selector({ auth: authentication }),
    useAuthUserScopeKey: () => userScope,
    joinSiteApi: () => apiScope,
    useState: (initial) => [initial, (value) => stateUpdates.push(value)],
    useEffect: (effect) => cleanups.push(effect()),
    fetchSpaceCanvasExecution: () =>
      new Promise((resolve) => pending.push(resolve)),
  });
  const node = (id) => ({
    id,
    runError: "节点运行失败",
    resultRef: { execution_id: 5 },
  });
  owner.useCanvasNodeRunError(1, node("a"));
  owner.useCanvasNodeRunError(1, node("b"));
  await Promise.resolve();
  assert.equal(pending.length, 1);
  cleanups.splice(0).forEach((cleanup) => cleanup());
  authentication = { ...authentication, accessToken: "second-session" };
  owner.useCanvasNodeRunError(1, node("a"));
  await Promise.resolve();
  assert.equal(
    pending.length,
    2,
    "a new session for the same user starts a separate request",
  );
  userScope = "user:2";
  owner.useCanvasNodeRunError(1, node("a"));
  apiScope = "/site-two/workspace/canvas_execution";
  owner.useCanvasNodeRunError(1, node("a"));
  await Promise.resolve();
  assert.equal(pending.length, 4);
  stateUpdates.length = 0;
  pending.forEach((resolve, index) =>
    resolve({ error: `scope-error-${index}` }),
  );
  for (let step = 0; step < 10; step++) await Promise.resolve();
  assert.equal(
    stateUpdates.includes("scope-error-0"),
    false,
    "unmounted notices ignore late results",
  );
  assert.ok(stateUpdates.includes("scope-error-1"));
  cleanups.forEach((cleanup) => cleanup());
});

test("same-version content, writing chapters, titles, group paths, posters, scope and order refresh real references", () => {
  const changes = [
    (f) => {
      f.projectAssets = [{ ...f.work, name: "改名" }, f.materialAsset];
    },
    (f) => {
      f.projectAssets = [
        {
          ...f.work,
          version: {
            ...f.work.version,
            content: {
              ...f.work.version.content,
              units: [
                {
                  ...f.work.version.content.units[0],
                  id: "chapter-2",
                  title: "第二章",
                },
              ],
            },
          },
        },
        f.materialAsset,
      ];
    },
    (f) => {
      f.projectAssets = [
        { ...f.work, version: { ...f.work.version, id: 23 } },
        f.materialAsset,
      ];
    },
    (f) => {
      f.nodes = f.nodes.map((node) =>
        node === f.material ? { ...node, title: "素材新标题" } : node,
      );
    },
    (f) => {
      f.nodes = f.nodes.map((node) =>
        node === f.material
          ? { ...node, resultOutput: { image: "/new.png" } }
          : node,
      );
    },
    (f) => {
      f.projectAssets = [{ ...f.work, role: "material" }, f.materialAsset];
    },
    (f) => {
      f.projectAssets = [{ ...f.work, status: "archived" }, f.materialAsset];
    },
  ];
  for (const change of changes) {
    const f = fixture();
    const before = assets.buildCanvasAssetIndex(input(f));
    const beforeItems = references.buildCanvasReferenceItems(before);
    change(f);
    const source = input(f);
    const next = assets.buildCanvasAssetIndex(source, before);
    const nextItems = references.buildCanvasReferenceItems(next, beforeItems);
    assert.notEqual(nextItems, beforeItems);
    assert.ok(
      nextItems.some((item) => beforeItems.includes(item)),
      "a genuine change retains unaffected reference entries",
    );
    assertOldProjection(source, next, nextItems);
  }
  const f = fixture(),
    before = assets.buildCanvasAssetIndex(input(f));
  const beforeItems = references.buildCanvasReferenceItems(before);
  f.nodes = f.nodes.map((node) =>
    node === f.group ? { ...node, title: "新分组" } : node,
  );
  const next = assets.buildCanvasAssetIndex(input(f), before);
  assert.equal(next[1].sourcePath, "来源 / 新分组");
  assert.equal(
    references.buildCanvasReferenceItems(next, beforeItems),
    beforeItems,
  );
  const extra = { ...f.work, id: 13, name: "另一个作品" };
  f.projectAssets = [f.work, extra, f.materialAsset];
  const ordered = assets.buildCanvasAssetIndex(input(f), next);
  const orderedItems = references.buildCanvasReferenceItems(
    ordered,
    beforeItems,
  );
  f.projectAssets = [extra, f.work, f.materialAsset];
  const reordered = assets.buildCanvasAssetIndex(input(f), ordered);
  const reorderedItems = references.buildCanvasReferenceItems(
    reordered,
    orderedItems,
  );
  assert.notEqual(reordered, ordered);
  assert.notEqual(reorderedItems, orderedItems);
  assert.equal(reordered[0], ordered[1]);
  assertOldProjection(input(f), reordered, reorderedItems);
  const posterEntries = ordered.map((entry) =>
    entry.key === "asset:12"
      ? {
          ...entry,
          preview: preview("故事", { videoPosterUrl: "/poster.png" }),
        }
      : entry,
  );
  assert.notEqual(
    references.buildCanvasReferenceItems(posterEntries, orderedItems),
    orderedItems,
  );
  const otherScope = { ...input(f), canvasId: 99 };
  const scoped = assets.buildCanvasAssetIndex(otherScope, reordered);
  assert.equal(
    scoped.length,
    1,
    "existing node.asset fallback remains available",
  );
  assertOldProjection(
    otherScope,
    scoped,
    references.buildCanvasReferenceItems(scoped, reorderedItems),
  );
});

const connectionNames = [
  "buildCanvasConnectionIndex",
  "canvasEdgeNodeIDs",
  "nodeInputContextLine",
];
function connectionOwner(path) {
  return sourceModule(
    path,
    {
      canvasEdgeCarriesMedia: (edge) => edge.purpose === "media",
      isCanvasMediaReferenceNode: (node) => node.kind === "video",
      nodeInputContextSource: (node, ready) =>
        ready
          ? {
              nodeId: node.id,
              title: node.title,
              output: node.resultOutput,
              preview: preview(node.resultOutput),
            }
          : null,
      stringifyContextValue: String,
    },
    connectionNames,
  ).buildCanvasConnectionIndex;
}
const connections = connectionOwner(resolve(space, "space-page.tsx"));
const oldConnections =
  baseline && connectionOwner(resolve(baseline, "space-page.tsx"));
function connectionInput(nodes, edges) {
  const lookup = {
    nodeById: new Map(nodes.map((node) => [node.id, node])),
    groupMembersById: new Map([
      ["group", nodes.filter((node) => node.groupId === "group")],
    ]),
    hasResultByNodeId: new Map(
      nodes.map((node) => [node.id, Boolean(node.resultOutput)]),
    ),
  };
  return [nodes, edges, lookup, ""];
}
test("incoming lists preserve untouched sources while source/output, usage, endpoints, group order and removals refresh", () => {
  const source = {
    id: "source",
    title: "视频",
    kind: "video",
    resultOutput: "/video.mp4",
    groupId: "group",
  };
  const other = {
    id: "other",
    title: "第二视频",
    kind: "video",
    resultOutput: "/other.mp4",
    groupId: "group",
  };
  const target = { id: "target" },
    draft = { id: "draft" },
    group = { id: "group", type: "group" };
  const edge = {
    id: "edge",
    from: "group",
    to: "target",
    purpose: "media",
    mediaUsage: "reference",
  };
  const nodes = [source, other, target, draft, group];
  const previous = connections(...connectionInput(nodes, [edge]));
  const list = previous.incomingMediaReferencesByNodeId.get("target");
  for (const [nextNodes, nextEdges, unchanged] of [
    [
      nodes.map((node) =>
        node === draft
          ? { ...draft, x: 30, composerDraft: { prompt: "new" } }
          : node,
      ),
      [edge],
      true,
    ],
    [
      nodes.map((node) =>
        node === source ? { ...source, title: "新标题" } : node,
      ),
      [edge],
      false,
    ],
    [
      nodes.map((node) =>
        node === source ? { ...source, resultOutput: "/new.mp4" } : node,
      ),
      [edge],
      false,
    ],
    [nodes, [{ ...edge, mediaUsage: "firstFrame" }], false],
    [nodes, [{ ...edge, logicalFrom: "source" }], false],
    [[other, source, target, draft, group], [edge], false],
    [nodes, [], false],
    [nodes, [{ ...edge, purpose: "execute" }], false],
    [nodes, [{ ...edge, logicalTo: "draft" }], false],
  ]) {
    const args = connectionInput(nextNodes, nextEdges);
    const next = connections(...args, previous);
    assert.equal(
      next.incomingMediaReferencesByNodeId.get("target") === list,
      unchanged,
    );
    if (oldConnections) {
      const original = oldConnections(...args);
      assert.deepEqual(
        plain([...next.incomingMediaReferencesByNodeId]),
        plain([...original.incomingMediaReferencesByNodeId]),
      );
      assert.deepEqual(
        plain([...next.inputContextByNodeId]),
        plain([...original.inputContextByNodeId]),
      );
    }
  }
});

const edgeNames = [
  "decorateFlowEdge",
  "flowEdgeDecoration",
  "nodeHighlightColor",
];
function edgeOwner(path) {
  return sourceModule(
    path,
    {
      isCanvasFunctionNode: (node, key) => node?.function?.key === key,
      canvasNodeStopsExecution: (node) => node.stop === true,
    },
    edgeNames,
  );
}
const edgeFunctions = edgeOwner(resolve(space, "space-page.tsx"));
const oldEdgeFunctions =
  baseline && edgeOwner(resolve(baseline, "space-page.tsx"));
test("only changed edge semantics invalidate identity; path highlighting, callbacks and all endpoints remain intact", () => {
  const nodes = new Map([
    ["start", { id: "start", type: "function", function: { key: "start" } }],
    ["a", { id: "a", type: "power" }],
    ["b", { id: "b", type: "asset", stop: true }],
  ]);
  const canvasEdges = [
    { id: "ab", from: "start", to: "a" },
    { id: "bc", from: "a", to: "b" },
    { id: "after", from: "b", to: "end" },
  ];
  const { createCanvasHighlightedPaths } = dependency(
    resolve(space, "space-highlight-path.ts"),
  );
  const paths = createCanvasHighlightedPaths();
  paths.update([...nodes.values()].map((node) => ({
    ...node,
    functionOption: node.id === "start" ? { key: "start" }
      : node.stop ? { key: "save" } : undefined,
    type: node.stop ? "function" : node.type,
  })), canvasEdges);
  assert.deepEqual([...paths.get("start")], ["ab", "bc"]);
  const edge = {
    id: "ab",
    source: "start",
    sourceHandle: "output-0",
    target: "a",
    targetHandle: "input-0",
    type: "animated",
    animated: false,
    data: {
      physicalFrom: "start",
      physicalTo: "a",
      logicalFrom: "a",
      logicalTo: "b",
      purpose: "media",
      executionMode: "parallel",
      mediaUsage: "reference",
      bindingLabel: "提示词",
      bindingInteractive: true,
      bindingShowChevron: true,
      bindingInvalid: false,
    },
  };
  const calls = [],
    onDelete = (id) => calls.push(`delete:${id}`),
    onEdit = (id) => calls.push(`edit:${id}`);
  const empty = new Set();
  const decoration = edgeFunctions.flowEdgeDecoration(
    edge,
    nodes,
    "",
    "",
    "",
    empty,
    "",
  );
  const previous = edgeFunctions.decorateFlowEdge(
    edge,
    decoration,
    onDelete,
    onEdit,
  );
  assert.equal(
    edgeFunctions.decorateFlowEdge(
      { ...edge, data: { ...edge.data } },
      decoration,
      onDelete,
      onEdit,
      previous,
    ),
    previous,
  );
  for (const patch of [
    { source: "other" },
    { target: "other" },
    { sourceHandle: "output-1" },
    { targetHandle: "input-1" },
    { type: "different" },
    { animated: true },
  ]) {
    assert.notEqual(
      edgeFunctions.decorateFlowEdge(
        { ...edge, ...patch },
        decoration,
        onDelete,
        onEdit,
        previous,
      ),
      previous,
    );
  }
  for (const field of Object.keys(edge.data)) {
    assert.notEqual(
      edgeFunctions.decorateFlowEdge(
        { ...edge, data: { ...edge.data, [field]: "changed" } },
        decoration,
        onDelete,
        onEdit,
        previous,
      ),
      previous,
      field,
    );
  }
  assert.notEqual(
    edgeFunctions.decorateFlowEdge(
      edge,
      decoration,
      () => {},
      onEdit,
      previous,
    ),
    previous,
  );
  assert.notEqual(
    edgeFunctions.decorateFlowEdge(
      edge,
      decoration,
      onDelete,
      () => {},
      previous,
    ),
    previous,
  );
  for (const [hovered, selected, selectedEdge, highlighted, pathSource] of [
    ["start", "", "", paths.get("start"), "start"],
    ["", "a", "ab", empty, ""],
    ["b", "", "", empty, ""],
    ["unrelated", "", "", empty, ""],
  ]) {
    const nextDecoration = edgeFunctions.flowEdgeDecoration(
      edge,
      nodes,
      hovered,
      selected,
      selectedEdge,
      highlighted,
      pathSource,
    );
    const next = edgeFunctions.decorateFlowEdge(
      edge,
      nextDecoration,
      onDelete,
      onEdit,
      previous,
    );
    assert.equal(next === previous, hovered === "unrelated" || hovered === "b");
    if (oldEdgeFunctions) {
      const oldDecoration = oldEdgeFunctions.flowEdgeDecoration(
        edge,
        nodes,
        hovered,
        selected,
        selectedEdge,
        highlighted,
        pathSource,
      );
      const old = oldEdgeFunctions.decorateFlowEdge(edge, oldDecoration);
      assert.deepEqual(
        plain(next),
        plain({
          ...old,
          data: { ...old.data, onDelete, onEditBinding: onEdit },
        }),
      );
    }
  }
  previous.data.onDelete("ab");
  previous.data.onEditBinding("ab");
  assert.deepEqual(calls, ["delete:ab", "edit:ab"]);
});

test("execution error owner merges auth/project/reference scoped requests and normalization, preserves per-node errors and retries", async () => {
  const requests = [],
    pending = [];
  let normalizations = 0;
  const { createInFlightRequestLoader } = dependency(
    resolve(space, "../shared/in-flight-request.ts"),
  );
  const { loadCanvasNodeRunError: load } = sourceModule(
    resolve(space, "space-run-error.ts"),
    {
      ...runner,
      createInFlightRequestLoader,
      normalizeCanvasRunRef: (raw) => {
        normalizations++;
        return runner.normalizeCanvasRunRef(raw);
      },
      fetchSpaceCanvasExecution: (input) => {
        requests.push(input);
        return new Promise((resolve, reject) =>
          pending.push({ resolve, reject }),
        );
      },
    },
    undefined,
    ["loadCanvasNodeRunError"],
  );
  const base = {
    projectId: 1,
    executionId: 5,
    requestId: "r",
    runId: 7,
    requestScopeKey: "site:user:token",
    fallback: "节点运行失败",
  };
  const first = load({ ...base, nodeId: "a" }),
    second = load({ ...base, nodeId: "b", requestId: "ignored", runId: 999 });
  await Promise.resolve();
  assert.equal(requests.length, 1);
  pending.shift().resolve({
    status: "running",
    error: "运行错误",
    node_results: [
      { node_key: "a", error: "旧错误" },
      { node_key: "a", error: "A 最新错误" },
      { node_key: "b", error: "B 错误" },
    ],
  });
  assert.deepEqual(await Promise.all([first, second]), [
    "A 最新错误",
    "B 错误",
  ]);
  assert.equal(normalizations, 1);
  const fresh = load({ ...base, nodeId: "a" });
  await Promise.resolve();
  assert.equal(requests.length, 2, "settled active snapshots are not frozen");
  pending.shift().resolve({ status: "error", error: "已更新错误" });
  assert.equal(await fresh, "已更新错误");
  const different = [
    load({ ...base, nodeId: "a", requestScopeKey: "other-token" }),
    load({ ...base, nodeId: "a", projectId: 2 }),
    load({ ...base, nodeId: "a", executionId: 6 }),
  ];
  await Promise.resolve();
  assert.equal(requests.length, 5);
  pending.splice(0).forEach(({ resolve }) => resolve({ error: "不同作用域" }));
  await Promise.all(different);
  const failed = load({ ...base, nodeId: "a" });
  await Promise.resolve();
  pending.shift().reject(new Error("offline"));
  await assert.rejects(failed, /offline/);
  const retry = load({ ...base, nodeId: "a" });
  await Promise.resolve();
  pending.shift().resolve({});
  assert.equal(await retry, base.fallback);
  const requestA = load({
      ...base,
      executionId: 0,
      requestId: "by-request",
      nodeId: "a",
    }),
    requestB = load({
      ...base,
      executionId: 0,
      requestId: "by-request",
      runId: 99,
      nodeId: "b",
    });
  await Promise.resolve();
  assert.equal(requests.length, 8);
  pending.shift().resolve({ error: "请求错误" });
  assert.deepEqual(await Promise.all([requestA, requestB]), [
    "请求错误",
    "请求错误",
  ]);
  const runA = load({ ...base, executionId: 0, requestId: "", nodeId: "a" }),
    runB = load({ ...base, executionId: 0, requestId: "", nodeId: "b" });
  await Promise.resolve();
  assert.equal(requests.length, 9);
  pending.shift().resolve({ error: "运行错误" });
  await Promise.all([runA, runB]);
});
