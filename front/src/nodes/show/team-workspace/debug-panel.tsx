import { Loader2, Workflow } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AgentInteractionPanel } from "@/components/agent/interaction-panel";
import { EnergonContentView } from "@/components/energon/content-view";
import {
  isStreamTimingRunning,
  StreamTimingBadge,
  useStreamClock,
} from "@/components/stream-timing";
import type {
  DebugApprovalSubmit,
  DebugPendingApproval,
  DebugTarget,
  TeamNode,
} from "./types";
import { RUN_STATUS_PENDING, RUN_STATUS_RUNNING } from "./constants";
import {
  agentTraceByID,
  arrayValue,
  debugNodeDisplayOutput,
  debugNodeStatusLabel,
  debugNodeTiming,
  debugNodeTypeLabel,
  debugRowKey,
  debugSaveNodeNotice,
  debugStatusClass,
  debugVisibleNodeError,
  formatRunTimeRange,
  hasDebugDisplayOutput,
  isDebugActiveStatus,
  isDebugNodeTimingActive,
  runStatusLabel,
  shouldShowRuntimeTiming,
  sortDebugRunRows,
} from "./debug-state";

export function DebugDialog({
  open,
  target,
  prompt,
  running,
  result,
  paramApi,
  pendingApprovalsByNodeKey,
  onOpenChange,
  onPromptChange,
  onRun,
  onSubmitApproval,
}: {
  open: boolean;
  target: DebugTarget;
  prompt: string;
  running: boolean;
  result: any;
  paramApi: string;
  pendingApprovalsByNodeKey: Record<string, DebugPendingApproval>;
  onOpenChange: (open: boolean) => void;
  onPromptChange: (value: string) => void;
  onRun: () => void;
  onSubmitApproval: DebugApprovalSubmit;
}) {
  const title = target === "team" ? "调试" : "调试工作流";
  const status = String(result?.run?.status || result?.status || "");
  const runHint = status
    ? `当前状态：${runStatusLabel(status)}`
    : "调试会先自动保存，并使用当前保存内容运行";
  const emptyHint =
    "输入目标后会先自动保存当前编辑内容，并使用保存后的内容执行；每个节点的执行状态和输出会显示在这里。";
  const submitHint =
    target === "team"
      ? "会先保存当前团队工作流编排，再按保存后的内容逐个执行。"
      : "会先保存当前工作流节点流程，再按节点顺序执行。";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex flex-col overflow-hidden sm:max-w-4xl"
        style={{
          height: "min(82vh, 48rem)",
          maxHeight: "min(82vh, 48rem)",
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-md border bg-muted/20">
            <div className="flex items-center justify-between gap-3 border-b px-3 py-2">
              <div className="text-sm font-medium">运行展示</div>
              <div className="text-xs text-muted-foreground">{runHint}</div>
            </div>
            <div className="relative min-h-0 flex-1">
              {result ? (
                <div className="absolute inset-0 overflow-hidden">
                  <DebugRunDisplay
                    result={result}
                    paramApi={paramApi}
                    pendingApprovalsByNodeKey={pendingApprovalsByNodeKey}
                    onSubmitApproval={onSubmitApproval}
                  />
                </div>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm text-muted-foreground">
                  <span className="max-w-3xl">{emptyHint}</span>
                </div>
              )}
            </div>
          </div>
          <div className="shrink-0 rounded-md border bg-background p-3 shadow-sm">
            <Textarea
              value={prompt}
              disabled={running}
              className="min-h-24 resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
              placeholder="输入这次调试要完成的目标、输入材料或约束..."
              onChange={(event) => onPromptChange(event.target.value)}
            />
            <div className="mt-3 flex items-center justify-between gap-3 border-t pt-3">
              <div className="text-xs text-muted-foreground">{submitHint}</div>
              <Button disabled={running} onClick={onRun}>
                {running ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Workflow className="size-4" />
                )}
                {running ? "调试中" : "开始调试"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DebugRunDisplay({
  result,
  paramApi,
  pendingApprovalsByNodeKey,
  onSubmitApproval,
}: {
  result: any;
  paramApi: string;
  pendingApprovalsByNodeKey: Record<string, DebugPendingApproval>;
  onSubmitApproval: DebugApprovalSubmit;
}) {
  const run = result?.run || {};
  const nodeRuns = sortDebugRunRows(arrayValue(result?.node_runs));
  const agentByID = agentTraceByID(arrayValue(result?.agent_runs));
  const active =
    isDebugActiveStatus(run.status) ||
    nodeRuns.some((row) =>
      isDebugNodeTimingActive(row, agentByID[String(row.agent_run_id)]),
    );
  const now = useStreamClock(active);

  if (result?.error && !result?.run) {
    return (
      <div className="h-full overflow-auto p-4 text-sm text-destructive">
        {String(result.error)}
      </div>
    );
  }

  return (
    <div
      className="h-full space-y-3 overflow-auto p-4 text-sm"
      style={{ maxHeight: "calc(min(82vh, 48rem) - 14rem)" }}
    >
      {nodeRuns.length > 0 ? (
        <div className="space-y-3">
          {nodeRuns.map((row, index) => (
            <DebugNodeRunCard
              key={debugRowKey(row, index)}
              row={row}
              index={index}
              agentTrace={agentByID[String(row.agent_run_id)]}
              approval={pendingApprovalsByNodeKey[String(row?.node_key || "")]}
              paramApi={paramApi}
              now={now}
              onSubmitApproval={onSubmitApproval}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-full min-h-72 items-center justify-center text-center text-sm text-muted-foreground">
          <div className="inline-flex items-center gap-2">
            <Loader2 className="size-3 animate-spin" />
            正在等待节点开始执行...
          </div>
        </div>
      )}
      {run.error ? (
        <div className="rounded-md bg-destructive/10 p-3 text-xs text-destructive">
          {run.error}
        </div>
      ) : null}
    </div>
  );
}

function DebugNodeRunCard({
  row,
  index,
  agentTrace,
  approval,
  paramApi,
  now,
  onSubmitApproval,
}: {
  row: any;
  index: number;
  agentTrace?: any;
  approval?: DebugPendingApproval;
  paramApi: string;
  now: number;
  onSubmitApproval: DebugApprovalSubmit;
}) {
  const title = row.node_name || row.node_key || `节点 ${index + 1}`;
  const nodeType = String(row.node_type || "");
  const output = debugNodeDisplayOutput(row, agentTrace);
  const timing = shouldShowRuntimeTiming(nodeType)
    ? debugNodeTiming(row, agentTrace)
    : undefined;
  const active = isDebugNodeTimingActive(row, agentTrace);
  const saveNotice = nodeType === "save" ? debugSaveNodeNotice(row.output) : "";
  const visibleError = debugVisibleNodeError(row);

  return (
    <article className="rounded-md border bg-background p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-medium">
            {index + 1}. {title}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">
            {debugNodeTypeLabel(nodeType)} ·{" "}
            {formatRunTimeRange(row.started_at, row.finished_at)}
          </div>
        </div>
        {timing ? (
          <StreamTimingBadge timing={timing} now={now} className="max-w-full" />
        ) : (
          <DebugStatusBadge status={row.status} nodeType={nodeType} />
        )}
        {visibleError ? (
          <div className="basis-full rounded bg-destructive/10 p-2 text-xs text-destructive">
            {visibleError}
          </div>
        ) : null}
      </div>

      {saveNotice ? (
        <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          {saveNotice}
        </div>
      ) : null}

      {approval ? (
        <div className="mt-3 overflow-hidden rounded-md border border-amber-200 bg-amber-50/45">
          <AgentInteractionPanel
            interaction={approval.interaction}
            paramApi={paramApi}
            layout="inline"
            onSubmit={(result) => onSubmitApproval(approval, result)}
          />
        </div>
      ) : null}

      <div className="mt-3 rounded-md border bg-muted/15 p-3">
        {hasDebugDisplayOutput(output) ? (
          <EnergonContentView output={output} emptyText="暂无节点输出。" />
        ) : active ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            正在等待节点输出...
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">暂无节点输出。</div>
        )}
      </div>
    </article>
  );
}

function DebugStatusBadge({
  status,
  nodeType,
}: {
  status?: string;
  nodeType?: string;
}) {
  const current = String(status || RUN_STATUS_PENDING);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs",
        debugStatusClass(current),
      )}
    >
      {current === RUN_STATUS_RUNNING ? (
        <Loader2 className="size-3 animate-spin" />
      ) : null}
      {debugNodeStatusLabel(current, nodeType)}
    </span>
  );
}

export function DebugNodeResultDialog({
  open,
  nodeKey,
  nodes,
  result,
  approval,
  paramApi,
  onOpenChange,
  onSubmitApproval,
}: {
  open: boolean;
  nodeKey: string;
  nodes: TeamNode[];
  result: any;
  approval?: DebugPendingApproval;
  paramApi: string;
  onOpenChange: (open: boolean) => void;
  onSubmitApproval: DebugApprovalSubmit;
}) {
  const node = nodes.find((item) => item.node_key === nodeKey);
  const resultNodeRuns = sortDebugRunRows(arrayValue(result?.node_runs));
  const row = resultNodeRuns.find(
    (item) => String(item?.node_key || "") === nodeKey,
  );
  const agentByID = agentTraceByID(arrayValue(result?.agent_runs));
  const agentTrace = row?.agent_run_id
    ? agentByID[String(row.agent_run_id)]
    : undefined;
  const nodeType = String(row?.node_type || node?.type || "");
  const output =
    row && !approval ? debugNodeDisplayOutput(row, agentTrace) : undefined;
  const saveNotice =
    nodeType === "save" && row ? debugSaveNodeNotice(row.output) : "";
  const timing =
    row && shouldShowRuntimeTiming(nodeType)
      ? debugNodeTiming(row, agentTrace, { node, nodeRuns: resultNodeRuns })
      : undefined;
  const active =
    isStreamTimingRunning(timing) ||
    Boolean(row && isDebugActiveStatus(row.status));
  const now = useStreamClock(active);
  const visibleError = debugVisibleNodeError(row);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex max-w-none flex-col gap-0 overflow-hidden p-0"
        style={{
          width: "min(56rem, calc(100vw - 2rem))",
          height: "min(82vh, 48rem)",
        }}
      >
        <DialogHeader className="shrink-0 border-b px-6 py-4">
          <DialogTitle className="min-w-0 truncate pr-7">
            {node?.name || row?.node_name || nodeKey || "节点结果"}
          </DialogTitle>
        </DialogHeader>
        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto bg-background px-6 py-4">
          {timing || row ? (
            <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md border bg-muted/15 px-3 py-2">
              <span className="text-xs text-muted-foreground">执行状态</span>
              {timing ? (
                <StreamTimingBadge
                  timing={timing}
                  now={now}
                  className="max-w-full"
                />
              ) : (
                <DebugStatusBadge status={row?.status} nodeType={nodeType} />
              )}
            </div>
          ) : null}
          {visibleError ? (
            <div className="mb-3 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {visibleError}
            </div>
          ) : null}
          {saveNotice ? (
            <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {saveNotice}
            </div>
          ) : null}
          {approval ? (
            <div className="mb-3 overflow-hidden rounded-md border border-amber-200 bg-amber-50/45">
              <AgentInteractionPanel
                interaction={approval.interaction}
                paramApi={paramApi}
                layout="inline"
                onSubmit={(result) => onSubmitApproval(approval, result)}
              />
            </div>
          ) : null}
          {approval ? null : hasDebugDisplayOutput(output) ? (
            <EnergonContentView
              output={output}
              emptyText="暂无节点输出。"
              className="min-w-0"
            />
          ) : active ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              节点正在执行，等待输出...
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              这个节点还没有输出。
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
