import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Loader2, RefreshCw } from "lucide-react";
import {
  isPromptParam,
  type ParamFileLibraryRenderer,
  type PowerParam,
  type PowerParamConfig,
} from "@/components/agent/stream-request-params";
import { isManualPowerSourceRule } from "../../shared/power-source-rule";
import type { PowerCategory } from "../../body-work/shared/power-menu";
import type { ReferenceInput } from "./reference";
import type { AgentChatConversationState, ChatMessage } from "./types";
import {
  AgentChatExecutionPowerPicker,
  AgentChatExecutionSourcePicker,
  type AgentChatExecutionSelection,
  type AgentChatExecutionTool,
} from "./execution-picker";

type ScopedConversationExecution = {
  scopeKey: string;
  sessionID: number;
  messageIdentity: string;
  execution?: Record<string, unknown>;
};

type PendingExecution = {
  scopeKey: string;
  sessionID: number;
};

export type AgentChatExecutionConfig = {
  modelSourceRule: number;
  modelSources: Array<{ id: number; name: string }>;
  selectedModelTargetID: number;
  toolsEnabled: boolean;
  tools: AgentChatExecutionTool[];
  categories: PowerCategory[];
};

export type AgentChatExecutionController = {
  disabled: boolean;
  toolbar: ReactNode;
  parameters: PowerParam[] | undefined;
  parameterScopeKey: string;
  prepareInput: (input: ReferenceInput) => ReferenceInput;
  renderFileLibrary?: ParamFileLibraryRenderer;
  onConversationStateChange: (state: AgentChatConversationState) => void;
};

