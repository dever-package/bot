package energon

import (
	"encoding/json"
	"fmt"
	"math"
	"sort"
	"strconv"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
)

func storyboardOutputContract(contractContext powerOutputContractContext) (powerOutputContract, error) {
	durationContract, err := storyboardGenerationContractForRequest(
		contractContext.RequestInput,
		contractContext.StoryboardMaxShotDuration,
	)
	if err != nil {
		return powerOutputContract{}, err
	}
	prompt, err := storyboardOutputPrompt(durationContract)
	if err != nil {
		return powerOutputContract{}, err
	}
	return powerOutputContract{
		Type:        "分镜脚本",
		Description: "提交最终分镜脚本。必须完整填写系统定义的字段，不得改变字段名或结构。",
		Prompt:      prompt,
		Schema:      storyboardOutputSchema(durationContract),
		Normalize: func(output map[string]any, requestInput map[string]any) (map[string]any, error) {
			return normalizeStoryboardOutput(output, requestInput, durationContract)
		},
	}, nil
}

func storyboardOutputSchema(contract storyboardGenerationContract) map[string]any {
	minShotDuration := contract.MinShotDuration
	maxShotDuration := contract.MaxShotDuration
	minShotCount := 1
	maxShotCount := botmodel.StoryboardMaxShots
	if contract.TargetDuration > 0 {
		minShotCount = contract.MinShotCount
		maxShotCount = contract.MaxShotCount
	}
	continuityStateSchema := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"entry": map[string]any{"type": "string", "minLength": 1},
			"exit":  map[string]any{"type": "string", "minLength": 1},
		},
		"required":             []any{"entry", "exit"},
		"additionalProperties": false,
	}
	storylineSchema := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"setup":       map[string]any{"type": "string", "minLength": 1},
			"development": map[string]any{"type": "string", "minLength": 1},
			"payoff":      map[string]any{"type": "string", "minLength": 1},
		},
		"required":             []any{"setup", "development", "payoff"},
		"additionalProperties": false,
	}
	speechSchema := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"id":               map[string]any{"type": "string", "minLength": 1},
			"kind":             map[string]any{"type": "string", "enum": []any{"dialogue", "narration"}},
			"text":             map[string]any{"type": "string", "minLength": 1},
			"start_time":       map[string]any{"type": "number", "minimum": 0},
			"character_id":     map[string]any{"type": "string"},
			"speaker_mode":     map[string]any{"type": "string", "enum": []any{"visible", "offscreen"}},
			"subtitle_enabled": map[string]any{"type": "boolean"},
			"subtitle_text":    map[string]any{"type": "string"},
		},
		"required":             []any{"id", "kind", "text", "start_time", "subtitle_enabled", "subtitle_text"},
		"additionalProperties": false,
	}
	captionSchema := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"id":         map[string]any{"type": "string", "minLength": 1},
			"type":       map[string]any{"type": "string", "enum": []any{"caption", "title", "highlight"}},
			"text":       map[string]any{"type": "string", "minLength": 1},
			"start_time": map[string]any{"type": "number", "minimum": 0},
			"end_time":   map[string]any{"type": "number", "exclusiveMinimum": 0},
		},
		"required":             []any{"id", "type", "text", "start_time", "end_time"},
		"additionalProperties": false,
	}
	materialSchema := map[string]any{
		"type": "object",
		"properties": map[string]any{
			"id":             map[string]any{"type": "string", "minLength": 1},
			"type":           map[string]any{"type": "string", "enum": []any{"character", "scene", "prop"}},
			"name":           map[string]any{"type": "string", "minLength": 1},
			"prompt":         map[string]any{"type": "string", "minLength": 1},
			"voice":          map[string]any{"type": "string"},
			"reference_keys": map[string]any{"type": "array", "items": map[string]any{"type": "string", "minLength": 1}, "uniqueItems": true},
		},
		"required":             []any{"id", "type", "name", "prompt", "voice", "reference_keys"},
		"additionalProperties": false,
	}
	return map[string]any{
		"type": "object",
		"properties": map[string]any{
			"type":    map[string]any{"type": "string", "enum": []any{botmodel.OutputTypeStoryboard}},
			"version": map[string]any{"type": "integer", "enum": []any{botmodel.StoryboardVersion}},
			"title":   map[string]any{"type": "string"},
			"summary": map[string]any{"type": "string", "minLength": 1},
			"target_duration": map[string]any{
				"type":    "integer",
				"minimum": minShotDuration,
			},
			"target_shot_count": map[string]any{
				"type":    "integer",
				"minimum": minShotCount,
				"maximum": maxShotCount,
			},
			"narrator_voice": map[string]any{"type": "string"},
			"storyline":      storylineSchema,
			"style_prompt":   map[string]any{"type": "string", "minLength": 1},
			"visual_mode": map[string]any{
				"type": "string",
				"enum": []any{botmodel.StoryboardVisualModePhotoreal, botmodel.StoryboardVisualModeStylized},
			},
			"aspect_ratio": map[string]any{"type": "string", "enum": []any{"16:9", "9:16", "1:1", "4:3", "3:4", "21:9"}},
			"shots": map[string]any{
				"type":     "array",
				"minItems": minShotCount,
				"maxItems": maxShotCount,
				"items": map[string]any{
					"type": "object",
					"properties": map[string]any{
						"id":         map[string]any{"type": "string", "minLength": 1},
						"order":      map[string]any{"type": "integer", "minimum": 1},
						"duration":   map[string]any{"type": "integer", "minimum": minShotDuration, "maximum": maxShotDuration},
						"beat":       map[string]any{"type": "string", "minLength": 1},
						"transition": map[string]any{"type": "string"},
						"transition_type": map[string]any{
							"type": "string",
							"enum": botmodel.StoryboardTransitionTypeValues(),
						},
						"transition_duration_ms": map[string]any{"type": "integer", "minimum": 0, "maximum": 5000},
						"description":            map[string]any{"type": "string", "minLength": 1},
						"camera_instruction":     map[string]any{"type": "string"},
						"video_prompt":           map[string]any{"type": "string", "minLength": 1},
						"material_ids":           map[string]any{"type": "array", "items": map[string]any{"type": "string", "minLength": 1}},
						"reference_keys":         map[string]any{"type": "array", "items": map[string]any{"type": "string", "minLength": 1}, "uniqueItems": true},
						"shot_image_mode":        map[string]any{"type": "string", "enum": botmodel.StoryboardShotImageModeValues()},
						"match_previous":         map[string]any{"type": "boolean"},
						"continue_previous":      map[string]any{"type": "boolean"},
						"continuity_anchor":      map[string]any{"type": "string"},
						"continuity_state":       continuityStateSchema,
						"lyric_line_indexes":     map[string]any{"type": "array", "items": map[string]any{"type": "integer", "minimum": 1}, "uniqueItems": true},
						"speech":                 map[string]any{"type": "array", "items": speechSchema},
						"captions":               map[string]any{"type": "array", "items": captionSchema},
					},
					"required": []any{
						"id", "order", "duration", "beat", "transition", "transition_type", "transition_duration_ms", "description", "camera_instruction", "video_prompt", "material_ids", "reference_keys", "shot_image_mode", "match_previous", "continue_previous", "continuity_anchor", "continuity_state", "lyric_line_indexes", "speech", "captions",
					},
					"additionalProperties": false,
				},
			},
			"materials": map[string]any{"type": "array", "items": materialSchema},
		},
		"required":             []any{"type", "version", "title", "summary", "target_duration", "target_shot_count", "narrator_voice", "storyline", "style_prompt", "visual_mode", "aspect_ratio", "shots", "materials"},
		"additionalProperties": false,
	}
}

