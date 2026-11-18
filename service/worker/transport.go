package worker

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"syscall"
)

// The socket carries live observations and readiness only. Generation remains
// a durable database job; losing an HTTP connection never cancels that job.
func listen(config ProcessConfig) (net.Listener, func(), error) {
	if err := os.MkdirAll(filepath.Dir(config.SocketPath), 0700); err != nil {
		return nil, nil, err
	}
	lock, err := os.OpenFile(config.SocketPath+".lock", os.O_CREATE|os.O_RDWR, 0600)
	if err != nil {
		return nil, nil, err
	}
	if err := syscall.Flock(int(lock.Fd()), syscall.LOCK_EX|syscall.LOCK_NB); err != nil {
		lock.Close()
		return nil, nil, fmt.Errorf("Worker socket 已被其他进程持有: %w", err)
	}
	if info, err := os.Lstat(config.SocketPath); err == nil {
		if info.Mode()&os.ModeSocket == 0 {
			lock.Close()
			return nil, nil, fmt.Errorf("Worker socket 路径被普通文件占用")
		}
		if err := os.Remove(config.SocketPath); err != nil {
			lock.Close()
			return nil, nil, err
		}
	} else if !os.IsNotExist(err) {
		lock.Close()
		return nil, nil, err
	}
	listener, err := net.Listen("unix", config.SocketPath)
	if err != nil {
		lock.Close()
		return nil, nil, err
	}
	if err := os.Chmod(config.SocketPath, 0600); err != nil {
		listener.Close()
		lock.Close()
		return nil, nil, err
	}
	return listener, func() { listener.Close(); lock.Close() }, nil
}

func health(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path != "/health" {
			handler.ServeHTTP(w, r)
			return
		}
		lifecycle.Lock()
		ready := lifecycle.current != nil && !lifecycle.current.draining
		lifecycle.Unlock()
		w.Header().Set("Content-Type", "application/json")
		if !ready {
			w.WriteHeader(http.StatusServiceUnavailable)
		}
		_ = json.NewEncoder(w).Encode(map[string]any{"ready": ready, "pid": os.Getpid()})
	})
}

func Open(ctx context.Context, path string, query url.Values) (*http.Response, error) {
	config, err := LoadConfig()
	if err != nil {
		return nil, err
	}
	transport := &http.Transport{DisableKeepAlives: true, DialContext: func(ctx context.Context, _, _ string) (net.Conn, error) {
		return (&net.Dialer{}).DialContext(ctx, "unix", config.SocketPath)
	}}
	client := &http.Client{Transport: transport}
	endpoint := url.URL{Scheme: "http", Host: "worker", Path: path, RawQuery: query.Encode()}
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint.String(), nil)
	if err != nil {
		return nil, err
	}
	response, err := client.Do(request)
	if err != nil {
		var target *url.Error
		if errors.As(err, &target) {
			err = target.Err
		}
		return nil, fmt.Errorf("连接 Worker 失败: %w", err)
	}
	return response, nil
}
