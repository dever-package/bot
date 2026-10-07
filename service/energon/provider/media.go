package provider

type BinaryMediaOutput struct {
	Files []BinaryPayload `json:"-"`
	Meta  map[string]any  `json:"meta,omitempty"`
}

func AsBinaryMediaOutput(value any) (BinaryMediaOutput, bool) {
	switch current := value.(type) {
	case BinaryMediaOutput:
		return current, true
	case *BinaryMediaOutput:
		if current != nil {
			return *current, true
		}
	}
	return BinaryMediaOutput{}, false
}
