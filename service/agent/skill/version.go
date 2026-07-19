package skill

import (
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"hash"
	"io"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"
)

const (
	releaseDirectory       = "releases"
	releaseHashLength      = 16
	releaseRetentionCount  = 3
	releaseRetentionPeriod = 7 * 24 * time.Hour
)

func SkillContentHash(root string, manifest map[string]any) (string, error) {
	hash := sha256.New()
	if err := writeDirectoryHash(hash, root, true); err != nil {
		return "", err
	}
	_, _ = io.WriteString(hash, "\x00manifest\x00"+JSONText(manifest))
	return hex.EncodeToString(hash.Sum(nil)), nil
}

// DirectoryContentHash fingerprints a materialized dependency directory.
func DirectoryContentHash(root string) (string, error) {
	digest := sha256.New()
	if err := writeDirectoryHash(digest, root, false); err != nil {
		return "", err
	}
	return hex.EncodeToString(digest.Sum(nil)), nil
}

func writeDirectoryHash(digest hash.Hash, root string, skipManaged bool) error {
	cleanRoot := filepath.Clean(root)
	return filepath.WalkDir(cleanRoot, func(path string, entry os.DirEntry, walkErr error) error {
		if walkErr != nil {
			return walkErr
		}
		relative, err := filepath.Rel(cleanRoot, path)
		if err != nil {
			return err
		}
		if relative == "." {
			return nil
		}
		parts := strings.Split(filepath.ToSlash(relative), "/")
		if skipManaged && parts[0] == ".dever" {
			if entry.IsDir() {
				return filepath.SkipDir
			}
			return nil
		}
		info, err := entry.Info()
		if err != nil {
			return err
		}
		_, _ = io.WriteString(digest, filepath.ToSlash(relative)+"\x00"+info.Mode().String()+"\x00")
		if entry.Type()&os.ModeSymlink != 0 {
			target, linkErr := os.Readlink(path)
			if linkErr != nil {
				return linkErr
			}
			_, _ = io.WriteString(digest, target+"\x00")
			return nil
		}
		if entry.IsDir() {
			return nil
		}
		file, err := os.Open(path)
		if err != nil {
			return err
		}
		_, copyErr := io.Copy(digest, file)
		closeErr := file.Close()
		if copyErr != nil {
			return copyErr
		}
		return closeErr
	})
}

func VersionedInstallPath(key string, contentHash string) (string, error) {
	key = NormalizeKey(key)
	contentHash = strings.ToLower(strings.TrimSpace(contentHash))
	if key == "" || len(contentHash) < releaseHashLength {
		return "", fmt.Errorf("技能版本标识无效")
	}
	release := time.Now().UTC().Format("20060102T150405.000000000") + "-" + contentHash[:releaseHashLength]
	target := filepath.Join(Root, key, releaseDirectory, release)
	if err := ValidateInstallTarget(target); err != nil {
		return "", fmt.Errorf("技能安装目录不安全: %w", err)
	}
	return target, nil
}

func PruneSkillReleases(key string, currentPath string) {
	key = NormalizeKey(key)
	if key == "" {
		return
	}
	skillRoot := filepath.Join(Root, key)
	if err := ValidateInstallRoot(skillRoot); err != nil {
		return
	}
	root := filepath.Join(skillRoot, releaseDirectory)
	entries, err := os.ReadDir(root)
	if err != nil {
		return
	}
	type releaseInfo struct {
		path    string
		modTime time.Time
	}
	releases := make([]releaseInfo, 0, len(entries))
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}
		path := filepath.Join(root, entry.Name())
		if !IsSafePath(path) {
			continue
		}
		info, infoErr := entry.Info()
		if infoErr != nil {
			continue
		}
		releases = append(releases, releaseInfo{path: path, modTime: info.ModTime()})
	}
	sort.Slice(releases, func(left, right int) bool {
		return releases[left].modTime.After(releases[right].modTime)
	})
	currentPath = filepath.Clean(strings.TrimSpace(currentPath))
	now := time.Now()
	kept := 0
	for _, release := range releases {
		if filepath.Clean(release.path) == currentPath || kept < releaseRetentionCount {
			kept++
			continue
		}
		if now.Sub(release.modTime) < releaseRetentionPeriod {
			continue
		}
		_ = os.RemoveAll(release.path)
	}
}

func isVersionedInstallPath(path string) bool {
	relative, err := filepath.Rel(filepath.Clean(Root), filepath.Clean(path))
	if err != nil {
		return false
	}
	parts := strings.Split(filepath.ToSlash(relative), "/")
	return len(parts) == 3 && parts[1] == releaseDirectory && parts[0] != "" && parts[2] != ""
}

// SkillRemovalPath expands a versioned release path to its skill root so that
// deleting a skill also removes retained historical releases.
func SkillRemovalPath(key string, installPath string) string {
	key = NormalizeKey(key)
	if key == "" {
		return ""
	}
	root := filepath.Clean(filepath.Join(Root, key))
	path := filepath.Clean(strings.TrimSpace(installPath))
	if !IsSafePath(root) || !IsSafePath(path) || !pathWithin(root, path) {
		return ""
	}
	if path == root {
		return root
	}
	relative, err := filepath.Rel(root, path)
	if err != nil {
		return ""
	}
	parts := strings.Split(filepath.ToSlash(relative), "/")
	if len(parts) == 2 && parts[0] == releaseDirectory && parts[1] != "" {
		return root
	}
	return path
}
