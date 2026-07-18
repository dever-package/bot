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
	DefaultLoginTitle                     = "把想法变成作品"
	DefaultLoginDescription               = "调用团队能力，与智能体协作，把每一次创作沉淀为可复用的项目资产。"
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
	LoginTitle              string    `dorm:"type:varchar(160);not null;default:'把想法变成作品';comment:登录页标题"`
	LoginDescription        string    `dorm:"type:text;not null;default:'';comment:登录页说明"`
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
		"login_title":                DefaultLoginTitle,
		"login_description":          DefaultLoginDescription,
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
		LoginTitle:              DefaultLoginTitle,
		LoginDescription:        DefaultLoginDescription,
		CompanyName:             DefaultCompanyName,
		CompanyAddress:          DefaultCompanyAddress,
		BusinessLicenseURL:      DefaultBusinessLicenseURL,
		ICPRecord:               DefaultICPRecord,
		ICPRecordURL:            DefaultICPRecordURL,
		PublicSecurityRecord:    DefaultPublicSecurityRecord,
		PublicSecurityRecordURL: DefaultPublicSecurityRecordURL,
	}
}
