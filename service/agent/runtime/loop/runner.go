package loop

import (
	"context"
	"fmt"
	"time"

	agentmodel "github.com/dever-package/bot/model/agent"
	energonmodel "github.com/dever-package/bot/model/energon"
	runtimescope "github.com/dever-package/bot/service/agent/runtime/scope"
	runtimetool "github.com/dever-package/bot/service/agent/runtime/tool"
	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	energonservice "github.com/dever-package/bot/service/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

type execution struct {
	runID                uint64
	version              int
	workerID             string
	requestID            string
	requestedAt          time.Time
	startedAt            time.Time
	claimedAt            time.Time
	agent                agentmodel.Agent
	power                energonmodel.Power
	modelLimits          energonservice.ModelLimits
	workingContextTokens int
	sessionID            uint64
	assistantMessageID   uint64
	prompt               string
	input                map[string]any
	history              []any
	registry             *runtimetool.Registry
	transport            modelTransport
	persistChat          bool
	onStream             func(map[string]any)
	completion           chan runCompletion
	cleanup              func()
	mediaReferences      []runtimeprovider.MediaReference
	priorKnowledgeUsed   bool
	snapshotHistoryLen   int
	snapshotMediaLen     int
	scope                runtimescope.Scope
	billing              botprotocol.BillingContext
	scopedContext        context.Context
	checkpoint           runCheckpoint
	documentID           uint64
	documentModelStep    int
}

type modelTransport struct {
	Method  string
	Host    string
	Path    string
	Headers map[string]string
}

func (execution execution) close() {
	if execution.cleanup != nil {
		execution.cleanup()
	}
}

type modelStepResult struct {
	Text                string
	Output              botprotocol.Output
	ToolCalls           []botprotocol.ToolCall
	FinishMode          string
	ProviderRequestedAt time.Time
	FirstDeltaAt        time.Time
	ProviderFinishedAt  time.Time
	Attempts            int
	Budget              modelRequestBudget
	TextPublished       bool
}

type modelCallError struct {
	code    string
	message string
}

func (err modelCallError) Error() string {
	return err.message
}

func (err modelCallError) ErrorCode() string {
	return err.code
}

type toolStepResult struct {
	result      runtimeprovider.Result
	err         error
	receiptable bool
	blockRetry  bool
	content     string
	typeKey     string
	title       string
	status      string
	payload     map[string]any
}

func (s Service) run(controller *runController, execution execution) {
	state := newRunState(execution)
	defer s.runs.Remove(execution.requestID)
	defer controller.cancel()
	defer execution.close()
	defer func() {
		if recovered := recover(); recovered != nil && controller.StopReason() != "lease_lost" {
			s.finish(&state, finishOutcome{
				status: runStatusFail, text: state.lastText, message: fmt.Sprintf("智能体运行异常: %v", recovered),
				stepType: "error", stepTitle: "运行异常", stepStatus: stepStatusFail,
			})
		}
	}()

	ctx := state.execution.scopedContext
	if ctx == nil {
		ctx = controller.Context()
	}
	stepLimits := loadModelStepLimits(ctx, execution.agent)
	for {
		if ctx.Err() != nil {
			s.finishContext(controller, &state)
			return
		}
		switch state.phase {
		case runPhaseFinal:
			s.finishCheckpoint(&state)
			return
		case runPhaseTool:
			if !s.runToolStep(ctx, controller, &state) {
				return
			}
		case runPhaseModel:
			maxSteps := stepLimits.current(state.awaitingDelivery)
			if state.modelStep > maxSteps {
				s.finish(&state, finishOutcome{
					status: runStatusFail, text: state.lastText,
					message:  fmt.Sprintf("智能体达到最大步骤数 %d", maxSteps),
					stepType: "error", stepTitle: "达到最大步骤", stepStatus: stepStatusFail,
				})
				return
			}
			if !s.runModelStep(ctx, controller, &state, stepLimits) {
				return
			}
		default:
			s.finish(&state, finishOutcome{
				status: runStatusFail, text: state.lastText, message: "智能体运行检查点无效",
				stepType: "error", stepTitle: "恢复失败", stepStatus: stepStatusFail,
			})
			return
		}
	}
}
