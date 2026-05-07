package task

import (
	"context"
	"time"

	botprotocol "my/package/bot/service/energon/protocol"
	botprovider "my/package/bot/service/energon/provider"
)

type Job struct {
	RequestID string
	Method    string
	Host      string
	Path      string
	Headers   map[string]string
	Body      map[string]any
}

type Handler interface {
	HandleTask(ctx context.Context, job Job) error
}

type HandlerFunc func(ctx context.Context, job Job) error

func (fn HandlerFunc) HandleTask(ctx context.Context, job Job) error {
	return fn(ctx, job)
}

type ProgressWriter func(output botprotocol.Output) error

type StreamKind string

const (
	StreamKindRequest StreamKind = "request"
	StreamKindPolling StreamKind = "polling"
)

type StreamTaskSpec struct {
	Kind             StreamKind
	OutputType       string
	StartText        string
	DoneText         string
	CreatedText      string
	RunningText      string
	StartProgress    int
	DoneProgress     int
	EstimateProgress bool
	PlainRequest     bool
	EstimateMax      int
	MaxAttempts      int
	PollInterval     time.Duration
}

type TaskState string

const (
	TaskStatePending   TaskState = "pending"
	TaskStateRunning   TaskState = "running"
	TaskStateSucceeded TaskState = "succeeded"
	TaskStateFailed    TaskState = "failed"
)

type TaskStatus struct {
	State   TaskState
	Label   string
	Message string
}

type StreamTaskAdapter interface {
	StreamTaskSpec(input botprotocol.NativeInput) (StreamTaskSpec, bool)
}

type CancelSupportAdapter interface {
	SupportsCancel(input botprotocol.NativeInput) bool
}

type RemoteCancelAdapter interface {
	CancelTask(ctx context.Context, input botprotocol.NativeInput, taskID string, client botprovider.Client) error
}

type PollingAdapter interface {
	ParseTaskID(input botprotocol.NativeInput, resp *botprovider.Response) (string, error)
	BuildPollRequest(input botprotocol.NativeInput, taskID string) (botprovider.Request, error)
	ParseTaskStatus(input botprotocol.NativeInput, resp *botprovider.Response) (TaskStatus, error)
}

type StreamJob struct {
	Input          botprotocol.NativeInput
	Adapter        botprotocol.Adapter
	Client         botprovider.Client
	Request        botprovider.Request
	Write          ProgressWriter
	RegisterCancel func(func(context.Context) error)
}

type ResponseJob struct {
	Input    botprotocol.NativeInput
	Adapter  botprotocol.Adapter
	Client   botprovider.Client
	Response *botprovider.Response
}

type StreamResult struct {
	Response *botprovider.Response
	Data     any
	Handled  bool
}
