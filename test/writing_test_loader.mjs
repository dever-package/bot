import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { runInNewContext } from "node:vm";

const require = createRequire(
  new URL("../front/package.json", import.meta.url),
);
export const ts = require("typescript");
const jsx = (type, props) => ({ type, props });
export const testReact = {
  useRef: (value) => ({ current: value }),
  useState: (value) => [
    typeof value === "function" ? value() : value,
    () => {},
  ],
  useEffect() {},
  useLayoutEffect() {},
  useCallback: (value) => value,
  useMemo: (compute) => compute(),
};

/** 每个调用独立模块缓存；测试显式传入运行环境，不共享 crypto 或 Hook 状态。 */
export function loader(overrides = {}) {
  const modules = new Map();
  return function load(filename) {
    if (modules.has(filename)) return modules.get(filename);
    const exports = {};
    modules.set(filename, exports);
    runInNewContext(
      ts.transpileModule(readFileSync(filename, "utf8"), {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.CommonJS,
          jsx: ts.JsxEmit.ReactJSX,
        },
      }).outputText,
      {
        exports,
        ...overrides.__globals,
        require(specifier) {
          if (specifier in overrides) return overrides[specifier];
          if (specifier.endsWith(".css")) return {};
          if (specifier === "react") return testReact;
          if (specifier === "react/jsx-runtime")
            return { jsx, jsxs: jsx, Fragment: "fragment" };
          if (specifier === "lucide-react")
            return new Proxy({}, { get: (_, name) => name });
          if (specifier === "@dever/front-plugin") return {};
          if (specifier === "../shared/detail-dialog")
            return { DETAIL_DIALOG_CHILD_LAYER_Z_INDEX: 100 };
          if (specifier === "../shared/asset-text-content-editor")
            return { AssetTextContentEditor: "TextEditor" };
          const base = path.resolve(path.dirname(filename), specifier);
          return load(existsSync(`${base}.ts`) ? `${base}.ts` : `${base}.tsx`);
        },
      },
    );
    return exports;
  };
}
