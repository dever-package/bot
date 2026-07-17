package input

import (
	"context"
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	runtimereference "github.com/dever-package/bot/service/agent/runtime/reference"
	energonservice "github.com/dever-package/bot/service/energon"
	energoninput "github.com/dever-package/bot/service/energon/input"
)

const defaultMaxFiles = 5

type Config struct {
	Params []energoninput.PowerParam `json:"params"`
}

func LoadConfig(ctx context.Context, agentID uint64) Config {
	return Config{Params: LoadParams(ctx, agentID)}
}

func LoadParams(ctx context.Context, agentID uint64) []energoninput.PowerParam {
	if agentID == 0 {
		return []energoninput.PowerParam{}
	}

	repo := energonservice.NewRepo()
	params := repo.ParamMap(ctx)
	rows := agentmodel.NewAgentParamModel().Select(ctx, map[string]any{"agent_id": agentID})
	result := make([]energoninput.PowerParam, 0, len(rows))
	for _, relation := range rows {
		if relation == nil {
			continue
		}
		param, exists := params[relation.ParamID]
		if !exists || !energoninput.IsActive(param.Status) || energoninput.IsPromptParam(param) {
			continue
		}
		result = append(result, buildAgentParam(ctx, repo, *relation, param))
	}
	return result
}

func Normalize(
	ctx context.Context,
	agentID uint64,
	raw map[string]any,
	references []runtimereference.Reference,
) (map[string]any, error) {
	params := LoadParams(ctx, agentID)
	result := energoninput.NormalizePowerParamInput(raw, params)
	byKey := make(map[string]energoninput.PowerParam, len(params))
	for _, param := range params {
		key := strings.TrimSpace(param.Key)
		if key == "" {
			continue
		}
		byKey[key] = param
		if _, exists := result[key]; !exists && strings.TrimSpace(param.DefaultValue) != "" {
			result[key] = energoninput.ParseJSONValue(param.DefaultValue)
		}
	}

	attachmentCounts := map[string]int{}
	for _, reference := range references {
		usage := strings.TrimSpace(reference.Usage)
		if usage == "" {
			continue
		}
		if reference.Type != runtimereference.TypeUploadFile {
			return nil, fmt.Errorf("参数附件必须通过上传或资源库选择")
		}
		param, exists := byKey[usage]
		if !exists || !isFileParam(param) {
			return nil, fmt.Errorf("附件参数 %s 未在当前智能体中配置", usage)
		}
		attachmentCounts[usage]++
	}

	for _, param := range params {
		key := strings.TrimSpace(param.Key)
		if key == "" {
			continue
		}
		if isFileParam(param) {
			maxFiles := maxFilesForParam(param)
			if attachmentCounts[key] > maxFiles {
				return nil, fmt.Errorf("参数“%s”最多选择 %d 个文件", param.Name, maxFiles)
			}
		}
		value, exists := result[key]
		if param.Required && !exists && attachmentCounts[key] == 0 {
			return nil, fmt.Errorf("请填写参数“%s”", param.Name)
		}
		if param.Required && exists && energoninput.IsMissing(value) && attachmentCounts[key] == 0 {
			return nil, fmt.Errorf("请填写参数“%s”", param.Name)
		}
	}
	return result, nil
}

func buildAgentParam(
	ctx context.Context,
	repo energonservice.Repo,
	relation agentmodel.AgentParam,
	param energonmodel.Param,
) energoninput.PowerParam {
	result := energoninput.PowerParam{
		ID:           param.ID,
		PowerParamID: relation.ID,
		Name:         strings.TrimSpace(param.Name),
		Key:          strings.TrimSpace(param.Key),
		Icon:         strings.TrimSpace(param.Icon),
		Type:         energoninput.NormalizeParamControlType(param.Type),
		Usage:        normalizeUsage(param.Usage),
		ValueType:    energoninput.NormalizeParamValueType(param.ValueType),
		DefaultValue: strings.TrimSpace(param.DefaultValue),
		Required:     relation.Required == 1 && energoninput.ParamRequiresInput(param),
		UploadRuleID: param.UploadRuleID,
		MaxFiles:     param.MaxFiles,
		AssetKinds:   energoninput.PromptAssetKinds(param),
		Sort:         relation.Sort,
	}
	if energoninput.IsOptionParamType(result.Type) {
		result.Options = energoninput.BuildParamOptions(ctx, repo, param.ID)
	}
	return result
}

func normalizeUsage(value int16) int16 {
	if value == 2 {
		return 2
	}
	return 1
}

func isFileParam(param energoninput.PowerParam) bool {
	return strings.EqualFold(param.Type, "file") || strings.EqualFold(param.Type, "files")
}

func maxFilesForParam(param energoninput.PowerParam) int {
	if !strings.EqualFold(param.Type, "files") {
		return 1
	}
	if param.MaxFiles > 0 {
		return param.MaxFiles
	}
	return defaultMaxFiles
}
