import {
  isWritingOutlineSection,
  type WritingDocument,
  type WritingPreview,
} from "./writing-document";
import { validWritingPreferences } from "./writing-preferences";

/** 同一步的可读字段累积成展示文档；始终不写回已保存的创作内容。 */
export function projectWritingPreview(
  document: WritingDocument,
  preview: WritingPreview | null,
  action?: string,
  unitIds?: string[],
): WritingDocument {
  if (!preview || !Object.keys(preview.fields).length) return document;
  const projected: WritingDocument = { ...document };
  // 只复制真正写入的分支，偏好/正文前缀不使整份目录失效。
  const outlineEntities = (
    section: "characters" | "locations" | "props",
    index: number,
    id: string,
  ) => {
    if (projected.outline === document.outline)
      projected.outline = { ...document.outline };
    if (projected.outline[section] === document.outline[section])
      projected.outline[section] = [...document.outline[section]];
    const entries = projected.outline[section];
    if (!entries[index]) entries[index] = { id, name: "", description: "" };
    else if (entries[index] === document.outline[section][index])
      entries[index] = { ...entries[index] };
    return entries[index];
  };
  const projectedUnit = (index: number) => {
    if (projected.units === document.units)
      projected.units = [...document.units];
    if (!projected.units[index])
      projected.units[index] = {
        id: "",
        title: "",
        plan: "",
        unit_type: "chapter",
        children: [],
        asset_id: 0,
        version_id: 0,
        has_body: false,
        continuity_valid: false,
        dependency_stale: false,
      };
    else if (projected.units[index] === document.units[index])
      projected.units[index] = { ...projected.units[index] };
    return projected.units[index];
  };
  const values = preview.values || {};
  // 已完成身份/引用属于同一前缀快照，先接回 canonical 引用，再填入文字。
  for (const section of ["characters", "locations", "props"] as const) {
    for (let index = 0; ; index++) {
      const id = values[`outline.${section}.${index}.id`];
      if (typeof id !== "string") break;
      outlineEntities(section, index, id).id = id;
    }
  }
  for (const [rawField, text] of Object.entries(preview.fields)) {
    const field = rawField.replace(/\[(\d+)\]/g, ".$1");
    const preference =
      /^preferences\.(genre|style|style_instructions|pov|mode|chapter_words|planned_chapters)$/.exec(
        field,
      );
    if (preference) {
      const key = preference[1] as keyof WritingDocument["preferences"];
      if (document.preferences[key]) continue;
      const value =
        key === "chapter_words" || key === "planned_chapters"
          ? values[field]
          : text;
      const next = { ...projected.preferences, [key]: value };
      if (validWritingPreferences(next)) projected.preferences = next;
      continue;
    }
    const inspiration = /^inspirations\.(\d+)\.(title|content)$/.exec(field);
    const unit = /^units\.(\d+)\.(title|plan)$/.exec(field);
    const entity =
      /^(?:outline\.(characters|locations|props)|entities)\.(\d+)\.(name|description)$/.exec(
        field,
      );
    const outlineField = field.startsWith("outline.")
      ? field.slice(8)
      : field === "content"
        ? preview.section_id
        : undefined;
    if (outlineField && isWritingOutlineSection(outlineField)) {
      if (projected.outline === document.outline)
        projected.outline = { ...document.outline };
      projected.outline[outlineField] = text;
    } else if (inspiration) {
      const index = preview.inspiration_id
        ? projected.inspirations.findIndex(
            (entry) => entry.id === preview.inspiration_id,
          )
        : Number(inspiration[1]);
      if (index < 0) continue;
      if (projected.inspirations === document.inspirations)
        projected.inspirations = [...document.inspirations];
      if (
        projected.inspirations[index] &&
        projected.inspirations[index] === document.inspirations[index]
      )
        projected.inspirations[index] = { ...projected.inspirations[index] };
      projected.inspirations[index] ||= { id: "", title: "", content: "" };
      projected.inspirations[index][inspiration[2] as "title" | "content"] =
        text;
    } else if (unit) {
      const localIndex = Number(unit[1]);
      const index =
        action === "generate_chapters" && unitIds?.length
          ? projected.units.findIndex(
              (entry) => entry.id === unitIds[localIndex],
            )
          : localIndex + (action === "append" ? document.units.length : 0);
      if (
        index < 0 ||
        (unitIds?.length &&
          action === "generate_chapters" &&
          !unitIds[localIndex])
      )
        continue;
      projectedUnit(index)[unit[2] as "title" | "plan"] = text;
    } else if (entity) {
      const section = entity[1] || preview.section_id;
      if (
        section !== "characters" &&
        section !== "locations" &&
        section !== "props"
      )
        continue;
      const index = preview.entity_id
        ? projected.outline[section].findIndex(
            (entry) => entry.id === preview.entity_id,
          )
        : Number(entity[2]);
      if (index < 0) continue;
      outlineEntities(section, index, `preview:${section}:${index}`)[
        entity[3] as "name" | "description"
      ] = text;
    } else if (
      preview.section_id === "chapter_plan" &&
      preview.unit_id &&
      field === "plan"
    ) {
      const index = projected.units.findIndex(
        (entry) => entry.id === preview.unit_id,
      );
      if (index >= 0) projectedUnit(index).plan = text;
    }
  }
  return projected;
}