func normalizeStoryboardOutput(
	input map[string]any,
	requestInput map[string]any,
	durationContract storyboardGenerationContract,
) (map[string]any, error) {
	narratorVoice := requiredString(input, "narrator_voice")
	materials, materialTypes, materialIDLookup, err := normalizeStoryboardMaterials(input["materials"])
	if err != nil {
		return nil, err
	}
	shots, err := normalizeStoryboardShots(input["shots"], materialTypes, materialIDLookup, durationContract)
	if err != nil {
		return nil, err
	}
	if err := normalizeStoryboardTimelineShots(shots, durationContract); err != nil {
		return nil, err
	}
	storyline := normalizeStoryboardStoryline(input["storyline"], shots)
	summary := requiredString(input, "summary")
	if summary == "" {
		summary = botmodel.StoryboardSummaryFromStoryline(
			requiredString(storyline, "setup"),
			requiredString(storyline, "development"),
			requiredString(storyline, "payoff"),
		)
	}
	if summary == "" {
		summary = "围绕当前主题展开并完成一个连贯事件"
	}
	materials, shots = ensureMVStoryboardCharacterContinuity(
		requestInput,
		materials,
		shots,
		summary,
		storyline,
	)
	lyricsLRC, err := normalizeStoryboardLyricsPlan(requestInput, durationContract.WorkType, shots)
	if err != nil {
		return nil, err
	}
	title := storyboardOutputTitle(requiredString(input, "title"), requestInput, summary, shots)
	visualHints := storyboardVisualHints(input, materials, shots)
	visualMode := botmodel.NormalizeOrInferStoryboardVisualMode(
		requiredString(input, "visual_mode"),
		visualHints...,
	)
	stylePrompt := requiredString(input, "style_prompt")
	if stylePrompt == "" {
		stylePrompt = botmodel.DefaultStoryboardStylePrompt(visualMode, false)
	}
	aspectRatio := normalizeStoryboardAspectRatio(requiredString(input, "aspect_ratio"))
	// The normalized shots are the source of truth. Model-provided summary
	// fields can be stale after duration repair or speech fitting.
	targetShotCount := len(shots)
	targetDuration := 0
	for _, value := range shots {
		shot, _ := value.(map[string]any)
		duration, _ := integerValue(shot["duration"])
		targetDuration += duration
	}
	result := map[string]any{
		"type":    botmodel.OutputTypeStoryboard,
		"version": botmodel.StoryboardVersion,
		"workflow": map[string]any{
			"status":       "draft",
			"confirmed_at": "",
		},
		"title":             title,
		"summary":           summary,
		"target_duration":   targetDuration,
		"target_shot_count": targetShotCount,
		"min_shot_duration": durationContract.MinShotDuration,
		"lyrics_lrc":        lyricsLRC,
		"narrator_voice":    narratorVoice,
		"storyline":         storyline,
		"style_prompt":      stylePrompt,
		"visual_mode":       visualMode,
		"aspect_ratio":      aspectRatio,
		"references":        []any{},
		"shots":             shots,
		"materials":         materials,
	}
	if durationContract.TargetDuration > 0 {
		result[botmodel.StoryboardRangeStartMSKey] = durationContract.RangeStartMS
		result[botmodel.StoryboardRangeEndMSKey] = durationContract.RangeEndMS
		result[botmodel.StoryboardSoundtrackDurationMSKey] = durationContract.SoundtrackDurationMS
		result[botmodel.StoryboardTimelineDurationMSKey] = durationContract.TimelineDurationMS
	}
	return result, nil
}

