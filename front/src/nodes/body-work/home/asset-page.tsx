import { AssetBrowser } from "../asset/asset-browser";
import type { AssetRecord } from "../asset/asset-types";

export function WorkbenchAssetPage({
  teamID,
  onContinue,
  canContinue,
}: {
  teamID: number;
  onContinue: (asset: AssetRecord) => void;
  canContinue: (asset: AssetRecord) => boolean;
}) {
  return (
    <AssetBrowser
      teamID={teamID}
      onContinue={onContinue}
      canContinue={canContinue}
    />
  );
}
