import { writingChapterIndex } from "./writing-chapter-index";
import { isPlainRecord, parseMaybeJSON } from "../shared/structured-json";
import { isWritingPowerType } from "../shared/power-presentation";
import {
  validWritingPreferences,
  type WritingPreferences,
} from "./writing-preferences";
import type { ProjectAsset, SpaceCanvasNode } from "../space/types";

export type WritingProfile = "story";
export type WritingInspiration = { id: string; title: string; content: string };
export type WritingEntitySection = "characters" | "locations" | "props";
export const writingOutlineSections = [
  { id: "overview", label: "故事总纲" },
  { id: "world", label: "环境与规则" },
] as const;
export type WritingOutlineSection =
  (typeof writingOutlineSections)[number]["id"];
export type WritingOutline = Record<WritingOutlineSection, string> &
  Record<WritingEntitySection, WritingEntity[]>;
export function isWritingOutlineSection(
  section: string,
): section is WritingOutlineSection {
  return writingOutlineSections.some((entry) => entry.id === section);
}
export function writingOutlineComplete(outline: WritingOutline): boolean {
  return (
    writingOutlineSections.every(({ id }) => Boolean(outline[id].trim())) &&
    outline.characters.length > 0 &&
    outline.locations.length > 0 &&
    [outline.characters, outline.locations, outline.props].every((entries) =>
      entries.every((entry) =>
        Boolean(entry.name.trim() && entry.description.trim()),
      ),
    )
  );
}
export type WritingEntity = { id: string; name: string; description: string };
export type WritingUnitEntry = {
  id: string;
  unit_type: "chapter";
  title: string;
  plan: string;
  children: WritingUnitEntry[];
  asset_id: number;
  version_id: number;
  has_body: boolean;
  continuity_valid: boolean;
  dependency_stale: boolean;
  plan_stale?: boolean;
  continuity_status?: "pending" | "ready" | "raw_pending";
  continuity_findings?: { code: string; message: string; evidence: string }[];

};
export type WritingDocument = {
  type: WritingProfile;
  schema_version: 1;
  title: string;
  preferences: WritingPreferences;
  inspirations: WritingInspiration[];
  selected_inspiration_id: string;
  outline: WritingOutline;
  units: WritingUnitEntry[];
  archived_units: WritingUnitEntry[];
  status: "ready" | "running" | "failed" | "stopped";
  active_run_id: number;
  active_request_id: string;
};
/** 阶段解锁只依据已保存的故事走向、人物与背景。 */
export function writingPlanningComplete(document: WritingDocument): boolean {
  return writingOutlineComplete(document.outline);
}
export type WritingUnit = {
  type: "writing_unit";
  schema_version: 1;
  profile: WritingProfile;
  unit_id: string;
  title: string;
  body: string;
  synopsis: string;
  end_state: string;
  open_threads: string;
  ending: string;
  continuity_valid: boolean;
  predecessor_version_id: number;
};
export type WritingContentSelection = {
  kind: "section" | "unit";
  ids: string[];
};
export type WritingProposal = {
  run_id: number;
  work_asset_id: number;
  work_version_id: number;
  work_revision: number;
  unit_id?: string;
  unit_version_id?: number;
  section_id?: string;
  entity_id?: string;
  inspiration_id?: string;
  selected_text?: string;
  replacement: string;
};
export type WritingPreview = {
  work_asset_id: number;
  run_id: number;
  request_id: string;
  step_request_id: string;
  phase?: WritingCheckpoint["phase"] | "";
  unit_id?: string;
  section_id?: string;
  entity_id?: string;
  inspiration_id?: string;
  active_field: string;
  fields: Record<string, string>;
  values?: Record<string, string | number | string[]>;
  completed_sections?: ("world" | "locations" | "props")[];
};
export type WritingStreamDraft = {
  body: string;
  unit_id: string;
  run_id: number;
  request_id: string;
  updated_at: string;
  units?: WritingUnitEntry[];
  expected_count?: number;
  accepted_count?: number;
  complete?: boolean;
};
export type WritingCheckpoint = {
  work_asset_id?: number;
  work_version_id?: number;
  work_revision?: number;
  action: string;
  request_id?: string;
  phase?: "preferences" | "direction" | "characters" | "background" | "chapters" | "body" | "continuity";
  continuity_unit_id?: string;
  history_completed?: number;
  history_total?: number;
  correction_count?: number;
  draft?: WritingStreamDraft;
  instruction?: string;
  count?: number;
  selected_text?: string;
  section_id?: string;
  entity_id?: string;
  inspiration_id?: string;
  unit_id: string;
  unit_ids: string[];
  completed: number;
  target: number;
  issued: boolean;
};
export type WritingSnapshot = {
  work_asset_id: number;
  work_version_id: number;
  work_revision: number;
  work_version?: number;
  work_updated_at?: string;
  document: WritingDocument;
  run_id: number;
  request_id: string;
  status: string;
  proposal?: WritingProposal;
  checkpoint?: WritingCheckpoint;
};
export const writingProfile = {
  title: "故事",
  unit: "章",
  directory: "章节",
  append: "章节",
} as const;
export const writingSections = [
  { id: "inspiration", label: "灵感" },
  { id: "outline", label: "大纲" },
  { id: "characters", label: "人物" },
  { id: "locations", label: "地点" },
  { id: "props", label: "道具" },
] as const;
export const writingEntitySections = writingSections.filter(
  (section) =>
    section.id === "characters" ||
    section.id === "locations" ||
    section.id === "props",
);
export type WritingSection = (typeof writingSections)[number]["id"];
export type WritingSelection =
  | {
      kind: "section";
      id:
        | Exclude<WritingSection, "inspiration" | "outline">
        | WritingOutlineSection
        | "chapters";
    }
  | { kind: "entity"; section: WritingEntitySection; id: string }
  | { kind: "unit"; id: string; tab?: "plan" | "body" };

