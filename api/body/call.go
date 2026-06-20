package api

import "github.com/shemic/dever/server"

type Call struct{}

func (Call) PostPower(c *server.Context) error {
	return Run{}.PostCanvasPower(c)
}

func (Call) PostAgent(c *server.Context) error {
	return Run{}.PostCanvasAgent(c)
}

func (Call) PostTeam(c *server.Context) error {
	return Run{}.PostTeam(c)
}

func (Call) PostFlow(c *server.Context) error {
	return Run{}.PostFlow(c)
}

func (Call) PostRole(c *server.Context) error {
	return Run{}.PostRole(c)
}

func (Call) GetStatus(c *server.Context) error {
	return Run{}.GetStatus(c)
}

func (Call) GetStream(c *server.Context) error {
	return Run{}.GetStream(c)
}

func (Call) PostStop(c *server.Context) error {
	return Run{}.PostStop(c)
}

func (Call) PostApproval(c *server.Context) error {
	return Run{}.PostApproval(c)
}
