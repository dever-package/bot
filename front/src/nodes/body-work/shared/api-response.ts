export function isSuccessResponse(result: unknown) {
  const response = result as { code?: unknown; status?: unknown } | null;
  return response?.code === 0 || response?.status === 1;
}

export function isResponseRecord(
  value: unknown,
): value is Record<string, any> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function asResponseRecord(value: unknown): Record<string, any> {
  return isResponseRecord(value) ? value : {};
}

export function asResponseRows<T = any>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function responsePositiveNumber(value: unknown, fallback = 0) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number > 0 ? number : fallback;
}

export function responseNonNegativeNumber(value: unknown, fallback = 0) {
  const number = Number(value || 0);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

export function responseText(value: unknown) {
  return value == null ? "" : String(value).trim();
}

export function successfulResponseData(result: unknown, fallback: string) {
  return asResponseRecord(successfulResponseValue(result, fallback));
}

export function successfulResponseValue<T = any>(
  result: unknown,
  fallback: string,
): T {
  const response = asResponseRecord(result);
  if (!isSuccessResponse(response)) {
    throw new Error(responseText(response.message || response.msg) || fallback);
  }
  return response.data as T;
}

export function requestErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}
