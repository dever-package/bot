import assert from "node:assert/strict";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loader } from "./writing_test_loader.mjs";

const load = loader();
const { canvasNodeSupportsTextBinding } = load(fileURLToPath(new URL(
  "../front/src/nodes/body-work/space/space-param-binding.ts", import.meta.url,
)));

test("story nodes pass content by writing reference, not as a bindable text param", () => {
  assert.equal(canvasNodeSupportsTextBinding({ type: "power", kind: "text", outputType: "story", power: { kind: "text", outputType: "story" } }), false);
  assert.equal(canvasNodeSupportsTextBinding({ type: "power", kind: "text", outputType: "text", power: { kind: "text", outputType: "text" } }), true);
});
