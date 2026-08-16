import { useCallback } from "react";
import type { ParamFileLibraryRenderer } from "@/components/agent/stream-request-params";
import {
  useAgentChatExecution,
  type AgentChatExecutionController,
} from "../../show/agent-chat/execution";
import { AssetParamPicker } from "../asset/asset-param-picker";
import type { PowerCategory } from "../shared/power-menu";
import {
  loadWorkbenchDialogueConfig,
  loadWorkbenchPowerForm,
} from "./workbench-api";

export type WorkbenchDialogueExecutionController =
  AgentChatExecutionController & {
    renderFileLibrary: ParamFileLibraryRenderer;
  };

export function useWorkbenchDialogueExecution({
  teamID,
  roleID,
  powerCategories,
}: {
  teamID: number;
  roleID: number;
  powerCategories: PowerCategory[];
}): WorkbenchDialogueExecutionController {
  const loadConfig = useCallback(async () => {
    const config = await loadWorkbenchDialogueConfig({ teamID, roleID });
    return { ...config, categories: powerCategories };
  }, [powerCategories, roleID, teamID]);
  const loadToolForm = useCallback(
    (teamPowerID: number, sourceTargetID: number) =>
      loadWorkbenchPowerForm({
        teamID,
        teamPowerID,
        sourceTargetID,
      }),
    [teamID],
  );
  const renderFileLibrary = useCallback<ParamFileLibraryRenderer>(
    (props) => <AssetParamPicker {...props} teamID={teamID} />,
    [teamID],
  );

  const controller = useAgentChatExecution({
    enabled: teamID > 0 && roleID > 0,
    scopeKey: `workbench:${teamID}:${roleID}`,
    toolIDField: "team_power_id",
    loadConfig,
    loadToolForm,
    renderFileLibrary,
  });
  return { ...controller, renderFileLibrary };
}
