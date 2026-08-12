package adapters

import (
	"fmt"
	"strings"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const (
	doubaoVideoRoleFirstFrame     = "first_frame"
	doubaoVideoRoleLastFrame      = "last_frame"
	doubaoVideoRoleReferenceImage = "reference_image"
	doubaoVideoRoleReferenceVideo = "reference_video"
	doubaoVideoRoleReferenceAudio = "reference_audio"
)

type doubaoVideoContentUsage struct {
	firstFrames      int
	lastFrames       int
	unassignedImages int
	referenceImages  int
	referenceVideos  int
	referenceAudios  int
	invalidRoles     []string
}

func validateDoubaoVideoContent(value any) error {
	usage := collectDoubaoVideoContentUsage(value)
	if len(usage.invalidRoles) > 0 {
		return fmt.Errorf(
			"豆包视频素材用途无效: %s",
			strings.Join(usage.invalidRoles, "、"),
		)
	}

	frameCount := usage.firstFrames + usage.lastFrames + usage.unassignedImages
	referenceCount := usage.referenceImages + usage.referenceVideos + usage.referenceAudios
	if frameCount > 0 && referenceCount > 0 {
		return fmt.Errorf(
			"豆包视频素材用途冲突: 首尾帧不能与参考图片、参考视频或参考音频同时使用 (%s)",
			usage.summary(),
		)
	}

	if usage.lastFrames > 0 &&
		(usage.firstFrames != 1 || usage.lastFrames != 1 || usage.unassignedImages != 0) {
		return fmt.Errorf(
			"豆包视频首尾帧模式必须且只能包含一个首帧和一个尾帧 (%s)",
			usage.summary(),
		)
	}
	if usage.lastFrames == 0 &&
		(usage.firstFrames > 1 || usage.unassignedImages > 1 ||
			(usage.firstFrames > 0 && usage.unassignedImages > 0)) {
		return fmt.Errorf(
			"豆包视频首帧模式只能包含一张首帧图片 (%s)",
			usage.summary(),
		)
	}
	if usage.referenceAudios > 0 && usage.referenceImages+usage.referenceVideos == 0 {
		return fmt.Errorf("豆包视频参考音频必须与参考图片或参考视频同时使用")
	}
	return nil
}

func collectDoubaoVideoContentUsage(value any) doubaoVideoContentUsage {
	usage := doubaoVideoContentUsage{}
	for _, raw := range botprotocol.NormalizeAnyList(value) {
		item, ok := raw.(map[string]any)
		if !ok {
			continue
		}
		contentType := strings.ToLower(strings.TrimSpace(botprotocol.AsText(item["type"])))
		role := strings.ToLower(strings.TrimSpace(botprotocol.AsText(item["role"])))
		switch contentType {
		case "image_url":
			switch role {
			case "":
				usage.unassignedImages++
			case doubaoVideoRoleFirstFrame:
				usage.firstFrames++
			case doubaoVideoRoleLastFrame:
				usage.lastFrames++
			case doubaoVideoRoleReferenceImage:
				usage.referenceImages++
			default:
				usage.invalidRoles = append(usage.invalidRoles, role)
			}
		case "video_url":
			if role == doubaoVideoRoleReferenceVideo {
				usage.referenceVideos++
			} else {
				usage.invalidRoles = append(usage.invalidRoles, role)
			}
		case "audio_url":
			if role == doubaoVideoRoleReferenceAudio {
				usage.referenceAudios++
			} else {
				usage.invalidRoles = append(usage.invalidRoles, role)
			}
		}
	}
	return usage
}

func (usage doubaoVideoContentUsage) summary() string {
	return fmt.Sprintf(
		"首帧 %d、尾帧 %d、未标用途图片 %d、参考素材 %d",
		usage.firstFrames,
		usage.lastFrames,
		usage.unassignedImages,
		usage.referenceImages+usage.referenceVideos+usage.referenceAudios,
	)
}
