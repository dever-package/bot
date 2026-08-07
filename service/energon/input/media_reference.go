package input

import (
	"fmt"
	"sort"
	"strconv"
	"strings"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type MediaReference struct {
	ReferenceType string
	ReferenceID   uint64
	Label         string
	Kind          string
	URL           string
	Usage         string
	StrictUsage   bool
	Required      bool
}

type MediaReferenceSelection struct {
	URL   string
	Index int
	Items []MediaReferenceSelectionItem
}

type MediaReferenceSelectionItem struct {
	URL   string `json:"url,omitempty"`
	Index int    `json:"index,omitempty"`
	Usage string `json:"usage,omitempty"`
}

type MediaReferenceBinding struct {
	Reference MediaReference
	ParamKey  string
}

type MediaReferenceBindResult struct {
	Values  map[string]any
	Bound   []MediaReferenceBinding
	Unbound []MediaReference
}

// MediaReferencesFromContent resolves every media URL stored by one logical
// reference. The URL order is preserved so configured media parameters can
// apply their own cardinality and ordering rules.
func MediaReferencesFromContent(
	referenceType string,
	referenceID uint64,
	kind string,
	content any,
	usage string,
) []MediaReference {
	gridKind, urls := storyboardGridMedia(content)
	if gridKind != "" && len(urls) > 0 {
		kind = gridKind
	} else {
		kind = normalizeMediaKind(kind)
		urls = nil
	}
	if kind != "" && len(urls) == 0 {
		urls = botprotocol.ExtractPrimaryMediaURLs(content, kind)
	}
	if referenceID == 0 || kind == "" || len(urls) == 0 {
		return nil
	}
	referenceType = strings.TrimSpace(referenceType)
	usage = strings.TrimSpace(usage)
	result := make([]MediaReference, 0, len(urls))
	for _, url := range urls {
		result = append(result, MediaReference{
			ReferenceType: referenceType,
			ReferenceID:   referenceID,
			Kind:          kind,
			URL:           url,
			Usage:         usage,
			StrictUsage:   usage != "",
		})
	}
	return result
}

// SelectMediaReferences narrows one logical multi-media reference to the
// concrete item selected by the client. The URL protects against stale asset
// content while the 1-based index preserves the source order.
func SelectMediaReferences(
	references []MediaReference,
	selection MediaReferenceSelection,
) ([]MediaReference, error) {
	if len(selection.Items) > 0 {
		selected := make([]MediaReference, 0, len(selection.Items))
		selectedIndexes := make(map[int]struct{}, len(selection.Items))
		for _, item := range selection.Items {
			reference, index, err := selectMediaReference(references, item.URL, item.Index)
			if err != nil {
				return nil, err
			}
			if _, exists := selectedIndexes[index]; exists {
				return nil, fmt.Errorf("所选素材包含重复项，请重新选择")
			}
			selectedIndexes[index] = struct{}{}
			if usage := strings.TrimSpace(item.Usage); usage != "" {
				reference.Usage = usage
				reference.StrictUsage = true
			}
			selected = append(selected, reference)
		}
		return selected, nil
	}

	selection.URL = strings.TrimSpace(selection.URL)
	if selection.URL == "" && selection.Index <= 0 {
		return references, nil
	}
	reference, _, err := selectMediaReference(references, selection.URL, selection.Index)
	if err != nil {
		return nil, err
	}
	return []MediaReference{reference}, nil
}

func selectMediaReference(
	references []MediaReference,
	url string,
	index int,
) (MediaReference, int, error) {
	if len(references) == 0 {
		return MediaReference{}, -1, fmt.Errorf("所选素材没有可用的媒体内容")
	}

	url = strings.TrimSpace(url)
	selectedIndex := -1
	if url != "" {
		for currentIndex, reference := range references {
			if strings.TrimSpace(reference.URL) == url {
				selectedIndex = currentIndex
				break
			}
		}
		if selectedIndex < 0 {
			return MediaReference{}, -1, fmt.Errorf("所选具体素材已不属于资产当前版本，请重新选择")
		}
	}
	if index > 0 {
		resolvedIndex := index - 1
		if resolvedIndex >= len(references) {
			return MediaReference{}, -1, fmt.Errorf("所选具体素材序号已失效，请重新选择")
		}
		if selectedIndex >= 0 && selectedIndex != resolvedIndex {
			return MediaReference{}, -1, fmt.Errorf("所选具体素材与资产当前版本不一致，请重新选择")
		}
		selectedIndex = resolvedIndex
	}
	if selectedIndex < 0 {
		return MediaReference{}, -1, fmt.Errorf("请选择具体素材")
	}
	return references[selectedIndex], selectedIndex, nil
}

// SelectedMediaReferenceContent narrows the prompt-side representation when
// the user selected one item from a multi-media asset. This keeps structured
// context aligned with the media parameters sent to the provider.
func SelectedMediaReferenceContent(
	content any,
	references []MediaReference,
	selection MediaReferenceSelection,
) any {
	if len(selection.Items) == 0 &&
		strings.TrimSpace(selection.URL) == "" && selection.Index <= 0 {
		return content
	}
	if len(references) == 0 {
		return content
	}
	kind := normalizeMediaKind(references[0].Kind)
	if kind == "" {
		return content
	}
	urls := make([]string, 0, len(references))
	for _, reference := range references {
		if normalizeMediaKind(reference.Kind) != kind {
			return content
		}
		if url := strings.TrimSpace(reference.URL); url != "" {
			urls = append(urls, url)
		}
	}
	if len(urls) == 0 {
		return content
	}
	return map[string]any{
		"type":     "media_reference",
		"kind":     kind,
		kind + "s": urls,
	}
}

func storyboardGridMedia(content any) (string, []string) {
	document := storyboardGridDocument(content)
	if botmodel.NormalizeOutputType(ValueText(document["type"])) != botmodel.OutputTypeStoryboardGrid {
		output := botprotocol.ExtractOutput(content)
		document = storyboardGridDocument(output["json"])
	}
	if botmodel.NormalizeOutputType(ValueText(document["type"])) != botmodel.OutputTypeStoryboardGrid {
		return "", nil
	}

	images := make([]string, 0, botmodel.StoryboardGridMaxImages)
	for _, frame := range storyboardGridFrames(document["frames"]) {
		images = append(images, botprotocol.NormalizeMediaList(frame["image"], botprotocol.MediaTypeImage)...)
	}
	return botprotocol.MediaTypeImage, botprotocol.NormalizeMediaList(images, botprotocol.MediaTypeImage)
}

func storyboardGridDocument(value any) map[string]any {
	switch current := value.(type) {
	case map[string]any:
		return current
	case botprotocol.Output:
		document := make(map[string]any, len(current))
		for key, item := range current {
			document[key] = item
		}
		return document
	case string:
		parsed := ParseJSONValue(current)
		if _, unchanged := parsed.(string); unchanged {
			return nil
		}
		return storyboardGridDocument(parsed)
	default:
		return nil
	}
}

func storyboardGridFrames(value any) []map[string]any {
	var frames []map[string]any
	switch current := value.(type) {
	case []map[string]any:
		frames = append([]map[string]any(nil), current...)
	case []any:
		frames = make([]map[string]any, 0, len(current))
		for _, item := range current {
			if frame := storyboardGridDocument(item); frame != nil {
				frames = append(frames, frame)
			}
		}
	default:
		return nil
	}
	sort.SliceStable(frames, func(left, right int) bool {
		return storyboardGridFrameOrder(frames[left], left) <
			storyboardGridFrameOrder(frames[right], right)
	})
	return frames
}

func storyboardGridFrameOrder(frame map[string]any, fallback int) int {
	order, err := strconv.Atoi(strings.TrimSpace(ValueText(frame["order"])))
	if err != nil || order <= 0 {
		return fallback + 1
	}
	return order
}

// BindMediaReferences projects resolved media URLs into configured capability
// parameters. It never infers provider-native fields; service mappings retain
// ownership of the final request body.
func BindMediaReferences(
	values map[string]any,
	params []PowerParam,
	references []MediaReference,
) (MediaReferenceBindResult, error) {
	params = FilterActivePowerParams(params, values)
	result := MediaReferenceBindResult{
		Values:  cloneMediaReferenceValues(values),
		Bound:   make([]MediaReferenceBinding, 0, len(references)),
		Unbound: make([]MediaReference, 0),
	}
	if len(references) == 0 {
		return result, nil
	}
	referenceMediaCounts := countLogicalMediaReferences(references)

	paramByKey := make(map[string]PowerParam, len(params))
	for _, param := range params {
		if key := normalizeMediaParamKey(param.Key); key != "" {
			paramByKey[key] = param
		}
	}

	for _, reference := range references {
		reference.Kind = normalizeMediaKind(reference.Kind)
		reference.URL = strings.TrimSpace(reference.URL)
		reference.Usage = strings.TrimSpace(reference.Usage)
		if reference.Kind == "" || reference.URL == "" {
			if reference.Required {
				return MediaReferenceBindResult{}, fmt.Errorf("必需的媒体引用无效")
			}
			result.Unbound = append(result.Unbound, reference)
			continue
		}

		param, explicit, matched := mediaReferenceTarget(paramByKey, params, reference)
		if !matched {
			if reference.StrictUsage {
				return MediaReferenceBindResult{}, fmt.Errorf(
					"当前能力参数 %s 不支持引用%s素材",
					reference.Usage,
					mediaKindLabel(reference.Kind),
				)
			}
			if reference.Required {
				candidates := MediaParamsForKind(params, reference.Kind)
				if len(candidates) > 1 {
					return MediaReferenceBindResult{}, fmt.Errorf(
						"%s素材未指定用途，请选择对应的能力参数",
						mediaKindLabel(reference.Kind),
					)
				}
				return MediaReferenceBindResult{}, fmt.Errorf(
					"当前能力未配置可接收%s素材的参数",
					mediaKindLabel(reference.Kind),
				)
			}
			result.Unbound = append(result.Unbound, reference)
			continue
		}
		if mediaParamCapacity(param) == 1 &&
			(reference.Required || reference.StrictUsage) &&
			referenceMediaCounts[logicalMediaReferenceKey(reference)] > 1 {
			paramName := mediaParamLabel(param)
			if paramName == "" {
				paramName = mediaKindLabel(reference.Kind)
			}
			return MediaReferenceBindResult{}, fmt.Errorf(
				"%s素材包含多份内容，当前%s参数只接收一个文件，请从集合中选择具体素材",
				mediaKindLabel(reference.Kind),
				paramName,
			)
		}

		key := strings.TrimSpace(param.Key)
		current := uniqueMediaURLs(StringList(result.Values[key]))
		if containsMediaURL(current, reference.URL) {
			result.Bound = append(result.Bound, MediaReferenceBinding{
				Reference: reference,
				ParamKey:  key,
			})
			continue
		}
		if capacity := mediaParamCapacity(param); capacity > 0 && len(current) >= capacity {
			// One asset may contain multiple media files. Once that logical
			// reference has been bound, optional extra files may remain prompt
			// context. Required references must never be silently discarded.
			if !reference.Required && mediaReferenceAlreadyBound(result.Bound, reference, key) {
				result.Unbound = append(result.Unbound, reference)
				continue
			}
			if explicit || reference.StrictUsage || reference.Required {
				return MediaReferenceBindResult{}, fmt.Errorf(
					"当前能力的%s参数一次最多使用 %d 个素材",
					mediaParamLabel(param),
					capacity,
				)
			}
			result.Unbound = append(result.Unbound, reference)
			continue
		}

		current = append(current, reference.URL)
		if mediaParamCapacity(param) == 1 {
			result.Values[key] = current[0]
		} else {
			result.Values[key] = current
		}
		result.Bound = append(result.Bound, MediaReferenceBinding{
			Reference: reference,
			ParamKey:  key,
		})
	}
	return result, nil
}

type logicalMediaReference struct {
	referenceType string
	referenceID   uint64
	kind          string
	usage         string
}

func countLogicalMediaReferences(references []MediaReference) map[logicalMediaReference]int {
	counts := make(map[logicalMediaReference]int, len(references))
	for _, reference := range references {
		key := logicalMediaReferenceKey(reference)
		if key.referenceID == 0 || key.kind == "" || strings.TrimSpace(reference.URL) == "" {
			continue
		}
		counts[key]++
	}
	return counts
}

func logicalMediaReferenceKey(reference MediaReference) logicalMediaReference {
	return logicalMediaReference{
		referenceType: strings.TrimSpace(reference.ReferenceType),
		referenceID:   reference.ReferenceID,
		kind:          normalizeMediaKind(reference.Kind),
		usage:         normalizeMediaParamKey(reference.Usage),
	}
}

func MediaParamSupports(param PowerParam, kind string) bool {
	if !IsFileParamType(param.Type) {
		return false
	}
	kind = normalizeMediaKind(kind)
	for _, accepted := range param.AcceptedKinds {
		if normalizeMediaKind(accepted) == kind {
			return true
		}
	}
	return false
}

func MediaParamsForKind(params []PowerParam, kind string) []PowerParam {
	result := make([]PowerParam, 0)
	for _, param := range params {
		if MediaParamSupports(param, kind) {
			result = append(result, param)
		}
	}
	return result
}

func mediaReferenceTarget(
	paramByKey map[string]PowerParam,
	params []PowerParam,
	reference MediaReference,
) (PowerParam, bool, bool) {
	if reference.Usage != "" {
		if param, exists := paramByKey[normalizeMediaParamKey(reference.Usage)]; exists &&
			MediaParamSupports(param, reference.Kind) {
			return param, true, true
		}
		if reference.StrictUsage {
			return PowerParam{}, true, false
		}
	}
	candidates := MediaParamsForKind(params, reference.Kind)
	if len(candidates) == 1 {
		return candidates[0], false, true
	}
	return PowerParam{}, false, false
}

func normalizeMediaUsageRole(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	return strings.NewReplacer("_", "", "-", "", " ", "").Replace(value)
}

func mediaParamCapacity(param PowerParam) int {
	if NormalizeParamControlType(param.Type) != "files" {
		return 1
	}
	if param.MaxFiles > 0 {
		return param.MaxFiles
	}
	return 0
}

func normalizeMediaParamKey(value string) string {
	return strings.ToLower(strings.TrimSpace(value))
}

func normalizeMediaKind(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "image", "video", "audio", "file":
		return strings.ToLower(strings.TrimSpace(value))
	default:
		return ""
	}
}

