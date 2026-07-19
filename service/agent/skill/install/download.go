package install

import (
	"archive/tar"
	"archive/zip"
	"compress/gzip"
	"context"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path"
	"path/filepath"
	"strings"
	"time"

	"github.com/dever-package/bot/service/agent/netguard"
	agentskill "github.com/dever-package/bot/service/agent/skill"
)

const (
	maxDownloadBytes        = 64 * 1024 * 1024
	maxArchiveEntries       = 5000
	maxArchiveDepth         = 32
	maxArchiveFileBytes     = 64 * 1024 * 1024
	maxArchiveExpandedBytes = 512 * 1024 * 1024
)

type archiveBudget struct {
	entries int
	total   int64
}

func downloadPlanStep(ctx context.Context, workDir string, stepIndex int, step installPlanStep) (sourceProvenance, error) {
	targetDir := filepath.Join(workDir, "download", fmt.Sprintf("step-%d", stepIndex+1))
	if err := os.MkdirAll(targetDir, 0o755); err != nil {
		return sourceProvenance{}, err
	}
	var lastErr error
	for index, candidate := range downloadCandidates(step.URL) {
		candidateDir := filepath.Join(targetDir, fmt.Sprintf("candidate-%d", index+1))
		if err := os.RemoveAll(candidateDir); err != nil {
			return sourceProvenance{}, err
		}
		if err := os.MkdirAll(candidateDir, 0o755); err != nil {
			return sourceProvenance{}, err
		}
		filePath, err := downloadFile(ctx, candidate, candidateDir)
		if err != nil {
			lastErr = err
			_ = os.RemoveAll(candidateDir)
			continue
		}
		if err := unpackDownloadedFile(filePath, candidateDir, step.Extract); err != nil {
			lastErr = err
			_ = os.RemoveAll(candidateDir)
			continue
		}
		return sourceProvenance{Root: candidateDir, URL: publicSourceURL(candidate)}, nil
	}
	if lastErr != nil {
		return sourceProvenance{}, lastErr
	}
	return sourceProvenance{}, fmt.Errorf("下载地址无效")
}

func downloadCandidates(rawURL string) []string {
	rawURL = strings.TrimSpace(rawURL)
	if rawURL == "" {
		return nil
	}
	if github := githubArchiveCandidates(rawURL); len(github) > 0 {
		return github
	}
	return []string{rawURL}
}

func githubArchiveCandidates(rawURL string) []string {
	parsed, err := url.Parse(rawURL)
	if err != nil || parsed.Host == "" {
		return nil
	}
	host := strings.ToLower(strings.TrimPrefix(parsed.Host, "www."))
	if host != "github.com" {
		return nil
	}
	parts := strings.Split(strings.Trim(parsed.Path, "/"), "/")
	if len(parts) < 2 {
		return nil
	}
	owner := parts[0]
	repo := strings.TrimSuffix(parts[1], ".git")
	if owner == "" || repo == "" {
		return nil
	}
	if len(parts) >= 5 && parts[2] == "archive" {
		return []string{rawURL}
	}
	if len(parts) >= 4 && parts[2] == "tree" {
		branch := parts[3]
		return []string{fmt.Sprintf("https://github.com/%s/%s/archive/refs/heads/%s.zip", owner, repo, branch)}
	}
	return []string{
		fmt.Sprintf("https://github.com/%s/%s/archive/refs/heads/main.zip", owner, repo),
		fmt.Sprintf("https://github.com/%s/%s/archive/refs/heads/master.zip", owner, repo),
		rawURL,
	}
}

func publicSourceURL(rawURL string) string {
	parsed, err := url.Parse(strings.TrimSpace(rawURL))
	if err != nil || parsed.Host == "" {
		return ""
	}
	parsed.User = nil
	parsed.RawQuery = ""
	parsed.Fragment = ""
	return parsed.String()
}

