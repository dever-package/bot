package energon

import "testing"

func TestResolvePowerParamSelection(t *testing.T) {
	tests := []struct {
		name             string
		sourceRule       int16
		requestedTarget  uint64
		resolvedTarget   uint64
		mode             powerParamConfigMode
		wantSelected     uint64
		wantMergeSources bool
		wantError        bool
	}{
		{
			name:             "automatic form merges all sources",
			sourceRule:       powerSourceRuleAuto,
			requestedTarget:  9,
			resolvedTarget:   9,
			mode:             powerParamConfigForm,
			wantMergeSources: true,
		},
		{
			name:           "manual form defaults to resolved first source",
			sourceRule:     powerSourceRulePick,
			resolvedTarget: 7,
			mode:           powerParamConfigForm,
			wantSelected:   7,
		},
		{
			name:             "headless manual call without explicit source merges all sources",
			sourceRule:       powerSourceRulePick,
			resolvedTarget:   7,
			mode:             powerParamConfigRuntime,
			wantMergeSources: true,
		},
		{
			name:            "headless manual call with explicit source stays pinned",
			sourceRule:      powerSourceRulePick,
			requestedTarget: 11,
			resolvedTarget:  11,
			mode:            powerParamConfigRuntime,
			wantSelected:    11,
		},
		{
			name:            "explicit unavailable source is rejected",
			sourceRule:      powerSourceRulePick,
			requestedTarget: 12,
			resolvedTarget:  7,
			mode:            powerParamConfigRuntime,
			wantError:       true,
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			selected, mergeSources, err := resolvePowerParamSelection(
				test.sourceRule,
				test.requestedTarget,
				test.resolvedTarget,
				test.mode,
			)
			if test.wantError {
				if err == nil {
					t.Fatal("expected unavailable explicit source error")
				}
				return
			}
			if err != nil {
				t.Fatalf("resolve selection: %v", err)
			}
			if selected != test.wantSelected {
				t.Fatalf("selected target = %d, want %d", selected, test.wantSelected)
			}
			if mergeSources != test.wantMergeSources {
				t.Fatalf("merge sources = %t, want %t", mergeSources, test.wantMergeSources)
			}
		})
	}
}
