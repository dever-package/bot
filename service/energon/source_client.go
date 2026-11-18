package energon

import (
	"context"
	"errors"
	"fmt"
	"strconv"
	"strings"
	"time"

	botprovider "github.com/dever-package/bot/service/energon/provider"
	bottask "github.com/dever-package/bot/service/energon/task"
)

// The same client is passed to protocol submission, polling, cancellation and
// authenticated result resolution. Only the leaf source context carries an account slot.
type sourceClient struct{ base botprovider.Client }

func (client sourceClient) Do(ctx context.Context, req botprovider.Request) (*botprovider.Response, error) {
	return client.request(ctx, req, nil)
}
func (client sourceClient) Stream(ctx context.Context, req botprovider.Request, handler func(botprovider.StreamChunk) error) (*botprovider.Response, error) {
	return client.request(ctx, req, handler)
}
func (client sourceClient) request(ctx context.Context, req botprovider.Request, handler func(botprovider.StreamChunk) error) (response *botprovider.Response, err error) {
	call, _ := ctx.Value(sourceCallKey{}).(*sourceCall)
	if call == nil {
		return client.send(ctx, req, handler)
	}
	operation := req.Operation
	if override := botprovider.Operation(ctx); override != "" {
		operation = override
	}
	if operation == "" {
		operation = "query"
		if req.BinaryResponse {
			operation = "download"
		}
	}
	req.Operation = operation
	for attempt := 0; ; attempt++ {
		if operation == "submit" && call.lease != nil {
			if verifyErr := call.lease.Verify(ctx); verifyErr != nil {
				return nil, call.rejectUnsent(ctx, verifyErr)
			}
		}
		response, err = client.send(ctx, req, handler)
		if wasNotSubmitted(err) {
			return response, call.rejectUnsent(ctx, err)
		}

		retry := explicitSourceBusy(response)
		guard, guarded := botprovider.SubmissionReplayGuard(ctx)
		if err != nil {
			var busy interface{ ErrorCode() string }
			retry = guarded && !guard.HasOutput() && errors.As(err, &busy) && busy.ErrorCode() == "provider_busy"
			if !retry {
				err = rememberSourceError(context.WithoutCancel(ctx), call.id, err)
				return response, &bottask.ExecutionHandoff{Cause: executionError(err)}
			}
		}
		if guarded && guard.HasOutput() {
			retry = false
		}
		if !retry || attempt >= 2 {
			if operation == "submit" && (response != nil && response.StatusCode < 400 && !call.async || knownSubmissionRejection(response) || retry) {
				if completeErr := call.complete(context.WithoutCancel(ctx)); completeErr != nil {
					return response, completeErr
				}
			}
			if operation == "submit" && response != nil && response.StatusCode >= 400 && !knownSubmissionRejection(response) {
				failure := newProviderStatusError(req.Method, req.URL, response)
				return response, &bottask.ExecutionHandoff{Cause: executionError(rememberSourceError(context.WithoutCancel(ctx), call.id, failure))}
			}
			return response, err
		}
		if guarded {
			guard.Reset()
		}

		delay := time.Duration(attempt+1) * 2 * time.Second
		if response != nil {
			if raw := response.Headers["Retry-After"]; raw != "" {
				if seconds, e := strconv.Atoi(strings.TrimSpace(raw)); e == nil && seconds > 0 {
					delay = time.Duration(seconds) * time.Second
				}
			}
		}
		if call.notify != nil {
			if notifyErr := call.notify(fmt.Sprintf("来源并发繁忙，%d 秒后重试（%d/2）", int(delay/time.Second), attempt+1)); notifyErr != nil {
				return response, notifyErr
			}
		}
		if delay > time.Minute {
			delay = time.Minute
		}
		timer := time.NewTimer(delay)
		select {
		case <-ctx.Done():
			timer.Stop()
			if operation == "submit" {
				return response, call.rejectUnsent(ctx, ctx.Err())
			}
			return response, ctx.Err()
		case <-timer.C:
		}
	}
}
func (client sourceClient) send(ctx context.Context, req botprovider.Request, handler func(botprovider.StreamChunk) error) (*botprovider.Response, error) {
	var checkpoint *bottask.ExecutionCheckpoint
	store := bottask.Store(ctx)
	call, _ := ctx.Value(sourceCallKey{}).(*sourceCall)
	if req.Operation == "submit" && call != nil && store != nil {
		var err error
		checkpoint, err = store.Load(ctx, call.id)
		if err != nil {
			return nil, err
		}
		if checkpoint.SubmissionResponse != nil {
			response := *checkpoint.SubmissionResponse
			return &response, nil
		}
	}
	if call != nil && req.Operation == "submit" && call.checkSubmit != nil {
		if err := call.checkSubmit(ctx); err != nil {
			return nil, &submissionNotSent{cause: err}
		}
	}
	if checkpoint != nil {
		if checkpoint.SubmissionDeadline.IsZero() {
			timeout := req.Timeout
			if timed, ok := client.base.(interface {
				RequestTimeout(botprovider.Request) time.Duration
			}); ok {
				timeout = timed.RequestTimeout(req)
			}
			if timeout <= 0 {
				timeout = defaultProviderHTTPTimeout
			}
			checkpoint.SubmissionDeadline = time.Now().Add(timeout)
			if checkpoint.Deadline.Before(checkpoint.SubmissionDeadline) {
				checkpoint.SubmissionDeadline = checkpoint.Deadline
			}
			if deadline, ok := ctx.Deadline(); ok && deadline.Before(checkpoint.SubmissionDeadline) {
				checkpoint.SubmissionDeadline = deadline
			}
			var saveErr error
			checkpoint, saveErr = store.Save(ctx, bottask.ExecutionChange{Checkpoint: *checkpoint})
			if saveErr != nil {
				return nil, &submissionNotSent{cause: saveErr}
			}
		}
		req.Timeout = time.Until(checkpoint.SubmissionDeadline)
		if req.Timeout <= 0 {
			return nil, &bottask.ExecutionHandoff{Cause: fmt.Errorf("原来源请求已到超时点，等待恢复处理")}
		}
	}
	var response *botprovider.Response
	var err error
	if handler != nil {
		stream, ok := client.base.(botprovider.StreamClient)
		if !ok {
			return nil, fmt.Errorf("来源客户端不支持流式请求")
		}
		response, err = stream.Stream(ctx, req, func(chunk botprovider.StreamChunk) error {
			if checkpoint != nil && !checkpoint.ResponseStarted {
				current, loadErr := store.Load(context.WithoutCancel(ctx), call.id)
				if loadErr != nil {
					return loadErr
				}
				current.ResponseStarted = true
				checkpoint, loadErr = store.Save(context.WithoutCancel(ctx), bottask.ExecutionChange{Checkpoint: *current, FactsOnly: true})
				if loadErr != nil {
					return loadErr
				}
			}
			return handler(chunk)
		})
	} else {
		response, err = client.base.Do(ctx, req)
	}
	if err != nil || checkpoint == nil || response == nil || response.StatusCode >= 400 || response.Body == nil {
		return response, err
	}
	// Binary payloads are staged by the existing media receipt path; their bytes
	// cannot be represented by Response's JSON checkpoint.
	if _, binary := botprovider.AsBinaryPayload(response.Body); binary {
		return response, nil
	}
	if _, binary := botprovider.AsBinaryMediaOutput(response.Body); binary {
		return response, nil
	}
	// A parent can be canceled while HTTP is in flight. Preserve its current
	// failure and ownership facts when attaching the late response.
	checkpoint, err = store.Load(context.WithoutCancel(ctx), call.id)
	if err != nil {
		return response, fmt.Errorf("读取来源提交回执失败: %w", err)
	}
	checkpoint.SubmissionResponse = &botprovider.Response{StatusCode: response.StatusCode, Headers: map[string]string{"Content-Type": response.Headers["Content-Type"]}, Body: response.Body}
	if _, err = store.Save(context.WithoutCancel(ctx), bottask.ExecutionChange{Checkpoint: *checkpoint, FactsOnly: true}); err != nil {
		return response, fmt.Errorf("保存来源提交响应失败: %w", err)
	}
	return response, nil
}
func explicitSourceBusy(resp *botprovider.Response) bool {
	if resp == nil || resp.StatusCode != 429 {
		return false
	}
	codes := []string{}
	collectProviderErrorCodes(resp.Body, &codes)
	for _, code := range codes {
		switch strings.ToLower(code) {
		case "gateway_concurrency_limit", "concurrency_limit_exceeded", "concurrent_limit_exceeded", "rate_limit_exceeded", "too_many_requests":
			return true
		}
	}
	return false
}
func knownSubmissionRejection(response *botprovider.Response) bool {
	if response == nil {
		return false
	}
	if response.StatusCode >= 400 && response.StatusCode < 500 && response.StatusCode != 408 && response.StatusCode != 409 {
		return true
	}
	if response.StatusCode == 503 {
		codes := []string{}
		collectProviderErrorCodes(response.Body, &codes)
		for _, code := range codes {
			// The media gateway rejects the request before dispatch when no
			// account is available. Other 5xx responses remain ambiguous.
			if code == "grok_media_no_eligible_account" {
				return true
			}
		}
	}
	return false
}
