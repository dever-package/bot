package parse

import (
	"bytes"
	"context"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
	"testing"

	"github.com/pdfcpu/pdfcpu/pkg/api"
	pdfcpu "github.com/pdfcpu/pdfcpu/pkg/pdfcpu"
	"github.com/pdfcpu/pdfcpu/pkg/pdfcpu/model"
	"github.com/pdfcpu/pdfcpu/pkg/pdfcpu/types"
)

func TestPrepareMinerUInputSplitsPDFOverPageLimit(t *testing.T) {
	tempRoot := t.TempDir()
	t.Setenv("TMPDIR", tempRoot)
	sourcePath := filepath.Join(tempRoot, "source.pdf")
	writeTestPDF(t, sourcePath, minerUPDFTargetPages+1)

	input, err := prepareMinerUInput(context.Background(), Request{
		Path:     sourcePath,
		Name:     "source.pdf",
		MimeType: "application/pdf",
	})
	if err != nil {
		t.Fatalf("prepareMinerUInput() error = %v", err)
	}
	wantRanges := [][2]int{{1, minerUPDFTargetPages}, {minerUPDFTargetPages + 1, minerUPDFTargetPages + 1}}
	if len(input.Parts) != len(wantRanges) {
		t.Fatalf("part count = %d, want %d", len(input.Parts), len(wantRanges))
	}
	for index, want := range wantRanges {
		part := input.Parts[index]
		if part.PageStart != want[0] || part.PageEnd != want[1] {
			t.Fatalf("part %d pages = %d-%d, want %d-%d", index, part.PageStart, part.PageEnd, want[0], want[1])
		}
		if _, err := os.Stat(part.Path); err != nil {
			t.Fatalf("part %d path is not readable: %v", index, err)
		}
	}

	tempDir := input.TempDir
	input.Cleanup()
	if _, err := os.Stat(tempDir); !os.IsNotExist(err) {
		t.Fatalf("Cleanup() left temp dir %q, stat error = %v", tempDir, err)
	}
}

func TestPrepareMinerUInputRecursivelySplitsPDFOverByteLimit(t *testing.T) {
	tempRoot := t.TempDir()
	t.Setenv("TMPDIR", tempRoot)
	sourcePath := filepath.Join(tempRoot, "source.pdf")
	writeTestPDF(t, sourcePath, 4)

	input, err := prepareMinerUInputWithLimits(context.Background(), Request{
		Path:     sourcePath,
		Name:     "source.pdf",
		MimeType: "application/pdf",
	}, minerUPDFLimits{
		MaxBytes: recursiveSplitByteLimit(t, sourcePath),
		MaxPages: 100,
	})
	if err != nil {
		t.Fatalf("prepareMinerUInputWithLimits() error = %v", err)
	}
	defer input.Cleanup()

	if len(input.Parts) != 4 {
		t.Fatalf("part count = %d, want 4 single-page parts", len(input.Parts))
	}
	for index, part := range input.Parts {
		wantPage := index + 1
		if part.PageStart != wantPage || part.PageEnd != wantPage {
			t.Fatalf("part %d pages = %d-%d, want %d-%d", index, part.PageStart, part.PageEnd, wantPage, wantPage)
		}
	}
}

func TestPrepareMinerUInputRejectsOversizedSinglePageAndCleansTempDir(t *testing.T) {
	tempRoot := t.TempDir()
	t.Setenv("TMPDIR", tempRoot)
	sourcePath := filepath.Join(tempRoot, "source.pdf")
	writeTestPDF(t, sourcePath, 1)
	info, err := os.Stat(sourcePath)
	if err != nil {
		t.Fatalf("stat source PDF: %v", err)
	}

	_, err = prepareMinerUInputWithLimits(context.Background(), Request{
		Path:     sourcePath,
		Name:     "source.pdf",
		MimeType: "application/pdf",
	}, minerUPDFLimits{
		MaxBytes: info.Size() - 1,
		MaxPages: 10,
	})
	if err == nil || !strings.Contains(err.Error(), "第 1 页单页大小") {
		t.Fatalf("prepareMinerUInputWithLimits() error = %v, want oversized single-page error", err)
	}
	tempDirs, globErr := filepath.Glob(filepath.Join(tempRoot, "bot-mineru-pdf-*"))
	if globErr != nil {
		t.Fatalf("glob MinerU temp dirs: %v", globErr)
	}
	if len(tempDirs) != 0 {
		t.Fatalf("failed preparation left temp dirs: %v", tempDirs)
	}
}

