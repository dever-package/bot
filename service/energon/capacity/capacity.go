package capacity

import (
	"encoding/json"
	"fmt"
	"math/big"
	"strconv"
	"strings"
)

const (
	kilo                     = int64(1000)
	mega                     = int64(1000000)
	maximumPersistedCapacity = int64(1<<31 - 1)
)

// Parse converts a user-facing token capacity such as 64K or 1.05M to the
// integer value persisted by the model.
func Parse(value any) (int, error) {
	text := strings.TrimSpace(capacityText(value))
	if text == "" {
		return 0, nil
	}

	multiplier := int64(1)
	switch suffix := text[len(text)-1]; suffix {
	case 'k', 'K':
		multiplier = kilo
		text = strings.TrimSpace(text[:len(text)-1])
	case 'm', 'M':
		multiplier = mega
		text = strings.TrimSpace(text[:len(text)-1])
	}
	if text == "" || strings.HasPrefix(text, "-") {
		return 0, fmt.Errorf("Token 容量不能为负数")
	}

	amount, ok := new(big.Rat).SetString(text)
	if !ok {
		return 0, fmt.Errorf("Token 容量格式无效，支持整数、K 和 M")
	}
	amount.Mul(amount, big.NewRat(multiplier, 1))
	if amount.Sign() < 0 {
		return 0, fmt.Errorf("Token 容量不能为负数")
	}
	if !amount.IsInt() {
		return 0, fmt.Errorf("Token 容量换算后必须是整数")
	}
	maximum := big.NewInt(maximumPersistedCapacity)
	if amount.Num().Cmp(maximum) > 0 {
		return 0, fmt.Errorf("Token 容量超出系统可用范围")
	}
	return int(amount.Num().Int64()), nil
}

// Format returns a compact, lossless representation for form display.
func Format(value int) string {
	if value <= 0 {
		return "0"
	}
	if value >= int(mega) {
		return formatUnit(int64(value), mega, 6) + "M"
	}
	if value >= int(kilo) {
		return formatUnit(int64(value), kilo, 3) + "K"
	}
	return strconv.Itoa(value)
}

func formatUnit(value int64, unit int64, precision int) string {
	text := new(big.Rat).SetFrac64(value, unit).FloatString(precision)
	text = strings.TrimRight(text, "0")
	return strings.TrimRight(text, ".")
}

func capacityText(value any) string {
	switch current := value.(type) {
	case nil:
		return ""
	case string:
		return current
	case json.Number:
		return current.String()
	case int:
		return strconv.Itoa(current)
	case int8:
		return strconv.FormatInt(int64(current), 10)
	case int16:
		return strconv.FormatInt(int64(current), 10)
	case int32:
		return strconv.FormatInt(int64(current), 10)
	case int64:
		return strconv.FormatInt(current, 10)
	case uint:
		return strconv.FormatUint(uint64(current), 10)
	case uint8:
		return strconv.FormatUint(uint64(current), 10)
	case uint16:
		return strconv.FormatUint(uint64(current), 10)
	case uint32:
		return strconv.FormatUint(uint64(current), 10)
	case uint64:
		return strconv.FormatUint(current, 10)
	case float32:
		return strconv.FormatFloat(float64(current), 'f', -1, 32)
	case float64:
		return strconv.FormatFloat(current, 'f', -1, 64)
	default:
		return fmt.Sprint(current)
	}
}