export function useAgentChatExecution({
  enabled,
  scopeKey,
  toolIDField,
  loadConfig,
  loadToolForm,
  renderFileLibrary,
}: {
  enabled: boolean;
  scopeKey: string;
  toolIDField: string;
  loadConfig: () => Promise<AgentChatExecutionConfig>;
  loadToolForm: (
    toolID: number,
    sourceTargetID: number,
  ) => Promise<PowerParamConfig>;
  renderFileLibrary?: ParamFileLibraryRenderer;
}): AgentChatExecutionController {
  const [config, setConfig] = useState<AgentChatExecutionConfig | null>(null);
  const [configScopeKey, setConfigScopeKey] = useState("");
  const [configRequestVersion, setConfigRequestVersion] = useState(0);
  const [configLoading, setConfigLoading] = useState(enabled);
  const [configError, setConfigError] = useState("");
  const [modelTargetID, setModelTargetID] = useState(0);
  const [toolSelection, setToolSelection] =
    useState<AgentChatExecutionSelection>("auto");
  const [toolTargetID, setToolTargetID] = useState(0);
  const [toolForm, setToolForm] = useState<{
    toolID: number;
    config: PowerParamConfig;
  } | null>(null);
  const [toolFormLoading, setToolFormLoading] = useState(false);
  const [toolFormError, setToolFormError] = useState("");
  const [toolRequestVersion, setToolRequestVersion] = useState(0);
  const [conversation, setConversation] =
    useState<ScopedConversationExecution>({
      scopeKey: "",
      sessionID: 0,
      messageIdentity: "",
    });
  const appliedConversationRef = useRef("");
  const pendingExecutionRef = useRef<PendingExecution | null>(null);
  const activeExecutionRef = useRef<Record<string, unknown> | null>(null);
  const activeConfig = configScopeKey === scopeKey ? config : null;
  const toolsEnabled = Boolean(activeConfig?.toolsEnabled);
  const activeToolForm =
    toolsEnabled &&
    typeof toolSelection === "number" &&
    toolForm?.toolID === toolSelection
      ? toolForm.config
      : null;
  const missingAgentModel = requiresSourceTarget(
    activeConfig?.modelSourceRule,
    modelTargetID,
  );
  const missingToolModel =
    toolsEnabled &&
    typeof toolSelection === "number" &&
    requiresSourceTarget(activeToolForm?.sourceRule, toolTargetID);

  useEffect(() => {
    let active = true;
    setConfig(null);
    setConfigScopeKey("");
    setConfigLoading(enabled);
    setConfigError("");
    setToolForm(null);
    setToolFormError("");
    setToolSelection("auto");
    setToolTargetID(0);
    pendingExecutionRef.current = null;
    activeExecutionRef.current = null;
    appliedConversationRef.current = "";
    if (!enabled) {
      return () => {
        active = false;
      };
    }
    void loadConfig()
      .then((next) => {
        if (!active) return;
        setConfig(next);
        setConfigScopeKey(scopeKey);
        setModelTargetID(next.selectedModelTargetID);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setConfigError(errorMessage(error, "加载对话配置失败"));
      })
      .finally(() => {
        if (active) setConfigLoading(false);
      });
    return () => {
      active = false;
    };
  }, [configRequestVersion, enabled, loadConfig, scopeKey]);

  useEffect(() => {
    if (!enabled || !activeConfig || conversation.scopeKey !== scopeKey) {
      return;
    }
    const conversationIdentity = `${scopeKey}:${conversation.sessionID}:${
      conversation.messageIdentity || "empty"
    }`;
    if (appliedConversationRef.current === conversationIdentity) return;
    const pendingExecution = pendingExecutionRef.current;
    if (
      !conversation.messageIdentity &&
      pendingExecution &&
      pendingExecution.scopeKey === scopeKey &&
      (pendingExecution.sessionID === 0 ||
        pendingExecution.sessionID === conversation.sessionID)
    ) {
      return;
    }
    if (pendingExecution) pendingExecutionRef.current = null;

    appliedConversationRef.current = conversationIdentity;
    const execution = conversation.execution;
    activeExecutionRef.current = execution ? { ...execution } : null;
    setModelTargetID(resolveModelTargetID(activeConfig, execution));
    const restoredTool = resolveToolSelection(
      activeConfig,
      execution,
      toolIDField,
    );
    setToolSelection(restoredTool.selection);
    setToolTargetID(restoredTool.targetID);
    setToolForm(null);
    setToolFormError("");
  }, [
    activeConfig,
    conversation.execution,
    conversation.messageIdentity,
    conversation.scopeKey,
    conversation.sessionID,
    enabled,
    scopeKey,
    toolIDField,
  ]);

  const updateConversationState = useCallback(
    (state: AgentChatConversationState) => {
      if (!enabled) return;
      const latestExecution = latestUserExecution(
        state.messages,
        toolIDField,
      );
      const next: ScopedConversationExecution = {
        scopeKey,
        sessionID: state.sessionID,
        messageIdentity: latestExecution?.messageIdentity || "",
        execution: latestExecution?.execution,
      };
      setConversation((current) =>
        current.scopeKey === next.scopeKey &&
        current.sessionID === next.sessionID &&
        current.messageIdentity === next.messageIdentity
          ? current
          : next,
      );
    },
    [enabled, scopeKey, toolIDField],
  );

  useEffect(() => {
    if (!enabled || !toolsEnabled || typeof toolSelection !== "number") {
      setToolForm(null);
      setToolFormLoading(false);
      setToolFormError("");
      return;
    }
    if (
      toolForm?.toolID === toolSelection &&
      Number(toolForm.config.selectedSourceID) === toolTargetID
    ) {
      return;
    }

    let active = true;
    setToolFormLoading(true);
    setToolFormError("");
    const requestForm = async () => {
      try {
        return await loadToolForm(toolSelection, toolTargetID);
      } catch (error: unknown) {
        if (!toolTargetID) throw error;
        return loadToolForm(toolSelection, 0);
      }
    };
    void requestForm()
      .then((next) => {
        if (!active) return;
        setToolForm({ toolID: toolSelection, config: next });
        setToolTargetID(Number(next.selectedSourceID || 0));
      })
      .catch((error: unknown) => {
        if (!active) return;
        setToolForm(null);
        setToolFormError(errorMessage(error, "加载工具参数失败"));
      })
      .finally(() => {
        if (active) setToolFormLoading(false);
      });
    return () => {
      active = false;
    };
  }, [
    enabled,
    loadToolForm,
    toolForm,
    toolRequestVersion,
    toolSelection,
    toolTargetID,
    toolsEnabled,
  ]);

  const parameters = useMemo(() => {
    if (!enabled || !toolsEnabled || typeof toolSelection !== "number") {
      return undefined;
    }
    if (!activeToolForm) return [];
    return restoreToolParameterDefaults(
      activeToolForm.params.filter((param) => !isPromptParam(param)),
      conversation.execution,
      toolSelection,
      toolIDField,
      toolTargetID,
    );
  }, [
    activeToolForm,
    conversation.execution,
    enabled,
    toolIDField,
    toolSelection,
    toolTargetID,
    toolsEnabled,
  ]);

  const selectTool = useCallback(
    (selection: AgentChatExecutionSelection) => {
      if (selection === toolSelection) return;
      setToolSelection(selection);
      setToolTargetID(0);
      setToolForm(null);
      setToolFormError("");
      setToolRequestVersion((current) => current + 1);
    },
    [toolSelection],
  );

  const selectToolTarget = useCallback(
    (targetID: number) => {
      if (targetID === toolTargetID) return;
      setToolTargetID(targetID);
      setToolFormError("");
      setToolRequestVersion((current) => current + 1);
    },
    [toolTargetID],
  );

  const retryLoading = useCallback(() => {
    if (configError) {
      setConfigRequestVersion((current) => current + 1);
      return;
    }
    setToolForm(null);
    setToolFormError("");
    setToolRequestVersion((current) => current + 1);
  }, [configError]);

  const prepareInput = useCallback(
    (input: ReferenceInput) => {
      if (!enabled) return input;
      const content = { ...input.content };
      if (isRecord(content.interaction_response)) {
        const execution = activeExecutionRef.current
          ? { ...activeExecutionRef.current }
          : null;
        if (execution) {
          content.execution = execution;
        } else {
          delete content.execution;
        }
        delete content.params;
        pendingExecutionRef.current = {
          scopeKey,
          sessionID: conversation.sessionID,
        };
        return { ...input, content, params: undefined };
      }
      if (missingAgentModel) {
        throw new Error("当前对话没有可用模型");
      }
      const execution: Record<string, unknown> = {
        model_target_id: modelTargetID,
        tool_mode: toolsEnabled ? toolMode(toolSelection) : "none",
      };
      if (toolsEnabled && typeof toolSelection === "number") {
        if (!activeToolForm || toolFormLoading || toolFormError) {
          throw new Error(toolFormError || "工具参数尚未加载完成");
        }
        execution[toolIDField] = toolSelection;
        if (missingToolModel) {
          throw new Error("当前工具没有可用模型");
        }
        execution.tool_target_id = toolTargetID;
        execution.tool_params = { ...(input.params || {}) };
        delete content.params;
      }
      content.execution = execution;
      pendingExecutionRef.current = {
        scopeKey,
        sessionID: conversation.sessionID,
      };
      activeExecutionRef.current = execution;
      return toolsEnabled && typeof toolSelection === "number"
        ? { ...input, content, params: undefined }
        : { ...input, content };
    },
    [
      activeToolForm,
      conversation.sessionID,
      enabled,
      missingAgentModel,
      missingToolModel,
      modelTargetID,
      scopeKey,
      toolFormError,
      toolFormLoading,
      toolIDField,
      toolSelection,
      toolTargetID,
      toolsEnabled,
    ],
  );

  const conversationParameterScopeKey =
    conversation.scopeKey === scopeKey
      ? `${scopeKey}:session:${conversation.sessionID}`
      : `${scopeKey}:session:pending`;
  const showExecutionToolbar =
    configLoading ||
    Boolean(configError) ||
    toolsEnabled ||
    canChooseSource(
      activeConfig?.modelSourceRule,
      activeConfig?.modelSources,
    );

  return {
    disabled:
      enabled &&
      (configLoading ||
        Boolean(configError) ||
        !activeConfig ||
        missingAgentModel ||
        (toolsEnabled &&
          typeof toolSelection === "number" &&
          (toolFormLoading ||
            Boolean(toolFormError) ||
            !activeToolForm ||
            missingToolModel))),
    toolbar: enabled && showExecutionToolbar ? (
      <AgentChatExecutionControls
        config={activeConfig}
        configLoading={configLoading}
        configError={configError}
        modelTargetID={modelTargetID}
        toolSelection={toolSelection}
        toolTargetID={toolTargetID}
        toolForm={activeToolForm}
        toolFormLoading={toolFormLoading}
        toolFormError={toolFormError}
        onModelChange={setModelTargetID}
        onToolChange={selectTool}
        onToolTargetChange={selectToolTarget}
        onRetry={retryLoading}
      />
    ) : null,
    parameters,
    // Parameter controls belong to the unsent conversation draft. Switching
    // tools or model sources must not discard values already entered there.
    parameterScopeKey: conversationParameterScopeKey,
    prepareInput,
    renderFileLibrary,
    onConversationStateChange: updateConversationState,
  };
}