export function writingEntitySection(
  selection: WritingSelection,
): WritingEntitySection | undefined {
  if (selection.kind === "entity") return selection.section;
  if (selection.kind !== "section") return undefined;
  return selection.id === "characters" ||
    selection.id === "locations" ||
    selection.id === "props"
    ? selection.id
    : undefined;
}

export function writingSelectionExists(
  document: WritingDocument,
  selection: WritingSelection,
): boolean {
  if (selection.kind === "section") return true;
  if (selection.kind === "entity")
    return document.outline[selection.section].some(
      (entity) => entity.id === selection.id,
    );
  return document.units.some((unit) => unit.id === selection.id);
}

function documentValue(value: unknown): Record<string, unknown> | null {
  const parsed = parseMaybeJSON(value);
  if (!isPlainRecord(parsed)) return null;
  const document = parseMaybeJSON(parsed.json ?? parsed);
  return isPlainRecord(document) ? document : null;
}
function hasOnlyFields(value: Record<string, unknown>, fields: readonly string[]) {
  return Object.keys(value).every((key) => fields.includes(key));
}
function validEntry(value: unknown): value is WritingUnitEntry {
  if (!isPlainRecord(value) || !hasOnlyFields(value, ["id", "unit_type", "title", "plan", "children", "asset_id", "version_id", "has_body", "continuity_valid", "continuity_index", "continuity_status", "continuity_findings", "dependency_stale", "plan_stale"])) return false;
  return (
    typeof value.id === "string" &&
    typeof value.title === "string" &&
    typeof value.plan === "string" &&
    typeof value.has_body === "boolean" &&
    (value.plan_stale === undefined || typeof value.plan_stale === "boolean") &&
    value.unit_type === "chapter" &&
    Array.isArray(value.children) &&
    value.children.length === 0
  );
}
function validOutline(value: unknown): value is WritingOutline {
  if (!isPlainRecord(value) || !hasOnlyFields(value, ["overview", "world", "characters", "locations", "props"])) return false;
  return (
    writingOutlineSections.every(({ id }) => typeof value[id] === "string") &&
    ["characters", "locations", "props"].every(
      (key) =>
        Array.isArray(value[key]) &&
        value[key].every(
          (entity) =>
            isPlainRecord(entity) &&
            typeof entity.id === "string" &&
            typeof entity.name === "string" &&
            typeof entity.description === "string",
        ),
    )
  );
}
export function parseWritingDocument(value: unknown): WritingDocument | null {
  const row = documentValue(value);
  if (
    !row ||
    row.type !== "story" ||
    row.schema_version !== 1 ||
    typeof row.title !== "string" ||
    !hasOnlyFields(row, ["type", "schema_version", "title", "preferences", "inspirations", "selected_inspiration_id", "outline", "units", "archived_units", "status", "active_run_id", "active_request_id"]) ||
    !validWritingPreferences(row.preferences) ||
    typeof row.selected_inspiration_id !== "string" ||
    !Array.isArray(row.inspirations) ||
    !row.inspirations.every(
      (entry) =>
        isPlainRecord(entry) &&
        typeof entry.id === "string" &&
        typeof entry.title === "string" &&
        typeof entry.content === "string",
    ) ||
    !validOutline(row.outline) ||
    !Array.isArray(row.units) ||
    !row.units.every(validEntry) ||
    !Array.isArray(row.archived_units) ||
    !row.archived_units.every(validEntry)
  )
    return null;
  return row as unknown as WritingDocument;
}
export function parseWritingUnit(value: unknown): WritingUnit | null {
  const row = documentValue(value);
  return row?.type === "writing_unit" &&
    row.schema_version === 1 &&
    typeof row.body === "string"
    ? (row as unknown as WritingUnit)
    : null;
}
/** 已有作品从编辑入口继续，避免再次提交初始创建。 */
export function hasWritingWork(node: SpaceCanvasNode): boolean {
  if (writingSnapshotFromOutput(node.resultOutput)) return true;
  const hasIdentity = Number(node.asset?.id || node.resultRef?.asset_id) > 0;
  return (
    hasIdentity &&
    Boolean(
      parseWritingDocument(node.asset?.version?.content) ||
      isWritingPowerType(node.power, node.kind, node.outputType),
    )
  );
}
export function writingUnitLabel(
  units: WritingUnitEntry[],
  id: string,
): string {
  return writingChapterIndex(units).byId.get(id)?.label || "";
}

