export function isSuccessResponse(result: unknown) {
  const response = result as { code?: unknown; status?: unknown } | null;
  return response?.code === 0 || response?.status === 1;
}
