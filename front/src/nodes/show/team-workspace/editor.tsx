import type { ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AssistantContextFormFillButton } from "@/components/assistant/form-actions";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { SearchableOptionPicker } from "@/components/searchable-option-picker";
import type {
  AgentCateOption,
  AgentOption,
  AssetCateOption,
  FlowItem,
  PowerKindOption,
  PowerOption,
  RoleOption,
  RoleTypeOption,
  Selection,
  TeamNode,
  TeamOption,
} from "./types";
import { CONDITION_OPERATORS } from "./constants";
import {
  applyFlowAssistantValues,
  buildFlowAssistantContext,
} from "./assistant";
import {
  buildTeamBindingOptions,
  deriveAgentCateOptions,
  derivePowerKindOptions,
  findRoleInTeams,
  findTeamOption,
  normalizeConditionOperator,
  omitConfigKeys,
  sortAgentCateOptions,
  sortAgentOptions,
} from "./graph-state";

export function EditorDialog({
  open,
  onOpenChange,
  selected,
  flows,
  nodes,
  currentTeamID,
  currentTeamName,
  roles,
  roleTypes,
  agents,
  agentCates,
  assetCates,
  teamBindingOptions,
  powers,
  powerKinds,
  nodeTypes,
  readonly,
  onChangeFlow,
  onChangeNode,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selected: Selection;
  flows: FlowItem[];
  nodes: TeamNode[];
  currentTeamID: number;
  currentTeamName: string;
  roles: RoleOption[];
  roleTypes: RoleTypeOption[];
  agents: AgentOption[];
  agentCates: AgentCateOption[];
  assetCates: AssetCateOption[];
  teamBindingOptions: TeamOption[];
  powers: PowerOption[];
  powerKinds: PowerKindOption[];
  nodeTypes: Array<{ id: string; value: string }>;
  readonly: boolean;
  onChangeFlow: (key: string, patch: Partial<FlowItem>) => void;
  onChangeNode: (key: string, patch: Partial<TeamNode>) => void;
}) {
  if (!selected) {
    return null;
  }

  const title = resolveEditorTitle(selected);

  let content: ReactNode = null;
  let headerAction: ReactNode = null;
  if (selected.kind === "flow") {
    const flow = flows.find((item) => item.key === selected.key);
    if (flow) {
      const assistantContext = buildFlowAssistantContext(flow);
      headerAction = readonly ? null : (
        <AssistantContextFormFillButton
          context={assistantContext}
          className="mt-[-0.125rem]"
          variant="outline"
          size="sm"
          onApplyValues={(values) =>
            applyFlowAssistantValues(flow.key, values, onChangeFlow)
          }
        />
      );
      content = (
        <div className="space-y-1">
          <Field label="名称">
            <Input
              value={flow.name || ""}
              disabled={readonly}
              onChange={(event) =>
                onChangeFlow(flow.key, { name: event.target.value })
              }
            />
          </Field>
          <Field label="目标">
            <Textarea
              value={flow.goal || ""}
              disabled={readonly}
              onChange={(event) =>
                onChangeFlow(flow.key, { goal: event.target.value })
              }
            />
          </Field>
        </div>
      );
    }
  } else if (selected.kind === "node") {
    const node = nodes.find((item) => item.node_key === selected.key);
    content = node ? (
      <div className="space-y-1">
        <Field label="名称">
          <Input
            value={node.name || ""}
            disabled={readonly}
            onChange={(event) =>
              onChangeNode(node.node_key, { name: event.target.value })
            }
          />
        </Field>
        <Field label="类型">
          <OptionRadioGroup
            options={nodeTypes}
            value={node.type || "agent"}
            onValueChange={(value) =>
              onChangeNode(
                node.node_key,
                normalizeNodeTypePatch(node, value, assetCates),
              )
            }
            disabled={readonly}
          />
        </Field>
        {node.type === "role" ? (
          <RoleBindingFields
            node={node}
            roles={roles}
            roleTypes={roleTypes}
            currentTeamID={currentTeamID}
            currentTeamName={currentTeamName}
            teams={teamBindingOptions}
            readonly={readonly}
            onChangeNode={onChangeNode}
          />
        ) : null}
        {node.type === "agent" ? (
          <AgentBindingFields
            node={node}
            agents={agents}
            agentCates={agentCates}
            readonly={readonly}
            onChangeNode={onChangeNode}
          />
        ) : null}
        {node.type === "power" ? (
          <PowerBindingFields
            node={node}
            powers={powers}
            powerKinds={powerKinds}
            readonly={readonly}
            onChangeNode={onChangeNode}
          />
        ) : null}
        {node.type === "team" ? (
          <TeamBindingFields
            node={node}
            currentTeamID={currentTeamID}
            currentTeamName={currentTeamName}
            teams={teamBindingOptions}
            readonly={readonly}
            onChangeNode={onChangeNode}
          />
        ) : null}
        {node.type === "condition" ? (
          <ConditionFields
            node={node}
            readonly={readonly}
            onChangeNode={onChangeNode}
          />
        ) : null}
        {node.type === "context" || node.type === "save" ? (
          <AssetCateBindingField
            node={node}
            assetCates={assetCates}
            readonly={readonly}
            onChangeNode={onChangeNode}
          />
        ) : null}
        {node.type === "agent" || node.type === "role" ? (
          <Field label="目标">
            <Textarea
              value={String(node.config?.goal ?? "")}
              disabled={readonly}
              placeholder="填写给智能体的详细任务目标；留空时使用名称作为目标"
              onChange={(event) =>
                onChangeNode(node.node_key, {
                  config: {
                    ...(node.config ?? {}),
                    goal: event.target.value,
                  },
                })
              }
            />
          </Field>
        ) : null}
      </div>
    ) : null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex flex-col gap-0 overflow-visible p-0 sm:max-w-2xl"
        style={{ maxHeight: "min(82vh, 48rem)" }}
      >
        <DialogHeader className="shrink-0 px-6 py-4 text-start">
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="min-w-0 pt-1">{title}</DialogTitle>
            <div className="flex shrink-0 items-start gap-2">
              {headerAction}
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="-mr-3 -mt-2 size-8 shrink-0 self-start"
                >
                  <span className="sr-only">关闭</span>
                  <X className="size-4" />
                </Button>
              </DialogClose>
            </div>
          </div>
        </DialogHeader>
        <div className="min-h-0 overflow-y-auto px-6 pb-6 pt-2">{content}</div>
      </DialogContent>
    </Dialog>
  );
}

