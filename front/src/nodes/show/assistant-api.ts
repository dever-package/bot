import { request } from "@dever/front-plugin";

export function isPlainRecord(
  value: unknown,
): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export async function assistantApiRequest(
  api: string,
  payload: Record<string, unknown>,
): Promise<Record<string, unknown>> {
  const result = await request(api, "post", payload);
  if (!isPlainRecord(result)) {
    return {};
  }
  const status = Number(result.status || 0);
  const code = Number(result.code || 0);
  if (status === 2 || code === 401) {
    const message = String(result.msg || result.message || "请求失败").trim();
    throw new Error(message || "请求失败");
  }
  return isPlainRecord(result.data) ? result.data : {};
}
