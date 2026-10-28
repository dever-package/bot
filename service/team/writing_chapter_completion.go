package team

import (
	"context"
	"fmt"
	"strconv"
	"strings"
	"time"

	teammodel "github.com/dever-package/bot/model/team"
)

// 只有上游正常完成并经服务端校验的前缀才能减少下一次请求数量。
// complete 仅表示流中收到完整 JSON，不能代替 accepted_count。
func writingAcceptedChapters(checkpoint writingCheckpoint) []WritingUnitEntry {
	draft := checkpoint.Draft
	if !writingChapterDraftPhase(checkpoint) || draft == nil ||
		draft.AcceptedCount <= 0 || draft.AcceptedCount >= checkpoint.Count ||
		draft.AcceptedCount > len(draft.Units) || draft.ExpectedCount != checkpoint.Count {
		return nil
	}
	return append([]WritingUnitEntry{}, draft.Units[:draft.AcceptedCount]...)
}

func writingChapterCandidate(work WritingDocument, checkpoint writingCheckpoint, candidate map[string]any) ([]WritingUnitEntry, error) {
	if len(candidate) != 1 || candidate["units"] == nil {
		return nil, fmt.Errorf("章纲结果只允许章节目录")
	}
	units, err := decodeWritingChapterUnits(candidate["units"])
	if err != nil {
		return nil, err
	}
	units = append(writingAcceptedChapters(checkpoint), units...)
	if len(units) > checkpoint.Count {
		return nil, writingChapterCountError(checkpoint.Count, len(units))
	}
	if err := validateWritingDraftUnits(work, checkpoint, units); err != nil {
		return nil, err
	}
	return units, nil
}

// 不改变目录或作品 revision，只消费已成功返回的子请求；下一循环只补剩余章纲。
func (s Service) acceptWritingChapterPrefix(ctx context.Context, run teammodel.Run, baseline writingSnapshot, checkpoint writingCheckpoint, units []WritingUnitEntry) (writingSnapshot, error) {
	return s.withWritingWrite(ctx, baseline.Asset.ProjectID, baseline.Asset.CanvasID, baseline.Asset.ID, func(tx context.Context, current *writingSnapshot) error {
		if err := s.fenceWritingChapterRequest(tx, run, baseline, checkpoint, *current); err != nil {
			return err
		}
		if len(units) <= len(writingAcceptedChapters(checkpoint)) || len(units) >= checkpoint.Count {
			return fmt.Errorf("章纲补齐没有有效进展")
		}
		if err := validateWritingDraftUnits(current.Work, checkpoint, units); err != nil {
			return err
		}
		latest := s.repo.FindRun(tx, run.ID)
		checkpoint.Draft = &writingStreamDraft{RunID: run.ID, RequestID: checkpoint.RequestID, Units: units, ExpectedCount: checkpoint.Count, Complete: true, AcceptedCount: len(units), UpdatedAt: time.Now().UTC().Format(time.RFC3339)}
		checkpoint.Issued = false
		checkpoint.CorrectionFeedback = ""
		checkpoint.CorrectionCandidate = nil
		if err := s.saveWritingCheckpoint(tx, *latest, checkpoint); err != nil {
			return err
		}
		latest = s.repo.FindRun(tx, run.ID)
		s.repo.UpdateRun(tx, run.ID, map[string]any{"output": jsonText(writingOutput(*current, *latest))})
		return nil
	})
}

// 复用行锁/租约，同时阻止同 Run 内旧子请求跨越检查点提交。
func (s Service) fenceWritingChapterRequest(ctx context.Context, run teammodel.Run, baseline writingSnapshot, checkpoint writingCheckpoint, current writingSnapshot) error {
	if err := fenceWritingRun(ctx, run.ID, teammodel.RunStatusRunning); err != nil {
		return err
	}
	if current.Work.ActiveRunID != run.ID || current.Version.ID != baseline.Version.ID || writingRevision(current.Version) != writingRevision(baseline.Version) {
		return fmt.Errorf("生成期间作品已被修改，已保留新编辑")
	}
	latest := s.repo.FindRun(ctx, run.ID)
	if latest == nil {
		return fmt.Errorf("运行不存在")
	}
	issued := writingCheckpointFor(*latest)
	if !issued.Issued || checkpoint.RequestID == "" || issued.RequestID != checkpoint.RequestID ||
		!sameWritingChapterBatch(issued, checkpoint) ||
		len(writingAcceptedChapters(issued)) != len(writingAcceptedChapters(checkpoint)) {
		return fmt.Errorf("章纲来源请求已失效")
	}
	return nil
}

