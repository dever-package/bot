package parse

import (
	"archive/zip"
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"mime"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

const (
	defaultMinerUHost            = "https://mineru.net"
	defaultMinerUModelVersion    = "vlm"
	defaultMinerULanguage        = "ch"
	defaultMinerUPollInterval    = 3 * time.Second
	defaultMinerUMaxPollAttempts = 80
	defaultMinerUMaxZipSize      = 220 << 20
)

type MinerUConfig struct {
	Host            string
	APIKey          string
	ModelVersion    string
	Language        string
	PollInterval    time.Duration
	MaxPollAttempts int
}

type minerUClient struct {
	host   string
	apiKey string
	http   *http.Client
}

type minerUCreateBatchResponse struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
	Data struct {
		BatchID  string   `json:"batch_id"`
		FileURLs []string `json:"file_urls"`
	} `json:"data"`
}

type minerUBatchResultResponse struct {
	Code int    `json:"code"`
	Msg  string `json:"msg"`
	Data struct {
		BatchID       string                `json:"batch_id"`
		ExtractResult []minerUExtractResult `json:"extract_result"`
	} `json:"data"`
}

type minerUExtractResult struct {
	FileName   string         `json:"file_name"`
	State      string         `json:"state"`
	ErrMsg     string         `json:"err_msg"`
	DataID     string         `json:"data_id"`
	FullZipURL string         `json:"full_zip_url"`
	Progress   map[string]any `json:"extract_progress"`
}

func SupportsMinerU(name string, mimeType string) bool {
	ext := strings.ToLower(filepath.Ext(name))
	switch ext {
	case ".pdf", ".png", ".jpg", ".jpeg", ".jp2", ".webp", ".gif", ".bmp",
		".doc", ".docx", ".ppt", ".pptx", ".xls", ".xlsx":
		return true
	}
	mimeType = strings.ToLower(strings.TrimSpace(mimeType))
	return strings.HasPrefix(mimeType, "image/") ||
		mimeType == "application/pdf" ||
		strings.Contains(mimeType, "word") ||
		strings.Contains(mimeType, "presentation") ||
		strings.Contains(mimeType, "spreadsheet") ||
		strings.Contains(mimeType, "excel") ||
		strings.Contains(mimeType, "officedocument")
}

func ParseWithMinerU(ctx context.Context, req Request, cfg MinerUConfig) (Result, error) {
	req.Name = strings.TrimSpace(req.Name)
	if req.Name == "" {
		req.Name = filepath.Base(req.Path)
	}
	if req.MaxNodeLength <= 0 {
		req.MaxNodeLength = defaultMaxNodeLength
	}
	if strings.TrimSpace(req.Path) == "" {
		return Result{}, fmt.Errorf("MinerU 解析需要本地文件路径")
	}
	if info, err := os.Stat(req.Path); err != nil {
		return Result{}, fmt.Errorf("读取 MinerU 待解析文件失败: %w", err)
	} else if info.Size() > 200<<20 {
		return Result{}, fmt.Errorf("MinerU 精准解析单文件不能超过 200MB")
	}
	if strings.TrimSpace(cfg.APIKey) == "" {
		return Result{}, fmt.Errorf("MinerU APIKey 不能为空")
	}
	client := minerUClient{
		host:   normalizeMinerUHost(cfg.Host),
		apiKey: strings.TrimSpace(cfg.APIKey),
		http: &http.Client{
			Timeout: 120 * time.Second,
		},
	}
	batchID, fileURLs, err := client.createUploadURLs(ctx, req, cfg)
	if err != nil {
		return Result{}, err
	}
	if len(fileURLs) == 0 {
		return Result{}, fmt.Errorf("MinerU 未返回文件上传地址")
	}
	if err := client.uploadFile(ctx, fileURLs[0], req.Path); err != nil {
		return Result{}, err
	}
	extractResult, err := client.waitBatchResult(ctx, batchID, req.Name, cfg)
	if err != nil {
		return Result{}, err
	}
	if strings.TrimSpace(extractResult.FullZipURL) == "" {
		return Result{}, fmt.Errorf("MinerU 解析完成但未返回 full_zip_url")
	}
	zipData, err := client.downloadZip(ctx, extractResult.FullZipURL)
	if err != nil {
		return Result{}, err
	}
	result, err := parseMinerUZip(req, zipData)
	if err != nil {
		return Result{}, err
	}
	if result.Raw == nil {
		result.Raw = map[string]any{}
	}
	result.Raw["parser"] = "mineru"
	result.Raw["batch_id"] = batchID
	result.Raw["file_name"] = extractResult.FileName
	result.Raw["data_id"] = extractResult.DataID
	result.Raw["full_zip_url"] = extractResult.FullZipURL
	result.Raw["model_version"] = minerUModelVersion(cfg)
	return result, nil
}

