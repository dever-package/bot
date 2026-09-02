import type { CanvasFunctionOption, SpaceCanvasNode } from "./types";

export type CanvasFunctionKey = "start" | "import" | "save" | "display";

export type CanvasFunctionDefinition = CanvasFunctionOption & {
  key: CanvasFunctionKey;
  runsInBackend: boolean;
  persistsResult: boolean;
  showsResult: boolean;
  stopsExecution: boolean;
};

export const canvasFunctionDefinitions: readonly CanvasFunctionDefinition[] = [
  {
    key: "start",
    label: "开始",
    description: "启动连接的创作节点，直到保存或展示。",
    runsInBackend: false,
    persistsResult: false,
    showsResult: false,
    stopsExecution: false,
  },
  {
    key: "import",
    label: "引用",
    description: "选择资产并引用到当前节点。",
    runsInBackend: false,
    persistsResult: false,
    showsResult: true,
    stopsExecution: false,
  },
  {
    key: "save",
    label: "保存",
    description: "将上游结果保存为当前资产类型的资产。",
    runsInBackend: true,
    persistsResult: true,
    showsResult: true,
    stopsExecution: true,
  },
  {
    key: "display",
    label: "展示",
    description: "展示上游节点的结果。",
    runsInBackend: true,
    persistsResult: false,
    showsResult: true,
    stopsExecution: true,
  },
];

const canvasFunctionDefinitionByKey = new Map(
  canvasFunctionDefinitions.map((definition) => [definition.key, definition]),
);

export const canvasFunctionOptions: CanvasFunctionOption[] =
  canvasFunctionDefinitions.map(({ key, label, description }) => ({
    key,
    label,
    description,
  }));

export function canvasFunctionDefinition(value: unknown) {
  return canvasFunctionDefinitionByKey.get(
    String(value || "").trim() as CanvasFunctionKey,
  );
}

export function normalizeCanvasFunctionOption(
  value: unknown,
  legacyTitle = "",
): CanvasFunctionOption | undefined {
  const row = objectValue(value);
  const rawKey = stringValue(row.key);
  const definition = canvasFunctionDefinition(
    rawKey || legacyCanvasFunctionKey(legacyTitle),
  );
  if (!definition) {
    return rawKey
      ? {
          key: rawKey,
          label: stringValue(row.label),
          description: stringValue(row.description),
        }
      : undefined;
  }
  const label = stringValue(row.label);
  const description = stringValue(row.description);
  return {
    key: definition.key,
    label:
      definition.key === "import" && label === "导入"
        ? definition.label
        : label || definition.label,
    description:
      definition.key === "import" &&
      description === "导入资产并连接到当前节点。"
        ? definition.description
        : description || definition.description,
  };
}

export function isCanvasFunctionNode(
  node: Pick<SpaceCanvasNode, "type" | "functionOption">,
  key?: CanvasFunctionKey,
) {
  if (node.type !== "function") {
    return false;
  }
  const definition = canvasFunctionDefinition(node.functionOption?.key);
  return Boolean(definition && (!key || definition.key === key));
}

function legacyCanvasFunctionKey(title: string): CanvasFunctionKey | "" {
  const normalized = title.trim();
  if (normalized === "开始") return "start";
  if (normalized === "导入" || normalized === "引用") return "import";
  if (normalized === "展示") return "display";
  return normalized.includes("保存") ? "save" : "";
}

function objectValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}
