package runtimeconfig

import (
	"errors"
	"fmt"
	"os"
	"sync"

	deverconfig "github.com/shemic/dever/config"
	"github.com/shemic/dever/util"
)

const (
	DefaultWorkerConcurrency = 16
	DefaultQueueCapacity     = 256
	DefaultMaxResponseMB     = int64(128)
	DefaultFFmpegTranscodes  = 1

	maxWorkerConcurrency = 256
	maxQueueCapacity     = 65536
	maxResponseMB        = int64(4096)
	maxFFmpegTranscodes  = 8
)

type Config struct {
	WorkerConcurrency int   `json:"workerConcurrency"`
	QueueCapacity     int   `json:"queueCapacity"`
	MaxResponseMB     int64 `json:"maxResponseMB"`
	FFmpegTranscodes  int   `json:"ffmpegMaxTranscodes"`
}

type projectConfig struct {
	Bot struct {
		Energon Config `json:"energon"`
	} `json:"bot"`
}

var (
	loadOnce sync.Once
	loaded   Config
)

func Load() Config {
	loadOnce.Do(func() {
		loaded = readProjectConfig()
	})
	return loaded
}

func (config Config) MaxResponseBytes() int64 {
	return config.MaxResponseMB << 20
}

func readProjectConfig() Config {
	config := defaultConfig()
	data, path, err := util.ReadJSONCFile("config/setting.jsonc", deverconfig.DefaultPath)
	if errors.Is(err, os.ErrNotExist) {
		return config
	}
	if err != nil {
		panic(fmt.Errorf("读取 Bot Energon 配置失败: %w", err))
	}

	var root projectConfig
	if err := util.UnmarshalNormalizedJSON(data, &root); err != nil {
		panic(fmt.Errorf("解析 Bot Energon 配置失败 (%s): %w", path, err))
	}
	return normalize(root.Bot.Energon)
}

func defaultConfig() Config {
	return Config{
		WorkerConcurrency: DefaultWorkerConcurrency,
		QueueCapacity:     DefaultQueueCapacity,
		MaxResponseMB:     DefaultMaxResponseMB,
		FFmpegTranscodes:  DefaultFFmpegTranscodes,
	}
}

func normalize(config Config) Config {
	defaults := defaultConfig()
	config.WorkerConcurrency = boundedPositive(config.WorkerConcurrency, defaults.WorkerConcurrency, maxWorkerConcurrency)
	config.QueueCapacity = boundedPositive(config.QueueCapacity, defaults.QueueCapacity, maxQueueCapacity)
	config.FFmpegTranscodes = boundedPositive(config.FFmpegTranscodes, defaults.FFmpegTranscodes, maxFFmpegTranscodes)
	if config.MaxResponseMB <= 0 {
		config.MaxResponseMB = defaults.MaxResponseMB
	} else if config.MaxResponseMB > maxResponseMB {
		config.MaxResponseMB = maxResponseMB
	}
	return config
}

func boundedPositive(value int, fallback int, maximum int) int {
	if value <= 0 {
		return fallback
	}
	if maximum > 0 && value > maximum {
		return maximum
	}
	return value
}