func normalizeMinerUHost(host string) string {
	host = strings.TrimRight(strings.TrimSpace(host), "/")
	if host == "" {
		return defaultMinerUHost
	}
	if strings.HasSuffix(host, "/api") {
		host = strings.TrimSuffix(host, "/api")
	}
	if strings.HasSuffix(host, "/api/v4") {
		host = strings.TrimSuffix(host, "/api/v4")
	}
	return host
}

func minerUModelVersion(cfg MinerUConfig) string {
	version := strings.TrimSpace(cfg.ModelVersion)
	if version == "" {
		return defaultMinerUModelVersion
	}
	return version
}

func minerULanguage(cfg MinerUConfig) string {
	language := strings.TrimSpace(cfg.Language)
	if language == "" {
		return defaultMinerULanguage
	}
	return language
}

func minerUPollInterval(cfg MinerUConfig) time.Duration {
	if cfg.PollInterval > 0 {
		return cfg.PollInterval
	}
	return defaultMinerUPollInterval
}

func minerUMaxPollAttempts(cfg MinerUConfig) int {
	if cfg.MaxPollAttempts > 0 {
		return cfg.MaxPollAttempts
	}
	return defaultMinerUMaxPollAttempts
}

func (c minerUClient) createUploadURLs(ctx context.Context, req Request, cfg MinerUConfig) (string, []string, error) {
	payload := map[string]any{
		"files": []map[string]any{{
			"name":    req.Name,
			"data_id": minerUDataID(req.Name),
		}},
		"model_version":  minerUModelVersion(cfg),
		"language":       minerULanguage(cfg),
		"enable_formula": true,
		"enable_table":   true,
	}
	body, err := c.doJSON(ctx, http.MethodPost, "/api/v4/file-urls/batch", payload)
	if err != nil {
		return "", nil, err
	}
	var response minerUCreateBatchResponse
	if err := json.Unmarshal(body, &response); err != nil {
		return "", nil, fmt.Errorf("解析 MinerU 上传地址响应失败: %w", err)
	}
	if response.Code != 0 {
		return "", nil, fmt.Errorf("MinerU 申请上传地址失败: %s", firstMinerUText(response.Msg, fmt.Sprintf("code=%d", response.Code)))
	}
	if strings.TrimSpace(response.Data.BatchID) == "" {
		return "", nil, fmt.Errorf("MinerU 未返回 batch_id")
	}
	return response.Data.BatchID, response.Data.FileURLs, nil
}

func minerUDataID(name string) string {
	value := strings.TrimSpace(name)
	if value == "" {
		value = fmt.Sprintf("doc-%d", time.Now().UnixNano())
	}
	var builder strings.Builder
	for _, r := range value {
		if (r >= 'a' && r <= 'z') || (r >= 'A' && r <= 'Z') || (r >= '0' && r <= '9') || r == '_' || r == '-' || r == '.' {
			builder.WriteRune(r)
			continue
		}
		builder.WriteRune('_')
	}
	result := strings.Trim(builder.String(), "_.-")
	if result == "" {
		result = fmt.Sprintf("doc-%d", time.Now().UnixNano())
	}
	if len(result) > 128 {
		result = result[:128]
	}
	return result
}

