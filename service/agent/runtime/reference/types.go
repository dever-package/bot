package reference

const ContentVersion = 1

const (
	TypeMessage    = "message"
	TypeArtifact   = "artifact"
	TypeUploadFile = "upload_file"
	TypeSession    = "session"
)

type Part struct {
	Type    string `json:"type"`
	Text    string `json:"text,omitempty"`
	RefType string `json:"ref_type,omitempty"`
	RefID   uint64 `json:"ref_id,omitempty"`
	Label   string `json:"label,omitempty"`
	Usage   string `json:"usage,omitempty"`
}

type Content struct {
	Version             int                  `json:"version"`
	Parts               []Part               `json:"parts"`
	InteractionResponse *InteractionResponse `json:"interaction_response,omitempty"`
}

type InteractionResponse struct {
	InteractionID string         `json:"interaction_id"`
	Data          map[string]any `json:"data"`
}

type Input struct {
	Text       string
	Content    Content
	References []Reference
}

type Reference struct {
	Type  string
	ID    uint64
	Label string
	Usage string
}

type Media struct {
	ReferenceType string
	ReferenceID   uint64
	ArtifactID    uint64
	FileID        uint64
	SeriesID      uint64
	Kind          string
	Name          string
	Label         string
	URL           string
}

type Resolved struct {
	Reference Reference
	Title     string
	Text      string
	Media     []Media
}

type Result struct {
	Items  []Resolved
	Media  []Media
	Prompt string
}
