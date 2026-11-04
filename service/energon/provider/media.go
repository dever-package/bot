package provider

type BinaryMediaOutput struct {
	Files       []BinaryPayload `json:"-"`
	Attachments []BinaryFile    `json:"-"`
	Lyrics      string          `json:"lyrics,omitempty"`
	Text        string          `json:"text,omitempty"`
	Meta        map[string]any  `json:"meta,omitempty"`
}

type BinaryFile struct {
	Name    string
	Payload BinaryPayload
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
