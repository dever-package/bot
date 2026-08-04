package energon

import (
	"context"
	"encoding/json"
	"fmt"
	"sort"
	"strconv"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	runningHubLipSyncIdentifyEndpoint = "kling-lip-sync/identify-face"
	runningHubLipSyncVideoEndpoint    = "kling-lip-sync/lip-sync-video"
)

type runningHubLipSyncFace struct {
	ID         string
	Name       string
	PreviewURL string
	StartTime  float64
	EndTime    float64
}

type runningHubLipSyncIdentification struct {
	SessionID string
	Faces     []runningHubLipSyncFace
}

func (s GatewayService) callNormalizePowerTarget(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
) (callResult, error) {
	if botmodel.IsStoryboardGridPower(selected.Power) {
		return s.callNormalizeStoryboardGrid(ctx, req, selected)
	}
	if !s.isRunningHubTwoStageLipSync(ctx, req, selected) || hasLipSyncSelection(req) {
		return s.callNormalizeTarget(ctx, req, selected)
	}

	identified, err := s.callNormalizeTarget(ctx, req, selected)
	if err != nil {
		return identified, err
	}
	result, err := parseRunningHubLipSyncIdentification(
		identified.Data,
		responseBody(identified),
	)
	if err != nil {
		return identified, err
	}
	if len(result.Faces) == 1 {
		return s.callNormalizeTarget(ctx, withLipSyncSelection(req, result.SessionID, result.Faces[0].ID), selected)
	}

	identified.Data = buildLipSyncInteractionOutput(req, result)
	return identified, nil
}

func (s GatewayService) callStreamPowerTarget(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
) (callResult, error) {
	if botmodel.IsStoryboardGridPower(selected.Power) {
		return s.callStreamStoryboardGrid(ctx, req, selected)
	}
	if !s.isRunningHubTwoStageLipSync(ctx, req, selected) || hasLipSyncSelection(req) {
		return s.callStreamTarget(ctx, req, selected)
	}
	if err := s.writeStreamStatus(ctx, req.RequestID, "正在识别视频中的角色"); err != nil {
		return callResult{}, err
	}

	identified, err := s.callNormalizeTarget(ctx, req, selected)
	if err != nil {
		return identified, err
	}
	result, err := parseRunningHubLipSyncIdentification(
		identified.Data,
		responseBody(identified),
	)
	if err != nil {
		return identified, err
	}
	if len(result.Faces) == 1 {
		if err := s.writeStreamStatus(ctx, req.RequestID, "已识别角色，正在生成口型视频"); err != nil {
			return identified, err
		}
		return s.callStreamTarget(ctx, withLipSyncSelection(req, result.SessionID, result.Faces[0].ID), selected)
	}

	output := buildLipSyncInteractionOutput(req, result)
	if err := s.writeStreamOutput(ctx, req.RequestID, output); err != nil {
		return identified, err
	}
	if err := s.writeStreamOutput(ctx, req.RequestID, botprotocol.Output{"event": "end"}); err != nil {
		return identified, err
	}
	if err := s.writeStream(ctx, req.RequestID, botprotocol.BuildSuccessResponse(req.RequestID, output)); err != nil {
		return identified, err
	}
	identified.Data = output
	return identified, nil
}

func (s GatewayService) isRunningHubTwoStageLipSync(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
) bool {
	if req == nil || !botmodel.IsLipSyncPower(selected.Power) {
		return false
	}
	adapter, err := s.adapterForSelected(req, selected)
	if err != nil || !strings.EqualFold(strings.TrimSpace(adapter.Name()), "rhapi") {
		return false
	}

	hasIdentify := false
	hasVideo := false
	for _, endpoint := range s.repo.ServiceEndpointsByService(ctx, selected.Service.ID) {
		if !isActive(endpoint.Status) {
			continue
		}
		api := strings.ToLower(strings.TrimSpace(endpoint.Api))
		hasIdentify = hasIdentify || strings.Contains(api, runningHubLipSyncIdentifyEndpoint)
		hasVideo = hasVideo || strings.Contains(api, runningHubLipSyncVideoEndpoint)
	}
	return hasIdentify && hasVideo
}

func hasLipSyncSelection(req *botprotocol.ShemicRequest) bool {
	if req == nil {
		return false
	}
	return firstLipSyncInputText(req.Input, "session_id", "sessionId") != "" &&
		firstLipSyncInputText(req.Input, "face_id", "faceId") != ""
}

func withLipSyncSelection(req *botprotocol.ShemicRequest, sessionID string, faceID string) *botprotocol.ShemicRequest {
	next := *req
	next.Input = cloneAnyMap(req.Input)
	if next.Input == nil {
		next.Input = map[string]any{}
	}
	next.Input["session_id"] = strings.TrimSpace(sessionID)
	next.Input["face_id"] = strings.TrimSpace(faceID)
	return &next
}

func firstLipSyncInputText(input map[string]any, keys ...string) string {
	for _, key := range keys {
		if text := strings.TrimSpace(botprotocol.AsText(input[key])); text != "" {
			return text
		}
	}
	return ""
}

