package energon

import "github.com/shemic/dever/orm"

// ServiceAccount limits a service to its explicitly selected accounts.
type ServiceAccount struct {
	ID        uint64 `dorm:"primaryKey;autoIncrement;comment:服务账号关联ID"`
	ServiceID uint64 `dorm:"type:bigint;not null;comment:来源服务"`
	AccountID uint64 `dorm:"type:bigint;not null;comment:鉴权账号"`
}

type ServiceAccountIndex struct {
	ServiceAccount struct{} `unique:"service_id,account_id"`
	Account        struct{} `index:"account_id"`
}

func NewServiceAccountModel() *orm.Model[ServiceAccount] {
	return orm.LoadModel[ServiceAccount]("服务账号关联", "bot_energon_service_account", orm.ModelConfig{
		Index: ServiceAccountIndex{}, Order: "id asc", Database: "default",
	})
}
