import type {
  StreamPowerHistoryDetail,
  StreamPowerHistoryItem,
  StreamPowerHistoryPage,
} from "../../show/stream-power-history";
import {
  loadStreamPowerHistoryDetail,
  loadStreamPowerHistoryPage,
} from "../../show/stream-power-history-api";
import { workbenchApi } from "./workbench-api";

export type WorkbenchPowerHistoryItem = StreamPowerHistoryItem;
export type WorkbenchPowerHistoryDetail = StreamPowerHistoryDetail;

export function loadWorkbenchPowerHistory(input: {
  teamID: number;
  teamPowerID: number;
  beforeID?: number;
  limit?: number;
}): Promise<StreamPowerHistoryPage> {
  return loadStreamPowerHistoryPage(
    workbenchApi("power_history"),
    {
      team_id: input.teamID,
      team_power_id: input.teamPowerID,
    },
    input.beforeID,
    input.limit,
  );
}

export function loadWorkbenchPowerHistoryDetail(input: {
  teamID: number;
  historyID: number;
}): Promise<WorkbenchPowerHistoryDetail> {
  return loadStreamPowerHistoryDetail(
    workbenchApi("power_history_detail"),
    { team_id: input.teamID },
    input.historyID,
  );
}
