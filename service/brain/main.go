package brain

import (
	agentservice "my/package/bot/service/agent"
	assetservice "my/package/bot/service/asset"
	energonservice "my/package/bot/service/energon"
)

type Service struct {
	repo    Repo
	agent   agentservice.Service
	asset   assetservice.Service
	gateway energonservice.GatewayService
}

func NewService() Service {
	return Service{
		repo:    NewRepo(),
		agent:   agentservice.NewService(),
		asset:   assetservice.NewService(),
		gateway: energonservice.NewGatewayService(),
	}
}
