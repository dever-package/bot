package processor

import (
	"context"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"time"
	"unicode"

	"github.com/dever-package/front/service/remoteurl"
	uploadprovider "github.com/dever-package/front/service/upload/provider"
	uploadrepo "github.com/dever-package/front/service/upload/repository"
)

const (
	ffmpegMediaMaxBytes     int64 = 2 << 30
	ffmpegMediaFetchTimeout       = 15 * time.Minute
)

var (
	errFFmpegMediaNotSystemUpload = errors.New("FFmpeg 处理器只允许读取系统上传资源")
	ffmpegMediaHTTPClient         = remoteurl.NewHTTPClient(remoteurl.ClientOptions{
		Timeout:      ffmpegMediaFetchTimeout,
		MaxRedirects: 5,
		ProxyEnvVars: []string{"BOT_ENERGON_FILE_PROXY"},
	})
)

type ffmpegMediaResolver struct {
	ctx       context.Context
	workspace string
	byFileID  map[uint64]string
	byValue   map[string]string
	sequence  int
}

func newFFmpegMediaResolver(ctx context.Context, workspace string) *ffmpegMediaResolver {
	return &ffmpegMediaResolver{
		ctx:       ctx,
		workspace: strings.TrimSpace(workspace),
		byFileID:  make(map[uint64]string),
		byValue:   make(map[string]string),
	}
}

func (resolver *ffmpegMediaResolver) Resolve(value string) (string, error) {
	value = strings.TrimSpace(value)
	if value == "" {
		return "", fmt.Errorf("资源地址不能为空")
	}
	if localPath := resolver.byValue[value]; localPath != "" {
		return localPath, nil
	}

	if file, found := uploadrepo.FindUploadFileByReference(resolver.ctx, value); found {
		if localPath := resolver.byFileID[file.ID]; localPath != "" {
			resolver.byValue[value] = localPath
			return localPath, nil
		}
		localPath, err := resolver.resolveUploadFile(*file)
		if err != nil {
			return "", err
		}
		resolver.byFileID[file.ID] = localPath
		resolver.byValue[value] = localPath
		return localPath, nil
	}

	localPath, found, err := resolveLegacyLocalMediaPath(value)
	if err != nil {
		return "", err
	}
	if found {
		resolver.byValue[value] = localPath
		return localPath, nil
	}
	return "", errFFmpegMediaNotSystemUpload
}

