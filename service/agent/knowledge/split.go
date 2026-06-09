package knowledge

import "strings"

func splitContent(content string, chunkSize int, overlap int) []string {
	content = strings.TrimSpace(content)
	if content == "" {
		return nil
	}
	chunkSize = normalizeChunkSize(chunkSize)
	overlap = normalizeChunkOverlap(overlap, chunkSize)

	runes := []rune(content)
	if len(runes) <= chunkSize {
		return []string{content}
	}

	step := chunkSize - overlap
	if step <= 0 {
		step = chunkSize
	}

	chunks := make([]string, 0, len(runes)/step+1)
	for start := 0; start < len(runes); start += step {
		end := start + chunkSize
		if end > len(runes) {
			end = len(runes)
		}
		chunk := strings.TrimSpace(string(runes[start:end]))
		if chunk != "" {
			chunks = append(chunks, chunk)
		}
		if end >= len(runes) {
			break
		}
	}
	return chunks
}
