package loop

import (
	"context"
	"strings"

	dlog "github.com/shemic/dever/log"
	"github.com/shemic/dever/server"

	agentmodel "github.com/dever-package/bot/model/agent"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
)

// mountExecutionTools builds process-local tool state immediately before model
// execution. Durable snapshots intentionally keep only the base prompt so a
// retry never appends mounted instructions more than once.
func (s Service) mountExecutionTools(
	ctx context.Context,
	execution *execution,
	currentServer *server.Context,
	loadedSkills []agentmodel.LoadedSkillRef,
) error {
	serverContext, err := execution.scope.Server(ctx, currentServer)
	if err != nil {
		return err
	}
	execution.scopedContext = ctx
	if currentServer == nil && serverContext != nil {
		execution.scopedContext = serverContext.Context()
	}
	mountCtx, cancel := operationContext(execution.scopedContext, toolMountTimeout)
	defer cancel()
	mounted, err := runtimetool.Mount(mountCtx, runtimetool.MountRequest{
		Agent:          execution.agent,
		Gateway:        s.gateway,
		PreparationKey: execution.requestID,
		References:     execution.mediaReferences,
		Billing:        execution.billing,
		EnableDocument: execution.persistChat && execution.assistantMessageID > 0,
		Method:         execution.transport.Method,
		Host:           execution.transport.Host,
		Path:           execution.transport.Path,
		Headers:        execution.transport.Headers,
		Server:         serverContext,
	})
	if err != nil {
		return err
	}
	restored, history, err := restoreLoadedSkills(
		mountCtx, mounted.Registry, loadedSkills, execution.history, execution.requestID,
	)
	if err != nil {
		mounted.Close()
		return err
	}
	execution.history = append(execution.history, history...)
	execution.checkpoint.LoadedSkills = restored
	execution.registry = mounted.Registry
	execution.cleanup = mounted.Close
	if len(mounted.Warnings) > 0 {
		dlog.ErrorFields("agent_tool_mount_warning", "部分智能体能力未挂载", dlog.Fields{
			"run_id": execution.runID, "request_id": execution.requestID,
			"warnings": strings.Join(mounted.Warnings, "; "),
		})
	}
	return nil
}
