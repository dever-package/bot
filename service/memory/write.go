package memory

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"

	memorymodel "github.com/dever-package/bot/model/memory"
)

const (
	memoryTitleLimit   = 255
	memoryContentLimit = 4000
	memoryTagCount     = 16
	memoryTagLimit     = 48
)

func prepareMemoryFields(title string, content string, tags []string) (string, string, []string, error) {
	title = limitMemoryText(title, memoryTitleLimit)
	content = limitMemoryText(content, memoryContentLimit)
	tags = normalizeMemoryTags(tags)
	if memoryFieldsContainSensitiveData(title, content, tags) {
		return title, content, tags, fmt.Errorf("记忆内容包含敏感凭证，无法保存")
	}
	return title, content, tags, nil
}

func memoryFieldsContainSensitiveData(title string, content string, tags []string) bool {
	parts := make([]string, 0, len(tags)+2)
	parts = append(parts, title, content)
	parts = append(parts, tags...)
	return hasSensitiveMemoryContent(strings.Join(parts, "\n"))
}

func storedMemoryTags(value string) []string {
	var tags []string
	if err := json.Unmarshal([]byte(strings.TrimSpace(value)), &tags); err != nil {
		return []string{}
	}
	return normalizeMemoryTags(tags)
}

func memoryDedupeKey(owner memoryOwner, scope string, values map[string]any, key string, title string, content string) *string {
	identity := strings.TrimSpace(key)
	if identity != "" {
		identity = "key:" + identity
	} else {
		comparable := comparableMemoryContent(title, content)
		if comparable == "" {
			return nil
		}
		identity = "content:" + comparable
	}
	return hashMemoryIdentity(
		owner.OwnerType,
		strconv.FormatUint(owner.OwnerID, 10),
		scope,
		strings.TrimSpace(fmt.Sprint(values["agent_key"])),
		strings.TrimSpace(fmt.Sprint(values["context_key"])),
		strings.TrimSpace(fmt.Sprint(values["session_id"])),
		identity,
	)
}

func sourceMemoryDedupeKey(request SaveRequest, title string, content string) *string {
	identity := ""
	switch {
	case request.AssetID > 0 && request.VersionID > 0:
		identity = fmt.Sprintf("asset:%d:version:%d", request.AssetID, request.VersionID)
	case request.RunID > 0 && request.NodeRunID > 0:
		identity = fmt.Sprintf("run:%d:node:%d", request.RunID, request.NodeRunID)
	default:
		comparable := comparableMemoryContent(title, content)
		if comparable == "" {
			return nil
		}
		identity = "content:" + comparable
	}
	return hashMemoryIdentity(request.OwnerType, strconv.FormatUint(request.OwnerID, 10), identity)
}

func comparableMemoryContent(title string, content string) string {
	if comparable := NormalizeComparableText(content); comparable != "" {
		return comparable
	}
	return NormalizeComparableText(title)
}

func hashMemoryIdentity(parts ...string) *string {
	digest := sha256.Sum256([]byte(strings.Join(parts, "\x1f")))
	value := hex.EncodeToString(digest[:])
	return &value
}

func memoryDedupeColumn(value *string) any {
	if value == nil {
		return nil
	}
	return strings.TrimSpace(*value)
}

func findMemoryByDedupeKey(ctx context.Context, dedupeKey *string) *memorymodel.Memory {
	if dedupeKey == nil || strings.TrimSpace(*dedupeKey) == "" {
		return nil
	}
	return memorymodel.NewMemoryModel().Find(ctx, map[string]any{"dedupe_key": strings.TrimSpace(*dedupeKey)})
}

func findMemoryBySource(ctx context.Context, request SaveRequest) *memorymodel.Memory {
	filter := map[string]any{
		"owner_type": strings.TrimSpace(request.OwnerType),
		"owner_id":   request.OwnerID,
	}
	switch {
	case request.AssetID > 0 && request.VersionID > 0:
		filter["asset_id"] = request.AssetID
		filter["version_id"] = request.VersionID
	case request.RunID > 0 && request.NodeRunID > 0:
		filter["run_id"] = request.RunID
		filter["node_run_id"] = request.NodeRunID
	default:
		return nil
	}
	return memorymodel.NewMemoryModel().Find(ctx, filter)
}

func insertMemoryRecord(ctx context.Context, record map[string]any) (id uint64, err error) {
	defer memoryMutationError("新增", &err)
	id = uint64(memorymodel.NewMemoryModel().Insert(ctx, record))
	return id, nil
}

func updateMemoryRecord(ctx context.Context, id uint64, values map[string]any) (affected int64, err error) {
	defer memoryMutationError("更新", &err)
	affected = memorymodel.NewMemoryModel().Update(ctx, map[string]any{"id": id}, values)
	return affected, nil
}

func deleteMemoryRecord(ctx context.Context, id uint64) (affected int64, err error) {
	defer memoryMutationError("删除", &err)
	affected = memorymodel.NewMemoryModel().Delete(ctx, map[string]any{"id": id})
	return affected, nil
}

func memoryMutationError(action string, target *error) {
	if recovered := recover(); recovered != nil {
		*target = fmt.Errorf("%s记忆失败: %v", action, recovered)
	}
}
