package agent

import (
	"context"
	"fmt"
	"sort"
	"strconv"
	"strings"
	"time"

	agentmodel "my/package/bot/model/agent"
	energonmodel "my/package/bot/model/energon"
	agentsetting "my/package/bot/service/agent/setting"
	agentskill "my/package/bot/service/agent/skill"
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
		row = model.Find(ctx, map[string]any{"name": identity})
	}
	if row == nil {
		return agentmodel.Agent{}, fmt.Errorf("未找到智能体: %s", identity)
	}
	if row.Status != 1 {
		return agentmodel.Agent{}, fmt.Errorf("智能体已停用: %s", row.Name)
	}
	if row.LLMPowerID == 0 {
		return agentmodel.Agent{}, fmt.Errorf("智能体未配置 LLM 能力")
	}
	return *row, nil
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

func (Repo) ListActivePublicSettings(ctx context.Context, packID uint64) []agentmodel.Setting {
	if packID == 0 {
		packID = agentmodel.DefaultSettingPackID
	}
	items := agentmodel.NewSettingPackItemModel().Select(ctx, map[string]any{
		"pack_id": packID,
		"status":  1,
	})
	if len(items) == 0 {
		return nil
	}

	settingIDs := make([]any, 0, len(items))
	for _, item := range items {
		if item == nil || item.SettingID == 0 {
			continue
		}
		settingIDs = append(settingIDs, item.SettingID)
	}
	if len(settingIDs) == 0 {
		return nil
	}

	settingModel := agentmodel.NewSettingModel()
	settingRows := settingModel.Select(ctx, map[string]any{
		"id":     settingIDs,
		"status": 1,
	})
	settingByID := make(map[uint64]agentmodel.Setting, len(settingRows))
	for _, row := range settingRows {
		if row != nil {
			settingByID[row.ID] = *row
		}
	}

	result := make([]agentmodel.Setting, 0, len(settingByID))
	for _, item := range items {
		if item == nil || item.SettingID == 0 {
			continue
		}
		if setting, ok := settingByID[item.SettingID]; ok {
			result = append(result, setting)
		}
	}
	return result
}

func (Repo) ListActiveAgentSettings(ctx context.Context, agentID uint64) []agentmodel.AgentSetting {
	return listAgentSettings(ctx, agentID, true)
}

func listAgentSettings(ctx context.Context, agentID uint64, activeOnly bool) []agentmodel.AgentSetting {
	if agentID == 0 {
		return nil
	}
	filter := map[string]any{
		"agent_id": agentID,
	}
	if activeOnly {
		filter["status"] = 1
	}
	rows := agentmodel.NewAgentSettingModel().Select(ctx, filter)
	result := make([]agentmodel.AgentSetting, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	sort.SliceStable(result, func(i, j int) bool {
		return agentsetting.LessAgentSettingOrder(result[i].Type, result[i].ID, result[j].Type, result[j].ID)
	})
	return result
}

func (Repo) ListActiveAgentKnowledge(ctx context.Context, agentID uint64) []agentmodel.AgentKnowledge {
	if agentID == 0 {
		return nil
	}
	rows := agentmodel.NewAgentKnowledgeModel().Select(ctx, map[string]any{
		"agent_id":  agentID,
		"status":    1,
		"load_mode": "always",
	})
	result := make([]agentmodel.AgentKnowledge, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (Repo) ListActiveSkillPackEntries(ctx context.Context, packID uint64) []agentskill.Entry {
	if packID == 0 {
		packID = agentmodel.DefaultSkillPackID
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
			Triggers:    agentskill.ManifestTriggers(skill.Manifest),
			InstallPath: strings.TrimSpace(skill.InstallPath),
			EntryFile:   strings.TrimSpace(skill.EntryFile),
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

func (Repo) FindRuntimeConfig(ctx context.Context) agentmodel.RuntimeConfig {
	row := agentmodel.NewRuntimeConfigModel().Find(ctx, map[string]any{
		"id": agentmodel.DefaultRuntimeConfigID,
	})
	if row != nil {
		return *row
	}
	return agentmodel.RuntimeConfig{
		ID:                          agentmodel.DefaultRuntimeConfigID,
		DefaultMaxAutoSteps:         agentmodel.DefaultRuntimeMaxAutoSteps,
		HardMaxAutoSteps:            agentmodel.DefaultRuntimeHardMaxAutoSteps,
		SkillMetadataMaxSkills:      agentmodel.DefaultRuntimeSkillMetadataMaxSkills,
		SkillMetadataFieldMaxLength: agentmodel.DefaultRuntimeSkillMetadataFieldMaxLength,
		SkillFileMaxBytes:           agentmodel.DefaultRuntimeSkillFileMaxBytes,
		SkillLoadedContentMaxLength: agentmodel.DefaultRuntimeSkillLoadedContentMaxLength,
	}
}

func (repo Repo) ResolvePowerKey(ctx context.Context, identity string) (string, error) {
	identity = strings.TrimSpace(identity)
	if identity == "" {
		return "", fmt.Errorf("能力不能为空")
	}

	powers := repo.ListActivePowers(ctx)
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
