package artifact

import (
	"context"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

type repository struct{}

func (repository) nextDisplayNo(ctx context.Context, sessionID uint64, kind string) int {
	rows := agentmodel.NewArtifactModel().Select(ctx, map[string]any{
		"session_id": sessionID,
		"kind":       strings.TrimSpace(kind),
	}, map[string]any{"order": "main.display_no desc,main.id desc", "limit": 1})
	if len(rows) == 0 || rows[0] == nil {
		return 1
	}
	return rows[0].DisplayNo + 1
}

func (repository) create(ctx context.Context, values map[string]any) (agentmodel.Artifact, error) {
	id := uint64(agentmodel.NewArtifactModel().Insert(ctx, values))
	if id == 0 {
		return agentmodel.Artifact{}, fmt.Errorf("创建会话素材失败")
	}
	row := agentmodel.NewArtifactModel().Find(ctx, map[string]any{"id": id})
	if row == nil {
		return agentmodel.Artifact{}, fmt.Errorf("读取会话素材失败")
	}
	return *row, nil
}

func (repository) update(ctx context.Context, id uint64, values map[string]any) agentmodel.Artifact {
	if id == 0 {
		return agentmodel.Artifact{}
	}
	values["updated_at"] = time.Now()
	agentmodel.NewArtifactModel().Update(ctx, map[string]any{"id": id}, values)
	row := agentmodel.NewArtifactModel().Find(ctx, map[string]any{"id": id})
	if row == nil {
		return agentmodel.Artifact{}
	}
	return *row
}

func (repository) find(ctx context.Context, id uint64) *agentmodel.Artifact {
	if id == 0 {
		return nil
	}
	return agentmodel.NewArtifactModel().Find(ctx, map[string]any{"id": id})
}

func (repository) byMessage(ctx context.Context, messageID uint64) []agentmodel.Artifact {
	if messageID == 0 {
		return []agentmodel.Artifact{}
	}
	rows := agentmodel.NewArtifactModel().Select(ctx, map[string]any{"message_id": messageID}, map[string]any{
		"order": "main.id asc",
	})
	result := make([]agentmodel.Artifact, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}

func (repository) byMessages(ctx context.Context, messageIDs []uint64) []agentmodel.Artifact {
	messageIDs = uniqueIDs(messageIDs)
	if len(messageIDs) == 0 {
		return []agentmodel.Artifact{}
	}
	rows := agentmodel.NewArtifactModel().Select(ctx, map[string]any{"message_id": messageIDs}, map[string]any{
		"order": "main.message_id asc,main.id asc",
	})
	result := make([]agentmodel.Artifact, 0, len(rows))
	for _, row := range rows {
		if row != nil {
			result = append(result, *row)
		}
	}
	return result
}
