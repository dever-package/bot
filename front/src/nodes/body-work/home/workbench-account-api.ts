import { joinSiteApi, request } from "@dever/front-plugin";
import {
  asResponseRows as toRows,
  responsePositiveNumber as numberValue,
  responseText as textValue,
  successfulResponseData as responseData,
} from "../shared/api-response";

export type AccountPointConfig = {
  id: number;
  name: string;
  symbol: string;
  symbolPosition: number;
  exchangeRate: number;
};

export type AccountPointBalance = {
  id: number;
  pointConfigID: number;
  name: string;
  symbol: string;
  symbolPosition: number;
  balance: number;
  availableBalance: number;
};

export type AccountSubscription = {
  id: number;
  identityID: number;
  pointConfigID: number;
  identityName: string;
  levelID: number;
  levelName: string;
  level: number;
  cardNo: string;
  expiredAt: string;
};

export type AccountPeriodicBenefit = {
  pointName: string;
  pointAmount: number;
  cycleDays: number;
  limitTimes: number;
};

export type AccountBillingBenefit = {
  scope: string;
  saleRatio: string;
};

export type AccountBenefitDescription = {
  icon: string;
  text: string;
};

export type AccountPlan = {
  id: number;
  name: string;
  level: number;
  durationDays: number;
  payType: number;
  basePoints: number;
  checkoutPoints: number;
  payAmountMicros: number;
  benefitDescriptions: AccountBenefitDescription[];
  periodicBenefits: AccountPeriodicBenefit[];
  billingBenefits: AccountBillingBenefit[];
};

export type AccountIdentityCatalog = {
  id: number;
  name: string;
  pointConfig: AccountPointConfig;
  levels: AccountPlan[];
  currentLevelID: number;
  currentExpiredAt: string;
};

export type AccountPointPackage = {
  id: number;
  name: string;
  pointConfig: AccountPointConfig;
  pointAmount: number;
  bonusAmount: number;
  payAmountMicros: number;
};

export type AccountOverview = {
  user: { id: number; name: string; account: string };
  pointAccounts: AccountPointBalance[];
  subscriptions: AccountSubscription[];
  catalog: AccountIdentityCatalog[];
  pointPackages: AccountPointPackage[];
};

export type AccountOrder = {
  id: number;
  type: "identity" | "point";
  orderNo: string;
  pointConfigID: number;
  pointName: string;
  title: string;
  status: string;
  action: string;
  totalPoints: number;
  rechargePoints: number;
  bonusPoints: number;
  payAmountMicros: number;
  currency: string;
  paymentURL: string;
  error: string;
  targetExpiredAt: string;
  createdAt: string;
  paidAt: string;
  fulfilledAt: string;
  canCancel: boolean;
  canRetry: boolean;
};

export type AccountPointLog = {
  id: number;
  pointConfigID: number;
  pointName: string;
  pointSymbol: string;
  changeType: string;
  source: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  remark: string;
  createdAt: string;
};

export type AccountCursorPage<T> = {
  items: T[];
  nextCursor: string;
};

export async function loadAccountOverview(): Promise<AccountOverview> {
  const result = await request(joinSiteApi("account/overview"), "get");
  const data = responseData(result, "加载账户信息失败");
  return {
    user: {
      id: numberValue(data.user?.id),
      name: textValue(data.user?.name) || "用户",
      account: textValue(data.user?.account),
    },
    pointAccounts: toRows(data.point_accounts)
      .map(normalizePointBalance)
      .filter((item) => item.pointConfigID > 0),
    subscriptions: toRows(data.subscriptions)
      .map(normalizeSubscription)
      .filter((item) => item.identityID > 0),
    catalog: toRows(data.catalog)
      .map(normalizeIdentityCatalog)
      .filter((item) => item.id > 0 && item.levels.length > 0),
    pointPackages: toRows(data.point_packages)
      .map(normalizePointPackage)
      .filter((item) => item.id > 0),
  };
}

