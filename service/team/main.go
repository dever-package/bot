package team

import (
	agentservice "my/package/bot/service/agent"
	assetservice "my/package/bot/service/asset"
	energonservice "my/package/bot/service/energon"
	memoryservice "my/package/bot/service/memory"
	frontstream "my/package/front/service/stream"
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
