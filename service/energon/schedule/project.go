package schedule

import (
	"context"
	"sync"

	"github.com/shemic/dever/config"
)

var projectBroker struct {
	sync.Once
	broker *Broker
	err    error
}

type brokerKey struct{}

func WithBroker(ctx context.Context, broker *Broker) context.Context {
	return context.WithValue(ctx, brokerKey{}, broker)
}
func ProjectBroker(ctx context.Context) (*Broker, error) {
	if broker, ok := ctx.Value(brokerKey{}).(*Broker); ok {
		return broker, nil
	}
	projectBroker.Do(func() {
		cfg, err := config.Load("")
		if err != nil {
			projectBroker.err = err
			return
		}
		projectBroker.broker, projectBroker.err = NewBroker(cfg.Redis)
	})
	return projectBroker.broker, projectBroker.err
}