export async function loadAccountPointLogs(
  pointConfigID: number,
  cursor = "",
  limit = 20,
): Promise<AccountCursorPage<AccountPointLog>> {
  const result = await request(joinSiteApi("account/point_logs"), "get", {
    point_config_id: pointConfigID,
    cursor: cursor || undefined,
    limit,
  });
  const data = responseData(result, "加载积分明细失败");
  return {
    items: toRows(data.items).map(normalizePointLog).filter((item) => item.id > 0),
    nextCursor: textValue(data.next_cursor),
  };
}

export async function loadAccountOrders(
  pointConfigID: number,
  cursor = "",
  limit = 20,
): Promise<AccountCursorPage<AccountOrder>> {
  const result = await request(joinSiteApi("account/orders"), "get", {
    point_config_id: pointConfigID,
    cursor: cursor || undefined,
    limit,
  });
  const data = responseData(result, "加载订单记录失败");
  return {
    items: toRows(data.items).map(normalizeOrder).filter((item) => item.id > 0),
    nextCursor: textValue(data.next_cursor),
  };
}

export async function checkoutSubscription(levelID: number) {
  return accountMutation("subscription_checkout", {
    level_id: levelID,
    request_id: newRequestID(),
  });
}

export async function checkoutPointPackage(packageID: number) {
  return accountMutation("point_checkout", {
    package_id: packageID,
    request_id: newRequestID(),
  });
}

export async function cancelAccountOrder(order: AccountOrder) {
  return accountMutation("order_cancel", {
    type: order.type,
    order_no: order.orderNo,
  });
}

export async function retryAccountOrder(order: AccountOrder) {
  return accountMutation("order_retry", {
    type: order.type,
    order_no: order.orderNo,
  });
}

export async function loadAccountOrderStatus(order: AccountOrder) {
  const result = await request(joinSiteApi("account/order_status"), "get", {
    type: order.type,
    order_no: order.orderNo,
  });
  return normalizeOrder(responseData(result, "加载订单状态失败"));
}

export async function pollAccountOrder(
  order: AccountOrder,
  attempts = 30,
  interval = 2000,
) {
  let current = order;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (!["pending_payment", "paying", "paid", "fulfilling"].includes(current.status)) {
      return current;
    }
    await wait(interval);
    current = await loadAccountOrderStatus(current);
  }
  return current;
}

async function accountMutation(path: string, payload: Record<string, unknown>) {
  const result = await request(joinSiteApi(`account/${path}`), "post", payload);
  return normalizeOrder(responseData(result, "账户操作失败"));
}

function normalizePointConfig(value: any): AccountPointConfig {
  return {
    id: numberValue(value?.id),
    name: textValue(value?.name) || "积分",
    symbol: textValue(value?.symbol),
    symbolPosition: Number(value?.symbol_position || 2),
    exchangeRate: Number(value?.exchange_rate || 0),
  };
}

function normalizePointBalance(value: any): AccountPointBalance {
  return {
    id: numberValue(value?.id),
    pointConfigID: numberValue(value?.point_config_id),
    name: textValue(value?.name) || "积分",
    symbol: textValue(value?.symbol),
    symbolPosition: Number(value?.symbol_position || 2),
    balance: Number(value?.balance || 0),
    availableBalance: Number(value?.available_balance || 0),
  };
}

function normalizeSubscription(value: any): AccountSubscription {
  return {
    id: numberValue(value?.id),
    identityID: numberValue(value?.identity_id),
    pointConfigID: numberValue(value?.point_config_id),
    identityName: textValue(value?.identity_name),
    levelID: numberValue(value?.level_id),
    levelName: textValue(value?.level_name),
    level: Number(value?.level || 0),
    cardNo: textValue(value?.card_no),
    expiredAt: textValue(value?.expired_at),
  };
}

