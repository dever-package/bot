import type {
  CanvasComposerDraft,
  CanvasParamBinding,
  CanvasParamBindings,
  PowerParam,
  SpaceCanvasNode,
} from "./types";
import { isStoryboardPowerType } from "../shared/power-presentation";

export const CANVAS_PRIMARY_TEXT_OUTPUT = "primary_text" as const;

export type CanvasParamBindingSummary = {
  targetParamKeys: string[];
  targetParamKey?: string;
  label: string;
  purpose?: "param" | "storyboard_lyrics";
};

export type CanvasTextConnectionSummary = CanvasParamBindingSummary & {
  purpose: "param" | "storyboard_lyrics";
};

export type CanvasTextBindingControl = {
  label: string;
  interactive: boolean;
  showChevron: boolean;
  invalid: boolean;
};

const TEXT_PARAM_TYPES = new Set([
  "prompt",
  "input",
  "textarea",
  "text",
  "string",
]);
const TEXT_OUTPUT_KINDS = new Set([
  "text",
  "llm",
  "rich",
  "richtext",
  "document",
]);
const UNSAFE_BINDING_KEYS = new Set(["__proto__", "constructor", "prototype"]);

type CanvasTextSourceNode = Pick<
  SpaceCanvasNode,
  "type" | "kind" | "outputType"
> & {
  asset?: Pick<NonNullable<SpaceCanvasNode["asset"]>, "kind">;
  power?: Pick<NonNullable<SpaceCanvasNode["power"]>, "kind">;
};

type CanvasStoryboardLyricsTargetNode = Pick<
  SpaceCanvasNode,
  "type" | "kind" | "outputType" | "composerDraft"
> & {
  power?: SpaceCanvasNode["power"];
};

export function bindableCanvasTextParams(params: PowerParam[]) {
  const usedKeys = new Set<string>();
  const result: PowerParam[] = [];
  for (const param of params) {
    const key = String(param.key || "").trim();
    const type = String(param.type || "")
      .trim()
      .toLowerCase();
    const valueType = String(param.value_type || "string")
      .trim()
      .toLowerCase();
    if (
      !key ||
      UNSAFE_BINDING_KEYS.has(key) ||
      usedKeys.has(key) ||
      !TEXT_PARAM_TYPES.has(type) ||
      valueType === "number"
    ) {
      continue;
    }
    usedKeys.add(key);
    result.push(key === param.key ? param : { ...param, key });
  }
  return result;
}

export function availableCanvasTextBindingParams(
  params: PowerParam[],
  draft: Pick<CanvasComposerDraft, "paramBindings"> | undefined,
  sourceNodeId: string,
) {
  const source = sourceNodeId.trim();
  const bindings = normalizeCanvasParamBindings(draft?.paramBindings);
  return bindableCanvasTextParams(params).filter((param) =>
    normalizedCanvasTextBindingParamAvailable(bindings, param.key, source),
  );
}

export function canvasTextBindingParamAvailable(
  draft: Pick<CanvasComposerDraft, "paramBindings"> | undefined,
  targetParamKey: string,
  sourceNodeId: string,
) {
  return normalizedCanvasTextBindingParamAvailable(
    normalizeCanvasParamBindings(draft?.paramBindings),
    targetParamKey,
    sourceNodeId,
  );
}

export function automaticCanvasTextBindingKey(params: PowerParam[]) {
  if (params.length !== 1) {
    return undefined;
  }
  const param = params[0];
  const key = String(param.key || "").trim();
  return key && !UNSAFE_BINDING_KEYS.has(key) ? key : undefined;
}

export type CanvasTextBindingDecision =
  | { kind: "automatic"; targetParamKey: string }
  | { kind: "choose"; params: PowerParam[] }
  | { kind: "unavailable" };

