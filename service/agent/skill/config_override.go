package skill

import (
	"fmt"
	"strings"
)

const (
	maxConfigOverrides = 128
)

type ConfigOverride struct {
	Key       string
	TargetKey string
	Value     string
}

// ApplyConfigOverrides adds request-scoped values without persisting them. It
// lets a new draft run before its required configuration exists in storage.
func ApplyConfigOverrides(base ConfigEnv, manifest string, targetKey string, overrides []ConfigOverride) (ConfigEnv, []string, error) {
	if len(overrides) > maxConfigOverrides {
		return ConfigEnv{}, nil, fmt.Errorf("临时配置超过 %d 项", maxConfigOverrides)
	}
	specs := manifestConfigSpecs(manifest)
	declared := make(map[string]manifestConfigSpec, len(specs))
	for _, spec := range specs {
		declared[manifestConfigIdentity(spec.TargetKey, spec.Key)] = spec
	}

	values := map[string]string{}
	order := make([]string, 0, len(base.Env)+len(specs))
	appendValue := func(key string, value string) {
		if _, exists := values[key]; !exists {
			order = append(order, key)
		}
		values[key] = value
	}
	for _, item := range base.Env {
		key, value, ok := strings.Cut(item, "=")
		if !ok || ConfigEnvName(key) == "" {
			continue
		}
		appendValue(key, value)
	}

	secrets := append([]string(nil), base.Secrets...)
	for pass := 0; pass < 2; pass++ {
		for _, override := range overrides {
			key := ConfigEnvName(override.Key)
			overrideTarget := strings.TrimSpace(override.TargetKey)
			if key == "" {
				return ConfigEnv{}, nil, fmt.Errorf("临时配置包含无效变量名: %s", override.Key)
			}
			if _, exists := declared[manifestConfigIdentity(overrideTarget, key)]; !exists {
				return ConfigEnv{}, nil, fmt.Errorf("临时配置未在 manifest.config 声明: %s", key)
			}
			isExact := overrideTarget != ""
			if (pass == 0 && isExact) || (pass == 1 && !isExact) || !manifestTargetMatches(overrideTarget, targetKey) {
				continue
			}
			value := strings.TrimSpace(override.Value)
			if value == "" {
				continue
			}
			if len([]byte(value)) > MaxConfigValueBytes {
				return ConfigEnv{}, nil, fmt.Errorf("临时配置值超过 %d 字节: %s", MaxConfigValueBytes, key)
			}
			appendValue(key, value)
			secrets = append(secrets, value)
		}
	}

	missing := make([]string, 0)
	missingSet := map[string]struct{}{}
	for _, spec := range specs {
		if !spec.Required || !manifestTargetMatches(spec.TargetKey, targetKey) {
			continue
		}
		if strings.TrimSpace(values[spec.Key]) == "" {
			if _, exists := missingSet[spec.Key]; exists {
				continue
			}
			missingSet[spec.Key] = struct{}{}
			missing = append(missing, spec.Key)
		}
	}
	result := ConfigEnv{Secrets: uniqueConfigSecrets(secrets)}
	for _, key := range order {
		result.Env = append(result.Env, key+"="+values[key])
	}
	return result, missing, nil
}

type manifestConfigSpec struct {
	Key       string
	TargetKey string
	Required  bool
}

func manifestConfigSpecs(manifest string) []manifestConfigSpec {
	items, _ := ParseManifestMap(manifest)["config"].([]any)
	result := make([]manifestConfigSpec, 0, len(items))
	for _, item := range items {
		mapped, ok := item.(map[string]any)
		if !ok {
			continue
		}
		key := ConfigEnvName(FirstText(mapped["key"]))
		if key == "" {
			continue
		}
		result = append(result, manifestConfigSpec{
			Key:       key,
			TargetKey: FirstText(FirstPresent(mapped, "target_key", "targetKey", "target")),
			Required:  Truthy(mapped["required"]),
		})
	}
	return result
}

func uniqueConfigSecrets(values []string) []string {
	result := make([]string, 0, len(values))
	seen := map[string]struct{}{}
	for _, value := range values {
		value = strings.TrimSpace(value)
		if value == "" {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
}
