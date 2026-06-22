import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { useStore } from 'zustand'
import { request } from '@dever/front-plugin'
import {
  CheckCircle2,
  Loader2,
  Play,
  Square,
  Trash2,
  UploadCloud,
  XCircle,
} from 'lucide-react'
import type { NodeItemProps } from '@/page/nodes'
import { runAgentStream, stopAgentStream } from '@/lib/agent/runner'
import { reloadStorePageSchema } from '@/lib/page-schema-reload'
import {
  normalizeRuntimeFrameOutput,
  resolveRuntimeFrameCancelable,
  runtimeErrorMessage,
} from '@/lib/runtime-stream-output'
import { getStoreValueByPath } from '@/lib/store'
import {
  streamValueText as valueText,
  type RuntimeStreamFrame,
} from '@/lib/stream'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AgentContentOutputView } from './agent-content-output'

type SkillTestMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
  running?: boolean
  kind?: 'test' | 'analysis' | 'publish'
  result?: SkillTestResponse
  output?: AgentOutput | null
  error?: string
}

type SkillTestResponse = {
  status: number
  msg: string
  data: Record<string, unknown>
}

type AgentOutput = Record<string, unknown>

type PublishOption = {
  id: string
  name: string
}

type PublishOptions = {
  packs: PublishOption[]
  cates: PublishOption[]
}

type PublishForm = {
  key: string
  name: string
  description: string
  packID: string
  cateID: string
}

const DEFAULT_DRAFT_PATH = 'data.actionTarget.testDraft'
const DEFAULT_TEST_API = '/bot/admin/skill_draft/test'
const DEFAULT_PUBLISH_API = '/bot/admin/skill_draft/publish'
const DEFAULT_PUBLISH_OPTIONS_API = '/bot/admin/skill_draft/publish_options'
const DEFAULT_AGENT_KEY = 'skill-creator'
const DEFAULT_HEIGHT = 'min(calc(85vh - 11rem), 620px)'
const DEFAULT_TIMEOUT_SECONDS = 15

