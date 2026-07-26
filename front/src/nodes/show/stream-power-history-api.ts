import { request } from '@/lib/request'
import type { EnergonOutput } from '@/components/energon/content-view'
import type {
  StreamPowerHistoryAdapter,
  StreamPowerHistoryDetail,
  StreamPowerHistoryItem,
  StreamPowerHistoryPage,
} from './stream-power-history'

type HistoryScope = Record<string, unknown>

export function createRemoteStreamPowerHistoryAdapter({
  scopeKey,
  listApi,
  detailApi,
  scope,
  selectLatest = false,
}: {
  scopeKey: string
  listApi: string
  detailApi: string
  scope: HistoryScope
  selectLatest?: boolean
}): StreamPowerHistoryAdapter | undefined {
  if (!scopeKey || !listApi || !detailApi) {
    return undefined
  }
  return {
    scopeKey,
    selectLatest,
    loadPage: (beforeID?: number) =>
      loadStreamPowerHistoryPage(listApi, scope, beforeID),
    loadDetail: (historyID: number) =>
      loadStreamPowerHistoryDetail(detailApi, scope, historyID),
  }
}

export async function loadStreamPowerHistoryPage(
  api: string,
  scope: HistoryScope,
  beforeID?: number,
  limit = 20
): Promise<StreamPowerHistoryPage> {
  const result = await request(api, 'get', {
    ...scope,
    before_id: beforeID || undefined,
    limit,
  })
  const data = responseData(result, '读取工具历史失败')
  return {
    items: rowsValue(data.items)
      .map(normalizeHistoryItem)
      .filter((item) => item.id > 0),
    total: nonNegativeNumber(data.total),
    hasMore: Boolean(data.has_more),
    beforeID: positiveNumber(data.before_id),
  }
}

export async function loadStreamPowerHistoryDetail(
  api: string,
  scope: HistoryScope,
  historyID: number
): Promise<StreamPowerHistoryDetail> {
  const result = await request(api, 'get', {
    ...scope,
    history_id: historyID,
  })
  const data = responseData(result, '读取工具历史详情失败')
  const history = normalizeHistoryItem(data.history)
  if (!history.id) {
    throw new Error('工具历史详情为空')
  }
  const raw = recordValue(data.history)
  return {
    ...history,
    input: recordValue(raw.input),
    output: normalizeOutput(raw.output),
    targetAssetID: positiveNumber(raw.target_asset_id),
    sourceTargetID: positiveNumber(raw.source_target_id),
  }
}

function normalizeHistoryItem(value: unknown): StreamPowerHistoryItem {
  const row = recordValue(value)
  return {
    id: positiveNumber(row.id),
    runID: positiveNumber(row.run_id),
    requestID: textValue(row.request_id),
    title: textValue(row.title) || '未命名运行',
    titleSource: normalizeTitleSource(row.title_source),
    inputSummary: textValue(row.input_summary),
    status: textValue(row.status) || 'unavailable',
    error: textValue(row.error),
    createdAt: textValue(row.created_at),
    startedAt: textValue(row.started_at),
    finishedAt: textValue(row.finished_at),
  }
}

function normalizeOutput(value: unknown): EnergonOutput | null {
  return isRecord(value) ? (value as EnergonOutput) : null
}

function normalizeTitleSource(value: unknown): 'auto' | 'llm' | 'manual' {
  const source = textValue(value)
  if (source === 'llm' || source === 'manual') {
    return source
  }
  return 'auto'
}

function responseData(result: unknown, fallback: string) {
  const response = recordValue(result)
  if (Number(response.code) !== 0 && Number(response.status) !== 1) {
    throw new Error(textValue(response.message || response.msg) || fallback)
  }
  return recordValue(response.data)
}

function rowsValue(value: unknown) {
  return Array.isArray(value) ? value : []
}

function recordValue(value: unknown): Record<string, any> {
  return isRecord(value) ? value : {}
}

function isRecord(value: unknown): value is Record<string, any> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function positiveNumber(value: unknown) {
  const number = Number(value || 0)
  return Number.isFinite(number) && number > 0 ? number : 0
}

function nonNegativeNumber(value: unknown) {
  const number = Number(value || 0)
  return Number.isFinite(number) && number >= 0 ? number : 0
}

function textValue(value: unknown) {
  return value == null ? '' : String(value).trim()
}