func writeTestPDF(t *testing.T, targetPath string, pageCount int) {
	t.Helper()
	if pageCount <= 0 {
		t.Fatalf("pageCount must be positive")
	}

	singlePagePath := targetPath
	if pageCount > 1 {
		singlePagePath = filepath.Join(filepath.Dir(targetPath), "single-page.pdf")
	}
	xRefTable, err := pdfcpu.CreateDemoXRef()
	if err != nil {
		t.Fatalf("CreateDemoXRef() error = %v", err)
	}
	rootDict, err := xRefTable.Catalog()
	if err != nil {
		t.Fatalf("Catalog() error = %v", err)
	}
	page := model.Page{
		MediaBox: types.RectForFormat("A4"),
		Fm:       model.FontMap{},
		Buf:      new(bytes.Buffer),
	}
	if err := pdfcpu.AddPageTreeWithSamplePage(xRefTable, rootDict, page); err != nil {
		t.Fatalf("AddPageTreeWithSamplePage() error = %v", err)
	}
	if err := api.CreatePDFFile(xRefTable, singlePagePath, nil); err != nil {
		t.Fatalf("CreatePDFFile() error = %v", err)
	}
	if pageCount == 1 {
		return
	}

	inputs := make([]string, pageCount)
	for index := range inputs {
		inputs[index] = singlePagePath
	}
	if err := api.MergeCreateFile(inputs, targetPath, false, nil); err != nil {
		t.Fatalf("MergeCreateFile() error = %v", err)
	}
}

func recursiveSplitByteLimit(t *testing.T, sourcePath string) int64 {
	t.Helper()
	twoPageDir := filepath.Join(t.TempDir(), "two-page")
	if err := os.MkdirAll(twoPageDir, 0o755); err != nil {
		t.Fatalf("create two-page probe dir: %v", err)
	}
	if err := api.SplitFile(sourcePath, twoPageDir, 2, nil); err != nil {
		t.Fatalf("split probe PDF into two-page parts: %v", err)
	}
	twoPagePaths := testPDFPaths(t, twoPageDir)
	if len(twoPagePaths) != 2 {
		t.Fatalf("two-page probe part count = %d, want 2", len(twoPagePaths))
	}

	minTwoPageBytes := testFileSize(t, twoPagePaths[0])
	maxSinglePageBytes := int64(0)
	for index, twoPagePath := range twoPagePaths {
		if size := testFileSize(t, twoPagePath); size < minTwoPageBytes {
			minTwoPageBytes = size
		}
		singlePageDir := filepath.Join(t.TempDir(), "single-page", strconv.Itoa(index))
		if err := os.MkdirAll(singlePageDir, 0o755); err != nil {
			t.Fatalf("create single-page probe dir: %v", err)
		}
		if err := api.SplitFile(twoPagePath, singlePageDir, 1, nil); err != nil {
			t.Fatalf("split probe PDF into single-page parts: %v", err)
		}
		for _, singlePagePath := range testPDFPaths(t, singlePageDir) {
			if size := testFileSize(t, singlePagePath); size > maxSinglePageBytes {
				maxSinglePageBytes = size
			}
		}
	}
	if minTwoPageBytes <= maxSinglePageBytes {
		t.Fatalf("PDF fixture has no byte gap between one and two pages: one=%d, two=%d", maxSinglePageBytes, minTwoPageBytes)
	}
	return maxSinglePageBytes + (minTwoPageBytes-maxSinglePageBytes)/2
}

func testPDFPaths(t *testing.T, dir string) []string {
	t.Helper()
	paths, err := filepath.Glob(filepath.Join(dir, "*.pdf"))
	if err != nil {
		t.Fatalf("glob PDF files: %v", err)
	}
	sort.Strings(paths)
	return paths
}

func testFileSize(t *testing.T, path string) int64 {
	t.Helper()
	info, err := os.Stat(path)
	if err != nil {
		t.Fatalf("stat %q: %v", path, err)
	}
	return info.Size()
}
