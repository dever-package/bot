import { lazy, Suspense, useMemo } from "react";
import { createPortal } from "react-dom";
import { loadAssetDetail } from "./asset-api";
import { assetKindsAccept } from "./asset-contract";
import {
  assetPreviewOutput,
  findAssetMediaURL,
} from "./asset-content";
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

const AssetPickerDialog = lazy(() =>
  import("./asset-picker-dialog").then((module) => ({
    default: module.AssetPickerDialog,
  })),
);

export type WorkbenchReferenceProvider = ReferenceProvider;

export type WorkbenchReferenceOption = ReferenceOption & {
  key: string;
  refType: "asset";
  refId: number;
  versionID: number;
  trigger: "@";
  label: string;
  description?: string;
  preview?: { text?: string; kind?: string; url?: string };
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
    context: {
      preferredUsage?: string;
      acceptedKinds?: AssetKind[];
    },
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
      referenceTypes: ["asset"] as ["asset"],
      loadPreview: async (request: ReferencePreviewRequest) => {
        const detail = await loadAssetDetail(teamID, request.refId);
        const media = assetReferenceMedia(detail.asset);
        return {
          refType: "asset" as const,
          refId: detail.asset.id,
          title: detail.asset.name,
          text: detail.asset.summary,
          media,
          content:
            media.length > 0
              ? undefined
              : assetPreviewOutput(
                  detail.asset.kind,
                  detail.asset.version?.content,
                ),
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
    context: {
      preferredUsage?: string;
      acceptedKinds?: AssetKind[];
    },
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
  const usedAssetIDs = Array.from(
    new Set(
      selectedReferences.flatMap((reference) =>
        reference.ref_type === "asset" && Number(reference.ref_id || 0) > 0
          ? [Number(reference.ref_id)]
          : [],
      ),
    ),
  );
  const usedAssetIDSet = new Set(usedAssetIDs);
  return (
    <Suspense fallback={<AssetPickerLoading />}>
      <AssetPickerDialog
        open
        teamID={teamID}
        scopeProjectID={scopeProjectID}
        title="选择资产"
        description="插入资产当前版本"
        initialFilters={initialFilters}
        allowedKinds={effectiveKinds}
        multiple={selectionLimit > 1}
        maxSelection={selectionLimit}
        confirmSelection
        usedAssetIDs={usedAssetIDs}
        validateAsset={(asset) => {
          if (usedAssetIDSet.has(asset.id)) {
            return "该素材已使用";
          }
          return findAssetMediaURL(asset.version?.content, asset.kind)
            ? ""
            : "该资产当前版本没有可用文件，无法用于此参数。";
        }}
        uploadAccept={assetKindsAccept(effectiveKinds)}
        onUpload={
          onUpload
            ? (files) =>
                onUpload(files, {
                  preferredUsage,
                  acceptedKinds: effectiveKinds,
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
    </Suspense>
  );
}

function AssetPickerLoading() {
  if (typeof document === "undefined") {
    return null;
  }
  return createPortal(
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        display: "grid",
        placeItems: "center",
        background: "rgba(15, 23, 42, 0.38)",
      }}
    >
      <div
        style={{
          border: "1px solid rgba(148, 163, 184, 0.32)",
          borderRadius: 6,
          background: "var(--body-work-surface-raised, #ffffff)",
          color: "var(--body-work-text, #111827)",
          padding: "14px 18px",
          boxShadow: "0 14px 36px rgba(15, 23, 42, 0.18)",
        }}
      >
        正在加载资产选择器
      </div>
    </div>,
    document.body,
  );
}

function assetReferenceOption(
  asset: AssetRecord,
  usage = "",
): WorkbenchReferenceOption {
  const media = assetReferenceMedia(asset);
  return {
    key: `asset:${asset.id}:${asset.versionID}`,
    refType: "asset",
    refId: asset.id,
    versionID: asset.versionID,
    trigger: "@",
    usage,
    label: asset.name,
    description: asset.summary,
    preview: {
      text: asset.summary,
      kind: asset.kind,
      url: media[0]?.url,
    },
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
  if (!referenceMediaKinds.has(asset.kind)) {
    return [];
  }
  const url = findAssetMediaURL(asset.version?.content, asset.kind);
  if (!url) {
    return [];
  }
  return [
    {
      refType: "asset" as const,
      refId: asset.id,
      kind: asset.kind,
      label: asset.name,
      url,
    },
  ];
}
