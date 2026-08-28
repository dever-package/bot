package tool

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"strings"
	"sync"

	"github.com/shemic/dever/server"

	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
)

type ToolProfile struct {
	Key    string         `json:"key,omitempty"`
	Config map[string]any `json:"config,omitempty"`
}

type ToolProfileMountRequest struct {
	Profile ToolProfile
	Input   map[string]any
	Server  *server.Context
}

type ToolProfileFactory func(
	context.Context,
	ToolProfileMountRequest,
) ([]runtimeprovider.Tool, error)

var toolProfileFactories = struct {
	sync.RWMutex
	items map[string]ToolProfileFactory
}{items: map[string]ToolProfileFactory{}}

func (profile ToolProfile) Normalize() ToolProfile {
	profile.Key = strings.ToLower(strings.TrimSpace(profile.Key))
	if profile.Key == "" {
		return ToolProfile{}
	}
	profile.Config = cloneProfileMap(profile.Config)
	return profile
}

func (profile ToolProfile) CacheKey() string {
	profile = profile.Normalize()
	if profile.Key == "" {
		return ""
	}
	raw, err := json.Marshal(profile.Config)
	if err != nil {
		return profile.Key
	}
	sum := sha256.Sum256(raw)
	return profile.Key + ":" + hex.EncodeToString(sum[:8])
}

func RegisterToolProfile(key string, factory ToolProfileFactory) error {
	key = strings.ToLower(strings.TrimSpace(key))
	if key == "" || factory == nil {
		return fmt.Errorf("运行工具配置注册不完整")
	}
	toolProfileFactories.Lock()
	defer toolProfileFactories.Unlock()
	if _, exists := toolProfileFactories.items[key]; exists {
		return fmt.Errorf("运行工具配置重复: %s", key)
	}
	toolProfileFactories.items[key] = factory
	return nil
}

func mountToolProfile(
	ctx context.Context,
	profile ToolProfile,
	input map[string]any,
	serverContext *server.Context,
) ([]runtimeprovider.Tool, error) {
	profile = profile.Normalize()
	if profile.Key == "" {
		return nil, nil
	}
	toolProfileFactories.RLock()
	factory := toolProfileFactories.items[profile.Key]
	toolProfileFactories.RUnlock()
	if factory == nil {
		return nil, fmt.Errorf("运行工具配置不可用: %s", profile.Key)
	}
	return factory(ctx, ToolProfileMountRequest{
		Profile: profile,
		Input:   cloneProfileMap(input),
		Server:  serverContext,
	})
}

func cloneProfileMap(source map[string]any) map[string]any {
	if len(source) == 0 {
		return map[string]any{}
	}
	result := make(map[string]any, len(source))
	for key, value := range source {
		result[key] = value
	}
	return result
}
