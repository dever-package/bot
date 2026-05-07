package task

import (
	"context"
	"fmt"
)

type Queue interface {
	Push(ctx context.Context, job Job) error
}

type CancelableQueue interface {
	Cancel(ctx context.Context, requestID string) bool
}

type Service struct {
	queue Queue
}

func NewService(queue Queue) Service {
	return Service{queue: queue}
}

func (s Service) Submit(ctx context.Context, job Job) error {
	if s.queue == nil {
		return fmt.Errorf("任务队列未初始化")
	}
	return s.queue.Push(ctx, job)
}

func (s Service) Cancel(ctx context.Context, requestID string) bool {
	queue, ok := s.queue.(CancelableQueue)
	if !ok {
		return false
	}
	return queue.Cancel(ctx, requestID)
}