function AgentChatExecutionControls({
  config,
  configLoading,
  configError,
  modelTargetID,
  toolSelection,
  toolTargetID,
  toolForm,
  toolFormLoading,
  toolFormError,
  onModelChange,
  onToolChange,
  onToolTargetChange,
  onRetry,
}: {
  config: AgentChatExecutionConfig | null;
  configLoading: boolean;
  configError: string;
  modelTargetID: number;
  toolSelection: AgentChatExecutionSelection;
  toolTargetID: number;
  toolForm: PowerParamConfig | null;
  toolFormLoading: boolean;
  toolFormError: string;
  onModelChange: (value: number) => void;
  onToolChange: (value: AgentChatExecutionSelection) => void;
  onToolTargetChange: (value: number) => void;
  onRetry: () => void;
}) {
  const toolSources = useMemo(
    () =>
      (toolForm?.sources || [])
        .map((source) => ({ id: Number(source.id), name: source.name }))
        .filter((source) => source.id > 0),
    [toolForm?.sources],
  );
  const toolsEnabled = Boolean(config?.toolsEnabled);
  const error = configError || (toolsEnabled ? toolFormError : "");
  const showAgentModel =
    (!toolsEnabled || typeof toolSelection !== "number") &&
    canChooseSource(config?.modelSourceRule, config?.modelSources);
  const showToolModel =
    toolsEnabled &&
    typeof toolSelection === "number" &&
    canChooseSource(toolForm?.sourceRule, toolSources);

  return (
    <div className="agent-chat-execution-controls">
      {toolsEnabled ? (
        <div className="agent-chat-execution-picker">
          <AgentChatExecutionPowerPicker
            value={toolSelection}
            powers={config?.tools || []}
            categories={config?.categories || []}
            onValueChange={onToolChange}
          />
        </div>
      ) : null}
      {showAgentModel ? (
        <div className="agent-chat-execution-picker">
          <AgentChatExecutionSourcePicker
            value={modelTargetID}
            options={config?.modelSources || []}
            ariaLabel="选择智能体模型"
            onValueChange={onModelChange}
          />
        </div>
      ) : null}
      {showToolModel ? (
        <div className="agent-chat-execution-picker">
          <AgentChatExecutionSourcePicker
            value={toolTargetID}
            options={toolSources}
            ariaLabel="选择工具模型"
            onValueChange={onToolTargetChange}
          />
        </div>
      ) : null}
      {configLoading || (toolsEnabled && toolFormLoading) ? (
        <Loader2
          className="agent-chat-execution-loading animate-spin"
          aria-label="正在加载执行配置"
        />
      ) : null}
      {error ? (
        <span className="agent-chat-execution-error" title={error}>
          {error}
        </span>
      ) : null}
      {error ? (
        <button
          type="button"
          className="agent-chat-execution-retry"
          aria-label="重新加载执行配置"
          title="重新加载"
          onClick={onRetry}
        >
          <RefreshCw />
        </button>
      ) : null}
    </div>
  );
}

