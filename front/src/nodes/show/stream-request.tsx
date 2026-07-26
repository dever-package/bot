import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react'
import { useStore } from 'zustand'
import { Loader2, Send, Square } from 'lucide-react'
import {
  EnergonContentView,
  type EnergonOutput,
} from '@/components/energon/content-view'
import { Button } from '@/components/ui/button'
import { SearchableOptionPicker } from '@/components/searchable-option-picker'
import { request } from '@/lib/request'
import {
  runRuntimeStream,
  stopRuntimeStream,
} from '@/lib/runtime-stream-runner'
import {
  streamValueText as valueText,
  type RuntimeStreamFrame,
} from '@/lib/stream'
import { getStoreValueByPath } from '@/lib/store'
import { getCompatModule } from '@dever/front-plugin'
import {
  isEmptyRuntimeOutput,
  isPlainRecord,
  normalizeRuntimeFrameOutput,
  resolveRuntimeFrameCancelable,
  runtimeErrorMessage,
} from '@/lib/runtime-stream-output'
import { useUploadRuleMetas } from '@/hooks/use-upload-rule-metas'
import type { NodeItemProps } from '@/page/nodes'
import { copyTextToClipboard } from './clipboard'
import {
  PowerParamPopover,
  PowerParamField,
  buildDefaultParamValues,
  buildRequestInput,
  inputKeyForParam,
  isHiddenParam,
  isMainParam,
  isSelectedOptionValue,
  isToolbarParam,
  normalizePowerParamConfig,
  paramFilesRequestValue,
  validateMainParams,
  type ParamFileMap,
  type ParamFileLibraryRenderer,
  type ParamUploadedFile,
  type ParamValueMap,
  type PowerParamSource,
  type PowerParam,
} from '@/components/agent/stream-request-params'
import {
  StreamTimingBadge,
  cancelStreamTiming,
  createStreamTiming,
  finishStreamTiming,
  isStreamTimingStatusOutput,
  markStreamTimingStopping,
  updateStreamTimingFromOutput,
  useStreamClock,
  type StreamTiming,
} from '@/components/stream-timing'
import type {
  ReferenceContent,
  ReferenceProvider,
} from './agent-chat/reference'
import { useAssetReferenceProvider } from '../body-work/asset/asset-reference-provider'
import { AssetParamPicker } from '../body-work/asset/asset-param-picker'
import {
  StreamPowerHistoryPanel,
  StreamPowerHistoryTrigger,
  isRunningHistoryStatus,
  streamPowerHistoryStatusLabel,
  useStreamPowerHistory,
  type StreamPowerHistoryAdapter,
} from './stream-power-history'
import { createRemoteStreamPowerHistoryAdapter } from './stream-power-history-api'

type ReferenceEditorProps = {
  value: string
  content?: ReferenceContent
  references: []
  placeholder?: string
  disabled?: boolean
  providers?: ReferenceProvider[]
  onChange: (value: string, content: ReferenceContent) => void
}

const ReferenceEditor = getCompatModule(
  '@/components/reference-composer'
).ReferenceEditor as ComponentType<ReferenceEditorProps> | undefined
const isPromptParam = getCompatModule(
  '@/components/agent/stream-request-params'
).isPromptParam as ((param: PowerParam) => boolean) | undefined

type StreamFrame = RuntimeStreamFrame<EnergonOutput>

type StreamOutput = {
  text: string
  reasoning: string
  liveOutput: EnergonOutput | null
  finalOutput: EnergonOutput | null
}

const SOURCE_RULE_PICK = 2

const EMPTY_OUTPUT: StreamOutput = {
  text: '',
  reasoning: '',
  liveOutput: null,
  finalOutput: null,
}

