package parse

import (
	"archive/zip"
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"testing"
	"time"
)

type minerUTestBatchRequest struct {
	Files []struct {
		Name   string `json:"name"`
		DataID string `json:"data_id"`
	} `json:"files"`
}

func TestMinerUClientRunPartBatchUploadsAndPollsUntilDone(t *testing.T) {
	tempRoot := t.TempDir()
	parts := []minerUPart{
		newMinerUTestPart(t, tempRoot, "part-0001.pdf", "first"),
		newMinerUTestPart(t, tempRoot, "part-0002.pdf", "second"),
	}
	var mutex sync.Mutex
	uploads := make(map[string]string)
	pollCount := 0
	batchFiles := make([]string, 0)
	serverURL := ""
	server := httptest.NewServer(http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		switch {
		case request.Method == http.MethodPost && request.URL.Path == "/api/v4/file-urls/batch":
			batch := decodeMinerUTestBatchRequest(t, request)
			fileURLs := make([]string, len(batch.Files))
			mutex.Lock()
			for index, file := range batch.Files {
				batchFiles = append(batchFiles, file.Name)
				fileURLs[index] = serverURL + "/upload/" + file.Name
			}
			mutex.Unlock()
			writeMinerUTestJSON(t, response, map[string]any{
				"code": 0,
				"data": map[string]any{"batch_id": "batch-1", "file_urls": fileURLs},
			})
		case request.Method == http.MethodPut && strings.HasPrefix(request.URL.Path, "/upload/"):
			content, err := io.ReadAll(request.Body)
			if err != nil {
				t.Errorf("read upload body: %v", err)
				response.WriteHeader(http.StatusInternalServerError)
				return
			}
			name := request.URL.Path[len("/upload/"):]
			mutex.Lock()
			uploads[name] = string(content)
			mutex.Unlock()
			response.WriteHeader(http.StatusOK)
		case request.Method == http.MethodGet && request.URL.Path == "/api/v4/extract-results/batch/batch-1":
			mutex.Lock()
			pollCount++
			currentPoll := pollCount
			mutex.Unlock()
			state := "running"
			if currentPoll > 1 {
				state = "done"
			}
			results := make([]map[string]any, len(parts))
			for index, part := range parts {
				results[index] = map[string]any{
					"file_name":    part.Name,
					"data_id":      minerUDataID(part.Name),
					"state":        state,
					"full_zip_url": serverURL + "/result/" + part.Name + ".zip",
				}
			}
			writeMinerUTestJSON(t, response, map[string]any{
				"code": 0,
				"data": map[string]any{"batch_id": "batch-1", "extract_result": results},
			})
		default:
			t.Errorf("unexpected MinerU request: %s %s", request.Method, request.URL.Path)
			http.NotFound(response, request)
		}
	}))
	serverURL = server.URL
	defer server.Close()

	client := minerUClient{host: server.URL, apiKey: "test-key", http: server.Client()}
	outcomes, batchID, err := client.runPartBatch(context.Background(), parts, MinerUConfig{
		PollInterval:    time.Millisecond,
		MaxPollAttempts: 5,
	})
	if err != nil {
		t.Fatalf("runPartBatch() error = %v", err)
	}
	if batchID != "batch-1" {
		t.Fatalf("batch ID = %q, want batch-1", batchID)
	}
	if len(outcomes) != len(parts) {
		t.Fatalf("outcome count = %d, want %d", len(outcomes), len(parts))
	}
	for index, outcome := range outcomes {
		if outcome.Err != nil || outcome.Result.State != "done" {
			t.Fatalf("outcome %d = %#v", index, outcome)
		}
	}
	mutex.Lock()
	defer mutex.Unlock()
	if pollCount != 2 {
		t.Fatalf("poll count = %d, want 2", pollCount)
	}
	if len(batchFiles) != 2 || batchFiles[0] != parts[0].Name || batchFiles[1] != parts[1].Name {
		t.Fatalf("batch files = %v", batchFiles)
	}
	if uploads[parts[0].Name] != "first" || uploads[parts[1].Name] != "second" {
		t.Fatalf("uploaded contents = %v", uploads)
	}
}

