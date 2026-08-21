package log

import (
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
)

// AttributionValuesFromCostRecord returns an exact durable Log link and its
// ownership snapshot. Records without a link or attribution are ignored.
func AttributionValuesFromCostRecord(record *botmodel.CostRecord) (uint64, map[string]any, bool) {
	if record == nil || record.LogID == 0 {
		return 0, nil, false
	}
	scene := strings.TrimSpace(record.Scene)
	if record.UserID == 0 && record.TeamID == 0 && record.ProjectID == 0 && scene == "" {
		return 0, nil, false
	}
	return record.LogID, map[string]any{
		"user_id":    record.UserID,
		"team_id":    record.TeamID,
		"project_id": record.ProjectID,
		"scene":      scene,
	}, true
}
