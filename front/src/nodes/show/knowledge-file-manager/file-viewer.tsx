import { useEffect, useState } from "react"
import CodeMirror from "@uiw/react-codemirror"
import { css } from "@codemirror/lang-css"
import { html } from "@codemirror/lang-html"
import { javascript } from "@codemirror/lang-javascript"
import { json } from "@codemirror/lang-json"
import { sql } from "@codemirror/lang-sql"
import { xml } from "@codemirror/lang-xml"
import { yaml } from "@codemirror/lang-yaml"
import { FileArchive, FileText, ImageIcon, Music, Video } from "lucide-react"
import type { KnowledgeFileContent, KnowledgeFileViewerStatus } from "./types"
import { fileExt, resolveFileKind, type KnowledgeFileKind } from "./file-kind"
import {
  MarkdownLiveEditor,
  type MarkdownAttachmentUploadMany,
} from "./markdown-live-editor"

type FileViewerProps = {
  file: KnowledgeFileContent
  content: string
  downloadURL: string
  previewURL: string
  linkBaseURL: string
  onUploadAttachments: MarkdownAttachmentUploadMany
  onAttachmentError: (error: unknown) => void
  onStatusChange: (status: KnowledgeFileViewerStatus | null) => void
  onChange: (content: string) => void
}

export function KnowledgeFileViewer({
  file,
  content,
  downloadURL,
  previewURL,
  linkBaseURL,
  onUploadAttachments,
  onAttachmentError,
  onStatusChange,
  onChange,
}: FileViewerProps) {
  const kind = resolveFileKind(file)
  if (file.editable) {
    if (shouldUseMarkdownLiveEditor(file, kind)) {
      return (
        <MarkdownLiveEditor
          value={content}
          linkBaseURL={linkBaseURL}
          onUploadAttachments={onUploadAttachments}
          onAttachmentError={onAttachmentError}
          onStatusChange={onStatusChange}
          onChange={onChange}
        />
      )
    }
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
  return (
    <FilePreview
      file={file}
      kind={kind}
      downloadURL={downloadURL}
      previewURL={previewURL}
      onStatusChange={onStatusChange}
    />
  )
}

function shouldUseMarkdownLiveEditor(
  file: KnowledgeFileContent,
  kind: KnowledgeFileKind,
) {
  const ext = fileExt(file.name)
  if (kind === "markdown" || kind === "text") {
    return true
  }
  return !ext && kind === "unknown"
}

function FilePreview({
  file,
  kind,
  downloadURL,
  previewURL,
  onStatusChange,
}: {
  file: KnowledgeFileContent
  kind: KnowledgeFileKind
  downloadURL: string
  previewURL: string
  onStatusChange: (status: KnowledgeFileViewerStatus | null) => void
}) {
  if (kind === "image") {
    return (
      <ImagePreview
        file={file}
        previewURL={previewURL}
        onStatusChange={onStatusChange}
      />
    )
  }
  if (kind === "video") {
    return (
      <VideoPreview
        file={file}
        downloadURL={downloadURL}
        previewURL={previewURL}
        onStatusChange={onStatusChange}
      />
    )
  }
  if (kind === "audio") {
    return (
      <AudioPreview
        file={file}
        downloadURL={downloadURL}
        previewURL={previewURL}
        onStatusChange={onStatusChange}
      />
    )
  }
  if (kind === "pdf") {
    return (
      <FramePreview
        file={file}
        previewURL={previewURL}
        onStatusChange={onStatusChange}
      />
    )
  }
  return (
    <div className="knowledge-file-preview is-centered">
      {previewIcon(kind)}
      <strong>{file.name}</strong>
      <span>{previewText(kind)}</span>
      <a href={downloadURL} target="_blank" rel="noreferrer">
        下载文件
      </a>
    </div>
  )
}

function ImagePreview({
  file,
  previewURL,
  onStatusChange,
}: {
  file: KnowledgeFileContent
  previewURL: string
  onStatusChange: (status: KnowledgeFileViewerStatus | null) => void
}) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
  }, [previewURL])

  useViewerLoadingStatus(loading ? "图片加载中" : "", onStatusChange)

  return (
    <div className="knowledge-file-preview is-media">
      <img
        src={previewURL}
        alt={file.name}
        className={loading ? "is-loading" : ""}
        decoding="async"
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </div>
  )
}

