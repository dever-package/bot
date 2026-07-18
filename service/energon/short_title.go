package energon

import (
	"context"
	"fmt"
	"strings"

	"github.com/google/uuid"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const defaultShortTitleLimit = 24

type ShortTitleRequest struct {
	PowerID  uint64
	Role     string
	Source   string
	MaxRunes int
}

// GenerateShortTitle performs a small, non-streaming text-power call without
// entering the agent runtime. Callers own the business rules for when a title
// may replace the current value.
func (s GatewayService) GenerateShortTitle(ctx context.Context, req ShortTitleRequest) (string, error) {
	source := strings.TrimSpace(req.Source)
	if source == "" {
		return "", fmt.Errorf("标题来源不能为空")
	}
	power, err := ResolveGeneralTextPower(ctx, req.PowerID)
	if err != nil {
		return "", err
	}
	response := s.Request(ctx, GatewayRequest{
		RequestID: uuid.NewString(),
		Body: map[string]any{
			"power":   power.Key,
			"set":     map[string]any{"role": strings.TrimSpace(req.Role)},
			"input":   PromptInput(source),
			"options": map[string]any{"stream": false, "temperature": 0},
		},
	})
	if response.Status == botprotocol.ResponseStatusFail {
		message := strings.TrimSpace(response.Msg)
		if message == "" {
			message = "文本能力调用失败"
		}
		return "", fmt.Errorf("生成短标题失败: %s", message)
	}
	title := NormalizeShortTitle(
		botprotocol.AsText(botprotocol.ExtractOutput(response.Payload())["text"]),
		req.MaxRunes,
	)
	if title == "" {
		return "", fmt.Errorf("文本能力未返回有效标题")
	}
	return title, nil
}

func NormalizeShortTitle(text string, maxRunes int) string {
	text = strings.TrimSpace(text)
	text = strings.Trim(text, "`\"'“”‘’")
	text = strings.ReplaceAll(text, "\n", " ")
	text = strings.Join(strings.Fields(text), "")
	text = strings.Trim(text, "。.!！?？、，,：:")
	if text == "" {
		return ""
	}
	if maxRunes <= 0 {
		maxRunes = defaultShortTitleLimit
	}
	runes := []rune(text)
	if len(runes) > maxRunes {
		return string(runes[:maxRunes])
	}
	return text
}