func normalizeStoryboardTimelineShots(shots []any, contract storyboardGenerationContract) error {
	if contract.TargetDuration <= 0 {
		return nil
	}
	if len(shots) < contract.MinShotCount || len(shots) > contract.MaxShotCount {
		return fmt.Errorf(
			"本次制作范围需要 %d 到 %d 个镜头，实际收到 %d 个",
			contract.MinShotCount,
			contract.MaxShotCount,
			len(shots),
		)
	}
	maxRawDurationMS := int64(len(shots) * contract.MaxShotDuration * 1000)
	transitionBudgetMS := maxRawDurationMS - contract.TimelineDurationMS
	if transitionBudgetMS < 0 {
		return fmt.Errorf("当前镜头数量不足以覆盖完整制作范围")
	}
	transitionDurationMS := normalizeStoryboardTransitionBudget(shots, transitionBudgetMS)
	rawTargetDuration := int((contract.TimelineDurationMS + transitionDurationMS + 999) / 1000)
	durations := make([]int, len(shots))
	for index, value := range shots {
		shot := value.(map[string]any)
		durations[index], _ = integerValue(shot["duration"])
	}
	normalized, err := botmodel.RebalanceStoryboardShotDurations(
		durations,
		rawTargetDuration,
		contract.MinShotDuration,
		contract.MaxShotDuration,
	)
	if err != nil {
		return fmt.Errorf("无法将分镜校准到完整制作范围: %w", err)
	}
	for index, duration := range normalized {
		shots[index].(map[string]any)["duration"] = duration
	}
	return nil
}

func normalizeStoryboardTransitionBudget(shots []any, budgetMS int64) int64 {
	totalMS := int64(0)
	for index := 1; index < len(shots); index++ {
		shot := shots[index].(map[string]any)
		durationMS, _ := integerValue(shot["transition_duration_ms"])
		totalMS += int64(durationMS)
	}
	if totalMS <= budgetMS {
		return totalMS
	}
	excessMS := totalMS - budgetMS
	for index := len(shots) - 1; index >= 1 && excessMS > 0; index-- {
		shot := shots[index].(map[string]any)
		durationMS, _ := integerValue(shot["transition_duration_ms"])
		if durationMS <= 0 {
			continue
		}
		nextDurationMS := int64(durationMS) - excessMS
		if nextDurationMS < 100 {
			shot["transition_type"] = botmodel.StoryboardTransitionNone
			shot["transition_duration_ms"] = 0
			excessMS -= int64(durationMS)
			totalMS -= int64(durationMS)
			continue
		}
		shot["transition_duration_ms"] = int(nextDurationMS)
		totalMS -= excessMS
		excessMS = 0
	}
	return totalMS
}

func storyboardOutputTitle(current string, requestInput map[string]any, summary string, shots []any) string {
	if title := storyboardTitleCandidate(current); title != "" && !isGenericStoryboardTitle(title) {
		return title
	}
	candidates := []any{requestInput["prompt"], requestInput["text"], summary}
	if len(shots) > 0 {
		shot, _ := shots[0].(map[string]any)
		candidates = append(candidates, shot["beat"], shot["description"])
	}
	for _, candidate := range candidates {
		if title := storyboardTitleCandidate(powerPromptText(candidate)); title != "" && !isGenericStoryboardTitle(title) {
			return title
		}
	}
	return "分镜脚本"
}

func storyboardTitleCandidate(value string) string {
	value = strings.TrimSpace(value)
	if index := strings.IndexAny(value, "\r\n"); index >= 0 {
		value = value[:index]
	}
	value = strings.Join(strings.Fields(value), " ")
	if index := strings.IndexAny(value, "@#。！？!?；;"); index >= 0 {
		value = value[:index]
	}
	value = strings.Trim(value, " \t，,。.!！?？:：;；-—")
	runes := []rune(value)
	if len(runes) > 24 {
		value = string(runes[:24])
	}
	return strings.TrimSpace(value)
}

func isGenericStoryboardTitle(value string) bool {
	switch strings.TrimSpace(value) {
	case "未命名", "未命名分镜", "分镜", "分镜脚本", "暂无内容简介", "围绕当前主题展开并完成一个连贯事件":
		return true
	default:
		return false
	}
}

func normalizeStoryboardStoryline(value any, shots []any) map[string]any {
	storyline, _ := value.(map[string]any)
	setup := requiredString(storyline, "setup")
	development := requiredString(storyline, "development")
	payoff := requiredString(storyline, "payoff")
	if len(shots) > 0 {
		first, _ := shots[0].(map[string]any)
		last, _ := shots[len(shots)-1].(map[string]any)
		setup = firstStoryboardText(setup, requiredString(first, "description"), requiredString(first, "beat"))
		payoff = firstStoryboardText(payoff, requiredString(last, "description"), requiredString(last, "beat"))
		if development == "" {
			parts := make([]string, 0, len(shots))
			for _, value := range shots {
				shot, _ := value.(map[string]any)
				if beat := requiredString(shot, "beat"); beat != "" {
					parts = append(parts, beat)
				}
			}
			development = strings.Join(parts, "；")
		}
	}
	setup = firstStoryboardText(setup, development, payoff, "建立人物、环境与当前处境")
	development = firstStoryboardText(development, setup, payoff, "事件在镜头间持续推进")
	payoff = firstStoryboardText(payoff, development, setup, "事件形成清晰的可见结果")
	return map[string]any{
		"setup":       setup,
		"development": development,
		"payoff":      payoff,
	}
}

