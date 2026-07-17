package workbench

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/shemic/dever/orm"

	agentmodel "github.com/dever-package/bot/model/agent"
	assetmodel "github.com/dever-package/bot/model/asset"
	workspacemodel "github.com/dever-package/bot/model/workspace"
	runtimechat "github.com/dever-package/bot/service/agent/runtime/chat"
	assetservice "github.com/dever-package/bot/service/asset"
	bodyservice "github.com/dever-package/bot/service/body"
	energoninput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	teamservice "github.com/dever-package/bot/service/team"
	frontstream "github.com/dever-package/front/service/stream"
	userservice "github.com/dever-package/user/service"
)

type Service struct {
	asset assetservice.Service
	body  bodyservice.Service
	team  teamservice.Service
}

var teamWorkspaceCreateMu sync.Mutex

type PowerRunRequest struct {
	TeamID         uint64
	TeamPowerID    uint64
	SourceTargetID uint64
	TargetAssetID  uint64
	Input          map[string]any
	Params         map[string]any
}

type SavePowerAssetRequest struct {
	TeamID      uint64
	TeamPowerID uint64
	RequestID   string
	Name        string
	TargetAsset uint64
}

type SaveDialogueAssetRequest struct {
	TeamID      uint64
	RoleID      uint64
	MessageID   uint64
	Name        string
	TargetAsset uint64
}

type ChatRoleBinding struct {
	teamservice.WorkbenchRoleBinding
	BodyID     uint64
	ContextKey string
}

func NewService() Service {
	return Service{
		asset: assetservice.NewService(),
		body:  bodyservice.NewService(),
		team:  teamservice.NewService(),
	}
}

func (s Service) Catalog(ctx context.Context, teamID uint64) (map[string]any, error) {
	payload, err := s.team.WorkbenchCatalog(ctx, teamID)
	if err != nil {
		return nil, err
	}
	selectedTeamID := nestedUint64(payload["team"], "id")
	if selectedTeamID == 0 {
		payload["workspace"] = map[string]any{}
		return payload, nil
	}
	workspace, err := s.ensureWorkspace(ctx, selectedTeamID, nestedText(payload["team"], "name"))
	if err != nil {
		return nil, err
	}
	payload["workspace"] = workspacePayload(*workspace)
	return payload, nil
}

func (s Service) PowerForm(ctx context.Context, teamID uint64, teamPowerID uint64, targetID uint64) (map[string]any, error) {
	if _, err := userservice.RequireActor(ctx); err != nil {
		return nil, err
	}
	return s.team.WorkbenchPowerForm(ctx, teamID, teamPowerID, targetID)
}

func (s Service) StartPower(ctx context.Context, request PowerRunRequest) (map[string]any, error) {
	binding, err := s.team.ResolveWorkbenchPower(ctx, request.TeamID, request.TeamPowerID)
	if err != nil {
		return nil, err
	}
	workspace, err := s.ensureWorkspace(ctx, binding.TeamID, binding.TeamName)
	if err != nil {
		return nil, err
	}
	if request.TargetAssetID > 0 {
		if _, err = s.asset.RequireContinuationTarget(
			ctx,
			binding.TeamID,
			request.TargetAssetID,
			assetmodel.SourceTool,
			binding.TeamPowerID,
		); err != nil {
			return nil, err
		}
		request.Input = cloneMap(request.Input)
		request.Input["_target_asset_id"] = request.TargetAssetID
	}
	resolvedParams, err := s.resolvePowerAssetReferences(
		ctx,
		binding.TeamID,
		binding.TeamPowerID,
		request.SourceTargetID,
		request.Params,
	)
	if err != nil {
		return nil, err
	}
	request.Params = resolvedParams
	requestID := uuid.NewString()
	created := make(chan uint64, 1)
	finished := make(chan error, 1)
	runContext := context.WithoutCancel(ctx)
	go func() {
		_, runErr := s.team.RunCanvasPower(runContext, teamservice.CanvasPowerRunRequest{
			BodyID:         workspace.BodyID,
			TeamID:         binding.TeamID,
			ReleaseID:      binding.ReleaseID,
			RequestID:      requestID,
			TeamPowerID:    binding.TeamPowerID,
			PowerID:        binding.Power.ID,
			PowerKey:       binding.Power.Key,
			NodeName:       binding.Name,
			SourceTargetID: request.SourceTargetID,
			Input:          cloneMap(request.Input),
			Params:         cloneMap(request.Params),
			PersistResult:  false,
			OnRunCreated: func(runID uint64, _ string) {
				select {
				case created <- runID:
				default:
				}
			},
		})
		finished <- runErr
	}()

	select {
	case runID := <-created:
		return botprotocol.BuildStreamResponse(requestID, botprotocol.Output{
			"event":      "start",
			"text":       "能力已开始运行",
			"run_id":     runID,
			"cancelable": true,
		}).Payload(), nil
	case runErr := <-finished:
		if runErr == nil {
			runErr = fmt.Errorf("能力运行未创建运行记录")
		}
		return nil, runErr
	case <-time.After(5 * time.Second):
		return nil, fmt.Errorf("启动能力运行超时")
	}
}

