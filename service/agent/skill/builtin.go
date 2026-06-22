package skill

import (
	"context"
	"crypto/sha256"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const (
	BuiltinArticleImportKey         = "front.article_import"
	BuiltinMethodImportArticleURL   = "front.import_article_url"
	BuiltinMethodImportURLResource  = "front.import_url_resource"
	frontImportArticleURLService    = "front.article.ArticleBuiltinService.ImportArticleURL"
	frontImportURLResourceService   = "front.upload.UploadBuiltinService.ImportURLResource"
	builtinArticleImportDescription = "内置文章导入能力。支持从文章链接解析标题、正文结构和外部媒体资源，并可按需转存外部资源。"
)

type BuiltinMethod struct {
	Key         string `json:"key"`
	Service     string `json:"service"`
	Description string `json:"description"`
}

type BuiltinDefinition struct {
	Key         string
	Name        string
	Description string
	Triggers    []string
	Domains     []string
	Targets     []string
	Methods     []BuiltinMethod
	Content     string
}

func BuiltinDefinitions() []BuiltinDefinition {
	return []BuiltinDefinition{
		{
			Key:         BuiltinArticleImportKey,
			Name:        "文章导入",
			Description: builtinArticleImportDescription,
			Triggers:    []string{"文章导入", "链接导入", "自媒体采集", "公众号采集", "网页正文采集"},
			Domains:     []string{"article", "media", "import"},
			Targets:     []string{"article_import", "rich_text"},
			Methods: []BuiltinMethod{
				{
					Key:         BuiltinMethodImportArticleURL,
					Service:     frontImportArticleURLService,
					Description: "解析文章链接，返回 title/html/assets/source_url/site。",
				},
				{
					Key:         BuiltinMethodImportURLResource,
					Service:     frontImportURLResourceService,
					Description: "把外部图片、视频、音频或文件链接转存为平台资源，返回上传文件信息。",
				},
			},
			Content: strings.TrimSpace(`
本技能提供平台内置文章导入工具，不需要安装脚本。

可用工具：
- front.import_article_url：输入 url，解析文章标题、正文 HTML 和外部资源列表。适合公众号、头条、自媒体或普通网页正文导入。
- front.import_url_resource：输入 url、rule_id、kind 等上传参数，将外部资源保存到资源库。需要当前后台账号具备上传权限。

调用要求：
- 先用 front.import_article_url 获取正文和 assets。
- 只有用户需要保存外部资源，或后续编辑器需要本地资源 URL 时，才对 assets 逐项调用 front.import_url_resource。
- 不要把 front.import_url_resource 当成网页解析工具；它只保存单个资源 URL。
- 如果外部站点禁止下载视频或音频，返回错误后继续保留正文，不要伪造资源。
`),
		},
	}
}

func BuiltinByKey(key string) (BuiltinDefinition, bool) {
	key = strings.TrimSpace(key)
	for _, item := range BuiltinDefinitions() {
		if item.Key == key {
			return item, true
		}
	}
	return BuiltinDefinition{}, false
}

func BuiltinMethodByKey(key string) (BuiltinMethod, bool) {
	key = strings.TrimSpace(key)
	for _, definition := range BuiltinDefinitions() {
		for _, method := range definition.Methods {
			if method.Key == key {
				return method, true
			}
		}
	}
	return BuiltinMethod{}, false
}

func IsBuiltinMethod(key string) bool {
	_, ok := BuiltinMethodByKey(key)
	return ok
}

func EnsureBuiltinSkills(ctx context.Context) {
	if ctx == nil {
		ctx = context.Background()
	}
	model := agentmodel.NewSkillModel()
	for _, definition := range BuiltinDefinitions() {
		record := builtinSkillRecord(definition)
		if existing := model.Find(ctx, map[string]any{"key": definition.Key}); existing != nil {
			sourceType := agentmodel.NormalizeSkillSourceType(existing.SourceType, existing.SourceURL, existing.InstallInput)
			if sourceType != agentmodel.SkillSourceTypeBuiltin && !strings.HasPrefix(strings.TrimSpace(existing.SourceURL), "dever:builtin/") {
				continue
			}
			if builtinSkillChanged(existing, record) {
				model.Update(ctx, map[string]any{"id": existing.ID}, record)
			}
			continue
		}
		record["created_at"] = time.Now()
		model.Insert(ctx, record)
	}
}

func builtinSkillChanged(existing *agentmodel.Skill, record map[string]any) bool {
	if existing == nil {
		return true
	}
	return strings.TrimSpace(existing.Name) != strings.TrimSpace(fmt.Sprint(record["name"])) ||
		strings.TrimSpace(existing.Description) != strings.TrimSpace(fmt.Sprint(record["description"])) ||
		strings.TrimSpace(existing.SourceType) != strings.TrimSpace(fmt.Sprint(record["source_type"])) ||
		strings.TrimSpace(existing.SourceURL) != strings.TrimSpace(fmt.Sprint(record["source_url"])) ||
		strings.TrimSpace(existing.InstallInput) != strings.TrimSpace(fmt.Sprint(record["install_input"])) ||
		strings.TrimSpace(existing.InstallPath) != strings.TrimSpace(fmt.Sprint(record["install_path"])) ||
		strings.TrimSpace(existing.EntryFile) != strings.TrimSpace(fmt.Sprint(record["entry_file"])) ||
		strings.TrimSpace(existing.Manifest) != strings.TrimSpace(fmt.Sprint(record["manifest"])) ||
		strings.TrimSpace(existing.ContentHash) != strings.TrimSpace(fmt.Sprint(record["content_hash"])) ||
		existing.CateID != agentmodel.DefaultSkillCateID ||
		existing.Status != 1 ||
		existing.Sort != 10
}

func BuiltinContent(entry Entry) string {
	if entry.SourceType != agentmodel.SkillSourceTypeBuiltin {
		return ""
	}
	if definition, ok := BuiltinByKey(entry.Key); ok {
		return definition.Content
	}
	return ""
}

func LoadedBuiltinMethods(entries []Entry) []BuiltinMethod {
	result := make([]BuiltinMethod, 0)
	seen := map[string]struct{}{}
	for _, entry := range entries {
		for _, method := range manifestBuiltinMethods(entry.Manifest) {
			if _, exists := seen[method.Key]; exists {
				continue
			}
			seen[method.Key] = struct{}{}
			result = append(result, method)
		}
	}
	return result
}

func ResolveLoadedBuiltinMethod(entries []Entry, methodKey string) (BuiltinMethod, Entry, bool) {
	methodKey = strings.TrimSpace(methodKey)
	if methodKey == "" {
		return BuiltinMethod{}, Entry{}, false
	}
	for _, entry := range entries {
		for _, method := range manifestBuiltinMethods(entry.Manifest) {
			if method.Key == methodKey {
				return method, entry, true
			}
		}
	}
	return BuiltinMethod{}, Entry{}, false
}

func manifestBuiltinMethods(manifest string) []BuiltinMethod {
	payload := ParseManifestMap(manifest)
	raw, ok := payload["builtin_methods"].([]any)
	if !ok || len(raw) == 0 {
		return nil
	}
	methods := make([]BuiltinMethod, 0, len(raw))
	for _, item := range raw {
		mapped, ok := item.(map[string]any)
		if !ok {
			continue
		}
		method := BuiltinMethod{
			Key:         strings.TrimSpace(fmt.Sprint(FirstPresent(mapped, "key", "name"))),
			Service:     strings.TrimSpace(fmt.Sprint(FirstPresent(mapped, "service", "provider"))),
			Description: strings.TrimSpace(fmt.Sprint(FirstPresent(mapped, "description", "summary"))),
		}
		if method.Key == "" || method.Service == "" {
			continue
		}
		methods = append(methods, method)
	}
	return methods
}

func builtinSkillRecord(definition BuiltinDefinition) map[string]any {
	return map[string]any{
		"cate_id":       agentmodel.DefaultSkillCateID,
		"key":           definition.Key,
		"name":          definition.Name,
		"description":   definition.Description,
		"source_type":   agentmodel.SkillSourceTypeBuiltin,
		"source_url":    "dever:builtin/" + definition.Key,
		"install_input": "",
		"install_path":  "",
		"entry_file":    EntryFile,
		"manifest":      JSONText(builtinManifest(definition)),
		"content_hash":  builtinContentHash(definition),
		"status":        1,
		"sort":          10,
	}
}

func builtinManifest(definition BuiltinDefinition) map[string]any {
	methods := make([]any, 0, len(definition.Methods))
	for _, method := range definition.Methods {
		methods = append(methods, map[string]any{
			"key":         method.Key,
			"service":     method.Service,
			"description": method.Description,
		})
	}
	return map[string]any{
		"key":             definition.Key,
		"name":            definition.Name,
		"description":     definition.Description,
		"triggers":        stringItems(definition.Triggers),
		"domains":         stringItems(definition.Domains),
		"targets":         stringItems(definition.Targets),
		"builtin_methods": methods,
		"source": map[string]any{
			"type": "builtin",
		},
	}
}

func builtinContentHash(definition BuiltinDefinition) string {
	raw, _ := json.Marshal(map[string]any{
		"key":     definition.Key,
		"content": definition.Content,
		"methods": definition.Methods,
	})
	hash := sha256.Sum256(raw)
	return fmt.Sprintf("builtin:%x", hash[:])
}

func stringItems(values []string) []any {
	result := make([]any, 0, len(values))
	for _, value := range values {
		if text := strings.TrimSpace(value); text != "" {
			result = append(result, text)
		}
	}
	return result
}