func normalizeStoryboardAspectRatio(value string) string {
	switch strings.TrimSpace(value) {
	case "16:9", "9:16", "1:1", "4:3", "3:4", "21:9":
		return strings.TrimSpace(value)
	default:
		return "16:9"
	}
}

func storyboardVisualHints(input map[string]any, materials []any, shots []any) []string {
	result := []string{requiredString(input, "style_prompt"), requiredString(input, "summary")}
	for _, value := range materials {
		material, _ := value.(map[string]any)
		result = append(result, requiredString(material, "prompt"))
	}
	for _, value := range shots {
		shot, _ := value.(map[string]any)
		result = append(result, requiredString(shot, "description"), requiredString(shot, "video_prompt"))
	}
	return result
}

func normalizeStoryboardShots(
	value any,
	materialTypes map[string]string,
	materialIDLookup map[string]string,
	durationContract storyboardGenerationContract,
) ([]any, error) {
	items, ok := storyboardValueItems(value)
	if !ok || len(items) == 0 {
		return nil, fmt.Errorf("shots 至少需要一个镜头")
	}
	if len(items) > botmodel.StoryboardMaxShots {
		return nil, fmt.Errorf("shots 最多允许 %d 个镜头", botmodel.StoryboardMaxShots)
	}
	shots := make([]any, 0, len(items))
	shotImageModeContexts := make([]botmodel.StoryboardShotImageModeContext, 0, len(items))
	shotIDs := make(map[string]struct{}, len(items))
	speechIDs := make(map[string]struct{})
	captionIDs := make(map[string]struct{})
	soundPolicy := botmodel.StoryboardSoundPolicyForWorkType(durationContract.WorkType)
	previousExitState := ""
	var previousStableMaterialIDs map[string]struct{}
	for index, item := range items {
		row, ok := item.(map[string]any)
		if !ok {
			return nil, fmt.Errorf("镜头 %d 格式无效", index+1)
		}
		shotID := uniqueStoryboardID(requiredString(row, "id"), fmt.Sprintf("shot-%d", index+1), shotIDs)
		duration, err := normalizeStoryboardShotDuration(row["duration"], durationContract)
		if err != nil {
			return nil, fmt.Errorf("镜头 %d: %w", index+1, err)
		}
		beat := requiredString(row, "beat")
		description := requiredString(row, "description")
		videoPrompt := requiredString(row, "video_prompt")
		if beat == "" && description == "" && videoPrompt == "" {
			return nil, fmt.Errorf("镜头 %d 缺少可执行的画面语义", index+1)
		}
		beat = firstStoryboardText(beat, description, videoPrompt)
		description = firstStoryboardText(description, videoPrompt, beat)
		videoPrompt = firstStoryboardText(videoPrompt, description, beat)
		transition := ""
		if index > 0 {
			transition = requiredString(row, "transition")
			if transition == "" {
				transition = fmt.Sprintf("承接上一镜头的结束状态，本镜头推进为：%s", beat)
			}
		}
		transitionTypeValue := requiredString(row, "transition_type")
		transitionType := botmodel.NormalizeStoryboardTransitionType(transitionTypeValue)
		if !botmodel.IsStoryboardTransitionType(transitionType) {
			// Optional edit metadata must not invalidate an otherwise usable script.
			transitionType = botmodel.StoryboardTransitionNone
		}
		transitionDurationMS, _ := integerValue(row["transition_duration_ms"])
		if index == 0 {
			transitionType = botmodel.StoryboardTransitionNone
			transitionDurationMS = 0
		} else if transitionType == botmodel.StoryboardTransitionNone {
			transitionDurationMS = 0
		} else {
			transitionDurationMS = max(100, min(5000, transitionDurationMS))
		}
		cameraInstruction := firstStoryboardText(requiredString(row, "camera_instruction"), "固定机位")
		materialIDs, materialIDSet := normalizeStoryboardMaterialIDs(
			row["material_ids"],
			materialTypes,
			materialIDLookup,
		)
		referenceKeys := normalizeStoryboardReferenceKeys(row["reference_keys"])
		matchPrevious, _ := row["match_previous"].(bool)
		continuePrevious, _ := row["continue_previous"].(bool)
		matchesPrevious := index > 0 && matchPrevious
		continuesPrevious := index > 0 && continuePrevious
		stableMaterialIDs := botmodel.StoryboardStableMaterialIDs(materialIDSet, materialTypes)
		if continuesPrevious && !botmodel.SameStoryboardMaterialIDSet(
			previousStableMaterialIDs,
			stableMaterialIDs,
		) {
			continuesPrevious = false
		}
		if continuesPrevious {
			matchesPrevious = false
		}
		shotImageMode := botmodel.NormalizeStoryboardShotImageModeForShot(
			requiredString(row, "shot_image_mode"),
			matchesPrevious,
			continuesPrevious,
		)
		speech := normalizeStoryboardSpeech(
			row["speech"],
			index,
			speechIDs,
			materialTypes,
			materialIDLookup,
			materialIDSet,
		)
		if !soundPolicy.GeneratedSpeech {
			speech = []any{}
		}
		duration = normalizeEstimatedStoryboardSpeech(speech, duration)
		if duration > durationContract.MaxShotDuration {
			return nil, fmt.Errorf(
				"镜头 %d 的对白无法在 %d 秒内完成，请精简对白或拆分镜头",
				index+1,
				durationContract.MaxShotDuration,
			)
		}
		continuityAnchor := ""
		if continuesPrevious {
			continuityAnchor = firstStoryboardText(
				requiredString(row, "continuity_anchor"),
				transition,
				"承接上一镜头结束状态，保持角色、场景、主体位置、姿态、动作方向与光线连续，并说明道具变化",
			)
		}
		continuityState, err := normalizeStoryboardContinuityState(
			row["continuity_state"],
			index,
		)
		if err != nil {
			return nil, err
		}
		if index > 0 && (matchesPrevious || continuesPrevious) {
			continuityState["entry"] = previousExitState
		}
		shotImageModeContexts = append(shotImageModeContexts, botmodel.StoryboardShotImageModeContext{
			Mode:              shotImageMode,
			MatchesPrevious:   matchesPrevious,
			ContinuesPrevious: continuesPrevious,
			EntryState:        requiredString(continuityState, "entry"),
			ExitState:         requiredString(continuityState, "exit"),
			CameraInstruction: cameraInstruction,
		})
		captions := normalizeStoryboardCaptions(row["captions"], index, float64(duration), captionIDs)
		if !soundPolicy.GeneratedCaptions {
			captions = []any{}
		}
		shots = append(shots, map[string]any{
			"id":                     shotID,
			"order":                  index + 1,
			"duration":               duration,
			"beat":                   beat,
			"transition":             transition,
			"transition_type":        transitionType,
			"transition_duration_ms": transitionDurationMS,
			"description":            description,
			"camera_instruction":     cameraInstruction,
			"video_prompt":           videoPrompt,
			"material_ids":           materialIDs,
			"reference_keys":         referenceKeys,
			"shot_image_mode":        shotImageMode,
			"match_previous":         matchesPrevious,
			"continue_previous":      continuesPrevious,
			"continuity_anchor":      continuityAnchor,
			"continuity_state":       continuityState,
			"lyric_line_indexes":     normalizeStoryboardLyricLineIndexes(row["lyric_line_indexes"]),
			"speech":                 speech,
			"captions":               captions,
		})
		previousExitState = requiredString(continuityState, "exit")
		previousStableMaterialIDs = stableMaterialIDs
	}
	if len(shots) == 0 {
		return nil, fmt.Errorf("shots 至少需要一个有效镜头")
	}
	for index, mode := range botmodel.NormalizeStoryboardShotImageModesForSequence(shotImageModeContexts) {
		shots[index].(map[string]any)["shot_image_mode"] = mode
	}
	return shots, nil
}

