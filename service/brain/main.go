package brain

import agentservice "my/package/bot/service/agent"

type Service struct {
	repo  Repo
	agent agentservice.Service
}

func NewService() Service {
	return Service{
		repo:  NewRepo(),
		agent: agentservice.NewService(),
	}
}
