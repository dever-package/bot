package body

import (
	"strings"
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
	DefaultThemePreset                    = ThemePresetForest
	DefaultBrandPrimaryColor              = ""
	DefaultLoginTemplate                  = LoginTemplateSplit
	DefaultWorkbenchTemplate              = WorkbenchTemplateRail
	DefaultCompanyName                    = ""
	DefaultCompanyAddress                 = ""
	DefaultBusinessLicenseURL             = ""
	DefaultICPRecord                      = ""
	DefaultICPRecordURL                   = ""
	DefaultPublicSecurityRecord           = ""
	DefaultPublicSecurityRecordURL        = ""
	ThemePresetForest                     = "forest"
	ThemePresetOcean                      = "ocean"
	ThemePresetGraphite                   = "graphite"
	LoginTemplateSplit                    = "split"
	LoginTemplateFocus                    = "focus"
	LoginTemplateShowcase                 = "showcase"
	WorkbenchTemplateRail                 = "rail"
	WorkbenchTemplateSidebar              = "sidebar"
	WorkbenchTemplateTopbar               = "topbar"
)

var themePresetOptions = []map[string]any{
	{"id": ThemePresetForest, "value": "默认墨绿"},
	{"id": ThemePresetOcean, "value": "企业蓝"},
	{"id": ThemePresetGraphite, "value": "石墨黑"},
}

var loginTemplateOptions = []map[string]any{
	{"id": LoginTemplateSplit, "value": "左右分栏"},
	{"id": LoginTemplateFocus, "value": "居中聚焦"},
	{"id": LoginTemplateShowcase, "value": "品牌展示"},
}

var workbenchTemplateOptions = []map[string]any{
	{"id": WorkbenchTemplateRail, "value": "紧凑导航"},
	{"id": WorkbenchTemplateSidebar, "value": "宽侧栏"},
	{"id": WorkbenchTemplateTopbar, "value": "顶部导航"},
}

type Config struct {
	ID                      uint64    `dorm:"primaryKey;autoIncrement;comment:配置ID"`
	SiteName                string    `dorm:"type:varchar(128);not null;default:'神创工作台';comment:站点名称"`
	Logo                    string    `dorm:"type:text;not null;default:'';comment:站点Logo"`
	Favicon                 string    `dorm:"type:text;not null;default:'';comment:站点图标"`
	LoginImage              string    `dorm:"type:text;not null;default:'';comment:登录页图片"`
	LoginTitle              string    `dorm:"type:varchar(160);not null;default:'把想法变成作品';comment:登录页标题"`
	LoginDescription        string    `dorm:"type:text;not null;default:'';comment:登录页说明"`
	ThemePreset             string    `dorm:"type:varchar(32);not null;default:'forest';comment:主题预设"`
	BrandPrimaryColor       string    `dorm:"type:varchar(16);not null;default:'';comment:品牌主色"`
	LoginTemplate           string    `dorm:"type:varchar(32);not null;default:'split';comment:登录页模板"`
	WorkbenchTemplate       string    `dorm:"type:varchar(32);not null;default:'rail';comment:工作台模板"`
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
		"theme_preset":               DefaultThemePreset,
		"brand_primary_color":        DefaultBrandPrimaryColor,
		"login_template":             DefaultLoginTemplate,
		"workbench_template":         DefaultWorkbenchTemplate,
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
		Options: map[string]any{
			"theme_preset":       themePresetOptions,
			"login_template":     loginTemplateOptions,
			"workbench_template": workbenchTemplateOptions,
		},
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
		ThemePreset:             DefaultThemePreset,
		BrandPrimaryColor:       DefaultBrandPrimaryColor,
		LoginTemplate:           DefaultLoginTemplate,
		WorkbenchTemplate:       DefaultWorkbenchTemplate,
		CompanyName:             DefaultCompanyName,
		CompanyAddress:          DefaultCompanyAddress,
		BusinessLicenseURL:      DefaultBusinessLicenseURL,
		ICPRecord:               DefaultICPRecord,
		ICPRecordURL:            DefaultICPRecordURL,
		PublicSecurityRecord:    DefaultPublicSecurityRecord,
		PublicSecurityRecordURL: DefaultPublicSecurityRecordURL,
	}
}

func NormalizeThemePreset(value string) string {
	switch strings.TrimSpace(value) {
	case ThemePresetOcean:
		return ThemePresetOcean
	case ThemePresetGraphite:
		return ThemePresetGraphite
	default:
		return ThemePresetForest
	}
}

func NormalizeLoginTemplate(value string) string {
	switch strings.TrimSpace(value) {
	case LoginTemplateFocus:
		return LoginTemplateFocus
	case LoginTemplateShowcase:
		return LoginTemplateShowcase
	default:
		return LoginTemplateSplit
	}
}

func NormalizeWorkbenchTemplate(value string) string {
	switch strings.TrimSpace(value) {
	case WorkbenchTemplateSidebar:
		return WorkbenchTemplateSidebar
	case WorkbenchTemplateTopbar:
		return WorkbenchTemplateTopbar
	default:
		return WorkbenchTemplateRail
	}
}

func NormalizeBrandPrimaryColor(value string) string {
	value = strings.ToLower(strings.TrimSpace(value))
	if len(value) != 7 || value[0] != '#' {
		return ""
	}
	for _, char := range value[1:] {
		if (char < '0' || char > '9') && (char < 'a' || char > 'f') {
			return ""
		}
	}
	return value
}
