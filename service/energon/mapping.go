package energon

import (
	"context"

	botinput "my/package/bot/service/energon/input"
	botprotocol "my/package/bot/service/energon/protocol"
)

func (s GatewayService) buildMappedInput(
	ctx context.Context,
	req *botprotocol.ShemicRequest,
	selected selectedTarget,
) (botprotocol.MappedInput, error) {
	return botinput.BuildMapped(ctx, s.repo, req, botinput.Target{
		PowerID:   selected.Power.ID,
		ServiceID: selected.Service.ID,
	})
}
