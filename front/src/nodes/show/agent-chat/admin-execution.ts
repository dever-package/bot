import { useCallback } from "react";
import { loadAgentExecutionConfig, loadAgentToolForm } from "./api";
import { useAgentChatExecution } from "./execution";

export function useAdminAgentChatExecution({
  agentKey,
  configApi,
  toolFormApi,
}: {
  agentKey: string;
  configApi: string;
  toolFormApi: string;
}) {
  const enabled = Boolean(agentKey && configApi && toolFormApi);
  const loadConfig = useCallback(
    () => loadAgentExecutionConfig(configApi, agentKey),
    [agentKey, configApi],
  );
  const loadToolForm = useCallback(
    (powerID: number, sourceTargetID: number) =>
      loadAgentToolForm(toolFormApi, {
        agentKey,
        powerID,
        sourceTargetID,
      }),
    [agentKey, toolFormApi],
  );

  return useAgentChatExecution({
    enabled,
    scopeKey: `admin-agent-runtime:${agentKey}`,
    toolIDField: "power_id",
    loadConfig,
    loadToolForm,
  });
}