func (c minerUClient) uploadFile(ctx context.Context, uploadURL string, filePath string) error {
	file, err := os.Open(filePath)
	if err != nil {
		return fmt.Errorf("打开待上传文件失败: %w", err)
	}
	defer file.Close()
	request, err := http.NewRequestWithContext(ctx, http.MethodPut, uploadURL, file)
	if err != nil {
		return fmt.Errorf("创建 MinerU 文件上传请求失败: %w", err)
	}
	response, err := c.http.Do(request)
	if err != nil {
		return fmt.Errorf("上传文件到 MinerU 失败: %w", err)
	}
	defer response.Body.Close()
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		message, _ := io.ReadAll(io.LimitReader(response.Body, 4096))
		return fmt.Errorf("上传文件到 MinerU 失败: HTTP %d %s", response.StatusCode, strings.TrimSpace(string(message)))
	}
	return nil
}

func (c minerUClient) waitBatchResult(ctx context.Context, batchID string, fileName string, cfg MinerUConfig) (minerUExtractResult, error) {
	interval := minerUPollInterval(cfg)
	for attempt := 0; attempt < minerUMaxPollAttempts(cfg); attempt++ {
		result, pending, err := c.fetchBatchResult(ctx, batchID, fileName)
		if err != nil {
			return minerUExtractResult{}, err
		}
		if !pending {
			return result, nil
		}
		timer := time.NewTimer(interval)
		select {
		case <-ctx.Done():
			timer.Stop()
			return minerUExtractResult{}, ctx.Err()
		case <-timer.C:
		}
	}
	return minerUExtractResult{}, fmt.Errorf("MinerU 解析超时: batch_id=%s", batchID)
}

func (c minerUClient) fetchBatchResult(ctx context.Context, batchID string, fileName string) (minerUExtractResult, bool, error) {
	body, err := c.doJSON(ctx, http.MethodGet, "/api/v4/extract-results/batch/"+url.PathEscape(batchID), nil)
	if err != nil {
		return minerUExtractResult{}, false, err
	}
	var response minerUBatchResultResponse
	if err := json.Unmarshal(body, &response); err != nil {
		return minerUExtractResult{}, false, fmt.Errorf("解析 MinerU 批量结果失败: %w", err)
	}
	if response.Code != 0 {
		return minerUExtractResult{}, false, fmt.Errorf("MinerU 查询解析结果失败: %s", firstMinerUText(response.Msg, fmt.Sprintf("code=%d", response.Code)))
	}
	result, ok := pickMinerUResult(response.Data.ExtractResult, fileName)
	if !ok {
		return minerUExtractResult{}, true, nil
	}
	state := strings.ToLower(strings.TrimSpace(result.State))
	switch state {
	case "done":
		return result, false, nil
	case "failed":
		return minerUExtractResult{}, false, fmt.Errorf("MinerU 解析失败: %s", firstMinerUText(result.ErrMsg, result.FileName))
	case "waiting-file", "pending", "running", "converting", "":
		return result, true, nil
	default:
		return result, true, nil
	}
}

func pickMinerUResult(results []minerUExtractResult, fileName string) (minerUExtractResult, bool) {
	if len(results) == 0 {
		return minerUExtractResult{}, false
	}
	fileName = strings.TrimSpace(fileName)
	for _, result := range results {
		if strings.TrimSpace(result.FileName) == fileName {
			return result, true
		}
	}
	return results[0], true
}

