package billing

import (
	"context"
	"encoding/json"
	"fmt"
	"sort"
	"strings"
	"time"

	"github.com/shemic/dever/util"

	billingmodel "github.com/dever-package/bot/model/billing"
	energonmodel "github.com/dever-package/bot/model/energon"
	usermodel "github.com/dever-package/user/model"
	userservice "github.com/dever-package/user/service"
)

type ChargeRule struct {
	Enabled              bool
	Source               string
	BillingBenefitID     uint64
	UserIdentityID       uint64
	IdentityID           uint64
	IdentityName         string
	LevelID              uint64
	LevelName            string
	Level                int
	Scope                string
	PointConfigID        uint64
	PointName            string
	PointSymbol          string
	PointSymbolPosition  int16
	PointExchangeRate    int
	SaleRatio            string
	SaleRatioBasisPoints int64
	Snapshot             string
}

type ruleCandidate struct {
	ChargeRule
	scopePriority int
	sort          int
}

func ResolveChargeRule(ctx context.Context, userID uint64, powerID uint64) (ChargeRule, error) {
	if userID == 0 {
		return ChargeRule{}, fmt.Errorf("能力计费缺少用户")
	}
	power := energonmodel.NewPowerModel().Find(ctx, map[string]any{"id": powerID, "status": int16(1)})
	if power == nil || power.ID == 0 {
		return ChargeRule{}, fmt.Errorf("计费能力不存在或未开启")
	}

	candidates, err := identityChargeRuleCandidates(ctx, userID, powerID)
	if err != nil {
		return ChargeRule{}, err
	}
	if len(candidates) > 0 {
		sort.SliceStable(candidates, func(i, j int) bool {
			left, right := candidates[i], candidates[j]
			if left.scopePriority != right.scopePriority {
				return left.scopePriority > right.scopePriority
			}
			if left.SaleRatioBasisPoints != right.SaleRatioBasisPoints {
				return left.SaleRatioBasisPoints < right.SaleRatioBasisPoints
			}
			if left.Level != right.Level {
				return left.Level > right.Level
			}
			if left.sort != right.sort {
				return left.sort < right.sort
			}
			return left.BillingBenefitID < right.BillingBenefitID
		})
		selected := candidates[0].ChargeRule
		selected.Snapshot = encodeChargeRuleSnapshot(selected)
		return selected, nil
	}
	return ChargeRule{}, nil
}

func identityChargeRuleCandidates(ctx context.Context, userID uint64, powerID uint64) ([]ruleCandidate, error) {
	now := time.Now()
	userIdentities := usermodel.NewUserIdentityModel().SelectMap(ctx, map[string]any{
		"user_id":    userID,
		"status":     1,
		"expires_at": map[string]any{"gt": now},
	}, map[string]any{"order": "level desc,id asc"})
	active := activeBillingUserIdentities(ctx, userIdentities, now)
	if len(active) == 0 {
		return nil, nil
	}

	levelIDs := make([]any, 0, len(active))
	identityByLevel := make(map[uint64]map[string]any, len(active))
	for _, row := range active {
		levelID := util.ToUint64(row["level_id"])
		if levelID == 0 {
			continue
		}
		levelIDs = append(levelIDs, levelID)
		identityByLevel[levelID] = row
	}
	benefits := usermodel.NewIdentityBillingBenefitModel().SelectMap(ctx, map[string]any{
		"level_id": levelIDs,
		"status":   1,
	}, map[string]any{"order": "level desc,sort asc,id asc"})
	if len(benefits) == 0 {
		return nil, nil
	}
	points, err := chargePointConfigs(ctx, benefits)
	if err != nil {
		return nil, err
	}

	specifiedIDs := make([]any, 0, len(benefits))
	for _, benefit := range benefits {
		if strings.TrimSpace(util.ToString(benefit["scope"])) == usermodel.BillingScopeSpecified {
			specifiedIDs = append(specifiedIDs, util.ToUint64(benefit["id"]))
		}
	}
	specifiedMatches := map[uint64]bool{}
	if len(specifiedIDs) > 0 {
		relations := usermodel.NewIdentityBillingBenefitPowerModel().SelectMap(ctx, map[string]any{
			"billing_benefit_id": specifiedIDs,
			"power_id":           powerID,
		})
		for _, relation := range relations {
			specifiedMatches[util.ToUint64(relation["billing_benefit_id"])] = true
		}
	}

	result := make([]ruleCandidate, 0, len(benefits))
	for _, benefit := range benefits {
		levelID := util.ToUint64(benefit["level_id"])
		userIdentity := identityByLevel[levelID]
		if len(userIdentity) == 0 {
			continue
		}
		scope := strings.TrimSpace(util.ToString(benefit["scope"]))
		priority := 1
		if scope == usermodel.BillingScopeSpecified {
			if !specifiedMatches[util.ToUint64(benefit["id"])] {
				continue
			}
			priority = 2
		} else {
			scope = usermodel.BillingScopeAll
		}
		ratio, err := userservice.ParseSaleRatioBasisPoints(benefit["sale_ratio"])
		if err != nil {
			return nil, fmt.Errorf("身份计费权益售价系数无效: %w", err)
		}
		point := points[util.ToUint64(benefit["point_config_id"])]
		if point.id == 0 {
			return nil, fmt.Errorf("计费积分不存在")
		}
		result = append(result, ruleCandidate{
			ChargeRule: ChargeRule{
				Enabled:              true,
				Source:               billingmodel.ChargeRuleIdentity,
				BillingBenefitID:     util.ToUint64(benefit["id"]),
				UserIdentityID:       util.ToUint64(userIdentity["id"]),
				IdentityID:           util.ToUint64(userIdentity["identity_id"]),
				IdentityName:         strings.TrimSpace(util.ToString(userIdentity["identity_name"])),
				LevelID:              levelID,
				LevelName:            strings.TrimSpace(util.ToString(userIdentity["level_name"])),
				Level:                util.ToIntDefault(userIdentity["level"], 0),
				Scope:                scope,
				PointConfigID:        point.id,
				PointName:            point.name,
				PointSymbol:          point.symbol,
				PointSymbolPosition:  point.symbolPosition,
				PointExchangeRate:    point.exchangeRate,
				SaleRatio:            userservice.FormatSaleRatio(ratio),
				SaleRatioBasisPoints: ratio,
			},
			scopePriority: priority,
			sort:          util.ToIntDefault(benefit["sort"], 100),
		})
	}
	return result, nil
}

