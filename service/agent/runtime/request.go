package runtime

import (
	"strconv"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
)

func buildGatewayBody(agent agentmodel.Agent, power energonmodel.Power, prompt string, input string, history []any) map[string]any {
	return map[string]any{
		"power": power.Key,
		"set": map[string]any{
			"id":   strconv.FormatUint(agent.ID, 10),
			"role": prompt,
		},
		"input":   map[string]any{"text": input},
		"history": history,
		"options": map[string]any{
			"stream":      true,
			"temperature": normalizeTemperature(agent.Temperature),
		},
	}
}

func normalizeTemperature(value float64) float64 {
	if value < 0 || value > 2 {
		return 0.7
	}
	return value
}
