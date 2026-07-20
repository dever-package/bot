export function formatAccountNumber(value: number) {
  return new Intl.NumberFormat("zh-CN").format(Number(value || 0));
}

export function formatAccountMoney(micros: number) {
  const amount = Number(micros || 0) / 1_000_000;
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function accountPointsToMoneyMicros(points: number, exchangeRate: number) {
  if (points <= 0 || exchangeRate <= 0) {
    return 0;
  }
  return Math.ceil((points * 1_000_000) / exchangeRate);
}

export function formatAccountDuration(days: number) {
  if (days >= 365 && days % 365 === 0) {
    return `${days / 365} 年`;
  }
  if (days >= 30 && days % 30 === 0) {
    return `${days / 30} 个月`;
  }
  return `${days} 天`;
}

export function formatAccountDate(value: string) {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("zh-CN");
}

export function formatAccountDateTime(value: string) {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("zh-CN", { hour12: false });
}

export function accountErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}
