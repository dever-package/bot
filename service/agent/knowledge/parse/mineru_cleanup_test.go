package parse

import (
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"strconv"
	"strings"
	"sync"
	"testing"
	"time"
)

func TestParseWithMinerUCleansSplitInputOnSuccessAndFailure(t *testing.T) {
	tests := []struct {
		name      string
		fail      bool
		wantError bool
	}{
		{name: "success", fail: false, wantError: false},
		{name: "failure", fail: true, wantError: true},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			tempRoot := t.TempDir()
			t.Setenv("TMPDIR", tempRoot)
			sourcePath := filepath.Join(tempRoot, "source.pdf")
			writeTestPDF(t, sourcePath, 3)
			server := newMinerUParseLifecycleServer(t, test.fail)
			defer server.Close()

			result, err := parseWithMinerULimits(t.Context(), Request{
				Path:     sourcePath,
				Name:     "source.pdf",
				MimeType: "application/pdf",
			}, MinerUConfig{
				Host:            server.URL,
				APIKey:          "test-key",
				PollInterval:    time.Millisecond,
				MaxPollAttempts: 3,
			}, minerUPDFLimits{
				MaxBytes: 1 << 30,
				MaxPages: 2,
			})
			if (err != nil) != test.wantError {
				t.Fatalf("parseWithMinerULimits() error = %v, wantError %v", err, test.wantError)
			}
			result.Cleanup()
			assertNoMinerUTemporaryFiles(t, tempRoot)
		})
	}
}

func newMinerUParseLifecycleServer(t *testing.T, fail bool) *httptest.Server {
	t.Helper()
	zipContent := minerUTestZip(t, "# parsed\n\ncontent")
	var mutex sync.Mutex
	batchFiles := make(map[string][]string)
	batchCount := 0
	serverURL := ""
	server := httptest.NewServer(http.HandlerFunc(func(response http.ResponseWriter, request *http.Request) {
		switch {
		case request.Method == http.MethodPost && request.URL.Path == "/api/v4/file-urls/batch":
			batch := decodeMinerUTestBatchRequest(t, request)
			mutex.Lock()
			batchCount++
			batchID := "batch-" + strconv.Itoa(batchCount)
			names := make([]string, len(batch.Files))
			fileURLs := make([]string, len(batch.Files))
			for index, file := range batch.Files {
				names[index] = file.Name
				fileURLs[index] = serverURL + "/upload/" + file.Name
			}
			batchFiles[batchID] = names
			mutex.Unlock()
			writeMinerUTestJSON(t, response, map[string]any{
				"code": 0,
				"data": map[string]any{"batch_id": batchID, "file_urls": fileURLs},
			})
		case request.Method == http.MethodPut && strings.HasPrefix(request.URL.Path, "/upload/"):
			response.WriteHeader(http.StatusOK)
		case request.Method == http.MethodGet && strings.HasPrefix(request.URL.Path, "/api/v4/extract-results/batch/"):
			batchID := strings.TrimPrefix(request.URL.Path, "/api/v4/extract-results/batch/")
			mutex.Lock()
			names := append([]string(nil), batchFiles[batchID]...)
			mutex.Unlock()
			results := make([]map[string]any, len(names))
			for index, name := range names {
				part := minerUPart{Name: name}
				if fail {
					results[index] = minerUTestExtractResult(part, "failed", "", "temporary failure")
				} else {
					results[index] = minerUTestExtractResult(part, "done", serverURL+"/result/"+name+".zip", "")
				}
			}
			writeMinerUTestJSON(t, response, map[string]any{
				"code": 0,
				"data": map[string]any{"batch_id": batchID, "extract_result": results},
			})
		case request.Method == http.MethodGet && strings.HasPrefix(request.URL.Path, "/result/"):
			response.Header().Set("Content-Type", "application/zip")
			_, _ = response.Write(zipContent)
		default:
			t.Errorf("unexpected MinerU request: %s %s", request.Method, request.URL.Path)
			http.NotFound(response, request)
		}
	}))
	serverURL = server.URL
	return server
}

func assertNoMinerUTemporaryFiles(t *testing.T, tempRoot string) {
	t.Helper()
	patterns := []string{"bot-mineru-pdf-*", "bot-mineru-*.zip", "bot-mineru-nodes-*.jsonl"}
	for _, pattern := range patterns {
		paths, err := filepath.Glob(filepath.Join(tempRoot, pattern))
		if err != nil {
			t.Fatalf("glob MinerU temporary files: %v", err)
		}
		if len(paths) != 0 {
			t.Fatalf("MinerU left temporary files for %q: %v", pattern, paths)
		}
	}
}
