package agent

import (
	"context"
	"fmt"
	"strconv"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	agentruntime "github.com/dever-package/bot/service/agent/runtime"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

type Repo struct{}

type stepRecord struct {
	RunID     uint64
	RequestID string
	Seq       int
	Type      string
	Title     string
	Content   string
	Payload   string
	Status    string
}

const (
	runStatusSelectFields = "main.id,main.request_id,main.agent_id,main.output,main.error,main.status,main.step_count,main.latency,main.started_at,main.finished_at,main.created_at"
	runOutputSelectFields = "main.id,main.request_id,main.output"
)

func NewRepo() Repo {
	return Repo{}
}

func (Repo) FindAgent(ctx context.Context, identity string) (agentmodel.Agent, error) {
	identity = strings.TrimSpace(identity)
	if identity == "" {
		return agentmodel.Agent{}, fmt.Errorf("智能体不能为空")
	}

	model := agentmodel.NewAgentModel()
	var row *agentmodel.Agent
	if id, err := strconv.ParseUint(identity, 10, 64); err == nil && id > 0 {
		row = model.Find(ctx, map[string]any{"id": id})
	}
	if row == nil {
		row = model.Find(ctx, map[string]any{"key": identity})
	}
	if row == nil {
		if builtinID := builtinAgentID(identity); builtinID > 0 {
			row = model.Find(ctx, map[string]any{"id": builtinID})
		}
	}
	if row == nil {
		row = model.Find(ctx, map[string]any{"name": identity})
	}
	if row == nil {
		return agentmodel.Agent{}, fmt.Errorf("未找到智能体: %s", identity)
	}
	if strings.TrimSpace(row.Prompt) == "" {
		row.Prompt = agentmodel.BuiltinAgentPrompt(row.Key)
	}
	if row.Status != 1 {
		return agentmodel.Agent{}, fmt.Errorf("智能体已停用: %s", row.Name)
	}
	if row.LLMPowerID == 0 {
		return agentmodel.Agent{}, fmt.Errorf("智能体未配置 LLM 能力")
	}
	return *row, nil
}

func builtinAgentID(identity string) uint64 {
	switch strings.TrimSpace(identity) {
	case agentmodel.FrontAssistantAgentKey:
		return agentmodel.FrontAssistantAgentID
	case agentmodel.SkillInstallerAgentKey:
		return agentmodel.SkillInstallerAgentID
	case agentmodel.SkillCreatorAgentKey:
		return agentmodel.SkillCreatorAgentID
	default:
		return 0
	}
}

func (Repo) FindPower(ctx context.Context, id uint64) (energonmodel.Power, error) {
	if id == 0 {
		return energonmodel.Power{}, fmt.Errorf("LLM 能力不能为空")
	}
	row := energonmodel.NewPowerModel().Find(ctx, map[string]any{"id": id})
	if row == nil {
		return energonmodel.Power{}, fmt.Errorf("LLM 能力不存在")
	}
	if row.Status != 1 {
		return energonmodel.Power{}, fmt.Errorf("LLM 能力已停用: %s", row.Name)
	}
	if strings.ToLower(strings.TrimSpace(row.Kind)) != "text" {
		return energonmodel.Power{}, fmt.Errorf("LLM 能力必须选择文本类型能力: %s", row.Name)
	}
	return *row, nil
}

func (Repo) FindAgentCatePrompt(ctx context.Context, cateID uint64) string {
	if cateID == 0 {
		return ""
	}
	row := agentmodel.NewAgentCateModel().Find(ctx, map[string]any{"id": cateID})
	if row == nil {
		return ""
	}
	return strings.TrimSpace(row.Prompt)
}

func (Repo) ListActiveSkillPackEntries(ctx context.Context, packID uint64) []agentskill.Entry {
	if packID == 0 {
		return nil
	}
	items := agentmodel.NewSkillPackItemModel().Select(ctx, map[string]any{
		"pack_id": packID,
		"status":  1,
	})
	if len(items) == 0 {
		return nil
	}

	skillIDs := make([]any, 0, len(items))
	for _, item := range items {
		if item == nil || item.SkillID == 0 {
			continue
		}
		skillIDs = append(skillIDs, item.SkillID)
	}
	if len(skillIDs) == 0 {
		return nil
	}

	skillRows := agentmodel.NewSkillModel().Select(ctx, map[string]any{
		"id":     skillIDs,
		"status": 1,
	})
	skillByID := make(map[uint64]agentmodel.Skill, len(skillRows))
	for _, row := range skillRows {
		if row != nil {
			skillByID[row.ID] = *row
		}
	}

	result := make([]agentskill.Entry, 0, len(skillByID))
	for _, item := range items {
		if item == nil || item.SkillID == 0 {
			continue
		}
		skill, ok := skillByID[item.SkillID]
		if !ok {
			continue
		}
		result = append(result, agentskill.Entry{
			ID:          skill.ID,
			Key:         strings.TrimSpace(skill.Key),
			Name:        strings.TrimSpace(skill.Name),
			Description: strings.TrimSpace(skill.Description),
			SourceType:  agentmodel.NormalizeSkillSourceType(skill.SourceType, skill.SourceURL, skill.InstallInput),
			Triggers:    agentskill.ManifestTriggers(skill.Manifest),
			Domains:     agentskill.ManifestDomains(skill.Manifest),
			Targets:     agentskill.ManifestTargets(skill.Manifest),
			InstallPath: strings.TrimSpace(skill.InstallPath),
			EntryFile:   strings.TrimSpace(skill.EntryFile),
			Manifest:    strings.TrimSpace(skill.Manifest),
		})
	}
	return result
}

func (Repo) ListActivePowers(ctx context.Context) []energonmodel.Power {
	rows := energonmodel.NewPowerModel().Select(ctx, map[string]any{"status": 1})
	result := make([]energonmodel.Power, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (repo Repo) ListActiveCallablePowers(ctx context.Context, excludedID uint64) []energonmodel.Power {
	powers := repo.ListActivePowers(ctx)
	if excludedID == 0 {
		return powers
	}

	result := make([]energonmodel.Power, 0, len(powers))
	for _, power := range powers {
		if power.ID != excludedID {
			result = append(result, power)
		}
	}
	return result
}

func (Repo) FindRuntimeConfig(ctx context.Context) agentmodel.RuntimeConfig {
	row := agentmodel.NewRuntimeConfigModel().Find(ctx, map[string]any{
		"id": agentmodel.DefaultRuntimeConfigID,
	})
	if row != nil {
		return agentruntime.WithDefaults(*row)
	}
	return agentmodel.DefaultRuntimeConfig()
}

func (repo Repo) ResolveCallablePowerKey(ctx context.Context, identity string, excludedID uint64) (string, error) {
	return repo.resolvePowerKey(ctx, identity, excludedID)
}

func (repo Repo) resolvePowerKey(ctx context.Context, identity string, excludedID uint64) (string, error) {
	identity = strings.TrimSpace(identity)
	if identity == "" {
		return "", fmt.Errorf("能力不能为空")
	}

	powers := repo.ListActiveCallablePowers(ctx, excludedID)
	for _, row := range powers {
		if row.Key == identity || row.Name == identity {
			return row.Key, nil
		}
	}
	for _, row := range powers {
		if strings.EqualFold(row.Kind, identity) {
			return row.Key, nil
		}
	}
	return "", fmt.Errorf("未找到可用能力: %s", identity)
}

func (Repo) InsertRun(ctx context.Context, record map[string]any) (id uint64) {
	defer func() {
		if recover() != nil {
			id = 0
		}
	}()
	return uint64(agentmodel.NewRunModel().Insert(ctx, record))
}

func (Repo) UpdateRun(ctx context.Context, id uint64, record map[string]any) {
	if id == 0 || len(record) == 0 {
		return
	}
	defer func() {
		_ = recover()
	}()
	agentmodel.NewRunModel().Update(ctx, map[string]any{"id": id}, record)
}

func (Repo) UpdateRunByRequestID(ctx context.Context, requestID string, record map[string]any) {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" || len(record) == 0 {
		return
	}
	defer func() {
		_ = recover()
	}()
	agentmodel.NewRunModel().Update(ctx, map[string]any{"request_id": requestID}, record)
}

func (Repo) FindRunByRequestID(ctx context.Context, requestID string) (agentmodel.Run, error) {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return agentmodel.Run{}, fmt.Errorf("request_id 不能为空")
	}
	row := agentmodel.NewRunModel().Find(ctx, map[string]any{"request_id": requestID})
	if row == nil {
		return agentmodel.Run{}, fmt.Errorf("智能体运行不存在")
	}
	return *row, nil
}

func (Repo) FindRunStatusByRequestID(ctx context.Context, requestID string) (agentmodel.Run, error) {
	return findRunByRequestID(ctx, requestID, runStatusSelectFields)
}

func (Repo) FindRunOutputByRequestID(ctx context.Context, requestID string) (agentmodel.Run, error) {
	return findRunByRequestID(ctx, requestID, runOutputSelectFields)
}

func findRunByRequestID(ctx context.Context, requestID string, field string) (agentmodel.Run, error) {
	requestID = strings.TrimSpace(requestID)
	if requestID == "" {
		return agentmodel.Run{}, fmt.Errorf("request_id 不能为空")
	}
	row := agentmodel.NewRunModel().Find(ctx, map[string]any{"request_id": requestID}, map[string]any{
		"field": field,
	})
	if row == nil {
		return agentmodel.Run{}, fmt.Errorf("智能体运行不存在")
	}
	return *row, nil
}

func (Repo) ListRuns(ctx context.Context, ids []uint64) []agentmodel.Run {
	values := uint64FilterValues(ids)
	if len(values) == 0 {
		return []agentmodel.Run{}
	}
	rows := agentmodel.NewRunModel().Select(ctx, map[string]any{"id": values})
	result := make([]agentmodel.Run, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (Repo) ListStepsByRun(ctx context.Context, runIDs []uint64) map[uint64][]agentmodel.Step {
	values := uint64FilterValues(runIDs)
	result := map[uint64][]agentmodel.Step{}
	if len(values) == 0 {
		return result
	}
	rows := agentmodel.NewStepModel().Select(ctx, map[string]any{"run_id": values})
	for _, row := range rows {
		if row == nil {
			continue
		}
		result[row.RunID] = append(result[row.RunID], *row)
	}
	return result
}

func (Repo) InsertStep(ctx context.Context, record stepRecord) {
	defer func() {
		_ = recover()
	}()
	agentmodel.NewStepModel().Insert(ctx, map[string]any{
		"run_id":     record.RunID,
		"request_id": record.RequestID,
		"seq":        record.Seq,
		"type":       record.Type,
		"title":      record.Title,
		"content":    record.Content,
		"payload":    record.Payload,
		"status":     record.Status,
		"created_at": time.Now(),
	})
}

func uint64FilterValues(ids []uint64) []any {
	seen := map[uint64]struct{}{}
	values := make([]any, 0, len(ids))
	for _, id := range ids {
		if id == 0 {
			continue
		}
		if _, ok := seen[id]; ok {
			continue
		}
		seen[id] = struct{}{}
		values = append(values, id)
	}
	return values
}
