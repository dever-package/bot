package tool

import (
	"context"
	"fmt"
)

func executeInternalAPI(_ context.Context, req Request) (map[string]any, error) {
	route := inputText(firstPresent(req.Action.Input, "route", "name", "api"))
	if route == "" {
		return nil, fmt.Errorf("internal_api 需要提供 route")
	}
	return nil, fmt.Errorf("internal_api 尚未配置可调用白名单: %s", route)
}