function OptionRadioGroup({
  options,
  value,
  disabled,
  onValueChange,
}: {
  options: Array<{ id: string; value: string }>;
  value: string;
  disabled?: boolean;
  onValueChange: (value: string) => void;
}) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onValueChange}
      className="grid gap-2 sm:grid-cols-2"
      disabled={disabled}
    >
      {options.map((option) => (
        <label
          key={option.id}
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-sm",
            value === option.id && "border-primary bg-primary/5 text-primary",
            disabled && "cursor-not-allowed opacity-60",
          )}
        >
          <RadioGroupItem value={option.id} disabled={disabled} />
          <span>{option.value}</span>
        </label>
      ))}
    </RadioGroup>
  );
}

function RoleBindingFields({
  node,
  roles,
  roleTypes,
  currentTeamID,
  currentTeamName,
  teams,
  readonly,
  onChangeNode,
}: {
  node: TeamNode;
  roles: RoleOption[];
  roleTypes: RoleTypeOption[];
  currentTeamID: number;
  currentTeamName: string;
  teams: TeamOption[];
  readonly: boolean;
  onChangeNode: (key: string, patch: Partial<TeamNode>) => void;
}) {
  const selectedRoleID = Number(node.role_id || node.config?.role_id || 0);
  const roleTeams = teams.length
    ? teams
    : buildTeamBindingOptions({
        currentTeamID,
        currentTeamName,
        flows: [],
        roles,
        teams,
      });
  const selectedRole = findRoleInTeams(roleTeams, selectedRoleID);
  const selectedTeamID = Number(
    node.config?.role_team_id ||
      selectedRole?.team_id ||
      currentTeamID ||
      roleTeams[0]?.id ||
      0,
  );
  const selectedTeam = findTeamOption(roleTeams, selectedTeamID);
  const teamRoles = selectedTeam?.roles ?? [];
  const firstAvailableRoleType =
    teamRoles[0]?.role_type || roleTypes[0]?.id || "";
  const selectedRoleType = String(
    node.config?.role_type || selectedRole?.role_type || firstAvailableRoleType,
  );
  const filteredRoles = selectedRoleType
    ? teamRoles.filter((role) => role.role_type === selectedRoleType)
    : teamRoles;
  const roleValue = filteredRoles.some((role) => role.id === selectedRoleID)
    ? String(selectedRoleID)
    : undefined;
  const selectedRoleName = selectedRole?.name || "";

  return (
    <Field label="绑定角色">
      <div className="grid gap-2 sm:grid-cols-3">
        <SearchableOptionPicker
          value={selectedTeamID ? String(selectedTeamID) : undefined}
          options={roleTeams.map((team) => ({
            id: team.id,
            value: team.name || "未命名团队",
          }))}
          disabled={readonly}
          clearable={false}
          placeholder="选择团队"
          searchPlaceholder="输入团队筛选..."
          emptyText="未找到团队"
          onChange={(nextValue) => {
            const value = Array.isArray(nextValue)
              ? (nextValue[0] ?? "")
              : nextValue;
            const nextTeamID = Number(value || currentTeamID || 0);
            const nextTeam = findTeamOption(roleTeams, nextTeamID);
            const nextRoleType =
              nextTeam?.roles?.[0]?.role_type || selectedRoleType;
            onChangeNode(
              node.node_key,
              withAutoNodeName(
                node,
                {
                  role_id: 0,
                  role_key: "",
                  config: {
                    ...(node.config ?? {}),
                    role_team_id: nextTeamID,
                    role_id: 0,
                    role_key: "",
                    role_type: nextRoleType,
                  },
                },
                "团队角色",
                [selectedRoleName],
              ),
            );
          }}
        />
        <SearchableOptionPicker
          value={selectedRoleType || undefined}
          options={roleTypes}
          disabled={readonly}
          clearable={false}
          placeholder="选择角色类型"
          searchPlaceholder="输入角色类型筛选..."
          onChange={(nextValue) => {
            const value = Array.isArray(nextValue)
              ? (nextValue[0] ?? "")
              : nextValue;
            onChangeNode(
              node.node_key,
              withAutoNodeName(
                node,
                {
                  role_id: 0,
                  role_key: "",
                  config: {
                    ...(node.config ?? {}),
                    role_team_id: selectedTeamID,
                    role_id: 0,
                    role_key: "",
                    role_type: value,
                  },
                },
                "团队角色",
                [selectedRoleName],
              ),
            );
          }}
        />
        <SearchableOptionPicker
          value={roleValue}
          options={filteredRoles.map((role) => ({
            id: role.id,
            value: role.name || role.role_key || "未命名角色",
          }))}
          disabled={readonly}
          placeholder="选择角色"
          searchPlaceholder="输入角色筛选..."
          emptyText="未找到团队角色"
          onClear={() =>
            onChangeNode(
              node.node_key,
              withAutoNodeName(
                node,
                {
                  role_id: 0,
                  role_key: "",
                  config: {
                    ...(node.config ?? {}),
                    role_team_id: selectedTeamID,
                    role_id: 0,
                    role_key: "",
                    role_type: selectedRoleType,
                  },
                },
                "团队角色",
                [selectedRoleName],
              ),
            )
          }
          onChange={(nextValue) => {
            const value = Array.isArray(nextValue)
              ? (nextValue[0] ?? "")
              : nextValue;
            const nextRole = filteredRoles.find(
              (role) => String(role.id) === String(value),
            );
            onChangeNode(
              node.node_key,
              withAutoNodeName(
                node,
                {
                  role_id: nextRole?.id || 0,
                  role_key: nextRole?.role_key || "",
                  config: {
                    ...(node.config ?? {}),
                    role_team_id: selectedTeamID,
                    role_id: nextRole?.id || 0,
                    role_key: nextRole?.role_key || "",
                    role_type: nextRole?.role_type || selectedRoleType,
                  },
                },
                nextRole?.name || "团队角色",
                [selectedRoleName],
              ),
            );
          }}
        />
      </div>
    </Field>
  );
}