export function ShowStreamRequest({ item, store }: NodeItemProps) {
  const powerKey = useStore(store, () =>
    valueText(getStoreValueByPath(store, String(item.meta?.powerPath || '')))
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

export type StreamPowerRunnerProps = {
  powerKey: string
  requestApi: string
  paramApi: string
  streamApi: string
  stopApi: string
  blockMs?: number
  requestScope?: Record<string, unknown>
  paramScope?: Record<string, unknown>
  height?: string
  resultTitle?: string
  formHeader?: ReactNode
  renderResultActions?: (result: StreamPowerResult) => ReactNode
  referenceProviders?: ReferenceProvider[]
  assetReferenceTeamID?: number
  appearance?: 'default' | 'body'
  uploadBizKey?: string
  uploadBizName?: string
  allowResourceLibrary?: boolean
  onUploadedFiles?: (files: ParamUploadedFile[]) => void | Promise<void>
  history?: StreamPowerHistoryAdapter
}

export type StreamPowerResult = {
  historyID: number
  runID: number
  requestID: string
  title: string
  targetAssetID: number
  output: EnergonOutput | null
  running: boolean
  successful: boolean
  status: string
  error: string
}

export function StreamPowerRunner({
  powerKey,
  requestApi,
  paramApi,
  streamApi,
  stopApi,
  blockMs = 1000,
  requestScope,
  paramScope = requestScope,
  height = 'min(60vh, 600px)',
  resultTitle = '测试结果',
  formHeader,
  renderResultActions,
  referenceProviders = [],
  assetReferenceTeamID = 0,
  appearance = 'default',
  uploadBizKey,
  uploadBizName,
  allowResourceLibrary = true,
  onUploadedFiles,
  history,
}: StreamPowerRunnerProps) {
  const [requestID, setRequestID] = useState('')
  const [lastStreamID, setLastStreamID] = useState('0-0')
  const [running, setRunning] = useState(false)
  const [cancelable, setCancelable] = useState(false)
  const [stopping, setStopping] = useState(false)
  const [error, setError] = useState('')
  const [resultFailed, setResultFailed] = useState(false)
  const [output, setOutput] = useState<StreamOutput>(EMPTY_OUTPUT)
  const [timing, setTiming] = useState<StreamTiming | undefined>()
  const [paramsLoading, setParamsLoading] = useState(false)
  const [powerParams, setPowerParams] = useState<PowerParam[]>([])
  const [powerSources, setPowerSources] = useState<PowerParamSource[]>([])
  const [sourceRule, setSourceRule] = useState(1)
  const [selectedSource, setSelectedSource] = useState({ power: '', id: '' })
  const [paramValues, setParamValues] = useState<ParamValueMap>({})
  const [paramFiles, setParamFiles] = useState<ParamFileMap>({})
  const [paramReferenceContents, setParamReferenceContents] = useState<
    Record<string, ReferenceContent>
  >({})
  const [paramInputRevision, setParamInputRevision] = useState(0)
  const [requestIDCopied, setRequestIDCopied] = useState(false)
  const [mobileView, setMobileView] = useState<'input' | 'result'>('input')
  const runTokenRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)
  const pendingHistoryInputRef = useRef<Record<string, unknown>>({})
  const appliedHistoryInputRef = useRef('')
  const appliedHistorySourceRef = useRef('')
  const requestIDCopyTimerRef = useRef<number | null>(null)
  const outputScrollRef = useRef<HTMLDivElement | null>(null)
  const autoScrollRef = useRef(true)
  const historyController = useStreamPowerHistory(history)
  const liveHistoryID = historyController.liveRun?.historyID || 0
  const showingLiveResult =
    !historyController.enabled ||
    historyController.selectedID === 0 ||
    historyController.selectedID === liveHistoryID

  const activeSelectedSourceID = selectedSource.power === powerKey ? selectedSource.id : ''

  const applyParamInput = useCallback(
    (params: PowerParam[], input: Record<string, unknown>) => {
      const replayState = buildPowerParamReplayState(params, input)
      setParamValues(replayState.values)
      setParamFiles(replayState.files)
      setParamReferenceContents(replayState.referenceContents)
      setParamInputRevision((revision) => revision + 1)
    },
    []
  )

  useEffect(() => {
    setSelectedSource({ power: '', id: '' })
    appliedHistoryInputRef.current = ''
    appliedHistorySourceRef.current = ''
  }, [history?.scopeKey, powerKey])

  const paramUploadRuleIds = useMemo(
    () =>
      powerParams
        .map((param) => Number(param.upload_rule_id || 0))
        .filter((ruleId) => Number.isFinite(ruleId) && ruleId > 0),
    [powerParams]
  )
  const uploadRuleMetas = useUploadRuleMetas(paramUploadRuleIds)
  const mainPowerParams = useMemo(
    () =>
      powerParams.filter((param) => isMainParam(param) && !isHiddenParam(param)),
    [powerParams]
  )
  const toolbarPowerParams = useMemo(
    () =>
      powerParams.filter((param) => isToolbarParam(param) && !isHiddenParam(param)),
    [powerParams]
  )
  const hasConfiguredParams = powerParams.length > 0
  const sourcePickerOptions = useMemo(
    () =>
      powerSources.map((source) => ({
        id: source.id,
        value:
          appearance === 'body'
            ? valueText(source.service_name) || '未命名服务'
            : source.name,
      })),
    [appearance, powerSources]
  )
  const sourceReady =
    sourceRule !== SOURCE_RULE_PICK || activeSelectedSourceID.length > 0
  const nowMs = useStreamClock(timing?.status === 'running')
  const renderParamFileLibrary: ParamFileLibraryRenderer | undefined =
    appearance === 'body' && assetReferenceTeamID > 0
      ? (props) => <AssetParamPicker {...props} teamID={assetReferenceTeamID} />
      : undefined

  const canSend = useMemo(
    () =>
      hasConfiguredParams &&
      sourceReady &&
      !running &&
      !paramsLoading &&
      powerKey.length > 0,
    [hasConfiguredParams, paramsLoading, powerKey, running, sourceReady]
  )

  useEffect(() => {
    return () => {
      runTokenRef.current += 1
      abortRef.current?.abort()
      clearRequestIDCopyTimer(requestIDCopyTimerRef)
    }
  }, [])

  useEffect(() => {
    setMobileView('input')
  }, [powerKey])

  useEffect(() => {
    let cancelled = false
    setPowerParams([])
    setPowerSources([])
    setParamValues({})
    setParamFiles({})
    setParamReferenceContents({})
    pendingHistoryInputRef.current = {}
    appliedHistoryInputRef.current = ''
    setError('')
    setResultFailed(false)

    if (!powerKey) {
      setSourceRule(1)
      setParamsLoading(false)
      return () => {
        cancelled = true
      }
    }

    async function loadPowerParams() {
      setParamsLoading(true)
      const result = await request(paramApi, 'get', {
        ...paramScope,
        power: powerKey,
        include_sources: 1,
        source_target_id: activeSelectedSourceID,
      })
      if (cancelled) {
        return
      }
      if (result.code !== 0 && result.status !== 1) {
        setParamsLoading(false)
        setError(result.message || result.msg || '读取能力参数失败。')
        return
      }

      const configData = isPlainRecord(result.data) ? result.data : {}
      const config = normalizePowerParamConfig(result.data)
      const rows = config.params
      const initialInput = isPlainRecord(configData.initial_input)
        ? configData.initial_input
        : {}
      setSourceRule(config.sourceRule)
      setPowerSources(config.sources)
      if (
        config.selectedSourceID &&
        config.selectedSourceID !== activeSelectedSourceID
      ) {
        setSelectedSource({ power: powerKey, id: config.selectedSourceID })
      }

      appliedHistoryInputRef.current = ''
      setPowerParams(rows)
      applyParamInput(rows, initialInput)
      setParamsLoading(false)
    }

    void loadPowerParams()
    return () => {
      cancelled = true
    }
  }, [activeSelectedSourceID, applyParamInput, paramApi, paramScope, powerKey])

  useEffect(() => {
    if (!showingLiveResult) {
      return
    }
    const element = outputScrollRef.current
    if (!element || !autoScrollRef.current) {
      return
    }
    scrollOutputToBottom(element)
    const timer = window.setTimeout(() => scrollOutputToBottom(element), 0)
    return () => {
      window.clearTimeout(timer)
    }
  }, [output, running, showingLiveResult])

  useEffect(() => {
    const element = outputScrollRef.current
    if (!element) {
      return
    }
    if (showingLiveResult) {
      scrollOutputToBottom(element)
      return
    }
    element.scrollTop = 0
  }, [historyController.selectedID, showingLiveResult])

  const handleOutputScroll = () => {
    const element = outputScrollRef.current
    if (!element) {
      return
    }
    autoScrollRef.current = isScrolledToBottom(element)
  }

  const stop = async () => {
    if (!requestID || !cancelable || stopping) {
      return
    }
    setStopping(true)
    setError('')
    setTiming((current) => markStreamTimingStopping(current))
    abortRef.current?.abort()
    try {
      await stopRuntimeStream(requestID, stopApi)
      runTokenRef.current += 1
      setRunning(false)
      setCancelable(false)
      setTiming((current) => cancelStreamTiming(current))
      historyController.finishLiveRun()
    } catch (currentError: unknown) {
      setError(runtimeErrorMessage(currentError, '停止任务失败。'))
    } finally {
      setStopping(false)
    }
  }

  const send = async () => {
    if (!powerKey) {
      setError('未选择能力。')
      return
    }
    const validationError = validateMainParams(powerParams, paramValues)
    if (validationError) {
      setError(validationError)
      return
    }

    const token = runTokenRef.current + 1
    runTokenRef.current = token
    historyController.beginRun()
    if (appearance === 'body') {
      setMobileView('result')
    }
    setRunning(true)
    setError('')
    setResultFailed(false)
    setOutput(EMPTY_OUTPUT)
    setTiming(createStreamTiming('正在连接模型'))
    setRequestID('')
    setRequestIDCopied(false)
    setLastStreamID('0-0')
    setCancelable(false)
    setStopping(false)
    autoScrollRef.current = true
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const requestInput = buildRequestInput(powerParams, paramValues)
      if (Object.keys(paramReferenceContents).length > 0) {
        requestInput._reference_contents = paramReferenceContents
      }
      pendingHistoryInputRef.current = { ...requestInput }
      const body: Record<string, unknown> = {
        ...requestScope,
        power: powerKey,
        input: requestInput,
        params_complete: true,
        history: [],
        options: {
          stream: true,
        },
      }
      if (sourceRule === SOURCE_RULE_PICK && activeSelectedSourceID) {
        body.source_target_id = activeSelectedSourceID
      }

      await runRuntimeStream<EnergonOutput>({
        requestApi,
        streamApi,
        stopApi,
        stopOnAbort: false,
        body,
        blockMs,
        signal: controller.signal,
        onRequestID: setRequestID,
        onFrame: (frame) => {
          if (runTokenRef.current !== token || controller.signal.aborted) {
            return
          }
          const streamID = valueText(frame?.stream_id)
          if (streamID) {
            setLastStreamID(streamID)
          }
          applyFrame(frame)
        },
      })
    } catch (currentError: unknown) {
      if (runTokenRef.current === token) {
        setError(runtimeErrorMessage(currentError, '测试失败。'))
        setTiming((current) => finishStreamTiming(current, 'failed'))
        historyController.finishLiveRun()
      }
    } finally {
      if (runTokenRef.current === token) {
        setRunning(false)
      }
      if (abortRef.current === controller) {
        abortRef.current = null
      }
    }
  }

  const applyFrame = (frame: StreamFrame) => {
    const frameOutput = normalizeRuntimeFrameOutput(frame?.output, frame)
    if (isEmptyRuntimeOutput(frameOutput) && frame.type !== 'result') {
      return
    }
    const frameCancelable = resolveRuntimeFrameCancelable(frame)
    if (frameCancelable != null) {
      setCancelable(frameCancelable)
    }
    const event = valueText(frameOutput.event).toLowerCase()
    if (event === 'start') {
      const historyOutput = frameOutput as EnergonOutput & Record<string, unknown>
      const historyMeta = isPlainRecord(historyOutput.meta)
        ? historyOutput.meta
        : {}
      const historyID = positiveStreamNumber(historyMeta.history_id)
      if (historyID > 0) {
        historyController.registerLiveRun({
          historyID,
          runID: positiveStreamNumber(historyMeta.run_id),
          requestID: valueText(frame?.request_id),
          title: valueText(historyMeta.history_title) || '未命名运行',
          inputSummary: valueText(historyMeta.history_input_summary),
          input: { ...pendingHistoryInputRef.current },
          targetAssetID: positiveStreamNumber(historyMeta.target_asset_id),
          sourceTargetID: positiveStreamNumber(historyMeta.source_target_id),
        })
      }
    }
    if (isStreamTimingStatusOutput(frameOutput)) {
      setTiming((current) => updateStreamTimingFromOutput(current, frameOutput))
    }
    if (frame.type === 'result') {
      setResultFailed(Number(frame.status) === 2)
      setTiming((current) =>
        finishStreamTiming(
          current,
          Number(frame.status) === 2 ? 'failed' : 'done'
        )
      )
      historyController.finishLiveRun()
    }

    setOutput((current) => {
      if (valueText(frameOutput.event).toLowerCase() === 'control') {
        return current
      }
      if (frame.type === 'result') {
        return {
          ...current,
          finalOutput: isEmptyRuntimeOutput(frameOutput)
            ? { text: current.text || valueText(frame?.msg) }
            : frameOutput,
        }
      }

      const next: StreamOutput = {
        text: current.text,
        reasoning: current.reasoning,
        liveOutput: current.liveOutput,
        finalOutput: current.finalOutput,
      }

      if (event === 'audio_ready') {
        next.liveOutput = frameOutput
      }
      if (event === 'delta' || (!event && frameOutput.text)) {
        next.text += valueText(frameOutput.text)
      }
      if (event === 'reasoning' || frameOutput.reasoning) {
        next.reasoning += valueText(frameOutput.reasoning || frameOutput.text)
      }
      return next
    })
  }

  const setParamValue = (param: PowerParam, nextValue: unknown) => {
    const key = inputKeyForParam(param)
    if (!key) {
      return
    }
    setParamValues((current) => ({
      ...current,
      [key]: nextValue,
    }))
  }

  const setParamFileValue = (param: PowerParam, nextFiles: ParamUploadedFile[]) => {
    const key = inputKeyForParam(param)
    if (!key) {
      return
    }
    setParamFiles((current) => ({
      ...current,
      [key]: nextFiles,
    }))
    setParamValues((current) => ({
      ...current,
      [key]: paramFilesRequestValue(param, nextFiles),
    }))
  }

  const copyRequestID = async () => {
    const value = requestID.trim()
    if (!value) {
      return
    }

    try {
      await copyTextToClipboard(value)
      setRequestIDCopied(true)
      clearRequestIDCopyTimer(requestIDCopyTimerRef)
      requestIDCopyTimerRef.current = window.setTimeout(() => {
        setRequestIDCopied(false)
        requestIDCopyTimerRef.current = null
      }, 1200)
    } catch {
      setError('复制 RequestID 失败。')
    }
  }

  const liveSuccessful = Boolean(
    requestID && output.finalOutput && !running && !resultFailed && !error
  )
  const liveResultStatus = resolveStreamPowerResultStatus({
    running,
    stopping,
    failed: Boolean(error || resultFailed),
    canceled: timing?.status === 'canceled',
    successful: liveSuccessful,
  })
  const liveHistoryStatus = resolveStreamPowerHistoryStatus({
    running,
    stopping,
    failed: Boolean(error || resultFailed),
    canceled: timing?.status === 'canceled',
    successful: liveSuccessful,
  })
  useEffect(() => {
    if (liveHistoryID > 0) {
      historyController.syncLiveRun(liveHistoryID, liveHistoryStatus, error)
    }
  }, [error, historyController.syncLiveRun, liveHistoryID, liveHistoryStatus])

  const historicalDetail = showingLiveResult
    ? null
    : historyController.selectedDetail
  const selectedHistoryInput = showingLiveResult
    ? historyController.liveRun?.input
    : historicalDetail?.input
  const selectedHistorySourceTargetID = showingLiveResult
    ? historyController.liveRun?.sourceTargetID || 0
    : historicalDetail?.sourceTargetID || 0
  useEffect(() => {
    const selectedID = historyController.selectedID
    if (
      !historyController.enabled ||
      selectedID <= 0 ||
      !selectedHistoryInput ||
      powerParams.length === 0
    ) {
      return
    }
    const selectionKey = [
      history?.scopeKey || '',
      selectedID,
      historyController.selectionRevision,
    ].join(':')
    if (appliedHistorySourceRef.current !== selectionKey) {
      appliedHistorySourceRef.current = selectionKey
      if (
        sourceRule === SOURCE_RULE_PICK &&
        selectedHistorySourceTargetID > 0 &&
        powerSources.some(
          (source) => source.id === String(selectedHistorySourceTargetID)
        ) &&
        String(selectedHistorySourceTargetID) !== activeSelectedSourceID
      ) {
        setSelectedSource({
          power: powerKey,
          id: String(selectedHistorySourceTargetID),
        })
        return
      }
    }
    if (appliedHistoryInputRef.current === selectionKey) {
      return
    }

    appliedHistoryInputRef.current = selectionKey
    applyParamInput(powerParams, selectedHistoryInput)
  }, [
    activeSelectedSourceID,
    applyParamInput,
    history?.scopeKey,
    historyController.enabled,
    historyController.selectedID,
    historyController.selectionRevision,
    powerKey,
    powerParams,
    powerSources,
    selectedHistoryInput,
    selectedHistorySourceTargetID,
    sourceRule,
  ])
  const activeHistoryItem = historyController.selectedItem
  const activeStatus = showingLiveResult
    ? liveHistoryStatus
    : historicalDetail?.status || activeHistoryItem?.status || 'pending'
  const resultStatus = showingLiveResult
    ? liveResultStatus
    : streamPowerHistoryStatusLabel(activeStatus)
  const activeOutput = showingLiveResult
    ? output.finalOutput
    : historicalDetail?.output || null
  const activeResult: StreamPowerResult = {
    historyID: showingLiveResult
      ? liveHistoryID
      : historicalDetail?.id || activeHistoryItem?.id || 0,
    runID: showingLiveResult
      ? historyController.liveRun?.runID || 0
      : historicalDetail?.runID || activeHistoryItem?.runID || 0,
    requestID: showingLiveResult
      ? requestID
      : historicalDetail?.requestID || activeHistoryItem?.requestID || '',
    title: showingLiveResult
      ? activeHistoryItem?.title || historyController.liveRun?.title || ''
      : historicalDetail?.title || activeHistoryItem?.title || '',
    targetAssetID: showingLiveResult
      ? historyController.liveRun?.targetAssetID || 0
      : historicalDetail?.targetAssetID || 0,
    output: activeOutput,
    running: showingLiveResult ? running : isRunningHistoryStatus(activeStatus),
    successful: showingLiveResult
      ? liveSuccessful
      : Boolean(historicalDetail && activeStatus === 'success'),
    status: activeStatus,
    error: showingLiveResult
      ? error
      : historicalDetail?.error || activeHistoryItem?.error || '',
  }
  const resultContent = (
    <>
      {showingLiveResult && timing ? (
        <div className="stream-power-timing mb-3">
          <StreamTimingBadge timing={timing} now={nowMs} />
        </div>
      ) : null}
      {!showingLiveResult && historyController.detailError ? (
        <div className="stream-power-history-detail-error">
          <span>{historyController.detailError}</span>
          <button type="button" onClick={historyController.retryDetail}>
            重试
          </button>
        </div>
      ) : null}
      {!showingLiveResult &&
      !historyController.detailError &&
      activeResult.error ? (
        <div className="stream-power-history-detail-error">
          <span>{activeResult.error}</span>
        </div>
      ) : null}
      <EnergonContentView
        output={showingLiveResult ? buildContentViewOutput(output) : activeOutput}
        streaming={showingLiveResult && running && !output.finalOutput}
        emptyText={
          !showingLiveResult && historyController.detailLoading
            ? '正在读取历史结果。'
            : appearance === 'body'
            ? '生成结果会显示在这里。'
            : 'AI 返回内容会显示在这里。'
        }
        className={appearance === 'body' ? 'stream-power-content-view' : undefined}
        markdownClassName={appearance === 'body' ? 'stream-power-markdown' : undefined}
      />
    </>
  )
  const showRunActions = appearance === 'body' ? Boolean(powerKey) : hasConfiguredParams
  const runActions = showRunActions ? (
    <>
      {running ? (
        <StreamStopButton
          cancelable={cancelable}
          stopping={stopping}
          onStop={stop}
        />
      ) : null}
      {appearance !== 'body' ? (
        <StreamPowerHistoryTrigger
          controller={historyController}
          label="历史"
        />
      ) : null}
      <Button
        type="button"
        size="sm"
        className="stream-power-generate-action"
        disabled={!canSend}
        onClick={() => void send()}
      >
        {running ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <Send className="mr-2 size-4" />
        )}
        {running ? '生成中...' : '生成'}
      </Button>
    </>
  ) : null

  return (
    <div
      data-stream-power-appearance={appearance}
      data-mobile-view={appearance === 'body' ? mobileView : undefined}
      className="stream-power-runner flex h-full min-h-0 flex-col gap-4 overflow-y-auto md:flex-row md:overflow-hidden"
      style={{ height }}
    >
      {appearance === 'body' ? (
        <div className="stream-power-mobile-tabs" role="tablist" aria-label="工具运行视图">
          <button
            type="button"
            role="tab"
            aria-selected={mobileView === 'input'}
            data-active={mobileView === 'input'}
            onClick={() => setMobileView('input')}
          >
            输入
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileView === 'result'}
            data-active={mobileView === 'result'}
            onClick={() => setMobileView('result')}
          >
            结果
          </button>
        </div>
      ) : null}
      <div className="stream-power-form-column flex min-h-[360px] w-full max-w-md shrink-0 flex-col gap-3 md:h-full md:min-h-0">
        {formHeader || (appearance === 'body' && runActions) ? (
          <div className="stream-power-form-header shrink-0">
            {formHeader ? (
              <div className="stream-power-form-header-content">{formHeader}</div>
            ) : null}
            {appearance === 'body' && runActions ? (
              <div className="stream-power-header-actions stream-power-run-actions">
                {runActions}
              </div>
            ) : null}
          </div>
        ) : null}
        <div className="stream-power-form min-h-0 flex-1 overflow-y-auto rounded-xl bg-background/70 p-3">
          {paramsLoading ? (
            <span className="stream-power-loading mb-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              读取参数
            </span>
          ) : null}

          {sourceRule === SOURCE_RULE_PICK && powerSources.length > 0 ? (
            <div className="stream-power-source mb-3">
              {appearance === 'body' ? (
                <span className="stream-power-source-label">选择模型</span>
              ) : null}
              <div className="stream-power-source-picker">
                <SearchableOptionPicker
                  value={activeSelectedSourceID || undefined}
                  options={sourcePickerOptions}
                  disabled={running || paramsLoading}
                  placeholder={appearance === 'body' ? '请选择模型' : '请选择来源'}
                  searchPlaceholder={appearance === 'body' ? '搜索模型...' : undefined}
                  clearable={false}
                  onChange={(nextValue) => {
                    const sourceID = Array.isArray(nextValue) ? nextValue[0] || '' : nextValue
                    setSelectedSource({ power: powerKey, id: String(sourceID || '') })
                  }}
                />
              </div>
            </div>
          ) : null}

          {mainPowerParams.length > 0 ? (
            <div
              key={`main-${paramInputRevision}`}
              className="stream-power-param-list space-y-3"
            >
              {mainPowerParams.map((param) => {
                const key = inputKeyForParam(param)
                if (
                  isPromptParam?.(param) &&
                  ReferenceEditor &&
                  (assetReferenceTeamID > 0 || referenceProviders.length > 0)
                ) {
                  return (
                    <PowerPromptReferenceField
                      key={`${param.id}-${key}`}
                      param={param}
                      value={String(paramValues[key] || '')}
                      content={paramReferenceContents[key]}
                      providers={referenceProviders}
                      assetReferenceTeamID={assetReferenceTeamID}
                      disabled={running}
                      onChange={(nextValue, nextContent) => {
                        setParamValue(param, nextValue)
                        setParamReferenceContents((current) => ({
                          ...current,
                          [key]: nextContent,
                        }))
                      }}
                    />
                  )
                }
                return (
                  <div key={`${param.id}-${key}`} className="stream-power-param-field">
                    <PowerParamField
                      param={param}
                      value={paramValues[key]}
                      files={paramFiles[key] || []}
                      uploadRuleMeta={uploadRuleMetas.get(Number(param.upload_rule_id || 0))}
                      disabled={running}
                      uploadBizKey={uploadBizKey}
                      uploadBizName={uploadBizName}
                      allowResourceLibrary={allowResourceLibrary}
                      fileLibraryOnly={Boolean(renderParamFileLibrary)}
                      fileLibraryLabel={renderParamFileLibrary ? '添加' : undefined}
                      renderFileLibrary={renderParamFileLibrary}
                      onUploadedFiles={onUploadedFiles}
                      onChange={(nextValue) => setParamValue(param, nextValue)}
                      onFilesChange={(nextFiles) => setParamFileValue(param, nextFiles)}
                    />
                  </div>
                )
              })}
            </div>
          ) : !paramsLoading ? (
            <div className="stream-power-empty rounded-lg px-3 py-8 text-center text-sm text-muted-foreground">
              暂无参数配置。
            </div>
          ) : null}

          {toolbarPowerParams.length > 0 ? (
            <div
              key={`toolbar-${paramInputRevision}`}
              className="stream-power-toolbar-params mt-3 flex flex-wrap items-center gap-2 border-t pt-3"
            >
              {toolbarPowerParams.map((param) => {
                const key = inputKeyForParam(param)
                return (
                  <PowerParamPopover
                    key={`${param.id}-${key}`}
                    param={param}
                    value={paramValues[key]}
                    files={paramFiles[key] || []}
                    uploadRuleMeta={uploadRuleMetas.get(Number(param.upload_rule_id || 0))}
                    disabled={running}
                    uploadBizKey={uploadBizKey}
                    uploadBizName={uploadBizName}
                    allowResourceLibrary={allowResourceLibrary}
                    fileLibraryOnly={Boolean(renderParamFileLibrary)}
                    fileLibraryLabel={renderParamFileLibrary ? '添加' : undefined}
                    renderFileLibrary={renderParamFileLibrary}
                    onUploadedFiles={onUploadedFiles}
                    onChange={(nextValue) => setParamValue(param, nextValue)}
                    onFilesChange={(nextFiles) => setParamFileValue(param, nextFiles)}
                  />
                )
              })}
            </div>
          ) : null}

          {error ? (
            <div className="stream-power-error mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          ) : null}
        </div>

        {appearance !== 'body' && runActions ? (
          <div className="stream-power-actions stream-power-run-actions flex shrink-0 items-center justify-center gap-2 rounded-xl bg-background px-3 py-3">
            {runActions}
          </div>
        ) : null}
      </div>

      <div className="stream-power-divider hidden w-px shrink-0 bg-border md:block" aria-hidden="true" />

      <div className="stream-power-result relative flex min-h-[360px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-background md:h-full md:min-h-0">
        <div className="stream-power-result-header flex shrink-0 items-center justify-between gap-3 border-b px-3 py-2">
          {appearance === 'body' ? (
            <div className="stream-power-result-heading">
              <span>{resultTitle}</span>
              <small data-status={resultStatus}>{resultStatus}</small>
            </div>
          ) : (
            <span className="text-sm font-medium text-foreground">{resultTitle}</span>
          )}
          <div className="stream-power-result-actions flex min-w-0 items-center justify-end gap-2">
            {appearance === 'body' && running ? (
              <StreamStopButton
                className="stream-power-mobile-stop"
                cancelable={cancelable}
                stopping={stopping}
                onStop={stop}
              />
            ) : null}
            {renderResultActions?.(activeResult)}
            {appearance === 'body' ? (
              <StreamPowerHistoryTrigger controller={historyController} />
            ) : null}
            {appearance !== 'body' ? (
              requestID ? (
                <button
                  type="button"
                  className="flex min-w-0 max-w-[70%] items-center justify-end rounded-md px-2 py-1 text-xs text-muted-foreground transition hover:bg-muted hover:text-foreground"
                  title={`双击复制完整 RequestID：${requestID}${
                    lastStreamID !== '0-0' ? ` / StreamID: ${lastStreamID}` : ''
                  }`}
                  onDoubleClick={() => void copyRequestID()}
                >
                  <span className="mr-1 shrink-0">RequestID:</span>
                  <span className="min-w-0 truncate font-mono">{requestID}</span>
                  {requestIDCopied ? (
                    <span className="ml-2 shrink-0 text-primary">已复制</span>
                  ) : null}
                </button>
              ) : (
                <span className="text-xs text-muted-foreground">暂无 RequestID</span>
              )
            ) : null}
          </div>
        </div>
        <div
          ref={outputScrollRef}
          onScroll={handleOutputScroll}
          style={{ scrollbarGutter: 'stable' }}
          className="stream-power-result-body h-0 min-h-0 flex-1 overflow-y-auto p-3"
        >
          {appearance === 'body' ? (
            <div className="stream-power-result-content">{resultContent}</div>
          ) : (
            resultContent
          )}
        </div>
        <StreamPowerHistoryPanel controller={historyController} />
      </div>
    </div>
  )
}

