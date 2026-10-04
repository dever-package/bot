import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

function readSource(relativePath: string) {
  return readFileSync(new URL(relativePath, import.meta.url), "utf8");
}

test("storyboard source node owns the production workspace", () => {
  const pageSource = readSource(
    "../front/src/nodes/body-work/space/space-page.tsx",
  );

  assert.match(pageSource, /nodeData\.storyboardWorkspace\s*=/);
  assert.match(pageSource, /renderNode: renderStoryboardWorkspaceNode/);
  assert.doesNotMatch(pageSource, /type:\s*["']storyboardFrame["']/);
  assert.doesNotMatch(pageSource, /storyboardDisplayEdges/);
  assert.doesNotMatch(pageSource, /expandedStoryboardFrame/);
});

test("workspace renders ordinary nodes at their real size with the shared editor", () => {
  const source = readSource(
    "../front/src/nodes/body-work/space/space-storyboard-workspace.tsx",
  );

  assert.match(source, /width: Math\.max\(1, result\.node\.width\)/);
  assert.match(source, /height: Math\.max\(1, result\.node\.height\)/);
  assert.match(source, /renderNode\(result\.node, selectedNodeId === result\.nodeId\)/);
  assert.match(source, /createPortal\(/);
  assert.match(source, /<CanvasNodeSettings/);
  assert.match(source, /closest\("\.wb-detail-backdrop"\)/);
  assert.match(source, /onMouseDown=\{\(event\) => event\.stopPropagation\(\)\}/);
  assert.match(source, /new MutationObserver\(observeEditor\)/);
  assert.match(source, /observer\.unobserve\(observedEditor\)/);
  assert.doesNotMatch(source, /aspectRatio/);
});

test("canvas and detail share one storyboard workspace component", () => {
  const nodeSource = readSource(
    "../front/src/nodes/body-work/space/space-storyboard-node.tsx",
  );
  const detailSource = readSource(
    "../front/src/nodes/body-work/space/node-detail/node-detail-editor.tsx",
  );

  assert.match(nodeSource, /<StoryboardWorkspace/);
  assert.match(nodeSource, /storyboard\.shots\.map/);
  assert.doesNotMatch(nodeSource, /storyboard\.shots\.slice/);
  assert.match(detailSource, /<StoryboardWorkspace/);
  assert.match(detailSource, /variant="detail"/);
});

test("storyboard node defaults migrate directly to the workspace size", () => {
  const modelSource = readSource(
    "../front/src/nodes/body-work/space/space-model.ts",
  );

  assert.match(
    modelSource,
    /LEGACY_STORYBOARD_NODE_SIZE = \{ width: 620, height: 360 \}/,
  );
  assert.match(
    modelSource,
    /DEFAULT_STORYBOARD_NODE_SIZE = \{ width: 800, height: 460 \}/,
  );
  assert.match(
    modelSource,
    /node\.width = DEFAULT_STORYBOARD_NODE_SIZE\.width/,
  );
  assert.match(
    modelSource,
    /node\.height = DEFAULT_STORYBOARD_NODE_SIZE\.height/,
  );
});