function AgentBindingFields({
  node,
  agents,
  agentCates,
  readonly,
  onChangeNode,
}: {
  node: TeamNode;
  agents: AgentOption[];
  agentCates: AgentCateOption[];
  readonly: boolean;
  onChangeNode: (key: string, patch: Partial<TeamNode>) => void;
}) {
  const selectedAgentID = Number(node.agent_id || node.config?.agent_id || 0);
  const selectedAgent = agents.find((agent) => agent.id === selectedAgentID);

  return (
    <Field label="绑定智能体">
      <AgentSelector
        agentID={selectedAgentID}
        cateID={Number(node.config?.agent_cate_id || 0)}
        agents={agents}
        agentCates={agentCates}
        disabled={readonly}
        onChange={({ agentID, cateID }) => {
          const nextAgent = agents.find((agent) => agent.id === agentID);
          onChangeNode(
            node.node_key,
            withAutoNodeName(
              node,
              {
                agent_id: agentID,
                config: {
                  ...(node.config ?? {}),
                  agent_cate_id: cateID,
                },
              },
              nextAgent?.name || "智能体",
              [selectedAgent?.name],
            ),
          );
        }}
      />
    </Field>
  );
}

function PowerBindingFields({
  node,
  powers,
  powerKinds,
  readonly,
  onChangeNode,
}: {
  node: TeamNode;
  powers: PowerOption[];
  powerKinds: PowerKindOption[];
  readonly: boolean;
  onChangeNode: (key: string, patch: Partial<TeamNode>) => void;
}) {
  const selectedPowerID = Number(node.power_id || node.config?.power_id || 0);
  const selectedPower = powers.find((power) => power.id === selectedPowerID);
  const kinds = powerKinds.length ? powerKinds : derivePowerKindOptions(powers);
  const selectedKind = String(
    node.config?.power_kind ||
      selectedPower?.kind ||
      kinds[0]?.id ||
      powers[0]?.kind ||
      "",
  );
  const filteredPowers = selectedKind
    ? powers.filter((power) => power.kind === selectedKind)
    : powers;

  return (
    <Field label="绑定能力">
      <div className="grid gap-2 sm:grid-cols-2">
        <SearchableOptionPicker
          value={selectedKind || undefined}
          options={kinds.map((kind) => ({ id: kind.id, value: kind.value }))}
          disabled={readonly}
          clearable={false}
          placeholder="选择能力类型"
          searchPlaceholder="输入能力类型筛选..."
          onChange={(nextValue) => {
            const value = Array.isArray(nextValue)
              ? (nextValue[0] ?? "")
              : nextValue;
            const nextPower = powers.find((power) => power.kind === value);
            onChangeNode(
              node.node_key,
              withAutoNodeName(
                node,
                {
                  power_id: nextPower?.id || 0,
                  config: {
                    ...(node.config ?? {}),
                    power_kind: value,
                    power_id: nextPower?.id || 0,
                    power_key: nextPower?.key || "",
                  },
                },
                nextPower?.name || "能力",
                [selectedPower?.name],
              ),
            );
          }}
        />
        <SearchableOptionPicker
          value={selectedPowerID ? String(selectedPowerID) : undefined}
          options={filteredPowers.map((power) => ({
            id: power.id,
            value: power.name || "未命名能力",
          }))}
          disabled={readonly}
          placeholder="选择能力"
          searchPlaceholder="输入能力筛选..."
          emptyText="未找到匹配能力"
          onClear={() =>
            onChangeNode(
              node.node_key,
              withAutoNodeName(
                node,
                {
                  power_id: 0,
                  config: {
                    ...(node.config ?? {}),
                    power_id: 0,
                    power_key: "",
                  },
                },
                "能力",
                [selectedPower?.name],
              ),
            )
          }
          onChange={(nextValue) => {
            const value = Array.isArray(nextValue)
              ? (nextValue[0] ?? "")
              : nextValue;
            const nextPower = powers.find(
              (power) => String(power.id) === String(value),
            );
            onChangeNode(
              node.node_key,
              withAutoNodeName(
                node,
                {
                  power_id: nextPower?.id || 0,
                  config: {
                    ...(node.config ?? {}),
                    power_kind: nextPower?.kind || selectedKind,
                    power_id: nextPower?.id || 0,
                    power_key: nextPower?.key || "",
                  },
                },
                nextPower?.name || "能力",
                [selectedPower?.name],
              ),
            );
          }}
        />
      </div>
    </Field>
  );
}

