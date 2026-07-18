package skill

import (
	"context"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"

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

type ConfigEnv struct {
	Env     []string
	Secrets []string
}

func EncryptSecret(value string) (string, error) {
	value = strings.TrimSpace(value)
	if value == "" {
		return "", nil
	}
	key, err := configuredSecretKey()
	if err != nil {
		return "", err
	}
	block, err := aes.NewCipher(key)
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
	keys := configuredSecretKeys()
	legacyKey := legacySecretKey()
	keys = appendUniqueSecretKey(keys, legacyKey)
	for _, key := range keys {
		plain, decryptErr := decryptSecretPayload(raw, key)
		if decryptErr == nil {
			return plain, nil
		}
	}
	return "", fmt.Errorf("配置密文无法解密，请检查 DEVER_SKILL_SECRET、DEVER_SKILL_SECRET_PREVIOUS 或 JWT 密钥")
}

func SecretHint(value string) string {
	value = strings.TrimSpace(value)
	if value == "" {
		return ""
	}
	return "已填写"
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
	if !IsValidConfigEnvName(key) {
		return ""
	}
	return key
}

func IsValidConfigEnvName(key string) bool {
	key = strings.TrimSpace(key)
	if key == "" {
		return false
	}
	for _, char := range key {
		if (char >= 'a' && char <= 'z') ||
			(char >= 'A' && char <= 'Z') ||
			(char >= '0' && char <= '9') ||
			char == '_' {
			continue
		}
		return false
	}
	if _, reserved := reservedConfigEnvNames[strings.ToUpper(key)]; reserved {
		return false
	}
	return true
}

func SkillConfigRows(ctx context.Context, skillID uint64, activeOnly bool) []*agentmodel.SkillConfig {
	result := []*agentmodel.SkillConfig{}
	if skillID == 0 {
		return result
	}

	seen := map[uint64]struct{}{}
	directFilters := map[string]any{
		"skill_id": skillID,
	}
	if activeOnly {
		directFilters["status"] = 1
	}
	directRows := agentmodel.NewSkillConfigModel().Select(ctx, directFilters)
	for _, row := range directRows {
		if row == nil || row.ID == 0 {
			continue
		}
		seen[row.ID] = struct{}{}
		result = append(result, row)
	}

	bindRows := agentmodel.NewSkillConfigBindModel().Select(ctx, map[string]any{
		"skill_id": skillID,
	})
	configIDs := make([]uint64, 0, len(bindRows))
	for _, bind := range bindRows {
		if bind == nil || bind.ConfigID == 0 {
			continue
		}
		configIDs = append(configIDs, bind.ConfigID)
	}
	configByID := skillConfigRowsByID(ctx, configIDs, activeOnly)
	for _, configID := range configIDs {
		row := configByID[configID]
		if row == nil {
			continue
		}
		if _, exists := seen[row.ID]; exists {
			continue
		}
		seen[row.ID] = struct{}{}
		result = append(result, row)
	}
	return result
}

func SkillConfigRowsForTarget(ctx context.Context, skillID uint64, targetKey string, activeOnly bool) []*agentmodel.SkillConfig {
	rows := SkillConfigRows(ctx, skillID, activeOnly)
	targetKey = strings.TrimSpace(targetKey)
	result := make([]*agentmodel.SkillConfig, 0, len(rows))
	appendMatches := func(direct bool, exact bool) {
		for _, row := range rows {
			if row == nil || (row.SkillID > 0) != direct {
				continue
			}
			rowTarget := strings.TrimSpace(row.TargetKey)
			if exact {
				if targetKey == "" || rowTarget != targetKey {
					continue
				}
			} else if rowTarget != "" {
				continue
			}
			result = append(result, row)
		}
	}
	appendMatches(true, true)
	appendMatches(true, false)
	appendMatches(false, true)
	appendMatches(false, false)
	return result
}

func skillConfigRowsByID(ctx context.Context, configIDs []uint64, activeOnly bool) map[uint64]*agentmodel.SkillConfig {
	result := map[uint64]*agentmodel.SkillConfig{}
	if len(configIDs) == 0 {
		return result
	}
	filters := map[string]any{
		"id":       configIDs,
		"skill_id": uint64(0),
	}
	if activeOnly {
		filters["status"] = 1
	}
	rows := agentmodel.NewSkillConfigModel().Select(ctx, filters)
	for _, row := range rows {
		if row == nil || row.ID == 0 {
			continue
		}
		result[row.ID] = row
	}
	return result
}

func LoadConfigEnv(ctx context.Context, skillID uint64, manifest string, targetKey string) (ConfigEnv, error) {
	if skillID == 0 {
		return ConfigEnv{}, nil
	}
	rows := SkillConfigRowsForTarget(ctx, skillID, targetKey, true)
	declaredDirectKeys := manifestConfigKeysForTarget(manifest, targetKey)
	result := ConfigEnv{}
	seen := map[string]struct{}{}
	for _, row := range rows {
		if row == nil {
			continue
		}
		envName := ConfigEnvName(row.Key)
		if envName == "" {
			continue
		}
		if row.SkillID > 0 {
			if _, declared := declaredDirectKeys[envName]; !declared {
				continue
			}
		}
		if _, exists := seen[envName]; exists {
			continue
		}
		value, secret, err := resolveConfigEnvValue(row)
		if err != nil {
			return ConfigEnv{}, err
		}
		if value == "" {
			continue
		}
		seen[envName] = struct{}{}
		result.Env = append(result.Env, envName+"="+value)
		if secret {
			result.Secrets = append(result.Secrets, value)
		}
	}
	return result, nil
}

func manifestConfigKeysForTarget(manifest string, targetKey string) map[string]struct{} {
	result := map[string]struct{}{}
	items, _ := ParseManifestMap(manifest)["config"].([]any)
	for _, item := range items {
		mapped, ok := item.(map[string]any)
		if !ok {
			continue
		}
		itemTarget := FirstText(FirstPresent(mapped, "target_key", "targetKey", "target"))
		if !manifestTargetMatches(itemTarget, targetKey) {
			continue
		}
		if key := ConfigEnvName(FirstText(mapped["key"])); key != "" {
			result[key] = struct{}{}
		}
	}
	return result
}

func resolveConfigEnvValue(row *agentmodel.SkillConfig) (string, bool, error) {
	storedValue := strings.TrimSpace(row.ValueEncrypted)
	if storedValue == "" {
		return "", false, nil
	}
	if agentmodel.NormalizeSkillConfigType(strings.TrimSpace(row.Type)) != agentmodel.SkillConfigTypeSecret {
		return storedValue, false, nil
	}
	secret, err := DecryptSecret(storedValue)
	if err != nil {
		return "", false, fmt.Errorf("环境变量 %s 解密失败", row.Key)
	}
	return strings.TrimSpace(secret), true, nil
}

func configuredSecretKey() ([]byte, error) {
	seed := strings.TrimSpace(os.Getenv("DEVER_SKILL_SECRET"))
	if seed == "" {
		seed = configJWTSecret()
	}
	if seed == "" {
		return nil, fmt.Errorf("未配置技能密钥，请设置 DEVER_SKILL_SECRET 或 JWT 密钥")
	}
	sum := sha256.Sum256([]byte(seed))
	return sum[:], nil
}

func configuredSecretKeys() [][]byte {
	keys := make([][]byte, 0, 4)
	if key, err := configuredSecretKey(); err == nil {
		keys = appendUniqueSecretKey(keys, key)
	}
	for _, seed := range strings.FieldsFunc(os.Getenv("DEVER_SKILL_SECRET_PREVIOUS"), func(char rune) bool {
		return char == ',' || char == ';' || char == '\n'
	}) {
		seed = strings.TrimSpace(seed)
		if seed == "" {
			continue
		}
		sum := sha256.Sum256([]byte(seed))
		keys = appendUniqueSecretKey(keys, sum[:])
	}
	return keys
}

func appendUniqueSecretKey(keys [][]byte, candidate []byte) [][]byte {
	for _, key := range keys {
		if subtle.ConstantTimeCompare(key, candidate) == 1 {
			return keys
		}
	}
	return append(keys, candidate)
}

func legacySecretKey() []byte {
	sum := sha256.Sum256([]byte(fallbackSecretSeed()))
	return sum[:]
}

func decryptSecretPayload(raw []byte, key []byte) (string, error) {
	block, err := aes.NewCipher(key)
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
	plain, err := gcm.Open(nil, nonce, raw[gcm.NonceSize():], nil)
	if err != nil {
		return "", err
	}
	return string(plain), nil
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
