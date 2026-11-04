import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { loader } from "./writing_test_loader.mjs";

const load = loader({
  "@dever/front-plugin": { getCompatModule: () => ({}) },
  __globals: {
    window: {
      appRuntime: {},
      location: {
        host: "test.local",
        hostname: "test.local",
        protocol: "http:",
      },
    },
  },
});
const {
  canvasPowerParamItems,
  defaultPowerParamValues,
  mergeCanvasComposerParamValues,
  mergePowerParamValues,
  reconcilePowerParamOptionFilters,
} = load(
  fileURLToPath(
    new URL(
      "../front/src/nodes/body-work/space/space-power-param.ts",
      import.meta.url,
    ),
  ),
);
const group = { id: 50, key: "soundSettings", name: "声音设置", sort: 20 };
const voice = {
  id: 1,
  key: "voice",
  name: "音色",
  type: "option",
  value_type: "string",
  default_value: "v1",
  preview_type: "audio",
  options: [
    { id: 1, value: "v1", preview_url: "https://example.test/v1.mp3" },
    { id: 2, value: "v2" },
  ],
};
const language = {
  id: 2,
  key: "language",
  name: "语言",
  type: "input",
  value_type: "string",
  default_value: "中文",
};
const speed = {
  id: 3,
  key: "speed",
  name: "速度",
  type: "input",
  value_type: "string",
  default_value: "极速",
};

test("standalone controls and named panels retain order", () => {
  const rows = [speed, { ...voice, group }, { ...language, group }];
  const items = canvasPowerParamItems(rows);
  assert.equal(items.length, 2);
  assert.equal(items[0].param, speed);
  assert.equal(items[1].group, group);
  assert.deepEqual(
    Array.from(items[1].params, (param) => param.key),
    ["voice", "language"],
  );
  assert.equal(items[1].params[0].preview_type, "audio");
  assert.equal(
    items[1].params[0].options[0].preview_url,
    voice.options[0].preview_url,
  );
});

test("moving saved fields into and out of a group preserves values", () => {
  const original = [voice, language, speed];
  const grouped = [{ ...voice, group }, { ...language, group }, speed];
  const values = { voice: "v2", language: "英语", speed: "快速" };
  assert.deepEqual(
    { ...mergePowerParamValues(grouped, values, original) },
    values,
  );
  assert.deepEqual(
    { ...mergePowerParamValues(original, values, grouped) },
    values,
  );
  assert.deepEqual(
    {
      ...mergeCanvasComposerParamValues(grouped, {
        prompt: "",
        paramValues: values,
      }),
    },
    values,
  );
  assert.deepEqual(
    { ...defaultPowerParamValues(grouped) },
    { voice: "v1", language: "中文", speed: "极速" },
  );
  assert.equal(
    Object.hasOwn(defaultPowerParamValues(grouped), group.key),
    false,
  );
});

test("empty and filtered panels do not create extra controls", () => {
  assert.deepEqual(
    Array.from(canvasPowerParamItems([speed]), (item) => ({ ...item })),
    [{ key: "param:speed", param: speed }],
  );
  assert.deepEqual(Array.from(canvasPowerParamItems([])), []);
  assert.equal(
    canvasPowerParamItems([{ ...language, group }])[0].params.length,
    1,
  );
});

test("source-only defaults wait for source selection without erasing saved choices", () => {
  const deferred = { ...speed, defer_default: true };
  assert.deepEqual({ ...defaultPowerParamValues([deferred]) }, {});
  assert.deepEqual(
    {
      ...mergeCanvasComposerParamValues([deferred], {
        prompt: "",
        paramValues: { speed: "快速" },
      }),
    },
    { speed: "快速" },
  );
});

test("an obsolete saved option resolves to the configured source default", () => {
  const resolution = {
    id: 4,
    key: "resolution",
    name: "分辨率",
    type: "option",
    value_type: "string",
    default_value: "640",
    options: [
      { id: 10, value: "512" },
      { id: 11, value: "640" },
      { id: 12, value: "768" },
    ],
  };
  const values = mergeCanvasComposerParamValues([resolution], {
    prompt: "",
    paramValues: { resolution: "obsolete" },
  });
  assert.equal(values.resolution, "640");
});

test("group filtering preserves saved selections and aligns changed categories", () => {
  const category = { ...voice, key: "category", default_value: "primary", options: [{id:1,value:"primary"},{id:2,value:"secondary"}] };
  const choice = { ...voice, key:"choice", option_filter_key:"category", default_value:"first", options:[{id:3,value:"first",group:"primary"},{id:4,value:"second",group:"secondary"}] };
  const params = [category, choice];
  const saved = mergeCanvasComposerParamValues(params,{prompt:"",paramValues:{choice:"second"}});
  assert.deepEqual({...saved},{category:"secondary",choice:"second"});
  const changed = reconcilePowerParamOptionFilters(params,{...saved,category:"primary"},"category");
  assert.deepEqual({...changed},{category:"primary",choice:"first"});
  const categoryOnly = mergeCanvasComposerParamValues(params,{prompt:"",paramValues:{category:"secondary"}});
  assert.deepEqual({...categoryOnly},{category:"secondary",choice:"second"});
  const other = mergeCanvasComposerParamValues([voice],{prompt:"",paramValues:{voice:"v2"}});
  assert.equal(other.voice,"v2");
});
