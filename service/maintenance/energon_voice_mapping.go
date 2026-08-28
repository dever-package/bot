package maintenance

import (
	"context"
	"fmt"

	energonmodel "github.com/dever-package/bot/model/energon"
)

// EnsureEnergonVoiceOptionMappings removes voice options that have no
// provider-native value from existing built-in speech services.
func EnsureEnergonVoiceOptionMappings(ctx context.Context) (err error) {
	defer func() {
		if recovered := recover(); recovered != nil {
			err = fmt.Errorf("升级内置语音音色配置失败: %v", recovered)
		}
	}()

	ctx = normalizeContext(ctx)
	voice := energonmodel.NewParamModel().Find(ctx, map[string]any{
		"key": "voice",
	})
	if voice == nil {
		return fmt.Errorf("内置音色参数尚未初始化")
	}
	if energonmodel.NewServiceModel().Find(ctx, map[string]any{
		"id": energonmodel.ServiceDoubaoAudioID,
	}) == nil {
		return fmt.Errorf("内置语音服务尚未初始化")
	}

	upsertBuiltinServiceParam(ctx, energonmodel.ServiceDoubaoAudioID, builtinServiceParamSpec{
		ParamID:   voice.ID,
		ParamRule: energonmodel.ServiceParamRuleOption,
		Key:       "voice",
		Name:      "音色",
		Mapping:   energonmodel.DoubaoVoiceMapping,
		Sort:      100,
	})
	return nil
}