function TeamBindingFields({
  node,
  currentTeamID,
  currentTeamName,
  teams,
  readonly,
  onChangeNode,
}: {
  node: TeamNode;
  currentTeamID: number;
  currentTeamName: string;
  teams: TeamOption[];
  readonly: boolean;
  onChangeNode: (key: string, patch: Partial<TeamNode>) => void;
}) {
  const selectedTeamID = Number(
    node.sub_team_id ||
      node.config?.sub_team_id ||
      currentTeamID ||
      teams[0]?.id ||
      0,
  );
  const workflowTeams = teams.length
    ? teams
    : buildTeamBindingOptions({
        currentTeamID,
        currentTeamName,
        flows: [],
        roles: [],
        teams,
      });
  const selectedTeam = findTeamOption(workflowTeams, selectedTeamID);
  const teamFlows = (selectedTeam?.flows ?? []).filter((flow) =>
    Boolean(flow.id),
  );
  const selectedFlowID = Number(
    node.config?.sub_flow_id || node.config?.flow_id || 0,
  );
  const selectedFlow = teamFlows.find(
    (flow) => Number(flow.id || 0) === selectedFlowID,
  );
  const selectedTeamNodeName = teamNodeName(selectedTeam, selectedFlow);

  return (
    <Field label="工作流">
      <div className="grid gap-2 sm:grid-cols-2">
        <SearchableOptionPicker
          value={selectedTeamID ? String(selectedTeamID) : undefined}
          options={workflowTeams.map((team) => ({
            id: team.id,
            value: team.name || "未命名团队",
          }))}
          disabled={readonly}
          clearable={false}
          placeholder="选择团队"
          searchPlaceholder="输入团队筛选..."
          emptyText="未找到团队"
          onChange={(nextValue) => {
            const value = Array.isArray(nextValue)
              ? (nextValue[0] ?? "")
              : nextValue;
            const nextTeam = findTeamOption(workflowTeams, Number(value));
            const nextTeamID = nextTeam?.id || currentTeamID || 0;
            onChangeNode(
              node.node_key,
              withAutoNodeName(
                node,
                {
                  sub_team_id: nextTeamID,
                  config: {
                    ...(node.config ?? {}),
                    sub_team_id: nextTeamID,
                    release_id: nextTeam?.release_id || 0,
                    sub_flow_id: 0,
                    sub_flow_key: "",
                  },
                },
                teamNodeName(nextTeam),
                [selectedTeamNodeName],
              ),
            );
          }}
        />
        <SearchableOptionPicker
          value={selectedFlowID ? String(selectedFlowID) : undefined}
          options={teamFlows.map((flow) => ({
            id: flow.id || 0,
            value: flow.name || flow.key || "未命名工作流",
          }))}
          disabled={readonly}
          placeholder="团队总工作流"
          searchPlaceholder="输入工作流筛选..."
          emptyText="未找到工作流"
          onClear={() =>
            onChangeNode(
              node.node_key,
              withAutoNodeName(
                node,
                {
                  config: {
                    ...(node.config ?? {}),
                    sub_team_id: selectedTeamID,
                    release_id: selectedTeam?.release_id || 0,
                    sub_flow_id: 0,
                    sub_flow_key: "",
                  },
                },
                teamNodeName(selectedTeam),
                [selectedTeamNodeName],
              ),
            )
          }
          onChange={(nextValue) => {
            const value = Array.isArray(nextValue)
              ? (nextValue[0] ?? "")
              : nextValue;
            const nextFlow = teamFlows.find(
              (flow) => String(flow.id || "") === String(value),
            );
            onChangeNode(
              node.node_key,
              withAutoNodeName(
                node,
                {
                  sub_team_id: selectedTeamID,
                  config: {
                    ...(node.config ?? {}),
                    sub_team_id: selectedTeamID,
                    release_id: selectedTeam?.release_id || 0,
                    sub_flow_id: nextFlow?.id || 0,
                    sub_flow_key: nextFlow?.key || "",
                  },
                },
                teamNodeName(selectedTeam, nextFlow),
                [selectedTeamNodeName],
              ),
            );
          }}
        />
      </div>
    </Field>
  );
}

