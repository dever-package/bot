import { AssetBrowser } from "../asset/asset-browser";
import { normalizeAssetRecord } from "../asset/asset-api";
import type {
  AssetCatalogOptions,
  AssetRecord,
} from "../asset/asset-types";
import { uploadBodyAssetFiles } from "../asset/upload-asset-api";

export function WorkbenchAssetPage({
  teamID,
  onContinue,
  canContinue,
  catalogOptions,
}: {
  teamID: number;
  onContinue: (asset: AssetRecord) => void;
  canContinue: (asset: AssetRecord) => boolean;
  catalogOptions: AssetCatalogOptions;
}) {
  async function uploadAssets(files: File[]) {
    const uploaded = await uploadBodyAssetFiles({ teamID, files });
    return uploaded
      .map(({ asset }) => normalizeAssetRecord(asset))
      .filter((asset) => asset.id > 0);
  }

  return (
    <AssetBrowser
      teamID={teamID}
      onLocalUpload={uploadAssets}
      onContinue={onContinue}
      canContinue={canContinue}
      catalogOptions={catalogOptions}
    />
  );
}
