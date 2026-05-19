package sandbox

import (
	"context"
	"fmt"
)

type disabledRunner struct{}

func (disabledRunner) Run(_ context.Context, _ Config, req Request) (Result, error) {
	return Result{}, fmt.Errorf("脚本执行已被运行沙箱配置禁用: %s", req.ScriptRelative)
}