func normalizeStoryboardLyricsPlan(requestInput map[string]any, workType string, shots []any) (string, error) {
	lyricsInput := storyboardProfileInputText(requestInput[botmodel.StoryboardLyricsInputKey])
	lyrics := botmodel.NormalizeStoryboardLyrics(lyricsInput)
	if workType != botmodel.StoryboardWorkTypeMV || len(lyrics) == 0 {
		for _, value := range shots {
			value.(map[string]any)["lyric_line_indexes"] = []any{}
		}
		return "", nil
	}
	plans := make([]botmodel.StoryboardLyricShotPlan, 0, len(shots))
	for _, value := range shots {
		shot := value.(map[string]any)
		duration, _ := integerValue(shot["duration"])
		transitionDurationMS, _ := integerValue(shot["transition_duration_ms"])
		indexes := normalizeStoryboardLyricLineIndexes(shot["lyric_line_indexes"])
		shot["lyric_line_indexes"] = indexes
		plan := botmodel.StoryboardLyricShotPlan{
			Duration:             duration,
			TransitionDurationMS: transitionDurationMS,
		}
		for _, raw := range indexes {
			plan.LineIndexes = append(plan.LineIndexes, raw.(int))
		}
		plans = append(plans, plan)
	}
	completedPlans, err := botmodel.CompleteStoryboardLyricShotPlans(len(lyrics), plans)
	if err != nil {
		return "", err
	}
	for index, plan := range completedPlans {
		indexes := make([]any, len(plan.LineIndexes))
		for lineIndex, value := range plan.LineIndexes {
			indexes[lineIndex] = value
		}
		shots[index].(map[string]any)["lyric_line_indexes"] = indexes
	}
	return botmodel.BuildStoryboardLyricsLRCFromInput(lyricsInput, completedPlans)
}

func normalizeStoryboardLyricLineIndexes(value any) []any {
	seen := map[int]struct{}{}
	indexes := make([]int, 0)
	items, ok := storyboardValueItems(value)
	if !ok {
		return []any{}
	}
	for _, raw := range items {
		index, ok := integerValue(raw)
		if !ok || index < 1 {
			continue
		}
		if _, exists := seen[index]; exists {
			continue
		}
		seen[index] = struct{}{}
		indexes = append(indexes, index)
	}
	sort.Ints(indexes)
	result := make([]any, 0, len(indexes))
	for _, index := range indexes {
		result = append(result, index)
	}
	return result
}