function PowerPromptReferenceField({
  param,
  value,
  content,
  providers,
  assetReferenceTeamID,
  disabled,
  onChange,
}: {
  param: PowerParam
  value: string
  content?: ReferenceContent
  providers: ReferenceProvider[]
  assetReferenceTeamID: number
  disabled: boolean
  onChange: (value: string, content: ReferenceContent) => void
}) {
  const assetReferenceProvider = useAssetReferenceProvider({
    teamID: assetReferenceTeamID,
    allowedKinds: param.asset_kinds,
  })
  const activeProviders = useMemo(
    () =>
      assetReferenceTeamID > 0
        ? [
            assetReferenceProvider,
            ...providers.filter((provider) => provider.trigger !== '@'),
          ]
        : providers,
    [assetReferenceProvider, assetReferenceTeamID, providers]
  )

  return (
    <div className='stream-power-param-field stream-power-prompt-field space-y-2 rounded-xl bg-muted/30 p-3'>
      <div className='stream-power-prompt-heading'>
        <span className='text-sm font-medium text-foreground'>
          {param.name}
          {param.required ? <span className='ml-0.5 text-destructive'>*</span> : null}
        </span>
        <small>输入 @ 引用资产</small>
      </div>
      <ReferenceEditor
        value={value}
        content={content}
        references={[]}
        placeholder={param.placeholder || `请输入${param.name}`}
        disabled={disabled}
        providers={activeProviders}
        onChange={onChange}
      />
    </div>
  )
}