function ConditionFields({
  node,
  readonly,
  onChangeNode,
}: {
  node: TeamNode;
  readonly: boolean;
  onChangeNode: (key: string, patch: Partial<TeamNode>) => void;
}) {
  const operator = normalizeConditionOperator(node.config?.operator);
  const needsValue = operator === "contains" || operator === "equals";
  const updateConfig = (patch: Record<string, any>) =>
    onChangeNode(node.node_key, {
      config: {
        ...(node.config ?? {}),
        ...patch,
      },
    });

  return (
    <>
      <Field label="判断方式">
        <OptionRadioGroup
          options={CONDITION_OPERATORS}
          value={operator}
          disabled={readonly}
          onValueChange={(value) => updateConfig({ operator: value })}
        />
      </Field>
      {needsValue ? (
        <Field label="判断值">
          <Input
            value={String(node.config?.value ?? "")}
            disabled={readonly}
            placeholder={
              operator === "contains"
                ? "输入要包含的内容"
                : "输入要完全等于的内容"
            }
            onChange={(event) => updateConfig({ value: event.target.value })}
          />
        </Field>
      ) : null}
    </>
  );
}

function AssetCateBindingField({
  node,
  assetCates,
  readonly,
  onChangeNode,
}: {
  node: TeamNode;
  assetCates: AssetCateOption[];
  readonly: boolean;
  onChangeNode: (key: string, patch: Partial<TeamNode>) => void;
}) {
  const selectedCateID = Number(
    node.asset_cate_id || node.config?.asset_cate_id || 0,
  );
  const selectedCate = findAssetCate(assetCates, selectedCateID);

  return (
    <Field label="资产类型">
      <SearchableOptionPicker
        value={selectedCateID ? String(selectedCateID) : undefined}
        options={assetCates.map((cate) => ({
          id: cate.id,
          value: assetCateLabel(cate),
        }))}
        disabled={readonly}
        placeholder="选择资产类型"
        searchPlaceholder="输入资产类型筛选..."
        emptyText="未找到资产类型"
        onClear={() =>
          onChangeNode(
            node.node_key,
            withAutoNodeName(
              node,
              {
                asset_cate_id: 0,
                config: {
                  ...(node.config ?? {}),
                  asset_cate_id: 0,
                },
              },
              assetNodeName(node.type),
              [assetNodeName(node.type, selectedCate)],
            ),
          )
        }
        onChange={(nextValue) => {
          const value = Array.isArray(nextValue)
            ? (nextValue[0] ?? "")
            : nextValue;
          const assetCateID = Number(value || 0);
          const nextCate = findAssetCate(assetCates, assetCateID);
          onChangeNode(
            node.node_key,
            withAutoNodeName(
              node,
              {
                asset_cate_id: assetCateID,
                config: {
                  ...(node.config ?? {}),
                  asset_cate_id: assetCateID,
                },
              },
              assetNodeName(node.type, nextCate),
              [assetNodeName(node.type, selectedCate)],
            ),
          );
        }}
      />
    </Field>
  );
}

