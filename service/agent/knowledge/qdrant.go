package knowledge

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

const maxQdrantResponseBytes = 16 * 1024 * 1024

type qdrantClient struct {
	config qdrantConfig
	http   *http.Client
}

func newQdrantClient() qdrantClient {
	return qdrantClient{
		config: loadQdrantConfig(),
		http:   &http.Client{Timeout: 30 * time.Second},
	}
}

type qdrantPoint struct {
	ID      uint64         `json:"id"`
	Vector  []float64      `json:"vector"`
	Payload map[string]any `json:"payload"`
}

type qdrantRequestError struct {
	StatusCode int
	Status     string
	Body       string
}

func (e *qdrantRequestError) Error() string {
	return fmt.Sprintf("向量数据库请求失败: %s %s", e.Status, e.Body)
}

type qdrantCollectionResponse struct {
	Result struct {
		Config struct {
			Params struct {
				Vectors struct {
					Size int `json:"size"`
				} `json:"vectors"`
			} `json:"params"`
		} `json:"config"`
	} `json:"result"`
}

func (c qdrantClient) ensureCollection(ctx context.Context, collection string, vectorSize int) error {
	if vectorSize <= 0 {
		return fmt.Errorf("向量维度无效")
	}
	collection = normalizeCollection(collection)
	response := qdrantCollectionResponse{}
	err := c.request(ctx, http.MethodGet, "/collections/"+collection, nil, &response)
	if err == nil {
		return validateQdrantCollectionSize(collection, vectorSize, response)
	}
	var requestErr *qdrantRequestError
	if !errors.As(err, &requestErr) || requestErr.StatusCode != http.StatusNotFound {
		return err
	}

	body := map[string]any{
		"vectors": map[string]any{
			"size":     vectorSize,
			"distance": "Cosine",
		},
	}
	if createErr := c.request(ctx, http.MethodPut, "/collections/"+collection, body, nil); createErr != nil {
		// Another indexing worker may have created the shared category collection
		// after our initial GET. Verify the resulting collection before failing.
		created := qdrantCollectionResponse{}
		if err := c.request(ctx, http.MethodGet, "/collections/"+collection, nil, &created); err == nil {
			return validateQdrantCollectionSize(collection, vectorSize, created)
		}
		return createErr
	}
	return nil
}

func validateQdrantCollectionSize(collection string, vectorSize int, response qdrantCollectionResponse) error {
	existingSize := response.Result.Config.Params.Vectors.Size
	if existingSize <= 0 {
		return fmt.Errorf("向量集合 %s 未返回有效维度", collection)
	}
	if existingSize != vectorSize {
		return fmt.Errorf("向量集合 %s 的维度为 %d，当前模型返回 %d", collection, existingSize, vectorSize)
	}
	return nil
}

func (c qdrantClient) upsertPoints(ctx context.Context, collection string, points []qdrantPoint) error {
	if len(points) == 0 {
		return nil
	}
	body := map[string]any{"points": points}
	path := "/collections/" + normalizeCollection(collection) + "/points?wait=true"
	return c.request(ctx, http.MethodPut, path, body, nil)
}

func (c qdrantClient) deleteCollection(ctx context.Context, collection string) error {
	err := c.request(ctx, http.MethodDelete, "/collections/"+normalizeCollection(collection), nil, nil)
	var requestErr *qdrantRequestError
	if errors.As(err, &requestErr) && requestErr.StatusCode == http.StatusNotFound {
		return nil
	}
	return err
}

func (c qdrantClient) deleteByBase(ctx context.Context, collection string, baseID uint64) error {
	if baseID == 0 {
		return nil
	}
	body := map[string]any{
		"filter": qdrantPayloadFilter([]payloadMatch{
			{Key: "knowledge_base_id", Values: []uint64{baseID}},
		}),
	}
	path := "/collections/" + normalizeCollection(collection) + "/points/delete?wait=true"
	err := c.request(ctx, http.MethodPost, path, body, nil)
	var requestErr *qdrantRequestError
	if errors.As(err, &requestErr) && requestErr.StatusCode == http.StatusNotFound {
		return nil
	}
	return err
}

func (c qdrantClient) deleteByDoc(ctx context.Context, collection string, baseID uint64, docID uint64) error {
	if baseID == 0 || docID == 0 {
		return nil
	}
	body := map[string]any{
		"filter": qdrantPayloadFilter([]payloadMatch{
			{Key: "knowledge_base_id", Values: []uint64{baseID}},
			{Key: "doc_id", Values: []uint64{docID}},
		}),
	}
	path := "/collections/" + normalizeCollection(collection) + "/points/delete?wait=true"
	err := c.request(ctx, http.MethodPost, path, body, nil)
	var requestErr *qdrantRequestError
	if errors.As(err, &requestErr) && requestErr.StatusCode == http.StatusNotFound {
		return nil
	}
	return err
}

