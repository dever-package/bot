package parse

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
)

func mergeMinerUParsedParts(req Request, parsed []minerUParsedPart, pageCount int) (Result, error) {
	if len(parsed) == 0 {
		return Result{}, fmt.Errorf("MinerU 没有返回可合并的解析结果")
	}
	lineOffsets := minerUPartLineOffsets(parsed)
	if len(parsed) == 1 {
		return adjustMinerUResult(parsed[0], lineOffsets[0], 1, false), nil
	}
	defer func() {
		for _, part := range parsed {
			part.Result.Cleanup()
		}
	}()

	merged := Result{
		Outline: make([]Node, 0),
		Pages:   make([]Page, 0),
		Assets:  make([]Asset, 0),
		Raw: map[string]any{
			"parser":     "mineru",
			"split":      true,
			"part_count": len(parsed),
			"page_count": pageCount,
		},
	}
	plainSections := make([]string, 0, len(parsed))
	markdownSections := make([]string, 0, len(parsed))
	for index, part := range parsed {
		adjusted := adjustMinerUResult(part, lineOffsets[index], index+1, true)
		if text := strings.TrimSpace(adjusted.PlainText); text != "" {
			plainSections = append(plainSections, text)
		}
		if text := strings.TrimSpace(adjusted.Markdown); text != "" {
			markdownSections = append(markdownSections, text)
		}
		merged.Outline = append(merged.Outline, adjusted.Outline...)
		merged.Pages = append(merged.Pages, adjusted.Pages...)
		merged.Assets = append(merged.Assets, adjusted.Assets...)
	}
	merged.PlainText = strings.Join(plainSections, "\n\n")
	merged.Markdown = strings.Join(markdownSections, "\n\n")

	streamPath, streamNodes, err := mergeMinerUStreamNodes(parsed, lineOffsets)
	if err != nil {
		return Result{}, err
	}
	merged.StreamNodeFile = streamPath
	merged.StreamNodes = streamNodes
	if strings.TrimSpace(req.Name) != "" {
		merged.Raw["file_name"] = req.Name
	}
	return merged, nil
}

func adjustMinerUResult(part minerUParsedPart, lineOffset int, partNumber int, namespaceAssets bool) Result {
	result := part.Result
	for index := range result.Outline {
		result.Outline[index] = adjustMinerUNode(result.Outline[index], part.Part, lineOffset, partNumber)
	}
	for index := range result.Pages {
		result.Pages[index] = adjustMinerUPage(result.Pages[index], part.Part, partNumber)
	}
	for index := range result.Assets {
		result.Assets[index] = adjustMinerUAsset(result.Assets[index], part.Part, partNumber, namespaceAssets)
	}
	return result
}

func adjustMinerUNode(node Node, part minerUPart, lineOffset int, partNumber int) Node {
	if part.PageStart > 0 {
		pageOffset := part.PageStart - 1
		if node.PageStart > 0 {
			node.PageStart += pageOffset
		} else {
			node.PageStart = part.PageStart
		}
		if node.PageEnd > 0 {
			node.PageEnd += pageOffset
		} else {
			node.PageEnd = part.PageEnd
		}
	}
	if node.LineStart > 0 {
		node.LineStart += lineOffset
	}
	if node.LineEnd > 0 {
		node.LineEnd += lineOffset
	}
	node.Metadata = cloneMinerUMetadata(node.Metadata)
	node.Metadata["source_part"] = partNumber
	for index := range node.Children {
		node.Children[index] = adjustMinerUNode(node.Children[index], part, lineOffset, partNumber)
	}
	return node
}

func adjustMinerUPage(page Page, part minerUPart, partNumber int) Page {
	if part.PageStart > 0 {
		page.Number += part.PageStart - 1
		page.Title = fmt.Sprintf("第 %d 页", page.Number)
	}
	page.Metadata = cloneMinerUMetadata(page.Metadata)
	page.Metadata["source_part"] = partNumber
	return page
}

