package parse

import (
	"context"
	"os"
)

type Request struct {
	Context       context.Context
	Path          string
	Name          string
	MimeType      string
	Content       string
	MaxNodeLength int
	NodeOverlap   int
}

type Result struct {
	PlainText      string
	Markdown       string
	Outline        []Node
	StreamNodeFile string
	StreamNodes    int
	Pages          []Page
	Assets         []Asset
	Raw            map[string]any
}

func (r Result) Cleanup() {
	if r.StreamNodeFile != "" {
		_ = os.Remove(r.StreamNodeFile)
	}
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
	NodeTypeHeading   = "heading"
	NodeTypeParagraph = "paragraph"
	NodeTypeTable     = "table"
	NodeTypeImage     = "image"
	NodeTypeCode      = "code"
)
