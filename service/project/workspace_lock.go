package project

import (
	"context"
	"crypto/sha1"
	"encoding/hex"
	"fmt"
	"os"
	"strings"
	"time"

	workspacemodel "github.com/dever-package/bot/model/workspace"
	assetservice "github.com/dever-package/bot/service/asset"
	"github.com/dever-package/bot/service/internal/dbop"
	"github.com/dever-package/bot/service/internal/keylock"
)

const (
	workspaceRunLockTTL = workspaceRunLeaseDuration
)

var workspaceRunLockOwner = newWorkspaceRunLockOwner()
var workspaceRunLocalLocks keylock.Locker[uint64]

func withWorkspaceRunLock[T any](ctx context.Context, projectID uint64, runID uint64, run func() (T, error)) (T, error) {
	var zero T
	if projectID == 0 || runID == 0 {
		return run()
	}
	releaseLocal := workspaceRunLocalLocks.Lock(runID)
	defer releaseLocal()
	claimed, err := acquireWorkspaceRunLock(ctx, projectID, runID)
	if err != nil {
		return zero, err
	}
	if !claimed {
		return zero, fmt.Errorf("画布运行中，请稍后刷新")
	}
	defer releaseWorkspaceRunLock(context.Background(), runID)
	return run()
}

func withWorkspaceAssetLock[T any](ctx context.Context, projectID uint64, parts []string, run func() (T, error)) (T, error) {
	var zero T
	lockKey := workspaceAssetLockKey(projectID, parts)
	if projectID == 0 || lockKey == "" {
		return run()
	}
	release, err := assetservice.AcquireVersionLock(ctx, projectID, lockKey)
	if err != nil {
		return zero, err
	}
	defer release()
	return run()
}

func acquireWorkspaceRunLock(ctx context.Context, projectID uint64, runID uint64) (bool, error) {
	model := workspacemodel.NewRunLockModel()
	now := time.Now()
	expiresAt := now.Add(workspaceRunLockTTL)
	if row := model.Find(ctx, map[string]any{"run_id": runID}); row != nil {
		return claimWorkspaceRunLock(ctx, row, projectID, expiresAt, now), nil
	}
	inserted, insertErr := dbop.Insert(func() int64 {
		return model.Insert(ctx, map[string]any{
			"project_id": projectID,
			"run_id":     runID,
			"owner":      workspaceRunLockOwner,
			"expires_at": expiresAt,
			"created_at": now,
			"updated_at": now,
		})
	})
	if insertErr == nil && inserted > 0 {
		return true, nil
	}
	row := model.Find(ctx, map[string]any{"run_id": runID})
	if row == nil {
		if insertErr != nil {
			return false, fmt.Errorf("创建画布运行锁失败: %w", insertErr)
		}
		return false, fmt.Errorf("创建画布运行锁失败")
	}
	return claimWorkspaceRunLock(ctx, row, projectID, expiresAt, now), nil
}

func claimWorkspaceRunLock(ctx context.Context, row *workspacemodel.RunLock, projectID uint64, expiresAt time.Time, now time.Time) bool {
	if row == nil || row.ProjectID != projectID {
		return false
	}
	filters := map[string]any{
		"id":         row.ID,
		"project_id": projectID,
	}
	if row.Owner == workspaceRunLockOwner {
		filters["owner"] = workspaceRunLockOwner
	} else {
		if row.ExpiresAt.After(now) {
			return false
		}
		filters["expires_at"] = map[string]any{"lte": now}
	}
	return workspacemodel.NewRunLockModel().Update(ctx, filters, map[string]any{
		"owner":      workspaceRunLockOwner,
		"expires_at": expiresAt,
		"updated_at": now,
	}) > 0
}

func releaseWorkspaceRunLock(ctx context.Context, runID uint64) {
	workspacemodel.NewRunLockModel().Delete(ctx, map[string]any{
		"run_id": runID,
		"owner":  workspaceRunLockOwner,
	})
}

func renewWorkspaceRunLock(ctx context.Context, runID uint64, now time.Time) {
	if runID == 0 {
		return
	}
	workspacemodel.NewRunLockModel().Update(ctx, map[string]any{
		"run_id": runID,
		"owner":  workspaceRunLockOwner,
	}, map[string]any{
		"expires_at": now.Add(workspaceRunLockTTL),
		"updated_at": now,
	})
}

func workspaceAssetLockKey(projectID uint64, parts []string) string {
	clean := []string{fmt.Sprintf("%d", projectID)}
	for _, part := range parts {
		if value := strings.TrimSpace(part); value != "" {
			clean = append(clean, value)
		}
	}
	if len(clean) == 1 {
		return ""
	}
	sum := sha1.Sum([]byte(strings.Join(clean, "\x1f")))
	return hex.EncodeToString(sum[:])
}

func newWorkspaceRunLockOwner() string {
	host, _ := os.Hostname()
	host = strings.TrimSpace(host)
	if host == "" {
		host = "unknown"
	}
	return fmt.Sprintf("%s:%d:%d", host, os.Getpid(), time.Now().UnixNano())
}
