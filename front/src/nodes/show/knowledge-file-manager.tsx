import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
  type CSSProperties,
} from "react"
import {
  ControlledTreeEnvironment,
  Tree,
  type DraggingPosition,
  type TreeItem,
  type TreeItemIndex,
  type TreeItemRenderContext,
} from "react-complex-tree"
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Download,
  FileText,
  Folder,
  FolderPlus,
  MoreVertical,
  Network,
  Plus,
  RefreshCw,
  Save,
  Search,
  Timer,
  Trash2,
  Upload,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/confirm-dialog"
import { Input } from "@/components/ui/input"
import type { NodeItemProps } from "@/page/nodes"
import {
  createFile,
  deleteFiles,
  downloadFileBaseURL,
  downloadFileURL,
  indexKnowledgeBase,
  loadFileContent,
  loadFileIndexDetail,
  loadFileManagerData,
  loadKnowledgeRetrieveDebug,
  moveFiles,
  previewFileURL,
  renameFile,
  saveFile,
  uploadFilePart,
} from "./knowledge-file-manager/api"
import {
  currentFileDirectoryID,
  uniqueAttachmentName,
} from "./knowledge-file-manager/attachment"
import { KnowledgeFileViewer } from "./knowledge-file-manager/file-viewer"
import {
  preloadMarkdownLiveEditorRuntime,
  type UploadedAttachment,
} from "./knowledge-file-manager/markdown-live-editor"
import { KnowledgeIndexMap } from "./knowledge-file-manager/index-map"
import "./knowledge-file-manager/styles.css"
import type {
  KnowledgeFileContent,
  KnowledgeFileIndexDetail,
  KnowledgeFileItem,
  KnowledgeFileManagerData,
  KnowledgeFileViewerStatus,
  KnowledgeRetrieveDebugResult,
  KnowledgeTreeNode,
} from "./knowledge-file-manager/types"

type ContextMenuState = {
  x: number
  y: number
  node: KnowledgeTreeNode | null
} | null

type CreateNodeDialogState = {
  type: "file" | "folder"
  parent: string
}

type IndexStatus = "pending" | "running" | "success" | "failed" | ""

type DraftState = {
  id: string
  name: string
  content: string
  dirty: boolean
}

type OpeningFileState = {
  name: string
}

type UploadProgressState = {
  active: boolean
  currentFile: string
  currentIndex: number
  total: number
  percent: number
  status: "reading" | "uploading" | "done" | "error"
}

const rootNodeID = "/"
const treeID = "knowledge-files"
const defaultFileName = "未命名文档.md"
const defaultFolderName = "新建文件夹"
const expandedStoragePrefix = "dever:bot:knowledge-file-manager:expanded:"
const lastOpenedStoragePrefix = "dever:bot:knowledge-file-manager:last-opened:"
const contextMenuViewportMargin = 8
const contextMenuFallbackWidth = 168
const contextMenuFallbackHeight = 184
const uploadChunkSize = 512 * 1024
const indexPollInterval = 2400

