package sandbox

import (
	"strings"
	"time"
)

const (
	DriverDisabled = "disabled"
	DriverLocal    = "local"
	DriverBwrap    = "bwrap"

	NetworkNone = "none"
	NetworkHost = "host"

	DefaultDriver         = DriverBwrap
	DefaultBwrapPath      = "bwrap"
	DefaultNetworkMode    = NetworkHost
	DefaultTimeout        = 15 * time.Second
	MaxTimeout            = 60 * time.Second
	DefaultOutputMaxBytes = 256 * 1024
)

const BwrapInstallGuide = "请安装 bubblewrap 后重试。安装指引: Debian/Ubuntu 执行 apt-get update && apt-get install -y bubblewrap；CentOS/RHEL/Fedora 执行 dnf install -y bubblewrap 或 yum install -y bubblewrap；Alpine 执行 apk add --no-cache bubblewrap。检测命令: which bwrap && bwrap --version"

const BwrapRuntimeGuide = "请检查 bubblewrap 是否可正常创建命名空间；若系统禁用了非特权 user namespace，需要在部署环境开启对应内核配置，或临时切换脚本沙箱模式为 disabled/local。"

type Config struct {
	Driver         string
	BwrapPath      string
	NetworkMode    string
	Timeout        time.Duration
	OutputMaxBytes int
}

type Request struct {
	SkillRoot      string
	TempRoot       string
	ScriptRelative string
	Args           []string
	Env            []string
	Timeout        time.Duration
}

type Result struct {
	Runner     string
	Script     string
	ExitCode   int
	DurationMS int64
	Stdout     string
	Stderr     string
	Truncated  bool
	Error      string
}

func NormalizeConfig(config Config) Config {
	config.Driver = normalizeDriver(config.Driver)
	config.BwrapPath = defaultString(config.BwrapPath, DefaultBwrapPath)
	config.NetworkMode = normalizeNetworkMode(config.NetworkMode)
	config.Timeout = normalizeTimeout(config.Timeout, DefaultTimeout)
	if config.OutputMaxBytes <= 0 {
		config.OutputMaxBytes = DefaultOutputMaxBytes
	}
	return config
}

func normalizeDriver(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case DriverDisabled:
		return DriverDisabled
	case DriverLocal:
		return DriverLocal
	case DriverBwrap:
		return DriverBwrap
	default:
		return DefaultDriver
	}
}

func normalizeNetworkMode(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case NetworkHost:
		return NetworkHost
	case NetworkNone:
		return NetworkNone
	default:
		return DefaultNetworkMode
	}
}

func normalizeTimeout(value time.Duration, fallback time.Duration) time.Duration {
	if value <= 0 {
		value = fallback
	}
	if value > MaxTimeout {
		return MaxTimeout
	}
	return value
}

func defaultString(value string, fallback string) string {
	value = strings.TrimSpace(value)
	if value != "" {
		return value
	}
	return fallback
}