export function updateWritingUnit(
  units: WritingUnitEntry[],
  id: string,
  patch: Partial<Pick<WritingUnitEntry, "title" | "plan">>,
): WritingUnitEntry[] {
  return units.map((unit) => (unit.id === id ? { ...unit, ...patch } : unit));
}

export function writingSelectionTitle(
  document: WritingDocument,
  selection: WritingSelection,
): string {
  if (selection.kind === "unit") {
    const unit = writingChapterIndex(document.units).byId.get(
      selection.id,
    )?.unit;
    return unit
      ? `${writingUnitLabel(document.units, unit.id)} · ${unit.title}`
      : "正文";
  }
  if (selection.kind === "entity")
    return (
      document.outline[selection.section].find(
        (entry) => entry.id === selection.id,
      )?.name || "素材"
    );
  return (
    [...writingSections, ...writingOutlineSections].find(
      (section) => section.id === selection.id,
    )?.label || writingProfile.directory
  );
}

/** 编辑器与 AI 从同一目标读取原文，实体和文字块都只读大纲单源。 */
export function writingSelectionText(
  document: WritingDocument,
  selection: WritingSelection,
  body = "",
): string {
  if (selection.kind === "unit")
    return selection.tab === "plan"
      ? writingChapterIndex(document.units).byId.get(selection.id)?.unit.plan ||
          ""
      : body;
  if (selection.kind === "entity")
    return (
      document.outline[selection.section].find(
        (entity) => entity.id === selection.id,
      )?.description || ""
    );
  return isWritingOutlineSection(selection.id)
    ? document.outline[selection.id]
    : "";
}

export function writingUnitStatus(unit: WritingUnitEntry): string {
  if (!unit.has_body) return unit.plan_stale ? "剧情待同步" : "待写";
  if (unit.continuity_status === "raw_pending" && !unit.dependency_stale) return "已写 · 记忆待补";
  return unit.continuity_status === "pending" || unit.dependency_stale ? "衔接待整理" : "已写";
}
export function writingSelectionKey(
  selection?: WritingContentSelection,
): string {
  return selection ? JSON.stringify([selection.kind, selection.ids]) : "";
}