export function ShowKnowledgeFileManager({ item }: NodeItemProps) {
  const meta = item.meta ?? {}
  const knowledgeBaseID = useMemo(() => resolveKnowledgeBaseID(meta), [meta])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const uploadParentRef = useRef(rootNodeID)
  const restoredKnowledgeBaseRef = useRef(0)
  const openFileRequestRef = useRef(0)
  const [data, setData] = useState<KnowledgeFileManagerData>({})
  const [expanded, setExpanded] = useState<Set<string>>(() =>
    loadExpandedFolderIDs(knowledgeBaseID),
  )
  const [selectedID, setSelectedID] = useState("")
  const [focusedID, setFocusedID] = useState("")
  const [currentFile, setCurrentFile] = useState<KnowledgeFileContent | null>(null)
  const [openingFile, setOpeningFile] = useState<OpeningFileState | null>(null)
  const [draft, setDraft] = useState<DraftState | null>(null)
  const [viewerStatus, setViewerStatus] = useState<KnowledgeFileViewerStatus | null>(null)
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [indexing, setIndexing] = useState(false)
  const [indexDetail, setIndexDetail] = useState<KnowledgeFileIndexDetail | null>(null)
  const [indexDetailOpen, setIndexDetailOpen] = useState(false)
  const [indexDetailLoading, setIndexDetailLoading] = useState(false)
  const [indexMapOpen, setIndexMapOpen] = useState(false)
  const [indexConfirmOpen, setIndexConfirmOpen] = useState(false)
  const [retrieveTestOpen, setRetrieveTestOpen] = useState(false)
  const [createDialog, setCreateDialog] = useState<CreateNodeDialogState | null>(null)
  const [creatingNode, setCreatingNode] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<UploadProgressState | null>(null)
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null)

  const baseName = data.base?.name || "知识库"
  const baseIndexStatus = normalizeFrontendIndexStatus(data.base?.index_status)
  const tree = useMemo(() => buildTree(data.files || []), [data.files])
  const visibleTree = useMemo(() => filterTree(tree, query), [query, tree])
  const flatTree = useMemo(() => flattenTree(tree), [tree])
  const treeItems = useMemo(
    () => buildComplexTreeItems(visibleTree, baseName),
    [baseName, visibleTree],
  )
  const selectedNode = useMemo(
    () => (selectedID ? findNode(tree, selectedID) : null),
    [selectedID, tree],
  )
  const focusedNode = useMemo(
    () => (focusedID ? findNode(tree, focusedID) : null),
    [focusedID, tree],
  )
  const hasRunningIndex = baseIndexStatus === "running"
  const indexBusy = indexing || hasRunningIndex
  const enhancedIndexMode = Number(data.base?.concept_graph_enabled) === 1
  const indexActionText = enhancedIndexMode ? "更新增强索引" : "更新搜索索引"
  const currentIndexStatus = normalizeFrontendIndexStatus(currentFile?.index_status)
  const indexButtonText = indexBusy ? "索引中" : indexActionText
  const reloadFiles = useCallback(async () => {
    if (!knowledgeBaseID) {
      return
    }
    setLoading(true)
    try {
      setData(await loadFileManagerData({ knowledgeBaseID }))
    } catch (error) {
      toast.error(errorMessage(error, "加载知识库失败"))
    } finally {
      setLoading(false)
    }
  }, [knowledgeBaseID])

  useEffect(() => {
    void reloadFiles()
  }, [reloadFiles])

  useEffect(() => {
    if (!knowledgeBaseID || !hasRunningIndex) {
      return
    }
    const timer = window.setInterval(() => {
      void reloadFiles()
    }, indexPollInterval)
    return () => window.clearInterval(timer)
  }, [hasRunningIndex, knowledgeBaseID, reloadFiles])

  useEffect(() => {
    if (!currentFile) {
      return
    }
    const node = findNode(tree, currentFile.id)
    if (!node || node.type !== "file" || node.index_status === currentFile.index_status) {
      return
    }
    setCurrentFile({ ...currentFile, index_status: node.index_status })
  }, [currentFile, tree])

  useEffect(() => {
    void preloadMarkdownLiveEditorRuntime()
  }, [])

  useEffect(() => {
    setExpanded(loadExpandedFolderIDs(knowledgeBaseID))
    setSelectedID("")
    setFocusedID("")
    setCurrentFile(null)
    setOpeningFile(null)
    setDraft(null)
    setViewerStatus(null)
    setIndexDetail(null)
    setIndexDetailOpen(false)
    setIndexMapOpen(false)
    setIndexConfirmOpen(false)
    setRetrieveTestOpen(false)
    setCreateDialog(null)
    setCreatingNode(false)
    openFileRequestRef.current += 1
    restoredKnowledgeBaseRef.current = 0
  }, [knowledgeBaseID])

  useEffect(() => {
    const close = () => setContextMenu(null)
    window.addEventListener("click", close)
    window.addEventListener("resize", close)
    window.addEventListener("scroll", close, true)
    return () => {
      window.removeEventListener("click", close)
      window.removeEventListener("resize", close)
      window.removeEventListener("scroll", close, true)
    }
  }, [])

  const backToList = useCallback(() => {
    if (draft?.dirty && !window.confirm("当前文件尚未保存，确定返回上一页吗？")) {
      return
    }
    if (window.history.length > 1) {
      window.history.back()
      return
    }
    window.location.href = "/bot/agent/knowledge_base/list"
  }, [draft?.dirty])

  const updateExpandedFolders = useCallback(
    (updater: (current: Set<string>) => Set<string>) => {
      setExpanded((current) => {
        const next = updater(current)
        saveExpandedFolderIDs(knowledgeBaseID, next)
        return next
      })
    },
    [knowledgeBaseID],
  )

  const openFile = useCallback(
    async (node: KnowledgeTreeNode) => {
      if (!knowledgeBaseID || node.type !== "file") {
        return
      }
      const previousSelectedID = selectedID
      const previousFocusedID = focusedID
      const previousFile = currentFile
      const previousDraft = draft
      const requestID = openFileRequestRef.current + 1
      openFileRequestRef.current = requestID
      setSelectedID(node.id)
      setFocusedID(node.id)
      setViewerStatus(null)
      setIndexDetail(null)
      setIndexDetailOpen(false)
      setOpeningFile({ name: node.name || basename(node.id) })
      updateExpandedFolders((current) => expandParentFolders(current, node.id))
      try {
        const detail = await loadFileContent({ knowledgeBaseID, id: node.id })
        if (openFileRequestRef.current !== requestID) {
          return
        }
        setSelectedID(node.id)
        setFocusedID(node.id)
        saveLastOpenedFileID(knowledgeBaseID, node.id)
        setCurrentFile(detail)
        setOpeningFile(null)
        setDraft({
          id: detail.id,
          name: detail.name,
          content: detail.content || "",
          dirty: false,
        })
      } catch (error) {
        if (openFileRequestRef.current === requestID) {
          setSelectedID(previousSelectedID)
          setFocusedID(previousFocusedID)
          setCurrentFile(previousFile)
          setDraft(previousDraft)
          setOpeningFile(null)
          toast.error(errorMessage(error, "打开文件失败"))
        }
      }
    },
    [currentFile, draft, focusedID, knowledgeBaseID, selectedID, updateExpandedFolders],
  )

  const openCreateDialog = useCallback(
    (type: "file" | "folder", parentID?: string) => {
      if (!knowledgeBaseID) {
        return
      }
      setCreateDialog({ type, parent: parentID || rootNodeID })
    },
    [knowledgeBaseID],
  )

  const createNode = useCallback(
    async (type: "file" | "folder", parent: string, name: string) => {
      const trimmedName = name.trim()
      if (!knowledgeBaseID || !trimmedName) {
        return false
      }
      try {
        const result = await createFile({
          knowledgeBaseID,
          parent,
          name: trimmedName,
          type,
        })
        setData(result)
        updateExpandedFolders((current) => new Set(current).add(parent))
        if (type === "file" && result.new_id) {
          const created = findNode(buildTree(result.files || []), result.new_id)
          if (created) {
            await openFile(created)
          }
        }
        toast.success(type === "folder" ? "文件夹已创建" : "文件已创建")
        return true
      } catch (error) {
        toast.error(errorMessage(error, "创建失败"))
        return false
      }
    },
    [knowledgeBaseID, openFile, updateExpandedFolders],
  )

  const submitCreateNode = useCallback(
    async (name: string) => {
      if (!createDialog || creatingNode) {
        return
      }
      setCreatingNode(true)
      try {
        const created = await createNode(createDialog.type, createDialog.parent, name)
        if (created) {
          setCreateDialog(null)
        }
      } finally {
        setCreatingNode(false)
      }
    },
    [createDialog, createNode, creatingNode],
  )

  const renameNode = useCallback(
    async (node: KnowledgeTreeNode) => {
      if (!knowledgeBaseID) {
        return
      }
      const name = window.prompt("新名称", node.name)
      if (!name?.trim() || name.trim() === node.name) {
        return
      }
      try {
        const result = await renameFile({ knowledgeBaseID, id: node.id, name: name.trim() })
        setData(result)
        const nextID = result.new_id || node.id
        if (selectedID === node.id) {
          setSelectedID(normalizeID(nextID))
          saveLastOpenedFileID(knowledgeBaseID, nextID)
          if (node.type === "file" && currentFile) {
            const renamed = findNode(buildTree(result.files || []), nextID)
            setCurrentFile({
              ...currentFile,
              id: nextID,
              name: name.trim(),
              index_status: renamed?.index_status || currentFile.index_status,
            })
            setDraft((value) =>
              value ? { ...value, id: nextID, name: name.trim(), dirty: value.dirty } : value,
            )
          }
        }
        toast.success("已重命名")
      } catch (error) {
        toast.error(errorMessage(error, "重命名失败"))
      }
    },
    [currentFile, knowledgeBaseID, selectedID],
  )

  const deleteNode = useCallback(
    async (node: KnowledgeTreeNode) => {
      if (!knowledgeBaseID || !window.confirm(`确定删除「${node.name}」吗？`)) {
        return
      }
      try {
        setData(await deleteFiles({ knowledgeBaseID, ids: [node.id] }))
        if (selectedID === node.id || isNodeAncestor(node, selectedID)) {
          setSelectedID("")
          setCurrentFile(null)
          setOpeningFile(null)
          setDraft(null)
          setViewerStatus(null)
          setIndexDetail(null)
          setIndexDetailOpen(false)
        }
        const lastOpenedID = loadLastOpenedFileID(knowledgeBaseID)
        if (lastOpenedID && (lastOpenedID === node.id || isNodeAncestor(node, lastOpenedID))) {
          clearLastOpenedFileID(knowledgeBaseID)
        }
        toast.success("已删除")
      } catch (error) {
        toast.error(errorMessage(error, "删除失败"))
      }
    },
    [knowledgeBaseID, selectedID],
  )

  const saveCurrentFile = useCallback(async () => {
    if (!knowledgeBaseID || !draft || !currentFile) {
      return
    }
    setSaving(true)
    try {
      let nextID = draft.id
      const nextName = draft.name.trim()
      if (nextName && nextName !== currentFile.name) {
        const renamed = await renameFile({
          knowledgeBaseID,
          id: currentFile.id,
          name: nextName,
        })
        setData(renamed)
        nextID = renamed.new_id || currentFile.id
      }
      const saved = currentFile.editable
        ? await saveFile({
            knowledgeBaseID,
            id: nextID,
            content: draft.content,
          })
        : await loadFileContent({ knowledgeBaseID, id: nextID })
      setSelectedID(normalizeID(saved.id))
      saveLastOpenedFileID(knowledgeBaseID, saved.id)
      setCurrentFile(saved)
      setIndexDetail(null)
      setIndexDetailOpen(false)
      setDraft({
        id: saved.id,
        name: saved.name,
        content: saved.content || "",
        dirty: false,
      })
      await reloadFiles()
      toast.success("已保存")
    } catch (error) {
      toast.error(errorMessage(error, "保存失败"))
    } finally {
      setSaving(false)
    }
  }, [currentFile, draft, knowledgeBaseID, reloadFiles])

  const runKnowledgeIndex = useCallback(
    async () => {
      if (!knowledgeBaseID || indexBusy) {
        return
      }
      setIndexConfirmOpen(false)
      setIndexing(true)
      try {
        await indexKnowledgeBase({ knowledgeBaseID })
        setData(markKnowledgeIndexRunning)
        toast.success(enhancedIndexMode ? "已开始更新增强索引" : "已开始更新搜索索引")
        await reloadFiles()
      } catch (error) {
        toast.error(errorMessage(error, "索引启动失败"))
      } finally {
        setIndexing(false)
      }
    },
    [enhancedIndexMode, indexBusy, knowledgeBaseID, reloadFiles],
  )

  const openFileIndexDetail = useCallback(async () => {
    if (!knowledgeBaseID || !currentFile) {
      return
    }
    setIndexDetailOpen(true)
    setIndexDetailLoading(true)
    setIndexDetail(null)
    try {
      setIndexDetail(await loadFileIndexDetail({ knowledgeBaseID, id: currentFile.id }))
    } catch (error) {
      toast.error(errorMessage(error, "加载索引详情失败"))
    } finally {
      setIndexDetailLoading(false)
    }
  }, [currentFile, knowledgeBaseID])

  const moveNode = useCallback(
    async (sourceID: string, targetID: string) => {
      if (!knowledgeBaseID) {
        return
      }
      const source = findNode(tree, sourceID)
      const target = targetID === rootNodeID ? null : findNode(tree, targetID)
      if (!source || source.id === rootNodeID || (target && target.type !== "folder")) {
        return
      }
      const targetFolderID = target?.id || rootNodeID
      if (source.id === targetFolderID || targetFolderID.startsWith(`${source.id}/`)) {
        toast.error("不能移动到自身或子目录下")
        return
      }
      try {
        setData(await moveFiles({ knowledgeBaseID, ids: [source.id], target: targetFolderID }))
        updateExpandedFolders((current) => new Set(current).add(targetFolderID))
        const lastOpenedID = loadLastOpenedFileID(knowledgeBaseID)
        if (lastOpenedID && (lastOpenedID === source.id || isNodeAncestor(source, lastOpenedID))) {
          clearLastOpenedFileID(knowledgeBaseID)
        }
        if (selectedID === source.id || selectedID.startsWith(`${source.id}/`)) {
          setSelectedID("")
          setCurrentFile(null)
          setOpeningFile(null)
          setDraft(null)
          setViewerStatus(null)
          setIndexDetail(null)
          setIndexDetailOpen(false)
          clearLastOpenedFileID(knowledgeBaseID)
        }
        toast.success("已移动")
      } catch (error) {
        toast.error(errorMessage(error, "移动失败"))
      }
    },
    [knowledgeBaseID, selectedID, tree, updateExpandedFolders],
  )

  const openUploadDialog = useCallback(
    (parentID?: string) => {
      const fallbackParent =
        focusedNode?.type === "folder"
          ? focusedNode.id
          : selectedNode?.type === "folder"
            ? selectedNode.id
            : parentIDOf(selectedID)
      uploadParentRef.current = parentID || fallbackParent || rootNodeID
      fileInputRef.current?.click()
    },
    [focusedNode, selectedID, selectedNode],
  )

  const uploadFiles = useCallback(
    async (files: FileList | null) => {
      if (!knowledgeBaseID || !files?.length) {
        return
      }
      const parent = uploadParentRef.current || rootNodeID
      const fileList = Array.from(files)
      try {
        let latest: KnowledgeFileManagerData | null = null
        for (let index = 0; index < fileList.length; index += 1) {
          const file = fileList[index]
          if (!file) {
            continue
          }
          setUploadProgress({
            active: true,
            currentFile: file.name,
            currentIndex: index + 1,
            total: fileList.length,
            percent: fileUploadPercent(index, fileList.length, 0),
            status: "uploading",
          })
          latest = await uploadKnowledgeFile({
            knowledgeBaseID,
            parent,
            file,
            name: file.name,
            onProgress: (fileRatio) => {
              setUploadProgress({
                active: true,
                currentFile: file.name,
                currentIndex: index + 1,
                total: fileList.length,
                percent: fileUploadPercent(index, fileList.length, fileRatio),
                status: "uploading",
              })
            },
          })
          setUploadProgress({
            active: true,
            currentFile: file.name,
            currentIndex: index + 1,
            total: fileList.length,
            percent: fileUploadPercent(index, fileList.length, 1),
            status: "uploading",
          })
        }
        if (latest) {
          setData(latest)
        }
        updateExpandedFolders((current) => new Set(current).add(parent))
        setUploadProgress({
          active: false,
          currentFile: fileList[fileList.length - 1]?.name || "",
          currentIndex: fileList.length,
          total: fileList.length,
          percent: 100,
          status: "done",
        })
        toast.success("上传完成")
      } catch (error) {
        setUploadProgress((current) =>
          current
            ? {
                ...current,
                active: false,
                status: "error",
              }
            : null,
        )
        toast.error(errorMessage(error, "上传失败"))
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        window.setTimeout(() => {
          setUploadProgress((current) =>
            current && !current.active ? null : current,
          )
        }, 1800)
      }
    },
    [knowledgeBaseID, updateExpandedFolders],
  )

  const toggleFolder = useCallback((id: string) => {
    updateExpandedFolders((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [updateExpandedFolders])

  const selectNode = useCallback(
    (node: KnowledgeTreeNode) => {
      setFocusedID(node.id)
      if (node.type === "folder") {
        toggleFolder(node.id)
        return
      }
      setSelectedID(node.id)
      void openFile(node)
    },
    [openFile, toggleFolder],
  )

  const markSelectedNode = useCallback((node: KnowledgeTreeNode) => {
    setSelectedID(node.id)
    setFocusedID(node.id)
  }, [])

  useEffect(() => {
    if (
      !knowledgeBaseID ||
      selectedID ||
      restoredKnowledgeBaseRef.current === knowledgeBaseID ||
      !data.files ||
      data.base?.id !== knowledgeBaseID
    ) {
      return
    }

    const lastOpenedID = loadLastOpenedFileID(knowledgeBaseID)
    if (!lastOpenedID) {
      restoredKnowledgeBaseRef.current = knowledgeBaseID
      return
    }

    const node = findNode(tree, lastOpenedID)
    restoredKnowledgeBaseRef.current = knowledgeBaseID
    if (!node || node.type !== "file") {
      clearLastOpenedFileID(knowledgeBaseID)
      return
    }

    updateExpandedFolders((current) => expandParentFolders(current, node.id))
    void openFile(node)
  }, [data.files, knowledgeBaseID, openFile, selectedID, tree, updateExpandedFolders])

  const expandedIDs = useMemo(() => {
    if (!query.trim()) {
      return expandedIDsInTreeItems(expanded, treeItems)
    }
    return Array.from(folderIDsInTree(visibleTree))
  }, [expanded, query, treeItems, visibleTree])

  const selectedIDs =
    selectedID && selectedNode?.type === "file" && treeItems[selectedID] ? [selectedID] : []
  const rawFocusedID = focusedID || selectedID
  const focusedItemID = rawFocusedID && treeItems[rawFocusedID] ? rawFocusedID : rootNodeID
  const currentFileDownloadURL = currentFile
    ? downloadFileURL(knowledgeBaseID, currentFile.id)
    : ""
  const currentFilePreviewURL = currentFile
    ? previewFileURL(knowledgeBaseID, currentFile.id)
    : ""
  const currentFileLinkBaseURL = currentFile
    ? downloadFileBaseURL(knowledgeBaseID, currentFileDirectoryID(currentFile.id))
    : ""
  const hasOpenedFile = Boolean(draft && currentFile)
  const fileViewerActive = hasOpenedFile && !openingFile
  const uploadEditorAttachments = useCallback(
    async (files: File[]): Promise<UploadedAttachment[]> => {
      if (!knowledgeBaseID || !currentFile) {
        throw new Error("请先打开一个文档")
      }
      const parent = currentFileDirectoryID(currentFile.id)
      const reservedNames = new Set<string>()
      const uploaded: UploadedAttachment[] = []
      let latest: KnowledgeFileManagerData | null = null
      for (const file of files) {
        const name = uniqueAttachmentName(flatTree, parent, file.name, reservedNames)
        reservedNames.add(name)
        latest = await uploadKnowledgeFile({
          knowledgeBaseID,
          parent,
          file,
          name,
        })
        uploaded.push({ name })
      }
      if (latest) {
        setData(latest)
      }
      updateExpandedFolders((current) => new Set(current).add(parent))
      return uploaded
    },
    [currentFile, flatTree, knowledgeBaseID, updateExpandedFolders],
  )

  const handleContextMenu = useCallback((event: MouseEvent, node: KnowledgeTreeNode | null) => {
    event.preventDefault()
    event.stopPropagation()
    setIndexConfirmOpen(false)
    setContextMenu({ x: event.clientX, y: event.clientY, node })
  }, [])

  if (!knowledgeBaseID) {
    return <div className="knowledge-shell__empty">未找到知识库ID</div>
  }

  return (
    <div className="knowledge-shell" onContextMenu={(event) => event.preventDefault()}>
      <header className="knowledge-toolbar">
        <div className="knowledge-toolbar__title">
          <span>{baseName}</span>
          <small>{data.files?.length || 0} 个节点</small>
        </div>
        <div className="knowledge-toolbar__actions">
          <Button
            variant="ghost"
            size="sm"
            className="knowledge-toolbar__back"
            onClick={backToList}
          >
            <ArrowLeft size={16} />
            返回上一页
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIndexMapOpen(true)}
          >
            <Network size={16} />
            知识地图
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRetrieveTestOpen(true)}
          >
            <Search size={16} />
            测试检索
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setContextMenu(null)
              setIndexConfirmOpen(true)
            }}
            disabled={indexBusy}
          >
            <Network size={16} />
            {indexButtonText}
          </Button>
          <Button variant="outline" size="sm" onClick={() => openCreateDialog("folder")}>
            <FolderPlus size={16} />
            文件夹
          </Button>
          <Button variant="outline" size="sm" onClick={() => openCreateDialog("file")}>
            <Plus size={16} />
            文件
          </Button>
          <Button variant="outline" size="sm" onClick={() => openUploadDialog()}>
            <Upload size={16} />
            上传
          </Button>
          <Button variant="outline" size="sm" onClick={() => void reloadFiles()}>
            <RefreshCw size={16} />
          </Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          hidden
          onChange={(event) => void uploadFiles(event.target.files)}
        />
      </header>

      <main className="knowledge-workspace">
        <aside
          className="knowledge-sidebar"
          onContextMenu={(event) => handleContextMenu(event, null)}
        >
          <div
            className="knowledge-sidebar__search"
            onContextMenu={(event) => event.stopPropagation()}
          >
            <div className="knowledge-toolbar__search">
              <Search size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索文件"
              />
            </div>
            <UploadProgressPanel progress={uploadProgress} />
          </div>
          {loading && !data.files?.length ? (
            <div className="knowledge-sidebar__state">加载中...</div>
          ) : null}
          {visibleTree.length ? (
            <div
              className="knowledge-tree"
              onContextMenu={(event) => handleContextMenu(event, null)}
            >
              <ControlledTreeEnvironment<KnowledgeTreeNode>
                items={treeItems}
                getItemTitle={(treeItem) => treeItem.data.name || ""}
                viewState={{
                  [treeID]: {
                    expandedItems: expandedIDs,
                    selectedItems: selectedIDs,
                    focusedItem: focusedItemID,
                  },
                }}
                canDragAndDrop
                canDropOnFolder
                canReorderItems={false}
                canSearch={false}
                canDrag={(items) =>
                  items.length === 1 && items.every((treeItem) => treeItem.index !== rootNodeID)
                }
                canDropAt={(items, target) =>
                  canDropTreeItems(items, target, treeItems)
                }
                onExpandItem={(treeItem) => {
                  if (treeItem.index !== rootNodeID) {
                    updateExpandedFolders((current) =>
                      new Set(current).add(String(treeItem.index)),
                    )
                  }
                }}
                onCollapseItem={(treeItem) => {
                  if (treeItem.index !== rootNodeID) {
                    updateExpandedFolders((current) => {
                      const next = new Set(current)
                      next.delete(String(treeItem.index))
                      return next
                    })
                  }
                }}
                onSelectItems={(items) => {
                  const nextID = String(items[0] || "")
                  if (!nextID || nextID === rootNodeID) {
                    return
                  }
                  const node = findNode(tree, nextID)
                  if (node?.type === "file") {
                    markSelectedNode(node)
                  }
                }}
                onFocusItem={(treeItem) => {
                  const id = String(treeItem.index)
                  if (id && id !== rootNodeID) {
                    setFocusedID(id)
                  }
                }}
                onPrimaryAction={(treeItem) => {
                  const node = findNode(tree, String(treeItem.index))
                  if (node) {
                    selectNode(node)
                  }
                }}
                onDrop={(items, target) => {
                  const targetID = resolveDropTargetID(target, treeItems)
                  const [treeItem] = items
                  if (!targetID || !treeItem) {
                    return
                  }
                  void moveNode(String(treeItem.index), targetID)
                }}
                renderItemArrow={({ item, context }) => (
                  <span
                    {...context.arrowProps}
                    className={`knowledge-tree-row__arrow${item.isFolder ? "" : " is-empty"}`}
                  >
                    {item.isFolder ? (
                      context.isExpanded ? (
                        <ChevronDown size={17} />
                      ) : (
                        <ChevronRight size={17} />
                      )
                    ) : null}
                  </span>
                )}
                renderItemTitle={({ title, item }) => (
                  <span className="knowledge-tree-row__label">
                    {item.data.type === "folder" ? <Folder size={16} /> : <FileText size={16} />}
                    <span className="knowledge-tree-row__name">{title}</span>
                    {item.data.type === "file" ? (
                      <span className="knowledge-tree-row__badges">
                        <SourceTypeBadge sourceType={item.data.source_type} />
                        <IndexStatusBadge status={item.data.index_status} compact />
                      </span>
                    ) : null}
                  </span>
                )}
                renderItem={({ item, depth, children, title, arrow, context }) => (
                  <TreeRow
                    item={item}
                    depth={depth}
                    title={title}
                    arrow={arrow}
                    context={context}
                    onContextMenu={handleContextMenu}
                  >
                    {children}
                  </TreeRow>
                )}
              >
                <Tree treeId={treeID} rootItem={rootNodeID} treeLabel={baseName} />
              </ControlledTreeEnvironment>
            </div>
          ) : (
            <div className="knowledge-sidebar__state">
              {query.trim() ? "没有匹配文件" : "右键新建文件夹或文件"}
            </div>
          )}
        </aside>

        <section className="knowledge-editor">
          {openingFile ? (
            <FileOpeningHeader fileName={openingFile.name} />
          ) : draft && currentFile ? (
            <div className="knowledge-editor__header">
              <div className="knowledge-editor__title">
                <Input
                  value={draft.name}
                  title={draft.name}
                  onChange={(event) =>
                    setDraft((value) =>
                      value ? { ...value, name: event.target.value, dirty: true } : value,
                    )
                  }
                />
                <SourceTypeBadge sourceType={currentFile?.source_type} />
                <IndexStatusBadge status={currentIndexStatus} />
              </div>
              <div className="knowledge-editor__actions">
                <EditorHeaderStatus status={viewerStatus} />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void openFileIndexDetail()}
                >
                  <Network size={16} />
                  索引详情
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openDownloadWindow(currentFileDownloadURL)}
                >
                  <Download size={16} />
                  下载
                </Button>
                <Button
                  size="sm"
                  disabled={saving || !draft.dirty}
                  onClick={() => void saveCurrentFile()}
                >
                  <Save size={16} />
                  {saving ? "保存中" : "保存"}
                </Button>
              </div>
            </div>
          ) : null}
          <div className="knowledge-editor__body" aria-busy={openingFile ? true : undefined}>
            <KnowledgeFileViewer
              active={fileViewerActive}
              file={currentFile}
              content={draft?.content || ""}
              downloadURL={currentFileDownloadURL}
              previewURL={currentFilePreviewURL}
              linkBaseURL={currentFileLinkBaseURL}
              onUploadAttachments={uploadEditorAttachments}
              onAttachmentError={(error) =>
                toast.error(errorMessage(error, "附件上传失败"))
              }
              onStatusChange={setViewerStatus}
              onChange={(content) =>
                setDraft((value) => (value ? { ...value, content, dirty: true } : value))
              }
            />
            {!openingFile && !hasOpenedFile ? (
              <div className="knowledge-editor__placeholder">
                <FileText size={42} />
                <strong>选择左侧文件查看或编辑</strong>
                <span>右键目录可以新建文件夹、文件或上传资料。</span>
              </div>
            ) : null}
          </div>
        </section>
      </main>

      {contextMenu ? (
        <ContextMenu
          state={contextMenu}
          onCreateFolder={(node) => {
            setContextMenu(null)
            openCreateDialog(
              "folder",
              node?.type === "folder" ? node.id : parentIDOf(node?.id || ""),
            )
          }}
          onCreateFile={(node) => {
            setContextMenu(null)
            openCreateDialog(
              "file",
              node?.type === "folder" ? node.id : parentIDOf(node?.id || ""),
            )
          }}
          onUpload={(node) => {
            setContextMenu(null)
            openUploadDialog(
              node?.type === "folder" ? node.id : parentIDOf(node?.id || ""),
            )
          }}
          onRename={(node) => {
            setContextMenu(null)
            if (node) {
              void renameNode(node)
            }
          }}
          onDelete={(node) => {
            setContextMenu(null)
            if (node) {
              void deleteNode(node)
            }
          }}
        />
      ) : null}
      {indexDetailOpen ? (
        <IndexDetailDialog
          detail={indexDetail}
          loading={indexDetailLoading}
          fileName={currentFile?.name || ""}
          onClose={() => setIndexDetailOpen(false)}
        />
      ) : null}
      <KnowledgeIndexMap
        knowledgeBaseID={knowledgeBaseID}
        mode={data.base?.concept_graph_enabled}
        open={indexMapOpen}
        onClose={() => setIndexMapOpen(false)}
        onRefreshFiles={() => void reloadFiles()}
      />
      {retrieveTestOpen ? (
        <RetrieveTestDialog
          knowledgeBaseID={knowledgeBaseID}
          baseName={baseName}
          mode={data.base?.concept_graph_enabled}
          onClose={() => setRetrieveTestOpen(false)}
        />
      ) : null}
      {createDialog ? (
        <CreateNodeDialog
          key={`${createDialog.type}:${createDialog.parent}`}
          state={createDialog}
          loading={creatingNode}
          onClose={() => {
            if (!creatingNode) {
              setCreateDialog(null)
            }
          }}
          onSubmit={(name) => void submitCreateNode(name)}
        />
      ) : null}
      <ConfirmDialog
        open={indexConfirmOpen}
        onOpenChange={setIndexConfirmOpen}
        title={indexActionText}
        desc={enhancedIndexMode
          ? "将重新解析文档并生成搜索索引，同时更新图谱、向量等增强数据。索引过程中不能重复触发。"
          : "将重新解析文档并生成本地搜索索引。原文读取不依赖索引，索引过程中不能重复触发。"}
        confirmText="开始更新"
        disabled={indexBusy}
        isLoading={indexBusy}
        handleConfirm={() => void runKnowledgeIndex()}
      />
    </div>
  )
}

