package tool

import (
	"context"
	"fmt"
	"strings"

	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type Registry struct {
	items             map[string]runtimeprovider.Tool
	order             []string
	cachedDefinitions []any
}

func NewRegistry(tools ...runtimeprovider.Tool) (*Registry, error) {
	registry := &Registry{items: map[string]runtimeprovider.Tool{}}
	if err := registry.Add(tools...); err != nil {
		return nil, err
	}
	return registry, nil
}

func (registry *Registry) Add(tools ...runtimeprovider.Tool) error {
	if registry == nil {
		return fmt.Errorf("工具注册表未初始化")
	}
	if registry.items == nil {
		registry.items = map[string]runtimeprovider.Tool{}
	}
	normalized := make([]runtimeprovider.Tool, 0, len(tools))
	batchNames := make(map[string]struct{}, len(tools))
	for _, current := range tools {
		name := strings.TrimSpace(current.Definition.Name)
		if name == "" || current.Handle == nil {
			return fmt.Errorf("工具定义不完整")
		}
		if _, exists := registry.items[name]; exists {
			return fmt.Errorf("工具名称重复: %s", name)
		}
		if _, exists := batchNames[name]; exists {
			return fmt.Errorf("工具名称重复: %s", name)
		}
		batchNames[name] = struct{}{}
		current.Definition.Name = name
		normalized = append(normalized, current)
	}
	for _, current := range normalized {
		name := current.Definition.Name
		registry.items[name] = current
		registry.order = append(registry.order, name)
	}
	registry.cachedDefinitions = nil
	return nil
}

func (registry *Registry) Has(name string) bool {
	if registry == nil {
		return false
	}
	_, exists := registry.items[strings.TrimSpace(name)]
	return exists
}

func (registry *Registry) Definitions() []any {
	if registry == nil {
		return nil
	}
	if registry.cachedDefinitions != nil {
		return append([]any(nil), registry.cachedDefinitions...)
	}
	result := make([]any, 0, len(registry.order))
	for _, name := range registry.order {
		result = append(result, registry.items[name].CurrentDefinition().Native())
	}
	registry.cachedDefinitions = result
	return append([]any(nil), result...)
}

func (registry *Registry) Names() []string {
	if registry == nil {
		return nil
	}
	return append([]string(nil), registry.order...)
}

func (registry *Registry) DefinitionsByKind(kinds ...string) []runtimeprovider.Definition {
	if registry == nil || len(kinds) == 0 {
		return nil
	}
	allowed := make(map[string]struct{}, len(kinds))
	for _, kind := range kinds {
		allowed[strings.ToLower(strings.TrimSpace(kind))] = struct{}{}
	}
	result := make([]runtimeprovider.Definition, 0)
	for _, name := range registry.order {
		definition := registry.items[name].CurrentDefinition()
		if _, exists := allowed[strings.ToLower(strings.TrimSpace(definition.Kind))]; exists {
			result = append(result, definition)
		}
	}
	return result
}

func (registry *Registry) Definition(name string) (runtimeprovider.Definition, bool) {
	if registry == nil {
		return runtimeprovider.Definition{}, false
	}
	current, exists := registry.items[strings.TrimSpace(name)]
	return current.CurrentDefinition(), exists
}

func (registry *Registry) AddMediaReferences(references []runtimeprovider.MediaReference) {
	if registry == nil || len(references) == 0 {
		return
	}
	for _, name := range registry.order {
		current := registry.items[name]
		if current.AddMediaReferences != nil {
			current.AddMediaReferences(references)
		}
	}
	registry.cachedDefinitions = nil
}

func (registry *Registry) ValidateArguments(name string, arguments map[string]any) error {
	if registry == nil {
		return fmt.Errorf("工具注册表未初始化")
	}
	current, exists := registry.items[strings.TrimSpace(name)]
	if !exists {
		return fmt.Errorf("当前智能体未挂载工具: %s", name)
	}
	if current.ValidateArguments == nil {
		return nil
	}
	return current.ValidateArguments(arguments)
}

func (registry *Registry) Execute(ctx context.Context, call botprotocol.ToolCall, requestID string, onOutput runtimeprovider.OutputHandler) (runtimeprovider.Result, error) {
	if registry == nil {
		return runtimeprovider.Result{}, fmt.Errorf("工具注册表未初始化")
	}
	current, exists := registry.items[strings.TrimSpace(call.Name)]
	if !exists {
		return runtimeprovider.Result{}, fmt.Errorf("当前智能体未挂载工具: %s", call.Name)
	}
	arguments, err := botprotocol.ToolCallArguments(call)
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	if err = registry.ValidateArguments(call.Name, arguments); err != nil {
		return runtimeprovider.Result{}, err
	}
	result, err := current.Handle(ctx, runtimeprovider.Call{
		ID:        call.ID,
		Name:      call.Name,
		RequestID: requestID,
		Arguments: arguments,
		OnOutput:  onOutput,
	})
	if err != nil {
		return runtimeprovider.Result{}, err
	}
	pending := make([]runtimeprovider.Tool, 0, len(result.Tools))
	for _, added := range result.Tools {
		name := strings.TrimSpace(added.Definition.Name)
		if existing, exists := registry.items[name]; exists {
			if existing.CurrentDefinition().Kind == "skill" && added.CurrentDefinition().Kind == "skill" {
				continue
			}
			return runtimeprovider.Result{}, fmt.Errorf("动态工具名称与已挂载工具冲突: %s", name)
		}
		pending = append(pending, added)
	}
	if err := registry.Add(pending...); err != nil {
		return runtimeprovider.Result{}, err
	}
	return result, nil
}
