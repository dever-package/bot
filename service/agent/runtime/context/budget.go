package runtimecontext

import "strings"

func limitRunes(value string, maximum int) string {
	value = strings.TrimSpace(value)
	if value == "" || maximum <= 0 {
		return value
	}
	runes := []rune(value)
	if len(runes) <= maximum {
		return value
	}
	return strings.TrimSpace(string(runes[:maximum]))
}

func runeCount(value string) int {
	return len([]rune(value))
}
