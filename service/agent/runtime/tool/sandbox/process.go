package sandbox

import "fmt"

type PreparedProcess struct {
	Runner      string
	CommandName string
	CommandArgs []string
	WorkDir     string
	Env         []string
}

func PrepareProcess(config Config, req Request, commandName string, commandArgs []string) (PreparedProcess, error) {
	config = NormalizeConfig(config)
	if req.SkillRoot == "" {
		return PreparedProcess{}, fmt.Errorf("进程沙箱缺少技能目录")
	}
	if req.TempRoot == "" {
		return PreparedProcess{}, fmt.Errorf("进程沙箱缺少临时工作目录")
	}
	switch config.Driver {
	case DriverDisabled:
		return PreparedProcess{}, fmt.Errorf("脚本执行已被运行沙箱配置禁用")
	case DriverLocal:
		return PreparedProcess{
			Runner:      DriverLocal,
			CommandName: commandName,
			CommandArgs: commandArgs,
			WorkDir:     req.SkillRoot,
			Env:         scriptEnv(req.TempRoot, req.SkillRoot, req.Env),
		}, nil
	case DriverBwrap:
		bwrapPath, err := resolveBwrapPath(config.BwrapPath)
		if err != nil {
			return PreparedProcess{}, err
		}
		args, err := bwrapArgs(config, req, commandName, commandArgs)
		if err != nil {
			return PreparedProcess{}, err
		}
		return PreparedProcess{
			Runner:      DriverBwrap,
			CommandName: bwrapPath,
			CommandArgs: args,
		}, nil
	default:
		return PreparedProcess{}, fmt.Errorf("不支持的脚本沙箱模式: %s", config.Driver)
	}
}
