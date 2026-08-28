import { useMemo } from "react";
import { loadAssetDetail, loadOfficialMaterialDetail } from "./asset-api";
import { assetKindsAccept, assetSourceLabel } from "./asset-contract";
import {
  assetPreviewOutput,
  findAssetMediaURLs,
} from "./asset-content";
import {
  contentOutputMediaKinds,
  contentOutputMediaURLs,
  type ContentMediaKind,
} from "../shared/content-output";
import type {
  ReferenceOption,
  ReferencePreviewRequest,
  ReferenceProvider,
  ReferenceProviderPickerProps,
} from "../../show/agent-chat/reference";
import type {
  AssetFilters,
  AssetKind,
  AssetRecord,
} from "./asset-types";
import { AssetPickerDialog } from "./asset-picker-dialog";
import { assetLibraryKey } from "./official-material";
import type { AssetUploadOptions } from "./asset-upload-progress";

type AssetReferenceUploadContext = AssetUploadOptions & {
  preferredUsage?: string;
  acceptedKinds?: AssetKind[];
};

export type WorkbenchReferenceProvider = ReferenceProvider;

export type WorkbenchReferenceOption = ReferenceOption & {
  key: string;
  refType: "asset" | "material";
  refId: number;
  versionID?: number;
  trigger: "@";
  label: string;
  description?: string;
  preview?: { text?: string; kind?: string; url?: string };
  output?: unknown;
  asset?: AssetRecord;
};

export function useAssetReferenceProvider({
  teamID,
  scopeProjectID = 0,
  initialFilters,
  allowedKinds,
  onSelect,
  onUpload,
}: {
  teamID: number;
  scopeProjectID?: number;
  initialFilters?: Partial<AssetFilters>;
  allowedKinds?: string[];
  onSelect?: (option: WorkbenchReferenceOption) => void;
  onUpload?: (
    files: File[],
    context: AssetReferenceUploadContext,
  ) => Promise<AssetRecord[]>;
}): ReferenceProvider {
  const filterKey = JSON.stringify(initialFilters || {});
  const kindKey = JSON.stringify(allowedKinds || []);
  const stableFilters = useMemo(
    () => JSON.parse(filterKey) as Partial<AssetFilters>,
    [filterKey],
  );
  const stableKinds = useMemo(
    () => JSON.parse(kindKey) as AssetKind[],
    [kindKey],
  );
  return useMemo(
    () => ({
      trigger: "@" as const,
      referenceTypes: ["asset", "material"] as ["asset", "material"],
      loadPreview: async (request: ReferencePreviewRequest) => {
        const asset =
          request.refType === "material"
            ? await loadOfficialMaterialDetail(teamID, request.refId)
            : (await loadAssetDetail(teamID, request.refId)).asset;
        const media = assetReferenceMedia(asset);
        return {
          refType: request.refType,
          refId: asset.id,
          title: asset.name,
          text: asset.summary,
          media,
          content:
            media.length > 0
              ? undefined
              : assetPreviewOutput(asset.kind, asset.version?.content),
        };
      },
      renderPicker: (props) => (
        <AssetReferencePicker
          {...props}
          teamID={teamID}
          scopeProjectID={scopeProjectID}
          initialFilters={stableFilters}
          allowedKinds={stableKinds}
          onReferenceSelect={onSelect}
          onUpload={onUpload}
        />
      ),
    }),
    [onSelect, onUpload, scopeProjectID, stableFilters, stableKinds, teamID],
  );
}