func (c minerUClient) downloadZip(ctx context.Context, zipURL string) ([]byte, error) {
	request, err := http.NewRequestWithContext(ctx, http.MethodGet, zipURL, nil)
	if err != nil {
		return nil, fmt.Errorf("创建 MinerU 结果下载请求失败: %w", err)
	}
	response, err := c.http.Do(request)
	if err != nil {
		return nil, fmt.Errorf("下载 MinerU 解析结果失败: %w", err)
	}
	defer response.Body.Close()
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		message, _ := io.ReadAll(io.LimitReader(response.Body, 4096))
		return nil, fmt.Errorf("下载 MinerU 解析结果失败: HTTP %d %s", response.StatusCode, strings.TrimSpace(string(message)))
	}
	data, err := io.ReadAll(io.LimitReader(response.Body, defaultMinerUMaxZipSize+1))
	if err != nil {
		return nil, fmt.Errorf("读取 MinerU 解析结果失败: %w", err)
	}
	if len(data) > defaultMinerUMaxZipSize {
		return nil, fmt.Errorf("MinerU 解析结果过大，超过 %dMB", defaultMinerUMaxZipSize>>20)
	}
	return data, nil
}

func (c minerUClient) doJSON(ctx context.Context, method string, apiPath string, payload any) ([]byte, error) {
	var body io.Reader
	if payload != nil {
		raw, err := json.Marshal(payload)
		if err != nil {
			return nil, fmt.Errorf("编码 MinerU 请求失败: %w", err)
		}
		body = bytes.NewReader(raw)
	}
	request, err := http.NewRequestWithContext(ctx, method, c.host+apiPath, body)
	if err != nil {
		return nil, fmt.Errorf("创建 MinerU 请求失败: %w", err)
	}
	request.Header.Set("Authorization", "Bearer "+c.apiKey)
	request.Header.Set("Accept", "application/json")
	if payload != nil {
		request.Header.Set("Content-Type", "application/json")
	}
	response, err := c.http.Do(request)
	if err != nil {
		return nil, fmt.Errorf("请求 MinerU 失败: %w", err)
	}
	defer response.Body.Close()
	raw, err := io.ReadAll(io.LimitReader(response.Body, 4<<20))
	if err != nil {
		return nil, fmt.Errorf("读取 MinerU 响应失败: %w", err)
	}
	if response.StatusCode < 200 || response.StatusCode >= 300 {
		return nil, fmt.Errorf("MinerU 请求失败: HTTP %d %s", response.StatusCode, strings.TrimSpace(string(raw)))
	}
	return raw, nil
}

func parseMinerUZip(req Request, zipData []byte) (Result, error) {
	reader, err := zip.NewReader(bytes.NewReader(zipData), int64(len(zipData)))
	if err != nil {
		return Result{}, fmt.Errorf("打开 MinerU 解析结果压缩包失败: %w", err)
	}
	files := zipFileNames(reader.File)
	markdown, markdownName, err := readMinerUMarkdown(reader.File)
	if err != nil {
		return Result{}, err
	}
	contentList, contentListName := readMinerUContentList(reader.File)
	result := parseMarkdown(req, markdown)
	if len(contentList) > 0 {
		result.Pages = minerUPages(contentList)
		result.Assets = minerUAssets(contentList)
	}
	if result.Raw == nil {
		result.Raw = map[string]any{}
	}
	result.Raw["zip_files"] = files
	result.Raw["markdown_file"] = markdownName
	if contentListName != "" {
		result.Raw["content_list_file"] = contentListName
		result.Raw["content_list"] = contentList
	}
	return result, nil
}

func zipFileNames(files []*zip.File) []string {
	names := make([]string, 0, len(files))
	for _, file := range files {
		names = append(names, file.Name)
	}
	sort.Strings(names)
	return names
}

func readMinerUMarkdown(files []*zip.File) (string, string, error) {
	candidates := make([]*zip.File, 0)
	for _, file := range files {
		name := strings.ToLower(filepath.ToSlash(file.Name))
		if strings.HasSuffix(name, "/full.md") || name == "full.md" {
			candidates = append(candidates, file)
		}
	}
	if len(candidates) == 0 {
		for _, file := range files {
			if strings.HasSuffix(strings.ToLower(file.Name), ".md") {
				candidates = append(candidates, file)
			}
		}
	}
	if len(candidates) == 0 {
		return "", "", fmt.Errorf("MinerU 解析结果中未找到 Markdown 文件")
	}
	sort.SliceStable(candidates, func(i, j int) bool {
		return len(candidates[i].Name) < len(candidates[j].Name)
	})
	content, err := readZipText(candidates[0])
	if err != nil {
		return "", "", err
	}
	return content, candidates[0].Name, nil
}