export function resolveCanvasTextBindingDecision(
  params: PowerParam[],
): CanvasTextBindingDecision {
  const targetParamKey = automaticCanvasTextBindingKey(params);
  if (targetParamKey) {
    return { kind: "automatic", targetParamKey };
  }
  return params.length > 1
    ? { kind: "choose", params }
    : { kind: "unavailable" };
}

export function resolveCanvasTextBindingControl(
  summary: CanvasParamBindingSummary | undefined,
  params: PowerParam[] | undefined,
  storyboardLyricsAvailable = false,
): CanvasTextBindingControl {
  const optionCount =
    (params?.length || 0) + (storyboardLyricsAvailable ? 1 : 0);
  if (summary) {
    let alternativeOptionCount = optionCount;
    if (summary.purpose === "storyboard_lyrics" && storyboardLyricsAvailable) {
      alternativeOptionCount -= 1;
    } else if (
      summary.purpose !== "storyboard_lyrics" &&
      summary.targetParamKey &&
      params?.some((param) => param.key === summary.targetParamKey)
    ) {
      alternativeOptionCount -= 1;
    }
    const interactive = Boolean(params && alternativeOptionCount > 0);
    return {
      label: summary.label,
      interactive,
      showChevron: interactive,
      invalid: false,
    };
  }
  if (params && optionCount === 0) {
    return {
      label: "无效连接",
      interactive: false,
      showChevron: false,
      invalid: true,
    };
  }
  return {
    label: "待绑定",
    interactive: true,
    showChevron: Boolean(params && optionCount > 1),
    invalid: false,
  };
}

export function resolveAutomaticCanvasTextBindingRepair(
  sourceNodeIds: string[],
  draft: Pick<CanvasComposerDraft, "paramBindings"> | undefined,
  params: PowerParam[],
) {
  const bindings = normalizeCanvasParamBindings(draft?.paramBindings);
  const boundSourceNodeIds = new Set(
    Object.values(bindings || {}).map((binding) => binding.sourceNodeId),
  );
  const unboundSourceNodeIds = [
    ...new Set(sourceNodeIds.map((source) => source.trim()).filter(Boolean)),
  ].filter((source) => !boundSourceNodeIds.has(source));
  if (unboundSourceNodeIds.length !== 1) {
    return undefined;
  }
  const sourceNodeId = unboundSourceNodeIds[0];
  const decision = resolveCanvasTextBindingDecision(
    availableCanvasTextBindingParams(params, draft, sourceNodeId),
  );
  return decision.kind === "automatic"
    ? { sourceNodeId, targetParamKey: decision.targetParamKey }
    : undefined;
}

export function canvasTextParamLabel(param: PowerParam) {
  if (
    normalizedValue(param.type) === "prompt" ||
    normalizedValue(param.key) === "prompt"
  ) {
    return "提示词";
  }
  return String(param.name || "").trim() || "文本参数";
}

export function canvasNodeSupportsTextBinding(node?: CanvasTextSourceNode) {
  if (!node) {
    return false;
  }
  if (node.type === "agent") {
    return true;
  }
  if (node.type === "power") {
    return declaredCanvasTextKind(node.power?.kind, node.kind, node.outputType);
  }
  if (node.type === "asset") {
    return declaredCanvasTextKind(node.asset?.kind, node.kind, node.outputType);
  }
  return declaredCanvasTextKind(node.kind, node.outputType);
}

export function canvasNodeSupportsStoryboardLyrics(
  node?: CanvasStoryboardLyricsTargetNode,
) {
  return Boolean(
    node?.type === "power" &&
    node.composerDraft?.storyboardWorkType === "mv" &&
    isStoryboardPowerType(node.power, node.kind, node.outputType),
  );
}

