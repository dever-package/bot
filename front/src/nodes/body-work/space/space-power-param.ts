import type { PowerParam, PowerParamOption } from "./types";

export function defaultPowerParamValue(param: PowerParam) {
  const raw = param.default_value ?? "";
  if (param.type === "switch") {
    return truthy(raw);
  }
  if (param.type === "multi_option") {
    return normalizePowerParamValue(param, parseJSONValue(raw));
  }
  if (param.type === "files") {
    return valueAsList(parseJSONValue(raw));
  }
  if (param.type === "option" || param.type === "select") {
    return normalizePowerParamScalarValue(
      param,
      raw || powerParamOptionValue(param.options?.[0]) || "",
    );
  }
  return normalizePowerParamScalarValue(param, raw);
}

export function defaultPowerParamValues(params: PowerParam[]) {
  const values: Record<string, unknown> = {};
  for (const param of params) {
    if (!param.key || param.type === "description") {
      continue;
    }
    values[param.key] = defaultPowerParamValue(param);
  }
  return values;
}

function normalizePowerParamScalarValue(
  param: PowerParam,
  value: unknown,
) {
  if (param.value_type !== "number" || value === "") {
    return value;
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : value;
}

export function normalizePowerParamValue(param: PowerParam, value: unknown) {
  return param.type === "multi_option"
    ? valueAsList(value).map((item) =>
        normalizePowerParamScalarValue(param, item),
      )
    : normalizePowerParamScalarValue(param, value);
}

export function powerParamOptionValue(option?: PowerParamOption) {
  if (!option) {
    return "";
  }
  return (
    String(option.native_value || "").trim() ||
    String(option.value || "").trim() ||
    String(option.name || "").trim() ||
    String(option.id || "")
  );
}

export function isPowerParamOptionSelected(
  option: PowerParamOption,
  values: string[],
) {
  const candidates = [
    String(option.id || ""),
    String(option.native_value || "").trim(),
    String(option.value || "").trim(),
    String(option.name || "").trim(),
  ].filter(Boolean);
  return values.some((value) => candidates.includes(String(value).trim()));
}

function parseJSONValue(value: unknown) {
  if (typeof value !== "string") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function valueAsList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item)).filter(Boolean);
  }
  if (typeof value === "string") {
    return value ? [value] : [];
  }
  return value ? [String(value)] : [];
}

function truthy(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }
  const text = String(value ?? "")
    .trim()
    .toLowerCase();
  return text === "1" || text === "true" || text === "yes" || text === "on";
}