func downloadFile(ctx context.Context, rawURL string, dir string) (string, error) {
	parsed, err := url.Parse(rawURL)
	if err != nil {
		return "", err
	}
	if err := netguard.ValidateURL(ctx, parsed); err != nil {
		return "", err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, parsed.String(), nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("User-Agent", "shemic-skill-installer/1.0")
	client := netguard.NewClient(60 * time.Second)
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", fmt.Errorf("下载失败: %s", resp.Status)
	}

	fileName := downloadFileName(rawURL, resp.Header.Get("Content-Type"))
	filePath := filepath.Join(dir, fileName)
	output, err := os.Create(filePath)
	if err != nil {
		return "", err
	}
	defer output.Close()

	written, err := io.Copy(output, io.LimitReader(resp.Body, maxDownloadBytes+1))
	if err != nil {
		return "", err
	}
	if written > maxDownloadBytes {
		return "", fmt.Errorf("下载文件超过 %d 字节", maxDownloadBytes)
	}
	return filePath, nil
}

func downloadFileName(rawURL string, contentType string) string {
	parsed, err := url.Parse(rawURL)
	if err == nil {
		name := path.Base(parsed.Path)
		if name != "" && name != "." && name != "/" && len([]byte(name)) <= 180 && !strings.ContainsRune(name, 0) {
			return name
		}
		contentType += " " + strings.ToLower(parsed.Path)
	}
	if strings.Contains(contentType, "zip") {
		return "download.zip"
	}
	if strings.Contains(contentType, "gzip") || strings.Contains(contentType, "tar") {
		return "download.tar.gz"
	}
	return agentskill.EntryFile
}

func unpackDownloadedFile(filePath string, targetDir string, extract bool) error {
	lower := strings.ToLower(filePath)
	switch {
	case strings.HasSuffix(lower, ".zip"):
		return extractZip(filePath, targetDir)
	case strings.HasSuffix(lower, ".tar.gz"), strings.HasSuffix(lower, ".tgz"):
		return extractTarGzip(filePath, targetDir)
	case strings.HasSuffix(lower, ".tar"):
		return extractTar(filePath, targetDir)
	case extract:
		return fmt.Errorf("不支持的压缩格式: %s", filepath.Base(filePath))
	default:
		skillDir := filepath.Join(targetDir, "single-skill")
		if err := os.MkdirAll(skillDir, 0o755); err != nil {
			return err
		}
		return os.Rename(filePath, filepath.Join(skillDir, agentskill.EntryFile))
	}
}

func extractZip(filePath string, targetDir string) error {
	reader, err := zip.OpenReader(filePath)
	if err != nil {
		return err
	}
	defer reader.Close()
	budget := &archiveBudget{}
	for _, file := range reader.File {
		if err := budget.checkEntry(file.Name, int64(file.UncompressedSize64)); err != nil {
			return err
		}
		targetPath, err := safeExtractPath(targetDir, file.Name)
		if err != nil {
			return err
		}
		if file.FileInfo().IsDir() {
			if err := os.MkdirAll(targetPath, safeArchiveMode(file.Mode(), true)); err != nil {
				return err
			}
			continue
		}
		if !file.Mode().IsRegular() {
			return fmt.Errorf("压缩包包含不支持的链接或特殊文件: %s", file.Name)
		}
		if err := os.MkdirAll(filepath.Dir(targetPath), 0o755); err != nil {
			return err
		}
		input, err := file.Open()
		if err != nil {
			return err
		}
		if err := writeExtractedFile(input, targetPath, safeArchiveMode(file.Mode(), false), budget); err != nil {
			_ = input.Close()
			return err
		}
		_ = input.Close()
	}
	return nil
}

func extractTarGzip(filePath string, targetDir string) error {
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()
	gzipReader, err := gzip.NewReader(file)
	if err != nil {
		return err
	}
	defer gzipReader.Close()
	return extractTarReader(gzipReader, targetDir)
}

func extractTar(filePath string, targetDir string) error {
	file, err := os.Open(filePath)
	if err != nil {
		return err
	}
	defer file.Close()
	return extractTarReader(file, targetDir)
}