export function ShowSkillTest({ item, store }: NodeItemProps) {
  const draftPath = String(item.meta?.draftPath || DEFAULT_DRAFT_PATH)
  const openPath = String(item.meta?.openPath || '')
  const draft = useStore(store, () => {
    const value = getStoreValueByPath(store, draftPath)
    return isPlainRecord(value) ? value : {}
  })
  const agentKey = useStore(store, () => {
    const configured = valueText(
      getStoreValueByPath(store, String(item.meta?.agentPath || ''))
    )
    return configured || String(item.meta?.agentKey || DEFAULT_AGENT_KEY)
  })
  const agentName = useStore(store, () =>
    valueText(getStoreValueByPath(store, String(item.meta?.agentNamePath || '')))
  )
  const modalOpen = useStore(store, () =>
    openPath ? Boolean(getStoreValueByPath(store, openPath)) : true
  )
  const draftID = positiveNumber(draft.id || draft.draft_id || draft.draftId)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<SkillTestMessage[]>([])
  const [running, setRunning] = useState(false)
  const [tested, setTested] = useState(false)
  const [testPassed, setTestPassed] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [published, setPublished] = useState(false)
  const [publishDialogOpen, setPublishDialogOpen] = useState(false)
  const [publishForm, setPublishForm] = useState<PublishForm>(() =>
    draftPublishForm({})
  )
  const [publishOptions, setPublishOptions] = useState<PublishOptions>({
    packs: [],
    cates: [],
  })
  const [publishOptionsLoading, setPublishOptionsLoading] = useState(false)
  const [publishError, setPublishError] = useState('')
  const [error, setError] = useState('')
  const [requestID, setRequestID] = useState('')
  const [lastStreamID, setLastStreamID] = useState('0-0')
  const [cancelable, setCancelable] = useState(false)
  const [stopping, setStopping] = useState(false)
  const runTokenRef = useRef(0)
  const testApi = String(item.meta?.testApi || DEFAULT_TEST_API)
  const publishApi = String(item.meta?.publishApi || DEFAULT_PUBLISH_API)
  const publishOptionsApi = String(
    item.meta?.publishOptionsApi || DEFAULT_PUBLISH_OPTIONS_API
  )
  const reloadPageOnPublish = item.meta?.reloadPageOnPublish !== false
  const reloadPageOnPublishDelayMs = Math.max(
    0,
    Number(item.meta?.reloadPageOnPublishDelayMs || 500)
  )
  const requestApi = String(item.meta?.requestApi || '/bot/admin/agent/run')
  const streamApi = String(item.meta?.streamApi || '/bot/admin/agent/stream')
  const stopApi = String(item.meta?.stopApi || '/bot/admin/agent/stop')
  const blockMs = Number(item.meta?.blockMs || 1000)
  const height =
    valueText(item.meta?.height || item.meta?.containerHeight) ||
    DEFAULT_HEIGHT
  const placeholder = String(
    item.meta?.placeholder ||
      '输入测试参数，每行一个；留空表示不带参数运行。'
  )
  const emptyText = String(
    item.meta?.emptyText ||
      '输入一次测试参数开始测试。系统会先检查技能内容，再在沙箱中运行脚本。'
  )
  const canStart = draftID > 0 && !running && !tested
  const canPublish =
    draftID > 0 &&
    tested &&
    testPassed &&
    !running &&
    !publishing &&
    !published
  const publishTitle = published
    ? '当前技能已发布。'
    : testPassed
      ? '测试已通过，可以发布。'
      : '测试通过后才可以发布。'

  useEffect(() => {
    if (!modalOpen) {
      return
    }
    reset()
  }, [draftID, modalOpen])

  const inputArgs = useMemo(() => splitArgs(input), [input])

  const startTest = async () => {
    if (!canStart) {
      return
    }
    const token = runTokenRef.current + 1
    runTokenRef.current = token
    setRunning(true)
    setTested(false)
    setTestPassed(false)
    setPublished(false)
    setError('')
    setRequestID('')
    setLastStreamID('0-0')
    setCancelable(false)

    const userText = input.trim() || '不带参数运行测试。'
    const testMessageID = `test-${Date.now()}`
    setMessages([
      {
        id: `user-${Date.now()}`,
        role: 'user',
        text: userText,
      },
      {
        id: testMessageID,
        role: 'assistant',
        kind: 'test',
        text: '正在运行测试...',
        running: true,
      },
    ])

    try {
      const testResult = await runSkillDraftTest(testApi, draftID, inputArgs)
      if (runTokenRef.current !== token) {
        return
      }
      const passed = testResult.status === 1
      setTestPassed(passed)
      setMessages((current) =>
        current.map((message) =>
          message.id === testMessageID
            ? {
                ...message,
                text: testResult.msg,
                running: false,
                result: testResult,
              }
            : message
        )
      )

      if (!agentKey) {
        setTested(true)
        return
      }

      const analysisID = `analysis-${Date.now()}`
      setMessages((current) => [
        ...current,
        {
          id: analysisID,
          role: 'assistant',
          kind: 'analysis',
          text: `${agentName || '技能创建工程师'}正在分析测试结果...`,
          running: true,
        },
      ])
      await explainTestResult({
        token,
        messageID: analysisID,
        testResult,
        args: inputArgs,
      })
    } catch (currentError: unknown) {
      if (runTokenRef.current === token) {
        const message = runtimeErrorMessage(currentError, '测试失败。')
        setError(message)
        setMessages((current) =>
          current.map((item) =>
            item.running
              ? {
                  ...item,
                  text:
                    item.kind === 'analysis' || !item.result
                      ? message
                      : item.text,
                  running: false,
                  error:
                    item.kind === 'analysis' || !item.result
                      ? message
                      : item.error,
                }
              : item
          )
        )
      }
    } finally {
      if (runTokenRef.current === token) {
        setRunning(false)
        setTested(true)
        setCancelable(false)
      }
    }
  }

  const explainTestResult = async ({
    token,
    messageID,
    testResult,
    args,
  }: {
    token: number
    messageID: string
    testResult: SkillTestResponse
    args: string[]
  }) => {
    await runAgentStream<AgentOutput>({
      agent: agentKey,
      input: {
        text: buildTestAnalysisPrompt(draft, testResult, args),
        draft: compactDraft(draft),
        skill_test: testResult.data,
        test_status: testResult.status,
        test_message: testResult.msg,
        test_args: args,
      },
      history: [],
      requestApi,
      streamApi,
      stopApi,
      blockMs,
      onRequestID: (nextRequestID) => {
        if (runTokenRef.current !== token) {
          return
        }
        setRequestID(valueText(nextRequestID))
      },
      onFrame: (frame: RuntimeStreamFrame<AgentOutput>) => {
        if (runTokenRef.current !== token) {
          return
        }
        const streamID = valueText(frame?.stream_id)
        if (streamID) {
          setLastStreamID(streamID)
        }
        const frameCancelable = resolveRuntimeFrameCancelable(frame)
        if (frameCancelable != null) {
          setCancelable(frameCancelable)
        }
        const output = frameOutput(frame)
        const text = frameText(frame)
        if (text) {
          setMessages((current) =>
            current.map((message) =>
              message.id === messageID
                ? {
                    ...message,
                    text,
                    output: output || message.output,
                    running: frame.type !== 'result',
                  }
                : message
            )
          )
        }
        if (frame.type === 'result') {
          setMessages((current) =>
            current.map((message) =>
              message.id === messageID
                ? {
                  ...message,
                  text: text || message.text || 'AI 已完成测试结果分析。',
                  output: output || message.output,
                  running: false,
                }
                : message
            )
          )
        }
      },
    })
  }

  const stop = async () => {
    if (!requestID || !cancelable || stopping) {
      return
    }
    setStopping(true)
    try {
      await stopAgentStream(requestID, stopApi)
      runTokenRef.current += 1
      setRunning(false)
      setCancelable(false)
      setMessages((current) =>
        current.map((message) =>
          message.running
            ? { ...message, running: false, text: message.text || '已停止。' }
            : message
        )
      )
    } catch (currentError: unknown) {
      setError(runtimeErrorMessage(currentError, '停止测试分析失败。'))
    } finally {
      setStopping(false)
    }
  }

  const openPublishDialog = () => {
    if (!canPublish) {
      return
    }
    setPublishForm(draftPublishForm(draft))
    setPublishError('')
    setPublishDialogOpen(true)
    void loadPublishOptions()
  }

  const loadPublishOptions = async () => {
    setPublishOptionsLoading(true)
    try {
      const response = await request(publishOptionsApi, 'post', {})
      setPublishOptions(normalizePublishOptions(response))
    } catch (currentError: unknown) {
      setPublishError(runtimeErrorMessage(currentError, '加载发布选项失败。'))
    } finally {
      setPublishOptionsLoading(false)
    }
  }

  const submitPublish = async () => {
    if (!canPublish) {
      return
    }
    const name = publishForm.name.trim()
    if (!name) {
      setPublishError('技能名称不能为空。')
      return
    }
    setPublishing(true)
    setError('')
    setPublishError('')
    const publishMessageID = `publish-${Date.now()}`
    setMessages((current) => [
      ...current,
      {
        id: publishMessageID,
        role: 'assistant',
        kind: 'publish',
        text: '正在发布技能...',
        running: true,
      },
    ])
    try {
      const result = normalizeActionResponse(
        await request(publishApi, 'post', {
          id: draftID,
          name,
          description: publishForm.description.trim(),
          pack_id: positiveNumber(publishForm.packID),
          cate_id: positiveNumber(publishForm.cateID),
        }),
        '发布完成。',
        '发布失败。'
      )
      const ok = result.status === 1
      setPublished(ok)
      if (ok) {
        setPublishDialogOpen(false)
        schedulePublishReload()
      }
      if (!ok) {
        setPublishError(result.msg)
        setError(result.msg)
      }
      setMessages((current) =>
        current.map((message) =>
          message.id === publishMessageID
            ? {
                ...message,
                text: result.msg,
                running: false,
                error: ok ? '' : result.msg,
              }
            : message
        )
      )
    } catch (currentError: unknown) {
      const message = runtimeErrorMessage(currentError, '发布失败。')
      setPublishError(message)
      setError(message)
      setMessages((current) =>
        current.map((item) =>
          item.id === publishMessageID
            ? {
                ...item,
                text: message,
                running: false,
                error: message,
              }
            : item
        )
      )
    } finally {
      setPublishing(false)
    }
  }

  const schedulePublishReload = () => {
    if (!reloadPageOnPublish) {
      return
    }
    window.setTimeout(() => {
      void reloadStorePageSchema(store)
    }, reloadPageOnPublishDelayMs)
  }

  function reset() {
    runTokenRef.current += 1
    setInput('')
    setMessages([])
    setRunning(false)
    setTested(false)
    setTestPassed(false)
    setPublishing(false)
    setPublished(false)
    setPublishDialogOpen(false)
    setPublishForm(draftPublishForm({}))
    setPublishError('')
    setError('')
    setRequestID('')
    setLastStreamID('0-0')
    setCancelable(false)
    setStopping(false)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault()
      void startTest()
    }
  }

  return (
    <div
      className='flex min-h-0 flex-col gap-3 overflow-hidden'
      style={{ height }}
    >
      <div className='min-h-0 flex-1 space-y-3 overflow-y-auto rounded-md border bg-background p-3'>
        {messages.length === 0 ? (
          <div className='flex h-full min-h-48 items-center justify-center text-center text-sm text-muted-foreground'>
            {emptyText}
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
              <SkillTestMessageContent message={message} />
            </div>
          </div>
        ))}
      </div>

      {error ? (
        <div className='rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive'>
          {error}
        </div>
      ) : null}

      <div className='shrink-0 overflow-hidden rounded-md border bg-background shadow-xs transition-[border-color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/20'>
        <Textarea
          value={input}
          disabled={running || publishing || tested || draftID <= 0}
          placeholder={placeholder}
          className='min-h-20 resize-none border-0 bg-transparent shadow-none focus-visible:border-transparent focus-visible:ring-0'
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <div className='flex items-center justify-between gap-3 border-t px-3 py-2'>
          <div className='min-w-0 truncate text-xs text-muted-foreground'>
            {draftID <= 0
              ? '缺少技能草稿，无法测试。'
              : requestID
                ? `RequestID: ${requestID}${lastStreamID !== '0-0' ? ` / ${lastStreamID}` : ''}`
                : running
                  ? '正在测试技能，结果会显示在上方。'
                  : tested
                    ? '本轮测试已完成；清空后可重新测试。'
                    : '本次只执行一轮测试。'}
          </div>
          <div className='flex shrink-0 items-center gap-2'>
            <Button
              type='button'
              variant='outline'
              size='sm'
              disabled={running || publishing}
              onClick={reset}
            >
              <Trash2 className='size-3.5' />
              清空
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
              disabled={!canStart}
              onClick={() => void startTest()}
            >
              {running ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <Play className='size-4' />
              )}
              开始测试
            </Button>
            <Button
              type='button'
              size='sm'
              disabled={!canPublish}
              title={publishTitle}
              onClick={openPublishDialog}
            >
              {publishing ? (
                <Loader2 className='size-4 animate-spin' />
              ) : (
                <UploadCloud className='size-4' />
              )}
              {published ? '已发布' : '发布'}
            </Button>
          </div>
        </div>
      </div>
      <PublishSettingsDialog
        open={publishDialogOpen}
        form={publishForm}
        options={publishOptions}
        loadingOptions={publishOptionsLoading}
        publishing={publishing}
        error={publishError}
        onOpenChange={(open) => {
          if (!publishing) {
            setPublishDialogOpen(open)
          }
        }}
        onChange={setPublishForm}
        onSubmit={() => void submitPublish()}
      />
    </div>
  )
}