function latestUserExecution(messages: ChatMessage[], toolIDField: string) {
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role !== "user") continue;
    const storedExecution = isRecord(message.content?.execution)
      ? message.content.execution
      : undefined;
    const execution =
      storedExecution && message.content?.interaction_response
        ? restorePreviousToolParams(
            messages,
            index,
            storedExecution,
            toolIDField,
          )
        : storedExecution;
    return {
      messageIdentity: String(message.recordID || message.id),
      execution,
    };
  }
  return null;
}

function restorePreviousToolParams(
  messages: ChatMessage[],
  latestIndex: number,
  execution: Record<string, unknown>,
  toolIDField: string,
) {
  if (
    String(execution.tool_mode || "").trim() !== "specific" ||
    isRecord(execution.tool_params)
  ) {
    return execution;
  }
  const toolID = Number(execution[toolIDField] || 0);
  const targetID = Number(execution.tool_target_id || 0);
  if (!toolID) return execution;

  for (let index = latestIndex - 1; index >= 0; index -= 1) {
    const message = messages[index];
    if (message.role !== "user") continue;
    const previous = message.content?.execution;
    if (
      !isRecord(previous) ||
      String(previous.tool_mode || "").trim() !== "specific" ||
      Number(previous[toolIDField] || 0) !== toolID ||
      Number(previous.tool_target_id || 0) !== targetID ||
      !isRecord(previous.tool_params)
    ) {
      continue;
    }
    return { ...execution, tool_params: previous.tool_params };
  }
  return execution;
}

