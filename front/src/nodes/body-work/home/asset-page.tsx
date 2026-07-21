import { AssetBrowser } from "../asset/asset-browser";
import type {
  AssetCatalogOptions,
  AssetRecord,
} from "../asset/asset-types";

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
  return (
    <AssetBrowser
      teamID={teamID}
      onContinue={onContinue}
      canContinue={canContinue}
      catalogOptions={catalogOptions}
    />
  );
}
