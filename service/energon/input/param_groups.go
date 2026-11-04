package input

import (
	"context"
	"fmt"

	botmodel "github.com/dever-package/bot/model/energon"
)

// PowerParamGroup describes presentation only; every member keeps its own input key.
type PowerParamGroup struct {
	ID   uint64 `json:"id"`
	Key  string `json:"key"`
	Name string `json:"name"`
	Icon string `json:"icon,omitempty"`
	Sort int    `json:"sort"`
}

// ConfiguredPowerParams expands selected groups for the existing input pipeline.
func ConfiguredPowerParams(ctx context.Context, repo Repository, powerID uint64) []botmodel.PowerParam {
	rows, _ := configuredPowerParamGroups(ctx, repo, powerID)
	return rows
}

func configuredPowerParamGroups(ctx context.Context, repo Repository, powerID uint64) ([]botmodel.PowerParam, map[uint64]*PowerParamGroup) {
	configured := repo.PowerParamsByPower(ctx, powerID)
	params := repo.ParamMap(ctx)
	rows := make([]botmodel.PowerParam, 0, len(configured))
	groupIDs := make([]uint64, 0)
	direct := make(map[uint64]bool)
	for _, row := range configured {
		param, exists := params[row.ParamID]
		if !exists || !IsActive(param.Status) {
			continue
		}
		if param.Type == botmodel.ParamTypeGroup {
			groupIDs = append(groupIDs, param.ID)
		} else {
			rows = append(rows, row)
			direct[param.ID] = true
		}
	}
	members := repo.ParamGroupMembersByGroups(ctx, groupIDs)
	byGroup := make(map[uint64][]botmodel.ParamGroupMember)
	for _, member := range members {
		byGroup[member.GroupID] = append(byGroup[member.GroupID], member)
	}
	groups := make(map[uint64]*PowerParamGroup)
	for _, row := range configured {
		param, exists := params[row.ParamID]
		if !exists || !IsActive(param.Status) || param.Type != botmodel.ParamTypeGroup {
			continue
		}
		group := &PowerParamGroup{ID: row.ID, Key: param.Key, Name: param.Name, Icon: param.Icon, Sort: row.Sort}
		for _, member := range byGroup[param.ID] {
			child, exists := params[member.ParamID]
			if !exists || !IsActive(child.Status) || direct[child.ID] {
				continue
			}
			if child.Type == botmodel.ParamTypeGroup {
				panic(fmt.Errorf("参数组“%s”不能包含参数组“%s”", param.Name, child.Name))
			}
			if previous := groups[child.ID]; previous != nil {
				panic(fmt.Errorf("参数“%s”重复配置在“%s”和“%s”中", child.Name, previous.Name, group.Name))
			}
			groups[child.ID] = group
			rows = append(rows, botmodel.PowerParam{ID: row.ID, PowerID: powerID, ParamID: child.ID,
				Show: row.Show, Sort: member.Sort, Status: member.Required})
		}
	}
	return rows, groups
}
