package adapters

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	bottask "github.com/dever-package/bot/service/energon/task"
)

func (adapter ComfyUIAdapter) LookupSubmission(ctx context.Context, input botprotocol.NativeInput, client botprovider.Client) (string, error) {
	expected, err := adapter.BuildNativeRequest(input)
	if err != nil {
		return "", err
	}
	expectedPrompt, _ := json.Marshal(expected.Body["prompt"])
	match := func(value any) (string, error) {
		prompt := botprotocol.NormalizeAnyList(value)
		if len(prompt) < 4 {
			return "", fmt.Errorf("ComfyUI 队列回执结构无效")
		}
		extra := botprotocol.NormalizeMap(prompt[3])
		if botprotocol.AsText(extra["client_id"]) != input.Request.RequestID {
			return "", nil
		}
		actualPrompt, err := json.Marshal(prompt[2])
		if err != nil {
			return "", err
		}
		if string(actualPrompt) != string(expectedPrompt) {
			return "", fmt.Errorf("原 ComfyUI 请求身份对应的工作流已改变，禁止重复提交")
		}
		return botprotocol.AsText(prompt[1]), nil
	}
	for _, endpoint := range []string{"/queue", "/history?max_items=256"} {
		request, err := comfyRequest(input, endpoint, http.MethodGet)
		if err != nil {
			return "", err
		}
		response, err := client.Do(ctx, request)
		if err != nil {
			return "", err
		}
		if response.StatusCode != http.StatusOK {
			return "", fmt.Errorf("查询 ComfyUI 原任务失败: HTTP %d", response.StatusCode)
		}
		payload := botprotocol.NormalizeMap(response.Body)
		if endpoint == "/queue" {
			for _, key := range []string{"queue_running", "queue_pending"} {
				for _, row := range botprotocol.NormalizeAnyList(payload[key]) {
					id, err := match(row)
					if err != nil || id != "" {
						return id, err
					}
				}
			}
		} else {
			for _, row := range payload {
				entry := botprotocol.NormalizeMap(row)
				id, err := match(entry["prompt"])
				if err != nil || id != "" {
					return id, err
				}
			}
		}
	}
	return "", nil
}

func (ComfyUIAdapter) QueryQueueStatus(ctx context.Context, input botprotocol.NativeInput, taskID string, client botprovider.Client) (bottask.TaskStatus, error) {
	request, err := comfyRequest(input, "/queue", http.MethodGet)
	if err != nil {
		return bottask.TaskStatus{}, err
	}
	response, err := client.Do(ctx, request)
	if err != nil {
		return bottask.TaskStatus{}, err
	}
	if response.StatusCode != http.StatusOK {
		return bottask.TaskStatus{}, fmt.Errorf("查询 ComfyUI 队列失败: HTTP %d", response.StatusCode)
	}
	payload := botprotocol.NormalizeMap(response.Body)
	running := botprotocol.NormalizeAnyList(payload["queue_running"])
	for _, value := range running {
		row := botprotocol.NormalizeAnyList(value)
		if len(row) > 1 && botprotocol.AsText(row[1]) == taskID {
			return bottask.TaskStatus{State: bottask.TaskStateRunning, Label: "正在生成"}, nil
		}
	}
	for index, value := range botprotocol.NormalizeAnyList(payload["queue_pending"]) {
		row := botprotocol.NormalizeAnyList(value)
		if len(row) > 1 && botprotocol.AsText(row[1]) == taskID {
			position := index + len(running)
			return bottask.TaskStatus{State: bottask.TaskStatePending, Label: fmt.Sprintf("排队中，前方 %d 个任务", position), QueuePosition: position + 1}, nil
		}
	}
	return bottask.TaskStatus{State: bottask.TaskStatePending, Label: "正在等待生成结果"}, nil
}
