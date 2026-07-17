package hook

import (
	"fmt"
	"strings"
	"time"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	botmodel "github.com/dever-package/bot/model/energon"
	botprocessor "github.com/dever-package/bot/service/energon/processor"
	frontmeta "github.com/dever-package/front/service/meta"
)

const localServicePathPrefix = "local://"

var localProcessorRegistry = botprocessor.DefaultRegistry()

func savedProviderID(payload map[string]any) uint64 {
	if id := util.ToUint64(payload["id"]); id > 0 {
		return id
	}
	for _, key := range []string{"result", "data", "payload"} {
		if record, ok := payload[key].(map[string]any); ok {
			if id := util.ToUint64(record["id"]); id > 0 {
				return id
			}
		}
	}
	return 0
}

func syncLocalProcessorServices(c *server.Context, provider botmodel.Provider) error {
	manifest, ok := localProcessorRegistry.Manifest(provider.Processor)
	if !ok {
		return fmt.Errorf("本地处理器“%s”不存在", provider.Processor)
	}
	if err := ensureLocalProcessorParams(c, manifest.ParamDefinitions); err != nil {
		return err
	}

	existingRows := botmodel.NewServiceModel().SelectMap(c.Context(), map[string]any{
		"provider_id": provider.ID,
	})
	existingByPath := make(map[string]uint64, len(existingRows))
	for _, row := range existingRows {
		path := strings.ToLower(util.ToStringTrimmed(row["path"]))
		if id := util.ToUint64(row["id"]); path != "" && id > 0 {
			existingByPath[path] = id
		}
	}

	services := make([]any, 0, len(manifest.Services))
	keptServiceIDs := map[uint64]struct{}{}
	for _, serviceSpec := range manifest.Services {
		servicePath := localProcessorServicePath(manifest.Key, serviceSpec.Key)
		serviceID := existingByPath[strings.ToLower(servicePath)]
		if serviceID > 0 {
			keptServiceIDs[serviceID] = struct{}{}
		}
		service, err := localProcessorServiceRecord(c, serviceID, servicePath, serviceSpec)
		if err != nil {
			return err
		}
		services = append(services, service)
	}

	staleServiceIDs := make([]uint64, 0, len(existingRows))
	for _, row := range existingRows {
		serviceID := util.ToUint64(row["id"])
		if serviceID == 0 {
			continue
		}
		if _, kept := keptServiceIDs[serviceID]; !kept {
			staleServiceIDs = append(staleServiceIDs, serviceID)
		}
	}
	if len(staleServiceIDs) > 0 {
		deleteServiceReferences(c, staleServiceIDs)
	}

	return frontmeta.SaveModelRelations(
		c.Context(),
		"bot.energon.NewProviderModel",
		provider.ID,
		map[string]any{"services": services},
	)
}

func ensureLocalProcessorParams(c *server.Context, definitions []botprocessor.ParamDefinition) error {
	for _, definition := range definitions {
		key := strings.TrimSpace(definition.Key)
		if key == "" || strings.TrimSpace(definition.Name) == "" || strings.TrimSpace(definition.Type) == "" {
			return fmt.Errorf("本地处理器参数定义不完整")
		}
		existing := botmodel.NewParamModel().FindMap(c.Context(), map[string]any{
			"cate_id": defaultCategoryID,
			"key":     key,
		})
		paramValues := localProcessorParamValues(definition)
		var paramID uint64
		if len(existing) > 0 {
			if !isActive(int16(util.ToIntDefault(existing["status"], 0))) {
				return fmt.Errorf("本地处理器依赖的参数“%s”已停用", definition.Name)
			}
			paramID = util.ToUint64(existing["id"])
			if len(definition.Options) > 0 {
				botmodel.NewParamModel().Update(c.Context(), map[string]any{"id": paramID}, paramValues)
			}
		} else {
			paramValues["key"] = key
			paramValues["cate_id"] = defaultCategoryID
			paramValues["status"] = defaultRecordStatus
			paramValues["created_at"] = time.Now()
			insertID := botmodel.NewParamModel().Insert(c.Context(), paramValues)
			if insertID <= 0 {
				return fmt.Errorf("创建本地处理器参数“%s”失败", definition.Name)
			}
			paramID = uint64(insertID)
		}
		if err := ensureLocalProcessorParamOptions(c, paramID, definition.Options); err != nil {
			return err
		}
	}
	return nil
}

func localProcessorParamValues(definition botprocessor.ParamDefinition) map[string]any {
	return map[string]any{
		"name":           strings.TrimSpace(definition.Name),
		"type":           strings.TrimSpace(definition.Type),
		"usage":          definition.Usage,
		"value_type":     strings.TrimSpace(definition.ValueType),
		"upload_rule_id": definition.UploadRuleID,
		"max_files":      definition.MaxFiles,
		"default_value":  definition.DefaultValue,
		"sort":           definition.Sort,
	}
}