function validWritingStreamDraft(value: unknown): value is WritingStreamDraft {
  if (
    !isPlainRecord(value) ||
    !["body", "unit_id", "request_id", "updated_at"].every(
      (key) => typeof value[key] === "string",
    ) ||
    !Number.isSafeInteger(value.run_id)
  ) return false;
  if (value.units === undefined) return true;
  return (
    Array.isArray(value.units) &&
    value.units.length > 0 &&
    value.units.every((unit) =>
      validEntry(unit) &&
      unit.title.trim() &&
      unit.plan.trim() &&
      !unit.asset_id &&
      !unit.version_id &&
      !unit.has_body &&
      !unit.continuity_valid &&
      !unit.dependency_stale &&
      !unit.plan_stale
    ) &&
    Number.isSafeInteger(value.expected_count) &&
    Number(value.expected_count) > 0 &&
    typeof value.complete === "boolean" &&
    (value.accepted_count === undefined ||
      (Number.isSafeInteger(value.accepted_count) &&
        Number(value.accepted_count) >= 0 &&
        Number(value.accepted_count) <= value.units.length &&
        Number(value.accepted_count) < Number(value.expected_count)))
  );
}

export function writingRecoverableChapterDraft(
  snapshot?: WritingSnapshot | null,
): WritingStreamDraft | undefined {
  const checkpoint = snapshot?.checkpoint;
  const draft = checkpoint?.draft;
  if (
    !snapshot ||
    snapshot.document.status === "running" ||
    !draft?.units?.length ||
    draft.run_id !== snapshot.run_id ||
    draft.request_id !== checkpoint?.request_id ||
    snapshot.document.active_run_id !== snapshot.run_id
  ) return undefined;
  const chapterPhase =
    checkpoint.action === "generate_chapters" ||
    checkpoint.action === "append" ||
    (checkpoint.action === "generate_outline" && checkpoint.phase === "chapters");
  return chapterPhase ? draft : undefined;
}

/** 快照和运行记录共用边界；无效队列不能被当成未限定范围的重试。 */
export function parseWritingCheckpoint(
  value: unknown,
): WritingCheckpoint | undefined {
  if (!isPlainRecord(value)) return undefined;
  const unitIds = value.unit_ids;
  if (
    typeof value.action !== "string" ||
    !["generate_inspirations", "generate_outline", "generate_chapters", "generate_units", "generate_section", "propose_edit", "append", "retry_continuity"].includes(value.action) ||
    (value.action === "generate_outline" && !["preferences", "direction", "characters", "background", "chapters"].includes(String(value.phase))) ||
    (value.action === "generate_units" && value.phase !== "body" && value.phase !== "continuity") ||
    (value.action === "retry_continuity" && value.phase !== "continuity") ||
    typeof value.unit_id !== "string" ||
    !Array.isArray(unitIds) ||
    !unitIds.every((id) => typeof id === "string" && Boolean(id.trim())) ||
    new Set(unitIds).size !== unitIds.length ||
    !Number.isSafeInteger(value.completed) ||
    Number(value.completed) < 0 ||
    !Number.isSafeInteger(value.target) ||
    Number(value.target) < 0 ||
    typeof value.issued !== "boolean" ||
    (value.correction_count !== undefined && value.correction_count !== 0 && value.correction_count !== 1) ||
    (value.phase !== undefined && !["preferences", "direction", "characters", "background", "chapters", "body", "continuity"].includes(String(value.phase))) ||
    (value.continuity_unit_id !== undefined && typeof value.continuity_unit_id !== "string") ||
    ["history_completed", "history_total"].some((key) => value[key] !== undefined && (!Number.isSafeInteger(value[key]) || Number(value[key]) < 0)) ||
    (value.draft !== undefined && !validWritingStreamDraft(value.draft)) ||
    (value.section_id !== undefined && value.section_id !== "" && !["inspiration", "overview", "world", "characters", "locations", "props", "chapter_plan"].includes(String(value.section_id))) ||
    [
      "instruction",
      "request_id",
      "selected_text",
      "section_id",
      "entity_id",
      "inspiration_id",
    ].some(
      (key) => value[key] !== undefined && typeof value[key] !== "string",
    ) ||
    (value.count !== undefined &&
      (!Number.isSafeInteger(value.count) || Number(value.count) < 0))
  )
    return undefined;
  return {
    ...value,
    action: value.action,
    instruction: value.instruction,
    count: value.count,
    selected_text: value.selected_text,
    section_id: value.section_id,
    entity_id: value.entity_id,
    inspiration_id: value.inspiration_id,
    unit_id: value.unit_id,
    unit_ids: unitIds,
    completed: Number(value.completed),
    target: Number(value.target),
    issued: value.issued,
  };
}
export function parseWritingSnapshot(
  output: unknown,
): WritingSnapshot | null {
  const value = parseMaybeJSON(output);
  if (!isPlainRecord(value)) return null;
  const row = value;
  const document = parseWritingDocument(row.document);
  return document &&
    Number(row.work_asset_id) > 0 &&
    Number(row.work_version_id) > 0 &&
    Number.isSafeInteger(row.work_revision) &&
    Number(row.work_revision) >= 0
    ? ({
        ...row,
        document,
        checkpoint: parseWritingCheckpoint(row.checkpoint),
        proposal: parseWritingProposal(row.proposal),
      } as WritingSnapshot)
    : null;
}

