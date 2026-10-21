import type { ReactNode } from "react";
import { Copy, History, Save } from "lucide-react";
import {
  DetailVersionSelect,
  formatDetailVersionTime,
} from "../shared/detail-dialog";
import { NodeDetailHeader } from "../space/node-detail/node-detail-header";
import type { SpaceCanvasNode } from "../space/types";
import type { useWritingEditor } from "./use-writing-editor";
import type { useWritingVersions } from "./use-writing-versions";
import { writingProfile, writingStage } from "./writing-document";

export function WritingEditorHeader({
  editor,
  titleStatus,
  versions,
  node,
  mutationDisabled,
  navigationDisabled,
  previewReadonly,
  onClose,
  onRuns,
  onSelectVersion: selectVersion,
}: {
  editor: ReturnType<typeof useWritingEditor>;
  titleStatus?: ReactNode;
  versions: ReturnType<typeof useWritingVersions>;
  node: SpaceCanvasNode;
  mutationDisabled: boolean;
  navigationDisabled: boolean;
  previewReadonly: boolean;
  onClose: () => void;
  onRuns: () => void;
  onSelectVersion: (id: number) => Promise<void>;
}) {
  const { snapshot, viewSnapshot, document, draft, conflicted } = editor;
  const profile = writingProfile;
  const leaves = document ? document.units : [];
  const saving = draft.status === "saving";
  const selectedVersion = versions.versions.find(
    (version) => version.id === viewSnapshot?.work_version_id,
  );
  return (
    <NodeDetailHeader
      node={
        document && node.titleMode === "auto"
          ? { ...node, title: document.title }
          : node
      }
      titleStatus={titleStatus}
      contentLabel={
        document
          ? leaves.length
            ? `${leaves.filter((unit) => unit.has_body).length}/${leaves.length} ${profile.unit}正文`
            : writingStage(document) === "inspiration"
              ? "选择灵感"
              : writingStage(document) === "outline"
                ? "大纲"
                : "剧情规划"
          : profile.title
      }
      updatedAt={formatDetailVersionTime(
        viewSnapshot?.work_updated_at ||
          selectedVersion?.updated_at ||
          selectedVersion?.created_at ||
          node.asset?.version?.updated_at,
      )}
      status={draft.status}
      readonly={previewReadonly}
      onRetry={() => {
        if (!mutationDisabled && !saving && !conflicted) void draft.retry();
      }}
      onClose={onClose}
      versionSelect={
        snapshot && (
          <DetailVersionSelect
            options={versions.versions.map((version) => ({
              id: version.id,
              version: version.version,
              updatedAt: String(
                (version.id === snapshot.work_version_id
                  ? snapshot.work_updated_at
                  : undefined) ||
                  version.updated_at ||
                  version.created_at ||
                  "",
              ),
              value: version,
            }))}
            currentVersionId={snapshot.work_version_id}
            selectedVersionId={
              viewSnapshot?.work_version_id || snapshot.work_version_id
            }
            total={versions.total}
            hasMore={versions.hasMore}
            loading={versions.loading}
            loadingMore={versions.loadingMore}
            error={versions.error}
            disabled={navigationDisabled}
            onSelect={(version) => void selectVersion(version.id)}
            onLoadMore={versions.onLoadMore}
            onRetry={versions.onRetry}
          />
        )
      }
      actions={
        document && (
          <>
            <button
              type="button"
              className="wb-detail-command"
              aria-label="保存为新版本"
              disabled={mutationDisabled || saving || conflicted}
              onClick={() => void editor.action("create_version")}
            >
              <Copy size={14} />
              <span>保存为新版本</span>
            </button>
            <button
              type="button"
              className="wb-detail-command"
              aria-label={draft.status === "error" ? "重试保存" : "保存"}
              disabled={
                mutationDisabled ||
                saving ||
                conflicted ||
                !draft.hasPendingChanges
              }
              onClick={() =>
                void (draft.status === "error" ? draft.retry() : draft.flush())
              }
            >
              <Save size={14} />
              <span>{draft.status === "error" ? "重试保存" : "保存"}</span>
            </button>
            <button
              type="button"
              className="wb-detail-command"
              aria-label="运行记录"
              disabled={navigationDisabled}
              onClick={async () => {
                if (await draft.flush()) onRuns();
              }}
            >
              <History size={14} />
              <span>运行记录</span>
            </button>
          </>
        )
      }
    />
  );
}
