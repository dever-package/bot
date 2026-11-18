package worker

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
)

func Run(ctx context.Context, handler http.Handler) error {
	settings, err := LoadConfig()
	if err != nil {
		return err
	}
	listener, closeListener, err := listen(settings)
	if err != nil {
		return err
	}
	defer closeListener()
	server := &http.Server{Handler: health(handler)}
	ctx, cancel := context.WithCancel(ctx)
	defer cancel()
	serverDone := make(chan error, 1)
	go func() {
		err := server.Serve(listener)
		if errors.Is(err, http.ErrServerClosed) {
			err = nil
		}
		serverDone <- err
		cancel()
	}()
	shutdown := Start(ctx)
	slog.Info("Bot Worker 已启动")
	lifecycle.Lock()
	stopped := lifecycle.current.ctx.Done()
	lifecycle.Unlock()
	<-stopped
	slog.Info("Bot Worker 停止领取新任务，等待已受理任务完成")
	drain, stopDrain := context.WithTimeout(context.Background(), settings.ShutdownTimeout.Duration())
	defer stopDrain()
	err = shutdown(drain)
	err = errors.Join(err, server.Shutdown(drain))
	if err != nil {
		server.Close()
	}
	err = errors.Join(err, <-serverDone)
	slog.Info("Bot Worker 已退出", "error", err)
	return err
}