func (s Service) resolvePowerAssetReferences(
	ctx context.Context,
	teamID uint64,
	teamPowerID uint64,
	targetID uint64,
	input map[string]any,
) (map[string]any, error) {
	result := cloneMap(input)
	contents := recordValue(result["_reference_contents"])
	delete(result, "_reference_contents")
	if len(contents) == 0 {
		return result, nil
	}
	form, err := s.team.WorkbenchPowerForm(ctx, teamID, teamPowerID, targetID)
	if err != nil {
		return nil, err
	}
	params, ok := form["params"].([]energoninput.PowerParam)
	if !ok {
		return nil, fmt.Errorf("能力参数配置无效")
	}
	allReferences := make([]any, 0)
	for paramKey, rawContent := range contents {
		allowedKinds, exists := energoninput.PromptParamAssetKinds(params, paramKey)
		if !exists {
			return nil, fmt.Errorf("参数“%s”不是可引用资产的提示词参数", paramKey)
		}
		content := recordValue(rawContent)
		if nestedUint64(content, "version") != 1 {
			return nil, fmt.Errorf("参数“%s”的资产引用协议无效", paramKey)
		}
		references := make([]any, 0)
		for _, rawPart := range listValue(content["parts"]) {
			part := recordValue(rawPart)
			if nestedText(part, "type") != "reference" {
				continue
			}
			if nestedText(part, "ref_type") != "asset" {
				return nil, fmt.Errorf("工具提示词只支持引用已保存资产")
			}
			if trigger := nestedText(part, "ref_trigger"); trigger != "" && trigger != "@" {
				return nil, fmt.Errorf("工具资产引用必须使用 @ 触发符")
			}
			assetID := nestedUint64(part, "ref_id")
			versionID := nestedUint64(part, "ref_version_id")
			resolved, err := s.asset.RequireCurrentReference(ctx, teamID, assetID, versionID)
			if err != nil {
				return nil, err
			}
			if _, allowed := allowedKinds[resolved.Asset.Kind]; !allowed {
				return nil, fmt.Errorf("参数“%s”不支持引用%s资产", paramKey, resolved.Asset.Kind)
			}
			item := map[string]any{
				"asset_id":   resolved.Asset.ID,
				"version_id": resolved.Version.ID,
				"name":       resolved.Asset.Name,
				"kind":       resolved.Asset.Kind,
				"content":    resolved.Content,
			}
			references = append(references, item)
			allReferences = append(allReferences, item)
		}
		if len(references) == 0 {
			continue
		}
		raw, _ := json.Marshal(references)
		prompt := strings.TrimSpace(nestedText(result, paramKey))
		result[paramKey] = strings.TrimSpace(prompt + "\n\n引用资产：\n" + string(raw))
	}
	if len(allReferences) > 0 {
		result["_asset_references"] = allReferences
	}
	return result, nil
}

func (s Service) ReadPowerStream(ctx context.Context, teamID uint64, requestID string, lastID string, count int64, block time.Duration) ([]frontstream.Entry, error) {
	workspace, err := s.requireWorkspace(ctx, teamID)
	if err != nil {
		return nil, err
	}
	return s.team.ReadBodyStream(ctx, workspace.BodyID, requestID, lastID, count, block)
}

func (s Service) StopPower(ctx context.Context, teamID uint64, runID uint64, requestID string) (map[string]any, error) {
	workspace, err := s.requireWorkspace(ctx, teamID)
	if err != nil {
		return nil, err
	}
	return s.team.StopBodyRun(ctx, workspace.BodyID, runID, requestID)
}

func (s Service) PowerStatus(ctx context.Context, teamID uint64, runID uint64, requestID string) (map[string]any, error) {
	workspace, err := s.requireWorkspace(ctx, teamID)
	if err != nil {
		return nil, err
	}
	return s.team.BodyRunStatus(ctx, workspace.BodyID, runID, requestID)
}

