package processor

import (
	"context"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const ProtocolLocal = "local"

type ParamDefinition struct {
	Key          string
	Name         string
	Type         string
	Usage        int16
	ValueType    string
	UploadRuleID uint64
	MaxFiles     int
	DefaultValue string
	Sort         int
	Options      []ParamOptionDefinition
}

type ParamOptionDefinition struct {
	Name  string
	Value string
	Sort  int
}

type ParamSpec struct {
	ParamKey  string
	NativeKey string
	Name      string
	Required  bool
	Sort      int
}

type OperationSpec struct {
	Key    string
	Name   string
	Sort   int
	Params []ParamSpec
}

type ServiceSpec struct {
	Key        string
	Name       string
	Kind       string
	Sort       int
	Operations []OperationSpec
}

type Manifest struct {
	Key              string
	Name             string
	ParamDefinitions []ParamDefinition
	Services         []ServiceSpec
}

type ExecuteRequest struct {
	RequestID string
	Operation string
	Input     map[string]any
	Write     func(botprotocol.Output) error
}

type Processor interface {
	Manifest() Manifest
	Execute(context.Context, ExecuteRequest) (any, error)
}
