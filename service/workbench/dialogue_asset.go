package workbench

import (
	"context"
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
	assetmodel "github.com/dever-package/bot/model/asset"
	runtimeartifact "github.com/dever-package/bot/service/agent/runtime/artifact"
	runtimechat "github.com/dever-package/bot/service/agent/runtime/chat"
	runtimedocument "github.com/dever-package/bot/service/agent/runtime/document"
)

type dialogueAssetProjection struct {
	Kind          string
	Content       any
	DefaultName   string
	RequestSuffix string
	NodeSuffix    string
	Source        map[string]any
}

func projectDialogueAsset(
	ctx context.Context,
	message runtimechat.CompletedAssistantMessage,
	artifactID uint64,
) (dialogueAssetProjection, error) {
	rows := runtimeartifact.NewService().ByMessage(ctx, message.ID)
	if artifactID > 0 {
		return projectSingleDialogueArtifact(ctx, message, rows, artifactID)
	}
	return projectWholeDialogueMessage(ctx, message, rows)
}

func projectSingleDialogueArtifact(
	ctx context.Context,
	message runtimechat.CompletedAssistantMessage,
	rows []agentmodel.Artifact,
	artifactID uint64,
) (dialogueAssetProjection, error) {
	for _, row := range rows {
		if row.ID != artifactID {
			continue
		}
		if row.MessageID != message.ID {
			break
		}
		if row.Status != agentmodel.ArtifactStatusReady {
			return dialogueAssetProjection{}, fmt.Errorf("只有已生成完成的素材可以保存")
		}
		payload := runtimeartifact.Payload(ctx, row)
		if dialogueArtifactStatus(payload) != "ready" || dialogueArtifactURL(payload) == "" {
			return dialogueAssetProjection{}, fmt.Errorf("素材文件尚未准备好")
		}
		kind := dialogueMaterialKind(row.Kind)
		if kind == "" {
			kind = assetmodel.KindFile
		}
		name := strings.TrimSpace(row.Name)
		if name == "" {
			name = strings.TrimSpace(fmt.Sprint(payload["label"]))
		}
		if name == "" {
			name = fmt.Sprintf("素材 %d", row.ID)
		}
		return dialogueAssetProjection{
			Kind:          kind,
			Content:       dialogueNativeArtifactContent(kind, payload),
			DefaultName:   name,
			RequestSuffix: fmt.Sprintf(":artifact:%d", row.ID),
			NodeSuffix:    fmt.Sprintf(":artifact:%d", row.ID),
			Source: map[string]any{
				"artifact_id": row.ID,
				"file_id":     row.FileID,
				"kind":        kind,
			},
		}, nil
	}
	return dialogueAssetProjection{}, fmt.Errorf("回复素材不存在")
}

func projectWholeDialogueMessage(
	ctx context.Context,
	message runtimechat.CompletedAssistantMessage,
	rows []agentmodel.Artifact,
) (dialogueAssetProjection, error) {
	if dialogueDocumentPending(message.Document) {
		return dialogueAssetProjection{}, fmt.Errorf("回复中的素材仍在生成，请完成后再保存")
	}
	ready := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if row.Status == agentmodel.ArtifactStatusGenerating {
			return dialogueAssetProjection{}, fmt.Errorf("回复中的素材仍在生成，请完成后再保存")
		}
		if row.Status != agentmodel.ArtifactStatusReady {
			continue
		}
		payload := runtimeartifact.Payload(ctx, row)
		if dialogueArtifactStatus(payload) == "ready" && dialogueArtifactURL(payload) != "" {
			ready = append(ready, payload)
		}
	}

	kind := wholeDialogueAssetKind(message, ready)
	content := any(dialogueMessageDocument(message, ready))
	if kind != assetmodel.KindText && kind != assetmodel.KindRichText && len(ready) == 1 {
		content = dialogueNativeArtifactContent(kind, ready[0])
	}
	return dialogueAssetProjection{
		Kind:          kind,
		Content:       content,
		DefaultName:   "",
		RequestSuffix: ":whole",
		Source: map[string]any{
			"artifact_ids": dialogueArtifactIDs(ready),
		},
	}, nil
}

func wholeDialogueAssetKind(
	message runtimechat.CompletedAssistantMessage,
	artifacts []map[string]any,
) string {
	if message.Document != nil {
		return assetmodel.KindRichText
	}
	if len(artifacts) == 0 {
		return assetmodel.KindText
	}
	if strings.TrimSpace(message.Text) != "" || len(artifacts) > 1 {
		return assetmodel.KindRichText
	}
	kind := dialogueMaterialKind(strings.TrimSpace(fmt.Sprint(artifacts[0]["kind"])))
	if kind == "" {
		return assetmodel.KindFile
	}
	return kind
}