func readMinerUContentList(files []*zip.File) ([]map[string]any, string) {
	for _, file := range files {
		name := strings.ToLower(filepath.ToSlash(file.Name))
		if !strings.HasSuffix(name, "content_list.json") {
			continue
		}
		content, err := readZipText(file)
		if err != nil {
			return nil, ""
		}
		var items []map[string]any
		if err := json.Unmarshal([]byte(content), &items); err != nil {
			return nil, ""
		}
		return items, file.Name
	}
	return nil, ""
}

func readZipText(file *zip.File) (string, error) {
	reader, err := file.Open()
	if err != nil {
		return "", fmt.Errorf("读取 MinerU 结果文件失败: %w", err)
	}
	defer reader.Close()
	raw, err := io.ReadAll(io.LimitReader(reader, defaultMinerUMaxZipSize+1))
	if err != nil {
		return "", fmt.Errorf("读取 MinerU 结果文件失败: %w", err)
	}
	if len(raw) > defaultMinerUMaxZipSize {
		return "", fmt.Errorf("MinerU 结果文件过大: %s", file.Name)
	}
	return string(raw), nil
}

func minerUPages(items []map[string]any) []Page {
	grouped := make(map[int][]string)
	for _, item := range items {
		page := minerUPageNumber(item)
		text := minerUItemText(item)
		if text == "" {
			continue
		}
		grouped[page] = append(grouped[page], text)
	}
	pages := make([]Page, 0, len(grouped))
	for page, lines := range grouped {
		content := normalizeText(strings.Join(lines, "\n\n"))
		pages = append(pages, Page{
			Number:    page,
			Title:     fmt.Sprintf("第 %d 页", page),
			PlainText: markdownPlainText(content),
			Markdown:  content,
			Metadata: map[string]any{
				"parser": "mineru",
			},
		})
	}
	sort.SliceStable(pages, func(i, j int) bool {
		return pages[i].Number < pages[j].Number
	})
	return pages
}

func minerUAssets(items []map[string]any) []Asset {
	seen := map[string]bool{}
	assets := make([]Asset, 0)
	for _, item := range items {
		for _, key := range []string{"img_path", "table_img_path"} {
			path := strings.TrimSpace(anyString(item[key]))
			if path == "" || seen[path] {
				continue
			}
			seen[path] = true
			assetType := NodeTypeImage
			if key == "table_img_path" {
				assetType = NodeTypeTable
			}
			assets = append(assets, Asset{
				Name:     filepath.Base(path),
				Path:     path,
				Type:     assetType,
				MimeType: mime.TypeByExtension(filepath.Ext(path)),
				Metadata: map[string]any{
					"page":   minerUPageNumber(item),
					"source": "mineru",
				},
			})
		}
	}
	return assets
}

func minerUPageNumber(item map[string]any) int {
	page := intFromAny(item["page_idx"]) + 1
	if page <= 0 {
		return 1
	}
	return page
}

func minerUItemText(item map[string]any) string {
	if text := strings.TrimSpace(anyString(item["text"])); text != "" {
		return text
	}
	if text := strings.TrimSpace(anyString(item["html"])); text != "" {
		return htmlPlainText(text)
	}
	return ""
}

func anyString(value any) string {
	switch current := value.(type) {
	case string:
		return current
	case fmt.Stringer:
		return current.String()
	case nil:
		return ""
	default:
		return fmt.Sprintf("%v", current)
	}
}

func intFromAny(value any) int {
	switch current := value.(type) {
	case int:
		return current
	case int64:
		return int(current)
	case float64:
		return int(current)
	case json.Number:
		result, _ := current.Int64()
		return int(result)
	default:
		return 0
	}
}

func firstMinerUText(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return strings.TrimSpace(value)
		}
	}
	return ""
}
