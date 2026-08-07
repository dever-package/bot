package input

import (
	"context"
	"fmt"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

// ValidateTargetCompatibility verifies that a target can represent the
// current capability input using its configured service parameter mappings.
func ValidateTargetCompatibility(
	ctx context.Context,
	repo Repository,
	req *botprotocol.ShemicRequest,
	target Target,
) error {
	mapped, err := buildMapped(ctx, repo, req, target, false)
	if err != nil {
		return err
	}
	return validateConfiguredTargetInput(ctx, repo, target, mapped.Original)
}

func validateConfiguredTargetInput(
	ctx context.Context,
	repo Repository,
	target Target,
	input map[string]any,
) error {
	serviceParams := activeServiceParams(ctx, repo, target.ServiceID)
	if len(serviceParams) == 0 {
		return nil
	}

	params := repo.ParamMap(ctx)
	serviceParamIDs := ActiveServiceParamIDs(ctx, repo, target.ServiceID)
	checked := map[uint64]struct{}{}
	for _, powerParam := range repo.PowerParamsByPower(ctx, target.PowerID) {
		if _, exists := checked[powerParam.ParamID]; exists {
			continue
		}
		checked[powerParam.ParamID] = struct{}{}

		param, exists := params[powerParam.ParamID]
		if !exists || !IsActive(param.Status) {
			continue
		}
		_, value, exists := ResolveParamValue(input, param)
		if !exists || !paramHasRoutingValue(param, value) {
			continue
		}
		if !serviceParamIDs[param.ID] {
			controlType := NormalizeParamControlType(param.Type)
			if controlType == "file" || controlType == "files" {
				return fmt.Errorf("附件参数“%s”未配置服务映射", param.Name)
			}
			if normalizePowerParamShow(int(powerParam.Show)) == powerParamShowAlways {
				continue
			}
			return fmt.Errorf("来源专属参数“%s”未配置服务映射", param.Name)
		}
		if err := validateAttachmentMappingCoverage(param, value, serviceParams); err != nil {
			return err
		}
	}
	return nil
}

func activeServiceParams(ctx context.Context, repo Repository, serviceID uint64) []botmodel.ServiceParam {
	rows := repo.ServiceParamsByService(ctx, serviceID)
	result := make([]botmodel.ServiceParam, 0, len(rows))
	for _, row := range rows {
		if IsActive(row.Status) {
			result = append(result, row)
		}
	}
	return result
}

func paramHasRoutingValue(param botmodel.Param, value any) bool {
	if IsMissing(value) {
		return false
	}
	switch NormalizeParamControlType(param.Type) {
	case "switch":
		return BoolValue(value)
	case "multi_option", "files":
		return len(List(value)) > 0
	default:
		return true
	}
}

func validateAttachmentMappingCoverage(
	param botmodel.Param,
	value any,
	serviceParams []botmodel.ServiceParam,
) error {
	if !IsFileParamType(param.Type) {
		return nil
	}

	mappings := collectServiceParamFileMappings(param.ID, nil, serviceParams)
	if mappings.direct {
		return nil
	}
	if len(mappings.attachments) == 0 {
		return nil
	}

	capacity, err := attachmentMappingCapacity(mappings.attachments...)
	if err != nil {
		return fmt.Errorf("参数“%s”的%s", param.Name, err.Error())
	}
	fileCount := len(StringList(value))
	if fileCount > capacity {
		return fmt.Errorf("参数“%s”当前来源最多允许 %d 个文件，当前传入 %d 个", param.Name, capacity, fileCount)
	}
	return nil
}