function CreateNodeDialog({
  state,
  loading,
  onClose,
  onSubmit,
}: {
  state: CreateNodeDialogState
  loading: boolean
  onClose: () => void
  onSubmit: (name: string) => void
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const initialName = state.type === "folder" ? defaultFolderName : defaultFileName
  const [name, setName] = useState(initialName)

  useLayoutEffect(() => {
    const input = inputRef.current
    if (!input) {
      return
    }
    input.focus()
    input.setSelectionRange(0, defaultNameSelectionEnd(initialName, state.type))
  }, [initialName, state.type])

  return (
    <div
      className="knowledge-index-detail knowledge-name-dialog"
      role="dialog"
      aria-modal="true"
      aria-label={state.type === "folder" ? "新建文件夹" : "新建文件"}
      onClick={loading ? undefined : onClose}
    >
      <form
        className="knowledge-index-detail__panel knowledge-name-dialog__panel"
        onClick={(event) => event.stopPropagation()}
        onSubmit={(event) => {
          event.preventDefault()
          const trimmedName = name.trim()
          if (trimmedName) {
            onSubmit(trimmedName)
          }
        }}
      >
        <div className="knowledge-index-detail__header">
          <div>
            <strong>{state.type === "folder" ? "新建文件夹" : "新建文件"}</strong>
            <span>{state.type === "folder" ? "输入文件夹名称" : "输入文件名称"}</span>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭" disabled={loading}>
            ×
          </button>
        </div>
        <div className="knowledge-name-dialog__body">
          <label htmlFor="knowledge-create-node-name">
            {state.type === "folder" ? "文件夹名称" : "文件名称"}
          </label>
          <input
            ref={inputRef}
            className="knowledge-name-dialog__input"
            id="knowledge-create-node-name"
            type="text"
            value={name}
            disabled={loading}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Escape" && !loading) {
                event.preventDefault()
                onClose()
              }
            }}
          />
        </div>
        <div className="knowledge-name-dialog__footer">
          <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
            取消
          </Button>
          <Button type="submit" disabled={loading || !name.trim()}>
            {loading ? "创建中" : "确定"}
          </Button>
        </div>
      </form>
    </div>
  )
}

