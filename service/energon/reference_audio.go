package energon

import (
	"context"
	"fmt"
	"math"
	"strconv"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
	botinput "github.com/dever-package/bot/service/energon/input"
	botprocessor "github.com/dever-package/bot/service/energon/processor"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type videoReferenceAudioPreparation struct {
	Duration float64
	Prepared bool
	Trimmed  bool
}

func (s GatewayService) prepareVideoReferenceAudio(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
	mapped botprotocol.MappedInput,
) (*botprotocol.ShemicRequest, botprotocol.MappedInput, videoReferenceAudioPreparation, error) {
	if req == nil || !isVideoGenerationPower(selected.Power) || !isDoubaoProvider(selected.Provider) {
		return req, mapped, videoReferenceAudioPreparation{}, nil
	}

	audioInputKey := mappedParamInputKey(mapped, "audio")
	if audioInputKey == "" {
		return req, mapped, videoReferenceAudioPreparation{}, nil
	}
	audioURLs := botinput.StringList(mapped.Original[audioInputKey])
	if len(audioURLs) == 0 {
		return req, mapped, videoReferenceAudioPreparation{}, nil
	}
	duration, _ := s.mappedPositiveNumber(ctx, mapped, "duration")

	prepared, err := botprocessor.PrepareReferenceAudio(ctx, botprocessor.ReferenceAudioPreparationInput{
		URL:       audioURLs[0],
		Duration:  duration,
		RequestID: req.RequestID,
	})
	if err != nil {
		return req, mapped, videoReferenceAudioPreparation{}, fmt.Errorf("处理视频参考音频失败: %w", err)
	}
	preparation := videoReferenceAudioPreparation{
		Duration: duration,
		Prepared: prepared.Prepared,
		Trimmed:  prepared.Trimmed,
	}
	if !prepared.Prepared {
		return req, mapped, preparation, nil
	}

	next := requestWithPreparedReferenceAudio(req, audioInputKey, audioURLs[0], prepared.URL)
	remapped, err := botinput.BuildMapped(ctx, s.repo, next, s.mediaPromptMappingTarget(ctx, next, selected))
	if err != nil {
		return req, mapped, videoReferenceAudioPreparation{}, fmt.Errorf("重新映射处理后的视频参考音频失败: %w", err)
	}
	return next, remapped, preparation, nil
}

func requestWithPreparedReferenceAudio(req *botprotocol.ShemicRequest, inputKey, originalURL, preparedURL string) *botprotocol.ShemicRequest {
	next := *req
	next.Input = cloneAnyMap(req.Input)
	next.Input[inputKey] = preparedURL
	if req.MediaReferencePrompt == nil {
		return &next
	}
	context := *req.MediaReferencePrompt
	context.References = make([]map[string]any, 0, len(req.MediaReferencePrompt.References))
	for _, reference := range req.MediaReferencePrompt.References {
		row := cloneAnyMap(reference)
		if botprotocol.AsText(row["url"]) == originalURL {
			row["url"] = preparedURL
		}
		context.References = append(context.References, row)
	}
	context.Content = cloneAnyMap(req.MediaReferencePrompt.Content)
	parts := []any{}
	for _, raw := range botprotocol.NormalizeAnyList(context.Content["parts"]) {
		part := cloneAnyMap(botprotocol.NormalizeMap(raw))
		if botprotocol.AsText(part["type"]) == "reference" {
			if botprotocol.AsText(part["ref_media_url"]) == originalURL {
				part["ref_media_url"] = preparedURL
			}
			if selected := botprotocol.NormalizeAnyList(part["ref_media_items"]); len(selected) > 0 {
				items := make([]any, 0, len(selected))
				for _, rawItem := range selected {
					item := cloneAnyMap(botprotocol.NormalizeMap(rawItem))
					if botprotocol.AsText(item["url"]) == originalURL {
						item["url"] = preparedURL
					}
					items = append(items, item)
				}
				part["ref_media_items"] = items
			}
		}
		parts = append(parts, part)
	}
	if len(parts) > 0 {
		context.Content["parts"] = parts
	}
	next.MediaReferencePrompt = &context
	return &next
}

func isVideoGenerationPower(power botmodel.Power) bool {
	return botmodel.NormalizePowerKind(power.Kind) == "video" &&
		!botmodel.IsVideoComposePower(power) &&
		!botmodel.IsLipSyncPower(power)
}

func isDoubaoProvider(provider botmodel.Provider) bool {
	return strings.EqualFold(strings.TrimSpace(provider.Protocol), "doubao")
}

func mappedParamInputKey(mapped botprotocol.MappedInput, paramKey string) string {
	paramKey = strings.TrimSpace(paramKey)
	for _, param := range mapped.Params {
		if !strings.EqualFold(strings.TrimSpace(param.ParamKey), paramKey) {
			continue
		}
		if inputKey := param.FirstInputKey(); inputKey != "" {
			return inputKey
		}
	}
	return ""
}

func (s GatewayService) mappedPositiveNumber(
	ctx context.Context,
	mapped botprotocol.MappedInput,
	paramKey string,
) (float64, bool) {
	paramKey = strings.TrimSpace(paramKey)
	for _, param := range mapped.Params {
		if !strings.EqualFold(strings.TrimSpace(param.ParamKey), paramKey) {
			continue
		}
		if inputKey := param.FirstInputKey(); inputKey != "" {
			inputValue := mapped.Original[inputKey]
			inputText := strings.TrimSpace(botprotocol.AsText(inputValue))
			inputID, _ := strconv.ParseUint(inputText, 10, 64)
			for _, option := range s.repo.ParamOptionsByParam(ctx, param.ParamID) {
				if (inputID > 0 && option.ID == inputID) ||
					strings.EqualFold(inputText, strings.TrimSpace(option.Value)) ||
					strings.EqualFold(inputText, strings.TrimSpace(option.Name)) {
					if value, ok := positiveReferenceAudioDuration(option.Value); ok {
						return value, true
					}
				}
			}
			if value, ok := positiveReferenceAudioDuration(inputValue); ok {
				return value, true
			}
		}
		if value, ok := positiveReferenceAudioDuration(param.Value); ok {
			return value, true
		}
	}
	return 0, false
}

func positiveReferenceAudioDuration(value any) (float64, bool) {
	duration, err := strconv.ParseFloat(strings.TrimSpace(botprotocol.AsText(value)), 64)
	return duration, err == nil && duration > 0 && !math.IsNaN(duration) && !math.IsInf(duration, 0)
}

func formatReferenceAudioDuration(value float64) string {
	return strconv.FormatFloat(value, 'f', -1, 64)
}
