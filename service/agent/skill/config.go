package skill

import (
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"sync"

	"github.com/shemic/dever/config"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const encryptedSecretPrefix = "v1:"

var reservedConfigEnvNames = map[string]struct{}{
	"PATH":           {},
	"HOME":           {},
	"TMPDIR":         {},
	"AGENT_TEMP_DIR": {},
	"LANG":           {},
	"LC_ALL":         {},
}

var (
	secretKeyOnce  sync.Once
	secretKeyValue []byte
)

type ConfigEnv struct {
	Env     []string
	Secrets []string
}

func EncryptSecret(value string) (string, error) {
	value = strings.TrimSpace(value)
	if value == "" {
		return "", nil
	}
	block, err := aes.NewCipher(secretKey())
	if err != nil {
		return "", err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}
	nonce := make([]byte, gcm.NonceSize())
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		return "", err
	}
	payload := append(nonce, gcm.Seal(nil, nonce, []byte(value), nil)...)
	return encryptedSecretPrefix + base64.RawURLEncoding.EncodeToString(payload), nil
}

func DecryptSecret(value string) (string, error) {
	value = strings.TrimSpace(value)
	if value == "" {
		return "", nil
	}
	if !strings.HasPrefix(value, encryptedSecretPrefix) {
		return value, nil
	}
	raw, err := base64.RawURLEncoding.DecodeString(strings.TrimPrefix(value, encryptedSecretPrefix))
	if err != nil {
		return "", err
	}
	block, err := aes.NewCipher(secretKey())
	if err != nil {
		return "", err
	}
	gcm, err := cipher.NewGCM(block)
	if err != nil {
		return "", err
	}
	if len(raw) < gcm.NonceSize() {
		return "", fmt.Errorf("配置密文格式错误")
	}
	nonce := raw[:gcm.NonceSize()]
	ciphertext := raw[gcm.NonceSize():]
	plain, err := gcm.Open(nil, nonce, ciphertext, nil)
	if err != nil {
		return "", err
	}
	return string(plain), nil
}

func SecretHint(value string) string {
	value = strings.TrimSpace(value)
	if value == "" {
		return ""
	}
	runes := []rune(value)
	if len(runes) <= 4 {
		return "已配置 ****"
	}
	return "已配置 ****" + string(runes[len(runes)-4:])
}

func RedactSecrets(text string, secrets []string) string {
	if text == "" || len(secrets) == 0 {
		return text
	}
	result := text
	for _, secret := range secrets {
		secret = strings.TrimSpace(secret)
		if len([]rune(secret)) < 4 {
			continue
		}
		result = strings.ReplaceAll(result, secret, "[REDACTED]")
	}
	return result
}

func ConfigEnvName(key string) string {
	key = strings.TrimSpace(key)
	if key == "" {
		return ""
	}
	var builder strings.Builder
	for _, char := range key {
		switch {
		case char >= 'a' && char <= 'z':
			builder.WriteRune(char - ('a' - 'A'))
		case char >= 'A' && char <= 'Z':
			builder.WriteRune(char)
		case char >= '0' && char <= '9':
			builder.WriteRune(char)
		case char == '_' || char == '-' || char == '.':
			builder.WriteRune('_')
		}
	}
	result := strings.Trim(builder.String(), "_")
	if result == "" {
		return ""
	}
	if result[0] >= '0' && result[0] <= '9' {
		result = "SKILL_" + result
	}
	if _, reserved := reservedConfigEnvNames[result]; reserved {
		return ""
	}
	return result
}

func LoadConfigEnv(ctx context.Context, skillID uint64, targetKey string) (ConfigEnv, error) {
	if skillID == 0 {
		return ConfigEnv{}, nil
	}
	targetKey = strings.TrimSpace(targetKey)
	rows := agentmodel.NewSkillConfigModel().Select(ctx, map[string]any{
		"skill_id": skillID,
		"status":   1,
	})
	result := ConfigEnv{}
	seen := map[string]struct{}{}
	for _, row := range rows {
		if row == nil || !skillConfigTargetMatches(row.TargetKey, targetKey) {
			continue
		}
		envName := ConfigEnvName(row.Key)
		if envName == "" {
			continue
		}
		if _, exists := seen[envName]; exists {
			continue
		}
		secret, err := DecryptSecret(row.ValueEncrypted)
		if err != nil {
			return ConfigEnv{}, fmt.Errorf("技能配置 %s 解密失败", row.Key)
		}
		if strings.TrimSpace(secret) == "" {
			continue
		}
		seen[envName] = struct{}{}
		result.Env = append(result.Env, envName+"="+secret)
		result.Secrets = append(result.Secrets, secret)
	}
	return result, nil
}

