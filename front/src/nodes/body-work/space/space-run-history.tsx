import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDashed,
  Clock3,
  LocateFixed,
  Loader2,
  RefreshCw,
  X,
  XCircle,
} from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  canvasExecutionErrorMessage,
  canvasRunRawError,
  type CanvasRunRef,
} from "./space-runner";
import { SpaceTooltip } from "./space-tooltip";

export function CanvasRunHistoryDrawer({
  open,
  runs,
  loading,
  error,
  page,
  hasNextPage,
  onOpenChange,
  onRefresh,
  onPreviousPage,
  onNextPage,
  onLocateRun,
}: {
  open: boolean;
  runs: CanvasRunRef[];
  loading: boolean;
  error: string;
  page: number;
  hasNextPage: boolean;
  onOpenChange: (open: boolean) => void;
  onRefresh: () => Promise<unknown> | unknown;
  onPreviousPage: () => Promise<unknown> | unknown;
  onNextPage: () => Promise<unknown> | unknown;
  onLocateRun: (run: CanvasRunRef) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-[92vw] flex-col gap-0 overflow-hidden p-0 sm:max-w-xl"
      >
        <SheetHeader className="border-b px-5 py-4 text-start">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <SheetTitle>运行记录</SheetTitle>
              <SheetDescription>每页展示 20 条画布执行记录。</SheetDescription>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <SpaceTooltip label="刷新运行记录">
                <button
                  type="button"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
                  disabled={loading}
                  onClick={() => void onRefresh()}
                  aria-label="刷新运行记录"
                >
                  {loading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <RefreshCw size={16} />
                  )}
                </button>
              </SpaceTooltip>
              <SpaceTooltip label="关闭运行记录">
                <SheetClose asChild>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    aria-label="关闭运行记录"
                  >
                    <X size={17} />
                  </button>
                </SheetClose>
              </SpaceTooltip>
            </div>
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
                const rawError = canvasRunRawError(run);
                const status = canvasRunStatus(run.status);
                const canLocate = Boolean(String(run.start_node_id || ""));
                return (
                  <section
                    key={canvasRunHistoryKey(run)}
                    className="flex items-start gap-3 px-5 py-4 transition-colors hover:bg-muted/30"
                  >
                    <CanvasRunStatusIcon status={status} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <strong className="truncate text-sm font-medium">
                          {canvasRunTitle(run)}
                        </strong>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatCanvasRunTime(
                            run.updated_at || run.created_at,
                          )}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>{canvasRunStatusLabel(status)}</span>
                        <span>
                          {Number(run.executed || 0)} / {Number(run.total || 0)} 个节点
                        </span>
                        {run.request_id ? (
                          <span className="max-w-56 truncate font-mono">
                            {run.request_id}
                          </span>
                        ) : null}
                      </div>
                      {rawError ? (
                        <p className="mt-2 text-xs leading-5 text-destructive">
                          {canvasExecutionErrorMessage(rawError)}
                        </p>
                      ) : null}
                    </div>
                    {canLocate ? (
                      <SpaceTooltip label="在画布中定位">
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          onClick={() => onLocateRun(run)}
                          aria-label="在画布中定位"
                        >
                          <LocateFixed size={16} />
                        </button>
                      </SpaceTooltip>
                    ) : null}
                  </section>
                );
              })}
            </div>
          )}
        </div>

        <footer className="flex items-center justify-between border-t px-5 py-3">
          <span className="text-xs text-muted-foreground">第 {page} 页</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
              disabled={loading || page <= 1}
              onClick={() => void onPreviousPage()}
            >
              <ChevronLeft size={14} />
              上一页
            </button>
            <button
              type="button"
              className="inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
              disabled={loading || !hasNextPage}
              onClick={() => void onNextPage()}
            >
              下一页
              <ChevronRight size={14} />
            </button>
          </div>
        </footer>
      </SheetContent>
    </Sheet>
  );
}

function CanvasRunStatusIcon({ status }: { status: string }) {
  if (status === "success") {
    return (
      <CheckCircle2
        size={17}
        className="mt-0.5 shrink-0 text-emerald-600"
      />
    );
  }
  if (status === "fail") {
    return <XCircle size={17} className="mt-0.5 shrink-0 text-destructive" />;
  }
  if (status === "running" || status === "pending") {
    return (
      <Loader2
        size={17}
        className="mt-0.5 shrink-0 animate-spin text-primary"
      />
    );
  }
  if (status === "waiting") {
    return <Clock3 size={17} className="mt-0.5 shrink-0 text-amber-600" />;
  }
  return (
    <CircleDashed
      size={17}
      className="mt-0.5 shrink-0 text-muted-foreground"
    />
  );
}

function canvasRunHistoryKey(run: CanvasRunRef) {
  return String(run.execution_id || run.run_id || run.request_id || "");
}

function canvasRunTitle(run: CanvasRunRef) {
  return run.title || (run.single_node ? "节点运行" : "画布运行");
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
