package asset

import (
	"context"
	"crypto/rand"
	"crypto/sha1"
	"encoding/hex"
	"fmt"
	"strings"
	"time"

	workspacemodel "github.com/dever-package/bot/model/workspace"
)

const (
	assetSaveLockTTL           = 2 * time.Minute
	assetSaveLockRetryInterval = 80 * time.Millisecond
	assetSaveLockWaitTimeout   = 5 * time.Second
)

func withAssetSaveLock[T any](ctx context.Context, req SaveVersionRequest, run func() (T, error)) (T, error) {
	var zero T
	if ctx == nil {
		ctx = context.Background()
	}
	lockKey := assetSaveLockKey(req)
	if lockKey == "" {
		return run()
	}
	owner := newAssetSaveLockOwner()
	release, err := acquireAssetSaveLock(ctx, req.ProjectID, lockKey, owner)
	if err != nil {
		return zero, err
	}
	defer release()
	return run()
}

func acquireAssetSaveLock(ctx context.Context, projectID uint64, lockKey string, owner string) (func(), error) {
	deadline := time.Now().Add(assetSaveLockWaitTimeout)
	for {
		if claimAssetSaveLockOnce(ctx, projectID, lockKey, owner) {
			return func() {
				releaseAssetSaveLock(context.Background(), lockKey, owner)
			}, nil
		}
		if time.Now().After(deadline) {
			return nil, fmt.Errorf("资产版本正在保存，请稍后重试")
		}
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		case <-time.After(assetSaveLockRetryInterval):
		}
	}
}

func claimAssetSaveLockOnce(ctx context.Context, projectID uint64, lockKey string, owner string) bool {
	model := workspacemodel.NewAssetLockModel()
	now := time.Now()
	expiresAt := now.Add(assetSaveLockTTL)
	if row := model.Find(ctx, map[string]any{"lock_key": lockKey}); row != nil {
		return claimAssetSaveLock(ctx, row, projectID, owner, expiresAt, now)
	}
	if tryInsertAssetSaveLock(ctx, projectID, lockKey, owner, expiresAt, now) {
		return true
	}
	return claimAssetSaveLock(ctx, model.Find(ctx, map[string]any{"lock_key": lockKey}), projectID, owner, expiresAt, now)
}

func claimAssetSaveLock(ctx context.Context, row *workspacemodel.AssetLock, projectID uint64, owner string, expiresAt time.Time, now time.Time) bool {
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

func tryInsertAssetSaveLock(ctx context.Context, projectID uint64, lockKey string, owner string, expiresAt time.Time, now time.Time) (ok bool) {
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

func releaseAssetSaveLock(ctx context.Context, lockKey string, owner string) {
	workspacemodel.NewAssetLockModel().Delete(ctx, map[string]any{
		"lock_key": lockKey,
		"owner":    owner,
	})
}

func assetSaveLockKey(req SaveVersionRequest) string {
	if (req.ProjectID == 0 && req.BodyID == 0) || strings.TrimSpace(req.Name) == "" {
		return ""
	}
	parts := []string{
		"asset_save",
		fmt.Sprintf("project:%d", req.ProjectID),
		fmt.Sprintf("body:%d", req.BodyID),
		fmt.Sprintf("team:%d", req.TeamID),
		fmt.Sprintf("flow:%d", req.FlowID),
		fmt.Sprintf("cate:%d", req.AssetCateID),
		"role:" + strings.TrimSpace(req.Role),
		"name:" + strings.TrimSpace(req.Name),
	}
	sum := sha1.Sum([]byte(strings.Join(parts, "\x1f")))
	return "asset:" + hex.EncodeToString(sum[:])
}

func newAssetSaveLockOwner() string {
	buf := make([]byte, 8)
	if _, err := rand.Read(buf); err != nil {
		return fmt.Sprintf("bot-asset-%d", time.Now().UnixNano())
	}
	return "bot-asset-" + hex.EncodeToString(buf)
}
