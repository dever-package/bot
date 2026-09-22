import assert from "node:assert/strict";
import test from "node:test";

import {
  canvasStoryboardUpdateMode,
  storyboardMaterializationSourceChanged,
} from "../front/src/nodes/body-work/space/space-storyboard-materialization.ts";
import type { StoryboardDerivedItem } from "../front/src/nodes/body-work/space/space-storyboard-derived-specs.ts";
import {
  storyboardDerivedSourceSignatureTemplate,
  storyboardProductionSourceSignatureParts,
} from "../front/src/nodes/body-work/space/space-storyboard-source-signature.ts";
import type { StoryboardDocument } from "../front/src/nodes/body-work/space/space-storyboard.ts";
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

test("storyboard source signatures keep the prompt-content slot stable", () => {
  const item: StoryboardDerivedItem = {
    type: "shot_image",
    id: "shot-image-1",
    title: "镜头 1",
    prompt: "镜头提示词",
    promptContent: { version: 1, parts: [{ type: "text", text: "first" }] },
    sourceSignatureParts: ["asset:21", "version:101"],
  };
  const first = storyboardDerivedSourceSignatureTemplate(item);
  const promptContentChanged = storyboardDerivedSourceSignatureTemplate({
    ...item,
    promptContent: { version: 1, parts: [{ type: "text", text: "second" }] },
  });
  const sourceChanged = storyboardDerivedSourceSignatureTemplate({
    ...item,
    sourceSignatureParts: ["asset:21", "version:102"],
  });

  assert.equal(first[1], null);
  assert.deepEqual(promptContentChanged, first);
  assert.notDeepEqual(sourceChanged, first);
});

test("production signatures track style and only the selected material settings", () => {
  const storyboard = {
    ...currentStoryboard,
    visual_mode: "stylized",
    style_prompt: "手绘水彩",
    aspect_ratio: "16:9",
    materials: [
      { id: "character-1", type: "character", name: "甲", prompt: "成年旅人" },
      { id: "prop-1", type: "prop", name: "乙", prompt: "掌心大小" },
      { id: "scene-1", type: "scene", name: "木屋", prompt: "高3米的木屋" },
      { id: "offscreen", type: "character", name: "丙", prompt: "高大的生物" },
    ],
    shots: [
      { id: "shot-1", material_ids: ["character-1", "prop-1", "scene-1"] },
    ],
  } as StoryboardDocument;
  const signature = (item: StoryboardDerivedItem, source = storyboard) =>
    storyboardDerivedSourceSignatureTemplate({
      ...item,
      sourceSignatureParts: storyboardProductionSourceSignatureParts(
        item,
        source,
      ),
    });

  for (const type of [
    "character",
    "scene",
    "prop",
    "shot_image",
    "shot",
  ] as const) {
    const isShot = type === "shot_image" || type === "shot";
    const id = isShot ? "shot-1" : `${type}-1`;
    const item: StoryboardDerivedItem = {
      type,
      id,
      title: "测试",
      prompt: "保留手工提示词",
    };
    const initial = signature(item);
    for (const patch of [
      { style_prompt: "黏土定格" },
      { visual_mode: "photoreal" as const },
      { aspect_ratio: "9:16" as const },
    ]) {
      assert.notDeepEqual(
        signature(item, { ...storyboard, ...patch }),
        initial,
      );
    }
    const changedMaterial = (id: string) => ({
      ...storyboard,
      materials: storyboard.materials.map((material) =>
        material.id === id
          ? { ...material, prompt: "新的体型和外观" }
          : material,
      ),
    });
    assert.deepEqual(signature(item, changedMaterial("offscreen")), initial);
    const selectedId = isShot ? "prop-1" : id;
    assert.notDeepEqual(signature(item, changedMaterial(selectedId)), initial);
  }

  const speech: StoryboardDerivedItem = {
    type: "speech",
    id: "speech-1",
    title: "配音",
    prompt: "你好",
  };
  assert.deepEqual(
    signature(speech),
    signature(speech, { ...storyboard, style_prompt: "其他风格" }),
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
