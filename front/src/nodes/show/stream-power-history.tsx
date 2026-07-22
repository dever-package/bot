import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react'
import { History, Loader2, RefreshCw, X } from 'lucide-react'
import type { EnergonOutput } from '@/components/energon/content-view'
import { AgentChatTooltip } from './agent-chat/tooltip'

const DETAIL_CACHE_LIMIT = 12
const RUNNING_HISTORY_POLL_MS = 2000
const TITLE_REFRESH_DELAYS_MS = [1500, 5000, 21000]

type HistoryPageMode = 'initial' | 'append' | 'refresh'

export type StreamPowerHistoryItem = {
  id: number
  runID: number
  requestID: string
  title: string
  titleSource?: 'auto' | 'llm' | 'manual'
  inputSummary: string
  status: string
  error: string
  createdAt: string
  startedAt: string
  finishedAt: string
}

export type StreamPowerHistoryDetail = StreamPowerHistoryItem & {
  input: Record<string, unknown>
  output: EnergonOutput | null
  targetAssetID: number
  sourceTargetID: number
}

export type StreamPowerHistoryPage = {
  items: StreamPowerHistoryItem[]
  total: number
  hasMore: boolean
  beforeID: number
}

export type StreamPowerHistoryAdapter = {
  scopeKey: string
  selectLatest?: boolean
  loadPage: (beforeID?: number) => Promise<StreamPowerHistoryPage>
  loadDetail: (historyID: number) => Promise<StreamPowerHistoryDetail>
}

export type StreamPowerHistoryLiveRun = {
  historyID: number
  runID: number
  requestID: string
  title: string
  inputSummary: string
  input: Record<string, unknown>
  targetAssetID: number
  sourceTargetID: number
}

export type StreamPowerHistoryController = ReturnType<
  typeof useStreamPowerHistory
>

