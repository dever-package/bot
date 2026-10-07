package hook

import (
	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"
)

func normalizeServiceEndpointDefinition(record, current map[string]any) {
	interfaceType, provided := record["interface_type"]
	if !provided {
		interfaceType = current["interface_type"]
	}
	record["interface_type"] = botmodel.NormalizeServiceEndpointType(util.ToStringTrimmed(interfaceType))
	switch record["interface_type"] {
	case botmodel.ServiceEndpointTypeModel:
		record["workflow_json"] = ""
	case botmodel.ServiceEndpointTypeWorkflowJSON:
		raw, provided := record["workflow_json"]
		if !provided {
			raw = current["workflow_json"]
		}
		workflowJSON := util.ToStringTrimmed(raw)
		if _, err := botprotocol.ParseComfyWorkflow(workflowJSON); err != nil {
			panicServiceEndpointField(err.Error())
		}
		record["workflow_json"] = workflowJSON
	default:
		panicServiceEndpointField("服务接口类型无效")
	}
	api, provided := record["api"]
	if !provided {
		api = current["api"]
	}
	record["api"] = util.ToStringTrimmed(api)
	if record["api"] == "" {
		panicServiceEndpointField("服务接口必须填写接口标识")
	}
}

func validateServiceEndpointConfiguration(c *server.Context, record, current map[string]any) {
	rawEndpoints, endpointsProvided := record["endpoints"]
	providerID := util.ToUint64(record["provider_id"])
	currentProviderID := util.ToUint64(current["provider_id"])
	if providerID == 0 {
		providerID = currentProviderID
	}
	if !endpointsProvided && providerID == currentProviderID {
		return
	}
	endpoints := normalizeChildRecordRows(rawEndpoints)
	if !endpointsProvided {
		endpoints = existingServiceEndpoints(c, util.ToUint64(current["id"]))
	}
	if len(endpoints) == 0 {
		return
	}
	provider := botmodel.NewProviderModel().Find(c.Context(), map[string]any{"id": providerID})
	if provider == nil {
		panicParamField("form.provider_id", "选择的来源不存在，请重新选择。")
	}
	for _, endpoint := range endpoints {
		if err := botprotocol.ValidateServiceEndpointType(provider.Protocol, util.ToString(endpoint["interface_type"])); err != nil {
			panicServiceEndpointField(err.Error())
		}
	}
}
