export const POWER_SOURCE_RULE_PICK = 2;

export function isManualPowerSourceRule(value: unknown) {
  return Number(value) === POWER_SOURCE_RULE_PICK;
}