func (s Service) SavePowerAsset(ctx context.Context, request SavePowerAssetRequest) (map[string]any, error) {
	binding, err := s.team.ResolveWorkbenchPower(ctx, request.TeamID, request.TeamPowerID)
	if err != nil {
		return nil, err
	}
	workspace, err := s.requireWorkspace(ctx, binding.TeamID)
	if err != nil {
		return nil, err
	}
	requestID := strings.TrimSpace(request.RequestID)
	status, err := s.team.BodyRunStatus(ctx, workspace.BodyID, 0, requestID)
	if err != nil {
		return nil, err
	}
	run, _ := status["run"].(map[string]any)
	if nestedText(run, "status") != "success" {
		return nil, fmt.Errorf("只有成功的工具结果可以保存")
	}
	if nestedUint64(run, "team_id") != binding.TeamID || nestedUint64(run, "body_id") != workspace.BodyID {
		return nil, fmt.Errorf("工具运行不属于当前团队工作区")
	}
	runInput, _ := run["input"].(map[string]any)
	if nestedUint64(runInput, "_team_power_id") != binding.TeamPowerID {
		return nil, fmt.Errorf("工具运行与当前能力不匹配")
	}
	if request.TargetAsset > 0 && nestedUint64(runInput, "_target_asset_id") != request.TargetAsset {
		return nil, fmt.Errorf("请先从目标素材发起一次新的工具运行")
	}
	output, _ := run["output"].(map[string]any)
	if len(output) == 0 {
		return nil, fmt.Errorf("工具运行没有可保存结果")
	}
	source := map[string]any{
		"team_power_id": binding.TeamPowerID,
		"power_id":      binding.Power.ID,
		"power_key":     binding.Power.Key,
	}
	name := strings.TrimSpace(request.Name)
	if name == "" && request.TargetAsset > 0 {
		if target := s.asset.Find(ctx, request.TargetAsset); target != nil {
			name = target.Name
			source["parent_asset_id"] = target.ID
			source["parent_version_id"] = target.VersionID
		}
	}
	if name == "" {
		name = binding.Name + " 结果"
	}
	nodeKey := fmt.Sprintf("tool:%d:%s", binding.TeamPowerID, requestID)
	asset, version, err := s.asset.SaveVersion(ctx, assetservice.SaveVersionRequest{
		AssetID:    request.TargetAsset,
		BodyID:     workspace.BodyID,
		TeamID:     binding.TeamID,
		RunID:      nestedUint64(run, "id"),
		ReleaseID:  binding.ReleaseID,
		RequestID:  requestID,
		NodeKey:    nodeKey,
		SourceType: assetmodel.SourceTool,
		SourceID:   binding.TeamPowerID,
		SourceName: binding.Name,
		Source:     source,
		Name:       name,
		Kind:       binding.Power.Kind,
		Role:       assetmodel.RoleMaterial,
		Content:    output,
	})
	if err != nil {
		return nil, err
	}
	return map[string]any{"asset": s.asset.AssetDetailMap(ctx, *asset, version)}, nil
}

func (s Service) SaveDialogueAsset(ctx context.Context, request SaveDialogueAssetRequest) (map[string]any, error) {
	binding, err := s.ResolveRole(ctx, request.TeamID, request.RoleID)
	if err != nil {
		return nil, err
	}
	message, err := runtimechat.NewService().RequireCompletedAssistantMessage(
		ctx, request.MessageID, binding.AgentKey, binding.ContextKey,
	)
	if err != nil {
		return nil, err
	}
	if request.TargetAsset > 0 {
		run := agentmodel.NewRunModel().Find(ctx, map[string]any{"request_id": message.RequestID})
		if run == nil || nestedUint64(recordValue(run.Input), "_target_asset_id") != request.TargetAsset {
			return nil, fmt.Errorf("请先从目标素材发起一条新的对话回复")
		}
	}
	content := map[string]any{
		"text":    message.Text,
		"content": message.Content,
		"output":  message.Output,
	}
	if message.Document != nil {
		content["document"] = message.Document
	}
	source := map[string]any{
		"role_id":    binding.RoleID,
		"agent_id":   binding.AgentID,
		"agent_key":  binding.AgentKey,
		"session_id": message.SessionID,
		"message_id": message.ID,
	}
	name := strings.TrimSpace(request.Name)
	if name == "" && request.TargetAsset > 0 {
		if target := s.asset.Find(ctx, request.TargetAsset); target != nil {
			name = target.Name
			source["parent_asset_id"] = target.ID
			source["parent_version_id"] = target.VersionID
		}
	}
	if name == "" {
		name = binding.Name + " 回复"
	}
	requestID := message.RequestID
	if requestID == "" {
		requestID = fmt.Sprintf("dialogue-message-%d", message.ID)
	}
	asset, version, err := s.asset.SaveVersion(ctx, assetservice.SaveVersionRequest{
		AssetID:    request.TargetAsset,
		BodyID:     binding.BodyID,
		TeamID:     binding.TeamID,
		ReleaseID:  binding.ReleaseID,
		RequestID:  requestID,
		NodeKey:    fmt.Sprintf("dialogue:%d:message:%d", binding.RoleID, message.ID),
		SourceType: assetmodel.SourceDialogue,
		SourceID:   binding.RoleID,
		SourceName: binding.Name,
		Source:     source,
		Name:       name,
		Kind:       dialogueAssetKind(message),
		Role:       assetmodel.RoleMaterial,
		Content:    content,
	})
	if err != nil {
		return nil, err
	}
	return map[string]any{"asset": s.asset.AssetDetailMap(ctx, *asset, version)}, nil
}