func mediaKindLabel(kind string) string {
	switch normalizeMediaKind(kind) {
	case "image":
		return "图片"
	case "video":
		return "视频"
	case "audio":
		return "音频"
	default:
		return "文件"
	}
}

func mediaParamLabel(param PowerParam) string {
	if name := strings.TrimSpace(param.Name); name != "" {
		return name
	}
	return strings.TrimSpace(param.Key)
}

func cloneMediaReferenceValues(values map[string]any) map[string]any {
	result := make(map[string]any, len(values)+4)
	for key, value := range values {
		result[key] = value
	}
	return result
}

func uniqueMediaURLs(values []string) []string {
	result := make([]string, 0, len(values))
	seen := map[string]struct{}{}
	for _, value := range values {
		value = strings.TrimSpace(value)
		if value == "" {
			continue
		}
		if _, exists := seen[value]; exists {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
}

func containsMediaURL(values []string, target string) bool {
	target = strings.TrimSpace(target)
	for _, value := range values {
		if strings.TrimSpace(value) == target {
			return true
		}
	}
	return false
}

func mediaReferenceAlreadyBound(
	bindings []MediaReferenceBinding,
	reference MediaReference,
	paramKey string,
) bool {
	if reference.ReferenceID == 0 {
		return false
	}
	for _, binding := range bindings {
		if binding.ParamKey == paramKey &&
			binding.Reference.ReferenceID == reference.ReferenceID &&
			binding.Reference.ReferenceType == reference.ReferenceType {
			return true
		}
	}
	return false
}
