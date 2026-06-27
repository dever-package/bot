package agentcontext

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"strconv"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

const skillSelectionCacheTTL = 10 * time.Minute

func (a Assembler) selectAndLoadSkills(ctx context.Context, req Request, collected collectedContext, plan Plan) (agentskill.Catalog, agentskill.SelectionResult) {
	catalog := collected.SkillCatalog
	if len(catalog.Entries) == 0 {
		return catalog, agentskill.SelectionResult{}
	}

	selection := a.selectSkills(ctx, req, collected, plan)
	loadedSkills, loadWarnings := agentskill.LoadContents(selection.Selected, collected.SkillLimits)
	catalog.Loaded = loadedSkills
	catalog.LoadedContent = agentskill.RenderLoaded(loadedSkills)
	if len(loadWarnings) > 0 {
		catalog.Warning = strings.Join(loadWarnings, "\n")
	}
	return catalog, selection
}

func (a Assembler) selectSkills(ctx context.Context, req Request, collected collectedContext, plan Plan) agentskill.SelectionResult {
	if plan.SkillsPlanned {
		selected, keys := matchSkillKeys(collected.SkillCatalog.SelectableEntries(), plan.SkillKeys)
		reason := firstNonEmpty(plan.Reason, "上下文规划完成，未选择技能。")
		if len(keys) > 0 {
			reason = firstNonEmpty(plan.Reason, "上下文规划选择技能。")
		}
		return agentskill.SelectionResult{Selected: selected, Keys: keys, Reason: reason, Raw: "context_plan"}
	}
	cacheKey := skillSelectionCacheKey(req, collected)
	if cached, ok := a.cache.Get(cacheKey); ok {
		if selection, ok := cached.(agentskill.SelectionResult); ok {
			return selection
		}
	}
	selection := agentskill.SelectRuntime(ctx, agentskill.SelectionRequest{
		Gateway:        a.gateway,
		Method:         req.Method,
		Host:           req.Host,
		Path:           req.Path,
		Headers:        req.Headers,
		AgentIdentity:  agentIdentity(req.Agent),
		PowerKey:       a.selectorPowerKey(ctx, req),
		Input:          req.Input,
		History:        selectionHistory(collected.ContextNotes, collected.Baseline),
		SourceTargetID: req.SourceTargetID,
		Catalog:        collected.SkillCatalog,
		Limits:         collected.SkillLimits,
	})
	a.cache.Set(cacheKey, selection, skillSelectionCacheTTL)
	return selection
}

func matchSkillKeys(entries []agentskill.Entry, keys []string) ([]agentskill.Entry, []string) {
	byKey := make(map[string]agentskill.Entry, len(entries))
	for _, entry := range entries {
		byKey[agentskill.NormalizeKey(entry.Key)] = entry
	}
	selected := make([]agentskill.Entry, 0, len(keys))
	normalized := make([]string, 0, len(keys))
	for _, key := range keys {
		key = agentskill.NormalizeKey(key)
		if key == "" {
			continue
		}
		entry, exists := byKey[key]
		if !exists {
			continue
		}
		selected = append(selected, entry)
		normalized = append(normalized, entry.Key)
	}
	return selected, normalized
}

func selectionHistory(notes []ContextNote, baseline Baseline) []any {
	rows := make([]any, 0, len(notes)+1)
	if baseline.Found {
		rows = append(rows, map[string]any{
			"type":    "baseline",
			"summary": baselineNoteText(baseline),
		})
	}
	for _, note := range notes {
		rows = append(rows, map[string]any{
			"role": note.Role,
			"text": note.Text,
		})
	}
	return rows
}

func skillSelectionCacheKey(req Request, collected collectedContext) string {
	hash := sha256.Sum256([]byte(strings.Join([]string{
		"skill-selection",
		strconv.FormatUint(req.Agent.ID, 10),
		strconv.FormatUint(req.Agent.SkillPackID, 10),
		strconv.FormatUint(req.SourceTargetID, 10),
		req.Power.Key,
		strconv.FormatUint(req.Agent.SelectorPowerID, 10),
		jsonText(collected.SkillCatalog.MetadataKeys()),
		jsonText(req.Input),
		jsonText(selectionHistory(collected.ContextNotes, collected.Baseline)),
		baselineNoteText(collected.Baseline),
	}, "\n")))
	return hex.EncodeToString(hash[:])
}

func agentIdentity(agent agentmodel.Agent) string {
	if key := strings.TrimSpace(agent.Key); key != "" {
		return key
	}
	if agent.ID > 0 {
		return fmt.Sprintf("%d", agent.ID)
	}
	return strings.TrimSpace(agent.Name)
}
