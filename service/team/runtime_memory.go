package team

import (
	"context"
	"fmt"
	"strings"

	memorymodel "github.com/dever-package/bot/model/memory"
	teammodel "github.com/dever-package/bot/model/team"
	agentprompt "github.com/dever-package/bot/service/agent/prompt"
	memoryservice "github.com/dever-package/bot/service/memory"
)

const (
	teamRoleMemoryLimit      = 8
	teamRoleMemoryQueryLimit = 1200
)

func (s Service) roleRuntimeMemories(ctx context.Context, team teammodel.Team, role *teammodel.Role, input map[string]any) []memoryservice.RuntimeMemory {
	if role == nil || team.ID == 0 || !teamRoleMemoryEnabled(*role, input) {
		return nil
	}
	agentKey := teamRoleMemoryAgentKey(*role)
	return s.memory.RuntimeMemories(ctx, memoryservice.RuntimeRequest{
		OwnerType:       memorymodel.OwnerTypeTeam,
		OwnerID:         team.ID,
		AgentKey:        agentKey,
		ContextKey:      teamRoleMemoryContextKey(team, *role, agentKey),
		Query:           teamRoleMemoryQuery(input),
		Limit:           teamRoleMemoryLimit,
		IncludeGlobal:   true,
		IncludeAgent:    true,
		IncludeUnscoped: true,
	})
}

func teamRoleMemoryEnabled(role teammodel.Role, input map[string]any) bool {
	if value, ok := optionalBool(input["memory_enabled"]); ok {
		return value
	}
	if value, ok := optionalBool(input["memoryEnabled"]); ok {
		return value
	}
	config := jsonMap(role.Config)
	if value, ok := optionalBool(config["memory_enabled"]); ok {
		return value
	}
	if value, ok := optionalBool(config["memoryEnabled"]); ok {
		return value
	}
	return true
}

func teamRoleMemoryAgentKey(role teammodel.Role) string {
	if key := strings.TrimSpace(role.RoleKey); key != "" {
		return key
	}
	if role.ID > 0 {
		return fmt.Sprintf("role:%d", role.ID)
	}
	if role.AgentID > 0 {
		return fmt.Sprintf("agent:%d", role.AgentID)
	}
	return "role"
}

func teamRoleMemoryContextKey(team teammodel.Team, role teammodel.Role, agentKey string) string {
	if agentKey == "" {
		agentKey = teamRoleMemoryAgentKey(role)
	}
	return fmt.Sprintf("team:%d:role:%s", team.ID, agentKey)
}

func teamRoleMemoryQuery(input map[string]any) string {
	query := firstText(input["goal"], input["task"], input["prompt"], input["requirement"], input["user_input"], input["original_goal"])
	if query == "" {
		query = jsonText(input)
	}
	return limitTeamRoleMemoryText(query, teamRoleMemoryQueryLimit)
}

func teamRoleMemoryPrompt(memories []memoryservice.RuntimeMemory) string {
	if len(memories) == 0 {
		return ""
	}
	snippets := make([]agentprompt.MemorySnippet, 0, len(memories))
	for _, memory := range memories {
		snippets = append(snippets, agentprompt.MemorySnippet{
			ID:         memory.ID,
			Kind:       memory.Kind,
			Title:      memory.Title,
			Content:    memory.Content,
			Tags:       memory.Tags,
			Importance: memory.Importance,
		})
	}
	return agentprompt.BuildMemoryPrompt(snippets)
}

func optionalBool(raw any) (bool, bool) {
	switch value := raw.(type) {
	case bool:
		return value, true
	}
	text := strings.ToLower(strings.TrimSpace(textValue(raw)))
	switch text {
	case "1", "true", "yes", "y", "on", "是", "启用", "开启":
		return true, true
	case "0", "false", "no", "n", "off", "否", "禁用", "关闭":
		return false, true
	default:
		return false, false
	}
}

func limitTeamRoleMemoryText(text string, limit int) string {
	text = strings.TrimSpace(text)
	if limit <= 0 {
		return text
	}
	runes := []rune(text)
	if len(runes) <= limit {
		return text
	}
	return strings.TrimSpace(string(runes[:limit]))
}
