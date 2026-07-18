package skill

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sync"
	"syscall"
	"time"
)

func Lock(ctx context.Context, key string) (func(), error) {
	key = NormalizeKey(key)
	if key == "" {
		return nil, fmt.Errorf("技能标识不能为空")
	}
	lockDir := filepath.Join(Root, ".locks")
	if !IsSafePath(lockDir) {
		return nil, fmt.Errorf("技能锁目录不安全")
	}
	if err := os.MkdirAll(lockDir, 0o755); err != nil {
		return nil, err
	}
	file, err := os.OpenFile(filepath.Join(lockDir, key+".lock"), os.O_CREATE|os.O_RDWR, 0o600)
	if err != nil {
		return nil, err
	}

	ticker := time.NewTicker(100 * time.Millisecond)
	defer ticker.Stop()
	for {
		err = syscall.Flock(int(file.Fd()), syscall.LOCK_EX|syscall.LOCK_NB)
		if err == nil {
			var once sync.Once
			return func() {
				once.Do(func() {
					_ = syscall.Flock(int(file.Fd()), syscall.LOCK_UN)
					_ = file.Close()
				})
			}, nil
		}
		if !errors.Is(err, syscall.EWOULDBLOCK) && !errors.Is(err, syscall.EAGAIN) {
			_ = file.Close()
			return nil, err
		}
		select {
		case <-ctx.Done():
			_ = file.Close()
			return nil, ctx.Err()
		case <-ticker.C:
		}
	}
}
