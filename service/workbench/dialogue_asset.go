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

type dialogueAssetSelector struct {
	ArtifactID uint64
	DocumentID uint64
}

const (
	dialogueActivityAnchorContentOrder = "activity_anchor"
	dialogueDocumentBlockContentOrder  = "document_blocks"
)

func projectDialogueAsset(
	ctx context.Context,
	message runtimechat.CompletedAssistantMessage,
	selector dialogueAssetSelector,
) (dialogueAssetProjection, error) {
	if selector.ArtifactID > 0 && selector.DocumentID > 0 {
		return dialogueAssetProjection{}, fmt.Errorf("不能同时保存单个素材和文档")
	}
	if selector.DocumentID > 0 {
		return projectDialogueDocument(message, selector.DocumentID)
	}
	rows := runtimeartifact.NewService().ByMessage(ctx, message.ID)
	if selector.ArtifactID > 0 {
		return projectSingleDialogueArtifact(ctx, message, rows, selector.ArtifactID)
	}
	return projectWholeDialogueMessage(ctx, message, rows)
}

func projectDialogueDocument(
	message runtimechat.CompletedAssistantMessage,
	documentID uint64,
) (dialogueAssetProjection, error) {
	document, ok := message.Document.(runtimedocument.Payload)
	if !ok || document.ID != documentID || document.MessageID != message.ID {
		return dialogueAssetProjection{}, fmt.Errorf("回复文档不存在")
	}
	if dialogueDocumentPending(document) {
		return dialogueAssetProjection{}, fmt.Errorf("文档仍在生成，请完成后再保存")
	}
	nodes, artifactIDs := dialogueDocumentNodes(document, false, map[uint64]bool{})
	if len(nodes) == 0 {
		return dialogueAssetProjection{}, fmt.Errorf("文档内容为空")
	}
	return dialogueAssetProjection{
		Kind:          assetmodel.KindRichText,
		Content:       map[string]any{"type": "doc", "content": nodes},
		DefaultName:   strings.TrimSpace(document.Title),
		RequestSuffix: fmt.Sprintf(":document:%d", document.ID),
		NodeSuffix:    fmt.Sprintf(":document:%d", document.ID),
		Source: map[string]any{
			"document_id":   document.ID,
			"artifact_ids":  artifactIDs,
			"content_order": dialogueDocumentBlockContentOrder,
		},
	}, nil
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
			"artifact_ids":  dialogueArtifactIDs(ready),
			"content_order": dialogueActivityAnchorContentOrder,
		},
	}, nil
}

func reprojectDialogueVersionContent(ctx context.Context, teamID uint64, version map[string]any) {
	requestID := nestedText(version, "request_id")
	source := recordValue(version["source"])
	if !strings.HasSuffix(requestID, ":whole") ||
		nestedText(source, "content_order") == dialogueActivityAnchorContentOrder {
		return
	}

	messageID := nestedUint64(source, "message_id")
	roleID := nestedUint64(source, "role_id")
	agentKey := nestedText(source, "agent_key")
	if messageID == 0 || roleID == 0 || agentKey == "" {
		return
	}
	message, err := runtimechat.NewService().RequireCompletedAssistantMessage(
		ctx,
		messageID,
		agentKey,
		RoleContextKey(teamID, roleID),
	)
	if err != nil {
		return
	}
	projection, err := projectDialogueAsset(ctx, message, dialogueAssetSelector{})
	if err != nil {
		return
	}
	version["content"] = projection.Content
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
		documentNodes, _ := dialogueDocumentNodes(document, true, usedArtifacts)
		nodes = append(nodes, documentNodes...)
	} else {
		nodes = append(nodes, dialogueAnchoredMessageNodes(message, artifacts, usedArtifacts)...)
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

func dialogueDocumentNodes(
	document runtimedocument.Payload,
	includeIntro bool,
	usedArtifacts map[uint64]bool,
) ([]map[string]any, []uint64) {
	nodes := make([]map[string]any, 0, len(document.Blocks)+2)
	artifactIDs := make([]uint64, 0)
	if includeIntro {
		if intro := strings.TrimSpace(fmt.Sprint(document.Meta["intro"])); intro != "" && intro != "<nil>" {
			nodes = append(nodes, dialogueTextNodes(intro)...)
		}
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
			artifactID := dialogueArtifactID(artifact)
			if artifactID > 0 && usedArtifacts[artifactID] {
				continue
			}
			nodes = append(nodes, dialogueArtifactNode(artifact))
			if artifactID > 0 {
				usedArtifacts[artifactID] = true
				artifactIDs = append(artifactIDs, artifactID)
			}
		}
	}
	return nodes, artifactIDs
}

func dialogueAnchoredMessageNodes(
	message runtimechat.CompletedAssistantMessage,
	artifacts []map[string]any,
	usedArtifacts map[uint64]bool,
) []map[string]any {
	activities := dialogueRecordList(message.Output["activities"])
	if len(activities) == 0 {
		return dialogueTextNodes(message.Text)
	}

	artifactByID := make(map[uint64]map[string]any, len(artifacts))
	for _, artifact := range artifacts {
		if id := dialogueArtifactID(artifact); id > 0 {
			artifactByID[id] = artifact
		}
	}

	nodes := make([]map[string]any, 0, len(activities)+2)
	cursor := 0
	for _, activity := range activities {
		anchorEnd := dialogueAnchorEnd(message.Text, nestedText(activity, "anchor_text"), cursor)
		nodes = append(nodes, dialogueTextNodes(message.Text[cursor:anchorEnd])...)
		for _, activityArtifact := range dialogueRecordList(activity["artifacts"]) {
			artifactID := dialogueArtifactID(activityArtifact)
			artifact := artifactByID[artifactID]
			if artifactID == 0 || artifact == nil || usedArtifacts[artifactID] {
				continue
			}
			nodes = append(nodes, dialogueArtifactNode(artifact))
			usedArtifacts[artifactID] = true
		}
		cursor = anchorEnd
	}
	nodes = append(nodes, dialogueTextNodes(message.Text[cursor:])...)
	return nodes
}

func dialogueAnchorEnd(text string, anchor string, cursor int) int {
	anchor = strings.TrimSpace(anchor)
	if anchor == "" {
		return cursor
	}
	if strings.HasPrefix(text, anchor) {
		if len(anchor) > cursor {
			return len(anchor)
		}
		return cursor
	}
	if position := strings.Index(text[cursor:], anchor); position >= 0 {
		return cursor + position + len(anchor)
	}
	return cursor
}

func dialogueRecordList(value any) []map[string]any {
	switch rows := value.(type) {
	case []map[string]any:
		return rows
	case []any:
		result := make([]map[string]any, 0, len(rows))
		for _, row := range rows {
			if current, ok := row.(map[string]any); ok {
				result = append(result, current)
			}
		}
		return result
	default:
		return nil
	}
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
