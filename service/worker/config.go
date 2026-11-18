package worker

import (
	"fmt"
	"strings"
	"time"

	deverconfig "github.com/shemic/dever/config"
	"github.com/shemic/dever/util"
)

type ProcessConfig struct {
	SocketPath      string               `json:"socketPath"`
	ShutdownTimeout deverconfig.Duration `json:"shutdownTimeout"`
}

func LoadConfig() (ProcessConfig, error) {
	settings := struct {
		Bot struct {
			Worker ProcessConfig `json:"worker"`
		} `json:"bot"`
	}{}
	settings.Bot.Worker = ProcessConfig{SocketPath: "data/bot/worker.sock", ShutdownTimeout: deverconfig.Duration(90 * time.Minute)}
	data, _, err := util.ReadJSONCFile("config/setting.jsonc", deverconfig.DefaultPath)
	if err != nil {
		return ProcessConfig{}, err
	}
	if err := util.UnmarshalNormalizedJSON(data, &settings); err != nil {
		return ProcessConfig{}, err
	}
	if settings.Bot.Worker.ShutdownTimeout <= 0 || strings.TrimSpace(settings.Bot.Worker.SocketPath) == "" {
		return ProcessConfig{}, fmt.Errorf("bot.worker 需要 socketPath 和大于零的 shutdownTimeout")
	}
	return settings.Bot.Worker, nil
}
