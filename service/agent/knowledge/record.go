package knowledge

import "time"

func withCreatedAt(values map[string]any) map[string]any {
	if _, ok := values["created_at"]; !ok {
		values["created_at"] = time.Now()
	}
	return values
}