func normalizeStoryboardContinuityState(value any, shotIndex int) (map[string]any, error) {
	state, ok := value.(map[string]any)
	if !ok {
		return nil, fmt.Errorf("镜头 %d 的连续状态格式无效", shotIndex+1)
	}
	entry := requiredString(state, "entry")
	exit := requiredString(state, "exit")
	if entry == "" || exit == "" {
		return nil, fmt.Errorf("镜头 %d 必须填写入镜状态和出镜状态", shotIndex+1)
	}
	return map[string]any{
		"entry": entry,
		"exit":  exit,
	}, nil
}

func normalizeStoryboardShotDuration(value any, contract storyboardGenerationContract) (int, error) {
	duration, ok := integerValue(value)
	if !ok {
		return 0, fmt.Errorf("duration 必须是整数")
	}
	if duration < contract.MinShotDuration {
		return contract.MinShotDuration, nil
	}
	if duration > contract.MaxShotDuration {
		return 0, fmt.Errorf(
			"duration %d 秒超过本次允许的最大时长 %d 秒",
			duration,
			contract.MaxShotDuration,
		)
	}
	return duration, nil
}

func normalizeStoryboardSpeech(
	value any,
	shotIndex int,
	usedIDs map[string]struct{},
	materialTypes map[string]string,
	materialIDLookup map[string]string,
	shotMaterialIDs map[string]struct{},
) []any {
	items := storyboardSpeechItems(value)
	result := make([]any, 0, len(items))
	visibleCharacterID := ""
	for index, item := range items {
		row, ok := item.(map[string]any)
		if !ok {
			if text, textOK := item.(string); textOK {
				row = map[string]any{"kind": "narration", "text": text}
			} else {
				continue
			}
		}
		text := requiredString(row, "text")
		if text == "" {
			continue
		}
		id := uniqueStoryboardID(requiredString(row, "id"), fmt.Sprintf("speech-%d-%d", shotIndex+1, index+1), usedIDs)
		kind := normalizeStoryboardSpeechKind(requiredString(row, "kind"))
		characterID := resolveStoryboardMaterialID(requiredString(row, "character_id"), materialIDLookup)
		if kind == "" {
			if characterID != "" {
				kind = "dialogue"
			} else {
				kind = "narration"
			}
		}
		startTime, ok := numberValue(row["start_time"])
		if !ok || startTime < 0 {
			startTime = 0
		}
		subtitleEnabled, ok := row["subtitle_enabled"].(bool)
		if !ok {
			subtitleEnabled = true
		}
		normalized := map[string]any{
			"id":               id,
			"kind":             kind,
			"text":             text,
			"start_time":       startTime,
			"subtitle_enabled": subtitleEnabled,
			"subtitle_text":    requiredString(row, "subtitle_text"),
		}
		if kind == "dialogue" {
			if materialTypes[characterID] != "character" {
				characterID = singleStoryboardCharacterID(shotMaterialIDs, materialTypes)
			}
			if _, exists := shotMaterialIDs[characterID]; !exists || materialTypes[characterID] != "character" {
				normalized["kind"] = "narration"
				result = append(result, normalized)
				continue
			}
			speakerMode := normalizeStoryboardSpeakerMode(requiredString(row, "speaker_mode"))
			if speakerMode == "visible" {
				if visibleCharacterID != "" && visibleCharacterID != characterID {
					speakerMode = "offscreen"
				} else {
					visibleCharacterID = characterID
				}
			}
			normalized["character_id"] = characterID
			normalized["speaker_mode"] = speakerMode
		}
		result = append(result, normalized)
	}
	return result
}

type storyboardSpeechWindow struct {
	row      map[string]any
	start    float64
	duration float64
}

func normalizeEstimatedStoryboardSpeech(values []any, duration int) int {
	windows := make([]storyboardSpeechWindow, 0, len(values))
	totalDuration := 0.0
	for _, value := range values {
		row, _ := value.(map[string]any)
		start, _ := numberValue(row["start_time"])
		speechDuration := botmodel.EstimateStoryboardSpeechDuration(requiredString(row, "text"))
		windows = append(windows, storyboardSpeechWindow{
			row:      row,
			start:    start,
			duration: speechDuration,
		})
		totalDuration += speechDuration
	}
	sort.SliceStable(windows, func(left int, right int) bool {
		return windows[left].start < windows[right].start
	})
	if len(windows) == 0 {
		return duration
	}
	normalizedDuration := max(duration, int(math.Ceil(totalDuration)))
	cursor := 0.0
	remainingDuration := totalDuration
	for _, current := range windows {
		remainingDuration -= current.duration
		latestStart := float64(normalizedDuration) - current.duration - remainingDuration
		start := max(cursor, min(current.start, latestStart))
		current.row["start_time"] = start
		cursor = start + current.duration
	}
	return normalizedDuration
}