/** Run 与 SSE 只接收当前 writing envelope，命令响应另读平面快照。 */
export function writingSnapshotFromOutput(output: unknown): WritingSnapshot | null {
  const value = parseMaybeJSON(output);
  return isPlainRecord(value) ? parseWritingSnapshot(value.writing) : null;
}

/** 画布保存的是作品文档或运行快照；读取卡面不需要再请求 asset_detail。 */
export function writingSnapshotFromNode(
  node: SpaceCanvasNode,
  output: unknown,
  previous?: WritingSnapshot | null,
): WritingSnapshot | null {
  const snapshot = writingSnapshotFromOutput(output);
  const assetId = node.resultRef?.asset_id || node.asset?.id;
  // 保存/重选会先更新资产，画布的上次运行引用可能仍指向旧根。
  const versionId = Math.max(
    node.asset?.id === assetId ? node.asset?.version_id || 0 : 0,
    node.resultRef?.asset_id === assetId ? node.resultRef?.version_id || 0 : 0,
  );
  const assetVersion = node.asset?.version;
  const document =
    (node.asset?.id === assetId && assetVersion && assetVersion.id === versionId
      ? parseWritingDocument(assetVersion.content)
      : null) || parseWritingDocument(output);
  if (!document || !assetId || !versionId) return snapshot;
  const revision = writingVersionRevision(assetVersion);
  const saved: WritingSnapshot = {
    work_asset_id: assetId,
    work_version_id: versionId,
    work_revision: revision,
    work_version: assetVersion?.version,
    work_updated_at: assetVersion?.updated_at || assetVersion?.created_at,
    document,
    run_id: document.active_run_id,
    request_id: document.active_request_id,
    status: document.status,
    ...(previous?.work_asset_id === assetId &&
    previous.work_version_id === versionId &&
    previous.work_revision === revision &&
    previous.run_id === document.active_run_id &&
    previous.request_id === document.active_request_id
      ? { checkpoint: previous.checkpoint, proposal: previous.proposal }
      : {}),
  };
  if (
    snapshot &&
    snapshot.work_asset_id === assetId &&
    snapshot.work_version_id === versionId &&
    snapshot.work_revision >= revision
  )
    return snapshot;
  return mergeWritingSnapshot(snapshot, saved);
}
function parseWritingProposal(value: unknown): WritingProposal | undefined {
  if (
    !isPlainRecord(value) ||
    typeof value.run_id !== "number" ||
    typeof value.work_asset_id !== "number" ||
    typeof value.work_version_id !== "number" ||
    !Number.isSafeInteger(value.work_revision) ||
    Number(value.work_revision) < 0 ||
    typeof value.replacement !== "string"
  )
    return undefined;
  if (
    [
      "unit_id",
      "section_id",
      "entity_id",
      "inspiration_id",
      "selected_text",
    ].some((key) => value[key] !== undefined && typeof value[key] !== "string")
  )
    return undefined;
  if (
    value.unit_version_id !== undefined &&
    typeof value.unit_version_id !== "number"
  )
    return undefined;
  return {
    run_id: value.run_id,
    work_asset_id: value.work_asset_id,
    work_version_id: value.work_version_id,
    work_revision: Number(value.work_revision),
    replacement: value.replacement,
    unit_id: value.unit_id,
    unit_version_id: value.unit_version_id,
    section_id: value.section_id,
    entity_id: value.entity_id,
    inspiration_id: value.inspiration_id,
    selected_text: value.selected_text,
  };
}
function validWritingPreviewValues(value: unknown): value is NonNullable<WritingPreview["values"]> {
  if (!isPlainRecord(value)) return false;
  return Object.entries(value).every(([path, entry]) => {
    if (/^preferences\.(chapter_words|planned_chapters)$/.test(path))
      return typeof entry === "number" && Number.isSafeInteger(entry) && entry >= 0;
    return /^outline\.(characters|locations|props)\.\d+\.id$/.test(path) && typeof entry === "string";
  });
}