export function useStreamPowerHistory(adapter?: StreamPowerHistoryAdapter) {
  const [items, setItems] = useState<StreamPowerHistoryItem[]>([])
  const [total, setTotal] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [selectedID, setSelectedID] = useState(0)
  const [selectionRevision, setSelectionRevision] = useState(0)
  const [selectedDetail, setSelectedDetail] =
    useState<StreamPowerHistoryDetail | null>(null)
  const [liveRun, setLiveRun] = useState<StreamPowerHistoryLiveRun | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [listError, setListError] = useState('')
  const [detailError, setDetailError] = useState('')
  const detailCacheRef = useRef(new Map<number, StreamPowerHistoryDetail>())
  const scopeTokenRef = useRef(0)
  const pageRequestRef = useRef(0)
  const detailRequestRef = useRef(0)
  const selectedIDRef = useRef(0)
  const liveHistoryIDRef = useRef(0)
  const beforeIDRef = useRef(0)
  const titleRefreshTimersRef = useRef<number[]>([])

  useEffect(() => {
    selectedIDRef.current = selectedID
  }, [selectedID])

  const loadDetail = useCallback(
    async (historyID: number, force = false) => {
      if (!adapter || historyID <= 0) {
        return null
      }
      const cached = detailCacheRef.current.get(historyID)
      if (cached && !force) {
        setSelectedDetail(cached)
        return cached
      }
      const token = scopeTokenRef.current
      const detailRequest = detailRequestRef.current + 1
      detailRequestRef.current = detailRequest
      if (!cached) {
        setDetailLoading(true)
      }
      try {
        const detail = await adapter.loadDetail(historyID)
        if (
          token !== scopeTokenRef.current ||
          detailRequest !== detailRequestRef.current
        ) {
          return null
        }
        rememberHistoryDetail(detailCacheRef.current, detail)
        setItems((current) => mergeHistoryItems(current, [detail]))
        if (selectedIDRef.current === historyID) {
          setSelectedDetail(detail)
        }
        setDetailError('')
        return detail
      } catch (currentError) {
        if (
          token === scopeTokenRef.current &&
          detailRequest === detailRequestRef.current
        ) {
          setDetailError(
            historyErrorMessage(currentError, '读取工具历史详情失败')
          )
        }
        return null
      } finally {
        if (
          token === scopeTokenRef.current &&
          detailRequest === detailRequestRef.current
        ) {
          setDetailLoading(false)
        }
      }
    },
    [adapter]
  )

  const loadPage = useCallback(
    async (mode: HistoryPageMode = 'initial') => {
      if (!adapter) {
        return
      }
      const append = mode === 'append'
      const token = scopeTokenRef.current
      const pageRequest = pageRequestRef.current + 1
      pageRequestRef.current = pageRequest
      const cursor = append ? beforeIDRef.current : 0
      if (append) {
        setLoadingMore(true)
      } else {
        setLoading(true)
      }
      try {
        const page = await adapter.loadPage(cursor || undefined)
        if (
          token !== scopeTokenRef.current ||
          pageRequest !== pageRequestRef.current
        ) {
          return
        }
        setItems((current) => mergeHistoryItems(current, page.items))
        setTotal(page.total)
        if (mode === 'refresh') {
          setHasMore((current) => current || page.hasMore)
        } else {
          setHasMore(page.hasMore)
          beforeIDRef.current = page.beforeID
        }
        setListError('')
        if (
          mode === 'initial' &&
          adapter.selectLatest !== false &&
          selectedIDRef.current === 0 &&
          page.items[0]
        ) {
          const latestID = page.items[0].id
          const cached = detailCacheRef.current.get(latestID) || null
          selectedIDRef.current = latestID
          setSelectedID(latestID)
          setSelectedDetail(cached)
          setDetailLoading(!cached)
          setSelectionRevision((revision) => revision + 1)
        }
      } catch (currentError) {
        if (
          token === scopeTokenRef.current &&
          pageRequest === pageRequestRef.current
        ) {
          setListError(historyErrorMessage(currentError, '读取工具历史失败'))
        }
      } finally {
        if (
          token === scopeTokenRef.current &&
          pageRequest === pageRequestRef.current
        ) {
          setLoading(false)
          setLoadingMore(false)
        }
      }
    },
    [adapter]
  )

  useEffect(() => {
    scopeTokenRef.current += 1
    pageRequestRef.current += 1
    detailRequestRef.current += 1
    clearHistoryTimers(titleRefreshTimersRef)
    detailCacheRef.current.clear()
    selectedIDRef.current = 0
    liveHistoryIDRef.current = 0
    beforeIDRef.current = 0
    setItems([])
    setTotal(0)
    setHasMore(false)
    setSelectedID(0)
    setSelectionRevision(0)
    setSelectedDetail(null)
    setLiveRun(null)
    setPanelOpen(false)
    setLoading(false)
    setLoadingMore(false)
    setDetailLoading(false)
    setListError('')
    setDetailError('')
    if (adapter) {
      void loadPage('initial')
    }
    return () => {
      scopeTokenRef.current += 1
      pageRequestRef.current += 1
      detailRequestRef.current += 1
      clearHistoryTimers(titleRefreshTimersRef)
    }
  }, [adapter?.scopeKey])

  useEffect(() => {
    if (!adapter || selectedID <= 0 || selectedID === liveRun?.historyID) {
      setSelectedDetail(null)
      setDetailLoading(false)
      return
    }
    void loadDetail(selectedID)
  }, [adapter, liveRun?.historyID, loadDetail, selectedID])

  useEffect(() => {
    if (
      !adapter ||
      !selectedDetail ||
      selectedDetail.id !== selectedID ||
      !isRunningHistoryStatus(selectedDetail.status)
    ) {
      return
    }
    const timer = window.setInterval(() => {
      void loadDetail(selectedDetail.id, true)
    }, RUNNING_HISTORY_POLL_MS)
    return () => window.clearInterval(timer)
  }, [adapter, loadDetail, selectedDetail, selectedID])

  const beginRun = useCallback(() => {
    clearHistoryTimers(titleRefreshTimersRef)
    setSelectedID(0)
    selectedIDRef.current = 0
    liveHistoryIDRef.current = 0
    setSelectedDetail(null)
    setLiveRun(null)
    setPanelOpen(false)
    setDetailError('')
  }, [])

  const registerLiveRun = useCallback(
    (run: StreamPowerHistoryLiveRun) => {
      if (run.historyID <= 0) {
        return
      }
      const exists = items.some((item) => item.id === run.historyID)
      const now = new Date().toISOString()
      liveHistoryIDRef.current = run.historyID
      setLiveRun(run)
      setSelectedID(run.historyID)
      selectedIDRef.current = run.historyID
      setSelectedDetail(null)
      setItems((current) =>
        mergeHistoryItems(current, [
          {
            id: run.historyID,
            runID: run.runID,
            requestID: run.requestID,
            title: run.title,
            titleSource: 'auto',
            inputSummary: run.inputSummary,
            status: 'running',
            error: '',
            createdAt: now,
            startedAt: now,
            finishedAt: '',
          },
        ])
      )
      if (!exists) {
        setTotal((count) => count + 1)
      }
    },
    [items]
  )

  const syncLiveRun = useCallback(
    (historyID: number, status: string, currentError: string) => {
      if (historyID <= 0) {
        return
      }
      setItems((current) =>
        current.map((item) =>
          item.id === historyID &&
          (item.status !== status || item.error !== currentError)
            ? { ...item, status, error: currentError }
            : item
        )
      )
    },
    []
  )

  const finishLiveRun = useCallback(() => {
    if (!adapter || liveHistoryIDRef.current <= 0) {
      return
    }
    clearHistoryTimers(titleRefreshTimersRef)
    void loadPage('refresh')
    titleRefreshTimersRef.current = TITLE_REFRESH_DELAYS_MS.map((delay) =>
      window.setTimeout(() => void loadPage('refresh'), delay)
    )
  }, [adapter, loadPage])

  const openPanel = useCallback(() => {
    setPanelOpen(true)
    if (adapter) {
      void loadPage('refresh')
    }
  }, [adapter, loadPage])

  const closePanel = useCallback(() => {
    setPanelOpen(false)
  }, [])

  const selectHistory = useCallback((historyID: number) => {
    const cached = detailCacheRef.current.get(historyID) || null
    setSelectedID(historyID)
    selectedIDRef.current = historyID
    setSelectedDetail(cached)
    setSelectionRevision((revision) => revision + 1)
    setDetailLoading(!cached)
    setPanelOpen(false)
    setDetailError('')
  }, [])

  const retryDetail = useCallback(() => {
    if (selectedID > 0) {
      void loadDetail(selectedID, true)
    }
  }, [loadDetail, selectedID])

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedID) || null,
    [items, selectedID]
  )

  return {
    enabled: Boolean(adapter),
    items,
    total,
    hasMore,
    selectedID,
    selectionRevision,
    selectedItem,
    selectedDetail,
    liveRun,
    panelOpen,
    loading,
    loadingMore,
    detailLoading,
    listError,
    detailError,
    beginRun,
    registerLiveRun,
    syncLiveRun,
    finishLiveRun,
    openPanel,
    closePanel,
    selectHistory,
    loadMore: () => void loadPage('append'),
    retryList: () => void loadPage('initial'),
    retryDetail,
  }
}

