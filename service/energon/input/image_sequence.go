package input

import (
	"context"
	"strings"

	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func PrepareImageSequenceInput(
	ctx context.Context,
	repo Repository,
	target Target,
	values map[string]any,
	mediaParams []PowerParam,
	references []MediaReference,
) map[string]any {
	result, orderedParams := NormalizeImageSequenceMediaInput(ctx, repo, target, values, mediaParams)
	references = append([]MediaReference(nil), references...)
	for index := range references {
		references[index].URL = FileString(ctx, references[index].URL)
	}
	prompt := AppendMediaReferenceIndex(botprotocol.AsText(values["prompt"]), imageSequenceInputReferences(result, orderedParams, references))
	result["prompt"] = prompt
	params := repo.ParamMap(ctx)
	promptKeys := mediaPromptInputKeys(ctx, repo, target, params)
	for paramID, keys := range promptKeys {
		updated := false
		for _, key := range keys {
			if value, exists := result[key]; exists && !IsMissing(value) {
				result[key] = prompt
				updated = true
			}
		}
		if key := strings.TrimSpace(params[paramID].Key); !updated && key != "" {
			result[key] = prompt
		}
	}
	return result
}

func NormalizeImageSequenceMediaInput(
	ctx context.Context,
	repo Repository,
	target Target,
	values map[string]any,
	mediaParams []PowerParam,
) (map[string]any, []PowerParam) {
	params := repo.ParamMap(ctx)
	result := NormalizeParamInput(ctx, repo, target.PowerID, target.ServiceID, values, params)
	effectiveValues := cloneMediaReferenceValues(result)
	serviceParams := repo.ServiceParamsByService(ctx, target.ServiceID)
	activeParams := FilterActivePowerParams(mediaParams, result)
	orderedParams := make([]PowerParam, 0, len(mediaParams))
	for _, serviceParam := range serviceParams {
		param, exists := params[serviceParam.ParamID]
		if !exists || !IsActive(param.Status) || !IsActive(serviceParam.Status) || !serviceParamAcceptsInput(serviceParam) {
			continue
		}
		if !ServiceParamConditionMatches(EffectiveServiceParamCondition(serviceParam, serviceParams), result, params) {
			continue
		}
		for _, mediaParam := range activeParams {
			if mediaParam.ParamID != param.ID || !IsFileParamType(mediaParam.Type) {
				continue
			}
			if mediaParam.ID > 0 && mediaParam.ID != serviceParam.ID {
				continue
			}
			_, value, exists := resolveServiceParamInputValue(effectiveValues, serviceParam, param)
			if exists {
				result[mediaParam.Key] = value
				for _, key := range serviceParamInputKeys(serviceParam, param) {
					if key != mediaParam.Key {
						delete(result, key)
					}
				}
				orderedParams = append(orderedParams, mediaParam)
			}
			break
		}
	}
	if len(serviceParams) == 0 {
		orderedParams = activeParams
	}
	return result, orderedParams
}

func imageSequenceInputReferences(values map[string]any, params []PowerParam, references []MediaReference) []MediaReference {
	result := make([]MediaReference, 0, len(references))
	seen := map[string]bool{}
	for _, param := range params {
		if !IsFileParamType(param.Type) || seen[param.Key] {
			continue
		}
		seen[param.Key] = true
		result = append(result, mediaInputReferences(StringList(values[param.Key]), param, references)...)
	}
	return result
}

func mediaInputReferences(urls []string, param PowerParam, references []MediaReference) []MediaReference {
	result := make([]MediaReference, 0, len(urls))
	for _, url := range urls {
		reference := MediaReference{URL: url, Usage: param.Key}
		if len(param.AcceptedKinds) == 1 {
			reference.Kind = normalizeMediaKind(param.AcceptedKinds[0])
		}
		matched := false
		for _, candidate := range references {
			if strings.TrimSpace(candidate.URL) == url && (len(param.AcceptedKinds) == 0 || MediaParamSupports(param, candidate.Kind)) {
				if matched && candidate.Usage != param.Key {
					continue
				}
				reference = candidate
				matched = true
				if reference.Usage == "" {
					reference.Usage = param.Key
				}
				if candidate.Usage == param.Key {
					break
				}
			}
		}
		if reference.Kind == "" {
			continue
		}
		result = append(result, reference)
	}
	return result
}
