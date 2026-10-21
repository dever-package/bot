import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import test from "node:test";
import { runInNewContext } from "node:vm";

const require = createRequire(
  new URL("../front/package.json", import.meta.url),
);
const ts = require("typescript");
const root = new URL("../front/src/nodes/body-work/writing/", import.meta.url);
function load(name, globals) {
  const exports = {};
  runInNewContext(
    ts.transpileModule(readFileSync(new URL(name, root), "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    { exports, ...globals },
  );
  return exports;
}

function fixture({ narrow = false } = {}) {
  let top = 0;
  let height = 1000;
  let tail = 1000;
  let present = true;
  let cursor = 0;
  let effects = [];
  let frames = new Map();
  let nextFrame = 0;
  const slots = [];
  const listeners = new Map();
  const owner = {
    style: { overflowAnchor: "auto" },
    clientHeight: 200,
    clientTop: 0,
    overflowY: "auto",
    get scrollHeight() {
      return height;
    },
    get scrollTop() {
      return top;
    },
    set scrollTop(value) {
      top = Math.max(0, Math.min(height - this.clientHeight, value));
    },
    getBoundingClientRect: () => ({ top: 0 }),
    addEventListener: (name, callback) => listeners.set(name, callback),
    removeEventListener: (name) => listeners.delete(name),
  };
  const viewport = narrow
    ? { overflowY: "visible", parentElement: owner }
    : owner;
  const streamed = { getBoundingClientRect: () => ({ bottom: tail - top }) };
  const content = { querySelector: () => (present ? streamed : null) };
  const observers = [];
  const hook = load("use-writing-stream-scroll.ts", {
    require: () => ({
      useRef(value) {
        return (slots[cursor++] ||= { current: value });
      },
      useLayoutEffect(callback, dependencies) {
        const index = cursor++;
        const previous = slots[index];
        if (
          previous &&
          dependencies.every((value, i) => value === previous.dependencies[i])
        )
          return;
        effects.push(() => {
          previous?.cleanup?.();
          slots[index] = { dependencies, cleanup: callback() };
        });
      },
    }),
    getComputedStyle: (element) => ({ overflowY: element.overflowY }),
    CSS: { escape: (value) => value },
    requestAnimationFrame(callback) {
      frames.set(++nextFrame, callback);
      return nextFrame;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
    ResizeObserver: class {
      constructor(callback) {
        this.callback = callback;
        this.connected = true;
        observers.push(this);
      }
      observe() {}
      unobserve() {}
      disconnect() {
        this.connected = false;
      }
    },
  }).useWritingStreamScroll;
  let input = { scope: "run:1", target: "body", revision: 1 };
  const render = (next = {}) => {
    cursor = 0;
    input = { ...input, ...next };
    const refs = hook(input);
    refs.viewportRef.current = viewport;
    refs.contentRef.current = content;
    for (const effect of effects) effect();
    effects = [];
  };
  const flush = () => {
    const current = frames;
    frames = new Map();
    for (const callback of current.values()) callback();
  };
  const dispatch = (name, event = {}) => listeners.get(name)?.(event);
  render();
  return {
    owner,
    render,
    flush,
    dispatch,
    get top() {
      return top;
    },
    set top(value) {
      owner.scrollTop = value;
      dispatch("scroll");
    },
    grow(amount = 100) {
      height += amount;
      tail += amount;
      for (const observer of observers)
        if (observer.connected) observer.callback();
    },
    setTail(value) {
      tail = value;
    },
    layoutClamp(value) {
      top = value;
    },
    setPresent(value) {
      present = value;
    },
    unmount() {
      for (const slot of slots) slot.cleanup?.();
    },
    get pendingFrames() {
      return frames.size;
    },
    get listenerCount() {
      return listeners.size;
    },
  };
}

test("new stream and delayed layout growth follow without treating own scroll as user input", () => {
  const view = fixture();
  view.flush();
  assert.equal(view.top, 800);
  view.dispatch("scroll");
  view.grow();
  view.flush();
  assert.equal(view.top, 900);
  view.dispatch("scroll");
  view.grow();
  view.flush();
  assert.equal(view.top, 1000);
});

test("even a one-pixel upward wheel pauses pending growth, returning to bottom resumes", () => {
  const view = fixture();
  view.flush();
  view.grow();
  view.dispatch("wheel", { deltaY: -1 });
  view.top = 799;
  view.flush();
  assert.equal(view.top, 799);
  view.render({ revision: 2 });
  view.grow();
  view.flush();
  assert.equal(view.top, 799);
  view.top = 1000;
  view.grow();
  view.flush();
  assert.equal(view.top, 1100);
});

test("scrollbar upward movement pauses and a fresh task resets follow", () => {
  const view = fixture();
  view.flush();
  view.top = 400;
  view.grow();
  view.flush();
  assert.equal(view.top, 400);
  view.render({ scope: "run:2" });
  view.flush();
  assert.equal(view.top, 900);
});

test("explicit downward intent at an already clamped bottom resumes without a scroll event", () => {
  const view = fixture();
  view.flush();
  view.dispatch("wheel", { deltaY: -1 });
  view.dispatch("wheel", { deltaY: 1 });
  view.grow();
  view.flush();
  assert.equal(view.top, 900);
});

test("same-task target switches and temporarily hidden stream preserve user takeover", () => {
  const view = fixture();
  view.flush();
  view.top = 300;
  view.render({ target: "world" });
  view.grow();
  view.flush();
  assert.equal(view.top, 300);
  view.render({ target: null });
  view.grow();
  view.flush();
  assert.equal(view.top, 300);
  view.render({ target: "body" });
  view.grow();
  view.flush();
  assert.equal(view.top, 300);
});

test("paused plain-text auto-height layout clamps cannot move the reading position across fields", () => {
  const view = fixture();
  view.flush();
  view.top = 300;
  view.layoutClamp(800);
  view.render({ target: "world", revision: 2 });
  view.dispatch("scroll");
  view.grow();
  view.flush();
  assert.equal(view.top, 300);
});

test("following survives an auto-height intermediate clamp before the delayed scroll event", () => {
  const view = fixture();
  view.flush();
  view.layoutClamp(300);
  view.render({ target: "world", revision: 2 });
  view.dispatch("scroll");
  view.grow();
  view.flush();
  assert.equal(view.top, 900);
});

test("outline follows its current block tail and resumes there before the whole page end", () => {
  const view = fixture();
  view.setTail(500);
  view.flush();
  assert.equal(view.top, 320);
  view.top = 100;
  view.grow();
  view.flush();
  assert.equal(view.top, 100);
  view.top = 420;
  view.grow();
  view.flush();
  assert.equal(view.top, 520);
});

test("narrow proposal follows real scroll ancestor; missing off-page target does not scroll", () => {
  const view = fixture({ narrow: true });
  view.flush();
  assert.equal(view.top, 800);
  view.setPresent(false);
  view.grow();
  view.flush();
  assert.equal(view.top, 800);
});

test("touch and keyboard takeover pause; disabling and unmount cancel frames and listeners", () => {
  const view = fixture();
  view.flush();
  view.dispatch("touchstart", { touches: [{ clientY: 100 }] });
  view.dispatch("touchmove", { touches: [{ clientY: 101 }] });
  view.grow();
  view.flush();
  assert.equal(view.top, 800);
  view.render({ scope: "run:2" });
  view.flush();
  view.dispatch("keydown", { key: "PageUp" });
  view.grow();
  view.flush();
  assert.equal(view.top, 900);
  view.render({ scope: "run:3" });
  assert.equal(view.pendingFrames, 1);
  view.render({ target: null });
  assert.equal(view.pendingFrames, 0);
  assert.equal(view.listenerCount, 0);
  assert.equal(view.owner.style.overflowAnchor, "auto");
  view.render({ target: "body" });
  view.unmount();
  assert.equal(view.pendingFrames, 0);
  assert.equal(view.listenerCount, 0);
});

const index = load("writing-chapter-index.ts", {}).writingChapterIndex;
const target = load("writing-stream-target.ts", {
  require: (specifier) =>
    specifier === "./writing-chapter-index"
      ? { writingChapterIndex: index }
      : {
          isWritingOutlineSection: (section) =>
            ["overview", "world"].includes(section),
        },
}).writingStreamTarget;
const document = { units: ["a", "b", "c"].map((id) => ({ id, title: id })) };
const preview = (active_field, fields, extra = {}) => ({
  active_field,
  fields,
  ...extra,
});

test("only visible unit identity and tab receive body or chapter-plan follow", () => {
  assert.equal(
    target(
      document,
      { kind: "unit", id: "a" },
      preview("body", { body: "text" }, { unit_id: "b" }),
    ),
    null,
  );
  assert.equal(
    target(
      document,
      { kind: "unit", id: "a", tab: "plan" },
      preview("body", { body: "text" }, { unit_id: "a" }),
    ),
    null,
  );
  assert.equal(
    target(
      document,
      { kind: "unit", id: "a" },
      preview("body", { body: "text" }, { unit_id: "a" }),
    ),
    "unit:a:body",
  );
  assert.equal(
    target(
      document,
      { kind: "unit", id: "b", tab: "plan" },
      preview("units.0.plan", { "units.0.plan": "text" }),
      { action: "generate_chapters", unit_ids: ["b"] },
    ),
    "unit:b:plan",
  );
  assert.equal(
    target(
      document,
      { kind: "unit", id: "b", tab: "plan" },
      preview("units.1.plan", {
        "units.0.plan": "old",
        "units.1.plan": "current",
      }),
      { action: "generate_chapters", unit_ids: ["b", "c"] },
    ),
    null,
    "批次已流到别的章节时，不再拿旧的累积字段滚动当前章",
  );
});

test("outline follows newest field and proposals never scroll the original", () => {
  const selection = { kind: "section", id: "overview" };
  assert.equal(
    target(
      document,
      selection,
      preview("outline.world", {
        "outline.overview": "a",
        "outline.world": "b",
      }),
    ),
    "outline:world",
  );
  assert.equal(
    target(
      document,
      selection,
      preview("content", { content: "a" }, { section_id: "world" }),
    ),
    "outline:world",
  );
  assert.equal(
    target(document, selection, preview("replacement", { replacement: "a" })),
    null,
  );
  assert.equal(
    target(
      document,
      selection,
      preview("body", { body: "a" }, { unit_id: "b" }),
    ),
    null,
  );
});

test("chapter card targets use canonical scoped and append positions without changing pages", () => {
  const selection = { kind: "section", id: "chapters" };
  assert.equal(
    target(
      document,
      selection,
      preview("units.0.plan", { "units.0.plan": "a" }),
      {
        action: "generate_chapters",
        unit_ids: ["c"],
      },
    ),
    "chapter:2",
  );
  assert.equal(
    target(
      document,
      selection,
      preview("units.1.plan", { "units.1.plan": "a" }),
      {
        action: "append",
        unit_ids: [],
      },
    ),
    "chapter:4",
  );
  assert.equal(
    target(
      document,
      selection,
      preview("units.0.plan", { "units.0.plan": "a" }),
      {
        action: "generate_chapters",
        unit_ids: ["missing"],
      },
    ),
    null,
  );
});

test("activity follows explicit field despite alphabetical map order and title/plan sibling keys", () => {
  const selection = { kind: "section", id: "overview" };
  const fields = {
    "outline.characters.0.name": "人物",
    "outline.overview": "故事核心",
    "outline.world": "环境",
  };
  for (const active of [
    "outline.overview",
    "outline.characters.0.name",
    "outline.world",
  ])
    assert.equal(
      target(document, selection, preview(active, fields)),
      active.startsWith("outline.characters.")
        ? "outline:characters"
        : active.replace("outline.", "outline:"),
    );
  const chapters = {
    units: Array.from({ length: 11 }, (_, index) => ({
      id: `chapter-${index}`,
      title: `${index}`,
    })),
  };
  const alphabeticFields = Object.fromEntries([
    ["units.10.plan", "第11章"],
    ["units.8.plan", "第9章"],
    ["units.9.plan", "第10章"],
    ["units.9.title", "标题"],
  ]);
  for (const [field, expected] of [
    ["units.8.plan", 8],
    ["units.9.title", 9],
    ["units.9.plan", 9],
    ["units.10.plan", 10],
  ])
    assert.equal(
      target(
        chapters,
        { kind: "section", id: "chapters" },
        preview(field, alphabeticFields),
      ),
      `chapter:${expected}`,
    );
  assert.equal(
    target(
      document,
      selection,
      preview("replacement", { replacement: "建议", "outline.world": "旧值" }),
    ),
    null,
  );
});
