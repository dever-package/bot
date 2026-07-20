import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  BadgeCheck,
  ChevronRight,
  Coins,
  LoaderCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "@dever/front-plugin";
import {
  cancelAccountOrder,
  loadAccountOrders,
  loadAccountPointLogs,
  retryAccountOrder,
  type AccountCursorPage,
  type AccountOrder,
  type AccountPointLog,
} from "./workbench-account-api";
import {
  accountErrorMessage,
  formatAccountDateTime,
  formatAccountNumber,
} from "./workbench-account-format";
import {
  AccountEmpty,
  AccountError,
  AccountLoading,
} from "./workbench-account-state";

type CursorPageState<T> = {
  items: T[];
  cursor: string;
  loading: boolean;
  error: string;
  reload: () => void;
  loadMore: () => void;
};

export function AccountOrdersView({
  resetKey,
  pointConfigID,
  pointName,
  busyKey,
  onAction,
}: {
  resetKey: number;
  pointConfigID: number;
  pointName: string;
  busyKey: string;
  onAction: (key: string, action: () => Promise<AccountOrder>) => void;
}) {
  const loader = usePointCursorLoader(pointConfigID, loadAccountOrders);
  const page = useCursorPage<AccountOrder>(resetKey, loader);
  return (
    <section className="hb-account-section">
      <div className="hb-account-section-heading">
        <div>
          <h2>{pointName}订单</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={page.loading}
          onClick={page.reload}
        >
          <RefreshCw className={page.loading ? "animate-spin" : ""} />
          刷新
        </Button>
      </div>
      <AccountCursorState page={page} emptyText={`暂无${pointName}订单`}>
        <div className="hb-account-record-list">
          {page.items.map((order) => (
            <article
              key={`${order.type}-${order.id}`}
              className="hb-account-record"
            >
              <span className={`hb-account-record-mark is-${order.type}`}>
                {order.type === "identity" ? <BadgeCheck /> : <Coins />}
              </span>
              <div className="hb-account-record-copy">
                <div>
                  <strong>{order.title}</strong>
                  <AccountStatusLabel status={order.status} />
                </div>
                <p>
                  {formatAccountNumber(order.totalPoints)}{" "}
                  {order.pointName || pointName} ·{" "}
                  {formatAccountDateTime(order.createdAt)}
                </p>
                {order.error ? <small>{order.error}</small> : null}
              </div>
              <div className="hb-account-record-actions">
                {order.paymentURL && order.status === "paying" ? (
                  <Button
                    size="sm"
                    onClick={() =>
                      window.open(order.paymentURL, "_blank", "noopener,noreferrer")
                    }
                  >
                    继续支付
                  </Button>
                ) : null}
                {order.canRetry ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={Boolean(busyKey)}
                    onClick={() =>
                      onAction(`retry-${order.type}-${order.id}`, () =>
                        retryAccountOrder(order),
                      )
                    }
                  >
                    {busyKey === `retry-${order.type}-${order.id}` ? (
                      <LoaderCircle className="animate-spin" />
                    ) : (
                      <RefreshCw />
                    )}
                    重试
                  </Button>
                ) : null}
                {order.canCancel ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={Boolean(busyKey)}
                    onClick={() =>
                      onAction(`cancel-${order.type}-${order.id}`, () =>
                        cancelAccountOrder(order),
                      )
                    }
                  >
                    取消
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </AccountCursorState>
    </section>
  );
}

export function AccountPointLogsView({
  resetKey,
  pointConfigID,
  pointName,
}: {
  resetKey: number;
  pointConfigID: number;
  pointName: string;
}) {
  const loader = usePointCursorLoader(pointConfigID, loadAccountPointLogs);
  const page = useCursorPage<AccountPointLog>(resetKey, loader);
  return (
    <section className="hb-account-section">
      <div className="hb-account-section-heading">
        <div>
          <h2>{pointName}明细</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={page.loading}
          onClick={page.reload}
        >
          <RefreshCw className={page.loading ? "animate-spin" : ""} />
          刷新
        </Button>
      </div>
      <AccountCursorState page={page} emptyText={`暂无${pointName}明细`}>
        <div className="hb-account-record-list">
          {page.items.map((log) => {
            const increase = log.changeType === "increase";
            return (
              <article key={log.id} className="hb-account-record">
                <span
                  className={`hb-account-record-mark ${increase ? "is-increase" : "is-consume"}`}
                >
                  <Coins />
                </span>
                <div className="hb-account-record-copy">
                  <div>
                    <strong>
                      {log.remark ||
                        (increase ? `${pointName}增加` : `${pointName}消费`)}
                    </strong>
                  </div>
                  <p>
                    {log.pointName} · {formatAccountDateTime(log.createdAt)} · 余额{" "}
                    {formatAccountNumber(log.balanceAfter)}
                  </p>
                </div>
                <strong
                  className={
                    increase ? "hb-account-positive" : "hb-account-negative"
                  }
                >
                  {increase ? "+" : "-"}
                  {formatAccountNumber(log.amount)}
                </strong>
              </article>
            );
          })}
        </div>
      </AccountCursorState>
    </section>
  );
}

function usePointCursorLoader<T>(
  pointConfigID: number,
  loader: (
    pointConfigID: number,
    cursor?: string,
    limit?: number,
  ) => Promise<AccountCursorPage<T>>,
) {
  return useCallback(
    (cursor = "", limit = 20) =>
      pointConfigID > 0
        ? loader(pointConfigID, cursor, limit)
        : Promise.resolve({ items: [], nextCursor: "" }),
    [loader, pointConfigID],
  );
}

function useCursorPage<T>(
  resetKey: number,
  loader: (cursor?: string, limit?: number) => Promise<AccountCursorPage<T>>,
): CursorPageState<T> {
  const [items, setItems] = useState<T[]>([]);
  const [cursor, setCursor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    async (nextCursor: string, append: boolean) => {
      setLoading(true);
      setError("");
      try {
        const next = await loader(nextCursor, 20);
        setItems((current) => (append ? [...current, ...next.items] : next.items));
        setCursor(next.nextCursor);
      } catch (currentError) {
        setError(accountErrorMessage(currentError, "加载记录失败"));
      } finally {
        setLoading(false);
      }
    },
    [loader],
  );

  useEffect(() => {
    setItems([]);
    setCursor("");
    void load("", false);
  }, [load, resetKey]);

  return {
    items,
    cursor,
    loading,
    error,
    reload: () => void load("", false),
    loadMore: () => void load(cursor, true),
  };
}

function AccountCursorState<T>({
  page,
  emptyText,
  children,
}: {
  page: CursorPageState<T>;
  emptyText: string;
  children: ReactNode;
}) {
  if (page.loading && page.items.length === 0) {
    return <AccountLoading compact />;
  }
  if (page.error && page.items.length === 0) {
    return <AccountError message={page.error} onRetry={page.reload} compact />;
  }
  if (page.items.length === 0) {
    return <AccountEmpty text={emptyText} />;
  }
  return (
    <>
      {children}
      {page.cursor ? (
        <div className="hb-account-load-more">
          <Button variant="outline" disabled={page.loading} onClick={page.loadMore}>
            {page.loading ? <LoaderCircle className="animate-spin" /> : <ChevronRight />}
            {page.loading ? "加载中" : "加载更多"}
          </Button>
        </div>
      ) : null}
      {page.error ? <p className="hb-account-inline-error">{page.error}</p> : null}
    </>
  );
}

function AccountStatusLabel({ status }: { status: string }) {
  const labels: Record<string, string> = {
    pending_payment: "待支付",
    paying: "支付中",
    paid: "已支付",
    fulfilling: "处理中",
    completed: "已完成",
    failed: "失败",
    canceled: "已取消",
  };
  return <span className={`hb-account-status is-${status}`}>{labels[status] || status}</span>;
}
