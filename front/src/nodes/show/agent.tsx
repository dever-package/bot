import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import type { NodeItemProps } from '@/page/nodes'
import {
  Brain,
  ExternalLink,
  History,
  Loader2,
  MessageSquarePlus,
  Plus,
  RotateCcw,
  Send,
  Square,
  Trash2,
} from 'lucide-react'
import { useStore } from 'zustand'
import { request } from '@dever/front-plugin'
import { runAgentStream, stopAgentStream } from '@/lib/agent/runner'
import {
  assistantReferencePayload,
  buildAssistantReferenceMessage,
  type AssistantReferenceFile,
} from '@/lib/assistant/reference'
import { reloadStorePageSchema } from '@/lib/page-schema-reload'
import {
  isEmptyRuntimeOutput,
  isPlainRecord as isPlainObject,
  normalizeRuntimeFrameOutput,
  resolveRuntimeFrameCancelable,
  runtimeErrorMessage,
} from '@/lib/runtime-stream-output'
import { getStoreValueByPath } from '@/lib/store'
import {
  streamValueText as valueText,
  type RuntimeStreamFrame,
} from '@/lib/stream'
import { ASSISTANT_DIALOG_LAYER_CLASS } from '@/lib/floating-layer'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import {
  AgentInteractionPanel,
  type AgentInteraction,
  type AgentInteractionSubmitResult,
} from '@/components/agent/interaction-panel'
import {
  AssistantReferenceList,
  AssistantReferencePicker,
} from '@/components/assistant/reference-picker'
import {
  AssistantSessionHistoryDialog,
  type AssistantSessionHistoryQuery,
} from '@/components/assistant/session-history-dialog'
import {
  EnergonContentView,
  type EnergonOutput,
} from '@/components/energon/content-view'
import {
  cancelStreamTiming,
  StreamTimingBadge,
  createStreamTiming,
  finishStreamTiming,
  isStreamTimingStatusOutput,
  markStreamTimingStopping,
  updateStreamTimingFromOutput,
  useStreamClock,
  type StreamTiming,
} from '@/components/stream-timing'
import {
  AgentResultCard,
  AgentResultDrawer,
  applyResultTaskPlaceholders,
  type AgentResultDetail,
  type AgentResultOutput,
  type AgentResultTask,
} from './agent-result'

type AgentRole = 'user' | 'assistant'

type AgentStreamOutput = {
  text: string
  finalOutput: AgentOutput | null
}

type AgentMessage = {
  id: string
  role: AgentRole
  text: string
  output?: AgentStreamOutput
  interaction?: AgentInteraction
  interactionAnswered?: boolean
  interactionData?: Record<string, unknown>
  kind?: 'chat' | 'interaction_result'
  data?: Record<string, unknown>
  running?: boolean
  error?: string
  requestID?: string
  actionTiming?: StreamTiming
  resultDetail?: AgentResultDetail
}

type AgentOutput = AgentResultOutput & {
  interaction?: AgentInteraction
}

type AgentSuggestion = {
  label: string
  prompt: string
}

type AgentFrame = RuntimeStreamFrame<AgentOutput>

type AssistantMemoryRecord = {
  id: number
  kind: string
  title: string
  content: string
  tags?: unknown
  importance?: number
}

type AssistantSessionRecord = {
  id: number
  title: string
  context_key: string
  agent_key: string
  status: number
  message_count: number
  last_message_at: string
}

type AssistantSessionListPayload = {
  sessions: AssistantSessionRecord[]
  pagination: {
    page: number
    page_size: number
    total: number
    total_pages: number
  }
}

const agentResultOutputKeys = [
  'title',
  'rich',
  'images',
  'videos',
  'audios',
  'files',
  'json',
] as const

const EMPTY_OUTPUT: AgentStreamOutput = {
  text: '',
  finalOutput: null,
}

