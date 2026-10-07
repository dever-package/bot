import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

registerHooks({
  resolve(specifier, context, nextResolve) {
    try {
      return nextResolve(specifier, context);
    } catch (error) {
      if (error.code !== "ERR_MODULE_NOT_FOUND" || !specifier.startsWith(".")) {
        throw error;
      }
      return nextResolve(`${specifier}.ts`, context);
    }
  },
});

const { powerFormHasUnavailableSource, restoreCanvasComposerParamValues } =
  await import("../front/src/nodes/body-work/space/space-power-param.ts");

const form = {
  source_rule: 2,
  selected_target_id: 23,
  sources: [{ id: 6, target_id: 6 }, { id: 39, target_id: 39 }],
  params: [{ key: "prompt", type: "prompt", value_type: "string" }],
};

test("unavailable source recovery preserves private parameters and attachments", () => {
  const draft = {
    selectedTargetId: 23,
    prompt: "saved prompt",
    paramValues: {
      prompt: "saved prompt",
      source_private_option: "custom",
      reference_files: [{ id: 41, url: "/upload/reference.png" }],
      param_57: ["/upload/another.png"],
    },
  };
  const before = structuredClone(draft);
  for (const sources of [form.sources, []]) {
    const unavailableForm = { ...form, sources };
    assert.equal(powerFormHasUnavailableSource(unavailableForm, 23), true);
    const restored = restoreCanvasComposerParamValues(unavailableForm, draft);
    assert.strictEqual(restored, draft.paramValues);
    assert.strictEqual(restoreCanvasComposerParamValues(unavailableForm, { ...draft, paramValues: restored }), restored);
    assert.deepEqual(draft, before);
    assert.equal(unavailableForm.selected_target_id, 23);
  }
});

test("only explicit reselection applies the new source parameter contract", () => {
  const draft = {
    selectedTargetId: 6,
    prompt: "saved prompt",
    paramValues: { prompt: "saved prompt", source_private_option: "old" },
  };
  assert.equal(powerFormHasUnavailableSource(form, draft.selectedTargetId), false);
  assert.deepEqual(restoreCanvasComposerParamValues(form, draft), { prompt: "saved prompt" });
  assert.equal(draft.paramValues.source_private_option, "old");
});

test("loading, automatic selection and unselected forms keep their existing semantics", () => {
  assert.equal(powerFormHasUnavailableSource(null, 23), false);
  assert.equal(powerFormHasUnavailableSource({ ...form, source_rule: 1 }, 23), false);
  assert.equal(powerFormHasUnavailableSource(form, 0), false);
  assert.equal(powerFormHasUnavailableSource(form, 39), false);
});
