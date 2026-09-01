import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { ParamFileLibraryRenderer } from "@/components/agent/stream-request-params";
import { toast } from "sonner";
import { joinSiteApi } from "@dever/front-plugin";
import { AgentChatPanel } from "../../show/agent-chat/index";
import { useAgentChatExecution } from "../../show/agent-chat/execution";
import type {
  AgentChatConversationState,
  AgentChatRuntimeApis,
} from "../../show/agent-chat/types";
import type { AgentChatApi } from "../../show/agent-chat/api";
import type {
  ReferenceInput,
  ReferenceUploadedFile,
} from "../../show/agent-chat/reference";
import { AssetParamPicker } from "../asset/asset-param-picker";
import { useAssetReferenceProvider } from "../asset/asset-reference-provider";
import type { AssetRecord } from "../asset/asset-types";
import type { AssetUploadOptions } from "../asset/asset-upload-progress";
import {
  BODY_UPLOAD_BIZ_KEY,
  BODY_UPLOAD_BIZ_NAME,
  saveBodyUploadedAssets,
} from "../asset/upload-asset-api";
import {
  loadScopedDialogueConfig,
  loadScopedDialoguePowerForm,
} from "../home/workbench-api";
import type {
  CanvasAssistant,
  SpaceCanvasNode,
  SpaceCanvasState,
  WorkProject,
  WorkTeam,
} from "./types";
import { clampSpaceAssistantWidth } from "./space-assistant-layout";
import "./space-assistant.css";

export function SpaceAssistant({
  assistant,
  project,
  team,
  activeAssetCateID,
  activeCanvas,
  selectedNodes,
  width,
  expanded,
  onWidthChange,
  onToggleExpanded,
  onClose,
  onFlushCanvas,
  onCanvasChanged,
  onUploadAssets,
}: {
  assistant: CanvasAssistant;
  project: WorkProject;
  team: WorkTeam;
  activeAssetCateID: number;
  activeCanvas: SpaceCanvasState;
  selectedNodes: SpaceCanvasNode[];
  width: number;
  expanded: boolean;
  onWidthChange: (width: number) => void;
  onToggleExpanded: () => void;
  onClose: () => void;
  onFlushCanvas: (canvas: SpaceCanvasState) => Promise<void>;
  onCanvasChanged: (canvasID: number) => void | Promise<void>;
  onUploadAssets: (
    files: File[],
    options?: AssetUploadOptions,
  ) => Promise<AssetRecord[]>;
}) {
  const api = useMemo(
    () => createSpaceAssistantApis(project.id, activeCanvas.id),
    [activeCanvas.id, project.id],
  );
  const loadConfig = useCallback(async () => {
    const config = await loadScopedDialogueConfig({
      api: api.config,
      cacheKey: `canvas-assistant:${project.id}:${activeCanvas.id}`,
    });
    return { ...config, categories: [] };
  }, [activeCanvas.id, api.config, project.id]);
  const loadToolForm = useCallback(
    (teamPowerID: number, sourceTargetID: number) =>
      loadScopedDialoguePowerForm({
        api: api.powerForm,
        cacheKey: `canvas-assistant:${project.id}:${activeCanvas.id}`,
        teamPowerID,
        sourceTargetID,
      }),
    [activeCanvas.id, api.powerForm, project.id],
  );
  const renderFileLibrary = useCallback<ParamFileLibraryRenderer>(
    (props) => <AssetParamPicker {...props} teamID={team.id} />,
    [team.id],
  );
  const execution = useAgentChatExecution({
    enabled: assistant.available && Boolean(assistant.agentKey),
    scopeKey: `canvas-assistant:${project.id}:${activeCanvas.id}:${assistant.roleID}`,
    toolIDField: "team_power_id",
    loadConfig,
    loadToolForm,
    renderFileLibrary,
  });
  const prepareExecutionInput = execution.prepareInput;
  const notifyExecutionStateChange = execution.onConversationStateChange;
  const assetReferenceProvider = useAssetReferenceProvider({
    teamID: team.id,
    scopeProjectID: project.id,
    initialFilters: {
      sourceType: "project",
      projectID: project.id,
      canvasID: activeCanvas.id,
    },
    onUpload: onUploadAssets,
  });
  const referenceProviders = useMemo(
    () => [assetReferenceProvider],
    [assetReferenceProvider],
  );
  const selectedNodeContext = useMemo(
    () => selectedNodes.slice(-12).map(canvasNodeAssistantContext),
    [selectedNodes],
  );
  const prepareInput = useCallback(
    async (input: ReferenceInput) => {
      await onFlushCanvas(activeCanvas);
      const prepared = prepareExecutionInput(input);
      return {
        ...prepared,
        canvas_context: {
          project_id: project.id,
          canvas_id: activeCanvas.id,
          project_name: project.name,
          asset_cate_id: activeAssetCateID,
          canvas_updated_at: activeCanvas.updatedAt || "",
          selected_nodes: selectedNodeContext,
        },
      };
    },
    [
      activeAssetCateID,
      activeCanvas,
      onFlushCanvas,
      prepareExecutionInput,
      project.id,
      project.name,
      selectedNodeContext,
    ],
  );
  const appliedCanvasChanges = useRef(new Set<string>());
  useEffect(() => {
    appliedCanvasChanges.current.clear();
  }, [activeCanvas.id, project.id]);
  const handleConversationStateChange = useCallback(
    (state: AgentChatConversationState) => {
      notifyExecutionStateChange(state);
      for (const message of state.messages) {
        for (const activity of message.activities || []) {
          const change = recordValue(activity.output.canvas_change);
          const canvasID = Number(change.canvas_id || activeCanvas.id || 0);
          const revision = String(change.revision || "");
          const key = `${canvasID}:${revision}`;
          if (!canvasID || !revision || appliedCanvasChanges.current.has(key)) {
            continue;
          }
          appliedCanvasChanges.current.add(key);
          void Promise.resolve(onCanvasChanged(canvasID)).catch((error) => {
            appliedCanvasChanges.current.delete(key);
            toast.error(
              error instanceof Error ? error.message : "刷新画布失败，请重试",
            );
          });
        }
      }
    },
    [activeCanvas.id, notifyExecutionStateChange, onCanvasChanged],
  );
  const saveUploadedFiles = useCallback(
    async (files: ReferenceUploadedFile[]) => {
      await saveBodyUploadedAssets({
        teamID: team.id,
        projectID: project.id,
        canvasID: activeCanvas.id,
        files,
      });
    },
    [activeCanvas.id, project.id, team.id],
  );
  const dragCleanupRef = useRef<(() => void) | null>(null);
  useEffect(() => () => dragCleanupRef.current?.(), []);
  const startResize = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      event.preventDefault();
      dragCleanupRef.current?.();
      const move = (pointerEvent: PointerEvent) => {
        onWidthChange(
          clampSpaceAssistantWidth(window.innerWidth - pointerEvent.clientX),
        );
      };
      const stop = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", stop);
        dragCleanupRef.current = null;
      };
      dragCleanupRef.current = stop;
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", stop, { once: true });
    },
    [onWidthChange],
  );

  return (
    <aside
      id="workspace-canvas-assistant"
      className={`ws-assistant-panel ${expanded ? "is-expanded" : ""}`}
      style={{ "--ws-assistant-panel-width": `${width}px` } as CSSProperties}
      aria-label={assistant.name || "画布助手"}
    >
      {!expanded ? (
        <div
          className="ws-assistant-resizer"
          role="separator"
          aria-orientation="vertical"
          aria-label="调整对话面板宽度"
          onPointerDown={startResize}
        />
      ) : null}
      <AgentChatPanel
        agentKey={assistant.agentKey}
        agentName={assistant.name}
        contextKey={`project-canvas:${project.id}:canvas:${activeCanvas.id}:team:${team.id}:role:${assistant.roleID}`}
        open
        appearance="canvas"
        navigationMode="internal"
        expanded={expanded}
        height="100%"
        minHeight="0"
        lazySession
        proactiveOpening={assistant.openingEnabled}
        uploadBizKey={BODY_UPLOAD_BIZ_KEY}
        uploadBizName={BODY_UPLOAD_BIZ_NAME}
        allowResourceLibrary={false}
        composerDisabled={execution.disabled}
        composerToolbar={execution.toolbar}
        composerParameters={execution.parameters}
        composerParameterScopeKey={execution.parameterScopeKey}
        renderFileLibrary={execution.renderFileLibrary}
        prepareInput={prepareInput}
        onConversationStateChange={handleConversationStateChange}
        onUploadedFiles={saveUploadedFiles}
        assistantApi={api.assistant}
        runtimeApi={api.runtime}
        requestScope={{
          project_id: project.id,
          canvas_id: activeCanvas.id,
          asset_cate_id: activeAssetCateID,
          selected_node_ids: selectedNodes.map((node) => node.id),
        }}
        referenceProviders={referenceProviders}
        onToggleExpanded={onToggleExpanded}
        onClose={onClose}
      />
    </aside>
  );
}

