package project

import (
	"context"
	"crypto/rand"
	"crypto/sha1"
	"encoding/hex"
	"fmt"
	"os"
	"strings"
	"time"

	workspacemodel "github.com/dever-package/bot/model/workspace"
)

const (
	workspaceRunLockTTL             = 2 * time.Minute
	workspaceAssetLockRetryInterval = 80 * time.Millisecond
	workspaceAssetLockWaitTimeout   = 5 * time.Second
)

var workspaceRunLockOwner = newWorkspaceRunLockOwner()

func withWorkspaceRunLock[T any](ctx context.Context, projectID uint64, runID uint64, run func() (T, error)) (T, error) {
	var zero T
	if projectID == 0 || runID == 0 {
		return run()
	}
	if !acquireWorkspaceRunLock(ctx, projectID, runID) {
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
	owner := newWorkspaceAssetLockOwner()
	release, err := acquireWorkspaceAssetLock(ctx, projectID, lockKey, owner)
	if err != nil {
		return zero, err
	}
	defer release()
	return run()
}

func acquireWorkspaceRunLock(ctx context.Context, projectID uint64, runID uint64) bool {
	model := workspacemodel.NewRunLockModel()
	now := time.Now()
	expiresAt := now.Add(workspaceRunLockTTL)
	if row := model.Find(ctx, map[string]any{"run_id": runID}); row != nil {
		return claimWorkspaceRunLock(ctx, row, projectID, expiresAt, now)
	}
	if tryInsertWorkspaceRunLock(ctx, projectID, runID, expiresAt, now) {
		return true
	}
	return claimWorkspaceRunLock(ctx, model.Find(ctx, map[string]any{"run_id": runID}), projectID, expiresAt, now)
}

func claimWorkspaceRunLock(ctx context.Context, row *workspacemodel.RunLock, projectID uint64, expiresAt time.Time, now time.Time) bool {
	if row == nil || row.ProjectID != projectID {
		return false
	}
	if row.Owner != workspaceRunLockOwner && row.ExpiresAt.After(now) {
		return false
	}
	return workspacemodel.NewRunLockModel().Update(ctx, map[string]any{"id": row.ID}, map[string]any{
		"owner":      workspaceRunLockOwner,
		"expires_at": expiresAt,
		"updated_at": now,
	}) > 0
}

func tryInsertWorkspaceRunLock(ctx context.Context, projectID uint64, runID uint64, expiresAt time.Time, now time.Time) (ok bool) {
	defer func() {
		if recover() != nil {
			ok = false
		}
	}()
	return workspacemodel.NewRunLockModel().Insert(ctx, map[string]any{
		"project_id": projectID,
		"run_id":     runID,
		"owner":      workspaceRunLockOwner,
		"expires_at": expiresAt,
		"created_at": now,
		"updated_at": now,
	}) > 0
}

func releaseWorkspaceRunLock(ctx context.Context, runID uint64) {
	workspacemodel.NewRunLockModel().Delete(ctx, map[string]any{
		"run_id": runID,
		"owner":  workspaceRunLockOwner,
	})
}

func acquireWorkspaceAssetLock(ctx context.Context, projectID uint64, lockKey string, owner string) (func(), error) {
	deadline := time.Now().Add(workspaceAssetLockWaitTimeout)
	for {
		if claimWorkspaceAssetLockOnce(ctx, projectID, lockKey, owner) {
			return func() {
				releaseWorkspaceAssetLock(context.Background(), lockKey, owner)
			}, nil
		}
		if time.Now().After(deadline) {
			return nil, fmt.Errorf("资产版本正在保存，请稍后重试")
		}
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		case <-time.After(workspaceAssetLockRetryInterval):
		}
	}
}

func claimWorkspaceAssetLockOnce(ctx context.Context, projectID uint64, lockKey string, owner string) bool {
	model := workspacemodel.NewAssetLockModel()
	now := time.Now()
	expiresAt := now.Add(workspaceRunLockTTL)
	if row := model.Find(ctx, map[string]any{"lock_key": lockKey}); row != nil {
		return claimWorkspaceAssetLock(ctx, row, projectID, owner, expiresAt, now)
	}
	if tryInsertWorkspaceAssetLock(ctx, projectID, lockKey, owner, expiresAt, now) {
		return true
	}
	return claimWorkspaceAssetLock(ctx, model.Find(ctx, map[string]any{"lock_key": lockKey}), projectID, owner, expiresAt, now)
}

func claimWorkspaceAssetLock(ctx context.Context, row *workspacemodel.AssetLock, projectID uint64, owner string, expiresAt time.Time, now time.Time) bool {
	if row == nil || row.ProjectID != projectID {
		return false
	}
	if row.Owner != owner && row.ExpiresAt.After(now) {
		return false
	}
	return workspacemodel.NewAssetLockModel().Update(ctx, map[string]any{"id": row.ID}, map[string]any{
		"owner":      owner,
		"expires_at": expiresAt,
		"updated_at": now,
	}) > 0
}

func tryInsertWorkspaceAssetLock(ctx context.Context, projectID uint64, lockKey string, owner string, expiresAt time.Time, now time.Time) (ok bool) {
	defer func() {
		if recover() != nil {
			ok = false
		}
	}()
	return workspacemodel.NewAssetLockModel().Insert(ctx, map[string]any{
		"project_id": projectID,
		"lock_key":   lockKey,
		"owner":      owner,
		"expires_at": expiresAt,
		"created_at": now,
		"updated_at": now,
	}) > 0
}

func releaseWorkspaceAssetLock(ctx context.Context, lockKey string, owner string) {
	workspacemodel.NewAssetLockModel().Delete(ctx, map[string]any{
		"lock_key": lockKey,
		"owner":    owner,
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

func newWorkspaceAssetLockOwner() string {
	buf := make([]byte, 8)
	if _, err := rand.Read(buf); err != nil {
		return fmt.Sprintf("bot-workspace-asset-%d", time.Now().UnixNano())
	}
	return fmt.Sprintf("bot-workspace-asset-%s", hex.EncodeToString(buf))
}
