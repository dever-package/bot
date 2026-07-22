package project

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	assetmodel "github.com/dever-package/bot/model/asset"
	energonmodel "github.com/dever-package/bot/model/energon"
	energonservice "github.com/dever-package/bot/service/energon"
)

const (
	canvasNodeTitlePromptLimit = 800
	canvasNodeTitleOutputLimit = 1400
	canvasNodeTitleTimeout     = 20 * time.Second
)

var canvasNodeTitleGateway = energonservice.NewGatewayService()

type CanvasNodeTitleRequest struct {
	ProjectID uint64
	NodeKey   string
	VersionID uint64
	Prompt    string
}

func (s WorkspaceService) GenerateCanvasNodeTitle(ctx context.Context, req CanvasNodeTitleRequest) (map[string]any, error) {
	if req.ProjectID == 0 {
		return nil, fmt.Errorf("项目不能为空")
	}
	nodeKey := strings.TrimSpace(req.NodeKey)
	if nodeKey == "" {
		return nil, fmt.Errorf("节点不能为空")
	}
	if _, err := requireProject(ctx, req.ProjectID); err != nil {
		return nil, err
	}
	asset := assetmodel.NewAssetModel().Find(ctx, map[string]any{
		"project_id": req.ProjectID,
		"node_key":   nodeKey,
		"role":       assetmodel.RoleMaterial,
		"kind":       map[string]any{"neq": assetmodel.KindCollection},
		"status":     assetmodel.StatusCurrent,
	})
	if asset == nil || asset.VersionID == 0 {
		return nil, fmt.Errorf("节点尚未生成可命名的素材")
	}
	if req.VersionID > 0 && asset.VersionID != req.VersionID {
		return nil, fmt.Errorf("节点结果已更新")
	}
	version := s.project.asset.FindVersion(ctx, asset.VersionID)
	if version == nil || version.AssetID != asset.ID {
		return nil, fmt.Errorf("节点素材版本不存在")
	}
	titleCtx, cancel := context.WithTimeout(ctx, canvasNodeTitleTimeout)
	defer cancel()
	title, err := canvasNodeTitleGateway.GenerateShortTitle(titleCtx, energonservice.ShortTitleRequest{
		PowerID:  energonmodel.DefaultLLMPowerID,
		Role:     canvasNodeTitleRole(),
		Source:   canvasNodeTitleSource(asset.Kind, req.Prompt, version.Content),
		MaxRunes: 16,
	})
	if err != nil {
		return nil, err
	}
	return map[string]any{
		"node_key":   nodeKey,
		"version_id": version.ID,
		"title":      title,
	}, nil
}

func canvasNodeTitleRole() string {
	return strings.Join([]string{
		"你是画布节点标题生成器。",
		"根据节点类型、用户提示词和生成结果生成简短中文标题。",
		"要求：6到16个汉字；准确概括内容；不要标点；不要解释。",
		"只输出标题文本。",
	}, "\n")
}

func canvasNodeTitleSource(kind string, prompt string, rawOutput string) string {
	parts := []string{"节点类型：" + canvasNodeKindName(kind)}
	if prompt = limitCanvasNodeTitleText(prompt, canvasNodeTitlePromptLimit); prompt != "" {
		parts = append(parts, "用户提示词："+prompt)
	}
	if output := canvasNodeTitleOutput(kind, rawOutput); output != "" {
		parts = append(parts, "生成结果："+output)
	}
	return strings.Join(parts, "\n")
}

func canvasNodeTitleOutput(kind string, raw string) string {
	kind = strings.ToLower(strings.TrimSpace(kind))
	if kind == assetmodel.KindImage || kind == assetmodel.KindVideo || kind == assetmodel.KindAudio {
		return ""
	}
	value := jsonValue(raw, strings.TrimSpace(raw))
	if encoded, err := json.Marshal(value); err == nil {
		return limitCanvasNodeTitleText(string(encoded), canvasNodeTitleOutputLimit)
	}
	return limitCanvasNodeTitleText(raw, canvasNodeTitleOutputLimit)
}

func canvasNodeKindName(kind string) string {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case assetmodel.KindImage:
		return "图片"
	case assetmodel.KindVideo:
		return "视频"
	case assetmodel.KindAudio:
		return "音频"
	case assetmodel.KindFile:
		return "文件"
	case assetmodel.KindRichText:
		return "图文"
	default:
		return "文本"
	}
}

func limitCanvasNodeTitleText(value string, limit int) string {
	value = strings.TrimSpace(value)
	if value == "" || limit <= 0 {
		return value
	}
	runes := []rune(value)
	if len(runes) > limit {
		return string(runes[:limit])
	}
	return value
}