func SyncConfigManifest(ctx context.Context, skillID uint64) error {
	if skillID == 0 {
		return nil
	}
	skillModel := agentmodel.NewSkillModel()
	row := skillModel.Find(ctx, map[string]any{"id": skillID})
	if row == nil {
		return nil
	}
	manifest := parseManifestMap(row.Manifest)
	configRows := agentmodel.NewSkillConfigModel().Select(ctx, map[string]any{
		"skill_id": skillID,
		"status":   1,
	})
	existingConfigs := manifestConfigByKey(manifest["config"])
	configs := make([]any, 0, len(configRows))
	for _, configRow := range configRows {
		if configRow == nil {
			continue
		}
		envName := ConfigEnvName(configRow.Key)
		if envName == "" {
			continue
		}
		config := map[string]any{
			"key":        strings.TrimSpace(configRow.Key),
			"name":       strings.TrimSpace(configRow.Name),
			"type":       strings.TrimSpace(configRow.Type),
			"target_key": strings.TrimSpace(configRow.TargetKey),
			"env":        envName,
		}
		if skillConfigRequired(configRow.Required, existingConfigs[configKey(configRow.TargetKey, configRow.Key)]) {
			config["required"] = true
		}
		configs = append(configs, config)
	}
	manifest["config"] = configs
	skillModel.Update(ctx, map[string]any{"id": skillID}, map[string]any{
		"manifest": JSONText(manifest),
	})
	return nil
}

func manifestConfigByKey(raw any) map[string]map[string]any {
	items, ok := raw.([]any)
	if !ok {
		return map[string]map[string]any{}
	}
	result := make(map[string]map[string]any, len(items))
	for _, item := range items {
		mapped, ok := item.(map[string]any)
		if !ok {
			continue
		}
		key := strings.TrimSpace(fmt.Sprint(FirstPresent(mapped, "key", "env")))
		if key == "" || key == "<nil>" {
			continue
		}
		targetKey := strings.TrimSpace(fmt.Sprint(FirstPresent(mapped, "target_key", "targetKey", "target")))
		result[configKey(targetKey, key)] = mapped
	}
	return result
}

func skillConfigRequired(value int16, existing map[string]any) bool {
	switch value {
	case agentmodel.SkillConfigRequiredYes:
		return true
	case agentmodel.SkillConfigRequiredNo:
		return false
	default:
		return existing != nil && Truthy(existing["required"])
	}
}

func parseManifestMap(raw string) map[string]any {
	result := map[string]any{}
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return result
	}
	_ = json.Unmarshal([]byte(raw), &result)
	return result
}

func skillConfigTargetMatches(rowTarget string, requestTarget string) bool {
	rowTarget = strings.TrimSpace(rowTarget)
	requestTarget = strings.TrimSpace(requestTarget)
	if rowTarget == "" {
		return true
	}
	return requestTarget != "" && rowTarget == requestTarget
}

func secretKey() []byte {
	secretKeyOnce.Do(func() {
		seed := strings.TrimSpace(os.Getenv("DEVER_SKILL_SECRET"))
		if seed == "" {
			seed = configJWTSecret()
		}
		if seed == "" {
			seed = fallbackSecretSeed()
		}
		sum := sha256.Sum256([]byte(seed))
		secretKeyValue = sum[:]
	})
	return secretKeyValue
}

func configJWTSecret() string {
	cfg, err := config.Load("")
	if err != nil || cfg == nil {
		return ""
	}
	if secret := strings.TrimSpace(cfg.Auth.JWTSecret); secret != "" {
		return secret
	}
	for _, scheme := range cfg.Auth.JWT.Schemes {
		if secret := strings.TrimSpace(scheme.Secret); secret != "" {
			return secret
		}
		if env := strings.TrimSpace(scheme.SecretEnv); env != "" {
			if secret := strings.TrimSpace(os.Getenv(env)); secret != "" {
				return secret
			}
		}
	}
	return ""
}

func fallbackSecretSeed() string {
	workingDir, err := os.Getwd()
	if err != nil {
		workingDir = "."
	}
	absolute, err := filepath.Abs(workingDir)
	if err != nil {
		absolute = workingDir
	}
	return "dever-skill-config:" + util.ToStringTrimmed(absolute)
}
