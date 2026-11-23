package energon

import (
	"context"
	"fmt"
	"strings"

	botprocessor "github.com/dever-package/bot/service/energon/processor"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const storyboardVideoReviewTool = "submit_shot_review"

type StoryboardVideoReviewFailure struct {
	Seconds  float64
	Evidence string
}

func (failure *StoryboardVideoReviewFailure) Error() string {
	return fmt.Sprintf("镜头连续性未通过（约 %.2f 秒）：%s", failure.Seconds, failure.Evidence)
}

const storyboardVideoReviewRole = "你核验的是已生成的短剧镜头，不是分镜稿或参考图。按顺序逐格查看所有实际画面，再提交观察结果。对照起止状态、场内位置、动作顺序及没有安排变化的道具：端点正确也不能放过中途重复开关、重演已完成动作、没有过渡的换位或少演关键动作。检查分镜中剧情所需的可见反应，例如视线先落到刚推来的物件再看向对方；不要用表演偏好打分。只指出可见且影响叙事的错误；不能把正常运镜、出画或遮挡误判成动作，不审核声音。pass 表示观察到要求的关键表现且无此类错误，fail 必须指出实际可见的错误所在页、格和具体变化。若没有收到画面，或重要动作不可辨而无法判断，返回 unobservable。不要复述计划来假装看到画面。"

func (s GatewayService) ReviewStoryboardVideo(ctx context.Context, requestID, plan, videoURL string, requireSpeech bool, billing botprotocol.BillingContext) error {
	power, err := ResolveDefaultGeneralTextPower(ctx)
	if err != nil {
		return fmt.Errorf("无法核验镜头：%w", err)
	}
	sheets, err := botprocessor.ExtractVideoReviewSheets(ctx, videoURL, requestID, requireSpeech)
	if err != nil {
		return fmt.Errorf("无法完成镜头素材核验：%w", err)
	}
	images := make([]string, 0, len(sheets))
	var prompt strings.Builder
	fmt.Fprintln(&prompt, "下列图片是视频成品抽帧，不是目标图。每页按从左到右、从上到下每行三格读取；未列出时点的空格忽略。")
	for index, sheet := range sheets {
		images = append(images, sheet.URL)
		fmt.Fprintf(&prompt, "第 %d 页的各格时点（末格为实际尾帧）：", index+1)
		for frame, seconds := range sheet.SampleTimes {
			fmt.Fprintf(&prompt, " %d=%.2f秒", frame+1, seconds)
		}
		fmt.Fprintln(&prompt)
	}
	fmt.Fprintln(&prompt, "用于对照的分镜计划（不是观察记录）：")
	prompt.WriteString(plan)
	schema := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"status":   map[string]any{"type": "string", "enum": []string{"pass", "fail", "unobservable"}},
			"evidence": map[string]any{"type": "string", "description": "用中文写画面中实际看到的动作或无法观察的原因，不照抄分镜"},
			"sheet":    map[string]any{"type": "integer", "description": "失败所在页，非失败填 0"},
			"frame":    map[string]any{"type": "integer", "description": "失败所在格，非失败填 0"},
		},
		"required":             []string{"status", "evidence", "sheet", "frame"},
		"additionalProperties": false,
	}
	result, err := s.Invoke(ctx, GatewayRequest{
		RequestID: requestID,
		Billing:   billing,
		Body: map[string]any{
			"power": power.Key,
			"set":   map[string]any{"role": storyboardVideoReviewRole},
			"input": map[string]any{"prompt": prompt.String(), "images": images},
			"options": map[string]any{
				"stream":              false,
				"tools":               []any{botprotocol.FunctionToolDefinition(storyboardVideoReviewTool, "提交真实画面的连续性核验结果。", schema, false)},
				"tool_choice":         botprotocol.ForcedFunctionToolChoice(storyboardVideoReviewTool),
				"parallel_tool_calls": false,
			},
		},
	}, InvokeOptions{})
	if err != nil {
		return fmt.Errorf("镜头核验调用失败：%w", err)
	}
	return validateStoryboardVideoReview(result.Output, sheets)
}

func validateStoryboardVideoReview(output botprotocol.Output, sheets []botprocessor.VideoReviewSheet) error {
	calls := botprotocol.ParseToolCalls(output["tool_calls"])
	if len(calls) != 1 || calls[0].Name != storyboardVideoReviewTool {
		return fmt.Errorf("镜头核验未返回有效的画面判定")
	}
	verdict, err := botprotocol.ToolCallArguments(calls[0])
	if err != nil {
		return fmt.Errorf("镜头核验判定格式无效：%w", err)
	}
	evidence := requiredString(verdict, "evidence")
	sheet, validSheet := integerValue(verdict["sheet"])
	frame, validFrame := integerValue(verdict["frame"])
	if evidence == "" || !validSheet || !validFrame {
		return fmt.Errorf("镜头核验缺少实际画面证据")
	}
	switch requiredString(verdict, "status") {
	case "pass":
		if sheet == 0 && frame == 0 {
			return nil
		}
	case "fail":
		if sheet > 0 && sheet <= len(sheets) && frame > 0 && frame <= len(sheets[sheet-1].SampleTimes) {
			return &StoryboardVideoReviewFailure{Seconds: sheets[sheet-1].SampleTimes[frame-1], Evidence: evidence}
		}
	case "unobservable":
		return fmt.Errorf("镜头无法完成连续性核验：%s", evidence)
	}
	return fmt.Errorf("镜头核验的结果与采样位置不符")
}
