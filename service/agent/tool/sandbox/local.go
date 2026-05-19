package sandbox

import (
	"context"
	"fmt"
	"os/exec"
	"path/filepath"
	"time"
)

type localRunner struct{}

func (localRunner) Run(ctx context.Context, config Config, req Request) (Result, error) {
	scriptPath := filepath.Join(req.SkillRoot, filepath.FromSlash(req.ScriptRelative))
	commandName, commandArgs, err := scriptCommand(scriptPath, req.Args)
	if err != nil {
		return Result{}, err
	}
	return runCommand(ctx, runCommandInput{
		Runner:         DriverLocal,
		Script:         req.ScriptRelative,
		CommandName:    commandName,
		CommandArgs:    commandArgs,
		WorkDir:        req.SkillRoot,
		Env:            scriptEnv(req.TempRoot),
		Timeout:        requestTimeout(req, config),
		OutputMaxBytes: config.OutputMaxBytes,
	})
}

type runCommandInput struct {
	Runner         string
	Script         string
	CommandName    string
	CommandArgs    []string
	WorkDir        string
	Env            []string
	Timeout        time.Duration
	OutputMaxBytes int
}

func runCommand(ctx context.Context, input runCommandInput) (Result, error) {
	timeoutCtx, cancel := context.WithTimeout(ctx, input.Timeout)
	defer cancel()

	command := exec.CommandContext(timeoutCtx, input.CommandName, input.CommandArgs...)
	command.Dir = input.WorkDir
	command.Env = input.Env

	stdout := &limitedBuffer{limit: input.OutputMaxBytes}
	stderr := &limitedBuffer{limit: input.OutputMaxBytes}
	command.Stdout = stdout
	command.Stderr = stderr

	startedAt := time.Now()
	err := command.Run()
	duration := time.Since(startedAt).Milliseconds()
	if timeoutCtx.Err() == context.DeadlineExceeded {
		return Result{}, fmt.Errorf("脚本执行超时: %s", input.Script)
	}

	exitCode := 0
	if err != nil {
		if command.ProcessState != nil {
			exitCode = command.ProcessState.ExitCode()
		} else {
			exitCode = -1
		}
	}
	result := Result{
		Runner:     input.Runner,
		Script:     input.Script,
		ExitCode:   exitCode,
		DurationMS: duration,
		Stdout:     stdout.String(),
		Stderr:     stderr.String(),
		Truncated:  stdout.truncated || stderr.truncated,
	}
	if err != nil {
		result.Error = err.Error()
	}
	return result, nil
}

func requestTimeout(req Request, config Config) time.Duration {
	if req.Timeout <= 0 {
		return config.Timeout
	}
	timeout := normalizeTimeout(req.Timeout, config.Timeout)
	if timeout > config.Timeout {
		return config.Timeout
	}
	return timeout
}
