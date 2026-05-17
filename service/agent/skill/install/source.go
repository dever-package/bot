package install

import (
	"context"
	"fmt"
	"io"
	"io/fs"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"sort"
	"strings"

	agentskill "my/package/bot/service/agent/skill"
)

func (s Service) prepareSkillSource(ctx context.Context, exec *skillInstallExecution, tmpDir string) (installedSkillSource, error) {
	switch exec.InstallType {
	case "command":
		return s.prepareCommandSkill(ctx, exec, tmpDir)
	case "url":
		return s.prepareURLSkill(ctx, exec, tmpDir)
	default:
		return s.preparePromptSkill(ctx, exec, tmpDir)
	}
}

func (s Service) prepareCommandSkill(ctx context.Context, exec *skillInstallExecution, tmpDir string) (installedSkillSource, error) {
	s.status(ctx, exec, "正在执行安装命令")
	output, err := runInstallCommand(ctx, tmpDir, exec.Input)
	if strings.TrimSpace(output) != "" {
		s.log(exec, "%s", strings.TrimSpace(output))
	}
	if err != nil {
		return installedSkillSource{}, err
	}
	filePath, err := findInstalledSkillFile(tmpDir)
	if err != nil {
		return installedSkillSource{}, err
	}
	return installedSkillSource{
		Directory: filepath.Dir(filePath),
		FilePath:  filePath,
	}, nil
}

func (s Service) prepareURLSkill(ctx context.Context, exec *skillInstallExecution, tmpDir string) (installedSkillSource, error) {
	s.status(ctx, exec, "正在读取技能链接")
	content, err := fetchInstallURL(ctx, exec.Input)
	if err != nil {
		return installedSkillSource{}, err
	}
	return writeGeneratedSkill(tmpDir, exec.ID, exec.Input, content)
}

func (s Service) preparePromptSkill(ctx context.Context, exec *skillInstallExecution, tmpDir string) (installedSkillSource, error) {
	s.status(ctx, exec, "正在根据提示词生成技能文件")
	return writeGeneratedSkill(tmpDir, exec.ID, "", exec.Input)
}

func runInstallCommand(ctx context.Context, workDir string, command string) (string, error) {
	command = strings.TrimSpace(command)
	if command == "" {
		return "", fmt.Errorf("安装命令不能为空")
	}
	homeDir := filepath.Join(workDir, ".home")
	if err := os.MkdirAll(homeDir, 0o755); err != nil {
		return "", err
	}
	cmd := exec.CommandContext(ctx, "bash", "-lc", command)
	cmd.Dir = workDir
	cmd.Env = append(os.Environ(),
		"HOME="+homeDir,
		"XDG_CONFIG_HOME="+filepath.Join(homeDir, ".config"),
		"CODEX_HOME="+filepath.Join(homeDir, ".codex"),
		"CLAUDE_HOME="+filepath.Join(homeDir, ".claude"),
		"SKILLS_HOME="+workDir,
		"SKILLS_DIR="+workDir,
	)
	output, err := cmd.CombinedOutput()
	text := string(output)
	if len(text) > 32*1024 {
		text = text[len(text)-32*1024:]
	}
	if ctx.Err() != nil {
		return text, fmt.Errorf("安装命令执行超时")
	}
	if err != nil {
		return text, fmt.Errorf("安装命令执行失败: %w", err)
	}
	return text, nil
}

func findInstalledSkillFile(root string) (string, error) {
	paths := make([]string, 0)
	if err := filepath.WalkDir(root, func(path string, entry fs.DirEntry, err error) error {
		if err != nil {
			return nil
		}
		if entry.IsDir() || entry.Name() != agentskill.EntryFile {
			return nil
		}
		paths = append(paths, path)
		return nil
	}); err != nil {
		return "", err
	}
	sort.Strings(paths)
	if len(paths) == 0 {
		return "", fmt.Errorf("未找到 %s，请确认安装命令把技能安装到了任务目录", agentskill.EntryFile)
	}
	return paths[0], nil
}

func fetchInstallURL(ctx context.Context, rawURL string) (string, error) {
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, strings.TrimSpace(rawURL), nil)
	if err != nil {
		return "", err
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return "", fmt.Errorf("读取链接失败: %s", resp.Status)
	}
	limited := io.LimitReader(resp.Body, agentskill.HTTPMaxLen)
	content, err := io.ReadAll(limited)
	if err != nil {
		return "", err
	}
	return string(content), nil
}
