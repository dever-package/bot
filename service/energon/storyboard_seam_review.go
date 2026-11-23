package energon

import (
	"context"
	"fmt"
	"slices"
	"strings"

	botprocessor "github.com/dever-package/bot/service/energon/processor"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const storyboardSeamReviewTool = "submit_storyboard_cut"

const storyboardSeamReviewRole = "你判断两个已生成的视频片段的实际切点。第一张是上一镜末段，第二张是下一镜开头。每行三格，先左到右，再从上到下，忽略未列时点的空格。分镜计划不是观察证据。先尝试不裁剪的切点。只在有具体可见问题时，从允许格号中改选能接住动作或视线的切点；被弃用的画面不能包含剧情必要的动作或反应。续拍要承接运动方向和阶段；换机位可以改变构图，不能重演动作、移动道具或跳过反应。不因正常出画或视角变化判失败。看不清关键事实就报 unobservable。模型没有收到声音；不得声称听过声音或判对白通过。必须给出实际看到的依据。"

func (s GatewayService) ReviewStoryboardSeam(ctx context.Context, requestID, plan string, tail, head botprocessor.VideoReviewEdge, billing botprotocol.BillingContext) (float64, float64, error) {
	power, err := ResolveDefaultGeneralTextPower(ctx)
	if err != nil {
		return 0, 0, fmt.Errorf("无法核验相邻镜头：%w", err)
	}
	var prompt strings.Builder
	for index, edge := range []botprocessor.VideoReviewEdge{tail, head} {
		baseline := len(edge.Sheet.SampleTimes)
		if index == 1 {
			baseline = 1
		}
		fmt.Fprintf(&prompt, "第 %d 图：不裁剪是第 %d 格，允许选择的格号为 %v。各格对应素材时刻：", index+1, baseline, edge.SafeCuts)
		for frame, stamp := range edge.Sheet.SampleTimes {
			fmt.Fprintf(&prompt, " %d=%.3f秒", frame+1, stamp)
		}
		fmt.Fprintln(&prompt)
	}
	fmt.Fprintln(&prompt, "以下是分镜计划，用于比对动作阶段，不是观察结果：")
	prompt.WriteString(plan)
	fields := map[string]any{
		"status":   map[string]any{"type": "string", "enum": []string{"pass", "fail", "unobservable"}},
		"tail":     map[string]any{"type": "integer", "description": "通过时填第一图选中的格号，否则填 0"},
		"head":     map[string]any{"type": "integer", "description": "通过时填第二图选中的格号，否则填 0"},
		"evidence": map[string]any{"type": "string", "description": "实际可见的动作、视线或道具承接；失败时给出看到问题的图和格号"},
	}
	result, err := s.Invoke(ctx, GatewayRequest{
		RequestID: requestID,
		Billing:   billing,
		Body: map[string]any{
			"power": power.Key,
			"set":   map[string]any{"role": storyboardSeamReviewRole},
			"input": map[string]any{"prompt": prompt.String(), "images": []string{tail.Sheet.URL, head.Sheet.URL}},
			"options": map[string]any{
				"stream": false,
				"tools": []any{botprotocol.FunctionToolDefinition(storyboardSeamReviewTool, "提交相邻镜头的实际画面判定。", map[string]any{
					"type": "object", "properties": fields, "required": []string{"status", "tail", "head", "evidence"}, "additionalProperties": false,
				}, false)},
				"tool_choice":         botprotocol.ForcedFunctionToolChoice(storyboardSeamReviewTool),
				"parallel_tool_calls": false,
			},
		},
	}, InvokeOptions{})
	if err != nil {
		return 0, 0, fmt.Errorf("相邻镜头核验调用失败：%w", err)
	}
	return validateStoryboardSeamReview(result.Output, tail, head)
}

func validateStoryboardSeamReview(output botprotocol.Output, tail, head botprocessor.VideoReviewEdge) (float64, float64, error) {
	calls := botprotocol.ParseToolCalls(output["tool_calls"])
	if len(calls) != 1 || calls[0].Name != storyboardSeamReviewTool {
		return 0, 0, fmt.Errorf("相邻镜头核验未返回有效判定")
	}
	verdict, err := botprotocol.ToolCallArguments(calls[0])
	if err != nil {
		return 0, 0, fmt.Errorf("相邻镜头核验判定格式无效：%w", err)
	}
	evidence := requiredString(verdict, "evidence")
	left, leftOK := integerValue(verdict["tail"])
	right, rightOK := integerValue(verdict["head"])
	if evidence == "" || !leftOK || !rightOK {
		return 0, 0, fmt.Errorf("相邻镜头核验缺少画面依据或候选格号")
	}
	switch requiredString(verdict, "status") {
	case "pass":
		if slices.Contains(tail.SafeCuts, left) && slices.Contains(head.SafeCuts, right) {
			return tail.Sheet.SampleTimes[left-1], head.Sheet.SampleTimes[right-1], nil
		}
		return 0, 0, fmt.Errorf("相邻镜头核验选择了不可用切点，不能裁掉同期对白或有声动作")
	case "fail":
		return 0, 0, fmt.Errorf("相邻镜头没有安全切点：%s", evidence)
	case "unobservable":
		return 0, 0, fmt.Errorf("相邻镜头无法完成画面核验：%s", evidence)
	}
	return 0, 0, fmt.Errorf("相邻镜头核验判定无效")
}
