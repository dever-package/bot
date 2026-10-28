package team

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strings"

	energonservice "github.com/dever-package/bot/service/energon"
)

const writingRunKey = "_writing"

const (
	writingBodyBatchDefault  = 10
	writingBodyBatchLimit    = 100
	writingChapterBatchLimit = energonservice.WritingChapterBatchLimit
)

type WritingDocument struct {
	Type                  string               `json:"type"`
	SchemaVersion         int                  `json:"schema_version"`
	Title                 string               `json:"title"`
	Inspirations          []WritingInspiration `json:"inspirations"`
	SelectedInspirationID string               `json:"selected_inspiration_id"`
	Outline               WritingOutline       `json:"outline"`
	Preferences           WritingPreferences   `json:"preferences"`
	Units                 []WritingUnitEntry   `json:"units"`
	ArchivedUnits         []WritingUnitEntry   `json:"archived_units"`
	Status                string               `json:"status"`
	ActiveRunID           uint64               `json:"active_run_id"`
	ActiveRequestID       string               `json:"active_request_id"`
}
type WritingInspiration struct {
	ID      string `json:"id"`
	Title   string `json:"title"`
	Content string `json:"content"`
}

type WritingEntity struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}
type WritingEntities struct {
	Characters []WritingEntity `json:"characters"`
	Locations  []WritingEntity `json:"locations"`
	Props      []WritingEntity `json:"props"`
}
type WritingOutline struct {
	Overview string `json:"overview"`
	World    string `json:"world"`
	WritingEntities
}

type WritingUnitEntry struct {
	ID                 string                  `json:"id"`
	UnitType           string                  `json:"unit_type"`
	Title              string                  `json:"title"`
	Plan               string                  `json:"plan"`
	PlanStale          bool                    `json:"plan_stale,omitempty"`
	Children           []WritingUnitEntry      `json:"children"`
	AssetID            uint64                  `json:"asset_id"`
	VersionID          uint64                  `json:"version_id"`
	HasBody            bool                    `json:"has_body"`
	ContinuityValid    bool                    `json:"continuity_valid"`
	ContinuityIndex    *writingContinuityIndex `json:"continuity_index,omitempty"`
	ContinuityStatus   string                  `json:"continuity_status,omitempty"`
	ContinuityFindings []writingFinding        `json:"continuity_findings,omitempty"`
	DependencyStale    bool                    `json:"dependency_stale"`
}
type WritingUnit struct {
	Type                 string             `json:"type"`
	SchemaVersion        int                `json:"schema_version"`
	Profile              string             `json:"profile"`
	UnitID               string             `json:"unit_id"`
	Title                string             `json:"title"`
	Body                 string             `json:"body"`
	Synopsis             string             `json:"synopsis"`
	EndState             string             `json:"end_state"`
	OpenThreads          string             `json:"open_threads"`
	Ending               string             `json:"ending"`
	ContinuityValid      bool               `json:"continuity_valid"`
	PredecessorVersionID uint64             `json:"predecessor_version_id"`
	Continuity           *writingContinuity `json:"continuity,omitempty"`
}
type WritingCommand struct {
	ProjectID             uint64             `json:"project_id"`
	CanvasID              uint64             `json:"canvas_id"`
	WorkAssetID           uint64             `json:"work_asset_id"`
	ExpectedWorkVersionID uint64             `json:"expected_work_version_id"`
	ExpectedWorkRevision  *uint64            `json:"expected_work_revision"`
	Action                string             `json:"action"`
	InspirationID         string             `json:"inspiration_id"`
	SectionID             string             `json:"section_id"`
	EntityID              string             `json:"entity_id"`
	Document              *WritingDocument   `json:"document"`
	UnitID                string             `json:"unit_id"`
	ExpectedUnitVersionID uint64             `json:"expected_unit_version_id"`
	UnitIDs               []string           `json:"unit_ids"`
	Mode                  string             `json:"mode"`
	Body                  string             `json:"body"`
	Instruction           string             `json:"instruction"`
	SelectedText          string             `json:"selected_text"`
	Count                 int                `json:"count"`
	SourceWorkVersionID   uint64             `json:"source_work_version_id"`
	SourceRunID           uint64             `json:"source_run_id"`
	SourceRequestID       string             `json:"source_request_id"`
	Units                 []WritingUnitEntry `json:"units"`
}
type writingCheckpoint struct {
	CorrectionCount     int            `json:"correction_count,omitempty"`
	CorrectionFeedback  string         `json:"correction_feedback,omitempty"`
	CorrectionCandidate map[string]any `json:"correction_candidate,omitempty"`

	HistoryCompleted int                 `json:"history_completed,omitempty"`
	HistoryTotal     int                 `json:"history_total,omitempty"`
	PreviousRunID    uint64              `json:"previous_run_id"`
	Action           string              `json:"action"`
	Phase            string              `json:"phase,omitempty"`
	ContinuityUnitID string              `json:"continuity_unit_id,omitempty"`
	Draft            *writingStreamDraft `json:"draft,omitempty"`
	InspirationID    string              `json:"inspiration_id,omitempty"`
	SectionID        string              `json:"section_id"`
	EntityID         string              `json:"entity_id"`
	UnitID           string              `json:"unit_id"`
	UnitIDs          []string            `json:"unit_ids"`
	Completed        int                 `json:"completed"`
	Target           int                 `json:"target"`
	Issued           bool                `json:"issued"`
	WorkAssetID      uint64              `json:"work_asset_id"`
	WorkVersionID    uint64              `json:"work_version_id"`
	WorkRevision     uint64              `json:"work_revision"`
	RequestID        string              `json:"request_id"`
	Instruction      string              `json:"instruction"`
	Count            int                 `json:"count"`
	SelectedText     string              `json:"selected_text,omitempty"`
	Proposal         *writingProposal    `json:"proposal,omitempty"`
}