export function StreamPowerHistoryTrigger({
  controller,
}: {
  controller: StreamPowerHistoryController
}) {
  if (!controller.enabled) {
    return null
  }
  return (
    <AgentChatTooltip label="运行历史">
      <button
        type="button"
        className="stream-power-history-trigger"
        aria-label="打开运行历史"
        onClick={controller.openPanel}
      >
        <History />
        {controller.total > 0 ? <span>{controller.total}</span> : null}
      </button>
    </AgentChatTooltip>
  )
}

export function StreamPowerHistoryPanel({
  controller,
}: {
  controller: StreamPowerHistoryController
}) {
  useEffect(() => {
    if (!controller.panelOpen) {
      return
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        controller.closePanel()
      }
    }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [controller.closePanel, controller.panelOpen])

  if (!controller.enabled || !controller.panelOpen) {
    return null
  }

  const closeFromBackdrop = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      controller.closePanel()
    }
  }

  return (
    <div
      className="stream-power-history-layer"
      role="presentation"
      onMouseDown={closeFromBackdrop}
    >
      <aside className="stream-power-history-panel" aria-label="工具运行历史">
        <header className="stream-power-history-header">
          <div>
            <strong>运行历史</strong>
            <small>
              {controller.total ? `共 ${controller.total} 条` : '暂无记录'}
            </small>
          </div>
          <AgentChatTooltip label="关闭">
            <button
              type="button"
              aria-label="关闭运行历史"
              onClick={controller.closePanel}
            >
              <X />
            </button>
          </AgentChatTooltip>
        </header>

        <div className="stream-power-history-list">
          {controller.loading && controller.items.length === 0 ? (
            <HistoryPanelState
              icon={<Loader2 className="animate-spin" />}
              text="读取历史"
            />
          ) : controller.listError && controller.items.length === 0 ? (
            <HistoryPanelState
              icon={<RefreshCw />}
              text={controller.listError}
              action="重试"
              onAction={controller.retryList}
            />
          ) : controller.items.length === 0 ? (
            <HistoryPanelState icon={<History />} text="还没有运行记录" />
          ) : (
            controller.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className="stream-power-history-item"
                data-active={controller.selectedID === item.id}
                onClick={() => controller.selectHistory(item.id)}
              >
                <span className="stream-power-history-item-title">
                  {item.title || '未命名运行'}
                </span>
                {item.inputSummary ? (
                  <span className="stream-power-history-item-summary">
                    {item.inputSummary}
                  </span>
                ) : null}
                <span className="stream-power-history-item-meta">
                  <i data-status={item.status} />
                  <span>{streamPowerHistoryStatusLabel(item.status)}</span>
                  <time>{formatHistoryTime(item.createdAt)}</time>
                </span>
              </button>
            ))
          )}
        </div>

        {controller.items.length > 0 && controller.hasMore ? (
          <button
            type="button"
            className="stream-power-history-more"
            disabled={controller.loadingMore}
            onClick={controller.loadMore}
          >
            {controller.loadingMore ? <Loader2 className="animate-spin" /> : null}
            {controller.loadingMore ? '加载中' : '加载更多'}
          </button>
        ) : null}
      </aside>
    </div>
  )
}

