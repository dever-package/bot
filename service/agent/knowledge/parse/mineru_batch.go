package parse

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"os"
	"strings"
	"sync"
	"time"
)

const (
	minerUMaxBatchFiles            = 200
	minerUUploadWorkers            = 3
	minerUPartRetryCount           = 1
	minerUMaxConsecutivePollErrors = 3
)

type minerUParsedPart struct {
	Part   minerUPart
	Result Result
}

type minerUParsedParts struct {
	Parts      []minerUParsedPart
	BatchCount int
}

func (parts minerUParsedParts) Cleanup() {
	for _, part := range parts.Parts {
		part.Result.Cleanup()
	}
}

type minerUPendingPart struct {
	Part minerUPart
	Err  error
}

type minerUBatchOutcome struct {
	Result minerUExtractResult
	Err    error
}

func (c minerUClient) parseParts(
	ctx context.Context,
	req Request,
	parts []minerUPart,
	cfg MinerUConfig,
) (minerUParsedParts, error) {
	if len(parts) == 0 {
		return minerUParsedParts{}, fmt.Errorf("MinerU 没有可解析的文件分块")
	}
	pending := make([]minerUPendingPart, 0, len(parts))
	for _, part := range parts {
		pending = append(pending, minerUPendingPart{Part: part})
	}
	parsedByName := make(map[string]minerUParsedPart, len(parts))
	batchCount := 0

	for attempt := 0; attempt <= minerUPartRetryCount && len(pending) > 0; attempt++ {
		failed := make([]minerUPendingPart, 0)
		for start := 0; start < len(pending); start += minerUMaxBatchFiles {
			end := start + minerUMaxBatchFiles
			if end > len(pending) {
				end = len(pending)
			}
			batch := pending[start:end]
			batchParts := make([]minerUPart, len(batch))
			for index := range batch {
				batchParts[index] = batch[index].Part
			}
			batchCount++
			outcomes, batchID, err := c.runPartBatch(ctx, batchParts, cfg)
			if err != nil {
				if ctx.Err() != nil {
					parsed := minerUParsedParts{Parts: orderedMinerUParsedParts(parts, parsedByName), BatchCount: batchCount}
					parsed.Cleanup()
					return minerUParsedParts{}, ctx.Err()
				}
				for _, item := range batch {
					failed = append(failed, minerUPendingPart{Part: item.Part, Err: err})
				}
				continue
			}
			for index, outcome := range outcomes {
				part := batchParts[index]
				if outcome.Err != nil {
					failed = append(failed, minerUPendingPart{Part: part, Err: outcome.Err})
					continue
				}
				result, err := c.parsePartResult(ctx, req, part, batchID, outcome.Result)
				if err != nil {
					failed = append(failed, minerUPendingPart{Part: part, Err: err})
					continue
				}
				parsedByName[part.Name] = minerUParsedPart{Part: part, Result: result}
			}
		}
		pending = failed
	}

	if len(pending) > 0 {
		parsed := minerUParsedParts{Parts: orderedMinerUParsedParts(parts, parsedByName), BatchCount: batchCount}
		parsed.Cleanup()
		first := pending[0]
		return minerUParsedParts{}, fmt.Errorf(
			"MinerU 仍有 %d 个分块解析失败，首个失败分块 %s: %w",
			len(pending),
			first.Part.Name,
			first.Err,
		)
	}
	return minerUParsedParts{
		Parts:      orderedMinerUParsedParts(parts, parsedByName),
		BatchCount: batchCount,
	}, nil
}

func orderedMinerUParsedParts(parts []minerUPart, parsed map[string]minerUParsedPart) []minerUParsedPart {
	result := make([]minerUParsedPart, 0, len(parts))
	for _, part := range parts {
		if current, ok := parsed[part.Name]; ok {
			result = append(result, current)
		}
	}
	return result
}

func (c minerUClient) runPartBatch(
	ctx context.Context,
	parts []minerUPart,
	cfg MinerUConfig,
) ([]minerUBatchOutcome, string, error) {
	batchID, uploadURLs, err := c.createPartUploadURLs(ctx, parts, cfg)
	if err != nil {
		return nil, "", err
	}
	if len(uploadURLs) != len(parts) {
		return nil, batchID, fmt.Errorf("MinerU 返回的上传地址数量不匹配: 期望 %d，实际 %d", len(parts), len(uploadURLs))
	}
	if err := c.uploadParts(ctx, parts, uploadURLs); err != nil {
		return nil, batchID, err
	}
	outcomes, err := c.waitPartBatch(ctx, batchID, parts, cfg)
	if err == nil || ctx.Err() != nil {
		return outcomes, batchID, err
	}
	if len(outcomes) != len(parts) {
		outcomes = make([]minerUBatchOutcome, len(parts))
	}
	for index := range outcomes {
		if outcomes[index].Err == nil && strings.TrimSpace(outcomes[index].Result.FullZipURL) == "" {
			outcomes[index].Err = err
		}
	}
	return outcomes, batchID, nil
}

