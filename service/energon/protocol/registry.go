package protocol

import (
	"fmt"
	"strings"
)

type Registry struct {
	items map[string]Adapter
}

func NewRegistry(adapters ...Adapter) *Registry {
	registry := &Registry{items: map[string]Adapter{}}
	for _, adapter := range adapters {
		registry.Register(adapter)
	}
	return registry
}

func (r *Registry) Register(adapter Adapter) {
	if r == nil || adapter == nil {
		return
	}
	name := strings.ToLower(strings.TrimSpace(adapter.Name()))
	if name == "" {
		return
	}
	r.items[name] = adapter
}

func (r *Registry) Get(name string) (Adapter, error) {
	if r == nil {
		return nil, fmt.Errorf("协议注册表未初始化")
	}
	name = strings.ToLower(strings.TrimSpace(name))
	if name == "" {
		name = "openai"
	}
	adapter, ok := r.items[name]
	if !ok {
		return nil, fmt.Errorf("协议未支持: %s", name)
	}
	return adapter, nil
}