// 无目标的任务使用空列表；快照、运行记录和持久化沿用同一个 JSON 边界。
func (checkpoint writingCheckpoint) MarshalJSON() ([]byte, error) {
	type checkpointJSON writingCheckpoint
	if checkpoint.UnitIDs == nil {
		checkpoint.UnitIDs = []string{}
	}
	return json.Marshal(checkpointJSON(checkpoint))
}

// 所有命令、存储与历史读取使用当前文档合同，不静默丢弃已移除字段。
func (work *WritingDocument) UnmarshalJSON(raw []byte) error {
	type documentJSON WritingDocument
	var document documentJSON
	// 指针区分“尚未填写”与缺失/null，避免命令把旧形状写回当前资产。
	input := struct {
		*documentJSON
		Preferences *WritingPreferences `json:"preferences"`
		Outline     *struct {
			Overview   *string         `json:"overview"`
			World      *string         `json:"world"`
			Characters []WritingEntity `json:"characters"`
			Locations  []WritingEntity `json:"locations"`
			Props      []WritingEntity `json:"props"`
		} `json:"outline"`
	}{documentJSON: &document}
	decoder := json.NewDecoder(bytes.NewReader(raw))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&input); err != nil {
		return fmt.Errorf("故事文档字段无效: %w", err)
	}
	if input.Preferences == nil {
		return fmt.Errorf("故事文档缺少写作设定")
	}
	if input.Outline == nil || input.Outline.Overview == nil || input.Outline.World == nil || input.Outline.Characters == nil || input.Outline.Locations == nil || input.Outline.Props == nil {
		return fmt.Errorf("故事大纲须包含故事走向、环境、人物、地点与道具")
	}
	if document.Inspirations == nil || document.Units == nil || document.ArchivedUnits == nil {
		return fmt.Errorf("故事灵感与章节目录必须是数组")
	}
	document.Preferences = *input.Preferences
	document.Outline = WritingOutline{
		Overview: *input.Outline.Overview,
		World:    *input.Outline.World,
		WritingEntities: WritingEntities{
			Characters: input.Outline.Characters,
			Locations:  input.Outline.Locations,
			Props:      input.Outline.Props,
		},
	}
	*work = WritingDocument(document)
	return nil
}

func writingProfile(profile string) bool { return profile == "story" }
func newWritingDocument(profile, title string) WritingDocument {
	return WritingDocument{Type: profile, SchemaVersion: 1, Title: title, Status: "running", Inspirations: []WritingInspiration{}, Units: []WritingUnitEntry{}, ArchivedUnits: []WritingUnitEntry{}, Outline: WritingOutline{WritingEntities: WritingEntities{Characters: []WritingEntity{}, Locations: []WritingEntity{}, Props: []WritingEntity{}}}}
}
func decodeWritingDocument(raw string, target any) error {
	var envelope map[string]json.RawMessage
	if err := json.Unmarshal([]byte(raw), &envelope); err != nil {
		return fmt.Errorf("创作内容无效: %w", err)
	}
	if value, ok := envelope["json"]; ok {
		return json.Unmarshal(value, target)
	}
	return fmt.Errorf("创作资产缺少 json 内容")
}
func writingMap(value any) map[string]any {
	var result map[string]any
	encoded, _ := json.Marshal(value)
	_ = json.Unmarshal(encoded, &result)
	return result
}
func (work *WritingDocument) findUnit(id string) *WritingUnitEntry {
	for i := range work.Units {
		if work.Units[i].ID == id {
			return &work.Units[i]
		}
	}
	return nil
}
func (work *WritingDocument) unitIndex(id string) (int, error) {
	for i, unit := range work.Units {
		if unit.ID == id {
			return i, nil
		}
	}
	return -1, fmt.Errorf("章节不存在，目录可能已更新")
}
func (work *WritingDocument) invalidateAfter(index int) {
	for i := index + 1; i < len(work.Units); i++ {
		if work.Units[i].VersionID > 0 {
			work.Units[i].DependencyStale = true
			work.Units[i].ContinuityStatus = "pending"
		}
	}
}