function StreamStopButton({
  cancelable,
  stopping,
  className,
  onStop,
}: {
  cancelable: boolean
  stopping: boolean
  className?: string
  onStop: () => void | Promise<void>
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={`stream-power-stop-action ${className || ''}`.trim()}
      disabled={!cancelable || stopping}
      onClick={() => void onStop()}
    >
      {stopping ? (
        <Loader2 className="mr-2 size-3.5 animate-spin" />
      ) : (
        <Square className="mr-2 size-3.5" />
      )}
      {cancelable ? '停止' : '不可停止'}
    </Button>
  )
}

function resolveStreamPowerResultStatus({
  running,
  stopping,
  failed,
  canceled,
  successful,
}: {
  running: boolean
  stopping: boolean
  failed: boolean
  canceled: boolean
  successful: boolean
}) {
  if (stopping) {
    return '正在停止'
  }
  if (running) {
    return '生成中'
  }
  if (failed) {
    return '生成失败'
  }
  if (canceled) {
    return '已停止'
  }
  return successful ? '已完成' : '等待生成'
}

function resolveStreamPowerHistoryStatus({
  running,
  stopping,
  failed,
  canceled,
  successful,
}: {
  running: boolean
  stopping: boolean
  failed: boolean
  canceled: boolean
  successful: boolean
}) {
  if (stopping || running) {
    return 'running'
  }
  if (failed) {
    return 'fail'
  }
  if (canceled) {
    return 'canceled'
  }
  return successful ? 'success' : 'pending'
}

