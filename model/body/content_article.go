package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	ContentVisibilityLogin  = "login"
	ContentVisibilityPublic = "public"
)

var contentVisibilityOptions = []map[string]any{
	{"id": ContentVisibilityLogin, "value": "登录后访问"},
	{"id": ContentVisibilityPublic, "value": "公开访问"},
}

type ContentArticle struct {
	ID         uint64    `dorm:"primaryKey;autoIncrement;comment:内容文章ID"`
	CategoryID uint64    `dorm:"type:bigint;not null;default:1;comment:内容分类"`
	Title      string    `dorm:"type:varchar(200);not null;comment:标题"`
	Content    string    `dorm:"type:text;not null;default:'';comment:内容"`
	Visibility string    `dorm:"type:varchar(16);not null;default:'login';comment:访问范围"`
	Status     int16     `dorm:"type:smallint;not null;default:1;comment:状态"`
	Sort       int       `dorm:"type:int;not null;default:100;comment:排序"`
	CreatedAt  time.Time `dorm:"not null;default:CURRENT_TIMESTAMP;comment:创建时间"`
}

type ContentArticleIndex struct {
	CategoryStatusSort   struct{} `index:"category_id,status,sort,id"`
	VisibilityStatusSort struct{} `index:"visibility,status,sort,id"`
}

func NewContentArticleModel() *orm.Model[ContentArticle] {
	return orm.LoadModel[ContentArticle]("内容文章", "bot_body_content_article", orm.ModelConfig{
		Index:    ContentArticleIndex{},
		Order:    "sort asc,id desc",
		Database: "default",
		Options: map[string]any{
			"visibility": contentVisibilityOptions,
			"status":     statusOptions,
		},
		Relations: []orm.Relation{
			contentCategoryRelation("category_id", "category"),
		},
	})
}