func normalizeStoryboardCaptions(
	value any,
	shotIndex int,
	duration float64,
	usedIDs map[string]struct{},
) []any {
	items := storyboardCaptionItems(value)
	result := make([]any, 0, len(items))
	for index, item := range items {
		row, ok := item.(map[string]any)
		if !ok {
			if text, textOK := item.(string); textOK {
				row = map[string]any{"text": text}
			} else {
				continue
			}
		}
		text := requiredString(row, "text")
		if text == "" {
			continue
		}
		id := uniqueStoryboardID(requiredString(row, "id"), fmt.Sprintf("caption-%d-%d", shotIndex+1, index+1), usedIDs)
		captionType := normalizeStoryboardCaptionType(requiredString(row, "type"))
		if captionType != "caption" && captionType != "title" && captionType != "highlight" {
			captionType = "caption"
		}
		startTime, startOK := numberValue(row["start_time"])
		endTime, endOK := numberValue(row["end_time"])
		if !startOK || startTime < 0 || startTime >= duration {
			startTime = 0
		}
		if !endOK || endTime <= startTime || endTime > duration {
			endTime = duration
		}
		result = append(result, map[string]any{
			"id":         id,
			"type":       captionType,
			"text":       text,
			"start_time": startTime,
			"end_time":   endTime,
		})
	}
	return result
}

func normalizeStoryboardMaterials(value any) ([]any, map[string]string, map[string]string, error) {
	items, ok := storyboardValueItems(value)
	if !ok {
		return nil, nil, nil, fmt.Errorf("materials 必须是素材数组")
	}
	result := make([]any, 0, len(items))
	materialTypes := make(map[string]string, len(items))
	materialIDLookup := make(map[string]string, len(items)*2)
	materialNames := make(map[string]struct{}, len(items))
	materialIDs := make(map[string]struct{}, len(items))
	for index, item := range items {
		row, ok := item.(map[string]any)
		if !ok {
			return nil, nil, nil, fmt.Errorf("素材 %d 格式无效", index+1)
		}
		materialType := inferStoryboardMaterialType(row)
		id := uniqueStoryboardID(requiredString(row, "id"), fmt.Sprintf("%s-%d", materialType, index+1), materialIDs)
		name := firstStoryboardText(
			normalizeStoryboardMaterialName(requiredString(row, "name")),
			fmt.Sprintf("%s%d", storyboardMaterialTypeLabel(materialType), index+1),
		)
		name = uniqueStoryboardName(name, materialNames)
		prompt := firstStoryboardText(requiredString(row, "prompt"), fmt.Sprintf("%s的清晰素材设定图", name))
		voice := requiredString(row, "voice")
		referenceKeys := normalizeStoryboardReferenceKeys(row["reference_keys"])
		if materialType != "character" {
			voice = ""
		}
		materialTypes[id] = materialType
		materialIDLookup[storyboardLookupKey(id)] = id
		materialIDLookup[storyboardLookupKey(name)] = id
		result = append(result, map[string]any{
			"id":             id,
			"type":           materialType,
			"name":           name,
			"prompt":         prompt,
			"voice":          voice,
			"reference_keys": referenceKeys,
		})
	}
	return result, materialTypes, materialIDLookup, nil
}

func normalizeStoryboardReferenceKeys(value any) []any {
	items := storyboardStringItems(value)
	result := make([]any, 0, len(items))
	seen := make(map[string]struct{}, len(items))
	for _, key := range items {
		if _, exists := seen[key]; exists {
			continue
		}
		seen[key] = struct{}{}
		result = append(result, key)
	}
	return result
}

func normalizeStoryboardMaterialIDs(
	value any,
	materialTypes map[string]string,
	materialIDLookup map[string]string,
) ([]any, map[string]struct{}) {
	items := storyboardStringItems(value)
	result := make([]any, 0, len(items))
	seen := make(map[string]struct{}, len(items))
	for _, value := range items {
		id := resolveStoryboardMaterialID(value, materialIDLookup)
		if _, exists := materialTypes[id]; !exists {
			continue
		}
		if _, exists := seen[id]; exists {
			continue
		}
		seen[id] = struct{}{}
		result = append(result, id)
	}
	return result, seen
}

func storyboardValueItems(value any) ([]any, bool) {
	switch current := value.(type) {
	case nil:
		return []any{}, true
	case []any:
		return current, true
	case map[string]any:
		return []any{current}, true
	default:
		return nil, false
	}
}

func storyboardSpeechItems(value any) []any {
	if text, ok := value.(string); ok {
		return []any{text}
	}
	items, ok := storyboardValueItems(value)
	if !ok {
		return []any{}
	}
	return items
}

func storyboardCaptionItems(value any) []any {
	return storyboardSpeechItems(value)
}

func storyboardStringItems(value any) []string {
	var raw []any
	switch current := value.(type) {
	case nil:
		return []string{}
	case string:
		raw = []any{current}
	case []string:
		raw = make([]any, 0, len(current))
		for _, item := range current {
			raw = append(raw, item)
		}
	case []any:
		raw = current
	default:
		return []string{}
	}
	result := make([]string, 0, len(raw))
	for _, item := range raw {
		text, ok := item.(string)
		text = strings.TrimSpace(text)
		if ok && text != "" {
			result = append(result, text)
		}
	}
	return result
}

func uniqueStoryboardID(preferred string, fallback string, used map[string]struct{}) string {
	base := firstStoryboardText(preferred, fallback, "item")
	candidate := base
	for suffix := 2; ; suffix++ {
		if _, exists := used[candidate]; !exists {
			used[candidate] = struct{}{}
			return candidate
		}
		candidate = fmt.Sprintf("%s-%d", base, suffix)
	}
}

