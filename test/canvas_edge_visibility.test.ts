import assert from "node:assert/strict";
import test from "node:test";

import { replaceVisibleCanvasEdges } from "../front/src/nodes/body-work/space/space-canvas-edge.ts";

test("editing visible edges preserves hidden production connections and their order", () => {
  const hidden = { id: "hidden", from: "shot", to: "image" };
  const visible = { id: "visible", from: "script", to: "other" };
  const laterHidden = { id: "later-hidden", from: "image", to: "video" };
  const edges = [hidden, visible, laterHidden];

  assert.deepEqual(
    replaceVisibleCanvasEdges(edges, new Set(["visible"]), [
      { ...visible, to: "replacement" },
      { id: "new", from: "a", to: "b" },
    ]),
    [
      hidden,
      { ...visible, to: "replacement" },
      laterHidden,
      { id: "new", from: "a", to: "b" },
    ],
  );
  assert.deepEqual(replaceVisibleCanvasEdges(edges, new Set(["visible"]), []), [
    hidden,
    laterHidden,
  ]);
});
