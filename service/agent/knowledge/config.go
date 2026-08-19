package knowledge

import (
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"sync"

	"github.com/shemic/dever/config"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const (
	defaultNodeMaxLength   = agentmodel.DefaultKnowledgeNodeMaxLength
	defaultNodeOverlap     = agentmodel.DefaultKnowledgeNodeSplitOverlap
	defaultRetrieveLimit   = agentmodel.DefaultKnowledgeRetrieveLimit
	defaultScoreThreshold  = agentmodel.DefaultKnowledgeScoreThreshold
	defaultMaxContextChars = agentmodel.DefaultKnowledgeMaxContextChars
)

type qdrantConfig struct {
	URL        string
	APIKey     string
	Collection string
}

var (
	knowledgeSettingsOnce sync.Once
	knowledgeSettings     map[string]any
)

func loadQdrantConfig() qdrantConfig {
	service := loadQdrantServiceConfig()
	return qdrantConfig{
		URL:        qdrantConfigString(service, "url", "http://127.0.0.1:6333"),
		APIKey:     qdrantConfigString(service, "apiKey", ""),
		Collection: defaultQdrantCollection(),
	}
}

func defaultQdrantCollection() string {
	service := loadQdrantServiceConfig()
	return qdrantConfigString(service, "collection", knowledgeCollectionName(agentmodel.DefaultKnowledgeCateID))
}

func qdrantConfigString(values map[string]any, key string, fallback string) string {
	value := strings.TrimSpace(util.ToString(values[key]))
	if value == "" {
		return fallback
	}
	return value
}

func loadQdrantServiceConfig() map[string]any {
	return nestedKnowledgeSetting(loadKnowledgeSettings(), "qdrant", "service")
}

func loadKnowledgeSettings() map[string]any {
	knowledgeSettingsOnce.Do(func() {
		raw, _, err := util.ReadJSONCFile(config.DefaultPath+"c", config.DefaultPath)
		if err != nil {
			return
		}
		var root map[string]any
		if err := util.UnmarshalNormalizedJSON(raw, &root); err == nil {
			knowledgeSettings = root
		}
	})
	return knowledgeSettings
}

func nestedKnowledgeSetting(root map[string]any, keys ...string) map[string]any {
	current := root
	for _, key := range keys {
		next, _ := current[key].(map[string]any)
		if next == nil {
			return nil
		}
		current = next
	}
	return current
}

func knowledgeSettingInt64(values map[string]any, key string, fallback int64) int64 {
	if values == nil {
		return fallback
	}
	switch value := values[key].(type) {
	case int:
		return int64(value)
	case int64:
		return value
	case float64:
		return int64(value)
	case json.Number:
		result, err := value.Int64()
		if err == nil {
			return result
		}
	case string:
		result, err := strconv.ParseInt(strings.TrimSpace(value), 10, 64)
		if err == nil {
			return result
		}
	}
	return fallback
}

func qdrantMissingAPIKeyError() error {
	return fmt.Errorf("向量数据库 API Key 未配置，请在 config/setting.jsonc 的 qdrant.service.apiKey 中填写")
}
