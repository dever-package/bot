import { canvasNodeHasMaterialSlot } from "./space-model";
import type {
  CanvasContentPreview,
  ProjectAsset,
  SpaceCanvasNode,
} from "./types";

export type CanvasAssetNodeType =
  | "text"
  | "richtext"
  | "image"
  | "audio"
  | "video"
  | "storyboard"
  | "agent"
  | "flow";

export type CanvasAssetStatus =
  | "empty"
  | "ready"
  | "running"
  | "failed"
  | "archived";

export type CanvasAssetPreview = CanvasContentPreview;

export type CanvasAssetEntry = {
  key: string;
  role: "work" | "material";
  title: string;
  sourcePath?: string;
  nodeType: CanvasAssetNodeType;
  status: CanvasAssetStatus;
  preview: CanvasAssetPreview;
  output?: unknown;
  node?: SpaceCanvasNode;
  nodeId?: string;
  nodeNo?: number;
  groupId?: string;
  groupTitle?: string;
  asset?: ProjectAsset;
  assetId?: number;
  versionId?: number;
};

export type BuildCanvasAssetIndexInput = {
  nodes: SpaceCanvasNode[];
  assets: ProjectAsset[];
  assetCateId: number;
  nodeOutput: (node: SpaceCanvasNode) => unknown;
  nodePreview: (node: SpaceCanvasNode) => CanvasAssetPreview;
  assetPreview: (asset: ProjectAsset) => CanvasAssetPreview;
  nodeHasResult: (node: SpaceCanvasNode) => boolean;
  nodeRunStatus?: (node: SpaceCanvasNode) => string;
};

export const canvasAssetNodeTypeOptions: Array<{
  key: "all" | CanvasAssetNodeType;
  label: string;
}> = [
  { key: "all", label: "全部" },
  { key: "text", label: "文本" },
  { key: "richtext", label: "富文本" },
  { key: "image", label: "图片" },
  { key: "audio", label: "音频" },
  { key: "video", label: "视频" },
  { key: "storyboard", label: "分镜" },
  { key: "agent", label: "智能体" },
  { key: "flow", label: "流程" },
];

const nodeTypeLabels = Object.fromEntries(
  canvasAssetNodeTypeOptions
    .filter((item) => item.key !== "all")
    .map((item) => [item.key, item.label]),
) as Record<CanvasAssetNodeType, string>;

export function canvasAssetNodeTypeLabel(type: CanvasAssetNodeType) {
  return nodeTypeLabels[type] || "文本";
}

export function buildCanvasAssetIndex(
  input: BuildCanvasAssetIndexInput,
): CanvasAssetEntry[] {
  const nodeById = new Map(input.nodes.map((node) => [node.id, node]));
  const groupById = new Map(
    input.nodes
      .filter((node) => node.type === "group")
      .map((node) => [node.id, node]),
  );
  const materialAssets = materialAssetsByNodeKey(
    input.assets,
    input.assetCateId,
  );
  const materials = input.nodes
    .filter(canvasNodeHasMaterialSlot)
    .map((node) => {
      const asset = materialAssets.get(node.id) || node.asset;
      const group = node.groupId ? groupById.get(node.groupId) : undefined;
      const groupSource = group?.group?.sourceNodeId
        ? nodeById.get(group.group.sourceNodeId)
        : undefined;
      const output = input.nodeOutput(node);
      return {
        key: `node:${node.id}`,
        role: "material" as const,
        title:
          node.title || canvasAssetNodeTypeLabel(canvasAssetNodeType(node)),
        sourcePath:
          groupSource?.title && group?.title
            ? `${groupSource.title} / ${group.title}`
            : group?.title,
        nodeType: canvasAssetNodeType(node),
        status: canvasMaterialStatus(
          node,
          asset,
          input.nodeHasResult(node),
          input.nodeRunStatus?.(node),
        ),
        preview: input.nodePreview(node),
        output,
        node,
        nodeId: node.id,
        nodeNo: node.nodeNo,
        groupId: node.groupId,
        groupTitle: group?.title,
        asset,
        assetId: asset?.id,
        versionId: asset?.version?.id || asset?.version_id,
      } satisfies CanvasAssetEntry;
    })
    .filter((entry) => Boolean(entry.assetId && entry.versionId));
  const works = input.assets
    .filter(
      (asset) =>
        Number(asset.asset_cate_id || 0) === input.assetCateId &&
        String(asset.role || "material") === "work" &&
        String(asset.status || "") !== "archived",
    )
    .map(
      (asset): CanvasAssetEntry => ({
        key: `asset:${asset.id}`,
        role: "work",
        title: asset.name || `作品 ${asset.id}`,
        nodeType: assetKindNodeType(asset.kind),
        status: asset.version?.id || asset.version_id ? "ready" : "empty",
        preview: input.assetPreview(asset),
        output: asset.version?.content,
        asset,
        assetId: asset.id,
        versionId: asset.version?.id || asset.version_id,
      }),
    );
  return [...works, ...materials].filter((entry) =>
    Boolean(entry.assetId && entry.versionId),
  );
}

export function canvasAssetNodeType(
  node: SpaceCanvasNode,
): CanvasAssetNodeType {
  if (node.type === "agent") return "agent";
  if (node.type === "flow") return "flow";
  const outputType = String(
    node.outputType || node.power?.outputType || node.power?.output?.key || "",
  ).toLowerCase();
  const viewMode = String(node.power?.output?.viewMode || "").toLowerCase();
  if (outputType === "storyboard" || viewMode === "storyboard") {
    return "storyboard";
  }
  return assetKindNodeType(node.power?.kind || node.kind);
}

function assetKindNodeType(kind: unknown): CanvasAssetNodeType {
  switch (String(kind || "text").toLowerCase()) {
    case "rich":
    case "richtext":
      return "richtext";
    case "image":
      return "image";
    case "audio":
      return "audio";
    case "video":
      return "video";
    default:
      return "text";
  }
}

function materialAssetsByNodeKey(assets: ProjectAsset[], assetCateId: number) {
  const result = new Map<string, ProjectAsset>();
  for (const asset of assets) {
    if (
      Number(asset.asset_cate_id || 0) !== assetCateId ||
      String(asset.role || "") !== "material" ||
      String(asset.status || "") === "archived"
    ) {
      continue;
    }
    const nodeKey = String(
      asset.node_key || asset.version?.node_key || "",
    ).trim();
    if (nodeKey && !result.has(nodeKey)) {
      result.set(nodeKey, asset);
    }
  }
  return result;
}

function canvasMaterialStatus(
  node: SpaceCanvasNode,
  asset: ProjectAsset | undefined,
  hasResult: boolean,
  runStatus = "",
): CanvasAssetStatus {
  const status = String(
    runStatus || (node as any).running?.status || node.resultRef?.status || "",
  ).toLowerCase();
  if (
    status === "running" ||
    status === "waiting" ||
    (node as any).running === true
  ) {
    return "running";
  }
  if (status === "error" || status === "failed" || status === "failure") {
    return "failed";
  }
  return hasResult || Boolean(asset?.version?.id || asset?.version_id)
    ? "ready"
    : "empty";
}
