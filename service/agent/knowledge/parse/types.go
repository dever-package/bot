package parse

type Request struct {
	Path          string
	Name          string
	MimeType      string
	Content       string
	MaxNodeLength int
}

type Result struct {
	PlainText string
	Markdown  string
	Outline   []Node
	Pages     []Page
	Assets    []Asset
	Raw       map[string]any
}

type Node struct {
	Type      string
	Title     string
	Content   string
	PlainText string
	Level     int
	PageStart int
	PageEnd   int
	LineStart int
	LineEnd   int
	Children  []Node
	Metadata  map[string]any
}

type Page struct {
	Number    int
	Title     string
	PlainText string
	Markdown  string
	Metadata  map[string]any
}

type Asset struct {
	Name     string
	Path     string
	Type     string
	MimeType string
	Metadata map[string]any
}

const (
	NodeTypeDoc        = "doc"
	NodeTypePage       = "page"
	NodeTypeHeading    = "heading"
	NodeTypeParagraph  = "paragraph"
	NodeTypeTable      = "table"
	NodeTypeImage      = "image"
	NodeTypeCode       = "code"
	NodeTypeAttachment = "attachment"
)