func ensureLocalProcessorParamOptions(
	c *server.Context,
	paramID uint64,
	definitions []botprocessor.ParamOptionDefinition,
) error {
	if paramID == 0 || len(definitions) == 0 {
		return nil
	}
	existingRows := botmodel.NewParamOptionModel().SelectMap(c.Context(), map[string]any{"param_id": paramID})
	existingByValue := make(map[string]uint64, len(existingRows))
	for _, row := range existingRows {
		existingByValue[util.ToStringTrimmed(row["value"])] = util.ToUint64(row["id"])
	}

	for _, definition := range definitions {
		value := strings.TrimSpace(definition.Value)
		name := strings.TrimSpace(definition.Name)
		if value == "" || name == "" {
			return fmt.Errorf("本地处理器参数选项定义不完整")
		}
		values := map[string]any{
			"name":  name,
			"value": value,
			"sort":  definition.Sort,
		}
		if optionID := existingByValue[value]; optionID > 0 {
			botmodel.NewParamOptionModel().Update(c.Context(), map[string]any{"id": optionID}, values)
			continue
		}
		values["param_id"] = paramID
		if botmodel.NewParamOptionModel().Insert(c.Context(), values) == 0 {
			return fmt.Errorf("创建本地处理器参数 %d 的选项“%s”失败", paramID, name)
		}
	}
	return nil
}

func localProcessorServiceRecord(
	c *server.Context,
	serviceID uint64,
	servicePath string,
	spec botprocessor.ServiceSpec,
) (map[string]any, error) {
	paramRows := []map[string]any{}
	requiredParamIDsByOperation := map[string][]map[string]any{}
	seenParams := map[string]struct{}{}
	for _, operation := range spec.Operations {
		for _, param := range operation.Params {
			paramKey := strings.TrimSpace(param.ParamKey)
			paramRow := botmodel.NewParamModel().FindMap(c.Context(), map[string]any{
				"cate_id": defaultCategoryID,
				"key":     paramKey,
				"status":  defaultRecordStatus,
			})
			if len(paramRow) == 0 {
				return nil, fmt.Errorf("本地处理器“%s”依赖的参数“%s”不存在或已停用", spec.Name, paramKey)
			}
			paramID := util.ToUint64(paramRow["id"])
			if param.Required {
				requiredParamIDsByOperation[operation.Key] = append(
					requiredParamIDsByOperation[operation.Key],
					map[string]any{"param_id": paramID, "sort": len(requiredParamIDsByOperation[operation.Key]) + 1},
				)
			}
			naturalKey := fmt.Sprintf("%d:%s", paramID, strings.TrimSpace(param.NativeKey))
			if _, exists := seenParams[naturalKey]; exists {
				continue
			}
			seenParams[naturalKey] = struct{}{}
			paramRows = append(paramRows, map[string]any{
				"param_id":         paramID,
				"param_rule":       paramRuleDirect,
				"key":              strings.TrimSpace(param.NativeKey),
				"name":             strings.TrimSpace(param.Name),
				"mapping":          "",
				"fixed_value_type": "string",
				"status":           defaultRecordStatus,
				"sort":             param.Sort,
			})
		}
	}

	endpointRows := make([]map[string]any, 0, len(spec.Operations))
	for _, operation := range spec.Operations {
		endpointRows = append(endpointRows, map[string]any{
			"api":        strings.TrimSpace(operation.Key),
			"param_mode": endpointParamModeAll,
			"param_ids":  requiredParamIDsByOperation[operation.Key],
			"status":     defaultRecordStatus,
			"sort":       operation.Sort,
		})
	}

	record := map[string]any{
		"name":      strings.TrimSpace(spec.Name),
		"type":      strings.TrimSpace(spec.Kind),
		"path":      servicePath,
		"sort":      spec.Sort,
		"status":    defaultRecordStatus,
		"params":    normalizeServiceParamRows(c, serviceID, paramRows),
		"endpoints": normalizeServiceEndpointRows(c, serviceID, endpointRows),
	}
	if serviceID > 0 {
		record["id"] = serviceID
	}
	return record, nil
}

func deleteLocalProcessorServices(c *server.Context, providerID uint64) {
	rows := botmodel.NewServiceModel().SelectMap(c.Context(), map[string]any{
		"provider_id": providerID,
	})
	serviceIDs := make([]uint64, 0, len(rows))
	for _, row := range rows {
		if !strings.HasPrefix(strings.ToLower(util.ToStringTrimmed(row["path"])), localServicePathPrefix) {
			continue
		}
		if id := util.ToUint64(row["id"]); id > 0 {
			serviceIDs = append(serviceIDs, id)
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

func localProcessorServicePath(processorKey string, serviceKey string) string {
	return localServicePathPrefix + strings.ToLower(strings.TrimSpace(processorKey)) + "/" + strings.ToLower(strings.TrimSpace(serviceKey))
}