func uniqueStoryboardName(preferred string, used map[string]struct{}) string {
	base := firstStoryboardText(preferred, "未命名素材")
	candidate := base
	for suffix := 2; ; suffix++ {
		key := storyboardLookupKey(candidate)
		if _, exists := used[key]; !exists {
			used[key] = struct{}{}
			return candidate
		}
		candidate = fmt.Sprintf("%s %d", base, suffix)
	}
}

func storyboardLookupKey(value string) string {
	return strings.ToLower(normalizeStoryboardMaterialName(value))
}

func resolveStoryboardMaterialID(value string, lookup map[string]string) string {
	value = strings.TrimSpace(value)
	if id := lookup[storyboardLookupKey(value)]; id != "" {
		return id
	}
	return value
}

func normalizeStoryboardMaterialType(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "character", "role", "person", "角色", "人物":
		return "character"
	case "scene", "location", "environment", "场景", "地点", "环境":
		return "scene"
	case "prop", "object", "item", "道具", "物品":
		return "prop"
	default:
		return ""
	}
}

func inferStoryboardMaterialType(row map[string]any) string {
	if materialType := normalizeStoryboardMaterialType(requiredString(row, "type")); materialType != "" {
		return materialType
	}
	if requiredString(row, "voice") != "" {
		return "character"
	}
	identity := strings.ToLower(strings.Join([]string{
		requiredString(row, "id"),
		requiredString(row, "name"),
	}, " "))
	if containsStoryboardHint(identity, "scene", "location", "environment", "场景", "地点", "环境", "房间", "街道", "小巷", "公园", "广场") {
		return "scene"
	}
	if containsStoryboardHint(identity, "prop", "object", "item", "道具", "物品", "产品", "手机", "雨伞", "纸船", "口红") {
		return "prop"
	}
	if containsStoryboardHint(identity, "character", "role", "person", "角色", "人物", "女孩", "男孩", "男人", "女人", "老人", "猫", "狗") {
		return "character"
	}
	prompt := strings.ToLower(requiredString(row, "prompt"))
	if containsStoryboardHint(prompt, "全身", "半身", "正面", "侧面", "背面", "五官", "发型", "服装", "character sheet") {
		return "character"
	}
	if containsStoryboardHint(prompt, "场景全景", "空间结构", "室内环境", "室外环境", "建筑", "街景", "environment design") {
		return "scene"
	}
	if containsStoryboardHint(prompt, "产品图", "道具图", "物品", "材质细节", "尺寸比例", "object design") {
		return "prop"
	}
	return "character"
}

func containsStoryboardHint(content string, hints ...string) bool {
	for _, hint := range hints {
		if strings.Contains(content, hint) {
			return true
		}
	}
	return false
}

func storyboardMaterialTypeLabel(materialType string) string {
	switch materialType {
	case "character":
		return "角色"
	case "scene":
		return "场景"
	default:
		return "道具"
	}
}

func normalizeStoryboardSpeechKind(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "dialogue", "dialog", "speech", "对白", "台词":
		return "dialogue"
	case "narration", "narrator", "voiceover", "voice_over", "旁白", "解说":
		return "narration"
	default:
		return ""
	}
}

func normalizeStoryboardSpeakerMode(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "visible", "onscreen", "on_screen", "出镜", "画内":
		return "visible"
	default:
		return "offscreen"
	}
}

func normalizeStoryboardCaptionType(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "title", "标题":
		return "title"
	case "highlight", "重点", "强调":
		return "highlight"
	default:
		return "caption"
	}
}

func singleStoryboardCharacterID(materialIDs map[string]struct{}, materialTypes map[string]string) string {
	characterID := ""
	for id := range materialIDs {
		if materialTypes[id] != "character" {
			continue
		}
		if characterID != "" {
			return ""
		}
		characterID = id
	}
	return characterID
}

func firstStoryboardText(values ...string) string {
	for _, value := range values {
		if text := strings.TrimSpace(value); text != "" {
			return text
		}
	}
	return ""
}

func normalizeStoryboardMaterialName(value string) string {
	return strings.TrimSpace(strings.TrimLeft(strings.TrimSpace(value), "@#"))
}

func requiredString(row map[string]any, key string) string {
	value, ok := stringField(row, key)
	if !ok {
		return ""
	}
	return value
}

func stringField(row map[string]any, key string) (string, bool) {
	value, exists := row[key]
	if !exists {
		return "", false
	}
	text, ok := value.(string)
	if !ok {
		return "", false
	}
	return strings.TrimSpace(text), true
}

func integerValue(value any) (int, bool) {
	number, ok := numberValue(value)
	if !ok || math.Trunc(number) != number {
		return 0, false
	}
	return int(number), true
}

func numberValue(value any) (float64, bool) {
	switch current := value.(type) {
	case float64:
		return current, !math.IsNaN(current) && !math.IsInf(current, 0)
	case float32:
		parsed := float64(current)
		return parsed, !math.IsNaN(parsed) && !math.IsInf(parsed, 0)
	case int:
		return float64(current), true
	case int64:
		return float64(current), true
	case json.Number:
		parsed, err := current.Float64()
		return parsed, err == nil && !math.IsNaN(parsed) && !math.IsInf(parsed, 0)
	case string:
		parsed, err := strconv.ParseFloat(strings.TrimSpace(current), 64)
		return parsed, err == nil && !math.IsNaN(parsed) && !math.IsInf(parsed, 0)
	default:
		return 0, false
	}
}
