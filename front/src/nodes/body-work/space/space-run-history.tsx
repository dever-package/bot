import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  Clock3,
  LocateFixed,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  canvasExecutionErrorMessage,
  canvasNodeResultRawError,
  canvasRunRawError,
  type CanvasNodeResultRef,
  type CanvasRunRef,
} from "./space-runner";
import type { SpaceCanvasNode } from "./types";

export function CanvasRunHistoryDrawer({
  open,
  runs,
  nodes,
  loading,
  error,
  onOpenChange,
  onRefresh,
  onFocusNode,
}: {
  open: boolean;
  runs: CanvasRunRef[];
  nodes: SpaceCanvasNode[];
  loading: boolean;
  error: string;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => Promise<unknown> | unknown;
  onFocusNode: (nodeId: string) => void;
}) {
  const [selectedRunKey, setSelectedRunKey] = useState("");
  const nodesById = useMemo(
    () =>
      new Map<string, SpaceCanvasNode>(
        nodes.map((node) => [node.id, node] as const),
      ),
    [nodes],
  );

  useEffect(() => {
    if (!open || runs.length === 0) {
      return;
    }
    if (!runs.some((run) => canvasRunHistoryKey(run) === selectedRunKey)) {
      setSelectedRunKey(canvasRunHistoryKey(runs[0]));
    }
  }, [open, runs, selectedRunKey]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex w-[92vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-b px-5 py-4 text-start">
          <div className="flex items-start justify-between gap-4 pr-8">
            <div className="min-w-0">
              <SheetTitle>运行记录</SheetTitle>
              <SheetDescription>最近 20 条画布执行记录。</SheetDescription>
            </div>
            <button
              type="button"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
              disabled={loading}
              onClick={() => void onRefresh()}
              title="刷新运行记录"
              aria-label="刷新运行记录"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <RefreshCw size={15} />
              )}
            </button>
          </div>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {error ? (
            <div className="flex items-start gap-2 border-b bg-destructive/5 px-5 py-3 text-sm text-destructive">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          ) : null}

          {loading && runs.length === 0 ? (
            <div className="flex min-h-40 items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 size={16} className="animate-spin" />
              正在读取运行记录
            </div>
          ) : runs.length === 0 ? (
            <div className="flex min-h-40 flex-col items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock3 size={20} />
              暂无画布运行记录
            </div>
          ) : (
            <div className="divide-y">
              {runs.map((run) => {
                const key = canvasRunHistoryKey(run);
                const selected = key === selectedRunKey;
                const rawError = canvasRunRawError(run);
                const status = canvasRunStatus(run.status);
                return (
                  <section key={key} className="bg-background">
                    <button
                      type="button"
                      className="flex w-full items-start gap-3 px-5 py-4 text-start transition-colors hover:bg-muted/40"
                      onClick={() => setSelectedRunKey(key)}
                      aria-expanded={selected}
                    >
                      <CanvasRunStatusIcon status={status} />
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-3">
                          <strong className="truncate text-sm font-medium">
                            {canvasRunTitle(run, nodesById)}
                          </strong>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {formatCanvasRunTime(
                              run.updated_at || run.created_at,
                            )}
                          </span>
                        </span>
                        <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                          <span>{canvasRunStatusLabel(status)}</span>
                          <span>
                            {Number(run.executed || 0)} /{" "}
                            {Number(run.total || 0)} 个节点
                          </span>
                          {run.request_id ? (
                            <span className="max-w-56 truncate font-mono">
                              {run.request_id}
                            </span>
                          ) : null}
                        </span>
                        {rawError ? (
                          <span className="mt-2 block text-xs leading-5 text-destructive">
                            {canvasExecutionErrorMessage(rawError)}
                          </span>
                        ) : null}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`mt-0.5 shrink-0 text-muted-foreground transition-transform ${selected ? "rotate-180" : ""}`}
                      />
                    </button>

                    {selected ? (
                      <CanvasRunHistoryDetail
                        run={run}
                        nodesById={nodesById}
                        onFocusNode={(nodeId) => {
                          onOpenChange(false);
                          onFocusNode(nodeId);
                        }}
                      />
                    ) : null}
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function CanvasRunHistoryDetail({
  run,
  nodesById,
  onFocusNode,
}: {
  run: CanvasRunRef;
  nodesById: Map<string, SpaceCanvasNode>;
  onFocusNode: (nodeId: string) => void;
}) {
  const rawRunError = canvasRunRawError(run);
  const results = run.node_results || [];
  return (
    <div className="border-t bg-muted/15 px-5 py-3">
      {rawRunError ? (
        <TechnicalErrorDetail error={rawRunError} label="完整错误" />
      ) : null}

      <div className="mt-2 text-xs font-medium text-foreground">节点结果</div>
      {results.length === 0 ? (
        <p className="mt-2 text-xs text-muted-foreground">暂无节点结果。</p>
      ) : (
        <div className="mt-2 divide-y border-y">
          {results.map((result, index) => (
            <CanvasNodeRunRow
              key={`${result.node_key}-${result.node_run_id || index}`}
              result={result}
              node={nodesById.get(result.node_key)}
              planTitle={run.execution_plan?.nodes.find(
                (node) => node.id === result.node_key,
              )?.title}
              onFocusNode={onFocusNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CanvasNodeRunRow({
  result,
  node,
  planTitle,
  onFocusNode,
}: {
  result: CanvasNodeResultRef;
  node?: SpaceCanvasNode;
  planTitle?: string;
  onFocusNode: (nodeId: string) => void;
}) {
  const status = canvasRunStatus(result.status);
  const rawError = canvasNodeResultRawError(result);
  return (
    <div className="py-3">
      <div className="flex items-start gap-2">
        <CanvasRunStatusIcon status={status} compact />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-xs font-medium">
              {node?.title || planTitle || result.node_key}
            </span>
            {node ? (
              <button
                type="button"
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                onClick={() => onFocusNode(result.node_key)}
                title="在画布中定位"
                aria-label="在画布中定位"
              >
                <LocateFixed size={14} />
              </button>
            ) : null}
          </div>
          <div className="mt-0.5 flex flex-wrap gap-x-3 text-[11px] text-muted-foreground">
            <span>{canvasRunStatusLabel(status)}</span>
            {result.request_id ? (
              <span className="max-w-64 truncate font-mono">
                {result.request_id}
              </span>
            ) : null}
          </div>
          {rawError ? (
            <div className="mt-1.5">
              <p className="text-xs leading-5 text-destructive">
                {canvasExecutionErrorMessage(rawError)}
              </p>
              <TechnicalErrorDetail error={rawError} label="技术详情" />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function TechnicalErrorDetail({
  error,
  label,
}: {
  error: string;
  label: string;
}) {
  return (
    <details className="mt-2 text-xs text-muted-foreground">
      <summary className="cursor-pointer select-none hover:text-foreground">
        {label}
      </summary>
      <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap break-all rounded-md bg-muted px-3 py-2 font-mono text-[11px] leading-5 text-foreground">
        {error}
      </pre>
    </details>
  );
}

function CanvasRunStatusIcon({
  status,
  compact = false,
}: {
  status: string;
  compact?: boolean;
}) {
  const size = compact ? 14 : 17;
  if (status === "success") {
    return (
      <CheckCircle2
        size={size}
        className="mt-0.5 shrink-0 text-emerald-600"
      />
    );
  }
  if (status === "fail") {
    return <XCircle size={size} className="mt-0.5 shrink-0 text-destructive" />;
  }
  if (status === "running" || status === "pending") {
    return (
      <Loader2
        size={size}
        className="mt-0.5 shrink-0 animate-spin text-primary"
      />
    );
  }
  if (status === "waiting") {
    return <Clock3 size={size} className="mt-0.5 shrink-0 text-amber-600" />;
  }
  return (
    <CircleDashed
      size={size}
      className="mt-0.5 shrink-0 text-muted-foreground"
    />
  );
}

function canvasRunHistoryKey(run: CanvasRunRef) {
  return String(run.execution_id || run.run_id || run.request_id || "");
}

function canvasRunTitle(
  run: CanvasRunRef,
  nodesById: Map<string, SpaceCanvasNode>,
) {
  const startNodeId = String(run.start_node_id || "");
  return (
    nodesById.get(startNodeId)?.title ||
    run.execution_plan?.nodes.find((node) => node.id === startNodeId)?.title ||
    (run.single_node ? "节点运行" : "画布运行")
  );
}

function canvasRunStatus(status: unknown) {
  const normalized = String(status || "").trim().toLowerCase();
  if (normalized === "error") {
    return "fail";
  }
  if (normalized === "cancelled") {
    return "canceled";
  }
  return normalized;
}

function canvasRunStatusLabel(status: string) {
  const labels: Record<string, string> = {
    success: "成功",
    fail: "失败",
    running: "运行中",
    pending: "排队中",
    waiting: "等待输入",
    canceled: "已取消",
  };
  return labels[status] || "未知状态";
}

function formatCanvasRunTime(value: unknown) {
  const date = new Date(String(value || ""));
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
