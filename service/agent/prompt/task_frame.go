package prompt

import "strings"

func taskFramePrompt(frame TaskFrameRuntime) string {
	frame = normalizeTaskFrameRuntime(frame)
	if isEmptyTaskFrame(frame) {
		return ""
	}
	lines := []string{"任务理解:"}
	appendTaskFrameLine(&lines, "目标", frame.Goal)
	appendTaskFrameLine(&lines, "交付物", frame.Deliverable)
	appendTaskFrameList(&lines, "已知输入", frame.Inputs)
	appendTaskFrameList(&lines, "明确限制", frame.Constraints)
	appendTaskFrameList(&lines, "不要扩展", frame.NonGoals)
	appendTaskFrameList(&lines, "阻塞缺失", frame.Missing)
	appendTaskFrameLine(&lines, "输出模式", frame.OutputMode)
	appendTaskFrameList(&lines, "完成标准", frame.SuccessCriteria)
	if len(frame.Missing) > 0 {
		lines = append(lines, "- 执行策略: 先用 agent-interaction 只收集阻塞缺失信息；不要猜测关键事实。")
	} else {
		lines = append(lines, "- 执行策略: 按上述目标直接推进；不要新增用户没有要求的范围。")
	}
	return strings.Join(lines, "\n")
}

func normalizeTaskFrameRuntime(frame TaskFrameRuntime) TaskFrameRuntime {
	return TaskFrameRuntime{
		Goal:            truncatePromptText(frame.Goal, 240),
		Deliverable:     truncatePromptText(frame.Deliverable, 180),
		Constraints:     compactTaskFrameValues(frame.Constraints),
		Inputs:          compactTaskFrameValues(frame.Inputs),
		Missing:         compactTaskFrameValues(frame.Missing),
		NonGoals:        compactTaskFrameValues(frame.NonGoals),
		OutputMode:      truncatePromptText(frame.OutputMode, 40),
		SuccessCriteria: compactTaskFrameValues(frame.SuccessCriteria),
	}
}

func compactTaskFrameValues(values []string) []string {
	result := make([]string, 0, len(values))
	seen := map[string]struct{}{}
	for _, value := range values {
		value = truncatePromptText(value, 160)
		if value == "" {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
		if len(result) >= 6 {
			break
		}
	}
	return result
}

func isEmptyTaskFrame(frame TaskFrameRuntime) bool {
	return frame.Goal == "" &&
		frame.Deliverable == "" &&
		len(frame.Constraints) == 0 &&
		len(frame.Inputs) == 0 &&
		len(frame.Missing) == 0 &&
		len(frame.NonGoals) == 0 &&
		frame.OutputMode == "" &&
		len(frame.SuccessCriteria) == 0
}

func appendTaskFrameLine(lines *[]string, label string, value string) {
	value = strings.TrimSpace(value)
	if value == "" {
		return
	}
	*lines = append(*lines, "- "+label+": "+value)
}

func appendTaskFrameList(lines *[]string, label string, values []string) {
	values = compactTaskFrameValues(values)
	if len(values) == 0 {
		return
	}
	*lines = append(*lines, "- "+label+": "+strings.Join(values, "；"))
}