export function writingPreviewFromOutput(
  output: unknown,
): WritingPreview | null {
  const value = parseMaybeJSON(output);
  if (!isPlainRecord(value) || !isPlainRecord(value.writing_preview))
    return null;
  const row = value.writing_preview;
  if (
    typeof row.work_asset_id !== "number" ||
    typeof row.run_id !== "number" ||
    typeof row.request_id !== "string" ||
    typeof row.step_request_id !== "string" ||
    typeof row.active_field !== "string" ||
    (row.phase !== undefined && row.phase !== "" && !["preferences", "direction", "characters", "background", "chapters", "body", "continuity"].includes(String(row.phase))) ||
    !isPlainRecord(row.fields) ||
    !Object.values(row.fields).every((text) => typeof text === "string") ||
    (row.values !== undefined && !validWritingPreviewValues(row.values)) ||
    (row.completed_sections !== undefined && (!Array.isArray(row.completed_sections) ||
      !row.completed_sections.every((section) => ["world", "locations", "props"].includes(section)) ||
      new Set(row.completed_sections).size !== row.completed_sections.length)) ||
    (row.active_field === ""
      ? Object.keys(row.fields).length > 0
      : !Object.prototype.hasOwnProperty.call(row.fields, row.active_field))
  )
    return null;
  if (
    ["unit_id", "section_id", "entity_id", "inspiration_id"].some(
      (key) => row[key] !== undefined && typeof row[key] !== "string",
    )
  )
    return null;
  return {
    work_asset_id: row.work_asset_id,
    run_id: row.run_id,
    request_id: row.request_id,
    step_request_id: row.step_request_id,
    phase: row.phase as WritingPreview["phase"],
    active_field: row.active_field,
    fields: row.fields as Record<string, string>,
    values: row.values as WritingPreview["values"],
    completed_sections: row.completed_sections as WritingPreview["completed_sections"],
    unit_id: row.unit_id,
    section_id: row.section_id,
    entity_id: row.entity_id,
    inspiration_id: row.inspiration_id,
  };
}

function writingConfirmedChapterCount(snapshot: WritingSnapshot | null): number {
  const checkpoint = snapshot?.checkpoint;
  const draft = checkpoint?.draft;
  const count = Number(draft?.accepted_count);
  if (!snapshot || snapshot.document.status !== "running" || !checkpoint || !draft ||
    !Number.isSafeInteger(count) || count <= 0 || !draft.units || count > draft.units.length ||
    count >= Number(checkpoint.count) || draft.expected_count !== checkpoint.count ||
    draft.run_id !== snapshot.run_id || draft.request_id !== checkpoint.request_id ||
    checkpoint.work_asset_id !== snapshot.work_asset_id || checkpoint.work_version_id !== snapshot.work_version_id ||
    checkpoint.work_revision !== snapshot.work_revision ||
    !(checkpoint.action === "generate_chapters" || checkpoint.action === "append" ||
      (checkpoint.action === "generate_outline" && checkpoint.phase === "chapters"))) return 0;
  return count;
}

