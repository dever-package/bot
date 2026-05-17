package runtime

import (
	"context"
	"strings"
	"sync"
	"time"

	botmodel "my/package/bot/model/energon"
	botprotocol "my/package/bot/service/energon/protocol"
)

const (
	runtimeProgressInterval = time.Second
	runtimeProgressMax      = 95
	runtimeProgressDone     = 100
)

type ProgressTracker struct {
	ctx        context.Context
	cancel     context.CancelFunc
	done       chan struct{}
	stopped    chan struct{}
	once       sync.Once
	avg        int64
	startedAt  time.Time
	running    string
	completed  string
	write      func(botprotocol.Output) error
	lastOutput int
}

func StartProgress(
	ctx context.Context,
	service botmodel.Service,
	power botmodel.Power,
	write func(botprotocol.Output) error,
) (*ProgressTracker, error) {
	if write == nil {
		return nil, nil
	}
	startedAt := time.Now()
	trackerCtx, cancel := context.WithCancel(ctx)
	tracker := &ProgressTracker{
		ctx:        trackerCtx,
		cancel:     cancel,
		done:       make(chan struct{}),
		stopped:    make(chan struct{}),
		avg:        Average(ctx, service.ID),
		startedAt:  startedAt,
		running:    runtimeProgressText(service, power, false),
		completed:  runtimeProgressText(service, power, true),
		write:      write,
		lastOutput: -1,
	}
	if err := tracker.writeStatus(tracker.running); err != nil {
		tracker.Stop()
		return nil, err
	}
	if tracker.avg > 0 {
		go tracker.run()
	} else {
		close(tracker.stopped)
	}
	return tracker, nil
}

func (t *ProgressTracker) run() {
	defer close(t.stopped)
	ticker := time.NewTicker(runtimeProgressInterval)
	defer ticker.Stop()
	for {
		select {
		case <-t.ctx.Done():
			return
		case <-t.done:
			return
		case now := <-ticker.C:
			t.writeEstimatedProgress(now)
		}
	}
}

func (t *ProgressTracker) Complete() error {
	if t == nil {
		return nil
	}
	var err error
	t.once.Do(func() {
		close(t.done)
		t.cancel()
		<-t.stopped
		err = t.writeProgress(runtimeProgressDone, t.completed)
	})
	return err
}

func (t *ProgressTracker) Stop() {
	if t == nil {
		return
	}
	t.once.Do(func() {
		close(t.done)
		t.cancel()
		<-t.stopped
	})
}

func (t *ProgressTracker) writeEstimatedProgress(now time.Time) {
	progress := runtimeProgressByAverage(t.startedAt, now, t.avg)
	if progress <= 0 || progress == t.lastOutput {
		return
	}
	_ = t.writeProgress(progress, t.running)
}

func (t *ProgressTracker) writeProgress(progress int, text string) error {
	if t == nil || t.write == nil {
		return nil
	}
	t.lastOutput = progress
	return t.write(botprotocol.Output{
		"event":    "status",
		"text":     strings.TrimSpace(text),
		"progress": progress,
	})
}

func (t *ProgressTracker) writeStatus(text string) error {
	if t == nil || t.write == nil {
		return nil
	}
	return t.write(botprotocol.Output{
		"event": "status",
		"text":  strings.TrimSpace(text),
	})
}

func runtimeProgressByAverage(startedAt time.Time, now time.Time, avgMS int64) int {
	if avgMS <= 0 || startedAt.IsZero() || !now.After(startedAt) {
		return 0
	}
	progress := int(now.Sub(startedAt).Milliseconds() * 100 / avgMS)
	if progress <= 0 {
		return 0
	}
	if progress > runtimeProgressMax {
		return runtimeProgressMax
	}
	return progress
}

func runtimeProgressText(service botmodel.Service, power botmodel.Power, done bool) string {
	label := botprotocol.MediaOutputLabel(service.Type, power.Kind)
	if done {
		return label + "生成完成"
	}
	return label + "生成中，请稍后"
}
