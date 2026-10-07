package maintenance

import (
	"context"
	"fmt"
	"time"

	energonmodel "github.com/dever-package/bot/model/energon"
	"github.com/dever-package/bot/service/energon/protocol"
	"github.com/google/uuid"
	"github.com/shemic/dever/orm"
)

const comfyWorkflowMigrationBatchSize = 100

type comfyWorkflowMigrationStore interface {
	loadEndpoints(context.Context, uint64) []*energonmodel.ServiceEndpoint
	saveEndpoint(context.Context, *energonmodel.ServiceEndpoint, energonmodel.ServiceEndpoint) (uint64, error)
	clearLegacy(context.Context, *energonmodel.Service) error
}

type comfyWorkflowModels struct {
	services  *orm.Model[energonmodel.Service]
	endpoints *orm.Model[energonmodel.ServiceEndpoint]
}

func MigrateEnergonComfyWorkflow(ctx context.Context) (err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("迁移 ComfyUI 接口工作流失败: %v", recovered)
		}
	}()
	ctx = normalizeContext(ctx)
	store := comfyWorkflowModels{
		services:  energonmodel.NewServiceModel(),
		endpoints: energonmodel.NewServiceEndpointModel(),
	}
	var cursor uint64
	for {
		services := store.services.Select(ctx, map[string]any{
			"id":            map[string]any{"gt": cursor},
			"workflow_json": map[string]any{"neq": ""},
		}, map[string]any{"order": "main.id asc", "page": 1, "pageSize": comfyWorkflowMigrationBatchSize})
		if len(services) == 0 {
			return nil
		}
		for _, service := range services {
			if err := orm.Transaction(ctx, func(tx context.Context) error {
				current := store.services.Find(tx, map[string]any{"id": service.ID})
				if current == nil || current.LegacyWorkflowJSON == "" {
					return nil
				}
				return migrateComfyWorkflowService(tx, current, store)
			}, "default"); err != nil {
				return fmt.Errorf("迁移服务 %d 的工作流失败: %w", service.ID, err)
			}
			cursor = service.ID
		}
	}
}

func migrateComfyWorkflowService(ctx context.Context, service *energonmodel.Service, store comfyWorkflowMigrationStore) error {
	if service.LegacyWorkflowJSON == "" {
		return nil
	}
	previous := store.loadEndpoints(ctx, service.ID)
	planned, err := planComfyWorkflowEndpoints(service, previous)
	if err != nil {
		return err
	}
	for index := range planned {
		var before *energonmodel.ServiceEndpoint
		if len(previous) > 0 {
			before = previous[index]
		} else {
			planned[index].Api = "workflow-" + uuid.NewString()
		}
		if before != nil && before.InterfaceType == planned[index].InterfaceType && before.WorkflowJSON == planned[index].WorkflowJSON {
			continue
		}
		endpointID, err := store.saveEndpoint(ctx, before, planned[index])
		if err != nil {
			return err
		}
		planned[index].ID = endpointID
	}
	if err := verifyComfyWorkflowEndpoints(planned, store.loadEndpoints(ctx, service.ID)); err != nil {
		return err
	}
	return store.clearLegacy(ctx, service)
}

