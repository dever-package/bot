package prompt

import (
	"fmt"
	"strings"

	energonmodel "my/package/bot/model/energon"
)

func powerPrompt(powers []energonmodel.Power) string {
	rows := make([]string, 0, len(powers))
	for _, power := range powers {
		if strings.TrimSpace(power.Key) == "" {
			continue
		}
		rows = append(rows, fmt.Sprintf("- key: %s, name: %s, kind: %s", power.Key, power.Name, power.Kind))
	}
	if len(rows) == 0 {
		rows = append(rows, "- 暂无已启用内部能力。")
	}
	return strings.Join([]string{
		"内部能力 Energon:",
		"以下是平台动态提供的当前可调用能力。",
		"",
		"可调用能力:",
		strings.Join(rows, "\n"),
	}, "\n")
}
