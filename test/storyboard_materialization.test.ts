import assert from "node:assert/strict";
import test from "node:test";

import {
  canvasStoryboardUpdateMode,
  storyboardMaterializationSourceChanged,
} from "../front/src/nodes/body-work/space/space-storyboard-materialization.ts";
import {
  isStoryboardManualPromptOverridden,
  storyboardManualPrompt,
} from "../front/src/nodes/body-work/space/space-storyboard-derived-prompt.ts";
import { storyboardSourceNodeIdsAffectedByNodeUpdate } from "../front/src/nodes/body-work/space/space-storyboard-derived-update.ts";

const currentNode = {
  id: "storyboard-source",
  asset: {
    id: 21,
    version_id: 101,
    version: { id: 101 },
  },
} as any;

const currentStoryboard = {
  workflow: {
    status: "confirmed",
    confirmed_at: "2026-09-02T01:00:00Z",
  },
  production_plan: ["shot_image"],
  materials: [{ type: "character", id: "character-1" }],
  shots: [{ id: "shot-1" }],
} as any;

test("loading the same asset detail only refreshes existing storyboard nodes", () => {
  const sameNode = {
    ...currentNode,
    asset: {
      ...currentNode.asset,
      version: { ...currentNode.asset.version },
    },
  };
  const sourceChanged = storyboardMaterializationSourceChanged(
    currentNode,
    currentStoryboard,
    sameNode,
    { ...currentStoryboard },
  );

  assert.equal(sourceChanged, false);
  assert.equal(canvasStoryboardUpdateMode(sourceChanged, true), "refresh");
});

test("a real storyboard version change materializes when powers are ready", () => {
  const nextNode = {
    ...currentNode,
    asset: {
      ...currentNode.asset,
      version_id: 102,
      version: { id: 102 },
    },
  };
  const sourceChanged = storyboardMaterializationSourceChanged(
    currentNode,
    currentStoryboard,
    nextNode,
    currentStoryboard,
  );

  assert.equal(sourceChanged, true);
  assert.equal(canvasStoryboardUpdateMode(sourceChanged, true), "materialize");
});

test("materialization waits while the power catalog is loading", () => {
  const draftStoryboard = {
    ...currentStoryboard,
    workflow: { status: "draft", confirmed_at: "" },
  };
  const confirmedStoryboard = {
    ...currentStoryboard,
    workflow: { status: "confirmed", confirmed_at: "" },
  };
  const sourceChanged = storyboardMaterializationSourceChanged(
    currentNode,
    draftStoryboard,
    currentNode,
    confirmedStoryboard,
  );

  assert.equal(sourceChanged, true);
  assert.equal(
    canvasStoryboardUpdateMode(sourceChanged, false),
    "defer-materialize",
  );
});

test("node updates only select their affected storyboard sources", () => {
  const nodes = [
    { id: "plain", type: "power", outputType: "general" },
    { id: "source-a", type: "power", outputType: "storyboard" },
    {
      id: "derived-a",
      storyboardItem: {
        sourceNodeId: "source-a",
        itemType: "shot_image",
        itemId: "shot-1",
        generatedPrompt: "system prompt",
        referenceNodeIds: ["reference-a"],
      },
    },
    { id: "reference-a", resultRef: { asset_id: 7 } },
  ] as any[];

  assert.deepEqual(
    storyboardSourceNodeIdsAffectedByNodeUpdate(nodes, "plain"),
    [],
  );
  assert.deepEqual(
    storyboardSourceNodeIdsAffectedByNodeUpdate(nodes, "derived-a"),
    ["source-a"],
  );
  assert.deepEqual(
    storyboardSourceNodeIdsAffectedByNodeUpdate(nodes, "reference-a"),
    ["source-a"],
  );
});

test("derived storyboard prompt stores only the user supplement", () => {
  const legacyNode = {
    id: "derived-a",
    storyboardItem: {
      sourceNodeId: "source-a",
      itemType: "shot_image",
      itemId: "shot-1",
      generatedPrompt: "system prompt",
      referenceNodeIds: [],
    },
    composerDraft: {
      prompt: "user supplement",
      paramValues: { prompt: "user supplement" },
    },
  } as any;

  assert.equal(
    isStoryboardManualPromptOverridden(
      legacyNode.composerDraft.prompt,
      legacyNode.storyboardItem.generatedPrompt,
    ),
    true,
  );
  assert.equal(storyboardManualPrompt("system prompt", "system prompt"), "");
  assert.equal(
    storyboardManualPrompt("user supplement", "system prompt"),
    "user supplement",
  );
});