function AgentSelector({
  agentID,
  cateID,
  agents,
  agentCates,
  disabled = false,
  onChange,
}: {
  agentID?: number;
  cateID?: number;
  agents: AgentOption[];
  agentCates: AgentCateOption[];
  disabled?: boolean;
  onChange: (value: { agentID: number; cateID: number }) => void;
}) {
  const sortedAgents = sortAgentOptions(agents);
  const selectedAgent = sortedAgents.find((agent) => agent.id === agentID);
  const visibleAgentCates = agentCates.length
    ? sortAgentCateOptions(agentCates)
    : deriveAgentCateOptions(sortedAgents);
  const selectedCateID = String(
    selectedAgent?.cate_id || cateID || visibleAgentCates[0]?.id || "",
  );
  const filteredAgents = selectedCateID
    ? sortedAgents.filter(
        (agent) => String(agent.cate_id || "") === selectedCateID,
      )
    : sortedAgents;

  return (
    <div className="grid grid-cols-2 gap-2">
      <SearchableOptionPicker
        value={selectedCateID || undefined}
        options={visibleAgentCates.map((cate) => ({
          id: cate.id,
          value: agentCateLabel(cate),
        }))}
        disabled={disabled}
        clearable={false}
        placeholder="选择分类"
        searchPlaceholder="输入分类筛选..."
        emptyText="未找到智能体分类"
        onChange={(nextValue) => {
          const value = Array.isArray(nextValue)
            ? (nextValue[0] ?? "")
            : nextValue;
          const currentAgent = sortedAgents.find(
            (agent) => agent.id === agentID,
          );
          const keepAgent =
            currentAgent &&
            String(currentAgent.cate_id || "") === String(value);
          onChange({
            agentID: keepAgent ? Number(agentID || 0) : 0,
            cateID: Number(value),
          });
        }}
      />
      <SearchableOptionPicker
        value={agentID ? String(agentID) : undefined}
        options={filteredAgents.map((agent) => ({
          id: agent.id,
          value: agent.name || "未命名智能体",
        }))}
        disabled={disabled}
        clearable={false}
        placeholder="选择智能体"
        searchPlaceholder="输入智能体筛选..."
        emptyText="未找到智能体"
        onChange={(nextValue) => {
          const value = Array.isArray(nextValue)
            ? (nextValue[0] ?? "")
            : nextValue;
          const agent = sortedAgents.find((item) => String(item.id) === value);
          onChange({
            agentID: Number(value),
            cateID: Number(agent?.cate_id || selectedCateID || 0),
          });
        }}
      />
    </div>
  );
}