func (resolver *ffmpegMediaResolver) resolveUploadFile(file uploadrepo.UploadFile) (string, error) {
	if file.Size > ffmpegMediaMaxBytes {
		return "", fmt.Errorf("资源文件超过本地处理上限")
	}
	driver, err := uploadprovider.Resolve(file.Storage.Type)
	if err != nil {
		return "", err
	}
	target, err := uploadprovider.Open(resolver.ctx, driver, uploadprovider.OpenInput{
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
		return "", fmt.Errorf("读取系统上传资源失败: %w", err)
	}
	if target == nil {
		return "", fmt.Errorf("系统上传资源没有可读取的内容")
	}
	if localPath := strings.TrimSpace(target.LocalPath); localPath != "" {
		return validateFFmpegMediaPath(localPath)
	}
	if target.Stream != nil {
		defer target.Stream.Close()
		return resolver.copyToWorkspace(file, target.Stream, target.ContentLength)
	}
	if redirect := strings.TrimSpace(target.Redirect); redirect != "" {
		return resolver.downloadToWorkspace(file, redirect)
	}
	return "", fmt.Errorf("系统上传资源没有可读取的内容")
}

func (resolver *ffmpegMediaResolver) downloadToWorkspace(file uploadrepo.UploadFile, rawURL string) (string, error) {
	parsed, err := url.Parse(strings.TrimSpace(rawURL))
	if err != nil || parsed == nil {
		return "", fmt.Errorf("系统上传资源地址无效")
	}
	if err := remoteurl.Validate(parsed); err != nil {
		return "", err
	}
	request, err := http.NewRequestWithContext(resolver.ctx, http.MethodGet, parsed.String(), nil)
	if err != nil {
		return "", fmt.Errorf("创建系统上传资源下载请求失败: %w", err)
	}
	response, err := ffmpegMediaHTTPClient.Do(request)
	if err != nil {
		return "", fmt.Errorf("下载系统上传资源失败: %w", err)
	}
	defer response.Body.Close()
	if response.StatusCode >= http.StatusBadRequest {
		return "", fmt.Errorf("下载系统上传资源失败: status=%d", response.StatusCode)
	}
	return resolver.copyToWorkspace(file, response.Body, response.ContentLength)
}

func (resolver *ffmpegMediaResolver) copyToWorkspace(
	file uploadrepo.UploadFile,
	reader io.Reader,
	contentLength int64,
) (string, error) {
	if contentLength > ffmpegMediaMaxBytes {
		return "", fmt.Errorf("资源文件超过本地处理上限")
	}
	resolver.sequence++
	localPath := filepath.Join(
		resolver.workspace,
		fmt.Sprintf("input-%03d%s", resolver.sequence, ffmpegMediaExtension(file)),
	)
	target, err := os.OpenFile(localPath, os.O_CREATE|os.O_EXCL|os.O_WRONLY, 0o600)
	if err != nil {
		return "", fmt.Errorf("创建资源临时文件失败: %w", err)
	}
	written, copyErr := io.Copy(target, io.LimitReader(reader, ffmpegMediaMaxBytes+1))
	closeErr := target.Close()
	if copyErr != nil {
		_ = os.Remove(localPath)
		return "", fmt.Errorf("写入资源临时文件失败: %w", copyErr)
	}
	if closeErr != nil {
		_ = os.Remove(localPath)
		return "", fmt.Errorf("关闭资源临时文件失败: %w", closeErr)
	}
	if written > ffmpegMediaMaxBytes {
		_ = os.Remove(localPath)
		return "", fmt.Errorf("资源文件超过本地处理上限")
	}
	return validateFFmpegMediaPath(localPath)
}

func resolveLegacyLocalMediaPath(value string) (string, bool, error) {
	parsed, err := url.Parse(strings.TrimSpace(value))
	if err != nil || parsed == nil {
		return "", false, fmt.Errorf("资源地址格式错误")
	}
	if strings.TrimSpace(parsed.Scheme) != "" || !strings.HasPrefix(parsed.Path, "/upload/") {
		return "", false, nil
	}
	localPath, err := uploadprovider.ResolveLocalPublicFilePath(strings.TrimPrefix(parsed.Path, "/upload/"))
	if err != nil {
		return "", false, err
	}
	localPath, err = validateFFmpegMediaPath(localPath)
	return localPath, err == nil, err
}

func validateFFmpegMediaPath(value string) (string, error) {
	localPath := strings.TrimSpace(value)
	absolutePath, err := filepath.Abs(localPath)
	if err != nil {
		return "", fmt.Errorf("解析资源文件路径失败: %w", err)
	}
	info, err := os.Stat(absolutePath)
	if err != nil {
		return "", fmt.Errorf("资源文件不存在")
	}
	if !info.Mode().IsRegular() {
		return "", fmt.Errorf("资源不是普通文件")
	}
	return absolutePath, nil
}

func ffmpegMediaExtension(file uploadrepo.UploadFile) string {
	for _, value := range []string{file.Name, file.Path} {
		extension := strings.ToLower(strings.TrimSpace(filepath.Ext(value)))
		if isSafeFFmpegMediaExtension(extension) {
			return extension
		}
	}
	return ""
}

func isSafeFFmpegMediaExtension(value string) bool {
	if value == "" || len(value) > 16 || !strings.HasPrefix(value, ".") {
		return false
	}
	for _, char := range strings.TrimPrefix(value, ".") {
		if !unicode.IsLetter(char) && !unicode.IsDigit(char) {
			return false
		}
	}
	return true
}
