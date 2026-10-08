import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test, { afterEach, beforeEach } from "node:test";
import { runInNewContext } from "node:vm";

const frontRequire = createRequire(new URL("../front/package.json", import.meta.url));
const flowRequire = createRequire(frontRequire.resolve("@xyflow/react"));
const { adoptUserNodes, getEdgePosition, updateNodeInternals } = flowRequire("@xyflow/system");
const ts = frontRequire("typescript");

// 读取真实私有投影函数，避免加载整个工作台，也不为测试暴露生产接口。
const sourcePath = new URL("../front/src/nodes/body-work/space/space-page.tsx", import.meta.url);
const source = ts.createSourceFile(
  sourcePath.pathname,
  readFileSync(sourcePath, "utf8"),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
const declaration = source.statements.find(
  (statement: { name?: { text: string } }) =>
    ts.isFunctionDeclaration(statement) && statement.name?.text === "stableFlowNodeSize",
);
assert.ok(declaration, "canvas size projection is missing");
const stableFlowNodeSize = runInNewContext(
  ts.transpileModule(declaration.getText(source), {
    compilerOptions: { target: ts.ScriptTarget.ES2022 },
  }).outputText + "\nstableFlowNodeSize;",
);

type Size = { width: number; height: number };
const initialSize: Size = { width: 280, height: 220 };
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, "window");

beforeEach(() => {
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      getComputedStyle: () => ({ transform: "matrix(1, 0, 0, 1, 0, 0)" }),
      DOMMatrixReadOnly: class { m22 = 1; },
    },
  });
});

afterEach(() => {
  if (originalWindow) Object.defineProperty(globalThis, "window", originalWindow);
  else Reflect.deleteProperty(globalThis, "window");
});

function canvasNode(id: string, status: string, size = initialSize) {
  return {
    id,
    position: { x: id === "source" ? 20 : 600, y: 30 },
    data: { status },
    ...stableFlowNodeSize(size),
  };
}

function geometryHarness() {
  const nodeLookup = new Map();
  const parentLookup = new Map();
  return {
    adopt: (nodes: ReturnType<typeof canvasNode>[]) =>
      adoptUserNodes(nodes, nodeLookup, parentLookup),
    edge: () => getEdgePosition({
      id: "connection",
      sourceNode: nodeLookup.get("source"),
      targetNode: nodeLookup.get("target"),
      connectionMode: "strict",
    }),
    measure: (id: string, size = initialSize) => {
      // 模拟 ResizeObserver 交付的 DOM 读数；锚点由实际库计算，不直接写入 internals。
      const handle = (type: string) => ({
        offsetWidth: 10,
        offsetHeight: 10,
        getAttribute: (name: string) => name === "data-handleid"
          ? null
          : type === ".source" ? "right" : "left",
        getBoundingClientRect: () => ({
          left: type === ".source" ? size.width - 5 : -5,
          top: size.height / 2 - 5,
        }),
      });
      return updateNodeInternals(
        new Map([[id, {
          id,
          force: true,
          nodeElement: {
            offsetWidth: size.width,
            offsetHeight: size.height,
            getBoundingClientRect: () => ({ left: 0, top: 0 }),
            querySelectorAll: (type: string) => [handle(type)],
          },
        }]]),
        nodeLookup,
        parentLookup,
        { querySelector: () => ({}) },
        [0, 0],
      );
    },
  };
}

test("generation updates preserve measured edge geometry", () => {
  const graph = geometryHarness();
  graph.adopt([canvasNode("source", "idle"), canvasNode("target", "idle")]);
  assert.equal(graph.edge(), null, "new nodes need real handle measurements");
  assert.equal(graph.measure("source").updatedInternals, true);
  assert.equal(graph.measure("target").updatedInternals, true);
  const measuredEdge = graph.edge();
  assert.ok(measuredEdge);

  for (const status of ["running", "progress:25", "progress:75", "success", "error"]) {
    graph.adopt([canvasNode("source", status), canvasNode("target", status)]);
    assert.deepEqual(graph.edge(), measuredEdge, `${status} lost the measured edge`);
  }
});

test("changed visual sizes receive fresh handle geometry after observation", () => {
  const graph = geometryHarness();
  graph.adopt([canvasNode("source", "running"), canvasNode("target", "running")]);
  graph.measure("source");
  graph.measure("target");
  const before = graph.edge();
  const larger = { width: 620, height: 420 };
  graph.adopt([canvasNode("source", "success", larger), canvasNode("target", "success")]);
  assert.ok(graph.edge(), "resizing must not erase existing handles");
  assert.equal(graph.measure("source", larger).updatedInternals, true);
  const after = graph.edge();
  assert.equal(after.sourceX - before.sourceX, larger.width - initialSize.width);
  assert.equal(after.sourceY - before.sourceY, (larger.height - initialSize.height) / 2);
  assert.equal(after.targetX, before.targetX);
  assert.equal(after.targetY, before.targetY);

  graph.adopt([canvasNode("source", "success", larger), canvasNode("target", "success")]);
  assert.deepEqual(graph.edge(), after);
});
