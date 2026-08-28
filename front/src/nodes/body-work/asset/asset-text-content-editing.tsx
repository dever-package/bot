import { useCallback, useMemo, useRef, type MutableRefObject } from "react";
import {
  assetTextContentFingerprint,
  resolveAssetTextContentDraft,
  serializeAssetTextContent,
  type AssetTextContentDraft,
} from "../shared/asset-text-content";
import { useContentDraft } from "../shared/use-content-draft";
import { saveAssetContent } from "./asset-api";
import type {
  AssetContentSaveMode,
  AssetRecord,
  AssetVersion,
} from "./asset-types";

export function useAssetTextContentEditing({
  teamID,
  asset,
  enabled,
  onSaved,
  onError,
}: {
  teamID: number;
  asset?: AssetRecord;
  enabled: boolean;
  onSaved: (asset: AssetRecord, mode: AssetContentSaveMode) => void;
  onError: (error: unknown) => void;
}) {
  const version = asset?.version || null;
  const initialDraft = useMemo(
    () =>
      resolveAssetTextContentDraft(
        asset?.kind === "richtext" ? "richtext" : "text",
        version?.content,
      ),
    [asset?.kind, version?.content],
  );
  const newVersionRequestRef = useRef<{
    versionID: number;
    fingerprint: string;
    requestID: string;
  } | null>(null);

  const persist = useCallback(
    async (draft: AssetTextContentDraft, mode: AssetContentSaveMode) => {
      if (!enabled || !asset?.id || !version?.id) {
        throw new Error("当前资产正文不可编辑");
      }
      const fingerprint = assetTextContentFingerprint(draft);
      const requestID =
        mode === "create_version"
          ? contentVersionRequestID(newVersionRequestRef, version, fingerprint)
          : "";
      const saved = await saveAssetContent({
        teamID,
        assetID: asset.id,
        expectedVersionID: version.id,
        expectedUpdatedAt: version.updatedAt || version.createdAt,
        requestID,
        saveMode: mode,
        content: serializeAssetTextContent(draft),
      });
      newVersionRequestRef.current = null;
      onSaved(saved, mode);
    },
    [asset, enabled, onSaved, teamID, version],
  );

  const draft = useContentDraft({
    value: initialDraft,
    resetKey: `${asset?.id || 0}:${version?.id || 0}:${version?.updatedAt || version?.createdAt || ""}`,
    fingerprint: assetTextContentFingerprint,
    save: (value) => persist(value, "overwrite_current"),
    onError,
    autoSave: false,
  });

  const { flushWith } = draft;
  const saveAsNewVersion = useCallback(
    () => flushWith((value) => persist(value, "create_version")),
    [flushWith, persist],
  );

  return {
    ...draft,
    saveAsNewVersion,
  };
}

function contentVersionRequestID(
  requestRef: MutableRefObject<{
    versionID: number;
    fingerprint: string;
    requestID: string;
  } | null>,
  version: AssetVersion,
  fingerprint: string,
) {
  if (
    requestRef.current?.versionID === version.id &&
    requestRef.current.fingerprint === fingerprint
  ) {
    return requestRef.current.requestID;
  }
  const random =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const requestID = `manual-edit-${version.id}-${random}`.slice(0, 64);
  requestRef.current = { versionID: version.id, fingerprint, requestID };
  return requestID;
}
