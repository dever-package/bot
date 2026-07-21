package install

import (
	"fmt"
	"io/fs"
	"path/filepath"
	"sort"
	"strings"

	agentskill "github.com/dever-package/bot/service/agent/skill"
)

const (
	maxCollectRoots         = 16
	maxDiscoveredSkillFiles = 256
	maxSkillDiscoveryDepth  = 32
)

func collectSkillSources(workDir string, plan installPlan, provenance []sourceProvenance, fallbackURL string) ([]installedSkillSource, error) {
	if len(plan.Collect.Roots) > maxCollectRoots {
		return nil, fmt.Errorf("技能发现目录不能超过 %d 个", maxCollectRoots)
	}
	filePaths := make([]string, 0)
	seen := map[string]struct{}{}
	for _, root := range plan.Collect.Roots {
		rootPath, err := safeWorkPath(workDir, root)
		if err != nil {
			return nil, err
		}
		paths, err := findInstalledSkillFiles(rootPath, plan.Collect.Entry)
		if err != nil {
			return nil, err
		}
		for _, item := range paths {
			if _, exists := seen[item]; exists {
				continue
			}
			if len(filePaths) >= maxDiscoveredSkillFiles {
				return nil, fmt.Errorf("发现的技能数量超过 %d 个，请缩小 collect.roots", maxDiscoveredSkillFiles)
			}
			seen[item] = struct{}{}
			filePaths = append(filePaths, item)
		}
	}
	filePaths = filterNestedSkillFiles(filePaths)
	if plan.Collect.Mode == collectModeOne && len(filePaths) > 1 {
		return nil, fmt.Errorf("发现多个技能，请在安装计划中缩小 collect.roots 后重试")
	}
	if len(filePaths) == 0 {
		return nil, fmt.Errorf("未找到 %s，请确认安装计划把技能安装到了任务目录", agentskill.EntryFile)
	}
	return skillSourcesFromFiles(filePaths, provenance, fallbackURL), nil
}

func safeWorkPath(workDir string, target string) (string, error) {
	if strings.TrimSpace(target) == "" {
		target = "."
	}
	cleanTarget, _, err := agentskill.ResolveRelativePath(workDir, target)
	if err != nil {
		return "", fmt.Errorf("安装计划 collect.roots 越界: %s", target)
	}
	return cleanTarget, nil
}

func findInstalledSkillFiles(root string, entryFile string) ([]string, error) {
	paths := make([]string, 0)
	limitExceeded := false
	if err := filepath.WalkDir(root, func(path string, entry fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		if path != root && entry.IsDir() {
			if skillDiscoveryDirectorySkipped(entry.Name()) {
				return filepath.SkipDir
			}
			depth, depthErr := relativePathDepth(root, path)
			if depthErr != nil {
				return depthErr
			}
			if depth > maxSkillDiscoveryDepth {
				return filepath.SkipDir
			}
		}
		if entry.IsDir() || entry.Name() != entryFile {
			return nil
		}
		if len(paths) >= maxDiscoveredSkillFiles {
			limitExceeded = true
			return fs.SkipAll
		}
		paths = append(paths, path)
		return nil
	}); err != nil {
		return nil, err
	}
	if limitExceeded {
		return nil, fmt.Errorf("发现的技能数量超过 %d 个，请缩小 collect.roots", maxDiscoveredSkillFiles)
	}
	sort.Strings(paths)
	return paths, nil
}

func skillSourcesFromFiles(filePaths []string, provenance []sourceProvenance, fallbackURL string) []installedSkillSource {
	sources := make([]installedSkillSource, 0, len(filePaths))
	for _, filePath := range filePaths {
		sources = append(sources, installedSkillSource{
			Directory: filepath.Dir(filePath),
			FilePath:  filePath,
			SourceURL: sourceURLForPath(filePath, provenance, fallbackURL),
		})
	}
	return sources
}

func skillDiscoveryDirectorySkipped(name string) bool {
	switch strings.ToLower(strings.TrimSpace(name)) {
	case ".git", ".dever", ".skillhub", ".npm", ".cache", ".venv", "venv", "node_modules", "__pycache__", "dist", "build":
		return true
	default:
		return false
	}
}

func relativePathDepth(root string, path string) (int, error) {
	relative, err := filepath.Rel(root, path)
	if err != nil {
		return 0, err
	}
	if relative == "." {
		return 0, nil
	}
	return len(strings.Split(filepath.Clean(relative), string(filepath.Separator))), nil
}

func sourceURLForPath(filePath string, provenance []sourceProvenance, fallbackURL string) string {
	selected := strings.TrimSpace(fallbackURL)
	selectedRootLength := -1
	for _, source := range provenance {
		root := filepath.Clean(strings.TrimSpace(source.Root))
		if root == "." || strings.TrimSpace(source.URL) == "" || !pathContains(root, filePath) {
			continue
		}
		if len(root) <= selectedRootLength {
			continue
		}
		selected = strings.TrimSpace(source.URL)
		selectedRootLength = len(root)
	}
	return publicSourceURL(selected)
}

func pathContains(root string, target string) bool {
	relative, err := filepath.Rel(filepath.Clean(root), filepath.Clean(target))
	if err != nil {
		return false
	}
	return relative != ".." && !strings.HasPrefix(relative, ".."+string(filepath.Separator))
}

func filterNestedSkillFiles(filePaths []string) []string {
	sort.Slice(filePaths, func(i, j int) bool {
		left := filepath.Dir(filePaths[i])
		right := filepath.Dir(filePaths[j])
		if len(left) != len(right) {
			return len(left) < len(right)
		}
		return filePaths[i] < filePaths[j]
	})
	selectedDirs := make([]string, 0, len(filePaths))
	result := make([]string, 0, len(filePaths))
	for _, filePath := range filePaths {
		dir := filepath.Clean(filepath.Dir(filePath))
		if hasParentSkillDir(dir, selectedDirs) {
			continue
		}
		selectedDirs = append(selectedDirs, dir)
		result = append(result, filePath)
	}
	return result
}

func hasParentSkillDir(dir string, parents []string) bool {
	for _, parent := range parents {
		if dir == parent || strings.HasPrefix(dir, parent+string(filepath.Separator)) {
			return true
		}
	}
	return false
}
