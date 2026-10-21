import { joinSiteApi, request } from "@dever/front-plugin";
import { successfulResponseData } from "../shared/api-response";
import {
  parseWritingCheckpoint,
  parseWritingSnapshot,
  type WritingDocument,
  type WritingSnapshot,
} from "./writing-document";

export type WritingAction =
  | "propose_edit"
  | "generate_inspirations"
  | "select_inspiration"
  | "generate_outline"
  | "generate_chapters"
  | "save_document"
  | "save_unit"
  | "create_version"
  | "generate_section"
  | "generate_units"
  | "retry_continuity"
  | "retry_planning"
  | "append"
  | "restore_document";
export type WritingCommand = {
  project_id: number;
  canvas_id: number;
  work_asset_id: number;
  expected_work_version_id: number;
  expected_work_revision: number;
  action: WritingAction;
  document?: WritingDocument;
  selected_text?: string;
  section_id?:
    | "overview"
    | "world"
    | "inspiration"
    | "chapter_plan"
    | "characters"
    | "locations"
    | "props";
  entity_id?: string;
  inspiration_id?: string;
  unit_id?: string;
  expected_unit_version_id?: number;
  unit_ids?: string[];
  mode?: "single" | "range" | "continue";
  body?: string;
  instruction?: string;
  count?: number;
  source_work_version_id?: number;
};
export async function submitWritingCommand(
  command: WritingCommand,
): Promise<WritingSnapshot> {
  const data = successfulResponseData(
    await request(joinSiteApi("project/writing_command"), "post", command, {
      reportError: false,
    }),
    "保存创作内容失败",
  );
  const snapshot = parseWritingSnapshot(data);
  if (!snapshot) throw new Error("创作响应缺少已保存版本");
  return snapshot;
}

export type WritingRun = {
  id: number;
  request_id: string;
  status: string;
  error?: string;
  action: string;
  instruction?: string;
  created_at?: string;
  updated_at?: string;
  checkpoint?: WritingSnapshot["checkpoint"];
};
export async function fetchWritingRuns(input: {
  projectId: number;
  canvasId: number;
  workAssetId: number;
  beforeId?: number;
}) {
  const data = successfulResponseData(
    await request(
      joinSiteApi("project/writing_runs"),
      "get",
      {
        project_id: input.projectId,
        canvas_id: input.canvasId,
        work_asset_id: input.workAssetId,
        before_id: input.beforeId || 0,
      },
      { reportError: false },
    ),
    "读取创作运行记录失败",
  );
  return {
    items: (Array.isArray(data.items) ? data.items : []).map(
      (run: WritingRun) => ({
        ...run,
        checkpoint: parseWritingCheckpoint(run.checkpoint),
      }),
    ),
    hasMore: Boolean(data.has_more),
    beforeId: Number(data.before_id || 0),
  };
}
