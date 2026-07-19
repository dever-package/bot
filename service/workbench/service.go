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
	projectmodel "github.com/dever-package/bot/model/project"
	teammodel "github.com/dever-package/bot/model/team"
	workspacemodel "github.com/dever-package/bot/model/workspace"
	runtimechat "github.com/dever-package/bot/service/agent/runtime/chat"
	assetservice "github.com/dever-package/bot/service/asset"
	bodyservice "github.com/dever-package/bot/service/body"
	energonservice "github.com/dever-package/bot/service/energon"
	energoninput "github.com/dever-package/bot/service/energon/input"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	teamservice "github.com/dever-package/bot/service/team"
	frontstream "github.com/dever-package/front/service/stream"
	uploadrepo "github.com/dever-package/front/service/upload/repository"
	userservice "github.com/dever-package/user/service"
)

type Service struct {
	asset assetservice.Service
	body  bodyservice.Service
	team  teamservice.Service
}

var teamWorkspaceCreateMu sync.Mutex

const (
	powerReplayInputKey   = "_replay_input"
	powerTargetAssetIDKey = "_target_asset_id"
)

type powerContinuationContext struct {
	Reference assetservice.CurrentReference
	RunInput  map[string]any
}

type PowerRunRequest struct {
	TeamID         uint64
	TeamPowerID    uint64
	SourceTargetID uint64
	TargetAssetID  uint64
	ParamsComplete bool
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
	ArtifactID  uint64
	Name        string
	TargetAsset uint64
}