export function normalizeCanvasParamBindings(
  value: unknown,
): CanvasParamBindings | undefined {
  const row = plainRecord(value);
  const entries: Array<[string, CanvasParamBinding]> = [];
  for (const [rawKey, rawBinding] of Object.entries(row)) {
    const key = rawKey.trim();
    const binding = plainRecord(rawBinding);
    const sourceNodeId = String(
      binding.sourceNodeId ?? binding.source_node_id ?? "",
    ).trim();
    const sourceOutput = String(
      binding.sourceOutput ??
        binding.source_output ??
        CANVAS_PRIMARY_TEXT_OUTPUT,
    )
      .trim()
      .toLowerCase();
    if (
      !key ||
      UNSAFE_BINDING_KEYS.has(key) ||
      !sourceNodeId ||
      sourceOutput !== CANVAS_PRIMARY_TEXT_OUTPUT
    ) {
      continue;
    }
    entries.push([
      key,
      {
        sourceNodeId,
        sourceOutput: CANVAS_PRIMARY_TEXT_OUTPUT,
      },
    ]);
  }
  return entries.length > 0 ? Object.fromEntries(entries) : undefined;
}

export function persistedCanvasParamBindings(value: unknown) {
  const bindings = normalizeCanvasParamBindings(value);
  if (!bindings) {
    return undefined;
  }
  return Object.fromEntries(
    Object.entries(bindings).map(([key, binding]) => [
      key,
      {
        source_node_id: binding.sourceNodeId,
        source_output: binding.sourceOutput,
      },
    ]),
  );
}

export function withCanvasParamBinding(
  draft: CanvasComposerDraft,
  targetParamKey: string,
  sourceNodeId: string,
): CanvasComposerDraft {
  const key = targetParamKey.trim();
  const source = sourceNodeId.trim();
  if (!key || UNSAFE_BINDING_KEYS.has(key) || !source) {
    return draft;
  }
  return {
    ...draft,
    paramBindings: {
      ...(normalizeCanvasParamBindings(draft.paramBindings) || {}),
      [key]: {
        sourceNodeId: source,
        sourceOutput: CANVAS_PRIMARY_TEXT_OUTPUT,
      },
    },
  };
}

export function replaceCanvasParamBindingForConnection(
  draft: CanvasComposerDraft,
  sourceNodeId: string,
  targetParamKey: string,
): CanvasComposerDraft {
  const source = sourceNodeId.trim();
  if (!source) {
    return draft;
  }
  const key = targetParamKey.trim();
  if (!key || UNSAFE_BINDING_KEYS.has(key)) {
    return draft;
  }
  return withCanvasParamBinding(
    removeCanvasTextConnectionBinding(draft, source),
    key,
    source,
  );
}

export function canvasParamBindingSummary(
  draft: Pick<CanvasComposerDraft, "paramBindings"> | undefined,
  sourceNodeId: string,
  params: PowerParam[] = [],
): CanvasParamBindingSummary | undefined {
  const source = sourceNodeId.trim();
  const bindings = normalizeCanvasParamBindings(draft?.paramBindings);
  if (!source || !bindings) {
    return undefined;
  }
  const targetParamKeys = Object.entries(bindings)
    .filter(([, binding]) => binding.sourceNodeId === source)
    .map(([key]) => key)
    .sort();
  if (targetParamKeys.length === 0) {
    return undefined;
  }
  const paramNames = new Map(
    params.map((param) => [param.key.trim(), canvasTextParamLabel(param)]),
  );
  const labels = targetParamKeys.map(
    (key) => paramNames.get(key) || "文本参数",
  );
  return {
    targetParamKeys,
    targetParamKey:
      targetParamKeys.length === 1 ? targetParamKeys[0] : undefined,
    label:
      labels.length === 1 ? labels[0] : `${labels[0]} +${labels.length - 1}`,
  };
}

