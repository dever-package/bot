import { lazy, Suspense, useEffect, useState, type ReactNode } from "react"
import { FileArchive, FileText, ImageIcon, Music, Video } from "lucide-react"
import { FirstFrameVideo } from "../../shared/first-frame-video"
import type {
  KnowledgeAttachmentUploadMany,
  KnowledgeFileContent,
  KnowledgeFileViewerStatus,
} from "./types"
import { resolveFileKind, type KnowledgeFileKind } from "./file-kind"

const KnowledgeCodeEditor = lazy(() =>
  import("./code-editor").then((module) => ({
    default: module.KnowledgeCodeEditor,
  })),
)

const MarkdownLiveEditor = lazy(() =>
  import("./markdown-live-editor").then((module) => ({
    default: module.MarkdownLiveEditor,
  })),
)

type FileViewerProps = {
  active: boolean
  file: KnowledgeFileContent | null
  content: string
  downloadURL: string
  previewURL: string
  linkBaseURL: string
  onUploadAttachments: KnowledgeAttachmentUploadMany
  onAttachmentError: (error: unknown) => void
  onStatusChange: (status: KnowledgeFileViewerStatus | null) => void
  onChange: (content: string) => void
}

export function KnowledgeFileViewer({
  active,
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
  const kind = file ? resolveFileKind(file) : null
  const markdownActive = Boolean(
    active && file?.editable && kind && shouldUseMarkdownLiveEditor(kind),
  )
  let fileView: ReactNode = null

  if (markdownActive && file) {
    fileView = (
      <Suspense fallback={<EditorModuleLoading onStatusChange={onStatusChange} />}>
        <MarkdownLiveEditor
          active
          value={content}
          linkBaseURL={linkBaseURL}
          onUploadAttachments={onUploadAttachments}
          onAttachmentError={onAttachmentError}
          onStatusChange={onStatusChange}
          onChange={onChange}
        />
      </Suspense>
    )
  } else if (active && file && kind) {
    if (file.editable) {
      fileView = (
        <Suspense fallback={<EditorModuleLoading onStatusChange={onStatusChange} />}>
          <KnowledgeCodeEditor
            file={file}
            content={content}
            kind={kind}
            onChange={onChange}
          />
        </Suspense>
      )
    } else if (!file.editable) {
      fileView = (
        <FilePreview
          file={file}
          kind={kind}
          downloadURL={downloadURL}
          previewURL={previewURL}
          onStatusChange={onStatusChange}
        />
      )
    }
  }

  return fileView
}

function shouldUseMarkdownLiveEditor(kind: KnowledgeFileKind) {
  return kind === "markdown"
}

function EditorModuleLoading({
  onStatusChange,
}: {
  onStatusChange: (status: KnowledgeFileViewerStatus | null) => void
}) {
  useViewerLoadingStatus("编辑器加载中", onStatusChange)
  return (
    <div className="knowledge-file-preview is-centered" aria-live="polite">
      <FileText size={42} />
      <strong>编辑器加载中</strong>
    </div>
  )
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
      <FirstFrameVideo
        src={previewURL}
        controls
        preload="metadata"
        onFirstFrameReady={() => setLoading(false)}
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