func planComfyWorkflowEndpoints(service *energonmodel.Service, endpoints []*energonmodel.ServiceEndpoint) ([]energonmodel.ServiceEndpoint, error) {
	if _, err := protocol.ParseComfyWorkflow(service.LegacyWorkflowJSON); err != nil {
		return nil, fmt.Errorf("旧服务工作流无效: %w", err)
	}
	if len(endpoints) == 0 {
		return []energonmodel.ServiceEndpoint{{
			ServiceID: service.ID, InterfaceType: energonmodel.ServiceEndpointTypeWorkflowJSON,
			WorkflowJSON: service.LegacyWorkflowJSON, ParamMode: "all", ParamIds: "[]", Status: 1, Sort: 100,
		}}, nil
	}
	planned := make([]energonmodel.ServiceEndpoint, 0, len(endpoints))
	for _, endpoint := range endpoints {
		if endpoint == nil || endpoint.ID == 0 || endpoint.ServiceID != service.ID {
			return nil, fmt.Errorf("服务接口归属无效")
		}
		next := *endpoint
		switch energonmodel.NormalizeServiceEndpointType(endpoint.InterfaceType) {
		case energonmodel.ServiceEndpointTypeModel:
			next.InterfaceType = energonmodel.ServiceEndpointTypeWorkflowJSON
			next.WorkflowJSON = service.LegacyWorkflowJSON
		case energonmodel.ServiceEndpointTypeWorkflowJSON:
			if _, err := protocol.ParseComfyWorkflow(endpoint.WorkflowJSON); err != nil {
				return nil, fmt.Errorf("接口 %d 已有工作流无效: %w", endpoint.ID, err)
			}
		default:
			return nil, fmt.Errorf("接口 %d 的类型无效", endpoint.ID)
		}
		planned = append(planned, next)
	}
	return planned, nil
}

func verifyComfyWorkflowEndpoints(expected []energonmodel.ServiceEndpoint, saved []*energonmodel.ServiceEndpoint) error {
	if len(saved) != len(expected) {
		return fmt.Errorf("服务接口数量在迁移期间发生变化")
	}
	byID := make(map[uint64]*energonmodel.ServiceEndpoint, len(saved))
	for _, endpoint := range saved {
		if endpoint != nil {
			byID[endpoint.ID] = endpoint
		}
	}
	for _, endpoint := range expected {
		current := byID[endpoint.ID]
		if current == nil || current.ServiceID != endpoint.ServiceID || current.InterfaceType != endpoint.InterfaceType ||
			current.WorkflowJSON != endpoint.WorkflowJSON || current.Api != endpoint.Api ||
			current.ParamMode != endpoint.ParamMode || current.ParamIds != endpoint.ParamIds ||
			current.Status != endpoint.Status || current.Sort != endpoint.Sort {
			return fmt.Errorf("接口 %d 的工作流或原有配置保存校验失败", endpoint.ID)
		}
	}
	return nil
}

func (store comfyWorkflowModels) loadEndpoints(ctx context.Context, serviceID uint64) []*energonmodel.ServiceEndpoint {
	return store.endpoints.Select(ctx, map[string]any{"service_id": serviceID}, map[string]any{"order": "main.id asc"})
}

func (store comfyWorkflowModels) saveEndpoint(ctx context.Context, before *energonmodel.ServiceEndpoint, after energonmodel.ServiceEndpoint) (uint64, error) {
	if before == nil {
		id := store.endpoints.Insert(ctx, map[string]any{
			"service_id": after.ServiceID, "api": after.Api,
			"interface_type": after.InterfaceType, "workflow_json": after.WorkflowJSON,
			"param_mode": after.ParamMode, "param_ids": after.ParamIds,
			"status": after.Status, "sort": after.Sort, "created_at": time.Now(),
		})
		if id <= 0 {
			return 0, fmt.Errorf("创建工作流默认接口失败")
		}
		return uint64(id), nil
	}
	if store.endpoints.Update(ctx, map[string]any{
		"id": before.ID, "service_id": before.ServiceID,
		"interface_type": before.InterfaceType, "workflow_json": before.WorkflowJSON,
	}, map[string]any{"interface_type": after.InterfaceType, "workflow_json": after.WorkflowJSON}) != 1 {
		return 0, fmt.Errorf("接口 %d 的工作流迁移冲突", before.ID)
	}
	return before.ID, nil
}

func (store comfyWorkflowModels) clearLegacy(ctx context.Context, service *energonmodel.Service) error {
	if store.services.Update(ctx, map[string]any{
		"id": service.ID, "workflow_json": service.LegacyWorkflowJSON,
	}, map[string]any{"workflow_json": ""}) != 1 {
		return fmt.Errorf("服务 %d 的旧工作流清理冲突", service.ID)
	}
	return nil
}
