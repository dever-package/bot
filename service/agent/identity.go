package agent

import (
	"context"
	"fmt"
	"sort"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
)

// DisplayReference identifies an agent recorded by either the current ID or a
// durable key. Historical sessions may only have the key.
type DisplayReference struct {
	ID  uint64
	Key string
}

// ResolveDisplayNames resolves a page of agent references with bounded batch
// queries. Returned names keep the same order as refs.
func ResolveDisplayNames(ctx context.Context, refs []DisplayReference) []string {
	result := make([]string, len(refs))
	if len(refs) == 0 {
		return result
	}

	ids, keys := displayReferenceValues(refs)
	byID := make(map[uint64]string, len(ids))
	byKey := make(map[string]string, len(keys))
	model := agentmodel.NewAgentModel()
	if len(ids) > 0 {
		for _, row := range model.Select(ctx, map[string]any{"id": ids}, map[string]any{
			"field": "main.id,main.key,main.name",
		}) {
			if row == nil {
				continue
			}
			name := strings.TrimSpace(row.Name)
			byID[row.ID] = name
			if key := strings.TrimSpace(row.Key); key != "" {
				byKey[key] = name
			}
		}
	}

	unresolvedKeys := make([]string, 0, len(keys))
	for _, key := range keys {
		if _, exists := byKey[key]; !exists {
			unresolvedKeys = append(unresolvedKeys, key)
		}
	}
	if len(unresolvedKeys) > 0 {
		for _, row := range model.Select(ctx, map[string]any{"key": unresolvedKeys}, map[string]any{
			"field": "main.id,main.key,main.name",
		}) {
			if row == nil {
				continue
			}
			name := strings.TrimSpace(row.Name)
			byID[row.ID] = name
			if key := strings.TrimSpace(row.Key); key != "" {
				byKey[key] = name
			}
		}
	}

	for index, ref := range refs {
		result[index] = displayAgentName(ref, byID, byKey)
	}
	return result
}

func displayReferenceValues(refs []DisplayReference) ([]uint64, []string) {
	uniqueIDs := make(map[uint64]struct{})
	uniqueKeys := make(map[string]struct{})
	for _, ref := range refs {
		if ref.ID > 0 {
			uniqueIDs[ref.ID] = struct{}{}
		}
		if key := strings.TrimSpace(ref.Key); key != "" {
			uniqueKeys[key] = struct{}{}
		}
	}
	ids := make([]uint64, 0, len(uniqueIDs))
	for id := range uniqueIDs {
		ids = append(ids, id)
	}
	keys := make([]string, 0, len(uniqueKeys))
	for key := range uniqueKeys {
		keys = append(keys, key)
	}
	sort.Slice(ids, func(i, j int) bool { return ids[i] < ids[j] })
	sort.Strings(keys)
	return ids, keys
}

func displayAgentName(ref DisplayReference, byID map[uint64]string, byKey map[string]string) string {
	if name := strings.TrimSpace(byID[ref.ID]); name != "" {
		return name
	}
	key := strings.TrimSpace(ref.Key)
	if name := strings.TrimSpace(byKey[key]); name != "" {
		return name
	}
	if key != "" {
		return fmt.Sprintf("历史智能体：%s", key)
	}
	if ref.ID > 0 {
		return fmt.Sprintf("智能体 #%d（已删除）", ref.ID)
	}
	return "未记录智能体"
}
