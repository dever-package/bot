package team

import (
	"encoding/json"
	"fmt"
	"strings"

	"github.com/google/uuid"

	frontstream "my/package/front/service/stream"
)

type GraphFlow struct {
	ID       uint64         `json:"id"`
	Name     string         `json:"name"`
	Key      string         `json:"key"`
	Goal     string         `json:"goal"`
	Position map[string]any `json:"position"`
	Config   map[string]any `json:"config"`
	Status   int16          `json:"status"`
	Sort     int            `json:"sort"`
}

type GraphFlowEdge struct {
	ID         uint64 `json:"id"`
	FromFlowID uint64 `json:"from_flow_id"`
	ToFlowID   uint64 `json:"to_flow_id"`
	FromKey    string `json:"from_key"`
	ToKey      string `json:"to_key"`
	Condition  string `json:"condition"`
	Status     int16  `json:"status"`
	Sort       int    `json:"sort"`
}

type GraphFlowNode struct {
	ID          uint64         `json:"id"`
	NodeKey     string         `json:"node_key"`
	Name        string         `json:"name"`
	Type        string         `json:"type"`
	RoleID      uint64         `json:"role_id"`
	RoleKey     string         `json:"role_key"`
	AgentID     uint64         `json:"agent_id"`
	PowerID     uint64         `json:"power_id"`
	SubTeamID   uint64         `json:"sub_team_id"`
	AssetCateID uint64         `json:"asset_cate_id"`
	Config      map[string]any `json:"config"`
	Position    map[string]any `json:"position"`
	Status      int16          `json:"status"`
	Sort        int            `json:"sort"`
}

type GraphFlowNodeEdge struct {
	ID         uint64 `json:"id"`
	FromNodeID uint64 `json:"from_node_id"`
	ToNodeID   uint64 `json:"to_node_id"`
	FromKey    string `json:"from_key"`
	ToKey      string `json:"to_key"`
	Condition  string `json:"condition"`
	Status     int16  `json:"status"`
	Sort       int    `json:"sort"`
}

type GraphTeam struct {
	ID          uint64         `json:"id"`
	CateID      uint64         `json:"cate_id"`
	Name        string         `json:"name"`
	Description string         `json:"description"`
	Config      map[string]any `json:"config"`
	Status      int16          `json:"status"`
	Sort        int            `json:"sort"`
}

type TeamReleaseSnapshot struct {
	Team            GraphTeam                      `json:"team"`
	AssetCates      []GraphAssetCate               `json:"asset_cates"`
	Roles           []GraphRole                    `json:"roles"`
	Flows           []GraphFlow                    `json:"flows"`
	FlowEdges       []GraphFlowEdge                `json:"flow_edges"`
	NodesByFlow     map[string][]GraphFlowNode     `json:"nodes_by_flow"`
	NodeEdgesByFlow map[string][]GraphFlowNodeEdge `json:"node_edges_by_flow"`
}

type GraphAssetCate struct {
	ID          uint64 `json:"id"`
	TeamID      uint64 `json:"team_id"`
	Name        string `json:"name"`
	Kind        string `json:"kind"`
	Cardinality string `json:"cardinality"`
	Status      int16  `json:"status"`
	Sort        int    `json:"sort"`
}

type GraphRole struct {
	ID          uint64         `json:"id"`
	TeamID      uint64         `json:"team_id"`
	RoleType    string         `json:"role_type"`
	RoleKey     string         `json:"role_key"`
	Name        string         `json:"name"`
	AgentID     uint64         `json:"agent_id"`
	AssetCateID uint64         `json:"asset_cate_id"`
	Assignment  string         `json:"assignment"`
	Config      map[string]any `json:"config"`
	Status      int16          `json:"status"`
	Sort        int            `json:"sort"`
}

type AgentOption struct {
	ID     uint64 `json:"id"`
	CateID uint64 `json:"cate_id"`
	Name   string `json:"name"`
	Key    string `json:"key"`
	Sort   int    `json:"sort"`
}

type RoleOption struct {
	ID          uint64 `json:"id"`
	TeamID      uint64 `json:"team_id"`
	RoleType    string `json:"role_type"`
	RoleKey     string `json:"role_key"`
	Name        string `json:"name"`
	AgentID     uint64 `json:"agent_id"`
	AssetCateID uint64 `json:"asset_cate_id"`
}

type TeamOption struct {
	ID        uint64      `json:"id"`
	CateID    uint64      `json:"cate_id"`
	ReleaseID uint64      `json:"release_id"`
	Name      string      `json:"name"`
	Flows     []GraphFlow `json:"flows"`
	Roles     []GraphRole `json:"roles"`
}

