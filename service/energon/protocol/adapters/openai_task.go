package adapters

import (
	"context"
	"fmt"
	"net/http"
	"net/url"
	"strings"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	bottask "github.com/dever-package/bot/service/energon/task"
)

func openAITaskIDKey(input botprotocol.NativeInput) string {
	if strings.HasSuffix(openAIVideoPath(input), "/videos/generations") {
		return "request_id"
	}
	return "id"
}

func (OpenAIAdapter) ParseTaskID(input botprotocol.NativeInput, resp *botprovider.Response) (string, error) {
	key := openAITaskIDKey(input)
	taskID, _ := valueFromMap(resp.Body, key).(string)
	taskID = strings.TrimSpace(taskID)
	if taskID == "" {
		return "", &botprotocol.ContentResultError{Cause: fmt.Errorf("OpenAI 任务提交结果缺少有效的 %s，未自动重新提交", key)}
	}
	return taskID, nil
}

func (OpenAIAdapter) BuildPollRequest(input botprotocol.NativeInput, taskID string) (botprovider.Request, error) {
	endpoint, err := openAITaskURL(input, taskID)
	if err != nil {
		return botprovider.Request{}, err
	}
	return botprovider.Request{
		URL: endpoint.String(), Method: http.MethodGet,
		Headers: botprovider.AuthHeaders(input.Account.Key),
	}, nil
}

func openAITaskURL(input botprotocol.NativeInput, taskID string) (*url.URL, error) {
	endpoint, err := url.Parse(botprovider.JoinURL(input.Provider.Host, input.Service.Path))
	if err != nil {
		return nil, fmt.Errorf("OpenAI 任务查询接口路径无效: %w", err)
	}
	escapedPath := strings.TrimRight(endpoint.EscapedPath(), "/")
	path := strings.TrimRight(endpoint.Path, "/")
	if openAITaskIDKey(input) == "request_id" {
		escapedPath = escapedPath[:strings.LastIndex(escapedPath, "/")]
		path = strings.TrimSuffix(path, "/generations")
	}
	endpoint.RawPath = escapedPath + "/" + url.PathEscape(taskID)
	endpoint.Path = path + "/" + taskID
	return endpoint, nil
}

func (OpenAIAdapter) ParseTaskStatus(input botprotocol.NativeInput, resp *botprovider.Response) (bottask.TaskStatus, error) {
	if isOpenAIImageTask(input) {
		return parseOpenAIImageTaskStatus(resp.Body)
	}
	return parseOpenAIVideoTaskStatus(input, resp.Body)
}

func (OpenAIAdapter) ResolveTaskResult(ctx context.Context, input botprotocol.NativeInput, taskID string, response *botprovider.Response, client botprovider.Client) (any, error) {
	if isOpenAIImageTask(input) {
		return resolveOpenAIImageTaskResult(input, taskID, response.Body)
	}
	return resolveOpenAIVideoTaskResult(ctx, input, taskID, response, client)
}

func (OpenAIAdapter) WrapTaskError(taskID string, err error) error {
	if err == nil || taskID == "" || botprotocol.PreventsReplay(err) {
		return err
	}
	return &botprotocol.ContentResultError{Cause: fmt.Errorf("OpenAI 媒体任务 %s 已提交，未自动重新生成: %w", taskID, err)}
}
