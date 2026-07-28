package input

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"strings"
	"time"

	botmodel "github.com/dever-package/bot/model/energon"
	"github.com/dever-package/front/service/remoteurl"
	uploadprovider "github.com/dever-package/front/service/upload/provider"
	uploadrepo "github.com/dever-package/front/service/upload/repository"
)

const (
	serviceParamFileByteUnit     int64 = 1 << 20
	serviceParamFileMaxBytes           = 64 * serviceParamFileByteUnit
	serviceParamFileFetchTimeout       = 2 * time.Minute
)

var serviceParamFileHTTPClient = remoteurl.NewHTTPClient(remoteurl.ClientOptions{
	Timeout:      serviceParamFileFetchTimeout,
	MaxRedirects: 5,
	ProxyEnvVars: []string{"BOT_ENERGON_FILE_PROXY"},
})

func serviceParamFileValueMaxBytes(ctx context.Context, param botmodel.Param) (int64, error) {
	maxBytes := serviceParamFileMaxBytes
	if param.UploadRuleID == 0 {
		return maxBytes, nil
	}
	rule, err := uploadrepo.FindUploadRule(ctx, param.UploadRuleID)
	if err != nil {
		return 0, fmt.Errorf("读取上传规则失败: %w", err)
	}
	if rule.MaxSizeMB > 0 {
		ruleMaxBytes := rule.MaxSizeMB * serviceParamFileByteUnit
		if ruleMaxBytes < maxBytes {
			maxBytes = ruleMaxBytes
		}
	}
	return maxBytes, nil
}

func readServiceParamFileValue(ctx context.Context, value string, maxBytes int64) ([]byte, string, error) {
	value = strings.TrimSpace(value)
	if value == "" {
		return nil, "", fmt.Errorf("文件地址不能为空")
	}
	if strings.HasPrefix(strings.ToLower(value), "data:") {
		return decodeServiceParamDataURL(value, maxBytes)
	}
	if isLikelyServiceParamBase64(value) {
		content, err := decodeServiceParamBase64(value, maxBytes)
		return content, "", err
	}
	if file, found := uploadrepo.FindUploadFileByReference(ctx, value); found {
		return readServiceParamUploadFile(ctx, *file, maxBytes)
	}

	parsed, err := url.Parse(value)
	if err != nil || parsed == nil {
		return nil, "", fmt.Errorf("文件地址无效")
	}
	if parsed.Scheme == "" && strings.HasPrefix(parsed.Path, "/upload/") {
		localPath, resolveErr := uploadprovider.ResolveLocalPublicFilePath(strings.TrimPrefix(parsed.Path, "/upload/"))
		if resolveErr != nil {
			return nil, "", resolveErr
		}
		return readServiceParamLocalFile(localPath, "", maxBytes)
	}
	scheme := strings.ToLower(strings.TrimSpace(parsed.Scheme))
	if scheme != "http" && scheme != "https" {
		return nil, "", fmt.Errorf("文件地址仅支持上传文件或 HTTP(S) 地址")
	}
	return readServiceParamRemoteFile(ctx, parsed, maxBytes)
}

func readServiceParamUploadFile(ctx context.Context, file uploadrepo.UploadFile, maxBytes int64) ([]byte, string, error) {
	if file.Size > maxBytes {
		return nil, "", serviceParamFileTooLargeError(maxBytes)
	}
	driver, err := uploadprovider.Resolve(file.Storage.Type)
	if err != nil {
		return nil, "", err
	}
	target, err := uploadprovider.Open(ctx, driver, uploadprovider.OpenInput{
		File: uploadprovider.File{
			Path:        file.Path,
			ProviderKey: file.ProviderKey,
			Storage:     file.Storage,
		},
		ProviderKey: file.ProviderKey,
		Name:        file.Name,
		Mime:        file.Mime,
	})
	if err != nil {
		return nil, "", fmt.Errorf("读取上传文件失败: %w", err)
	}
	if target == nil {
		return nil, "", fmt.Errorf("上传文件没有可读取的内容")
	}
	if target.Stream != nil {
		defer target.Stream.Close()
		if target.ContentLength > maxBytes {
			return nil, "", serviceParamFileTooLargeError(maxBytes)
		}
		content, readErr := readServiceParamFileContent(target.Stream, maxBytes)
		if readErr != nil {
			return nil, "", readErr
		}
		return content, normalizeServiceParamMIME(target.Header.Get("Content-Type")), nil
	}
	if localPath := strings.TrimSpace(target.LocalPath); localPath != "" {
		return readServiceParamLocalFile(localPath, file.Mime, maxBytes)
	}
	if redirect := strings.TrimSpace(target.Redirect); redirect != "" {
		parsed, parseErr := url.Parse(redirect)
		if parseErr != nil {
			return nil, "", fmt.Errorf("上传文件地址无效")
		}
		return readServiceParamRemoteFile(ctx, parsed, maxBytes)
	}
	return nil, "", fmt.Errorf("上传文件没有可读取的内容")
}

func readServiceParamLocalFile(filePath string, mimeType string, maxBytes int64) ([]byte, string, error) {
	file, err := os.Open(strings.TrimSpace(filePath))
	if err != nil {
		return nil, "", fmt.Errorf("读取上传文件失败: %w", err)
	}
	defer file.Close()
	content, err := readServiceParamFileContent(file, maxBytes)
	if err != nil {
		return nil, "", err
	}
	return content, mimeType, nil
}

func readServiceParamRemoteFile(ctx context.Context, parsed *url.URL, maxBytes int64) ([]byte, string, error) {
	if err := remoteurl.Validate(parsed); err != nil {
		return nil, "", err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, parsed.String(), nil)
	if err != nil {
		return nil, "", fmt.Errorf("创建文件下载请求失败: %w", err)
	}
	resp, err := serviceParamFileHTTPClient.Do(req)
	if err != nil {
		return nil, "", fmt.Errorf("下载文件失败: %w", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode >= http.StatusBadRequest {
		return nil, "", fmt.Errorf("下载文件失败: status=%d", resp.StatusCode)
	}
	if resp.ContentLength > maxBytes {
		return nil, "", serviceParamFileTooLargeError(maxBytes)
	}
	content, err := readServiceParamFileContent(resp.Body, maxBytes)
	if err != nil {
		return nil, "", err
	}
	return content, normalizeServiceParamMIME(resp.Header.Get("Content-Type")), nil
}

func readServiceParamFileContent(reader io.Reader, maxBytes int64) ([]byte, error) {
	content, err := io.ReadAll(io.LimitReader(reader, maxBytes+1))
	if err != nil {
		return nil, fmt.Errorf("读取文件内容失败: %w", err)
	}
	if int64(len(content)) > maxBytes {
		return nil, serviceParamFileTooLargeError(maxBytes)
	}
	return content, nil
}

func serviceParamFileTooLargeError(maxBytes int64) error {
	return fmt.Errorf("文件超过 Base64 转换上限 %dMB", maxBytes/serviceParamFileByteUnit)
}
