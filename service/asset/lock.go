package asset

import (
	"context"
	"crypto/rand"
	"crypto/sha1"
	"encoding/hex"
	"fmt"
	"strings"
	"time"

	assetmodel "github.com/dever-package/bot/model/asset"
	workspacemodel "github.com/dever-package/bot/model/workspace"
	"github.com/dever-package/bot/service/internal/dbop"
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
	release, err := AcquireVersionLock(ctx, req.ProjectID, lockKey)
	if err != nil {
		return zero, err
	}
	defer release()
	return run()
}

// AcquireVersionLock serializes version creation for an asset identity. Both
// direct asset saves and workspace saves use this path so their timeout and
// conflict behavior cannot drift apart.
func AcquireVersionLock(ctx context.Context, projectID uint64, lockKey string) (func(), error) {
	if ctx == nil {
		ctx = context.Background()
	}
	owner := newAssetSaveLockOwner()
	deadline := time.Now().Add(assetSaveLockWaitTimeout)
	for {
		claimed, err := claimAssetSaveLockOnce(ctx, projectID, lockKey, owner)
		if err != nil {
			return nil, err
		}
		if claimed {
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

func claimAssetSaveLockOnce(ctx context.Context, projectID uint64, lockKey string, owner string) (bool, error) {
	model := workspacemodel.NewAssetLockModel()
	now := time.Now()
	expiresAt := now.Add(assetSaveLockTTL)
	if row := model.Find(ctx, map[string]any{"lock_key": lockKey}); row != nil {
		return claimAssetSaveLock(ctx, row, projectID, owner, expiresAt, now), nil
	}
	inserted, insertErr := dbop.Insert(func() int64 {
		return model.Insert(ctx, map[string]any{
			"project_id": projectID,
			"lock_key":   lockKey,
			"owner":      owner,
			"expires_at": expiresAt,
			"created_at": now,
			"updated_at": now,
		})
	})
	if insertErr == nil && inserted > 0 {
		return true, nil
	}
	row := model.Find(ctx, map[string]any{"lock_key": lockKey})
	if row == nil {
		if insertErr != nil {
			return false, fmt.Errorf("创建资产版本锁失败: %w", insertErr)
		}
		return false, fmt.Errorf("创建资产版本锁失败")
	}
	return claimAssetSaveLock(ctx, row, projectID, owner, expiresAt, now), nil
}

func claimAssetSaveLock(ctx context.Context, row *workspacemodel.AssetLock, projectID uint64, owner string, expiresAt time.Time, now time.Time) bool {
	if row == nil || row.ProjectID != projectID {
		return false
	}
	filters := map[string]any{
		"id":         row.ID,
		"project_id": projectID,
	}
	if row.Owner == owner {
		filters["owner"] = owner
	} else {
		if row.ExpiresAt.After(now) {
			return false
		}
		filters["expires_at"] = map[string]any{"lte": now}
	}
	return workspacemodel.NewAssetLockModel().Update(ctx, filters, map[string]any{
		"owner":      owner,
		"expires_at": expiresAt,
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
	if req.ProjectID == 0 && req.BodyID == 0 {
		return ""
	}
	identity := "name:" + strings.TrimSpace(req.Name)
	if nodeKey := strings.TrimSpace(req.NodeKey); nodeKey != "" {
		identity = "node:" + nodeKey
	} else if strings.TrimSpace(req.Name) == "" {
		return ""
	}
	kindScope := "asset"
	if req.Kind == assetmodel.KindCollection {
		kindScope = "collection"
	}
	parts := []string{
		"asset_save",
		fmt.Sprintf("asset:%d", req.AssetID),
		fmt.Sprintf("user:%d", req.UserID),
		fmt.Sprintf("project:%d", req.ProjectID),
		fmt.Sprintf("body:%d", req.BodyID),
		fmt.Sprintf("team:%d", req.TeamID),
		fmt.Sprintf("flow:%d", req.FlowID),
		fmt.Sprintf("cate:%d", req.AssetCateID),
		"source_type:" + strings.TrimSpace(req.SourceType),
		fmt.Sprintf("source_id:%d", req.SourceID),
		"role:" + strings.TrimSpace(req.Role),
		"kind_scope:" + kindScope,
		identity,
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
