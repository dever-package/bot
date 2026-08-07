package energon

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	botmodel "github.com/dever-package/bot/model/energon"
	botinput "github.com/dever-package/bot/service/energon/input"
	botprocessor "github.com/dever-package/bot/service/energon/processor"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
	botadapters "github.com/dever-package/bot/service/energon/protocol/adapters"
	botprovider "github.com/dever-package/bot/service/energon/provider"
	botstream "github.com/dever-package/bot/service/energon/stream"
	bottask "github.com/dever-package/bot/service/energon/task"
	frontstream "github.com/dever-package/front/service/stream"
)

type GatewayService struct {
	repo          Repo
	streams       frontstream.Service
	streamCancels *botstream.CancelRegistry
	audioStreams  *botstream.AudioRelay
	tasks         bottask.Service
	client        botprovider.Client
	registry      *botprotocol.Registry
	processors    *botprocessor.Registry
}

const defaultProviderHTTPTimeout = time.Hour

func NewGatewayService() GatewayService {
	return NewGatewayServiceWithClient(botprovider.NewHTTPClient(defaultProviderHTTPTimeout))
}

func NewGatewayServiceWithClient(client botprovider.Client) GatewayService {
	repo := NewRepo()
	if client == nil {
		client = botprovider.NewHTTPClient(defaultProviderHTTPTimeout)
	}
	service := GatewayService{
		repo:          repo,
		streams:       frontstream.New(botstream.Namespace),
		streamCancels: botstream.NewCancelRegistry(),
		audioStreams:  botstream.SharedAudioRelay(),
		client:        client,
		registry:      botadapters.DefaultRegistry(),
		processors:    botprocessor.DefaultRegistry(),
	}
	service.tasks = bottask.NewService(bottask.NewInlineQueue(bottask.HandlerFunc(func(ctx context.Context, job bottask.Job) error {
		return service.handleStreamJob(ctx, job)
	}), botstream.WorkerTimeout))
	return service
}

func (s GatewayService) Handle(ctx context.Context, raw GatewayRequest) (*GatewayResponse, error) {
	prepared, mode, err := prepareGatewayRequest(raw)
	if err != nil {
		return nil, err
	}

	switch mode {
	case ModeProxy:
		req := &botprotocol.ShemicRequest{
			RequestID: prepared.RequestID,
			Mode:      ModeProxy,
			Protocol:  detectProtocol(prepared),
			Kind:      "proxy.protocol",
			Name:      resolveProxyPower(prepared),
			Raw:       buildRawProtocolRequest(prepared, mode),
			Billing:   prepared.Billing,
		}
		return s.handleProxy(ctx, req)
	default:
		req, err := s.normalizeGatewayRequest(prepared, mode)
		if err != nil {
			return nil, err
		}
		return s.handleNormalize(ctx, req)
	}
}

func (s GatewayService) Validate(ctx context.Context, raw GatewayRequest) error {
	req, plan, err := s.prepareValidationPlan(ctx, raw)
	if err != nil {
		return err
	}
	var lastErr error
	for _, target := range plan.targets {
		if err := s.validateNormalizeTarget(ctx, req, plan.power, target); err == nil {
			return nil
		} else {
			lastErr = err
		}
	}
	if lastErr != nil {
		return lastErr
	}
	return fmt.Errorf("能力没有可用实现: %s", req.Name)
}

// ValidatePowerTarget validates one exact source candidate. Unlike the normal
// source resolver, this method does not let another compatible target satisfy
// the validation request.
func (s GatewayService) ValidatePowerTarget(ctx context.Context, raw GatewayRequest, targetID uint64) error {
	if targetID == 0 {
		return fmt.Errorf("能力来源不能为空")
	}
	req, plan, err := s.prepareValidationPlan(ctx, raw)
	if err != nil {
		return err
	}
	for _, target := range plan.targets {
		if target.ID == targetID {
			return s.validateNormalizeTarget(ctx, req, plan.power, target)
		}
	}
	return fmt.Errorf("指定来源与当前参数不兼容: %d", targetID)
}

func (s GatewayService) prepareValidationPlan(ctx context.Context, raw GatewayRequest) (*botprotocol.ShemicRequest, normalizePlan, error) {
	prepared, mode, err := prepareGatewayRequest(raw)
	if err != nil {
		return nil, normalizePlan{}, err
	}
	if mode == ModeProxy {
		return nil, normalizePlan{}, fmt.Errorf("代理请求不支持能力预检")
	}
	req, err := s.normalizeGatewayRequest(prepared, mode)
	if err != nil {
		return nil, normalizePlan{}, err
	}
	plan, err := s.resolveNormalizePlan(ctx, req)
	if err != nil {
		return nil, normalizePlan{}, err
	}
	return req, plan, nil
}

