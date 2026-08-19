package parse

import (
	"bufio"
	"encoding/json"
	"io"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"testing"
)

func TestMergeMinerUParsedPartsAdjustsOffsetsAndCleansInputs(t *testing.T) {
	tempRoot := t.TempDir()
	t.Setenv("TMPDIR", tempRoot)
	firstStream := writeTestStreamNodes(t, filepath.Join(tempRoot, "first.jsonl"), []Node{{
		Type:      NodeTypeParagraph,
		Title:     "first stream",
		PageStart: 2,
		PageEnd:   2,
		LineStart: 1,
		LineEnd:   1,
	}})
	secondStream := writeTestStreamNodes(t, filepath.Join(tempRoot, "second.jsonl"), []Node{{
		Type:      NodeTypeParagraph,
		Title:     "second stream",
		PageStart: 1,
		PageEnd:   1,
		LineStart: 1,
		LineEnd:   1,
	}})
	parsed := []minerUParsedPart{
		{
			Part: minerUPart{PageStart: 1, PageEnd: 2},
			Result: Result{
				PlainText: "first plain",
				Markdown:  "first\nline",
				Outline: []Node{{
					Type:      NodeTypeHeading,
					Title:     "first",
					PageStart: 1,
					PageEnd:   2,
					LineStart: 1,
					LineEnd:   2,
				}},
				Pages: []Page{
					{Number: 1, Title: "local 1"},
					{Number: 2, Title: "local 2"},
				},
				Assets: []Asset{{
					Path:     "images/chart.png",
					Metadata: map[string]any{"page": 2},
				}},
				StreamNodeFile: firstStream,
				StreamNodes:    1,
			},
		},
		{
			Part: minerUPart{PageStart: 3, PageEnd: 4},
			Result: Result{
				PlainText: "second plain",
				Markdown:  "second",
				Outline: []Node{{
					Type:      NodeTypeHeading,
					Title:     "second",
					PageStart: 1,
					PageEnd:   2,
					LineStart: 1,
					LineEnd:   1,
				}},
				Pages: []Page{
					{Number: 1, Title: "local 1"},
					{Number: 2, Title: "local 2"},
				},
				Assets: []Asset{{
					Path:     "images/chart.png",
					Metadata: map[string]any{"page": 1},
				}},
				StreamNodeFile: secondStream,
				StreamNodes:    1,
			},
		},
	}

	result, err := mergeMinerUParsedParts(Request{Name: "source.pdf"}, parsed, 4)
	if err != nil {
		t.Fatalf("mergeMinerUParsedParts() error = %v", err)
	}
	if result.Markdown != "first\nline\n\nsecond" {
		t.Fatalf("merged Markdown = %q", result.Markdown)
	}
	if len(result.Outline) != 2 {
		t.Fatalf("outline count = %d, want 2", len(result.Outline))
	}
	secondOutline := result.Outline[1]
	if secondOutline.PageStart != 3 || secondOutline.PageEnd != 4 {
		t.Fatalf("second outline pages = %d-%d, want 3-4", secondOutline.PageStart, secondOutline.PageEnd)
	}
	if secondOutline.LineStart != 4 || secondOutline.LineEnd != 4 {
		t.Fatalf("second outline lines = %d-%d, want 4-4", secondOutline.LineStart, secondOutline.LineEnd)
	}
	if secondOutline.Metadata["source_part"] != 2 {
		t.Fatalf("second outline source_part = %v, want 2", secondOutline.Metadata["source_part"])
	}
	for index, page := range result.Pages {
		wantPage := index + 1
		if page.Number != wantPage || page.Title != "第 "+strconv.Itoa(wantPage)+" 页" {
			t.Fatalf("page %d = number %d title %q, want page %d", index, page.Number, page.Title, wantPage)
		}
	}
	if len(result.Assets) != 2 {
		t.Fatalf("asset count = %d, want 2", len(result.Assets))
	}
	if result.Assets[0].Path != "part-0001/images/chart.png" || result.Assets[0].Metadata["page"] != 2 {
		t.Fatalf("first asset = %#v", result.Assets[0])
	}
	if result.Assets[1].Path != "part-0002/images/chart.png" || result.Assets[1].Metadata["page"] != 3 {
		t.Fatalf("second asset = %#v", result.Assets[1])
	}
	if result.StreamNodes != 2 {
		t.Fatalf("stream node count = %d, want 2", result.StreamNodes)
	}
	streamNodes := readTestStreamNodes(t, result.StreamNodeFile)
	if len(streamNodes) != 2 {
		t.Fatalf("merged stream node count = %d, want 2", len(streamNodes))
	}
	if streamNodes[1].PageStart != 3 || streamNodes[1].LineStart != 4 {
		t.Fatalf("second stream node = %#v", streamNodes[1])
	}
	for _, sourcePath := range []string{firstStream, secondStream} {
		if _, err := os.Stat(sourcePath); !os.IsNotExist(err) {
			t.Fatalf("merge left source stream %q, stat error = %v", sourcePath, err)
		}
	}

	mergedStream := result.StreamNodeFile
	result.Cleanup()
	if _, err := os.Stat(mergedStream); !os.IsNotExist(err) {
		t.Fatalf("Result.Cleanup() left merged stream %q, stat error = %v", mergedStream, err)
	}
}