func extractTarReader(reader io.Reader, targetDir string) error {
	tarReader := tar.NewReader(reader)
	budget := &archiveBudget{}
	for {
		header, err := tarReader.Next()
		if err == io.EOF {
			return nil
		}
		if err != nil {
			return err
		}
		if err := budget.checkEntry(header.Name, header.Size); err != nil {
			return err
		}
		targetPath, err := safeExtractPath(targetDir, header.Name)
		if err != nil {
			return err
		}
		switch header.Typeflag {
		case tar.TypeDir:
			if err := os.MkdirAll(targetPath, safeArchiveMode(os.FileMode(header.Mode), true)); err != nil {
				return err
			}
		case tar.TypeReg, tar.TypeRegA:
			if err := os.MkdirAll(filepath.Dir(targetPath), 0o755); err != nil {
				return err
			}
			if err := writeExtractedFile(tarReader, targetPath, safeArchiveMode(os.FileMode(header.Mode), false), budget); err != nil {
				return err
			}
		case tar.TypeXHeader, tar.TypeXGlobalHeader:
			continue
		default:
			return fmt.Errorf("压缩包包含不支持的链接或特殊文件: %s", header.Name)
		}
	}
}

func safeArchiveMode(mode os.FileMode, directory bool) os.FileMode {
	if directory {
		return 0o755
	}
	if mode.Perm()&0o111 != 0 {
		return 0o755
	}
	return 0o644
}

func safeExtractPath(root string, name string) (string, error) {
	cleanName := filepath.Clean(name)
	if cleanName == "." || strings.HasPrefix(cleanName, ".."+string(filepath.Separator)) || filepath.IsAbs(cleanName) {
		return "", fmt.Errorf("压缩包包含不安全路径: %s", name)
	}
	target := filepath.Join(root, cleanName)
	cleanRoot := filepath.Clean(root)
	cleanTarget := filepath.Clean(target)
	if cleanTarget != cleanRoot && !strings.HasPrefix(cleanTarget, cleanRoot+string(filepath.Separator)) {
		return "", fmt.Errorf("压缩包路径越界: %s", name)
	}
	return target, nil
}

func (budget *archiveBudget) checkEntry(name string, declaredSize int64) error {
	budget.entries++
	if budget.entries > maxArchiveEntries {
		return fmt.Errorf("压缩包文件数量超过 %d", maxArchiveEntries)
	}
	cleanName := filepath.ToSlash(filepath.Clean(name))
	depth := 0
	for _, part := range strings.Split(cleanName, "/") {
		if part != "" && part != "." {
			depth++
		}
	}
	if depth > maxArchiveDepth {
		return fmt.Errorf("压缩包目录层级超过 %d: %s", maxArchiveDepth, name)
	}
	if declaredSize < 0 || declaredSize > maxArchiveFileBytes {
		return fmt.Errorf("压缩包单个文件超过 %d 字节: %s", maxArchiveFileBytes, name)
	}
	return nil
}

func writeExtractedFile(reader io.Reader, targetPath string, mode os.FileMode, budget *archiveBudget) (err error) {
	output, err := os.OpenFile(targetPath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, mode)
	if err != nil {
		return err
	}
	defer func() {
		if closeErr := output.Close(); err == nil {
			err = closeErr
		}
		if err != nil {
			_ = os.Remove(targetPath)
		}
	}()
	remaining := int64(maxArchiveExpandedBytes) - budget.total
	if remaining <= 0 {
		return fmt.Errorf("压缩包解压后总大小超过 %d 字节", maxArchiveExpandedBytes)
	}
	limit := int64(maxArchiveFileBytes)
	if remaining < limit {
		limit = remaining
	}
	written, copyErr := io.Copy(output, io.LimitReader(reader, limit+1))
	if copyErr != nil {
		return copyErr
	}
	if written > limit {
		return fmt.Errorf("压缩包解压内容超过允许大小")
	}
	budget.total += written
	return nil
}
