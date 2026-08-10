import { useMemo } from 'react'
import { useStore } from 'zustand'
import type { NodeItemProps } from '@/page/nodes'
import { getStoreValueByPath } from '@/lib/store'
import { streamValueText } from '@/lib/stream'
import { StreamPowerRunner } from './stream-request'
import { createRemoteStreamPowerHistoryAdapter } from './stream-power-history-api'

export function ShowStreamRequest({ item, store }: NodeItemProps) {
  const powerKey = useStore(store, () =>
    streamValueText(getStoreValueByPath(store, String(item.meta?.powerPath || '')))
  )
  const historyApi = String(item.meta?.historyApi || '')
  const historyDetailApi = String(item.meta?.historyDetailApi || '')
  const history = useMemo(
    () =>
      powerKey
        ? createRemoteStreamPowerHistoryAdapter({
            scopeKey: `admin-power:${historyApi}:${historyDetailApi}:${powerKey}`,
            listApi: historyApi,
            detailApi: historyDetailApi,
            scope: { power: powerKey },
          })
        : undefined,
    [historyApi, historyDetailApi, powerKey]
  )

  return (
    <StreamPowerRunner
      powerKey={powerKey}
      requestApi={String(item.meta?.requestApi || '/bot/admin/energon/request')}
      paramApi={String(item.meta?.paramApi || '/bot/admin/energon/power_params')}
      streamApi={String(item.meta?.streamApi || '/bot/admin/energon/stream')}
      stopApi={String(item.meta?.stopApi || '/bot/admin/energon/stream_stop')}
      blockMs={Number(item.meta?.blockMs || 1000)}
      history={history}
    />
  )
}
