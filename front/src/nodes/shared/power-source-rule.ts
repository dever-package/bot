export const POWER_SOURCE_RULE_PICK = 2;

export function isManualPowerSourceRule(value: unknown) {
  return Number(value) === POWER_SOURCE_RULE_PICK;
}

export function resolvePowerSourceDisplayName(
  serviceName: unknown,
  sourceName: unknown,
  fallback: string,
) {
  const normalizedServiceName = String(serviceName ?? "").trim();
  const normalizedSourceName = String(sourceName ?? "").trim();
  return normalizedServiceName || normalizedSourceName || fallback;
}