func (s Service) RequireDialogueContinuation(
	ctx context.Context,
	binding ChatRoleBinding,
	targetAssetID uint64,
) error {
	if targetAssetID == 0 {
		return nil
	}
	_, err := s.asset.RequireContinuationTarget(
		ctx,
		binding.TeamID,
		targetAssetID,
		assetmodel.SourceDialogue,
		binding.RoleID,
	)
	return err
}

func dialogueAssetKind(message runtimechat.CompletedAssistantMessage) string {
	if message.Document != nil {
		return assetmodel.KindRichText
	}
	kinds := map[string]bool{}
	if artifacts, ok := message.Output["artifacts"].([]any); ok {
		for _, value := range artifacts {
			artifact, _ := value.(map[string]any)
			if kind := dialogueMaterialKind(nestedText(artifact, "kind")); kind != "" {
				kinds[kind] = true
			}
		}
	}
	if len(kinds) == 1 {
		for kind := range kinds {
			return kind
		}
	}
	if len(kinds) > 1 {
		return assetmodel.KindRichText
	}
	for kind, keys := range map[string][]string{
		assetmodel.KindImage: {"image", "images"},
		assetmodel.KindAudio: {"audio", "audios"},
		assetmodel.KindVideo: {"video", "videos"},
		assetmodel.KindFile:  {"file", "files"},
	} {
		for _, key := range keys {
			if value, exists := message.Output[key]; exists && value != nil {
				return kind
			}
		}
	}
	return assetmodel.KindText
}

func dialogueMaterialKind(kind string) string {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case assetmodel.KindImage:
		return assetmodel.KindImage
	case assetmodel.KindAudio:
		return assetmodel.KindAudio
	case assetmodel.KindVideo:
		return assetmodel.KindVideo
	case assetmodel.KindFile:
		return assetmodel.KindFile
	default:
		return ""
	}
}

func (s Service) Assets(ctx context.Context, req assetservice.QueryRequest) (map[string]any, error) {
	return s.asset.Query(ctx, req)
}

func (s Service) AssetFilters(ctx context.Context, teamID uint64) (map[string]any, error) {
	return s.asset.Filters(ctx, teamID)
}

func (s Service) AssetDetail(ctx context.Context, teamID uint64, assetID uint64) (map[string]any, error) {
	return s.asset.TeamDetail(ctx, teamID, assetID)
}

func (s Service) AssetVersions(ctx context.Context, teamID uint64, assetID uint64, page int, pageSize int) (map[string]any, error) {
	return s.asset.TeamVersionPage(ctx, teamID, assetID, assetservice.VersionPageRequest{
		Page:     page,
		PageSize: pageSize,
	})
}

func (s Service) AssetVersion(ctx context.Context, teamID uint64, assetID uint64, versionID uint64) (map[string]any, error) {
	return s.asset.TeamVersionDetail(ctx, teamID, assetID, versionID)
}

func (s Service) SetAssetCurrentVersion(ctx context.Context, teamID uint64, assetID uint64, versionID uint64) (map[string]any, error) {
	return s.asset.SetTeamCurrentVersion(ctx, teamID, assetID, versionID)
}

func (s Service) ResolveRole(ctx context.Context, teamID uint64, roleID uint64) (ChatRoleBinding, error) {
	role, err := s.team.ResolveWorkbenchRole(ctx, teamID, roleID)
	if err != nil {
		return ChatRoleBinding{}, err
	}
	workspace, err := s.ensureWorkspace(ctx, role.TeamID, role.TeamName)
	if err != nil {
		return ChatRoleBinding{}, err
	}
	return ChatRoleBinding{
		WorkbenchRoleBinding: role,
		BodyID:               workspace.BodyID,
		ContextKey:           RoleContextKey(role.TeamID, role.RoleID),
	}, nil
}