func adjustMinerUAsset(asset Asset, part minerUPart, partNumber int, namespace bool) Asset {
	asset.Metadata = cloneMinerUMetadata(asset.Metadata)
	if part.PageStart > 0 {
		page := intFromAny(asset.Metadata["page"])
		if page > 0 {
			asset.Metadata["page"] = page + part.PageStart - 1
		}
	}
	asset.Metadata["source_part"] = partNumber
	if namespace && strings.TrimSpace(asset.Path) != "" {
		cleanPath := strings.TrimLeft(filepath.ToSlash(filepath.Clean(asset.Path)), "/.")
		asset.Path = filepath.ToSlash(filepath.Join(fmt.Sprintf("part-%04d", partNumber), cleanPath))
	}
	return asset
}

func cloneMinerUMetadata(source map[string]any) map[string]any {
	result := make(map[string]any, len(source)+1)
	for key, value := range source {
		result[key] = value
	}
	return result
}

func minerUPartLineOffsets(parsed []minerUParsedPart) []int {
	offsets := make([]int, len(parsed))
	lineOffset := 0
	hasContent := false
	for index, part := range parsed {
		content := part.Result.Markdown
		if strings.TrimSpace(content) == "" {
			content = part.Result.PlainText
		}
		if hasContent && strings.TrimSpace(content) != "" {
			lineOffset += 2
		}
		offsets[index] = lineOffset
		if strings.TrimSpace(content) != "" {
			lineOffset += minerUResultLineBreaks(part.Result, content)
			hasContent = true
		}
	}
	return offsets
}

func minerUResultLineBreaks(result Result, content string) int {
	if lines := intFromAny(result.Raw["source_lines"]); lines > 0 {
		return lines - 1
	}
	return strings.Count(content, "\n")
}

func mergeMinerUStreamNodes(parsed []minerUParsedPart, lineOffsets []int) (string, int, error) {
	hasStream := false
	for _, part := range parsed {
		if strings.TrimSpace(part.Result.StreamNodeFile) != "" {
			hasStream = true
			break
		}
	}
	if !hasStream {
		return "", 0, nil
	}
	tempFile, err := os.CreateTemp("", "bot-mineru-nodes-*.jsonl")
	if err != nil {
		return "", 0, fmt.Errorf("创建 MinerU 合并节点缓存失败: %w", err)
	}
	path := tempFile.Name()
	keep := false
	defer func() {
		_ = tempFile.Close()
		if !keep {
			_ = os.Remove(path)
		}
	}()
	writer := bufio.NewWriterSize(tempFile, streamReadBufferBytes)
	encoder := json.NewEncoder(writer)
	nodeCount := 0
	for index, part := range parsed {
		if strings.TrimSpace(part.Result.StreamNodeFile) == "" {
			continue
		}
		count, err := appendMinerUStreamNodes(
			part.Result.StreamNodeFile,
			encoder,
			part.Part,
			lineOffsets[index],
			index+1,
		)
		if err != nil {
			return "", 0, err
		}
		nodeCount += count
	}
	if err := writer.Flush(); err != nil {
		return "", 0, fmt.Errorf("写入 MinerU 合并节点缓存失败: %w", err)
	}
	if err := tempFile.Close(); err != nil {
		return "", 0, fmt.Errorf("关闭 MinerU 合并节点缓存失败: %w", err)
	}
	keep = true
	return path, nodeCount, nil
}

func appendMinerUStreamNodes(
	path string,
	encoder *json.Encoder,
	part minerUPart,
	lineOffset int,
	partNumber int,
) (int, error) {
	file, err := os.Open(path)
	if err != nil {
		return 0, fmt.Errorf("打开 MinerU 分块节点缓存失败: %w", err)
	}
	defer file.Close()
	decoder := json.NewDecoder(bufio.NewReaderSize(file, streamReadBufferBytes))
	count := 0
	for {
		var node Node
		if err := decoder.Decode(&node); err != nil {
			if err == io.EOF {
				break
			}
			return count, fmt.Errorf("读取 MinerU 分块节点缓存失败: %w", err)
		}
		node = adjustMinerUNode(node, part, lineOffset, partNumber)
		if err := encoder.Encode(node); err != nil {
			return count, fmt.Errorf("写入 MinerU 合并节点缓存失败: %w", err)
		}
		count++
	}
	return count, nil
}