function isScrolledToBottom(element: HTMLElement) {
  return element.scrollHeight - element.scrollTop - element.clientHeight <= 24
}

function scrollOutputToBottom(element: HTMLElement) {
  element.scrollTop = element.scrollHeight
}

function buildContentViewOutput(output: StreamOutput): EnergonOutput[] | EnergonOutput {
  if (output.finalOutput) {
    return output.finalOutput
  }

  const items: EnergonOutput[] = []
  if (output.liveOutput) {
    items.push(output.liveOutput)
  }
  if (output.reasoning) {
    items.push({ event: 'reasoning', reasoning: output.reasoning })
  }
  if (output.text) {
    items.push({ text: output.text })
  }
  return items
}

function clearRequestIDCopyTimer(timerRef: { current: number | null }) {
  if (timerRef.current == null) {
    return
  }
  window.clearTimeout(timerRef.current)
  timerRef.current = null
}

function positiveStreamNumber(value: unknown) {
  const number = Number(value || 0)
  return Number.isFinite(number) && number > 0 ? number : 0
}

function mergePowerParamValues(
  params: PowerParam[],
  current: ParamValueMap,
  input: Record<string, unknown>
) {
  let next = current
  for (const param of params) {
    const key = inputKeyForParam(param)
    if (!key || !Object.prototype.hasOwnProperty.call(input, key)) {
      continue
    }
    const value = replayParamValue(input[key])
    if (!isSupportedReplayParamValue(param, value)) {
      continue
    }
    if (Object.is(next[key], value)) {
      continue
    }
    if (next === current) {
      next = { ...current }
    }
    next[key] = value
  }
  return next
}

