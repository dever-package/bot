import { joinSiteApi, request } from "@dever/front-plugin";
import { isSuccessResponse } from "../shared/api-response";
import { createInFlightRequestLoader } from "../shared/in-flight-request";

export type ProjectView = "works" | "trash";

export type ProjectItem = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type ProjectPage = {
  items: ProjectItem[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
};

const loadProjectPageRequest = createInFlightRequestLoader<ProjectPage>();

export type ProjectMetadataInput = {
  name: string;
  description: string;
};

export function loadProjectList(
  teamID: number,
  view: ProjectView,
  page = 1,
  pageSize = 24,
) {
  const key = JSON.stringify({ teamID, view, page, pageSize });
  return loadProjectPageRequest(key, async () => {
    const data = await projectRequest(
      view === "trash" ? "trash" : "list",
      "get",
      { team_id: teamID, page, page_size: pageSize },
      view === "trash" ? "加载回收站失败" : "加载作品失败",
    );
    return {
      items: toRows(data.items).map(normalizeProject).filter(hasProjectID),
      page: positiveNumber(data.page, page),
      pageSize: positiveNumber(data.page_size, pageSize),
      total: nonNegativeNumber(data.total),
      hasMore: Boolean(data.has_more),
    };
  });
}

export async function createProject(
  teamID: number,
  input: ProjectMetadataInput,
) {
  return projectRequest(
    "create",
    "post",
    {
      team_id: teamID,
      name: input.name,
      description: input.description,
    },
    "创建作品失败",
  );
}

export async function updateProject(
  projectID: number,
  input: ProjectMetadataInput,
) {
  return projectRequest(
    "update",
    "post",
    {
      id: projectID,
      name: input.name,
      description: input.description,
    },
    "更新作品失败",
  );
}

export async function moveProjectToTrash(projectID: number) {
  return projectRequest("delete", "post", { id: projectID }, "删除作品失败");
}

export async function restoreProject(projectID: number) {
  return projectRequest("restore", "post", { id: projectID }, "恢复作品失败");
}

async function projectRequest(
  path: string,
  method: "get" | "post",
  payload: Record<string, unknown>,
  fallback: string,
) {
  const result = await request(joinSiteApi(`project/${path}`), method, payload);
  if (!isSuccessResponse(result)) {
    throw new Error(String(result?.message || result?.msg || fallback));
  }
  return isRecord(result?.data) ? result.data : {};
}

function normalizeProject(value: unknown): ProjectItem {
  const project = isRecord(value) ? value : {};
  return {
    id: numberValue(project.id),
    name: textValue(project.name) || "未命名作品",
    description: textValue(project.description),
    createdAt: textValue(project.created_at),
    updatedAt: textValue(project.updated_at),
    deletedAt: textValue(project.deleted_at),
  };
}

function hasProjectID(project: ProjectItem) {
  return project.id > 0;
}

function toRows(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function numberValue(value: unknown) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function positiveNumber(value: unknown, fallback: number) {
  return numberValue(value) || fallback;
}

function nonNegativeNumber(value: unknown) {
  const parsed = Number(value || 0);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

function textValue(value: unknown) {
  return value == null ? "" : String(value).trim();
}
