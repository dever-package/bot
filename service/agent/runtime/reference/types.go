package reference

const ContentVersion = 1

const (
	TypeMessage    = "message"
	TypeArtifact   = "artifact"
	TypeUploadFile = "upload_file"
	TypeSession    = "session"
	TypeAsset      = "asset"
)

type Part struct {
	Type       string               `json:"type"`
	Text       string               `json:"text,omitempty"`
	RefType    string               `json:"ref_type,omitempty"`
	RefID      uint64               `json:"ref_id,omitempty"`
	Label      string               `json:"label,omitempty"`
	Usage      string               `json:"usage,omitempty"`
	Trigger    string               `json:"ref_trigger,omitempty"`
	VersionID  uint64               `json:"ref_version_id,omitempty"`
	MediaURL   string               `json:"ref_media_url,omitempty"`
	MediaIndex int                  `json:"ref_media_index,omitempty"`
	MediaCount int                  `json:"ref_media_count,omitempty"`
	MediaItems []MediaSelectionItem `json:"ref_media_items,omitempty"`
}

type MediaSelectionItem struct {
	URL   string `json:"url,omitempty"`
	Index int    `json:"index,omitempty"`
	Usage string `json:"usage,omitempty"`
}

type Content struct {
	Version             int                  `json:"version"`
	Parts               []Part               `json:"parts"`
	Params              map[string]any       `json:"params,omitempty"`
	InteractionResponse *InteractionResponse `json:"interaction_response,omitempty"`
}

type InteractionResponse struct {
	InteractionID string         `json:"interaction_id"`
	Data          map[string]any `json:"data"`
}

type Input struct {
	Text       string
	Content    Content
	Params     map[string]any
	References []Reference
}

type Reference struct {
	Type       string
	ID         uint64
	Label      string
	Usage      string
	Trigger    string
	VersionID  uint64
	MediaURL   string
	MediaIndex int
	MediaCount int
	MediaItems []MediaSelectionItem
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
	Usage         string
}

type Resolved struct {
	Reference Reference
	Title     string
	Text      string
	Media     []Media
	Output    map[string]any
}

type Result struct {
	Items   []Resolved
	Media   []Media
	Context []map[string]any
}