function createSpaceAssistantApis(projectID: number, canvasID: number) {
  const scoped = (path: string) => {
    const api = joinSiteApi(`workspace/${path}`);
    const query = new URLSearchParams({
      project_id: String(projectID),
      canvas_id: String(canvasID),
    });
    return `${api}${api.includes("?") ? "&" : "?"}${query.toString()}`;
  };
  return {
    config: scoped("assistant_config"),
    powerForm: scoped("assistant_power_form"),
    assistant: {
      session: scoped("assistant_session"),
      sessions: scoped("assistant_sessions"),
      newSession: scoped("assistant_new_session"),
      renameSession: scoped("assistant_rename_session"),
      archiveSession: scoped("assistant_archive_session"),
    } satisfies AgentChatApi,
    runtime: {
      request: scoped("assistant_run"),
      opening: scoped("assistant_opening"),
      stream: scoped("assistant_stream"),
      stop: scoped("assistant_stop"),
      status: scoped("assistant_status"),
      referencePreview: scoped("assistant_reference_preview"),
      inputConfig: scoped("assistant_input_config"),
      document: scoped("assistant_document"),
      documentStream: scoped("assistant_document_stream"),
    } satisfies AgentChatRuntimeApis,
  };
}

function canvasNodeAssistantContext(node: SpaceCanvasNode) {
  return {
    id: node.id,
    type: node.type,
    title: node.title,
    asset_cate_id: node.assetCateId || 0,
    role_id: node.role?.id || 0,
    power_id: node.power?.id || 0,
    flow_id: node.flow?.id || 0,
  };
}

function recordValue(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
