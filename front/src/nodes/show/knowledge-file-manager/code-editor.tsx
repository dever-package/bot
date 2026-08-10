import { useEffect, useMemo, useState, type ComponentProps } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { fileExt, type KnowledgeFileKind } from "./file-kind";
import type { KnowledgeFileContent } from "./types";
import {
  createPreloadableModule,
  type PreloadableModule,
} from "../../shared/preloadable";

type CodeMirrorExtensions = NonNullable<
  ComponentProps<typeof CodeMirror>["extensions"]
>;
type EditorLanguage =
  | "html"
  | "json"
  | "css"
  | "javascript"
  | "javascript-jsx"
  | "sql"
  | "xml"
  | "yaml";

const languageModules: Record<
  EditorLanguage,
  PreloadableModule<CodeMirrorExtensions>
> = {
  html: createPreloadableModule(() =>
    import("@codemirror/lang-html").then((module) => [module.html()]),
  ),
  json: createPreloadableModule(() =>
    import("@codemirror/lang-json").then((module) => [module.json()]),
  ),
  css: createPreloadableModule(() =>
    import("@codemirror/lang-css").then((module) => [module.css()]),
  ),
  javascript: createPreloadableModule(() =>
    import("@codemirror/lang-javascript").then((module) => [
      module.javascript(),
    ]),
  ),
  "javascript-jsx": createPreloadableModule(() =>
    import("@codemirror/lang-javascript").then((module) => [
      module.javascript({ jsx: true }),
    ]),
  ),
  sql: createPreloadableModule(() =>
    import("@codemirror/lang-sql").then((module) => [module.sql()]),
  ),
  xml: createPreloadableModule(() =>
    import("@codemirror/lang-xml").then((module) => [module.xml()]),
  ),
  yaml: createPreloadableModule(() =>
    import("@codemirror/lang-yaml").then((module) => [module.yaml()]),
  ),
};

export function KnowledgeCodeEditor({
  file,
  content,
  kind,
  onChange,
}: {
  file: KnowledgeFileContent;
  content: string;
  kind: KnowledgeFileKind;
  onChange: (content: string) => void;
}) {
  const language = useMemo(
    () => editorLanguage(file.name, kind),
    [file.name, kind],
  );
  const [extensions, setExtensions] = useState<CodeMirrorExtensions>([]);

  useEffect(() => {
    let active = true;
    if (!language) {
      setExtensions([]);
      return () => {
        active = false;
      };
    }
    void languageModules[language].load().then(
      (nextExtensions) => {
        if (active) {
          setExtensions(nextExtensions);
        }
      },
      () => {
        if (active) {
          setExtensions([]);
        }
      },
    );
    return () => {
      active = false;
    };
  }, [language]);

  return (
    <CodeMirror
      value={content}
      height="100%"
      basicSetup={{
        autocompletion: true,
        bracketMatching: true,
        foldGutter: true,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
        lineNumbers: true,
      }}
      extensions={extensions}
      className="knowledge-code-editor"
      onChange={onChange}
    />
  );
}

function editorLanguage(
  name: string,
  kind: KnowledgeFileKind,
): EditorLanguage | undefined {
  const ext = fileExt(name);
  if (kind === "html") {
    return "html";
  }
  if (ext === "json") {
    return "json";
  }
  if (ext === "css" || ext === "scss" || ext === "less") {
    return "css";
  }
  if (
    ext === "js" ||
    ext === "jsx" ||
    ext === "ts" ||
    ext === "tsx" ||
    ext === "vue"
  ) {
    return ext === "jsx" || ext === "tsx" ? "javascript-jsx" : "javascript";
  }
  if (ext === "sql") {
    return "sql";
  }
  if (ext === "xml") {
    return "xml";
  }
  if (ext === "yaml" || ext === "yml") {
    return "yaml";
  }
  return undefined;
}
