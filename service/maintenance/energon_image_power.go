package maintenance

import (
	"context"
	"fmt"
	"time"

	energonmodel "github.com/dever-package/bot/model/energon"
)

type imageParamSupport struct {
	single bool
	multi  bool
}

func migratePowerImageParams(ctx context.Context, imageParamID uint64, imagesParamID uint64) {
	serviceSupports := collectServiceImageSupport(ctx, imageParamID, imagesParamID)
	powerSupports := collectPowerImageSupport(ctx, serviceSupports)
	relationModel := energonmodel.NewPowerParamModel()
	for _, power := range energonmodel.NewPowerModel().Select(ctx, map[string]any{}) {
		imageRelations := relationModel.Select(ctx, map[string]any{
			"power_id": power.ID,
			"param_id": imageParamID,
		})
		imagesRelations := relationModel.Select(ctx, map[string]any{
			"power_id": power.ID,
			"param_id": imagesParamID,
		})
		if len(imageRelations) == 0 && len(imagesRelations) == 0 {
			continue
		}

		support := powerSupports[power.ID]
		switch {
		case support.single && support.multi:
			template := firstPowerImageRelation(imageRelations, imagesRelations)
			ensurePowerParam(ctx, power.ID, imageParamID, energonmodel.PowerParamShowBySource, template.Status, energonmodel.ParamSortImage)
			ensurePowerParam(ctx, power.ID, imagesParamID, energonmodel.PowerParamShowBySource, template.Status, energonmodel.ParamSortImages)
		case support.single:
			// Role-specific single-image parameters, such as clothing/person
			// images, keep their independent relations and labels.
		case support.multi:
			for _, relation := range imageRelations {
				movePowerParam(ctx, relation, imagesParamID, energonmodel.PowerParamShowBySource, relation.Status)
			}
		default:
			// The legacy image field accepted multiple files. Capabilities with
			// no source mapping keep that behavior through the new images key.
			for _, relation := range imageRelations {
				movePowerParam(ctx, relation, imagesParamID, relation.Show, relation.Status)
			}
		}
	}
}

func collectServiceImageSupport(ctx context.Context, imageParamID uint64, imagesParamID uint64) map[uint64]imageParamSupport {
	result := map[uint64]imageParamSupport{}
	for _, relation := range energonmodel.NewServiceParamModel().Select(ctx, map[string]any{"status": 1}) {
		support := result[relation.ServiceID]
		switch relation.ParamID {
		case imageParamID:
			support.single = true
		case imagesParamID:
			support.multi = true
		}
		result[relation.ServiceID] = support
	}
	return result
}

func collectPowerImageSupport(ctx context.Context, serviceSupports map[uint64]imageParamSupport) map[uint64]imageParamSupport {
	result := map[uint64]imageParamSupport{}
	for _, target := range energonmodel.NewPowerTargetModel().Select(ctx, map[string]any{"status": 1}) {
		serviceSupport := serviceSupports[target.ServiceID]
		powerSupport := result[target.PowerID]
		powerSupport.single = powerSupport.single || serviceSupport.single
		powerSupport.multi = powerSupport.multi || serviceSupport.multi
		result[target.PowerID] = powerSupport
	}
	return result
}

func firstPowerImageRelation(single []*energonmodel.PowerParam, multi []*energonmodel.PowerParam) *energonmodel.PowerParam {
	if len(single) > 0 {
		return single[0]
	}
	return multi[0]
}

func ensurePowerParam(ctx context.Context, powerID uint64, paramID uint64, show int16, required int16, sort int) {
	model := energonmodel.NewPowerParamModel()
	filter := map[string]any{"power_id": powerID, "param_id": paramID}
	values := map[string]any{
		"show":   show,
		"status": required,
		"sort":   sort,
	}
	if existing := model.Find(ctx, filter); existing != nil {
		model.Update(ctx, map[string]any{"id": existing.ID}, values)
		return
	}
	values["power_id"] = powerID
	values["param_id"] = paramID
	values["created_at"] = time.Now()
	model.Insert(ctx, values)
}

func movePowerParam(ctx context.Context, relation *energonmodel.PowerParam, paramID uint64, show int16, required int16) {
	model := energonmodel.NewPowerParamModel()
	filter := map[string]any{"power_id": relation.PowerID, "param_id": paramID}
	values := map[string]any{
		"show":   show,
		"status": required,
		"sort":   energonmodel.ParamSortImages,
	}
	if existing := model.Find(ctx, filter); existing != nil && existing.ID != relation.ID {
		model.Update(ctx, map[string]any{"id": existing.ID}, values)
		model.Delete(ctx, map[string]any{"id": relation.ID})
		return
	}
	values["param_id"] = paramID
	model.Update(ctx, map[string]any{"id": relation.ID}, values)
}

func normalizeBuiltinPowerParamSorts(ctx context.Context, paramSorts map[uint64]int) {
	skipPowerID := uint64(0)
	if power := energonmodel.NewPowerModel().Find(ctx, map[string]any{"key": videoComposeKey}); power != nil {
		skipPowerID = power.ID
	}

	model := energonmodel.NewPowerParamModel()
	offsets := map[string]int{}
	for _, relation := range model.Select(ctx, map[string]any{}) {
		if relation.PowerID == skipPowerID {
			continue
		}
		baseSort, ok := paramSorts[relation.ParamID]
		if !ok {
			continue
		}
		groupKey := fmt.Sprintf("%d:%d", relation.PowerID, relation.ParamID)
		sort := baseSort + offsets[groupKey]
		offsets[groupKey]++
		if relation.Sort != sort {
			model.Update(ctx, map[string]any{"id": relation.ID}, map[string]any{"sort": sort})
		}
	}
}