// 作者改变已确认内容后，后续未写章纲需要重新确认；衔接派生保存不调用此方法。
func (work *WritingDocument) invalidatePlansAfter(index int) {
	for i := index + 1; i < len(work.Units); i++ {
		if !work.Units[i].HasBody {
			work.Units[i].PlanStale = true
		}
	}
}

func writingUnitQueue(work WritingDocument, command WritingCommand) ([]string, error) {
	selected := command.UnitIDs
	if command.Mode == "single" && len(selected) == 0 && command.UnitID != "" {
		selected = []string{command.UnitID}
	}
	switch command.Mode {
	case "continue":
		limit := command.Count
		if limit == 0 {
			limit = writingBodyBatchDefault
		}
		if limit < 1 || limit > writingBodyBatchLimit {
			return nil, fmt.Errorf("每次正文生成数量应为 1 到 %d", writingBodyBatchLimit)
		}
		selected = []string{}
		for _, unit := range work.Units {
			if unit.HasBody {
				if len(selected) > 0 {
					break
				}
				continue
			}
			selected = append(selected, unit.ID)
			if len(selected) == limit {
				break
			}
		}
	case "single":
		if len(selected) != 1 {
			return nil, fmt.Errorf("请选择一个章节")
		}
	case "range":
		if len(selected) == 0 {
			return nil, fmt.Errorf("请选择连续范围")
		}
		if len(selected) > writingBodyBatchLimit {
			return nil, fmt.Errorf("一次最多生成 %d 章正文，请缩小所选范围", writingBodyBatchLimit)
		}
	default:
		return nil, fmt.Errorf("正文生成范围无效")
	}
	queue := []string{}
	indices := make(map[string]int, len(work.Units))
	for index, unit := range work.Units {
		indices[unit.ID] = index
	}
	previousIndex := -1
	for _, id := range selected {
		index, exists := indices[id]
		if !exists {
			return nil, fmt.Errorf("章节不存在，目录可能已更新")
		}
		if previousIndex >= 0 {
			if index <= previousIndex {
				return nil, fmt.Errorf("请选择按目录顺序排列的连续范围")
			}
			// 检查点只保留待写章节，重试时允许跨过已有正文，不能漏掉未写章节。
			for skipped := previousIndex + 1; skipped < index; skipped++ {
				if !work.Units[skipped].HasBody {
					return nil, fmt.Errorf("请选择按目录顺序排列的连续范围")
				}
			}
		}
		previousIndex = index
		ref := work.Units[index]
		if strings.TrimSpace(ref.Title) == "" || strings.TrimSpace(ref.Plan) == "" {
			return nil, fmt.Errorf("请先填写章节标题和章纲")
		}
		if ref.HasBody {
			continue
		}
		if ref.PlanStale {
			return nil, fmt.Errorf("第%d章章纲待同步，请先同步后续剧情", index+1)
		}
		if len(queue) == 0 {
			if err := writingPredecessor(work, index); err != nil {
				return nil, err
			}
		}
		queue = append(queue, id)
	}
	if len(queue) == 0 {
		return nil, fmt.Errorf("所选范围已完成，请使用重写")
	}
	return queue, nil
}
func writingPredecessor(work WritingDocument, index int) error {
	if index == 0 {
		return nil
	}
	previous := work.Units[index-1]
	if !previous.HasBody {
		return fmt.Errorf("前置单元“%s”尚未生成，请从此前未完成单元继续", previous.Title)
	}
	return nil
}
func writingEnding(body, requested string) string {
	body = strings.TrimSpace(body)
	requested = strings.TrimSpace(requested)
	if requested != "" && strings.HasSuffix(body, requested) {
		return requested
	}
	runes := []rune(body)
	if len(runes) > 2000 {
		runes = runes[len(runes)-2000:]
	}
	return string(runes)
}