func (c minerUClient) createPartUploadURLs(
	ctx context.Context,
	parts []minerUPart,
	cfg MinerUConfig,
) (string, []string, error) {
	if len(parts) == 0 || len(parts) > minerUMaxBatchFiles {
		return "", nil, fmt.Errorf("MinerU 单批文件数量必须为 1-%d", minerUMaxBatchFiles)
	}
	files := make([]map[string]any, 0, len(parts))
	for _, part := range parts {
		files = append(files, map[string]any{
			"name":    part.Name,
			"data_id": minerUDataID(part.Name),
		})
	}
	payload := map[string]any{
		"files":          files,
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

func (c minerUClient) uploadParts(ctx context.Context, parts []minerUPart, uploadURLs []string) error {
	type uploadJob struct {
		Index int
	}
	type uploadResult struct {
		Index int
		Err   error
	}
	workerCount := minerUUploadWorkers
	if workerCount > len(parts) {
		workerCount = len(parts)
	}
	jobs := make(chan uploadJob, len(parts))
	results := make(chan uploadResult, len(parts))
	var workers sync.WaitGroup
	for worker := 0; worker < workerCount; worker++ {
		workers.Add(1)
		go func() {
			defer workers.Done()
			for job := range jobs {
				results <- uploadResult{
					Index: job.Index,
					Err:   c.uploadFile(ctx, uploadURLs[job.Index], parts[job.Index].Path),
				}
			}
		}()
	}
	for index := range parts {
		jobs <- uploadJob{Index: index}
	}
	close(jobs)
	workers.Wait()
	close(results)

	for result := range results {
		if result.Err != nil {
			return fmt.Errorf("上传 MinerU 分块 %s 失败: %w", parts[result.Index].Name, result.Err)
		}
	}
	return nil
}

func (c minerUClient) waitPartBatch(
	ctx context.Context,
	batchID string,
	parts []minerUPart,
	cfg MinerUConfig,
) ([]minerUBatchOutcome, error) {
	outcomes := make([]minerUBatchOutcome, len(parts))
	terminal := make([]bool, len(parts))
	interval := minerUPollInterval(cfg)
	consecutiveErrors := 0
	for attempt := 0; attempt < minerUMaxPollAttempts(cfg); attempt++ {
		results, err := c.fetchPartBatch(ctx, batchID)
		if err != nil {
			consecutiveErrors++
			if consecutiveErrors >= minerUMaxConsecutivePollErrors {
				return outcomes, err
			}
			if err := waitMinerUPoll(ctx, interval); err != nil {
				return outcomes, err
			}
			continue
		}
		consecutiveErrors = 0
		complete := true
		for index, part := range parts {
			if terminal[index] {
				continue
			}
			result, ok := minerUResultForPart(results, part)
			if !ok {
				complete = false
				continue
			}
			switch strings.ToLower(strings.TrimSpace(result.State)) {
			case "done":
				if strings.TrimSpace(result.FullZipURL) == "" {
					outcomes[index].Err = fmt.Errorf("MinerU 解析完成但未返回 full_zip_url")
				} else {
					outcomes[index].Result = result
				}
				terminal[index] = true
			case "failed":
				outcomes[index].Err = fmt.Errorf("MinerU 解析失败: %s", firstMinerUText(result.ErrMsg, result.FileName))
				terminal[index] = true
			default:
				complete = false
			}
		}
		if complete && allMinerUResultsTerminal(terminal) {
			return outcomes, nil
		}
		if err := waitMinerUPoll(ctx, interval); err != nil {
			return outcomes, err
		}
	}
	return outcomes, fmt.Errorf("MinerU 解析超时: batch_id=%s", batchID)
}

func waitMinerUPoll(ctx context.Context, interval time.Duration) error {
	timer := time.NewTimer(interval)
	defer timer.Stop()
	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-timer.C:
		return nil
	}
}

func (c minerUClient) fetchPartBatch(ctx context.Context, batchID string) ([]minerUExtractResult, error) {
	body, err := c.doJSON(ctx, http.MethodGet, "/api/v4/extract-results/batch/"+url.PathEscape(batchID), nil)
	if err != nil {
		return nil, err
	}
	var response minerUBatchResultResponse
	if err := json.Unmarshal(body, &response); err != nil {
		return nil, fmt.Errorf("解析 MinerU 批量结果失败: %w", err)
	}
	if response.Code != 0 {
		return nil, fmt.Errorf("MinerU 查询解析结果失败: %s", firstMinerUText(response.Msg, fmt.Sprintf("code=%d", response.Code)))
	}
	return response.Data.ExtractResult, nil
}

func minerUResultForPart(results []minerUExtractResult, part minerUPart) (minerUExtractResult, bool) {
	dataID := minerUDataID(part.Name)
	for _, result := range results {
		if strings.TrimSpace(result.DataID) == dataID {
			return result, true
		}
	}
	for _, result := range results {
		if strings.TrimSpace(result.FileName) == strings.TrimSpace(part.Name) {
			return result, true
		}
	}
	return minerUExtractResult{}, false
}

func allMinerUResultsTerminal(terminal []bool) bool {
	for _, done := range terminal {
		if !done {
			return false
		}
	}
	return true
}

func (c minerUClient) parsePartResult(
	ctx context.Context,
	req Request,
	part minerUPart,
	batchID string,
	extract minerUExtractResult,
) (Result, error) {
	zipPath, err := c.downloadZip(ctx, extract.FullZipURL)
	if err != nil {
		return Result{}, err
	}
	defer os.Remove(zipPath)
	partRequest := req
	partRequest.Path = part.Path
	partRequest.Name = part.Name
	result, err := parseMinerUZip(partRequest, zipPath)
	if err != nil {
		return Result{}, err
	}
	if result.Raw == nil {
		result.Raw = map[string]any{}
	}
	result.Raw["parser"] = "mineru"
	result.Raw["batch_id"] = batchID
	result.Raw["file_name"] = extract.FileName
	result.Raw["data_id"] = extract.DataID
	result.Raw["full_zip_url"] = extract.FullZipURL
	return result, nil
}
