package setting

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"

	"github.com/shemic/dever/server"
	"github.com/shemic/dever/util"

	skillservice "github.com/dever-package/bot/service/agent/skill"
)

const (
	skillScanMaxFiles     = 200
	skillSourceMetaMaxLen = 64 * 1024
)

func (AgentHook) ProviderLoadSkillDetail(c *server.Context, params []any) any {
	record := skillDetailRecord(params)
	if len(record) == 0 {
		return record
	}

	record["manifest_pretty"] = prettyJSONText(util.ToStringTrimmed(record["manifest"]))
	installPath := util.ToStringTrimmed(record["install_path"])
	summary, files := scanSkillInstallFiles(installPath)
	record["skill_scan_summary"] = summary
	record["skill_scan_files"] = files
	record["source_meta_pretty"] = readSkillSourceMeta(installPath)
	record["skill_config_rows"] = skillConfigRows(c.Context(), util.ToUint64(record["id"]))
	return record
}

func skillDetailRecord(params []any) map[string]any {
	payload := cloneAgentRecord(params)
	if nested, ok := payload["record"].(map[string]any); ok {
		return util.CloneMap(nested)
	}
	return payload
}

func prettyJSONText(raw string) string {
	raw = strings.TrimSpace(raw)
	if raw == "" {
		return ""
	}
	var decoded any
	if err := json.Unmarshal([]byte(raw), &decoded); err != nil {
		return raw
	}
	pretty, err := json.MarshalIndent(decoded, "", "  ")
	if err != nil {
		return raw
	}
	return string(pretty)
}

func scanSkillInstallFiles(installPath string) (string, []map[string]any) {
	root := filepath.Clean(strings.TrimSpace(installPath))
	if root == "" || root == "." {
		return "未记录安装目录。", []map[string]any{}
	}
	if !skillservice.IsSafePath(root) {
		return "安装目录不在 data/skills 下，已跳过扫描。", []map[string]any{}
	}
	info, err := os.Stat(root)
	if err != nil {
		return fmt.Sprintf("安装目录不可访问：%v", err), []map[string]any{}
	}
	if !info.IsDir() {
		return "安装路径不是目录。", []map[string]any{}
	}

	scanner := &skillFileScanner{
		root: root,
		rows: make([]map[string]any, 0, 16),
		seen: map[string]struct{}{},
	}
	scanner.addKnownFiles()
	scanner.walkKnownDirs()
	sort.Slice(scanner.rows, func(i, j int) bool {
		left := fmt.Sprint(scanner.rows[i]["path"])
		right := fmt.Sprint(scanner.rows[j]["path"])
		return left < right
	})

	summary := fmt.Sprintf("扫描到 %d 个相关文件。", len(scanner.rows))
	if scanner.truncated {
		summary += fmt.Sprintf(" 已截断，仅展示前 %d 个。", skillScanMaxFiles)
	}
	return summary, scanner.rows
}

func readSkillSourceMeta(installPath string) string {
	root := filepath.Clean(strings.TrimSpace(installPath))
	if root == "" || root == "." || !skillservice.IsSafePath(root) {
		return ""
	}
	path := filepath.Join(root, "_meta.json")
	if !skillservice.IsSafePath(path) {
		return ""
	}
	info, err := os.Stat(path)
	if err != nil || info.IsDir() {
		return ""
	}
	if info.Size() > skillSourceMetaMaxLen {
		return fmt.Sprintf("_meta.json 过大，仅展示文件信息，大小 %d 字节。", info.Size())
	}
	raw, err := os.ReadFile(path)
	if err != nil {
		return fmt.Sprintf("读取 _meta.json 失败：%v", err)
	}
	return prettyJSONText(string(raw))
}

type skillFileScanner struct {
	root      string
	rows      []map[string]any
	seen      map[string]struct{}
	truncated bool
}

func (scanner *skillFileScanner) addKnownFiles() {
	for _, item := range []struct {
		path string
		kind string
	}{
		{skillservice.EntryFile, "entry"},
		{"_meta.json", "source_meta"},
		{"README.md", "readme"},
		{"README", "readme"},
		{"requirements.txt", "python_dependencies"},
		{"pyproject.toml", "python_dependencies"},
		{"package.json", "node_dependencies"},
	} {
		scanner.add(item.path, item.kind)
	}
}

func (scanner *skillFileScanner) walkKnownDirs() {
	for _, item := range []struct {
		path string
		kind string
	}{
		{"scripts", "script"},
		{"references", "reference"},
	} {
		scanner.walkDir(item.path, item.kind)
	}
}

func (scanner *skillFileScanner) walkDir(relative string, kind string) {
	dir := filepath.Join(scanner.root, relative)
	info, err := os.Stat(dir)
	if err != nil || !info.IsDir() {
		return
	}
	_ = filepath.WalkDir(dir, func(path string, entry os.DirEntry, err error) error {
		if err != nil {
			return nil
		}
		if path == dir {
			return nil
		}
		name := entry.Name()
		if entry.IsDir() {
			if strings.HasPrefix(name, ".") || name == "node_modules" || name == "__pycache__" || name == ".venv" || name == "venv" {
				return filepath.SkipDir
			}
			return nil
		}
		rel, err := filepath.Rel(scanner.root, path)
		if err != nil {
			return nil
		}
		scanner.add(rel, kind)
		return nil
	})
}

func (scanner *skillFileScanner) add(relative string, kind string) {
	if scanner.truncated || len(scanner.rows) >= skillScanMaxFiles {
		scanner.truncated = true
		return
	}
	relative = filepath.Clean(strings.TrimSpace(relative))
	if relative == "" || relative == "." || strings.HasPrefix(relative, "..") {
		return
	}
	path := filepath.Join(scanner.root, relative)
	if !skillservice.IsSafePath(path) {
		return
	}
	info, err := os.Stat(path)
	if err != nil || info.IsDir() {
		return
	}
	displayPath := filepath.ToSlash(relative)
	if _, exists := scanner.seen[displayPath]; exists {
		return
	}
	scanner.seen[displayPath] = struct{}{}
	scanner.rows = append(scanner.rows, map[string]any{
		"path": displayPath,
		"kind": kind,
		"size": info.Size(),
	})
}
