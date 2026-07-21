package body

import (
	"time"

	"github.com/shemic/dever/orm"
)

const (
	DefaultConfigID                uint64 = 1
	DefaultSiteName                       = "神创工作台"
	DefaultLogo                           = ""
	DefaultFavicon                        = ""
	DefaultLoginImage                     = ""
	DefaultLoginTitle                     = "把想法变成作品"
	DefaultLoginDescription               = "调用团队能力，与智能体协作，把每一次创作沉淀为可复用的项目资产。"
	DefaultHomeWorksName                  = "创作"
	DefaultHomeWorksIcon                  = "file-stack"
	DefaultHomeDialogueName               = "对话"
	DefaultHomeDialogueIcon               = "messages-square"
	DefaultHomeFunctionName               = "工具"
	DefaultHomeFunctionIcon               = "zap"
	DefaultHomeAssetsName                 = "资产"
	DefaultHomeAssetsIcon                 = "archive"
	DefaultHomePointsName                 = "积分"
	DefaultHomePointsIcon                 = "sparkles"
	DefaultHomeMessagesName               = "消息"
	DefaultHomeMessagesIcon               = "bell"
	DefaultHomeMenuStatus          int16  = StatusEnabled
	DefaultCompanyName                    = ""
	DefaultCompanyAddress                 = ""
	DefaultBusinessLicenseURL             = ""
	DefaultICPRecord                      = ""
	DefaultICPRecordURL                   = ""
	DefaultPublicSecurityRecord           = ""
	DefaultPublicSecurityRecordURL        = ""
)

type Config struct {
	ID                      uint64    `dorm:"primaryKey;autoIncrement;comment:配置ID"`
	SiteName                string    `dorm:"type:varchar(128);not null;default:'神创工作台';comment:站点名称"`
	Logo                    string    `dorm:"type:text;not null;default:'';comment:站点Logo"`
	Favicon                 string    `dorm:"type:text;not null;default:'';comment:站点图标"`
	LoginImage              string    `dorm:"type:text;not null;default:'';comment:登录页图片"`
	LoginTitle              string    `dorm:"type:varchar(160);not null;default:'把想法变成作品';comment:登录页标题"`
	LoginDescription        string    `dorm:"type:text;not null;default:'';comment:登录页说明"`
	HomeWorksName           string    `dorm:"type:varchar(64);not null;default:'创作';comment:创作菜单名称"`
	HomeWorksIcon           string    `dorm:"type:varchar(64);not null;default:'file-stack';comment:创作菜单图标"`
	HomeWorksStatus         int16     `dorm:"type:smallint;not null;default:1;comment:创作菜单显示状态"`
	HomeDialogueName        string    `dorm:"type:varchar(64);not null;default:'对话';comment:对话菜单名称"`
	HomeDialogueIcon        string    `dorm:"type:varchar(64);not null;default:'messages-square';comment:对话菜单图标"`
	HomeDialogueStatus      int16     `dorm:"type:smallint;not null;default:1;comment:对话菜单显示状态"`
	HomeFunctionName        string    `dorm:"type:varchar(64);not null;default:'工具';comment:工具菜单名称"`
	HomeFunctionIcon        string    `dorm:"type:varchar(64);not null;default:'zap';comment:工具菜单图标"`
	HomeFunctionStatus      int16     `dorm:"type:smallint;not null;default:1;comment:工具菜单显示状态"`
	HomeAssetsName          string    `dorm:"type:varchar(64);not null;default:'资产';comment:资产菜单名称"`
	HomeAssetsIcon          string    `dorm:"type:varchar(64);not null;default:'archive';comment:资产菜单图标"`
	HomeAssetsStatus        int16     `dorm:"type:smallint;not null;default:1;comment:资产菜单显示状态"`
	HomePointsName          string    `dorm:"type:varchar(64);not null;default:'积分';comment:积分菜单名称"`
	HomePointsIcon          string    `dorm:"type:varchar(64);not null;default:'sparkles';comment:积分菜单图标"`
	HomePointsStatus        int16     `dorm:"type:smallint;not null;default:1;comment:积分菜单显示状态"`
	HomeMessagesName        string    `dorm:"type:varchar(64);not null;default:'消息';comment:消息菜单名称"`
	HomeMessagesIcon        string    `dorm:"type:varchar(64);not null;default:'bell';comment:消息菜单图标"`
	HomeMessagesStatus      int16     `dorm:"type:smallint;not null;default:1;comment:消息菜单显示状态"`
	CompanyName             string    `dorm:"type:varchar(200);not null;default:'';comment:企业名称"`
	CompanyAddress          string    `dorm:"type:varchar(500);not null;default:'';comment:企业地址"`
	BusinessLicenseURL      string    `dorm:"type:text;not null;default:'';comment:营业执照链接"`
	ICPRecord               string    `dorm:"type:varchar(200);not null;default:'';comment:ICP备案号"`
	ICPRecordURL            string    `dorm:"type:text;not null;default:'';comment:ICP备案链接"`
	PublicSecurityRecord    string    `dorm:"type:varchar(200);not null;default:'';comment:公安备案号"`
	PublicSecurityRecordURL string    `dorm:"type:text;not null;default:'';comment:公安备案链接"`
	CreatedAt               time.Time `dorm:"not null;default:CURRENT_TIMESTAMP;comment:创建时间"`
	UpdatedAt               time.Time `dorm:"not null;default:CURRENT_TIMESTAMP;comment:更新时间"`
}