function HistoryPanelState({
  icon,
  text,
  action,
  onAction,
}: {
  icon: ReactNode
  text: string
  action?: string
  onAction?: () => void
}) {
  return (
    <div className="stream-power-history-state">
      {icon}
      <span>{text}</span>
      {action && onAction ? (
        <button type="button" onClick={onAction}>
          {action}
        </button>
      ) : null}
    </div>
  )
}

export function streamPowerHistoryStatusLabel(status: string) {
  switch (status) {
    case 'pending':
      return '等待生成'
    case 'running':
      return '生成中'
    case 'waiting':
      return '等待处理'
    case 'success':
      return '已完成'
    case 'fail':
      return '生成失败'
    case 'canceled':
      return '已停止'
    case 'unavailable':
      return '不可用'
    default:
      return status || '等待生成'
  }
}

export function isRunningHistoryStatus(status: string) {
  return status === 'pending' || status === 'running' || status === 'waiting'
}

function mergeHistoryItems(
  current: StreamPowerHistoryItem[],
  incoming: StreamPowerHistoryItem[]
) {
  const rows = new Map<number, StreamPowerHistoryItem>()
  current.forEach((item) => rows.set(item.id, item))
  incoming.forEach((item) => {
    const previous = rows.get(item.id)
    rows.set(item.id, previous ? { ...previous, ...item } : item)
  })
  return [...rows.values()].sort((left, right) => right.id - left.id)
}

function rememberHistoryDetail(
  cache: Map<number, StreamPowerHistoryDetail>,
  detail: StreamPowerHistoryDetail
) {
  cache.delete(detail.id)
  cache.set(detail.id, detail)
  while (cache.size > DETAIL_CACHE_LIMIT) {
    const oldestID = cache.keys().next().value
    if (typeof oldestID !== 'number') {
      return
    }
    cache.delete(oldestID)
  }
}

function formatHistoryTime(value: string) {
  const date = new Date(value)
  if (!value || Number.isNaN(date.getTime())) {
    return ''
  }
  const today = new Date()
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }
  return date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })
}

function historyErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback
}

function clearHistoryTimers(timerRef: { current: number[] }) {
  timerRef.current.forEach((timer) => window.clearTimeout(timer))
  timerRef.current = []
}
