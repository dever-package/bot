package skill

import (
	"context"
	"encoding/json"
	"fmt"
	"regexp"
	"strings"

	"github.com/google/uuid"

	energonservice "my/package/bot/service/energon"
	botstream "my/package/bot/service/energon/stream"
	frontstream "my/package/front/service/stream"
)

type SelectionRequest struct {
	Gateway        energonservice.GatewayService
	Method         string
	Host           string
	Path           string
	Headers        map[string]string
	AgentKey       string
	PowerKey       string
	Input          map[string]any
	History        []any
	SourceTargetID uint64
	Catalog        Catalog
	Limits         Limits
}

type SelectionResult struct {
	Selected []Entry
	Keys     []string
	Reason   string
	Warning  string
	Raw      string
}

func SelectRuntime(ctx context.Context, req SelectionRequest) SelectionResult {
	if len(req.Catalog.Entries) == 0 {
		return SelectionResult{}
	}

	inputText := PrimaryInputText(req.Input)
	localSelected, localKeys := MatchByInput(req.Catalog.Entries, inputText)
	if len(localSelected) == 1 {
		return SelectionResult{
			Selected: localSelected,
			Keys:     localKeys,
			Reason:   "本地触发词唯一命中，跳过 LLM 技能选择。",
			Raw:      "local_trigger",
		}
	}

	selectorCatalog := req.Catalog
	if len(localSelected) > 1 {
		selectorCatalog = BuildCatalog(req.Catalog.PackID, localSelected, req.Limits)
	}

	body := map[string]any{
		"power": req.PowerKey,
		"set": map[string]any{
			"id":   req.AgentKey + "-skill-selector",
			"role": selectionRole(selectorCatalog.Metadata),
		},
		"input": map[string]any{
			"text": selectionPrompt(req.Input, req.History, selectorCatalog, localKeys),
		},
		"history": []any{},
		"options": map[string]any{
			"stream":      false,
			"temperature": 0,
		},
	}
	if req.SourceTargetID > 0 {
		body["source_target_id"] = req.SourceTargetID
	}

	resp := req.Gateway.Request(ctx, energonservice.GatewayRequest{
		RequestID: uuid.NewString(),
		Method:    req.Method,
		Host:      req.Host,
		Path:      req.Path,
		Headers:   req.Headers,
		Body:      body,
	})
	payload := resp.Payload()
	output := map[string]any(botstream.FrameOutput(payload))
	raw := strings.TrimSpace(FirstText(output["text"], output["json"], payload["output"]))
	if int(frontstream.InputInt64(payload["status"], 0)) == 2 {
		return SelectionResult{Warning: responseErrorMessage(payload, output, "技能选择失败"), Raw: raw}
	}

	keys, reason, err := parseSelection(raw, output)
	if err != nil {
		return SelectionResult{Warning: err.Error(), Raw: raw}
	}
	selected, normalizedKeys := matchSelectedEntries(selectorCatalog.SelectableEntries(), keys)
	return SelectionResult{
		Selected: selected,
		Keys:     normalizedKeys,
		Reason:   reason,
		Raw:      raw,
	}
}

func selectionRole(metadata string) string {
	return strings.Join([]string{
		"你是技能选择器，只判断当前任务是否需要读取技能正文。",
		"只允许从可用技能 metadata 中选择 key，不要编造 key。",
		"如果任务不需要技能，返回空数组。",
		"只输出 JSON，不要输出 Markdown 或解释文字。",
		"格式: {\"skills\":[\"skill-key\"],\"reason\":\"简短原因\"}",
		"",
		metadata,
	}, "\n")
}

func selectionPrompt(input map[string]any, history []any, catalog Catalog, localCandidates []string) string {
	parts := []string{
		"请根据本轮用户输入、临时历史和可用技能 metadata，选择需要读取正文的技能。",
		"",
		"用户输入:",
		JSONText(input),
		"",
		"临时历史:",
		JSONText(history),
		"",
		"可选技能 key:",
		strings.Join(catalog.MetadataKeys(), ", "),
	}
	if len(localCandidates) > 1 {
		parts = append(parts,
			"",
			"本地触发候选:",
			strings.Join(localCandidates, ", "),
			"这些候选不是最终结论，请结合用户任务从可选技能 key 中选择真正需要读取正文的技能。",
		)
	}
	return strings.Join(parts, "\n")
}

func parseSelection(raw string, output map[string]any) ([]string, string, error) {
	if mapped, ok := output["json"].(map[string]any); ok {
		keys, reason := selectionFromMap(mapped)
		return keys, reason, nil
	}

	raw = strings.TrimSpace(raw)
	if raw == "" {
		return nil, "", nil
	}

	jsonText := extractSelectionJSON(raw)
	if jsonText == "" {
		return nil, "", fmt.Errorf("技能选择结果不是合法 JSON")
	}

	payload := map[string]any{}
	if err := json.Unmarshal([]byte(jsonText), &payload); err != nil {
		return nil, "", fmt.Errorf("技能选择 JSON 解析失败: %s", err.Error())
	}
	keys, reason := selectionFromMap(payload)
	return keys, reason, nil
}

func selectionFromMap(payload map[string]any) ([]string, string) {
	keys := make([]string, 0)
	for _, field := range []string{"skills", "skill_keys", "skillKeys"} {
		raw, ok := payload[field].([]any)
		if !ok {
			continue
		}
		for _, item := range raw {
			if key := NormalizeKey(frontstream.InputText(item)); key != "" {
				keys = append(keys, key)
			}
		}
	}
	reason := strings.TrimSpace(frontstream.InputText(payload["reason"]))
	return keys, reason
}

func extractSelectionJSON(raw string) string {
	raw = strings.TrimSpace(raw)
	if strings.HasPrefix(raw, "{") && strings.HasSuffix(raw, "}") {
		return raw
	}

	patterns := []*regexp.Regexp{
		regexp.MustCompile("(?s)```json\\s*(\\{.*?\\})\\s*```"),
		regexp.MustCompile("(?s)```\\s*(\\{.*?\\})\\s*```"),
		regexp.MustCompile("(?s)(\\{.*\\})"),
	}
	for _, pattern := range patterns {
		match := pattern.FindStringSubmatch(raw)
		if len(match) > 1 {
			return strings.TrimSpace(match[1])
		}
	}
	return ""
}

func matchSelectedEntries(entries []Entry, keys []string) ([]Entry, []string) {
	entryByKey := make(map[string]Entry, len(entries))
	for _, entry := range entries {
		entryByKey[NormalizeKey(entry.Key)] = entry
	}

	selected := make([]Entry, 0, len(keys))
	normalizedKeys := make([]string, 0, len(keys))
	seen := map[string]bool{}
	for _, key := range keys {
		key = NormalizeKey(key)
		if key == "" || seen[key] {
			continue
		}
		entry, ok := entryByKey[key]
		if !ok {
			continue
		}
		seen[key] = true
		selected = append(selected, entry)
		normalizedKeys = append(normalizedKeys, key)
	}
	return selected, normalizedKeys
}

func responseErrorMessage(payload map[string]any, output map[string]any, fallback string) string {
	if output == nil {
		output = map[string]any{}
	}
	for _, item := range []any{payload["msg"], output["error"], output["text"]} {
		if text := strings.TrimSpace(frontstream.InputText(item)); text != "" {
			return text
		}
	}
	return fallback
}
