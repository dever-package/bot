package input

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
)

type ServiceParamObjectListMapping struct {
	Field    string `json:"field"`
	Source   string `json:"source"`
	MaxItems int    `json:"max_items,omitempty"`
}

func DecodeServiceParamObjectListMapping(value any) (ServiceParamObjectListMapping, error) {
	var mapping ServiceParamObjectListMapping
	var encoded []byte
	if text, ok := value.(string); ok {
		encoded = []byte(text)
	} else {
		var err error
		encoded, err = json.Marshal(value)
		if err != nil {
			return mapping, err
		}
	}
	decoder := json.NewDecoder(strings.NewReader(string(encoded)))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&mapping); err != nil {
		return mapping, fmt.Errorf("对象列表配置无效: %w", err)
	}
	if err := decoder.Decode(new(any)); err != io.EOF {
		return mapping, fmt.Errorf("对象列表配置必须是单个对象")
	}
	mapping.Field = strings.TrimSpace(mapping.Field)
	if mapping.Field == "" || len(mapping.Field) > 128 {
		return mapping, fmt.Errorf("对象字段需填写1–128个字符")
	}
	if mapping.Source != "value" && mapping.Source != "index" {
		return mapping, fmt.Errorf("请选择选项值或顺序编号")
	}
	if mapping.MaxItems < 0 {
		return mapping, fmt.Errorf("最多条目不能为负数")
	}
	return mapping, nil
}

func mapObjectListParamValue(ctx context.Context, repo Repository, serviceParam botmodel.ServiceParam, param botmodel.Param, value any, preserveNumbers ...bool) (any, bool, error) {
	mapping, err := DecodeServiceParamObjectListMapping(serviceParam.Mapping)
	if err != nil {
		return nil, false, err
	}
	var values []any
	if IsOptionParamType(param.Type) {
		options, err := selectedParamOptions(ctx, repo, param, value)
		if err != nil {
			return nil, false, err
		}
		for _, option := range options {
			values = append(values, ScalarByType(param.ValueType, option.Value, preserveNumbers...))
		}
	} else if IsFileParamType(param.Type) {
		values = List(value)
	} else {
		return nil, false, fmt.Errorf("对象列表只支持选项和文件参数")
	}
	if mapping.MaxItems > 0 && len(values) > mapping.MaxItems {
		return nil, false, fmt.Errorf("参数“%s”最多选择 %d 项", ServiceParamDisplayName(serviceParam, param), mapping.MaxItems)
	}
	rows := make([]any, 0, len(values))
	for index, item := range values {
		if mapping.Source == "index" {
			item = index
		}
		rows = append(rows, map[string]any{mapping.Field: item})
	}
	return rows, len(rows) > 0, nil
}
