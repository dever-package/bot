package team

import (
	"fmt"
	"strings"

	teammodel "github.com/dever-package/bot/model/team"
)

func roleRuntimePrompt(role *teammodel.Role) string {
	if role == nil {
		return ""
	}
	assignment := strings.TrimSpace(role.Assignment)
	if assignment == "" {
		return ""
	}
	name := strings.TrimSpace(role.Name)
	if name == "" {
		return assignment
	}
	return fmt.Sprintf("团队角色：%s\n职责说明：\n%s", name, assignment)
}

func roleWorkflowContextPayload(role *teammodel.Role) map[string]any {
	payload := roleInputPayload(role)
	delete(payload, "assignment")
	return payload
}