func TestMinerUClientParsePartsRetriesOnlyFailedParts(t *testing.T) {
	tempRoot := t.TempDir()
	t.Setenv("TMPDIR", tempRoot)
	parts := []minerUPart{
		newMinerUTestPart(t, tempRoot, "part-0001.pdf", "first"),
		newMinerUTestPart(t, tempRoot, "part-0002.pdf", "second"),
	}
	zipContent := minerUTestZip(t, "# parsed\n\ncontent")
	var mutex sync.Mutex
	batchRequests := make([][]string, 0)
	uploadCounts := make(map[string]int)
	serverURL := ""
	server := httptest.NewServer(http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		switch {
		case request.Method == http.MethodPost && request.URL.Path == "/api/v4/file-urls/batch":
			batch := decodeMinerUTestBatchRequest(t, request)
			names := make([]string, len(batch.Files))
			fileURLs := make([]string, len(batch.Files))
			mutex.Lock()
			batchNumber := len(batchRequests) + 1
			for index, file := range batch.Files {
				names[index] = file.Name
				fileURLs[index] = serverURL + "/upload/" + file.Name
			}
			batchRequests = append(batchRequests, names)
			mutex.Unlock()
			writeMinerUTestJSON(t, response, map[string]any{
				"code": 0,
				"data": map[string]any{
					"batch_id":  "batch-" + strconv.Itoa(batchNumber),
					"file_urls": fileURLs,
				},
			})
		case request.Method == http.MethodPut && strings.HasPrefix(request.URL.Path, "/upload/"):
			name := request.URL.Path[len("/upload/"):]
			mutex.Lock()
			uploadCounts[name]++
			mutex.Unlock()
			response.WriteHeader(http.StatusOK)
		case request.Method == http.MethodGet && request.URL.Path == "/api/v4/extract-results/batch/batch-1":
			writeMinerUTestJSON(t, response, map[string]any{
				"code": 0,
				"data": map[string]any{
					"batch_id": "batch-1",
					"extract_result": []map[string]any{
						minerUTestExtractResult(parts[0], "done", serverURL+"/result/first.zip", ""),
						minerUTestExtractResult(parts[1], "failed", "", "temporary failure"),
					},
				},
			})
		case request.Method == http.MethodGet && request.URL.Path == "/api/v4/extract-results/batch/batch-2":
			writeMinerUTestJSON(t, response, map[string]any{
				"code": 0,
				"data": map[string]any{
					"batch_id": "batch-2",
					"extract_result": []map[string]any{
						minerUTestExtractResult(parts[1], "done", serverURL+"/result/second.zip", ""),
					},
				},
			})
		case request.Method == http.MethodGet && (request.URL.Path == "/result/first.zip" || request.URL.Path == "/result/second.zip"):
			response.Header().Set("Content-Type", "application/zip")
			_, _ = response.Write(zipContent)
		default:
			t.Errorf("unexpected MinerU request: %s %s", request.Method, request.URL.Path)
			http.NotFound(response, request)
		}
	}))
	serverURL = server.URL
	defer server.Close()

	client := minerUClient{host: server.URL, apiKey: "test-key", http: server.Client()}
	parsed, err := client.parseParts(context.Background(), Request{MaxNodeLength: 800}, parts, MinerUConfig{
		PollInterval:    time.Millisecond,
		MaxPollAttempts: 3,
	})
	if err != nil {
		t.Fatalf("parseParts() error = %v", err)
	}
	defer parsed.Cleanup()
	if parsed.BatchCount != 2 {
		t.Fatalf("batch count = %d, want 2", parsed.BatchCount)
	}
	if len(parsed.Parts) != 2 || parsed.Parts[0].Part.Name != parts[0].Name || parsed.Parts[1].Part.Name != parts[1].Name {
		t.Fatalf("parsed parts = %#v", parsed.Parts)
	}
	mutex.Lock()
	if len(batchRequests) != 2 || len(batchRequests[0]) != 2 || len(batchRequests[1]) != 1 || batchRequests[1][0] != parts[1].Name {
		mutex.Unlock()
		t.Fatalf("batch requests = %v", batchRequests)
	}
	if uploadCounts[parts[0].Name] != 1 || uploadCounts[parts[1].Name] != 2 {
		mutex.Unlock()
		t.Fatalf("upload counts = %v", uploadCounts)
	}
	mutex.Unlock()
	zipPaths, globErr := filepath.Glob(filepath.Join(tempRoot, "bot-mineru-*.zip"))
	if globErr != nil {
		t.Fatalf("glob MinerU ZIP files: %v", globErr)
	}
	if len(zipPaths) != 0 {
		t.Fatalf("parseParts() left downloaded ZIP files: %v", zipPaths)
	}
}

func newMinerUTestPart(t *testing.T, dir string, name string, content string) minerUPart {
	t.Helper()
	path := filepath.Join(dir, name)
	if err := os.WriteFile(path, []byte(content), 0o600); err != nil {
		t.Fatalf("write MinerU test part: %v", err)
	}
	return minerUPart{Path: path, Name: name}
}

func decodeMinerUTestBatchRequest(t *testing.T, request *http.Request) minerUTestBatchRequest {
	t.Helper()
	var batch minerUTestBatchRequest
	if err := json.NewDecoder(request.Body).Decode(&batch); err != nil {
		t.Errorf("decode MinerU batch request: %v", err)
	}
	return batch
}

func writeMinerUTestJSON(t *testing.T, response http.ResponseWriter, value any) {
	t.Helper()
	response.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(response).Encode(value); err != nil {
		t.Errorf("encode MinerU test response: %v", err)
	}
}

func minerUTestExtractResult(part minerUPart, state string, zipURL string, errMessage string) map[string]any {
	return map[string]any{
		"file_name":    part.Name,
		"data_id":      minerUDataID(part.Name),
		"state":        state,
		"full_zip_url": zipURL,
		"err_msg":      errMessage,
	}
}

func minerUTestZip(t *testing.T, markdown string) []byte {
	t.Helper()
	var buffer bytes.Buffer
	writer := zip.NewWriter(&buffer)
	markdownFile, err := writer.Create("full.md")
	if err != nil {
		t.Fatalf("create MinerU test Markdown entry: %v", err)
	}
	if _, err := markdownFile.Write([]byte(markdown)); err != nil {
		t.Fatalf("write MinerU test Markdown entry: %v", err)
	}
	if err := writer.Close(); err != nil {
		t.Fatalf("close MinerU test ZIP: %v", err)
	}
	return buffer.Bytes()
}
