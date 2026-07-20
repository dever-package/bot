import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  BadgeCheck,
  ChevronDown,
  FileClock,
  LoaderCircle,
  ReceiptText,
  UserRound,
  WalletCards,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@dever/front-plugin";
import {
  checkoutPointPackage,
  checkoutSubscription,
  loadAccountOverview,
  pollAccountOrder,
  type AccountOrder,
  type AccountOverview,
} from "./workbench-account-api";
import {
  accountErrorMessage,
  accountPointsToMoneyMicros,
  formatAccountDate,
  formatAccountMoney,
  formatAccountNumber,
} from "./workbench-account-format";
import {
  AccountPlansView,
  AccountPointPackagesView,
} from "./workbench-account-purchase";
import {
  AccountOrdersView,
  AccountPointLogsView,
} from "./workbench-account-records";
import { AccountError, AccountLoading } from "./workbench-account-state";
import { WorkbenchPicker } from "./workbench-picker";
import "./workbench-account.css";

type AccountView = "plans" | "points" | "orders" | "logs";

type CheckoutIntent = {
  key: string;
  title: string;
  detail: string;
  pointAmount: number;
  pointName: string;
  payAmountMicros: number;
  paymentUnavailable?: boolean;
  action: () => Promise<AccountOrder>;
};