func activeBillingUserIdentities(ctx context.Context, rows []map[string]any, now time.Time) []map[string]any {
	identityIDs := make([]any, 0, len(rows))
	levelIDs := make([]any, 0, len(rows))
	for _, row := range rows {
		expiresAt := billingTime(row["expired_at"])
		if expiresAt.IsZero() || !expiresAt.After(now) {
			continue
		}
		identityIDs = append(identityIDs, util.ToUint64(row["identity_id"]))
		levelIDs = append(levelIDs, util.ToUint64(row["level_id"]))
	}
	if len(identityIDs) == 0 || len(levelIDs) == 0 {
		return nil
	}
	identities := usermodel.NewIdentityModel().SelectMap(ctx, map[string]any{"id": identityIDs, "status": 1})
	levels := usermodel.NewIdentityLevelModel().SelectMap(ctx, map[string]any{"id": levelIDs, "status": 1})
	activeIdentities := rowIDSet(identities)
	activeLevels := rowIDSet(levels)
	result := make([]map[string]any, 0, len(rows))
	for _, row := range rows {
		if !activeIdentities[util.ToUint64(row["identity_id"])] || !activeLevels[util.ToUint64(row["level_id"])] {
			continue
		}
		expiresAt := billingTime(row["expired_at"])
		if expiresAt.IsZero() || !expiresAt.After(now) {
			continue
		}
		result = append(result, row)
	}
	return result
}

type chargePoint struct {
	id             uint64
	name           string
	symbol         string
	symbolPosition int16
	exchangeRate   int
}

func chargePointConfigs(ctx context.Context, benefits []map[string]any) (map[uint64]chargePoint, error) {
	ids := make([]any, 0, len(benefits))
	seen := make(map[uint64]bool, len(benefits))
	for _, benefit := range benefits {
		id := util.ToUint64(benefit["point_config_id"])
		if id > 0 && !seen[id] {
			seen[id] = true
			ids = append(ids, id)
		}
	}
	rows := usermodel.NewPointConfigModel().SelectMap(ctx, map[string]any{"id": ids})
	result := make(map[uint64]chargePoint, len(rows))
	for _, row := range rows {
		point, err := chargePointFromRow(row)
		if err != nil {
			return nil, err
		}
		result[point.id] = point
	}
	return result, nil
}

func chargePointFromRow(row map[string]any) (chargePoint, error) {
	name := strings.TrimSpace(util.ToString(row["name"]))
	symbol := strings.TrimSpace(util.ToString(row["symbol"]))
	if symbol == "" {
		symbol = name
	}
	position := int16(util.ToIntDefault(row["symbol_position"], 2))
	if position != 1 {
		position = 2
	}
	exchangeRate := util.ToIntDefault(row["exchange_rate"], 0)
	if exchangeRate <= 0 {
		return chargePoint{}, fmt.Errorf("计费积分“%s”的货币换算必须大于 0", name)
	}
	return chargePoint{
		id:             util.ToUint64(row["id"]),
		name:           name,
		symbol:         symbol,
		symbolPosition: position,
		exchangeRate:   exchangeRate,
	}, nil
}

func encodeChargeRuleSnapshot(rule ChargeRule) string {
	payload, err := json.Marshal(map[string]any{
		"source":                  rule.Source,
		"billing_benefit_id":      rule.BillingBenefitID,
		"user_identity_id":        rule.UserIdentityID,
		"identity_id":             rule.IdentityID,
		"identity_name":           rule.IdentityName,
		"level_id":                rule.LevelID,
		"level_name":              rule.LevelName,
		"level":                   rule.Level,
		"scope":                   rule.Scope,
		"point_config_id":         rule.PointConfigID,
		"point_name":              rule.PointName,
		"point_exchange_rate":     rule.PointExchangeRate,
		"sale_ratio":              rule.SaleRatio,
		"sale_ratio_basis_points": rule.SaleRatioBasisPoints,
	})
	if err != nil {
		return "{}"
	}
	return string(payload)
}

func rowIDSet(rows []map[string]any) map[uint64]bool {
	result := make(map[uint64]bool, len(rows))
	for _, row := range rows {
		if id := util.ToUint64(row["id"]); id > 0 {
			result[id] = true
		}
	}
	return result
}

func billingTime(value any) time.Time {
	switch current := value.(type) {
	case time.Time:
		return current
	case *time.Time:
		if current != nil {
			return *current
		}
	}
	text := strings.TrimSpace(util.ToString(value))
	for _, layout := range []string{time.RFC3339Nano, time.RFC3339, "2006-01-02 15:04:05"} {
		if parsed, err := time.Parse(layout, text); err == nil {
			return parsed
		}
	}
	return time.Time{}
}