func (s GatewayService) validateNormalizeTarget(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	power botmodel.Power,
	target botmodel.PowerTarget,
) error {
	req = withoutImageSequenceMode(req)
	selected, err := s.selectTarget(ctx, power, target)
	if err != nil {
		return err
	}
	targetReq := *req
	var adapter botprotocol.Adapter
	if isLocalProvider(selected.Provider) {
		targetReq.Protocol = botprocessor.ProtocolLocal
		if !localServiceMatchesProcessor(selected.Service.Path, selected.Provider.Processor) {
			return fmt.Errorf("本地来源服务与处理器配置不一致，请重新保存来源")
		}
	} else {
		adapter, err = s.adapterForSelected(&targetReq, selected)
		if err != nil {
			return err
		}
		targetReq.Protocol = adapter.Name()
	}

	mapped, err := botinput.BuildMapped(ctx, s.repo, &targetReq, botinput.Target{
		PowerID:   selected.Power.ID,
		ServiceID: selected.Service.ID,
	})
	if err != nil {
		return err
	}
	selected, err = s.applyServiceEndpoint(ctx, selected, mapped)
	if err != nil {
		return err
	}
	if isLocalProvider(selected.Provider) {
		return nil
	}
	_, err = adapter.BuildNativeRequest(botprotocol.NativeInput{
		Request:     &targetReq,
		Provider:    selected.Provider,
		Account:     selected.Account,
		Power:       selected.Power,
		PowerTarget: selected.PowerTarget,
		Service:     selected.Service,
		ServiceAPI:  selected.ServiceAPI,
		Mapped:      mapped,
	})
	return err
}

func prepareGatewayRequest(raw GatewayRequest) (GatewayRequest, string, error) {
	if raw.Body == nil {
		raw.Body = map[string]any{}
	}
	mode, err := resolveMode(raw)
	if err != nil {
		return raw, "", err
	}
	raw.RequestID = resolveRequestID(raw)
	raw.Path = resolveRawPath(raw, mode)
	return raw, mode, nil
}

func (s GatewayService) normalizeGatewayRequest(raw GatewayRequest, mode string) (*botprotocol.ShemicRequest, error) {
	adapter, err := s.registry.Get(detectProtocol(raw))
	if err != nil {
		return nil, err
	}
	req, err := adapter.Normalize(buildRawProtocolRequest(raw, mode))
	if err != nil {
		return nil, err
	}
	req.RequestID = raw.RequestID
	req.Mode = mode
	req.Billing = raw.Billing
	return req, nil
}

func buildRawProtocolRequest(raw GatewayRequest, mode string) botprotocol.RawRequest {
	return botprotocol.RawRequest{
		Method:  raw.Method,
		Host:    resolveHost(raw),
		Path:    raw.Path,
		Mode:    mode,
		Headers: raw.Headers,
		Body:    raw.Body,
	}
}

func (s GatewayService) selectTarget(ctx context.Context, power botmodel.Power, target botmodel.PowerTarget) (selectedTarget, error) {
	if target.PowerID != power.ID {
		return selectedTarget{}, fmt.Errorf("能力来源不属于当前能力")
	}
	if target.ServiceID == 0 {
		return selectedTarget{}, fmt.Errorf("能力来源“%s”未选择来源服务", power.Name)
	}
	service, ok := s.repo.FindService(ctx, target.ServiceID)
	if !ok {
		return selectedTarget{}, fmt.Errorf("能力来源“%s”的来源服务不存在，请重新选择来源服务", power.Name)
	}
	if !isActive(service.Status) {
		return selectedTarget{}, fmt.Errorf("能力来源“%s”绑定的来源服务“%s”已停用", power.Name, service.Name)
	}
	provider, ok := s.repo.FindProvider(ctx, service.ProviderID)
	if !ok || !isActive(provider.Status) {
		return selectedTarget{}, fmt.Errorf("来源不可用")
	}
	account := botmodel.Account{}
	if !isLocalProvider(provider) {
		var err error
		account, err = selectServiceAccount(ctx, s.repo, provider, service)
		if err != nil {
			return selectedTarget{}, err
		}
		provider = withAccountHost(provider, account)
	}
	return selectedTarget{
		Provider:    provider,
		Account:     account,
		Power:       power,
		PowerTarget: target,
		Service:     service,
	}, nil
}