/** 刷新或子请求交接时，从同一检查点恢复已确认章纲的展示，不提交目录。 */
export function writingConfirmedChapterPreview(snapshot: WritingSnapshot | null): WritingPreview | null {
  const count = writingConfirmedChapterCount(snapshot);
  const checkpoint = snapshot?.checkpoint;
  const draft = checkpoint?.draft;
  if (!snapshot || !checkpoint || !draft?.units || !count) return null;
  const fields: Record<string, string> = {};
  for (const [index, chapter] of draft.units.slice(0, count).entries()) {
    fields[`units.${index}.title`] = chapter.title;
    fields[`units.${index}.plan`] = chapter.plan;
  }
  return {
    work_asset_id: snapshot.work_asset_id, run_id: snapshot.run_id, request_id: snapshot.request_id,
    step_request_id: checkpoint.request_id || "", phase: checkpoint.phase,
    unit_id: checkpoint.unit_id, section_id: checkpoint.section_id, entity_id: checkpoint.entity_id,
    inspiration_id: checkpoint.inspiration_id, fields, active_field: `units.${count - 1}.plan`,
  };
}

/** 已提交阶段不能被上一步滞留的前缀覆盖，身份与 issued checkpoint 一起判定。 */
export function writingPreviewMatchesSnapshot(
  preview: WritingPreview | null,
  snapshot: WritingSnapshot | null,
): preview is WritingPreview {
  if (!preview || !snapshot || snapshot.document.status !== "running" ||
    preview.work_asset_id !== snapshot.work_asset_id ||
    preview.run_id !== snapshot.run_id || preview.request_id !== snapshot.request_id)
    return false;
  const checkpoint = snapshot.checkpoint;
  if (!checkpoint) return false;
  if (!checkpoint.issued || (preview.phase || "") !== (checkpoint.phase || "")) return false;
  if (checkpoint.request_id && preview.step_request_id !== checkpoint.request_id) return false;
  const unitId = checkpoint.phase === "continuity"
    ? checkpoint.continuity_unit_id || checkpoint.unit_id : checkpoint.unit_id;
  return !unitId || preview.unit_id === unitId;
}

/** 只比较同一正在执行步骤；提交阶段、新基线和终态沿用正常快照规则。 */
function sameWritingStepScope(current: WritingSnapshot, incoming: WritingSnapshot): boolean {
  const previous = current.checkpoint;
  const next = incoming.checkpoint;
  if (!previous || !next) return false;
  return current.document.status === "running" && incoming.document.status === "running" &&
    incoming.work_asset_id === current.work_asset_id &&
    incoming.work_version_id === current.work_version_id &&
    incoming.work_revision === current.work_revision &&
    incoming.run_id === current.run_id && incoming.request_id === current.request_id &&
    next.action === previous.action && next.phase === previous.phase &&
    next.completed === previous.completed && next.target === previous.target &&
    JSON.stringify(next.unit_ids) === JSON.stringify(previous.unit_ids) &&
    (["unit_id", "continuity_unit_id", "section_id", "entity_id", "inspiration_id", "selected_text"] as const).every(
      (key) => (next[key] || "") === (previous[key] || ""),
    );
}

/** status/SSE 可乱序到达；已确认章纲、修正预算和同进度的请求交接均不能倒退。 */
function isStaleWritingStepSnapshot(current: WritingSnapshot, incoming: WritingSnapshot): boolean {
  const previous = current.checkpoint;
  const next = incoming.checkpoint;
  const accepted = writingConfirmedChapterCount(current);
  const correction = previous?.correction_count || 0;
  if (!previous || !next || (!accepted && !correction) || !sameWritingStepScope(current, incoming))
    return false;
  const incomingAccepted = writingConfirmedChapterCount(incoming);
  // 首次执行尚未冻结 Count 的旧快照仍属于原章纲批次。
  const chapterBatch = accepted > 0 && (!next.count || next.count === previous.count);
  const correctionStep = (next.count || 0) === (previous.count || 0);
  const incomingCorrection = next.correction_count || 0;
  if (chapterBatch && incomingAccepted < accepted) return true;
  if (correctionStep && incomingCorrection < correction) return true;
  const sameProgress = incomingAccepted === accepted && incomingCorrection === correction;
  return sameProgress && previous.issued && !next.issued &&
    (chapterBatch || (correctionStep && correction > 0));
}

