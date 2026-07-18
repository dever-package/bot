import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { loadAssetDetail } from "./asset-api";
import { AssetBrowser } from "./asset-browser";
import {
  assetPreviewOutput,
  findAssetMediaURL,
} from "./asset-content";
import type {
  ReferenceOption,
  ReferencePreviewRequest,
  ReferenceProvider,
} from "../../show/agent-chat/reference";
import type {
  AssetFilters,
  AssetKind,
  AssetRecord,
} from "./asset-types";

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
  initialFilters,
  allowedKinds,
}: {
  teamID: number;
  initialFilters?: Partial<AssetFilters>;
  allowedKinds?: string[];
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
        if (
          request.versionId &&
          detail.asset.versionID !== request.versionId
        ) {
          throw new Error("资产当前版本已变化，请重新选择");
        }
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
          initialFilters={stableFilters}
          allowedKinds={stableKinds}
        />
      ),
    }),
    [stableFilters, stableKinds, teamID],
  );
}

function AssetReferencePicker({
  open,
  teamID,
  initialFilters,
  allowedKinds,
  onSelect,
  onClose,
}: {
  open: boolean;
  teamID: number;
  initialFilters?: Partial<AssetFilters>;
  allowedKinds?: AssetKind[];
  onSelect: (option: ReferenceOption) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose, open]);

  if (!open || typeof document === "undefined") {
    return null;
  }
  return createPortal(
    <div
      className="wb-asset-reference-backdrop"
      role="dialog"
      aria-modal="true"
      aria-label="选择资产"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="wb-asset-reference-dialog">
        <header>
          <div>
            <h2>选择资产</h2>
            <p>插入资产当前版本</p>
          </div>
          <button type="button" title="关闭" onClick={onClose}>
            <X aria-hidden="true" />
            <span className="sr-only">关闭</span>
          </button>
        </header>
        <AssetBrowser
          teamID={teamID}
          initialFilters={initialFilters}
          allowedKinds={allowedKinds}
          selectable
          onSelect={(asset) => {
            onSelect(assetReferenceOption(asset));
            onClose();
          }}
        />
      </div>
    </div>,
    document.body,
  );
}

function assetReferenceOption(asset: AssetRecord): WorkbenchReferenceOption {
  const media = assetReferenceMedia(asset);
  return {
    key: `asset:${asset.id}:${asset.versionID}`,
    refType: "asset",
    refId: asset.id,
    versionID: asset.versionID,
    trigger: "@",
    label: asset.name,
    description: asset.summary,
    preview: {
      text: asset.summary,
      kind: asset.kind,
      url: media[0]?.url,
    },
  };
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
