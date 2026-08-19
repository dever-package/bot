package parse

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"sort"
	"strconv"
	"strings"

	"github.com/pdfcpu/pdfcpu/pkg/api"
)

const (
	minerUMaxFileBytes   int64 = 200_000_000
	minerUPDFTargetBytes int64 = 190_000_000
	minerUPDFTargetPages       = 190
)

var minerUSplitPagePattern = regexp.MustCompile(`_(\d+)(?:-\d+)?\.pdf$`)

type minerUPart struct {
	Path      string
	Name      string
	PageStart int
	PageEnd   int
}

type minerUPDFLimits struct {
	MaxBytes int64
	MaxPages int
}

func defaultMinerUPDFLimits() minerUPDFLimits {
	return minerUPDFLimits{
		MaxBytes: minerUPDFTargetBytes,
		MaxPages: minerUPDFTargetPages,
	}
}

type preparedMinerUInput struct {
	Parts     []minerUPart
	TempDir   string
	PageCount int
}

func (input preparedMinerUInput) Cleanup() {
	if input.TempDir != "" {
		_ = os.RemoveAll(input.TempDir)
	}
}

func prepareMinerUInput(ctx context.Context, req Request) (preparedMinerUInput, error) {
	return prepareMinerUInputWithLimits(ctx, req, defaultMinerUPDFLimits())
}

func prepareMinerUInputWithLimits(ctx context.Context, req Request, limits minerUPDFLimits) (preparedMinerUInput, error) {
	if err := ctx.Err(); err != nil {
		return preparedMinerUInput{}, err
	}
	if limits.MaxBytes <= 0 || limits.MaxPages <= 0 {
		return preparedMinerUInput{}, fmt.Errorf("MinerU PDF 拆分限制必须大于 0")
	}
	info, err := os.Stat(req.Path)
	if err != nil {
		return preparedMinerUInput{}, fmt.Errorf("读取 MinerU 待解析文件失败: %w", err)
	}
	if info.IsDir() {
		return preparedMinerUInput{}, fmt.Errorf("MinerU 待解析路径不是文件")
	}
	if !isMinerUPDF(req) {
		if info.Size() > minerUMaxFileBytes {
			return preparedMinerUInput{}, fmt.Errorf("MinerU 精准解析单文件不能超过 200MB")
		}
		return preparedMinerUInput{Parts: []minerUPart{{Path: req.Path, Name: req.Name}}}, nil
	}

	pageCount, err := api.PageCountFile(req.Path)
	if err != nil {
		return preparedMinerUInput{}, fmt.Errorf("PDF 预检失败: %w", err)
	}
	if pageCount <= 0 {
		return preparedMinerUInput{}, fmt.Errorf("PDF 预检失败: 未读取到有效页面")
	}
	initial := minerUPart{
		Path:      req.Path,
		Name:      req.Name,
		PageStart: 1,
		PageEnd:   pageCount,
	}
	if limits.contains(info.Size(), pageCount) {
		return preparedMinerUInput{Parts: []minerUPart{initial}, PageCount: pageCount}, nil
	}

	tempDir, err := os.MkdirTemp("", "bot-mineru-pdf-*")
	if err != nil {
		return preparedMinerUInput{}, fmt.Errorf("创建 PDF 分块目录失败: %w", err)
	}
	input := preparedMinerUInput{TempDir: tempDir, PageCount: pageCount}
	sequence := 0
	parts, err := splitMinerUPDFPart(ctx, initial, tempDir, &sequence, limits)
	if err != nil {
		input.Cleanup()
		return preparedMinerUInput{}, err
	}
	if err := validateMinerUPDFParts(parts, pageCount); err != nil {
		input.Cleanup()
		return preparedMinerUInput{}, err
	}
	assignMinerUPartNames(parts, req.Name)
	input.Parts = parts
	return input, nil
}

func isMinerUPDF(req Request) bool {
	return strings.EqualFold(filepath.Ext(req.Name), ".pdf") ||
		strings.EqualFold(filepath.Ext(req.Path), ".pdf") ||
		strings.EqualFold(strings.TrimSpace(req.MimeType), "application/pdf")
}

func (limits minerUPDFLimits) contains(size int64, pages int) bool {
	return size <= limits.MaxBytes && pages <= limits.MaxPages
}

