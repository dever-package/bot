import { useEffect, useRef, useState } from "react"
import Vditor from "vditor"
import "vditor/dist/index.css"
import luteScriptURL from "vditor/dist/js/lute/lute.min.js?url"
import "vditor/dist/js/i18n/zh_CN.js"
import "vditor/dist/js/icons/ant.js"
import { attachmentMarkdown, isImageFileName } from "./attachment"
import type { KnowledgeFileViewerStatus } from "./types"

export type UploadedAttachment = {
  name: string
}

export type MarkdownAttachmentUploadMany = (files: File[]) => Promise<UploadedAttachment[]>

type MarkdownLiveEditorProps = {
  value: string
  linkBaseURL: string
  onChange: (content: string) => void
  onUploadAttachments: MarkdownAttachmentUploadMany
  onAttachmentError?: (error: unknown) => void
  onStatusChange: (status: KnowledgeFileViewerStatus | null) => void
}

const markdownToolbar = [
  "bold",
  "italic",
  "strike",
  "inline-code",
  "headings",
  "|",
  "list",
  "ordered-list",
  "check",
  "quote",
  "undo",
  "redo",
  "|",
  "link",
  "code",
  "table",
  "upload",
]

// Vditor derives IR inline padding from preview.maxWidth. CSS owns the final
// content inset so the scrollbar can stay at the far right.
const editorPreviewMaxWidth = 860
const vditorLuteScriptID = "vditorLuteScript"
const vditorIconScriptID = "vditorIconScript"
let vditorRuntimePreload: Promise<void> | null = null

const toolbarButtonTips: Record<string, string> = {
  bold: "加粗",
  italic: "斜体",
  strike: "删除线",
  "inline-code": "行内代码",
  headings: "标题",
  list: "无序列表",
  "ordered-list": "有序列表",
  check: "任务列表",
  quote: "引用",
  undo: "撤销",
  redo: "重做",
  link: "链接",
  code: "代码块",
  table: "表格",
  upload: "上传附件",
}

export function preloadMarkdownLiveEditorRuntime() {
  if (typeof document === "undefined") {
    return Promise.resolve()
  }
  ensureLocalVditorAssets()
  return preloadVditorLute()
}

export function MarkdownLiveEditor({
  value,
  linkBaseURL,
  onChange,
  onUploadAttachments,
  onAttachmentError,
  onStatusChange,
}: MarkdownLiveEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<Vditor | null>(null)
  const editorReadyRef = useRef(false)
  const latestValueRef = useRef(value)
  const onChangeRef = useRef(onChange)
  const onUploadAttachmentsRef = useRef(onUploadAttachments)
  const onAttachmentErrorRef = useRef(onAttachmentError)
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [editorReady, setEditorReady] = useState(false)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    onUploadAttachmentsRef.current = onUploadAttachments
  }, [onUploadAttachments])

  useEffect(() => {
    onAttachmentErrorRef.current = onAttachmentError
  }, [onAttachmentError])

  useEffect(() => {
    latestValueRef.current = value
    const editor = editorRef.current
    if (editor && editor.getValue() !== value) {
      editor.setValue(value, true)
    }
  }, [value])

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    let disposed = false
    let editor: Vditor | null = null
    editorReadyRef.current = false
    setEditorReady(false)

    const initializeEditor = async () => {
      try {
        await preloadMarkdownLiveEditorRuntime()
      } catch {
        // Let Vditor retry its own loader below; it shows its built-in error tip on failure.
      }
      if (disposed) {
        return
      }
      editor = new Vditor(container, {
        value: latestValueRef.current,
        mode: "ir",
        height: "100%",
        width: "100%",
        lang: "zh_CN",
        i18n: window.VditorI18n,
        _lutePath: luteScriptURL,
        icon: "ant",
        cache: { enable: false },
        resize: { enable: false },
        toolbar: markdownToolbarItems(),
        toolbarConfig: {
          hide: false,
          pin: true,
        },
        preview: {
          delay: 200,
          maxWidth: editorPreviewMaxWidth,
          markdown: {
            toc: true,
            footnotes: true,
            codeBlockPreview: true,
            mathBlockPreview: false,
            sanitize: true,
            linkBase: linkBaseURL,
          },
          hljs: {
            enable: false,
            lineNumber: false,
          },
          render: {
            media: {
              enable: true,
            },
          },
        },
        upload: {
          multiple: true,
          handler: async (files) => {
            await insertAttachments({
              files,
              editor,
              onUploadAttachments: onUploadAttachmentsRef.current,
              onUploadingChange: setUploading,
              onError: onAttachmentErrorRef.current,
            })
            return null
          },
        },
        input: (content) => {
          latestValueRef.current = content
          onChangeRef.current(content)
        },
        after: () => {
          if (!editor) {
            return
          }
          if (disposed) {
            editor.destroy()
            return
          }
          editorReadyRef.current = true
          editorRef.current = editor
          setEditorReady(true)
        },
      })
    }

    void initializeEditor()

    return () => {
      disposed = true
      if (editorRef.current === editor) {
        editorRef.current = null
      }
      if (editorReadyRef.current) {
        editor?.destroy()
      }
      editorReadyRef.current = false
    }
  }, [linkBaseURL])

  useEffect(() => {
    const container = containerRef.current
    if (!container) {
      return
    }

    const handlePaste = (event: ClipboardEvent) => {
      const files = filesFromClipboard(event.clipboardData)
      if (!files.length) {
        return
      }
      event.preventDefault()
      void insertAttachments({
        files,
        editor: editorRef.current,
        onUploadAttachments: onUploadAttachmentsRef.current,
        onUploadingChange: setUploading,
        onError: onAttachmentErrorRef.current,
      })
    }

    const handleDragOver = (event: DragEvent) => {
      if (!hasDraggedFiles(event)) {
        return
      }
      event.preventDefault()
      setDragging(true)
    }

    const handleDragLeave = (event: DragEvent) => {
      if (!container.contains(event.relatedTarget as Node | null)) {
        setDragging(false)
      }
    }

    const handleDrop = (event: DragEvent) => {
      const files = Array.from(event.dataTransfer?.files || [])
      if (!files.length) {
        setDragging(false)
        return
      }
      event.preventDefault()
      setDragging(false)
      void insertAttachments({
        files,
        editor: editorRef.current,
        onUploadAttachments: onUploadAttachmentsRef.current,
        onUploadingChange: setUploading,
        onError: onAttachmentErrorRef.current,
      })
    }

    container.addEventListener("paste", handlePaste, true)
    container.addEventListener("dragover", handleDragOver, true)
    container.addEventListener("dragleave", handleDragLeave, true)
    container.addEventListener("drop", handleDrop, true)

    return () => {
      container.removeEventListener("paste", handlePaste, true)
      container.removeEventListener("dragover", handleDragOver, true)
      container.removeEventListener("dragleave", handleDragLeave, true)
      container.removeEventListener("drop", handleDrop, true)
    }
  }, [])

  const loadingEditor = !editorReady && !uploading
  const statusLabel = uploading ? "正在上传附件" : loadingEditor ? "编辑器加载中" : ""

  useEffect(() => {
    onStatusChange(statusLabel ? { label: statusLabel } : null)
  }, [onStatusChange, statusLabel])

  useEffect(() => {
    return () => onStatusChange(null)
  }, [onStatusChange])

  return (
    <div className={`knowledge-markdown-editor${dragging ? " is-dragging" : ""}`}>
      <div ref={containerRef} className="knowledge-vditor-editor" />
    </div>
  )
}