type PowerOption struct {
	ID     uint64 `json:"id"`
	CateID uint64 `json:"cate_id"`
	Name   string `json:"name"`
	Key    string `json:"key"`
	Icon   string `json:"icon"`
	Kind   string `json:"kind"`
}

type PowerKindOption struct {
	ID    string `json:"id"`
	Value string `json:"value"`
}

type AgentCateOption struct {
	ID    uint64 `json:"id"`
	Value string `json:"value"`
	Sort  int    `json:"sort"`
}

type RunRequest struct {
	TeamID    uint64
	FlowID    uint64
	RoleID    uint64
	ReleaseID uint64
	ProjectID uint64
	RequestID string
	Input     map[string]any
	Mode      string
}

type CanvasPowerRunRequest struct {
	ProjectID      uint64
	BodyID         uint64
	TeamID         uint64
	ReleaseID      uint64
	FlowID         uint64
	NodeKey        string
	NodeName       string
	Kind           string
	PowerID        uint64
	PowerKey       string
	SourceTargetID uint64
	Input          map[string]any
	Params         map[string]any
}

type runWaitError struct {
	message string
}

func (err runWaitError) Error() string {
	return err.message
}

func newRequestID() string {
	return uuid.NewString()
}

func jsonText(raw any) string {
	if raw == nil {
		raw = map[string]any{}
	}
	content, err := json.Marshal(raw)
	if err != nil {
		return "{}"
	}
	return string(content)
}

func jsonMap(text string) map[string]any {
	result := map[string]any{}
	if strings.TrimSpace(text) == "" {
		return result
	}
	_ = json.Unmarshal([]byte(text), &result)
	return result
}

func jsonValue(text string) any {
	if strings.TrimSpace(text) == "" {
		return nil
	}
	var result any
	if err := json.Unmarshal([]byte(text), &result); err != nil {
		return text
	}
	return result
}

func textValue(raw any) string {
	return strings.TrimSpace(frontstream.InputText(raw))
}

func errorText(err error) string {
	if err == nil {
		return ""
	}
	return err.Error()
}

func uint64Value(raw any) uint64 {
	return uint64(frontstream.InputInt64(raw, 0))
}

func intValue(raw any, fallback int) int {
	value := int(frontstream.InputInt64(raw, int64(fallback)))
	return value
}

func int16Value(raw any, fallback int16) int16 {
	value := int16(frontstream.InputInt64(raw, int64(fallback)))
	if value == 0 {
		return fallback
	}
	return value
}

func mapValue(raw any) map[string]any {
	if row, ok := raw.(map[string]any); ok && row != nil {
		return row
	}
	content, err := json.Marshal(raw)
	if err == nil {
		result := map[string]any{}
		if json.Unmarshal(content, &result) == nil {
			return result
		}
	}
	return map[string]any{}
}

func sliceMapValue(raw any) []map[string]any {
	rows, ok := raw.([]any)
	if !ok {
		return nil
	}
	result := make([]map[string]any, 0, len(rows))
	for _, item := range rows {
		if row := mapValue(item); len(row) > 0 {
			result = append(result, row)
		}
	}
	return result
}

func stringSlice(raw any) []string {
	values, ok := raw.([]any)
	if !ok {
		if text := textValue(raw); text != "" {
			return []string{text}
		}
		return nil
	}
	result := make([]string, 0, len(values))
	for _, item := range values {
		if text := textValue(item); text != "" {
			result = append(result, text)
		}
	}
	return result
}

func normalizeKey(prefix string, configured any) string {
	key := strings.TrimSpace(textValue(configured))
	if key != "" {
		return key
	}
	return fmt.Sprintf("%s_%s", prefix, strings.ReplaceAll(uuid.NewString(), "-", ""))
}

func firstText(values ...any) string {
	for _, value := range values {
		if text := textValue(value); text != "" {
			return text
		}
	}
	return ""
}

func boolValue(raw any) bool {
	switch strings.ToLower(textValue(raw)) {
	case "1", "true", "yes", "y", "on", "是", "通过", "approved", "success":
		return true
	default:
		return false
	}
}

func outputField(output map[string]any, key string) any {
	value, _ := outputFieldExists(output, key)
	return value
}

func outputFieldExists(output map[string]any, key string) (any, bool) {
	key = strings.TrimSpace(key)
	if key == "" {
		return nil, false
	}
	if value, exists := output[key]; exists {
		return value, true
	}
	for _, value := range output {
		nested := mapValue(value)
		if len(nested) == 0 {
			continue
		}
		if nestedValue, exists := nested[key]; exists {
			return nestedValue, true
		}
	}
	return nil, false
}
