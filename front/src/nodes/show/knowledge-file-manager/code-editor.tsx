import CodeMirror from "@uiw/react-codemirror"
import { css } from "@codemirror/lang-css"
import { html } from "@codemirror/lang-html"
import { javascript } from "@codemirror/lang-javascript"
import { json } from "@codemirror/lang-json"
import { sql } from "@codemirror/lang-sql"
import { xml } from "@codemirror/lang-xml"
import { yaml } from "@codemirror/lang-yaml"
import { fileExt, type KnowledgeFileKind } from "./file-kind"
import type { KnowledgeFileContent } from "./types"

export function KnowledgeCodeEditor({
  file,
  content,
  kind,
  onChange,
}: {
  file: KnowledgeFileContent
  content: string
  kind: KnowledgeFileKind
  onChange: (content: string) => void
}) {
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
      extensions={editorExtensions(file.name, kind)}
      className="knowledge-code-editor"
      onChange={onChange}
    />
  )
}

function editorExtensions(name: string, kind: KnowledgeFileKind) {
  const ext = fileExt(name)
  if (kind === "html") {
    return [html()]
  }
  if (ext === "json") {
    return [json()]
  }
  if (ext === "css" || ext === "scss" || ext === "less") {
    return [css()]
  }
  if (
    ext === "js" ||
    ext === "jsx" ||
    ext === "ts" ||
    ext === "tsx" ||
    ext === "vue"
  ) {
    return [javascript({ jsx: ext === "jsx" || ext === "tsx" })]
  }
  if (ext === "sql") {
    return [sql()]
  }
  if (ext === "xml") {
    return [xml()]
  }
  if (ext === "yaml" || ext === "yml") {
    return [yaml()]
  }
  return []
}
