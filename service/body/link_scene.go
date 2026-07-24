package body

import (
	"context"
	"reflect"
	"strings"

	"github.com/shemic/dever/util"

	bodymodel "github.com/dever-package/bot/model/body"
)

func normalizedBodyLinkCode(value string) string {
	return strings.ToLower(strings.TrimSpace(value))
}

func bodyLinkCode(row *bodymodel.Link) string {
	if row == nil || row.Code == nil {
		return ""
	}
	return normalizedBodyLinkCode(*row.Code)
}

func isLoginAgreementLinkCode(code string) bool {
	switch normalizedBodyLinkCode(code) {
	case bodymodel.LinkCodeTermsOfService, bodymodel.LinkCodePrivacyPolicy:
		return true
	default:
		return false
	}
}

func linkRequiresPublicArticle(code string, sceneIDs []uint64) bool {
	return isLoginAgreementLinkCode(code) || containsBodyLinkSceneID(
		sceneIDs,
		bodymodel.LinkSceneNavigationID,
	)
}

func normalizedBodyLinkSceneIDs(value any) []uint64 {
	if value == nil {
		return nil
	}
	current := reflect.ValueOf(value)
	if current.Kind() != reflect.Slice && current.Kind() != reflect.Array {
		return nil
	}

	result := make([]uint64, 0, current.Len())
	seen := make(map[uint64]struct{}, current.Len())
	for index := 0; index < current.Len(); index++ {
		id := util.ToUint64(current.Index(index).Interface())
		if id == 0 {
			continue
		}
		if _, exists := seen[id]; exists {
			continue
		}
		seen[id] = struct{}{}
		result = append(result, id)
	}
	return result
}

func bodyLinkSceneIDValues(sceneIDs []uint64) []any {
	result := make([]any, 0, len(sceneIDs))
	for _, sceneID := range sceneIDs {
		result = append(result, sceneID)
	}
	return result
}

func validBodyLinkSceneID(sceneID uint64) bool {
	switch sceneID {
	case bodymodel.LinkSceneNavigationID, bodymodel.LinkSceneWorkbenchContentID:
		return true
	default:
		return false
	}
}

func containsBodyLinkSceneID(sceneIDs []uint64, target uint64) bool {
	for _, sceneID := range sceneIDs {
		if sceneID == target {
			return true
		}
	}
	return false
}

func bodyLinkSceneCodesByLinkID(
	ctx context.Context,
	linkIDs []uint64,
) map[uint64][]string {
	result := make(map[uint64][]string, len(linkIDs))
	if len(linkIDs) == 0 {
		return result
	}

	rows := bodymodel.NewLinkSceneBindingModel().Select(ctx, map[string]any{
		"link_id": linkIDs,
	}, map[string]any{"field": "link_id,scene_id", "order": "id asc"})
	for _, row := range rows {
		if row == nil {
			continue
		}
		code := bodyLinkSceneCode(row.SceneID)
		if code == "" {
			continue
		}
		result[row.LinkID] = append(result[row.LinkID], code)
	}
	return result
}

func bodyLinkIDsForScene(ctx context.Context, sceneID uint64) []uint64 {
	rows := bodymodel.NewLinkSceneBindingModel().Select(ctx, map[string]any{
		"scene_id": sceneID,
	}, map[string]any{"field": "link_id", "order": "id asc"})
	result := make([]uint64, 0, len(rows))
	seen := make(map[uint64]struct{}, len(rows))
	for _, row := range rows {
		if row == nil || row.LinkID == 0 {
			continue
		}
		if _, exists := seen[row.LinkID]; exists {
			continue
		}
		seen[row.LinkID] = struct{}{}
		result = append(result, row.LinkID)
	}
	return result
}

func bodyLinkHasScene(ctx context.Context, linkID uint64, sceneID uint64) bool {
	if linkID == 0 || !validBodyLinkSceneID(sceneID) {
		return false
	}
	return bodymodel.NewLinkSceneBindingModel().Count(ctx, map[string]any{
		"link_id":  linkID,
		"scene_id": sceneID,
	}) > 0
}

func bodyLinkSceneCode(sceneID uint64) string {
	switch sceneID {
	case bodymodel.LinkSceneNavigationID:
		return bodymodel.LinkSceneNavigationCode
	case bodymodel.LinkSceneWorkbenchContentID:
		return bodymodel.LinkSceneWorkbenchContentCode
	default:
		return ""
	}
}

func containsBodyLinkSceneCode(sceneCodes []string, target string) bool {
	for _, code := range sceneCodes {
		if code == target {
			return true
		}
	}
	return false
}