function FileOpeningHeader({ fileName }: { fileName: string }) {
  return (
    <div className="knowledge-editor__header">
      <div className="knowledge-editor__title">
        <span className="knowledge-editor__title-text">{fileName || "文件"}</span>
      </div>
      <div className="knowledge-editor__actions">
        <EditorHeaderStatus status={{ label: "文件加载中" }} />
      </div>
    </div>
  )
}

function EditorHeaderStatus({ status }: { status: KnowledgeFileViewerStatus | null }) {
  if (!status) {
    return null
  }
  return (
    <span className="knowledge-editor__status" role="status" aria-label={status.label}>
      <RefreshCw size={15} />
    </span>
  )
}

function defaultNameSelectionEnd(name: string, type: "file" | "folder") {
  if (type === "folder") {
    return name.length
  }
  const dotIndex = name.lastIndexOf(".")
  return dotIndex > 0 ? dotIndex : name.length
}

function IndexStatusBadge({
  status,
  compact,
}: {
  status?: string
  compact?: boolean
}) {
  const item = indexStatusView(status)
  if (!item) {
    return null
  }
  const Icon = item.icon
  return (
    <span
      className={`knowledge-index-status is-${item.status}${compact ? " is-compact" : ""}`}
      title={item.label}
      aria-label={item.label}
    >
      <Icon size={compact ? 13 : 14} />
      {compact ? null : <span>{item.label}</span>}
    </span>
  )
}