function resolveModelTargetID(
  config: AgentChatExecutionConfig,
  execution: Record<string, unknown> | undefined,
) {
  if (!isManualPowerSourceRule(config.modelSourceRule)) return 0;
  const requested = Number(execution?.model_target_id || 0);
  return config.modelSources.some((source) => source.id === requested)
    ? requested
    : config.selectedModelTargetID;
}

function resolveToolSelection(
  config: AgentChatExecutionConfig,
  execution: Record<string, unknown> | undefined,
  toolIDField: string,
) {
  if (config.toolsEnabled === false) {
    return { selection: "auto" as const, targetID: 0 };
  }
  const mode = String(execution?.tool_mode || "auto").trim();
  if (mode === "specific") {
    const toolID = Number(execution?.[toolIDField] || 0);
    if (config.tools.some((tool) => tool.id === toolID)) {
      return {
        selection: toolID,
        targetID: Number(execution?.tool_target_id || 0),
      };
    }
  }
  return { selection: "auto" as const, targetID: 0 };
}

function restoreToolParameterDefaults(
  params: PowerParam[],
  execution: Record<string, unknown> | undefined,
  toolSelection: number,
  toolIDField: string,
  toolTargetID: number,
) {
  if (
    String(execution?.tool_mode || "").trim() !== "specific" ||
    Number(execution?.[toolIDField] || 0) !== toolSelection
  ) {
    return params;
  }
  const executionTargetID = Number(execution?.tool_target_id || 0);
  if (
    executionTargetID > 0 &&
    toolTargetID > 0 &&
    executionTargetID !== toolTargetID
  ) {
    return params;
  }
  const values = execution?.tool_params;
  if (!isRecord(values)) return params;

  let restored = false;
  const result = params.map((param) => {
    const key = String(param.key || "").trim();
    if (!key || !Object.prototype.hasOwnProperty.call(values, key)) {
      return param;
    }
    restored = true;
    return {
      ...param,
      default_value: serializeToolParameterDefault(values[key]),
    };
  });
  return restored ? result : params;
}

function serializeToolParameterDefault(value: unknown) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value !== "object") return String(value);
  try {
    return JSON.stringify(value);
  } catch {
    return "";
  }
}

function toolMode(selection: AgentChatExecutionSelection) {
  if (typeof selection === "number") return "specific";
  return "auto";
}

function requiresSourceTarget(
  sourceRule: number | undefined,
  targetID: number,
) {
  return isManualPowerSourceRule(sourceRule) && targetID <= 0;
}

function canChooseSource(
  sourceRule: number | undefined,
  sources: readonly unknown[] | undefined,
) {
  return isManualPowerSourceRule(sourceRule) && (sources?.length || 0) > 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}
