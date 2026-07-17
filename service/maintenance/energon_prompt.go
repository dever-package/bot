package maintenance

import (
	"context"
	"fmt"
	"strings"

	energonmodel "github.com/dever-package/bot/model/energon"
)

// EnsureEnergonPromptParam upgrades the built-in parameter after seed data has
// already been written to an existing database.
func EnsureEnergonPromptParam(ctx context.Context) (err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("升级内置提示词参数失败: %v", recovered)
		}
	}()

	paramModel := energonmodel.NewParamModel()
	param := paramModel.Find(ctx, map[string]any{"id": energonmodel.ParamPromptID})
	if param == nil {
		return nil
	}
	if strings.TrimSpace(param.Name) == "提示词" &&
		strings.TrimSpace(param.Key) == "prompt" &&
		strings.EqualFold(strings.TrimSpace(param.Type), "prompt") &&
		param.Usage == 1 &&
		strings.EqualFold(strings.TrimSpace(param.ValueType), "string") {
		return nil
	}
	conflict := paramModel.Find(ctx, map[string]any{
		"cate_id": param.CateID,
		"key":     "prompt",
	})
	if conflict != nil && conflict.ID != energonmodel.ParamPromptID {
		return fmt.Errorf("参数 %d 已占用 prompt 标识", conflict.ID)
	}
	paramModel.Update(ctx, map[string]any{"id": energonmodel.ParamPromptID}, map[string]any{
		"name":       "提示词",
		"key":        "prompt",
		"type":       "prompt",
		"usage":      int16(1),
		"value_type": "string",
	})
	return nil
}
