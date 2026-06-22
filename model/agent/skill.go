package agent

import (
	"strings"
	"time"

	"github.com/shemic/dever/orm"
)

const (
	SkillSourceTypeCustom    = "custom"
	SkillSourceTypeInstalled = "installed"
	SkillSourceTypeBuiltin   = "builtin"

	BuiltinArticleImportSkillID          uint64 = 10001
	BuiltinArticleImportSkillKey                = "front.article_import"
	BuiltinArticleImportSkillName               = "文章导入"
	BuiltinArticleImportSkillDescription        = "内置文章导入能力。支持从文章链接解析标题、正文结构和外部媒体资源，并可按需转存外部资源。"
	BuiltinArticleImportSourceURL               = "dever:builtin/" + BuiltinArticleImportSkillKey
	BuiltinMethodImportArticleURL               = "front.import_article_url"
	BuiltinMethodImportURLResource              = "front.import_url_resource"
	BuiltinServiceImportArticleURL              = "front.article.ArticleBuiltinService.ImportArticleURL"
	BuiltinServiceImportURLResource             = "front.upload.UploadBuiltinService.ImportURLResource"
	BuiltinArticleImportManifest                = `{"key":"front.article_import","name":"文章导入","description":"内置文章导入能力。支持从文章链接解析标题、正文结构和外部媒体资源，并可按需转存外部资源。","triggers":["文章导入","链接导入","自媒体采集","公众号采集","网页正文采集"],"domains":["article","media","import"],"targets":["article_import","rich_text"],"builtin_methods":[{"key":"front.import_article_url","service":"front.article.ArticleBuiltinService.ImportArticleURL","description":"解析文章链接，返回 title/html/assets/source_url/site。"},{"key":"front.import_url_resource","service":"front.upload.UploadBuiltinService.ImportURLResource","description":"把外部图片、视频、音频或文件链接转存为平台资源，返回上传文件信息。"}],"source":{"type":"builtin"}}`
)

type Skill struct {
	ID           uint64    `dorm:"primaryKey;autoIncrement;comment:技能ID"`
	CateID       uint64    `dorm:"type:bigint;not null;default:1;comment:技能分类"`
	Key          string    `dorm:"type:varchar(128);not null;comment:技能标识"`
	Name         string    `dorm:"type:varchar(128);not null;comment:技能名称"`
	Description  string    `dorm:"type:varchar(512);not null;default:'';comment:技能描述"`
	SourceType   string    `dorm:"type:varchar(32);not null;default:'';comment:来源类型"`
	SourceURL    string    `dorm:"type:varchar(512);not null;default:'';comment:来源链接"`
	InstallInput string    `dorm:"type:text;not null;default:'';comment:安装输入"`
	InstallPath  string    `dorm:"type:varchar(512);not null;default:'';comment:安装目录"`
	EntryFile    string    `dorm:"type:varchar(128);not null;default:'SKILL.md';comment:入口文件"`
	Manifest     string    `dorm:"type:text;not null;default:'';comment:技能元信息"`
	ContentHash  string    `dorm:"type:varchar(128);not null;default:'';comment:内容哈希"`
	Status       int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort         int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt    time.Time `dorm:"comment:创建时间"`
}

type SkillIndex struct {
	Key            struct{} `unique:"key"`
	CateStatusSort struct{} `index:"cate_id,status,sort"`
	StatusSort     struct{} `index:"status,sort"`
}

var skillCateRelation = orm.Relation{
	Field:      "cate_id",
	Option:     "bot.agent.NewSkillCateModel",
	OptionKeys: []string{"name"},
}

var skillSourceTypeOptions = []map[string]any{
	{"id": SkillSourceTypeCustom, "value": "自建"},
	{"id": SkillSourceTypeInstalled, "value": "安装"},
	{"id": SkillSourceTypeBuiltin, "value": "内置"},
}

var skillSeed = []map[string]any{
	{
		"id":            BuiltinArticleImportSkillID,
		"cate_id":       DefaultSkillCateID,
		"key":           BuiltinArticleImportSkillKey,
		"name":          BuiltinArticleImportSkillName,
		"description":   BuiltinArticleImportSkillDescription,
		"source_type":   SkillSourceTypeBuiltin,
		"source_url":    BuiltinArticleImportSourceURL,
		"install_input": "",
		"install_path":  "",
		"entry_file":    "SKILL.md",
		"manifest":      BuiltinArticleImportManifest,
		"content_hash":  "builtin:front.article_import:v1",
		"status":        1,
		"sort":          10,
	},
}

func NewSkillModel() *orm.Model[Skill] {
	return orm.LoadModel[Skill]("技能", "bot_skill", orm.ModelConfig{
		Index:    SkillIndex{},
		Seeds:    skillSeed,
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"status":      statusOptions,
			"source_type": skillSourceTypeOptions,
		},
		Relations: []orm.Relation{
			skillCateRelation,
		},
	})
}

func NormalizeSkillSourceType(sourceType string, sourceURL string, installInput string) string {
	sourceType = strings.ToLower(strings.TrimSpace(sourceType))
	switch sourceType {
	case SkillSourceTypeCustom, SkillSourceTypeInstalled, SkillSourceTypeBuiltin:
		return sourceType
	}
	if strings.HasPrefix(strings.TrimSpace(sourceURL), "dever:draft/") {
		return SkillSourceTypeCustom
	}
	if strings.TrimSpace(installInput) != "" || strings.TrimSpace(sourceURL) != "" {
		return SkillSourceTypeInstalled
	}
	return SkillSourceTypeCustom
}

func SkillSourceTypeLabel(sourceType string) string {
	switch sourceType {
	case SkillSourceTypeCustom:
		return "自建"
	case SkillSourceTypeInstalled:
		return "安装"
	case SkillSourceTypeBuiltin:
		return "内置"
	default:
		return "未知"
	}
}

func SkillSourceTypeOptions() []map[string]any {
	return cloneOptionRows(skillSourceTypeOptions)
}
