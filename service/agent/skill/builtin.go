package skill

import (
	"fmt"
	"strings"

	agentmodel "github.com/dever-package/bot/model/agent"
)

const (
	BuiltinArticleImportKey        = agentmodel.BuiltinArticleImportSkillKey
	BuiltinMethodImportArticleURL  = agentmodel.BuiltinMethodImportArticleURL
	BuiltinMethodImportURLResource = agentmodel.BuiltinMethodImportURLResource
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
			Key:         agentmodel.BuiltinArticleImportSkillKey,
			Name:        agentmodel.BuiltinArticleImportSkillName,
			Description: agentmodel.BuiltinArticleImportSkillDescription,
			Triggers:    []string{"文章导入", "链接导入", "自媒体采集", "公众号采集", "网页正文采集"},
			Domains:     []string{"article", "media", "import"},
			Targets:     []string{"article_import", "rich_text"},
			Methods: []BuiltinMethod{
				{
					Key:         agentmodel.BuiltinMethodImportArticleURL,
					Service:     agentmodel.BuiltinServiceImportArticleURL,
					Description: "解析文章链接，返回 title/html/assets/source_url/site。",
				},
				{
					Key:         agentmodel.BuiltinMethodImportURLResource,
					Service:     agentmodel.BuiltinServiceImportURLResource,
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
