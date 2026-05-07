package energon

import (
	"context"

	botprotocol "my/package/bot/service/energon/protocol"
)

func (s GatewayService) Request(ctx context.Context, raw GatewayRequest) botprotocol.Response {
	raw.RequestID = resolveRequestID(raw)
	raw.Body = botprotocol.NormalizeRequestBody(raw.Body)
	if botprotocol.IsStreamEnabled(raw.Body) {
		return s.StartStream(ctx, raw)
	}

	response, err := s.Handle(ctx, raw)
	if err != nil {
		return botprotocol.BuildErrorResponse(raw.RequestID, err)
	}

	return botprotocol.BuildSuccessResponse(response.RequestID, response.Data)
}