func isLocalProvider(provider botmodel.Provider) bool {
	return strings.EqualFold(strings.TrimSpace(provider.Protocol), botprocessor.ProtocolLocal)
}

func (s GatewayService) adapterForSelected(req *botprotocol.ShemicRequest, selected selectedTarget) (botprotocol.Adapter, error) {
	protocol := strings.TrimSpace(selected.Provider.Protocol)
	if protocol == "" {
		protocol = requestedProtocol(req)
	}
	return s.registry.Get(protocol)
}

func requestedProtocol(req *botprotocol.ShemicRequest) string {
	if req == nil {
		return "openai"
	}
	if req.Raw.Body != nil {
		if protocol, _ := req.Raw.Body["protocol"].(string); strings.TrimSpace(protocol) != "" {
			return strings.TrimSpace(protocol)
		}
		return "openai"
	}
	if protocol := strings.TrimSpace(req.Protocol); protocol != "" {
		return protocol
	}
	return "openai"
}

func (s GatewayService) buildGatewayResponse(req *botprotocol.ShemicRequest, selected selectedTarget, result callResult) *GatewayResponse {
	return &GatewayResponse{
		RequestID:  req.RequestID,
		Mode:       req.Mode,
		Protocol:   req.Protocol,
		Power:      selected.Power.Key,
		Target:     selected.Service.Name,
		Provider:   selected.Provider.Name,
		Account:    selected.Account.Name,
		NativeName: result.ServiceAPI,
		Data:       result.Data,
		Call: map[string]any{
			"url":     result.NativeRequest.URL,
			"method":  result.NativeRequest.Method,
			"headers": maskDebugHeaders(result.NativeRequest.Headers),
			"body":    result.NativeRequest.Body,
		},
		Log:      result.Log,
		Attempts: result.Attempts,
	}
}

func maskDebugHeaders(headers map[string]string) map[string]string {
	result := make(map[string]string, len(headers))
	for key, value := range headers {
		if isSecretHeader(key) {
			result[key] = "***"
			continue
		}
		result[key] = value
	}
	return result
}

func isSecretHeader(key string) bool {
	switch strings.ToLower(strings.TrimSpace(key)) {
	case "authorization", "x-api-key", "api-key", "openai-api-key":
		return true
	default:
		return false
	}
}

func resolveMode(raw GatewayRequest) (string, error) {
	mode, _ := raw.Body["mode"].(string)
	mode = strings.ToLower(strings.TrimSpace(mode))
	if mode == "" && strings.HasPrefix(strings.TrimSpace(raw.Path), "/proxy/") {
		mode = ModeProxy
	}
	if mode == "" {
		return ModeNormalize, nil
	}
	switch mode {
	case ModeNormalize, ModeProxy:
		return mode, nil
	default:
		return "", fmt.Errorf("不支持的 Energon mode: %s", mode)
	}
}

func resolveRequestID(raw GatewayRequest) string {
	if raw.RequestID != "" {
		return raw.RequestID
	}
	if raw.Headers != nil {
		if value := strings.TrimSpace(raw.Headers["X-Request-Id"]); value != "" {
			return value
		}
		if value := strings.TrimSpace(raw.Headers["X-Request-ID"]); value != "" {
			return value
		}
	}
	return uuid.NewString()
}

func resolveRawPath(raw GatewayRequest, mode string) string {
	if value, _ := raw.Body["path"].(string); strings.TrimSpace(value) != "" {
		return strings.TrimSpace(value)
	}
	if mode == ModeProxy && strings.HasPrefix(strings.TrimSpace(raw.Path), "/proxy/") {
		return strings.TrimSpace(raw.Path)
	}
	return ""
}

func resolveHost(raw GatewayRequest) string {
	if value, _ := raw.Body["host"].(string); strings.TrimSpace(value) != "" {
		return strings.TrimSpace(value)
	}
	return strings.TrimSpace(raw.Host)
}

func detectProtocol(raw GatewayRequest) string {
	if protocol, _ := raw.Body["protocol"].(string); strings.TrimSpace(protocol) != "" {
		return strings.ToLower(strings.TrimSpace(protocol))
	}
	return "openai"
}

func resolveProxyPower(raw GatewayRequest) string {
	if power, _ := raw.Body["power"].(string); strings.TrimSpace(power) != "" {
		return strings.TrimSpace(power)
	}
	if name, _ := raw.Body["name"].(string); strings.TrimSpace(name) != "" {
		return strings.TrimSpace(name)
	}
	if model, _ := raw.Body["model"].(string); strings.TrimSpace(model) != "" {
		return strings.TrimSpace(model)
	}
	return DefaultProxyPower
}
