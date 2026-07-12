package sandbox

import (
	"context"
	"fmt"
	"strings"
)

func Run(ctx context.Context, config Config, req Request) (Result, error) {
	config = NormalizeConfig(config)
	if err := validateRequest(req); err != nil {
		return Result{}, err
	}
	switch config.Driver {
	case DriverDisabled:
		return disabledRunner{}.Run(ctx, config, req)
	case DriverLocal:
		return localRunner{}.Run(ctx, config, req)
	case DriverBwrap:
		return bwrapRunner{}.Run(ctx, config, req)
	default:
		return Result{}, fmt.Errorf("不支持的脚本沙箱模式: %s", config.Driver)
	}
}

func validateRequest(req Request) error {
	if strings.TrimSpace(req.SkillRoot) == "" {
		return fmt.Errorf("脚本沙箱缺少技能目录")
	}
	if strings.TrimSpace(req.TempRoot) == "" {
		return fmt.Errorf("脚本沙箱缺少临时工作目录")
	}
	if strings.TrimSpace(req.ScriptRelative) == "" {
		return fmt.Errorf("脚本沙箱缺少脚本路径")
	}
	return nil
}
