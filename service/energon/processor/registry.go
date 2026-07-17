package processor

import (
	"context"
	"fmt"
	"sort"
	"strings"
)

type Registry struct {
	processors map[string]Processor
}

func NewRegistry(processors ...Processor) *Registry {
	registry := &Registry{processors: map[string]Processor{}}
	for _, current := range processors {
		registry.Register(current)
	}
	return registry
}

func DefaultRegistry() *Registry {
	return NewRegistry(NewFFmpegProcessor())
}

func (r *Registry) Register(current Processor) {
	if r == nil || current == nil {
		return
	}
	key := normalizeKey(current.Manifest().Key)
	if key == "" {
		return
	}
	if r.processors == nil {
		r.processors = map[string]Processor{}
	}
	r.processors[key] = current
}

func (r *Registry) Find(key string) (Processor, bool) {
	if r == nil {
		return nil, false
	}
	current, ok := r.processors[normalizeKey(key)]
	return current, ok
}

func (r *Registry) Manifest(key string) (Manifest, bool) {
	current, ok := r.Find(key)
	if !ok {
		return Manifest{}, false
	}
	return cloneManifest(current.Manifest()), true
}

func (r *Registry) Options() []map[string]any {
	if r == nil {
		return []map[string]any{}
	}
	manifests := make([]Manifest, 0, len(r.processors))
	for _, current := range r.processors {
		manifests = append(manifests, current.Manifest())
	}
	sort.SliceStable(manifests, func(i, j int) bool {
		return manifests[i].Name < manifests[j].Name
	})
	options := make([]map[string]any, 0, len(manifests))
	for _, manifest := range manifests {
		options = append(options, map[string]any{
			"id":   manifest.Key,
			"name": manifest.Name,
		})
	}
	return options
}

func (r *Registry) Execute(ctx context.Context, key string, request ExecuteRequest) (any, error) {
	current, ok := r.Find(key)
	if !ok {
		return nil, fmt.Errorf("本地处理器“%s”不存在", strings.TrimSpace(key))
	}
	return current.Execute(ctx, request)
}

func normalizeKey(value string) string {
	return strings.ToLower(strings.TrimSpace(value))
}

func cloneManifest(source Manifest) Manifest {
	result := source
	result.ParamDefinitions = make([]ParamDefinition, len(source.ParamDefinitions))
	for index, definition := range source.ParamDefinitions {
		result.ParamDefinitions[index] = definition
		result.ParamDefinitions[index].Options = append(
			[]ParamOptionDefinition(nil),
			definition.Options...,
		)
	}
	result.Services = make([]ServiceSpec, len(source.Services))
	for index, service := range source.Services {
		result.Services[index] = service
		result.Services[index].Operations = make([]OperationSpec, len(service.Operations))
		for operationIndex, operation := range service.Operations {
			result.Services[index].Operations[operationIndex] = operation
			result.Services[index].Operations[operationIndex].Params = append([]ParamSpec(nil), operation.Params...)
		}
	}
	return result
}