async function insertAttachments({
  files,
  editor,
  onUploadAttachments,
  onUploadingChange,
  onError,
}: {
  files: File[]
  editor: Vditor | null
  onUploadAttachments: MarkdownAttachmentUploadMany
  onUploadingChange: (uploading: boolean) => void
  onError?: (error: unknown) => void
}) {
  if (!editor) {
    onError?.(new Error("编辑器正在初始化，请稍后再试"))
    return
  }
  onUploadingChange(true)
  try {
    const uploadedFiles = await onUploadAttachments(files)
    const snippets = uploadedFiles
      .map((uploaded) => {
        const kind = isImageFileName(uploaded.name) ? "image" : "file"
        return attachmentMarkdown(uploaded.name, kind)
      })
      .filter(Boolean)
    if (!snippets.length) {
      return
    }
    const insert = `${snippets.join("\n")}\n`
    editor?.insertMD(insert)
    editor?.focus()
  } catch (error) {
    onError?.(error)
  } finally {
    onUploadingChange(false)
  }
}

function filesFromClipboard(data: DataTransfer | null) {
  if (!data) {
    return []
  }
  const files = Array.from(data.files || [])
  if (files.length) {
    return files
  }
  return Array.from(data.items || [])
    .filter((item) => item.kind === "file")
    .map((item) => item.getAsFile())
    .filter((file): file is File => Boolean(file))
}

function hasDraggedFiles(event: DragEvent) {
  return Array.from(event.dataTransfer?.types || []).includes("Files")
}

function ensureLocalVditorAssets() {
  if (document.getElementById(vditorIconScriptID)) {
    return
  }
  const marker = document.createElement("script")
  marker.id = vditorIconScriptID
  marker.type = "application/javascript"
  document.head.appendChild(marker)
}

function preloadVditorLute() {
  if (document.getElementById(vditorLuteScriptID)) {
    return Promise.resolve()
  }
  if (vditorRuntimePreload) {
    return vditorRuntimePreload
  }
  vditorRuntimePreload = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script")
    script.src = luteScriptURL
    script.async = true
    script.onload = () => {
      const loadedByAnotherCaller = document.getElementById(vditorLuteScriptID)
      if (loadedByAnotherCaller) {
        script.remove()
      } else {
        script.id = vditorLuteScriptID
      }
      resolve()
    }
    script.onerror = () => {
      script.remove()
      vditorRuntimePreload = null
      reject(new Error("Vditor Lute 加载失败"))
    }
    document.head.appendChild(script)
  })
  return vditorRuntimePreload
}

function markdownToolbarItems() {
  return markdownToolbar.map((name) => {
    if (name === "|") {
      return name
    }
    return {
      name,
      tip: toolbarButtonTips[name] || name,
      tipPosition: "s",
    }
  })
}
