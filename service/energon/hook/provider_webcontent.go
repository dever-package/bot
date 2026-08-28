package hook

import (
	"fmt"
	"strings"
	"time"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	botmodel "github.com/dever-package/bot/model/energon"
	botwebcontent "github.com/dever-package/bot/service/energon/webcontent"
)

const webContentServicePathPrefix = "webcontent://"

func syncWebContentServices(c *server.Context, provider botmodel.Provider) error {
	spec, ok := botwebcontent.FindPlatform(provider.ProtocolOption)
	if !ok {
		return fmt.Errorf("自媒体平台“%s”暂不支持", provider.ProtocolOption)
	}
	catalog, err := botwebcontent.EnsureCatalog(c.Context(), spec)
	if err != nil {
		return err
	}

	serviceModel := botmodel.NewServiceModel()
	existingRows := serviceModel.SelectMap(c.Context(), map[string]any{"provider_id": provider.ID})
	serviceID := uint64(0)
	staleIDs := make([]uint64, 0)
	for _, row := range existingRows {
		path := strings.ToLower(util.ToStringTrimmed(row["path"]))
		if !strings.HasPrefix(path, webContentServicePathPrefix) {
			continue
		}
		id := util.ToUint64(row["id"])
		if strings.EqualFold(path, spec.ServicePath) && serviceID == 0 {
			serviceID = id
			continue
		}
		if id > 0 {
			staleIDs = append(staleIDs, id)
		}
	}
	if len(staleIDs) > 0 {
		deleteServiceReferences(c, staleIDs)
		serviceModel.Delete(c.Context(), map[string]any{
			"provider_id": provider.ID,
			"id":          uint64IDsToAny(staleIDs),
		})
	}

	serviceValues := map[string]any{
		"name":                   spec.ServiceName,
		"type":                   spec.PowerKind,
		"image_output_mode":      botmodel.ImageOutputModeSingle,
		"max_images_per_request": 0,
		"context_window_tokens":  0,
		"max_output_tokens":      0,
		"path":                   spec.ServicePath,
		"sort":                   10,
		"status":                 1,
	}
	if serviceID > 0 {
		serviceModel.Update(c.Context(), map[string]any{"id": serviceID}, serviceValues)
	} else {
		serviceValues["account_id"] = 0
		serviceValues["provider_id"] = provider.ID
		serviceValues["created_at"] = time.Now()
		serviceID = uint64(serviceModel.Insert(c.Context(), serviceValues))
		if serviceID == 0 {
			return fmt.Errorf("创建%s服务失败", spec.Name)
		}
	}

	if err := syncWebContentServiceParam(c, serviceID, catalog.Param, spec.InputParamName); err != nil {
		return err
	}
	if err := syncWebContentEndpoint(c, serviceID, catalog.Param.ID); err != nil {
		return err
	}
	return syncWebContentPowerTarget(c, catalog.Power.ID, serviceID)
}

func syncWebContentServiceParam(
	c *server.Context,
	serviceID uint64,
	param botmodel.Param,
	paramName string,
) error {
	model := botmodel.NewServiceParamModel()
	rows := model.SelectMap(c.Context(), map[string]any{"service_id": serviceID})
	keepID := uint64(0)
	staleIDs := make([]uint64, 0)
	for _, row := range rows {
		id := util.ToUint64(row["id"])
		if keepID == 0 && util.ToUint64(row["param_id"]) == param.ID && util.ToStringTrimmed(row["key"]) == "source" {
			keepID = id
			continue
		}
		if id > 0 {
			staleIDs = append(staleIDs, id)
		}
	}
	if len(staleIDs) > 0 {
		model.Delete(c.Context(), map[string]any{"id": uint64IDsToAny(staleIDs)})
	}
	values := map[string]any{
		"param_id":             param.ID,
		"active_when_param_id": 0,
		"active_when_value":    "",
		"param_rule":           botmodel.ServiceParamRuleDirect,
		"key":                  "source",
		"name":                 paramName,
		"mapping":              "",
		"fixed_value_type":     botmodel.ServiceParamFixedValueTypeString,
		"file_value_format":    botmodel.ServiceParamFileValueFormatURL,
		"status":               1,
		"sort":                 10,
	}
	if keepID > 0 {
		model.Update(c.Context(), map[string]any{"id": keepID}, values)
		return nil
	}
	values["service_id"] = serviceID
	values["created_at"] = time.Now()
	if model.Insert(c.Context(), values) == 0 {
		return fmt.Errorf("创建网页内容导入服务参数失败")
	}
	return nil
}

func syncWebContentEndpoint(c *server.Context, serviceID uint64, paramID uint64) error {
	model := botmodel.NewServiceEndpointModel()
	rows := model.SelectMap(c.Context(), map[string]any{"service_id": serviceID})
	keepID := uint64(0)
	staleIDs := make([]uint64, 0)
	for _, row := range rows {
		id := util.ToUint64(row["id"])
		if keepID == 0 && util.ToStringTrimmed(row["api"]) == botwebcontent.ResolveAPI {
			keepID = id
			continue
		}
		if id > 0 {
			staleIDs = append(staleIDs, id)
		}
	}
	if len(staleIDs) > 0 {
		model.Delete(c.Context(), map[string]any{"id": uint64IDsToAny(staleIDs)})
	}
	values := map[string]any{
		"param_mode": "all",
		"param_ids":  fmt.Sprintf(`[{"param_id":%d,"sort":1}]`, paramID),
		"status":     1,
		"sort":       1,
	}
	if keepID > 0 {
		model.Update(c.Context(), map[string]any{"id": keepID}, values)
		return nil
	}
	values["service_id"] = serviceID
	values["api"] = botwebcontent.ResolveAPI
	values["created_at"] = time.Now()
	if model.Insert(c.Context(), values) == 0 {
		return fmt.Errorf("创建网页内容导入服务接口失败")
	}
	return nil
}

func syncWebContentPowerTarget(c *server.Context, powerID uint64, serviceID uint64) error {
	model := botmodel.NewPowerTargetModel()
	filter := map[string]any{"power_id": powerID, "service_id": serviceID}
	values := map[string]any{"sort": 10, "status": 1}
	if row := model.Find(c.Context(), filter); row != nil {
		model.Update(c.Context(), map[string]any{"id": row.ID}, values)
		return nil
	}
	values["power_id"] = powerID
	values["service_id"] = serviceID
	values["created_at"] = time.Now()
	if model.Insert(c.Context(), values) == 0 {
		return fmt.Errorf("关联网页内容导入能力失败")
	}
	return nil
}

func deleteWebContentServices(c *server.Context, providerID uint64) {
	rows := botmodel.NewServiceModel().SelectMap(c.Context(), map[string]any{"provider_id": providerID})
	serviceIDs := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if strings.HasPrefix(strings.ToLower(util.ToStringTrimmed(row["path"])), webContentServicePathPrefix) {
			if id := util.ToUint64(row["id"]); id > 0 {
				serviceIDs = append(serviceIDs, id)
			}
		}
	}
	if len(serviceIDs) == 0 {
		return
	}
	deleteServiceReferences(c, serviceIDs)
	botmodel.NewServiceModel().Delete(c.Context(), map[string]any{
		"provider_id": providerID,
		"id":          uint64IDsToAny(serviceIDs),
	})
}
