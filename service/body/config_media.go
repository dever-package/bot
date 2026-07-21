package body

import (
	"encoding/json"
	"strings"
)

type bodyConfigMediaItem struct {
	URL     string `json:"url"`
	Src     string `json:"src"`
	Path    string `json:"path"`
	OpenURL string `json:"open_url"`
}

func bodyConfigMediaURL(value string) string {
	value = strings.TrimSpace(value)
	if value == "" || (value[0] != '[' && value[0] != '{') {
		return value
	}

	var items []bodyConfigMediaItem
	if value[0] == '[' {
		if err := json.Unmarshal([]byte(value), &items); err != nil || len(items) == 0 {
			return ""
		}
		return firstBodyConfigMediaURL(items[0])
	}

	var item bodyConfigMediaItem
	if err := json.Unmarshal([]byte(value), &item); err != nil {
		return ""
	}
	return firstBodyConfigMediaURL(item)
}

func firstBodyConfigMediaURL(item bodyConfigMediaItem) string {
	for _, value := range []string{item.URL, item.Src, item.Path, item.OpenURL} {
		if value = strings.TrimSpace(value); value != "" {
			return value
		}
	}
	return ""
}