func RoleContextKey(teamID uint64, roleID uint64) string {
	return fmt.Sprintf("body-team:%d:role:%d", teamID, roleID)
}

func (s Service) ensureWorkspace(ctx context.Context, teamID uint64, teamName string) (*workspacemodel.TeamWorkspace, error) {
	actor, err := userservice.RequireActor(ctx)
	if err != nil {
		return nil, err
	}
	if teamID == 0 {
		return nil, fmt.Errorf("团队不能为空")
	}
	model := workspacemodel.NewTeamWorkspaceModel()
	if row := model.Find(ctx, map[string]any{
		"user_id": actor.UserID,
		"team_id": teamID,
		"status":  workspacemodel.TeamWorkspaceStatusEnabled,
	}); row != nil {
		return row, nil
	}
	teamWorkspaceCreateMu.Lock()
	defer teamWorkspaceCreateMu.Unlock()
	var workspaceID uint64
	err = orm.Transaction(ctx, func(tx context.Context) error {
		if row := model.Find(tx, map[string]any{"user_id": actor.UserID, "team_id": teamID}); row != nil {
			workspaceID = row.ID
			if row.Status != workspacemodel.TeamWorkspaceStatusEnabled {
				model.Update(tx, map[string]any{"id": row.ID}, map[string]any{
					"status":     workspacemodel.TeamWorkspaceStatusEnabled,
					"updated_at": time.Now(),
				})
			}
			return nil
		}
		bodyID, createErr := s.body.CreateTeamWorkspaceBody(tx, strings.TrimSpace(teamName)+" 工作区")
		if createErr != nil {
			return createErr
		}
		now := time.Now()
		workspaceID = uint64(model.Insert(tx, map[string]any{
			"user_id":    actor.UserID,
			"team_id":    teamID,
			"body_id":    bodyID,
			"status":     workspacemodel.TeamWorkspaceStatusEnabled,
			"created_at": now,
			"updated_at": now,
		}))
		if workspaceID == 0 {
			return fmt.Errorf("创建用户团队工作区失败")
		}
		return nil
	})
	if err != nil {
		return nil, err
	}
	row := model.Find(ctx, map[string]any{"id": workspaceID, "user_id": actor.UserID})
	if row == nil {
		return nil, fmt.Errorf("读取用户团队工作区失败")
	}
	return row, nil
}

func (s Service) requireWorkspace(ctx context.Context, teamID uint64) (*workspacemodel.TeamWorkspace, error) {
	actor, err := userservice.RequireActor(ctx)
	if err != nil {
		return nil, err
	}
	if teamID == 0 {
		return nil, fmt.Errorf("团队不能为空")
	}
	row := workspacemodel.NewTeamWorkspaceModel().Find(ctx, map[string]any{
		"user_id": actor.UserID,
		"team_id": teamID,
		"status":  workspacemodel.TeamWorkspaceStatusEnabled,
	})
	if row == nil {
		return nil, fmt.Errorf("团队工作区不存在")
	}
	return row, nil
}

func workspacePayload(row workspacemodel.TeamWorkspace) map[string]any {
	return map[string]any{
		"id": row.ID, "team_id": row.TeamID, "body_id": row.BodyID,
	}
}

func nestedUint64(value any, key string) uint64 {
	row, _ := value.(map[string]any)
	switch current := row[key].(type) {
	case uint64:
		return current
	case int:
		return uint64(current)
	case int64:
		return uint64(current)
	case float64:
		return uint64(current)
	}
	return 0
}

func nestedText(value any, key string) string {
	row, _ := value.(map[string]any)
	if row[key] == nil {
		return ""
	}
	return strings.TrimSpace(fmt.Sprint(row[key]))
}

func recordValue(value any) map[string]any {
	if row, ok := value.(map[string]any); ok {
		return row
	}
	if raw, ok := value.(string); ok && strings.TrimSpace(raw) != "" {
		var row map[string]any
		if json.Unmarshal([]byte(raw), &row) == nil {
			return row
		}
	}
	return map[string]any{}
}

func listValue(value any) []any {
	rows, _ := value.([]any)
	return rows
}

func cloneMap(value map[string]any) map[string]any {
	result := make(map[string]any, len(value))
	for key, item := range value {
		result[key] = item
	}
	return result
}