export function WorkbenchAccountCenter({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [view, setView] = useState<AccountView>("plans");
  const [overview, setOverview] = useState<AccountOverview | null>(null);
  const [activeIdentityID, setActiveIdentityID] = useState(0);
  const [activePointConfigID, setActivePointConfigID] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const [busyKey, setBusyKey] = useState("");
  const [checkoutIntent, setCheckoutIntent] = useState<CheckoutIntent | null>(null);
  const actionInFlight = useRef(false);

  const reload = useCallback(() => setRevision((current) => current + 1), []);

  useEffect(() => {
    if (!open) {
      return;
    }
    let active = true;
    setLoading(true);
    setError("");
    loadAccountOverview()
      .then((next) => {
        if (!active) {
          return;
        }
        setOverview(next);
        setActiveIdentityID((current) =>
          next.catalog.some((identity) => identity.id === current)
            ? current
            : next.catalog[0]?.id || 0,
        );
        setActivePointConfigID((current) =>
          next.pointAccounts.some((account) => account.pointConfigID === current)
            ? current
            : next.pointAccounts[0]?.pointConfigID || 0,
        );
      })
      .catch((currentError) => {
        if (active) {
          setError(accountErrorMessage(currentError, "加载账户信息失败"));
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [open, revision]);

  const activePointAccount = useMemo(
    () =>
      overview?.pointAccounts.find(
        (account) => account.pointConfigID === activePointConfigID,
      ) || overview?.pointAccounts[0] || null,
    [activePointConfigID, overview?.pointAccounts],
  );
  const currentPointConfigID = activePointAccount?.pointConfigID || 0;
  const currentPointName = activePointAccount?.name || "积分";
  const scopedOverview = useMemo(
    () =>
      overview
        ? {
            ...overview,
            subscriptions: overview.subscriptions.filter(
              (subscription) =>
                resolveSubscriptionPointConfigID(subscription, overview) ===
                currentPointConfigID,
            ),
            catalog: overview.catalog.filter(
              (identity) => identity.pointConfig.id === currentPointConfigID,
            ),
            pointPackages: overview.pointPackages.filter(
              (pointPackage) =>
                pointPackage.pointConfig.id === currentPointConfigID,
            ),
          }
        : null,
    [currentPointConfigID, overview],
  );
  const activeIdentity = useMemo(
    () =>
      scopedOverview?.catalog.find(
        (identity) => identity.id === activeIdentityID,
      ) || scopedOverview?.catalog[0] || null,
    [activeIdentityID, scopedOverview?.catalog],
  );

  const executeOrder = useCallback(
    async (key: string, action: () => Promise<AccountOrder>) => {
      if (actionInFlight.current) {
        return;
      }
      actionInFlight.current = true;
      setBusyKey(key);
      try {
        const order = await action();
        if (order.paymentURL) {
          window.open(order.paymentURL, "_blank", "noopener,noreferrer");
          toast.info("支付页面已打开，完成后可在订单记录中查看状态");
          void pollAccountOrder(order)
            .then((latest) => {
              if (latest.status === "completed") {
                toast.success("支付完成，账户权益已更新");
                reload();
              }
            })
            .catch(() => undefined);
        } else if (order.status === "completed") {
          toast.success("操作已完成");
        }
        reload();
      } catch (currentError) {
        toast.error(accountErrorMessage(currentError, "账户操作失败"));
      } finally {
        actionInFlight.current = false;
        setBusyKey("");
      }
    },
    [reload],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        layerClassName="hb-account-layer"
        className="hb-account-dialog !fixed !left-0 !top-0 !h-[100dvh] !max-h-[100dvh] !w-screen !max-w-none !translate-x-0 !translate-y-0 !gap-0 !overflow-hidden !rounded-none !border-0 !p-0 shadow-none sm:!max-w-none"
        style={{
          position: "fixed",
          inset: 0,
          left: 0,
          top: 0,
          width: "100vw",
          maxWidth: "none",
          height: "100dvh",
          maxHeight: "100dvh",
          transform: "none",
          translate: "0 0",
          display: "flex",
          flexDirection: "column",
          gap: 0,
          padding: 0,
          border: 0,
          borderRadius: 0,
          boxSizing: "border-box",
          pointerEvents: "auto",
        }}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>积分与订阅中心</DialogTitle>
          <DialogDescription>查看积分、订阅计划、订单与积分明细。</DialogDescription>
        </DialogHeader>
        <div className="hb-account-shell">
          <AccountHeader
            overview={scopedOverview}
            view={view}
            activePointConfigID={currentPointConfigID}
            pointName={currentPointName}
            onViewChange={setView}
            onPointConfigChange={setActivePointConfigID}
            onClose={() => onOpenChange(false)}
          />
          <main className="hb-account-main">
            {loading && !overview ? <AccountLoading /> : null}
            {!loading && error ? (
              <AccountError message={error} onRetry={reload} />
            ) : null}
            {scopedOverview && !error ? (
              <>
                {view === "plans" ? (
                  <AccountPlansView
                    overview={scopedOverview}
                    activeIdentity={activeIdentity}
                    activeIdentityID={activeIdentity?.id || 0}
                    pointName={currentPointName}
                    busyKey={busyKey}
                    onIdentityChange={setActiveIdentityID}
                    onCheckout={(plan) => {
                      const balance =
                        scopedOverview.pointAccounts.find(
                          (account) =>
                            account.pointConfigID === activeIdentity?.pointConfig.id,
                        )?.availableBalance || 0;
                      const shortage = Math.max(plan.checkoutPoints - balance, 0);
                      setCheckoutIntent({
                        key: `plan-${plan.id}`,
                        title: `${activeIdentity?.name || "订阅"} · ${plan.name}`,
                        detail: activeIdentity?.currentLevelID
                          ? "方案变更将立即生效"
                          : "开通订阅方案",
                        pointAmount: plan.checkoutPoints,
                        pointName: activeIdentity?.pointConfig.name || "积分",
                        payAmountMicros: accountPointsToMoneyMicros(
                          shortage,
                          activeIdentity?.pointConfig.exchangeRate || 0,
                        ),
                        paymentUnavailable:
                          shortage > 0 &&
                          (activeIdentity?.pointConfig.exchangeRate || 0) <= 0,
                        action: () => checkoutSubscription(plan.id),
                      });
                    }}
                  />
                ) : null}
                {view === "points" ? (
                  <AccountPointPackagesView
                    overview={scopedOverview}
                    pointName={currentPointName}
                    busyKey={busyKey}
                    onCheckout={(item) =>
                      setCheckoutIntent({
                        key: `package-${item.id}`,
                        title: item.name,
                        detail: `到账 ${formatAccountNumber(item.pointAmount + item.bonusAmount)} ${item.pointConfig.name}`,
                        pointAmount: item.pointAmount + item.bonusAmount,
                        pointName: item.pointConfig.name,
                        payAmountMicros: item.payAmountMicros,
                        action: () => checkoutPointPackage(item.id),
                      })
                    }
                  />
                ) : null}
                {view === "orders" ? (
                  <AccountOrdersView
                    resetKey={revision}
                    pointConfigID={currentPointConfigID}
                    pointName={currentPointName}
                    busyKey={busyKey}
                    onAction={(key, action) => void executeOrder(key, action)}
                  />
                ) : null}
                {view === "logs" ? (
                  <AccountPointLogsView
                    resetKey={revision}
                    pointConfigID={currentPointConfigID}
                    pointName={currentPointName}
                  />
                ) : null}
              </>
            ) : null}
          </main>
        </div>
      </DialogContent>
      <CheckoutConfirm
        intent={checkoutIntent}
        busy={Boolean(busyKey)}
        onClose={() => setCheckoutIntent(null)}
        onConfirm={() => {
          if (!checkoutIntent) {
            return;
          }
          const current = checkoutIntent;
          setCheckoutIntent(null);
          void executeOrder(current.key, current.action);
        }}
      />
    </Dialog>
  );
}

function AccountHeader({
  overview,
  view,
  activePointConfigID,
  pointName,
  onViewChange,
  onPointConfigChange,
  onClose,
}: {
  overview: AccountOverview | null;
  view: AccountView;
  activePointConfigID: number;
  pointName: string;
  onViewChange: (view: AccountView) => void;
  onPointConfigChange: (pointConfigID: number) => void;
  onClose: () => void;
}) {
  const views: Array<{ key: AccountView; label: string; icon: LucideIcon }> = [
    { key: "plans", label: "订阅计划", icon: BadgeCheck },
    { key: "points", label: `购买${pointName}`, icon: WalletCards },
    { key: "orders", label: `${pointName}订单`, icon: ReceiptText },
    { key: "logs", label: `${pointName}明细`, icon: FileClock },
  ];
  const expiresAt = overview ? nearestSubscriptionExpiry(overview) : "";
  return (
    <header className="hb-account-header">
      <div className="hb-account-user">
        <span className="hb-account-avatar" aria-hidden="true">
          <UserRound />
        </span>
        <div>
          <strong>{overview?.user.name || "账户中心"}</strong>
          {overview ? (
            <div className="hb-account-user-meta">
              {overview.pointAccounts.length > 0 ? (
                <div className="hb-account-point-picker">
                  <WorkbenchPicker
                    value={activePointConfigID}
                    ariaLabel="切换积分账户"
                    options={overview.pointAccounts.map((account) => ({
                      id: account.pointConfigID,
                      name: `${formatAccountNumber(account.balance)} ${account.name}`,
                    }))}
                    onValueChange={onPointConfigChange}
                  />
                </div>
              ) : (
                <span>0 积分</span>
              )}
              <span aria-hidden="true">·</span>
              <AccountSubscriptionMenu overview={overview} />
              {expiresAt ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="hb-account-user-expiry">
                    最近到期 {expiresAt}
                  </span>
                </>
              ) : null}
            </div>
          ) : (
            <span className="hb-account-user-placeholder">积分与订阅</span>
          )}
        </div>
      </div>
      <nav className="hb-account-nav" aria-label="账户中心导航">
        {views.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              type="button"
              className={view === item.key ? "is-active" : ""}
              onClick={() => onViewChange(item.key)}
            >
              <Icon />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <button
        type="button"
        className="hb-account-close"
        title="关闭"
        aria-label="关闭账户中心"
        onClick={onClose}
      >
        <X />
      </button>
    </header>
  );
}

function AccountSubscriptionMenu({ overview }: { overview: AccountOverview }) {
  if (overview.subscriptions.length === 0) {
    return <span className="hb-account-subscription-empty">0 个有效订阅</span>;
  }
  return (
    <details className="hb-account-subscription-menu">
      <summary
        className="hb-account-subscription-trigger"
        aria-label={`查看 ${overview.subscriptions.length} 个有效订阅`}
      >
        <span>{overview.subscriptions.length} 个有效订阅</span>
        <ChevronDown />
      </summary>
      <div className="hb-account-subscription-popover">
        <strong>有效订阅</strong>
        <div className="hb-account-subscription-list">
          {overview.subscriptions.map((subscription) => (
            <div key={subscription.id} className="hb-account-subscription-row">
              <div>
                <strong>{subscription.identityName || "订阅身份"}</strong>
                <span>{subscription.levelName || "已订阅"}</span>
              </div>
              <small>
                有效期至 {formatAccountDate(subscription.expiredAt)}
              </small>
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}

function nearestSubscriptionExpiry(overview: AccountOverview) {
  const expiresAt = overview.subscriptions
    .map((subscription) => subscription.expiredAt)
    .filter(Boolean)
    .sort()[0];
  return expiresAt ? formatAccountDate(expiresAt) : "";
}

function resolveSubscriptionPointConfigID(
  subscription: AccountOverview["subscriptions"][number],
  overview: AccountOverview,
) {
  if (subscription.pointConfigID > 0) {
    return subscription.pointConfigID;
  }
  return (
    overview.catalog.find(
      (identity) => identity.id === subscription.identityID,
    )?.pointConfig.id || 0
  );
}

function CheckoutConfirm({
  intent,
  busy,
  onClose,
  onConfirm,
}: {
  intent: CheckoutIntent | null;
  busy: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog
      open={Boolean(intent)}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="hb-account-confirm sm:max-w-md">
        <DialogHeader>
          <DialogTitle>确认购买</DialogTitle>
          <DialogDescription>{intent?.detail || "确认当前账户操作"}</DialogDescription>
        </DialogHeader>
        {intent ? (
          <div className="hb-account-confirm-detail">
            <strong>{intent.title}</strong>
            <dl>
              <div>
                <dt>积分</dt>
                <dd>
                  {formatAccountNumber(intent.pointAmount)} {intent.pointName}
                </dd>
              </div>
              <div>
                <dt>需支付</dt>
                <dd>
                  {intent.paymentUnavailable
                    ? "支付换算未配置"
                    : intent.payAmountMicros > 0
                    ? formatAccountMoney(intent.payAmountMicros)
                    : "使用积分余额"}
                </dd>
              </div>
            </dl>
          </div>
        ) : null}
        <DialogFooter>
          <Button variant="outline" disabled={busy} onClick={onClose}>
            取消
          </Button>
          <Button disabled={busy || Boolean(intent?.paymentUnavailable)} onClick={onConfirm}>
            {busy ? <LoaderCircle className="animate-spin" /> : null}
            确认
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