function resolveEditorTitle(selection: Exclude<Selection, null>) {
  if (selection.kind === "flow") {
    return "编辑工作流";
  }
  if (selection.kind === "node") {
    return "编辑节点";
  }
  return selection.kind === "flow_edge" ? "编辑工作流关系" : "编辑节点关系";
}

export function deleteDialogTitle(selection: Selection) {
  if (selection?.kind === "flow") {
    return "删除工作流";
  }
  if (selection?.kind === "flow_edge" || selection?.kind === "node_edge") {
    return "删除关系";
  }
  return "删除图中项目";
}

export function deleteDialogDescription(selection: Selection) {
  if (selection?.kind === "flow") {
    return "保存后该工作流会被停用，不做物理删除，已发布或历史运行数据不会被直接清掉。";
  }
  if (selection?.kind === "flow_edge" || selection?.kind === "node_edge") {
    return "删除后会移除这条关系线。保存前仍只在当前编辑状态中生效。";
  }
  return "删除后会同时移除关联连线。保存前仍只在当前编辑状态中生效。";
}

function normalizeNodeTypePatch(
  node: TeamNode,
  type: string,
  assetCates: AssetCateOption[] = [],
): Partial<TeamNode> {
  const baseConfig = omitConfigKeys(node.config, [
    "goal",
    "agent_cate_id",
    "role_id",
    "role_key",
    "role_team_id",
    "role_type",
    "power_id",
    "power_key",
    "power_kind",
    "sub_team_id",
    "sub_flow_id",
    "sub_flow_key",
    "release_id",
    "asset_cate_id",
    "operator",
    "source_key",
    "input_key",
    "value",
    "body_key",
    "content_key",
  ]);
  const basePatch = {
    role_id: 0,
    role_key: "",
    agent_id: 0,
    power_id: 0,
    sub_team_id: 0,
  };
  const assetCateID = Number(
    node.asset_cate_id || node.config?.asset_cate_id || 0,
  );
  const assetCate = findAssetCate(assetCates, assetCateID);
  const applyAutoName = (
    patch: Partial<TeamNode>,
    name = defaultNodeName(type, assetCate),
  ) => withAutoNodeName(node, patch, name);

  if (type === "agent") {
    return applyAutoName({
      type,
      ...basePatch,
      asset_cate_id: 0,
      config: omitConfigKeys(node.config, [
        "role_id",
        "role_key",
        "role_team_id",
        "role_type",
        "power_id",
        "power_key",
        "power_kind",
        "sub_team_id",
        "sub_flow_id",
        "sub_flow_key",
        "release_id",
        "asset_cate_id",
        "operator",
        "source_key",
        "input_key",
        "value",
        "body_key",
        "content_key",
      ]),
    });
  }
  if (type === "role") {
    return applyAutoName({
      type,
      ...basePatch,
      asset_cate_id: 0,
      config: omitConfigKeys(node.config, [
        "agent_cate_id",
        "power_id",
        "power_key",
        "power_kind",
        "sub_team_id",
        "sub_flow_id",
        "sub_flow_key",
        "release_id",
        "asset_cate_id",
        "operator",
        "source_key",
        "input_key",
        "value",
        "body_key",
        "content_key",
      ]),
    });
  }
  if (type === "power") {
    return applyAutoName({
      type,
      ...basePatch,
      asset_cate_id: 0,
      config: omitConfigKeys(node.config, [
        "goal",
        "agent_cate_id",
        "role_id",
        "role_key",
        "role_team_id",
        "role_type",
        "sub_team_id",
        "sub_flow_id",
        "sub_flow_key",
        "release_id",
        "asset_cate_id",
        "operator",
        "source_key",
        "input_key",
        "value",
        "body_key",
        "content_key",
      ]),
    });
  }
  if (type === "team") {
    return applyAutoName({
      type,
      ...basePatch,
      asset_cate_id: 0,
      config: omitConfigKeys(node.config, [
        "goal",
        "agent_cate_id",
        "role_id",
        "role_key",
        "role_team_id",
        "role_type",
        "power_id",
        "power_key",
        "power_kind",
        "asset_cate_id",
        "operator",
        "source_key",
        "input_key",
        "value",
        "body_key",
        "content_key",
      ]),
    });
  }
  if (type === "condition") {
    return applyAutoName({
      type,
      ...basePatch,
      asset_cate_id: 0,
      config: {
        ...omitConfigKeys(node.config, [
          "goal",
          "agent_cate_id",
          "role_id",
          "role_key",
          "role_team_id",
          "role_type",
          "power_id",
          "power_key",
          "power_kind",
          "sub_team_id",
          "sub_flow_id",
          "sub_flow_key",
          "release_id",
          "asset_cate_id",
          "body_key",
          "content_key",
        ]),
        operator: normalizeConditionOperator(node.config?.operator),
      },
    });
  }
  if (type === "save") {
    return applyAutoName({
      type,
      ...basePatch,
      asset_cate_id: assetCateID,
      config: baseConfig,
    });
  }
  if (type === "context") {
    return applyAutoName({
      type,
      ...basePatch,
      asset_cate_id: assetCateID,
      config: baseConfig,
    });
  }
  return applyAutoName({
    type,
    ...basePatch,
    asset_cate_id: 0,
    config: baseConfig,
  });
}

