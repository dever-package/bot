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

  assert.match(pageSource, /storyboardFrameBySourceId\.get\(node\.id\)/);
  assert.match(pageSource, /\{ \.\.\.projectedData, storyboardWorkspace \}/);
  assert.match(pageSource, /data: nodeData/);
  assert.match(pageSource, /renderNode: renderStoryboardWorkspaceNode/);
  assert.doesNotMatch(pageSource, /type:\s*["']storyboardFrame["']/);
  assert.doesNotMatch(pageSource, /storyboardDisplayEdges/);
  assert.doesNotMatch(pageSource, /expandedStoryboardFrame/);
});

test("workspace previews fit the available width and keep the shared editor", () => {
  const source = readSource(
    "../front/src/nodes/body-work/space/space-storyboard-workspace.tsx",
  );
  const styles = readSource(
    "../front/src/nodes/body-work/space/space-storyboard-workspace.css",
  );

  assert.match(source, /videoCompose \? \{ height \} : \{\s*aspectRatio:/);
  assert.match(source, /renderNode\(result\.node, selected\)/);

  assert.ok(!styles.includes("max-height: 340px"));
  assert.ok(source.includes("group.results.map((result) => (\n                <StoryboardWorkspaceResult"));
  assert.match(styles, /\.ws-storyboard-workspace-result\.is-video-compose\s*\{\s*grid-column: 1 \/ -1/);
  assert.match(source, /createPortal\(/);
  assert.match(source, /<CanvasNodeSettings/);
  assert.match(source, /closest\("\.wb-detail-backdrop"\)/);
  assert.match(source, /onMouseDown=\{\(event\) => event\.stopPropagation\(\)\}/);
  assert.match(source, /new MutationObserver\(observeEditor\)/);
  assert.match(source, /observer\.unobserve\(observedEditor\)/);
});

test("canvas and detail share one storyboard workspace component", () => {
  const nodeSource = readSource(
    "../front/src/nodes/body-work/space/space-storyboard-node.tsx",
  );
  const detailSource = readSource(
    "../front/src/nodes/body-work/space/node-detail/node-detail-editor.tsx",
  );

  assert.match(nodeSource, /<StoryboardWorkspace/);
  assert.match(nodeSource, /<StoryboardShotList\s+shots=\{storyboard\.shots\}/);
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
