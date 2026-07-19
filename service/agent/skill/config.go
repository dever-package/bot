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
	"sort"
	"strings"

	"github.com/shemic/dever/config"
	"github.com/shemic/dever/util"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const encryptedSecretPrefix = "v1:"

const MaxConfigValueBytes = 16 * 1024

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
	values := uniqueConfigSecrets(secrets)
	sort.SliceStable(values, func(i, j int) bool {
		return len([]rune(values[i])) > len([]rune(values[j]))
	})
	replacements := make([]string, 0, len(values)*2)
	for _, secret := range values {
		replacements = append(replacements, secret, "[REDACTED]")
	}
	return strings.NewReplacer(replacements...).Replace(text)
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
	if key == "" || len([]rune(key)) > MaxKeyRunes {
		return false
	}
	for index, char := range key {
		if index == 0 && !((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char == '_') {
			return false
		}
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
	if skillID == 0 {
		return []*agentmodel.SkillConfig{}
	}
	filters := map[string]any{
		"skill_id": skillID,
	}
	if activeOnly {
		filters["status"] = 1
	}
	return agentmodel.NewSkillConfigModel().Select(ctx, filters)
}

func SkillConfigRowsForTarget(ctx context.Context, skillID uint64, targetKey string, activeOnly bool) []*agentmodel.SkillConfig {
	rows := SkillConfigRows(ctx, skillID, activeOnly)
	targetKey = strings.TrimSpace(targetKey)
	result := make([]*agentmodel.SkillConfig, 0, len(rows))
	appendMatches := func(exact bool) {
		for _, row := range rows {
			if row == nil {
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
	appendMatches(true)
	appendMatches(false)
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
		if _, declared := declaredDirectKeys[envName]; !declared {
			continue
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
