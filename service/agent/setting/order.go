package setting

import "strings"

func LessAgentSettingOrder(leftType string, leftID uint64, rightType string, rightID uint64) bool {
	leftRank := agentSettingTypeRank(leftType)
	rightRank := agentSettingTypeRank(rightType)
	if leftRank != rightRank {
		return leftRank < rightRank
	}
	return leftID < rightID
}

func agentSettingTypeRank(settingType string) int {
	switch strings.ToLower(strings.TrimSpace(settingType)) {
	case "identity":
		return 10
	case "responsibility", "duty":
		return 20
	case "behavior", "style":
		return 30
	case "guardrail", "boundary":
		return 40
	case "workflow":
		return 50
	case "output":
		return 60
	case "tool":
		return 70
	case "example":
		return 80
	case "other":
		return 90
	default:
		return 100
	}
}
