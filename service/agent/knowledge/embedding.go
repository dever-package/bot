package knowledge

import (
	"context"
	"fmt"
	"math"
	"strconv"
	"strings"

	"github.com/google/uuid"
	"github.com/shemic/dever/util"
	energonmodel "my/package/bot/model/energon"
	energonservice "my/package/bot/service/energon"
	botprotocol "my/package/bot/service/energon/protocol"
)

type embeddingService struct {
	gateway energonservice.GatewayService
}

func newEmbeddingService() embeddingService {
	return embeddingService{gateway: energonservice.NewGatewayService()}
}

func (s embeddingService) embed(ctx context.Context, powerID uint64, text string) ([]float64, error) {
	text = strings.TrimSpace(text)
	if text == "" {
		return nil, fmt.Errorf("向量文本不能为空")
	}
	power, err := activeEmbeddingPower(ctx, powerID)
	if err != nil {
		return nil, err
	}

	resp := s.gateway.Request(ctx, energonservice.GatewayRequest{
		RequestID: uuid.NewString(),
		Body: map[string]any{
			"power": power.Key,
			"input": map[string]any{
				"text":  text,
				"input": text,
			},
			"options": map[string]any{
				"stream": false,
			},
		},
	})
	if resp.Status != botprotocol.ResponseStatusSuccess {
		return nil, fmt.Errorf("生成向量失败: %s", resp.Msg)
	}
	vector := parseEmbeddingVector(resp.Output)
	if len(vector) == 0 {
		return nil, fmt.Errorf("生成向量失败: 未返回 embedding")
	}
	return vector, nil
}

func activeEmbeddingPower(ctx context.Context, powerID uint64) (energonmodel.Power, error) {
	if powerID == 0 {
		return energonmodel.Power{}, fmt.Errorf("知识库未配置向量能力")
	}
	row := energonmodel.NewPowerModel().Find(ctx, map[string]any{"id": powerID})
	if row == nil {
		return energonmodel.Power{}, fmt.Errorf("向量能力不存在")
	}
	if row.Status != 1 {
		return energonmodel.Power{}, fmt.Errorf("向量能力已停用: %s", row.Name)
	}
	if strings.ToLower(strings.TrimSpace(row.Kind)) != "embeddings" {
		return energonmodel.Power{}, fmt.Errorf("向量能力必须选择 embeddings 类型: %s", row.Name)
	}
	return *row, nil
}

func defaultEmbeddingPowerID(ctx context.Context) uint64 {
	rows := energonmodel.NewPowerModel().Select(ctx, map[string]any{
		"kind":   "embeddings",
		"status": 1,
	})
	for _, row := range rows {
		if row != nil && row.ID > 0 {
			return row.ID
		}
	}
	return 0
}

func parseEmbeddingVector(output botprotocol.Output) []float64 {
	for _, key := range embeddingVectorKeys() {
		if vector := numberList(output[key]); len(vector) > 0 {
			return vector
		}
	}
	if vector := numberList(output["json"]); len(vector) > 0 {
		return vector
	}
	if data, ok := output["data"].([]any); ok {
		for _, item := range data {
			if vector := parseEmbeddingFromMap(item); len(vector) > 0 {
				return vector
			}
		}
	}
	if dataMap := botprotocol.NormalizeMap(output["data"]); len(dataMap) > 0 {
		if vector := parseEmbeddingFromMap(dataMap); len(vector) > 0 {
			return vector
		}
	}
	if jsonMap := botprotocol.NormalizeMap(output["json"]); len(jsonMap) > 0 {
		if vector := parseEmbeddingFromMap(jsonMap); len(vector) > 0 {
			return vector
		}
	}
	return parseEmbeddingFromMap(map[string]any(output))
}

func parseEmbeddingFromMap(value any) []float64 {
	mapped, ok := value.(map[string]any)
	if !ok {
		return nil
	}
	for _, key := range embeddingVectorKeys() {
		if vector := numberList(mapped[key]); len(vector) > 0 {
			return vector
		}
	}
	if vector := numberList(mapped["json"]); len(vector) > 0 {
		return vector
	}
	if data, ok := mapped["data"].([]any); ok {
		for _, item := range data {
			if vector := parseEmbeddingFromMap(item); len(vector) > 0 {
				return vector
			}
		}
	}
	if dataMap := botprotocol.NormalizeMap(mapped["data"]); len(dataMap) > 0 {
		if vector := parseEmbeddingFromMap(dataMap); len(vector) > 0 {
			return vector
		}
	}
	return nil
}

func embeddingVectorKeys() []string {
	return botprotocol.EmbeddingVectorKeys()
}

func numberList(value any) []float64 {
	switch current := value.(type) {
	case []float64:
		return current
	case []float32:
		result := make([]float64, 0, len(current))
		for _, item := range current {
			result = append(result, float64(item))
		}
		return result
	case []int:
		result := make([]float64, 0, len(current))
		for _, item := range current {
			result = append(result, float64(item))
		}
		return result
	case []any:
		result := make([]float64, 0, len(current))
		for _, item := range current {
			number, ok := embeddingNumber(item)
			if !ok {
				return nil
			}
			result = append(result, number)
		}
		return result
	default:
		return nil
	}
}

func embeddingNumber(value any) (float64, bool) {
	switch current := value.(type) {
	case float64:
		if math.IsNaN(current) || math.IsInf(current, 0) {
			return 0, false
		}
		return current, true
	case float32:
		return float64(current), true
	case int:
		return float64(current), true
	case int64:
		return float64(current), true
	case uint64:
		return float64(current), true
	case string:
		parsed, err := strconv.ParseFloat(strings.TrimSpace(current), 64)
		if err != nil || math.IsNaN(parsed) || math.IsInf(parsed, 0) {
			return 0, false
		}
		return parsed, true
	default:
		return 0, false
	}
}

func ensureEmbeddingPowerID(ctx context.Context, value any) uint64 {
	id := util.ToUint64(value)
	if id > 0 {
		return id
	}
	return defaultEmbeddingPowerID(ctx)
}

func ensureKnowledgeBaseEmbedding(ctx context.Context, record map[string]any) {
	if id := ensureEmbeddingPowerID(ctx, record["embedding_power_id"]); id > 0 {
		record["embedding_power_id"] = id
	}
}

func validateKnowledgeBaseEmbedding(ctx context.Context, record map[string]any) error {
	id := util.ToUint64(record["embedding_power_id"])
	if id == 0 {
		return fmt.Errorf("请先配置并选择 embeddings 类型的向量能力")
	}
	_, err := activeEmbeddingPower(ctx, id)
	return err
}
