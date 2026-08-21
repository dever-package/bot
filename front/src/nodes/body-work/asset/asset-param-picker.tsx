import { useMemo } from "react";
import type {
  ParamFileLibraryRenderProps,
  ParamUploadedFile,
} from "@/components/agent/stream-request-params";
import { findAssetMediaURL } from "./asset-content";
import { assetKindsAccept } from "./asset-contract";
import { normalizeAssetRecord } from "./asset-api";
import { assetLibraryKey } from "./official-material";
import { uploadBodyAssetFiles } from "./upload-asset-api";
import { AssetPickerDialog } from "./asset-picker-dialog";
import type { AssetUploadOptions } from "./asset-upload-progress";
import type { AssetKind, AssetRecord } from "./asset-types";

const fileAssetKinds = new Set<AssetKind>(["image", "audio", "video", "file"]);

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
    () => files.filter((file) => !parseLibraryFileID(file.id)),
    [files],
  );
  const availableAssetSlots = multiple
    ? Math.max(maxSelection - localFiles.length, 0)
    : 1;
  const initialSelectedAssetKeys = Array.from(currentAssetFiles.keys()).slice(
    0,
    availableAssetSlots,
  );

  return (
    <AssetPickerDialog
      open={open}
      teamID={teamID}
      title={`${param.name}素材库`}
      description={`选择当前团队可用的${allowedKindDescription(allowedKinds)}素材`}
      allowedKinds={allowedKinds}
      initialSelectedAssetKeys={initialSelectedAssetKeys}
      multiple={multiple}
      maxSelection={Math.max(availableAssetSlots, 1)}
      confirmSelection
      uploadAccept={assetKindsAccept(allowedKinds)}
      onUpload={(selectedFiles, options) =>
        uploadParamAssets({
          teamID,
          ruleID: Number(param.upload_rule_id || 0),
          kind: resourceKind,
          files: selectedFiles,
          onProgress: options?.onProgress,
        })
      }
      validateAsset={(asset) => {
        if (availableAssetSlots <= 0) {
          return `当前参数最多只能选择 ${maxSelection} 个文件。`;
        }
        if (!allowedKinds.includes(asset.kind)) {
          return "该素材类型不适用于当前参数。";
        }
        return findAssetMediaURL(asset.version?.content, asset.kind)
          ? ""
          : "该素材没有可用文件，无法用于此参数。";
      }}
      onClose={() => onOpenChange(false)}
      onConfirm={(assets, selectedAssetKeys) => {
        const selectedAssets = new Map(
          assets.map((asset) => [assetLibraryKey(asset), asset]),
        );
        const selectedFiles = selectedAssetKeys
          .map((libraryKey) => {
            const asset = selectedAssets.get(libraryKey);
            return asset
              ? assetParamFile(asset)
              : currentAssetFiles.get(libraryKey);
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
  const indexed = new Map<string, ParamUploadedFile>();
  files.forEach((file) => {
    const identity = parseLibraryFileID(file.id);
    if (identity) indexed.set(identity.key, file);
  });
  return indexed;
}

function parseLibraryFileID(value: ParamUploadedFile["id"]) {
  const text = String(value || "");
  const assetMatch = /^asset:(\d+):(\d+)$/.exec(text);
  if (assetMatch) {
    return { key: `asset:${Number(assetMatch[1])}` };
  }
  const materialMatch = /^material:(\d+)$/.exec(text);
  return materialMatch ? { key: `material:${Number(materialMatch[1])}` } : null;
}

function assetParamFile(asset: AssetRecord): ParamUploadedFile | undefined {
  const url = findAssetMediaURL(asset.version?.content, asset.kind);
  if (!url) return undefined;
  return {
    id:
      asset.libraryType === "material"
        ? `material:${asset.id}`
        : `asset:${asset.id}:${asset.versionID}`,
    name: asset.name,
    kind: asset.kind,
    url,
    thumbnail: asset.kind === "image" ? url : undefined,
  };
}

function allowedKindDescription(kinds: AssetKind[]) {
  const labels: Record<AssetKind, string> = {
    collection: "集合",
    text: "文本",
    image: "图片",
    audio: "音频",
    video: "视频",
    richtext: "富文本",
    file: "文件",
  };
  return kinds.map((kind) => labels[kind]).join("、");
}

async function uploadParamAssets(input: {
  teamID: number;
  ruleID: number;
  kind?: string;
  files: File[];
  onProgress?: AssetUploadOptions["onProgress"];
}): Promise<AssetRecord[]> {
  if (!Number.isFinite(input.ruleID) || input.ruleID <= 0) {
    throw new Error("当前参数未配置上传规则");
  }
  const uploaded = await uploadBodyAssetFiles({
    teamID: input.teamID,
    files: input.files,
    ruleID: input.ruleID,
    kind: input.kind,
    onProgress: input.onProgress,
  });
  return uploaded
    .map(({ asset }) => normalizeAssetRecord(asset))
    .filter((asset) => asset.id > 0);
}
