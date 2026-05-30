import type { AssistantPageContext } from "@/lib/assistant/context";
import type { FlowItem } from "./types";
import { THINK_ASSISTANT_FIELDS } from "./constants";

export function buildFlowAssistantContext(
  flow: FlowItem,
): AssistantPageContext {
  return {
    scope: "modal",
    route: "bot/team/flow",
    page: {
      name: "编辑工作流",
      title: flow.name || flow.key,
    },
    form: {
      fields: flowAssistantFields(),
      values: collectFlowAssistantValues(flow),
    },
  };
}

export function flowAssistantFields() {
  return THINK_ASSISTANT_FIELDS;
}

export function collectFlowAssistantValues(flow: FlowItem) {
  const values: Record<string, unknown> = {};
  if (flow.name) {
    values["form.name"] = flow.name;
  }
  if (flow.goal) {
    values["form.goal"] = flow.goal;
  }
  return values;
}

export function applyFlowAssistantValues(
  key: string,
  values: Record<string, unknown>,
  onChangeFlow: (key: string, patch: Partial<FlowItem>) => void,
) {
  const patch: Partial<FlowItem> = {};
  const name = readAssistantTextValue(values, "form.name");
  const goal = readAssistantTextValue(values, "form.goal");

  if (name !== undefined) {
    patch.name = name;
  }
  if (goal !== undefined) {
    patch.goal = goal;
  }
  if (Object.keys(patch).length > 0) {
    onChangeFlow(key, patch);
  }
}

export function readAssistantTextValue(
  values: Record<string, unknown>,
  path: string,
) {
  const shortPath = path.replace(/^form\./, "");
  const value = values[path] ?? values[shortPath];
  if (value === undefined || value === null) {
    return undefined;
  }
  return typeof value === "string" ? value : JSON.stringify(value);
}
