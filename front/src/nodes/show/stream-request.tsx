import {
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
  isToolbarParam,
  normalizePowerParamConfig,
  paramFilesRequestValue,
  validateMainParams,
  type ParamFileMap,
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
  finalOutput: EnergonOutput | null
}

const SOURCE_RULE_PICK = 2

const EMPTY_OUTPUT: StreamOutput = {
  text: '',
  reasoning: '',
  finalOutput: null,
}

export function ShowStreamRequest({ item, store }: NodeItemProps) {
  const powerKey = useStore(store, () =>
    valueText(getStoreValueByPath(store, String(item.meta?.powerPath || '')))
  )
  return (
    <StreamPowerRunner
      powerKey={powerKey}
      requestApi={String(item.meta?.requestApi || '/bot/admin/energon/request')}
      paramApi={String(item.meta?.paramApi || '/bot/admin/energon/power_params')}
      streamApi={String(item.meta?.streamApi || '/bot/admin/energon/stream')}
      stopApi={String(item.meta?.stopApi || '/bot/admin/energon/stream_stop')}
      blockMs={Number(item.meta?.blockMs || 1000)}
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
  renderResultActions?: (result: StreamPowerResult) => ReactNode
  referenceProviders?: ReferenceProvider[]
  assetReferenceTeamID?: number
  appearance?: 'default' | 'body'
  uploadBizKey?: string
  uploadBizName?: string
  allowResourceLibrary?: boolean
  onUploadedFiles?: (files: ParamUploadedFile[]) => void | Promise<void>
}

export type StreamPowerResult = {
  requestID: string
  output: EnergonOutput | null
  running: boolean
  successful: boolean
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
  renderResultActions,
  referenceProviders = [],
  assetReferenceTeamID = 0,
  appearance = 'default',
  uploadBizKey,
  uploadBizName,
  allowResourceLibrary = true,
  onUploadedFiles,
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
  const [requestIDCopied, setRequestIDCopied] = useState(false)
  const runTokenRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)
  const requestIDCopyTimerRef = useRef<number | null>(null)
  const outputScrollRef = useRef<HTMLDivElement | null>(null)
  const autoScrollRef = useRef(true)

  const activeSelectedSourceID = selectedSource.power === powerKey ? selectedSource.id : ''
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
    () => powerSources.map((source) => ({ id: source.id, value: source.name })),
    [powerSources]
  )
  const sourceReady =
    sourceRule !== SOURCE_RULE_PICK || activeSelectedSourceID.length > 0
  const nowMs = useStreamClock(timing?.status === 'running')

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
    let cancelled = false
    setPowerParams([])
    setPowerSources([])
    setParamValues({})
    setParamFiles({})
    setParamReferenceContents({})
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

      const config = normalizePowerParamConfig(result.data)
      const rows = config.params
      setSourceRule(config.sourceRule)
      setPowerSources(config.sources)
      if (
        config.selectedSourceID &&
        config.selectedSourceID !== activeSelectedSourceID
      ) {
        setSelectedSource({ power: powerKey, id: config.selectedSourceID })
      }
      setPowerParams(rows)
      setParamValues(buildDefaultParamValues(rows))
      setParamsLoading(false)
    }

    void loadPowerParams()
    return () => {
      cancelled = true
    }
  }, [activeSelectedSourceID, paramApi, paramScope, powerKey])

  useEffect(() => {
    const element = outputScrollRef.current
    if (!element || !autoScrollRef.current) {
      return
    }
    scrollOutputToBottom(element)
    const timer = window.setTimeout(() => scrollOutputToBottom(element), 0)
    return () => {
      window.clearTimeout(timer)
    }
  }, [output, running])

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
      const body: Record<string, unknown> = {
        ...requestScope,
        power: powerKey,
        input: requestInput,
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
        finalOutput: current.finalOutput,
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

  return (
    <div
      data-stream-power-appearance={appearance}
      className="stream-power-runner flex h-full min-h-0 flex-col gap-4 overflow-y-auto md:flex-row md:overflow-hidden"
      style={{ height }}
    >
      <div className="stream-power-form-column flex min-h-[360px] w-full max-w-md shrink-0 flex-col gap-3 md:h-full md:min-h-0">
        <div className="stream-power-form min-h-0 flex-1 overflow-y-auto rounded-xl bg-background/70 p-3">
          {paramsLoading ? (
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              <Loader2 className="size-3 animate-spin" />
              读取参数
            </span>
          ) : null}

          {sourceRule === SOURCE_RULE_PICK && powerSources.length > 0 ? (
            <div className="mb-3">
              <SearchableOptionPicker
                value={activeSelectedSourceID || undefined}
                options={sourcePickerOptions}
                disabled={running || paramsLoading}
                placeholder="请选择来源"
                clearable={false}
                onChange={(nextValue) => {
                  const sourceID = Array.isArray(nextValue) ? nextValue[0] || '' : nextValue
                  setSelectedSource({ power: powerKey, id: String(sourceID || '') })
                }}
              />
            </div>
          ) : null}

          {mainPowerParams.length > 0 ? (
            <div className="space-y-3">
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
                  <PowerParamField
                    key={`${param.id}-${key}`}
                    param={param}
                    value={paramValues[key]}
                    files={paramFiles[key] || []}
                    uploadRuleMeta={uploadRuleMetas.get(Number(param.upload_rule_id || 0))}
                    disabled={running}
                    uploadBizKey={uploadBizKey}
                    uploadBizName={uploadBizName}
                    allowResourceLibrary={allowResourceLibrary}
                    onUploadedFiles={onUploadedFiles}
                    onChange={(nextValue) => setParamValue(param, nextValue)}
                    onFilesChange={(nextFiles) => setParamFileValue(param, nextFiles)}
                  />
                )
              })}
            </div>
          ) : !paramsLoading ? (
            <div className="rounded-lg px-3 py-8 text-center text-sm text-muted-foreground">
              暂无参数配置。
            </div>
          ) : null}

          {toolbarPowerParams.length > 0 ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 border-t pt-3">
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
                    onUploadedFiles={onUploadedFiles}
                    onChange={(nextValue) => setParamValue(param, nextValue)}
                    onFilesChange={(nextFiles) => setParamFileValue(param, nextFiles)}
                  />
                )
              })}
            </div>
          ) : null}

          {error ? (
            <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </div>
          ) : null}
        </div>

        {hasConfiguredParams ? (
          <div className="stream-power-actions flex shrink-0 items-center justify-center gap-2 rounded-xl bg-background px-3 py-3">
            {running ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!cancelable || stopping}
                onClick={() => void stop()}
              >
                {stopping ? (
                  <Loader2 className="mr-2 size-3.5 animate-spin" />
                ) : (
                  <Square className="mr-2 size-3.5" />
                )}
                {cancelable ? '停止' : '不可停止'}
              </Button>
            ) : null}
            <Button type="button" size="sm" disabled={!canSend} onClick={() => void send()}>
              {running ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Send className="mr-2 size-4" />
              )}
              {running ? '生成中...' : '生成'}
            </Button>
          </div>
        ) : null}
      </div>

      <div className="stream-power-divider hidden w-px shrink-0 bg-border md:block" aria-hidden="true" />

      <div className="stream-power-result flex min-h-[360px] min-w-0 flex-1 flex-col overflow-hidden rounded-xl bg-background md:h-full md:min-h-0">
        <div className="stream-power-result-header flex shrink-0 items-center justify-between gap-3 border-b px-3 py-2">
          <span className="text-sm font-medium text-foreground">{resultTitle}</span>
          <div className="flex min-w-0 items-center justify-end gap-2">
            {renderResultActions?.({
              requestID,
              output: output.finalOutput,
              running,
              successful: Boolean(
                requestID && output.finalOutput && !running && !resultFailed && !error
              ),
            })}
            {requestID ? (
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
            )}
          </div>
        </div>
        <div
          ref={outputScrollRef}
          onScroll={handleOutputScroll}
          style={{ scrollbarGutter: 'stable' }}
          className="stream-power-result-body h-0 min-h-0 flex-1 overflow-y-auto p-3"
        >
          {timing ? (
            <div className="mb-3">
              <StreamTimingBadge timing={timing} now={nowMs} />
            </div>
          ) : null}
          <EnergonContentView
            output={buildContentViewOutput(output)}
            streaming={running && !output.finalOutput}
            emptyText="AI 返回内容会显示在这里。"
          />
        </div>
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
    <div className='stream-power-prompt-field space-y-2 rounded-xl bg-muted/30 p-3'>
      <div className='text-sm font-medium text-foreground'>
        {param.name}
        {param.required ? <span className='ml-0.5 text-destructive'>*</span> : null}
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