function RetrieveTestDialog({
  knowledgeBaseID,
  baseName,
  mode,
  onClose,
}: {
  knowledgeBaseID: number
  baseName: string
  mode?: number
  onClose: () => void
}) {
  const [query, setQuery] = useState("")
  const [limit, setLimit] = useState(8)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<KnowledgeRetrieveDebugResult | null>(null)
  const snippets = result?.snippets || []
  const sourceCounts = Object.entries(result?.source_counts || {})
  const plans = result?.plans || []

  const runRetrieveTest = useCallback(async () => {
    const text = query.trim()
    if (!knowledgeBaseID || !text) {
      setError("请输入要测试的问题")
      return
    }
    setLoading(true)
    setError("")
    try {
      setResult(await loadKnowledgeRetrieveDebug({
        knowledgeBaseID,
        query: text,
        limit,
      }))
    } catch (currentError) {
      setResult(null)
      setError(errorMessage(currentError, "测试检索失败"))
    } finally {
      setLoading(false)
    }
  }, [knowledgeBaseID, limit, query])

  return (
    <div
      className="knowledge-index-detail knowledge-retrieve-test"
      role="dialog"
      aria-modal="true"
      aria-label="测试检索"
      onClick={onClose}
    >
      <div className="knowledge-index-detail__panel" onClick={(event) => event.stopPropagation()}>
        <div className="knowledge-index-detail__header">
          <div>
            <strong>测试检索</strong>
            <span>{baseName} · {knowledgeModeLabel(mode)}</span>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>
        <form
          className="knowledge-retrieve-test__form"
          onSubmit={(event) => {
            event.preventDefault()
            void runRetrieveTest()
          }}
        >
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="输入一个问题测试知识库召回"
            autoFocus
          />
          <input
            className="knowledge-retrieve-test__limit"
            type="number"
            min={1}
            max={20}
            value={limit}
            onChange={(event) => setLimit(clamp(Number(event.target.value) || 8, 1, 20))}
            aria-label="返回数量"
          />
          <Button type="submit" disabled={loading || !query.trim()}>
            {loading ? <RefreshCw className="knowledge-retrieve-test__spin" size={15} /> : <Search size={15} />}
            测试
          </Button>
        </form>
        {error ? <div className="knowledge-index-detail__error">{error}</div> : null}
        {loading ? (
          <div className="knowledge-index-detail__loading">
            <RefreshCw size={18} />
            检索测试中
          </div>
        ) : result ? (
          <div className="knowledge-retrieve-test__body">
            <div className="knowledge-index-detail__meta">
              <span>问题：{result.query || query}</span>
              <span>命中：{snippets.length}</span>
              <span>命中片段为候选，智能体会按需读取原文确认。</span>
              {sourceCounts.map(([source, count]) => (
                <span key={source}>{sourceLabel(source)}：{count}</span>
              ))}
            </div>
            <IndexDetailSection title="命中片段" count={snippets.length}>
              <div className="knowledge-retrieve-test__results">
                {snippets.map((snippet, index) => (
                  <article className="knowledge-index-detail__card" key={`${snippet.node_id || index}-${index}`}>
                    <div className="knowledge-index-detail__card-title">
                      <strong>{snippet.title || `片段 ${index + 1}`}</strong>
                      <span>{sourceLabel(snippet.source || "node")} · {formatScore(snippet.score)}</span>
                    </div>
                    <p>{snippet.content || "暂无内容。"}</p>
                    <div className="knowledge-retrieve-test__meta">
                      <span>文档：{snippet.doc_id || "-"}</span>
                      <span>节点：{snippet.node_id || "-"}</span>
                      <span>目录：{snippet.dir_path || "/"}</span>
                    </div>
                  </article>
                ))}
              </div>
            </IndexDetailSection>
            {plans.length ? (
              <IndexDetailSection title="检索计划" count={plans.length}>
                <div className="knowledge-retrieve-test__plans">
                  {plans.map((plan, index) => (
                    <pre key={index}>{formatDebugJSON(plan)}</pre>
                  ))}
                </div>
              </IndexDetailSection>
            ) : null}
          </div>
        ) : (
          <div className="knowledge-index-detail__empty">输入问题后开始测试。</div>
        )}
      </div>
    </div>
  )
}

