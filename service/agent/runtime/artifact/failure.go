package artifact

import (
	"encoding/json"
	"errors"
	"strings"

	runtimeprovider "github.com/dever-package/bot/service/agent/runtime/tool/provider"
	botprotocol "github.com/dever-package/bot/service/energon/protocol"
)

const videoPrivacyFailureMessage = "参考图片被视频服务判定可能包含真人，当前模型不接受这类外部图片。请重新生成可用于视频的虚拟人物图片，或改用不含可识别真人面孔的参考图。"

type generationFailure struct {
	message   string
	permanent bool
}

func classifyGenerationFailure(kind, detail string) generationFailure {
	if strings.ToLower(strings.TrimSpace(kind)) != "video" {
		return generationFailure{}
	}
	// 来源任务边界将原始响应持久化为 body= JSON；只读错误码，不能把
	// message 中的任意自然语言或原始地址作为用户提示、重试决策。
	_, body, found := strings.Cut(detail, "body=")
	if !found {
		return generationFailure{}
	}
	var response struct {
		Error struct {
			Code string `json:"code"`
		} `json:"error"`
	}
	if json.Unmarshal([]byte(body), &response) != nil {
		return generationFailure{}
	}
	switch response.Error.Code {
	case "InputImageSensitiveContentDetected.PrivacyInformation":
		return generationFailure{
			message:   videoPrivacyFailureMessage,
			permanent: true,
		}
	default:
		return generationFailure{}
	}
}

func generationFailureCode(err error) string {
	if botprotocol.PreventsReplay(err) {
		return ""
	}
	var inputFailure *botprotocol.InputValidationError
	var toolInputFailure *runtimeprovider.MediaToolInputError
	if errors.As(err, &inputFailure) || errors.As(err, &toolInputFailure) {
		return botprotocol.InputValidationFailureCode
	}
	return ""
}

func shouldRetryGeneration(kind string, err error, attempt int) bool {
	return attempt < artifactJobMaxAttempts &&
		!botprotocol.PreventsReplay(err) && generationFailureCode(err) == "" &&
		!classifyGenerationFailure(kind, err.Error()).permanent
}