function VideoPreview({
  file,
  downloadURL,
  previewURL,
  onStatusChange,
}: {
  file: KnowledgeFileContent
  downloadURL: string
  previewURL: string
  onStatusChange: (status: KnowledgeFileViewerStatus | null) => void
}) {
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setLoading(true)
    setFailed(false)
  }, [previewURL])

  useViewerLoadingStatus(loading ? "视频加载中" : "", onStatusChange)

  if (failed) {
    return (
      <div className="knowledge-file-preview is-centered">
        <Video size={42} />
        <strong>{file.name}</strong>
        <span>当前浏览器无法播放该视频，可能是编码格式不支持。可以下载后查看。</span>
        <a href={downloadURL} target="_blank" rel="noreferrer">
          下载文件
        </a>
      </div>
    )
  }

  return (
    <div className="knowledge-file-preview is-media">
      <video
        src={previewURL}
        controls
        preload="metadata"
        onLoadedData={() => setLoading(false)}
        onError={() => {
          setLoading(false)
          setFailed(true)
        }}
      />
    </div>
  )
}

function AudioPreview({
  file,
  downloadURL,
  previewURL,
  onStatusChange,
}: {
  file: KnowledgeFileContent
  downloadURL: string
  previewURL: string
  onStatusChange: (status: KnowledgeFileViewerStatus | null) => void
}) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
  }, [previewURL])

  useViewerLoadingStatus(loading ? "音频加载中" : "", onStatusChange)

  return (
    <div className="knowledge-file-preview is-centered">
      <Music size={42} />
      <strong>{file.name}</strong>
      <audio
        src={previewURL}
        controls
        onLoadedData={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </div>
  )
}

function FramePreview({
  file,
  previewURL,
  onStatusChange,
}: {
  file: KnowledgeFileContent
  previewURL: string
  onStatusChange: (status: KnowledgeFileViewerStatus | null) => void
}) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
  }, [previewURL])

  useViewerLoadingStatus(loading ? "文件加载中" : "", onStatusChange)

  return (
    <div className="knowledge-file-preview is-frame">
      <iframe src={previewURL} title={file.name} onLoad={() => setLoading(false)} />
    </div>
  )
}

function useViewerLoadingStatus(
  label: string,
  onStatusChange: (status: KnowledgeFileViewerStatus | null) => void,
) {
  useEffect(() => {
    onStatusChange(label ? { label } : null)
  }, [label, onStatusChange])

  useEffect(() => {
    return () => onStatusChange(null)
  }, [onStatusChange])
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
  if (ext === "js" || ext === "jsx" || ext === "ts" || ext === "tsx" || ext === "vue") {
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

function previewIcon(kind: KnowledgeFileKind) {
  if (kind === "office") {
    return <FileText size={42} />
  }
  if (kind === "archive") {
    return <FileArchive size={42} />
  }
  if (kind === "video") {
    return <Video size={42} />
  }
  if (kind === "image") {
    return <ImageIcon size={42} />
  }
  return <FileText size={42} />
}

function previewText(kind: KnowledgeFileKind) {
  if (kind === "office") {
    return "Office 文件当前支持下载和后续索引抽取，在线预览/编辑后续接 ONLYOFFICE。"
  }
  if (kind === "archive") {
    return "压缩包会保留原文件，后续可做批量导入和索引。"
  }
  return "该文件暂不支持在线编辑，可以下载查看。"
}