func responseBody(result callResult) any {
	if result.Response == nil {
		return nil
	}
	return result.Response.Body
}

func parseRunningHubLipSyncIdentification(values ...any) (runningHubLipSyncIdentification, error) {
	result := runningHubLipSyncIdentification{}
	faces := map[string]runningHubLipSyncFace{}
	for _, value := range values {
		walkRunningHubLipSyncValue(value, "", 0, &result.SessionID, faces)
	}
	result.SessionID = strings.TrimSpace(result.SessionID)
	if result.SessionID == "" {
		return result, fmt.Errorf("RunningHub 人脸识别结果缺少 session_id")
	}
	for _, face := range faces {
		result.Faces = append(result.Faces, face)
	}
	if len(result.Faces) == 0 {
		result.Faces = append(result.Faces, runningHubLipSyncFace{ID: "0", Name: "识别到的角色"})
	}
	sortLipSyncFaces(result.Faces)
	return result, nil
}

func walkRunningHubLipSyncValue(
	value any,
	contextKey string,
	depth int,
	sessionID *string,
	faces map[string]runningHubLipSyncFace,
) {
	if value == nil || depth > 12 {
		return
	}
	switch current := value.(type) {
	case botprotocol.Output:
		walkRunningHubLipSyncValue(map[string]any(current), contextKey, depth+1, sessionID, faces)
	case map[string]any:
		if *sessionID == "" {
			*sessionID = lipSyncMapText(current, "session_id", "sessionId")
		}
		if face, ok := runningHubLipSyncFaceFromMap(current, contextKey, ""); ok {
			mergeRunningHubLipSyncFace(faces, face)
		}
		for key, child := range current {
			walkRunningHubLipSyncValue(child, normalizeLipSyncKey(key), depth+1, sessionID, faces)
		}
	case []any:
		for index, child := range current {
			if mapped, ok := child.(map[string]any); ok && strings.Contains(contextKey, "face") {
				if face, exists := runningHubLipSyncFaceFromMap(mapped, contextKey, strconv.Itoa(index)); exists {
					mergeRunningHubLipSyncFace(faces, face)
				}
			}
			walkRunningHubLipSyncValue(child, contextKey, depth+1, sessionID, faces)
		}
	case []map[string]any:
		for index, child := range current {
			if strings.Contains(contextKey, "face") {
				if face, exists := runningHubLipSyncFaceFromMap(child, contextKey, strconv.Itoa(index)); exists {
					mergeRunningHubLipSyncFace(faces, face)
				}
			}
			walkRunningHubLipSyncValue(child, contextKey, depth+1, sessionID, faces)
		}
	case string:
		text := strings.TrimSpace(current)
		if text == "" || (!strings.HasPrefix(text, "{") && !strings.HasPrefix(text, "[") && !strings.HasPrefix(text, "\"")) {
			return
		}
		var decoded any
		if json.Unmarshal([]byte(text), &decoded) == nil && decoded != current {
			walkRunningHubLipSyncValue(decoded, contextKey, depth+1, sessionID, faces)
		}
	}
}

func runningHubLipSyncFaceFromMap(mapped map[string]any, contextKey string, fallbackID string) (runningHubLipSyncFace, bool) {
	faceID := lipSyncMapText(mapped, "face_id", "faceId", "face_index", "faceIndex")
	if faceID == "" && strings.Contains(contextKey, "face") {
		faceID = lipSyncMapText(mapped, "id", "index")
	}
	if faceID == "" {
		faceID = strings.TrimSpace(fallbackID)
	}
	if faceID == "" {
		return runningHubLipSyncFace{}, false
	}
	return runningHubLipSyncFace{
		ID:   faceID,
		Name: lipSyncMapText(mapped, "name", "face_name", "faceName", "label"),
		PreviewURL: lipSyncMapText(
			mapped,
			"preview_url", "previewUrl", "image_url", "imageUrl",
			"face_url", "faceUrl", "face_image", "faceImage",
			"face_image_url", "faceImageUrl", "face_img", "faceImg",
			"screenshot", "cover_url", "coverUrl", "url",
		),
		StartTime: lipSyncMapFloat(
			mapped,
			"start_time", "startTime", "available_start_time", "availableStartTime",
			"valid_start_time", "validStartTime", "face_start_time", "faceStartTime", "start",
		),
		EndTime: lipSyncMapFloat(
			mapped,
			"end_time", "endTime", "available_end_time", "availableEndTime",
			"valid_end_time", "validEndTime", "face_end_time", "faceEndTime", "end",
		),
	}, true
}