function knowledgeModeLabel(value?: number) {
  if (Number(value) === 2) {
    return "轻量检索"
  }
  if (Number(value) === 1) {
    return "智能增强"
  }
  return "未知模式"
}

function sourceLabel(value: string) {
  const source = String(value || "").trim()
  const labels: Record<string, string> = {
    node: "关键词",
    graph: "图谱",
    vector: "向量",
    node_vector: "向量",
    planned_doc: "规划文档",
    agentic_knowledge: "综合",
    planner: "规划",
    init: "初始化文件",
    file: "原文",
    file_search: "原文搜索",
    file_read: "原文读取",
  }
  return labels[source] || source || "未知"
}

function formatScore(value?: number) {
  const score = Number(value)
  if (!Number.isFinite(score)) {
    return "分数 -"
  }
  return `分数 ${score.toFixed(3)}`
}

function formatDebugJSON(value: Record<string, unknown>) {
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

function SourceTypeBadge({ sourceType }: { sourceType?: string }) {
  if (!sourceType || sourceType === "upload") {
    return null
  }
  if (sourceType === "qa") {
    return <span className="knowledge-source-tag is-qa">QA 积累</span>
  }
  return <span className="knowledge-source-tag">{sourceType}</span>
}

function UploadProgressPanel({ progress }: { progress: UploadProgressState | null }) {
  if (!progress) {
    return null
  }
  const percent = clamp(Math.round(progress.percent), 0, 100)
  return (
    <div className={`knowledge-upload-progress is-${progress.status}`} role="status">
      <div className="knowledge-upload-progress__row">
        <span>{uploadStatusText(progress.status)}</span>
        <strong>{percent}%</strong>
      </div>
      <div className="knowledge-upload-progress__track">
        <span style={{ width: `${percent}%` }} />
      </div>
      <div className="knowledge-upload-progress__meta">
        <span>{progress.currentFile || "准备上传"}</span>
        <em>
          {progress.currentIndex}/{progress.total}
        </em>
      </div>
    </div>
  )
}

function TreeRow({
  item,
  depth,
  title,
  arrow,
  context,
  onContextMenu,
  children,
}: {
  item: TreeItem<KnowledgeTreeNode>
  depth: number
  title: ReactNode
  arrow: ReactNode
  context: TreeItemRenderContext
  onContextMenu: (event: MouseEvent, node: KnowledgeTreeNode | null) => void
  children: ReactNode
}) {
  const node = item.index === rootNodeID ? null : item.data
  const isFile = node?.type === "file"
  const visualDepth = node ? Math.max(0, node.level) : Math.max(0, depth - 1)
  const rowStyle = {
    "--knowledge-tree-guide-left": `${12 + Math.max(0, visualDepth - 1) * 28 + 9}px`,
    paddingLeft: 12 + visualDepth * 28,
  } as CSSProperties
  return (
    <li
      {...context.itemContainerWithChildrenProps}
      className="knowledge-tree__item"
    >
      <div
        {...context.interactiveElementProps}
        className={`knowledge-tree-row${context.isSelected && isFile ? " is-selected" : ""}${
          context.isFocused && isFile ? " is-focused" : ""
        }${context.isDraggingOver ? " can-drop" : ""}${
          visualDepth === 0 ? " is-root-level" : " is-nested"
        }`}
        style={rowStyle}
        onContextMenu={(event) => onContextMenu(event, node)}
      >
        {arrow}
        {title}
        <MoreVertical className="knowledge-tree-row__more" size={14} />
      </div>
      {children}
    </li>
  )
}

function ContextMenu({
  state,
  onCreateFolder,
  onCreateFile,
  onUpload,
  onRename,
  onDelete,
}: {
  state: Exclude<ContextMenuState, null>
  onCreateFolder: (node: KnowledgeTreeNode | null) => void
  onCreateFile: (node: KnowledgeTreeNode | null) => void
  onUpload: (node: KnowledgeTreeNode | null) => void
  onRename: (node: KnowledgeTreeNode | null) => void
  onDelete: (node: KnowledgeTreeNode | null) => void
}) {
  const node = state.node
  const menuRef = useRef<HTMLDivElement | null>(null)
  const [position, setPosition] = useState(() =>
    resolveContextMenuPosition(
      state.x,
      state.y,
      contextMenuFallbackWidth,
      contextMenuFallbackHeight,
    ),
  )

  useLayoutEffect(() => {
    const rect = menuRef.current?.getBoundingClientRect()
    setPosition(
      resolveContextMenuPosition(
        state.x,
        state.y,
        rect?.width || contextMenuFallbackWidth,
        rect?.height || contextMenuFallbackHeight,
      ),
    )
  }, [state.x, state.y, node])

  return (
    <div
      ref={menuRef}
      className="knowledge-context-menu"
      style={{ left: position.left, top: position.top }}
      onClick={(event) => event.stopPropagation()}
      onContextMenu={(event) => event.preventDefault()}
    >
      <button type="button" onClick={() => onCreateFolder(node)}>
        <FolderPlus size={15} />
        新建文件夹
      </button>
      <button type="button" onClick={() => onCreateFile(node)}>
        <Plus size={15} />
        新建文件
      </button>
      <button type="button" onClick={() => onUpload(node)}>
        <Upload size={15} />
        上传文件
      </button>
      {node ? (
        <>
          <span className="knowledge-context-menu__sep" />
          <button type="button" onClick={() => onRename(node)}>
            <FileText size={15} />
            重命名
          </button>
          <button type="button" className="is-danger" onClick={() => onDelete(node)}>
            <Trash2 size={15} />
            删除
          </button>
        </>
      ) : null}
    </div>
  )
}

function IndexDetailDialog({
  detail,
  loading,
  fileName,
  onClose,
}: {
  detail: KnowledgeFileIndexDetail | null
  loading: boolean
  fileName: string
  onClose: () => void
}) {
  const nodes = detail?.nodes || []
  const edges = detail?.edges || []
  return (
    <div
      className="knowledge-index-detail"
      role="dialog"
      aria-modal="true"
      aria-label="索引详情"
      onClick={onClose}
    >
      <div className="knowledge-index-detail__panel" onClick={(event) => event.stopPropagation()}>
        <div className="knowledge-index-detail__header">
          <div>
            <strong>索引详情</strong>
            <span>{detail?.name || fileName || "当前文件"}</span>
          </div>
          <button type="button" onClick={onClose} aria-label="关闭">
            ×
          </button>
        </div>
        {loading ? (
          <div className="knowledge-index-detail__loading">
            <RefreshCw size={18} />
            加载索引详情中
          </div>
        ) : detail ? (
          <div className="knowledge-index-detail__body">
            <div className="knowledge-index-detail__meta">
              <IndexStatusBadge status={detail.index_status} />
              <SourceTypeBadge sourceType={detail.source_type} />
              <span>文档ID：{detail.doc_id || "-"}</span>
              <span>节点：{detail.node_count || nodes.length}</span>
              <span>目录：{detail.dir_path || "/"}</span>
            </div>
            {detail.error_message ? (
              <div className="knowledge-index-detail__error">{detail.error_message}</div>
            ) : null}
            <IndexDetailSection title="文章摘要" count={detail.summary ? 1 : 0}>
              <p className="knowledge-index-detail__summary">
                {detail.summary || "暂无摘要。"}
              </p>
              <KeywordChips values={detail.keywords || []} />
            </IndexDetailSection>
            <IndexDetailSection title="节点" count={nodes.length}>
              {nodes.map((node) => (
                <article className="knowledge-index-detail__card" key={node.id}>
                  <div className="knowledge-index-detail__card-title">
                    <strong>{node.path || node.title || `#${node.sort}`}</strong>
                    <IndexStatusBadge status={node.index_status} compact />
                  </div>
                  <p>{node.content_preview || "暂无内容。"}</p>
                  <KeywordChips values={node.keywords || []} compact />
                </article>
              ))}
            </IndexDetailSection>
            <IndexDetailSection title="关系" count={edges.length}>
              <div className="knowledge-index-detail__grid">
                {edges.map((edge) => (
                  <article className="knowledge-index-detail__card" key={edge.id}>
                    <div className="knowledge-index-detail__triple">
                      <span>{edge.subject}</span>
                      <em>{edge.label || edge.predicate || edge.edge_type || "关联"}</em>
                      <span>{edge.object}</span>
                    </div>
                    <p>{edge.description || edge.evidence || "暂无说明。"}</p>
                  </article>
                ))}
              </div>
            </IndexDetailSection>
          </div>
        ) : (
          <div className="knowledge-index-detail__empty">暂无索引详情。</div>
        )}
      </div>
    </div>
  )
}

function IndexDetailSection({
  title,
  count,
  children,
}: {
  title: string
  count: number
  children: ReactNode
}) {
  return (
    <section className="knowledge-index-detail__section">
      <h3>
        {title}
        <span>{count}</span>
      </h3>
      {count > 0 || title === "文章摘要" ? (
        children
      ) : (
        <div className="knowledge-index-detail__empty">暂无{title}。</div>
      )}
    </section>
  )
}

function KeywordChips({ values, compact }: { values: string[]; compact?: boolean }) {
  const list = values.map((value) => value.trim()).filter(Boolean)
  if (!list.length) {
    return null
  }
  return (
    <div className={`knowledge-index-detail__tags${compact ? " is-compact" : ""}`}>
      {list.map((value) => (
        <span key={value}>{value}</span>
      ))}
    </div>
  )
}

function resolveContextMenuPosition(
  x: number,
  y: number,
  menuWidth: number,
  menuHeight: number,
) {
  if (typeof window === "undefined") {
    return { left: x, top: y }
  }
  const maxLeft = Math.max(
    contextMenuViewportMargin,
    window.innerWidth - menuWidth - contextMenuViewportMargin,
  )
  const maxTop = Math.max(
    contextMenuViewportMargin,
    window.innerHeight - menuHeight - contextMenuViewportMargin,
  )
  return {
    left: clamp(x, contextMenuViewportMargin, maxLeft),
    top: clamp(y, contextMenuViewportMargin, maxTop),
  }
}

function buildComplexTreeItems(nodes: KnowledgeTreeNode[], baseName: string) {
  const items: Record<TreeItemIndex, TreeItem<KnowledgeTreeNode>> = {
    [rootNodeID]: {
      index: rootNodeID,
      isFolder: true,
      canMove: false,
      canRename: false,
      data: {
        id: rootNodeID,
        name: baseName || "知识库",
        type: "folder",
        parent_id: rootNodeID,
        path: rootNodeID,
        level: 0,
        children: nodes,
      },
      children: nodes.map((node) => node.id),
    },
  }

  const appendNode = (node: KnowledgeTreeNode) => {
    items[node.id] = {
      index: node.id,
      isFolder: node.type === "folder",
      canMove: true,
      canRename: true,
      data: node,
      children: node.type === "folder" ? node.children.map((child) => child.id) : undefined,
    }
    node.children.forEach(appendNode)
  }

  nodes.forEach(appendNode)
  return items
}

function folderIDsInTree(nodes: KnowledgeTreeNode[]) {
  const ids = new Set<string>([rootNodeID])
  const visitNode = (node: KnowledgeTreeNode) => {
    if (node.type === "folder") {
      ids.add(node.id)
      node.children.forEach(visitNode)
    }
  }
  nodes.forEach(visitNode)
  return ids
}

function expandedIDsInTreeItems(
  expanded: Set<string>,
  treeItems: Record<TreeItemIndex, TreeItem<KnowledgeTreeNode>>,
) {
  return Array.from(expanded).filter((id) => id === rootNodeID || Boolean(treeItems[id]))
}

function loadExpandedFolderIDs(knowledgeBaseID: number) {
  if (!knowledgeBaseID || typeof window === "undefined") {
    return new Set<string>([rootNodeID])
  }
  try {
    const value = window.localStorage.getItem(expandedStorageKey(knowledgeBaseID))
    const ids = JSON.parse(value || "[]")
    if (!Array.isArray(ids)) {
      return new Set<string>([rootNodeID])
    }
    return new Set([rootNodeID, ...ids.map(normalizeID).filter((id) => id !== rootNodeID)])
  } catch {
    return new Set<string>([rootNodeID])
  }
}

function saveExpandedFolderIDs(knowledgeBaseID: number, expanded: Set<string>) {
  if (!knowledgeBaseID || typeof window === "undefined") {
    return
  }
  const ids = Array.from(expanded).filter((id) => id && id !== rootNodeID)
  window.localStorage.setItem(expandedStorageKey(knowledgeBaseID), JSON.stringify(ids))
}

function expandedStorageKey(knowledgeBaseID: number) {
  return `${expandedStoragePrefix}${knowledgeBaseID}`
}

function loadLastOpenedFileID(knowledgeBaseID: number) {
  if (!knowledgeBaseID || typeof window === "undefined") {
    return ""
  }
  const value = window.localStorage.getItem(lastOpenedStorageKey(knowledgeBaseID))
  if (!value) {
    return ""
  }
  const id = normalizeID(value)
  return id === rootNodeID ? "" : id
}

function saveLastOpenedFileID(knowledgeBaseID: number, fileID: string) {
  if (!knowledgeBaseID || typeof window === "undefined") {
    return
  }
  const id = normalizeID(fileID)
  if (!id || id === rootNodeID) {
    clearLastOpenedFileID(knowledgeBaseID)
    return
  }
  window.localStorage.setItem(lastOpenedStorageKey(knowledgeBaseID), id)
}

function clearLastOpenedFileID(knowledgeBaseID: number) {
  if (!knowledgeBaseID || typeof window === "undefined") {
    return
  }
  window.localStorage.removeItem(lastOpenedStorageKey(knowledgeBaseID))
}

function lastOpenedStorageKey(knowledgeBaseID: number) {
  return `${lastOpenedStoragePrefix}${knowledgeBaseID}`
}

function expandParentFolders(expanded: Set<string>, fileID: string) {
  const next = new Set(expanded)
  let parentID = parentIDOf(fileID)
  while (parentID && parentID !== rootNodeID) {
    next.add(parentID)
    parentID = parentIDOf(parentID)
  }
  next.add(rootNodeID)
  return next
}

function canDropTreeItems(
  items: TreeItem<KnowledgeTreeNode>[],
  target: DraggingPosition,
  treeItems: Record<TreeItemIndex, TreeItem<KnowledgeTreeNode>>,
) {
  const targetID = resolveDropTargetID(target, treeItems)
  if (!targetID) {
    return false
  }
  return items.every((item) => {
    const sourceID = String(item.index)
    return sourceID !== rootNodeID && sourceID !== targetID && !targetID.startsWith(`${sourceID}/`)
  })
}

function resolveDropTargetID(
  target: DraggingPosition,
  treeItems: Record<TreeItemIndex, TreeItem<KnowledgeTreeNode>>,
) {
  if (target.targetType === "root") {
    return rootNodeID
  }
  if (target.targetType === "item") {
    const item = treeItems[target.targetItem]
    return item?.data.type === "folder" ? String(target.targetItem) : ""
  }
  const parentID = String(target.parentItem || rootNodeID)
  if (parentID === rootNodeID) {
    return rootNodeID
  }
  return treeItems[parentID]?.data.type === "folder" ? parentID : ""
}

function buildTree(files: KnowledgeFileItem[]) {
  const folders = new Map<string, KnowledgeTreeNode>()
  const roots: KnowledgeTreeNode[] = []
  const sortedNodes = files.map(toTreeNode).sort(compareKnowledgeTreeNode)

  for (const node of sortedNodes) {
    if (node.type === "folder") {
      folders.set(node.id, node)
    }
  }

  for (const itemNode of sortedNodes) {
    const node = folders.get(itemNode.id) || itemNode
    const parentID = node.parent_id
    if (!parentID || parentID === rootNodeID) {
      roots.push(node)
      continue
    }
    const parent = folders.get(parentID)
    if (parent) {
      parent.children.push(node)
    } else {
      roots.push(node)
    }
  }

  sortTree(roots)
  return roots
}

function flattenTree(nodes: KnowledgeTreeNode[]) {
  const result: KnowledgeTreeNode[] = []
  const visit = (node: KnowledgeTreeNode) => {
    result.push(node)
    node.children.forEach(visit)
  }
  nodes.forEach(visit)
  return result
}

function toTreeNode(file: KnowledgeFileItem): KnowledgeTreeNode {
  const id = normalizeID(file.id)
  return {
    ...file,
    id,
    name: file.name || basename(id),
    parent_id: parentIDOf(id),
    path: id,
    level: levelOf(id),
    children: [],
  }
}

function sortTree(nodes: KnowledgeTreeNode[]) {
  nodes.sort(compareKnowledgeTreeNode)
  nodes.forEach((node) => sortTree(node.children))
}

function compareKnowledgeTreeNode(a: KnowledgeTreeNode, b: KnowledgeTreeNode) {
  if (a.type !== b.type) {
    return a.type === "folder" ? -1 : 1
  }
  return a.name.localeCompare(b.name, "zh-Hans-CN")
}

function filterTree(nodes: KnowledgeTreeNode[], value: string): KnowledgeTreeNode[] {
  const keyword = value.trim().toLowerCase()
  if (!keyword) {
    return nodes
  }
  return nodes.flatMap((node) => {
    const children = filterTree(node.children, keyword)
    if (node.name.toLowerCase().includes(keyword) || children.length) {
      return [{ ...node, children }]
    }
    return []
  })
}

function findNode(nodes: KnowledgeTreeNode[], id: string): KnowledgeTreeNode | null {
  const normalized = normalizeID(id)
  for (const node of nodes) {
    if (node.id === normalized) {
      return node
    }
    const child = findNode(node.children, normalized)
    if (child) {
      return child
    }
  }
  return null
}

function normalizeFrontendIndexStatus(value: unknown): IndexStatus {
  switch (String(value || "").trim().toLowerCase()) {
    case "pending":
      return "pending"
    case "running":
      return "running"
    case "success":
      return "success"
    case "failed":
    case "fail":
      return "failed"
    default:
      return ""
  }
}

function indexStatusView(status: unknown) {
  const value = normalizeFrontendIndexStatus(status)
  if (value === "running") {
    return { status: value, label: "索引中", icon: RefreshCw }
  }
  if (value === "pending") {
    return { status: value, label: "待索引", icon: Timer }
  }
  if (value === "failed") {
    return { status: value, label: "索引失败", icon: XCircle }
  }
  if (value === "success") {
    return { status: value, label: "已索引", icon: CheckCircle2 }
  }
  return null
}

function markKnowledgeIndexRunning(current: KnowledgeFileManagerData): KnowledgeFileManagerData {
  const files = (current.files || []).map((file) => {
    return { ...file, index_status: file.type === "file" ? "running" : file.index_status }
  })
  return {
    ...current,
    base: current.base ? { ...current.base, index_status: "running" } : current.base,
    files,
  }
}

function isNodeAncestor(node: KnowledgeTreeNode, id: string) {
  const normalized = normalizeID(id)
  return normalized.startsWith(`${node.id}/`)
}

function resolveKnowledgeBaseID(meta: Record<string, unknown>) {
  const value =
    meta.knowledge_base_id ||
    meta.knowledgeBaseID ||
    meta.base_id ||
    meta.baseID ||
    meta.id ||
    queryValue("knowledge_base_id") ||
    queryValue("knowledgeBaseID") ||
    queryValue("base_id") ||
    queryValue("id")
  const id = Number(value)
  return Number.isFinite(id) && id > 0 ? id : 0
}

function queryValue(name: string) {
  if (typeof window === "undefined") {
    return ""
  }
  return new URLSearchParams(window.location.search).get(name) || ""
}

function normalizeID(value: unknown) {
  const id = String(value || "").trim()
  if (!id || id === ".") {
    return rootNodeID
  }
  return id.replace(/\\/g, "/").replace(/^\/+/, "") || rootNodeID
}

function parentIDOf(id: string) {
  const normalized = normalizeID(id)
  if (!normalized || normalized === rootNodeID || !normalized.includes("/")) {
    return rootNodeID
  }
  return normalized.slice(0, normalized.lastIndexOf("/")) || rootNodeID
}

function basename(id: string) {
  const normalized = normalizeID(id)
  if (normalized === rootNodeID) {
    return "知识库"
  }
  return normalized.slice(normalized.lastIndexOf("/") + 1)
}

function levelOf(id: string) {
  const normalized = normalizeID(id)
  if (normalized === rootNodeID) {
    return 0
  }
  return normalized.split("/").length - 1
}

async function uploadKnowledgeFile({
  knowledgeBaseID,
  parent,
  file,
  name,
  onProgress,
}: {
  knowledgeBaseID: number
  parent: string
  file: File
  name: string
  onProgress?: (percent: number) => void
}) {
  const totalParts = Math.max(1, Math.ceil(file.size / uploadChunkSize))
  const uploadID = createUploadID()
  let latest: KnowledgeFileManagerData | null = null
  for (let partIndex = 0; partIndex < totalParts; partIndex += 1) {
    const start = partIndex * uploadChunkSize
    const chunk = file.slice(start, Math.min(file.size, start + uploadChunkSize))
    const partResult = await uploadFilePart({
      knowledgeBaseID,
      parent,
      name,
      uploadID,
      partNumber: partIndex + 1,
      totalParts,
      chunk,
    })
    if (partResult.complete) {
      latest = partResult
    }
    onProgress?.((partIndex + 1) / totalParts)
  }
  if (!latest) {
    throw new Error("上传失败")
  }
  return latest
}

function createUploadID() {
  const random = Math.random().toString(36).slice(2)
  return `${Date.now().toString(36)}_${random}`
}

function openDownloadWindow(url: string) {
  const win = window.open(url, "_blank", "noopener,noreferrer")
  if (win) {
    win.opener = null
  }
}

function fileUploadPercent(completedIndex: number, total: number, currentFileRatio: number) {
  const safeTotal = Math.max(total, 1)
  return Math.round(((completedIndex + clamp(currentFileRatio, 0, 1)) / safeTotal) * 100)
}

function uploadStatusText(status: UploadProgressState["status"]) {
  if (status === "reading") {
    return "读取文件中"
  }
  if (status === "uploading") {
    return "上传中"
  }
  if (status === "done") {
    return "上传完成"
  }
  return "上传失败"
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}