function isSupportedReplayParamValue(param: PowerParam, value: unknown) {
  const options = param.options || []
  if (param.type !== 'option' || options.length === 0) {
    return true
  }
  const selected = valueText(value)
  return (
    selected.length > 0 &&
    options.some((option) => isSelectedOptionValue(option, [selected]))
  )
}

function buildPowerParamReplayState(
  params: PowerParam[],
  input: Record<string, unknown>
) {
  return {
    values: mergePowerParamValues(params, buildDefaultParamValues(params), input),
    files: buildReplayParamFiles(params, input),
    referenceContents: replayReferenceContents(input),
  }
}

function replayParamValue(value: unknown) {
  if (Array.isArray(value)) {
    return [...value]
  }
  if (isPlainRecord(value)) {
    return { ...value }
  }
  return value
}

function replayReferenceContents(input: Record<string, unknown>) {
  const raw = isPlainRecord(input._reference_contents)
    ? input._reference_contents
    : {}
  const result: Record<string, ReferenceContent> = {}
  for (const [key, value] of Object.entries(raw)) {
    if (isPlainRecord(value)) {
      result[key] = value as ReferenceContent
    }
  }
  return result
}

function buildReplayParamFiles(
  params: PowerParam[],
  input: Record<string, unknown>
): ParamFileMap {
  const result: ParamFileMap = {}
  for (const param of params) {
    if (param.type !== 'file' && param.type !== 'files') {
      continue
    }
    const key = inputKeyForParam(param)
    if (!key || !Object.prototype.hasOwnProperty.call(input, key)) {
      continue
    }
    const urls = replayFileURLs(input[key])
    const selected = param.type === 'files' ? urls : urls.slice(0, 1)
    if (selected.length === 0) {
      continue
    }
    result[key] = selected.map((url, index) => {
      const kind = param.asset_kinds?.[0]
      return {
        id: `replay:${key}:${index}`,
        name: replayFileName(url, index),
        kind,
        url,
        thumbnail: kind === 'image' ? url : undefined,
      }
    })
  }
  return result
}

function replayFileURLs(value: unknown) {
  const values = Array.isArray(value) ? value : [value]
  return values
    .map((item) => valueText(item))
    .filter((item) => item.length > 0)
}

function replayFileName(url: string, index: number) {
  const path = url.split(/[?#]/, 1)[0] || ''
  const name = path.split('/').pop() || ''
  if (name) {
    try {
      return decodeURIComponent(name)
    } catch {
      return name
    }
  }
  return `历史文件 ${index + 1}`
}