func TestMergeMinerUParsedPartsCleansTemporaryFilesOnFailure(t *testing.T) {
	tempRoot := t.TempDir()
	t.Setenv("TMPDIR", tempRoot)
	validStream := writeTestStreamNodes(t, filepath.Join(tempRoot, "valid.jsonl"), []Node{{Title: "valid"}})
	invalidStream := filepath.Join(tempRoot, "invalid.jsonl")
	if err := os.WriteFile(invalidStream, []byte("{invalid"), 0o600); err != nil {
		t.Fatalf("write invalid stream: %v", err)
	}

	_, err := mergeMinerUParsedParts(Request{Name: "source.pdf"}, []minerUParsedPart{
		{Part: minerUPart{PageStart: 1, PageEnd: 1}, Result: Result{Markdown: "first", StreamNodeFile: validStream}},
		{Part: minerUPart{PageStart: 2, PageEnd: 2}, Result: Result{Markdown: "second", StreamNodeFile: invalidStream}},
	}, 2)
	if err == nil || !strings.Contains(err.Error(), "读取 MinerU 分块节点缓存失败") {
		t.Fatalf("mergeMinerUParsedParts() error = %v, want stream decode error", err)
	}
	for _, sourcePath := range []string{validStream, invalidStream} {
		if _, err := os.Stat(sourcePath); !os.IsNotExist(err) {
			t.Fatalf("failed merge left source stream %q, stat error = %v", sourcePath, err)
		}
	}
	outputs, globErr := filepath.Glob(filepath.Join(tempRoot, "bot-mineru-nodes-*.jsonl"))
	if globErr != nil {
		t.Fatalf("glob merged streams: %v", globErr)
	}
	if len(outputs) != 0 {
		t.Fatalf("failed merge left output streams: %v", outputs)
	}
}

func writeTestStreamNodes(t *testing.T, path string, nodes []Node) string {
	t.Helper()
	file, err := os.Create(path)
	if err != nil {
		t.Fatalf("create stream node file: %v", err)
	}
	encoder := json.NewEncoder(file)
	for _, node := range nodes {
		if err := encoder.Encode(node); err != nil {
			_ = file.Close()
			t.Fatalf("encode stream node: %v", err)
		}
	}
	if err := file.Close(); err != nil {
		t.Fatalf("close stream node file: %v", err)
	}
	return path
}

func readTestStreamNodes(t *testing.T, path string) []Node {
	t.Helper()
	file, err := os.Open(path)
	if err != nil {
		t.Fatalf("open stream node file: %v", err)
	}
	defer file.Close()
	decoder := json.NewDecoder(bufio.NewReader(file))
	nodes := make([]Node, 0)
	for {
		var node Node
		if err := decoder.Decode(&node); err == io.EOF {
			break
		} else if err != nil {
			t.Fatalf("decode stream node: %v", err)
		}
		nodes = append(nodes, node)
	}
	return nodes
}