func dialogueMessageDocument(
	message runtimechat.CompletedAssistantMessage,
	artifacts []map[string]any,
) map[string]any {
	nodes := make([]map[string]any, 0, len(artifacts)+2)
	usedArtifacts := map[uint64]bool{}
	if document, ok := message.Document.(runtimedocument.Payload); ok {
		if intro := strings.TrimSpace(fmt.Sprint(document.Meta["intro"])); intro != "" && intro != "<nil>" {
			nodes = append(nodes, dialogueTextNodes(intro)...)
		}
		if title := strings.TrimSpace(document.Title); title != "" {
			nodes = append(nodes, dialogueHeadingNode(title))
		}
		for _, block := range document.Blocks {
			if block.Type == agentmodel.DocumentBlockTypeText {
				nodes = append(nodes, dialogueTextNodes(block.Text)...)
				continue
			}
			for _, artifact := range block.Artifacts {
				if dialogueArtifactStatus(artifact) != "ready" || dialogueArtifactURL(artifact) == "" {
					continue
				}
				nodes = append(nodes, dialogueArtifactNode(artifact))
				usedArtifacts[dialogueArtifactID(artifact)] = true
			}
		}
	} else {
		nodes = append(nodes, dialogueTextNodes(message.Text)...)
	}
	for _, artifact := range artifacts {
		if !usedArtifacts[dialogueArtifactID(artifact)] {
			nodes = append(nodes, dialogueArtifactNode(artifact))
		}
	}
	if len(nodes) == 0 {
		nodes = append(nodes, dialogueTextNodes(message.Text)...)
	}
	return map[string]any{"type": "doc", "content": nodes}
}

func dialogueHeadingNode(text string) map[string]any {
	return map[string]any{
		"type":    "heading",
		"attrs":   map[string]any{"level": 1},
		"content": []map[string]any{{"type": "text", "text": text}},
	}
}

func dialogueTextNodes(text string) []map[string]any {
	text = strings.TrimSpace(strings.ReplaceAll(text, "\r\n", "\n"))
	if text == "" {
		return nil
	}
	paragraphs := strings.Split(text, "\n\n")
	nodes := make([]map[string]any, 0, len(paragraphs))
	for _, paragraph := range paragraphs {
		paragraph = strings.TrimSpace(paragraph)
		if paragraph == "" {
			continue
		}
		content := make([]map[string]any, 0, 3)
		for index, line := range strings.Split(paragraph, "\n") {
			if index > 0 {
				content = append(content, map[string]any{"type": "hardBreak"})
			}
			if line != "" {
				content = append(content, map[string]any{"type": "text", "text": line})
			}
		}
		nodes = append(nodes, map[string]any{"type": "paragraph", "content": content})
	}
	return nodes
}

func dialogueArtifactNode(artifact map[string]any) map[string]any {
	kind := dialogueMaterialKind(strings.TrimSpace(fmt.Sprint(artifact["kind"])))
	if kind == "" {
		kind = assetmodel.KindFile
	}
	name := dialogueArtifactName(artifact)
	url := dialogueArtifactURL(artifact)
	if kind == assetmodel.KindFile {
		return map[string]any{
			"type": "paragraph",
			"content": []map[string]any{{
				"type": "text",
				"text": name,
				"marks": []map[string]any{{
					"type":  "link",
					"attrs": map[string]any{"href": url, "target": "_blank"},
				}},
			}},
		}
	}
	return map[string]any{
		"type": kind,
		"attrs": map[string]any{
			"src":     url,
			"alt":     name,
			"title":   name,
			"caption": name,
		},
	}
}

func dialogueNativeArtifactContent(kind string, payload map[string]any) map[string]any {
	url := dialogueArtifactURL(payload)
	switch kind {
	case assetmodel.KindImage:
		return map[string]any{"image": url, "images": []any{payload}}
	case assetmodel.KindVideo:
		return map[string]any{"video": url, "videos": []any{payload}}
	case assetmodel.KindAudio:
		return map[string]any{"audio": url, "audios": []any{payload}}
	default:
		return map[string]any{
			"file":  url,
			"files": []any{payload},
			"text":  dialogueArtifactName(payload),
		}
	}
}

func dialogueDocumentPending(value any) bool {
	document, ok := value.(runtimedocument.Payload)
	if !ok {
		return false
	}
	return document.PendingJobCount > 0 ||
		document.Status == agentmodel.DocumentStatusWriting ||
		document.Status == agentmodel.DocumentStatusGenerating
}

func dialogueArtifactStatus(artifact map[string]any) string {
	return strings.ToLower(strings.TrimSpace(fmt.Sprint(artifact["status"])))
}

func dialogueArtifactURL(artifact map[string]any) string {
	for _, key := range []string{"url", "open_url", "preview_url"} {
		if value := strings.TrimSpace(fmt.Sprint(artifact[key])); value != "" && value != "<nil>" {
			return value
		}
	}
	return ""
}

func dialogueArtifactName(artifact map[string]any) string {
	for _, key := range []string{"name", "label"} {
		if value := strings.TrimSpace(fmt.Sprint(artifact[key])); value != "" && value != "<nil>" {
			return value
		}
	}
	return "素材"
}

func dialogueArtifactIDs(artifacts []map[string]any) []uint64 {
	ids := make([]uint64, 0, len(artifacts))
	for _, artifact := range artifacts {
		if id := dialogueArtifactID(artifact); id > 0 {
			ids = append(ids, id)
		}
	}
	return ids
}

func dialogueArtifactID(artifact map[string]any) uint64 {
	if id := nestedUint64(artifact, "artifact_id"); id > 0 {
		return id
	}
	return nestedUint64(artifact, "id")
}

func dialogueMaterialKind(kind string) string {
	switch strings.ToLower(strings.TrimSpace(kind)) {
	case assetmodel.KindImage:
		return assetmodel.KindImage
	case assetmodel.KindAudio:
		return assetmodel.KindAudio
	case assetmodel.KindVideo:
		return assetmodel.KindVideo
	case assetmodel.KindFile:
		return assetmodel.KindFile
	default:
		return ""
	}
}
