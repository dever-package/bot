package protocol

const (
	InputValidationFailureCode    = "invalid_power_input"
	InputValidationFailureMessage = "生成参数与能力来源不兼容，请调整参数或检查来源配置后重试。"
)

// InputValidationError 标识尚未调用外部来源的确定性参数/配置失败。
// 原因供内部诊断使用，公开提示只使用固定的安全文案。
type InputValidationError struct{ Cause error }

func (failure *InputValidationError) Error() string { return failure.Cause.Error() }
func (failure *InputValidationError) Unwrap() error { return failure.Cause }

func PublicInputFailureMessage(code string) string {
	if code == InputValidationFailureCode {
		return InputValidationFailureMessage
	}
	return ""
}