function normalizeIdentityCatalog(value: any): AccountIdentityCatalog {
  return {
    id: numberValue(value?.id),
    name: textValue(value?.name) || "订阅",
    pointConfig: normalizePointConfig(value?.point_config),
    levels: toRows(value?.levels)
      .map(normalizePlan)
      .filter((item) => item.id > 0),
    currentLevelID: numberValue(value?.current_level_id),
    currentExpiredAt: textValue(value?.current_expired_at),
  };
}

function normalizePlan(value: any): AccountPlan {
  return {
    id: numberValue(value?.id),
    name: textValue(value?.name) || "订阅方案",
    level: Number(value?.level || 0),
    durationDays: Number(value?.duration_days || 0),
    payType: Number(value?.pay_type || 0),
    basePoints: Number(value?.base_points || 0),
    checkoutPoints: Number(value?.checkout_points || 0),
    payAmountMicros: Number(value?.pay_amount_micros || 0),
    benefitDescriptions: toRows(value?.benefit_descriptions)
      .map((benefit) => ({
        icon: textValue(benefit?.icon),
        text: textValue(benefit?.text),
      }))
      .filter((benefit) => Boolean(benefit.text)),
    periodicBenefits: toRows(value?.periodic_benefits).map((benefit) => ({
      pointName: textValue(benefit?.point_name) || "积分",
      pointAmount: Number(benefit?.point_amount || 0),
      cycleDays: Number(benefit?.cycle_days || 0),
      limitTimes: Number(benefit?.limit_times || 0),
    })),
    billingBenefits: toRows(value?.billing_benefits).map((benefit) => ({
      scope: textValue(benefit?.scope),
      saleRatio: textValue(benefit?.sale_ratio),
    })),
  };
}

function normalizePointPackage(value: any): AccountPointPackage {
  return {
    id: numberValue(value?.id),
    name: textValue(value?.name) || "积分套餐",
    pointConfig: normalizePointConfig(value?.point_config),
    pointAmount: Number(value?.point_amount || 0),
    bonusAmount: Number(value?.bonus_amount || 0),
    payAmountMicros: Number(value?.pay_amount_micros || 0),
  };
}

function normalizeOrder(value: any): AccountOrder {
  return {
    id: numberValue(value?.id),
    type: textValue(value?.type) === "point" ? "point" : "identity",
    orderNo: textValue(value?.order_no),
    pointConfigID: numberValue(value?.point_config_id),
    pointName: textValue(value?.point_name),
    title: textValue(value?.title) || "账户订单",
    status: textValue(value?.status),
    action: textValue(value?.action),
    totalPoints: Number(value?.total_points || 0),
    rechargePoints: Number(value?.recharge_points || 0),
    bonusPoints: Number(value?.bonus_points || 0),
    payAmountMicros: Number(value?.pay_amount_micros || 0),
    currency: textValue(value?.currency) || "CNY",
    paymentURL: textValue(value?.payment_url),
    error: textValue(value?.error),
    targetExpiredAt: textValue(value?.target_expired_at),
    createdAt: textValue(value?.created_at),
    paidAt: textValue(value?.paid_at),
    fulfilledAt: textValue(value?.fulfilled_at),
    canCancel: Boolean(value?.can_cancel),
    canRetry: Boolean(value?.can_retry),
  };
}

function normalizePointLog(value: any): AccountPointLog {
  return {
    id: numberValue(value?.id),
    pointConfigID: numberValue(value?.point_config_id),
    pointName: textValue(value?.point_name) || "积分",
    pointSymbol: textValue(value?.point_symbol),
    changeType: textValue(value?.change_type),
    source: textValue(value?.source),
    amount: Number(value?.amount || 0),
    balanceBefore: Number(value?.balance_before || 0),
    balanceAfter: Number(value?.balance_after || 0),
    remark: textValue(value?.remark),
    createdAt: textValue(value?.created_at),
  };
}

function newRequestID() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `account-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));
}