func writingChapterPreviewFields(checkpoint writingCheckpoint, partial map[string]any) (map[string]any, string) {
	prefix := writingAcceptedChapters(checkpoint)
	fields := map[string]any{}
	for index, unit := range prefix {
		fields[fmt.Sprintf("units.%d.title", index)] = unit.Title
		fields[fmt.Sprintf("units.%d.plan", index)] = unit.Plan
	}
	offset := func(field string) string {
		parts := strings.Split(field, ".")
		if len(parts) == 3 && parts[0] == "units" {
			if index, err := strconv.Atoi(parts[1]); err == nil && index >= 0 {
				parts[1] = strconv.Itoa(index + len(prefix))
				return strings.Join(parts, ".")
			}
		}
		return field
	}
	for field, value := range mapValue(partial["fields"]) {
		fields[offset(field)] = value
	}
	active := offset(firstText(partial["active_field"]))
	if active == "" && len(prefix) > 0 {
		active = fmt.Sprintf("units.%d.plan", len(prefix)-1)
	}
	return fields, active
}

// 显式重试只能继承相同基线、范围和服务端确认过的前缀，旧失败草稿保持人工恢复。
func writingResumeChapterPrefix(work WritingDocument, prior teammodel.Run, checkpoint *writingCheckpoint) {
	previous := writingCheckpointFor(prior)
	prefix := writingAcceptedChapters(previous)
	if len(prefix) == 0 || (prior.Status != teammodel.RunStatusFail && prior.Status != teammodel.RunStatusCanceled) {
		return
	}
	if !sameWritingChapterBatch(previous, *checkpoint) || previous.Draft.RunID != prior.ID || previous.Draft.RequestID != previous.RequestID {
		return
	}
	if validateWritingDraftUnits(work, previous, prefix) != nil {
		return
	}
	draft := *previous.Draft
	draft.Units = prefix
	checkpoint.Draft = &draft
}

// 同一批次的范围与作品基线必须一起保持；只允许子请求身份变化。
func sameWritingChapterBatch(first, second writingCheckpoint) bool {
	return first.WorkAssetID == second.WorkAssetID && first.WorkVersionID == second.WorkVersionID &&
		first.WorkRevision == second.WorkRevision && first.Action == second.Action && first.Phase == second.Phase &&
		first.Count == second.Count && jsonText(first.UnitIDs) == jsonText(second.UnitIDs)
}

// 持久队列保持整批；模型每次只看到剩余修改目标和一次已确认计划。
func addWritingChapterCompletionContext(work WritingDocument, checkpoint writingCheckpoint, input map[string]any) error {
	if prefix := writingAcceptedChapters(checkpoint); len(prefix) > 0 {
		offset := len(prefix)
		remaining := checkpoint.Count - offset
		confirmed := make([]unitIdentity, len(prefix))
		for i, chapter := range prefix {
			number := i + 1
			if checkpoint.Action == "append" {
				number += len(work.Units)
			}
			if len(checkpoint.UnitIDs) > 0 {
				position, err := work.unitIndex(checkpoint.UnitIDs[i])
				if err != nil {
					return err
				}
				number = position + 1
			}
			confirmed[i] = writingUnitIdentityNumber(chapter, number)
		}
		input["confirmed_chapters"] = confirmed
		input["confirmed_chapter_semantics"] = "本批已经确认的章纲计划；不是已发生的正文事实。仅承接这些计划，不能重复输出或改写。"
		input["count"] = remaining
		if len(checkpoint.UnitIDs) > 0 {
			input["target_unit_ids"] = checkpoint.UnitIDs[offset:]
		}
		batch := mapValue(input["batch"])
		start := intValue(batch["start"], 1) + offset
		if len(checkpoint.UnitIDs) > 0 {
			position, err := work.unitIndex(checkpoint.UnitIDs[offset])
			if err != nil {
				return err
			}
			start = position + 1
		}
		batch["start"], batch["count"] = start, remaining
		input["batch"] = batch
		if checkpoint.Action == "append" {
			input["next_number"] = start
		}
	}
	return nil
}