func splitMinerUPDFPart(
	ctx context.Context,
	part minerUPart,
	tempDir string,
	sequence *int,
	limits minerUPDFLimits,
) ([]minerUPart, error) {
	if err := ctx.Err(); err != nil {
		return nil, err
	}
	info, err := os.Stat(part.Path)
	if err != nil {
		return nil, fmt.Errorf("读取 PDF 分块失败: %w", err)
	}
	pageCount := part.PageEnd - part.PageStart + 1
	if limits.contains(info.Size(), pageCount) {
		return []minerUPart{part}, nil
	}
	if pageCount <= 1 {
		return nil, fmt.Errorf(
			"PDF 第 %d 页单页大小为 %.1fMB，超过 MinerU 单文件安全上限，无法继续拆分",
			part.PageStart,
			float64(info.Size())/1_000_000,
		)
	}
	if minerUPathInsideTempDir(part.Path, tempDir) {
		defer os.Remove(part.Path)
	}

	*sequence = *sequence + 1
	outDir := filepath.Join(tempDir, fmt.Sprintf("split-%04d", *sequence))
	if err := os.MkdirAll(outDir, 0o755); err != nil {
		return nil, fmt.Errorf("创建 PDF 分块目录失败: %w", err)
	}
	span := limits.MaxPages
	if pageCount <= limits.MaxPages {
		span = (pageCount + 1) / 2
	}
	if err := api.SplitFile(part.Path, outDir, span, nil); err != nil {
		return nil, fmt.Errorf("拆分 PDF 第 %d-%d 页失败: %w", part.PageStart, part.PageEnd, err)
	}
	if err := ctx.Err(); err != nil {
		return nil, err
	}

	paths, err := sortedMinerUSplitPaths(outDir)
	if err != nil {
		return nil, err
	}
	result := make([]minerUPart, 0, len(paths))
	pageStart := part.PageStart
	for _, path := range paths {
		childPages, err := api.PageCountFile(path)
		if err != nil {
			return nil, fmt.Errorf("读取 PDF 分块页数失败: %w", err)
		}
		if childPages <= 0 {
			return nil, fmt.Errorf("PDF 分块没有有效页面: %s", filepath.Base(path))
		}
		child := minerUPart{
			Path:      path,
			PageStart: pageStart,
			PageEnd:   pageStart + childPages - 1,
		}
		children, err := splitMinerUPDFPart(ctx, child, tempDir, sequence, limits)
		if err != nil {
			return nil, err
		}
		result = append(result, children...)
		pageStart = child.PageEnd + 1
	}
	if pageStart != part.PageEnd+1 {
		return nil, fmt.Errorf("PDF 分块页码不连续: 期望结束于第 %d 页", part.PageEnd)
	}
	return result, nil
}

func minerUPathInsideTempDir(path string, tempDir string) bool {
	relative, err := filepath.Rel(tempDir, path)
	if err != nil || relative == "." || relative == ".." {
		return false
	}
	return !strings.HasPrefix(relative, ".."+string(filepath.Separator))
}

func sortedMinerUSplitPaths(dir string) ([]string, error) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		return nil, fmt.Errorf("读取 PDF 分块目录失败: %w", err)
	}
	type splitPath struct {
		Path  string
		Start int
	}
	parts := make([]splitPath, 0, len(entries))
	for _, entry := range entries {
		if entry.IsDir() || !strings.EqualFold(filepath.Ext(entry.Name()), ".pdf") {
			continue
		}
		start, ok := minerUSplitStart(entry.Name())
		if !ok {
			return nil, fmt.Errorf("无法识别 PDF 分块页码: %s", entry.Name())
		}
		parts = append(parts, splitPath{Path: filepath.Join(dir, entry.Name()), Start: start})
	}
	if len(parts) == 0 {
		return nil, fmt.Errorf("PDF 拆分后没有生成文件")
	}
	sort.SliceStable(parts, func(left, right int) bool {
		return parts[left].Start < parts[right].Start
	})
	paths := make([]string, len(parts))
	for index, part := range parts {
		paths[index] = part.Path
	}
	return paths, nil
}

func minerUSplitStart(path string) (int, bool) {
	match := minerUSplitPagePattern.FindStringSubmatch(strings.ToLower(filepath.Base(path)))
	if len(match) != 2 {
		return 0, false
	}
	page, err := strconv.Atoi(match[1])
	if err != nil {
		return 0, false
	}
	return page, true
}

func validateMinerUPDFParts(parts []minerUPart, pageCount int) error {
	if len(parts) == 0 {
		return fmt.Errorf("PDF 拆分后没有有效分块")
	}
	nextPage := 1
	for _, part := range parts {
		if part.PageStart != nextPage || part.PageEnd < part.PageStart {
			return fmt.Errorf("PDF 分块页码不连续")
		}
		nextPage = part.PageEnd + 1
	}
	if nextPage != pageCount+1 {
		return fmt.Errorf("PDF 分块页数不完整: 期望 %d 页", pageCount)
	}
	return nil
}

func assignMinerUPartNames(parts []minerUPart, originalName string) {
	extension := filepath.Ext(originalName)
	base := strings.TrimSpace(strings.TrimSuffix(filepath.Base(originalName), extension))
	if base == "" {
		base = "document"
	}
	baseRunes := []rune(base)
	if len(baseRunes) > 80 {
		base = string(baseRunes[:80])
	}
	for index := range parts {
		parts[index].Name = fmt.Sprintf("part-%04d-%s.pdf", index+1, base)
	}
}
