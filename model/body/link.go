package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	LinkTypeURL            = "url"
	LinkTypeArticle        = "article"
	LinkTargetSelf         = "_self"
	LinkTargetBlank        = "_blank"
	LinkCodeTermsOfService = "terms_of_service"
	LinkCodePrivacyPolicy  = "privacy_policy"
)

var linkTypeOptions = []map[string]any{
	{"id": LinkTypeURL, "value": "外部链接"},
	{"id": LinkTypeArticle, "value": "内容文章"},
}

var linkTargetOptions = []map[string]any{
	{"id": LinkTargetSelf, "value": "当前窗口"},
	{"id": LinkTargetBlank, "value": "新窗口"},
}

type Link struct {
	ID        uint64    `dorm:"primaryKey;autoIncrement;comment:链接ID"`
	Code      *string   `dorm:"type:varchar(64);null;comment:唯一编码"`
	Name      string    `dorm:"type:varchar(64);not null;comment:名称"`
	LinkType  string    `dorm:"type:varchar(16);not null;default:'url';comment:链接类型"`
	ArticleID uint64    `dorm:"type:bigint;not null;default:0;comment:内容文章"`
	URL       string    `dorm:"type:text;not null;default:'';comment:链接地址"`
	Target    string    `dorm:"type:varchar(16);not null;default:'_self';comment:打开方式"`
	Status    int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort      int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt time.Time `dorm:"not null;default:CURRENT_TIMESTAMP;comment:创建时间"`
}

type LinkIndex struct {
	Code       struct{} `unique:"code"`
	StatusSort struct{} `index:"status,sort,id"`
}

func NewLinkModel() *orm.Model[Link] {
	return orm.LoadModel[Link]("Body单页链接", "bot_body_link", orm.ModelConfig{
		Index:    LinkIndex{},
		Order:    "sort asc,id asc",
		Database: "default",
		Options: map[string]any{
			"link_type": linkTypeOptions,
			"target":    linkTargetOptions,
			"status":    statusOptions,
		},
		Relations: []orm.Relation{
			{
				Field:      "article_id",
				Name:       "article",
				Option:     "bot.body.NewContentArticleModel",
				OptionKeys: []string{"title"},
			},
			linkSceneRelation,
		},
	})
}
