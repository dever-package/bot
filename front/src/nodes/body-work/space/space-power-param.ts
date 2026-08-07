import { isPromptPowerParam } from "./space-media-param";
import type {
  CanvasComposerDraft,
  PowerParam,
  PowerParamOption,
} from "./types";

export function defaultPowerParamValue(param: PowerParam) {
  const raw = param.default_value ?? "";
  if (param.type === "switch") {
    return powerParamBooleanValue(raw);
  }
  if (param.type === "multi_option") {
    return normalizePowerParamValue(param, parseJSONValue(raw));
  }
  if (param.type === "files") {
    return valueAsList(parseJSONValue(raw));
  }
  if (param.type === "option" || param.type === "select") {
    const option =
      resolvePowerParamOption(param.options || [], raw) || param.options?.[0];
    return normalizePowerParamScalarValue(
      param,
      powerParamOptionValue(option) || raw,
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

export function mergePowerParamValues(
  params: PowerParam[],
  current: Record<string, unknown>,
  previousParams: PowerParam[],
) {
  const values = defaultPowerParamValues(params);
  const previousByKey = new Map(
    previousParams.map((param) => [param.key, param]),
  );
  for (const param of params) {
    const previousParam = previousByKey.get(param.key);
    if (
      param.key &&
      previousParam &&
      Object.prototype.hasOwnProperty.call(current, param.key) &&
      canPreservePowerParamValue(param, previousParam, current[param.key])
    ) {
      values[param.key] = normalizePowerParamValue(param, current[param.key]);
    }
  }
  return values;
}

export function mergeCanvasComposerParamValues(
  params: PowerParam[],
  draft: CanvasComposerDraft,
) {
  const values = defaultPowerParamValues(params);
  const savedValues = draft.paramValues || {};
  for (const param of params) {
    if (
      param.key &&
      Object.prototype.hasOwnProperty.call(savedValues, param.key)
    ) {
      values[param.key] = normalizePowerParamValue(
        param,
        savedValues[param.key],
      );
    }
  }
  const promptParam = params.find(isPromptPowerParam);
  if (promptParam?.key && draft.prompt.trim()) {
    values[promptParam.key] = draft.prompt;
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
  if (param.type === "option" || param.type === "select") {
    const option =
      resolvePowerParamOption(param.options || [], value) || param.options?.[0];
    return normalizePowerParamScalarValue(
      param,
      powerParamOptionValue(option) || value,
    );
  }
  if (param.type === "multi_option") {
    return valueAsList(value).map((item) => {
      const option = resolvePowerParamOption(param.options || [], item);
      return normalizePowerParamScalarValue(
        param,
        powerParamOptionValue(option) || item,
      );
    });
  }
  return normalizePowerParamScalarValue(param, value);
}

function canPreservePowerParamValue(
  param: PowerParam,
  previousParam: PowerParam,
  value: unknown,
) {
  if (
    param.type !== previousParam.type ||
    param.value_type !== previousParam.value_type
  ) {
    return false;
  }
  if (param.type === "option" || param.type === "select") {
    const options = param.options || [];
    return (
      options.length === 0 || Boolean(resolvePowerParamOption(options, value))
    );
  }
  if (param.type === "multi_option") {
    const options = param.options || [];
    return (
      options.length === 0 ||
      valueAsList(value).every((item) =>
        Boolean(resolvePowerParamOption(options, item)),
      )
    );
  }
  if (param.value_type === "number") {
    return value === "" || Number.isFinite(Number(value));
  }
  return true;
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

export function resolvePowerParamOption(
  options: PowerParamOption[],
  value: unknown,
) {
  const normalizedValue = String(value ?? "").trim();
  if (!normalizedValue) {
    return undefined;
  }
  // Match request-value fields across the full list before falling back to IDs.
  const valueSelectors = [
    (option: PowerParamOption) => option.native_value,
    (option: PowerParamOption) => option.value,
    (option: PowerParamOption) => option.name,
    (option: PowerParamOption) => option.id,
  ];
  for (const selectValue of valueSelectors) {
    const matched = options.find(
      (option) => String(selectValue(option) ?? "").trim() === normalizedValue,
    );
    if (matched) {
      return matched;
    }
  }
  return undefined;
}

export function isPowerParamOptionSelected(
  option: PowerParamOption,
  values: string[],
  options: PowerParamOption[] = [option],
) {
  return values.some(
    (value) => resolvePowerParamOption(options, value) === option,
  );
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

export function powerParamBooleanValue(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }
  const text = String(value ?? "")
    .trim()
    .toLowerCase();
  return text === "1" || text === "true" || text === "yes" || text === "on";
}
