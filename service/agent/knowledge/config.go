package knowledge

import (
	"fmt"
	"strings"
	"sync"

	"github.com/shemic/dever/config"
	"github.com/shemic/dever/util"

	agentmodel "my/package/bot/model/agent"
)

const (
	defaultChunkSize       = agentmodel.DefaultKnowledgeChunkSize
	defaultChunkOverlap    = agentmodel.DefaultKnowledgeChunkOverlap
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
	qdrantServiceConfigOnce sync.Once
	qdrantServiceConfig     map[string]any
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
	qdrantServiceConfigOnce.Do(func() {
		qdrantServiceConfig = readQdrantServiceConfig()
	})
	return qdrantServiceConfig
}

func readQdrantServiceConfig() map[string]any {
	raw, _, err := util.ReadJSONCFile(config.DefaultPath+"c", config.DefaultPath)
	if err != nil {
		return nil
	}
	var root map[string]any
	if err := util.UnmarshalNormalizedJSON(raw, &root); err != nil {
		return nil
	}
	qdrant, _ := root["qdrant"].(map[string]any)
	service, _ := qdrant["service"].(map[string]any)
	return service
}

func qdrantMissingAPIKeyError() error {
	return fmt.Errorf("向量数据库 API Key 未配置，请在 config/setting.jsonc 的 qdrant.service.apiKey 中填写")
}