export function mergeWritingSnapshot(
  current: WritingSnapshot | null,
  incoming: WritingSnapshot,
): WritingSnapshot {
  if (!current || current.work_asset_id !== incoming.work_asset_id)
    return incoming;
  if (
    incoming.work_version_id < current.work_version_id ||
    (incoming.work_version_id === current.work_version_id &&
      (incoming.work_revision < current.work_revision ||
        (incoming.work_revision === current.work_revision &&
          current.run_id > incoming.run_id)))
  )
    return current;
  if (isStaleWritingStepSnapshot(current, incoming)) return current;
  return JSON.stringify(current) === JSON.stringify(incoming)
    ? current
    : incoming;
}
export function isStaleWritingNodePatch(
  current: SpaceCanvasNode | null | undefined,
  patch: Partial<SpaceCanvasNode>,
): boolean {
  if (
    !current ||
    !(
      (current.outputType || current.power?.outputType) === "story" ||
      parseWritingDocument(current.asset?.version?.content)
    )
  )
    return false;
  const currentId = current.asset?.id || current.resultRef?.asset_id;
  const incomingId = patch.asset?.id || patch.resultRef?.asset_id;
  const currentVersion =
    current.asset?.version_id || current.resultRef?.version_id || 0;
  const incomingVersion =
    patch.asset?.version_id || patch.resultRef?.version_id || 0;
  return Boolean(
    currentId &&
    currentId === incomingId &&
    incomingVersion > 0 &&
    (incomingVersion < currentVersion ||
      (incomingVersion === currentVersion &&
        parseWritingDocument(patch.asset?.version?.content) &&
        writingVersionRevision(patch.asset?.version) <
          writingVersionRevision(current.asset?.version))),
  );
}
export function isStaleWritingAsset(
  current: ProjectAsset,
  incoming: ProjectAsset,
): boolean {
  return (
    current.id === incoming.id &&
    (current.version_id > incoming.version_id ||
      (current.version_id === incoming.version_id &&
        Boolean(parseWritingDocument(incoming.version?.content)) &&
        writingVersionRevision(current.version) >
          writingVersionRevision(incoming.version))) &&
    Boolean(parseWritingDocument(current.version?.content))
  );
}

/** 修订存于资产封装中，画布轻量读取无需额外加载来源追溯。 */
export function writingVersionRevision(version?: {
  content?: unknown;
}): number {
  const content = parseMaybeJSON(version?.content);
  return isPlainRecord(content) ? Number(content.writing_revision || 0) : 0;
}

export function addWritingEntry(
  document: WritingDocument,
  selection: WritingSelection,
  fields: {
    title: string;
    description: string;
  },
): WritingDocument {
  const entitySection = writingEntitySection(selection);
  let next: WritingDocument;
  if (entitySection) {
    next = {
      ...document,
      outline: {
        ...document.outline,
        [entitySection]: [
          ...document.outline[entitySection],
          { id: `new:${crypto.randomUUID()}`, name: fields.title, description: fields.description },
        ],
      },
    };
  } else {
    const unit: WritingUnitEntry = {
      id: `new:${crypto.randomUUID()}`,
      unit_type: "chapter",
      title: fields.title,
      plan: fields.description,
      children: [],
      asset_id: 0,
      version_id: 0,
      has_body: false,
      continuity_valid: false,
      dependency_stale: false,
    };
    next = { ...document, units: [...document.units, unit] };
  }
  return next;
}

export function selectedWritingInspiration(document: WritingDocument) {
  return document.inspirations.find(
    (entry) => entry.id === document.selected_inspiration_id,
  );
}
export function canSelectWritingInspiration(
  document: WritingDocument,
  id: string,
): boolean {
  const candidate = document.inspirations.find((entry) => entry.id === id);
  return Boolean(
    candidate?.title.trim() &&
    candidate.content.trim() &&
    !document.selected_inspiration_id,
  );
}
export function writingStage(document: WritingDocument) {
  if (!selectedWritingInspiration(document)) return "inspiration";
  if (!writingPlanningComplete(document)) return "outline";
  return document.units.length ? "body" : "chapters";
}
export function defaultWritingSelection(
  _document: WritingDocument,
): WritingSelection {
  return { kind: "section", id: "overview" };
}