function PublishSettingsDialog({
  open,
  form,
  options,
  loadingOptions,
  publishing,
  error,
  onOpenChange,
  onChange,
  onSubmit,
}: {
  open: boolean
  form: PublishForm
  options: PublishOptions
  loadingOptions: boolean
  publishing: boolean
  error: string
  onOpenChange: (open: boolean) => void
  onChange: (form: PublishForm) => void
  onSubmit: () => void
}) {
  const update = (patch: Partial<PublishForm>) => {
    onChange({ ...form, ...patch })
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='gap-0 overflow-hidden p-0 sm:max-w-xl'>
        <DialogHeader className='border-b px-5 py-4 text-start'>
          <DialogTitle>发布设置</DialogTitle>
          <DialogDescription>
            测试通过的技能内容不会在这里修改；这里只调整发布元信息。
          </DialogDescription>
        </DialogHeader>
        <div className='space-y-4 px-5 py-4'>
          <PublishField label='技能标识'>
            <Input value={form.key} disabled className='font-mono' />
          </PublishField>
          <PublishField label='技能名称' required>
            <Input
              value={form.name}
              disabled={publishing}
              onChange={(event) => update({ name: event.target.value })}
            />
          </PublishField>
          <PublishField label='技能描述'>
            <Textarea
              value={form.description}
              disabled={publishing}
              className='min-h-24 resize-none'
              onChange={(event) =>
                update({ description: event.target.value })
              }
            />
          </PublishField>
          <PublishField label='技能方案'>
            <PublishSelect
              value={form.packID}
              disabled={publishing || loadingOptions}
              options={options.packs}
              placeholder={loadingOptions ? '正在加载...' : '请选择技能方案'}
              onChange={(value) => update({ packID: value })}
            />
          </PublishField>
          <PublishField label='技能分类'>
            <PublishSelect
              value={form.cateID}
              disabled={publishing || loadingOptions}
              options={options.cates}
              placeholder={loadingOptions ? '正在加载...' : '请选择技能分类'}
              onChange={(value) => update({ cateID: value })}
            />
          </PublishField>
          {error ? (
            <div className='rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive'>
              {error}
            </div>
          ) : null}
        </div>
        <div className='flex justify-end gap-2 border-t px-5 py-3'>
          <Button
            type='button'
            variant='outline'
            disabled={publishing}
            onClick={() => onOpenChange(false)}
          >
            取消
          </Button>
          <Button type='button' disabled={publishing} onClick={onSubmit}>
            {publishing ? <Loader2 className='size-4 animate-spin' /> : null}
            保存并发布
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PublishField({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label className='grid gap-2 text-sm font-medium text-foreground'>
      <span>
        {label}
        {required ? <span className='ml-1 text-destructive'>*</span> : null}
      </span>
      {children}
    </label>
  )
}

function PublishSelect({
  value,
  options,
  disabled,
  placeholder,
  onChange,
}: {
  value: string
  options: PublishOption[]
  disabled?: boolean
  placeholder: string
  onChange: (value: string) => void
}) {
  const visibleOptions =
    value && !options.some((option) => option.id === value)
      ? [{ id: value, name: `ID ${value}` }, ...options]
      : options
  return (
    <Select
      value={value || undefined}
      disabled={disabled}
      onValueChange={onChange}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {visibleOptions.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function SkillTestMessageContent({
  message,
}: {
  message: SkillTestMessage
}) {
  if (message.kind === 'test' && message.result) {
    return <SkillTestResultView result={message.result} />
  }
  if (message.kind === 'analysis') {
    return (
      <div className='space-y-2'>
        {message.running && !message.output ? (
          <div className='text-muted-foreground'>
            <Loader2 className='mr-2 inline size-3.5 animate-spin align-[-2px]' />
            {message.text}
          </div>
        ) : (
          <AgentContentOutputView
            output={message.output || assistantTextOutput(message.text)}
            streaming={message.running}
            emptyText='等待智能体分析测试结果。'
          />
        )}
      </div>
    )
  }
  return (
    <div className='whitespace-pre-wrap break-words'>
      {message.running ? (
        <Loader2 className='mr-2 inline size-3.5 animate-spin align-[-2px]' />
      ) : null}
      {message.text}
    </div>
  )
}

function SkillTestResultView({ result }: { result: SkillTestResponse }) {
  const passed = result.status === 1
  const data = result.data
  const test = isPlainRecord(data.test) ? data.test : {}
  const issues = arrayText(data.issues)
  const stdout = valueText(test.stdout)
  const stderr = valueText(test.stderr)
  const runError = valueText(test.error)
  const exitCode = valueText(test.exit_code)
  const duration = valueText(test.duration_ms)
  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2 font-medium'>
        {passed ? (
          <CheckCircle2 className='size-4 text-emerald-600' />
        ) : (
          <XCircle className='size-4 text-destructive' />
        )}
        <span>{result.msg || (passed ? '测试通过' : '测试未通过')}</span>
      </div>
      {issues.length > 0 ? (
        <div className='rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-900'>
          {issues.map((issue) => (
            <div key={issue}>- {issue}</div>
          ))}
        </div>
      ) : null}
      {Object.keys(test).length > 0 ? (
        <div className='grid gap-2 text-xs text-muted-foreground sm:grid-cols-3'>
          <div>脚本：{valueText(test.script) || '自动选择'}</div>
          <div>退出码：{exitCode || '0'}</div>
          <div>耗时：{duration ? `${duration}ms` : '-'}</div>
        </div>
      ) : null}
      <TestOutputBlock title='输出' value={stdout} />
      <TestOutputBlock title='错误输出' value={stderr} />
      <TestOutputBlock title='异常' value={runError} />
    </div>
  )
}

function TestOutputBlock({ title, value }: { title: string; value: string }) {
  if (!value) {
    return null
  }
  return (
    <div className='space-y-1'>
      <div className='text-xs font-medium text-muted-foreground'>{title}</div>
      <pre className='max-h-40 overflow-auto rounded-md bg-background p-2 text-xs leading-5 text-foreground'>
        {value}
      </pre>
    </div>
  )
}

async function runSkillDraftTest(api: string, draftID: number, args: string[]) {
  const response = await request(api, 'post', {
    id: draftID,
    args,
    timeout_seconds: DEFAULT_TIMEOUT_SECONDS,
  })
  return normalizeTestResponse(response)
}

function normalizeTestResponse(response: unknown): SkillTestResponse {
  if (!isPlainRecord(response)) {
    return {
      status: 2,
      msg: '测试失败。',
      data: {},
    }
  }
  const status = Number(response.status || (Number(response.code) === 0 ? 1 : 0))
  return {
    status: status === 1 ? 1 : 2,
    msg:
      valueText(response.msg || response.message) ||
      (status === 1 ? '测试通过。' : '测试失败。'),
    data: isPlainRecord(response.data) ? response.data : {},
  }
}

function normalizeActionResponse(
  response: unknown,
  successMessage: string,
  failureMessage: string
): SkillTestResponse {
  if (!isPlainRecord(response)) {
    return {
      status: 2,
      msg: failureMessage,
      data: {},
    }
  }
  const status = Number(response.status || (Number(response.code) === 0 ? 1 : 0))
  return {
    status: status === 1 ? 1 : 2,
    msg:
      valueText(response.msg || response.message) ||
      (status === 1 ? successMessage : failureMessage),
    data: isPlainRecord(response.data) ? response.data : {},
  }
}

function normalizePublishOptions(response: unknown): PublishOptions {
  if (!isPlainRecord(response)) {
    return { packs: [], cates: [] }
  }
  const data = isPlainRecord(response.data) ? response.data : response
  return {
    packs: publishOptionList(data.packs),
    cates: publishOptionList(data.cates),
  }
}

function publishOptionList(value: unknown): PublishOption[] {
  if (!Array.isArray(value)) {
    return []
  }
  return value
    .map((item) => {
      if (!isPlainRecord(item)) {
        return null
      }
      const id = valueText(item.id)
      const name = valueText(item.name || item.value || item.label)
      return id && name ? { id, name } : null
    })
    .filter((item): item is PublishOption => Boolean(item))
}

function draftPublishForm(draft: Record<string, unknown>): PublishForm {
  return {
    key: valueText(draft.key),
    name: valueText(draft.name),
    description: valueText(draft.description),
    packID: valueText(draft.pack_id || draft.packId || 1),
    cateID: valueText(draft.cate_id || draft.cateId || 1),
  }
}

function buildTestAnalysisPrompt(
  draft: Record<string, unknown>,
  result: SkillTestResponse,
  args: string[]
) {
  return [
    '你是技能创建工程师。下面是真实沙箱测试结果，请只分析这次测试。',
    '要求：',
    '1. 先明确测试是否通过。',
    '2. 如果失败，指出最可能的原因和下一步修改建议。',
    '3. 不要生成技能草稿 patch，不要发布技能，不要编造未出现的输出。',
    '',
    `技能：${valueText(draft.name) || valueText(draft.key) || '未命名技能'}`,
    `测试参数：${args.length > 0 ? args.join(', ') : '无'}`,
    `测试状态：${result.status === 1 ? '通过' : '失败'}`,
    `测试消息：${result.msg}`,
    '测试数据：',
    safeJSONStringify(result.data),
  ].join('\n')
}

function frameOutput(frame: RuntimeStreamFrame<AgentOutput>) {
  const output = normalizeRuntimeFrameOutput(frame?.output, frame)
  return isPlainRecord(output) ? output : null
}

function frameText(frame: RuntimeStreamFrame<AgentOutput>) {
  const output = frameOutput(frame)
  if (!isPlainRecord(output)) {
    return valueText(frame?.msg)
  }
  return (
    valueText(output.text) ||
    valueText(output.content) ||
    valueText(output.message) ||
    valueText(output.result) ||
    valueText(frame?.msg)
  )
}

function assistantTextOutput(text: string): AgentOutput {
  return {
    text,
    content: {
      format: 'markdown',
      text,
    },
  }
}

function compactDraft(draft: Record<string, unknown>) {
  return {
    id: draft.id,
    key: draft.key,
    name: draft.name,
    description: draft.description,
    manifest: draft.manifest,
  }
}

function splitArgs(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

function arrayText(value: unknown) {
  return Array.isArray(value)
    ? value.map((item) => valueText(item)).filter(Boolean)
    : []
}

function safeJSONStringify(value: unknown) {
  try {
    const text = JSON.stringify(value, null, 2)
    return text.length > 6000 ? `${text.slice(0, 6000)}\n...` : text
  } catch {
    return valueText(value)
  }
}

function positiveNumber(value: unknown) {
  const number = Number(value || 0)
  return Number.isFinite(number) && number > 0 ? number : 0
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}
