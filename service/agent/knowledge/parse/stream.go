package parse

import (
	"bufio"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"unicode/utf8"
)

const (
	streamReadBufferBytes       = 64 * 1024
	streamAggregateMaxRunes     = 120000
	streamAggregateSectionRunes = streamAggregateMaxRunes / 2
	streamNodeMinRunes          = 4000
)

type streamedTextParser struct {
	req          Request
	nodeType     string
	language     string
	chunkRunes   int
	overlapRunes int
	current      []rune
	freshRunes   int
	line         int
	lineStart    int
	nodes        []Node
	aggregate    representativeRunes
}

func parseStreamedTextFile(req Request) (Result, error) {
	file, err := os.Open(req.Path)
	if err != nil {
		return Result{}, fmt.Errorf("读取文档失败: %w", err)
	}
	defer file.Close()

	parser := newStreamedTextParser(req)
	if err := parser.read(file); err != nil {
		return Result{}, err
	}
	return parser.result(), nil
}

func newStreamedTextParser(req Request) *streamedTextParser {
	chunkRunes := req.MaxNodeLength
	if chunkRunes < streamNodeMinRunes {
		chunkRunes = streamNodeMinRunes
	}
	overlapRunes := normalizeNodeOverlap(req.NodeOverlap, chunkRunes)
	ext := strings.ToLower(filepath.Ext(firstNonEmptyString(req.Name, req.Path)))
	nodeType := NodeTypeParagraph
	language := ""
	if codeExts[ext] {
		nodeType = NodeTypeCode
		language = codeLanguage(req.Name)
	}
	return &streamedTextParser{
		req:          req,
		nodeType:     nodeType,
		language:     language,
		chunkRunes:   chunkRunes,
		overlapRunes: overlapRunes,
		line:         1,
		lineStart:    1,
		nodes:        make([]Node, 0),
		aggregate:    newRepresentativeRunes(streamAggregateSectionRunes),
	}
}

func (p *streamedTextParser) read(source io.Reader) error {
	reader := bufio.NewReaderSize(source, streamReadBufferBytes)
	for {
		if p.aggregate.total%4096 == 0 && p.req.Context != nil {
			select {
			case <-p.req.Context.Done():
				return p.req.Context.Err()
			default:
			}
		}
		r, size, err := reader.ReadRune()
		if err != nil {
			if err == io.EOF {
				break
			}
			return fmt.Errorf("读取文档失败: %w", err)
		}
		if r == utf8.RuneError && size == 1 {
			return fmt.Errorf("文档不是有效的 UTF-8 文本")
		}
		p.appendRune(r)
	}
	p.flush(true)
	return nil
}

func (p *streamedTextParser) appendRune(r rune) {
	p.current = append(p.current, r)
	p.freshRunes++
	p.aggregate.add(r)
	if r == '\n' {
		p.line++
	}
	if len(p.current) >= p.chunkRunes {
		p.flush(false)
	}
}

func (p *streamedTextParser) flush(final bool) {
	if p.freshRunes == 0 {
		return
	}
	content := normalizeText(string(p.current))
	if content != "" {
		index := len(p.nodes) + 1
		title := paragraphTitle(content, index)
		metadata := map[string]any{"parser": "stream"}
		if p.nodeType == NodeTypeCode {
			title = strings.TrimSpace(p.req.Name)
			if title == "" {
				title = "代码"
			}
			if index > 1 {
				title = fmt.Sprintf("%s #%d", title, index)
			}
			metadata["language"] = p.language
		}
		p.nodes = append(p.nodes, Node{
			Type:      p.nodeType,
			Title:     title,
			Content:   content,
			PlainText: content,
			LineStart: p.lineStart,
			LineEnd:   p.line,
			Metadata:  metadata,
		})
	}
	if final || p.overlapRunes <= 0 {
		p.current = p.current[:0]
		p.lineStart = p.line
	} else {
		keep := p.overlapRunes
		if keep > len(p.current) {
			keep = len(p.current)
		}
		p.current = append(p.current[:0], p.current[len(p.current)-keep:]...)
		p.lineStart = p.line - runeLineBreaks(p.current)
		if p.lineStart < 1 {
			p.lineStart = 1
		}
	}
	p.freshRunes = 0
}

func (p *streamedTextParser) result() Result {
	aggregate := p.aggregate.text()
	return Result{
		PlainText: aggregate,
		Markdown:  aggregate,
		Outline:   p.nodes,
		Raw: map[string]any{
			"parser":         "stream",
			"streamed":       true,
			"source_runes":   p.aggregate.total,
			"content_chunks": len(p.nodes),
		},
	}
}

func runeLineBreaks(value []rune) int {
	count := 0
	for _, r := range value {
		if r == '\n' {
			count++
		}
	}
	return count
}

func firstNonEmptyString(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return value
		}
	}
	return ""
}

type representativeRunes struct {
	limit int
	head  []rune
	tail  []rune
	next  int
	total int
}

func newRepresentativeRunes(sectionLimit int) representativeRunes {
	return representativeRunes{
		limit: sectionLimit,
		head:  make([]rune, 0, sectionLimit),
		tail:  make([]rune, 0, sectionLimit),
	}
}

func (b *representativeRunes) add(r rune) {
	b.total++
	if len(b.head) < b.limit {
		b.head = append(b.head, r)
		return
	}
	if len(b.tail) < b.limit {
		b.tail = append(b.tail, r)
		return
	}
	b.tail[b.next] = r
	b.next = (b.next + 1) % b.limit
}

func (b *representativeRunes) addText(value string) {
	for _, r := range value {
		b.add(r)
	}
}

func (b representativeRunes) text() string {
	if b.total <= len(b.head) {
		return normalizeText(string(b.head))
	}
	if b.total <= len(b.head)+len(b.tail) {
		return normalizeText(string(b.head) + string(b.tail))
	}
	tail := make([]rune, 0, len(b.tail))
	tail = append(tail, b.tail[b.next:]...)
	tail = append(tail, b.tail[:b.next]...)
	omitted := b.total - len(b.head) - len(tail)
	return normalizeText(fmt.Sprintf("%s\n\n[中间省略 %d 个字符]\n\n%s", string(b.head), omitted, string(tail)))
}
