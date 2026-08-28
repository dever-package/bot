package asset

import (
	"crypto/sha256"
	"encoding/hex"
	"net/url"
	"strings"
)

func BuildImportDedupeKey(platform string, externalID string, sourceURL string) string {
	platform = strings.ToLower(strings.TrimSpace(platform))
	identity := strings.TrimSpace(externalID)
	if identity == "" {
		identity = normalizeImportSourceURL(sourceURL)
	}
	if platform == "" || identity == "" {
		return ""
	}
	digest := sha256.Sum256([]byte(platform + ":" + identity))
	return hex.EncodeToString(digest[:])[:32]
}

func BuildImportNodeKey(platform string, dedupeKey string) string {
	platform = strings.ToLower(strings.TrimSpace(platform))
	dedupeKey = strings.ToLower(strings.TrimSpace(dedupeKey))
	if platform == "" || dedupeKey == "" {
		return ""
	}
	return "import:" + platform + ":" + dedupeKey
}

func normalizeImportSourceURL(value string) string {
	parsed, err := url.Parse(strings.TrimSpace(value))
	if err != nil || parsed == nil || parsed.Hostname() == "" {
		return strings.TrimSpace(value)
	}
	parsed.Scheme = strings.ToLower(parsed.Scheme)
	parsed.Host = strings.ToLower(parsed.Host)
	parsed.Fragment = ""
	parsed.RawQuery = parsed.Query().Encode()
	return parsed.String()
}