const AUTO_NODE_NAMES = new Set([
  "智能体",
  "团队角色",
  "能力",
  "团队工作流",
  "读取上下文",
  "保存结果",
  "条件判断",
  "合并结果",
  "人工确认",
]);

function withAutoNodeName(
  node: TeamNode,
  patch: Partial<TeamNode>,
  name?: string,
  previousNames: Array<string | undefined> = [],
): Partial<TeamNode> {
  const nextName = String(name || "").trim();
  if (!nextName) {
    return patch;
  }
  if (!canReplaceNodeName(node.name, previousNames)) {
    return patch;
  }
  return { ...patch, name: nextName };
}

function canReplaceNodeName(
  name: string,
  previousNames: Array<string | undefined> = [],
) {
  const currentName = String(name || "").trim();
  if (isDefaultNodeName(currentName) || AUTO_NODE_NAMES.has(currentName)) {
    return true;
  }
  if (currentName.startsWith("读取：") || currentName.startsWith("保存：")) {
    return true;
  }
  return previousNames.some(
    (previousName) =>
      String(previousName || "").trim() !== "" &&
      String(previousName || "").trim() === currentName,
  );
}

function isDefaultNodeName(name: string) {
  const value = String(name || "").trim();
  if (!value || value === "节点") {
    return true;
  }
  if (!value.startsWith("节点")) {
    return false;
  }
  const suffix = value.slice("节点".length);
  return suffix !== "" && /^\d+$/.test(suffix);
}

function defaultNodeName(type: string, assetCate?: AssetCateOption) {
  if (type === "context" || type === "save") {
    return assetNodeName(type, assetCate);
  }
  if (type === "agent") {
    return "智能体";
  }
  if (type === "role") {
    return "团队角色";
  }
  if (type === "power") {
    return "能力";
  }
  if (type === "team") {
    return "团队工作流";
  }
  if (type === "condition") {
    return "条件判断";
  }
  if (type === "merge") {
    return "合并结果";
  }
  if (type === "human_approval") {
    return "人工确认";
  }
  return String(type || "").trim();
}

function assetNodeName(type: string, assetCate?: AssetCateOption) {
  const name = String(assetCate?.name || "").trim();
  if (type === "context") {
    return name ? `读取：${name}` : "读取上下文";
  }
  return name ? `保存：${name}` : "保存结果";
}

function findAssetCate(assetCates: AssetCateOption[], assetCateID: number) {
  return assetCates.find((cate) => Number(cate.id) === Number(assetCateID));
}

function teamNodeName(team?: TeamOption, flow?: FlowItem) {
  const teamName = String(team?.name || "").trim();
  const flowName = String(flow?.name || flow?.key || "").trim();
  if (teamName && flowName) {
    return `${teamName} / ${flowName}`;
  }
  return teamName || "团队工作流";
}

function agentCateLabel(cate: AgentCateOption) {
  return String(cate.value || cate.name || cate.id);
}

function assetCateLabel(cate: AssetCateOption) {
  return String(cate.name || cate.id);
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-4 space-y-2 text-sm">
      <div className="font-medium">{label}</div>
      {children}
    </div>
  );
}