export function canvasTextConnectionSummary(
  draft:
    | Pick<
        CanvasComposerDraft,
        "paramBindings" | "storyboardLyricsSourceNodeId"
      >
    | undefined,
  sourceNodeId: string,
  params: PowerParam[] = [],
): CanvasTextConnectionSummary | undefined {
  const source = sourceNodeId.trim();
  if (
    source &&
    String(draft?.storyboardLyricsSourceNodeId || "").trim() === source
  ) {
    return {
      purpose: "storyboard_lyrics",
      targetParamKeys: [],
      label: "歌词",
    };
  }
  const summary = canvasParamBindingSummary(draft, source, params);
  return summary ? { ...summary, purpose: "param" } : undefined;
}

export function withCanvasStoryboardLyricsSource(
  draft: CanvasComposerDraft,
  sourceNodeId: string,
): CanvasComposerDraft {
  const source = sourceNodeId.trim();
  if (!source) {
    return draft;
  }
  const nextDraft = removeCanvasParamBindingForConnection(draft, source);
  return nextDraft.storyboardLyricsSourceNodeId === source
    ? nextDraft
    : { ...nextDraft, storyboardLyricsSourceNodeId: source };
}

export function removeCanvasParamBindingForConnection(
  draft: CanvasComposerDraft,
  sourceNodeId: string,
): CanvasComposerDraft {
  const source = sourceNodeId.trim();
  const bindings = normalizeCanvasParamBindings(draft.paramBindings);
  if (!source || !bindings) {
    return draft;
  }
  const remaining = Object.fromEntries(
    Object.entries(bindings).filter(
      ([, binding]) => binding.sourceNodeId !== source,
    ),
  );
  if (Object.keys(remaining).length === Object.keys(bindings).length) {
    return draft;
  }
  return withDraftParamBindings(draft, remaining);
}

export function removeCanvasTextConnectionBinding(
  draft: CanvasComposerDraft,
  sourceNodeId: string,
): CanvasComposerDraft {
  const source = sourceNodeId.trim();
  if (!source) {
    return draft;
  }
  const nextDraft = removeCanvasParamBindingForConnection(draft, source);
  if (String(nextDraft.storyboardLyricsSourceNodeId || "").trim() !== source) {
    return nextDraft;
  }
  const { storyboardLyricsSourceNodeId: _removed, ...rest } = nextDraft;
  return rest;
}

export function removeCanvasParamBindingsForSources(
  nodes: SpaceCanvasNode[],
  sourceNodeIds: ReadonlySet<string>,
) {
  if (sourceNodeIds.size === 0) {
    return nodes;
  }
  let changed = false;
  const nextNodes = nodes.map((node) => {
    let draft = node.composerDraft;
    if (!draft?.paramBindings && !draft?.storyboardLyricsSourceNodeId) {
      return node;
    }
    for (const sourceNodeId of sourceNodeIds) {
      draft = removeCanvasTextConnectionBinding(draft, sourceNodeId);
    }
    if (draft === node.composerDraft) {
      return node;
    }
    changed = true;
    return { ...node, composerDraft: draft };
  });
  return changed ? nextNodes : nodes;
}

function normalizedValue(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function declaredCanvasTextKind(...values: unknown[]) {
  const kind = values.map(normalizedValue).find(Boolean) || "";
  return TEXT_OUTPUT_KINDS.has(kind);
}

function withDraftParamBindings(
  draft: CanvasComposerDraft,
  paramBindings: CanvasParamBindings,
): CanvasComposerDraft {
  const { paramBindings: _removed, ...rest } = draft;
  return Object.keys(paramBindings).length > 0
    ? { ...rest, paramBindings }
    : rest;
}

function normalizedCanvasTextBindingParamAvailable(
  bindings: CanvasParamBindings | undefined,
  targetParamKey: string,
  sourceNodeId: string,
) {
  const key = targetParamKey.trim();
  const source = sourceNodeId.trim();
  if (!key || UNSAFE_BINDING_KEYS.has(key) || !source) {
    return false;
  }
  const binding = bindings?.[key];
  return !binding || binding.sourceNodeId === source;
}

function plainRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
