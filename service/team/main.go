package team

import (
	agentservice "github.com/dever-package/bot/service/agent"
	knowledgeservice "github.com/dever-package/bot/service/agent/knowledge"
	assetservice "github.com/dever-package/bot/service/asset"
	energonservice "github.com/dever-package/bot/service/energon"
	memoryservice "github.com/dever-package/bot/service/memory"
	frontstream "github.com/dever-package/front/service/stream"
)

type Service struct {
	repo      Repo
	agent     agentservice.Service
	knowledge knowledgeservice.Service
	asset     assetservice.Service
	gateway   energonservice.GatewayService
	memory    memoryservice.Service
	streams   frontstream.Service
}

var sharedStreams = frontstream.New("team")

func StreamStore() frontstream.Service {
	return sharedStreams
}

func NewService() Service {
	return Service{
		repo:      NewRepo(),
		agent:     agentservice.NewService(),
		knowledge: knowledgeservice.NewService(),
		asset:     assetservice.NewService(),
		gateway:   energonservice.NewGatewayService(),
		memory:    memoryservice.NewService(),
		streams:   StreamStore(),
	}
}
