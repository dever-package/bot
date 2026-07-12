package chat

import (
	runtimecontext "github.com/dever-package/bot/service/agent/runtime/context"
	energonservice "github.com/dever-package/bot/service/energon"
)

type Service struct {
	gateway   energonservice.GatewayService
	compactor runtimecontext.Compactor
}

func NewService() Service {
	return NewServiceWithGateway(energonservice.NewGatewayService())
}

func NewServiceWithGateway(gateway energonservice.GatewayService) Service {
	return Service{
		gateway:   gateway,
		compactor: runtimecontext.NewCompactor(gateway),
	}
}
