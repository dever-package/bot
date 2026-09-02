package project

import "strings"

const (
	canvasFunctionStart   = "start"
	canvasFunctionImport  = "import"
	canvasFunctionSave    = "save"
	canvasFunctionDisplay = "display"
)

type canvasFunctionDefinition struct {
	Label            string
	Runnable         bool
	PersistsResult   bool
	ReturnsResult    bool
	StopsRun         bool
	RequiredIncoming int
}

var canvasFunctionDefinitions = map[string]canvasFunctionDefinition{
	canvasFunctionStart: {
		Label: "开始",
	},
	canvasFunctionImport: {
		Label: "引用",
	},
	canvasFunctionSave: {
		Label:            "保存",
		Runnable:         true,
		PersistsResult:   true,
		ReturnsResult:    true,
		StopsRun:         true,
		RequiredIncoming: 1,
	},
	canvasFunctionDisplay: {
		Label:            "展示",
		Runnable:         true,
		ReturnsResult:    true,
		StopsRun:         true,
		RequiredIncoming: 1,
	},
}

func canvasFunctionDefinitionFor(key string) (canvasFunctionDefinition, bool) {
	definition, exists := canvasFunctionDefinitions[strings.TrimSpace(key)]
	return definition, exists
}

func isSupportedCanvasFunctionKey(key string) bool {
	_, exists := canvasFunctionDefinitionFor(key)
	return exists
}

func isCanvasStartNode(node canvasRunNode) bool {
	return node.Type == "function" && node.FunctionKey == canvasFunctionStart
}

func isRunnableCanvasNode(node canvasRunNode) bool {
	switch node.Type {
	case "power":
		return node.PowerID > 0 || strings.TrimSpace(node.PowerKey) != ""
	case "asset", "agent", "flow":
		return true
	case "function":
		definition, exists := canvasFunctionDefinitionFor(node.FunctionKey)
		return exists && definition.Runnable
	default:
		return false
	}
}

func canvasRunNodePersistsResult(nodeType string, functionKey string) bool {
	switch nodeType {
	case "asset", "power", "agent", "flow":
		return true
	case "function":
		definition, exists := canvasFunctionDefinitionFor(functionKey)
		return exists && definition.PersistsResult
	default:
		return false
	}
}

func canvasRunNodeReturnsResult(nodeType string, functionKey string) bool {
	switch nodeType {
	case "asset", "power", "agent", "flow":
		return true
	case "function":
		definition, exists := canvasFunctionDefinitionFor(functionKey)
		return exists && definition.ReturnsResult
	default:
		return false
	}
}

func canvasNodeStopsRun(node canvasRunNode) bool {
	if node.Type != "function" {
		return false
	}
	definition, exists := canvasFunctionDefinitionFor(node.FunctionKey)
	return exists && definition.StopsRun
}
