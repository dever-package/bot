package energon

import (
	"testing"

	botmodel "github.com/dever-package/bot/model/energon"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

func TestLimitsForServiceUsesFallbacks(t *testing.T) {
	limits, err := limitsForService(botmodel.Service{ID: 7, Name: "fallback"})
	if err != nil {
		t.Fatalf("limitsForService returned error: %v", err)
	}
	if limits.ContextWindowTokens != DefaultModelContextWindowTokens ||
		limits.MaxOutputTokens != DefaultModelMaxOutputTokens || !limits.UsedFallback {
		t.Fatalf("unexpected fallback limits: %#v", limits)
	}
}

func TestLimitsForServiceRejectsInvalidConfiguredRange(t *testing.T) {
	_, err := limitsForService(botmodel.Service{
		Name:                "invalid",
		ContextWindowTokens: 8000,
		MaxOutputTokens:     8000,
	})
	if err == nil {
		t.Fatal("max output equal to context window should fail")
	}
}

func TestWithServiceOutputLimitClampsWithoutMutatingRequest(t *testing.T) {
	req := &botprotocol.ShemicRequest{
		Options: map[string]any{"max_tokens": 12000, "stream": true},
		Raw: botprotocol.RawRequest{
			Body: map[string]any{"options": map[string]any{"max_tokens": 12000, "stream": true}},
		},
	}
	clamped := withServiceOutputLimit(req, botmodel.Service{MaxOutputTokens: 8000})
	if clamped == req {
		t.Fatal("clamping should return an isolated request copy")
	}
	if got := clamped.Options["max_tokens"]; got != 8000 {
		t.Fatalf("clamped max_tokens = %v, want 8000", got)
	}
	if got := req.Options["max_tokens"]; got != 12000 {
		t.Fatalf("original request was mutated: max_tokens=%v", got)
	}
	rawOptions, _ := clamped.Raw.Body["options"].(map[string]any)
	if got := rawOptions["max_tokens"]; got != 8000 {
		t.Fatalf("raw body max_tokens = %v, want 8000", got)
	}
}

func TestWithServiceOutputLimitKeepsImplicitProviderDefault(t *testing.T) {
	req := &botprotocol.ShemicRequest{Options: map[string]any{"stream": true}}
	if got := withServiceOutputLimit(req, botmodel.Service{MaxOutputTokens: 8000}); got != req {
		t.Fatal("request without explicit max_tokens should remain unchanged")
	}
}
