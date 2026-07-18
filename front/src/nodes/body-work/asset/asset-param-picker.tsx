import { useMemo } from "react";
import type {
  ParamFileLibraryRenderProps,
  ParamUploadedFile,
} from "@/components/agent/stream-request-params";
import { findAssetMediaURL } from "./asset-content";
import { AssetPickerDialog } from "./asset-picker-dialog";
import type { AssetKind, AssetRecord } from "./asset-types";

const fileAssetKinds = new Set<AssetKind>([
  "image",
  "audio",
  "video",
  "file",
]);

export function AssetParamPicker({
  teamID,
  open,
  param,
  files,
  resourceKind,
  multiple,
  maxSelection,
  onOpenChange,
  onConfirm,
}: ParamFileLibraryRenderProps & { teamID: number }) {
  const allowedKinds = useMemo(
    () => resolveAllowedKinds(resourceKind, param.asset_kinds),
    [param.asset_kinds, resourceKind],
  );
  const currentAssetFiles = useMemo(() => indexedAssetFiles(files), [files]);
  const localFiles = useMemo(
    () => files.filter((file) => !parseAssetFileID(file.id)),
    [files],
  );
  const availableAssetSlots = multiple
    ? Math.max(maxSelection - localFiles.length, 0)
    : 1;
  const initialSelectedAssetIDs = Array.from(currentAssetFiles.keys()).slice(
    0,
    availableAssetSlots,
  );

  return (
    <AssetPickerDialog
      open={open}
      teamID={teamID}
      title={`${param.name}资产库`}
      description={`选择当前团队的${allowedKindDescription(allowedKinds)}资产`}
      allowedKinds={allowedKinds}
      initialSelectedAssetIDs={initialSelectedAssetIDs}
      multiple={multiple}
      maxSelection={Math.max(availableAssetSlots, 1)}
      confirmSelection
      validateAsset={(asset) => {
        if (availableAssetSlots <= 0) {
          return `当前参数最多只能选择 ${maxSelection} 个文件。`;
        }
        if (!allowedKinds.includes(asset.kind)) {
          return "该资产类型不适用于当前参数。";
        }
        return findAssetMediaURL(asset.version?.content, asset.kind)
          ? ""
          : "该资产当前版本没有可用文件，无法用于此参数。";
      }}
      onClose={() => onOpenChange(false)}
      onConfirm={(assets, selectedAssetIDs) => {
        const selectedAssets = new Map(assets.map((asset) => [asset.id, asset]));
        const selectedFiles = selectedAssetIDs
          .map((assetID) => {
            const asset = selectedAssets.get(assetID);
            return asset ? assetParamFile(asset) : currentAssetFiles.get(assetID);
          })
          .filter((file): file is ParamUploadedFile => Boolean(file));
        const nextFiles = multiple
          ? [...localFiles, ...selectedFiles].slice(0, maxSelection)
          : selectedFiles.slice(0, 1);
        onConfirm(nextFiles);
      }}
    />
  );
}

function resolveAllowedKinds(
  resourceKind: string | undefined,
  configuredKinds: string[] | undefined,
): AssetKind[] {
  const ruleKind = normalizeFileAssetKind(resourceKind);
  if (ruleKind) return [ruleKind];

  const configured = Array.from(
    new Set(
      (configuredKinds || [])
        .map(normalizeFileAssetKind)
        .filter((kind): kind is AssetKind => Boolean(kind)),
    ),
  );
  return configured.length > 0
    ? configured
    : ["image", "audio", "video", "file"];
}

function normalizeFileAssetKind(value: string | undefined) {
  const kind = String(value || "") as AssetKind;
  return fileAssetKinds.has(kind) ? kind : undefined;
}

function indexedAssetFiles(files: ParamUploadedFile[]) {
  const indexed = new Map<number, ParamUploadedFile>();
  files.forEach((file) => {
    const identity = parseAssetFileID(file.id);
    if (identity) indexed.set(identity.assetID, file);
  });
  return indexed;
}

function parseAssetFileID(value: ParamUploadedFile["id"]) {
  const match = /^asset:(\d+):(\d+)$/.exec(String(value || ""));
  if (!match) return null;
  return {
    assetID: Number(match[1]),
    versionID: Number(match[2]),
  };
}

function assetParamFile(asset: AssetRecord): ParamUploadedFile | undefined {
  const url = findAssetMediaURL(asset.version?.content, asset.kind);
  if (!url) return undefined;
  return {
    id: `asset:${asset.id}:${asset.versionID}`,
    name: asset.name,
    kind: asset.kind,
    url,
    thumbnail: asset.kind === "image" ? url : undefined,
  };
}

function allowedKindDescription(kinds: AssetKind[]) {
  const labels: Record<AssetKind, string> = {
    text: "文本",
    image: "图片",
    audio: "音频",
    video: "视频",
    richtext: "富文本",
    file: "文件",
  };
  return kinds.map((kind) => labels[kind]).join("、");
}