export function ShowAgent({ item, store }: NodeItemProps) {
  const [messages, setMessages] = useState<AgentMessage[]>([])
  const [input, setInput] = useState('')
  const [references, setReferences] = useState<AssistantReferenceFile[]>([])
  const [referenceMessage, setReferenceMessage] = useState('')
  const [requestID, setRequestID] = useState('')
  const [sessionID, setSessionID] = useState(0)
  const [sessionLoading, setSessionLoading] = useState(false)
  const [historyDialogOpen, setHistoryDialogOpen] = useState(false)
  const [memories, setMemories] = useState<AssistantMemoryRecord[]>([])
  const [memoryDialogOpen, setMemoryDialogOpen] = useState(false)
  const [memoryTitle, setMemoryTitle] = useState('')
  const [memoryContent, setMemoryContent] = useState('')
  const [memorySaving, setMemorySaving] = useState(false)
  const [running, setRunning] = useState(false)
  const [cancelable, setCancelable] = useState(false)
  const [stopping, setStopping] = useState(false)
  const [error, setError] = useState('')
  const [lastStreamID, setLastStreamID] = useState('0-0')
  const [interactionDialogOpen, setInteractionDialogOpen] = useState(false)
  const [interactionDialogMessageID, setInteractionDialogMessageID] =
    useState('')
  const [resultDrawerMessageID, setResultDrawerMessageID] = useState('')
  const messageListRef = useRef<HTMLDivElement>(null)
  const lastAutoScrollResultKeyRef = useRef('')
  const finalSideEffectKeyRef = useRef('')
  const draftPatchSideEffectKeyRef = useRef('')
  const runTokenRef = useRef(0)
  const openWasTrackedRef = useRef(false)
  const scrollMessageListToBottom = useCallback(() => {
    const element = messageListRef.current
    if (!element) {
      return
    }
    scheduleAgentMessagesScrollToBottom(element)
  }, [])

  const agentKey = useStore(store, () =>
    valueText(getStoreValueByPath(store, String(item.meta?.agentPath || '')))
  )
  const agentName = useStore(store, () =>
    valueText(
      getStoreValueByPath(store, String(item.meta?.agentNamePath || ''))
    )
  )
  const openPath = String(item.meta?.openPath || '')
  const modalOpen = useStore(store, () =>
    openPath ? Boolean(getStoreValueByPath(store, openPath)) : true
  )
  const requestApi = String(item.meta?.requestApi || '/bot/admin/agent/run')
  const streamApi = String(item.meta?.streamApi || '/bot/admin/agent/stream')
  const stopApi = String(item.meta?.stopApi || '/bot/admin/agent/stop')
  const paramApi = String(item.meta?.paramApi || '/bot/admin/energon/power_params')
  const sessionEnabled = Boolean(item.meta?.sessionEnabled)
  const memoryEnabled = Boolean(item.meta?.memoryEnabled)
  const sessionApi = String(item.meta?.sessionApi || '/bot/admin/assistant/session')
  const sessionsApi = String(
    item.meta?.sessionsApi || '/bot/admin/assistant/sessions'
  )
  const archiveSessionApi = String(
    item.meta?.archiveSessionApi || '/bot/admin/assistant/archive_session'
  )
  const restoreSessionApi = String(
    item.meta?.restoreSessionApi || '/bot/admin/assistant/restore_session'
  )
  const renameSessionApi = String(
    item.meta?.renameSessionApi || '/bot/admin/assistant/rename_session'
  )
  const newSessionApi = String(
    item.meta?.newSessionApi || '/bot/admin/assistant/new_session'
  )
  const clearSessionApi = String(
    item.meta?.clearSessionApi || '/bot/admin/assistant/clear_session'
  )
  const messageApi = String(item.meta?.messageApi || '/bot/admin/assistant/message')
  const memoryApi = String(item.meta?.memoryApi || '/bot/admin/assistant/memory')
  const deleteMemoryApi = String(
    item.meta?.deleteMemoryApi || '/bot/admin/assistant/forget_memory'
  )
  const skillDraftPatchApi = String(item.meta?.skillDraftPatchApi || '')
  const sessionContext = useStore(store, () =>
    resolveAssistantSessionContext(item.meta?.sessionContext, store, agentKey)
  )
  const blockMs = Number(item.meta?.blockMs || 1000)
  const initialInput = String(item.meta?.initialInput || '')
  const inputPlaceholder = String(
    item.meta?.placeholder || '输入本轮任务，当前弹窗内的上下文会一起发送。'
  )
  const emptyText = String(item.meta?.emptyText || '')
  const containerHeight =
    valueText(item.meta?.height || item.meta?.containerHeight).trim() ||
    'min(calc(85vh - 11rem), 620px)'
  const pendingInteractionMessage = useMemo(
    () =>
      [...messages]
        .reverse()
        .find(
          (message) =>
            message.role === 'assistant' &&
            message.interaction &&
            !message.interactionAnswered
        ),
    [messages]
  )
  const pendingInteractionMessageID = pendingInteractionMessage?.id || ''
  const interactionDialogMessage = useMemo(() => {
    if (!interactionDialogMessageID) {
      return pendingInteractionMessage
    }
    return (
      messages.find(
        (message) =>
          message.id === interactionDialogMessageID &&
          message.role === 'assistant' &&
          Boolean(message.interaction)
      ) || pendingInteractionMessage
    )
  }, [interactionDialogMessageID, messages, pendingInteractionMessage])
  const resultDrawerMessage = useMemo(() => {
    if (!resultDrawerMessageID) {
      return undefined
    }
    return messages.find(
      (message) =>
        message.id === resultDrawerMessageID && message.role === 'assistant'
    )
  }, [messages, resultDrawerMessageID])
  const resultDrawerDetail = useMemo(
    () =>
      resultDrawerMessage ? buildAgentResultDetail(resultDrawerMessage) : null,
    [resultDrawerMessage]
  )
  const resultDrawerSuggestions = useMemo(
    () =>
      resultDrawerMessage
        ? buildMessageSuggestions(
            resultDrawerMessage,
            Boolean(resultDrawerDetail)
          )
        : [],
    [resultDrawerDetail, resultDrawerMessage]
  )

  const canSend = useMemo(
    () =>
      (input.trim().length > 0 || references.length > 0) &&
      agentKey.length > 0 &&
      !sessionLoading &&
      !running,
    [agentKey, input, references.length, running, sessionLoading]
  )
  const hasRunningActionTiming = useMemo(
    () =>
      messages.some(
        (message) =>
          message.actionTiming && message.actionTiming.status === 'running'
      ),
    [messages]
  )
  const nowMs = useStreamClock(hasRunningActionTiming)
  const latestVisibleResultKey = useMemo(
    () => buildLatestVisibleResultKey(messages),
    [messages]
  )

  useLayoutEffect(() => {
    if (
      !latestVisibleResultKey ||
      latestVisibleResultKey === lastAutoScrollResultKeyRef.current
    ) {
      return
    }
    lastAutoScrollResultKeyRef.current = latestVisibleResultKey

    const element = messageListRef.current
    if (!element) {
      return
    }

    return scheduleAgentMessagesScrollToBottom(element)
  }, [latestVisibleResultKey])

  const resetSession = useCallback(() => {
    runTokenRef.current += 1
    lastAutoScrollResultKeyRef.current = ''
    setMessages([])
    setInput(initialInput)
    setReferences([])
    setReferenceMessage('')
    setRequestID('')
    setSessionID(0)
    setMemories([])
    setRunning(false)
    setCancelable(false)
    setStopping(false)
    setError('')
    setLastStreamID('0-0')
    setInteractionDialogOpen(false)
    setInteractionDialogMessageID('')
    setResultDrawerMessageID('')
    setHistoryDialogOpen(false)
  }, [initialInput])

  const applyAssistantSessionPayload = useCallback((payload: unknown) => {
    const data = isPlainObject(payload) ? payload : {}
    const session = isPlainObject(data.session) ? data.session : {}
    const sessionId = Number(session.id || 0)
    setSessionID(Number.isFinite(sessionId) ? sessionId : 0)
    setMessages(normalizeAssistantSessionMessages(data.messages))
    setMemories(normalizeAssistantMemories(data.memories))
    scrollMessageListToBottom()
  }, [scrollMessageListToBottom])

  const loadAssistantSession = useCallback(
    async (newSession = false) => {
      if (!sessionEnabled || !agentKey) {
        return
      }
      setSessionLoading(true)
      try {
        const payload = await assistantApiRequest(
          newSession ? newSessionApi : sessionApi,
          {
            agent_key: agentKey,
            context_key: sessionContext,
            title: agentName ? `${agentName} 会话` : '新会话',
            limit: 80,
          }
        )
        applyAssistantSessionPayload(payload)
        setError('')
      } catch (currentError: unknown) {
        setError(runtimeErrorMessage(currentError, '加载会话失败。'))
      } finally {
        setSessionLoading(false)
      }
    },
    [
      agentKey,
      agentName,
      applyAssistantSessionPayload,
      newSessionApi,
      sessionApi,
      sessionContext,
      sessionEnabled,
    ]
  )

  const clearPersistentSession = async () => {
    if (!sessionEnabled || !sessionID || running) {
      resetSession()
      return
    }
    setSessionLoading(true)
    try {
      const payload = await assistantApiRequest(clearSessionApi, {
        session_id: sessionID,
      })
      applyAssistantSessionPayload(payload)
    } catch (currentError: unknown) {
      setError(runtimeErrorMessage(currentError, '清空会话失败。'))
    } finally {
      setSessionLoading(false)
    }
  }

  const loadHistorySessions = useCallback(
    async (
      query: AssistantSessionHistoryQuery
    ): Promise<AssistantSessionListPayload> => {
      if (!sessionEnabled || !agentKey) {
        return emptyAssistantSessionList(query)
      }
      const payload = await assistantApiRequest(sessionsApi, {
        agent_key: agentKey,
        context_key: sessionContext,
        page: query.page,
        page_size: query.pageSize,
        keyword: query.keyword,
        status: query.status,
      })
      const data = isPlainObject(payload) ? payload : {}
      setError('')
      return {
        sessions: normalizeAssistantSessions(data.sessions),
        pagination: normalizeAssistantPagination(data.pagination, query),
      }
    },
    [agentKey, sessionContext, sessionEnabled, sessionsApi]
  )

  const archiveHistorySession = useCallback(
    async (nextSessionID: number) => {
      await assistantApiRequest(archiveSessionApi, {
        session_id: nextSessionID,
      })
    },
    [archiveSessionApi]
  )

  const restoreHistorySession = useCallback(
    async (nextSessionID: number) => {
      await assistantApiRequest(restoreSessionApi, {
        session_id: nextSessionID,
      })
    },
    [restoreSessionApi]
  )

  const renameHistorySession = useCallback(
    async (nextSessionID: number, title: string) => {
      const payload = await assistantApiRequest(renameSessionApi, {
        session_id: nextSessionID,
        title,
      })
      return normalizeAssistantSession(
        isPlainObject(payload) ? payload.session : null
      )
    },
    [renameSessionApi]
  )

  const openAssistantSession = async (nextSessionID: number) => {
    if (!nextSessionID || running) {
      return
    }
    setSessionLoading(true)
    try {
      const payload = await assistantApiRequest(sessionApi, {
        session_id: nextSessionID,
        agent_key: agentKey,
        context_key: sessionContext,
        limit: 80,
      })
      applyAssistantSessionPayload(payload)
      setHistoryDialogOpen(false)
      setError('')
    } catch (currentError: unknown) {
      setError(runtimeErrorMessage(currentError, '打开会话失败。'))
    } finally {
      setSessionLoading(false)
    }
  }

  const startPersistentSession = async () => {
    if (!sessionEnabled || running) {
      resetSession()
      return
    }
    resetSession()
    await loadAssistantSession(true)
  }

  const saveMemory = async () => {
    if (!memoryEnabled || memorySaving) {
      return
    }
    const title = memoryTitle.trim()
    const content = memoryContent.trim()
    if (!title || !content) {
      setError('记忆标题和内容不能为空。')
      return
    }
    setMemorySaving(true)
    try {
      const payload = await assistantApiRequest(memoryApi, {
        title,
        content,
        kind: 'semantic',
        context_key: sessionContext,
        agent_key: agentKey,
      })
      const memory = normalizeAssistantMemory(
        isPlainObject(payload) ? payload.memory : null
      )
      if (memory) {
        setMemories((current) => [memory, ...current])
      }
      setMemoryTitle('')
      setMemoryContent('')
      setError('')
    } catch (currentError: unknown) {
      setError(runtimeErrorMessage(currentError, '保存记忆失败。'))
    } finally {
      setMemorySaving(false)
    }
  }

  const deleteMemory = async (memoryID: number) => {
    if (!memoryEnabled || !memoryID) {
      return
    }
    try {
      await assistantApiRequest(deleteMemoryApi, { id: memoryID })
      setMemories((current) => current.filter((memory) => memory.id !== memoryID))
    } catch (currentError: unknown) {
      setError(runtimeErrorMessage(currentError, '删除记忆失败。'))
    }
  }

  const ensureAssistantSession = async () => {
    if (!sessionEnabled) {
      return 0
    }
    if (sessionID > 0) {
      return sessionID
    }
    const payload = await assistantApiRequest(sessionApi, {
      agent_key: agentKey,
      context_key: sessionContext,
      title: agentName ? `${agentName} 会话` : '新会话',
      limit: 80,
    })
    applyAssistantSessionPayload(payload)
    const session = isPlainObject(payload) && isPlainObject(payload.session)
      ? payload.session
      : {}
    const nextID = Number(session.id || 0)
    return Number.isFinite(nextID) ? nextID : 0
  }

  const savePersistentMessage = async (
    activeSessionID: number,
    message: Omit<AgentMessage, 'id'>,
    options?: {
      requestID?: string
      status?: number
      output?: unknown
    }
  ) => {
    if (!sessionEnabled || activeSessionID <= 0) {
      return
    }
    await assistantApiRequest(messageApi, {
      session_id: activeSessionID,
      agent_key: agentKey,
      context_key: sessionContext,
      role: message.role,
      kind: message.kind || 'chat',
      text: message.text,
      content: {
        kind: message.kind,
        data: message.data,
        interaction: message.interaction,
        interaction_answered: message.interactionAnswered,
        interaction_data: message.interactionData,
      },
      output: options?.output || message.output || {},
      request_id: options?.requestID || message.requestID || '',
      status: options?.status || 1,
    })
  }

  useEffect(() => {
    if (!openPath) {
      return
    }
    if (modalOpen && !openWasTrackedRef.current) {
      resetSession()
    }
    if (!modalOpen && openWasTrackedRef.current) {
      resetSession()
    }
    openWasTrackedRef.current = modalOpen
  }, [modalOpen, openPath, resetSession])

  useEffect(() => {
    resetSession()
  }, [agentKey, resetSession])

  useEffect(() => {
    if (!sessionEnabled || !agentKey) {
      return
    }
    if (openPath && !modalOpen) {
      return
    }
    void loadAssistantSession(false)
  }, [agentKey, loadAssistantSession, modalOpen, openPath, sessionEnabled])

  useEffect(() => {
    if (pendingInteractionMessageID) {
      setInteractionDialogMessageID(pendingInteractionMessageID)
      setInteractionDialogOpen(true)
    }
  }, [pendingInteractionMessageID])

  const openInteractionDialog = (messageID: string) => {
    setInteractionDialogMessageID(messageID)
    setInteractionDialogOpen(true)
  }

  const changeInteractionDialogOpen = (open: boolean) => {
    setInteractionDialogOpen(open)
    if (!open) {
      setInteractionDialogMessageID('')
    }
  }

  const send = async () => {
    const runReferences = references
    const text =
      input.trim() ||
      (runReferences.length > 0 ? '请根据参考资料和当前任务进行分析。' : '')
    if (!text || running) {
      return
    }
    const referencePayload = assistantReferencePayload(runReferences)
    if (runReferences.length > 0) {
      setReferences([])
      setReferenceMessage('')
    }
    await runAgent(
      {
        text,
        ...(referencePayload ? { reference_files: referencePayload } : {}),
      },
      {
        role: 'user',
        text: buildAssistantReferenceMessage(text, runReferences),
        kind: 'chat',
        data: referencePayload
          ? { reference_files: referencePayload }
          : undefined,
      },
      messages
    )
  }

  const sendSuggestion = async (suggestion: AgentSuggestion) => {
    const text = suggestion.prompt.trim()
    if (!text || running) {
      return
    }
    setResultDrawerMessageID('')
    await runAgent(
      { text },
      {
        role: 'user',
        text,
        kind: 'chat',
      },
      messages,
      '',
      undefined
    )
  }

  const submitInteraction = async (result: AgentInteractionSubmitResult) => {
    const sourceMessage = interactionDialogMessage
    if (
      !sourceMessage?.interaction ||
      sourceMessage.interactionAnswered ||
      running
    ) {
      return
    }
    setInteractionDialogOpen(false)
    setInteractionDialogMessageID('')

    await runAgent(
      {
        type: 'interaction_result',
        interaction_id: sourceMessage.interaction.id || '',
        interaction_type: sourceMessage.interaction.type || '',
        interaction: sourceMessage.interaction,
        data: result.data,
        text: result.text,
      },
      {
        role: 'user',
        text: result.text,
        kind: 'interaction_result',
        data: result.data,
      },
      messages,
      sourceMessage.id,
      result.data
    )
  }

  const runAgent = async (
    inputPayload: Record<string, unknown>,
    userMessageBody: Omit<AgentMessage, 'id'>,
    historyMessages: AgentMessage[],
    answeredInteractionMessageID = '',
    answeredInteractionData?: Record<string, unknown>
  ) => {
    if (!agentKey) {
      setError('未选择智能体。')
      return
    }
    let activeSessionID = 0
    if (sessionEnabled) {
      try {
        activeSessionID = await ensureAssistantSession()
      } catch (currentError: unknown) {
        setError(runtimeErrorMessage(currentError, '创建会话失败。'))
        return
      }
    }

    const token = runTokenRef.current + 1
    const userMessage: AgentMessage = {
      id: `${token}-user-${Date.now()}`,
      ...userMessageBody,
    }
    const assistantID = `${token}-assistant-${Date.now()}`
    const assistantMessage: AgentMessage = {
      id: assistantID,
      role: 'assistant',
      text: '',
      output: EMPTY_OUTPUT,
      running: true,
      actionTiming: createStreamTiming('等待智能体返回'),
    }
    const history = buildHistory(historyMessages)
    const requestInput = mergeAgentInputContext(
      inputPayload,
      resolveMetaPathMap(item.meta?.inputContext, store)
    )
    if (activeSessionID > 0) {
      requestInput.assistant_session_id = activeSessionID
    }

    runTokenRef.current = token
    finalSideEffectKeyRef.current = ''
    setMessages((current) => {
      const next = answeredInteractionMessageID
        ? current.map((message) =>
            message.id === answeredInteractionMessageID
              ? {
                  ...message,
                  interactionAnswered: true,
                  interactionData: answeredInteractionData,
                }
              : message
          )
        : current
      return [...next, userMessage, assistantMessage]
    })
    scrollMessageListToBottom()
    setInput('')
    setRunning(true)
    setCancelable(false)
    setStopping(false)
    setError('')
    setRequestID('')
    setLastStreamID('0-0')

    try {
      await savePersistentMessage(activeSessionID, userMessage)
    } catch (currentError: unknown) {
      setError(runtimeErrorMessage(currentError, '保存用户消息失败。'))
    }

    let assistantSaved = false
    try {
      await runAgentStream<AgentOutput>({
        agent: agentKey,
        input: requestInput,
        history,
        requestApi,
        streamApi,
        stopApi,
        blockMs,
        onRequestID: setRequestID,
        onFrame: (frame) => {
          if (runTokenRef.current !== token) {
            return
          }
          const streamID = valueText(frame?.stream_id)
          if (streamID) {
            setLastStreamID(streamID)
          }
          applyFrameToMessage(assistantID, frame)
          handleFinalFrameSideEffects(frame)
          if (
            activeSessionID > 0 &&
            frame?.type === 'result' &&
            !assistantSaved
          ) {
            assistantSaved = true
            const finalOutput = normalizeRuntimeFrameOutput(frame?.output, frame)
            const finalText =
              valueText(finalOutput.text) ||
              valueText(frame?.msg) ||
              '智能体已返回结果。'
            void savePersistentMessage(
              activeSessionID,
              {
                ...assistantMessage,
                text: finalText,
                output: {
                  text: finalText,
                  finalOutput: normalizeAgentDisplayOutput(finalOutput, finalText),
                },
                running: false,
                requestID: valueText(frame?.request_id) || requestID,
              },
              {
                requestID: valueText(frame?.request_id) || requestID,
                output: finalOutput,
                status: Number(frame.status) === 2 ? 2 : 1,
              }
            )
          }
        },
      })
    } catch (currentError: unknown) {
      if (runTokenRef.current === token) {
        const message = runtimeErrorMessage(currentError, '智能体测试失败。')
        setError(message)
        markAssistantError(assistantID, message)
        if (activeSessionID > 0 && !assistantSaved) {
          assistantSaved = true
          void savePersistentMessage(
            activeSessionID,
            {
              ...assistantMessage,
              text: message,
              running: false,
              error: message,
              requestID,
            },
            { requestID, status: 2, output: { error: message, text: message } }
          )
        }
      }
    } finally {
      if (runTokenRef.current === token) {
        setRunning(false)
        setCancelable(false)
        setStopping(false)
        markAssistantDone(assistantID)
      }
    }
  }

  const stop = async () => {
    if (!requestID || !cancelable || stopping) {
      return
    }
    setStopping(true)
    markRunningAssistantStopping()
    try {
      await stopAgentStream(requestID, stopApi)
      runTokenRef.current += 1
      setRunning(false)
      setCancelable(false)
      markRunningAssistantCanceled()
    } catch (currentError: unknown) {
      setError(runtimeErrorMessage(currentError, '停止智能体失败。'))
    } finally {
      setStopping(false)
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      void send()
    }
  }

  const handleFinalFrameSideEffects = (frame: AgentFrame) => {
    handleSkillDraftPatchSideEffect(frame)
    if (frame?.type !== 'result' || item.meta?.reloadPageOnFinal !== true) {
      return
    }
    if (Number(frame.status) === 2) {
      return
    }

    const output = normalizeRuntimeFrameOutput(frame?.output, frame)
    const kind = valueText(output.kind || output.type || output.event)
      .trim()
      .toLowerCase()
    if (!shouldRunFinalSideEffect(kind, item.meta?.reloadPageOnFinalKinds)) {
      return
    }

    const key = [frame.request_id, frame.stream_id, kind]
      .map(valueText)
      .join(':')
    if (finalSideEffectKeyRef.current === key) {
      return
    }
    finalSideEffectKeyRef.current = key

    const delayMs = Math.max(
      0,
      Number(item.meta?.reloadPageOnFinalDelayMs || 0)
    )
    window.setTimeout(() => {
      void reloadStorePageSchema(store)
    }, delayMs)
  }

  const handleSkillDraftPatchSideEffect = (frame: AgentFrame) => {
    if (frame?.type !== 'result' || !skillDraftPatchApi) {
      return
    }
    if (Number(frame.status) === 2) {
      return
    }
    const output = normalizeRuntimeFrameOutput(frame?.output, frame)
    const payload = resolveSkillDraftPatchPayload(output)
    if (!payload) {
      return
    }
    const key = [frame.request_id, frame.stream_id, 'skill_draft_patch']
      .map(valueText)
      .join(':')
    if (draftPatchSideEffectKeyRef.current === key) {
      return
    }
    draftPatchSideEffectKeyRef.current = key
    const context = resolveMetaPathMap(item.meta?.skillDraftPatchContext, store)
    void assistantApiRequest(skillDraftPatchApi, {
      ...context,
      ...payload,
    })
      .then(() => reloadStorePageSchema(store))
      .catch((currentError: unknown) => {
        setError(runtimeErrorMessage(currentError, '应用技能草稿失败。'))
      })
  }

  const applyFrameToMessage = (
    messageID: string,
    frame: AgentFrame,
    options?: {
      updateCancelable?: boolean
    }
  ) => {
    const frameOutput = normalizeRuntimeFrameOutput(frame?.output, frame)
    if (isEmptyRuntimeOutput(frameOutput) && frame?.type !== 'result') {
      return
    }
    const frameCancelable = resolveRuntimeFrameCancelable(frame)
    if (options?.updateCancelable !== false && frameCancelable != null) {
      setCancelable(frameCancelable)
    }

    updateAssistant(messageID, (message) => {
      const currentOutput = message.output || EMPTY_OUTPUT
      const nextOutput: AgentStreamOutput = {
        text: currentOutput.text,
        finalOutput: currentOutput.finalOutput,
      }

      const event = valueText(frameOutput.event).toLowerCase()
      const frameInteraction = normalizeFrameInteraction(
        frameOutput.interaction
      )
      if (frame?.type !== 'result' && isAgentResultRuntimeEvent(event)) {
        return applyResultRuntimeEvent(message, frameOutput, frame)
      }
      let actionTiming = message.actionTiming
      if (isStreamTimingStatusOutput(frameOutput)) {
        actionTiming = updateStreamTimingFromOutput(actionTiming, frameOutput)
      }
      const actionResultDetail = mergeActionResultDetail(
        message.resultDetail,
        frameOutput,
        frame
      )
      if (frame?.type === 'result') {
        let finalOutput = isEmptyRuntimeOutput(frameOutput)
          ? normalizeAgentDisplayOutput({
              text: nextOutput.text || valueText(frame?.msg),
            })
          : frameOutput
        if (isNonResultOutput(finalOutput) && nextOutput.text.trim()) {
          finalOutput = normalizeAgentDisplayOutput({
            ...finalOutput,
            event: 'final',
            text: nextOutput.text,
          })
        }
        nextOutput.finalOutput = finalOutput
        const finalText = valueText(finalOutput.text) || nextOutput.text
        const resultDetail = mergeMessageResultDetail(
          actionResultDetail,
          resultDetailFromFinalOutput(finalOutput)
        )
        return {
          ...message,
          text: finalText,
          interaction: frameInteraction || message.interaction,
          output: nextOutput,
          resultDetail,
          running: false,
          requestID: valueText(frame?.request_id) || message.requestID,
          actionTiming: finishStreamTiming(
            actionTiming,
            Number(frame.status) === 2 ? 'failed' : 'done'
          ),
        }
      }
      if (event === 'interaction') {
        if (frameOutput.text) {
          nextOutput.text = valueText(frameOutput.text)
        }
        return {
          ...message,
          text: nextOutput.text,
          interaction: frameInteraction || message.interaction,
          output: nextOutput,
          resultDetail: actionResultDetail,
          requestID: valueText(frame?.request_id) || message.requestID,
          actionTiming,
        }
      }
      if (event === 'delta' || (!event && frameOutput.text)) {
        nextOutput.text += valueText(frameOutput.text)
      }
      return {
        ...message,
        text: nextOutput.text,
        interaction: frameInteraction || message.interaction,
        output: nextOutput,
        resultDetail: actionResultDetail,
        requestID: valueText(frame?.request_id) || message.requestID,
        actionTiming,
      }
    })
  }

  const updateAssistant = (
    messageID: string,
    updater: (message: AgentMessage) => AgentMessage
  ) => {
    setMessages((current) =>
      current.map((message) =>
        message.id === messageID && message.role === 'assistant'
          ? updater(message)
          : message
      )
    )
  }

  const updateRunningAssistant = (
    updater: (message: AgentMessage) => AgentMessage
  ) => {
    setMessages((current) =>
      current.map((message) =>
        message.role === 'assistant' && message.running
          ? updater(message)
          : message
      )
    )
  }

  const markRunningAssistantStopping = () => {
    updateRunningAssistant((current) => ({
      ...current,
      actionTiming: markStreamTimingStopping(current.actionTiming),
    }))
  }

  const markRunningAssistantCanceled = () => {
    updateRunningAssistant((current) => ({
      ...current,
      running: false,
      actionTiming: cancelStreamTiming(current.actionTiming),
    }))
  }

  const markAssistantError = (messageID: string, message: string) => {
    updateAssistant(messageID, (current) => ({
      ...current,
      error: message,
      running: false,
      actionTiming: finishStreamTiming(current.actionTiming, 'failed'),
    }))
  }

  const markAssistantDone = (messageID: string) => {
    updateAssistant(messageID, (current) => ({
      ...current,
      running: false,
      actionTiming: finishStreamTiming(current.actionTiming, 'done'),
    }))
  }

  return (
    <div
      className='flex min-h-0 flex-col gap-3 overflow-hidden'
      style={{ height: containerHeight }}
    >
      <div
        ref={messageListRef}
        className='min-h-0 flex-1 space-y-3 overflow-y-auto rounded-md border bg-background p-3'
      >
        {messages.length === 0 ? (
          <div className='flex h-full min-h-48 items-center justify-center text-center text-sm text-muted-foreground'>
            {emptyText ||
              `输入一次任务开始测试${agentName ? `「${agentName}」` : '智能体'}。`}
          </div>
        ) : null}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                'max-w-[86%] rounded-md border px-3 py-2 text-sm leading-6',
                message.role === 'user'
                  ? 'border-primary/20 bg-primary text-primary-foreground'
                  : 'bg-muted/35 text-foreground'
              )}
            >
              {message.role === 'user' ? (
                <div className='whitespace-pre-wrap break-all'>
                  {message.text}
                </div>
              ) : (
                <AgentAssistantMessage
                  message={message}
                  now={nowMs}
                  running={running}
                  onOpenInteraction={openInteractionDialog}
                  onOpenResult={() => setResultDrawerMessageID(message.id)}
                  onSendSuggestion={(suggestion) =>
                    void sendSuggestion(suggestion)
                  }
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <AgentInteractionDialog
        open={
          Boolean(interactionDialogMessage?.interaction) &&
          interactionDialogOpen
        }
        interaction={interactionDialogMessage?.interaction}
        paramApi={paramApi}
        readonly={Boolean(interactionDialogMessage?.interactionAnswered)}
        initialData={interactionDialogMessage?.interactionData}
        disabled={running}
        onOpenChange={changeInteractionDialogOpen}
        onSubmit={(result) => void submitInteraction(result)}
      />

      <AgentResultDrawer
        open={Boolean(resultDrawerMessage)}
        detail={resultDrawerDetail}
        running={running}
        suggestions={
          resultDrawerSuggestions.length > 0 ? (
            <AgentSuggestionBar
              suggestions={resultDrawerSuggestions}
              disabled={running}
              onSelect={(suggestion) => void sendSuggestion(suggestion)}
            />
          ) : null
        }
        onOpenChange={(open) => {
          if (!open) {
            setResultDrawerMessageID('')
          }
        }}
      />

      <AssistantSessionHistoryDialog
        open={historyDialogOpen}
        onOpenChange={setHistoryDialogOpen}
        agentKey={agentKey}
        contextKey={sessionContext}
        activeSessionID={sessionID}
        disabled={running || sessionLoading}
        assistantLayer
        layerClassName={ASSISTANT_DIALOG_LAYER_CLASS}
        loadSessions={loadHistorySessions}
        onOpenSession={(id) => openAssistantSession(id)}
        onArchiveSession={archiveHistorySession}
        onRestoreSession={restoreHistorySession}
        onRenameSession={renameHistorySession}
      />

      <Dialog open={memoryDialogOpen} onOpenChange={setMemoryDialogOpen}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle>长期记忆</DialogTitle>
            <DialogDescription>
              只保存已经确认会长期复用的偏好、约束和事实。
            </DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='grid gap-2'>
              <input
                value={memoryTitle}
                disabled={memorySaving}
                placeholder='标题'
                className='h-9 rounded-md border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/20'
                onChange={(event) => setMemoryTitle(event.target.value)}
              />
              <Textarea
                value={memoryContent}
                disabled={memorySaving}
                placeholder='记忆内容'
                className='min-h-24'
                onChange={(event) => setMemoryContent(event.target.value)}
              />
              <div className='flex justify-end'>
                <Button
                  type='button'
                  size='sm'
                  disabled={memorySaving || !memoryTitle.trim() || !memoryContent.trim()}
                  onClick={() => void saveMemory()}
                >
                  {memorySaving ? (
                    <Loader2 className='size-3.5 animate-spin' />
                  ) : (
                    <Plus className='size-3.5' />
                  )}
                  保存记忆
                </Button>
              </div>
            </div>
            <div className='max-h-72 space-y-2 overflow-y-auto'>
              {memories.length === 0 ? (
                <div className='rounded-md border border-dashed px-3 py-6 text-center text-sm text-muted-foreground'>
                  暂无长期记忆。
                </div>
              ) : null}
              {memories.map((memory) => (
                <div
                  key={memory.id}
                  className='rounded-md border bg-muted/20 px-3 py-2'
                >
                  <div className='flex items-start justify-between gap-3'>
                    <div className='min-w-0'>
                      <div className='truncate text-sm font-medium'>
                        {memory.title || `记忆 ${memory.id}`}
                      </div>
                      <div className='mt-1 whitespace-pre-wrap break-words text-sm text-muted-foreground'>
                        {memory.content}
                      </div>
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      className='size-8 shrink-0'
                      onClick={() => void deleteMemory(memory.id)}
                    >
                      <Trash2 className='size-3.5' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {error ? (
        <div className='rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive'>
          {error}
        </div>
      ) : null}

      <div className='shrink-0 overflow-hidden rounded-md border bg-background shadow-xs transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20'>
        {references.length > 0 ? (
          <div className='border-b px-3 py-2'>
            <AssistantReferenceList
              references={references}
              disabled={running}
              onRemove={(index) =>
                setReferences((current) =>
                  current.filter((_, currentIndex) => currentIndex !== index)
                )
              }
            />
          </div>
        ) : null}
        <Textarea
          value={input}
          disabled={running}
          placeholder={inputPlaceholder}
          className='min-h-20 resize-none border-0 bg-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0'
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className='flex items-center justify-between gap-3 border-t px-3 py-2'>
          <div className='min-w-0 truncate text-xs text-muted-foreground'>
            {requestID
              ? `RequestID: ${requestID}${lastStreamID !== '0-0' ? ` / ${lastStreamID}` : ''}`
              : referenceMessage ||
                (sessionEnabled
                  ? sessionLoading
                    ? '正在加载历史会话。'
                    : sessionID
                      ? '会话已保存，刷新后可继续。'
                      : '本次会话会保存到后台。'
                  : '关闭弹窗后会清空本次测试上下文。')}
          </div>
          <div className='flex shrink-0 items-center gap-2'>
            {sessionEnabled ? (
              <Button
                type='button'
                variant='outline'
                size='sm'
                disabled={running || sessionLoading}
                onClick={() => setHistoryDialogOpen(true)}
              >
                <History className='size-3.5' />
                历史
              </Button>
            ) : null}
            {memoryEnabled ? (
              <Button
                type='button'
                variant='outline'
                size='sm'
                disabled={running}
                onClick={() => setMemoryDialogOpen(true)}
              >
                <Brain className='size-3.5' />
                记忆
              </Button>
            ) : null}
            <AssistantReferencePicker
              references={references}
              disabled={running}
              buttonLabel='素材'
              onReferencesChange={setReferences}
              onMessage={setReferenceMessage}
            />
            <Button
              type='button'
              variant='outline'
              size='sm'
              disabled={running || sessionLoading}
              onClick={() =>
                sessionEnabled
                  ? void clearPersistentSession()
                  : resetSession()
              }
            >
              <Trash2 className='size-3.5' />
              清空
            </Button>
            <Button
              type='button'
              variant='outline'
              size='sm'
              disabled={running || sessionLoading}
              onClick={() =>
                sessionEnabled
                  ? void startPersistentSession()
                  : resetSession()
              }
            >
              <RotateCcw className='size-3.5' />
              {sessionEnabled ? '新会话' : '新对话'}
            </Button>
            {running ? (
              <Button
                type='button'
                variant='outline'
                size='sm'
                disabled={!cancelable || stopping}
                onClick={() => void stop()}
              >
                {stopping ? (
                  <Loader2 className='size-3.5 animate-spin' />
                ) : (
                  <Square className='size-3.5' />
                )}
                停止
              </Button>
            ) : null}
            <Button
              type='button'
              size='sm'
              disabled={!canSend}
              onClick={() => void send()}
            >
              {running ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <Send className='size-4' />
              )}
              发送
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function buildLatestVisibleResultKey(messages: AgentMessage[]) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index]
    if (
      message.role !== 'assistant' ||
      message.running ||
      message.error ||
      message.interaction
    ) {
      continue
    }
    if (
      buildAgentResultDetail(message) ||
      hasContentViewOutput(buildContentViewOutput(message))
    ) {
      return message.id
    }
  }
  return ''
}

function scrollAgentMessagesToBottom(element: HTMLElement) {
  element.scrollTop = element.scrollHeight
}

function scheduleAgentMessagesScrollToBottom(element: HTMLElement) {
  scrollAgentMessagesToBottom(element)
  const frameID = window.requestAnimationFrame(() => {
    scrollAgentMessagesToBottom(element)
  })
  const timerID = window.setTimeout(() => {
    scrollAgentMessagesToBottom(element)
  }, 120)

  return () => {
    window.cancelAnimationFrame(frameID)
    window.clearTimeout(timerID)
  }
}

async function assistantApiRequest(api: string, payload: Record<string, unknown>) {
  const result = await request(api, 'post', payload)
  if (!isPlainObject(result)) {
    return {}
  }
  const status = Number(result.status || 0)
  const code = Number(result.code || 0)
  if (status === 2 || code === 401) {
    throw new Error(valueText(result.msg || result.message) || '请求失败')
  }
  return isPlainObject(result.data) ? result.data : {}
}

function resolveAssistantSessionContext(
  value: unknown,
  store: NodeItemProps['store'],
  agentKey: string
) {
  if (isPlainObject(value)) {
    const resolved = resolveMetaPathMap(value, store)
    const entries = Object.entries(resolved)
      .filter(([, current]) => current != null && current !== '')
      .sort(([left], [right]) => left.localeCompare(right))
    if (entries.length > 0) {
      return entries
        .map(([key, current]) => `${key}:${valueText(current)}`)
        .join('|')
    }
  }
  const text = valueText(value).trim()
  if (text) {
    return text.replaceAll('{agent}', agentKey)
  }
  return agentKey ? `agent:${agentKey}` : 'agent'
}

function resolveSkillDraftPatchPayload(output: Record<string, unknown>) {
  const source = skillDraftPatchSource(output)
  if (!source) {
    return null
  }
  const patch = isPlainObject(source.patch)
    ? source.patch
    : isPlainObject(source.draft)
      ? source.draft
      : null
  if (!patch) {
    return null
  }
  const draftID = Number(source.draft_id || source.draftId || source.id || 0)
  const packID = Number(source.pack_id || source.packId || 0)
  const cateID = Number(source.cate_id || source.cateId || 0)
  return {
    ...(Number.isFinite(draftID) && draftID > 0 ? { id: draftID } : {}),
    ...(Number.isFinite(packID) && packID > 0 ? { pack_id: packID } : {}),
    ...(Number.isFinite(cateID) && cateID > 0 ? { cate_id: cateID } : {}),
    patch,
  }
}

function skillDraftPatchSource(output: Record<string, unknown>) {
  const candidates = [
    output,
    isPlainObject(output.json) ? output.json : null,
    isPlainObject(output.content) && isPlainObject(output.content.json)
      ? output.content.json
      : null,
  ]
  for (const candidate of candidates) {
    if (!isPlainObject(candidate)) {
      continue
    }
    const kind = valueText(candidate.kind || candidate.type || candidate.event)
      .trim()
      .toLowerCase()
    if (kind === 'skill_draft_patch') {
      return candidate
    }
  }
  return null
}

function normalizeAssistantSessionMessages(value: unknown): AgentMessage[] {
  const rows = Array.isArray(value) ? value : []
  return rows
    .map((row, index) => normalizeAssistantSessionMessage(row, index))
    .filter((message): message is AgentMessage => Boolean(message))
}

function normalizeAssistantSessionMessage(value: unknown, index: number) {
  if (!isPlainObject(value)) {
    return null
  }
  const role = valueText(value.role) === 'user' ? 'user' : 'assistant'
  const text = valueText(value.text)
  const content = isPlainObject(value.content) ? value.content : {}
  const output = isPlainObject(value.output) ? value.output : {}
  const kind = valueText(content.kind || value.kind) as AgentMessage['kind']
  const message: AgentMessage = {
    id: `saved-${valueText(value.id) || index}`,
    role,
    text,
    kind: kind || 'chat',
    data: isPlainObject(content.data)
      ? (content.data as Record<string, unknown>)
      : undefined,
    requestID: valueText(value.request_id),
    running: false,
  }
  if (role === 'assistant') {
    const finalOutput = isEmptyRuntimeOutput(output)
      ? normalizeAgentDisplayOutput({ text })
      : normalizeAgentDisplayOutput(output, text)
    message.output = {
      text,
      finalOutput,
    }
    if (Number(value.status) === 2) {
      message.error = text
    }
  }
  const interaction = normalizeFrameInteraction(content.interaction)
  if (interaction) {
    message.interaction = interaction
    message.interactionAnswered = Boolean(content.interaction_answered)
    if (isPlainObject(content.interaction_data)) {
      message.interactionData = content.interaction_data as Record<string, unknown>
    }
  }
  return message
}

function normalizeAssistantMemories(value: unknown) {
  const rows = Array.isArray(value) ? value : []
  return rows
    .map(normalizeAssistantMemory)
    .filter((memory): memory is AssistantMemoryRecord => Boolean(memory))
}

function normalizeAssistantSessions(value: unknown) {
  const rows = Array.isArray(value) ? value : []
  return rows
    .map(normalizeAssistantSession)
    .filter((session): session is AssistantSessionRecord => Boolean(session))
}

function normalizeAssistantSession(value: unknown) {
  if (!isPlainObject(value)) {
    return null
  }
  const id = Number(value.id || 0)
  if (!Number.isFinite(id) || id <= 0) {
    return null
  }
  return {
    id,
    title: valueText(value.title),
    context_key: valueText(value.context_key),
    agent_key: valueText(value.agent_key),
    status: Number(value.status || 0),
    message_count: Number(value.message_count || 0),
    last_message_at: valueText(value.last_message_at),
  }
}

function normalizeAssistantPagination(
  value: unknown,
  query: AssistantSessionHistoryQuery
) {
  const data = isPlainObject(value) ? value : {}
  return {
    page: positiveNumber(data.page, query.page),
    page_size: positiveNumber(data.page_size ?? data.pageSize, query.pageSize),
    total: positiveNumber(data.total, 0),
    total_pages: positiveNumber(data.total_pages ?? data.totalPages, 0),
  }
}

function emptyAssistantSessionList(
  query: AssistantSessionHistoryQuery
): AssistantSessionListPayload {
  return {
    sessions: [],
    pagination: {
      page: query.page,
      page_size: query.pageSize,
      total: 0,
      total_pages: 0,
    },
  }
}

function positiveNumber(value: unknown, fallback: number) {
  const number = Number(value)
  if (!Number.isFinite(number) || number < 0) {
    return fallback
  }
  return number
}

function normalizeAssistantMemory(value: unknown) {
  if (!isPlainObject(value)) {
    return null
  }
  const id = Number(value.id || 0)
  if (!Number.isFinite(id) || id <= 0) {
    return null
  }
  return {
    id,
    kind: valueText(value.kind),
    title: valueText(value.title),
    content: valueText(value.content),
    tags: value.tags,
    importance: Number(value.importance || 0),
  }
}

function resolveMetaPathMap(value: unknown, store: NodeItemProps['store']) {
  if (!isPlainObject(value)) {
    return {}
  }

  const result: Record<string, unknown> = {}
  for (const [key, path] of Object.entries(value)) {
    const normalizedKey = String(key || '').trim()
    const normalizedPath = String(path || '').trim()
    if (!normalizedKey || !normalizedPath) {
      continue
    }
    result[normalizedKey] = getStoreValueByPath(store, normalizedPath)
  }
  return result
}

function mergeAgentInputContext(
  inputPayload: Record<string, unknown>,
  context: Record<string, unknown>
) {
  const normalizedContext = Object.fromEntries(
    Object.entries(context).filter(([, value]) => value != null && value !== '')
  )
  if (!Object.keys(normalizedContext).length) {
    return inputPayload
  }

  const existingContext = isPlainObject(inputPayload.context)
    ? inputPayload.context
    : {}
  return {
    ...inputPayload,
    context: {
      ...existingContext,
      ...normalizedContext,
    },
  }
}

function AgentAssistantMessage({
  message,
  now,
  running,
  onOpenInteraction,
  onOpenResult,
  onSendSuggestion,
}: {
  message: AgentMessage
  now: number
  running: boolean
  onOpenInteraction: (messageID: string) => void
  onOpenResult: () => void
  onSendSuggestion: (suggestion: AgentSuggestion) => void
}) {
  const resultDetail = buildAgentResultDetail(message)
  const isResultCard = shouldDisplayResultCard(resultDetail)
  const contentOutput = buildContentViewOutput(message)
  const hasOutput = isResultCard || hasContentViewOutput(contentOutput)
  const suggestions = buildMessageSuggestions(message, hasOutput)

  return (
    <div className='space-y-2'>
      <AgentResultKindBadge message={message} hasOutput={hasOutput} />
      {isResultCard && resultDetail ? (
        <AgentResultCard
          detail={resultDetail}
          running={Boolean(message.running)}
          onOpen={onOpenResult}
        />
      ) : hasOutput ? (
        <AgentContentOutputView output={contentOutput} />
      ) : null}
      {resultDetail && !isResultCard ? (
        <AgentInlineResultActions onOpen={onOpenResult} />
      ) : null}
      <StreamTimingBadge timing={message.actionTiming} now={now} />
      {message.error ? (
        <div className='rounded-md border border-destructive/30 bg-destructive/10 px-2 py-1 text-destructive'>
          {message.error}
        </div>
      ) : null}
      {message.interaction ? (
        <div className='flex items-center justify-between gap-2 rounded-md border bg-background/80 px-2 py-1.5 text-xs text-muted-foreground'>
          <span>
            {message.interactionAnswered
              ? '交互信息已提交。'
              : '需要补充交互信息。'}
          </span>
          <Button
            type='button'
            size='sm'
            variant='outline'
            className='h-7 px-2 text-xs'
            disabled={running && !message.interactionAnswered}
            onClick={() => onOpenInteraction(message.id)}
          >
            {message.interactionAnswered ? '查看参数' : '填写参数'}
          </Button>
        </div>
      ) : null}
      <AgentSuggestionBar
        suggestions={suggestions}
        disabled={running}
        onSelect={onSendSuggestion}
      />
      {message.requestID ? (
        <div className='truncate border-t pt-1 font-mono text-[11px] text-muted-foreground'>
          {message.requestID}
        </div>
      ) : null}
    </div>
  )
}

function AgentContentOutputView({ output }: { output: unknown }) {
  const markdown = agentMarkdownText(output)
  if (markdown) {
    return <AgentMarkdownView text={markdown} />
  }
  return (
    <EnergonContentView
      output={output as EnergonOutput}
      streaming={false}
      emptyText='等待智能体返回。'
    />
  )
}

function AgentMarkdownView({ text }: { text: string }) {
  const blocks = markdownBlocks(text)
  if (blocks.length === 0) {
    return null
  }
  return (
    <div className='space-y-3 text-sm leading-6 text-foreground'>
      {blocks.map((block, index) => (
        <AgentMarkdownBlock
          key={`${block.type}-${index}-${block.text.slice(0, 20)}`}
          block={block}
        />
      ))}
    </div>
  )
}

type AgentMarkdownBlockData = {
  type: 'heading' | 'paragraph' | 'bullet' | 'ordered' | 'table'
  level?: number
  order?: string
  text: string
  header?: string[]
  rows?: string[][]
}

function AgentMarkdownBlock({ block }: { block: AgentMarkdownBlockData }) {
  if (block.type === 'heading') {
    const className =
      block.level === 1
        ? 'text-base font-semibold'
        : 'text-sm font-semibold text-foreground'
    return <div className={className}>{inlineMarkdown(block.text)}</div>
  }
  if (block.type === 'bullet') {
    return (
      <div className='flex gap-2'>
        <span className='mt-[0.55rem] size-1.5 shrink-0 rounded-full bg-primary/60' />
        <div className='min-w-0 flex-1'>{inlineMarkdown(block.text)}</div>
      </div>
    )
  }
  if (block.type === 'ordered') {
    return (
      <div className='flex gap-2'>
        <span className='min-w-5 shrink-0 font-medium text-muted-foreground'>
          {block.order}.
        </span>
        <div className='min-w-0 flex-1'>{inlineMarkdown(block.text)}</div>
      </div>
    )
  }
  if (block.type === 'table') {
    return <AgentMarkdownTable block={block} />
  }
  return <p>{inlineMarkdown(block.text)}</p>
}

function AgentMarkdownTable({ block }: { block: AgentMarkdownBlockData }) {
  const header = block.header || []
  const rows = block.rows || []
  if (header.length === 0 && rows.length === 0) {
    return null
  }
  return (
    <div className='overflow-x-auto rounded-md border bg-background/70'>
      <table className='w-full min-w-max border-collapse text-left text-xs'>
        {header.length > 0 ? (
          <thead className='bg-muted/70'>
            <tr>
              {header.map((cell, index) => (
                <th
                  key={`${cell}-${index}`}
                  className='border-b px-2.5 py-1.5 font-medium'
                >
                  {inlineMarkdown(cell)}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className='border-b last:border-0'>
              {row.map((cell, cellIndex) => (
                <td key={`${rowIndex}-${cellIndex}`} className='px-2.5 py-1.5'>
                  {inlineMarkdown(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function agentMarkdownText(output: unknown) {
  if (Array.isArray(output)) {
    if (output.length !== 1) {
      return ''
    }
    return agentMarkdownText(output[0])
  }
  if (!isPlainObject(output)) {
    return typeof output === 'string' ? readableAssistantText(output) : ''
  }
  const content = isPlainObject(output.content) ? output.content : null
  const format = valueText(content?.format || output.format).toLowerCase()
  const text = valueText(content?.text || output.text).trim()
  if (!text) {
    return ''
  }
  return format === 'markdown' || looksLikeMarkdown(text)
    ? readableAssistantText(text)
    : ''
}

function looksLikeMarkdown(text: string) {
  return /(^|\n)(#{1,6}\s+|\d{1,2}\.\s+|[-*]\s+)/.test(text)
}

function markdownBlocks(text: string): AgentMarkdownBlockData[] {
  const lines = readableAssistantText(text)
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
  const blocks: AgentMarkdownBlockData[] = []
  for (let index = 0; index < lines.length; index += 1) {
    if (isMarkdownTableStart(lines, index)) {
      const [table, nextIndex] = markdownTableBlock(lines, index)
      blocks.push(table)
      index = nextIndex - 1
      continue
    }
    const block = markdownBlock(lines[index])
    if (block) {
      blocks.push(block)
    }
  }
  return blocks
}

function markdownBlock(line: string): AgentMarkdownBlockData | null {
  if (!line) {
    return null
  }
  const heading = line.match(/^(#{1,6})\s+(.+)$/)
  if (heading) {
    return {
      type: 'heading',
      level: heading[1].length,
      text: heading[2].trim(),
    }
  }
  const ordered = line.match(/^(\d{1,2})\.\s+(.+)$/)
  if (ordered) {
    return {
      type: 'ordered',
      order: ordered[1],
      text: ordered[2].trim(),
    }
  }
  const bullet = line.match(/^[-*]\s+(.+)$/)
  if (bullet) {
    return {
      type: 'bullet',
      text: bullet[1].trim(),
    }
  }
  return {
    type: 'paragraph',
    text: line,
  }
}

function isMarkdownTableStart(lines: string[], index: number) {
  return (
    isMarkdownTableRow(lines[index]) &&
    index + 1 < lines.length &&
    isMarkdownTableSeparator(lines[index + 1])
  )
}

function markdownTableBlock(
  lines: string[],
  start: number
): [AgentMarkdownBlockData, number] {
  const header = markdownTableCells(lines[start])
  const rows: string[][] = []
  let index = start + 2
  while (index < lines.length && isMarkdownTableRow(lines[index])) {
    if (!isMarkdownTableSeparator(lines[index])) {
      rows.push(markdownTableCells(lines[index]))
    }
    index += 1
  }
  return [
    {
      type: 'table',
      text: '',
      header,
      rows,
    },
    index,
  ]
}

function isMarkdownTableRow(line: string) {
  return line.includes('|') && markdownTableCells(line).length >= 2
}

function isMarkdownTableSeparator(line: string) {
  const cells = markdownTableCells(line)
  return cells.length > 0 && cells.every((cell) => /^:?-{3,}:?$/.test(cell))
}

function markdownTableCells(line: string) {
  return line
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())
}

function inlineMarkdown(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, index) => {
    const strong = part.match(/^\*\*([^*]+)\*\*$/)
    if (strong) {
      return <strong key={index}>{strong[1]}</strong>
    }
    return <span key={index}>{part}</span>
  })
}

function AgentInlineResultActions({ onOpen }: { onOpen: () => void }) {
	return (
		<div className='flex justify-end'>
      <Button
        type='button'
        size='sm'
        variant='outline'
        className='h-7 px-2 text-xs'
        onClick={onOpen}
      >
        查看详情
        <ExternalLink className='size-3.5' />
      </Button>
    </div>
  )
}

function AgentResultKindBadge({
	message,
	hasOutput,
}: {
	message: AgentMessage
	hasOutput: boolean
}) {
	const label = resolveMessageKindLabel(message, hasOutput)
	if (!label) {
		return null
  }
  return (
    <div className='inline-flex rounded-full border bg-background/70 px-2 py-0.5 text-[11px] font-medium text-muted-foreground'>
      {label}
    </div>
  )
}

function AgentSuggestionBar({
  suggestions,
  disabled,
  onSelect,
}: {
  suggestions: AgentSuggestion[]
  disabled?: boolean
  onSelect: (suggestion: AgentSuggestion) => void
}) {
  if (suggestions.length === 0) {
    return null
  }

  return (
    <div className='flex flex-wrap items-center gap-2 border-t pt-2'>
      {suggestions.map((suggestion, index) => (
        <Button
          key={`${suggestion.label}-${index}`}
          type='button'
          size='sm'
          variant='outline'
          className='h-7 rounded-full px-2.5 text-xs'
          disabled={disabled}
          title={suggestion.prompt}
          onClick={() => onSelect(suggestion)}
        >
          <MessageSquarePlus className='size-3.5' />
          {suggestion.label}
        </Button>
      ))}
    </div>
  )
}

function buildHistory(messages: AgentMessage[]) {
  return messages
    .map((message) => {
      const text = historyMessageText(message)
      const row: Record<string, unknown> = {
        role: message.role,
        text,
      }
      if (message.kind) {
        row.type = message.kind
      }
      if (message.data) {
        row.data = message.data
      }
      if (message.output?.finalOutput) {
        const output = historyResultOutput(message)
        if (!isNonResultOutput(output)) {
          row.output = output
        }
      }
      if (message.interaction) {
        row.interaction = message.interaction
        row.interaction_answered = Boolean(message.interactionAnswered)
        if (message.interactionData) {
          row.interaction_data = message.interactionData
        }
      }
      return row
    })
    .filter(
      (row) =>
        valueText(row.text).trim().length > 0 ||
        Boolean(row.interaction) ||
        Boolean(row.data) ||
        Boolean(row.output)
    )
}

function historyMessageText(message: AgentMessage) {
  if (isProtocolDraftText(message.text)) {
    return ''
  }
  return message.text
}

function historyResultOutput(message: AgentMessage) {
  const detail = buildAgentResultDetail(message)
  if (detail?.result) {
    return normalizeAgentDisplayOutput(detail.result, message.text)
  }
  return normalizeAgentDisplayOutput(
    (message.output?.finalOutput || {}) as AgentOutput,
    message.text
  )
}

function isAgentResultRuntimeEvent(event: string) {
  return (
    event === 'result_detail' ||
    event === 'result_task' ||
    event === 'result_progress'
  )
}

function applyResultRuntimeEvent(
  message: AgentMessage,
  output: AgentOutput,
  frame: AgentFrame
): AgentMessage {
  const event = valueText(output.event).toLowerCase()
  let detail = message.resultDetail
  if (event === 'result_detail') {
    detail = mergeMessageResultDetail(
      detail,
      resultDetailFromRuntimeOutput(output)
    )
  } else if (event === 'result_task') {
    detail = updateResultDetailTask(
      detail,
      normalizeAgentResultTask(output),
      valueText(output.result_id)
    )
  } else if (event === 'result_progress') {
    detail = updateResultDetailProgress(
      detail,
      valueText(output.result_id),
      valueText(output.text),
      normalizeProgressValue(output.progress)
    )
  }
  return {
    ...message,
    text: message.text || '内容已生成，点击查看结果。',
    resultDetail: detail,
    requestID: valueText(frame?.request_id) || message.requestID,
  }
}

function buildAgentResultDetail(
  message: AgentMessage
): AgentResultDetail | null {
  const detail = mergeMessageResultDetail(
    message.resultDetail,
    resultDetailFromFinalOutput(message.output?.finalOutput)
  )
  if (!detail) {
    return null
  }
  return detail.result || detail.tasks.length ? detail : null
}

function resultDetailFromRuntimeOutput(
  output?: AgentOutput
): AgentResultDetail | undefined {
  if (!output) {
    return undefined
  }
  const result = isPlainObject(output.result)
    ? normalizeAgentDisplayOutput(output.result as AgentOutput)
    : undefined
  const tasks = normalizeAgentResultTasks(output.tasks)
  return {
    id: valueText(output.result_id) || valueText(result?.result_id),
    title: valueText(output.title || result?.title) || '最终结果',
    mode: normalizeAgentResultMode(
      output.result_mode || output.display_mode || result?.result_mode
    ),
    result,
    tasks,
    progress: normalizeProgressValue(output.progress),
    progressText: valueText(output.progress_text),
  }
}

function resultDetailFromFinalOutput(
  output?: AgentOutput | null
): AgentResultDetail | undefined {
  if (!output) {
    return undefined
  }
  const event = valueText(output.event).toLowerCase()
  const mode = normalizeAgentResultMode(
    output.result_mode || output.display_mode
  )
  if (event !== 'result_card' && mode === 'inline') {
    return undefined
  }
  if (
    event !== 'result_card' &&
    !isPlainObject(output.result) &&
    !valueText(output.result_mode || output.display_mode)
  ) {
    return undefined
  }
  const result = isPlainObject(output.result)
    ? normalizeAgentDisplayOutput(output.result as AgentOutput)
    : normalizeAgentDisplayOutput(output)
  return {
    id: valueText(output.result_id || result.result_id),
    title: valueText(output.title || result.title) || '最终结果',
    mode:
      event === 'result_card'
        ? 'artifact'
        : normalizeAgentResultMode(
            output.result_mode || output.display_mode || result.result_mode
          ),
    result,
    tasks: normalizeAgentResultTasks(output.tasks || result.tasks),
    progress: normalizeProgressValue(output.progress),
    progressText: valueText(output.progress_text),
  }
}

function mergeActionResultDetail(
  current: AgentResultDetail | undefined,
  output: AgentOutput,
  frame: AgentFrame
): AgentResultDetail | undefined {
  const task = actionResultTaskFromOutput(output, frame)
  if (!task) {
    return current
  }
  const resultID = actionResultID(output, frame)
  const base = current || {
    ...emptyAgentResultDetail(resultID),
    title: '能力生成结果',
  }
  const next = updateResultDetailTask(base, task, resultID)
  return {
    ...next,
    title: base.title || '能力生成结果',
    progress: task.progress ?? next.progress,
    progressText: task.text || next.progressText,
  }
}

function actionResultTaskFromOutput(
  output: AgentOutput,
  frame: AgentFrame
): AgentResultTask | null {
  const meta = isPlainObject(output.meta) ? output.meta : {}
  const action = valueText(meta.action).toLowerCase()
  if (action !== 'call_power') {
    return null
  }
  const power = valueText(meta.power || output.meta?.power).trim()
  const event = valueText(output.event).toLowerCase()
  const error = valueText(output.error).trim()
  const taskOutput = actionTaskOutput(output)
  const status = error
    ? 'failed'
    : taskOutput || event === 'final'
      ? 'succeeded'
      : 'running'
  return {
    id: actionResultID(output, frame),
    placeholderID: actionResultID(output, frame),
    title: power ? `生成 ${power}` : '能力生成',
    kind: valueText(power || output.kind).trim(),
    power,
    execution: 'async',
    status,
    text: valueText(output.text || output.progress_text).trim(),
    error,
    progress: normalizeProgressValue(
      output.progress ?? meta.progress ?? meta.percent
    ),
    output: taskOutput,
    sort: 0,
  }
}

function actionTaskOutput(output: AgentOutput): AgentOutput | undefined {
  const event = valueText(output.event).toLowerCase()
  if (!hasAgentDisplayPayload(output) && event !== 'final') {
    return undefined
  }
  const normalized = normalizeAgentDisplayOutput({
    ...output,
    event: 'final',
  })
  return isNonResultOutput(normalized) ? undefined : normalized
}

function actionResultID(output: AgentOutput, frame: AgentFrame) {
  const meta = isPlainObject(output.meta) ? output.meta : {}
  const power = valueText(
    meta.power || (output as Record<string, unknown>).power
  ).trim()
  const requestID = valueText(frame?.request_id).trim()
  return (
    [requestID, power || 'power'].filter(Boolean).join(':') || 'power-action'
  )
}

function mergeMessageResultDetail(
  current?: AgentResultDetail,
  incoming?: AgentResultDetail
): AgentResultDetail | undefined {
  if (!incoming) {
    return current
  }
  if (!current) {
    return {
      ...incoming,
      mode: incoming.mode || 'artifact',
      tasks: sortAgentResultTasks(incoming.tasks),
    }
  }
  return {
    id: incoming.id || current.id,
    title: incoming.title || current.title,
    mode: incoming.mode || current.mode,
    result: incoming.result || current.result,
    tasks: mergeAgentResultTasks(current.tasks, incoming.tasks),
    progress: incoming.progress ?? current.progress,
    progressText: incoming.progressText || current.progressText,
  }
}

function updateResultDetailTask(
  current: AgentResultDetail | undefined,
  task: AgentResultTask | null,
  resultID: string
): AgentResultDetail {
  const base = current || emptyAgentResultDetail(resultID)
  if (!task) {
    return base
  }
  return {
    ...base,
    tasks: mergeAgentResultTasks(base.tasks, [task]),
  }
}

function updateResultDetailProgress(
  current: AgentResultDetail | undefined,
  resultID: string,
  text: string,
  progress: number | null
): AgentResultDetail {
  const base = current || emptyAgentResultDetail(resultID)
  return {
    ...base,
    progress,
    progressText: text || base.progressText,
  }
}

function emptyAgentResultDetail(resultID: string): AgentResultDetail {
  return {
    id: resultID,
    title: '最终结果',
    mode: 'artifact',
    tasks: [],
    progress: null,
    progressText: '',
  }
}

function mergeAgentResultTasks(
  current: AgentResultTask[],
  incoming: AgentResultTask[]
) {
  const byID = new Map<string, AgentResultTask>()
  current.forEach((task) => byID.set(task.id, task))
  incoming.forEach((task) => {
    const previous = byID.get(task.id)
    byID.set(task.id, previous ? { ...previous, ...task } : task)
  })
  return sortAgentResultTasks([...byID.values()])
}

function sortAgentResultTasks(tasks: AgentResultTask[]) {
  return [...tasks].sort((a, b) => a.sort - b.sort)
}

function normalizeAgentResultTasks(value: unknown): AgentResultTask[] {
  const values = Array.isArray(value) ? value : value == null ? [] : [value]
  return values
    .map(normalizeAgentResultTask)
    .filter((task): task is AgentResultTask => task != null)
    .sort((a, b) => a.sort - b.sort)
}

function normalizeAgentResultTask(value: unknown): AgentResultTask | null {
  if (!isPlainObject(value)) {
    return null
  }
  const id = valueText(value.id || value.task_id || value.taskId).trim()
  const placeholderID = valueText(
    value.placeholder_id || value.placeholderId || id
  ).trim()
  const normalizedID = id || placeholderID
  if (!normalizedID) {
    return null
  }
  const meta = isPlainObject(value.meta) ? value.meta : {}
  const outputSource = isPlainObject(value.output)
    ? value.output
    : isPlainObject(meta.output)
      ? meta.output
      : undefined
  const output = outputSource
    ? normalizeAgentDisplayOutput(outputSource as AgentOutput)
    : undefined
  return {
    id: normalizedID,
    placeholderID,
    title:
      valueText(
        value.title || value.name || value.label || value.power
      ).trim() || '素材任务',
    kind: valueText(value.kind || value.media_type || value.mediaType).trim(),
    power: valueText(value.power).trim(),
    execution: valueText(value.execution || value.mode).trim() || 'async',
    status: valueText(value.status || value.state).trim() || 'pending',
    text: valueText(value.text || value.message).trim(),
    error: valueText(value.error).trim(),
    progress: normalizeProgressValue(
      value.progress ?? meta.progress ?? meta.percent
    ),
    output,
    sort: Number(value.sort || 0),
  }
}

function normalizeProgressValue(value: unknown) {
  const progress = Number(value)
  if (!Number.isFinite(progress)) {
    return null
  }
  return Math.max(0, Math.min(100, Math.round(progress)))
}

function buildContentViewOutput(message: AgentMessage) {
  const detail = buildAgentResultDetail(message)
  if (detail) {
    if (!shouldDisplayInlineResult(detail)) {
      return undefined
    }
    return detail.result
      ? applyResultTaskPlaceholders(detail.result, detail.tasks)
      : undefined
  }
  if (message.running || message.interaction) {
    return undefined
  }
  if (!message.output) {
    return message.text
      ? normalizeAssistantTextDisplayOutput(message.text)
      : undefined
  }
  if (message.output.finalOutput) {
    const finalOutput = normalizeAgentDisplayOutput(
      message.output.finalOutput,
      message.text
    )
    const event = valueText(finalOutput.event).toLowerCase()
    if (event === 'interaction' || isNonResultOutput(finalOutput)) {
      return undefined
    }
    return finalOutput
  }

  const items: EnergonOutput[] = []
  if (message.output.text && !isProtocolDraftText(message.output.text)) {
    items.push(normalizeAssistantTextDisplayOutput(message.output.text))
  }
  return items
}

function normalizeAssistantTextDisplayOutput(text: string): AgentOutput {
  const readableText = readableAssistantText(text)
  return normalizeAgentDisplayOutput({
    text: readableText,
    content: {
      format: 'markdown',
      text: readableText,
    },
  })
}

function readableAssistantText(value: unknown) {
  const text = valueText(value).trim()
  if (!text || isProtocolDraftText(text) || text.includes('```')) {
    return text
  }
  if (hasReadableTextStructure(text)) {
    return text
  }
  return structureCompactAssistantText(text)
}

function hasReadableTextStructure(text: string) {
  const lines = text
    .split(/\n/)
    .map((line) => line.trim())
    .filter(Boolean)
  if (lines.length >= 3) {
    return true
  }
  return lines.some((line) =>
    /^(#{1,6}\s+|\d{1,2}\.\s+|[-*]\s+)/.test(line)
  )
}

function structureCompactAssistantText(text: string) {
  let result = text.replace(/[ \t]+/g, ' ')
  result = result.replace(/([：:。！？!?；;])(?=\d{1,2}\.[^\d\s])/g, '$1\n\n')
  result = result.replace(
    /([^\n])(\d{1,2})\.([^\s\d])/g,
    (_match, prefix: string, index: string, next: string) =>
      `${prefix}\n\n${index}. ${next}`
  )
  result = result.replace(
    /(^|\n)(\d{1,2})\.\s*([^\n-]{2,42})\s*-\s*/g,
    (_match, prefix: string, index: string, title: string) =>
      `${prefix}${index}. ${title.trim()}\n- `
  )
  result = result.replace(/(^|\n)(\d{1,2})\.([^\s])/g, '$1$2. $3')
  result = result.replace(/([：:。！？!?；;])\s*-\s*/g, '$1\n- ')
  result = result.replace(/\n-\s*/g, '\n- ')
  result = result.replace(/\n{3,}/g, '\n\n')
  return result.trim()
}

function shouldDisplayResultCard(detail?: AgentResultDetail | null) {
  return Boolean(detail && resultDisplayMode(detail) === 'artifact')
}

function shouldDisplayInlineResult(detail?: AgentResultDetail | null) {
  return Boolean(detail && resultDisplayMode(detail) === 'inline')
}

function resultDisplayMode(detail: AgentResultDetail) {
  return normalizeAgentResultMode(detail.mode)
}

function normalizeAgentResultMode(value: unknown) {
  const mode = valueText(value).trim().toLowerCase()
  return mode === 'inline' ? 'inline' : 'artifact'
}

function buildMessageSuggestions(
  message: AgentMessage,
  hasOutput: boolean
): AgentSuggestion[] {
  if (message.running || message.error || message.interaction || !hasOutput) {
    return []
  }
  const output = message.output?.finalOutput
    ? normalizeAgentDisplayOutput(message.output.finalOutput, message.text)
    : normalizeAgentDisplayOutput({ text: message.text })
  const suggestions = normalizeAgentSuggestions(
    output.suggestions || output.meta?.suggestions
  )
  if (suggestions.length > 0) {
    return suggestions
  }
  return []
}

function shouldRunFinalSideEffect(kind: string, allowedKinds: unknown) {
  const normalized = kind.trim().toLowerCase()
  const kinds = normalizeFinalSideEffectKinds(allowedKinds)
  if (kinds.length === 0) {
    return true
  }
  return kinds.includes(normalized)
}

function normalizeFinalSideEffectKinds(value: unknown): string[] {
  const rawValues = Array.isArray(value) ? value : [value]
  return rawValues
    .map((item) => valueText(item).trim().toLowerCase())
    .filter(Boolean)
}

function resolveMessageKindLabel(message: AgentMessage, hasOutput: boolean) {
  if (message.interaction && !message.interactionAnswered) {
    return '需要用户参与'
  }
  const output = message.output?.finalOutput
  const kind = valueText(output?.kind || output?.type).toLowerCase()
  const action = valueText(output?.meta?.action).toLowerCase()
  if (kind === 'tool_result' || action === 'call_power') {
    return '工具结果'
  }
  if (hasOutput) {
    return '最终结果'
  }
	return ''
}

function normalizeAgentDisplayOutput(
  output: AgentOutput,
  fallbackText = ''
): AgentOutput {
  const next: AgentOutput = { ...output }
  delete next.reasoning

  const actionProtocol = extractAgentActionPayload(
    valueText(next.text) || fallbackText
  )
  if (actionProtocol) {
    return normalizeAgentActionDisplayOutput(
      next,
      actionProtocol.payload,
      actionProtocol.cleanText
    )
  }

  const protocol = extractAgentResultPayload(
    valueText(next.text) || fallbackText
  )
  if (protocol) {
    clearAgentResultOutputFields(next)
    const content = normalizeAgentContentRecord(protocol.payload.content)
    if (content) {
      copyAgentResultOutputFields(next, content)
    }
    copyAgentResultOutputFields(next, protocol.payload)
    const text = agentResultText(protocol.payload) || protocol.cleanText
    if (text) {
      next.text = text
    } else {
      delete next.text
    }
    next.kind = normalizeAgentOutputKind(
      valueText(
        protocol.payload.kind || protocol.payload.type || protocol.payload.event
      )
    )
    next.suggestions = protocol.payload.suggestions
    next.content = content || protocol.payload.content
    next.tasks = protocol.payload.tasks || content?.tasks
    return next
  }

  const normalizedContent = normalizeAgentContentRecord(next.content)
  if (normalizedContent) {
    next.content = normalizedContent
  }
  if (isPlainObject(next.content)) {
    copyAgentResultOutputFields(next, next.content)
  }
  if (!valueText(next.text)) {
    const text = agentResultText(next)
    if (text) {
      next.text = text
    }
  }
  if (isGoMapTextDump(next.text)) {
    const text = readableGoMapTextDump(next.text)
    if (text) {
      next.text = text
    } else {
      delete next.text
    }
  }
  return next
}

function normalizeAgentActionDisplayOutput(
  target: AgentOutput,
  payload: Record<string, unknown>,
  cleanText: string
): AgentOutput {
  clearAgentResultOutputFields(target)
  const action = normalizeAgentActionType(payload)
  const power = valueText(payload.power || payload.name).trim()
  const tool = valueText(payload.tool || payload.name).trim()
  const title =
    action === 'call_power'
      ? `能力调用：${power || '未指定能力'}`
      : `工具调用：${tool || '未指定工具'}`
  const text =
    cleanText ||
    '智能体返回了调用指令，但本轮没有收到执行结果。请重新发送或重试。'
  target.event = 'result_card'
  target.kind = 'tool_result'
  target.title = title
  target.text = text
  target.result_mode = 'artifact'
  target.result = {
    title,
    text,
  }
  target.meta = {
    ...(isPlainObject(target.meta) ? target.meta : {}),
    action,
    power,
    tool,
    input: payload.input || payload.params || payload.arguments,
  }
  if (action === 'call_power') {
    target.tasks = [
      {
        id: actionTaskID(payload),
        title,
        kind: valueText(payload.kind || power).trim(),
        power,
        status: 'pending',
        text: '等待能力执行结果',
        input: payload.input || payload.params || payload.arguments,
      },
    ]
  }
  return target
}

function actionTaskID(payload: Record<string, unknown>) {
  const raw = valueText(
    payload.id || payload.task_id || payload.power || payload.name
  )
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return raw ? `action-${raw}` : 'action-call-power'
}

function clearAgentResultOutputFields(target: AgentOutput) {
  const mutableTarget = target as Record<string, unknown>
  agentResultOutputKeys.forEach((key) => {
    delete mutableTarget[key]
  })
  delete mutableTarget.content
}

function isNonResultOutput(output: AgentOutput) {
  const event = valueText(output.event).toLowerCase()
  if (['start', 'progress', 'status', 'reasoning', 'warning'].includes(event)) {
    return true
  }
  if (isProtocolDraftText(valueText(output.text))) {
    return !hasAgentDisplayPayload(output)
  }
  return false
}

function isProtocolDraftText(value: unknown) {
  const text = valueText(value).trim()
  if (!text) {
    return false
  }
  if (
    text.includes('```agent-interaction') ||
    text.includes('```agent-action') ||
    text.includes('```agent-result') ||
    text.includes('```agent-output')
  ) {
    return true
  }
  return false
}

function extractAgentResultPayload(text: string):
  | {
      cleanText: string
      payload: Record<string, unknown>
    }
  | undefined {
  for (const lang of ['agent-result', 'agent-output', 'json']) {
    const result = extractAgentResultPayloadByLang(text, lang)
    if (result) {
      return result
    }
  }
  const payload = parseAgentResultPayload(text)
  if (payload) {
    return {
      cleanText: '',
      payload,
    }
  }
  return undefined
}

function extractAgentActionPayload(text: string):
  | {
      cleanText: string
      payload: Record<string, unknown>
    }
  | undefined {
  const result = extractAgentActionPayloadByLang(text, 'agent-action')
  if (result) {
    return result
  }
  const payload = parseAgentActionPayload(text)
  return payload ? { cleanText: '', payload } : undefined
}

function extractAgentActionPayloadByLang(
  text: string,
  lang: string
):
  | {
      cleanText: string
      payload: Record<string, unknown>
    }
  | undefined {
  const open = `\`\`\`${lang}`
  const start = text.indexOf(open)
  if (start < 0) {
    return undefined
  }

  let bodyStart = start + open.length
  while (bodyStart < text.length && isFenceWhitespace(text[bodyStart])) {
    bodyStart += 1
  }

  const end = text.indexOf('```', bodyStart)
  const body = end < 0 ? text.slice(bodyStart) : text.slice(bodyStart, end)
  const payload = parseAgentActionPayload(body)
  if (!payload) {
    return undefined
  }
  const cleanText =
    end < 0
      ? text.slice(0, start).trim()
      : `${text.slice(0, start)}${text.slice(end + 3)}`.trim()
  return {
    cleanText,
    payload,
  }
}

function parseAgentActionPayload(value: string) {
  const text = value.trim()
  const repaired = repairJSONControlChars(text)
  const unescaped = unescapeEscapedProtocolJSONQuotes(repaired)
  const sources = [text, repaired, unescaped]
  for (const source of sources) {
    if (!source.trim()) {
      continue
    }
    try {
      const parsed = JSON.parse(source)
      if (isAgentActionPayload(parsed)) {
        return parsed
      }
    } catch {
      // Try the next repaired variant.
    }
  }
  return undefined
}

function unescapeEscapedProtocolJSONQuotes(value: string) {
  const text = value.trim()
  if (!text.includes('\\"')) {
    return value
  }
  if (!text.startsWith('{') && !text.startsWith('[')) {
    return value
  }
  return value.replace(/\\"/g, '"')
}

function extractAgentResultPayloadByLang(
  text: string,
  lang: string
):
  | {
      cleanText: string
      payload: Record<string, unknown>
    }
  | undefined {
  const open = `\`\`\`${lang}`
  const start = text.indexOf(open)
  if (start < 0) {
    return undefined
  }

  let bodyStart = start + open.length
  while (bodyStart < text.length && isFenceWhitespace(text[bodyStart])) {
    bodyStart += 1
  }

  let searchStart = bodyStart
  while (searchStart < text.length) {
    const end = text.indexOf('```', searchStart)
    if (end < 0) {
      return undefined
    }

    const payload = parseAgentResultPayload(text.slice(bodyStart, end))
    if (payload) {
      return {
        cleanText: `${text.slice(0, start)}${text.slice(end + 3)}`.trim(),
        payload,
      }
    }
    searchStart = end + 3
  }

  return undefined
}

function parseAgentResultPayload(value: string) {
  const text = value.trim()
  const repaired = repairJSONControlChars(text)
  const sources = repaired === text ? [text] : [text, repaired]
  for (const source of sources) {
    const payload = parseAgentResultJSON(source)
    if (payload) {
      return payload
    }
  }
  return undefined
}

function parseAgentResultJSON(value: string) {
  try {
    const parsed = JSON.parse(value)
    return isAgentResultPayload(parsed) ? parsed : undefined
  } catch {
    return undefined
  }
}

function repairJSONControlChars(value: string) {
  let result = ''
  let inString = false
  let escaped = false
  for (const char of value) {
    if (escaped) {
      result += char
      escaped = false
      continue
    }
    if (char === '\\') {
      result += char
      escaped = inString
      continue
    }
    if (char === '"') {
      inString = !inString
      result += char
      continue
    }
    if (inString && isJSONControlChar(char)) {
      result += escapeJSONControlChar(char)
      continue
    }
    result += char
  }
  return result
}

function isJSONControlChar(value: string) {
  return value.length > 0 && value.charCodeAt(0) < 32
}

function escapeJSONControlChar(value: string) {
  switch (value) {
    case '\n':
      return '\\n'
    case '\r':
      return '\\r'
    case '\t':
      return '\\t'
    default:
      return `\\u${value.charCodeAt(0).toString(16).padStart(4, '0')}`
  }
}

function isFenceWhitespace(value: string) {
  return value === ' ' || value === '\t' || value === '\r' || value === '\n'
}

function isAgentResultPayload(
  value: unknown
): value is Record<string, unknown> {
  if (!isPlainObject(value)) {
    return false
  }
  if (isAgentActionPayload(value)) {
    return false
  }
  const kind = normalizeAgentOutputKind(
    valueText(value.kind || value.type || value.event)
  )
  return (
    kind === 'final_result' ||
    kind === 'tool_result' ||
    'content' in value ||
    'tasks' in value ||
    'suggestions' in value ||
    hasAgentResultOutputField(value) ||
    (isPlainObject(value.content) && hasAgentResultOutputField(value.content))
  )
}

function isAgentActionPayload(
  value: unknown
): value is Record<string, unknown> {
  if (!isPlainObject(value)) {
    return false
  }
  const action = normalizeAgentActionType(value)
  if (!action) {
    return false
  }
  if (action === 'call_power') {
    return Boolean(valueText(value.power || value.name).trim())
  }
  return Boolean(valueText(value.tool || value.name).trim())
}

function normalizeAgentActionType(value: Record<string, unknown>) {
  const action = valueText(value.type || value.action)
    .toLowerCase()
    .trim()
  if (action === 'power') {
    return 'call_power'
  }
  if (action === 'tool') {
    return 'call_tool'
  }
  if (action === 'call_power' || action === 'call_tool') {
    return action
  }
  return ''
}

function normalizeAgentOutputKind(value: string) {
  const kind = value.toLowerCase().trim()
  if (['tool', 'tool_result', 'call_power', 'power_result'].includes(kind)) {
    return 'tool_result'
  }
  if (['final', 'result', 'final_result', 'answer'].includes(kind)) {
    return 'final_result'
  }
  return kind || 'final_result'
}

function agentResultText(value: unknown): string {
  if (!isPlainObject(value)) {
    return typeof value === 'string' ? valueText(value) : ''
  }
  if (valueText(value.text)) {
    return valueText(value.text)
  }
  const content = value.content
  if (!isPlainObject(content)) {
    return typeof content === 'string' ? valueText(content) : ''
  }
  return valueText(content.text)
}

function normalizeAgentContentRecord(
  value: unknown
): Record<string, unknown> | null {
  if (isPlainObject(value)) {
    return value
  }
  if (typeof value === 'string' && value.trim()) {
    return {
      format: 'markdown',
      text: value.trim(),
    }
  }
  const nodes = normalizeAgentRichNodes(value)
  if (nodes.length === 0) {
    return null
  }
  const content: Record<string, unknown> = {
    format: 'rich_json',
    rich: {
      type: 'doc',
      content: nodes,
    },
  }
  const text = richNodesText(nodes)
  if (text) {
    content.text = text
  }
  return content
}

function normalizeAgentRichNodes(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) {
    return []
  }
  return value.flatMap((item) => {
    if (typeof item === 'string' && item.trim()) {
      return [paragraphNode(item.trim())]
    }
    if (!isPlainObject(item)) {
      return []
    }
    const type = valueText(item.type)
    if (type === 'text') {
      const text = valueText(item.text).trim()
      return text ? [paragraphNode(text)] : []
    }
    return [item]
  })
}

function paragraphNode(text: string): Record<string, unknown> {
  return {
    type: 'paragraph',
    content: [{ type: 'text', text }],
  }
}

function richNodesText(nodes: Record<string, unknown>[]) {
  const values: string[] = []
  nodes.forEach((node) => collectRichNodeText(node, values))
  return values.join('\n\n').trim()
}

function collectRichNodeText(value: unknown, values: string[]) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectRichNodeText(item, values))
    return
  }
  if (!isPlainObject(value)) {
    return
  }
  if (valueText(value.type) === 'text') {
    const text = valueText(value.text).trim()
    if (text) {
      values.push(text)
    }
    return
  }
  collectRichNodeText(value.content, values)
}

function isGoMapTextDump(value: unknown) {
  const text = valueText(value).trim()
  return /^\[?map\[/.test(text) && text.includes('type:text')
}

function readableGoMapTextDump(value: unknown) {
  const text = valueText(value).trim()
  const matches = [
    ...text.matchAll(/map\[[^\]]*?text:([^\]]*?)(?:\s+type:text|\])/g),
  ]
  return matches
    .map((match) => match[1]?.trim() || '')
    .filter(Boolean)
    .join('\n\n')
}

function copyAgentResultOutputFields(
  target: AgentOutput,
  source: Record<string, unknown>
) {
  const mutableTarget = target as Record<string, unknown>
  agentResultOutputKeys.forEach((key) => {
    const value = source[key]
    if (!hasAgentResultValue(value)) {
      return
    }
    mutableTarget[key] = value
  })
  if (!hasAgentResultValue(target.rich) && isPlainObject(source.value)) {
    target.rich = source.value
  }
}

function hasAgentResultOutputField(source: Record<string, unknown>) {
  return (
    agentResultOutputKeys.some((key) => hasAgentResultValue(source[key])) ||
    isPlainObject(source.value)
  )
}

function hasAgentDisplayPayload(output: AgentOutput) {
  const content = isPlainObject(output.content) ? output.content : null
  return (
    hasAgentResultOutputField(output as Record<string, unknown>) ||
    hasAgentResultValue(output.error) ||
    (content != null &&
      (hasAgentResultOutputField(content) || hasAgentResultValue(content.text)))
  )
}

function hasAgentResultValue(value: unknown) {
  if (value == null) {
    return false
  }
  if (typeof value === 'string') {
    return value.trim().length > 0
  }
  if (Array.isArray(value)) {
    return value.length > 0
  }
  if (isPlainObject(value)) {
    return Object.keys(value).length > 0
  }
  return true
}

function normalizeAgentSuggestions(value: unknown): AgentSuggestion[] {
  const values = Array.isArray(value) ? value : value == null ? [] : [value]
  return values
    .map(normalizeAgentSuggestion)
    .filter((suggestion): suggestion is AgentSuggestion => suggestion != null)
    .slice(0, 5)
}

function normalizeAgentSuggestion(value: unknown): AgentSuggestion | null {
  if (!isPlainObject(value)) {
    const text = valueText(value).trim()
    return text ? { label: text, prompt: text } : null
  }
  const prompt = valueText(
    value.prompt || value.text || value.value || value.input
  ).trim()
  const label = valueText(
    value.label || value.name || value.title || prompt
  ).trim()
  if (!label || !prompt) {
    return null
  }
  return { label, prompt }
}

function AgentInteractionDialog({
  open,
  interaction,
  paramApi,
  readonly,
  initialData,
  disabled,
  onOpenChange,
  onSubmit,
}: {
  open: boolean
  interaction?: AgentInteraction
  paramApi: string
  readonly?: boolean
  initialData?: Record<string, unknown>
  disabled?: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (result: AgentInteractionSubmitResult) => void
}) {
  if (!interaction) {
    return null
  }
  const title = valueText(interaction.title) || '补充交互信息'
  const description =
    valueText(interaction.description) ||
    (readonly
      ? '已提交的交互信息，只读查看。'
      : '填写这些参数后，智能体会继续执行当前任务。')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[86vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl'>
        <DialogHeader className='border-b px-5 py-4 text-start'>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className='min-h-0 overflow-hidden'>
          <AgentInteractionPanel
            interaction={interaction}
            paramApi={paramApi}
            readonly={readonly}
            initialData={initialData}
            disabled={disabled}
            layout='dialog'
            hideHeader
            onSubmit={readonly ? undefined : onSubmit}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

function hasContentViewOutput(value: unknown): boolean {
  if (value == null || value === '') {
    return false
  }
  if (Array.isArray(value)) {
    return value.some(hasContentViewOutput)
  }
  if (isPlainObject(value)) {
    return Object.keys(value).length > 0
  }
  return true
}

function normalizeFrameInteraction(
  value: unknown
): AgentInteraction | undefined {
  if (!isPlainObject(value)) {
    return undefined
  }
  const type = valueText(value.type)
  if (!type) {
    return undefined
  }
  return value as AgentInteraction
}
