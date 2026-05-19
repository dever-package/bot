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

	agentskill "my/package/bot/service/agent/skill"
)

const maxDownloadBytes = 64 * 1024 * 1024

func downloadPlanStep(ctx context.Context, workDir string, step installPlanStep) (string, error) {
	targetDir := filepath.Join(workDir, "download")
	if err := os.MkdirAll(targetDir, 0o755); err != nil {
		return "", err
	}
	var lastErr error
	for _, candidate := range downloadCandidates(step.URL) {
		filePath, err := downloadFile(ctx, candidate, targetDir)
		if err != nil {
			lastErr = err
			continue
		}
		if err := unpackDownloadedFile(filePath, targetDir, step.Extract); err != nil {
			lastErr = err
			continue
		}
		return candidate, nil
	}
	if lastErr != nil {
		return "", lastErr
	}
	return "", fmt.Errorf("下载地址无效")
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

func downloadFile(ctx context.Context, rawURL string, dir string) (string, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, rawURL, nil)
	if err != nil {
		return "", err
	}
	req.Header.Set("User-Agent", "shemic-skill-installer/1.0")
	client := &http.Client{Timeout: 60 * time.Second}
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
		if name != "" && name != "." && name != "/" {
			return name
		}
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
	for _, file := range reader.File {
		targetPath, err := safeExtractPath(targetDir, file.Name)
		if err != nil {
			return err
		}
		if file.FileInfo().IsDir() {
			if err := os.MkdirAll(targetPath, file.Mode()); err != nil {
				return err
			}
			continue
		}
		if err := os.MkdirAll(filepath.Dir(targetPath), 0o755); err != nil {
			return err
		}
		input, err := file.Open()
		if err != nil {
			return err
		}
		if err := writeExtractedFile(input, targetPath, file.Mode()); err != nil {
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
	for {
		header, err := tarReader.Next()
		if err == io.EOF {
			return nil
		}
		if err != nil {
			return err
		}
		targetPath, err := safeExtractPath(targetDir, header.Name)
		if err != nil {
			return err
		}
		switch header.Typeflag {
		case tar.TypeDir:
			if err := os.MkdirAll(targetPath, os.FileMode(header.Mode)); err != nil {
				return err
			}
		case tar.TypeReg, tar.TypeRegA:
			if err := os.MkdirAll(filepath.Dir(targetPath), 0o755); err != nil {
				return err
			}
			if err := writeExtractedFile(tarReader, targetPath, os.FileMode(header.Mode)); err != nil {
				return err
			}
		}
	}
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

func writeExtractedFile(reader io.Reader, targetPath string, mode os.FileMode) error {
	output, err := os.OpenFile(targetPath, os.O_CREATE|os.O_WRONLY|os.O_TRUNC, mode)
	if err != nil {
		return err
	}
	defer output.Close()
	_, err = io.Copy(output, reader)
	return err
}
