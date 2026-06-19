package install

import (
	"fmt"
	"io/fs"
	"path/filepath"
	"sort"
	"strings"

	agentskill "github.com/dever-package/bot/service/agent/skill"
)

func collectSkillSources(workDir string, plan installPlan, sourceURL string) ([]installedSkillSource, error) {
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
			seen[item] = struct{}{}
			filePaths = append(filePaths, item)
		}
	}
	filePaths = filterNestedSkillFiles(filePaths)
	if plan.Collect.Mode == collectModeOne && len(filePaths) > 1 {
		filePaths = filePaths[:1]
	}
	if len(filePaths) == 0 {
		return nil, fmt.Errorf("未找到 %s，请确认安装计划把技能安装到了任务目录", agentskill.EntryFile)
	}
	return skillSourcesFromFiles(filePaths, sourceURL), nil
}

func safeWorkPath(workDir string, target string) (string, error) {
	if strings.TrimSpace(target) == "" {
		target = "."
	}
	cleanRoot := filepath.Clean(workDir)
	cleanTarget := filepath.Clean(filepath.Join(workDir, target))
	if cleanTarget != cleanRoot && !strings.HasPrefix(cleanTarget, cleanRoot+string(filepath.Separator)) {
		return "", fmt.Errorf("安装计划 collect.roots 越界: %s", target)
	}
	return cleanTarget, nil
}

func findInstalledSkillFiles(root string, entryFile string) ([]string, error) {
	paths := make([]string, 0)
	if err := filepath.WalkDir(root, func(path string, entry fs.DirEntry, err error) error {
		if err != nil {
			return nil
		}
		if entry.IsDir() || entry.Name() != entryFile {
			return nil
		}
		paths = append(paths, path)
		return nil
	}); err != nil {
		return nil, err
	}
	sort.Strings(paths)
	return paths, nil
}

func skillSourcesFromFiles(filePaths []string, sourceURL string) []installedSkillSource {
	sources := make([]installedSkillSource, 0, len(filePaths))
	for _, filePath := range filePaths {
		sources = append(sources, installedSkillSource{
			Directory: filepath.Dir(filePath),
			FilePath:  filePath,
			SourceURL: sourceURL,
		})
	}
	return sources
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