function AssetReferencePicker({
  open,
  teamID,
  scopeProjectID,
  initialFilters,
  allowedKinds,
  acceptedKinds,
  preferredUsage,
  maxSelection = 1,
  selectedReferences = [],
  onReferenceSelect,
  onUpload,
  onSelect,
  onSelectMany,
  onClose,
}: ReferenceProviderPickerProps & {
  teamID: number;
  scopeProjectID: number;
  initialFilters?: Partial<AssetFilters>;
  allowedKinds?: AssetKind[];
  onReferenceSelect?: (option: WorkbenchReferenceOption) => void;
  onUpload?: (
    files: File[],
    context: AssetReferenceUploadContext,
  ) => Promise<AssetRecord[]>;
}) {
  if (!open) {
    return null;
  }
  const requestedKinds = normalizeReferenceKinds(acceptedKinds);
  const effectiveKinds = intersectReferenceKinds(
    allowedKinds || [],
    requestedKinds,
  );
  const selectionLimit = Math.max(1, Number(maxSelection || 1));
  const usedAssetKeys = Array.from(
    new Set(
      selectedReferences.flatMap((reference) =>
        (reference.ref_type === "asset" || reference.ref_type === "material") &&
        Number(reference.ref_id || 0) > 0
          ? [`${reference.ref_type}:${Number(reference.ref_id)}`]
          : [],
      ),
    ),
  );
  const usedAssetKeySet = new Set(usedAssetKeys);
  return (
    <AssetPickerDialog
      open
      teamID={teamID}
      scopeProjectID={scopeProjectID}
      title="选择素材"
      description={`从个人资产或团队${assetSourceLabel("official")}中选择`}
      initialFilters={initialFilters}
      allowedKinds={effectiveKinds}
      multiple={selectionLimit > 1}
      maxSelection={selectionLimit}
      confirmSelection
      contentMode="full"
      usedAssetKeys={usedAssetKeys}
      validateAsset={(asset) => {
        if (usedAssetKeySet.has(assetLibraryKey(asset))) {
          return "该素材已使用";
        }
        if (asset.kind === "text" || asset.kind === "richtext") return "";
        return assetReferenceMedia(asset).length > 0
          ? ""
          : "该素材没有可用文件，无法使用。";
      }}
      uploadAccept={assetKindsAccept(effectiveKinds)}
      onUpload={
        onUpload
          ? (files, options) =>
              onUpload(files, {
                preferredUsage,
                acceptedKinds: effectiveKinds,
                onProgress: options?.onProgress,
              })
          : undefined
      }
      onClose={onClose}
      onConfirm={(assets) => {
        const options = assets.map((asset) =>
          assetReferenceOption(asset, preferredUsage),
        );
        for (const option of options) {
          onReferenceSelect?.(option);
        }
        if (onSelectMany) {
          onSelectMany(options);
          return;
        }
        for (const option of options) {
          onSelect(option);
        }
      }}
    />
  );
}

function assetReferenceOption(
  asset: AssetRecord,
  usage = "",
): WorkbenchReferenceOption {
  const media = assetReferenceMedia(asset);
  const refType = asset.libraryType === "material" ? "material" : "asset";
  return {
    key:
      refType === "material"
        ? `material:${asset.id}`
        : `asset:${asset.id}:${asset.versionID}`,
    refType,
    refId: asset.id,
    versionID: refType === "asset" ? asset.versionID : undefined,
    trigger: "@",
    usage,
    label: asset.name,
    description: asset.summary,
    preview: {
      text: asset.summary,
      kind: media[0]?.kind || asset.kind,
      url: media[0]?.url,
    },
    output: asset.version?.content,
    asset,
    mediaCount: media.length,
  };
}

function normalizeReferenceKinds(kinds: string[] | undefined) {
  const validKinds = new Set<AssetKind>([
    "collection",
    "text",
    "image",
    "audio",
    "video",
    "richtext",
    "file",
  ]);
  return Array.from(
    new Set(
      (kinds || []).flatMap((kind) => {
        const normalized = String(kind || "").trim() as AssetKind;
        return validKinds.has(normalized) ? [normalized] : [];
      }),
    ),
  );
}

function intersectReferenceKinds(
  configuredKinds: AssetKind[],
  requestedKinds: AssetKind[],
) {
  if (configuredKinds.length === 0) {
    return requestedKinds;
  }
  if (requestedKinds.length === 0) {
    return configuredKinds;
  }
  const requested = new Set(requestedKinds);
  return configuredKinds.filter((kind) => requested.has(kind));
}

const referenceMediaKinds = new Set<AssetKind>([
  "image",
  "video",
  "audio",
  "file",
]);

function assetReferenceMedia(asset: AssetRecord) {
  const content = asset.version?.content;
  const media = assetOutputReferenceMedia(content, asset.kind);
  const resolvedMedia =
    media.length > 0
      ? media
      : referenceMediaKinds.has(asset.kind)
        ? findAssetMediaURLs(content, asset.kind).map((url) => ({
            kind: asset.kind,
            url,
          }))
        : [];
  return resolvedMedia.map((item, index) => ({
    refType:
      asset.libraryType === "material"
        ? ("material" as const)
        : ("asset" as const),
    refId: asset.id,
    kind: item.kind,
    label:
      resolvedMedia.length > 1 ? `${asset.name} · ${index + 1}` : asset.name,
    url: item.url,
    index: index + 1,
  }));
}

function assetOutputReferenceMedia(content: unknown, assetKind: AssetKind) {
  const outputKinds = contentOutputMediaKinds(content);
  const preferredKind = referenceContentMediaKind(assetKind);
  const selectedKinds =
    preferredKind && outputKinds.includes(preferredKind)
      ? [preferredKind]
      : outputKinds;
  return selectedKinds.flatMap((kind) =>
    contentOutputMediaURLs(content, kind).map((url) => ({ kind, url })),
  );
}

function referenceContentMediaKind(kind: AssetKind): ContentMediaKind | "" {
  return kind === "image" || kind === "video" || kind === "audio"
    ? kind
    : "";
}
