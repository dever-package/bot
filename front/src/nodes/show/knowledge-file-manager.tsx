import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from "react"
import {
  ControlledTreeEnvironment,
  Tree,
  type DraggingPosition,
  type TreeItem,
  type TreeItemIndex,
  type TreeItemRenderContext,
} from "react-complex-tree"
import "react-complex-tree/lib/style-modern.css"
import {
  Download,
  FileText,
  Folder,
  FolderPlus,
  MoreVertical,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  Upload,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { NodeItemProps } from "@/page/nodes"
import {
  createFile,
  deleteFiles,
  downloadFileURL,
  loadFileContent,
  loadFileManagerData,
  moveFiles,
  renameFile,
  saveFile,
} from "./knowledge-file-manager/api"
import "./knowledge-file-manager/styles.css"
import type {
  KnowledgeFileContent,
  KnowledgeFileItem,
  KnowledgeFileManagerData,
  KnowledgeTreeNode,
} from "./knowledge-file-manager/types"

type ContextMenuState = {
  x: number
  y: number
  node: KnowledgeTreeNode | null
} | null

type DraftState = {
  id: string
  name: string
  content: string
  dirty: boolean
}

const rootNodeID = "/"
const treeID = "knowledge-files"
const defaultFileName = "未命名文档.md"
const defaultFolderName = "新建文件夹"

export function ShowKnowledgeFileManager({ item }: NodeItemProps) {
  const meta = item.meta ?? {}
  const knowledgeBaseID = useMemo(() => resolveKnowledgeBaseID(meta), [meta])
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const uploadParentRef = useRef(rootNodeID)
  const [data, setData] = useState<KnowledgeFileManagerData>({})
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set([rootNodeID]))
  const [selectedID, setSelectedID] = useState("")
  const [focusedID, setFocusedID] = useState("")
  const [currentFile, setCurrentFile] = useState<KnowledgeFileContent | null>(null)
  const [draft, setDraft] = useState<DraftState | null>(null)
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null)

  const baseName = data.base?.name || "知识库"
  const tree = useMemo(() => buildTree(data.files || []), [data.files])
  const visibleTree = useMemo(() => filterTree(tree, query), [query, tree])
  const treeItems = useMemo(
    () => buildComplexTreeItems(visibleTree, baseName),
    [baseName, visibleTree],
  )
  const selectedNode = useMemo(
    () => (selectedID ? findNode(tree, selectedID) : null),
    [selectedID, tree],
  )
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
    const close = () => setContextMenu(null)
    window.addEventListener("click", close)
    window.addEventListener("resize", close)
    return () => {
      window.removeEventListener("click", close)
      window.removeEventListener("resize", close)
    }
  }, [])

  const openFile = useCallback(
    async (node: KnowledgeTreeNode) => {
      if (!knowledgeBaseID || node.type !== "file") {
        return
      }
      try {
        const detail = await loadFileContent({ knowledgeBaseID, id: node.id })
        setSelectedID(node.id)
        setCurrentFile(detail)
        setDraft({
          id: detail.id,
          name: detail.name,
          content: detail.content || "",
          dirty: false,
        })
      } catch (error) {
        toast.error(errorMessage(error, "打开文件失败"))
      }
    },
    [knowledgeBaseID],
  )

  const createNode = useCallback(
    async (type: "file" | "folder", parentID?: string) => {
      if (!knowledgeBaseID) {
        return
      }
      const name = window.prompt(
        type === "folder" ? "文件夹名称" : "文件名称",
        type === "folder" ? defaultFolderName : defaultFileName,
      )
      if (!name?.trim()) {
        return
      }
      const parent = parentID || rootNodeID
      try {
        const result = await createFile({
          knowledgeBaseID,
          parent,
          name: name.trim(),
          type,
        })
        setData(result)
        setExpanded((current) => new Set(current).add(parent))
        if (type === "file" && result.new_id) {
          const created = findNode(buildTree(result.files || []), result.new_id)
          if (created) {
            await openFile(created)
          }
        }
        toast.success(type === "folder" ? "文件夹已创建" : "文件已创建")
      } catch (error) {
        toast.error(errorMessage(error, "创建失败"))
      }
    },
    [knowledgeBaseID, openFile],
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
          if (node.type === "file" && currentFile) {
            setCurrentFile({ ...currentFile, id: nextID, name: name.trim() })
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
          setDraft(null)
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
      setCurrentFile(saved)
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
        setExpanded((current) => new Set(current).add(targetFolderID))
        if (selectedID === source.id || selectedID.startsWith(`${source.id}/`)) {
          setSelectedID("")
          setCurrentFile(null)
          setDraft(null)
        }
        toast.success("已移动")
      } catch (error) {
        toast.error(errorMessage(error, "移动失败"))
      } finally {
        setDraggingID("")
      }
    },
    [knowledgeBaseID, selectedID, tree],
  )

  const openUploadDialog = useCallback(
    (parentID?: string) => {
      const fallbackParent =
        selectedNode?.type === "folder" ? selectedNode.id : parentIDOf(selectedID)
      uploadParentRef.current = parentID || fallbackParent || rootNodeID
      fileInputRef.current?.click()
    },
    [selectedID, selectedNode],
  )

  const uploadFiles = useCallback(
    async (files: FileList | null) => {
      if (!knowledgeBaseID || !files?.length) {
        return
      }
      const parent = uploadParentRef.current || rootNodeID
      try {
        let latest: KnowledgeFileManagerData | null = null
        for (const file of Array.from(files)) {
          latest = await createFile({
            knowledgeBaseID,
            parent,
            name: file.name,
            type: "file",
            contentBase64: await fileToBase64(file),
          })
        }
        if (latest) {
          setData(latest)
        }
        setExpanded((current) => new Set(current).add(parent))
        toast.success("上传完成")
      } catch (error) {
        toast.error(errorMessage(error, "上传失败"))
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    },
    [knowledgeBaseID],
  )

  const toggleFolder = useCallback((id: string) => {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const selectNode = useCallback(
    (node: KnowledgeTreeNode) => {
      setSelectedID(node.id)
      setFocusedID(node.id)
      if (node.type === "folder") {
        toggleFolder(node.id)
        return
      }
      void openFile(node)
    },
    [openFile, toggleFolder],
  )

  const markSelectedNode = useCallback((node: KnowledgeTreeNode) => {
    setSelectedID(node.id)
    setFocusedID(node.id)
  }, [])

  const expandedIDs = useMemo(() => {
    if (!query.trim()) {
      return Array.from(expanded)
    }
    return Array.from(folderIDsInTree(visibleTree))
  }, [expanded, query, visibleTree])

  const selectedIDs = selectedID && treeItems[selectedID] ? [selectedID] : []
  const rawFocusedID = focusedID || selectedID
  const focusedItemID = rawFocusedID && treeItems[rawFocusedID] ? rawFocusedID : rootNodeID

  const handleContextMenu = useCallback((event: MouseEvent, node: KnowledgeTreeNode | null) => {
    event.preventDefault()
    event.stopPropagation()
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
        <div className="knowledge-toolbar__search">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="搜索文件"
          />
        </div>
        <div className="knowledge-toolbar__actions">
          <Button variant="outline" size="sm" onClick={() => void createNode("folder")}>
            <FolderPlus size={16} />
            文件夹
          </Button>
          <Button variant="outline" size="sm" onClick={() => void createNode("file")}>
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
                    setExpanded((current) => new Set(current).add(String(treeItem.index)))
                  }
                }}
                onCollapseItem={(treeItem) => {
                  if (treeItem.index !== rootNodeID) {
                    setExpanded((current) => {
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
                  if (node) {
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
                    className="knowledge-tree-row__arrow"
                  >
                    {item.isFolder ? (context.isExpanded ? "▾" : "▸") : ""}
                  </span>
                )}
                renderItemTitle={({ title, item }) => (
                  <span className="knowledge-tree-row__label">
                    {item.data.type === "folder" ? <Folder size={16} /> : <FileText size={16} />}
                    <span className="knowledge-tree-row__name">{title}</span>
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
          {draft && currentFile ? (
            <>
              <div className="knowledge-editor__header">
                <div className="knowledge-editor__title">
                  <Input
                    value={draft.name}
                    onChange={(event) =>
                      setDraft((value) =>
                        value ? { ...value, name: event.target.value, dirty: true } : value,
                      )
                    }
                  />
                </div>
                <div className="knowledge-editor__actions">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      window.open(downloadFileURL(knowledgeBaseID, currentFile.id), "_blank")
                    }
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
              {currentFile.editable ? (
                <Textarea
                  value={draft.content}
                  onChange={(event) =>
                    setDraft((value) =>
                      value ? { ...value, content: event.target.value, dirty: true } : value,
                    )
                  }
                  className="knowledge-editor__textarea"
                  placeholder="输入知识内容"
                />
              ) : (
                <div className="knowledge-editor__readonly">
                  <FileText size={38} />
                  <strong>该文件不支持在线编辑</strong>
                  <span>可以下载原文件，或修改标题后保存重命名。</span>
                </div>
              )}
            </>
          ) : (
            <div className="knowledge-editor__placeholder">
              <FileText size={42} />
              <strong>选择左侧文件查看或编辑</strong>
              <span>右键目录可以新建文件夹、文件或上传资料。</span>
            </div>
          )}
        </section>
      </main>

      {contextMenu ? (
        <ContextMenu
          state={contextMenu}
          onCreateFolder={(node) => {
            setContextMenu(null)
            void createNode(
              "folder",
              node?.type === "folder" ? node.id : parentIDOf(node?.id || ""),
            )
          }}
          onCreateFile={(node) => {
            setContextMenu(null)
            void createNode(
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
  return (
    <li
      {...context.itemContainerWithChildrenProps}
      className="knowledge-tree__item"
    >
      <div
        {...context.interactiveElementProps}
        className={`knowledge-tree-row${context.isSelected ? " is-selected" : ""}${
          context.isFocused ? " is-focused" : ""
        }${context.isDraggingOver ? " can-drop" : ""}`}
        style={{ paddingLeft: 8 + Math.max(0, depth - 1) * 16 }}
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
  return (
    <div
      className="knowledge-context-menu"
      style={{ left: state.x, top: state.y }}
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

function isNodeAncestor(node: KnowledgeTreeNode, id: string) {
  const normalized = normalizeID(id)
  return normalized.startsWith(`${node.id}/`)
}

function resolveKnowledgeBaseID(meta: Record<string, unknown>) {
  const value = meta.knowledge_base_id || meta.knowledgeBaseID || meta.id
  const id = Number(value)
  return Number.isFinite(id) && id > 0 ? id : 0
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

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error("读取文件失败"))
    reader.onload = () => {
      const result = String(reader.result || "")
      resolve(result.includes(",") ? result.slice(result.indexOf(",") + 1) : result)
    }
    reader.readAsDataURL(file)
  })
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback
}
