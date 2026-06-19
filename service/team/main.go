package team

import (
	agentservice "github.com/dever-package/bot/service/agent"
	assetservice "github.com/dever-package/bot/service/asset"
	energonservice "github.com/dever-package/bot/service/energon"
	memoryservice "github.com/dever-package/bot/service/memory"
	frontstream "github.com/dever-package/front/service/stream"
)

type Service struct {
	repo    Repo
	agent   agentservice.Service
	asset   assetservice.Service
	gateway energonservice.GatewayService
	memory  memoryservice.Service
	streams frontstream.Service
}

func NewService() Service {
	return Service{
		repo:    NewRepo(),
		agent:   agentservice.NewService(),
		asset:   assetservice.NewService(),
		gateway: energonservice.NewGatewayService(),
		memory:  memoryservice.NewService(),
		streams: frontstream.New("team"),
	}
}