var configSeed = []map[string]any{
	{
		"id":                         DefaultConfigID,
		"site_name":                  DefaultSiteName,
		"logo":                       DefaultLogo,
		"favicon":                    DefaultFavicon,
		"login_image":                DefaultLoginImage,
		"login_title":                DefaultLoginTitle,
		"login_description":          DefaultLoginDescription,
		"home_works_name":            DefaultHomeWorksName,
		"home_works_icon":            DefaultHomeWorksIcon,
		"home_works_status":          DefaultHomeMenuStatus,
		"home_dialogue_name":         DefaultHomeDialogueName,
		"home_dialogue_icon":         DefaultHomeDialogueIcon,
		"home_dialogue_status":       DefaultHomeMenuStatus,
		"home_function_name":         DefaultHomeFunctionName,
		"home_function_icon":         DefaultHomeFunctionIcon,
		"home_function_status":       DefaultHomeMenuStatus,
		"home_assets_name":           DefaultHomeAssetsName,
		"home_assets_icon":           DefaultHomeAssetsIcon,
		"home_assets_status":         DefaultHomeMenuStatus,
		"home_points_name":           DefaultHomePointsName,
		"home_points_icon":           DefaultHomePointsIcon,
		"home_points_status":         DefaultHomeMenuStatus,
		"home_messages_name":         DefaultHomeMessagesName,
		"home_messages_icon":         DefaultHomeMessagesIcon,
		"home_messages_status":       DefaultHomeMenuStatus,
		"company_name":               DefaultCompanyName,
		"company_address":            DefaultCompanyAddress,
		"business_license_url":       DefaultBusinessLicenseURL,
		"icp_record":                 DefaultICPRecord,
		"icp_record_url":             DefaultICPRecordURL,
		"public_security_record":     DefaultPublicSecurityRecord,
		"public_security_record_url": DefaultPublicSecurityRecordURL,
	},
}

func NewConfigModel() *orm.Model[Config] {
	return orm.LoadModel[Config]("Body基础配置", "bot_body_config", orm.ModelConfig{
		Seeds:    configSeed,
		Database: "default",
	})
}

func DefaultConfig() Config {
	return Config{
		ID:                      DefaultConfigID,
		SiteName:                DefaultSiteName,
		Logo:                    DefaultLogo,
		Favicon:                 DefaultFavicon,
		LoginImage:              DefaultLoginImage,
		LoginTitle:              DefaultLoginTitle,
		LoginDescription:        DefaultLoginDescription,
		HomeWorksName:           DefaultHomeWorksName,
		HomeWorksIcon:           DefaultHomeWorksIcon,
		HomeWorksStatus:         DefaultHomeMenuStatus,
		HomeDialogueName:        DefaultHomeDialogueName,
		HomeDialogueIcon:        DefaultHomeDialogueIcon,
		HomeDialogueStatus:      DefaultHomeMenuStatus,
		HomeFunctionName:        DefaultHomeFunctionName,
		HomeFunctionIcon:        DefaultHomeFunctionIcon,
		HomeFunctionStatus:      DefaultHomeMenuStatus,
		HomeAssetsName:          DefaultHomeAssetsName,
		HomeAssetsIcon:          DefaultHomeAssetsIcon,
		HomeAssetsStatus:        DefaultHomeMenuStatus,
		HomePointsName:          DefaultHomePointsName,
		HomePointsIcon:          DefaultHomePointsIcon,
		HomePointsStatus:        DefaultHomeMenuStatus,
		HomeMessagesName:        DefaultHomeMessagesName,
		HomeMessagesIcon:        DefaultHomeMessagesIcon,
		HomeMessagesStatus:      DefaultHomeMenuStatus,
		CompanyName:             DefaultCompanyName,
		CompanyAddress:          DefaultCompanyAddress,
		BusinessLicenseURL:      DefaultBusinessLicenseURL,
		ICPRecord:               DefaultICPRecord,
		ICPRecordURL:            DefaultICPRecordURL,
		PublicSecurityRecord:    DefaultPublicSecurityRecord,
		PublicSecurityRecordURL: DefaultPublicSecurityRecordURL,
	}
}