func (c qdrantClient) deleteByDocVersion(ctx context.Context, collection string, baseID uint64, docID uint64, indexVersion int) error {
	if baseID == 0 || docID == 0 || indexVersion <= 0 {
		return nil
	}
	return c.deleteByFilter(ctx, collection, qdrantPayloadFilter([]payloadMatch{
		{Key: "knowledge_base_id", Values: []uint64{baseID}},
		{Key: "doc_id", Values: []uint64{docID}},
		{Key: "index_version", Values: []uint64{uint64(indexVersion)}},
	}))
}

func (c qdrantClient) deleteByDocBeforeVersion(ctx context.Context, collection string, baseID uint64, docID uint64, indexVersion int) error {
	if baseID == 0 || docID == 0 || indexVersion <= 0 {
		return nil
	}
	filter := qdrantPayloadFilter([]payloadMatch{
		{Key: "knowledge_base_id", Values: []uint64{baseID}},
		{Key: "doc_id", Values: []uint64{docID}},
	})
	must, _ := filter["must"].([]map[string]any)
	must = append(must, map[string]any{
		"key": "index_version",
		"range": map[string]any{
			"lt": indexVersion,
		},
	})
	filter["must"] = must
	return c.deleteByFilter(ctx, collection, filter)
}

func (c qdrantClient) deleteByFilter(ctx context.Context, collection string, filter map[string]any) error {
	body := map[string]any{"filter": filter}
	path := "/collections/" + normalizeCollection(collection) + "/points/delete?wait=true"
	err := c.request(ctx, http.MethodPost, path, body, nil)
	var requestErr *qdrantRequestError
	if errors.As(err, &requestErr) && requestErr.StatusCode == http.StatusNotFound {
		return nil
	}
	return err
}

func (c qdrantClient) search(ctx context.Context, collection string, vector []float64, baseIDs []uint64, limit int, scoreThreshold float64) ([]searchHit, error) {
	body := map[string]any{
		"vector":       vector,
		"limit":        limit,
		"with_payload": true,
	}
	if scoreThreshold > 0 {
		body["score_threshold"] = scoreThreshold
	}
	if len(baseIDs) > 0 {
		body["filter"] = qdrantPayloadFilter([]payloadMatch{
			{Key: "knowledge_base_id", Values: baseIDs},
		})
	}
	var result struct {
		Result []searchHit `json:"result"`
	}
	path := "/collections/" + normalizeCollection(collection) + "/points/search"
	if err := c.request(ctx, http.MethodPost, path, body, &result); err != nil {
		return nil, err
	}
	return result.Result, nil
}

type payloadMatch struct {
	Key    string
	Values []uint64
}

func qdrantPayloadFilter(matches []payloadMatch) map[string]any {
	must := make([]map[string]any, 0, len(matches))
	for _, match := range matches {
		values := make([]any, 0, len(match.Values))
		for _, id := range match.Values {
			if id > 0 {
				values = append(values, id)
			}
		}
		if len(values) == 0 {
			continue
		}
		must = append(must, map[string]any{
			"key": match.Key,
			"match": map[string]any{
				"any": values,
			},
		})
	}
	return map[string]any{
		"must": must,
	}
}

func (c qdrantClient) request(ctx context.Context, method string, path string, body any, result any) error {
	if strings.TrimSpace(c.config.APIKey) == "" {
		return qdrantMissingAPIKeyError()
	}
	url := strings.TrimRight(c.config.URL, "/") + path
	var reader io.Reader
	if body != nil {
		raw, err := json.Marshal(body)
		if err != nil {
			return err
		}
		reader = bytes.NewReader(raw)
	}
	req, err := http.NewRequestWithContext(ctx, method, url, reader)
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("api-key", c.config.APIKey)
	req.Header.Set("Authorization", "Bearer "+c.config.APIKey)

	resp, err := c.http.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	payload, err := io.ReadAll(io.LimitReader(resp.Body, maxQdrantResponseBytes+1))
	if err != nil {
		return fmt.Errorf("读取向量数据库响应失败: %w", err)
	}
	if len(payload) > maxQdrantResponseBytes {
		return fmt.Errorf("向量数据库响应超过 %d MB 上限", maxQdrantResponseBytes/(1024*1024))
	}
	if resp.StatusCode >= 400 {
		return &qdrantRequestError{
			StatusCode: resp.StatusCode,
			Status:     resp.Status,
			Body:       strings.TrimSpace(string(payload)),
		}
	}
	if result == nil || len(payload) == 0 {
		return nil
	}
	if err := json.Unmarshal(payload, result); err != nil {
		return fmt.Errorf("向量数据库响应解析失败: %w", err)
	}
	return nil
}
