import { useEffect, useMemo, useRef, useState } from 'react'
import type { NodeItemProps } from '@/page/nodes'
import { useStore } from 'zustand'
import { request } from '@dever/front-plugin'
import { getStoreValueByPath } from '@/lib/store'
import { ShowAgent } from './agent'

const DEFAULT_DRAFT_PATH = 'data.actionTarget.draftAgent'
const DEFAULT_NEW_DRAFT_SESSION_CONTEXT = 'skill_draft:new'

export function ShowSkillCreator({ item, store }: NodeItemProps) {
  const draftPath = String(item.meta?.draftPath || DEFAULT_DRAFT_PATH)
  const openPath = String(item.meta?.openPath || '')
  const modalOpen = useStore(store, () =>
    openPath ? Boolean(getStoreValueByPath(store, openPath)) : true
  )
  const draftID = useStore(store, () => {
    const draft = getStoreValueByPath(store, draftPath)
    if (!isPlainRecord(draft)) {
      return 0
    }
    const id = Number(draft.id || 0)
    return Number.isFinite(id) && id > 0 ? id : 0
  })
  const draftRecord = useStore(store, () => {
    const draft = getStoreValueByPath(store, draftPath)
    return isPlainRecord(draft) ? draft : {}
  })
  const sourceSkillID = normalizedPositiveNumber(
    draftRecord.source_skill_id || draftRecord.sourceSkillId || 0
  )
  const packID = normalizedPositiveNumber(
    draftRecord.pack_id || draftRecord.packId || 0
  )
  const ensureDraftApi = String(
    item.meta?.ensureDraftApi || '/bot/admin/skill_draft/from_skill'
  )
  const [ensureError, setEnsureError] = useState('')
  const [ensureLoading, setEnsureLoading] = useState(false)
  const ensureKeyRef = useRef('')
  const newDraftSessionContext =
    String(item.meta?.newDraftSessionContext || '').trim() ||
    DEFAULT_NEW_DRAFT_SESSION_CONTEXT

  useEffect(() => {
    if (!modalOpen || draftID > 0 || sourceSkillID <= 0 || !ensureDraftApi) {
      return
    }
    const ensureKey = `${sourceSkillID}:${packID || 0}`
    if (ensureKeyRef.current === ensureKey) {
      return
    }
    ensureKeyRef.current = ensureKey
    setEnsureLoading(true)
    setEnsureError('')
    void request(ensureDraftApi, 'post', {
      skill_id: sourceSkillID,
      pack_id: packID,
    })
      .then((response) => {
        const data = normalizeApiData(response)
        const draft = isPlainRecord(data.draft) ? data.draft : null
        if (draft) {
          store.getState().setValueByPath(draftPath, draft)
        }
      })
      .catch((error: unknown) => {
        ensureKeyRef.current = ''
        setEnsureError(
          error instanceof Error ? error.message : '创建未发布版本失败。'
        )
      })
      .finally(() => {
        setEnsureLoading(false)
      })
  }, [
    draftID,
    draftPath,
    ensureDraftApi,
    modalOpen,
    packID,
    sourceSkillID,
    store,
  ])

  const creatorItem = useMemo(
    () => ({
      ...item,
      meta: {
        ...(item.meta || {}),
        sessionEnabled: true,
        memoryEnabled: false,
        historyEnabled: false,
        newSessionEnabled: false,
        skillDraftPatchAutoApply: false,
        skillDraftPatchCloseOnSave:
          item.meta?.skillDraftPatchCloseOnSave !== false,
        sessionContext:
          draftID > 0
            ? `skill_draft:${draftID}`
            : newDraftSessionContext,
        placeholder:
          item.meta?.placeholder ||
          '描述要创建或修改的 skill。需要脚本、配置项、MCP、依赖或引用代码时直接说明。',
        emptyText:
          item.meta?.emptyText ||
          '描述你要创建的技能。AI 会先生成可保存内容，确认后点击“保存”。',
      },
    }),
    [draftID, item, newDraftSessionContext]
  )

  if (modalOpen && ensureLoading && draftID <= 0 && sourceSkillID > 0) {
    return (
      <div className='flex min-h-48 items-center justify-center text-sm text-muted-foreground'>
        正在准备未发布版本...
      </div>
    )
  }

  if (modalOpen && ensureError) {
    return (
      <div className='rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive'>
        {ensureError}
      </div>
    )
  }

  return <ShowAgent item={creatorItem} store={store} />
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function normalizedPositiveNumber(value: unknown) {
  const number = Number(value || 0)
  return Number.isFinite(number) && number > 0 ? number : 0
}

function normalizeApiData(response: unknown) {
  if (!isPlainRecord(response)) {
    return {}
  }
  const status = Number(response.status || 0)
  const code = Number(response.code || 0)
  if (status === 2 || code === 401) {
    throw new Error(
      String(response.msg || response.message || '请求失败').trim()
    )
  }
  return isPlainRecord(response.data) ? response.data : {}
}