type SaveUploadAssetRequest struct {
	TeamID    uint64
	ProjectID uint64
	File      uploadrepo.UploadFile
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

func (s Service) PowerForm(
	ctx context.Context,
	teamID uint64,
	teamPowerID uint64,
	sourceTargetID uint64,
	targetAssetID uint64,
) (map[string]any, error) {
	if _, err := userservice.RequireActor(ctx); err != nil {
		return nil, err
	}
	var continuation powerContinuationContext
	if targetAssetID > 0 {
		binding, err := s.team.ResolveWorkbenchPower(ctx, teamID, teamPowerID)
		if err != nil {
			return nil, err
		}
		workspace, err := s.requireWorkspace(ctx, binding.TeamID)
		if err != nil {
			return nil, err
		}
		continuation, err = s.resolvePowerContinuation(ctx, *workspace, binding, targetAssetID)
		if err != nil {
			return nil, err
		}
		if sourceTargetID == 0 {
			sourceTargetID = nestedUint64(continuation.RunInput, teamservice.CanvasPowerMetaSourceTargetID)
		}
	}
	form, err := s.team.WorkbenchPowerForm(ctx, teamID, teamPowerID, sourceTargetID)
	if err != nil {
		return nil, err
	}
	if targetAssetID == 0 || len(continuation.RunInput) == 0 {
		return form, nil
	}
	params, ok := form["params"].([]energoninput.PowerParam)
	if !ok {
		return nil, fmt.Errorf("能力参数配置无效")
	}
	form["initial_input"] = powerReplayParamInput(params, continuation.RunInput)
	return form, nil
}

func (s Service) resolvePowerContinuation(
	ctx context.Context,
	workspace workspacemodel.TeamWorkspace,
	binding teamservice.WorkbenchPowerBinding,
	assetID uint64,
) (powerContinuationContext, error) {
	target, err := s.asset.RequireContinuationTarget(
		ctx,
		binding.TeamID,
		assetID,
		assetmodel.SourceTool,
		binding.TeamPowerID,
	)
	if err != nil {
		return powerContinuationContext{}, err
	}
	reference, err := s.asset.RequireCurrentReference(ctx, binding.TeamID, target.ID, target.VersionID)
	if err != nil {
		return powerContinuationContext{}, err
	}
	result := powerContinuationContext{Reference: reference}
	if reference.Version.RunID == 0 {
		return result, nil
	}
	run := teammodel.NewRunModel().Find(ctx, map[string]any{"id": reference.Version.RunID})
	if run == nil {
		return result, nil
	}
	runInput := recordValue(run.Input)
	if run.BodyID != workspace.BodyID ||
		run.TeamID != binding.TeamID ||
		nestedUint64(runInput, teamservice.CanvasPowerMetaTeamPowerID) != binding.TeamPowerID ||
		(strings.TrimSpace(reference.Version.RequestID) != "" &&
			strings.TrimSpace(run.RequestID) != strings.TrimSpace(reference.Version.RequestID)) {
		return powerContinuationContext{}, fmt.Errorf("素材原运行记录与当前工具不匹配")
	}
	result.RunInput = runInput
	if nestedUint64(runInput, teamservice.CanvasPowerMetaSourceTargetID) == 0 {
		if targetID := energonservice.PowerTargetIDByRequestID(ctx, run.RequestID); targetID > 0 {
			runInput[teamservice.CanvasPowerMetaSourceTargetID] = targetID
		}
	}
	return result, nil
}

func attachPreviousPowerOutput(
	params []energoninput.PowerParam,
	input map[string]any,
	previousOutput any,
) map[string]any {
	result := cloneMap(input)
	content, isText := previousOutput.(string)
	if !isText {
		if raw, err := json.Marshal(previousOutput); err == nil {
			content = string(raw)
		}
	}
	content = strings.TrimSpace(content)
	if content == "" {
		return result
	}
	for _, param := range params {
		if !energoninput.IsPromptParamType(param.Type) {
			continue
		}
		key := powerParamInputKey(param)
		if key == "" {
			continue
		}
		prompt := strings.TrimSpace(nestedText(result, key))
		result[key] = strings.TrimSpace(prompt + "\n\n上一版内容：\n" + content)
		return result
	}
	result["previous_output"] = previousOutput
	return result
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
	request.Input = cloneMap(request.Input)
	var continuation powerContinuationContext
	if request.TargetAssetID > 0 {
		continuation, err = s.resolvePowerContinuation(
			ctx, *workspace, binding, request.TargetAssetID,
		)
		if err != nil {
			return nil, err
		}
		request.Input[powerTargetAssetIDKey] = request.TargetAssetID
		if request.SourceTargetID == 0 {
			request.SourceTargetID = nestedUint64(
				continuation.RunInput,
				teamservice.CanvasPowerMetaSourceTargetID,
			)
		}
	}
	form, err := s.team.WorkbenchPowerForm(
		ctx, binding.TeamID, binding.TeamPowerID, request.SourceTargetID,
	)
	if err != nil {
		return nil, err
	}
	request.SourceTargetID = nestedUint64(form, "selected_target_id")
	powerParams, ok := form["params"].([]energoninput.PowerParam)
	if !ok {
		return nil, fmt.Errorf("能力参数配置无效")
	}
	request.Params = powerConfiguredParamInput(powerParams, request.Params)
	if len(continuation.RunInput) > 0 && !request.ParamsComplete {
		replayParams := powerReplayParamInput(powerParams, continuation.RunInput)
		for key, value := range request.Params {
			replayParams[key] = value
		}
		request.Params = replayParams
	}
	request.Params = energonservice.ApplyPowerParamDefaults(request.Params, powerParams)
	request.Input[powerReplayInputKey] = cloneMap(request.Params)
	historyPrompt := powerHistoryPrompt(powerParams, request.Params)
	historySummary := powerHistoryInputSummary(powerParams, request.Params)
	resolvedParams, err := s.resolvePowerAssetReferences(
		ctx, binding.TeamID, request.Params, powerParams,
	)
	if err != nil {
		return nil, err
	}
	if request.TargetAssetID > 0 && continuation.Reference.Content != nil {
		resolvedParams = attachPreviousPowerOutput(
			powerParams, resolvedParams, continuation.Reference.Content,
		)
	}
	request.Params = resolvedParams
	requestID := uuid.NewString()
	created := make(chan powerHistoryCreated, 1)
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
			OnRunCreated: func(runID uint64, createdRequestID string) error {
				history, historyErr := s.createPowerHistory(
					runContext, *workspace, binding, runID, createdRequestID,
					historyPrompt, historySummary,
				)
				if historyErr != nil {
					return historyErr
				}
				select {
				case created <- history:
				default:
				}
				return nil
			},
		})
		finished <- runErr
	}()

	select {
	case current := <-created:
		return botprotocol.BuildStreamResponse(requestID, botprotocol.Output{
			"event": "start",
			"text":  "能力已开始运行",
			"meta": map[string]any{
				"run_id":                current.RunID,
				"history_id":            current.HistoryID,
				"history_title":         current.Title,
				"history_input_summary": current.InputSummary,
				"target_asset_id":       request.TargetAssetID,
				"source_target_id":      request.SourceTargetID,
				"cancelable":            true,
			},
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
	input map[string]any,
	params []energoninput.PowerParam,
) (map[string]any, error) {
	result := cloneMap(input)
	contents := recordValue(result["_reference_contents"])
	delete(result, "_reference_contents")
	if len(contents) == 0 {
		return result, nil
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
	if nestedUint64(runInput, teamservice.CanvasPowerMetaTeamPowerID) != binding.TeamPowerID {
		return nil, fmt.Errorf("工具运行与当前能力不匹配")
	}
	if request.TargetAsset > 0 && nestedUint64(runInput, powerTargetAssetIDKey) != request.TargetAsset {
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
		return nil, fmt.Errorf("请输入资产标题")
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
	projection, err := projectDialogueAsset(ctx, message, request.ArtifactID)
	if err != nil {
		return nil, err
	}
	targetAssetID := request.TargetAsset
	if request.ArtifactID > 0 {
		// A single generated artifact is always an independent material. It must
		// not replace the continued conversation asset with a different kind.
		targetAssetID = 0
	}
	if targetAssetID > 0 {
		run := agentmodel.NewRunModel().Find(ctx, map[string]any{"request_id": message.RequestID})
		if run == nil || nestedUint64(recordValue(run.Input), "_target_asset_id") != targetAssetID {
			return nil, fmt.Errorf("请先从目标素材发起一条新的对话回复")
		}
	}
	source := map[string]any{
		"role_id":    binding.RoleID,
		"agent_id":   binding.AgentID,
		"agent_key":  binding.AgentKey,
		"session_id": message.SessionID,
		"message_id": message.ID,
	}
	for key, value := range projection.Source {
		source[key] = value
	}
	name := strings.TrimSpace(request.Name)
	if name == "" && targetAssetID > 0 {
		if target := s.asset.Find(ctx, targetAssetID); target != nil {
			name = target.Name
			source["parent_asset_id"] = target.ID
			source["parent_version_id"] = target.VersionID
		}
	}
	if name == "" {
		name = projection.DefaultName
	}
	if name == "" {
		name = binding.Name + " 回复"
	}
	requestID := message.RequestID
	if requestID == "" {
		requestID = fmt.Sprintf("dialogue-message-%d", message.ID)
	}
	requestID += projection.RequestSuffix
	asset, version, err := s.asset.SaveVersion(ctx, assetservice.SaveVersionRequest{
		AssetID:    targetAssetID,
		BodyID:     binding.BodyID,
		TeamID:     binding.TeamID,
		ReleaseID:  binding.ReleaseID,
		RequestID:  requestID,
		NodeKey:    fmt.Sprintf("dialogue:%d:message:%d%s", binding.RoleID, message.ID, projection.NodeSuffix),
		SourceType: assetmodel.SourceDialogue,
		SourceID:   binding.RoleID,
		SourceName: binding.Name,
		Source:     source,
		Name:       name,
		Kind:       projection.Kind,
		Role:       assetmodel.RoleMaterial,
		Content:    projection.Content,
	})
	if err != nil {
		return nil, err
	}
	return map[string]any{"asset": s.asset.AssetDetailMap(ctx, *asset, version)}, nil
}

func (s Service) SaveUploadAsset(ctx context.Context, request SaveUploadAssetRequest) (map[string]any, error) {
	file := request.File
	if file.ID == 0 {
		return nil, fmt.Errorf("上传文件不能为空")
	}

	teamID := request.TeamID
	bodyID := uint64(0)
	releaseID := uint64(0)
	if request.ProjectID > 0 {
		actor, err := userservice.RequireActor(ctx)
		if err != nil {
			return nil, err
		}
		project := projectmodel.NewProjectModel().Find(ctx, map[string]any{
			"id":      request.ProjectID,
			"user_id": actor.UserID,
			"status":  projectmodel.StatusEnabled,
		})
		if project == nil {
			return nil, fmt.Errorf("项目不存在")
		}
		if teamID > 0 && project.TeamID != teamID {
			return nil, fmt.Errorf("项目不属于当前团队")
		}
		if project.BodyID == 0 {
			return nil, fmt.Errorf("项目载体不存在")
		}
		teamID = project.TeamID
		bodyID = project.BodyID
		releaseID = project.ReleaseID
	} else {
		workspace, err := s.requireWorkspace(ctx, teamID)
		if err != nil {
			return nil, err
		}
		bodyID = workspace.BodyID
	}

	payload := uploadrepo.BuildUploadFilePayload(file)
	kind := uploadAssetKind(file)
	name := strings.TrimSpace(file.Name)
	if name == "" {
		name = fmt.Sprintf("上传文件 %d", file.ID)
	}
	nodeKey := fmt.Sprintf("upload:body:%d:file:%d", bodyID, file.ID)
	if request.ProjectID > 0 {
		nodeKey = fmt.Sprintf("upload:project:%d:file:%d", request.ProjectID, file.ID)
	}
	asset, version, err := s.asset.SaveVersion(ctx, assetservice.SaveVersionRequest{
		ProjectID:  request.ProjectID,
		BodyID:     bodyID,
		TeamID:     teamID,
		ReleaseID:  releaseID,
		RequestID:  fmt.Sprintf("upload-file:%d", file.ID),
		NodeKey:    nodeKey,
		SourceType: assetmodel.SourceUpload,
		SourceID:   file.ID,
		SourceName: "上传",
		Source:     uploadAssetSource(file),
		Name:       name,
		Kind:       kind,
		Role:       assetmodel.RoleMaterial,
		Content:    uploadAssetContent(kind, payload),
	})
	if err != nil {
		return nil, err
	}
	return map[string]any{"asset": s.asset.AssetDetailMap(ctx, *asset, version)}, nil
}

func uploadAssetKind(file uploadrepo.UploadFile) string {
	kind := strings.ToLower(strings.TrimSpace(file.Kind))
	mimeType := strings.ToLower(strings.TrimSpace(file.Mime))
	switch {
	case kind == assetmodel.KindImage || strings.HasPrefix(mimeType, "image/"):
		return assetmodel.KindImage
	case kind == assetmodel.KindVideo || strings.HasPrefix(mimeType, "video/"):
		return assetmodel.KindVideo
	case kind == assetmodel.KindAudio || strings.HasPrefix(mimeType, "audio/"):
		return assetmodel.KindAudio
	default:
		return assetmodel.KindFile
	}
}

func uploadAssetSource(file uploadrepo.UploadFile) map[string]any {
	return map[string]any{
		"upload_file_id": file.ID,
		"rule_id":        file.RuleID,
		"kind":           file.Kind,
		"mime":           file.Mime,
		"size":           file.Size,
		"hash":           file.Hash,
		"biz_key":        file.BizKey,
	}
}

func uploadAssetContent(kind string, payload map[string]any) map[string]any {
	url := nestedText(payload, "url")
	switch kind {
	case assetmodel.KindImage:
		return map[string]any{"image": url, "images": []any{payload}}
	case assetmodel.KindVideo:
		return map[string]any{"video": url, "videos": []any{payload}}
	case assetmodel.KindAudio:
		return map[string]any{"audio": url, "audios": []any{payload}}
	default:
		return map[string]any{
			"file":  url,
			"files": []any{payload},
			"text":  nestedText(payload, "name"),
		}
	}
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
