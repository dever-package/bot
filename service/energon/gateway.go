package energon

import (
	"context"
	"fmt"
	"strings"
	"time"

	"github.com/google/uuid"

	botmodel "my/package/bot/model/energon"
	botprotocol "my/package/bot/service/energon/protocol"
	botadapters "my/package/bot/service/energon/protocol/adapters"
	botprovider "my/package/bot/service/energon/provider"
	bottask "my/package/bot/service/energon/task"
)

type GatewayService struct {
	repo          Repo
	dispatcher    Dispatcher
	accounts      AccountSelector
	logs          LogService
	streams       StreamService
	streamCancels *streamCancelRegistry
	tasks         bottask.Service
	client        botprovider.Client
	registry      *botprotocol.Registry
}

func NewGatewayService() GatewayService {
	return NewGatewayServiceWithClient(botprovider.NewHTTPClient(60 * time.Second))
}

func NewGatewayServiceWithClient(client botprovider.Client) GatewayService {
	repo := NewRepo()
	if client == nil {
		client = botprovider.NewHTTPClient(60 * time.Second)
	}
	service := GatewayService{
		repo:          repo,
		dispatcher:    NewDispatcher(),
		accounts:      NewAccountSelector(repo),
		logs:          NewLogService(),
		streams:       NewStreamService(),
		streamCancels: newStreamCancelRegistry(),
		client:        client,
		registry:      botadapters.DefaultRegistry(),
	}
	service.tasks = bottask.NewService(bottask.NewInlineQueue(bottask.HandlerFunc(func(ctx context.Context, job bottask.Job) error {
		return service.handleStreamJob(ctx, job)
	}), streamWorkerTimeout))
	return service
}

func (s GatewayService) Handle(ctx context.Context, raw GatewayRequest) (*GatewayResponse, error) {
	if raw.Body == nil {
		raw.Body = map[string]any{}
	}
	mode, err := resolveMode(raw)
	if err != nil {
		return nil, err
	}
	raw.RequestID = resolveRequestID(raw)
	raw.Path = resolveRawPath(raw, mode)

	switch mode {
	case ModeProxy:
		req := &botprotocol.ShemicRequest{
			RequestID: raw.RequestID,
			Mode:      ModeProxy,
			Protocol:  detectProtocol(raw),
			Kind:      "proxy.protocol",
			Name:      resolveProxyPower(raw),
			Raw:       buildRawProtocolRequest(raw, mode),
		}
		return s.handleProxy(ctx, req)
	default:
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
		return s.handleNormalize(ctx, req)
	}
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
	account, err := s.accounts.Select(ctx, provider)
	if err != nil {
		return selectedTarget{}, err
	}
	return selectedTarget{
		Provider:    provider,
		Account:     account,
		Power:       power,
		PowerTarget: target,
		Service:     service,
	}, nil
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