func mergeRunningHubLipSyncFace(faces map[string]runningHubLipSyncFace, candidate runningHubLipSyncFace) {
	candidate.ID = strings.TrimSpace(candidate.ID)
	if candidate.ID == "" {
		return
	}
	current, exists := faces[candidate.ID]
	if !exists {
		faces[candidate.ID] = candidate
		return
	}
	if current.Name == "" {
		current.Name = candidate.Name
	}
	if current.PreviewURL == "" {
		current.PreviewURL = candidate.PreviewURL
	}
	if current.StartTime == 0 {
		current.StartTime = candidate.StartTime
	}
	if current.EndTime == 0 {
		current.EndTime = candidate.EndTime
	}
	faces[candidate.ID] = current
}

func sortLipSyncFaces(faces []runningHubLipSyncFace) {
	sort.SliceStable(faces, func(left int, right int) bool {
		return lipSyncFaceLess(faces[left], faces[right])
	})
}

func lipSyncFaceLess(left runningHubLipSyncFace, right runningHubLipSyncFace) bool {
	leftNumber, leftErr := strconv.Atoi(left.ID)
	rightNumber, rightErr := strconv.Atoi(right.ID)
	if leftErr == nil && rightErr == nil {
		return leftNumber < rightNumber
	}
	return left.ID < right.ID
}

func lipSyncMapText(mapped map[string]any, keys ...string) string {
	for _, key := range keys {
		target := normalizeLipSyncKey(key)
		for currentKey, value := range mapped {
			if normalizeLipSyncKey(currentKey) != target {
				continue
			}
			if text := strings.TrimSpace(botprotocol.AsText(value)); text != "" {
				return text
			}
		}
	}
	return ""
}

func lipSyncMapFloat(mapped map[string]any, keys ...string) float64 {
	text := lipSyncMapText(mapped, keys...)
	value, _ := strconv.ParseFloat(text, 64)
	return value
}

func normalizeLipSyncKey(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	return strings.NewReplacer("_", "", "-", "", " ", "").Replace(value)
}

func buildLipSyncInteractionOutput(
	req *botprotocol.ShemicRequest,
	result runningHubLipSyncIdentification,
) botprotocol.Output {
	fields := []any{
		map[string]any{
			"id":            1,
			"name":          "识别会话",
			"key":           "session_id",
			"type":          "hidden",
			"value_type":    "string",
			"required":      true,
			"default_value": result.SessionID,
		},
	}
	values := map[string]any{"session_id": result.SessionID}
	fields, values = appendLipSyncResumeFields(fields, values, req)

	options := make([]any, 0, len(result.Faces))
	faces := make([]any, 0, len(result.Faces))
	for index, face := range result.Faces {
		name := strings.TrimSpace(face.Name)
		if name == "" {
			name = fmt.Sprintf("角色 %d", index+1)
		}
		if face.EndTime > face.StartTime {
			name += fmt.Sprintf("（%.1f-%.1f秒）", face.StartTime, face.EndTime)
		}
		options = append(options, map[string]any{
			"id":           index + 1,
			"name":         name,
			"value":        face.ID,
			"native_value": face.ID,
			"preview_url":  face.PreviewURL,
			"sort":         index + 1,
		})
		faces = append(faces, map[string]any{
			"face_id":     face.ID,
			"name":        name,
			"preview_url": face.PreviewURL,
			"start_time":  face.StartTime,
			"end_time":    face.EndTime,
		})
	}
	fields = append(fields, map[string]any{
		"id":           len(fields) + 1,
		"name":         "目标角色",
		"key":          "face_id",
		"type":         "option",
		"preview_type": "image",
		"value_type":   "string",
		"required":     true,
		"options":      options,
	})

	interaction := map[string]any{
		"id":          "lip-sync-face-" + strings.TrimSpace(req.RequestID),
		"type":        "form",
		"title":       "选择对口型角色",
		"description": "视频中识别到多个角色，请选择需要驱动口型的角色。",
		"fields":      fields,
		"values":      values,
		"lip_sync": map[string]any{
			"session_id": result.SessionID,
			"faces":      faces,
		},
	}
	return botprotocol.Output{
		"event":       "interaction",
		"interaction": interaction,
		"meta": map[string]any{
			"output_type": botmodel.OutputTypeLipSync,
		},
	}
}

func appendLipSyncResumeFields(
	fields []any,
	values map[string]any,
	req *botprotocol.ShemicRequest,
) ([]any, map[string]any) {
	if req == nil {
		return fields, values
	}
	for _, key := range []string{
		"video", "video_url", "audio", "audio_url",
		"sound_start_time", "sound_end_time", "sound_insert_time",
		"sound_volume", "original_audio_volume",
	} {
		value, exists := req.Input[key]
		if !exists || botprotocol.IsEmptyProtocolValue(value) {
			continue
		}
		values[key] = value
		fields = append(fields, map[string]any{
			"id":         len(fields) + 1,
			"name":       key,
			"key":        key,
			"type":       "hidden",
			"value_type": lipSyncValueType(value),
			"required":   false,
		})
	}
	return fields, values
}

func lipSyncValueType(value any) string {
	switch value.(type) {
	case int, int8, int16, int32, int64, uint, uint8, uint16, uint32, uint64, float32, float64:
		return "number"
	default:
		return "string"
	}
}
