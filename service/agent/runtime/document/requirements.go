package document

import (
	"context"
	"strconv"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const documentBlockRequestedCountKey = "requested_count"

type MediaCoverage struct {
	Required   map[string]int `json:"required"`
	Scheduled  map[string]int `json:"scheduled"`
	Ready      map[string]int `json:"ready"`
	Generating map[string]int `json:"generating"`
	Failed     map[string]int `json:"failed"`
}

func (coverage MediaCoverage) RequiredTotal() int {
	return mediaCountTotal(coverage.Required)
}

func (coverage MediaCoverage) ScheduledTotal() int {
	return mediaCountTotal(coverage.Scheduled)
}

func (coverage MediaCoverage) Missing() map[string]int {
	missing := map[string]int{}
	for kind, required := range coverage.Required {
		if count := required - coverage.Scheduled[kind]; count > 0 {
			missing[kind] = count
		}
	}
	return missing
}

func (coverage MediaCoverage) MissingTotal() int {
	return mediaCountTotal(coverage.Missing())
}

func (coverage MediaCoverage) Payload() map[string]any {
	return map[string]any{
		"required":   coverage.Required,
		"scheduled":  coverage.Scheduled,
		"ready":      coverage.Ready,
		"generating": coverage.Generating,
		"failed":     coverage.Failed,
		"missing":    coverage.Missing(),
	}
}

func (s Service) MediaCoverage(ctx context.Context, documentID uint64) MediaCoverage {
	document := s.repository.find(ctx, documentID)
	if document == nil {
		return newMediaCoverage()
	}
	return buildMediaCoverage(*document, s.repository.blocks(ctx, documentID))
}

func buildMediaCoverage(document agentmodel.Document, blocks []agentmodel.DocumentBlock) MediaCoverage {
	coverage := newMediaCoverage()
	meta := decodeMap(document.Meta)
	if required, ok := meta["required_media"].(map[string]any); ok {
		for kind, value := range required {
			kind = normalizeCoverageMediaKind(kind)
			if count := mediaCountValue(value); kind != "" && count > 0 {
				coverage.Required[kind] = count
			}
		}
	}
	for _, block := range blocks {
		if block.Type != agentmodel.DocumentBlockTypeMedia {
			continue
		}
		kind := normalizeCoverageMediaKind(block.MediaKind)
		if kind == "" {
			continue
		}
		count := mediaCountValue(decodeMap(block.Meta)[documentBlockRequestedCountKey])
		if count < 1 {
			count = 1
		}
		coverage.Scheduled[kind] += count
		switch block.Status {
		case agentmodel.DocumentBlockStatusReady:
			coverage.Ready[kind] += count
		case agentmodel.DocumentBlockStatusFailed:
			coverage.Failed[kind] += count
		default:
			coverage.Generating[kind] += count
		}
	}
	return coverage
}

func newMediaCoverage() MediaCoverage {
	return MediaCoverage{
		Required:   map[string]int{},
		Scheduled:  map[string]int{},
		Ready:      map[string]int{},
		Generating: map[string]int{},
		Failed:     map[string]int{},
	}
}

func normalizeCoverageMediaKind(kind string) string {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case "image":
		return "image"
	case "video":
		return "video"
	case "audio":
		return "audio"
	case "file":
		return "file"
	default:
		return ""
	}
}

func mediaCountTotal(counts map[string]int) int {
	total := 0
	for _, count := range counts {
		if count > 0 {
			total += count
		}
	}
	return total
}

func mediaCountValue(value any) int {
	switch current := value.(type) {
	case int:
		return current
	case int64:
		return int(current)
	case uint64:
		return int(current)
	case float64:
		return int(current)
	case string:
		parsed, _ := strconv.Atoi(strings.TrimSpace(current))
		return parsed
	default:
		return 0
	}
}
